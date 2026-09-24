//===================================================================================================
//HONEYCOMB CATACOMBS -- global progression: experience and the discovery ledger
//===================================================================================================
//Experience here is NOT a per-character level. It is one pool, shared by the whole cast, that builds
//across every run the player ever makes. Winning fights pays into it; seeing something for the FIRST
//time pays considerably more.
//
//That first-time bonus is the point. A player who keeps meeting the same three enemies is earning
//less than one who pushes into a region they have never reached, so exploring is worth doing even on
//a run that is clearly going to end badly. It is also the thing that most obviously differentiates
//this from a roguelike where a lost run leaves nothing behind.
//
//THE DISCOVERY LEDGER makes the first-time bonus cheap to pay. `state.profile.discoveryArray` holds,
//per KIND, the list of indices this profile has ever seen. Asking "is this new" is a lookup; there is
//no per-run bookkeeping and nothing to reconcile. The ledger is profile-scope, so a run that ends in
//defeat still leaves its discoveries behind.
//
//WHEN A DISCOVERY COUNTS is decided per kind, by `discoveredOn`:
//  "meet"  the first time the thing is SEEN pays the first-time bonus. Enemies work this way --
//          summoned ones included -- because meeting something new is the point, whether or not the
//          fight is won. The bonus can only ever be paid once per profile, so there is nothing to farm.
//  "earn"  the first time it is EARNED pays it: an event by being resolved rather than opened, a
//          region by being cleared. Opening something and walking away pays nothing.
//Repeat earnings (baseExperience) are always paid on EARNING -- a defeated enemy, a won battle -- never
//on meeting, so the farmable part of the pool still has to be fought for.
//
//THE COMPENDIUM is where this ledger will be read in full. Every kind that feeds the shared pool is a
//row in honeycomb.discoveryKindArray, which is exactly the list that screen will walk.
window.honeycomb = window.honeycomb || {};

honeycomb.discovery = {};

//---------------------------------------------------------------------------------------------------
//Discovery kinds
//---------------------------------------------------------------------------------------------------
//What may be discovered, what it pays, and where its name comes from. A new kind of discovery is a
//table entry plus one call at the moment it is earned.
//
//  baseExperience   paid every time this thing is EARNED again
//  firstExperience  paid INSTEAD of baseExperience the first time, per profile
//  discoveredOn     "meet" or "earn"; see above
//  nameFor(index)   how the ledger screen and the reward line print it
//  allIndexArray()  every index that could ever be found, so the ledger can read "7 / 23"
honeycomb.discoveryKindArray = [
	{
		index: "enemy",
		name: "Enemies encountered",
		baseExperience: 2,
		firstExperience: 15,
		discoveredOn: "meet",
		nameFor: function (enemyIndex) {
			var definition = honeycomb.findDefinition(honeycomb.enemyArray, enemyIndex);
			return definition == null ? enemyIndex : definition.name;
		},
		allIndexArray: function () { return honeycomb.discovery.indexArrayOf(honeycomb.enemyArray); },
	},
	{
		index: "encounter",
		name: "Battles won",
		baseExperience: 5,
		firstExperience: 20,
		discoveredOn: "earn",
		nameFor: function (encounterIndex) {
			var definition = honeycomb.findDefinition(honeycomb.encounterArray, encounterIndex);
			return definition == null ? encounterIndex : (definition.name == null ? encounterIndex : definition.name);
		},
		allIndexArray: function () { return honeycomb.discovery.indexArrayOf(honeycomb.encounterArray); },
	},
	{
		//Events that count as discoveries at all. An event opts out with `discovery: false` -- the
		//campfire does, since resting is not finding anything.
		index: "event",
		name: "Events resolved",
		baseExperience: 3,
		firstExperience: 25,
		discoveredOn: "earn",
		nameFor: function (eventIndex) {
			var definition = honeycomb.findDefinition(honeycomb.eventArray, eventIndex);
			return definition == null ? eventIndex : definition.name;
		},
		allIndexArray: function () {
			var result = [];
			var eventArray = honeycomb.eventArray == null ? [] : honeycomb.eventArray;
			for (var scanIndex = 0; scanIndex < eventArray.length; scanIndex++) {
				if (eventArray[scanIndex].discovery === false) continue;
				result.push(eventArray[scanIndex].index);
			}
			return result;
		},
	},
	{
		//THE ROAD NOT TRAVELLED. A major branch inside an event is worth finding on its own, so a player
		//who always takes the same answer is leaving experience on the table. Only choices marked
		//`discovery: true` count: most answers are not a road, and paying for all of them would pay for
		//clicking. Keyed "eventIndex/choiceIndex", where the choice's own `index` is used if it has one.
		index: "eventPath",
		name: "Paths taken",
		baseExperience: 0,
		firstExperience: 15,
		discoveredOn: "earn",
		nameFor: function (pathKey) {
			var found = honeycomb.discovery.findEventPath(pathKey);
			if (found == null) return pathKey;
			return found.event.name + ": " + found.choice.text;
		},
		allIndexArray: function () {
			var result = [];
			var eventArray = honeycomb.eventArray == null ? [] : honeycomb.eventArray;
			for (var eventIndex = 0; eventIndex < eventArray.length; eventIndex++) {
				var event = eventArray[eventIndex];
				var choiceArray = honeycomb.discovery.allChoiceArray(event);
				for (var choiceIndex = 0; choiceIndex < choiceArray.length; choiceIndex++) {
					if (choiceArray[choiceIndex].choice.discovery != true) continue;
					result.push(honeycomb.discovery.eventPathKey(event, choiceArray[choiceIndex].choice, choiceArray[choiceIndex].position));
				}
			}
			return result;
		},
	},
	{
		index: "relic",
		name: "Relics found",
		baseExperience: 0,
		firstExperience: 20,
		discoveredOn: "earn",
		nameFor: function (relicIndex) {
			var definition = honeycomb.findDefinition(honeycomb.relicArray, relicIndex);
			return definition == null ? relicIndex : definition.name;
		},
		allIndexArray: function () { return honeycomb.discovery.indexArrayOf(honeycomb.relicArray); },
	},
	{
		//A card counts the first time it is IN A DECK, however it got there -- a reward, a shop, or an
		//outfit or piece of equipment that puts it into a starting pool. That last route is deliberate:
		//trying a costume that changes the deck is exactly the exploration this pool pays for.
		index: "card",
		name: "Cards held",
		baseExperience: 0,
		firstExperience: 10,
		discoveredOn: "meet",
		nameFor: function (cardIndex) {
			var definition = honeycomb.findDefinition(honeycomb.cardArray, cardIndex);
			return definition == null ? cardIndex : definition.name;
		},
		allIndexArray: function () {
			//Statuses and curses are things done TO a deck, not cards a player collects -- and an enemy's
			//moves share the card table without ever being the player's to hold.
			var result = [];
			for (var scanIndex = 0; scanIndex < honeycomb.cardArray.length; scanIndex++) {
				var card = honeycomb.cardArray[scanIndex];
				if (honeycomb.cardHasType(card, "curse")) continue;
				if (card.enemyIndex != null) continue;
				result.push(card.index);
			}
			return result;
		},
	},
	{
		//Keyed "characterIndex/outfitIndex": outfit indices repeat between characters ("default").
		index: "outfit",
		name: "Outfits unlocked",
		baseExperience: 0,
		firstExperience: 30,
		discoveredOn: "earn",
		nameFor: function (outfitKey) {
			var partArray = String(outfitKey).split("/");
			var character = honeycomb.findDefinition(honeycomb.characterArray, partArray[0]);
			var outfit = honeycomb.findOutfit(character, partArray[1]);
			return character == null || outfit == null ? outfitKey : character.name + ": " + outfit.name;
		},
		allIndexArray: function () {
			//Only what can actually be unlocked. An outfit available from the first run is not a find.
			var result = [];
			for (var characterIndex = 0; characterIndex < honeycomb.characterArray.length; characterIndex++) {
				var character = honeycomb.characterArray[characterIndex];
				var outfitArray = character.outfitArray == null ? [] : character.outfitArray;
				for (var outfitIndex = 0; outfitIndex < outfitArray.length; outfitIndex++) {
					if (outfitArray[outfitIndex].unlockedFromStart == true) continue;
					result.push(character.index + "/" + outfitArray[outfitIndex].index);
				}
			}
			return result;
		},
	},
	{
		index: "equipment",
		name: "Equipment found",
		baseExperience: 0,
		firstExperience: 30,
		discoveredOn: "earn",
		nameFor: function (equipmentIndex) {
			var definition = honeycomb.findDefinition(honeycomb.equipmentArray, equipmentIndex);
			return definition == null ? equipmentIndex : definition.name;
		},
		allIndexArray: function () {
			var result = [];
			for (var scanIndex = 0; scanIndex < honeycomb.equipmentArray.length; scanIndex++) {
				if (honeycomb.equipmentArray[scanIndex].unlockedFromStart == true) continue;
				result.push(honeycomb.equipmentArray[scanIndex].index);
			}
			return result;
		},
	},
	{
		//A combatant's moves, seen once telegraphed. Pays nothing and is NOTED rather than recorded --
		//see discovery.note -- because what it drives is not a reward: an enemy's list of moves shows
		//the ones seen and keeps the rest face down. Keyed "whoIndex/cardIndex": the enemy (or
		//character) and the card it played (moves are cards).
		index: "intent",
		name: "Enemy moves seen",
		baseExperience: 0,
		firstExperience: 0,
		discoveredOn: "meet",
		nameFor: function (intentKey) {
			var partArray = String(intentKey).split("/");
			var who = honeycomb.findDefinition(honeycomb.enemyArray, partArray[0]) || honeycomb.findDefinition(honeycomb.characterArray, partArray[0]);
			var card = honeycomb.findDefinition(honeycomb.cardArray, partArray[1]);
			return who == null || card == null ? intentKey : who.name + ": " + card.name;
		},
		allIndexArray: function () {
			var result = [];
			for (var enemyIndex = 0; enemyIndex < honeycomb.enemyArray.length; enemyIndex++) {
				var enemy = honeycomb.enemyArray[enemyIndex];
				var moveArray = enemy.moveArray == null ? [] : enemy.moveArray;
				for (var moveIndex = 0; moveIndex < moveArray.length; moveIndex++) {
					result.push(enemy.index + "/" + moveArray[moveIndex].card);
				}
			}
			return result;
		},
	},
	{
		index: "region",
		name: "Regions cleared",
		baseExperience: 20,
		firstExperience: 60,
		discoveredOn: "earn",
		nameFor: function (regionIndex) {
			var definition = honeycomb.findDefinition(honeycomb.regionArray, regionIndex);
			return definition == null ? regionIndex : definition.name;
		},
		//>>> LANE E7 | route | discovery total >>>
		//THE LEDGER COUNTS REACHABLE REGIONS, NOT TABLE ROWS. regionArray holds routes a single run
		//never all visits, and one of them is secret; counting it would show a total nobody can fill.
		allIndexArray: function () { return honeycomb.map.countedRegionArray(); },
		//<<< LANE E7 | route | discovery total <<<
	},
];

