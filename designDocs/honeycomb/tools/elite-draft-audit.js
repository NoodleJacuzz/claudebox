/**
 * Elite-pool draft audit for Honeycomb Catacombs (enemies/ S64-2). Not part of the game.
 *
 * Loads the real engine, applies enemies/COMMON-DRAFT-01.js and then enemies/ELITE-DRAFT-01.js over it, and
 * grades the drafted elite pool with the instruments the live tables are graded by, plus the checks Noodle's
 * session-66 rules add (they cover elites by his word: "This should actually extend to elites and bosses"):
 *
 *   TEMPLATE   every elite body and elite encounter against tuning.balance's ELITE group (enemy-template.js's
 *              arithmetic: a body's share of the solo elite budget, a fight against the group budget)
 *   SHAPE      enemy types per fight (1 or 2), distinct type sets per region, size spread, pool size per
 *              region under the block rule (a won fight is blocked for the next two)
 *   LUST       tags of the elite bodies' Lust moves (act-1 tags only)
 *   COVERAGE   real act-1 runs walked with the game's own map generator: elite nodes per path and per map,
 *              how often each elite fight is met, and the block rule replayed over the elite rolls
 *   BITE       (--bite) every drafted elite fight fought by the Basic Bite bot, four parties, N seeds
 *
 * Usage:  node "!designDocs/honeycomb/tools/elite-draft-audit.js" [--bite] [--seeds N] [--region R] [--only a,b] [--runs N] [--halve]
 */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..", "..", "..", "scripts", "misc");
const COMMON_DRAFT = path.join(__dirname, "..", "enemies", "COMMON-DRAFT-01.js");
const ELITE_DRAFT = path.join(__dirname, "..", "enemies", "ELITE-DRAFT-01.js");
const FILES = eval(fs.readFileSync(path.join(__dirname, "card-inventory.js"), "utf8").match(/const FILES = (\[[\s\S]*?\]);/)[1]);
const argv = process.argv.slice(2);
function option(name, fallback) { const at = argv.indexOf(name); return at < 0 ? fallback : argv[at + 1]; }
const BITE = argv.includes("--bite");
const SEEDS = parseInt(option("--seeds", "2"), 10);
const RUNS = parseInt(option("--runs", "300"), 10);
const REGION_OPTION = option("--region", null);
const ONLY_OPTION = option("--only", null);
const HALVE = argv.includes("--halve");
const PARTY_SIZE = 3;
const PARTY_HEALTH = 177;

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
	const metricsFile = "honeycomb/honeycomb-sprite-metrics.js";
	if (fs.existsSync(path.join(ROOT, metricsFile))) vm.runInContext(fs.readFileSync(path.join(ROOT, metricsFile), "utf8"), sandbox, { filename: metricsFile });
	vm.runInContext(fs.readFileSync(COMMON_DRAFT, "utf8"), sandbox, { filename: "COMMON-DRAFT-01.js" });
	vm.runInContext(fs.readFileSync(ELITE_DRAFT, "utf8"), sandbox, { filename: "ELITE-DRAFT-01.js" });
	if (sandbox.honeycomb.eliteDraftApplied !== true) throw new Error("the elite draft did not apply");
	return sandbox.honeycomb;
}

const hc = newEngine();
const balance = hc.tuning.balance;
const pad = (value, width) => String(value).padEnd(width);
const byIndex = (index) => hc.findDefinition(hc.enemyArray, index);
const REGION_NAME = ["act 1-1", "Frontier", "Arbor", "Road"];
const drafted = hc.encounterArray.filter((encounter) => encounter.isElite == true && encounter.testFixture != true &&
	encounter.regionIndexArray != null && encounter.regionIndexArray.length === 1 && encounter.regionIndexArray[0] <= 3);

