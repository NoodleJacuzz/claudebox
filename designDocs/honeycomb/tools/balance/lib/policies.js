/**
 * How a bot decides things outside a fight. Not part of the game (balance_tests/BRIEF.md Step 5).
 *
 * A policy is {name, choose(kind, context, optionArray, allowNone)} and returns an index into
 * `optionArray`, or -1 for "none of them" when `allowNone` is set. The run player (lib/run-player.js)
 * asks it for every card offer, purchase, removal, event option and question, and logs the answer.
 *
 * There is no table of which cards go together. The learned policy reads what the game itself produced.
 */

//Every knob this file has (BRIEF rule 6).
const PARAMS = {
	//The share of decisions a learned bot still makes at random, so a value that was unlucky in the first
	//batch can recover (BRIEF Step 5).
	exploreRate: 0.15,
	//An option seen fewer times than this has no trusted value and is decided at random.
	minimumSamples: 12,
	//The outcome a decision is judged by: how many more fights the run won afterwards, plus this many for
	//finishing the run (INFERENCES I6).
	runFinishBonus: 6,
	//A card whose rarity is this counts as a starter for the thin-deck bot's removals.
	starterRarity: "starter",
};

function pickRandom(context, count) { return Math.floor(context.random() * count); }

//Decides everything at random, including whether to take nothing. Used for the explore batch, which
//is what makes the comparison "offered the same thing, chose differently" fair.
const randomPolicy = {
	name: "explore",
	choose(kind, context, optionArray, allowNone) {
		const slots = optionArray.length + (allowNone ? 1 : 0);
		if (slots === 0) return -1;
		const pick = pickRandom(context, slots);
		return pick >= optionArray.length ? -1 : pick;
	},
};

function isRemovalPrompt(option) { return option.prompt != null && /leave|remove|purge|discard|burn|banish/i.test(option.prompt); }

function cardRarity(context, cardIndex) {
	const card = context.hc.findDefinition(context.hc.cardArray, cardIndex);
	return card == null ? null : card.rarity;
}

//Removes cards at every chance, takes none, and upgrades otherwise (BRIEF Step 5, the thin-deck bot).
const thinDeckPolicy = {
	name: "thin deck",
	choose(kind, context, optionArray, allowNone) {
		if (kind === "cardOffer" || kind === "shopBuy") return -1;
		if (kind === "shopRemove") {
			//A starter first, since those are the plainest cards in the deck.
			const starter = optionArray.findIndex((option) => cardRarity(context, option.key) === PARAMS.starterRarity);
			return starter >= 0 ? starter : 0;
		}
		if (kind === "restChoice" || kind === "eventChoice") {
			const text = (option) => String(option.key).toLowerCase();
			const wanted = optionArray.findIndex((option) => /leave a card|remove|purge/.test(text(option)));
			if (wanted >= 0) return wanted;
			const upgrade = optionArray.findIndex((option) => /sharpen|upgrade|hone/.test(text(option)));
			if (upgrade >= 0) return upgrade;
			const heal = optionArray.findIndex((option) => /sleep|rest|heal/.test(text(option)));
			return heal >= 0 ? heal : 0;
		}
		if (kind === "question") {
			if (optionArray.length > 0 && isRemovalPrompt(optionArray[0])) {
				const starter = optionArray.findIndex((option) => cardRarity(context, option.key.split(":")[1]) === PARAMS.starterRarity);
				return starter >= 0 ? starter : 0;
			}
			return allowNone ? -1 : 0;
		}
		return allowNone ? -1 : 0;
	},
};

//Takes a card at every offer and never removes one.
const takeEverythingPolicy = {
	name: "take everything",
	choose(kind, context, optionArray, allowNone) {
		if (kind === "cardOffer" || kind === "shopBuy") return optionArray.length > 0 ? pickRandom(context, optionArray.length) : -1;
		if (kind === "shopRemove") return -1;
		if (kind === "restChoice" || kind === "eventChoice") {
			const text = (option) => String(option.key).toLowerCase();
			const wanted = optionArray.findIndex((option) => /sleep|rest|heal/.test(text(option)));
			return wanted >= 0 ? wanted : pickRandom(context, optionArray.length);
		}
		if (kind === "question") {
			if (optionArray.length > 0 && isRemovalPrompt(optionArray[0])) return allowNone ? -1 : 0;
			return pickRandom(context, optionArray.length);
		}
		return allowNone ? -1 : 0;
	},
};

module.exports = { PARAMS, randomPolicy, thinDeckPolicy, takeEverythingPolicy, isRemovalPrompt };
