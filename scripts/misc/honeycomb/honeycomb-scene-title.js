//===================================================================================================
//HONEYCOMB CATACOMBS -- title hub, system menu, debug panel
//===================================================================================================
//Navigation and escape hatches. Three things live here, and they exist for one shared reason: the
//player must ALWAYS be able to get somewhere else.
//
//  TITLE SCENE   the hub. Continue, new run, roster, wipe. Where a boot lands with no run going.
//  SYSTEM MENU   reachable from the top bar on every screen. Abandon run, back to title, leave.
//  DEBUG PANEL   jump to any scene, wipe saves, force outcomes, edit resources, replay a seed.
//
//The rule this file enforces: NO SCREEN IS A DEAD END. Every scene carries the top bar, the top bar
//carries the menu, and the menu can always reach the title and the exit. A state that refuses input
//(a bugged combat phase, a half-built scene) must still be escapable, which is why the menu is
//rendered by the top bar rather than by any individual scene.
window.honeycomb = window.honeycomb || {};

//---------------------------------------------------------------------------------------------------
//Title hub
//---------------------------------------------------------------------------------------------------
honeycomb.scene.register({
	index: "title",
	build: function (root) {
		honeycomb.applyTuningToCss();
		//THE SAFETY NET FOR A STASHED RUN. An Event Gallery battle holds the player's run
		//aside and holds saving with it; every ordinary way out of that fight puts both back. Landing on
		//the title with a stash still held means the player left by some other door -- abandoning the
		//battle run from the system menu, say -- and the run and the autosave are restored here rather
		//than being left held for the rest of the session.
		if (honeycomb.gallery != null) honeycomb.gallery.releaseStash();
		var state = honeycomb.state;
		var hasRun = state.run != null;

		var markup = '<div class="hcScreen hcTitleScene">';
		//The painting behind the title (ART-GUIDE); the gradient shows until it exists.
		markup += '<div class="hcTitleBackdrop"><div class="hcSceneBackdrop">' + honeycomb.imageTag("backgrounds/title",
			{ className: "hcSceneBackdropArt", alt: "", silentFallback: true }) + "</div></div>";
		markup += '<div class="hcTitleInner">';

		markup += '<div class="hcTitleMark">';
		markup += honeycomb.ui.iconTag(null, "skull", "#c9a961", { className: "hcTitleGlyph" });
		markup += '<h1 class="hcTitleName">Honeycomb Catacombs</h1>';
		markup += '<div class="hcTitleSub hcMuted">' + honeycomb.escapeText(honeycomb.titleTagline()) + "</div>";
		markup += "</div>";

		markup += '<div class="hcTitleButtons">';
		if (hasRun) {
			markup += '<div class="hcButton hcPrimary hcTitleButton" onclick="honeycomb.title.continueRun()">' +
				honeycomb.ui.iconTag(null, "arrows", "#f0d89a", { className: "hcInlineIcon" }) +
				" Continue &mdash; Day " + state.run.day + "</div>";
			markup += '<div class="hcButton hcTitleButton" onclick="honeycomb.title.confirmAbandon()">' +
				honeycomb.ui.iconTag(null, "skull", "#d3455f", { className: "hcInlineIcon" }) +
				" Abandon Run</div>";
		} else {
			markup += '<div class="hcButton hcPrimary hcTitleButton" onclick="honeycomb.scene.go(\'teambuilding\')">' +
				honeycomb.ui.iconTag(null, "sword", "#f0d89a", { className: "hcInlineIcon" }) +
				" New Run</div>";
		}
		//The Compendium: everything the profile has found, which is also everything the shared pool pays
		//for. Its full scene is still to come; for now it opens the ledger it will be built on.
		markup += '<div class="hcButton hcTitleButton" onclick="honeycomb.overlay.open(\'compendium\')">' +
			honeycomb.ui.iconTag(null, "eye", "#c9b6dd", { className: "hcInlineIcon" }) + " Compendium</div>";

		//THE EVENT GALLERY. The same window the heart on the teambuilding top bar opens --
		//an overlay rather than a scene, so the title screen showing it costs nothing and the button is
		//in both places a player might look for it. It sits beside the Compendium because they are the
		//two ledgers of what a profile has seen.
		markup += '<div class="hcButton hcTitleButton" onclick="honeycomb.gallery.open()">' +
			honeycomb.ui.iconTag(null, "heart", "#ff5fd2", { className: "hcInlineIcon" }) + " Gallery</div>";

		//DEBUG TOOLS SIT HIGH. Testers reach for it constantly, so it stands above the settings buttons
		//rather than at the foot.
		if (honeycomb.tuning.debug.enabled == true) {
			markup += '<div class="hcButton hcTitleButton" onclick="honeycomb.overlay.open(\'debug\')">' +
				honeycomb.ui.iconTag(null, "eye", "#63d2a3", { className: "hcInlineIcon" }) + " Debug Tools</div>";
		}

		//The title has no top bar, so the two things a tester needs from a cold boot are offered here as
		//well as in the system menu: the whole screen, and the way a save gets in or out. Without this,
		//loading a bugged save meant starting a run first.
		if (honeycomb.platform.fullscreenAvailable() == true) {
			markup += '<div class="hcButton hcTitleButton" onclick="honeycomb.platform.toggleFullscreen();honeycomb.scene.refresh()">' +
				honeycomb.ui.iconTag(null, "expand", "#c9b6dd", { className: "hcInlineIcon" }) +
				" " + (honeycomb.platform.isFullscreen() == true ? "Leave Fullscreen" : "Fullscreen") + "</div>";
		}
		markup += '<div class="hcButton hcTitleButton" onclick="honeycomb.overlay.open(\'saveTransfer\')">' +
			honeycomb.ui.iconTag(null, "scroll", "#c9b6dd", { className: "hcInlineIcon" }) + " Copy / Load Save</div>";
		//Sound and music: the host's own buttons are hidden while honeycomb runs.
		markup += honeycomb.ui.soundButtons("honeycomb.scene.refresh()", "hcTitleButton");

		markup += '<div class="hcButton hcTitleButton" onclick="honeycomb.ui.confirmQuit()">' +
			honeycomb.ui.iconTag(null, "chevron", "#9c8fae", { className: "hcInlineIcon" }) +
			" " + honeycomb.escapeText(honeycomb.title.exitLabel()) + "</div>";
		markup += "</div>";

		//Lifetime progress: the shared experience pool, and how much of the game this profile has
		//actually seen. Shown on the hub because it is what carries between runs -- a lost run still
		//moved these numbers, which is the point of the whole system.
		markup += honeycomb.title.buildLifetimeBlock();

		//A quiet line of lifetime numbers, so the hub is not blank on a first visit.
		markup += '<div class="hcTitleStats hcTiny hcDim">' +
			state.profile.runsStarted + " started &middot; " +
			state.profile.runsWon + " won &middot; " +
			state.profile.runsLost + " lost</div>";

		markup += "</div></div>";
		root.innerHTML = markup;
	},
});

honeycomb.title = {};

//The experience pool and the discovery ledger, as one block. Silent when progression is switched off
//in tuning, so a build without meta-progression shows nothing rather than a row of zeroes.
honeycomb.title.buildLifetimeBlock = function () {
	if (honeycomb.tuning.progression.experienceEnabled != true) return "";

	var markup = '<div class="hcLifetime">';
	markup += '<div class="hcLifetimeTotal" title="' + honeycomb.escapeAttribute(honeycomb.ui.globalExperienceText) + '">' +
		honeycomb.ui.resourceIcon("experience", "hcLifetimeIcon") +
		'<span class="hcLifetimeValue">' + honeycomb.discovery.experience() + "</span>" +
		'<span class="hcTiny hcMuted">Global Experience</span></div>';

	//Each character's own experience, apart from the global pool and never added to it.
	var unlockedArray = honeycomb.state.profile.unlockedCharacterArray;
	markup += '<div class="hcLifetimePersonal">';
	for (var characterIndex = 0; characterIndex < unlockedArray.length; characterIndex++) {
		markup += honeycomb.ui.personalExperienceChip(unlockedArray[characterIndex], null);
	}
	markup += "</div>";

	markup += '<div class="hcLifetimeLedger">';
	var summaryArray = honeycomb.discovery.summaryArray();
	for (var scanIndex = 0; scanIndex < summaryArray.length; scanIndex++) {
		var summary = summaryArray[scanIndex];
		if (summary.total === 0) continue;
		var complete = summary.found >= summary.total;
		markup += '<div class="hcLifetimeRow' + (complete ? " hcEarned" : "") + '">' +
			'<span class="hcGrow">' + honeycomb.escapeText(summary.name) + "</span>" +
			'<span class="hcLifetimeCount">' + summary.found + " / " + summary.total + "</span></div>";
	}
	markup += "</div></div>";
	return markup;
};

//---------------------------------------------------------------------------------------------------
//The Compendium
//---------------------------------------------------------------------------------------------------
//THREE SUBPAGES, so no one screen carries everything:
//  overview   the discovery ledger: every kind, how many found, and what they were
//  cards      one character at a time, with the broken-forms toggle
//  bestiary   every enemy, its stats and its whole move set, seen moves face up
//Reading honeycomb.discoveryKindArray and honeycomb.enemyArray directly means new content appears here
//with no change to this screen.
honeycomb.compendium = { tab: "overview", characterIndex: null, enemyIndex: null, showBroken: false };

honeycomb.compendium.tabArray = [
	{ index: "overview", name: "Overview" },
	{ index: "cards", name: "Cards" },
	{ index: "bestiary", name: "Bestiary" },
];

honeycomb.overlay.register({
	index: "compendium",
	closeOnBackdrop: true,
	build: function (layer) {
		layer.innerHTML = honeycomb.compendium.render();
	},
});

honeycomb.compendium.repaint = function () {
	for (var scanIndex = honeycomb.overlay.openArray.length - 1; scanIndex >= 0; scanIndex--) {
		if (honeycomb.overlay.openArray[scanIndex].index != "compendium") continue;
		honeycomb.overlay.openArray[scanIndex].element.innerHTML = honeycomb.compendium.render();
		return;
	}
};

honeycomb.compendium.show = function (tab) {
	honeycomb.compendium.tab = tab;
	honeycomb.platform.sound("uiClick");
	honeycomb.compendium.repaint();
};

honeycomb.compendium.showCharacter = function (characterIndex) {
	honeycomb.compendium.characterIndex = characterIndex;
	honeycomb.platform.sound("uiClick");
	honeycomb.compendium.repaint();
};

