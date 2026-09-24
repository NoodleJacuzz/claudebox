//===================================================================================================
//HONEYCOMB CATACOMBS -- effects, values and conditions
//===================================================================================================
//The verb layer. Everything that HAPPENS in this game -- a card resolving, an enemy attacking, a
//relic firing, an event granting gold -- is a list of effect entries resolved against a context.
//Nothing in combat, map or event code performs an action directly; it builds an effect list and hands
//it here. That is what makes new content authorable without touching engine code.
//
//Three registries, each a flat table keyed by `index`:
//
//  honeycomb.effectArray     VERBS.       "deal damage", "draw cards", "apply status".
//  honeycomb.valueArray      NUMBERS.     Lets an amount be "6" or "twice the source's Temporary HP".
//  honeycomb.conditionArray  QUESTIONS.   Gates an effect on the state of the world.
//
//Adding to any of them is a self-contained edit: one table entry, and every card, enemy, relic and
//event can use it immediately.
//
//RESOLUTION IS HEADLESS. Effects never touch the DOM. They mutate state and append to context.log,
//an ordered list of things that happened. The combat screen replays that log as animation afterward.
//Keeping the two apart means combat maths is deterministic and testable on its own, and an animation
//change can never alter an outcome.
window.honeycomb = window.honeycomb || {};

//---------------------------------------------------------------------------------------------------
//Context
//---------------------------------------------------------------------------------------------------
//The object every resolver receives. Built by whoever is causing the action.
//
//  source        entity performing the action, or null for world effects (events, relics on pickup)
//  targetArray   entities the action lands on, already resolved from the card's target mode
//  target        convenience handle on targetArray[0]
//  card          card instance being played, or null
//  combat        live combat state, or null when resolving outside a fight
//  log           ordered record of what happened, consumed by the presentation layer
//  depth         recursion guard for effects that resolve other effects
honeycomb.newEffectContext = function (settings) {
	var context = settings == null ? {} : settings;
	if (context.targetArray == null) context.targetArray = context.target == null ? [] : [context.target];
	if (context.target == null && context.targetArray.length > 0) context.target = context.targetArray[0];
	if (context.log == null) context.log = [];
	if (context.depth == null) context.depth = 0;
	//Cards this action is aimed at, as distinct from entities. Kept in its own list so an effect that
	//damages an entity can never be handed a card by mistake.
	if (context.targetCardArray == null) context.targetCardArray = [];
	//Running totals for the WHOLE action, shared by reference with every nested and overridden context
	//it spawns -- so "heal for the damage dealt" can read what the damage entry before it actually did,
	//however the entries are nested. See the damageDealt value.
	if (context.tally == null) context.tally = { damageDealt: 0 };
	if (context.combat == null && honeycomb.state != null && honeycomb.state.run != null) {
		context.combat = honeycomb.state.run.combat;
	}
	return context;
};

//Appends to the presentation log. Every visible consequence goes through here, so the animation layer
//has one contract to read and nothing can change state invisibly.
honeycomb.logEvent = function (context, entry) {
	if (context == null || context.log == null) return;
	//Anything that happened because of a random pick says so. Stamped here, the one door every entry
	//passes through, so no effect has to remember. See honeycomb.markChance.
	if (context.chance == true && entry.chance == null) {
		entry.chance = true;
		if (context.chanceGroup != null && entry.chanceGroup == null) entry.chanceGroup = context.chanceGroup;
	}
	//What did it: the log shows what did the damage, not just who took it. Stamped here rather than by
	//each effect, for the same reason `chance` is -- this is the one door every entry passes through, so
	//nothing can be missed and no effect has to remember.
	//`context.card` is the card or ability being resolved (honeycomb.abilities.asCard shapes an ability
	//as one), so the stamp is its index and the log resolves the name when it words the line.
	//Entries that ARE the card skip it: "Brienne played Bulwark from Bulwark" says nothing.
	if (entry.via == null && entry.card == null && entry.cardId == null &&
		context.card != null && context.card.index != null) {
		entry.via = context.card.index;
	}
	context.log.push(entry);
	//The fight's lasting HISTORY is written from the same door, so nothing that happens can be missed
	//by it. See honeycomb.battleLog (honeycomb-combat.js).
	if (honeycomb.battleLog != null && context.combat != null) honeycomb.battleLog.record(context.combat, entry);
};

//---------------------------------------------------------------------------------------------------
//Effect resolution
//---------------------------------------------------------------------------------------------------
//Runs a list of effect entries in order. An entry is {index, ...parameters}; the parameters mean
//whatever that effect's definition says they mean.
honeycomb.resolveEffectArray = function (effectArray, context) {
	if (effectArray == null) return context;
	if (context.depth > honeycomb.effectDepthLimit) {
		console.error("Honeycomb: effect recursion limit reached; a chain is looping");
		return context;
	}
	//A condition checked when the list starts. Heavy Swing's "if you have 10 or more Temporary HP, deal
	//8 again" must read Temporary HP as it stood when the card was played, not after an earlier hit in
	//the same list -- Thorns on the target can otherwise drop it under 10 before the check runs. A
	//condition marked `checkedAtStart` is answered here, before any entry in its list runs, so for a
	//card it is the state at the moment of playing. Unmarked conditions still read the state as their
	//own entry comes up, which "if the target is now downed" depends on.
	var startAnswerArray = [];
	for (var checkIndex = 0; checkIndex < effectArray.length; checkIndex++) {
		var checked = effectArray[checkIndex];
		startAnswerArray.push(checked != null && checked.condition != null && checked.condition.checkedAtStart == true
			? honeycomb.testCondition(checked.condition, context) : null);
	}
	for (var entryIndex = 0; entryIndex < effectArray.length; entryIndex++) {
		//An unanswered question halts the pass. See honeycomb-choices.js: the whole list is replayed
		//once the answer exists, so stopping here loses nothing.
		if (context.choiceState != null && context.choiceState.pending != null) break;
		honeycomb.resolveEffect(effectArray[entryIndex], context, startAnswerArray[entryIndex]);
	}
	return context;
};

//Guards against an effect list that resolves itself. Generous enough that legitimate chains are
//never clipped.
honeycomb.effectDepthLimit = 16;

//`startAnswer` is the answer resolveEffectArray already gave a `checkedAtStart` condition; null means
//test the condition now.
honeycomb.resolveEffect = function (entry, context, startAnswer) {
	if (entry == null) return;
	if (context.choiceState != null && context.choiceState.pending != null) return;
	var definition = honeycomb.requireDefinition(honeycomb.effectArray, entry.index, "honeycomb.effectArray");
	if (definition == null) return;

	//An effect may carry its own condition, so gating never needs a wrapper entry unless the author
	//wants an else branch.
	if (startAnswer === false) return;
	if (startAnswer == null && entry.condition != null && honeycomb.testCondition(entry.condition, context) == false) return;

	//Effects resolve against a target list that may differ from the card's. `targetOverride` lets one
	//entry in a card hit something else -- "deal 6 damage, then heal yourself" is two entries, not
	//two cards.
	var effectContext = context;
	if (entry.targetOverride != null) {
		effectContext = honeycomb.newEffectContext({
			source: context.source,
			card: context.card,
			combat: context.combat,
			log: context.log,
			depth: context.depth,
		});
		//The choice conversation is shared, so an override cannot restart the question numbering.
		effectContext.choiceState = context.choiceState;
		effectContext.chosenCardId = context.chosenCardId;
		//So is the action's running tally: a drain's heal is overridden onto the owner and still has to
		//read what the hit before it dealt.
		effectContext.tally = context.tally;
		//A turned move stays turned inside its own overrides.
		effectContext.actingSide = context.actingSide;
		//An override may name a CARD mode as readily as an entity one, and the result has to land in
		//the matching list -- otherwise an effect that damages entities would be handed a card.
		honeycomb.applyResolvedTargets(effectContext, entry.targetOverride,
			honeycomb.resolveTargetMode(entry.targetOverride, context));
	}

	definition.resolve(entry, effectContext);
};

//---------------------------------------------------------------------------------------------------
//Values
//---------------------------------------------------------------------------------------------------
//Anywhere an effect takes a number, it may instead take a value descriptor. `6` and
//{index:"stat", stat:"temporaryHealth", of:"source"} are both legal, so a card can scale off the game state
//without a bespoke effect.
honeycomb.resolveValue = function (value, context) {
	if (value == null) return 0;
	if (typeof value === "number") return value;
	if (typeof value === "function") return value(context);
	var definition = honeycomb.requireDefinition(honeycomb.valueArray, value.index, "honeycomb.valueArray");
	if (definition == null) return 0;
	return definition.resolve(value, context);
};

honeycomb.valueArray = [
	{
		index: "fixed",
		//An explicit constant. Rarely written by hand, but useful as a wrapper target.
		resolve: function (value) { return value.amount; },
		describe: function (value) { return String(value.amount); },
	},
	{
		index: "stat",
		//Reads a numeric field off an entity. `of` selects which: "source", "target", or "card".
		resolve: function (value, context) {
			var entity = honeycomb.resolveValueSubject(value.of, context);
			if (entity == null) return 0;
			var raw = entity[value.stat];
			return raw == null ? 0 : raw;
		},
		describe: function (value) {
			//A `label` lets content name a stat the way a player would ("Temporary HP") instead of
			//"the source's temporaryHealth", which is what a condition in card text prints.
			if (value.label != null) return value.label;
			return "the " + (value.of || "source") + "'s " + value.stat;
		},
	},
	{
		index: "statusStacks",
		//How many stacks of a status the subject holds. Lets a card pay off a status it built up.
		resolve: function (value, context) {
			var entity = honeycomb.resolveValueSubject(value.of, context);
			return honeycomb.statusStacks(entity, value.status);
		},
		describe: function (value) { return "stacks of " + value.status; },
	},
	{
		index: "mechanic",
		//How full a character's own meter is (Resolve, Harvest, Stride, Devotion, the Orb's filled slots). Lets an
		//ability read what it is about to spend -- Phoenix Dive, Magic Trick.
		resolve: function (value, context) {
			var entity = honeycomb.resolveValueSubject(value.of, context);
			return honeycomb.mechanicValue(entity, value.mechanic);
		},
		describe: function (value) {
			var definition = honeycomb.findDefinition(honeycomb.mechanicArray == null ? [] : honeycomb.mechanicArray, value.mechanic);
			return (definition == null ? value.mechanic : definition.name);
		},
	},
	{
		index: "mechanicOrbs",
		//How many of a TESTED mechanic's orbs are lit (Severine's Thirst). Quicken draws one card each.
		resolve: function (value, context) {
			var entity = honeycomb.resolveValueSubject(value == null ? "source" : value.of, context);
			return honeycomb.mechanicOrbsLit(entity, context == null ? null : context.combat);
		},
		describe: function () { return "each lit orb"; },
	},
	{
		index: "resource",
		//`maximum: true` reads the full total the run has ever been granted rather than what is left of
		//it, so a relic that refills a pool can be gated on the pool existing at all -- the Mulligan
		//Stone should never be offered to a run whose reroll maximum is zero, where it would do nothing.
		resolve: function (value) {
			return value.maximum == true ? honeycomb.resourceMaximum(value.resource) : honeycomb.getResource(value.resource);
		},
		describe: function (value) { return (value.maximum == true ? "your total " : "your ") + value.resource; },
	},
	{
		index: "tuning",
		//A number read straight out of tuning by dotted path, so a content table carries no magic number.
		resolve: function (value) {
			var node = honeycomb.tuning;
			var partArray = String(value.path).split(".");
			for (var partIndex = 0; partIndex < partArray.length; partIndex++) {
				if (node == null) return 0;
				node = node[partArray[partIndex]];
			}
			return typeof node === "number" ? node : 0;
		},
		describe: function (value) { return String(value.path); },
	},
	{
		index: "partyField",
		//A named numeric field summed across the party plus the benched "Always" tier (Rest-A's extra
		//action, and anything else that reads a tree node's number as a value).
		resolve: function (value) { return honeycomb.partyFieldTotal(value.field) + honeycomb.profileFieldTotal(value.field + "Always"); },
		describe: function (value) { return value.field; },
	},
	{
		index: "partyFlag",
		//1 when any party member's selected tree nodes carry a truthy flag, else 0. Rest-B, read as a
		//number so it can scale a heal.
		resolve: function (value) { return honeycomb.partyFieldFlag(value.field) == true ? 1 : 0; },
		describe: function (value) { return value.field; },
	},
	{
		index: "count",
		//Counts things: "hand", "discard", "drawPile", "deck", "livingAllies", "livingEnemies".
		resolve: function (value, context) { return honeycomb.countCollection(value.collection, context); },
		describe: function (value) {
			var unit = honeycomb.collectionUnitMap[value.collection];
			return unit == null ? "the number of " + value.collection : "the number of " + unit.plural;
		},
		describePer: function (value) {
			var unit = honeycomb.collectionUnitMap[value.collection];
			return unit == null ? null : unit.singular;
		},
	},
	{
		//How many a target mode resolves to. `count` above knows a fixed list of collections; this counts
		//whatever a MODE picks, which is the only way to say "for each ally in front of this" without a
		//second collection per relative mode. `mode` is any entry in honeycomb.targetModeArray.
		index: "targetCount",
		resolve: function (value, context) {
			var resolved = honeycomb.resolveTargetMode(value.mode, context);
			return resolved == null ? 0 : resolved.length;
		},
		describe: function (value) {
			var definition = honeycomb.targetModeDefinition(value.mode);
			return "the number of " + (definition == null || definition.name == null ? String(value.mode) : definition.name);
		},
		describePer: function (value) {
			var definition = honeycomb.targetModeDefinition(value.mode);
			return definition == null || definition.name == null ? null : definition.name;
		},
	},
	{
		index: "math",
		//Combines other values. `operation` is add, subtract, multiply, divide, min, max.
		//Nesting is how any arithmetic a card needs gets expressed without new effects.
		resolve: function (value, context) {
			var left = honeycomb.resolveValue(value.left, context);
			var right = honeycomb.resolveValue(value.right, context);
			switch (value.operation) {
				case "add": return left + right;
				case "subtract": return left - right;
				case "multiply": return left * right;
				case "divide": return right === 0 ? 0 : Math.floor(left / right);
				case "min": return Math.min(left, right);
				case "max": return Math.max(left, right);
				default:
					console.error("Honeycomb: unknown math operation '" + value.operation + "'");
					return left;
			}
		},
		describe: function (value) {
			var symbol = { add: "+", subtract: "-", multiply: "x", divide: "/" }[value.operation];
			if (symbol == null) return value.operation + "(" + honeycomb.describeValue(value.left) + ", " + honeycomb.describeValue(value.right) + ")";
			return honeycomb.describeValue(value.left) + " " + symbol + " " + honeycomb.describeValue(value.right);
		},
	},
	{
		index: "random",
		//Combat-stream roll, so it stays reproducible from the run seed. What it feeds is CHANCE, so a
		//forecast reports the number it rolled as a "might" rather than a promise.
		resolve: function (value, context) {
			if (context != null) context.chance = true;
			return honeycomb.rng.range(honeycomb.tuning.rng.streamArray.combat, value.minimum, value.maximum);
		},
		describe: function (value) { return value.minimum + "-" + value.maximum; },
	},
	{
		//Health damage this action has actually dealt so far, after Temporary HP -- what a DRAIN heals for.
		//Read off the action's shared tally, so it counts every hit before it however they were nested.
		index: "damageDealt",
		resolve: function (value, context) { return context == null || context.tally == null ? 0 : context.tally.damageDealt; },
		describe: function () { return "the damage dealt"; },
	},
	{
		index: "rank",
		//An entity's place in its side's order, 0 at the front. "Deal more damage the further back you
		//stand" is this, fed through math.
		resolve: function (value, context) {
			var entity = honeycomb.resolveValueSubject(value.of, context);
			return Math.max(0, honeycomb.entityRank(entity, context.combat));
		},
		describe: function (value) {
			var who = honeycomb.describeWho(value.of);
			return (who == "you" ? "your" : who + "'s") + " place in line";
		},
	},
	{
		//What an earlier entry of THIS action recorded, by `key`: "temporarySpent" (spendTemporaryHealth),
		//"consumed" (consumeStatus), "damageDealt". The general form of damageDealt.
		index: "tally",
		resolve: function (value, context) {
			if (context == null || context.tally == null) return 0;
			var held = context.tally[value.key];
			return held == null ? 0 : held;
		},
		describe: function (value) { return value.key == "temporarySpent" ? "the Temporary HP spent" : "that much"; },
	},
	{
		//How many different debuffs the subject holds (Bloody Verdict). Cruelty's number.
		index: "debuffCount",
		resolve: function (value, context) { return honeycomb.debuffCount(honeycomb.resolveValueSubject(value.of, context)); },
		describe: function (value) { return "the number of debuffs on " + honeycomb.describeWho(value.of); },
		describePer: function (value) { return "debuff on " + honeycomb.describeWho(value.of); },
	},
	{
		//A number the fight keeps: "partyDamageTakenThisTurn" is the blood the party spilled.
		index: "combatStat",
		resolve: function (value, context) {
			var combat = context == null ? null : context.combat;
			var held = combat == null ? null : combat[value.stat];
			return held == null ? 0 : held;
		},
		describe: function (value) { return value.stat == "partyDamageTakenThisTurn" ? "the damage the party took this turn" : value.stat; },
	},
	{
		//The damage the subject has telegraphed, every hit counted (Cassadora's Mirror Fate). 0 for a move
		//that deals none.
		index: "intentDamage",
		resolve: function (value, context) {
			var entity = honeycomb.resolveValueSubject(value.of == null ? "target" : value.of, context);
			var card = honeycomb.telegraphedCard == null ? null : honeycomb.telegraphedCard(entity);
			var shown = card == null ? null : honeycomb.moveDisplayAmount(entity, card, context == null ? null : context.combat);
			return shown == null ? 0 : shown.amount * Math.max(1, shown.hits);
		},
		describe: function () { return "the damage the target intends"; },
	},
	{
		//How many of the other team telegraph a move that deals damage (Cassadora's Crystal Gaze).
		index: "attackingOpponents",
		resolve: function (value, context) {
			var opponentArray = honeycomb.relatedLivingArray("opponent", context);
			var count = 0;
			for (var scanIndex = 0; scanIndex < opponentArray.length; scanIndex++) {
				var card = honeycomb.telegraphedCard == null ? null : honeycomb.telegraphedCard(opponentArray[scanIndex]);
				if (card != null && honeycomb.moveDisplayAmount(opponentArray[scanIndex], card, context.combat) != null) count += 1;
			}
			return count;
		},
		describe: function () { return "the number of enemies intending to attack"; },
		describePer: function () { return "enemy intending to attack"; },
	},
	{
		//How much Lust would break the subject right now, never below 1 (Clemence's Surrender).
		index: "lustToBreak",
		resolve: function (value, context) {
			var entity = honeycomb.resolveValueSubject(value.of, context);
			var needed = entity == null ? null : honeycomb.lustToBreak(entity);
			return needed == null ? 0 : Math.max(1, needed);
		},
		describe: function () { return "enough Lust to break"; },
	},
	{
		//How far the subject has moved through its order this turn (Cinder).
		index: "ranksMovedThisTurn",
		resolve: function (value, context) {
			return honeycomb.ranksMovedThisTurn(honeycomb.resolveValueSubject(value.of, context), context == null ? null : context.combat);
		},
		describe: function (value) { return "how far " + honeycomb.describeWho(value.of) + " moved this turn"; },
	},
	{
		//Maximum health minus health, never below 0.
		index: "missingHealth",
		resolve: function (value, context) {
			var entity = honeycomb.resolveValueSubject(value.of, context);
			return entity == null ? 0 : Math.max(0, entity.maxHealth - entity.health);
		},
		describe: function (value) {
			var who = honeycomb.describeWho(value.of);
			return (who == "you" ? "your" : who + "'s") + " missing health";
		},
	},
	{
		//Health as a share of maximum, 0-1. The wound rather than the language of statuses: Severine's
		//Finish reads "the target or she is below half" through this. A subject with no maximum reads 0.
		index: "healthFraction",
		resolve: function (value, context) {
			var entity = honeycomb.resolveValueSubject(value.of == null ? "target" : value.of, context);
			if (entity == null || entity.maxHealth == null || entity.maxHealth <= 0) return 0;
			return entity.health / entity.maxHealth;
		},
		describe: function (value) {
			var who = honeycomb.describeWho(value.of, "target");
			return (who == "you" ? "your" : who + "'s") + " share of health";
		},
	},
	{
		//A number chosen by whether the subject holds a status: "deal double if the target is Sundered".
		//`then` and `else` default to 1 and 0. It doubles as a telegraph-safe conditional: a
		//move that reads no target resolves the `else`, so the printed figure is the base hit.
		index: "ifStatus",
		resolve: function (value, context) {
			var entity = honeycomb.resolveValueSubject(value.of == null ? "target" : value.of, context);
			var held = entity != null && honeycomb.statusStacks(entity, value.status) > 0;
			return held ? (value.then == null ? 1 : value.then) : (value.else == null ? 0 : value.else);
		},
		describe: function (value) {
			var status = honeycomb.findDefinition(honeycomb.statusArray, value.status);
			return "×" + (value.then == null ? 1 : value.then) + " if " + (status == null ? value.status : status.name);
		},
	},
	{
		//A number chosen by any condition: `then` when it passes, `else` otherwise (default 0). The value
		//form of an entry-level condition, so a card can be ONE entry that reads "doubled if...". Finish's
		//"double if the target or she is below half" is this over a healthFraction compare.
		index: "conditional",
		resolve: function (value, context) {
			return honeycomb.testCondition(value.condition, context)
				? (value.then == null ? 1 : honeycomb.resolveValue(value.then, context))
				: (value.else == null ? 0 : honeycomb.resolveValue(value.else, context));
		},
		describe: function (value) {
			var text = honeycomb.describeValue(value.then == null ? 1 : value.then) + " if " + honeycomb.describeCondition(value.condition);
			if (value.else != null) text += ", otherwise " + honeycomb.describeValue(value.else);
			return text;
		},
	},
];

