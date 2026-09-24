//===================================================================================================
//HONEYCOMB CATACOMBS -- feedback index audit (developer tool, never loaded by the game)
//===================================================================================================
//Session 41 split feedback out of the numbered rounds: every workstream folder keeps its own
//FEEDBACK.md, and the root FEEDBACK.md carries an index of how many items are open in each.
//
//That index is the early-stop detector. A session that is cut off mid-task often manages to close an
//item in a workstream file but never gets back to the root index -- so a row that disagrees with its
//folder is the signal that the previous session left something half-finished. This makes the check a
//command instead of something a session has to remember to do by eye.
//
//Also reports a workstream folder with no FEEDBACK.md, and one that is not indexed at all.
//
//Exit code is 1 on any disagreement.

const fs = require("fs");
const path = require("path");

const HONEYCOMB = path.resolve(__dirname, "..");

//Folders that are workstreams. Anything else at this level is reference, archive or tooling.
const NOT_A_WORKSTREAM = ["Archive", "reference", "tools", "designBibles"];

function findWorkstreamArray() {
	const out = [];
	const walk = (relative) => {
		for (const entry of fs.readdirSync(path.join(HONEYCOMB, relative || "."), { withFileTypes: true })) {
			if (!entry.isDirectory() || entry.name.startsWith("_") || NOT_A_WORKSTREAM.includes(entry.name)) continue;
			const here = relative ? relative + "/" + entry.name : entry.name;
			if (fs.existsSync(path.join(HONEYCOMB, here, "FEEDBACK.md"))) out.push(here);
			//rework/ is a container of workstreams rather than one itself.
			else walk(here);
		}
	};
	walk("");
	return out;
}

//An open item is a "### " heading in a workstream feedback file. Closed ones move to _archive/.
function countOpen(workstream) {
	const text = fs.readFileSync(path.join(HONEYCOMB, workstream, "FEEDBACK.md"), "utf8");
	return text.split("\n").filter((line) => /^### /.test(line)).length;
}

//The root index names each folder in a backticked path and gives its count in the next cell.
//Only the table under "## The index" counts. The demo-gate table above it names the same folders in
//the same backtick style and would otherwise be read as a second, countless set of rows.
function readIndex() {
	const whole = fs.readFileSync(path.join(HONEYCOMB, "FEEDBACK.md"), "utf8");
	const from = whole.indexOf("## The index");
	if (from < 0) {
		console.log("FEEDBACK.md has no \"## The index\" heading -- nothing to audit against.");
		process.exit(1);
	}
	const after = whole.indexOf("\n## ", from + 1);
	const text = whole.slice(from, after < 0 ? whole.length : after);
	const found = new Map();
	for (const line of text.split("\n")) {
		if (!line.startsWith("|")) continue;
		const cellArray = line.split("|").map((cell) => cell.trim());
		const nameCell = cellArray.find((cell) => /^\*\*`[^`]+\/`\*\*$/.test(cell));
		if (!nameCell) continue;
		const folder = nameCell.replace(/\*\*|`/g, "").replace(/\/$/, "");
		const countCell = cellArray.find((cell, i) => i > cellArray.indexOf(nameCell) && /^\*\*?\d+\*?\*?$/.test(cell));
		if (countCell) found.set(folder, parseInt(countCell.replace(/\*/g, ""), 10));
	}
	return found;
}

const workstreamArray = findWorkstreamArray();
const indexed = readIndex();
const problemArray = [];

console.log("workstream                 indexed   actual");
console.log("------------------------------------------");
for (const workstream of workstreamArray.sort()) {
	const actual = countOpen(workstream);
	const claimed = indexed.has(workstream) ? indexed.get(workstream) : null;
	const agree = claimed === actual;
	console.log(
		workstream.padEnd(26) +
		String(claimed === null ? "NOT INDEXED" : claimed).padStart(7) +
		String(actual).padStart(9) +
		(agree ? "" : "   <-- DISAGREES")
	);
	if (!agree) problemArray.push(workstream + ": index says " + claimed + ", file has " + actual);
}

for (const folder of indexed.keys()) {
	if (!workstreamArray.includes(folder)) problemArray.push(folder + ": indexed, but has no FEEDBACK.md");
}

console.log("");
if (problemArray.length === 0) {
	console.log("OK -- the root index agrees with every workstream (" +
		workstreamArray.reduce((sum, w) => sum + countOpen(w), 0) + " items open).");
	process.exit(0);
}
console.log(problemArray.length + " disagreement(s). The FOLDER is the truth; the index is what a");
console.log("cut-short session forgets to update. Check each folder below for a half-finished item,");
console.log("then correct the row in FEEDBACK.md.");
for (const problem of problemArray) console.log("  - " + problem);
process.exit(1);
