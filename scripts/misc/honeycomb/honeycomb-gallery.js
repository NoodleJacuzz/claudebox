//===================================================================================================
//HONEYCOMB CATACOMBS -- the Event Gallery
//===================================================================================================
//ONE PAGE PER CHARACTER, and the page lists her scenes as tiles rather than as a list of names. There
//is no character-selection screen in front of it -- the window opens straight onto a character and the
//rail down the side changes who. That rail is the teambuilding roster's own widget, counting
//scenes where the roster counts health.
//
//It opens from the heart on the teambuilding top bar and from the title screen's Gallery button; both
//open this same overlay, and it sits over whatever screen opened it rather than being a screen of its
//own.
//
//Membership is opt-in: a scene is in the gallery because a table row SAYS it is, by carrying a `gallery`
//block, and a
//multi-part scene carries that block on its START ROW alone. The later parts are named by the start
//row's `partArray` and are played straight after it on a replay, so a chain is one tile that plays the
//whole thing rather than one tile per part.
//
//WHERE THE ENTRIES COME FROM IS A TABLE. honeycomb.gallerySourceArray holds one row per kind of scene
//the gallery can show, and a row knows how to collect its own entries, whether one is unlocked, and how
//to play it. Lust Events are the only source today; the party events and progress events of
//`lust_events/IDEAS.md` §§6-7 are map events and become a second and third row here, not engine code.
//
//A REPLAY PAYS NOTHING BUT STILL DOES THE SCENE. The gallery plays an event through the ordinary event
//overlay under a host of its own (`gallery`), declaring `appliesEffects: false` and
//`savesPosition: false`: no cost is spent, no reward resolves, nothing is recorded as discovered, no
//queue row is completed, and the run's own saved event position is left alone. What DOES resolve is any
//effect marked `sceneStructure` -- `startCombat` is the whole list -- because a replay that skipped the
//fight would not be the scene. Every choice stays clickable, so a replay is read the way a scene viewer
//is read rather than re-walked one branch at a time.
window.honeycomb = window.honeycomb || {};

honeycomb.gallery = {
	//Whose page is open. Null until somebody is pressed, which reads as "the first character on the
	//roster" -- there is no wall to fall back to, so the window always has a page showing.
	characterIndex: null,
	//The replay in progress: {key, partIndex}. Null while nothing is being replayed.
	replayStep: null,
	//The scene the gallery was opened over, so a replayed battle comes back to it rather than to a
	//screen the player was never on.
	returnScene: null,
	//The player's own run, held aside while a replayed Lust Battle fights in a run of its own. `stashHeld`
	//is what says a stash was TAKEN, because the thing stashed is very often null -- the gallery is
	//usually opened between runs -- and "restore null" is exactly as important as restoring a run: it is
	//what throws the battle's own run away afterwards.
	stashedRun: null,
	stashHeld: false,
};

//---------------------------------------------------------------------------------------------------
//THE OUTCOME TABLE
//---------------------------------------------------------------------------------------------------
//A scene with a Lust Battle in it is more than one tile: the scene itself, and a tile for each
//outcome the battle names. FINISHING THE SCENE ONCE UNLOCKS BOTH, which is what stops a win from
//costing the player the loss scene forever. Replaying the battle and losing unlocks the loss tile too,
//for a profile that got here before the tiles existed.
//
//A row names the fields a `startCombat` request carries for that outcome. A third outcome is a row.
honeycomb.galleryOutcomeArray = [
	{ index: "victory", name: "Victory", won: true, pageField: "victoryPage", eventField: "victoryEvent", order: 1 },
	{ index: "defeat", name: "Defeat", won: false, pageField: "defeatPage", eventField: "defeatEvent", order: 2 },
];

//The row a finished fight landed on, asked by what happened rather than by position in the table.
honeycomb.gallery.outcomeFor = function (won) {
	for (var scanIndex = 0; scanIndex < honeycomb.galleryOutcomeArray.length; scanIndex++) {
		if (honeycomb.galleryOutcomeArray[scanIndex].won === (won == true)) return honeycomb.galleryOutcomeArray[scanIndex];
	}
	return null;
};

//What a battle plays for one outcome: the page it names, else the separate event, else nothing.
honeycomb.gallery.outcomeTarget = function (request, outcome) {
	if (request == null || outcome == null) return null;
	var page = request[outcome.pageField];
	return page != null ? page : (request[outcome.eventField] == null ? null : request[outcome.eventField]);
};

//AN ENDING IS KEYED BY WHAT IT PLAYS, not by where its fight sits in the scene. A scene may hold more
//than one battle -- two battle choices, or a fight in each of two parts -- and keying on the outcome
//alone would hand two different endings the same key, which findEntry and the unlock ledger both read
//as one tile. It also lets a finished fight work out its own tile's key from its continuation, which
//is how losing a replay opens the right ending.
honeycomb.gallery.outcomeKey = function (parentKey, outcome, target) {
	if (parentKey == null || outcome == null || target == null) return null;
	return parentKey + "#" + outcome.index + ":" + target;
};

