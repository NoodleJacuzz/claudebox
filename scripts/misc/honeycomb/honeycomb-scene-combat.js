//===================================================================================================
//HONEYCOMB CATACOMBS -- combat scene
//===================================================================================================
//The presentation half of a fight. honeycomb-combat.js decides what happens; this decides how it is
//shown, by replaying the log that the engine produced.
//
//THE LOG REPLAY CONTRACT. Engine calls return a context whose `log` is an ordered list of everything
//that happened. This file walks that list and plays each entry as an animation beat, then repaints
//from the now-current state. Because the state is already final before the first frame is drawn, an
//interrupted or skipped animation can never leave the board disagreeing with the rules.
window.honeycomb = window.honeycomb || {};

honeycomb.combatScene = {
	//Set while the log is being played, so input is refused mid-animation.
	busy: false,
	//The card currently being dragged, and the entity under the pointer.
	dragCardId: null,
	dragTargetId: null,
	//Which ally's ability sub-menu is open, if any.
	//The element that lifts during a drag. The SLOT carries position, the CARD carries state; keeping
	//them apart is what stops CSS and JS overwriting one another's transforms.
	dragSlot: null,
	//An ability chosen but still waiting for its target, as {memberInstanceId, abilityIndex}.
	//Kept on the scene rather than in combat state: it is an unfinished intention, not a game fact,
	//and a reload should not resume half of one.
	pendingAim: null,
	//Where the card being played sat in the hand, measured before it left it, so the flight animation
	//has somewhere to start from. Consumed by the first cardPlayed entry that reads it.
	flightOrigin: null,
};

//---------------------------------------------------------------------------------------------------
//Scene
//---------------------------------------------------------------------------------------------------
honeycomb.scene.register({
	index: "combat",
	build: function (root, params) {
		honeycomb.applyTuningToCss();
		var run = honeycomb.state.run;
		if (run == null) { honeycomb.scene.go("teambuilding"); return; }

		//Entering fresh starts a fight; re-entering with one already in progress resumes it, which is
		//what a mid-combat save reload does.
		var freshFight = false;
		if (run.combat == null) {
			if (params.encounterIndex == null) { honeycomb.scene.go("map"); return; }
			//Whatever started the fight says where it leads; the fight itself does not need to know.
			honeycomb.combat.begin(params.encounterIndex, {
				mapNodeId: params.mapNodeId,
				continuation: params.continuation,
				rewardArray: params.rewardArray,
				victoryConditionArray: params.victoryConditionArray,
				defeatConditionArray: params.defeatConditionArray,
			});
			freshFight = true;
		}

		//Answered before the first frame, so the ally bars open with what the enemies are about to do
		//already on them rather than acquiring it a repaint later.
		if (honeycomb.forecast != null) honeycomb.forecast.refreshStanding();

		root.innerHTML = honeycomb.combatScene.render();
		honeycomb.combatScene.fitHandFan(null);
		honeycomb.combatScene.attachDragHandlers();
		//A resumed fight shows its hand as it was left; a new one has it dealt.
		if (freshFight == true) honeycomb.combatScene.dealOpeningHand();
		//A fight begun from INSIDE the combat scene (one battle chained onto another) is not a scene
		//change, so the scene cue alone would leave the map track playing over it.
		if (freshFight == true && honeycomb.music != null) honeycomb.music.onEvent("combatBegan");
	},
	teardown: function () {
		honeycomb.combatScene.busy = false;
		honeycomb.combatScene.handMotion.settlesAt = 0;
		honeycomb.combatScene.handMotion.createdShown = 0;
		honeycomb.combatScene.handMotion.playedEnd = null;
		honeycomb.combatScene.dragCardId = null;
		honeycomb.combatScene.dragTargetId = null;
		honeycomb.combatScene.dragQueued = false;
		//Queued input belongs to the fight being left.
		honeycomb.combatScene.inputQueue = [];
		honeycomb.combatScene.renderPlayQueue();
		honeycomb.combatScene.afterBeatDeferred = false;
	//The battle lab's infinite energy, topped up on the beat the scene already runs rather than on a
	//timer of its own. A no-op unless the lab's toggle is on.
	if (honeycomb.lab != null && honeycomb.lab.holdEnergy != null) honeycomb.lab.holdEnergy();
		honeycomb.combatScene.pendingAim = null;
		honeycomb.combatScene.flightOrigin = null;
		//Forecasts describe a board that is about to stop existing.
		if (honeycomb.forecast != null) honeycomb.forecast.invalidate();
	},
});

honeycomb.combatScene.render = function () {
	var run = honeycomb.state.run;
	var combat = run.combat;

	//Warm the attack effect so the first one to land is already chroma-keyed.
	honeycomb.vfx.prewarm();

	//And warm what this fight can summon. A fighter whose picture has not arrived has no size, and the
	//row is laid out around it twice -- a size pop, first seen when the Head Gardener planted her
	//Puffcaps. Asked for once per fight, not per repaint, and through the
	//same gentle batching as the boot warm, so it never competes with the art on screen. See
	//honeycomb.art.summonWarmPaths for the measurement.
	//Identified by the combat OBJECT, since a fight carries no id: a new fight is a new object, and a
	//repaint of this one is the same object, which is exactly the distinction wanted.
	if (honeycomb.combatScene.summonsWarmedFor !== combat) {
		honeycomb.combatScene.summonsWarmedFor = combat;
		if (honeycomb.preload != null) honeycomb.preload.warm(honeycomb.art.summonWarmPaths(combat));
	}

	//The BATTLE LAYOUT says where everything stands and how big it is; its numbers
	//reach the CSS through applyTuningToCss, and its yes/no flags arrive as classes here.
	//The shell outlives every repaint, so it is what hears the pointer move; see carriedHover.
	var markup = '<div class="hcScreen hcCombatScene ' + honeycomb.battleLayoutClassText(honeycomb.battleLayout()) + '"' +
		' onpointermove="honeycomb.combatScene.carriedHover.release()">';
	markup += honeycomb.ui.topBar({ showExit: true, showParty: true, subtitle: "Turn " + combat.turnNumber });
	markup += '<div class="hcBody hcCombatBody">';

	//Layer 0: the battlefield backdrop -- the encounter's own, else its region's, else tuning's.
	markup += '<div class="hcCombatBackground">' +
		honeycomb.imageTag(honeycomb.combatScene.backdropPath(combat),
		{ className: "hcCombatBackgroundArt", alt: "", silentFallback: true }) + "</div>";

	//NO PORTRAIT RAIL IN COMBAT. It existed because the battlefield sprites were small and their
	//health was hard to read; now that every character stands in a full framed window with their own
	//bar, the rail said the same thing twice and covered the leftmost character doing it. The map
	//keeps its rail, where there are no sprites to read.

	//Layer 2: the fighters.
	markup += '<div class="hcBattlefield" id="honeycombBattlefield" onclick="honeycomb.combatScene.onFieldClick(event)">';
	markup += honeycomb.combatScene.renderSide("ally", run.partyArray);
	markup += honeycomb.combatScene.renderSide("enemy", combat.enemyArray);
	//The Battle Lab's badge, on the battlefield because that is the positioned layer the handles share.
	//Empty while the lab is off.
	markup += (honeycomb.lab == null ? "" : honeycomb.lab.badgeMarkup());
	markup += "</div>";

	//The swipe hint replaces the old hand-lifter arrow: a phone's fullscreen notification can simply be
	//swiped aside, so the arrow was teaching the wrong thing. A
	//subtle line in the middle of the board says the one useful thing instead. Mobile only, only while
	//the board is at rest, once per profile. See honeycomb.combatScene.swipeHint...
	if (honeycomb.combatScene.swipeHintVisible() == true) {
		markup += '<div class="hcSwipeHint" id="honeycombSwipeHint"' +
			' onclick="honeycomb.combatScene.dismissSwipeHint()"' +
			' onpointerdown="honeycomb.combatScene.noteSwipeHintStart(event)"' +
			' onpointermove="honeycomb.combatScene.noteSwipeHintMove(event)">' +
			'Swipe a notification aside if it blocks the game</div>';
	}

	//Layer 3: the hand and its furniture.
	markup += honeycomb.combatScene.renderHandBar();

	//Layer 4: the targeting arrow, drawn over everything while a card is being aimed.
	markup += '<svg class="hcTargetArrow" id="honeycombTargetArrow" viewBox="0 0 100 100" preserveAspectRatio="none">' +
		'<path id="honeycombTargetArrowPath" d=""/></svg>';

	markup += "</div></div>";
	return markup;
};

//Which painting a fight stands in front of. A boss lair can name its own on the encounter; a region
//names the rest of its fights'; anything else gets tuning's default.
honeycomb.combatScene.backdropPath = function (combat) {
	var encounter = combat == null ? null : honeycomb.findDefinition(honeycomb.encounterArray, combat.encounterIndex);
	if (encounter != null && encounter.battleBackdropPath != null) return encounter.battleBackdropPath;
	var run = honeycomb.state.run;
	var region = run == null || run.map == null ? null : honeycomb.findDefinition(honeycomb.regionArray, run.map.regionIndex);
	if (region != null && region.battleBackdropPath != null) return region.battleBackdropPath;
	return honeycomb.tuning.art.battleBackdropPath;
};

//--- Fighters ---------------------------------------------------------------------------------------
honeycomb.combatScene.renderSide = function (side, entityArray) {
	//A CROWDED side overlaps its fighters instead of making each of them thinner:
	//five columns sharing one side's width is five tiny characters. Anyone anchored out of the row
	//(a boss) is not counted, since they are not taking a share of it.
	var inRowCount = 0;
	var anchored = false;
	for (var countIndex = 0; countIndex < entityArray.length; countIndex++) {
		if (honeycomb.combatScene.placementAnchor(entityArray[countIndex]) == null) inRowCount += 1;
		else anchored = true;
	}
	var crowded = inRowCount >= honeycomb.tuning.layout.crowdedSideCount;

	//A side with somebody anchored behind it draws its row shorter, so a boss is always taller than her
	//minions, standing in front of her, and everyone can still be the target of attacks.
	//The height is a share of the row's usual one (tuning.layout.minionHeightPercent), so the boss
	//looms over her guard by construction rather than by each encounter being posed by hand -- and the
	//shorter row leaves her head and shoulders clear above it.
	//A SIDE TAKES THE SHARE OF THE BATTLEFIELD ITS CROWD NEEDS, rather than half of it whoever is
	//standing there. `sideGrowFactor` lives in the tuning file so the suite can see it; the stylesheet
	//reads the variable and nothing here knows a width.
	var sideGrow = honeycomb.sideGrowFactor(inRowCount);
	var markup = '<div class="hcSide hcSide-' + side + (crowded ? " hcCrowded" : "") +
		(anchored ? " hcHasAnchor" : "") + '" style="--hc-side-grow: ' + sideGrow + ';">';
	for (var entityIndex = 0; entityIndex < entityArray.length; entityIndex++) {
		markup += honeycomb.combatScene.renderFighter(entityArray[entityIndex], side);
	}
	//THE BATTLE LAB'S +. Empty while the lab is off, so the shipped screen
	//is what it always was.
	markup += (honeycomb.lab == null ? "" : honeycomb.lab.sideHandleMarkup(side));
	markup += "</div>";
	return markup;
};

//What a fighter IS decides its name, art and panels; its TEAM only decides which side it stands on
//An AI combatant on either side shows the card it is about to play; a character the
//player commands carries its ability launcher.
honeycomb.combatScene.renderFighter = function (entity, side) {
	entity = honeycomb.combatScene.shownEntity(entity);
	var found = honeycomb.entityDefinition(entity);
	if (found == null) return "";
	var definition = found.definition;
	var aiControlled = honeycomb.isAiControlled(entity);

	var classList = "hcFighter hcFighter-" + side;
	//A combatant anchored out of the row stands behind it at a size of their own.
	var anchor = honeycomb.combatScene.placementAnchor(entity);
	if (anchor != null) classList += " hcAnchored hcAnchor-" + anchor;
	if (entity.downed == true) classList += " hcDowned";
	//A piece carries a move button on its plate. The class is the hook the stylesheet needs
	//to treat a piece's column differently from a character's or an enemy's; today only the telegraph's
	//placement reads it.
	if (honeycomb.golemActivation(entity) != null) classList += " hcGolemHolder";
	//Standing on the wrong side: mirrored, so a summoned combatant faces the fight.
	if (honeycomb.art.spriteFlipped(entity) == true) classList += " hcMirrored";
	//BROKEN IS STATE, NOT A BEAT. The `broken` log handler adds this class as the cut-in lands, but a
	//repaint rebuilds the fighter from scratch and there are many of those -- so it has to be derived
	//here as well or the drained look would vanish the next time anything on the board moved.
	if (entity.broken == true) classList += " hcBrokenFighter";
	//While something is being aimed, legal targets take the SAME gold frame a dragged card lights, and
	//illegal ones are left alone. Derived here as well as
	//marked in place by markAimTargets, so a repaint for some other reason does not lose the marks.
	if (honeycomb.combatScene.pendingAim != null && honeycomb.combatScene.isLegalAimTarget(entity) == true) {
		classList += " hcLegalTarget" + (side == "ally" ? " hcLegalAlly" : "");
	}

	var markup = '<div class="' + classList + '"' +
		honeycomb.combatScene.vitalsScaleStyle(entity.placement) +
		' id="honeycombFighter-' + honeycomb.escapeAttribute(entity.instanceId) + '"' +
		' data-hcEntityId="' + honeycomb.escapeAttribute(entity.instanceId) + '"' +
		' data-hcSide="' + side + '"' +
		' onmouseenter="honeycomb.combatScene.onFighterHover(\'' + entity.instanceId + '\')"' +
		' onmouseleave="honeycomb.combatScene.onFighterHover(null)"' +
		' onclick="honeycomb.combatScene.onFighterClick(\'' + entity.instanceId + '\')">';

	//The Battle Lab's own handles on this body: remove, and restore to full.
	markup += (honeycomb.lab == null ? "" : honeycomb.lab.fighterHandleMarkup(entity));

	//EACH FIGHTER STANDS IN THEIR OWN FRAMED WINDOW. Every character is drawn facing the viewer, and
	//a single shared stage makes a row of people all looking past each other; a frame each turns that
	//into a set of portraits, which reads correctly. It also removed the mirroring hack: an enemy in
	//their own window has nobody to face.
	markup += '<div class="hcFighterFrame">';

	//The SPRITE moves and the frame does not, which is what decouples the character's animation from
	//the bars floating over them. A lunge used to drag the health bar along with it.
	markup += '<div class="hcFighterSprite">';
	//How this one STANDS, when its definition or the encounter says: scale and
	//offsets on the art's wrap, from the feet, so a looming boss grows upward off the same floor.
	markup += '<div class="hcFighterArtWrap"' + honeycomb.combatScene.placementStyle(entity.placement) + '>';
	//The art resolver picks health tier, state and pose, and emits a fallback chain the image walks on
	//its own. A `filter` state contributes a CSS tint rather than art, which is why it costs no files.
	//Facing is a mirror rather than a second drawing, so one sprite serves an ally and an enemy --
	//which is what the Chessmaster's golems need. It rides on the fighter's `hcMirrored` class, NOT on
	//this element's transform: the hit shake and the downed tilt own that one.
	markup += honeycomb.art.spriteTag(entity, honeycomb.art.restingPose(), {
		className: "hcFighterArt",
		alt: definition.name,
		style: "filter:" + honeycomb.art.stateFilter(entity),
	});
	if (entity.broken == true) markup += honeycomb.combatScene.renderBrokenHearts();
	markup += "</div>";
	markup += '<div class="hcFighterShadow"></div>';
	markup += "</div>";

	//THE NAMEPLATE. Everything the player reads about this fighter, in one plate.
	markup += honeycomb.combatScene.renderNameplate(entity, found);

	//The name at their feet, inside the fighter's own frame so it cannot cover the end turn button; enemies
	//only, since an ally is already named by their medallion and their cards.
	if (side == "enemy") {
		markup += '<div class="hcFighterFeetName">' + honeycomb.escapeText(definition.name) + "</div>";
	}

	markup += "</div>";

	//An AI combatant shows the CARD it is about to play, held at the corner of its window and leaning out
	//of it. Outside the frame, which clips; still anchored to the fighter rather than to the sprite, so
	//a lunging enemy does not drag its own card around the screen.
	if (aiControlled == true) markup += honeycomb.combatScene.renderIntent(entity);

	//The arrow shown while a held card would move this fighter through the party: on their left
	//pointing right when they would step to the front, on their right pointing left when they would
	//fall back. Empty until a preview asks for it.
	markup += '<div class="hcShiftArrow"></div>';

	markup += "</div>";
	return markup;
};

//--- The nameplate ----------------------------------------------------------------------------------
//The one thing floating over a fighter. Everything the player
//reads about them is in it:
//
//  vitals     the class medallion, the bar in its frame, the HP tab, the floating numbers (ui.vitals)
//  circles    their mechanic and every status, in circles under the bar (ui.plateCircleRow)
//  abilities  a menu dropped from the medallion, open only while asked for (renderAbilityMenu)
honeycomb.combatScene.renderNameplate = function (entity, found) {
	var combat = honeycomb.state.run.combat;
	//The battle lab edits the numbers in place: pressing the plate opens HP, tHP and Lust.
	var markup = '<div class="hcFighterVitals hcNameplate"' +
		(honeycomb.lab == null ? "" : honeycomb.lab.vitalsAttribute(entity)) + ">";
	markup += honeycomb.ui.vitals(entity, honeycomb.combatScene.plateVitalsOptions(entity, null));
	//A GOLEM'S MOVE sits on its plate rather than behind a medallion: a piece has exactly one, and
	//hiding a once-per-turn free action behind a press would be a pitfall. It reuses the ability
	//menu's classes so it looks like what it is -- a command -- without new styling.
	//
	//And it stacks under the status circles: a piece's ability bar must sit below its debuffs rather
	//than block the art at the top of the nameplate.
	//
	//Both were absolutely placed at fixed drops -- the circles at 108 plate-u, the button at 122 -- so the
	//button started inside the first row of circles and sank further under them with every status gained.
	//A fixed drop cannot clear a row that WRAPS, so the two go in one flow box instead: the box is placed
	//once, the circles wrap inside it, and the button follows whatever they grew to. Only a piece gets the
	//box, so no character's plate changes. See .hcPlateStack in honeycomb.css for the cost he accepted.
	var golemMove = honeycomb.combatScene.renderGolemMove(entity, combat);
	if (golemMove !== "") {
		markup += '<div class="hcPlateStack">' + honeycomb.ui.plateCircleRow(entity, combat) + golemMove + "</div>";
	} else {
		markup += honeycomb.ui.plateCircleRow(entity, combat);
	}
	if (honeycomb.combatScene.abilityMenuFor == entity.instanceId && found.kind == "character") {
		markup += honeycomb.combatScene.renderAbilityMenu(entity, combat);
	}
	markup += "</div>";
	return markup;
};


//Hearts on a broken fighter give the state a picture of its own, so it is easy to tell visually when
//a character is broken. They appear by growing, floating up while wobbling slightly, then shrinking
//and vanishing.
//
//Two elements per heart so the two motions cannot overwrite each other's transform: the outer RISES and
//grows/shrinks over the whole cycle, the inner SWAYS on its own shorter loop. Every heart's start is
//pushed back by its share of a cycle, so they rise in turn rather than as one.
//One entry per heart in tuning.brokenOverlay.fighterHeartArray, so where and how many is content.
honeycomb.combatScene.renderBrokenHearts = function () {
	var tuning = honeycomb.tuning.brokenOverlay;
	var cycleMs = Math.round(honeycomb.duration(tuning.fighterHeartCycleDuration));
	var wobbleMs = Math.round(honeycomb.duration(tuning.fighterHeartWobbleDuration));
	var markup = '<div class="hcBrokenHearts" style="' +
		"--hcHeartCycle:" + cycleMs + "ms;" +
		"--hcHeartWobble:" + wobbleMs + "ms;" +
		"--hcHeartRise:" + tuning.fighterHeartRisePercent + "%;" +
		"--hcHeartSway:" + tuning.fighterHeartWobblePercent + "%;" +
		"--hcHeartTilt:" + tuning.fighterHeartWobbleDegrees + "deg;" +
		"--hcHeartFilter:" + tuning.fighterHeartFilter + ';">';
	for (var heartIndex = 0; heartIndex < tuning.fighterHeartArray.length; heartIndex++) {
		var heart = tuning.fighterHeartArray[heartIndex];
		markup += '<div class="hcBrokenHeart" style="' +
			"left:" + heart.leftPercent + "%;top:" + heart.topPercent + "%;width:" + heart.sizePercent + "%;" +
			"animation-delay:" + Math.round(cycleMs * heart.delayFraction) + 'ms;">' +
			'<div class="hcBrokenHeartSway" style="animation-delay:' + Math.round(cycleMs * heart.delayFraction) + 'ms;">' +
			honeycomb.imageTag(tuning.fighterHeartPath, { className: "hcBrokenHeartArt", silentFallback: true, alt: "" }) +
			"</div></div>";
	}
	markup += "</div>";
	return markup;
};

//--- Abilities, from the medallion ------------------------------------------------------------------
//The medallion is the launcher: it glows while any ability can be used, and pressing it drops this menu.
//Each row IS the ability -- pressing it aims or fires, exactly as the old chips did -- and one that may
//not be used is dim and says why on hover (honeycomb.abilities.usability, whose requirements are reported
//one by one). The menu's owner is `abilityMenuFor`, so a repaint redraws it open.
honeycomb.combatScene.abilityMenuFor = null;

//THE MOVE BUTTON. Drawn for any piece standing with the party that declares an `allyActivation`, dim
//and explaining itself when it cannot be used. Nothing else in the game offers a free action that is
//not a card or an ability, so this is its own small control.
honeycomb.combatScene.renderGolemMove = function (entity, combat) {
	var activation = honeycomb.golemActivation(entity);
	if (activation == null) return "";
	var usability = honeycomb.golemActivationUsability(entity, combat);
	var classList = "hcAbilityMenu hcGolemMove" + (usability.usable == true ? " hcReady" : " hcUnplayable");
	var label = activation.text == null ? "Move" : activation.text;
	var markup = '<div class="' + classList + '" onclick="event.stopPropagation()">';

	//EVERY MOVE IS ONE BUTTON. A free-pick Move used to draw a row of numbered slots, on the
	//argument that it costs no new interaction paradigm -- a knight should not have a list, it should be
	//a button like everyone else. The paradigm was never new -- cards already target -- so the list was the thing that invented a
	//second way to point at something, and it stood over the neighbouring fighter while doing it.
	//A Move that picks enters the shared aim mode; one that does not just fires.
	var aiming = honeycomb.combatScene.pendingAim != null &&
		honeycomb.combatScene.pendingAim.sourceId == entity.instanceId;
	var handler = activation.pick != null ? "onGolemAimPick" : "onGolemMovePick";
	markup += '<div class="hcAbilityOption ' + (usability.usable == true ? "hcReady" : "hcUnplayable") +
		(aiming == true ? " hcAiming" : "") + '"' +
		' title="' + honeycomb.escapeAttribute(usability.usable == true ? label : (usability.reason == null ? label : usability.reason)) + '"' +
		(activation.pick != null
			? ' onpointerdown="honeycomb.combatScene.onAimPointerDown(event, \'activation\', \'' + entity.instanceId + '\')"'
			: "") +
		' onclick="honeycomb.combatScene.' + handler + '(event, \'' + entity.instanceId + '\')">';
	markup += '<span class="hcAbilityOptionName">' + honeycomb.escapeText(label) + "</span>";
	markup += "</div></div>";
	return markup;
};

//Pressing a free-pick Move: it enters aiming rather than acting, and pressing it again puts the aim
//away, so the button is its own cancel. The commit is combatScene.aimAt -> commitActivationAim.
honeycomb.combatScene.onGolemAimPick = function (event, instanceId) {
	if (event != null) event.stopPropagation();
	//A drag already decided this press. The browser still sends the click afterwards; it is not a
	//second instruction.
	if (honeycomb.combatScene.aimDragSuppressClick == true) { honeycomb.combatScene.aimDragSuppressClick = false; return; }
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (combat == null || honeycomb.combatScene.busy == true) return;
	if (honeycomb.combatScene.pendingAim != null &&
		honeycomb.combatScene.pendingAim.sourceId == instanceId) {
		honeycomb.combatScene.cancelAim(true);
		return;
	}
	var entity = honeycomb.findEntity(instanceId, combat);
	if (entity == null) return;
	var activation = honeycomb.golemActivation(entity);
	//A pick with no target mode has nothing to decide legality with, so it is refused rather than
	//aiming at everybody. The content rule that catches it at boot is warnings' `golemPickTargetMode`.
	if (activation == null || activation.pick == null || activation.targetMode == null) return;
	var usability = honeycomb.golemActivationUsability(entity, combat);
	if (usability.usable != true) {
		honeycomb.combatScene.flashMessage(usability.reason == null ? "It cannot move." : usability.reason);
		return;
	}
	honeycomb.combatScene.beginAim({
		kind: "activation",
		sourceId: instanceId,
		targetMode: activation.targetMode,
		label: activation.text == null ? "Move" : activation.text,
		prompt: activation.text == null ? "Choose where it moves." : activation.text,
	});
};

//Pressing it. The board changes under the player, so the scene repaints rather than patching the plate.
honeycomb.combatScene.onGolemMovePick = function (event, instanceId) {
	if (event != null) event.stopPropagation();
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (combat == null) return;
	var entity = honeycomb.findEntity(instanceId, combat);
	if (entity == null) return;
	var context = honeycomb.newEffectContext({ combat: combat, source: entity });
	if (honeycomb.runGolemActivation(entity, context) != true) return;
	honeycomb.combatScene.repaint();
};

honeycomb.combatScene.renderAbilityMenu = function (entity, combat) {
	var abilityArray = honeycomb.abilities.memberAbilityArray(entity);
	if (abilityArray.length === 0) return "";

	var markup = '<div class="hcAbilityMenu" onclick="event.stopPropagation()">';
	for (var scanIndex = 0; scanIndex < abilityArray.length; scanIndex++) {
		var ability = abilityArray[scanIndex];
		var usability = honeycomb.abilities.usability(entity, ability.index, combat);
		var aiming = honeycomb.combatScene.pendingAim != null &&
			honeycomb.combatScene.pendingAim.kind == "ability" &&
			honeycomb.combatScene.pendingAim.abilityIndex == ability.index &&
			honeycomb.combatScene.pendingAim.sourceId == entity.instanceId;

		var classList = "hcAbilityOption" + (usability.usable == true ? " hcReady" : " hcUnplayable");
		if (aiming == true) classList += " hcAiming";

		//AN ABILITY THAT PICKS A TARGET IS DRAGGABLE, on the same terms a card is: drag it
		//onto a fighter, or click it and click the fighter. One that needs no target has nothing to drag
		//to, so it stays a plain press.
		var draggable = honeycomb.targetModeRequiresPick(ability.definition.targetMode) == true;
		markup += '<div class="' + classList + '"' +
			honeycomb.tooltip.attributes("ability", ability.index, { memberInstanceId: entity.instanceId }) +
			(draggable ? ' onpointerdown="honeycomb.combatScene.onAimPointerDown(event, \'ability\', \'' + entity.instanceId + '\', \'' + ability.index + '\')"' : "") +
			' onclick="honeycomb.combatScene.onAbilityPick(event, \'' + entity.instanceId + '\', \'' + ability.index + '\')">';
		markup += honeycomb.ui.iconTag(ability.definition.iconPath, "shard",
			usability.usable == true ? "#f0d89a" : "#6b5b7d", { className: "hcAbilityOptionIcon" });
		markup += '<span class="hcAbilityOptionName">' + honeycomb.escapeText(ability.definition.name) + "</span>";
		markup += '<span class="hcAbilityOptionCharges">' + ability.charges + "/" + ability.chargeMaximum + "</span>";
		markup += "</div>";
	}
	return markup + "</div>";
};

//Whether any of a character's abilities can be used right now: what makes the medallion glow.
honeycomb.combatScene.anyAbilityUsable = function (entity, combat) {
	var abilityArray = honeycomb.abilities.memberAbilityArray(entity);
	for (var scanIndex = 0; scanIndex < abilityArray.length; scanIndex++) {
		if (honeycomb.abilities.usability(entity, abilityArray[scanIndex].index, combat).usable == true) return true;
	}
	return false;
};

//PRESSING THE MEDALLION. A Broken character's abilities are sealed (abilities.usability refuses them),
//so the press says so instead of opening a menu of dead rows.
honeycomb.combatScene.onMedallionClick = function (domEvent, memberInstanceId) {
	if (domEvent != null && domEvent.stopPropagation != null) domEvent.stopPropagation();
	if (honeycomb.combatScene.busy == true) return;
	var member = honeycomb.findEntity(memberInstanceId, honeycomb.state.run.combat);
	if (member == null) return;
	if (member.broken == true) {
		honeycomb.combatScene.flashMessage("Broken: their abilities are sealed until they recover.");
		return;
	}
	var opening = honeycomb.combatScene.abilityMenuFor != memberInstanceId;
	honeycomb.platform.sound("uiClick");
	if (opening == true) honeycomb.combatScene.openAbilityMenu(memberInstanceId);
	else honeycomb.combatScene.closeAbilityMenu();
};

//OPENED IN PLACE, the way closeAbilityMenu already closed it. This used to repaint, and `repaint` is
//`root.innerHTML = render()` -- so pressing a medallion destroyed and rebuilt every fighter on the
//board. A brand-new element cannot have been entered by a pointer that never moved, so the depth-focus
//hover rule stopped applying: the figure under the pointer dropped to its resting transform and grew
//back over 260ms as hover re-applied: the ability menu shrank and expanded again whenever a repaint
//dropped the hover state mid-click.
//It is the hand-bounce bug's mechanism, in the third place it has turned up. The cure is the same one
//every time: update in place rather than replacing.
honeycomb.combatScene.openAbilityMenu = function (memberInstanceId) {
	honeycomb.combatScene.closeAbilityMenu();
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var member = honeycomb.findEntity(memberInstanceId, combat);
	var found = member == null ? null : honeycomb.entityDefinition(member);
	//Only a character carries a medallion; a piece's Move sits on its plate already.
	if (found == null || found.kind != "character") return;
	var fighter = honeycomb.combatScene.fighterElement(memberInstanceId);
	var plate = fighter == null ? null : fighter.querySelector(".hcFighterVitals");
	if (plate == null) return;
	honeycomb.combatScene.abilityMenuFor = memberInstanceId;
	plate.insertAdjacentHTML("beforeend", honeycomb.combatScene.renderAbilityMenu(member, combat));
	//The medallion is already on screen, so its open state is set here rather than by a redraw.
	var medallion = plate.querySelector(".hcPlateMedallion");
	if (medallion != null) medallion.classList.add("hcOpen");
};

//Closes the menu WITHOUT a repaint: an ability that fires straight away hands the screen to its replay,
//and the menu must not hang over that replay until the closing repaint.
honeycomb.combatScene.closeAbilityMenu = function () {
	if (honeycomb.combatScene.abilityMenuFor == null) return;
	honeycomb.combatScene.abilityMenuFor = null;
	var root = honeycomb.rootElement();
	if (root == null) return;
	//NOT THE GOLEM MOVE ROWS. renderGolemMove borrows .hcAbilityMenu for its chrome, so an unqualified
	//sweep here removed every piece's Move control from the board whenever a character's ability menu
	//closed -- and several onFighterClick branches do not repaint, so they stayed gone until something
	//else redrew the screen.
	var menuArray = root.querySelectorAll(".hcAbilityMenu:not(.hcGolemMove)");
	for (var menuIndex = 0; menuIndex < menuArray.length; menuIndex++) menuArray[menuIndex].remove();
	var openArray = root.querySelectorAll(".hcPlateMedallion.hcOpen");
	for (var openIndex = 0; openIndex < openArray.length; openIndex++) openArray[openIndex].classList.remove("hcOpen");
};

//Where a combatant stands relative to their side's row: "back" for one anchored behind it, null for
//one taking their place in it. Read from the entity's saved placement, so an encounter can say it too.
//
//An anchor holds only on the line it was written for. "Behind her row" means behind her
//BROOD, who are drawn to stand around her. Stood on the other line she went behind the party instead,
//and her plate -- lifted over the row so her brood cannot bury it -- landed on two party members'
//plates and medallions (her plate 224-529 over an ally's at 259-419). A displaced combatant takes a
//place in the row like anyone else.
honeycomb.combatScene.placementAnchor = function (entity) {
	if (entity == null || entity.placement == null) return null;
	if ((entity.side == "enemy" ? "enemy" : "ally") != honeycomb.art.nativeSideFor(entity)) return null;
	return entity.placement.anchor == null ? null : entity.placement.anchor;
};

//The nameplate's share of its usual height, written on the FIGHTER rather than the art wrap so the
//vitals can read it. Nothing is emitted for a fighter standing at full size, which is every
//combatant the game shipped with before the chess pieces were given their own scales.
honeycomb.combatScene.vitalsScaleStyle = function (placement) {
	var scale = placement == null || placement.scale == null ? 1 : placement.scale;
	var followed = honeycomb.vitalsScaleFor(scale);
	return followed == 1 ? "" : ' style="--hcVitalsScale:' + followed + '"';
};

//The inline style carrying a placement's custom properties, or nothing for a fighter with none.
honeycomb.combatScene.placementStyle = function (placement) {
	if (placement == null) return "";
	var pieceArray = [];
	if (placement.scale != null) pieceArray.push("--hcPlacementScale:" + placement.scale);
	if (placement.offsetXPercent != null) pieceArray.push("--hcPlacementX:" + placement.offsetXPercent + "%");
	if (placement.offsetYPercent != null) pieceArray.push("--hcPlacementY:" + placement.offsetYPercent + "%");
	return pieceArray.length === 0 ? "" : ' style="' + pieceArray.join(";") + '"';
};

//The enemy's next move, as a card, more present in their space and waiting for the player to hover
//over it. A small copy sits at the corner of
//their window; its rules text is too small to read there, so the numbers that matter ride on a badge
//(the damage after every modifier, as the old icon showed) and HOVERING opens the card full size,
//worded with live numbers. Tapping it -- or the enemy -- opens every move this enemy has shown.
//Where a fighter stands in its own side's line, for the intent stagger. Null for an anchored fighter
//(a boss behind the row), which has its own placement and must not be stepped aside.
honeycomb.combatScene.lineSlotIndex = function (entity) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var combat = run == null ? null : run.combat;
	if (entity == null || combat == null) return null;
	if (honeycomb.combatScene.placementAnchor(entity) != null) return null;
	var array = entity.side == "enemy" ? combat.enemyArray : run.partyArray;
	var index = array == null ? -1 : array.indexOf(entity);
	return index < 0 ? null : index;
};

