/**
 * Honeycomb Catacombs -- draft simulation ("the playerbase").
 *
 * Not part of the game. Noodle's brief (session 20):
 *   - every draftable card gets an individual strength 0..1, its impact per energy compared with the
 *     other cards of the same energy cost;
 *   - every pair of cards gets a synergy score (may be negative = anti-synergy);
 *   - total synergy = sum over the deck of strength * (that card's synergy with every other card);
 *     average synergy = total / deck size;
 *   - average cost and deck size modulate strength: energy-granting cards rise (to 0 at avg cost 0.6)
 *     as decks get dearer; draw cards rise and non-draw fall as decks get bigger (draw is 0 at 5).
 *   - 3 random characters, one of three personalities (loose / stingy / stubborn); 100 players
 *     minimum; each is offered 100 choices at in-game common/rare rates with a removal every 5.
 *
 * Usage:
 *   node "!designDocs/honeycomb/tools/draft-sim/draft-simulation.js" --players 200 --offers 100 --seed 7 --report
 *   node "!designDocs/honeycomb/tools/draft-sim/draft-simulation.js" --players 5 --offers 12 --seed 1 --verbose
 *   node "!designDocs/honeycomb/tools/draft-sim/draft-simulation.js" --set costEnergyGain=1.4 --set sizeDrawGain=0.1
 *
 * Output: a human report on stdout, and the machine numbers in DRAFT-SIM-DATA.json beside this file.
 */
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..", "..", "..", "scripts", "misc");
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
	for (const file of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), sandbox, { filename: file });
	return sandbox.honeycomb;
}

// ---------------------------------------------------------------------------------------------------
// Command line
// ---------------------------------------------------------------------------------------------------
function readArgs() {
	const result = { set: {} };
	const argv = process.argv.slice(2);
	for (let index = 0; index < argv.length; index++) {
		const arg = argv[index];
		if (arg === "--verbose") { result.verbose = true; continue; }
		if (arg === "--report") { result.report = true; continue; }
		if (arg === "--tag") { result.tag = argv[++index]; continue; }
		if (arg === "--set") { index++; const pair = argv[index].split("="); result.set[pair[0]] = Number(pair[1]); continue; }
		if (arg.indexOf("--") === 0) { result[arg.slice(2)] = Number(argv[++index]); }
	}
	return result;
}
const ARGS = readArgs();

// ---------------------------------------------------------------------------------------------------
// Tunable model. Every number here is a knob; the brief asks for repeated tightening.
// ---------------------------------------------------------------------------------------------------
const PARAMS = Object.assign({
	// Individual strength, 0..1, normalized per energy-cost bucket.
	costZeroDivisor: 0.55,        // a 0-cost card's impact is divided by this, not 0
	aoeMultiplier: 2.2,           // an "all enemies / allies" line is worth this many single hits
	impactDamage: 1 / 6,          // one point of damage, in energy units
	impactTemporary: 1 / 6,       // one point of temporary HP
	impactHeal: 1 / 8,            // one point of healing
	impactLust: 1 / 7,            // one Lust
	impactSoothe: 1 / 8,          // one Lust removed
	impactDraw: 0.55,             // one card drawn
	impactEnergy: 1.0,            // one Energy granted
	impactMovement: 0.2,
	impactIntentReroll: 0.35,
	impactIntentCancel: 0.8,
	impactIntentSteal: 1.0,
	impactStatusDefault: 0.3,
	// Dynamic strength: cost and size.
	costPivot: 1.0,               // average deck cost where the factors stand at 1
	costFloor: 0.6,               // below this, energy-granting cards reach strength 0
	costEnergyGain: 1.0,          // slope above the pivot, energy-granting
	costEnergyLoss: 1.2,          // slope below the pivot, energy-granting
	costNonEnergyGain: 0.8,       // slope below the pivot, everything else
	costNonEnergyLoss: 0.6,       // slope above the pivot, everything else
	costFactorCap: 2.2,
	costFactorFloor: 0.25,
	sizePivot: 10,                // deck size where the size factors stand at 1
	sizeDrawGain: 0.06,           // slope above the pivot, drawing cards
	sizeDrawFloor: 0.0,           // at 5 cards or fewer
	sizeNonDrawLoss: 0.035,       // slope above the pivot, cards that do not draw
	sizeNonDrawGain: 0.02,        // slope below the pivot, cards that do not draw
	sizeFactorCap: 2.2,
	sizeFactorFloor: 0.3,
	sizeDrawFloorSize: 5,
	// Synergy.
	sameArchetypeBonus: 0.8,
	sameCharacterBonus: 0.3,
	differentArchetypeBonus: 0.1,
	duplicateSynergy: 0.7,
	consumerCompetition: -0.2,
	removeStatusAnti: -0.6,
	intentCancelAnti: -0.35,
	positionAnti: -0.3,
	// Simulation.
	looseThreshold: 0.0001,
	stingyMinimum: 0.03,          // the floor of a stingy player's notice threshold
	stingyMaximum: 0.10,
	stubbornAwareness: 0.25,      // synergy with the favourite that is "good enough"
	stubbornAverage: 0.04,
	neutralChance: 0,             // in-game neutralSlotChance
	relicAdventureChance: 0,      // unused; kept so the shape matches the game
	normalCommonWeight: 75,
	normalRareWeight: 25,
	eliteCommonWeight: 45,
	eliteRareWeight: 55,
	eliteOfferFraction: 0.0,      // ordinary fights use the normal weights; set > 0 for elites
	removeEvery: 5,
	startingDeck: true,
}, ARGS.set);

const STRENGTH_WEIGHT = {
	poison: 0.32, weak: 0.25, vulnerable: 0.30, frail: 0.20, sensitive: 0.30,
	festering: 0.50, intoxicated: 0.30, infected: 0.40, marked: 0.50, siphoned: 0.30,
	turncoat: 0.70, strength: 0.50, thorns: 0.30, retort: 0.50, armament: 0.50,
	momentum: 0.50, entrenched: 0.50, gilded: 0.50, pandemic: 0.50, headySpores: 0.50,
	gorged: 0.40, hemomancy: 0.50, bloodMoon: 0.50, emberwake: 0.40, vanguard: 0.40,
	sanctified: 0.50, martyrsVow: 0.40, ecstasy: 0.50, standFast: 0.60, repertoire: 0.50,
	jinx: 0.50, puppeteer: 0.50, regeneration: 0.30, artifact: 0.30, energised: 0.50, focus: 0.40,
	taunt: 0.40, composure: 0.30,
};

