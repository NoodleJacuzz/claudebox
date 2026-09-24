// ============================================================================
//  WEBUI ENGINE v2 — headless test harness
// ============================================================================
//
//    node scripts/webui/tools/webui2-test.js              run the suite
//    node scripts/webui/tools/webui2-test.js "a, ((b))"   compile one prompt
//
//  Two kinds of test, and keeping them apart matters:
//
//    tokenize()  text in -> records -> string, with NO dictionary in between.
//                This is the round-trip milestone. It must stay true forever,
//                and it must not break just because a cleaning rule changed.
//
//    pipeline()  the whole of buildPrompt, dictionaries and all. These assert
//                on real behaviour and WILL move when you edit a dictionary.
//                That is correct — they are the ones that catch a bad rule.
//
//  Everything loads as plain scripts into a vm context, exactly as the page
//  loads them. No DOM stubs are needed.
// ============================================================================

const fs = require("fs");
const vm = require("vm");
const path = require("path");

// One up from tools/: `here` means the engine directory, which is what every
// path below is relative to.
const here = path.join(__dirname, "..");
// The dictionaries log ~60 lines of parse noise at load; quiet all but errors.
const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);

// Load exactly what the page loads, in the same order, by reading webui.js's own
// librariesList. Reading the directory instead would pull in brandsDB2.js and
// anything else staged there, which redefines live globals.
const lib = path.join(here, "libraries");
const webuiSrc = fs.readFileSync(path.join(here, "webui.js"), "utf8");
const listMatch = webuiSrc.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/);
if (!listMatch) { throw new Error("librariesList not found in webui.js"); }
const libraries = listMatch[1].match(/"([^"]+)"/g).map(function (q) { return q.slice(1, -1); });
for (const file of libraries) {
    vm.runInContext(fs.readFileSync(path.join(lib, file), "utf8"), sandbox, { filename: file });
}
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) {
    vm.runInContext(fs.readFileSync(path.join(here, file), "utf8"), sandbox, { filename: file });
}
vm.runInContext("v2EnsureDictionaries()", sandbox);

// ---------------------------------------------------------------------------

let pass = 0, fail = 0;

function ok(label) { pass++; console.log(`  ok    ${label}`); }
function bad(label, want, got) {
    fail++;
    console.log(`  FAIL  ${label}`);
    console.log(`          want ${JSON.stringify(want)}`);
    console.log(`          got  ${JSON.stringify(got)}`);
}

// Text space + tokenize + render. No dictionaries, no rules.
function tokenize(input, expected) {
    const job = { errors: [], lora: [], scopes: [], subjects: [],
                  trace: { added: [], culled: [], conflicts: [] } };
    let text = sandbox.liftLoraReferences(input, job);
    text = sandbox.foldNewlines(text);
    text = sandbox.tidySpacing(text);
    const records = sandbox.tokenizePrompt(text, job);
    const got = sandbox.promptRender(records, job);
    const want = expected === undefined ? input : expected;
    if (got === want) { ok(JSON.stringify(input)); } else { bad(JSON.stringify(input), want, got); }
    return { job, records };
}

function pipeline(input, expected) {
    const job = sandbox.buildPrompt(input, "", {});
    if (job.prompt === expected) { ok(JSON.stringify(input)); }
    else { bad(JSON.stringify(input), expected, job.prompt); }
    return job;
}

function check(label, actual, want) {
    if (JSON.stringify(actual) === JSON.stringify(want)) { ok(label); }
    else { bad(label, want, actual); }
}

// ---------------------------------------------------------------------------

if (process.argv[2]) {
    const job = sandbox.buildPrompt(process.argv[2], process.argv[3] || "", {});
    console.log("\nprompt   ", job.prompt);
    console.log("negative ", job.negative);
    console.log("lora     ", job.lora);
    console.log("errors   ", job.errors);
    console.log("solo     ", job.solo, "| uniform", job.uniform, "|", job.soloReason);
    console.log("subjects ", job.subjects.map(x => `${x.id}:${x.kind}${x.scoped ? ":scoped" : ""}`).join(", ") || "none");
    if (job.trace.conflicts.length) { console.log("conflicts", JSON.stringify(job.trace.conflicts)); }
    console.log("\nrecords");
    for (const r of job.records) {
        const flags = [
            r.culledBy ? `culled:${r.culledBy}` : null,
            r.owner ? `owner:${r.owner}` : null,
            r.immune ? "immune" : null,
            r.system ? `sys:${r.system.kind}${r.system.emit ? "" : ",eaten"}` : null,
            r.source !== "input" ? r.source : null
        ].filter(Boolean).join("  ");
        console.log(`  ${String(r.position).padStart(2)}  w${r.weight}${r.emphasis != null ? ` e${r.emphasis}` : ""}  ${JSON.stringify(r.text).padEnd(28)} ${flags}`);
    }
    process.exit(0);
}

console.log("\n== the prompt seed — Phase 0, SKYBOXES.md D·4 ==\n");

{
    // The three properties the skybox system needs, each asserted on its own so
    // a failure says WHICH one broke. Nothing consumes job.rng yet; these pin
    // the contract before anything depends on it.
    const a = sandbox.buildPrompt("1girl, playerHouse", "", {});
    const b = sandbox.buildPrompt("1girl, playerHouse", "", {});
    check("same input, same seed",        a.seed, b.seed);
    check("and the seed is a real number", typeof a.seed === "number" && a.seed >= 0, true);

    const c = sandbox.buildPrompt("1girl, playerBedroom", "", {});
    check("different input, different seed", a.seed !== c.seed, true);

    // Length alone was the first idea for the hash. These two are the same
    // length and must not collide — that was the whole objection to it.
    const len1 = sandbox.buildPrompt("red hair, blue eyes", "", {});
    const len2 = sandbox.buildPrompt("blue hair, red eyes", "", {});
    check("same LENGTH is not the same seed", len1.seed !== len2.seed, true);

    // The combo contract: Phase 0 hashes the whole block and hands one value to
    // every job, so two DIFFERENT job texts still share a seed. Without this a
    // combo run changes its furniture shot to shot.
    const j1 = sandbox.buildPrompt("frieren, playerHouse", "", { promptSeed: 12345 });
    const j2 = sandbox.buildPrompt("fern, playerHouse",    "", { promptSeed: 12345 });
    check("an explicit seed overrides the input hash", j1.seed, 12345);
    check("and two combo jobs share it",               j1.seed, j2.seed);

    // A fresh generator per job, not a shared stream — a shared one would let
    // job 2 continue where job 1 stopped and draw different decorations.
    const draw = j => [j.rng(), j.rng(), j.rng()].join(",");
    check("same seed means the same SEQUENCE, not a continuation", draw(j1), draw(j2));

    const r = sandbox.v2MakeRng(99);
    const first = r();
    check("rng returns a unit float", first >= 0 && first < 1, true);
    check("and advances",             r() !== first, true);

    // The shuffle exists so the decoration pass stops favouring whichever set
    // is written first. Same seed, same order; different seed, different order.
    const list = [1, 2, 3, 4, 5, 6, 7, 8];
    const s1 = sandbox.v2ShuffleSeeded(list, sandbox.v2MakeRng(7)).join("");
    const s2 = sandbox.v2ShuffleSeeded(list, sandbox.v2MakeRng(7)).join("");
    const s3 = sandbox.v2ShuffleSeeded(list, sandbox.v2MakeRng(8)).join("");
    check("shuffle is reproducible",        s1, s2);
    check("and actually shuffles",          s1 !== list.join(""), true);
    check("a different seed reorders",      s1 !== s3, true);
    check("and it never loses an element",  s1.split("").sort().join(""), "12345678");
}

console.log("\n== tokenize round-trip — no dictionaries, must stay true forever ==\n");

tokenize("frieren, blonde hair, head shot");
tokenize("1girl, solo, looking at viewer, smile");
tokenize("((detailed)), frieren, angry");
tokenize("(pinup), (dynamic), dead or alive");
tokenize("(((very emphasised))), plain");
tokenize("frieren \\(sousou no frieren\\), white hair");
tokenize("kasumi \\(doa\\), 1girl, orange hair");
tokenize("(masterpiece:1.4), 1girl");
tokenize("(bad hands:-1.2), detailed");

console.log("\n   unescaped disambiguation parens belong to the name, not emphasis\n");

// MOVED 2026-09-06, on Noodle's instruction: text space now converts every input
// underscore to a space, so this arrives as `pal (species)` and the paren is read
// as part of the name rather than as emphasis — which is what this row is here to
// prove, and it still proves it. The underscore itself is no longer the question.
tokenize("pal_(species), panda girl",  "pal \\(species\\), panda girl");
tokenize("kasumi (doa), 1girl",        "kasumi \\(doa\\), 1girl");
tokenize("holding (object), standing", "holding \\(object\\), standing");
tokenize("((kasumi (doa))), solo",     "((kasumi \\(doa\\))), solo");
tokenize(":<, :3, :o, closed mouth");
// MOVED 2026-09-07. This asked for `(:3)` back and got it, but `(:3)` was never
// the round trip it looked like: A1111 reads `:<number>` before a closing paren
// as that group's WEIGHT, so `(:3)` is an EMPTY group at weight 3, not the tag
// `:3` at 1.1. The renderer now states the weight explicitly for exactly the
// tags where nesting is ambiguous, which is unambiguous in both directions.
tokenize("(:3), plain", "(:3:1.1), plain");
tokenize("((:3)), plain", "(:3:1.21), plain");
// The emoticons that are NOT number-shaped are untouched, because they were
// never ambiguous.
tokenize("(:o), (:<), plain");

console.log("\n   normalization — these are supposed to change\n");

tokenize("frieren,blonde hair,  head shot", "frieren, blonde hair, head shot");
tokenize("  frieren ,  blonde hair  ",      "frieren, blonde hair");
tokenize("frieren,, blonde hair",           "frieren, blonde hair");
tokenize("frieren\nblonde hair\nhead shot", "frieren, blonde hair, head shot");
tokenize("frieren, blonde hair,",           "frieren, blonde hair");
// v1 trims each tag's ends but never collapses runs INSIDE a tag, so a
// substring fix would leave "blonde   hair" matching no dictionary entry.
tokenize("blonde   hair, long   red   hair", "blonde hair, long red hair");

console.log("\n   lora is lifted, never a record\n");

// Lifted before any other text step and never a record in between — then put
// back at the very end of the string by Phase 9, which is where CORPUS's
// desired output has it.
{
    const { job, records } = tokenize("palworld, <lora:leafan:1>, furry",
                                      "palworld, furry, <lora:leafan:1>");
    check("lora held on the job", job.lora, ["<lora:leafan:1>"]);
    check("and never a record",   records.length, 2);
}
{
    const { job } = tokenize("<lora:Amazon - RMFAN:1> taitara, sword",
                             "taitara, sword, <lora:Amazon - RMFAN:1>");
    check("lora with spaces + trailing tag", job.lora, ["<lora:Amazon - RMFAN:1>"]);
}

console.log("\n   records carry what they should\n");

{
    const { records } = tokenize("((detailed)), frieren, angry");
    check("three records",      records.length, 3);
    check("depth preserved",    records[0].weight, 2);
    check("bare tag depth 0",   records[1].weight, 0);
    check("positions in order", records.map(r => r.position), [0, 1, 2]);
}
check("stored unescaped",
      tokenize("frieren \\(sousou no frieren\\)").records[0].text,
      "frieren (sousou no frieren)");

console.log("\n   unbalanced parens are errors, not crashes\n");

// One paren is still open when `fine` arrives, so `fine` really is inside it.
// Faithful reading of malformed input, and the error says so.
check("open paren reported",  tokenize("((oops), fine", "((oops)), (fine)").job.errors.length, 1);
check("close paren reported", tokenize("oops), fine", "oops\\), fine").job.errors.length, 1);

console.log("\n== wildcards — text space, before tokenize ==\n");

// Which character comes back is random, so the assertions are about the COMMAND
// being consumed rather than about the pick. A command left behind survives every
// phase and is emitted as literal text, which is the bug this catches.
const wildcard = (input) => sandbox.replaceWildcards(input);

console.log("   a space between the name and the paren is the same command\n");

for (const written of ["random(male)", "random (male)", "random  (male)",
                       "randomChar(female)", "randomChar (female)",
                       "randomCharacter(fem)", "randomCharacter (fem)"]) {
    const got = wildcard("1girl, " + written);
    if (!/random/i.test(got)) { ok(JSON.stringify(written)); }
    else { bad(JSON.stringify(written), "the command consumed", got); }
}

console.log("\n   and the rest of the string is untouched\n");

check("text before survives", /^1girl, /.test(wildcard("1girl, random (male)")), true);
check("text after survives",  /, standing$/.test(wildcard("random (male), standing")), true);
// No closing paren at all: leave it alone rather than eating the remainder.
check("malformed is left as written", wildcard("1girl, random (male"), "1girl, random (male");
// A name with no character behind it has nothing to substitute, so it stays put
// — and must not send the scanner into a loop.
check("no match leaves the command", wildcard("random (nosuchtag)"), "random (nosuchtag)");

console.log("\n== Phase 0 — assembly, and combo blocks ==\n");

// Assembly runs before either engine and touches no dictionary, so these are
// round-trip tests like tokenize's: they must stay true whatever the rules do.
const combo = (input) => sandbox.assemblePrompt(input, "combo");

console.log("   the cartesian product, unchanged\n");

check("groups multiply",
      combo("Line 1\nLine 2\n\nLine A\nLine B"),
      ["Line 1, Line A", "Line 1, Line B", "Line 2, Line A", "Line 2, Line B"]);
check("`-` is a comment, not a line",
      combo("- poses\nstanding\nsitting"), ["standing", "sitting"]);

console.log("   a declared block leads every variant that wants it\n");

{
    // TODO.md's worked example, verbatim. A declaration line is not an assembly
    // line: three declarations and three poses give three variants, not twelve.
    const out = combo(
        "[char] 1girl, red hair\n" +
        "[location] indoors, bedroom\n" +
        "![lighting] god rays, backlit\n" +
        "\n" +
        "- poses\n" +
        "standing, frown\n" +
        "sitting, legs crossed  [lighting]\n" +
        "outdoors, flowers      ![location]");
    check("three variants, not twelve", out.length, 3);
    check("an on-by-default block leads",
          out[0], "1girl, red hair, indoors, bedroom, standing, frown");
    check("an off-by-default block is switched on for one variant",
          out[1], "1girl, red hair, indoors, bedroom, god rays, backlit, sitting, legs crossed");
    check("and `!` switches one off",
          out[2], "1girl, red hair, outdoors, flowers");
}

console.log("   the awkward cases\n");

check("a block reference leading a line is a USE, not a redeclaration",
      combo("[bg] outdoors\n\n[bg], standing\nsitting"),
      ["outdoors, standing", "outdoors, sitting"]);
check("an undeclared name is left visible rather than swallowed",
      combo("standing [nosuch]"), ["standing [nosuch]"]);
check("a block declared with no tags still switches cleanly",
      combo("![empty]\n\nstanding [empty]"), ["standing"]);
check("blocks survive the // set split",
      combo("[a] red\n\n// one\nfish\n\n// two\ndog ![a]"), ["red, fish", "dog"]);

console.log("\n== pipeline — real dictionaries, real rules ==\n");

console.log("   misspellings and corrections from rulesArrayInitial\n");

pipeline("1girls, solo", "1girl, solo, female focus");
pipeline("solo, 1girls", "solo, 1girl, female focus");

console.log("\n   purges — a rule with an empty replacement\n");

pipeline("masterpiece, 1girl", "1girl, female focus, solo");
pipeline("1girl, masterpiece", "1girl, female focus, solo");

console.log("\n   a requirement gates the rule\n");

// `human on anthro` is a partner tag, so the shot is not solo and Phase 4 adds
// the group word. The rule under test is still the requirement gate.
pipeline("anthro, human on feral", "duo, anthro, furry female, human on anthro");
pipeline("human on feral",         "(human on feral), (human penetrating), duo, bestiality");

console.log("\n   dedupe\n");

pipeline("solo, 1girl, solo",    "solo, 1girl, female focus");
pipeline("blue tail, blue tail", "solo, blue tail");
pipeline("dynamic, (dynamic)", "(dynamic), solo");        // emphasis survives the dedupe
pipeline("(dynamic), dynamic", "(dynamic), solo");
pipeline("((solo)), solo, (solo)", "((solo))");

