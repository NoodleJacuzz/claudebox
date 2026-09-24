//===================================================================================================
//HONEYCOMB CATACOMBS -- forecasts
//===================================================================================================
//What a play would do, and what the enemies are about to do, BEFORE either happens.
//
//THE WHOLE IDEA: a forecast is not a parallel calculation. It runs the real action against a copy of
//the world, reads the log the engine produced, and puts the world back. Nothing it does survives.
//
//That is the same principle the printed rules text follows -- a card's text is generated from the
//card's own effects so the two can never disagree -- applied to numbers. A forecast cannot drift from
//what actually happens, because it IS what actually happens, rolled back. Strength, Weak, Sundered,
//Temporary HP, thorns, relics, an enemy's own hooks, a status that kills it before it acts, the party moving
//when a card is played: all of it is included for free, and a new effect needs no forecasting code.
//
//It is affordable because two properties already exist for other reasons: state is fully
//serialisable, and RNG is (seed, calls) rather than a hidden generator. A snapshot round trip costs
//well under a tenth of a millisecond, so a forecast can be recomputed whenever the pointer moves to a
//new target.
//
//THREE QUESTIONS ARE ANSWERED:
//  standing  "what happens if End Turn is pressed right now" -- asked with nothing in hand, and shown on
//            every ally all the time. Runs the whole handover: the end of the turn, every enemy acting,
//            and the start of the party's next turn, so poison ticking there is counted.
//  held      "what happens if I play THIS, and then end the turn" -- asked the moment a card is picked
//            up, and again whenever it is held over a new target. A card still waiting for a target is
//            answered with just its owner's move through the party, because where they will stand is
//            what changes who the enemies hit.
//  aimed     the play on its own, for the target it is held over -- the enemy's bar.
//
//CHANCE. A hit left to a random pick is truthful in a dry run -- the RNG is deterministic, so the dry run
//knows who it will land on -- but anything else the player does can move that pick. So it is kept apart
//from damage that WILL land and shown as a MIGHT, spread over everyone it could have hit. See
//tuning.forecast.randomTargets and honeycomb.markChance.
//
//A FORECAST REPLACES honeycomb.state, exactly as a choice rewind does. Anything holding
//honeycomb.state.run or .combat across a forecast call is looking at an abandoned copy. Re-read after
//calling anything in this file. This is the single easiest way to write a bug in this codebase.
window.honeycomb = window.honeycomb || {};

honeycomb.forecast = {
	//True while a dry run is in flight. Anything that would let a consequence ESCAPE the sandbox
	//checks this: a save is the obvious one, and it is guarded at honeycomb.save.write.
	active: false,

	//What the enemies will do if the turn ends now. Recomputed when the board changes, not per frame.
	standing: null,
	//The HELD reading while a card is held or an ability is aimed: {play, combined}. Null otherwise.
	aiming: null,
	//The LUST INSPECTION while a Lewd card is being read: see forLustInspection. While it stands, the
	//resting forecast is paused and the bars draw this instead.
	inspecting: null,
	//Answers already given, keyed by what was asked, cleared whenever the board changes.
	cacheArray: {},
};

//---------------------------------------------------------------------------------------------------
//The primitive
//---------------------------------------------------------------------------------------------------
//Runs `action` against a copy of the world and returns the log it produced, with the world put back
//exactly as it was -- RNG counters included, since those live in state like everything else.
//
//`action` returns a log array, or null when there is nothing to forecast. A nested forecast is refused
//rather than attempted: it would restore an inner snapshot over an outer one and strand the caller in
//the sandbox.
honeycomb.forecast.dryRunLog = function (action) {
	if (honeycomb.forecast.active == true) return null;
	if (honeycomb.state == null) return null;

	var snapshot = honeycomb.snapshotState();
	if (snapshot == null) return null;

	honeycomb.forecast.active = true;
	var logArray = null;
	try {
		logArray = action();
	} catch (dryRunError) {
		//A forecast must never take the game down with it. A failed forecast simply shows nothing: an
		//empty log, as distinct from null, which means the forecast was never attempted.
		console.error("Honeycomb: a forecast failed and was discarded", dryRunError);
		logArray = [];
	}

	honeycomb.forecast.active = false;
	honeycomb.restoreState(snapshot);
	return logArray;
};

//The same, for an action that returns a context: the shape the play paths already produce.
honeycomb.forecast.dryRun = function (action) {
	var logArray = honeycomb.forecast.dryRunLog(function () {
		var context = action();
		return context == null || context.log == null ? [] : context.log;
	});
	return logArray == null ? null : honeycomb.forecast.readLog(logArray);
};

//The turn handover, for real, inside a dry run: end the turn, let every enemy act, and -- when tuning
//says so -- begin the party's next turn, which is where poison and regeneration tick. Returns the log.
honeycomb.forecast.runHandover = function () {
	var logArray = [];
	var endContext = honeycomb.combat.endPlayerTurn();
	if (endContext != null) logArray = logArray.concat(endContext.log);
	if (honeycomb.forecast.fightOver() == true) return logArray;

	var enemyContext = honeycomb.combat.runEnemyTurn();
	if (enemyContext != null) logArray = logArray.concat(enemyContext.log);
	//Where everyone stands once the enemies are done -- above all their SHIELD, which the log never says
	//outright: it only records what each hit had absorbed. Taken before the next turn begins, because
	//that is where Temporary HP halves and the question is what is left to stand behind.
	logArray.push(honeycomb.forecast.snapshotEntry("afterEnemyTurn"));
	if (honeycomb.forecast.fightOver() == true) return logArray;

	if (honeycomb.tuning.forecast.includeNextTurnStart == true) {
		var startContext = honeycomb.newEffectContext({ combat: honeycomb.state.run.combat });
		honeycomb.combat.startPlayerTurn(startContext);
		logArray = logArray.concat(startContext.log);
	}
	return logArray;
};

//A log entry holding every fighter's health, Temporary HP and Lust as they stand at this moment of the dry run.
honeycomb.forecast.snapshotEntry = function (stage) {
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var entityArray = honeycomb.entityArray("both", combat);
	var stateArray = [];
	for (var scanIndex = 0; scanIndex < entityArray.length; scanIndex++) {
		stateArray.push({
			entityId: entityArray[scanIndex].instanceId,
			health: entityArray[scanIndex].health,
			temporaryHealth: entityArray[scanIndex].temporaryHealth,
			lust: entityArray[scanIndex].lust,
			broken: entityArray[scanIndex].broken == true,
		});
	}
	return { type: "entitySnapshot", stage: stage, stateArray: stateArray };
};

honeycomb.forecast.fightOver = function () {
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	return combat == null || combat.phase == "victory" || combat.phase == "defeat";
};