// The hook-based payoffs a raw effect list cannot show: a status applied by the card whose payoff
// lives in the STATUS table instead.
const WANTS_EXTRA = {
	brienneUnstoppable: ["temporaryHealth"],
	brienneIronRetort: ["temporaryHealth"],
	brienneReliquary: ["temporaryHealth"],
	severineBloodMoon: ["selfDamage"],
	severineHemomancy: ["selfDamage"],
	severineGorge: ["heal"],
	nettlePandemic: ["poison"],
	nettleHeadySpores: ["poison"],
	cassadoraJinx: ["intentControl"],
	cassadoraPuppetStrings: ["turncoat"],
	cinderEmberwake: ["movement"],
	clemenceMartyrsVow: ["selfLust"],
	clemenceEcstasy: ["broken"],
	cassadoraRepertoire: ["enemyCard"],
	cassadoraUnderstudy: ["enemyCard"],
	cassadoraPilfer: ["enemyCard"],
	cassadoraEncore: ["repertoire"],
	severineCrimsonCommunion: ["damage"],
};
// One-off manual bumps for passives whose payoff lives in the status table and so cannot be read from
// the effect list (a recurring engine is worth more than one application). Energy units.
const IMPACT_EXTRA = {
	brienneHoldTheLine: 2.0, brienneUnstoppable: 1.5, brienneIronRetort: 1.2, brienneReliquary: 1.0,
	brienneThornArmour: 0.8, brienneRally: 1.0,
	nettlePandemic: 0.8, nettleHeadySpores: 1.0, nettleFester: 1.0,
	severineGorge: 1.0, severineHemomancy: 1.2, severineBloodMoon: 1.5, severineBloodyVerdict: 0.8,
	cassadoraJinx: 1.2, cassadoraPuppetStrings: 2.0, cassadoraRepertoire: 1.5,
	cinderEmberwake: 1.0, cinderPointOfSpear: 0.3, cinderTurnTheLine: 0.5,
	clemenceMartyrsVow: 1.0, clemenceEcstasy: 1.2, clemenceLayOnHands: 0.3,
};
// Damage aimed at your own side is a price, not a payoff.
const PARTY_TARGET_MODES = new Set(["owner", "self", "ally", "allyOther", "allAllies", "otherAllies", "randomAlly", "frontAlly", "backAlly", "lustiestAlly"]);

const PROVIDES_EXTRA = {
	brienneHoldTheLine: ["temporaryHealth"],
	brienneTemperedPlate: ["armament"],
	brienneLendSteel: ["armament"],
	brienneRally: ["strength"],
	severineGorge: ["overheal"],
	nettlePandemic: ["pandemic"],
	nettleHeadySpores: ["headySpores"],
	cinderEmberwake: ["emberwake"],
	cassadoraJinx: ["jinx"],
	cassadoraPuppetStrings: ["puppeteer"],
	clemenceMartyrsVow: ["martyrsVow"],
	clemenceEcstasy: ["ecstasy"],
	cassadoraRepertoire: ["repertoire"],
	cassadoraUnderstudy: ["enemyCard"],
	cassadoraPilfer: ["enemyCard"],
	nettlePutrefy: ["negativeStatus"],
};

const SYNERGY_WEIGHT = {
	temporaryHealth: 1.0, poison: 1.0, negativeStatus: 0.55, lust: 0.9, selfLust: 0.7,
	energy: 0.9, draw: 0.6, movement: 0.8, intent: 0.8, intentControl: 0.7,
	heal: 0.45, soothe: 0.5, selfDamage: 0.9, wounded: 0.5, strength: 0.5,
	souls: 0.5, devotion: 0.6, stride: 0.5, foresight: 0.6, resolve: 0.4, thirst: 0.4,
	armament: 0.8, taunt: 0.5, thorns: 0.4, retort: 0.5, momentum: 0.5, gilded: 0.5,
	infected: 0.7, festering: 0.6, intoxicated: 0.7, marked: 0.6, siphoned: 0.6,
	broken: 0.6, turncoat: 0.6, repertoire: 0.5, enemyCard: 0.8, standFast: 0.6,
	sanctified: 0.5, martyrsVow: 0.4, ecstasy: 0.5, emberwake: 0.5, vanguard: 0.5,
	pandemic: 0.5, headySpores: 0.5, jinx: 0.5, puppeteer: 0.5,
};

// Name-brand anti-synergies the general rules would miss.
const MANUAL_ANTI = [
	["cassadoraFizzle", "cassadoraMirrorFate"], ["cassadoraStillness", "cassadoraMirrorFate"],
	["cinderPullBack", "cinderLongspear"], ["cinderPullBack", "cinderPointOfSpear"],
	["brienneGildedStrike", "brienneRiposte"],
	["brienneGildedStrike", "brienneCrushingWeight"],
];
const MANUAL_SYNERGY = [
	["severineBloodPact", "severineSanguineTide", 0.5],
	["severineBloodlet", "severineSanguineTide", 0.4],
	["severineBloodlet", "severineBloodMoon", 0.4],
	["clemenceSharedFever", "clemenceTakeBurden", 0.4],
	["clemenceShelteringGrace", "brienneLendSteel", 0.4],
	["cinderEmberwake", "cinderDoubleBack", 0.4],
	["cinderEmberwake", "cinderCharge", 0.4],
];

// ---------------------------------------------------------------------------------------------------
// Card model
// ---------------------------------------------------------------------------------------------------
const hc = newEngine();
const CARD_ARRAY = hc.cardArray.filter((card) => ["starter", "common", "rare"].indexOf(card.rarity) >= 0);
const CARD_INDEX = new Map();
CARD_ARRAY.forEach((card, position) => CARD_INDEX.set(card.index, position));
const CARD_COUNT = CARD_ARRAY.length;

function walkEffects(list, visit) {
	for (const entry of list || []) {
		if (entry == null) continue;
		visit(entry);
		walkEffects(entry.effectArray, visit);
		walkEffects(entry.thenArray, visit);
		walkEffects(entry.elseArray, visit);
		for (const option of entry.optionArray || []) walkEffects(option.effectArray, visit);
	}
}
function walkValue(node, visit) {
	if (node == null || typeof node !== "object" || Array.isArray(node)) return;
	visit(node);
	for (const key of ["left", "right", "then", "else", "amount", "value", "count", "test"]) {
		if (node[key] != null && typeof node[key] === "object") walkValue(node[key], visit);
	}
	for (const child of node.conditionArray || []) walkValue(child, visit);
}

const STATUS_DEBUFF = new Map();
for (const status of hc.statusArray) STATUS_DEBUFF.set(status.index, status.isDebuff === true);