//--- TEMPLATE (enemy-template.js's arithmetic) -----------------------------------------------------------
function targetCount(targetMode) {
	const definition = hc.targetModeDefinition(targetMode);
	return definition != null && definition.wholeTeam === true ? PARTY_SIZE : 1;
}
function cardThreat(card) {
	let total = 0, lust = 0;
	function walk(effectArray, multiplier, targetMode) {
		for (const effect of effectArray || []) {
			const count = targetCount(effect.targetOverride || targetMode);
			if (effect.targetOverride === "self") continue;
			const amount = typeof effect.amount === "number" ? effect.amount : 0;
			if (effect.index === "damage" || effect.index === "damageIgnoringTemporary") total += amount * count * multiplier;
			if (effect.index === "lust") { total += amount * count * multiplier; lust += amount * count * multiplier; }
			if (effect.index === "applyStatus" && effect.status === "poison") total += (effect.stacks * (effect.stacks + 1) / 2) * count * multiplier;
			if (effect.index === "repeat") walk(effect.effectArray, multiplier * (effect.times || 1), targetMode);
		}
	}
	walk(card.effectArray, 1, card.targetMode);
	return { total, lust };
}
function expectedThreat(enemy) {
	const moveArray = enemy.moveArray || [];
	if (enemy.moveStrategy === "sequence") {
		const sum = moveArray.reduce((acc, move) => { const t = cardThreat(hc.findDefinition(hc.cardArray, move.card)); return { total: acc.total + t.total, lust: acc.lust + t.lust }; }, { total: 0, lust: 0 });
		return { total: sum.total / Math.max(1, moveArray.length), lust: sum.lust / Math.max(1, moveArray.length) };
	}
	const totalWeight = moveArray.reduce((sum, move) => sum + (move.weight || 0), 0);
	let total = 0, lust = 0;
	for (const move of moveArray) {
		let share = (move.weight || 0) / Math.max(1, totalWeight);
		if (move.chargeCost != null) share = Math.min(share, 1 / move.chargeCost);
		const t = cardThreat(hc.findDefinition(hc.cardArray, move.card));
		total += share * t.total; lust += share * t.lust;
	}
	return { total, lust };
}
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
function mark(value, target) {
	const ratio = value / target;
	return ratio > 1 + balance.varianceFraction ? "▲" : ratio < 1 - balance.varianceFraction ? "▼" : "✓";
}
function regionOfEnemy(enemyIndex) {
	for (const encounter of drafted) if (encounter.enemyIndexArray.indexOf(enemyIndex) >= 0) return encounter.regionIndexArray[0];
	return null;
}
function artState(enemy) {
	const folder = enemy.artFolder || enemy.index;
	const metric = hc.spriteMetricMap == null ? null : hc.spriteMetricMap["enemies/" + folder + "/default/1-combat"];
	if (metric == null) return "NONE YET" + (enemy.artFolder ? " (" + folder + ")" : "");
	return (metric[2] === 1 ? "stand-in" : "own drawing") + (enemy.artFolder ? " (" + folder + ")" : "");
}
console.log("ELITE POOL DRAFT 01 -- graded against tuning.balance's ELITE group. ✓ within ±" + Math.round(balance.varianceFraction * 100) + "%.\n");
console.log("BODIES fielded by the drafted elite pools (an elite body against its share of the solo elite budget; a common body against its own role)");
console.log(pad("enemy", 16) + pad("name", 18) + pad("role", 11) + pad("reg", 10) + pad("HP (tgt)", 14) + pad("dmg (tgt)", 16) + pad("lust", 6) + "moves");
const fielded = new Set();
for (const encounter of drafted) for (const enemyIndex of encounter.enemyIndexArray) fielded.add(enemyIndex);
const enemyRows = [...fielded].map((index) => byIndex(index)).sort((a, b) => regionOfEnemy(a.index) - regionOfEnemy(b.index) || hc.enemyDifficultyRank(a) - hc.enemyDifficultyRank(b));
for (const enemy of enemyRows) {
	const role = hc.findDefinition(balance.enemyRoleArray, enemy.role);
	const regionIndex = regionOfEnemy(enemy.index);
	const base = role.group === "elite" ? groupBudget(regionIndex, "middle", "elite", true) : groupBudget(regionIndex, "early", "normal", false);
	const target = { health: base.health * role.healthShare, damage: base.damage * role.damageShare };
	const threat = expectedThreat(enemy);
	console.log(pad(enemy.index, 16) + pad(enemy.name, 18) + pad(enemy.role, 11) + pad(REGION_NAME[regionIndex], 10) +
		pad(enemy.baseHealth + " (" + Math.round(target.health) + ") " + mark(enemy.baseHealth, target.health), 14) +
		pad(threat.total.toFixed(1) + " (" + target.damage.toFixed(1) + ") " + mark(threat.total, target.damage), 16) +
		pad(Math.round(100 * threat.lust / Math.max(0.1, threat.total)) + "%", 6) +
		enemy.moveArray.length + (enemy.startingStatusArray ? "  passive: " + enemy.startingStatusArray.map((s) => s.status).join(",") : "") +
		"  art: " + artState(enemy));
}