honeycomb.discovery.indexArrayOf = function (tableArray) {
	var result = [];
	var sourceArray = tableArray == null ? [] : tableArray;
	for (var scanIndex = 0; scanIndex < sourceArray.length; scanIndex++) result.push(sourceArray[scanIndex].index);
	return result;
};

//Every choice an event offers, on its first page and on any page after it, with where it sits.
honeycomb.discovery.allChoiceArray = function (event) {
	var result = [];
	if (event == null) return result;
	var choiceArray = event.choiceArray == null ? [] : event.choiceArray;
	for (var choiceIndex = 0; choiceIndex < choiceArray.length; choiceIndex++) {
		result.push({ choice: choiceArray[choiceIndex], position: String(choiceIndex) });
	}
	var pageArray = event.pageArray == null ? [] : event.pageArray;
	for (var pageIndex = 0; pageIndex < pageArray.length; pageIndex++) {
		var pageChoiceArray = pageArray[pageIndex].choiceArray == null ? [] : pageArray[pageIndex].choiceArray;
		for (var pageChoiceIndex = 0; pageChoiceIndex < pageChoiceArray.length; pageChoiceIndex++) {
			result.push({ choice: pageChoiceArray[pageChoiceIndex], position: pageArray[pageIndex].index + "." + pageChoiceIndex });
		}
	}
	return result;
};

//A path's ledger key. The choice's own `index` wins, so reordering an event's choices does not
//silently change which paths a profile has already found.
honeycomb.discovery.eventPathKey = function (event, choice, position) {
	return event.index + "/" + (choice.index == null ? position : choice.index);
};

honeycomb.discovery.findEventPath = function (pathKey) {
	var partArray = String(pathKey).split("/");
	var event = honeycomb.eventArray == null ? null : honeycomb.findDefinition(honeycomb.eventArray, partArray[0]);
	if (event == null) return null;
	var choiceArray = honeycomb.discovery.allChoiceArray(event);
	for (var scanIndex = 0; scanIndex < choiceArray.length; scanIndex++) {
		if (honeycomb.discovery.eventPathKey(event, choiceArray[scanIndex].choice, choiceArray[scanIndex].position) == pathKey) {
			return { event: event, choice: choiceArray[scanIndex].choice };
		}
	}
	return null;
};

//---------------------------------------------------------------------------------------------------
//The ledger
//---------------------------------------------------------------------------------------------------
honeycomb.discovery.ledgerFor = function (kindIndex) {
	var state = honeycomb.state;
	if (state == null || state.profile == null) return null;
	//Built on demand so a save written before a kind existed picks it up without a migration.
	if (state.profile.discoveryArray == null) state.profile.discoveryArray = {};
	if (state.profile.discoveryArray[kindIndex] == null) state.profile.discoveryArray[kindIndex] = [];
	return state.profile.discoveryArray[kindIndex];
};

honeycomb.discovery.isKnown = function (kindIndex, index) {
	var ledger = honeycomb.discovery.ledgerFor(kindIndex);
	return ledger != null && ledger.indexOf(index) >= 0;
};

//How many of a kind this profile has found, counting only things that can be found -- a curse written
//into a deck is recorded, but it is not a card anybody collects, and must not push the count past the
//total.
honeycomb.discovery.count = function (kindIndex) {
	var ledger = honeycomb.discovery.ledgerFor(kindIndex);
	if (ledger == null) return 0;
	var allArray = honeycomb.discovery.allIndexArray(kindIndex);
	var count = 0;
	for (var scanIndex = 0; scanIndex < ledger.length; scanIndex++) {
		if (allArray.indexOf(ledger[scanIndex]) >= 0) count += 1;
	}
	return count;
};

honeycomb.discovery.allIndexArray = function (kindIndex) {
	var kind = honeycomb.findDefinition(honeycomb.discoveryKindArray, kindIndex);
	var allArray = kind == null || kind.allIndexArray == null ? [] : kind.allIndexArray();
	//Sealed content is left out of every total. See honeycomb.discovery.isSealed. So is set dressing:
	//an enemy entry marked `setDressing` is a drawing and a name for a backdrop prop, never a thing
	//that can be met, so counting it would make a total nobody can fill.
	return allArray.filter(function (index) {
		if (honeycomb.discovery.isUnlisted(kindIndex, index) == true) return false;
		return honeycomb.discovery.isSealed(kindIndex, index) != true;
	});
};

//What a profile may not be told exists: content belonging to a character still `inDevelopment` gets no
//tile, no slot, and no count that includes her -- the ledger's "7 / 23" is a count, and it must not
//count her pieces as enemies nobody could meet or her cards as cards nobody could hold. She is SEALED
//until the profile has earned her (honeycomb.shippedCharacterArray is that gate, and this asks it), so
//the totals a player sees are totals a player can fill. Two ways content belongs to her:
//  a card         names her as its `characterIndex`
//  anything else  carries `sealedBy: "<characterIndex>"` on its own entry -- her pieces, the gauntlet's
//                 boss, encounters and relic
//An intent is keyed "who/card" and is sealed with its `who`. A thing already FOUND is never sealed: the
//ledger cannot un-know what a profile has met.
honeycomb.discovery.sealedTableMap = { enemy: "enemyArray", encounter: "encounterArray", relic: "relicArray", card: "cardArray" };

//`setDressing: true` on a content entry says it is a picture, not a thing: it exists only to be drawn --
//the backdrop props the `showBackdropProp` verb puts behind a line. Nothing can meet one, so it is off
//every wall and out of every total. Separate from sealing, which is about a profile's progress.
//TWO REASONS A DEFINITION IS NOT ON THE WALL, and they are different things:
//  `setDressing`  it is a PICTURE, not a thing -- the backdrop props showBackdropProp draws.
//  `unlisted`     it is a real, fightable VARIANT of something already listed -- the gauntlet's Queens,
//                 which are their twins wearing one different card. Listing them would put the same
//                 creature on the wall twice under the same name.
//Neither is about a profile's progress, which is what sealing is for.
honeycomb.discovery.isUnlisted = function (kindIndex, index) {
	var definition = honeycomb.discovery.definitionFor(kindIndex, index);
	return definition != null && (definition.setDressing == true || definition.unlisted == true);
};

//The entry a discovery kind is about, or null.
honeycomb.discovery.definitionFor = function (kindIndex, index) {
	var tableName = honeycomb.discovery.sealedTableMap[kindIndex == "intent" ? "enemy" : kindIndex];
	if (tableName == null || honeycomb[tableName] == null) return null;
	var lookupIndex = kindIndex == "intent" ? String(index).split("/")[0] : index;
	return honeycomb.findDefinition(honeycomb[tableName], lookupIndex);
};

honeycomb.discovery.isSetDressing = function (kindIndex, index) {
	var tableName = honeycomb.discovery.sealedTableMap[kindIndex == "intent" ? "enemy" : kindIndex];
	if (tableName == null || honeycomb[tableName] == null) return false;
	var lookupIndex = kindIndex == "intent" ? String(index).split("/")[0] : index;
	var definition = honeycomb.findDefinition(honeycomb[tableName], lookupIndex);
	return definition != null && definition.setDressing == true;
};

//Whether a debug screen leaves this out. The debug tools ship to testers, so they keep the same secret
//every player-facing screen keeps: a character not on the shipped roster, and anything
//isSealed says is still sealed. `tuning.debug.showsSecrets` lifts it for a developer. Kind "character"
//asks the roster gate; every other kind is isSealed's.
honeycomb.discovery.hiddenFromDebug = function (kindIndex, index) {
	if (honeycomb.tuning.debug.showsSecrets == true) return false;
	if (kindIndex == "character") {
		var shippedArray = honeycomb.shippedCharacterArray();
		for (var scanIndex = 0; scanIndex < shippedArray.length; scanIndex++) {
			if (shippedArray[scanIndex].index == index) return false;
		}
		return honeycomb.findDefinition(honeycomb.characterArray, index) != null;
	}
	return honeycomb.discovery.isSealed(kindIndex, index);
};

honeycomb.discovery.isSealed = function (kindIndex, index) {
	var lookupKind = kindIndex;
	var lookupIndex = index;
	if (kindIndex == "intent") { lookupKind = "enemy"; lookupIndex = String(index).split("/")[0]; }
	var tableName = honeycomb.discovery.sealedTableMap[lookupKind];
	if (tableName == null || honeycomb[tableName] == null) return false;
	var definition = honeycomb.findDefinition(honeycomb[tableName], lookupIndex);
	if (definition == null) return false;
	var owner = definition.sealedBy != null ? definition.sealedBy : (lookupKind == "card" ? definition.characterIndex : null);
	if (owner == null) return false;
	var character = honeycomb.findDefinition(honeycomb.characterArray, owner);
	if (character == null || character.inDevelopment != true) return false;
	var shippedArray = honeycomb.shippedCharacterArray();
	for (var scanIndex = 0; scanIndex < shippedArray.length; scanIndex++) {
		if (shippedArray[scanIndex].index == owner) return false;
	}
	return honeycomb.discovery.isKnown(kindIndex, index) != true;
};

//How many of a kind exist in the content tables, so the ledger can read "7 / 23".
honeycomb.discovery.totalFor = function (kindIndex) {
	return honeycomb.discovery.allIndexArray(kindIndex).length;
};

