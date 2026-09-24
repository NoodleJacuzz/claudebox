//===================================================================================================
//HONEYCOMB CATACOMBS -- the Battle Lab
//===================================================================================================
//A debug battle environment for playing any card and testing animations, sfx and status effects, with
//enemies and party members added freely to either side.
//
//The lab is a MODE the real battle screen enters, not a screen of its own. `honeycomb.lab.active`
//puts `hcLabMode` on the root; the combat scene then grows edit handles in place -- a + over each line,
//a - on each body, the intent card and the nameplate and the energy orb and the draw pile all rewired
//to open a picker. Nothing covers the board except a picker the tester opened, and every picker closes
//on the choice that opened it.
//
//THE RULE THIS FILE OBEYS: the lab may only press seams the game already has. Every control calls the
//same function the game calls -- `addCardToPile` for a card, `summonCombatant` for a body,
//`changeIntent` for a move. A bench that works differently from the game would prove nothing about it.
//
//One engine flag is new: `combat.labNoEnd` suspends the win/loss check, because an empty enemy line
//would otherwise be an instant victory and a bench cannot be used to watch a death animation.
//
//Debug only. Everything here is behind tuning.debug.enabled, like the rest of the panel.
honeycomb.lab = {
	//THE TOGGLE. While this is on, the battle screen is an editor.
	active: false,
	//The card catalogue's state.
	cardFilterIndex: null,
	cardUpgradeLevel: 0,
	showBrokenForms: false,
	//Which side the combatant picker is adding to, set by whichever + was pressed.
	addSide: "enemy",
	lastMessage: "",
};

//---------------------------------------------------------------------------------------------------
//The mode
//---------------------------------------------------------------------------------------------------
//Turns the lab on and drops into an EMPTY battle: the party as it stands, and nothing opposite. The
//enemy line is then built with the + over it. Starting empty rather than from an encounter is only
//possible because labNoEnd suspends the victory check.
honeycomb.lab.start = function () {
	honeycomb.debug.ensureRun();
	honeycomb.combat.clear();
	honeycomb.overlay.closeAll();
	//Begun from a real encounter and then emptied: `combat.begin` is the only door into a fight, and a
	//fight built any other way would not be the fight the game runs.
	honeycomb.scene.go("combat", { encounterIndex: honeycomb.debug.testEncounterIndex });
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (combat == null) return;
	combat.labNoEnd = true;
	combat.enemyArray.length = 0;
	honeycomb.lab.active = true;
	honeycomb.lab.applyMode();
	honeycomb.scene.go("combat", {});
	honeycomb.lab.note("Battle Lab on. + over a line adds a body; the deck opens the card list.");
};

//Off again, and the fight is a fight: the victory check is live, so an empty enemy line ends it.
honeycomb.lab.stop = function () {
	honeycomb.lab.active = false;
	var combat = honeycomb.lab.combat();
	if (combat != null) combat.labNoEnd = false;
	honeycomb.lab.applyMode();
	honeycomb.scene.go("combat", {});
};

honeycomb.lab.toggle = function () {
	if (honeycomb.lab.active == true) honeycomb.lab.stop();
	else honeycomb.lab.start();
};

//The class the stylesheet hangs the edit handles off. Re-applied on every scene build, since a scene
//change rewrites the root's classes -- the same rule reduced effects follows.
honeycomb.lab.applyMode = function () {
	var hostArray = [honeycomb.rootElement(), honeycomb.overlayHostElement()];
	for (var hostIndex = 0; hostIndex < hostArray.length; hostIndex++) {
		if (hostArray[hostIndex] != null) hostArray[hostIndex].classList.toggle("hcLabMode", honeycomb.lab.active == true);
	}
};

honeycomb.lab.combat = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	return run == null ? null : run.combat;
};

honeycomb.lab.context = function () {
	return honeycomb.newEffectContext({ combat: honeycomb.lab.combat() });
};

//A line of text on the board itself, so a refusal is seen without opening anything.
honeycomb.lab.note = function (text) {
	honeycomb.lab.lastMessage = text == null ? "" : text;
	if (honeycomb.combatScene != null && honeycomb.combatScene.flashMessage != null && text != null) {
		honeycomb.combatScene.flashMessage(text);
	}
};

