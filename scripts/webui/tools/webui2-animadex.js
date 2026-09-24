// ============================================================================
//  WEBUI ENGINE v2 — animadex survey
// ============================================================================
//
//    node --max-old-space-size=3072 scripts/webui/tools/webui2-animadex.js
//    node ... webui2-animadex.js --show 40        longer example lists
//    node ... webui2-animadex.js --json out.json  machine-readable
//
//  ANIMADEX-IMPORT.md's preparatory phase, step one: LIST EXISTING ERROR CASES.
//  Reads !designDocs/animadex/animadex.csv and reports what an import would do WITHOUT
//  importing anything. Nothing is written to any dictionary.
//
//  Every discard and every error case below is Noodle's, from the spec. They are
//  applied in the order the spec's review section says they have to run —
//  notably the 1girl+1boy discard BEFORE the 1girl->female rewrite, or every
//  candidate has already become `female, male` and the check finds nothing
//  (review item 5).
//
//  Review item 6 — the `(octopus)` case — is NOT a discard, and treating it as
//  one was this tool's own first bug: it threw away 215 good characters whose
//  paren was an alternate outfit. The danger was never importing the character,
//  it is spec rule (d) minting a franchise ALIAS from the paren. So the paren is
//  classified and the row imports either way; the class decides whether an alias
//  may be made from it. `categoriesOf` answers that directly now the matcher is
//  wired in — no 8 M set required.
// ============================================================================

const fs = require("fs");
const vm = require("vm");
const path = require("path");

// One up from tools/: `here` means the engine directory, which is what every
// path below is relative to.
const here = path.join(__dirname, "..");
const lib = path.join(here, "libraries");
const csvPath = path.join(here, "..", "..", "!designDocs", "animadex", "animadex.csv");

const args = process.argv.slice(2);
const showAt = args.indexOf("--show");
const SHOW = showAt === -1 ? 12 : Number(args[showAt + 1]);
const jsonAt = args.indexOf("--json");
const jsonPath = jsonAt === -1 ? null : args[jsonAt + 1];
const write = args.indexOf("--write") !== -1;
const limitAt = args.indexOf("--limit");
const LIMIT = limitAt === -1 ? Infinity : Number(args[limitAt + 1]);

// ---------------------------------------------------------------------------
//  The engine, for categoriesOf and the existing character index
// ---------------------------------------------------------------------------

const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);
const webuiSrc = fs.readFileSync(path.join(here, "webui.js"), "utf8");
for (const file of webuiSrc.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1]
        .match(/"([^"]+)"/g).map(q => q.slice(1, -1))) {
    // SKIP charactersDB2 — it is this tool's own output. Loading it makes the
    // shadow check see the previous run and discard those rows as "already
    // present", so every re-run shrank the import and the numbers never settled
    // (22,340 then 20,841 then 22,319 from an unchanged CSV).
    //
    // "already in charactersDB" is meant to mean HAND-WRITTEN, which is exactly
    // what leaving this file out gives.
    if (file === "charactersDB2.js") { continue; }
    vm.runInContext(fs.readFileSync(path.join(lib, file), "utf8"), sandbox, { filename: file });
}
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) {
    vm.runInContext(fs.readFileSync(path.join(here, file), "utf8"), sandbox, { filename: file });
}
console.log("Building the dictionaries...");
vm.runInContext("v2EnsureDictionaries()", sandbox);

const categoriesOf = sandbox.categoriesOf;
const canonicalAlias = sandbox.canonicalAlias;
const index = vm.runInContext("buildCharacterIndex()", sandbox);
const franchises = new Set((vm.runInContext("franchiseList", sandbox) || [])
                             .map(f => String(f).trim().toLowerCase()));

// ---------------------------------------------------------------------------
//  CSV
// ---------------------------------------------------------------------------
//  Hand-rolled rather than a dependency: the file is one table with quoted
//  fields and embedded commas, which is the whole of RFC 4180 that matters here.

function parseCSV(text) {
    const rows = [];
    let field = [], cur = "", quoted = false;
    const QUOTE = String.fromCharCode(34);
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (quoted) {
            if (c === QUOTE) {
                if (text[i + 1] === QUOTE) { cur += QUOTE; i++; } else { quoted = false; }
            } else { cur += c; }
        } else if (c === QUOTE) { quoted = true; }
        else if (c === ",") { field.push(cur); cur = ""; }
        else if (c === "\n") { field.push(cur); rows.push(field); field = []; cur = ""; }
        else if (c !== "\r") { cur += c; }
    }
    if (cur !== "" || field.length) { field.push(cur); rows.push(field); }
    return rows;
}