honeycomb.compendium.showEnemy = function (enemyIndex) {
	honeycomb.compendium.enemyIndex = enemyIndex;
	honeycomb.platform.sound("uiClick");
	honeycomb.compendium.repaint();
};

//Back to the wall of faces. Null is the grid; an index is the two-pane reader.
honeycomb.compendium.backToGrid = function (field) {
	honeycomb.compendium[field] = null;
	honeycomb.platform.sound("uiBack");
	honeycomb.compendium.repaint();
};

//---------------------------------------------------------------------------------------------------
//The picker
//---------------------------------------------------------------------------------------------------
//Syrup Town's logbook is two stages, and that is what is copied here: `generateLogbook` draws a WALL OF
//FACES -- a portrait tile per character, bordered in their own colour -- and picking one opens
//`generateNav`, a window with a rail of names down the left and the chosen entry filling the right.
//Nothing is ever a long scroll of whole entries; you choose a face, then read one thing at a time and
//move sideways through the rail.
//
//One component serves both tabs, because "pick a thing, then read it" is the same question for an enemy
//and for a character. An item is `{ index, name, group, known, faceMarkup }`; the caller passes the call
//that selects one and a function that draws the chosen one.
//THE COMPONENT MOVED to honeycomb.ui.picker when the Event Gallery needed the same
//wall-of-faces. This is the name the Compendium's own pages call it by.
honeycomb.compendium.renderPicker = function (options) {
	return honeycomb.ui.picker(options);
};

honeycomb.compendium.toggleBroken = function () {
	honeycomb.compendium.showBroken = honeycomb.compendium.showBroken != true;
	honeycomb.platform.sound("uiClick");
	honeycomb.compendium.repaint();
};

honeycomb.compendium.render = function () {
	var tab = honeycomb.compendium.tab;
	var markup = '<div class="hcOverlayPanel hcCompendiumPanel">';
	markup += '<h2 class="hcOverlayTitle">Compendium</h2>';
	markup += '<div class="hcOverlayBody hcTiny hcMuted">Everything found so far. Finding something for the first time pays into the shared experience pool.</div>';
	markup += '<div class="hcSegmented hcCompendiumTabs">';
	for (var tabIndex = 0; tabIndex < honeycomb.compendium.tabArray.length; tabIndex++) {
		var entry = honeycomb.compendium.tabArray[tabIndex];
		markup += '<div class="hcSegment' + (entry.index == tab ? " hcOn" : "") +
			'" onclick="honeycomb.compendium.show(\'' + entry.index + '\')">' + honeycomb.escapeText(entry.name) + "</div>";
	}
	markup += "</div>";
	markup += '<div class="hcCompendiumList hcScroll">';
	if (tab == "cards") markup += honeycomb.compendium.renderCards();
	else if (tab == "bestiary") markup += honeycomb.compendium.renderBestiary();
	else markup += honeycomb.compendium.renderOverview();
	markup += "</div>";
	markup += '<div class="hcOverlayButtonRow"><div class="hcButton hcPrimary" onclick="honeycomb.overlay.close(\'compendium\')">Close</div></div>';
	markup += "</div>";
	return markup;
};

//THE LEDGER: every discovery kind, how many of each have been found, and what they were. Unfound things
//are shown as unfound rather than hidden: knowing a thing exists is most of what makes finding it worth
//doing.
honeycomb.compendium.renderOverview = function () {
	var markup = "";
	for (var kindIndex = 0; kindIndex < honeycomb.discoveryKindArray.length; kindIndex++) {
		var kind = honeycomb.discoveryKindArray[kindIndex];
		var allArray = honeycomb.discovery.allIndexArray(kind.index);
		if (allArray.length === 0) continue;
		markup += '<div class="hcCompendiumKind">';
		markup += '<div class="hcSectionTitleRow"><div class="hcSectionTitle hcGrow">' + honeycomb.escapeText(kind.name) +
			'</div><span class="hcCountBadge">' + honeycomb.discovery.count(kind.index) + " / " + allArray.length + "</span></div>";
		markup += '<div class="hcCompendiumEntries">';
		for (var entryIndex = 0; entryIndex < allArray.length; entryIndex++) {
			var known = honeycomb.discovery.isKnown(kind.index, allArray[entryIndex]);
			markup += '<span class="hcCompendiumEntry' + (known ? " hcKnown" : "") + '">' +
				honeycomb.escapeText(known ? kind.nameFor(allArray[entryIndex]) : "???") + "</span>";
		}
		markup += "</div></div>";
	}
	return markup;
};

//THE CARDS: one character at a time, with the broken-forms toggle. Rates are not shown -- the Compendium
//is a ledger of what has been found, not a plan for what to chase.
honeycomb.compendium.renderCards = function () {
	//The same wall-of-faces the bestiary uses, with the roster's own portraits -- which is very nearly
	//the logbook's own front page. A character still in development is left out: a face
	//that opens an empty pool is worse than no face.
	var rosterArray = honeycomb.shippedCharacterArray();
	var itemArray = [];
	for (var characterScan = 0; characterScan < rosterArray.length; characterScan++) {
		var character = rosterArray[characterScan];
		var unlocked = honeycomb.state != null && honeycomb.state.profile != null &&
			honeycomb.state.profile.unlockedCharacterArray != null
			? honeycomb.state.profile.unlockedCharacterArray.indexOf(character.index) >= 0
			: true;
		itemArray.push({
			index: character.index,
			name: character.name,
			group: null,
			known: unlocked,
			faceMarkup: honeycomb.art.portraitTag(character.index, character.defaultOutfit,
				{ className: "hcPickerFaceArt", alt: character.name }),
		});
	}

	var characterIndex = honeycomb.compendium.characterIndex;
	if (characterIndex != null && honeycomb.findDefinition(honeycomb.characterArray, characterIndex) == null) characterIndex = null;

	var detailMarkup = "";
	if (characterIndex != null) {
		detailMarkup += '<div class="hcCompendiumControls"><div class="hcSegment' +
			(honeycomb.compendium.showBroken == true ? " hcOn" : "") +
			'" onclick="honeycomb.compendium.toggleBroken()">Show broken forms</div>' +
			'<span class="hcTiny hcMuted">What each card becomes while its owner is Broken.</span></div>';
		detailMarkup += '<div class="hcCompendiumKind">';
		detailMarkup += '<div class="hcSectionTitleRow"><div class="hcSectionTitle hcGrow">' +
			honeycomb.escapeText(honeycomb.findDefinition(honeycomb.characterArray, characterIndex).name) +
			' &mdash; Cards</div></div>';
		detailMarkup += honeycomb.cardCollectionMarkup(characterIndex, { showBroken: honeycomb.compendium.showBroken == true });
		detailMarkup += "</div>";
	}

	return honeycomb.compendium.renderPicker({
		itemArray: itemArray,
		selectedIndex: characterIndex,
		plural: "characters",
		selectCall: "honeycomb.compendium.showCharacter('%s')",
		backCall: "honeycomb.compendium.backToGrid('characterIndex')",
		detailMarkup: detailMarkup,
	});
};

//THE BESTIARY: every enemy this build can field, with its own details and its whole move set -- the same
//information the in-combat move window shows, plus the stats a player would learn by fighting it. An
//enemy not yet met stays ???: its moves are listed but face down, as they are in a fight.
//One enemy's page: its stats beside its face, and its whole move set under it. This is what the
//picker draws on the right once a face has been chosen. An enemy not yet met stays ???, with its
//moves face down, exactly as they are in a fight.
honeycomb.compendium.renderBestiaryEntry = function (enemy) {
	if (enemy == null) return "";
	var met = honeycomb.discovery.isKnown("enemy", enemy.index);
	//A display combatant, not a live one: the move grid and the strategy read its kit and nothing
	//else. `combat` null means nothing is marked as next.
	var display = {
		instanceId: null, enemyIndex: enemy.index, side: "enemy",
		health: enemy.baseHealth, maxHealth: enemy.baseHealth, statusArray: [], downed: false,
	};
	var strategy = honeycomb.aiStrategyFor(display);
	var habit = strategy == null ? null : honeycomb.findDefinition(honeycomb.enemyMoves.habitArray, strategy.index);
	var healthText = "Health " + enemy.baseHealth +
		(enemy.healthVariance == null || enemy.healthVariance <= 0 ? "" : " &plusmn;" + enemy.healthVariance);
	var goldText = enemy.goldReward == null ? "" : "Gold " + enemy.goldReward.minimum + "&ndash;" + enemy.goldReward.maximum;

	var markup = '<div class="hcBestiaryEntry' + (met ? "" : " hcUnknownEnemy") + '">';
	markup += '<div class="hcBestiaryHeader">';
	if (met) {
		markup += honeycomb.art.chainTag(honeycomb.art.enemyPortraitChain(enemy.index),
			{ className: "hcBestiaryFace", alt: enemy.name });
	} else {
		markup += '<div class="hcBestiaryFace hcDim">?</div>';
	}
	markup += '<div class="hcGrow"><div class="hcBestiaryName">' + honeycomb.escapeText(met ? enemy.name : "???") + "</div>";
	if (enemy.tagArray != null && enemy.tagArray.length > 0) {
		markup += '<div class="hcBestiaryTags">';
		for (var tagIndex = 0; tagIndex < enemy.tagArray.length; tagIndex++) {
			var tag = enemy.tagArray[tagIndex];
			markup += '<span class="hcBestiaryTag"' + honeycomb.tooltip.attributes("tag", tag) + ">" +
				honeycomb.escapeText(honeycomb.tagName(tag)) + "</span>";
		}
		markup += "</div>";
	}
	markup += '<div class="hcTiny hcMuted">' + healthText + (goldText === "" ? "" : " &middot; " + goldText) +
		(habit == null || met == false ? "" : " &middot; " + honeycomb.escapeText(habit.text)) + "</div>";
	markup += "</div></div>";
	markup += honeycomb.enemyMoves.moveGridMarkup(display, null, enemy.index);
	markup += "</div>";
	return markup;
};

//WHO IS ON THE WALL, in reading order.
//
//SEALED ENEMIES ARE NOT. Anastasia's twelve pieces and the gauntlet's boss were twelve
//"???" faces promising a secret -- exactly what BASICS forbids. A face appears once it is met, or once
//the profile has earned her (honeycomb.discovery.isSealed).
//
//NEITHER IS SET DRESSING. A `setDressing` entry carries a drawing and a name for a backdrop prop and
//nothing else -- no fight can reach one -- so a page about it is a page about a thing that is not there.
honeycomb.compendium.bestiaryEnemyArray = function () {
	return honeycomb.enemyArray.filter(function (enemy) {
		if (honeycomb.discovery.isUnlisted("enemy", enemy.index) == true) return false;
		return honeycomb.discovery.isSealed("enemy", enemy.index) != true;
	}).sort(honeycomb.compareEnemiesForReading);
};

