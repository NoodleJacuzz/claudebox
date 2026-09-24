//===================================================================================================
//HONEYCOMB CATACOMBS -- the deck screen
//===================================================================================================
//THE WHOLE PARTY'S DECK, as its own thing rather than a tab inside one character's panel. The deck is
//the party, so asking about it from inside a single character's page was the wrong shape: the answer
//had nothing to do with whoever happened to be selected.
//
//It is reachable from two places, and both are global: the deck count in the top bar during a run, and
//a button in the teambuilding footer before one. Same screen either way.
//
//BEFORE A RUN it previews what the current team WOULD be dealt, resolved live from the selection.
//DURING A RUN it shows the real deck, cards picked up along the way included. Which one is being shown
//is stated on the screen, because those are different questions and a player should not have to work
//out which they asked.
window.honeycomb = window.honeycomb || {};

honeycomb.overlay.register({
	index: "deck",
	closeOnBackdrop: true,
	build: function (layer) {
		layer.innerHTML = honeycomb.deckScreen.render();
	},
});

honeycomb.deckScreen = {
	//Which ordering the list is in. A cursor, not a saved choice.
	sortIndex: null,
	//Which character's contribution is being isolated, or null for the whole deck.
	filterCharacterIndex: null,
	//A card type or card tag narrowing the list, or null. Cursors too, cleared on close.
	filterTypeIndex: null,
	filterTagIndex: null,
};

//Whether a card passes the type and card-tag filters.
honeycomb.deckScreen.passesFilters = function (cardIndex) {
	var definition = honeycomb.findDefinition(honeycomb.cardArray, cardIndex);
	if (definition == null) return false;
	//Any of the card's types matches: a Damage-and-Negative card is under both chips.
	if (honeycomb.deckScreen.filterTypeIndex != null && honeycomb.cardHasType(definition, honeycomb.deckScreen.filterTypeIndex) == false) return false;
	if (honeycomb.deckScreen.filterTagIndex != null && honeycomb.definitionHasTag(definition, honeycomb.deckScreen.filterTagIndex) == false) return false;
	return true;
};

//The rows to show, and where they came from. Two sources, one shape. `filterCharacterIndex` overrides
//the screen's own character filter, so another screen (the party window) can ask for one character's
//cards without disturbing the deck screen's controls.
honeycomb.deckScreen.entryArray = function (filterCharacterIndex) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var filter = filterCharacterIndex == null ? honeycomb.deckScreen.filterCharacterIndex : filterCharacterIndex;

	if (run != null) {
		//A live run: the real deck, including everything picked up on the map.
		var liveArray = [];
		for (var cardIndex = 0; cardIndex < run.deckArray.length; cardIndex++) {
			var instance = run.deckArray[cardIndex];
			var owner = honeycomb.cardOwnerMember(instance);
			var ownerIndex = owner == null ? null : owner.characterIndex;
			if (filter != null && ownerIndex != filter) continue;
			//Upgraded copies are listed apart from unupgraded ones: they are different cards to play.
			var key = instance.cardIndex + "@" + instance.upgradeLevel;
			var existing = null;
			for (var scanIndex = 0; scanIndex < liveArray.length; scanIndex++) {
				if (liveArray[scanIndex].key == key) { existing = liveArray[scanIndex]; break; }
			}
			if (existing == null) {
				liveArray.push({
					key: key, index: instance.cardIndex, cardIndex: instance.cardIndex,
					count: 1, upgradeLevel: instance.upgradeLevel, sourceArray: [],
					instanceId: instance.instanceId,
				});
			} else {
				existing.count += 1;
			}
		}
		return { entryArray: liveArray, live: true };
	}

	//No run: preview what the chosen team would be dealt, resolved from the selection.
	var selectionArray = honeycomb.teambuilding == null ? [] : honeycomb.teambuilding.selectionArray();
	var previewArray = [];
	for (var memberIndex = 0; memberIndex < selectionArray.length; memberIndex++) {
		if (filter != null &&
			selectionArray[memberIndex].characterIndex != filter) continue;
		var contributionArray = honeycomb.memberCardEntryArray(selectionArray[memberIndex]);
		for (var entryIndex = 0; entryIndex < contributionArray.length; entryIndex++) previewArray.push(contributionArray[entryIndex]);
	}
	var merged = honeycomb.coalescePoolEntryArray(previewArray,
		honeycomb.findDefinition(honeycomb.poolKindArray, "card"));
	for (var keyIndex = 0; keyIndex < merged.length; keyIndex++) {
		merged[keyIndex].key = merged[keyIndex].index;
		merged[keyIndex].upgradeLevel = 0;
	}
	return { entryArray: merged, live: false };
};