console.log("\nELITE ENCOUNTERS (against the elite group budget; a one-body fight against the solo factor; lust cap " + Math.round(balance.lustToDamageRatioMaximum * 100) + "%)");
console.log(pad("encounter", 22) + pad("region", 10) + pad("tier", 8) + pad("size", 6) + pad("types", 7) + pad("HP (tgt)", 16) + pad("dmg (tgt)", 16) + pad("lust%", 7) + "formation, front first");
const rowsByRegion = {};
for (const encounter of drafted) {
	const regionIndex = encounter.regionIndexArray[0];
	const solo = encounter.enemyIndexArray.length === 1;
	const budget = groupBudget(regionIndex, encounter.tier, "elite", solo);
	const health = encounter.enemyIndexArray.reduce((sum, index) => sum + byIndex(index).baseHealth, 0);
	const threat = encounter.enemyIndexArray.reduce((acc, index) => { const t = expectedThreat(byIndex(index)); return { total: acc.total + t.total, lust: acc.lust + t.lust }; }, { total: 0, lust: 0 });
	const types = new Set(encounter.enemyIndexArray).size;
	const lustShare = threat.lust / Math.max(0.1, threat.total);
	(rowsByRegion[regionIndex] = rowsByRegion[regionIndex] || []).push(encounter);
	console.log(pad(encounter.index + (encounter.candidate ? " (cand.)" : ""), 22) + pad(REGION_NAME[regionIndex], 10) + pad(encounter.tier, 8) + pad(encounter.enemyIndexArray.length, 6) + pad(types + (types > 2 ? " ✗" : ""), 7) +
		pad(health + " (" + Math.round(budget.health) + ") " + mark(health, budget.health), 16) +
		pad(threat.total.toFixed(1) + " (" + budget.damage.toFixed(1) + ") " + mark(threat.total, budget.damage), 16) +
		pad(Math.round(100 * lustShare) + "%" + (lustShare > balance.lustToDamageRatioMaximum ? " ✗" : ""), 7) +
		encounter.enemyIndexArray.map((index) => byIndex(index).name).join(", "));
}