//THE BESTIARY, as the logbook's wall of faces. The old screen was every enemy's whole block stacked
//into one scroll: thirty-six blocks is a lot of scrolling to answer "what was that crab".
honeycomb.compendium.renderBestiary = function () {
	var orderedArray = honeycomb.compendium.bestiaryEnemyArray();
	var itemArray = [];
	for (var enemyScan = 0; enemyScan < orderedArray.length; enemyScan++) {
		var enemy = orderedArray[enemyScan];
		itemArray.push({
			index: enemy.index,
			name: enemy.name,
			group: honeycomb.compendium.enemyGroupName(enemy),
			known: honeycomb.discovery.isKnown("enemy", enemy.index),
			faceMarkup: honeycomb.art.chainTag(honeycomb.art.enemyPortraitChain(enemy.index),
				{ className: "hcPickerFaceArt", alt: enemy.name }),
		});
	}
	var selected = honeycomb.compendium.enemyIndex;
	if (selected != null && honeycomb.findDefinition(honeycomb.enemyArray, selected) == null) selected = null;
	return honeycomb.compendium.renderPicker({
		itemArray: itemArray,
		selectedIndex: selected,
		plural: "enemies",
		selectCall: "honeycomb.compendium.showEnemy('%s')",
		backCall: "honeycomb.compendium.backToGrid('enemyIndex')",
		detailMarkup: honeycomb.compendium.renderBestiaryEntry(
			honeycomb.findDefinition(honeycomb.enemyArray, selected)),
	});
};

//The heading a group of enemies sits under. The role's own name, title-cased, with the two that are
//really tiers named as tiers -- a reader thinks "elites" and "bosses", not "the elite role".
honeycomb.compendium.enemyGroupHeadingArray = [
	{ index: "minion", name: "Minions" },
	{ index: "striker", name: "Strikers" },
	{ index: "soldier", name: "Soldiers" },
	{ index: "tank", name: "Tanks" },
	{ index: "support", name: "Support" },
	{ index: "caster", name: "Casters" },
	{ index: "elite", name: "Elites" },
	//>>> LANE E7 | flora | boss half heading >>>
	//E7 NOTE FOR LANE ANA: this is the ONE line lane E7 added to a scene file, and only because the
	//heading table must cover every role tuning.balance.enemyRoleArray declares or an enemy written to
	//a new role lands silently in "Other". Half-bosses read as bosses to the player; the split is a
	//budgeting fact, not something the compendium should say out loud.
	{ index: "bossHalf", name: "Bosses" },
	//<<< LANE E7 | flora | boss half heading <<<
	{ index: "boss", name: "Bosses" },
];

honeycomb.compendium.enemyGroupName = function (enemy) {
	if (enemy == null) return "Other";
	//Anastasia's golems are summons from a character who is not on the roster, not part of the run's
	//bestiary, so they read as their own block at the end rather than as more minions.
	if (honeycomb.definitionHasTag(enemy, "golem")) return "Golems";
	var heading = honeycomb.findDefinition(honeycomb.compendium.enemyGroupHeadingArray, enemy.role);
	return heading == null ? "Other" : heading.name;
};


//Flavour under the logo, varied by how far along the player is.
honeycomb.titleTaglineArray = [
	{ index: "first", atOrBelowRuns: 0, text: "Something down there is still counting." },
	{ index: "early", atOrBelowRuns: 3, text: "The bricks are older than the bones." },
	{ index: "later", atOrBelowRuns: null, text: "It remembers you." },
];

honeycomb.titleTagline = function () {
	var runs = honeycomb.state.profile.runsStarted;
	for (var scanIndex = 0; scanIndex < honeycomb.titleTaglineArray.length; scanIndex++) {
		var entry = honeycomb.titleTaglineArray[scanIndex];
		if (entry.atOrBelowRuns == null || runs <= entry.atOrBelowRuns) return entry.text;
	}
	return "";
};

//Where "leave" actually goes depends on whether there is a host to go back to.
honeycomb.title.exitLabel = function () {
	return honeycomb.platform.host == "syrup-town" ? "Back to Syrup Town" : "Close";
};

honeycomb.title.continueRun = function () {
	honeycomb.platform.sound("uiClick");
	honeycomb.resume();
};

honeycomb.title.confirmAbandon = function () {
	honeycomb.overlay.open("confirm", {
		title: "Abandon the run?",
		body: "The party, the deck and everything carried are lost. This cannot be undone.",
		confirmLabel: "Abandon",
		cancelLabel: "Keep going",
		onConfirm: "honeycomb.title.abandonRun()",
	});
};

//Ends a run without a victory or a defeat. Counts as a loss, so the numbers stay honest.
honeycomb.title.abandonRun = function () {
	honeycomb.platform.sound("uiBack");
	honeycomb.finishRun(false);
	honeycomb.scene.go("title");
};

//---------------------------------------------------------------------------------------------------
//System menu
//---------------------------------------------------------------------------------------------------
//Opened by the top bar's Menu button on every screen. Replaces the old behaviour, which jumped
//straight to a quit confirmation and offered no way back to the title.
honeycomb.overlay.register({
	index: "systemMenu",
	closeOnBackdrop: true,
	build: function (layer) {
		var hasRun = honeycomb.state.run != null;
		var inCombat = hasRun && honeycomb.state.run.combat != null;

		var markup = '<div class="hcOverlayPanel hcMenuPanel">';
		markup += '<h2 class="hcOverlayTitle">Menu</h2>';
		markup += '<div class="hcMenuButtons">';

		markup += '<div class="hcButton hcPrimary" onclick="honeycomb.overlay.close(\'systemMenu\')">Resume</div>';

		if (honeycomb.scene.current != "title") {
			markup += '<div class="hcButton" onclick="honeycomb.systemMenu.toTitle()">Honeycomb Title</div>';
		}
		//Leaving a fight mid-way forfeits it, so it is worded as forfeiting rather than as going back.
		if (inCombat) {
			markup += '<div class="hcButton" onclick="honeycomb.systemMenu.confirmForfeit()">Forfeit Battle</div>';
		}
		if (hasRun) {
			markup += '<div class="hcButton" onclick="honeycomb.overlay.close(\'systemMenu\');honeycomb.title.confirmAbandon()">Abandon Run</div>';
		}
		if (honeycomb.platform.fullscreenAvailable() == true) {
			markup += '<div class="hcButton" onclick="honeycomb.platform.toggleFullscreen();honeycomb.overlay.close(\'systemMenu\')">' +
				(honeycomb.platform.isFullscreen() == true ? "Leave Fullscreen" : "Fullscreen") + "</div>";
		}
		//Sound and music, reachable from inside a fight.
		markup += honeycomb.ui.soundButtons("honeycomb.systemMenu.repaint()");
		//And the play speed, as a slider over every named step. On the menu as well
		//as the combat shelf so a cut-in can be slowed down before a fight is even entered.
		markup += honeycomb.ui.playSpeedSlider("honeycomb.systemMenu.repaint()");
		//Always offered, not only in the debug build: a tester on a phone or another machine has no
		//other way to hand a bugged state over.
		markup += '<div class="hcButton" onclick="honeycomb.overlay.open(\'saveTransfer\')">Copy / Load Save</div>';
		if (honeycomb.tuning.debug.enabled == true) {
			markup += '<div class="hcButton" onclick="honeycomb.overlay.open(\'debug\')">Debug Tools</div>';
		}
		markup += '<div class="hcButton" onclick="honeycomb.ui.confirmQuit()">' +
			honeycomb.escapeText(honeycomb.title.exitLabel()) + "</div>";

		markup += "</div></div>";
		layer.innerHTML = markup;
	},
});

honeycomb.systemMenu = {};

//Redraws the menu in place, for a button whose own label changes when it is pressed (sound, music).
honeycomb.systemMenu.repaint = function () {
	var layer = document.getElementById(honeycomb.tuning.dom.overlayIdPrefix + "systemMenu");
	if (layer == null) return;
	honeycomb.overlay.close("systemMenu");
	honeycomb.overlay.open("systemMenu");
};

//---------------------------------------------------------------------------------------------------
//Copy / load a save
//---------------------------------------------------------------------------------------------------
//THE WAY A BUGGED STATE LEAVES THE MACHINE. The whole save, wrapped as a bug report
//with the browser, the screen and the last errors beside it, in a box that can be copied; and a second
//box that loads one back. A tester who hits something copies the text out and can stop playing -- the
//bug travels with the text. No server, nothing that needs a working game around it beyond this one panel.
//
//THE TEXT IS PACKED, AND THERE IS A .noodle FILE. The copy box holds honeycomb.save.pack's output,
//about a quarter of the plain length, and Save to
//.noodle file downloads that same text the way Syrup Town's saveTXT does. Loading takes packed text,
//a plain report or a plain save, from the box or from a file. The file download was left out before
//for fear a Cordova build would not allow it; Syrup Town's APK ships the same download, and the copy
//box stays beside it for any build where it does not work.
honeycomb.overlay.register({
	index: "saveTransfer",
	build: function (layer) {
		//Packed afresh every time the panel opens, so the box never holds an older state.
		honeycomb.saveTransfer.packedText = null;
		layer.innerHTML = honeycomb.saveTransfer.render();
		honeycomb.saveTransfer.startPacking();
	},
});

//`packedText` is null while packing is under way. `packRequest` counts requests, so a slow pack started
//for an earlier opening of the panel cannot overwrite a newer one.
honeycomb.saveTransfer = { message: "", packedText: null, packRequest: 0 };

honeycomb.saveTransfer.startPacking = function () {
	honeycomb.saveTransfer.packRequest++;
	var request = honeycomb.saveTransfer.packRequest;
	honeycomb.save.pack(honeycomb.save.toReportText()).then(function (text) {
		if (request !== honeycomb.saveTransfer.packRequest) return;
		honeycomb.saveTransfer.packedText = text;
		honeycomb.saveTransfer.repaint();
	});
};

