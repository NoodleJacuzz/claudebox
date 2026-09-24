// ============================================================================
//  WEBUI ENGINE v2 — prompt compiler
// ============================================================================
//
//  Loads BESIDE webui.js, not instead of it. v1 keeps working untouched; nothing
//  in this file runs until sendPromptArray branches on promptSettings.engine.
//
//  Conventions:
//    - globals, as in v1. The dictionaries are globals and the GUI is globals.
//    - v1 function names are reused wherever the job is the same.
//    - functions appear in PIPELINE ORDER, top to bottom. Phase 0 is at the top.
//    - no fetch and no document in this file. That single property is what lets
//      the engine run under node. See webui2-test.js.
//
//  All ten phases are built. Phase 0's combo mode and Phase 10's dispatch stay
//  in webui.js and are not being rewritten.
//
// ============================================================================

var v2SentinelLParen = "__lparen__";
var v2SentinelRParen = "__rparen__";

// ============================================================================
//  THE RECORD
// ============================================================================
//  One tag, plus everything the engine knows about it. Fields are set by the
//  phase named in the comment, and nothing is ever deleted — a culled record
//  keeps its text so the trace can report it and Phase 6 can argue with it.

function makeRecord(text, position) {
    return {
        text:      text,     // tokenize. canonical tag, stored UNESCAPED (Rule 1b)
        weight:    0,        // tokenize / Phase 8. paren depth, 0 = none
        emphasis:  null,     // tokenize. explicit (tag:1.4) weight, if written
        position:  position, // tokenize. input order — read only by `replace`
        sequence:  0,        // Phase 3. injection order within one position
        source:    "input",  // "input" | "engine:<rule>" | "booster"
        scope:     null,     // tokenize. index of the {…} this sits inside, or null
        owner:     null,     // Phase 2-3. subject id, or null for image-level
        categories: [],      // Phase 1. from categoryDB; may be empty, that is legal
        system:    null,     // Phase 1. {kind, consumedBy, emit} if a system keyword
        character: null,     // Phase 1. {kind, id, ...} if this names a character
        typedBoost: false,   // tokenize. YOU wrote the emphasis. See Rule 16b
        immune:    false,    // Phase 5. survives every cull
        culledBy:  null,     // Phase 5. what removed it
        strength:  null,     // Phase 5. "hard" | "fuzzy"
        booster:   false     // Phase 8. droppable for a training caption
    };
}

// A character no tag can contain. Not written as an escape - see dedupeRecords.
var v2KeySeparator = String.fromCharCode(0);

// ----------------------------------------------------------------------------
//  Rule 2c — a tag in SINGLE quotes is PROTECTED
// ----------------------------------------------------------------------------
//  `'pain'` reaches Stable Diffusion as `pain` and as nothing else. Stronger than
//  Rule 2b's double quotes, which only stop a REWRITE: a protected tag is never
//  rewritten, never culled, never negated, and never TRIGGERS anything - no rule,
//  alias, default, booster, count or focus decision reads it - so no carry-ons
//  ride along with it. It is still sorted into place and still carries its
//  emphasis: `('pain':1.2)` renders `(pain:1.2)`. What is inside the quotes is
//  kept exactly as typed, underscores included, so a LoRA trigger that wants
//  `huge_condom` can be typed as `'huge_condom'`.
//
//  How: before anything else reads the prompt, each protected tag's text is
//  swapped for a placeholder made of v2ProtectMark and a number. No dictionary
//  entry can contain that character, so every pass - the substring cleaning in
//  text space included - walks straight past it. restoreProtectedTags puts the
//  text back just before render.
//
//  WHOLE TAG ONLY. The quotes must open and close the tag (emphasis parens and a
//  `:weight` may sit outside them), so `another's hand` and `witch's broom` are
//  ordinary tags, and `'witch's broom'` is a protected one.
//
//  Input space only. Inside a DICTIONARY field a quoted term is a substring
//  (Rule 24; cullDB's `'see-through'`). Same character, separate spaces.
//  Added 2026-09-14 for the Honeycomb art pipeline.
var v2ProtectMark = String.fromCharCode(1);
var v2ProtectedTagPattern = /(^|[,\n{}])([ \t]*\(*[ \t]*)'([^\n,{}]*)'((?:[ \t]*:[ \t]*-?\d*\.?\d+)?[ \t]*\)*[ \t]*)(?=$|[,\n{}])/g;
var v2ProtectPlaceholderPattern = new RegExp(v2ProtectMark + "(\\d+)" + v2ProtectMark, "g");

function protectQuotedTags(text, job) {
    return String(text == null ? "" : text).replace(v2ProtectedTagPattern, function (whole, boundary, before, inner, after) {
        var tag = inner.trim();
        if (tag === "") { return whole; }
        return boundary + before + protectedPlaceholder(tag, job) + after;
    });
}

// The placeholder for one protected tag's text. One per distinct text, so a
// protected tag written twice is one tag to dedupe rather than two.
function protectedPlaceholder(tag, job) {
    job.protectedTags = job.protectedTags || [];
    var index = job.protectedTags.indexOf(tag);
    if (index < 0) { index = job.protectedTags.push(tag) - 1; }
    return v2ProtectMark + index + v2ProtectMark;
}

// DICTIONARY VALUES TOO (2026-09-14, step 3 of the art pipeline). A tag a
// character entry, an outfit or a replacement line writes as `'wide hips'` is
// protected exactly as a typed one is: every injected tag passes addRecord, and
// addRecord turns a wholly single-quoted text into its placeholder. Only the
// VALUE half of a dictionary line is ever injected; a quoted REQUIREMENT is still
// Rule 24's substring and never reaches here.
function singleQuotedInner(text) {
    var trimmed = String(text).trim();
    if (trimmed.length < 3 || trimmed.charAt(0) !== "'" || trimmed.charAt(trimmed.length - 1) !== "'") { return null; }
    var inner = trimmed.slice(1, -1).trim();
    return inner === "" ? null : inner;
}

// The same protection for the two injection paths that do NOT pass addRecord:
// a cleaning rule's replacement (applyRulesInView) and the HEAD of an entry
// replacement (applyReplacementTo / fanOutReplacement). addRecord already
// protects its own text — see the comment above — so this is only needed where
// the engine assigns record.text itself. Added 2026-09-14, step 6 of the art
// pipeline: the global CORE rule writes `'pain'`, which is injected by cleaning
// and would otherwise reach the model as the literal tag `'pain'` while the
// typed template emitted `pain`.
function protectDictionaryValue(text, job) {
    var inner = singleQuotedInner(text);
    return inner != null ? protectedPlaceholder(inner, job) : text;
}

// Whether a record is still standing in for a protected tag.
function isProtectedPlaceholder(text) {
    return String(text).indexOf(v2ProtectMark) !== -1;
}

// Phase 9's doorstep. The text comes back unescaped (Rule 1b: render escapes
// once), and the categories are read off the real tag so it sorts where it
// belongs. Nothing after this point adds, culls or rewrites.
function restoreProtectedTags(records, job) {
    if (!job.protectedTags || !job.protectedTags.length) { return records; }
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (!isProtectedPlaceholder(record.text)) { continue; }
        record.text = record.text.replace(v2ProtectPlaceholderPattern, function (m, index) {
            return job.protectedTags[Number(index)].replace(/\\\(/g, "(").replace(/\\\)/g, ")");
        });
        record.protected = true;
        record.categories = categoriesOf(record.text);
    }
    return records;
}

// Live records only — culled ones stay in the array with culledBy set.
function livingRecords(records) {
    return records.filter(function (r) { return r.culledBy == null; });
}

// ============================================================================
//  PHASE 0 — ASSEMBLY
// ============================================================================

// ----------------------------------------------------------------------------
//  Determinism: the seed
// ----------------------------------------------------------------------------
//  SKYBOXES.md D·4. The skybox system picks decorations at random, and that
//  randomness has to satisfy three things at once:
//
//    reproducible   the same input always gives the same furniture, so an image
//                   can be regenerated from the prompt alone. Regional
//                   Prompting already writes the raw input into the footer for
//                   exactly this, and an unrecorded seed would have quietly
//                   broken that promise.
//    stable across  every job in a COMBO run draws the same decorations. This is
//    a combo run    the original requirement and it is why the hash is taken in
//                   webui.js BEFORE assemblePrompt splits the block. Hashing a
//                   single job's own text would change the furniture shot to
//                   shot, which is the thing the spec set out to prevent.
//    varied         two unrelated prompts get unrelated rooms.
//
//  A random seed satisfies the last only, and Forge's own seed was rejected
//  because it cannot be known in advance without reimplementing Forge.
//
//  Prompt LENGTH alone was the first idea and it collides badly — a great many
//  different prompts share a length and would all get identical furniture. This
//  is FNV-1a over the whole string: four lines, no collisions worth worrying
//  about, and every character contributes.

function v2HashString(text) {
    var str = String(text == null ? "" : text);
    var hash = 0x811C9DC5;                       // FNV offset basis
    for (var i = 0; i < str.length; i++) {
        hash = hash ^ str.charCodeAt(i);
        // Multiply by the FNV prime, 16777619, written as shift-adds. That is
        // the standard formulation and it stays inside 32 bits at every step;
        // `hash * 16777619` would go through a double and lose the low bits.
        hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) +
                       (hash << 8) + (hash << 24)) >>> 0;
    }
    return hash >>> 0;
}

// mulberry32, the same generator Clacks uses (scripts/misc/clacks.js). Borrowed
// rather than invented so there is one PRNG in the project and one thing to
// trust. Returns a FUNCTION holding its own state: every job gets a fresh
// generator from the shared seed, because a shared STREAM would let job 2
// continue where job 1 stopped and hand it different decorations.
function v2MakeRng(seed) {
    var state = seed >>> 0;
    return function () {
        state = (state + 0x6D2B79F5) >>> 0;
        var t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t = t ^ (t + Math.imul(t ^ (t >>> 7), t | 61));
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Fisher-Yates against a seeded generator. Exists because the decoration pass
// walks sets in order and stops at the first refusal, so whichever set is
// listed first was being systematically favoured (SKYBOXES.md D·5). Shuffling
// removes the bias and stays reproducible. Returns a new array.
function v2ShuffleSeeded(list, rng) {
    var out = list.slice();
    for (var i = out.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var swap = out[i];
        out[i] = out[j];
        out[j] = swap;
    }
    return out;
}

// The one entry point. Plain data in, plain data out. Dispatch stays in
// webui.js; this returns finished strings and never sends them.
function buildPrompt(input, negative, settings) {
    settings = settings || {};

    // ---- THE INLINE NEGATIVE ---------------------------------------------
    // `1girl, solo, negative: 1boy` — a failed attempt at a negative prompt, and
    // the fix for it is a split, not a rule. Done here, first, on the raw string:
    // everything downstream then sees an ordinary prompt and an ordinary negative
    // and needs to know nothing about the marker.
    //
    // Before the seed is hashed, so the seed reflects the prompt that was
    // actually compiled rather than the marker text that never reaches an image.
    var inline = extractInlineNegative(input);
    input = inline.prompt;
    if (inline.negative) {
        negative = (negative && String(negative).trim())
                     ? String(negative).trim().replace(/,\s*$/, "") + ", " + inline.negative
                     : inline.negative;
    }

    // `promptSeed` is handed down from Phase 0 in webui.js, hashed off the whole
    // typed block before it was split, so every job in a combo run shares it.
    //
    // The fallback hashes THIS job's own input, which keeps every direct caller
    // deterministic without knowing the scheme exists — `buildPrompt(x, "", {})`
    // always compiles the same way, so the headless harness needs no seed
    // plumbing and its expectations cannot drift run to run.
    //
    // NOT to be confused with Forge's `seed` in the request object, which is the
    // image generation seed and is unrelated. Hence the name.
    var promptSeed = (settings.promptSeed != null) ? (settings.promptSeed >>> 0)
                                                   : v2HashString(input);

    var job = {
        prompt:   "",
        negative: negative || "",
        lora:     [],
        scopes:   [],
        subjects: [],
        solo:     true,      // Phase 2. one figure in the shot
        uniform:  true,      // Phase 2. an unowned tag applies to every figure
        seed:     promptSeed,          // Phase 0. reported, so a room is traceable
        rng:      v2MakeRng(promptSeed), // Phase 0. a FRESH generator per job
        size:     null,      // Phase 1. a basicImageSizes id the prompt asked for
        style:    null,      // Phase 1. a basicStyleArray id the prompt asked for
        // Phase 1. `aspect: portrat` — a prefix was written and its argument
        // names nothing. The browser only warns, but a caller with no console in
        // front of the user needs it as data, so it is reported here as well as
        // in trace.unmatched, which several other phases also write to.
        dispatchErrors: [],
        trace:    { added: [], declined: [], culled: [], unknown: [], unmatched: [], conflicts: [] },
        errors:   [],
        protectedTags: []    // Rule 2c. the text of each `'protected'` tag, by placeholder number
    };

    // Rule 2c. First, so no pass - text space included - ever sees what is inside.
    input = protectQuotedTags(input, job);

    var records = promptLex(input, job);

    records = promptScope(records, job);       // Phase 2
    records = promptExpand(records, job);      // Phase 3
    records = promptResolve(records, job);     // Phase 4
    records = promptCull(records, job);        // Phase 5-6
    records = promptNegative(records, job);    // Phase 7
    records = promptBoosters(records, job);    // Phase 8
    records = restoreProtectedTags(records, job); // Rule 2c. placeholders become their tags

    job.prompt = promptRender(records, job);   // Phase 9

    // The contracted render is the same string with every `booster` record
    // dropped — what a TRAINING CAPTION should say, since a booster is there to
    // steer generation and describes nothing that is in the picture. A booster
    // that survives contraction is the bug this exists to catch.
    job.contracted = promptRender(records, job, { contracted: true });
    job.training = records.some(function (r) {
        return r.culledBy == null && r.system && r.system.kind === "output mode";
    });

    job.records = records;
    return job;
}

// ============================================================================
//  PHASE 1 — INITIAL CLEANUP
// ============================================================================
//  Text space above the tokenize line, tag space below. Parenthesis is resolved
//  exactly once, at the boundary, and never revisited (Rule 1).

function promptLex(input, job) {
    var text = String(input == null ? "" : input);

    // ---- text space ----------------------------------------------------
    text = liftLoraReferences(text, job);
    text = foldNewlines(text);
    v2EnsureDictionaries();
    text = applyTopLevelCleaning(text, job);
    // v1's, called rather than copied. It rolls the dice, so it has to happen
    // once and before tokenize — after it, the choice is an ordinary tag and
    // nothing downstream needs to know it was ever random.
    if (typeof replaceWildcards === "function") { text = replaceWildcards(text); }
    text = tidySpacing(text);

    // ---- ═══ TOKENIZE ═══ -----------------------------------------------
    var records = tokenizePrompt(text, job);

    // ---- tag space -------------------------------------------------------
    v2EnsureDictionaries();
    records = purgeRemoveme(records, job);
    // Before the rule engine on purpose: `portrait` and `landscape` are ordinary
    // words and a cleaning rule is entitled to rewrite them, which would leave the
    // directive unreadable by the time anything looked for it.
    records = consumeDispatchKeywords(records, job);
    records = applyRules(records, rulesArrayInitial, job);  // errors, misspellings, purges
    records = markSystemKeywords(records, job);
    records = applyAliases(records, job);
    records = normalizeCharacterTags(records, job);
    records = assignCategories(records, job);
    records = dedupeRecords(records, job);
    return records;
}

// ---------------------------------------------------------------------------
//  Category membership
// ---------------------------------------------------------------------------
//  finalKeywordSet is category -> Set(tags). Everything downstream asks the
//  opposite question.
//
//  **Do not build a reverse index.** It is the obvious answer and it does not
//  fit in memory: the placeholder expansion means finalKeywordSet holds
//  4.2 MILLION keywords — `bodyHair` alone is 468,895 — and an object mapping
//  each to an array of its categories runs the heap out before a single prompt
//  compiles. There were 129 categories; asking each of them directly is 129
//  hash lookups, allocates nothing, and is what v1 has always done.
//
//  A tag with no category is legal and common - 30% of the character DB and
//  about half of everyday tags are in none. Those simply never cull and never
//  sort, and show up in the unknown-keyword trace.

// Bounded by the number of distinct tags actually seen, not by the dictionary.
var v2CategoryCache = {};
var v2MatcherWarned = false;

// Tags are held unescaped (Rule 1b) but finalKeywordSet holds both forms, so a
// lookup on the bare text finds the escaped registration too.
//
// TWO SOURCES, and which one answers depends on the domain:
//
//   body + clothes   webui2-categories.js, which takes the tag APART instead of
//                    looking it up. 8,042,478 pre-expanded keywords against 2,889
//                    base terms — and the pre-expanded ones are not built at all
//                    when buildFinalKeywordSets ran in "lite" mode.
//   scene + backgrnd finalKeywordSet, still pre-expanded. 47 K between them, and
//                    the matcher does not model their generators.
//
// The set loop still runs over everything: in lite mode the body and clothes
// entries are empty and contribute nothing, and if something has since forced a
// full build (the v1 path does) they would answer twice, so the merge dedupes.
// Equivalence is pinned by webui2-category-test.js — 0 misses, 0 disagreements.
function categoriesOf(text) {
    var key = String(text == null ? "" : text);
    if (Object.prototype.hasOwnProperty.call(v2CategoryCache, key)) { return v2CategoryCache[key]; }

    var found = [];
    var seen = {};
    var push = function (category) {
        if (seen[category]) { return; }
        seen[category] = true;
        found.push(category);
    };

    if (typeof v2CategoriesOf === "function") {
        var matched = v2CategoriesOf(key);
        for (var m = 0; m < matched.length; m++) { push(matched[m]); }
    } else if (typeof finalKeywordSetMode !== "undefined" && finalKeywordSetMode === "lite") {
        // THE silent failure this swap could have had. Lite mode means nothing
        // generated the body and clothes members, so if the matcher is also
        // missing then every one of those tags quietly has no category: it stops
        // culling, stops sorting, and nothing throws. Say so, loudly, once.
        if (!v2MatcherWarned) {
            v2MatcherWarned = true;
            console.error("webui2-categories.js is not loaded, and the keyword sets were " +
                          "built in lite mode. Every body and clothes tag will read as " +
                          "uncategorised. Load it before webui2.js, or build the sets full.");
        }
    }

    if (typeof finalKeywordSet !== "undefined" && finalKeywordSet) {
        var lower = key.toLowerCase();
        for (var category in finalKeywordSet) {
            if (!Object.prototype.hasOwnProperty.call(finalKeywordSet, category)) { continue; }
            var set = finalKeywordSet[category];
            if (!set || typeof set.has !== "function" || set.size === 0) { continue; }
            if (set.has(key) || (lower !== key && set.has(lower))) { push(category); }
        }
    }
    v2CategoryCache[key] = found;
    return found;
}

function assignCategories(records, job) {
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.culledBy != null) { continue; }
        record.categories = categoriesOf(record.text);
        // A protected tag's placeholder is not an unknown tag (Rule 2c).
        if (!record.categories.length && !record.system && !record.character && !isProtectedPlaceholder(record.text)) {
            job.trace.unknown.push(record.text);
        }
    }
    return records;
}

// `removeme` is the delete sentinel, produced by applyTopLevelCleaning. Some
// entries replace a whole tag ("rating:explicit" -> "removeme"), others replace
// only a suffix (" (enlargement)" -> "removeme"), which leaves the sentinel
// fused to the remaining text: "anus growth (enlargement)" becomes
// "anus growthremoveme".
//
// v1 has the same behaviour and no whole-tag rule matches the fused form, so
// those tags survive mangled. Testing containment rather than equality makes the
// sentinel mean what it was named to mean in both shapes.
function purgeRemoveme(records, job) {
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.culledBy != null) { continue; }
        if (record.text.indexOf("removeme") === -1) { continue; }
        record.culledBy = "removeme";
        record.strength = "hard";
        job.trace.culled.push({ text: record.text, rule: "removeme sentinel" });
    }
    return records;
}

// ---------------------------------------------------------------------------
//  Aliases
// ---------------------------------------------------------------------------
//  An alias is a tag that should be CONTRACTED but never EXPANDED TO. That is
//  the line between this list and the booster list, and why they cannot share
//  a file:
//
//    booster   heavy blush -> full-face blush
//              improves generation, so it belongs in the output. Dropped from a
//              training caption, which is what `booster` on the record marks.
//
//    alias     mouth shut -> mouth closed
//              no improvement, so it belongs nowhere. Collapsed on sight, in
//              both the output and the training caption.
//
//  cleaningAliasList holds one group per line, canonical term first:
//      "1girl, female, 1girls, woman"
//  Every non-canonical member collapses to the first entry.
//
//  This pass never fired in v1: replaceAliasCleanup indexes an array of strings
//  as though each entry were a two-element array, so [i][0] is a single
//  character and nothing ever matches. ~131 groups have been dormant.

var v2AliasMap = null;

function buildAliasMap() {
    if (v2AliasMap) { return v2AliasMap; }
    v2AliasMap = {};
    if (typeof cleaningAliasList === "undefined") { return v2AliasMap; }
    for (var i = 0; i < cleaningAliasList.length; i++) {
        var line = cleaningAliasList[i];
        if (typeof line !== "string" || line === "") { continue; }
        var members = line.split(",").map(function (t) { return t.trim(); })
                          .filter(function (t) { return t !== ""; });
        if (members.length < 2) { continue; }
        var canonical = members[0];
        for (var m = 1; m < members.length; m++) {
            // Keyed lowercase, valued as written: every lookup in this file
            // lowercases, and a dictionary line that capitalised a member would
            // otherwise register a key nothing can reach.
            if (members[m] !== canonical) { v2AliasMap[members[m].toLowerCase()] = canonical; }
        }
    }
    return v2AliasMap;
}

// The canonical form of a tag, or the tag itself. Phase 1 runs this over the
// typed prompt; the gate runs it over everything the engine injects, because a
// dictionary entry is written the natural way — charactersDB says `female`, and
// `1girl` is what has to reach the gate and the output.
function canonicalAlias(text) {
    var key = String(text).toLowerCase();
    if (v2GenderTerms[key]) { return text; }
    var map = buildAliasMap();
    return map[key] || text;
}

// ---------------------------------------------------------------------------
//  `male` and `female` are held back for Phase 4
// ---------------------------------------------------------------------------
//  They are stored in charactersDB because writing one word per character is the
//  convenient thing, and they resolve to FOUR different tags depending on what
//  the figure turns out to be — `1girl` or `furry female`, `1boy` or `furry male`.
//
//  That decision cannot be made until Phase 3 has expanded everyone, so every
//  earlier pass that would rewrite them is held off: the alias collapse above,
//  and the `female; 1girl [...]` / `male; 1boy [...]` rules in cleaningArrayInitial.
//
//  Those two rules are NOT deleted. v1 is the daily driver and still needs them —
//  it has no Phase 4 to defer to. They are skipped here and nowhere else.

var v2GenderTerms = { "male": true, "female": true };

function isSupersededRule(rule) {
    var targets = splitRuleField(rule.target);
    if (targets.length !== 1) { return false; }
    var target = targets[0].toLowerCase();
    if (v2GenderTerms[target]) { return true; }
    // v1 purges `1girl` the moment `2girls` appears, because its prompt is flat
    // and a second `1girl` could only be noise. v2 gives every figure her own,
    // and `supersedeSoloCounts` is the only thing that can tell a loose `1girl`
    // from one that belongs to somebody. Same reasoning, better information.
    if (v2SupersededBy[target] && !rule.replacement) { return true; }
    return false;
}

function applyAliases(records, job) {
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.culledBy != null || record.system || record.literal) { continue; }
        var canonical = canonicalAlias(record.text);
        if (canonical === record.text) { continue; }
        job.trace.added.push({
            text: canonical,
            rule: "alias: " + record.text + " -> " + canonical,
            owner: record.owner
        });
        record.text = canonical;
        record.source = "engine:alias";
    }
    return records;
}

// ---------------------------------------------------------------------------
//  Character tag normalization
// ---------------------------------------------------------------------------
//  Runs before Phase 2, which identifies the subjects present and cannot do so
//  against un-normalized references.
//
//  Two independent naming systems resolve here:
//
//    codenames   ".syrupcarp" - an entry in cleanedCharacterArray. aliasDB maps
//                display names onto them, so ".ashley graham" -> ".rainyashley".
//                Expansion into the character tags is Phase 3, not here.
//
//    booru names "frieren" - a name in namesArray, which is franchise-grouped:
//                a franchise line, its characters, then a blank line. The
//                franchise-qualified form is recorded on the record, but the
//                text is NOT rewritten: v1 emits the bare name, and changing
//                that would alter every prompt naming a character.
//
//  Either way the record gains `character`, which is what Phase 2 reads.

var v2CharacterIndex = null;

// Every character name is reachable with a leading dot whether or not the block
// spells that form out — `.frieren` works because `frieren` is in her block, and
// nobody has to double the length of brandsDB2 by hand.
//
// A block still writes the dotted form out where the bare word is a real tag in
// its own right. Fern's block lists `.fern` and deliberately does NOT list
// `fern`, because `fern` is a plant and typing it must not summon her. Deriving
// only ever ADDS the dot and never strips it, so withholding the bare word
// still works exactly as intended.
//
// Derived forms never overwrite. A name written into a block wins, and the first
// block to claim a spelling keeps it.
// A generic term gets no dotted twin. The dot is how you summon a figure, and
// `.activision` is not a thing anybody means.
function registerName(index, tag, record, generic) {
    var key = String(tag).trim().toLowerCase();
    if (!key) { return; }
    index.names[key] = record;
    if (generic || key.charAt(0) === ".") { return; }
    var dotted = "." + key;
    if (!index.names[dotted]) { index.names[dotted] = record; }
}

