/**
 * Lust share report for Honeycomb Catacombs (enemy_overhaul/ E3). Not part of the game.
 *
 * E3 IS THE MEASURE OF WHETHER THE ENEMY OVERHAUL WORKED. Session 42 measured the roster at 12% of
 * enemy moves dealing Lust and set the target at roughly a quarter to a third. This turns that from a
 * one-off count into an instrument, so the number can be re-checked after any content edit.
 *
 * Three views, because "how much Lust" has three honest answers:
 *   SHARE     what fraction of enemy moves deal Lust at all -- the number E3 quotes.
 *   TAGS      which lust tags the roster teaches, since untagged Lust teaches the ledger nothing.
 *   PRESSURE  expected Lust per turn beside expected damage per turn, weighted by move weight. This
 *             is what a sub-act's "much less focus on lust" actually means, and it is what
 *             tuning.balance.lustToDamageRatioMaximum caps per line-up.
 *
 * Golems (Anastasia's pieces) are excluded throughout: they are a character's summons, not the run's
 * bestiary, the same exclusion honeycomb.compareEnemiesForReading makes.
 *
 * Usage:  node "!designDocs/honeycomb/tools/lust-share.js"
 */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..", "..", "..", "scripts", "misc");
const FILES = eval(fs.readFileSync(path.join(__dirname, "card-inventory.js"), "utf8").match(/const FILES = (\[[\s\S]*?\]);/)[1]);
const sandbox = {
	console: { log() {}, warn() {}, debug() {}, info() {}, error() {} },
	localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
	Date, Math, JSON, encodeURI, encodeURIComponent, decodeURIComponent, Object, Array, String, Number, Infinity, parseInt, parseFloat, setTimeout, clearTimeout,
	document: { getElementById: () => null, createElement: () => ({ style: { setProperty() {} }, appendChild() {}, classList: { add() {}, remove() {} } }), body: null },
};
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f });
const hc = sandbox.honeycomb;

//A party of three is what every budget in tuning.balance is written against, so a move that hits
//everyone counts three times here for the same reason it does in enemy-template.js.
const PARTY_SIZE = 3;

function isGolem(enemy) { return hc.definitionHasTag(enemy, "golem") === true; }

function targetCount(targetMode) {
	const definition = hc.targetModeDefinition(targetMode);
	return definition != null && definition.wholeTeam === true ? PARTY_SIZE : 1;
}

//Damage and Lust one play of a move threatens, summed over its targets. Deliberately the same walk
//enemy-template.js makes, so the two tools cannot disagree about what a move costs.
function moveThreat(card) {
	let damage = 0, lust = 0;
	function walk(effectArray, multiplier, targetMode) {
		for (const effect of effectArray || []) {
			if (effect == null || effect.targetOverride === "self") continue;
			const mode = effect.targetOverride != null ? effect.targetOverride : targetMode;
			const count = targetCount(mode);
			const amount = typeof effect.amount === "number" ? effect.amount : 0;
			if (effect.index === "damage" || effect.index === "damageIgnoringTemporary") damage += amount * count * multiplier;
			else if (effect.index === "lust") lust += amount * count * multiplier;
			else if (effect.index === "applyStatus" && effect.status === "poison") damage += (effect.stacks * (effect.stacks + 1) / 2) * count * multiplier;
			else if (effect.index === "repeat") walk(effect.effectArray, multiplier * (effect.times || 1), mode);
		}
	}
	walk(card.effectArray, 1, card.targetMode);
	return { damage: damage, lust: lust };
}

//The registered lust tags, read off honeycomb.cardTagArray rather than hard-coded, so a sixth tag
//appears here the moment one is registered. honeycomb-warnings.js is not among the files the headless
//load pulls in, so its identical helper cannot be borrowed.
const LUST_TAG_ARRAY = hc.cardTagArray.filter((tag) => tag.lustTag === true).map((tag) => tag.index);
function lustTagsAmong(tagArray) {
	if (tagArray == null) return [];
	return LUST_TAG_ARRAY.filter((tag) => tagArray.indexOf(tag) >= 0);
}

