//===================================================================================================
//HONEYCOMB CATACOMBS -- card pool measurements (developer tool, never loaded by the game)
//===================================================================================================
//Prints the numbers the second pool pass was argued from (rework/cards/POOL-REVIEW-02.md sections 1
//and 2), so they can be re-measured against the live content instead of trusted:
//
//  1. Card rewards a run pays. Each region is generated over many seeds and the fight nodes along a
//     path are counted, so "offers per character per run" is read off the map rather than guessed.
//  2. Each character's pool by rarity, and how often a given card is offered per run under the reward
//     weights, since rewards deal one slot per party member.
//  3. Same-shape groups: cards of one character sharing an effect chain and target, differing only by
//     number or status. The measure behind "cards feel samey".
//  4. Ally-touching cards: target mode on an ally, or a power that reads the whole party.
//
//Usage:  node "!designDocs/honeycomb/tools/pool-measure.js" [--seeds N] [--weights common,rare]
//   e.g. node "!designDocs/honeycomb/tools/pool-measure.js" --seeds 80 --weights 85,15
//
//Exits 0. Load order mirrors card-inventory.js; UI and scene files are omitted.
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..", "..", "scripts", "misc");
const FILES = [
	"honeycomb.js",
	"honeycomb/honeycomb-tuning.js",
	"honeycomb/honeycomb-state.js",
	"honeycomb/honeycomb-effects.js",
	"honeycomb/honeycomb-entities.js",
	"honeycomb/honeycomb-tags.js",
	"honeycomb/honeycomb-content-statuses.js",
	"honeycomb/honeycomb-content-cards.js",
	"honeycomb/honeycomb-content-characters.js",
	"honeycomb/honeycomb-content-abilities.js",
	"honeycomb/honeycomb-abilities.js",
	"honeycomb/honeycomb-content-enemies.js",
	"honeycomb/honeycomb-content-map.js",
	"honeycomb/honeycomb-content-lust-events.js",
	"honeycomb/honeycomb-progression.js",
	"honeycomb/honeycomb-combat.js",
	"honeycomb/honeycomb-text-tooltips.js",
	"honeycomb/honeycomb-tooltip.js",
	"honeycomb/honeycomb-choices.js",
	"honeycomb/honeycomb-forecast.js",
	"honeycomb/honeycomb-map.js",
	"honeycomb/honeycomb-overlays-map.js",
	"honeycomb/honeycomb-lust-events.js",
	"honeycomb/honeycomb-art.js",
];

function readOption(name, fallback) {
	const at = process.argv.indexOf("--" + name);
	return at >= 0 && process.argv[at + 1] != null ? process.argv[at + 1] : fallback;
}
const SEEDS = parseInt(readOption("seeds", "80"), 10);
const WEIGHTS = readOption("weights", "").split(",").map((n) => parseInt(n, 10)).filter((n) => !isNaN(n));