honeycomb.combatScene.renderIntent = function (entity) {
	if (entity == null || entity.downed == true || honeycomb.isAiControlled(entity) == false) return "";
	//A move already played this turn has no telegraph left to show: without this a
	//repaint mid-turn -- the Matriarch's Swarm summoning her brood -- redrew the card she had just cast.
	if (entity.intentSpent == true) return "";
	var card = honeycomb.telegraphedCard(entity);
	if (card == null) return "";
	//ADJACENT INTENT CARDS DO NOT STACK: every other slot in the line steps
	//its card aside, so two neighbours do not lean over one another.
	var slotIndex = honeycomb.combatScene.lineSlotIndex(entity);
	var stagger = slotIndex != null && slotIndex % 2 === 1 ? honeycomb.tuning.layout.intentStaggerLeftPercent : 0;
	//The badge wears the move's primary card type -- a card like any other.
	var type = honeycomb.cardType(card);
	var combat = honeycomb.state.run.combat;

	var display = honeycomb.moveDisplayAmount(entity, card, combat);
	var label = display == null ? "" : (display.hits > 1 ? display.amount + "×" + display.hits : String(display.amount));

	//A charged move stands LARGER as well as wearing the rarer frame. The size itself is the layout's,
	//scaled by tuning.
	var rare = card.isRareMove == true;
	return '<div class="hcIntentCardSlot' + (rare ? " hcIntentRare" : "") + '" id="honeycombIntent-' +
		honeycomb.escapeAttribute(entity.instanceId) + '"' +
		' style="--hcIntentColor:' + type.color + ';--hc-intent-stagger-left:' + stagger + '%"' +
		honeycomb.tooltip.attributes("intent", entity.instanceId) +
		//In the Battle Lab the telegraph is an EDIT handle: pressing it chooses the move instead of
		//listing the kit.
		(honeycomb.lab == null || honeycomb.lab.intentClickAttribute(entity) == null
			? ' onclick="event.stopPropagation();honeycomb.enemyMoves.show(\'' + entity.instanceId + '\')"'
			: honeycomb.lab.intentClickAttribute(entity)) + ">" +
		honeycomb.ui.card(card, {
			size: "small", showTooltip: false, showAffinity: false, className: "hcIntentCard",
			live: { source: entity, target: null, combat: combat },
		}) +
		'<span class="hcIntentAmount">' +
		honeycomb.ui.iconTag(type.iconPath, type.glyph, type.color, { className: "hcIntentIcon" }) +
		(label === "" ? "" : "<span>" + label + "</span>") + "</span>" +
		"</div>";
};

//The move an AI combatant is playing, as its card, found through the combatant. Its pose and flourishes
//come from the card or its type, exactly as a party card's do.
honeycomb.combatScene.moveFor = function (cardIndex, sourceId) {
	var entity = honeycomb.findEntity(sourceId, honeycomb.state.run.combat);
	return entity == null ? null : honeycomb.moveCard(entity, cardIndex);
};

//Plays one action's presentation: the two-frame pose on the actor, then each named flourish. The
//flourishes are handed the same source and target the action had, so "burst on the target" and
//"lunge from the source" both land on the right fighter without the content saying which that is.
honeycomb.combatScene.playPresentation = function (presentation, sourceId, targetId) {
	if (presentation == null) return;
	if (sourceId != null) honeycomb.combatScene.playActionFrame(sourceId, presentation.pose, presentation.holdMs);
	var animationArray = presentation.animationArray == null ? [] : presentation.animationArray;
	for (var scanIndex = 0; scanIndex < animationArray.length; scanIndex++) {
		var animation = animationArray[scanIndex];
		honeycomb.combatScene.playNamedAnimation({
			animation: animation.animation,
			color: animation.color,
			strength: animation.strength,
			sourceId: sourceId,
			targetId: targetId,
		});
	}
};

//What a hit fully absorbed by temporary health says as it floats up.
honeycomb.combatScene.absorbedText = "Absorbed";

//--- Hand bar ---------------------------------------------------------------------------------------
honeycomb.combatScene.renderHandBar = function () {
	var combat = honeycomb.state.run.combat;
	//THE SHELF (layout flag handShelf): a long shelf the cards float over, an end piece each side --
	//the energy diamond at the left, the End Turn plaque at
	//the right. A layout without the flag draws the plain bar, orb and button as before.
	var shelf = honeycomb.battleLayout().handShelf == true ? honeycomb.tuning.art.handShelf : null;

	var markup = '<div class="hcHandBar">';
	if (shelf != null) {
		markup += '<div class="hcHandShelfBack">' +
			honeycomb.imageTag(shelf.backPath, { className: "hcHandShelfBackArt", alt: "", silentFallback: true }) + "</div>";
	}

	//Energy orb and draw pile on the left.
	markup += '<div class="hcHandLeft">';
	//The denominator is what this turn actually granted, relics included, not the tuning base.
	var energyMaximum = combat.energyThisTurn == null ? honeycomb.tuning.combat.energyPerTurn : combat.energyThisTurn;
	var energyMarkup = '<div class="hcEnergyOrb" title="Energy remaining this turn"' +
		(honeycomb.lab == null ? "" : honeycomb.lab.energyAttribute()) + ">" +
		'<span class="hcEnergyValue">' + honeycomb.getResource("energy") + "</span>" +
		'<span class="hcEnergyMax">/' + energyMaximum + "</span></div>";
	if (shelf != null) {
		var leftArtPath = honeycomb.getResource("energy") <= 0 ? shelf.leftEmptyPath : shelf.leftPath;
		markup += '<div class="hcShelfEnd hcShelfEndLeft">' +
			honeycomb.imageTag(leftArtPath, { className: "hcShelfEndArt", id: "honeycombShelfLeftArt", alt: "", silentFallback: true }) + energyMarkup + "</div>";
	} else {
		markup += energyMarkup;
	}
	//The piles OPEN when clicked -- tapped, on a touchscreen -- to show what is in them.
	//The piles are drawn as decks and carry ids, because cards are seen leaving and landing on them; see
	//the hand motion section.
	//THE DECK IS THE CARD LIST while the Battle Lab is on: clicking it opens a sorted list of the game's
	//cards, and clicking one of those draws it to hand.
	var drawPileAction = honeycomb.lab == null || honeycomb.lab.drawPileClick() == null
		? "honeycomb.pileView.show('drawPileArray')" : honeycomb.lab.drawPileClick();
	var drawPileMarkup = '<div class="hcPileCount hcPileDeck hcClickable" id="honeycombPile-drawPile"' +
		' title="Draw pile" onclick="' + drawPileAction + '">' +
		honeycomb.combatScene.renderPileDeck("drawPileArray", combat.drawPileArray.length, null) +
		'<span class="hcPileNumber">' + combat.drawPileArray.length + "</span></div>";
	//The fight so far, in words. See honeycomb.battleLogView.
	var buttonMarkup = '<div class="hcHandButtons">';
	buttonMarkup += '<div class="hcPileCount hcClickable hcLogButton" title="Battle log" onclick="honeycomb.battleLogView.show()">' +
		honeycomb.ui.iconTag(null, "scroll", "#9c8fae", { className: "hcPileIcon" }) + "<span>Log</span></div>";
	//How fast the fight plays out. A tap opens the SLIDER over every named step, slow end included; see
	//honeycomb.combatScene.openSpeedPanel.
	var speed = honeycomb.findDefinition(honeycomb.tuning.animation.playSpeedArray, honeycomb.playSpeed());
	buttonMarkup += '<div class="hcPileCount hcClickable hcSpeedButton' +
		(speed != null && speed.inspection == true ? " hcSpeedSlowed" : "") + '" id="honeycombSpeedButton" title="Play speed: ' +
		honeycomb.escapeAttribute(speed == null ? "" : speed.name) + ' (tap for the slider)"' +
		' onclick="honeycomb.combatScene.onSpeedButton()">' +
		honeycomb.ui.iconTag(null, "arrows", "#9c8fae", { className: "hcPileIcon" }) +
		"<span>" + honeycomb.escapeText(speed == null ? "" : speed.label) + "</span></div>";
	buttonMarkup += "</div>";
	//On the shelf the small buttons sit between the diamond and the deck, as the mockup has them.
	markup += shelf != null ? buttonMarkup + drawPileMarkup : drawPileMarkup + buttonMarkup;
	markup += "</div>";

	//The fanned hand. A card being read by a tap stays up through a repaint -- unless it has left the
	//hand, in which case there is nothing left to read.
	if (combat.handArray.indexOf(honeycomb.combatScene.touchInspectId) < 0) honeycomb.combatScene.touchInspectId = null;
	//`hcHandRaised` is the carried-over hover (see repaint); the pointer actually leaving clears it and
	//hands the question back to `:hover`.
	markup += '<div class="hcHand' + (honeycomb.combatScene.touchInspectId != null ? " hcTouchReading" : "") + '" id="honeycombHand"' +
		' onmouseleave="this.classList.remove(\'hcHandRaised\')">';
	for (var handIndex = 0; handIndex < combat.handArray.length; handIndex++) {
		markup += honeycomb.combatScene.renderHandCard(combat.handArray[handIndex], handIndex, combat.handArray.length);
	}
	markup += "</div>";

	//Discard pile and End Turn on the right.
	markup += '<div class="hcHandRight">';
	var discardTopId = combat.discardPileArray.length === 0 ? null : combat.discardPileArray[combat.discardPileArray.length - 1];
	markup += '<div class="hcPileCount hcPileDeck hcClickable" id="honeycombPile-discardPile" title="Discard pile" onclick="honeycomb.pileView.show(\'discardPileArray\')">' +
		honeycomb.combatScene.renderPileDeck("discardPileArray", combat.discardPileArray.length, discardTopId) +
		'<span class="hcPileNumber">' + combat.discardPileArray.length + "</span></div>";
	var endTurnMarkup = '<div class="hcButton hcPrimary hcEndTurn' + (shelf != null ? " hcEndTurnInvisible" : "") + '" id="honeycombEndTurn"' +
		' onclick="honeycomb.combatScene.onEndTurnPressed()">End Turn</div>';
	if (shelf != null) {
		var rightArtPath = honeycomb.combatScene.endTurnReady(combat) ? shelf.rightPath : shelf.rightEmptyPath;
		markup += '<div class="hcShelfEnd hcShelfEndRight">' +
			honeycomb.imageTag(rightArtPath, { className: "hcShelfEndArt", id: "honeycombShelfRightArt", alt: "", silentFallback: true }) + endTurnMarkup + "</div>";
	} else {
		markup += endTurnMarkup;
	}
	markup += "</div>";

	markup += "</div>";
	return markup;
};

//Where one card sits in the fan: its angle and lift, and its stacking order. Computed here rather than
//in CSS because it depends on how many cards are held, which CSS cannot see. Shared by the render and
//by the hand motion, which re-fans the cards as they come and go.
honeycomb.combatScene.handFanStyle = function (handIndex, handCount) {
	var layout = honeycomb.tuning.layout;
	//Spread the configured total arc across however many cards are held, centred on the middle.
	var centre = (handCount - 1) / 2;
	var offsetFromCentre = handIndex - centre;
	var spreadStep = handCount <= 1 ? 0 : layout.handMaxSpreadDegrees / handCount;
	var rotation = offsetFromCentre * spreadStep;
	//Cards further from the centre sit lower, so the fan curves rather than tilting flat.
	var rise = centre === 0 ? 0 : layout.handMaxRisePixels * (1 - Math.pow(offsetFromCentre / Math.max(1, centre), 2));
	return {
		transform: "rotate(" + rotation.toFixed(2) + "deg) translateY(" + honeycomb.cssPixels((-rise).toFixed(1)) + ")",
		zIndex: honeycomb.combatScene.handBaseZIndex + handIndex,
	};
};

//The stacking order of the leftmost card; each card to its right sits one above it.
honeycomb.combatScene.handBaseZIndex = 10;

//THE FAN HAS TO FIT BETWEEN THE BUTTONS. Slots overlap by a fixed percentage, so a hand simply gets
//wider as it grows -- and a big one reached out over the draw and discard piles and the Log and Speed
//buttons on either side. A hovered card sits at the large-card z-index, above both of those blocks, so
//the cards that overhang them take the clicks.
//
//The overlap is therefore not fixed but fitted: the gap between the two blocks is measured, and the
//cards are pulled together until the fan spans no more than that. `handOverlapMaxPercent` is the floor
//on how much of each card stays showing, so a very large hand crowds rather than stacking into one pile.
//A fan of `count` cards spans 1 + (count - 1) * (1 - overlap) card widths, which is what is solved here.
//
//Measured rather than computed from tuning because the gap depends on the window: the two blocks hold
//text that wraps differently at different sizes, and the shelf layout puts art in them.
honeycomb.combatScene.fitHandFan = function (hand) {
	var layout = honeycomb.tuning.layout;
	if (hand == null) hand = document.getElementById("honeycombHand");
	if (hand == null) return;
	var slotArray = hand.getElementsByClassName("hcHandSlot");
	var count = slotArray.length;
	//One card has no fan to fit, and no cards have nothing to measure.
	if (count <= 1) {
		hand.style.setProperty("--hc-hand-overlap-fraction", String(layout.handOverlapPercent / 100));
		return;
	}

	var bar = hand.parentNode;
	var left = bar == null ? null : bar.getElementsByClassName("hcHandLeft")[0];
	var right = bar == null ? null : bar.getElementsByClassName("hcHandRight")[0];
	//The gap the fan lives in. With a block missing -- a layout that draws neither -- the bar's own
	//width is the whole of it.
	var available = 0;
	if (left != null && right != null) {
		available = right.getBoundingClientRect().left - left.getBoundingClientRect().right;
	} else if (bar != null) {
		available = bar.clientWidth;
	}
	available = available * layout.handFanGapUsedFraction;
	var cardWidth = slotArray[0].offsetWidth;
	var cardHeight = slotArray[0].offsetHeight;
	//Nothing has been laid out yet (a hidden scene, a zero-width window): leave the overlap alone
	//rather than writing a number worked out from zeroes.
	if (!(available > 0) || !(cardWidth > 0)) return;

	//THE CARDS AT THE ENDS ARE TURNED, and a turned card is wider than its own box: it reaches out by
	//its corner. Measuring the fan by card widths alone left that corner over the buttons. The bulge
	//is the difference between the outermost card's turned width and its upright one, half of it at
	//each end -- so it comes off the space before the fan is fitted into what is left.
	//The outermost card's angle, on the same terms handFanStyle turns them by.
	var outerDegrees = ((count - 1) / 2) * (layout.handMaxSpreadDegrees / count);
	var radians = Math.abs(outerDegrees) * Math.PI / 180;
	var turnedWidth = cardWidth * Math.cos(radians) + cardHeight * Math.sin(radians);
	available = available - Math.max(0, turnedWidth - cardWidth);
	if (!(available > cardWidth)) return;

	var spanAllowed = available / cardWidth;
	var needed = 100 * (1 - (spanAllowed - 1) / (count - 1));
	var overlap = Math.max(layout.handOverlapPercent, needed);
	overlap = Math.min(layout.handOverlapMaxPercent, overlap);
	hand.style.setProperty("--hc-hand-overlap-fraction", (overlap / 100).toFixed(4));
};

//One card in the fan.
honeycomb.combatScene.renderHandCard = function (instanceId, handIndex, handCount) {
	var resolved = honeycomb.combat.resolveById(instanceId);
	if (resolved == null) return "";
	var fan = honeycomb.combatScene.handFanStyle(handIndex, handCount);

	var combat = honeycomb.state.run.combat;
	var context = honeycomb.newEffectContext({ combat: combat, card: resolved });
	var cost = honeycomb.cardCost(resolved, "energy", context);
	var affordable = cost != null && honeycomb.getResource("energy") >= cost;
	//A card refused for a reason other than energy -- a downed owner, most often -- says so on itself
	//rather than only when the player tries and fails.
	var playability = honeycomb.cardPlayability(resolved, combat);

	//THE SLOT AND THE CARD ARE SEPARATE ELEMENTS, and this is the reason: the SLOT carries the fan
	//position, written by JS; the CARD carries every state transform, written by CSS. Before the split
	//both lived on one element, so the hover rule needed !important to beat the inline fan transform --
	//and that !important then overrode the drag's own inline transform and made the card oscillate.
	//With two elements the two never compete, the hover rule needs no !important, and "the hand drops
	//while a card is held" is a CSS rule rather than a pile of JS.
	//The fan's stacking order is a CSS VARIABLE, not an inline z-index: an inline z-index outranks the
	//stylesheet, so a hovered card could never rise over its right-hand neighbours.
	var slotStyle = "transform: " + fan.transform + ";" + "--hcFanZ:" + fan.zIndex + ";";

	//Hovering a card puts its OWNER in focus on the battlefield and half-focuses everyone else, which
	//is how the board says whose card this is -- better than a name floating over the art did.
	return '<div class="hcHandSlot' + (honeycomb.combatScene.touchInspectId == instanceId ? " hcTouchInspect" : "") + '" style="' + slotStyle + '"' +
		' data-hcSlotFor="' + honeycomb.escapeAttribute(instanceId) + '"' +
		' data-hcHandIndex="' + handIndex + '"' +
		' onmouseenter="honeycomb.combatScene.onHandHover(\'' + honeycomb.escapeAttribute(instanceId) + '\')"' +
		' onmouseleave="honeycomb.combatScene.onHandHover(null)">' +
		honeycomb.ui.card(resolved, {
			size: "medium",
			instanceId: instanceId,
			className: "hcHandCard",
			affordable: affordable,
			unplayable: playability.playable == false,
			unplayableText: playability.explanation,
			//The hand already lifts and enlarges the real card on hover, so the panel drops the copy
			//and keeps only what the card face does not say.
			tooltipKind: "cardNote",
			//What it will actually cost, and what its numbers will actually do: the acting character's
			//statuses now, the target's too once one is being aimed at (see refreshHeldCardText).
			cost: cost,
			live: { source: honeycomb.cardActingEntity(resolved, combat), target: null, combat: combat },
		}) + "</div>";
};

//The hand says at once what can still be played. A play's energy is spent before its
//replay starts, but the hand used to keep its old look until the replay's closing repaint -- so after
//the last point of energy went, the cards still looked live for the length of the animation. Called as
//soon as an action resolves: the energy orb and every shown card are brought up to date in place,
//without rebuilding anything the replay is about to animate.
honeycomb.combatScene.refreshHandPlayability = function () {
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var hand = document.getElementById("honeycombHand");
	if (combat == null || hand == null) return;
	var energyValue = document.querySelector("#honeycombRoot .hcEnergyValue") || document.getElementsByClassName("hcEnergyValue")[0];
	if (energyValue != null) energyValue.textContent = String(honeycomb.getResource("energy"));
	var cardArray = hand.getElementsByClassName("hcHandCard");
	for (var cardIndex = 0; cardIndex < cardArray.length; cardIndex++) {
		var card = cardArray[cardIndex];
		var resolved = honeycomb.combat.resolveById(card.dataset.hccardid);
		if (resolved == null) continue;
		var cost = honeycomb.cardCost(resolved, "energy", honeycomb.newEffectContext({ combat: combat, card: resolved }));
		card.classList.toggle("hcUnaffordable", cost == null || honeycomb.getResource("energy") < cost);
		card.classList.toggle("hcUnplayable", honeycomb.cardPlayability(resolved, combat).playable == false);
	}
	honeycomb.combatScene.refreshShelfState();
};

//Re-prints the held card's numbers against whatever it is aimed at, so a Sundered target visibly
//raises the damage the moment the card is over it.
honeycomb.combatScene.refreshHeldCardText = function (cardInstanceId, targetId) {
	var card = honeycomb.combatScene.dragElement;
	var body = card == null ? null : card.getElementsByClassName("hcCardTextBody")[0];
	var resolved = honeycomb.combat.resolveById(cardInstanceId);
	if (body == null || resolved == null) return;
	var combat = honeycomb.state.run.combat;
	var target = targetId == null ? null : honeycomb.findEntity(targetId, combat);
	body.innerHTML = honeycomb.cardTextMarkup(resolved,
		{ source: honeycomb.cardActingEntity(resolved, combat), target: target, combat: combat });
};

//---------------------------------------------------------------------------------------------------
//Input
//---------------------------------------------------------------------------------------------------
//Cards are dragged with POINTER EVENTS and pointer capture, deliberately not with document-level
//mouse handlers. Two reasons:
//  1. Syrup Town's Jiggy minigame keeps permanent document-level mousemove/mouseup/wheel listeners.
//     They only act on elements carrying the class "puzzle-piece", so honeycomb never uses that class
//     and Jiggy's handlers walk an empty collection while a card is dragged. Nothing is added to or
//     removed from the document by honeycomb, so Jiggy is untouched whether honeycomb is running or
//     not.
//  2. Pointer capture routes every move and release to the card itself even when the pointer leaves
//     it, so no global listener is needed at all -- and the drag cannot be lost off the window edge.
honeycomb.combatScene.attachDragHandlers = function () {
	var hand = document.getElementById("honeycombHand");
	if (hand == null) return;
	var cardArray = hand.getElementsByClassName("hcHandCard");
	for (var cardIndex = 0; cardIndex < cardArray.length; cardIndex++) {
		cardArray[cardIndex].addEventListener("pointerdown", honeycomb.combatScene.onPointerDown);
	}
};

honeycomb.combatScene.onPointerDown = function (event) {
	//While the slot window is asking for cards, the hand is for CHOOSING, not playing.
	if (honeycomb.combatScene.selecting == true) { honeycomb.combatScene.onSelectionPointerDown(event); return; }
	var combat = honeycomb.state.run.combat;
	if (combat == null || combat.phase != "playerTurn") return;
	//A card can be picked up while the last play is still animating. The hand looked
	//live and silently refused, which read as the game breaking. Such a drag is QUEUED: it aims and
	//releases as normal but runs no previews, since those would draw a forecast against a board the replay
	//has not finished showing. Once the turn is ending there is nothing left to queue a card into.
	if (honeycomb.combatScene.endTurnQueued() == true) {
		honeycomb.combatScene.flashMessage(honeycomb.combatScene.refusalText("turnEnding"));
		return;
	}
	honeycomb.combatScene.dragQueued = honeycomb.combatScene.busy == true;

	var card = event.currentTarget;
	var instanceId = card.dataset.hccardid;
	if (instanceId == null || instanceId === "") return;

	//Reaching for a card abandons a half-aimed ability -- through cancelAim, so the legal-target marks
	//it left on the board go with it rather than lingering until something else redraws.
	honeycomb.combatScene.cancelAim(true);
	//A dragged card follows the pointer, so it keeps entering and leaving itself and re-raises its own
	//tooltip several times a second -- the panel then chases the drag around the screen. Suppressed
	//for the whole drag rather than hidden once, because hiding it only wins the first round.
	honeycomb.tooltip.suppress(true);

	//Marks the whole hand as dragging, which suppresses the hover-lift rule. That rule is !important
	//-- it has to be, to beat the inline fan transform -- and while a drag is live it would override
	//the drag's own inline transform and fight it. See the comment on the rule.
	var handElement = document.getElementById("honeycombHand");
	if (handElement != null) handElement.classList.add("hcDragging");

	//Capture routes every subsequent move and the release to this element, so the drag survives the
	//pointer leaving the card and no document listener is required. An already-released pointer (or a
	//synthetic one, as the perf audit sends) can throw; the drag still works from the element's own
	//listeners, so a capture failure is not fatal.
	try { card.setPointerCapture(event.pointerId); } catch (captureError) { /* no active pointer to capture */ }

	honeycomb.combatScene.dragCardId = instanceId;
	honeycomb.combatScene.dragOrigin = { x: event.clientX, y: event.clientY };
	honeycomb.combatScene.dragElement = card;
	//The slot is what moves: it owns position, the card owns state.
	honeycomb.combatScene.dragSlot = card.parentNode;
	honeycomb.combatScene.dragStartTransform = honeycomb.combatScene.dragSlot.style.transform;
	honeycomb.combatScene.dragCommitted = false;
	card.classList.add(honeycomb.tuning.dom.dragActiveClass);
	honeycomb.combatScene.dragSlot.classList.add("hcDragSlot");

	card.addEventListener("pointermove", honeycomb.combatScene.onPointerMove);
	card.addEventListener("pointerup", honeycomb.combatScene.onPointerUp);
	card.addEventListener("pointercancel", honeycomb.combatScene.onPointerUp);
	//A replay can take the held card out of the hand (a discard) or rebuild the hand under it. Either
	//removes the element and its pointer capture with it, and the drag must end rather than dangle.
	card.addEventListener("lostpointercapture", honeycomb.combatScene.onPointerUp);
	honeycomb.platform.sound("cardPickUp");
	event.preventDefault();
};

//THE DRAG MOVE, TIMED. The perf monitor wraps the body so one pointermove's whole cost --
//the forecast dry run, the DOM reads, the focus and the arrow -- is one number in the report.
honeycomb.combatScene.onPointerMove = function (event) {
	if (honeycomb.perf == null || honeycomb.perf.enabled != true) return honeycomb.combatScene.onPointerMoveBody(event);
	var start = honeycomb.perf.now();
	var result = honeycomb.combatScene.onPointerMoveBody(event);
	honeycomb.perf.recordDrag(honeycomb.perf.now() - start);
	return result;
};

honeycomb.combatScene.onPointerMoveBody = function (event) {
	var state = honeycomb.combatScene;
	if (state.dragCardId == null || state.dragElement == null || state.dragSlot == null) return;

	var deltaX = event.clientX - state.dragOrigin.x;
	var deltaY = event.clientY - state.dragOrigin.y;

	//A drag only counts as an intent to play once it clears a threshold, so a click that wobbles is
	//still a click. The threshold is a fraction of card height, from tuning.
	var threshold = state.dragElement.offsetHeight * (honeycomb.tuning.combat.dragPlayThresholdPercent / 100);
	if (state.dragCommitted == false && Math.abs(deltaY) < threshold && Math.abs(deltaX) < threshold) return;

	//THE CARD STAYS, THE RETICLE MOVES. Committing lifts the card straight up out of the fan, upright
	//and enlarged, and leaves it there to be read; from here on the pointer drags a targeting reticle,
	//and the aiming line runs from the card to it. A card chasing the pointer could not be read while
	//it was being aimed, which is exactly when it most needs reading.
	if (state.dragCommitted == false) {
		state.dragCommitted = true;
		//A card read by a tap and then dragged is simply being played the ordinary way now.
		if (state.touchInspectId != null) honeycomb.combatScene.touchInspect(null);
		honeycomb.combatScene.liftHeldCard();
	}
	honeycomb.combatScene.moveReticle(event.clientX, event.clientY);

	//The first moment the card is genuinely held: show where it would move its owner, mark the legal
	//targets, and answer the held forecast before any target is under the pointer.
	if (state.dragHeldShown != true) {
		state.dragHeldShown = true;
		//A queued drag marks who it can land on and nothing else: the replay still owns the fighters'
		//positions and the bars.
		if (state.dragQueued != true) honeycomb.combatScene.showShiftPreview(state.dragCardId);
		honeycomb.combatScene.markLegalTargets(state.dragCardId);
		if (state.dragQueued != true) honeycomb.combatScene.refreshAim(state.dragCardId, null);
	}

	//Back over the hand means "put it back". Said on the card and the reticle before it is let go, so
	//letting go is never a surprise either way.
	var overHand = honeycomb.combatScene.pointIsInCancelZone(event.clientX, event.clientY);
	state.dragOverHand = overHand;
	state.dragSlot.classList.toggle("hcWillCancel", overHand);
	honeycomb.combatScene.setReticleState("hcReticleCancel", overHand);

	//Find a drop target of the kind this card actually wants. A card-targeting card looks at the hand
	//and never at the characters, which is the whole point of the kind dimension: it cannot
	//accidentally land on a party member.
	var hovered = overHand ? null : honeycomb.combatScene.dropTargetAtPoint(state.dragCardId, event.clientX, event.clientY);
	honeycomb.combatScene.setDragTarget(hovered);
	//A card that needs no target plays on release anywhere but the hand, and says so.
	var resolved = honeycomb.combat.resolveById(state.dragCardId);
	var needsPick = honeycomb.combatScene.needsEntityPick(resolved);
	var willPlay = overHand == false && (needsPick == false || hovered != null);
	state.dragSlot.classList.toggle("hcWillPlay", willPlay);
	honeycomb.combatScene.setReticleState("hcReticleLive", willPlay);
	var hoveredEntity = hovered == null ? null : honeycomb.findEntity(hovered, honeycomb.state.run.combat);
	honeycomb.combatScene.setReticleState("hcReticleAlly", hoveredEntity != null && hoveredEntity.side == "ally");
	//Everyone the card is not about steps back, so the board says who this play concerns.
	if (state.dragQueued != true) honeycomb.combatScene.applyDragFocus(state.dragCardId, hovered);
	//Only a card that is looking for a target draws the aiming line. One that needs none plays on
	//release, and a line to wherever the pointer happens to be would promise a target it does not have.
	if (needsPick == true && overHand == false) honeycomb.combatScene.drawTargetArrow(event.clientX, event.clientY);
	else honeycomb.combatScene.clearTargetArrow();
};

//--- The held card and the reticle ----------------------------------------------------------------
//Lifts the held card straight up out of the fan, upright and enlarged, where it stays for the rest of
//the drag. Its keywords pin to its top-right corner, clear of the reticle.
honeycomb.combatScene.liftHeldCard = function () {
	var state = honeycomb.combatScene;
	if (state.dragSlot == null || state.dragElement == null) return;
	var lift = state.dragElement.offsetHeight * (honeycomb.tuning.combat.heldCardLiftPercent / 100);
	state.dragSlot.style.transform = "translateY(" + (-lift).toFixed(1) + "px)";
	state.dragElement.classList.add("hcHeldCard");
	//Pinned once the lift has settled, so it is measured against where the card ends up.
	setTimeout(function () {
		if (state.dragElement == null) return;
		honeycomb.tooltip.showPinned(state.dragElement, "cardNote", state.dragCardId, "topRight");
	}, honeycomb.duration(honeycomb.tuning.animation.elementTravelMs));
};

honeycomb.combatScene.reticleElement = function () {
	var existing = document.getElementById("honeycombReticle");
	if (existing != null) return existing;
	var root = honeycomb.rootElement();
	if (root == null) return null;
	var element = document.createElement("div");
	element.id = "honeycombReticle";
	element.className = "hcReticle";
	element.hidden = true;
	root.appendChild(element);
	return element;
};

honeycomb.combatScene.moveReticle = function (clientX, clientY) {
	var element = honeycomb.combatScene.reticleElement();
	if (element == null) return;
	element.hidden = false;
	//A composited translate, not left/top: this runs on every pointermove of a drag. The
	//stylesheet reads these through the `translate` property; see .hcReticle for why never `transform`.
	element.style.setProperty("--hcReticleX", Math.round(clientX) + "px");
	element.style.setProperty("--hcReticleY", Math.round(clientY) + "px");
};

honeycomb.combatScene.setReticleState = function (className, on) {
	var element = document.getElementById("honeycombReticle");
	if (element != null) element.classList.toggle(className, on == true);
};

honeycomb.combatScene.hideReticle = function () {
	var element = document.getElementById("honeycombReticle");
	if (element == null) return;
	element.hidden = true;
	element.classList.remove("hcReticleCancel", "hcReticleLive", "hcReticleAlly");
};

//True while a point is over the hand bar, grown upward by the tuned margin. See cancelZoneExtraPercent.
honeycomb.combatScene.pointIsInCancelZone = function (clientX, clientY) {
	var root = honeycomb.rootElement();
	var handBar = root == null ? null : root.getElementsByClassName("hcHandBar")[0];
	if (handBar == null) return false;
	var box = handBar.getBoundingClientRect();
	var card = honeycomb.combatScene.dragElement;
	var extra = card == null ? 0 : card.offsetHeight * (honeycomb.tuning.combat.cancelZoneExtraPercent / 100);
	return clientY >= box.top - extra && clientX >= box.left && clientX <= box.right;
};

honeycomb.combatScene.onPointerUp = function (event) {
	var state = honeycomb.combatScene;
	var card = state.dragElement;
	if (card == null) return;

	card.removeEventListener("pointermove", honeycomb.combatScene.onPointerMove);
	card.removeEventListener("pointerup", honeycomb.combatScene.onPointerUp);
	card.removeEventListener("pointercancel", honeycomb.combatScene.onPointerUp);
	card.removeEventListener("lostpointercapture", honeycomb.combatScene.onPointerUp);
	if (card.hasPointerCapture && card.hasPointerCapture(event.pointerId)) {
		card.releasePointerCapture(event.pointerId);
	}
	card.classList.remove(honeycomb.tuning.dom.dragActiveClass);
	honeycomb.tooltip.suppress(false);

	var instanceId = state.dragCardId;
	var committed = state.dragCommitted;
	var targetId = state.dragTargetId;
	var slot = state.dragSlot;
	var overHand = state.dragOverHand == true;
	var queued = state.dragQueued == true;
	//The card was taken out from under the pointer by the replay: the drag simply ends.
	var lost = event.type == "lostpointercapture" && card.isConnected == false;

	honeycomb.combatScene.clearTargetArrow();
	honeycomb.combatScene.hideReticle();
	honeycomb.tooltip.hide();
	//The card is no longer being read. A committed drag leaves the bars alone -- the held reading stays up
	//until its play resolves or is refused -- while a click puts them back at rest now.
	if (state.lustInspectRequest != null && state.lustInspectRequest.origin == "hand") {
		state.lustInspectRequest = null;
		state.applyLustInspection(committed != true);
	}
	//The target is dropped WITHOUT a forecast refresh: the held reading stays up until the play is
	//resolved or refused, so the bars do not flicker back to rest for one frame on release.
	state.dragTargetId = null;
	honeycomb.combatScene.clearTargetMarks();
	//A queued drag never set a focus, and clearing one now would wipe whatever the replay has focused.
	if (queued == false) honeycomb.combatScene.clearDragFocus();
	var handElement = document.getElementById("honeycombHand");
	if (handElement != null) handElement.classList.remove("hcDragging");
	if (slot != null) slot.classList.remove("hcDragSlot", "hcWillCancel", "hcWillPlay");
	state.dragCardId = null;
	state.dragElement = null;
	state.dragSlot = null;
	state.dragCommitted = false;
	state.dragHeldShown = false;
	state.dragOverHand = false;
	state.dragQueued = false;

	if (lost == false) honeycomb.combatScene.releaseHeldCard(instanceId, committed, targetId, slot, overHand, queued);
	//A replay that finished while the card was held left its closing repaint for now. See afterBeat.
	honeycomb.combatScene.flushDeferredAfterBeat();
};

