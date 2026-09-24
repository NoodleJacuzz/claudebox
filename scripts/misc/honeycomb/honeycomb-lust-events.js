//===================================================================================================
//HONEYCOMB CATACOMBS -- Lust Events (the QUEUE)
//===================================================================================================
//THE QUEUE. honeycomb.lustEventQueueArray is the whole spine. One row names a character, the event, and
//what has to be true before it is owed. A row is READY when its requirements pass and its key is not in
//the profile's completed list, and a character with any ready row is EVENT READY: locked out of the party
//until the row at the head of their queue has been played.
//
//Nothing about this is stored at the moment a rank is crossed. The queue is DERIVED, every time it is
//asked, from requirements and the completed list -- which is what makes a row written today fire for a
//profile that passed its requirement a month ago, with no backfill and no reconciliation. It is also what
//lets a row be replaced wholesale, depend on other rows, or be taken back out again.
//
//WHAT THE PROFILE STORES:
//  profile.lustEventDoneArray   the completed rows, as a LIST of keys -- not a count. "nettleVenom1", or
//                               "genericFirstStirring/nettle" for a row that fans out across characters.
//  profile.lustRankUpArray      per character, the rank-ups still waiting to be SEEN: {id, tag, rank}.
//                               These carry no event any more. They are the Rank Up Notification alone --
//                               the pink weakness row and "Recently ranked up!" -- and a weakness clears
//                               its own when it is hovered, clicked or tapped on the sheet.
//
//The two states no longer share a source, so they cannot disagree:
//  EVENT READY  is read off the QUEUE     (requirements met, not yet completed) and locks the character.
//  RANK UP      is read off the RECORDS   (a rank crossed, not yet seen) and locks nothing.
//Event Ready overtakes Rank Up wherever one thing has to be shown.
//
//An event is started from the character, not a weakness row: the heart that replaces the party toggle on
//a locked roster entry, and the banner across the top of that character's sheet. A queue row's
//requirement can be anything, not tied to one weakness, so the trigger cannot live on a weakness row.
//Both play the head of the queue.
//
//Content lives in honeycomb-content-lust-events.js; this is the engine, the host an event is opened from
//between runs, the Lust Battle, and the profile effects the events use.
window.honeycomb = window.honeycomb || {};

honeycomb.lustEvents = {};

//---------------------------------------------------------------------------------------------------
//The rank-up ledger -- notifications only
//---------------------------------------------------------------------------------------------------
//A record is a rank crossed that the player has not looked at yet. It says nothing about events.
honeycomb.lustEvents.recordArray = function (characterIndex, create) {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile == null || characterIndex == null) return create == true ? null : [];
	if (profile.lustRankUpArray == null) {
		if (create != true) return [];
		profile.lustRankUpArray = {};
	}
	if (profile.lustRankUpArray[characterIndex] == null) {
		if (create != true) return [];
		profile.lustRankUpArray[characterIndex] = [];
	}
	return profile.lustRankUpArray[characterIndex];
};


//Called by honeycomb.lust.noteRankChange for every rank crossed. Returns the record.
honeycomb.lustEvents.recordRankUp = function (characterIndex, tagIndex, rank, context) {
	var recordArray = honeycomb.lustEvents.recordArray(characterIndex, true);
	if (recordArray == null) return null;
	var profile = honeycomb.state.profile;
	profile.lustRankUpCounter = (profile.lustRankUpCounter == null ? 0 : profile.lustRankUpCounter) + 1;
	var record = { id: profile.lustRankUpCounter, tag: tagIndex, rank: rank };
	recordArray.push(record);
	honeycomb.logEvent(context, { type: "lustRankRecorded", characterIndex: characterIndex, tag: tagIndex, rank: rank });
	return record;
};

//SEEING A WEAKNESS. Removes that weakness's records for that character alone -- never anyone else's, which
//is the easy mistake the brief names. Returns whether anything changed.
honeycomb.lustEvents.noticeTag = function (characterIndex, tagIndex) {
	var recordArray = honeycomb.lustEvents.recordArray(characterIndex, false);
	var changed = false;
	for (var scanIndex = recordArray.length - 1; scanIndex >= 0; scanIndex--) {
		if (recordArray[scanIndex].tag !== tagIndex) continue;
		recordArray.splice(scanIndex, 1);
		changed = true;
	}
	return changed;
};