//--- A character's obtainable cards -----------------------------------------------------------------
//Every card that names the character, found or not. Kept here rather than in the UI so the headless
//tests can hold the content to it; the drawing lives in honeycomb-ui.js.
honeycomb.obtainableCardArray = function (characterIndex) {
	var result = [];
	for (var cardIndex = 0; cardIndex < honeycomb.cardArray.length; cardIndex++) {
		var card = honeycomb.cardArray[cardIndex];
		if (card.characterIndex != characterIndex) continue;
		result.push(card);
	}
	return result;
};

//The name of an outfit on a character, or its index when it cannot be found.
honeycomb.outfitNameFor = function (definition, outfitIndex) {
	if (definition == null || definition.outfitArray == null) return outfitIndex;
	for (var outfitIndex2 = 0; outfitIndex2 < definition.outfitArray.length; outfitIndex2++) {
		if (definition.outfitArray[outfitIndex2].index == outfitIndex) return definition.outfitArray[outfitIndex2].name;
	}
	return outfitIndex;
};

//How the CURRENTLY-WORN loadout treats a card when it is offered, WITH the reasons. `member` is the
//live loadout (a teambuilding selection or a run party member: characterIndex, outfitIndex,
//equipmentArray), and the answer is about what that loadout does NOW -- so a card is only "reduced" or
//"blocked" while an outfit that does that is actually worn. `reasonArray` names the outfit and the
//multiplier behind each. The teambuilding and party windows print this; the compendium does not.
//
//An offerCondition that the current loadout fails is "blocked" (the card will not be offered); one it
//passes is folded into the rate like any other modifier.
honeycomb.cardOfferStateInfo = function (characterIndex, card, member) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	if (definition == null || card == null) return { state: "normal", reasonArray: [] };
	if (member == null) return { state: "normal", reasonArray: [] };

	var reasonArray = [];
	var blocked = false;
	var context = honeycomb.newEffectContext({ source: member });
	var outfit = honeycomb.findOutfit(definition, member.outfitIndex);
	var outfitName = outfit == null ? member.outfitIndex : outfit.name;

	function note(text) {
		if (reasonArray.indexOf(text) < 0) reasonArray.push(text);
	}
	//Used wherever the WORN OUTFIT is what blocks the card, rather than machine-speak like "Not offered
	//in ..." or "X blocks it".
	function blockedByOutfit() {
		return "Additional copies won't appear with the " + outfitName + " outfit equipped.";
	}

	//A CONDITION THE LOADOUT FAILS means the card is not offered at all.
	if (card.offerCondition != null && honeycomb.testCondition(card.offerCondition, context) == false) {
		blocked = true;
		note(blockedByOutfit());
	}

	var weight = 1;
	if (card.offerWeightArray != null) {
		for (var ruleIndex = 0; ruleIndex < card.offerWeightArray.length; ruleIndex++) {
			var rule = card.offerWeightArray[ruleIndex];
			if (rule.condition != null && honeycomb.testCondition(rule.condition, context) == false) continue;
			weight *= rule.multiplier;
			if (rule.multiplier <= 0) blocked = true;
			var label = rule.condition == null ? "Always"
				: (rule.condition.index == "wearsOutfit" ? outfitName : honeycomb.describeCondition(rule.condition));
			note(rule.multiplier <= 0 && rule.condition != null && rule.condition.index == "wearsOutfit"
				? blockedByOutfit() : label + (rule.multiplier <= 0 ? " blocks it" : " ×" + rule.multiplier));
		}
	}

	//THE WORN OUTFIT (plus equipment and tree) bends the card's whole sister mechanic at once.
	var archetypeWeight = honeycomb.archetypeWeightFor(member, card);
	if (archetypeWeight !== 1) {
		weight *= archetypeWeight;
		if (archetypeWeight <= 0) blocked = true;
		note(archetypeWeight <= 0 ? blockedByOutfit()
			: outfitName + (card.archetype == null ? "" : " (" + card.archetype + ")") + " ×" + archetypeWeight);
	}

	var state = "normal";
	if (blocked || weight <= 0) state = "blocked";
	else if (weight > 1) state = "boosted";
	else if (weight < 1) state = "reduced";
	return { state: state, reasonArray: reasonArray };
};

//Just the state, for callers that do not need the reasons (tests, and anything counting states).
honeycomb.cardOfferState = function (characterIndex, card, member) {
	return honeycomb.cardOfferStateInfo(characterIndex, card, member).state;
};

//---------------------------------------------------------------------------------------------------
//Earning
//---------------------------------------------------------------------------------------------------
//Records one discovery and pays for it. Returns what happened, so a reward screen can say
//"Sporeling -- NEW" rather than only showing a number.
//
//TWO PAYMENTS, TWO POOLS. Finding something for the first time pays `firstExperience` into the GLOBAL
//pool -- that is game completion. Earning it (defeating it, winning it, resolving it) pays
//`baseExperience` as PERSONAL experience, split among the party -- that is the doing. A first-time
//earn pays both: the party still did the work.
//
//  context        optional; when given, the award is logged so a combat replay can show it
//  options        {firstOnly} pays the first-time part and nothing personal -- MEETING is not earning
//                 {deferPersonal} leaves the personal part unpaid and reports it, so a caller holding
//                 several (a victory) can split the total once rather than rounding each piece
//
//Returns {awarded, personal, shareArray, isNew, kind, index, name}: `awarded` is what reached the
//global pool, `personal` what was (or is owed) as personal experience.
honeycomb.discovery.record = function (kindIndex, index, context, options) {
	var nothing = { awarded: 0, personal: 0, shareArray: [], isNew: false };
	var kind = honeycomb.findDefinition(honeycomb.discoveryKindArray, kindIndex);
	if (kind == null || index == null) return nothing;
	if (honeycomb.tuning.progression.experienceEnabled != true) return nothing;
	var settings = options == null ? {} : options;

	var ledger = honeycomb.discovery.ledgerFor(kindIndex);
	if (ledger == null) return nothing;

	var isNew = ledger.indexOf(index) < 0;
	if (isNew == true) ledger.push(index);

	var multiplier = honeycomb.tuning.progression.experienceMultiplier;
	var amount = isNew ? Math.round(kind.firstExperience * multiplier) : 0;
	var personal = settings.firstOnly == true ? 0 : Math.round(kind.baseExperience * multiplier);
	if (amount > 0) honeycomb.addResource("experience", amount);
	var shareArray = personal > 0 && settings.deferPersonal != true
		? honeycomb.progression.payPersonal(personal) : [];

	if (context != null && (amount > 0 || personal > 0)) {
		honeycomb.logEvent(context, {
			type: "experience",
			kind: kindIndex,
			discovery: index,
			isNew: isNew,
			amount: amount,
			personal: personal,
		});
	}

	return { awarded: amount, personal: personal, shareArray: shareArray, isNew: isNew,
		kind: kindIndex, index: index, name: kind.nameFor(index) };
};

//MEETING something. Pays the first-time bonus if it is new and nothing if it is not -- the repeat pay
//is for EARNING it, which record() handles. Returns the same shape record() does.
//
//A discovery made mid-fight is also noted on the fight, so the victory screen can name it alongside
//what the victory itself paid; the experience is already in the pool by then.
honeycomb.discovery.meet = function (kindIndex, index, context) {
	if (honeycomb.discovery.isKnown(kindIndex, index) == true) return { awarded: 0, personal: 0, shareArray: [], isNew: false };
	var result = honeycomb.discovery.record(kindIndex, index, context, { firstOnly: true });
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (combat != null && result.isNew == true) {
		if (combat.discoveryArray == null) combat.discoveryArray = [];
		combat.discoveryArray.push({ kind: kindIndex, index: index, name: result.name, awarded: result.awarded });
	}
	return result;
};

//NOTING something: into the ledger and nothing more -- no pay, no line on a victory screen, and
//written whether or not experience is switched on. For a ledger that exists to be READ (which enemy
//moves the player has seen) rather than to reward. Returns whether it was new.
honeycomb.discovery.note = function (kindIndex, index) {
	var ledger = honeycomb.discovery.ledgerFor(kindIndex);
	if (ledger == null || index == null || ledger.indexOf(index) >= 0) return false;
	ledger.push(index);
	return true;
};

//Whether the player has seen an enemy's move. See the "intent" discovery kind.
honeycomb.discovery.intentKey = function (enemyIndex, intentIndex) {
	return enemyIndex + "/" + intentIndex;
};

honeycomb.discovery.hasSeenIntent = function (enemyIndex, intentIndex) {
	return honeycomb.discovery.isKnown("intent", honeycomb.discovery.intentKey(enemyIndex, intentIndex));
};

//Whether a move is shown face up. Seeing the intent once marks it; Cassadora's Studied Foe
//(`enemyMovelistUnlock`) shows the WHOLE movelist for any enemy the party has already met, so a foe
//already fought has nothing left to hide.
honeycomb.enemyMoveSeen = function (enemyIndex, intentIndex) {
	if (honeycomb.discovery.hasSeenIntent(enemyIndex, intentIndex)) return true;
	if (enemyIndex == null) return false;
	if (honeycomb.partyFieldFlag("enemyMovelistUnlock") != true) return false;
	return honeycomb.discovery.isKnown("enemy", enemyIndex) == true;
};

honeycomb.discovery.meetArray = function (kindIndex, indexArray, context) {
	for (var scanIndex = 0; scanIndex < indexArray.length; scanIndex++) {
		honeycomb.discovery.meet(kindIndex, indexArray[scanIndex], context);
	}
};

//Records a list of the same kind, summarising what it paid. Used by a victory, which discovers every
//enemy it downed at once. `options` passes through to record().
honeycomb.discovery.recordArray = function (kindIndex, indexArray, context, options) {
	var total = 0;
	var personal = 0;
	var newArray = [];
	for (var scanIndex = 0; scanIndex < indexArray.length; scanIndex++) {
		var result = honeycomb.discovery.record(kindIndex, indexArray[scanIndex], context, options);
		total += result.awarded;
		personal += result.personal;
		if (result.isNew == true) newArray.push(result.name);
	}
	return { awarded: total, personal: personal, newNameArray: newArray };
};

