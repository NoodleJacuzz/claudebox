// ============================================================================
//  WEBUI ENGINE v2 — prompt inspector
// ============================================================================
//
//    node scripts/webui/tools/webui2-inspect.js who     <character>
//    node scripts/webui/tools/webui2-inspect.js explain "<tag or shortcut>" [--as <character>]
//    node scripts/webui/tools/webui2-inspect.js cover   "<tag, tag, tag>"   [--as <character>]
//    node scripts/webui/tools/webui2-inspect.js tags    "<line as typed>"   [--as <character>]
//    node scripts/webui/tools/webui2-inspect.js audit   [<character> | all] [--purpose scene|cutin|card|none]
//
//  Four questions the dictionaries cannot be read to answer, because the answer
//  is what the ENGINE does with them, not what the line says:
//
//    who      what outfits and pose methods a character actually has
//    explain  what one shortcut expands to, and what it drags in with it
//    cover    the reverse index: which shortcut already covers the tags you
//             just typed out by hand
//    tags     a verdict per tag on a line as typed: kept, aliased, culled,
//             uncategorised or dropped. What a finished prompt cannot show.
//    audit    every method and outfit of a character compiled, then scanned
//             against the rules for WHAT THE IMAGE IS FOR (--purpose). Setting
//             contamination is always checked; tone rules only for narrative art.
//
//  Everything works by DIFFING COMPILES, never by parsing the dictionaries: a
//  baseline is compiled, then the baseline plus the thing being asked about,
//  and the difference is the answer. That survives dictionary edits and engine
//  changes, which parsing does not.
//
//  Read-only. `testing = true` stops sendPrompt before any POST.
// ============================================================================

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const here = path.join(__dirname, "..");

const elements = {};
function element(id) {
    if (!elements[id]) {
        elements[id] = {
            id: id, value: "", innerHTML: "", textContent: "",
            style: { display: "none" }, files: [],
            appendChild: function () {}, remove: function () {}
        };
    }
    return elements[id];
}

const sandbox = {
    console: { log() {}, info() {}, warn() {}, debug() {}, error() {} },
    module: undefined,
    document: {
        getElementById: element,
        createElement: function () {
            return { style: "", innerHTML: "", textContent: "", appendChild: function () {} };
        }
    },
    localStorage: {
        store: {},
        getItem: function (k) { return this.store[k] || null; },
        setItem: function (k, v) { this.store[k] = v; }
    },
    fetch: function () { throw new Error("network reached — the testing flag failed"); },
    window: {}
};
vm.createContext(sandbox);

const src = fs.readFileSync(path.join(here, "webui.js"), "utf8");
const libs = src.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1]
    .match(/"([^"]+)"/g).map(function (q) { return q.slice(1, -1); });
for (const f of libs) {
    vm.runInContext(fs.readFileSync(path.join(here, "libraries", f), "utf8"), sandbox, { filename: f });
}
for (const f of ["webui.js", "webui2-categories.js", "webui2.js"]) {
    vm.runInContext(fs.readFileSync(path.join(here, f), "utf8"), sandbox, { filename: f });
}
vm.runInContext("v2EnsureDictionaries(); testing = true; promptLayout = 'plain';", sandbox);

function tagsOf(input) {
    const job = sandbox.buildPrompt(input, "", {});
    return {
        tags: job.prompt.split(",").map(t => t.trim()).filter(Boolean),
        negative: String(job.negative || "").split(",").map(t => t.trim()).filter(Boolean)
    };
}

const baselineCache = {};
function baseline(base) {
    if (!baselineCache[base]) { baselineCache[base] = tagsOf(base); }
    return baselineCache[base];
}

// What `extra` adds on top of `base`, positively and in the negative.
function added(base, extra) {
    const a = baseline(base);
    const b = tagsOf(base + ", " + extra);
    return {
        gained: b.tags.filter(t => a.tags.indexOf(t) === -1),
        lost: a.tags.filter(t => b.tags.indexOf(t) === -1),
        negGained: b.negative.filter(t => a.negative.indexOf(t) === -1)
    };
}

