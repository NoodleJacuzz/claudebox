//===================================================================================================
//HONEYCOMB CATACOMBS -- teambuilding scene
//===================================================================================================
//Where a run is assembled. Four columns: the roster, the inspected character's art, their stat block
//and starting deck, and a tabbed panel for outfits, equipment and progression.
//
//The screen edits a SELECTION -- a list of {characterIndex, outfitIndex, equipmentArray} -- and does
//not create a run until Start Run is pressed. Everything shown is previewed from that selection, so
//swapping an outfit updates the deck list immediately with no run in existence.
//
//The selection is kept on the profile, so closing the game and returning lands on the same team.
window.honeycomb = window.honeycomb || {};

honeycomb.teambuilding = {
	//Which roster entry the detail panel is describing. Not saved; it is a cursor, not a choice.
	inspectedCharacterIndex: null,
	//Which right-hand tab is open.
	activeTab: "outfits",
	//Whether Contributed Cards is a compact list or rendered cards.
	contributedView: "list",
	//A one-line message about the last loadout change, when it refunded progression. Cleared by the
	//next change that refunds nothing.
	noticeText: null,
};

//The deck is not a tab: it belongs to the party, not to whoever happens to be selected. It opens from
//the footer instead, and from the top bar during a run. See honeycomb-overlays-deck.js.
honeycomb.teambuilding.tabArray = [
	{ index: "outfits", name: "Outfits", glyph: "bag" },
	{ index: "equipment", name: "Equipment", glyph: "shield" },
	{ index: "progression", name: "Progression", glyph: "star" },
];

//How the Contributed Cards list is drawn. A cursor on the screen rather than a saved preference.
honeycomb.teambuilding.contributedViewArray = [
	{ index: "list", name: "List", glyph: "chevron" },
	{ index: "detailed", name: "Cards", glyph: "spiral" },
];

//The party ceiling the screen offers: three by default; the debug panel's `allowLargeParty` toggle
//raises it to the debug ceiling of six. The engine itself has no ceiling.
honeycomb.teambuilding.partySizeMaximum = function () {
	if (honeycomb.debug != null && honeycomb.debug.allowLargeParty == true) {
		return honeycomb.tuning.run.partySizeMaximumDebug;
	}
	return honeycomb.tuning.run.partySizeMaximum;
};

//---------------------------------------------------------------------------------------------------
//Selection access
//---------------------------------------------------------------------------------------------------
//The working party. Held on the profile so it survives a session.
honeycomb.teambuilding.selectionArray = function () {
	var profile = honeycomb.state.profile;
	if (profile.lastPartyArray == null) profile.lastPartyArray = [];
	return profile.lastPartyArray;
};

honeycomb.teambuilding.findSelection = function (characterIndex) {
	var selectionArray = honeycomb.teambuilding.selectionArray();
	for (var scanIndex = 0; scanIndex < selectionArray.length; scanIndex++) {
		if (selectionArray[scanIndex].characterIndex == characterIndex) return selectionArray[scanIndex];
	}
	return null;
};

honeycomb.teambuilding.isSelected = function (characterIndex) {
	return honeycomb.teambuilding.findSelection(characterIndex) != null;
};

//What a character is wearing: their party slot when fielded, otherwise the loadout they remember from
//their last time in the party (or their starting one). Every screen that previews a benched character
//asks here, so all of them agree.
honeycomb.teambuilding.loadoutFor = function (characterIndex) {
	var live = honeycomb.teambuilding.findSelection(characterIndex);
	if (live != null) return live;
	return honeycomb.equipment.loadoutForJoining(characterIndex, honeycomb.teambuilding.selectionArray());
};

//The same loadout with only the equipment that COUNTS -- what fits the party's capacity -- which is
//what health, cards and tags are previewed from. Greyed pieces preview nothing, as they do nothing.
honeycomb.teambuilding.effectiveLoadout = function (characterIndex) {
	var loadout = honeycomb.teambuilding.loadoutFor(characterIndex);
	return {
		characterIndex: loadout.characterIndex,
		outfitIndex: loadout.outfitIndex,
		equipmentArray: honeycomb.equipment.activeArray(loadout.equipmentArray,
			honeycomb.teambuilding.selectionArray().length),
	};
};

//The name an outfit prints. The default outfit has no name of its own -- it is the character's plain
//class look -- so it prints the class name instead. That is what lets the roster read as the worn
//outfit: a default-dressed character shows the class, everyone else shows their outfit.
honeycomb.teambuilding.outfitDisplayName = function (definition, outfitIndex) {
	if (definition == null) return "";
	var outfit = honeycomb.findOutfit(definition, outfitIndex);
	if (outfit == null) return definition.className;
	if (outfit.index == definition.defaultOutfit) return definition.className;
	return outfit.name;
};

//The line shown on a piece the party is too big to use lives in the tooltip text table as
//"equipment.overCapacity" (honeycomb-text-tooltips.js).

//Whether a character may not join the party right now: a Lust Event waiting.
honeycomb.teambuilding.joinRefused = function (characterIndex) {
	return honeycomb.lustEvents != null && honeycomb.lustEvents.blocksParty(characterIndex);
};

//Adds or removes a character from the party, respecting the size limits from tuning. A character
//leaving keeps what they wore; one joining gets it back (see honeycomb.equipment).
honeycomb.teambuilding.toggleMember = function (characterIndex) {
	var selectionArray = honeycomb.teambuilding.selectionArray();
	var existing = honeycomb.teambuilding.findSelection(characterIndex);

	if (existing != null) {
		//Emptying the board is allowed; STARTING a run with it empty is not (honeycomb.teambuilding.startRun).
		if (selectionArray.length <= honeycomb.tuning.run.rosterSizeMinimum) {
			honeycomb.platform.sound("uiBack");
			return;
		}
		honeycomb.equipment.remember(existing);
		selectionArray.splice(selectionArray.indexOf(existing), 1);
		honeycomb.platform.sound("uiBack");
	} else {
		if (selectionArray.length >= honeycomb.teambuilding.partySizeMaximum() || honeycomb.teambuilding.joinRefused(characterIndex)) {
			honeycomb.platform.sound("uiBack");
			return;
		}
		var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
		if (definition == null) return;
		selectionArray.push(honeycomb.equipment.loadoutForJoining(characterIndex, selectionArray));
		honeycomb.platform.sound("uiClick");
	}
	honeycomb.teambuilding.inspectedCharacterIndex = characterIndex;
	honeycomb.scene.refresh();
};

honeycomb.teambuilding.inspect = function (characterIndex) {
	honeycomb.teambuilding.inspectedCharacterIndex = characterIndex;
	honeycomb.platform.sound("uiClick");
	honeycomb.scene.refresh();
};

honeycomb.teambuilding.setTab = function (tabIndex) {
	honeycomb.teambuilding.activeTab = tabIndex;
	honeycomb.platform.sound("uiClick");
	honeycomb.scene.refresh();
};

//Equipping an outfit. Only affects the selection, so the preview updates and nothing is committed.
honeycomb.teambuilding.setOutfit = function (characterIndex, outfitIndex) {
	var selection = honeycomb.teambuilding.findSelection(characterIndex);
	//A benched character's outfit choice changes what they remember, not the party: it writes to
	//their remembered loadout, so it is worn when they next join.
	if (selection == null) {
		var loadout = honeycomb.teambuilding.loadoutFor(characterIndex);
		loadout.outfitIndex = outfitIndex;
		honeycomb.equipment.remember(loadout);
		//The outfit-change policy still runs, so a node this outfit forbids is refunded and reported.
		honeycomb.teambuilding.reportLoadoutRefund(loadout);
	} else {
		selection.outfitIndex = outfitIndex;
		//THE OUTFIT-CHANGE POLICY. An outfit may lock tree nodes; anything the player had already bought
		//that this outfit forbids is refunded rather than silently swallowed, and they are told.
		honeycomb.teambuilding.reportLoadoutRefund(selection);
	}
	//Honeycomb's own stinger: !outfitChange fires when the player changes a character's outfit.
	honeycomb.platform.sound("outfitChange");
	honeycomb.scene.refresh();
};

//Re-validates a character's progression against their new loadout and says what came back. Called
//from every site that can change an outfit or a piece of equipment.
//Progression nodes that name an unlock are cashed in here, so `unlockOutfit` on a tree node means
//something rather than sitting unread. Called wherever the screen rebuilds.
honeycomb.teambuilding.applyUnlocks = function () {
	var granted = [];
	for (var scanIndex = 0; scanIndex < honeycomb.characterArray.length; scanIndex++) {
		var fromCharacter = honeycomb.unlocks.applyProgression(honeycomb.characterArray[scanIndex].index);
		for (var grantIndex = 0; grantIndex < fromCharacter.length; grantIndex++) granted.push(fromCharacter[grantIndex]);
	}
	return granted;
};

honeycomb.teambuilding.reportLoadoutRefund = function (selection) {
	var refunded = honeycomb.progression.onLoadoutChanged(selection);
	if (refunded <= 0) { honeycomb.teambuilding.noticeText = null; return 0; }
	//Worded for both cases: an outfit that LOCKS a node, and one that simply does not carry a node the
	//previous outfit added. Either way the player is told, and paid back.
	honeycomb.teambuilding.noticeText = "This loadout changes the tree. " + refunded +
		" Experience refunded.";
	return refunded;
};

//Equipment is a toggle per item, limited by capacity and by wearer: a piece somebody else holds -- in
//the party or in a benched character's memory -- is taken off them, and the screen says from whom. An
//heirloom stays with its owner. With no slots, putting a piece on when the character is already at
//capacity takes off the piece worn longest, so the new one is the one that works: clicking a piece
//should never make it appear greyed.
honeycomb.teambuilding.toggleEquipment = function (characterIndex, equipmentIndex) {
	var selection = honeycomb.teambuilding.findSelection(characterIndex);
	if (selection == null) return;
	var definition = honeycomb.findDefinition(honeycomb.equipmentArray, equipmentIndex);
	if (definition == null) return;
	if (honeycomb.equipment.canWear(characterIndex, equipmentIndex) == false) {
		honeycomb.platform.sound("uiBack");
		return;
	}

	var takenFrom = null;
	var position = selection.equipmentArray.indexOf(equipmentIndex);
	if (position >= 0) {
		selection.equipmentArray.splice(position, 1);
		honeycomb.platform.sound("uiBack");
	} else {
		takenFrom = honeycomb.equipment.takeFrom(equipmentIndex, honeycomb.teambuilding.selectionArray(), characterIndex);
		var capacity = honeycomb.equipment.capacity(honeycomb.teambuilding.selectionArray().length);
		while (selection.equipmentArray.length > 0 && selection.equipmentArray.length >= capacity) {
			selection.equipmentArray.shift();
		}
		selection.equipmentArray.push(equipmentIndex);
		honeycomb.platform.sound("uiClick");
	}
	honeycomb.teambuilding.reportLoadoutRefund(selection);
	if (takenFrom != null) {
		var previousSelection = honeycomb.teambuilding.findSelection(takenFrom);
		if (previousSelection != null) honeycomb.progression.onLoadoutChanged(previousSelection);
		var previous = honeycomb.findDefinition(honeycomb.characterArray, takenFrom);
		honeycomb.teambuilding.noticeText = definition.name + " taken from " + (previous == null ? takenFrom : previous.name) + ".";
	}
	honeycomb.scene.refresh();
};