//---------------------------------------------------------------------------------------------------
//THE QUEUE
//---------------------------------------------------------------------------------------------------
//A row of honeycomb.lustEventQueueArray, read into the shape the engine works in. `problem` is a sentence
//for the warning report when a row cannot be read, and such a row is never ready.
//
//  index              the row's stable name. It is also the completion key, so RENAMING a row offers it
//                     again and replacing the `event` under the same name does not.
//  character          one character index, an array of them, or "any" for every unlocked character. A row
//                     that fans out is completed per character ("row/nettle").
//  event              the honeycomb.eventArray entry played.
//  tag                optional: the weakness the scene is ABOUT. Fills {tag}, and is what
//                     `gainWeakness: {tag: "eventTag"}` grows.
//  rank               optional: the rank of that weakness the scene is about. Fills {rank}, and IMPLIES
//                     the requirement that the weakness has reached it -- the common case, written once.
//  requirementArray   conditions, all of which must pass, with the character as the subject. ANDed on top
//                     of the implied rank requirement.
//  locksParty         false for a row that may sit in the queue without benching the character. The
//                     default is true: a queued scene locks, which is what makes the queue a queue.
honeycomb.lustEvents.readEntry = function (row, position) {
	var entry = {
		index: row == null ? String(row) : row.index, position: position,
		characterArray: null, tag: null, rank: null, eventIndex: row == null ? null : row.event,
		requirementArray: row == null || row.requirementArray == null ? [] : row.requirementArray,
		locksParty: row == null || row.locksParty !== false,
		problem: null,
	};
	if (row == null || typeof row !== "object") { entry.problem = "is not a row object."; return entry; }
	if (row.index == null || row.index === "") { entry.problem = "has no index."; return entry; }

	//WHO IT IS FOR. "any" is resolved late, against the profile, so a character unlocked tomorrow joins
	//the row without the row being rewritten.
	if (row.character == "any") entry.characterArray = "any";
	else {
		var nameArray = Array.isArray(row.character) ? row.character : [row.character];
		entry.characterArray = [];
		for (var scanIndex = 0; scanIndex < nameArray.length; scanIndex++) {
			if (honeycomb.findDefinition(honeycomb.characterArray, nameArray[scanIndex]) == null) {
				entry.problem = "names \"" + nameArray[scanIndex] + "\", which is not a character or \"any\".";
				return entry;
			}
			entry.characterArray.push(nameArray[scanIndex]);
		}
		if (entry.characterArray.length === 0) { entry.problem = "names no character."; return entry; }
	}

	if (row.tag != null) {
		var tagDefinition = honeycomb.findDefinition(honeycomb.cardTagArray, row.tag);
		if (tagDefinition == null || tagDefinition.lustTag != true) {
			entry.problem = "names \"" + row.tag + "\", which is not a lust tag.";
			return entry;
		}
		entry.tag = row.tag;
	}
	if (row.rank != null) {
		if (honeycomb.lust.rankDefinitionByRank(row.rank) == null) {
			entry.problem = "names rank " + row.rank + ", which does not exist.";
			return entry;
		}
		if (entry.tag == null) { entry.problem = "names a rank without a tag for it to be a rank of."; return entry; }
		entry.rank = row.rank;
	}
	if (honeycomb.findDefinition(honeycomb.eventArray, row.event) == null) {
		entry.problem = "names event \"" + row.event + "\", which does not exist.";
		return entry;
	}
	return entry;
};

//Every row, read, in the order written. Order IS priority: the head of a character's queue is the first
//row in this table they are owed.
honeycomb.lustEvents.entryArray = function () {
	var result = [];
	var rowArray = honeycomb.lustEventQueueArray == null ? [] : honeycomb.lustEventQueueArray;
	for (var rowIndex = 0; rowIndex < rowArray.length; rowIndex++) {
		result.push(honeycomb.lustEvents.readEntry(rowArray[rowIndex], rowIndex));
	}
	return result;
};

honeycomb.lustEvents.findEntry = function (entryIndex) {
	var entryArray = honeycomb.lustEvents.entryArray();
	for (var scanIndex = 0; scanIndex < entryArray.length; scanIndex++) {
		if (entryArray[scanIndex].index === entryIndex) return entryArray[scanIndex];
	}
	return null;
};

//The characters a row is offered to. A fanned-out row reaches the UNLOCKED roster only: a character
//nobody has met cannot be standing in teambuilding waiting to be talked to.
honeycomb.lustEvents.entryCharacterArray = function (entry) {
	if (entry == null || entry.problem != null) return [];
	if (entry.characterArray !== "any") return entry.characterArray;
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	var unlockedArray = profile == null || profile.unlockedCharacterArray == null ? [] : profile.unlockedCharacterArray;
	var result = [];
	for (var scanIndex = 0; scanIndex < unlockedArray.length; scanIndex++) {
		if (honeycomb.findDefinition(honeycomb.characterArray, unlockedArray[scanIndex]) == null) continue;
		result.push(unlockedArray[scanIndex]);
	}
	return result;
};

honeycomb.lustEvents.entryIsFor = function (entry, characterIndex) {
	return honeycomb.lustEvents.entryCharacterArray(entry).indexOf(characterIndex) >= 0;
};

//---------------------------------------------------------------------------------------------------
//The completed list
//---------------------------------------------------------------------------------------------------
//The completed list is a list, not a count, since a tally cannot say WHICH events triggered. A row that
//names one character is keyed by its index alone; a row that fans out carries the character, so the
//same scene can be owed to each of them in turn.
honeycomb.lustEvents.doneKey = function (entry, characterIndex) {
	if (entry == null) return null;
	return entry.characterArray === "any" || (entry.characterArray != null && entry.characterArray.length > 1)
		? entry.index + "/" + characterIndex : entry.index;
};

honeycomb.lustEvents.doneArray = function (create) {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile == null) return create == true ? null : [];
	if (profile.lustEventDoneArray == null) {
		if (create != true) return [];
		profile.lustEventDoneArray = [];
	}
	return profile.lustEventDoneArray;
};