// ---------------------------------------------------------------------------
//  WHAT THE IMAGE IS FOR decides which rules apply. Corrected 2026-09-20, after
//  a context-free word list reported working content as broken: it flagged
//  `hypnosis` in PoseBreakdown against the story bible's "never state the
//  mechanism". Noodle: "PoseBreakdown is a system tool used to generate
//  honeycomb breakdown cut-ins, and it worked perfectly in their cases."
//
//  So the tone rules govern SCENE art, which is narrative and public-facing,
//  and do not govern a system asset whose subject IS the thing the rule names.
//  Setting contamination is different: it is about the world, not the tone, and
//  a modern prop is wrong in a fantasy act whatever the image is for.
//
//  Extend these lists. They are the project's rules, not the engine's.
// ---------------------------------------------------------------------------
const SETTINGS = {
    fantasy: {
        label: "Honeycomb (fantasy)",
        // Always checked, whatever the image is for.
        outOfSetting: [
            "office", "computer", "laptop", "smartphone", "cellphone", "phone", "television",
            "tv", "car", "motorcycle", "classroom", "school", "school uniform", "modern",
            "skyscraper", "city", "street light", "traffic", "camera", "headphones"
        ],
        // Checked only when the purpose says this image is narrative.
        toneByPurpose: {
            scene: [
                // designBibles/story.md: "Never state the mechanism."
                "hypnosis", "hypnotic", "hypnotized", "hypnotism", "brainwashing", "brainwash",
                "mind control", "mind break", "thrall",
                // "No death, no gore. Nothing is a corpse or rots."
                "corpse", "gore", "rotting", "decay", "guro"
            ],
            // A breakdown cut-in, a Broken portrait, a damage state: the mechanism is the subject.
            cutin: ["corpse", "gore", "rotting", "guro"],
            card: ["corpse", "gore", "rotting", "guro"],
            // Ask for nothing but the setting check.
            none: []
        }
    }
};

function scan(tagArray, setting, purpose) {
    const rules = SETTINGS[setting] || SETTINGS.fantasy;
    const tone = rules.toneByPurpose[purpose || "none"] || [];
    const lower = tagArray.map(t => t.toLowerCase());
    const hit = function (list) {
        return list.filter(term => lower.some(t => t === term || t.indexOf(term) !== -1));
    };
    return { banned: hit(tone), outOfSetting: hit(rules.outOfSetting) };
}

// ---------------------------------------------------------------------------
//  charactersDB structure. Names only — what each one MEANS comes from a compile.
// ---------------------------------------------------------------------------
function characterTable() {
    const text = fs.readFileSync(path.join(here, "libraries", "charactersDB.js"), "utf8").split("\n");
    const table = {};
    let current = null;
    for (const raw of text) {
        const line = raw.trim();
        if (line.startsWith(".")) {
            const codename = line.split(";")[0].trim();
            const identity = line.indexOf(";") === -1 ? "" : line.split(";")[1].split(",")[0].trim();
            current = { codename: codename, identity: identity, outfits: [], methods: [] };
            table[codename] = current;
            continue;
        }
        if (!current || !line || line.startsWith("//") || line.indexOf(";") === -1) { continue; }
        const name = line.split(";")[0].trim();
        if (!name) { continue; }
        if (name.charAt(0) === "*") { current.outfits.push(name.slice(1)); }
        else { current.methods.push(name); }
    }
    return table;
}

function findCharacter(table, query) {
    const wanted = String(query).toLowerCase().replace(/^\./, "");
    for (const key of Object.keys(table)) {
        if (key.toLowerCase().replace(/^\./, "") === wanted) { return table[key]; }
        if (table[key].identity.toLowerCase() === wanted) { return table[key]; }
    }
    // A display name the engine knows (`nettle`) resolves through a compile.
    const probe = tagsOf(String(query));
    for (const key of Object.keys(table)) {
        if (table[key].identity && probe.tags.indexOf(table[key].identity) !== -1) { return table[key]; }
    }
    return null;
}