//--- SHAPE -------------------------------------------------------------------------------------------------
console.log("\nSHAPE (an elite pool is one pool per region: every drafted elite fight is tier `middle`)");
let shapeProblems = 0;
for (let regionIndex = 0; regionIndex <= 3; regionIndex++) {
	const rows = (rowsByRegion[regionIndex] || []).filter((row) => row.candidate != true);
	const sizes = rows.map((row) => row.enemyIndexArray.length).sort((a, b) => a - b);
	const tiers = [...new Set(rows.map((row) => row.tier))];
	const note = rows.length < 3 ? "  ✗ pool under 3: the block rule can leave no real roll" : "";
	console.log("  " + pad(REGION_NAME[regionIndex], 10) + "pool " + rows.length + "  sizes " + sizes.join("/") + "  tiers " + tiers.join(",") + note);
	if (rows.length < 3) shapeProblems += 1;
	const seen = {};
	for (const row of rows) {
		const key = [...new Set(row.enemyIndexArray)].sort().join("+");
		if (seen[key]) { console.log("  ✗ " + REGION_NAME[regionIndex] + ": " + row.index + " and " + seen[key] + " field the same enemy types (" + key + ")"); shapeProblems += 1; }
		seen[key] = row.index;
		if (new Set(row.enemyIndexArray).size > 2) { console.log("  ✗ " + REGION_NAME[regionIndex] + ": " + row.index + " fields more than two enemy types"); shapeProblems += 1; }
	}
	for (const row of rows) for (const other of rows) {
		if (row === other) continue;
		const a = new Set(row.enemyIndexArray), b = new Set(other.enemyIndexArray);
		if (a.size === b.size) continue;
		const small = a.size < b.size ? a : b, large = a.size < b.size ? b : a;
		if ([...small].every((type) => large.has(type)) && Math.abs(row.enemyIndexArray.length - other.enemyIndexArray.length) <= 1 && row.index < other.index) {
			console.log("  ~ " + REGION_NAME[regionIndex] + ": " + row.index + " and " + other.index + " differ by one body of a type the other already fields; look at them together in the frame");
		}
	}
	const counts = {};
	for (const row of rows) for (const type of new Set(row.enemyIndexArray)) counts[type] = (counts[type] || 0) + 1;
	console.log("  " + pad("", 10) + Object.keys(counts).map((type) => byIndex(type).name + " ×" + counts[type]).join(", "));
}
//Every elite body stands in one region's elite pool and in no ordinary pool.
const ordinary = hc.encounterArray.filter((encounter) => encounter.isElite != true && encounter.tier !== "boss" && encounter.testFixture != true && encounter.regionIndexArray != null);
for (const enemy of enemyRows) {
	const role = hc.findDefinition(balance.enemyRoleArray, enemy.role);
	if (role.group !== "elite") continue;
	const regions = new Set(drafted.filter((row) => row.enemyIndexArray.indexOf(enemy.index) >= 0).map((row) => row.regionIndexArray[0]));
	const inOrdinary = ordinary.filter((row) => row.enemyIndexArray.indexOf(enemy.index) >= 0).map((row) => row.index);
	if (regions.size > 1) { console.log("  ✗ " + enemy.name + " stands in " + regions.size + " regions' elite pools"); shapeProblems += 1; }
	if (inOrdinary.length > 0) { console.log("  ✗ " + enemy.name + " also stands in ordinary fights: " + inOrdinary.join(", ")); shapeProblems += 1; }
}
console.log(shapeProblems === 0 ? "  shape: no rule broken" : "  shape: " + shapeProblems + " problem(s)");

//--- LUST (act-1 tags only) --------------------------------------------------------------------------------
console.log("\nLUST TAGS on the elite bodies' moves (act 1 allows venom, exposure, heat)");
const legal = ["venom", "exposure", "heat"];
const tagCounts = {};
let illegal = 0;
for (const enemy of enemyRows) {
	const role = hc.findDefinition(balance.enemyRoleArray, enemy.role);
	if (role.group !== "elite") continue;
	for (const move of enemy.moveArray) {
		const card = hc.findDefinition(hc.cardArray, move.card);
		if (!(cardThreat(card).lust > 0)) continue;
		const tags = (card.tagArray || []).filter((tag) => { const found = hc.findDefinition(hc.cardTagArray, tag); return found != null && found.lustTag === true; });
		if (tags.length === 0) { console.log("  ✗ " + enemy.index + " " + card.index + " deals Lust with no lust tag"); illegal += 1; }
		for (const tag of tags) {
			tagCounts[tag] = (tagCounts[tag] || 0) + 1;
			if (legal.indexOf(tag) < 0) { console.log("  ✗ " + enemy.index + " " + card.index + " carries " + tag); illegal += 1; }
		}
	}
}
console.log("  " + Object.keys(tagCounts).map((tag) => tag + " " + tagCounts[tag]).join(", ") + (illegal === 0 ? "  -- every elite Lust move carries an act-1 tag" : ""));

