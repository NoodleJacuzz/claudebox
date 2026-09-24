//WHAT THE GAME ITSELF SAYS ABOUT AN EVENT, read from the engine that events.load() already has, so none
//of it can disagree with play. Used by server.js, and checked by selftest.js.
"use strict";
const characterNamesOf = (hc) => { const nameMap = {}; for (const character of hc.characterArray || []) nameMap[character.index] = character.name; return nameMap; };
//The engine names characters by index ("nettle"); the phone shows their names.
const withNames = (text, nameMap) => String(text || "").replace(/\b[a-z]+\b/g, (word) => nameMap[word] || word);
const tryText = (make) => { try { return String(make() || ""); } catch (error) { return ""; } };

//When a map event can be drawn, by the pool's rules (honeycomb.eligibleEventArray): weight 0 is never
//rolled, `appearsWhenBroken` waits for a Broken member, and `condition` is tested as written. Null for a
//Lust Event, which the scene queue plays instead.
function appearsFor(value, hc, nameMap) {
	if (value.lustEvent === true) return null;
	const result = { never: !value.weight, everyone: false, broken: value.appearsWhenBroken === true, characterArray: [], weight: value.weight || 0, text: "" };
	if (result.never) { result.text = "Never drawn on the map. " + (value.isRest ? "The rest node opens it." : "Something else opens it."); return result; }
	(function collect(condition) {
		if (condition == null || typeof condition !== "object") return;
		if (condition.index === "partyContains" && typeof condition.character === "string" && result.characterArray.indexOf(condition.character) < 0) result.characterArray.push(condition.character);
		for (const child of condition.conditionArray || []) collect(child);
	})(value.condition);
	const partArray = [];
	if (result.broken) partArray.push("someone in the party is Broken");
	if (value.condition != null) partArray.push(withNames(tryText(() => hc.describeCondition(value.condition)) || "a rule the desk cannot put into words", nameMap));
	result.everyone = partArray.length === 0;
	result.text = (result.everyone ? "Any party can draw it" : "Only when " + partArray.join(", and ")) + ". Weight " + value.weight +
		(value.weightWhenBroken != null ? ", or " + value.weightWhenBroken + " while someone is Broken" : "") + ".";
	return result;
}

//What an event's buttons can hand out, for the "Gives" filter. Costs (spending gold, taking damage) are
//left out: a filter for "gives gold" should not find the event that takes it.
function givesOf(value, hc) {
	const foundArray = [];
	const add = (kind) => { if (kind != null && foundArray.indexOf(kind) < 0) foundArray.push(kind); };
	const visit = (effect) => {
		if (effect == null || typeof effect !== "object") return;
		const index = effect.index;
		if (index === "gainResource" && !(typeof effect.amount === "number" && effect.amount <= 0)) add({ gold: "gold", reroll: "reroll", keys: "keys" }[effect.resource]);
		else if (index === "gainRelic" || index === "gainRandomRelic") add("relic");
		else if (index === "addCardToDeck") { const card = hc.findDefinition(hc.cardArray, effect.card); add(card != null && card.type === "curse" ? "curse" : "card"); }
		else if (index === "removeCardFromDeck" || index === "removeTargetCardFromDeck") add("removal");
		else if (index === "upgradeTargetCard") add("upgrade");
		else if (index === "deckService") add({ removeCard: "removal", upgradeCard: "upgrade" }[effect.service]);
		else if (index === "heal") add("healing");
		else if (index === "soothe") add("lust");
		else if (index === "applyStatus") add("status");
		else if (index === "startCombat") add("fight");
		else if (index === "raiseWeaknessRank") add("weakness");
		else if (index === "gainExperience") add("experience");
		for (const child of effect.effectArray || []) visit(child);
	};
	for (const page of [value].concat(value.pageArray || [], value.brokenVariantArray || [])) for (const choice of page.choiceArray || []) for (const effect of choice.effectArray || []) visit(effect);
	//A rest's buttons are the rest options' base rows, built when the party arrives.
	if (value.isRest === true) for (const option of hc.restOptionArray || []) if (option.base === true) for (const effect of option.effectArray || []) visit(effect);
	return foundArray;
}

//How many pictures an event names that do not exist. A `{leader}` picture counts once for each girl.
function missingPictureCount(model, folderArray, findImage) {
	let count = 0;
	for (const beat of model.beatArray) {
		if (!beat.imagePath) continue;
		const pathArray = /\{[a-z]+\}/.test(beat.imagePath) ? folderArray.map((folder) => beat.imagePath.replace(/\{[a-z]+\}/g, folder)) : [beat.imagePath];
		for (const one of pathArray) if (findImage(one) == null) count++;
	}
	return count;
}

//What each button does, in the game's own words (the same describeEffectArray the event window uses when
//no sentence was typed), beside the sentence that was typed. `strayNumberArray` lists numbers the typed
//sentence names that the effects never mention: that is how a sentence goes out of date.
function buttonFacts(value, hc) {
	const numbersIn = (text) => String(text || "").match(/\d+(?:\.\d+)?/g) || [];
	return [value].concat(value.pageArray || []).map((page) => (page.choiceArray || []).map((choice) => {
		const effectText = tryText(() => hc.describeEffectArray(choice.effectArray || []));
		const typed = typeof choice.previewText === "string" ? choice.previewText : "";
		const known = numbersIn(effectText);
		return { effectText: effectText, strayNumberArray: effectText && typed ? numbersIn(typed).filter((number) => known.indexOf(number) < 0) : [] };
	}));
}

//A rest's menu is built when the party arrives (honeycomb.rest.choiceArray), from restOptionArray: the
//base rows always, the others once a skill tree node names them. This lists every row as the game would
//word it, and which nodes unlock the rest.
function restMenu(hc, nameMap) {
	return (hc.restOptionArray || []).map((option) => {
		const unlockArray = [];
		for (const character of hc.characterArray || []) for (const node of (character.progressionTree && character.progressionTree.nodeArray) || []) {
			if (node.restOption === option.index) unlockArray.push(character.name + "'s " + (node.name || node.index));
		}
		return {
			text: String(option.text || option.name || option.index),
			previewText: tryText(() => (typeof option.previewText === "function" ? option.previewText() : option.previewText)),
			effectText: tryText(() => hc.describeEffectArray(option.effectArray || [])),
			base: option.base === true, brokenOnly: option.brokenOnly === true, unlockArray: unlockArray,
		};
	}).concat(leaveRow(hc));
}
//The row that closes a rest, in the game's words, taken from the menu the game itself builds.
function leaveRow(hc) {
	let row = null;
	try { row = hc.rest.choiceArray().filter((one) => one.endsRest === true)[0] || null; } catch (error) { row = null; }
	return row == null ? [] : [{ text: String(row.text), previewText: String(row.previewText || ""), effectText: "", base: true, brokenOnly: false, unlockArray: [] }];
}


module.exports = { characterNamesOf, withNames, appearsFor, givesOf, missingPictureCount, buttonFacts, restMenu };
