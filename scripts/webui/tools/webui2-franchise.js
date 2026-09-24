// ============================================================================
//  WEBUI ENGINE v2 — animadex franchise import
// ============================================================================
//
//    node scripts/webui/tools/webui2-franchise.js           report
//    node scripts/webui/tools/webui2-franchise.js --apply   write
//    node scripts/webui/tools/webui2-franchise.js --full    no truncation
//
//  WHAT IT IS FOR
//  --------------
//  Three sections of namesArray are loose piles rather than franchise blocks:
//  `generic terms` (1783), `unsorted` (44) and `none`. animadex.csv is good at
//  exactly the thing they are missing — it keeps the canonical character tag and
//  the franchise in separate columns — so it can say where most of that pile
//  belongs.
//
//  THE RULES, Noodle's, in his numbering
//  -------------------------------------
//   1  parse animadex.csv, underscores read as spaces
//   2  check each canonical tag (column 1) against namesArray
//   3  if animadex's canonical is an ALIAS under a different canonical here,
//      WARN — that is a disagreement about who owns the name, not a move
//   4  if a loose section holds an animadex canonical, move it into a section
//      named by that character's franchise
//   5  sweep up the bare shortcuts webui2-names.js left behind and move them
//      into the new section too
//   6  generate the alias forms: franchise-qualified, the two name parts
//      swapped, and each single part franchise-qualified
//   7  loose entries that are FRANCHISE names rather than characters move to
//      the top of `unsorted`, ready to be sorted by hand
//
//  Worked example. `fujiwara_chika` / `kaguya-sama_wa_kokurasetai_~…~` gives:
//
//      - ==== kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~ ====
//
//      fujiwara chika
//      fujiwara chika (kaguya-sama …)
//      chika fujiwara
//      chika fujiwara (kaguya-sama …)
//      chika (kaguya-sama …)
//      fujiwara (kaguya-sama …)
//      fujiwara                     <- rule 5, swept out of `generic terms`
//
//  A BARE SINGLE PART IS NEVER GENERATED. `fujiwara no mokou` is already in this
//  file, so a bare `fujiwara` makes that name ambiguous. The one in the example
//  above is not created here — it already existed and is being moved.
// ============================================================================

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const here = path.join(__dirname, "..");
const args = process.argv.slice(2);
const has = f => args.indexOf(f) !== -1;
const apply = has("--apply");
const full = has("--full");

const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);
const lib = path.join(here, "libraries");
const webuiSrc = fs.readFileSync(path.join(here, "webui.js"), "utf8");
for (const f of webuiSrc.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1]
        .match(/"([^"]+)"/g).map(q => q.slice(1, -1))) {
    vm.runInContext(fs.readFileSync(path.join(lib, f), "utf8"), sandbox, { filename: f });
}
for (const f of ["webui.js", "webui2-categories.js", "webui2.js"]) {
    vm.runInContext(fs.readFileSync(path.join(here, f), "utf8"), sandbox, { filename: f });
}
vm.runInContext("v2EnsureDictionaries()", sandbox);

// ---------------------------------------------------------------------------
//  1 · animadex
// ---------------------------------------------------------------------------
//  Hand-rolled CSV read: the file has quoted fields containing commas, but only
//  the first two columns are wanted and neither is ever quoted.

const csvPath = path.join(here, "..", "..", "!designDocs", "animadex", "animadex.csv");
const clean = s => String(s).replace(/_/g, " ").trim().toLowerCase();
const animadex = new Map();          // canonical -> franchise
{
    const raw = fs.readFileSync(csvPath, "utf8").split(/\r?\n/);
    for (let i = 1; i < raw.length; i++) {
        const line = raw[i];
        if (!line) { continue; }
        const a = line.indexOf(",");
        if (a <= 0) { continue; }
        const b = line.indexOf(",", a + 1);
        if (b <= a) { continue; }
        const character = clean(line.slice(0, a));
        const copyright = clean(line.slice(a + 1, b));
        if (!character || !copyright) { continue; }
        if (!animadex.has(character)) { animadex.set(character, copyright); }
    }
}
const franchiseSet = new Set(animadex.values());

// ---------------------------------------------------------------------------
//  2 · namesArray as it stands
// ---------------------------------------------------------------------------

const blocks = sandbox.cleanedNamesArray || [];
const canonicalOf = new Map();       // any name -> the canonical that owns it
for (const b of blocks) {
    if (!b || !b.canonical) { continue; }
    const c = String(b.canonical).trim().toLowerCase();
    for (const n of [b.canonical].concat(b.aliases || [])) {
        const k = String(n).trim().toLowerCase();
        if (k && !canonicalOf.has(k)) { canonicalOf.set(k, c); }
    }
}