const rows = parseCSV(fs.readFileSync(csvPath, "utf8"));
const header = rows.shift().map(h => h.trim());
const col = {};
header.forEach((h, i) => { col[h] = i; });

// ---------------------------------------------------------------------------
//  Per the spec: underscores and backslashes go, for consistency
// ---------------------------------------------------------------------------

// The semicolon becomes a space rather than a reason to hold the row back.
// `steins;gate` is charactersDB's own field separator sitting inside a name, so
// `.upa (steins;gate)` used to split into a codename and a payload and the entry
// was unreachable. Thirty rows, all of them `steins;gate`, `chaos;head` or
// `chaos;child`, and Noodle's call was to substitute rather than review.
const clean = (t) => String(t == null ? "" : t)
    .replace(/\\/g, "").replace(/_/g, " ").replace(/;/g, " ")
    .replace(/\s+/g, " ").trim();

const splitTags = (t) => clean(t).split(",").map(x => x.trim()).filter(Boolean);

// The disambiguation parens of a canonical tag, in order.
const parensOf = (tag) => (String(tag).match(/\(([^)]*)\)/g) || [])
    .map(p => p.slice(1, -1).trim()).filter(Boolean);

// ---------------------------------------------------------------------------
//  Tag normalisation
// ---------------------------------------------------------------------------
//  Everything here is from the spec's "complex handling" list. Applied in this
//  order because two of them are conditional on what else is in the row.
//
//  ABOVE the survey on purpose. The first run put it below, so the survey
//  counted RAW tags while the write stored normalised ones — `1boy` is
//  categorised and its normalised form `male` was not, so the census said
//  nothing about the tag that actually reached the database. That census number
//  is the one used to decide whether an import is affordable, so it has to
//  measure the strings the import will really write.

const PURGE = new Set(["official alternate hairstyle", "official alternate costume"]);
const FLAT = { "animal": "feral", "eyewear": "glasses", "star (symbol)": "star",
               "pokemon (creature)": "pokemon", "lab coat": "labcoat" };

// The three that apply as a WORD inside a compound tag rather than only as a
// whole one: `black-framed eyewear` is the tag the first run left uncategorised.
//
// `animal` is deliberately NOT in this list even though it is in FLAT. As a
// whole tag it means the figure is one, and `feral` is right; as a word it is
// `animal ears`, `animal print`, `animal costume` — real tags that would become
// nonsense. Whole-tag only, and that is a decision rather than an oversight.
function replaceWord(text, word, replacement) {
    if (word === replacement) { return text; }
    return text.replace(new RegExp("(^|[^a-z0-9])" + word + "($|[^a-z0-9])", "g"),
                        (m, before, after) => before + replacement + after);
}

function normalise(tags) {
    const lower = tags.map(t => t.toLowerCase());
    const has = (t) => lower.indexOf(t) !== -1;
    // "replace headwear with helmet if helmet is already present at all,
    //  otherwise replace headwear with hat" — and the same shape for footwear.
    const headwear = has("helmet") ? "helmet" : "hat";
    const footwear = has("boots") ? "boots" : "shoes";

    const out = [];
    for (const raw of tags) {
        let t = raw.toLowerCase();
        if (PURGE.has(t)) { continue; }
        if (FLAT[t]) { t = FLAT[t]; }
        // The 1girl/1boy rewrite runs HERE, after the both-genders discard has
        // already had its say (review item 5).
        else if (t === "1girl") { t = "female"; }
        else if (t === "1boy") { t = "male"; }
        t = replaceWord(t, "headwear", headwear);
        t = replaceWord(t, "footwear", footwear);
        t = replaceWord(t, "eyewear", "glasses");
        // cleaningDB's own alias collapse, so an imported tag reads the way a
        // hand-written one would.
        t = canonicalAlias(t);
        if (t && out.indexOf(t) === -1) { out.push(t); }
    }
    return out;
}