honeycomb.lustEvents.isDone = function (entry, characterIndex) {
	var key = honeycomb.lustEvents.doneKey(entry, characterIndex);
	return key != null && honeycomb.lustEvents.doneArray(false).indexOf(key) >= 0;
};

honeycomb.lustEvents.markDone = function (entry, characterIndex) {
	var key = honeycomb.lustEvents.doneKey(entry, characterIndex);
	var doneArray = honeycomb.lustEvents.doneArray(true);
	if (key == null || doneArray == null || doneArray.indexOf(key) >= 0) return false;
	doneArray.push(key);
	return true;
};

//Putting a row BACK in the queue, which is the console's way of replaying a scene and the test suite's.
honeycomb.lustEvents.clearDone = function (entryIndex, characterIndex) {
	var entry = honeycomb.lustEvents.findEntry(entryIndex);
	var key = entry == null ? entryIndex : honeycomb.lustEvents.doneKey(entry, characterIndex);
	var doneArray = honeycomb.lustEvents.doneArray(false);
	var position = doneArray.indexOf(key);
	if (position < 0) return false;
	doneArray.splice(position, 1);
	return true;
};

//Every completed row as {entry, characterIndex}, for anything counting how far the story has come. A key
//whose row no longer exists is skipped rather than guessed at.
honeycomb.lustEvents.completedArray = function () {
	var result = [];
	var doneArray = honeycomb.lustEvents.doneArray(false);
	var entryArray = honeycomb.lustEvents.entryArray();
	for (var scanIndex = 0; scanIndex < doneArray.length; scanIndex++) {
		var key = String(doneArray[scanIndex]);
		var slash = key.lastIndexOf("/");
		for (var entryIndex = 0; entryIndex < entryArray.length; entryIndex++) {
			var entry = entryArray[entryIndex];
			if (entry.problem != null) continue;
			if (entry.index === key) { result.push({ entry: entry, characterIndex: entry.characterArray[0] }); break; }
			if (slash > 0 && entry.index === key.slice(0, slash)) { result.push({ entry: entry, characterIndex: key.slice(slash + 1) }); break; }
		}
	}
	return result;
};

//---------------------------------------------------------------------------------------------------
//What a row is owed on
//---------------------------------------------------------------------------------------------------
//The implied requirement, written out: naming `tag` and `rank` on a row means "once that weakness has
//reached that rank". It is the common case and lives here rather than being copied into every row.
honeycomb.lustEvents.impliedRequirement = function (entry) {
	if (entry == null || entry.tag == null || entry.rank == null) return null;
	return { index: "weaknessRank", character: "subject", tag: entry.tag, atLeast: entry.rank };
};

//Every requirement a row carries, implied one first, in the order they are tested.
honeycomb.lustEvents.requirementArray = function (entry) {
	var implied = honeycomb.lustEvents.impliedRequirement(entry);
	var result = implied == null ? [] : [implied];
	var written = entry == null || entry.requirementArray == null ? [] : entry.requirementArray;
	for (var scanIndex = 0; scanIndex < written.length; scanIndex++) result.push(written[scanIndex]);
	return result;
};

//All of them, ANDed, with this character as the subject.
honeycomb.lustEvents.requirementsMet = function (entry, characterIndex) {
	if (entry == null || entry.problem != null || characterIndex == null) return false;
	var context = honeycomb.newEffectContext({ subjectCharacterIndex: characterIndex });
	var requirementArray = honeycomb.lustEvents.requirementArray(entry);
	for (var scanIndex = 0; scanIndex < requirementArray.length; scanIndex++) {
		if (honeycomb.testCondition(requirementArray[scanIndex], context) == false) return false;
	}
	return true;
};

//A row is READY for a character when the row is theirs, its requirements pass, and they have not
//completed it. Nothing here is stored, so a row added today is ready today.
honeycomb.lustEvents.isReady = function (entry, characterIndex) {
	if (honeycomb.tuning.lustEvents.enabled != true) return false;
	if (entry == null || entry.problem != null) return false;
	if (honeycomb.lustEvents.entryIsFor(entry, characterIndex) == false) return false;
	//FORTITUDE: never owed a Lust Event.
	if (honeycomb.lust.hasFortitude(characterIndex)) return false;
	if (honeycomb.lustEvents.isDone(entry, characterIndex)) return false;
	return honeycomb.lustEvents.requirementsMet(entry, characterIndex);
};

//ONE CHARACTER'S QUEUE, in the order the table is written. The head is what plays next.
honeycomb.lustEvents.queueFor = function (characterIndex) {
	var result = [];
	if (characterIndex == null) return result;
	var entryArray = honeycomb.lustEvents.entryArray();
	for (var scanIndex = 0; scanIndex < entryArray.length; scanIndex++) {
		if (honeycomb.lustEvents.isReady(entryArray[scanIndex], characterIndex)) result.push(entryArray[scanIndex]);
	}
	return result;
};

honeycomb.lustEvents.nextFor = function (characterIndex) {
	var queueArray = honeycomb.lustEvents.queueFor(characterIndex);
	return queueArray.length === 0 ? null : queueArray[0];
};


