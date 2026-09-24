// ============================================================================
//  WEBUI ENGINE v2 — the sorter
// ============================================================================
//
//    node scripts/webui/tools/webui2-sort.js            dry run — print the plan
//    node scripts/webui/tools/webui2-sort.js --apply    write it
//    node scripts/webui/tools/webui2-sort.js --routes   dump the resolved routing table
//
//  Reads !designDocs/webui_engine/unsorted.md and files its tags into the real dictionaries,
//  so a tag can be sorted by typing a plain-English heading above it and nothing
//  else. No category names to remember, no per-file syntax to get right, and it
//  is short enough to type on a phone.
//
//  It STOPS DEAD at the `=== More complex issues ===` divider. Everything below
//  that line is patterns, colours, boosters and aliases — none of which is a bare
//  tag going into a bare list — and it is passed through byte for byte.
//
//  Nothing is ever guessed. A heading the tool cannot resolve keeps its tags and
//  is reported with the reason, so the fix is always to add one alias below or to
//  rename one heading. The file is the queue; what is left in it is what is left
//  to do.
//
//  WHERE THIS GROWS. The next thing through here is contextual defaults and
//  per-entry replacement rules, and unsorted.md already has them written out
//  below the divider under colon-terminated headings — `conditional boosters:`,
//  `aliases:`, `top-level fixes:`. Those are ROWS, `left ; right`, not bare tags.
//  Three things are already in place for them and one is not:
//
//    done  the routing table is data, so a new destination is a row rather than
//          a branch, and it carries `kind` to say what its payload looks like
//    done  writeSection is written against "a named block of lines in a template
//          literal", which is exactly the shape of defaultArray, cullArray and
//          cleaningDB's rulesets — not just sceneDB's
//    done  buildPlan refuses any kind it does not implement, so a rule cannot be
//          written into an array of keywords by accident
//    todo  a parser for the below-the-divider half, and readUnsorted's cut
// ============================================================================

const fs = require("fs");
const vm = require("vm");
const path = require("path");

// One up from tools/: `here` means the engine directory, which is what every
// path below is relative to.
const here = path.join(__dirname, "..");
const lib = path.join(here, "libraries");
const unsortedPath = path.join(here, "..", "..", "!designDocs", "webui_engine", "unsorted.md");
// One folder for every undo copy, rather than a .bak beside each original.
const backupDir = path.join(here, "_backups");

// A character no tag can contain. Built rather than written: a NUL escape kept
// being normalised back into a raw NUL byte, which makes the whole file read as
// binary to grep. Same trap, and same fix, as webui2.js.
const SEP = String.fromCharCode(0);

const apply = process.argv.indexOf("--apply") !== -1;
const dumpRoutes = process.argv.indexOf("--routes") !== -1;

// ---------------------------------------------------------------------------
//  The routing table
// ---------------------------------------------------------------------------
//  DATA, not code, because the next thing through here is contextual defaults
//  and per-entry replacement rules and those are rows rather than branches.
//
//  `kind` is what the payload looks like, and it decides which writer runs:
//
//    "tag"   a bare keyword going into a list of keywords. Everything today.
//    "rule"  a `left ; right` line going into a ruleset — defaultDB's
//            `requirements; additions [exceptions]`, cullDB's commands,
//            cleaningDB's alias groups, charactersDB's replacement lines.
//            No route uses it yet. `writeSection` already handles the shape it
//            needs, because sceneDB's array is the same kind of file.
//
//  A route is { file, format, category, item, kind, warn }.
//    format "nested"   category > item > [tags]   bodyKeywordDB, clothesKeywordDB
//    format "flat"     category > [tags]          singletonKeywordDB
//    format "section"  a named block of lines     sceneDB, and later defaultDB
//
//  ALIASES is consulted first and pins anything the two mechanical rules below
//  would get wrong or would find ambiguous. Add a line here rather than renaming
//  a heading you like typing.

const ALIASES = {
    // sceneDB calls this Face and it is the only expression bucket there is.
    "expression": { file: "sceneDB.js", format: "section", section: "Face",
                    category: "sceneFace", kind: "tag" },

    // Resolvable, but only by picking one of two — so it resolves WITH a warning
    // rather than silently. Say legwearUpper or legwearLower and this goes away.
    "legwear":    { category: "clothesLegwearUpper", kind: "tag",
                    warn: "`legwear` alone is too vague — thighhighs and socks are " +
                          "clothesLegwearUpper, boots-height and below are " +
                          "clothesLegwearLower. Filed as Upper. Write `legwearUpper` " +
                          "or `legwearLower` to say which and lose this warning." }
};