// clothes* -> the outfit, everything else -> her. A tag with no category at all
// goes to BOTH: it stays in her prompt so it still does something today, and it
// is listed in the `- unknown;` marker so it can be found and moved once the
// category exists. The first run parked 20,910 of them out of the prompt
// entirely, which on a database this thin ate characters alive.
// NOT `splitTags` — that name is already the CSV field splitter above.
function partitionTags(tags) {
    const body = [], clothes = [], unknown = [];
    for (const t of tags) {
        const cats = categoriesOf(t);
        if (!cats.length) { unknown.push(t); body.push(t); }
        else if (cats.every(c => c.indexOf("clothes") === 0)) { clothes.push(t); }
        else { body.push(t); }
    }
    return { body, clothes, unknown };
}

// ---------------------------------------------------------------------------
//  Survey
// ---------------------------------------------------------------------------

// Masculine-build markers. Noodle's list, 2026-08-08 — a row carrying any of
// these is dropped whole rather than imported and culled back out later.
const MASCULINE = new Set(["bara", "large pectorals", "bare pectorals", "beard",
    "stubble", "sideburns", "mustache", "goatee", "bishounen", "chest hair",
    "navel hair", "long sideburns", "pectoral cleavage"]);

const bucket = {};
const note = (key, row, detail) => {
    if (!bucket[key]) { bucket[key] = []; }
    bucket[key].push({ trigger: row.trigger, detail: detail });
};

let total = 0, usable = 0, shadowed = 0, reachable = 0;
const keep = [];
const allTags = new Map();

for (const raw of rows) {
    if (!raw || raw.length < 4) { continue; }
    total++;

    const triggerField = clean(raw[col.trigger]);
    const triggers = triggerField.split(",").map(t => t.trim()).filter(Boolean);
    const tags = splitTags(raw[col.core_tags]);
    const row = { trigger: triggerField };

    // --- error case: more or less than two trigger tags ---------------------
    if (triggers.length !== 2) {
        note("triggerCount", row, triggers.length + " trigger tag(s)");
        continue;
    }

    const canonical = triggers[0];
    const franchise = triggers[1];

    // --- discards, in spec order --------------------------------------------
    // 1girl+1boy MUST be tested before any 1girl->female rewrite (review item 5).
    const lower = tags.map(t => t.toLowerCase());
    if (lower.indexOf("1girl") !== -1 && lower.indexOf("1boy") !== -1) {
        note("bothGenders", row, "1girl and 1boy together");
        continue;
    }
    if (lower.indexOf("comic") !== -1)         { note("comic", row, "`comic` in tags"); continue; }
    if (lower.indexOf("speech bubble") !== -1) { note("speech", row, "`speech bubble` in tags"); continue; }

    // Added 2026-08-08. Noodle's decision: the `original` franchise goes, "there's
    // no way there'll be enough training data to warrant them". This also takes
    // most of the artist-paren problem with it, since an OC disambiguated by its
    // artist is nearly always `original`.
    if (franchise === "original") { note("original", row, "original character"); continue; }

    // Also Noodle's, same day: masculine-build markers. Dropped for the same
    // reason as `comic` — the entry is not the kind of figure this database is
    // for, and importing it would mean culling it back out later.
    const masc = tags.filter(t => MASCULINE.has(t.toLowerCase()));
    if (masc.length) { note("masculine", row, "`" + masc[0] + "`"); continue; }
    if (tags.length <= 1) {
        note("tooFewTags", row, tags.length + " tag(s)");
        continue;
    }
    if (lower.indexOf("1girl") === -1 && lower.indexOf("1boy") === -1) {
        note("noGender", row, "neither 1girl nor 1boy — likely not a person");
        continue;
    }

    // --- the disambiguation parens ------------------------------------------
    // NOT a discard. The first pass of this survey refused every row whose paren
    // was a real tag and it threw away 215 perfectly good characters —
    // `akemi homura (black dress)`, `amane kanata (nurse)`, `akai haato (gothic
    // lolita)`. Those are ALTERNATE OUTFITS, which is the `meltryllis (swimsuit
    // lancer) (fate)` case the spec already has a rule for.
    //
    // The `(octopus)` danger was never about importing the character. It is
    // about spec rule (d) — "a paren differing from the second trigger tag is an
    // alternate name for the franchise" — which would make `bocchi the rock!` an
    // alias of `octopus`. So the paren is classified here and the row imports
    // either way; what the classification decides is whether an ALIAS may be
    // minted from it.
    // Spec rule (c): the LAST paren is the franchise, everything before it is an
    // alternate-look candidate. The first run only ever computed this when there
    // was exactly ONE paren, so every multi-paren name skipped classification —
    // and multi-paren is most of the alternate looks. `a-chan (1st costume)
    // (hololive)` and `meltryllis (swimsuit lancer) (fate)` both went through
    // unclassified, which is what let `(1st costume)` be read as part of a
    // person's name.
    const parens = parensOf(canonical);
    const last = parens.length ? parens[parens.length - 1] : null;
    const looks = parens.slice(0, -1);
    // The paren that might name the franchise, and only that one. A paren that
    // repeats the second trigger tag says nothing new.
    const sole = last && last !== franchise ? last : null;
    if (looks.length) {
        note("alternateLook", row, "`(" + looks.join(") (") + ")` before the franchise paren");
    }
    if (sole) {
        const cats = categoriesOf(sole);
        // Does the paren share a word with the franchise? `(snowbreak)` under
        // `snowbreak: containment zone`, `(armored core 6)` under `armored core`,
        // `(honkai impact)` under `honkai (series)` — those really are franchise
        // aliases and rule (d) is right about them.
        const words = (t) => new Set(String(t).toLowerCase()
            .replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(w => w.length > 2));
        const fWords = words(franchise);
        const shares = [...words(sole)].some(w => fWords.has(w));

        if (franchises.has(sole)) {
            note("parenIsFranchise", row, "`(" + sole + ")` is a known franchise");
        } else if (shares) {
            note("parenIsFranchiseVariant", row,
                 "`(" + sole + ")` shares a word with `" + franchise + "`");
        } else if (franchise === "original") {
            // An original character disambiguated by whoever drew her. 988 rows.
            // Rule (d) would make the artist's handle a franchise alias.
            note("parenIsArtist", row, "`(" + sole + ")` — OC, so this is the artist");
        } else if (cats.filter(c => c.indexOf("background") === 0).length) {
            note("parenIsArtist", row, "`(" + sole + ")` is a known artist tag");
        } else if (cats.length) {
            note("parenIsOutfit", row,
                 "`(" + sole + ")` is a real tag — " + cats.slice(0, 2).join(", "));
        } else {
            // No relationship to the franchise and nothing known about it. THIS
            // is the residue that actually needs eyes.
            note("parenUnknown", row, "`(" + sole + ")` is unknown — alias candidate");
        }
    }

    // --- already ours? -------------------------------------------------------
    const existing = index.names[canonical.toLowerCase()];
    if (existing && existing.entry) {
        shadowed++;
        continue;
    }

    usable++;
    // REACHABILITY. An imported entry's codename is `.` plus her canonical booru
    // tag, and a names block links a canonical tag to that codename — so a
    // character already in brandsDB2 can be summoned by typing her tag. One with
    // no names block can only be reached by the dotted form, and half of those
    // carry parens the input syntax reads as emphasis. This is the number §4's
    // alias output exists to move.
    if (index.names[canonical.toLowerCase()]) { reachable++; }
    // The NORMALISED tags, because those are the strings the write stores and
    // therefore the ones the census has to be counting.
    const stored = normalise(tags);
    for (const t of stored) { allTags.set(t, (allTags.get(t) || 0) + 1); }
    keep.push({ canonical, franchise, tags: stored, sole, looks });
}