//---------------------------------------------------------------------------------------------------
//Reading a log
//---------------------------------------------------------------------------------------------------
//Log entries that say something about an entity's condition, and how each folds into that entity's
//summary. A new consequence worth previewing is an entry here, which is the same shape the animation
//layer's own handler table takes.
//
//Every total is kept twice -- all of it, and the CERTAIN part -- so the same reading serves the exact
//truth (what the tests check against) and the honest display (what the bars draw).
honeycomb.forecast.readerArray = [
	{
		index: "damage",
		//Which reading this entry moves, for the bar's tooltips: named here rather than inside the
		//reader so nothing has to remember to record itself; the loop that dispatches to these builds
		//the cause list from the entry it already has.
		cause: "health", causeSign: -1,
		read: function (summary, entry) {
			var absorbed = entry.absorbed == null ? 0 : entry.absorbed;
			summary.damage += entry.amount;
			summary.absorbed += absorbed;
			if (entry.chance == true) {
				summary.chanceDamage += entry.amount;
				//A random AMOUNT on a fixed target has no group to spread over: it is a might for
				//whoever it actually landed on.
				if (entry.chanceGroup == null) summary.potentialDirect += entry.amount;
			} else {
				summary.certainDamage += entry.amount;
				summary.certainAbsorbed += absorbed;
			}
		},
	},
	{
		index: "heal",
		cause: "health", causeSign: 1,
		read: function (summary, entry) {
			summary.heal += entry.amount;
			if (entry.chance != true) summary.certainHeal += entry.amount;
		},
	},
	{
		index: "temporaryHealth",
		cause: "temporary", causeSign: 1,
		read: function (summary, entry) {
			summary.temporaryGained += entry.amount;
			if (entry.chance != true) summary.certainTemporaryGained += entry.amount;
		},
	},
	{
		index: "temporaryRemoved",
		cause: "temporary", causeSign: -1,
		read: function (summary, entry) {
			summary.temporaryGained -= entry.amount;
			if (entry.chance != true) summary.certainTemporaryGained -= entry.amount;
		},
	},
	{
		index: "lust",
		cause: "lust", causeSign: 1,
		read: function (summary, entry) {
			summary.lustGained += entry.amount;
			if (entry.chance != true) summary.certainLustGained += entry.amount;
		},
	},
	{
		index: "lustReduced",
		cause: "lust", causeSign: -1,
		read: function (summary, entry) {
			summary.lustGained -= entry.amount;
			if (entry.chance != true) summary.certainLustGained -= entry.amount;
		},
	},
	{
		//THE READING THAT REPLACED "does this kill me". A forecast that says an ally will break is the
		//most important thing a bar can say, so it is tracked exactly the way `downed` is.
		index: "broken",
		read: function (summary, entry) {
			summary.broke = true;
			if (entry.chance == true) summary.chanceBroke = true;
		},
	},
	{
		index: "recovered",
		read: function (summary) { summary.recovered = true; },
	},
	{
		index: "downed",
		read: function (summary, entry) {
			summary.downed = true;
			if (entry.chance == true) summary.chanceDowned = true;
		},
	},
	{
		index: "status",
		read: function (summary, entry) {
			summary.statusArray.push({ index: entry.status, stacks: entry.stacks, delta: entry.delta, chance: entry.chance == true });
		},
	},
	{
		index: "partyOrder",
		read: function (summary, entry) { summary.movedToRank = entry.toRank; },
		//The moved entity is `movedId`, not `targetId`.
		entityField: "movedId",
	},
];

//Figures come off the LIVE entity, so a caller can compare a forecast against what is on screen right
//now without holding a second copy of the board. Called after the restore, never during the dry run.
honeycomb.forecast.newSummary = function (entityId) {
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var entity = honeycomb.findEntity(entityId, combat);
	//Outside a fight the party still exists -- an event heals or hurts them -- so it is searched too.
	if (entity == null && honeycomb.state != null && honeycomb.state.run != null) {
		for (var memberIndex = 0; memberIndex < honeycomb.state.run.partyArray.length; memberIndex++) {
			if (honeycomb.state.run.partyArray[memberIndex].instanceId == entityId) entity = honeycomb.state.run.partyArray[memberIndex];
		}
	}
	return {
		entityId: entityId,
		health: entity == null ? 0 : entity.health,
		maxHealth: entity == null ? 0 : entity.maxHealth,
		temporaryHealth: entity == null ? 0 : entity.temporaryHealth,
		lust: entity == null || entity.lust == null ? 0 : entity.lust,
		usesLust: entity != null && honeycomb.entityUsesLust(entity) == true,
		wasBroken: entity != null && entity.broken == true,
		//A party member gains `side` in its first fight; before that it is still an ally.
		side: entity == null ? null : (entity.side == null ? "ally" : entity.side),
		damage: 0,
		absorbed: 0,
		heal: 0,
		temporaryGained: 0,
		lustGained: 0,
		broke: false,
		chanceBroke: false,
		recovered: false,
		downed: false,
		statusArray: [],
		movedToRank: null,
		certainDamage: 0,
		certainAbsorbed: 0,
		certainHeal: 0,
		certainTemporaryGained: 0,
		certainLustGained: 0,
		chanceDamage: 0,
		chanceDowned: false,
		potentialRaw: 0,
		potentialDirect: 0,
		//Lust a random pick MIGHT land on this entity, spread from its candidate group.
		potentialLust: 0,
		//What moved each reading, in order, for the bar's tooltips. See the dispatch loop in readLog.
		causeArray: [],
		//Temporary HP left once the enemies have acted, from the handover's snapshot; null when not read.
		temporaryAfterEnemyTurn: null,
		lustAfterEnemyTurn: null,
	};
};