honeycomb.deckScreen.render = function () {
	var gathered = honeycomb.deckScreen.entryArray();
	//The type and tag chips count the whole (character-filtered) deck, so a chip still says how many
	//cards it would show while another chip is active.
	var chipSourceArray = gathered.entryArray;
	var visibleArray = [];
	for (var filterIndex = 0; filterIndex < gathered.entryArray.length; filterIndex++) {
		if (honeycomb.deckScreen.passesFilters(gathered.entryArray[filterIndex].cardIndex)) visibleArray.push(gathered.entryArray[filterIndex]);
	}
	var entryArray = honeycomb.sortCardEntryArray(visibleArray, honeycomb.deckScreen.sortIndex);

	var total = 0;
	for (var countIndex = 0; countIndex < entryArray.length; countIndex++) total += entryArray[countIndex].count;

	var markup = '<div class="hcOverlayPanel hcDeckPanel">';
	markup += '<h2 class="hcOverlayTitle">' + (gathered.live ? "Your Deck" : "The Deck You Would Take") + "</h2>";
	markup += '<div class="hcOverlayBody hcMuted hcCenterText">' + total + " card" + (total === 1 ? "" : "s") +
		(gathered.live ? "" : " — nothing is committed until the run begins") + "</div>";

	//What the deck is MADE OF: its card types, then its card tags, each a filter. Character tags are
	//not shown here -- they describe the party, not the cards.
	markup += honeycomb.deckScreen.renderFilterChips(chipSourceArray);
	markup += honeycomb.deckScreen.renderControls();

	if (entryArray.length === 0) {
		markup += '<div class="hcOverlayBody hcMuted">Nothing here yet.</div>';
	} else {
		markup += '<div class="hcDeckGrid hcScroll">';
		for (var cellIndex = 0; cellIndex < entryArray.length; cellIndex++) {
			markup += honeycomb.deckScreen.renderCell(entryArray[cellIndex]);
		}
		markup += "</div>";
	}

	markup += '<div class="hcOverlayButtonRow">' +
		'<div class="hcButton hcPrimary" onclick="honeycomb.deckScreen.close()">Close</div></div>';
	markup += "</div>";
	return markup;
};

//The card types the deck holds, then the card tags it holds, each with a count and each a toggle that
//narrows the list to it. Only what is actually present is offered.
honeycomb.deckScreen.renderFilterChips = function (entryArray) {
	var typeCountArray = {};
	var tagCountArray = {};
	for (var scanIndex = 0; scanIndex < entryArray.length; scanIndex++) {
		var definition = honeycomb.findDefinition(honeycomb.cardArray, entryArray[scanIndex].cardIndex);
		if (definition == null) continue;
		var cardTypeIndexArray = honeycomb.cardTypeIndexArray(definition);
		for (var cardTypeScan = 0; cardTypeScan < cardTypeIndexArray.length; cardTypeScan++) {
			var countedType = cardTypeIndexArray[cardTypeScan];
			typeCountArray[countedType] = (typeCountArray[countedType] || 0) + entryArray[scanIndex].count;
		}
		var schoolArray = honeycomb.cardSchoolArray(definition);
		for (var schoolIndex = 0; schoolIndex < schoolArray.length; schoolIndex++) {
			var tag = schoolArray[schoolIndex].index;
			tagCountArray[tag] = (tagCountArray[tag] || 0) + entryArray[scanIndex].count;
		}
	}

	var markup = '<div class="hcTagRow hcDeckFilterRow">';
	for (var typeIndex = 0; typeIndex < honeycomb.cardTypeArray.length; typeIndex++) {
		var type = honeycomb.cardTypeArray[typeIndex];
		if (typeCountArray[type.index] == null) continue;
		markup += honeycomb.deckScreen.filterChip("type", type.index, type.name, type.color, typeCountArray[type.index],
			honeycomb.deckScreen.filterTypeIndex == type.index);
	}
	for (var tagIndex = 0; tagIndex < honeycomb.cardTagArray.length; tagIndex++) {
		var cardTag = honeycomb.cardTagArray[tagIndex];
		if (tagCountArray[cardTag.index] == null) continue;
		markup += honeycomb.deckScreen.filterChip("tag", cardTag.index, cardTag.name, cardTag.color, tagCountArray[cardTag.index],
			honeycomb.deckScreen.filterTagIndex == cardTag.index);
	}
	markup += "</div>";
	return markup;
};

honeycomb.deckScreen.filterChip = function (kind, index, name, color, count, active) {
	return '<span class="hcTagChip hcFilterChip' + (active ? " hcOn" : "") + '" style="border-color:' + color + ";color:" + color + '"' +
		' onclick="honeycomb.deckScreen.toggleFilter(\'' + kind + "','" + index + '\')">' +
		honeycomb.escapeText(name) + '<span class="hcTagCount">' + count + "</span></span>";
};

honeycomb.deckScreen.toggleFilter = function (kind, index) {
	if (kind == "type") honeycomb.deckScreen.filterTypeIndex = honeycomb.deckScreen.filterTypeIndex == index ? null : index;
	if (kind == "tag") honeycomb.deckScreen.filterTagIndex = honeycomb.deckScreen.filterTagIndex == index ? null : index;
	honeycomb.platform.sound("uiClick");
	honeycomb.deckScreen.repaint();
};