// ---------------------------------------------------------------------------
//  Report
// ---------------------------------------------------------------------------

const count = (k) => (bucket[k] || []).length;
const pct = (n) => (n / total * 100).toFixed(1) + "%";

console.log("");
console.log("=== animadex.csv survey — nothing was imported ===");
console.log("");
console.log("  rows                          " + total.toLocaleString());
console.log("");
console.log("  DISCARDED by the spec's rules");
console.log("    neither 1girl nor 1boy      " + String(count("noGender")).padStart(6) + "   " + pct(count("noGender")));
console.log("    one tag or none             " + String(count("tooFewTags")).padStart(6) + "   " + pct(count("tooFewTags")));
console.log("    1girl and 1boy together     " + String(count("bothGenders")).padStart(6) + "   " + pct(count("bothGenders")));
console.log("    `comic` in tags             " + String(count("comic")).padStart(6) + "   " + pct(count("comic")));
console.log("    `speech bubble` in tags     " + String(count("speech")).padStart(6) + "   " + pct(count("speech")));
console.log("    the `original` franchise    " + String(count("original")).padStart(6) + "   " + pct(count("original")));
console.log("    masculine build             " + String(count("masculine")).padStart(6) + "   " + pct(count("masculine")));
console.log("");
console.log("  ERROR CASES — stop and look");
console.log("    not exactly two triggers    " + String(count("triggerCount")).padStart(6) + "   " + pct(count("triggerCount")));
console.log("");
console.log("  DISAMBIGUATION PARENS  (imported either way; this decides aliasing)");
console.log("    an alternate outfit         " + String(count("parenIsOutfit")).padStart(6) + "   never alias");
console.log("    an artist name              " + String(count("parenIsArtist")).padStart(6) + "   never alias");
console.log("    a known franchise           " + String(count("parenIsFranchise")).padStart(6) + "   safe");
console.log("    a franchise variant         " + String(count("parenIsFranchiseVariant")).padStart(6) + "   rule (d) is RIGHT here");
console.log("    UNKNOWN - review these      " + String(count("parenUnknown")).padStart(6) + "   rule (d) would alias it");
console.log("");
console.log("  ALTERNATE LOOKS  (a paren before the franchise paren)");
console.log("    rows carrying one           " + String(count("alternateLook")).padStart(6) + "   imported as their own entry today");
console.log("");
console.log("  already in charactersDB       " + String(shadowed).padStart(6) + "   " + pct(shadowed));
console.log("  WOULD IMPORT                  " + String(usable).padStart(6) + "   " + pct(usable));
console.log("    reachable by her own tag    " + String(reachable).padStart(6) + "   the rest need §4's aliases");
console.log("");
console.log("  distinct tags they bring      " + allTags.size.toLocaleString());

