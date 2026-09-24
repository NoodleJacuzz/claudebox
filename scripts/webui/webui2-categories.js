// ============================================================================
//  WEBUI ENGINE v2 — runtime category membership
// ============================================================================
//
//  The replacement for pre-expanding every category into `finalKeywordSet`.
//
//  Today `generateClothesCategorySet` and `generateBodyCategorySet` multiply
//  each category's items against 39 colours, 21 ornaments, 13 shapes, 7 sizes
//  and 2 variants and store the result. That is 4,243,630 keywords, of which
//  `bodyHair` alone is 468,895 — and 92% of those exist only because an
//  ornament was crossed into them. The actual base terms number 1,775.
//
//  Nothing needs the cross product to EXIST. Everything only ever asks whether
//  one string is in one category. So do not build it: take the string apart
//  again at the point of asking.
//
//      "dark green forehead marking"
//        -> {variant} {color} {item}   variant "dark", colour "green",
//                                      base "forehead marking"
//        -> is "forehead marking" an item of bodyFace?   yes -> member
//
//  This file computes membership and NOTHING ELSE. It is deliberately not
//  wired into the engine: swapping the live `.has()` call sites is a separate,
//  reviewable change, and the failure mode there is silent — miss one and a tag
//  quietly has no category, stops culling, stops sorting, and nothing errors.
//  See TODO.md "Ornament pre-expansion" for the call sites to audit.
//
//  `webui2-category-test.js` is the safety net for that change: it walks the
//  REAL pre-expanded sets and asserts this file agrees with every single member.
//
//  ---------------------------------------------------------------------------
//  The patterns below mirror the two generators line for line. If a rule is
//  added to either generator it has to be added here, and the equivalence
//  harness is what will tell you that you forgot.
// ============================================================================

// ---------------------------------------------------------------------------
//  The patterns
// ---------------------------------------------------------------------------
//  `{item}` is the category's own term. Everything else is a slot filled from
//  modifierKeywordDB. A pattern with NO `{item}` is item-independent: the
//  generator emits it inside the item loop without referencing the item, so it
//  lands in every body category that has at least one item. That is a quirk of
//  the generator rather than a decision, and it is reproduced here because
//  equivalence is the whole point — see the harness before "fixing" it.

// generateClothesCategorySet, in source order.
var v2ClothesPatterns = [
    "{item}",
    "{color} {item}",
    "{color} {item} {shape} ornament",
    "{color} {item} {shape} ornaments",
    "{color} {shape} {item} ornament",
    "{color} {shape} {item} ornaments",
    "{variant} {color} {item}",
    "{variant} {item}",
    "{size} {item}",
    "{color}-trim {item}",
    "{color} inner {item}",
    "{color} under{item}",
    "{color} {item} gradient",
    "{ornament}-print {item}",
    "{color} {ornament}-print {item}",
    "{color}-striped {item}",
    "{color} {item} hairtie",
    "{item} {ornament}",
    "{color} {ornament} {item} ornament",
    // Added 2026-08-08, mirroring generateClothesCategorySet line for line.
    "{ornament} {item}",
    "{ornament} {item} ornament",
    "{ornament} {item} ornaments",
    "{color} {item} {ornament}",
    "{color} {ornament} {item} ornaments",
    "{color} inner-{item}",
    "{color} trim {item}",
    "{mod} {item}",
    "{pre} {item}",
    "{pre} own {item}",
    "{item} {suf}",
    // subitems
    "{sub}",
    "{pre} {sub}",
    "{pre} own {sub}",
    "{sub} {suf}",
    "{color} racing stripe",
];