//---------------------------------------------------------------------------------------------------
//States
//---------------------------------------------------------------------------------------------------
//"eventReady", "rankUp" or null, for one character. Event Ready overtakes Rank Up.
honeycomb.lustEvents.characterState = function (characterIndex) {
	if (honeycomb.lustEvents.nextFor(characterIndex) != null) return "eventReady";
	return honeycomb.lustEvents.recordArray(characterIndex, false).length > 0 ? "rankUp" : null;
};

//A weakness says only whether it ranked up and has not been looked at; it is never Event Ready. A queue
//row's requirement need not be a weakness at all, so the row has nowhere on the rail to sit. The scene
//is started from the character instead.
honeycomb.lustEvents.tagState = function (characterIndex, tagIndex) {
	var recordArray = honeycomb.lustEvents.recordArray(characterIndex, false);
	for (var scanIndex = 0; scanIndex < recordArray.length; scanIndex++) {
		if (recordArray[scanIndex].tag === tagIndex) return "rankUp";
	}
	return null;
};

//Whether the weakness ranked up and is still waiting to be seen -- "Recently ranked up!"
honeycomb.lustEvents.tagRecentlyRanked = function (characterIndex, tagIndex) {
	return honeycomb.lustEvents.tagState(characterIndex, tagIndex) != null;
};

//Whether ANY of their weaknesses is waiting to be seen. Asked by the Weaknesses section, which glows for
//news that is actually on its rail -- an Event Ready is not, and characterState would say "eventReady"
//over the top of a notification and glow the section for something not in it.
honeycomb.lustEvents.hasNotification = function (characterIndex) {
	return honeycomb.lustEvents.recordArray(characterIndex, false).length > 0;
};

//A queued row keeps its character out of the party, unless the row says it does not.
honeycomb.lustEvents.blocksParty = function (characterIndex) {
	var queueArray = honeycomb.lustEvents.queueFor(characterIndex);
	for (var scanIndex = 0; scanIndex < queueArray.length; scanIndex++) {
		if (queueArray[scanIndex].locksParty == true) return true;
	}
	return false;
};

//A row's words for event text: the weakness's name and the rank's. A row that names a tag but no rank
//reads the rank the character actually sits at, so "{rank}" is never blank on a scene about a weakness.
honeycomb.lustEvents.entryWords = function (characterIndex, entryIndex) {
	var entry = honeycomb.lustEvents.findEntry(entryIndex);
	if (entry == null || entry.tag == null) return null;
	var tag = honeycomb.findDefinition(honeycomb.cardTagArray, entry.tag);
	var rankNumber = entry.rank == null ? honeycomb.lust.rankFor(characterIndex, entry.tag) : entry.rank;
	var rank = honeycomb.lust.rankDefinitionByRank(rankNumber);
	return { tag: tag == null ? entry.tag : tag.name, rank: rank == null ? "Rank " + rankNumber : rank.name };
};

//---------------------------------------------------------------------------------------------------
//Playing an event from teambuilding
//---------------------------------------------------------------------------------------------------
//Only the HEAD of a queue may be played: the order rows are written in is the order they are seen in.
honeycomb.lustEvents.begin = function (characterIndex, entryIndex) {
	var next = honeycomb.lustEvents.nextFor(characterIndex);
	if (next == null) return false;
	if (entryIndex != null && next.index !== entryIndex) return false;
	if (honeycomb.tooltip != null) honeycomb.tooltip.hide();
	honeycomb.platform.sound("lustEventBegin");
	honeycomb.overlay.open("event", {
		eventIndex: next.eventIndex, host: "lustEvent", subject: characterIndex, lustEntryIndex: next.index,
	});
	return true;
};

//Leaving the event: the row is completed unless a choice said to keep it ready.
honeycomb.lustEvents.finishEvent = function () {
	var subject = honeycomb.eventOverlay.subject;
	var entryIndex = honeycomb.eventOverlay.lustEntryIndex;
	if (honeycomb.eventOverlay.keepsEventReady != true && subject != null && entryIndex != null) {
		var entry = honeycomb.lustEvents.findEntry(entryIndex);
		if (entry != null) honeycomb.lustEvents.markDone(entry, subject);
	}
	honeycomb.overlay.close("event");
	honeycomb.save.autosave("lustEvent");
	honeycomb.scene.go("teambuilding");
};

//---------------------------------------------------------------------------------------------------
//Lust Battles
//---------------------------------------------------------------------------------------------------
//A fight needs a run to live on, and there is none between runs, so a Lust Battle is fought in a RUN OF ITS
//OWN (`newRun(..., {lustBattle})`): the pre-selected party in their current loadouts, no map, no lifetime
//count. It is thrown away when the fight ends, and the event carries on in teambuilding.