console.log("\n   top-level substring cleaning, before tokenize\n");

// Phase 9 sorts, so the corrected tag lands in its category's slot rather than
// where it was typed. What these assert is the correction, not the order.
pipeline("blomde hair, 1girl",   "1girl, female focus, solo, blonde hair");   // fixes inside a tag
pipeline("testicles, 1girl",     "1girl, female focus, solo, balls");
pipeline("thigh highs, 1girl",   "1girl, female focus, solo, thighhighs");

console.log("\n   the removeme sentinel, fused or whole\n");

pipeline("rating:explicit, 1girl",            "1girl, female focus, solo");
pipeline("anus growth (enlargement), 1girl",  "1girl, female focus, solo");   // sentinel fused to the tag

console.log("\n   aliases collapse to the canonical member\n");

pipeline("arm sleeves, 1girl",   "1girl, female focus, solo, detached sleeves");
pipeline("balls stretcher",      "solo, ball weight");
pipeline("ass out",              "solo, ass cutout");
pipeline("1girls, woman, solo",  "1girl, solo, female focus");           // both collapse, then dedupe

console.log("\n   character references are identified; only DOTTED ones are rewritten\n");

{
    const job = sandbox.buildPrompt("frieren \(sousou no frieren\), palworld, .gloopie, blue tail", "", {});
    const by = {};
    for (const r of job.records) { if (r.character) { by[r.text] = r.character; } }
    const f = by["frieren (sousou no frieren)"];
    check("canonical tag is a character",  f && f.kind, "character");
    check("and carries its franchise",     f && f.franchise, "sousou no frieren");
    check("palworld is a brand, not a subject", by["palworld"] && by["palworld"].kind, "brand");
    // A dotted reference is a way of naming her, never a tag Forge has seen, so
    // it becomes the canonical booru tag in Phase 1.
    check(".gloopie became her canonical tag", by["gloopie"] && by["gloopie"].kind, "codename");
    check("and the dot is gone",           job.prompt.indexOf(".gloopie"), -1);
    check("blue tail is nothing",          by["blue tail"], undefined);
}
{
    // An alias resolves to the same character record as the canonical.
    const job = sandbox.buildPrompt(".frieren, nami \(orange town\)", "", {});
    const by = {};
    for (const r of job.records) { if (r.character) { by[r.text] = r.character; } }
    check(".frieren resolves",   by["frieren (sousou no frieren)"] && by["frieren (sousou no frieren)"].name,
                                 "frieren (sousou no frieren)");
    // CONTRACT CHANGED 2026-08-17. This block used to assert that a typed alias
    // KEPT its text and that only Phase 3's injection carried the canonical.
    // A typed alias is now rewritten to the canonical in Phase 1, because that
    // is the whole job namesArray exists to do: `nami (orange town)` and
    // `nano` are spellings the model has no weights for, and leaving them in
    // put a dead tag beside the expansion that worked.
    check("a location variant resolves to the character",
          by["nami (one piece)"] && by["nami (one piece)"].name, "nami (one piece)");
    check("and the typed spelling is GONE, replaced by the canonical",
          job.records.some(r => r.text === "nami (orange town)"), false);
    check("exactly once, not doubled by the expansion",
          job.records.filter(r => r.text === "nami (one piece)" && r.culledBy == null).length, 1);
}

console.log("\n   system keywords are identified and survive as records\n");

{
    const job = sandbox.buildPrompt("1girl, head shot, !hands, keep tail, nosort", "", {});
    const sys = {};
    for (const r of job.records) { if (r.system) { sys[r.text] = r.system.kind + (r.system.emit ? "/emit" : "/eaten"); } }
    check("head shot is an emitted cull trigger", sys["head shot"], "cull trigger/emit");
    check("!hands is an eaten negation",          sys["!hands"],    "negation/eaten");
    check("keep tail is eaten protection",        sys["keep tail"], "protection/eaten");
    check("nosort is an eaten render option",     sys["nosort"],    "render option/eaten");
    check("1girl is not a system keyword",        sys["1girl"],     undefined);
}

console.log("\n   weight survives a rule replacing the tag\n");

{
    const job = sandbox.buildPrompt("((1girls)), solo", "", {});
    const one = job.records.filter(r => r.text === "1girl" && r.culledBy == null)[0];
    check("1girls -> 1girl keeps depth 2", one && one.weight, 2);
    check("and renders with it",           job.prompt, "((1girl)), solo, female focus");
}

console.log("\n   culled records are marked, never spliced\n");

{
    const job = sandbox.buildPrompt("masterpiece, 1girl", "", {});
    check("record still present", job.records.length, 4);
    check("marked, not removed",  job.records[0].culledBy != null, true);
    check("trace reports it",     job.trace.culled.length >= 1, true);
}

console.log("\n== quoted tags are literal ==\n");

// `"x"` means emit exactly x and never read it as a name. The contract is
// narrow on purpose: the engine may still categorise, sort, cull or negate a
// literal tag — it is an ordinary tag, it is just not a shortcut.
//
// Rule 24 gives quotes a different job inside DICTIONARY fields, where a quoted
// term is a SUBSTRING. Same character, two jobs, two spaces that never meet.

{
    // The case the syntax exists for. `fern` is a plant AND a character.
    const plain = sandbox.buildPrompt("\"fern\", potted plant", "", {});
    check("the quotes never reach the model", plain.prompt.indexOf("\""), -1);
    check("the word survives",     plain.prompt.indexOf("fern") !== -1, true);
    check("and summoned nobody",   plain.subjects.length, 0);
    check("so the shot is solo",   plain.solo, true);
}
{
    // A rule would normally rewrite this one, which makes it a clean probe:
    // both forms in one prompt, only the bare one corrected.
    const job = sandbox.buildPrompt("1girls, \"1girls\"", "", {});
    check("the bare form is corrected",  job.prompt.indexOf("1girl,") !== -1, true);
    check("the quoted form is not",      job.prompt.indexOf("1girls") !== -1, true);
}
{
    // Not a shortcut either — an outfit name in quotes is just the word.
    const job = sandbox.buildPrompt(".frieren, \"default\"", "", {});
    check("no outfit was expanded", job.prompt.indexOf("blue dress"), -1);
    check("the word is emitted",    job.prompt.indexOf("default") !== -1, true);
}
{
    // Still an ordinary tag in every other respect.
    const job = sandbox.buildPrompt("\"blonde hair\", head shot", "", {});
    const record = job.records.find(r => r.text === "blonde hair");
    check("a literal tag still gets categories",
          record && record.categories.length > 0, true);
}

console.log("\n== single-quoted tags are protected (Rule 2c) ==\n");

// `'x'` is stronger than `"x"`: never rewritten, never culled, and it triggers
// nothing, so only the tag itself reaches the model. Added 2026-09-14 for the
// Honeycomb art pipeline, where `pain` was being rewritten into boosters on a
// blocking pose.

{
    const bare = sandbox.buildPrompt("1girl, pain", "", {});
    const kept = sandbox.buildPrompt("1girl, 'pain'", "", {});
    check("the bare tag is rewritten (the probe is live)", bare.prompt.split(", ").indexOf("pain"), -1);
    check("the protected tag is emitted as typed", kept.prompt.split(/,\s*/).indexOf("pain") !== -1, true);
    check("with nothing riding along with it",
          kept.prompt.split(/,\s*/).filter(t => bare.prompt.split(/,\s*/).indexOf(t) !== -1 && t !== "1girl" && t !== "solo" && t !== "female focus").length, 0);
    check("and no quote reaches the model", kept.prompt.indexOf("'"), -1);
}
{
    // A default is a carry-on: `wide hips` brings `thick thighs`.
    const bare = sandbox.buildPrompt("1girl, wide hips", "", {});
    const kept = sandbox.buildPrompt("1girl, 'wide hips'", "", {});
    check("a bare tag triggers its default (the probe is live)", bare.prompt.indexOf("thick thighs") !== -1, true);
    check("a protected tag triggers none", kept.prompt.indexOf("thick thighs"), -1);
}
{
    const bare = sandbox.buildPrompt("1girl, white dress, nude", "", {});
    const kept = sandbox.buildPrompt("1girl, 'white dress', nude", "", {});
    check("a bare tag is culled (the probe is live)", bare.prompt.indexOf("white dress"), -1);
    check("a protected tag survives the cull", kept.prompt.indexOf("white dress") !== -1, true);
}
{
    const job = sandbox.buildPrompt("1girl, ('pain':1.2), (('wide hips'))", "", {});
    check("emphasis outside the quotes is kept", job.prompt.indexOf("(pain:1.2)") !== -1 && job.prompt.indexOf("((wide hips))") !== -1, true);
}
{
    const job = sandbox.buildPrompt("1girl, 'huge_condom', 'witch's broom', another's hand", "", {});
    check("the inside is kept exactly, underscores included", job.prompt.indexOf("huge_condom") !== -1, true);
    check("an apostrophe inside a protected tag is text", job.prompt.indexOf("witch's broom") !== -1, true);
    check("an apostrophe in an unquoted tag protects nothing", job.prompt.indexOf("another's hand") !== -1, true);
    check("a placeholder is never reported as unknown", job.trace.unknown.some(t => t.indexOf(String.fromCharCode(1)) !== -1), false);
}
{
    const job = sandbox.buildPrompt("1girl, 'frieren (sousou no frieren)'", "", {});
    check("a name paren inside the quotes is escaped once at render", job.prompt.indexOf("frieren \\(sousou no frieren\\)") !== -1, true);
    check("and summons nobody", job.subjects.length, 0);
}
{
    const job = sandbox.buildPrompt("frieren {'red hair'}, fern {blue hair}", "", {});
    const record = job.records.find(r => r.text === "red hair");
    check("a protected tag inside a scope still belongs to its owner", record && record.owner !== null, true);
}
{
    // Dictionary values too: Clemence's entry writes 'wide hips', and wide hips
    // would otherwise bring thick thighs.
    const job = sandbox.buildPrompt(".hcPriestV", "", {});
    check("a single-quoted entry value is emitted without quotes", job.prompt.indexOf("wide hips") !== -1 && job.prompt.indexOf("'") === -1, true);
    check("and triggers no default", job.prompt.indexOf("thick thighs"), -1);
}

console.log("\n== sex twins: one identity tag, two sexes ==\n");

// `.hcKnightV` and `.hcKnightC` both lead with `hc-kn1ght`. Typing the identity
// tag summons the one whose sex the prompt asks for. Added 2026-09-14.
{
    const male = sandbox.buildPrompt("hc-kn1ght, 1boy", "", {});
    const female = sandbox.buildPrompt("hc-kn1ght, 1girl", "", {});
    const plain = sandbox.buildPrompt("hc-kn1ght", "", {});
    check("a male prompt summons the male twin", male.prompt.indexOf("flat chest") !== -1 && male.prompt.indexOf("medium breasts") === -1, true);
    check("a female prompt summons the female twin", female.prompt.indexOf("medium breasts") !== -1 && female.prompt.indexOf("1boy") === -1, true);
    check("asking for no sex keeps the first registered twin", plain.prompt.indexOf("1girl") !== -1, true);
    const explicit = sandbox.buildPrompt(".hcKnightV, 1boy", "", {});
    check("an explicit codename is never second-guessed", explicit.prompt.indexOf("medium breasts") !== -1, true);
}

// The alias reaches the same pair as the identity tag, and genderswap flips the
// default twin. V is the default for the Honeycomb cast. Added 2026-09-17.
{
    const aliasPlain = sandbox.buildPrompt("brienne", "", {});
    check("an alias keeps the default twin", aliasPlain.prompt.indexOf("medium breasts") !== -1, true);
    const aliasMale = sandbox.buildPrompt("brienne, 1boy", "", {});
    check("an alias obeys an explicit sex", aliasMale.prompt.indexOf("flat chest") !== -1 && aliasMale.prompt.indexOf("medium breasts") === -1, true);
    const swap = sandbox.buildPrompt("brienne, genderswap", "", {});
    check("genderswap flips the default twin", swap.prompt.indexOf("flat chest") !== -1 && swap.prompt.indexOf("medium breasts") === -1, true);
    check("and the tag survives to steer the model", swap.prompt.indexOf("genderswap") !== -1, true);
    const swapMtF = sandbox.buildPrompt("brienne, genderswap (mtf)", "", {});
    check("genderswap (mtf) names the female twin", swapMtF.prompt.indexOf("medium breasts") !== -1, true);
    const swapFtM = sandbox.buildPrompt("brienne, genderswap (ftm)", "", {});
    check("genderswap (ftm) names the male twin", swapFtM.prompt.indexOf("flat chest") !== -1, true);
    const explicitWins = sandbox.buildPrompt("brienne, genderswap, 1girl", "", {});
    check("an explicit sex word beats the flip", explicitWins.prompt.indexOf("medium breasts") !== -1 && explicitWins.prompt.indexOf("flat chest") === -1, true);
}

console.log("\n== an image-level default respects every figure's exceptions ==\n");

// `male focus; cute boy [tall, ...]`: typed male focus is unowned and the
// character's `tall` is hers. The image-level pass used to add cute boy anyway.
{
    const job = sandbox.buildPrompt(".hcLancerC, male focus", "", {});
    check("a figure's own exception vetoes an image-level default", job.prompt.split(/,\s*/).indexOf("cute boy"), -1);
    const bare = sandbox.buildPrompt("1boy, male focus", "", {});
    check("with no exception anywhere the default still lands", bare.prompt.split(/,\s*/).indexOf("cute boy") !== -1, true);
}

console.log("\n== Honeycomb pose shortcuts (step 6) ==\n");

// The shortcut rules in cleaningDB + charactersDB turn `.hc<Char><V|C>, default,
// Pose<Slot>` into the full template. Two engine gaps had to close for this:
// a single-quoted value a CLEANING rule writes (`PoseDefense` carries `'pain'`)
// is protected like any other dictionary value, and a `!tag` an ENTRY rule
// injects (Nettle's breakdown drops `black staff`) is read as a negation even
// though markSystemKeywords has already run. Added 2026-09-14.

{
    const job = sandbox.buildPrompt(".hcKnightV, default, PoseDefense", "", {});
    const tags = job.prompt.split(/,\s*/);
    check("the CORE layer lands", tags.indexOf("action pose") !== -1 && tags.indexOf("full body") !== -1, true);
    check("the character's METHOD layer lands", tags.indexOf("staggering") !== -1, true);
    check("a quoted value from a cleaning rule is emitted without quotes", job.prompt.indexOf("'"), -1);
    check("and it is the tag, not the quote-wrapped text", tags.indexOf("pain") !== -1, true);
    check("the token itself is consumed", /posedefense/i.test(job.prompt), false);
}
{
    const broken = sandbox.buildPrompt(".hcNecroV, default, PoseBreakdown", "", {});
    const standing = sandbox.buildPrompt(".hcNecroV, default, PoseA", "", {});
    check("an entry-injected ! negation drops the outfit prop", broken.prompt.indexOf("black staff"), -1);
    check("with the same character and outfit it survives elsewhere", standing.prompt.indexOf("black staff") !== -1, true);
    check("the rest of the breakdown survives", broken.prompt.indexOf("cowboy shot") !== -1, true);
}
{
    const orphan = sandbox.buildPrompt("1girl, PoseDefense", "", {});
    check("a shortcut with no character is purged, not emitted", /posedefense/i.test(orphan.prompt), false);
}

console.log("\n== Phase 2 — scope, ownership, solo ==\n");

const FRIEREN = "frieren \\(sousou no frieren\\)";
const FERN    = "fern \\(sousou no frieren\\)";
const scope   = (input) => sandbox.buildPrompt(input, "", {});
const ownerOf = (job, text) => (job.records.find(r => r.text === text) || {}).owner;

console.log("   braces are consumed and never reach the output\n");

// Frieren expands here — a scope owns, it does not restrict (Rule 5), so the
// string is long. What matters is that no brace survives.
check("braces are consumed",
      sandbox.buildPrompt(FRIEREN + " {head only}", "", {}).prompt.indexOf("{") === -1, true);
pipeline("{red hair, red dress}", "solo, red hair, red dress");

console.log("\n   a scope belongs to the character named before it\n");

{
    const job = scope(FRIEREN + " {head only}, " + FERN);
    check("scope owned by frieren", ownerOf(job, "head only"), "frieren (sousou no frieren)");
    check("fern owns herself",      ownerOf(job, "fern (sousou no frieren)"), "fern (sousou no frieren)");
    check("two subjects",           job.subjects.length, 2);
}