//How the equipment tab lists things. Cursors on the screen, not saved preferences.
honeycomb.teambuilding.equipmentSort = null;
honeycomb.teambuilding.equipmentFilterArray = [];

honeycomb.teambuilding.equipmentSortArray = [
	{ index: "recent", name: "Recent" },
	{ index: "rarity", name: "Rarity" },
	{ index: "name", name: "Name" },
	{ index: "kind", name: "Heirlooms first" },
];

honeycomb.teambuilding.setEquipmentSort = function (sortIndex) {
	honeycomb.teambuilding.equipmentSort = sortIndex;
	honeycomb.platform.sound("uiClick");
	honeycomb.scene.refresh();
};

//Filters by kind (heirloom / generic), plus "found" (hide what has not been found yet). Several may be on
//at once: kinds widen the list between them, "found" narrows it.
honeycomb.teambuilding.toggleEquipmentFilter = function (filterIndex) {
	var filterArray = honeycomb.teambuilding.equipmentFilterArray;
	var position = filterArray.indexOf(filterIndex);
	if (position >= 0) filterArray.splice(position, 1);
	else filterArray.push(filterIndex);
	honeycomb.platform.sound("uiClick");
	honeycomb.scene.refresh();
};

//The equipment table as the tab should list it for one character: filtered, then sorted. Name breaks
//every tie, so the order never shuffles between repaints.
honeycomb.teambuilding.sortedEquipmentArray = function (characterIndex) {
	var filterArray = honeycomb.teambuilding.equipmentFilterArray;
	var kindFilterArray = [];
	for (var filterIndex = 0; filterIndex < filterArray.length; filterIndex++) {
		if (filterArray[filterIndex] != "found") kindFilterArray.push(filterArray[filterIndex]);
	}
	var resultArray = [];
	for (var scanIndex = 0; scanIndex < honeycomb.equipmentArray.length; scanIndex++) {
		var equipment = honeycomb.equipmentArray[scanIndex];
		//Another character's heirloom is not this character's business.
		if (equipment.characterIndex != null && equipment.characterIndex != characterIndex) continue;
		if (kindFilterArray.length > 0 && kindFilterArray.indexOf(honeycomb.equipment.kindOf(equipment).index) < 0) continue;
		if (filterArray.indexOf("found") >= 0 && honeycomb.unlocks.isUnlocked("equipment", equipment.index) == false) continue;
		resultArray.push(equipment);
	}

	var sortIndex = honeycomb.teambuilding.equipmentSort == null
		? honeycomb.tuning.equipment.defaultSort : honeycomb.teambuilding.equipmentSort;
	var rarityOrder = function (equipment) {
		var rarity = honeycomb.findDefinition(honeycomb.equipmentRarityArray, equipment.rarity);
		return rarity == null ? 0 : rarity.order;
	};
	var kindOrder = function (equipment) { return honeycomb.equipment.kindOf(equipment).order; };
	resultArray.sort(function (left, right) {
		var difference = 0;
		if (sortIndex == "recent") {
			var leftRecent = honeycomb.equipment.recentPosition(characterIndex, left.index);
			var rightRecent = honeycomb.equipment.recentPosition(characterIndex, right.index);
			difference = leftRecent === rightRecent ? 0 : (leftRecent < rightRecent ? -1 : 1);
		}
		if (sortIndex == "rarity") difference = rarityOrder(right) - rarityOrder(left);
		//Heirlooms first, and rarest first within each kind.
		if (sortIndex == "kind") difference = (kindOrder(left) - kindOrder(right)) || (rarityOrder(right) - rarityOrder(left));
		if (difference !== 0) return difference;
		return left.name < right.name ? -1 : (left.name > right.name ? 1 : 0);
	});
	return resultArray;
};

//---------------------------------------------------------------------------------------------------
//Starting a run
//---------------------------------------------------------------------------------------------------
honeycomb.teambuilding.startRun = function () {
	var selectionArray = honeycomb.teambuilding.selectionArray();
	//The Start Run button is blocked if no character is in the party. The party can be empty now --
	//every member may have had a Lust Event waiting -- so an empty party is refused, not filled.
	if (selectionArray.length === 0) {
		honeycomb.platform.sound("uiBack");
		return;
	}
	//Nobody with an event waiting sets off, however they got into the list.
	for (var checkIndex = 0; checkIndex < selectionArray.length; checkIndex++) {
		if (honeycomb.teambuilding.joinRefused(selectionArray[checkIndex].characterIndex)) {
			honeycomb.platform.sound("uiBack");
			honeycomb.scene.refresh();
			return;
		}
	}
	if (selectionArray.length < honeycomb.tuning.run.partySizeMinimum) {
		console.error("Honeycomb: cannot start a run with fewer than " +
			honeycomb.tuning.run.partySizeMinimum + " party members");
		return;
	}

	//Starting relics are gone: each character's heirloom is equipment in their loadout, and newRun
	//carries only the pieces that fit the party's capacity.
	honeycomb.newRun(selectionArray, null);

	honeycomb.map.generateRegion();
	honeycomb.platform.sound("runStart");
	honeycomb.save.autosave("runStart");
	honeycomb.scene.go("map");
};

//---------------------------------------------------------------------------------------------------
//Scene
//---------------------------------------------------------------------------------------------------
honeycomb.scene.register({
	index: "teambuilding",
	build: function (root) {
		honeycomb.applyTuningToCss();
		//Cash in any unlock a progression node has earned. Done on build rather than at the moment a
		//node is taken, so an unlock is never missed by a path that changed the tree some other way.
		honeycomb.teambuilding.applyUnlocks();

		var selectionArray = honeycomb.teambuilding.selectionArray();
		//A character in Event Ready state is removed from the party on entering the teambuilding scene.
		//Checked on every build, so a rank-up that raised an event mid-run takes effect the moment the
		//run ends.
		if (honeycomb.lustEvents != null) {
			var removedArray = honeycomb.lustEvents.removeBlockedFromParty(selectionArray);
			if (removedArray.length > 0) {
				var removedNameArray = removedArray.map(function (characterIndex) {
					var removed = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
					return removed == null ? characterIndex : removed.name;
				});
				honeycomb.teambuilding.noticeText = removedNameArray.join(", ") + (removedNameArray.length == 1 ? " has" : " have") +
					" a Lust Event waiting and left the party.";
			}
		}
		//Default the party to whatever tuning calls a starting team, the FIRST time this is opened only. A
		//party emptied later (every member had an event waiting) stays empty, and Start Run says why.
		if (selectionArray.length > 0) honeycomb.state.profile.partyFilledOnce = true;
		if (selectionArray.length === 0 && honeycomb.state.profile.partyFilledOnce != true) {
			honeycomb.teambuilding.fillDefaultParty();
			honeycomb.state.profile.partyFilledOnce = true;
		}

		if (honeycomb.teambuilding.inspectedCharacterIndex == null) {
			honeycomb.teambuilding.inspectedCharacterIndex = selectionArray.length > 0
				? selectionArray[0].characterIndex
				: honeycomb.state.profile.unlockedCharacterArray[0];
		}

		var markup = '<div class="hcScreen hcTeambuilding">';
		//The heart icon in the corner opens the Gallery. This is the screen the roster is on, so it is the
		//screen a player is on when they want to reread a scene.
		markup += honeycomb.ui.topBar({ showExit: true, showGallery: true, subtitle: "Assemble a party" });
		markup += '<div class="hcBody hcTeamBody">';
		//The painting behind the whole screen, as in the mockups. Shows nothing until the file exists.
		markup += '<div class="hcSceneBackdrop">' + honeycomb.imageTag("backgrounds/teambuilding",
			{ className: "hcSceneBackdropArt", alt: "", silentFallback: true }) + "</div>";
		//The roster and the party lineup share one column: the draggable lineup sits directly below the
		//Roster window, and its Front / Back labels sit on a line above it rather than flanking it, so the
		//strip keeps its whole width for portraits.
		markup += '<div class="hcTeamLeft">';
		markup += honeycomb.teambuilding.buildRosterColumn();
		markup += honeycomb.teambuilding.buildPartyStrip();
		markup += "</div>";
		markup += honeycomb.teambuilding.buildPortraitColumn();
		markup += honeycomb.teambuilding.buildDetailColumn();
		markup += honeycomb.teambuilding.buildTabColumn();
		markup += "</div>";
		markup += honeycomb.teambuilding.buildFooter();
		markup += "</div>";
		root.innerHTML = markup;
		honeycomb.progressionScreen.fitToStage();
		honeycomb.teambuilding.attachDragHandlers(root);
		//Every change on this screen ends in a rebuild, so writing here keeps the party, loadouts and
		//progression trees saved without each editing site having to remember to.
		honeycomb.save.autosave("teambuilding");
	},
	teardown: function () {
		honeycomb.teambuilding.endDrag();
	},
});

//---------------------------------------------------------------------------------------------------
//Dragging the party into shape
//---------------------------------------------------------------------------------------------------
//A roster entry dragged onto the party strip joins the party at the place it is dropped; a member
//dragged along the strip changes places; a member dragged off the strip leaves. Clicks still do what
//they did -- a press that never travels far enough is a click -- so nothing needs dragging.
//
//Same input model as the combat hand: Pointer Events with pointer capture on the pressed element, and
//not one document-level listener, so Syrup Town's Jiggy minigame never sees any of it.
honeycomb.teambuilding.drag = null;

honeycomb.teambuilding.attachDragHandlers = function (root) {
	var sourceArray = root.querySelectorAll(".hcRosterEntry[data-hcCharacter], .hcPartySlot[data-hcCharacter]");
	for (var scanIndex = 0; scanIndex < sourceArray.length; scanIndex++) {
		sourceArray[scanIndex].addEventListener("pointerdown", honeycomb.teambuilding.onDragPointerDown);
	}
};