//The party a battle fields, as teambuilding selections. "subject" is the event's character.
honeycomb.lustEvents.battleSelectionArray = function (partyArray, subject) {
	var indexArray = partyArray == null ? honeycomb.tuning.lustEvents.defaultBattlePartyArray : partyArray;
	var result = [];
	for (var scanIndex = 0; scanIndex < indexArray.length; scanIndex++) {
		var characterIndex = indexArray[scanIndex] == "subject" ? subject : indexArray[scanIndex];
		if (characterIndex == null || honeycomb.findDefinition(honeycomb.characterArray, characterIndex) == null) continue;
		var loadout = honeycomb.teambuilding != null ? honeycomb.teambuilding.loadoutFor(characterIndex)
			: { characterIndex: characterIndex, outfitIndex: null, equipmentArray: null };
		result.push({
			characterIndex: characterIndex,
			outfitIndex: loadout.outfitIndex,
			equipmentArray: loadout.equipmentArray == null ? null : loadout.equipmentArray.slice(),
		});
	}
	return result;
};

//The continuation a Lust Battle carries: everything needed to come back to the event.
honeycomb.lustEvents.battleContinuation = function (event, pending) {
	return {
		index: "lustEvent",
		eventIndex: event.index,
		subject: honeycomb.eventOverlay.subject,
		lustEntryIndex: honeycomb.eventOverlay.lustEntryIndex,
		victoryPage: pending.victoryPage,
		defeatPage: pending.defeatPage,
		victoryEvent: pending.victoryEvent == null ? null : pending.victoryEvent,
		defeatEvent: pending.defeatEvent == null ? null : pending.defeatEvent,
	};
};

//The event host's way of starting a fight. Builds the battle's run and hands over to the combat scene.
honeycomb.lustEvents.beginBattle = function (event, choice, pending) {
	var subject = honeycomb.eventOverlay.subject;
	var selectionArray = honeycomb.lustEvents.battleSelectionArray(pending.partyArray, subject);
	if (selectionArray.length === 0) {
		console.error("Honeycomb: a Lust Battle in '" + event.index + "' has nobody to field");
		return false;
	}
	var continuation = honeycomb.lustEvents.battleContinuation(event, pending);
	honeycomb.newRun(selectionArray, null, { lustBattle: { subject: subject, lustEntryIndex: continuation.lustEntryIndex, eventIndex: event.index } });
	honeycomb.overlay.close("event");
	honeycomb.scene.go("combat", {
		encounterIndex: pending.encounterIndex,
		mapNodeId: null,
		continuation: continuation,
		rewardArray: pending.rewardArray == null ? honeycomb.tuning.lustEvents.battleRewardArray : pending.rewardArray,
		victoryConditionArray: pending.victoryConditionArray,
		defeatConditionArray: pending.defeatConditionArray,
	});
	return true;
};

//Where a finished Lust Battle comes back to: the event's own page for that outcome, else its named event,
//else the "Lust Event Cleared!" event. Returns the overlay parameters, so the choice is testable headless.
//`host` names who the returning event belongs to; it defaults to the Lust Event host, and the Event
//Gallery passes its own so a REPLAYED battle comes back into the gallery rather than completing a row.
honeycomb.lustEvents.returnParams = function (continuation, won, host) {
	var page = won ? continuation.victoryPage : continuation.defeatPage;
	var params = { host: host == null ? "lustEvent" : host, subject: continuation.subject,
		lustEntryIndex: continuation.lustEntryIndex, fromCombat: true };
	if (page != null) {
		params.eventIndex = continuation.eventIndex;
		params.pageIndex = page;
		return params;
	}
	var tuning = honeycomb.tuning.lustEvents;
	var named = won ? continuation.victoryEvent : continuation.defeatEvent;
	params.eventIndex = named != null ? named : (won ? tuning.defaultVictoryEvent : tuning.defaultDefeatEvent);
	//Shown as a finished result, so the event's only button is the way back to the roster.
	var event = honeycomb.findDefinition(honeycomb.eventArray, params.eventIndex);
	params.resultText = event == null || event.text == null ? "" : event.text;
	return params;
};

honeycomb.lustEvents.afterBattle = function (continuation, won) {
	honeycomb.state.run = null;
	honeycomb.overlay.closeAll();
	honeycomb.scene.go("teambuilding");
	honeycomb.overlay.open("event", honeycomb.lustEvents.returnParams(continuation, won));
	honeycomb.save.autosave("lustBattleEnd");
};

//---------------------------------------------------------------------------------------------------
//Registrations
//---------------------------------------------------------------------------------------------------
honeycomb.eventHostArray.push({
	index: "lustEvent",
	recordsSeen: false,
	finishLabel: "Return to the roster",
	finish: function () { honeycomb.lustEvents.finishEvent(); },
	beginCombat: function (event, choice, pending) { honeycomb.lustEvents.beginBattle(event, choice, pending); },
});

//The victory and defeat screens live in honeycomb-overlays-combat.js, which loads before this file in the
//page and not at all headless.
if (honeycomb.combatContinuationArray != null) {
	honeycomb.combatContinuationArray.push({
		index: "lustEvent",
		buttonLabel: "Continue",
		lead: function (continuation) {
			var definition = honeycomb.findDefinition(honeycomb.characterArray, continuation.subject);
			return (definition == null ? "They" : definition.name) + " stands victorious.";
		},
		finish: function (continuation) { honeycomb.lustEvents.afterBattle(continuation, true); },
		defeatLead: function (continuation) {
			var definition = honeycomb.findDefinition(honeycomb.characterArray, continuation.subject);
			return (definition == null ? "They" : definition.name) + " could not hold out.";
		},
		finishDefeat: function (continuation) { honeycomb.lustEvents.afterBattle(continuation, false); },
	});
}

