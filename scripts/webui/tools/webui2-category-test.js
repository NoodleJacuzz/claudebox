// ============================================================================
//  WEBUI ENGINE v2 — category equivalence harness
// ============================================================================
//
//    node --max-old-space-size=4096 scripts/webui/tools/webui2-category-test.js
//    node ... webui2-category-test.js bodyHair        one category, verbose
//    node ... webui2-category-test.js --sample 20000  cap per category
//
//  Asks one question, of every keyword the current generators produce:
//
//      does v2InCategory() give the same answer as finalKeywordSet.has()?
//
//  Both directions matter and they fail differently:
//
//    a MISS  (set says yes, matcher says no) is the dangerous one. After the
//            swap that tag silently has no category — it stops culling, stops
//            sorting, and nothing errors. This must be ZERO.
//
//    an EXTRA (matcher says yes, set says no) means the matcher accepts
//            something the generator never built. Usually harmless and
//            sometimes desirable — `blue ribbons hair ornaments` is a typo the
//            set cannot contain and the matcher probably should — but each one
//            wants looking at rather than assuming.
//
//  This harness builds the FULL pre-expanded set on purpose. It is the last
//  thing that ever should: it exists so the thing that replaces it can be
//  trusted, and it can be deleted with the generators.
// ============================================================================

const fs = require("fs");
const vm = require("vm");
const path = require("path");

// One up from tools/: `here` means the engine directory, which is what every
// path below is relative to.
const here = path.join(__dirname, "..");
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
for (const file of ["webui.js", "webui2.js", "webui2-categories.js"]) {
    vm.runInContext(fs.readFileSync(path.join(here, file), "utf8"), sandbox, { filename: file });
}

const args = process.argv.slice(2);
const sampleAt = args.indexOf("--sample");
const sample = sampleAt === -1 ? Infinity : Number(args[sampleAt + 1]);
// Skip the flag AND its value, or `--sample 300` reads 300 as a category name.
const only = args.find((a, i) => !a.startsWith("--") && i !== sampleAt + 1) || null;

console.log("Building the pre-expanded sets (the thing being replaced)...");
const startBuild = Date.now();
vm.runInContext("buildFinalKeywordSets()", sandbox);
const buildMs = Date.now() - startBuild;
const finalKeywordSet = vm.runInContext("finalKeywordSet", sandbox);
const v2InCategory = sandbox.v2InCategory;
const v2CategoriesOf = sandbox.v2CategoriesOf;

const categories = Object.keys(finalKeywordSet)
    .filter(c => !only || c === only)
    .sort();

if (!categories.length) {
    console.error(only ? `no such category: ${only}` : "no categories");
    process.exit(1);
}

let totalMembers = 0, totalChecked = 0, totalMiss = 0;
const missesByCategory = {};
const missExamples = [];

console.log(`Built in ${buildMs} ms. Checking ${categories.length} categories.\n`);
const startCheck = Date.now();

for (const category of categories) {
    const set = finalKeywordSet[category];
    if (!set || !set.size) { continue; }
    totalMembers += set.size;

    let checked = 0, missed = 0;
    for (const keyword of set) {
        if (checked >= sample) { break; }
        checked++;
        if (!v2InCategory(keyword, category)) {
            missed++;
            if (missExamples.length < 40) { missExamples.push(`${category}: ${JSON.stringify(keyword)}`); }
        }
    }
    totalChecked += checked;
    totalMiss += missed;
    if (missed) { missesByCategory[category] = { missed, checked }; }
    if (only) { console.log(`  ${category}: ${checked} checked, ${missed} missed`); }
}

const checkMs = Date.now() - startCheck;

console.log(`\n${totalChecked} keywords checked out of ${totalMembers} in ${checkMs} ms`);
console.log(`MISSES (set yes, matcher no): ${totalMiss}`);

if (totalMiss) {
    console.log("\nWorst categories:");
    Object.entries(missesByCategory)
        .sort((a, b) => b[1].missed - a[1].missed)
        .slice(0, 15)
        .forEach(([c, r]) => console.log(`   ${c}: ${r.missed} / ${r.checked}`));
    console.log("\nExamples:");
    missExamples.forEach(e => console.log("   " + e));
}