//---------------------------------------------------------------------------------------------------
//THE SOURCE TABLE
//---------------------------------------------------------------------------------------------------
//One row per kind of scene the gallery lists. A new kind is a row here.
//
//  index        the source's stable name, and the first half of every key it makes
//  name         what the source is called, for a heading that needs to name it
//  available()  whether this source has anything to say on this build at all
//  collect()    every entry it offers, as the shape below. Locked entries are INCLUDED -- the page
//               draws them as ??? tiles, so a page reads as something that grows.
//  open(entry)  plays the entry. Opens the event overlay under the `gallery` host.
//
//AN ENTRY:
//  key             unique across every source. "lustEvent:nettleVenom1", or with the character on a row
//                  that fans out: "lustEvent:anyUndone/nettle".
//  sourceIndex     the source that made it.
//  characterArray  EVERY character whose page shows this tile. A two-hander names both, which is what
//                  makes every scene relevant to each character appear on their gallery page, true for a
//                  scene that belongs to a pair.
//  subject         the character the scene is about, and the one it plays as.
//  name            the tile's title, once it is unlocked.
//  groupIndex      which block of the page it sits in, and groupName / groupOrder how that block reads.
//  sortOrder       its place inside that block.
//  lockedCaption   what a LOCKED tile is allowed to say. The mechanical half of the requirement --
//                  "Venom &middot; Rank 3" -- and never the scene's name, art or text.
//  imagePath       the tile's art, or null to fall back to the character's portrait.
//  unlocked        whether this profile has played it.
honeycomb.gallerySourceArray = [
	{
		index: "lustEvent",
		name: "Lust Events",
		available: function () {
			return honeycomb.lustEvents != null && honeycomb.lustEventQueueArray != null;
		},
		collect: function () {
			return honeycomb.gallery.collectLustEvents();
		},
		open: function (entry) {
			return honeycomb.gallery.openLustEvent(entry);
		},
	},
];

honeycomb.gallery.findSource = function (sourceIndex) {
	return honeycomb.findDefinition(honeycomb.gallerySourceArray, sourceIndex);
};

//---------------------------------------------------------------------------------------------------
//The `gallery` block on a table row
//---------------------------------------------------------------------------------------------------
//`gallery: true` is the shorthand for "in the gallery, every default", and a block spells out what the
//defaults get wrong:
//
//  name            the tile's title. Default: the event's own name, with {name} / {tag} / {rank} filled.
//  characterArray  EXTRA characters whose pages show it. The row's own are always included.
//  sortOrder       its place in its block. Default: the row's position in the queue, so the table's
//                  order is the page's order and a scene written later lands at the end.
//  imagePath       the tile's art. Default: the event's imagePath, then its backgroundPath.
//  partArray       the further rows this scene continues into, in order. A replay plays them one after
//                  another; they are not tiles of their own.
//
//Returns null for a row that is not in the gallery, so "is this row a gallery entry" is one question.
honeycomb.gallery.readBlock = function (row) {
	if (row == null || row.gallery == null || row.gallery === false) return null;
	if (row.gallery === true) return {};
	return typeof row.gallery === "object" ? row.gallery : {};
};

//---------------------------------------------------------------------------------------------------
//Lust Events as gallery entries
//---------------------------------------------------------------------------------------------------
//One entry per (queue row carrying a `gallery` block) x (character the row is offered to). A row that
//fans out across the roster is therefore one tile on each of their pages, completed and unlocked per
//character, exactly as the queue itself treats it.
honeycomb.gallery.collectLustEvents = function () {
	var result = [];
	if (honeycomb.lustEvents == null || honeycomb.lustEventQueueArray == null) return result;
	var rowArray = honeycomb.lustEventQueueArray;
	for (var rowIndex = 0; rowIndex < rowArray.length; rowIndex++) {
		var block = honeycomb.gallery.readBlock(rowArray[rowIndex]);
		if (block == null) continue;
		var queueEntry = honeycomb.lustEvents.readEntry(rowArray[rowIndex], rowIndex);
		//A row the queue engine cannot read is already reported by the warning report; a broken row is
		//not turned into a tile that cannot be played.
		if (queueEntry.problem != null) continue;
		var characterArray = honeycomb.lustEvents.entryCharacterArray(queueEntry);
		for (var scanIndex = 0; scanIndex < characterArray.length; scanIndex++) {
			var entry = honeycomb.gallery.lustEventEntry(queueEntry, block, characterArray[scanIndex]);
			result.push(entry);
			//AND A TILE PER BATTLE OUTCOME the scene names, straight after the scene itself.
			var outcomeEntryArray = honeycomb.gallery.outcomeEntryArray(entry, queueEntry, block);
			for (var outcomeIndex = 0; outcomeIndex < outcomeEntryArray.length; outcomeIndex++) {
				result.push(outcomeEntryArray[outcomeIndex]);
			}
		}
	}
	return result;
};

//Every event a scene plays through: its start point, then the rows its `partArray` names.
honeycomb.gallery.sceneEventIndexArray = function (queueEntry, block) {
	var result = queueEntry.eventIndex == null ? [] : [queueEntry.eventIndex];
	var partArray = block == null || block.partArray == null ? [] : block.partArray;
	for (var scanIndex = 0; scanIndex < partArray.length; scanIndex++) {
		var part = honeycomb.lustEvents.findEntry(partArray[scanIndex]);
		if (part == null || part.problem != null || part.eventIndex == null) continue;
		if (result.indexOf(part.eventIndex) < 0) result.push(part.eventIndex);
	}
	return result;
};

//Every `startCombat` request written anywhere in one event -- its own choices and those of its pages.
//A Lust Battle's outcomes are read off the request rather than declared again, so a scene that gains a
//fight gains its outcome tiles with it.
honeycomb.gallery.battleRequestArray = function (eventIndex) {
	var event = honeycomb.findDefinition(honeycomb.eventArray, eventIndex);
	if (event == null) return [];
	var result = [];
	var pageArray = [event].concat(event.pageArray == null ? [] : event.pageArray);
	for (var pageIndex = 0; pageIndex < pageArray.length; pageIndex++) {
		var choiceArray = pageArray[pageIndex].choiceArray == null ? [] : pageArray[pageIndex].choiceArray;
		for (var choiceIndex = 0; choiceIndex < choiceArray.length; choiceIndex++) {
			var effectArray = choiceArray[choiceIndex].effectArray == null ? [] : choiceArray[choiceIndex].effectArray;
			for (var effectIndex = 0; effectIndex < effectArray.length; effectIndex++) {
				if (effectArray[effectIndex].index !== "startCombat") continue;
				result.push({ eventIndex: event.index, request: effectArray[effectIndex] });
			}
		}
	}
	return result;
};