//Everything a won fight is worth. Called once by the victory screen, and returns a breakdown rather
//than a bare number so the screen can show WHY the number is what it is -- which is the whole point
//of paying more for something new.
//
//Returns {awarded, personal, shareArray, lineArray}: global experience, personal experience (paid ONCE,
//split among the party, so it is not rounded away piece by piece), who got how much, and the lines.
honeycomb.discovery.awardCombat = function (combat, context) {
	if (combat == null) return { awarded: 0, personal: 0, shareArray: [], lineArray: [] };
	var lineArray = [];
	var total = 0;
	var personal = 0;

	//What was MET during the fight -- every enemy on the field, and anything summoned -- already paid
	//its first-time bonus at the moment it appeared. It is folded in here so the victory screen names it.
	var metArray = combat.discoveryArray == null ? [] : combat.discoveryArray;
	for (var metIndex = 0; metIndex < metArray.length; metIndex++) {
		total += metArray[metIndex].awarded;
		lineArray.push({ kind: metArray[metIndex].kind, amount: metArray[metIndex].awarded, newNameArray: [metArray[metIndex].name] });
	}

	//Defeating them is EARNING them: the repeat pay, drawn from who actually fell. Everyone here was
	//already met, so none of this can pay a first-time bonus twice.
	var enemyIndexArray = [];
	for (var enemyIndex = 0; enemyIndex < combat.enemyArray.length; enemyIndex++) {
		if (combat.enemyArray[enemyIndex].downed != true) continue;
		//A summoned enemy is the same creature as one the encounter fielded, and pays the same.
		enemyIndexArray.push(combat.enemyArray[enemyIndex].enemyIndex);
	}

	var kindArray = [
		{ kind: "enemy", indexArray: enemyIndexArray },
		{ kind: "encounter", indexArray: [combat.encounterIndex] },
	];
	for (var scanIndex = 0; scanIndex < kindArray.length; scanIndex++) {
		var result = honeycomb.discovery.recordArray(kindArray[scanIndex].kind,
			kindArray[scanIndex].indexArray, context, { deferPersonal: true });
		personal += result.personal;
		if (result.awarded === 0 && result.newNameArray.length === 0) continue;
		total += result.awarded;
		lineArray.push({
			kind: kindArray[scanIndex].kind,
			amount: result.awarded,
			newNameArray: result.newNameArray,
		});
	}

	return { awarded: total, personal: personal, shareArray: honeycomb.progression.payPersonal(personal), lineArray: lineArray };
};

//---------------------------------------------------------------------------------------------------
//Reading the pool
//---------------------------------------------------------------------------------------------------
honeycomb.discovery.experience = function () {
	return honeycomb.getResource("experience");
};

//A summary of the whole ledger, for a lifetime-progress screen.
honeycomb.discovery.summaryArray = function () {
	var result = [];
	for (var scanIndex = 0; scanIndex < honeycomb.discoveryKindArray.length; scanIndex++) {
		var kind = honeycomb.discoveryKindArray[scanIndex];
		result.push({
			index: kind.index,
			name: kind.name,
			found: honeycomb.discovery.count(kind.index),
			total: honeycomb.discovery.totalFor(kind.index),
		});
	}
	return result;
};

//---------------------------------------------------------------------------------------------------
//Conditions and values that read progression
//---------------------------------------------------------------------------------------------------
//Appended to the shared registries, so an unlock or an event can gate on lifetime progress without
//any of this being wired into the effect layer.
honeycomb.conditionArray.push(
	{
		index: "hasDiscovered",
		test: function (condition) { return honeycomb.discovery.isKnown(condition.kind, condition.discovery); },
		describe: function (condition) { return "you have found " + condition.discovery; },
	},
	{
		index: "discoveryCount",
		test: function (condition) {
			var minimum = condition.minimumCount == null ? 1 : condition.minimumCount;
			return honeycomb.discovery.count(condition.kind) >= minimum;
		},
		describe: function (condition) {
			return "you have found " + (condition.minimumCount == null ? 1 : condition.minimumCount) +
				" " + condition.kind;
		},
	}
);

honeycomb.valueArray.push({
	index: "discoveryCount",
	resolve: function (value) { return honeycomb.discovery.count(value.kind); },
	describe: function (value) { return "the number of " + value.kind + " you have found"; },
});


//===================================================================================================
//PROGRESSION TREES
//===================================================================================================
//A character's progression is a BRANCHING GRAPH, not a list. Reaching a node opens the ones it leads
//to, and where two branches leave the same node the player picks one -- which is the shape a roguelike
//owes its players.
//
//THREE PROPERTIES DECIDED THE DESIGN.
//
//1. RESPEC IS FREE. Every choice can be unmade and the experience comes straight back, and there is a
//   reset that unmakes all of them at once. A tree whose choices are permanent is a tree the player
//   reads a wiki about instead of experimenting with.
//
//2. A NODE IS AN OUTFIT. Literally: a tree node carries the SAME modifier fields an outfit and a piece
//   of equipment carry -- healthModifier, cardAdditionArray, cardReplacementArray, abilityAdditionArray,
//   tagAdditionArray, hooks. It is appended to honeycomb.memberCardModifierArray, so a selected node
//   reaches the deck, the ability list, the tag list and the hook pipeline through machinery that
//   already existed. Nothing had to learn what a progression node is.
//
//3. AN OUTFIT CHANGE MUST NOT SILENTLY BREAK A BUILD. This was the case called out as needing an
//   answer now, and it does: an outfit may LOCK tree nodes, and a locked node the player had already
//   selected has to go somewhere. It REFUNDS -- the node is deselected and its cost returns to the
//   pool -- rather than vanishing or blocking the outfit change. Anything downstream of a refunded
//   node refunds too, because a tree with a hole in it is not a tree.
//
//LAYOUT. Tree nodes carry `x` and `y` as percentages, exactly as map anchors do. `x` is how far along
//the tree a node sits and `y` how far across; the Progression tab draws the tree DESCENDING, so there
//`x` becomes the height and `y` the position across the narrow column. See honeycomb-overlays-progression.js.
//
//FOUR PARTS:
//
//RANKS. `rankMaximum` lets a node be bought more than once. A rank is stored as one more copy of the
//node's index in the selection list, so a rank-3 node appears three times -- and selectedNodeArray
//hands the modifier pipeline one copy per rank, so health, card additions and hooks stack with no new
//code. (Tags and abilities are sets and do not double.) Buying is a click; giving a rank back is a
//right-click or a long press, because a click can no longer mean "toggle".
//
//REQUIREMENTS. A `requiresArray` entry may be `{index, rank}` -- "at least this many ranks of it" --
//as well as a bare index. `exclusiveGroup` names a set of nodes of which only ONE may be held: taking
//one visibly locks the others (and whatever hangs off them) until it is given back.
//
//TWO POOLS. PERSONAL experience belongs to one character and is earned by fighting -- defeating enemies,
//winning battles and runs, split among the party. GLOBAL experience is the shared pool, earned only by
//finding things for the first time: the game's completion. A node spends the character's own
//experience first and the global pool for the rest, and every purchase is written to a ledger so a
//refund returns each point to the pool it came from.
//
//PATHS. honeycomb.progression.pathTo finds the fewest nodes that would open a node whose prerequisites
//are missing, so hovering it can light the way.
honeycomb.progression = {};

//---------------------------------------------------------------------------------------------------
//Reading a tree
//---------------------------------------------------------------------------------------------------
//The tree for a character, after any outfit has had its say. Returns {nodeArray, backgroundPath}.
//
//An outfit alters a tree two ways, and both are resolved here rather than stored:
//  treeLockArray   node indices this outfit forbids
//  treeNodeArray   nodes this outfit adds, which is how a costume opens a branch nobody else has
honeycomb.progression.treeFor = function (selection) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray,
		selection == null ? null : selection.characterIndex);
	if (definition == null || definition.progressionTree == null) return null;
	var tree = definition.progressionTree;

	var lockArray = [];
	var extraArray = [];
	var outfit = honeycomb.findOutfit(definition, selection.outfitIndex);
	if (outfit != null) {
		if (outfit.treeLockArray != null) lockArray = outfit.treeLockArray;
		if (outfit.treeNodeArray != null) extraArray = outfit.treeNodeArray;
	}

	var nodeArray = [];
	for (var scanIndex = 0; scanIndex < tree.nodeArray.length; scanIndex++) {
		if (lockArray.indexOf(tree.nodeArray[scanIndex].index) >= 0) continue;
		nodeArray.push(tree.nodeArray[scanIndex]);
	}
	for (var extraIndex = 0; extraIndex < extraArray.length; extraIndex++) nodeArray.push(extraArray[extraIndex]);

	return {
		nodeArray: nodeArray,
		backgroundPath: tree.backgroundPath,
		aspect: tree.aspect == null ? honeycomb.tuning.progression.treeAspect : tree.aspect,
	};
};

honeycomb.progression.findNode = function (selection, nodeIndex) {
	var tree = honeycomb.progression.treeFor(selection);
	if (tree == null) return null;
	return honeycomb.findDefinition(tree.nodeArray, nodeIndex);
};

//---------------------------------------------------------------------------------------------------
//What the player has chosen
//---------------------------------------------------------------------------------------------------
//Selections are PROFILE state: a build survives runs, because the experience that paid for it did.
honeycomb.progression.selectionArray = function (characterIndex) {
	var state = honeycomb.state;
	if (state == null || state.profile == null) return [];
	if (state.profile.progressionArray == null) state.profile.progressionArray = {};
	if (state.profile.progressionArray[characterIndex] == null) state.profile.progressionArray[characterIndex] = [];
	return state.profile.progressionArray[characterIndex];
};

honeycomb.progression.isSelected = function (characterIndex, nodeIndex) {
	return honeycomb.progression.selectionArray(characterIndex).indexOf(nodeIndex) >= 0;
};

//How many ranks of a node are held: the number of times its index appears in the selection list.
honeycomb.progression.rankOf = function (characterIndex, nodeIndex) {
	var selectedArray = honeycomb.progression.selectionArray(characterIndex);
	var count = 0;
	for (var scanIndex = 0; scanIndex < selectedArray.length; scanIndex++) {
		if (selectedArray[scanIndex] == nodeIndex) count += 1;
	}
	return count;
};