//Folds a log into one summary per entity it mentions.
honeycomb.forecast.readLog = function (logArray) {
	var byEntity = {};
	var entityArray = [];
	var groupArray = {};

	function summaryFor(entityId) {
		if (byEntity[entityId] == null) {
			byEntity[entityId] = honeycomb.forecast.newSummary(entityId);
			entityArray.push(byEntity[entityId]);
		}
		return byEntity[entityId];
	}

	for (var entryIndex = 0; entryIndex < logArray.length; entryIndex++) {
		var entry = logArray[entryIndex];
		if (entry == null) continue;
		//A random pick, and everyone it could have landed on. Read first so the hits that follow it can
		//be spread over the whole list.
		if (entry.type == "randomPick") {
			groupArray[entry.group] = { candidateIdArray: entry.candidateIdArray == null ? [] : entry.candidateIdArray, raw: 0, rawLust: 0 };
			continue;
		}
		//Temporary HP once the enemies have acted. Only worth a summary for somebody whose gold moved.
		if (entry.type == "entitySnapshot") {
			for (var stateIndex = 0; stateIndex < entry.stateArray.length; stateIndex++) {
				var state = entry.stateArray[stateIndex];
				var existing = byEntity[state.entityId];
				var live = existing == null ? honeycomb.forecast.newSummary(state.entityId) : existing;
				var lustMoved = state.lust != null && live.lust !== state.lust;
				if (existing == null && live.temporaryHealth === state.temporaryHealth && lustMoved == false) continue;
				summaryFor(state.entityId).temporaryAfterEnemyTurn = state.temporaryHealth;
				if (state.lust != null) summaryFor(state.entityId).lustAfterEnemyTurn = state.lust;
			}
			continue;
		}
		var reader = honeycomb.findDefinition(honeycomb.forecast.readerArray, entry.type);
		if (reader == null) continue;
		var entityId = entry[reader.entityField == null ? "targetId" : reader.entityField];
		if (entityId == null) continue;
		reader.read(summaryFor(entityId), entry);
		//Records what did it, when this reader moves a reading the player can hover. `via` is the card or
		//ability that was resolving (stamped in honeycomb.logEvent); `damageType`
		//names poison, thorns and the broken spiral, which come from a hook and so carry no card.
		if (reader.cause != null && entry.amount > 0) {
			summaryFor(entityId).causeArray.push({
				kind: reader.cause,
				amount: entry.amount * reader.causeSign,
				via: entry.via == null ? null : entry.via,
				damageType: entry.damageType == null ? null : entry.damageType,
				sourceId: entry.sourceId == null ? null : entry.sourceId,
				chance: entry.chance == true,
			});
		}
		if (entry.type == "damage" && entry.chance == true && entry.chanceGroup != null && groupArray[entry.chanceGroup] != null) {
			groupArray[entry.chanceGroup].raw += entry.amount + (entry.absorbed == null ? 0 : entry.absorbed);
		}
		//Random lust spreads the same way: Beguile's pick is one member's problem in the dry run, but
		//every candidate's bar and tooltip should say it MIGHT be theirs.
		if (entry.type == "lust" && entry.chance == true && entry.chanceGroup != null && groupArray[entry.chanceGroup] != null) {
			groupArray[entry.chanceGroup].rawLust += entry.amount;
		}
	}

	//THE SPREAD. Whatever a random pick dealt, before Temporary HP, is something every candidate MIGHT take.
	for (var groupIndex in groupArray) {
		if (Object.prototype.hasOwnProperty.call(groupArray, groupIndex) == false) continue;
		var group = groupArray[groupIndex];
		for (var candidateIndex = 0; candidateIndex < group.candidateIdArray.length; candidateIndex++) {
			var candidateSummary = summaryFor(group.candidateIdArray[candidateIndex]);
			if (group.raw > 0) candidateSummary.potentialRaw += group.raw;
			if (group.rawLust > 0) candidateSummary.potentialLust += group.rawLust;
		}
	}

	for (var summaryIndex = 0; summaryIndex < entityArray.length; summaryIndex++) {
		honeycomb.forecast.finishSummary(entityArray[summaryIndex]);
	}
	return { byEntity: byEntity, entityArray: entityArray, log: logArray };
};

//Derived figures. `healthAfter` is the EXACT outcome of the dry run and is what tests hold forecasts
//to; `certainAfter` and `potentialAfter` are the honest split the bars draw.
honeycomb.forecast.finishSummary = function (summary) {
	function clamp(value) { return Math.max(0, Math.min(summary.maxHealth, value)); }

	//Net health movement, which is what a bar actually draws. Healing and damage in one action -- a
	//drain, a life-for-power card -- must not draw two marks that contradict each other.
	summary.healthDelta = summary.heal - summary.damage;
	summary.healthAfter = clamp(summary.health + summary.healthDelta);

	summary.certainDelta = summary.certainHeal - summary.certainDamage;
	summary.certainAfter = clamp(summary.health + summary.certainDelta);
	summary.certainDowned = summary.downed == true && summary.chanceDowned != true;

	//A might is measured against the Temporary HP the entity will still have standing once the certain hits
	//have eaten into it. Approximate by nature: it is a warning, not a promise.
	var standingTemporary = Math.max(0, summary.temporaryHealth + summary.certainTemporaryGained - summary.certainAbsorbed);
	summary.potentialDamage = Math.max(0, summary.potentialRaw - standingTemporary) + summary.potentialDirect;
	summary.potentialAfter = Math.max(0, summary.certainAfter - summary.potentialDamage);
	summary.mightDie = summary.certainDowned != true && summary.potentialDamage > 0 && summary.potentialAfter <= 0;

	//THE LUST HALF OF THE SAME QUESTION. `lustAfter` is where the wash ends up; `breakMargin` is the
	//gap that decides everything -- what lust would still have to arrive to break them once this has
	//played out. Zero or less means they break, and `willBreak` is the reading the bar warns with.
	summary.lustAfter = Math.max(0, summary.lust + summary.lustGained);
	summary.certainLustAfter = Math.max(0, summary.lust + summary.certainLustGained);
	var standingAfter = summary.healthAfter +
		Math.max(0, summary.temporaryHealth + summary.temporaryGained - summary.absorbed);
	summary.breakMargin = summary.usesLust == false ? null : standingAfter - summary.lustAfter;
	summary.willBreak = summary.broke == true && summary.chanceBroke != true;
	//A break the dry run did not actually reach but the numbers say is coming: the escalation and the
	//tHP halving both land at a turn boundary the forecast does not run past, so the margin is the
	//honest warning even when no `broken` entry appeared.
	//A fighter about to die is not about to break. The margin is `standingAfter - lustAfter`, so lethal
	//damage drives standingAfter to 0 and the margin to 0 or less on a body holding no lust at all, which
	//would otherwise read as a break warning beside a lust section correctly reporting no change coming.
	//Breaking is what happens to somebody still standing; dying happens instead, so the margin only warns
	//while there is something left to stand on.
	summary.mightBreak = summary.usesLust == true && summary.wasBroken == false && summary.willBreak == false &&
		summary.downed != true && summary.certainDowned != true && standingAfter > 0 &&
		(summary.chanceBroke == true || (summary.breakMargin != null && summary.breakMargin <= 0));
	return summary;
};

honeycomb.forecast.restrictToSide = function (reading, side) {
	if (reading == null) return null;
	var byEntity = {};
	var entityArray = [];
	for (var scanIndex = 0; scanIndex < reading.entityArray.length; scanIndex++) {
		var summary = reading.entityArray[scanIndex];
		if (summary.side != side) continue;
		byEntity[summary.entityId] = summary;
		entityArray.push(summary);
	}
	return { byEntity: byEntity, entityArray: entityArray, log: reading.log };
};