function buildCharacterIndex() {
    if (v2CharacterIndex) { return v2CharacterIndex; }
    var index = { codenames: {}, aliases: {}, names: {} };

    if (typeof cleanedCharacterArray !== "undefined") {
        for (var c = 0; c < cleanedCharacterArray.length; c++) {
            var entry = cleanedCharacterArray[c];
            if (!entry || !entry.codename) { continue; }
            index.codenames[String(entry.codename).trim().toLowerCase()] = entry;
        }
    }
    if (typeof cleanedAliasArray !== "undefined") {
        for (var a = 0; a < cleanedAliasArray.length; a++) {
            var alias = cleanedAliasArray[a];
            if (!alias || !alias.target || !alias.replacement) { continue; }
            // Registered BOTH ways. aliasDB stores display names without the dot
            // ("Angelica" -> "FurMayor") and v1 matches the bare form, so typing
            // `angelica` has always worked and has to keep working. The dotted
            // form is the deliberate one.
            var target = String(alias.target).trim().toLowerCase();
            var replacement = "." + String(alias.replacement).trim().toLowerCase();
            index.aliases["." + target] = replacement;
            if (!index.aliases[target]) { index.aliases[target] = replacement; }
        }
    }
    // basicShortcutArray is v1's display-name table and it is THE place a Syrup
    // Town name is linked to a character — `angelica` -> `.syrupMayor`. v2 read
    // none of it until 2026-08-17, which is why aliasDB had grown a duplicate
    // copy of the same mappings: two lists answering one question, in two files,
    // drifting apart. The shortcut list wins that argument because it is where
    // Noodle maintains it.
    //
    // Folded into the same map as aliasDB so a shortcut behaves identically to an
    // alias everywhere downstream — including through `resolveSyrupVariant`,
    // which is what turns the `.syrup` stem into the form this prompt asked for.
    // Registered only if nothing already claims the key, so a real names block or
    // an aliasDB line still outranks a shortcut.
    if (typeof basicShortcutArray !== "undefined" && basicShortcutArray.length) {
        for (var s = 0; s < basicShortcutArray.length; s++) {
            var pair = basicShortcutArray[s];
            if (!pair || pair.length < 2) { continue; }
            var word = String(pair[0]).trim().toLowerCase();
            var code = String(pair[1]).trim().toLowerCase();
            if (!word || !code) { continue; }
            if (code.charAt(0) !== ".") { code = "." + code; }
            if (!index.aliases[word])       { index.aliases[word] = code; }
            if (!index.aliases["." + word]) { index.aliases["." + word] = code; }
        }
    }
    // cleanedNamesArray is built by cleanupNamesArray (webui.js) from the block
    // format in brandsDB2.js. Every tag in a block - canonical or alias - resolves
    // to the same character, and every block sits under a curated franchise, so
    // membership alone is enough to call it a character.
    //
    // Franchise names are NOT characters. They are registered separately as
    // `brand`, which is what keeps Phase 2 from counting "palworld" as a figure
    // in the image.
    if (typeof cleanedNamesArray !== "undefined") {
        for (var n = 0; n < cleanedNamesArray.length; n++) {
            var block = cleanedNamesArray[n];
            if (!block || !block.canonical) { continue; }
            // A generic term is a brand keyword that is not a figure - a studio,
            // a series, a species marker. Same `brand` kind a franchise gets,
            // which is what keeps Phase 2 from counting "activision" as someone
            // in the picture.
            var record = {
                kind: block.generic ? "brand" : "character",
                name: block.canonical,
                franchise: block.franchise || null,
                qualified: block.canonical
            };
            registerName(index, block.canonical, record, block.generic);
            for (var a = 0; a < block.aliases.length; a++) {
                registerName(index, block.aliases[a], record, block.generic);
            }
        }
    }
    // A names block reaches its character data through a codename alias. This is
    // why codenames were mined into brandsDB2: without it, "frieren (sousou no
    // frieren)" and ".frieren" are two unrelated strings.
    //
    // The dotted form is DERIVED, not typed (see registerName), so a block only
    // needs to spell one out when the bare word is dangerous on its own —
    // `fern` is a real plant tag, `frieren` is nobody but her.
    for (var key in index.names) {
        if (!Object.prototype.hasOwnProperty.call(index.names, key)) { continue; }
        var namesRecord = index.names[key];
        if (namesRecord.entry) { continue; }
        var block = typeof namesByTag !== "undefined" ? namesByTag[key] : null;
        if (!block) { continue; }
        // TWO PASSES, and the order is the whole point. A block's names can match
        // both a curated entry and an imported one — `rosalina` is an alias of
        // `.marioRosalina` (charactersDB, with outfits) and of `.rosalina`
        // (charactersDB2, without) — and taking the first candidate in list order
        // handed the character to whichever the block happened to list first.
        //
        // `handWritten` is stamped in webui.js at the one moment the two files
        // are still distinguishable. A curated entry wins outright; the import is
        // the fallback, which is what it is for.
        var candidates = [block.canonical].concat(block.aliases || []);
        var fallback = null;
        for (var c = 0; c < candidates.length; c++) {
            var bare = String(candidates[c]).toLowerCase();
            var code = bare.charAt(0) === "." ? bare : "." + bare;
            var hit = index.codenames[code];
            if (!hit) { continue; }
            if (hit.handWritten) {
                namesRecord.entry = hit;
                namesRecord.codename = code;
                fallback = null;
                break;
            }
            if (!fallback) { fallback = { entry: hit, code: code }; }
        }
        if (fallback) {
            namesRecord.entry = fallback.entry;
            namesRecord.codename = fallback.code;
        }
    }
    // An entry whose identity tag nothing else claims registers it as a name, so
    // she can be summoned by typing the tag rather than only by her dotted
    // codename. This is what makes a bulk import usable: 23,931 animadex entries
    // carry their canonical booru tag as both codename and first tag, and only
    // 1,552 of them have a brandsDB2 block — the rest were reachable solely as
    // `.<tag>`, and most of those tags carry parens the input syntax reads as
    // emphasis. An original character in charactersDB gets the same benefit;
    // `sy-doe` was already reachable this way through `resolveCharacterCodename`.
    //
    // The identity-tag guard is that function's, for the same reason: 46 entries
    // lead with a descriptive keyword rather than a name — `.furgekka` with
    // `1boy`, `.mysticImp` with `black skin` — and without it typing `1boy` would
    // summon whichever of them won the map. An identity tag is in no category at
    // all, or in bodyBrand and nothing else.
    //
    // Registered LAST, so anything with a real names block or an aliasDB entry
    // has already claimed the key and keeps it.
    for (var code in index.codenames) {
        if (!Object.prototype.hasOwnProperty.call(index.codenames, code)) { continue; }
        var owned = index.codenames[code];
        var identity = firstStoredTag(owned);
        if (!identity) { continue; }
        var identityKey = String(identity).toLowerCase();
        if (index.names[identityKey] || index.aliases[identityKey]) { continue; }
        var identityCats = categoriesOf(identity);
        if (identityCats.length &&
            !(identityCats.length === 1 && identityCats[0] === "bodyBrand")) { continue; }
        index.names[identityKey] = {
            kind: "character",
            name: identity,
            franchise: null,
            qualified: identity,
            entry: owned,
            codename: code
        };
    }

    // SEX TWINS (2026-09-14, the Honeycomb art pipeline, and the first piece of
    // gender swap). An original character written twice, once `female` and once
    // `male`, with the SAME identity tag, is one character in two sexes: Honeycomb's
    // `.hcKnightV` and `.hcKnightC` both lead with `hc-kn1ght`. Typing the identity
    // tag used to summon whichever entry registered it first, so a male prompt got
    // the female body. index.sexTwins lets normalizeCharacterTags pick by the sex
    // the prompt asks for (see resolveSexTwin). An explicit dotted codename is never
    // second-guessed.
    index.sexTwins = {};
    for (var twinCode in index.codenames) {
        if (!Object.prototype.hasOwnProperty.call(index.codenames, twinCode)) { continue; }
        var twinEntry = index.codenames[twinCode];
        var twinIdentity = firstStoredTag(twinEntry);
        var twinSex = storedEntrySex(twinEntry);
        if (!twinIdentity || !twinSex) { continue; }
        var twinKey = String(twinIdentity).toLowerCase();
        if (!index.sexTwins[twinKey]) { index.sexTwins[twinKey] = {}; }
        if (!index.sexTwins[twinKey][twinSex]) { index.sexTwins[twinKey][twinSex] = twinCode; }
    }
    for (var pairKey in index.sexTwins) {
        if (!Object.prototype.hasOwnProperty.call(index.sexTwins, pairKey)) { continue; }
        var pair = index.sexTwins[pairKey];
        if (!pair.female || !pair.male) { delete index.sexTwins[pairKey]; }
    }

    if (typeof franchiseList !== "undefined") {
        for (var f = 0; f < franchiseList.length; f++) {
            var key = String(franchiseList[f]).toLowerCase();
            if (index.names[key]) { continue; }   // a character of the same name wins
            index.names[key] = {
                kind: "brand",
                name: franchiseList[f],
                franchise: franchiseList[f],
                qualified: franchiseList[f]
            };
        }
    }
    v2CharacterIndex = index;
    return index;
}

function firstStoredTag(entry) {
    if (!entry || !entry.prompt) { return null; }
    var tags = splitStoredPrompt(entry.prompt);
    return tags.length ? tags[0].text : null;
}

// The sex an entry's own prompt states, from its gender word or count tag, or null.
var v2FemaleSexWords = ["female", "1girl"];
var v2MaleSexWords = ["male", "1boy"];
// `genderswap` and its variants, now that cleaningDB no longer culls them.
// `(ftm)`/`(mtf)` name the target sex outright; bare `genderswap` flips away
// from whichever twin the name would otherwise default to. `(fti)`/`(mti)`
// end at intersex, which a two-sex twin map cannot express, so they decide
// nothing here and survive as ordinary tags.
var v2GenderswapFemaleWords = ["genderswap (mtf)"];
var v2GenderswapMaleWords = ["genderswap (ftm)"];
var v2GenderswapFlipWords = ["genderswap"];
function storedEntrySex(entry) {
    if (!entry || !entry.prompt) { return null; }
    var tags = splitStoredPrompt(entry.prompt).map(function (tag) { return tag.text.toLowerCase(); });
    var female = tags.some(function (t) { return v2FemaleSexWords.indexOf(t) !== -1; });
    var male = tags.some(function (t) { return v2MaleSexWords.indexOf(t) !== -1; });
    return female === male ? null : (female ? "female" : "male");
}

// Which twin a name should summon: the one whose sex the figure's own tags (same
// scope) or the image-level tags ask for. Returns a codename, or null to leave the
// name as it resolved. Both sexes asked for at once, or neither, decides nothing.
//
// `identityKey` is the resolved CANONICAL tag, not the word typed, so an alias
// (`brienne`) reaches the same pair as the identity tag (`hc-kn1ght`). And
// `defaultCode` is the entry the name would otherwise use, which is what a bare
// `genderswap` flips away from.
function resolveSexTwin(identityKey, record, records, defaultCode) {
    var index = buildCharacterIndex();
    var pair = index.sexTwins ? index.sexTwins[identityKey] : null;
    if (!pair) { return null; }
    var wantsFemale = false, wantsMale = false;
    var explicitFemale = false, explicitMale = false;
    var swapFemale = false, swapMale = false, flip = false;
    for (var i = 0; i < records.length; i++) {
        var other = records[i];
        if (other === record || other.culledBy != null) { continue; }
        if (other.scope != null && other.scope !== record.scope) { continue; }
        var text = String(other.text).toLowerCase();
        if (v2FemaleSexWords.indexOf(text) !== -1) { explicitFemale = true; }
        if (v2MaleSexWords.indexOf(text) !== -1) { explicitMale = true; }
        if (v2GenderswapFemaleWords.indexOf(text) !== -1) { swapFemale = true; }
        if (v2GenderswapMaleWords.indexOf(text) !== -1) { swapMale = true; }
        if (v2GenderswapFlipWords.indexOf(text) !== -1) { flip = true; }
    }
    if (explicitFemale || explicitMale) {
        // An explicit sex word is the strongest signal and wins outright, so
        // `brienne, genderswap, 1girl` is still the girl.
        wantsFemale = explicitFemale;
        wantsMale = explicitMale;
    } else {
        wantsFemale = swapFemale;
        wantsMale = swapMale;
        if (flip) {
            if (defaultCode === pair.female) { wantsMale = true; }
            else if (defaultCode === pair.male) { wantsFemale = true; }
        }
    }
    if (wantsFemale === wantsMale) { return null; }
    return wantsMale ? pair.male : pair.female;
}

// A dotted reference is a way of NAMING a character, never a tag Forge has seen,
// so it becomes the canonical booru tag right here. This matters most for a
// character who has a names block but no charactersDB entry: nothing expands, so
// nothing else would ever put a real tag in the prompt and `.serie` would be
// sent to the model verbatim.
//
// Undotted references are left alone. `frieren` is a real booru tag, and Phase 3
// consumes it once expansion has put the canonical beside it.
// Rewrites a name to the canonical booru tag. Two cases, and it used to serve
// only the first:
//
//   `.frieren`        a dotted reference is a way of NAMING her and was never a
//                     tag Forge has seen, so it MUST become the real tag.
//   `nano`            an ordinary alias. namesArray exists to say that `nano`,
//                     `nano eiai` and `eiai nano` are all one character, and the
//                     model only knows `eiai nano (100 kanojo)`. Leaving the
//                     typed spelling in meant the prompt carried a tag the model
//                     has no weights for, beside the expansion that did work.
//
// A tag that is ALREADY the canonical, a brand, or a literal (Rule 2b, filtered
// before this is reached) is left alone.
function normalizeReference(record, job) {
    var canonical = record.character.qualified || record.character.name;
    if (!canonical || String(canonical).charAt(0) === ".") { return; }
    if (record.text.charAt(0) !== "." &&
        String(record.text).toLowerCase() === String(canonical).toLowerCase()) { return; }
    job.trace.added.push({
        text: canonical,
        rule: "reference: " + record.text + " -> " + canonical,
        owner: record.owner
    });
    record.text = canonical;
    record.source = "engine:reference";
}

// ---------------------------------------------------------------------------
//  `.syrup` is a STEM, not an entry
// ---------------------------------------------------------------------------
//  Most of the Syrup Town cast exists twice — a furry form and a fleshy one —
//  and the two are separate charactersDB entries, `.furMayor` and `.fleshyMayor`.
//  A character who is the same in both modes has no pair and is written once, as
//  `.syrupYu`.
//
//  So `.syrupMayor` is not an entry at all. It is the name of the PAIR, and it
//  resolves to one of them: `.fur` by default, `.fleshy` when the prompt says
//  `not furry`. A stem with no variants resolves to itself, which is what makes
//  a universal character need no special case.
//
//  This replaces v1's `basicShortcutArray`, which mapped a display name straight
//  to `.furMayor` and then string-replaced `.fur` with `.syrup` when it saw
//  `not furry`. That worked only while `.syrup` meant "the human one" — and it
//  now means "either one", so the old trick would silently resolve a universal
//  character's name into a nonexistent entry. Two meanings, one prefix, one
//  space: the failure this project keeps meeting.
//
//  Runs in PHASE 1, which is what makes `not furry` mean the TYPED tag. A fleshy
//  entry's own prompt contains `not furry`, but expansion is Phase 3 and has not
//  happened yet, so a character cannot vote on which form of herself to be.

var v2SyrupStemPrefix  = ".syrup";
var v2SyrupFurPrefix   = ".fur";
var v2SyrupFleshPrefix = ".fleshy";

// The typed request for the fleshy cast. Deliberately an exact text match rather
// than isPresent(): equivalence would let a near-miss flip every character in the
// image to a different body, which is too big a consequence for a fuzzy match.
function wantsFleshyForm(records) {
    for (var i = 0; i < records.length; i++) {
        var r = records[i];
        if (r.culledBy != null || r.literal) { continue; }
        if (String(r.text).toLowerCase() === "not furry") { return true; }
    }
    return false;
}

// key is already lowercased and dotted. Returns the key to actually look up.
//
// `character*outfit` and `character*category` arrive here as ONE record, so the
// suffix is split off and reattached rather than being resolved separately —
// `.syrupMayor*crimbus` has to become `.furMayor*crimbus` before anything reads
// the outfit, and the outfit lookup runs in Phase 3 with no view of `not furry`.
function resolveSyrupVariant(key, records, job) {
    // Both `.syrupMayor` and bare `syrupMayor`. Rule 30 derives the dotted form
    // FROM a registered bare name, but a stem is synthetic — nothing registers
    // it either way — so the undotted spelling resolved to nothing at all while
    // the dotted one worked. Normalised here rather than registered as a name,
    // because a stem is not a name: it is two entries wearing one label.
    if (key.indexOf("syrup") === 0) { key = "." + key; }
    if (key.indexOf(v2SyrupStemPrefix) !== 0) { return key; }

    var suffix = "";
    var star = key.indexOf("*");
    if (star !== -1) {
        suffix = key.slice(star);
        key = key.slice(0, star);
    }
    var resolved = resolveSyrupStem(key, records, job);
    return resolved + suffix;
}

function resolveSyrupStem(key, records, job) {
    var stem = key.slice(v2SyrupStemPrefix.length);
    if (!stem) { return key; }

    var index  = buildCharacterIndex();
    var fur    = v2SyrupFurPrefix + stem;
    var fleshy = v2SyrupFleshPrefix + stem;
    var hasFur    = !!index.codenames[fur];
    var hasFleshy = !!index.codenames[fleshy];

    // Universal character — no pair, so the stem IS the entry. `.syrupYu`.
    if (!hasFur && !hasFleshy) { return key; }

    var fleshyWanted = wantsFleshyForm(records);
    var chosen;
    if (fleshyWanted && hasFleshy)      { chosen = fleshy; }
    else if (!fleshyWanted && hasFur)   { chosen = fur; }
    else if (hasFur)                    { chosen = fur; }
    else                                { chosen = fleshy; }

    // A half-built pair is worth saying out loud rather than silently handing
    // back the wrong body. `webui2-characters.js` reports these in bulk.
    if (fleshyWanted && !hasFleshy) {
        job.trace.unmatched.push({
            text: key,
            rule: "no fleshy form exists for this character — used " + chosen + " despite `not furry`"
        });
    }
    if (chosen !== key) {
        job.trace.added.push({
            text: chosen,
            rule: "syrup stem: " + key + " -> " + chosen +
                  (fleshyWanted ? " (not furry)" : " (default)")
        });
    }
    return chosen;
}

function normalizeCharacterTags(records, job) {
    var index = buildCharacterIndex();
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        // A literal tag is not a name. This is the whole point of the syntax:
        // `"fern"` is the plant, and must not reach the character index at all.
        if (record.culledBy != null || record.system || record.literal) { continue; }
        var key = record.text.toLowerCase();

        // aliasDB display name -> codename
        if (index.aliases[key]) {
            var resolved = index.aliases[key];
            job.trace.added.push({
                text: resolved,
                rule: "alias: " + record.text + " -> " + resolved,
                owner: record.owner
            });
            record.text = resolved;
            record.source = "engine:alias";
            key = resolved;
        }

        // `.syrupMayor` is the name of a PAIR. Swap it for the form this prompt
        // actually asked for before anything looks the entry up, so every path
        // below sees a real codename and nothing has to know the pair exists.
        var variant = resolveSyrupVariant(key, records, job);
        if (variant !== key) {
            record.text = variant;
            record.source = "engine:syrupVariant";
            key = variant;
        }

        if (index.codenames[key]) {
            // A codename may also appear in the names list, which is where the
            // canon tag and franchise live. Merge so both paths return the same
            // shape and callers never have to ask which branch matched.
            var known = index.names[key];
            var entry = index.codenames[key];
            // An original character has a charactersDB entry and no brandsDB2
            // block, so there is no canonical tag to look up. Her entry's FIRST
            // tag is it — charactersDB is written identity-first — and without
            // this `.syrupcarp` reaches the model as `.syrupcarp`.
            var canonical = known ? known.qualified : firstStoredTag(entry);
            record.character = {
                kind: "codename",
                id: key,
                name: known ? known.name : (canonical || record.text),
                franchise: known ? known.franchise : null,
                qualified: canonical || record.text,
                entry: entry,
                // The outfit lookup keys on this. Without it `.frieren, default`
                // silently did nothing, because expandOutfits reads `codename`
                // and only the names branch below was setting it.
                codename: key
            };
            normalizeReference(record, job);
            continue;
        }
        if (index.names[key]) {
            var found = index.names[key];
            // A name shared by sex twins summons the one this prompt asks for.
            // Keyed by the resolved canonical so an alias reaches the pair, and
            // handed the current default so a bare `genderswap` can flip it.
            var twinCode = resolveSexTwin(String(found.qualified || key).toLowerCase(), record, records, found.codename);
            if (twinCode && twinCode !== found.codename && index.codenames[twinCode]) {
                found = { kind: found.kind, name: found.name, franchise: found.franchise, qualified: found.qualified,
                          entry: index.codenames[twinCode], codename: twinCode };
                job.trace.added.push({ text: twinCode, rule: "sex twin: " + record.text + " -> " + twinCode, owner: record.owner });
            }
            record.character = {
                kind: found.kind,          // "character" or "brand"
                id: found.name.toLowerCase(),
                name: found.name,
                franchise: found.franchise,
                qualified: found.qualified,
                entry: found.entry || null,
                codename: found.codename || null
            };
            normalizeReference(record, job);
        }
    }
    return records;
}

// ---------------------------------------------------------------------------
//  Dictionary bootstrap
// ---------------------------------------------------------------------------
//  generatetxt2img() builds the parsed tables, then builds the DOM. Only the
//  first half applies here, so these are called and the DOM half is skipped.
//  A no-op in the browser, where generatetxt2img has already run; under node it
//  is what makes the dictionaries exist. v1's parsers, v1's globals, no copies.

var v2DictionariesReady = false;

// The SHARED dictionaries are the ones generatetxt2img builds for v1 on page
// load. cullDB is v2's alone and generatetxt2img has never heard of it.
//
// This used to return early when the shared ones were already built — "the page
// did it" — and that skipped cullDB with them. In the browser that meant
// `cleanedCullArray` was NEVER built and EVERY cull silently did nothing:
// `nude, nipple slip, skirt lift, blue shirt` came out with all four intact.
// The headless harness could not see it, because there nothing builds the shared
// dictionaries first and the whole function runs.
//
// So the early return now skips only the shared half. Anything v2-only goes below
// the line and is ensured either way. A future v2-only dictionary belongs there
// too — that is what made this a landmine rather than a typo.
function v2EnsureDictionaries() {
    if (v2DictionariesReady) { return; }

    var sharedAlreadyBuilt = typeof rulesArrayInitial !== "undefined" &&
                             rulesArrayInitial.length > 0;
    if (!sharedAlreadyBuilt) {
        buildFinalKeywordSets("lite");
        generateSceneCategorySet();
        generateBackgroundCategorySet();
        cleanupCharacterArray();
        cleanupBrandArray();
        cleanupAliasArray();
        establishRules(cleaningArrayInitial, "initial");
        establishRules(cleaningArrayFinal, "final");
        cleanupNamesArray();
    }

    // ---- v2 only, always ----
    if (typeof cleanupCullArray === "function") { cleanupCullArray(); }

    v2DictionariesReady = true;
}

// ---------------------------------------------------------------------------
//  The rule engine
// ---------------------------------------------------------------------------
//  Record-level equivalent of v1's replaceCleanup (webui.js:2656), against the
//  same rulesArrayInitial / rulesArrayFinal that v1 builds. Same semantics:
//
//    requirement   every listed tag must be present
//    exception     no listed tag may be present
//    target        comma list; any match fires
//    replacement   comma list. Empty means purge.
//    repeats       the first match is replaced, later matches of the SAME rule
//                  are dropped — that is v1's behaviour and it is what stops a
//                  one-to-many rule multiplying
//
//  New in v2: a replacement inherits the original's weight, owner and position
//  (Rule 18), and a purge marks the record rather than splicing it, so the trace
//  can report it and Phase 6 can reverse it.

// A rule runs ONCE PER VIEW: the image, then each subject. A subject's view is
// her own records plus the unowned ones, which is what CORPUS Phase 4 Probe C
// means by "their own scopes + global".
//
// Without this, rules are owner-blind and reach across figures: `no breasts:
// large breasts` fired on Frieren's `flat chest` and deleted Fern's chest. With
// one figure — every prompt v1 has ever seen — the two are identical, which is
// why the bug could not exist before ownership did.
// Does this rule live in a section that holds boosters? `boosterSectionList` is
// in webui.js beside establishRules, because it names sections of cleaningDB and
// that is where cleaningDB is parsed.
//
// A rule with no section at all is NOT a booster. That is the safe default: a
// rule reaching here without one came from somewhere that does not track
// sections, and guessing is what this replaced.
function isBoosterRule(rule) {
    if (!rule || !rule.section) { return false; }
    if (typeof boosterSectionList === "undefined" || !boosterSectionList) { return false; }
    return boosterSectionList.indexOf(rule.section) !== -1;
}

function applyRules(records, ruleset, job) {
    if (!ruleset || !ruleset.length) { return records; }

    var owners = [];
    var live = livingRecords(records);
    for (var i = 0; i < live.length; i++) {
        if (live[i].owner != null && owners.indexOf(live[i].owner) === -1) { owners.push(live[i].owner); }
    }
    if (!owners.length) { return applyRulesInView(records, ruleset, job, undefined); }

    applyRulesInView(records, ruleset, job, null);      // the image, unowned only
    for (var o = 0; o < owners.length; o++) {
        applyRulesInView(records, ruleset, job, owners[o]);
    }
    return records;
}

// owner === undefined  everything, the no-ownership case
// owner === null       the unowned records only
// owner === <id>       that subject's records plus the unowned ones
function inView(record, owner) {
    if (owner === undefined) { return true; }
    if (owner === null) { return record.owner == null; }
    return record.owner == null || record.owner === owner;
}

function applyRulesInView(records, ruleset, job, owner) {
    for (var r = 0; r < ruleset.length; r++) {
        var rule = ruleset[r];
        if (isSupersededRule(rule)) { continue; }
        var targets = splitRuleField(rule.target);
        if (!targets.length) { continue; }

        var live = livingRecords(records);
        if (!live.length) { break; }

        var present = {};
        for (var p = 0; p < live.length; p++) {
            if (!inView(live[p], owner)) { continue; }
            present[live[p].text] = true;
        }

        var requirements = splitRuleField(rule.requirement);
        var exceptions = splitRuleField(rule.exception);

        var met = true;
        for (var q = 0; q < requirements.length; q++) {
            if (!present[requirements[q]]) { met = false; break; }
        }
        if (!met) { continue; }
        for (var e = 0; e < exceptions.length; e++) {
            if (present[exceptions[e]]) { met = false; break; }
        }
        if (!met) { continue; }

        var replacements = splitRuleField(rule.replacement);
        var fired = false;

        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            if (record.culledBy != null || record.literal) { continue; }
            if (!inView(record, owner)) { continue; }
            if (targets.indexOf(record.text) === -1) { continue; }

            if (fired || replacements.length === 0) {
                record.culledBy = "rule:" + record.text;
                record.strength = "hard";
                job.trace.culled.push({ text: record.text, rule: describeRule(rule) });
                continue;
            }

            // First hit becomes the first replacement, keeping weight, owner
            // and position. Further replacements follow it in sequence.
            var was = record.text;
            record.text = protectDictionaryValue(replacements[0], job);
            record.source = "engine:cleaning";

            // TWO conditions, and both are load-bearing.
            //
            // The SECTION says which rules are boost rules — `-/ Boost keywords`
            // in cleaningDB, listed in `boosterSectionList`. The SHAPE then says
            // which of that rule's outputs are the added-beside extras: a boost
            // line repeats its own target first and adds after it, which the
            // section's own comment states as its convention.
            //
            // The shape ALONE was the bug. 71 rules elsewhere in the file happen
            // to have the same shape without being boosts — all 46 of
            // `bodyparts removal (TEMPORARY)` among them — so `backboob`, which
            // is an ordinary description of what is in the picture, was marked a
            // booster and dropped from every contracted caption. Measured
            // 2026-09-06: 62 right, 71 wrong.
            var reinforcing = isBoosterRule(rule) &&
                              was.toLowerCase() === replacements[0].toLowerCase();

            var placed = 0;
            for (var extra = 1; extra < replacements.length; extra++) {
                // Rule 26 says every addition goes through the gate, and this
                // splices straight into the array instead — see the note below.
                // The half that was actually costing something is the
                // already-present check: several rules reinforce with the same
                // tag, so `legs spread` arrived five times and `bowlegged pose`
                // three, and the render then split the copies across two lines
                // because they did not all carry the same categories.
                if (liveTextInView(records, replacements[extra], record.owner)) {
                    job.trace.declined.push({
                        text: replacements[extra], rule: describeRule(rule),
                        blockedBy: replacements[extra]
                    });
                    continue;
                }
                placed++;
                var added = makeRecord(protectDictionaryValue(replacements[extra], job), record.position);
                added.weight = record.weight;
                added.emphasis = record.emphasis;
                // The protection travels with the emphasis. `(Shortstack)` is a
                // boost on whatever Shortstack turns into, or the rule would
                // quietly launder the keep away.
                added.typedBoost = record.typedBoost;
                added.owner = record.owner;
                // And the SCOPE, which is how Phase 2 finds it.
                //
                // Phase 1 runs before owners exist, so `record.owner` is still
                // null here for anything typed inside braces — the scope index is
                // the only thing that says where it came from. Without this line a
                // rule that splits a tag inside `{…}` produced an orphan:
                // `frieren {simple red background}` became `simple background`
                // (scoped, hers) plus `red background` (scope null), and the
                // Rule 13 pass then read the orphan as image-level and put it in
                // the COMMON block, so both figures got both colours.
                added.scope = record.scope;
                added.sequence = extra;
                added.source = reinforcing ? "booster" : "engine:cleaning";
                added.booster = reinforcing;
                records.splice(i + placed, 0, added);
                job.trace.added.push({ text: added.text, rule: describeRule(rule), owner: added.owner });
            }
            i += placed;
            if (was !== record.text) {
                job.trace.added.push({ text: record.text, rule: was + " → " + record.text, owner: record.owner });
            }
            fired = true;
        }
    }
    return records;
}

// The already-present half of the insertion gate, for the one caller that does
// not go through the gate itself.
//
// `applyRulesInView` splices records straight into the array. That is a real
// Rule 26 violation and it should be routed through `addRecord` — but the gate
// also applies exclusivity, and turning that on for thousands of cleaning rules
// at once is a change with a blast radius nobody has measured. This is the
// conservative half: it stops the duplicates without changing which rules fire.
// **Left as a deliberate exception, not an oversight** — see TODO.md.
function liveTextInView(records, text, owner) {
    var wanted = String(text == null ? "" : text).trim().toLowerCase();
    if (!wanted) { return true; }
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.culledBy != null) { continue; }
        if (record.text.toLowerCase() !== wanted) { continue; }
        // Hers, or unowned and therefore already reaching her (Rule 28).
        if (record.owner == null || record.owner === owner) { return true; }
    }
    return false;
}