honeycomb.progression.rankMaximum = function (node) {
	if (node == null) return 0;
	return node.rankMaximum == null ? honeycomb.tuning.progression.defaultRankMaximum : node.rankMaximum;
};

//A `requiresArray` entry is a node index, or {index, rank} for "at least this many ranks of it".
honeycomb.progression.requirementIndex = function (entry) {
	return entry != null && typeof entry === "object" ? entry.index : entry;
};

honeycomb.progression.requirementRank = function (entry) {
	return entry != null && typeof entry === "object" && entry.rank != null ? entry.rank : 1;
};

honeycomb.progression.requirementMet = function (characterIndex, entry) {
	return honeycomb.progression.rankOf(characterIndex, honeycomb.progression.requirementIndex(entry)) >=
		honeycomb.progression.requirementRank(entry);
};

//The selected nodes as definitions, for a character in a given outfit -- ONE COPY PER RANK, which is
//what makes a ranked node's modifiers stack. This is what feeds the modifier pipeline, so a node locked
//by the current outfit contributes nothing even if it is still recorded -- belt and braces alongside
//the refund. Ranks past a node's maximum (content lowered it) contribute nothing either.
//
//The answer is remembered per character, because it is asked for on every card resolved in combat and
//only changes when a node is bought, refunded or reset, or the outfit changes -- recomputing it on every
//call is a measurable cost (see balance_tests/BRIEF.md Step 1). The remembered answer is
//keyed on CONTENT -- character, outfit and the selection list itself -- and not on a version counter,
//because honeycomb.restoreState swaps the whole state object under a forecast or a bot lookahead and a
//counter bumped inside `select` would then be wrong. A key made from the contents cannot go stale.
//Callers only read the array (they push its entries into another list), so it is returned as stored.
honeycomb.progression.selectedNodeArrayCache = {};

honeycomb.progression.selectedNodeArray = function (selection) {
	if (selection == null || selection.characterIndex == null) return [];
	var selectedArray = honeycomb.progression.selectionArray(selection.characterIndex);
	var key = selection.outfitIndex + "|" + selectedArray.join(",");
	var cached = honeycomb.progression.selectedNodeArrayCache[selection.characterIndex];
	if (cached != null && cached.key === key) return cached.result;

	var tree = honeycomb.progression.treeFor(selection);
	if (tree == null) return [];

	//One pass over the selection list to count ranks, then one pass over the tree, so a cache miss no
	//longer rescans the whole selection list once per node.
	var rankByIndex = {};
	for (var selectedIndex = 0; selectedIndex < selectedArray.length; selectedIndex++) {
		var held = selectedArray[selectedIndex];
		rankByIndex[held] = (rankByIndex[held] == null ? 0 : rankByIndex[held]) + 1;
	}
	var result = [];
	for (var scanIndex = 0; scanIndex < tree.nodeArray.length; scanIndex++) {
		var node = tree.nodeArray[scanIndex];
		var rank = Math.min(rankByIndex[node.index] == null ? 0 : rankByIndex[node.index],
			honeycomb.progression.rankMaximum(node));
		for (var copyIndex = 0; copyIndex < rank; copyIndex++) result.push(node);
	}
	honeycomb.progression.selectedNodeArrayCache[selection.characterIndex] = { key: key, result: result };
	return result;
};

//The node sharing this one's `exclusiveGroup` that is already held, or null. Only one node of a group
//may be held at a time, so a held one locks the rest.
honeycomb.progression.excludedBy = function (selection, node) {
	if (node == null || node.exclusiveGroup == null) return null;
	var tree = honeycomb.progression.treeFor(selection);
	if (tree == null) return null;
	for (var scanIndex = 0; scanIndex < tree.nodeArray.length; scanIndex++) {
		var other = tree.nodeArray[scanIndex];
		if (other.index == node.index || other.exclusiveGroup != node.exclusiveGroup) continue;
		if (honeycomb.progression.isSelected(selection.characterIndex, other.index) == true) return other;
	}
	return null;
};

//---------------------------------------------------------------------------------------------------
//Legality
//---------------------------------------------------------------------------------------------------
//A node may be taken when it is on the tree, not already taken, reachable, and affordable.
//
//REACHABLE means: it is a root, or at least one node leading INTO it is already selected. Edges are
//written as `requiresArray` on the node itself -- the arrow points backwards -- so a node knows what
//it depends on without the tree needing a separate edge list.
//
//`requiresAll` demands every prerequisite rather than any one, for a node that is genuinely a
//convergence rather than a choice.
honeycomb.progression.isReachable = function (selection, node) {
	if (node.requiresArray == null || node.requiresArray.length === 0) return true;
	for (var scanIndex = 0; scanIndex < node.requiresArray.length; scanIndex++) {
		var held = honeycomb.progression.requirementMet(selection.characterIndex, node.requiresArray[scanIndex]);
		if (node.requiresAll == true && held == false) return false;
		if (node.requiresAll != true && held == true) return true;
	}
	return node.requiresAll == true;
};

//What buying a given rank costs (1 = the first). `costArray` prices each rank separately, its last entry
//repeating; otherwise every rank costs `cost`, or tuning's default.
honeycomb.progression.nodeCost = function (node, rank) {
	if (node == null) return 0;
	if (node.costArray != null && node.costArray.length > 0) {
		var position = Math.max(0, Math.min((rank == null ? 1 : rank) - 1, node.costArray.length - 1));
		return node.costArray[position];
	}
	return node.cost == null ? honeycomb.tuning.progression.defaultNodeCost : node.cost;
};

//Why a node may not be taken, or null when it may. Returned as a reason rather than a boolean so the
//tree can explain a greyed node instead of just greying it.
honeycomb.progression.refuseReason = function (selection, nodeIndex) {
	var node = honeycomb.progression.findNode(selection, nodeIndex);
	if (node == null) return "missing";
	var rank = honeycomb.progression.rankOf(selection.characterIndex, nodeIndex);
	var maximum = honeycomb.progression.rankMaximum(node);
	if (rank >= maximum) return maximum > 1 ? "maxed" : "taken";
	if (honeycomb.progression.excludedBy(selection, node) != null) return "excluded";
	if (honeycomb.progression.isReachable(selection, node) == false) return "unreachable";
	if (honeycomb.progression.spendable(selection.characterIndex) < honeycomb.progression.nodeCost(node, rank + 1)) {
		return "cost";
	}
	//A node may gate itself on anything a condition can ask, including party tags and discoveries.
	if (node.condition != null && honeycomb.testCondition(node.condition, honeycomb.newEffectContext({})) == false) {
		return "condition";
	}
	return null;
};

//---------------------------------------------------------------------------------------------------
//The two pools
//---------------------------------------------------------------------------------------------------
//GLOBAL experience is the `experience` resource (profile scope). PERSONAL experience is kept per
//character on the profile. Both survive every run.
honeycomb.progression.personalExperience = function (characterIndex) {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile == null || profile.personalExperienceArray == null) return 0;
	var amount = profile.personalExperienceArray[characterIndex];
	return amount == null ? 0 : amount;
};

honeycomb.progression.addPersonalExperience = function (characterIndex, amount) {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile == null || characterIndex == null) return;
	if (profile.personalExperienceArray == null) profile.personalExperienceArray = {};
	profile.personalExperienceArray[characterIndex] =
		Math.max(0, honeycomb.progression.personalExperience(characterIndex) + amount);
};

//Pays personal experience to the current party, split as evenly as whole numbers allow: everyone gets
//the same share and the remainder goes one point each from the FRONT of the party back. Downed members
//are paid too -- they were there. Returns [{characterIndex, amount}] for a reward screen to print.
//With no run there is no party, and nothing is paid.
//Only a real roster member is paid: a summoned combatant is pushed into `run.partyArray` like anyone
//else, so without this a golem would take a share of the split -- and since a golem is built from an
//enemy definition, it has no `characterIndex`, so that share would be paid to nobody at all.
honeycomb.progression.personalShareArray = function (run) {
	var result = [];
	if (run == null || run.partyArray == null) return result;
	for (var scanIndex = 0; scanIndex < run.partyArray.length; scanIndex++) {
		var member = run.partyArray[scanIndex];
		if (member == null || member.characterIndex == null) continue;
		//A character summoned for one fight is a guest, not a member of the roster that went in.
		if (member.summoned == true || member.temporary == true) continue;
		result.push(member);
	}
	return result;
};

honeycomb.progression.payPersonal = function (amount) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || amount == null || amount <= 0) return [];
	var memberArray = honeycomb.progression.personalShareArray(run);
	if (memberArray.length === 0) return [];
	//The multiplier is tuning.progression.personalExperienceMultiplier, applied here rather than at each
	//source so every way of earning personal experience moves together.
	var multiplier = honeycomb.tuning.progression.personalExperienceMultiplier;
	var total = Math.round(amount * (multiplier == null ? 1 : multiplier));
	var count = memberArray.length;
	var share = Math.floor(total / count);
	var remainder = total - share * count;
	var result = [];
	for (var memberIndex = 0; memberIndex < count; memberIndex++) {
		var member = memberArray[memberIndex];
		var paid = share + (memberIndex < remainder ? 1 : 0);
		if (paid <= 0) continue;
		//A tree node ("Veteran") multiplies what THIS member takes from the split.
		var multiplier = honeycomb.progression.experienceGainMultiplier(member);
		if (multiplier != 1) paid = Math.round(paid * multiplier);
		honeycomb.progression.addPersonalExperience(member.characterIndex, paid);
		result.push({ characterIndex: member.characterIndex, amount: paid });
	}
	return result;
};

//A character's own personal-experience multiplier, from a tree node. Multiplicative, so a second node
//multiplies rather than adds; 1 with none.
honeycomb.progression.experienceGainMultiplier = function (selection) {
	var multiplier = 1;
	var modifierArray = honeycomb.memberCardModifierArray(selection);
	for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
		var value = modifierArray[modifierIndex].modifier.personalExperienceMultiplier;
		if (typeof value === "number") multiplier *= value;
	}
	return multiplier;
};

//Winning a run pays personal experience, split like any other.
honeycomb.progression.payRunVictory = function () {
	if (honeycomb.tuning.progression.experienceEnabled != true) return [];
	return honeycomb.progression.payPersonal(Math.round(honeycomb.tuning.progression.runVictoryExperience *
		honeycomb.tuning.progression.experienceMultiplier));
};

