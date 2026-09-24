//===================================================================================================
//HONEYCOMB -- EXP model
//===================================================================================================
//Answers, and warns about, the meta-progression economy:
//
//  * how much PERSONAL experience a run pays a character (fighting), and how much GLOBAL experience
//    the whole content pool is worth (first-time discovery)
//  * how many runs it takes to max one character's tree at a chosen average node cost
//  * whether GLOBAL is growing too fast -- that is, whether discovery alone funds more (or less) than
//    its target share of every character's tree
//  * the scale factor that would bring GLOBAL to that target, so it does ~half of each tree and the
//    character's own EXP does the other half
//
//The award values are READ FROM THE GAME (`discoveryKindArray` in honeycomb-progression.js) so this
//never drifts from the shipped tuning. Counts and run shape are CONFIG -- update them when content or
//the map changes. Run it after any award or content change:
//
//  node "!designDocs/honeycomb/tools/exp-model.js"
//  node "!designDocs/honeycomb/tools/exp-model.js" --cost 150 --characters 6 --strict
//
//`--strict` exits non-zero when a warning fires, so a release workflow can hold on it.

const fs = require("fs");
const path = require("path");

const PROGRESSION_FILE = path.resolve(__dirname, "..", "..", "..", "scripts", "misc", "honeycomb", "honeycomb-progression.js");
const TUNING_FILE = path.resolve(__dirname, "..", "..", "..", "scripts", "misc", "honeycomb", "honeycomb-tuning.js");

//---------------------------------------------------------------------------------------------------
//Config. Content counts: keep in step with the boot warnings report
//(`honeycomb.warnings.report()` -- "Cards 249, Characters 6, Enemies 11, ...").
//---------------------------------------------------------------------------------------------------
const CONFIG = {
	characters: 6,
	//Purchasable nodes in one build (exclusive paths removed), from SKELETON-MAPPING.md.
	perCharacterNodes: 30,
	//The chosen average node cost from TREE-EXP-MATH.md.
	averageNodeCost: 150,
	partySize: 3,
	run: { combats: 20, elites: 4, bosses: 3, events: 10, rests: 5, shops: 5, treasure: 4, enemiesPerFight: 2 },
	//Discoverable counts per kind. `card` is how many distinct player cards a committed collector ends
	//up holding, not the whole table (curses and enemy moves are excluded by the game already).
	content: { enemy: 11, encounter: 20, event: 13, relic: 23, card: 200, outfit: 18, equipment: 4, region: 2 },
	//Fraction of the global pool discovered by run N. Rough; the shape matters more than the exact fit.
	discoveryCurve: [[5, 0.45], [10, 0.70], [15, 0.85], [20, 0.93], [30, 0.99]],
	//GLOBAL should fund this share of each character's tree.
	globalShareTarget: 0.5,
	//Warning bands.
	warning: { minimumGlobalShare: 0.35, maximumGlobalShare: 0.65, maximumGlobalPerRunRatio: 2.0 },
};

function argument(name, fallback) {
	const index = process.argv.indexOf("--" + name);
	if (index < 0) return fallback;
	const value = process.argv[index + 1];
	return value == null || value.indexOf("--") === 0 ? true : value;
}

//---------------------------------------------------------------------------------------------------
//Read the shipped award table.
//---------------------------------------------------------------------------------------------------
function readAwards() {
	const text = fs.readFileSync(PROGRESSION_FILE, "utf8");
	const start = text.indexOf("honeycomb.discoveryKindArray = [");
	const end = text.indexOf("\n];", start);
	const block = text.slice(start, end);
	const awards = {};
	const entryPattern = /index:\s*"([^"]+)"[\s\S]*?baseExperience:\s*(\d+)[\s\S]*?firstExperience:\s*(\d+)/g;
	let match;
	while ((match = entryPattern.exec(block)) != null) {
		awards[match[1]] = { base: Number(match[2]), first: Number(match[3]) };
	}
	//Run victory lives in tuning, not the discovery table.
	const tuningText = fs.readFileSync(TUNING_FILE, "utf8");
	const victoryMatch = tuningText.match(/runVictoryExperience:\s*(\d+)/);
	awards.victory = { base: victoryMatch == null ? 0 : Number(victoryMatch[1]), first: 0 };
	return awards;
}

//---------------------------------------------------------------------------------------------------
//The model.
//---------------------------------------------------------------------------------------------------
//Personal experience a full run earns BEFORE the party split, from the shipped base awards.
function personalPerRun(awards) {
	const run = CONFIG.run;
	const fights = run.combats + run.elites + run.bosses;
	const encounter = fights * (awards.encounter == null ? 0 : awards.encounter.base);
	const enemy = fights * run.enemiesPerFight * (awards.enemy == null ? 0 : awards.enemy.base);
	const event = run.events * (awards.event == null ? 0 : awards.event.base);
	const region = 3 * (awards.region == null ? 0 : awards.region.base);   // one per act cleared
	const victory = awards.victory == null ? 0 : awards.victory.base;
	const preSplit = encounter + enemy + event + region + victory;
	return {
		encounter, enemy, event, region, victory, preSplit,
		perCharacter: preSplit / CONFIG.partySize,
		breakdown: { fights, encounter, enemy, event, region, victory },
	};
}

//The one-time GLOBAL pool: each discoverable thing times its first-time award.
function globalPool(awards) {
	const parts = {};
	let total = 0;
	for (const kind of Object.keys(CONFIG.content)) {
		const count = CONFIG.content[kind];
		const first = awards[kind] == null ? 0 : awards[kind].first;
		parts[kind] = { count, first, total: count * first };
		total += parts[kind].total;
	}
	return { total, parts };
}