//---------------------------------------------------------------------------------------------------
//Profile effects
//---------------------------------------------------------------------------------------------------
//Each acts on the event's character unless it names `character`, and each logs what it did, so an event
//choice's preview can show it (test [52] holds every event to that).

//Weakness grown straight from an event, in exposure points rather than lust. Crossing a rank counts against
//a live run's allowance like any other and leaves its own record.
honeycomb.lust.addExposure = function (characterIndex, tagIndex, amount, context) {
	if (characterIndex == null || tagIndex == null || amount == null || amount <= 0) return 0;
	//FORTITUDE: nothing builds while it is owned.
	if (honeycomb.lust.hasFortitude(characterIndex) || honeycomb.lust.isWeaknessTag(tagIndex) == false) return 0;
	var ledger = honeycomb.lust.exposureLedger(characterIndex, true);
	if (ledger == null) return 0;
	var before = ledger[tagIndex] == null ? 0 : ledger[tagIndex];
	var after = Math.min(honeycomb.lust.topThreshold(), honeycomb.state.run == null ? before + amount
		: honeycomb.lust.clampToRunCeiling(characterIndex, tagIndex, before + amount));
	ledger[tagIndex] = after;
	honeycomb.lust.noteRankChange({ characterIndex: characterIndex, instanceId: null }, tagIndex, before, after, context);
	return after - before;
};

//`tag: "eventTag"` means the weakness the open Lust Event is about -- its queue row's own `tag`.
honeycomb.lustEvents.tagFor = function (entry, context) {
	if (entry.tag != "eventTag") return entry.tag;
	var queueEntry = honeycomb.eventOverlay == null ? null : honeycomb.lustEvents.findEntry(honeycomb.eventOverlay.lustEntryIndex);
	return queueEntry == null ? null : queueEntry.tag;
};

honeycomb.lustEvents.subjectName = function (entry, context) {
	var subject = honeycomb.eventOverlay == null ? entry.character : honeycomb.eventOverlay.subjectFor(entry, context);
	var definition = honeycomb.findDefinition(honeycomb.characterArray, subject);
	return definition == null ? "the character" : definition.name;
};

//A weakness can take one more rank unless it is at the top rank or Fortitude is owned. The per-run
//ceiling does not apply.
honeycomb.lust.canRaiseRank = function (characterIndex, tagIndex) {
	if (characterIndex == null || tagIndex == null) return false;
	if (honeycomb.lust.hasFortitude(characterIndex)) return false;
	return honeycomb.lust.nextThresholdFor(honeycomb.lust.exposureFor(characterIndex, tagIndex)) != null;
};

//Sets the exposure to the next rank's threshold directly, skipping the run ceiling addExposure applies.
//noteRankChange still records the rank-up and plays the cut-in.
honeycomb.lust.raiseRank = function (characterIndex, tagIndex, context) {
	if (honeycomb.lust.canRaiseRank(characterIndex, tagIndex) == false) return false;
	var ledger = honeycomb.lust.exposureLedger(characterIndex, true);
	if (ledger == null) return false;
	var before = ledger[tagIndex] == null ? 0 : ledger[tagIndex];
	ledger[tagIndex] = honeycomb.lust.nextThresholdFor(before);
	honeycomb.lust.noteRankChange({ characterIndex: characterIndex, instanceId: null }, tagIndex, before, ledger[tagIndex], context);
	return true;
};