honeycomb.saveTransfer.render = function () {
	var ready = honeycomb.saveTransfer.packedText != null;
	var markup = '<div class="hcOverlayPanel hcTransferPanel">';
	markup += '<h2 class="hcOverlayTitle">Copy / Load Save</h2>';
	markup += '<div class="hcTabNote">Copy the text below, or save it as a .noodle file, to keep this exact state or to send it with a bug report. ' +
		'Paste one into the second box, or pick a .noodle file, to load it -- it replaces the current save.</div>';
	if (honeycomb.saveTransfer.message !== "") {
		markup += '<div class="hcTabNote hcTransferMessage">' + honeycomb.escapeText(honeycomb.saveTransfer.message) + "</div>";
	}
	markup += '<div class="hcTransferRow"><span class="hcTiny hcMuted">This save, as text (includes the last errors the page threw)' +
		(ready ? ", " + honeycomb.saveTransfer.packedText.length.toLocaleString() + " characters" : "") + ":</span>" +
		'<div class="hcTransferButtons">' +
		'<div class="hcButton hcSmall" onclick="honeycomb.saveTransfer.copy()">Copy to clipboard</div>' +
		'<div class="hcButton hcSmall" onclick="honeycomb.saveTransfer.download()">Save to .noodle file</div>' +
		"</div></div>";
	markup += '<textarea class="hcTransferBox" id="honeycombTransferOut" readonly onclick="this.select()">' +
		(ready ? honeycomb.escapeText(honeycomb.saveTransfer.packedText) : "Packing the save...") + "</textarea>";
	markup += '<div class="hcTransferRow"><span class="hcTiny hcMuted">Paste a save or report here:</span>' +
		'<div class="hcTransferButtons">' +
		'<div class="hcButton hcSmall" onclick="honeycomb.saveTransfer.load()">Load</div>' +
		//A label wrapping a hidden file input, so the picker opens from a button that matches the others.
		'<label class="hcButton hcSmall">Load from .noodle file' +
		'<input type="file" id="honeycombTransferFile" class="hcTransferFile" accept=".noodle,.txt" ' +
		'onchange="honeycomb.saveTransfer.loadFile(this)"></label>' +
		"</div></div>";
	markup += '<textarea class="hcTransferBox" id="honeycombTransferIn" placeholder="Paste here"></textarea>';
	markup += '<div class="hcOverlayButtonRow"><div class="hcButton hcPrimary" onclick="honeycomb.saveTransfer.close()">Close</div></div>';
	markup += "</div>";
	return markup;
};

//Keeps whatever is in the paste box. The packed text arrives a moment after the panel opens and repaints
//it, and a paste made in that moment would otherwise be wiped.
honeycomb.saveTransfer.repaint = function () {
	var layer = document.getElementById(honeycomb.tuning.dom.overlayIdPrefix + "saveTransfer");
	if (layer == null) return;
	var pasteBox = document.getElementById("honeycombTransferIn");
	var pasted = pasteBox == null ? "" : pasteBox.value;
	layer.innerHTML = honeycomb.saveTransfer.render();
	var newPasteBox = document.getElementById("honeycombTransferIn");
	if (newPasteBox != null) newPasteBox.value = pasted;
};

honeycomb.saveTransfer.copy = function () {
	var box = document.getElementById("honeycombTransferOut");
	if (box == null) return;
	var text = box.value;
	//The clipboard API needs a secure page and a user gesture; the selection fallback works anywhere.
	var done = function (ok) {
		honeycomb.saveTransfer.message = ok ? "Copied." : "Could not reach the clipboard -- select the text and copy it by hand.";
		honeycomb.saveTransfer.repaint();
	};
	if (typeof navigator != "undefined" && navigator.clipboard != null && typeof navigator.clipboard.writeText === "function") {
		navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(honeycomb.saveTransfer.copyBySelection(box)); });
		return;
	}
	done(honeycomb.saveTransfer.copyBySelection(box));
};

honeycomb.saveTransfer.copyBySelection = function (box) {
	try {
		box.focus();
		box.select();
		return document.execCommand("copy") == true;
	} catch (copyError) {
		return false;
	}
};

honeycomb.saveTransfer.load = function () {
	var box = document.getElementById("honeycombTransferIn");
	if (box == null || box.value.trim() === "") return;
	honeycomb.saveTransfer.loadText(box.value, "That text is not a Honeycomb save.");
};

//Both load buttons end here. The state is only replaced once the text has been read in full, so a
//damaged paste or the wrong file leaves the current save exactly as it was.
honeycomb.saveTransfer.loadText = function (text, failMessage) {
	honeycomb.save.fromAnyText(text).then(function (loaded) {
		if (loaded != true) {
			honeycomb.saveTransfer.message = failMessage;
			honeycomb.saveTransfer.repaint();
			return;
		}
		honeycomb.save.autosave();
		honeycomb.saveTransfer.message = "";
		honeycomb.overlay.closeAll();
		honeycomb.resume();
	});
};

honeycomb.saveTransfer.loadFile = function (input) {
	var file = input == null || input.files == null ? null : input.files[0];
	if (file == null) return;
	var reader = new FileReader();
	reader.onload = function () {
		honeycomb.saveTransfer.loadText(String(reader.result), "That file is not a Honeycomb save.");
	};
	reader.onerror = function () {
		honeycomb.saveTransfer.message = "That file could not be read.";
		honeycomb.saveTransfer.repaint();
	};
	reader.readAsText(file);
	//Cleared so picking the same file a second time still fires onchange.
	input.value = "";
};

//Save to .noodle file. The same download Syrup Town's saveTXT makes: a Blob behind a link that is
//clicked once and removed. Waits for the packed text rather than saving the plain report, so the file
//and the box always agree.
honeycomb.saveTransfer.download = function () {
	var text = honeycomb.saveTransfer.packedText;
	if (text == null) {
		honeycomb.saveTransfer.message = "Still packing the save -- try again in a moment.";
		honeycomb.saveTransfer.repaint();
		return;
	}
	try {
		var url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
		var link = document.createElement("a");
		link.href = url;
		link.download = honeycomb.save.fileName();
		link.style.display = "none";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		//Revoked on the next tick: some browsers start the download after click() returns.
		setTimeout(function () { URL.revokeObjectURL(url); });
		honeycomb.saveTransfer.message = "Saved as " + link.download + ".";
	} catch (downloadError) {
		console.error("Honeycomb: .noodle download failed", downloadError);
		honeycomb.saveTransfer.message = "This browser would not save a file -- copy the text instead.";
	}
	honeycomb.saveTransfer.repaint();
};

honeycomb.saveTransfer.close = function () {
	honeycomb.saveTransfer.message = "";
	honeycomb.overlay.close("saveTransfer");
};

//---------------------------------------------------------------------------------------------------
//The card report
//---------------------------------------------------------------------------------------------------
//The ledger is in honeycomb.telemetry (localStorage, its own namespace); this is the way to get it out,
//shaped exactly like Copy / Load Save: a box to copy from, no file download, no server. On neocities
//this is the whole answer -- a tester plays, opens Debug Tools, copies, and pastes it back.
honeycomb.overlay.register({
	index: "cardReport",
	build: function (layer) {
		layer.innerHTML = honeycomb.cardReport.render();
	},
});

honeycomb.cardReport = { message: "" };

honeycomb.cardReport.render = function () {
	var markup = '<div class="hcOverlayPanel hcTransferPanel">';
	markup += '<h2 class="hcOverlayTitle">Card Report</h2>';
	markup += '<div class="hcTabNote">How often each card was offered and taken, counted across every run ' +
		'this browser has played. Copy the text below and paste it back with your feedback.</div>';
	if (honeycomb.cardReport.message !== "") {
		markup += '<div class="hcTabNote hcTransferMessage">' + honeycomb.escapeText(honeycomb.cardReport.message) + "</div>";
	}
	markup += '<div class="hcTransferRow"><span class="hcTiny hcMuted">The ledger, as text:</span>' +
		'<div class="hcButton hcSmall" onclick="honeycomb.cardReport.copy()">Copy to clipboard</div></div>';
	markup += '<textarea class="hcTransferBox" id="honeycombCardReportOut" readonly onclick="this.select()">' +
		honeycomb.escapeText(honeycomb.telemetry.reportText()) + "</textarea>";
	markup += '<div class="hcOverlayButtonRow">' +
		'<div class="hcButton hcDanger" onclick="honeycomb.cardReport.clear()">Clear the counters</div>' +
		'<div class="hcButton hcPrimary" onclick="honeycomb.cardReport.close()">Close</div></div>';
	markup += "</div>";
	return markup;
};

honeycomb.cardReport.repaint = function () {
	var layer = document.getElementById(honeycomb.tuning.dom.overlayIdPrefix + "cardReport");
	if (layer != null) layer.innerHTML = honeycomb.cardReport.render();
};

honeycomb.cardReport.copy = function () {
	var box = document.getElementById("honeycombCardReportOut");
	if (box == null) return;
	var done = function (ok) {
		honeycomb.cardReport.message = ok ? "Copied." : "Could not reach the clipboard -- select the text and copy it by hand.";
		honeycomb.cardReport.repaint();
	};
	if (typeof navigator != "undefined" && navigator.clipboard != null && typeof navigator.clipboard.writeText === "function") {
		navigator.clipboard.writeText(box.value).then(function () { done(true); },
			function () { done(honeycomb.saveTransfer.copyBySelection(box)); });
		return;
	}
	done(honeycomb.saveTransfer.copyBySelection(box));
};

honeycomb.cardReport.clear = function () {
	honeycomb.telemetry.clear();
	honeycomb.cardReport.message = "Counters cleared.";
	honeycomb.cardReport.repaint();
};

honeycomb.cardReport.close = function () {
	honeycomb.cardReport.message = "";
	honeycomb.overlay.close("cardReport");
};

honeycomb.systemMenu.toTitle = function () {
	//An unfinished fight is left in place, not discarded: Continue on the title picks it back up.
	honeycomb.save.autosave("nodeComplete");
	honeycomb.overlay.closeAll();
	honeycomb.scene.go("title");
};

honeycomb.systemMenu.confirmForfeit = function () {
	honeycomb.overlay.open("confirm", {
		title: "Forfeit the battle?",
		body: "The fight counts as a loss and the run ends.",
		confirmLabel: "Forfeit",
		cancelLabel: "Fight on",
		onConfirm: "honeycomb.systemMenu.forfeit()",
	});
};

honeycomb.systemMenu.forfeit = function () {
	honeycomb.overlay.closeAll();
	honeycomb.combat.clear();
	honeycomb.finishRun(false);
	honeycomb.scene.go("title");
};