//Everything one character could spend on their own tree right now: their own experience and the
//global pool together.
honeycomb.progression.spendable = function (characterIndex) {
	return honeycomb.progression.personalExperience(characterIndex) + honeycomb.getResource("experience");
};

//Takes a price from the pools in `tuning.progression.spendOrder`, and says how much came from each.
honeycomb.progression.pay = function (characterIndex, cost) {
	var paid = { personal: 0, global: 0 };
	var remaining = cost;
	var orderArray = honeycomb.tuning.progression.spendOrder;
	for (var orderIndex = 0; orderIndex < orderArray.length && remaining > 0; orderIndex++) {
		if (orderArray[orderIndex] == "personal") {
			var fromPersonal = Math.min(remaining, honeycomb.progression.personalExperience(characterIndex));
			honeycomb.progression.addPersonalExperience(characterIndex, -fromPersonal);
			paid.personal += fromPersonal;
			remaining -= fromPersonal;
		} else if (orderArray[orderIndex] == "global") {
			var fromGlobal = Math.min(remaining, honeycomb.getResource("experience"));
			honeycomb.addResource("experience", -fromGlobal);
			paid.global += fromGlobal;
			remaining -= fromGlobal;
		}
	}
	return paid;
};

//The purchase ledger: one {node, personal, global} per rank bought, in order. It is what lets a refund
//put every point back in the pool it came from, so respeccing can never move experience from one
//character to the whole cast or the other way round.
honeycomb.progression.paidLedger = function (characterIndex) {
	var profile = honeycomb.state.profile;
	if (profile.progressionPaidArray == null) profile.progressionPaidArray = {};
	if (profile.progressionPaidArray[characterIndex] == null) profile.progressionPaidArray[characterIndex] = [];
	return profile.progressionPaidArray[characterIndex];
};

//Refunds ONE rank of a node that has just come off the selection list. The latest purchase of that
//node is returned exactly as it was paid. A rank with no ledger entry -- bought before the ledger
//existed -- is refunded at its listed price into the global pool, which is where it was paid from then.
//`rank` is the rank being given back. Returns the total refunded.
honeycomb.progression.refundRank = function (characterIndex, nodeIndex, rank) {
	var ledger = honeycomb.progression.paidLedger(characterIndex);
	for (var scanIndex = ledger.length - 1; scanIndex >= 0; scanIndex--) {
		if (ledger[scanIndex].node != nodeIndex) continue;
		var entry = ledger.splice(scanIndex, 1)[0];
		honeycomb.progression.addPersonalExperience(characterIndex, entry.personal);
		honeycomb.addResource("experience", entry.global);
		return entry.personal + entry.global;
	}
	var listed = honeycomb.progression.baseNodeCost(characterIndex, nodeIndex, rank);
	honeycomb.addResource("experience", listed);
	return listed;
};

//---------------------------------------------------------------------------------------------------
//Selecting and unselecting
//---------------------------------------------------------------------------------------------------
//Buys the next rank of a node.
honeycomb.progression.select = function (selection, nodeIndex) {
	var reason = honeycomb.progression.refuseReason(selection, nodeIndex);
	if (reason != null) return { changed: false, reason: reason };

	var node = honeycomb.progression.findNode(selection, nodeIndex);
	var cost = honeycomb.progression.nodeCost(node,
		honeycomb.progression.rankOf(selection.characterIndex, nodeIndex) + 1);
	var paid = honeycomb.progression.pay(selection.characterIndex, cost);
	honeycomb.progression.selectionArray(selection.characterIndex).push(nodeIndex);
	honeycomb.progression.paidLedger(selection.characterIndex).push(
		{ node: nodeIndex, personal: paid.personal, global: paid.global });
	honeycomb.progression.applyToParty(selection.characterIndex);
	return { changed: true, spent: cost, paid: paid };
};

//Gives back ONE rank of a node and refunds it. When that was the last rank, anything that depended on
//the node is unmade too, because a selection that is no longer reachable is not a build -- it is a hole.
honeycomb.progression.unselect = function (selection, nodeIndex) {
	var selectedArray = honeycomb.progression.selectionArray(selection.characterIndex);
	var position = selectedArray.lastIndexOf(nodeIndex);
	if (position < 0) return { changed: false, refunded: 0 };

	selectedArray.splice(position, 1);
	var remaining = honeycomb.progression.rankOf(selection.characterIndex, nodeIndex);
	var refunded = honeycomb.progression.refundRank(selection.characterIndex, nodeIndex, remaining + 1);

	//Cascade: whatever is now unreachable comes off too, and is refunded in turn.
	refunded += honeycomb.progression.pruneUnreachable(selection);
	honeycomb.progression.applyToParty(selection.characterIndex);
	return { changed: true, refunded: refunded, rank: remaining };
};

//Drops every selection that is no longer legal, refunding each, and repeats until nothing changes.
//Returns the total refunded.
//
//Called after an unselect, and after ANY change that could invalidate a build -- which in practice
//means an outfit change. That is the case the brief asked to have designed now: an outfit locking a
//node the player had already taken must not silently swallow it.
honeycomb.progression.pruneUnreachable = function (selection) {
	var refunded = 0;
	var guard = 0;
	var settled = false;
	while (settled == false && guard < honeycomb.tuning.progression.pruneIterationLimit) {
		guard += 1;
		settled = true;
		var selectedArray = honeycomb.progression.selectionArray(selection.characterIndex);
		for (var scanIndex = selectedArray.length - 1; scanIndex >= 0; scanIndex--) {
			var nodeIndex = selectedArray[scanIndex];
			var node = honeycomb.progression.findNode(selection, nodeIndex);
			//Gone from the tree entirely -- the outfit locked it -- or no longer reachable.
			var invalid = node == null || honeycomb.progression.isReachable(selection, node) == false;
			//A node whose own condition has stopped holding is invalid too.
			if (invalid == false && node.condition != null &&
				honeycomb.testCondition(node.condition, honeycomb.newEffectContext({})) == false) invalid = true;
			//More ranks than the node allows (content lowered the maximum): the extra ones come off.
			if (invalid == false && honeycomb.progression.rankOf(selection.characterIndex, nodeIndex) >
				honeycomb.progression.rankMaximum(node)) invalid = true;
			//Two nodes of one exclusive group (a save from before the group existed): the one bought
			//LATER gives way, so the earlier choice stands.
			if (invalid == false && node.exclusiveGroup != null) {
				for (var earlierIndex = 0; earlierIndex < scanIndex; earlierIndex++) {
					var earlier = honeycomb.progression.findNode(selection, selectedArray[earlierIndex]);
					if (earlier == null || earlier.index == node.index || earlier.exclusiveGroup != node.exclusiveGroup) continue;
					invalid = true;
					break;
				}
			}
			if (invalid == false) continue;

			selectedArray.splice(scanIndex, 1);
			//A node the outfit removed is no longer findable, so a price with no ledger entry is read
			//from the character's FULL tree rather than the filtered one. Refunding zero would quietly tax
			//the player for changing costume, which is exactly the silent loss this function prevents.
			refunded += honeycomb.progression.refundRank(selection.characterIndex, nodeIndex,
				honeycomb.progression.rankOf(selection.characterIndex, nodeIndex) + 1);
			settled = false;
		}
	}
	return refunded;
};

//What a rank of a node lists at, read from the character's WHOLE tree, ignoring what the current
//outfit hides. Needed to refund a node the outfit has just taken off the board.
honeycomb.progression.baseNodeCost = function (characterIndex, nodeIndex, rank) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	if (definition == null || definition.progressionTree == null) return 0;
	var node = honeycomb.findDefinition(definition.progressionTree.nodeArray, nodeIndex);
	if (node == null) {
		//An outfit-added node the outfit has since been swapped away from. Its cost is on the outfit.
		for (var outfitIndex = 0; outfitIndex < definition.outfitArray.length; outfitIndex++) {
			var outfit = definition.outfitArray[outfitIndex];
			if (outfit.treeNodeArray == null) continue;
			var found = honeycomb.findDefinition(outfit.treeNodeArray, nodeIndex);
			if (found != null) return honeycomb.progression.nodeCost(found, rank);
		}
		return 0;
	}
	return honeycomb.progression.nodeCost(node, rank);
};

//Unmakes every choice on one character and refunds the lot, each rank to the pool that paid for it.
honeycomb.progression.reset = function (selection) {
	var selectedArray = honeycomb.progression.selectionArray(selection.characterIndex);
	var refunded = 0;
	while (selectedArray.length > 0) {
		var nodeIndex = selectedArray.pop();
		refunded += honeycomb.progression.refundRank(selection.characterIndex, nodeIndex,
			honeycomb.progression.rankOf(selection.characterIndex, nodeIndex) + 1);
	}
	//Nothing should be left in the ledger now; anything that is describes no held node, so it is
	//cleared rather than paid out twice.
	honeycomb.progression.paidLedger(selection.characterIndex).length = 0;
	honeycomb.progression.applyToParty(selection.characterIndex);
	return refunded;
};

//---------------------------------------------------------------------------------------------------
//Keeping a live party in step
//---------------------------------------------------------------------------------------------------
//A tree change alters maximum health, so a member already in a run has to be recomputed. Cards and
//abilities are derived on read and need no push.
honeycomb.progression.applyToParty = function (characterIndex) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		if (run.partyArray[memberIndex].characterIndex != characterIndex) continue;
		honeycomb.recalculateMemberStats(run.partyArray[memberIndex]);
		honeycomb.abilities.reconcile(run.partyArray[memberIndex]);
	}
};

//THE OUTFIT-CHANGE ANSWER. Called whenever a character's outfit or equipment changes. Re-validates
//every selection against the new tree and refunds anything that no longer holds, so the player is
//told what happened and gets their experience back rather than losing a build silently.
honeycomb.progression.onLoadoutChanged = function (selection) {
	var refunded = honeycomb.progression.pruneUnreachable(selection);
	honeycomb.progression.applyToParty(selection.characterIndex);
	return refunded;
};

