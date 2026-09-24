/**
 * Enemy template check for Honeycomb Catacombs (rework/enemies/ENEMIES-01.md §2). Not part of the game.
 *
 * STATIC: reads the tables, plays nothing. For every enemy, its health and its expected damage per turn
 * at full strength beside the target its `role` sets (tuning.balance.enemyRoleArray). For every
 * encounter, the sum of its members beside its group's budget. `budget-audit.js` says what the fights
 * actually cost; this says whether they were written to the template in the first place.
 *
 * Expected damage per turn = sum over moves of weight × damage ÷ sum of weights, where
 *   a hit on everyone counts × the party size (3), a repeat counts its hits,
 *   Poison p counts p(p+1)/2 per target (it ticks down by one), Lust counts as damage,
 *   a charged move's share is capped at one use per `chargeCost` turns,
 *   a "sequence" enemy averages its loop.
 * Strength, Sundered, Thorns, summons and healing are left to the audit.
 *
 * Usage:  node "!designDocs/honeycomb/tools/enemy-template.js"
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
const balance = hc.tuning.balance;
const PARTY_SIZE = 3;
const PARTY_HEALTH = 177;

function targetCount(targetMode) {
	const definition = hc.targetModeDefinition(targetMode);
	return definition != null && definition.wholeTeam === true ? PARTY_SIZE : 1;
}

//Damage + Lust one play of a card threatens, summed over its targets.
function cardThreat(card) {
	let total = 0;
	function walk(effectArray, multiplier, targetMode) {
		for (const effect of effectArray || []) {
			const count = targetCount(effect.targetOverride || targetMode);
			if (effect.targetOverride === "self") continue;
			const amount = typeof effect.amount === "number" ? effect.amount : 0;
			if (effect.index === "damage" || effect.index === "damageIgnoringTemporary" || effect.index === "lust") total += amount * count * multiplier;
			if (effect.index === "applyStatus" && effect.status === "poison") total += (effect.stacks * (effect.stacks + 1) / 2) * count * multiplier;
			if (effect.index === "repeat") walk(effect.effectArray, multiplier * (effect.times || 1), targetMode);
		}
	}
	walk(card.effectArray, 1, card.targetMode);
	return total;
}

function expectedThreat(enemy) {
	const moveArray = enemy.moveArray || [];
	if (enemy.moveStrategy === "sequence") {
		return moveArray.reduce((sum, move) => sum + cardThreat(hc.findDefinition(hc.cardArray, move.card)), 0) / Math.max(1, moveArray.length);
	}
	const totalWeight = moveArray.reduce((sum, move) => sum + (move.weight || 0), 0);
	let threat = 0;
	for (const move of moveArray) {
		let share = (move.weight || 0) / Math.max(1, totalWeight);
		if (move.chargeCost != null) share = Math.min(share, 1 / move.chargeCost);
		threat += share * cardThreat(hc.findDefinition(hc.cardArray, move.card));
	}
	return threat;
}

//A group's budget: {health, damage} at full strength.
function groupBudget(regionIndex, tier, kind, solo) {
	const pick = (array) => array[Math.min(regionIndex, array.length - 1)];
	const stage = balance.tierStageArray[tier] || "late";
	const turns = pick(balance.turnTargetArray)[kind];
	const turnsMid = (turns.minimum + turns.maximum) / 2;
	const output = pick(balance.partyOutputPerTurnArray)[stage];
	const net = pick(balance.netDamageFractionArray)[kind];
	const gross = (net * PARTY_HEALTH) / turnsMid + output * balance.mitigationShareOfOutput;
	return { health: output * turnsMid, damage: gross * (solo ? balance.soloFullStrengthDamageFactor : balance.fullStrengthDamageFactor) };
}

function regionOfEnemy(enemy) {
	for (const encounter of hc.encounterArray) {
		if (encounter.testFixture || encounter.enemyIndexArray[0] == null) continue;
		if (encounter.enemyIndexArray.indexOf(enemy.index) < 0) continue;
		if (encounter.regionIndexArray) return Math.min(...encounter.regionIndexArray);
		if (encounter.tier === "boss") return hc.regionArray.findIndex((region) => (region.bossEncounterIndexArray || [region.bossEncounterIndex]).indexOf(encounter.index) >= 0);
	}
	return 0;
}

function mark(value, target) {
	const ratio = value / target;
	return ratio > 1 + balance.varianceFraction ? "▲" : ratio < 1 - balance.varianceFraction ? "▼" : "✓";
}
const pad = (value, width) => String(value).padEnd(width);

console.log("ENEMY TEMPLATE (static). ✓ within ±" + Math.round(balance.varianceFraction * 100) + "%. dmg = expected damage + Lust per turn at full strength.\n");
console.log(pad("enemy", 20) + pad("role", 9) + pad("reg", 4) + pad("HP (tgt)", 14) + pad("dmg (tgt)", 16) + "moves");
for (const enemy of hc.enemyArray) {
	const role = hc.findDefinition(balance.enemyRoleArray, enemy.role);
	const regionIndex = regionOfEnemy(enemy);
	let target = null;
	if (role != null) {
		const base = role.group === "boss" ? groupBudget(regionIndex, "boss", "boss", true)
			: role.group === "elite" ? groupBudget(regionIndex, "middle", "elite", true)
			: groupBudget(regionIndex, "early", "normal", false);
		target = { health: base.health * role.healthShare, damage: base.damage * role.damageShare };
	}
	const threat = expectedThreat(enemy);
	console.log(pad(enemy.index, 20) + pad(enemy.role || "-", 9) + pad("R" + (regionIndex + 1), 4) +
		pad(enemy.baseHealth + (target ? " (" + Math.round(target.health) + ") " + mark(enemy.baseHealth, target.health) : ""), 14) +
		pad(threat.toFixed(1) + (target ? " (" + target.damage.toFixed(1) + ") " + mark(threat, target.damage) : ""), 16) +
		(enemy.moveArray || []).length + (enemy.startingStatusArray ? "  passive: " + enemy.startingStatusArray.map((s) => s.status).join(",") : ""));
}

console.log("\n" + pad("encounter", 24) + pad("group", 18) + pad("HP (tgt)", 16) + pad("dmg (tgt)", 16) + "line-up");
const byIndex = (index) => hc.findDefinition(hc.enemyArray, index);
for (const encounter of hc.encounterArray) {
	if (encounter.testFixture) continue;
	//An OPENING fight is graded as its own kind, not as a normal one (session 55). It lasts about as long
	//as a normal fight and costs the party less health, which is the whole reason the tier exists; grading
	//it as normal reads every opening line-up as underweight.
	const kind = encounter.tier === "boss" ? "boss" : encounter.isElite ? "elite"
		: encounter.tier === "opening" ? "opening" : "normal";
	const regionArray = encounter.tier === "boss"
		? hc.regionArray.map((region, index) => ((region.bossEncounterIndexArray || [region.bossEncounterIndex]).indexOf(encounter.index) >= 0 ? index : -1)).filter((index) => index >= 0)
		: (encounter.regionIndexArray || hc.regionArray.map((region, index) => index));
	const solo = encounter.enemyIndexArray.length === 1;
	const health = encounter.enemyIndexArray.reduce((sum, index) => sum + byIndex(index).baseHealth, 0);
	const threat = encounter.enemyIndexArray.reduce((sum, index) => sum + expectedThreat(byIndex(index)), 0);
	for (const regionIndex of regionArray) {
		const budget = groupBudget(regionIndex, encounter.tier === "boss" ? "boss" : encounter.tier, kind, solo);
		console.log(pad(encounter.index, 24) + pad("R" + (regionIndex + 1) + " " + encounter.tier + "/" + kind, 18) +
			pad(health + " (" + Math.round(budget.health) + ") " + mark(health, budget.health), 16) +
			pad(threat.toFixed(1) + " (" + budget.damage.toFixed(1) + ") " + mark(threat, budget.damage), 16) +
			encounter.enemyIndexArray.join(" + "));
	}
}