//---------------------------------------------------------------------------------------------------
//Debug panel
//---------------------------------------------------------------------------------------------------
//Everything needed to test a screen without playing to it. Gated behind tuning.debug.enabled so a
//release build hides it without deleting it.
//
//Actions are declared as a table rather than written into the markup, so adding a tool is one entry
//and each one carries its own availability rule.
honeycomb.debugActionArray = [
	{
		index: "wipeSaves",
		name: "Wipe all Honeycomb saves",
		detail: "Clears every Honeycomb slot and starts a fresh profile. Syrup Town saves are untouched.",
		glyph: "skull",
		color: "#d3455f",
		run: function () {
			var wiped = honeycomb.save.hardReset();
			honeycomb.overlay.closeAll();
			honeycomb.scene.go("title");
			honeycomb.debug.notify(wiped + " slot(s) wiped. Fresh profile loaded.");
		},
	},
	{
		index: "toTeambuilding",
		name: "Go to Teambuilding",
		detail: "Opens the roster. Works with or without a run in progress.",
		glyph: "bag",
		color: "#c9b6dd",
		run: function () { honeycomb.overlay.closeAll(); honeycomb.scene.go("teambuilding"); },
	},
	{
		index: "toMap",
		name: "Go to Map",
		detail: "Starts a run with the current roster if one is not already going.",
		glyph: "arrows",
		color: "#c9a961",
		run: function () {
			if (honeycomb.state.run == null || honeycomb.state.run.map == null) {
				honeycomb.teambuilding.startRun();
			}
			honeycomb.overlay.closeAll();
			honeycomb.scene.go("map");
		},
	},
	{
		index: "grantGlobalExperience",
		name: "Grant global experience",
		detail: "Adds the amount in the Experience box to the shared global pool, so a tree can be walked " +
			"without a run's worth of play.",
		glyph: "star",
		color: "#7fd1a6",
		run: function () {
			var amount = honeycomb.debug.grantExperienceAmount;
			honeycomb.addResource("experience", amount);
			honeycomb.debug.notify("Granted " + amount + " global experience.");
		},
	},
	{
		index: "grantPersonalExperience",
		name: "Grant personal experience",
		detail: "Adds the amount in the Experience box to EVERY character's own pool, fielded or benched.",
		glyph: "scroll",
		color: "#c9a961",
		run: function () {
			var amount = honeycomb.debug.grantExperienceAmount;
			for (var characterIndex = 0; characterIndex < honeycomb.characterArray.length; characterIndex++) {
				honeycomb.progression.addPersonalExperience(honeycomb.characterArray[characterIndex].index, amount);
			}
			honeycomb.debug.notify("Granted " + amount + " personal experience to every character.");
		},
	},
	{
		//REPLACES "Start a test battle". The old button dropped into a fixed
		//encounter and left the tester to draft their way to whatever they wanted to see.
		index: "battleLab",
		name: "Battle Lab (empty battle)",
		detail: "Turns the battle screen into an editor and drops into a fight with nothing opposite. " +
			"The + at the end of a line adds a body and the \u2212 on one takes it off; a telegraph " +
			"opens the move picker; a nameplate opens HP, tHP, Lust and every status; the energy orb " +
			"opens energy; and the DECK opens every card in the game, as card faces, to draw straight " +
			"to hand. Win and loss checks are suspended. The LAB badge in the corner turns it off.",
		glyph: "sword",
		color: "#e05a4a",
		run: function () { honeycomb.lab.start(); },
	},
	{
		//STRAIGHT INTO THE GAUNTLET. It does the four things that otherwise stand in the
		//way -- earn her, put her in the party, flip the release switch for this session, and build the
		//corridor -- and then hands over at row one. The switch is restored when the game is reloaded,
		//since it is written in the tuning file and not in the save.
		index: "toGauntlet",
		name: "Play the Gauntlet",
		//Names her, so it is not drawn at all unless tuning.debug.showsSecrets.
		secret: true,
		detail: "Unlocks Anastasia, puts her in the party, turns the gauntlet switch on for this session " +
			"and drops you at the first step of The Quiet Gallery. Six rows, no branches: Celestial, " +
			"Infernal, rest, the Black Court, rest, and The Last Board with her in it.",
		glyph: "star",
		color: "#d8b25c",
		run: function () {
			var profile = honeycomb.state.profile;
			if (profile.unlockedCharacterArray == null) profile.unlockedCharacterArray = [];
			var unlockCharacter = honeycomb.tuning.chessmaster.gauntlet.unlockCharacter;
			if (profile.unlockedCharacterArray.indexOf(unlockCharacter) < 0) {
				profile.unlockedCharacterArray.push(unlockCharacter);
			}
			//Her content is sealed until she is met, so the bestiary and the ledger would otherwise show
			//the fight as a wall of "???" while it is being played.
			if (honeycomb.debug.unlockAll != null) honeycomb.debug.unlockAll();
			//The release switch, for this session only.
			honeycomb.tuning.chessmaster.gauntlet.enabled = true;

			//A run with her in it, rather than whatever was last played.
			honeycomb.state.run = null;
			profile.lastPartyArray = [{ characterIndex: unlockCharacter,
				outfitIndex: honeycomb.findDefinition(honeycomb.characterArray, unlockCharacter).defaultOutfit,
				equipmentArray: [] }];
			honeycomb.debug.ensureRun();

			var run = honeycomb.state.run;
			if (run == null) { honeycomb.debug.notify("Could not start a run."); return; }
			//Marked as the route this run took, so anything that asks where it is answers the gallery.
			run.routeRegionIndex = honeycomb.tuning.chessmaster.gauntlet.regionIndex;
			honeycomb.map.generateRegion(honeycomb.tuning.chessmaster.gauntlet.regionIndex);
			honeycomb.combat.clear();
			honeycomb.overlay.closeAll();
			honeycomb.scene.go("map");
			honeycomb.debug.notify("The Quiet Gallery. Six rows, no branches -- walk it.");
		},
	},
	{
		index: "fightJuggernaut",
		name: "Fight the Juggernaut",
		detail: "Starts a run if needed and drops straight into the second boss, with the charging bar full " +
			"so every big move is legal. He opens with Avalanche by his own rule, so the thrown cards can be " +
			"watched on the first turn.",
		glyph: "skull",
		color: "#ff4d4d",
		run: function () {
			honeycomb.debug.ensureRun();
			honeycomb.combat.clear();
			honeycomb.overlay.closeAll();
			honeycomb.scene.go("combat", { encounterIndex: "juggernautHollow" });
			var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
			if (combat == null) return;
			//Full charge, so the later big moves are legal too. The opening Avalanche is the boss's own
			//rule (see its `openingMove`), not forced here, so this tool exercises the real path.
			for (var enemyIndex = 0; enemyIndex < combat.enemyArray.length; enemyIndex++) {
				combat.enemyArray[enemyIndex].charge = honeycomb.tuning.ai.chargeMaximum;
			}
			if (honeycomb.combatScene != null && honeycomb.combatScene.repaint != null) honeycomb.combatScene.repaint();
		},
	},
	{
		index: "showcaseMap",
		name: "Show a hand-placed map",
		detail: "Redraws this run's map over the showcase painting, where one path climbs backwards to a " +
			"Lookout in the corner -- somewhere no generated map could put a node.",
		glyph: "eye",
		color: "#c9a961",
		run: function () {
			if (honeycomb.state.run == null) honeycomb.teambuilding.startRun();
			honeycomb.combat.clear();
			honeycomb.overlay.closeAll();
			honeycomb.map.generateRegion(honeycomb.debug.showcaseRegionIndex, { backdropIndex: honeycomb.debug.showcaseBackdropIndex });
			honeycomb.scene.go("map");
		},
	},
	{
		index: "openEvent",
		name: "Open the chosen event",
		detail: "Opens the event picked below, over the map. Starts a run first if needed.",
		glyph: "question",
		color: "#c9a961",
		run: function () {
			if (honeycomb.state.run == null || honeycomb.state.run.map == null) honeycomb.teambuilding.startRun();
			honeycomb.combat.clear();
			honeycomb.overlay.closeAll();
			honeycomb.scene.go("map");
			honeycomb.overlay.open("event", { eventIndex: honeycomb.debug.testEventIndex });
		},
	},
	{
		index: "restLab",
		name: "Rest Lab (every rest option)",
		detail: "Starts a run if needed and opens a campfire with every rest-site option unlocked and a " +
			"hundred actions, so each can be tried without buying its tree node. The override drops when " +
			"the rest is left.",
		glyph: "heart",
		color: "#e0a34a",
		run: function () {
			honeycomb.debug.ensureRun();
			honeycomb.combat.clear();
			honeycomb.overlay.closeAll();
			honeycomb.rest.debugUnlockAll = true;
			honeycomb.rest.debugActions = 100;
			honeycomb.scene.go("map");
			honeycomb.overlay.open("event", { eventIndex: "theCampfire" });
		},
	},
	{
		index: "banishAll",
		name: "Banish every card",
		detail: "Puts every offerable card on the run's banished list, so reward, shop and journal pools " +
			"fall back to the Fallback Card. Starts a run first if needed.",
		glyph: "skull",
		color: "#d3455f",
		run: function () {
			honeycomb.debug.ensureRun();
			var run = honeycomb.state.run;
			if (run.banishedCardArray == null) run.banishedCardArray = [];
			for (var cardIndex = 0; cardIndex < honeycomb.cardArray.length; cardIndex++) {
				var card = honeycomb.cardArray[cardIndex];
				if (["common", "rare"].indexOf(card.rarity) < 0) continue;
				if (run.banishedCardArray.indexOf(card.index) < 0) run.banishedCardArray.push(card.index);
			}
			honeycomb.debug.notify("Every offerable card is banished. Pools will fall back.");
		},
	},
	{
		index: "cardReport",
		name: "Card report",
		detail: "How often each card was offered, taken and passed over, across every run this browser has played. Copy it out and send it back with feedback.",
		glyph: "scroll",
		color: "#8fb7d9",
		run: function () { honeycomb.overlay.open("cardReport", {}); },
	},
	{
		index: "winFight",
		name: "Win the current battle",
		detail: "Downs every enemy immediately.",
		glyph: "star",
		color: "#63d2a3",
		//ONE PRESS FROM THE FIGHT. It used to be
		//Menu, Debug Tools, scroll a long list, press. See honeycomb.debug.shortcutMarkup.
		quick: true,
		topBar: true,
		available: function () { return honeycomb.state.run != null && honeycomb.state.run.combat != null; },
		run: function () {
			var combat = honeycomb.state.run.combat;
			var context = honeycomb.newEffectContext({ combat: combat });
			for (var enemyIndex = 0; enemyIndex < combat.enemyArray.length; enemyIndex++) {
				combat.enemyArray[enemyIndex].health = 0;
				honeycomb.checkDeath(combat.enemyArray[enemyIndex], context);
			}
			honeycomb.combat.checkEnd(context);
			honeycomb.overlay.closeAll();
			honeycomb.combatScene.afterBeat();
		},
	},
	{
		index: "loseFight",
		name: "Lose the current battle",
		detail: "Downs the whole party immediately.",
		glyph: "skull",
		color: "#d3455f",
		quick: true,
		available: function () { return honeycomb.state.run != null && honeycomb.state.run.combat != null; },
		run: function () {
			var combat = honeycomb.state.run.combat;
			var context = honeycomb.newEffectContext({ combat: combat });
			var allyArray = honeycomb.entityArray("ally", combat);
			for (var allyIndex = 0; allyIndex < allyArray.length; allyIndex++) {
				allyArray[allyIndex].health = 0;
				honeycomb.checkDeath(allyArray[allyIndex], context);
			}
			honeycomb.combat.checkEnd(context);
			honeycomb.overlay.closeAll();
			honeycomb.combatScene.afterBeat();
		},
	},
	//-------------------------------------------------------------------------------------------
	//The Broken systems. Every one of them is reachable in an ordinary fight, but
	//getting there means deliberately losing, so each has a button.
	//-------------------------------------------------------------------------------------------
	{
		index: "breakFront",
		name: "Break the front of the party",
		detail: "Piles enough Lust on whoever is standing in front to put them over, which plays the " +
			"!!BROKEN!! cut-in and swaps their whole hand for their broken card. Clears their " +
			"recovered-this-turn flag first, so it forces the break even right after a recovery.",
		glyph: "skull",
		color: "#ff3b6b",
		available: function () { return honeycomb.state.run != null && honeycomb.state.run.combat != null; },
		run: function () {
			var combat = honeycomb.state.run.combat;
			var target = honeycomb.frontOf("ally", combat);
			if (target == null) return;
			var context = honeycomb.newEffectContext({ combat: combat });
			//breakOncePerTurn refuses a break for anybody who recovered this turn --
			//including one recovered by the debug panel's own Clear the party's Lust a moment earlier --
			//and the refusal is silent, so without this a forcing button would appear to do nothing.
			target.recoveredThisTurn = false;
			//Through the real path, so the log entry, the hooks and the cut-in all happen exactly as
			//they would in a fight. Tagged as nothing, so a debug break does not teach the ledger.
			honeycomb.gainLust(target, honeycomb.standingAgainstLust(target) - (target.lust == null ? 0 : target.lust),
				{ tagArray: [] }, context);
			honeycomb.overlay.closeAll();
			honeycomb.combatScene.playLog(context.log, function () { honeycomb.combatScene.afterBeat(); });
		},
	},
	{
		index: "healParty",
		name: "Clear the party's Lust",
		detail: "Removes all Lust from everyone, which recovers anybody broken and plays the recovery cut-in.",
		glyph: "heart",
		color: "#7ec8f0",
		available: function () { return honeycomb.state.run != null; },
		run: function () {
			var run = honeycomb.state.run;
			var context = honeycomb.newEffectContext({ combat: run.combat });
			for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
				honeycomb.reduceLust(run.partyArray[memberIndex], 9999, context);
			}
			honeycomb.overlay.closeAll();
			if (run.combat != null) honeycomb.combatScene.playLog(context.log, function () { honeycomb.combatScene.afterBeat(); });
			else honeycomb.scene.refresh();
		},
	},
	{
		index: "showBrokenCutIn",
		name: "Play the !!BROKEN!! cut-in",
		detail: "The overlay on its own, for whoever is in front, with nothing else changed. " +
			"Its size and timing are honeycomb.tuning.brokenOverlay.",
		glyph: "star",
		color: "#ff5fd2",
		available: function () { return honeycomb.state.run != null; },
		run: function () {
			var member = honeycomb.state.run.partyArray[0];
			if (member == null) return;
			honeycomb.overlay.closeAll();
			honeycomb.brokenOverlay.play({ targetId: member.instanceId, characterIndex: member.characterIndex });
		},
	},
	{
		index: "showRecoverCutIn",
		name: "Play the recovery cut-in",
		detail: "The faster eye cut-in on its own. Its crop is honeycomb.tuning.recoverOverlay.eyeWindow.",
		glyph: "sun",
		color: "#7ec8f0",
		available: function () { return honeycomb.state.run != null; },
		run: function () {
			var member = honeycomb.state.run.partyArray[0];
			if (member == null) return;
			honeycomb.overlay.closeAll();
			honeycomb.recoverOverlay.play({ targetId: member.instanceId, characterIndex: member.characterIndex });
		},
	},
	{
		index: "pileOnGold",
		name: "Overfill the party with Temporary HP",
		detail: "Enough to push every bar past its end, which is what shatters it and leaks.",
		glyph: "shard",
		color: "#ffcf5c",
		available: function () { return honeycomb.state.run != null; },
		run: function () {
			var run = honeycomb.state.run;
			var context = honeycomb.newEffectContext({ combat: run.combat });
			for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
				honeycomb.grantTemporaryHealth(run.partyArray[memberIndex], run.partyArray[memberIndex].maxHealth, context);
			}
			honeycomb.overlay.closeAll();
			if (run.combat != null) honeycomb.combatScene.playLog(context.log, function () { honeycomb.combatScene.afterBeat(); });
			else honeycomb.scene.refresh();
		},
	},
	{
		//UNLOCK EVERYTHING: every unlock kind (characters, outfits, equipment, tabs) and every discovery
		//kind (so the Compendium shows
		//every card, enemy and relic). Written straight into the ledgers with no experience paid, so the
		//button does not also flood the progression pools; saved at once so a reload keeps it.
		index: "unlockAll",
		name: "Unlock all content",
		detail: "Unlocks every character, outfit, equipment piece and tab, and marks everything in the " +
			"Compendium as found. Pays no experience.",
		glyph: "book",
		color: "#e8c86a",
		run: function () {
			var counts = honeycomb.debug.unlockAll();
			honeycomb.save.autosave(null);
			honeycomb.debug.notify("Unlocked " + counts.unlocked + " item(s); " + counts.discovered + " Compendium entr(ies) marked found.");
			honeycomb.scene.refresh();
			honeycomb.overlay.close("debug");
			honeycomb.overlay.open("debug", {});
		},
	},
	{
		index: "advanceWeakness",
		name: "Step every weakness up a rank",
		detail: "Pushes each character's exposure over its next threshold, so the between-run weakness " +
			"ledger can be read on the character sheet without playing the runs it would take. Ignores " +
			"the one-rank-per-run ceiling, since reaching the top is the point of the button.",
		glyph: "book",
		color: "#e07ac6",
		available: function () { return true; },
		run: function () {
			var tagArray = [];
			for (var tagIndex = 0; tagIndex < honeycomb.cardTagArray.length; tagIndex++) {
				tagArray.push(honeycomb.cardTagArray[tagIndex].index);
			}
			for (var characterIndex = 0; characterIndex < honeycomb.characterArray.length; characterIndex++) {
				var character = honeycomb.characterArray[characterIndex];
				for (var scanIndex = 0; scanIndex < tagArray.length; scanIndex++) {
					var next = honeycomb.lust.nextThresholdFor(honeycomb.lust.exposureFor(character.index, tagArray[scanIndex]));
					if (next == null) continue;
					//Written straight into the ledger rather than through recordExposure, so stepping one
					//tag up does not bleed all the others back down again -- and so the run ceiling does
					//not stop the button after the first press.
					var ledger = honeycomb.lust.exposureLedger(character.index, true);
					ledger[tagArray[scanIndex]] = next;
				}
			}
			honeycomb.scene.refresh();
		},
	},
	{
		//The rank cut-in is the one piece of the weakness system that cannot be seen from the character
		//sheet, so it gets a button of its own.
		index: "raiseOneWeakness",
		name: "Raise one weakness a rank, with the cut-in",
		detail: "Puts the front party member's first weakness tag over its next threshold through the " +
			"real path, so the rank cut-in plays exactly as it would mid-fight.",
		glyph: "star",
		color: "#ff5fd2",
		available: function () { return honeycomb.state.run != null; },
		run: function () {
			var member = honeycomb.state.run.partyArray[0];
			if (member == null || honeycomb.cardTagArray.length === 0) return;
			//The first LUST tag: necromancy is a school rather than a weakness, so it is skipped.
			var tag = null;
			for (var scanIndex = 0; scanIndex < honeycomb.cardTagArray.length && tag == null; scanIndex++) {
				if (honeycomb.cardTagArray[scanIndex].index != "necromancy") tag = honeycomb.cardTagArray[scanIndex].index;
			}
			if (tag == null) return;
			var exposure = honeycomb.lust.exposureFor(member.characterIndex, tag);
			var next = honeycomb.lust.nextThresholdFor(exposure);
			if (next == null) return;
			var context = honeycomb.newEffectContext({ combat: honeycomb.state.run.combat });
			var ledger = honeycomb.lust.exposureLedger(member.characterIndex, true);
			ledger[tag] = next;
			honeycomb.lust.noteRankChange(member, tag, exposure, next, context);
			honeycomb.overlay.closeAll();
			if (honeycomb.state.run.combat != null) {
				honeycomb.combatScene.playLog(context.log, function () { honeycomb.combatScene.afterBeat(); });
			} else {
				honeycomb.playCutInsFromLog(context.log);
				honeycomb.scene.refresh();
			}
		},
	},
	{
		index: "summonForParty",
		name: "Summon an enemy to the party's side",
		detail: "The enemy picked below joins the party for this fight and attacks its own kind at the end of each of your turns.",
		glyph: "paw",
		color: "#63d2a3",
		available: function () { return honeycomb.state.run != null && honeycomb.state.run.combat != null; },
		run: function () { honeycomb.debug.summon({ enemyIndex: honeycomb.debug.testSummonEnemyIndex, side: "ally" }); },
	},
	{
		index: "summonForEnemy",
		name: "Summon a party character to the enemy side",
		detail: "The character picked below joins the enemies and plays their own cards against the party.",
		glyph: "person",
		color: "#d3455f",
		available: function () { return honeycomb.state.run != null && honeycomb.state.run.combat != null; },
		run: function () { honeycomb.debug.summon({ characterIndex: honeycomb.debug.testSummonCharacterIndex, side: "enemy" }); },
	},
	{
		//Its own index: it shared "healParty" with Clear the party's Lust, and the panel runs an
		//action by looking its index up, so this button ran that one instead.
		index: "restoreHealth",
		name: "Fully heal the party",
		glyph: "heart",
		color: "#63d2a3",
		available: function () { return honeycomb.state.run != null; },
		run: function () {
			var run = honeycomb.state.run;
			for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
				run.partyArray[memberIndex].downed = false;
				run.partyArray[memberIndex].health = run.partyArray[memberIndex].maxHealth;
			}
			honeycomb.debug.refresh();
		},
	},
	{
		index: "grantGold",
		name: "Grant 500 gold",
		glyph: "coin",
		color: "#e8c86a",
		available: function () { return honeycomb.state.run != null; },
		run: function () { honeycomb.addResource("gold", 500); honeycomb.debug.refresh(); },
	},
	{
		index: "revealMap",
		name: "Complete the current node",
		detail: "Marks the node the party is standing on as finished, unlocking its onward routes.",
		glyph: "chevron",
		color: "#9c8fae",
		available: function () { return honeycomb.state.run != null && honeycomb.state.run.map != null; },
		run: function () {
			honeycomb.combat.clear();
			honeycomb.overlay.closeAll();
			honeycomb.map.returnToMap();
		},
	},
	{
		index: "repairCombat",
		name: "Repair a stuck battle",
		detail: "Forces the board back to a fresh player turn. For a fight that accepts no input.",
		glyph: "spiral",
		color: "#5fc9f0",
		available: function () { return honeycomb.state.run != null && honeycomb.state.run.combat != null; },
		run: function () {
			var combat = honeycomb.state.run.combat;
			//Force an unstable phase so repair() has something to fix, then let it do the work.
			combat.phase = "endingPlayerTurn";
			honeycomb.combat.repair();
			honeycomb.overlay.closeAll();
			honeycomb.scene.go("combat", {});
		},
	},
	{
		//THE TOOLTIP DEBUG KEY: every panel prints its own kind and key, so a
		//string can be found and corrected without hunting for which tooltip it came from. Off by default.
		index: "toggleTooltipKeys",
		name: "Toggle tooltip debug keys",
		detail: "Prints each tooltip panel's kind and key on the panel, for finding the string to edit.",
		glyph: "eye",
		color: "#c9b6dd",
		run: function () {
			honeycomb.debug.tooltipKeys = honeycomb.debug.tooltipKeys != true;
			honeycomb.debug.notify("Tooltip debug keys " + (honeycomb.debug.tooltipKeys == true ? "on." : "off."));
		},
	},
	{
		//THE SIX-SLOT PARTY IS A DEBUG FEATURE: the shipped ceiling is three.
		index: "toggleLargeParty",
		name: "Toggle six-slot party",
		detail: "Lets the teambuilding screen take up to six members instead of the shipped three.",
		glyph: "person",
		color: "#c9b6dd",
		run: function () {
			honeycomb.debug.allowLargeParty = honeycomb.debug.allowLargeParty != true;
			honeycomb.debug.notify("Six-slot party " + (honeycomb.debug.allowLargeParty == true ? "on." : "off."));
			if (honeycomb.scene.current == "teambuilding") honeycomb.scene.refresh();
		},
	},
	{
		//THE SHOP IS HARD TO REACH WHILE TESTING: open it directly, on the
		//node the party is standing on or a throwaway one.
		index: "openShop",
		name: "Open the shop",
		detail: "Shows the shop screen with the current run's stock, wherever the party is.",
		glyph: "bag",
		color: "#c9a961",
		run: function () {
			if (honeycomb.state.run == null || honeycomb.state.run.map == null) {
				honeycomb.debug.notify("Start a run first (Go to Map).");
				return;
			}
			honeycomb.overlay.closeAll();
			honeycomb.overlay.open("shop", { nodeId: honeycomb.state.run.map.currentNodeId });
		},
	},
	{
		//THE PERFORMANCE MONITOR. Turn it on, play a turn, then Report: frames, long tasks,
		//each replay's expected vs actual, and the per-move drag cost.
		index: "togglePerf",
		name: "Toggle performance monitor",
		detail: "Records frame timing, long tasks, replay expected-vs-actual and drag cost while you play.",
		glyph: "spiral",
		color: "#5fc9f0",
		run: function () {
			honeycomb.perf.toggle();
			honeycomb.debug.notify("Performance monitor " + (honeycomb.perf.enabled == true ? "on -- play a turn, then Report." : "off."));
		},
	},
	{
		index: "reportPerf",
		name: "Report performance",
		detail: "Prints the performance report to the console and summarises it here.",
		glyph: "eye",
		color: "#5fc9f0",
		available: function () { return honeycomb.perf != null && honeycomb.perf.enabled == true; },
		run: function () {
			honeycomb.perf.print();
			honeycomb.debug.notify(honeycomb.perf.summaryText());
			//Rebuild the panel so the summary is visible at once, rather than on the next open.
			honeycomb.overlay.close("debug");
			honeycomb.overlay.open("debug", {});
		},
	},
	{
		//THE MOBILE PAINT PATH. Trades full-screen blurs, drop-shadows and filter
		//transitions for cheaper paint. Auto-on for touch/low-memory; this forces it either way to A/B.
		index: "toggleReducedEffects",
		name: "Toggle reduced effects",
		detail: "Drops full-screen blurs, drop-shadows and filter transitions, for a phone's cheaper paint.",
		glyph: "shield",
		color: "#5fc9f0",
		run: function () {
			honeycomb.tuning.performance.reducedEffects = honeycomb.reducedEffects() == true ? false : true;
			honeycomb.applyReducedEffects();
			honeycomb.debug.notify("Reduced effects " + (honeycomb.reducedEffects() == true ? "on." : "off."));
			honeycomb.scene.refresh();
			//Rebuild the panel so the new state shows at once.
			honeycomb.overlay.close("debug");
			honeycomb.overlay.open("debug", {});
		},
	},
];