honeycomb.teambuilding.onDragPointerDown = function (event) {
	if (event.button != null && event.button !== 0) return;
	var element = event.currentTarget;
	//The add/remove toggle inside a roster row is a button of its own, not a handle.
	if (event.target != null && event.target.closest != null && event.target.closest(".hcTeamToggle") != null) return;
	element.setPointerCapture(event.pointerId);
	honeycomb.teambuilding.drag = {
		characterIndex: element.dataset.hccharacter,
		fromParty: element.classList.contains("hcPartySlot"),
		element: element,
		pointerId: event.pointerId,
		startX: event.clientX,
		startY: event.clientY,
		committed: false,
		ghost: null,
		//Where every place on the strip sat when the drag began, by rank. See measureSlots.
		slotBoxArray: null,
		//The place last previewed, so the strip only rearranges when the answer changes.
		previewRank: undefined,
	};
	element.addEventListener("pointermove", honeycomb.teambuilding.onDragPointerMove);
	element.addEventListener("pointerup", honeycomb.teambuilding.onDragPointerUp);
	element.addEventListener("pointercancel", honeycomb.teambuilding.onDragPointerCancel);
};

//The browser took the pointer -- a finger swiping the roster to scroll it. That is not a click, so
//nobody is inspected; a drag already under way is simply let go.
honeycomb.teambuilding.onDragPointerCancel = function () {
	honeycomb.teambuilding.endDrag();
};

honeycomb.teambuilding.onDragPointerMove = function (event) {
	var drag = honeycomb.teambuilding.drag;
	if (drag == null) return;
	var distance = Math.max(Math.abs(event.clientX - drag.startX), Math.abs(event.clientY - drag.startY));
	if (drag.committed == false) {
		if (distance < honeycomb.tuning.ui.teamDragThresholdPixels) return;
		drag.committed = true;
		drag.ghost = honeycomb.teambuilding.newGhost(drag.characterIndex);
		//Every place is measured ONCE, before anything slides: a slot that has already moved aside would
		//otherwise report where it was pushed to, and the next preview would push it from there.
		drag.slotBoxArray = honeycomb.teambuilding.measureSlots();
		honeycomb.platform.sound("cardPickUp");
	}
	if (drag.ghost != null) {
		drag.ghost.style.left = Math.round(event.clientX) + "px";
		drag.ghost.style.top = Math.round(event.clientY) + "px";
	}
	var rank = honeycomb.teambuilding.dropRankAt(event.clientX, event.clientY);
	if (rank !== drag.previewRank) {
		drag.previewRank = rank;
		honeycomb.teambuilding.previewDrop(rank);
	}
};

honeycomb.teambuilding.onDragPointerUp = function (event) {
	var drag = honeycomb.teambuilding.drag;
	if (drag == null) return;
	var committed = drag.committed;
	var rank = committed ? honeycomb.teambuilding.dropRankAt(event.clientX, event.clientY) : null;
	var characterIndex = drag.characterIndex;
	var fromParty = drag.fromParty;
	honeycomb.teambuilding.endDrag();

	if (committed == false) {
		//A click: roster rows and party portraits both inspect, as they always did.
		honeycomb.teambuilding.inspect(characterIndex);
		return;
	}
	if (rank != null) { honeycomb.teambuilding.placeMember(characterIndex, rank); return; }
	//Dropped anywhere but the strip: a member leaves the party, a roster entry was simply let go.
	if (fromParty == true) honeycomb.teambuilding.toggleMember(characterIndex);
};

honeycomb.teambuilding.endDrag = function () {
	var drag = honeycomb.teambuilding.drag;
	if (drag == null) return;
	var element = drag.element;
	element.removeEventListener("pointermove", honeycomb.teambuilding.onDragPointerMove);
	element.removeEventListener("pointerup", honeycomb.teambuilding.onDragPointerUp);
	element.removeEventListener("pointercancel", honeycomb.teambuilding.onDragPointerCancel);
	if (element.hasPointerCapture != null && element.hasPointerCapture(drag.pointerId)) element.releasePointerCapture(drag.pointerId);
	if (drag.ghost != null && drag.ghost.parentNode != null) drag.ghost.parentNode.removeChild(drag.ghost);
	honeycomb.teambuilding.drag = null;
	honeycomb.teambuilding.clearDropPreview();
};

//The portrait that follows the pointer. Hung on the root so no panel clips it.
honeycomb.teambuilding.newGhost = function (characterIndex) {
	var root = honeycomb.rootElement();
	if (root == null) return null;
	var selection = honeycomb.teambuilding.findSelection(characterIndex);
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	var ghost = document.createElement("div");
	ghost.className = "hcTeamDragGhost";
	ghost.innerHTML = honeycomb.ui.portrait({
		characterIndex: characterIndex,
		outfitIndex: selection == null ? definition.defaultOutfit : selection.outfitIndex,
		downed: false,
	}, {});
	root.appendChild(ghost);
	return ghost;
};

//Which place in the party a point would drop into, or null when it is not over the strip. The nearest
//slot wins, so a drop between two portraits lands where the player is pointing rather than failing.
honeycomb.teambuilding.dropRankAt = function (clientX, clientY) {
	var strip = document.getElementById("honeycombPartyStrip");
	if (strip == null) return null;
	var box = strip.getBoundingClientRect();
	var margin = honeycomb.tuning.ui.teamDropMarginPixels;
	if (clientY < box.top - margin || clientY > box.bottom + margin) return null;
	if (clientX < box.left - margin || clientX > box.right + margin) return null;

	//Measured from where each place stood when the drag began, not where it has slid to: a place that
	//moved aside to make room must not then attract the drop, or the preview would chase itself.
	var drag = honeycomb.teambuilding.drag;
	var boxArray = drag != null && drag.slotBoxArray != null ? drag.slotBoxArray : honeycomb.teambuilding.measureSlots();
	var bestRank = null;
	var bestDistance = Infinity;
	for (var rank = 0; rank < boxArray.length; rank++) {
		var slotBox = boxArray[rank];
		if (slotBox == null || slotBox.locked == true) continue;
		var distance = Math.abs(clientX - (slotBox.left + slotBox.width / 2));
		if (distance < bestDistance) { bestDistance = distance; bestRank = rank; }
	}
	return bestRank;
};

//Every place on the strip, by rank, as it sits before anything moves.
honeycomb.teambuilding.measureSlots = function () {
	var result = [];
	var strip = document.getElementById("honeycombPartyStrip");
	if (strip == null) return result;
	var slotArray = strip.querySelectorAll("[data-hcRank]");
	for (var scanIndex = 0; scanIndex < slotArray.length; scanIndex++) {
		var box = slotArray[scanIndex].getBoundingClientRect();
		result[parseInt(slotArray[scanIndex].dataset.hcrank, 10)] = {
			left: box.left, top: box.top, width: box.width,
			locked: slotArray[scanIndex].classList.contains("hcLocked"),
		};
	}
	return result;
};

//THE PARTY MAKES ROOM. While a character is held over the strip, everyone slides to where they would
//stand if the drop happened now, leaving a gap exactly where the held character would go -- the same
//preview the battlefield gives a held card that moves its owner.
//
//It is computed rather than guessed: the order the drop WOULD produce is built from the real selection
//(the same rule placeMember applies), and each portrait is slid from its own place to its new one.
//The gap is marked by whatever is left standing in it -- the held member's own faded portrait when
//they came from the strip, or the first empty place when they came from the roster.
//
//Slides use `translate`, never `transform`, so nothing here can fight the portrait's own styling.
honeycomb.teambuilding.previewDrop = function (rank) {
	var drag = honeycomb.teambuilding.drag;
	var strip = document.getElementById("honeycombPartyStrip");
	if (drag == null || strip == null || drag.slotBoxArray == null) return;
	var boxArray = drag.slotBoxArray;

	var selectionArray = honeycomb.teambuilding.selectionArray();
	//A full party refuses a newcomer, so nobody makes room for one.
	var accepted = rank != null && (drag.fromParty == true ||
		selectionArray.length < honeycomb.teambuilding.partySizeMaximum());
	var orderArray = [];
	for (var scanIndex = 0; scanIndex < selectionArray.length; scanIndex++) {
		//Off the strip, nobody closes ranks: the held member stays in their place, faded, which says
		//"let go here and they leave" without the others sliding under them.
		if (accepted == true && selectionArray[scanIndex].characterIndex == drag.characterIndex) continue;
		orderArray.push(selectionArray[scanIndex].characterIndex);
	}
	var landing = null;
	if (accepted == true) {
		landing = Math.max(0, Math.min(rank, orderArray.length));
		orderArray.splice(landing, 0, drag.characterIndex);
	}

	var slide = function (element, fromRank, toRank) {
		var from = boxArray[fromRank];
		var to = boxArray[toRank];
		if (from == null || to == null || fromRank === toRank) { element.style.translate = ""; return; }
		element.style.translate = Math.round(to.left - from.left) + "px " + Math.round(to.top - from.top) + "px";
	};

	var memberArray = strip.querySelectorAll(".hcPartySlot[data-hcRank]");
	for (var memberIndex = 0; memberIndex < memberArray.length; memberIndex++) {
		var element = memberArray[memberIndex];
		var ownRank = parseInt(element.dataset.hcrank, 10);
		var isHeld = element.dataset.hccharacter == drag.characterIndex;
		var newRank = orderArray.indexOf(element.dataset.hccharacter);
		element.classList.toggle("hcDragSource", isHeld);
		element.classList.toggle("hcDropHere", isHeld && landing != null);
		//A held member with nowhere to land stays where they were, faded: dropping now takes them off.
		slide(element, ownRank, newRank < 0 ? ownRank : newRank);
	}

	//A newcomer's gap is marked by the first empty place, carried to where they would stand.
	var firstEmpty = strip.querySelector(".hcPartySlotEmpty[data-hcRank]");
	if (firstEmpty != null) {
		var emptyRank = parseInt(firstEmpty.dataset.hcrank, 10);
		var markGap = drag.fromParty == false && landing != null;
		firstEmpty.classList.toggle("hcDropHere", markGap);
		slide(firstEmpty, emptyRank, markGap ? landing : emptyRank);
	}
};