//---------------------------------------------------------------------------------------------------
//Reading the tree for display
//---------------------------------------------------------------------------------------------------
//Every node with everything a renderer needs, in one pass.
//  rank / rankMaximum   ranks held and allowed
//  selected             at least one rank held
//  available            the next rank may be bought now
//  cost                 what the next rank costs (the last one's price once maxed)
//  excludedBy           the held node of its exclusive group that locks it, or null
//  sealed               no way left to open it at all: an exclusive choice has shut its every route
honeycomb.progression.viewArray = function (selection) {
	var tree = honeycomb.progression.treeFor(selection);
	if (tree == null) return [];
	var result = [];
	for (var scanIndex = 0; scanIndex < tree.nodeArray.length; scanIndex++) {
		var node = tree.nodeArray[scanIndex];
		var reason = honeycomb.progression.refuseReason(selection, node.index);
		var rank = honeycomb.progression.rankOf(selection.characterIndex, node.index);
		var maximum = honeycomb.progression.rankMaximum(node);
		result.push({
			node: node,
			rank: rank,
			rankMaximum: maximum,
			selected: rank > 0,
			available: reason == null,
			reason: reason,
			cost: honeycomb.progression.nodeCost(node, Math.min(rank + 1, maximum)),
			excludedBy: honeycomb.progression.excludedBy(selection, node),
			sealed: reason == "unreachable" && honeycomb.progression.pathTo(selection, node.index) == null,
		});
	}
	return result;
};

//What has been spent on one character's tree: the ledger for every rank it covers, and the listed
//price for any rank bought before the ledger existed.
honeycomb.progression.spentOn = function (characterIndex) {
	var selectedArray = honeycomb.progression.selectionArray(characterIndex);
	var ledger = honeycomb.progression.paidLedger(characterIndex);
	var unmatchedArray = ledger.slice();
	var total = 0;
	var rankSoFar = {};
	for (var scanIndex = 0; scanIndex < selectedArray.length; scanIndex++) {
		var nodeIndex = selectedArray[scanIndex];
		rankSoFar[nodeIndex] = (rankSoFar[nodeIndex] == null ? 0 : rankSoFar[nodeIndex]) + 1;
		var matched = false;
		for (var ledgerIndex = 0; ledgerIndex < unmatchedArray.length; ledgerIndex++) {
			if (unmatchedArray[ledgerIndex].node != nodeIndex) continue;
			total += unmatchedArray[ledgerIndex].personal + unmatchedArray[ledgerIndex].global;
			unmatchedArray.splice(ledgerIndex, 1);
			matched = true;
			break;
		}
		if (matched == false) total += honeycomb.progression.baseNodeCost(characterIndex, nodeIndex, rankSoFar[nodeIndex]);
	}
	return total;
};

//---------------------------------------------------------------------------------------------------
//The way to a node
//---------------------------------------------------------------------------------------------------
//The fewest nodes that would have to be bought before `nodeIndex` could be, or null when nothing can
//open it any more (an exclusive choice has shut every route). Returns
//  {stepCount, nodeIndexArray, edgeArray}
//where nodeIndexArray is every untaken node on ANY of the shortest routes, the target included, and
//edgeArray is every connection those routes walk, as {from, to}. Ties are kept rather than broken, so
//two equally short routes both light up -- the player is choosing between them.
//
//An `any` node takes its cheapest prerequisite; a `requiresAll` node needs every one. A rank
//requirement needs the missing ranks as well. Conditions are not paths and are ignored here.
honeycomb.progression.pathTo = function (selection, nodeIndex) {
	var tree = honeycomb.progression.treeFor(selection);
	if (tree == null) return null;
	var characterIndex = selection.characterIndex;
	var memo = {};
	var visiting = {};

	var merge = function (target, source) {
		for (var nodeScan = 0; nodeScan < source.nodeIndexArray.length; nodeScan++) {
			if (target.nodeIndexArray.indexOf(source.nodeIndexArray[nodeScan]) < 0) target.nodeIndexArray.push(source.nodeIndexArray[nodeScan]);
		}
		for (var edgeScan = 0; edgeScan < source.edgeArray.length; edgeScan++) {
			var edge = source.edgeArray[edgeScan];
			var known = false;
			for (var knownScan = 0; knownScan < target.edgeArray.length; knownScan++) {
				if (target.edgeArray[knownScan].from == edge.from && target.edgeArray[knownScan].to == edge.to) { known = true; break; }
			}
			if (known == false) target.edgeArray.push(edge);
		}
	};

	var solveRequirement;
	var solve = function (index) {
		if (memo.hasOwnProperty(index)) return memo[index];
		var node = honeycomb.findDefinition(tree.nodeArray, index);
		if (node == null || visiting[index] == true) return null;
		if (honeycomb.progression.isSelected(characterIndex, index) == true) {
			return { stepCount: 0, nodeIndexArray: [], edgeArray: [] };
		}
		if (honeycomb.progression.excludedBy(selection, node) != null) { memo[index] = null; return null; }
		visiting[index] = true;

		var result = { stepCount: 1, nodeIndexArray: [index], edgeArray: [] };
		var requirementArray = node.requiresArray == null ? [] : node.requiresArray;
		if (requirementArray.length > 0 && node.requiresAll == true) {
			for (var allIndex = 0; allIndex < requirementArray.length && result != null; allIndex++) {
				var part = solveRequirement(requirementArray[allIndex]);
				if (part == null) { result = null; break; }
				result.stepCount += part.stepCount;
				merge(result, part);
				result.edgeArray.push({ from: honeycomb.progression.requirementIndex(requirementArray[allIndex]), to: index });
			}
		} else if (requirementArray.length > 0) {
			var best = Infinity;
			var tiedArray = [];
			for (var anyIndex = 0; anyIndex < requirementArray.length; anyIndex++) {
				var option = solveRequirement(requirementArray[anyIndex]);
				if (option == null) continue;
				if (option.stepCount < best) { best = option.stepCount; tiedArray = []; }
				if (option.stepCount === best) tiedArray.push({ entry: requirementArray[anyIndex], path: option });
			}
			if (tiedArray.length === 0) result = null;
			else {
				result.stepCount += best;
				for (var tieIndex = 0; tieIndex < tiedArray.length; tieIndex++) {
					merge(result, tiedArray[tieIndex].path);
					result.edgeArray.push({ from: honeycomb.progression.requirementIndex(tiedArray[tieIndex].entry), to: index });
				}
			}
		}

		delete visiting[index];
		memo[index] = result;
		return result;
	};

	//One prerequisite: nothing to do once enough ranks are held; otherwise the way to the node plus
	//however many further ranks the requirement asks for.
	solveRequirement = function (entry) {
		var requiredIndex = honeycomb.progression.requirementIndex(entry);
		var needed = honeycomb.progression.requirementRank(entry);
		var held = honeycomb.progression.rankOf(characterIndex, requiredIndex);
		if (held >= needed) return { stepCount: 0, nodeIndexArray: [], edgeArray: [] };
		var reach = solve(requiredIndex);
		if (reach == null) return null;
		var extraRanks = needed - Math.max(held, 1);
		return {
			stepCount: reach.stepCount + extraRanks,
			nodeIndexArray: reach.nodeIndexArray.length > 0 ? reach.nodeIndexArray : [requiredIndex],
			edgeArray: reach.edgeArray,
		};
	};

	return solve(nodeIndex);
};

//Why a node is greyed, in words.
honeycomb.progressionRefusalArray = [
	{ index: "taken", text: "Taken. Right-click or hold to give it back." },
	{ index: "maxed", text: "At its highest rank. Right-click or hold to give a rank back." },
	{ index: "excluded", text: "Locked by the choice beside it." },
	{ index: "unreachable", text: "Take a connected node first." },
	{ index: "cost", text: "Not enough Experience." },
	{ index: "condition", text: "Not available yet." },
	{ index: "missing", text: "Locked by this outfit." },
];

honeycomb.progression.refusalText = function (reasonIndex) {
	var mapping = honeycomb.findDefinition(honeycomb.progressionRefusalArray, reasonIndex);
	return mapping == null ? "" : mapping.text;
};

//The same, specific to one node where the generic sentence would be vague: WHICH choice locked it, and
//whether anything can still open it.
honeycomb.progression.describeRefusal = function (view) {
	if (view == null || view.reason == null) return "";
	if (view.reason == "excluded" && view.excludedBy != null) {
		return "Locked: " + view.excludedBy.name + " was chosen instead. Give it back to open this.";
	}
	if (view.sealed == true) return "Sealed off by an earlier choice.";
	return honeycomb.progression.refusalText(view.reason);
};


//===================================================================================================
//UNLOCKS
//===================================================================================================
//Outfits, equipment and characters are all unlockable, and all three were being answered differently:
//outfits had a bespoke check on the teambuilding screen, equipment had a profile array nothing read or
//wrote, and characters had a flag on the definition. One registry now answers all of them.
//
//A KIND says where its ledger lives on the profile and how to find the definition being asked about.
//Adding a fourth unlockable thing is a table entry.
//
//`unlockedFromStart` on the definition still wins outright, so content that is meant to be available
//from the first run says so where it is defined rather than in a save file.
honeycomb.unlockKindArray = [
	{
		index: "outfit",
		//Outfits are per character, so the ledger is keyed by character index.
		perCharacter: true,
		ledgerName: "unlockedOutfitArray",
		findDefinition: function (index, characterIndex) {
			var character = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
			return honeycomb.findOutfit(character, index);
		},
		allArray: function (characterIndex) {
			var character = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
			return character == null ? [] : character.outfitArray;
		},
	},
	{
		index: "equipment",
		//Equipment is shared: unlocking a Whetstone unlocks it for the whole roster.
		perCharacter: false,
		ledgerName: "unlockedEquipmentArray",
		findDefinition: function (index) { return honeycomb.findDefinition(honeycomb.equipmentArray, index); },
		allArray: function () { return honeycomb.equipmentArray; },
	},
	{
		index: "character",
		perCharacter: false,
		ledgerName: "unlockedCharacterArray",
		findDefinition: function (index) { return honeycomb.findDefinition(honeycomb.characterArray, index); },
		//The shipped roster, not the table: the tracker's "found of total" reads this list, and must not
		//count a character nobody can be told about, since the ledger is what reveals an in-development
		//character (honeycomb.shippedCharacterArray). The debug panel's "unlock all" reads it too and
		//therefore skips her here; it grants in-development characters by name instead
		//(honeycomb.debug.unlockAll), which is a developer's tool and says so.
		allArray: function () { return honeycomb.shippedCharacterArray(); },
	},
];