// ---------------------------------------------------------------------------
//  Load the dictionaries exactly as the page does
// ---------------------------------------------------------------------------

// Same as webui2-test.js: read webui.js's own librariesList so the order matches
// the page's, then the two engine files. No DOM stubs are needed.
function loadDictionaries(withEngine) {
    const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
    const sandbox = { console: quiet, module: undefined };
    vm.createContext(sandbox);
    const webuiSrc = fs.readFileSync(path.join(here, "webui.js"), "utf8");
    const listMatch = webuiSrc.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/);
    if (!listMatch) { throw new Error("librariesList not found in webui.js"); }
    const files = listMatch[1].match(/"([^"]+)"/g).map(function (q) { return q.slice(1, -1); });
    for (const file of files) {
        vm.runInContext(fs.readFileSync(path.join(lib, file), "utf8"), sandbox, { filename: file });
    }
    if (withEngine) {
        for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) {
            vm.runInContext(fs.readFileSync(path.join(here, file), "utf8"), sandbox, { filename: file });
        }
    }
    return sandbox;
}

// Which physical file each keyword DB lives in, so a route can name one.
const FILE_OF = { body: "bodyKeywordDB.js", clothes: "clothingKeywordDB.js" };

function buildIndex(sandbox) {
    const items = new Map();        // item name -> [{ domain, category }]
    const categories = new Map();   // category name -> { domain, items: [] }
    for (const [domain, db] of [["body", sandbox.bodyKeywordDB],
                                ["clothes", sandbox.clothesKeywordDB]]) {
        for (const category of Object.keys(db || {})) {
            const itemNames = Object.keys(db[category] || {});
            categories.set(category, { domain: domain, items: itemNames });
            for (const item of itemNames) {
                if (!items.has(item)) { items.set(item, []); }
                items.get(item).push({ domain: domain, category: category });
            }
        }
    }
    // sceneDB's own section headings are this same vocabulary, TitleCased, and
    // its sections are blank-line delimited — the format unsorted.md is in.
    const sceneSections = new Set();
    const sceneSrc = fs.readFileSync(path.join(lib, "sceneDB.js"), "utf8");
    const sceneBody = sceneSrc.slice(sceneSrc.indexOf("var sceneKeywordArray = `") );
    const sceneLines = sceneBody.slice(0, sceneBody.indexOf("\n`;")).split("\n");
    let expectHeading = true;
    for (const raw of sceneLines) {
        const line = raw.trim();
        if (line === "" || line.startsWith("var ")) { expectHeading = true; continue; }
        if (expectHeading) { sceneSections.add(line); }
        expectHeading = false;
    }
    return { items, categories, sceneSections,
             singletonCategories: new Set(Object.keys(sandbox.singletonKeywordDB || {})) };
}

// ---------------------------------------------------------------------------
//  Resolving a heading
// ---------------------------------------------------------------------------
//  In order, first hit wins:
//    0. ALIASES above.
//    1. The heading IS an item name. `hair` is an item of bodyHair, `ears` of
//       bodyHead. This is most of the body side, because the item list has always
//       been the matrix — see TODO.md.
//    2. The heading is a CATEGORY with its domain prefix dropped and the spaces
//       taken out. `race` -> bodyRace, `upperwear inner` -> clothesUpperwearInner,
//       `body unsorted` -> bodyUnsorted. This is the whole clothes side, because
//       clothing categories are named by slot rather than by noun.
//  Anything else is left alone and reported.

function camel(text) {
    const words = String(text).trim().split(/[\s_-]+/);
    return words[0] + words.slice(1).map(function (w) {
        return w.charAt(0).toUpperCase() + w.slice(1);
    }).join("");
}

function upperFirst(text) { return text.charAt(0).toUpperCase() + text.slice(1); }