function splitRuleField(field) {
    if (!field) { return []; }
    return field.split(",").map(function (s) { return s.trim(); })
                .filter(function (s) { return s !== ""; });
}

function describeRule(rule) {
    return (rule.requirement ? rule.requirement + ": " : "") + rule.target +
           (rule.replacement ? " → " + rule.replacement : " (purge)");
}

// ---------------------------------------------------------------------------
//  System keywords
// ---------------------------------------------------------------------------
//  One table, one step. A keyword survives as a record until the
//  phase that consumes it (Rule 21), so a shortcut can introduce one and a
//  replacement rule can remove one. `emit` decides whether it reaches output.
//
//  Cull triggers are not listed here. They are read from quickPromptsCullArray
//  so the two engines cannot disagree about what counts as one.

function markSystemKeywords(records, job) {
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.culledBy != null) { continue; }
        record.system = classifySystemKeyword(record.text);
    }
    return records;
}

// Maps user alias -> standard CORPUS domain name
var DOMAIN_ALIASES = {
    // Character aliases -> 'body'
    "character":  "body",
    "characters": "body",
    "person":     "body",

    // Clothing aliases -> 'clothes'
    "clothing":   "clothes",
    "garment":    "clothes",
    "garments":   "clothes",
    "outfit":     "clothes"
};

// The four spellings of the reset command, longest verb first so that
// "replace all clothes" resolves to `clothes` and not to `all clothes`.
var v2ResetVerbs = ["replace all ", "remove all ", "replace ", "remove "];

function normalizeDomain(rawDomain) {
    if (!rawDomain) return null;
    // Return mapped canonical domain, or fallback to raw string if not mapped
    return DOMAIN_ALIASES[rawDomain] || rawDomain;
}

function resetDomain(text) {
    // Trim leading/trailing whitespace before checking indexOf
    var lower = String(text == null ? "" : text).trim().toLowerCase();
    
    for (var v = 0; v < v2ResetVerbs.length; v++) {
        var verb = v2ResetVerbs[v];
        if (lower.indexOf(verb) !== 0) { continue; }
        
        var rawDomain = lower.slice(verb.length).trim();
        if (rawDomain === "") { return null; }

        // Normalizes "clothing" -> "clothes", "character" -> "body", etc.
        return normalizeDomain(rawDomain);
    }
    return null;
}

function classifySystemKeyword(text) {
    var lower = text.toLowerCase();

    if (lower.indexOf("!") === 0)      { return { kind: "negation",   consumedBy: 5, emit: false }; }
    if (lower.indexOf("keep ") === 0)  { return { kind: "protection", consumedBy: 5, emit: false }; }
    // Checked ahead of the cull triggers on purpose: "remove clothes" is in
    // quickPromptsCullArray as well, and the reset reading is the one CORPUS
    // asks for — "replace" ≡ "replace all" ≡ "remove" ≡ "remove all".

    // Pass the extracted domain back to the handler
    var domain = resetDomain(lower);
    if (domain != null) { 
        return { kind: "reset", domain: domain, consumedBy: 3, emit: false }; 
    }

    if (lower === "nosort")   { return { kind: "render option", consumedBy: 9, emit: false }; }
    if (lower === "noboost")  { return { kind: "render option", consumedBy: 8, emit: false }; }
    if (lower === "training") { return { kind: "output mode",   consumedBy: 9, emit: false }; }
    if (lower === "tagme")    { return { kind: "meta signal",   consumedBy: 1, emit: false }; }

    if (typeof quickPromptsCullArray !== "undefined" &&
        quickPromptsCullArray.indexOf(lower) !== -1) {
        return { kind: "cull trigger", consumedBy: 5, emit: true };
    }
    return null;
}

// ---------------------------------------------------------------------------
//  Dispatch keywords — the size and the style
// ---------------------------------------------------------------------------
//  A bare `portrait` or `oreteki` in the prompt sets the size or style selector
//  for that job. Neither is a tag: they name a row of `basicImageSizes` or
//  `basicStyleArray` in webui.js and they are consumed, so nothing reaches the
//  model. The chosen row is reported on the job as `job.size` / `job.style`,
//  which is how a caller with no DOM at all — the Discord bridge — reads them.
//
//  Kept OUT of classifySystemKeyword deliberately. A system keyword is part of
//  the prompt language and its table is in this file; these two read a GUI list
//  that lives in webui.js and is edited whenever a LoRA is added. Different
//  owner, different lifetime, own table (CATCH-UP's "one block, one question").
//
//  The match is whole-tag, so `square jaw` is a jaw. A tag in double quotes is
//  literal (Rule 2b) and is the escape hatch for the words that are also real
//  tags: `"landscape"` is scenery and never touches the dropdown.

var v2DispatchIndex = null;

// Text -> the lookup key, or null if this can never be one.
//
// Records arrive with their parens already resolved and the crude text scan
// does not, so both jobs are done here and the two cannot disagree.
function v2NormalizeDispatchKey(text) {
    var raw = String(text == null ? "" : text).trim();
    // Emphasis parens. `(portrait)` and `((portrait))` still name a size —
    // weighting a directive is meaningless but it should not silently fail.
    var hadParens = false;
    while (raw.length > 1 && raw.charAt(0) === "(" && raw.charAt(raw.length - 1) === ")") {
        raw = raw.slice(1, -1).trim();
        hadParens = true;
    }
    // A trailing `:number` is an emphasis weight ONLY inside parens — the same
    // rule tokenize applies, where the explicit form is read only when
    // `depthAtTag > 0`. Outside them the colon is part of the word, and the
    // ratio aliases are exactly that shape: stripping unconditionally turned
    // `1:1`, `1:2`, `2:1` and `2:3` into the keys `1`, `1`, `2`, `2`, so they
    // overwrote each other and `ratio: 2:3` resolved to Horizontal.
    if (hadParens) {
        var weighted = raw.match(/^(.+?):\s*-?\d*\.?\d+$/);
        if (weighted) { raw = weighted[1].trim(); }
    }
    // Rule 2b. The one deliberate way to write these words and mean the tag.
    if (raw.length > 1 && raw.charAt(0) === '"' && raw.charAt(raw.length - 1) === '"') { return null; }
    if (raw === "") { return null; }
    return raw.toLowerCase().replace(/[ \t]+/g, " ");
}

// Built once. Every `id` matches itself, then the alias tables are laid over the
// top — an alias naming a row that does not exist is skipped rather than stored,
// so deleting a style from basicStyleArray cannot leave a keyword pointing at it.
function buildDispatchIndex() {
    if (v2DispatchIndex) { return v2DispatchIndex; }
    // TWO readings of the same tables. `bare` is what a lone `portrait` is
    // matched against and honours the blocklist; `named` is what `aspect: …`
    // and `style: …` are matched against and does not.
    //
    // That difference is the point of the prefixed form. Saying `aspect:` is an
    // unambiguous statement of intent, so the words that had to be blocked from
    // answering to their own name — `default`, `syuro` — are reachable again the
    // moment you say which question you are answering.
    var index = { size: {}, style: {}, namedSize: {}, namedStyle: {} };

    // An id that must not answer to its own name. `default` names every
    // character's default outfit and `syuro` is a trigger word three of the
    // styles append themselves — self-matching ate both. An alias row still
    // reaches a blocked id; only the id's own spelling is refused.
    var blocked = {};
    if (typeof basicKeywordBlockedArray !== "undefined" && basicKeywordBlockedArray) {
        for (var b = 0; b < basicKeywordBlockedArray.length; b++) {
            var blockedKey = v2NormalizeDispatchKey(basicKeywordBlockedArray[b]);
            if (blockedKey) { blocked[blockedKey] = true; }
        }
    }

    function seed(target, named, rows) {
        if (typeof rows === "undefined" || !rows) { return; }
        for (var i = 0; i < rows.length; i++) {
            var id = rows[i] && rows[i].id;
            if (!id) { continue; }
            var key = v2NormalizeDispatchKey(id);
            if (!key) { continue; }
            named[key] = id;                          // `aspect: default` works
            if (!blocked[key]) { target[key] = id; }  // a lone `default` does not
        }
    }
    // Real ids, read from the row list rather than from what `seed` accepted —
    // `["square", "Default"]` has to keep working while `default` itself is
    // blocked, so the two questions are asked of different things.
    function idsOf(rows) {
        var known = {};
        if (typeof rows === "undefined" || !rows) { return known; }
        for (var i = 0; i < rows.length; i++) {
            if (rows[i] && rows[i].id) { known[rows[i].id] = true; }
        }
        return known;
    }
    function alias(target, named, rows, known) {
        if (typeof rows === "undefined" || !rows) { return; }
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (!row || row.length < 2) { continue; }
            var key = v2NormalizeDispatchKey(row[0]);
            var id = row[1];
            // An alias naming a row that no longer exists is dropped, not stored,
            // so deleting a style cannot leave a keyword pointing at nothing.
            if (!key || !id || !known[id]) { continue; }
            target[key] = id;
            named[key] = id;
        }
    }

    var sizeRows  = typeof basicImageSizes !== "undefined" ? basicImageSizes : null;
    var styleRows = typeof basicStyleArray !== "undefined" ? basicStyleArray : null;
    seed(index.size,  index.namedSize,  sizeRows);
    seed(index.style, index.namedStyle, styleRows);
    alias(index.size,  index.namedSize,
          typeof basicSizeKeywordArray  !== "undefined" ? basicSizeKeywordArray  : null, idsOf(sizeRows));
    alias(index.style, index.namedStyle,
          typeof basicStyleKeywordArray !== "undefined" ? basicStyleKeywordArray : null, idsOf(styleRows));

    v2DispatchIndex = index;
    return index;
}

// The PREFIXED form: `aspect: portrait`, `style: oreteki`. Says which question
// is being answered, so it reads the `named` half of the index and the blocklist
// does not apply — `aspect: default` and `style: syuro` both work.
//
// `size:` and `ratio:` are accepted beside `aspect:` because all three are
// obvious ways to write the same thing and the cost of accepting them is a word
// in this table.
var v2DispatchPrefixes = [
    { match: /^(?:aspect|size|ratio)\s*:\s*(.+)$/i, kind: "size" },
    { match: /^style\s*:\s*(.+)$/i,                 kind: "style" }
];

// Size is asked first, so a word listed in both tables reads as a size. Stated
// rather than left to object order, because the tables are meant to be edited.
//
// Returns `{kind, value}` on a hit, `null` when this is an ordinary tag, and
// `{kind, value: null, asked}` when a PREFIX was written but its argument names
// nothing — that third case is a typo the caller has to report, not a tag.
function matchDispatchKeyword(text) {
    var raw = String(text == null ? "" : text).trim();
    var index = buildDispatchIndex();

    for (var p = 0; p < v2DispatchPrefixes.length; p++) {
        var prefixed = raw.match(v2DispatchPrefixes[p].match);
        if (!prefixed) { continue; }
        var kind = v2DispatchPrefixes[p].kind;
        var asked = v2NormalizeDispatchKey(prefixed[1]);
        var table = kind === "size" ? index.namedSize : index.namedStyle;
        if (asked && Object.prototype.hasOwnProperty.call(table, asked)) {
            return { kind: kind, value: table[asked], named: true };
        }
        return { kind: kind, value: null, named: true, asked: prefixed[1].trim() };
    }

    var key = v2NormalizeDispatchKey(raw);
    if (!key) { return null; }
    if (Object.prototype.hasOwnProperty.call(index.size, key)) {
        return { kind: "size", value: index.size[key] };
    }
    if (Object.prototype.hasOwnProperty.call(index.style, key)) {
        return { kind: "style", value: index.style[key] };
    }
    return null;
}

// The TEXT-space reading, for callers that have no records: v1's pipeline, and
// sendPromptArray, which has to know the size before it decides whether
// "Multiple" fans this job out. `kept` is the same text with the keywords
// removed, separators and all, so it can be handed straight back to the caller.
//
// The record pass below is the authoritative one — it is what sets job.size —
// and both read through matchDispatchKeyword, so they cannot drift.
function v2ScanDispatchKeywords(text) {
    var out = { size: null, style: null, kept: String(text == null ? "" : text) };
    // Capturing split: even indices are content, odd are the separator that
    // followed, so the rebuild is character-exact for everything left in.
    var parts = out.kept.split(/([,\r\n])/);
    var kept = [];
    for (var i = 0; i < parts.length; i++) {
        if (i % 2 === 1) { kept.push(parts[i]); continue; }
        var hit = matchDispatchKeyword(parts[i]);
        if (!hit) { kept.push(parts[i]); continue; }
        // A prefix with an unreadable argument is still consumed — `style: xyz`
        // is a directive that failed, not a tag anybody wants in the picture.
        if (hit.value == null) { kept.push(""); continue; }
        if (hit.kind === "size") { out.size = hit.value; } else { out.style = hit.value; }
        kept.push("");
    }
    out.kept = kept.join("");
    return out;
}

// Phase 1, first thing in tag space — before the rule engine, so a cleaning rule
// cannot rewrite `portrait` into something else on the way past. Last one typed
// wins, which is the only reading that makes editing a prompt behave.
function consumeDispatchKeywords(records, job) {
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.culledBy != null) { continue; }
        if (record.literal) { continue; }        // Rule 2b — you meant the tag
        var hit = matchDispatchKeyword(record.text);
        if (!hit) { continue; }

        // A prefix whose argument names nothing. It is consumed either way — a
        // failed directive is not a tag anybody wants in the picture — but it is
        // reported LOUDLY, because the alternative is generating at the dropdown's
        // setting and looking almost right, which is the hardest kind of wrong to
        // notice. Same reasoning as the regional layout parser, one step softer:
        // that one refuses to dispatch, this one warns. Push it into `errors`
        // instead if you would rather it stopped the generation.
        if (hit.value == null) {
            record.culledBy = hit.kind + " override: nothing named \"" + hit.asked + "\"";
            record.strength = "hard";
            if (job.dispatchErrors) {
                job.dispatchErrors.push({ kind: hit.kind, asked: hit.asked });
            }
            job.trace.unmatched.push({
                text: record.text,
                rule: "no " + hit.kind + " is called \"" + hit.asked + "\""
            });
            if (typeof console !== "undefined" && console.warn) {
                console.warn("Prompt: no " + hit.kind + " is called \"" + hit.asked +
                             "\" — the dropdown's setting was used instead.");
            }
            continue;
        }

        if (hit.kind === "size") { job.size = hit.value; } else { job.style = hit.value; }
        record.culledBy = hit.kind + " override: " + hit.value;
        record.strength = "hard";
        job.trace.declined.push({
            text: record.text,
            rule: "sets the " + hit.kind + " to " + hit.value
        });
    }
    return records;
}

// ---------------------------------------------------------------------------
//  The inline negative
// ---------------------------------------------------------------------------
//  `1girl, solo, negative: 1boy, male focus` is a failed attempt at a negative
//  prompt and it is a common one — there is one text box in Discord and two in
//  the browser, and the habit crosses over. Everything after the marker becomes
//  negative text; everything before it stays the prompt.
//
//  Run in buildPrompt before anything else, on the raw string, so the marker
//  never has to survive tokenize. The marker only counts at a TAG BOUNDARY — the
//  start of the input, or just after a comma or a newline — so a tag that merely
//  contains the word is untouched.
//
//  It cuts to the END OF THE INPUT, not the end of the line. buildPrompt is
//  handed one job at a time: `multiple` mode already split on newlines, and in
//  `single` mode the whole block IS one prompt, so there is nothing after the
//  marker that belongs to a different image.
//  Four spellings, because this is also how Stable Diffusion writes its own
//  sidecar and PNG footer: `Negative prompt:` on a line of its own. Matching is
//  case-insensitive, and `negative_prompt` is accepted as well — buildPrompt can
//  be called with raw text that checkForDirt never saw, which is exactly the
//  bridge's situation.
//
//      negative:            Negative:
//      negative prompt:     Negative Prompt:     negative_prompt:
//
//  `--negative_prompt` is NOT matched here and must not be: the `--` is not a tag
//  boundary, so a command-line paste still belongs to checkForDirt, which knows
//  to read the quoted argument rather than the rest of the line.
function extractInlineNegative(input) {
    var text = String(input == null ? "" : input);
    var found = text.match(/(^|[,\r\n])[ \t]*negative(?:[ _\t]*prompt)?[ \t]*:[ \t]*/i);
    if (!found) { return { prompt: text, negative: "" }; }
    return {
        prompt:   text.slice(0, found.index),
        negative: text.slice(found.index + found[0].length).trim()
    };
}

// ---------------------------------------------------------------------------
//  Dedupe
// ---------------------------------------------------------------------------
//  Rule 14: same text under two different owners is not a duplicate.
//
//  Owners do not exist yet on the first pass, and waiting for them is not an
//  option — dedupe has to run before the rule engine sees the same tag twice.
//  The SCOPE INDEX stands in: `.frieren {pointy ears}, .fern {pointy ears}` is
//  two scopes, so it stays two records and the pass reaches the verdict Phase 2
//  would have. Two copies inside one scope still collapse.

function dedupeRecords(records, job) {
    var seen = {};
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.culledBy != null) { continue; }
        // The separator has to be something a tag cannot contain, and tags
        // contain spaces. Built with fromCharCode rather than written as an
        // escape ON PURPOSE: an escape in the source keeps getting normalised
        // back into a raw NUL byte by editing tools, and one NUL makes the whole
        // file read as binary to grep.
        // A record that OPENS a scope is a subject declaration, not a repeated
        // tag, so it is never a duplicate of another one. `frieren {head shot},
        // frieren {full body}` is two of her: collapsing the second name left
        // Phase 3 with nothing to expand into the second cell, and the whole
        // prompt came out as one figure.
        var identity = record.owner != null ? record.owner
                     : record.opensScope != null ? "opens" + record.opensScope
                     : (record.scope != null ? "scope" + record.scope : "");
        var key = identity + v2KeySeparator + record.text;
        var first = seen[key];
        if (first) {
            // Emphasis survives a duplicate: `dynamic, (dynamic)` keeps one
            // record at the HIGHER weight. Input order carries no intent here.
            if (record.weight > first.weight) { first.weight = record.weight; }
            if (record.emphasis != null && first.emphasis == null) {
                first.emphasis = record.emphasis;
            }
            // And so does the protection — `red hair, (red hair)` is one record
            // and it is a boosted one, whichever copy was written first.
            if (record.typedBoost) { first.typedBoost = true; }
            record.culledBy = "duplicate";
            record.strength = "hard";
        } else {
            seen[key] = record;
        }
    }
    return records;
}

// LoRA references never enter the tag stream (Rule 23). Lifted before anything
// else touches the text, held on the job, re-emitted at dispatch. Nothing
// downstream can cull what it cannot see.
function liftLoraReferences(text, job) {
    return text.replace(/<lora:[^>]*>/gi, function (match) {
        job.lora.push(match);
        return "";
    });
}

// Newlines are commas (Rule 12) — the one thing v1's normalizeSpacing does not
// do, because v1 never had a reason to emit them.
function foldNewlines(text) {
    return text.replace(/[\r\n]+/g, ", ");
}

// Spacing is v1's normalizeSpacing (webui.js:1077), called rather than copied.
// It carries the "fl " / "fl_" -> "fl-" and "sy " / "sy_" -> "sy-" prefix
// fixups, and finishes with protectParens, whose sentinels match this file's.
function tidySpacing(text) {
    // Underscores go first. `red_hair` is `red hair` — the dictionaries are all
    // written the natural way, so an underscored tag matches nothing and reaches
    // the model as a word it has no weights for. This is the whole reason it
    // happens at the spacing step: after it, every lookup downstream sees the
    // spelling the dictionary holds.
    //
    // MUST be before normalizeSpacing, which ends by writing `__lparen__`
    // sentinels that are themselves made of underscores. See webui.js's
    // stripInputUnderscores for the `<lora:a_b:1>` guard.
    //
    // The few LoRAs whose trigger word genuinely wants an underscore are safe:
    // they live in cleaningDB as replacement VALUES and are injected in tag
    // space, long after this. What is lost is the ability to TYPE one of those
    // triggers verbatim — `huge_condom` now arrives as `huge condom`.
    if (typeof stripInputUnderscores === "function") { text = stripInputUnderscores(text); }
    else { text = String(text).replace(/<[^>]*>|_/g, function (m) { return m === "_" ? " " : m; }); }

    // v1's normalizeSpacing trims each tag's ends but never collapses runs
    // INSIDE a tag, so "blomde   hair" corrects to "blonde   hair" and then
    // matches no dictionary entry. Collapsing first costs nothing and makes the
    // whole-tag rules reachable.
    text = String(text).replace(/[ 	]{2,}/g, " ");
    if (typeof normalizeSpacing === "function") {
        return normalizeSpacing(text);
    }
    // Fallback for the engine loaded without webui.js. Deliberately minimal:
    // the prefix fixups above are absent, which should be visible, not hidden.
    return text.replace(/[ \t]+/g, " ").replace(/\s*,\s*/g, ", ")
               .trim().replace(/^,\s*|,\s*$/g, "");
}

// Substring replacements, applied while the prompt is still one string. This is
// the only pass that can reach inside a tag, which is what it exists for:
// "blomde" -> "blonde" fixes "blomde hair" without needing a rule per hair
// colour, and targets containing a colon ("rating:explicit") would be misread as
// a requirement by the whole-tag rule engine.
//
// cleaningArrayTop entries are [find, replace] pairs. Element 0 and the last
// element are the empty strings a template literal leaves at each end.
function applyTopLevelCleaning(text, job) {
    if (typeof cleaningArrayTop === "undefined") { return text; }
    for (var i = 0; i < cleaningArrayTop.length; i++) {
        var pair = cleaningArrayTop[i];
        if (!pair || !pair.length || !pair[0]) { continue; }
        var find = pair[0];
        var replace = pair.length > 1 && pair[1] != null ? pair[1] : "";
        if (text.indexOf(find) === -1) { continue; }
        text = text.split(find).join(replace);
    }
    return text;
}

// ---------------------------------------------------------------------------
//  Tokenize — the last point at which this is a string
// ---------------------------------------------------------------------------
//  Emphasis leaves the text and becomes a number. Two kinds of paren have to be
//  told apart and only one of them is emphasis:
//
//    (pinup)          emphasis  — the ( comes BEFORE any of the tag's text
//    ((detailed))     emphasis  — same, twice
//    pal_(species)    part of the name — text already started
//    kasumi (doa)     part of the name — likewise
//    frieren \(...\)  part of the name — already escaped, sentinel'd out below
//
//  That is the whole rule: an emphasis paren is a prefix. Anything else belongs
//  to the tag, and gets its backslashes back at render (Rule 1b — a record holds
//  the natural form, escaping happens once, in Phase 9).

function tokenizePrompt(text, job) {
    text = text
        .replace(/\\\(/g, v2SentinelLParen)
        .replace(/\\\)/g, v2SentinelRParen);

    var records = [];
    var position = 0;
    var buffer = "";
    var depth = 0;         // emphasis parens currently open
    var depthAtTag = 0;    // depth as this tag's text began
    var literalOpen = 0;   // name parens open inside this tag
    var sawContent = false;
    var braceDepth = 0;    // {…} nesting
    var scopeId = null;    // the scope tags are currently landing in

    function flush() {
        var raw = buffer.trim();
        buffer = "";
        literalOpen = 0;
        sawContent = false;
        if (raw === "") { return; }

        // explicit weight, written as (tag:1.4). Needs something before the
        // colon, so the emoticon tags — :3, :<, :o — are never mistaken for one.
        var emphasis = null;
        if (depthAtTag > 0) {
            var explicit = raw.match(/^(.+?):\s*(-?\d*\.?\d+)$/);
            if (explicit) {
                raw = explicit[1].trim();
                emphasis = parseFloat(explicit[2]);
            }
        }

        // A QUOTED tag is literal: emit exactly this text, and never read it as
        // a name. `fern` is a plant and also a character, and `"fern"` is how
        // you say you meant the plant. Stripped after the weight, so
        // `("fern":1.2)` works.
        //
        // Rule 24 gives quotes a different job inside DICTIONARY fields, where a
        // quoted term is a SUBSTRING. The two never meet — one is input, the
        // other is dictionary data — but they are the same character meaning two
        // things, so do not carry an intuition from one across to the other.
        var literal = false;
        if (raw.length > 1 && raw.charAt(0) === '"' && raw.charAt(raw.length - 1) === '"') {
            raw = raw.slice(1, -1).trim();
            literal = true;
            if (raw === "") { return; }
        }

        var record = makeRecord(unprotectParens(raw), position++);
        record.weight = emphasis == null ? depthAtTag : 0;
        record.emphasis = emphasis;
        // Rule 16b — a boost YOU typed is a keep instruction, and Phase 5 reads
        // this rather than the weight. It has to be recorded here because this
        // is the only place that knows the emphasis was written by hand:
        // Phase 8's auto-emphasis and a character block's `(a, b)` group both
        // raise `weight` too, and neither is a statement of intent by the user.
        //
        // De-emphasis grants nothing. `(bad hands:0.6)` says you want LESS of a
        // tag, so reading it as "protect this" would be the exact opposite.
        record.typedBoost = emphasis == null ? depthAtTag > 0 : emphasis > 1;
        record.scope = scopeId;
        // The contract is narrow and worth stating: literal means the engine
        // never REWRITES the text. It may still categorise it, sort it, cull it
        // or negate it — it is an ordinary tag, just not a name.
        if (literal) { record.literal = true; }
        records.push(record);
    }

    for (var i = 0; i < text.length; i++) {
        var ch = text[i];

        if (ch === "(") {
            if (sawContent) { literalOpen++; buffer += ch; }  // part of the name
            else { depth++; }                                  // emphasis
            continue;
        }
        if (ch === ")") {
            if (literalOpen > 0) { literalOpen--; buffer += ch; }
            else if (depth > 0) { depth--; }
            else {
                // Not ours and not balanced. Keep the character rather than
                // silently eating it, and say so.
                if (job) { job.errors.push("Unbalanced ) at character " + i); }
                buffer += ch;
            }
            continue;
        }
        if (ch === ",") { flush(); continue; }

        // Braces are consumed here and never reach the output. The tag that came
        // immediately before the opening brace is remembered, because Phase 2
        // reads it to decide who owns the scope: a known character owns it, and
        // anything else leaves it anonymous.
        if (ch === "{") {
            flush();
            if (braceDepth === 0) {
                scopeId = job ? job.scopes.length : 0;
                if (job) {
                    // The record this scope hangs off, held as a REFERENCE and not
                    // as an index into `records`.
                    //
                    // It used to be `records.length - 1`, and Phase 1 splices —
                    // `long blonde hair` becomes two tags, `mini top hat` becomes
                    // two — so by the time Phase 2 read that number the array had
                    // grown underneath it and the scope bound to whatever slid
                    // into the slot. Measured 2026-09-06: three expanding tags in
                    // front of `frieren {head shot}, fern {full body}` was enough
                    // to turn BOTH scopes anonymous. Her traits then render in the
                    // common block and her framing gets a cell of its own, which
                    // is the "characters end up in the wrong region" report.
                    // It got worse the more you typed, which is why it read as
                    // Regional Prompter being unreliable.
                    var opener = records.length ? records[records.length - 1] : null;
                    // Marked on the record too, because dedupe has to know: a
                    // record that opens a scope is a subject declaration and is
                    // never a duplicate of another one. See dedupeRecords.
                    if (opener) { opener.opensScope = scopeId; }
                    job.scopes.push({ id: scopeId, precededBy: opener, owner: null });
                }
            }
            braceDepth++;
            continue;
        }
        if (ch === "}") {
            flush();
            if (braceDepth > 0) {
                braceDepth--;
                if (braceDepth === 0) { scopeId = null; }
            } else if (job) {
                job.errors.push("Unbalanced } at character " + i);
            }
            continue;
        }

        if (!sawContent && ch.trim() !== "") {
            sawContent = true;
            depthAtTag = depth;   // depth as the tag's text STARTED
        }
        buffer += ch;
    }
    flush();

    if (depth !== 0 && job) {
        job.errors.push("Unbalanced ( — " + depth + " left open");
    }
    if (braceDepth !== 0 && job) {
        job.errors.push("Unbalanced { — " + braceDepth + " left open");
    }
    return records;
}

function unprotectParens(text) {
    return text
        .split(v2SentinelLParen).join("(")
        .split(v2SentinelRParen).join(")");
}

// ============================================================================
//  THE GATE AND isPresent — shared by every phase below
// ============================================================================
//  Each returns its input untouched so the pipeline runs end to end today and
//  each one can be filled in without disturbing the others. Order here is the
//  order they run.

