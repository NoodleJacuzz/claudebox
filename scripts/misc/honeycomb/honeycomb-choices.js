//===================================================================================================
//HONEYCOMB CATACOMBS -- choices: effect resolution that can stop and ask
//===================================================================================================
//"Choose a card to exhaust." "Pick one of three blessings." An effect that has to ask the player a
//question halfway through resolving is a large slice of design space, and the engine could not do it:
//resolution is a synchronous recursive walk, and a UI answer arrives some seconds later.
//
//THE MECHANISM: ASK, REWIND, REPLAY.
//
//  1. An effect calls honeycomb.requestChoice. Each request during one resolution has a POSITION --
//     first question, second question, and so on.
//  2. If an answer for that position is already on hand, the request returns it and resolution simply
//     continues. This is the normal case on every pass after the first.
//  3. If it is not, the request records what it needs and resolution UNWINDS: every effect becomes a
//     no-op once a question is pending, so nothing further happens.
//  4. The caller restores the state snapshot it took before resolving, so the half-finished attempt
//     leaves no trace, and shows the question.
//  5. The answer is appended to the list, and the WHOLE effect list runs again from the start. This
//     time step 2 answers the first question, and resolution reaches the second question, or the end.
//
//WHY THIS SHAPE, AND NOT CONTINUATIONS.
//Rewriting the effect layer into continuation-passing style would make `repeat`, `branch` and
//`forEachTarget` -- and every future nesting effect -- responsible for being resumable. Every new
//effect would inherit that obligation. Replay costs one extra pass per question over an effect list
//that is a handful of entries long, and in exchange NOTHING in the effect layer has to know that
//choices exist.
//
//It works here because of two properties this engine already guarantees for other reasons:
//  * State is fully serialisable -- the same property that makes a mid-combat save work.
//  * RNG is (seed, calls) per named stream -- so a replayed pass draws exactly the same numbers, and
//    a card that rolls damage and then asks a question does not reroll it on the way back.
//Neither was added for this. Both were already load-bearing, which is why replay is safe.
window.honeycomb = window.honeycomb || {};

//---------------------------------------------------------------------------------------------------
//Choice bookkeeping
//---------------------------------------------------------------------------------------------------
//Shared by a context and every child context beneath it, because a question asked inside a `repeat`
//is the same conversation as one asked outside it. honeycomb.childContext copies the reference.
honeycomb.newChoiceState = function (answerArray) {
	return {
		//Answers already given, in the order the questions were asked.
		answerArray: answerArray == null ? [] : answerArray.slice(),
		//How many questions this pass has asked so far. Reset every pass; the position of a question
		//is what pairs it with its answer.
		counter: 0,
		//The unanswered question, once one is reached. Its presence halts resolution.
		pending: null,
	};
};

//Asks a question, or answers it from the record.
//
//`request` describes what is being asked. Shape:
//  index         which honeycomb.choiceKindArray entry decides how it is presented
//  prompt        the question, as text
//  minimum       how many must be chosen. 0 makes the choice skippable
//  maximum       how many may be chosen
//  ...           whatever else the kind needs -- `pile`, `filter`, `optionArray`
//
//Returns the answer, or null when the question is new. An effect that gets null must do nothing:
//the pass is being abandoned and will be run again once the answer exists.
honeycomb.requestChoice = function (context, request) {
	var state = context.choiceState;
	if (state == null) {
		console.error("Honeycomb: an effect asked a question outside a resolution that can answer it");
		return null;
	}

	var position = state.counter;
	state.counter += 1;

	if (position < state.answerArray.length) return state.answerArray[position];

	//A question with exactly as many possible answers as it needs is not a question: Whetted Edge with
	//one other card in hand simply takes that card. Recorded like any other answer, so a later question
	//in the same list replays it rather than asking again.
	var automatic = honeycomb.automaticAnswer(request);
	if (automatic != null) {
		state.answerArray.push(automatic);
		return automatic;
	}

	state.pending = { position: position, request: request };
	return null;
};

//The answer a card question gives itself, or null when the player has a real choice to make. Only card
//picks answer themselves; an option is always offered, since choosing it IS the decision.
honeycomb.automaticAnswer = function (request) {
	var kind = honeycomb.choiceKind(request);
	if (kind == null || kind.targetKind != "card" || request.minimum == null || request.minimum <= 0) return null;
	if (request.askEvenIfForced == true) return null;
	var entryArray = kind.gather(request);
	//No more candidates than the pick needs: take them all, including none. An empty hand must not
	//leave "discard a card" waiting on a question that has no answer (AUDIT-01).
	if (entryArray.length > request.minimum) return null;
	var chosenArray = [];
	for (var scanIndex = 0; scanIndex < entryArray.length; scanIndex++) chosenArray.push(entryArray[scanIndex].index);
	return { chosenArray: chosenArray, automatic: true };
};

//True once a question is waiting. Every effect checks this and stands down.
honeycomb.choicePending = function (context) {
	return context != null && context.choiceState != null && context.choiceState.pending != null;
};

//---------------------------------------------------------------------------------------------------
//Snapshot and rewind
//---------------------------------------------------------------------------------------------------
//The whole state, cloned. Cheap enough at this scale, and exact by construction: honeycomb.state is
//required to be plain serialisable data, which is the same rule that makes saving work.
honeycomb.snapshotState = function () {
	return honeycomb.state == null ? null : JSON.stringify(honeycomb.state);
};

//Puts the world back. Callers must re-read anything they were holding: honeycomb.state is REPLACED,
//so a `var run = honeycomb.state.run` taken before the restore points at the abandoned copy.
honeycomb.restoreState = function (snapshot) {
	if (snapshot == null) return false;
	try {
		honeycomb.state = JSON.parse(snapshot);
		return true;
	} catch (parseError) {
		console.error("Honeycomb: could not rewind state after a choice", parseError);
		return false;
	}
};