//What letting go of a card means, once the drag itself is cleaned up.
honeycomb.combatScene.releaseHeldCard = function (instanceId, committed, targetId, slot, overHand, queued) {
	var state = honeycomb.combatScene;
	if (committed == false) {
		//Treated as a click: snap back and, for a card that needs no target, play it outright.
		if (slot != null) slot.style.transform = state.dragStartTransform;
		if (queued == false) {
			honeycomb.combatScene.clearShiftPreview();
			honeycomb.combatScene.refreshAim(null, null);
		}
		//A TAP reads the card first; see touchInspect. The second tap plays it.
		if (honeycomb.input.isTouch() && state.touchInspectId != instanceId) {
			honeycomb.combatScene.touchInspect(instanceId);
			var inspected = honeycomb.combat.resolveById(instanceId);
			honeycomb.combatScene.flashMessage(honeycomb.combatScene.needsEntityPick(inspected)
				? honeycomb.combatScene.touchHintArray.target : honeycomb.combatScene.touchHintArray.play);
			return;
		}
		honeycomb.combatScene.touchInspect(null);
		honeycomb.combatScene.onCardClick(instanceId);
		return;
	}

	//Let go over the hand: the card goes back where it came from and nothing happens. Held and then
	//released with nothing under it, a card that needs a target does the same -- silently, since
	//putting a card back is not a mistake worth a message.
	var resolved = honeycomb.combat.resolveById(instanceId);
	var needsPick = honeycomb.combatScene.needsEntityPick(resolved);
	if (overHand == true || (needsPick == true && targetId == null)) {
		honeycomb.combatScene.cancelHeldCard(slot, queued);
		return;
	}

	if (queued == true && slot != null) slot.style.transform = state.dragStartTransform;
	honeycomb.combatScene.requestPlay(instanceId, targetId);
};

//True for a card that must be DROPPED on a fighter. A card that picks CARDS plays on release like an
//untargeted one, and asks for its cards afterwards in the slot window.
honeycomb.combatScene.needsEntityPick = function (resolved) {
	return resolved != null && honeycomb.targetModeRequiresPick(resolved.targetMode) == true &&
		honeycomb.targetModeKind(resolved.targetMode) == "entity";
};

//--- Choosing cards from the hand -------------------------------------------------------------------
//THE HAND AS A PICKER. While the slot window is open the hand comes back up into full focus, the cards
//the question allows are marked, and each can be tapped -- or dragged into the window -- to fill a slot.
//The window itself lives in honeycomb-choices.js; this is the half that belongs to the hand.
honeycomb.combatScene.selecting = false;

honeycomb.combatScene.beginHandSelection = function () {
	//The hand is redrawn first, so the card that asked drops back into the fan rather than hanging
	//lifted over it while the question is open.
	honeycomb.combatScene.repaint();
	honeycomb.combatScene.selecting = true;
	honeycomb.combatScene.hideReticle();
	var hand = document.getElementById("honeycombHand");
	if (hand != null) hand.classList.add("hcSelecting");
	honeycomb.combatScene.markHandSelection();
};

honeycomb.combatScene.markHandSelection = function () {
	var hand = document.getElementById("honeycombHand");
	if (hand == null) return;
	var cardArray = hand.getElementsByClassName("hcHandCard");
	for (var cardIndex = 0; cardIndex < cardArray.length; cardIndex++) {
		var card = cardArray[cardIndex];
		var id = card.dataset.hccardid;
		var eligible = honeycomb.choiceOverlay.isEligible(id);
		card.classList.toggle("hcSelectable", eligible);
		card.classList.toggle("hcSelectDisabled", eligible == false);
		card.classList.toggle("hcSelectChosen", honeycomb.choiceOverlay.selectedArray.indexOf(id) >= 0);
	}
};

honeycomb.combatScene.endHandSelection = function () {
	honeycomb.combatScene.selecting = false;
	var hand = document.getElementById("honeycombHand");
	if (hand == null) return;
	hand.classList.remove("hcSelecting");
	var cardArray = hand.getElementsByClassName("hcHandCard");
	for (var cardIndex = 0; cardIndex < cardArray.length; cardIndex++) {
		cardArray[cardIndex].classList.remove("hcSelectable", "hcSelectDisabled", "hcSelectChosen");
	}
};

//A press on a hand card while choosing. A tap fills (or empties) a slot; a drag carries a ghost of the
//card and fills a slot if it is let go over the window. Pointer capture, no document listeners.
honeycomb.combatScene.onSelectionPointerDown = function (event) {
	var card = event.currentTarget;
	var id = card.dataset.hccardid;
	if (id == null || honeycomb.choiceOverlay.isEligible(id) == false) return;
	card.setPointerCapture(event.pointerId);
	honeycomb.combatScene.selectionDrag = { card: card, id: id, startX: event.clientX, startY: event.clientY, ghost: null };
	card.addEventListener("pointermove", honeycomb.combatScene.onSelectionPointerMove);
	card.addEventListener("pointerup", honeycomb.combatScene.onSelectionPointerUp);
	card.addEventListener("pointercancel", honeycomb.combatScene.onSelectionPointerUp);
	event.preventDefault();
};

honeycomb.combatScene.onSelectionPointerMove = function (event) {
	var drag = honeycomb.combatScene.selectionDrag;
	if (drag == null) return;
	var distance = Math.max(Math.abs(event.clientX - drag.startX), Math.abs(event.clientY - drag.startY));
	if (drag.ghost == null) {
		if (distance < honeycomb.tuning.ui.teamDragThresholdPixels) return;
		//On the overlay host, so it passes OVER the slot window it is being carried to.
		var root = honeycomb.overlayHostElement();
		var resolved = honeycomb.combat.resolveById(drag.id);
		if (root == null || resolved == null) return;
		drag.ghost = document.createElement("div");
		drag.ghost.className = "hcSelectionGhost";
		drag.ghost.innerHTML = honeycomb.ui.card(resolved, { size: "large", instanceId: drag.id, showTooltip: false });
		root.appendChild(drag.ghost);
	}
	drag.ghost.style.left = Math.round(event.clientX) + "px";
	drag.ghost.style.top = Math.round(event.clientY) + "px";
	var slotWindow = document.getElementById("honeycombSlotWindow");
	if (slotWindow != null) slotWindow.classList.toggle("hcDropReady", honeycomb.combatScene.pointIsOver(slotWindow, event.clientX, event.clientY));
};

honeycomb.combatScene.onSelectionPointerUp = function (event) {
	var drag = honeycomb.combatScene.selectionDrag;
	if (drag == null) return;
	var card = drag.card;
	card.removeEventListener("pointermove", honeycomb.combatScene.onSelectionPointerMove);
	card.removeEventListener("pointerup", honeycomb.combatScene.onSelectionPointerUp);
	card.removeEventListener("pointercancel", honeycomb.combatScene.onSelectionPointerUp);
	if (card.hasPointerCapture != null && card.hasPointerCapture(event.pointerId)) card.releasePointerCapture(event.pointerId);
	var dragged = drag.ghost != null;
	if (drag.ghost != null && drag.ghost.parentNode != null) drag.ghost.parentNode.removeChild(drag.ghost);
	honeycomb.combatScene.selectionDrag = null;

	var slotWindow = document.getElementById("honeycombSlotWindow");
	if (slotWindow != null) slotWindow.classList.remove("hcDropReady");
	var alreadyChosen = honeycomb.choiceOverlay.selectedArray.indexOf(drag.id) >= 0;
	//A tap toggles. A drag only ever ADDS, and only when it ends over the window.
	if (dragged == false) honeycomb.choiceOverlay.pick(drag.id);
	else if (slotWindow != null && honeycomb.combatScene.pointIsOver(slotWindow, event.clientX, event.clientY) && alreadyChosen == false) {
		honeycomb.choiceOverlay.pick(drag.id);
	}
};

honeycomb.combatScene.pointIsOver = function (element, clientX, clientY) {
	var box = element.getBoundingClientRect();
	return clientX >= box.left && clientX <= box.right && clientY >= box.top && clientY <= box.bottom;
};

//Puts a held card back: the slot returns to its place in the fan, the previewed move is undone, and
//the bars go back to the resting forecast.
//`queued` is a drag begun during a replay, which showed no previews and so has none to take down.
honeycomb.combatScene.cancelHeldCard = function (slot, queued) {
	if (slot != null) {
		slot.style.transform = honeycomb.combatScene.dragStartTransform;
		var card = slot.getElementsByClassName("hcHandCard")[0];
		if (card != null) card.classList.remove(honeycomb.tuning.dom.dragActiveClass, "hcHeldCard");
	}
	if (queued != true) {
		honeycomb.combatScene.clearShiftPreview();
		honeycomb.combatScene.refreshAim(null, null);
	}
	honeycomb.platform.sound("uiBack");
};

//The legal drop target under a point for the card being dragged, or null. Dispatches on the card's
//target KIND, so entity targets look at the battlefield and card targets look at the hand.
honeycomb.combatScene.dropTargetAtPoint = function (cardInstanceId, clientX, clientY) {
	var resolved = honeycomb.combat.resolveById(cardInstanceId);
	if (resolved == null) return null;

	var entityId = honeycomb.combatScene.fighterAtPoint(clientX, clientY);
	if (entityId == null) return null;
	var entity = honeycomb.findEntity(entityId, honeycomb.state.run.combat);
	//KIND, DOWNED, excludeSelf AND SIDE come from the ONE predicate every targeting path asks, so a
	//dropped card and an aimed ability cannot disagree about who is pickable. It covers: a card
	//that picks cards is never dropped on one; Severine's Transfusion cannot be dropped on Severine
	//even though she is on the right side; and an ally-only card dropped
	//on an enemy is rejected visibly rather than swallowed.
	if (honeycomb.targetModeAllows(resolved.targetMode,
		honeycomb.combatScene.actorIdFor(cardInstanceId),
		honeycomb.combatScene.actorSide(resolved), entity) == false) return null;
	//AND THE CARD'S OWN TARGET RULE, which is the one question a card asks that an aimed
	//ability does not: an ally-move card refuses somebody already standing where it would send them.
	return honeycomb.combatScene.targetIsAccepted(resolved, entity) ? entityId : null;
};

//Whether a card's own `targetCondition` accepts this entity. Cards with none accept everybody. The
//condition reads the engine's real previews (see `wouldShift`), so targeting cannot disagree with what
//the play would do.
honeycomb.combatScene.targetIsAccepted = function (resolved, entity) {
	if (resolved == null || resolved.targetCondition == null || entity == null) return true;
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var context = honeycomb.newEffectContext({ combat: combat, card: resolved, source: honeycomb.cardActingEntity(resolved, combat) });
	context.target = entity;
	return honeycomb.testCondition(resolved.targetCondition, context) == true;
};

//Which OTHER hand card is under a point. The dragged card never offers itself.
honeycomb.combatScene.handCardAtPoint = function (clientX, clientY, excludeInstanceId) {
	var hand = document.getElementById("honeycombHand");
	if (hand == null) return null;
	var cardArray = hand.getElementsByClassName("hcHandCard");
	//Walked backwards so the card drawn on top wins, matching what the player sees.
	for (var cardIndex = cardArray.length - 1; cardIndex >= 0; cardIndex--) {
		var element = cardArray[cardIndex];
		var instanceId = element.dataset.hccardid;
		if (instanceId == null || instanceId === "" || instanceId == excludeInstanceId) continue;
		var box = element.getBoundingClientRect();
		if (clientX < box.left || clientX > box.right) continue;
		if (clientY < box.top || clientY > box.bottom) continue;
		return instanceId;
	}
	return null;
};

//Which fighter, if any, is under a screen point. Uses the DOM rather than stored rectangles so it
//stays correct through any layout change.
//
//It must agree with what the player sees: a boss layout can otherwise make it impossible to target
//things standing behind her. This was why: the walk returned the FIRST fighter in DOM order whose box
//contained the
//point. An anchored boss is drawn behind the row but her box is enormous -- 46% of the side, its full
//height -- and she comes first in the line-up, so she swallowed every point over every minion standing
//in front of her. Neither z-index nor pointer-events could help: this walk never consulted either.
//
//So candidates are gathered and SCORED, highest wins, later DOM element breaking a tie because that is
//what paints on top at the same z-index (and so what the crowded-side overlap shows):
//  3  the point is on something DRAWN -- this fighter's own art or their plate
//  2  the same, for one anchored behind the row
//  1  the point is only inside their empty column
//  0  the same, for one anchored behind the row
//
//Pointing at a body or a plate therefore always beats another fighter's empty column, which is what
//makes a boss standing behind a guard reachable at all: her column is enormous and every minion's
//column crosses it, but the pixels she is drawn on are hers.
honeycomb.combatScene.fighterHitScore = function (fighter, clientX, clientY) {
	function inside(element) {
		if (element == null) return false;
		var box = element.getBoundingClientRect();
		if (box.width <= 0 || box.height <= 0) return false;
		return clientX >= box.left && clientX <= box.right && clientY >= box.top && clientY <= box.bottom;
	}
	if (inside(fighter) == false) return -1;
	var anchored = fighter.classList.contains("hcAnchored");
	//Drawn content: the sprite's own wrap (the art is contained inside it) and the plate over it.
	var drawn = inside(fighter.getElementsByClassName("hcFighterArtWrap")[0]) ||
		inside(fighter.getElementsByClassName("hcNameplate")[0]);
	if (drawn == true) return anchored ? 2 : 3;
	return anchored ? 0 : 1;
};

honeycomb.combatScene.fighterAtPoint = function (clientX, clientY) {
	var battlefield = document.getElementById("honeycombBattlefield");
	if (battlefield == null) return null;
	var fighterArray = battlefield.getElementsByClassName("hcFighter");
	var best = null;
	var bestScore = -1;
	for (var fighterIndex = 0; fighterIndex < fighterArray.length; fighterIndex++) {
		var fighter = fighterArray[fighterIndex];
		if (fighter.classList.contains("hcDowned")) continue;
		var score = honeycomb.combatScene.fighterHitScore(fighter, clientX, clientY);
		//">=" so a later element wins a tie: it is the one painted on top.
		if (score < 0 || score < bestScore) continue;
		best = fighter.dataset.hcentityid;
		bestScore = score;
	}
	return best;
};

honeycomb.combatScene.setDragTarget = function (targetId) {
	if (honeycomb.combatScene.dragTargetId == targetId) return;
	honeycomb.combatScene.dragTargetId = targetId;

	//The bars say what this play would do to whoever it is now pointing at. Done HERE rather than on
	//every pointer move because a forecast is answered against a target, and re-answering the same
	//question sixty times a second is the one way to make a free thing expensive.
	//
	//A forecast REPLACES honeycomb.state, so nothing read before this line may be used after it.
	if (honeycomb.combatScene.dragQueued != true) honeycomb.combatScene.refreshAim(honeycomb.combatScene.dragCardId, targetId);
	//The held card's numbers, re-read against the new target.
	honeycomb.combatScene.refreshHeldCardText(honeycomb.combatScene.dragCardId, targetId);

	//A target id may name a fighter or a card, so both are swept. One id can never match both:
	//entities and cards draw their identifiers from different prefixes.
	var battlefield = document.getElementById("honeycombBattlefield");
	if (battlefield != null) {
		var fighterArray = battlefield.getElementsByClassName("hcFighter");
		for (var fighterIndex = 0; fighterIndex < fighterArray.length; fighterIndex++) {
			var fighter = fighterArray[fighterIndex];
			if (fighter.dataset.hcentityid == targetId) fighter.classList.add("hcTargeted");
			else fighter.classList.remove("hcTargeted");
		}
	}

	var hand = document.getElementById("honeycombHand");
	if (hand != null) {
		var handArray = hand.getElementsByClassName("hcHandCard");
		for (var handIndex = 0; handIndex < handArray.length; handIndex++) {
			var element = handArray[handIndex];
			if (element.dataset.hccardid == targetId) element.classList.add("hcTargeted");
			else element.classList.remove("hcTargeted");
		}
	}
};

//--- Focus --------------------------------------------------------------------------------------------
//THREE LEVELS, everywhere on the battlefield: FOCUSED (as drawn), HALF (a little darker), NONE (darker,
//desaturated, settled back). See tuning.focus. Written as classes so the look lives in the stylesheet.
//FOCUSED has a class of its own, set only while something is actually being focused: at rest nobody
//carries one. Layouts that draw focus as distance (flag depthFocus) bring that fighter forward; the
//others draw it as drawn.
honeycomb.combatScene.focusClassArray = [
	{ index: "full", className: "hcFocusFull" },
	{ index: "half", className: "hcFocusHalf" },
	{ index: "none", className: "hcFocusNone" },
];

//Applies a level to every fighter. `levelFor(entityId, side)` answers each one; null clears them all.
honeycomb.combatScene.setFocus = function (levelFor) {
	var battlefield = document.getElementById("honeycombBattlefield");
	if (battlefield == null) return;
	var fighterArray = battlefield.getElementsByClassName("hcFighter");
	for (var scanIndex = 0; scanIndex < fighterArray.length; scanIndex++) {
		var fighter = fighterArray[scanIndex];
		var level = levelFor == null ? null : levelFor(fighter.dataset.hcentityid, fighter.dataset.hcside);
		for (var classIndex = 0; classIndex < honeycomb.combatScene.focusClassArray.length; classIndex++) {
			var entry = honeycomb.combatScene.focusClassArray[classIndex];
			fighter.classList.toggle(entry.className, entry.index == level);
		}
	}
};

//The team of whoever a card acts as -- the side its targets are relative to. The party's, for any card
//with nobody to act for it.
honeycomb.combatScene.actorSide = function (resolved) {
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var actor = resolved == null || combat == null ? null : honeycomb.cardActingEntity(resolved, combat);
	return actor == null || actor.side == null ? "ally" : actor.side;
};

//Whoever a card ACTS as: its owner, or for an ownerless card the fallback that will act for it.
honeycomb.combatScene.actorIdFor = function (cardInstanceId) {
	var resolved = honeycomb.combat.resolveById(cardInstanceId);
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var actor = resolved == null || combat == null ? null : honeycomb.cardActingEntity(resolved, combat);
	return actor == null ? null : actor.instanceId;
};

//HOVERING a card: its owner in focus, everyone else half. Ignored mid-drag, which has its own rules,
//and while a tapped card is being read, which holds the focus until it is dismissed.
honeycomb.combatScene.onHandHover = function (cardInstanceId) {
	if (honeycomb.combatScene.dragCardId != null || honeycomb.combatScene.busy == true) return;
	if (honeycomb.combatScene.touchInspectId != null) return;
	if (cardInstanceId == null) {
		honeycomb.combatScene.clearLustInspection("hand");
		honeycomb.combatScene.setFocus(null);
		return;
	}
	honeycomb.combatScene.inspectLust({ cardInstanceId: cardInstanceId, origin: "hand" });
	honeycomb.combatScene.focusCardReader(cardInstanceId);
};

//The focus while a card is READ: its owner in full, everyone else half -- except the fighters a Lewd card
//would reach, who stay in full so their panels can be read.
honeycomb.combatScene.focusCardReader = function (cardInstanceId) {
	var actorId = honeycomb.combatScene.actorIdFor(cardInstanceId);
	var inspecting = honeycomb.forecast == null ? null : honeycomb.forecast.inspecting;
	honeycomb.combatScene.setFocus(function (entityId) {
		if (entityId == actorId) return "full";
		return inspecting != null && inspecting.byEntity[entityId] != null ? "full" : "half";
	});
};

//--- Reading a Lewd card ----------------------------------------------------------------------------
//Shows each of the opposing party's weakness(es) to the tags on that card, by pausing the forecast
//happening passively at rest and running a forecast for just that card.
//
//What is being read, as a honeycomb.forecast.forLustInspection request plus `origin` ("hand" or "intent"),
//so that letting go of one never clears the other. Kept as the QUESTION rather than the answer: a repaint
//throws every forecast away, and asks this again against the board it is about to draw.
honeycomb.combatScene.lustInspectRequest = null;

honeycomb.combatScene.inspectLust = function (request) {
	honeycomb.combatScene.lustInspectRequest = request;
	honeycomb.combatScene.applyLustInspection(true);
};

honeycomb.combatScene.clearLustInspection = function (origin) {
	var state = honeycomb.combatScene;
	if (state.lustInspectRequest == null) return;
	if (origin != null && state.lustInspectRequest.origin != origin) return;
	state.lustInspectRequest = null;
	state.applyLustInspection(true);
};

//Answers the standing request and draws it: the bars through forecast.markFor, the panels over the
//fighters here. `redrawBars` false leaves the bars to a caller about to draw them anyway. Nothing is shown
//while a replay owns the board.
honeycomb.combatScene.applyLustInspection = function (redrawBars) {
	var state = honeycomb.combatScene;
	if (honeycomb.forecast == null) return;
	var request = state.lustInspectRequest;
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var reading = null;
	var readable = request != null && state.busy != true && combat != null &&
		(request.cardInstanceId == null || combat.handArray.indexOf(request.cardInstanceId) >= 0);
	//A forecast REPLACES honeycomb.state; nothing below holds anything read before it.
	if (readable) reading = honeycomb.forecast.forLustInspection(request);
	var changed = honeycomb.forecast.inspecting !== reading;
	honeycomb.forecast.inspecting = reading;
	state.renderLustPeeks();
	if (changed && redrawBars != false) state.refreshAllVitals();
};

//THE PANEL OVER EACH FIGHTER the card would reach: the lust it would deal them, and for a character their
//weakness to each of its tags -- the rail, the rank and its multiplier, and the stretch this hit would add.
//Hung INSIDE the nameplate and stood on top of it by the stylesheet, so it follows the plate wherever a
//layout or an anchored boss puts it with nothing measured. updateVitals replaces only the plate's `.hcVitals`
//block, so a bar redraw leaves the panel standing. (Scene mode's frame does not clip; the developer-only
//framed layouts do, and cut the panel off.)
honeycomb.combatScene.renderLustPeeks = function () {
	var battlefield = document.getElementById("honeycombBattlefield");
	if (battlefield == null) return;
	var oldArray = battlefield.querySelectorAll(".hcLustPeek");
	for (var oldIndex = 0; oldIndex < oldArray.length; oldIndex++) oldArray[oldIndex].remove();
	var peekingArray = battlefield.querySelectorAll(".hcLustPeeking");
	for (var peekingIndex = 0; peekingIndex < peekingArray.length; peekingIndex++) peekingArray[peekingIndex].classList.remove("hcLustPeeking");

	var inspecting = honeycomb.forecast == null ? null : honeycomb.forecast.inspecting;
	if (inspecting == null) return;
	for (var peekIndex = 0; peekIndex < inspecting.peekArray.length; peekIndex++) {
		var peek = inspecting.peekArray[peekIndex];
		var fighter = honeycomb.combatScene.fighterElement(peek.entityId);
		var plate = fighter == null ? null : fighter.querySelector(".hcNameplate");
		if (plate == null) continue;
		var element = document.createElement("div");
		element.className = "hcLustPeek" + (peek.chance ? " hcLustPeekChance" : "") + (peek.breaks ? " hcLustPeekBreaks" : "");
		element.innerHTML = honeycomb.combatScene.lustPeekMarkup(peek);
		plate.appendChild(element);
		fighter.classList.add("hcLustPeeking");
	}
};

honeycomb.combatScene.lustPeekMarkup = function (peek) {
	var nameplate = honeycomb.tuning.art.nameplate;
	var markup = '<div class="hcLustPeekHead">';
	markup += '<span class="hcLustPeekAmount">' +
		honeycomb.ui.iconTag(nameplate.lustIconPath, "heart", "#ff78c8", { className: "hcLustPeekIcon" }) +
		"+" + peek.lust + "</span>";
	if (honeycomb.tuning.forecast.lustInspectionShowsDamage == true && peek.damage > 0) {
		markup += '<span class="hcLustPeekDamage">&minus;' + peek.damage + "</span>";
	}
	if (peek.breaks) markup += '<span class="hcLustPeekNote hcLustPeekBreakNote">Breaks</span>';
	else if (peek.chance) markup += '<span class="hcLustPeekNote">might</span>';
	markup += "</div>";

	for (var rowIndex = 0; rowIndex < peek.rowArray.length; rowIndex++) {
		var row = peek.rowArray[rowIndex];
		var cardTag = honeycomb.findDefinition(honeycomb.cardTagArray, row.tag);
		var tagName = cardTag == null ? honeycomb.tagName(row.tag) : cardTag.name;
		var color = cardTag == null ? honeycomb.tagColor(row.tag) : cardTag.color;
		markup += '<div class="hcLustPeekRow" style="--hcWeaknessColor:' + color + '">';
		markup += '<div class="hcLustPeekRowHead"><span class="hcWeaknessName">' + honeycomb.escapeText(tagName) + "</span>";
		markup += '<span class="hcWeaknessRank">' + (row.rank === 0 ? '<span class="hcMuted">No rank</span>'
			: honeycomb.escapeText(row.rankName)) + ' <span class="hcDim">×' + honeycomb.ui.trimNumber(row.multiplier) + "</span></span></div>";
		markup += honeycomb.ui.weaknessRail(row, { tooltips: false, className: "hcLustPeekRail" });
		if (row.ranksUp) markup += '<div class="hcLustPeekRankUp">Rank up!</div>';
		else if (row.held) markup += '<div class="hcLustPeekHeld">Held until this run ends</div>';
		markup += "</div>";
	}
	return markup;
};

//Touch: reading a card before playing it. A touchscreen has no hover, and in the
//hand hover is how a card is READ -- lifted, enlarged, its owner in focus, its keywords explained. So
//on touch the first tap on a card does all of that and the card STAYS up; a second tap plays it, and a
//card that needs a target is played by tapping a legal one (easier on a small screen than dragging).
//Dragging still works exactly as with a mouse. `instanceId` null puts the hand back down.
honeycomb.combatScene.touchInspectId = null;

honeycomb.combatScene.touchHintArray = {
	play: "Tap again to play.",
	target: "Tap a target, or drag it there.",
};

honeycomb.combatScene.touchInspect = function (instanceId) {
	var state = honeycomb.combatScene;
	state.touchInspectId = instanceId;
	var hand = document.getElementById("honeycombHand");
	var inspectedCard = null;
	if (hand != null) {
		hand.classList.toggle("hcTouchReading", instanceId != null);
		var slotArray = hand.getElementsByClassName("hcHandSlot");
		for (var slotIndex = 0; slotIndex < slotArray.length; slotIndex++) {
			var isInspected = instanceId != null && slotArray[slotIndex].dataset.hcslotfor == instanceId;
			slotArray[slotIndex].classList.toggle("hcTouchInspect", isInspected);
			if (isInspected) inspectedCard = slotArray[slotIndex].getElementsByClassName("hcHandCard")[0];
		}
	}
	honeycomb.combatScene.clearTargetMarks();
	if (instanceId == null) {
		honeycomb.combatScene.clearLustInspection("hand");
		honeycomb.combatScene.setFocus(null);
		honeycomb.tooltip.hide();
		return;
	}
	honeycomb.combatScene.inspectLust({ cardInstanceId: instanceId, origin: "hand" });
	honeycomb.combatScene.focusCardReader(instanceId);
	honeycomb.combatScene.markLegalTargets(instanceId);
	//Pinned once the lift has settled, beside where the card ends up -- as a held card's note is.
	setTimeout(function () {
		if (state.touchInspectId != instanceId || inspectedCard == null || inspectedCard.isConnected == false) return;
		honeycomb.tooltip.showPinned(inspectedCard, "cardNote", instanceId, "topRight");
	}, honeycomb.duration(honeycomb.tuning.animation.elementTravelMs));
};

//A tap on the battlefield anywhere but a fighter puts a card being read back down.
honeycomb.combatScene.onFieldClick = function (event) {
	var target = event == null ? null : event.target;
	var onFighter = target != null && target.closest != null && target.closest(".hcFighter") != null;
	//CLICKING THE BOARD PUTS AN AIM AWAY, the way dropping a card on nothing puts the card back. Before
	//this the only way out of aiming was to tap an illegal fighter and be told off for it -- and on a
	//touchscreen that cost two taps, so a player who changed their mind had no obvious out at all.
	if (honeycomb.combatScene.pendingAim != null && onFighter == false) {
		honeycomb.combatScene.cancelAim(true);
		return;
	}
	if (honeycomb.combatScene.touchInspectId == null) return;
	if (onFighter == true) return;
	honeycomb.combatScene.touchInspect(null);
};

//The swipe hint is shown once per profile, on a phone, while the board is at rest; swiping
//it aside or tapping it reads it and remembers. The swipe threshold is real pixels, because it measures
//a finger's travel.
honeycomb.combatScene.swipeHintVisible = function () {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	return profile != null && profile.swipeHintSeen != true;
};

honeycomb.combatScene.dismissSwipeHint = function () {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile != null) profile.swipeHintSeen = true;
	var element = document.getElementById("honeycombSwipeHint");
	if (element != null) element.remove();
	if (honeycomb.save != null) honeycomb.save.autosave("swipeHint");
};

honeycomb.combatScene.noteSwipeHintStart = function (event) {
	honeycomb.combatScene.swipeHintStartX = event == null ? null : event.clientX;
};

honeycomb.combatScene.noteSwipeHintMove = function (event) {
	var startX = honeycomb.combatScene.swipeHintStartX;
	if (startX == null || event == null) return;
	if (Math.abs(event.clientX - startX) < honeycomb.tuning.layout.swipeHintDismissPixels) return;
	honeycomb.combatScene.swipeHintStartX = null;
	honeycomb.combatScene.dismissSwipeHint();
};

//HOLDING a card: the one acting and the thing it is aimed at in focus; legal targets still waiting to
//be chosen half; everyone the play does not concern non-focused. A card that lands on a whole side
//concerns that whole side.
honeycomb.combatScene.applyDragFocus = function (cardInstanceId, targetId) {
	var resolved = honeycomb.combat.resolveById(cardInstanceId);
	var actorId = honeycomb.combatScene.actorIdFor(cardInstanceId);
	var definition = resolved == null ? null : honeycomb.targetModeDefinition(resolved.targetMode);
	var actorSide = honeycomb.combatScene.actorSide(resolved);
	var wholeSide = resolved == null ? null : honeycomb.targetModeWholeSide(resolved.targetMode, actorSide);
	var needsPick = definition != null && definition.requiresPick == true && honeycomb.targetModeKind(resolved.targetMode) == "entity";
	var pickSide = needsPick ? honeycomb.targetModeSide(resolved.targetMode, actorSide) : null;

	honeycomb.combatScene.setFocus(function (entityId, side) {
		if (entityId == actorId || entityId == targetId) return "full";
		if (wholeSide == "both" || wholeSide == side) return "full";
		if (needsPick && targetId == null && (pickSide == null || pickSide == side)) return "half";
		return "none";
	});
};

honeycomb.combatScene.clearDragFocus = function () {
	honeycomb.combatScene.setFocus(null);
};

//While a card that needs a target is held, the fighters it may land on say so -- and nobody else
//does. This is what keeps an ally-targeting card from landing on anyone by accident: a card for an
//ally lights allies, never enemies, and the reverse.
honeycomb.combatScene.markLegalTargets = function (cardInstanceId) {
	var battlefield = document.getElementById("honeycombBattlefield");
	var resolved = honeycomb.combat.resolveById(cardInstanceId);
	if (battlefield == null || resolved == null) return;
	var needsPick = honeycomb.targetModeRequiresPick(resolved.targetMode);
	//The same predicate the drop test and the aim mode use, so what LOOKS legal and what IS accepted
	//cannot drift apart -- which is exactly how the ability path ended up offering Cinder her own
	//excludeSelf ability.
	var actorId = honeycomb.combatScene.actorIdFor(cardInstanceId);
	var actorSide = honeycomb.combatScene.actorSide(resolved);
	var fighterArray = battlefield.getElementsByClassName("hcFighter");
	for (var scanIndex = 0; scanIndex < fighterArray.length; scanIndex++) {
		var fighter = fighterArray[scanIndex];
		var fighterEntity = honeycomb.findEntity(fighter.dataset.hcentityid, honeycomb.state.run.combat);
		var legal = needsPick &&
			honeycomb.targetModeAllows(resolved.targetMode, actorId, actorSide, fighterEntity) &&
			honeycomb.combatScene.targetIsAccepted(resolved, fighterEntity);
		fighter.classList.toggle("hcLegalTarget", legal);
		fighter.classList.toggle("hcLegalAlly", legal && fighter.dataset.hcside == "ally");
	}
};

honeycomb.combatScene.clearTargetMarks = function () {
	var battlefield = document.getElementById("honeycombBattlefield");
	if (battlefield == null) return;
	var fighterArray = battlefield.getElementsByClassName("hcFighter");
	for (var scanIndex = 0; scanIndex < fighterArray.length; scanIndex++) {
		fighterArray[scanIndex].classList.remove("hcLegalTarget", "hcLegalAlly", "hcTargeted");
	}
	var hand = document.getElementById("honeycombHand");
	if (hand == null) return;
	var cardArray = hand.getElementsByClassName("hcHandCard");
	for (var cardIndex = 0; cardIndex < cardArray.length; cardIndex++) cardArray[cardIndex].classList.remove("hcTargeted");
};

//--- Party movement --------------------------------------------------------------------------------
//THE PREVIEW. While a card is held, whoever it would move slides to where they would end up, and
//everyone they would pass slides the other way, with an arrow on the one moving. Nothing is committed:
//it is the same answer the engine will use (honeycomb.previewShift), drawn early.
//
//Movement is written to the CSS `translate` property rather than `transform`, which the focus and
//targeting states already use -- two systems writing one property is the bug the slot/card split
//fixed in the hand, and it is not repeated here.
honeycomb.combatScene.showShiftPreview = function (cardInstanceId) {
	honeycomb.combatScene.clearShiftPreview();
	if (honeycomb.tuning.combat.partyShiftEnabled != true) return;
	var combat = honeycomb.state.run.combat;
	var resolved = honeycomb.combat.resolveById(cardInstanceId);
	var actor = resolved == null ? null : honeycomb.cardActingEntity(resolved, combat);
	if (actor == null) return;
	var preview = honeycomb.previewShift(actor, honeycomb.cardPartyShift(resolved, actor), combat);
	if (preview == null) return;
	honeycomb.combatScene.slideToOrder(actor.side == "enemy" ? "enemy" : "ally", preview.orderIdArray);

	var moving = honeycomb.combatScene.fighterElement(preview.entityId);
	if (moving != null) {
		moving.classList.add("hcShiftMoving", preview.arrow == "front" ? "hcShiftToFront" : "hcShiftToBack");
	}
};