//Words for the `count` collections, singular for "for each" and plural for "the number of".
honeycomb.collectionUnitMap = {
	hand: { singular: "card in your hand", plural: "cards in your hand" },
	drawPile: { singular: "card in your draw pile", plural: "cards in your draw pile" },
	discardPile: { singular: "card in your discard pile", plural: "cards in your discard pile" },
	exhausted: { singular: "exhausted card", plural: "exhausted cards" },
	deck: { singular: "card in your deck", plural: "cards in your deck" },
	livingAllies: { singular: "standing ally", plural: "standing allies" },
	livingEnemies: { singular: "standing enemy", plural: "standing enemies" },
	woundedEnemies: { singular: "enemy below half health", plural: "enemies below half health" },
	relics: { singular: "relic", plural: "relics" },
};

//Comparison operations as words, and the shares of health that have a name.
honeycomb.comparisonWordMap = { equal: "is", notEqual: "is not", greater: "is more than", greaterOrEqual: "is at least",
	less: "is less than", lessOrEqual: "is at most" };
honeycomb.healthShareWordMap = { "0.5": "half", "0.25": "a quarter", "0.75": "three quarters" };

//Different debuffs held, by the status table's `isDebuff`.
honeycomb.debuffCount = function (entity) {
	if (entity == null || entity.statusArray == null) return 0;
	var count = 0;
	for (var scanIndex = 0; scanIndex < entity.statusArray.length; scanIndex++) {
		var status = honeycomb.findDefinition(honeycomb.statusArray, entity.statusArray[scanIndex].index);
		if (status != null && status.isDebuff == true && entity.statusArray[scanIndex].stacks > 0) count += 1;
	}
	return count;
};

//Picks the entity a value descriptor is talking about.
//
//A subject may also be a single-target mode. "Damage equal to the intent of the golem behind it" needs
//a value to read somebody who is neither the source nor the target, and the modes already know
//how to find them -- so any mode that resolves to one entity may be named here instead of adding a
//subject word per relationship. `allyBehind`, `allyAhead`, `frontAlly`, `summoner` all work.
honeycomb.resolveValueSubject = function (subjectIndex, context) {
	switch (subjectIndex) {
		case "target": return context.target;
		case "card": return context.card;
		case "source":
		case null:
		case undefined:
			return context.source;
		default: break;
	}
	if (honeycomb.targetModeDefinition != null && honeycomb.findDefinition(honeycomb.targetModeArray, subjectIndex) != null) {
		var resolved = honeycomb.resolveTargetMode(subjectIndex, context);
		return resolved == null || resolved.length === 0 ? null : resolved[0];
	}
	return context.source;
};

//Who a value or condition is about, as a player reads it: the card's user is "you", its target "the
//target". Card text is written to the player, so "the source" never reaches a card face (AUDIT-01).
honeycomb.describeWho = function (of, fallback) {
	var subject = of == null ? (fallback == null ? "source" : fallback) : of;
	if (subject == "source") return "you";
	if (subject == "target") return "the target";
	//A subject may be a single-target MODE; the mode already has a phrase for itself, and
	//"the allyBehind" is not English.
	var mode = honeycomb.targetModeArray == null ? null : honeycomb.findDefinition(honeycomb.targetModeArray, subject);
	if (mode != null && mode.textObject != null) return mode.textObject;
	if (mode != null && mode.name != null) return mode.name;
	return "the " + subject;
};

//"you are" / "the target is" -- the subject with its verb agreeing.
honeycomb.describeWhoIs = function (of, fallback) {
	var who = honeycomb.describeWho(of, fallback);
	return who + (who == "you" ? " are" : " is");
};

//A value as a UNIT that can be counted per: "debuff on the target", "card in your hand". Null when the
//value has no natural singular, and the caller falls back to its plain description.
honeycomb.describePerUnit = function (value) {
	if (value == null || typeof value !== "object") return null;
	var definition = honeycomb.findDefinition(honeycomb.valueArray, value.index);
	return definition == null || definition.describePer == null ? null : definition.describePer(value);
};

//A SUM as words. An `add` tree is flattened into a constant and a list of counted terms, so
//"4 + debuffs + debuffs" reads "4, plus 2 for each debuff on the target" instead of repeating itself.
//Returns {constant, termText} where termText is "" when the value is a plain number.
honeycomb.describeSum = function (value) {
	var constant = 0;
	var termArray = [];
	var walk = function (node) {
		if (typeof node === "number") { constant += node; return; }
		if (node != null && node.index == "math" && node.operation == "add") { walk(node.left); walk(node.right); return; }
		var coefficient = 1;
		var unit = node;
		if (node != null && node.index == "math" && node.operation == "multiply") {
			if (typeof node.left === "number") { coefficient = node.left; unit = node.right; }
			else if (typeof node.right === "number") { coefficient = node.right; unit = node.left; }
		}
		var key = JSON.stringify(unit);
		for (var scanIndex = 0; scanIndex < termArray.length; scanIndex++) {
			if (termArray[scanIndex].key === key) { termArray[scanIndex].coefficient += coefficient; return; }
		}
		termArray.push({ key: key, unit: unit, coefficient: coefficient });
	};
	walk(value);
	var pieceArray = [];
	for (var termIndex = 0; termIndex < termArray.length; termIndex++) {
		var term = termArray[termIndex];
		var per = honeycomb.describePerUnit(term.unit);
		if (per != null) pieceArray.push(term.coefficient + " for each " + per);
		else pieceArray.push((term.coefficient === 1 ? "" : term.coefficient + " x ") + honeycomb.describeValue(term.unit));
	}
	return { constant: constant, termText: pieceArray.join(", plus ") };
};

//Turns a value into readable text for generated card descriptions.
honeycomb.describeValue = function (value) {
	if (value == null) return "0";
	if (typeof value === "number") return String(value);
	var definition = honeycomb.findDefinition(honeycomb.valueArray, value.index);
	if (definition == null || definition.describe == null) return "?";
	return definition.describe(value);
};

//Counts a named collection for the `count` value and for conditions.
honeycomb.countCollection = function (collectionIndex, context) {
	var combat = context.combat;
	switch (collectionIndex) {
		case "hand": return combat == null ? 0 : combat.handArray.length;
		case "drawPile": return combat == null ? 0 : combat.drawPileArray.length;
		case "discardPile": return combat == null ? 0 : combat.discardPileArray.length;
		case "exhausted": return combat == null ? 0 : combat.exhaustPileArray.length;
		case "inPlay": return combat == null || combat.inPlayPileArray == null ? 0 : combat.inPlayPileArray.length;
		case "deck": return honeycomb.state.run == null ? 0 : honeycomb.state.run.deckArray.length;
		case "livingAllies": return honeycomb.livingEntityArray("ally", combat).length;
		case "livingEnemies": return honeycomb.livingEntityArray("enemy", combat).length;
		//Enemies below half their health (the Huntress cards).
		case "woundedEnemies": return honeycomb.livingEntityArray("enemy", combat).filter(function (enemy) {
			return enemy.maxHealth > 0 && enemy.health * 2 < enemy.maxHealth;
		}).length;
		case "relics": return honeycomb.state.run == null ? 0 : honeycomb.state.run.relicArray.length;
		//Party members who have moved through the order this turn (Cinder's Pincer).
		case "alliesMovedThisTurn": return honeycomb.livingEntityArray("ally", combat).filter(function (ally) {
			return honeycomb.ranksMovedThisTurn(ally, combat) > 0;
		}).length;
		default:
			console.error("Honeycomb: unknown collection '" + collectionIndex + "'");
			return 0;
	}
};

//---------------------------------------------------------------------------------------------------
//Conditions
//---------------------------------------------------------------------------------------------------
//Questions about the world, used to gate effects, enemy behaviour, event choices and unlocks.
honeycomb.testCondition = function (condition, context) {
	if (condition == null) return true;
	if (typeof condition === "function") return condition(context) == true;
	var definition = honeycomb.requireDefinition(honeycomb.conditionArray, condition.index, "honeycomb.conditionArray");
	if (definition == null) return false;
	var result = definition.test(condition, context) == true;
	//Every condition may be inverted in place, which halves the size of the table.
	return condition.invert == true ? result == false : result;
};

//One condition in words, from its own `describe`. Used where a condition has to be SHOWN rather than
//only tested -- an ability's requirement list. A condition with nothing to say returns "".
honeycomb.describeCondition = function (condition) {
	if (condition == null || typeof condition === "function") return "";
	var definition = honeycomb.findDefinition(honeycomb.conditionArray, condition.index);
	if (definition == null || definition.describe == null) return "";
	var text = definition.describe(condition);
	return condition.invert == true ? "not " + text : text;
};

honeycomb.conditionArray = [

	//`hasTag` is NOT registered here. The whole tag system lives in honeycomb-tags.js and appends its
	//conditions to this array, so a second copy here would shadow that one (findDefinition takes the
	//first match) and lose the card and owner subjects it supports.

	{
		index: "compare",
		//The general case: compare any two values.
		test: function (condition, context) {
			var left = honeycomb.resolveValue(condition.left, context);
			var right = honeycomb.resolveValue(condition.right, context);
			switch (condition.operation) {
				case "equal": return left === right;
				case "notEqual": return left !== right;
				case "greater": return left > right;
				case "greaterOrEqual": return left >= right;
				case "less": return left < right;
				case "lessOrEqual": return left <= right;
				default:
					console.error("Honeycomb: unknown comparison '" + condition.operation + "'");
					return false;
			}
		},
		describe: function (condition) {
			var left = honeycomb.describeValue(condition.left);
			var right = honeycomb.describeValue(condition.right);
			//Plain English for the common "has at least one" test: "If you have any Temporary HP".
			if (condition.operation === "greaterOrEqual" && condition.right === 1) {
				var subject = condition.left != null && condition.left.of === "target" ? "the target" : "you";
				return subject + (subject === "you" ? " have" : " has") + " any " + left;
			}
			//A share of health reads as the wound it is: "the target is below half health" (Finish).
			if (condition.left != null && condition.left.index == "healthFraction" && typeof condition.right === "number") {
				var share = honeycomb.healthShareWordMap[String(condition.right)];
				var shareText = share == null ? Math.round(condition.right * 100) + "% health" : share + " health";
				var relation = { less: "below", lessOrEqual: "at or below", greater: "above", greaterOrEqual: "at or above" }[condition.operation];
				if (relation != null) return honeycomb.describeWhoIs(condition.left.of, "target") + " " + relation + " " + shareText;
			}
			var operationWord = honeycomb.comparisonWordMap[condition.operation];
			return left + " " + (operationWord == null ? condition.operation : operationWord) + " " + right;
		},
	},
	{
		//Combines other conditions. `anyOf` is an OR, `allOf` an AND; `invert` still applies to the whole
		//thing. Finish's "the target OR she is below half" is an anyOf of two compares.
		index: "anyOf",
		test: function (condition, context) {
			var list = condition.conditionArray == null ? [] : condition.conditionArray;
			for (var scanIndex = 0; scanIndex < list.length; scanIndex++) {
				if (honeycomb.testCondition(list[scanIndex], context) == true) return true;
			}
			return list.length === 0;
		},
			describe: function (condition) {
			var list = condition.conditionArray == null ? [] : condition.conditionArray;
			var textArray = [];
			for (var scanIndex = 0; scanIndex < list.length; scanIndex++) textArray.push(honeycomb.describeCondition(list[scanIndex]));
			//"the target is below half health or you are below half health" -> "the target or you are below
			//half health": two clauses with the same predicate share it.
			var predicate = null;
			var subjectArray = [];
			for (var joinIndex = 0; joinIndex < textArray.length; joinIndex++) {
				var match = /^(the target|you) (?:is|are) (.+)$/.exec(textArray[joinIndex]);
				if (match == null || (predicate != null && predicate !== match[2])) { predicate = null; break; }
				predicate = match[2];
				subjectArray.push(match[1]);
			}
			if (predicate != null && subjectArray.length > 1) {
				return subjectArray.join(" or ") + (subjectArray[subjectArray.length - 1] == "you" ? " are " : " is ") + predicate;
			}
			return textArray.join(" or ");
		},
	},
	{
		index: "allOf",
		test: function (condition, context) {
			var list = condition.conditionArray == null ? [] : condition.conditionArray;
			for (var scanIndex = 0; scanIndex < list.length; scanIndex++) {
				if (honeycomb.testCondition(list[scanIndex], context) == false) return false;
			}
			return true;
		},
		describe: function (condition) {
			var list = condition.conditionArray == null ? [] : condition.conditionArray;
			var textArray = [];
			for (var scanIndex = 0; scanIndex < list.length; scanIndex++) textArray.push(honeycomb.describeCondition(list[scanIndex]));
			return textArray.join(" and ");
		},
	},
	{
		index: "hasStatus",
		test: function (condition, context) {
			var entity = honeycomb.resolveValueSubject(condition.of, context);
			var minimum = condition.minimumStacks == null ? 1 : condition.minimumStacks;
			return honeycomb.statusStacks(entity, condition.status) >= minimum;
		},
		describe: function (condition) {
			var status = honeycomb.findDefinition(honeycomb.statusArray, condition.status);
			var who = honeycomb.describeWho(condition.of);
			return who + (who == "you" ? " have " : " has ") + (status == null ? condition.status : status.name);
		},
	},
	{
		index: "hasRelic",
		test: function (condition) { return honeycomb.hasRelic(condition.relic); },
		describe: function (condition) { return "you carry " + condition.relic; },
	},
	//--- A character's own mechanic -----------------------------------------------------------------
	{
		//How full a counted mechanic is: Brienne's Resolve, Nettle's Harvest. `full: true` asks for the
		//mechanic's own `maximum` (Grifter's "if your orb is full of symbols").
		index: "mechanicAtLeast",
		test: function (condition, context) {
			var entity = honeycomb.resolveValueSubject(condition.of, context);
			var definition = honeycomb.findDefinition(honeycomb.mechanicArray, condition.mechanic);
			var wanted = condition.full == true && definition != null && definition.maximum != null ? definition.maximum
				: (condition.amount == null ? 1 : condition.amount);
			return honeycomb.mechanicValue(entity, condition.mechanic) >= wanted;
		},
		describe: function (condition) {
			var definition = honeycomb.findDefinition(honeycomb.mechanicArray, condition.mechanic);
			var name = definition == null ? condition.mechanic : definition.name;
			if (condition.full == true) return "a full " + name;
			return (condition.amount == null ? 1 : condition.amount) + " " + name;
		},
	},
	{
		//How many of a tested mechanic's orbs are lit: Severine's Thirst. Omitting `amount` means ALL of them.
		index: "mechanicOrbsLit",
		test: function (condition, context) {
			var entity = honeycomb.resolveValueSubject(condition.of, context);
			var definition = honeycomb.mechanicFor(entity);
			if (definition == null || definition.orbArray == null) return false;
			var needed = condition.amount == null ? definition.orbArray.length : condition.amount;
			return honeycomb.mechanicOrbsLit(entity, context.combat) >= needed;
		},
		describe: function (condition) {
			var definition = honeycomb.findDefinition(honeycomb.mechanicArray, condition.mechanic);
			var name = definition == null ? "the orbs" : definition.name;
			return condition.amount == null ? "all three " + name + " orbs lit" : condition.amount + " " + name + " orbs lit";
		},
	},
	{
		index: "partyContains",
		//Lets content react to WHO is on the team, which is the point of a teambuilding game.
		//
		//`position` narrows it to a place in the party ORDER, front first, 0-based -- so `position: 0`
		//is whoever is walking in front and `position: 1` is the one behind them. This is what lets a
		//map event give the leader a line of their own without writing a conversation for every possible
		//party: one line per character for the front slot, one for the second, and an event that still
		//reads correctly when neither of them is anybody in particular. Absent, it asks the old question
		//and means anywhere in the party.
		test: function (condition) {
			var run = honeycomb.state.run;
			if (run == null) return false;
			if (condition.position != null) {
				var atPosition = run.partyArray[condition.position];
				return atPosition != null && atPosition.characterIndex == condition.character;
			}
			for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
				if (run.partyArray[memberIndex].characterIndex == condition.character) return true;
			}
			return false;
		},
		describe: function (condition) {
			if (condition.position === 0) return condition.character + " is leading the party";
			if (condition.position != null) return condition.character + " is at party position " + condition.position;
			return condition.character + " is in the party";
		},
	},
	{
		index: "canAfford",
		test: function (condition) { return honeycomb.canAfford(condition.costArray); },
		describe: function (condition) { return "you can pay " + JSON.stringify(condition.costArray); },
	},
	{
		//Position. `of` names the entity (default "source"), `rank` is its place among the living on its
		//own side with 0 at the front; `fromBack` counts from the other end, so "at the back" needs no
		//knowledge of how big the party is.
		index: "atRank",
		test: function (condition, context) {
			var entity = honeycomb.resolveValueSubject(condition.of == null ? "source" : condition.of, context);
			var rank = honeycomb.entityRank(entity, context.combat);
			if (rank < 0) return false;
			if (condition.fromBack == true) {
				var living = honeycomb.livingEntityArray(entity.side == "enemy" ? "enemy" : "ally", context.combat).length;
				rank = living - 1 - rank;
			}
			return rank === (condition.rank == null ? 0 : condition.rank);
		},
		describe: function (condition) {
			var rank = condition.rank == null ? 0 : condition.rank;
			if (rank === 0) return honeycomb.describeWhoIs(condition.of) + " at the " + (condition.fromBack ? "back" : "front");
			return honeycomb.describeWhoIs(condition.of) + " " + rank + " from the " + (condition.fromBack ? "back" : "front");
		},
	},
	{
		//Would the move actually move them: Cinder's ally-move cards must not trigger on somebody already
		//standing where they are being sent. Reads the same preview the
		//engine uses to perform the shift, so targeting and outcome cannot disagree. `of` defaults to
		//"target"; `shift` names the partyShift entry.
		index: "wouldShift",
		test: function (condition, context) {
			var entity = honeycomb.resolveValueSubject(condition.of == null ? "target" : condition.of, context);
			if (entity == null) return false;
			return honeycomb.previewShift(entity, condition.shift, context == null ? null : context.combat) != null;
		},
		describe: function (condition) {
			var shift = honeycomb.findDefinition(honeycomb.partyShiftArray, condition.shift);
			return honeycomb.describeWho(condition.of, "target") + " would move " + (shift == null || shift.text == null ? "" : shift.text);
		},
	},
	{
		//A party member's COSTUME. Read off the member rather than a tag, so content can ask for one
		//outfit precisely -- how a reward can favour a card while a given outfit is worn.
		index: "wearsOutfit",
		test: function (condition, context) {
			var entity = honeycomb.resolveValueSubject(condition.of == null ? "source" : condition.of, context);
			return entity != null && entity.outfitIndex == condition.outfit &&
				(condition.character == null || entity.characterIndex == condition.character);
		},
		describe: function (condition) { return "wearing " + condition.outfit; },
	},
	{
		//THE OUTFIT-GATED POOL (CARD-POOL-01 1.1): each alt outfit unlocks cards that only drop once the
		//profile owns it. `character` defaults to the source's own character. Asks the profile, not the
		//loadout, so it holds whatever the member is wearing.
		index: "outfitUnlocked",
		test: function (condition, context) {
			var entity = honeycomb.resolveValueSubject(condition.of == null ? "source" : condition.of, context);
			var characterIndex = condition.character != null ? condition.character : (entity == null ? null : entity.characterIndex);
			if (characterIndex == null || honeycomb.unlocks == null) return false;
			return honeycomb.unlocks.isUnlocked("outfit", condition.outfit, characterIndex) == true;
		},
		describe: function (condition) { return "the " + condition.outfit + " outfit is unlocked"; },
	},
	{
		//Whether the gauntlet may be offered (Anastasia's unlock). Every part must hold:
		//  the release switch is on          tuning.chessmaster.gauntlet.enabled -- false until the player has
		//                                    played her; while false this is false and nothing can reach her
		//  she is not already earned         the profile's character ledger does not hold her
		//  the run is at the offering depth  `offeredAtDepth` regions cleared (0: the first region, whose
		//                                    shops sell it)
		//  the profile has cleared EVERY route tuning.map.route.byBossArray points to -- "a devoted player"
		//                                    (ASSUMED, and switchable: `requiresRoutesCleared`). Read off the table, so
		//                                    pointing a route back at the default shrinks the requirement
		//                                    with it instead of making her unobtainable.
		index: "gauntletOpen",
		test: function () {
			var settings = honeycomb.tuning.chessmaster.gauntlet;
			if (settings.enabled != true) return false;
			if (honeycomb.unlocks == null || honeycomb.discovery == null) return false;
			if (honeycomb.unlocks.isUnlocked("character", settings.unlockCharacter) == true) return false;
			var run = honeycomb.state == null ? null : honeycomb.state.run;
			if (run == null) return false;
			if ((run.regionsCleared == null ? 0 : run.regionsCleared) != settings.offeredAtDepth) return false;
			if (settings.requiresRoutesCleared != true) return true;
			var byBossArray = honeycomb.tuning.map.route.byBossArray == null ? [] : honeycomb.tuning.map.route.byBossArray;
			for (var rowIndex = 0; rowIndex < byBossArray.length; rowIndex++) {
				if (honeycomb.discovery.isKnown("region", byBossArray[rowIndex].regionIndex) != true) return false;
			}
			return true;
		},
		describe: function () { return "every road has been walked"; },
	},
	{
		index: "hasEquipment",
		test: function (condition, context) {
			var entity = honeycomb.resolveValueSubject(condition.of == null ? "source" : condition.of, context);
			return entity != null && entity.equipmentArray != null && entity.equipmentArray.indexOf(condition.equipment) >= 0;
		},
		describe: function (condition) { return "carrying " + condition.equipment; },
	},
	{
		//The card being played is of a given TYPE -- the tribal question. "Whenever a Support card is
		//played" is this condition on an onCardPlayed hook. Any of its types counts.
		index: "cardType",
		test: function (condition, context) {
			return context.card != null && honeycomb.cardHasType(context.card, condition.type);
		},
		describe: function (condition) { return "the card is " + condition.type; },
	},
	{
		//Out of the fight: "if it falls" on a finishing blow, read after the hit.
		index: "isDowned",
		test: function (condition, context) {
			var entity = honeycomb.resolveValueSubject(condition.of == null ? "target" : condition.of, context);
			return entity != null && entity.downed == true;
		},
		describe: function (condition) { return "the " + (condition.of || "target") + " has fallen"; },
	},
	{
		//In the Broken state (Clemence's Fallen Vigil).
		index: "isBroken",
		test: function (condition, context) {
			var entity = honeycomb.resolveValueSubject(condition.of == null ? "target" : condition.of, context);
			return entity != null && entity.broken == true;
		},
		describe: function (condition) { return "the " + (condition.of || "target") + " is Broken"; },
	},
	{
		//Holds at least one debuff.
		index: "hasDebuff",
		test: function (condition, context) {
			return honeycomb.debuffCount(honeycomb.resolveValueSubject(condition.of == null ? "target" : condition.of, context)) > 0;
		},
		describe: function (condition) { return "the " + (condition.of || "target") + " has a debuff"; },
	},
	{
		index: "all",
		test: function (condition, context) {
			for (var scanIndex = 0; scanIndex < condition.conditionArray.length; scanIndex++) {
				if (honeycomb.testCondition(condition.conditionArray[scanIndex], context) == false) return false;
			}
			return true;
		},
	},
	{
		index: "any",
		test: function (condition, context) {
			for (var scanIndex = 0; scanIndex < condition.conditionArray.length; scanIndex++) {
				if (honeycomb.testCondition(condition.conditionArray[scanIndex], context) == true) return true;
			}
			return false;
		},
	},
];