const MODEL = CARD_ARRAY.map((card) => {
	const provides = new Set();
	const wants = new Set();
	const model = {
		index: card.index, name: card.name, character: card.characterIndex, rarity: card.rarity,
		archetype: card.archetype == null ? null : card.archetype,
		cost: card.costArray == null || card.costArray.energy == null ? 0 : card.costArray.energy,
		draws: false, grantsEnergy: false, provides: provides, wants: wants,
	};
	const area = ["allEnemies", "allAllies", "otherAllies", "everyone"].indexOf(card.targetMode) >= 0 ? PARAMS.aoeMultiplier : 1;

	const visitValue = (node) => {
		if (node.index === "statusStacks" || node.index === "ifStatus") wants.add(node.status);
		if (node.index === "debuffCount") wants.add("negativeStatus");
		if (node.index === "stat") {
			if (node.stat === "temporaryHealth") wants.add("temporaryHealth");
			if (node.stat === "lust") wants.add("lust");
		}
		if (node.index === "tally") {
			if (node.key === "consumed") wants.add("consumer");
			if (node.key === "temporarySpent") wants.add("temporaryHealth");
			if (node.key === "ranksMoved") wants.add("movement");
			if (node.key === "lustRemoved") wants.add("selfLust");
		}
		if (node.index === "combatStat") {
			if (node.stat === "partyDamageTakenThisTurn") wants.add("selfDamage");
			if (node.stat === "cardsPlayedThisTurn") wants.add("cheapCards");
		}
		if (node.index === "intentDamage" || node.index === "attackingOpponents") wants.add("intent");
		if (node.index === "missingHealth") wants.add("wounded");
		if (node.index === "lustToBreak") wants.add("selfLust");
		if (node.index === "ranksMovedThisTurn") wants.add("movement");
		if (node.index === "count" && node.collection === "alliesMovedThisTurn") wants.add("movement");
		if (node.index === "mechanicAtLeast" || node.index === "mechanicOrbsLit") wants.add("mechanic:" + node.mechanic);
		if (node.index === "hasStatus") wants.add(node.status);
		if (node.index === "isBroken") wants.add("broken");
		if (node.index === "partyHasTag" || node.index === "hasTag") wants.add("tag:" + node.tag);
		if (node.index === "canAfford") wants.add("cheapCards");
	};

	const statusValue = (status) => STRENGTH_WEIGHT[status] == null ? PARAMS.impactStatusDefault : STRENGTH_WEIGHT[status];
	const amountOf = (entry) => typeof entry.amount === "number" ? entry.amount : (entry.amount != null && entry.amount.index === "fixed" ? entry.amount.amount : null);
	const stacksOf = (entry) => typeof entry.stacks === "number" ? entry.stacks : (entry.stacks != null && entry.stacks.index === "fixed" ? entry.stacks.amount : null);
	const fixedOr = (value, fallback) => value == null ? fallback : value;

	// Provides and wants. A repeat visits its children once; the sets are type-level, not magnitude
	// level, so once is correct.
	walkEffects(card.effectArray, (entry) => {
		switch (entry.index) {
			case "damage":
			case "damageIgnoringTemporary": provides.add("damage"); break;
			case "temporaryHealth": provides.add("temporaryHealth"); break;
			case "heal": provides.add("heal"); break;
			case "lust":
				if (entry.targetOverride === "owner" || entry.targetOverride === "self") provides.add("selfLust");
				else provides.add("lust");
				break;
			case "soothe": provides.add("soothe"); break;
			case "applyStatus":
				provides.add(entry.status);
				if (STATUS_DEBUFF.get(entry.status) === true) provides.add("negativeStatus");
				break;
			case "spendTemporaryHealth": wants.add("temporaryHealth"); provides.add("spendsTemporaryHealth"); break;
			case "consumeStatus": wants.add(entry.status); provides.add("consumer"); provides.add("consumes:" + entry.status); break;
			case "spreadStatus": wants.add(entry.status); provides.add(entry.status); provides.add("spreads:" + entry.status); break;
			case "removeStatus": provides.add("removes:" + entry.status); provides.add("cleanse"); break;
			case "cleanse": provides.add("cleanse"); break;
			case "gainResource": if (entry.resource === "energy") { provides.add("energy"); model.grantsEnergy = true; } break;
			case "drawCards": provides.add("draw"); model.draws = true; break;
			case "discardCards": provides.add("discard"); break;
			case "exhaustSelf":
			case "exhaustCard": provides.add("exhaust"); break;
			case "returnCardToHand": wants.add("exhaust"); provides.add("recover"); break;
			case "duplicateCard": provides.add("copy"); break;
			case "shiftParty":
			case "reverseOrder": provides.add("movement"); break;
			case "rerollIntent": provides.add("intentControl"); provides.add("intent"); break;
			case "cancelIntent": provides.add("intentControl"); provides.add("cancelsIntent"); break;
			case "stealIntent": provides.add("intentControl"); provides.add("enemyCard"); break;
			default: break;
		}
		if (entry.condition != null) walkValue(entry.condition, visitValue);
		walkValue(entry.amount, visitValue);
		walkValue(entry.stacks, visitValue);
		walkValue(entry.times, visitValue);
		walkValue(entry.count, visitValue);
	});

	// Impact per resolution, in energy units. Nested lists resolve properly: a repeat multiplies its
	// children, a branch and a choose-one take the BEST child (a player picks the best option, so
	// summing options overvalues the card), and for-each runs its children once.
	const harmsParty = (entry) => PARTY_TARGET_MODES.has(entry.targetOverride != null ? entry.targetOverride : card.targetMode);
	function impactOfArray(list, currentArea) {
		let total = 0;
		for (const entry of list || []) {
			if (entry == null) continue;
			switch (entry.index) {
				case "damage":
				case "damageIgnoringTemporary": {
					// A value-scaling amount (missing health, per-debuff, per-place) is worth more than a
					// flat 8, so a descriptor is priced above the vanilla 6.
					const damage = fixedOr(amountOf(entry), 7) * PARAMS.impactDamage * currentArea;
					total += harmsParty(entry) ? -damage * 0.5 : damage;
					break;
				}
				case "temporaryHealth": total += fixedOr(amountOf(entry), 6) * PARAMS.impactTemporary * currentArea; break;
				case "heal": total += fixedOr(amountOf(entry), 6) * PARAMS.impactHeal * currentArea; break;
				case "lust": {
					// Lust at an enemy is a payoff. Lust at yourself is Clemence's engine. Lust pushed onto
					// an ally is somewhere between the two: half a cost.
					const mode = entry.targetOverride != null ? entry.targetOverride : card.targetMode;
					const value = fixedOr(amountOf(entry), 5) * PARAMS.impactLust * currentArea;
					if (mode === "owner" || mode === "self") total += value;
					else if (PARTY_TARGET_MODES.has(mode)) total += value * 0.5;
					else total += value;
					break;
				}
				case "soothe": total += fixedOr(amountOf(entry), 5) * PARAMS.impactSoothe * currentArea; break;
				case "applyStatus": total += statusValue(entry.status) * fixedOr(stacksOf(entry), 1) * currentArea; break;
				case "spendTemporaryHealth": total += 0.3 * currentArea; break;
				case "consumeStatus": total += 0.5 * currentArea; break;
				case "spreadStatus": total += 0.6 * currentArea; break;
				case "gainResource": if (entry.resource === "energy") total += fixedOr(amountOf(entry), 1) * PARAMS.impactEnergy; break;
				case "drawCards": total += fixedOr(amountOf(entry), 1) * PARAMS.impactDraw * currentArea; break;
				case "shiftParty":
				case "reverseOrder": total += PARAMS.impactMovement * currentArea; break;
				case "rerollIntent": total += PARAMS.impactIntentReroll * currentArea; break;
				case "cancelIntent": total += PARAMS.impactIntentCancel * currentArea; break;
				case "stealIntent": total += PARAMS.impactIntentSteal * currentArea; break;
				case "upgradeTargetCard": total += 1.2; break;
				case "modifyCardCost": total += 0.5; break;
				case "duplicateCard": total += 0.8; break;
				case "returnCardToHand": total += 0.4; break;
				case "addCardToPile": total += 0.4; break;
				case "repeat": total += fixedOr(typeof entry.times === "number" ? entry.times : (entry.times != null && entry.times.index === "fixed" ? entry.times.amount : null), 2) * impactOfArray(entry.effectArray, currentArea); break;
				case "branch": total += Math.max(impactOfArray(entry.thenArray, currentArea), impactOfArray(entry.elseArray, currentArea)); break;
				case "chooseOption": {
					let best = 0;
					for (const option of entry.optionArray || []) best = Math.max(best, impactOfArray(option.effectArray, currentArea));
					total += best;
					break;
				}
				case "forEachTarget": total += impactOfArray(entry.effectArray, currentArea); break;
				case "cleanse": total += 0.8; break;
				default: total += impactOfArray(entry.effectArray, currentArea); break;
			}
		}
		return total;
	}
	const impact = impactOfArray(card.effectArray, area) + (IMPACT_EXTRA[card.index] || 0);

	// Manual overlays.
	for (const tag of WANTS_EXTRA[card.index] || []) wants.add(tag);
	for (const tag of PROVIDES_EXTRA[card.index] || []) provides.add(tag);

	model.impact = impact;
	model.impactPerEnergy = impact / (model.cost === 0 ? PARAMS.costZeroDivisor : model.cost);
	return model;
});

