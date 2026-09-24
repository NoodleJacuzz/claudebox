// ============================================================================
//  WEBUI ENGINE v2 — the guess-sorter
// ============================================================================
//
//    node scripts/webui/tools/webui2-guess.js              propose, write the file
//    node scripts/webui/tools/webui2-guess.js --append     append straight to unsorted.md
//    node scripts/webui/tools/webui2-guess.js --limit 40   show more rows on screen
//
//  Reads every uncategorised tag in charactersDB and proposes a heading for it,
//  in the format webui2-sort.js already eats. The output is a REVIEW QUEUE, not
//  a decision: read it, move the wrong ones, then run the sorter.
//
//  The heuristic is ANIMADEX-IMPORT.md's, verbatim:
//
//    "Because we're primarily working with character database entries, there's
//     very little risk that we're dealing with scene keywords. Thus we can assume
//     that if an uncategorized keyword matches partially with an existing keyword
//     in the clothes or character database, the unsorted keyword probably belongs
//     with its match."
//
//  So: peel words off the tag and ask the engine about what is left. A booru tag
//  names its head noun LAST far more often than first — `floral-print shirt` is a
//  shirt, `side-tie bikini bottom` is a bikini bottom — so suffixes are tried
//  before prefixes, and the longest surviving phrase wins.
//
//  Two things it refuses to guess, because a wrong guess costs more than no guess:
//
//    - a phrase that lands in more than MAX_CATEGORIES categories. Those are the
//      item-independent generator patterns (`{color} {symbol}` and friends) which
//      put `blue streak` in all 31 body categories. A match like that says nothing
//      about where the tag belongs.
//    - a phrase of one character, or one that is only a modifier word. `red` is in
//      every colour pattern going and would drag half the file into bodyRace.
//
//  This exists for the animadex import: 509 hand-written characters produce ~360
//  uncategorised tags, and an import produces them by the thousand. Sorting those
//  by hand is the thing that does not scale.
// ============================================================================

const fs = require("fs");
const vm = require("vm");
const path = require("path");

// One up from tools/: `here` means the engine directory, which is what every
// path below is relative to.
const here = path.join(__dirname, "..");
const lib = path.join(here, "libraries");
const outPath = path.join(here, "..", "..", "!designDocs", "webui_engine", "unsorted-guesses.md");
const unsortedPath = path.join(here, "..", "..", "!designDocs", "webui_engine", "unsorted.md");

const args = process.argv.slice(2);
const append = args.indexOf("--append") !== -1;
const limitAt = args.indexOf("--limit");
const limit = limitAt === -1 ? 25 : Number(args[limitAt + 1]);

// A phrase in more categories than this is telling us nothing.
const MAX_CATEGORIES = 4;

// ---------------------------------------------------------------------------

const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);

const webuiSrc = fs.readFileSync(path.join(here, "webui.js"), "utf8");
const libraries = webuiSrc.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1]
    .match(/"([^"]+)"/g).map(q => q.slice(1, -1));
for (const file of libraries) {
    vm.runInContext(fs.readFileSync(path.join(lib, file), "utf8"), sandbox, { filename: file });
}
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) {
    vm.runInContext(fs.readFileSync(path.join(here, file), "utf8"), sandbox, { filename: file });
}
console.log("Building the dictionaries...");
vm.runInContext("v2EnsureDictionaries()", sandbox);

const categoriesOf   = sandbox.categoriesOf;
const expandCompound = sandbox.expandCompound;
const index          = vm.runInContext("buildCharacterIndex()", sandbox);
const characters     = vm.runInContext("cleanedCharacterArray", sandbox);
const outfits        = vm.runInContext("cleanedOutfitArray", sandbox);
const outfitTypes    = new Set(vm.runInContext("outfitTypesList", sandbox)
                                 .map(t => String(t).trim().toLowerCase()));

// category -> { domain, items: [] }, and every modifier word, so a guess can be
// refused for being nothing but a colour.
const categoryItems = new Map();
for (const [domain, db] of [["body", sandbox.bodyKeywordDB], ["clothes", sandbox.clothesKeywordDB]]) {
    for (const category of Object.keys(db || {})) {
        categoryItems.set(category, { domain: domain, items: Object.keys(db[category] || {}) });
    }
}
const modifierWords = new Set();
for (const key of Object.keys(sandbox.modifierKeywordDB || {})) {
    const list = sandbox.modifierKeywordDB[key];
    if (Array.isArray(list)) { for (const w of list) { modifierWords.add(String(w).toLowerCase()); } }
}