// ============================================================================
//  isPresent — "is X present"
// ============================================================================
//  Every requirement and exception on a rule runs through here. A term may be:
//
//    ordinary tag   equivalence-aware: a rule wanting `1girl` fires on `female`
//    "quoted"       exact, for the cases where the distinction is real
//    bodyTail       a category: is anything in it present?
//    naked          a named check - code, because it inspects the whole set
//
//  Equivalence matters even though applyAliases already collapses to canonical:
//  a rule written against a NON-canonical term ("female") would otherwise never
//  fire, because everything has become "1girl" by the time rules run.

var v2Equivalence = null;

function buildEquivalence() {
    if (v2Equivalence) { return v2Equivalence; }
    v2Equivalence = {};
    if (typeof cleaningAliasList === "undefined") { return v2Equivalence; }
    for (var i = 0; i < cleaningAliasList.length; i++) {
        var line = cleaningAliasList[i];
        if (typeof line !== "string" || line === "") { continue; }
        var members = line.split(",").map(function (t) { return t.trim().toLowerCase(); })
                          .filter(Boolean);
        if (members.length < 2) { continue; }
        for (var m = 0; m < members.length; m++) { v2Equivalence[members[m]] = members[0]; }
    }
    return v2Equivalence;
}

function equivalentKey(text) {
    var map = buildEquivalence();
    var key = String(text).toLowerCase();
    return map[key] || key;
}

// Named checks are code rather than data because they read the whole record set,
// which no dictionary line should try to express. Registering a new one is one
// function and one property - the rule format never changes.
var v2NamedChecks = {};

// Worn over the chest / over the groin. Not the same as "a tag in that part":
// a necklace is not coverage.
var v2ChestCover = ["clothesUpperwear", "clothesUpperwearOuter", "clothesUpperwearMiddle",
                    "clothesUpperwearInner", "clothesUpperwearUnder", "clothesNipplewear",
                    "clothesFullwear"];
var v2GroinCover = ["clothesLowerwear", "clothesLowerwearOuter", "clothesLowerwearInner",
                    "clothesLowerwearUnder", "clothesFullwear"];
// Detail tags that only get written when the part can actually be seen.
//
// Two things are deliberately NOT here, and both were wrong before:
//   bodyBreasts   breast SIZE is written on clothed figures constantly, and
//                 Phase 4's defaults put `medium breasts` on almost every
//                 figure — every shirt was reading as see-through.
//   bodyAreolae   AREOLAE VISIBLE DOES NOT MEAN NUDE. `areola slip` is a dress
//                 the areolae are peeking out of. Noodle, 2026-08-05.
var v2ChestDetail = ["bodyNipples"];
var v2GroinDetail = ["bodyPussy", "bodyPenis", "bodyClit", "bodyBalls"];
// Worn, but not clothing in the sense `completely naked` means. Edit freely.
var v2Accessories = ["clothesHeadwear", "clothesForeheadwear", "clothesFacewear",
                     "clothesEyewear", "clothesMouthwear", "clothesEarwear",
                     "clothesNeckwear", "clothesWristwear"];

function anyInCategories(records, categories) {
    var live = livingRecords(records);
    for (var i = 0; i < live.length; i++) {
        var cats = live[i].categories && live[i].categories.length
            ? live[i].categories : categoriesOf(live[i].text);
        for (var c = 0; c < cats.length; c++) {
            if (categories.indexOf(cats[c]) !== -1) { return true; }
        }
    }
    return false;
}

// A part counts as visible when nothing covers it, OR when its detail tags are
// present anyway - which is how `open clothes` resolves without being listed:
// nobody writes "nipples" on a figure whose chest cannot be seen.
function partVisible(records, cover, detail) {
    if (anyInCategories(records, detail)) { return true; }
    return !anyInCategories(records, cover);
}

v2NamedChecks["naked"] = function (records) {
    return partVisible(records, v2ChestCover, v2ChestDetail)
        && partVisible(records, v2GroinCover, v2GroinDetail);
};

v2NamedChecks["completelynaked"] = function (records) {
    var live = livingRecords(records);
    for (var i = 0; i < live.length; i++) {
        var cats = live[i].categories && live[i].categories.length
            ? live[i].categories : categoriesOf(live[i].text);
        for (var c = 0; c < cats.length; c++) {
            if (cats[c].indexOf("clothes") !== 0) { continue; }
            if (v2Accessories.indexOf(cats[c]) !== -1) { continue; }
            return false;
        }
    }
    return true;
};

// CASE IS LOAD-BEARING, and this function used to throw it away.
//
// The dictionaries use capitalisation to separate a MACRO from a TAG. `Happy` is
// a shortcut that means happy + closed mouth + smile; `happy` is the ordinary
// booru tag and must expand to nothing. 315 of defaultDB's 2353 lines are keyed
// on a capitalised macro — Afterglow, Broken, Orgasm, Crying, Angry, Shock,
// Panic, Love, Horny — and most of those have a real lowercase twin, so
// lowercasing here fired every one of them off the plain tag. That is the
// "everything freaking out at once" this caused.
//
// v1 is the authority and v1 compares exactly: promptDefaults uses
// `promptSet.has(req.trim())` (webui.js:2192) and `prompt.includes(keyword)` for
// the quoted forms. Both are case-sensitive. Matching v1 is the whole point of
// reading v1's data.
function isPresent(term, records, job, exact) {
    term = String(term == null ? "" : term).trim();
    if (!term) { return false; }
    var live = livingRecords(records);

    // A quoted term is a SUBSTRING, matched inside any live tag. Both quote
    // characters mean the same thing, because both dictionaries use them that
    // way: `"dildo"` in defaultDB has to reach `huge dildo`, and `'dress'` has to
    // reach `china dress`. 178 lines depend on it.
    var quote = term.charAt(0);
    if (term.length > 1 && (quote === '"' || quote === "'") && term.charAt(term.length - 1) === quote) {
        var fragment = term.slice(1, -1);
        return live.some(function (r) { return r.text.indexOf(fragment) !== -1; });
    }

    // `(color) hair` stands for every colour the modifier DB knows.
    if (term.indexOf("(color)") !== -1) {
        var colors = (typeof modifierKeywordDB !== "undefined" && modifierKeywordDB.colors)
            ? modifierKeywordDB.colors : [];
        for (var c = 0; c < colors.length; c++) {
            var filled = term.split("(color)").join(colors[c]);
            if (live.some(function (r) { return r.text === filled; })) { return true; }
        }
        return false;
    }

    var name = term.replace(/\(\s*\)$/, "").trim().toLowerCase();
    if (v2NamedChecks[name.replace(/\s+/g, "")]) {
        return v2NamedChecks[name.replace(/\s+/g, "")](records, job);
    }

    if (typeof finalKeywordSet !== "undefined" && finalKeywordSet &&
        Object.prototype.hasOwnProperty.call(finalKeywordSet, term)) {
        return live.some(function (r) {
            var cats = r.categories && r.categories.length ? r.categories : categoriesOf(r.text);
            return cats.indexOf(term) !== -1;
        });
    }

    // Equivalence is for the RULE engine, where a rule written against a
    // non-canonical term ("female") would otherwise never fire because Phase 1
    // has already turned everything into `1girl`.
    //
    // defaultDB is the opposite case and passes exact:true. It was authored
    // against v1, which compares text and nothing else, and reading it with
    // equivalence on makes it far too eager — `female; breasts` fired on every
    // `1girl`, which then became `medium breasts` on every figure in the
    // project. v1 does not do that, and matching v1 is the whole point.
    if (exact) {
        return live.some(function (r) { return r.text === term; });
    }
    var wanted = equivalentKey(term);
    return live.some(function (r) { return equivalentKey(r.text) === wanted; });
}

// ============================================================================
//  shouldAdd — the insertion gate
// ============================================================================
//  Every addition in every phase goes through this one function. v1 already has
//  the exclusivity check inside appendWords (webui.js:1667); what was missing is
//  that most steps never called it. The funnel IS the mechanism.
//
//  It declines, never overwrites (Rule 27): a typed tag is never removed to make
//  room for an injected one.
//
//  EXCLUSIVITY IS READ FROM ONE FIGURE'S POINT OF VIEW: her own scope, plus the
//  global scope, and nothing else. A group blocks when either holds:
//    1. the competitor is UNOWNED - you said it about the picture, so it is true
//       of every figure in the picture, including this one
//    2. the competitor is owned by the SAME subject, by scope or by an earlier
//       injection
//  Another figure's own tags are invisible here, always.
//
//  Both CORPUS Phase 3 probes turn on this. In `.frieren, .fern, 2girls, duo,
//  angry` the loose `angry` is global, so it blocks Frieren's `kuudere`. In the
//  same shot Fern's `large breasts` never touches Frieren's `flat chest`,
//  because those live in two different local scopes.
//
//  Revised 2026-08-06. This used to consult `job.uniform` and let an ambiguous
//  global tag through on the grounds that Rule 8 forbids arbitrating ambiguity.
//  In practice that felt wrong every time: writing `angry` about a two-girl shot
//  plainly means both of them, and getting `kuudere` anyway reads as the engine
//  ignoring you. Ambiguity is still never arbitrated BETWEEN figures - it is
//  just that a global tag was never ambiguous to begin with.

function exclusiveGroupsFor(text) {
    var groups = [];
    if (typeof exclusiveCategories === "undefined") { return groups; }
    var wanted = String(text).trim().toLowerCase();

    for (var g = 0; g < exclusiveCategories.length; g++) {
        var category = exclusiveCategories[g];
        var matchingLineIndexes = [];

        // Identify which line(s) in this category contain the tag
        for (var l = 0; l < category.lines.length; l++) {
            if (category.lines[l].indexOf(wanted) !== -1) {
                matchingLineIndexes.push(l);
            }
        }

        // If the tag exists in this category, gather forbidden tags from OTHER lines
        if (matchingLineIndexes.length > 0) {
            var forbiddenMembers = [];
            for (var l = 0; l < category.lines.length; l++) {
                // Skip lines where `wanted` lives
                if (matchingLineIndexes.indexOf(l) === -1) {
                    forbiddenMembers = forbiddenMembers.concat(category.lines[l]);
                }
            }
            groups.push({ name: category.name, forbiddenMembers: forbiddenMembers });
        }
    }
    return groups;
}

function shouldAdd(text, owner, records, job) {
    text = String(text == null ? "" : text).trim();
    if (!text) { return { ok: false, rule: "empty" }; }
    var live = livingRecords(records);
    var wanted = text.toLowerCase();

    for (var i = 0; i < live.length; i++) {
        if (live[i].text.toLowerCase() !== wanted) { continue; }
        if (live[i].owner === owner || live[i].owner == null) {
            return { ok: false, blockedBy: live[i].text, rule: "already present" };
        }
    }

    if (typeof setOfKeywordsToTriggerExclusiveCategory !== "undefined" &&
        setOfKeywordsToTriggerExclusiveCategory.has &&
        !setOfKeywordsToTriggerExclusiveCategory.has(text)) {
        return { ok: true };
    }

    var groups = exclusiveGroupsFor(text);
    for (var g = 0; g < groups.length; g++) {
        var group = groups[g];
        for (var r = 0; r < live.length; r++) {
            var other = live[r];
            var key = other.text.toLowerCase();
            
            if (key === wanted) { continue; }
            
            // Block only if the existing key belongs to a DIFFERENT line in the same category
            if (group.forbiddenMembers.indexOf(key) !== -1) {
                if (other.owner == null || other.owner === owner) {
                    return { ok: false, blockedBy: other.text, rule: group.name };
                }
            }
        }
    }
    return { ok: true };
}

// The single insertion path. Returns the new record, or null when the gate
// declined - and either way the trace says why.
function addRecord(text, options, records, job) {
    options = options || {};
    var owner = options.owner == null ? null : options.owner;
    // Phase 1's applyAliases is long past by the time anything is injected, so
    // the collapse happens here instead. It has to be BEFORE the gate: a
    // character carrying `female` must be seen as the `1girl` it is, both by the
    // already-present check and by exclusivity.
    // Rule 2c: a dictionary value written in single quotes is protected like a
    // typed one, so it is neither aliased nor readable by anything after this.
    var protectedInner = singleQuotedInner(text);
    text = protectedInner != null ? protectedPlaceholder(protectedInner, job) : canonicalAlias(text);
    var verdict = shouldAdd(text, owner, records, job);
    if (!verdict.ok) {
        job.trace.declined.push({ text: text, rule: verdict.rule, blockedBy: verdict.blockedBy });
        return null;
    }
    var anchor = options.after || null;
    var record = makeRecord(text, anchor ? anchor.position : (options.position || 0));
    record.owner = owner;
    record.source = options.source || "engine";
    record.sequence = options.sequence || 0;
    record.weight = options.weight || 0;
    record.categories = categoriesOf(text);
    if (anchor) {
        records.splice(records.indexOf(anchor) + 1, 0, record);
    } else {
        records.push(record);
    }
    job.trace.added.push({ text: text, rule: record.source, owner: owner });
    return record;
}

// ============================================================================
//  PHASE 2 — SCOPE
// ============================================================================
//  Establishes who owns what, and whether the shot has one figure. Adds and
//  removes nothing: only the metadata behind the records changes.
//
//  A scope assigns ownership; it does not restrict by naming (Rule 5). Narrowing
//  is done with a cull command inside the scope, which Phase 5 applies to that
//  subject alone.

function promptScope(records, job) {
    resolveScopes(records, job);
    determineSolo(records, job);
    grantScopeImmunity(records, job);
    return records;
}

// A scope belongs to the character named immediately before it. Anything else -
// an ordinary tag, a franchise, nothing at all - opens an anonymous subject
// instead, which is what makes "{red hair}, {blue hair}" work with no database
// entry. Two bare scopes are always distinct subjects (Rule 4).
function resolveScopes(records, job) {
    var subjects = [];
    var byId = {};
    var anonCount = 0;

    function subjectFor(record) {
        var id = record.character && record.character.name
            ? record.character.name.toLowerCase()
            : record.text.toLowerCase();
        if (byId[id]) { return byId[id]; }
        var subject = {
            id: id,
            kind: "character",
            name: record.character ? record.character.name : record.text,
            franchise: record.character ? record.character.franchise : null,
            scoped: false
        };
        byId[id] = subject;
        subjects.push(subject);
        return subject;
    }

    // Named characters are subjects whether or not they carry a scope.
    for (var i = 0; i < records.length; i++) {
        var r = records[i];
        if (r.culledBy != null || r.scope != null) { continue; }
        if (r.character && r.character.kind !== "brand") { r.owner = subjectFor(r).id; }
    }

    // `frieren {head shot}, frieren {full body}` is TWO of her, not one scope
    // reopened. `subjectFor` is keyed on the character's name, so the second
    // scope used to find the first subject and hand it the same id — one
    // subject, one rendered line, and the regional adapter saw nothing to
    // divide and quietly sent an ordinary generation.
    //
    // Only a SECOND scope forks. `frieren, frieren {head shot}` stays one
    // figure, because the bare name is not a declaration of another body.
    var instances = {};
    function anotherInstanceOf(subject) {
        instances[subject.id] = (instances[subject.id] || 1) + 1;
        var copy = {
            id: subject.id + "#" + instances[subject.id],
            kind: subject.kind,
            // The NAME is unchanged on purpose: it is the booru tag, and both
            // instances still have to emit it (Rule 5). Only the id forks, and
            // the id never reaches output (Rule 3).
            name: subject.name,
            franchise: subject.franchise,
            scoped: true
        };
        byId[copy.id] = copy;
        subjects.push(copy);
        return copy;
    }

    for (var s = 0; s < job.scopes.length; s++) {
        var scope = job.scopes[s];
        var before = scope.precededBy || null;
        var owner;

        if (before && before.scope == null && before.character && before.character.kind !== "brand") {
            owner = subjectFor(before);
            if (owner.scoped) { owner = anotherInstanceOf(owner); }
            owner.scoped = true;
            // The opening record has to move with its scope. The loop above gave
            // every bare character record the FIRST subject's id, so without
            // this the second `frieren` stays owned by the first instance and
            // her cell renders with no identity tag in it.
            before.owner = owner.id;
        } else {
            anonCount++;
            owner = { id: "anon" + anonCount, kind: "anonymous", name: null, franchise: null, scoped: true };
            byId[owner.id] = owner;
            subjects.push(owner);
        }
        scope.owner = owner.id;
        for (var k = 0; k < records.length; k++) {
            if (records[k].scope === scope.id) { records[k].owner = owner.id; }
        }
    }

    job.subjects = subjects;
    return records;
}

// Two separate questions, and conflating them is why v1's exclusivity misfires:
//
//   solo      is there one figure? read by anything that cares about count.
//   uniform   does an unowned tag apply to every figure? this is what the
//             insertion gate reads. `symmetrical` is a GROUP tag - two figures -
//             but the figures mirror each other, so an attribute still applies
//             to both. Solo implies uniform; symmetrical gives uniform without it.
//
// The verdict is derived rather than trusted, because `solo` very often is not
// typed. It defaults to solo: one named character and no count tag is
// overwhelmingly a single-figure image, and that is exactly the case where the
// tag gets left off.
function determineSolo(records, job) {
    var live = livingRecords(records);
    var inCategory = function (category) {
        var set = typeof finalKeywordSet !== "undefined" && finalKeywordSet
            ? finalKeywordSet[category] : null;
        if (!set) { return []; }
        return live.filter(function (r) { return set.has(r.text); }).map(function (r) { return r.text; });
    };

    var symmetrical = live.some(function (r) { return r.text === "symmetrical"; });
    var soloTags = inCategory("sceneCountSolo");
    var groupTags = inCategory("sceneCountGroup").filter(function (t) { return t !== "symmetrical"; });
    var partnerTags = inCategory("scenePartner").filter(function (t) { return t !== "symmetrical"; });

    // `scenePartner` has 1869 members and is scene-INTERACTION, not
    // partner-presence, so some of it is evidence of a second figure and some
    // of it is a held object. `holding rod` flipped a solo fishing shot to
    // `duo`, which hit almost every prompt with something in a hand.
    //
    // The two cannot be told apart from the data: `holding rod` and
    // `human on anthro` are both in scenePartner and in nothing else. Curating
    // the category is Noodle's call and is still open.
    //
    // What CAN be settled is the `holding ` prefix. All 78 of those entries were
    // read, and every one is an object — weapon, cup, fishing rod, pickaxe,
    // grimoire. Nothing you hold in a booru tag is a person. Excluding exactly
    // that prefix fixes the reported case and leaves `human on anthro` alone,
    // which three pipeline tests pin.
    //
    // Removing partner tags WHOLESALE was tried first and broke those three:
    // `human on feral` really does mean two figures. If this list is ever
    // curated properly, delete the prefix test rather than adding to it.
    partnerTags = partnerTags.filter(function (t) { return t.indexOf("holding ") !== 0; });

    // A FOCUS modifier is not a second figure either, and for a different
    // reason: `mostly offscreen futa` says there is somebody else and that she
    // is explicitly not one of the counted figures. Letting it flip the count
    // produced `duo` where the answer is `solo focus` — the count tag counts
    // what the picture is ABOUT. emitFocusTags turns the count into a focus
    // count precisely because these tags are present.
    partnerTags = partnerTags.filter(function (t) {
        return v2FocusModifiers.indexOf(t) === -1;
    });

    var reasons = [];
    var solo = true;
    if (job.subjects.length > 1) { solo = false; reasons.push(job.subjects.length + " subjects"); }
    if (groupTags.length) { solo = false; reasons.push("count tag: " + groupTags[0]); }
    if (partnerTags.length) { solo = false; reasons.push("partner tag: " + partnerTags[0]); }

    // An explicit `solo` that the rest of the prompt contradicts loses, and says
    // so. Guessing "not solo" costs a duplicate tag; guessing "solo" silently
    // strips the second figure's attributes at the gate, which is worse.
    if (soloTags.length && !solo) {
        job.trace.conflicts.push({
            text: soloTags[0],
            rule: "solo tag contradicted by " + reasons.join(", ")
        });
    }

    job.solo = solo;
    // Nothing in the engine reads this any more. The insertion gate stopped on
    // 2026-08-06, and per-entry replacements — the last consumer — stopped when
    // they learned to fan a global tag across the whole cast instead of guessing
    // which figure it meant. It is still DERIVED because it is still true and
    // CORPUS's Phase 2 probe asserts on it; treat a new read of it as a sign
    // that something is about to arbitrate ambiguity it should not.
    job.uniform = solo || symmetrical;
    job.soloReason = solo ? (soloTags.length ? "explicit: " + soloTags[0] : "default") : reasons.join(", ");
    return records;
}

// Naming a category outright inside a scope says you want it. A category name is
// the strict v1 form - "bodyTail", not "tail" - which is what keeps this from
// firing on ordinary words.
//
// This only MARKS them. The protection is granted in Phase 5, where categories
// have been assigned and owners resolved, and the marker is consumed there: it
// is a command, not a tag, and `bodyTail` must never reach the model.
function grantScopeImmunity(records, job) {
    if (typeof finalKeywordSet === "undefined" || !finalKeywordSet) { return records; }
    for (var i = 0; i < records.length; i++) {
        var r = records[i];
        if (r.culledBy != null || r.scope == null) { continue; }
        if (!Object.prototype.hasOwnProperty.call(finalKeywordSet, r.text)) { continue; }
        r.immune = true;
        r.system = { kind: "scoped category", consumedBy: 5, emit: false };
    }
    return records;
}
// ============================================================================
//  PHASE 3 — EXPANSION
// ============================================================================
//  Fills freely. Culling decides what survives, and no step here predicts a
//  later cull (Rule 10). Every addition goes through the gate, which declines
//  rather than overwriting (Rule 27), so nothing typed is ever displaced.
//
//  A scope does NOT restrict what gets injected. `frieren {head only}` expands
//  her fully and the cull command trims her afterwards - that is Rule 5, and it
//  is why this phase never looks at scope contents.

function promptExpand(records, job) {
    records = expandCharacters(records, job);
    records = expandQualifiedReferences(records, job);
    records = expandCosplayTags(records, job);
    records = expandOutfits(records, job);
    records = decomposeCompoundTags(records, job);
    records = applyReplaceCommands(records, job);
    records = dedupeRecords(records, job);
    return records;
}

// ---------------------------------------------------------------------------
//  Compound-name unpacking
// ---------------------------------------------------------------------------
//  `Large Foreskin` is one word to type and four tags to generate with.
//
//  v1's `replaceGenitalShortcuts` rebuilds all 7,308 candidate names — 7 sizes ×
//  29 colours × 3 variants × 12 shortcuts — on EVERY keyword it is handed, at
//  about 22 ms a call. Calling it per record made a compile twenty times slower,
//  and it is the reason unpacking a second time for Phase 4 was unaffordable.
//
//  The combinations do not change, so they are built once into a lookup and the
//  match becomes a hash hit. Same names, same expansions, same first-match-wins
//  order — webui2-test.js checks this table against v1's function directly, so a
//  drift between them fails a test rather than quietly changing prompts.

var v2CompoundIndex = null;

function buildCompoundIndex() {
    if (v2CompoundIndex) { return v2CompoundIndex; }
    v2CompoundIndex = {};
    if (typeof genitalShortcutArray === "undefined") { return v2CompoundIndex; }
    var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };

    // Iteration order matters: v1 stops at its first match, so whichever
    // combination it would reach first has to be the one stored here.
    for (var si = 0; si < genitalSizeTags.length; si++) {
        for (var ci = 0; ci < genitalColorTags.length; ci++) {
            for (var vi = 0; vi < genitalVariantTags.length; vi++) {
                for (var ki = 0; ki < genitalShortcutArray.length; ki++) {
                    var size = genitalSizeTags[si];
                    var color = genitalColorTags[ci];
                    var variant = genitalVariantTags[vi];
                    var shortcut = genitalShortcutArray[ki];

                    var name = cap(size) + cap(variant) + cap(color) + shortcut[0];
                    name = name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
                    if (Object.prototype.hasOwnProperty.call(v2CompoundIndex, name)) { continue; }

                    var out = shortcut[1];
                    // `!== "medium"` and not `!== "medium "` — the array entry
                    // carries a trailing space, so medium DOES get a size tag.
                    // v1's quirk, preserved on purpose.
                    if (size !== "" && size !== "medium") { out += ", " + size + shortcut[2]; }
                    if (variant !== "") { out += ", " + variant + color + shortcut[2]; }
                    else                { out += ", " + color + shortcut[2]; }
                    v2CompoundIndex[name] = out;
                }
            }
        }
    }
    return v2CompoundIndex;
}

// The expansion, or null if this is not a compound name. Case is load-bearing:
// v1 matches a capitalised first letter and lowercases the rest, which is why
// `Large Foreskin` unpacks and `large foreskin` is left alone as a real tag.
function expandCompound(text) {
    var index = buildCompoundIndex();
    var key = String(text == null ? "" : text)
        .replace("S. ", "Small ").replace("L. ", "Large ")
        .replace("H. ", "Huge ").replace("G. ", "Hyper ");
    var probe = key.charAt(0) + key.toLowerCase().slice(1);
    return Object.prototype.hasOwnProperty.call(index, probe) ? index[probe] : null;
}

// Splits a dictionary value into tags, unpacking any compound name in it. Used
// wherever the engine takes text from a dictionary rather than from a record.
function expandCompoundList(text) {
    var out = [];
    var pieces = String(text == null ? "" : text).split(",");
    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i].trim();
        if (!piece) { continue; }
        var expanded = expandCompound(piece);
        var tags = expanded ? expanded.split(",") : [piece];
        for (var t = 0; t < tags.length; t++) {
            var tag = tags[t].trim();
            if (tag && out.indexOf(tag) === -1) { out.push(tag); }
        }
    }
    return out;
}

// Per record rather than over the whole string, so the pieces inherit the owner:
// in a two-figure shot only the figure who was given the shortcut gets them.
function decomposeCompoundTags(records, job) {
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.culledBy != null || record.system || record.literal) { continue; }
        var expanded = expandCompound(record.text);
        if (!expanded) { continue; }

        var pieces = String(expanded).split(",")
            .map(function (t) { return t.trim(); })
            .filter(Boolean);
        if (!pieces.length) { continue; }

        job.trace.added.push({
            text: pieces.join(", "),
            rule: "shortcut: " + record.text,
            owner: record.owner
        });
        record.text = pieces[0];
        record.source = "engine:shortcut";
        record.categories = categoriesOf(pieces[0]);
        i += injectAfter(pieces.slice(1), record, record.owner,
                         "engine:shortcut", records, job);
    }
    return records;
}

// A paren in a stored prompt is one of two completely different things, and the
// databases used to tell them apart by escaping one of them. They no longer do
// (Rule 1b) — the difference is read from POSITION instead:
//
//   (alraune, dryad)        opens where a TAG opens, so it wraps whole tags —
//                           v1's emphasis syntax. Two tags, w1 each.
//   nero claudius (fate)    opens with tag text already in front of it, so it
//                           belongs to the name. One tag, parens and all.
//   (nero claudius (fate))  both at once, nested. One tag, at w1.
//
// `kinds` remembers which sort each open paren was so its matching close reads
// the same way. Escaping was what produced the worst bug of the animadex import
// — the databases are template literals, so `\(` collapses to `(` on load and a
// name arrived looking exactly like an emphasis group — and this is the rule that
// makes the escaping unnecessary. Legacy escaped data still loads: `\(` is
// unescaped before the walk and lands on the same rule, because no paren that
// opens a tag has ever been escaped.
//
// `;` resets the boundary because every database that stores a prompt uses it as
// the field separator: `.furTrap; (alraune, dryad)` opens a tag at the `(`. A
// newline resets the paren stack too, so one unbalanced line cannot eat the next.
//
// One walker, two consumers: `splitStoredPrompt` builds records out of the
// events and `escapeStoredNames` builds v1's escaped text back out of them, so
// the rule is written once and cannot drift between them.
function walkStoredPrompt(text, emit) {
    var source = String(text == null ? "" : text).replace(/\\([()])/g, "$1");
    var kinds = [];        // one flag per open paren — true if it is part of a name
    var pending = false;   // does the tag being read have any text in it yet?

    for (var i = 0; i < source.length; i++) {
        var ch = source.charAt(i);
        if (ch === "(") {
            kinds.push(pending);
            if (pending) { emit("text", "("); }
            else { emit("open"); }
            continue;
        }
        if (ch === ")") {
            // An unmatched close is forgiven rather than reported — a dictionary
            // line is not user input and there is nobody at the keyboard to tell
            // — and it is forgiven as a GROUP close, so a stray one is dropped
            // rather than surviving into the prompt as `no legs\)`.
            if (kinds.length && kinds.pop()) { emit("text", ")"); }
            else { emit("close"); pending = false; }
            continue;
        }
        if (ch === ",") { emit("comma"); pending = false; continue; }
        if (ch === ";") { emit("text", ";"); pending = false; continue; }
        if (ch === "\n") { kinds.length = 0; pending = false; emit("text", "\n"); continue; }
        emit("text", ch);
        if (ch.trim()) { pending = true; }
    }
}