//Slides the living members of a side so they STAND in `orderIdArray` order, without moving any
//element in the document: each is offset to the place currently held by whoever has its new rank.
honeycomb.combatScene.slideToOrder = function (side, orderIdArray) {
	var combat = honeycomb.state.run.combat;
	var livingArray = honeycomb.livingEntityArray(side, combat);
	var slotLeftArray = [];
	for (var rankIndex = 0; rankIndex < livingArray.length; rankIndex++) {
		var element = honeycomb.combatScene.fighterElement(livingArray[rankIndex].instanceId);
		slotLeftArray.push(element == null ? null : element.getBoundingClientRect().left);
	}
	for (var newRank = 0; newRank < orderIdArray.length; newRank++) {
		var fighter = honeycomb.combatScene.fighterElement(orderIdArray[newRank]);
		if (fighter == null) continue;
		var currentRank = -1;
		for (var scanIndex = 0; scanIndex < livingArray.length; scanIndex++) {
			if (livingArray[scanIndex].instanceId == orderIdArray[newRank]) { currentRank = scanIndex; break; }
		}
		if (currentRank < 0 || slotLeftArray[currentRank] == null || slotLeftArray[newRank] == null) continue;
		var offset = slotLeftArray[newRank] - slotLeftArray[currentRank];
		fighter.classList.add("hcShiftPreview");
		fighter.style.setProperty("translate", offset.toFixed(1) + "px 0");
	}
};

honeycomb.combatScene.clearShiftPreview = function () {
	var battlefield = document.getElementById("honeycombBattlefield");
	if (battlefield == null) return;
	var fighterArray = battlefield.getElementsByClassName("hcFighter");
	for (var scanIndex = 0; scanIndex < fighterArray.length; scanIndex++) {
		var fighter = fighterArray[scanIndex];
		fighter.classList.remove("hcShiftMoving", "hcShiftToFront", "hcShiftToBack");
		if (fighter.classList.contains("hcShiftPreview")) {
			fighter.style.removeProperty("translate");
			fighter.classList.remove("hcShiftPreview");
		}
	}
};

//THE REAL MOVE, when the log says someone moved. First-Last-Invert-Play: measure where everyone stands
//now (a held preview included), put the elements in their new order, then start each one from where it
//was and let it slide home. The fighters are moved rather than rebuilt, so nothing mid-animation is
//lost -- and a preview that already showed the move ends exactly where the move does, so it does not
//jump.
honeycomb.combatScene.playPartyShift = function (entry) {
	var battlefield = document.getElementById("honeycombBattlefield");
	var container = battlefield == null ? null : battlefield.getElementsByClassName("hcSide-" + entry.side)[0];
	if (container == null) return 0;
	var run = honeycomb.state.run;
	var entityArray = entry.side == "enemy" ? run.combat.enemyArray : run.partyArray;

	var beforeArray = {};
	var fighterArray = container.getElementsByClassName("hcFighter");
	for (var measureIndex = 0; measureIndex < fighterArray.length; measureIndex++) {
		beforeArray[fighterArray[measureIndex].dataset.hcentityid] = fighterArray[measureIndex].getBoundingClientRect().left;
	}
	honeycomb.combatScene.clearShiftPreview();

	//The document order follows the state's order; which way that reads on screen is the stylesheet's
	//business (the party stands front-rightmost, facing the enemy).
	for (var orderIndex = 0; orderIndex < entityArray.length; orderIndex++) {
		var element = honeycomb.combatScene.fighterElement(entityArray[orderIndex].instanceId);
		if (element != null && element.parentNode == container) container.appendChild(element);
	}

	var movedArray = [];
	for (var entityIndex = 0; entityIndex < entityArray.length; entityIndex++) {
		var fighter = honeycomb.combatScene.fighterElement(entityArray[entityIndex].instanceId);
		if (fighter == null || beforeArray[fighter.dataset.hcentityid] == null) continue;
		var offset = beforeArray[fighter.dataset.hcentityid] - fighter.getBoundingClientRect().left;
		if (Math.abs(offset) < 1) continue;
		fighter.classList.add("hcShiftSettling");
		fighter.style.setProperty("translate", offset.toFixed(1) + "px 0");
		movedArray.push(fighter);
	}
	if (movedArray.length === 0) return 0;
	//How fast: an ordinary step, or a named pace such as a charge. The slide's own length is
	//written on each figure, so the stylesheet's transition follows it.
	var pace = entry.pace == null ? null : honeycomb.findDefinition(honeycomb.tuning.animation.partyShiftPaceArray, entry.pace);
	var slideMs = pace == null ? honeycomb.tuning.animation.partyShiftMs : pace.slideMs;
	var holdMs = pace == null ? honeycomb.tuning.animation.partyShiftMs : pace.holdMs;
	//Reading layout commits the starting offsets before the transition is switched on.
	void container.offsetWidth;
	for (var slideIndex = 0; slideIndex < movedArray.length; slideIndex++) {
		movedArray[slideIndex].style.setProperty("--hc-party-shift-ms", honeycomb.duration(slideMs) + "ms");
		movedArray[slideIndex].classList.add("hcShiftSliding");
		movedArray[slideIndex].style.setProperty("translate", "0px 0");
	}
	setTimeout(function () {
		for (var cleanIndex = 0; cleanIndex < movedArray.length; cleanIndex++) {
			movedArray[cleanIndex].classList.remove("hcShiftSettling", "hcShiftSliding");
			movedArray[cleanIndex].style.removeProperty("translate");
			movedArray[cleanIndex].style.removeProperty("--hc-party-shift-ms");
		}
	}, honeycomb.duration(slideMs));
	//The party moving in its line has its own event, borrowed from `nodeEnter`, which is four seconds of
	//footsteps on wood, and every shifting card started them.
	honeycomb.platform.sound("partyShift");
	return holdMs;
};

//--- Forecast marks ---------------------------------------------------------------------------------
//Points the aimed forecast at a card and a target, or clears it, and redraws the bars if the answer
//changed. Only the VITALS are redrawn: rebuilding the battlefield mid-drag would destroy the element
//being dragged and the hover state around it.
honeycomb.combatScene.refreshAim = function (cardInstanceId, targetInstanceId) {
	if (honeycomb.forecast == null) return;
	var changed = cardInstanceId == null
		? honeycomb.forecast.clearAim()
		: honeycomb.forecast.aimAtCard(cardInstanceId, targetInstanceId);
	if (changed == true) honeycomb.combatScene.refreshAllVitals();
};

//The same, for an ability waiting on a target. An ability is aimed by hovering rather than dragging,
//so the hover handler is where it is answered.
//What the thing being aimed would do to the fighter under the pointer. Only an ABILITY has a forecast:
//a piece's Move reorders the line rather than changing anybody's numbers.
honeycomb.combatScene.refreshAimForecast = function (entityId) {
	if (honeycomb.forecast == null) return;
	var pending = honeycomb.combatScene.pendingAim;
	var changed = pending == null || entityId == null || pending.kind != "ability"
		? honeycomb.forecast.clearAim()
		: honeycomb.forecast.aimAtAbility(pending.sourceId, pending.abilityIndex, entityId);
	if (changed == true) honeycomb.combatScene.refreshAllVitals();
};

//Redraws every fighter's readout without touching their sprites, so nothing mid-animation is lost.
honeycomb.combatScene.refreshAllVitals = function () {
	var battlefield = document.getElementById("honeycombBattlefield");
	if (battlefield == null) return;
	var fighterArray = battlefield.getElementsByClassName("hcFighter");
	//Collected first: updateVitals replaces an element inside the live collection it is walking.
	var idArray = [];
	for (var scanIndex = 0; scanIndex < fighterArray.length; scanIndex++) {
		idArray.push(fighterArray[scanIndex].dataset.hcentityid);
	}
	for (var updateIndex = 0; updateIndex < idArray.length; updateIndex++) {
		honeycomb.combatScene.updateVitals(idArray[updateIndex]);
	}
};

//The aiming line, drawn in the overlay SVG's own 0..100 space so it needs no pixel maths.
//
//It runs from the held card to the reticle. It used to start at the acting
//character, back when the card chased the pointer; now the card stays put above the hand, the owner is
//already picked out by focus, and a line from the owner muddled the party-movement preview.
//THE AIMING LINE, for a dragged card and a dragged aim alike. `fromElement` is whatever
//the line leaves -- the held card, or the fighter doing the aiming -- and `targetId` is what it has
//found, which decides the on-target and on-ally colours. Both default to the card drag's own state, so
//the card path calls it exactly as it always did.
honeycomb.combatScene.drawTargetArrow = function (clientX, clientY, fromElement, targetId) {
	var svg = document.getElementById("honeycombTargetArrow");
	var path = document.getElementById("honeycombTargetArrowPath");
	var card = fromElement == null ? honeycomb.combatScene.dragElement : fromElement;
	var aimedAt = targetId === undefined ? honeycomb.combatScene.dragTargetId : targetId;
	if (svg == null || path == null || card == null) return;

	var stage = svg.getBoundingClientRect();
	if (stage.width === 0 || stage.height === 0) return;

	//From the top edge of whatever is doing the aiming, where the line leaves it towards the board.
	var cardBox = card.getBoundingClientRect();
	var fromX = ((cardBox.left + cardBox.width / 2 - stage.left) / stage.width) * 100;
	var fromY = ((cardBox.top - stage.top) / stage.height) * 100;
	var toX = ((clientX - stage.left) / stage.width) * 100;
	var toY = ((clientY - stage.top) / stage.height) * 100;
	//A control point above the midpoint gives the lobbed arc the mockup shows. Kept inside the drawing
	//space: an arc whose apex sits above the top edge is clipped flat, and a shot from somebody near
	//the top of the screen would otherwise lose its whole curve.
	var controlX = (fromX + toX) / 2;
	var controlY = Math.max(0, Math.min(fromY, toY) - honeycomb.combatScene.arrowArcHeight);

	path.setAttribute("d", "M " + fromX.toFixed(2) + " " + fromY.toFixed(2) +
		" Q " + controlX.toFixed(2) + " " + controlY.toFixed(2) + " " + toX.toFixed(2) + " " + toY.toFixed(2));
	svg.classList.add("hcActive");
	svg.classList.toggle("hcOnTarget", aimedAt != null);
	//Aimed at a FRIEND the arrow changes colour, so a card landing on an ally is never mistaken for one
	//landing on an enemy.
	var targetEntity = aimedAt == null
		? null : honeycomb.findEntity(aimedAt, honeycomb.state.run.combat);
	svg.classList.toggle("hcOnAlly", targetEntity != null && targetEntity.side == "ally");
};

//How far above the straight line the aiming arc bows, in the arrow SVG's coordinate space.
honeycomb.combatScene.arrowArcHeight = 18;

honeycomb.combatScene.clearTargetArrow = function () {
	var svg = document.getElementById("honeycombTargetArrow");
	if (svg == null) return;
	svg.classList.remove("hcActive", "hcOnTarget", "hcOnAlly");
	var path = document.getElementById("honeycombTargetArrowPath");
	if (path != null) path.setAttribute("d", "");
};

//--- Play and turn actions --------------------------------------------------------------------------
//Clicking a card plays it if it needs no target, and otherwise says so rather than doing nothing.
honeycomb.combatScene.onCardClick = function (instanceId) {
	var resolved = honeycomb.combat.resolveById(instanceId);
	if (resolved == null) return;
	if (honeycomb.combatScene.needsEntityPick(resolved) == true) {
		honeycomb.combatScene.flashMessage("Drag onto a target.");
		return;
	}
	//Untargeted cards, and cards that pick cards (they ask once played), play on a click.
	honeycomb.combatScene.requestPlay(instanceId, null);
};

honeycomb.combatScene.onFighterClick = function (entityId) {
	//A click anywhere on the board puts an open ability menu away; the menu and the medallion stop their
	//own clicks, so this is only ever a click somewhere else.
	honeycomb.combatScene.closeAbilityMenu();
	//A pending ability is waiting for exactly this click. On TOUCH the first tap on a target shows what
	//the ability would do there -- what hovering it does with a mouse -- and the second uses it.
	if (honeycomb.combatScene.pendingAim != null) {
		if (honeycomb.input.tapToAct("abilityAim:" + entityId) == false) {
			honeycomb.combatScene.refreshAimForecast(entityId);
			return entityId;
		}
		honeycomb.combatScene.aimAt(entityId);
		return entityId;
	}
	//TOUCH: a card read by a tap is played on a legal target by tapping it; tapping anyone else puts
	//the card back down. See touchInspect.
	var inspectedId = honeycomb.combatScene.touchInspectId;
	if (inspectedId != null) {
		var fighter = honeycomb.combatScene.fighterElement(entityId);
		var legal = fighter != null && fighter.classList.contains("hcLegalTarget");
		honeycomb.combatScene.touchInspect(null);
		if (legal) honeycomb.combatScene.requestPlay(inspectedId, entityId);
		return entityId;
	}
	//Clicking an AI COMBATANT with nothing being aimed opens its moves -- a click, so a touchscreen gets
	//there too. That is every enemy and anything the AI plays for the party. Clicking a character the
	//player commands does nothing yet; the hook is where an inspect panel would go.
	var entity = honeycomb.findEntity(entityId, honeycomb.state.run.combat);
	if (entity != null && honeycomb.isAiControlled(entity) && honeycomb.combatScene.busy != true) honeycomb.enemyMoves.show(entityId);
	return entityId;
};

//---------------------------------------------------------------------------------------------------
//The play-speed slider
//---------------------------------------------------------------------------------------------------
//A slider over named speed steps, including slow ones for watching a battle play out carefully.
//tuning.animation.playSpeedArray carries the slow steps; this is the bar that reaches them. It
//is a SLIDER OVER THE ARRAY rather than over a multiplier, so the named steps stay the only speeds
//there are and adding a step is a table entry.
//
//The panel is an ordinary element inside the combat root rather than an overlay: an overlay would
//cover the board, and the whole point of a slow speed is watching the board while it moves. Changing
//the speed mid-replay is safe -- every duration is read through honeycomb.duration as its beat is
//scheduled, so a beat already in flight keeps its timing and the next one takes the new one.
honeycomb.combatScene.onSpeedButton = function () {
	if (document.getElementById("honeycombSpeedPanel") != null) {
		honeycomb.combatScene.closeSpeedPanel();
		return;
	}
	honeycomb.platform.sound("uiClick");
	honeycomb.combatScene.openSpeedPanel();
};

honeycomb.combatScene.openSpeedPanel = function () {
	var root = honeycomb.rootElement();
	if (root == null) return;
	honeycomb.combatScene.closeSpeedPanel();

	var speedArray = honeycomb.tuning.animation.playSpeedArray;
	var panel = document.createElement("div");
	panel.id = "honeycombSpeedPanel";
	panel.className = "hcSpeedPanel";
	var markup = '<div class="hcSpeedPanelTitle">Play speed</div>';
	markup += '<div class="hcSpeedPanelValue" id="honeycombSpeedPanelValue"></div>';
	markup += '<input type="range" class="hcSpeedRange" id="honeycombSpeedRange" min="0" max="' +
		(speedArray.length - 1) + '" step="1" value="' + honeycomb.playSpeedPosition() + '"' +
		' oninput="honeycomb.combatScene.onSpeedSlide(this.value)">';
	//The ends named, so the bar says which way is slower without being dragged first.
	markup += '<div class="hcSpeedPanelEnds"><span>' + honeycomb.escapeText(speedArray[0].label) +
		"</span><span>" + honeycomb.escapeText(speedArray[speedArray.length - 1].label) + "</span></div>";
	markup += '<div class="hcSpeedPanelNote">The whole game runs at this speed, cut-ins included.</div>';
	markup += '<div class="hcSpeedPanelButtons">' +
		'<div class="hcButton hcSmall" onclick="honeycomb.combatScene.onSpeedReset()">Normal</div>' +
		'<div class="hcButton hcSmall" onclick="honeycomb.combatScene.closeSpeedPanel()">Close</div></div>';
	panel.innerHTML = markup;
	root.appendChild(panel);
	honeycomb.combatScene.refreshSpeedPanel();
};

honeycomb.combatScene.closeSpeedPanel = function () {
	var panel = document.getElementById("honeycombSpeedPanel");
	if (panel != null && panel.parentNode != null) panel.parentNode.removeChild(panel);
};

//What the panel says about where the slider stands. Separate from the build so the reset button and a
//drag can both call it.
honeycomb.combatScene.refreshSpeedPanel = function () {
	var speed = honeycomb.findDefinition(honeycomb.tuning.animation.playSpeedArray, honeycomb.playSpeed());
	if (speed == null) return;
	var value = document.getElementById("honeycombSpeedPanelValue");
	if (value != null) {
		value.textContent = speed.name + "  ·  " + speed.label;
		//The inspection steps are marked, so a tester can tell the play speeds from the look-at-it ones.
		value.className = "hcSpeedPanelValue" + (speed.inspection == true ? " hcSpeedInspection" : "");
	}
	var range = document.getElementById("honeycombSpeedRange");
	if (range != null && Number(range.value) != honeycomb.playSpeedPosition()) range.value = honeycomb.playSpeedPosition();
	//The shelf button carries the same reading, since the panel may be closed while it is being read.
	var button = document.getElementById("honeycombSpeedButton");
	if (button != null) {
		button.title = "Play speed: " + speed.name + " (tap for the slider)";
		var label = button.getElementsByTagName("span")[0];
		if (label != null) label.textContent = speed.label;
	}
};

honeycomb.combatScene.onSpeedSlide = function (value) {
	var chosen = honeycomb.setPlaySpeedPosition(Number(value));
	if (chosen == null) return;
	honeycomb.combatScene.refreshSpeedPanel();
	honeycomb.save.autosave(null);
};

honeycomb.combatScene.onSpeedReset = function () {
	honeycomb.setPlaySpeed(honeycomb.tuning.animation.defaultPlaySpeed);
	honeycomb.platform.sound("uiClick");
	honeycomb.combatScene.refreshSpeedPanel();
	honeycomb.save.autosave(null);
};

//---------------------------------------------------------------------------------------------------
//Abilities
//---------------------------------------------------------------------------------------------------
//Pressing an ability on a nameplate. There is no menu to open any more: the button
//IS the ability, so one press either fires it or starts aiming it. A press on one that cannot be used
//says why rather than doing nothing.
honeycomb.combatScene.onAbilityPick = function (domEvent, memberInstanceId, abilityIndex) {
	if (domEvent != null && domEvent.stopPropagation != null) domEvent.stopPropagation();
	if (honeycomb.combatScene.busy == true) return;
	//A drag already decided this press; the click the browser sends afterwards is not a second one.
	if (honeycomb.combatScene.aimDragSuppressClick == true) { honeycomb.combatScene.aimDragSuppressClick = false; return; }

	var combat = honeycomb.state.run.combat;
	var member = honeycomb.findEntity(memberInstanceId, combat);
	var usability = honeycomb.abilities.usability(member, abilityIndex, combat);
	if (usability.usable == false) {
		//The requirement itself, when there is one to name: "Needs 6 Resolve" beats "Not right now".
		honeycomb.combatScene.flashMessage(usability.explanation !== ""
			? usability.explanation : honeycomb.combatScene.refusalText(usability.reason));
		return;
	}

	//The member's own version, so a training wheel that aims at an enemy asks for one (AUDIT-01).
	var definition = honeycomb.abilities.definitionFor(honeycomb.abilities.findMember(memberInstanceId), abilityIndex);
	//A usable pick closes the medallion's menu: aiming repaints without it, firing hands over to a replay.
	honeycomb.combatScene.closeAbilityMenu();

	//An ability that needs a pick enters aiming rather than firing. Legal targets take the gold frame a
	//dragged card lights; nothing is dimmed.
	if (honeycomb.targetModeRequiresPick(definition.targetMode) == true) {
		honeycomb.combatScene.beginAim({
			kind: "ability",
			sourceId: memberInstanceId,
			abilityIndex: abilityIndex,
			targetMode: definition.targetMode,
			label: definition.name,
		});
		return;
	}

	honeycomb.combatScene.resolveAbility(memberInstanceId, abilityIndex, null);
};

//--- ONE AIM MODE -----------------------------------------------------------------------------------
//Everything that points at a fighter without being a card fills the SAME descriptor:
//  kind          "ability" or "activation"
//  sourceId      the acting entity's instance id
//  abilityIndex  ability only
//  targetMode    the mode being aimed; decides side, excludeSelf and kind
//  label         what the flash calls it
//A piece's Move was a third way to point at something on top of the card drag and the ability click.

//True when an entity is a legal target for whatever is currently being aimed.
honeycomb.combatScene.isLegalAimTarget = function (entity) {
	var pending = honeycomb.combatScene.pendingAim;
	if (pending == null) return false;
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var source = honeycomb.findEntity(pending.sourceId, combat);
	return honeycomb.targetModeAllows(pending.targetMode, pending.sourceId,
		source == null ? "ally" : source.side, entity);
};

//MARKED IN PLACE, NEVER BY REPAINTING. `repaint` is `root.innerHTML = render()`, which destroys every
//fighter element -- and a brand-new element cannot have been entered by a pointer that never moved, so
//the depth-focus hover rule stopped applying and the figure shrank and then grew back over 260ms, as
//though the mouse vanished for a frame. The card drag has always
//marked in place; entering an aim now does the same, so the board does not flinch.
//Called with nothing pending, this clears every mark, so it serves as its own undo.
honeycomb.combatScene.markAimTargets = function () {
	var battlefield = document.getElementById("honeycombBattlefield");
	if (battlefield == null) return;
	var pending = honeycomb.combatScene.pendingAim;
	var fighterArray = battlefield.getElementsByClassName("hcFighter");
	for (var scanIndex = 0; scanIndex < fighterArray.length; scanIndex++) {
		var fighter = fighterArray[scanIndex];
		var entity = honeycomb.findEntity(fighter.dataset.hcentityid,
			honeycomb.state.run == null ? null : honeycomb.state.run.combat);
		var legal = honeycomb.combatScene.isLegalAimTarget(entity);
		fighter.classList.toggle("hcLegalTarget", legal);
		fighter.classList.toggle("hcLegalAlly", legal && fighter.dataset.hcside == "ally");
	}
	//The control that is aiming says so, toggled in place for the same reason the targets are.
	var moveArray = battlefield.getElementsByClassName("hcGolemMove");
	for (var moveIndex = 0; moveIndex < moveArray.length; moveIndex++) {
		var move = moveArray[moveIndex];
		var owner = move.closest == null ? null : move.closest(".hcFighter");
		var isAiming = pending != null && owner != null && owner.dataset.hcentityid == pending.sourceId;
		var optionArray = move.getElementsByClassName("hcAbilityOption");
		for (var optionIndex = 0; optionIndex < optionArray.length; optionIndex++) {
			optionArray[optionIndex].classList.toggle("hcAiming", isAiming);
		}
	}
};

//THE DESCRIPTOR FOR ONE AIM, whoever is asking. Both the click path and the drag path build theirs
//here, so a control cannot be draggable under rules its click does not share.
//Returns null when the thing cannot be aimed at all; `refusal` on the result says why when it is the
//usability that refused, so the caller can say so.
honeycomb.combatScene.aimDescriptorFor = function (kind, sourceId, abilityIndex) {
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var entity = honeycomb.findEntity(sourceId, combat);
	if (entity == null || combat == null) return null;
	if (kind == "activation") {
		var activation = honeycomb.golemActivation(entity);
		if (activation == null || activation.pick == null || activation.targetMode == null) return null;
		var golemUsability = honeycomb.golemActivationUsability(entity, combat);
		if (golemUsability.usable != true) {
			return { refusal: golemUsability.reason == null ? "It cannot move." : golemUsability.reason };
		}
		return {
			kind: "activation", sourceId: sourceId, targetMode: activation.targetMode,
			label: activation.text == null ? "Move" : activation.text,
			prompt: activation.text == null ? "Choose where it moves." : activation.text,
		};
	}
	var definition = honeycomb.abilities.definitionFor(honeycomb.abilities.findMember(sourceId), abilityIndex);
	if (definition == null) return null;
	if (honeycomb.targetModeRequiresPick(definition.targetMode) != true) return null;
	var usability = honeycomb.abilities.usability(entity, abilityIndex, combat);
	if (usability.usable != true) {
		return { refusal: usability.explanation !== "" ? usability.explanation : honeycomb.combatScene.refusalText(usability.reason) };
	}
	return {
		kind: "ability", sourceId: sourceId, abilityIndex: abilityIndex,
		targetMode: definition.targetMode, label: definition.name,
	};
};

//--- DRAGGING AN AIM ---------------------------------------------------------------------------------
//So it is the CARD's machinery, borrowed rather than re-invented: pointer capture on the control
//itself and no document listener (see the note above onPointerDown for why that matters to Jiggy),
//the same reticle, the same curved arrow, the same legal-target marks, the same depth focus, and a
//move preview that plays the part the card's shift preview plays.
//
//Below the drag threshold the press is still a CLICK and stage 1's behaviour is untouched: the control
//arms the aim and a later click commits it. That is the card's rule too -- a click that wobbles is
//still a click.
honeycomb.combatScene.aimDrag = null;
//A committed drag has already acted on release, so the click the browser sends afterwards is ignored.
honeycomb.combatScene.aimDragSuppressClick = false;

honeycomb.combatScene.onAimPointerDown = function (event, kind, sourceId, abilityIndex) {
	if (event != null && event.stopPropagation != null) event.stopPropagation();
	honeycomb.combatScene.aimDragSuppressClick = false;
	if (honeycomb.combatScene.busy == true) return;
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (combat == null || combat.phase != "playerTurn") return;
	var control = event.currentTarget;
	if (control == null) return;
	//Nothing is armed and nothing is marked yet: this only becomes a drag once the pointer moves far
	//enough, and until then the click path owns the press.
	honeycomb.combatScene.aimDrag = {
		kind: kind, sourceId: sourceId, abilityIndex: abilityIndex, control: control,
		pointerId: event.pointerId, originX: event.clientX, originY: event.clientY,
		committed: false, targetId: null,
	};
	try { control.setPointerCapture(event.pointerId); } catch (captureError) { /* no active pointer */ }
	control.addEventListener("pointermove", honeycomb.combatScene.onAimPointerMove);
	control.addEventListener("pointerup", honeycomb.combatScene.onAimPointerUp);
	control.addEventListener("pointercancel", honeycomb.combatScene.onAimPointerUp);
	control.addEventListener("lostpointercapture", honeycomb.combatScene.onAimPointerUp);
};

honeycomb.combatScene.onAimPointerMove = function (event) {
	var drag = honeycomb.combatScene.aimDrag;
	if (drag == null) return;
	var deltaX = event.clientX - drag.originX;
	var deltaY = event.clientY - drag.originY;
	var threshold = honeycomb.pixels(honeycomb.tuning.combat.aimDragThresholdPixels);
	if (drag.committed == false && Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) return;

	//The first moment it is genuinely a drag: arm the aim if the click path has not already, mark the
	//legal targets, and take the tooltip out of the way for the rest of the gesture.
	if (drag.committed == false) {
		drag.committed = true;
		var pending = honeycomb.combatScene.pendingAim;
		if (pending == null || pending.sourceId != drag.sourceId) {
			var descriptor = honeycomb.combatScene.aimDescriptorFor(drag.kind, drag.sourceId, drag.abilityIndex);
			if (descriptor == null || descriptor.refusal != null) {
				if (descriptor != null) honeycomb.combatScene.flashMessage(descriptor.refusal);
				honeycomb.combatScene.endAimDrag(event);
				return;
			}
			honeycomb.combatScene.beginAim(descriptor);
		}
		honeycomb.tooltip.suppress(true);
	}

	honeycomb.combatScene.moveReticle(event.clientX, event.clientY);
	//Releasing back over the hand puts it away, the way a card dropped on the hand goes back.
	var overHand = honeycomb.combatScene.pointIsInCancelZone(event.clientX, event.clientY);
	honeycomb.combatScene.setReticleState("hcReticleCancel", overHand);

	var hovered = overHand ? null : honeycomb.combatScene.aimTargetAtPoint(event.clientX, event.clientY);
	honeycomb.combatScene.setAimDragTarget(hovered);
	honeycomb.combatScene.setReticleState("hcReticleLive", hovered != null);
	var hoveredEntity = hovered == null ? null : honeycomb.findEntity(hovered, honeycomb.state.run.combat);
	honeycomb.combatScene.setReticleState("hcReticleAlly", hoveredEntity != null && hoveredEntity.side == "ally");

	//Everyone this aim is not about steps back, exactly as a held card does it.
	var sourceId = drag.sourceId;
	honeycomb.combatScene.setFocus(function (entityId) {
		if (entityId == sourceId || entityId == hovered) return "full";
		return hovered == null ? "half" : "none";
	});

	//THE LINE LEAVES THE FIGURE, NOT THE COLUMN. A fighter element is as tall as the battlefield, so its
	//top edge is nearly the top of the screen and the arrow appeared to come from nowhere. The art's box
	//is the drawing itself, so the line leaves from just above the head.
	var sourceFighter = honeycomb.combatScene.fighterElement(drag.sourceId);
	var fromElement = sourceFighter == null ? null
		: (sourceFighter.getElementsByClassName("hcFighterArt")[0] || sourceFighter);
	if (overHand == false) honeycomb.combatScene.drawTargetArrow(event.clientX, event.clientY, fromElement, hovered);
	else honeycomb.combatScene.clearTargetArrow();
};

honeycomb.combatScene.onAimPointerUp = function (event) {
	var drag = honeycomb.combatScene.aimDrag;
	if (drag == null) return;
	var committed = drag.committed;
	var targetId = drag.targetId;
	honeycomb.combatScene.endAimDrag(event);
	//A press that never became a drag is a CLICK: stage 1 owns it, and the control's own onclick runs.
	if (committed != true) return;
	//THE FLAG IS FOR EXACTLY ONE CLICK. The browser sends that click immediately after this release, so
	//it is cleared on the next task. Left sticky, a drag that ended somewhere no click could fire --
	//released over empty sky, or outside the window -- would silently swallow the NEXT press of an aim
	//control, which is a bug with no symptom.
	//The 0 is a yield to the task queue, not a duration: it must NOT go through honeycomb.duration, or
	//the player's speed setting would decide whether a click is eaten.
	honeycomb.combatScene.aimDragSuppressClick = true;
	setTimeout(function () { honeycomb.combatScene.aimDragSuppressClick = false; }, 0);
	//Let go on a legal target and it lands; let go anywhere else and it goes away without a scolding,
	//which is what a card dropped on nothing does.
	if (targetId != null) honeycomb.combatScene.aimAt(targetId);
	else honeycomb.combatScene.cancelAim(true);
};

//Tears the gesture down without deciding anything: shared by the release and by a refusal mid-drag.
honeycomb.combatScene.endAimDrag = function (event) {
	var drag = honeycomb.combatScene.aimDrag;
	if (drag == null) return;
	honeycomb.combatScene.aimDrag = null;
	var control = drag.control;
	if (control != null) {
		control.removeEventListener("pointermove", honeycomb.combatScene.onAimPointerMove);
		control.removeEventListener("pointerup", honeycomb.combatScene.onAimPointerUp);
		control.removeEventListener("pointercancel", honeycomb.combatScene.onAimPointerUp);
		control.removeEventListener("lostpointercapture", honeycomb.combatScene.onAimPointerUp);
		var pointerId = event == null ? drag.pointerId : event.pointerId;
		if (control.hasPointerCapture && control.hasPointerCapture(pointerId)) control.releasePointerCapture(pointerId);
	}
	honeycomb.tooltip.suppress(false);
	honeycomb.combatScene.clearTargetArrow();
	honeycomb.combatScene.hideReticle();
	honeycomb.combatScene.clearShiftPreview();
	honeycomb.combatScene.setFocus(null);
};

//Which fighter is under a point AND legal for the aim in progress. The card path's fighterAtPoint does
//the scored hit test -- which is what makes a boss anchored behind the row reachable -- and the aim's
//own legality decides whether it counts.
honeycomb.combatScene.aimTargetAtPoint = function (clientX, clientY) {
	var entityId = honeycomb.combatScene.fighterAtPoint(clientX, clientY);
	if (entityId == null) return null;
	var entity = honeycomb.findEntity(entityId, honeycomb.state.run.combat);
	return honeycomb.combatScene.isLegalAimTarget(entity) ? entityId : null;
};

//The target under the reticle: the hovered mark, the forecast, and -- for a piece's Move -- where the
//line would end up. Done on CHANGE rather than every pointer move, for the reason setDragTarget gives.
honeycomb.combatScene.setAimDragTarget = function (targetId) {
	var drag = honeycomb.combatScene.aimDrag;
	if (drag == null || drag.targetId == targetId) return;
	drag.targetId = targetId;

	var battlefield = document.getElementById("honeycombBattlefield");
	if (battlefield != null) {
		var fighterArray = battlefield.getElementsByClassName("hcFighter");
		for (var scanIndex = 0; scanIndex < fighterArray.length; scanIndex++) {
			fighterArray[scanIndex].classList.toggle("hcTargeted",
				targetId != null && fighterArray[scanIndex].dataset.hcentityid == targetId);
		}
	}
	honeycomb.combatScene.refreshAimForecast(targetId);
	honeycomb.combatScene.showAimMovePreview(targetId);
};

//A PIECE'S MOVE SHOWS ITS LINE BEFORE IT IS LET GO, the way a card shows where it would move its owner.
//Only an activation moves the line; an ability's effect is a forecast on the bars instead.
honeycomb.combatScene.showAimMovePreview = function (targetId) {
	honeycomb.combatScene.clearShiftPreview();
	var drag = honeycomb.combatScene.aimDrag;
	var pending = honeycomb.combatScene.pendingAim;
	if (drag == null || pending == null || pending.kind != "activation" || targetId == null) return;
	if (honeycomb.tuning.combat.partyShiftEnabled != true) return;
	var combat = honeycomb.state.run.combat;
	var source = honeycomb.findEntity(pending.sourceId, combat);
	var target = honeycomb.findEntity(targetId, combat);
	if (source == null || target == null) return;
	var preview = honeycomb.previewMoveToRank(source, honeycomb.entityRank(target, combat), combat);
	if (preview == null) return;
	honeycomb.combatScene.slideToOrder(source.side == "enemy" ? "enemy" : "ally", preview.orderIdArray);
	var moving = honeycomb.combatScene.fighterElement(preview.entityId);
	if (moving != null) {
		moving.classList.add("hcShiftMoving", preview.arrow == "front" ? "hcShiftToFront" : "hcShiftToBack");
	}
};