function resolveHeading(heading, index) {
    const written = heading.trim();

    // `footwear - shoes` — the category, then the item inside it. Says exactly
    // where a tag goes when the tool would otherwise have to pick for you, and it
    // is the only way to reach an item whose name is not a word you would think
    // to write on its own.
    const dash = written.split(/\s+-\s+/);
    if (dash.length === 2) {
        const left = resolveHeading(dash[0], index);
        if (left.error) { return left; }
        const item = dash[1].trim().toLowerCase();
        const entry = index.categories.get(left.category);
        if (!entry) {
            return { error: "`" + written + "` — `" + dash[0] + "` is not a keyword-DB category, " +
                            "so it has no items to name." };
        }
        if (entry.items.indexOf(item) === -1) {
            return { error: "`" + written + "` — " + left.category + " has no item `" + item +
                            "`. It has: " + entry.items.slice(0, 8).join(", ") +
                            (entry.items.length > 8 ? ", …" : "") };
        }
        return completeRoute({ category: left.category, item: item, kind: "tag" }, index, written);
    }

    // A category name EXACTLY as spelled, before anything is lowercased.
    // Category names are camelCase and that is load-bearing (it is what tells a
    // category from a part in cullDB's syntax), so `clothesFullwear` has to be
    // readable as itself. webui2-guess.js writes headings this way because the
    // short forms are ambiguous — `unsorted` is both bodyUnsorted and
    // clothesUnsorted — and a machine-written queue must not need disambiguating.
    if (index.categories.has(written)) {
        return completeRoute({ category: written, kind: "tag" }, index, written);
    }

    const key = written.toLowerCase();

    if (Object.prototype.hasOwnProperty.call(ALIASES, key)) {
        return completeRoute(Object.assign({}, ALIASES[key]), index, heading);
    }

    // 1 — an item name.
    const asItem = index.items.get(key);
    if (asItem) {
        if (asItem.length > 1) {
            return { error: "`" + heading + "` is an item of " +
                     asItem.map(function (h) { return h.category; }).join(" and ") +
                     ". Name the category instead, or pin it in ALIASES." };
        }
        return completeRoute({ category: asItem[0].category, item: key, kind: "tag" },
                             index, heading);
    }

    // 2 — a category with the domain prefix dropped.
    const bare = camel(key);
    const guesses = [bare, "body" + upperFirst(bare), "clothes" + upperFirst(bare)];
    const hits = guesses.filter(function (g) { return index.categories.has(g); });
    if (hits.length === 1) {
        return completeRoute({ category: hits[0], kind: "tag" }, index, heading);
    }
    if (hits.length > 1) {
        return { error: "`" + heading + "` could be " + hits.join(" or ") +
                        ". Pin it in ALIASES." };
    }

    // A scene section, for completeness — sceneDB names its blocks TitleCased.
    const asSection = upperFirst(bare);
    if (index.sceneSections.has(asSection)) {
        return completeRoute({ file: "sceneDB.js", format: "section", section: asSection,
                               category: "scene" + asSection, kind: "tag" }, index, heading);
    }

    return { error: "`" + heading + "` is not an item, a category or a sceneDB section." };
}

// Fills in whatever the route did not say for itself: which file, which format,
// and — for the nested format — which item a tag hangs off.
function completeRoute(route, index, heading) {
    if (route.format === "section") { return route; }

    const entry = index.categories.get(route.category);
    if (!entry) {
        return { error: "`" + heading + "` resolved to " + route.category +
                        ", which is not a category in either keyword DB." };
    }

    // AN ITEM ALWAYS WINS. singletonKeywordDB is the last resort, not a tidy
    // alternative, and the reason is not tidiness:
    //
    //   subitem     runs through expandPlaceholders. `(color) ears` becomes
    //               `red ears`, `blue ears` … — 39 of them, and the literal is
    //               consumed. `(species) ears` likewise. Six tokens expand:
    //               color, variant, size, ornament, shape, species.
    //   singleton   goes in VERBATIM. generateBodyCategorySet ends with
    //               `(singletons || []).forEach(s => add(s));` and nothing more.
    //               `(color) ears` would register the literal string
    //               `(color) ears` as a keyword and no colour would ever match.
    //
    // So a placeholder in a singleton bucket does not merely fail to expand — it
    // registers a keyword nothing can ever type. On the clothes side the gap is
    // wider still: subitems also collect the action prefixes and suffixes
    // (`pulling crocs`, `crocs aside`) and singletons collect none.
    //
    // The only categories with no items at all are bodyUnsorted and
    // clothesUnsorted, and for those the singleton is the whole story.
    if (entry.items.length) {
        return Object.assign(route, { file: FILE_OF[entry.domain], format: "nested",
                                      domain: entry.domain });
    }
    return Object.assign(route, { file: "singletonKeywordDB.js", format: "flat",
                                  item: null, domain: entry.domain });
}