//Sorting, and a filter by whose card it is. Both are cursors on the screen rather than saved settings.
honeycomb.deckScreen.renderControls = function () {
	var markup = '<div class="hcDeckControls">';

	markup += '<div class="hcSegmented">';
	for (var sortIndex = 0; sortIndex < honeycomb.cardEntrySortArray.length; sortIndex++) {
		var sort = honeycomb.cardEntrySortArray[sortIndex];
		var active = (honeycomb.deckScreen.sortIndex == null
			? honeycomb.tuning.deck.defaultSort : honeycomb.deckScreen.sortIndex) == sort.index;
		markup += '<div class="hcSegment' + (active ? " hcOn" : "") + '"' +
			' onclick="honeycomb.deckScreen.setSort(\'' + sort.index + '\')">' +
			honeycomb.escapeText(sort.name) + "</div>";
	}
	markup += "</div>";

	//Whose cards. Drawn from whoever is actually in the party, so it is never a list of absentees.
	var memberArray = honeycomb.deckScreen.memberArray();
	if (memberArray.length > 1) {
		markup += '<div class="hcSegmented">';
		markup += '<div class="hcSegment' + (honeycomb.deckScreen.filterCharacterIndex == null ? " hcOn" : "") + '"' +
			' onclick="honeycomb.deckScreen.setFilter(null)">Everyone</div>';
		for (var memberIndex = 0; memberIndex < memberArray.length; memberIndex++) {
			var definition = honeycomb.findDefinition(honeycomb.characterArray, memberArray[memberIndex]);
			if (definition == null) continue;
			markup += '<div class="hcSegment' +
				(honeycomb.deckScreen.filterCharacterIndex == definition.index ? " hcOn" : "") + '"' +
				' onclick="honeycomb.deckScreen.setFilter(\'' + definition.index + '\')">' +
				honeycomb.escapeText(definition.name) + "</div>";
		}
		markup += "</div>";
	}

	markup += "</div>";
	return markup;
};

honeycomb.deckScreen.memberArray = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var sourceArray = run != null
		? run.partyArray
		: (honeycomb.teambuilding == null ? [] : honeycomb.teambuilding.selectionArray());
	var result = [];
	for (var scanIndex = 0; scanIndex < sourceArray.length; scanIndex++) {
		if (result.indexOf(sourceArray[scanIndex].characterIndex) < 0) result.push(sourceArray[scanIndex].characterIndex);
	}
	return result;
};

honeycomb.deckScreen.renderCell = function (entry) {
	var definition = honeycomb.findDefinition(honeycomb.cardArray, entry.cardIndex);
	if (definition == null) return "";
	var resolved = honeycomb.resolveCard({
		instanceId: entry.instanceId == null ? null : entry.instanceId,
		cardIndex: definition.index,
		ownerInstanceId: null,
		upgradeLevel: entry.upgradeLevel == null ? 0 : entry.upgradeLevel,
	});

	var markup = '<div class="hcDeckCell">';
	markup += honeycomb.ui.card(resolved, { size: "small", showAffinity: false });
	if (entry.count > 1) markup += '<div class="hcDeckCount">&times;' + entry.count + "</div>";
	markup += "</div>";
	return markup;
};

honeycomb.deckScreen.setSort = function (sortIndex) {
	honeycomb.deckScreen.sortIndex = sortIndex;
	honeycomb.platform.sound("uiClick");
	honeycomb.deckScreen.repaint();
};

honeycomb.deckScreen.setFilter = function (characterIndex) {
	honeycomb.deckScreen.filterCharacterIndex = characterIndex;
	honeycomb.platform.sound("uiClick");
	honeycomb.deckScreen.repaint();
};

honeycomb.deckScreen.close = function () {
	//The filters are a question about this visit, not a preference. Cleared so the screen opens showing
	//the whole deck next time, which is what "show me the deck" means.
	honeycomb.deckScreen.filterCharacterIndex = null;
	honeycomb.deckScreen.filterTypeIndex = null;
	honeycomb.deckScreen.filterTagIndex = null;
	honeycomb.overlay.close("deck");
};

honeycomb.deckScreen.open = function (characterIndex) {
	honeycomb.deckScreen.filterCharacterIndex = characterIndex == null ? null : characterIndex;
	honeycomb.overlay.open("deck", {});
};

honeycomb.deckScreen.repaint = function () {
	for (var scanIndex = honeycomb.overlay.openArray.length - 1; scanIndex >= 0; scanIndex--) {
		if (honeycomb.overlay.openArray[scanIndex].index != "deck") continue;
		honeycomb.overlay.openArray[scanIndex].element.innerHTML = honeycomb.deckScreen.render();
		return;
	}
};