//The outcome tiles for one scene. An outcome only becomes a tile when the battle NAMES a page or an
//event for it: the fallback is the "Lust Event Cleared!" stub, and a tile for that is noise.
honeycomb.gallery.outcomeEntryArray = function (parent, queueEntry, block) {
	var result = [];
	var eventIndexArray = honeycomb.gallery.sceneEventIndexArray(queueEntry, block);
	for (var scanIndex = 0; scanIndex < eventIndexArray.length; scanIndex++) {
		var requestArray = honeycomb.gallery.battleRequestArray(eventIndexArray[scanIndex]);
		for (var requestIndex = 0; requestIndex < requestArray.length; requestIndex++) {
			var found = requestArray[requestIndex];
			for (var outcomeIndex = 0; outcomeIndex < honeycomb.galleryOutcomeArray.length; outcomeIndex++) {
				var tile = honeycomb.gallery.outcomeEntry(parent, found, honeycomb.galleryOutcomeArray[outcomeIndex]);
				//Two fights in one scene may share an ending; it is one tile either way.
				if (tile != null && honeycomb.gallery.findIn(result, tile.key) == null) result.push(tile);
			}
		}
	}
	return result;
};

honeycomb.gallery.findIn = function (entryArray, key) {
	for (var scanIndex = 0; scanIndex < entryArray.length; scanIndex++) {
		if (entryArray[scanIndex].key === key) return entryArray[scanIndex];
	}
	return null;
};

honeycomb.gallery.outcomeEntry = function (parent, found, outcome) {
	var pageIndex = found.request[outcome.pageField];
	var namedEvent = found.request[outcome.eventField];
	var target = honeycomb.gallery.outcomeTarget(found.request, outcome);
	//An outcome the battle names nothing for falls through to the "Lust Event Cleared!" stub, and a tile
	//for that is noise.
	if (target == null) return null;

	//The tile's title: the page's or the event's own name when it has one, and the outcome's plain word
	//when it does not. A page with no name of its own is why the fallback exists.
	var name = outcome.name;
	if (pageIndex != null) {
		var event = honeycomb.findDefinition(honeycomb.eventArray, found.eventIndex);
		var page = event == null || event.pageArray == null ? null : honeycomb.findDefinition(event.pageArray, pageIndex);
		if (page != null && page.name != null) name = page.name;
	} else {
		var namedDefinition = honeycomb.findDefinition(honeycomb.eventArray, namedEvent);
		if (namedDefinition != null && namedDefinition.name != null) name = namedDefinition.name;
	}

	//THE ENDING'S OWN PICTURE. This was null, so a scene with a battle in it showed art on the scene
	//tile and nothing on either ending -- the first tile had a picture and the rest were blank. An
	//ending plays a page, and that page has its own art now that scenes are illustrated per beat, so
	//the tile shows the first thing the player will see when they open it. Falls back to the event's
	//own art, then to the scene tile's, so an ending with no picture of its own is never blank.
	var outcomeEvent = honeycomb.findDefinition(honeycomb.eventArray,
		pageIndex != null ? found.eventIndex : namedEvent);
	var outcomePage = (pageIndex == null || outcomeEvent == null || outcomeEvent.pageArray == null)
		? null : honeycomb.findDefinition(outcomeEvent.pageArray, pageIndex);
	var outcomeImagePath = null;
	if (outcomePage != null && outcomePage.imagePath != null) { outcomeImagePath = outcomePage.imagePath; }
	else if (outcomePage != null && outcomePage.backgroundPath != null) { outcomeImagePath = outcomePage.backgroundPath; }
	else if (outcomeEvent != null && outcomeEvent.imagePath != null) { outcomeImagePath = outcomeEvent.imagePath; }
	else if (outcomeEvent != null && outcomeEvent.backgroundPath != null) { outcomeImagePath = outcomeEvent.backgroundPath; }
	else { outcomeImagePath = parent.imagePath; }

	var key = honeycomb.gallery.outcomeKey(parent.key, outcome, target);
	return {
		key: key,
		sourceIndex: parent.sourceIndex,
		characterArray: parent.characterArray,
		subject: parent.subject,
		name: honeycomb.gallery.fillWords(name, parent.subject, parent.entryIndex),
		groupIndex: parent.groupIndex,
		groupName: parent.groupName,
		groupOrder: parent.groupOrder,
		sortOrder: parent.sortOrder,
		//Drawn under the scene it belongs to, in outcome order, rather than as a tile of its own rank.
		outcomeOrder: outcome.order,
		outcomeIndex: outcome.index,
		lockedCaption: parent.lockedCaption,
		imagePath: outcomeImagePath,
		//FINISHING THE SCENE ONCE UNLOCKS BOTH ENDINGS. Losing a replayed battle unlocks its own ending
		//as well, which is the only thing a replay is allowed to change.
		unlocked: parent.unlocked == true || honeycomb.gallery.isRecorded(key),
		entryIndex: parent.entryIndex,
		partArray: [],
		//What playing this tile opens: a page of the scene's own event, or a separate event.
		outcomePlay: pageIndex != null
			? { eventIndex: found.eventIndex, pageIndex: pageIndex }
			: { eventIndex: namedEvent },
	};
};