//---------------------------------------------------------------------------------------------------
//Targeting
//---------------------------------------------------------------------------------------------------
//Target modes name a set of entities. Cards declare one; effects may override it per entry.
//
//A target mode is written EITHER as a bare index -- `targetMode: "enemy"` -- OR as a descriptor
//object carrying parameters: `targetMode: {index: "randomEnemy", count: 3}`. The two forms are
//interchangeable everywhere, so existing content is untouched and a card that needs a count simply
//writes one. honeycomb.targetDescriptor normalises the short form.
//
//Each mode resolves itself, so a new way of choosing targets is a table entry rather than another
//branch in a switch.
//
//Descriptor fields the shipped modes understand:
//  count         how many to pick, for the random modes. Default 1. May be a value descriptor, so
//                "one random enemy per Focus stack" needs no new mode.
//  allowRepeats  whether one entity may be picked twice. Default false, so "3 random enemies" hits
//                three DIFFERENT ones while three are standing.
//
//Targets are relative to whoever uses the card. "enemy" means the user's OPPONENTS
//and "ally" the user's TEAMMATES, whichever team the user is on -- so one card works the same in a party
//member's hand, in an enemy's move list, or for a character fighting on the other side. The mode names
//read naturally for the party's own cards, which are most of them; an enemy's attack on the party is a
//"frontEnemy" or "randomEnemy" card, because from the enemy's side the party ARE the enemies.
//
//Definition fields beyond resolving:
//  relation      who it lands on, relative to the user: "opponent", "teammate", "self" or "both"
//  random        the pick is left to chance. Everything resolved against it is logged as CHANCE, which
//                is how a forecast tells damage that will certainly land from damage that might. It
//                picks from the related side, which is also what a forecast spreads "might" over.
//  passesOverBroken  broken combatants are skipped while anybody else in the pool is not broken. Set
//                on the opponent modes that do not pick. See honeycomb.targetCandidateArray
//  wholeTeam     the mode lands on every living member of the related side; the combat screen dims nobody
//                there
//  textObject    how card text names the targets after a verb: "Deal 8 damage TO ALL ENEMIES."
//  textSubject   how card text names them as the subject of one: "ALL ALLIES GAIN 4 Temporary HP."
//                Omitted means the targets go unnamed -- a picked target, or the card's own owner.
//  badge         the short label printed on the card face, or omitted for the ordinary cases
//  name          how anything else names it ("aimed at the enemy in front")
//The text fields are TEMPLATES, filled per the user's team from honeycomb.teamWordArray: {one} "an enemy",
//{bare} "enemy", {many} "enemies", {others} "your other allies", capitalised forms {One} {Bare} {Many}
//{Others}. So the party's card says "ALL enemies" and an enemy's card aimed the same way at the party
//says "ALL party members".
//  plural        whether textSubject takes a plural verb
honeycomb.targetModeArray = [
	{
		index: "enemy", name: "{one}", requiresPick: true, relation: "opponent",
		textSubject: "The target",
		resolve: function (descriptor, context) { return context.target == null ? [] : [context.target]; },
	},
	{
		index: "ally", name: "{one}", requiresPick: true, relation: "teammate",
		textObject: "{one}", textSubject: "{One}", badge: "{Bare}",
		resolve: function (descriptor, context) { return context.target == null ? [] : [context.target]; },
	},
	{
		//An ally other than the user: Severine should not be able to use transfusion on herself. A picked
		//teammate that is never the source, so a blood-price card
		//cannot be turned into a self-heal. `excludeSelf` also keeps the source off the legal-target
		//list and out of the candidate pool (see targetCandidateArray and combatScene.markLegalTargets).
		index: "allyOther", name: "another {one}", requiresPick: true, relation: "teammate", excludeSelf: true,
		textObject: "another {bare}", textSubject: "Another {bare}", badge: "{Bare}",
		resolve: function (descriptor, context) {
			return context.target == null || context.target === context.source ? [] : [context.target];
		},
	},
	{
		//A piece that has a twin (Anastasia's Transposition): a picked teammate whose definition names an
		//`alignmentTwin`. The one mode that may land on a DOWNED fighter (`allowsDowned`), and then
		//only one a summon would refill (honeycomb.refillablePiece's tags) -- a Pawn's corpse is inventory,
		//a bigger piece that fell is gone. `accepts` is the mode's own legality rule, asked by
		//honeycomb.targetModeAllows so the aim, the drop test and the marking all agree.
		index: "piece", name: "a piece", requiresPick: true, relation: "teammate", allowsDowned: true,
		textObject: "a piece", textSubject: "A piece", badge: "Piece",
		accepts: function (entity) {
			var found = honeycomb.entityDefinition(entity);
			if (found == null || found.kind != "enemy" || found.definition.alignmentTwin == null) return false;
			if (entity.downed != true) return true;
			var tagArray = honeycomb.tuning.chessmaster.refillTagArray;
			for (var tagIndex = 0; tagIndex < tagArray.length; tagIndex++) {
				if (honeycomb.definitionHasTag(found.definition, tagArray[tagIndex])) return true;
			}
			return false;
		},
		resolve: function (descriptor, context) { return context.target == null ? [] : [context.target]; },
	},
	{
		//Every piece on the user's side (the King's decree): living teammates tagged `golem`.
		//Not `wholeTeam` -- it is a part of the team, so the combat screen still dims who it misses.
		index: "allPieces", name: "all pieces", requiresPick: false, relation: "teammate",
		textObject: "ALL pieces", textSubject: "ALL pieces", plural: true, badge: "All pieces",
		resolve: function (descriptor, context) {
			return honeycomb.relatedLivingArray("teammate", context).filter(function (entity) {
				return honeycomb.entityHasTag(entity, "golem") == true;
			});
		},
	},
	{
		//One piece, picked by the dice (Anastasia's broken starter: "Starter deals damage to a random
		//friendly piece"). Beside `allPieces` and reading the same `golem` tag; the random modes
		//ignore a targetCondition, so "a random golem" could not be said any other way.
		index: "randomPiece", name: "a random piece", requiresPick: false, relation: "teammate", random: true,
		textObject: "a random piece", textSubject: "A random piece", badge: "Random piece",
		resolve: function (descriptor, context) {
			var pieceArray = honeycomb.relatedLivingArray("teammate", context).filter(function (entity) {
				return honeycomb.entityHasTag(entity, "golem") == true;
			});
			return honeycomb.pickRandomEntityArray(pieceArray, descriptor, context);
		},
	},
	//--- RELATIVE TO THE USER'S OWN PLACE IN THE LINE ------------------------------------------------
	//The piece table speaks in two different vocabularies and they mean different things: "the ally
	//in the front" is ABSOLUTE (rank 0, which `frontAlly` already gives), while "all allies in front of
	//THIS" is RELATIVE -- everyone standing nearer the enemy than the user. The five modes below are the
	//relative half. AHEAD is toward the front (a lower rank), BEHIND is toward the back.
	//A user who is not in the line -- downed, or not on that side at all -- resolves to nothing.
	{
		index: "allyAhead", name: "the ally ahead of it", requiresPick: false, relation: "teammate",
		textObject: "the ally ahead of it", textSubject: "The ally ahead of it", badge: "Ahead",
		resolve: function (descriptor, context) {
			var lineArray = honeycomb.relatedLivingArray("teammate", context);
			var rank = honeycomb.lineIndexOf(lineArray, context.source);
			return rank <= 0 ? [] : [lineArray[rank - 1]];
		},
	},
	{
		index: "allyBehind", name: "the ally behind it", requiresPick: false, relation: "teammate",
		textObject: "the ally behind it", textSubject: "The ally behind it", badge: "Behind",
		resolve: function (descriptor, context) {
			var lineArray = honeycomb.relatedLivingArray("teammate", context);
			var rank = honeycomb.lineIndexOf(lineArray, context.source);
			return rank < 0 || rank >= lineArray.length - 1 ? [] : [lineArray[rank + 1]];
		},
	},
	{
		index: "alliesAhead", name: "the allies ahead of it", requiresPick: false, wholeTeam: true, relation: "teammate",
		textObject: "every ally ahead of it", textSubject: "Every ally ahead of it", plural: true, badge: "Ahead",
		resolve: function (descriptor, context) {
			var lineArray = honeycomb.relatedLivingArray("teammate", context);
			var rank = honeycomb.lineIndexOf(lineArray, context.source);
			return rank <= 0 ? [] : lineArray.slice(0, rank);
		},
	},
	{
		index: "alliesBehind", name: "the allies behind it", requiresPick: false, wholeTeam: true, relation: "teammate",
		textObject: "every ally behind it", textSubject: "Every ally behind it", plural: true, badge: "Behind",
		resolve: function (descriptor, context) {
			var lineArray = honeycomb.relatedLivingArray("teammate", context);
			var rank = honeycomb.lineIndexOf(lineArray, context.source);
			return rank < 0 ? [] : lineArray.slice(rank + 1);
		},
	},
	{
		//The one ahead and the one behind, which is what "adjacent to" means in a line. Used as a
		//CONDITION scope far more than as a target: `hasTag` takes an `over`, so "adjacent to a bishop"
		//is that condition over this mode and needs no condition of its own.
		index: "adjacentAllies", name: "the allies beside it", requiresPick: false, wholeTeam: true, relation: "teammate",
		textObject: "the allies beside it", textSubject: "The allies beside it", plural: true, badge: "Beside",
		resolve: function (descriptor, context) {
			var lineArray = honeycomb.relatedLivingArray("teammate", context);
			var rank = honeycomb.lineIndexOf(lineArray, context.source);
			if (rank < 0) return [];
			var result = [];
			if (rank > 0) result.push(lineArray[rank - 1]);
			if (rank < lineArray.length - 1) result.push(lineArray[rank + 1]);
			return result;
		},
	},
	{
		//Who put it there: a piece's `summonedBy` already records it, so "4 Temporary HP to Anastasia" is
		//her piece pointing back at her rather than a card naming a character by index --
		//which would be wrong the moment somebody else's deck held the same card.
		//Falls back to the user itself, so a move written this way never simply does nothing.
		index: "summoner", name: "whoever summoned it", requiresPick: false, relation: "teammate",
		textObject: "its summoner", textSubject: "Its summoner", badge: "Summoner",
		resolve: function (descriptor, context) {
			var source = context.source;
			if (source == null) return [];
			var found = source.summonedBy == null ? null : honeycomb.findEntity(source.summonedBy, context.combat);
			if (found == null || found.downed == true) return [source];
			return [found];
		},
	},
	{
		index: "self", name: "self", requiresPick: false, textSelf: true, relation: "self",
		resolve: function (descriptor, context) { return context.source == null ? [] : [context.source]; },
	},
	{
		index: "allEnemies", name: "all {many}", requiresPick: false, wholeTeam: true, relation: "opponent",
		textObject: "ALL {many}", textSubject: "ALL {many}", plural: true, badge: "All {many}",
		resolve: function (descriptor, context) { return honeycomb.relatedLivingArray("opponent", context); },
	},
	{
		index: "allAllies", name: "all {many}", requiresPick: false, wholeTeam: true, relation: "teammate",
		textObject: "ALL {many}", textSubject: "ALL {many}", plural: true, badge: "All {many}",
		resolve: function (descriptor, context) { return honeycomb.relatedLivingArray("teammate", context); },
	},
	{
		index: "randomEnemy", name: "a random {bare}", requiresPick: false, relation: "opponent", random: true,
		passesOverBroken: true,
		textObject: "a random {bare}", textSubject: "A random {bare}", badge: "Random",
		resolve: function (descriptor, context) {
			return honeycomb.pickRandomEntityArray(honeycomb.targetCandidateArray(honeycomb.targetModeDefinition(descriptor), context), descriptor, context);
		},
	},
	{
		index: "randomAlly", name: "a random {bare}", requiresPick: false, relation: "teammate", random: true,
		textObject: "a random {bare}", textSubject: "A random {bare}", badge: "Random",
		resolve: function (descriptor, context) {
			return honeycomb.pickRandomEntityArray(honeycomb.targetCandidateArray(honeycomb.targetModeDefinition(descriptor), context), descriptor, context);
		},
	},
	{
		index: "randomAny", name: "anyone at random", requiresPick: false, relation: "both", random: true,
		textObject: "anyone at random", textSubject: "Someone at random", badge: "Random",
		resolve: function (descriptor, context) {
			return honeycomb.pickRandomEntityArray(honeycomb.targetCandidateArray(honeycomb.targetModeDefinition(descriptor), context), descriptor, context);
		},
	},
	{
		index: "everyone", name: "everyone", requiresPick: false, wholeTeam: true, relation: "both",
		textObject: "EVERYONE", textSubject: "EVERYONE", plural: true, badge: "Everyone",
		resolve: function (descriptor, context) {
			return honeycomb.livingEntityArray("enemy", context.combat)
				.concat(honeycomb.livingEntityArray("ally", context.combat));
		},
	},
	{
		index: "none", name: "nothing", requiresPick: false,
		resolve: function () { return []; },
	},
	{
		//What this action just summoned. Read off the action's shared tally, which the
		//`summon` verb writes, so a card can spend the body it made in the same breath: "Summon a Pawn,
		//sacrifice it, deal 6 to all enemies." Naming a rank instead would be wrong the moment a summon
		//refills a corpse somewhere other than the back of the line.
		//Empty before anything has been summoned, so an entry aimed here simply does nothing.
		index: "lastSummoned", name: "what you just summoned", requiresPick: false, textSelf: false, relation: "teammate",
		textObject: "it", textSubject: "It", badge: "Summoned",
		resolve: function (descriptor, context) {
			var id = context == null || context.tally == null ? null : context.tally.lastSummonedId;
			if (id == null) return [];
			var found = honeycomb.findEntity(id, context.combat);
			return found == null ? [] : [found];
		},
	},
	{
		//The card's owner: the party member whose pool contributed it -- or, for a card an AI combatant
		//plays, that combatant. Makes "the caster" meaningful in a game where the deck is shared.
		index: "owner", name: "the card's owner", requiresPick: false, textSelf: true, relation: "self",
		resolve: function (descriptor, context) {
			//Reads the same answer the play path uses for the acting entity, so a card's source and
			//its self-targeting can never point at different characters.
			var owner = honeycomb.cardActingEntity(context.card, context.combat);
			if (owner == null && context.source != null) owner = context.source;
			return owner == null ? [] : [owner];
		},
	},
	//--- Position -------------------------------------------------------------------------------------
	//PARTY ORDER IS A REAL PART OF THE GAME. The front of each side is the member nearest the other
	//side, and most attacks land there; these modes are how content says so. "frontEnemy" is the front
	//of the user's OPPONENTS -- the party's front, when an enemy uses it.
	{
		index: "frontAlly", name: "the {bare} in front", requiresPick: false, relation: "teammate",
		textObject: "the {bare} in front", textSubject: "The {bare} in front", badge: "Front",
		resolve: function (descriptor, context) {
			var front = honeycomb.frontOf(honeycomb.sideForRelation("teammate", honeycomb.userSide(context)), context.combat);
			return front == null ? [] : [front];
		},
	},
	{
		index: "backAlly", name: "the {bare} at the back", requiresPick: false, relation: "teammate",
		textObject: "the {bare} at the back", textSubject: "The {bare} at the back", badge: "Back",
		resolve: function (descriptor, context) {
			var back = honeycomb.backOf(honeycomb.sideForRelation("teammate", honeycomb.userSide(context)), context.combat);
			return back == null ? [] : [back];
		},
	},
	{
		//The front and back of the OTHER team skip anybody broken: a broken member in
		//front is stepped past to the first one still standing behind them.
		index: "frontEnemy", name: "the {bare} in front", requiresPick: false, relation: "opponent",
		passesOverBroken: true,
		textObject: "the {bare} in front", textSubject: "The {bare} in front", badge: "Front",
		resolve: function (descriptor, context) {
			var candidateArray = honeycomb.targetCandidateArray(honeycomb.targetModeDefinition(descriptor), context);
			return candidateArray.length === 0 ? [] : [candidateArray[0]];
		},
	},
	{
		index: "backEnemy", name: "the {bare} at the back", requiresPick: false, relation: "opponent",
		passesOverBroken: true,
		textObject: "the {bare} at the back", textSubject: "The {bare} at the back", badge: "Back",
		resolve: function (descriptor, context) {
			var candidateArray = honeycomb.targetCandidateArray(honeycomb.targetModeDefinition(descriptor), context);
			return candidateArray.length === 0 ? [] : [candidateArray[candidateArray.length - 1]];
		},
	},
	{
		//The teammate holding the most Lust, nearest the front on a tie (Clemence's Confession).
		index: "lustiestAlly", name: "the {bare} with the most Lust", requiresPick: false, relation: "teammate",
		textObject: "the {bare} with the most Lust", textSubject: "The {bare} with the most Lust", badge: "Most Lust",
		resolve: function (descriptor, context) {
			var allyArray = honeycomb.relatedLivingArray("teammate", context);
			var best = null;
			for (var scanIndex = 0; scanIndex < allyArray.length; scanIndex++) {
				var lust = allyArray[scanIndex].lust == null ? 0 : allyArray[scanIndex].lust;
				if (best == null || lust > (best.lust == null ? 0 : best.lust)) best = allyArray[scanIndex];
			}
			return best == null ? [] : [best];
		},
	},
	{
		//The teammate with the smallest share of their health left (Mercy, Font of Grace).
		index: "mostHurtAlly", name: "the most hurt {bare}", requiresPick: false, relation: "teammate",
		textObject: "the most hurt {bare}", textSubject: "The most hurt {bare}", badge: "Most hurt",
		resolve: function (descriptor, context) {
			var allyArray = honeycomb.relatedLivingArray("teammate", context);
			var best = null;
			for (var scanIndex = 0; scanIndex < allyArray.length; scanIndex++) {
				var share = allyArray[scanIndex].health / Math.max(1, allyArray[scanIndex].maxHealth);
				if (best == null || share < best.share) best = { entity: allyArray[scanIndex], share: share };
			}
			return best == null ? [] : [best.entity];
		},
	},
	{
		//The opponent with the least health left, by points (Severine's Stalk).
		index: "weakestEnemy", name: "the {bare} with the least health", requiresPick: false, relation: "opponent",
		textObject: "the {bare} with the least health", textSubject: "The {bare} with the least health", badge: "Weakest",
		resolve: function (descriptor, context) {
			var enemyArray = honeycomb.relatedLivingArray("opponent", context);
			var best = null;
			for (var scanIndex = 0; scanIndex < enemyArray.length; scanIndex++) {
				if (best == null || enemyArray[scanIndex].health < best.health) best = enemyArray[scanIndex];
			}
			return best == null ? [] : [best];
		},
	},
	{
		//Every living teammate except the acting one. Cheap to express, awkward without a mode.
		index: "otherAllies", name: "{others}", requiresPick: false, wholeTeam: true, relation: "teammate",
		textObject: "{others}", textSubject: "{Others}", plural: true, badge: "Others",
		resolve: function (descriptor, context) {
			var allyArray = honeycomb.relatedLivingArray("teammate", context);
			var result = [];
			for (var scanIndex = 0; scanIndex < allyArray.length; scanIndex++) {
				if (context.source != null && allyArray[scanIndex].instanceId == context.source.instanceId) continue;
				result.push(allyArray[scanIndex]);
			}
			return result;
		},
	},

	{
		//Every living enemy EXCEPT the card's own target (Nettle's Spore: "all other enemies"). Asked against
		//the card's context, so the target is the one the card was aimed at.
		index: "otherEnemies", name: "every other {bare}", requiresPick: false, wholeTeam: true, relation: "opponent",
		textObject: "every other {bare}", textSubject: "Every other {bare}", plural: true, badge: "Others",
		resolve: function (descriptor, context) {
			var opponentArray = honeycomb.relatedLivingArray("opponent", context);
			var result = [];
			for (var scanIndex = 0; scanIndex < opponentArray.length; scanIndex++) {
				if (context.target != null && opponentArray[scanIndex].instanceId == context.target.instanceId) continue;
				result.push(opponentArray[scanIndex]);
			}
			return result;
		},
	},

	//--- Card targets -------------------------------------------------------------------------------
	//`kind: "card"` is what keeps a card-targeting card off the characters. The drop zone filters by
	//kind, the resolved list lands in context.targetCardArray rather than context.targetArray, and no
	//entity effect can ever be handed a card by accident.
	//
	//These return CARD INSTANCE IDS, not card objects: piles hold ids, and an id survives the state
	//being rewound by a choice while an object reference would not.
	{
		index: "handCard", name: "a card in your hand", requiresPick: true, kind: "card",
		resolve: function (descriptor, context) {
			return context.targetCardArray == null ? [] : context.targetCardArray;
		},
	},
	{
		index: "randomHandCard", name: "a random card in your hand", requiresPick: false, kind: "card", random: true,
		resolve: function (descriptor, context) {
			return honeycomb.pickRandomCardArray(
				context.combat == null ? [] : context.combat.handArray, descriptor, context);
		},
	},
	{
		index: "randomDiscardCard", name: "a random card in your discard pile", requiresPick: false, kind: "card", random: true,
		resolve: function (descriptor, context) {
			return honeycomb.pickRandomCardArray(
				context.combat == null ? [] : context.combat.discardPileArray, descriptor, context);
		},
	},
	{
		index: "allHandCards", name: "every card in your hand", requiresPick: false, kind: "card",
		resolve: function (descriptor, context) {
			return context.combat == null ? [] : context.combat.handArray.slice();
		},
	},
	{
		//The card being played. Lets a card modify itself without a self-reference in every effect.
		index: "thisCard", name: "this card", requiresPick: false, kind: "card",
		resolve: function (descriptor, context) {
			return context.card == null || context.card.instanceId == null ? [] : [context.card.instanceId];
		},
	},
];