//Redraws the board. Through combatScene.repaint, never a scene rebuild: a rebuild would destroy a card
//being dragged and its pointer capture.
honeycomb.lab.repaint = function () {
	if (honeycomb.combatScene != null && honeycomb.combatScene.repaint != null) honeycomb.combatScene.repaint();
};

//Plays whatever an action logged, so a summon or a status lands with its own beat rather than appearing.
honeycomb.lab.play = function (context) {
	if (context == null || context.log == null || context.log.length === 0) { honeycomb.lab.repaint(); return; }
	honeycomb.combatScene.playLog(context.log, function () { honeycomb.combatScene.afterBeat(); });
};

honeycomb.lab.entityArray = function () {
	var combat = honeycomb.lab.combat();
	if (combat == null) return [];
	var run = honeycomb.state.run;
	return (run.partyArray == null ? [] : run.partyArray).concat(combat.enemyArray == null ? [] : combat.enemyArray);
};

honeycomb.lab.entityById = function (instanceId) {
	var entityArray = honeycomb.lab.entityArray();
	for (var scanIndex = 0; scanIndex < entityArray.length; scanIndex++) {
		if (entityArray[scanIndex].instanceId == instanceId) return entityArray[scanIndex];
	}
	return null;
};

//---------------------------------------------------------------------------------------------------
//What the combat scene asks for
//---------------------------------------------------------------------------------------------------
//The scene calls these while it draws. Each returns "" when the lab is off, so the shipped screen is
//byte-identical to what it was before this file existed.

//The + at the end of a line.
honeycomb.lab.sideHandleMarkup = function (side) {
	if (honeycomb.lab.active != true) return "";
	return '<div class="hcLabSideAdd" title="Add somebody to this line"' +
		' onclick="event.stopPropagation();honeycomb.lab.openAdd(\'' + side + '\')">+</div>';
};

//The - on a body, and the badge that says what it is.
honeycomb.lab.fighterHandleMarkup = function (entity) {
	if (honeycomb.lab.active != true || entity == null) return "";
	return '<div class="hcLabFighterRemove" title="Take this body off the board"' +
		' onclick="event.stopPropagation();honeycomb.lab.removeCombatant(\'' +
		honeycomb.escapeAttribute(entity.instanceId) + '\')">−</div>' +
		'<div class="hcLabFighterRestore" title="Full health, no lust, no statuses"' +
		' onclick="event.stopPropagation();honeycomb.lab.restore(\'' +
		honeycomb.escapeAttribute(entity.instanceId) + '\')">↺</div>';
};

//The nameplate becomes an edit handle: HP, tHP and Lust by hand.
honeycomb.lab.vitalsAttribute = function (entity) {
	if (honeycomb.lab.active != true || entity == null) return "";
	return ' onclick="event.stopPropagation();honeycomb.lab.openVitals(\'' +
		honeycomb.escapeAttribute(entity.instanceId) + '\')"';
};

//The intent card opens the move picker instead of the move list.
honeycomb.lab.intentClickAttribute = function (entity) {
	if (honeycomb.lab.active != true || entity == null) return null;
	return ' onclick="event.stopPropagation();honeycomb.lab.openIntent(\'' +
		honeycomb.escapeAttribute(entity.instanceId) + '\')"';
};

//An AI body with no intent yet still needs somewhere to press, so the lab gives it a stand-in slot.
honeycomb.lab.emptyIntentMarkup = function (entity) {
	if (honeycomb.lab.active != true || entity == null) return "";
	if (honeycomb.isAiControlled(entity) == false) return "";
	return '<div class="hcLabIntentEmpty" title="Choose what this one will do"' +
		' onclick="event.stopPropagation();honeycomb.lab.openIntent(\'' +
		honeycomb.escapeAttribute(entity.instanceId) + '\')">intent</div>';
};

//The energy orb becomes an edit handle.
honeycomb.lab.energyAttribute = function () {
	if (honeycomb.lab.active != true) return "";
	return ' onclick="event.stopPropagation();honeycomb.lab.openEnergy()"';
};

//The draw pile opens the whole game's card list instead of what is in the pile.
honeycomb.lab.drawPileClick = function () {
	if (honeycomb.lab.active != true) return null;
	return "honeycomb.lab.openCards()";
};