//--- COVERAGE ------------------------------------------------------------------------------------------------
console.log("\nCOVERAGE -- " + RUNS + " generated act-1 runs (act 1-1 + one route, route chosen in turn), random path");
function walkRegion(regionIndex) {
	const map = hc.map.generateRegion(hc.regionArray[regionIndex].index);
	const rowArray = map.rowArray;
	const byId = {};
	for (let r = 0; r < rowArray.length; r++) for (const node of rowArray[r]) { byId[node.id] = node; node.rowIndex = r; }
	const met = [];
	let node = rowArray[0][hc.rng.range(hc.tuning.rng.streamArray.map, 0, rowArray[0].length - 1)];
	while (node != null) {
		if (node.encounterIndex != null) met.push({ encounterIndex: node.encounterIndex, type: node.typeIndex, tier: hc.encounterTierForDepth(node.rowIndex, rowArray.length), regionIndex });
		const children = (node.edgeArray || []).map((id) => byId[id]).filter(Boolean);
		if (children.length === 0) break;
		node = children[hc.rng.range(hc.tuning.rng.streamArray.map, 0, children.length - 1)];
	}
	let onMap = 0;
	for (const row of rowArray) for (const node of row) if (node.typeIndex === "elite") onMap += 1;
	return { met, onMap };
}
const routes = ["floodedVault", "flora", "pollenRoad"];
const runArray = [];
const mean = (a) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
for (let seed = 1; seed <= RUNS; seed++) {
	hc.state = hc.newProfile();
	hc.newRun([{ characterIndex: "brienne", outfitIndex: "default" }], seed * 7919);
	const first = walkRegion(0);
	const second = walkRegion(hc.regionArray.findIndex((r) => r.index === routes[seed % 3]));
	runArray.push({ fights: first.met.concat(second.met), onMap: [first.onMap, second.onMap], route: routes[seed % 3] });
}
const eliteFights = (run) => run.fights.filter((f) => f.type === "elite");
console.log("  elite nodes met per run: " + mean(runArray.map((r) => eliteFights(r).length)).toFixed(2) +
	" (act 1-1 " + mean(runArray.map((r) => eliteFights(r).filter((f) => f.regionIndex === 0).length)).toFixed(2) +
	", route " + mean(runArray.map((r) => eliteFights(r).filter((f) => f.regionIndex !== 0).length)).toFixed(2) + ")" +
	"; on the map: act 1-1 " + mean(runArray.map((r) => r.onMap[0])).toFixed(1) + ", route " + mean(runArray.map((r) => r.onMap[1])).toFixed(1) +
	"; runs whose route map has NO elite node: " + Math.round(100 * runArray.filter((r) => r.onMap[1] === 0).length / RUNS) + "%");
const perFight = drafted.map((row) => ({ row, p: runArray.filter((r) => eliteFights(r).some((f) => f.encounterIndex === row.index)).length / RUNS }));
console.log("  P(elite fight met in one run): " + perFight.map((x) => x.row.name + " " + Math.round(100 * x.p) + "%").join(", "));
const perFightOnRoute = drafted.filter((row) => row.regionIndexArray[0] > 0).map((row) => {
	const runs = runArray.filter((r) => r.route === routes[row.regionIndexArray[0] - 1]);
	return { row, p: runs.filter((r) => eliteFights(r).some((f) => f.encounterIndex === row.index)).length / Math.max(1, runs.length) };
});
console.log("  P(route elite fight met | that route taken): " + perFightOnRoute.map((x) => x.row.name + " " + Math.round(100 * x.p) + "%").join(", "));
//Block rule over the elite rolls: replays each run's elite nodes with the drafted pools and the two-fight block.
let rolls = 0, forced = 0, stuck = 0, second = 0;
for (const run of runArray) {
	const recent = [];
	let seenInRegion = {};
	for (const fight of run.fights) {
		if (fight.type !== "elite") continue;
		const pool = drafted.filter((row) => row.candidate != true && row.regionIndexArray[0] === fight.regionIndex);
		const open = pool.filter((row) => recent.indexOf(row.index) < 0);
		rolls += 1;
		if (seenInRegion[fight.regionIndex]) second += 1;
		seenInRegion[fight.regionIndex] = true;
		if (open.length === 0) stuck += 1; else if (open.length === 1) forced += 1;
		const pick = (open.length ? open : pool)[Math.floor(hc.rng.next(hc.tuning.rng.streamArray.encounter) * (open.length ? open.length : pool.length))];
		recent.push(pick.index);
		if (recent.length > 2) recent.shift();
	}
}
console.log("  block rule over those runs: " + rolls + " elite rolls, " + second + " of them a second elite in the same region, " + stuck + " with no unblocked fight, " + forced + " with exactly one (" + (100 * forced / Math.max(1, rolls)).toFixed(1) + "%)");