// ---------------------------------------------------------------------------
//  Which tags need a guess — the census's own classification
// ---------------------------------------------------------------------------

const identity = new Set();
for (const name in index.names)     { identity.add(name.toLowerCase()); }
for (const name in index.codenames) { identity.add(name.toLowerCase()); }
for (const name in index.aliases)   { identity.add(name.toLowerCase()); }
for (const entry of characters) {
    const first = sandbox.firstStoredTag(entry);
    if (first) { identity.add(String(first).toLowerCase()); }
}

function isUnknown(tag) {
    const text = String(tag || "").trim();
    if (!text) { return false; }
    const key = text.toLowerCase();
    if (categoriesOf(text).length) { return false; }
    if (identity.has(key))         { return false; }
    if (expandCompound(text))      { return false; }
    if (outfitTypes.has(key))      { return false; }
    if (text[0] === "." || text[0] === "*") { return false; }
    return true;
}

const split = (text) => sandbox.splitStoredPrompt(text).map(t => t.text);
const unknown = new Map();   // tag -> count

function note(tag) {
    const text = String(tag || "").trim();
    if (!isUnknown(text)) { return; }
    unknown.set(text, (unknown.get(text) || 0) + 1);
}
for (const set of [characters, outfits]) {
    for (const entry of set) {
        for (const tag of split(entry.prompt)) { note(tag); }
        for (const rule of entry.replacements || []) {
            const semi = String(rule).indexOf(";");
            if (semi === -1) { continue; }
            note(String(rule).slice(0, semi));
            for (const tag of split(String(rule).slice(semi + 1))) { note(tag); }
        }
    }
}

// ---------------------------------------------------------------------------
//  The guess
// ---------------------------------------------------------------------------

// Every sub-phrase of the tag, longest first, suffixes before prefixes of the
// same length. `side-tie bikini bottom` yields "bikini bottom", "side-tie bikini",
// "bottom", "bikini", "side-tie".
function subPhrases(tag) {
    const words = tag.split(/\s+/).filter(Boolean);
    const suffixes = [], prefixes = [];
    for (let len = words.length - 1; len >= 1; len--) {
        suffixes.push({ text: words.slice(words.length - len).join(" "), from: "suffix" });
        prefixes.push({ text: words.slice(0, len).join(" "), from: "prefix" });
    }
    // EVERY suffix before ANY prefix. A prefix match is usually the modifier
    // rather than the thing — `blue bow waist ornament` is an ornament, not a
    // bow — so a prefix is only worth reading once the tail has said nothing.
    return suffixes.concat(prefixes);
}

// ANIMADEX-IMPORT.md's "Automate fixing", which is a stated rule rather than a
// guess and so runs before the matching does:
//     Any tag with (1st costume)…(5th costume) is fullwear
//     Any tag with (cosplay) is fullwear
// Without it these match their own character name as a prefix and land in
// bodyBrand, which is where the NAME belongs but not the outfit.
const COSTUME = /\((?:1st|2nd|3rd|4th|5th) costume\)|\(cosplay\)/i;

function guess(tag) {
    if (COSTUME.test(tag)) {
        return { category: "clothesFullwear", matched: tag.match(COSTUME)[0],
                 how: "rule", all: ["clothesFullwear"] };
    }
    for (const phrase of subPhrases(tag)) {
        const key = phrase.text.toLowerCase();
        if (key.length < 3) { continue; }
        // A bare modifier is in everything by construction and means nothing.
        if (modifierWords.has(key)) { continue; }
        const cats = categoriesOf(phrase.text);
        if (!cats.length) { continue; }
        if (cats.length > MAX_CATEGORIES) { continue; }   // item-independent noise

        // Body/clothes only. ANIMADEX-IMPORT.md: "there's very little risk that
        // we're dealing with scene keywords", and a scene-only match is usually
        // a coincidence rather than a category — `shackles` and `chain` are
        // members of sceneRace, so `oversized shackles` and `gold waist chain`
        // were being proposed as race tags. Leave those unguessed instead.
        const preferred = cats.filter(c => categoryItems.has(c));
        if (!preferred.length) { continue; }
        return { category: preferred[0], matched: phrase.text, how: phrase.from, all: cats };
    }
    return null;
}