//What a target mode produces: entities, cards, or nothing. Modes that do not say are about entities,
//which is what every mode was before cards could be targeted.
honeycomb.targetModeKind = function (targetMode) {
	var definition = honeycomb.targetModeDefinition(targetMode);
	if (definition == null || definition.kind == null) return "entity";
	return definition.kind;
};

//Files a resolved target list into the right slot on a context. The one place that decides whether a
//resolved list is entities or cards, so no caller has to remember.
honeycomb.applyResolvedTargets = function (context, targetMode, resolvedArray) {
	honeycomb.markChance(context, targetMode, resolvedArray);
	if (honeycomb.targetModeKind(targetMode) == "card") {
		context.targetCardArray = resolvedArray;
		return context;
	}
	context.targetArray = resolvedArray;
	context.target = resolvedArray.length > 0 ? resolvedArray[0] : null;
	return context;
};

//CHANCE. A target left to a random pick marks the context, and everything logged against it inherits
//the mark (see honeycomb.logEvent). That is the one fact a forecast needs to tell damage that WILL
//land from damage that MIGHT: the dry run knows exactly who the pick chose, but a player reading "7 to
//Brienne" off a random attack is being told something the next shuffle of events can change.
//
//The pick is logged too, with everyone it could have landed on, so a forecast can spread the "might"
//across every candidate rather than pinning it on the one the dry run happened to choose.
honeycomb.markChance = function (context, targetMode, resolvedArray) {
	var definition = honeycomb.targetModeDefinition(targetMode);
	if (context == null || definition == null || definition.random != true) return;
	context.chance = true;
	if (definition.relation == null || context.log == null) return;

	//The candidates are the pool the pick is drawn from, relative to whoever is picking -- the same list
	//resolution drew from, so the broken a random attack passes over are not forecast as "might".
	var candidateArray = honeycomb.targetCandidateArray(definition, context);
	var candidateIdArray = [];
	for (var candidateIndex = 0; candidateIndex < candidateArray.length; candidateIndex++) {
		candidateIdArray.push(candidateArray[candidateIndex].instanceId);
	}
	var pickedIdArray = [];
	for (var pickedIndex = 0; pickedIndex < resolvedArray.length; pickedIndex++) {
		if (resolvedArray[pickedIndex] != null) pickedIdArray.push(resolvedArray[pickedIndex].instanceId);
	}
	//The group is the pick's own position in the log: unique within it, and needs no counter in state.
	context.chanceGroup = context.log.length;
	honeycomb.logEvent(context, {
		type: "randomPick",
		group: context.chanceGroup,
		candidateIdArray: candidateIdArray,
		pickedIdArray: pickedIdArray,
	});
};

honeycomb.targetModeIsRandom = function (targetMode) {
	var definition = honeycomb.targetModeDefinition(targetMode);
	return definition != null && definition.random == true;
};

//Picks card instance ids at random from a pile, on the same rules the entity picker follows.
honeycomb.pickRandomCardArray = function (pileArray, descriptor, context) {
	var count = descriptor.count == null ? 1 : honeycomb.resolveValue(descriptor.count, context);
	if (count <= 0) return [];

	var candidateArray = pileArray.slice();
	var result = [];
	for (var pickIndex = 0; pickIndex < count; pickIndex++) {
		if (candidateArray.length === 0) break;
		var position = honeycomb.rng.range(honeycomb.tuning.rng.streamArray.combat, 0, candidateArray.length - 1);
		result.push(candidateArray[position]);
		if (descriptor.allowRepeats != true) candidateArray.splice(position, 1);
	}
	return result;
};

//Normalises the short form. Everything downstream sees an object.
honeycomb.targetDescriptor = function (targetMode) {
	if (targetMode == null) return { index: "none" };
	if (typeof targetMode === "string") return { index: targetMode };
	return targetMode;
};

honeycomb.targetModeDefinition = function (targetMode) {
	return honeycomb.findDefinition(honeycomb.targetModeArray, honeycomb.targetDescriptor(targetMode).index);
};

//True when playing this card needs the player to choose a target first.
honeycomb.targetModeRequiresPick = function (targetMode) {
	var definition = honeycomb.targetModeDefinition(targetMode);
	return definition != null && definition.requiresPick == true;
};

//Who a mode lands on RELATIVE TO WHOEVER USES IT: "opponent", "teammate", "self", "both", or null for a
//mode about cards or nothing. Card types are derived from it (honeycomb.cardTypeRuleArray).
honeycomb.targetModeRelation = function (targetMode) {
	var definition = honeycomb.targetModeDefinition(targetMode);
	return definition == null || definition.relation == null ? null : definition.relation;
};

//Which SIDE a mode may land on for a user on `userSide` (default the party's), or null for either or for
//a mode about cards. The UI reads it to decide what a drag may drop on.
//THE ONE QUESTION EVERY TARGETING PATH ASKS: kind, downed, excludeSelf and side. It used to be
//asked in three places -- the card's drop test, the card's legal-target marking, and the ability's own
//check -- and the third had drifted: it looked only at the SIDE, so Cinder was offered as a legal
//target for her own `allyOther` Marshal's Call, which then resolved to nobody and spent the charge in
//silence. A predicate cannot drift from itself.
//It lives HERE, beside the modes it reads, rather than on combatScene: a scene file is invisible to the
//test suite, and something three interactions depend on has to be checkable.
//A card layers its own `targetCondition` on top (combatScene.targetIsAccepted); that is the only
//question a dragged card asks that an aimed ability does not.
honeycomb.targetModeAllows = function (targetMode, sourceId, sourceSide, entity) {
	if (entity == null) return false;
	//A mode that picks CARDS is never satisfied by pointing at a fighter.
	if (honeycomb.targetModeKind(targetMode) != "entity") return false;
	var modeDefinition = honeycomb.targetModeDefinition(targetMode);
	//Nobody aims at the fallen, except a mode that says it may (`allowsDowned`).
	if (entity.downed == true && (modeDefinition == null || modeDefinition.allowsDowned != true)) return false;
	//A mode's own rule about WHO, beyond side and self (`accepts`).
	if (modeDefinition != null && modeDefinition.accepts != null && modeDefinition.accepts(entity) != true) return false;
	if (modeDefinition != null && modeDefinition.excludeSelf == true && sourceId != null &&
		entity.instanceId === sourceId) return false;
	var side = honeycomb.targetModeSide(targetMode, sourceSide == null ? "ally" : sourceSide);
	return side == null || side == entity.side;
};

honeycomb.targetModeSide = function (targetMode, userSide) {
	var relation = honeycomb.targetModeRelation(targetMode);
	if (relation == null || relation == "both") return null;
	return honeycomb.sideForRelation(relation, userSide == null ? "ally" : userSide);
};

//The side a mode lands on WHOLE for a user on `userSide` -- "both" for everyone -- or null when it picks.
//The combat screen dims nobody on it.
honeycomb.targetModeWholeSide = function (targetMode, userSide) {
	var definition = honeycomb.targetModeDefinition(targetMode);
	if (definition == null || definition.wholeTeam != true) return null;
	return honeycomb.sideForRelation(definition.relation, userSide == null ? "ally" : userSide);
};

//How targets are named, by the team of whoever uses the card. Always worded from the PLAYER's point
//of view: the party's own cards call the other team enemies and their own allies; the OTHER team's
//cards call the party "party members" and their own side enemies, so an enemy's attack on the party
//is never worded as though the party were the enemy's own allies.
honeycomb.teamWordArray = [
	{
		index: "ally",
		opponent: { one: "an enemy", bare: "enemy", many: "enemies", others: "the other enemies" },
		teammate: { one: "an ally", bare: "ally", many: "allies", others: "your other allies" },
	},
	{
		index: "enemy",
		opponent: { one: "a party member", bare: "party member", many: "party members", others: "the other party members" },
		teammate: { one: "an enemy", bare: "enemy", many: "enemies", others: "the other enemies" },
	},
];

//A target mode's text field -- `name`, `textObject`, `textSubject` or `badge` -- filled in for a user on
//`userSide` (default the party's). Null when the mode has no such field.
honeycomb.targetModeText = function (targetMode, field, userSide) {
	var definition = honeycomb.targetModeDefinition(targetMode);
	if (definition == null || definition[field] == null) return null;
	var words = honeycomb.findDefinition(honeycomb.teamWordArray, userSide == null ? "ally" : userSide);
	var relationWords = words == null || (definition.relation != "opponent" && definition.relation != "teammate")
		? null : words[definition.relation];
	return definition[field].replace(/\{(one|bare|many|others|One|Bare|Many|Others)\}/g, function (match, key) {
		if (relationWords == null) return match;
		var word = relationWords[key.toLowerCase()];
		return key.charAt(0) === key.charAt(0).toUpperCase() ? word.charAt(0).toUpperCase() + word.slice(1) : word;
	});
};

//Picks `count` entities from `poolArray` (see honeycomb.targetCandidateArray), drawing from the combat
//stream so the choice is reproducible from the run seed.
//
//Without allowRepeats a candidate is removed once chosen, so "3 random enemies" hits three DIFFERENT
//enemies while three are standing and simply runs out when fewer are. With it the same enemy may be
//hit repeatedly, which is the other thing a designer might mean and is worth being able to say.
honeycomb.pickRandomEntityArray = function (poolArray, descriptor, context) {
	var count = descriptor.count == null ? 1 : honeycomb.resolveValue(descriptor.count, context);
	if (count <= 0) return [];

	var candidateArray = poolArray.slice();
	var result = [];
	for (var pickIndex = 0; pickIndex < count; pickIndex++) {
		if (candidateArray.length === 0) break;
		var picked = honeycomb.rng.pick(honeycomb.tuning.rng.streamArray.combat, candidateArray);
		if (picked == null) break;
		result.push(picked);
		if (descriptor.allowRepeats == true) continue;
		var remainingArray = [];
		for (var scanIndex = 0; scanIndex < candidateArray.length; scanIndex++) {
			if (candidateArray[scanIndex] === picked) continue;
			remainingArray.push(candidateArray[scanIndex]);
		}
		candidateArray = remainingArray;
	}
	return result;
};

//Turns a target mode into a concrete entity list. `context.target` supplies the player's pick for
//modes that require one.
honeycomb.resolveTargetMode = function (targetMode, context) {
	var descriptor = honeycomb.targetDescriptor(targetMode);
	var definition = honeycomb.requireDefinition(honeycomb.targetModeArray, descriptor.index, "honeycomb.targetModeArray");
	if (definition == null) return [];
	return definition.resolve(descriptor, context);
};

//Where a switched intent lands in its owner's move list (the `setIntent` verb): the position
//of `cardIndex`, or -- when no card is named -- of the move after the one telegraphed now, looping. -1
//when the combatant is not AI-controlled, has no list, or does not own the named move. Kept outside the
//verb so a card's forecast, a test and the verb all agree on what "the next move" means.
honeycomb.intentSwitchPosition = function (entity, cardIndex) {
	if (entity == null || entity.downed == true || honeycomb.isAiControlled(entity) == false) return -1;
	var moveArray = honeycomb.aiMoveArray(entity);
	if (moveArray.length === 0) return -1;
	if (cardIndex != null) {
		for (var scanIndex = 0; scanIndex < moveArray.length; scanIndex++) {
			if (moveArray[scanIndex].card == cardIndex) return scanIndex;
		}
		return -1;
	}
	var current = -1;
	for (var currentScan = 0; currentScan < moveArray.length; currentScan++) {
		if (moveArray[currentScan].card == entity.intentCardIndex) { current = currentScan; break; }
	}
	return (current + 1) % moveArray.length;
};