honeycomb.combatScene.beginAim = function (descriptor) {
	honeycomb.combatScene.pendingAim = descriptor;
	honeycomb.combatScene.markAimTargets();
	//An ABILITY is named ("Choose a target for Marshal's Call."); an ACTIVATION's own text is already
	//the instruction, so wrapping it produced "Choose a target for Leap to an ally's place..".
	honeycomb.combatScene.flashMessage(descriptor.prompt != null
		? descriptor.prompt : "Choose a target for " + descriptor.label + ".");
};

//A WAY OUT. Aiming used to have exactly one: tapping an ILLEGAL fighter, which scolded the player for
//changing their mind. A card dropped on nothing simply goes back, so this does too.
honeycomb.combatScene.cancelAim = function (quiet) {
	if (honeycomb.combatScene.pendingAim == null) return;
	honeycomb.combatScene.pendingAim = null;
	honeycomb.combatScene.markAimTargets();
	honeycomb.combatScene.clearTargetMarks();
	honeycomb.combatScene.refreshAimForecast(null);
	if (quiet != true) honeycomb.combatScene.flashMessage("Cancelled.");
};

honeycomb.combatScene.aimAt = function (entityId) {
	var pending = honeycomb.combatScene.pendingAim;
	if (pending == null) return;
	var combat = honeycomb.state.run.combat;
	var entity = honeycomb.findEntity(entityId, combat);
	if (honeycomb.combatScene.isLegalAimTarget(entity) == false) {
		honeycomb.combatScene.cancelAim(true);
		honeycomb.combatScene.flashMessage("Not a legal target.");
		return;
	}
	honeycomb.combatScene.pendingAim = null;
	honeycomb.combatScene.markAimTargets();
	honeycomb.combatScene.clearTargetMarks();
	if (pending.kind == "activation") {
		honeycomb.combatScene.commitActivationAim(pending, entity, combat);
		return;
	}
	honeycomb.combatScene.resolveAbility(pending.sourceId, pending.abilityIndex, entityId);
};

//A PIECE'S MOVE COMMITS THROUGH THE RANK IT PICKED. The player points at an ally and the engine verb
//takes the rank that ally is standing in -- which is exactly what the numbered list used to ask for
//directly. `entityRank` is the same function the list used to grey out the slot a piece stood in.
//The board really changes here, so this one does repaint; it is entering an aim that must not.
honeycomb.combatScene.commitActivationAim = function (pending, entity, combat) {
	var source = honeycomb.findEntity(pending.sourceId, combat);
	if (source == null) return;
	var targetRank = honeycomb.entityRank(entity, combat);
	if (targetRank < 0) return;
	var context = honeycomb.newEffectContext({ combat: combat, source: source });
	if (honeycomb.runGolemActivationToRank(source, targetRank, context) != true) return;
	honeycomb.combatScene.repaint();
};

//An ability's log is replayed exactly as a card's is, so a spell and a card animate through one path.
honeycomb.combatScene.resolveAbility = function (memberInstanceId, abilityIndex, targetInstanceId, answerArray) {
	var result = honeycomb.abilities.use(memberInstanceId, abilityIndex, targetInstanceId, answerArray);

	//An ability may stop and ask, on the same terms a card does.
	if (result.reason == "needsChoice") {
		honeycomb.combatScene.askChoice(result.choice, result.answerArray, function (nextAnswerArray) {
			honeycomb.combatScene.resolveAbility(memberInstanceId, abilityIndex, targetInstanceId, nextAnswerArray);
		});
		return;
	}

	if (result.played == false) {
		honeycomb.combatScene.flashMessage(honeycomb.combatScene.refusalText(result.reason));
		honeycomb.combatScene.repaint();
		return;
	}
	honeycomb.combatScene.playSound(result);
	honeycomb.combatScene.refreshHandPlayability();
	honeycomb.combatScene.playLog(result.context.log, function () {
		honeycomb.combatScene.afterBeat();
	});
};

//Hovering a fighter while something is being aimed forecasts what it would do to them, on the same
//terms a dragged card does. With nothing aimed this costs nothing: refreshAimForecast sees no pending
//aim and clears, which is already the state. A piece's Move has no forecast to show -- it reorders the
//line rather than changing anybody's numbers -- and refreshAimForecast handles that by kind.
honeycomb.combatScene.onFighterHover = function (entityId) {
	if (honeycomb.combatScene.pendingAim != null) {
		honeycomb.combatScene.refreshAimForecast(entityId);
	}
	return entityId;
};

honeycomb.combatScene.attemptPlay = function (instanceId, targetId, answerArray) {
	if (honeycomb.combatScene.busy == true) return;

	//Where the card was, measured before it stops being in the hand. The flight animation needs a
	//starting rectangle and there is nothing left to measure once the play has resolved. A card that
	//WAITED in the play queue flies from the rail it was standing on, not from the hand slot it left.
	honeycomb.combatScene.flightOrigin = honeycomb.combatScene.playQueueBoxFor(instanceId) ||
		honeycomb.combatScene.handCardBox(instanceId);

	var result = honeycomb.combat.playCard(instanceId, targetId, answerArray);

	//The card stopped to ask something. Nothing has happened yet -- the engine rewound the attempt --
	//so showing the question and playing again with the answer appended is the whole of the handling.
	//A player who closes the overlay simply has not played the card.
	if (result.reason == "needsChoice") {
		honeycomb.combatScene.askChoice(result.choice, result.answerArray, function (nextAnswerArray) {
			honeycomb.combatScene.attemptPlay(instanceId, targetId, nextAnswerArray);
		});
		return;
	}

	if (result.played == false) {
		honeycomb.combatScene.flashMessage(honeycomb.combatScene.refusalText(result.reason));
		honeycomb.combatScene.repaint();
		return;
	}
	honeycomb.combatScene.playSound(result);
	honeycomb.combatScene.refreshHandPlayability();
	honeycomb.combatScene.playLog(result.context.log, function () {
		honeycomb.combatScene.afterBeat();
	});
};

//WHAT A PLAY SOUNDS LIKE. The event comes from the explicit card table (see playCardSound); the type
//table is only the net for unassigned content.
honeycomb.combatScene.playSound = function (result) {
	var card = result == null || result.context == null ? null : result.context.card;
	honeycomb.combatScene.playCardSound(card);
};

//The sound of one card being played. The explicit table wins: a card's `sfx`
//field, else its row in tuning.audio.cardSfxMap, played as a library stem. Only content with no
//assignment reaches the type fallback below.
honeycomb.combatScene.playCardSound = function (card) {
	if (card == null) return;
	var stem = honeycomb.cardSfxStem == null ? null : honeycomb.cardSfxStem(card);
	if (stem != null) { honeycomb.platform.playStem(stem); return; }
	honeycomb.platform.sound(honeycomb.combatScene.playSoundEvent(card));
};

//The type fallback, for content with no explicit assignment yet. Read in order: the card's PRIMARY
//type first, then the rest, so a Drain that is Damage and Support sounds like the attack it mainly is.
honeycomb.combatScene.playSoundEvent = function (card) {
	if (card == null) return "cardPlay";
	var typeArray = honeycomb.cardTypeIndexArray(card);
	var soundArray = honeycomb.tuning.audio.cardPlaySoundArray;
	for (var typeIndex = 0; typeIndex < typeArray.length; typeIndex++) {
		var found = honeycomb.findDefinition(soundArray, typeArray[typeIndex]);
		if (found != null) return found.event;
	}
	return "cardPlay";
};

//Shows one question and hands the answer back. The same path serves cards and abilities, because a
//question is data rather than a bespoke screen.
honeycomb.combatScene.askChoice = function (request, answerArray, onAnswered) {
	honeycomb.overlay.open("choice", {
		request: request,
		onAnswer: function (answer) {
			onAnswered(answerArray.concat([answer]));
		},
		//Cancelling leaves everything as it was: nothing happened when the question was asked, so the
		//board only needs redrawing to drop the held card's previews. Anything queued behind the question
		//then carries on.
		onCancel: function () {
			honeycomb.combatScene.repaint();
			honeycomb.combatScene.drainInputQueue();
		},
	});
};

honeycomb.combatScene.refusalTextArray = [
	{ index: "cannotAfford", text: "Not enough Energy." },
	{ index: "needsTarget", text: "Choose a target." },
	{ index: "unplayable", text: "This card cannot be played." },
	{ index: "ownerDown", text: "Its owner is out of the fight." },
	{ index: "conditionNotMet", text: "Not right now." },
	{ index: "invalidTarget", text: "That target cannot be affected." },
	{ index: "notPlayerTurn", text: "Wait for your turn." },
	{ index: "noCharges", text: "No charges left." },
	{ index: "unknownAbility", text: "That ability is not available." },
	{ index: "noOwner", text: "Nobody can use that." },
	{ index: "notInHand", text: "That card has already gone." },
	{ index: "turnEnding", text: "The turn is ending." },
];

honeycomb.combatScene.refusalText = function (reasonIndex) {
	var mapping = honeycomb.findDefinition(honeycomb.combatScene.refusalTextArray, reasonIndex);
	return mapping == null ? "That did not work." : mapping.text;
};

//Whether the End Turn corner has anything to offer: the player's turn, and no turn end already queued
//behind it. Drives the shelf's right end piece and matches what onEndTurn will do.
honeycomb.combatScene.endTurnReady = function (combat) {
	if (combat == null || combat.phase != "playerTurn") return false;
	return honeycomb.combatScene.endTurnQueued() == false;
};

//The shelf's end pieces swap to their empty paintings. Called on render and whenever Energy
//or the turn state moves, so the corner goes dark the moment it can do nothing rather than at the next
//repaint. The End Turn button itself stays in place, invisible, so its label never doubles the plaque.
honeycomb.combatScene.refreshShelfState = function () {
	if (honeycomb.battleLayout().handShelf != true) return;
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (combat == null) return;
	var shelf = honeycomb.tuning.art.handShelf;
	var left = document.getElementById("honeycombShelfLeftArt");
	if (left != null) left.src = honeycomb.image(honeycomb.getResource("energy") <= 0 ? shelf.leftEmptyPath : shelf.leftPath);
	var right = document.getElementById("honeycombShelfRightArt");
	if (right != null) right.src = honeycomb.image(honeycomb.combatScene.endTurnReady(combat) ? shelf.rightPath : shelf.rightEmptyPath);
};

//The End Turn press plays its own click before the turn machinery, so the invisible button still feels
//pressed. A turn end carried out from the queue calls onEndTurn directly and does not double it.
honeycomb.combatScene.onEndTurnPressed = function () {
	honeycomb.platform.sound("uiClick");
	honeycomb.combatScene.onEndTurn();
};

honeycomb.combatScene.onEndTurn = function () {
	var combat = honeycomb.state.run.combat;
	if (combat == null || combat.phase != "playerTurn") return;
	//Pressed during a replay, or behind queued plays, it waits its turn rather than
	//doing nothing. The button says it was heard; see queueInput.
	if (honeycomb.combatScene.inputMustQueue() == true) {
		honeycomb.combatScene.queueInput({ kind: "endTurn" });
		return;
	}

	var endContext = honeycomb.combat.endPlayerTurn();
	if (endContext == null) return;
	//The turn just left the player's hands: the right corner goes empty NOW, not at the closing repaint.
	//The phase moved to the enemy turn inside endPlayerTurn.
	honeycomb.combatScene.refreshShelfState();

	honeycomb.combatScene.playLog(endContext.log, function () {
		if (honeycomb.combatScene.checkCombatOver() == true) return;
		var enemyContext = honeycomb.combat.runEnemyTurn();
		honeycomb.combatScene.playLog(enemyContext == null ? [] : enemyContext.log, function () {
			if (honeycomb.combatScene.checkCombatOver() == true) return;
			var startContext = honeycomb.newEffectContext({ combat: honeycomb.state.run.combat });
			honeycomb.combat.startPlayerTurn(startContext);
			//Back in the player's hands: the corner is live again.
			honeycomb.combatScene.refreshShelfState();
			honeycomb.combatScene.playLog(startContext.log, function () {
				honeycomb.combatScene.afterBeat();
			}, "turnStart");
		}, "enemyTurn");
	}, "endTurn");
};

//Runs after any resolved beat: repaint, then check whether the fight has ended, then carry out whatever
//the player queued while it played.
//
//NOT WHILE A CARD IS HELD. The repaint rebuilds the hand, which would destroy the held card and its
//pointer capture mid-drag -- possible now that a card can be picked up during a replay. It waits for the
//release instead (flushDeferredAfterBeat, from onPointerUp).
honeycomb.combatScene.afterBeat = function () {
	if (honeycomb.combatScene.dragCardId != null) {
		honeycomb.combatScene.afterBeatDeferred = true;
		return;
	}
	honeycomb.combatScene.afterBeatDeferred = false;
	honeycomb.combatScene.repaint();
	if (honeycomb.combatScene.checkCombatOver() == true) {
		honeycomb.combatScene.inputQueue = [];
		honeycomb.combatScene.renderPlayQueue();
		return;
	}
	honeycomb.combatScene.drainInputQueue();
};

honeycomb.combatScene.flushDeferredAfterBeat = function () {
	if (honeycomb.combatScene.afterBeatDeferred != true || honeycomb.combatScene.busy == true) return;
	honeycomb.combatScene.afterBeat();
};

//---------------------------------------------------------------------------------------------------
//Queued input
//---------------------------------------------------------------------------------------------------
//Playing a card or hitting end turn during an animation must not silently fail or double-apply, so
//both queue instead: the worst case is a card returning to hand saying it could not be afforded.
//
//The engine's state is FINAL before a replay starts, so what a queued play will do is already knowable:
//a play is checked the moment it is released, by dry-running every play already queued and then this one
//(queuedPlayRefusal). A play that would be refused is refused THEN, with its reason, and the card goes
//back to the hand -- never later, out of nowhere. What passes is queued and carried out, in order, once
//the replay's closing repaint has run (afterBeat). While anything waits, the rest of the replay hurries
//(tuning.animation.queuedInputPace).
//
//Entries: {kind: "play", instanceId, targetId} and {kind: "endTurn"}, which is always the last.
honeycomb.combatScene.inputQueue = [];
honeycomb.combatScene.afterBeatDeferred = false;

//Whether a play or turn end asked for now has to wait: something is animating, a closing repaint is
//owed, or something asked earlier is still waiting.
honeycomb.combatScene.inputMustQueue = function () {
	var state = honeycomb.combatScene;
	return state.busy == true || state.afterBeatDeferred == true || state.inputQueue.length > 0;
};

honeycomb.combatScene.endTurnQueued = function () {
	var queue = honeycomb.combatScene.inputQueue;
	return queue.length > 0 && queue[queue.length - 1].kind == "endTurn";
};

//THE ONE DOOR A PLAYER'S CARD PLAY GOES THROUGH: the drag, a click and a touch tap all come here. Plays at
//once when nothing is in the way, else is checked and queued.
honeycomb.combatScene.requestPlay = function (instanceId, targetId) {
	if (honeycomb.combatScene.inputMustQueue() == false) {
		honeycomb.combatScene.attemptPlay(instanceId, targetId);
		return;
	}
	if (honeycomb.combatScene.endTurnQueued() == true) {
		honeycomb.combatScene.flashMessage(honeycomb.combatScene.refusalText("turnEnding"));
		return;
	}
	var refusal = honeycomb.combatScene.queuedPlayRefusal(instanceId, targetId);
	if (refusal != null) {
		honeycomb.combatScene.flashMessage(honeycomb.combatScene.refusalText(refusal));
		honeycomb.platform.sound("uiBack");
		return;
	}
	honeycomb.combatScene.queueInput({ kind: "play", instanceId: instanceId, targetId: targetId });
};

honeycomb.combatScene.queueInput = function (entry) {
	var state = honeycomb.combatScene;
	if (entry.kind == "endTurn" && state.endTurnQueued() == true) return;
	state.inputQueue.push(entry);
	state.showQueuedInput();
	honeycomb.platform.sound("inputQueued");
	//A repaint owed with nothing animating is paid now, which carries out what was just queued.
	state.flushDeferredAfterBeat();
};

//Why a play released now would be refused once everything queued ahead of it has happened, or null when
//it would go through. A play that stops to ask a question counts as going through: it asks when its turn
//comes. Dry-run, so the world, the RNG counters included, is put back exactly as it was.
honeycomb.combatScene.queuedPlayRefusal = function (instanceId, targetId) {
	var refusal = null;
	var queue = honeycomb.combatScene.inputQueue;
	var ran = honeycomb.forecast == null ? null : honeycomb.forecast.dryRunLog(function () {
		for (var queueIndex = 0; queueIndex < queue.length; queueIndex++) {
			if (queue[queueIndex].kind != "play") continue;
			honeycomb.combat.playCard(queue[queueIndex].instanceId, queue[queueIndex].targetId);
		}
		var result = honeycomb.combat.playCard(instanceId, targetId);
		if (result.played != true && result.reason != "needsChoice") refusal = result.reason;
		return [];
	});
	//No sandbox to check in (a forecast already running): let the play queue, and the real attempt says
	//why if it fails.
	return ran == null ? null : refusal;
};

//Marks what is waiting: each queued card leaves the hand for the queue rail, and the End Turn button
//is held down once a turn end is queued. A repaint re-marks both from the queue, which is why the rail
//survives the hand bar being rebuilt underneath it.
honeycomb.combatScene.showQueuedInput = function () {
	var queue = honeycomb.combatScene.inputQueue;
	for (var queueIndex = 0; queueIndex < queue.length; queueIndex++) {
		if (queue[queueIndex].kind != "play") continue;
		var slot = honeycomb.combatScene.handSlotFor(queue[queueIndex].instanceId);
		if (slot != null) slot.classList.add("hcQueuedSlot");
	}
	honeycomb.combatScene.renderPlayQueue();
	var endTurn = document.getElementById("honeycombEndTurn");
	if (endTurn != null) endTurn.classList.toggle("hcEndTurnQueued", honeycomb.combatScene.endTurnQueued());
	honeycomb.combatScene.refreshShelfState();
};

//--- The play queue rail --------------------------------------------------------------------------
//Cards played from hand physically leave the hand and float near the center of the screen, to
//represent the queue of cards being played. The gold ring the hand card used to
//wear said the press had been taken, but not that the card was WAITING -- and it left the card in the
//hand, where it read as still playable. Each waiting card now stands over the middle of the
//battlefield in the order it will be played, and its hand slot keeps its place in the fan while the
//card face is gone from it, so nothing re-fans until the card is actually spent.
//
//The rail lives in the root, not in the hand bar, so a repaint that rebuilds the bar leaves it alone.
honeycomb.combatScene.playQueueElement = function (create) {
	var element = document.getElementById(honeycomb.tuning.dom.playQueueId);
	if (element != null || create != true) return element;
	var host = honeycomb.rootElement();
	if (host == null) return null;
	element = document.createElement("div");
	element.id = honeycomb.tuning.dom.playQueueId;
	element.className = "hcPlayQueue";
	host.appendChild(element);
	return element;
};

//The rectangle one waiting card occupies, by its place in the queue. Measured off the battlefield so
//the row sits over the fight rather than over the hand, at whatever size the screen is.
honeycomb.combatScene.playQueueBox = function (position, count) {
	var layout = honeycomb.tuning.layout.playQueue;
	var field = document.getElementById("honeycombBattlefield");
	if (field == null) return null;
	var fieldBox = field.getBoundingClientRect();
	if (fieldBox.height === 0) return null;
	var height = fieldBox.height * layout.cardHeightFraction;
	var width = height * honeycomb.tuning.art.cardFrame.aspect;
	var step = width * (1 + layout.gapFraction);
	var rowWidth = count <= 0 ? 0 : width + step * (count - 1);
	var left = fieldBox.left + (fieldBox.width - rowWidth) / 2 + step * position;
	return {
		left: left,
		top: fieldBox.bottom - fieldBox.height * layout.bottomFraction - height,
		width: width,
		height: height,
	};
};

//Draws one element per waiting play, reusing the ones already standing so a card that was already
//waiting does not flicker when another joins the queue behind it.
honeycomb.combatScene.renderPlayQueue = function () {
	var queue = honeycomb.combatScene.inputQueue;
	var waitingArray = [];
	for (var queueIndex = 0; queueIndex < queue.length; queueIndex++) {
		if (queue[queueIndex].kind == "play") waitingArray.push(queue[queueIndex].instanceId);
	}
	var rail = honeycomb.combatScene.playQueueElement(waitingArray.length > 0);
	if (rail == null) return;
	if (waitingArray.length === 0) { rail.innerHTML = ""; return; }

	var keptMap = {};
	var existingArray = rail.getElementsByClassName("hcPlayQueueCard");
	for (var existingIndex = existingArray.length - 1; existingIndex >= 0; existingIndex--) {
		var existing = existingArray[existingIndex];
		if (waitingArray.indexOf(existing.dataset.hcqueuefor) >= 0) keptMap[existing.dataset.hcqueuefor] = existing;
		else existing.remove();
	}

	for (var position = 0; position < waitingArray.length; position++) {
		var instanceId = waitingArray[position];
		var box = honeycomb.combatScene.playQueueBox(position, waitingArray.length);
		if (box == null) continue;
		var element = keptMap[instanceId];
		if (element == null) {
			var resolved = honeycomb.combat.resolveById(instanceId);
			if (resolved == null) continue;
			element = document.createElement("div");
			element.className = "hcPlayQueueCard";
			element.dataset.hcQueueFor = instanceId;
			element.innerHTML = honeycomb.ui.card(resolved, { size: "medium", showTooltip: false, showAffinity: false }) +
				'<div class="hcPlayQueueOrder">' + (position + 1) + "</div>";
			rail.appendChild(element);
		} else {
			var order = element.getElementsByClassName("hcPlayQueueOrder")[0];
			if (order != null) order.textContent = String(position + 1);
		}
		element.style.left = Math.round(box.left) + "px";
		element.style.top = Math.round(box.top) + "px";
		element.style.width = Math.round(box.width) + "px";
		element.style.height = Math.round(box.height) + "px";
	}
};

//Where a waiting card is standing, so its flight starts from the rail rather than from the hand slot
//it has visibly left. Null when the card is not waiting.
honeycomb.combatScene.playQueueBoxFor = function (cardInstanceId) {
	var rail = honeycomb.combatScene.playQueueElement(false);
	if (rail == null || cardInstanceId == null) return null;
	var cardArray = rail.getElementsByClassName("hcPlayQueueCard");
	for (var cardIndex = 0; cardIndex < cardArray.length; cardIndex++) {
		if (cardArray[cardIndex].dataset.hcqueuefor != cardInstanceId) continue;
		var box = cardArray[cardIndex].getBoundingClientRect();
		return box.width === 0 ? null : box;
	}
	return null;
};

//Carries out the queue in order. A play that is refused after all (it should not be; see
//queuedPlayRefusal) says why and the next entry is tried. A play that starts a replay stops the drain;
//that replay's own afterBeat resumes it. So does a question the play asks, answered or cancelled.
honeycomb.combatScene.drainInputQueue = function () {
	var state = honeycomb.combatScene;
	while (state.inputQueue.length > 0 && state.busy != true) {
		if (honeycomb.overlay.isOpen("choice") == true) return;
		var entry = state.inputQueue.shift();
		if (entry.kind == "endTurn") {
			state.onEndTurn();
			return;
		}
		//Re-drawn BEFORE the play, so the card being played is already off the rail and the ones still
		//waiting have closed up behind it.
		state.showQueuedInput();
		state.attemptPlay(entry.instanceId, entry.targetId);
	}
};

honeycomb.combatScene.checkCombatOver = function () {
	var combat = honeycomb.state.run.combat;
	if (combat == null) return false;
	if (combat.phase == "victory") {
		//The combat track plays "until victory or defeat", not until the scene is left
		if (honeycomb.music != null) honeycomb.music.onEvent("combatEnded");
		//Honeycomb's own stinger for winning a battle.
		honeycomb.platform.sound("victoryBattle");
		honeycomb.overlay.open("victory", {});
		return true;
	}
	if (combat.phase == "defeat") {
		if (honeycomb.music != null) honeycomb.music.onEvent("combatEnded");
		honeycomb.platform.sound("defeat");
		honeycomb.overlay.open("defeat", {});
		return true;
	}
	return false;
};

//HOVER CARRIED ACROSS A REPAINT. `:hover` belongs to an element, and a repaint replaces the element: the
//new one cannot have been entered by a pointer that never moved, so every `:hover` look drops for the
//frames it takes the browser to notice, then comes back. On the hand that is the bounce; on a party
//member it is the depth-focus step forward collapsing and regrowing.
//The old element is asked whether it was hovered before it is thrown away, and the new one wears a
//class the stylesheet treats as `:hover`.
//
//A CARRIED MARK COUNTS AS HOVERED TOO. The first version asked `:hover` alone, and TWO repaints inside
//one frame lost it: the second found a hand that was marked but not yet `:hover`, and carried nothing
//(before {hover}, after one {carried}, after two {neither}). Both selectors below
//ask for either.
//
//THE MARK LASTS UNTIL THE POINTER NEXT MOVES. A real move makes the browser work `:hover` out again
//before the event is dispatched, so from then on `:hover` is the truth and the mark is dropped -- which
//is also what keeps a mark from outliving a pointer that has gone. No position is tracked and nothing
//is measured, so the carry costs a repaint no layout.
honeycomb.combatScene.carriedHover = {
	handClass: "hcHandRaised",
	fighterClass: "hcHoverCarried",
	handSelector: ".hcHand:hover, .hcHand.hcHandRaised",
	fighterSelector: ".hcFighter:hover, .hcFighter.hcHoverCarried",
	active: false,
	mark: function (element, classField) {
		if (element == null) return;
		element.classList.add(honeycomb.combatScene.carriedHover[classField]);
		honeycomb.combatScene.carriedHover.active = true;
	},
	//The scene shell's pointermove. Runs on every move, so the common case is one comparison.
	release: function () {
		var carried = honeycomb.combatScene.carriedHover;
		if (carried.active != true) return;
		carried.active = false;
		var root = honeycomb.rootElement();
		if (root == null) return;
		var classArray = [carried.handClass, carried.fighterClass];
		for (var classIndex = 0; classIndex < classArray.length; classIndex++) {
			var markedArray = root.querySelectorAll("." + classArray[classIndex]);
			for (var markedIndex = 0; markedIndex < markedArray.length; markedIndex++) markedArray[markedIndex].classList.remove(classArray[classIndex]);
		}
	},
};

//Repaints the board and the hand from current state, leaving the scene shell alone so nothing that is
//mid-transition is destroyed.
honeycomb.combatScene.repaint = function () {
	var root = honeycomb.rootElement();
	if (root == null) return;

	//Every forecast answers a question about the board as it stood, so a repaint is exactly when they
	//all expire. Recomputing FIRST -- and re-reading run afterwards -- matters: refreshStanding runs
	//a dry turn and rolls it back, which REPLACES honeycomb.state.
	if (honeycomb.forecast != null) honeycomb.forecast.refreshStanding();
	//A tooltip is anchored to an element this repaint is about to destroy. Left alone it survives its
	//anchor and strands itself in a corner of the screen.
	if (honeycomb.tooltip != null) honeycomb.tooltip.hide();
	//A Lewd card still being read is read again against the new board, BEFORE `run` is read below: it
	//is a forecast too, and replaces honeycomb.state. The bars drawn next pick it up; its panels are hung
	//once the fighters exist.
	honeycomb.combatScene.applyLustInspection(false);

	var run = honeycomb.state.run;
	if (run == null || run.combat == null) return;
	//The piles are about to be drawn with their true numbers; see handMotion.epoch.
	honeycomb.combatScene.handMotion.epoch += 1;
	//And so are the bars; see shownVitalsArray.
	honeycomb.combatScene.syncShownVitals();

	var battlefield = document.getElementById("honeycombBattlefield");
	if (battlefield != null) {
		//Asked BEFORE the fighters are thrown away; see carriedHover.
		var hoveredFighter = battlefield.querySelector(honeycomb.combatScene.carriedHover.fighterSelector);
		var hoveredFighterId = hoveredFighter == null ? null : hoveredFighter.id;
		battlefield.innerHTML = honeycomb.combatScene.renderBackdropProps(run.combat) +
			honeycomb.combatScene.renderSide("ally", run.partyArray) +
			honeycomb.combatScene.renderSide("enemy", run.combat.enemyArray) +
			//The lab's badge is part of the battlefield, so a repaint has to put it back with the rest.
			(honeycomb.lab == null ? "" : honeycomb.lab.badgeMarkup());
		honeycomb.combatScene.renderLustPeeks();
		//A pose mid-hold goes back onto the fighters just rebuilt (see heldPoseMap).
		honeycomb.combatScene.restoreHeldPoses();
		honeycomb.combatScene.carriedHover.mark(hoveredFighterId == null ? null : document.getElementById(hoveredFighterId), "fighterClass");
	}

	//The hand bar is replaced wholesale, so drag handlers must be reattached to the new elements.
	//
	//The pointer's presence is carried across the rebuild, or the hand would open and close over and
	//over. Whether the hand is up is a `:hover` rule, and a brand-new element cannot have
	//been entered -- so the moment a replay's closing repaint lands, the hand sinks under a pointer
	//that never moved, and springs back up on the next twitch. Asking the OLD bar whether it was
	//hovered, before it is thrown away, and marking the new one, holds the hand still.
	//A hand ALREADY CARRYING the mark counts as hovered; see carriedHover for the repaint pair that lost it.
	var handBar = root.getElementsByClassName("hcHandBar")[0];
	if (handBar != null) {
		var pointerWasOverHand = handBar.querySelector(honeycomb.combatScene.carriedHover.handSelector) != null;
		handBar.outerHTML = honeycomb.combatScene.renderHandBar();
		if (pointerWasOverHand) honeycomb.combatScene.carriedHover.mark(document.getElementById("honeycombHand"), "handClass");
		//The bar is new, so the fan has to be fitted to it again before anything is measured against it.
		honeycomb.combatScene.fitHandFan(null);
		honeycomb.combatScene.attachDragHandlers();
	}
	//The new hand knows nothing about what is still waiting, and the rail's cards need repositioning
	//against a battlefield that has just been redrawn.
	honeycomb.combatScene.showQueuedInput();

	var topBar = root.getElementsByClassName("hcTopBar")[0];
	if (topBar != null) topBar.outerHTML = honeycomb.ui.topBar({ showExit: true, showParty: true, subtitle: "Turn " + run.combat.turnNumber });
};

//---------------------------------------------------------------------------------------------------
//Log replay
//---------------------------------------------------------------------------------------------------
//HOW LONG ONE BEAT WAITS. A log entry that belongs to another beat names a `pace`
//(tuning.animation.beatPaceMsMap) and waits that instead of what its own type would ask for -- poison's
//stack decay inside its own tick. Everything else waits the duration its handler worked out.
honeycomb.combatScene.beatWaitMs = function (entry, defaultMs) {
	var map = honeycomb.tuning.animation.beatPaceMsMap;
	if (entry == null || entry.pace == null || map == null || map[entry.pace] == null) return defaultMs;
	return map[entry.pace];
};


//Walks the engine's log one entry at a time, playing each as a timed beat. State is already final, so
//this is presentation only: skipping it entirely would leave the game correct, just abrupt.
//A REPLAY DRAWS EACH PIECE IN THE SHAPE IT HAD AT THAT BEAT. The engine resolves a whole turn before the
//replay starts, so a piece promoted or inverted late in the turn would otherwise be drawn in its new shape
//by any earlier repaint. Display only: the state is never touched, so forecasts and saves read the truth.
//  shownShapeMap   instanceId -> the enemy index to draw, for pieces whose change has not played yet
//  shapeQueueMap   instanceId -> the shape-change entries still to play for it, in order
honeycomb.combatScene.shownShapeMap = {};
honeycomb.combatScene.shapeQueueMap = {};

honeycomb.combatScene.readShapeChanges = function (logArray) {
	var shownMap = {}, queueMap = {};
	for (var scanIndex = 0; scanIndex < (logArray == null ? 0 : logArray.length); scanIndex++) {
		var entry = logArray[scanIndex];
		if (entry == null || (entry.type != "entityPromoted" && entry.type != "entityRaised") || entry.fromEnemy == null) continue;
		if (queueMap[entry.targetId] == null) { queueMap[entry.targetId] = []; shownMap[entry.targetId] = entry.fromEnemy; }
		queueMap[entry.targetId].push(entry);
	}
	honeycomb.combatScene.shownShapeMap = shownMap;
	honeycomb.combatScene.shapeQueueMap = queueMap;
};

//A shape-change beat has played: the piece is drawn as that change left it, or as the next change starts.
honeycomb.combatScene.revealShape = function (entry) {
	if (entry == null) return;
	var queueArray = honeycomb.combatScene.shapeQueueMap[entry.targetId];
	if (queueArray != null && queueArray.length > 0) queueArray.shift();
	if (queueArray != null && queueArray.length > 0) honeycomb.combatScene.shownShapeMap[entry.targetId] = queueArray[0].fromEnemy;
	else delete honeycomb.combatScene.shownShapeMap[entry.targetId];
};

//The fighter as the replay should draw it: a copy wearing its earlier shape, or the fighter itself.
honeycomb.combatScene.shownEntity = function (entity) {
	var shown = entity == null ? null : honeycomb.combatScene.shownShapeMap[entity.instanceId];
	if (shown == null || shown == entity.enemyIndex) return entity;
	var copy = {};
	for (var field in entity) {
		if (Object.prototype.hasOwnProperty.call(entity, field)) copy[field] = entity[field];
	}
	copy.enemyIndex = shown;
	return copy;
};