// --- Strength 0..1, compared within each energy cost bucket ---------------------------------------
const BUCKET = new Map();
for (const card of MODEL) {
	if (!BUCKET.has(card.cost)) BUCKET.set(card.cost, []);
	BUCKET.get(card.cost).push(card);
}
for (const bucket of BUCKET.values()) {
	const values = bucket.map((card) => card.impactPerEnergy);
	const lowest = Math.min.apply(null, values);
	const highest = Math.max.apply(null, values);
	for (const card of bucket) {
		card.strength = highest === lowest ? 0.5 : (card.impactPerEnergy - lowest) / (highest - lowest);
	}
}

// --- Synergy, every pair -------------------------------------------------------------------------
const N = CARD_COUNT;
const SYNERGY = [];
for (let i = 0; i < N; i++) { SYNERGY.push(new Float64Array(N)); }
function pairSynergy(a, b) {
	if (a === b) return PARAMS.duplicateSynergy;
	let score = 0;
	for (const tag of a.provides) if (b.wants.has(tag)) score += (SYNERGY_WEIGHT[tag] == null ? 0.6 : SYNERGY_WEIGHT[tag]);
	for (const tag of b.provides) if (a.wants.has(tag)) score += (SYNERGY_WEIGHT[tag] == null ? 0.6 : SYNERGY_WEIGHT[tag]);
	if (a.archetype != null && a.archetype === b.archetype) score += PARAMS.sameArchetypeBonus;
	else if (a.character === b.character) score += PARAMS.sameCharacterBonus;
	else if (a.archetype != null && b.archetype != null) score += PARAMS.differentArchetypeBonus;
	// Anti-synergy.
	for (const tag of a.provides) {
		if (tag.indexOf("removes:") === 0 && b.provides.has(tag.slice(8))) score += PARAMS.removeStatusAnti;
		if (tag.indexOf("consumes:") === 0 && b.provides.has(tag)) score += PARAMS.consumerCompetition;
	}
	for (const tag of b.provides) {
		if (tag.indexOf("removes:") === 0 && a.provides.has(tag.slice(8))) score += PARAMS.removeStatusAnti;
		if (tag.indexOf("consumes:") === 0 && a.provides.has(tag)) score += PARAMS.consumerCompetition;
	}
	if (a.provides.has("cancelsIntent") && b.wants.has("intent")) score += PARAMS.intentCancelAnti;
	if (b.provides.has("cancelsIntent") && a.wants.has("intent")) score += PARAMS.intentCancelAnti;
	return score;
}
for (let i = 0; i < N; i++) {
	for (let j = 0; j < N; j++) {
		if (i === j) continue;
		SYNERGY[i][j] = pairSynergy(MODEL[i], MODEL[j]);
	}
}
for (const [left, right, bonus] of MANUAL_SYNERGY) {
	const i = CARD_INDEX.get(left), j = CARD_INDEX.get(right);
	if (i != null && j != null) { SYNERGY[i][j] += bonus; SYNERGY[j][i] += bonus; }
}
for (const [left, right] of MANUAL_ANTI) {
	const i = CARD_INDEX.get(left), j = CARD_INDEX.get(right);
	if (i != null && j != null) { SYNERGY[i][j] -= 0.6; SYNERGY[j][i] -= 0.6; }
}
const ROW_SUM = SYNERGY.map((row) => { let sum = 0; for (let j = 0; j < N; j++) sum += row[j]; return sum; });