//---------------------------------------------------------------------------------------------------
//Effects
//---------------------------------------------------------------------------------------------------
//The verb table. Each entry resolves itself and describes itself; the description feeds generated
//card text so a card's rules and its printed text can never disagree.
honeycomb.effectArray = [

	{
		index: "damage",
		//The core attack. Runs the full pipeline: source modifiers, target modifiers, temporary health, then
		//health. Every source of damage in the game goes through here so that a new defensive status
		//only has to hook one place.
		resolve: function (entry, context) {
			var baseAmount = honeycomb.resolveValue(entry.amount, context);
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				context.tally.damageDealt += honeycomb.dealDamage(context.source, context.targetArray[targetIndex], baseAmount, entry, context);
			}
		},
		describe: function (entry, describeContext) {
			//Damage a card deals its own user says so, rather than reading like the hit on the enemy.
			var object = honeycomb.describeIsSelf(describeContext) ? " to yourself" : honeycomb.describeObject(describeContext, "to");
			var amount = entry.amount;
			//"Deal 10 damage. Double if the target or you are below half health." (Finish)
			if (amount != null && amount.index == "conditional" && typeof amount.then === "number" && typeof amount["else"] === "number" &&
				amount["else"] > 0 && amount.then === amount["else"] * 2) {
				return "Deal " + honeycomb.describeAmount(amount["else"], entry, describeContext, "damage") + " damage" + object +
					". Double if " + honeycomb.describeCondition(amount.condition) + ".";
			}
			//"Deal 12 damage. Double if the target has Sundered." (a number times an ifStatus multiplier)
			if (amount != null && amount.index == "math" && amount.operation == "multiply") {
				var base = typeof amount.left === "number" ? amount.left : (typeof amount.right === "number" ? amount.right : null);
				var factor = typeof amount.left === "number" ? amount.right : amount.left;
				if (base != null && factor != null && factor.index == "ifStatus" && (factor["else"] == null || factor["else"] === 1)) {
					var status = honeycomb.findDefinition(honeycomb.statusArray, factor.status);
					var multiple = factor.then == null ? 1 : factor.then;
					var who = honeycomb.describeWho(factor.of, "target");
					return "Deal " + honeycomb.describeAmount(base, entry, describeContext, "damage") + " damage" + object + ". " +
						(multiple === 2 ? "Double" : multiple === 3 ? "Triple" : "x" + multiple) + " if " + who +
						(who == "you" ? " have " : " has ") + (status == null ? factor.status : status.name) + ".";
				}
			}
			//"Deal 6 damage, plus 3 for each debuff on you." (Recede, Nail)
			if (amount != null && amount.index == "math" && (amount.operation == "add" || amount.operation == "multiply")) {
				var sum = honeycomb.describeSum(amount);
				if (sum.constant > 0) return "Deal " + honeycomb.describeAmount(sum.constant, entry, describeContext, "damage") + " damage" + object + ", plus " + sum.termText + ".";
				var perText = sum.termText.indexOf(" for each ") >= 0;
				return "Deal " + (perText ? sum.termText + " damage" + object : "damage" + object + " equal to " + sum.termText) + ".";
			}
			//"Consume all Poison. Deal that much damage." (Harvest)
			if (amount != null && amount.index == "tally") return "Deal " + honeycomb.describeValue(amount) + " damage" + object + ".";
			if (amount != null && typeof amount === "object" && amount.index != "conditional") {
				return "Deal damage" + object + " equal to " + honeycomb.describeValue(amount) + ".";
			}
			return "Deal " + honeycomb.describeAmount(entry.amount, entry, describeContext, "damage") + " damage" + object + ".";
		},
	},

	{
		index: "damageIgnoringTemporary",
		//Bypasses temporary health entirely. Kept as its own verb rather than a flag so its intent is
		//obvious in a card definition and it can be searched for during balance passes.
		resolve: function (entry, context) {
			var baseAmount = honeycomb.resolveValue(entry.amount, context);
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				context.tally.damageDealt += honeycomb.dealDamage(context.source, context.targetArray[targetIndex], baseAmount,
					{ ignoreTemporary: true, damageType: entry.damageType }, context);
			}
		},
		describe: function (entry, describeContext) {
			return "Deal " + honeycomb.describeAmount(entry.amount, entry, describeContext, "damage") + " damage" +
				(honeycomb.describeIsSelf(describeContext) ? " to yourself" : honeycomb.describeObject(describeContext, "to")) +
				", ignoring " + honeycomb.keywordName("temporaryHealth") + ".";
		},
		keywordArray: function () { return ["temporaryHealth"]; },
	},

	{
		//LOSING LIFE ("lose 5 life", Blood Tap; "lose 10 life", Mortification). A price, not a hit: it skips
		//Temporary HP and every damage modifier, so the Strength a Blood Tap grants never raises the next
		//one's cost. Self-damage reduction (Thin Skin) and redirects still apply -- they read the price.
		index: "loseHealth",
		resolve: function (entry, context) {
			var baseAmount = honeycomb.resolveValue(entry.amount, context);
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				honeycomb.dealDamage(context.source, context.targetArray[targetIndex], baseAmount,
					{ ignoreTemporary: true, lifeLoss: true, damageType: entry.damageType == null ? "lifeLoss" : entry.damageType }, context);
			}
		},
		describe: function (entry, describeContext) {
			var amount = typeof entry.amount === "number" ? String(entry.amount) : honeycomb.describeValue(entry.amount);
			//A self-cost previews what it will really take once the owner is known (Crimson Covenant doubles it).
			var live = describeContext == null ? null : describeContext.live;
			if (typeof entry.amount === "number" && honeycomb.describeIsSelf(describeContext) && live != null && live.source != null) {
				var effective = honeycomb.selfDamageAmount(live.source, entry.amount);
				if (effective !== entry.amount) amount = describeContext.markup == true ? "⟨" + (effective > entry.amount ? "up" : "down") + ":" + effective + "⟩" : String(effective);
			}
			var subject = honeycomb.describeIsSelf(describeContext) ? null : honeycomb.describeSubject(describeContext);
			if (subject == null) return "Lose " + amount + " HP.";
			return subject + (honeycomb.describePlural(describeContext) ? " lose " : " loses ") + amount + " HP.";
		},
	},

	{
		//TEMPORARY HEALTH. Extra health past the end of the bar rather than a second bar in front of it,
		//and it halves at the start of its owner's turn instead of vanishing. Printed name comes from
		//the keyword table so it is renamed in one place; see honeycomb.keywordArray.
		index: "temporaryHealth",
		resolve: function (entry, context) {
			var amount = honeycomb.resolveValue(entry.amount, context);
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				honeycomb.grantTemporaryHealth(context.targetArray[targetIndex], amount, context);
			}
		},
		describe: function (entry, describeContext) {
			var word = honeycomb.keywordName("temporaryHealth");
			if (typeof entry.amount !== "number") {
				return honeycomb.describeSubjectGains(describeContext) + " " + word + " equal to " +
					honeycomb.describeValue(entry.amount) + ".";
			}
			return honeycomb.describeSubjectGains(describeContext) + " " +
				honeycomb.describeAmount(entry.amount, entry, describeContext, "temporaryHealth") + " " + word + ".";
		},
		keywordArray: function () { return ["temporaryHealth"]; },
	},

	{
		//STRIPPING TEMPORARY HP OFF SOMEBODY. The answer to a party that buys nothing but gold: it takes
		//the wall down without dealing a point of damage, which also narrows the gap lust is measured
		//against and so can break the target on its own.
		index: "removeTemporaryHealth",
		resolve: function (entry, context) {
			var amount = honeycomb.resolveValue(entry.amount, context);
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				var target = context.targetArray[targetIndex];
				var standing = target.temporaryHealth == null ? 0 : target.temporaryHealth;
				var removed = entry.amount == null ? standing : Math.min(standing, Math.floor(amount));
				if (removed <= 0) continue;
				target.temporaryHealth = standing - removed;
				honeycomb.logEvent(context, { type: "temporaryRemoved", targetId: target.instanceId, amount: removed });
				honeycomb.fireEntityHooks("onTemporaryRemoved", { entity: target, amount: removed, context: context });
				honeycomb.checkBreak(target, context);
			}
		},
		describe: function (entry, describeContext) {
			var word = honeycomb.keywordName("temporaryHealth");
			var object = honeycomb.describeObject(describeContext, "from");
			//Taken off the card's own user, it is a loss rather than a removal: "Lose 6 Temporary HP."
			var verb = honeycomb.describeIsSelf(describeContext) ? "Lose " : "Remove ";
			if (entry.amount == null) return verb + "all " + word + object + ".";
			return verb + honeycomb.describeValue(entry.amount) + " " + word + object + ".";
		},
		keywordArray: function () { return ["temporaryHealth"]; },
	},

	{
		//Spending Temporary HP (Brienne's Tithe). The gold is currency rather than a wall: taken
		//from the targets -- the card's owner, or an ally -- and the amount taken is written to the action's
		//tally (`{index: "tally", key: "temporarySpent"}`) for the entries after it to pay out. `amount`
		//omitted spends everything held. Logged as a removal marked `spent`, so the bars follow it.
		//Not a card type: spending your own team's gold is a cost, not help and not harm.
		index: "spendTemporaryHealth",
		//`step`: the spend is rounded DOWN to a multiple of it, so a card that pays per block of Temporary
		//HP spent does not take a remainder it cannot pay for -- three Temporary HP into a card that draws
		//one per four would otherwise be three gone and no card. With a step, what cannot be paid for is
		//not taken.
		resolve: function (entry, context) {
			var amount = entry.amount == null ? null : Math.floor(honeycomb.resolveValue(entry.amount, context));
			var step = entry.step == null ? 0 : Math.floor(honeycomb.resolveValue(entry.step, context));
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				var target = context.targetArray[targetIndex];
				var standing = target.temporaryHealth == null ? 0 : target.temporaryHealth;
				var spent = amount == null ? standing : Math.max(0, Math.min(standing, amount));
				if (step > 0) spent = Math.floor(spent / step) * step;
				if (spent <= 0) continue;
				target.temporaryHealth = standing - spent;
				context.tally.temporarySpent = (context.tally.temporarySpent == null ? 0 : context.tally.temporarySpent) + spent;
				honeycomb.logEvent(context, { type: "temporaryRemoved", targetId: target.instanceId, amount: spent, spent: true });
				honeycomb.fireEntityHooks("onTemporarySpent", { entity: target, amount: spent, context: context });
				honeycomb.checkBreak(target, context);
			}
		},
		describe: function (entry, describeContext) {
			var word = honeycomb.keywordName("temporaryHealth");
			var whose = honeycomb.describeIsSelf(describeContext) ? "your" : "the target's";
			if (entry.amount == null) return "Spend all " + whose + " " + word + ".";
			return "Spend up to " + honeycomb.describeValue(entry.amount) + " of " + whose + " " + word + ".";
		},
		keywordArray: function () { return ["temporaryHealth"]; },
	},

	{
		//Taking a status away for what it was worth (Nettle's Rupture). Removes `stacks` (omitted:
		//all of them) and writes how many actually went to the tally under `consumed`, so the entry after it
		//can deal "twice that". Different from removeStatus, which is a cleanse and reports nothing.
		index: "consumeStatus",
		resolve: function (entry, context) {
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				var target = context.targetArray[targetIndex];
				var held = honeycomb.statusStacks(target, entry.status);
				var wanted = entry.stacks == null ? held : Math.floor(honeycomb.resolveValue(entry.stacks, context));
				var taken = Math.max(0, Math.min(held, wanted));
				if (taken <= 0) continue;
				honeycomb.removeStatus(target, entry.status, taken >= held ? null : taken, context);
				context.tally.consumed = (context.tally.consumed == null ? 0 : context.tally.consumed) + taken;
				//Heard by the world (Rotsinger: Souls come from consuming Poison).
				if (context.combat != null) {
					honeycomb.fireRunHooks("onStatusConsumed", { entity: target, status: entry.status, amount: taken,
						source: context.source == null ? null : context.source, context: context });
				}
			}
		},
		describe: function (entry, describeContext) {
			var status = honeycomb.findDefinition(honeycomb.statusArray, entry.status);
			var name = status == null ? entry.status : status.name;
			var amount = entry.stacks == null ? "all " : honeycomb.describeValue(entry.stacks) + " ";
			return "Consume " + amount + name + honeycomb.describeObject(describeContext, "on") + ".";
		},
		keywordArray: function (entry) { return [entry.status]; },
	},

	{
		index: "spendMechanic",
		//Spends a character's own meter. `all: true` empties it (Phoenix Dive, One with Nothing); otherwise
		//`amount` is the fixed price. What it actually took is tallied as `mechanicSpent`, so the damage
		//after it reads the Stride/Devotion that was really there.
		resolve: function (entry, context) {
			var entity = context.source;
			if (entity == null) return;
			var held = honeycomb.mechanicValue(entity, entry.mechanic);
			var wanted = entry.all == true ? held : Math.floor(honeycomb.resolveValue(entry.amount == null ? 0 : entry.amount, context));
			var taken = Math.max(0, Math.min(held, wanted));
			if (taken <= 0) return;
			honeycomb.spendMechanic(entity, entry.mechanic, taken, context);
			context.tally.mechanicSpent = (context.tally.mechanicSpent == null ? 0 : context.tally.mechanicSpent) + taken;
		},
		describe: function (entry) {
			var definition = honeycomb.findDefinition(honeycomb.mechanicArray == null ? [] : honeycomb.mechanicArray, entry.mechanic);
			var name = definition == null ? entry.mechanic : definition.name;
			return "Spend " + (entry.all == true ? "all " : honeycomb.describeValue(entry.amount) + " ") + name + ".";
		},
	},
	{
		index: "gainMechanic",
		//Adds to a character's own meter. The positive twin of spendMechanic, for a card that feeds a
		//mechanic directly (Nettle's "gain 3 Souls" defensive option).
		resolve: function (entry, context) {
			var entity = context.source;
			if (entity == null) return;
			honeycomb.addMechanic(entity, entry.mechanic, Math.floor(honeycomb.resolveValue(entry.amount == null ? 1 : entry.amount, context)), context);
		},
		describe: function (entry) {
			var definition = honeycomb.findDefinition(honeycomb.mechanicArray == null ? [] : honeycomb.mechanicArray, entry.mechanic);
			return "Gain " + honeycomb.describeValue(entry.amount == null ? 1 : entry.amount) + " " +
				(definition == null ? entry.mechanic : definition.name) + ".";
		},
	},
	{
		//THE NEXT CARD PLAYED COSTS LESS (Brienne's Incredible Wealth): energy off whichever card is played
		//next, by anyone. Discounts stack until that play spends them. See honeycomb.cardCost / playCard.
		index: "discountNextCard",
		resolve: function (entry, context) {
			if (context.combat == null) return;
			var amount = Math.max(0, Math.floor(honeycomb.resolveValue(entry.amount, context)));
			if (amount <= 0) return;
			context.combat.nextCardDiscount = (context.combat.nextCardDiscount == null ? 0 : context.combat.nextCardDiscount) + amount;
			honeycomb.logEvent(context, { type: "message", text: "Next card costs " + context.combat.nextCardDiscount + " less." });
		},
		describe: function (entry) {
			if (typeof entry.amount === "number") return "Your next card costs " + entry.amount + " less.";
			return "Your next card costs 1 less for " + honeycomb.describeValue(entry.amount) + ".";
		},
	},
	{
		//DRAW ONE OF THEIR CARDS (Cinder's Gold Standard): the top card of the draw pile owned by the target
		//(then the discard pile), into the hand. Nothing of theirs anywhere is no draw at all.
		index: "drawOwnedCard",
		resolve: function (entry, context) {
			var combat = context.combat;
			if (combat == null) return;
			var owner = context.target;
			if (owner == null) return;
			var pileIndexArray = ["drawPileArray", "discardPileArray"];
			for (var pileIndex = 0; pileIndex < pileIndexArray.length; pileIndex++) {
				var pile = combat[pileIndexArray[pileIndex]];
				for (var scanIndex = 0; scanIndex < pile.length; scanIndex++) {
					var instance = honeycomb.combat.cardInstance(pile[scanIndex]);
					if (instance == null || instance.ownerInstanceId !== owner.instanceId) continue;
					var instanceId = pile.splice(scanIndex, 1)[0];
					if (combat.handArray.length >= honeycomb.tuning.combat.handSizeMaximum) {
						combat.discardPileArray.push(instanceId);
						honeycomb.logEvent(context, { type: "cardBurned", cardId: instanceId });
						return;
					}
					combat.handArray.push(instanceId);
					honeycomb.logEvent(context, { type: "cardDrawn", cardId: instanceId });
					return;
				}
			}
		},
		describe: function (entry, describeContext) {
			var who = honeycomb.describeTargetDefinition(describeContext) == null ? "the target" : "their";
			return who == "their" ? "Draw one of their cards." : "Draw one of the target's cards.";
		},
	},
	{
		index: "conjureEnemyMove",
		//Cassadora's Magic Trick: pulls a move off the enemies' own kits into the party's hand, distinct
		//picks, as a stolen card (exhausts, costs 1). `count` may be a value, so "one
		//per symbol in the Orb" is a mechanic read rather than a new field.
		resolve: function (entry, context) {
			var amount = Math.max(0, Math.floor(honeycomb.resolveValue(entry.count == null ? 1 : entry.count, context)));
			var pool = [];
			var enemyArray = honeycomb.livingEntityArray("enemy", context.combat);
			for (var enemyIndex = 0; enemyIndex < enemyArray.length; enemyIndex++) {
				var moveArray = honeycomb.moveIndexArray(enemyArray[enemyIndex]);
				for (var moveIndex = 0; moveIndex < moveArray.length; moveIndex++) {
					pool.push({ card: moveArray[moveIndex], enemyIndex: enemyArray[enemyIndex].enemyIndex });
				}
			}
			for (var pickIndex = 0; pickIndex < amount && pool.length > 0; pickIndex++) {
				var chosen = honeycomb.rng.pick(honeycomb.tuning.rng.streamArray.combat, pool);
				if (chosen == null) break;
				//Magic Trick's moves cost 1 (STARTER-LIST), so the copy carries a cost override.
				honeycomb.giveStolenCard(chosen.card, context.source, chosen.enemyIndex, context, { costArray: { energy: 1 } });
				pool.splice(pool.indexOf(chosen), 1);
			}
		},
		describe: function (entry) {
			return "Add " + honeycomb.describeValue(entry.count == null ? 1 : entry.count) + " random enemy moves to your hand.";
		},
	},
	{
		//A status travelling (Nettle's Contagion). Every OTHER living member of the target's team
		//gains the stacks the target holds, times `fraction` (default 1, rounded up). The target keeps its own.
		index: "spreadStatus",
		resolve: function (entry, context) {
			var fraction = entry.fraction == null ? 1 : entry.fraction;
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				var target = context.targetArray[targetIndex];
				var stacks = Math.ceil(honeycomb.statusStacks(target, entry.status) * fraction);
				if (stacks <= 0) continue;
				var teamArray = honeycomb.livingEntityArray(target.side == "enemy" ? "enemy" : "ally", context.combat);
				for (var teamIndex = 0; teamIndex < teamArray.length; teamIndex++) {
					if (teamArray[teamIndex] === target) continue;
					honeycomb.applyStatus(teamArray[teamIndex], entry.status, stacks, context);
				}
			}
		},
		describe: function (entry, describeContext) {
			var status = honeycomb.findDefinition(honeycomb.statusArray, entry.status);
			var name = status == null ? entry.status : status.name;
			return "Every other fighter on the target's side gains " + (entry.fraction == null ? "" : "part of ") +
				"its " + name + ".";
		},
		keywordArray: function (entry) { return [entry.status]; },
	},
	{
		//A status ACTS NOW, as it would at its own tick (Nettle's Quicken Rot and Death Knell).
		//The status names the hook its tick lives in with `tickHook`; one without a tick does nothing.
		//`times` repeats the tick; each repeat reads the stacks the last one left.
		index: "triggerStatus",
		resolve: function (entry, context) {
			var definition = honeycomb.findDefinition(honeycomb.statusArray, entry.status);
			if (definition == null || definition.tickHook == null || definition.hooks == null) return;
			var hook = definition.hooks[definition.tickHook];
			if (typeof hook !== "function") return;
			var times = entry.times == null ? 1 : honeycomb.resolveValue(entry.times, context);
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				var target = context.targetArray[targetIndex];
				for (var repeatIndex = 0; repeatIndex < times; repeatIndex++) {
					if (target.downed == true) break;
					var stacks = honeycomb.statusStacks(target, entry.status);
					if (stacks <= 0) break;
					hook({ entity: target, stacks: stacks, definition: definition, context: context });
				}
			}
		},
		describe: function (entry) {
			var status = honeycomb.findDefinition(honeycomb.statusArray, entry.status);
			var name = status == null ? entry.status : status.name;
			var times = entry.times == null || entry.times == 1 ? "" : (entry.times == 2 ? ", twice" : ", " + entry.times + " times");
			return "The target's " + name + " acts now" + times + ".";
		},
		keywordArray: function (entry) { return [entry.status]; },
	},
	{
		//Statuses passed between fighters: Cinder's Pass the Flame MOVES her debuffs onto an
		//enemy, Spread Misfortune COPIES an enemy's debuffs onto another, Malediction copies an enemy's onto
		//ITSELF (doubling them). `from` is "source" or "target"; the targets receive. `move` strips the
		//giver; `onlyDebuffs` (default true) leaves boons alone; `to` optionally re-aims the receivers.
		index: "transferStatuses",
		resolve: function (entry, context) {
			var onlyDebuffs = entry.onlyDebuffs !== false;
			var receiverArray = context.targetArray;
			if (entry.to != null) receiverArray = honeycomb.resolveTargetMode(entry.to, context);
			var giver = entry.from == "source" ? context.source : context.target;
			if (giver == null || giver.statusArray == null) return;
			var heldArray = giver.statusArray.slice();
			for (var heldIndex = 0; heldIndex < heldArray.length; heldIndex++) {
				var definition = honeycomb.findDefinition(honeycomb.statusArray, heldArray[heldIndex].index);
				if (definition == null) continue;
				if (onlyDebuffs && definition.isDebuff != true) continue;
				var stacks = heldArray[heldIndex].stacks;
				if (stacks == null || stacks <= 0) continue;
				for (var receiverIndex = 0; receiverIndex < receiverArray.length; receiverIndex++) {
					if (receiverArray[receiverIndex] === giver && entry.move == true) continue;
					honeycomb.applyStatus(receiverArray[receiverIndex], definition.index, stacks, context);
				}
				if (entry.move == true) honeycomb.removeStatus(giver, definition.index, null, context);
			}
		},
		describe: function (entry) {
			var what = entry.onlyDebuffs === false ? "statuses" : "debuffs";
			if (entry.from == "source") return (entry.move == true ? "Move all your " : "Copy all your ") + what + " onto the target.";
			var toWordMap = { randomEnemy: "a random enemy", otherEnemies: "every other enemy", allEnemies: "ALL enemies" };
			if (entry.to != null) return "Copy every " + what.replace(/s$/, "") + " on the target onto " + (toWordMap[entry.to] || entry.to) + ".";
			return "Double every " + what.replace(/s$/, "") + " on the target.";
		},
	},

	//--- Intents (Cassadora). An enemy's telegraphed move is a real card, so it can be replaced,
	//re-rolled or taken. Every one of these goes through honeycomb.changeIntent. ----------------------
	{
		//The move becomes nothing: `card` (default tuning.intent.cancelledCard) is what it telegraphs instead.
		index: "cancelIntent",
		resolve: function (entry, context) {
			var replacement = entry.card == null ? honeycomb.tuning.intent.cancelledCard : entry.card;
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				var target = context.targetArray[targetIndex];
				if (target.intentCardIndex == null || target.intentCardIndex == replacement) continue;
				honeycomb.changeIntent(target, replacement, context);
			}
		},
		describe: function () { return "Cancel the target's intent."; },
	},
	{
		//It thinks again: picks a fresh move from its own list, spending charge as a pick always does.
		index: "rerollIntent",
		resolve: function (entry, context) {
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				honeycomb.changeIntent(context.targetArray[targetIndex], null, context);
			}
		},
		describe: function () { return "The target picks a new intent."; },
	},
	{
		//THEFT: a copy of the target's telegraphed move goes into the hand, owned by the card's user, costing
		//nothing and exhausting when played. The target then picks again, or stealing a move would simply be
		//a better turn-skip card.
		index: "stealIntent",
		resolve: function (entry, context) {
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				var target = context.targetArray[targetIndex];
				var stolenIndex = target.intentCardIndex;
				if (stolenIndex == null || stolenIndex == honeycomb.tuning.intent.cancelledCard) continue;
				//`pile` and `cost` redirect where the move lands and what it costs; omitted, it lands in
				//the hand at 0, which is Pilfer and Understudy.
				honeycomb.giveStolenCard(stolenIndex, context.source, target.enemyIndex, context,
					{ pile: entry.pile, costArray: entry.cost });
				honeycomb.changeIntent(target, null, context);
			}
		},
		describe: function (entry) {
			var where = entry.pile === "discardPile" ? "your discard pile"
				: (entry.pile === "drawPile" ? "your draw pile" : "your hand");
			var cost = entry.cost != null && entry.cost.energy != null ? entry.cost.energy : "0";
			return "Steal the target's intent: its move goes into " + where + ", costs " + cost +
				" and exhausts. It picks a new one.";
		},
	},
	{
		//Directing a board (Anastasia). The target's telegraph becomes a NAMED move from its own
		//list, and its place in that list moves with it.
		//  card   the move to telegraph. Omitted, it is the move AFTER the one telegraphed now, looping --
		//         which on a two-move piece is "the other one".
		//
		//THE POINTER MOVES TOO, and that is the whole mechanic. A `sequence` combatant
		//has already stepped past the move it is showing, so `movePosition` is set to one past the move
		//switched TO. A Pawn on [Block, Attack] switched on turn 1 then plays Attack, Block: the two turns
		//trade places and nothing is gained or lost. Overriding the telegraph alone would give Attack,
		//Attack -- the Block skipped outright, a power gain wearing a timing card's text.
		//
		//A target that is not walking a list (any other strategy) has no pointer to move and only its
		//telegraph changes. A card the target does not own is refused: this verb reorders a plan, it does
		//not hand out new ones (cancelIntent is the verb that telegraphs a foreign card).
		index: "setIntent",
		resolve: function (entry, context) {
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				var target = context.targetArray[targetIndex];
				var position = honeycomb.intentSwitchPosition(target, entry.card);
				if (position < 0) continue;
				var moveArray = honeycomb.aiMoveArray(target);
				var cardIndex = moveArray[position].card;
				if (cardIndex == target.intentCardIndex && target.intentSpent != true) continue;
				if (honeycomb.changeIntent(target, cardIndex, context) == false) continue;
				if (honeycomb.aiStrategyFor(target).index == "sequence") target.movePosition = position + 1;
				//Consecutive-use tracking follows the telegraph, as it does for a move the combatant chose.
				target.sameMoveCount = 1;
				target.lastMoveCardIndex = cardIndex;
			}
		},
		describe: function (entry) {
			if (entry.card == null) return "Switch the target's intent to its next move.";
			var card = honeycomb.findDefinition(honeycomb.cardArray, entry.card);
			return "The target's intent becomes " + (card == null ? entry.card : card.name) + ".";
		},
	},
	{
		//REVERSES a side's order (Cinder): front becomes back. `side` "own" (default) or "opposing".
		index: "reverseOrder",
		resolve: function (entry, context) {
			var side = entry.side == "opposing" ? honeycomb.opposingSide(honeycomb.userSide(context)) : honeycomb.userSide(context);
			var livingArray = honeycomb.livingEntityArray(side, context.combat).slice();
			//Each member in turn is sent to the front, last first, which leaves the order reversed and lets
			//every move be counted and heard by the one door that moves people.
			for (var scanIndex = 0; scanIndex < livingArray.length; scanIndex++) {
				honeycomb.shiftEntity(livingArray[scanIndex], "front", context);
			}
		},
		describe: function (entry) { return entry.side == "opposing" ? "Reverse the enemies' order." : "Reverse your party's order."; },
	},

	{
		//LUST ARRIVING. The other way to take somebody out of a fight: it builds on the health bar and
		//breaks its holder the moment it catches the health standing behind it.
		//
		//`lustTagArray` names what KIND of attack this is, for the between-run weakness ledger; leave it
		//off and the card's own tags are used, which is the usual case.
		index: "lust",
		resolve: function (entry, context) {
			var amount = honeycomb.resolveValue(entry.amount, context);
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				honeycomb.gainLust(context.targetArray[targetIndex], amount,
					{ source: context.source, entry: entry }, context);
			}
		},
		describe: function (entry, describeContext) {
			var word = honeycomb.keywordName("lust");
			//Lust a card gives its own user is gained, not inflicted.
			if (honeycomb.describeIsSelf(describeContext)) {
				return "Gain " + honeycomb.describeAmount(entry.amount, entry, describeContext, "lust") + " " + word + ".";
			}
			return "Inflict " + honeycomb.describeAmount(entry.amount, entry, describeContext, "lust") + " " + word +
				honeycomb.describeObject(describeContext, "on") + ".";
		},
		keywordArray: function () { return ["lust"]; },
	},

	{
		//Lust set to a number, up or down (Anastasia's broken rare: "sets her lust to 5 below her HP").
		//Deliberately NOT routed through gainLust/reduceLust: those apply the in-fight modifiers
		//and the between-run weakness, which would mean a card that says "set to N" landing on something
		//else. A set is a set. Break and recovery are still asked, so the state the number implies follows.
		index: "setLust",
		resolve: function (entry, context) {
			var amount = Math.max(0, Math.floor(honeycomb.resolveValue(entry.amount, context)));
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				var target = context.targetArray[targetIndex];
				if (target == null || honeycomb.entityUsesLust(target) == false) continue;
				var before = target.lust == null ? 0 : target.lust;
				if (before === amount) continue;
				target.lust = amount;
				honeycomb.logEvent(context, {
					type: amount > before ? "lust" : "soothe",
					targetId: target.instanceId, amount: Math.abs(amount - before),
					sourceId: context.source == null ? null : context.source.instanceId,
				});
				if (amount > before) honeycomb.checkBreak(target, context);
				else honeycomb.checkRecovery(target, context);
			}
		},
		describe: function (entry, describeContext) {
			var word = honeycomb.keywordName("lust");
			var subject = honeycomb.describeIsSelf(describeContext) ? "Your" : honeycomb.describeSubject(describeContext) + "'s";
			return subject + " " + word + " becomes " + honeycomb.describeValue(entry.amount) + ".";
		},
		keywordArray: function () { return ["lust"]; },
	},

	{
		//LUST LEAVING. Named for what it does rather than "reduceLust", because it is a verb a card
		//prints: "Soothe 8."
		index: "soothe",
		resolve: function (entry, context) {
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				var target = context.targetArray[targetIndex];
				//`all: true` strips every point of Lust a target holds (Clemence's Purify), instead of a
				//fixed amount.
				var amount = entry.all == true ? (target.lust == null ? 0 : target.lust) : honeycomb.resolveValue(entry.amount, context);
				honeycomb.reduceLust(target, amount, context);
			}
		},
		describe: function (entry, describeContext) {
			var word = honeycomb.keywordName("lust");
			var object = honeycomb.describeObject(describeContext, "");
			var amountText = entry.all == true ? "all" : honeycomb.describeAmount(entry.amount, entry, describeContext, "lust");
			return "Remove " + amountText + " " + word +
				(object === "" ? "" : " from" + object) + ".";
		},
		keywordArray: function () { return ["lust"]; },
	},

	{
		index: "heal",
		resolve: function (entry, context) {
			var amount = honeycomb.resolveValue(entry.amount, context);
			//`overflowToTemporary`: whatever would heal past maximum health becomes Temporary HP.
			var options = entry.overflowToTemporary == true ? { overflowToTemporary: true } : null;
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				honeycomb.healEntity(context.targetArray[targetIndex], amount, context, options);
			}
		},
		describe: function (entry, describeContext) {
			var object = honeycomb.describeObject(describeContext, "");
			var overflow = entry.overflowToTemporary == true ? " Healing past full becomes " + honeycomb.keywordName("temporaryHealth") + "." : "";
			//An amount that is an expression reads as "for" that expression: "Heal for the damage dealt."
			if (typeof entry.amount !== "number") return "Heal" + object + " for " + honeycomb.describeValue(entry.amount) + "." + overflow;
			if (object === "") return "Heal " + honeycomb.describeValue(entry.amount) + " HP." + overflow;
			return "Heal" + object + " for " + honeycomb.describeValue(entry.amount) + " HP." + overflow;
		},
		keywordArray: function (entry) { return entry.overflowToTemporary == true ? ["temporaryHealth"] : []; },
	},

	{
		index: "applyStatus",
		resolve: function (entry, context) {
			var stacks = honeycomb.resolveValue(entry.stacks == null ? 1 : entry.stacks, context);
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				honeycomb.applyStatus(context.targetArray[targetIndex], entry.status, stacks, context);
			}
		},
		describe: function (entry, describeContext) {
			var status = honeycomb.findDefinition(honeycomb.statusArray, entry.status);
			var name = status == null ? entry.status : status.name;
			var amount = honeycomb.describeValue(entry.stacks == null ? 1 : entry.stacks);
			//Put on oneself it reads as gaining it; put on anyone else it reads as applying it TO them.
			if (honeycomb.describeIsSelf(describeContext)) return "Gain " + amount + " " + name + ".";
			return "Apply " + amount + " " + name + honeycomb.describeObject(describeContext, "to") + ".";
		},
		keywordArray: function (entry) { return [entry.status]; },
	},

	{
		index: "randomStatus",
		//Applies ONE status from `statusArray`, rolled on the combat stream -- Ill Wish's "Weak or
		//Sundered". Sets the chance flag so a forecast reports a "might" rather than committing the roll.
		resolve: function (entry, context) {
			var list = entry.statusArray == null ? [] : entry.statusArray;
			if (list.length === 0 || context == null) return;
			context.chance = true;
			var picked = list[Math.floor(honeycomb.rng.next(honeycomb.tuning.rng.streamArray.combat) * list.length)];
			var stacks = honeycomb.resolveValue(entry.stacks == null ? 1 : entry.stacks, context);
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				honeycomb.applyStatus(context.targetArray[targetIndex], picked, stacks, context);
			}
		},
		describe: function (entry, describeContext) {
			var nameArray = [];
			var list = entry.statusArray == null ? [] : entry.statusArray;
			for (var scanIndex = 0; scanIndex < list.length; scanIndex++) {
				var definition = honeycomb.findDefinition(honeycomb.statusArray, list[scanIndex]);
				nameArray.push(definition == null ? list[scanIndex] : definition.name);
			}
			var amount = honeycomb.describeValue(entry.stacks == null ? 1 : entry.stacks);
			if (honeycomb.describeIsSelf(describeContext)) return "Gain " + amount + " " + nameArray.join(" or ") + ".";
			return "Apply " + amount + " " + nameArray.join(" or ") + honeycomb.describeObject(describeContext, "to") + ".";
		},
		keywordArray: function (entry) { return entry.statusArray == null ? [] : entry.statusArray; },
	},

	{
		index: "removeStatus",
		resolve: function (entry, context) {
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				var target = context.targetArray[targetIndex];
				//`random: true` picks one debuff the target actually holds, for "remove a random negative
				//status" (Clemence's Pardon). Nothing to pick is a no-op, not a wasted line.
				if (entry.random == true) {
					var heldArray = [];
					var statusList = target.statusArray == null ? [] : target.statusArray;
					for (var scanIndex = 0; scanIndex < statusList.length; scanIndex++) {
						var heldDefinition = honeycomb.findDefinition(honeycomb.statusArray, statusList[scanIndex].index);
						if (heldDefinition != null && heldDefinition.isDebuff == true && statusList[scanIndex].stacks > 0) heldArray.push(heldDefinition.index);
					}
					if (heldArray.length === 0) continue;
					var picked = honeycomb.rng.pick(honeycomb.tuning.rng.streamArray.combat, heldArray);
					if (picked != null) honeycomb.removeStatus(target, picked, entry.stacks, context);
					continue;
				}
				honeycomb.removeStatus(target, entry.status, entry.stacks, context);
			}
		},
		describe: function (entry, describeContext) {
			if (entry.random == true) return "Remove a random negative status" + honeycomb.describeObject(describeContext, "from") + ".";
			var status = honeycomb.findDefinition(honeycomb.statusArray, entry.status);
			return "Remove " + (status == null ? entry.status : status.name) +
				honeycomb.describeObject(describeContext, "from") + ".";
		},
		keywordArray: function (entry) { return [entry.status]; },
	},

	{
		//Remove every debuff. The Juggernaut's little companion whistles the worst of it
		//off him. `count` caps how many stacks of each status are removed; omitted strips them entirely.
		//Lust is not a status, so nothing here can touch it -- see BROKEN-01.
		index: "cleanse",
		resolve: function (entry, context) {
			var count = entry.count == null ? null : honeycomb.resolveValue(entry.count, context);
			//`all: true` also strips positive statuses (Clemence's Purify: "remove all statuses").
			var alsoBuffs = entry.all == true;
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				var entity = context.targetArray[targetIndex];
				var statusArray = entity.statusArray == null ? [] : entity.statusArray.slice();
				for (var statusIndex = 0; statusIndex < statusArray.length; statusIndex++) {
					var definition = honeycomb.findDefinition(honeycomb.statusArray, statusArray[statusIndex].index);
					if (definition == null) continue;
					if (definition.isDebuff != true && alsoBuffs != true) continue;
					honeycomb.removeStatus(entity, definition.index, count, context);
				}
			}
		},
		describe: function (entry, describeContext) {
			return (entry.all == true ? "Remove all statuses" : "Remove all negative statuses") + honeycomb.describeObject(describeContext, "from") + ".";
		},
	},

	{
		//Expand into other cards. Picks `count` cards from `cardArray` WITHOUT replacement
		//and resolves each against its own targets, logging each as a move so the replay reveals it
		//exactly as it reveals any card. This is the seam for a move that becomes several moves; the
		//Juggernaut's Avalanche is its first use. A card marked `onceEver` is dropped from the pool once
		//`profile.onceEverArray` has recorded it, which is how the one-off reward stays one-off.
		index: "throwRandomCards",
		resolve: function (entry, context) {
			var source = context.source;
			var combat = context.combat;
			if (source == null || combat == null) return;
			var count = honeycomb.resolveValue(entry.count == null ? 1 : entry.count, context);
			var profile = honeycomb.state == null ? null : honeycomb.state.profile;
			var onceEverArray = profile == null || profile.onceEverArray == null ? [] : profile.onceEverArray;

			var eligibleArray = [];
			var poolArray = entry.cardArray == null ? [] : entry.cardArray;
			for (var poolIndex = 0; poolIndex < poolArray.length; poolIndex++) {
				var candidate = honeycomb.findDefinition(honeycomb.cardArray, poolArray[poolIndex]);
				if (candidate == null) continue;
				if (candidate.onceEver == true && onceEverArray.indexOf(candidate.index) >= 0) continue;
				eligibleArray.push(candidate.index);
			}

			var stream = honeycomb.tuning.rng.streamArray.combat;
			for (var chooseIndex = 0; chooseIndex < count && eligibleArray.length > 0; chooseIndex++) {
				var pickIndex = Math.floor(honeycomb.rng.next(stream) * eligibleArray.length);
				var card = honeycomb.findDefinition(honeycomb.cardArray, eligibleArray.splice(pickIndex, 1)[0]);
				if (card == null) continue;
				//Mark a once-ever card AS IT IS THROWN, so it can never turn up a second time. With no
				//profile (a dry run outside a run) there is nowhere to record it; the throw still happens.
				if (card.onceEver == true && profile != null) {
					if (profile.onceEverArray == null) profile.onceEverArray = [];
					if (profile.onceEverArray.indexOf(card.index) < 0) profile.onceEverArray.push(card.index);
				}
				honeycomb.logEvent(context, { type: "moveUsed", sourceId: source.instanceId, card: card.index, thrown: true });
				var itemContext = honeycomb.newEffectContext({ source: source, card: card, combat: combat, log: context.log });
				itemContext.actingSide = context.actingSide != null ? context.actingSide : honeycomb.intentActingSide(source);
				honeycomb.applyResolvedTargets(itemContext, card.targetMode, honeycomb.resolveTargetMode(card.targetMode, itemContext));
				honeycomb.resolveEffectArray(card.effectArray, itemContext);
			}
		},
		describe: function (entry) {
			return "Hurl " + honeycomb.describeValue(entry.count == null ? 1 : entry.count) +
				" random things at random targets.";
		},
	},

	{
		//Moves the targets through their own side's order. Most enemy attacks land on the front, so
		//where a character stands is something a card can change on purpose -- and this is the verb.
		//The shift is a honeycomb.partyShiftArray entry: "front", "back", "forward", "backward".
		index: "shiftParty",
		resolve: function (entry, context) {
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				honeycomb.shiftEntity(context.targetArray[targetIndex], entry.shift, context, { pace: entry.pace });
			}
		},
		describe: function (entry, describeContext) {
			var shift = honeycomb.findDefinition(honeycomb.partyShiftArray, entry.shift);
			if (shift == null || shift.text == null) return "";
			var subject = honeycomb.describeSubject(describeContext);
			return (subject == null ? "Move" : subject + (honeycomb.describePlural(describeContext) ? " move" : " moves")) +
				" " + shift.text + ".";
		},
	},

	{
		//STARTER-REWORK-01 §3: two-person `swapParty`. Trades the card's owner with an ally, so a card
		//can move ONE character forward without moving everyone it passed (Cinder's Change Places).
		index: "swapParty",
		resolve: function (entry, context) {
			var source = context.source;
			for (var targetIndex = 0; targetIndex < context.targetArray.length; targetIndex++) {
				var target = context.targetArray[targetIndex];
				//Whoever stood further forward moves back (rank 0 is the front). `backEffectArray` runs on
				//that entity AFTER the swap, which is how Cinder's Reversal strips the back-mover.
				var backMover = null;
				if (entry.backEffectArray != null) {
					var sourceRank = honeycomb.entityRank(source, context.combat);
					var targetRank = honeycomb.entityRank(target, context.combat);
					if (sourceRank >= 0 && targetRank >= 0) backMover = sourceRank < targetRank ? source : target;
				}
				honeycomb.swapEntities(source, target, context, { pace: entry.pace });
				if (backMover != null) {
					var childContext = honeycomb.childContext(context);
					childContext.target = backMover;
					childContext.targetArray = [backMover];
					honeycomb.resolveEffectArray(entry.backEffectArray, childContext);
				}
			}
		},
		describe: function (entry, describeContext) {
			var subject = honeycomb.describeSubject(describeContext);
			var text = (subject == null ? "Swap" : subject + " swaps") + " places with an ally.";
			if (entry.backEffectArray != null) text += " Whoever moves back: " + honeycomb.describeEffectArray(entry.backEffectArray);
			return text;
		},
	},

	{
		index: "gainResource",
		//Covers energy in combat and gold outside it, because resources are one system.
		resolve: function (entry, context) {
			var amount = honeycomb.resolveValue(entry.amount, context);
			honeycomb.addResource(entry.resource, amount);
			honeycomb.logEvent(context, { type: "resource", resource: entry.resource, amount: amount });
		},
		describe: function (entry) {
			var resource = honeycomb.findDefinition(honeycomb.resourceArray, entry.resource);
			return "Gain " + honeycomb.describeValue(entry.amount) + " " + (resource == null ? entry.resource : resource.name) + ".";
		},
	},

	{
		//DRAW BY TYPE (Soothsayer's Second Sight): for each wanted type, the first card of that type from the
		//draw pile, then the discard pile. The types are `cardTypeArray`, or the symbols in the source's
		//`symbolMechanic` (a SLOTS mechanic), one draw per symbol. A type with nothing to draw is skipped.
		index: "drawMatchingCards",
		resolve: function (entry, context) {
			var combat = context.combat;
			if (combat == null) return;
			var typeArray = entry.symbolMechanic != null ? honeycomb.mechanicSymbolArray(context.source, entry.symbolMechanic)
				: (entry.cardTypeArray == null ? [] : entry.cardTypeArray);
			for (var typeIndex = 0; typeIndex < typeArray.length; typeIndex++) {
				var pileIndexArray = ["drawPileArray", "discardPileArray"];
				var found = false;
				for (var pileIndex = 0; pileIndex < pileIndexArray.length && found == false; pileIndex++) {
					var pile = combat[pileIndexArray[pileIndex]];
					for (var scanIndex = 0; scanIndex < pile.length; scanIndex++) {
						var instance = honeycomb.combat.cardInstance(pile[scanIndex]);
						var resolved = instance == null ? null : honeycomb.resolveCard(instance);
						if (resolved == null || honeycomb.cardHasType(resolved, typeArray[typeIndex]) == false) continue;
						var instanceId = pile.splice(scanIndex, 1)[0];
						found = true;
						if (combat.handArray.length >= honeycomb.tuning.combat.handSizeMaximum) {
							combat.discardPileArray.push(instanceId);
							honeycomb.logEvent(context, { type: "cardBurned", cardId: instanceId });
						} else {
							combat.handArray.push(instanceId);
							honeycomb.logEvent(context, { type: "cardDrawn", cardId: instanceId });
						}
						break;
					}
				}
			}
		},
		describe: function (entry) {
			if (entry.symbolMechanic != null) {
				var definition = honeycomb.findDefinition(honeycomb.mechanicArray == null ? [] : honeycomb.mechanicArray, entry.symbolMechanic);
				return "For each symbol in your " + (definition == null ? entry.symbolMechanic : definition.name) + ", draw a card of that type.";
			}
			var nameArray = [];
			for (var typeIndex = 0; typeIndex < (entry.cardTypeArray == null ? 0 : entry.cardTypeArray.length); typeIndex++) {
				var type = honeycomb.cardType(entry.cardTypeArray[typeIndex]);
				nameArray.push(type == null ? entry.cardTypeArray[typeIndex] : type.name);
			}
			return "Draw a " + nameArray.join(" card and a ") + " card.";
		},
	},

	{
		index: "drawCards",
		resolve: function (entry, context) {
			var amount = honeycomb.resolveValue(entry.amount, context);
			honeycomb.drawCards(amount, context);
		},
		describe: function (entry) {
			if (typeof entry.amount === "number") return entry.amount === 1 ? "Draw a card." : "Draw " + entry.amount + " cards.";
			var per = honeycomb.describePerUnit(entry.amount);
			if (per != null) return "Draw a card for each " + per + ".";
			return "Draw cards equal to " + honeycomb.describeValue(entry.amount) + ".";
		},
	},

	{
		index: "scry",
		//Look at the top `count` cards of the draw pile; the player may send any of them to the discard.
		//The rest stay on top in their original order. A question, so the pass rewinds and replays like
		//any other choice; the piles are only touched once the answer exists.
		resolve: function (entry, context) {
			var combat = context == null ? null : context.combat;
			if (combat == null) return;
			if (honeycomb.choicePending(context) == true) return;
			//Nothing to look at: say so on the board rather than resolving to nothing.
			if (combat.drawPileArray.length === 0) {
				honeycomb.logEvent(context, { type: "message",
					text: entry.emptyText == null ? honeycomb.tuning.combat.scryEmptyText : entry.emptyText });
				return;
			}
			var count = Math.min(honeycomb.resolveValue(entry.count == null ? 1 : entry.count, context), combat.drawPileArray.length);
			if (count <= 0) return;
			var answer = honeycomb.requestChoice(context, {
				index: "drawPileCard",
				prompt: entry.prompt == null ? "Discard any of these?" : entry.prompt,
				minimum: 0,
				maximum: count,
				limit: count,
			});
			if (answer == null) return;
			var chosenArray = answer.chosenArray == null ? [] : answer.chosenArray;
			for (var chosenIndex = 0; chosenIndex < chosenArray.length; chosenIndex++) {
				honeycomb.moveCardToPile(chosenArray[chosenIndex], "discardPile", context);
			}
		},
		//Scry is a NAMED mechanic, so the card prints the word and the keyword sidecar
		//explains it; see honeycomb.keywordArray.
		describe: function (entry) { return "Scry " + honeycomb.describeValue(entry.count == null ? 1 : entry.count) + "."; },
		keywordArray: function () { return ["scry"]; },
	},

	{
		index: "discardCards",
		resolve: function (entry, context) {
			var amount = honeycomb.resolveValue(entry.amount, context);
			honeycomb.discardRandomCards(amount, context);
		},
		describe: function (entry) {
			if (typeof entry.amount === "number") return entry.amount === 1 ? "Discard a random card." : "Discard " + entry.amount + " random cards.";
			return "Discard random cards equal to " + honeycomb.describeValue(entry.amount) + ".";
		},
	},

	{
		index: "addCardToPile",
		//Shuffles a generated card into a pile. `pile` is drawPile, discardPile or hand. This is how
		//curses and one-shot bonuses reach the player mid-fight.
		resolve: function (entry, context) {
			var amount = honeycomb.resolveValue(entry.count == null ? 1 : entry.count, context);
			for (var copyIndex = 0; copyIndex < amount; copyIndex++) {
				honeycomb.addCardToPile(entry.card, entry.pile, context);
			}
		},
		describe: function (entry) {
			var card = honeycomb.findDefinition(honeycomb.cardArray, entry.card);
			return "Shuffle " + honeycomb.describeValue(entry.count == null ? 1 : entry.count) + " " +
				(card == null ? entry.card : card.name) + " into your " + entry.pile + ".";
		},
	},

	{
		index: "addCardToDeck",
		//A PERMANENT deck change: survives the fight and is written to the run. The separation from
		//addCardToPile matters, since one is a combat trick and the other is a run-defining choice.
		//Each copy is logged with its instance, so a screen can SHOW the card that arrived -- with its
		//owner -- rather than only saying so.
		//The run deck is the party's, and only the party may write to it by default. Anastasia's pieces
		//are two things at once -- her board, and the gauntlet's enemies -- so an ENEMY-side card that
		//shuffles a card in must not silently hand it to the player just because the verb does not
		//otherwise say whose deck it meant.
		//`evenFromOpponents: true` is how content asks for the old behaviour on purpose -- a curse an
		//enemy forces into your deck is a real idea, and it should have to say so.
		resolve: function (entry, context) {
			if (entry.evenFromOpponents != true && honeycomb.userSide(context) != "ally") {
				honeycomb.logEvent(context, { type: "deckCardRefused", card: entry.card, reason: "notThePartysDeck" });
				return;
			}
			var amount = honeycomb.resolveValue(entry.count == null ? 1 : entry.count, context);
			for (var copyIndex = 0; copyIndex < amount; copyIndex++) {
				var instance = honeycomb.addCardToRunDeck(entry.card, entry.ownerInstanceId);
				if (instance != null) honeycomb.logEvent(context, { type: "deckCardAdded", card: entry.card, cardId: instance.instanceId });
				//`intoDrawPile`: the same card is also shuffled into this fight's draw pile, so "shuffle into your
				//deck" is true now and not only from the next fight.
				var combat = context == null ? null : context.combat;
				if (instance != null && entry.intoDrawPile == true && combat != null && combat.drawPileArray != null) {
					var position = honeycomb.rng.range(honeycomb.tuning.rng.streamArray.shuffle, 0, combat.drawPileArray.length);
					combat.drawPileArray.splice(position, 0, instance.instanceId);
					honeycomb.logEvent(context, { type: "cardCreated", cardId: instance.instanceId, card: instance.cardIndex, pile: "drawPile",
						sourceId: context.source == null ? null : context.source.instanceId });
				}
			}
		},
		describe: function (entry) {
			var card = honeycomb.findDefinition(honeycomb.cardArray, entry.card);
			var count = entry.count == null ? 1 : entry.count;
			return "Add " + (count === 1 ? "" : count + " ") + (card == null ? entry.card : card.name) + " to your deck.";
		},
	},

	{
		index: "removeCardFromDeck",
		//A named instance, else a named card, else -- neither given -- one AT RANDOM: you will not get to
		//choose which.
		resolve: function (entry, context) {
			var cardInstanceId = entry.cardInstanceId;
			var random = false;
			if (cardInstanceId == null && entry.card == null) {
				var picked = honeycomb.randomRunDeckCard();
				cardInstanceId = picked == null ? null : picked.instanceId;
				if (cardInstanceId == null) return;
				random = true;
			}
			var removed = honeycomb.removeCardFromRunDeck(cardInstanceId, entry.card);
			if (removed == null) return;
			//The instance is gone from the deck, so the entry carries what a screen needs to draw it.
			//`random` says the pick was chance: a PREVIEW of this choice must not show which card it landed
			//on in its dry run, since the real run rolls again.
			honeycomb.logEvent(context, { type: "deckCardRemoved", card: removed.cardIndex, cardId: removed.instanceId,
				upgradeLevel: removed.upgradeLevel, ownerInstanceId: removed.ownerInstanceId, random: random });
		},
		describe: function (entry) {
			var card = entry.card == null ? null : honeycomb.findDefinition(honeycomb.cardArray, entry.card);
			if (card != null) return "Remove " + card.name + " from your deck.";
			return entry.cardInstanceId == null ? "Remove a random card from your deck." : "Remove a card from your deck.";
		},
	},

	{
		index: "upgradeCard",
		resolve: function (entry, context) {
			if (honeycomb.upgradeCardInstance(entry.cardInstanceId, entry.levels == null ? 1 : entry.levels) != true) return;
			honeycomb.logEvent(context, { type: "cardUpgraded", cardId: entry.cardInstanceId });
		},
		describe: function () { return "Upgrade a card."; },
	},

	{
		index: "gainRelic",
		//A named relic -- or, when the party already carries it, its worth in experience. The preview
		//says which, so a choice never promises a relic it cannot give.
		resolve: function (entry, context) {
			honeycomb.grantRelicOrExperience(entry.relic, context);
		},
		describe: function (entry) {
			var relic = honeycomb.relicArray == null ? null : honeycomb.findDefinition(honeycomb.relicArray, entry.relic);
			var name = relic == null ? entry.relic : relic.name;
			if (honeycomb.state != null && honeycomb.state.run != null && honeycomb.relicWouldDuplicate(entry.relic) == true) {
				return name + " is already carried: gain " + honeycomb.duplicateRelicExperience(entry.relic) + " Experience instead.";
			}
			return "Gain " + name + ".";
		},
	},

	{
		index: "gainRandomRelic",
		//A relic the party does NOT already carry, picked from the event stream -- optionally only one
		//`rarity`, or one `pool` (see honeycomb.uncarriedRelicArray). Nothing left to give pays experience
		//instead. The other answer: random, but never a duplicate.
		resolve: function (entry, context) {
			var candidateArray = honeycomb.uncarriedRelicArray(entry.rarity, entry.pool);
			var picked = candidateArray.length === 0 ? null
				: honeycomb.rng.pick(honeycomb.tuning.rng.streamArray.mapEvent, candidateArray);
			//Marked random so a preview shows "a relic", not the one this dry run happened to roll.
			honeycomb.grantRelicOrExperience(picked == null ? null : picked.index, context, { random: true });
		},
		describe: function (entry) {
			return "Gain a random " + (entry.rarity == null ? "" : entry.rarity + " ") + "relic you do not have.";
		},
	},

	//--- Effects that START or SHAPE a fight ---------------------------------------------------------
	//Headless like everything else here: they write a REQUEST onto state, and whatever screen is
	//showing honours it afterwards. That is what lets an event start a battle without the effect layer
	//knowing a scene exists, and keeps both verbs testable with no DOM.
	{
		index: "startCombat",
		//Asks for a fight. `encounter` names a honeycomb.encounterArray entry. `continuation` says where
		//the player goes once it is won -- a honeycomb.combatContinuationArray entry plus its parameters.
		//Omitted, the fight returns to wherever it was asked for from, which for an event means the
		//event itself, on `victoryPage` if one is named.
		//Between runs, the request is left on the state instead of a run, and whoever
		//opened the event starts the fight its own way: a Lust Battle builds a party of its own from
		//`partyArray` (character indices; "subject" is the event's character) and comes back to
		//`victoryPage` or `defeatPage`, or to the separate events `victoryEvent` / `defeatEvent`.
		//
		//SCENE STRUCTURE, NOT A REWARD. A fight is part of the shape of the scene rather than something
		//the scene pays out, so a host that resolves no effects still resolves this one -- which is what
		//lets the Event Gallery replay a Lust Battle. See honeycomb.structuralEffectArray.
		sceneStructure: true,
		resolve: function (entry, context) {
			var holder = honeycomb.pendingCombatHolder == null ? (honeycomb.state == null ? null : honeycomb.state.run)
				: honeycomb.pendingCombatHolder();
			if (holder == null) return;
			holder.pendingCombat = {
				encounterIndex: entry.encounter,
				continuation: entry.continuation == null ? null : entry.continuation,
				victoryPage: entry.victoryPage == null ? null : entry.victoryPage,
				defeatPage: entry.defeatPage == null ? null : entry.defeatPage,
				//A separate event per outcome, so a Lust Battle can show a different follow-up scene for a win
				//and a loss. Read by honeycomb.lustEvents.battleContinuation and honeycomb.lustEvents.returnParams;
				//an event that omits `victoryEvent` falls through to "Lust Event Cleared!" instead.
				victoryEvent: entry.victoryEvent == null ? null : entry.victoryEvent,
				defeatEvent: entry.defeatEvent == null ? null : entry.defeatEvent,
				partyArray: entry.partyArray == null ? null : entry.partyArray,
				rewardArray: entry.rewardArray == null ? null : entry.rewardArray,
				//What decides this fight, over its encounter's.
				victoryConditionArray: entry.victoryConditionArray == null ? null : entry.victoryConditionArray,
				defeatConditionArray: entry.defeatConditionArray == null ? null : entry.defeatConditionArray,
			};
			honeycomb.logEvent(context, { type: "combatRequested", encounter: entry.encounter });
		},
		describe: function (entry) {
			var encounter = honeycomb.encounterArray == null ? null : honeycomb.findDefinition(honeycomb.encounterArray, entry.encounter);
			return "Fight " + (encounter == null || encounter.name == null ? "something" : encounter.name) + ".";
		},
	},
	{
		//Adds a card to THIS fight's reward screen, in a slot of its own. A fight that means something
		//can pay out something specific without a bespoke reward table.
		index: "addRewardCard",
		resolve: function (entry, context) {
			var combat = context.combat;
			if (combat == null) return;
			if (combat.bonusRewardArray == null) combat.bonusRewardArray = [];
			var count = entry.count == null ? 1 : honeycomb.resolveValue(entry.count, context);
			for (var addIndex = 0; addIndex < count; addIndex++) {
				combat.bonusRewardArray.push({ cardIndex: entry.card, ownerCharacterIndex: entry.owner == null ? null : entry.owner });
			}
			honeycomb.logEvent(context, { type: "rewardAdded", card: entry.card });
		},
		describe: function (entry) {
			var card = honeycomb.findDefinition(honeycomb.cardArray, entry.card);
			return "Offer " + (card == null ? entry.card : card.name) + " as a reward.";
		},
	},

	{
		index: "exhaustSelf",
		//Removes the played card from the fight rather than discarding it.
		resolve: function (entry, context) {
			if (context.card == null) return;
			context.card.exhaustRequested = true;
		},
		describe: function () { return "Exhaust."; },
	},

	{
		index: "repeat",
		//Runs a nested list a number of times. `times` may be a value descriptor, so "once per enemy"
		//is expressible without a new effect.
		resolve: function (entry, context) {
			var times = honeycomb.resolveValue(entry.times, context);
			for (var repeatIndex = 0; repeatIndex < times; repeatIndex++) {
				honeycomb.resolveEffectArray(entry.effectArray, honeycomb.childContext(context));
			}
		},
		describe: function (entry, describeContext) {
			var inner = honeycomb.describeEffectArray(entry.effectArray, describeContext);
			var times = honeycomb.describeValue(entry.times);
			//One line repeated reads as that line N times: "Deal 3 damage 3 times." Several read as a block.
			if (entry.effectArray != null && entry.effectArray.length === 1 && /\.$/.test(inner) && inner.indexOf(". ") < 0) {
				return inner.slice(0, -1) + " " + times + " times.";
			}
			return times + " times: " + inner
		},
	},

	{
		index: "branch",
		//An if/else over nested effect lists. Entry-level `condition` covers the common case; this
		//exists for when an else branch is genuinely needed.
		resolve: function (entry, context) {
			var passed = honeycomb.testCondition(entry.test, context);
			var chosenArray = passed ? entry.thenArray : entry.elseArray;
			honeycomb.resolveEffectArray(chosenArray, honeycomb.childContext(context));
		},
		describe: function (entry, describeContext) {
			return honeycomb.describeEffectArray(entry.thenArray, describeContext) +
				(entry.elseArray == null ? "" : " Otherwise: " + honeycomb.describeEffectArray(entry.elseArray, describeContext));
		},
	},

	{
		index: "forEachTarget",
		//Re-resolves a nested list once per target, with `target` bound to each in turn. Lets a card
		//do something per-enemy that depends on that enemy.
		resolve: function (entry, context) {
			var scopeArray = honeycomb.resolveTargetMode(entry.over, context);
			//One pick, logged once, shared by every pass it produced.
			var marker = { log: context.log, combat: context.combat };
			honeycomb.markChance(marker, entry.over, scopeArray);
			for (var scopeIndex = 0; scopeIndex < scopeArray.length; scopeIndex++) {
				var childContext = honeycomb.childContext(context);
				childContext.target = scopeArray[scopeIndex];
				childContext.targetArray = [scopeArray[scopeIndex]];
				if (marker.chance == true) {
					childContext.chance = true;
					childContext.chanceGroup = marker.chanceGroup;
				}
				honeycomb.resolveEffectArray(entry.effectArray, childContext);
			}
		},
		describe: function (entry) {
			return honeycomb.describeEffectArray(entry.effectArray, { targetMode: entry.over });
		},
	},

	//--- Effects that act on CARDS ------------------------------------------------------------------
	//Each reads context.targetCardArray, which only a card-kind target mode or a chooseCards effect
	//can fill. An entity can never arrive here, and these can never damage a character.
	{
		index: "exhaustCard",
		//Removes the targeted cards from the fight, wherever they are.
		resolve: function (entry, context) {
			var cardArray = honeycomb.contextCardIdArray(context);
			for (var scanIndex = 0; scanIndex < cardArray.length; scanIndex++) {
				honeycomb.exhaustCardById(cardArray[scanIndex], context);
			}
		},
		describe: function () { return "Exhaust it."; },
	},
	{
		index: "discardCard",
		resolve: function (entry, context) {
			var cardArray = honeycomb.contextCardIdArray(context);
			for (var scanIndex = 0; scanIndex < cardArray.length; scanIndex++) {
				honeycomb.moveCardToPile(cardArray[scanIndex], "discardPile", context);
			}
		},
		describe: function () { return "Discard it."; },
	},
	{
		index: "returnCardToHand",
		resolve: function (entry, context) {
			var cardArray = honeycomb.contextCardIdArray(context);
			for (var scanIndex = 0; scanIndex < cardArray.length; scanIndex++) {
				honeycomb.moveCardToPile(cardArray[scanIndex], "hand", context);
			}
		},
		describe: function () { return "Return it to your hand."; },
	},
	{
		index: "upgradeTargetCard",
		//A PERMANENT change when the card belongs to the run deck, and a fight-long one when it is a
		//card created mid-combat. Both are the same call; which it is depends on where the card lives.
		//
		//A card offering SEVERAL UPGRADE PATHS asks which one first -- an ordinary
		//question through the choice system, so it replays and rewinds like any other, and a card with
		//one path (or none) never asks.
		resolve: function (entry, context) {
			var cardArray = honeycomb.contextCardIdArray(context);
			var levels = entry.levels == null ? 1 : honeycomb.resolveValue(entry.levels, context);
			for (var scanIndex = 0; scanIndex < cardArray.length; scanIndex++) {
				var pathIndex = honeycomb.chooseUpgradePath(cardArray[scanIndex], context);
				//A pending question: this pass is being abandoned and will run again with the answer.
				if (honeycomb.choicePending(context) == true) return;
				//`forThisCombat: true` (Whetted Edge) makes it a one-fight upgrade on a deck card.
				if (entry.forThisCombat == true) honeycomb.upgradeCardForCombat(cardArray[scanIndex], levels, pathIndex);
				else honeycomb.upgradeCardAnywhere(cardArray[scanIndex], levels, pathIndex);
				honeycomb.logEvent(context, { type: "cardUpgraded", cardId: cardArray[scanIndex], path: pathIndex });
			}
		},
		describe: function (entry) {
			return "Upgrade it" + (entry.levels == null || entry.levels === 1 ? "" : " " + entry.levels + " times") + ".";
		},
	},
	{
		index: "modifyCardCost",
		//Changes what a card costs for the rest of the fight. Written onto the instance rather than
		//the definition, so one copy can be discounted without discounting every copy.
		resolve: function (entry, context) {
			var cardArray = honeycomb.contextCardIdArray(context);
			var amount = honeycomb.resolveValue(entry.amount, context);
			for (var scanIndex = 0; scanIndex < cardArray.length; scanIndex++) {
				var instance = honeycomb.combat.cardInstance(cardArray[scanIndex]);
				if (instance == null) continue;
				if (instance.costModifierArray == null) instance.costModifierArray = {};
				var resource = entry.resource == null ? "energy" : entry.resource;
				var existing = instance.costModifierArray[resource];
				instance.costModifierArray[resource] = (existing == null ? 0 : existing) +
					(entry.setTo != null ? 0 : amount);
				if (entry.setTo != null) instance.costOverrideArray = instance.costOverrideArray || {};
				if (entry.setTo != null) instance.costOverrideArray[resource] = entry.setTo;
				honeycomb.logEvent(context, { type: "cardCostChanged", cardId: cardArray[scanIndex] });
			}
		},
		describe: function (entry) {
			if (entry.setTo != null) return "Its cost becomes " + entry.setTo + ".";
			var amount = honeycomb.describeValue(entry.amount);
			return "Its cost changes by " + amount + ".";
		},
	},
	{
		index: "duplicateCard",
		//Puts a copy of the targeted card into a pile. The copy is a fresh instance sharing the
		//original's upgrade level and owner, so a duplicated Blood Pact still belongs to Severine.
		resolve: function (entry, context) {
			var cardArray = honeycomb.contextCardIdArray(context);
			var copies = entry.count == null ? 1 : honeycomb.resolveValue(entry.count, context);
			for (var scanIndex = 0; scanIndex < cardArray.length; scanIndex++) {
				var instance = honeycomb.combat.cardInstance(cardArray[scanIndex]);
				if (instance == null) continue;
				for (var copyIndex = 0; copyIndex < copies; copyIndex++) {
					var created = honeycomb.addCardToPile(instance.cardIndex,
						entry.pile == null ? "hand" : entry.pile, context);
					if (created == null) continue;
					created.upgradeLevel = instance.upgradeLevel;
					created.ownerInstanceId = instance.ownerInstanceId;
				}
			}
		},
		describe: function (entry) {
			return "Add " + (entry.count == null ? 1 : entry.count) + " copy of it to your " +
				(entry.pile == null ? "hand" : entry.pile) + ".";
		},
	},
	{
		index: "playChosenCardOnOwner",
		//Severine's Full Control: a chosen card's effects resolve against the ABILITY'S OWNER instead of
		//its normal target. The card is not spent -- only a copy of what it would do lands on her, which
		//is the cost the wheel trades for.
		resolve: function (entry, context) {
			var owner = context.source;
			if (owner == null) return;
			var cardArray = honeycomb.contextCardIdArray(context);
			for (var scanIndex = 0; scanIndex < cardArray.length; scanIndex++) {
				var resolved = honeycomb.combat.resolveById(cardArray[scanIndex]);
				if (resolved == null || resolved.effectArray == null) continue;
				var childContext = honeycomb.childContext(context);
				childContext.target = owner;
				childContext.targetArray = [owner];
				honeycomb.resolveEffectArray(resolved.effectArray, childContext);
			}
		},
		describe: function () { return "Play a copy of it on its owner."; },
	},
	{
		index: "endTurn",
		//Ends the player's turn once this action resolves (Brienne's Aegis). The combat screen QUEUES the
		//turn end so it lands after the action's animation; the combat keeps `endTurnRequested` as the
		//record that the action spent the turn. Headless there is no scene, so nothing else happens here.
		resolve: function (entry, context) {
			if (context.combat == null) return;
			context.combat.endTurnRequested = true;
			if (honeycomb.combatScene != null && honeycomb.combatScene.queueInput != null) {
				honeycomb.combatScene.queueInput({ kind: "endTurn" });
			}
		},
		describe: function () { return "End the turn."; },
	},
	{
		index: "removeTargetCardFromDeck",
		//The permanent one. Distinct from discardCard the way addCardToDeck is distinct from
		//addCardToPile: one is a combat trick, the other is a run-defining choice.
		resolve: function (entry, context) {
			var cardArray = honeycomb.contextCardIdArray(context);
			for (var scanIndex = 0; scanIndex < cardArray.length; scanIndex++) {
				var removed = honeycomb.removeCardFromRunDeck(cardArray[scanIndex], null);
				if (removed == null) continue;
				//Mid-fight the copy may still sit in a pile (Grifter's Vanishing Act exhausts it first), so it
				//lives out the fight as a temporary card rather than leaving the pile pointing at nothing.
				if (context.combat != null) {
					if (context.combat.temporaryCardArray == null) context.combat.temporaryCardArray = [];
					context.combat.temporaryCardArray.push(removed);
				}
				honeycomb.logEvent(context, { type: "deckCardRemoved", card: removed.cardIndex, cardId: removed.instanceId,
					upgradeLevel: removed.upgradeLevel, ownerInstanceId: removed.ownerInstanceId });
			}
		},
		describe: function () { return "Remove it from your deck."; },
	},

	{
		index: "summonEnemy",
		//Calls an ENEMY into the fight ON THE SUMMONER'S TEAM. The obvious use is an enemy calling for
		//help (the Matriarch's Brood); played by someone on the party's team, it calls one to fight for
		//the party. The same as `summon` with `enemy` and the summoner's own team.
		resolve: function (entry, context) {
			var count = honeycomb.resolveValue(entry.count == null ? 1 : entry.count, context);
			for (var summonIndex = 0; summonIndex < count; summonIndex++) {
				if (honeycomb.summonCombatant({ enemyIndex: entry.enemy, side: honeycomb.userSide(context) }, context) == null) break;
			}
		},
		describe: function (entry) {
			var definition = honeycomb.findDefinition(honeycomb.enemyArray, entry.enemy);
			return "Summon " + honeycomb.describeValue(entry.count == null ? 1 : entry.count) + " " +
				(definition == null ? entry.enemy : definition.name) + ".";
		},
	},

	{
		//PROMOTION: the target piece becomes `to`. The mapping is the CARD's -- "A becomes B" -- so
		//a new promotion is a content entry and never an engine change, and nothing here implies an
		//order of pieces. `to` may be a plain index or a value expression, so a card can choose.
		//  fromTag   only targets carrying this tag are promoted ("pawn")
		//  limit     at most this many, front to back
		//Both exist for a promotion that does not PICK: the gauntlet's boss is an AI, so her
		//Promotion is aimed at her whole side and takes the first Pawn it finds -- and without `fromTag`
		//it would promote HER, since she is an enemy-table entity like the pieces beside her.
		index: "promote",
		resolve: function (entry, context) {
			var toIndex = typeof entry.to === "string" ? entry.to : honeycomb.resolveValue(entry.to, context);
			var promotedCount = 0;
			for (var scanIndex = 0; scanIndex < context.targetArray.length; scanIndex++) {
				if (entry.limit != null && promotedCount >= entry.limit) break;
				var target = context.targetArray[scanIndex];
				if (entry.fromTag != null && honeycomb.entityHasTag(target, entry.fromTag) != true) continue;
				if (honeycomb.promoteEntity(target, toIndex, context) == true) promotedCount += 1;
			}
		},
		describe: function (entry) {
			var into = honeycomb.findDefinition(honeycomb.enemyArray, entry.to);
			return into == null ? "" : "Promote it into " + into.name + ".";
		},
		//The word explains itself wherever it is printed, and names the piece it makes.
		keywordArray: function (entry) {
			var into = honeycomb.findDefinition(honeycomb.enemyArray, entry == null ? null : entry.to);
			var shapeArray = ["knight", "bishop", "rook", "queen"];
			var result = ["promote"];
			for (var scanIndex = 0; scanIndex < shapeArray.length; scanIndex++) {
				if (into != null && honeycomb.definitionHasTag(into, shapeArray[scanIndex])) result.push(shapeArray[scanIndex]);
			}
			return result;
		},
	},
	{
		//Set dressing: a figure like the King can be shown standing on the board without blocking targeting
		//or occupying a rank, by being drawn rather than fought. A figure may be shown BEHIND a side without
		//being a combatant:
		//no health, no rank, no intent, nothing to target, nothing the row has to make room for. It is a
		//record on the combat (`backdropPropArray`: {enemy, side}) that the combat screen draws and nothing
		//else reads, so it survives a save and costs the engine nothing. One of each figure per side.
		//  enemy   whose drawing to show (an enemy-table index)
		index: "showBackdropProp",
		resolve: function (entry, context) {
			var combat = context == null ? null : context.combat;
			if (combat == null || entry.enemy == null) return;
			if (combat.backdropPropArray == null) combat.backdropPropArray = [];
			var side = honeycomb.userSide(context);
			for (var scanIndex = 0; scanIndex < combat.backdropPropArray.length; scanIndex++) {
				if (combat.backdropPropArray[scanIndex].enemy == entry.enemy && combat.backdropPropArray[scanIndex].side == side) return;
			}
			combat.backdropPropArray.push({ enemy: entry.enemy, side: side });
			honeycomb.logEvent(context, { type: "backdropProp", enemy: entry.enemy, side: side });
		},
		describe: function () { return ""; },
	},
	{
		//Inversion (Anastasia's Transposition): the target piece becomes its `alignmentTwin` --
		//Celestial for Infernal, shape kept. The twin is named on the piece's own entry, so this verb knows
		//no pieces. A standing piece is promoted sideways (honeycomb.promoteEntity: same body, health carried
		//as a fraction); a DOWNED one is raised as its twin (honeycomb.raisePiece), which is what makes a
		//Pawn's corpse worth keeping. A target with no twin is left alone.
		index: "invert",
		resolve: function (entry, context) {
			for (var scanIndex = 0; scanIndex < context.targetArray.length; scanIndex++) {
				var target = context.targetArray[scanIndex];
				var found = honeycomb.entityDefinition(target);
				if (found == null || found.kind != "enemy" || found.definition.alignmentTwin == null) continue;
				if (target.downed == true) honeycomb.raisePiece(target, found.definition.alignmentTwin, context);
				else honeycomb.promoteEntity(target, found.definition.alignmentTwin, context);
			}
		},
		describe: function () { return "Invert the target's alignment."; },
	},
	{
		//Raising the whole field: every downed golem on the user's own side stands back up as `to`, in its own place and at
		//the new shape's full health -- honeycomb.raisePiece, the same seam a Pawn summon refills a corpse
		//through. The cap is not consulted: raising a body that is already drawn adds no figure.
		//  to   what they come back as (an enemy-table index)
		index: "raiseFallenPieces",
		resolve: function (entry, context) {
			var combat = context == null ? null : context.combat;
			if (combat == null || entry.to == null) return;
			var sideArray = honeycomb.entityArray(honeycomb.userSide(context), combat);
			for (var scanIndex = 0; scanIndex < sideArray.length; scanIndex++) {
				var candidate = sideArray[scanIndex];
				if (candidate.downed != true || candidate.enemyIndex == null) continue;
				if (honeycomb.entityHasTag(candidate, "golem") != true) continue;
				honeycomb.raisePiece(candidate, entry.to, context);
			}
		},
		describe: function (entry) {
			var into = honeycomb.findDefinition(honeycomb.enemyArray, entry.to);
			return into == null ? "" : "Every fallen piece stands up as a " + into.name + ".";
		},
	},

	{
		index: "summon",
		//Teams are not kinds: brings ANY combatant into the fight on EITHER team -- an
		//enemy (`enemy`) or a character (`character`) -- on the summoner's own team ("own", the default)
		//or the one it fights ("opposing"). A Sporeling can fight for the party, and Severine against it.
		//  count, healthFraction, outfit   as the name says
		//  controller   "ai" or "player"; omitted, anything that is not a character standing with the party
		//               is the AI's (honeycomb.isAiControlled)
		resolve: function (entry, context) {
			var ownSide = honeycomb.userSide(context);
			var side = entry.team == "opposing" ? honeycomb.opposingSide(ownSide) : ownSide;
			var count = honeycomb.resolveValue(entry.count == null ? 1 : entry.count, context);
			for (var summonIndex = 0; summonIndex < count; summonIndex++) {
				var summoned = honeycomb.summonCombatant({
					enemyIndex: entry.enemy, characterIndex: entry.character, outfitIndex: entry.outfit,
					side: side, healthFraction: entry.healthFraction, controller: entry.controller,
				}, context);
				if (summoned == null) break;
				//Written to the action's shared tally so a later entry can act on WHAT THIS PUT DOWN
				//rather than guessing at a rank -- "summon a Pawn, sacrifice it" is two entries and no
				//new verb. A refilled corpse is the same body, so this names it correctly too.
				//See the `lastSummoned` target mode.
				context.tally.lastSummonedId = summoned.instanceId;
			}
		},
		describe: function (entry, describeContext) {
			var definition = entry.enemy != null ? honeycomb.findDefinition(honeycomb.enemyArray, entry.enemy)
				: honeycomb.findDefinition(honeycomb.characterArray, entry.character);
			var name = definition == null ? String(entry.enemy != null ? entry.enemy : entry.character) : definition.name;
			var userSide = describeContext == null || describeContext.userSide == null ? "ally" : describeContext.userSide;
			var side = entry.team == "opposing" ? honeycomb.opposingSide(userSide) : userSide;
			//Said from the player's side of the table, like every target.
			return "Summon " + honeycomb.describeValue(entry.count == null ? 1 : entry.count) + " " + name +
				(side == "ally" ? " to fight for the party." : " to fight against the party.");
		},
		//The word explains the corpse-first rule and the cap, which are not on any card face.
		keywordArray: function () { return ["summon"]; },
	},

	{
		index: "summonAlly",
		//Adds a CONTROLLABLE character to the party mid-fight. The engine imposes no party ceiling of
		//its own -- tuning.run.partySizeMaximum is what the teambuilding screen offers -- so a summoned
		//ally is an ordinary party member in every respect: it takes damage, holds statuses, carries
		//abilities, and appears in the party rail.
		//
		//`temporary` (the default) means the member leaves when the fight ends. A permanent summon is
		//a run-changing event, so it has to be asked for.
		//`cardArray` mints cards owned by the newcomer straight into a pile, which is what makes them
		//controllable rather than an autonomous pet -- the player gets something to play.
		resolve: function (entry, context) {
			var run = honeycomb.state == null ? null : honeycomb.state.run;
			if (run == null) return;

			var member = honeycomb.newPartyMember({
				characterIndex: entry.character,
				outfitIndex: entry.outfit,
				equipmentArray: entry.equipmentArray,
			});
			if (member == null) return;

			member.side = "ally";
			member.summoned = true;
			member.temporary = entry.temporary != false;
			member.summonedBy = context.source == null ? null : context.source.instanceId;
			//A summon that arrives at a fraction of health is a common shape; full health by default.
			if (entry.healthFraction != null) {
				member.health = Math.max(1, Math.round(member.maxHealth * entry.healthFraction));
			}

			run.partyArray.push(member);
			honeycomb.abilities.reconcile(member);

			var cardArray = entry.cardArray == null ? [] : entry.cardArray;
			for (var cardIndex = 0; cardIndex < cardArray.length; cardIndex++) {
				var card = cardArray[cardIndex];
				var copies = card.count == null ? 1 : card.count;
				for (var copyIndex = 0; copyIndex < copies; copyIndex++) {
					var instance = honeycomb.addCardToPile(card.index, entry.pile == null ? "hand" : entry.pile, context);
					//Owned by the newcomer, so their cards obey the owner-down policy like everyone's.
					if (instance != null) instance.ownerInstanceId = member.instanceId;
				}
			}

			honeycomb.logEvent(context, {
				type: "allySummoned",
				targetId: member.instanceId,
				character: entry.character,
				temporary: member.temporary,
				sourceId: member.summonedBy,
			});
		},
		describe: function (entry) {
			var definition = honeycomb.findDefinition(honeycomb.characterArray, entry.character);
			return "Summon " + (definition == null ? entry.character : definition.name) + " to fight alongside you.";
		},
	},

	{
		index: "playAnimation",
		//An explicit presentation beat with no mechanical consequence. Content uses it to sequence a
		//flourish; the animation layer decides what it looks like. What is available to ask for is
		//honeycomb.combatScene.namedAnimationArray -- currently lunge, flash, recoil, shudder, rise,
		//screenShake, beam and burst.
		//
		//`color` and `strength` ride along so one animation can serve several cards without each of
		//them needing an entry of its own: a green burst and a red one are one verb, not two. They are
		//presentation values and mean nothing to the engine, which is why they simply pass through.
		resolve: function (entry, context) {
			honeycomb.logEvent(context, {
				type: "animation",
				animation: entry.animation,
				color: entry.color,
				strength: entry.strength,
				targetId: context.target == null ? null : context.target.instanceId,
				sourceId: context.source == null ? null : context.source.instanceId,
			});
		},
		describe: function () { return ""; },
	},

	{
		index: "message",
		//Prints a line into the combat log. Useful for events and for making an unusual interaction
		//legible to the player.
		//
		//It describes as nothing. Returning its own sentence would put the flavour line onto the intent
		//card beside the rules: Trip Line would read "Deal 4 damage to the party member in front. The
		//party member in front moves to the back. A vine loop whips around an ankle and somebody sits
		//down hard." -- 151 characters against a median enemy move of 44. Eleven moves append a flavour
		//line this way, and a twelfth (Befuddled) is a message and nothing else, but carries its own
		//`text` field, so no card is left blank by this.
		resolve: function (entry, context) {
			honeycomb.logEvent(context, { type: "message", text: entry.text });
		},
		describe: function () { return ""; },
	},

	//--- Rest-site options (NODES-LIST §D) -----------------------------------------------------------
	{
		index: "gainExperience",
		//Personal experience paid to the party, split as evenly as whole numbers allow. Outside a run
		//there is no party, so nothing is paid. See honeycomb.progression.payPersonal.
		resolve: function (entry, context) {
			var amount = honeycomb.resolveValue(entry.amount, context);
			honeycomb.progression.payPersonal(amount);
			honeycomb.logEvent(context, { type: "resource", resource: "experience", amount: amount });
		},
		describe: function (entry) { return "Every member gains " + honeycomb.describeValue(entry.amount) + " experience."; },
	},
	{
		index: "transformChosenCard",
		//Replaces each targeted deck card with another card for the same character. `rarityArray` limits
		//the pool (Fortune Telling: common or rare); `sameRarity` keeps the replaced card's own rarity
		//(Gamble). A card with no eligible replacement is left alone.
		resolve: function (entry, context) {
			var idArray = honeycomb.contextCardIdArray(context);
			for (var scanIndex = 0; scanIndex < idArray.length; scanIndex++) {
				honeycomb.transformRunDeckCard(idArray[scanIndex], entry, context);
			}
		},
		describe: function (entry) {
			return entry.sameRarity == true ? "Becomes a random card of the same rarity for that character."
				: "Becomes a random " + (entry.rarityArray == null ? "" : entry.rarityArray.join(" or ")) + " card for that character.";
		},
	},
	{
		index: "exhaustJunkFromDeck",
		//Removes every curse from the run deck for good. "Exhaust" here means gone from the deck, the way
		//Laundry burns the junk a run has accumulated.
		resolve: function (entry, context) {
			var run = honeycomb.state == null ? null : honeycomb.state.run;
			if (run == null) return;
			//ONE summary entry, not one per card: a laundry pile can be dozens deep, and the screen shows
			//a single tile with the whole list in its tooltip.
			var purgedArray = [];
			for (var scanIndex = run.deckArray.length - 1; scanIndex >= 0; scanIndex--) {
				var card = run.deckArray[scanIndex];
				var definition = honeycomb.findDefinition(honeycomb.cardArray, card.cardIndex);
				if (definition == null || definition.type != "curse") continue;
				run.deckArray.splice(scanIndex, 1);
				purgedArray.push(card.cardIndex);
			}
			if (purgedArray.length > 0) honeycomb.logEvent(context, { type: "deckCursePurged", cardArray: purgedArray });
		},
		describe: function () { return "Exhaust every curse in your deck."; },
	},
	{
		index: "preptime",
		//Marks the run so every member starts the NEXT fight with Temporary HP. The fraction is stored
		//and combat setup spends it once. See honeycomb.combat.begin.
		resolve: function (entry, context) {
			var run = honeycomb.state == null ? null : honeycomb.state.run;
			if (run == null) return;
			run.preptimeFraction = honeycomb.resolveValue(entry.fraction, context);
			honeycomb.logEvent(context, { type: "preptime", fraction: run.preptimeFraction });
		},
		describe: function () { return "Begin the next battle with Temporary HP."; },
	},
	{
		index: "duplicateRunDeckCard",
		//Adds a copy of each targeted deck card to the run deck, keeping its owner and upgrade level.
		resolve: function (entry, context) {
			var idArray = honeycomb.contextCardIdArray(context);
			var run = honeycomb.state == null ? null : honeycomb.state.run;
			if (run == null) return;
			for (var scanIndex = 0; scanIndex < idArray.length; scanIndex++) {
				var instance = null;
				for (var findIndex = 0; findIndex < run.deckArray.length; findIndex++) {
					if (run.deckArray[findIndex].instanceId == idArray[scanIndex]) { instance = run.deckArray[findIndex]; break; }
				}
				if (instance == null) continue;
				var created = honeycomb.addCardToRunDeck(instance.cardIndex, instance.ownerInstanceId);
				if (created != null) {
					created.upgradeLevel = instance.upgradeLevel;
					honeycomb.logEvent(context, { type: "deckCardAdded", card: created.cardIndex, cardId: created.instanceId,
						ownerInstanceId: created.ownerInstanceId });
				}
			}
		},
		describe: function () { return "Add a copy of it to your deck."; },
	},
	{
		index: "openShop",
		//Hands over to the shop with its prices multiplied for this visit. Whoever runs the event reads
		//`run.pendingShop` and opens the shop instead of ending the event. See honeycomb.shop.priceMultiplier.
		resolve: function (entry, context) {
			var run = honeycomb.state == null ? null : honeycomb.state.run;
			if (run == null) return;
			run.pendingShop = { priceMultiplier: honeycomb.resolveValue(entry.priceMultiplier, context) };
		},
		describe: function () { return "Open the shop at doubled prices."; },
	},
];

