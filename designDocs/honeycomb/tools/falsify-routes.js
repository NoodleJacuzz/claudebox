/**
 * Falsifier for suite block [113], the route mechanism (enemy_overhaul E7, session 45). Not part of
 * the game and not part of the suite.
 *
 * A GREEN CHECK PROVES NOTHING UNTIL IT HAS BEEN SEEN TO FAIL. This loads the real engine, breaks one
 * route function at a time back to its pre-E7 behaviour, and confirms the matching assertion from
 * [113] stops holding. A line that reads MISSED is a check that would pass against broken code, which
 * is worse than no check at all.
 *
 * Run it after editing anything under a `LANE E7 | route` banner, or after editing block [113]:
 *   node "!designDocs/honeycomb/tools/falsify-routes.js"
 *
 * Exit 0 means every assertion discriminates. Exit 1 names the ones that do not.
 * The labels below are the [113] check they stand for, not its exact current wording.
 */
const path = require("path");
const TOOLS = __dirname;

// Reuse the suite's own loader by importing its newEngine indirectly: run the suite file is too heavy,
// so rebuild the sandbox the same way it does.
const fs = require("fs");
const vm = require("vm");
const ROOT = path.resolve(__dirname, "..", "..", "..", "scripts", "misc");
const suiteText = fs.readFileSync(path.join(TOOLS, "test-honeycomb.js"), "utf8");
const fileListMatch = suiteText.match(/const FILES = \[([\s\S]*?)\];/);
const FILES = (fileListMatch[1].match(/["']([^"']+\.js)["']/g) || []).map((s) => s.slice(1, -1));

function newEngine() {
	const store = {};
	const sandbox = {
		console: { log() {}, warn() {}, debug() {}, info() {}, error() {} },
		localStorage: {
			getItem: (k) => (k in store ? store[k] : null),
			setItem: (k, v) => { store[k] = String(v); },
			removeItem: (k) => { delete store[k]; },
		},
		Date, Math, JSON, encodeURI, encodeURIComponent, decodeURIComponent,
		Object, Array, String, Number, Infinity, parseInt, parseFloat, setTimeout, clearTimeout,
		document: {
			getElementById: () => null,
			createElement: () => ({ style: { setProperty() {} }, appendChild() {}, classList: { add() {}, remove() {} } }),
			body: null,
		},
	};
	sandbox.window = sandbox;
	vm.createContext(sandbox);
	for (const file of FILES) {
		vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), sandbox, { filename: file });
	}
	return sandbox.honeycomb;
}

const PARTY = [
	{ characterIndex: "brienne", outfitIndex: "default" },
	{ characterIndex: "nettle", outfitIndex: "default" },
	{ characterIndex: "severine", outfitIndex: "default" },
];
function startRun(hc, seed) { hc.state = hc.newProfile(); return hc.newRun(PARTY, seed); }

let caught = 0;
let missed = 0;
function expectBroken(label, fn) {
	let stillGreen;
	try { stillGreen = fn() === true; } catch (error) { stillGreen = false; }
	if (stillGreen) { missed++; console.log("  MISSED  " + label + "  <-- the check would still pass against broken code"); }
	else { caught++; console.log("  caught   " + label); }
}

console.log("Falsifying [113] -- each line below breaks the engine back to its pre-E7 behaviour and");
console.log("confirms the matching assertion stops holding.\n");

// --- 1. regionIndexForDepth reverted to "the next position in regionArray" ---
{
	const hc = newEngine();
	hc.map.regionIndexForDepth = function (run, depth) {
		return hc.regionArray[Math.min(depth, hc.regionArray.length - 1)].index;
	};
	startRun(hc, 4501);
	const run = hc.state.run;
	run.routeRegionIndex = "flora";
	expectBroken("a run carrying a route descends into it", () => hc.map.regionIndexForDepth(run, 1) === "flora");

	run.regionsCleared = 1;
	run.routeRegionIndex = "pollenRoad";
	expectBroken("generateRegion() on a routed run builds that route's region",
		() => hc.map.generateRegion().regionIndex === "pollenRoad");
}

// --- 2. the win condition reverted to counting regionArray ---
{
	const hc = newEngine();
	hc.ui.globalExperienceTile = () => "";
	hc.ui.personalShareRow = () => "";
	const overlay = hc.findDefinition(hc.overlayArray, "regionCleared");
	const original = overlay.build;
	overlay.build = function (layer) {
		// Stand in for the old expression by lying about the tuned length: regionArray.length is 4.
		const saved = hc.tuning.map.route.regionsPerRun;
		hc.tuning.map.route.regionsPerRun = hc.regionArray.length;
		original.call(this, layer);
		hc.tuning.map.route.regionsPerRun = saved;
	};
	const titleAfter = (cleared) => {
		startRun(hc, 4505);
		hc.state.run.regionsCleared = cleared;
		hc.map.generateRegion();
		const layer = { innerHTML: "" };
		overlay.build(layer);
		return layer.innerHTML;
	};
	expectBroken("clearing the second wins the run", () => /The Catacombs Are Yours/.test(titleAfter(1)));
}