//---------------------------------------------------------------------------------------------------
//What a replay is allowed to change
//---------------------------------------------------------------------------------------------------
//Only gallery tiles change. A replay grants no experience, no weakness and no unlock, and never
//re-completes a queue row -- but an ending reached by replaying the battle is an ending the player has
//now seen, so its tile opens. That ledger is this list and nothing else.
honeycomb.gallery.recordedArray = function (create) {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile == null) return create == true ? null : [];
	if (profile.galleryUnlockedArray == null) {
		if (create != true) return [];
		profile.galleryUnlockedArray = [];
	}
	return profile.galleryUnlockedArray;
};

honeycomb.gallery.isRecorded = function (key) {
	return key != null && honeycomb.gallery.recordedArray(false).indexOf(key) >= 0;
};

honeycomb.gallery.record = function (key) {
	var recordedArray = honeycomb.gallery.recordedArray(true);
	if (key == null || recordedArray == null || recordedArray.indexOf(key) >= 0) return false;
	recordedArray.push(key);
	return true;
};

//One tile, for one queue row and one character.
honeycomb.gallery.lustEventEntry = function (queueEntry, block, characterIndex) {
	var event = honeycomb.findDefinition(honeycomb.eventArray, queueEntry.eventIndex);
	var tag = queueEntry.tag == null ? null : honeycomb.findDefinition(honeycomb.cardTagArray, queueEntry.tag);

	//WHOSE PAGES SHOW IT: the character it is offered to, plus anyone the block names. A pair scene is
	//written on one of them and names the other.
	var pageArray = [characterIndex];
	var extraArray = block.characterArray == null ? [] : block.characterArray;
	for (var extraIndex = 0; extraIndex < extraArray.length; extraIndex++) {
		if (honeycomb.findDefinition(honeycomb.characterArray, extraArray[extraIndex]) == null) continue;
		if (pageArray.indexOf(extraArray[extraIndex]) < 0) pageArray.push(extraArray[extraIndex]);
	}

	var name = block.name != null ? block.name
		: honeycomb.gallery.fillWords(event == null ? queueEntry.index : event.name, characterIndex, queueEntry.index);

	return {
		key: "lustEvent:" + honeycomb.lustEvents.doneKey(queueEntry, characterIndex),
		sourceIndex: "lustEvent",
		characterArray: pageArray,
		subject: characterIndex,
		name: name,
		//The page is blocked out by weakness, which is how the scene grids in lust_events/IDEAS.md are
		//written; a row with no tag is a story beat rather than a weakness beat and gets its own block.
		groupIndex: queueEntry.tag == null ? "story" : queueEntry.tag,
		groupName: tag != null ? tag.name : "Story",
		groupOrder: queueEntry.tag == null ? 9999 : honeycomb.gallery.tagOrder(queueEntry.tag),
		sortOrder: block.sortOrder == null ? queueEntry.position : block.sortOrder,
		//A scene sits above its own battle outcomes; see honeycomb.galleryOutcomeArray.
		outcomeOrder: 0,
		outcomeIndex: null,
		outcomePlay: null,
		lockedCaption: honeycomb.gallery.lustLockedCaption(queueEntry),
		imagePath: block.imagePath != null ? block.imagePath
			: (event == null ? null : (event.imagePath != null ? event.imagePath : event.backgroundPath)),
		unlocked: honeycomb.lustEvents.isDone(queueEntry, characterIndex),
		//Kept so a replay knows what to play, and so the locked caption can be re-read without
		//walking the queue again.
		entryIndex: queueEntry.index,
		partArray: block.partArray == null ? [] : block.partArray,
	};
};

//Where a lust tag sits in the content table, so Venom and Charm come out in the same order on every
//page rather than in whatever order the queue happens to mention them.
honeycomb.gallery.tagOrder = function (tagIndex) {
	for (var scanIndex = 0; scanIndex < honeycomb.cardTagArray.length; scanIndex++) {
		if (honeycomb.cardTagArray[scanIndex].index === tagIndex) return scanIndex;
	}
	return 9998;
};

//A locked tile says only the part of its requirement that is mechanical and always true -- the weakness
//the row is about and the rank it wants -- since a requirement can be arbitrarily complex and there is
//no way to render that as readable text. It says nothing about a row whose requirement is anything else,
//and it never says the scene's name.
honeycomb.gallery.lustLockedCaption = function (queueEntry) {
	if (queueEntry == null || queueEntry.tag == null) return null;
	var tag = honeycomb.findDefinition(honeycomb.cardTagArray, queueEntry.tag);
	var tagName = tag == null ? queueEntry.tag : tag.name;
	if (queueEntry.rank == null) return tagName;
	var rank = honeycomb.lust.rankDefinitionByRank(queueEntry.rank);
	return tagName + " · " + (rank == null ? "Rank " + queueEntry.rank : rank.name);
};

//An event's words with {name}, {tag} and {rank} filled for a character and a queue row, outside the
//event overlay. The overlay's own honeycomb.eventOverlay.say is this with the open event's subject.
honeycomb.gallery.fillWords = function (text, characterIndex, entryIndex) {
	if (honeycomb.eventWords == null) return text == null ? "" : String(text);
	return honeycomb.eventWords(text, characterIndex, entryIndex);
};

//---------------------------------------------------------------------------------------------------
//Reading the gallery
//---------------------------------------------------------------------------------------------------
//Every entry from every available source, in source order.
honeycomb.gallery.entryArray = function () {
	var result = [];
	for (var sourceIndex = 0; sourceIndex < honeycomb.gallerySourceArray.length; sourceIndex++) {
		var source = honeycomb.gallerySourceArray[sourceIndex];
		if (typeof source.available === "function" && source.available() != true) continue;
		var collected = source.collect();
		for (var scanIndex = 0; scanIndex < collected.length; scanIndex++) result.push(collected[scanIndex]);
	}
	return result;
};