//---------------------------------------------------------------------------------------------------
//Running an effect list that may ask questions
//---------------------------------------------------------------------------------------------------
//The single entry point for anything that resolves effects on the player's behalf: playing a card,
//using an ability, taking an event choice.
//
//settings:
//  answerArray   answers already collected, from a previous attempt
//  buildContext  function returning a FRESH context. Called once per pass, AFTER any rewind, because
//                a pass must never reuse entity references from an abandoned copy of the state.
//  effectArray   what to resolve, for the simple case
//  run           function(context) doing the work, for a caller that does more than resolve a list.
//                Playing a card spends energy, moves the card out of the hand, fires hooks and files
//                the card away afterwards; all of that has to be inside the replayed region, or a
//                rewound pass would leave the energy spent.
//
//Returns either
//  {complete: true, context: ...}                        resolution finished
//  {complete: false, choice: request, answerArray: ...}   a question is waiting
honeycomb.resolveWithChoices = function (settings) {
	var snapshot = honeycomb.snapshotState();
	var context = settings.buildContext();
	context.choiceState = honeycomb.newChoiceState(settings.answerArray);

	if (typeof settings.run === "function") settings.run(context);
	else honeycomb.resolveEffectArray(settings.effectArray, context);

	if (context.choiceState.pending == null) return { complete: true, context: context };

	//Abandon the pass. Nothing it did survives, which is what makes asking safe from any depth.
	var pending = context.choiceState.pending;
	honeycomb.restoreState(snapshot);
	return {
		complete: false,
		choice: pending.request,
		position: pending.position,
		answerArray: context.choiceState.answerArray,
	};
};

//---------------------------------------------------------------------------------------------------
//Choice kinds
//---------------------------------------------------------------------------------------------------
//What a question is ABOUT, and how the overlay should show it. A new kind of question is a table entry
//plus, if it needs one, a renderer.
//
//  gather(request)   the things that may be chosen, as {index, kind, ...}. Cards carry `instanceId`.
//  render(entry)     markup for one choosable thing
//  emptyText         shown when nothing qualifies
honeycomb.choiceKindArray = [
	{
		index: "handCard",
		name: "a card in hand",
		targetKind: "card",
		gather: function (request) {
			var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
			if (combat == null) return [];
			return honeycomb.choiceCardEntryArray(combat.handArray, request);
		},
		emptyText: "No card in hand qualifies.",
	},
	{
		index: "discardPileCard",
		name: "a card in the discard pile",
		targetKind: "card",
		gather: function (request) {
			var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
			if (combat == null) return [];
			return honeycomb.choiceCardEntryArray(combat.discardPileArray, request);
		},
		emptyText: "The discard pile is empty.",
	},
	{
		index: "drawPileCard",
		name: "a card in the draw pile",
		targetKind: "card",
		gather: function (request) {
			var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
			if (combat == null) return [];
			//`limit` shows only the TOP of the pile, which is what Scry needs: the top card is index 0.
			var idArray = request.limit == null ? combat.drawPileArray : combat.drawPileArray.slice(0, request.limit);
			return honeycomb.choiceCardEntryArray(idArray, request);
		},
		emptyText: "The draw pile is empty.",
	},
	{
		index: "deckCard",
		name: "a card in your deck",
		targetKind: "card",
		//The permanent deck rather than a combat pile, so an event may edit a run without a fight.
		gather: function (request) {
			var run = honeycomb.state.run;
			if (run == null) return [];
			var idArray = [];
			for (var cardIndex = 0; cardIndex < run.deckArray.length; cardIndex++) {
				idArray.push(run.deckArray[cardIndex].instanceId);
			}
			return honeycomb.choiceCardEntryArray(idArray, request);
		},
		emptyText: "Your deck is empty.",
	},
	{
		index: "cardOffer",
		name: "a card",
		targetKind: "card",
		//A SPECIFIC set of cards named on the request, drawn as CARDS. This is what Journal offers: a card
		//the player does not hold yet must be picked as a card, not from a list of names.
		gather: function (request) {
			var result = [];
			var cardIndexArray = request.cardIndexArray == null ? [] : request.cardIndexArray;
			for (var scanIndex = 0; scanIndex < cardIndexArray.length; scanIndex++) {
				var resolved = honeycomb.resolveCard({ instanceId: null, cardIndex: cardIndexArray[scanIndex],
					ownerInstanceId: null, upgradeLevel: 0 });
				if (resolved == null) continue;
				result.push({ index: cardIndexArray[scanIndex], instanceId: null, card: resolved, banishable: true });
			}
			return result;
		},
		emptyText: "No cards to study.",
	},
	{
		index: "ally",
		name: "a party member",
		//An ENTITY choice: the overlay draws each as a portrait with a health bar, which is what a
		//"heal a chosen ally" wants to show. `index` IS the instance id.
		targetKind: "entity",
		gather: function (request) {
			var run = honeycomb.state.run;
			if (run == null) return [];
			var result = [];
			for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
				var member = run.partyArray[memberIndex];
				if (member.downed == true) continue;
				if (request.excludeInstanceId != null && member.instanceId == request.excludeInstanceId) continue;
				//`healFraction` previews what the chosen ally would gain, drawn under the portrait.
				var note = null;
				if (request.healFraction != null && request.healFraction > 0) {
					note = "+" + Math.round(member.maxHealth * request.healFraction) + " HP";
				}
				result.push({ index: member.instanceId, instanceId: member.instanceId, entity: member, note: note });
			}
			return result;
		},
		emptyText: "No ally qualifies.",
	},
	{
		index: "option",
		name: "an option",
		targetKind: "option",
		//Free-form choices written on the request itself, so an effect can offer anything at all.
		//Each option is {index, name, description, iconPath, effectArray}.
		gather: function (request) {
			var result = [];
			var optionArray = request.optionArray == null ? [] : request.optionArray;
			for (var scanIndex = 0; scanIndex < optionArray.length; scanIndex++) {
				var option = optionArray[scanIndex];
				//An option may gate itself, so a choice can offer only what is currently possible. The
				//acting source is carried, so a condition can ask about the player's own meter (Nettle's
				//"pay 3 Souls") rather than only source-independent things.
				if (option.condition != null &&
					honeycomb.testCondition(option.condition, honeycomb.newEffectContext({ source: request.source })) == false) continue;
				result.push(option);
			}
			return result;
		},
		emptyText: "Nothing is available.",
	},
	{
		index: "ally",
		name: "an ally",
		targetKind: "entity",
		gather: function () {
			var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
			var allyArray = honeycomb.livingEntityArray("ally", combat);
			var result = [];
			for (var scanIndex = 0; scanIndex < allyArray.length; scanIndex++) {
				result.push({ index: allyArray[scanIndex].instanceId, entity: allyArray[scanIndex] });
			}
			return result;
		},
		emptyText: "Nobody is standing.",
	},
];

