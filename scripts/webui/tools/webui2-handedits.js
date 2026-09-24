//WHAT DID NOODLE CHANGE BY HAND? Recompiles a generated image's own `Raw input` with the v2 engine and
//diffs the result against the positive prompt that actually reached the model. Whatever the recompile
//does not account for was typed into Forge by hand, after the tool had done its work.
//
//  node webui2-handedits.js                          every sidecar under the repo, aggregated
//  node webui2-handedits.js --in "<folder>"          only that folder, recursively
//  node webui2-handedits.js --since 2026-09-01       only sidecars modified after that date
//  node webui2-handedits.js --show "<sidecar.txt>"   one image, in full
//  node webui2-handedits.js --top 40                 how many rows each table prints (default 25)
//
//WHY THIS EXISTS. Noodle, 2026-09-21: "aside from all the nettle ones I don't have examples where I
//generated an image, realized it was missing something, added the tags, and the original starting point
//survived." The starting point did survive, about two thousand times. `webui2-generate.js` writes the
//raw input into every sidecar, so the before and the after have been sitting next to each other in
//every folder all along.
//
//A DELTA IS A CANDIDATE, NEVER A FINDING. Most of these images were never given individual attention,
//so a difference records a prompt nobody minded rather than a prompt somebody fixed. Noodle, on the
//first sweep: "I'm 90% sure about nettle's images, I'm comfortable with that number because I did each
//one by hand with my full attention. Meanwhile, the enemies in the workbench were done in bulk, and I
//took a 'good enough' approach to them. As for the rest of the 2003, I have no idea." Prompts are also
//bulk-built, and an input and an output can legitimately agree once the input has been through the
//engine.
//
//So the loop is: this tool proposes, HE confirms, and only the confirmed half becomes a rule in
//corrections.md. That loop has run once and produced six tags he says he means to use and forgets:
//`blush`, `solo`, `pussy juice`, `pussy juice puddle`, `impact lines`, `naughty face`.
//
//Its findings belong in `.claude/skills/syrup-town-images/reference/corrections.md`. The project is
//`!designDocs/voice_matching/`.
//
//DICTIONARY DRIFT IS THE WHOLE DIFFICULTY, AND IT RUNS IN BOTH DIRECTIONS. A sidecar records what the
//engine produced on the day it ran. Recompiling it uses today's dictionaries, so a shortcut whose
//definition has changed since shows up as a difference nobody typed. `PoseBreakdownB` is the worked
//example: on 2026-09-19 it emitted `from side, blush, embarrassed, horny, pent-up`, and today it emits
//eight entirely different tags. Every image in that batch reports five hand additions and not one of
//them happened.
//
//So a count on its own means nothing. What separates a real correction from drift is WHEN it appears:
//
//  - DRIFT lands on every image of one batch and never again. Its `days` column is 1.
//  - A REAL correction turns up sporadically, across separate sittings, over weeks. Its `days` column
//    is several and its date span is wide.
//
//Both tables are therefore sorted by `days`, not by image count, and both print the span. **Read the
//days column before believing a row.** `--since` cuts to a window where the dictionaries have not
//moved, which is the other half of the answer.
//
//One thing it cannot tell at all: a sidecar with no `Raw input` was generated in Forge directly rather
//than through the tool. Those are counted and skipped, never guessed at.
//
//Read-only. `testing = true` stops sendPrompt before any POST and the sandbox's fetch throws.
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");

const here = path.resolve(__dirname, "..");
const REPO = path.resolve(here, "..", "..");

const argArray = process.argv.slice(2);
const argOf = (name, fallback) => {
	const at = argArray.indexOf(name);
	return at >= 0 && argArray[at + 1] ? argArray[at + 1] : fallback;
};
const showOne = argOf("--show", "");
const inFolder = path.resolve(REPO, argOf("--in", "."));
const sinceRaw = argOf("--since", "");
const since = sinceRaw ? new Date(sinceRaw) : null;
const top = Number(argOf("--top", "25"));

if (argArray.includes("--help") || argArray.includes("-h")) {
	console.log(fs.readFileSync(__filename, "utf8").split("\n").filter((l) => l.startsWith("//")).join("\n"));
	process.exit(0);
}

//---------------------------------------------------------------------------------------------------
//The engine, in a sandbox. Same setup as webui2-inspect.js, same load order as the page.
//---------------------------------------------------------------------------------------------------
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
		createElement: function () { return { style: "", innerHTML: "", textContent: "", appendChild: function () {} }; }
	},
	localStorage: {
		store: {},
		getItem: function (k) { return this.store[k] || null; },
		setItem: function (k, v) { this.store[k] = v; }
	},
	fetch: function () { throw new Error("network reached -- the testing flag failed"); },
	window: {}
};
vm.createContext(sandbox);

const source = fs.readFileSync(path.join(here, "webui.js"), "utf8");
const libArray = source.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1].match(/"([^"]+)"/g).map((q) => q.slice(1, -1));
for (const name of libArray) vm.runInContext(fs.readFileSync(path.join(here, "libraries", name), "utf8"), sandbox, { filename: name });
for (const name of ["webui.js", "webui2-categories.js", "webui2.js"]) vm.runInContext(fs.readFileSync(path.join(here, name), "utf8"), sandbox, { filename: name });
vm.runInContext("v2EnsureDictionaries(); testing = true; promptLayout = 'plain';", sandbox);

//---------------------------------------------------------------------------------------------------
//Reading one sidecar
//---------------------------------------------------------------------------------------------------
const split = (text) => String(text).split(",").map((tag) => tag.trim()).filter(Boolean);