honeycomb.gallery.findEntry = function (key) {
	var entryArray = honeycomb.gallery.entryArray();
	for (var scanIndex = 0; scanIndex < entryArray.length; scanIndex++) {
		if (entryArray[scanIndex].key === key) return entryArray[scanIndex];
	}
	return null;
};

//ONE CHARACTER'S PAGE: her entries, grouped and sorted the way the page draws them. A group is
//{index, name, entryArray}; the groups come out in content-table order and the tiles inside one come
//out in the order their rows were written.
honeycomb.gallery.pageFor = function (characterIndex) {
	var groupArray = [];
	if (characterIndex == null) return groupArray;
	var entryArray = honeycomb.gallery.entryArray();
	for (var scanIndex = 0; scanIndex < entryArray.length; scanIndex++) {
		var entry = entryArray[scanIndex];
		if (entry.characterArray.indexOf(characterIndex) < 0) continue;
		var group = null;
		for (var groupIndex = 0; groupIndex < groupArray.length; groupIndex++) {
			if (groupArray[groupIndex].index === entry.groupIndex) group = groupArray[groupIndex];
		}
		if (group == null) {
			group = { index: entry.groupIndex, name: entry.groupName, order: entry.groupOrder, entryArray: [] };
			groupArray.push(group);
		}
		group.entryArray.push(entry);
	}
	groupArray.sort(function (left, right) { return left.order - right.order; });
	for (var sortIndex = 0; sortIndex < groupArray.length; sortIndex++) {
		//A scene, then its own battle outcomes, then the next scene.
		groupArray[sortIndex].entryArray.sort(function (left, right) {
			return left.sortOrder !== right.sortOrder
				? left.sortOrder - right.sortOrder
				: left.outcomeOrder - right.outcomeOrder;
		});
	}
	return groupArray;
};

//How much of one character's page has been seen, as {found, total}. This is what a page's counter reads
//and what a coverage audit asks.
honeycomb.gallery.countFor = function (characterIndex) {
	var found = 0;
	var total = 0;
	var entryArray = honeycomb.gallery.entryArray();
	for (var scanIndex = 0; scanIndex < entryArray.length; scanIndex++) {
		if (entryArray[scanIndex].characterArray.indexOf(characterIndex) < 0) continue;
		total += 1;
		if (entryArray[scanIndex].unlocked == true) found += 1;
	}
	return { found: found, total: total };
};

//THE PAGES THE GALLERY OFFERS: one per shipped character, in content-table order, the unlocked ones
//named and the rest held as ??? slots. honeycomb.shippedCharacterArray is the single Anastasia gate --
//a character still in development is not a page, and not one of the anonymous slots either.
honeycomb.gallery.pageArray = function () {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	var unlockedArray = profile == null || profile.unlockedCharacterArray == null ? [] : profile.unlockedCharacterArray;
	var rosterArray = honeycomb.shippedCharacterArray();
	var result = [];
	for (var scanIndex = 0; scanIndex < rosterArray.length; scanIndex++) {
		var character = rosterArray[scanIndex];
		result.push({
			characterIndex: character.index,
			name: character.name,
			known: unlockedArray.indexOf(character.index) >= 0,
			count: honeycomb.gallery.countFor(character.index),
		});
	}
	return result;
};

//---------------------------------------------------------------------------------------------------
//Replaying a scene
//---------------------------------------------------------------------------------------------------
//A replay is the ordinary event overlay under the `gallery` host. Nothing it does reaches the profile:
//see the host below.
honeycomb.gallery.openLustEvent = function (entry) {
	if (entry == null) return null;
	var queueEntry = honeycomb.lustEvents.findEntry(entry.entryIndex);
	if (queueEntry == null) return null;
	//AN OUTCOME TILE opens the ending itself -- a page of the scene's event, or the separate event the
	//battle named -- rather than replaying the scene that leads to it.
	if (entry.outcomePlay != null) {
		return {
			eventIndex: entry.outcomePlay.eventIndex,
			pageIndex: entry.outcomePlay.pageIndex == null ? null : entry.outcomePlay.pageIndex,
			host: "gallery",
			subject: entry.subject,
			lustEntryIndex: queueEntry.index,
		};
	}
	return {
		eventIndex: queueEntry.eventIndex,
		host: "gallery",
		subject: entry.subject,
		lustEntryIndex: queueEntry.index,
	};
};

//The overlay parameters for one step of a replay: step 0 is the entry's own event, and each further
//step is the next row of its partArray. Null once the chain has run out.
honeycomb.gallery.replayParams = function (key, partIndex) {
	var entry = honeycomb.gallery.findEntry(key);
	if (entry == null) return null;
	var source = honeycomb.gallery.findSource(entry.sourceIndex);
	if (source == null) return null;
	if (partIndex == null || partIndex <= 0) return source.open(entry);
	var partArray = entry.partArray == null ? [] : entry.partArray;
	if (partIndex > partArray.length) return null;
	//A part is named by its own row index, and is played as the same character the start point was.
	var part = honeycomb.lustEvents == null ? null : honeycomb.lustEvents.findEntry(partArray[partIndex - 1]);
	if (part == null || part.problem != null) return null;
	return { eventIndex: part.eventIndex, host: "gallery", subject: entry.subject, lustEntryIndex: part.index };
};