// ---------------------------------------------------------------------------
//  The other direction, on a smaller sample
// ---------------------------------------------------------------------------
//  The pass above only asks "does the matcher find everything the set holds".
//  It would still pass if the matcher said yes to everything. This asks for the
//  EXACT category list instead, which catches a pattern that is too loose —
//  a slot vocabulary reused where the generator did not reuse it, say.
//
//  Smaller sample because each keyword costs a pass over every category twice.

const exactSample = Math.min(sample, 400);
let exactChecked = 0, exactWrong = 0;
const exactExamples = [];

for (const category of categories) {
    const set = finalKeywordSet[category];
    if (!set || !set.size) { continue; }
    let taken = 0;
    for (const keyword of set) {
        if (taken >= exactSample) { break; }
        taken++; exactChecked++;
        const live = categories.filter(c => finalKeywordSet[c] && finalKeywordSet[c].has(keyword)).sort();
        const derived = v2CategoriesOf(keyword).filter(c => categories.indexOf(c) !== -1).sort();
        if (JSON.stringify(live) !== JSON.stringify(derived)) {
            exactWrong++;
            if (exactExamples.length < 20) {
                exactExamples.push(`${JSON.stringify(keyword)}\n        set     : ${live.join(", ")}\n        matcher : ${derived.join(", ")}`);
            }
        }
    }
}

console.log(`\n${exactChecked} keywords checked for an EXACT category list`);
console.log(`DISAGREEMENTS (either direction): ${exactWrong}`);
if (exactWrong) {
    console.log("\nExamples:");
    exactExamples.forEach(e => console.log("   " + e));
}

// ---------------------------------------------------------------------------
//  What the whole exercise is for: the size of the thing being removed.
// ---------------------------------------------------------------------------

const index = vm.runInContext("v2BuildCategoryIndex()", sandbox);
let baseTerms = 0;
for (const category in index) {
    baseTerms += index[category].items.size + index[category].subitems.size
               + index[category].singletons.size;
}

console.log(`\n--- the point of it ---`);
console.log(`pre-expanded keywords stored : ${totalMembers.toLocaleString()}`);
console.log(`base terms the matcher needs : ${baseTerms.toLocaleString()}`);
console.log(`ratio                        : ${(totalMembers / baseTerms).toFixed(0)}x`);

// ---------------------------------------------------------------------------
//  Cases from TODO.md, by hand. These say what the matcher SHOULD do, which is
//  not the same question as whether it agrees with the generator.
// ---------------------------------------------------------------------------

console.log(`\n--- TODO.md's worked examples ---`);
const realOrnaments = [
    "blue ribbon hair ornament",
    "blue ribbon hair ornaments",
    "blue ribbon head ornament",
    "dark green forehead marking",
    "dark pink forehead diamond",
    "skull hat ornament",
    "red neck bell",
    "neck bell",
    "red markings"
];
const vagueTags   = ["neck gem", "blue gem", "skull tattoo"];
const typoTags    = ["blue ribbons hair ornaments"];

const report = (label, list) => {
    console.log(`\n${label}`);
    for (const tag of list) {
        const live = Object.keys(finalKeywordSet).filter(c => finalKeywordSet[c].has(tag));
        const derived = v2CategoriesOf(tag);
        const same = JSON.stringify(live.slice().sort()) === JSON.stringify(derived.slice().sort());
        console.log(`   ${same ? "  " : "!!"} ${JSON.stringify(tag)}`);
        console.log(`        set     : ${live.join(", ") || "(none)"}`);
        console.log(`        matcher : ${derived.join(", ") || "(none)"}`);
    }
};

report("real ornament examples", realOrnaments);
report("vague tags (should be categorised, currently a design gap)", vagueTags);
report("incorrectly formatted / typo tags (the set CANNOT hold these)", typoTags);

process.exit((totalMiss || exactWrong) ? 1 : 0);
