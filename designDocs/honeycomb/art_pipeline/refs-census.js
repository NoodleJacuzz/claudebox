//===================================================================================================
//HONEYCOMB ART PIPELINE -- refs census (developer tool; step 2a of BRIEF.md)
//===================================================================================================
//> 2a. Do a check of images against existing WEBUI rules against a simple white background.
//> Correct or disable any rules which would remove character details.
//> Add any missing character or clothing tags as needed to appropriate categories/libraries.
//
//Compiles every sidecar in refsPNG/characters through the webui v2 engine exactly as the page would, and
//reports what the engine did to it: tags it CULLED (and what culled them), tags that went missing without a
//cull (rewritten by a rule), tags it ADDED, and tags no category knows. Loads the engine the way
//scripts/webui/tools/webui2-test.js does.
//
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/refs-census.js"            summary by tag
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/refs-census.js" --files    per sidecar
//  node --max-old-space-size=2048 "!designDocs/honeycomb/art_pipeline/refs-census.js" --triggers which tag causes each change
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");
const ENGINE = path.join(ROOT, "scripts", "webui");
const REFS = path.join(ROOT, "!designDocs", "honeycomb", "!imageStorage", "_source", "refsPNG", "characters");
const perFile = process.argv.includes("--files");

const quiet = { log() {}, info() {}, warn() {}, debug() {}, error: console.error };
const sandbox = { console: quiet, module: undefined };
vm.createContext(sandbox);
const webuiSource = fs.readFileSync(path.join(ENGINE, "webui.js"), "utf8");
const libraryList = webuiSource.match(/var\s+librariesList\s*=\s*\[([\s\S]*?)\]/)[1].match(/"([^"]+)"/g).map((quoted) => quoted.slice(1, -1));
for (const file of libraryList) vm.runInContext(fs.readFileSync(path.join(ENGINE, "libraries", file), "utf8"), sandbox, { filename: file });
for (const file of ["webui.js", "webui2-categories.js", "webui2.js"]) vm.runInContext(fs.readFileSync(path.join(ENGINE, file), "utf8"), sandbox, { filename: file });
vm.runInContext("v2EnsureDictionaries()", sandbox);

//A tag as the engine stores it: emphasis parentheses off, lowercase, underscores as spaces.
//A single-quoted tag (Rule 2c) is compared without its quotes, since the engine emits it without them.
const plain = (tag) => tag.trim().replace(/^\(+|\)+$/g, "").replace(/^'(.*)'$/, "$1").replace(/_/g, " ").trim().toLowerCase();
//The tags of a finished prompt string.
const promptTagArray = (prompt) => prompt.split(/,\s*|\n/).map((tag) => plain(tag.replace(/:[\d.]+\)*$/, ""))).filter(Boolean);

//--triggers: which INPUT tag causes each change. Every tag of every sidecar is protected on its own (Rule 2c,
//single quotes) and the compile rerun; a tag is a trigger when protecting it makes an engine addition disappear
//or stops the tag itself being rewritten. The answer to "what should be quoted".
if (process.argv.includes("--triggers")) {
	const splitInput = (input) => input.split(/,\s*/).filter(Boolean);
	const liveSet = (prompt) => new Set(promptTagArray(prompt));
	const triggerMap = new Map();
	for (const fileName of fs.readdirSync(REFS).filter((name) => name.endsWith(".txt")).sort()) {
		const base = fileName.replace(/\.txt$/, "");
		const tagArray = splitInput(fs.readFileSync(path.join(REFS, fileName), "utf8").trim());
		const inputSet = new Set(tagArray.map(plain));
		const baseline = liveSet(sandbox.buildPrompt(tagArray.join(", "), "", {}).prompt);
		const addedArray = [...baseline].filter((text) => !inputSet.has(text));
		tagArray.forEach((raw, index) => {
			if (/^\(*'.*'\)*$/.test(raw.trim())) return;
			const text = plain(raw);
			const weight = (raw.match(/^\(*/) || [""])[0].length;
			const quoted = "(".repeat(weight) + "'" + text + "'" + ")".repeat(weight);
			const trial = tagArray.slice();
			trial[index] = quoted;
			const after = liveSet(sandbox.buildPrompt(trial.join(", "), "", {}).prompt);
			const effectArray = addedArray.filter((added) => !after.has(added)).map((added) => "stops +" + added);
			if (!baseline.has(text) && after.has(text)) effectArray.unshift("no longer rewritten");
			if (effectArray.length === 0) return;
			const key = text + "  ->  " + effectArray.join(", ");
			if (!triggerMap.has(key)) triggerMap.set(key, []);
			triggerMap.get(key).push(base);
		});
	}
	console.log("### TRIGGERS (" + triggerMap.size + ")");
	[...triggerMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))
		.forEach(([key, fileArray]) => console.log("  " + key + "   [" + fileArray.join(" ") + "]"));
	process.exit(0);
}

const tally = { culled: new Map(), missing: new Map(), added: new Map(), unknown: new Map() };
const note = (map, key, fileName) => { if (!map.has(key)) map.set(key, []); map.get(key).push(fileName); };

for (const fileName of fs.readdirSync(REFS).filter((name) => name.endsWith(".txt")).sort()) {
	const input = fs.readFileSync(path.join(REFS, fileName), "utf8").trim();
	const job = sandbox.buildPrompt(input, "", {});
	const inputTags = new Set(input.split(/,\s*/).map(plain));
	const outputTags = new Set(promptTagArray(job.prompt));
	const base = fileName.replace(/\.txt$/, "");
	const fileReport = [];
	const culledTexts = new Set();
	for (const record of job.records) {
		if (!record.culledBy) continue;
		const text = plain(record.text);
		if (!inputTags.has(text) || outputTags.has(text)) continue;
		culledTexts.add(text);
		note(tally.culled, text + "  <- " + record.culledBy, base);
		fileReport.push("culled  " + text + "  <- " + record.culledBy);
	}
	for (const text of inputTags) {
		if (outputTags.has(text) || culledTexts.has(text)) continue;
		note(tally.missing, text, base);
		fileReport.push("missing " + text + " (rewritten or merged by a rule)");
	}
	for (const text of outputTags) {
		if (inputTags.has(text)) continue;
		const record = job.records.find((candidate) => plain(candidate.text) === text && !candidate.culledBy);
		const source = record == null ? "?" : record.source;
		note(tally.added, text + "  <- " + source, base);
		fileReport.push("added   " + text + "  <- " + source);
	}
	for (const entry of (job.trace.unknown || [])) {
		const text = plain(typeof entry === "string" ? entry : entry.text || JSON.stringify(entry));
		note(tally.unknown, text, base);
		fileReport.push("unknown " + text);
	}
	if (perFile) console.log("\n== " + base + "\n  " + (fileReport.join("\n  ") || "(no changes)"));
}

const print = (title, map) => {
	console.log("\n### " + title + " (" + map.size + ")");
	[...map.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
		.forEach(([key, fileArray]) => console.log("  " + String(fileArray.length).padStart(2) + "  " + key + "   [" + fileArray.join(" ") + "]"));
};
print("CULLED from the input", tally.culled);
print("MISSING without a cull (rewritten)", tally.missing);
print("ADDED by the engine", tally.added);
print("UNCATEGORISED", tally.unknown);