console.log("\n   bare scopes are distinct anonymous subjects\n");

{
    const job = scope("2girls, {red hair, red dress}, {blonde hair, yellow dress}");
    check("first scope",             ownerOf(job, "red hair"), "anon1");
    check("second scope",            ownerOf(job, "blonde hair"), "anon2");
    check("not merged",              ownerOf(job, "red dress") !== ownerOf(job, "blonde hair"), true);
    check("count tag stays unowned", ownerOf(job, "2girls"), null);
}

console.log("\n   solo is derived, not trusted\n");

{
    check("one character defaults to solo", scope(FRIEREN).solo, true);
    check("explicit solo",                  scope(FRIEREN + ", solo").solo, true);
    check("count tag beats the default",    scope(FRIEREN + ", duo").solo, false);
    check("two subjects beat the default",  scope(FRIEREN + ", " + FERN).solo, false);
    const conflict = scope(FRIEREN + ", solo, duo, " + FERN);
    check("a contradicted solo tag loses",  conflict.solo, false);
    check("and is traced",                  conflict.trace.conflicts.length, 1);
}

console.log("\n   uniform is a separate question from solo\n");

{
    check("solo implies uniform",    scope(FRIEREN + ", solo").uniform, true);
    const sym = scope(FRIEREN + ", " + FERN + ", symmetrical");
    check("symmetrical is not solo", sym.solo, false);
    check("but it IS uniform",       sym.uniform, true);
    check("a plain duo is neither",  scope(FRIEREN + ", " + FERN).uniform, false);
}

console.log("\n   naming a category inside a scope protects it\n");

{
    const job = scope(FRIEREN + " {bodyTail}");
    check("scoped category is immune", (job.records.find(r => r.text === "bodyTail") || {}).immune, true);
    const loose = scope(FRIEREN + ", bodyTail");
    check("unscoped category is not",  (loose.records.find(r => r.text === "bodyTail") || {}).immune, false);
}

console.log("\n   unbalanced braces are errors, not crashes\n");

check("unclosed brace reported", scope(FRIEREN + " {head only").errors.length, 1);
check("stray close reported",    scope("head only}").errors.length, 1);

console.log("\n== isPresent ==\n");

const present = (input, term) => {
    const job = sandbox.buildPrompt(input, "", {});
    return sandbox.isPresent(term, job.records, job);
};

console.log("   equivalence is on by default; a quoted term is a SUBSTRING\n");

check("1girl satisfies a rule wanting female", present("1girl, solo", "female"), true);
check("an absent tag is absent",               present("1girl, solo", "xyzzy"), false);
// Both quote characters mean substring, because both dictionaries use them that
// way — `"dildo"` in defaultDB has to reach `huge dildo`, `'dress'` has to reach
// `china dress`. 178 lines depend on it.
check("a quoted term matches inside a tag",    present("1girl, huge dildo", '"dildo"'), true);
check("and misses when nothing contains it",   present("1girl, shirt", '"dildo"'), false);
check("single quotes mean the same thing",     present("1girl, china dress", "'dress'"), true);

console.log("\n   a strict category name asks about membership\n");

check("blonde hair is in bodyHair", present("1girl, blonde hair", "bodyHair"), true);
check("and not in bodyTail",        present("1girl, blonde hair", "bodyTail"), false);

console.log("\n   named checks read the whole record set\n");

check("bare figure is naked",            present("1girl, solo", "naked"), true);
check("a shirt is not",                  present("1girl, shirt", "naked"), false);
// The `open clothes` case, resolved without listing it: nobody tags nipples on
// a chest that cannot be seen.
check("shirt + nipples reads as naked",  present("1girl, shirt, nipples", "naked"), true);
check("panties are not naked",           present("1girl, panties", "naked"), false);
check("glasses only is completely naked", present("1girl, glasses", "completely naked"), true);
check("a shirt is not",                   present("1girl, shirt", "completely naked"), false);

console.log("\n== shouldAdd — the insertion gate ==\n");

const gate = (input, tag, owner) => {
    const job = sandbox.buildPrompt(input, "", {});
    return sandbox.shouldAdd(tag, owner === undefined ? null : owner, job.records, job);
};

console.log("   the three cases that define the rule\n");

check("solo: an unowned tag blocks",
      gate(FRIEREN + ", solo, angry", "kuudere").ok, false);
// Revised 2026-08-06: a global tag reaches every figure. `angry` written about a
// two-girl shot plainly means both of them, and it used to be let through on
// ambiguity grounds — which read as the engine ignoring what you wrote.
check("duo: an unowned tag is global, so it DOES block",
      gate(FRIEREN + ", " + FERN + ", angry", "kuudere").ok, false);
// What is still never arbitrated is one figure against another. Anonymous
// scopes, so nothing expands and the only tags present are the ones written.
check("but another figure's own tag never blocks",
      gate("{flat chest}, {blonde hair}", "large breasts", "anon2").ok, true);
check("duo + scope: ownership settles it, so it blocks",
      gate(FRIEREN + " {angry}, " + FERN, "kuudere", "frieren (sousou no frieren)").ok, false);

console.log("\n   and the rest\n");

check("a decline names its group",
      gate(FRIEREN + ", solo, angry", "kuudere").rule, "expression shortcut exclusivity");
check("a decline names the incumbent",
      gate(FRIEREN + ", solo, angry", "kuudere").blockedBy, "angry");
check("already present is declined",  gate("1girl, solo", "solo").ok, false);
check("an uncontested tag is fine",   gate("1girl, solo", "bamboo").ok, true);
check("symmetrical blocks like solo",
      gate(FRIEREN + ", " + FERN + ", symmetrical, angry", "kuudere").ok, false);

console.log("\n   addRecord is the single insertion path\n");

{
    const job = sandbox.buildPrompt(FRIEREN + ", solo, angry", "", {});
    const added = sandbox.addRecord("bamboo", { source: "engine:test" }, job.records, job);
    check("adds when allowed",   added && added.text, "bamboo");
    check("and traces it",       job.trace.added.some(a => a.text === "bamboo"), true);
    const refused = sandbox.addRecord("kuudere", { source: "engine:test" }, job.records, job);
    check("returns null when declined", refused, null);
    check("and traces the decline",     job.trace.declined.some(d => d.text === "kuudere"), true);
}

console.log("\n   categories land on the record in Phase 1\n");

{
    const job = sandbox.buildPrompt("1girl, blonde hair, xyzzynotatag", "", {});
    const hair = job.records.find(r => r.text === "blonde hair");
    check("blonde hair knows its category", hair.categories.indexOf("bodyHair") !== -1, true);
    check("an unknown tag has none",
          (job.records.find(r => r.text === "xyzzynotatag") || {}).categories, []);
    check("and is reported as unknown", job.trace.unknown.indexOf("xyzzynotatag") !== -1, true);
}

console.log("\n   one live instance of every generator pattern\n");

// The body and clothes members are no longer pre-expanded — webui2-categories.js
// answers those two domains by taking a tag apart. Its failure mode is silent: a
// pattern that stops matching does not throw, the tag simply has no category, and
// it then stops culling and stops sorting.
//
// So every row of v2BodyPatterns and v2ClothesPatterns gets ONE worked instance
// here, built from real items and real modifier values. If a pattern dies, the
// line that names it fails. That is the whole safety argument for the swap, and
// it is cheap — webui2-category-test.js walks all 8 M and needs 6 GB to do it.
{
    const cat = (t) => sandbox.categoriesOf(t);
    const has = (t, c) => cat(t).indexOf(c) !== -1;

    // body — `hair` is an item of bodyHair, `tail` of bodyTail.
    check("{item}",                        has("hair", "bodyHair"), true);
    check("{item}less",                    has("hairless", "bodyHair"), true);
    check("{item} out",                    has("hair out", "bodyHair"), true);
    check("{item} outline",                has("hair outline", "bodyHair"), true);
    check("{bodysize} {item}",             has("long hair", "bodyHair"), true);
    check("{color} {item}",                has("blue hair", "bodyHair"), true);
    check("{variant} {item}",              has("dark hair", "bodyHair"), true);
    check("{state} {item}",                has("spiked hair", "bodyHair"), true);
    check("{variant} {color} {item}",      has("dark blue hair", "bodyHair"), true);
    check("{color}-tipped {item}",         has("blue-tipped hair", "bodyHair"), true);
    check("{color} {item} tips",           has("blue hair tips", "bodyHair"), true);
    check("{color} {item} tip",            has("blue hair tip", "bodyHair"), true);
    check("{color} inner {item}",          has("blue inner hair", "bodyHair"), true);
    check("{color} gradient {item}",       has("blue gradient hair", "bodyHair"), true);
    check("{color} streaked {item}",       has("blue streaked hair", "bodyHair"), true);
    check("{color} {item} streak",         has("blue hair streak", "bodyHair"), true);
    check("{color}-striped {item}",        has("blue-striped hair", "bodyHair"), true);
    check("{color} {ornament} {item} ornament", has("blue ribbon hair ornament", "bodyHair"), true);
    check("{symbol} on {item}",            has("tattoo on hair", "bodyHair"), true);
    check("{symbol} over {item}",          has("tattoo over hair", "bodyHair"), true);
    check("{item} {symbol}",               has("hair tattoo", "bodyHair"), true);
    check("{color} {symbol}",              has("blue tattoo", "bodyHair"), true);
    check("{shape} {symbol}",              has("star tattoo", "bodyHair"), true);
    check("{color} {shape} {symbol}",      has("blue star tattoo", "bodyHair"), true);
    check("{color} {item} {symbol}",       has("blue hair tattoo", "bodyHair"), true);
    check("{item} {ornament}",             has("hair ribbon", "bodyHair"), true);
    check("{color} {item} {ornament}",     has("blue hair ribbon", "bodyHair"), true);
    check("{item} {ornament} ornament",    has("hair ribbon ornament", "bodyHair"), true);
    check("{ornament} {item} piercing",    has("ribbon hair piercing", "bodyHair"), true);
    check("body {sub}",                    has("wavy hair", "bodyHair"), true);

    // clothes — `boots` is an item of clothesFootwear, `shoes` too.
    check("clothes {item}",                has("boots", "clothesFootwear"), true);
    check("clothes {color} {item}",        has("blue boots", "clothesFootwear"), true);
    check("clothes {variant} {item}",      has("dark boots", "clothesFootwear"), true);
    check("clothes {size} {item}",         has("oversized boots", "clothesFootwear"), true);
    check("{color}-trim {item}",           has("blue-trim boots", "clothesFootwear"), true);
    check("clothes {color} inner {item}",  has("blue inner boots", "clothesFootwear"), true);
    check("{color} under{item}",           has("blue underboots", "clothesFootwear"), true);
    check("{color} {item} gradient",       has("blue boots gradient", "clothesFootwear"), true);
    check("{ornament}-print {item}",       has("star-print boots", "clothesFootwear"), true);
    check("clothes {color}-striped {item}",has("blue-striped boots", "clothesFootwear"), true);
    check("clothes {item} {ornament}",     has("boots star", "clothesFootwear"), true);
    check("{color} trim {item}",           has("blue trim boots", "clothesFootwear"), true);
    check("{pre} {item}",                  has("pulling boots", "clothesFootwear"), true);
    check("{pre} own {item}",              has("pulling own boots", "clothesFootwear"), true);
    check("{item} {suf}",                  has("boots down", "clothesFootwear"), true);
    check("clothes {sub}",                 has("combat boots", "clothesFootwear"), true);
    check("{pre} {sub}",                   has("pulling combat boots", "clothesFootwear"), true);
    check("{sub} {suf}",                   has("combat boots down", "clothesFootwear"), true);

    // and the two domains the matcher does NOT model, which stay pre-expanded
    check("scene still answers",           has("happy", "sceneFace"), true);
    check("a nonsense tag still has none", cat("xyzzynotatag"), []);
}

console.log("\n== Phase 3 — expansion ==\n");

const textsOf = (job) => job.records.filter(r => r.culledBy == null).map(r => r.text);

console.log("   a stored prompt's parens are emphasis, not text\n");

// No dictionary in between, so these must stay true whatever the data does.
const stored = (text) => sandbox.splitStoredPrompt(text);

check("a plain line is unweighted",
      stored("demon, insect, white head"),
      [{ text: "demon", weight: 0 }, { text: "insect", weight: 0 },
       { text: "white head", weight: 0 }]);
check("a group unpacks, every member weighted",
      stored("(alraune, dryad), ghost girl"),
      [{ text: "alraune", weight: 1 }, { text: "dryad", weight: 1 },
       { text: "ghost girl", weight: 0 }]);
check("a group of one is still a group",
      stored("1boy, (manly), abs"),
      [{ text: "1boy", weight: 0 }, { text: "manly", weight: 1 },
       { text: "abs", weight: 0 }]);
check("nesting deepens the score",
      stored("((very)), plain"),
      [{ text: "very", weight: 2 }, { text: "plain", weight: 0 }]);
// Rule 1b — an escaped paren is part of the NAME and is stored bare.
check("an escaped paren is a name, never a depth",
      stored("phoebe \\(pokemon\\), (dark-skinned female)"),
      [{ text: "phoebe (pokemon)", weight: 0 },
       { text: "dark-skinned female", weight: 1 }]);
check("a dictionary line's stray paren is forgiven",
      stored("no legs), fine"),
      [{ text: "no legs", weight: 0 }, { text: "fine", weight: 0 }]);
check("empty in, empty out", stored(""), []);

// The rule that replaced the escaping, 2026-08-08. A paren that opens where a
// TAG opens is emphasis; one with tag text in front of it is part of the name.
// These must stay true forever — the databases hold no backslashes now, so this
// is the only thing telling the two apart.
check("a name's parens are part of the tag",
      stored("nero claudius (fate), fate (series)"),
      [{ text: "nero claudius (fate)", weight: 0 },
       { text: "fate (series)", weight: 0 }]);
check("an emphasis group still opens a tag",
      stored("(alraune, dryad), nero claudius (fate)"),
      [{ text: "alraune", weight: 1 }, { text: "dryad", weight: 1 },
       { text: "nero claudius (fate)", weight: 0 }]);
check("both at once, nested",
      stored("(nero claudius (fate))"),
      [{ text: "nero claudius (fate)", weight: 1 }]);
check("a semicolon opens a tag too — .furTrap's own line",
      stored(".furTrap; (alraune, dryad)"),
      [{ text: ".furTrap;", weight: 0 },
       { text: "alraune", weight: 1 }, { text: "dryad", weight: 1 }]);

console.log("\n   and v1 gets its backslashes back at load\n");

// escapeStoredNames is what lets the files hold `nero claudius (fate)` while v1
// still receives what it has always received.
const escaped = (text) => sandbox.escapeStoredNames(text);

check("the value half is escaped",
      escaped(".rwbyruby; ruby rose (rwby), rwby, black hair"),
      ".rwbyruby; ruby rose \\(rwby\\), rwby, black hair");
check("an emphasis group is left bare",
      escaped(".furTrap; (alraune, dryad), ghost girl"),
      ".furTrap; (alraune, dryad), ghost girl");
check("the KEY half is never escaped — the import's codenames are booru tags",
      escaped(".2p (nier:automata); 2p (nier:automata), nier (series)"),
      ".2p (nier:automata); 2p \\(nier:automata\\), nier \\(series\\)");
check("a comment line is left exactly as written",
      escaped("// #region Fleshy Core (and friends)"),
      "// #region Fleshy Core (and friends)");
check("and the round trip is lossless",
      stored(escaped(".x; nero claudius (fate), (manly)").split("; ")[1]),
      [{ text: "nero claudius (fate)", weight: 0 }, { text: "manly", weight: 1 }]);

console.log("\n   and the weight reaches the record\n");