// generateBodyCategorySet, in source order.
var v2BodyPatterns = [
    "{item}",
    "{item}less",
    "{item} out",
    "{item} outline",
    "{bodysize} {item}",
    "{color} {item}",
    "{variant} {item}",
    "{state} {item}",
    "{variant} {color} {item}",
    "{color} {item} piercing",
    "{variant} {color} {item} piercing",
    "{color}-tipped {item}",
    "{variant} {color}-tipped {item}",
    "{color} {item} tips",
    "{variant} {color} {item} tips",
    "{variant} {item} tips",
    "{color} {item} tip",
    "{variant} {color} {item} tip",
    "{variant} {item} tip",
    "{color} inner {item}",
    "{variant} {color} inner {item}",
    "{color} gradient {item}",
    "{variant} {color} gradient {item}",
    "{color} streaked {item}",
    "{variant} {color} streaked {item}",
    // Added 2026-08-08. Hyphenated twins kept BESIDE the spaced spellings, not
    // instead of them — both are in the training data and the single-truth pass
    // needs to see which is which.
    "{color}-streaked {item}",
    "{variant} {color}-streaked {item}",
    "{color} inner-{item}",
    "{variant} {color} inner-{item}",
    "{color} {item} streak",
    "{variant} {color} {item} streak",
    "{color}-striped {item}",
    "{variant} {color}-striped {item}",
    "{color} {ornament} {item} ornament",
    // symbols
    "{symbol} on {item}",
    "{symbol} over {item}",
    "{item} {symbol}",
    "{color} {symbol}",
    "{color} {symbol} on {item}",
    "{color} {symbol} over {item}",
    "{color} {item} {symbol}",
    "{shape} {symbol}",
    "{shape} {symbol} on {item}",
    "{shape} {symbol} over {item}",
    "{shape} {item} {symbol}",
    "{color} {shape} {symbol}",
    "{color} {shape} {symbol} on {item}",
    "{color} {shape} {symbol} over {item}",
    "{color} {shape} {item} {symbol}",
    "(symbol)-shaped tail tip",
    "(symbol)-shaped tail",
    "{symbol} tattoo",
    "{symbol} {item} tattoo",
    "{symbol} across {item}",
    // ornaments
    "{item} {ornament}",
    "{color} {item} {ornament}",
    "{variant} {color} {item} {ornament}",
    "{item} {ornament} ornament",
    // Added 2026-08-08 — the colourless form and both plurals.
    "{ornament} {item} ornament",
    "{ornament} {item} ornaments",
    "{color} {ornament} {item} ornaments",
    "{color} {item} {ornament} ornament",
    "{variant} {color} {item} {ornament} ornament",
    "{ornament} {item} piercing",
    "{color} {ornament} {item} piercing",
    "{variant} {color} {ornament} {item} piercing",
    // subparts
    "{sub}"
];

// Slot -> the modifierKeywordDB key it draws from. `bodysize` exists because
// the two generators read DIFFERENT keys for the same idea: clothes uses
// `sizes`, body uses `size`. That is not a typo to tidy — the lists differ.
var v2SlotSources = {
    color:     "colors",
    variant:   "variants",
    size:      "sizes",
    bodysize:  "size",
    ornament:  "ornaments",
    shape:     "shapes",
    symbol:    "symbols",
    state:     "state",
    pre:       "actionPrefixes",
    suf:       "actionSuffixes"
};

// generateClothesCategorySet's categoryModifiers table. `{mod}` is the only
// slot whose vocabulary depends on which category is being asked about, so its
// value is carried out of the match and checked at the end instead.
var v2CategoryModifierSources = {
    clothesFullwear:        "modifiersSleeves",
    clothesUpperwearOuter:  "modifiersSleeves",
    clothesUpperwearMiddle: "modifiersSleeves",
    clothesUpperwearInner:  "modifiersSleeves",
    clothesLowerwearInner:  "modifiersLowerwear",
    clothesLowerwearUnder:  "modifiersLowerwear",
    clothesFootwear:        "modifiersFootwear"
};

// ---------------------------------------------------------------------------
//  Compiling a pattern
// ---------------------------------------------------------------------------
//  A pattern becomes a list of segments — literal text or a slot — split at
//  the `{item}` / `{sub}` position. Everything to its left is consumed from the
//  front of the string and everything to its right from the back; whatever is
//  left in the middle is the base term.
//
//  Splitting rather than regex-matching is what makes glue work. `{item}less`
//  and `{color} under{item}` have no space at the join, so word-boundary
//  reasoning is wrong, and a regex with a lazy capture would have to be
//  backtracked against the item list to find the right split anyway.

function v2CompilePattern(template) {
    var segments = [];
    var rest = String(template);
    while (rest.length) {
        var open = rest.indexOf("{");
        if (open === -1) { segments.push({ lit: rest }); break; }
        if (open > 0) { segments.push({ lit: rest.slice(0, open) }); }
        var close = rest.indexOf("}", open);
        if (close === -1) { segments.push({ lit: rest.slice(open) }); break; }
        segments.push({ slot: rest.slice(open + 1, close) });
        rest = rest.slice(close + 1);
    }

    var at = -1;
    for (var i = 0; i < segments.length; i++) {
        if (segments[i].slot === "item" || segments[i].slot === "sub") { at = i; break; }
    }
    return {
        template: template,
        kind: at === -1 ? "itemless" : segments[at].slot,
        before: at === -1 ? segments : segments.slice(0, at),
        after:  at === -1 ? []       : segments.slice(at + 1)
    };
}

var v2CompiledPatterns = null;

function v2BuildPatterns() {
    if (v2CompiledPatterns) { return v2CompiledPatterns; }
    v2CompiledPatterns = { clothes: [], body: [] };
    for (var c = 0; c < v2ClothesPatterns.length; c++) {
        v2CompiledPatterns.clothes.push(v2CompilePattern(v2ClothesPatterns[c]));
    }
    for (var b = 0; b < v2BodyPatterns.length; b++) {
        v2CompiledPatterns.body.push(v2CompilePattern(v2BodyPatterns[b]));
    }
    return v2CompiledPatterns;
}