honeycomb.debug = {
	//Which encounter the test-battle button starts. Editable from the panel.
	testEncounterIndex: "bruteAndSpore",
	//Which event the event button opens. Editable from the panel.
	testEventIndex: "theSealedDoor",
	//The painting the hand-placed map button draws. See the vaultShowcase backdrop.
	showcaseRegionIndex: "floodedVault",
	showcaseBackdropIndex: "vaultShowcase",
	//What the two summon buttons bring in. Editable from the panel.
	testSummonEnemyIndex: "sporeling",
	testSummonCharacterIndex: "severine",
	//Whether every tooltip panel prints its own kind and key. See the
	//toggleTooltipKeys action and honeycomb.tooltip.debugKeyMarkup.
	tooltipKeys: false,
	//Whether the teambuilding screen offers the debug party ceiling of six instead of the shipped three
	//See honeycomb.teambuilding.partySizeMaximum.
	allowLargeParty: false,
	//How much the two experience buttons grant. Editable from the panel.
	grantExperienceAmount: 1000,
	lastMessage: "",
};

//Starts a run if there is none, filling a fresh profile's party from the starting roster. A debug action
//can be pressed from the title, where the teambuilding screen has never chosen a party, so
//`teambuilding.startRun` alone would refuse. Returns the run.
//A debug action marked `secret` names something a player has not earned, so it is not drawn, pressed
//or promoted to a shortcut unless tuning.debug.showsSecrets.
honeycomb.debug.actionHidden = function (action) {
	return action != null && action.secret == true && honeycomb.tuning.debug.showsSecrets != true;
};