//Everyone back where the real order puts them. Called when a drag ends, whatever it did.
honeycomb.teambuilding.clearDropPreview = function () {
	var strip = document.getElementById("honeycombPartyStrip");
	if (strip == null) return;
	var slotArray = strip.querySelectorAll("[data-hcRank]");
	for (var scanIndex = 0; scanIndex < slotArray.length; scanIndex++) {
		slotArray[scanIndex].style.translate = "";
		slotArray[scanIndex].classList.remove("hcDropHere");
		slotArray[scanIndex].classList.remove("hcDragSource");
	}
};

//Puts a character at a place in the party: moves them if they are already in it, adds them if not
//(when there is room). A place past the end of the party means "at the back".
honeycomb.teambuilding.placeMember = function (characterIndex, rank) {
	var selectionArray = honeycomb.teambuilding.selectionArray();
	var existing = honeycomb.teambuilding.findSelection(characterIndex);
	if (existing == null) {
		if (selectionArray.length >= honeycomb.teambuilding.partySizeMaximum() || honeycomb.teambuilding.joinRefused(characterIndex)) {
			honeycomb.platform.sound("uiBack");
			return;
		}
		if (honeycomb.findDefinition(honeycomb.characterArray, characterIndex) == null) return;
		existing = honeycomb.equipment.loadoutForJoining(characterIndex, selectionArray);
	} else {
		selectionArray.splice(selectionArray.indexOf(existing), 1);
	}
	selectionArray.splice(Math.max(0, Math.min(rank, selectionArray.length)), 0, existing);
	honeycomb.teambuilding.inspectedCharacterIndex = characterIndex;
	honeycomb.platform.sound("uiClick");
	honeycomb.scene.refresh();
};

//Picks a sensible opening team: the first unlocked characters, up to the configured starting size.
honeycomb.teambuilding.fillDefaultParty = function () {
	var selectionArray = honeycomb.teambuilding.selectionArray();
	var unlockedArray = honeycomb.state.profile.unlockedCharacterArray;
	//Content-table order, so a freshly-filled party is the same roster order the column shows (above).
	for (var scanIndex = 0; scanIndex < honeycomb.characterArray.length; scanIndex++) {
		if (selectionArray.length >= honeycomb.tuning.run.partySizeStarting) break;
		var definition = honeycomb.characterArray[scanIndex];
		if (unlockedArray.indexOf(definition.index) < 0) continue;
		if (honeycomb.teambuilding.joinRefused(definition.index)) continue;
		selectionArray.push(honeycomb.equipment.loadoutForJoining(definition.index, selectionArray));
	}
};

//--- Column 1: roster -------------------------------------------------------------------------------
honeycomb.teambuilding.buildRosterColumn = function () {
	var unlockedArray = honeycomb.state.profile.unlockedCharacterArray;
	var markup = '<div class="hcTeamRoster hcPanel hcScroll">';
	markup += '<div class="hcPanelTitle">Roster</div>';

	//Roster order is the content table's, not the save's. Rendering the profile's unlocked list directly
	//would let save history decide the order, since reconcileContent appends a character added after the
	//profile was made, pushing them to the bottom of every old profile. Reading characterArray order and
	//filtering by unlocked keeps the roster stable for every save.
	//A character still in development is not part of the roster at all -- not as an entry, and not as one
	//of the locked slots counted below. Reading the filtered roster rather than characterArray keeps them
	//out of both.
	var rosterArray = honeycomb.shippedCharacterArray();
	var shownCount = 0;
	for (var scanIndex = 0; scanIndex < rosterArray.length; scanIndex++) {
		var definition = rosterArray[scanIndex];
		if (unlockedArray.indexOf(definition.index) < 0) continue;
		shownCount += 1;
		markup += honeycomb.teambuilding.buildRosterEntry(definition);
	}

	//Locked slots are shown rather than hidden, so the roster reads as something that grows.
	var lockedCount = rosterArray.length - shownCount;
	for (var lockIndex = 0; lockIndex < lockedCount; lockIndex++) {
		markup += '<div class="hcRosterEntry hcLocked">' +
			'<div class="hcPortrait">' + honeycomb.ui.iconTag(null, "question", "#4b3d5c", { style: "width:100%;height:100%" }) + "</div>" +
			'<div class="hcGrow"><div class="hcRosterName hcDim">???</div>' +
			'<div class="hcTiny hcDim">Not yet found</div></div></div>';
	}

	markup += "</div>";
	return markup;
};

honeycomb.teambuilding.buildRosterEntry = function (definition) {
	var selected = honeycomb.teambuilding.isSelected(definition.index);
	var inspected = honeycomb.teambuilding.inspectedCharacterIndex == definition.index;
	var selection = honeycomb.teambuilding.findSelection(definition.index);

	var classList = "hcRosterEntry";
	if (selected) classList += " hcOnTeam";
	if (inspected) classList += " hcInspected";
	//The roster glows: a subtle pink for a Rank Up Notification, an animated one for Event Ready. Drawn
	//as a shadow, so it moves nothing and covers nothing.
	var lustState = honeycomb.lustEvents == null ? null : honeycomb.lustEvents.characterState(definition.index);
	if (lustState == "rankUp") classList += " hcLustRankUp";
	if (lustState == "eventReady") classList += " hcLustEventReady";

	var previewSelection = honeycomb.teambuilding.effectiveLoadout(definition.index);

	//No onclick: a press here may become a DRAG onto the party strip, so the pointer handlers decide
	//which it was and inspect on a plain click. See honeycomb.teambuilding.onDragPointerUp.
	var markup = '<div class="' + classList + '" style="--hcAccent:' + definition.colorHint + '"' +
		' data-hcCharacter="' + honeycomb.escapeAttribute(definition.index) + '"' +
		' title="Drag onto the party strip to place ' + honeycomb.escapeAttribute(definition.name) + '">';
	markup += honeycomb.ui.portrait(
		{ characterIndex: definition.index, outfitIndex: previewSelection.outfitIndex, downed: false },
		{ selected: inspected });
	markup += '<div class="hcGrow">';
	markup += '<div class="hcRosterName">' + honeycomb.escapeText(definition.name) + "</div>";
	//The roster prints the worn outfit, not the class: the default outfit shows the class name, any
	//other outfit its own, so the line always says what the character will actually wear.
	markup += '<div class="hcTiny hcRosterClass">' +
		honeycomb.ui.iconTag(definition.classIconPath, "star", definition.colorHint, { className: "hcInlineIcon" }) +
		" " + honeycomb.escapeText(honeycomb.teambuilding.outfitDisplayName(definition, previewSelection.outfitIndex)) + "</div>";
	//How much of their tree is bought, rather than a level: there are no levels any more.
	var takenCount = honeycomb.progression.selectionArray(definition.index).length;
	markup += '<div class="hcTiny hcDim">' +
		honeycomb.previewMaximumHealth(previewSelection) + " HP" +
		(takenCount === 0 ? "" : " &middot; " + takenCount + " chosen") + "</div>";
	markup += "</div>";
	//Event Ready replaces the toggle with a heart: pressing it opens the panel that says why, with a
	//button for each waiting event. `hcTeamToggle` still, so a press on it is never a drag.
	if (lustState == "eventReady") {
		markup += '<div class="hcTeamToggle hcLustHeart"' +
			honeycomb.tooltip.attributes("lustEventGate", definition.index) +
			' onclick="event.stopPropagation();honeycomb.tooltip.showInteractive(this,\'lustEventGate\',\'' + definition.index + '\')">' +
			honeycomb.ui.iconTag(honeycomb.tuning.art.nameplate.lustIconPath, "heart", "#ff78c8", { className: "hcLustHeartIcon" }) +
			"</div>";
		markup += "</div>";
		return markup;
	}
	//Stop the toggle from also firing the inspect handler on the row behind it.
	markup += '<div class="hcTeamToggle' + (selected ? " hcOn" : "") + '"' +
		' onclick="event.stopPropagation();honeycomb.teambuilding.toggleMember(\'' + definition.index + '\')"' +
		' title="' + (selected ? "Remove from party" : "Add to party") + '">' +
		(selected ? "&#10003;" : "+") + "</div>";
	markup += "</div>";
	return markup;
};

//--- Column 2: portrait -----------------------------------------------------------------------------
honeycomb.teambuilding.buildPortraitColumn = function () {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, honeycomb.teambuilding.inspectedCharacterIndex);
	if (definition == null) return '<div class="hcTeamPortrait"></div>';

	var outfitIndex = honeycomb.teambuilding.loadoutFor(definition.index).outfitIndex;

	//Standing art comes from the art resolver, so the roster shows the same sprite combat will. The
	//entity shape is faked because no run exists yet -- the resolver only needs side and identity.
	var previewEntity = { side: "ally", characterIndex: definition.index, outfitIndex: outfitIndex,
		health: 1, maxHealth: 1, temporaryHealth: 0, statusArray: [], downed: false };

	var markup = '<div class="hcTeamPortrait" style="--hcAccent:' + definition.colorHint + '">';
	markup += '<div class="hcTeamPortraitGlow"></div>';
	//`2-basic` while a Lust Event is waiting for her, `1-basic` otherwise (honeycomb.art.standingTierFor).
	markup += honeycomb.art.spriteTag(previewEntity, "basic",
		{ className: "hcTeamPortraitArt", alt: definition.name, tier: honeycomb.art.standingTierFor(definition.index) });
	markup += "</div>";
	return markup;
};

//The Event Ready banner: what a locked character is waiting to say, and the button that lets them say
//it. Silent for anyone with an empty queue, so the sheet is unchanged for everybody else.
honeycomb.teambuilding.buildLustEventBanner = function (definition) {
	if (honeycomb.lustEvents == null) return "";
	var queueArray = honeycomb.lustEvents.queueFor(definition.index);
	if (queueArray.length === 0) return "";
	//Locked or not is the row's own call (`locksParty`), and the line has to say which, because one of
	//them is a reason the character is missing from the party strip and the other is not.
	var locked = honeycomb.lustEvents.blocksParty(definition.index);
	var markup = '<div class="hcLustBanner">';
	markup += '<div class="hcLustBannerHead">' +
		honeycomb.ui.iconTag(honeycomb.tuning.art.nameplate.lustIconPath, "heart", "#ff78c8", { className: "hcLustBannerIcon" }) +
		'<span class="hcLustText">' + honeycomb.escapeText(honeycomb.tooltip.text("lustEventGate.aside")) + "</span></div>";
	markup += '<div class="hcTiny hcLustBannerBody">' +
		honeycomb.tooltip.html(locked ? "lustEventGate.body" : "lustEventGate.bodyUnlocked", { name: definition.name }) + "</div>";
	markup += honeycomb.tooltip.lustEventLaunchMarkup(definition.index);
	return markup + "</div>";
};