// ---------------------------------------------------------------------------
//  The item index
// ---------------------------------------------------------------------------
//  What the generators consume, kept as-is instead of multiplied out. This is
//  the whole memory saving: a few thousand strings rather than 4.24 million.

var v2CategoryIndex = null;

function v2BuildCategoryIndex() {
    if (v2CategoryIndex) { return v2CategoryIndex; }
    v2CategoryIndex = {};

    var load = function (keywordDB, domain) {
        if (typeof keywordDB === "undefined" || !keywordDB) { return; }
        var parsed = parseKeywordDB(keywordDB, modifierKeywordDB);
        for (var category in parsed) {
            if (!Object.prototype.hasOwnProperty.call(parsed, category)) { continue; }
            var items = new Set(), subitems = new Set();
            for (var i = 0; i < parsed[category].length; i++) {
                items.add(String(parsed[category][i].item).trim());
                var subs = parsed[category][i].subitems || [];
                for (var s = 0; s < subs.length; s++) { subitems.add(String(subs[s]).trim()); }
            }
            var singles = new Set();
            var listed = (typeof singletonKeywordDB !== "undefined" && singletonKeywordDB)
                ? (singletonKeywordDB[category] || []) : [];
            for (var k = 0; k < listed.length; k++) { singles.add(String(listed[k]).trim()); }

            v2CategoryIndex[category] = {
                domain: domain,
                items: items,
                subitems: subitems,
                singletons: singles,
                // Whether an item-independent pattern reaches this category at
                // all — the generator emits those inside the item loop, so a
                // category with no items never sees one.
                hasItems: items.size > 0,
                mods: v2ModsFor(category)
            };
        }
    };

    load(typeof clothesKeywordDB !== "undefined" ? clothesKeywordDB : null, "clothes");
    load(typeof bodyKeywordDB !== "undefined" ? bodyKeywordDB : null, "body");
    return v2CategoryIndex;
}

function v2ModsFor(category) {
    var mods = new Set();
    var global = modifierKeywordDB.modifiersGlobal || [];
    for (var g = 0; g < global.length; g++) { mods.add(global[g]); }
    var source = v2CategoryModifierSources[category];
    var extra = source ? (modifierKeywordDB[source] || []) : [];
    for (var e = 0; e < extra.length; e++) { mods.add(extra[e]); }
    return mods;
}

// Slot vocabularies, longest first. Longest-first matters: "dark green" has to
// be tried before "dark", or a two-word colour is never seen whole.
var v2SlotVocabulary = null;

function v2Vocabulary(slot) {
    if (!v2SlotVocabulary) { v2SlotVocabulary = {}; }
    if (v2SlotVocabulary[slot]) { return v2SlotVocabulary[slot]; }
    var key = v2SlotSources[slot];
    var list = (key && modifierKeywordDB[key]) ? modifierKeywordDB[key].slice() : [];
    if (slot === "mod") {
        // Every category-specific list at once. Which of them was legal is
        // decided per category, once a candidate exists.
        list = (modifierKeywordDB.modifiersGlobal || []).slice();
        for (var name in v2CategoryModifierSources) {
            if (!Object.prototype.hasOwnProperty.call(v2CategoryModifierSources, name)) { continue; }
            var extra = modifierKeywordDB[v2CategoryModifierSources[name]] || [];
            for (var e = 0; e < extra.length; e++) { list.push(extra[e]); }
        }
        list = Array.from(new Set(list));
    }
    list.sort(function (a, b) { return b.length - a.length; });
    v2SlotVocabulary[slot] = list;
    return list;
}

// ---------------------------------------------------------------------------
//  Taking a string apart
// ---------------------------------------------------------------------------

// Consumes `segments` from the front, returning every way it could be done.
// More than one survives whenever two slot values share a prefix, which is why
// this returns a list rather than a best guess.
function v2ConsumeFront(text, segments) {
    var open = [{ rest: text, slots: {} }];
    for (var i = 0; i < segments.length && open.length; i++) {
        var segment = segments[i];
        var next = [];
        for (var o = 0; o < open.length; o++) {
            var here = open[o];
            if (segment.lit != null) {
                if (here.rest.indexOf(segment.lit) === 0) {
                    next.push({ rest: here.rest.slice(segment.lit.length), slots: here.slots });
                }
                continue;
            }
            var vocabulary = v2Vocabulary(segment.slot);
            for (var v = 0; v < vocabulary.length; v++) {
                var value = vocabulary[v];
                if (here.rest.indexOf(value) !== 0) { continue; }
                var slots = Object.assign({}, here.slots);
                slots[segment.slot] = value;
                next.push({ rest: here.rest.slice(value.length), slots: slots });
            }
        }
        open = next;
    }
    return open;
}