honeycomb.combatScene.playLog = function (logArray, onComplete, label) {
	honeycomb.combatScene.busy = true;
	honeycomb.combatScene.readShapeChanges(logArray);
	//The hand hint is only for an idle board; the root carries the state so the stylesheet can
	//hide it without measuring anything.
	var busyRoot = honeycomb.rootElement();
	if (busyRoot != null) busyRoot.classList.add("hcBusy");
	//A replay owns the bars. Whatever card was being read has been played, or the board it was read
	//against is about to change under it.
	honeycomb.combatScene.lustInspectRequest = null;
	honeycomb.combatScene.applyLustInspection(false);
	var position = 0;
	//The perf monitor's clock: what the beats asked for, against what the browser took.
	var perfActive = honeycomb.perf != null && honeycomb.perf.enabled == true;
	var perfStart = perfActive ? honeycomb.perf.now() : 0;
	var perfExpected = 0;

	function finish() {
		honeycomb.combatScene.shownShapeMap = {};
		honeycomb.combatScene.handMotion.createdShown = 0;
		honeycomb.combatScene.busy = false;
		if (busyRoot != null) busyRoot.classList.remove("hcBusy");
		if (perfActive) {
			honeycomb.perf.recordReplay(label == null ? "log(" + (logArray == null ? 0 : logArray.length) + ")" : label,
				perfExpected, honeycomb.perf.now() - perfStart);
		}
		if (typeof onComplete === "function") onComplete();
	}

	function step() {
		//Consume entries until one of them actually takes time, so a run of bookkeeping entries does
		//not cost a frame each.
		while (position < logArray.length) {
			var entry = logArray[position];
			position += 1;
			var delay = honeycomb.combatScene.playLogEntry(entry);
			if (delay > 0) {
				var waitMs = honeycomb.duration(delay * honeycomb.combatScene.queuedPaceFor(entry));
				if (perfActive) perfExpected += waitMs;
				setTimeout(step, waitMs);
				return;
			}
		}
		//A beat may keep moving after the replay has moved on -- the last card still flying to the
		//discard. The board is handed back, and repainted, only once all of it has landed; repainting
		//first would snap the card to its end. The remainder is real time already: every movement was
		//timed through honeycomb.duration when it started.
		var settle = honeycomb.combatScene.motionRemaining();
		if (settle > 0) {
			if (perfActive) perfExpected += settle;
			setTimeout(finish, settle);
			return;
		}
		finish();
	}
	step();
};

//The share of an entry's wait that is kept while input is queued behind the replay: all of it when nothing
//is, and for the cut-ins, whose holds are paced by hand. See tuning.animation.queuedInputPace.
honeycomb.combatScene.queuedPaceFor = function (entry) {
	var animation = honeycomb.tuning.animation;
	if (honeycomb.combatScene.inputQueue.length === 0) return 1;
	if (animation.queuedInputPaceExemptTypeArray.indexOf(entry.type) >= 0) return 1;
	return animation.queuedInputPace;
};

//Plays one log entry. Returns how long to wait before the next, in milliseconds; zero means the entry
//is instantaneous. Adding a new log type is one entry in this table.
honeycomb.combatScene.logHandlerArray = [
	{
		index: "damage",
		play: function (entry) {
			var animation = honeycomb.tuning.animation;
			//The attacker's pose is NOT played here. A card that deals damage several times would
			//restart the swing on every hit, and a card that damages without being an attack would
			//swing anyway. The cardPlayed and enemyAction entries own the actor's pose.
			honeycomb.combatScene.playHitReaction(entry.targetId);
			var isPoison = entry.damageType == "poison";
			var text = entry.amount > 0 ? String(entry.amount) : honeycomb.combatScene.absorbedText;
			honeycomb.combatScene.floatNumber(entry.targetId, text,
				entry.amount > 0 ? (isPoison ? "hcPoisonNumber" : "hcDamageNumber") : "hcTemporaryNumber");
			//Measured BEFORE the readout is redrawn, so the shake reads the hit rather than the
			//aftermath, and so the trail still has the old width to start from.
			var extraHold = honeycomb.combatScene.shakeForDamage(entry.targetId, entry.amount);
			honeycomb.combatScene.updateVitals(entry.targetId, { health: -entry.amount, temporaryHealth: -(entry.absorbed == null ? 0 : entry.absorbed) });
			//A tested mechanic (Severine's orbs) can turn on any hit, on either side, and has no log entry
			//of its own to redraw it.
			honeycomb.combatScene.refreshMechanics();
			//WHAT THE HIT SOUNDS LIKE, by its damageType (tuning.audio.damageTypeSoundMap). A card's own
			//hit carries no type and is silent here: the card played its sound a beat ago, and a second
			//generic sound over it is what made a necrotic touch clang.
			var damageSound = honeycomb.tuning.audio.damageTypeSoundMap[entry.damageType];
			if (damageSound != null) honeycomb.platform.sound(damageSound);
			//The attack's VFX, over the target. An effect may name its own, or "none"; an
			//ordinary attack from a source takes tuning's default. A damageType (poison, thorns, the
			//broken spiral) is not an attack and gets nothing.
			var vfxPath = entry.vfx == null ? null : entry.vfx;
			if (vfxPath == null && entry.sourceId != null && entry.amount > 0 && entry.damageType == null) {
				vfxPath = honeycomb.tuning.vfx.defaultAttackPath;
			}
			if (vfxPath != null) honeycomb.combatScene.playVfx(entry.targetId, vfxPath);
			//THE BROKEN SPIRAL IS INSTANT: its health loss costs no wait,
			//so it lands as the turn ends rather than ticking like poison. Its number and shake still
			//play; the replay simply moves straight on to the lust that accompanies it.
			if (honeycomb.tuning.lust.brokenEscalationInstant == true && entry.damageType == "broken") return 0;
			//POISON'S BARRAGE IS RAPID-FIRE: each tick is its own impact moment, and the
			//line pops one after another at this shorter pace rather than a full hit flash apiece.
			if (entry.damageType == "poison") return animation.poisonTickMs;
			return animation.hitFlashMs + extraHold;
		},
	},
	{
		//Temporary HP halving at a turn's start: the gold simply shrinks by half.
		//The tooltip on the gold number answers it in words; this is the other half -- the phase is now
		//SEEN rather than inferred from a number that quietly got smaller. A gold minus and the word
		//HALVED over the bar, at the moment it goes.
		index: "temporaryDecayed",
		play: function (entry) {
			honeycomb.combatScene.floatNumber(entry.targetId,
				"−" + entry.amount + " HALVED", "hcTemporaryNumber hcTemporaryDecayNumber");
			honeycomb.combatScene.updateVitals(entry.targetId, { temporaryHealth: -entry.amount });
			return honeycomb.tuning.animation.hitFlashMs;
		},
	},
	{
		//Whose turn it is, said out loud. The handover used to be visible only as the board starting
		//to move on its own, which is the moment a player most needs telling what is happening.
		index: "turnStart",
		play: function (entry) {
			var banner = honeycomb.findDefinition(honeycomb.combatScene.turnBannerArray, entry.side);
			if (banner == null) return 0;
			honeycomb.combatScene.showTurnBanner(banner);
			//The replay waits for a fraction of the banner's life, not all of it. The banner keeps
			//playing over whatever happens next, which is what stops a handover costing a full second
			//of a board nobody is allowed to touch.
			return honeycomb.tuning.animation.turnBannerHoldMs;
		},
	},
	{
		index: "heal",
		play: function (entry) {
			honeycomb.combatScene.floatNumber(entry.targetId, "+" + entry.amount, "hcHealNumber");
			honeycomb.combatScene.updateVitals(entry.targetId, { health: entry.amount });
			//A sound of its own rather than silence.
			honeycomb.platform.sound("healed");
			return honeycomb.tuning.animation.hitFlashMs;
		},
	},
	{
		index: "temporaryHealth",
		play: function (entry) {
			honeycomb.combatScene.floatNumber(entry.targetId, "+" + entry.amount, "hcTemporaryNumber");
			honeycomb.combatScene.updateVitals(entry.targetId, { temporaryHealth: entry.amount });
			honeycomb.platform.sound("temporaryGained");
			return honeycomb.tuning.animation.hitFlashMs;
		},
	},
	{
		//Gold stripped off rather than spent. Its own beat so it reads as an attack on the wall, which
		//is what it is -- see the Hollow Knight's Strip.
		index: "temporaryRemoved",
		play: function (entry) {
			honeycomb.combatScene.floatNumber(entry.targetId, "\u2212" + entry.amount, "hcTemporaryNumber");
			honeycomb.combatScene.updateVitals(entry.targetId, { temporaryHealth: -entry.amount });
			return honeycomb.tuning.animation.hitFlashMs;
		},
	},
	{
		//LUST ARRIVING. Reads like damage on purpose -- it is the other road to being taken out of the
		//fight -- but in the bar's own magenta rather than red, and with no hit reaction, because it is
		//not a blow.
		index: "lust",
		play: function (entry) {
			honeycomb.combatScene.floatNumber(entry.targetId, "+" + entry.amount, "hcLustNumber");
			honeycomb.combatScene.updateVitals(entry.targetId, { lust: entry.amount });
			honeycomb.platform.sound("lustGained");
			//The broken spiral's own lust is instant, matching its health loss above.
			if (honeycomb.tuning.lust.brokenEscalationInstant == true && entry.damageType == "broken") return 0;
			return honeycomb.combatScene.beatWaitMs(entry, honeycomb.tuning.animation.hitFlashMs);
		},
	},
	{
		index: "lustReduced",
		play: function (entry) {
			honeycomb.combatScene.floatNumber(entry.targetId, "\u2212" + entry.amount, "hcSootheNumber");
			honeycomb.combatScene.updateVitals(entry.targetId, { lust: -entry.amount });
			return honeycomb.tuning.animation.hitFlashMs;
		},
	},
	{
		//The broken spiral's tick. No float of its own: the damage and lust entries it produces each
		//float their own number, and three numbers for one event is noise. This is only the beat that
		//gives them room -- and it gives none when the spiral is instant.
		index: "brokenEscalation",
		play: function () {
			if (honeycomb.tuning.lust.brokenEscalationInstant == true) return 0;
			return honeycomb.tuning.animation.hitFlashMs;
		},
	},
	{
		//!!BROKEN!! -- the cut-in. THE REPLAY WAITS FOR IT: the whole point is that the flow of combat
		//stops for a moment, and it can happen on either team's turn, so it is an ordinary log beat
		//rather than anything the turn structure has to know about.
		index: "broken",
		play: function (entry) {
			var fighter = honeycomb.combatScene.fighterElement(entry.targetId);
			if (fighter != null) fighter.classList.add("hcBrokenFighter");
			honeycomb.combatScene.updateVitals(entry.targetId, { broken: true });
			//THE STINGER BELONGS TO THE CUT-IN, or the old `broke` beat plays the host sleep stem UNDER the
			//cut-in's own file, so both are heard. `brokenOverlay.play`
			//plays `!broken`, delayed to the chain snap.
			return honeycomb.brokenOverlay == null ? 0 : honeycomb.brokenOverlay.play(entry);
		},
	},
	{
		//And the way back out. Faster, as asked, and it clears the drained look from the sprite.
		index: "recovered",
		play: function (entry) {
			var fighter = honeycomb.combatScene.fighterElement(entry.targetId);
			if (fighter != null) fighter.classList.remove("hcBrokenFighter");
			honeycomb.combatScene.updateVitals(entry.targetId, { broken: false });
			honeycomb.platform.sound("recovered");
			return honeycomb.recoverOverlay == null ? 0 : honeycomb.recoverOverlay.play(entry);
		},
	},
	{
		//THE HALF-HEALTH CUT-IN: the first time a character in this fight
		//falls to half health, their hurt sprite steps forward for a beat. THE REPLAY WAITS FOR IT, like
		//the break, because the moment is the point.
		index: "lowHealth",
		play: function (entry) {
			return honeycomb.halfHealthOverlay == null ? 0 : honeycomb.halfHealthOverlay.play(entry);
		},
	},
	{
		//A weakness rank crossed. The only thing in the game that changes a
		//character PERMANENTLY in the middle of a fight, and until now it happened in silence. THE
		//REPLAY WAITS FOR IT, like the break does, because the player has to be given the chance to
		//read it; a second rank crossed by the same attack queues behind the first rather than opening
		//on top of it.
		index: "lustRank",
		play: function (entry) {
			return honeycomb.weaknessOverlay == null ? 0 : honeycomb.weaknessOverlay.play(entry);
		},
	},
	{
		//A break that was refused, debug builds only. Said out loud because the
		//silent version is how a debug break on somebody who had just recovered looked like a bug in
		//the card swap rather than the rule it is.
		index: "breakRefused",
		play: function (entry) {
			honeycomb.combatScene.flashMessage("Break refused: " + (entry.reason == "recoveredThisTurn"
				? "they recovered this turn" : entry.reason));
			return honeycomb.tuning.animation.hitFlashMs;
		},
	},
	{
		index: "status",
		play: function (entry) {
			honeycomb.combatScene.updateVitals(entry.targetId);
			honeycomb.combatScene.pulseStatus(entry.targetId, entry.status);
			//The pulse still plays; a barrage-paced change simply costs the replay no wait of its own.
			return honeycomb.combatScene.beatWaitMs(entry, honeycomb.tuning.animation.statusPulseMs);
		},
	},
	{
		//A character's own meter moving (Resolve, Harvest). Redrawn where it stands and pulsed, so a
		//gain is noticed on a plate nobody was watching.
		index: "mechanic",
		play: function (entry) {
			honeycomb.combatScene.refreshMechanic(entry.targetId);
			return honeycomb.tuning.animation.mechanicMoveMs;
		},
	},
	{
		index: "statusRemoved",
		play: function (entry) { honeycomb.combatScene.updateVitals(entry.targetId); return 0; },
	},
	{
		index: "statusBlocked",
		play: function (entry) {
			honeycomb.combatScene.floatNumber(entry.targetId, "Resisted", "hcResistNumber");
			return honeycomb.tuning.animation.hitFlashMs;
		},
	},
	{
		index: "downed",
		play: function (entry) {
			var fighter = honeycomb.combatScene.fighterElement(entry.targetId);
			if (fighter != null) fighter.classList.add("hcDowned");
			//THE CARD GOES WITH THEM. A downed combatant's telegraphed move is not
			//going to happen, so it leaves at the moment they fall rather than lingering until the next
			//repaint sweeps it -- which is what made it look like the card was going somewhere.
			var slot = document.getElementById("honeycombIntent-" + entry.targetId);
			if (slot != null) slot.classList.add("hcIntentGone");
			honeycomb.platform.sound(entry.side == "enemy" ? "enemyDefeated" : "allyDowned");
			return honeycomb.tuning.animation.elementTravelMs;
		},
	},
	{
		index: "cardPlayed",
		play: function (entry) {
			//HOW A CARD LOOKS belongs to the card: its own pose and flourishes, or its type's defaults --
			//Offense swings and lunges, Support gestures, a Power rises. See honeycomb.art.cardPresentation.
			var resolved = honeycomb.combat.resolveById(entry.cardId);
			honeycomb.combatScene.playPresentation(honeycomb.art.cardPresentation(resolved), entry.sourceId, entry.targetId);

			//The card no longer flies at the target. That flight crossed
			//the board and covered the attack's VFX, which now says where the hit landed. The card still
			//leaves the fan when its destination entry plays (cardToDiscard / cardExhausted / ...), which
			//animates it hand-to-pile without crossing the enemy. Consume the origin so it does not leak
			//into a later play's flight.
			honeycomb.combatScene.flightOrigin = null;
			return 0;
		},
	},
	//--- Cards moving between piles: the hand motion section says how each is shown. ---
	{
		//The played card, spent, goes on to the discard from wherever its flight ended.
		index: "cardToDiscard",
		play: function (entry) { return honeycomb.combatScene.playSpentCard(entry, "discardPileArray"); },
	},
	{
		//The end-of-turn sweep, a card that discards, or something moved there from another pile.
		index: "cardDiscarded",
		play: function (entry) { return honeycomb.combatScene.playCardMove(entry, "discardPileArray", "handArray"); },
	},
	{
		//Drawn with the hand already full: straight from the draw pile to the discard.
		index: "cardBurned",
		play: function (entry) { return honeycomb.combatScene.playCardMove(entry, "discardPileArray", "drawPileArray"); },
	},
	{
		index: "cardToDrawPile",
		play: function (entry) { return honeycomb.combatScene.playCardMove(entry, "drawPileArray", "discardPileArray"); },
	},
	{
		index: "cardExhausted",
		play: function (entry) {
			if (entry.reason == "played") return honeycomb.combatScene.playSpentCard(entry, "exhaustPileArray");
			return honeycomb.combatScene.playCardMove(entry, "exhaustPileArray", "handArray");
		},
	},
	{
		index: "cardToHand",
		play: function (entry) { return honeycomb.combatScene.playCardArrival(entry, entry.fromPileArray); },
	},
	{
		index: "cardCreated",
		play: function (entry) { return honeycomb.combatScene.showCreatedCard(entry); },
	},
	{
		//Somebody moved through their side's order. The one beat that rearranges the board itself.
		index: "partyOrder",
		play: function (entry) { return honeycomb.combatScene.playPartyShift(entry); },
	},
	{
		index: "enemySummoned",
		play: function () {
			//The newcomer does not exist in the DOM yet, so the board is rebuilt before the beat is
			//held. Everything else in the replay animates an element that is already there; a summon
			//is the one case that has to create one.
			honeycomb.combatScene.repaint();
			honeycomb.platform.sound("enemySummoned");
			return honeycomb.tuning.animation.enemyActionGapMs;
		},
	},
	{
		index: "allySummoned",
		play: function () {
			//The summoner's gesture first, then the body (honeycomb.combatScene.afterCommandLead).
			return honeycomb.combatScene.afterCommandLead(function () {
				honeycomb.combatScene.repaint();
				honeycomb.platform.sound("allySummoned");
			}) + honeycomb.tuning.animation.enemyActionGapMs;
		},
	},
	{
		//A telegraph is changed mid-turn (Anastasia's `setIntent`; Cassadora's verbs log the same entry).
		//`changedFrom` is what tells it from the turn-start telegraph, which the opening repaint
		//already draws. The slot is swapped IN PLACE -- never a repaint, which destroys every fighter element
		//and loses `:hover` -- and wears `hcIntentSwitched` for one flip, so the player sees the order land
		//on the piece it was given to rather than finding it changed after the card has left.
		index: "intent",
		play: function (entry) {
			if (!("changedFrom" in entry)) return 0;
			if (document.getElementById("honeycombIntent-" + entry.targetId) == null) return 0;
			//The snap first, then the piece obeying it (honeycomb.combatScene.afterCommandLead). Everything
			//is looked up when the flip happens, not before: a repaint in between rebuilds the slot.
			return honeycomb.combatScene.afterCommandLead(function () {
				var slot = document.getElementById("honeycombIntent-" + entry.targetId);
				var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
				var entity = combat == null ? null : honeycomb.findEntity(entry.targetId, combat);
				if (slot == null || entity == null) return;
				var holder = document.createElement("div");
				holder.innerHTML = honeycomb.combatScene.renderIntent(entity);
				var fresh = holder.firstElementChild;
				if (fresh == null) return;
				fresh.classList.add("hcIntentSwitched");
				slot.parentNode.replaceChild(fresh, slot);
			}) + honeycomb.tuning.animation.intentSwitchMs;
		},
	},
	{
		//A piece changes shape. The figure, its plate and its telegraph all belong to the new
		//shape, and none of them exists in the DOM yet -- the same reason a summon rebuilds the board. Without
		//this beat a promotion only showed at the closing repaint, after the snap had already finished.
		index: "entityPromoted",
		play: function (entry) {
			return honeycomb.combatScene.afterCommandLead(function () {
				honeycomb.combatScene.revealShape(entry);
				honeycomb.combatScene.repaint();
				honeycomb.platform.sound("allySummoned");
			}) + honeycomb.tuning.animation.enemyActionGapMs;
		},
	},
	{
		//Set dressing arrives (the `showBackdropProp` verb): the board is rebuilt with it behind the row,
		//after the gesture that called it.
		index: "backdropProp",
		play: function () {
			return honeycomb.combatScene.afterCommandLead(function () {
				honeycomb.combatScene.repaint();
				var propArray = document.getElementsByClassName("hcBackdropProp");
				if (propArray.length > 0) propArray[propArray.length - 1].classList.add("hcBackdropPropArriving");
				honeycomb.platform.sound("allySummoned");
			}) + honeycomb.tuning.animation.enemyActionGapMs;
		},
	},
	{
		//A downed piece stands back up (honeycomb.raisePiece): a summon into a place that already exists.
		index: "entityRaised",
		play: function (entry) {
			return honeycomb.combatScene.afterCommandLead(function () {
				honeycomb.combatScene.revealShape(entry);
				honeycomb.combatScene.repaint();
				honeycomb.platform.sound("allySummoned");
			}) + honeycomb.tuning.animation.enemyActionGapMs;
		},
	},
	{
		index: "abilityUsed",
		play: function (entry) {
			//An ability's own pose and flourishes, or a spell's defaults. See abilityPresentationFor.
			var user = entry.sourceId == null ? null : honeycomb.findEntity(entry.sourceId, honeycomb.state.run.combat);
			var definition = honeycomb.abilities.definitionFor(user, entry.ability);
			honeycomb.combatScene.playPresentation(honeycomb.art.abilityPresentationFor(definition), entry.sourceId, entry.targetId);
			return 0;
		},
	},
	{
		//An AI combatant -- on either team -- plays its move.
		index: "moveUsed",
		play: function (entry) {
			//First the card: it leaves the combatant's corner and enlarges where it can
			//be read, so it is clear who is playing what. It LOOKS the way its own fields or its type say,
			//exactly as any card does, because it is one.
			var card = honeycomb.combatScene.moveFor(entry.card, entry.sourceId);
			var presentation = card == null ? null : honeycomb.art.cardPresentation(card);
			var revealMs = honeycomb.combatScene.revealEnemyCard(entry.sourceId, card);
			//Enemy cards have sounds too. The explicit card table covers every move.
			honeycomb.combatScene.playCardSound(card);
			//The read overlaps the animation: the card opens and
			//holds over the board, but the replay does not WAIT for it, so the pose and the hit play out
			//underneath and a turn costs the read no time. Off restores the strict sequence.
			if (honeycomb.tuning.animation.overlapEnemyCardRead == true) {
				honeycomb.combatScene.playPresentation(presentation, entry.sourceId, null);
				return honeycomb.tuning.animation.enemyActionGapMs;
			}
			if (revealMs <= 0) {
				honeycomb.combatScene.playPresentation(presentation, entry.sourceId, null);
				return honeycomb.tuning.animation.enemyActionGapMs;
			}
			setTimeout(function () {
				honeycomb.combatScene.playPresentation(presentation, entry.sourceId, null);
			}, honeycomb.duration(revealMs));
			return revealMs + honeycomb.tuning.animation.enemyActionGapMs;
		},
	},
	{
		index: "cardDrawn",
		play: function (entry) {
			honeycomb.platform.sound("cardDraw");
			return honeycomb.combatScene.playCardArrival(entry, "drawPileArray");
		},
	},
	{
		index: "message",
		play: function (entry) {
			honeycomb.combatScene.flashMessage(entry.text);
			return honeycomb.tuning.animation.floatingNumberMs / 2;
		},
	},
	{
		index: "relicGained",
		play: function (entry) {
			var relic = honeycomb.findDefinition(honeycomb.relicArray, entry.relic);
			honeycomb.combatScene.flashMessage((relic == null ? entry.relic : relic.name) + " acquired.");
			return honeycomb.tuning.animation.floatingNumberMs / 2;
		},
	},
	{
		index: "reshuffle",
		play: function (entry) {
			honeycomb.combatScene.flashMessage("Reshuffling.");
			return honeycomb.combatScene.playReshuffle(entry.count);
		},
	},
	{
		index: "animation",
		play: function (entry) {
			honeycomb.combatScene.playNamedAnimation(entry);
			return honeycomb.tuning.animation.actionFrameHoldMs;
		},
	},
];

honeycomb.combatScene.playLogEntry = function (entry) {
	var handler = honeycomb.findDefinition(honeycomb.combatScene.logHandlerArray, entry.type);
	//Entries with no handler are bookkeeping the player does not need to see; they cost no time.
	if (handler == null) return 0;
	return handler.play(entry);
};

//---------------------------------------------------------------------------------------------------
//Animation primitives
//---------------------------------------------------------------------------------------------------
honeycomb.combatScene.fighterElement = function (entityId) {
	if (entityId == null) return null;
	return document.getElementById("honeycombFighter-" + entityId);
};

//THE TWO-FRAME ANIMATION PRIMITIVE. Swaps a fighter's sprite to a named frame, holds it, and swaps
//back to whatever was showing before. Every animated beat in the game is built on this.
//
//The restore captures the CURRENT src rather than recomputing the idle path, so a fighter whose
//health-state frame changed mid-beat returns to the right pose rather than snapping back to full
//health art. A missing frame file falls through onSpriteError to the base pose, so the beat keeps its
//timing even for a character with only one drawn frame.
//
//THE HOLD BELONGS TO THE SCENE, NOT TO THE ELEMENT. A timer on the fighter's own element, closed over
//its <img>, does not survive a repaint: `innerHTML = render()` destroys both, so a card that summons
//(the `allySummoned` beat repaints, zero milliseconds after `cardPlayed`) would wipe its user's pose
//before a single frame of it was drawn -- every summon and every promotion Anastasia plays would lose
//the snap, which is the one thing her build may not drop. The hold is instead an entry in `heldPoseMap`
//keyed by entity, the revert looks its element up AGAIN when it fires, and
//honeycomb.combatScene.restoreHeldPoses puts a live hold back onto the fresh elements after a repaint.
//`holdMs` overrides the pose's own duration (honeycomb.art.presentationFor).
honeycomb.combatScene.heldPoseMap = {};

honeycomb.combatScene.swapPose = function (entityId, poseIndex, cssClass, holdMs) {
	var fighter = honeycomb.combatScene.fighterElement(entityId);
	if (fighter == null) return;
	var art = fighter.getElementsByClassName("hcFighterArt")[0];
	if (art == null) return;

	var entity = honeycomb.findEntity(entityId, honeycomb.state.run.combat);
	if (entity == null) return;

	//Poses always revert to the resting stance rather than to whatever was showing. Restoring a captured src
	//would re-show a stale health tier or a state that has since changed -- and a second swap landing
	//mid-hold would capture the temporary pose as the thing to restore, stranding the fighter in it.
	var heldMap = honeycomb.combatScene.heldPoseMap;
	if (heldMap[entityId] != null) {
		clearTimeout(heldMap[entityId].timer);
		//The class the earlier hold put on leaves with it, or a hit landing mid-snap strands `hcActing`.
		if (heldMap[entityId].cssClass != null) fighter.classList.remove(heldMap[entityId].cssClass);
	}

	honeycomb.combatScene.applyPose(art, entity, poseIndex);
	if (cssClass != null) fighter.classList.add(cssClass);

	var duration = honeycomb.duration(holdMs == null ? honeycomb.art.poseHold(poseIndex) : holdMs);
	heldMap[entityId] = {
		poseIndex: poseIndex,
		cssClass: cssClass,
		until: Date.now() + duration,
		timer: setTimeout(function () {
			delete heldMap[entityId];
			//Both looked up at revert time: the element may have been rebuilt since, and a fighter who was
			//wounded or poisoned during the beat returns to the correct current pose rather than the one
			//they started it in.
			var liveFighter = honeycomb.combatScene.fighterElement(entityId);
			var liveArt = liveFighter == null ? null : liveFighter.getElementsByClassName("hcFighterArt")[0];
			var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
			var current = combat == null ? null : honeycomb.findEntity(entityId, combat);
			if (liveArt != null && current != null) honeycomb.combatScene.applyPose(liveArt, current, honeycomb.art.restingPose());
			if (liveFighter != null && cssClass != null) liveFighter.classList.remove(cssClass);
		}, duration),
	};
};

//Set dressing behind a side (the `showBackdropProp` verb, Anastasia's King). Drawn FIRST in the
//battlefield and positioned absolutely, so it sits under both rows and takes no part in their layout: it
//cannot crowd a fighter, shrink one or be clicked. Everything about how it looks is CSS (`hcBackdropProp`).
honeycomb.combatScene.renderBackdropProps = function (combat) {
	var propArray = combat == null || combat.backdropPropArray == null ? [] : combat.backdropPropArray;
	var markup = "";
	for (var propIndex = 0; propIndex < propArray.length; propIndex++) {
		var prop = propArray[propIndex];
		var definition = honeycomb.findDefinition(honeycomb.enemyArray, prop.enemy);
		var chain = honeycomb.art.spriteChain({
			side: prop.side, enemyIndex: prop.enemy, health: 1, maxHealth: 1, statusArray: [],
		}, honeycomb.art.restingPose(), { state: null });
		//TWO PROPS ON ONE SIDE STAND APART. Each is placed at its side's edge, so a second one would
		//otherwise land exactly on top of the first -- measured with both of Anastasia's Kings in one fight,
		//both boxes at x10-334. Rare, since one King per rest is the usual ceiling, but a figure hidden
		//exactly behind another figure reads as a drawing error. Each further prop on a side steps inward
		//by its own index; the step is a tuning number, not a literal here.
		var step = propIndex == 0 ? 0 : propIndex * honeycomb.tuning.layout.backdropPropStepPercent;
		markup += '<div class="hcBackdropProp hcBackdropProp-' + (prop.side == "enemy" ? "enemy" : "ally") + '"' +
			(step === 0 ? "" : ' style="--hc-backdrop-prop-step:' + step + '%"') + ">" +
			honeycomb.art.chainTag(chain, { className: "hcBackdropPropArt", alt: definition == null ? "" : definition.name }) +
			"</div>";
	}
	return markup;
};

//Puts every pose still being held back onto the elements a repaint has just rebuilt. See heldPoseMap.
honeycomb.combatScene.restoreHeldPoses = function () {
	var heldMap = honeycomb.combatScene.heldPoseMap;
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (combat == null) return;
	for (var entityId in heldMap) {
		if (!Object.prototype.hasOwnProperty.call(heldMap, entityId)) continue;
		var fighter = honeycomb.combatScene.fighterElement(entityId);
		var art = fighter == null ? null : fighter.getElementsByClassName("hcFighterArt")[0];
		var entity = honeycomb.findEntity(entityId, combat);
		if (art == null || entity == null) continue;
		honeycomb.combatScene.applyPose(art, entity, heldMap[entityId].poseIndex);
		if (heldMap[entityId].cssClass != null) fighter.classList.add(heldMap[entityId].cssClass);
	}
};

//The order, then the board obeying. A beat that changes the board because somebody commanded
//it -- a piece summoned, promoted, raised, its telegraph switched -- waits `commandLeadMs` when a fighter
//is mid-gesture, so the snap is SEEN before the piece appears rather than being drawn in the same frame
//as the thing it caused. Returns how long the beat was put off, for the handler to add to its own time.
honeycomb.combatScene.afterCommandLead = function (action) {
	var acting = false;
	var heldMap = honeycomb.combatScene.heldPoseMap;
	for (var entityId in heldMap) {
		if (Object.prototype.hasOwnProperty.call(heldMap, entityId) && heldMap[entityId].cssClass == "hcActing") acting = true;
	}
	//Returned UNSCALED, as every handler's time is: the replay runs it through honeycomb.duration itself.
	var lead = acting ? honeycomb.tuning.animation.commandLeadMs : 0;
	if (lead <= 0) { action(); return 0; }
	setTimeout(action, honeycomb.duration(lead));
	return lead;
};

//Points an existing <img> at a fresh fallback chain, resetting the walk so it starts from the most
//specific candidate again.
honeycomb.combatScene.applyPose = function (art, entity, poseIndex) {
	entity = honeycomb.combatScene.shownEntity(entity);
	//The known misses are dropped first, exactly as the repaint's tag drops them (honeycomb.art.liveChain);
	//asking for them again is what blanked an enemy on every beat (ui/ A-report).
	var wantedChain = honeycomb.art.spriteChain(entity, poseIndex);
	var chain = honeycomb.art.liveChain(wantedChain);
	if (wantedChain.length === 0) return;
	//Every candidate is known to be missing: the placeholder is drawn outright and nothing is requested
	//(see honeycomb.art.liveChain). The tint and the facing below still apply to it.
	if (chain.length === 0) {
		honeycomb.art.writeChain(art, [], 0);
		art.onerror = null;
		var placeholder = honeycomb.placeholderArt(wantedChain[0]);
		if (art.getAttribute("src") !== placeholder) art.src = placeholder;
		art.style.filter = honeycomb.art.stateFilter(entity);
		var placeholderFighter = art.closest == null ? null : art.closest(".hcFighter");
		if (placeholderFighter != null) placeholderFighter.classList.toggle("hcMirrored", honeycomb.art.spriteFlipped(entity));
		return;
	}
	//Written through the art file's one writer: `art.dataset.honeycombChain` here used to set a different
	//attribute from the one the error handler reads (see honeycomb.art.readChain).
	honeycomb.art.writeChain(art, chain, 0);
	art.onerror = function () { honeycomb.art.onChainError(art); };
	//Setting the same source again is not free: the browser may repaint a blank frame while it re-decodes.
	var source = honeycomb.image(chain[0]);
	//A pose change is a canvas change. The canvas correction is written per drawing, so a
	//pose delivered on another canvas has to re-run it -- and a CACHED image fires no `load` event, which
	//is why it is also called outright for one already decoded. See honeycomb.art.normaliseCanvas.
	//
	//THE CORRECTION MUST NOT BE WRITTEN EARLY HERE: doing so was tried and measured wrong. Setting `src`
	//does not clear the picture: the browser keeps painting the OLD one
	//until the new one has arrived. So the element's stale correction belongs to the picture still on
	//screen, and the two change together in one step when the new picture lands. Measured, Anastasia
	//combat 832x1216 -> passive 650x1300 in the live battlefield, sampled every frame:
	//
	//    as it is        226x331 -> 165x331     the HEIGHT never moves; the width steps once, correctly
	//    corrected early 165x242 -> 165x331     a visible 27% dip for the whole of the load
	//
	//The early correction is right only where there is no picture on screen to be wrong about, which is
	//a fighter being built (honeycomb.art.chainTag) or a chain walking to its next candidate
	//(honeycomb.art.onChainError). Both do it. A pose swap does not.
	if (art.getAttribute("src") !== source) {
		art.onload = function () { honeycomb.art.normaliseCanvas(art); };
		art.src = source;
	}
	if (art.complete == true && art.naturalWidth > 0) honeycomb.art.normaliseCanvas(art);
	art.style.filter = honeycomb.art.stateFilter(entity);
	//Re-applied on every pose change, so a fighter that changed sides mid-fight turns to face the right
	//way on its next beat rather than keeping the facing it was built with. As a CLASS on the fighter:
	//writing `art.style.transform` here fought the hit shake and the downed tilt, which is what made
	//fighters resize and jump between beats.
	var fighter = art.closest == null ? null : art.closest(".hcFighter");
	if (fighter != null) fighter.classList.toggle("hcMirrored", honeycomb.art.spriteFlipped(entity));
};

