/**
 * Plays one whole Honeycomb run, from the first map node to the last boss, and returns a record of it.
 * Not part of the game. This is the heart of All the Crunch (balance_tests/BRIEF.md Step 4).
 *
 * WHAT IS REAL. Everything the game does, this calls: the map and its movement, combat, the victory
 * screen's payout and card offers, events and the rest site (an event), shops, treasure, descending and
 * the run-clear payouts. The engine is loaded with `drivenOverlays` (lib/engine.js), which runs each
 * overlay's own build against a fake element, so the screen does what it does for a player. The only rule
 * this file states itself is `moreToCome`, the one-line test the "region cleared" screen uses to choose
 * between descending and finishing, because that test lives inside the screen's render. It reads the same
 * tuning value the screen reads.
 *
 * WHAT IS CHOSEN. Every decision goes through `policy.choose(kind, context, options)` (lib/policies.js):
 * which card to take, what to buy, what to remove, which event option, how to answer a question. The
 * simulation logs each one with all the options and the pick, so the learning step (BRIEF Step 5) can read
 * them afterwards. Which map node to walk to is a plain rule below, not a learned one.
 *
 * The bot's own random numbers come from its own generator, never the game's streams, so the bot cannot
 * disturb the dice the game rolls.
 */
const combatPlayer = require("./combat-player");

//Every knob this file has (BRIEF rule 6). Printed at the top of every All the Crunch report (INFERENCES I3).
const PARAMS = {
	//How a skilled player ranks the stops on the way to the boss. The score of a stop is the base value
	//plus, for the listed types, a term that depends on how hurt the party is (missing = 1 - health share)
	//and how much gold it holds. A path's value is the sum over its stops; the walk takes the first step
	//of the best path.
	pathWeights: {
		combat: { base: 1.0 },
		elite: { base: 1.5, whenHealthy: 2.5, healthyAt: 0.7, whenHurt: -4 },   //rewards a strong party; risks a hurt one
		event: { base: 0.6 },
		treasure: { base: 2.0 },
		rest: { base: 0.3, perMissingHealth: 8 },                                 //worth more the more hurt the party is
		shop: { base: 0.3, whenRichAt: 90, whenRich: 2.5 },                       //worth a visit with gold to spend
		boss: { base: 0 },
	},
	//A backstop on decisions in one run, so a bug cannot loop forever.
	stepsPerRunMaximum: 3000,
	//A backstop on events' pages and rest actions.
	stepsPerEventMaximum: 40,
	//A backstop on purchases in one shop visit.
	purchasesPerShopMaximum: 12,
	//Where in a region a stop sits, for keying decisions: the region's rows are split into this many bands.
	stageBandCount: 3,
};