//Only an unlocked entry may be replayed: a locked tile is a slot, not a door.
honeycomb.gallery.play = function (key) {
	var entry = honeycomb.gallery.findEntry(key);
	if (entry == null || entry.unlocked != true) return false;
	var params = honeycomb.gallery.replayParams(key, 0);
	if (params == null) return false;
	if (honeycomb.tooltip != null) honeycomb.tooltip.hide();
	honeycomb.gallery.replayStep = { key: key, partIndex: 0 };
	honeycomb.platform.sound("lustEventBegin");
	honeycomb.overlay.open("event", params);
	return true;
};

//Leaving a replayed scene: on to the next part if the chain has one, otherwise back to the page it was
//started from. The gallery overlay was never closed, so it is still underneath.
honeycomb.gallery.finishEvent = function () {
	var step = honeycomb.gallery.replayStep;
	honeycomb.overlay.close("event");
	var nextParams = step == null ? null : honeycomb.gallery.replayParams(step.key, step.partIndex + 1);
	if (nextParams != null) {
		honeycomb.gallery.replayStep = { key: step.key, partIndex: step.partIndex + 1 };
		honeycomb.overlay.open("event", nextParams);
		return;
	}
	honeycomb.gallery.replayStep = null;
	honeycomb.gallery.repaint();
};