const aliasPath = path.join(lib, "aliasDB.js");
const rawAlias = fs.readFileSync(aliasPath, "utf8");
const eol = rawAlias.indexOf("\r\n") !== -1 ? "\r\n" : "\n";
const lines = rawAlias.split(/\r?\n/);

const LOOSE = ["unsorted", "none", "generic terms"];
const sectionAt = new Map();         // section name -> {start, end}
{
    let current = null;
    for (let i = 0; i < lines.length; i++) {
        const m = lines[i].trim().match(/^- ==== (.+?) ====$/);
        if (!m) { continue; }
        if (current) { sectionAt.get(current).end = i - 1; }
        current = m[1].trim().toLowerCase();
        sectionAt.set(current, { start: i, end: lines.length - 1 });
    }
}
const looseLines = new Map();        // lowercased text -> line index
for (const name of LOOSE) {
    const s = sectionAt.get(name);
    if (!s) { continue; }
    for (let i = s.start + 1; i <= s.end; i++) {
        const t = lines[i].trim();
        if (!t || t.charAt(0) === "-" || t.indexOf("`") !== -1) { continue; }
        if (!looseLines.has(t.toLowerCase())) { looseLines.set(t.toLowerCase(), i); }
    }
}

// ---------------------------------------------------------------------------
//  Alias generation — rule 6
// ---------------------------------------------------------------------------

function nameParts(canonical) {
    // "any parenthesis shenanigans" removed before counting parts
    const bare = canonical.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
    return bare ? bare.split(" ") : [];
}

function buildAliases(canonical, franchise) {
    const out = [];
    const push = v => { const t = v.trim(); if (t && out.indexOf(t) === -1) { out.push(t); } };
    const hasParen = canonical.indexOf("(") !== -1;
    push(canonical);
    if (!hasParen) { push(canonical + " (" + franchise + ")"); }
    const parts = nameParts(canonical);
    if (parts.length === 2) {
        const swapped = parts[1] + " " + parts[0];
        push(swapped);
        push(swapped + " (" + franchise + ")");
        push(parts[1] + " (" + franchise + ")");
        push(parts[0] + " (" + franchise + ")");
    }
    return out;
}

// ---------------------------------------------------------------------------
//  Match the loose piles against animadex
// ---------------------------------------------------------------------------

const moves = new Map();     // franchise -> [{canonical, aliases, sweeps, from}]
const warnings = [];         // rule 3
const franchiseStrays = [];  // rule 7
const takenLines = new Set();

for (const [text, idx] of looseLines) {
    const franchise = animadex.get(text);
    if (!franchise) {
        // rule 7 — is this loose entry a FRANCHISE rather than a character?
        if (franchiseSet.has(text)) { franchiseStrays.push({ text, idx }); }
        continue;
    }
    // rule 3 — does something else already claim this name as an alias?
    const owner = canonicalOf.get(text);
    if (owner && owner !== text) {
        warnings.push({ text, owner, franchise });
        continue;
    }
    const aliases = buildAliases(text, franchise);

    // rule 5 — sweep up bare shortcuts sitting loose that belong to her
    const sweeps = [];
    for (const p of nameParts(text)) {
        if (p === text) { continue; }
        if (!looseLines.has(p)) { continue; }
        if (animadex.has(p)) { continue; }        // a character in her own right
        if (franchiseSet.has(p)) { continue; }    // a franchise, rule 7 owns it
        const at = looseLines.get(p);
        if (takenLines.has(at)) { continue; }
        sweeps.push(p);
        takenLines.add(at);
    }

    if (!moves.has(franchise)) { moves.set(franchise, []); }
    moves.get(franchise).push({ canonical: text, aliases, sweeps, from: idx });
    takenLines.add(idx);
}

// ---------------------------------------------------------------------------
//  Report
// ---------------------------------------------------------------------------

let characterCount = 0, aliasCount = 0, sweepCount = 0;
for (const list of moves.values()) {
    for (const m of list) {
        characterCount++;
        aliasCount += m.aliases.length;
        sweepCount += m.sweeps.length;
    }
}
const existingSections = [...moves.keys()].filter(f => sectionAt.has(f));

