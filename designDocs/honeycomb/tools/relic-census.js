/**
 * Relic census and relic income for Honeycomb Catacombs. Not part of the game.
 *
 * Prints, from the live tables and the game's own map generator:
 *   1. the nodes a demo run meets (act 1-1, then one of the act 1-2 routes in rotation), walking a
 *      random path through each generated region, with the gold those fights and chests pay;
 *   2. relic OFFERS per run under the live tuning, by source (elite, boss, chest, fight, shop, event);
 *   3. every relic by rarity, pool, gate and archetype, and every piece of equipment by rarity and kind;
 *   4. how much of the chance pool a few representative parties can be offered, and how often a given
 *      relic therefore turns up in one of their runs.
 *
 * The instrument `../relics/RELIC-REWORK-01.md` is sized on. Run it after any change to the relic
 * tables, `tuning.reward`, `honeycomb.treasureTuning` or `honeycomb.shopTuning`.
 *
 * Usage:  node "!designDocs/honeycomb/tools/relic-census.js" [--runs N]
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

const hc = newEngine();
const ROUTES = hc.tuning.map.route.byBossArray.map((row) => row.regionIndex);
const FIRST = hc.regionArray[0].index;
const party = (indexArray) => indexArray.map((characterIndex) => ({ characterIndex, outfitIndex: "default" }));

//--- 1. Nodes met per run --------------------------------------------------------------------------
function goldOf(node) {
	if (node.encounterIndex == null) return 0;
	const encounter = hc.findDefinition(hc.encounterArray, node.encounterIndex);
	if (encounter == null) return 0;
	let gold = 0;
	for (const enemyIndex of encounter.enemyIndexArray || []) {
		const enemy = hc.findDefinition(hc.enemyArray, enemyIndex);
		if (enemy != null && enemy.goldReward != null) gold += (enemy.goldReward.minimum + enemy.goldReward.maximum) / 2;
	}
	return gold;
}

function walkRegion(regionIndex) {
	const map = hc.map.generateRegion(regionIndex);
	const rowArray = map.rowArray;
	const byId = {};
	for (const row of rowArray) for (const node of row) byId[node.id] = node;
	const counts = { rows: rowArray.length, combat: 0, elite: 0, boss: 0, shop: 0, treasure: 0, event: 0, rest: 0, other: 0, gold: 0 };
	const held = { treasure: 0, shop: 0, elite: 0 };
	for (const row of rowArray) for (const node of row) if (held[node.typeIndex] != null) held[node.typeIndex] += 1;
	let node = rowArray[0][hc.rng.range(hc.tuning.rng.streamArray.map, 0, rowArray[0].length - 1)];
	while (node != null) {
		counts[counts[node.typeIndex] == null ? "other" : node.typeIndex] += 1;
		counts.gold += goldOf(node);
		const children = (node.edgeArray || []).map((id) => byId[id]).filter(Boolean);
		if (children.length === 0) break;
		node = children[hc.rng.range(hc.tuning.rng.streamArray.map, 0, children.length - 1)];
	}
	return { counts, held };
}

const perRegion = {};
function record(name, sample) {
	const bucket = perRegion[name] = perRegion[name] || { n: 0, sum: {}, held: {} };
	bucket.n += 1;
	for (const key of Object.keys(sample.counts)) bucket.sum[key] = (bucket.sum[key] || 0) + sample.counts[key];
	for (const key of Object.keys(sample.held)) bucket.held[key] = (bucket.held[key] || 0) + sample.held[key];
}
for (let seed = 1; seed <= RUNS; seed++) {
	hc.state = hc.newProfile();
	hc.newRun(party(["brienne"]), seed * 7919);
	record(FIRST, walkRegion(FIRST));
	record(ROUTES[seed % ROUTES.length], walkRegion(ROUTES[seed % ROUTES.length]));
}

const COLUMNS = ["rows", "combat", "elite", "boss", "shop", "treasure", "event", "rest", "gold"];
const line = (label, values, tail) => console.log(label.padEnd(24) + values.map((v) => v.toFixed(1).padStart(7)).join("") + (tail || ""));
console.log("NODES MET PER RUN, random path -- " + RUNS + " generated runs");
console.log("region".padEnd(24) + COLUMNS.map((h) => (h === "treasure" ? "chest" : h).padStart(7)).join(""));
const demo = {};
for (const key of COLUMNS) demo[key] = 0;
for (const name of Object.keys(perRegion)) {
	const bucket = perRegion[name];
	const mean = (key) => bucket.sum[key] / bucket.n;
	line(name, COLUMNS.map(mean), "   map holds: chests " + (bucket.held.treasure / bucket.n).toFixed(1) + ", shops " + (bucket.held.shop / bucket.n).toFixed(1) + ", elites " + (bucket.held.elite / bucket.n).toFixed(1));
	const weight = name === FIRST ? 1 : 1 / ROUTES.length;
	for (const key of COLUMNS) demo[key] += weight * mean(key);
}
line("DEMO RUN (1-1 + route)", COLUMNS.map((key) => demo[key]));

//--- 2. Relic offers per run -----------------------------------------------------------------------
hc.state = hc.newProfile();
hc.newRun(party(["brienne", "nettle", "severine"]), 99);
const reward = hc.tuning.reward, chest = hc.treasureTuning, shop = hc.shopTuning;
const goldMultiplier = hc.scaling.goldMultiplier();
const chestGold = (chest.goldMinimum + chest.goldMaximum) / 2;
const given = demo.elite * reward.eliteRelicChance + demo.boss * reward.bossRelicChance + demo.treasure * chest.relicChance + demo.combat * reward.relicChance;
const namesRelic = (event) => JSON.stringify(event).indexOf('"gainRelic"') >= 0;
const rollsRelic = (event) => JSON.stringify(event).indexOf('"gainRandomRelic"') >= 0;
const mapEvents = hc.eventArray.filter((event) => event.lustEvent != true);
console.log("\nRELIC OFFERS PER DEMO RUN under live tuning");
console.log("  elites  " + demo.elite.toFixed(2) + " x " + reward.eliteRelicChance + "  = " + (demo.elite * reward.eliteRelicChance).toFixed(2));
console.log("  bosses  " + demo.boss.toFixed(2) + " x " + reward.bossRelicChance + "  = " + (demo.boss * reward.bossRelicChance).toFixed(2));
console.log("  chests  " + demo.treasure.toFixed(2) + " x " + chest.relicChance + " = " + (demo.treasure * chest.relicChance).toFixed(2));
console.log("  fights " + demo.combat.toFixed(2) + " x " + reward.relicChance + "  = " + (demo.combat * reward.relicChance).toFixed(2));
console.log("  GIVEN BY CHANCE                = " + given.toFixed(2));
console.log("  shops   " + demo.shop.toFixed(2) + " x " + shop.relicSlotCount + " slots = " + (demo.shop * shop.relicSlotCount).toFixed(2) + " for sale at " + Object.keys(shop.relicPriceArray).map((k) => k + " " + shop.relicPriceArray[k]).join(", "));
console.log("  events: " + mapEvents.filter(namesRelic).length + " name a relic (" + mapEvents.filter(namesRelic).map((e) => e.index).join(", ") + "), " + mapEvents.filter(rollsRelic).length + " roll one, of " + mapEvents.length + " map events");
console.log("  gold on the path, party of 3 (x" + goldMultiplier + "): start " + hc.state.run.resourceArray.gold + " + fights " + (demo.gold * goldMultiplier).toFixed(0) + " + chests " + (demo.treasure * chestGold).toFixed(0)
	+ " = " + (hc.state.run.resourceArray.gold + demo.gold * goldMultiplier + demo.treasure * chestGold).toFixed(0)
	+ "; removal " + shop.removalCost + " (+" + shop.removalCostIncrease + "), card " + shop.cardPriceArray.common + " / " + shop.cardPriceArray.rare + ", outfit " + shop.outfitPrice);

//--- 3. The tables ---------------------------------------------------------------------------------
const tally = (list, key) => list.reduce((acc, item) => { acc[item[key]] = (acc[item[key]] || 0) + 1; return acc; }, {});
const gateOf = (relic) => relic.offerCondition == null ? "-" : (relic.offerCondition.index === "partyContains" ? relic.offerCondition.character : relic.offerCondition.index);
const hooksOf = (entry) => Object.keys(entry.hooks || {}).join(",") || (entry.onGain ? "onGain" : (entry.goldBonus ? "goldBonus" : "-"));
console.log("\nCENSUS: honeycomb.relicArray (" + hc.relicArray.length + ")");
const rows = hc.relicArray.map((relic) => ({ index: relic.index, rarity: relic.rarity, pool: hc.relicPool(relic), gate: gateOf(relic), archetype: relic.archetype || "-", hooks: hooksOf(relic) }));
rows.sort((a, b) => (a.rarity + a.gate + a.index).localeCompare(b.rarity + b.gate + b.index));
console.log("  " + "index".padEnd(24) + "rarity".padEnd(9) + "pool".padEnd(10) + "gate".padEnd(14) + "archetype".padEnd(13) + "hooks");
for (const row of rows) console.log("  " + row.index.padEnd(24) + row.rarity.padEnd(9) + row.pool.padEnd(10) + row.gate.padEnd(14) + row.archetype.padEnd(13) + row.hooks);
console.log("  by rarity " + JSON.stringify(tally(rows, "rarity")) + "  by pool " + JSON.stringify(tally(rows, "pool")) + "  gated " + rows.filter((r) => r.gate !== "-").length);

console.log("\nCENSUS: honeycomb.equipmentArray (" + hc.equipmentArray.length + ")");
for (const piece of hc.equipmentArray) {
	const extras = ["cardAdditionArray", "cardReplacementArray", "rewardReroll", "healthModifier"].filter((field) => piece[field] != null).join(",");
	console.log("  " + piece.index.padEnd(24) + piece.rarity.padEnd(9) + (piece.characterIndex == null ? "generic" : "heirloom " + piece.characterIndex).padEnd(22)
		+ (piece.unlockedFromStart ? "fromStart " : "locked    ") + hooksOf(piece) + (extras ? " " + extras : ""));
}

//--- 4. Offerable per party ------------------------------------------------------------------------
console.log("\nOFFERABLE RELICS BY PARTY (chance pool, uncarried, gate passing) -- " + given.toFixed(1) + " given a run");
const parties = [["brienne", "nettle", "severine"], ["cassadora", "cinder", "clemence"], ["brienne", "cinder"], ["brienne"], ["nettle"], ["severine"], ["cassadora"], ["cinder"], ["clemence"]];
for (const members of parties) {
	hc.state = hc.newProfile();
	hc.newRun(party(members), 12345);
	const offerable = hc.uncarriedRelicArray(null, "common");
	console.log("  " + members.join("+").padEnd(28) + String(offerable.length).padStart(3) + " offerable  " + JSON.stringify(tally(offerable, "rarity")).padEnd(26)
		+ " a given relic turns up in ~" + (given / Math.max(1, offerable.length) * 100).toFixed(0) + "% of runs");
}