function newEngine() {
	const store = {};
	const sandbox = {
		console: { log() {}, warn() {}, debug() {}, info() {}, error() {} },
		localStorage: {
			getItem: (key) => (key in store ? store[key] : null),
			setItem: (key, value) => { store[key] = String(value); },
			removeItem: (key) => { delete store[key]; },
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

const hc = newEngine();
const party = [
	{ characterIndex: "brienne", outfitIndex: "default" },
	{ characterIndex: "nettle", outfitIndex: "default" },
	{ characterIndex: "severine", outfitIndex: "default" },
];

//--- 1. Card rewards a run pays ---------------------------------------------------------------------
//Per row, the share of nodes that are fights is the chance a path through that row fights there; the sum
//over rows is the expected fight count along one path.
const perRegion = {};
for (let seed = 1; seed <= SEEDS; seed++) {
	hc.state = hc.newProfile();
	hc.newRun(party, seed);
	for (const region of hc.regionArray) {
		let map = null;
		try { map = hc.map.generateRegion(region.index, {}); } catch (error) { map = null; }
		if (map == null || map.rowArray == null) continue;
		const total = perRegion[region.index] = perRegion[region.index] || { maps: 0, rows: 0, combat: 0, elite: 0, boss: 0 };
		total.maps++;
		total.rows += map.rowArray.length;
		for (const row of map.rowArray) {
			const count = { combat: 0, elite: 0, boss: 0 };
			for (const node of row) if (count[node.typeIndex] != null) count[node.typeIndex]++;
			for (const type of Object.keys(count)) total[type] += count[type] / row.length;
		}
	}
}
console.log("=== 1. Fight nodes along one path, mean over " + SEEDS + " generated maps ===");
console.log("region".padEnd(20) + "rows".padStart(6) + "combat".padStart(8) + "elite".padStart(7) + "boss".padStart(6) + "rewards".padStart(9));
let demoRewards = 0;
let routeCount = 0;
let routeRewards = 0;
for (const [index, total] of Object.entries(perRegion)) {
	const mean = (n) => n / total.maps;
	const rewards = mean(total.combat) + mean(total.elite) + mean(total.boss);
	console.log(index.padEnd(20) + mean(total.rows).toFixed(1).padStart(6) + mean(total.combat).toFixed(2).padStart(8) +
		mean(total.elite).toFixed(2).padStart(7) + mean(total.boss).toFixed(2).padStart(6) + rewards.toFixed(1).padStart(9));
	//The first region is every run's act 1-1; the others are the alternative second regions.
	if (index == hc.regionArray[0].index) demoRewards += rewards;
	else if (hc.regionArray.find((r) => r.index == index).rowCount > 6) { routeCount++; routeRewards += rewards; }
}
if (routeCount > 0) demoRewards += routeRewards / routeCount;
console.log("A demo run (act 1-1 plus one route) pays about " + demoRewards.toFixed(1) + " card rewards, one slot per party member.");

//--- 2. Pools and offers per card -------------------------------------------------------------------
const weights = WEIGHTS.length == 2 ? { common: WEIGHTS[0], rare: WEIGHTS[1] } : hc.tuning.reward.rarityWeightArray;
const weightTotal = weights.common + weights.rare;
const pool = hc.cardArray.filter((card) => ["common", "rare"].indexOf(card.rarity) >= 0 && card.characterIndex && card.characterIndex != "anastasia");
const byCharacter = {};
for (const card of pool) {
	const bucket = byCharacter[card.characterIndex] = byCharacter[card.characterIndex] || { common: 0, rare: 0, cards: [] };
	bucket[card.rarity]++;
	bucket.cards.push(card);
}
console.log("\n=== 2. Pool per character, and offers per card per demo run at weights " + weights.common + " / " + weights.rare + " ===");
console.log("character".padEnd(12) + "common".padStart(7) + "rare".padStart(6) + "  common offered x".padStart(20) + "  rare offered x".padStart(18));
for (const [index, bucket] of Object.entries(byCharacter)) {
	const commonOffers = demoRewards * weights.common / weightTotal;
	const rareOffers = demoRewards * weights.rare / weightTotal;
	//Neutral cards never enter an ordinary reward (tuning.reward.neutralSlotChance), so no offer rate
	//applies to them; they arrive through shops and the boss slot.
	const offered = index != "neutral";
	console.log(index.padEnd(12) + String(bucket.common).padStart(7) + String(bucket.rare).padStart(6) +
		(offered && bucket.common > 0 ? (commonOffers / bucket.common).toFixed(2) : "-").padStart(20) +
		(offered && bucket.rare > 0 ? (rareOffers / bucket.rare).toFixed(2) : "-").padStart(18));
}

//--- 3. Same-shape groups ---------------------------------------------------------------------------
//The verbs a card uses, sorted and de-duplicated, plus its target mode. Which status and which number
//are ignored on purpose: that is the difference a player does not remember.
function shape(card) {
	const verbs = [];
	const walk = (list) => {
		for (const entry of list || []) {
			if (entry == null) continue;
			verbs.push(entry.index);
			walk(entry.effectArray); walk(entry.thenArray); walk(entry.elseArray);
			for (const option of entry.optionArray || []) walk(option.effectArray);
		}
	};
	walk(card.effectArray);
	return [...new Set(verbs)].sort().join("+") + " @" + card.targetMode;
}
console.log("\n=== 3. Same-shape groups per character (3 or more cards sharing verbs and target) ===");
for (const [index, bucket] of Object.entries(byCharacter)) {
	const groups = {};
	for (const card of bucket.cards) (groups[shape(card)] = groups[shape(card)] || []).push(card.name + (card.rarity == "rare" ? "*" : ""));
	const repeated = Object.entries(groups).filter(([, names]) => names.length >= 3).sort((a, b) => b[1].length - a[1].length);
	const covered = repeated.reduce((sum, [, names]) => sum + names.length, 0);
	console.log(index + ": " + covered + " of " + bucket.cards.length + " cards sit in a shape used 3+ times");
	for (const [key, names] of repeated) console.log("    [" + key + "] " + names.join(", "));
}

//--- 4. Ally-touching -------------------------------------------------------------------------------
//Target modes that aim at an ally, plus powers whose hooks read the whole party. A power is recognised
//by carrying no target and applying a status to its owner; the status's own hooks decide what it reads,
//so this is the upper bound and the review's hand count is the truth.
const allyModes = ["ally", "allyOther", "allAllies", "otherAllies", "mostHurtAlly"];
console.log("\n=== 4. Cards aimed at an ally (target mode) ===");
for (const [index, bucket] of Object.entries(byCharacter)) {
	const list = bucket.cards.filter((card) => allyModes.indexOf(card.targetMode) >= 0);
	console.log(index + ": " + list.length + " of " + bucket.cards.length + " -> " + list.map((card) => card.name).join(", "));
}