//Turns a list of card instance ids into choosable entries, honouring the request's filter.
honeycomb.choiceCardEntryArray = function (instanceIdArray, request) {
	var result = [];
	for (var scanIndex = 0; scanIndex < instanceIdArray.length; scanIndex++) {
		var instanceId = instanceIdArray[scanIndex];
		var instance = honeycomb.combat.cardInstance(instanceId);
		var resolved = instance == null ? null : honeycomb.resolveCard(instance);
		if (resolved == null) continue;
		if (honeycomb.choiceCardExcluded(instance, resolved, request) == true) continue;
		result.push({ index: instanceId, instanceId: instanceId, card: resolved });
	}
	return result;
};

//Which cards a request refuses. Every filter is optional, and they stack.
honeycomb.choiceCardExcluded = function (instance, resolved, request) {
	if (request.cardType != null && honeycomb.cardHasType(resolved, request.cardType) == false) return true;
	if (request.cardTypeAnyArray != null) {
		var matchesAny = false;
		for (var typeIndex = 0; typeIndex < request.cardTypeAnyArray.length; typeIndex++) {
			if (honeycomb.cardHasType(resolved, request.cardTypeAnyArray[typeIndex]) == true) { matchesAny = true; break; }
		}
		if (matchesAny == false) return true;
	}
	if (request.cardTag != null && honeycomb.definitionHasTag(resolved, request.cardTag) == false) return true;
	if (request.excludeInstanceId != null && instance.instanceId == request.excludeInstanceId) return true;
	//A card is upgradeable while the ladder it is on has a rung left -- its own path's, for a card that
	//offers several.
	if (request.upgradeableOnly == true && honeycomb.cardUpgradesRemaining(instance) <= 0) return true;
	//Fortune Telling only touches starters; Gamble only touches everything else.
	if (request.starterOnly == true && resolved.rarity != "starter") return true;
	if (request.nonStarterOnly == true && resolved.rarity == "starter") return true;
	//Ordinary removal cannot take a card that says so (Dread). See honeycomb.cardIsRemovable.
	if (request.removableOnly == true && honeycomb.cardIsRemovable(instance) == false) return true;
	return false;
};

honeycomb.choiceKind = function (request) {
	return honeycomb.findDefinition(honeycomb.choiceKindArray, request == null ? null : request.index);
};