console.log("\n" + "=".repeat(78));
console.log("  animadex franchise import");
console.log("=".repeat(78) + "\n");
console.log("  " + animadex.size + " animadex canonicals · " + franchiseSet.size + " franchises");
console.log("  " + looseLines.size + " loose entries across " + LOOSE.join(", ") + "\n");
console.log("  " + characterCount + "  characters would move into a franchise section");
console.log("  " + moves.size + "  franchise sections involved (" + existingSections.length + " already exist)");
console.log("  " + aliasCount + "  alias lines generated");
console.log("  " + sweepCount + "  loose shortcuts swept in (rule 5)");
console.log("  " + franchiseStrays.length + "  franchise names to lift to the top of `unsorted` (rule 7)");
console.log("  " + warnings.length + "  WARNINGS — name already owned by another canonical (rule 3)");

const show = (l, n) => (full || l.length <= n) ? l : l.slice(0, n);

if (warnings.length) {
    console.log("\n" + "-".repeat(78));
    console.log("  RULE 3 — animadex says this is a character, namesArray says it is");
    console.log("  someone else's alias. Not moved; needs a human.");
    console.log("-".repeat(78) + "\n");
    for (const w of show(warnings, 40)) {
        console.log("  " + w.text.padEnd(34) + "owned by  " + w.owner);
    }
    if (!full && warnings.length > 40) { console.log("  …and " + (warnings.length - 40) + " more"); }
}

console.log("\n" + "-".repeat(78));
console.log("  WOULD CREATE");
console.log("-".repeat(78));
let shown = 0;
for (const [franchise, list] of moves) {
    if (!full && shown >= 12) { break; }
    shown++;
    console.log("\n  - ==== " + franchise + " ====" + (sectionAt.has(franchise) ? "   (exists)" : "   (new)"));
    for (const m of list) {
        for (const a of m.aliases) { console.log("      " + a); }
        for (const s of m.sweeps) { console.log("      " + s + "   <- swept in"); }
    }
}
if (!full && moves.size > shown) { console.log("\n  …and " + (moves.size - shown) + " more sections (--full)"); }

if (franchiseStrays.length) {
    console.log("\n" + "-".repeat(78));
    console.log("  RULE 7 — franchise names, lifted to the top of `unsorted`");
    console.log("-".repeat(78) + "\n");
    console.log("  " + show(franchiseStrays, 40).map(f => f.text).join(", "));
}

// ---------------------------------------------------------------------------
//  Write
// ---------------------------------------------------------------------------

if (!characterCount && !franchiseStrays.length) {
    console.log("\n  Nothing to do.\n");
} else if (!apply) {
    console.log("\n  DRY RUN — --apply to write.\n");
} else {
    const drop = new Set(takenLines);
    for (const f of franchiseStrays) { drop.add(f.idx); }

    // Additions keyed by the section header line they belong under.
    const addUnder = new Map();
    const newSections = [];
    for (const [franchise, list] of moves) {
        const body = [];
        for (const m of list) {
            body.push("");
            for (const a of m.aliases) { body.push(a); }
            for (const s of m.sweeps) { body.push(s); }
        }
        if (sectionAt.has(franchise)) {
            const at = sectionAt.get(franchise).start;
            if (!addUnder.has(at)) { addUnder.set(at, []); }
            for (const b of body) { addUnder.get(at).push(b); }
        } else {
            newSections.push("");
            newSections.push("- ==== " + franchise + " ====");
            for (const b of body) { newSections.push(b); }
        }
    }
    const unsortedStart = sectionAt.has("unsorted") ? sectionAt.get("unsorted").start : -1;
    const strayLines = franchiseStrays.map(f => f.text);

    const out = [];
    for (let i = 0; i < lines.length; i++) {
        if (i === unsortedStart && newSections.length) {
            for (const l of newSections) { out.push(l); }
            out.push("");
        }
        if (drop.has(i)) { continue; }
        out.push(lines[i]);
        if (addUnder.has(i)) { for (const l of addUnder.get(i)) { out.push(l); } }
        // rule 7: franchise names go straight under the `unsorted` header
        if (i === unsortedStart && strayLines.length) {
            out.push("");
            for (const l of strayLines) { out.push(l); }
        }
    }

    const backupDir = path.join(here, "_backups");
    if (!fs.existsSync(backupDir)) { fs.mkdirSync(backupDir, { recursive: true }); }
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backup = path.join(backupDir, "aliasDB." + stamp + ".franchise.js");
    fs.writeFileSync(backup, rawAlias, "utf8");
    fs.writeFileSync(aliasPath, out.join(eol), "utf8");
    console.log("\n  WROTE " + characterCount + " characters into " + moves.size + " sections.");
    console.log("  " + drop.size + " loose lines removed, " + franchiseStrays.length + " franchises lifted.");
    console.log("  Backup: scripts/webui/_backups/" + path.basename(backup) + "\n");
}