honeycomb.effectArray.push(
	{
		//`{index: "raiseWeaknessRank", tag, character, ranks}`: the weakness goes up `ranks` whole ranks
		//(default 1), each stopping where honeycomb.lust.canRaiseRank says it must.
		index: "raiseWeaknessRank",
		resolve: function (entry, context) {
			var subject = honeycomb.eventOverlay == null ? entry.character : honeycomb.eventOverlay.subjectFor(entry, context);
			var tagIndex = honeycomb.lustEvents.tagFor(entry, context);
			var ranks = entry.ranks == null ? 1 : honeycomb.resolveValue(entry.ranks, context);
			var raised = 0;
			for (var step = 0; step < ranks; step++) {
				if (honeycomb.lust.raiseRank(subject, tagIndex, context) == false) break;
				raised += 1;
			}
			//The rank reached is logged because a preview is drawn after its dry run has been rolled back.
			if (raised > 0) honeycomb.logEvent(context, { type: "weaknessRanked", characterIndex: subject, tag: tagIndex, ranks: raised,
				rank: honeycomb.lust.rankFor(subject, tagIndex) });
		},
		describe: function (entry, context) {
			var tagIndex = honeycomb.lustEvents.tagFor(entry, context);
			var tag = tagIndex == null ? null : honeycomb.findDefinition(honeycomb.cardTagArray, tagIndex);
			var ranks = entry.ranks == null ? 1 : entry.ranks;
			return honeycomb.lustEvents.subjectName(entry, context) + "'s " + (tag == null ? "weakness" : tag.name + " weakness") +
				" rises " + ranks + (ranks == 1 ? " rank." : " ranks.");
		},
	},
	{
		index: "gainWeakness",
		resolve: function (entry, context) {
			var subject = honeycomb.eventOverlay == null ? entry.character : honeycomb.eventOverlay.subjectFor(entry, context);
			var tagIndex = honeycomb.lustEvents.tagFor(entry, context);
			var amount = honeycomb.resolveValue(entry.amount, context);
			var gained = honeycomb.lust.addExposure(subject, tagIndex, amount, context);
			if (gained > 0) honeycomb.logEvent(context, { type: "weaknessGained", characterIndex: subject, tag: tagIndex, amount: gained });
		},
		describe: function (entry, context) {
			var tagIndex = honeycomb.lustEvents.tagFor(entry, context);
			var tag = tagIndex == null ? null : honeycomb.findDefinition(honeycomb.cardTagArray, tagIndex);
			return honeycomb.lustEvents.subjectName(entry, context) + "'s " + (tag == null ? "weakness" : tag.name + " weakness") +
				" grows by " + entry.amount + ".";
		},
	},
	{
		index: "gainPersonalExperience",
		resolve: function (entry, context) {
			var subject = honeycomb.eventOverlay == null ? entry.character : honeycomb.eventOverlay.subjectFor(entry, context);
			if (subject == null || honeycomb.progression == null) return;
			var amount = Math.round(honeycomb.resolveValue(entry.amount, context) * honeycomb.tuning.progression.experienceMultiplier);
			if (amount <= 0) return;
			honeycomb.progression.addPersonalExperience(subject, amount);
			honeycomb.logEvent(context, { type: "personalExperienceGained", characterIndex: subject, amount: amount });
		},
		describe: function (entry, context) {
			return honeycomb.lustEvents.subjectName(entry, context) + " gains " + entry.amount + " personal EXP.";
		},
	},
	{
		index: "unlock",
		resolve: function (entry, context) {
			var subject = honeycomb.eventOverlay == null ? entry.character : honeycomb.eventOverlay.subjectFor(entry, context);
			if (honeycomb.unlocks == null) return;
			if (honeycomb.unlocks.grant(entry.kind, entry.unlock, subject) == true) {
				honeycomb.logEvent(context, { type: "unlocked", kind: entry.kind, unlock: entry.unlock, characterIndex: subject });
			}
		},
		describe: function (entry, context) {
			var kind = honeycomb.findDefinition(honeycomb.unlockKindArray, entry.kind);
			var definition = kind == null ? null : kind.findDefinition(entry.unlock,
				honeycomb.eventOverlay == null ? entry.character : honeycomb.eventOverlay.subjectFor(entry, context));
			return "Unlocks " + (definition == null || definition.name == null ? entry.unlock : definition.name) + ".";
		},
	}
);

//---------------------------------------------------------------------------------------------------
//The requirement vocabulary
//---------------------------------------------------------------------------------------------------
//What a queue row is allowed to ask about. Ordinary conditions and values, so they work anywhere a
//condition works -- an event choice, an enemy's behaviour, an unlock -- and not only in the queue.
honeycomb.lustEvents.characterOfEntry = function (entry, context) {
	if (entry == null || entry.character == null || entry.character == "subject") {
		if (context != null && context.subjectCharacterIndex != null) return context.subjectCharacterIndex;
		return honeycomb.eventOverlay == null ? null : honeycomb.eventOverlay.subject;
	}
	return entry.character;
};

//`{index: "weaknessRank", character, tag, atLeast}`. The rank a character's weakness has REACHED, which is
//what applies Fortitude -- so a character who can never pass rank 1 never meets a rank 2 requirement.
//`character` defaults to the subject; `tag` may be "eventTag" inside an open Lust Event.
honeycomb.lustEvents.rankOfEntry = function (entry, context) {
	var characterIndex = honeycomb.lustEvents.characterOfEntry(entry, context);
	var tagIndex = entry.tag == "eventTag" ? honeycomb.lustEvents.tagFor(entry, context) : entry.tag;
	if (characterIndex == null || tagIndex == null) return 0;
	return honeycomb.lust.rankFor(characterIndex, tagIndex);
};

honeycomb.lustEvents.describeWeaknessRank = function (entry) {
	var tag = entry.tag == null ? null : honeycomb.findDefinition(honeycomb.cardTagArray, entry.tag);
	var who = entry.character == null || entry.character == "subject" ? "their" : entry.character + "'s";
	return who + " " + (tag == null ? String(entry.tag) : tag.name) + " weakness rank";
};