//A nested context that shares the log and counts one level deeper.
//
//It also shares the CHOICE STATE by reference, not by copy: a question asked inside a `repeat` is the
//same conversation as one asked outside it, and its position in that conversation has to be counted
//once. Copying would restart the numbering and pair answers with the wrong questions.
honeycomb.childContext = function (context) {
	var child = honeycomb.newEffectContext({
		source: context.source,
		target: context.target,
		targetArray: context.targetArray.slice(),
		card: context.card,
		combat: context.combat,
		log: context.log,
		depth: context.depth + 1,
	});
	child.choiceState = context.choiceState;
	//Cards being acted on travel down too, so a nested list can reach the card the player chose.
	child.targetCardArray = context.targetCardArray == null ? [] : context.targetCardArray.slice();
	child.chosenCardId = context.chosenCardId;
	//A repeat of a random hit is still a random hit.
	child.chance = context.chance;
	child.chanceGroup = context.chanceGroup;
	child.tally = context.tally;
	child.actingSide = context.actingSide;
	return child;
};

//Generated rules text for an effect list. Card definitions may still supply hand-written text; this
//is the fallback, and it guarantees a card without one is never blank.
//
//`describeContext` carries what the text needs to know beyond the entry itself -- above all the TARGET
//MODE, so a card that hits every enemy says "to ALL enemies" instead of reading exactly like one that
//hits a single target. An entry with its own targetOverride describes against that instead, which is
//how "Deal 4 damage. Heal 4 HP." stays correct for a drain.
honeycomb.describeEffectArray = function (effectArray, describeContext) {
	if (effectArray == null) return "";
	var pieceArray = [];
	for (var entryIndex = 0; entryIndex < effectArray.length; entryIndex++) {
		var entry = effectArray[entryIndex];
		if (entry == null) continue;
		var definition = honeycomb.findDefinition(honeycomb.effectArray, entry.index);
		if (definition == null || definition.describe == null) continue;
		var text = definition.describe(entry, honeycomb.describeContextFor(entry, describeContext));
		//An effect's own gate shows, or Steel's "+2 while you have tHP" would print as a flat +2. The
		//condition is stated before the effect it gates, so the card says WHY the line may not happen.
		if (text != null && text !== "" && entry.condition != null) {
			var conditionText = honeycomb.describeCondition(entry.condition);
			if (conditionText !== "") text = "If " + conditionText + ": " + text;
		}
		if (text != null && text !== "") pieceArray.push(text);
	}
	return pieceArray.join(" ");
};