// Which item to hang a tag off when the heading named only a category.
//
// The generator never reads the item while expanding a subitem, so this cannot
// put a tag in the wrong CATEGORY — but it can file it somewhere that reads
// wrong, so a guess says so. A tag ending in the item's own name is certain
// (`thighhighs under boots` -> `thighhighs`); anything else is the first item and
// is reported, because that is usually the case that wants `category - item` or a
// new item of its own.
// A tag names its item at the END far more often than not — `platform boots` is
// a boot — so a suffix outranks a prefix. But `thighhighs under boots` is a
// thighhigh, and reading only the tail files it under boots, so a leading item
// counts too and the longer match wins within each rank.
function chooseItem(tag, categoryItems) {
    let best = null, bestRank = 0, bestLength = 0;
    for (const item of categoryItems) {
        let rank = 0;
        if (tag === item || tag.endsWith(" " + item)) { rank = 3; }
        else if (tag.startsWith(item + " ")) { rank = 2; }
        else if (tag.indexOf(" " + item + " ") !== -1) { rank = 1; }
        if (!rank) { continue; }
        if (rank > bestRank || (rank === bestRank && item.length > bestLength)) {
            best = item; bestRank = rank; bestLength = item.length;
        }
    }
    if (best) { return { item: best, sure: true }; }
    return { item: categoryItems[0], sure: false };
}

// ---------------------------------------------------------------------------
//  Reading unsorted.md
// ---------------------------------------------------------------------------
//  Blank-line delimited blocks, first line of each is the heading. sceneDB's own
//  array is written this way too, which is not a coincidence worth undoing.

// The six tokens expandPlaceholders actually knows (webui.js). Anything else is
// the `pal (species)` trap in reverse: an unknown token is left as literal text
// with a console.warn nobody reads, and the tag silently never registers.
const PLACEHOLDERS = ["color", "variant", "size", "ornament", "shape", "species"];

// Returns why a tag carrying `(token)` cannot be placed, or null if it can.
//
// The two kinds of paren, and they behave OPPOSITELY:
//
//   reserved token    `(color) ears` — expandPlaceholders expands it into one
//                     tag per value and the literal is consumed. Only works in an
//                     item array; a singleton would register the literal instead.
//   anything else     `2b (nier) (cosplay)` — a disambiguation paren belonging to
//                     a name. expandPlaceholders does not recognise the token, so
//                     it returns the string unchanged and the literal registers.
//                     That is correct and is what such a tag needs.
//
// The `pal (species)` trap is the FIRST kind arriving where the second was meant:
// a literal name that happens to contain a reserved word explodes into 46 entries
// and the name itself never registers. There is no way to tell that apart from a
// deliberate pattern, so a reserved token is allowed and this is the note in
// CATCH-UP that says to check the six words before writing one.
function placeholderProblem(tag, format) {
    const tokens = (tag.match(/\(([^)]+)\)/g) || [])
        .map(function (t) { return t.slice(1, -1).trim(); });
    const reserved = tokens.filter(function (t) { return PLACEHOLDERS.indexOf(t) !== -1; });
    if (reserved.length && format !== "nested") {
        return "`(" + reserved[0] + ")` only expands inside an item array, and this " +
               "heading resolves to a singleton bucket, where the literal text would " +
               "be registered instead. Give it a category that has items.";
    }
    return null;
}

const DIVIDER = "=== More complex issues ===";

function readUnsorted() {
    const text = fs.readFileSync(unsortedPath, "utf8");
    const cut = text.indexOf(DIVIDER);
    const top = cut === -1 ? text : text.slice(0, cut);
    const rest = cut === -1 ? "" : text.slice(cut);

    const blocks = [];
    let current = null;
    for (const raw of top.split("\n")) {
        const line = raw.trim();
        if (line === "") { current = null; continue; }
        // `- ` is a comment, the same as in cullDB and cleaningDB. It does not
        // start a block and it is not a tag, so a note can sit anywhere — which
        // webui2-guess.js relies on to head its output with a warning and to park
        // the tags it could not guess at.
        if (line.charAt(0) === "-" && line.charAt(1) === " ") { continue; }
        if (!current) { current = { heading: line, tags: [] }; blocks.push(current); }
        else { current.tags.push(line); }
    }
    return { blocks: blocks, rest: rest };
}

