// ============================================================================
//  WEBUI ENGINE v2 — uncategorised keyword census
// ============================================================================
//
//    node --max-old-space-size=4096 scripts/webui/tools/webui2-unknown.js
//    node ... webui2-unknown.js --json unknown.json     machine-readable
//    node ... webui2-unknown.js --limit 400             show more rows
//
//  Every tag in charactersDB that belongs to no category — across character
//  prompts, outfit prompts AND replacement rules, both sides.
//
//  A tag in no category never culls, never sorts, and lands in the "unknown"
//  bucket of the display. That is survivable at 509 hand-written characters. It
//  is not survivable after an import, because there would be no way to tell an
//  imported tag that needs categorising from one that was always like that. So
//  this is the BEFORE picture: run it now, fix or accept what it finds, and the
//  same run after an import shows exactly what the import added.
//
//  Written in JS rather than Python on purpose, even though the follow-up
//  re-categorisation script is planned for Python. The thing that decides
//  whether a tag is categorised is `categoriesOf`, which reads a 4.24-million
//  entry set built by this codebase. Reimplementing that decision in another
//  language would produce a second answer that drifts from the engine's. The
//  OUTPUT is plain JSON, which Python can eat.
//
//  What is NOT a tag, and is excluded:
//    .codename        the character activator
//    *outfitname      the outfit activator
//    compound shortcuts (`Large Canine`) — genitalShortcutArray names
//    outfit type names appearing as a replacement TARGET
//    canonical character and brand tags — they are identity, not description
// ============================================================================

const fs = require("fs");
const vm = require("vm");
const path = require("path");

// One up from tools/: `here` means the engine directory, which is what every
// path below is relative to.
const here = path.join(__dirname, "..");
const args = process.argv.slice(2);
const jsonAt = args.indexOf("--json");
const jsonPath = jsonAt === -1 ? null : args[jsonAt + 1];
const limitAt = args.indexOf("--limit");
const limit = limitAt === -1 ? 120 : Number(args[limitAt + 1]);
const detail = args.indexOf("--detail") !== -1;

const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);

const lib = path.join(here, "libraries");
const webuiSrc = fs.readFileSync(path.join(here, "webui.js"), "utf8");
const libraries = webuiSrc.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1]
    .match(/"([^"]+)"/g).map(q => q.slice(1, -1));
for (const file of libraries) {
    vm.runInContext(fs.readFileSync(path.join(lib, file), "utf8"), sandbox, { filename: file });
}
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) {
    vm.runInContext(fs.readFileSync(path.join(here, file), "utf8"), sandbox, { filename: file });
}

console.log("Building the keyword sets...");
vm.runInContext("v2EnsureDictionaries()", sandbox);

const categoriesOf   = sandbox.categoriesOf;
const expandCompound = sandbox.expandCompound;
const index          = vm.runInContext("buildCharacterIndex()", sandbox);
const characters     = vm.runInContext("cleanedCharacterArray", sandbox);
const outfits        = vm.runInContext("cleanedOutfitArray", sandbox);
const outfitTypes    = new Set(vm.runInContext("outfitTypesList", sandbox)
                                 .map(t => String(t).trim().toLowerCase()));

// ---------------------------------------------------------------------------
//  Classification
// ---------------------------------------------------------------------------

const identity = new Set();
for (const name in index.names)     { identity.add(name.toLowerCase()); }
for (const name in index.codenames) { identity.add(name.toLowerCase()); }
for (const name in index.aliases)   { identity.add(name.toLowerCase()); }
// The canonical tag each entry leads with is identity too, and is often not in
// any keyword DB — 2728 names blocks against one keyword file.
for (const entry of characters) {
    const first = sandbox.firstStoredTag(entry);
    if (first) { identity.add(String(first).toLowerCase()); }
}

function classify(tag) {
    const text = String(tag == null ? "" : tag).trim();
    if (!text) { return "empty"; }
    const key = text.toLowerCase();

    if (categoriesOf(text).length) { return "categorised"; }
    if (identity.has(key))         { return "identity"; }
    if (expandCompound(text))      { return "shortcut"; }
    if (outfitTypes.has(key))      { return "outfit name"; }
    // `.something` or `*something` reaching here is syntax that did not parse.
    if (text[0] === "." || text[0] === "*") { return "syntax"; }
    return "unknown";
}

// ---------------------------------------------------------------------------
//  Harvest
// ---------------------------------------------------------------------------
//  Read from the CLEANED arrays rather than the raw file, so what is examined is
//  exactly what the engine ends up holding — after compound extraction, after
//  the parser has had its way with the line.

const found = new Map();   // tag -> {count, where:Set, kinds:Set}

function record(tag, where, kind) {
    const text = String(tag).trim();
    if (!text) { return; }
    if (classify(text) !== "unknown") { return; }
    if (!found.has(text)) { found.set(text, { count: 0, where: new Set(), kinds: new Set() }); }
    const entry = found.get(text);
    entry.count++;
    entry.kinds.add(kind);
    if (entry.where.size < 4) { entry.where.add(where); }
}

// splitStoredPrompt returns { text, weight } so an emphasis group keeps its
// score. The census only cares about the names.
const split = (text) => sandbox.splitStoredPrompt(text).map(t => t.text);

for (const character of characters) {
    for (const tag of split(character.prompt)) {
        record(tag, character.codename, "character");
    }
    for (const rule of character.replacements || []) {
        const semicolon = String(rule).indexOf(";");
        if (semicolon === -1) { record(rule, character.codename, "rule (malformed)"); continue; }
        // Both sides are tags: the target is matched against the prompt, the
        // replacement is inserted into it.
        record(String(rule).slice(0, semicolon), character.codename, "rule target");
        for (const tag of split(String(rule).slice(semicolon + 1))) {
            record(tag, character.codename, "rule value");
        }
    }
}

