/**
 * Encounter coverage for Honeycomb Catacombs (rework/enemies/ENEMIES-01.md §4). Not part of the game.
 *
 * Generates real runs with the game's own map generator, walks a path through each region, and counts
 * the fights met: per region, per tier, elites and bosses, and which ENEMY TYPES were seen. Then answers
 * Noodle's question: how likely is a player to have seen every enemy type after N runs?
 *
 * Paths: "random" takes a random child at every step; "fights" prefers a combat or elite child when one
 * exists (a player hunting card rewards). The first region's boss is always met; a run is assumed to
 * reach the last region (a full clear), which is the most coverage a run can give.
 *
 * Usage:  node "!designDocs/honeycomb/tools/encounter-coverage.js" [--runs N] [--window 3] [--path random|fights]
 */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..", "..", "..", "scripts", "misc");
const FILES = eval(fs.readFileSync(path.join(__dirname, "card-inventory.js"), "utf8").match(/const FILES = (\[[\s\S]*?\]);/)[1]);

function newEngine() {
	const sandbox = {
		console: { log() {}, warn() {}, debug() {}, info() {}, error() {} },
		localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
		Date, Math, JSON, encodeURI, encodeURIComponent, decodeURIComponent, Object, Array, String, Number, Infinity, parseInt, parseFloat, setTimeout, clearTimeout,
		document: { getElementById: () => null, createElement: () => ({ style: { setProperty() {} }, appendChild() {}, classList: { add() {}, remove() {} } }), body: null },
	};
	sandbox.window = sandbox;
	vm.createContext(sandbox);
	for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f });
	return sandbox.honeycomb;
}

const argv = process.argv.slice(2);
function option(name, fallback) { const at = argv.indexOf(name); return at < 0 ? fallback : argv[at + 1]; }
const RUNS = parseInt(option("--runs", "600"), 10);
const WINDOW = parseInt(option("--window", "3"), 10);
const PATH = option("--path", "random");

const hc = newEngine();

function walkRegion(regionIndex, seed) {
	const map = hc.map.generateRegion(hc.regionArray[regionIndex].index);
	const rowArray = map.rowArray;
	const byId = {};
	for (const row of rowArray) for (const node of row) byId[node.id] = node;
	const met = [];
	let node = rowArray[0][hc.rng.range(hc.tuning.rng.streamArray.map, 0, rowArray[0].length - 1)];
	while (node != null) {
		if (node.encounterIndex != null) met.push({ encounterIndex: node.encounterIndex, type: node.typeIndex, row: node.rowIndex, rowCount: rowArray.length });
		const children = (node.edgeArray || []).map((id) => byId[id]).filter(Boolean);
		if (children.length === 0) break;
		let pool = children;
		if (PATH === "fights") {
			const fights = children.filter((child) => child.typeIndex === "combat" || child.typeIndex === "elite");
			if (fights.length > 0) pool = fights;
		}
		node = pool[hc.rng.range(hc.tuning.rng.streamArray.map, 0, pool.length - 1)];
	}
	return met;
}

const runArray = [];
for (let seed = 1; seed <= RUNS; seed++) {
	hc.state = hc.newProfile();
	hc.newRun([{ characterIndex: "brienne", outfitIndex: "default" }], seed * 7919);
	const run = { fights: [], enemies: new Set() };
	for (let regionIndex = 0; regionIndex < hc.regionArray.length; regionIndex++) {
		for (const fight of walkRegion(regionIndex, seed)) {
			fight.regionIndex = regionIndex;
			run.fights.push(fight);
			const encounter = hc.findDefinition(hc.encounterArray, fight.encounterIndex);
			for (const enemyIndex of encounter.enemyIndexArray) run.enemies.add(enemyIndex);
		}
	}
	runArray.push(run);
}

//Per-run counts.
const mean = (values) => values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);
const groups = {};
for (const run of runArray) {
	const counts = {};
	for (const fight of run.fights) {
		const encounter = hc.findDefinition(hc.encounterArray, fight.encounterIndex);
		const key = "R" + (fight.regionIndex + 1) + " " + (encounter.tier === "boss" ? "boss" : (encounter.isElite ? "elite " : "normal ") + encounter.tier);
		counts[key] = (counts[key] || 0) + 1;
	}
	for (const key of Object.keys(counts)) (groups[key] = groups[key] || []).push(counts[key]);
}
console.log("ENCOUNTER COVERAGE -- " + RUNS + " generated runs, path: " + PATH);
console.log("fights per run: " + mean(runArray.map((r) => r.fights.length)).toFixed(1));
for (const key of Object.keys(groups).sort()) console.log("  " + key.padEnd(22) + (groups[key].reduce((a, b) => a + b, 0) / RUNS).toFixed(2));

//Which enemy types exist at all (reachable from some encounter a map can roll or a boss names).
const allEnemies = new Set();
for (const encounter of hc.encounterArray) {
	if (encounter.testFixture === true) continue;
	for (const enemyIndex of encounter.enemyIndexArray) allEnemies.add(enemyIndex);
}
const bossEnemies = new Set();
for (const region of hc.regionArray) {
	for (const bossIndex of region.bossEncounterIndexArray || [region.bossEncounterIndex]) {
		const boss = hc.findDefinition(hc.encounterArray, bossIndex);
		if (boss) for (const enemyIndex of boss.enemyIndexArray) bossEnemies.add(enemyIndex);
	}
}

console.log("\nP(enemy type seen in one run):");
const perEnemy = [...allEnemies].map((enemyIndex) => ({ enemyIndex, p: runArray.filter((r) => r.enemies.has(enemyIndex)).length / RUNS }))
	.sort((a, b) => a.p - b.p);
for (const row of perEnemy) console.log("  " + row.enemyIndex.padEnd(20) + (row.p * 100).toFixed(0) + "%" + (bossEnemies.has(row.enemyIndex) ? "  (boss)" : ""));

//P(all seen within WINDOW runs), by sliding over consecutive generated runs.
function allSeenRate(filter) {
	let hits = 0, trials = 0;
	const wanted = [...allEnemies].filter(filter);
	for (let start = 0; start + WINDOW <= runArray.length; start += WINDOW) {
		const seen = new Set();
		for (let offset = 0; offset < WINDOW; offset++) for (const e of runArray[start + offset].enemies) seen.add(e);
		trials += 1;
		if (wanted.every((e) => seen.has(e))) hits += 1;
	}
	return { rate: hits / Math.max(1, trials), count: wanted.length };
}
const everything = allSeenRate(() => true);
const nonBoss = allSeenRate((e) => !bossEnemies.has(e));
console.log("\nP(every enemy type seen within " + WINDOW + " full runs): " + (everything.rate * 100).toFixed(1) + "%  (" + everything.count + " types)");
console.log("P(every NON-BOSS type seen within " + WINDOW + " full runs): " + (nonBoss.rate * 100).toFixed(1) + "%  (" + nonBoss.count + " types)");
