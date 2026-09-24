// ============================================================================
//  WEBUI ENGINE v2 — link charactersDB codenames to their namesArray block
// ============================================================================
//
//    node scripts/webui/tools/webui2-names.js            report
//    node scripts/webui/tools/webui2-names.js --apply    write the additions
//    node scripts/webui/tools/webui2-names.js --warn     only the problems
//    node scripts/webui/tools/webui2-names.js --full     no truncation
//
//  THE PROBLEM
//  -----------
//  A charactersDB entry is reached by its codename. A namesArray block is
//  reached by any name in it. Nothing connects the two unless a name in the
//  block happens to spell the codename — so `kanojoNano, default` resolves to
//  nothing while `nano, default` finds the wrong Nano.
//
//  Retiring aliasDB's old `aliasArray` exposed this rather than causing it: that
//  array was hand-linking exactly the characters that got tested with.
//
//  THE THREE TESTS — Noodle's, in his order
//  ----------------------------------------
//  For `.kanojoNano; eiai nano, kimi no koto ga …`:
//
//    A  the codename itself        `kanojonano` in namesArray?      no match
//    B  the entry's FIRST tag      `eiai nano`, and it is unique
//                                  across charactersDB, so it is
//                                  probably her name                -> `eiai nano (100 kanojo)`
//    C  strip a brandArray brand   `kanojo` is a brand, so search
//       from the codename          for `nano`                       -> `eiai nano (100 kanojo)`
//
//  Two tests agree and no test disagrees, so the link is certain.
//
//  WHAT GETS ADDED to the matched block
//  ------------------------------------
//    - the exact codename                              `kanojonano`
//    - if a brand was stripped, the remainder DOTTED   `.nano`
//      ...unless the bare form is already there, which makes it redundant —
//      `nano` is already an alias of hers, so `.nano` is not added.
//
//  WARNS on the two cases that cannot be resolved mechanically: an entry with
//  NO block at all, and an entry whose tests point at MORE THAN ONE block.
//
//  Reads charactersDB only. The import is not hand-curated and its codenames
//  already are their canonical tags.
// ============================================================================

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const here = path.join(__dirname, "..");
const args = process.argv.slice(2);
const has = f => args.indexOf(f) !== -1;
const apply = has("--apply");
const warnOnly = has("--warn");
const full = has("--full");

const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);

const lib = path.join(here, "libraries");
const webuiSrc = fs.readFileSync(path.join(here, "webui.js"), "utf8");
const listMatch = webuiSrc.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/);
for (const file of listMatch[1].match(/"([^"]+)"/g).map(q => q.slice(1, -1))) {
    vm.runInContext(fs.readFileSync(path.join(lib, file), "utf8"), sandbox, { filename: file });
}
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) {
    vm.runInContext(fs.readFileSync(path.join(here, file), "utf8"), sandbox, { filename: file });
}
vm.runInContext("v2EnsureDictionaries()", sandbox);

const aliasPath = path.join(lib, "aliasDB.js");
const handWritten = new Set(
    (fs.readFileSync(path.join(lib, "charactersDB.js"), "utf8")
       .match(/^\.[A-Za-z0-9_-]+(?=;)/gm) || []).map(s => s.toLowerCase()));

// ---------------------------------------------------------------------------
//  Indexes
// ---------------------------------------------------------------------------

const blocks = sandbox.cleanedNamesArray || [];
// every name -> the block that owns it. A name in two blocks is itself a data
// fault, so the first owner wins and the collision is counted.
const nameToBlock = new Map();
let nameCollisions = 0;
for (const b of blocks) {
    if (!b || !b.canonical) { continue; }
    for (const n of [b.canonical].concat(b.aliases || [])) {
        const k = String(n).trim().toLowerCase();
        if (!k) { continue; }
        if (nameToBlock.has(k)) { nameCollisions++; continue; }
        nameToBlock.set(k, b);
    }
}

// brandArray arrives already split, and its entries carry a leading dot.
const brandRaw = Array.isArray(sandbox.brandArray)
    ? sandbox.brandArray
    : String(sandbox.brandArray || "").split("\n");