//--- Column 3: stats and starting deck --------------------------------------------------------------
honeycomb.teambuilding.buildDetailColumn = function () {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, honeycomb.teambuilding.inspectedCharacterIndex);
	if (definition == null) return '<div class="hcTeamDetail hcPanel"></div>';

	//Previewed from the equipment that COUNTS, so a greyed piece shows no health or cards it will not give.
	var previewSelection = honeycomb.teambuilding.effectiveLoadout(definition.index);

	var markup = '<div class="hcTeamDetail hcPanel hcScroll" data-hcScrollKey="detail-' +
		honeycomb.escapeAttribute(definition.index) + '" style="--hcAccent:' + definition.colorHint + '">';

	markup += '<div class="hcDetailHeader">';
	markup += '<div class="hcDetailName">' + honeycomb.escapeText(definition.name) + "</div>";
	markup += '<div class="hcDetailClass">' +
		honeycomb.ui.iconTag(definition.classIconPath, "star", definition.colorHint, { className: "hcInlineIcon" }) +
		" " + honeycomb.escapeText(honeycomb.teambuilding.outfitDisplayName(definition, previewSelection.outfitIndex)) + "</div>";
	markup += "</div>";

	markup += '<div class="hcDetailBlurb">' + honeycomb.escapeText(definition.description) + "</div>";

	//The Event Ready banner. A queue row's requirement can be anything, so the trigger belongs to the
	//character rather than the weakness rail. This is that trigger on the sheet -- the roster entry's
	//heart is the same one, and both play the head of the same queue.
	markup += honeycomb.teambuilding.buildLustEventBanner(definition);

	//A loadout change that refunded progression says so here, rather than leaving the player to notice
	//the experience number moved on its own.
	if (honeycomb.teambuilding.noticeText != null) {
		markup += '<div class="hcTreeNotice">' + honeycomb.escapeText(honeycomb.teambuilding.noticeText) + "</div>";
	}

	//Tags are resolved from the selection, not the definition, so an outfit that changes what a
	//character IS shows the change the moment it is toggled.
	markup += honeycomb.ui.tagRow(honeycomb.memberTagArray(previewSelection), { className: "hcDetailTags" });

	//Stat tiles. Values are previewed from the selection, so outfit and equipment show through. The
	//card count is not a tile: it lives beside Contributed Cards, the list it is counting.
	var outfitProgress = honeycomb.unlocks.progress("outfit", definition.index);
	//Heirlooms only: counting every piece in the game would read as "5/7 unlocked" beside a character who
	//could wear three of them; this character's own pieces are the collection that is theirs. Generic
	//gear keeps its count in the Equipment tab.
	var heirloomProgress = honeycomb.equipment.progressFor(definition.index, true);
	markup += '<div class="hcStatTileRow">';
	markup += honeycomb.teambuilding.buildStatTile("heart", "#d3455f", "HP",
		String(honeycomb.previewMaximumHealth(previewSelection)));
	markup += honeycomb.teambuilding.buildStatTile("bag", "#c9a961", "Outfits",
		outfitProgress.found + "/" + outfitProgress.total);
	markup += honeycomb.teambuilding.buildStatTile("shield", "#9c8fae", "Heirlooms",
		heirloomProgress.found + "/" + heirloomProgress.total);
	markup += "</div>";

	//The between-run weakness ledger, read out tag by tag, so a player can see why Brienne keeps folding
	//to the same kind of attack and bench her for a run -- which is the whole point of the mechanic.
	//Silent for a character nobody has managed to hurt yet.
	markup += honeycomb.teambuilding.buildWeaknessSection(definition.index);

	//What they are wearing. The relic is equipment now, so it is covered here rather than a separate section.
	markup += honeycomb.teambuilding.buildWornSection(definition.index);

	//Abilities: the character's own spells, previewed the same way their cards are. Shown before the
	//deck because they are the part of a character the deck cannot express.
	var abilityIndexArray = honeycomb.abilities.indexArray(previewSelection);
	if (abilityIndexArray.length > 0) {
		markup += honeycomb.teambuilding.sectionStart("abilities", "Abilities", false);
		markup += honeycomb.teambuilding.sectionBody();
		for (var abilityIndex = 0; abilityIndex < abilityIndexArray.length; abilityIndex++) {
			//As this character holds it, after any training wheel.
			var ability = honeycomb.abilities.definitionFor(previewSelection, abilityIndexArray[abilityIndex]);
			if (ability == null) continue;
			//What it needs, in words: the ability menu lists the requirements ticked or crossed, and the
			//sheet gives them here too, so a spell does not read like it always works.
			var requirementLine = honeycomb.abilities.requirementLine(ability);
			markup += '<div class="hcRelicRow">' +
				honeycomb.ui.iconTag(ability.iconPath, "shard", "#c9a961", { className: "hcRelicIcon" }) +
				'<div class="hcGrow"><div class="hcGold">' + honeycomb.escapeText(ability.name) +
				' <span class="hcTiny hcDim">' + ability.chargeMaximum + " charge" +
				(ability.chargeMaximum === 1 ? "" : "s") + "</span></div>" +
				'<div class="hcTiny hcMuted">' + honeycomb.escapeText(honeycomb.abilities.text(ability)) +
				"</div>" +
				(requirementLine === "" ? "" : '<div class="hcTiny hcDim">' +
					honeycomb.escapeText(requirementLine) + "</div>") +
				"</div></div>";
		}
		markup += honeycomb.teambuilding.sectionEnd();
	}

	//This character's own contribution, with a toggle between the compact list and rendered cards.
	//The list is the faster read; the cards are the one that answers "what does that actually do".
	markup += honeycomb.teambuilding.sectionStart("contributed",
		'Contributed Cards <span class="hcCountBadge">' +
			honeycomb.teambuilding.previewCardCount(previewSelection) + "</span>", false);
	markup += '<div class="hcSegmented hcTiny">';
	for (var viewIndex = 0; viewIndex < honeycomb.teambuilding.contributedViewArray.length; viewIndex++) {
		var view = honeycomb.teambuilding.contributedViewArray[viewIndex];
		markup += '<div class="hcSegment' +
			(honeycomb.teambuilding.contributedView == view.index ? " hcOn" : "") + '"' +
			' onclick="honeycomb.teambuilding.setContributedView(\'' + view.index + '\')">' +
			honeycomb.escapeText(view.name) + "</div>";
	}
	markup += "</div>";
	markup += honeycomb.teambuilding.sectionBody();
	markup += honeycomb.teambuilding.buildContributedCards(previewSelection);
	markup += honeycomb.teambuilding.sectionEnd();

	markup += "</div>";
	return markup;
};

//The pieces a character wears, in the order they went on, with the party's capacity beside the title.
//Pieces past the capacity are greyed and say why. Clicking one opens the Equipment tab.
//
//The weakness ledger is printed one row per tag, worst first, with the rank it has reached, what that
//rank costs, and how far the next one is. A tag at rank 0 is still listed once it has any exposure at
//all, because watching it climb toward the first step is the warning.
//Each category folds to its title, so a long sheet can be collapsed to the parts being read. The fold
//state is session-level, keyed by section index, so a scene rebuild keeps whatever the player folded.
//A section whose title carries `hcFoldGlow` pulses while folded -- the Weaknesses title does, when the
//character has a Rank Up Notification or an Event Ready, so a folded sheet cannot hide the news.
honeycomb.teambuilding.foldedSectionArray = {};

honeycomb.teambuilding.sectionFolded = function (sectionIndex) {
	return honeycomb.teambuilding.foldedSectionArray[sectionIndex] == true;
};

honeycomb.teambuilding.toggleSection = function (sectionIndex) {
	if (honeycomb.teambuilding.sectionFolded(sectionIndex) == true) delete honeycomb.teambuilding.foldedSectionArray[sectionIndex];
	else honeycomb.teambuilding.foldedSectionArray[sectionIndex] = true;
	honeycomb.scene.refresh();
};

//The opening of a foldable detail section: the title row, with the fold toggle as its own block so a
//caller can put other controls beside it. Call sectionBody() once those are appended, and sectionEnd()
//when the content is done.
honeycomb.teambuilding.sectionStart = function (sectionIndex, titleMarkup, glow) {
	var folded = honeycomb.teambuilding.sectionFolded(sectionIndex);
	return '<div class="hcDetailSection' + (folded ? " hcFolded" : "") + '">' +
		'<div class="hcSectionTitleRow">' +
		'<div class="hcSectionTitle hcGrow hcFoldable' + (glow == true ? " hcFoldGlow" : "") + '"' +
		' onclick="honeycomb.teambuilding.toggleSection(\'' + honeycomb.escapeAttribute(sectionIndex) + '\')">' +
		'<span class="hcFoldChevron">' + (folded ? "\u25B8" : "\u25BE") + "</span>" +
		'<span class="hcFoldLabel">' + titleMarkup + "</span></div>";
};

honeycomb.teambuilding.sectionBody = function () {
	return '</div><div class="hcSectionBody">';
};

honeycomb.teambuilding.sectionEnd = function () {
	return "</div></div>";
};