//The lust tags a move teaches: its own `lustTagArray` when it names one, otherwise the card's tags,
//which is the fallback honeycomb.gainLust actually applies.
function moveLustTagArray(card) {
	let named = null;
	function walk(effectArray) {
		for (const effect of effectArray || []) {
			if (effect == null) continue;
			if (effect.index === "lust" && effect.lustTagArray != null) named = (named || []).concat(effect.lustTagArray);
			walk(effect.effectArray);
		}
	}
	walk(card.effectArray);
	if (named != null) return named;
	return lustTagsAmong(card.tagArray);
}

//Every distinct move an enemy can play, across its move list and any threshold phases.
function enemyMoveArray(enemy) {
	const seen = {}, result = [];
	function add(cardIndex, weight) {
		if (cardIndex == null || seen[cardIndex] === true) return;
		seen[cardIndex] = true;
		const card = hc.findDefinition(hc.cardArray, cardIndex);
		if (card == null) return;
		result.push({ index: cardIndex, card: card, weight: typeof weight === "number" ? weight : null });
	}
	for (const move of enemy.moveArray || []) add(move.card, move.weight);
	for (const phase of enemy.phaseArray || []) {
		for (const move of phase.moveArray || []) add(typeof move === "string" ? move : move.card, typeof move === "string" ? null : move.weight);
	}
	return result;
}

//Expected damage and Lust per turn. A "sequence" enemy walks a fixed lap, so every move is played
//equally often; a weighted one plays each move in proportion to its weight.
function enemyPressure(enemy) {
	const moveArray = enemyMoveArray(enemy);
	if (moveArray.length === 0) return { damage: 0, lust: 0 };
	let damage = 0, lust = 0, weightTotal = 0;
	for (const move of moveArray) {
		const threat = moveThreat(move.card);
		const weight = enemy.moveStrategy === "sequence" || move.weight == null ? 1 : move.weight;
		damage += threat.damage * weight;
		lust += threat.lust * weight;
		weightTotal += weight;
	}
	return { damage: damage / weightTotal, lust: lust / weightTotal };
}

//Which regions an enemy is actually met in, read off the encounter table rather than assumed. A boss
//encounter carries no regionIndexArray, so its region is whichever region's boss pool names it.
const regionOfEnemy = {};
function noteRegion(enemyIndex, regionIndex) {
	const set = regionOfEnemy[enemyIndex] = regionOfEnemy[enemyIndex] || {};
	set[regionIndex] = true;
}
const bossRegionOfEncounter = {};
for (let regionIndex = 0; regionIndex < hc.regionArray.length; regionIndex++) {
	const region = hc.regionArray[regionIndex];
	for (const encounterIndex of region.bossEncounterIndexArray || [region.bossEncounterIndex]) {
		if (encounterIndex != null) bossRegionOfEncounter[encounterIndex] = regionIndex;
	}
}
for (const encounter of hc.encounterArray) {
	if (encounter.testFixture === true) continue;
	let regionIndexArray = encounter.regionIndexArray;
	if (regionIndexArray == null && bossRegionOfEncounter[encounter.index] != null) regionIndexArray = [bossRegionOfEncounter[encounter.index]];
	if (regionIndexArray == null) continue;
	for (const regionIndex of regionIndexArray) {
		for (const enemyIndex of encounter.enemyIndexArray || []) noteRegion(enemyIndex, regionIndex);
		for (const enemyIndex of encounter.reinforcementArray || []) noteRegion(enemyIndex, regionIndex);
	}
}

const enemyArray = hc.enemyArray.filter((enemy) => !isGolem(enemy));

//--- SHARE, roster-wide and per region -------------------------------------------------------------
const tally = { roster: { moves: 0, lust: 0, untagged: 0 }, region: {} };
const tagCount = {};
const silentArray = [];
for (const enemy of enemyArray) {
	const moveArray = enemyMoveArray(enemy);
	let enemyLust = 0;
	for (const move of moveArray) {
		const threat = moveThreat(move.card);
		const dealsLust = threat.lust > 0;
		tally.roster.moves++;
		if (dealsLust) {
			tally.roster.lust++;
			enemyLust++;
			const tagArray = moveLustTagArray(move.card);
			if (tagArray.length === 0) { tally.roster.untagged++; silentArray.push(enemy.index + " / " + move.index + " (untagged)"); }
			for (const tag of tagArray) tagCount[tag] = (tagCount[tag] || 0) + 1;
		}
		for (const regionIndex of Object.keys(regionOfEnemy[enemy.index] || {})) {
			const bucket = tally.region[regionIndex] = tally.region[regionIndex] || { moves: 0, lust: 0 };
			bucket.moves++;
			if (dealsLust) bucket.lust++;
		}
	}
	if (enemyLust === 0) silentArray.push(enemy.index + " teaches no lust tag at all");
}