//A small seeded generator (mulberry32), separate from the game's own.
function makeRandom(seed) {
	let state = (seed >>> 0) || 1;
	return function () {
		state = (state + 0x6D2B79F5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function healthShare(hc) {
	const party = hc.state.run.partyArray;
	let now = 0, top = 0;
	for (const member of party) { now += Math.max(0, member.health); top += member.maxHealth; }
	return top === 0 ? 1 : now / top;
}

//Which band of the region the party is in, and which region of the run: the key decisions are learned under.
function stageOf(hc) {
	const run = hc.state.run;
	const map = run.map;
	let rowIndex = 0;
	if (map != null && map.currentNodeId != null) {
		for (let row = 0; row < map.rowArray.length; row++) {
			if (map.rowArray[row].some((node) => node.id === map.currentNodeId)) { rowIndex = row; break; }
		}
	}
	const rows = map == null ? 1 : map.rowArray.length;
	const band = Math.min(PARAMS.stageBandCount - 1, Math.floor(rowIndex * PARAMS.stageBandCount / rows));
	return "R" + (run.regionsCleared || 0) + "." + band;
}

//The value of a stop for a party in this shape.
function stopValue(hc, node) {
	const weight = PARAMS.pathWeights[node.typeIndex] || { base: 0 };
	const health = healthShare(hc);
	const gold = hc.getResource("gold");
	let value = weight.base;
	if (weight.whenHealthy != null && health >= weight.healthyAt) value += weight.whenHealthy;
	if (weight.whenHurt != null && health < weight.healthyAt) value += weight.whenHurt;
	if (weight.perMissingHealth != null) value += weight.perMissingHealth * (1 - health);
	if (weight.whenRichAt != null && gold >= weight.whenRichAt) value += weight.whenRich;
	return value;
}

//The available node whose best path to the boss is worth most. The map is a forward-only graph, so the
//best path from a node is its own value plus the best of its onward edges.
function pickNode(hc, availableIdArray) {
	const memo = {};
	const best = (id) => {
		if (memo[id] != null) return memo[id];
		const node = hc.map.findNode(id);
		if (node == null) return (memo[id] = 0);
		let onward = 0;
		for (const next of node.edgeArray || []) onward = Math.max(onward, best(next));
		return (memo[id] = stopValue(hc, node) + onward);
	};
	let chosen = availableIdArray[0], chosenValue = -Infinity;
	for (const id of availableIdArray) {
		const value = best(id);
		if (value > chosenValue) { chosen = id; chosenValue = value; }
	}
	return chosen;
}

function deckCardIndexOf(hc, instanceId) {
	const found = hc.state.run.deckArray.find((card) => card.instanceId === instanceId);
	return found == null ? null : found.cardIndex;
}

//Whether an event option can be taken now: the two gates the event screen draws (its own condition, and
//whether the cost is payable).
function choiceAvailable(hc, choice) {
	const context = hc.newEffectContext({});
	const conditionMet = choice.condition == null || hc.testCondition(choice.condition, context);
	const affordable = choice.costArray == null || hc.canAfford(choice.costArray);
	return conditionMet && affordable;
}

//Plays a run. `settings`:
//  hc            an engine loaded with { drivenOverlays: true }, whose `state` already holds a profile
//  party         [{characterIndex, outfitIndex}] to field
//  seed          the run's seed (the game's) -- the bot's own generator is seeded from it too
//  policy        lib/policies.js
//  trace         true prints one line per node
//Returns the record described in BRIEF Step 4.
function playRun(settings) {
	const hc = settings.hc;
	const policy = settings.policy;
	const random = makeRandom(settings.seed * 7919 + 17);
	const trace = settings.trace === true;
	const say = (text) => { if (trace) console.log(text); };

	hc.parkedChoice = null;
	hc.requestedFight = null;
	hc.overlay.closeAll();
	//The profile is read live wherever it is needed: a dry run or a rewound question replaces hc.state, so a
	//reference kept from here would point at an abandoned copy (this once recorded every won run as lost).
	const winsBefore = hc.state.profile.runsWon;
	const experienceBefore = {};
	for (const member of settings.party) experienceBefore[member.characterIndex] = hc.progression.personalExperience(member.characterIndex);

	hc.newRun(settings.party, settings.seed, settings.runOptions);
	if (hc.state.run.map == null) hc.map.generateRegion();
	//A test hook: lets a check alter the run before it is played (for instance to prove a win is recorded as a win).
	if (typeof settings.afterNewRun === "function") settings.afterNewRun(hc);
	const startingDeck = hc.state.run.deckArray.length;

	const record = {
		seed: settings.seed, party: settings.party.map((member) => member.characterIndex), policy: policy.name,
		nodeArray: [], fightArray: [], decisionArray: [], goldArray: [], bossDeckArray: [],
		outcome: null, endedAt: null, fightsWon: 0, cardsTaken: 0, cardsRemoved: 0, startingDeck,
		route: null, eventSeenArray: [], relicHeldArray: [], relicShelfArray: [],
	};

	const ctx = () => ({ stage: stageOf(hc), health: healthShare(hc), gold: hc.getResource("gold"), random, hc, deckSize: hc.state.run.deckArray.length });
	//Asks the policy and logs the decision. `optionArray` is [{key, ...}]; the policy returns an index into
	//it, or -1 for "none of them" (skip, decline, leave), which is only legal when `allowNone` is set.
	const decide = (kind, optionArray, allowNone) => {
		const context = ctx();
		let pick = policy.choose(kind, context, optionArray, allowNone);
		if (pick == null || pick >= optionArray.length || (pick < 0 && !allowNone)) pick = optionArray.length > 0 && !allowNone ? 0 : -1;
		record.decisionArray.push({
			kind, stage: context.stage, deckSize: context.deckSize, health: Math.round(context.health * 100) / 100,
			wonSoFar: record.fightsWon, allowNone: allowNone === true,
			optionArray: optionArray.map((option) => option.key), taken: pick < 0 ? null : optionArray[pick].key, none: pick < 0,
		});
		return pick;
	};

	//Answers a question a card or event parked, then lets the caller carry on.
	const answerParked = () => {
		const parked = hc.parkedChoice;
		hc.parkedChoice = null;
		const request = parked.request;
		const kind = hc.choiceKind(request);
		const entryArray = kind == null ? [] : kind.gather(request);
		const minimum = request.minimum == null ? 0 : request.minimum;
		const maximum = request.maximum == null ? 1 : request.maximum;
		const optionArray = entryArray.map((entry) => ({
			key: request.index + ":" + (kind.targetKind === "card" ? (deckCardIndexOf(hc, entry.index) || (entry.card && entry.card.index) || entry.index) : entry.index),
			entry, prompt: request.prompt,
		}));
		const chosen = [];
		const remaining = optionArray.slice();
		const wanted = Math.max(minimum, 1);
		while (chosen.length < Math.min(maximum, wanted) && remaining.length > 0) {
			const pick = decide("question", remaining, chosen.length >= minimum);
			if (pick < 0) break;
			chosen.push(remaining[pick].entry.index);
			remaining.splice(pick, 1);
		}
		parked.onAnswer({ chosenArray: chosen });
	};

	const finishFight = () => {
		const fight = hc.requestedFight;
		hc.requestedFight = null;
		const partyBefore = hc.state.run.partyArray.map((member) => member.health);
		hc.combat.begin(fight.encounterIndex, {
			mapNodeId: fight.mapNodeId, continuation: fight.continuation, rewardArray: fight.rewardArray,
			victoryConditionArray: fight.victoryConditionArray, defeatConditionArray: fight.defeatConditionArray,
		});
		const result = combatPlayer.playCombat(hc, settings.combatTrace === true);
		const party = hc.state.run.partyArray;
		const fightRecord = {
			encounter: fight.encounterIndex, nodeId: fight.mapNodeId, won: result.won, turns: result.turns, stage: stageOf(hc),
			healthBefore: partyBefore, healthAfter: party.map((member) => member.health),
			lustAfter: party.map((member) => member.lust || 0), broken: result.broken,
			boss: (hc.findDefinition(hc.encounterArray, fight.encounterIndex) || {}).tier === "boss",
		};
		record.fightArray.push(fightRecord);
		say("    fight " + fight.encounterIndex + ": " + (result.won ? "won" : "LOST") + " in " + result.turns + " turns, health " +
			fightRecord.healthBefore.join("/") + " -> " + fightRecord.healthAfter.join("/"));
		if (result.won) {
			record.fightsWon += 1;
			hc.overlay.open("victory", {});
			const reward = hc.victoryOverlay.pendingReward;
			const offerArray = reward.cardChoiceArray.map((offer) => ({ key: offer.cardIndex, offer }));
			if (offerArray.length > 0) {
				const pick = decide("cardOffer", offerArray, true);
				if (pick < 0) hc.victoryOverlay.skip();
				else { hc.victoryOverlay.takeCard(reward.cardChoiceArray.indexOf(offerArray[pick].offer)); record.cardsTaken += 1; }
			} else hc.victoryOverlay.skip();
		} else {
			hc.overlay.open("defeat", {});
			hc.defeatOverlay.carryOn();
		}
	};

	const stepEvent = () => {
		for (let guard = 0; guard < PARAMS.stepsPerEventMaximum && hc.state.run != null; guard++) {
			if (hc.requestedFight != null || hc.overlay.openArray.every((open) => open.index !== "event")) return;
			if (hc.parkedChoice != null) { answerParked(); continue; }
			const event = hc.eventVariantFor(hc.findDefinition(hc.eventArray, hc.eventOverlay.eventIndex));
			if (record.eventSeenArray.indexOf(event.index) < 0) record.eventSeenArray.push(event.index);
			if (hc.eventOverlay.resultText != null) { hc.eventOverlay.finish(); return; }
			const choiceArray = hc.eventOverlay.currentChoiceArray(event);
			const optionArray = [];
			choiceArray.forEach((choice, index) => {
				if (choiceAvailable(hc, choice)) optionArray.push({ key: event.index + "#" + (choice.text || index), choiceIndex: index, choice });
			});
			if (optionArray.length === 0) { hc.eventOverlay.finish(); return; }
			const pick = decide(event.isRest === true ? "restChoice" : "eventChoice", optionArray, false);
			const fromPage = hc.eventOverlay.pageIndex == null ? null : String(hc.eventOverlay.pageIndex);
			hc.eventOverlay.choose(event.index, optionArray[pick].choiceIndex, null, fromPage);
		}
		//Out of steps: leave, so the run can go on.
		if (hc.state.run != null && hc.overlay.openArray.some((open) => open.index === "event")) hc.eventOverlay.finish();
	};

	const stepShop = () => {
		const top = hc.overlay.openArray[hc.overlay.openArray.length - 1];
		const nodeId = top.params.nodeId;
		for (let guard = 0; guard < PARAMS.purchasesPerShopMaximum; guard++) {
			const stock = hc.shop.stockFor(nodeId);
			if (stock == null) break;
			//Removal first (BRIEF Step 5: the thin-deck bot "pays for removal at shops before anything else").
			if (stock.removalCost != null && hc.canAfford({ gold: stock.removalCost }) && hc.state.run.deckArray.length > 1) {
				const seen = {};
				const optionArray = [];
				for (const card of hc.state.run.deckArray) {
					if (seen[card.cardIndex]) continue;
					seen[card.cardIndex] = true;
					optionArray.push({ key: card.cardIndex, instanceId: card.instanceId, price: stock.removalCost });
				}
				const pick = decide("shopRemove", optionArray, true);
				if (pick >= 0) {
					const before = hc.state.run.deckArray.length;
					hc.shop.beginRemoval(nodeId, [{ chosenArray: [optionArray[pick].instanceId] }]);
					if (hc.state.run.deckArray.length < before) { record.cardsRemoved += 1; continue; }
				}
			}
			const cardOptionArray = [];
			(stock.cardArray || []).forEach((slot, slotIndex) => {
				if (slot.sold !== true && hc.canAfford({ gold: slot.price })) cardOptionArray.push({ key: slot.index, slotIndex, price: slot.price, what: "card" });
			});
			const relicOptionArray = [];
			(stock.relicArray || []).forEach((slot, slotIndex) => {
				if (slot.sold !== true && hc.canAfford({ gold: slot.price })) relicOptionArray.push({ key: slot.index, slotIndex, price: slot.price, what: "relic" });
			});
			for (const slot of stock.relicArray || []) if (record.relicShelfArray.indexOf(slot.index) < 0) record.relicShelfArray.push(slot.index);
			const optionArray = cardOptionArray.concat(relicOptionArray);
			if (optionArray.length === 0) break;
			const pick = decide("shopBuy", optionArray, true);
			if (pick < 0) break;
			const option = optionArray[pick];
			if (option.what === "card") { hc.shop.buyCard(nodeId, option.slotIndex); record.cardsTaken += 1; }
			else hc.shop.buyRelic(nodeId, option.slotIndex);
		}
		hc.shop.leave();
	};

	const stepMap = () => {
		const availableArray = hc.map.availableNodeIdArray();
		if (availableArray.length === 0) return false;
		const id = pickNode(hc, availableArray);
		const node = hc.map.findNode(id);
		record.nodeArray.push({ id, type: node.typeIndex, stage: stageOf(hc), health: Math.round(healthShare(hc) * 100) / 100, gold: hc.getResource("gold") });
		record.goldArray.push(hc.getResource("gold"));
		say("  " + node.typeIndex.padEnd(9) + id + "  (" + stageOf(hc) + ", health " + Math.round(healthShare(hc) * 100) + "%, gold " + hc.getResource("gold") + ", deck " + hc.state.run.deckArray.length + ")");
		if (node.typeIndex === "boss") record.bossDeckArray.push(hc.state.run.deckArray.map((card) => card.cardIndex));
		hc.map.enterNode(id);
		return true;
	};

	let steps = 0;
	while (hc.state.run != null && steps++ < PARAMS.stepsPerRunMaximum) {
		for (const relic of hc.state.run.relicArray) if (record.relicHeldArray.indexOf(relic.index) < 0) record.relicHeldArray.push(relic.index);
		if (hc.requestedFight != null) { finishFight(); continue; }
		const top = hc.overlay.openArray[hc.overlay.openArray.length - 1];
		if (top == null) {
			if (!stepMap()) { record.outcome = "stuck"; break; }
			continue;
		}
		if (top.index === "event") { stepEvent(); continue; }
		if (top.index === "shop") { stepShop(); continue; }
		if (top.index === "treasure") { hc.overlay.close("treasure"); hc.map.returnToMap(); continue; }
		if (top.index === "regionCleared") {
			hc.overlay.close("regionCleared");
			const moreToCome = (hc.state.run.regionsCleared || 0) + 1 < hc.tuning.map.route.regionsPerRun;
			say("  REGION CLEARED (" + (moreToCome ? "descending" : "run won") + ")");
			if (moreToCome) { hc.descendRegion(); record.route = hc.state.run.routeRegionIndex == null ? record.route : hc.state.run.routeRegionIndex; }
			else hc.finishRun(true);
			continue;
		}
		//Anything else is an overlay the simulation does not know; closing it keeps the run moving.
		record.unknownOverlayArray = (record.unknownOverlayArray || []).concat(top.index);
		hc.overlay.close(top.index);
	}
	if (hc.state.run != null) { record.outcome = record.outcome || "stepLimit"; record.endedAt = "unfinished"; hc.finishRun(false); }
	else record.outcome = record.outcome || (hc.state.profile.runsWon > winsBefore ? "victory" : "defeat");

	record.experience = {};
	for (const member of settings.party) record.experience[member.characterIndex] = hc.progression.personalExperience(member.characterIndex) - experienceBefore[member.characterIndex];
	const lastFight = record.fightArray[record.fightArray.length - 1];
	record.endedAt = record.endedAt || (lastFight == null ? null : lastFight.encounter);
	return record;
}

module.exports = { PARAMS, playRun, makeRandom, healthShare, stageOf, deckCardIndexOf };