// ---------------------------------------------------------------------------
//  The writers
// ---------------------------------------------------------------------------
//  All three are surgical text edits. Re-serialising a dictionary would reformat
//  three thousand lines and throw away every comment and every hand-alignment in
//  them, so the arrays are found and written into where they sit.

// Finds the line index of `open` after `from`, then the line holding its matching
// close. Returns null when the array is written inline as `[]` — the caller
// expands that case itself.
function findBlock(lines, openPattern, from) {
    for (let i = from; i < lines.length; i++) {
        if (!openPattern.test(lines[i])) { continue; }
        if (/\[\s*\]/.test(lines[i])) { return { start: i, end: i, inline: true }; }
        for (let j = i + 1; j < lines.length; j++) {
            if (/^\s*\],?\s*$/.test(lines[j])) { return { start: i, end: j, inline: false }; }
        }
        return null;
    }
    return null;
}

function indentOf(line) { return (line.match(/^[\t ]*/) || [""])[0]; }

// Inserts `tags` into an array, expanding an inline `[]` into a block if needed.
// Returns the new lines.
function insertIntoArray(lines, block, tags) {
    if (block.inline) {
        const outer = indentOf(lines[block.start]);
        const inner = outer + (outer.indexOf("\t") !== -1 ? "\t" : "    ");
        const trailing = /\[\s*\]\s*,\s*$/.test(lines[block.start]);
        // The comma AFTER the close has to move to the new close, or `x: [],`
        // opens as `x: [,` and the leading hole reads back as undefined.
        const head = lines[block.start].replace(/\[\s*\]\s*,?\s*$/, "[");
        const body = tags.map(function (t) { return inner + JSON.stringify(t) + ","; });
        const tail = outer + "]" + (trailing ? "," : "");
        return lines.slice(0, block.start)
            .concat([head], body, [tail], lines.slice(block.start + 1));
    }
    // Match the indentation the block MOSTLY uses, not the last line's. Several
    // arrays in these files mix tabs and spaces partway through, and copying
    // whichever style the final entry happened to have looks like a mistake.
    const tally = new Map();
    for (let i = block.start + 1; i < block.end; i++) {
        if (!lines[i].trim()) { continue; }
        const style = indentOf(lines[i]);
        tally.set(style, (tally.get(style) || 0) + 1);
    }
    let inner = null, best = 0;
    for (const [style, count] of tally) {
        if (count > best) { best = count; inner = style; }
    }
    if (inner === null) {
        const outer = indentOf(lines[block.start]);
        inner = outer + (outer.indexOf("\t") !== -1 ? "\t" : "    ");
    }
    // The last entry may have no trailing comma — plenty of these arrays end
    // `"mini crown"` with nothing after it. Appending under that produces
    // `"mini crown"` then `"flaming helmet",`, which is two strings in a row and
    // a syntax error that takes the whole dictionary file with it. Give it one.
    const out = lines.slice();
    for (let i = block.end - 1; i > block.start; i--) {
        const text = out[i].trim();
        if (!text || text.charAt(0) === "/") { continue; }   // blank or comment
        if (!/,$/.test(text)) { out[i] = out[i].replace(/\s*$/, ",");  }
        break;
    }
    const body = tags.map(function (t) { return inner + JSON.stringify(t) + ","; });
    return out.slice(0, block.end).concat(body, out.slice(block.end));
}

// bodyKeywordDB / clothesKeywordDB — "category": { "item": [ … ] }
function writeNested(source, category, item, tags) {
    const lines = source.split("\n");
    const cat = findBlock(lines, new RegExp('"' + category + '"\\s*:\\s*\\{'), 0);
    let catStart = -1;
    for (let i = 0; i < lines.length; i++) {
        if (new RegExp('"' + category + '"\\s*:\\s*\\{').test(lines[i])) { catStart = i; break; }
    }
    if (catStart === -1) { throw new Error("category " + category + " not found"); }
    const block = findBlock(lines, new RegExp('"' + item + '"\\s*:\\s*\\['), catStart);
    if (!block) { throw new Error("item " + item + " not found under " + category); }
    return insertIntoArray(lines, block, tags).join("\n");
}