function percent(part, whole) { return whole === 0 ? "n/a" : (100 * part / whole).toFixed(1) + "%"; }

console.log("LUST SHARE (enemy_overhaul E3). Target: roughly a quarter to a third of enemy moves.\n");
console.log("SHARE");
console.log("  roster:  " + tally.roster.lust + " of " + tally.roster.moves + " moves deal Lust = " + percent(tally.roster.lust, tally.roster.moves));
for (let regionIndex = 0; regionIndex < hc.regionArray.length; regionIndex++) {
	const bucket = tally.region[regionIndex];
	if (bucket == null) continue;
	console.log("  " + hc.regionArray[regionIndex].name + ": " + bucket.lust + " of " + bucket.moves + " = " + percent(bucket.lust, bucket.moves));
}

console.log("\nTAGS  (a Lust move with no lust tag teaches the ledger nothing)");
for (const tag of LUST_TAG_ARRAY) console.log("  " + tag.padEnd(12) + (tagCount[tag] || 0));
console.log("  " + "UNTAGGED".padEnd(12) + tally.roster.untagged);

//--- PRESSURE ---------------------------------------------------------------------------------------
console.log("\nPRESSURE  expected per turn at full strength, and Lust as a share of the pair.");
console.log("  " + "enemy".padEnd(18) + "reg  " + "dmg".padStart(6) + "  " + "lust".padStart(6) + "  share");
const ratioMaximum = hc.tuning.balance.lustToDamageRatioMaximum;
let overArray = [];
for (const enemy of enemyArray.slice().sort(hc.compareEnemiesForReading)) {
	const pressure = enemyPressure(enemy);
	const regionText = Object.keys(regionOfEnemy[enemy.index] || {}).map((index) => "R" + (Number(index) + 1)).join("/") || "-";
	const total = pressure.damage + pressure.lust;
	console.log("  " + enemy.index.padEnd(18) + regionText.padEnd(5) + pressure.damage.toFixed(1).padStart(6) + "  " + pressure.lust.toFixed(1).padStart(6) +
		"  " + percent(pressure.lust, total));
	if (pressure.damage > 0 && pressure.lust / pressure.damage > ratioMaximum) overArray.push(enemy.index + " at " + (pressure.lust / pressure.damage).toFixed(2));
}

//Per-region pressure is what "much less focus on lust" is a claim about, so it gets measured rather
//than asserted. Averaged over the enemies a region actually fields.
console.log("\n  by region (mean over the enemies the region fields)");
for (let regionIndex = 0; regionIndex < hc.regionArray.length; regionIndex++) {
	const memberArray = enemyArray.filter((enemy) => (regionOfEnemy[enemy.index] || {})[regionIndex] === true);
	if (memberArray.length === 0) continue;
	let damage = 0, lust = 0;
	for (const enemy of memberArray) {
		const pressure = enemyPressure(enemy);
		damage += pressure.damage;
		lust += pressure.lust;
	}
	console.log("    " + hc.regionArray[regionIndex].name.padEnd(22) + damage.toFixed(1).padStart(7) + " dmg  " + lust.toFixed(1).padStart(6) + " lust  " +
		percent(lust, damage + lust) + " of pressure");
}

console.log("\nSILENT  enemies and moves that teach the ledger nothing");
if (silentArray.length === 0) console.log("  none.");
else for (const line of silentArray) console.log("  " + line);

if (overArray.length > 0) {
	console.log("\nOVER tuning.balance.lustToDamageRatioMaximum (" + ratioMaximum + ") on their own:");
	for (const line of overArray) console.log("  " + line);
	console.log("  (the cap is written against a LINE-UP, which budget-audit.js measures; a single enemy over it is a flag, not a failure.)");
}