//`live` ({source, target, combat}) asks for numbers AS THEY WOULD LAND: the acting character's Strength
//and Weak, and -- once a target is known -- its Sundered. `markup` asks for changed numbers to come
//back marked, so card text can colour them. Both ride down to nested entries. An entry aimed elsewhere
//by targetOverride keeps the source but loses the target, unless the override is the source itself.
honeycomb.describeContextFor = function (entry, parentContext) {
	var overridden = entry != null && entry.targetOverride != null;
	var targetMode = overridden ? entry.targetOverride : (parentContext == null ? null : parentContext.targetMode);
	var live = parentContext == null ? null : parentContext.live;
	if (live != null && overridden) {
		var definition = honeycomb.targetModeDefinition(entry.targetOverride);
		live = { source: live.source, target: definition != null && definition.textSelf == true ? live.source : null, combat: live.combat };
	}
	return {
		targetMode: targetMode, live: live, markup: parentContext != null && parentContext.markup == true,
		//Whose card this is, for the words its targets are named with. See honeycomb.teamWordArray.
		userSide: parentContext == null || parentContext.userSide == null ? "ally" : parentContext.userSide,
	};
};

//A number in generated text. With no live context it is the printed number; with one it is what would
//actually land, through the same honeycomb.modifiedDamage the real hit uses. A changed number is marked
//"⟨up:9⟩" / "⟨down:4⟩" when markup is asked for, which honeycomb.cardTextMarkup turns into colour.
//An expression -- "equal to your Temporary HP" -- is always printed as words.
//
//`kind` picks which pipeline the preview runs through. Lust is previewed through its own, so a card
//aimed at a character with a rank-3 weakness to its tags PRINTS the larger number: the ledger is only
//a difficulty knob if the player can see it working.
honeycomb.describeAmount = function (amount, entry, describeContext, kind) {
	var printed = honeycomb.describeValue(amount);
	var live = describeContext == null ? null : describeContext.live;
	if (typeof amount !== "number" || live == null || live.source == null) return printed;
	//`preview: true` marks this as a question, not a hit. The pipeline below is the one the real hit
	//runs, so a hook that SPENDS something while it answers -- the Whetstone's once-a-turn charge --
	//would burn it on the live number printed on a card in hand and leave nothing for the play.
	//The hand is re-described every beat, so the charge
	//was gone before the player could touch a card.
	var context = honeycomb.newEffectContext({ source: live.source, combat: live.combat, preview: true });
	var effective;
	if (kind == "temporaryHealth") {
		effective = Math.floor(honeycomb.modifiedTemporary(live.target == null ? live.source : live.target, amount, context));
	} else if (kind == "lust") {
		effective = honeycomb.previewedLust(live.source, live.target, amount, entry, context);
	} else {
		effective = honeycomb.modifiedDamage(live.source, live.target, amount, entry, context);
	}
	if (effective === amount) return printed;
	if (describeContext.markup != true) return String(effective);
	return "⟨" + (effective > amount ? "up" : "down") + ":" + effective + "⟩";
};