//---------------------------------------------------------------------------------------------------
//The effects that ask
//---------------------------------------------------------------------------------------------------
//Appended to the shared registry rather than defined in honeycomb-effects.js, so the whole choice
//system is one file that could be lifted out without leaving holes.
honeycomb.effectArray.push(
	{
		index: "chooseCards",
		//Asks the player to pick cards, then resolves a nested effect list ONCE PER CHOSEN CARD with
		//`chosenCard` bound. That binding is what makes the nested list able to do anything at all to
		//the card, using the ordinary card effects below.
		resolve: function (entry, context) {
			if (honeycomb.choicePending(context) == true) return;

			var answer = honeycomb.requestChoice(context, {
				index: entry.from == null ? "handCard" : entry.from,
				prompt: entry.prompt,
				minimum: entry.minimum == null ? 1 : entry.minimum,
				maximum: entry.maximum == null ? 1 : entry.maximum,
				cardType: entry.cardType,
				//Any of these types (Grifter's Vanishing Act: the symbols in the source's Orb).
				cardTypeAnyArray: entry.cardTypeFromMechanic != null
					? honeycomb.mechanicSymbolArray(context.source, entry.cardTypeFromMechanic) : entry.cardTypeAnyArray,
				cardTag: entry.cardTag,
				upgradeableOnly: entry.upgradeableOnly,
				removableOnly: entry.removableOnly,
				starterOnly: entry.starterOnly,
				nonStarterOnly: entry.nonStarterOnly,
				//A picker for upgrading shows what each card would BECOME before it is committed. On by
				//default wherever only upgradeable cards are offered.
				previewUpgrade: entry.previewUpgrade != null ? entry.previewUpgrade == true : entry.upgradeableOnly == true,
				//A card never offers itself as its own target unless it says so.
				excludeInstanceId: entry.mayChooseSelf == true || context.card == null
					? null : context.card.instanceId,
			});
			if (answer == null) return;

			var chosenArray = answer.chosenArray == null ? [] : answer.chosenArray;
			for (var chosenIndex = 0; chosenIndex < chosenArray.length; chosenIndex++) {
				var childContext = honeycomb.childContext(context);
				childContext.chosenCardId = chosenArray[chosenIndex];
				childContext.targetCardArray = [chosenArray[chosenIndex]];
				honeycomb.resolveEffectArray(entry.effectArray, childContext);
			}
		},
		describe: function (entry) {
			var count = entry.maximum == null ? 1 : entry.maximum;
			//The commonest pick reads as the verb it is: "Discard a card."
			if (entry.effectArray != null && entry.effectArray.length === 1 && entry.effectArray[0].index == "discardCard") {
				return count === 1 ? "Discard a card." : "Discard " + count + " cards.";
			}
			if (entry.effectArray != null && entry.effectArray.length === 1 && entry.effectArray[0].index == "exhaustCard") {
				return count === 1 ? "Exhaust a card." : "Exhaust " + count + " cards.";
			}
			return "Choose " + (count === 1 ? "a card" : count + " cards") + ": " + honeycomb.describeEffectArray(entry.effectArray);
		},
	},

	{
		index: "deckService",
		//Runs a named honeycomb.deckServiceArray entry -- the one shared definition of removing or
		//upgrading a deck card. `prompt` rewords its question for the place offering it; nothing else
		//about the service can be changed from outside, which is the point.
		resolve: function (entry, context) {
			var service = honeycomb.requireDefinition(honeycomb.deckServiceArray, entry.service, "honeycomb.deckServiceArray");
			if (service == null) return;
			var effectArray = [];
			for (var scanIndex = 0; scanIndex < service.effectArray.length; scanIndex++) {
				var copy = {};
				for (var field in service.effectArray[scanIndex]) {
					if (Object.prototype.hasOwnProperty.call(service.effectArray[scanIndex], field)) copy[field] = service.effectArray[scanIndex][field];
				}
				if (entry.prompt != null && copy.prompt != null) copy.prompt = entry.prompt;
				effectArray.push(copy);
			}
			honeycomb.resolveEffectArray(effectArray, context);
		},
		describe: function (entry) {
			var service = honeycomb.findDefinition(honeycomb.deckServiceArray, entry.service);
			return service == null ? "" : service.description;
		},
	},

	{
		index: "chooseOption",
		//A branching question. Each option carries its own effect list, so "pick one of three
		//blessings" is one effect entry and three table rows.
		resolve: function (entry, context) {
			if (honeycomb.choicePending(context) == true) return;

			var answer = honeycomb.requestChoice(context, {
				index: "option",
				prompt: entry.prompt,
				minimum: 1,
				maximum: 1,
				optionArray: entry.optionArray,
				//Lets an option's own `condition` ask about the acting character.
				source: context.source,
			});
			if (answer == null) return;

			var chosenArray = answer.chosenArray == null ? [] : answer.chosenArray;
			for (var chosenIndex = 0; chosenIndex < chosenArray.length; chosenIndex++) {
				var option = honeycomb.findDefinition(entry.optionArray, chosenArray[chosenIndex]);
				if (option == null) continue;
				honeycomb.logEvent(context, { type: "optionChosen", option: option.index, text: option.name });
				honeycomb.resolveEffectArray(option.effectArray, honeycomb.childContext(context));
			}
		},
		describe: function (entry) {
			//An option's own `description` is what the choice offers, so the card prints the effects
			//rather than a list of option names, e.g. "Choose one: Hold, Breathe."
			var pieceArray = [];
			var list = entry.optionArray == null ? [] : entry.optionArray;
			for (var scanIndex = 0; scanIndex < list.length; scanIndex++) {
				var option = list[scanIndex];
				var text = option.description != null ? String(option.description)
					: honeycomb.describeEffectArray(option.effectArray);
				text = text.replace(/\.\s*$/, "");
				if (scanIndex === 0 && text.length > 0) text = text.charAt(0).toLowerCase() + text.slice(1);
				pieceArray.push(text);
			}
			if (pieceArray.length === 0) return "";
			return "Choose one: " + pieceArray.join(", or ") + ".";
		},
	},

	{
		index: "chooseAlly",
		//Asks which party member, then runs a nested list with that member as the target. Shown through
		//the ordinary option chooser, so Treatment names an ally without a bespoke entity picker.
		resolve: function (entry, context) {
			if (honeycomb.choicePending(context) == true) return;
			var run = honeycomb.state == null ? null : honeycomb.state.run;
			if (run == null) return;
			//The `ally` option kind renders each candidate as a portrait with a health bar. `previewFraction`
			//adds the amount a heal of that share of maximum health would give.
			var answer = honeycomb.requestChoice(context, {
				index: "ally",
				prompt: entry.prompt == null ? "Choose an ally." : entry.prompt,
				minimum: 1, maximum: 1,
				healFraction: entry.previewFraction == null ? null : honeycomb.resolveValue(entry.previewFraction, context),
			});
			if (answer == null) return;
			var chosenId = answer.chosenArray == null || answer.chosenArray.length === 0 ? null : answer.chosenArray[0];
			if (chosenId == null) return;
			var chosen = null;
			for (var scanIndex = 0; scanIndex < run.partyArray.length; scanIndex++) {
				if (run.partyArray[scanIndex].instanceId == chosenId) { chosen = run.partyArray[scanIndex]; break; }
			}
			if (chosen == null) return;
			var childContext = honeycomb.childContext(context);
			childContext.target = chosen;
			childContext.targetArray = [chosen];
			honeycomb.resolveEffectArray(entry.effectArray, childContext);
		},
		describe: function (entry) { return "Choose an ally: " + honeycomb.describeEffectArray(entry.effectArray); },
	},

	{
		index: "journalOffer",
		//Offers `count` cards the player does not own, one of which gains reward weight for the run. Uses
		//the option chooser so the cards can be shown as cards, and records the pick on the profile.
		resolve: function (entry, context) {
			if (honeycomb.choicePending(context) == true) return;
			var count = honeycomb.resolveValue(entry.count == null ? 1 : entry.count, context);
			var run = honeycomb.state == null ? null : honeycomb.state.run;
			//Cards the run already holds are excluded, since they are not cards the player lacks.
			var heldMap = {};
			for (var heldIndex = 0; run != null && run.deckArray != null && heldIndex < run.deckArray.length; heldIndex++) {
				heldMap[run.deckArray[heldIndex].cardIndex] = true;
			}
			var unknownArray = [];
			var droppableArray = [];
			for (var cardIndex = 0; cardIndex < honeycomb.cardArray.length; cardIndex++) {
				var card = honeycomb.cardArray[cardIndex];
				if (["starter", "enemy", "broken", "special"].indexOf(card.rarity) >= 0) continue;
				if (heldMap[card.index] == true) continue;
				//A banished card is not offered by the journal either.
				if (honeycomb.cardIsBanished(card.index) == true) continue;
				droppableArray.push(card);
				if (honeycomb.discovery.isKnown("card", card.index) == true) continue;
				unknownArray.push(card);
			}
			//A profile that has already met everything still gets a choice, rather than a dead option.
			if (unknownArray.length < count) {
				for (var fillIndex = 0; fillIndex < droppableArray.length && unknownArray.length < count; fillIndex++) {
					if (unknownArray.indexOf(droppableArray[fillIndex]) < 0) unknownArray.push(droppableArray[fillIndex]);
				}
			}
			// ROTATE BY A PER-VISIT COUNTER. The choice rewind restores the RNG, so without this every visit
			// would offer the same first few cards (and, in cardArray order, always Brienne's). The counter
			// lives on the run and advances on commit, so each rest's Journal shows a different set.
			var visit = run == null || run.journalVisitCount == null ? 0 : run.journalVisitCount;
			var start = unknownArray.length === 0 ? 0 : (visit * count) % unknownArray.length;
			var rotatedArray = unknownArray.slice(start).concat(unknownArray.slice(0, start));
			var shuffledArray = honeycomb.rng.shuffle(honeycomb.tuning.rng.streamArray.mapEvent, rotatedArray);
			var cardIndexArray = [];
			for (var pickIndex = 0; pickIndex < count && pickIndex < shuffledArray.length; pickIndex++) {
				cardIndexArray.push(shuffledArray[pickIndex].index);
			}
			if (cardIndexArray.length === 0) return;
			var answer = honeycomb.requestChoice(context, {
				index: "cardOffer",
				prompt: "Which do you commit to memory?",
				minimum: 1, maximum: 1,
				cardIndexArray: cardIndexArray,
				//Shown under the card once it is picked (the choice overlay draws `note` on the selection).
				note: "(This card will be " + honeycomb.tuning.rest.journalWeightMultiplier +
					"x more likely to appear in post-battle rewards.)",
			});
			if (answer == null) return;
			var chosenId = answer.chosenArray == null || answer.chosenArray.length === 0 ? null : answer.chosenArray[0];
			if (chosenId == null) return;
			if (run != null) run.journalVisitCount = visit + 1;
			var profile = honeycomb.state.profile;
			if (profile.journalCardArray == null) profile.journalCardArray = [];
			if (profile.journalCardArray.indexOf(chosenId) < 0) profile.journalCardArray.push(chosenId);
			honeycomb.logEvent(context, { type: "journal", card: chosenId });
		},
		describe: function (entry) { return "Study unknown cards and favour one in rewards."; },
	}
);