//A sidecar is Forge's `parameters` chunk: the positive prompt, then `Negative prompt:`, then the
//settings line, which is where webui2-generate.js parks the combo line it was given.
function readSidecar(file) {
	const text = fs.readFileSync(file, "utf8");
	const raw = /Raw input: "([^"]*)"/.exec(text);
	if (!raw) return null;
	return { raw: raw[1], actual: split(text.split("\nNegative prompt:")[0]) };
}

function handEdits(card) {
	let job;
	try { job = sandbox.buildPrompt(card.raw, "", {}); }
	catch (error) { return { failed: error.message }; }
	const compiled = split(job.prompt);
	const compiledSet = new Set(compiled), actualSet = new Set(card.actual);
	return {
		added: card.actual.filter((tag) => !compiledSet.has(tag)),
		removed: compiled.filter((tag) => !actualSet.has(tag))
	};
}

//---------------------------------------------------------------------------------------------------
//Walking
//---------------------------------------------------------------------------------------------------
function sidecarArray(root) {
	const out = [], stack = [root];
	while (stack.length) {
		const folder = stack.pop();
		let nameArray;
		try { nameArray = fs.readdirSync(folder); } catch (error) { continue; }
		for (const name of nameArray) {
			if (name === "node_modules" || name === ".git") continue;
			const full = path.join(folder, name);
			let stat;
			try { stat = fs.statSync(full); } catch (error) { continue; }
			if (stat.isDirectory()) stack.push(full);
			else if (name.endsWith(".txt")) {
				if (since && stat.mtime < since) continue;
				out.push(full);
			}
		}
	}
	return out.sort();
}

//---------------------------------------------------------------------------------------------------
//One image, in full
//---------------------------------------------------------------------------------------------------
if (showOne) {
	const file = path.resolve(REPO, showOne);
	const card = readSidecar(file);
	if (!card) { console.log("No `Raw input:` in " + file + " -- generated in Forge directly, so there is nothing to compare."); process.exit(1); }
	const edit = handEdits(card);
	console.log("\n" + path.relative(REPO, file));
	console.log("\nTYPED IN\n  " + card.raw);
	if (edit.failed) { console.log("\nCOMPILE FAILED: " + edit.failed); process.exit(1); }
	console.log("\nADDED BY HAND (" + edit.added.length + ")\n  " + (edit.added.join(", ") || "(none)"));
	console.log("\nGONE FROM THE FINAL PROMPT (" + edit.removed.length + ")   -- removed by hand, or the engine no longer emits it\n  " + (edit.removed.join(", ") || "(none)"));
	console.log("");
	process.exit(0);
}

//---------------------------------------------------------------------------------------------------
//The aggregate
//---------------------------------------------------------------------------------------------------
const fileArray = sidecarArray(inFolder);
const addedMap = {}, removedMap = {};
let read = 0, noRaw = 0, failed = 0, untouched = 0;

for (const file of fileArray) {
	const card = readSidecar(file);
	if (!card) { noRaw++; continue; }
	const edit = handEdits(card);
	if (edit.failed) { failed++; continue; }
	read++;
	if (!edit.added.length && !edit.removed.length) untouched++;
	//One image counts once per tag however many times it pasted it, so a double paste is not a trend.
	const when = fs.statSync(file).mtime;
	const record = (map, tag) => {
		const row = map[tag] = map[tag] || { count: 0, first: when, last: when, dayMap: {}, example: file };
		row.count++;
		if (when < row.first) row.first = when;
		if (when > row.last) row.last = when;
		row.dayMap[when.toISOString().slice(0, 10)] = true;
	};
	for (const tag of new Set(edit.added)) record(addedMap, tag);
	for (const tag of new Set(edit.removed)) record(removedMap, tag);
}

//Sorted by how many separate DAYS a tag turned up on, not by how many images carry it. A thousand
//images from one afternoon is one decision; five images across five weeks is a habit.
function table(title, map, note) {
	const rowArray = Object.keys(map).map((tag) => {
		const row = map[tag];
		row.tag = tag;
		row.days = Object.keys(row.dayMap).length;
		return row;
	}).sort((a, b) => (b.days - a.days) || (b.count - a.count));
	console.log("\n=== " + title + " (" + rowArray.length + " distinct tags) ===");
	if (note) console.log(note);
	console.log("   days  images  tag");
	for (const row of rowArray.slice(0, top)) {
		const span = row.first.toISOString().slice(0, 10) + (row.days > 1 ? " to " + row.last.toISOString().slice(0, 10) : "");
		console.log("  " + String(row.days).padStart(5) + "  " + String(row.count).padStart(6) + "  " + row.tag.padEnd(34) + "  " + span);
	}
	if (rowArray.length > top) console.log("  ... and " + (rowArray.length - top) + " more. --top " + rowArray.length + " to see them.");
}

console.log("\n%d sidecars read, %d had no `Raw input` and were skipped, %d failed to compile.", read, noRaw, failed);
console.log("%d of the %d compiled to exactly what shipped -- those are the prompts that needed nothing.", untouched, read);
if (since) console.log("Only sidecars modified after %s.", since.toISOString().slice(0, 10));

table("IN THE FINAL PROMPT, not in the recompile", addedMap,
	"  A tag added by hand, OR one a shortcut used to emit and no longer does.\n"
	+ "  MANY DAYS = a habit, and the thing prompts keep being written without.\n"
	+ "  ONE DAY over many images = one batch, and nearly always dictionary drift, not anybody typing.");
table("IN THE RECOMPILE, not in the final prompt", removedMap,
	"  A tag removed by hand, OR one a shortcut has started emitting since. Same reading: days, not count.");
console.log("\nOne image in full:  node webui2-handedits.js --show \"<path to its .txt>\"");