//The badge in the corner that says the mode is on, and turns it off again.
honeycomb.lab.badgeMarkup = function () {
	if (honeycomb.lab.active != true) return "";
	var combat = honeycomb.lab.combat();
	return '<div class="hcLabBadge" title="The Battle Lab is on. Win and loss checks are suspended.">' +
		'<span class="hcLabBadgeName">LAB</span>' +
		'<span class="hcLabBadgeButton" title="Refill energy" onclick="honeycomb.lab.refillEnergy()">⚡</span>' +
		'<span class="hcLabBadgeButton' + (combat != null && combat.labNoEnd ? " hcOn" : "") +
		'" title="Suspend win and loss checks" onclick="honeycomb.lab.toggleNoEnd()">∞</span>' +
		'<span class="hcLabBadgeButton" title="Turn the Battle Lab off" onclick="honeycomb.lab.stop()">×</span>' +
		"</div>";
};

//---------------------------------------------------------------------------------------------------
//The pickers
//---------------------------------------------------------------------------------------------------
//Each is a compact panel that opens on a press and closes on the choice. Registered once; which one is
//showing is a field, so there is a single overlay rather than four.
honeycomb.lab.pickerKind = null;
honeycomb.lab.pickerEntityId = null;

honeycomb.overlay.register({
	index: "labPicker",
	closeOnBackdrop: true,
	build: function (layer) {
		layer.innerHTML = honeycomb.lab.renderPicker();
	},
});

honeycomb.lab.openPicker = function (kind, entityId) {
	honeycomb.lab.pickerKind = kind;
	honeycomb.lab.pickerEntityId = entityId == null ? null : entityId;
	honeycomb.overlay.close("labPicker");
	honeycomb.overlay.open("labPicker", {});
};

honeycomb.lab.refreshPicker = function () {
	for (var scanIndex = honeycomb.overlay.openArray.length - 1; scanIndex >= 0; scanIndex--) {
		if (honeycomb.overlay.openArray[scanIndex].index != "labPicker") continue;
		honeycomb.overlay.openArray[scanIndex].element.innerHTML = honeycomb.lab.renderPicker();
		return;
	}
};

honeycomb.lab.closePicker = function () {
	honeycomb.overlay.close("labPicker");
	honeycomb.lab.pickerKind = null;
};

honeycomb.lab.openAdd = function (side) {
	honeycomb.lab.addSide = side;
	honeycomb.lab.openPicker("add", null);
};
honeycomb.lab.openCards = function () { honeycomb.lab.openPicker("cards", null); };
honeycomb.lab.openIntent = function (entityId) { honeycomb.lab.openPicker("intent", entityId); };
honeycomb.lab.openVitals = function (entityId) { honeycomb.lab.openPicker("vitals", entityId); };
honeycomb.lab.openEnergy = function () { honeycomb.lab.openPicker("energy", null); };

honeycomb.lab.renderPicker = function () {
	var kind = honeycomb.lab.pickerKind;
	if (kind == "add") return honeycomb.lab.renderAdd();
	if (kind == "cards") return honeycomb.lab.renderCards();
	if (kind == "intent") return honeycomb.lab.renderIntent();
	if (kind == "vitals") return honeycomb.lab.renderVitals();
	if (kind == "energy") return honeycomb.lab.renderEnergy();
	return "";
};

honeycomb.lab.panelHead = function (title, note) {
	return '<div class="hcOverlayPanel hcLabPicker"><h2 class="hcOverlayTitle">' + honeycomb.escapeText(title) + "</h2>" +
		(note == null ? "" : '<div class="hcOverlayBody hcTiny hcMuted">' + honeycomb.escapeText(note) + "</div>");
};

honeycomb.lab.panelFoot = function () {
	return '<div class="hcOverlayButtonRow"><div class="hcButton hcPrimary" onclick="honeycomb.lab.closePicker()">Close</div></div></div>';
};