for (const [key, label] of [["triggerCount", "not exactly two trigger tags"],
                            ["parenUnknown", "unknown disambiguation paren - rule (d) would make each an alias"],
                            ["parenIsOutfit", "paren is an alternate outfit, NOT a franchise"],
                            ["bothGenders", "1girl and 1boy together"]]) {
    const rowsFor = bucket[key] || [];
    if (!rowsFor.length) { continue; }
    console.log("\n--- " + label + " (" + rowsFor.length + ") ---");
    for (const r of rowsFor.slice(0, SHOW)) {
        console.log("    " + String(r.trigger).slice(0, 74).padEnd(76) + r.detail);
    }
    if (rowsFor.length > SHOW) { console.log("    … and " + (rowsFor.length - SHOW) + " more"); }
}

// What the import would ADD to the uncategorised pile is the number that decides
// how much hand-sorting follows, so it is worth having before deciding to run.
const unknownTags = [...allTags.entries()]
    .filter(([t]) => !categoriesOf(t).length)
    .sort((a, b) => b[1] - a[1]);
const unknownUses = unknownTags.reduce((n, [, c]) => n + c, 0);
console.log("\n--- tags the engine does not know yet ---");
console.log("    " + unknownTags.length.toLocaleString() + " distinct, " +
            unknownUses.toLocaleString() + " uses");
console.log("    most common:");
for (const [t, c] of unknownTags.slice(0, SHOW)) {
    console.log("      " + String(c).padStart(6) + "  " + t);
}

// ---------------------------------------------------------------------------
//  --write : charactersDB2.js, plus the review file
// ---------------------------------------------------------------------------
//  Two outputs on purpose. Anything the spec says to decide case by case goes to
//  the review file INSTEAD of being imported — review items 1 and 2, both of
//  which Noodle answered with "save it for manual review". The review file is in
//  the same block format, so a reviewed entry is moved across rather than retyped.