// --- Dynamic strength and deck scoring -----------------------------------------------------------
function costFactor(card, averageCost) {
	if (card.grantsEnergy) {
		if (averageCost <= PARAMS.costFloor) return 0;
		const value = averageCost < PARAMS.costPivot
			? (averageCost - PARAMS.costFloor) / (PARAMS.costPivot - PARAMS.costFloor)
			: 1 + (averageCost - PARAMS.costPivot) * PARAMS.costEnergyGain;
		return Math.min(PARAMS.costFactorCap, Math.max(PARAMS.costFactorFloor, value));
	}
	const value = averageCost < PARAMS.costPivot
		? 1 + (PARAMS.costPivot - averageCost) * PARAMS.costNonEnergyGain
		: 1 - (averageCost - PARAMS.costPivot) * PARAMS.costNonEnergyLoss;
	return Math.min(PARAMS.costFactorCap, Math.max(PARAMS.costFactorFloor, value));
}
function sizeFactor(card, deckSize) {
	if (card.draws) {
		if (deckSize <= PARAMS.sizeDrawFloorSize) return PARAMS.sizeDrawFloor;
		const base = Math.min(1, (deckSize - PARAMS.sizeDrawFloorSize) / (PARAMS.sizePivot - PARAMS.sizeDrawFloorSize));
		const value = deckSize <= PARAMS.sizePivot ? base : base + (deckSize - PARAMS.sizePivot) * PARAMS.sizeDrawGain;
		return Math.min(PARAMS.sizeFactorCap, Math.max(PARAMS.sizeFactorFloor, value));
	}
	const value = deckSize <= PARAMS.sizePivot
		? 1 + (PARAMS.sizePivot - deckSize) * PARAMS.sizeNonDrawGain
		: 1 - (deckSize - PARAMS.sizePivot) * PARAMS.sizeNonDrawLoss;
	return Math.min(PARAMS.sizeFactorCap, Math.max(PARAMS.sizeFactorFloor, value));
}
function deckScore(deck) {
	const countArray = new Array(N).fill(0);
	let costSum = 0;
	for (const position of deck) { countArray[position] += 1; costSum += MODEL[position].cost; }
	const deckSize = deck.length;
	const averageCost = deckSize === 0 ? 0 : costSum / deckSize;
	let total = 0;
	for (let index = 0; index < N; index++) {
		const count = countArray[index];
		if (count === 0) continue;
		const card = MODEL[index];
		const strength = card.strength * costFactor(card, averageCost) * sizeFactor(card, deckSize);
		let mutual = (count - 1) * SYNERGY[index][index];
		for (let other = 0; other < N; other++) {
			if (other !== index && countArray[other] > 0) mutual += countArray[other] * SYNERGY[index][other];
		}
		total += count * strength * mutual;
	}
	return { total: total, average: deckSize === 0 ? 0 : total / deckSize, deckSize: deckSize, averageCost: averageCost };
}