//---------------------------------------------------------------------------------------------------
//What a card would do
//---------------------------------------------------------------------------------------------------
//The real play, rolled back. A card that stops to ask a question forecasts only what it managed
//before asking, which is honest: what it does afterwards genuinely depends on the answer.
honeycomb.forecast.forCard = function (cardInstanceId, targetInstanceId) {
	if (honeycomb.tuning.forecast.aimEnabled != true) return null;
	if (cardInstanceId == null) return null;

	var key = "card:" + cardInstanceId + "|" + (targetInstanceId == null ? "" : targetInstanceId);
	if (honeycomb.forecast.cacheArray[key] !== undefined) return honeycomb.forecast.cacheArray[key];

	var reading = honeycomb.forecast.dryRun(function () {
		var result = honeycomb.combat.playCard(cardInstanceId, targetInstanceId);
		return result == null ? null : result.context;
	});
	honeycomb.forecast.cacheArray[key] = reading;
	return reading;
};

//What using an ability would do, on the same terms.
honeycomb.forecast.forAbility = function (memberInstanceId, abilityIndex, targetInstanceId) {
	if (honeycomb.tuning.forecast.aimEnabled != true) return null;
	if (memberInstanceId == null || abilityIndex == null) return null;

	var key = "ability:" + memberInstanceId + "/" + abilityIndex + "|" +
		(targetInstanceId == null ? "" : targetInstanceId);
	if (honeycomb.forecast.cacheArray[key] !== undefined) return honeycomb.forecast.cacheArray[key];

	var reading = honeycomb.forecast.dryRun(function () {
		var result = honeycomb.abilities.use(memberInstanceId, abilityIndex, targetInstanceId);
		return result == null ? null : result.context;
	});
	honeycomb.forecast.cacheArray[key] = reading;
	return reading;
};

//What an EVENT CHOICE would do to the party, on the same terms: the choice's own effects, run and
//rolled back. A choice that stops to ask something is read up to the question. Returns the party
//reading, the choice's own log (the cards, relics and resources it gives or takes, which the screen
//draws), and `unexplainedArray`. The dry run's world is compared before and after; any change no log
//entry accounts for is named there, because a preview built from the log would stay silent about it.
//A test holds every event to an empty list, and the debug build warns, so a straggler is caught the
//day it is written rather than by a tester.
honeycomb.forecast.forEventChoice = function (choice) {
	if (honeycomb.tuning.forecast.aimEnabled != true || choice == null) return null;
	var before = honeycomb.forecast.worldSnapshot();
	var after = null;
	var logArray = honeycomb.forecast.dryRunLog(function () {
		var context = honeycomb.newEffectContext({});
		context.choiceState = honeycomb.newChoiceState([]);
		honeycomb.spend(choice.costArray);
		honeycomb.resolveEffectArray(choice.effectArray, context);
		after = honeycomb.forecast.worldSnapshot();
		return context.log;
	});
	if (logArray == null) return null;
	var reading = honeycomb.forecast.restrictToSide(honeycomb.forecast.readLog(logArray), "ally");
	reading.unexplainedArray = after == null ? [] : honeycomb.forecast.unexplainedChangeArray(before, after, logArray, choice);
	return reading;
};

//The parts of the world an event choice may touch, as plain values: each party member's health and
//statuses, the deck, the relics, the resources.
honeycomb.forecast.worldSnapshot = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var snapshot = { memberArray: [], deckArray: {}, relicArray: [], resourceArray: {} };
	if (run == null) return snapshot;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		var statusArray = {};
		for (var statusIndex = 0; statusIndex < member.statusArray.length; statusIndex++) {
			statusArray[member.statusArray[statusIndex].index] = member.statusArray[statusIndex].stacks;
		}
		snapshot.memberArray.push({ instanceId: member.instanceId, health: member.health, maxHealth: member.maxHealth,
			downed: member.downed == true, statusArray: statusArray });
	}
	for (var cardIndex = 0; cardIndex < run.deckArray.length; cardIndex++) {
		snapshot.deckArray[run.deckArray[cardIndex].instanceId] = run.deckArray[cardIndex].upgradeLevel;
	}
	for (var relicIndex = 0; relicIndex < run.relicArray.length; relicIndex++) snapshot.relicArray.push(run.relicArray[relicIndex].index);
	for (var resourceIndex = 0; resourceIndex < honeycomb.resourceArray.length; resourceIndex++) {
		var resource = honeycomb.resourceArray[resourceIndex].index;
		snapshot.resourceArray[resource] = honeycomb.getResource(resource);
	}
	return snapshot;
};