// Rule 1: weight is a score, not punctuation. An emphasis group is unwrapped here
// and its members come back carrying the paren depth. `(manly)` is one tag at w1;
// `(alraune, dryad)` is two tags at w1 each; `((x))` is w2. Records hold the text
// bare either way (Rule 1b) — the backslashes go back on at render.
//
// Returns { text, weight }. `injectRun` takes that shape directly; a caller that
// only wants the names reads `.text`.
//
// Explicit `(tag:1.4)` weights are deliberately NOT read here: no dictionary
// writes one, and `tokenizePrompt` already owns that syntax up in text space.
function splitStoredPrompt(text) {
    var out = [];
    var buffer = "";
    var depth = 0;

    function flush() {
        var tag = buffer.trim();
        buffer = "";
        if (tag) { out.push({ text: tag, weight: depth }); }
    }

    walkStoredPrompt(text, function (event, ch) {
        if (event === "text") { buffer += ch; return; }
        flush();
        if (event === "open") { depth++; }
        else if (event === "close" && depth > 0) { depth--; }
    });
    flush();
    return out;
}

// The reverse trip, for v1. v1 reads a stored prompt as plain text and strips
// emphasis parens out of it, so it needs the name parens escaped the way the
// files used to hold them. `cleanupCharacterArray` runs this over the raw text as
// the database is built, which is exactly the deal: the `.js` file holds
// `nero claudius (fate)` as it is typed, and the escaping is added on the way in.
//
// v2 does not need it — `splitStoredPrompt` unescapes again on the way past — but
// running it for both engines keeps ONE in-memory form of the database rather
// than two, and it is what makes stripping the backslashes out of the files a
// no-op for everything downstream.
// Only the VALUE half of a line. Everything before the first `; ` is a KEY — a
// codename, an outfit name, or a replacement target — and a key is matched
// against text the engine holds unescaped, so escaping one makes it unreachable.
// The animadex import is what proves it: its codenames are the canonical booru
// tags, `.2p (nier:automata)` and 23,930 more, and escaping those broke both
// typing the reference and the names-block link that finds her entry.
// charactersDB has no key with a paren in it, so this changes nothing there.
//
// A line with no `; ` is a comment or a heading and is left exactly as written.
function escapeStoredNames(text) {
    var lines = String(text == null ? "" : text).split("\n");
    for (var i = 0; i < lines.length; i++) {
        var cut = lines[i].indexOf("; ");
        if (cut === -1) { continue; }
        lines[i] = lines[i].slice(0, cut + 2) + escapeStoredValue(lines[i].slice(cut + 2));
    }
    return lines.join("\n");
}

function escapeStoredValue(text) {
    var out = "";
    walkStoredPrompt(text, function (event, ch) {
        if (event === "text") { out += (ch === "(" || ch === ")") ? "\\" + ch : ch; }
        else if (event === "open") { out += "("; }
        else if (event === "close") { out += ")"; }
        else { out += ","; }
    });
    return out;
}

// Injects after the tag that triggered it, chaining so the injected run keeps
// its own order. An injected tag inherits the trigger's position (Rule 18) and
// its owner (Rule 6). Returns how many landed — decomposeCompoundTags steps its
// loop index past them.
function injectAfter(tags, anchor, owner, source, records, job) {
    return injectRun(tags, anchor, owner, source, records, job).added;
}

// The same insertion, also reporting the LAST record it placed. Fanning a global
// tag out across several figures chains each run off the tail of the one before,
// so the runs land in subject order rather than reversed — every call anchored
// on the same trigger would splice itself directly after it, ahead of whatever
// the previous call had already put there.
function injectRun(tags, anchor, owner, source, records, job) {
    var previous = anchor;
    var added = 0;
    var created = [];
    for (var i = 0; i < tags.length; i++) {
        // A stored prompt arrives as { text, weight } so an emphasis group keeps
        // its score; everything else is a bare string with no emphasis of its own.
        var tag = tags[i];
        var plain = typeof tag === "string";
        var record = addRecord(plain ? tag : tag.text, {
            owner: owner,
            after: previous,
            sequence: i + 1,
            source: source,
            weight: plain ? 0 : (tag.weight || 0)
        }, records, job);
        if (record) { previous = record; added++; created.push(record); }
    }
    return { added: added, tail: previous, created: created };
}

// Remembers which record stands for each figure, and what her dictionary entry
// is. Asking the record list later does not work: the reference form is usually
// consumed moments after it expands — bare `frieren` becomes the canonical tag
// and the record that carried `.character` is culled — so by the time anything
// wants to fan a global tag across the cast, the cast is no longer visible.
function rememberSubject(record, job) {
    if (!job.subjectEntries) { job.subjectEntries = []; }
    for (var i = 0; i < job.subjectEntries.length; i++) {
        if (job.subjectEntries[i].owner === record.owner) { return; }
    }
    job.subjectEntries.push({ owner: record.owner, character: record.character });
}

// The figures a global tag reaches. Written inside a scope it reaches exactly
// one; written bare it is something said about the picture, so it reaches all of
// them (Rule 28).
function figuresReachedBy(record, job) {
    var all = job.subjectEntries || [];
    if (record.owner == null) { return all; }
    for (var i = 0; i < all.length; i++) {
        if (all[i].owner === record.owner) { return [all[i]]; }
    }
    return [];
}

function expandCharacters(records, job) {
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.culledBy != null) { continue; }
        if (!record.character || record.character.kind === "brand") { continue; }
        if (record.expanded) { continue; }
        var entry = record.character.entry;
        if (!entry || !entry.prompt) { continue; }

        record.expanded = true;
        rememberSubject(record, job);
        var tags = splitStoredPrompt(entry.prompt);
        injectAfter(tags, record, record.owner,
                    "charactersDB:" + (record.character.codename || record.text),
                    records, job);
        collectEntryReplacements(entry, record.owner, job);
        consumeReferenceForm(record, records, job);
    }
    return records;
}

// A codename or a display alias is a REFERENCE to a character, not a tag Forge
// has ever seen. Once expansion has put the canonical booru tag in the prompt,
// the form that was typed has done its whole job and is consumed (Rule 20 — a
// system keyword that needs a sigil is consumed; `.frieren` needs its dot).
//
// Guarded on the canonical actually having landed: a character with a names
// block but no charactersDB entry never expands, and there the typed form is the
// only thing naming her, so it has to survive.
function consumeReferenceForm(record, records, job) {
    var canonical = record.character.qualified || record.character.name;
    if (!canonical) { return; }
    if (record.text.toLowerCase() === String(canonical).toLowerCase()) { return; }
    var landed = records.some(function (r) {
        return r !== record && r.culledBy == null &&
               r.text.toLowerCase() === String(canonical).toLowerCase();
    });
    if (!landed) { return; }
    record.culledBy = "character reference consumed";
    record.strength = "hard";
}

// Outfits are opt-in by name. `outfitTypesList` holds the bare names - "default",
// "swimwear" - and cleanedOutfitArray keys them as ".codename*name".
//
// An outfit name written bare is a global tag, so it dresses EVERY figure in her
// own version of it (Rule 28): `duo, nutmeg, angelica, default` puts both in
// their own default rather than whichever one happened to be typed nearest.
// This used to bind to the nearest character before the tag, which is v1's
// behaviour and predates scopes existing.
//
// A figure who names an outfit INSIDE HER OWN SCOPE has answered the question,
// and a global one does not get to answer it again for her. `default,
// angelica {nude}` dresses the doe and leaves Angelica undressed; swap them and
// it works the other way. One outfit per figure, and the more specific
// statement wins — which is the ordinary reading of local versus global
// everywhere else, applied to a question that only has one answer.
//
// `nude` counts as an outfit for that purpose. It answers the same question,
// even though it is its own tag rather than a name for a list.
var v2BareOutfits = ["nude"];

function expandOutfits(records, job) {
    if (typeof cleanedOutfitArray === "undefined" || typeof outfitTypesList === "undefined") {
        return records;
    }
    var types = {};
    for (var t = 0; t < outfitTypesList.length; t++) {
        types[String(outfitTypesList[t]).trim().toLowerCase()] = true;
    }
    var bare = {};
    for (var n = 0; n < v2BareOutfits.length; n++) {
        types[v2BareOutfits[n]] = true;
        bare[v2BareOutfits[n]] = true;
    }

    // Gathered before anything expands, because expansion consumes the record
    // that says so and a later figure must still be able to overrule the same
    // global tag.
    var answered = {};
    for (var s = 0; s < records.length; s++) {
        if (records[s].culledBy != null || records[s].owner == null) { continue; }
        if (types[records[s].text.toLowerCase()]) { answered[records[s].owner] = true; }
    }

    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.culledBy != null || record.expanded || record.literal) { continue; }
        // A tag an outfit put here is content, not a command — see the note where
        // fromOutfit is set. Without this an outfit that names itself expands
        // forever.
        if (record.fromOutfit) { continue; }
        if (!types[record.text.toLowerCase()]) { continue; }

        var everyone = figuresReachedBy(record, job);
        var wearers = everyone;
        var overruled = false;
        if (record.owner == null) {
            wearers = everyone.filter(function (w) { return !answered[w.owner]; });
            overruled = wearers.length < everyone.length;
        }

        // Who gets what is settled BEFORE anything is injected, because a bare
        // outfit injects a copy of its own text and the original would turn that
        // copy away at the gate as "already present" while it is still alive.
        var plan = [];
        for (var w = 0; w < wearers.length; w++) {
            var codename = wearers[w].character && wearers[w].character.codename;
            if (!codename) { continue; }
            var outfit = findOutfit(codename, record.text);
            if (outfit) {
                plan.push({ owner: wearers[w].owner, outfit: outfit,
                            tags: splitStoredPrompt(outfit.prompt) });
            } else if (bare[record.text.toLowerCase()] && overruled) {
                // `nude` has nothing to look up. It only needs handling when a
                // scope has overruled it for somebody, and then only to keep it
                // away from her — otherwise it is already a global tag and
                // reaches everyone by doing nothing at all.
                plan.push({ owner: wearers[w].owner, outfit: null, tags: [record.text] });
            }
            // A figure with no entry for this outfit is simply not dressed by it.
            // She is not an error, and she must not stop the others being dressed.
        }

        // Nobody wore it and nobody overruled it, so nothing has said what it
        // means. Left alone rather than consumed — swallowing it would lose the
        // tag silently. Being overruled IS a statement, so that consumes.
        if (!plan.length && !overruled) { continue; }

        record.expanded = true;
        record.culledBy = plan.length ? "outfit name consumed" : "outfit overruled by a scope";
        record.strength = "hard";

        var anchor = record;
        for (var p = 0; p < plan.length; p++) {
            var run = injectRun(plan[p].tags, anchor, plan[p].owner,
                                plan[p].outfit ? "outfit:" + plan[p].outfit.codename
                                               : "outfit:scoped override",
                                records, job);
            // An outfit's tags are TAGS, never commands. Five outfits name
            // themselves in their own prompt — `*mario tennis; mario tennis, …`,
            // and four `*pajamas` — and without this the injected copy is read as
            // an outfit name on the next turn of the loop, expands again, injects
            // again, and the compile never returns. The trigger's own `expanded`
            // flag does not cover it because the copy is a NEW record, and the
            // gate does not turn it away because the trigger was consumed a few
            // lines above and is no longer live.
            for (var c = 0; c < run.created.length; c++) { run.created[c].fromOutfit = true; }
            anchor = run.tail;
            if (plan[p].outfit) { collectEntryReplacements(plan[p].outfit, plan[p].owner, job); }
        }
    }
    return records;
}

// ---------------------------------------------------------------------------
//  `character*thing` — borrowing part of a character without summoning her
// ---------------------------------------------------------------------------
//  `.frieren*default` takes her clothes. `frieren*bodyHair` takes her hair.
//  Neither puts HER in the picture: no identity tag, no subject, no expansion of
//  everything else she carries. That is the whole point — calling a character
//  through a scope brings her bodyBrand tags along with her, and sometimes you
//  want the dress on somebody else.
//
//  v1 matched `cleanedOutfitArray[i].codename` (stored as `.frieren*default`)
//  as a whole string. v2 only ever learned the bare form — `default`, bound to a
//  figure already in the shot — so the qualified form fell through as an unknown
//  tag and reached the model verbatim. This is that regression.
//
//  The right-hand side is an OUTFIT name first and a CATEGORY name second.
//  Category names are camelCase and outfit names are not, which is the same
//  discriminator cullDB's syntax already leans on — but it is checked by lookup
//  rather than by spelling, so a future outfit called `bodyHair` would still win
//  and would still be what was asked for.
function expandQualifiedReferences(records, job) {
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.culledBy != null || record.expanded || record.literal) { continue; }
        var star = record.text.indexOf("*");
        if (star <= 0 || star === record.text.length - 1) { continue; }

        var left = record.text.slice(0, star).trim();
        var right = record.text.slice(star + 1).trim();
        var codename = resolveCharacterCodename(left, records, job);
        if (!codename) { continue; }

        var entry = buildCharacterIndex().codenames[codename];
        var tags = null;
        var source = null;

        var outfit = findOutfit(codename, right);
        if (outfit) {
            tags = splitStoredPrompt(outfit.prompt);
            source = "outfit:" + outfit.codename;
        } else if (entry && entry.prompt) {
            // A category: keep only the tags of hers that belong to it.
            var wanted = String(right);
            tags = splitStoredPrompt(entry.prompt).filter(function (t) {
                return categoriesOf(t.text).indexOf(wanted) !== -1;
            });
            source = "charactersDB:" + codename + "*" + wanted;
            if (!tags.length) { tags = null; }
        }

        // Named a character but not a thing she has. Left visible rather than
        // swallowed — `.frieren*swimsuit` is a typo you want to see.
        if (!tags || !tags.length) {
            job.trace.unmatched.push({ text: record.text, rule: "no outfit or category `" + right + "`" });
            continue;
        }

        record.expanded = true;
        record.culledBy = "qualified reference consumed";
        record.strength = "hard";
        injectAfter(tags, record, record.owner, source, records, job);
        // Deliberately NOT collectEntryReplacements: her `penis` rule belongs to
        // her, and she is not in this picture.
    }
    return records;
}

// `frieren (cosplay)` — somebody dressed AS Frieren. Pulls her default outfit,
// and nothing else about her: it is a costume, not a cast member. No identity
// tag, no subject, none of her body.
//
// Deliberately NOT the same job as `.frieren*default`. That one takes the
// clothes silently and is for pulling in particular details; this one takes the
// clothes AND announces itself, because the tag is the point of a cosplay shot.
// Alternate outfits are out of scope by design — a cosplay is the look the
// character is known for, and `*alternate` already exists for the other case.
//
// `cosplay` always follows the named tag: the model reads the pair better than
// either alone.
function expandCosplayTags(records, job) {
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.culledBy != null || record.expanded || record.literal) { continue; }
        var match = record.text.match(/^(.+?)\s*\(cosplay\)$/i);
        if (!match) { continue; }

        var codename = resolveCharacterCodename(match[1], records, job);
        if (!codename) { continue; }

        // ALWAYS the canonical tag, never what was typed. `frieren (cosplay)`
        // and `frieren (sousou no frieren) (cosplay)` would otherwise both reach
        // the output as written, and two near-identical tags for one costume is
        // exactly the kind of thing that poisons a training set. Whichever way
        // she was named, one tag comes out.
        var canonical = canonicalTagFor(codename);
        if (!canonical) { continue; }
        record.text = canonical + " (cosplay)";
        record.source = "engine:cosplay";
        record.categories = ["clothesCosplay"];
        record.expanded = true;

        var anchor = injectRun(["cosplay"], record, record.owner,
                               "engine:cosplay", records, job).tail;
        if (anchor !== record) { anchor.categories = ["clothesCosplay"]; }

        var outfit = findOutfit(codename, "default");
        if (outfit) {
            injectAfter(splitStoredPrompt(outfit.prompt), anchor, record.owner,
                        "outfit:" + outfit.codename, records, job);
        }
    }
    return records;
}

// The one tag that stands for a character, whichever way she was named. Mirrors
// normalizeCharacterTags: a names block carries the canonical booru tag, and an
// original character has none, so her entry's FIRST tag is it — charactersDB is
// written identity-first.
function canonicalTagFor(codename) {
    var index = buildCharacterIndex();
    var entry = index.codenames[codename];
    if (!entry) { return null; }
    var known = index.names[codename];
    var canonical = known ? known.qualified : firstStoredTag(entry);
    if (!canonical) { canonical = firstStoredTag(entry); }
    return canonical || null;
}

// Every way of naming a character that `character*thing` accepts: the codename
// with or without its dot, an aliasDB display name, a brandsDB2 name, or the
// canonical tag her entry leads with (`sy-angelica`, which is not registered
// anywhere else because an original character has no names block).
var v2CanonicalCodenames = null;

// `records` and `job` are OPTIONAL and exist only for the syrup stem, which has
// to know whether `not furry` was typed. Callers that do not pass them get the
// fur form, which is the default anyway — so an old call site cannot break, it
// can only miss the fleshy case. Both live call sites pass them.
function resolveCharacterCodename(text, records, job) {
    var index = buildCharacterIndex();
    var key = String(text == null ? "" : text).trim().toLowerCase();
    if (!key) { return null; }

    if (index.aliases[key]) { key = String(index.aliases[key]).toLowerCase(); }
    // After the alias, before every lookup — an alias resolves a display name to
    // the STEM (`angelica` -> `.syrupmayor`) and the stem is not an entry.
    key = resolveSyrupVariant(key, records || [], job || { trace: { added: [], unmatched: [] } });
    if (index.codenames[key]) { return key; }
    if (index.names[key] && index.names[key].codename) { return String(index.names[key].codename).toLowerCase(); }

    var dotted = "." + key;
    if (index.codenames[dotted]) { return dotted; }
    if (index.names[dotted] && index.names[dotted].codename) { return String(index.names[dotted].codename).toLowerCase(); }

    if (!v2CanonicalCodenames) {
        v2CanonicalCodenames = {};
        for (var name in index.codenames) {
            if (!Object.prototype.hasOwnProperty.call(index.codenames, name)) { continue; }
            var first = firstStoredTag(index.codenames[name]);
            if (!first) { continue; }
            // Only if that first tag is plausibly an IDENTITY tag. charactersDB
            // is meant to be written identity-first and mostly is, but 46 entries
            // lead with an ordinary descriptive keyword — `.furgekka` with
            // `1boy`, `.mysticImp` with `black skin` — and without this guard
            // each of those claims that word as a name, so `1boy*default`
            // resolved to whichever entry happened to win the map and handed
            // back her clothes.
            //
            // An identity tag is either in no category at all (`sy-doe`,
            // `fl-angelica` before it was listed) or is bodyBrand and nothing
            // else. A tag that is bodyRace, sceneCount or clothing is a
            // description, and nobody should be able to dress it.
            var cats = categoriesOf(first);
            if (cats.length && !(cats.length === 1 && cats[0] === "bodyBrand")) { continue; }
            v2CanonicalCodenames[String(first).toLowerCase()] = name;
        }
    }
    return v2CanonicalCodenames[key] || null;
}

function findOutfit(codename, name) {
    var wanted = (codename + "*" + name).toLowerCase();
    for (var o = 0; o < cleanedOutfitArray.length; o++) {
        if (String(cleanedOutfitArray[o].codename).toLowerCase() === wanted) {
            return cleanedOutfitArray[o];
        }
    }
    return null;
}

// `replace <domain>` clears what came BEFORE it and keeps what comes after -
// the one place input order carries meaning (Rule 18). Rejected inside a scope,
// where there is no meaningful before-and-after (see CATCH-UP).
function applyReplaceCommands(records, job) {
    var fired = false;
    for (var i = 0; i < records.length; i++) {
        var command = records[i];
        if (command.culledBy != null) { continue; }
        if (!command.system || command.system.kind !== "reset") { continue; }

        if (command.scope != null) {
            job.errors.push("`" + command.text + "` is not allowed inside a scope");
            continue;
        }

        var domain = resetDomain(command.text);
        if (!domain) { continue; }

        for (var r = 0; r < records.length; r++) {
            var victim = records[r];
            if (victim === command || victim.culledBy != null) { continue; }
            if (victim.position >= command.position) { continue; }
            var cats = victim.categories && victim.categories.length
                ? victim.categories : categoriesOf(victim.text);
            var hit = cats.some(function (c) { return c.toLowerCase().indexOf(domain) === 0; });
            if (!hit) { continue; }
            victim.culledBy = command.text;
            victim.strength = "hard";
            job.trace.culled.push({ text: victim.text, rule: command.text, strength: "hard" });
        }
        command.culledBy = "replace command consumed";
        command.strength = "hard";
        fired = true;
    }
    if (fired) { dropReplacedSubjects(records, job); }
    return records;
}

// A figure whose identity tag the replace took away is not in the picture any
// more, and everything still hanging off her has to go with her.
//
// This cannot be solved by running the replace earlier. `expandOutfits` has to
// come first, or an outfit named BEFORE the command would inject its clothes
// after the cull had already passed and `replace all clothing` would miss them.
// So the outfit does dress her, and she is cleaned up afterwards instead.
//
// Three reported symptoms, one cause:
//   - `.frieren, replace all character, .fern, default` dressed BOTH of them,
//     because a bare outfit fans out to every figure and she was still one
//   - the shot came out `duo`, because the count phase could still see her
//   - `kuudere` survived, because it is an expression rather than a body tag and
//     the domain filter spared it — but it was only ever there as HERS
//
// Only `character` subjects are considered. An anonymous `{…}` scope has no
// identity tag to lose, so it can never look dead by this test.
function dropReplacedSubjects(records, job) {
    if (!job.subjects || !job.subjects.length) { return records; }

    var identityAlive = {};
    for (var i = 0; i < records.length; i++) {
        var r = records[i];
        if (r.culledBy != null || r.owner == null) { continue; }
        if (String(r.text).toLowerCase() === String(r.owner).toLowerCase()) {
            identityAlive[r.owner] = true;
        }
    }

    var gone = {};
    for (var s = job.subjects.length - 1; s >= 0; s--) {
        var subject = job.subjects[s];
        if (subject.kind !== "character") { continue; }
        if (identityAlive[subject.id]) { continue; }
        gone[subject.id] = true;
        job.subjects.splice(s, 1);
    }
    if (!Object.keys(gone).length) { return records; }

    for (var e = (job.subjectEntries || []).length - 1; e >= 0; e--) {
        if (gone[job.subjectEntries[e].owner]) { job.subjectEntries.splice(e, 1); }
    }
    // Her replacement rules leave with her too, or they would still rewrite
    // tags belonging to whoever replaced her.
    for (var q = (job.entryReplacements || []).length - 1; q >= 0; q--) {
        if (gone[job.entryReplacements[q].owner]) { job.entryReplacements.splice(q, 1); }
    }

    for (var v = 0; v < records.length; v++) {
        var victim = records[v];
        if (victim.culledBy != null || victim.owner == null) { continue; }
        if (!gone[victim.owner]) { continue; }
        victim.culledBy = "figure replaced away";
        victim.strength = "hard";
        job.trace.culled.push({ text: victim.text, rule: victim.culledBy, strength: "hard" });
    }

    // Solo is settled in Phase 2, before any of this happened, and Phase 4's
    // count tags read that verdict rather than recounting. Left alone, a replace
    // that removes one of two figures still emits `duo` beside `1girl`. Rule 19
    // says the engine works out whether the shot is solo — so it works it out
    // again, now that the cast has changed.
    determineSolo(records, job);
    return records;
}
// ============================================================================
//  PHASE 4 — SECOND CLEANUP
// ============================================================================
//  Runs against the settled prompt. Only the count correction is built; the
//  conditional replacements, contextual defaults, parasites and per-entry
//  replacement rules are still to come.

function promptResolve(records, job) {
    records = resolveGender(records, job);
    records = applyEntryReplacements(records, job);
    records = applyContextualDefaults(records, job);
    // §D·14: the anus rule reads "their tags OR DEFAULTS", so this cannot be an
    // extension of the replacement pass above — it has to run once the defaults
    // have landed, which makes it a separate, later step inside the same phase.
    records = applyBodypartDefaults(records, job);
    records = emitCountTags(records, job);
    records = supersedeSoloCounts(records, job);
    // Last in the phase: it needs the settled count and the settled genders.
    records = emitFocusTags(records, job);
    return records;
}

// ---------------------------------------------------------------------------
//  Gender, resolved against the figure rather than the image
// ---------------------------------------------------------------------------
//  `female` becomes `1girl` or `furry female`; `male` becomes `1boy` or
//  `furry male`. Which one depends on what the figure IS, and that is a
//  per-owner question: in a shot with a human and an anthro, the image-level
//  `anthro` must not turn the human furry.
//
//  A figure's own `human` or `not furry` therefore beats everything. It is the
//  clearest statement available and `.syrupcarp` carries exactly that pair.
//  With no marker at all the answer is the plain count tag — most of
//  charactersDB is anime characters who say nothing either way, and only 2 of
//  the 395 entries carrying a gender word mention `anthro`.

var v2FurryMarkers = ["anthro", "furry", "feral", "furry female", "furry male", "kemono"];
var v2HumanMarkers = ["human", "not furry", "humanoid"];

function hasAnyText(recordList, wanted) {
    for (var i = 0; i < recordList.length; i++) {
        if (wanted.indexOf(recordList[i].text.toLowerCase()) !== -1) { return true; }
    }
    return false;
}

function resolveGender(records, job) {
    var live = livingRecords(records);
    for (var i = 0; i < live.length; i++) {
        var record = live[i];
        var term = record.text.toLowerCase();
        if (!v2GenderTerms[term]) { continue; }

        var own = [], loose = [];
        for (var r = 0; r < live.length; r++) {
            if (live[r] === record) { continue; }
            if (record.owner != null && live[r].owner === record.owner) { own.push(live[r]); }
            else if (live[r].owner == null) { loose.push(live[r]); }
        }
        if (record.owner == null) { own = live; }

        var furry;
        if (hasAnyText(own, v2HumanMarkers))       { furry = false; }
        else if (hasAnyText(own, v2FurryMarkers))  { furry = true; }
        else if (hasAnyText(loose, v2HumanMarkers)){ furry = false; }
        else if (hasAnyText(loose, v2FurryMarkers)){ furry = true; }
        else                                       { furry = false; }

        var resolved = term === "male"
            ? (furry ? "furry male" : "1boy")
            : (furry ? "furry female" : "1girl");

        job.trace.added.push({
            text: resolved,
            rule: term + " -> " + resolved + (furry ? " (furry context)" : ""),
            owner: record.owner
        });
        record.text = resolved;
        record.source = "engine:gender";
        record.categories = categoriesOf(resolved);
    }
    return records;
}

// ---------------------------------------------------------------------------
//  Per-entry replacement rules
// ---------------------------------------------------------------------------
//  A character or outfit carries `target; replacement` lines, run against the
//  SETTLED prompt rather than at expansion time — frieren's `staff; gold staff`
//  has to reach a `staff` you typed yourself, which did not exist when she
//  expanded. Owned, so in a two-figure shot only her staff turns to gold.

// Gathered in Phase 3, not re-derived here: by the time Phase 4 runs, the record
// that named the character has usually been consumed — `.frieren` and the bare
// `frieren` both are — so there is nothing left holding a pointer to her entry.
function collectEntryReplacements(entry, owner, job) {
    if (!entry || !entry.replacements || !entry.replacements.length) { return; }
    if (!job.entryReplacements) { job.entryReplacements = []; }
    for (var r = 0; r < entry.replacements.length; r++) {
        var halves = String(entry.replacements[r]).split(";");
        if (halves.length < 2) { continue; }
        job.entryReplacements.push({
            target: halves[0].trim().toLowerCase(),
            replacement: halves.slice(1).join(";").trim(),
            owner: owner
        });
    }
}

function applyEntryReplacements(records, job) {
    return applyReplacementRules(job.entryReplacements || [], records, job);
}

