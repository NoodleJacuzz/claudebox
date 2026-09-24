//===================================================================================================
//HONEYCOMB ART PIPELINE -- entry split and round trip (developer tool; step 3 of BRIEF.md)
//===================================================================================================
//> 3. Add each character and their default outfit to the character database [...] This step would be tested
//> by generating the same image we pulled the character and outfit details from, removing the character and
//> clothing tags, inserting our shortcut and `default`, and testing if we get the same image back.
//
//Tested on COMPILED TEXT (FEASIBILITY step 3; Noodle agreed): the same compiled prompt at the same seed is the same
//image. For every sidecar, the input is rebuilt as `<entry>, <outfit>` plus every tag the entry and outfit do not
//already write, both are compiled, and the two prompts must match tag for tag (order included).
//
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/refs-roundtrip.js" --split [char]   categories of 1V-basic-a / 1C-basic-a
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/refs-roundtrip.js"                  round trip every sidecar
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/refs-roundtrip.js" --show <file>    one sidecar, both prompts
//
//ENTRY_OF maps a refs file prefix to its charactersDB entry; a new character is one row.
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");
const ENGINE = path.join(ROOT, "scripts", "webui");
const REFS = path.join(ROOT, "!designDocs", "honeycomb", "!imageStorage", "_source", "refsPNG", "characters");
const ENTRY_OF = {
	knight1V: ".hcKnightV", knight1C: ".hcKnightC", lancer1V: ".hcLancerV", lancer1C: ".hcLancerC",
	necro1V: ".hcNecroV", necro1C: ".hcNecroC", priest1V: ".hcPriestV", priest1C: ".hcPriestC",
	seer1V: ".hcSeerV", seer1C: ".hcSeerC", vamp1V: ".hcVampV", vamp1C: ".hcVampC",
};
const OUTFIT_OF_INDEX = { 1: "default" };

const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);
const webuiSource = fs.readFileSync(path.join(ENGINE, "webui.js"), "utf8");
const libraryList = webuiSource.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1].match(/"([^"]+)"/g).map((quoted) => quoted.slice(1, -1));
for (const file of libraryList) vm.runInContext(fs.readFileSync(path.join(ENGINE, "libraries", file), "utf8"), sandbox, { filename: file });
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) vm.runInContext(fs.readFileSync(path.join(ENGINE, file), "utf8"), sandbox, { filename: file });
vm.runInContext("v2EnsureDictionaries()", sandbox);

const argumentArray = process.argv.slice(2);
const readSidecar = (base) => fs.readFileSync(path.join(REFS, base + ".txt"), "utf8").trim().split(/,\s*/).filter(Boolean);
//A tag's comparable text: emphasis and protection quotes off.
const bare = (raw) => raw.trim().replace(/^\(+|\)+$/g, "").replace(/^'(.*)'$/, "$1").trim();

if (argumentArray[0] === "--split") {
	const only = argumentArray[1];
	for (const prefix of Object.keys(ENTRY_OF)) {
		if (only && !prefix.startsWith(only)) continue;
		const base = prefix + "-basic-a";
		console.log("\n== " + base);
		for (const raw of readSidecar(base)) {
			const categories = vm.runInContext("categoriesOf(" + JSON.stringify(bare(raw)) + ")", sandbox);
			console.log("  " + raw.padEnd(28) + (categories.join(", ") || "(none)"));
		}
	}
	process.exit(0);
}

//The entry and outfit as written in charactersDB.js, to know which of a sidecar's tags they already write. Read from
//the file rather than the engine's parsed array, so it is exactly what a person reading the entry sees.
const charactersSource = fs.readFileSync(path.join(ENGINE, "libraries", "charactersDB.js"), "utf8").split(/\r?\n/);
function entryTags(code, outfitName) {
	const at = charactersSource.findIndex((line) => line.toLowerCase().startsWith(code.toLowerCase() + ";"));
	if (at < 0) return null;
	const split = (text) => vm.runInContext("splitStoredPrompt(" + JSON.stringify(text || "") + ")", sandbox).map((tag) => bare(tag.text));
	let outfit = null;
	for (let line = at + 1; line < charactersSource.length && !charactersSource[line].startsWith("."); line++) {
		if (charactersSource[line].toLowerCase().startsWith("*" + outfitName + ";")) outfit = split(charactersSource[line].slice(outfitName.length + 2));
	}
	return { identity: split(charactersSource[at].slice(code.length + 1)), outfit: outfit };
}
const compile = (input) => sandbox.buildPrompt(input, "", {}).prompt;
let pass = 0;
let fail = 0;
const showBase = argumentArray[0] === "--show" ? argumentArray[1] : null;
for (const fileName of fs.readdirSync(REFS).filter((name) => name.endsWith(".txt")).sort()) {
	const base = fileName.replace(/\.txt$/, "");
	if (showBase && base !== showBase) continue;
	const match = base.match(/^([a-z]+(\d+)[CV])-/);
	const code = match && ENTRY_OF[match[1]];
	const outfitName = match && OUTFIT_OF_INDEX[match[2]];
	const known = code && entryTags(code, outfitName);
	if (!known || !known.outfit) { console.log("  SKIP  " + base + " (no entry " + code + "*" + outfitName + " yet)"); continue; }
	const written = new Set(known.identity.concat(known.outfit).map((tag) => tag.toLowerCase()));
	const sidecar = readSidecar(base);
	const leftover = sidecar.filter((raw) => !written.has(bare(raw).toLowerCase()));
	//`.entry, default` is the character in that outfit; `.entry*default` is the outfit ALONE (existing engine syntax).
	const rebuilt = [code, outfitName].concat(leftover).join(", ");
	const expected = compile(sidecar.join(", "));
	const actual = compile(rebuilt);
	const same = expected === actual;
	if (same) pass++; else fail++;
	if (showBase || !same) {
		const expectedSet = expected.split(/,\s*|\n/).filter(Boolean);
		const actualSet = actual.split(/,\s*|\n/).filter(Boolean);
		console.log("  " + (same ? "ok    " : "FAIL  ") + base);
		console.log("        only in sidecar : " + expectedSet.filter((tag) => !actualSet.includes(tag)).join(", "));
		console.log("        only in entry   : " + actualSet.filter((tag) => !expectedSet.includes(tag)).join(", "));
		if (!same && expectedSet.length === actualSet.length && expectedSet.every((tag) => actualSet.includes(tag))) console.log("        (same tags, different order)");
		if (showBase) { console.log("        input  : " + rebuilt); console.log("        sidecar: " + expected); console.log("        entry  : " + actual); }
	}
}
console.log("\n" + pass + " round trips match, " + fail + " differ");