honeycomb.teambuilding.buildWeaknessSection = function (characterIndex, options) {	if (honeycomb.lust == null) return "";
	//Read-only, for the party window: the plain tooltip key means seeing a row never clears a Rank Up
	//Notification and never draws an Event Ready! button, and the bench counter and its Reset button are
	//for the teambuilding sheet alone.
	var readOnly = options != null && options.readOnly == true;
	var summaryArray = honeycomb.lust.exposureSummaryArray(characterIndex);
	if (summaryArray.length === 0) return "";

	//The folded title glows while there is news: a Rank Up Notification pulses the Weaknesses title, so
	//folding it away cannot hide one. An Event Ready is not news for this section -- it has its own
	//banner above, which folding cannot reach.
	var foldGlow = readOnly != true && honeycomb.lustEvents != null &&
		honeycomb.lustEvents.hasNotification(characterIndex);
	var markup = honeycomb.teambuilding.sectionStart("weaknesses", "Weaknesses", foldGlow);
	markup += honeycomb.teambuilding.sectionBody();
	markup += '<div class="hcTiny hcMuted hcWeaknessNote">What has been putting Lust on them, across every ' +
		"run. Each rank makes that kind of attack land harder. Slowly reduces to the rank floor when not in party.</div>";
	//The bench counter: how many days sitting out before every tag is at its floor, and beside it the
	//experience that skips the wait. Teambuilding only.
	var benchDays = readOnly ? null : honeycomb.lust.characterBenchDaysToFloor(characterIndex);
	if (benchDays != null) {
		markup += '<div class="hcWeaknessBenchRow">';
		markup += '<div class="hcTiny hcWeaknessBench hcGrow"' + honeycomb.tooltip.attributes("weaknessBench", characterIndex) + ">" +
			(benchDays === 0 ? '<span class="hcDim">At the rank floor.</span>'
				: '<span class="hcWeaknessBenchCount">' + benchDays + "</span> " + (benchDays == 1 ? "day" : "days") +
					" on the bench to reach the rank floor") + "</div>";
		var resetCost = honeycomb.lust.floorResetCost(characterIndex);
		if (resetCost > 0) {
			var resetRefusal = honeycomb.lust.floorResetRefusal(characterIndex);
			markup += '<div class="hcButton hcTiny hcWeaknessReset' + (resetRefusal == null ? "" : " hcDisabled") + '"' +
				honeycomb.tooltip.attributes("weaknessReset", characterIndex) +
				' onclick="honeycomb.teambuilding.confirmWeaknessReset(\'' + characterIndex + '\')">Reset · ' +
				resetCost + " EXP</div>";
		}
		markup += "</div>";
	}
	for (var scanIndex = 0; scanIndex < summaryArray.length; scanIndex++) {
		var entry = summaryArray[scanIndex];
		var tagName = honeycomb.tagName(entry.tag);
		var cardTag = honeycomb.findDefinition(honeycomb.cardTagArray, entry.tag);
		if (cardTag != null) tagName = cardTag.name;
		var color = cardTag != null ? cardTag.color : honeycomb.tagColor(entry.tag);

		//The row explains itself: keyed character/tag so the panel can name what this character in
		//particular has been taking, rather than only what the tag means.
		//Two lines, not four columns. The rail has to be wide enough that the steps on it can be told
		//apart, and the character sheet's middle panel is narrow, so the name and the rank share a line
		//above it and the rail gets the full width underneath.
		//A row near its next rank glows, brighter the nearer it is. The glow is an opacity on a layer
		//drawn behind the row, so it never moves anything around it.
		var glow = honeycomb.lust.nearRankGlow(entry.exposure);
		//A weakness that ranked up glows harder than "nearly there". Seeing the row clears it (the
		//tooltip's onShow, which the "sheet" key allows). A row is never Event Ready: a queue row need
		//not be about a weakness, so the scene is started from the banner above and the roster's heart
		//instead.
		var tagState = honeycomb.lustEvents == null ? null : honeycomb.lustEvents.tagState(characterIndex, entry.tag);
		//The "/sheet" suffix is what lets SEEING the row clear its notification; anywhere else reads only.
		var tipKey = characterIndex + "/" + entry.tag + (readOnly ? "" : "/sheet");
		markup += '<div class="hcWeaknessRow' + (glow > 0 ? " hcNearRank" : "") +
			(tagState == "rankUp" ? " hcWeaknessRankUp" : "") +
			'" style="--hcWeaknessColor:' + color + ";--hcWeaknessNear:" + glow.toFixed(3) + '"' +
			' data-hcWeaknessTag="' + honeycomb.escapeAttribute(entry.tag) + '"' +
			honeycomb.tooltip.attributes("weakness", tipKey) +
			' onclick="honeycomb.tooltip.showInteractive(this,\'weakness\',\'' + honeycomb.escapeAttribute(tipKey) + '\')">';
		markup += '<div class="hcWeaknessHead">';
		markup += '<span class="hcWeaknessName">' + honeycomb.escapeText(tagName) + "</span>";
		markup += '<span class="hcWeaknessRank">' +
			(entry.rank === 0 ? '<span class="hcMuted">No rank</span>'
				: honeycomb.escapeText(entry.rankName) + ' <span class="hcTiny hcDim">×' +
					honeycomb.ui.trimNumber(entry.multiplier) + "</span>") +
		"</span></div>";
		//The steps that form the ranks: the whole climb, every threshold notched at its real position,
		//shared with the panel over a fighter while a Lewd card is read. What is left to the next rank is
		//in the row's tooltip.
		markup += honeycomb.ui.weaknessRail(entry, null);
		markup += "</div>";
	}
	markup += honeycomb.teambuilding.sectionEnd();
	return markup;
};

//A weakness seen on the sheet clears its Rank Up Notification and takes the glow off in place: a
//rebuild here would destroy the row the pointer is on, and the panel with it. The roster entry loses
//its glow only when the character has no notification left.
honeycomb.teambuilding.noticeWeakness = function (characterIndex, tagIndex) {
	if (honeycomb.lustEvents == null || honeycomb.lustEvents.noticeTag(characterIndex, tagIndex) == false) return false;
	var root = honeycomb.rootElement();
	if (root != null) {
		var rowArray = root.querySelectorAll(".hcWeaknessRow[data-hcWeaknessTag]");
		for (var rowIndex = 0; rowIndex < rowArray.length; rowIndex++) {
			if (rowArray[rowIndex].dataset.hcweaknesstag == tagIndex) rowArray[rowIndex].classList.remove("hcWeaknessRankUp");
		}
		var entry = root.querySelector('.hcRosterEntry[data-hcCharacter="' + characterIndex + '"]');
		if (entry != null && honeycomb.lustEvents.characterState(characterIndex) != "rankUp") entry.classList.remove("hcLustRankUp");
	}
	honeycomb.save.autosave("weaknessSeen");
	return true;
};

//Pays a character's weaknesses down to their rank floors. Experience is spent, so it asks first; a
//refused press says why instead.
honeycomb.teambuilding.confirmWeaknessReset = function (characterIndex) {
	//A refused press does nothing: the button is greyed and its tooltip already says why.
	if (honeycomb.lust.floorResetRefusal(characterIndex) != null) return;
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	honeycomb.overlay.open("confirm", {
		title: "Reset " + (definition == null ? "their" : definition.name + "'s") + " weaknesses?",
		body: "Spends " + honeycomb.lust.floorResetCost(characterIndex) + " of their personal EXP. Every weakness " +
			"drops to the start of the rank it has reached. No rank is lost.",
		confirmLabel: "Reset",
		cancelLabel: "Keep the EXP",
		onConfirm: "honeycomb.teambuilding.resetWeaknesses('" + characterIndex + "')",
	});
};

honeycomb.teambuilding.resetWeaknesses = function (characterIndex) {
	honeycomb.overlay.closeAll();
	if (honeycomb.lust.resetToFloor(characterIndex) != null) return;
	honeycomb.platform.sound("weaknessReset");
	honeycomb.save.autosave("weaknessReset");
	honeycomb.scene.refresh();
};

honeycomb.teambuilding.buildWornSection = function (characterIndex) {
	var loadout = honeycomb.teambuilding.loadoutFor(characterIndex);
	var partySize = honeycomb.teambuilding.selectionArray().length;
	var activeArray = honeycomb.equipment.activeArray(loadout.equipmentArray, partySize);
	var capacity = honeycomb.equipment.capacity(partySize);

	//The badge explains itself on hover: why this number, and what a smaller party allows.
	var markup = honeycomb.teambuilding.sectionStart("equipment",
		'Equipment <span class="hcCountBadge hcHelpText' +
			(loadout.equipmentArray.length > capacity ? " hcOver" : "") + '"' +
			honeycomb.tooltip.attributes("equipmentCapacity", partySize) + ">" +
			loadout.equipmentArray.length + " / " + capacity + "</span>", false);
	markup += honeycomb.teambuilding.sectionBody();
	if (loadout.equipmentArray.length === 0) {
		markup += '<div class="hcTiny hcDim">Nothing worn.</div>';
	}
	for (var wornIndex = 0; wornIndex < loadout.equipmentArray.length; wornIndex++) {
		var equipment = honeycomb.findDefinition(honeycomb.equipmentArray, loadout.equipmentArray[wornIndex]);
		if (equipment == null) continue;
		var active = activeArray.indexOf(equipment.index) >= 0;
		markup += '<div class="hcRelicRow hcWornRow' + (active ? "" : " hcInactive") + '"' +
			honeycomb.tooltip.attributes("equipment", equipment.index, { inactive: active ? 0 : 1 }) +
			' onclick="honeycomb.teambuilding.setTab(\'equipment\')">' +
			honeycomb.ui.itemPlate(equipment.iconPath, "shield", honeycomb.teambuilding.rarityColor(equipment)) +
			'<div class="hcGrow"><div class="hcGold">' + honeycomb.escapeText(equipment.name) + "</div>" +
			'<div class="hcTiny hcMuted">' + honeycomb.escapeText(active ? equipment.description : honeycomb.tooltip.text("equipment.overCapacity")) +
			"</div></div></div>";
	}
	markup += honeycomb.teambuilding.sectionEnd();
	return markup;
};

honeycomb.teambuilding.rarityColor = function (equipment) {
	var rarity = equipment == null ? null : honeycomb.findDefinition(honeycomb.equipmentRarityArray, equipment.rarity);
	return rarity == null ? "#9c8fae" : rarity.color;
};

honeycomb.teambuilding.setContributedView = function (viewIndex) {
	honeycomb.teambuilding.contributedView = viewIndex;
	honeycomb.platform.sound("uiClick");
	honeycomb.scene.refresh();
};

//The pool is rebuilt from scratch on every repaint, so this always agrees with the deck the run would
//actually be dealt. `sourceArray` says WHY a card is here, which matters once outfits and equipment
//start rewriting rows.
honeycomb.teambuilding.buildContributedCards = function (selection) {
	var entryArray = honeycomb.memberCardEntryArray(selection);
	if (honeycomb.teambuilding.contributedView == "detailed") {
		var detailed = '<div class="hcContributedGrid">';
		for (var cardIndex = 0; cardIndex < entryArray.length; cardIndex++) {
			var entry = entryArray[cardIndex];
			var definition = honeycomb.findDefinition(honeycomb.cardArray, entry.cardIndex);
			if (definition == null) continue;
			detailed += '<div class="hcContributedCell">';
			detailed += honeycomb.ui.card(honeycomb.resolveCard({
				instanceId: null, cardIndex: definition.index, ownerInstanceId: null, upgradeLevel: 0,
			}), { size: "small", showAffinity: false, previewCharacterIndex: selection.characterIndex });
			if (entry.count > 1) detailed += '<div class="hcDeckCount">&times;' + entry.count + "</div>";
			detailed += "</div>";
		}
		detailed += "</div>";
		return detailed;
	}

	var markup = '<div class="hcCardList">';
	for (var listIndex = 0; listIndex < entryArray.length; listIndex++) {
		var listEntry = entryArray[listIndex];
		var card = honeycomb.findDefinition(honeycomb.cardArray, listEntry.cardIndex);
		if (card == null) continue;
		var grantedBy = honeycomb.teambuilding.describeCardSources(listEntry);
		markup += '<div class="hcCardListRow"' +
			honeycomb.tooltip.attributes("card", card.index, { character: selection.characterIndex }) + ">" +
			honeycomb.ui.cardTypeIcon(card, "hcInlineIcon") +
			'<span class="hcGrow">' + honeycomb.escapeText(card.name) + "</span>" +
			(grantedBy == "" ? "" : '<span class="hcTiny hcMuted hcNoWrap">' + honeycomb.escapeText(grantedBy) + "</span>") +
			'<span class="hcDim">&times;' + listEntry.count + "</span></div>";
	}
	markup += "</div>";
	return markup;
};