//--- who joins a line ---------------------------------------------------------------------------
//Portraits, not a dropdown, so an enemy or character can be identified by sight rather than by name
//alone.
honeycomb.lab.renderAdd = function () {
	var side = honeycomb.lab.addSide;
	var markup = honeycomb.lab.panelHead(side == "enemy" ? "Stand somebody on the enemy line" : "Add somebody to the party",
		"Characters and enemies both go on either line -- an enemy can join the party and a character can be fought.");

	markup += '<div class="hcLabSectionTitle">Enemies</div><div class="hcLabPortraits">';
	for (var enemyIndex = 0; enemyIndex < honeycomb.enemyArray.length; enemyIndex++) {
		var enemy = honeycomb.enemyArray[enemyIndex];
		//Keeps the secret the player-facing screens keep (tuning.debug.showsSecrets).
		if (honeycomb.discovery.hiddenFromDebug("enemy", enemy.index) == true) continue;
		markup += '<div class="hcLabPortrait" onclick="honeycomb.lab.addCombatant({ enemyIndex: \'' +
			honeycomb.escapeAttribute(enemy.index) + '\' })">' +
			honeycomb.art.chainTag(honeycomb.art.enemyPortraitChain(enemy.index), { className: "hcLabPortraitArt", alt: enemy.name }) +
			'<span class="hcLabPortraitName">' + honeycomb.escapeText(enemy.name) + "</span></div>";
	}
	markup += "</div>";

	markup += '<div class="hcLabSectionTitle">Characters</div><div class="hcLabPortraits">';
	for (var characterIndex = 0; characterIndex < honeycomb.characterArray.length; characterIndex++) {
		var character = honeycomb.characterArray[characterIndex];
		if (honeycomb.discovery.hiddenFromDebug("character", character.index) == true) continue;
		var outfitArray = character.outfitArray == null ? [] : character.outfitArray;
		for (var outfitIndex = 0; outfitIndex < outfitArray.length; outfitIndex++) {
			var outfit = outfitArray[outfitIndex];
			markup += '<div class="hcLabPortrait" onclick="honeycomb.lab.addCombatant({ characterIndex: \'' +
				honeycomb.escapeAttribute(character.index) + '\', outfitIndex: \'' +
				honeycomb.escapeAttribute(outfit.index) + '\' })">' +
				honeycomb.art.chainTag(honeycomb.art.portraitChain(character.index, outfit.index),
					{ className: "hcLabPortraitArt", alt: character.name }) +
				'<span class="hcLabPortraitName">' + honeycomb.escapeText(character.name) +
				'<span class="hcTiny hcMuted"> · ' + honeycomb.escapeText(outfit.name) + "</span></span></div>";
		}
	}
	markup += "</div>";
	return markup + honeycomb.lab.panelFoot();
};

//--- the card list -------------------------------------------------------------------------------
//EVERY CARD AS ITS OWN FACE, sorted by owner then rarity then name, so a card can be identified by sight
//rather than by name alone. Clicking one draws it.
honeycomb.lab.rarityOrder = function (rarity) {
	var order = ["starter", "common", "rare", "special", "broken"];
	var found = order.indexOf(rarity);
	return found < 0 ? order.length : found;
};

honeycomb.lab.cardListArray = function () {
	var filterIndex = honeycomb.lab.cardFilterIndex;
	var result = [];
	for (var scanIndex = 0; scanIndex < honeycomb.cardArray.length; scanIndex++) {
		var card = honeycomb.cardArray[scanIndex];
		if (card.rarity == "enemy") continue;
		if (honeycomb.discovery.hiddenFromDebug("card", card.index) == true) continue;
		var owner = card.characterIndex == null ? "neutral" : card.characterIndex;
		if (filterIndex != null && owner != filterIndex) continue;
		if (honeycomb.lab.showBrokenForms != (card.rarity == "broken")) continue;
		result.push(card);
	}
	result.sort(function (left, right) {
		var leftOwner = left.characterIndex == null ? "~" : left.characterIndex;
		var rightOwner = right.characterIndex == null ? "~" : right.characterIndex;
		if (leftOwner != rightOwner) return leftOwner < rightOwner ? -1 : 1;
		var rarityDifference = honeycomb.lab.rarityOrder(left.rarity) - honeycomb.lab.rarityOrder(right.rarity);
		if (rarityDifference !== 0) return rarityDifference;
		return String(left.name) < String(right.name) ? -1 : 1;
	});
	return result;
};

//honeycomb.defaultOwnerFor gives a created card to the party member whose character it names; with that
//character absent the card has no owner, and every owner-relative effect on it does nothing its text
//promises. Said on the card rather than discovered mid-test.
honeycomb.lab.ownerPresent = function (card) {
	if (card.characterIndex == null) return true;
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.partyArray == null) return false;
	for (var scanIndex = 0; scanIndex < run.partyArray.length; scanIndex++) {
		if (run.partyArray[scanIndex].characterIndex == card.characterIndex) return true;
	}
	return false;
};