// --- 3. descendRegion reverted to not recording a route ---
{
	const hc = newEngine();
	hc.overlay.closeAll = () => {};
	hc.scene.go = () => {};
	hc.descendRegion = function () {
		const run = hc.state.run;
		run.regionsCleared = (run.regionsCleared == null ? 0 : run.regionsCleared) + 1;
		hc.map.generateRegion();
		hc.save.autosave("nodeComplete");
	};
	startRun(hc, 4504);
	const run = hc.state.run;
	hc.map.generateRegion();
	for (const row of run.map.rowArray) {
		for (const node of row) if (node.typeIndex === "boss") node.encounterIndex = "gardenerGrove";
	}
	hc.tuning.map.route.byBossArray[1].regionIndex = "flora";
	hc.descendRegion();
	expectBroken("descending records the route the boss chose", () => run.routeRegionIndex === "flora");
	expectBroken("  and lands the run in that region", () => run.map.regionIndex === "flora");
}

// --- 4. the route resolved once, then re-decided on a later descent ---
{
	const hc = newEngine();
	hc.overlay.closeAll = () => {};
	hc.scene.go = () => {};
	hc.descendRegion = function () {
		const run = hc.state.run;
		// The bug: no depth gate and no "already carries one" gate, so every descent re-decides.
		run.routeRegionIndex = hc.map.resolveRouteRegionIndex(run);
		run.regionsCleared = (run.regionsCleared == null ? 0 : run.regionsCleared) + 1;
		hc.map.generateRegion();
		hc.save.autosave("nodeComplete");
	};
	startRun(hc, 4504);
	const run = hc.state.run;
	hc.map.generateRegion();
	for (const row of run.map.rowArray) {
		for (const node of row) if (node.typeIndex === "boss") node.encounterIndex = "gardenerGrove";
	}
	hc.tuning.map.route.byBossArray[1].regionIndex = "flora";
	hc.descendRegion();
	hc.tuning.map.route.byBossArray[1].regionIndex = "pollenRoad";
	hc.descendRegion();
	expectBroken("a later descent does not re-decide the route", () => run.routeRegionIndex === "flora");
}

// --- 5. countedRegionArray reverted to listing the whole table ---
{
	const hc = newEngine();
	hc.map.countedRegionArray = function () {
		const result = [];
		for (const region of hc.regionArray) result.push(region.index);
		return result;
	};
	const kind = hc.findDefinition(hc.discoveryKindArray, "region");
	expectBroken("countedRegionArray in the OFF state is exactly the two live regions",
		() => hc.map.countedRegionArray().join() === "upperCatacombs,floodedVault");
	expectBroken("the discovery ledger's region total is the counted set",
		() => kind.allIndexArray().join() === "upperCatacombs,floodedVault");
}

// --- 6. countedRegionArray leaking a secret override region ---
{
	const hc = newEngine();
	const original = hc.map.countedRegionArray;
	hc.map.countedRegionArray = function () {
		const result = original.call(this);
		for (const row of hc.tuning.map.route.overrideArray) {
			if (result.indexOf(row.regionIndex) < 0) result.push(row.regionIndex);
		}
		return result;
	};
	hc.tuning.map.route.overrideArray.push({ relicIndex: "ironSigil", regionIndex: "pollenRoad" });
	expectBroken("a region only an overrideArray row names stays out of the count",
		() => hc.map.countedRegionArray().join() === "upperCatacombs,floodedVault");
}

// --- 7. resolution order reversed: the boss beating a held relic ---
{
	const hc = newEngine();
	hc.map.resolveRouteRegionIndex = function (run) {
		const route = hc.tuning.map.route;
		const boss = hc.map.mapBossEncounterIndex(run.map);
		for (const row of route.byBossArray) if (row.bossEncounterIndex === boss) return row.regionIndex;
		for (const row of route.overrideArray) {
			for (const held of run.relicArray) if (held.index === row.relicIndex) return row.regionIndex;
		}
		return route.defaultSecondRegion;
	};
	startRun(hc, 4503);
	const run = hc.state.run;
	hc.map.generateRegion();
	for (const row of run.map.rowArray) {
		for (const node of row) if (node.typeIndex === "boss") node.encounterIndex = "gardenerGrove";
	}
	hc.tuning.map.route.byBossArray[1].regionIndex = "flora";
	hc.tuning.map.route.overrideArray.push({ relicIndex: "zzRouteKey", regionIndex: "pollenRoad" });
	run.relicArray.push({ index: "zzRouteKey" });
	expectBroken("an override the run DOES hold outranks the boss",
		() => hc.map.resolveRouteRegionIndex(run) === "pollenRoad");
}

// --- 8. the old-save default removed ---
{
	const hc = newEngine();
	hc.map.regionIndexForDepth = function (run, depth) {
		if (depth <= 0) return hc.regionArray[0].index;
		return run.routeRegionIndex;
	};
	startRun(hc, 4501);
	const run = hc.state.run;
	run.routeRegionIndex = null;
	run.regionsCleared = 1;
	expectBroken("a run carrying no route descends into the default",
		() => hc.map.regionIndexForDepth(run, 1) === "floodedVault");
	expectBroken("generateRegion() on an old-shaped run builds the default second region",
		() => hc.map.generateRegion().regionIndex === "floodedVault");
}

console.log("\n" + caught + " assertions caught the break, " + missed + " missed.");
process.exit(missed === 0 ? 0 : 1);