//The progression tree calls this after every change: health, cards and tags on this screen may all
//have moved. The scene rebuilds wholesale, so a refresh is the whole of it.
honeycomb.teambuilding.repaint = function () {
	if (honeycomb.scene.current == "teambuilding") honeycomb.scene.refresh();
};

honeycomb.teambuilding.buildStatTile = function (glyphIndex, color, label, value) {
	return '<div class="hcStatTile">' +
		honeycomb.ui.iconTag(null, glyphIndex, color, { className: "hcStatTileIcon" }) +
		'<div class="hcStatTileValue">' + honeycomb.escapeText(value) + "</div>" +
		'<div class="hcStatTileLabel">' + honeycomb.escapeText(label) + "</div></div>";
};

//Names the outfits and equipment responsible for a card row. The character themself is left out --
//their own cards need no explanation, and naming them on every row would be noise.
honeycomb.teambuilding.describeCardSources = function (entry) {
	if (entry.sourceArray == null) return "";
	var nameArray = [];
	for (var scanIndex = 0; scanIndex < entry.sourceArray.length; scanIndex++) {
		var source = entry.sourceArray[scanIndex];
		if (source.kind == "character") continue;
		if (nameArray.indexOf(source.name) >= 0) continue;
		nameArray.push(source.name);
	}
	return nameArray.join(", ");
};

honeycomb.teambuilding.previewCardCount = function (selection) {
	var entryArray = honeycomb.memberCardEntryArray(selection);
	var total = 0;
	for (var entryIndex = 0; entryIndex < entryArray.length; entryIndex++) total += entryArray[entryIndex].count;
	return total;
};

honeycomb.teambuilding.unlockedOutfitCount = function (definition) {
	var count = 0;
	for (var outfitIndex = 0; outfitIndex < definition.outfitArray.length; outfitIndex++) {
		if (honeycomb.teambuilding.outfitUnlocked(definition, definition.outfitArray[outfitIndex])) count += 1;
	}
	return count;
};

honeycomb.teambuilding.outfitUnlocked = function (definition, outfit) {
	return honeycomb.unlocks.isUnlocked("outfit", outfit.index, definition.index);
};

//--- Column 4: tabs ---------------------------------------------------------------------------------
honeycomb.teambuilding.buildTabColumn = function () {
	var markup = '<div class="hcTeamTabs hcPanel">';

	//A locked tab: one marked `requiresUnlock` stays hidden until the "tab" unlock kind has opened it for
	//this character, which a Lust Event's `unlock` effect can do. Falls back to the first open tab if the
	//one showing is locked for the character now inspected.
	var visibleTabArray = honeycomb.teambuilding.tabArray.filter(function (candidate) {
		return candidate.requiresUnlock != true ||
			honeycomb.unlocks.isUnlocked("tab", candidate.index, honeycomb.teambuilding.inspectedCharacterIndex);
	});
	if (visibleTabArray.length > 0 && visibleTabArray.every(function (candidate) { return candidate.index != honeycomb.teambuilding.activeTab; })) {
		honeycomb.teambuilding.activeTab = visibleTabArray[0].index;
	}
	markup += '<div class="hcTabStrip">';
	for (var tabIndex = 0; tabIndex < visibleTabArray.length; tabIndex++) {
		var tab = visibleTabArray[tabIndex];
		var active = honeycomb.teambuilding.activeTab == tab.index;
		markup += '<div class="hcTab' + (active ? " hcActive" : "") + '"' +
			' onclick="honeycomb.teambuilding.setTab(\'' + tab.index + '\')">' +
			honeycomb.ui.iconTag(null, tab.glyph, active ? "#f0d89a" : "#9c8fae", { className: "hcInlineIcon" }) +
			" " + tab.name + "</div>";
	}
	markup += "</div>";

	//Keyed by tab and character, so a rebuild keeps the scroll of the SAME view and a new view opens
	//at the top. See honeycomb.scene.refresh.
	markup += '<div class="hcTabBody hcScroll" data-hcScrollKey="tab-' + honeycomb.teambuilding.activeTab + "-" +
		honeycomb.escapeAttribute(String(honeycomb.teambuilding.inspectedCharacterIndex)) + '">';
	switch (honeycomb.teambuilding.activeTab) {
		case "outfits": markup += honeycomb.teambuilding.buildOutfitTab(); break;
		case "equipment": markup += honeycomb.teambuilding.buildEquipmentTab(); break;
		case "progression": markup += honeycomb.teambuilding.buildProgressionTab(); break;
		default: markup += "";
	}
	markup += "</div></div>";
	return markup;
};

honeycomb.teambuilding.buildOutfitTab = function () {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, honeycomb.teambuilding.inspectedCharacterIndex);
	if (definition == null) return "";
	var currentIndex = honeycomb.teambuilding.loadoutFor(definition.index).outfitIndex;

	//Tall cards showing the whole body, in a row that scrolls sideways so outfits sit side by side for
	//comparison, each with its rules text always under it. The found count is not repeated here; the
	//Details tab's Outfits tile already carries it.
	var markup = '<div class="hcOutfitRow" data-hcScrollKey="outfits-' + honeycomb.escapeAttribute(definition.index) + '">';
	for (var outfitIndex = 0; outfitIndex < definition.outfitArray.length; outfitIndex++) {
		var outfit = definition.outfitArray[outfitIndex];
		var unlocked = honeycomb.teambuilding.outfitUnlocked(definition, outfit);
		var active = currentIndex == outfit.index;

		var classList = "hcOutfitCard";
		if (active) classList += " hcActive";
		if (unlocked == false) classList += " hcLocked";

		//Hovering shows the card the outfit adds. The signature card is what the outfit costs a deck slot
		//for, so it is readable before the outfit is worn. `data-hccharacter` lets the card wear the right
		//class glyph and face.
		var additionArray = outfit.cardAdditionArray == null ? [] : outfit.cardAdditionArray;
		var hoverAttr = unlocked == true && additionArray.length > 0
			? ' data-hccharacter="' + honeycomb.escapeAttribute(definition.index) + '"' +
				' onmouseenter="honeycomb.tooltip.show(this,\'card\',\'' + honeycomb.escapeAttribute(additionArray[0].index) + '\')"' +
				' onmouseleave="honeycomb.tooltip.hide()"'
			: "";
		markup += '<div class="' + classList + '" data-hcOutfit="' + honeycomb.escapeAttribute(outfit.index) + '"' + hoverAttr +
			(unlocked ? ' onclick="honeycomb.teambuilding.setOutfit(\'' + definition.index + "','" + outfit.index + '\')"' : "") + ">";
		markup += '<div class="hcOutfitArt">';
		markup += unlocked
			? honeycomb.art.spriteTag({ side: "ally", characterIndex: definition.index, outfitIndex: outfit.index, health: 1, maxHealth: 1, statusArray: [] },
				"basic", { state: null, tier: 1, alt: outfit.name })
			: honeycomb.ui.iconTag(null, "question", "#4b3d5c", { style: "width:100%;height:100%" });
		if (active) markup += '<div class="hcOutfitTick">&#10003;</div>';
		markup += "</div>";
		markup += '<div class="hcOutfitName">' + honeycomb.escapeText(unlocked ? outfit.name : "???") + "</div>";
		if (unlocked && outfit.description != null) {
			markup += '<div class="hcOutfitDescription">' + honeycomb.outfitDescriptionMarkup(outfit) + "</div>";
		}
		markup += "</div>";
	}
	markup += "</div>";
	//Below the outfits list: the whole collection, with the rates for the outfit worn now.
	markup += '<div class="hcOutfitCardsButton hcButton" onclick="honeycomb.characterCards.open(\'' +
		honeycomb.escapeAttribute(definition.index) + '\', honeycomb.teambuilding.loadoutFor(\'' +
		honeycomb.escapeAttribute(definition.index) + '\'))">' +
		honeycomb.ui.iconTag(null, "bag", "#c9b6dd", { className: "hcInlineIcon" }) + " View Obtainable Cards</div>";
	//The row opens centred on the outfit worn, and a click re-centres on the new one. Scheduled so it
	//runs after the kernel has given the row its remembered scroll back.
	setTimeout(function () { honeycomb.teambuilding.centerWornOutfit(); }, 0);
	return markup;
};

//Scrolls the outfit row so the worn outfit sits in the middle, clamped at the ends so the first and
//last can still reach the edge. A no-op when the row or the worn outfit is not on screen.
honeycomb.teambuilding.centerWornOutfit = function () {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, honeycomb.teambuilding.inspectedCharacterIndex);
	if (definition == null) return;
	var row = document.querySelector('.hcOutfitRow[data-hcscrollkey="outfits-' + definition.index + '"]');
	if (row == null) return;
	var currentIndex = honeycomb.teambuilding.loadoutFor(definition.index).outfitIndex;
	var card = row.querySelector('[data-hcOutfit="' + currentIndex + '"]');
	if (card == null) return;
	var target = card.offsetLeft + card.offsetWidth / 2 - row.clientWidth / 2;
	row.scrollLeft = Math.max(0, Math.min(target, row.scrollWidth - row.clientWidth));
};