//---------------------------------------------------------------------------------------------------
//The choice overlay
//---------------------------------------------------------------------------------------------------
//One overlay serves every question, because a question is data. `onAnswer` is a function NAME, since
//overlays are built as markup with inline handlers like the rest of the UI.
honeycomb.overlay.register({
	index: "choice",
	build: function (layer, params) {
		var request = params.request;
		var kind = honeycomb.choiceKind(request);
		if (kind == null) { layer.innerHTML = ""; return; }

		var entryArray = kind.gather(request);
		honeycomb.choiceOverlay.entryArray = entryArray;
		honeycomb.choiceOverlay.request = request;
		honeycomb.choiceOverlay.onAnswer = params.onAnswer;
		honeycomb.choiceOverlay.onCancel = params.onCancel;
		honeycomb.choiceOverlay.selectedArray = [];
		honeycomb.choiceOverlay.previewIndex = null;
		honeycomb.choiceOverlay.presentation = honeycomb.choiceOverlay.presentationFor(request);

		//THE SLOT WINDOW lets the screen beneath it take input, because the cards it wants are the real
		//hand, not copies of it in a grid.
		if (honeycomb.choiceOverlay.presentation == "handSlots") {
			layer.classList.add("hcOverlayPassThrough");
			honeycomb.combatScene.beginHandSelection(entryArray);
		}
		layer.innerHTML = honeycomb.choiceOverlay.render();
	},
	teardown: function () {
		if (honeycomb.choiceOverlay.presentation == "handSlots" && honeycomb.combatScene != null) {
			honeycomb.combatScene.endHandSelection();
		}
		honeycomb.choiceOverlay.presentation = null;
	},
});