//Acting. Attacks swing, everything else gestures -- so a Brace no longer looks like a sword
//swing. The caller passes the card type; enemies pass their intent's type.
honeycomb.combatScene.playActionFrame = function (entityId, poseIndex, holdMs) {
	honeycomb.combatScene.swapPose(entityId, poseIndex == null ? "offense" : poseIndex, "hcActing", holdMs);
};

//Being hit: the damaged pose, plus a shake from CSS. Two channels on purpose -- the pose carries the
//art direction and the class carries the motion, so a character with no drawn damaged pose still
//reads as having been struck.
honeycomb.combatScene.playHitReaction = function (entityId) {
	var fighter = honeycomb.combatScene.fighterElement(entityId);
	if (fighter == null) return;
	fighter.classList.remove("hcHit");
	//Reading offsetWidth forces a reflow, which restarts the animation when the same fighter is hit
	//twice in quick succession. Without it the second hit would not animate at all.
	void fighter.offsetWidth;
	fighter.classList.add("hcHit");
	honeycomb.combatScene.swapPose(entityId, "damaged", null);
	setTimeout(function () {
		fighter.classList.remove("hcHit");
	}, honeycomb.duration(honeycomb.tuning.animation.hitFlashMs));
};

//A rising number over a fighter.
honeycomb.combatScene.floatNumber = function (entityId, text, className) {
	var fighter = honeycomb.combatScene.fighterElement(entityId);
	if (fighter == null) return;
	var element = document.createElement("div");
	element.className = "hcFloatNumber " + className;
	element.textContent = text;
	//A small horizontal scatter stops stacked numbers from overlapping into an unreadable pile.
	var scatter = honeycomb.tuning.animation.floatingNumberScatterPixels;
	element.style.setProperty("--hcFloatDrift", honeycomb.cssPixels((Math.random() * scatter - scatter / 2).toFixed(1)));
	element.style.setProperty("--hcFloatRise", honeycomb.cssPixels(-honeycomb.tuning.animation.floatingNumberRisePixels));
	element.style.setProperty("--hcFloatDuration", honeycomb.duration(honeycomb.tuning.animation.floatingNumberMs) + "ms");
	fighter.appendChild(element);
	setTimeout(function () {
		if (element.parentNode) element.parentNode.removeChild(element);
	}, honeycomb.duration(honeycomb.tuning.animation.floatingNumberMs));
};

//Repaints one fighter's health, gold, lust and statuses without rebuilding the fighter, so its sprite
//animation is not interrupted mid-beat.
//
//THE TRAIL is set up here rather than in the markup, because it is the one part of the bar that
//depends on what the bar said a moment ago. The width the old fill had is read off the DOM before it
//is replaced, drawn as the trail's starting width, and then moved to the new width on the next frame
//so the CSS transition has two values to travel between. Writing both widths in one pass would show
//the finished state immediately and no drain at all.
//THE BARS FOLLOW THE LOG, NOT THE STATE. Combat state is final before the first frame of a replay, so
//a bar redrawn from the live entity would show a double hit's whole loss on the first hit and nothing
//on the second, as though the damage were all dealt instantly at once. Each fighter's SHOWN
//health, gold and lust are kept here, moved by each damage / heal / temporaryHealth / lust entry as it plays, and set back to
//the truth by every repaint. Keyed by entity id.
honeycomb.combatScene.shownVitalsArray = {};

//How a fighter's plate draws its vitals, shared by the fighter builder and by updateVitals so a repaint
//can never draw a different plate from the one first built. Only a character the player commands has a
//medallion that opens anything.
honeycomb.combatScene.plateVitalsOptions = function (entity, trailFromPercent) {
	var options = { showIdentity: true, trailFromPercent: trailFromPercent };
	if (entity == null || honeycomb.isAiControlled(entity) == true || entity.characterIndex == null) return options;
	if (honeycomb.abilities.memberAbilityArray(entity).length === 0) return options;
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	options.medallionAction = "honeycomb.combatScene.onMedallionClick(event,'" + honeycomb.escapeAttribute(entity.instanceId) + "')";
	options.medallionReady = honeycomb.combatScene.anyAbilityUsable(entity, combat);
	options.medallionOpen = honeycomb.combatScene.abilityMenuFor == entity.instanceId;
	return options;
};

//What the bar for an entity is currently showing, made from the live entity when nothing is shown yet.
//BROKEN IS SHOWN TOO: the whole plate changes when somebody breaks, so it must change on the `broken`
//beat rather than on the first bar redraw of a replay whose final state already has them broken.
honeycomb.combatScene.shownVitalsFor = function (entity) {
	var shown = honeycomb.combatScene.shownVitalsArray[entity.instanceId];
	if (shown == null) {
		shown = { health: entity.health, temporaryHealth: entity.temporaryHealth, lust: entity.lust == null ? 0 : entity.lust, broken: entity.broken == true };
		honeycomb.combatScene.shownVitalsArray[entity.instanceId] = shown;
	}
	return shown;
};

//Every bar back to the truth. Called by the repaint, which is where a replay's world becomes final.
honeycomb.combatScene.syncShownVitals = function () {
	honeycomb.combatScene.shownVitalsArray = {};
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (combat == null) return;
	var entityArray = honeycomb.entityArray("both", combat);
	for (var scanIndex = 0; scanIndex < entityArray.length; scanIndex++) honeycomb.combatScene.shownVitalsFor(entityArray[scanIndex]);
};

//Redraws one fighter's bars. `delta` is what the entry being played did -- {health, temporaryHealth, lust}, each
//signed and optional -- applied to the SHOWN figures, so a bar moves by exactly one entry per beat.
honeycomb.combatScene.updateVitals = function (entityId, delta) {
	var fighter = honeycomb.combatScene.fighterElement(entityId);
	if (fighter == null) return;
	var entity = honeycomb.findEntity(entityId, honeycomb.state.run.combat);
	if (entity == null) return;
	var holder = fighter.getElementsByClassName("hcVitals")[0];
	if (holder == null) return;

	var shown = honeycomb.combatScene.shownVitalsFor(entity);
	if (delta != null) {
		if (delta.health != null) shown.health = Math.max(0, Math.min(entity.maxHealth, shown.health + delta.health));
		if (delta.temporaryHealth != null) shown.temporaryHealth = Math.max(0, shown.temporaryHealth + delta.temporaryHealth);
		if (delta.lust != null) shown.lust = Math.max(0, (shown.lust == null ? 0 : shown.lust) + delta.lust);
		if (delta.broken != null) shown.broken = delta.broken == true;
	}
	//The entity as the bar should show it: everything the live one is, with health, gold, lust and the
	//broken state as shown.
	var view = Object.create(entity);
	view.health = shown.health;
	view.temporaryHealth = shown.temporaryHealth;
	view.lust = shown.lust == null ? 0 : shown.lust;
	view.broken = shown.broken == true;

	var previousFill = holder.getElementsByClassName("hcHealthFill")[0];
	var previousTrail = holder.getElementsByClassName("hcHealthTrail")[0];
	//The trail chases the OLD trail when one is still draining, so two hits in quick succession leave
	//one trail behind the pair rather than the second one cutting the first short.
	var fromPercent = null;
	if (previousTrail != null) fromPercent = parseFloat(previousTrail.style.width);
	if ((fromPercent == null || isNaN(fromPercent)) && previousFill != null) {
		fromPercent = parseFloat(previousFill.style.width);
	}
	if (fromPercent == null || isNaN(fromPercent)) fromPercent = null;

	holder.outerHTML = honeycomb.ui.vitals(view, honeycomb.combatScene.plateVitalsOptions(view, fromPercent));
	//The status circles sit in the row under the bar, not inside the vitals, so they are redrawn where
	//they live -- and ONLY they are: the mechanic in the same row is moved by its own beat. Redrawing the
	//statuses inside the vitals is what doubled every status while a card was aimed.
	var circleRow = fighter.querySelector(".hcPlateCircles");
	if (circleRow != null) {
		var oldCircleArray = circleRow.querySelectorAll(".hcStatusCircle");
		for (var circleIndex = 0; circleIndex < oldCircleArray.length; circleIndex++) oldCircleArray[circleIndex].remove();
		circleRow.insertAdjacentHTML("beforeend", honeycomb.ui.statusCircles(entity));
	}

	//outerHTML replaced the node, so the new one has to be found again rather than reused.
	var fresh = fighter.getElementsByClassName("hcHealthTrail")[0];
	var freshFill = fighter.getElementsByClassName("hcHealthFill")[0];
	if (fresh == null || freshFill == null) return;
	var target = freshFill.style.width;
	if (fresh.style.width == target) return;
	//A trail that is BEHIND the fill would be a healing bar rather than a drain; snapped instead.
	if (parseFloat(fresh.style.width) < parseFloat(target)) { fresh.style.width = target; return; }
	requestAnimationFrame(function () { fresh.style.width = target; });
};

//Redraws one fighter's mechanic widget in place and pulses it. Severine's orbs are tested rather than
//stored, so they are redrawn by any beat that could change them -- which is what `refreshMechanics`
//below does for the whole board.
honeycomb.combatScene.refreshMechanic = function (entityId, options) {
	var fighter = honeycomb.combatScene.fighterElement(entityId);
	if (fighter == null) return;
	var entity = honeycomb.findEntity(entityId, honeycomb.state.run.combat);
	if (entity == null) return;
	//A tested mechanic is several slots now: collect every slot this
	//fighter's mechanic drew, replace the first with the fresh block and drop the rest.
	var oldArray = [];
	var candidateArray = fighter.getElementsByClassName("hcMechanic");
	for (var candidateIndex = 0; candidateIndex < candidateArray.length; candidateIndex++) {
		if (candidateArray[candidateIndex].dataset.hcmechanicfor === entityId) oldArray.push(candidateArray[candidateIndex]);
	}
	if (oldArray.length === 0) return;

	var fresh = honeycomb.ui.mechanicWidget(entity, honeycomb.state.run.combat);
	if (fresh === "") return;
	oldArray[0].outerHTML = fresh;
	for (var staleIndex = 1; staleIndex < oldArray.length; staleIndex++) {
		if (oldArray[staleIndex].parentNode != null) oldArray[staleIndex].parentNode.removeChild(oldArray[staleIndex]);
	}
	if (options != null && options.quiet == true) return;
	//The fresh block replaced the first old node, so the pulse goes on the new one.
	var replaced = fighter.querySelector('[data-hcMechanicFor="' + entityId + '"]');
	if (replaced == null) return;
	replaced.classList.add("hcMechanicPulse");
	setTimeout(function () {
		if (replaced.parentNode != null) replaced.classList.remove("hcMechanicPulse");
	}, honeycomb.duration(honeycomb.tuning.animation.mechanicMoveMs));
};

//Every mechanic on the board, quietly. The tested kind (Severine's orbs) answers about the board as it
//stands, so anything that moves health or ends a turn can change it without a log entry of its own.
honeycomb.combatScene.refreshMechanics = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.combat == null) return;
	var entityArray = honeycomb.entityArray("both", run.combat);
	for (var scanIndex = 0; scanIndex < entityArray.length; scanIndex++) {
		honeycomb.combatScene.refreshMechanic(entityArray[scanIndex].instanceId, { quiet: true });
	}
};

//--- Impact -----------------------------------------------------------------------------------------
//A hit that takes a real bite out of somebody moves the whole battlefield, by an amount read off how
//much of their maximum health it removed. A fixed shake on every hit is noise; nothing at all makes a
//killing blow read exactly like a scratch.
honeycomb.combatScene.shakeForDamage = function (entityId, amount) {
	var animation = honeycomb.tuning.animation;
	var entity = honeycomb.findEntity(entityId, honeycomb.state.run.combat);
	if (entity == null || entity.maxHealth <= 0 || amount <= 0) return 0;

	var severity = amount / entity.maxHealth;
	if (severity < animation.shakeThresholdFraction) return 0;

	var span = animation.shakeFullFraction - animation.shakeThresholdFraction;
	var scaled = span <= 0 ? 1 : Math.min(1, (severity - animation.shakeThresholdFraction) / span);
	honeycomb.combatScene.shakeBattlefield(animation.shakeMinimumPixels +
		(animation.shakeMaximumPixels - animation.shakeMinimumPixels) * scaled);

	//The pause AFTER a heavy landing. A beat of stillness is what gives a blow its weight, and it is
	//returned as extra beat time rather than slept on, so the log replay stays a single timeline.
	return severity >= animation.hitStopFraction ? animation.hitStopMs : 0;
};

//Moves the board by a given distance. Split out so content can ask for a shake of its own through the
//playAnimation effect without having to inflict damage to get one.
honeycomb.combatScene.shakeBattlefield = function (pixels) {
	var battlefield = document.getElementById("honeycombBattlefield");
	if (battlefield == null) return;
	battlefield.style.setProperty("--hcShakePixels", honeycomb.cssPixels(pixels.toFixed(1)));
	battlefield.classList.remove("hcShaking");
	//Forces a reflow so a second hit restarts the animation instead of being swallowed by the first
	//one still running. Same reason the hit reaction does it.
	void battlefield.offsetWidth;
	battlefield.classList.add("hcShaking");
	setTimeout(function () {
		battlefield.classList.remove("hcShaking");
	}, honeycomb.duration(honeycomb.tuning.animation.shakeMs));
};

honeycomb.combatScene.pulseStatus = function (entityId, statusIndex) {
	var fighter = honeycomb.combatScene.fighterElement(entityId);
	if (fighter == null) return;
	var chipArray = fighter.getElementsByClassName("hcStatusCircle");
	for (var chipIndex = 0; chipIndex < chipArray.length; chipIndex++) {
		if (chipArray[chipIndex].dataset.hcstatus != statusIndex) continue;
		chipArray[chipIndex].classList.add("hcPulse");
	}
};

//Content-authored flourishes, referenced by the playAnimation effect. A name with no entry here is
//ignored rather than erroring, so content can be written ahead of its animation.
honeycomb.combatScene.namedAnimationArray = [
	{
		index: "lunge",
		play: function (entry) {
			var fighter = honeycomb.combatScene.fighterElement(entry.sourceId);
			if (fighter == null) return;
			fighter.classList.add("hcLunge");
			setTimeout(function () { fighter.classList.remove("hcLunge"); },
				honeycomb.duration(honeycomb.tuning.animation.elementTravelMs));
		},
	},
	{
		index: "flash",
		play: function (entry) {
			var fighter = honeycomb.combatScene.fighterElement(entry.targetId);
			if (fighter == null) return;
			fighter.classList.add("hcFlash");
			setTimeout(function () { fighter.classList.remove("hcFlash"); },
				honeycomb.duration(honeycomb.tuning.animation.hitFlashMs));
		},
	},
	{
		//Knocked backwards. For a blow that should feel like it moved somebody, as distinct from the
		//hit reaction every damage entry already plays.
		index: "recoil",
		play: function (entry) {
			honeycomb.combatScene.holdClass(entry.targetId, "hcRecoil",
				honeycomb.tuning.animation.elementTravelMs);
		},
	},
	{
		//Trembling in place. Reads as something being done TO a fighter that is not a blow -- a curse
		//landing, a will being bent.
		index: "shudder",
		play: function (entry) {
			honeycomb.combatScene.holdClass(entry.targetId, "hcShudder",
				honeycomb.tuning.animation.elementTravelMs * 2);
		},
	},
	{
		//Lifting and lit. For the source of a power or a buff, where nothing is being hit and the
		//offense pose would be a lie.
		index: "rise",
		play: function (entry) {
			honeycomb.combatScene.holdClass(entry.sourceId, "hcRise",
				honeycomb.tuning.animation.elementTravelMs * 2);
		},
	},
	{
		//The whole board, at a severity the content chooses. `strength` is a multiplier on the tuned
		//maximum, so a card can be as heavy as it likes without a number of its own.
		index: "screenShake",
		play: function (entry) {
			var animation = honeycomb.tuning.animation;
			var strength = entry.strength == null ? 1 : entry.strength;
			honeycomb.combatScene.shakeBattlefield(animation.shakeMaximumPixels * strength);
		},
	},
	{
		//A line struck between two fighters. Drawn as a rotated element rather than in the aiming
		//SVG, because that one is stretched to its box and would skew anything shaped drawn in it.
		index: "beam",
		play: function (entry) { honeycomb.combatScene.drawBeam(entry); },
	},
	{
		//A ring expanding out of the target. The generic "something happened here" flourish.
		index: "burst",
		play: function (entry) { honeycomb.combatScene.drawBurst(entry); },
	},
];

//Adds a class to a fighter, holds it, and takes it off again. Every named animation that is purely a
//CSS state is one line on top of this.
honeycomb.combatScene.holdClass = function (entityId, className, milliseconds) {
	var fighter = honeycomb.combatScene.fighterElement(entityId);
	if (fighter == null) return;
	fighter.classList.remove(className);
	//Forces a reflow so the same animation played twice in quick succession restarts rather than
	//being swallowed by the run already in flight.
	void fighter.offsetWidth;
	fighter.classList.add(className);
	setTimeout(function () { fighter.classList.remove(className); }, honeycomb.duration(milliseconds));
};

//A line struck between two fighters, positioned and rotated in screen pixels.
honeycomb.combatScene.drawBeam = function (entry) {
	var host = honeycomb.rootElement();
	var source = honeycomb.combatScene.fighterElement(entry.sourceId);
	var target = honeycomb.combatScene.fighterElement(entry.targetId);
	if (host == null || source == null || target == null) return;

	var fromBox = source.getBoundingClientRect();
	var toBox = target.getBoundingClientRect();
	var fromX = fromBox.left + fromBox.width / 2;
	var fromY = fromBox.top + fromBox.height * honeycomb.combatScene.beamHeightFraction;
	var toX = toBox.left + toBox.width / 2;
	var toY = toBox.top + toBox.height * honeycomb.combatScene.beamHeightFraction;

	var element = document.createElement("div");
	element.className = "hcBeam";
	element.style.left = Math.round(fromX) + "px";
	element.style.top = Math.round(fromY) + "px";
	element.style.width = Math.round(Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2))) + "px";
	element.style.setProperty("--hcBeamAngle",
		(Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI).toFixed(2) + "deg");
	if (entry.color != null) element.style.setProperty("--hcBeamColor", entry.color);
	host.appendChild(element);
	setTimeout(function () {
		if (element.parentNode) element.parentNode.removeChild(element);
	}, honeycomb.duration(honeycomb.tuning.animation.elementTravelMs));
};

//A ring expanding out of a fighter.
honeycomb.combatScene.drawBurst = function (entry) {
	var fighter = honeycomb.combatScene.fighterElement(entry.targetId);
	if (fighter == null) return;
	var element = document.createElement("div");
	element.className = "hcBurst";
	if (entry.color != null) element.style.setProperty("--hcBurstColor", entry.color);
	fighter.appendChild(element);
	setTimeout(function () {
		if (element.parentNode) element.parentNode.removeChild(element);
	}, honeycomb.duration(honeycomb.tuning.animation.elementTravelMs * 2));
};

//How far down a fighter's frame a beam is struck, as a fraction of its height -- roughly chest.
honeycomb.combatScene.beamHeightFraction = 0.42;

//---------------------------------------------------------------------------------------------------
//Attack VFX
//---------------------------------------------------------------------------------------------------
//An attack can display a vfx over its target, auto-detecting its blend from the suffix of the file as
//the top priority, falling back to the colors of the four corner pixels when a file carries no suffix.
//
//A VFX is one image laid over the target and played as a beat. Its BLEND decides its background:
//   "additive" -- the whole image is added over the target (a glow on black).
//   "chroma"   -- one colour is keyed out to alpha, at runtime, on a canvas.
//   "normal"   -- drawn as-is (the image already has alpha).
//The suffix decides first (tuning.vfx.suffixRuleArray); only a file matching no suffix has its four
//corner pixels inspected -- one shared, opaque colour becomes the key; a near-black one means additive.
//
//The chroma key needs pixel access, which a `file://` image does not grant (the canvas is tainted), so a
//keyed copy is cached when it can be made and the raw image is shown when it cannot. The first play of a
//chroma effect may show its un-keyed source; prepare() is warmed at the top of a fight so it is keyed by
//the time an attack lands.
honeycomb.vfx = { cache: {}, pending: {} };

//The filters, offline. A canvas cannot read a `file://` image (the canvas is tainted), so the
//key is done with SVG filters instead -- pure CSS, no pixel access, works from a local page. Each filter
//leaves RGB alone and writes ALPHA as a linear combination of R/G/B, tuned so the named key colour goes
//to 0 and everything else stays opaque (colour-interpolation is sRGB, so the maths is on the image's own
//values, not linear light):
//   Green   alpha = R - G + B + 1   (pure green -> 0; red, black, white -> 1)
//   Magenta alpha = -R + G - B + 2  (pure magenta -> 0; green, black, white -> 1)
//   Black   alpha = R + G + B       (black -> 0; anything lit stays)
honeycomb.vfx.filterArray = [
	{ index: "Green", alpha: "1 -1 1 0 1" },
	{ index: "Magenta", alpha: "-1 1 -1 0 2" },
	{ index: "Black", alpha: "1 1 1 0 0" },
];

honeycomb.vfx.ensureFilters = function () {
	if (typeof document === "undefined") return;
	//THE OVERLAY HOST, NOT THE ROOT. A scene change does `root.innerHTML = ""`, which wiped a filter SVG
	//that lived on the root -- so a fight started, the cached effect skipped re-adding it, and the raw
	//green/magenta background showed. The overlay host is a SIBLING of the root and survives scene
	//changes, so the filters do too.
	var host = honeycomb.overlayHostElement() || honeycomb.rootElement() || document.body;
	if (host == null || document.getElementById("honeycombVfxFilters") != null) return;
	var markup = '<svg id="honeycombVfxFilters" width="0" height="0" aria-hidden="true" style="position:absolute;left:0;top:0"><defs>';
	for (var filterIndex = 0; filterIndex < honeycomb.vfx.filterArray.length; filterIndex++) {
		var filter = honeycomb.vfx.filterArray[filterIndex];
		markup += '<filter id="hcVfxFilter' + filter.index + '" color-interpolation-filters="sRGB">' +
			'<feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  ' + filter.alpha + '"/>' +
			//The alpha formula turns TRANSPARENT pixels opaque (0,0,0,0 -> alpha 1 = black), so the filter's
			//own padding and an object-fit letterbox would paint black bars. `in SourceGraphic` multiplies
			//the result by the image's real alpha, which is 0 in both places.
			'<feComposite operator="in" in2="SourceGraphic"/>' +
			"</filter>";
	}
	markup += "</defs></svg>";
	var holder = document.createElement("div");
	holder.innerHTML = markup;
	host.appendChild(holder.firstChild);
};

honeycomb.vfx.filterIdFor = function (rule) {
	if (rule == null || rule.filter == null) return null;
	return "hcVfxFilter" + rule.filter;
};


honeycomb.vfx.ruleFor = function (path) {
	var rules = honeycomb.tuning.vfx.suffixRuleArray;
	for (var ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
		if (path.indexOf(rules[ruleIndex].suffix) >= 0) return rules[ruleIndex];
	}
	return null;
};

honeycomb.vfx.cornerColorArray = function (data, width, height) {
	function pixelAt(x, y) {
		var offset = (y * width + x) * 4;
		return [data[offset], data[offset + 1], data[offset + 2]];
	}
	return [pixelAt(0, 0), pixelAt(width - 1, 0), pixelAt(0, height - 1), pixelAt(width - 1, height - 1)];
};

honeycomb.vfx.cornersAgree = function (cornerArray) {
	var tolerance = honeycomb.tuning.vfx.cornerTolerance;
	var first = cornerArray[0];
	for (var cornerIndex = 1; cornerIndex < cornerArray.length; cornerIndex++) {
		var corner = cornerArray[cornerIndex];
		var distance = Math.sqrt(Math.pow(corner[0] - first[0], 2) + Math.pow(corner[1] - first[1], 2) + Math.pow(corner[2] - first[2], 2));
		if (distance > tolerance) return false;
	}
	return true;
};

//THE CORNER-PIXEL BACKUP, for a file whose name carries no suffix. This needs pixel access, so it only
//works where the canvas is not tainted (an `http(s)` page). A `file://` page falls through to the raw
//image; the named effects above never take this path, so offline play still keys them.
honeycomb.vfx.process = function (path, image) {
	var source = honeycomb.image(path);
	var width = image.naturalWidth || image.width;
	var height = image.naturalHeight || image.height;
	if (width <= 0 || height <= 0) return { src: source, blend: "normal" };
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	var context = canvas.getContext("2d");
	if (context == null) return { src: source, blend: "normal" };
	context.drawImage(image, 0, 0);
	var imageData;
	try {
		imageData = context.getImageData(0, 0, width, height);
	} catch (error) {
		//A tainted canvas (a `file://` image): no pixel access, so the raw image is the answer.
		return { src: source, blend: "normal" };
	}

	var cornerArray = honeycomb.vfx.cornerColorArray(imageData.data, width, height);
	if (honeycomb.vfx.cornersAgree(cornerArray) == false) return { src: source, blend: "normal" };

	var key = cornerArray[0];
	var tolerance;
	var feather;
	var blend = "chroma";
	if (key[0] < honeycomb.tuning.vfx.darkThreshold &&
		key[1] < honeycomb.tuning.vfx.darkThreshold &&
		key[2] < honeycomb.tuning.vfx.darkThreshold) {
		//A black ground: an additive glow. Key the near-black out too, so the square cannot show.
		blend = "additive";
		key = [0, 0, 0];
		tolerance = honeycomb.tuning.vfx.additiveBlackTolerance;
		feather = honeycomb.tuning.vfx.additiveBlackFeather;
	} else {
		tolerance = honeycomb.tuning.vfx.defaultTolerance;
		feather = tolerance * honeycomb.tuning.vfx.featherMultiple;
	}

	var pixels = imageData.data;
	for (var pixelIndex = 0; pixelIndex < pixels.length; pixelIndex += 4) {
		var red = pixels[pixelIndex] - key[0];
		var green = pixels[pixelIndex + 1] - key[1];
		var blue = pixels[pixelIndex + 2] - key[2];
		var distance = Math.sqrt(red * red + green * green + blue * blue);
		if (distance <= tolerance) pixels[pixelIndex + 3] = 0;
		else if (distance < feather) pixels[pixelIndex + 3] = Math.round(255 * (distance - tolerance) / (feather - tolerance));
	}
	context.putImageData(imageData, 0, 0);
	var dataUrl;
	try {
		dataUrl = canvas.toDataURL("image/png");
	} catch (error) {
		return { src: source, blend: "normal" };
	}
	return { src: dataUrl, blend: blend };
};

//Loads and prepares a VFX. Returns the cached result at once when there is one, else null and calls back
//when ready. An in-flight load queues further callbacks rather than starting a second request; a missing
//file caches a no-op.
honeycomb.vfx.prepare = function (path, onReady) {
	var cached = honeycomb.vfx.cache[path];
	if (cached != null) {
		if (typeof onReady === "function") onReady(cached);
		return cached;
	}
	var rule = honeycomb.vfx.ruleFor(path);
	//A NAMED SUFFIX NEEDS NO LOAD AND NO CANVAS: an SVG filter keys it in the browser, so it works on a
	//`file://` page as well as online. This is the shipped path.
	if (rule != null && rule.filter != null) {
		honeycomb.vfx.ensureFilters();
		var prepared = { src: honeycomb.image(path), blend: rule.blend, filter: honeycomb.vfx.filterIdFor(rule) };
		honeycomb.vfx.cache[path] = prepared;
		if (typeof onReady === "function") onReady(prepared);
		return prepared;
	}
	if (honeycomb.vfx.pending[path] != null) {
		if (typeof onReady === "function") honeycomb.vfx.pending[path].push(onReady);
		return null;
	}
	var waitArray = [];
	honeycomb.vfx.pending[path] = waitArray;
	if (typeof onReady === "function") waitArray.push(onReady);
	function finish(preparedResult) {
		honeycomb.vfx.cache[path] = preparedResult;
		delete honeycomb.vfx.pending[path];
		for (var waitIndex = 0; waitIndex < waitArray.length; waitIndex++) waitArray[waitIndex](preparedResult);
	}
	//NO SUFFIX: the corner-pixel backup, which needs a canvas (online only).
	var image = new Image();
	image.onload = function () { finish(honeycomb.vfx.process(path, image)); };
	image.onerror = function () { finish({ src: honeycomb.image(path), blend: "normal" }); };
	image.src = honeycomb.image(path);
	return null;
};

//Warms the effects a fight is about to use, so the first one to land is already keyed.
honeycomb.vfx.prewarm = function () {
	if (honeycomb.tuning.vfx.enabled != true) return;
	honeycomb.vfx.prepare(honeycomb.tuning.vfx.defaultAttackPath, null);
};

//The beat itself: an element over the target's fighter, on its own timer, so it plays alongside the hit
//reaction rather than after it. `path` "none" opts an attack out.
//
//It waits for the key. Preparing is asynchronous, and the first play of a chroma
//effect used to show its raw, un-keyed source because the element was drawn before the key existed --
//the intermittent "the background is still there". The element is built only once prepare answers; the
//cache makes every later play immediate.
honeycomb.combatScene.playVfx = function (targetId, path) {
	if (honeycomb.tuning.vfx.enabled != true) return;
	if (path == null || path === "none") return;
	if (honeycomb.combatScene.fighterElement(targetId) == null) return;
	//Make sure the key filters exist at PLAY time, not only when an effect was first prepared: a scene
	//rebuild between then and now would have removed them, and a cached prepare does not re-add them.
	honeycomb.vfx.ensureFilters();
	honeycomb.vfx.prepare(path, function (prepared) {
		var fighter = honeycomb.combatScene.fighterElement(targetId);
		if (fighter == null) return;
		var element = document.createElement("div");
		element.className = "hcVfx";
		var art = document.createElement("img");
		art.className = "hcVfxArt";
		art.alt = "";
		art.src = prepared == null ? honeycomb.image(path) : prepared.src;
		if (prepared != null && prepared.blend == "additive") element.classList.add("hcVfxAdditive");
		//A prepared effect may carry an SVG filter id instead of a baked key (the offline path): the
		//browser keys the image itself, with no pixel access.
		if (prepared != null && prepared.filter != null) art.style.filter = "url(#" + prepared.filter + ")";
		element.appendChild(art);
		fighter.appendChild(element);
		setTimeout(function () {
			if (element.parentNode) element.parentNode.removeChild(element);
		}, honeycomb.duration(honeycomb.tuning.vfx.durationMs));
	});
};

honeycomb.combatScene.playNamedAnimation = function (entry) {
	var definition = honeycomb.findDefinition(honeycomb.combatScene.namedAnimationArray, entry.animation);
	if (definition == null) return;
	definition.play(entry);
};

//A transient line of text across the middle of the board.
honeycomb.combatScene.flashMessage = function (text) {
	var body = honeycomb.rootElement();
	if (body == null) return;
	var existing = document.getElementById("honeycombFlash");
	if (existing != null && existing.parentNode) existing.parentNode.removeChild(existing);

	var element = document.createElement("div");
	element.id = "honeycombFlash";
	element.className = "hcFlashMessage";
	element.textContent = text;
	body.appendChild(element);
	setTimeout(function () {
		if (element.parentNode) element.parentNode.removeChild(element);
	}, honeycomb.duration(honeycomb.tuning.animation.floatingNumberMs));
};

//--- The turn banner --------------------------------------------------------------------------------
//What each side's handover says. A table so a mode with a third side, or a boss phase that wants its
//own wording, is an entry rather than a branch.
honeycomb.combatScene.turnBannerArray = [
	{ index: "ally", text: "Your Turn", className: "hcBanner-ally" },
	{ index: "enemy", text: "Enemy Turn", className: "hcBanner-enemy" },
];

honeycomb.combatScene.showTurnBanner = function (banner) {
	var body = honeycomb.rootElement();
	if (body == null || banner == null) return;
	var existing = document.getElementById("honeycombTurnBanner");
	if (existing != null && existing.parentNode) existing.parentNode.removeChild(existing);

	var element = document.createElement("div");
	element.id = "honeycombTurnBanner";
	element.className = "hcTurnBanner " + banner.className;
	element.textContent = banner.text;
	body.appendChild(element);
	setTimeout(function () {
		if (element.parentNode) element.parentNode.removeChild(element);
	}, honeycomb.duration(honeycomb.tuning.animation.turnBannerMs));
};

//--- Card flight ------------------------------------------------------------------------------------
//A played card is shown travelling from where it was let go to whoever it was aimed at, then breaking
//up. Without it a card simply stops existing, and on a busy board it is genuinely unclear which card
//caused what -- the numbers appear with nothing having visibly done them.
//
//A copy is flown rather than the card itself: the real card is already filed in a pile by the time the
//log replays, and the hand is about to be rebuilt underneath it.
honeycomb.combatScene.flyCard = function (cardInstanceId, fromBox, targetEntityId) {
	if (fromBox == null) return;
	var host = honeycomb.rootElement();
	if (host == null) return;
	var resolved = honeycomb.combat.resolveById(cardInstanceId);
	if (resolved == null) return;

	var toBox = null;
	var fighter = honeycomb.combatScene.fighterElement(targetEntityId);
	if (fighter != null) toBox = fighter.getBoundingClientRect();

	var element = document.createElement("div");
	element.className = "hcCardFlight";
	element.style.left = Math.round(fromBox.left) + "px";
	element.style.top = Math.round(fromBox.top) + "px";
	element.style.width = Math.round(fromBox.width) + "px";
	element.style.height = Math.round(fromBox.height) + "px";
	element.innerHTML = honeycomb.ui.card(resolved, { size: "large", showAffinity: false });

	//An untargeted card rises in place rather than flying nowhere in particular.
	var driftX = toBox == null ? 0 : (toBox.left + toBox.width / 2) - (fromBox.left + fromBox.width / 2);
	var driftY = toBox == null
		? -fromBox.height * honeycomb.combatScene.untargetedRise
		: (toBox.top + toBox.height / 2) - (fromBox.top + fromBox.height / 2);
	element.style.setProperty("--hcFlightX", Math.round(driftX) + "px");
	element.style.setProperty("--hcFlightY", Math.round(driftY) + "px");

	//Where, and how small, the card is when the flight ends -- the spot its trip on to the discard (or
	//its burning up) starts from, once the flight has finished. See playSpentCard.
	var endScale = honeycomb.tuning.animation.cardFlightEndScale;
	var endWidth = fromBox.width * endScale;
	var endHeight = fromBox.height * endScale;
	honeycomb.combatScene.handMotion.playedEnd = {
		box: {
			left: fromBox.left + fromBox.width / 2 + driftX - endWidth / 2,
			top: fromBox.top + fromBox.height / 2 + driftY - endHeight / 2,
			width: endWidth,
			height: endHeight,
		},
		landsAt: Date.now() + honeycomb.duration(honeycomb.tuning.animation.cardFlightMs),
	};

	host.appendChild(element);
	setTimeout(function () {
		if (element.parentNode) element.parentNode.removeChild(element);
	}, honeycomb.duration(honeycomb.tuning.animation.cardFlightMs));
};