//Every difference between two world snapshots that the log does not explain, each as a short string
//naming what moved. Empty when the preview can show everything the choice does.
honeycomb.forecast.unexplainedChangeArray = function (before, after, logArray, choice) {
	var result = [];
	function logHas(type, field, value) {
		for (var entryIndex = 0; entryIndex < logArray.length; entryIndex++) {
			var entry = logArray[entryIndex];
			if (entry != null && entry.type == type && (field == null || entry[field] == value)) return true;
		}
		return false;
	}

	for (var memberIndex = 0; memberIndex < after.memberArray.length; memberIndex++) {
		var now = after.memberArray[memberIndex];
		var was = null;
		for (var scanIndex = 0; scanIndex < before.memberArray.length; scanIndex++) {
			if (before.memberArray[scanIndex].instanceId == now.instanceId) was = before.memberArray[scanIndex];
		}
		if (was == null) { result.push("member joined: " + now.instanceId); continue; }
		if (now.health !== was.health && logHas("damage", "targetId", now.instanceId) == false && logHas("heal", "targetId", now.instanceId) == false) {
			result.push("health of " + now.instanceId + ": " + was.health + " -> " + now.health);
		}
		if (now.maxHealth !== was.maxHealth) result.push("maximum health of " + now.instanceId + ": " + was.maxHealth + " -> " + now.maxHealth);
		if (now.downed !== was.downed && logHas("downed", "targetId", now.instanceId) == false) result.push("downed state of " + now.instanceId);
		for (var statusIndex in now.statusArray) {
			if (Object.prototype.hasOwnProperty.call(now.statusArray, statusIndex) == false) continue;
			if (now.statusArray[statusIndex] !== was.statusArray[statusIndex] && logHas("status", "targetId", now.instanceId) == false) {
				result.push("status " + statusIndex + " on " + now.instanceId);
			}
		}
		for (var oldStatusIndex in was.statusArray) {
			if (Object.prototype.hasOwnProperty.call(was.statusArray, oldStatusIndex) == false) continue;
			if (now.statusArray[oldStatusIndex] == null && logHas("statusRemoved", "targetId", now.instanceId) == false) {
				result.push("status " + oldStatusIndex + " gone from " + now.instanceId);
			}
		}
	}

	for (var cardId in after.deckArray) {
		if (Object.prototype.hasOwnProperty.call(after.deckArray, cardId) == false) continue;
		if (before.deckArray[cardId] == null) {
			if (logHas("deckCardAdded", "cardId", cardId) == false) result.push("deck gained " + cardId);
		} else if (before.deckArray[cardId] !== after.deckArray[cardId] && logHas("cardUpgraded", "cardId", cardId) == false) {
			result.push("deck card " + cardId + " changed level");
		}
	}
	for (var oldCardId in before.deckArray) {
		if (Object.prototype.hasOwnProperty.call(before.deckArray, oldCardId) == false) continue;
		if (after.deckArray[oldCardId] == null && logHas("deckCardRemoved", "cardId", oldCardId) == false) result.push("deck lost " + oldCardId);
	}

	for (var relicIndex = 0; relicIndex < after.relicArray.length; relicIndex++) {
		var relic = after.relicArray[relicIndex];
		if (before.relicArray.indexOf(relic) < 0 && logHas("relicGained", "relic", relic) == false) result.push("relic gained: " + relic);
	}
	for (var oldRelicIndex = 0; oldRelicIndex < before.relicArray.length; oldRelicIndex++) {
		if (after.relicArray.indexOf(before.relicArray[oldRelicIndex]) < 0) result.push("relic lost: " + before.relicArray[oldRelicIndex]);
	}

	//A resource may move by the choice's own cost (printed beside it), by a logged gain, or by a relic
	//paid in experience for being a duplicate (logged as relicDuplicate). Anything else is unexplained.
	//Experience itself is exempt: first discoveries pay into it from inside addCardToRunDeck and
	//grantRelic, which is meta-progression the "New" tag on the choice already advertises, not
	//something the choice promises.
	for (var resource in after.resourceArray) {
		if (Object.prototype.hasOwnProperty.call(after.resourceArray, resource) == false) continue;
		if (resource == honeycomb.tuning.progression.experienceResource) continue;
		var expected = 0;
		if (choice != null && choice.costArray != null && choice.costArray[resource] != null) expected -= choice.costArray[resource];
		for (var entryIndex = 0; entryIndex < logArray.length; entryIndex++) {
			var entry = logArray[entryIndex];
			if (entry == null) continue;
			if (entry.type == "resource" && entry.resource == resource) expected += entry.amount;
		}
		var actual = after.resourceArray[resource] - before.resourceArray[resource];
		if (actual !== expected) result.push("resource " + resource + ": " + before.resourceArray[resource] + " -> " + after.resourceArray[resource] + " (log explains " + expected + ")");
	}
	return result;
};

//---------------------------------------------------------------------------------------------------
//While something is held
//---------------------------------------------------------------------------------------------------
//THE HELD READING. `play` is the action on its own; `combined` is the action followed by the whole turn
//handover, restricted to the party -- which is what an ally's bar shows while a card is in hand, since
//the question the player is asking is "if I play this, where does that leave us".
//
//`playFunction` performs the action for real inside the dry run and returns its log, or null when it
//cannot be performed. `shiftFunction` is the fallback for an action still waiting on a target: it
//performs only what is already known -- the owner's move through the party -- and returns that log.
honeycomb.forecast.held = function (key, playFunction, shiftFunction) {
	if (honeycomb.forecast.cacheArray[key] !== undefined) return honeycomb.forecast.cacheArray[key];
	var settings = honeycomb.tuning.forecast;
	var withTurn = settings.heldEnabled == true && settings.incomingEnabled == true;

	var boundary = { length: 0, played: false };
	var logArray = honeycomb.forecast.dryRunLog(function () {
		var actionLog = null;
		if (playFunction != null && settings.aimEnabled == true) actionLog = playFunction();
		if (actionLog != null) {
			boundary.played = true;
		} else {
			actionLog = shiftFunction == null ? [] : shiftFunction();
		}
		boundary.length = actionLog.length;
		var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
		if (withTurn == false || combat == null || combat.phase != "playerTurn") return actionLog;
		return actionLog.concat(honeycomb.forecast.runHandover());
	});

	var reading = null;
	if (logArray != null) {
		reading = {
			play: boundary.played ? honeycomb.forecast.readLog(logArray.slice(0, boundary.length)) : null,
			combined: withTurn ? honeycomb.forecast.restrictToSide(honeycomb.forecast.readLog(logArray), "ally") : null,
		};
	}
	honeycomb.forecast.cacheArray[key] = reading;
	return reading;
};

//A card held, over a target or over nothing yet.
honeycomb.forecast.forHeldCard = function (cardInstanceId, targetInstanceId) {
	if (cardInstanceId == null) return null;
	var key = "held:" + cardInstanceId + "|" + (targetInstanceId == null ? "" : targetInstanceId);
	var card = honeycomb.combat.resolveById(cardInstanceId);
	if (card == null) return null;
	//A card that picks CARDS plays without a target and asks once played, so it is forecast as played
	//-- up to the question, which is as far as anything can honestly be said.
	var playsNow = honeycomb.targetModeRequiresPick(card.targetMode) == false || targetInstanceId != null ||
		honeycomb.targetModeKind(card.targetMode) == "card";

	return honeycomb.forecast.held(key,
		playsNow ? function () {
			var result = honeycomb.combat.playCard(cardInstanceId, targetInstanceId);
			return result == null || result.played != true ? null : result.context.log;
		} : null,
		function () {
			//Where the owner WILL stand is known before the target is, and it is what decides who the
			//enemies hit -- so it is forecast on its own while the card is still looking for one.
			var combat = honeycomb.state.run.combat;
			var liveCard = honeycomb.combat.resolveById(cardInstanceId);
			var actor = honeycomb.cardActingEntity(liveCard, combat);
			var context = honeycomb.newEffectContext({ combat: combat });
			if (actor != null && honeycomb.tuning.combat.partyShiftEnabled == true) {
				honeycomb.shiftEntity(actor, honeycomb.cardPartyShift(liveCard, actor), context);
			}
			return context.log;
		});
};