const brands = brandRaw
    .map(b => String(b).trim().toLowerCase().replace(/^\./, ""))
    .filter(Boolean)
    // longest first, so `.pokemon` is tried before `.poke`
    .sort((a, b) => b.length - a.length);

const characters = (sandbox.cleanedCharacterArray || [])
    .filter(e => e && e.codename && handWritten.has(String(e.codename).toLowerCase()));

const firstTagOf = entry => {
    const tags = sandbox.splitStoredPrompt(entry.prompt || "");
    return tags.length ? String(tags[0].text).trim().toLowerCase() : null;
};

// How many charactersDB entries lead with each first tag. Test B only trusts a
// first tag that is unique — a shared one names nobody.
const firstTagCount = new Map();
for (const e of characters) {
    const t = firstTagOf(e);
    if (t) { firstTagCount.set(t, (firstTagCount.get(t) || 0) + 1); }
}

// ---------------------------------------------------------------------------
//  The three tests
// ---------------------------------------------------------------------------

// `fur`, `fleshy` and `syrup` sit in brandArray beside the real franchises, but
// they are FORMS rather than franchises, and the name they strip down to is
// owned by the stem system. Stripping `.fur` off `furmayor` gives `mayor`, and
// binding `.mayor` to the fur entry would make `.mayor, not furry` return the
// furry form — the stem exists precisely so that name stays form-agnostic.
//
// So test C is skipped for these three. Test A still adds the exact codename,
// which is what makes `furmayor` reachable; only the dotted remainder is held
// back, and `basicShortcutArray` already owns it.
const FORM_BRANDS = new Set(["fur", "fleshy", "syrup"]);

function stripBrand(codename) {
    for (const b of brands) {
        if (codename.length > b.length && codename.indexOf(b) === 0) {
            if (FORM_BRANDS.has(b)) { return null; }
            return { brand: b, rest: codename.slice(b.length) };
        }
    }
    return null;
}

function examine(entry) {
    const dotted = String(entry.codename).toLowerCase();
    const bare = dotted.replace(/^\./, "");
    const hits = [];

    // A — the codename itself
    const a = nameToBlock.get(bare);
    if (a) { hits.push({ test: "A codename", block: a }); }

    // B — the first tag, but only if it names exactly one character
    const first = firstTagOf(entry);
    if (first && firstTagCount.get(first) === 1) {
        const b = nameToBlock.get(first);
        if (b) { hits.push({ test: "B first tag", block: b }); }
    }

    // C — the codename with a brand stripped
    const split = stripBrand(bare);
    if (split) {
        const c = nameToBlock.get(split.rest);
        if (c) { hits.push({ test: "C brand-stripped", block: c }); }
    }

    const distinct = [];
    for (const h of hits) {
        if (distinct.indexOf(h.block) === -1) { distinct.push(h.block); }
    }

    // TEST B WINS a disagreement. Noodle's ruling 2026-08-17, after reading every
    // conflicting case: the first tag is her name, and brand-stripping is the
    // weakest of the three — `.kanojomei` strips to `mei` and lands on
    // Overwatch's Mei, `.ffgarnet` strips to `garnet` and lands on Syrup Town's.
    //
    // The conflict is still REPORTED rather than silently resolved, because the
    // rule is right in general and wrong in particular cases, and those are
    // fixed by hand before applying.
    var conflict = null;
    if (distinct.length > 1) {
        var byB = hits.filter(function (h) { return h.test.charAt(0) === "B"; });
        if (byB.length) {
            conflict = { chosen: byB[0].block, hits: hits };
            return { bare: bare, dotted: dotted, first: first, split: split,
                     hits: hits, distinct: [byB[0].block], conflict: conflict };
        }
    }
    return { bare, dotted, first, split, hits, distinct, conflict: null };
}

// What would be added to the block this entry links to.
function additionsFor(found) {
    const block = found.distinct[0];
    const present = new Set([block.canonical].concat(block.aliases || [])
        .map(x => String(x).trim().toLowerCase()));
    const add = [];
    if (!present.has(found.bare)) { add.push(found.bare); }
    if (found.split) {
        const dottedRest = "." + found.split.rest;
        // The dotted form is only worth adding when the bare one is NOT already
        // an alias — `nano` being present makes `.nano` redundant, because the
        // dotted form is derived from a registered bare name anyway.
        if (!present.has(found.split.rest) && !present.has(dottedRest)) {
            add.push(dottedRest);
        }
    }
    return { block, add };
}