honeycomb.lab.renderCards = function () {
	var combat = honeycomb.lab.combat();
	var markup = honeycomb.lab.panelHead("Draw any card",
		"Sorted by owner, then rarity. A card marked ⚠ has no owner in the party, so its owner-relative effects will do nothing.");

	markup += '<div class="hcSegmented hcLabFilters">';
	markup += '<div class="hcSegment' + (honeycomb.lab.cardFilterIndex == null ? " hcOn" : "") +
		'" onclick="honeycomb.lab.cardFilterIndex=null;honeycomb.lab.refreshPicker()">All</div>';
	for (var characterIndex = 0; characterIndex < honeycomb.characterArray.length; characterIndex++) {
		var character = honeycomb.characterArray[characterIndex];
		if (honeycomb.discovery.hiddenFromDebug("character", character.index) == true) continue;
		markup += '<div class="hcSegment' + (honeycomb.lab.cardFilterIndex == character.index ? " hcOn" : "") +
			'" onclick="honeycomb.lab.cardFilterIndex=\'' + honeycomb.escapeAttribute(character.index) +
			'\';honeycomb.lab.refreshPicker()">' + honeycomb.escapeText(character.name) + "</div>";
	}
	markup += '<div class="hcSegment' + (honeycomb.lab.cardFilterIndex == "neutral" ? " hcOn" : "") +
		'" onclick="honeycomb.lab.cardFilterIndex=\'neutral\';honeycomb.lab.refreshPicker()">Neutral</div>';
	markup += "</div>";

	markup += '<div class="hcLabRow">';
	markup += '<div class="hcSegment' + (honeycomb.lab.cardUpgradeLevel === 0 ? " hcOn" : "") +
		'" onclick="honeycomb.lab.cardUpgradeLevel=0;honeycomb.lab.refreshPicker()">Base</div>';
	markup += '<div class="hcSegment' + (honeycomb.lab.cardUpgradeLevel === 1 ? " hcOn" : "") +
		'" onclick="honeycomb.lab.cardUpgradeLevel=1;honeycomb.lab.refreshPicker()">Upgraded +</div>';
	markup += '<div class="hcSegment' + (honeycomb.lab.showBrokenForms ? " hcOn" : "") +
		'" onclick="honeycomb.lab.showBrokenForms=!honeycomb.lab.showBrokenForms;honeycomb.lab.refreshPicker()">Broken forms</div>';
	markup += '<span class="hcTiny hcMuted">hand ' + (combat == null ? 0 : combat.handArray.length) +
		" / " + honeycomb.tuning.combat.handSizeMaximum +
		" · " + honeycomb.lab.cardListArray().length + " cards</span>";
	markup += "</div>";

	var cardArray = honeycomb.lab.cardListArray();
	markup += '<div class="hcLabCardGrid hcScroll">';
	for (var cardIndex = 0; cardIndex < cardArray.length; cardIndex++) {
		var card = cardArray[cardIndex];
		var level = card.upgradeArray == null ? 0 : Math.min(honeycomb.lab.cardUpgradeLevel, card.upgradeArray.length);
		var resolved = honeycomb.resolveCard({ instanceId: null, cardIndex: card.index, upgradeLevel: level });
		if (resolved == null) continue;
		var ownerHere = honeycomb.lab.ownerPresent(card);
		markup += '<div class="hcLabCardPick' + (ownerHere ? "" : " hcLabCardOrphan") + '"' +
			(ownerHere ? "" : ' title="Its owner is not in the party, so owner-relative effects will do nothing."') +
			' onclick="honeycomb.lab.giveCard(\'' + honeycomb.escapeAttribute(card.index) + '\')">' +
			//THE FACE EXPLAINS ITSELF ON HOVER, with no tooltip over the card selection. A small face is a
			//picture to find a card by, not text to read it by, and this list is where a card is met for
			//the first time. The panel is the ordinary card one, so a keyword is explained here as anywhere.
			honeycomb.ui.card(resolved, { size: "small", showAffinity: false }) +
			(ownerHere ? "" : '<span class="hcLabCardWarn">⚠</span>') + "</div>";
	}
	markup += "</div>";
	return markup + honeycomb.lab.panelFoot();
};