//An ability aimed, on the same terms.
honeycomb.forecast.forHeldAbility = function (memberInstanceId, abilityIndex, targetInstanceId) {
	if (memberInstanceId == null || abilityIndex == null) return null;
	var key = "heldAbility:" + memberInstanceId + "/" + abilityIndex + "|" + (targetInstanceId == null ? "" : targetInstanceId);
	var definition = honeycomb.abilities.definitionFor(honeycomb.abilities.findMember(memberInstanceId), abilityIndex);
	var playsNow = definition != null && (honeycomb.targetModeRequiresPick(definition.targetMode) == false || targetInstanceId != null);
	return honeycomb.forecast.held(key,
		playsNow ? function () {
			var result = honeycomb.abilities.use(memberInstanceId, abilityIndex, targetInstanceId);
			return result == null || result.played != true ? null : result.context.log;
		} : null,
		null);
};

//---------------------------------------------------------------------------------------------------
//Reading a Lewd card
//---------------------------------------------------------------------------------------------------
//Shows each opposing fighter's weakness progress, current rank and modifier, and how much damage they
//will take from the card's tags. Pauses the forecast happening passively at rest and runs a forecast
//for just that card; applies to both enemy and ally characters.
//
//`request` is {cardInstanceId} for a card in the hand, or {sourceId, cardIndex} for a move an AI combatant
//telegraphs. Returns null when the card is not Lewd, or when there is no fight to read it against.
//
//JUST THE CARD, AGAINST EACH FIGHTER IT COULD REACH. The card's own effects are run for real and rolled
//back -- the same statuses, hooks and weakness multiplier a play would meet -- but not the play around
//them: no cost, no party step, no enemy turn, because the question is "what does this card do to them".
//How many dry runs that takes depends on how the card picks:
//  a pick or a random pick   once PER candidate, with that candidate forced as the target, so every one
//                            of them shows what it would take if the card landed on them. A random card's
//                            reading is marked `chance`: it lands on one of them, not all.
//  anything else             once, resolved normally, so "the party member in front" shows on the front
//                            member alone and "every party member" on all of them.
//
//The result: {card, actorId, byEntity, entityArray, peekArray}. `byEntity` holds one summary per fighter,
//as every other reading does, so the bars draw it through markFor with no special case. `peekArray` is
//what the panel over each fighter prints (honeycomb.forecast.lustPeek).
honeycomb.forecast.forLustInspection = function (request) {
	var settings = honeycomb.tuning.forecast;
	if (settings.lustInspectionEnabled != true || request == null) return null;
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (combat == null || combat.phase == "victory" || combat.phase == "defeat") return null;

	var card = null;
	var actor = null;
	if (request.cardInstanceId != null) {
		card = honeycomb.combat.resolveById(request.cardInstanceId);
		actor = card == null ? null : honeycomb.cardActingEntity(card, combat);
	} else if (request.sourceId != null) {
		actor = honeycomb.findEntity(request.sourceId, combat);
		card = actor == null ? null : honeycomb.moveCard(actor, request.cardIndex);
	}
	if (card == null || honeycomb.cardHasType(card, settings.lustInspectionCardType) == false) return null;

	var key = "lustInspection:" + (request.cardInstanceId != null ? request.cardInstanceId : request.sourceId + "/" + request.cardIndex);
	if (honeycomb.forecast.cacheArray[key] !== undefined) return honeycomb.forecast.cacheArray[key];

	var actorId = actor == null ? null : actor.instanceId;
	var definition = honeycomb.targetModeDefinition(card.targetMode);
	var picks = definition != null && definition.requiresPick == true && honeycomb.targetModeKind(card.targetMode) == "entity";
	var random = definition != null && definition.random == true;

	//Who it could reach: the fighters the mode draws from (the broken passed over where the mode says so),
	//or the whole other team for a mode that names none, since lust aimed there is what made it Lewd.
	var candidateContext = honeycomb.newEffectContext({ source: actor, card: card, combat: combat });
	var candidateArray = definition != null && definition.relation != null
		? honeycomb.targetCandidateArray(definition, candidateContext)
		: honeycomb.relatedLivingArray("opponent", candidateContext);
	var candidateIdArray = [];
	for (var candidateIndex = 0; candidateIndex < candidateArray.length; candidateIndex++) {
		if (honeycomb.entityUsesLust(candidateArray[candidateIndex]) == false) continue;
		candidateIdArray.push(candidateArray[candidateIndex].instanceId);
	}

	//One dry run of the card's effects. `forcedId` null resolves the mode as a play would.
	function runCard(forcedId) {
		return honeycomb.forecast.dryRunLog(function () {
			var liveCombat = honeycomb.state.run.combat;
			var liveActor = actorId == null ? null : honeycomb.findEntity(actorId, liveCombat);
			var context = honeycomb.newEffectContext({ source: liveActor, card: card, combat: liveCombat });
			if (forcedId == null) {
				honeycomb.applyResolvedTargets(context, card.targetMode, honeycomb.resolveTargetMode(card.targetMode, context));
			} else {
				//Filed directly rather than through applyResolvedTargets, which would mark a random mode as
				//chance: this target is the one being asked about, so its reading is certain for it.
				var forced = honeycomb.findEntity(forcedId, liveCombat);
				context.target = forced;
				context.targetArray = forced == null ? [] : [forced];
			}
			honeycomb.resolveEffectArray(honeycomb.cardEffectArray(card, liveCombat), context);
			return context.log;
		});
	}

	var byEntity = {};
	var entityArray = [];
	var tagsByEntity = {};
	function take(logArray, entityId) {
		if (logArray == null) return;
		var reading = honeycomb.forecast.readLog(logArray);
		for (var summaryIndex = 0; summaryIndex < reading.entityArray.length; summaryIndex++) {
			var summary = reading.entityArray[summaryIndex];
			if (entityId != null && summary.entityId != entityId) continue;
			if (candidateIdArray.indexOf(summary.entityId) < 0 || byEntity[summary.entityId] != null) continue;
			byEntity[summary.entityId] = summary;
			entityArray.push(summary);
		}
		//The tags each fighter was hit with, from the lust entries themselves: exactly what the weakness
		//ledger would have been written under.
		for (var entryIndex = 0; entryIndex < logArray.length; entryIndex++) {
			var entry = logArray[entryIndex];
			if (entry == null || entry.type != "lust" || entry.targetId == null) continue;
			if (entityId != null && entry.targetId != entityId) continue;
			var tagArray = tagsByEntity[entry.targetId] == null ? (tagsByEntity[entry.targetId] = []) : tagsByEntity[entry.targetId];
			var entryTagArray = entry.tagArray == null ? [] : entry.tagArray;
			for (var tagIndex = 0; tagIndex < entryTagArray.length; tagIndex++) {
				if (tagArray.indexOf(entryTagArray[tagIndex]) < 0) tagArray.push(entryTagArray[tagIndex]);
			}
		}
	}

	if (picks || random) {
		for (var runIndex = 0; runIndex < candidateIdArray.length; runIndex++) {
			take(runCard(candidateIdArray[runIndex]), candidateIdArray[runIndex]);
		}
	} else {
		take(runCard(null), null);
	}

	var peekArray = [];
	for (var peekIndex = 0; peekIndex < entityArray.length; peekIndex++) {
		var peek = honeycomb.forecast.lustPeek(entityArray[peekIndex],
			tagsByEntity[entityArray[peekIndex].entityId] == null ? [] : tagsByEntity[entityArray[peekIndex].entityId], random);
		if (peek != null) peekArray.push(peek);
	}

	var result = { card: card, actorId: actorId, byEntity: byEntity, entityArray: entityArray, peekArray: peekArray };
	honeycomb.forecast.cacheArray[key] = result;
	return result;
};