// ---------------------------------------------------------------------------
//  Run
// ---------------------------------------------------------------------------

const linked = [], orphans = [], ambiguous = [], alreadyFine = [], resolved = [];
for (const e of characters) {
    const found = examine(e);
    if (found.distinct.length === 0) { orphans.push({ e, found }); continue; }
    if (found.distinct.length > 1)  { ambiguous.push({ e, found }); continue; }
    if (found.conflict) { resolved.push({ e, found }); }
    const plan = additionsFor(found);
    if (!plan.add.length) { alreadyFine.push({ e, found, plan }); continue; }
    linked.push({ e, found, plan });
}

console.log("\n" + "=".repeat(78));
console.log("  charactersDB -> namesArray");
console.log("=".repeat(78) + "\n");
console.log("  " + characters.length + " hand-written entries · " + blocks.length + " namesArray blocks");
if (nameCollisions) {
    console.log("  " + nameCollisions + " names appear in more than one block (first owner wins here)");
}
console.log("");
console.log("  " + linked.length      + "  would gain an alias");
console.log("  " + alreadyFine.length + "  already linked, nothing to add");
console.log("  " + ambiguous.length   + "  AMBIGUOUS — tests point at different blocks");
console.log("  " + orphans.length     + "  NO BLOCK AT ALL");

function show(list, cap) { return (full || list.length <= cap) ? list : list.slice(0, cap); }

if (ambiguous.length) {
    console.log("\n" + "-".repeat(78));
    console.log("  AMBIGUOUS — needs a human. Nothing is written for these.");
    console.log("-".repeat(78) + "\n");
    for (const { e, found } of show(ambiguous, 40)) {
        console.log("  " + found.dotted);
        for (const h of found.hits) {
            console.log("      " + h.test.padEnd(18) + " -> " + h.block.canonical);
        }
    }
    if (!full && ambiguous.length > 40) { console.log("  …and " + (ambiguous.length - 40) + " more"); }
}

if (resolved.length) {
    console.log("\n" + "-".repeat(78));
    console.log("  B BEAT C — reported, not hidden. Fix any where C was right BEFORE --apply.");
    console.log("-".repeat(78) + "\n");
    for (const { found } of show(resolved, 40)) {
        console.log("  " + found.dotted);
        for (const h of found.hits) {
            const mark = h.block === found.distinct[0] ? "USED " : "     ";
            console.log("      " + mark + h.test.padEnd(18) + " -> " + h.block.canonical);
        }
    }
    if (!full && resolved.length > 40) { console.log("  …and " + (resolved.length - 40) + " more"); }
}

if (orphans.length) {
    console.log("\n" + "-".repeat(78));
    console.log("  NO BLOCK — each gets a NEW one under `- ==== none ====`, holding only");
    console.log("  its bare codename. namesArray derives the dotted form, so `femboyschool`");
    console.log("  and `.femboyschool` both reach her and she claims no other name.");
    console.log("-".repeat(78) + "\n");
    for (const { found } of show(orphans, 60)) {
        console.log("  " + found.bare);
    }
    if (!full && orphans.length > 60) { console.log("  …and " + (orphans.length - 60) + " more"); }
}

if (!warnOnly && linked.length) {
    console.log("\n" + "-".repeat(78));
    console.log("  WOULD ADD");
    console.log("-".repeat(78) + "\n");
    for (const { found, plan } of show(linked, 80)) {
        console.log("  " + plan.block.canonical.padEnd(42) + "+ " + plan.add.join(", ") +
                    "   [" + found.hits.map(h => h.test.charAt(0)).join("") + "]");
    }
    if (!full && linked.length > 80) { console.log("  …and " + (linked.length - 80) + " more (--full)"); }
}

// ---------------------------------------------------------------------------
//  Write
// ---------------------------------------------------------------------------