//--- what an enemy will do -----------------------------------------------------------------------
//The moves as their own cards, for the same reason the card list shows faces.
honeycomb.lab.renderIntent = function () {
	var entity = honeycomb.lab.entityById(honeycomb.lab.pickerEntityId);
	if (entity == null) return honeycomb.lab.panelHead("Nobody there", null) + honeycomb.lab.panelFoot();
	var combat = honeycomb.lab.combat();
	var markup = honeycomb.lab.panelHead(honeycomb.entityName(entity) + " will use…",
		"Chosen here, it is telegraphed at once -- the same call Cassadora's Turncoat makes.");

	var moveArray = honeycomb.aiMoveArray(entity);
	markup += '<div class="hcLabCardGrid hcScroll">';
	for (var moveIndex = 0; moveIndex < moveArray.length; moveIndex++) {
		var cardIndex = moveArray[moveIndex].card;
		var card = honeycomb.moveCard(entity, cardIndex);
		if (card == null) continue;
		markup += '<div class="hcLabCardPick' + (entity.intentCardIndex == cardIndex ? " hcLabCardChosen" : "") + '"' +
			' onclick="honeycomb.lab.setIntent(\'' + honeycomb.escapeAttribute(entity.instanceId) + '\', \'' +
			honeycomb.escapeAttribute(cardIndex) + '\')">' +
			honeycomb.ui.card(card, {
				size: "small", showTooltip: false, showAffinity: false,
				live: { source: entity, target: null, combat: combat },
			}) + "</div>";
	}
	markup += "</div>";
	markup += '<div class="hcLabRow"><div class="hcButton hcSmall" onclick="honeycomb.lab.setIntent(\'' +
		honeycomb.escapeAttribute(entity.instanceId) + '\', null)">Let it choose for itself</div></div>';
	return markup + honeycomb.lab.panelFoot();
};

//--- a body's numbers ----------------------------------------------------------------------------
honeycomb.lab.renderVitals = function () {
	var entity = honeycomb.lab.entityById(honeycomb.lab.pickerEntityId);
	if (entity == null) return honeycomb.lab.panelHead("Nobody there", null) + honeycomb.lab.panelFoot();
	var markup = honeycomb.lab.panelHead(honeycomb.entityName(entity),
		"Set directly. Nothing is logged and no hook fires -- this is the board being posed, not damage being dealt.");

	markup += '<div class="hcLabFieldRow">';
	markup += honeycomb.lab.numberField("labHealth", "Health", entity.health, 0, entity.maxHealth);
	markup += honeycomb.lab.numberField("labMaxHealth", "Max health", entity.maxHealth, 1, 9999);
	markup += honeycomb.lab.numberField("labTemporary", "Temporary HP", entity.temporaryHealth == null ? 0 : entity.temporaryHealth, 0, 9999);
	if (honeycomb.entityUsesLust(entity)) {
		markup += honeycomb.lab.numberField("labLust", "Lust", entity.lust == null ? 0 : entity.lust, 0, 9999);
	}
	markup += "</div>";

	markup += '<div class="hcLabRow">';
	markup += '<div class="hcButton hcSmall hcPrimary" onclick="honeycomb.lab.applyVitals(\'' +
		honeycomb.escapeAttribute(entity.instanceId) + '\')">Apply</div>';
	markup += '<div class="hcButton hcSmall" onclick="honeycomb.lab.restore(\'' +
		honeycomb.escapeAttribute(entity.instanceId) + '\');honeycomb.lab.refreshPicker()">Restore</div>';
	markup += "</div>";

	//STATUSES, on the same panel: a status is a number on a body too, and ending a turn is how one is
	//watched. Every status in the game, so nothing has to be reached through a card that applies it.
	markup += '<div class="hcLabSectionTitle">Statuses</div>';
	markup += '<div class="hcLabRow">';
	markup += '<input class="hcDebugSelect hcLabStacks" id="labStatusStacks" type="number" min="1" max="99" value="2">';
	markup += '<span class="hcTiny hcMuted">stacks, then pick one</span>';
	markup += '<div class="hcButton hcSmall" onclick="honeycomb.lab.clearStatuses(\'' +
		honeycomb.escapeAttribute(entity.instanceId) + '\')">Clear all</div>';
	markup += "</div>";
	markup += '<div class="hcLabRow hcLabStatusList">';
	for (var statusIndex = 0; statusIndex < honeycomb.statusArray.length; statusIndex++) {
		var status = honeycomb.statusArray[statusIndex];
		var standing = honeycomb.statusStacks(entity, status.index);
		markup += '<span class="hcLabStatusChip' + (standing > 0 ? " hcOn" : "") + '"' +
			' onclick="honeycomb.lab.applyStatus(\'' + honeycomb.escapeAttribute(entity.instanceId) +
			'\', \'' + honeycomb.escapeAttribute(status.index) + '\')">' +
			honeycomb.escapeText(status.name) + (standing > 0 ? " " + standing : "") + "</span>";
	}
	markup += "</div>";
	return markup + honeycomb.lab.panelFoot();
};