// The runner, shared with the bodypart defaults so a synthesised rule behaves
// exactly like a hand-written one — same ownership, same fan-out, same purge.
function applyReplacementRules(rules, records, job) {
    if (!rules.length) { return records; }

    // A global target is settled once, for every figure at the same time, rather
    // than once per rule — otherwise the first owner's rule to come up would
    // claim the tag and the second figure would never see it.
    var settled = {};

    for (var k = 0; k < rules.length; k++) {
        var rule = rules[k];
        // An EMPTY replacement is a purge — `crown; ` means this character does
        // not have one. cleaningDB's rulesets have always read a blank
        // replacement that way; per-entry rules used to skip the line entirely,
        // so Rosalina's `crown;` and `mini crown;` sat there doing nothing.
        if (!rule.target) { continue; }
        var victims = livingRecords(records);
        for (var v = 0; v < victims.length; v++) {
            var victim = victims[v];
            if (victim.literal) { continue; }
            if (victim.text.toLowerCase() !== rule.target) { continue; }

            if (victim.owner != null) {
                // Hers. Another figure's tag is invisible to this rule (Rule 28).
                if (victim.owner !== rule.owner) { continue; }
                applyReplacementTo(victim, rule.replacement, victim.owner, records, job);
                continue;
            }

            if (settled[rule.target]) { continue; }
            settled[rule.target] = true;
            fanOutReplacement(victim, rule.target, rules, records, job);
        }
    }
    return records;
}

// Rewrites one record in place and injects the rest of the list after it.
//
// A replacement is a LIST, and any entry in it may be a compound shortcut.
// `penis; Large Canine, red penis, veiny penis, futanari` is four tags, one of
// which unpacks into four more — and 403 of the 683 replacement lines in
// charactersDB carry a compound.
//
// Unpacking happens here rather than in Phase 3 because these rules deliberately
// run late, against the settled prompt. Phase 3 is long gone by now and will not
// come back for them.
// A rule with nothing on the right takes the tag away. Marked rather than
// spliced, like every other cull, so the trace can report it and Phase 6 can
// argue with it.
function purgeByEntryRule(victim, target, job) {
    victim.culledBy = "entry rule: " + target + ";";
    victim.strength = "hard";
    job.trace.culled.push({ text: victim.text, rule: victim.culledBy, strength: "hard" });
    return victim;
}

function applyReplacementTo(victim, replacement, owner, records, job) {
    var pieces = expandCompoundList(replacement);
    if (!pieces.length) { return purgeByEntryRule(victim, victim.text, job); }
    job.trace.added.push({
        text: pieces.join(", "),
        rule: victim.text + " -> " + replacement,
        owner: owner
    });
    victim.text = protectDictionaryValue(pieces[0], job);
    victim.owner = owner;
    victim.source = "engine:entry replacement";
    victim.categories = categoriesOf(pieces[0]);
    return injectRun(pieces.slice(1), victim, owner,
                     "engine:entry replacement", records, job).tail;
}

// A bare `penis` in a two-figure shot is a global tag, so it reaches both of
// them (Rule 28) and each reads it through her own rules. It used to reach
// neither: the tag was unowned, the rule was owned, and the two never met.
//
// A figure with no rule for the tag still gets it, unchanged — she has the
// thing, her entry simply does not describe it — which is what stops the tag
// disappearing for her the moment someone else's rule fires.
function fanOutReplacement(victim, target, rules, records, job) {
    var figures = job.subjectEntries || [];

    // One figure means nothing to fan out to, and no reason to pull the tag out
    // of the common block. Her rule applies where the tag already sits.
    if (figures.length < 2) {
        var only = ruleFor(rules, target, figures.length ? figures[0].owner : null);
        if (only) { applyReplacementTo(victim, only.replacement, victim.owner, records, job); }
        return;
    }

    var original = victim.text;
    var anchor = victim;
    var placed = 0;
    for (var f = 0; f < figures.length; f++) {
        var owner = figures[f].owner;
        var rule = ruleFor(rules, target, owner);
        var pieces = rule ? expandCompoundList(rule.replacement) : [original];
        if (!pieces.length) { continue; }
        if (rule) {
            job.trace.added.push({
                text: pieces.join(", "),
                rule: original + " -> " + rule.replacement,
                owner: owner
            });
        }
        if (placed === 0) {
            // Reuse the record that was typed, so the run stays where it sat.
            victim.text = protectDictionaryValue(pieces[0], job);
            victim.owner = owner;
            victim.source = "engine:entry replacement";
            victim.categories = categoriesOf(pieces[0]);
            anchor = injectRun(pieces.slice(1), victim, owner,
                               "engine:entry replacement", records, job).tail;
        } else {
            anchor = injectRun(pieces, anchor, owner,
                               "engine:entry replacement", records, job).tail;
        }
        placed++;
    }
    // Every figure's rule was a purge, so the tag belongs to nobody. Without
    // this the record keeps the text it was typed with and survives for all of
    // them — the opposite of what each rule asked for.
    if (placed === 0) { purgeByEntryRule(victim, target, job); }
}

function ruleFor(rules, target, owner) {
    for (var i = 0; i < rules.length; i++) {
        // No `&& rules[i].replacement` — a blank one is a purge and has to be
        // found, or the tag survives for a figure who declared she has none.
        if (rules[i].target === target && rules[i].owner === owner) {
            return rules[i];
        }
    }
    return null;
}

// ---------------------------------------------------------------------------
//  Bodypart defaults
// ---------------------------------------------------------------------------
//  REPLACE-OVERHAUL §A·1. A character whose entry says nothing about `penis`,
//  `balls`, `pussy`, `nipples` or `anus` gets one derived from the tags she DOES
//  have, so typing the part reaches something better than the bare word. The
//  animadex import is why this stopped being optional: 4,966 of its 22,340
//  characters arrived with no clothing tags at all and none with genitals.
//
//  A hand-written rule always wins. `cleanupCharacterShortcut` harvests a
//  character's explicit genital tags into a rule at load, so an entry that
//  mentions them already has one and is skipped here — this only fills silence.
//
//  Scoped to figures on purpose. A bare `penis` with nobody in the prompt has no
//  tags to derive from, and turning it into `Large Glans` for every prompt that
//  mentions one is not what the spec asks for.

var v2BodypartOrder = ["penis", "balls", "pussy", "nipples", "anus"];

// `(color) body`, `(color) skin`, `(color) countershading` are matched as a
// literal SUFFIX and deliberately not through `isPresent`: Rule 24 makes that
// equivalence-aware, and §A·5 singles this out as the one place where reaching
// for the engine's own helper would be the bug — `skin` and `body` are different
// rules with different priorities and must not read as the same thing.
function isColorPhrase(text) {
    if (!text || typeof modifierKeywordDB === "undefined") { return false; }
    var colors = modifierKeywordDB.colors || [];
    var variants = modifierKeywordDB.variants || [];
    if (colors.indexOf(text) !== -1 || variants.indexOf(text) !== -1) { return true; }
    var gap = text.indexOf(" ");
    if (gap === -1) { return false; }
    return variants.indexOf(text.slice(0, gap)) !== -1 &&
           colors.indexOf(text.slice(gap + 1)) !== -1;
}

// First suffix in the list that any of her tags ends with, which is how the
// spec's "ignore if a colour was already added" is expressed: the caller passes
// the suffixes in its own priority order. penis is body/skin/countershading;
// balls puts countershading first, and the spec says so twice.
function bodypartColorFor(tags, suffixes) {
    for (var s = 0; s < suffixes.length; s++) {
        var tail = " " + suffixes[s];
        for (var t = 0; t < tags.length; t++) {
            var tag = tags[t];
            if (tag.length <= tail.length) { continue; }
            if (tag.slice(tag.length - tail.length) !== tail) { continue; }
            var color = tag.slice(0, tag.length - tail.length).trim();
            if (isColorPhrase(color)) { return color; }
        }
    }
    return null;
}

// Size -> Colour -> Name, and it is NOT commutative: `Large Black Glans` is a
// shortcut and `Black Large Glans` is not (§A·1). The colour goes in the MIDDLE,
// which is why this composes a NAME and asks the table about it rather than
// gluing tags together.
//
// A colour the compound table has never carried — `pale`, `beige`, `plant` — is
// dropped rather than allowed to make the whole name unknown, because an unknown
// name is emitted as literal text. Losing the colour is the smaller loss.
function composeBodypartShortcut(size, color, name) {
    if (color) {
        var tinted = (size ? size + " " : "") + color + " " + name;
        if (expandCompound(tinted)) { return tinted; }
    }
    return (size ? size + " " : "") + name;
}

// Her tags, as this step is allowed to see them: what her entry stores plus
// everything live in her view. The entry half is what the spec means by "in
// their tags" — `female` is still `female` there, while `resolveGender` has
// already turned the record into `1girl` — and the live half is what §D·14 means
// by "or defaults", which is the whole reason this runs after them.
function bodypartTagsFor(owner, entry, records) {
    var tags = [];
    var seen = {};
    var push = function (text) {
        var key = String(text).toLowerCase().trim();
        if (!key || seen[key]) { return; }
        seen[key] = true;
        tags.push(key);
    };
    if (entry && entry.prompt) {
        var stored = splitStoredPrompt(entry.prompt);
        for (var s = 0; s < stored.length; s++) { push(stored[s].text); }
    }
    var live = livingRecords(records);
    for (var i = 0; i < live.length; i++) {
        if (inView(live[i], owner)) { push(live[i].text); }
    }
    return tags;
}

var v2FemaleTags = ["female", "1girl", "furry female", "futanari"];
var v2MaleTags   = ["male", "1boy", "furry male"];

function buildBodypartDefaults(records, job) {
    var figures = job.subjectEntries || [];
    var existing = job.entryReplacements || [];
    var built = [];

    for (var f = 0; f < figures.length; f++) {
        var owner = figures[f].owner;
        var entry = figures[f].character ? figures[f].character.entry : null;
        var tags = bodypartTagsFor(owner, entry, records);
        var has = function (text) { return tags.indexOf(text) !== -1; };
        var hasAny = function (list) {
            for (var i = 0; i < list.length; i++) { if (has(list[i])) { return true; } }
            return false;
        };

        var female = hasAny(v2FemaleTags);
        var male = hasAny(v2MaleTags);

        // Built even when her entry already has one, because the pussy rule for a
        // male character is "a copy of their penis and balls shortcut" and the
        // copy has to be of whatever actually applies to her.
        var shortcuts = {};

        // penis — Default: Large Glans. Colour from body, then skin, then
        // countershading. A female with a penis is a futanari, and the tag says so.
        shortcuts.penis = composeBodypartShortcut(
            "Large", bodypartColorFor(tags, ["body", "skin", "countershading"]), "Glans");
        if (female) { shortcuts.penis = "futanari, " + shortcuts.penis; }

        // balls — Default: Large Saggy. Countershading FIRST here; the spec calls
        // that out rather than leaving it to be inferred.
        shortcuts.balls = composeBodypartShortcut(
            "Large", bodypartColorFor(tags, ["countershading", "body", "skin"]), "Saggy");
        if (female) { shortcuts.balls = "futanari, " + shortcuts.balls; }

        // pussy — Default: Pussy, and three rules that rewrite the NAME before the
        // colour goes on. `cute` replaces it outright, `milf` resizes it, and a
        // male has neither: he gets his own penis and balls instead. The colour is
        // applied last so it survives whichever name won — `Peach` for a
        // dark-skinned loli should still be a dark one, and `Big Peach` composes.
        var pussyName = "Peach";
        var pussySize = "";
        if (!hasAny(["cute", "loli", "cute girl"])) { pussyName = "Pussy"; }
        if (hasAny(["milf", "mature female"])) { pussySize = "Big"; }
        shortcuts.pussy = composeBodypartShortcut(
            pussySize, bodypartColorFor(tags, ["body"]), pussyName);
        if (male) {
            var ownPenis = ruleFor(existing, "penis", owner);
            var ownBalls = ruleFor(existing, "balls", owner);
            shortcuts.pussy = (ownPenis ? ownPenis.replacement : shortcuts.penis) + ", " +
                              (ownBalls ? ownBalls.replacement : shortcuts.balls);
        }

        // nipples — no compound shortcut exists for these, so they are plain tags.
        shortcuts.nipples = "nipples";
        if (has("large breasts")) { shortcuts.nipples = "big nipples"; }
        if (hasAny(["huge breasts", "gigantic breasts", "hyper breasts"])) {
            shortcuts.nipples = "huge nipples";
        }

        // anus — a dark genital counts AS the colour, so it is checked first and
        // stops the suffix search. This is the rule that has to see contextual
        // defaults, and the reason this whole step sits where it does (§D·14).
        shortcuts.anus = "big anus, puffy anus";
        var anusColor = hasAny(["dark pussy", "dark penis", "dark balls"])
            ? "dark"
            : bodypartColorFor(tags, ["countershading", "body", "skin"]);
        if (anusColor) { shortcuts.anus += ", " + anusColor + " anus"; }

        for (var p = 0; p < v2BodypartOrder.length; p++) {
            var part = v2BodypartOrder[p];
            // Hers wins. An entry that mentions the part already carries a rule
            // for it, hand-written or harvested, and it says something this
            // cannot know.
            if (ruleFor(existing, part, owner)) { continue; }
            built.push({ target: part, replacement: shortcuts[part], owner: owner });
        }
    }
    return built;
}

function applyBodypartDefaults(records, job) {
    return applyReplacementRules(buildBodypartDefaults(records, job), records, job);
}

// ---------------------------------------------------------------------------
//  Contextual defaults
// ---------------------------------------------------------------------------
//  defaultDB, evaluated PER SUBJECT rather than once for the image. That is what
//  CORPUS Phase 4 Probe C asks for: `{<3}, {Happy}` gives one figure a heart and
//  the other a smile, because each scope is judged against its own tags plus the
//  global ones.
//
//  Everything arrives through the gate, so a default never displaces something
//  written by hand (Rule 27).

function defaultRequirementMet(term, records, job) {
    if (Array.isArray(term)) {
        for (var i = 0; i < term.length; i++) {
            if (defaultRequirementMet(term[i], records, job)) { return true; }   // OR
        }
        return term.length === 0;
    }
    if (!term) { return true; }
    // exact:true — defaultDB is v1's data and v1 compares text. See isPresent.
    return isPresent(term, records, job, true);
}

function applyContextualDefaults(records, job) {
    if (typeof cleanedDefaultArray === "undefined" || !cleanedDefaultArray.length) { return records; }

    // One pass per subject, plus one for the image itself. A subject's view is
    // her own records and the unowned ones; the image's view is everything.
    //
    // Every view is a FROZEN SNAPSHOT, and that is the whole correctness of this
    // pass (Rule 15 — no phase loops to a fixpoint). Reading the growing set
    // instead lets one addition satisfy the next default's requirement, and the
    // cascade is spectacular: `Happy` reached `Blush`, which reached `sweat`,
    // `steaming body`, `horny` and `pent-up`, none of which anyone asked for.
    // The IMAGE's view is the unowned records only — not everything. A `<3`
    // written inside a scope is that figure's, and letting the image-level pass
    // read it would put the heart in the common block where it says the wrong
    // thing. The image runs first so that a genuinely global default is not then
    // added a second time under an owner.
    var live = livingRecords(records);
    var views = [{ owner: null, records: viewFor(live, "\u0000none") }];
    for (var s = 0; s < job.subjects.length; s++) {
        var id = job.subjects[s].id;
        views.push({ owner: id, records: viewFor(live, id) });
    }

    for (var v = 0; v < views.length; v++) {
        var view = views[v];
        for (var d = 0; d < cleanedDefaultArray.length; d++) {
            var entry = cleanedDefaultArray[d];
            var requirements = entry.requirements || [];
            var additions = entry.additions || [];
            var exceptions = entry.exceptions || [];
            if (!additions.length) { continue; }

            var met = true;
            for (var q = 0; q < requirements.length; q++) {
                if (!defaultRequirementMet(requirements[q], view.records, job)) { met = false; break; }
            }
            if (!met) { continue; }
            for (var e = 0; e < exceptions.length; e++) {
                if (defaultRequirementMet(exceptions[e], view.records, job)) { met = false; break; }
            }
            if (!met) { continue; }
            // AN IMAGE-LEVEL DEFAULT REACHES EVERY FIGURE, so any figure's own
            // exception vetoes it here (2026-09-14, Honeycomb art pipeline). A typed
            // `male focus` is unowned and a character's `tall` is hers, so the image
            // view alone saw no exception and handed `cute boy` to a tall femboy. When
            // vetoed, the per-subject passes below still add it to each figure whose
            // own view allows it, which is Rule 28 read per figure.
            if (view.owner === null && exceptions.length && views.length > 1) {
                for (var sv = 1; sv < views.length && met; sv++) {
                    for (var se = 0; se < exceptions.length; se++) {
                        if (defaultRequirementMet(exceptions[se], views[sv].records, job)) { met = false; break; }
                    }
                }
                if (!met) { continue; }
            }

            for (var a = 0; a < additions.length; a++) {
                var text = String(additions[a]).trim();
                if (!text) { continue; }
                addRecord(text, {
                    owner: view.owner,
                    source: "defaultDB",
                    position: lastPosition(records)
                }, records, job);
            }
        }
    }
    return records;
}

// What one subject can see: her own tags and the image-level ones. Not the other
// figure's — that is the whole point of judging defaults per subject.
function viewFor(records, owner) {
    return records.filter(function (r) {
        return r.owner == null || r.owner === owner;
    });
}

// A count tag supersedes the singular, but only within its own gender: `2girls`
// retires a loose `1girl`, and `duo` retires nothing, because `1boy, 1girl, duo`
// is a perfectly ordinary hetero pair. These are v1's own exception lists.
//
// An OWNED `1girl` is never touched. It says "this figure is one girl", which
// stays true however many figures there are, and CORPUS puts one in every
// subject's group.
var v2SupersededBy = {
    "1girl": ["2girls", "3girls", "4girls", "5girls", "6girls", "6+girls", "multiple girls"],
    "1boy":  ["2boys", "3boys", "4boys", "5boys", "6boys", "6+boys", "multiple boys"]
};

function supersedeSoloCounts(records, job) {
    var live = livingRecords(records);
    for (var i = 0; i < live.length; i++) {
        var record = live[i];
        if (record.owner != null) { continue; }
        var beaters = v2SupersededBy[record.text.toLowerCase()];
        if (!beaters) { continue; }
        for (var b = 0; b < beaters.length; b++) {
            if (!hasLiveText(records, beaters[b])) { continue; }
            record.culledBy = "superseded by " + beaters[b];
            record.strength = "hard";
            job.trace.culled.push({ text: record.text, rule: record.culledBy, strength: "hard" });
            break;
        }
    }
    return records;
}

// ---------------------------------------------------------------------------
//  Count tags
// ---------------------------------------------------------------------------
//  Phase 2 works out whether the shot is solo; this is where that verdict
//  reaches the prompt. It is the one place the engine removes something that
//  was typed, and it is deliberate: `solo` gets added on instinct and is very
//  often simply wrong, so 2+ subjects or a count tag beats it. Nothing else is
//  ever overruled — see Rule 27.
//
//  What is NOT emitted here is the per-figure `1girl`. That arrives with the
//  character in Phase 3, owned by her, which is why it renders inside her group
//  and this one renders in the common block.

var v2GroupCountWords = ["duo", "trio", "group", "large group", "orgy", "group sex",
                         "duo focus", "trio focus", "threesome", "fff threesome",
                         "ffm threesome", "mmf threesome", "mmm threesome"];
var v2GirlCounts = [null, "1girl", "2girls", "3girls", "4girls", "5girls", "6girls"];
var v2BoyCounts  = [null, "1boy",  "2boys",  "3boys",  "4boys",  "5boys",  "6boys"];

// ---------------------------------------------------------------------------
//  Focus
// ---------------------------------------------------------------------------
//  Three separate questions wearing one word:
//
//    female/male focus   which gender the picture is ABOUT. Mutually exclusive.
//    animal focus        a feral is the subject. Exclusive with NEITHER of the
//                        above — a feral shot can still be female focus.
//    <count> focus       the count tag, modified. Something is in the picture
//                        that is not one of the counted figures.
//
//  The third is what the other two hang off: a `focus` modifier says "there are
//  extra bodies here and they are not the point", which is exactly the case
//  where naming the point is worth doing.
//
//  STARTER LIST, in the sense §2 of TODO.md uses the word. These are Noodle's
//  own examples and the mechanism is general; `scenePartner` is NOT usable here
//  because it has 1869 members and half of them are held objects.
var v2FocusModifiers = [
    "mostly offscreen male", "mostly offscreen female", "mostly offscreen futa",
    "mostly offscreen horse", "disembodied hand", "disembodied penis",
    "pov hands", "pov hand", "crowd", "audience", "multiple penises"
];

// A modifier that names a gender says which one is NOT the focus, which is how
// `male tag, female tag, solo focus, mostly offscreen male` resolves to female
// focus rather than to an argument.
var v2FocusModifierGender = {
    "mostly offscreen male":   "male",
    "mostly offscreen female": "female",
    "mostly offscreen futa":   "female",
    "disembodied penis":       "male",
    "multiple penises":        "male"
};

var v2FemaleTags = ["1girl", "2girls", "3girls", "4girls", "5girls", "6girls",
                    "female", "furry female", "robot girl", "multiple girls",
                    "futanari", "cute girl"];
var v2MaleTags   = ["1boy", "2boys", "3boys", "4boys", "5boys", "6boys",
                    "male", "furry male", "femboy", "cute boy", "multiple boys"];
var v2CountWordsForFocus = ["solo", "duo", "trio", "group"];

// ---------------------------------------------------------------------------
//  Animal focus — the exclusions
// ---------------------------------------------------------------------------
//  ADD TAGS HERE. A tag in this list means the shot is NOT an animal focus even
//  though a feral is in it — the feral is present but is not what the picture is
//  about.
//
//  Empty on purpose, and a real hook rather than a cleanup pass: `animal focus`
//  may grow behaviour of its own (it is one of the tags most often forgotten at
//  tagging time, so the corpus will need revisiting for it), and a rule that
//  runs at the end of everything is the wrong shape for that. This runs where
//  the tag is decided, so anything added here is accounted for before the tag
//  exists rather than after.
//
//  A blocker is checked against the whole live prompt, exactly like
//  `v2FocusModifiers` above. If a blocker ever needs a condition — "only when
//  solo", say — that is the point at which this wants to become a small table
//  in cullDB rather than a list here.
//
//  Candidates worth considering when the time comes, NOT assumed:
//    a feral that is being ridden, held, or otherwise a prop rather than the
//    subject; a human subject with a feral companion; anything where a count
//    tag already names a human figure as the focus.
var v2AnimalFocusBlockers = [
    // e.g. "riding", "pet play", "1girl"  <- decide deliberately, do not guess
];

function hasLiveText(records, text) {
    var wanted = String(text).toLowerCase();
    return livingRecords(records).some(function (r) { return r.text.toLowerCase() === wanted; });
}

// The gender of a subject is whatever her own tags say — charactersDB writes
// `female` / `male` and the alias collapse has already made those `1girl` and
// `1boy`. A subject whose entry says neither is simply not counted.
function subjectGenders(records, job) {
    var tally = { girls: 0, boys: 0, unknown: 0 };
    var live = livingRecords(records);
    for (var s = 0; s < job.subjects.length; s++) {
        var id = job.subjects[s].id;
        var girl = false, boy = false;
        for (var i = 0; i < live.length; i++) {
            if (live[i].owner !== id) { continue; }
            var text = live[i].text.toLowerCase();
            if (text === "1girl" || text === "furry female") { girl = true; }
            if (text === "1boy"  || text === "furry male")   { boy = true; }
        }
        if (girl && !boy) { tally.girls++; }
        else if (boy && !girl) { tally.boys++; }
        else { tally.unknown++; }
    }
    return tally;
}

// ---------------------------------------------------------------------------
//  Manual override — BAND-AID, 2026-08-09
// ---------------------------------------------------------------------------
//  The count words the engine derives are the ones it will also stand down over
//  when they were TYPED. `countGenders` is deliberately absent: a hand-written
//  `1girl` is a guess about the cast, whereas a hand-written `solo focus` is a
//  statement about the shot, and only the second is worth treating as law.
//
//  This exists because the derived count cannot yet express what the training
//  data does. `duo, solo focus` — two figures, one of them mostly offscreen — is
//  a real and common shape, and the engine currently collapses it to `duo focus`
//  with no way to argue. Until the new count system lands (TODO §0) the way to
//  get that shape is to type it, so typing it has to win.
//
//  NOT a model of anything. When §0 is built this should be reconsidered whole,
//  not extended: adding words here is how a band-aid becomes the design.
var v2ManualCountWords = ["solo", "duo", "trio", "group",
                          "solo focus", "duo focus", "trio focus"];

// Image-level only. A count word inside a subject's scope is describing her, not
// the shot, and the engine's own count is still the authority over the shot.
function manualCountTags(records) {
    var live = livingRecords(records);
    var found = [];
    for (var i = 0; i < live.length; i++) {
        if (live[i].source !== "input") { continue; }
        if (live[i].owner != null) { continue; }
        if (v2ManualCountWords.indexOf(live[i].text.toLowerCase()) === -1) { continue; }
        found.push(live[i]);
    }
    return found;
}

function emitCountTags(records, job) {
    var live = livingRecords(records);

    // Typed count words are law. Marked immune HERE because this step runs
    // before supersedeSoloCounts and emitFocusTags, so one flag covers all three
    // — and immunity is what the Phase 5/6 culls already read.
    var manual = manualCountTags(records);
    for (var m = 0; m < manual.length; m++) { manual[m].immune = true; }
    if (manual.length) {
        job.trace.declined.push({
            text: "count word",
            rule: "manual count is law: " + manual.map(function (r) { return r.text; }).join(", "),
            blockedBy: null
        });
    }

    // Nothing to correct when the verdict agrees with the prompt. Writing `solo`
    // into a solo shot that did not say so is a CONTEXTUAL DEFAULT, not a count
    // correction — it belongs with defaultDB in the rest of this phase, and
    // doing it here would put `solo` on landscapes.
    if (job.solo) { return records; }

    // A contradicted `solo` loses, and determineSolo has already traced why —
    // unless it was typed, in which case the person typing it outranks the
    // inference. The reason this cull existed has expired anyway: the insertion
    // gate stopped reading job.solo on 2026-08-06.
    if (!manual.length) {
        for (var i = 0; i < records.length; i++) {
            if (records[i].culledBy != null) { continue; }
            if (records[i].text.toLowerCase() !== "solo") { continue; }
            records[i].culledBy = "contradicted: " + (job.soloReason || "not solo");
            records[i].strength = "hard";
            job.trace.culled.push({ text: "solo", rule: records[i].culledBy, strength: "hard" });
        }
    }

    var figures = Math.max(job.subjects.length, 2);
    var at = lastPosition(records);

    // Gendered count first, group word second — they tie on category and
    // position, so insertion order is what decides, and "2girls, duo" is the
    // order these get typed in.
    //
    // The gendered count needs subjects to count. A partner tag alone says
    // "more than one figure" without saying who, and guessing `2girls` there
    // would be the engine inventing a figure.
    if (job.subjects.length >= 2) {
        var tally = subjectGenders(records, job);
        var wanted = null;
        if (tally.girls === job.subjects.length) { wanted = v2GirlCounts[Math.min(tally.girls, 6)]; }
        else if (tally.boys === job.subjects.length) { wanted = v2BoyCounts[Math.min(tally.boys, 6)]; }
        if (wanted && !hasLiveText(records, wanted)) {
            addRecord(wanted, { source: "engine:count", position: at }, records, job);
        }
    }

    // All or nothing: type one count word and the engine adds none. Half-helping
    // is what makes an override unpredictable — `solo focus` would silently grow
    // a `duo` and there would be no way to ask for it alone. Both shapes are
    // available by typing both words.
    if (!manual.length) {
        var hasGroupWord = v2GroupCountWords.some(function (w) { return hasLiveText(records, w); });
        if (!hasGroupWord) {
            var word = figures === 2 ? "duo" : (figures === 3 ? "trio" : "group");
            addRecord(word, { source: "engine:count", position: at }, records, job);
        }
    }
    return records;
}