//What the panel over one fighter prints, from their summary: the lust and damage the card would deal them,
//and for a CHARACTER (anyone with a weakness ledger) one row per card tag the hit carries -- where that
//weakness stands, its rank and multiplier, and where this hit would leave it. Null for a fighter the card
//would not touch. Read against the live state, after the dry runs are rolled back.
honeycomb.forecast.lustPeek = function (summary, tagArray, chance) {
	if (summary == null || summary.lustGained <= 0) return null;
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var entity = honeycomb.findEntity(summary.entityId, combat);
	if (entity == null) return null;
	var rowArray = [];
	if (entity.characterIndex != null) {
		for (var tagIndex = 0; tagIndex < tagArray.length; tagIndex++) {
			//Printed tags only: a stray label carried by an attacker is not a weakness anybody can read about.
			if (honeycomb.findDefinition(honeycomb.cardTagArray, tagArray[tagIndex]) == null) continue;
			rowArray.push(honeycomb.lust.previewExposure(entity.characterIndex, tagArray[tagIndex], summary.lustGained));
		}
	}
	return {
		entityId: summary.entityId,
		lust: summary.lustGained,
		//The whole hit, Temporary HP included: the bar under the panel already shows how much of it is health.
		damage: summary.damage + summary.absorbed,
		breaks: summary.broke == true,
		chance: chance == true,
		rowArray: rowArray,
	};
};

//---------------------------------------------------------------------------------------------------
//What is about to happen to the party
//---------------------------------------------------------------------------------------------------
//The whole turn handover, dry-run. That is strictly more truthful than adding up the numbers over the
//enemies' heads, because it includes everything those numbers leave out -- poison ticking, an enemy
//dying to that poison before it swings, a status expiring, a relic reacting.
//
//It is also the honest answer to "will this kill me", which is the question the intent icons were
//being asked and could not answer.
honeycomb.forecast.incoming = function () {
	if (honeycomb.tuning.forecast.incomingEnabled != true) return null;
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (combat == null || combat.phase != "playerTurn") return null;

	if (honeycomb.forecast.cacheArray.incoming !== undefined) return honeycomb.forecast.cacheArray.incoming;

	var logArray = honeycomb.forecast.dryRunLog(function () {
		return honeycomb.forecast.runHandover();
	});

	//Both sides are reported. Poison ticks at the start of its owner's turn, so an enemy's poison is
	//already in this log; filtering it out would hide the entire payoff of playing Nettle, since the
	//enemy's bar would say nothing about applied Poison until the turn passes.
	//
	//Nothing an enemy does to ANOTHER enemy is in here to clutter it: an enemy's own attacks target the
	//party, so the only entries landing on an enemy are the ones the player arranged -- their poison,
	//their thorns, an ally they summoned. `incomingIncludesEnemies` puts it back to party-only.
	var reading = logArray == null ? null : honeycomb.forecast.readLog(logArray);
	if (reading != null && honeycomb.tuning.forecast.incomingIncludesEnemies != true) {
		reading = honeycomb.forecast.restrictToSide(reading, "ally");
	}
	honeycomb.forecast.cacheArray.incoming = reading;
	return reading;
};

//---------------------------------------------------------------------------------------------------
//What the bars draw
//---------------------------------------------------------------------------------------------------
//The mark on one entity's bar right now, or null.
//
//While something is held, it answers for the held reading: an ally shows where the play AND the enemy
//turn after it leave them, an enemy shows what the play alone does to them. With nothing held, the
//party shows the standing incoming forecast. The held reading wins because the player is asking a
//question about THIS play, and answering a different one over the top of it is how a readout stops
//being trusted.
honeycomb.forecast.markFor = function (entityId) {
	if (entityId == null) return null;
	var aiming = honeycomb.forecast.aiming;
	if (aiming != null) {
		if (aiming.combined != null && aiming.combined.byEntity[entityId] != null) {
			var playSummary = aiming.play == null ? null : aiming.play.byEntity[entityId];
			return honeycomb.forecast.markFrom(aiming.combined.byEntity[entityId], "held", playSummary);
		}
		if (aiming.play != null && aiming.play.byEntity[entityId] != null) {
			return honeycomb.forecast.markFrom(aiming.play.byEntity[entityId], "outgoing", null);
		}
	}

	//A Lewd card being read: what it would do to each fighter it could reach, and nothing else. The
	//resting forecast is paused for everyone while it stands, so an untouched bar reads as "this card
	//does not reach them" rather than showing the enemy turn underneath.
	var inspecting = honeycomb.forecast.inspecting;
	if (inspecting != null && inspecting.byEntity[entityId] != null) {
		return honeycomb.forecast.markFrom(inspecting.byEntity[entityId], "inspect", null);
	}

	if (aiming != null) {
		//An ally the held play leaves untouched still has a turn coming. Nothing held about them means
		//the combined reading had nothing to say, which is itself the answer: nothing happens.
		if (aiming.combined != null) return null;
	}
	if (inspecting != null) return null;

	var standing = honeycomb.forecast.standing;
	if (standing != null && standing.byEntity[entityId] != null) {
		return honeycomb.forecast.markFrom(standing.byEntity[entityId], "incoming", null);
	}
	return null;
};