honeycomb.lab.numberField = function (id, label, value, minimum, maximum) {
	return '<label class="hcLabField"><span class="hcTiny hcMuted">' + honeycomb.escapeText(label) + "</span>" +
		'<input class="hcDebugSelect" id="' + id + '" type="number" min="' + minimum + '" max="' + maximum +
		'" value="' + honeycomb.escapeAttribute(String(value == null ? 0 : value)) + '"></label>';
};

honeycomb.lab.readNumber = function (id, fallback) {
	var element = document.getElementById(id);
	if (element == null) return fallback;
	var value = Number(element.value);
	return isNaN(value) ? fallback : Math.round(value);
};

honeycomb.lab.applyVitals = function (instanceId) {
	var entity = honeycomb.lab.entityById(instanceId);
	if (entity == null) return;
	entity.maxHealth = Math.max(1, honeycomb.lab.readNumber("labMaxHealth", entity.maxHealth));
	entity.health = Math.max(0, Math.min(entity.maxHealth, honeycomb.lab.readNumber("labHealth", entity.health)));
	entity.temporaryHealth = Math.max(0, honeycomb.lab.readNumber("labTemporary", entity.temporaryHealth == null ? 0 : entity.temporaryHealth));
	if (honeycomb.entityUsesLust(entity)) {
		entity.lust = Math.max(0, honeycomb.lab.readNumber("labLust", entity.lust == null ? 0 : entity.lust));
	}
	//Downed and Broken are derived from the numbers, so setting the numbers has to settle them or the
	//board would show a standing body at 0 health.
	entity.downed = entity.health <= 0;
	honeycomb.lab.repaint();
	honeycomb.lab.refreshPicker();
};

//--- energy --------------------------------------------------------------------------------------
honeycomb.lab.renderEnergy = function () {
	var markup = honeycomb.lab.panelHead("Energy", "What this turn has left to spend.");
	markup += '<div class="hcLabFieldRow">' +
		honeycomb.lab.numberField("labEnergy", "Energy", honeycomb.getResource("energy"), 0, 999) + "</div>";
	markup += '<div class="hcLabRow">';
	markup += '<div class="hcButton hcSmall hcPrimary" onclick="honeycomb.lab.applyEnergy()">Apply</div>';
	markup += '<div class="hcButton hcSmall" onclick="honeycomb.lab.refillEnergy();honeycomb.lab.refreshPicker()">Fill it (' +
		honeycomb.tuning.lab.energyRefill + ")</div>";
	markup += "</div>";
	return markup + honeycomb.lab.panelFoot();
};

honeycomb.lab.applyEnergy = function () {
	honeycomb.setResource("energy", Math.max(0, honeycomb.lab.readNumber("labEnergy", honeycomb.getResource("energy"))));
	honeycomb.lab.repaint();
	honeycomb.lab.refreshPicker();
};

honeycomb.lab.refillEnergy = function () {
	honeycomb.setResource("energy", honeycomb.tuning.lab.energyRefill);
	honeycomb.lab.repaint();
};

honeycomb.lab.toggleNoEnd = function () {
	var combat = honeycomb.lab.combat();
	if (combat == null) return;
	combat.labNoEnd = combat.labNoEnd != true;
	honeycomb.lab.repaint();
	honeycomb.lab.note("Win and loss checks " + (combat.labNoEnd ? "suspended." : "live again."));
};