if (!linked.length && !orphans.length) {
    console.log("\n  Nothing to add.\n");
} else if (!apply) {
    console.log("\n  DRY RUN — " + linked.length + " blocks would gain aliases, " +
                orphans.length + " new blocks would be created. --apply to write.\n");
} else {
    const raw = fs.readFileSync(aliasPath, "utf8");
    const eol = raw.indexOf("\r\n") !== -1 ? "\r\n" : "\n";
    const lines = raw.split(/\r?\n/);

    // Where each block starts: the line equal to its canonical. Blocks are
    // separated by blank lines, so the insert point is the last non-blank line
    // of the run that begins there.
    const wanted = new Map();
    for (const { plan } of linked) {
        const key = plan.block.canonical.trim().toLowerCase();
        if (!wanted.has(key)) { wanted.set(key, []); }
        for (const a of plan.add) { wanted.get(key).push(a); }
    }
    // Every canonical in the file, so a block START can be told from an ALIAS
    // line without re-deriving the parser.
    //
    // The `- ==== unsorted ====` section is one name per line with no blank
    // between them, so each line there is its own block. An earlier version
    // required a blank line above the canonical and therefore could not find any
    // of them — it reported 4 unlocatable and refused to write, which is the
    // guard doing its job rather than a near miss.
    const allCanonical = new Set(blocks.map(b => String(b.canonical).trim().toLowerCase()));
    const isBlockStart = i => {
        if (i === 0) { return true; }
        const prev = lines[i - 1].trim();
        if (prev === "" || prev.charAt(0) === "-") { return true; }
        // A run of canonicals is a run of one-line blocks.
        return allCanonical.has(prev.toLowerCase());
    };

    const inserts = new Map();   // line index -> lines to insert AFTER it
    let matched = 0;
    for (let i = 0; i < lines.length; i++) {
        const key = lines[i].trim().toLowerCase();
        if (!wanted.has(key)) { continue; }
        if (!isBlockStart(i)) { continue; }
        // The block ends at the blank line, or at the next canonical when this
        // is a one-line block in a run.
        let end = i;
        while (end + 1 < lines.length &&
               lines[end + 1].trim() !== "" &&
               !allCanonical.has(lines[end + 1].trim().toLowerCase())) { end++; }
        inserts.set(end, wanted.get(key));
        wanted.delete(key);
        matched++;
    }
    if (wanted.size) {
        console.log("\n  WARNING: " + wanted.size + " blocks could not be located in the file.");
        console.log("  Nothing written.\n");
        for (const k of [...wanted.keys()].slice(0, 10)) { console.log("    " + k); }
        process.exit(1);
    }
    // Orphans get a NEW block each, under `- ==== none ====` so they inherit no
    // franchise. Each is separated by a blank line — consecutive lines would
    // merge into ONE block and make every orphan an alias of the first, which is
    // exactly what has already happened to `cerberus / fae / succubus` there.
    let noneAt = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().toLowerCase() === "- ==== none ====") { noneAt = i; break; }
    }
    if (orphans.length && noneAt === -1) {
        console.log("\n  WARNING: no `- ==== none ====` section found. Nothing written.\n");
        process.exit(1);
    }
    const orphanLines = [];
    for (const { found } of orphans) {
        orphanLines.push("");
        orphanLines.push(found.bare);
    }

    const out = [];
    for (let i = 0; i < lines.length; i++) {
        out.push(lines[i]);
        if (inserts.has(i)) { for (const a of inserts.get(i)) { out.push(a); } }
        if (i === noneAt && orphanLines.length) { for (const a of orphanLines) { out.push(a); } }
    }
    const backupDir = path.join(here, "_backups");
    if (!fs.existsSync(backupDir)) { fs.mkdirSync(backupDir, { recursive: true }); }
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backup = path.join(backupDir, "aliasDB." + stamp + ".names.js");
    fs.writeFileSync(backup, raw, "utf8");
    fs.writeFileSync(aliasPath, out.join(eol), "utf8");
    console.log("\n  WROTE aliases into " + matched + " blocks.");
    console.log("  Backup: scripts/webui/_backups/" + path.basename(backup) + "\n");
}
