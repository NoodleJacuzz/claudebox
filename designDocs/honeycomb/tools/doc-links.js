//===================================================================================================
//HONEYCOMB CATACOMBS -- documentation link audit (developer tool, never loaded by the game)
//===================================================================================================
//Session 41 moved every dev tool into tools/ and split rework/ by pathway, which broke 70 references
//across the design docs. A reference that no longer resolves is worse than no reference: it sends the
//next session to a file that is not there and it costs a search to find out.
//
//Reports two things, separately, because only the first is always a bug:
//  MISSING   -- a backticked path that resolves to nothing. A stale pointer.
//  BARE NAME -- a filename with no directory, which does not sit beside the doc naming it. Normal for
//               code files (`honeycomb-tuning.js` reads better than its full path); worth a look for
//               a .md, because two workstreams both having a STATUS.md is how a pointer goes wrong.
//
//Also enforces BASICS' "Nothing goes in the honeycomb root" rule.
//
//Exit code is 1 when anything is MISSING or stray, so a session can gate on it.

const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..", "..", "..");
const HONEYCOMB = path.join(REPO, "!designDocs", "honeycomb");

//Paths a doc may name that are not files in this repo, or are file TYPES rather than references.
const IGNORED = [
	"index.html", "mobile.html", ".generated.txt", ".copies.txt", "FEEDBACK-NN.md", "Archive/FEEDBACK-NN-DONE.md",
	"example_mechanics.md", "alchemist.txt", "Archive/FEEDBACK-09-DONE.md",
	//Each workstream archives its finished feedback here; the file appears the first time one closes.
	"_archive/FEEDBACK-DONE.md",
	//Named in prose as documents that were REPLACED, not as live pointers.
	"OUTFITS-01.md", "OUTFITS-02.md", "OUTFITS-01/02.md",
];

//A URL, a glob, a placeholder or a shell fragment is not a path this audit can resolve.
const unresolvable = (reference) => /^https?:|[*<>]|\s/.test(reference);

function walk(directory, out) {
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		const full = path.join(directory, entry.name);
		//!imageStorage holds reference pictures, not documents.
		if (entry.isDirectory() && entry.name === "!imageStorage") continue;
		if (entry.isDirectory()) walk(full, out);
		else out.push(full);
	}
	return out;
}

const everyFile = walk(path.join(REPO, "!designDocs"), []).concat(walk(path.join(REPO, "scripts"), []));
const byBasename = new Map();
for (const file of everyFile) {
	const base = path.basename(file);
	if (!byBasename.has(base)) byBasename.set(base, []);
	byBasename.get(base).push(file.split(path.sep).join("/").split("syrup-town/")[1]);
}

const missingArray = [];
const bareArray = [];

for (const doc of walk(HONEYCOMB, []).filter((f) => f.endsWith(".md"))) {
	//Archives are allowed to name files that have since moved -- that is what makes them archives.
	if (/[\\/](Archive|_archive)[\\/]/.test(doc)) continue;
	const text = fs.readFileSync(doc, "utf8");
	const directory = path.dirname(doc);
	const seen = new Set();

	for (const match of text.matchAll(/`([^`\n]+?\.(?:md|txt|js|json|html|py|sh|css))`/g)) {
		//A command line inside backticks carries its interpreter; the path is the last word.
		const reference = match[1].trim().replace(/^(node|python3?|sh|bash)\s+/, "").replace(/^"|"$/g, "");
		if (seen.has(reference) || IGNORED.includes(reference) || unresolvable(reference)) continue;
		seen.add(reference);

		if (/^(!designDocs|scripts|\.claude|v13 )/.test(reference)) {
			if (fs.existsSync(path.join(REPO, reference))) continue;
		} else if (reference.includes("/")) {
			if (fs.existsSync(path.resolve(directory, reference))) continue;
		} else {
			if (fs.existsSync(path.join(directory, reference))) continue;
			if (byBasename.has(reference)) {
				bareArray.push([doc, reference, byBasename.get(reference)]);
				continue;
			}
		}
		missingArray.push([doc, reference]);
	}
}

const shorten = (doc) => doc.split(/honeycomb[\\/]/).slice(1).join("/").split(path.sep).join("/");

//BASICS, "Nothing goes in the honeycomb root": four documents and folders, nothing else. Session 41
//found 51 entries here. This is the cheapest possible guard against it happening again.
const ALLOWED_AT_ROOT = ["BASICS.md", "CATCH-UP.md", "REQUIREMENTS.md", "FEEDBACK.md"];
const strayArray = fs.readdirSync(HONEYCOMB, { withFileTypes: true })
	.filter((entry) => entry.isFile() && !ALLOWED_AT_ROOT.includes(entry.name))
	.map((entry) => entry.name);

console.log("=== STRAY FILES AT THE HONEYCOMB ROOT: " + strayArray.length + " ===");
for (const name of strayArray) console.log("  " + name);
if (strayArray.length) {
	console.log("  -> Move each one. Tools and their output go in tools/; a design document goes inside");
	console.log("     the workstream folder it belongs to; anything temporary goes in the scratchpad.");
}
console.log("");

console.log("=== MISSING: " + missingArray.length + " ===");
for (const [doc, reference] of missingArray) console.log("  " + shorten(doc) + "  ->  " + reference);

const bareDocArray = bareArray.filter((entry) => entry[1].endsWith(".md"));
console.log("");
console.log("=== BARE .md NAME, NOT BESIDE THE DOC: " + bareDocArray.length + " ===");
for (const [doc, reference, where] of bareDocArray) {
	console.log("  " + shorten(doc) + "  ->  " + reference + "   [" + where.join(" , ") + "]");
}
console.log("");
console.log("(" + (bareArray.length - bareDocArray.length) + " bare code-file names not listed -- those read better short.)");

process.exit(missingArray.length + strayArray.length > 0 ? 1 : 0);