//---------------------------------------------------------------------------------------------------
//Replaying a Lust Battle
//---------------------------------------------------------------------------------------------------
//A Lust Battle is fought in a RUN OF ITS OWN, and a replay may be started from the title screen, where
//the player may have a run paused. So the player's run is held aside for the length of the fight and
//SAVING IS HELD WITH IT: nothing reaches storage until the real run is back, which makes a browser
//closed mid-replay lose the replay rather than the run. See honeycomb.save.autosave.
honeycomb.gallery.beginBattle = function (event, choice, pending) {
	var subject = honeycomb.gallery.battleSubject();
	var selectionArray = honeycomb.lustEvents.battleSelectionArray(pending.partyArray, subject);
	if (selectionArray.length === 0) {
		//Nobody to field means a dead button: the choice resolves, no fight starts, and the player is left
		//on the page with nothing said. Better to refuse the whole replay than to sit there.
		console.error("Honeycomb: a replayed fight in '" + event.index + "' has nobody to field");
		return false;
	}
	var step = honeycomb.gallery.replayStep;
	var continuation = {
		index: "galleryBattle",
		eventIndex: event.index,
		subject: subject,
		lustEntryIndex: honeycomb.eventOverlay.lustEntryIndex,
		replayKey: step == null ? null : step.key,
		partIndex: step == null ? 0 : step.partIndex,
		victoryPage: pending.victoryPage,
		defeatPage: pending.defeatPage,
		victoryEvent: pending.victoryEvent == null ? null : pending.victoryEvent,
		defeatEvent: pending.defeatEvent == null ? null : pending.defeatEvent,
	};

	honeycomb.gallery.stashedRun = honeycomb.state.run;
	honeycomb.gallery.stashHeld = true;
	honeycomb.save.suspended = true;
	honeycomb.newRun(selectionArray, null, { lustBattle: { subject: subject, lustEntryIndex: continuation.lustEntryIndex, eventIndex: event.index } });
	honeycomb.overlay.close("event");
	honeycomb.overlay.close("gallery");
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

//WHO FIGHTS A REPLAYED BATTLE. A Lust Event names its character and that is the answer. A MAP event does
//not — it belongs to the party, not to one of them — so a fight inside one would have nobody to field and
//the choice would be a dead button. The open gallery page answers it instead: every tile is on somebody's
//page, so there is always a character to send. This is what lets the party events and progress events of
//`lust_events/IDEAS.md` §§6-7 carry fights when they are written.
honeycomb.gallery.battleSubject = function () {
	if (honeycomb.eventOverlay.subject != null) return honeycomb.eventOverlay.subject;
	var opened = honeycomb.gallery.openedPage(honeycomb.gallery.pageArray());
	return opened == null ? null : opened.characterIndex;
};

//The run comes back before anything else does, and saving with it. Restoring a stash of NULL is the
//common case and the important one: the gallery is usually opened between runs, and putting the null
//back is what throws the battle's own run away. Without it the player is handed a phantom run and the
//title screen offers to Continue a fight that is over.
honeycomb.gallery.releaseStash = function () {
	if (honeycomb.gallery.stashHeld == true) honeycomb.state.run = honeycomb.gallery.stashedRun;
	honeycomb.gallery.stashedRun = null;
	honeycomb.gallery.stashHeld = false;
	honeycomb.save.suspended = false;
};

//Where a replayed battle lands: back on the screen the gallery was opened over, with the gallery under
//it again and the ending it just earned on top. The ending is RECORDED, which is the one thing a replay
//is allowed to change -- so losing on purpose is how a player who only ever won gets the loss scene.
honeycomb.gallery.afterBattle = function (continuation, won) {
	honeycomb.gallery.releaseStash();
	//The continuation carries the same four fields the tile was built from, so the ending works out its
	//own key rather than being told one -- and a scene with two fights in it records the right ending.
	var outcome = honeycomb.gallery.outcomeFor(won);
	honeycomb.gallery.record(honeycomb.gallery.outcomeKey(continuation.replayKey, outcome,
		honeycomb.gallery.outcomeTarget(continuation, outcome)));
	honeycomb.overlay.closeAll();
	honeycomb.scene.go(honeycomb.gallery.returnScene == null ? "teambuilding" : honeycomb.gallery.returnScene);
	honeycomb.overlay.open("gallery", {});
	honeycomb.gallery.replayStep = continuation.replayKey == null ? null
		: { key: continuation.replayKey, partIndex: continuation.partIndex };
	honeycomb.overlay.open("event", honeycomb.lustEvents.returnParams(continuation, won, "gallery"));
	honeycomb.save.autosave("lustBattleEnd");
};

//THE REPLAY HOST. `appliesEffects: false` means a reread pays nothing -- no cost, no experience, no
//weakness, no unlock, no discovery, no completion -- while the scene's STRUCTURE still resolves, so the
//Lust Battle in it is refought. `savesPosition: false` keeps it off the run's own saved event slot,
//which a map event may be sitting in.
honeycomb.eventHostArray.push({
	index: "gallery",
	recordsSeen: false,
	appliesEffects: false,
	savesPosition: false,
	finishLabel: "Back to the gallery",
	finish: function () { honeycomb.gallery.finishEvent(); },
	beginCombat: function (event, choice, pending) { return honeycomb.gallery.beginBattle(event, choice, pending); },
});

//The victory and defeat screens live in honeycomb-overlays-combat.js, which loads before this file in
//the page and not at all headless.
if (honeycomb.combatContinuationArray != null) {
	honeycomb.combatContinuationArray.push({
		index: "galleryBattle",
		buttonLabel: "Continue",
		lead: function (continuation) {
			var definition = honeycomb.findDefinition(honeycomb.characterArray, continuation.subject);
			return (definition == null ? "They" : definition.name) + " stands victorious.";
		},
		finish: function (continuation) { honeycomb.gallery.afterBattle(continuation, true); },
		defeatLead: function (continuation) {
			var definition = honeycomb.findDefinition(honeycomb.characterArray, continuation.subject);
			return (definition == null ? "They" : definition.name) + " could not hold out.";
		},
		finishDefeat: function (continuation) { honeycomb.gallery.afterBattle(continuation, false); },
	});
}

//---------------------------------------------------------------------------------------------------
//The window
//---------------------------------------------------------------------------------------------------
honeycomb.overlay.register({
	index: "gallery",
	closeOnBackdrop: true,
	build: function (layer) {
		layer.innerHTML = honeycomb.gallery.render();
	},
});

honeycomb.gallery.open = function () {
	honeycomb.gallery.characterIndex = null;
	//Where a replayed battle comes back to. The gallery is an overlay, so this is whichever screen it
	//was opened over -- the title or teambuilding.
	honeycomb.gallery.returnScene = honeycomb.scene == null ? null : honeycomb.scene.current;
	honeycomb.platform.sound("uiClick");
	honeycomb.overlay.open("gallery", {});
};

honeycomb.gallery.repaint = function () {
	for (var scanIndex = honeycomb.overlay.openArray.length - 1; scanIndex >= 0; scanIndex--) {
		if (honeycomb.overlay.openArray[scanIndex].index != "gallery") continue;
		honeycomb.overlay.openArray[scanIndex].element.innerHTML = honeycomb.gallery.render();
		return;
	}
};

honeycomb.gallery.showCharacter = function (characterIndex) {
	honeycomb.gallery.characterIndex = characterIndex;
	honeycomb.platform.sound("uiClick");
	honeycomb.gallery.repaint();
};

//There is no character-selection screen: the window opens straight onto a character.
//
//The rail reuses the roster's own look: its classes -- `hcRosterEntry` and its accent tab down the left
//edge, the portrait, `hcRosterName` -- with the two lines that would say the outfit and the HP saying
//the unlocked scene count vs total instead.
honeycomb.gallery.render = function () {
	var pageArray = honeycomb.gallery.pageArray();
	var opened = honeycomb.gallery.openedPage(pageArray);

	var markup = '<div class="hcOverlayPanel hcGalleryPanel">';
	markup += '<h2 class="hcOverlayTitle">Gallery</h2>';
	markup += '<div class="hcGalleryBody">';
	markup += '<div class="hcGalleryRail hcScroll">';
	for (var railIndex = 0; railIndex < pageArray.length; railIndex++) {
		markup += honeycomb.gallery.renderRailEntry(pageArray[railIndex], opened);
	}
	markup += "</div>";
	markup += '<div class="hcGalleryPage hcScroll">' +
		(opened == null ? '<div class="hcOverlayBody hcMuted hcCenterText">Nobody is on the roster yet.</div>'
			: honeycomb.gallery.renderPage(opened)) + "</div>";
	markup += "</div>";
	markup += '<div class="hcOverlayButtonRow"><div class="hcButton hcPrimary" onclick="honeycomb.overlay.close(\'gallery\')">Close</div></div>';
	markup += "</div>";
	return markup;
};

//Whose page is showing. The one last pressed, and otherwise the first character the profile has met --
//with no wall to fall back to, the window always has somebody open. A page for somebody not yet met is
//not a page, the same rule the roster and the Compendium follow.
honeycomb.gallery.openedPage = function (pageArray) {
	var wanted = honeycomb.gallery.characterIndex;
	var firstKnown = null;
	for (var scanIndex = 0; scanIndex < pageArray.length; scanIndex++) {
		if (pageArray[scanIndex].known != true) continue;
		if (firstKnown == null) firstKnown = pageArray[scanIndex];
		if (pageArray[scanIndex].characterIndex === wanted) return pageArray[scanIndex];
	}
	return firstKnown;
};

//One rail entry, in the roster's language. A character the profile has not met holds her place as a
//locked slot and cannot be opened, exactly as she does on the roster itself.
honeycomb.gallery.renderRailEntry = function (page, opened) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, page.characterIndex);
	if (definition == null) return "";

	if (page.known != true) {
		return '<div class="hcRosterEntry hcLocked hcGalleryRailEntry">' +
			'<div class="hcPortrait">' +
			honeycomb.ui.iconTag(null, "question", "#4b3d5c", { style: "width:100%;height:100%" }) + "</div>" +
			'<div class="hcGrow"><div class="hcRosterName hcDim">???</div>' +
			'<div class="hcTiny hcDim">Not yet found</div></div></div>';
	}

	var inspected = opened != null && opened.characterIndex === page.characterIndex;
	var markup = '<div class="hcRosterEntry hcGalleryRailEntry' + (inspected ? " hcInspected" : "") + '"' +
		' style="--hcAccent:' + definition.colorHint + '"' +
		' data-hcCharacter="' + honeycomb.escapeAttribute(definition.index) + '"' +
		' title="' + honeycomb.escapeAttribute(definition.name + "'s scenes") + '"' +
		' onclick="honeycomb.gallery.showCharacter(\'' + honeycomb.escapeAttribute(definition.index) + '\')">';
	markup += honeycomb.ui.portrait({ characterIndex: definition.index, outfitIndex: definition.defaultOutfit, downed: false },
		{ selected: inspected });
	markup += '<div class="hcGrow">';
	markup += '<div class="hcRosterName">' + honeycomb.escapeText(definition.name) + "</div>";
	//WHERE THE ROSTER PRINTS THE OUTFIT AND THE HP, this prints how much of her has been seen. The accent
	//line keeps the class glyph, so the two rails still read as the same widget.
	markup += '<div class="hcTiny hcRosterClass">' +
		honeycomb.ui.iconTag(definition.classIconPath, "star", definition.colorHint, { className: "hcInlineIcon" }) +
		" " + page.count.found + " of " + page.count.total + " found</div>";
	markup += "</div></div>";
	return markup;
};