//The target mode definition a description is written against, or null for "the one picked".
honeycomb.describeTargetDefinition = function (describeContext) {
	if (describeContext == null || describeContext.targetMode == null) return null;
	return honeycomb.targetModeDefinition(describeContext.targetMode);
};

//" to ALL enemies" -- the targets after a verb, with the preposition the verb wants. Empty for a mode
//that goes unnamed.
honeycomb.describeObject = function (describeContext, preposition) {
	var text = describeContext == null ? null : honeycomb.targetModeText(describeContext.targetMode, "textObject", describeContext.userSide);
	if (text == null) return "";
	return (preposition == null || preposition === "" ? " " : " " + preposition + " ") + text;
};

//"ALL allies" as the subject of a sentence, or null when the sentence has no named subject.
honeycomb.describeSubject = function (describeContext) {
	return describeContext == null ? null : honeycomb.targetModeText(describeContext.targetMode, "textSubject", describeContext.userSide);
};

honeycomb.describePlural = function (describeContext) {
	var definition = honeycomb.describeTargetDefinition(describeContext);
	return definition != null && definition.plural == true;
};

honeycomb.describeIsSelf = function (describeContext) {
	var definition = honeycomb.describeTargetDefinition(describeContext);
	return definition != null && definition.textSelf == true;
};

//"Gain", "An ally gains", "ALL allies gain" -- the verb phrase for something the targets receive.
honeycomb.describeSubjectGains = function (describeContext) {
	var subject = honeycomb.describeSubject(describeContext);
	if (subject == null) return "Gain";
	return subject + (honeycomb.describePlural(describeContext) ? " gain" : " gains");
};

//A keyword's printed name. Falls back to the index, so text still reads if the table is edited.
honeycomb.keywordName = function (keywordIndex) {
	var keyword = honeycomb.keywordArray == null ? null : honeycomb.findDefinition(honeycomb.keywordArray, keywordIndex);
	return keyword == null ? keywordIndex : keyword.name;
};