{
    // .furTrap opens with `(alraune, dryad, plant girl, scylla, legless, no legs)`.
    // Before the fix this was one record holding the whole comma string, which
    // rendered as `\(alraune, ... no legs\)` — parens and all — into the prompt.
    const job = sandbox.buildPrompt(".furTrap", "", {});
    const dryad = job.records.find(r => r.text === "dryad");
    check("a group member is its own record", !!dryad, true);
    check("and carries the emphasis",         (dryad || {}).weight, 1);
    // An emphasis paren can only ever have been at the edge of a tag; a name's
    // parens sit inside it, and none of hers has one.
    check("no paren clings to a record",
          job.records.some(r => /^\(|\)$/.test(r.text)), false);
    check("and none reaches the prompt",  /\\\(alraune/.test(job.prompt), false);
}

console.log("\n   a character injects her tags, owned by her\n");

{
    const job = scope(FRIEREN + ", solo");
    const out = textsOf(job);
    check("white hair injected",  out.indexOf("white hair") !== -1, true);
    check("twintails injected",   out.indexOf("twintails") !== -1, true);
    check("owned by frieren",     ownerOf(job, "white hair"), "frieren (sousou no frieren)");
    check("injected, not input",  (job.records.find(r => r.text === "white hair") || {}).source,
                                  "charactersDB:.frieren");
    check("the identity tag is not duplicated",
          out.filter(t => t === "frieren (sousou no frieren)").length, 1);
}

console.log("\n   two characters each keep their own tags\n");

{
    const job = scope(FRIEREN + ", " + FERN);
    check("frieren's hair is hers", ownerOf(job, "white hair"), "frieren (sousou no frieren)");
    check("fern's hair is hers",    ownerOf(job, "purple hair"), "fern (sousou no frieren)");
    check("both survive",           textsOf(job).indexOf("purple hair") !== -1, true);
}

console.log("\n   the gate applies to injections\n");

{
    // solo: `angry` is unowned but can only mean this figure, so kuudere loses.
    const solo = scope(FRIEREN + ", angry, solo");
    check("kuudere declined when solo", textsOf(solo).indexOf("kuudere"), -1);
    check("and the decline is traced",  solo.trace.declined.some(d => d.text === "kuudere"), true);
    // duo: `angry` is global, so it is true of both figures and blocks for both.
    // CORPUS Phase 3 Probe C.
    const duo = scope(FRIEREN + ", " + FERN + ", angry");
    check("kuudere declined in a duo too", textsOf(duo).indexOf("kuudere"), -1);
    // ...but the two figures never reach into each other's scopes.
    check("frieren keeps her chest", textsOf(duo).indexOf("flat chest") !== -1, true);
    check("and fern keeps hers",     textsOf(duo).indexOf("large breasts") !== -1, true);
}

console.log("\n   injected tags sit where their trigger sat (Rule 18)\n");

{
    const job = scope("bamboo, " + FRIEREN + ", solo");
    const out = textsOf(job);
    check("bamboo stays first",        out[0], "bamboo");
    check("her tags follow her name",  out.indexOf("white hair") > out.indexOf("frieren (sousou no frieren)"), true);
    check("and precede later input",   out.indexOf("white hair") < out.indexOf("solo"), true);
}

console.log("\n   replace clears what came before it, keeps what came after\n");

{
    const job = scope("shirt, replace clothes, panties");
    const out = textsOf(job);
    check("earlier clothing cleared", out.indexOf("shirt"), -1);
    check("later clothing kept",      out.indexOf("panties") !== -1, true);
    check("the command is consumed",  out.indexOf("replace clothes"), -1);
}
check("replace is rejected inside a scope",
      scope(FRIEREN + " {replace clothes}").errors.length, 1);

console.log("\n   the four spellings of the reset command are one command\n");

for (const verb of ["replace clothes", "replace all clothes", "remove clothes", "remove all clothes"]) {
    pipeline(`shirt, ${verb}, panties`, "solo, panties");
}

console.log("\n   a character reference is consumed once the canonical lands\n");

{
    const job = scope(".frieren, solo");
    check("the codename never reaches the output", job.prompt.indexOf(".frieren"), -1);
    check("the canonical tag does",  job.prompt.indexOf(FRIEREN) !== -1, true);
    // No charactersDB entry, so nothing expands and the typed form is the only
    // thing naming her. It has to survive.
    check("an unexpanded name survives",
          scope("kasumi \\(doa\\), 1girl").prompt.indexOf("kasumi \\(doa\\)") !== -1, true);
}

console.log("\n   the dotted form is derived, not typed\n");

{
    // Frieren's block lists `frieren` and no dotted line at all — `.frieren` has
    // to work anyway, or brandsDB2 doubles in size by hand.
    const index = sandbox.buildCharacterIndex();
    check("an unlisted dotted form resolves",
          index.names[".frieren"] && index.names[".frieren"].name, "frieren (sousou no frieren)");
    check("so does the bare one it came from",
          index.names["frieren"] && index.names["frieren"].name, "frieren (sousou no frieren)");
    // Fern WAS the withheld case — `fern` is a plant and typing it must not
    // summon her — and Noodle added the bare form to her brandsDB2 block once
    // Rule 2b's `"fern"` gave the plant its own escape hatch. That is a data
    // decision and it stands; this block moved to a case that is still true
    // rather than being deleted, because the MECHANISM it pins has not changed.
    check("a listed dotted form resolves",
          index.names[".fern"] && index.names[".fern"].name, "fern (sousou no frieren)");
    check("and its bare twin too, once deliberately added",
          index.names["fern"] && index.names["fern"].name, "fern (sousou no frieren)");
    // `.rosie` is the withheld case now: an ordinary English word, and one of
    // the 346 dotted forms with no bare twin that TODO §1.2 is a decision about.
    // Deriving only ever ADDS the dot, never strips it, which is what keeps a
    // block able to withhold the bare word at all.
    check("a bare word nobody added stays free",
          index.names["rosie"], undefined);
    check("while its dotted form still resolves",
          index.names[".rosie"] && index.names[".rosie"].name, "rosie (animal crossing)");
    check("and the derived form reaches charactersDB",
          textsOf(scope(".frieren, solo")).indexOf("white hair") !== -1, true);
}

console.log("\n   generic terms are brand keywords, never figures\n");

{
    // brandsDB2's "generic terms" section: studios, series, events, species
    // markers. They sort with the character tags and are counted as nobody.
    const index = sandbox.buildCharacterIndex();
    check("a generic term is a brand", index.names["activision"] && index.names["activision"].kind, "brand");
    check("and gets no dotted twin",   index.names[".activision"], undefined);
    check("a real character still counts",
          index.names["ada wong"] && index.names["ada wong"].kind, "character");

    const job = scope("activision, ada wong, 1girl");
    check("only the character is a subject", job.subjects.length, 1);
    check("and it is her",  job.subjects[0].id, "ada wong (resident evil)");
    check("the generic term still categorises",
          (job.records.find(r => r.text === "activision") || {}).categories.indexOf("bodyBrand") !== -1, true);
}
{
    // `pal (species)` cannot live in bodyKeywordDB — `species` is a placeholder
    // token there, so "pal (species)" silently expanded into 46 `pal <species>`
    // entries and the literal was never registered.
    check("pal (species) sorts as a brand, not an unknown",
          scope("blonde hair, pal (species)").prompt, "solo, pal \\(species\\), blonde hair");
    // Real booru pastes carry the underscore.
    check("the pasted underscore form normalizes",
          scope("pal_(species)").prompt, "solo, pal \\(species\\)");
    // MOVED 2026-09-06, on Noodle's instruction, and it is the reversal of what
    // this pair used to say. It read "the fix has to be targeted rather than a
    // blanket underscore rule"; the blanket rule is now the fix, because an
    // underscored tag matches no dictionary in this project and reaches the model
    // as a word it has no weights for. The COST is exactly this row: a LoRA whose
    // trigger word wants the underscored spelling can no longer be TYPED. Those
    // triggers are still safe where they live — cleaningDB replacement values are
    // injected in tag space, long after the strip. See tidySpacing.
    check("an ordinary underscore tag becomes spaced",
          scope("l3afan_pal").prompt, "solo, l3afan pal");
}

console.log("\n   charactersDB's `female` reaches the gate as `1girl`\n");

{
    const job = scope(".frieren, solo");
    check("aliased on the way in",  textsOf(job).indexOf("1girl") !== -1, true);
    check("and it is hers, not the image's", ownerOf(job, "1girl"), "frieren (sousou no frieren)");
    check("`female` is gone",       textsOf(job).indexOf("female"), -1);
}

console.log("\n== Rule 28 — a global tag reaches every figure ==\n");

// `ownerOf` finds the first record with the text, and a compound expansion
// leaves culled corpses behind — `Huge Equine` unpacks a base `penis` that the
// vague-tag rule then removes. These probes are about who owns the LIVE one.
const liveOwnerOf = (job, text) =>
      (job.records.find(r => r.culledBy == null && r.text === text) || {}).owner;

console.log("   an outfit written bare dresses the whole cast\n");

{
    // `default` is not Angelica's just because she was typed nearest to it. It
    // is a global tag, so both figures wear their own version of it. This used
    // to bind to the nearest character before the tag, which is v1's rule and
    // predates scopes existing.
    const job = scope("duo, nutmeg, angelica, default");
    const out = textsOf(job);
    check("the doe is in her own default",   out.indexOf("blue dress") !== -1, true);
    check("and it is hers",                  liveOwnerOf(job, "blue dress"), "sy-doe");
    check("angelica is in hers",             out.indexOf("yellow sweater") !== -1, true);
    check("and it is hers",                  liveOwnerOf(job, "yellow sweater"), "sy-angelica");
    check("the outfit name never reaches the model", out.indexOf("default"), -1);
}

console.log("   naming one figure is what a scope is for\n");

{
    const job = scope("duo, nutmeg, angelica {default}");
    const out = textsOf(job);
    check("the scoped figure is dressed", out.indexOf("yellow sweater") !== -1, true);
    check("and the other one is not",     out.indexOf("blue dress"), -1);
}

console.log("   a scope answers the outfit question, and global does not re-answer it\n");

{
    // One outfit per figure, so the more specific statement wins. `nude` counts
    // as an outfit here — it answers the same question, even though it is its
    // own tag rather than a name for a list.
    const job = scope("duo, nutmeg, angelica {nude}, default");
    const out = textsOf(job);
    check("the undressed figure wears the global outfit", out.indexOf("blue dress") !== -1, true);
    check("and it is hers",              liveOwnerOf(job, "blue dress"), "sy-doe");
    check("the scoped figure is not overruled", out.indexOf("yellow sweater"), -1);
    check("she kept what she said",      liveOwnerOf(job, "nude"), "sy-angelica");
}
{
    // The same thing the other way round, which is the half that needed the
    // global tag to be pulled out of the common block rather than expanded.
    const job = scope("duo, nutmeg {default}, angelica, nude");
    check("the scoped figure wears hers", liveOwnerOf(job, "blue dress"), "sy-doe");
    check("and the global one lands on the other figure alone",
          liveOwnerOf(job, "nude"), "sy-angelica");
}
{
    // Nobody overruled anything, so `nude` has no reason to leave the common
    // block — fanning out on spec would give the Rule 13 merge work to undo.
    const job = scope("duo, nutmeg, angelica, nude");
    check("an unopposed global outfit stays global", liveOwnerOf(job, "nude"), null);
}

console.log("   a global shortcut is read through each figure's own rules\n");

{
    // Before this, `penis` was unowned and every replacement rule was owned, so
    // the two never met and NEITHER character's rule fired — the bare shortcut
    // expanded globally instead and both figures got the generic version.
    const job = scope("duo, nutmeg, angelica, penis");
    const out = textsOf(job);
    check("the doe gets her equine",  out.indexOf("equine penis") !== -1, true);
    check("owned by her",             liveOwnerOf(job, "equine penis"), "sy-doe");
    check("angelica gets her canine", out.indexOf("canine penis") !== -1, true);
    check("owned by her",             liveOwnerOf(job, "canine penis"), "sy-angelica");
}

console.log("   a figure with no rule for it gets the bodypart default\n");

{
    // Frieren has no `penis` line. She used to keep the plain tag — the point
    // being that she did not lose it to somebody else's rule — and since the
    // bodypart defaults landed (REPLACE-OVERHAUL §A·1) she gets a described one
    // of her own instead. The thing being guarded is unchanged: the doe's rule
    // reaches the doe and nobody else.
    const job = scope("duo, nutmeg, .frieren, penis");
    const out = textsOf(job);
    check("the doe is still described", out.indexOf("equine penis") !== -1, true);
    check("owned by her",              liveOwnerOf(job, "equine penis"), "sy-doe");
    check("frieren gets the default",  out.indexOf("large penis") !== -1, true);
    check("owned by her",
          liveOwnerOf(job, "large penis"), "frieren (sousou no frieren)");
}

console.log("   one figure means nothing to fan out to\n");

{
    // Solo output must not move because of any of the above: there is nobody to
    // separate from, so the tag stays unowned and in the common block.
    const job = scope("nutmeg, penis");
    check("her rule still fires",     textsOf(job).indexOf("equine penis") !== -1, true);
    check("and nothing became owned", liveOwnerOf(job, "equine penis"), null);
}

console.log("\n   a typed gender focus is not a mistake to clean up\n");

{
    // Two of Noodle's desired outputs disagreed here, and `source` is what
    // reconciles them. CORPUS Phase 9 wants NO gender focus emitted for two
    // figures; TODO's replace case types `female focus, 2girls, duo, …` and
    // keeps it. Adding and removing had been one decision — they are two.
    //
    // The cull is a safety net against cleaning rules that emit a focus tag
    // inside a longer replacement chain. Those are `engine:` records. A typed one
    // is only wrong if the opposite gender is positively the answer.
    check("typed, two girls, kept",
          scope("female focus, 2girls, duo").prompt.indexOf("female focus") !== -1, true);
    check("not typed, not invented",
          scope("2girls, duo").prompt.indexOf("female focus"), -1);
    // The engine-injected case is still culled — that is CORPUS Phase 9's layout
    // B block above, where a cleaning rule emits one and it must not survive.
    //
    // No check here for "typed and CONTRADICTED", because defaultDB makes that
    // state hard to reach on purpose: `female focus; 1girl` and `male focus; 1boy`
    // mean a typed focus tag pulls in its own count, so `1boy, solo, female focus`
    // ends up holding both genders and Rule 8 declines to arbitrate. Worth knowing
    // before writing a rule that assumes the contradiction branch fires often.
}

console.log("\n   a replaced figure stops being in the picture\n");

{
    // `replace all character` culls her tags but used to leave her a SUBJECT, and
    // three things then went wrong at once: a bare `default` fans out to every
    // figure so it dressed the corpse, the count phase still saw two people, and
    // tags the domain filter had spared — `kuudere` is an expression, not a body
    // tag — stayed behind with nobody to belong to.
    const job = scope(".frieren, replace all character, .fern, default");
    check("her identity is gone",   job.prompt.indexOf("frieren \\(sousou"), -1);
    check("and her outfit with it", job.prompt.indexOf("white capelet"), -1);
    check("and her expression",     job.prompt.indexOf("kuudere"), -1);
    check("not a duo any more",     job.prompt.indexOf("duo"), -1);
    check("the survivor is solo",   job.prompt.indexOf("solo") !== -1, true);
    check("wearing her own outfit", job.prompt.indexOf("black cloak") !== -1, true);

    // The replacement should read exactly as if the first character were never
    // typed — that is the whole point of the command.
    check("identical to her alone",
          job.prompt, scope(".fern, default").prompt);
}

console.log("\n   a blank replacement is a purge\n");

{
    // `crown;` under one of Rosalina's alternate outfits says she is not wearing
    // one there. Phase 4 skipped any rule with an empty right-hand side, so those
    // six lines sat in charactersDB doing nothing and the linter called them
    // INERT. cleaningDB's rulesets have always read a blank replacement as a
    // purge; per-entry rules now agree.
    const worn = scope("rosalina, mario tennis, mini crown");
    check("the crown is taken away",  worn.prompt.indexOf("mini crown"), -1);
    check("the outfit still lands",   worn.prompt.indexOf("aqua visor cap") !== -1, true);

    // And it is scoped to the rule that asked — her default still has one.
    const base = scope("rosalina, default");
    check("default keeps its crown",  base.prompt.indexOf("mini crown") !== -1, true);
}

console.log("\n   a character is reachable by name, not only by codename\n");

{
    // charactersDB entries link to a typed name through brandsDB2 or aliasDB. If
    // neither spells the codename, only `.marioRosalina` works and `rosalina`
    // silently produces the identity tag with no character behind it — which
    // reads as "the outfit is broken", because the outfit has nobody to dress.
    const job = scope("rosalina, fire flower");
    check("she expands",        job.prompt.indexOf("blonde hair") !== -1, true);
    check("and wears it",       job.prompt.indexOf("red dress") !== -1, true);
    check("the dotted form too", scope(".marioRosalina").prompt.indexOf("blonde hair") !== -1, true);
}

console.log("\n   an outfit that names itself terminates\n");

{
    // Five outfits carry their own name as a tag in their own prompt —
    // `*mario tennis; mario tennis, …` and four different `*pajamas`. The trigger
    // record is CONSUMED before the injection runs, so the injected copy finds no
    // live original at the gate, lands, and is then read as an outfit name on the
    // next turn of the loop. That expanded again, injected again, and the compile
    // never returned. `pajamas` is both a common booru tag and an obvious outfit
    // name, so this was easy to hit and total when hit.
    //
    // A compile that hangs cannot be asserted on, so these tests exist to fail by
    // timing out rather than by comparing anything.
    const job = scope(".rwbyweiss, pajamas");
    check("it finishes at all",        job.prompt.length > 0, true);
    check("and the tag is still there", job.prompt.indexOf("pajamas") !== -1, true);
    check("with the outfit around it",  job.prompt.indexOf("light blue shirt") !== -1, true);

    const rosalina = scope(".marioRosalina, mario tennis");
    check("the two-word case too",      rosalina.prompt.indexOf("mario tennis") !== -1, true);
    check("and its outfit landed",      rosalina.prompt.indexOf("aqua visor cap") !== -1, true);
}

console.log("\n== `character*thing` and `(cosplay)` — borrowing without summoning ==\n");

console.log("   an outfit by name, on somebody who is not her\n");

{
    // v1 matched the stored `.frieren*default` as a whole string; v2 only ever
    // learned the bare `default` bound to a figure already in the shot, so the
    // qualified form fell through and reached the model verbatim.
    const job = scope("1boy, red hair, .frieren*default");
    const out = textsOf(job);
    check("the dress arrives",       out.indexOf("white dress") !== -1, true);
    check("and the boots",           out.indexOf("brown boots") !== -1, true);
    check("she does not",            out.indexOf("frieren (sousou no frieren)"), -1);
    check("nor does her hair",       out.indexOf("white hair"), -1);
    check("and no subject was made", job.subjects.length, 0);
    check("the reference is consumed", job.prompt.indexOf("*"), -1);
}
{
    check("undotted works",   textsOf(scope("1boy, frieren*default")).indexOf("white dress") !== -1, true);
    check("aliasDB works",    textsOf(scope("1boy, angelica*crimbus")).indexOf("santa outfit") !== -1, true);
    check("canonical tag works",
          textsOf(scope("1boy, sy-angelica*crimbus")).indexOf("santa outfit") !== -1, true);
    // A typo you can see beats one that silently drops half a prompt.
    check("an unknown outfit is left visible",
          scope("1boy, .frieren*swimsuit").prompt.indexOf(".frieren*swimsuit") !== -1, true);
}

console.log("   the same syntax takes a category\n");

{
    // Calling a character through a scope brings her bodyBrand tags with her.
    // This is how you take one part of her and nothing else.
    const job = scope("1boy, frieren*bodyHair");
    // `male focus` arrives from the focus step — solo plus a male tag — not from
    // her. TODO.md#3's desired output was written before #4 and did not have it.
    check("exactly her hair", job.prompt, "1boy, solo, male focus, white hair, twintails");
}

console.log("   `(cosplay)` takes the clothes AND says so\n");

{
    const job = scope("1boy, red hair, frieren (cosplay)");
    const out = textsOf(job);
    // The CANONICAL tag, never what was typed. Both `frieren (cosplay)` and
    // `frieren (sousou no frieren) (cosplay)` come out as the one below —
    // two near-identical tags for one costume would poison a training set.
    check("the canonical tag is emitted",
          out.indexOf("frieren (sousou no frieren) (cosplay)") !== -1, true);
    check("and not the short form typed", out.indexOf("frieren (cosplay)"), -1);
    check("cosplay follows it",      out.indexOf("cosplay") !== -1, true);
    check("her default arrives",     out.indexOf("white dress") !== -1, true);
    check("she does not",            out.indexOf("frieren (sousou no frieren)"), -1);
    // Sorted to the top of the clothing block: the tag IS the outfit, so it
    // reads best immediately before the clothes it brought.
    const flat = job.prompt;
    check("and it leads the clothes",
          flat.indexOf("cosplay") < flat.indexOf("white dress"), true);
}
{
    check("the fully qualified form resolves the same character",
          textsOf(scope("1boy, .frieren \\(sousou no frieren\\) \\(cosplay\\)"))
              .indexOf("white dress") !== -1, true);
    check("and drops the reference dot",
          scope("1boy, .frieren \\(sousou no frieren\\) \\(cosplay\\)").prompt.indexOf(".frieren"), -1);
    check("an unknown name is left alone",
          scope("1boy, notacharacter (cosplay)").prompt.indexOf("notacharacter") !== -1, true);
}

console.log("\n== Phase 4 — count tags ==\n");

console.log("   a contradicted solo is removed and the count corrected\n");

{
    const job = scope(FRIEREN + ", " + FERN + ", solo, duo");
    check("solo is culled",   textsOf(job).indexOf("solo"), -1);
    check("and traced",       job.trace.culled.some(c => c.text === "solo"), true);
    check("2girls added",     textsOf(job).indexOf("2girls") !== -1, true);
    check("duo was already there, not doubled",
          textsOf(job).filter(t => t === "duo").length, 1);
}
{
    const job = scope(FRIEREN + ", " + FERN);
    check("the group word is supplied", textsOf(job).indexOf("duo") !== -1, true);
    check("both counts are unowned",    ownerOf(job, "2girls"), null);
}

console.log("\n   `.syrup` is a stem naming a fur/fleshy PAIR\n");

{
    // The stem is not an entry. It resolves to `.fur` by default and `.fleshy`
    // when the prompt TYPES `not furry` — which is why this runs in Phase 1: a
    // fleshy entry's own prompt contains `not furry`, and expansion is Phase 3,
    // so a character cannot vote on which form of herself to be.
    const fur = scope(".syrupcarp, solo");
    check("the bare stem defaults to fur",
          fur.prompt.indexOf("sy-carpenter") !== -1, true);
    check("and is not the fleshy one",
          fur.prompt.indexOf("fl-carpenter"), -1);

    const flesh = scope(".syrupcarp, not furry, solo");
    check("`not furry` selects the fleshy form",
          flesh.prompt.indexOf("fl-carpenter") !== -1, true);
    check("and not the furry one",
          flesh.prompt.indexOf("sy-carpenter"), -1);

    // A universal character has no pair, so the stem IS the entry. This is the
    // case the old `.fur`->`.syrup` string swap could not express at all.
    const universal = scope(".syrupYu, solo");
    check("a stem with no pair resolves to itself",
          universal.prompt.indexOf("cute boy") !== -1, true);
    check("and did not become an unknown tag",
          universal.prompt.toLowerCase().indexOf(".syrup"), -1);

    // Asking for a human who has no human form must not silently hand back the
    // furry one without saying so.
    const orphan = scope(".syrupDeity, not furry, solo");
    check("a missing fleshy form is reported",
          orphan.trace.unmatched.some(u => String(u.rule).indexOf("no fleshy form") !== -1), true);
    check("and it still compiles to the fur form",
          orphan.prompt.length > 0, true);

    // The swap has to happen before ANY lookup, or an outfit keyed on the
    // codename silently misses.
    const outfit = scope(".syrupmayor*crimbus, solo");
    check("an outfit on a stem still resolves",
          outfit.prompt.indexOf("santa outfit") !== -1, true);
}

console.log("\n   male and female resolve against the FIGURE, not the image\n");

{
    // charactersDB stores one word per character because that is the convenient
    // thing to write. It resolves to four different tags.
    //
    // These used to say `.syrupcarp` and meant the human. Since the charactersDB
    // reorganisation `.syrup` is a STEM naming the fur/fleshy PAIR, so the human
    // is `.fleshycarp` and the bare stem defaults to fur. Named explicitly here
    // because this block is about male/female resolving against the FIGURE — the
    // stem's own behaviour is tested in its own section below.
    const carp = scope(".fleshycarp, solo");
    check("a human resolves to 1boy",   textsOf(carp).indexOf("1boy") !== -1, true);
    check("and `male` is gone",         textsOf(carp).indexOf("male"), -1);
    const angelica = scope(".angelica, solo");
    check("an anthro stays furry",      textsOf(angelica).indexOf("furry female") !== -1, true);
    // Her own `human, not furry` beats an image-level `anthro`. Without that,
    // one furry in the scene would turn every human in it furry.
    const mixed = scope(".fleshycarp, anthro, duo");
    check("her own marker wins",        textsOf(mixed).indexOf("1boy") !== -1, true);
}

console.log("\n   a count supersedes a LOOSE singular, never an owned one\n");

{
    check("a loose 1girl loses to 2girls",
          textsOf(scope("1girl, 2girls, blonde hair")).indexOf("1girl"), -1);
    // `duo` is not a girl-count, and `1boy, 1girl, duo` is an ordinary pair.
    check("duo supersedes nothing",
          textsOf(scope("1boy, 1girl, duo")).filter(t => t === "1girl").length, 1);
    // Each figure keeps her own. This is what v1's `2girls: 1girl` purge cannot
    // express, and why that rule is superseded rather than reused.
    const duo = scope(".frieren, .fern");
    const lines = duo.prompt.split("\n");
    check("frieren keeps hers", lines[1].indexOf("1girl") !== -1, true);
    check("fern keeps hers",    lines[2].indexOf("1girl") !== -1, true);
}

console.log("\n   compound shortcuts — the table must agree with v1's function\n");

{
    // v2 precomputes all 7,140 combinations because v1 rebuilds them on every
    // keyword, at ~22ms a call. Same names, same expansions, same first-match-
    // wins order — checked against v1 directly so a drift fails here rather than
    // quietly changing prompts. Sampled, not swept: a full sweep is 7,140 × 22ms.
    const index = sandbox.buildCompoundIndex();
    const names = Object.keys(index);
    check("the table is populated", names.length > 5000, true);
    let mismatches = 0;
    for (let i = 0; i < names.length; i += Math.floor(names.length / 25)) {
        if (sandbox.replaceGenitalShortcuts(names[i]) !== index[names[i]]) { mismatches++; }
    }
    check("and agrees with v1 across a spread of it", mismatches, 0);
    // Case is load-bearing: v1 matches a capitalised first letter.
    check("Large Foreskin unpacks",
          sandbox.expandCompound("Large Foreskin"), "humanoid penis, foreskin, large penis, penis");
    check("the S./L./H./G. prefixes work too",
          sandbox.expandCompound("L. Foreskin"), "humanoid penis, foreskin, large penis, penis");
    check("but lowercase is a real tag, not a shortcut",
          sandbox.expandCompound("large foreskin"), null);
    check("and an ordinary tag is left alone",
          sandbox.expandCompound("blonde hair"), null);
}

console.log("\n   an entry's replacement rules run against the SETTLED prompt\n");

{
    // frieren carries `staff; gold staff`, and the staff was typed by hand long
    // after she expanded.
    const job = scope("frieren, staff");
    check("her staff turns to gold", job.prompt.indexOf("gold staff") !== -1, true);
    check("the plain one is gone",   /(^|, )staff/.test(job.prompt), false);
}
{
    // A replacement is a LIST and any entry in it may be a compound shortcut —
    // 403 of charactersDB's 683 replacement lines carry one. These rules run in
    // Phase 4, long after Phase 3's unpacking, so they unpack their own.
    const job = scope(".syrupcarp, penis, solo");
    check("the compound in her replacement unpacks",
          job.prompt.indexOf("humanoid penis") !== -1, true);
    check("including the size it implies",
          job.prompt.indexOf("large penis") !== -1, true);
    check("and the shortcut name never reaches the model",
          job.prompt.indexOf("Large Glans"), -1);
}

console.log("\n   contextual defaults are judged per subject\n");

{
    // CORPUS Phase 4 Probe C. Each scope is read against its own tags plus the
    // global ones, so the heart is one figure's and the smile is the other's.
    const job = scope("2girls, duo, {<3}, {Happy}, close up");
    const lines = job.prompt.split("\n");
    check("three blocks",        lines.length, 3);
    check("one gets the heart",  lines[1].indexOf("heart") !== -1, true);
    check("the other the smile", lines[2].indexOf("smile") !== -1, true);
    check("and not the reverse", lines[1].indexOf("smile"), -1);
}
{
    // Rule 15 — no phase loops to a fixpoint. Defaults read a frozen snapshot,
    // or `Happy` reaches `Blush` reaches `sweat, steaming body, horny, pent-up`.
    const job = scope("1girl, Happy");
    check("no cascade", textsOf(job).indexOf("steaming body"), -1);
    check("but the default itself fired", textsOf(job).indexOf("smile") !== -1, true);
}

console.log("\n   a bodytype is not a gender\n");

{
    // The bodytype shortcut lines sit ABOVE the male tag lines in defaultDB, so
    // `Shortstack; large breasts` and `Shortstack; 1girl` landed first and won
    // exclusivity over `femboy; flat chest` further down the file. A femboy came
    // out as `1girl, 1boy, solo focus, ... large breasts`.
    //
    // The fix is the exception lists, not the ordering — and it must name tags
    // that EXIST when defaults run. `male focus` was already an exception on
    // several of these lines and never saved them, because emitFocusTags does not
    // run until the end of Phase 4.
    // ⚠ `and only one of him` is DELIBERATELY RED as of 2026-08-13, pending a
    // decision — TODO §0.1 and §0.4. It is not an unnoticed regression.
    //
    // Requirement matching is CASE-SENSITIVE, so `Femboy; 1boy` and `femboy`
    // are different vocabularies. The only lowercase path to a count tag is
    // `tagme, femboy; 1boy`, and `tagme` has to be typed. Whether lowercase
    // should get its own ungated rule, or whether the count system should
    // derive it instead, is Noodle's call. Do not "fix" this by changing a
    // rule's case — that silently moves it between vocabularies.
    const job = scope("femboy, red hair, shortstack");
    check("she is a he",            job.prompt.indexOf("1girl"), -1);
    check("and only one of him",    job.prompt.indexOf("1boy") !== -1, true);
    check("flat, not large",        job.prompt.indexOf("large breasts"), -1);
    check("flat chest still lands", job.prompt.indexOf("flat chest") !== -1, true);
    check("solo, not solo focus",   job.prompt.indexOf("solo focus"), -1);
    check("the bodytype survives",  job.prompt.indexOf("shortstack") !== -1, true);
    check("and so does its shape",  job.prompt.indexOf("wide hips") !== -1, true);
}
{
    // The same hole was in milf and plump. Checked together because fixing one
    // line and not its neighbours is how this came back.
    check("a femboy milf is flat",  scope("femboy, milf").prompt.indexOf("huge breasts"), -1);
    check("a femboy plump is flat", scope("femboy, plump").prompt.indexOf("huge breasts"), -1);
    check("a cute boy too",         scope("cute boy, shortstack").prompt.indexOf("large breasts"), -1);
}
{
    // And the female reading is untouched — the exceptions must not have
    // disarmed the rule for everybody.
    check("a shortstack is still large", scope("shortstack, red hair").prompt.indexOf("large breasts") !== -1, true);
    check("a milf is still huge",        scope("milf, blue hair").prompt.indexOf("huge breasts") !== -1, true);
    // ⚠ Also DELIBERATELY RED, same cause and same decision — see above.
    check("and still a girl",            scope("shortstack, red hair").prompt.indexOf("1girl") !== -1, true);
}

console.log("\n   rules are owner-aware, or they reach across figures\n");

{
    // `no breasts: large breasts` fired on Frieren's `flat chest` and deleted
    // Fern's chest. With one figure the two readings are identical, which is why
    // this could not exist before ownership did.
    const job = scope(".frieren, .fern");
    check("fern keeps her chest", job.prompt.indexOf("large breasts") !== -1, true);
    check("frieren keeps hers",   job.prompt.indexOf("flat chest") !== -1, true);
}

console.log("\n   a solo shot is left alone\n");

check("no group word on a solo shot", textsOf(scope(FRIEREN + ", solo")).indexOf("duo"), -1);
check("no count invented for a landscape",
      pipeline("bamboo, outdoors", "solo, bamboo, outdoors") && true, true);

console.log("\n   a partner tag counts figures without naming them\n");

// Two figures are implied, but nobody said who — inventing `2girls` here would
// be the engine inventing a figure.
{
    const job = scope("anthro, human on feral");
    check("group word added",  textsOf(job).indexOf("duo") !== -1, true);
    check("no gendered count", textsOf(job).indexOf("2girls"), -1);
}

console.log("\n== focus tags ==\n");

// Three questions wearing one word: which gender the picture is about, whether
// a feral is the subject, and whether the count tag is counting everybody or
// only the figures that matter. Decided in the engine, because a contextual
// default can see neither the settled count nor the settled genders.

{
    check("solo plus a male tag",   scope("1boy").prompt, "1boy, solo, male focus");
    check("solo plus a female tag", scope("1girl").prompt, "1girl, female focus, solo");
}
{
    // A modifier says there are extra bodies and they are not the point, so the
    // count becomes a statement about the focus. It must NOT also make the shot
    // a duo — `mostly offscreen futa` is exactly the figure not being counted.
    const job = scope("1boy, offscreen, futa partner");
    check("the count is a focus count", job.prompt.indexOf("solo focus") !== -1, true);
    check("and not a duo",              job.prompt.indexOf("duo"), -1);
    check("gender focus still lands",   job.prompt.indexOf("male focus") !== -1, true);
}
{
    // CHANGED 2026-08-09. This used to assert that a typed `duo` became
    // `duo focus`. Typed count words are now law — the engine derives no count
    // word and no focus word when you wrote one yourself — so `duo` stays `duo`.
    // The conversion still happens for a count the ENGINE derived; see the block
    // below, which is the same shot without the hand-written `duo`.
    const job = scope("2girls, pov hands, duo");
    check("a typed duo stays duo",  job.prompt.indexOf("duo") !== -1, true);
    check("and is not converted",   job.prompt.indexOf("duo focus"), -1);
    // Two figures means the picture is about both, so the engine does not ADD a
    // gender focus — CORPUS Phase 9's desired output has none either. It will no
    // longer take one AWAY if you typed it, though; see the pair of checks under
    // "a typed gender focus is not a mistake to clean up".
    check("and none is added",     job.prompt.indexOf("female focus"), -1);
}
{
    // The derived path, unchanged: nobody typed a count word, so the engine
    // works one out and the modifier turns it into a focus count.
    const job = scope("2girls, pov hands");
    check("a derived duo still becomes duo focus", job.prompt.indexOf("duo focus") !== -1, true);
}
{
    // The shape the override exists for. `duo, solo focus` — two figures, one of
    // them mostly offscreen — is what the training data uses and what the engine
    // could not express: deriving from the count gives `duo focus`, same level,
    // every time. Typing both words is how you get it until TODO §0 lands.
    const job = scope("frieren, fern, mostly offscreen male, duo, solo focus");
    check("the typed count survives", job.prompt.indexOf("duo") !== -1, true);
    check("so does the typed focus",  job.prompt.indexOf("solo focus") !== -1, true);
    check("and neither became the other", job.prompt.indexOf("duo focus"), -1);
}
{
    // A typed `solo` is no longer overruled by the figure count. The cull that
    // used to do it was justified by the insertion gate reading job.solo, and
    // that consumer retired on 2026-08-06.
    const job = scope("frieren, fern, solo");
    check("a typed solo is not culled", job.prompt.indexOf("solo") !== -1, true);
    check("and no duo is invented",     job.prompt.indexOf("duo"), -1);
}
{
    // Not exclusive with the gender focus: both are true at once.
    const job = scope("1girl, feral");
    check("a feral subject",     job.prompt.indexOf("animal focus") !== -1, true);
    check("is still female too", job.prompt.indexOf("female focus") !== -1, true);
}
{
    // Rule 8 — ambiguity between two figures is never arbitrated. Nothing here
    // says which one the picture is about, so it says nothing.
    const job = scope("1girl, 1boy");
    check("no gender focus is guessed", /male focus/.test(job.prompt), false);
}

console.log("\n== Phase 9 — sort, group, render ==\n");

console.log("   an uncategorised tag is last in the COMMON block, not a line of its own\n");

{
    // It used to get its own line after every group, and a fourth line in a
    // two-figure shot reads as a third figure. Most of what lands here is not a
    // foreign word at all — it is an ordinary booru tag the dictionaries have
    // not categorised yet, plus every booster a rule injected.
    const job = scope(".frieren, .fern, 2girls, taitara");
    const lines = job.prompt.split("\n");
    check("two figures, two groups, one common block", lines.length, 3);
    check("and the unknown tag rides the common block",
          lines[0].indexOf("taitara") !== -1, true);
    check("it is still last in it", /taitara,?$/.test(lines[0].trim()), true);
}

console.log("   a reinforcing rule cannot add a tag that is already there\n");

{
    // Several rules reinforce with the same tag. They spliced past the gate, so
    // `legs spread` arrived five times and `bowlegged pose` three — and the
    // copies did not all carry the same categories, so the render split them
    // across two lines and the duplicate became visible.
    const job = scope("2girls, duo, .frieren, .fern, bowlegged, squatting");
    const count = (t) => job.prompt.split(t).length - 1;
    check("bowlegged pose appears once", count("bowlegged pose"), 1);
    check("legs spread appears once",    count("legs spread"), 1);
    const live = job.records.filter(r => r.culledBy == null && r.text === "legs spread");
    check("and there is only one record of it", live.length, 1);
}

console.log("   v1's category ladder, with count tags lifted to the front\n");

// Counts, then the figure, then head-to-toe, then clothes, then scene, then
// background, then whatever has no category at all.
// `female focus`, `solo` and `medium breasts` are contextual defaults, and they
// are in every expectation below for that reason. They are the pass working.
pipeline("bamboo, blonde hair, shirt, " + FRIEREN.replace(/\\/g, "") + ", solo",
         "1girl, solo, female focus, " + FRIEREN + ", pointy ears, blonde hair, twintails, green eyes, "
         + "flat chest, shirt, kuudere, bamboo");
check("unknown tags go last",
      scope("taitara, blonde hair, 1girl").prompt,
      "1girl, female focus, solo, blonde hair, taitara");
check("emphasis moves a tag to the front",
      scope("blonde hair, ((detailed)), 1girl").prompt,
      "((detailed)), 1girl, female focus, solo, blonde hair");
check("de-emphasis does not move it to the back",
      scope("(blonde hair:0.8), 1girl").prompt,
      "1girl, female focus, solo, (blonde hair:0.8)");

console.log("\n   nosort is honoured, and never emitted\n");

{
    const job = scope("bamboo, blonde hair, 1girl, nosort");
    check("input order kept", job.prompt, "bamboo, blonde hair, 1girl, female focus, solo");
}

console.log("\n   one subject means one block; two means groups\n");

{
    const solo = scope("((detailed)), .frieren, solo, blonde hair");
    check("a solo shot is one line", solo.prompt.indexOf("\n"), -1);
    const duo = scope("((detailed)), .frieren, .fern, blonde hair");
    const lines = duo.prompt.split("\n");
    // No `female focus` any more, and that is CORPUS's Phase 9 desired output
    // exactly — it never had one. Two figures means the picture is about both,
    // so a gender focus says nothing; the focus step only emits one when there
    // is a single figure to be focused on.
    check("shared first, scoped after — layout B",
          lines[0], "((detailed)), 2girls, duo, blonde hair,");
    check("one line per subject",   lines.length, 3);
    check("frieren leads her own",  lines[1].indexOf(FRIEREN), 0);
    check("fern leads hers",        lines[2].indexOf(FERN), 0);
    check("1girl is per-figure, not merged into the common block",
          lines[1].indexOf("1girl") !== -1 && lines[2].indexOf("1girl") !== -1, true);
    // ASSERTED, not merely described. The comment above was here while the
    // engine emitted one into Frieren's group anyway, and nothing failed
    // because nothing looked. Contextual defaults add `female focus` once per
    // SUBJECT since Rule 13's 2026-08-09 revision, and the cull that removes it
    // was written the day before against a map holding one record per text — so
    // Fern's copy was culled and Frieren's rendered.
    check("no engine-added gender focus in a two-figure shot",
          duo.prompt.indexOf("female focus"), -1);
    check("and none hiding in either subject's group",
          lines[1].indexOf("focus") === -1 && lines[2].indexOf("focus") === -1, true);
}

console.log("\n   a cull reaches EVERY copy of a per-owner duplicate\n");

{
    // The general form of the bug above, and the thing to reach for when a
    // step written before 2026-08-09 looks up `the` record with a given text.
    // Three subjects so that a two-of-three partial cannot pass by accident.
    const job = scope(".frieren, .fern, .angelica, 3girls, trio");
    const stillThere = job.records.filter(
        r => r.text.toLowerCase() === "female focus" && r.culledBy == null);
    check("every copy culled, not just one", stillThere.length, 0);
    check("and the render agrees", job.prompt.indexOf("female focus"), -1);
}

console.log("\n   the same tag under two owners merges into the common block\n");

{
    // Both are elves, so both carry `pointy ears`. Rule 13: one record survives
    // the render and it renders shared.
    const job = scope(".frieren {pointy ears}, .fern {pointy ears}, 2girls, duo");
    const lines = job.prompt.split("\n");
    check("merged upward", lines[0].indexOf("pointy ears") !== -1, true);
    check("emitted exactly once",
          (job.prompt.match(/pointy ears/g) || []).length, 1);
}

console.log("\n   but SOME of the subjects sharing it is not enough\n");

{
    // The case two figures could never show, because with two "shared by two"
    // and "shared by all" are the same sentence. Three elves minus one: the
    // third has no pointy ears, so hoisting them into the common block would
    // give her a pair anyway — the block reaches everyone.
    const job = scope(".frieren {pointy ears}, .fern {pointy ears}, .stark {round ears}, 3girls");
    const lines = job.prompt.split("\n");
    check("not hoisted", lines[0].indexOf("pointy ears"), -1);
    check("stays with both owners that have it",
          (job.prompt.match(/pointy ears/g) || []).length, 2);
    check("and the third subject keeps her own", job.prompt.indexOf("round ears") !== -1, true);
}

{
    // ...and when all three do share it, it still merges.
    const job = scope(".frieren {pointy ears}, .fern {pointy ears}, .stark {pointy ears}, 3girls");
    check("merged upward", job.prompt.split("\n")[0].indexOf("pointy ears") !== -1, true);
    check("emitted exactly once", (job.prompt.match(/pointy ears/g) || []).length, 1);
}

console.log("\n   a common tag is not repeated inside a group\n");

{
    // Phase 1 could not collapse these: an unowned tag and a scoped one are a
    // real distinction until Phase 9 decides where each renders.
    const job = scope("pointy ears, .frieren {pointy ears}, .fern, 2girls");
    check("emitted once", (job.prompt.match(/pointy ears/g) || []).length, 1);
    check("and it is the common one", job.prompt.split("\n")[0].indexOf("pointy ears") !== -1, true);
}

console.log("\n   lora is re-attached at the very end\n");

check("after the unknown tail",
      scope("<lora:leafan:1>, taitara, 1girl").prompt,
      "1girl, female focus, solo, taitara, <lora:leafan:1>");

console.log("\n== Phase 5 — culling ==\n");

console.log("   the ladder is derived from the category name, not a parallel file\n");

{
    const attr = (n) => sandbox.deriveCategoryAttributes(n);
    check("bodyChest",              attr("bodyChest"),              { domain: "body", part: "chest", layer: "" });
    check("clothesUpperwearOuter",  attr("clothesUpperwearOuter"),  { domain: "clothes", part: "chest", layer: "outer" });
    check("sceneChest shares the rung", attr("sceneChest").part,    "chest");
    check("clothesLegwearLower is calves", attr("clothesLegwearLower").part, "calves");
    check("weapons is a prop",      attr("weapons"),                { domain: "prop", part: "weapons", layer: "" });
    // Race and brand sit off the ladder, so no range can ever reach them. A
    // succubus is still a demon when only her fingernails are visible.
    check("bodyRace is whole",      attr("bodyRace").part,          "whole");
    check("bodyBrand is whole",     attr("bodyBrand").part,         "whole");
}

console.log("\n   a framing cull is a range over that ladder\n");

{
    const cut = (command) => sandbox.resolveCullCommand(command).categories;
    const cuts = (command, category) => cut(command).indexOf(category) !== -1;
    check("head shot takes the chest",      cuts("head shot", "bodyChest"), true);
    check("and the shirt over it",          cuts("head shot", "clothesUpperwearOuter"), true);
    check("and the scene twin",             cuts("head shot", "sceneChest"), true);
    check("and the sword",                  cuts("head shot", "weapons"), true);
    check("but never the character's race", cuts("head shot", "bodyRace"), false);
    check("nor her franchise",              cuts("head shot", "bodyBrand"), false);
    check("cowboy shot keeps the chest",    cuts("cowboy shot", "bodyChest"), false);
    check("and takes the calves",           cuts("cowboy shot", "clothesLegwearLower"), true);
    // Noodle 2026-08-05: these two used to be identical; now they differ.
    check("feet out of frame spares calves", cuts("feet out of frame", "clothesLegwearLower"), false);
}

console.log("\n   layer is what makes bottomless expressible\n");

{
    const cuts = (c, k) => sandbox.resolveCullCommand(c).categories.indexOf(k) !== -1;
    check("bottomless takes underwear",  cuts("bottomless", "clothesLowerwearUnder"), true);
    check("but leaves the skirt",        cuts("bottomless", "clothesLowerwearOuter"), false);
    check("topless leaves pasties",      cuts("topless", "clothesNipplewear"), false);
    check("nude takes them",             cuts("nude", "clothesNipplewear"), true);
    check("nude leaves the legwear",     cuts("nude", "clothesLegwearUpper"), false);
}

console.log("\n   culls fire, and their trigger survives\n");

pipeline("blonde hair, large breasts, head shot", "solo, blonde hair, head shot");
check("the trigger is immune to itself",
      scope("large breasts, head shot").prompt.indexOf("head shot") !== -1, true);

console.log("\n   a blocker disarms the class, it does not protect the tag\n");

// CORPUS Phase 5 Probe B. `multiple views` means nothing is really out of frame.
pipeline("blue tail, head shot, multiple views", "solo, blue tail, head shot, multiple views");
check("and the decline is traced",
      scope("blue tail, head shot, multiple views").trace.declined.length >= 1, true);
// Coverage is a different class, so the same blocker does not touch it.
check("multiple views does not disarm nude",
      scope("shirt, nude, multiple views").prompt.indexOf("shirt"), -1);

console.log("\n   keep, at the specificity written\n");

// CORPUS Phase 5 Probe D.
pipeline("blue tail, keep tail, head shot", "solo, blue tail, head shot");
check("keep is consumed",   scope("blue tail, keep tail, head shot").prompt.indexOf("keep"), -1);

console.log("\n   naming a category in a scope is an implicit keep\n");

// CORPUS Phase 5 Probe D2.
{
    const job = scope(".angelica {bodyTail}, head shot");
    check("her tail survives a head shot", job.prompt.indexOf("blue tail") !== -1, true);
    check("and the tip of it",             job.prompt.indexOf("black tail tip") !== -1, true);
    check("the marker is a command, not a tag", job.prompt.indexOf("bodyTail"), -1);
}

console.log("\n   a scoped cull trims one figure — the thing v1 cannot do\n");

// CORPUS Phase 5 Probe C.
{
    const job = scope("2girls, duo, .frieren {head only}, .fern");
    const lines = job.prompt.split("\n");
    const frieren = lines.find(l => l.indexOf(FRIEREN) !== -1);
    const fern    = lines.find(l => l.indexOf(FERN) !== -1);
    check("frieren keeps her head",   frieren.indexOf("pointy ears") !== -1, true);
    check("and loses her chest",      frieren.indexOf("flat chest"), -1);
    check("fern is untouched",        fern.indexOf("large breasts") !== -1, true);
}

console.log("\n   ! removes at the specificity written\n");

// CORPUS Phase 5 Probe E. The bug this pins: `!white hair` once deleted
// `green eyes`, because a careless tail check made any two equal-length tags match.
{
    const job = scope("frieren, !white hair");
    check("the named tag goes",   job.prompt.indexOf("white hair"), -1);
    check("her eyes stay",        job.prompt.indexOf("green eyes") !== -1, true);
    check("her chest stays",      job.prompt.indexOf("flat chest") !== -1, true);
    check("the command is eaten", job.prompt.indexOf("!"), -1);
}
{
    // A vague tag takes its coloured variants with it; a specific one does not.
    const vague = scope("blonde hair, long hair, hair ornament, !hair");
    check("!hair takes blonde hair", vague.prompt.indexOf("blonde hair"), -1);
    check("and long hair",           vague.prompt.indexOf("long hair"), -1);
    check("but not hair ornament",   vague.prompt.indexOf("hair ornament") !== -1, true);
    check("an unmatched ! is traced",
          scope("1girl, !xyzzy").trace.unmatched.length, 1);
}

console.log("\n== Phase 6 — unculling ==\n");

console.log("   see-through fabric restores nipple descriptors\n");

{
    // The pair is the probe; either alone proves nothing. `covered nipples` says
    // the nipple is under the fabric, not that it cannot be seen — so if the
    // fabric is see-through, its shape and colour come back.
    const hidden = scope("1girl, covered nipples, puffy nipples, pink nipples");
    check("covered, so the descriptors go", hidden.prompt.indexOf("puffy nipples"), -1);
    check("and the cover itself stays",     hidden.prompt.indexOf("covered nipples") !== -1, true);

    const shown = scope("1girl, covered nipples, puffy nipples, pink nipples, see-through shirt");
    check("see-through, so they come back", shown.prompt.indexOf("puffy nipples") !== -1, true);
    check("both of them",                   shown.prompt.indexOf("pink nipples") !== -1, true);
}

console.log("\n   a held object is not a second figure\n");

{
    // `scenePartner` has 1869 members and is scene-INTERACTION, not
    // partner-presence. `holding rod` used to flip a solo fishing shot to duo,
    // which hit almost every prompt with a held object.
    const job = scope(".gloopie, sitting, fishing, holding rod, sleepy, outdoors");
    check("still solo",              job.solo, true);
    check("and no group count tag",  job.prompt.indexOf("duo"), -1);
    check("the rod is still there",  job.prompt.indexOf("holding rod") !== -1, true);
}
{
    // The things that DO say how many people are in the picture still do.
    check("a count tag still counts", scope("1girl, holding rod, 2girls").solo, false);
    check("two subjects still count", scope(".frieren, .fern, holding rod").solo, false);
    check("a real partner tag still counts", scope("1girl, human on anthro").solo, false);
}

console.log("   only a FUZZY cull can be reversed\n");

{
    // `areola slip` is a state and reversible; `head shot` is framing and final.
    // That pair is the whole of Rule 16.
    const state  = scope("1girl, puffy nipples, areola slip, dress");
    check("a state cull marks its victims fuzzy",
          (state.records.find(r => r.culledBy === "areola slip") || {}).strength, "fuzzy");
    const framing = scope("1girl, large breasts, head shot");
    check("a framing cull marks them hard",
          (framing.records.find(r => r.culledBy === "head shot") || {}).strength, "hard");
}

console.log("\n   areola slip — Noodle's three conditions\n");

// `areola slip` means the areola is visible and the NIPPLE is not: covered by
// clothing, by a hand, by a censor bar. It is not nudity — this is a dress the
// areolae are peeking out of.
{
    const worn = scope("1girl, puffy nipples, areola slip, dress");
    check("the nipple descriptors go",   worn.prompt.indexOf("puffy nipples"), -1);
    check("the slip itself stays",       worn.prompt.indexOf("areola slip") !== -1, true);
    check("and so does the dress",       worn.prompt.indexOf("dress") !== -1, true);
    check("it does not read as nude",    sandbox.isPresent("naked", worn.records, worn), false);
}
{
    // 2. Through see-through fabric the nipple is visible too, so they come back.
    const sheer = scope("1girl, puffy nipples, areola slip, see-through dress");
    check("see-through restores them",   sheer.prompt.indexOf("puffy nipples") !== -1, true);
}
{
    // 0. Topless contradicts the slip — the whole breast is out.
    const topless = scope("1girl, puffy nipples, areola slip, topless");
    check("the slip is culled",          topless.prompt.indexOf("areola slip"), -1);
    check("so its own cull never fires", topless.prompt.indexOf("puffy nipples") !== -1, true);
}
{
    // 1. ...unless she is covering herself, in which case it is plausible again.
    const covering = scope("1girl, puffy nipples, areola slip, topless, covering breasts");
    check("the slip is spared",          covering.prompt.indexOf("areola slip") !== -1, true);
    check("and its cull fires again",    covering.prompt.indexOf("puffy nipples"), -1);
}

console.log("\n   an uncull reads its evidence from the right figure\n");

{
    // One figure's see-through top must not restore the other's nipples.
    const job = scope("2girls, duo, {puffy nipples, areola slip, dress}, {areola slip, see-through dress}");
    const lines = job.prompt.split("\n");
    check("still culled for the one in a dress",
          lines.some(l => l.indexOf("dress") !== -1 && l.indexOf("see-through") === -1
                          && l.indexOf("puffy nipples") !== -1), false);
}

console.log("\n== Phase 7 — negative ==\n");

console.log("   negativeDB — the grammar, not the data\n");

{
    // The dictionary itself is Noodle's and lives on another machine; what is
    // tested here is that the RECEIVING SHAPE works, so pasting it in needs no
    // code change.
    const parsed = sandbox.cleanedNegativeArray;
    check("negativeDB parsed",         Array.isArray(parsed) && parsed.length > 0, true);
    check("and reported no bad lines", sandbox.negativeArrayErrors.length, 0);
    check("shaped like cleanedDefaultArray",
          Object.keys(parsed[0]).sort(), ["additions", "exceptions", "requirements"]);
    // v1 reads a pair list, generated from the same source rather than a second
    // copy that can drift.
    check("v1's view is generated",    sandbox.basicNegativeArray.length, parsed.length);

    // A line still fires.
    check("a contextual negative lands",
          scope("1girl, squirting").negative.indexOf("blue fluid") !== -1, true);
    // ...and is dropped when the prompt asks for the thing.
    check("unless the prompt wants it",
          scope("1girl, squirting, blue fluid").negative.indexOf("blue fluid, "), -1);
}
{
    // Exceptions are the thing basicNegativeArray could not express at all.
    // Tested with a SYNTHETIC line rather than a real one: the dictionary is
    // Noodle's and lives on another machine, so a probe that depends on its
    // contents would be testing data that is about to be replaced wholesale.
    const real = sandbox.cleanedNegativeArray.slice();
    const probe = (input) => {
        const job = sandbox.buildPrompt(input, "", {});
        return job.negative;
    };
    try {
        sandbox.cleanedNegativeArray.length = 0;
        sandbox.cleanedNegativeArray.push({
            requirements: ["1girl"],
            additions: ["PROBE-NEGATIVE"],
            exceptions: ["blonde hair"]
        });
        check("a line with an unmet exception fires",
              probe("1girl").indexOf("PROBE-NEGATIVE") !== -1, true);
        check("and a met exception cancels it",
              probe("1girl, blonde hair").indexOf("PROBE-NEGATIVE"), -1);
    } finally {
        // Restore, or every later probe in this file runs against the stub.
        sandbox.cleanedNegativeArray.length = 0;
        for (const entry of real) { sandbox.cleanedNegativeArray.push(entry); }
    }
    check("the real dictionary is back",
          scope("1girl, squirting").negative.indexOf("blue fluid") !== -1, true);
}

const withNegative = (input, negative) => sandbox.buildPrompt(input, negative, {});
const negativeHas = (job, tag) =>
    job.negative.split(",").map(t => t.trim()).indexOf(tag) !== -1;

console.log("   a negative entry removes it from the prompt too\n");

{
    // Asking for a tag and refusing it in the same breath is a contradiction,
    // and the negative wins. At the specificity written, same as `!`.
    const job = withNegative("1girl, blonde hair, shirt", "blonde hair");
    check("the named tag goes",  job.prompt.indexOf("blonde hair"), -1);
    check("the rest stays",      job.prompt.indexOf("shirt") !== -1, true);
    const vague = withNegative("1girl, blonde hair, hair ornament", "hair");
    check("a vague entry takes the coloured form", vague.prompt.indexOf("blonde hair"), -1);
    check("but not hair ornament", vague.prompt.indexOf("hair ornament") !== -1, true);
}

console.log("\n   the dependency sweep — CORPUS Probe A\n");

{
    // A knot cannot exist without a penis, and v1 only swept when the parent was
    // named in the negative field. This goes from any cause.
    const job = scope("knot, penis, !penis");
    check("the knot goes with it", job.prompt.indexOf("knot"), -1);
    check("and it is traced",      job.trace.culled.some(c => c.text === "knot"), true);
}
{
    // The parent is matched at specificity, so a differently-worded one counts.
    const job = scope("knot, huge penis");
    check("huge penis keeps the knot", job.prompt.indexOf("knot") !== -1, true);
}
{
    // From ANY cause: a framing cull that took the groin takes the knot too.
    const job = scope("knot, penis, head shot");
    check("a framing cull sweeps it as well", job.prompt.indexOf("knot"), -1);
}

console.log("\n   the negative is assembled, then cleared of the prompt\n");

{
    // CORPUS Probe B. A framing cull knows which crops this shot is NOT.
    const job = scope("frieren, head shot");
    check("the crop's opposites are negative", negativeHas(job, "full body"), true);
    check("and so is cowboy shot",             negativeHas(job, "cowboy shot"), true);
    check("the standing set is appended",      negativeHas(job, "blush stickers"), true);
    check("the universal set too",             job.negative.indexOf("glistening") !== -1, true);
    check("the trigger itself is not negated", negativeHas(job, "head shot"), false);
}
{
    // The standing negative is blunt on purpose — anything the prompt asks for
    // is taken back out, which is what makes that safe.
    const job = scope("1girl, messy hair, multiple views");
    check("a prompt tag is dropped from the negative", negativeHas(job, "messy hair"), false);
    check("and so is another",                         negativeHas(job, "multiple views"), false);
    check("while the rest survives",                   negativeHas(job, "blush stickers"), true);
}
{
    const job = withNegative("1girl, blonde hair", "text, text, comic");
    check("no duplicates", job.negative.split(",").map(t => t.trim())
                              .filter(t => t === "text").length, 1);
}

console.log("\n   the negative is image-wide (Rule 11)\n");

{
    // Forge has one negative field and no way to aim it, so nothing here is
    // per-figure however many subjects there are.
    const job = withNegative(".frieren, .fern", "blonde hair");
    check("still one flat string", typeof job.negative, "string");
    check("and it is not empty",   job.negative.length > 0, true);
}

console.log("\n== Phase 8 — boosters ==\n");

console.log("   CORPUS's probe\n");

{
    const job = scope("athletic, solo, rocket ship");
    check("the booster arrived",    job.prompt.indexOf("toned") !== -1, true);
    check("the summoning tag stays", job.prompt.indexOf("athletic") !== -1, true);
    // `rocket ship` is in weakKeywordsArray — this model reads it weakly.
    check("a weak tag is re-weighted", job.prompt.indexOf("(rocket ship)") !== -1, true);
}

console.log("\n   a booster is a SECTION plus a shape, and needs both\n");

{
    // REWRITTEN 2026-09-06. This block used to be headed "recognised by SHAPE,
    // not by a section marker", and that was the bug: 71 rules elsewhere in
    // cleaningDB happen to lead with their own target without being boosts, so
    // `backboob` and the other 45 of `bodyparts removal (TEMPORARY)` were being
    // dropped from every contracted caption. `-/ Boost keywords` was always the
    // intended list; `boosterSectionList` in webui.js now names it.
    //
    // The shape still matters INSIDE that section — `athletic; athletic, toned`
    // repeats its target and adds beside it, which is how a boost line says
    // which of its outputs are the extras.
    const job = scope("athletic, solo");
    const toned = job.records.find(r => r.text === "toned");
    check("the addition is marked",  toned && toned.booster, true);
    const athletic = job.records.find(r => r.text === "athletic" && r.culledBy == null);
    check("the tag that summoned it is not", athletic && athletic.booster, false);
}
{
    // ⚠ DELIBERATELY RED, and it predates the section fix — it is the one word
    // of cleaningDB.js that TODO §0.1 records as waiting on Noodle's intent.
    // The line reads `penis out; penis out, penis exposed` today, which is a
    // boost; it was `penis out; penis exposed`, a rename, when this was written.
    // Both readings are defensible and only Noodle knows which was meant.
    const job = scope("1girl, penis out");
    const renamed = job.records.find(r => r.text === "penis exposed");
    check("a rename is not a booster", renamed && renamed.booster, false);
}
{
    // The 71 false positives, checked at the one that was reported. `backboob`
    // comes from `from behind: huge breasts; huge breasts, backboob` in
    // `-/ bodyparts removal (TEMPORARY)` — the reinforcing SHAPE, but not a
    // boost section. It describes what is in the picture, so a caption keeps it.
    const job = scope("1girl, from behind, huge breasts");
    const back = job.records.find(r => r.text === "backboob");
    check("backboob arrives",              !!back, true);
    check("and is NOT marked a booster",   back && back.booster, false);
    check("so a caption keeps it",         job.contracted.indexOf("backboob") !== -1, true);
}
{
    // A rule that reaches applyRules with no section at all must never be a
    // booster — guessing is what this replaced.
    check("no section means no booster",
          sandbox.isBoosterRule({ target: "x", replacement: "x, y" }), false);
    check("and a section outside the list likewise",
          sandbox.isBoosterRule({ section: "Typos" }), false);
    check("while the named one is",
          sandbox.isBoosterRule({ section: "Boost keywords" }), true);
}

console.log("\n   the contracted render is the other half of the phase\n");

{
    // What a TRAINING CAPTION should say. A booster steers generation and
    // describes nothing that is in the picture, so it comes back out.
    const job = scope("athletic, solo");
    check("the booster is in the prompt",     job.prompt.indexOf("toned") !== -1, true);
    check("and not in the contracted form",   job.contracted.indexOf("toned"), -1);
    check("everything else survives both",    job.contracted.indexOf("athletic") !== -1, true);
    check("a booster that survives contraction is the bug this catches",
          job.contracted.split(", ").every(t => t !== "toned"), true);
}

console.log("\n   noboost turns the whole thing off\n");

{
    const job = scope("athletic, solo, rocket ship, noboost");
    check("no reinforcement",   job.prompt.indexOf("toned"), -1);
    check("no auto-emphasis",   job.prompt.indexOf("(rocket ship)"), -1);
    check("the tag itself stays", job.prompt.indexOf("rocket ship") !== -1, true);
    check("and noboost is never emitted", job.prompt.indexOf("noboost"), -1);
}

console.log("\n   emphasis you wrote yourself is left alone\n");

{
    // You already said what you wanted; stacking another paren on it would be
    // the engine arguing with you.
    const job = scope("((rocket ship)), solo");
    check("depth preserved",  job.prompt.indexOf("((rocket ship))") !== -1, true);
    const explicit = scope("(rocket ship:1.4), solo");
    check("an explicit weight is untouched",
          explicit.prompt.indexOf("(rocket ship:1.4)") !== -1, true);
}

// ===========================================================================
//  2026-09-06 — the six user-feedback items
// ===========================================================================

console.log("\n   Rule 16b — a boost you typed yourself survives the cull\n");

{
    // `head out of frame` is a HARD cull and takes the whole head with it. A
    // paren around the hair says the hair is the point of the picture, and
    // before this the boost was silently wasted.
    const job = scope("(red hair), head out of frame");
    check("the boosted tag lives",     job.prompt.indexOf("(red hair)") !== -1, true);
    check("and it is marked immune",
          (job.records.find(r => r.text === "red hair") || {}).immune, true);
    check("the cull trigger still fires", job.prompt.indexOf("head out of frame") !== -1, true);
}
{
    // The control. Without the boost this is the old behaviour, unchanged — the
    // protection has to be the boost and nothing else.
    check("an unboosted tag is still culled",
          scope("red hair, head out of frame").prompt.indexOf("red hair"), -1);
}
{
    check("an explicit weight above 1 protects too",
          scope("(red hair:1.4), head out of frame").prompt.indexOf("red hair") !== -1, true);
    // De-emphasis is the OPPOSITE statement. Reading `(x:0.6)` as "protect this"
    // would be the engine getting it exactly backwards.
    check("de-emphasis protects nothing",
          scope("(red hair:0.6), head out of frame").prompt.indexOf("red hair"), -1);
}
{
    // `!` is the explicit form and stays the last word, the same way `keep` is
    // the last word on a hard cull. cullByNegation ignores immunity on purpose.
    check("! still beats a boost", scope("(red hair), !red hair").prompt.indexOf("red hair"), -1);
}

console.log("\n   underscores are a booru artefact and leave in text space\n");

{
    check("converted to spaces",
          scope("red_hair, blue_eyes").prompt, "solo, red hair, blue eyes");
    // Rule 23 — a LoRA reference is lifted before this runs, and the `<…>` guard
    // means it would survive even if it were not.
    const job = scope("red_hair, <lora:some_model_name:1>");
    check("a LoRA reference keeps its underscores",
          job.lora[0], "<lora:some_model_name:1>");
}

console.log("\n   `negative:` splits a one-box prompt into two\n");

{
    // The failed attempt at a negative prompt, and the commonest one — Discord
    // has a single field and the habit crosses back over to the browser.
    const job = sandbox.buildPrompt("1girl, solo, negative: 1boy, male focus", "", {});
    check("the prompt stops at the marker", job.prompt.indexOf("1boy"), -1);
    check("and keeps what came before",     job.prompt.indexOf("1girl") !== -1, true);
    check("the marker is never emitted",    job.prompt.indexOf("negative"), -1);
    check("both terms reach the negative",
          job.negative.indexOf("1boy") === 0 && job.negative.indexOf("male focus") !== -1, true);
}
{
    // A typed negative is not replaced by one found in the prompt; they merge,
    // typed first.
    const job = sandbox.buildPrompt("1girl, negative: 1boy", "futanari", {});
    check("a typed negative survives the merge", job.negative.indexOf("futanari") === 0, true);
    check("and the inline one is beside it",     job.negative.indexOf("1boy") !== -1, true);
}
{
    // Tag boundary only — the start of the input, or just after a comma or a
    // newline, and a colon has to follow. Asked of the splitter directly: run
    // through the whole pipeline instead, `negative space` is culled by a
    // cleaning rule of its own and the probe would pass for the wrong reason.
    check("`negative space` is not a marker",
          sandbox.extractInlineNegative("1girl, negative space").negative, "");
    check("neither is a colon mid-tag",
          sandbox.extractInlineNegative("1girl, rating:negative: x").negative, "");
    check("the start of the input counts",
          sandbox.extractInlineNegative("negative: 1boy").prompt, "");
    check("and so does a newline",
          sandbox.extractInlineNegative("1girl\nnegative: 1boy").negative, "1boy");
}

console.log("\n   a size or style keyword sets the dropdown and is consumed\n");

{
    const job = sandbox.buildPrompt("1girl, portrait, red hair", "", {});
    check("the size is reported on the job", job.size, "Portrait");
    check("and never reaches the model",     job.prompt.indexOf("portrait"), -1);
    check("the rest of the prompt is intact", job.prompt.indexOf("red hair") !== -1, true);
}
{
    // WHOLE TAG. This is the case Noodle named, and it is the whole reason the
    // match runs on records rather than on a substring search.
    const job = sandbox.buildPrompt("1girl, square jaw", "", {});
    check("`square jaw` is a jaw",  job.size, null);
    check("and stays in the prompt", job.prompt.indexOf("square jaw") !== -1, true);
}
{
    check("an alias resolves",  sandbox.buildPrompt("1girl, oreteki", "", {}).style, "Oreteki18kin");
    check("so does the id",     sandbox.buildPrompt("1girl, Oreteki18kin", "", {}).style, "Oreteki18kin");
    check("case does not matter", sandbox.buildPrompt("1girl, LANDSCAPE", "", {}).size, "Landscape");
    check("size and style at once",
          [sandbox.buildPrompt("1girl, wide, degenerate", "", {}).size,
           sandbox.buildPrompt("1girl, wide, degenerate", "", {}).style].join("/"),
          "Landscape/Hard Degenerate");
}
{
    // Rule 2b is the escape hatch for the words that are also real tags.
    const job = sandbox.buildPrompt('1girl, "landscape"', "", {});
    check("a quoted keyword is a tag", job.size, null);
    check("and it is emitted plain",   job.prompt.indexOf("landscape") !== -1, true);
}
{
    // basicKeywordBlockedArray. `default` is every character's default outfit
    // and `syuro` is a trigger word three styles append themselves — ids that
    // must never answer to their own name. The suite caught both.
    check("`default` is still an outfit", sandbox.buildPrompt("1girl, default", "", {}).size, null);
    check("`syuro` is still a tag",       sandbox.buildPrompt("1girl, syuro", "", {}).style, null);
}
{
    // The text-space reading, for v1 and for sendPromptArray's Multiple decision.
    // It has to agree with the record pass or the two would fight.
    const scan = sandbox.v2ScanDispatchKeywords("1girl, portrait, red hair");
    check("the scan agrees with the job", scan.size, "Portrait");
    check("and hands back the rest",      scan.kept.indexOf("red hair") !== -1, true);
    check("`kept` drops the keyword",     scan.kept.indexOf("portrait"), -1);
    check("a newline is a boundary too",
          sandbox.v2ScanDispatchKeywords("a\nlandscape\nb").size, "Landscape");
}

console.log("\n   checkForDirt cleans a `--prompt` paste PER LINE\n");

{
    // The reported bug: everything but the flagged line was thrown away, so a
    // multi-line paste silently generated one image instead of several.
    sandbox.checkForDirt('test\n--prompt "test2" --negative_prompt "futanari"');
    check("both lines survive",
          sandbox.checkForDirt('test\n--prompt "test2" --negative_prompt "futanari"'),
          "test\ntest2");
    check("and the negative is harvested", sandbox.extractedNegative, "futanari");
}
{
    check("a `--prompt` with no negative flag still unwraps",
          sandbox.checkForDirt('--prompt "only this"'), "only this");
    // The mobile-paste heuristic is counted per line for the same reason. Over
    // the whole block these three are three digit runs and no commas, and a
    // clean paste was being run through the mobile parser.
    check("three clean one-tag lines are not a mobile paste",
          sandbox.checkForDirt("1girl\n1boy\n2girls"), "1girl\n1boy\n2girls");
}

// ===========================================================================
//  2026-09-06, second round
// ===========================================================================

console.log("\n   the four spellings Stable Diffusion writes its own negative in\n");

{
    const neg = (input) => sandbox.extractInlineNegative(input).negative;
    check("negative:",        neg("1girl, negative: 1boy"), "1boy");
    check("Negative:",        neg("1girl, Negative: 1boy"), "1boy");
    check("negative prompt:", neg("1girl, negative prompt: 1boy"), "1boy");
    check("Negative Prompt:", neg("1girl, Negative Prompt: 1boy"), "1boy");
    // buildPrompt can be handed raw text checkForDirt never saw — the bridge's
    // situation exactly — so the underscored spelling is accepted too.
    check("negative_prompt:", neg("1girl, negative_prompt: 1boy"), "1boy");
    // The shape a PNG footer actually has.
    check("on a line of its own",
          neg("1girl, solo\nNegative prompt: 1boy, bad hands"), "1boy, bad hands");
    // `--` is not a tag boundary, so a command-line paste still belongs to
    // checkForDirt, which knows to read the quoted argument instead.
    check("a --negative_prompt flag is left for checkForDirt",
          neg('--prompt "a" --negative_prompt "b"'), "");
}

console.log("\n   `aspect:` and `style:` say which question is being answered\n");

{
    const sizeOf  = (p) => sandbox.buildPrompt(p, "", {}).size;
    const styleOf = (p) => sandbox.buildPrompt(p, "", {}).style;
    check("aspect:",  sizeOf("1girl, aspect: portrait"),  "Portrait");
    check("size:",    sizeOf("1girl, size: landscape"),   "Landscape");
    check("ratio:",   sizeOf("1girl, ratio: 2:3"),        "Portrait");
    check("style:",   styleOf("1girl, style: oreteki"),   "Oreteki18kin");
    check("and a style id with a dot in it",
          styleOf("1girl, style: Syurofluff v9.7"), "Syurofluff v9.7");
    check("the directive is still consumed",
          sandbox.buildPrompt("1girl, aspect: portrait", "", {}).prompt.indexOf("aspect"), -1);
}
{
    // The POINT of the prefixed form: it says which question is being answered,
    // so the words blocked from answering to their own name are reachable again.
    check("`aspect: default` reaches the row a bare `default` cannot",
          sandbox.buildPrompt("1girl, aspect: default", "", {}).size, "Default");
    check("and `style: syuro` likewise",
          sandbox.buildPrompt("1girl, style: syuro", "", {}).style, "Syuro");
    check("while a bare `default` is still an outfit",
          sandbox.buildPrompt("1girl, default", "", {}).size, null);
    check("and a bare `syuro` is still a tag",
          sandbox.buildPrompt("1girl, syuro", "", {}).style, null);
}
{
    // A prefix with an unreadable argument is consumed but never silently
    // honoured — generating at the dropdown's setting and looking almost right
    // is the hardest kind of wrong to notice.
    const job = sandbox.buildPrompt("1girl, style: oretekki", "", {});
    check("a typo sets nothing",        job.style, null);
    check("is not left in the prompt",  job.prompt.indexOf("oretekki"), -1);
    check("and is reported",            job.trace.unmatched.length > 0, true);
}
{
    // Every ratio alias against the row it names. These all collided on their
    // first digit until the key normalizer stopped reading `x:y` as a weight.
    const want = { "1:1": "Default", "7:9": "Semi-Tall", "2:3": "Portrait", "1:2": "Vertical",
                   "9:7": "Semi-Wide", "3:2": "Landscape", "2:1": "Horizontal" };
    const got = Object.keys(want).map(k => (sandbox.matchDispatchKeyword(k) || {}).value);
    check("every ratio alias names its own row", got, Object.keys(want).map(k => want[k]));
    // And the weight IS still read where tokenize would read it.
    check("an emphasis weight is still stripped inside parens",
          (sandbox.matchDispatchKeyword("(portrait:1.2)") || {}).value, "Portrait");
}

console.log("\n   a scope binds to the record in front of it, not to an index\n");

{
    // `scope.precededBy` used to be an index into `records`, and Phase 1 splices:
    // `long blonde hair` becomes two tags, `mini top hat` two more. Three
    // expanding tags in front of the scopes was enough to make BOTH of them
    // anonymous — her traits went to the common block and her framing got a cell
    // of its own, which read as Regional Prompter being unreliable.
    const owners = (input) => sandbox.buildPrompt(input, "", {}).scopes.map(s => s.owner);
    const two = ["frieren (sousou no frieren)", "fern (sousou no frieren)"];
    check("with nothing in front",
          owners("frieren {head shot}, fern {full body}"), two);
    check("with one expanding tag in front",
          owners("long blonde hair, frieren {head shot}, fern {full body}"), two);
    check("with three — the case that used to break",
          owners("long blonde hair, girthy penis, mini top hat, frieren {head shot}, fern {full body}"), two);
    check("and with four",
          owners("long blonde hair, girthy penis, mini top hat, clitoris slip, " +
                 "frieren {head shot}, fern {full body}"), two);
}

console.log("\n   the same character twice is two figures, not one\n");

{
    // Two scopes on one name used to find the same subject, so the prompt
    // rendered as ONE line and the regional adapter had nothing to divide —
    // it silently sent an ordinary generation.
    const job = sandbox.buildPrompt("frieren {head shot}, frieren {full body}", "", {});
    check("two subjects",      job.subjects.length, 2);
    check("with distinct ids", job.subjects[0].id !== job.subjects[1].id, true);
    // The id forks; the NAME does not. It is the booru tag and both instances
    // still have to emit it (Rule 5), while the id never reaches output (Rule 3).
    check("but the same name", job.subjects[0].name, job.subjects[1].name);
    check("and three rendered lines", job.prompt.split("\n").length, 3);
    check("no id leaks into the prompt", job.prompt.indexOf("#2"), -1);
}
{
    // Only a SECOND SCOPE forks. A bare name is not a declaration of another body.
    check("a bare name beside a scope is still one figure",
          sandbox.buildPrompt("frieren, frieren {head shot}", "", {}).subjects.length, 1);
    check("and so is the same name typed twice",
          sandbox.buildPrompt("frieren, frieren", "", {}).subjects.length, 1);
    // Rule 4 was always right about bare scopes; this must not have changed.
    check("two bare scopes are still two anonymous subjects",
          sandbox.buildPrompt("{red hair}, {blue hair}", "", {}).subjects.length, 2);
}

console.log("\n   the renderer says whether line 0 is the common block\n");

{
    // Regional Prompting reads line 0 as common and everything after it as a
    // region, and from the flat string an EMPTY common block is indistinguishable
    // from one fewer figure. Reachable by typing `2girls, duo` into the negative:
    // Phase 7 culls them out of the prompt, and on a two-figure shot they were
    // the whole common block. The adapter then came in a line short, failed its
    // own guard, and generated with no regions at all and no message.
    const grouped = sandbox.buildPrompt("frieren {head shot}, fern {full body}", "", {});
    check("a normal two-figure shot has one",  grouped.hasCommonLine, true);
    check("and renders three lines",           grouped.prompt.split("\n").length, 3);

    const emptied = sandbox.buildPrompt("frieren {head shot}, fern {full body}", "2girls, duo", {});
    check("with the count tags negated it has none", emptied.hasCommonLine, false);
    check("and renders two",                         emptied.prompt.split("\n").length, 2);
    check("but both figures are still there",
          emptied.prompt.indexOf("frieren") !== -1 && emptied.prompt.indexOf("fern") !== -1, true);

    // One line, nothing grouped — there is no common-versus-region question.
    check("a solo shot has no common line", sandbox.buildPrompt("1girl, frieren", "", {}).hasCommonLine, false);
}

console.log("\n   the `###` colon sentinels are undone when a rule is parsed\n");

{
    // establishRules sentinels `:o`, `:3`, `:<`, `lora:`, `:0.` and `:1>` so the
    // requirement/target splits cannot trip over a colon inside a VALUE. Only v1
    // ever undid it, at the end of its own keyword cleanup, so v2 read 65 rules
    // as mangled text.
    const withSentinel = sandbox.rulesArrayInitial.concat(sandbox.rulesArrayFinal)
        .filter(r => /###/.test((r.target || "") + (r.replacement || "") +
                                (r.requirement || "") + (r.exception || "")));
    check("no rule reaches the engine still sentinelled", withSentinel.length, 0);

    const job = sandbox.buildPrompt("1girl, Ohogao", "", {});
    check("no ### tag is emitted",  /###/.test(job.prompt), false);
    check("`:o` survives as itself", job.prompt.indexOf(":o") !== -1, true);
    // The same sentinel was eating `lora:`, so the reference did not match
    // liftLoraReferences and travelled into the prompt as literal words.
    check("and the LoRA is a real reference again",
          job.lora.indexOf("<lora:ohogao - magochi:1>") !== -1, true);
    check("so it is not left in the tag stream",
          job.prompt.indexOf("<lora###"), -1);
}

console.log("\n   a rule that splits a tag keeps it inside its scope\n");

{
    // Phase 1 runs before owners exist, so the scope index is the only thing
    // saying where a split-off tag came from. Without it, `simple red background`
    // left `red background` unowned, the Rule 13 pass read that as image-level,
    // and BOTH figures got BOTH colours out of the common block.
    const job = sandbox.buildPrompt(
        "upper body only, frieren {simple red background}, angelica {simple blue background}", "", {});
    const owner = (t) => (job.records.find(r => r.culledBy == null && r.text === t) || {}).owner;
    check("red stays with the figure who asked for it",  owner("red background"),  "frieren (sousou no frieren)");
    check("blue stays with hers",                        owner("blue background"), "sy-angelica");
    // `simple background` IS shared, so Rule 13 is right to merge that one.
    const lines = job.prompt.split("\n");
    check("the common block keeps the shared half",  lines[0].indexOf("simple background") !== -1, true);
    check("and neither colour reaches it",
          lines[0].indexOf("red background") === -1 && lines[0].indexOf("blue background") === -1, true);
}

console.log("\n   a colon-number tag is never weighted by nesting\n");

{
    // `(:3)` is an EMPTY group at weight 3 to A1111, not `:3` at 1.1.
    const boosted = sandbox.buildPrompt("1girl, (:3)", "", {});
    check("the explicit form is used",  boosted.prompt.indexOf("(:3:1.1)") !== -1, true);
    check("and the bare nesting is not", /\(:3\)/.test(boosted.prompt), false);
    // Unweighted it was never ambiguous and must not change.
    check("an unweighted :3 is left alone",
          sandbox.buildPrompt("1girl, :3", "", {}).prompt.indexOf(":3") !== -1, true);
    check("and a non-numeric emoticon is left alone",
          sandbox.buildPrompt("1girl, (:o)", "", {}).prompt.indexOf("(:o)") !== -1, true);
}

// ---------------------------------------------------------------------------

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