//Turns a summary into the things a bar needs. In "exact" mode a random hit counts as certain and there
//is no might; in "potential" mode it is held apart. A summary that moves nothing draws nothing.
//
//`playSummary` is the held play on its own, so a held mark can say how much of the change is the
//card's doing and how much is the enemy turn's.
honeycomb.forecast.markFrom = function (summary, kind, playSummary) {
	if (summary == null) return null;
	var exact = honeycomb.tuning.forecast.randomTargets == "exact";
	var after = exact ? summary.healthAfter : summary.certainAfter;
	var delta = exact ? summary.healthDelta : summary.certainDelta;
	var potential = exact ? 0 : summary.potentialDamage;
	var temporaryGained = exact ? summary.temporaryGained : summary.certainTemporaryGained;
	var lethal = exact ? summary.downed == true || summary.healthAfter <= 0 : summary.certainDowned == true || summary.certainAfter <= 0;
	//Gold eaten by the enemy turn is worth a mark on its own: a hit that tHP absorbs completely moves no
	//health at all, and is exactly the thing the player needs to see coming.
	var temporaryAfter = summary.temporaryAfterEnemyTurn;
	var temporaryMoves = temporaryAfter != null && temporaryAfter !== summary.temporaryHealth + temporaryGained;
	//Lust is a reason for a mark in its own right. A card or an intent that moves nothing but lust still
	//has to draw one, or the bar goes quiet about the half of it that is about to end the fight. A random
	//Lust that might land is a reason too, on every candidate.
	var lustGained = exact ? summary.lustGained : summary.certainLustGained;
	var lustMight = exact ? 0 : summary.potentialLust;
	if (delta === 0 && temporaryGained === 0 && potential <= 0 && temporaryMoves == false
		&& lustGained === 0 && lustMight <= 0 && summary.willBreak != true && summary.recovered != true) return null;

	var playAfter = null;
	if (playSummary != null) playAfter = exact ? playSummary.healthAfter : playSummary.certainAfter;

	return {
		kind: kind,
		health: summary.health,
		healthDelta: delta,
		healthAfter: after,
		playAfter: playAfter,
		potentialDamage: potential,
		potentialAfter: exact ? after : summary.potentialAfter,
		temporaryGained: temporaryGained,
		temporaryAfter: temporaryMoves ? temporaryAfter : null,
		lustGained: lustGained,
		lustMight: lustMight,
		lustAfter: exact ? summary.lustAfter : summary.certainLustAfter,
		//How much lust would STILL have to arrive to break them once this has played out. The single
		//most useful number on an ally's bar now, and what hcLustWarning keys on.
		breakMargin: summary.breakMargin,
		willBreak: summary.willBreak == true,
		mightBreak: exact ? false : summary.mightBreak == true,
		recovers: summary.recovered == true,
		lethal: lethal,
		mightDie: exact ? false : summary.mightDie == true,
		summary: summary,
	};
};

//What is about to move one reading, in words, for the bar's tooltips.
//
//`kind` is "health", "temporary" or "lust". Returns one entry per cause, largest first, each already
//worded: {text, amount, chance}. Causes of the same thing from the same source are folded together, so
//a three-hit attack reads as one line of nine rather than three lines of three.
honeycomb.forecast.causeLineArray = function (mark, kind) {
	var summary = mark == null ? null : mark.summary;
	if (summary == null || summary.causeArray == null) return [];
	var folded = [];
	for (var scanIndex = 0; scanIndex < summary.causeArray.length; scanIndex++) {
		var cause = summary.causeArray[scanIndex];
		if (cause.kind != kind) continue;
		var text = honeycomb.forecast.causeName(cause);
		var existing = null;
		for (var foldIndex = 0; foldIndex < folded.length; foldIndex++) {
			if (folded[foldIndex].text == text && folded[foldIndex].chance == cause.chance) existing = folded[foldIndex];
		}
		if (existing != null) { existing.amount += cause.amount; continue; }
		folded.push({ text: text, amount: cause.amount, chance: cause.chance });
	}
	folded.sort(function (left, right) { return Math.abs(right.amount) - Math.abs(left.amount); });
	return folded;
};

//What to call one cause. In order: the card or ability that was resolving, then the kind of damage
//(which is what names poison, thorns and the broken spiral, none of which come from a card), then
//whoever did it, then nothing useful at all.
honeycomb.forecast.causeName = function (cause) {
	if (cause.via != null) {
		var card = honeycomb.findDefinition(honeycomb.cardArray, cause.via);
		if (card != null) return card.name;
		var ability = honeycomb.findDefinition(honeycomb.abilityArray, cause.via);
		if (ability != null) return ability.name;
	}
	if (cause.damageType != null) {
		//A damage type that is also a status is named as that status, which is what the player sees on
		//the plate. Anything else is printed as it is written.
		var status = honeycomb.findDefinition(honeycomb.statusArray, cause.damageType);
		if (status != null) return status.name;
		return cause.damageType.charAt(0).toUpperCase() + cause.damageType.slice(1);
	}
	if (cause.sourceId != null) {
		var entity = honeycomb.findEntity(cause.sourceId,
			honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat);
		var found = entity == null ? null : honeycomb.entityDefinition(entity);
		if (found != null) return found.definition.name;
	}
	return "Something";
};

//---------------------------------------------------------------------------------------------------
//Keeping it current
//---------------------------------------------------------------------------------------------------
//Every forecast is answered against the board as it stands, so ANY change to the board invalidates
//all of them. Clearing rather than recomputing keeps the cost where it belongs: a forecast nobody
//asks for is never computed at all.
honeycomb.forecast.invalidate = function () {
	honeycomb.forecast.cacheArray = {};
	honeycomb.forecast.standing = null;
	honeycomb.forecast.aiming = null;
	honeycomb.forecast.inspecting = null;
};

//Called from the combat scene's repaint. The standing forecast is computed eagerly because every ally
//bar in the repaint about to happen wants it; the held one stays lazy. A lust inspection is dropped too:
//the scene asks for it again against the new board if the card is still being read.
honeycomb.forecast.refreshStanding = function () {
	honeycomb.forecast.cacheArray = {};
	honeycomb.forecast.aiming = null;
	honeycomb.forecast.inspecting = null;
	honeycomb.forecast.standing = honeycomb.forecast.incoming();
};

//Sets or clears the held reading. Returns true when it actually changed, so the caller can skip a
//repaint that would draw the same thing.
honeycomb.forecast.aimAtCard = function (cardInstanceId, targetInstanceId) {
	var reading = cardInstanceId == null ? null : honeycomb.forecast.forHeldCard(cardInstanceId, targetInstanceId);
	var changed = honeycomb.forecast.aiming !== reading;
	honeycomb.forecast.aiming = reading;
	return changed;
};

honeycomb.forecast.aimAtAbility = function (memberInstanceId, abilityIndex, targetInstanceId) {
	var reading = honeycomb.forecast.forHeldAbility(memberInstanceId, abilityIndex, targetInstanceId);
	var changed = honeycomb.forecast.aiming !== reading;
	honeycomb.forecast.aiming = reading;
	return changed;
};

honeycomb.forecast.clearAim = function () {
	var changed = honeycomb.forecast.aiming != null;
	honeycomb.forecast.aiming = null;
	return changed;
};