// ---------------------------------------------------------------------------------------------------
// The playerbase
// ---------------------------------------------------------------------------------------------------
function makeRng(seed) {
	let state = seed >>> 0;
	return function () {
		state |= 0; state = state + 0x6D2B79F5 | 0;
		let t = Math.imul(state ^ state >>> 15, 1 | state);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function pickRandom(rng, array) { return array[Math.floor(rng() * array.length)]; }
function pickDistinct(rng, array, count) {
	const copy = array.slice();
	const result = [];
	while (result.length < count && copy.length > 0) result.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
	return result;
}

const CHARACTER_ARRAY = hc.characterArray.map((character) => character.index);
const STARTING_DECK = new Map();
for (const character of hc.characterArray) {
	const entryArray = [];
	for (const entry of character.startingCardArray) for (let copy = 0; copy < entry.count; copy++) entryArray.push(entry.index);
	STARTING_DECK.set(character.index, entryArray);
}
const MODE = { LOOSE: "loose", STINGY: "stingy", STUBBORN: "stubborn" };

function legalPool(party) {
	const pool = [];
	for (const card of MODEL) if (["common", "rare"].indexOf(card.rarity) >= 0 && party.indexOf(card.character) >= 0) pool.push(card);
	return pool;
}
function offerCards(rng, pool, party) {
	const common = pool.filter((card) => card.rarity === "common");
	const rare = pool.filter((card) => card.rarity === "rare");
	const elite = rng() < PARAMS.eliteOfferFraction;
	const commonWeight = elite ? PARAMS.eliteCommonWeight : PARAMS.normalCommonWeight;
	const rareWeight = elite ? PARAMS.eliteRareWeight : PARAMS.normalRareWeight;
	const chosen = [];
	while (chosen.length < 3) {
		const wantRare = rng() * (commonWeight + rareWeight) >= commonWeight;
		const source = wantRare ? (rare.length > 0 ? rare : common) : (common.length > 0 ? common : rare);
		if (source.length === 0) break;
		const card = pickRandom(rng, source);
		if (chosen.indexOf(card) < 0) chosen.push(card);
		if (chosen.length >= Math.min(3, common.length + rare.length)) break;
	}
	return chosen;
}
function bestAddition(rng, deck, offerings) {
	let best = null;
	for (const card of offerings) {
		const position = CARD_INDEX.get(card.index);
		const candidate = deck.concat([position]);
		const score = deckScore(candidate);
		if (best == null || score.average > best.score.average) best = { card: card, position: position, score: score, total: score.total, average: score.average };
	}
	return best;
}
function bestRemoval(deck) {
	const current = deckScore(deck);
	const seen = new Set();
	let best = null;
	for (let index = 0; index < deck.length; index++) {
		const position = deck[index];
		if (seen.has(position)) continue;
		seen.add(position);
		const candidate = deck.slice(); candidate.splice(index, 1);
		const score = deckScore(candidate);
		const gain = score.average - current.average;
		const totalGain = score.total - current.total;
		if (best == null || totalGain > best.totalGain) best = { position: position, totalGain: totalGain, gain: gain, score: score };
	}
	return best;
}
function synergyWith(position, otherPosition) { return SYNERGY[position][otherPosition]; }
function favoriteSynergy(position, favoritePosition) { return SYNERGY[position][favoritePosition]; }

function runPlayer(rng, stats, playerId) {
	const party = pickDistinct(rng, CHARACTER_ARRAY, 3);
	const personality = pickRandom(rng, [MODE.LOOSE, MODE.STINGY, MODE.STUBBORN]);
	const stingyThreshold = PARAMS.stingyMinimum + rng() * (PARAMS.stingyMaximum - PARAMS.stingyMinimum);
	const pool = legalPool(party);
	const favorite = personality === MODE.STUBBORN ? pickRandom(rng, pool) : null;
	const favoritePosition = favorite == null ? -1 : CARD_INDEX.get(favorite.index);

	let deck = [];
	if (PARAMS.startingDeck) for (const characterIndex of party) for (const cardIndex of STARTING_DECK.get(characterIndex)) deck.push(CARD_INDEX.get(cardIndex));

	const player = {
		personality: personality, party: party, stingyThreshold: stingyThreshold,
		favorite: favorite == null ? null : favorite.index, deck: deck,
	};
	const record = stats.players;
	record.push(player);

	for (let offer = 1; offer <= ARGS.offers; offer++) {
		if (offer % PARAMS.removeEvery === 0) {
			const removal = bestRemoval(deck);
			if (removal != null) {
				const current = deckScore(deck);
				let doRemove = false;
				if (personality === MODE.LOOSE) doRemove = removal.totalGain > PARAMS.looseThreshold;
				else if (personality === MODE.STINGY) doRemove = removal.gain >= stingyThreshold;
				else doRemove = (removal.gain >= PARAMS.stubbornAverage) ||
					(favoriteSynergy(removal.position, favoritePosition) < 0);
				if (doRemove) {
					const removedIndex = deck.indexOf(removal.position);
					if (removedIndex >= 0) {
						deck.splice(removedIndex, 1);
						stats.removed[removal.position] += 1;
						if (stats.removedByRarity[MODEL[removal.position].rarity] == null) stats.removedByRarity[MODEL[removal.position].rarity] = {};
						stats.removedByRarity[MODEL[removal.position].rarity][removal.position] = (stats.removedByRarity[MODEL[removal.position].rarity][removal.position] || 0) + 1;
					}
				}
			}
		}

		const offerings = offerCards(rng, pool, party);
		if (offerings.length === 0) continue;
		for (const card of offerings) stats.offered[CARD_INDEX.get(card.index)] += 1;
		for (const characterIndex of party) stats.offersByCharacter[characterIndex] = (stats.offersByCharacter[characterIndex] || 0) + 1;

		const current = deckScore(deck);
		let picked = null;
		if (personality === MODE.LOOSE) {
			// Loose reads TOTAL synergy, so the best offering is the one with the highest total.
			for (const card of offerings) {
				const position = CARD_INDEX.get(card.index);
				const score = deckScore(deck.concat([position]));
				if (score.total > current.total + PARAMS.looseThreshold && (picked == null || score.total > picked.score.total)) {
					picked = { card: card, position: position, score: score };
				}
			}
		} else if (personality === MODE.STINGY) {
			const best = bestAddition(rng, deck, offerings);
			if (best != null && best.average - current.average >= stingyThreshold) picked = best;
		} else {
			const favoriteOffer = offerings.find((card) => card.index === favorite.index);
			if (favoriteOffer != null) {
				picked = { card: favoriteOffer, position: CARD_INDEX.get(favoriteOffer.index), score: deckScore(deck.concat([CARD_INDEX.get(favoriteOffer.index)])) };
			} else {
				let best = null;
				for (const card of offerings) {
					const position = CARD_INDEX.get(card.index);
					if (favoriteSynergy(position, favoritePosition) < 0) continue;
					const score = deckScore(deck.concat([position]));
					const averageGain = score.average - current.average;
					const favoriteGain = favoriteSynergy(position, favoritePosition);
					const take = averageGain >= PARAMS.stubbornAverage || favoriteGain >= PARAMS.stubbornAwareness;
					if (!take) continue;
					if (best == null || (favoriteGain > best.favoriteGain) || (favoriteGain === best.favoriteGain && averageGain > best.averageGain)) {
						best = { card: card, position: position, score: score, averageGain: averageGain, favoriteGain: favoriteGain };
					}
				}
				picked = best;
			}
		}

		if (picked != null) {
			const position = picked.position;
			const rarity = MODEL[position].rarity;
			const deckSizeBefore = deck.length;
			const partnerCounts = new Map();
			for (const existing of deck) partnerCounts.set(MODEL[existing].character, (partnerCounts.get(MODEL[existing].character) || 0) + 1);
			deck.push(position);
			stats.picked[position] += 1;
			stats.pickedByRarity[rarity] = (stats.pickedByRarity[rarity] || 0) + 1;
			stats.pickedAtSize[position].push(deckSizeBefore);
			stats.pickedByCharacter[MODEL[position].character] = (stats.pickedByCharacter[MODEL[position].character] || 0) + 1;
			stats.pickEvents.push({ offer: offer, position: position, deckSize: deckSizeBefore, character: MODEL[position].character, party: party.join(","), personality: personality, favorite: favorite == null ? null : favorite.index, playerId: playerId, deck: deck.slice() });
			if (personality === MODE.STUBBORN) { stats.stubbornPickByFavorite[favorite.index] = (stats.stubbornPickByFavorite[favorite.index] || 0) + 1; }
			// A rare passed over for a common, and a common chosen over a rare.
			const offeredRare = offerings.filter((card) => card.rarity === "rare");
			const offeredCommon = offerings.filter((card) => card.rarity === "common");
			if (rarity === "common" && offeredRare.length > 0) {
				stats.commonOverRare[position] += 1;
				for (const rare of offeredRare) stats.rarePassed[rare.index] = (stats.rarePassed[rare.index] || 0) + 1;
			}
			if (rarity === "rare" && offeredCommon.length > 0) {
				stats.rareOverCommon[position] += 1;
				for (const common of offeredCommon) stats.commonPassed[common.index] = (stats.commonPassed[common.index] || 0) + 1;
			}
		}
		player.deck = deck;
	}

	const final = deckScore(deck);
	player.finalDeckSize = deck.length;
	player.finalAverage = final.average;
	player.finalTotal = final.total;
	if (personality === MODE.STUBBORN) {
		if (stats.stubbornFinal[favorite.index] == null) stats.stubbornFinal[favorite.index] = [];
		stats.stubbornFinal[favorite.index].push(final.average);
	}
	for (const characterIndex of party) {
		if (stats.characterAverage[characterIndex] == null) stats.characterAverage[characterIndex] = [];
		stats.characterAverage[characterIndex].push(final.average);
	}
	return player;
}

function newStats() {
	return {
		players: [],
		offered: new Array(N).fill(0),
		picked: new Array(N).fill(0),
		removed: new Array(N).fill(0),
		removedByRarity: {},
		pickedByRarity: {},
		pickedAtSize: MODEL.map(() => []),
		pickedByCharacter: {},
		offersByCharacter: {},
		commonOverRare: new Array(N).fill(0),
		rareOverCommon: new Array(N).fill(0),
		rarePassed: {},
		commonPassed: {},
		pickEvents: [],
		stubbornPickByFavorite: {},
		stubbornFinal: {},
		characterAverage: {},
	};
}

function simulate(seed, playerCount) {
	const rng = makeRng(seed);
	const stats = newStats();
	for (let player = 0; player < playerCount; player++) runPlayer(rng, stats, player);
	return stats;
}

function mergeStats(target, source) {
	for (let index = 0; index < N; index++) { target.offered[index] += source.offered[index]; target.picked[index] += source.picked[index]; target.removed[index] += source.removed[index]; target.commonOverRare[index] += source.commonOverRare[index]; target.rareOverCommon[index] += source.rareOverCommon[index]; }
	target.players = target.players.concat(source.players);
	target.pickEvents = target.pickEvents.concat(source.pickEvents);
	for (const key of Object.keys(source.pickedByCharacter)) target.pickedByCharacter[key] = (target.pickedByCharacter[key] || 0) + source.pickedByCharacter[key];
	for (const key of Object.keys(source.offersByCharacter)) target.offersByCharacter[key] = (target.offersByCharacter[key] || 0) + source.offersByCharacter[key];
	for (let index = 0; index < N; index++) target.pickedAtSize[index] = target.pickedAtSize[index].concat(source.pickedAtSize[index]);
	for (const key of Object.keys(source.rarePassed)) target.rarePassed[key] = (target.rarePassed[key] || 0) + source.rarePassed[key];
	for (const key of Object.keys(source.commonPassed)) target.commonPassed[key] = (target.commonPassed[key] || 0) + source.commonPassed[key];
	for (const key of Object.keys(source.stubbornPickByFavorite)) target.stubbornPickByFavorite[key] = (target.stubbornPickByFavorite[key] || 0) + source.stubbornPickByFavorite[key];
	for (const key of Object.keys(source.stubbornFinal)) target.stubbornFinal[key] = (target.stubbornFinal[key] || []).concat(source.stubbornFinal[key]);
	for (const key of Object.keys(source.characterAverage)) target.characterAverage[key] = (target.characterAverage[key] || []).concat(source.characterAverage[key]);
	for (const key of Object.keys(source.pickedByRarity)) target.pickedByRarity[key] = (target.pickedByRarity[key] || 0) + source.pickedByRarity[key];
	for (const key of Object.keys(source.removedByRarity)) {
		if (target.removedByRarity[key] == null) target.removedByRarity[key] = {};
		for (const cardIndex of Object.keys(source.removedByRarity[key])) target.removedByRarity[key][cardIndex] = (target.removedByRarity[key][cardIndex] || 0) + source.removedByRarity[key][cardIndex];
	}
}

// ---------------------------------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------------------------------
function cardName(position) { return MODEL[position].index + " (" + MODEL[position].name + ")"; }
function cardNameFromKey(key) { const position = typeof key === "number" ? key : CARD_INDEX.get(key); return position == null ? String(key) : cardName(position); }
function topN(entries, count, sortDirection) {
	return entries.slice().sort((a, b) => sortDirection * (b[1] - a[1])).slice(0, count);
}
function characterName(index) { const character = hc.findDefinition(hc.characterArray, index); return character == null ? index : character.name; }

function report(stats) {
	const lines = [];
	const em = (text) => lines.push(text);
	const playerCount = stats.players.length;
	em("# Draft simulation report");
	em("");
	em("Players: " + playerCount + ", offers each: " + ARGS.offers + ", removal every " + PARAMS.removeEvery + ".");
	em("");
	em("## 1/2. Removed the most / least, by rarity");
	for (const rarity of ["starter", "common", "rare"]) {
		const entries = [];
		for (let index = 0; index < N; index++) if (MODEL[index].rarity === rarity) entries.push([cardName(index), stats.removed[index]]);
		const formatRemoved = (entry) => entry[0] + " x" + entry[1];
		em("### " + rarity);
		em("Most removed: " + topN(entries, 8, 1).map(formatRemoved).join(", "));
		em("Least removed: " + topN(entries, 8, -1).map(formatRemoved).join(", "));
	}
	em("");
	em("## 3/4. Common/rare picked the most / least (count, and pick rate when offered)");
	for (const rarity of ["common", "rare"]) {
		const entries = [];
		for (let index = 0; index < N; index++) {
			if (MODEL[index].rarity !== rarity) continue;
			const offeredCount = stats.offered[index];
			const rate = offeredCount === 0 ? 0 : stats.picked[index] / offeredCount;
			entries.push([cardName(index), stats.picked[index], rate, offeredCount]);
		}
		const format = (entry) => entry[0] + " x" + entry[1] + " (" + (entry[2] * 100).toFixed(0) + "% of " + entry[3] + " offers)";
		em("### " + rarity);
		em("Most picked: " + topN(entries, 10, 1).map(format).join(", "));
		em("Least picked: " + topN(entries, 10, -1).map(format).join(", "));
	}
	em("");
	em("## 5. Common taken over a rare the most");
	em(topN(stats.commonOverRare.map((value, index) => [cardName(index), value]).filter((entry) => entry[1] > 0), 12, 1).map((entry) => entry[0] + " x" + entry[1]).join(", "));
	em("");
	em("## 6. Rare passed up for a common the most");
	const passed = Object.keys(stats.rarePassed).map((key) => [cardNameFromKey(key), stats.rarePassed[key]]);
	em(topN(passed, 12, 1).map((entry) => entry[0] + " x" + entry[1]).join(", "));
	em("");
	em("## 7/8. Characters' cards picked most / least often (per party-offer, so favourites are fair)");
	const characterPicks = Object.keys(stats.pickedByCharacter).map((key) => {
		const offers = stats.offersByCharacter[key] || 1;
		return [characterName(key), stats.pickedByCharacter[key], stats.pickedByCharacter[key] / offers, stats.pickedByCharacter[key] / (offers * 3)];
	});
	const formatCharacter = (entry) => entry[0] + " x" + entry[1] + " (" + (entry[3] * 100).toFixed(1) + "% of its offered slots)";
	em("Most: " + topN(characterPicks, 3, 1).map(formatCharacter).join(", "));
	em("Least: " + topN(characterPicks, 3, -1).map(formatCharacter).join(", "));
	em("");
	em("## 9/10. Each character's favourite and least favourite character (party members only)");
	const pairPick = {};
	for (const event of stats.pickEvents) {
		const party = event.party.split(",");
		for (const observer of party) {
			if (observer === event.character) continue;
			pairPick[observer] = pairPick[observer] || {};
			pairPick[observer][event.character] = (pairPick[observer][event.character] || 0) + 1;
		}
	}
	for (const observer of CHARACTER_ARRAY) {
		const table = pairPick[observer] || {};
		const entries = Object.keys(table).map((key) => [characterName(key), table[key]]);
		if (entries.length === 0) continue;
		const favorite = topN(entries, 1, 1)[0];
		const least = topN(entries, 1, -1)[0];
		em(characterName(observer) + ": favourite " + favorite[0] + " (" + favorite[1] + "), least favourite " + least[0] + " (" + least[1] + ")");
	}
	em("");
	em("## 11. Sharpest decline in pick rate as the deck grew");
	// The mean deck size at which a card is picked, against the mean across every pick. Cards the
	// player stops adding once the deck is large score well below 1; cards that keep being added late
	// score above it.
	let allSizeSum = 0, allSizeCount = 0;
	for (let index = 0; index < N; index++) { for (const size of stats.pickedAtSize[index]) { allSizeSum += size; allSizeCount += 1; } }
	const globalMeanSize = allSizeSum / Math.max(1, allSizeCount);
	const decline = [];
	for (let index = 0; index < N; index++) {
		const sizes = stats.pickedAtSize[index];
		if (sizes.length < 40) continue;
		const mean = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
		decline.push([cardName(index), (mean / globalMeanSize).toFixed(2), mean.toFixed(1), sizes.length]);
	}
	em("Global mean deck size at pick: " + globalMeanSize.toFixed(1) + ". Cards below 1.00 are added earlier and earlier:");
	em(decline.sort((a, b) => Number(a[1]) - Number(b[1])).slice(0, 12).map((entry) => entry[0] + " ratio " + entry[1] + " (mean size " + entry[2] + ", n=" + entry[3] + ")").join("\n"));
	em("");
	em("## 12. Picks that coincided with a decline in adding other new cards");
	// Per player: the pick rate in the offers AFTER a pick of card C, as a share of that player's own
	// average pick rate. A card that reliably ends a player's appetite for new cards scores far below 1.
	const byPlayer = new Map();
	for (const event of stats.pickEvents) {
		if (!byPlayer.has(event.playerId)) byPlayer.set(event.playerId, []);
		byPlayer.get(event.playerId).push(event);
	}
	const sample = new Map();
	for (const eventArray of byPlayer.values()) {
		eventArray.sort((a, b) => a.offer - b.offer);
		const playerPicks = eventArray.length;
		const playerRate = playerPicks / ARGS.offers;
		for (let index = 0; index < eventArray.length; index++) {
			const event = eventArray[index];
			const remaining = ARGS.offers - event.offer;
			if (remaining <= 0) continue;
			const after = eventArray.length - index - 1;
			const ratio = (after / remaining) / Math.max(0.0001, playerRate);
			if (!sample.has(event.position)) sample.set(event.position, { ratioSum: 0, n: 0 });
			const entry = sample.get(event.position);
			entry.ratioSum += ratio;
			entry.n += 1;
		}
	}
	const declineCards = [];
	for (const [position, entry] of sample) {
		if (entry.n < 25) continue;
		declineCards.push([cardName(position), (entry.ratioSum / entry.n).toFixed(3), entry.n]);
	}
	em("Pick rate after this card, as a share of the player's own average (1.000 = no change):");
	em(declineCards.sort((a, b) => Number(a[1]) - Number(b[1])).slice(0, 12).map((entry) => entry[0] + " " + entry[1] + " (n=" + entry[2] + ")").join("\n"));
	em("");
	em("## 13. Average average-synergy of decks including each character");
	for (const characterIndex of CHARACTER_ARRAY) {
		const values = stats.characterAverage[characterIndex] || [];
		if (values.length === 0) continue;
		const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
		em(characterName(characterIndex) + ": " + mean.toFixed(3) + " (n=" + values.length + ")");
	}
	em("");
	em("## 14. Stubborn favourites that led to the lowest average synergy");
	const favoriteRows = [];
	for (const key of Object.keys(stats.stubbornFinal)) {
		const values = stats.stubbornFinal[key];
		if (values.length < 5) continue;
		const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
		favoriteRows.push([cardNameFromKey(key), mean.toFixed(3), values.length]);
	}
	em(favoriteRows.sort((a, b) => Number(a[1]) - Number(b[1])).slice(0, 15).map((entry) => entry[0] + " " + entry[1] + " (n=" + entry[2] + ")").join("\n"));
	em("");
	em("## Appendix. Individual strength by energy cost (0..1 within the bucket)");
	for (const cost of [0, 1, 2]) {
		const entries = MODEL.filter((card) => card.cost === cost).map((card) => [cardName(CARD_INDEX.get(card.index)) + " impact/energy " + card.impactPerEnergy.toFixed(2), card.strength]);
		em("Cost " + cost + " highest strength: " + topN(entries, 8, 1).map((entry) => entry[0] + " -> " + entry[1].toFixed(2)).join(", "));
		em("Cost " + cost + " lowest strength: " + topN(entries, 8, -1).map((entry) => entry[0] + " -> " + entry[1].toFixed(2)).join(", "));
	}
	em("");
	const output = lines.join("\n");
	const dataName = ARGS.tag == null ? "DRAFT-SIM-DATA.json" : "DRAFT-SIM-DATA-" + ARGS.tag + ".json";
	fs.writeFileSync(path.join(__dirname, dataName), JSON.stringify({
		params: PARAMS,
		strength: MODEL.map((card) => ({ index: card.index, name: card.name, rarity: card.rarity, cost: card.cost, draws: card.draws, grantsEnergy: card.grantsEnergy, impactPerEnergy: Number(card.impactPerEnergy.toFixed(4)), strength: Number(card.strength.toFixed(4)) })),
		offered: stats.offered, picked: stats.picked, removed: stats.removed,
		pickedByCharacter: stats.pickedByCharacter, commonOverRare: stats.commonOverRare, rarePassed: stats.rarePassed,
		characterAverage: Object.fromEntries(Object.keys(stats.characterAverage).map((key) => [key, stats.characterAverage[key].reduce((sum, value) => sum + value, 0) / stats.characterAverage[key].length])),
		stubbornFinal: Object.fromEntries(Object.keys(stats.stubbornFinal).map((key) => [key, stats.stubbornFinal[key].reduce((sum, value) => sum + value, 0) / stats.stubbornFinal[key].length])),
		strengthByCard: MODEL.map((card) => ({ index: card.index, impact: card.impact, impactPerEnergy: card.impactPerEnergy, strength: card.strength })),
		synergyMatrix: SYNERGY.map((row) => Array.from(row, (value) => Number(value.toFixed(3)))),
	}, null, "\t"), "utf8");
	return output;
}

// ---------------------------------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------------------------------
const seedCount = ARGS.seeds == null ? 3 : ARGS.seeds;
const baseSeed = ARGS.seed == null ? 7 : ARGS.seed;
const playerCount = ARGS.players == null ? 100 : ARGS.players;
const all = newStats();
for (let index = 0; index < seedCount; index++) mergeStats(all, simulate(baseSeed + index * 101, playerCount));
const text = report(all);
if (ARGS.verbose) {
	console.log("-- cards --");
	for (const card of MODEL) console.log(card.index + " | cost " + card.cost + " | strength " + card.strength.toFixed(3) + " | draws " + card.draws + " | energy " + card.grantsEnergy + " | provides " + Array.from(card.provides).join(",") + " | wants " + Array.from(card.wants).join(","));
}
console.log(text);