//--- BITE --------------------------------------------------------------------------------------------------
if (BITE) {
	const { loadEngine } = require("./balance/lib/engine");
	const combatPlayer = require("./balance/lib/combat-player");
	const engine = loadEngine({ extraFileArray: [path.relative(ROOT, COMMON_DRAFT), path.relative(ROOT, ELITE_DRAFT)] });
	if (engine.eliteDraftApplied !== true) throw new Error("the elite draft did not apply inside the balance engine");
	if (HALVE) engine.findDefinition(engine.statusArray, "poison").decayMode = "halve";
	const PARTIES = [["brienne", "nettle", "severine"], ["cinder", "clemence", "cassadora"], ["brienne", "clemence", "cassadora"], ["severine", "cinder", "nettle"]];
	function draftCards(count, seed) {
		for (let pick = 0; pick < count; pick++) {
			const offerArray = engine.combat.rollCardReward({ tier: "early" }, null);
			if (!offerArray || offerArray.length === 0) continue;
			const rare = offerArray.find((offer) => { const card = engine.findDefinition(engine.cardArray, offer.cardIndex); return card && card.rarity === "rare"; });
			const chosen = rare || offerArray[(seed + pick) % offerArray.length];
			const card = engine.findDefinition(engine.cardArray, chosen.cardIndex);
			if (card == null || card.fallback === true) continue;
			engine.addCardToRunDeck(chosen.cardIndex, chosen.ownerInstanceId);
		}
	}
	function playFight(party, encounterIndex, seed, draftCount) {
		engine.state = engine.newProfile();
		engine.newRun(party.map((characterIndex) => ({ characterIndex, outfitIndex: "default" })), seed);
		draftCards(draftCount, seed);
		engine.combat.begin(encounterIndex, {});
		return combatPlayer.playCombat(engine, false);
	}
	console.log("\nBITE -- every drafted elite fight, " + PARTIES.length + " parties x " + SEEDS + " seeds, fresh-save drafted decks (Basic Bite's bot)" + (HALVE ? " -- POISON HALVING ON (E14 preview)" : ""));
	console.log(pad("encounter", 22) + pad("region", 10) + pad("win", 6) + pad("turns", 7) + pad("gross", 7) + pad("lust", 6) + pad("net% (tgt)", 12) + pad("broken", 8) + "line-up");
	for (const encounter of drafted) {
		const regionIndex = encounter.regionIndexArray[0];
		if (REGION_OPTION != null && regionIndex !== parseInt(REGION_OPTION, 10)) continue;
		if (ONLY_OPTION != null && ONLY_OPTION.split(",").indexOf(encounter.index) < 0) continue;
		const stage = balance.tierStageArray[encounter.tier] || "late";
		const pick = (array) => array[Math.min(regionIndex, array.length - 1)];
		const draftCount = pick(balance.draftedCardsByStageArray)[stage];
		const netTarget = pick(balance.netDamageFractionArray).elite;
		const samples = [];
		for (const party of PARTIES) for (let seed = 1; seed <= SEEDS; seed++) {
			try { samples.push(playFight(party, encounter.index, seed, draftCount)); }
			catch (error) { samples.push({ error: String(error && error.stack || error) }); }
		}
		const good = samples.filter((s) => !s.error);
		if (good.length === 0) { console.log(pad(encounter.index, 22) + "ERROR " + samples[0].error.split("\n")[0]); continue; }
		const partyMaximum = mean(good.map((s) => s.partyMaximum));
		const turns = mean(good.map((s) => s.turns));
		const net = mean(good.map((s) => s.netLost)) / partyMaximum;
		console.log(pad(encounter.index + (encounter.candidate ? " (cand.)" : ""), 22) + pad(REGION_NAME[regionIndex], 10) +
			pad(Math.round(100 * good.filter((s) => s.won).length / good.length) + "%", 6) + pad(turns.toFixed(1), 7) +
			pad((mean(good.map((s) => s.gross)) / turns).toFixed(1), 7) + pad((mean(good.map((s) => s.lustTaken)) / turns).toFixed(1), 6) +
			pad((100 * net).toFixed(1) + " (" + Math.round(100 * netTarget) + ")", 12) + pad(mean(good.map((s) => s.broken)).toFixed(2), 8) + encounter.enemyIndexArray.join("+") +
			(samples.length > good.length ? "  [" + (samples.length - good.length) + " errored]" : ""));
	}
}