if (write) {
    // ---- READ ANIMADEX-IMPORT.md BEFORE TRUSTING THIS OUTPUT ----------------
    // The first run, 2026-08-08, produced 22,340 entries and was rolled back
    // after review over six faults. Four are fixed here and two remain:
    //   3A  an alternate look is imported as a SEPARATE PERSON. The classifier
    //       now finds them and the survey counts them, but nothing groups a
    //       `(Nth costume)` row back onto the character it belongs to.
    //   4   no aliases are written. Nothing here touches namesArray or
    //       brandsDB2, so `adam taurus` never gains `adam taurus (rwby)`.
    // Both are written up in !designDocs/animadex/ANIMADEX-IMPORT.md. This banner goes
    // when they do.
    console.log("\n  !! webui2-animadex.js --write still has two known faults —");
    console.log("     alternate looks import as separate people, and no aliases");
    console.log("     are written. See !designDocs/animadex/ANIMADEX-IMPORT.md.\n");

    const entries = [], review = [];
    let noClothes = 0, parked = 0;

    for (const row of keep.slice(0, LIMIT)) {
        // Already normalised in the survey loop, so the census and the file are
        // built from one set of strings rather than two.
        const parts = partitionTags(row.tags);

        // Rule (d) would mint a franchise alias from an unrecognised paren, and
        // the survey says 1,581 of those are a coin flip. They are held back.
        const unresolved = row.sole && !franchises.has(row.sole) &&
            (bucket.parenUnknown || []).some(r => r.trigger.indexOf(row.canonical) === 0);

        // NO ESCAPING. The databases hold names exactly as they are typed —
        // `nero claudius (fate)`, not `nero claudius \\(fate\\)`. `walkStoredPrompt`
        // tells a name's parens from v1's emphasis parens by POSITION, and
        // `escapeStoredNames` puts the backslashes back for v1 as the database is
        // built, so nothing downstream sees the difference.
        //
        // This was the worst bug of the first run and it was an escaping bug in
        // both directions: the file is a template literal, `\(` in one collapses
        // to a bare `(` on load, so a single backslash produced a name that
        // `splitStoredPrompt` then read as an emphasis group and shredded.
        const lines = [];
        lines.push("." + row.canonical + "; " + row.canonical + ", " + row.franchise +
                   (parts.body.length ? ", " + parts.body.join(", ") : ""));
        if (parts.clothes.length) { lines.push("*default; " + parts.clothes.join(", ")); }
        else { lines.push("*default; "); noClothes++; }
        // A MARKER, not a removal. The tags in it are also in her prompt above —
        // an uncategorised tag still describes her, and parking it out of the
        // prompt lost 20,910 tag uses on the first run. `- ` makes the line a
        // comment charactersDB skips, so it cannot fire as a replacement rule.
        if (parts.unknown.length) {
            lines.push("- unknown; " + parts.unknown.join(", "));
            parked += parts.unknown.length;
        }
        (unresolved ? review : entries).push(lines.join("\n"));
    }

    const stamp = new Date().toISOString().slice(0, 10);
    const head = (what, n) =>
        "// " + "=".repeat(74) + "\n" +
        "//  " + what + "\n" +
        "// " + "=".repeat(74) + "\n" +
        "//\n//  GENERATED by scripts/webui/tools/webui2-animadex.js on " + stamp + ".\n" +
        "//  " + n + " entries. Do not hand-edit: re-running the tool overwrites this\n" +
        "//  file whole. Move an entry into charactersDB.js to keep it — that file\n" +
        "//  outranks this one and the entry here is then skipped.\n" +
        "// " + "=".repeat(74) + "\n\n";

    const target = path.join(lib, "charactersDB2.js");
    fs.writeFileSync(target,
        head("charactersDB2 — the IMPORTED character database", entries.length) +
        // `characterArray2`, singular — that is the name cleanupCharacterArray
        // reads at webui.js:3416, and charactersDB.js's own is `characterArray`.
        "var characterArray2 = `\n" + entries.join("\n\n") + "\n`;\n", "utf8");

    const reviewPath = path.join(here, "..", "..", "!designDocs", "animadex", "animadex-review.txt");
    fs.writeFileSync(reviewPath,
        "Held back for review — the disambiguation paren is unrecognised, so spec\n" +
        "rule (d) would turn it into a franchise alias and it is a coin flip whether\n" +
        "that is right. Move a block into charactersDB2.js once you have decided.\n\n" +
        review.join("\n\n") + "\n", "utf8");

    console.log("\n=== written ===");
    console.log("  charactersDB2.js       " + entries.length.toLocaleString() + " entries");
    console.log("  animadex-review.txt    " + review.length.toLocaleString() + " held back");
    console.log("  with no clothing tags  " + noClothes.toLocaleString());
    console.log("  tags parked as unknown " + parked.toLocaleString());
    console.log("\n  now run: node scripts/webui/tools/webui2-lint.js");
}

if (jsonPath) {
    fs.writeFileSync(jsonPath, JSON.stringify({
        total, usable, shadowed,
        discards: Object.fromEntries(Object.keys(bucket).map(k => [k, bucket[k].length])),
        errorCases: { triggerCount: bucket.triggerCount || [], parenUnknown: bucket.parenUnknown || [] },
        unknownTags: unknownTags.map(([tag, uses]) => ({ tag, uses }))
    }, null, 1), "utf8");
    console.log("\n  written to " + jsonPath);
}
