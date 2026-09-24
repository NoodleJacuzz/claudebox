/**
 * Sums a Node CPU profile by function, so a slow balance tool can be read at a glance. Not part of the game.
 *
 * Usage:
 *   node --cpu-prof --cpu-prof-dir=<folder> "<any tool>.js" [its options]
 *   node "!designDocs/honeycomb/tools/balance/profile-summary.js" <folder> [--top 22]
 *
 * Prints each function's share of the time spent in its OWN body (not in what it calls), highest first.
 * Session 52 used this to find that 76% of the budget audit was progression tree lookups
 * (balance_tests/BRIEF.md, Step 1).
 */
const fs = require("fs"), path = require("path");

const folder = process.argv[2];
const topAt = process.argv.indexOf("--top");
const TOP = topAt < 0 ? 22 : parseInt(process.argv[topAt + 1], 10);
if (!folder || !fs.existsSync(folder)) { console.error("Give the folder passed to --cpu-prof-dir."); process.exit(1); }

const profileFiles = fs.readdirSync(folder).filter((name) => name.endsWith(".cpuprofile"));
if (profileFiles.length === 0) { console.error("No .cpuprofile file in " + folder); process.exit(1); }

for (const name of profileFiles) {
	const profile = JSON.parse(fs.readFileSync(path.join(folder, name), "utf8"));
	const nodeById = new Map(profile.nodes.map((node) => [node.id, node]));
	const selfTime = new Map();
	let total = 0;
	profile.samples.forEach((id, sampleIndex) => {
		const frame = nodeById.get(id).callFrame;
		const key = (frame.functionName || "(anonymous)") + "  " + frame.url.split(/[\\/]/).pop() + ":" + (frame.lineNumber + 1);
		selfTime.set(key, (selfTime.get(key) || 0) + profile.timeDeltas[sampleIndex]);
		total += profile.timeDeltas[sampleIndex];
	});
	console.log(name + " -- " + (total / 1e6).toFixed(1) + " seconds sampled");
	[...selfTime.entries()].sort((a, b) => b[1] - a[1]).slice(0, TOP)
		.forEach(([key, time]) => console.log("  " + (time / total * 100).toFixed(1).padStart(5) + "%  " + key));
}