// The heading webui2-sort.js will understand. The FULL category name is used
// rather than the prefix-dropped short form Noodle types by hand: `unsorted`
// resolves to both bodyUnsorted and clothesUnsorted and the sorter would refuse
// it, and a machine-written queue should never need disambiguating afterwards.
//
// `category - item` when the phrase that matched IS an item of that category,
// because then we know exactly where inside it the tag goes; the bare category
// otherwise, and the sorter picks the item.
function headingFor(result) {
    const entry = categoryItems.get(result.category);
    if (!entry) { return result.category; }               // scene/background: name it outright
    const item = entry.items.find(i => i === result.matched.toLowerCase());
    return item ? result.category + " - " + item : result.category;
}

const guessed = new Map();   // heading -> [{tag, matched, how, count}]
const stuck = [];

for (const [tag, count] of [...unknown.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    const result = guess(tag);
    if (!result) { stuck.push({ tag, count }); continue; }
    const heading = headingFor(result);
    if (!guessed.has(heading)) { guessed.set(heading, []); }
    guessed.get(heading).push({ tag, matched: result.matched, how: result.how, count });
}

// ---------------------------------------------------------------------------
//  Report and write
// ---------------------------------------------------------------------------

let placed = 0;
for (const rows of guessed.values()) { placed += rows.length; }

console.log("");
console.log("  " + unknown.size + " uncategorised tags");
console.log("  " + placed + " guessed into " + guessed.size + " headings");
console.log("  " + stuck.length + " with no partial match at all");
console.log("");

const headings = [...guessed.entries()].sort((a, b) => b[1].length - a[1].length);
for (const [heading, rows] of headings.slice(0, limit)) {
    console.log("  " + heading + "   (" + rows.length + ")");
    for (const r of rows.slice(0, 6)) {
        console.log("      " + r.tag.padEnd(32) + "matched `" + r.matched + "` (" + r.how + ")");
    }
    if (rows.length > 6) { console.log("      … and " + (rows.length - 6) + " more"); }
}
if (headings.length > limit) {
    console.log("\n  … and " + (headings.length - limit) + " more headings. --limit to see them.");
}

// The file is written in unsorted.md's own format so it can be pasted straight in
// — or moved in wholesale with --append once it has been read.
// Grouped by category, alphabetically, so related headings sit together instead
// of being ordered by how many tags happened to land in each. Scrolling for a
// clothesUpperwear block should not mean passing three body ones on the way.
const ordered = [...guessed.entries()].sort((a, b) => a[0].localeCompare(b[0]));

const blocks = [];
blocks.push("- Guessed by webui2-guess.js. Each tag matched a phrase the engine");
blocks.push("- already knows; the heading is where that phrase lives. READ BEFORE");
blocks.push("- SORTING - a partial match is a hint, not an answer.");
blocks.push("");
for (const [heading, rows] of ordered) {
    blocks.push(heading);
    for (const r of rows.slice().sort((x, y) => x.tag.localeCompare(y.tag))) {
        blocks.push(r.tag);
    }
    blocks.push("");
}
if (stuck.length) {
    // NOT dash-prefixed. These are the ones that most need moving under a real
    // heading, and a comment marker means having to strip it off every line
    // first. They sit under a heading the sorter refuses, so nothing files by
    // accident — rename it and they go.
    blocks.push("- Nothing partially matched these. Rename the heading below, or");
    blocks.push("- split them under headings of your own, and they will file.");
    blocks.push("");
    blocks.push("NEEDS A HEADING");
    for (const s of stuck.slice().sort((a, b) => a.tag.localeCompare(b.tag))) {
        blocks.push(s.tag);
    }
    blocks.push("");
}

if (append) {
    const existing = fs.readFileSync(unsortedPath, "utf8");
    const cut = existing.indexOf("=== More complex issues ===");
    const top = cut === -1 ? existing : existing.slice(0, cut);
    const rest = cut === -1 ? "" : existing.slice(cut);
    fs.writeFileSync(unsortedPath, top.replace(/\s*$/, "\n\n") + blocks.join("\n") + "\n" + rest, "utf8");
    console.log("\n  appended to unsorted.md, above the divider.");
} else {
    fs.writeFileSync(outPath, blocks.join("\n") + "\n", "utf8");
    console.log("\n  written to !designDocs/webui_engine/unsorted-guesses.md");
    console.log("  read it, fix what is wrong, then paste into unsorted.md — or re-run with --append.");
}