honeycomb.choiceOverlay = {
	entryArray: [],
	selectedArray: [],
	request: null,
	onAnswer: null,
	onCancel: null,
	presentation: null,
	//The card being shown BEFORE AND AFTER, for a question with previewUpgrade; null while the grid shows.
	previewIndex: null,
};

//Cards picked FROM THE HAND during a fight get the SLOT WINDOW: a small window of empty slots, the
//real hand brought back into focus underneath, and cards dragged -- or tapped -- from the hand into
//the slots. Everything else gets the grid of choices.
honeycomb.choiceOverlay.presentationFor = function (request) {
	if (request != null && request.index == "handCard" && honeycomb.scene.current == "combat" &&
		honeycomb.combatScene != null && document.getElementById("honeycombHand") != null) return "handSlots";
	return "grid";
};

honeycomb.choiceOverlay.render = function () {
	var request = honeycomb.choiceOverlay.request;
	var kind = honeycomb.choiceKind(request);
	var entryArray = honeycomb.choiceOverlay.entryArray;
	if (honeycomb.choiceOverlay.presentation == "handSlots") return honeycomb.choiceOverlay.renderSlots();
	if (honeycomb.choiceOverlay.previewIndex != null) return honeycomb.choiceOverlay.renderUpgradePreview();

	var markup = '<div class="hcOverlayPanel hcChoicePanel">';
	markup += '<h2 class="hcOverlayTitle">' +
		honeycomb.escapeText(request.prompt == null ? "Choose " + kind.name : request.prompt) + "</h2>";
	if (request.previewUpgrade == true && entryArray.length > 0) {
		markup += '<div class="hcOverlayBody hcMuted">Choose a card to see it upgraded.</div>';
	}

	if (request.maximum > 1) {
		markup += '<div class="hcOverlayBody hcMuted">Chosen ' +
			honeycomb.choiceOverlay.selectedArray.length + " of " + request.maximum + ".</div>";
	}

	if (entryArray.length === 0) {
		markup += '<div class="hcOverlayBody hcMuted">' + honeycomb.escapeText(kind.emptyText) + "</div>";
	} else {
		markup += '<div class="hcChoiceGrid hcScroll">';
		for (var scanIndex = 0; scanIndex < entryArray.length; scanIndex++) {
			markup += honeycomb.choiceOverlay.renderEntry(entryArray[scanIndex], kind);
		}
		markup += "</div>";
	}

	//A request may carry a line to show under the choices (Journal's "1.5x more likely" promise).
	if (request.note != null) {
		markup += '<div class="hcOverlayBody hcMuted">' + honeycomb.escapeText(request.note) + "</div>";
	}

	markup += '<div class="hcOverlayButtonRow">';
	//Confirm only exists for a multi-pick; a single pick commits on click, which is one fewer step.
	if (request.maximum > 1) {
		var ready = honeycomb.choiceOverlay.selectedArray.length >= request.minimum;
		markup += '<div class="hcButton hcPrimary' + (ready ? "" : " hcDisabled") + '"' +
			' onclick="honeycomb.choiceOverlay.confirm()">Confirm</div>';
	}
	//Skipping is offered only when the question permits it: it ANSWERS the question with nothing, which
	//is a different thing from taking the question back.
	if (request.minimum === 0) {
		markup += '<div class="hcButton" onclick="honeycomb.choiceOverlay.skip()">Skip</div>';
	} else if (entryArray.length === 0) {
		//Nothing qualifies, so the question cannot be answered and must not trap the player.
		markup += '<div class="hcButton" onclick="honeycomb.choiceOverlay.skip()">Continue</div>';
	}
	//`resolveWithChoices` rolls the world back the moment a question is pending, so nothing has happened
	//yet and canceling costs nothing. Whether Cancel is offered is the caller's to decide, signaled by
	//handing over an `onCancel` handler; a question opened without one has no Cancel, which is what a
	//question that genuinely cannot be unwound should look like.
	if (honeycomb.choiceOverlay.canCancel() == true) {
		markup += '<div class="hcButton" onclick="honeycomb.choiceOverlay.cancel()">Cancel</div>';
	}
	markup += "</div></div>";
	return markup;
};

honeycomb.choiceOverlay.renderEntry = function (entry, kind) {
	var selected = honeycomb.choiceOverlay.selectedArray.indexOf(entry.index) >= 0;
	var classList = "hcChoiceCell" + (selected ? " hcSelected" : "");
	var markup = '<div class="' + classList + '" onclick="honeycomb.choiceOverlay.pick(\'' +
		honeycomb.escapeAttribute(entry.index) + '\')">';

	if (kind.targetKind == "card" && entry.card != null) {
		//In an UPGRADE window the hover shows what the card would BECOME, not what it already is.
		//Everywhere else the ordinary card zoom is right.
		var request = honeycomb.choiceOverlay.request;
		markup += honeycomb.ui.card(entry.card, {
			size: "medium",
			instanceId: entry.instanceId,
			tooltipKind: request != null && request.previewUpgrade == true ? "cardUpgrade" : null,
		});
		//A banish button on an offered card (the journal): strikes it off every pool. The click must not
		//also pick the card, hence stopPropagation.
		if (entry.banishable == true && honeycomb.getResource("banish") > 0 && honeycomb.cardCanBeBanished(entry.index)) {
			markup += '<div class="hcBanishButton hcBanishSmall"' + honeycomb.tooltip.attributes("banish", "button") +
				' onclick="event.stopPropagation();honeycomb.choiceOverlay.banishEntry(\'' +
				honeycomb.escapeAttribute(entry.index) + '\')">Banish ' +
				honeycomb.ui.resourceCounter("banish") + "</div>";
		}
	} else if (kind.targetKind == "entity" && entry.entity != null) {
		markup += honeycomb.ui.portrait(entry.entity, { showHealth: true });
		//A heal preview under the portrait, so "who and how much" is one look.
		if (entry.note != null) markup += '<div class="hcChoiceNote">' + honeycomb.escapeText(entry.note) + "</div>";
	} else {
		//An option: a titled block, since it is prose rather than a picture.
		markup += '<div class="hcChoiceOption">';
		markup += honeycomb.ui.iconTag(entry.iconPath, "star", "#c9a961", { className: "hcChoiceOptionIcon" });
		markup += '<div class="hcChoiceOptionName">' + honeycomb.escapeText(entry.name) + "</div>";
		if (entry.description != null) {
			markup += '<div class="hcTiny hcMuted">' + honeycomb.escapeText(entry.description) + "</div>";
		} else if (entry.effectArray != null) {
			markup += '<div class="hcTiny hcMuted">' +
				honeycomb.escapeText(honeycomb.describeEffectArray(entry.effectArray)) + "</div>";
		}
		markup += "</div>";
	}

	markup += "</div>";
	return markup;
};