//How far a card with nobody to fly at rises, as a fraction of its own height.
honeycomb.combatScene.untargetedRise = 0.9;

//AN ENEMY PLAYS ITS CARD. A copy of the card in the enemy's corner flies out and grows to a readable
//size over the middle of the battlefield, holds, then fades while the move plays out -- Hearthstone's
//answer to "who is doing what", which is the model the feedback named. The small card it came from is
//hidden meanwhile, so it reads as the same card moving rather than a second one appearing.
//
//Built as FLIP: the copy is laid out at its FINAL size and place, then transformed back onto the small
//card and released, so only `transform` and `opacity` animate. Returns how long the replay should wait
//before the move lands: 0 when there is nothing to show.
honeycomb.combatScene.revealEnemyCard = function (enemyId, card) {
	var animation = honeycomb.tuning.animation;
	if (animation.enemyCardRevealEnabled != true || card == null) return 0;
	var host = honeycomb.rootElement();
	var field = document.getElementById("honeycombBattlefield");
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var enemy = combat == null ? null : honeycomb.findEntity(enemyId, combat);
	if (host == null || field == null || enemy == null) return 0;

	var slot = document.getElementById("honeycombIntent-" + enemyId);
	var smallCard = slot == null ? null : slot.querySelector(".hcCard");
	var fighter = honeycomb.combatScene.fighterElement(enemyId);
	var fromBox = smallCard != null ? smallCard.getBoundingClientRect() : (fighter == null ? null : fighter.getBoundingClientRect());
	if (fromBox == null || fromBox.width === 0) return 0;

	var fieldBox = field.getBoundingClientRect();
	//A LARGE card: the same width as every other card the player is meant to read,
	//in honeycomb pixels, so the battlefield's height no longer decides how readable it is.
	var width = honeycomb.pixels(honeycomb.cardSizeDefinition("large").widthPixels);
	var height = width / honeycomb.tuning.art.cardFrame.aspect;
	//Centred on the SCREEN once it is no longer bounded by the field, so it cannot hang off the top.
	var left = fieldBox.left + (fieldBox.width - width) / 2;
	var top = Math.max(fieldBox.top, 0) + (Math.max(fieldBox.height, height) - height) / 2;

	var element = document.createElement("div");
	element.className = "hcEnemyCardReveal";
	element.style.left = Math.round(left) + "px";
	element.style.top = Math.round(top) + "px";
	element.style.width = Math.round(width) + "px";
	element.style.height = Math.round(height) + "px";
	element.innerHTML = honeycomb.ui.card(card, {
		size: "large", showTooltip: false, showAffinity: false, className: "hcIntentCard",
		live: { source: enemy, target: null, combat: combat },
	});
	//Starts ON the small card: offset and shrunk onto it (the element scales from its top-left corner,
	//see the CSS), then released to its own size and place. Easing and durations live in the CSS.
	var scale = fromBox.width / width;
	element.style.transform = "translate(" + Math.round(fromBox.left - left) + "px," + Math.round(fromBox.top - top) + "px) scale(" + scale.toFixed(3) + ")";
	host.appendChild(element);
	if (slot != null) slot.classList.add("hcIntentPlaying");
	//Read once so the start position is committed before the transform is released.
	element.getBoundingClientRect();
	element.style.transform = "none";

	var shownMs = animation.enemyCardRevealMs + animation.enemyCardHoldMs;
	setTimeout(function () {
		element.classList.add("hcRevealLeaving");
		setTimeout(function () {
			if (element.parentNode) element.parentNode.removeChild(element);
		}, honeycomb.duration(animation.enemyCardLeaveMs));
	}, honeycomb.duration(shownMs));
	return shownMs;
};

//The rectangle a hand card currently occupies, or null when it is not on screen -- a card played from
//somewhere other than the hand, or a replay of a log the hand has already been rebuilt under.
honeycomb.combatScene.handCardBox = function (cardInstanceId) {
	var hand = document.getElementById("honeycombHand");
	if (hand == null || cardInstanceId == null) return null;
	var cardArray = hand.getElementsByClassName("hcHandCard");
	for (var cardIndex = 0; cardIndex < cardArray.length; cardIndex++) {
		if (cardArray[cardIndex].dataset.hccardid != cardInstanceId) continue;
		var box = cardArray[cardIndex].getBoundingClientRect();
		return box.width === 0 ? null : box;
	}
	return null;
};

//---------------------------------------------------------------------------------------------------
//Hand motion
//---------------------------------------------------------------------------------------------------
//CARDS ARE SEEN TO MOVE. The engine files a card the moment it moves, so by the time a log is replayed
//the hand it describes is already the final one -- and the closing repaint used to swap the whole hand
//in a single frame. A turn boundary, or a Blood Pact's draw, read as the hand MORPHING rather than as
//cards leaving and arriving. The replay now edits the hand it is showing, one log entry at a time: a
//card that leaves flies to its pile, a card that arrives flies in from where it came from, and the rest
//of the fan closes up or opens out around it. The closing repaint then finds the hand already as it
//should be.
//
//The piles' numbers are walked the same way, so a count ticks as each card lands rather than jumping.
//All of it is presentation. The state is final before the first frame, so skipping any of this would
//leave the game correct, only abrupt.
honeycomb.combatScene.handMotion = {
	//When the last movement started by the replay finishes, as a Date.now() reading. The replay waits
	//for it before handing the board back, since the repaint that follows would snap a card to its end.
	settlesAt: 0,
	//Cards created in the current beat already on show, so a second one stands beside the first.
	createdShown: 0,
	//Where the card just played ended its flight, {box, landsAt}, so its trip on to the discard starts
	//where it vanished. Consumed by the first entry that files it.
	playedEnd: null,
	//Counts repaints. A repaint draws the piles' true numbers, so a card that lands AFTER one -- a timer
	//a few milliseconds late -- must not tick them again. Each movement remembers the epoch it started
	//in and does nothing on landing if a repaint has happened since.
	epoch: 0,
};

//The piles a card can be seen travelling to or from, and what stands for each on screen. A pile with no
//element -- exhaust, powers in play -- shows the card burning up where it is instead. `arrivalText` is
//what a freshly created card says about where it is going; `faceUpTop` shows the last card to land on
//the pile face up, the way a real discard pile looks.
honeycomb.combatScene.pileDisplayArray = [
	{ index: "handArray", pile: "hand", elementId: null, arrivalText: "Into your hand" },
	{ index: "drawPileArray", pile: "drawPile", elementId: "honeycombPile-drawPile", arrivalText: "Shuffled into your draw pile", faceUpTop: false },
	{ index: "discardPileArray", pile: "discardPile", elementId: "honeycombPile-discardPile", arrivalText: "Into your discard pile", faceUpTop: true },
	{ index: "exhaustPileArray", pile: "exhaust", elementId: null, arrivalText: "Exhausted" },
	{ index: "inPlayPileArray", pile: "inPlay", elementId: null, arrivalText: "" },
];

//A pile drawn as a deck, so the draw looks like it is coming from a deck icon. A card-shaped stack
//whose thickness grows with the pile; cards leave the
//top of it and land on it at its own size. The draw pile shows a back, the discard the last card to
//land on it. HC-PLACEHOLDER: the back is CSS until cards/frames/playerBack is drawn.
honeycomb.combatScene.renderPileDeck = function (pileArrayName, count, topCardId) {
	return '<div class="hcDeckStack' + (count === 0 ? " hcDeckEmpty" : "") + '">' +
		'<div class="hcDeckLayers">' + honeycomb.combatScene.deckLayerMarkup(count) + "</div>" +
		'<div class="hcDeckTop">' + honeycomb.combatScene.deckTopMarkup(pileArrayName, count, topCardId) + "</div>" +
		"</div>";
};

//The stack's visible thickness: one edge per so many cards, up to a limit, each set a step further back.
honeycomb.combatScene.deckLayerMarkup = function (count) {
	var layout = honeycomb.tuning.layout;
	var layerCount = count <= 0 ? 0 : Math.min(layout.pileDeckLayerMaximum, Math.ceil(count / layout.pileDeckCardsPerLayer));
	var markup = "";
	for (var layerIndex = layerCount; layerIndex >= 1; layerIndex--) {
		markup += '<div class="hcDeckLayer" style="--hcLayer:' + layerIndex + '"></div>';
	}
	return markup;
};

honeycomb.combatScene.deckTopMarkup = function (pileArrayName, count, topCardId) {
	if (count <= 0) return "";
	var display = honeycomb.findDefinition(honeycomb.combatScene.pileDisplayArray, pileArrayName);
	var resolved = display != null && display.faceUpTop == true && topCardId != null ? honeycomb.combat.resolveById(topCardId) : null;
	if (resolved == null) return honeycomb.combatScene.cardBackMarkup();
	return honeycomb.ui.card(resolved, { size: "small", showTooltip: false, showAffinity: false });
};

honeycomb.combatScene.cardBackMarkup = function () {
	return '<div class="hcCard hcCardBack hcPlayerCardBack">' +
		honeycomb.imageTag("cards/frames/playerBack", { className: "hcCardBackArt", alt: "", silentFallback: true }) + "</div>";
};

//Redraws a pile's stack for a new count; `topCardId`, when given, is the card that just landed on it.
honeycomb.combatScene.refreshPileDeck = function (element, pileArrayName, count, topCardId) {
	var stack = element == null ? null : element.getElementsByClassName("hcDeckStack")[0];
	if (stack == null) return;
	stack.classList.toggle("hcDeckEmpty", count <= 0);
	var layerHolder = stack.getElementsByClassName("hcDeckLayers")[0];
	if (layerHolder != null) layerHolder.innerHTML = honeycomb.combatScene.deckLayerMarkup(count);
	var top = stack.getElementsByClassName("hcDeckTop")[0];
	//Emptied, or a new card on top: the top changes. Otherwise it stays as it was.
	if (top != null && (count <= 0 || topCardId != null || top.innerHTML === "")) {
		top.innerHTML = honeycomb.combatScene.deckTopMarkup(pileArrayName, count, topCardId);
	}
};

//The pile-array name for an engine pile index ("discardPile" -> "discardPileArray").
honeycomb.combatScene.pileArrayFor = function (pileIndex) {
	var displayArray = honeycomb.combatScene.pileDisplayArray;
	for (var scanIndex = 0; scanIndex < displayArray.length; scanIndex++) {
		if (displayArray[scanIndex].pile == pileIndex) return displayArray[scanIndex].index;
	}
	return null;
};

honeycomb.combatScene.pileElement = function (pileArrayName) {
	var display = honeycomb.findDefinition(honeycomb.combatScene.pileDisplayArray, pileArrayName);
	return display == null || display.elementId == null ? null : document.getElementById(display.elementId);
};

//A card-shaped rectangle on a pile: where a card leaving the pile sets off from, and what one arriving
//shrinks into. The top of the stack when the pile is drawn as one; otherwise a card standing on its
//icon. Null for a pile with nothing on screen.
honeycomb.combatScene.pileCardBox = function (pileArrayName) {
	var element = honeycomb.combatScene.pileElement(pileArrayName);
	if (element == null) return null;
	var top = element.getElementsByClassName("hcDeckTop")[0];
	if (top != null) {
		var topBox = top.getBoundingClientRect();
		if (topBox.width > 0) return topBox;
	}
	var icon = element.getElementsByClassName("hcPileIcon")[0];
	var iconBox = (icon == null ? element : icon).getBoundingClientRect();
	if (iconBox.width === 0) return null;
	var height = iconBox.height * honeycomb.tuning.animation.pileCardHeightMultiple;
	var width = height * honeycomb.tuning.art.cardFrame.aspect;
	return {
		left: iconBox.left + iconBox.width / 2 - width / 2,
		top: iconBox.top + iconBox.height / 2 - height / 2,
		width: width,
		height: height,
	};
};

//Moves a pile's printed number by `delta`, redraws its stack, and bumps it when a card has just landed
//on it. `topCardId` is that card, for a pile that shows its top card face up.
honeycomb.combatScene.tickPile = function (pileArrayName, delta, bump, topCardId) {
	var element = honeycomb.combatScene.pileElement(pileArrayName);
	if (element == null) return;
	var number = element.getElementsByClassName("hcPileNumber")[0];
	if (number != null) {
		var value = parseInt(number.textContent, 10);
		var next = Math.max(0, (isNaN(value) ? 0 : value) + delta);
		number.textContent = String(next);
		honeycomb.combatScene.refreshPileDeck(element, pileArrayName, next, topCardId);
	}
	if (bump != true) return;
	element.classList.remove("hcPileBump");
	//Reading layout restarts the bump when a second card lands before the first one's has finished.
	void element.offsetWidth;
	element.classList.add("hcPileBump");
};

honeycomb.combatScene.setPileNumber = function (pileArrayName, value) {
	var element = honeycomb.combatScene.pileElement(pileArrayName);
	var number = element == null ? null : element.getElementsByClassName("hcPileNumber")[0];
	if (number != null) number.textContent = String(Math.max(0, value));
	honeycomb.combatScene.refreshPileDeck(element, pileArrayName, Math.max(0, value), null);
};

//Notes that something is moving for `milliseconds` (unscaled) from now.
honeycomb.combatScene.holdMotion = function (milliseconds) {
	var until = Date.now() + honeycomb.duration(milliseconds);
	if (until > honeycomb.combatScene.handMotion.settlesAt) honeycomb.combatScene.handMotion.settlesAt = until;
};

//Real milliseconds until everything the replay set moving has landed.
honeycomb.combatScene.motionRemaining = function () {
	return Math.max(0, honeycomb.combatScene.handMotion.settlesAt - Date.now());
};

honeycomb.combatScene.handSlotFor = function (cardInstanceId) {
	var hand = document.getElementById("honeycombHand");
	if (hand == null || cardInstanceId == null) return null;
	var slotArray = hand.getElementsByClassName("hcHandSlot");
	for (var slotIndex = 0; slotIndex < slotArray.length; slotIndex++) {
		if (slotArray[slotIndex].dataset.hcslotfor == cardInstanceId) return slotArray[slotIndex];
	}
	return null;
};

//The horizontal part of an element's current `translate`, mid-transition included.
honeycomb.combatScene.translateX = function (computed) {
	var parsed = parseFloat(computed == null ? "" : computed.getPropertyValue("translate"));
	return isNaN(parsed) ? 0 : parsed;
};

//RE-FANNING. `change` adds or removes slots; afterwards every card that was already there slides from
//where it stood to where it now belongs, and its angle eases to the new spread. FLIP, on the slot's
//`translate` -- the fan's own `transform` is a different property, so the two never overwrite each
//other (the same split the fighters use). Measured from what is on screen NOW, current transitions
//included, so a card still sliding from the last change carries on from where it has got to.
honeycomb.combatScene.reflowHand = function (change) {
	var hand = document.getElementById("honeycombHand");
	if (hand == null) {
		if (change != null) change(null);
		return;
	}
	hand.classList.add("hcHandFlowing");
	var slotArray = hand.getElementsByClassName("hcHandSlot");

	var beforeArray = {};
	for (var measureIndex = 0; measureIndex < slotArray.length; measureIndex++) {
		var measured = slotArray[measureIndex];
		var computed = window.getComputedStyle(measured);
		beforeArray[measured.dataset.hcslotfor] = {
			layoutLeft: measured.offsetLeft,
			translateX: honeycomb.combatScene.translateX(computed),
			transform: computed.transform,
		};
	}

	if (change != null) change(hand);

	//The hand just changed size, so the spacing is refitted BEFORE the new places are read below: the
	//cards then glide to their new spread with the rest of the re-fan rather than jumping to it.
	honeycomb.combatScene.fitHandFan(hand);

	var count = slotArray.length;
	var movedArray = [];
	for (var slotIndex = 0; slotIndex < count; slotIndex++) {
		var slot = slotArray[slotIndex];
		var fan = honeycomb.combatScene.handFanStyle(slotIndex, count);
		slot.dataset.hchandindex = String(slotIndex);
		slot.style.setProperty("--hcFanZ", String(fan.zIndex));
		var before = beforeArray[slot.dataset.hcslotfor];
		//THE HELD CARD STAYS HELD. A card picked up during a replay keeps its lift;
		//only the place it returns to on release moves with the fan.
		if (slot === honeycomb.combatScene.dragSlot) {
			honeycomb.combatScene.dragStartTransform = fan.transform;
			continue;
		}
		//A slot the change just made is placed by whoever made it.
		if (before == null) { slot.style.transform = fan.transform; continue; }
		//Put back exactly where it was showing, with no transition...
		slot.classList.add("hcHandSettling");
		slot.style.setProperty("translate", (before.translateX + before.layoutLeft - slot.offsetLeft).toFixed(1) + "px 0px");
		slot.style.transform = before.transform == "none" ? "" : before.transform;
		movedArray.push({ slot: slot, transform: fan.transform });
	}
	//...committed by reading layout, then released to travel to its new place.
	void hand.offsetWidth;
	for (var releaseIndex = 0; releaseIndex < movedArray.length; releaseIndex++) {
		var moved = movedArray[releaseIndex];
		moved.slot.classList.remove("hcHandSettling");
		moved.slot.style.setProperty("translate", "0px 0px");
		moved.slot.style.transform = moved.transform;
	}
	honeycomb.combatScene.holdMotion(honeycomb.tuning.animation.handFlowMs);
};

//A CARD ARRIVING. A slot is made for it at the end of the fan, which opens out to take it, and the card
//flies into that slot from `fromBox` -- the draw pile, or wherever it was conjured -- growing from the
//size of what it came out of. Returns false when there was nothing to do: a card already in the hand
//being shown (a mid-replay repaint may have put it there), or no hand on screen.
honeycomb.combatScene.dealIntoHand = function (cardInstanceId, fromBox) {
	var run = honeycomb.state.run;
	if (run == null || run.combat == null) return false;
	if (document.getElementById("honeycombHand") == null) return false;
	if (honeycomb.combatScene.handSlotFor(cardInstanceId) != null) return false;

	var slot = null;
	honeycomb.combatScene.reflowHand(function (hand) {
		var count = hand.getElementsByClassName("hcHandSlot").length + 1;
		var holder = document.createElement("div");
		holder.innerHTML = honeycomb.combatScene.renderHandCard(cardInstanceId, count - 1, count);
		slot = holder.firstElementChild;
		if (slot == null) return;
		//Made still, so it cannot show at its final place for a frame before it is sent back to start.
		slot.classList.add("hcHandSettling", "hcHandArriving");
		hand.appendChild(slot);
	});
	if (slot == null) return false;

	var card = slot.getElementsByClassName("hcHandCard")[0];
	if (card != null) card.addEventListener("pointerdown", honeycomb.combatScene.onPointerDown);
	if (card != null && fromBox != null) {
		//Shrunk first, then measured, then moved: `translate` is applied outside every other transform,
		//so the offset that lands the shrunk card's centre on the source is exact whatever the fan angle.
		var fullBox = card.getBoundingClientRect();
		var startScale = fullBox.height === 0 ? 1 : Math.min(1, Math.max(
			honeycomb.tuning.animation.cardDealStartScaleMinimum, fromBox.height / fullBox.height));
		slot.style.setProperty("scale", startScale.toFixed(3));
		var smallBox = card.getBoundingClientRect();
		var offsetX = (fromBox.left + fromBox.width / 2) - (smallBox.left + smallBox.width / 2);
		var offsetY = (fromBox.top + fromBox.height / 2) - (smallBox.top + smallBox.height / 2);
		slot.style.setProperty("translate", offsetX.toFixed(1) + "px " + offsetY.toFixed(1) + "px");
		void slot.offsetWidth;
	}
	slot.classList.remove("hcHandSettling");
	slot.style.setProperty("translate", "0px 0px");
	slot.style.setProperty("scale", "1");
	honeycomb.combatScene.holdMotion(honeycomb.tuning.animation.cardDealMs);
	return true;
};

//A CARD LEAVING. Its slot is taken out and the fan closes up; a copy flies from where it stood to
//`pileArrayName`, or burns up in place when that pile has nothing on screen. A null pile only removes
//it (the played card, whose flight is already the visible copy). False when it was not in the hand.
honeycomb.combatScene.leaveHand = function (cardInstanceId, pileArrayName) {
	var slot = honeycomb.combatScene.handSlotFor(cardInstanceId);
	if (slot == null) return false;
	var card = slot.getElementsByClassName("hcHandCard")[0];
	var fromBox = card == null ? null : card.getBoundingClientRect();
	honeycomb.combatScene.reflowHand(function () {
		if (slot.parentNode) slot.parentNode.removeChild(slot);
	});
	if (pileArrayName != null && fromBox != null && fromBox.width > 0) {
		honeycomb.combatScene.sendToPile(cardInstanceId, fromBox, pileArrayName, {});
	}
	return true;
};

//A standalone copy of a card, fixed over `box`, for anything that travels outside the hand. Face down
//draws the placeholder back (HC-PLACEHOLDER: cards/frames/playerBack replaces it when drawn).
honeycomb.combatScene.cardGhost = function (cardInstanceId, box, faceDown) {
	var host = honeycomb.rootElement();
	if (host == null || box == null) return null;
	var element = document.createElement("div");
	element.className = "hcCardGhost";
	element.style.left = Math.round(box.left) + "px";
	element.style.top = Math.round(box.top) + "px";
	element.style.width = Math.round(box.width) + "px";
	element.style.height = Math.round(box.height) + "px";
	var resolved = faceDown == true ? null : honeycomb.combat.resolveById(cardInstanceId);
	element.innerHTML = resolved == null
		? honeycomb.combatScene.cardBackMarkup()
		: honeycomb.ui.card(resolved, { size: "medium", showTooltip: false, showAffinity: false });
	host.appendChild(element);
	return element;
};

//A card travelling from `fromBox` into a pile, turning and shrinking into the pile's icon; the pile's
//number ticks when it lands, unless `options.onLand` says what landing does instead. `options.delayMs`
//holds it back (unscaled) before it sets off, and `options.faceDown` flies its back.
honeycomb.combatScene.sendToPile = function (cardInstanceId, fromBox, pileArrayName, options) {
	var settings = options == null ? {} : options;
	var animation = honeycomb.tuning.animation;
	var delayMs = settings.delayMs == null ? 0 : settings.delayMs;
	var toBox = honeycomb.combatScene.pileCardBox(pileArrayName);
	if (toBox == null) {
		//Nowhere on screen to go: it burns away where it is.
		honeycomb.combatScene.burnCard(cardInstanceId, fromBox, delayMs);
		return;
	}
	var epoch = honeycomb.combatScene.handMotion.epoch;

	function land() {
		if (epoch != honeycomb.combatScene.handMotion.epoch) return;
		if (typeof settings.onLand === "function") {
			settings.onLand();
			honeycomb.combatScene.tickPile(pileArrayName, 0, true);
			return;
		}
		//The card that landed is now the top of the pile.
		honeycomb.combatScene.tickPile(pileArrayName, 1, true, settings.faceDown == true ? null : cardInstanceId);
	}

	function launch() {
		var element = honeycomb.combatScene.cardGhost(cardInstanceId, fromBox, settings.faceDown == true);
		if (element == null) { land(); return; }
		var offsetX = (toBox.left + toBox.width / 2) - (fromBox.left + fromBox.width / 2);
		var offsetY = (toBox.top + toBox.height / 2) - (fromBox.top + fromBox.height / 2);
		var scale = fromBox.height === 0 ? 1 : toBox.height / fromBox.height;
		//Cards bound left turn left, cards bound right turn right, so each reads as tossed that way.
		var turn = (offsetX < 0 ? -1 : 1) * animation.pileFlightTurnDegrees;
		void element.offsetWidth;
		element.classList.add("hcGhostTravelling");
		element.style.transform = "translate(" + offsetX.toFixed(1) + "px," + offsetY.toFixed(1) + "px) rotate(" +
			turn + "deg) scale(" + scale.toFixed(3) + ")";
		setTimeout(function () {
			if (element.parentNode) element.parentNode.removeChild(element);
			land();
		}, honeycomb.duration(animation.pileFlightMs));
	}

	if (delayMs > 0) setTimeout(launch, honeycomb.duration(delayMs));
	else launch();
	honeycomb.combatScene.holdMotion(delayMs + animation.pileFlightMs);
};

//EXHAUSTED: the card flares and burns away where it stands. HC-PLACEHOLDER: a CSS flare and fade (the
//hcCardBurn keyframes); a drawn dissolve replaces them with no code change.
honeycomb.combatScene.burnCard = function (cardInstanceId, box, delayMs) {
	var animation = honeycomb.tuning.animation;
	var wait = delayMs == null ? 0 : delayMs;
	function ignite() {
		var element = honeycomb.combatScene.cardGhost(cardInstanceId, box, false);
		if (element == null) return;
		element.classList.add("hcCardBurning");
		setTimeout(function () {
			if (element.parentNode) element.parentNode.removeChild(element);
		}, honeycomb.duration(animation.exhaustMs));
	}
	if (wait > 0) setTimeout(ignite, honeycomb.duration(wait));
	else ignite();
	honeycomb.combatScene.holdMotion(wait + animation.exhaustMs);
};

//THE PLAYED CARD, SPENT, is filed: it goes on from where its flight ended to the discard, or burns
//there if it exhausts. It sets off only once the flight has landed, so the one card is never in two
//places. A card played from somewhere other than the hand has no flight, and is sent from the hand
//(when it is somehow still shown there) or quietly counted.
honeycomb.combatScene.playSpentCard = function (entry, pileArrayName) {
	var playedEnd = honeycomb.combatScene.handMotion.playedEnd;
	honeycomb.combatScene.handMotion.playedEnd = null;
	if (playedEnd == null) return honeycomb.combatScene.playCardMove(entry, pileArrayName, null);
	//Real milliseconds until the flight lands, turned back into play-speed ones for sendToPile, which
	//scales whatever it is given.
	var remaining = Math.max(0, playedEnd.landsAt - Date.now());
	var delayMs = remaining * honeycomb.tuning.animation.speedMultiplier * honeycomb.playSpeedMultiplier();
	honeycomb.combatScene.sendToPile(entry.cardId, playedEnd.box, pileArrayName, { delayMs: delayMs });
	return 0;
};

//A CARD MOVED from one place to another. Out of the hand when it is in the hand being shown; otherwise
//out of the pile it was filed in -- the entry's `fromPileArray` when the engine said, else
//`defaultFromArray`. Returns the gap before the next entry.
honeycomb.combatScene.playCardMove = function (entry, toPileArray, defaultFromArray) {
	var animation = honeycomb.tuning.animation;
	if (honeycomb.combatScene.leaveHand(entry.cardId, toPileArray) == true) return animation.cardDiscardGapMs;

	var fromArray = entry.fromPileArray != null ? entry.fromPileArray : defaultFromArray;
	//Leaving the hand without being in the hand shown means a repaint already took it away. The piles'
	//numbers were redrawn by the same repaint, so there is nothing left to show.
	if (fromArray == "handArray") return 0;
	var fromBox = honeycomb.combatScene.pileCardBox(fromArray);
	if (fromBox == null) {
		if (honeycomb.combatScene.pileElement(toPileArray) != null) honeycomb.combatScene.tickPile(toPileArray, 1, true);
		return 0;
	}
	honeycomb.combatScene.tickPile(fromArray, -1, false);
	honeycomb.combatScene.sendToPile(entry.cardId, fromBox, toPileArray, {});
	return animation.cardDiscardGapMs;
};

//A CARD ARRIVING IN THE HAND from a pile: the draw pile for an ordinary draw, `fromPileArray` for a card
//an effect fetched. A pile with nothing on screen (exhaust) sends it from the middle of the field.
honeycomb.combatScene.playCardArrival = function (entry, fromPileArray) {
	var fromArray = fromPileArray == null ? "drawPileArray" : fromPileArray;
	var fromBox = honeycomb.combatScene.pileCardBox(fromArray);
	if (fromBox == null) fromBox = honeycomb.combatScene.fieldCardBox(0);
	if (honeycomb.combatScene.dealIntoHand(entry.cardId, fromBox) == true) honeycomb.combatScene.tickPile(fromArray, -1, false);
	return honeycomb.tuning.animation.cardDealGapMs;
};

//A readable, card-shaped rectangle over the battlefield: centred on `sourceId`'s fighter when given,
//else on the middle of the field, and moved along by `spreadIndex` card-widths' worth of the tuned
//spread so a second card made in the same beat does not cover the first.
honeycomb.combatScene.fieldCardBox = function (spreadIndex, sourceId) {
	var animation = honeycomb.tuning.animation;
	var field = document.getElementById("honeycombBattlefield");
	if (field == null) return null;
	var fieldBox = field.getBoundingClientRect();
	var height = fieldBox.height * animation.createdCardHeightFraction;
	var width = height * honeycomb.tuning.art.cardFrame.aspect;
	var fighter = honeycomb.combatScene.fighterElement(sourceId);
	var fighterBox = fighter == null ? null : fighter.getBoundingClientRect();
	var centreX = fighterBox == null || fighterBox.width === 0
		? fieldBox.left + fieldBox.width / 2 : fighterBox.left + fighterBox.width / 2;
	//Cards made by an enemy line up toward the middle of the field, everyone else's away from the edge.
	var direction = fighter != null && fighter.classList.contains("hcFighter-enemy") ? -1 : 1;
	centreX += direction * spreadIndex * width * animation.createdCardSpreadFraction;
	centreX = Math.min(fieldBox.right - width / 2, Math.max(fieldBox.left + width / 2, centreX));
	return {
		left: centreX - width / 2,
		top: fieldBox.top + (fieldBox.height - height) / 2,
		width: width,
		height: height,
	};
};

//A CARD THAT DID NOT EXIST A MOMENT AGO -- a Wisp an enemy slipped into the discard, a card conjured
//into the hand. It appears over whoever made it, at a size that can be read, says where it is going, is
//held long enough to be read, and only then travels there. A card simply turning up in a pile count is
//the "forced into your discard pile" moment the tester could not see. Returns the replay's gap.
honeycomb.combatScene.showCreatedCard = function (entry) {
	var animation = honeycomb.tuning.animation;
	var pileArrayName = honeycomb.combatScene.pileArrayFor(entry.pile);
	var box = honeycomb.combatScene.fieldCardBox(honeycomb.combatScene.handMotion.createdShown, entry.sourceId);
	var element = box == null ? null : honeycomb.combatScene.cardGhost(entry.cardId, box, false);
	if (element == null) {
		if (pileArrayName != null) honeycomb.combatScene.tickPile(pileArrayName, 1, true);
		return 0;
	}
	honeycomb.combatScene.handMotion.createdShown += 1;
	var display = honeycomb.findDefinition(honeycomb.combatScene.pileDisplayArray, pileArrayName);
	if (display != null && display.arrivalText !== "") {
		var caption = document.createElement("div");
		caption.className = "hcCreatedCaption";
		caption.textContent = display.arrivalText;
		element.appendChild(caption);
	}
	element.classList.add("hcCardConjured");
	honeycomb.platform.sound("cardDraw");

	var shownMs = animation.createdCardRevealMs + animation.createdCardHoldMs;
	var epoch = honeycomb.combatScene.handMotion.epoch;
	setTimeout(function () {
		if (element.parentNode) element.parentNode.removeChild(element);
		//A repaint since has already drawn the card where it went.
		if (epoch != honeycomb.combatScene.handMotion.epoch) return;
		if (entry.pile == "hand") honeycomb.combatScene.dealIntoHand(entry.cardId, box);
		else if (pileArrayName != null) honeycomb.combatScene.sendToPile(entry.cardId, box, pileArrayName, {});
	}, honeycomb.duration(shownMs));
	honeycomb.combatScene.holdMotion(shownMs + Math.max(animation.pileFlightMs, animation.cardDealMs));
	return animation.createdCardGapMs;
};

//THE RESHUFFLE: the discard is emptied into the draw pile, shown as a few card backs flying across to
//stand for the lot. The replay waits until they have all landed, so the draw that follows takes its
//card from a pile that visibly has cards in it. Returns the replay's gap.
honeycomb.combatScene.playReshuffle = function (count) {
	var animation = honeycomb.tuning.animation;
	var fromBox = honeycomb.combatScene.pileCardBox("discardPileArray");
	var toBox = honeycomb.combatScene.pileCardBox("drawPileArray");
	honeycomb.combatScene.setPileNumber("discardPileArray", 0);
	if (fromBox == null || toBox == null || count <= 0) {
		honeycomb.combatScene.setPileNumber("drawPileArray", count);
		return animation.cardDealGapMs;
	}
	var shownCount = Math.min(count, animation.reshuffleCardMaximum);
	for (var cardIndex = 0; cardIndex < shownCount; cardIndex++) {
		var isLast = cardIndex == shownCount - 1;
		//Each back ticks the draw pile by one as it lands; the last makes up the rest of the count, in
		//its own landing so nothing can tick after it.
		honeycomb.combatScene.sendToPile(null, fromBox, "drawPileArray", {
			faceDown: true,
			delayMs: cardIndex * animation.reshuffleGapMs,
			onLand: isLast ? function () { honeycomb.combatScene.setPileNumber("drawPileArray", count); } : null,
		});
	}
	//One more gap after the last lands, so the draw that follows cannot tick the pile before it is full.
	return shownCount * animation.reshuffleGapMs + animation.pileFlightMs;
};

//A NEW FIGHT'S FIRST HAND IS DEALT, not simply there. combat.begin draws it before the scene exists, so
//the hand is taken back off the screen and played in as a replay of ordinary draws, after the banner
//that says whose turn it is.
honeycomb.combatScene.dealOpeningHand = function () {
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var hand = document.getElementById("honeycombHand");
	if (combat == null || hand == null || combat.handArray.length === 0) return;
	var logArray = [{ type: "turnStart", side: "ally", turn: combat.turnNumber }];
	for (var handIndex = 0; handIndex < combat.handArray.length; handIndex++) {
		logArray.push({ type: "cardDrawn", cardId: combat.handArray[handIndex] });
	}
	while (hand.firstChild) hand.removeChild(hand.firstChild);
	honeycomb.combatScene.tickPile("drawPileArray", combat.handArray.length, false);
	honeycomb.combatScene.playLog(logArray, function () { honeycomb.combatScene.afterBeat(); });
};