// singletonKeywordDB — bare key, no quotes: category: [ … ]
//
// Not every category has a bucket: bodyHead and bodyChest had none until this
// tool wanted one. Creating it is safe and needs no other change, because
// buildAllFinalKeywordSets reads `singletonsPerCategory[category] || []` and
// the category itself already exists in the keyword DB.
function writeFlat(source, category, tags) {
    let lines = source.split("\n");
    let block = findBlock(lines, new RegExp("^\\s*" + category + "\\s*:\\s*\\["), 0);
    if (!block) {
        // Add it just before the object's own closing brace — the first `};` at
        // column 0, since the file carries unrelated code after it.
        let close = -1;
        for (let i = 0; i < lines.length; i++) {
            if (/^\};/.test(lines[i])) { close = i; break; }
        }
        if (close === -1) { throw new Error("could not find the end of singletonKeywordDB"); }
        lines = lines.slice(0, close)
            .concat(["    " + category + ": [],"], lines.slice(close));
        block = findBlock(lines, new RegExp("^\\s*" + category + "\\s*:\\s*\\["), 0);
    }
    return insertIntoArray(lines, block, tags).join("\n");
}

// sceneDB — a template literal whose blocks are blank-line delimited. This is
// also the shape defaultDB, cullDB and cleaningDB's rulesets are in, which is why
// it is written against "a named block of lines" rather than against sceneDB.
function writeSection(source, section, tags) {
    const lines = source.split("\n");
    let start = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === section) { start = i; break; }
    }
    if (start === -1) { throw new Error("section " + section + " not found"); }
    let end = start + 1;
    while (end < lines.length && lines[end].trim() !== "" && !/^`;/.test(lines[end])) { end++; }
    return lines.slice(0, end).concat(tags, lines.slice(end)).join("\n");
}

// ---------------------------------------------------------------------------
//  Plan
// ---------------------------------------------------------------------------

function buildPlan(blocks, index) {
    const placements = [];   // { tag, heading, file, format, category, item, section }
    const skipped = [];      // { heading, tags, reason }
    const warnings = [];

    for (const block of blocks) {
        const route = resolveHeading(block.heading, index);
        if (route.error) {
            skipped.push({ heading: block.heading, tags: block.tags, reason: route.error });
            continue;
        }
        if (route.warn) { warnings.push(block.heading + ": " + route.warn); }

        // The seam for defaults and replacement rules. Nothing sets kind "rule"
        // yet, and this refuses rather than letting a `left ; right` line be
        // written into an array of keywords, which is what it would otherwise do.
        if (route.kind !== "tag") {
            skipped.push({ heading: block.heading, tags: block.tags,
                           reason: "routes to kind `" + route.kind + "`, and only `tag` " +
                                   "is implemented — see the routing table" });
            continue;
        }

        const entry = index.categories.get(route.category);
        const kept = [];
        const refused = [];
        for (const tag of block.tags) {
            // `(color) mushroom on head` is a legal SUBITEM — parseKeywordDB runs
            // every item array through expandPlaceholders, so it becomes 39 real
            // tags and the literal is consumed. It is NOT legal as a singleton:
            // those are added verbatim and the literal string would be registered
            // as a keyword nobody can type.
            if (tag.indexOf("(") !== -1) {
                const bad = placeholderProblem(tag, route.format);
                if (bad) { refused.push({ tag: tag, why: bad }); continue; }
            }
            let item = null, guessed = false;
            if (route.format === "nested") {
                if (route.item) { item = route.item; }
                else {
                    const chosen = chooseItem(tag, entry.items);
                    item = chosen.item;
                    guessed = !chosen.sure;
                }
            }
            placements.push({
                tag: tag,
                heading: block.heading,
                file: route.file,
                format: route.format,
                category: route.category,
                section: route.section || null,
                item: item,
                guessed: guessed
            });
        }
        for (const r of refused) {
            skipped.push({ heading: block.heading, tags: [r.tag], reason: r.why });
        }
        if (kept.length) {
            skipped.push({ heading: block.heading, tags: kept, reason: "unplaced" });
        }
    }
    return { placements, skipped, warnings };
}

// ---------------------------------------------------------------------------
//  Apply
// ---------------------------------------------------------------------------

function applyPlan(plan) {
    // Group by file so each is read once, edited, and written once.
    const byFile = new Map();
    for (const p of plan.placements) {
        if (!byFile.has(p.file)) { byFile.set(p.file, []); }
        byFile.get(p.file).push(p);
    }

    const backups = new Map();
    for (const file of byFile.keys()) {
        const full = path.join(lib, file);
        backups.set(full, fs.readFileSync(full, "utf8"));
    }
    backups.set(unsortedPath, fs.readFileSync(unsortedPath, "utf8"));

    // There is no version control here, so these are the only undo there is.
    // They go in one folder rather than beside each file, because a `.bak` in
    // libraries/ sits in the same listing as the dictionaries and is one more
    // thing to mistake for a real one.
    if (!fs.existsSync(backupDir)) { fs.mkdirSync(backupDir, { recursive: true }); }
    for (const [full, original] of backups) {
        fs.writeFileSync(path.join(backupDir, path.basename(full) + ".bak"), original, "utf8");
    }

    try {
        for (const [file, list] of byFile) {
            const full = path.join(lib, file);
            let source = backups.get(full);
            // Group again by destination array, so one splice carries every tag
            // going to the same place and the line numbers cannot drift.
            const buckets = new Map();
            for (const p of list) {
                const key = [p.format, p.category, p.item, p.section].join(SEP);
                if (!buckets.has(key)) { buckets.set(key, { p: p, tags: [] }); }
                buckets.get(key).tags.push(p.tag);
            }
            for (const { p, tags } of buckets.values()) {
                if (p.format === "nested")  { source = writeNested(source, p.category, p.item, tags); }
                else if (p.format === "flat")    { source = writeFlat(source, p.category, tags); }
                else if (p.format === "section") { source = writeSection(source, p.section, tags); }
            }
            fs.writeFileSync(full, source, "utf8");
        }

        rewriteUnsorted(plan);
        const failures = verify(plan);
        if (failures.length) {
            throw new Error("verification failed for " + failures.length + " tag(s):\n  " +
                            failures.join("\n  "));
        }
    } catch (err) {
        for (const [full, original] of backups) { fs.writeFileSync(full, original, "utf8"); }
        throw err;
    }
}

// Reload from disk and ask the engine whether each tag now answers in the
// category it was filed under. Without this the whole thing has a silent failure
// mode — a tag written into the wrong array looks fine in a diff.
function verify(plan) {
    const sandbox = loadDictionaries(true);
    // v2EnsureDictionaries runs buildFinalKeywordSets AND generateSceneCategorySet,
    // so a scene section is checked by the same pass as a keyword DB.
    vm.runInContext("v2EnsureDictionaries()", sandbox);
    // The lookup runs INSIDE the context. webui.js declares finalKeywordSet with
    // `let`, and a top-level `let` never becomes a property of a vm context's
    // global object — reading `sandbox.finalKeywordSet` gets undefined and every
    // tag then "fails", which looks exactly like a broken writer.
    sandbox.probeList = plan.placements.map(function (p) { return [p.tag, p.category]; });
    sandbox.probeReserved = PLACEHOLDERS;
    return vm.runInContext(`(function () {
        // Ask categoriesOf, NOT finalKeywordSet. Since the matcher landed, the
        // body and clothes sets are empty in lite mode and reading them directly
        // reports every single tag as missing.
        var inCategory = function (text, category) {
            return categoriesOf(text).indexOf(category) !== -1;
        };
        var reservedIn = function (text) {
            var tokens = text.match(/\\(([^)]+)\\)/g) || [];
            for (var t = 0; t < tokens.length; t++) {
                if (probeReserved.indexOf(tokens[t].slice(1, -1).trim()) !== -1) { return true; }
            }
            return false;
        };

        var out = [];
        for (var i = 0; i < probeList.length; i++) {
            var tag = probeList[i][0], category = probeList[i][1];

            // A RESERVED placeholder is consumed by expansion, so the literal is
            // not supposed to answer — one of the forms it became is. An
            // unreserved paren is part of a name and registers as written, so it
            // is checked like any ordinary tag.
            if (reservedIn(tag)) {
                var forms = expandPlaceholders(tag, modifierKeywordDB);
                if (forms.length < 2) {
                    out.push(JSON.stringify(tag) + " did not expand at all");
                } else if (!inCategory(forms[0], category) ||
                           !inCategory(forms[forms.length - 1], category)) {
                    out.push(JSON.stringify(tag) + " expanded but " +
                             JSON.stringify(forms[0]) + " is not in " + category);
                } else if (inCategory(tag, category)) {
                    out.push(JSON.stringify(tag) + " is in " + category +
                             " as a LITERAL — it should have been consumed");
                }
                continue;
            }
            if (!inCategory(tag, category)) {
                out.push(JSON.stringify(tag) + " is not in " + category);
            }
        }
        return out;
    })()`, sandbox);
}

// Placed lines go; everything else stays exactly where it was, including the
// whole of the file below the divider.
function rewriteUnsorted(plan) {
    const placed = new Set(plan.placements.map(function (p) { return p.heading + "" + SEP + "" + p.tag; }));
    const { blocks, rest } = readUnsorted();
    const out = [];
    for (const block of blocks) {
        const left = block.tags.filter(function (t) { return !placed.has(block.heading + "" + SEP + "" + t); });
        if (!left.length) { continue; }
        out.push(block.heading, ...left, "");
    }
    fs.writeFileSync(unsortedPath, out.join("\n") + "\n" + rest, "utf8");
}

// ---------------------------------------------------------------------------
//  Report
// ---------------------------------------------------------------------------

function main() {
    const index = buildIndex(loadDictionaries());

    if (dumpRoutes) {
        console.log("\nitem names   :", index.items.size);
        console.log("categories   :", index.categories.size);
        console.log("scene blocks :", index.sceneSections.size);
        return;
    }

    const { blocks } = readUnsorted();
    const plan = buildPlan(blocks, index);

    console.log("\n=== " + (apply ? "applying" : "dry run — nothing is written") + " ===\n");
    console.log("  " + blocks.length + " headings, " +
                (plan.placements.length + plan.skipped.reduce(function (n, s) {
                    return n + s.tags.length; }, 0)) + " lines above the divider");
    console.log("  " + plan.placements.length + " to place");

    // Grouped by heading, so a block whose items were ALL guessed says so once
    // rather than on every line.
    const byHeading = [];
    for (const p of plan.placements) {
        const last = byHeading[byHeading.length - 1];
        if (last && last.heading === p.heading) { last.rows.push(p); }
        else { byHeading.push({ heading: p.heading, rows: [p] }); }
    }

    let guessedBlocks = 0;
    for (const group of byHeading) {
        const first = group.rows[0];
        const dest = first.section ? first.file + " > " + first.section
                   : first.item    ? first.file + " > " + first.category + " > " + first.item
                                   : first.file + " > " + first.category;
        const allGuessed = group.rows.every(function (r) { return r.guessed; });
        if (allGuessed) { guessedBlocks++; }
        console.log("\n  " + group.heading + "  ->  " + dest +
                    (allGuessed ? "   <- item guessed for the whole block" : ""));
        for (const r of group.rows) {
            console.log("      " + r.tag + (r.guessed && !allGuessed ? "   <- item is a guess" : ""));
        }
    }

    if (guessedBlocks) {
        console.log("\n  " + guessedBlocks + " heading(s) named a category with no item to match, " +
                    "so the first item was used.\n  The CATEGORY is right either way — nothing is " +
                    "miscategorised. Write `<heading> - <item>`\n  to place it exactly, or add the " +
                    "item the tags actually want.");
    }

    if (plan.warnings.length) {
        console.log("\n--- warnings ---");
        for (const w of plan.warnings) { console.log("  " + w); }
    }

    if (plan.skipped.length) {
        console.log("\n--- left in unsorted.md ---");
        for (const s of plan.skipped) {
            console.log("\n  " + s.heading + " (" + s.tags.length + ")");
            console.log("      " + s.reason);
        }
    }

    if (!apply) {
        console.log("\n  re-run with --apply to write.\n");
        return;
    }

    applyPlan(plan);
    console.log("\n  written and verified: every placed tag answers in its category.");
    console.log("  a .bak sits beside each file it touched — that is the undo.\n");
}

main();