// Decided in the engine rather than in defaultDB, because it needs the settled
// count and the settled genders and a contextual default can see neither. The
// dictionary rules that used to attempt this are superseded — `isSupersededRule`
// lists them — and they are left in place for v1, which still needs them.
function emitFocusTags(records, job) {
    var live = livingRecords(records);
    // Text -> EVERY live record carrying it, never just the last one seen.
    //
    // Rule 13's 2026-08-09 revision means a tag that every subject carries now
    // exists once PER OWNER rather than once. This map was written before that
    // and held a single record, so both culls below reached one copy and left
    // the rest alive: `((detailed)), .frieren, .fern, blonde hair` culled Fern's
    // `female focus` and rendered Frieren's, while CORPUS Phase 9 says a
    // two-figure shot carries no gender focus at all.
    //
    // Presence checks only ever test truthiness, and an entry is created only
    // when a record exists, so a populated array is never empty and every
    // `if (textsPresent[x])` still reads the same.
    var textsPresent = {};
    for (var i = 0; i < live.length; i++) {
        var key = live[i].text.toLowerCase();
        if (!textsPresent[key]) { textsPresent[key] = []; }
        textsPresent[key].push(live[i]);
    }

    var has = function (list) {
        for (var i = 0; i < list.length; i++) {
            if (textsPresent[list[i]]) { return list[i]; }
        }
        return null;
    };

    var modifier = has(v2FocusModifiers);
    var at = lastPosition(records);

    // ---- <count> focus -----------------------------------------------------
    // The modifier says the counted figures are not the whole picture, so the
    // count becomes a statement about the focus instead of about the population.
    if (modifier) {
        // The count counts what the picture is ABOUT, and determineSolo already
        // worked out how many figures that is. A stray `duo` left behind by a
        // cleaning rule does not get a vote — that is exactly how `solo` and
        // `duo focus` ended up in the same prompt.
        var base = null;
        if (job.solo) { base = "solo"; }
        else {
            for (var c = 0; c < v2CountWordsForFocus.length; c++) {
                if (textsPresent[v2CountWordsForFocus[c]] ||
                    textsPresent[v2CountWordsForFocus[c] + " focus"]) {
                    base = v2CountWordsForFocus[c];
                    break;
                }
            }
        }

        // A typed focus word IS the answer — do not derive one over the top of
        // it. `duo, solo focus` is two figures with one of them mostly offscreen,
        // which is what the training data uses and what deriving `duo focus`
        // from the count destroys.
        var manualFocus = null;
        var manualHere = manualCountTags(records);
        for (var q = 0; q < manualHere.length; q++) {
            if (/ focus$/.test(manualHere[q].text.toLowerCase())) { manualFocus = manualHere[q]; break; }
        }

        // Typed `duo` with no typed focus word means duo, full stop. Deriving
        // `duo focus` on top of it would be the engine having the last word
        // again, which is the thing the override exists to stop.
        var suppressed = manualHere.length > 0 && !manualFocus;

        if (!suppressed && (base || manualFocus)) {
            var keep = manualFocus ? manualFocus.text.toLowerCase() : base + " focus";
            // One count word survives, and it is the focus form. Everything else
            // in the family goes, plain or focus — except anything typed, which
            // is immune and is the whole point of the override.
            for (var k = 0; k < v2CountWordsForFocus.length; k++) {
                var family = [v2CountWordsForFocus[k], v2CountWordsForFocus[k] + " focus"];
                for (var f = 0; f < family.length; f++) {
                    if (family[f] === keep) { continue; }
                    var doomed = textsPresent[family[f]];
                    if (!doomed) { continue; }
                    for (var d = 0; d < doomed.length; d++) {
                        if (doomed[d].immune) { continue; }
                        doomed[d].culledBy = "superseded by " + keep;
                        doomed[d].strength = "hard";
                        job.trace.culled.push({ text: family[f], rule: doomed[d].culledBy, strength: "hard" });
                    }
                }
            }
            if (!textsPresent[keep]) {
                addRecord(keep, { source: "engine:focus", position: at }, records, job);
                job.trace.added.push({
                    text: keep, rule: (base || "manual") + " modified by " + modifier, owner: null
                });
            }
            textsPresent[keep] = textsPresent[keep] || true;
        }
    }

    // ---- female / male focus ----------------------------------------------
    // A gender focus answers "which of the people here is the picture about",
    // so it only means anything when there is ONE figure being focused: solo,
    // or solo focus. `2girls, duo focus` is about both of them, and saying
    // `female focus` on top of that adds nothing.
    //
    // Re-derived even when something else already added one. defaultDB's focus
    // rules have been REMOVED rather than overruled — they are in
    // !designDocs/webui_engine/ARCHIVED-RULES.md, so v1 can have them back and the eventual
    // cleanup is one job instead of two. What remains is a handful of cleaning
    // rules that emit a focus tag inside a longer replacement chain, and those
    // fire on a specific named tag rather than at everything. This re-derivation
    // is therefore a SAFETY NET, not the mechanism. If it ever becomes the
    // mechanism again, move those rules to the archive too.
    var onlyOne = job.solo || !!textsPresent["solo focus"] ||
                  (modifier && textsPresent["solo"]);
    var female = has(v2FemaleTags);
    var male = has(v2MaleTags);
    var wanted = null;
    if (onlyOne) {
        if (female && !male)      { wanted = "female focus"; }
        else if (male && !female) { wanted = "male focus"; }
        else if (female && male && modifier && v2FocusModifierGender[modifier]) {
            // A modifier naming a gender names the one that is NOT the focus.
            wanted = v2FocusModifierGender[modifier] === "male" ? "female focus" : "male focus";
        }
        // Both genders and nothing saying which is the point: Rule 8 — ambiguity
        // between two figures is never arbitrated. Say nothing.
    }

    var genderFocus = ["female focus", "male focus"];
    for (var g = 0; g < genderFocus.length; g++) {
        var tag = genderFocus[g];
        if (tag === wanted || !textsPresent[tag]) { continue; }
        // ONLY cull a gender focus that is CONTRADICTED — never one the engine
        // merely would not have added itself.
        //
        // Two of Noodle's own desired outputs disagree about a multi-figure shot,
        // and this is what satisfies both. CORPUS Phase 9 has
        // `((detailed)), .frieren, .fern, blonde hair` come out with no gender
        // focus at all, so the engine must not ADD one for two figures. The
        // replace case in TODO has `female focus, 2girls, duo, …` typed by hand
        // and keeps it, so the engine must not TAKE one away either.
        //
        // Adding and removing were the same decision here, which is why it looked
        // like a contradiction. They are separate questions, and `source` is what
        // separates them: this step is a SAFETY NET against cleaning rules that
        // emit a focus tag inside a longer replacement chain, and those are
        // `engine:` records. A tag the user TYPED is not a mistake to clean up —
        // it is only wrong if the opposite gender is positively the answer.
        // Rule 27's spirit: the engine declines, it does not overwrite.
        // Per RECORD, not per text — a typed copy is immune while an
        // engine-added one beside it is not, so the decision cannot be made once
        // for the whole group.
        var losers = textsPresent[tag];
        for (var l = 0; l < losers.length; l++) {
            var loser = losers[l];
            if (!wanted && loser.source === "input") { continue; }
            loser.culledBy = wanted ? "contradicted by " + wanted : "focus is not a single figure";
            loser.strength = "hard";
            job.trace.conflicts.push({ text: tag, rule: loser.culledBy });
        }
    }
    if (wanted && !textsPresent[wanted]) {
        addRecord(wanted, { source: "engine:focus", position: at }, records, job);
    }

    // ---- animal focus ------------------------------------------------------
    // Exclusive with neither of the above: a feral shot can still be about a
    // female feral, and both tags are true at once.
    //
    // A blocker means the feral is present but is not the subject. The list is
    // empty today — see v2AnimalFocusBlockers, which is where to add them.
    var blocker = has(v2AnimalFocusBlockers);
    if (textsPresent["feral"] && !blocker && !textsPresent["animal focus"]) {
        addRecord("animal focus", { source: "engine:focus", position: at }, records, job);
    }
    // An `animal focus` somebody else put there is removed by a blocker too,
    // for the same reason the gender focus above is re-derived: this step is
    // where the question is answered.
    if (blocker && textsPresent["animal focus"]) {
        var strayAnimal = textsPresent["animal focus"];
        strayAnimal.culledBy = "animal focus blocked by " + blocker;
        strayAnimal.strength = "hard";
        job.trace.conflicts.push({ text: "animal focus", rule: strayAnimal.culledBy });
    }

    return records;
}

// Engine additions with no trigger to sit behind land after everything typed,
// so they never disturb `replace`'s before-and-after (Rule 18).
function lastPosition(records) {
    var high = 0;
    for (var i = 0; i < records.length; i++) {
        if (records[i].position > high) { high = records[i].position; }
    }
    return high + 1;
}
// ============================================================================
//  PHASE 5 — CULLING
// ============================================================================
//  The taxonomy: every category's domain, part and layer, DERIVED FROM ITS NAME
//  rather than stored in a parallel file. `categoryDB.txt` in !designDocs/_archive is the
//  readable rendering of this and is generated from it — the table below is the
//  source, so a category added to a keyword DB is placed automatically instead
//  of being silently absent from the model.
//
//  The ladder is ordered head to toe, and that order is the whole mechanism: a
//  framing cull is a RANGE over it. (TAXONOMY.md §4, now in _archive — this
//  table and cullDB.js are the live description.)

var v2PartLadder = ["head", "eyes", "face", "mouth", "neck", "shoulders", "arms",
                    "hands", "chest", "back", "torso", "belly", "waist", "groin",
                    "rear", "thighs", "calves", "feet"];

// Category-name suffix -> part. Longest suffix wins, so `UpperwearOuter` is
// matched before `Upperwear` would be.
var v2SuffixParts = [
    ["Hair", "head"], ["Head", "head"], ["Headwear", "head"],
    ["Eyes", "eyes"], ["Orbital", "eyes"], ["Eyewear", "eyes"], ["Foreheadwear", "eyes"],
    ["Face", "face"], ["Facewear", "face"], ["Earwear", "face"],
    ["Muzzle", "mouth"], ["Teeth", "mouth"], ["Mouthwear", "mouth"],
    ["Neckwear", "neck"],
    ["Shoulderwear", "shoulders"],
    ["Arms", "arms"], ["Armwear", "arms"], ["Wristwear", "arms"],
    ["Hands", "hands"], ["Fingernails", "hands"], ["Handwear", "hands"],
    ["Chest", "chest"], ["Breasts", "chest"], ["Areolae", "chest"], ["Nipples", "chest"],
    ["Nipplewear", "chest"], ["Upperwear", "chest"], ["UpperwearOuter", "chest"],
    ["UpperwearMiddle", "chest"], ["UpperwearInner", "chest"], ["UpperwearUnder", "chest"],
    ["Back", "back"], ["Wings", "back"],
    ["Torso", "torso"],
    ["Belly", "belly"],
    ["Waist", "waist"], ["Waistwear", "waist"],
    ["Penis", "groin"], ["Balls", "groin"], ["Pussy", "groin"], ["Clit", "groin"],
    ["Lowerwear", "groin"], ["LowerwearOuter", "groin"], ["LowerwearMiddle", "groin"],
    ["LowerwearInner", "groin"], ["LowerwearUnder", "groin"],
    ["Butt", "rear"], ["Anus", "rear"], ["Tail", "rear"],
    ["Legs", "thighs"], ["LegwearUpper", "thighs"],
    ["LegwearLower", "calves"],
    ["Feet", "feet"], ["Toenails", "feet"], ["Footwear", "feet"],
    ["Fullwear", "fullwear"],
    // Never cropped away by any framing command. A succubus is still a demon
    // when only her fingernails are visible; the only thing that removes these
    // is removing the character. Noodle, 2026-08-05.
    ["Race", "whole"], ["Brand", "whole"],
    ["Camera", "camera"], ["Count", "count"], ["CountSolo", "count"], ["CountGroup", "count"],
    ["Cum", "cum"], ["Fx", "fx"], ["Internal", "internal"], ["Partner", "partner"],
    ["Toys", "toys"], ["Unsorted", "unsorted"],
    ["Simple", "simple"], ["Indoors", "indoors"], ["Outdoors", "outdoors"],
    ["Other", "other"], ["Objects", "objects"],
    // Artist tags are not scenery and no cull reaches them, not even
    // `remove background` — v1 leaves them out of that list too.
    ["Artists", "artists"]
];

var v2CategoryAttributes = null;

function buildCategoryAttributes() {
    if (v2CategoryAttributes) { return v2CategoryAttributes; }
    v2CategoryAttributes = {};
    if (typeof finalKeywordSet === "undefined" || !finalKeywordSet) { return v2CategoryAttributes; }
    for (var name in finalKeywordSet) {
        if (!Object.prototype.hasOwnProperty.call(finalKeywordSet, name)) { continue; }
        v2CategoryAttributes[name] = deriveCategoryAttributes(name);
    }
    return v2CategoryAttributes;
}

function deriveCategoryAttributes(name) {
    var domain = null, suffix = name;
    if (name.indexOf("body") === 0)            { domain = "body";       suffix = name.slice(4); }
    else if (name.indexOf("clothes") === 0)    { domain = "clothes";    suffix = name.slice(7); }
    else if (name.indexOf("scene") === 0)      { domain = "scene";      suffix = name.slice(5); }
    else if (name.indexOf("background") === 0) { domain = "background"; suffix = name.slice(10); }
    else if (name === "weapons")               { return { domain: "prop", part: "weapons", layer: "" }; }

    var part = null, best = -1;
    for (var i = 0; i < v2SuffixParts.length; i++) {
        var candidate = v2SuffixParts[i][0];
        if (suffix !== candidate) { continue; }
        if (candidate.length > best) { best = candidate.length; part = v2SuffixParts[i][1]; }
    }
    if (part == null) { part = "unsorted"; }

    var layer = "";
    if (/Outer$/.test(suffix))       { layer = "outer"; }
    else if (/Middle$/.test(suffix)) { layer = "middle"; }
    else if (/Inner$/.test(suffix))  { layer = "inner"; }
    else if (/Under$/.test(suffix))  { layer = "under"; }

    return { domain: domain, part: part, layer: layer };
}

// ---------------------------------------------------------------------------
//  Resolving a command to a set of categories
// ---------------------------------------------------------------------------
//  Default domains are body + clothes. Scene comes along automatically, exactly
//  as v1 does at the bottom of cullBulkKeywords: a cull that means "you cannot
//  see this" reaches the action too.

function ladderIndex(part) { return v2PartLadder.indexOf(part); }

function partsForEntry(entry) {
    var wanted = {};
    var i;
    if (entry.below) {
        var from = ladderIndex(entry.below);
        for (i = from; i >= 0 && from !== -1 && i < v2PartLadder.length; i++) { wanted[v2PartLadder[i]] = true; }
    }
    if (entry.above) {
        var to = ladderIndex(entry.above);
        for (i = 0; i <= to; i++) { wanted[v2PartLadder[i]] = true; }
    }
    if (entry.only) {
        var keep = {};
        for (i = 0; i < entry.only.length; i++) { keep[entry.only[i]] = true; }
        for (i = 0; i < v2PartLadder.length; i++) {
            if (!keep[v2PartLadder[i]]) { wanted[v2PartLadder[i]] = true; }
        }
    }
    for (i = 0; i < entry.parts.length; i++) { wanted[entry.parts[i]] = true; }
    return wanted;
}

var v2CullResolved = null;

function resolveCullCommand(command) {
    if (!v2CullResolved) { v2CullResolved = {}; }
    if (v2CullResolved[command]) { return v2CullResolved[command]; }

    var entry = null;
    if (typeof cleanedCullArray !== "undefined") {
        for (var e = 0; e < cleanedCullArray.length; e++) {
            if (cleanedCullArray[e].command === command) { entry = cleanedCullArray[e]; break; }
        }
    }
    if (!entry) { return null; }

    var attributes = buildCategoryAttributes();
    var domains = entry.domains ? entry.domains.slice() : ["body", "clothes"];
    for (var d = 0; d < entry.addDomains.length; d++) { domains.push(entry.addDomains[d]); }

    // `scene` is NEVER selected directly. It arrives only as the twin of a
    // category already chosen, at the bottom of this function — which is v1's
    // rule, and the difference matters: `barefoot` is `domain: clothes`, and
    // selecting the scene domain by part would drag in `sceneFeet`, the twin of
    // a BODY category the command never touched.

    var parts = partsForEntry(entry);
    var chosen = {};

    for (var name in attributes) {
        if (!Object.prototype.hasOwnProperty.call(attributes, name)) { continue; }
        var a = attributes[name];
        if (a.domain === "scene") { continue; }
        // `domain: + x` takes the WHOLE of that domain. It exists for prop,
        // whose one category sits off the ladder at part `weapons` and so can
        // never be reached by a range — a head shot has to lose the sword.
        if (entry.addDomains.indexOf(a.domain) !== -1) { chosen[name] = true; continue; }
        if (domains.indexOf(a.domain) === -1) { continue; }
        // Off-ladder parts — fullwear, whole, unsorted, the background set —
        // have no rung, so a range never reaches them and they must be named.
        // That is what keeps race and brand safe from every framing command.
        if (!parts[a.part]) { continue; }
        if (entry.layers && entry.layers.indexOf(a.layer) === -1) { continue; }
        chosen[name] = true;
    }
    // Named categories are the escape hatch and ignore domain and part entirely.
    for (var c = 0; c < entry.categories.length; c++) { chosen[entry.categories[c]] = true; }

    for (var x = 0; x < entry.exceptCategories.length; x++) { delete chosen[entry.exceptCategories[x]]; }
    for (var name2 in chosen) {
        if (!Object.prototype.hasOwnProperty.call(chosen, name2)) { continue; }
        var attr = attributes[name2];
        if (!attr) { continue; }
        if (entry.exceptParts.indexOf(attr.part) !== -1) { delete chosen[name2]; }
        if (attr.layer && entry.exceptLayers.indexOf(attr.layer) !== -1) { delete chosen[name2]; }
    }

    // The scene twin of every chosen body/clothes category, v1's own expansion.
    var expanded = Object.keys(chosen);
    for (var t = 0; t < expanded.length; t++) {
        var twin = expanded[t].replace(/^body/, "scene").replace(/^clothes/, "scene");
        if (twin !== expanded[t] && attributes[twin]) { chosen[twin] = true; }
    }
    for (var y = 0; y < entry.exceptCategories.length; y++) {
        var exceptTwin = entry.exceptCategories[y].replace(/^body/, "scene").replace(/^clothes/, "scene");
        delete chosen[exceptTwin];
    }

    v2CullResolved[command] = {
        command: command,
        group: entry.group,
        strength: entry.strength,
        categories: Object.keys(chosen)
    };
    return v2CullResolved[command];
}

// ---------------------------------------------------------------------------
//  The phase
// ---------------------------------------------------------------------------

function promptCull(records, job) {
    var blocked = collectCullBlockers(records, job);
    records = grantCullImmunity(records, job);
    records = applyCullContradictions(records, job);
    records = cullByCommand(records, job, blocked);
    records = cullByNegation(records, job);
    records = promptUncull(records, job);            // Phase 6
    // Final cleanup — the late ruleset, which runs here and not in Phase 4 on
    // purpose. `Happy` has to survive long enough for the contextual defaults to
    // read it and turn it into `closed mouth, smile`; this is what removes it
    // afterwards. CORPUS Phase 4 Probe A is the case.
    records = applyRules(records, typeof rulesArrayFinal !== "undefined" ? rulesArrayFinal : [], job);
    return records;
}

// Rule 22 — a blocker disarms a CLASS of cull for the whole job, so it needs to
// know nothing about categories. `multiple views` means nothing is really out of
// frame; `unworn clothing` means the garments are shown rather than worn.
// `<rung> cutaway` is parameterised and spares one rung from everything.
function collectCullBlockers(records, job) {
    var blocked = { groups: {}, parts: {} };
    var live = livingRecords(records);
    for (var i = 0; i < live.length; i++) {
        var text = live[i].text.toLowerCase();
        if (typeof cleanedCullBlockers !== "undefined" && cleanedCullBlockers[text]) {
            var groups = cleanedCullBlockers[text];
            for (var g = 0; g < groups.length; g++) { blocked.groups[groups[g]] = text; }
            live[i].immune = true;
            continue;
        }
        var cutaway = text.match(/^(.+)\s+cutaway$/);
        if (cutaway && ladderIndex(cutaway[1]) !== -1) {
            blocked.parts[cutaway[1]] = text;
            live[i].immune = true;
        }
    }
    job.cullBlockers = blocked;
    return blocked;
}

// Rule 17 — a tag that triggers a cull is immune to every cull. It is a real
// tag as well as a command, and `head shot` culling itself would be absurd.
// `keep <tag>` is the explicit form and is the only thing that reverses a hard
// cull (Rule 16).
function grantCullImmunity(records, job) {
    var live = livingRecords(records);
    var keep = [];
    for (var i = 0; i < live.length; i++) {
        var record = live[i];
        if (record.system && record.system.kind === "protection") {
            keep.push(record.text.replace(/^keep\s+/i, "").trim().toLowerCase());
            record.culledBy = "keep command consumed";
            record.strength = "hard";
            continue;
        }
        if (resolveCullCommand(record.text.toLowerCase())) { record.immune = true; }
        // Rule 16b — an emphasis you typed yourself is a keep instruction.
        // `(red hair), head out of frame` says the hair matters more than the
        // framing does, and the engine has no business arguing with that; before
        // this, the framing cull took it and the boost was silently wasted.
        //
        // It does NOT weaken `!`: cullByNegation deliberately ignores immunity,
        // so `(red hair), !red hair` still removes the hair. The explicit form
        // stays the last word, exactly as `keep` is for a hard cull.
        if (record.typedBoost) { record.immune = true; }
    }
    // `keep` reads at the same specificity `!` writes at, so `keep tail` covers
    // `blue tail` and `black tail tip` without naming either.
    for (var k = 0; k < live.length; k++) {
        for (var t = 0; t < keep.length; t++) {
            if (matchesAtSpecificity(live[k].text, keep[t])) { live[k].immune = true; break; }
        }
    }

    // Naming a category inside a scope is an implicit keep for that figure's
    // tags in it — `angelica {bodyTail}` says her tail is the point of the shot.
    // The marker is a command and is consumed here.
    for (var s = 0; s < live.length; s++) {
        var marker = live[s];
        if (!marker.system || marker.system.kind !== "scoped category") { continue; }
        for (var p = 0; p < live.length; p++) {
            var candidate = live[p];
            if (candidate === marker || candidate.owner !== marker.owner) { continue; }
            if ((candidate.categories || []).indexOf(marker.text) !== -1) { candidate.immune = true; }
        }
        marker.culledBy = "scoped category consumed";
        marker.strength = "hard";
    }

    job.keepList = keep;
    return records;
}

function cullByCommand(records, job, blocked) {
    var attributes = buildCategoryAttributes();
    var live = livingRecords(records);
    var triggers = [];
    for (var i = 0; i < live.length; i++) {
        var resolved = resolveCullCommand(live[i].text.toLowerCase());
        if (resolved) { triggers.push({ record: live[i], cull: resolved }); }
    }

    for (var t = 0; t < triggers.length; t++) {
        var trigger = triggers[t];
        if (blocked.groups[trigger.cull.group]) {
            job.trace.declined.push({
                text: trigger.record.text,
                rule: "disarmed by " + blocked.groups[trigger.cull.group]
            });
            continue;
        }
        var owner = trigger.record.owner;      // a scoped cull hits one figure
        var wanted = {};
        for (var c = 0; c < trigger.cull.categories.length; c++) {
            var name = trigger.cull.categories[c];
            var attr = attributes[name];
            if (attr && blocked.parts[attr.part]) { continue; }
            wanted[name] = true;
        }

        var victims = livingRecords(records);
        for (var v = 0; v < victims.length; v++) {
            var victim = victims[v];
            if (victim === trigger.record || victim.immune) { continue; }
            if (owner != null && victim.owner !== owner) { continue; }
            var cats = victim.categories || [];
            var hit = false;
            for (var y = 0; y < cats.length; y++) {
                if (wanted[cats[y]]) { hit = true; break; }
            }
            if (!hit) { continue; }
            victim.culledBy = trigger.record.text;
            victim.strength = trigger.cull.strength;
            job.trace.culled.push({
                text: victim.text,
                rule: trigger.record.text,
                strength: trigger.cull.strength
            });
        }
    }
    return records;
}

// A tag the rest of the prompt says cannot be true. Runs BEFORE the culls fire,
// so a contradicted trigger never gets to remove anything — and it is culled
// fuzzy, so Phase 6 can still restore it.
//
// Ownership matters here: one figure being topless says nothing about another's
// areola slip, so the evidence is read from the tag owner's own view.
function applyCullContradictions(records, job) {
    if (typeof cleanedCullContradictions === "undefined" || !cleanedCullContradictions.length) {
        return records;
    }
    var live = livingRecords(records);
    for (var i = 0; i < live.length; i++) {
        var record = live[i];
        var text = record.text.toLowerCase();
        for (var c = 0; c < cleanedCullContradictions.length; c++) {
            var rule = cleanedCullContradictions[c];
            if (rule.tag !== text) { continue; }
            var view = viewFor(live, record.owner);
            var contradicted = rule.contradictedBy.some(function (t) { return isPresent(t, view, job); });
            if (!contradicted) { continue; }
            var spared = rule.unless.some(function (t) { return isPresent(t, view, job); });
            if (spared) { continue; }
            record.culledBy = "contradicted by the rest of the prompt";
            record.strength = "fuzzy";
            job.trace.culled.push({ text: record.text, rule: record.culledBy, strength: "fuzzy" });
        }
    }
    return records;
}

// ============================================================================
//  PHASE 6 — UNCULLING
// ============================================================================
//  A condition says the thing is visible after all. **Only fuzzy culls can be
//  reversed** (Rule 16) — if the head is out of frame it is out of frame, and no
//  condition argues with that. That single restriction is why every cull carries
//  a strength, and it is what the CORPUS Phase 6 probe pair tests: `facing away`
//  is fuzzy and reversible, `head out of frame` is hard and is not.

function promptUncull(records, job) {
    if (typeof cleanedUncullArray === "undefined" || !cleanedUncullArray.length) { return records; }
    var live = livingRecords(records);

    for (var u = 0; u < cleanedUncullArray.length; u++) {
        var rule = cleanedUncullArray[u];
        if (!rule.requirements.length || !rule.restores.length) { continue; }

        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            if (record.culledBy == null) { continue; }
            if (record.strength !== "fuzzy") { continue; }   // hard culls are final
            if (!uncullTargets(rule.restores, record)) { continue; }

            // Read the evidence from the record's own view, so one figure's
            // see-through top does not restore another figure's nipples.
            var view = viewFor(live, record.owner);
            var met = true;
            for (var q = 0; q < rule.requirements.length; q++) {
                if (!isPresent(rule.requirements[q], view, job)) { met = false; break; }
            }
            if (!met) { continue; }

            job.trace.added.push({
                text: record.text,
                rule: "uncull: " + rule.requirements.join(" + "),
                owner: record.owner
            });
            record.culledBy = null;
            record.strength = null;
        }
    }
    return records;
}

// A restore target names either a category or a tag, told apart the same way
// cullDB tells them apart: a category is camelCase.
function uncullTargets(restores, record) {
    for (var r = 0; r < restores.length; r++) {
        var target = restores[r];
        if (/[A-Z]/.test(target)) {
            if ((record.categories || []).indexOf(target) !== -1) { return true; }
        } else if (matchesAtSpecificity(record.text, target)) {
            return true;
        }
    }
    return false;
}

// At the specificity written: `white hair` is exactly itself, and it is also a
// coloured variant of `hair`. `hair ornament` is neither — the space matters,
// which is why this is a tail match and not `indexOf`.
function matchesAtSpecificity(text, target) {
    text = String(text).toLowerCase();
    target = String(target).toLowerCase();
    if (text === target) { return true; }
    var tail = " " + target;
    return text.length > tail.length && text.slice(-tail.length) === tail;
}