// The same from the back. Segments are walked in reverse so the rightmost is
// stripped first.
function v2ConsumeBack(text, segments, slots) {
    var open = [{ rest: text, slots: slots }];
    for (var i = segments.length - 1; i >= 0 && open.length; i--) {
        var segment = segments[i];
        var next = [];
        for (var o = 0; o < open.length; o++) {
            var here = open[o];
            if (segment.lit != null) {
                if (v2EndsWith(here.rest, segment.lit)) {
                    next.push({ rest: here.rest.slice(0, here.rest.length - segment.lit.length),
                                slots: here.slots });
                }
                continue;
            }
            var vocabulary = v2Vocabulary(segment.slot);
            for (var v = 0; v < vocabulary.length; v++) {
                var value = vocabulary[v];
                if (!v2EndsWith(here.rest, value)) { continue; }
                var carried = Object.assign({}, here.slots);
                carried[segment.slot] = value;
                next.push({ rest: here.rest.slice(0, here.rest.length - value.length),
                            slots: carried });
            }
        }
        open = next;
    }
    return open;
}

function v2EndsWith(text, tail) {
    return tail.length <= text.length &&
           text.lastIndexOf(tail) === text.length - tail.length;
}

// Every way `text` could have been produced by the generators. Memoized,
// because the engine asks about the same tag once per category and there are
// 129 of them.
var v2DerivationCache = null;

function v2Derive(text) {
    if (!v2DerivationCache) { v2DerivationCache = {}; }
    var key = String(text == null ? "" : text).trim();
    if (Object.prototype.hasOwnProperty.call(v2DerivationCache, key)) {
        return v2DerivationCache[key];
    }

    var patterns = v2BuildPatterns();
    var found = [];
    var domains = ["clothes", "body"];
    for (var d = 0; d < domains.length; d++) {
        var list = patterns[domains[d]];
        for (var p = 0; p < list.length; p++) {
            var pattern = list[p];
            var fronts = v2ConsumeFront(key, pattern.before);
            for (var f = 0; f < fronts.length; f++) {
                var backs = v2ConsumeBack(fronts[f].rest, pattern.after, fronts[f].slots);
                for (var b = 0; b < backs.length; b++) {
                    // An itemless pattern must consume the whole string; every
                    // other one has to leave a base behind.
                    if (pattern.kind === "itemless") {
                        if (backs[b].rest.length) { continue; }
                    } else if (!backs[b].rest.length) { continue; }
                    found.push({
                        base: backs[b].rest,
                        kind: pattern.kind,
                        domain: domains[d],
                        mod: backs[b].slots.mod || null,
                        template: pattern.template
                    });
                }
            }
        }
    }

    v2DerivationCache[key] = found;
    return found;
}

// ---------------------------------------------------------------------------
//  The answer
// ---------------------------------------------------------------------------

// The drop-in for `finalKeywordSet[category].has(text)`.
function v2InCategory(text, category) {
    var index = v2BuildCategoryIndex();
    var entry = index[category];
    if (!entry) { return false; }
    var key = String(text == null ? "" : text).trim();
    if (!key) { return false; }

    // A singleton is listed outright and answers before anything is parsed.
    if (entry.singletons.has(key)) { return true; }

    var derived = v2Derive(key);
    for (var i = 0; i < derived.length; i++) {
        if (v2DerivationFits(derived[i], entry)) { return true; }
    }
    return false;
}

function v2DerivationFits(derived, entry) {
    if (derived.domain !== entry.domain) { return false; }
    // `{mod}` draws from a different list per category, so a match is only real
    // if the value used is one this category was actually offered.
    if (derived.mod != null && !entry.mods.has(derived.mod)) { return false; }
    if (derived.kind === "itemless") { return entry.hasItems; }
    if (derived.kind === "sub")      { return entry.subitems.has(derived.base); }
    return entry.items.has(derived.base);
}

// Every category the text belongs to. The engine's `categoriesOf` asks all 129
// one at a time today; this does the taking-apart once and then answers from
// the derivation, which is the shape the eventual swap wants.
function v2CategoriesOf(text) {
    var index = v2BuildCategoryIndex();
    var key = String(text == null ? "" : text).trim();
    var derived = v2Derive(key);
    var out = [];
    for (var category in index) {
        if (!Object.prototype.hasOwnProperty.call(index, category)) { continue; }
        var entry = index[category];
        if (entry.singletons.has(key)) { out.push(category); continue; }
        for (var i = 0; i < derived.length; i++) {
            if (v2DerivationFits(derived[i], entry)) { out.push(category); break; }
        }
    }
    return out;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { v2InCategory: v2InCategory, v2CategoriesOf: v2CategoriesOf };
}