// ---------------------------------------------------------------------------
//  Shortcut names, for the reverse index. Names only; values come from compiles.
// ---------------------------------------------------------------------------
function shortcutNames() {
    const names = {};
    for (const file of ["defaultDB.js", "cleaningDB.js"]) {
        const text = fs.readFileSync(path.join(here, "libraries", file), "utf8").split("\n");
        for (const raw of text) {
            const line = raw.trim();
            const found = line.match(/^([A-Z][A-Za-z0-9 '\-]*);/);
            if (found) { names[found[1]] = true; }
        }
    }
    return Object.keys(names).sort();
}

// ---------------------------------------------------------------------------
//  Per-tag verdict on a line as typed. Noodle's four questions, 2026-09-20:
//
//    1. is there a shortcut that covers this, WITHOUT unwanted carry-ons
//    2. is it unrecognised (then guess a category, confirm, add)
//    3. does it have a competing alias -- "closed eyes" vs "eyes closed"
//    4. did something typed by hand get CULLED
//
//  (4) is the one worth the most. A tag lost because a shortcut expanded over it
//  is fine; a tag lost because a cleaning rule was overzealous is a bug in the
//  dictionary, and the difference is invisible from the finished prompt. His
//  test: "I wouldn't have typed both if I didn't want both."
//
//  The canonical form of a tag is found by compiling it ALONE on a bare base --
//  whatever single tag comes back is what the engine believes it is called.
// ---------------------------------------------------------------------------
function canonicalOf(tag) {
    const bare = "1girl";
    const delta = added(bare, tag);
    return delta.gained;
}

function commandTags(line, asCharacter) {
    const base = asCharacter || null;
    const typed = String(line).split(",").map(t => t.trim()).filter(Boolean);
    if (!typed.length) { console.log("nothing typed"); return 1; }

    const full = base ? base + ", " + String(line) : String(line);
    const job = sandbox.buildPrompt(full, "", {});
    const out = job.prompt.split(",").map(t => t.trim());
    const outLower = out.map(t => t.toLowerCase());
    const traced = (job.trace && job.trace.unknown) ? job.trace.unknown.map(t => t.toLowerCase()) : [];

    console.log("as typed:  " + full);
    console.log("");
    const lost = [];
    for (const tag of typed) {
        const low = tag.toLowerCase();
        const canon = canonicalOf(tag);
        const canonLower = canon.map(t => t.toLowerCase());
        const survivedSelf = outLower.indexOf(low) !== -1;
        const survivedCanon = canonLower.some(c => outLower.indexOf(c) !== -1);

        let verdict, detail = "";
        if (!canon.length) {
            verdict = "DROPPED";
            detail = "the engine produces nothing at all for this - check the spelling";
        } else if (survivedSelf) {
            verdict = "kept";
            if (traced.indexOf(low) !== -1) { verdict = "kept, UNCATEGORISED"; detail = "reaches the model raw; nothing can cull or sort it"; }
        } else if (survivedCanon) {
            verdict = "ALIASED";
            detail = "-> " + canon.filter(c => outLower.indexOf(c.toLowerCase()) !== -1).join(", ");
        } else {
            verdict = "CULLED";
            detail = "alone it gives: " + canon.join(", ");
            lost.push(tag);
        }
        console.log("  " + verdict.padEnd(20) + tag + (detail ? "   " + detail : ""));
    }

    if (lost.length) {
        console.log("");
        console.log("  " + lost.length + " tag(s) typed by hand did not reach the prompt. If they were not");
        console.log("  meant to be redundant, a cleaning rule is being overzealous - that is a");
        console.log("  dictionary bug, not a prompt bug.");
    }
    console.log("");
    console.log("  For (1), run `cover` over the distinctive tags; it names shortcuts and how many");
    console.log("  extra tags each drags in. For (2), `webui2-guess.js` proposes a category.");
    return 0;
}

// ---------------------------------------------------------------------------
//  Commands
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const command = args[0];
const flag = function (name, fallback) {
    const at = args.indexOf("--" + name);
    return at === -1 ? fallback : args[at + 1];
};
const positional = args.slice(1).filter((a, i, all) => {
    if (a.indexOf("--") === 0) { return false; }
    return !(i > 0 && all[i - 1].indexOf("--") === 0);
});

function commandWho(query) {
    const table = characterTable();
    const found = findCharacter(table, query);
    if (!found) { console.log("no character matching " + JSON.stringify(query)); return 1; }
    console.log(found.codename + "   identity tag: " + found.identity);
    console.log("");
    console.log("  OUTFITS   (naming none leaves the character with NO clothes)");
    if (!found.outfits.length) { console.log("    (none)"); }
    for (const o of found.outfits) { console.log("    " + o); }
    console.log("");
    console.log("  METHODS   (pose and body shortcuts, usable as ordinary tags)");
    if (!found.methods.length) { console.log("    (none)"); }
    for (const m of found.methods) { console.log("    " + m); }
    return 0;
}

function commandExplain(thing, asCharacter, setting, purpose) {
    const base = asCharacter || "1girl";
    const delta = added(base, thing);
    console.log(JSON.stringify(thing) + "   on top of " + JSON.stringify(base));
    console.log("");
    if (!delta.gained.length && !delta.lost.length) {
        console.log("  adds nothing — the engine does not know this tag, or it was culled.");
    }
    if (delta.gained.length) {
        console.log("  ADDS (" + delta.gained.length + "):  " + delta.gained.join(", "));
    }
    if (delta.lost.length) {
        console.log("  REMOVES:      " + delta.lost.join(", "));
    }
    if (delta.negGained.length) {
        console.log("  NEGATIVE +:   " + delta.negGained.join(", "));
    }
    const found = scan(delta.gained, setting, purpose);
    if (found.banned.length || found.outOfSetting.length) {
        console.log("");
        if (found.banned.length) { console.log("  *** BANNED FOR THIS SETTING: " + found.banned.join(", ")); }
        if (found.outOfSetting.length) { console.log("  *** OUT OF SETTING:         " + found.outOfSetting.join(", ")); }
    }
    return 0;
}

function commandCover(typed, asCharacter) {
    const base = asCharacter || "1girl";
    const wanted = String(typed).split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
    if (!wanted.length) { console.log("nothing to cover"); return 1; }
    const names = shortcutNames();
    let rows = [];
    for (const name of names) {
        // Typing the shortcut's own words back is not coverage.
        if (wanted.indexOf(name.toLowerCase()) !== -1) { continue; }
        const delta = added(base, name);
        const gained = delta.gained.map(t => t.toLowerCase());
        const hits = wanted.filter(t => gained.indexOf(t) !== -1);
        if (hits.length >= 2) {
            rows.push({
                name: name, hits: hits, extra: delta.gained.length - hits.length,
                // Alternate spellings of one shortcut expand to exactly the same thing, so the
                // expansion is the identity and the names are aliases of it.
                key: gained.slice().sort().join("|")
            });
        }
    }
    const byExpansion = {};
    for (const row of rows) {
        const seen = byExpansion[row.key];
        if (!seen) { byExpansion[row.key] = Object.assign({ aliases: [] }, row); continue; }
        seen.aliases.push(row.name);
        // Keep the shortest spelling as the one to print; it is the one worth typing.
        if (row.name.length < seen.name.length) { seen.aliases.push(seen.name); seen.name = row.name; }
    }
    rows = Object.keys(byExpansion).map(k => byExpansion[k]);
    rows.sort((a, b) => (b.hits.length - a.hits.length) || (a.extra - b.extra));
    if (!rows.length) {
        console.log("no shortcut covers two or more of those. They are worth one.");
        return 0;
    }
    console.log("shortcuts already covering what you typed:");
    console.log("");
    for (const row of rows.slice(0, 10)) {
        const alias = row.aliases.length ? "  [" + row.aliases.length + " spellings]" : "";
        console.log("  " + row.name.padEnd(18) + " covers " + row.hits.length + "/" + wanted.length +
            "  (+" + row.extra + " more)" + alias + "   " + row.hits.join(", "));
    }
    return 0;
}

function commandAudit(query, setting, purpose) {
    const table = characterTable();
    const targets = (!query || query === "all")
        ? Object.keys(table).filter(k => k.toLowerCase().indexOf(".hc") === 0).map(k => table[k])
        : [findCharacter(table, query)].filter(Boolean);
    if (!targets.length) { console.log("no character matching " + JSON.stringify(query)); return 1; }

    let problems = 0;
    for (const character of targets) {
        const outfit = character.outfits.length ? character.outfits[0] : null;
        const base = character.identity + (outfit ? ", " + outfit : "");
        const checks = character.outfits.map(o => ({ kind: "outfit", name: o, base: character.identity }))
            .concat(character.methods.map(m => ({ kind: "method", name: m, base: base })));
        const rows = [];
        for (const check of checks) {
            const delta = added(check.base, check.name);
            const found = scan(delta.gained, setting, purpose);
            if (found.banned.length || found.outOfSetting.length) {
                rows.push({ check: check, found: found });
            }
        }
        if (!rows.length) { continue; }
        console.log("");
        console.log(character.codename + "   (" + character.identity + ")");
        for (const row of rows) {
            problems += 1;
            const parts = [];
            if (row.found.banned.length) { parts.push("BANNED: " + row.found.banned.join(", ")); }
            if (row.found.outOfSetting.length) { parts.push("OUT OF SETTING: " + row.found.outOfSetting.join(", ")); }
            console.log("   " + row.check.kind.padEnd(7) + row.check.name.padEnd(18) + parts.join("   "));
        }
    }
    console.log("");
    console.log(problems + " problem(s) across " + targets.length + " character(s), setting " +
        JSON.stringify(setting) + ", purpose " + JSON.stringify(purpose || "none") + ".");
    return problems === 0 ? 0 : 1;
}

const setting = flag("setting", "fantasy");
const asCharacter = flag("as", null);
// What the image is FOR. Governs which tone rules apply; "none" checks the setting only.
const purpose = flag("purpose", "none");

switch (command) {
    case "who":     process.exit(commandWho(positional[0])); break;
    case "explain": process.exit(commandExplain(positional[0], asCharacter, setting, purpose)); break;
    case "cover":   process.exit(commandCover(positional[0], asCharacter)); break;
    case "tags":    process.exit(commandTags(positional[0], asCharacter)); break;
    case "audit":   process.exit(commandAudit(positional[0], setting, purpose)); break;
    default:
        console.log(fs.readFileSync(__filename, "utf8").split("// ====")[1].replace(/^\/\/ ?/gm, ""));
        process.exit(1);
}