honeycomb.debug.ensureRun = function () {
	if (honeycomb.state.run != null && honeycomb.state.run.map != null) return honeycomb.state.run;
	var profile = honeycomb.state.profile;
	if (profile.lastPartyArray == null || profile.lastPartyArray.length < honeycomb.tuning.run.partySizeMinimum) {
		var selectionArray = [];
		for (var characterIndex = 0; characterIndex < honeycomb.characterArray.length &&
			selectionArray.length < honeycomb.tuning.run.partySizeStarting; characterIndex++) {
			var character = honeycomb.characterArray[characterIndex];
			if (character.unlockedFromStart != true) continue;
			selectionArray.push({ characterIndex: character.index, outfitIndex: character.defaultOutfit, equipmentArray: [] });
		}
		profile.lastPartyArray = selectionArray;
	}
	honeycomb.teambuilding.startRun();
	return honeycomb.state.run;
};

//Writes every unlock kind's and every discovery kind's full list into the profile. Reads the two
//registries, so a new unlockable or discoverable kind is covered with no change here. Returns the counts.
honeycomb.debug.unlockAll = function () {
	var counts = { unlocked: 0, discovered: 0 };
	for (var kindIndex = 0; kindIndex < honeycomb.unlockKindArray.length; kindIndex++) {
		var kind = honeycomb.unlockKindArray[kindIndex];
		var ownerArray = kind.perCharacter == true ? honeycomb.characterArray.map(function (character) { return character.index; }) : [null];
		for (var ownerIndex = 0; ownerIndex < ownerArray.length; ownerIndex++) {
			var ledger = honeycomb.unlocks.ledgerFor(kind.index, ownerArray[ownerIndex]);
			var allArray = kind.allArray(ownerArray[ownerIndex]);
			if (ledger == null || allArray == null) continue;
			for (var entryIndex = 0; entryIndex < allArray.length; entryIndex++) {
				if (ledger.indexOf(allArray[entryIndex].index) >= 0) continue;
				ledger.push(allArray[entryIndex].index);
				counts.unlocked += 1;
			}
		}
	}
	//AND THE CHARACTERS STILL IN DEVELOPMENT, BY NAME. The loop above cannot reach them: the
	//`character` kind lists the SHIPPED roster, so that no player-facing total counts a secret character.
	//This panel is a developer's tool behind tuning.debug.enabled, so it grants them outright -- BEFORE the
	//discoveries below, so that her now-unsealed cards, pieces and relic are discovered in the same press.
	//Only for a developer: a tester pressing "unlock all" would otherwise meet her before any
	//player could, and she stays secret until she is unlocked through gameplay.
	for (var developmentIndex = 0; developmentIndex < honeycomb.characterArray.length; developmentIndex++) {
		if (honeycomb.tuning.debug.showsSecrets != true) break;
		if (honeycomb.characterArray[developmentIndex].inDevelopment != true) continue;
		if (honeycomb.unlocks.grant("character", honeycomb.characterArray[developmentIndex].index) == true) counts.unlocked += 1;
	}
	for (var discoveryIndex = 0; discoveryIndex < honeycomb.discoveryKindArray.length; discoveryIndex++) {
		var indexArray = honeycomb.discovery.allIndexArray(honeycomb.discoveryKindArray[discoveryIndex].index);
		for (var foundIndex = 0; foundIndex < indexArray.length; foundIndex++) {
			if (honeycomb.discovery.note(honeycomb.discoveryKindArray[discoveryIndex].index, indexArray[foundIndex]) == true) counts.discovered += 1;
		}
	}
	return counts;
};