//The slot window: one slot per card wanted, each showing the card put in it. A filled slot empties when
//clicked. Confirm waits for enough cards; Cancel takes the whole play back.
honeycomb.choiceOverlay.renderSlots = function () {
	var request = honeycomb.choiceOverlay.request;
	var selectedArray = honeycomb.choiceOverlay.selectedArray;
	var markup = '<div class="hcSlotWindow" id="honeycombSlotWindow">';
	markup += '<div class="hcSlotPrompt">' + honeycomb.escapeText(request.prompt == null ? "Choose a card" : request.prompt) + "</div>";
	markup += '<div class="hcSlotRow">';
	for (var slotIndex = 0; slotIndex < request.maximum; slotIndex++) {
		var chosenId = selectedArray[slotIndex];
		var resolved = chosenId == null ? null : honeycomb.combat.resolveById(chosenId);
		markup += '<div class="hcSlot' + (resolved == null ? "" : " hcFilled") + '"' +
			(resolved == null ? "" : ' onclick="honeycomb.choiceOverlay.pick(\'' + honeycomb.escapeAttribute(chosenId) + '\')"') + ">";
		markup += resolved == null
			? '<span class="hcSlotEmpty">+</span>'
			: honeycomb.ui.card(resolved, { size: "small", instanceId: chosenId, showTooltip: false });
		markup += "</div>";
	}
	markup += "</div>";
	markup += '<div class="hcTiny hcMuted hcCenterText">' +
		(honeycomb.choiceOverlay.entryArray.length === 0
			? "No card in your hand qualifies."
			: "Drag a card from your hand into a slot, or tap it.") + "</div>";
	var ready = selectedArray.length >= request.minimum;
	markup += '<div class="hcOverlayButtonRow">';
	markup += '<div class="hcButton" onclick="honeycomb.choiceOverlay.cancel()">Cancel</div>';
	markup += '<div class="hcButton hcPrimary' + (ready ? "" : " hcDisabled") + '" onclick="honeycomb.choiceOverlay.confirm()">Confirm</div>';
	markup += "</div></div>";
	return markup;
};

//True while a card can be put into a slot: it is one of the cards the question allows.
honeycomb.choiceOverlay.isEligible = function (entryIndex) {
	for (var scanIndex = 0; scanIndex < honeycomb.choiceOverlay.entryArray.length; scanIndex++) {
		if (honeycomb.choiceOverlay.entryArray[scanIndex].index == entryIndex) return true;
	}
	return false;
};

//Whether this question can be taken back. The caller says so by handing over a way to undo it; a
//`cancellable` flag on the request says so too, for a caller that wants it stated in the data.
honeycomb.choiceOverlay.canCancel = function () {
	if (typeof honeycomb.choiceOverlay.onCancel === "function") return true;
	var request = honeycomb.choiceOverlay.request;
	return request != null && request.cancellable == true;
};

//Takes the question back without answering it. For a play, nothing has happened yet -- the attempt
//was rewound when the question was asked -- so cancelling simply leaves the card in hand.
honeycomb.choiceOverlay.cancel = function () {
	var handler = honeycomb.choiceOverlay.onCancel;
	honeycomb.overlay.close("choice");
	honeycomb.choiceOverlay.selectedArray = [];
	honeycomb.platform.sound("uiBack");
	if (typeof handler === "function") handler();
};

honeycomb.choiceOverlay.pick = function (entryIndex) {
	var request = honeycomb.choiceOverlay.request;
	var selectedArray = honeycomb.choiceOverlay.selectedArray;

	//In the slot window nothing commits until Confirm: a card goes in a slot, or comes back out of one.
	//With one slot, a second card replaces the first.
	if (honeycomb.choiceOverlay.presentation == "handSlots") {
		if (honeycomb.choiceOverlay.isEligible(entryIndex) == false) return;
		var slotPosition = selectedArray.indexOf(entryIndex);
		if (slotPosition >= 0) selectedArray.splice(slotPosition, 1);
		else if (selectedArray.length < request.maximum) selectedArray.push(entryIndex);
		else if (request.maximum === 1) selectedArray[0] = entryIndex;
		honeycomb.platform.sound("uiClick");
		honeycomb.choiceOverlay.repaint();
		if (honeycomb.combatScene != null) honeycomb.combatScene.markHandSelection();
		return;
	}

	//An upgrade shows the card BEFORE AND AFTER first, and commits from there.
	if (request.previewUpgrade == true && request.maximum <= 1) {
		honeycomb.choiceOverlay.previewIndex = entryIndex;
		honeycomb.platform.sound("uiClick");
		honeycomb.choiceOverlay.repaint();
		return;
	}

	//A single-pick question commits immediately.
	if (request.maximum <= 1) {
		honeycomb.choiceOverlay.answer([entryIndex]);
		return;
	}

	var position = selectedArray.indexOf(entryIndex);
	if (position >= 0) selectedArray.splice(position, 1);
	else if (selectedArray.length < request.maximum) selectedArray.push(entryIndex);
	honeycomb.choiceOverlay.repaint();
};