//---------------------------------------------------------------------------------------------------
//The actions themselves
//---------------------------------------------------------------------------------------------------
//Puts one card in hand at the chosen upgrade level. The same call an event or an enemy makes, so the
//card is an ordinary member of the hand from here on. The picker stays open: a tester draws several.
honeycomb.lab.giveCard = function (cardIndex) {
	var combat = honeycomb.lab.combat();
	if (combat == null) { honeycomb.lab.note("No fight to put a card into."); return; }
	if (combat.handArray.length >= honeycomb.tuning.combat.handSizeMaximum) {
		honeycomb.lab.note("The hand is full (" + honeycomb.tuning.combat.handSizeMaximum + ").");
		return;
	}
	var context = honeycomb.lab.context();
	var instance = honeycomb.addCardToPile(cardIndex, "hand", context);
	if (instance == null) { honeycomb.lab.note("Refused: " + cardIndex); return; }
	var card = honeycomb.findDefinition(honeycomb.cardArray, cardIndex);
	//The upgrade level is a plain integer on the instance, so the + form needs no second table.
	instance.upgradeLevel = Math.min(honeycomb.lab.cardUpgradeLevel, card == null || card.upgradeArray == null ? 0 : card.upgradeArray.length);
	honeycomb.lab.play(context);
	honeycomb.lab.refreshPicker();
};

//Stands a combatant on a line. summonCombatant already takes a side, so a character can be put on the
//enemy line and an enemy in the party.
honeycomb.lab.addCombatant = function (spec) {
	var combat = honeycomb.lab.combat();
	if (combat == null || spec == null) { honeycomb.lab.note("No fight to add to."); return; }
	var request = { side: honeycomb.lab.addSide };
	if (spec.enemyIndex != null) request.enemyIndex = spec.enemyIndex;
	if (spec.characterIndex != null) {
		request.characterIndex = spec.characterIndex;
		request.outfitIndex = spec.outfitIndex;
	}
	var context = honeycomb.lab.context();
	var entity = honeycomb.summonCombatant(request, context);
	if (entity == null) {
		//The line has a ceiling (tuning.scaling.enemyLimit) and summonCombatant returns null at it.
		honeycomb.lab.note("Refused -- the line may be full (limit " + honeycomb.tuning.scaling.enemyLimit + ").");
		return;
	}
	//A body stood on a line has nothing telegraphed yet; give it one so its intent card is there to press.
	if (honeycomb.isAiControlled(entity)) honeycomb.selectMove(entity);
	honeycomb.lab.closePicker();
	honeycomb.lab.play(context);
};

//Takes a body off the board outright. Not a death: nothing is logged and no hook fires, because the
//point is to change the line-up, not to test dying.
honeycomb.lab.removeCombatant = function (instanceId) {
	var combat = honeycomb.lab.combat();
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (combat == null || run == null) return;
	var listArray = [run.partyArray, combat.enemyArray];
	for (var listIndex = 0; listIndex < listArray.length; listIndex++) {
		var list = listArray[listIndex];
		if (list == null) continue;
		for (var scanIndex = list.length - 1; scanIndex >= 0; scanIndex--) {
			if (list[scanIndex].instanceId == instanceId) list.splice(scanIndex, 1);
		}
	}
	//A body leaving is the one change the board cannot animate into place, so the scene is rebuilt.
	honeycomb.scene.go("combat", {});
};

honeycomb.lab.restore = function (instanceId) {
	var entity = honeycomb.lab.entityById(instanceId);
	if (entity == null) return;
	entity.health = entity.maxHealth;
	entity.temporaryHealth = 0;
	entity.lust = 0;
	entity.broken = false;
	entity.downed = false;
	entity.statusArray = [];
	honeycomb.lab.repaint();
};

honeycomb.lab.setIntent = function (instanceId, cardIndex) {
	var entity = honeycomb.lab.entityById(instanceId);
	if (entity == null) return;
	var context = honeycomb.lab.context();
	var changed = honeycomb.changeIntent(entity, cardIndex == null || cardIndex === "" ? null : cardIndex, context);
	honeycomb.lab.closePicker();
	if (changed != true) { honeycomb.lab.note(honeycomb.entityName(entity) + " takes no intent."); return; }
	honeycomb.lab.play(context);
};

honeycomb.lab.applyStatus = function (instanceId, statusIndex) {
	var entity = honeycomb.lab.entityById(instanceId);
	if (entity == null) return;
	var stacks = honeycomb.lab.readNumber("labStatusStacks", 1);
	var context = honeycomb.lab.context();
	honeycomb.applyStatus(entity, statusIndex, Math.max(1, stacks), context);
	honeycomb.lab.repaint();
	honeycomb.lab.refreshPicker();
};

honeycomb.lab.clearStatuses = function (instanceId) {
	var entity = honeycomb.lab.entityById(instanceId);
	if (entity == null) return;
	entity.statusArray = [];
	honeycomb.lab.repaint();
	honeycomb.lab.refreshPicker();
};