honeycomb.conditionArray.push(
	{
		index: "weaknessRank",
		test: function (condition, context) {
			return honeycomb.lustEvents.rankOfEntry(condition, context) >= (condition.atLeast == null ? 1 : condition.atLeast);
		},
		describe: function (condition) {
			return honeycomb.lustEvents.describeWeaknessRank(condition) + " is at least " + (condition.atLeast == null ? 1 : condition.atLeast);
		},
	},
	{
		//`{index: "weaknessCanRank", character, tag}`: a rank is available to raise. See
		//honeycomb.lust.canRaiseRank for everything that can say no.
		index: "weaknessCanRank",
		test: function (condition, context) {
			var tagIndex = condition.tag == "eventTag" ? honeycomb.lustEvents.tagFor(condition, context) : condition.tag;
			return honeycomb.lust.canRaiseRank(honeycomb.lustEvents.characterOfEntry(condition, context), tagIndex);
		},
		describe: function (condition) {
			return honeycomb.lustEvents.describeWeaknessRank(condition) + " can still rise";
		},
	},
	{
		//`{index: "lustEventDone", entry | entryArray, character}`. The multi-part verb: a row that names
		//another row's index is owed only once that one has been played through. `character` decides WHOSE
		//completion is asked about, and defaults to the subject -- which for a fanned-out row means the
		//same character, so "part 2 after part 1" needs nothing else written.
		index: "lustEventDone",
		test: function (condition, context) {
			var characterIndex = honeycomb.lustEvents.characterOfEntry(condition, context);
			var indexArray = condition.entryArray == null ? [condition.entry] : condition.entryArray;
			for (var scanIndex = 0; scanIndex < indexArray.length; scanIndex++) {
				var entry = honeycomb.lustEvents.findEntry(indexArray[scanIndex]);
				if (entry == null || honeycomb.lustEvents.isDone(entry, characterIndex) == false) return false;
			}
			return indexArray.length > 0;
		},
		describe: function (condition) {
			var indexArray = condition.entryArray == null ? [condition.entry] : condition.entryArray;
			return indexArray.join(" and ") + " " + (indexArray.length > 1 ? "have" : "has") + " been played";
		},
	}
);

//Reads the count off the completed LIST rather than a tally.
//`{index: "lustEventCount", character, tag, atLeast}` as a condition, or without `atLeast` as a value.
//`character` may be "subject" for the event's own character; either may be left out to widen the category.
honeycomb.lustEvents.countFor = function (characterIndex, tagIndex) {
	var completedArray = honeycomb.lustEvents.completedArray();
	var count = 0;
	for (var scanIndex = 0; scanIndex < completedArray.length; scanIndex++) {
		var done = completedArray[scanIndex];
		if (characterIndex != null && done.characterIndex != characterIndex) continue;
		if (tagIndex != null && done.entry.tag != tagIndex) continue;
		count += 1;
	}
	return count;
};

honeycomb.lustEvents.countOfEntry = function (entry, context) {
	var characterIndex = entry.character == null ? null : honeycomb.lustEvents.characterOfEntry(entry, context);
	return honeycomb.lustEvents.countFor(characterIndex, entry.tag == null ? null : entry.tag);
};

honeycomb.lustEvents.describeCategory = function (entry) {
	var pieceArray = [];
	if (entry.character != null) pieceArray.push(entry.character == "subject" ? "their" : entry.character + "'s");
	if (entry.tag != null) pieceArray.push(entry.tag);
	return (pieceArray.length === 0 ? "" : pieceArray.join(" ") + " ") + "Lust Events completed";
};

honeycomb.conditionArray.push({
	index: "lustEventCount",
	test: function (condition, context) {
		return honeycomb.lustEvents.countOfEntry(condition, context) >= (condition.atLeast == null ? 1 : condition.atLeast);
	},
	describe: function (condition) {
		return "at least " + (condition.atLeast == null ? 1 : condition.atLeast) + " " + honeycomb.lustEvents.describeCategory(condition);
	},
});

honeycomb.valueArray.push(
	{
		index: "lustEventCount",
		resolve: function (value, context) { return honeycomb.lustEvents.countOfEntry(value, context); },
		describe: function (value) { return "the number of " + honeycomb.lustEvents.describeCategory(value); },
	},
	{
		index: "weaknessRank",
		resolve: function (value, context) { return honeycomb.lustEvents.rankOfEntry(value, context); },
		describe: function (value) { return honeycomb.lustEvents.describeWeaknessRank(value); },
	}
);

//A locked tab: a teambuilding tab marked `requiresUnlock` is hidden until this kind has unlocked it for
//the inspected character.
if (honeycomb.unlockKindArray != null) {
	honeycomb.unlockKindArray.push({
		index: "tab",
		perCharacter: true,
		ledgerName: "unlockedTabArray",
		findDefinition: function (index) {
			return honeycomb.teambuilding == null ? null : honeycomb.findDefinition(honeycomb.teambuilding.tabArray, index);
		},
		allArray: function () { return honeycomb.teambuilding == null ? [] : honeycomb.teambuilding.tabArray; },
	});
}

//---------------------------------------------------------------------------------------------------
//Teambuilding: who may stand in the party
//---------------------------------------------------------------------------------------------------
//Returns the characters taken out.
honeycomb.lustEvents.removeBlockedFromParty = function (selectionArray) {
	var removedArray = [];
	for (var scanIndex = selectionArray.length - 1; scanIndex >= 0; scanIndex--) {
		var selection = selectionArray[scanIndex];
		if (honeycomb.lustEvents.blocksParty(selection.characterIndex) == false) continue;
		if (honeycomb.equipment != null && honeycomb.equipment.remember != null) honeycomb.equipment.remember(selection);
		selectionArray.splice(scanIndex, 1);
		removedArray.unshift(selection.characterIndex);
	}
	return removedArray;
};