//BANISH FROM A CHOICE (the journal's offer). Spends a banish, records the card, and drops it from the
//question so it cannot be picked. The choice itself is untouched otherwise.
honeycomb.choiceOverlay.banishEntry = function (entryIndex) {
	if (honeycomb.banishCard(entryIndex) == false) return;
	honeycomb.platform.sound("uiBack");
	honeycomb.choiceOverlay.entryArray = honeycomb.choiceOverlay.entryArray.filter(function (entry) {
		return entry.index !== entryIndex;
	});
	var request = honeycomb.choiceOverlay.request;
	if (request != null && request.cardIndexArray != null) {
		request.cardIndexArray = request.cardIndexArray.filter(function (index) { return index !== entryIndex; });
	}
	var position = honeycomb.choiceOverlay.selectedArray.indexOf(entryIndex);
	if (position >= 0) honeycomb.choiceOverlay.selectedArray.splice(position, 1);
	honeycomb.choiceOverlay.repaint();
};

//BEFORE AND AFTER: the card as it is, and as the upgrade would leave it, side by side -- so "Sharpen"
//is a decision about a visible result rather than a gamble on what "+1" means for this card. Back
//returns to the grid; nothing is committed until Upgrade.
honeycomb.choiceOverlay.renderUpgradePreview = function () {
	var request = honeycomb.choiceOverlay.request;
	var entryIndex = honeycomb.choiceOverlay.previewIndex;
	var instance = honeycomb.combat.cardInstance(entryIndex);
	var current = instance == null ? null : honeycomb.resolveCard(instance);
	var upgraded = honeycomb.choiceOverlay.upgradedCard(instance);
	var markup = '<div class="hcOverlayPanel hcChoicePanel hcUpgradePreviewPanel">';
	markup += '<h2 class="hcOverlayTitle">' + honeycomb.escapeText(request.prompt == null ? "Upgrade" : request.prompt) + "</h2>";
	markup += '<div class="hcUpgradeCompare">';
	markup += '<div class="hcUpgradeSide"><div class="hcUpgradeLabel">Now</div>' +
		(current == null ? "" : honeycomb.ui.card(current, { size: "large", instanceId: entryIndex, showTooltip: false })) + "</div>";
	markup += '<div class="hcUpgradeArrow">&#10140;</div>';
	markup += '<div class="hcUpgradeSide hcUpgradeAfter"><div class="hcUpgradeLabel">Upgraded</div>' +
		(upgraded == null ? "" : honeycomb.ui.card(upgraded, { size: "large", instanceId: entryIndex, showTooltip: false })) + "</div>";
	markup += "</div>";
	markup += '<div class="hcOverlayButtonRow">' +
		'<div class="hcButton" onclick="honeycomb.choiceOverlay.backToGrid()">Back</div>' +
		'<div class="hcButton hcPrimary" onclick="honeycomb.choiceOverlay.answer([honeycomb.choiceOverlay.previewIndex])">Upgrade</div>' +
		"</div></div>";
	return markup;
};

//The card one upgrade level on, or null when it has none left. Built from a copy, so nothing is changed.
honeycomb.choiceOverlay.upgradedCard = function (instance) {
	if (instance == null) return null;
	return honeycomb.resolveCard({
		instanceId: instance.instanceId,
		cardIndex: instance.cardIndex,
		ownerInstanceId: instance.ownerInstanceId,
		upgradeLevel: (instance.upgradeLevel == null ? 0 : instance.upgradeLevel) + 1,
	});
};

honeycomb.choiceOverlay.backToGrid = function () {
	honeycomb.choiceOverlay.previewIndex = null;
	honeycomb.platform.sound("uiBack");
	honeycomb.choiceOverlay.repaint();
};

honeycomb.choiceOverlay.confirm = function () {
	var request = honeycomb.choiceOverlay.request;
	if (honeycomb.choiceOverlay.selectedArray.length < request.minimum) return;
	honeycomb.choiceOverlay.answer(honeycomb.choiceOverlay.selectedArray.slice());
};

honeycomb.choiceOverlay.skip = function () {
	honeycomb.choiceOverlay.answer([]);
};

//Hands the answer back to whoever asked. The overlay closes first, so the caller is free to open
//another one for the next question in the same effect list.
honeycomb.choiceOverlay.answer = function (chosenArray) {
	var handler = honeycomb.choiceOverlay.onAnswer;
	honeycomb.overlay.close("choice");
	honeycomb.choiceOverlay.selectedArray = [];
	if (typeof handler === "function") handler({ chosenArray: chosenArray });
};

honeycomb.choiceOverlay.repaint = function () {
	//The panel describes a card this repaint is about to destroy, and a removed element fires no mouseleave:
	//picking a card in an upgrade window left its "after upgrading" panel over the Now / Upgraded preview.
	if (honeycomb.tooltip != null) honeycomb.tooltip.hide();
	for (var scanIndex = honeycomb.overlay.openArray.length - 1; scanIndex >= 0; scanIndex--) {
		if (honeycomb.overlay.openArray[scanIndex].index != "choice") continue;
		honeycomb.overlay.openArray[scanIndex].element.innerHTML = honeycomb.choiceOverlay.render();
		return;
	}
};