// `!tag` removes at the specificity written. `!white hair` takes exactly that;
// `!hair` takes the coloured variants with it, because removing a vague tag is
// meant to remove the specific forms of it too.
function cullByNegation(records, job) {
    var live = livingRecords(records);
    for (var i = 0; i < live.length; i++) {
        var command = live[i];
        // A `!tag` typed into the prompt is marked a system keyword in Phase 1.
        // A `!tag` written into a charactersDB ENTRY replacement is injected in
        // Phase 4, long after markSystemKeywords ran, so it carries no `.system`
        // here. Rule 20's sigil is the text itself and the two must behave the
        // same, so the prefix is read from the text as well. Added 2026-09-14,
        // step 6: Nettle's breakdown DROP (`!black staff`) rides in her entry.
        var marked = command.system && command.system.kind === "negation";
        if (!marked && command.text.charAt(0) !== "!") { continue; }
        var target = command.text.replace(/^!\s*/, "").trim().toLowerCase();
        command.culledBy = "negation consumed";
        command.strength = "hard";
        if (!target) { continue; }

        var matched = false;
        var victims = livingRecords(records);
        for (var v = 0; v < victims.length; v++) {
            var victim = victims[v];
            if (victim === command) { continue; }
            if (!matchesAtSpecificity(victim.text, target)) { continue; }
            if (command.owner != null && victim.owner !== command.owner) { continue; }
            victim.culledBy = command.text;
            victim.strength = "hard";
            matched = true;
            job.trace.culled.push({ text: victim.text, rule: command.text, strength: "hard" });
        }
        if (!matched) { job.trace.unmatched.push({ text: command.text, rule: "nothing to remove" }); }
    }
    return records;
}
// ============================================================================
//  PHASE 7 — NEGATIVE
// ============================================================================
//  The negative is image-wide (Rule 11). Nothing here is per-figure, and that is
//  not a simplification — Forge has one negative field and no way to aim it.
//
//  Four steps, in this order: what the negative REMOVES from the prompt, the
//  dependency sweep, what the prompt ADDS to the negative, and the standing sets.

function promptNegative(records, job) {
    var typed = expandNegativeTerms(splitNegativeField(job.negative));
    records = cullByNegativeEntry(records, job, typed);
    records = sweepDependencies(records, job);
    job.negative = assembleNegative(records, job, typed);
    return records;
}

function splitNegativeField(text) {
    return String(text == null ? "" : text).split(",")
        .map(function (t) { return t.trim(); })
        .filter(function (t) { return t !== ""; });
}

// The negative field gets the same compound unpacking the prompt got in Phase 3,
// or the two stop lining up: `Large Foreskin` in the prompt becomes three tags
// and the same words in the negative would then match none of them. Writing a
// tag in both places has to cancel out, whatever spelling you used.
function expandNegativeTerms(terms) {
    var out = [];
    for (var i = 0; i < terms.length; i++) {
        var pieces = expandCompoundList(terms[i]);
        for (var p = 0; p < pieces.length; p++) {
            if (out.indexOf(pieces[p]) === -1) { out.push(pieces[p]); }
        }
    }
    return out;
}

// A term in the negative field removes it from the prompt too — writing
// `white hair` in the negative and leaving it in the prompt is asking the model
// for a contradiction. At the specificity written, same as `!` (Phase 5).
function cullByNegativeEntry(records, job, typed) {
    if (!typed.length) { return records; }
    for (var t = 0; t < typed.length; t++) {
        var term = typed[t].toLowerCase();
        var live = livingRecords(records);
        for (var i = 0; i < live.length; i++) {
            var record = live[i];
            if (record.immune) { continue; }
            if (!matchesAtSpecificity(record.text, term)) { continue; }
            record.culledBy = "negative: " + typed[t];
            record.strength = "hard";
            job.trace.culled.push({ text: record.text, rule: record.culledBy, strength: "hard" });
        }
    }
    return records;
}

// A tag whose parent is gone goes with it, from ANY cause — an explicit `!penis`,
// a framing cull that took the groin, a rule that purged it. v1 only ever did
// this for a parent named in the negative field.
//
// The parent is matched at specificity, so `huge penis` keeps the knot.
function sweepDependencies(records, job) {
    if (typeof cleanedDependencyArray === "undefined" || !cleanedDependencyArray.length) {
        return records;
    }
    var live = livingRecords(records);
    for (var d = 0; d < cleanedDependencyArray.length; d++) {
        var rule = cleanedDependencyArray[d];
        var parentPresent = live.some(function (r) {
            return matchesAtSpecificity(r.text, rule.parent);
        });
        if (parentPresent) { continue; }
        for (var i = 0; i < live.length; i++) {
            var record = live[i];
            if (record.culledBy != null || record.immune) { continue; }
            if (record.text.toLowerCase() !== rule.child) { continue; }
            record.culledBy = "no " + rule.parent;
            record.strength = "hard";
            job.trace.culled.push({ text: record.text, rule: record.culledBy, strength: "hard" });
        }
    }
    return records;
}

// Everything the negative is made of, in v1's order: what you typed, what the
// prompt implies, the standing set, the universal set. Then anything that also
// appears in the prompt is dropped — a tag cannot be asked for and refused at
// once, and that is what makes the standing set safe to be blunt.
function assembleNegative(records, job, typed) {
    var pieces = typed.slice();
    var live = livingRecords(records).filter(isRenderable);

    // Contextual — negativeDB, {requirements, additions, exceptions}. Same shape
    // as cleanedDefaultArray on purpose: one grammar, one thing to learn, and a
    // dictionary written elsewhere can be pasted in without touching code.
    //
    // Falls back to the old [requirements, additions] pair list if negativeDB is
    // not loaded, because webui2 is also read by tools that load a subset.
    var contextual = [];
    if (typeof cleanedNegativeArray !== "undefined" && cleanedNegativeArray.length) {
        contextual = cleanedNegativeArray;
    } else if (typeof basicNegativeArray !== "undefined") {
        contextual = basicNegativeArray.map(function (pair) {
            return {
                requirements: String(pair[0]).split(",").map(function (t) { return t.trim(); }).filter(Boolean),
                additions: splitNegativeField(pair[1]),
                exceptions: []
            };
        });
    }

    for (var b = 0; b < contextual.length; b++) {
        var entry = contextual[b];
        if (!entry || !entry.additions || !entry.additions.length) { continue; }

        var met = true;
        var requirements = entry.requirements || [];
        for (var q = 0; q < requirements.length; q++) {
            if (!isPresent(requirements[q], records, job)) { met = false; break; }
        }
        // ANY exception cancels the line — the thing the old pair list could not
        // express at all, and the main reason this format exists.
        var exceptions = entry.exceptions || [];
        for (var e = 0; met && e < exceptions.length; e++) {
            if (isPresent(exceptions[e], records, job)) { met = false; }
        }
        if (!met) { continue; }

        for (var a = 0; a < entry.additions.length; a++) {
            pieces = pieces.concat(splitNegativeField(entry.additions[a]));
        }
    }

    // The crops this shot is NOT. A framing cull knows them; nothing else does.
    if (typeof cleanedCullNegatives !== "undefined") {
        for (var i = 0; i < live.length; i++) {
            var implied = cleanedCullNegatives[live[i].text.toLowerCase()];
            if (implied) { pieces = pieces.concat(implied); }
        }
    }


    //if (typeof basicNegative !== "undefined")     { pieces = pieces.concat(splitNegativeField(basicNegative)); }
    
    //if (typeof universalNegative !== "undefined") { pieces = pieces.concat(splitNegativeField(universalNegative)); }

    // Drop what the prompt already asks for, then dedupe. The prompt check is at
    // specificity in one direction only: `blonde hair` in the prompt clears a
    // negative `blonde hair`, but a negative `hair` is a deliberate, broader
    // statement and stays.
    var inPrompt = {};
    for (var p = 0; p < live.length; p++) { inPrompt[live[p].text.toLowerCase()] = true; }

    var seen = {};
    var kept = [];
    for (var k = 0; k < pieces.length; k++) {
        var piece = String(pieces[k]).trim();
        if (!piece) { continue; }
        var key = piece.toLowerCase();
        if (seen[key] || inPrompt[key]) { continue; }
        seen[key] = true;
        kept.push(piece);
    }
    job.trace.negative = kept.length;
    return kept.join(", ");
}
// ============================================================================
//  PHASE 8 — BOOSTERS
// ============================================================================
//  (promptBoost is a v1 setting flag — do not reuse that name.)
//
//  Two halves. The reinforcement tags are already in by the time this runs: they
//  arrive from the boost section of cleaningArrayFinal during Phase 5's final
//  cleanup, and applyRules marks them `booster` on the way in. What is left is
//  the WEIGHT — raising it on tags this model reads weakly — and the contracted
//  render, which is the whole reason `booster` is a field at all.
//
//  Rule 25: boosters run specific -> general. `torn sweater` implies
//  `torn clothes`, never the reverse. Dictionary order carries that today; a
//  purpose-built booster array would state it, and does not exist yet.

// Rule 23, second pass. `liftLoraReferences` runs in Phase 1 TEXT space and can
// only catch what was typed; a reference injected later by a rule — 40-odd of
// them in cleaningDB, `Ohogao` and `Flesh unit` among them — arrives in tag
// space and used to stay there.
//
// It reached Forge either way, since promptRender re-attaches job.lora to the
// same string. What it broke is Regional Prompting: `liftLoraToCommon` moves
// job.lora into the common block, so a reference sitting in a RECORD instead
// belongs to whichever figure the rule fired for, and only that region gets it.
//
// The reference is often fused to a tag with no comma —
// `<lora:clitoral bulge - honohana:0.7> clitoris outline` — so it is cut out of
// the text rather than the record being dropped whole.
function liftLoraRecords(records, job) {
    var live = livingRecords(records);
    for (var i = 0; i < live.length; i++) {
        var record = live[i];
        if (record.text.indexOf("<lora:") === -1) { continue; }
        var stripped = record.text.replace(/<lora:[^>]*>/gi, function (match) {
            if (job.lora.indexOf(match) === -1) { job.lora.push(match); }
            return "";
        }).replace(/\s{2,}/g, " ").trim().replace(/^,+|,+$/g, "").trim();
        if (stripped === "") {
            record.culledBy = "lora lifted (Rule 23)";
            record.strength = "hard";
        } else {
            record.text = stripped;
        }
    }
    return records;
}

function promptBoosters(records, job) {
    records = liftLoraRecords(records, job);
    var live = livingRecords(records);

    // `noboost` means no reinforcement at all — drop what the boost rules added
    // and skip the emphasis. Same set of records that contraction drops.
    var boosting = !live.some(function (r) {
        return r.system && r.system.kind === "render option" && r.text.toLowerCase() === "noboost";
    });
    if (!boosting) {
        for (var i = 0; i < live.length; i++) {
            if (!live[i].booster) { continue; }
            live[i].culledBy = "noboost";
            live[i].strength = "hard";
        }
        return records;
    }

    return autoEmphasis(records, job);
}

// Some tags this model reads weakly, and one level of emphasis is the fix.
// Per-model data — `weakKeywordsArray` in defaultDB.js, 23 entries today.
//
// A tag you weighted yourself is left alone: you already said what you wanted,
// and stacking another paren on it would be the engine arguing.
function autoEmphasis(records, job) {
    if (typeof weakKeywordsArray === "undefined" || !weakKeywordsArray.length) { return records; }
    var weak = {};
    for (var w = 0; w < weakKeywordsArray.length; w++) {
        var entry = String(weakKeywordsArray[w]).trim().toLowerCase();
        if (entry) { weak[entry] = true; }
    }

    var live = livingRecords(records);
    for (var i = 0; i < live.length; i++) {
        var record = live[i];
        if (!weak[record.text.toLowerCase()]) { continue; }
        if (record.weight > 0 || record.emphasis != null) { continue; }
        record.weight = 1;
        job.trace.added.push({
            text: record.text,
            rule: "auto-emphasis: weak for this model",
            owner: record.owner
        });
    }
    return records;
}

// ============================================================================
//  PHASE 9 — RENDER
// ============================================================================
//  Records back to one flat string. Escaping happens here and nowhere else —
//  this is the first and only time a paren inside a tag gets a backslash.
//
//  Three things happen, in this order: PLACE each tag in a block, SORT within
//  each block, then emit. Blocks are separated by a newline, which costs
//  nothing at generation (Rule 12) and exists so a figure's tags can be selected
//  in one drag for inpainting.

// ---------------------------------------------------------------------------
//  Sort order
// ---------------------------------------------------------------------------
//  v1's own category ladder — the four "remove <domain>" lists in
//  cullBulkKeywords, concatenated in the order displayPrompt shows them:
//  character, outfit, scene, background. Reproducing v1's order is deliberate;
//  a prompt that sorts differently for no reason is a prompt you cannot diff.
//
//  ONE departure, and it is Noodle's call: the count categories are lifted out
//  of the middle of the scene block and put at the very top, ahead of the
//  character. Count tags get typed on instinct ("1girl, solo") and so much
//  downstream behaviour keys off them that burying them among the camera tags
//  reads wrong. `1girl` is in bodyRace as well and the rank is the FIRST match,
//  so it rides up here too — which is what CORPUS's Phase 9 solo probe shows.
//
//  A category not on this list still ranks ahead of an uncategorized tag; a tag
//  in no category at all sorts last, which is what puts `taitara` at the end.

var v2SortOrder = [
    "sceneCount", "sceneCountSolo", "sceneCountGroup",
    "bodyBrand",

    "bodyRace", "bodyHead", "bodyHair", "bodyFace", "bodyOrbital", "bodyEyes",
    "bodyMuzzle", "bodyTeeth", "bodyTorso", "bodyBack", "bodyWings", "bodyChest",
    "bodyBreasts", "bodyAreolae", "bodyNipples", "bodyArms", "bodyHands",
    "bodyFingernails", "bodyBelly", "bodyWaist", "bodyPenis", "bodyBalls",
    "bodyPussy", "bodyClit", "bodyButt", "bodyAnus", "bodyTail", "bodyLegs",
    "bodyFeet", "bodyToenails", "bodyUnsorted",

    // Top of the clothing block. A cosplay tag IS the outfit, so it reads best
    // immediately before the clothes it brought — this is a readability choice,
    // not a taxonomy one, and the category exists only for the sort.
    "clothesCosplay",
    "clothesFullwear", "clothesHeadwear", "clothesForeheadwear", "clothesFacewear",
    "clothesEyewear", "clothesMouthwear", "clothesEarwear", "clothesNeckwear",
    "clothesShoulderwear", "clothesArmwear", "clothesWristwear", "clothesHandwear",
    "clothesUpperwearOuter", "clothesUpperwearMiddle", "clothesUpperwearInner",
    "clothesUpperwearUnder", "clothesUpperwear", "clothesNipplewear",
    "clothesWaistwear", "clothesLowerwearOuter", "clothesLowerwearInner",
    "clothesLowerwearUnder", "clothesLowerwear", "clothesLegwearUpper",
    "clothesLegwearLower", "clothesFootwear", "weapons", "clothesUnsorted",

    "sceneFullwear", "sceneHeadwear", "sceneForeheadwear", "sceneFacewear",
    "sceneEyewear", "sceneMouthwear", "sceneEarwear", "sceneNeckwear",
    "sceneShoulderwear", "sceneArmwear", "sceneWristwear", "sceneHandwear",
    "sceneUpperwearOuter", "sceneUpperwearMiddle", "sceneUpperwearInner",
    "sceneUpperwearUnder", "sceneUpperwear", "sceneNipplewear", "sceneWaistwear",
    "sceneLowerwearOuter", "sceneLowerwearInner", "sceneLowerwearUnder",
    "sceneLowerwear", "sceneLegwearUpper", "sceneLegwearLower", "sceneFootwear",
    "sceneRace", "sceneHead", "sceneHair", "sceneFace", "sceneOrbital", "sceneEyes",
    "sceneMuzzle", "sceneTeeth", "sceneTorso", "sceneBack", "sceneWings",
    "sceneChest", "sceneBreasts", "sceneAreolae", "sceneNipples", "sceneArms",
    "sceneHands", "sceneFingernails", "sceneBelly", "sceneWaist", "scenePenis",
    "sceneBalls", "scenePussy", "sceneClit", "sceneButt", "sceneAnus", "sceneTail",
    "sceneLegs", "sceneFeet", "sceneToenails", "sceneInternal", "sceneCum",
    "sceneFx", "sceneToys", "scenePartner", "sceneCamera", "sceneUnsorted",

    "backgroundSimple", "backgroundIndoors", "backgroundOutdoors",
    "backgroundOther", "backgroundObjects", "backgroundArtists",
    "backgroundUnsorted"
];

var v2SortRank = null;

function buildSortRank() {
    if (v2SortRank) { return v2SortRank; }
    v2SortRank = {};
    for (var i = 0; i < v2SortOrder.length; i++) { v2SortRank[v2SortOrder[i]] = i; }
    return v2SortRank;
}

// Reads record.categories and does NOT fall back to a dictionary lookup. That
// is what keeps the tokenize round-trip an identity: nothing has been through
// assignCategories there, so every rank ties and input order survives.
function sortRankOf(record) {
    var rank = buildSortRank();
    var best = Infinity;
    var cats = record.categories || [];
    for (var c = 0; c < cats.length; c++) {
        var found = Object.prototype.hasOwnProperty.call(rank, cats[c])
            ? rank[cats[c]] : v2SortOrder.length;   // categorized, just not listed
        if (found < best) { best = found; }
    }
    // A character or franchise reference is a brand tag whether or not the
    // keyword DB happens to list it — 2728 names blocks against one keyword
    // file, so most of them do not.
    if (record.character && rank.bodyBrand < best) { best = rank.bodyBrand; }
    return best;
}

// Emphasis moves a tag FORWARD and never backward. `(bad hands:-1.2)` is
// de-emphasis, not a demand to be last, so it ranks with the plain tags.
function sortWeightOf(record) {
    if (record.emphasis != null) { return Math.max(0, (record.emphasis - 1) * 10); }
    return record.weight;
}

function compareForRender(a, b) {
    var wa = sortWeightOf(a), wb = sortWeightOf(b);
    if (wa !== wb) { return wb - wa; }
    var ra = sortRankOf(a), rb = sortRankOf(b);
    if (ra !== rb) { return ra < rb ? -1 : 1; }        // Infinity-safe
    if (a.position !== b.position) { return a.position - b.position; }
    return a.sequence - b.sequence;
}

// A system keyword that needed a sigil never reaches the output (Rule 20).
function isRenderable(record) {
    return !(record.system && !record.system.emit);
}

// Per-figure count tags. Two subjects each carrying `1girl` are NOT the merge
// case below — one figure each is the whole meaning, and CORPUS puts one in
// every subject's group.
//
// ITS OWN LIST, and deliberately not a category. This used to ask whether the
// record was in `sceneCountSolo`, which meant the same dictionary block had to
// answer two questions that want opposite things:
//
//   determineSolo      is this tag EVIDENCE THE SHOT IS SOLO?
//   isPerFigureCount   does this tag BELONG TO ONE FIGURE, so do not merge it?
//
// `1girl` is the second and is not the first — one girl in the shot says nothing
// about whether anyone else is in it — so it was making `masturbation` and
// friends read as solo evidence. It came out of `countSolo` on 2026-08-08, which
// was right, and took this exemption with it. Four tags, written down here, and
// neither question can break the other again.
//
// `solo` and `symmetrical` are NOT in this list even though the old category
// carried them: `solo` is a statement about the image, not about one figure, and
// `symmetrical` should merge like anything else.
var v2PerFigureCounts = ["1girl", "1boy", "furry female", "furry male"];

function isPerFigureCount(record) {
    return v2PerFigureCounts.indexOf(String(record.text).toLowerCase()) !== -1;
}

// ---------------------------------------------------------------------------
//  Placement
// ---------------------------------------------------------------------------
//  Grouping exists to separate figures, so it only happens when there is more
//  than one figure to separate. With a single subject — or none — everything is
//  hers already and the split would only cost a line break.
//
//  With two or more: text owned by EVERY subject merges into one common entry
//  (Rule 13), an unowned tag is common, and everything else sits in its owner's
//  group.

function placeRecords(emitted, job) {
    var owners = [];
    for (var i = 0; i < emitted.length; i++) {
        var owner = emitted[i].owner;
        if (owner != null && owners.indexOf(owner) === -1) { owners.push(owner); }
    }
    if (owners.length < 2) { return { common: emitted.slice(), groups: [] }; }

    // Rule 13 — merge text ALL subjects carry into the common block.
    //
    // "All", not "two or more". With two figures those are the same sentence,
    // which is why this read `>= 2` until three characters made the difference
    // visible: a trait two of them shared was hoisted into the common block, and
    // the common block reaches EVERYONE. Two furry females sharing a body type
    // put `blue fur` on the tanuki standing next to them, who has brown fur in
    // his own group and now contradicts himself; two of the three smiling put a
    // smile on the one who is asleep.
    //
    // A tag shared by some-but-not-all now simply stays in each group that has
    // it. That is a duplicate on the page and it is the correct one — under
    // Regional Prompting each region needs its own copy, and Rule 14 already
    // says two records with the same text and different owners are not
    // duplicates.
    var byText = {};
    var suppressed = [];
    for (var m = 0; m < emitted.length; m++) {
        var record = emitted[m];
        if (record.owner == null || isPerFigureCount(record)) { continue; }
        var key = record.text.toLowerCase();
        if (!byText[key]) { byText[key] = []; }
        byText[key].push(record);
    }
    var shared = {};
    for (var key in byText) {
        if (!Object.prototype.hasOwnProperty.call(byText, key)) { continue; }
        var hits = byText[key];
        var distinct = [];
        for (var h = 0; h < hits.length; h++) {
            if (distinct.indexOf(hits[h].owner) === -1) { distinct.push(hits[h].owner); }
        }
        if (distinct.length !== owners.length) { continue; }
        shared[key] = hits[0];
        for (var s = 1; s < hits.length; s++) { suppressed.push(hits[s]); }
    }

    var common = [];
    var groups = [];
    var byOwner = {};
    for (var g = 0; g < owners.length; g++) {
        byOwner[owners[g]] = { owner: owners[g], records: [] };
        groups.push(byOwner[owners[g]]);
    }
    for (var e = 0; e < emitted.length; e++) {
        var r = emitted[e];
        if (suppressed.indexOf(r) !== -1) { continue; }
        if (r.owner == null || shared[r.text.toLowerCase()] === r) { common.push(r); }
        else { byOwner[r.owner].records.push(r); }
    }
    return { common: common, groups: groups };
}

function promptRender(records, job, options) {
    options = options || {};
    var live = livingRecords(records);
    var sorting = !live.some(function (r) {
        return r.system && r.system.kind === "render option" && r.text.toLowerCase() === "nosort";
    });

    var emitted = live.filter(isRenderable);
    if (options.contracted) {
        emitted = emitted.filter(function (r) { return !r.booster; });
    }
    var lines;

    if (!sorting) {
        lines = [renderList(emitted)];
    } else {
        var placed = placeRecords(emitted, job);
        var common = placed.common.slice().sort(compareForRender);

        // Uncategorised tags go last. `taitara` is the case this exists for, and
        // an emphasised tag is never dragged back here: it was written to lead.
        //
        // Last WITHIN THE COMMON BLOCK, not on a line of its own after the
        // subject groups. It used to get its own line, and that read as a
        // mysterious fourth figure — in practice most of what lands here is not
        // a foreign word at all but an ordinary booru tag the dictionaries have
        // not categorised yet, plus every booster a rule injected.
        var tail = [];
        var head = [];
        for (var i = 0; i < common.length; i++) {
            if (sortRankOf(common[i]) === Infinity && sortWeightOf(common[i]) <= 0) {
                tail.push(common[i]);
            } else {
                head.push(common[i]);
            }
        }

        lines = [];
        if (placed.groups.length === 0) {
            lines.push(renderList(dedupeForRender(head.concat(tail))));
            // One line, and it is everybody's. Nothing is grouped, so there is no
            // common-versus-region question to answer.
            if (!options.contracted) { job.hasCommonLine = false; }
        } else {
            // Phase 9's own dedupe, and the last one there is. A tag in the
            // common block already applies to every figure, so a group repeating
            // it says nothing — this is the case Phase 1's dedupe cannot reach,
            // because there the two were an unowned tag and a scoped one and
            // that difference was still real.
            var inCommon = {};
            for (var c = 0; c < common.length; c++) { inCommon[common[c].text.toLowerCase()] = true; }

            var lead = head.concat(tail);
            if (lead.length) { lines.push(renderList(dedupeForRender(lead))); }
            // Whether line 0 is the common block or already a figure. From the
            // flat string the two are indistinguishable, and Regional Prompting
            // has to know: it reads line 0 as common and everything after it as
            // a region. An emptied common block therefore arrived one line short,
            // failed the adapter's `< 3` guard, and generated with NO REGIONS and
            // no message — reachable just by typing `2girls, duo` into the
            // negative box, which culls them out of the prompt in Phase 7.
            //
            // Recorded on the normal pass only. The contracted render runs second
            // and drops boosters, so it can reach a different answer, and it is
            // not the string anybody dispatches.
            if (!options.contracted) { job.hasCommonLine = lead.length > 0; }
            for (var g = 0; g < placed.groups.length; g++) {
                var group = placed.groups[g].records
                    .filter(function (r) { return !inCommon[r.text.toLowerCase()]; })
                    .sort(compareForRender);
                if (group.length) { lines.push(renderList(dedupeForRender(hoistIdentity(group)))); }
            }
        }
        lines = lines.filter(function (l) { return l !== ""; });
    }

    var out = lines.join(",\n");

    // Held since the first text step and untouchable in between (Rule 23). It is
    // re-attached HERE, at the end of the string, so buildPrompt hands dispatch a
    // prompt that is already complete — job.lora stays populated for the trace,
    // and dispatch must not append it a second time.
    if (job && job.lora && job.lora.length) {
        out = out === "" ? job.lora.join(", ") : out + ", " + job.lora.join(", ");
    }
    return out;
}

// The count uplift is about the COMMON block, where the counts describe the
// image. Inside a subject's group the first thing has to be who she is, so the
// identity tag comes back to the front and her `1girl` follows it. Both halves
// of that are what CORPUS's Phase 9 probes show.
//
// `character` is only on the record that was TYPED. When a codename expands,
// the canonical tag arrives as an ordinary injection and carries no such mark,
// so bodyBrand membership is what identifies it — which is the same thing the
// keyword DB means by that category.
function hoistIdentity(group) {
    var identity = [], rest = [];
    for (var i = 0; i < group.length; i++) {
        var r = group[i];
        if (r.character || (r.categories || []).indexOf("bodyBrand") !== -1) { identity.push(r); }
        else { rest.push(r); }
    }
    return identity.concat(rest);
}

// Run on a SORTED list, so the copy that survives is the highest-weighted one.
function dedupeForRender(recordList) {
    var seen = {};
    return recordList.filter(function (r) {
        var key = r.text.toLowerCase();
        if (seen[key]) { return false; }
        seen[key] = true;
        return true;
    });
}

function renderList(recordList) {
    var pieces = [];
    for (var i = 0; i < recordList.length; i++) { pieces.push(renderRecord(recordList[i])); }
    return pieces.join(", ");
}

// A1111 reads `:<number>` before a closing paren as the WEIGHT of that group.
// That is the same shape as the emoticon tags — `:3` most of all — so wrapping
// one in emphasis parens writes `(:3)`, which is not the tag at weight 1.1 but
// an empty group at weight 3. Nesting makes it worse: `((:3))` is a weight-3
// group inside a weight-1.1 one.
//
// The tag is fine unweighted, and it is fine with an explicit weight, because
// then the LAST `:number` wins and the colon in front of it is just text. So the
// fix is to state the weight explicitly rather than by nesting, for exactly the
// tags where nesting is ambiguous. Nothing else in the output changes.
function endsWithWeightSyntax(text) {
    return /:\s*[+-]?[0-9.]+$/.test(text);
}

// Each paren level is A1111's ×1.1.
function weightForDepth(depth) {
    return Math.round(Math.pow(1.1, depth) * 1000) / 1000;
}

function renderRecord(record) {
    var text = escapeParens(record.text);
    if (record.emphasis != null) {
        return "(" + text + ":" + record.emphasis + ")";
    }
    if (record.weight > 0 && endsWithWeightSyntax(text)) {
        return "(" + text + ":" + weightForDepth(record.weight) + ")";
    }
    for (var d = 0; d < record.weight; d++) {
        text = "(" + text + ")";
    }
    return text;
}

// A paren inside a tag is part of its name and Forge wants it escaped.
function escapeParens(text) {
    return text.replace(/([()])/g, "\\$1");
}

// ============================================================================
//  Node export — harmless in the browser, and how webui2-test.js gets in.
// ============================================================================
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        buildPrompt: buildPrompt,
        promptLex: promptLex,
        promptRender: promptRender,
        tokenizePrompt: tokenizePrompt,
        tidySpacing: tidySpacing,
        makeRecord: makeRecord,
        matchDispatchKeyword: matchDispatchKeyword,
        v2ScanDispatchKeywords: v2ScanDispatchKeywords,
        extractInlineNegative: extractInlineNegative
    };
}