for (const outfit of outfits) {
    for (const tag of split(outfit.prompt)) {
        record(tag, outfit.codename, "outfit");
    }
    for (const rule of outfit.replacements || []) {
        const semicolon = String(rule).indexOf(";");
        if (semicolon === -1) { record(rule, outfit.codename, "rule (malformed)"); continue; }
        record(String(rule).slice(0, semicolon), outfit.codename, "rule target");
        for (const tag of split(String(rule).slice(semicolon + 1))) {
            record(tag, outfit.codename, "rule value");
        }
    }
}

// ---------------------------------------------------------------------------
//  Report
// ---------------------------------------------------------------------------

const rows = [...found.entries()]
    .map(([tag, info]) => ({
        tag,
        count: info.count,
        kinds: [...info.kinds].sort(),
        where: [...info.where]
    }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

// ---------------------------------------------------------------------------
//  Three plain lists, which is the shape this is actually worked from
// ---------------------------------------------------------------------------
//  Split by WHERE THE TAG CAME FROM, because that is the only thing that hints
//  at which category it wants:
//
//    characters    almost certainly a body tag
//    outfits       almost certainly a clothing tag
//    replacements  no hint at all — either side of a rule, could be anything
//
//  A tag appearing in two places is listed in both. Deduplicating across the
//  lists would throw away the hint, which is the entire point of splitting them.

const buckets = { characters: new Set(), outfits: new Set(), replacements: new Set() };
for (const [tag, info] of found.entries()) {
    for (const kind of info.kinds) {
        if (kind === "character")        { buckets.characters.add(tag); }
        else if (kind === "outfit")      { buckets.outfits.add(tag); }
        else                             { buckets.replacements.add(tag); }
    }
}
const listOf = (set) => [...set].sort((a, b) => a.localeCompare(b));
const lists = {
    characters:   listOf(buckets.characters),
    outfits:      listOf(buckets.outfits),
    replacements: listOf(buckets.replacements)
};

let totalTags = 0;
for (const character of characters) { totalTags += split(character.prompt).length; }
for (const outfit of outfits)       { totalTags += split(outfit.prompt).length; }

console.log("\n=== uncategorised keywords in charactersDB ===");
console.log(`  ${characters.length} characters, ${outfits.length} outfits`);
console.log(`  ${rows.length} distinct uncategorised tags, ${rows.reduce((n, r) => n + r.count, 0)} uses`);
console.log(`  (out of roughly ${totalTags} tag uses in character and outfit prompts)\n`);

const section = (title, list, hint) => {
    console.log(`\n--- from ${title}: ${list.length} ---`);
    console.log(`    ${hint}\n`);
    console.log(list.join(", "));
};

section("character entries", lists.characters,
        "probably body tags");
section("outfits", lists.outfits,
        "probably clothing tags");
section("replacements and rule targets", lists.replacements,
        "no hint — either side of a rule, could be body, clothes or scene");

if (detail) {
    console.log("\n=== detail: count, where it came from, which entries ===\n");
    for (const row of rows.slice(0, limit)) {
        const where = row.where.slice(0, 3).join(", ") + (row.count > 3 ? ", …" : "");
        console.log(`  ${String(row.count).padStart(4)}  ${row.tag.padEnd(34)} ${row.kinds.join("+").padEnd(22)} ${where}`);
    }
    if (rows.length > limit) { console.log(`\n  …and ${rows.length - limit} more. Pass --limit to see them.`); }
}

if (jsonPath) {
    // Both shapes: the three lists to work from, and the detail to check against.
    fs.writeFileSync(jsonPath, JSON.stringify({ lists, detail: rows }, null, 2), "utf8");
    console.log(`\n\nWrote ${rows.length} tags to ${jsonPath}`);
}

// ---------------------------------------------------------------------------
//  Second census: entries that do not lead with their identity tag
// ---------------------------------------------------------------------------
//  charactersDB is meant to be written identity-first, and two things rely on
//  it: `firstStoredTag` supplies the canonical tag for an original character
//  with no names block, and `resolveCharacterCodename` accepts that first tag as
//  a way of naming her, which is what makes `sy-angelica*crimbus` work.
//
//  An entry that leads with an ordinary descriptive tag therefore claims that
//  tag as a name. `.mysticImp` leads with `black skin`, so `black skin*default`
//  resolves to her.

const misleading = [];
for (const entry of characters) {
    const first = sandbox.firstStoredTag(entry);
    if (!first) { continue; }
    const cats = categoriesOf(first);
    if (!cats.length) { continue; }                                  // not a real keyword: fine
    if (index.names[String(first).toLowerCase()]) { continue; }      // a known character/brand: fine
    // `fl-angelica`, `sy-sorbet` and friends are identity tags that happen to be
    // categorised, as bodyBrand and nothing else. They are not the problem —
    // nobody types one by accident. The problem is an ordinary DESCRIPTIVE tag
    // like `1boy` or `goblin` standing in the identity slot.
    if (cats.length === 1 && cats[0] === "bodyBrand") { continue; }
    misleading.push({ codename: entry.codename, first, cats });
}

console.log(`\n=== entries not written identity-first: ${misleading.length} ===`);
console.log("  Each one claims its first tag as a name, so `<that tag>*default` resolves to it.");
for (const row of misleading.slice(0, 40)) {
    console.log(`  ${row.codename.padEnd(28)} leads with  ${JSON.stringify(row.first).padEnd(22)} ${row.cats.slice(0,3).join(", ")}`);
}
if (misleading.length > 40) { console.log(`  …and ${misleading.length - 40} more.`); }