//One character's page: her count, then a block per weakness, each a grid of scene tiles.
honeycomb.gallery.renderPage = function (page) {
	var groupArray = honeycomb.gallery.pageFor(page.characterIndex);
	var markup = '<div class="hcSectionTitleRow"><div class="hcSectionTitle hcGrow">' +
		honeycomb.escapeText(page.name) + "</div>" +
		'<div class="hcTiny hcMuted hcGalleryCount">' + page.count.found + " of " + page.count.total +
		" found</div></div>";
	if (groupArray.length === 0) {
		markup += '<div class="hcOverlayBody hcMuted hcCenterText">No scenes are written for ' +
			honeycomb.escapeText(page.name) + " yet.</div>";
		return markup;
	}
	for (var groupIndex = 0; groupIndex < groupArray.length; groupIndex++) {
		var group = groupArray[groupIndex];
		markup += '<div class="hcGalleryGroup">' + honeycomb.escapeText(group.name) + "</div>";
		markup += '<div class="hcGalleryScenes">';
		for (var entryIndex = 0; entryIndex < group.entryArray.length; entryIndex++) {
			markup += honeycomb.gallery.renderTile(group.entryArray[entryIndex], page.characterIndex);
		}
		markup += "</div>";
	}
	return markup;
};

//ONE TILE. Unlocked: its art, its title, and the character it is about when that is not whose page this
//is -- which is how a two-hander reads on both pages. Locked: no art, no title, and only the mechanical
//half of what it wants.
honeycomb.gallery.renderTile = function (entry, characterIndex) {
	//A battle's ending is drawn as a smaller tile under the scene it belongs to, so a page reads as
	//scenes rather than as a flat list in which an ending looks like one.
	var outcomeClass = entry.outcomeIndex == null ? "" : " hcGalleryOutcome";

	if (entry.unlocked != true) {
		return '<div class="hcGalleryTile hcGalleryLocked' + outcomeClass + '">' +
			'<div class="hcGalleryTileArt"><span class="hcPickerQuestion">?</span></div>' +
			'<div class="hcGalleryTileName hcDim">???</div>' +
			(entry.lockedCaption == null ? ""
				: '<div class="hcGalleryTileCaption hcDim">' + honeycomb.escapeText(entry.lockedCaption) + "</div>") +
			"</div>";
	}

	//The art an authored scene has, and the character's own portrait until it does. A tile is a picture
	//of something either way, which is the point of a gallery.
	var artMarkup;
	if (entry.imagePath != null) {
		artMarkup = honeycomb.imageTag(honeycomb.eventOverlay.artPathFor(entry.imagePath), { className: "hcGalleryTileArtImage", alt: entry.name });
	} else {
		var character = honeycomb.findDefinition(honeycomb.characterArray, entry.subject);
		artMarkup = character == null ? "" : honeycomb.art.portraitTag(character.index, character.defaultOutfit,
			{ className: "hcGalleryTileArtImage", alt: character.name });
	}

	//An ending says nothing the scene above it has not already said: it sits under that scene, in that
	//scene's weakness block, and repeating "Venom - Sensitised" on all three tiles is noise.
	var caption = entry.outcomeIndex == null ? entry.lockedCaption : null;
	if (entry.subject != null && entry.subject !== characterIndex) {
		var withThem = honeycomb.findDefinition(honeycomb.characterArray, entry.subject);
		if (withThem != null) caption = "With " + withThem.name + (caption == null ? "" : " · " + caption);
	}

	return '<div class="hcGalleryTile' + outcomeClass + '"' +
		' title="' + (entry.outcomeIndex == null ? "Replay this scene" : "Read this ending") + '"' +
		' onclick="honeycomb.gallery.play(\'' + honeycomb.escapeAttribute(entry.key) + '\')">' +
		'<div class="hcGalleryTileArt">' + artMarkup + "</div>" +
		'<div class="hcGalleryTileName">' + honeycomb.escapeText(entry.name) + "</div>" +
		(caption == null ? "" : '<div class="hcGalleryTileCaption hcMuted">' + honeycomb.escapeText(caption) + "</div>") +
		"</div>";
};