honeycomb.unlocks = {};

//The list of unlocked indices for a kind, created on demand so a save written before a kind existed
//picks it up with no migration.
honeycomb.unlocks.ledgerFor = function (kindIndex, characterIndex) {
	var kind = honeycomb.findDefinition(honeycomb.unlockKindArray, kindIndex);
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (kind == null || profile == null) return null;

	//The shape is checked rather than assumed. A save written before a kind changed shape would
	//otherwise reach the callers as the wrong type and fail somewhere far from here.
	if (kind.perCharacter != true) {
		if (Array.isArray(profile[kind.ledgerName]) == false) profile[kind.ledgerName] = [];
		return profile[kind.ledgerName];
	}
	if (profile[kind.ledgerName] == null || Array.isArray(profile[kind.ledgerName]) == true) {
		profile[kind.ledgerName] = {};
	}
	if (Array.isArray(profile[kind.ledgerName][characterIndex]) == false) {
		profile[kind.ledgerName][characterIndex] = [];
	}
	return profile[kind.ledgerName][characterIndex];
};

honeycomb.unlocks.isUnlocked = function (kindIndex, index, characterIndex) {
	var kind = honeycomb.findDefinition(honeycomb.unlockKindArray, kindIndex);
	if (kind == null) return false;
	//The definition's own flag wins: content meant to be available from the first run says so where it
	//is defined, and never depends on a save file being right.
	var definition = kind.findDefinition(index, characterIndex);
	if (definition != null && definition.unlockedFromStart == true) return true;
	var ledger = honeycomb.unlocks.ledgerFor(kindIndex, characterIndex);
	return ledger != null && ledger.indexOf(index) >= 0;
};

//Records an unlock. Returns whether it was new, so a screen can announce it rather than the player
//having to notice.
honeycomb.unlocks.grant = function (kindIndex, index, characterIndex) {
	if (honeycomb.unlocks.isUnlocked(kindIndex, index, characterIndex) == true) return false;
	var ledger = honeycomb.unlocks.ledgerFor(kindIndex, characterIndex);
	if (ledger == null) return false;
	ledger.push(index);
	//An unlock is a discovery too, and pays into the shared pool. A kind with no discovery row of the
	//same name simply pays nothing -- record() refuses an unknown kind.
	var kind = honeycomb.findDefinition(honeycomb.unlockKindArray, kindIndex);
	var discoveryKey = kind != null && kind.perCharacter == true ? characterIndex + "/" + index : index;
	honeycomb.discovery.record(kindIndex, discoveryKey, null);
	return true;
};

//How many of a kind are unlocked, and how many exist. The tracker line.
honeycomb.unlocks.progress = function (kindIndex, characterIndex) {
	var kind = honeycomb.findDefinition(honeycomb.unlockKindArray, kindIndex);
	if (kind == null) return { found: 0, total: 0 };
	var allArray = kind.allArray(characterIndex);
	var found = 0;
	for (var scanIndex = 0; scanIndex < allArray.length; scanIndex++) {
		if (honeycomb.unlocks.isUnlocked(kindIndex, allArray[scanIndex].index, characterIndex) == true) found += 1;
	}
	return { found: found, total: allArray.length };
};

//Applies every unlock a character's chosen progression nodes name. A node may carry `unlockOutfit` or
//`unlockEquipment`; this is what makes those fields mean something rather than sit unread.
honeycomb.unlocks.applyProgression = function (characterIndex) {
	var granted = [];
	var selection = { characterIndex: characterIndex, outfitIndex: null, equipmentArray: [] };
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	if (definition == null || definition.progressionTree == null) return granted;

	//Read from the character's WHOLE tree rather than the outfit-filtered one: an unlock the player
	//has paid for should not disappear because they changed costume.
	var selectedArray = honeycomb.progression.selectionArray(characterIndex);
	for (var scanIndex = 0; scanIndex < selectedArray.length; scanIndex++) {
		var node = honeycomb.findDefinition(definition.progressionTree.nodeArray, selectedArray[scanIndex]);
		if (node == null) continue;
		if (node.unlockOutfit != null &&
			honeycomb.unlocks.grant("outfit", node.unlockOutfit, characterIndex) == true) {
			granted.push({ kind: "outfit", index: node.unlockOutfit });
		}
		if (node.unlockEquipment != null &&
			honeycomb.unlocks.grant("equipment", node.unlockEquipment) == true) {
			granted.push({ kind: "equipment", index: node.unlockEquipment });
		}
	}
	return granted;
};

//---------------------------------------------------------------------------------------------------
//Rest sites (NODES-LIST §D)
//---------------------------------------------------------------------------------------------------
//A campfire's menu is built at open time from `honeycomb.restOptionArray`: the always-available base
//rows, plus one row for every character whose Rest1 (while in the party) or Rest2 (even benched) node
//names a `restOption`. Actions limit how many rows may be taken; Rest-A buys one more. The debug tool
//opens every row with a large action budget.
honeycomb.rest = {
	actionsRemaining: 0,
	debugUnlockAll: false,
	debugActions: null,
	//Set when Mail Order opens the shop from a rest, so leaving the shop returns to the fire.
	pendingShopReturn: false,
	//True while a campfire is open. Soothing (Cinder) reads it to tell a rest heal from any other heal.
	active: false,
};

//How many actions this rest grants: the base, plus any party-wide Rest-A bonus.
honeycomb.rest.actionsMaximum = function () {
	return honeycomb.tuning.rest.actionsBase + honeycomb.partyFieldTotal("restActionsBonus");
};

//Whether a character's selected nodes name `optionIndex` with a `restOption`, optionally only a node
//whose index ends with `suffix` (used to tell Rest1 from Rest2).
honeycomb.rest.nodeNamesOption = function (characterIndex, optionIndex, suffix) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	if (definition == null || definition.progressionTree == null) return false;
	var selectedArray = honeycomb.progression.selectionArray(characterIndex);
	for (var scanIndex = 0; scanIndex < selectedArray.length; scanIndex++) {
		var node = honeycomb.findDefinition(definition.progressionTree.nodeArray, selectedArray[scanIndex]);
		if (node == null || node.restOption != optionIndex) continue;
		if (suffix == null || node.index.slice(-suffix.length) == suffix) return true;
	}
	return false;
};

//The rest options a character's selected Rest1/Rest2 nodes name.
honeycomb.rest.optionIndexArray = function (characterIndex) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	if (definition == null || definition.progressionTree == null) return [];
	var selectedArray = honeycomb.progression.selectionArray(characterIndex);
	var result = [];
	for (var scanIndex = 0; scanIndex < selectedArray.length; scanIndex++) {
		var node = honeycomb.findDefinition(definition.progressionTree.nodeArray, selectedArray[scanIndex]);
		if (node != null && node.restOption != null && result.indexOf(node.restOption) < 0) result.push(node.restOption);
	}
	return result;
};

//Whether a character is in the party as it stands.
honeycomb.rest.isFielded = function (characterIndex) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.partyArray == null) return false;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		if (run.partyArray[memberIndex].characterIndex == characterIndex) return true;
	}
	return false;
};

//The option indices on the menu: every base row, every character option whose node is selected (Rest1
//fielded, Rest2 always), and the whole table under the debug flag.
honeycomb.rest.unlockedIndexArray = function () {
	var result = [];
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	for (var scanIndex = 0; scanIndex < honeycomb.restOptionArray.length; scanIndex++) {
		var option = honeycomb.restOptionArray[scanIndex];
		if (option.base == true || honeycomb.rest.debugUnlockAll == true) { result.push(option.index); continue; }
		if (profile == null || profile.progressionArray == null) continue;
		var unlocked = false;
		for (var characterIndex in profile.progressionArray) {
			if (Object.prototype.hasOwnProperty.call(profile.progressionArray, characterIndex) == false) continue;
			if (honeycomb.rest.nodeNamesOption(characterIndex, option.index, null) == false) continue;
			if (honeycomb.rest.nodeNamesOption(characterIndex, option.index, "Rest2") == true ||
				honeycomb.rest.isFielded(characterIndex) == true) { unlocked = true; break; }
		}
		if (unlocked == true) result.push(option.index);
	}
	return result;
};

//Whether anybody in the party is Broken, which is what the `tend` row waits for.
honeycomb.rest.partyIsBroken = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.partyArray == null) return false;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		if (run.partyArray[memberIndex].broken == true) return true;
	}
	return false;
};

//Reset the action budget. Called when a rest opens. The debug override wins over the tree's own count.
honeycomb.rest.begin = function () {
	honeycomb.rest.actionsRemaining = honeycomb.rest.debugActions == null
		? honeycomb.rest.actionsMaximum() : honeycomb.rest.debugActions;
	honeycomb.rest.active = true;
};

//Drop the debug overrides, so the next ordinary rest is the real thing. Called when a rest is left.
honeycomb.rest.endDebug = function () {
	honeycomb.rest.debugUnlockAll = false;
	honeycomb.rest.debugActions = null;
	honeycomb.rest.pendingShopReturn = false;
	honeycomb.rest.active = false;
};

//The campfire's choice list, built from the unlocked table rows plus a way out. `endsRest` marks the
//row that closes the event.
honeycomb.rest.choiceArray = function () {
	var result = [];
	var unlockedArray = honeycomb.rest.unlockedIndexArray();
	var broken = honeycomb.rest.partyIsBroken();
	for (var scanIndex = 0; scanIndex < unlockedArray.length; scanIndex++) {
		var option = honeycomb.findDefinition(honeycomb.restOptionArray, unlockedArray[scanIndex]);
		if (option == null) continue;
		if (option.brokenOnly == true && broken == false) continue;
		result.push({
			text: option.text,
			previewText: option.previewText,
			effectArray: option.effectArray,
			resultText: option.resultText,
			restOption: option.index,
		});
	}
	result.push({
		text: "Move on", previewText: "Put out the fire and leave.",
		effectArray: [], resultText: "You put the fire out and go.", endsRest: true,
	});
	return result;
};