function discoveredFraction(runs) {
	const curve = CONFIG.discoveryCurve;
	if (runs <= curve[0][0]) return (runs / curve[0][0]) * curve[0][1];
	for (let index = 1; index < curve.length; index++) {
		const [x0, y0] = curve[index - 1];
		const [x1, y1] = curve[index];
		if (runs <= x1) return y0 + ((runs - x0) / (x1 - x0)) * (y1 - y0);
	}
	return curve[curve.length - 1][1];
}

//Runs for one character to afford `treeCost` from personal income plus their share of global.
function runsToMax(treeCost, personal, globalPerCharacter) {
	for (let runs = 1; runs <= 500; runs++) {
		const total = personal * runs + globalPerCharacter * discoveredFraction(runs);
		if (total >= treeCost) return runs;
	}
	return Infinity;
}

function run() {
	CONFIG.averageNodeCost = Number(argument("cost", CONFIG.averageNodeCost));
	CONFIG.characters = Number(argument("characters", CONFIG.characters));
	CONFIG.perCharacterNodes = Number(argument("nodes", CONFIG.perCharacterNodes));
	const awards = readAwards();
	const personal = personalPerRun(awards);
	const global = globalPool(awards);
	const treeCost = CONFIG.perCharacterNodes * CONFIG.averageNodeCost;
	const totalTreeCost = treeCost * CONFIG.characters;
	const globalPerCharacter = global.total / CONFIG.characters;
	const globalShare = globalPerCharacter / treeCost;
	const targetGlobalPool = totalTreeCost * CONFIG.globalShareTarget;
	const scale = targetGlobalPool / global.total;
	const runs = runsToMax(treeCost, personal.perCharacter, globalPerCharacter);

	const warningArray = [];
	if (globalShare > CONFIG.warning.maximumGlobalShare) warningArray.push("GLOBAL is too high: it funds " +
		Math.round(globalShare * 100) + "% of each tree (band " + Math.round(CONFIG.warning.minimumGlobalShare * 100) +
		"-" + Math.round(CONFIG.warning.maximumGlobalShare * 100) + "%). Scale first-time awards by " + scale.toFixed(2) + ".");
	if (globalShare < CONFIG.warning.minimumGlobalShare) warningArray.push("GLOBAL is too low: it funds " +
		Math.round(globalShare * 100) + "% of each tree (band " + Math.round(CONFIG.warning.minimumGlobalShare * 100) +
		"-" + Math.round(CONFIG.warning.maximumGlobalShare * 100) + "%). Scale first-time awards by " + scale.toFixed(2) + ".");
	const firstRunGlobal = global.total * discoveredFraction(1);
	if (firstRunGlobal > personal.preSplit * CONFIG.warning.maximumGlobalPerRunRatio) {
		warningArray.push("GLOBAL growth outpaces play: run 1 discovers ~" + Math.round(firstRunGlobal) +
			" global vs " + Math.round(personal.preSplit) + " personal (" + (firstRunGlobal / personal.preSplit).toFixed(1) +
			"x, cap " + CONFIG.warning.maximumGlobalPerRunRatio + "x).");
	}

	const line = (label, value) => console.log("  " + label.padEnd(34) + value);
	console.log("\nHONEYCOMB -- EXP model");
	console.log("  " + "-".repeat(60));
	console.log("  RUN SHAPE");
	line("party size", CONFIG.partySize);
	line("fights (combat+elite+boss)", personal.breakdown.fights);
	line("events / rests / shops / treasure", CONFIG.run.events + " / " + CONFIG.run.rests + " / " + CONFIG.run.shops + " / " + CONFIG.run.treasure);
	console.log("  PERSONAL PER RUN");
	line("  encounter / enemy", personal.encounter + " / " + personal.enemy);
	line("  event / region / win", personal.event + " / " + personal.region + " / " + personal.victory);
	line("pre-split", personal.preSplit);
	line("per character (split " + CONFIG.partySize + ")", personal.perCharacter.toFixed(1));
	console.log("  GLOBAL POOL (one-time)");
	for (const kind of Object.keys(global.parts)) {
		const part = global.parts[kind];
		line("  " + kind, part.count + " x " + part.first + " = " + part.total);
	}
	line("total pool", global.total);
	console.log("  TREES");
	line("nodes per character", CONFIG.perCharacterNodes);
	line("average node cost", CONFIG.averageNodeCost);
	line("tree cost", treeCost);
	line("all trees", totalTreeCost);
	console.log("  RESULT");
	line("global per character", Math.round(globalPerCharacter));
	line("global share of a tree", Math.round(globalShare * 100) + "%  (target " + Math.round(CONFIG.globalShareTarget * 100) + "%)");
	line("target global pool", Math.round(targetGlobalPool));
	line("scale first-time awards by", scale.toFixed(3));
	line("runs to max one character", runs === Infinity ? "never" : runs);
	console.log("  TO HIT THE " + Math.round(CONFIG.globalShareTarget * 100) + "% TARGET, first-time awards become:");
	for (const kind of Object.keys(global.parts)) {
		const part = global.parts[kind];
		line("  " + kind, part.first + " -> " + Math.round(part.first * scale) + "   (" + part.count + " x)");
	}
	console.log("");
	if (warningArray.length === 0) console.log("  OK -- no warnings.\n");
	else {
		console.log("  WARNINGS");
		for (const text of warningArray) console.log("   ! " + text);
		console.log("");
	}
	return warningArray.length;
}

const warningCount = run();
if (argument("strict", false) && warningCount > 0) process.exit(1);