//Brings a combatant into the current fight outside any card, then shows the board.
honeycomb.debug.summon = function (spec) {
	var combat = honeycomb.state.run.combat;
	var context = honeycomb.newEffectContext({ combat: combat });
	var entity = honeycomb.summonCombatant(spec, context);
	honeycomb.overlay.closeAll();
	honeycomb.scene.go("combat", {});
	honeycomb.debug.notify(entity == null ? "Summon refused (the enemy line may be full)." : honeycomb.entityName(entity) + " joined the " + (spec.side == "ally" ? "party" : "enemies") + ".");
};

honeycomb.overlay.register({
	index: "debug",
	closeOnBackdrop: true,
	build: function (layer) {
		layer.innerHTML = honeycomb.debug.render();
	},
});

honeycomb.debug.render = function () {
	var state = honeycomb.state;
	var run = state == null ? null : state.run;

	var markup = '<div class="hcOverlayPanel hcDebugPanel">';
	markup += '<h2 class="hcOverlayTitle">Debug Tools</h2>';

	//A state readout first: most debugging starts with "what does it think is happening".
	markup += '<div class="hcDebugState hcTiny">';
	markup += "<span>scene <b>" + honeycomb.escapeText(honeycomb.scene.current || "none") + "</b></span>";
	markup += "<span>run <b>" + (run == null ? "none" : "day " + run.day) + "</b></span>";
	if (run != null) {
		markup += "<span>seed <b>" + run.seed + "</b></span>";
		markup += "<span>deck <b>" + run.deckArray.length + "</b></span>";
		markup += "<span>combat <b>" + (run.combat == null ? "none" : run.combat.phase + " T" + run.combat.turnNumber) + "</b></span>";
	}
	//The mobile paint path's current state, so the toggle is not a guess.
	markup += "<span>reduced effects <b>" + (honeycomb.reducedEffects() == true ? "ON" : "off") + "</b></span>";
	markup += "<span>perf monitor <b>" + (honeycomb.perf != null && honeycomb.perf.enabled == true ? "ON" : "off") + "</b></span>";
	//The image warm's own clock, so "the loading screen costs X" is a measurement.
	if (honeycomb.preload != null) {
		markup += "<span>preload <b>" + honeycomb.escapeText(honeycomb.preload.summaryText()) + "</b></span>";
	}
	markup += "</div>";

	if (honeycomb.debug.lastMessage !== "") {
		markup += '<div class="hcTabNote">' + honeycomb.escapeText(honeycomb.debug.lastMessage) + "</div>";
	}

	//WHAT CAN BE DONE RIGHT NOW, ABOVE EVERYTHING. The list below is long and scrolls, and the
	//pickers sit on top of it, so the tool most wanted mid-fight was the furthest from the pointer.
	markup += honeycomb.debug.shortcutMarkup("quick");

	//Encounter picker for the test-battle button.
	markup += '<div class="hcDebugRow"><span class="hcTiny hcMuted">Fight to start:</span>';
	markup += '<select class="hcDebugSelect" onchange="honeycomb.debug.testEncounterIndex=this.value">';
	for (var encounterIndex = 0; encounterIndex < honeycomb.encounterArray.length; encounterIndex++) {
		var encounter = honeycomb.encounterArray[encounterIndex];
		if (honeycomb.discovery.hiddenFromDebug("encounter", encounter.index) == true) continue;
		markup += '<option value="' + encounter.index + '"' +
			(encounter.index == honeycomb.debug.testEncounterIndex ? " selected" : "") + ">" +
			honeycomb.escapeText(encounter.index + " (" + encounter.tier + ")") + "</option>";
	}
	markup += "</select></div>";

	//Event picker for the event button.
	markup += '<div class="hcDebugRow"><span class="hcTiny hcMuted">Test event:</span>';
	markup += '<select class="hcDebugSelect" onchange="honeycomb.debug.testEventIndex=this.value">';
	for (var eventIndex = 0; eventIndex < honeycomb.eventArray.length; eventIndex++) {
		var event = honeycomb.eventArray[eventIndex];
		markup += '<option value="' + event.index + '"' +
			(event.index == honeycomb.debug.testEventIndex ? " selected" : "") + ">" +
			honeycomb.escapeText(event.name) + "</option>";
	}
	markup += "</select></div>";

	//Pickers for the two summon buttons.
	markup += '<div class="hcDebugRow"><span class="hcTiny hcMuted">Summon:</span>';
	markup += '<select class="hcDebugSelect" onchange="honeycomb.debug.testSummonEnemyIndex=this.value">';
	for (var enemyIndex = 0; enemyIndex < honeycomb.enemyArray.length; enemyIndex++) {
		var enemy = honeycomb.enemyArray[enemyIndex];
		if (honeycomb.discovery.hiddenFromDebug("enemy", enemy.index) == true) continue;
		markup += '<option value="' + enemy.index + '"' +
			(enemy.index == honeycomb.debug.testSummonEnemyIndex ? " selected" : "") + ">" +
			honeycomb.escapeText(enemy.name) + "</option>";
	}
	markup += "</select>";
	markup += '<select class="hcDebugSelect" onchange="honeycomb.debug.testSummonCharacterIndex=this.value">';
	for (var characterIndex = 0; characterIndex < honeycomb.characterArray.length; characterIndex++) {
		var character = honeycomb.characterArray[characterIndex];
		if (honeycomb.discovery.hiddenFromDebug("character", character.index) == true) continue;
		markup += '<option value="' + character.index + '"' +
			(character.index == honeycomb.debug.testSummonCharacterIndex ? " selected" : "") + ">" +
			honeycomb.escapeText(character.name) + "</option>";
	}
	markup += "</select></div>";

	//How much the two experience buttons grant. Remembered on the debug object, so it survives a repaint.
	markup += '<div class="hcDebugRow"><span class="hcTiny hcMuted">Experience:</span>';
	markup += '<input class="hcDebugSelect" type="number" min="1" step="100" value="' + honeycomb.debug.grantExperienceAmount +
		'" onchange="honeycomb.debug.grantExperienceAmount=Math.max(1,Number(this.value)||1)"></div>';

	markup += '<div class="hcDebugGrid hcScroll">';
	for (var actionIndex = 0; actionIndex < honeycomb.debugActionArray.length; actionIndex++) {
		var action = honeycomb.debugActionArray[actionIndex];
		if (honeycomb.debug.actionHidden(action) == true) continue;
		var available = action.available == null || action.available() == true;
		markup += '<div class="hcDebugAction' + (available ? "" : " hcDisabled") + '"' +
			(available ? ' onclick="honeycomb.debug.run(\'' + action.index + '\')"' : "") + ">";
		markup += honeycomb.ui.iconTag(null, action.glyph, action.color, { className: "hcRelicIcon" });
		markup += '<div class="hcGrow"><div>' + honeycomb.escapeText(action.name) + "</div>";
		if (action.detail) markup += '<div class="hcTiny hcMuted">' + honeycomb.escapeText(action.detail) + "</div>";
		markup += "</div></div>";
	}
	markup += "</div>";

	markup += '<div class="hcOverlayButtonRow">' +
		'<div class="hcButton hcPrimary" onclick="honeycomb.debug.close()">Close</div></div>';
	markup += "</div>";
	return markup;
};

honeycomb.debug.run = function (actionIndex) {
	var action = honeycomb.findDefinition(honeycomb.debugActionArray, actionIndex);
	if (action == null) return;
	//A shortcut can be pressed with no panel open, so the rule the panel applied by not drawing an
	//onclick is applied here as well. A top-bar press also waits for a replay to finish: the board is
	//the replay's until then. The panel is left as it was -- it has always been usable mid-replay.
	if (honeycomb.debug.actionHidden(action) == true) return;
	if (action.available != null && action.available() != true) return;
	if (honeycomb.overlay.isOpen("debug") != true && honeycomb.combatScene != null && honeycomb.combatScene.busy == true) return;
	honeycomb.debug.lastMessage = "";
	action.run();
};

//SHORTCUTS TO DEBUG ACTIONS.
//An action says where else it is drawn by a field on its own table entry, so promoting a tool is one
//line and no markup:
//  quick    pinned in a row at the top of the debug panel, above the pickers and the scrolling list
//  topBar   an icon button on the top bar of every in-run scene: one press, no menu at all
//Only what is `available` right now is drawn, so a fight's tools appear in a fight and nowhere else.
//Returns "" with the debug switch off -- a release build draws none of it.
honeycomb.debug.shortcutMarkup = function (placementField) {
	if (honeycomb.tuning.debug.enabled != true) return "";
	var markup = "";
	for (var actionIndex = 0; actionIndex < honeycomb.debugActionArray.length; actionIndex++) {
		var action = honeycomb.debugActionArray[actionIndex];
		if (action[placementField] != true) continue;
		if (honeycomb.debug.actionHidden(action) == true) continue;
		if (action.available != null && action.available() != true) continue;
		var press = ' onclick="honeycomb.debug.run(\'' + honeycomb.escapeAttribute(action.index) + '\')"';
		if (placementField == "topBar") {
			markup += '<div class="hcButton hcSmall hcDebugShortcut" title="Debug: ' + honeycomb.escapeAttribute(action.name) + '"' + press + ">" +
				honeycomb.ui.iconTag(null, action.glyph, action.color, { className: "hcInlineIcon" }) + "</div>";
		} else {
			markup += '<div class="hcDebugAction"' + press + ">" +
				honeycomb.ui.iconTag(null, action.glyph, action.color, { className: "hcRelicIcon" }) +
				'<div class="hcGrow">' + honeycomb.escapeText(action.name) + "</div></div>";
		}
	}
	if (markup === "" || placementField == "topBar") return markup;
	return '<div class="hcDebugQuickRow">' + markup + "</div>";
};

honeycomb.debug.notify = function (text) {
	honeycomb.debug.lastMessage = text;
	console.log("Honeycomb debug: " + text);
};

//Repaints the panel in place after an action that changed state but stayed on the screen.
honeycomb.debug.refresh = function () {
	var layer = document.getElementById(honeycomb.tuning.dom.overlayIdPrefix + "debug");
	if (layer != null) layer.innerHTML = honeycomb.debug.render();
	//The scene behind may also be showing a stale number.
	if (honeycomb.scene.current == "combat" && honeycomb.combatScene != null) honeycomb.combatScene.repaint();
};

honeycomb.debug.close = function () {
	honeycomb.debug.lastMessage = "";
	honeycomb.overlay.close("debug");
};