honeycomb.teambuilding.buildEquipmentTab = function () {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, honeycomb.teambuilding.inspectedCharacterIndex);
	if (definition == null) return "";
	var selection = honeycomb.teambuilding.findSelection(definition.index);
	if (selection == null) {
		return '<div class="hcTabNote">Add ' + honeycomb.escapeText(definition.name) +
			" to the party to fit equipment. They will wear what they wore last time.</div>";
	}
	var selectionArray = honeycomb.teambuilding.selectionArray();
	var activeArray = honeycomb.equipment.activeArray(selection.equipmentArray, selectionArray.length);

	//A tracker line, the same shape the outfit tab and the lifetime ledger use, with the capacity -- which
	//explains itself on hover, like the badge in the bio.
	var progress = honeycomb.equipment.progressFor(definition.index, false);
	var markup = '<div class="hcUnlockTracker">' +
		honeycomb.ui.iconTag(null, "bag", "#c9a961", { className: "hcInlineIcon" }) +
		"<span>Found " + progress.found + " / " + progress.total + " &middot; </span>" +
		'<span class="hcHelpText"' + honeycomb.tooltip.attributes("equipmentCapacity", selectionArray.length) + ">" +
		honeycomb.escapeText(definition.name) + " may use " + honeycomb.equipment.capacity(selectionArray.length) + "</span></div>";

	markup += honeycomb.teambuilding.buildEquipmentControls();

	var equipmentArray = honeycomb.teambuilding.sortedEquipmentArray(definition.index);
	if (equipmentArray.length === 0) markup += '<div class="hcTabNote">Nothing matches these filters.</div>';
	for (var equipIndex = 0; equipIndex < equipmentArray.length; equipIndex++) {
		var equipment = equipmentArray[equipIndex];
		var unlocked = honeycomb.unlocks.isUnlocked("equipment", equipment.index);
		var worn = selection.equipmentArray.indexOf(equipment.index) >= 0;
		var inactive = worn && activeArray.indexOf(equipment.index) < 0;
		//Who else holds it, fielded or benched: shown by face, and clicking takes it from them.
		var wearer = worn ? null : honeycomb.equipment.wearerOf(equipment.index, selectionArray, definition.index);
		var rarity = honeycomb.findDefinition(honeycomb.equipmentRarityArray, equipment.rarity);

		//Locked equipment is SHOWN rather than hidden, the way a locked outfit is: knowing something
		//exists is most of what makes finding it worth doing.
		var rowClass = "hcEquipRow" + (worn ? " hcActive" : "") + (unlocked ? "" : " hcLocked") +
			(inactive ? " hcInactive" : "") + (wearer != null ? " hcWornElsewhere" : "");
		markup += '<div class="' + rowClass + '" style="--hcRarity:' + honeycomb.teambuilding.rarityColor(equipment) + '"' +
			(unlocked ? honeycomb.tooltip.attributes("equipment", equipment.index, { inactive: inactive ? 1 : 0 }) : "") +
			(unlocked
				? ' onclick="honeycomb.teambuilding.toggleEquipment(\'' + definition.index + "','" + equipment.index + '\')"'
				: "") + ">";
		markup += honeycomb.ui.itemPlate(unlocked ? equipment.iconPath : null,
			unlocked ? "shield" : "question", unlocked ? honeycomb.teambuilding.rarityColor(equipment) : "#4b3d5c");
		markup += '<div class="hcGrow"><div>' + honeycomb.escapeText(unlocked ? equipment.name : "???") +
			' <span class="hcTiny hcEquipMeta">' + honeycomb.escapeText(honeycomb.equipment.kindText(equipment)) + "</span></div>";
		markup += '<div class="hcTiny hcMuted">' + honeycomb.escapeText(!unlocked ? "Not found yet."
			: (inactive ? honeycomb.tooltip.text("equipment.overCapacity") : equipment.description)) + "</div></div>";
		markup += '<div class="hcEquipTick">';
		if (worn) markup += "&#10003;";
		else if (wearer != null) markup += honeycomb.teambuilding.wearerFace(wearer);
		else if (unlocked == false) markup += "&#128274;";
		markup += "</div></div>";
	}
	return markup;
};

//The sort buttons and filter chips above the equipment list.
honeycomb.teambuilding.buildEquipmentControls = function () {
	var sortIndex = honeycomb.teambuilding.equipmentSort == null
		? honeycomb.tuning.equipment.defaultSort : honeycomb.teambuilding.equipmentSort;
	var markup = '<div class="hcEquipControls">';
	markup += '<div class="hcSegmented hcTiny">';
	for (var sortScan = 0; sortScan < honeycomb.teambuilding.equipmentSortArray.length; sortScan++) {
		var sort = honeycomb.teambuilding.equipmentSortArray[sortScan];
		markup += '<div class="hcSegment' + (sort.index == sortIndex ? " hcOn" : "") + '"' +
			' onclick="honeycomb.teambuilding.setEquipmentSort(\'' + sort.index + '\')">' + honeycomb.escapeText(sort.name) + "</div>";
	}
	markup += "</div>";
	markup += '<div class="hcTagRow hcEquipFilterRow">';
	var filterArray = honeycomb.teambuilding.equipmentFilterArray;
	var chipArray = honeycomb.equipmentKindArray.concat([{ index: "found", name: "Found" }]);
	for (var chipIndex = 0; chipIndex < chipArray.length; chipIndex++) {
		var on = filterArray.indexOf(chipArray[chipIndex].index) >= 0;
		markup += '<span class="hcTagChip hcFilterChip' + (on ? " hcOn" : "") + '"' +
			' onclick="honeycomb.teambuilding.toggleEquipmentFilter(\'' + chipArray[chipIndex].index + '\')">' +
			honeycomb.escapeText(chipArray[chipIndex].name) + "</span>";
	}
	markup += "</div></div>";
	return markup;
};


//A small face for "worn by": whoever holds a piece, in their current outfit.
honeycomb.teambuilding.wearerFace = function (characterIndex) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	if (definition == null) return "";
	return '<span class="hcWearerFace" style="--hcAccent:' + definition.colorHint + '" title="Worn by ' +
		honeycomb.escapeAttribute(definition.name) + '. Click to take it.">' +
		honeycomb.art.portraitTag(characterIndex, honeycomb.teambuilding.loadoutFor(characterIndex).outfitIndex,
			{ className: "hcWearerFaceArt", alt: definition.name }) + "</span>";
};

//The tree itself, drawn down the tab. See honeycomb-overlays-progression.js.
honeycomb.teambuilding.buildProgressionTab = function () {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, honeycomb.teambuilding.inspectedCharacterIndex);
	if (definition == null) return "";
	//A character with no tree gets an explicit message here instead of an empty panel: a character can be
	//earned before her tree is written, so a player will open this tab.
	if (definition.progressionTree == null) return '<div class="hcTabNote">No progression yet.</div>';
	return honeycomb.progressionScreen.renderTab(definition.index);
};


//The party lineup, under the Roster window. The selected team in order, plus empty slots up to the
//maximum so the ceiling is visible. It reads the way the battlefield does -- the front of the party on
//the right, facing where the enemy will be -- and every member can be dragged to a new place, or off
//the strip. The Back / Front labels sit on a line above the strip, so the portraits keep its full width.
honeycomb.teambuilding.buildPartyStrip = function () {
	var selectionArray = honeycomb.teambuilding.selectionArray();
	var markup = '<div class="hcPartyStripWrap">';
	markup += '<div class="hcPartyLabels"><span class="hcPartyEnd hcTiny hcDim">Back</span>' +
		'<span class="hcPartyEnd hcTiny hcGold">Front</span></div>';
	markup += '<div class="hcPartyStrip" id="honeycombPartyStrip">';
	for (var memberIndex = 0; memberIndex < selectionArray.length; memberIndex++) {
		var selection = selectionArray[memberIndex];
		markup += '<div class="hcPartySlot" data-hcRank="' + memberIndex + '"' +
			' data-hcCharacter="' + honeycomb.escapeAttribute(selection.characterIndex) + '"' +
			' title="' + (memberIndex === 0 ? "Front of the party" : "Place " + (memberIndex + 1)) + '">';
		markup += honeycomb.ui.portrait(
			{ characterIndex: selection.characterIndex, outfitIndex: selection.outfitIndex, downed: false },
			{ selected: honeycomb.teambuilding.inspectedCharacterIndex == selection.characterIndex });
		markup += '<div class="hcPartyRank">' + (memberIndex + 1) + "</div>";
		markup += "</div>";
	}
	for (var slotIndex = selectionArray.length; slotIndex < honeycomb.teambuilding.partySizeMaximum(); slotIndex++) {
		var reachable = slotIndex < honeycomb.state.profile.unlockedCharacterArray.length;
		markup += '<div class="hcPartySlotEmpty' + (reachable ? "" : " hcLocked") + '" data-hcRank="' + slotIndex + '" title="' +
			(reachable ? "Empty slot -- drag a character here" : "Unlocked later") + '">+</div>';
	}
	markup += "</div></div>";
	return markup;
};

//--- Footer -----------------------------------------------------------------------------------------
honeycomb.teambuilding.buildFooter = function () {
	var selectionArray = honeycomb.teambuilding.selectionArray();
	var canStart = selectionArray.length >= honeycomb.tuning.run.partySizeMinimum;

	var markup = '<div class="hcTeamFooter">';
	//Back goes to the Honeycomb title, not out of the game entirely. Leaving Honeycomb is the Menu
	//button's job; a Back button that quits is how a player loses work by accident.
	markup += '<div class="hcButton" onclick="honeycomb.scene.go(\'title\')">Back</div>';

	markup += '<div class="hcTiny hcMuted hcNoWrap">' + selectionArray.length + " / " +
		honeycomb.teambuilding.partySizeMaximum() + " chosen</div>";

	//The run resources the party would start with, previewed from the selection. One shared counter
	//component, so this and the in-run buttons change together when icons arrive.
	markup += honeycomb.ui.resourceCounter("reroll", {
		count: honeycomb.teamResourcePreview(selectionArray, "reroll"), label: "Rerolls", className: "hcTeamCounter" });
	markup += honeycomb.ui.resourceCounter("banish", {
		count: honeycomb.teamResourcePreview(selectionArray, "banish"), label: "Banishes", className: "hcTeamCounter" });

	//The whole party's deck, as its own screen. Global, because the deck is the party.
	//`hcTeamFooterRight` pushes this and Start Run to the far edge. The footer is a plain flex row, so
	//without it every child packs against Back.
	markup += '<div class="hcButton hcTeamFooterRight" onclick="honeycomb.deckScreen.open(null)">' +
		honeycomb.ui.iconTag(null, "spiral", "#c9b6dd", { className: "hcInlineIcon" }) + " Deck</div>";

	markup += '<div class="hcButton hcPrimary' + (canStart ? "" : " hcDisabled") + '"' +
		(selectionArray.length === 0 ? ' title="Put at least one character in the party"' : "") +
		' onclick="honeycomb.teambuilding.startRun()">' +
		honeycomb.ui.iconTag(null, "sword", "#f0d89a", { className: "hcInlineIcon" }) + " Start Run</div>";
	markup += "</div>";
	return markup;
};
