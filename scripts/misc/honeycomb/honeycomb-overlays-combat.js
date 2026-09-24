//===================================================================================================
//HONEYCOMB CATACOMBS -- combat outcome overlays
//===================================================================================================
//Victory and defeat, and the reward flow that hangs off victory.
//
//Rewards are OFFERED, then TAKEN. finishVictory computes what is on the table without granting any of
//it except gold; the player then picks a card or skips. Keeping those apart is what allows a reward
//screen to be reopened, cancelled, or extended with new reward kinds without the engine caring.
//
//WHERE THE PLAYER GOES AFTERWARDS is not this screen's decision. A fight carries a CONTINUATION -- set
//by whatever started it -- and the screen asks honeycomb.combatContinuationArray what that means. A map
//node's fight returns to the map; an event's fight returns to the event, on the page it named. A third
//way into a fight is a table entry here and nothing else.
window.honeycomb = window.honeycomb || {};

//---------------------------------------------------------------------------------------------------
//Continuations
//---------------------------------------------------------------------------------------------------
//  buttonLabel      what the leave button says
//  lead(c)          optional text shown on the victory screen, above the rewards -- where an event's
//                   story carries on through the fight
//  finish(c)        where the player is taken once the rewards are dealt with
honeycomb.combatContinuationArray = [
	{
		index: "map",
		buttonLabel: "Onward",
		finish: function () { honeycomb.map.returnToMap(); },
	},
	{
		//Back into the event that started the fight. The event overlay reopens over the map, on the page
		//the fight was asked to lead to, or showing what the choice said happened.
		index: "event",
		buttonLabel: "Continue",
		lead: function (continuation) {
			var event = honeycomb.findDefinition(honeycomb.eventArray, continuation.eventIndex);
			return continuation.victoryText != null ? continuation.victoryText : (event == null ? "" : event.name + " continues.");
		},
		finish: function (continuation) {
			honeycomb.scene.go("map");
			honeycomb.overlay.open("event", {
				eventIndex: continuation.eventIndex,
				pageIndex: continuation.pageIndex,
				resultText: continuation.pageIndex == null ? continuation.resultText : null,
				nodeId: continuation.nodeId,
				fromCombat: true,
			});
		},
	},
];

honeycomb.combatContinuation = function (continuation) {
	var index = continuation == null || continuation.index == null ? "map" : continuation.index;
	var definition = honeycomb.findDefinition(honeycomb.combatContinuationArray, index);
	return definition == null ? honeycomb.findDefinition(honeycomb.combatContinuationArray, "map") : definition;
};

//---------------------------------------------------------------------------------------------------
//Victory
//---------------------------------------------------------------------------------------------------
honeycomb.overlay.register({
	index: "victory",
	build: function (layer) {
		//What a won fight pays out lives in honeycomb.combat.settleVictory, so the balance simulation pays
		//exactly what this screen pays.
		var reward = honeycomb.combat.settleVictory();
		if (reward == null) { honeycomb.overlay.close("victory"); return; }

		//finishVictory has just cleared every non-carried status, but the board behind this overlay still
		//wears the last frame's chips, so each standing plate is redrawn from the live entity. The overlay
		//itself is on the overlay host and is not touched.
		if (honeycomb.combatScene != null && honeycomb.state.run != null && honeycomb.state.run.partyArray != null) {
			for (var memberIndex = 0; memberIndex < honeycomb.state.run.partyArray.length; memberIndex++) {
				honeycomb.combatScene.updateVitals(honeycomb.state.run.partyArray[memberIndex].instanceId, null);
			}
		}

		honeycomb.victoryOverlay.pendingReward = reward;

		layer.innerHTML = honeycomb.victoryOverlay.render(reward);
	},
});

honeycomb.victoryOverlay = { pendingReward: null };

//The "first time" lines under the reward tiles. Silent when nothing was new, so an ordinary fight
//does not print an empty heading.
honeycomb.victoryOverlay.renderDiscoveries = function (experience) {
	if (experience == null) return "";
	var nameArray = [];
	for (var lineIndex = 0; lineIndex < experience.lineArray.length; lineIndex++) {
		var line = experience.lineArray[lineIndex];
		for (var nameIndex = 0; nameIndex < line.newNameArray.length; nameIndex++) {
			if (nameArray.indexOf(line.newNameArray[nameIndex]) >= 0) continue;
			nameArray.push(line.newNameArray[nameIndex]);
		}
	}
	if (nameArray.length === 0) return "";

	var markup = '<div class="hcDiscoveryRow">';
	markup += '<span class="hcDiscoveryTag">New</span>';
	for (var chipIndex = 0; chipIndex < nameArray.length; chipIndex++) {
		markup += '<span class="hcDiscoveryName">' + honeycomb.escapeText(nameArray[chipIndex]) + "</span>";
	}
	markup += "</div>";
	return markup;
};

honeycomb.victoryOverlay.render = function (reward) {
	var continuation = honeycomb.combatContinuation(reward.continuation);
	var markup = '<div class="hcOverlayPanel hcVictoryPanel">';
	markup += '<h2 class="hcOverlayTitle">Victory</h2>';
	//A fight won some other way than everyone falling says how: "The Matriarch is beaten, and her brood scatters."
	if (reward.decidedText != null && reward.decidedText !== "") {
		markup += '<div class="hcOverlayBody hcVictoryLead">' + honeycomb.escapeText(reward.decidedText) + "</div>";
	}
	//The story this fight belongs to, carried through it -- an event's fight is a beat in that event.
	var lead = continuation.lead == null ? "" : continuation.lead(reward.continuation);
	if (lead !== "") markup += '<div class="hcOverlayBody hcVictoryLead">' + honeycomb.escapeText(lead) + "</div>";

	markup += '<div class="hcRewardRow">';
	markup += '<div class="hcRewardTile">' +
		honeycomb.ui.resourceIcon("gold", "hcRewardIcon") +
		'<div class="hcRewardValue">+' + reward.gold + "</div>" +
		'<div class="hcTiny hcMuted">Gold</div></div>';
	//The relic a fight paid, shown beside the gold. An elite or a boss always has one.
	if (reward.relicIndex != null) {
		var paidRelic = honeycomb.findDefinition(honeycomb.relicArray, reward.relicIndex);
		if (paidRelic != null) {
			markup += '<div class="hcRewardTile">' +
				honeycomb.ui.iconTag(paidRelic.iconPath, "shard", "#c9a961", { className: "hcRewardIcon" }) +
				'<div class="hcRewardValue hcGold">' + honeycomb.escapeText(paidRelic.name) + "</div>" +
				'<div class="hcTiny hcMuted">' + honeycomb.escapeText(paidRelic.description) + "</div></div>";
		}
	}
	//Experience is a LIFETIME reward, so it is shown beside the gold rather than folded into it -- and
	//as two pools, never one number: global for what was new, personal for who fought.
	if (reward.experience != null && reward.experience.awarded > 0) {
		markup += honeycomb.ui.globalExperienceTile(reward.experience.awarded);
	}
	markup += "</div>";
	if (reward.experience != null) markup += honeycomb.ui.personalShareRow(reward.experience.shareArray);

	//Naming what was seen for the first time is the whole reason the bonus exists: a number alone
	//does not tell the player that pushing somewhere new paid better.
	markup += honeycomb.victoryOverlay.renderDiscoveries(reward.experience);

	if (reward.cardChoiceArray.length > 0) {
		markup += '<div class="hcSectionTitle hcCenterText">Choose a card</div>';
		markup += '<div class="hcRewardCardRow">';
		for (var choiceIndex = 0; choiceIndex < reward.cardChoiceArray.length; choiceIndex++) {
			var offer = reward.cardChoiceArray[choiceIndex];
			var definition = honeycomb.findDefinition(honeycomb.cardArray, offer.cardIndex);
			if (definition == null) continue;
			//Each offer is FOR somebody, and says who: the card joins that character's contribution.
			markup += '<div class="hcRewardCardSlot">';
			markup += honeycomb.ui.card(honeycomb.resolveCard({
				instanceId: null, cardIndex: definition.index, ownerInstanceId: offer.ownerInstanceId, upgradeLevel: 0,
			}), {
				size: "medium",
				showAffinity: true,
				onClick: "honeycomb.victoryOverlay.takeCard(" + choiceIndex + ")",
			});
			markup += honeycomb.victoryOverlay.renderOfferOwner(offer);
			//A banish strikes the card off this run's offer pools. It does NOT reroll the other offers.
			if (honeycomb.getResource("banish") > 0 && honeycomb.cardCanBeBanished(definition.index)) {
				markup += '<div class="hcBanishButton"' + honeycomb.tooltip.attributes("banish", "button") +
					' onclick="honeycomb.victoryOverlay.banish(' + choiceIndex + ')">Banish ' +
					honeycomb.ui.resourceCounter("banish") + "</div>";
			}
			markup += "</div>";
		}
		markup += "</div>";
	}

	markup += '<div class="hcOverlayButtonRow">';
	//A tree node ("Second Chance") grants reward rerolls; each re-rolls the card offers.
	if (reward.cardChoiceArray.length > 0 && honeycomb.getResource("reroll") > 0) {
		markup += '<div class="hcButton" onclick="honeycomb.victoryOverlay.reroll()">Reroll ' +
			honeycomb.ui.resourceCounter("reroll") + "</div>";
	}
	markup += '<div class="hcButton" onclick="honeycomb.victoryOverlay.skip()">' +
		(reward.cardChoiceArray.length > 0 ? "Take no card" : honeycomb.escapeText(continuation.buttonLabel)) + "</div>";
	markup += "</div></div>";
	return markup;
};

//REWARD REROLL (tree node). Spends one charge and re-rolls the card offers. Draws from the reward
//stream, so a seed plus the number of rerolls reproduces the screen exactly.
honeycomb.victoryOverlay.reroll = function () {
	if (honeycomb.getResource("reroll") <= 0) return;
	var reward = honeycomb.victoryOverlay.pendingReward;
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (reward == null || combat == null) return;
	var encounter = honeycomb.findDefinition(honeycomb.encounterArray, combat.encounterIndex);
	if (honeycomb.spend({ reroll: 1 }) == false) return;
	reward.cardChoiceArray = honeycomb.combat.rollCardReward(encounter, combat);
	var layer = document.getElementById(honeycomb.tuning.dom.overlayIdPrefix + "victory");
	if (layer != null) layer.innerHTML = honeycomb.victoryOverlay.render(reward);
};

//BANISH A REWARD (tree node). Spends one banish, records the card, and takes that offer off the screen
//-- the others stay exactly as they were (no reroll). The pool itself never offers the card again.
honeycomb.victoryOverlay.banish = function (offerIndex) {
	var reward = honeycomb.victoryOverlay.pendingReward;
	var offer = reward == null || reward.cardChoiceArray == null ? null : reward.cardChoiceArray[offerIndex];
	if (offer == null) return;
	if (honeycomb.banishCard(offer.cardIndex) == false) return;
	honeycomb.platform.sound("uiBack");
	reward.cardChoiceArray.splice(offerIndex, 1);
	var layer = document.getElementById(honeycomb.tuning.dom.overlayIdPrefix + "victory");
	if (layer != null) layer.innerHTML = honeycomb.victoryOverlay.render(reward);
};

//The name under an offer. Neutral cards say so, since "for nobody in particular" is a thing to know.
honeycomb.victoryOverlay.renderOfferOwner = function (offer) {
	var member = honeycomb.cardOwnerMember({ ownerInstanceId: offer.ownerInstanceId });
	var character = member == null ? null : honeycomb.findDefinition(honeycomb.characterArray, member.characterIndex);
	return '<div class="hcRewardOwner hcTiny"' +
		(character == null ? "" : ' style="--hcAccent:' + character.colorHint + '"') + ">" +
		honeycomb.escapeText(character == null ? "Anyone" : "For " + character.name) + "</div>";
};

//A taken card joins the run deck permanently, owned by the character it was offered for. The other
//offers on the screen are the ones NOT taken, so each is counted as skipped for the card telemetry.
honeycomb.victoryOverlay.takeCard = function (offerIndex) {
	var reward = honeycomb.victoryOverlay.pendingReward;
	var offer = reward == null ? null : reward.cardChoiceArray[offerIndex];
	honeycomb.victoryOverlay.noteOtherOffersSkipped(reward, offerIndex);
	if (offer != null) honeycomb.addCardToRunDeck(offer.cardIndex, offer.ownerInstanceId);
	honeycomb.platform.sound("rewardTaken");
	honeycomb.victoryOverlay.finish();
};

honeycomb.victoryOverlay.noteOtherOffersSkipped = function (reward, chosenIndex) {
	var offerArray = reward == null || reward.cardChoiceArray == null ? [] : reward.cardChoiceArray;
	for (var scanIndex = 0; scanIndex < offerArray.length; scanIndex++) {
		if (scanIndex == chosenIndex) continue;
		honeycomb.telemetry.noteCard("skipArray", offerArray[scanIndex].cardIndex);
	}
};

honeycomb.victoryOverlay.skip = function () {
	honeycomb.victoryOverlay.noteOtherOffersSkipped(honeycomb.victoryOverlay.pendingReward, -1);
	honeycomb.platform.sound("uiBack");
	honeycomb.victoryOverlay.finish();
};

honeycomb.victoryOverlay.finish = function () {
	var reward = honeycomb.victoryOverlay.pendingReward;
	var continuation = reward == null ? null : reward.continuation;
	honeycomb.victoryOverlay.pendingReward = null;
	honeycomb.combat.clear();
	honeycomb.overlay.close("victory");
	honeycomb.combatContinuation(continuation).finish(continuation == null ? {} : continuation);
};

//---------------------------------------------------------------------------------------------------
//Pile viewer
//---------------------------------------------------------------------------------------------------
//What is in each pile, opened by clicking the pile. A registry, so a new pile is a row.
//
//  hidesOrder   shown sorted rather than in pile order. The DRAW pile does: its order is what the
//               player is about to draw, and a viewer that showed it would be a peek at the future.
honeycomb.pileViewArray = [
	{ index: "drawPileArray", name: "Draw pile", hidesOrder: true, emptyText: "Nothing left to draw -- the discard pile shuffles back in." },
	{ index: "discardPileArray", name: "Discard pile", hidesOrder: false, emptyText: "Nothing discarded yet." },
	{ index: "exhaustPileArray", name: "Exhausted", hidesOrder: false, emptyText: "Nothing exhausted this fight." },
	{ index: "inPlayPileArray", name: "Powers in play", hidesOrder: false, emptyText: "No Powers played this fight." },
];

honeycomb.overlay.register({
	index: "pile",
	closeOnBackdrop: true,
	build: function (layer, params) {
		honeycomb.pileView.pileIndex = params == null || params.pile == null ? "drawPileArray" : params.pile;
		layer.innerHTML = honeycomb.pileView.render();
	},
});

honeycomb.pileView = { pileIndex: "drawPileArray" };

honeycomb.pileView.render = function () {
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var view = honeycomb.findDefinition(honeycomb.pileViewArray, honeycomb.pileView.pileIndex);
	var idArray = combat == null || view == null || combat[view.index] == null ? [] : combat[view.index].slice();
	if (view != null && view.hidesOrder == true) {
		idArray.sort(function (left, right) {
			var leftCard = honeycomb.combat.resolveById(left);
			var rightCard = honeycomb.combat.resolveById(right);
			return honeycomb.compareCardName(leftCard == null ? left : leftCard.index, rightCard == null ? right : rightCard.index);
		});
	}

	var markup = '<div class="hcOverlayPanel hcDeckPanel">';
	markup += '<h2 class="hcOverlayTitle">' + honeycomb.escapeText(view == null ? "Pile" : view.name) + "</h2>";

	//Every pile as a tab, with its count, so moving between them is one click.
	markup += '<div class="hcSegmented hcPileTabs">';
	for (var tabIndex = 0; tabIndex < honeycomb.pileViewArray.length; tabIndex++) {
		var tab = honeycomb.pileViewArray[tabIndex];
		var count = combat == null || combat[tab.index] == null ? 0 : combat[tab.index].length;
		markup += '<div class="hcSegment' + (tab.index == honeycomb.pileView.pileIndex ? " hcOn" : "") + '"' +
			' onclick="honeycomb.pileView.show(\'' + tab.index + '\')">' + honeycomb.escapeText(tab.name) + " " + count + "</div>";
	}
	markup += "</div>";
	if (view != null && view.hidesOrder == true) {
		markup += '<div class="hcOverlayBody hcTiny hcMuted hcCenterText">Shown in alphabetical order, not the order they will be drawn.</div>';
	}

	if (idArray.length === 0) {
		markup += '<div class="hcOverlayBody hcMuted hcCenterText">' + honeycomb.escapeText(view == null ? "" : view.emptyText) + "</div>";
	} else {
		markup += '<div class="hcDeckGrid hcScroll">';
		for (var cardIndex = 0; cardIndex < idArray.length; cardIndex++) {
			var resolved = honeycomb.combat.resolveById(idArray[cardIndex]);
			if (resolved == null) continue;
			markup += '<div class="hcDeckCell">' + honeycomb.ui.card(resolved, {
				size: "small",
				instanceId: idArray[cardIndex],
				cost: honeycomb.cardCost(resolved, "energy", honeycomb.newEffectContext({ combat: combat, card: resolved })),
			}) + "</div>";
		}
		markup += "</div>";
	}
	markup += '<div class="hcOverlayButtonRow"><div class="hcButton hcPrimary" onclick="honeycomb.overlay.close(\'pile\')">Close</div></div>';
	markup += "</div>";
	return markup;
};

honeycomb.pileView.show = function (pileIndex) {
	honeycomb.pileView.pileIndex = pileIndex;
	honeycomb.platform.sound("uiClick");
	for (var scanIndex = honeycomb.overlay.openArray.length - 1; scanIndex >= 0; scanIndex--) {
		if (honeycomb.overlay.openArray[scanIndex].index != "pile") continue;
		honeycomb.overlay.openArray[scanIndex].element.innerHTML = honeycomb.pileView.render();
		return;
	}
	honeycomb.overlay.open("pile", { pile: pileIndex });
};

//---------------------------------------------------------------------------------------------------
//An enemy's moves
//---------------------------------------------------------------------------------------------------
//Every move the enemy has, as cards. A move this profile has SEEN telegraphed is face up, worded with
//this enemy's live numbers; the rest stay face down until they are shown in a fight (the "intent"
//discovery kind). The move it will play next is marked, and the enemy's habit is named: a fixed
//sequence can be learned, a random one cannot.
honeycomb.overlay.register({
	index: "enemyMoves",
	closeOnBackdrop: true,
	build: function (layer, params) {
		layer.innerHTML = honeycomb.enemyMoves.render(params == null ? null : params.entityId);
	},
});

honeycomb.enemyMoves = {};

//What a combatant's move strategy (honeycomb.moveStrategyArray) tells the player, in words.
honeycomb.enemyMoves.habitArray = [
	{ index: "sequence", text: "Uses its moves in a fixed order." },
	{ index: "weighted", text: "Picks its moves at random, some more often than others." },
	{ index: "threshold", text: "Changes what it does once badly hurt." },
];

honeycomb.enemyMoves.show = function (entityId) {
	honeycomb.platform.sound("uiClick");
	honeycomb.tooltip.hide();
	honeycomb.overlay.open("enemyMoves", { entityId: entityId });
};

//Any AI combatant's moves -- an enemy's list, or the cards of a character the AI plays -- seen ones face
//up, the rest face down.
honeycomb.enemyMoves.render = function (entityId) {
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var enemy = combat == null ? null : honeycomb.findEntity(entityId, combat);
	var found = honeycomb.entityDefinition(enemy);
	var close = '<div class="hcOverlayButtonRow"><div class="hcButton hcPrimary" onclick="honeycomb.overlay.close(\'enemyMoves\')">Close</div></div>';
	if (found == null) return '<div class="hcOverlayPanel">' + close + "</div>";
	var definition = found.definition;
	var whoKey = honeycomb.entityKey(enemy);
	var moveIndexArray = honeycomb.moveIndexArray(enemy);

	var seenCount = 0;
	for (var countIndex = 0; countIndex < moveIndexArray.length; countIndex++) {
		if (honeycomb.enemyMoveSeen(enemy.enemyIndex, moveIndexArray[countIndex])) seenCount += 1;
	}
	var strategy = honeycomb.aiStrategyFor(enemy);
	var habit = strategy == null ? null : honeycomb.findDefinition(honeycomb.enemyMoves.habitArray, strategy.index);
	var faceChain = found.kind == "enemy" ? honeycomb.art.enemyPortraitChain(definition.index)
		: honeycomb.art.portraitChain(definition.index, enemy.outfitIndex);

	var markup = '<div class="hcOverlayPanel hcEnemyMovesPanel">';
	markup += '<div class="hcEnemyMovesHeader">' +
		honeycomb.art.chainTag(faceChain, { className: "hcEnemyMovesFace", alt: definition.name }) +
		'<div><h2 class="hcOverlayTitle">' + honeycomb.escapeText(definition.name) + "</h2>" +
		'<div class="hcTiny hcMuted">' + seenCount + " of " + moveIndexArray.length + " moves seen" +
		(habit == null ? "" : " &middot; " + honeycomb.escapeText(habit.text)) + "</div></div></div>";

	markup += honeycomb.enemyMoves.moveGridMarkup(enemy, combat, whoKey);
	markup += close + "</div>";
	return markup;
};

//THE MOVE GRID, shared by the in-combat window and the Compendium's bestiary: seen moves face up, the
//rest face down, and the move set to be played next marked with its tag. `combat` may be
//null -- the bestiary reads an enemy definition, not a fight -- in which case nothing is marked.
honeycomb.enemyMoves.moveGridMarkup = function (enemy, combat, whoKey) {
	var moveIndexArray = honeycomb.moveIndexArray(enemy);
	var markup = '<div class="hcEnemyMovesGrid hcScroll">';
	for (var moveIndex = 0; moveIndex < moveIndexArray.length; moveIndex++) {
		var cardIndex = moveIndexArray[moveIndex];
		var seen = honeycomb.enemyMoveSeen(enemy.enemyIndex, cardIndex);
		var next = combat != null && enemy.downed != true && enemy.intentCardIndex == cardIndex;
		markup += '<div class="hcEnemyMoveCell' + (next ? " hcNextMove" : "") + '">';
		if (next) markup += '<div class="hcNextMoveTag"' + honeycomb.tooltip.attributes("enemyMoves", "nextMove") + ">Next move</div>";
		if (seen) {
			markup += honeycomb.tooltip.moveCardPanel(enemy, cardIndex, combat);
		} else {
			//HC-PLACEHOLDER: a drawn card back replaces the CSS one by existing at this path.
			markup += '<div class="hcCard hcCardBack">' +
				honeycomb.imageTag("cards/frames/enemyBack", { className: "hcCardBackArt", alt: "", silentFallback: true }) +
				'<div class="hcCardBackMark">?</div></div>' +
				'<div class="hcTooltipNote hcCenterText">Not seen yet.</div>';
		}
		markup += "</div>";
	}
	return markup + "</div>";
};

//---------------------------------------------------------------------------------------------------
//The battle log
//---------------------------------------------------------------------------------------------------
//A record of the fight, so the player can read effects they may have missed or misunderstood. The
//engine keeps the history (honeycomb.battleLog, combat.historyArray); this puts it into words, grouped
//by turn, newest at the bottom. It opens from the Log button beside the draw pile -- a button rather
//than a hover, so a touchscreen reads it the same way.
honeycomb.overlay.register({
	index: "battleLog",
	closeOnBackdrop: true,
	build: function (layer) {
		layer.innerHTML = honeycomb.battleLogView.render();
		//Opened at the latest events: what just happened is what the player came to check.
		var list = layer.querySelector(".hcBattleLogList");
		if (list != null) list.scrollTop = list.scrollHeight;
	},
});

honeycomb.battleLogView = {};

//HOW EACH KIND OF EVENT IS SAID. One entry per history kind; `words(line, say)` returns markup, or ""
//to leave the line out (a heal of nothing, say). `tone` colours the line's edge: harm, guard, heal,
//status, play, enemy, neutral. A new kind of event is a table entry here plus its name in
//honeycomb.battleLog.kindArray.
honeycomb.battleLogWordArray = [
	{ index: "intent", tone: "enemy", glyph: "eye", words: function (line, say) {
		//Older saves logged an intent instead of a card; a line with no card says nothing.
		return line.card == null ? "" : say.name(line.targetId) + " readies " + say.card(line.card) + ".";
	} },
	{ index: "cardPlayed", tone: "play", glyph: "spiral", words: function (line, say) {
		var aimed = line.targetId != null && line.targetId != line.sourceId;
		return say.name(line.sourceId) + " played " + say.card(line.card) + (aimed ? " on " + say.name(line.targetId) : "") + ".";
	} },
	{ index: "abilityUsed", tone: "play", glyph: "star", words: function (line, say) {
		var ability = honeycomb.findDefinition(honeycomb.abilityArray, line.ability);
		var aimed = line.targetId != null && line.targetId != line.sourceId;
		return say.name(line.sourceId) + " used " + say.strong(ability == null ? line.ability : ability.name) +
			(aimed ? " on " + say.name(line.targetId) : "") + ".";
	} },
	{ index: "moveUsed", tone: "enemy", glyph: "sword", words: function (line, say) {
		return say.name(line.sourceId) + " played " + say.card(line.card) + ".";
	} },
	//Legacy: old saves logged an intent rather than a card.
	{ index: "enemyAction", tone: "enemy", glyph: "sword", words: function (line, say) {
		return say.name(line.sourceId) + " used " + say.strong(String(line.intent)) + ".";
	} },
	//Every line that happened to somebody names what did it, through say.via.
	{ index: "damage", tone: "harm", glyph: "drop", words: function (line, say) {
		var from = say.via(line);
		if (line.amount <= 0 && line.absorbed > 0) {
			return say.name(line.targetId) + "'s Temporary HP absorbed " + say.number(line.absorbed) + from + ".";
		}
		return say.name(line.targetId) + " took " + say.number(line.amount) + " damage" + from +
			(line.absorbed > 0 ? " (" + say.number(line.absorbed) + " absorbed)" : "") + ".";
	} },
	{ index: "temporaryHealth", tone: "guard", glyph: "shield", words: function (line, say) {
		return line.amount > 0 ? say.name(line.targetId) + " gained " + say.number(line.amount) +
			" Temporary HP" + say.via(line) + "." : "";
	} },
	{ index: "temporaryRemoved", tone: "harm", glyph: "shield", words: function (line, say) {
		return line.amount > 0 ? say.name(line.targetId) + (line.spent == true ? " spent " : " lost ") + say.number(line.amount) +
			" Temporary HP" + say.via(line) + "." : "";
	} },
	{ index: "temporaryDecayed", tone: "neutral", glyph: "shield", words: function (line, say) {
		return line.amount > 0 ? say.name(line.targetId) + "'s Temporary HP halved, losing " +
			say.number(line.amount) + "." : "";
	} },
	{ index: "heal", tone: "heal", glyph: "heart", words: function (line, say) {
		return line.amount > 0 ? say.name(line.targetId) + " healed " + say.number(line.amount) +
			say.via(line) + "." : "";
	} },
	{ index: "lust", tone: "harm", glyph: "heart", words: function (line, say) {
		return line.amount > 0 ? say.name(line.targetId) + " gained " + say.number(line.amount) +
			" Lust" + say.via(line) + "." : "";
	} },
	{ index: "lustReduced", tone: "heal", glyph: "heart", words: function (line, say) {
		return line.amount > 0 ? say.name(line.targetId) + " lost " + say.number(line.amount) +
			" Lust" + say.via(line) + "." : "";
	} },
	{ index: "broken", tone: "harm", glyph: "skull", words: function (line, say) {
		return say.name(line.targetId) + " BROKE.";
	} },
	{ index: "recovered", tone: "heal", glyph: "sun", words: function (line, say) {
		return say.name(line.targetId) + " recovered.";
	} },
	{ index: "brokenEscalation", tone: "harm", glyph: "skull", words: function (line, say) {
		return say.name(line.targetId) + " slipped further, losing " + say.number(line.amount) +
			" health and gaining as much Lust.";
	} },
	{ index: "lowHealth", tone: "harm", glyph: "heart", words: function (line, say) {
		return say.name(line.targetId) + " was badly hurt.";
	} },
	{ index: "status", tone: "status", glyph: "flask", words: function (line, say) {
		if (line.delta > 0) return say.name(line.targetId) + " gained " + say.number(line.delta) + " " +
			say.status(line.status) + say.via(line) + ".";
		if (line.delta < 0) return say.name(line.targetId) + " lost " + say.number(-line.delta) + " " +
			say.status(line.status) + say.via(line) + ".";
		return "";
	} },
	{ index: "statusRemoved", tone: "status", glyph: "flask", words: function (line, say) {
		return say.name(line.targetId) + "'s " + say.status(line.status) + " wore off.";
	} },
	{ index: "statusBlocked", tone: "guard", glyph: "shield", words: function (line, say) {
		return say.name(line.targetId) + " shrugged off " + say.status(line.status) + ".";
	} },
	{ index: "downed", tone: "harm", glyph: "skull", words: function (line, say) {
		//One beaten by breaking already has a BROKE line just above; this one only says they are out.
		return say.name(line.targetId) + (line.cause == "broken" ? " is out of the fight." : " fell.");
	} },
	{ index: "enemySummoned", tone: "enemy", glyph: "spiral", words: function (line, say) {
		return line.sourceId == null ? say.name(line.targetId) + " appeared."
			: say.name(line.sourceId) + " summoned " + say.name(line.targetId) + ".";
	} },
	{ index: "allySummoned", tone: "play", glyph: "person", words: function (line, say) {
		return say.name(line.targetId) + " joined the fight.";
	} },
	{ index: "partyOrder", tone: "neutral", glyph: "arrows", words: function (line, say) {
		var lastRank = line.orderIdArray == null ? 0 : line.orderIdArray.length - 1;
		if (line.toRank === 0) return say.name(line.movedId) + " stepped to the front.";
		if (line.toRank === lastRank) return say.name(line.movedId) + " fell back to the rear.";
		return say.name(line.movedId) + " moved to place " + (line.toRank + 1) + ".";
	} },
	{ index: "cardDrawn", tone: "neutral", glyph: "bag", words: function (line, say) {
		//Consecutive draws arrive here already folded into one line; see battleLogView.foldDraws.
		var cardArray = line.cardArray == null ? [line.card] : line.cardArray;
		var shown = honeycomb.tuning.battleLog.drawNamesShown;
		var nameArray = [];
		for (var scanIndex = 0; scanIndex < cardArray.length && scanIndex < shown; scanIndex++) nameArray.push(say.card(cardArray[scanIndex]));
		var rest = cardArray.length - nameArray.length;
		return "Drew " + say.number(cardArray.length) + ": " + nameArray.join(", ") + (rest > 0 ? " and " + rest + " more" : "") + ".";
	} },
	{ index: "reshuffle", tone: "neutral", glyph: "spiral", words: function () {
		return "The discard pile was shuffled back into the draw pile.";
	} },
	{ index: "cardCreated", tone: "neutral", glyph: "spiral", words: function (line, say) {
		//The engine names piles without the "Array" the combat state stores them under.
		if (line.pile == "hand") return say.card(line.card) + " was added to your hand.";
		var pile = honeycomb.findDefinition(honeycomb.pileViewArray, line.pile + "Array");
		return say.card(line.card) + " was added" + (pile == null ? "" : " to the " + pile.name.toLowerCase()) + ".";
	} },
	{ index: "cardUpgraded", tone: "play", glyph: "star", words: function (line, say) {
		return say.card(line.card) + " was upgraded.";
	} },
	{ index: "cardExhausted", tone: "neutral", glyph: "flame", words: function (line, say) {
		return say.card(line.card) + " was exhausted.";
	} },
	{ index: "resource", tone: "neutral", glyph: "coin", words: function (line, say) {
		var resource = honeycomb.findDefinition(honeycomb.resourceArray, line.resource);
		if (line.amount == null || line.amount === 0) return "";
		return (line.amount > 0 ? "Gained " : "Lost ") + say.number(Math.abs(line.amount)) + " " +
			honeycomb.escapeText(resource == null ? line.resource : resource.name) + ".";
	} },
	{ index: "message", tone: "neutral", glyph: "question", words: function (line) {
		return honeycomb.escapeText(line.text == null ? "" : line.text);
	} },
	{ index: "optionChosen", tone: "play", glyph: "chevron", words: function (line, say) {
		return "Chose " + say.strong(line.text == null ? line.option : line.text) + ".";
	} },
	{ index: "relicGained", tone: "play", glyph: "shard", words: function (line, say) {
		var relic = honeycomb.findDefinition(honeycomb.relicArray, line.relic);
		return "Found " + say.strong(relic == null ? line.relic : relic.name) + ".";
	} },
	{ index: "rewardAdded", tone: "play", glyph: "chest", words: function (line, say) {
		return say.card(line.card) + " will be offered after the fight.";
	} },
	{ index: "combatEnd", tone: "neutral", glyph: "star", words: function (line, say) {
		var words = say.strong(line.outcome == "victory" ? "Victory." : "Defeat.");
		//How it was decided, when it was not simply everyone falling.
		return line.text == null || line.text === "" ? words : words + " " + honeycomb.escapeText(line.text);
	} },
];

//The helpers every wording uses, bound to one fight. Names are coloured by side (allies in their own
//colour), and an enemy sharing a name with another on the field is numbered -- "Sporeling 2" -- so
//it is clear WHICH one took the hit.
honeycomb.battleLogView.sayer = function (combat) {
	var say = {};
	say.entity = function (instanceId) { return instanceId == null ? null : honeycomb.findEntity(instanceId, combat); };
	say.strong = function (text) { return '<span class="hcLogStrong">' + honeycomb.escapeText(String(text)) + "</span>"; };
	say.number = function (amount) { return '<span class="hcLogNumber">' + honeycomb.escapeText(String(amount)) + "</span>"; };
	say.card = function (cardIndex) {
		var card = honeycomb.findDefinition(honeycomb.cardArray, cardIndex);
		return '<span class="hcLogCard"' + (card == null ? "" : honeycomb.tooltip.attributes("card", card.index)) + ">" +
			honeycomb.escapeText(card == null ? "a card" : card.name) + "</span>";
	};
	//`line.via` is the card or ability that was resolving when the entry was written, stamped in
	//honeycomb.logEvent. Worded as one phrase with the source, because
	//"from Cap Brute's Slam" is one fact rather than two -- and the card names itself when nobody in
	//particular is behind it (a status ticking, the broken spiral).
	//An ability is not in cardArray, so the ability table is the second place to look.
	say.via = function (line) {
		var hasSource = line.sourceId != null && line.sourceId != line.targetId;
		var fromWho = hasSource ? " from " + say.name(line.sourceId) : "";
		if (line.via == null) return fromWho;
		var card = honeycomb.findDefinition(honeycomb.cardArray, line.via);
		if (card != null) {
			return fromWho + (hasSource ? "'s " : " from ") +
				'<span class="hcLogCard"' + honeycomb.tooltip.attributes("card", card.index) + ">" +
				honeycomb.escapeText(card.name) + "</span>";
		}
		var ability = honeycomb.findDefinition(honeycomb.abilityArray, line.via);
		if (ability == null) return fromWho;
		return fromWho + (hasSource ? "'s " : " from ") + say.strong(ability.name);
	};
	say.status = function (statusIndex) {
		var status = honeycomb.findDefinition(honeycomb.statusArray, statusIndex);
		return '<span class="hcLogStatus" style="color:' + (status == null ? "inherit" : status.colorHint) + '"' +
			(status == null ? "" : honeycomb.tooltip.attributes("status", status.index)) + ">" +
			honeycomb.escapeText(status == null ? statusIndex : status.name) + "</span>";
	};
	//Named by what the combatant IS; coloured by it too for a character, and marked as the other team's
	//when it stands there -- Severine fighting against the party is still Severine, in the enemy's colour.
	say.name = function (instanceId) {
		var entity = say.entity(instanceId);
		if (entity == null) return '<span class="hcLogName">someone</span>';
		var found = honeycomb.entityDefinition(entity);
		var name = found == null ? (entity.side == "enemy" ? "An enemy" : "An ally") : found.definition.name;
		var sideArray = honeycomb.entityArray(entity.side == "enemy" ? "enemy" : "ally", combat);
		var sameArray = [];
		for (var scanIndex = 0; scanIndex < sideArray.length; scanIndex++) {
			if (honeycomb.entityKey(sideArray[scanIndex]) == honeycomb.entityKey(entity)) sameArray.push(sideArray[scanIndex]);
		}
		if (sameArray.length > 1) name += " " + (sameArray.indexOf(entity) + 1);
		var color = found != null && found.kind == "character" && entity.side != "enemy" ? found.definition.colorHint : null;
		return '<span class="hcLogName' + (entity.side == "enemy" ? " hcLogEnemy" : "") + '"' +
			(color == null ? "" : ' style="color:' + color + '"') + ">" + honeycomb.escapeText(name) + "</span>";
	};
	return say;
};

//Runs of draws folded into one line each, so a new hand reads "Drew 5: ..." rather than five lines.
honeycomb.battleLogView.foldDraws = function (historyArray) {
	var result = [];
	for (var scanIndex = 0; scanIndex < historyArray.length; scanIndex++) {
		var line = historyArray[scanIndex];
		var previous = result.length === 0 ? null : result[result.length - 1];
		if (line.type == "cardDrawn" && previous != null && previous.type == "cardDrawn" && previous.turn === line.turn) {
			previous.cardArray.push(line.card);
			continue;
		}
		if (line.type == "cardDrawn") { result.push({ type: "cardDrawn", turn: line.turn, cardArray: [line.card] }); continue; }
		result.push(line);
	}
	return result;
};

honeycomb.battleLogView.render = function () {
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var historyArray = combat == null || combat.historyArray == null ? [] : honeycomb.battleLogView.foldDraws(combat.historyArray);
	var say = combat == null ? null : honeycomb.battleLogView.sayer(combat);

	var markup = '<div class="hcOverlayPanel hcBattleLogPanel">';
	markup += '<h2 class="hcOverlayTitle">Battle Log</h2>';
	markup += '<div class="hcBattleLogList hcScroll">';
	if (historyArray.length === 0) markup += '<div class="hcOverlayBody hcMuted hcCenterText">Nothing has happened yet.</div>';

	//Anything before the first turn begins is the fight being set up: gold from equipment, the
	//enemies' first plans.
	markup += historyArray.length > 0 && historyArray[0].type != "turnStart"
		? '<div class="hcLogTurn">The battle begins</div>' : "";
	for (var lineIndex = 0; lineIndex < historyArray.length; lineIndex++) {
		var line = historyArray[lineIndex];
		if (line.type == "turnStart") {
			markup += '<div class="hcLogTurn' + (line.side == "enemy" ? " hcLogTurnEnemy" : "") + '">Turn ' + line.turn +
				" &middot; " + (line.side == "enemy" ? "Enemy turn" : "Your turn") + "</div>";
			continue;
		}
		var wording = honeycomb.findDefinition(honeycomb.battleLogWordArray, line.type);
		if (wording == null) continue;
		var text = wording.words(line, say);
		if (text == null || text === "") continue;
		markup += '<div class="hcLogLine hcLogTone-' + wording.tone + '">' +
			honeycomb.ui.iconTag(null, wording.glyph, "#9c8fae", { className: "hcLogIcon" }) +
			'<span class="hcLogText">' + text +
			(line.chance == true ? ' <span class="hcLogChance" title="Decided at random">random</span>' : "") +
			"</span></div>";
	}
	markup += "</div>";
	markup += '<div class="hcOverlayButtonRow"><div class="hcButton hcPrimary" onclick="honeycomb.overlay.close(\'battleLog\')">Close</div></div>';
	markup += "</div>";
	return markup;
};

honeycomb.battleLogView.show = function () {
	honeycomb.platform.sound("uiClick");
	honeycomb.overlay.open("battleLog", {});
};

//---------------------------------------------------------------------------------------------------
//Defeat
//---------------------------------------------------------------------------------------------------
//The run ends. A summary is shown rather than dumping the player straight back to teambuilding, since
//the numbers are the point of a roguelike loss.
honeycomb.overlay.register({
	index: "defeat",
	build: function (layer) {
		var run = honeycomb.state.run;
		var combat = run == null ? null : run.combat;

		//A continuation with `finishDefeat` means the fight carries on after a loss, and is not the end
		//of a run, so it gets its own short panel instead of the run summary.
		var continuation = combat == null ? null : combat.continuation;
		var carried = continuation == null ? null : honeycomb.findDefinition(honeycomb.combatContinuationArray, continuation.index);
		if (carried != null && typeof carried.finishDefeat === "function") {
			var carriedMarkup = '<div class="hcOverlayPanel">';
			carriedMarkup += '<h2 class="hcOverlayTitle hcDefeatTitle">Defeat</h2>';
			var defeatLead = carried.defeatLead == null ? "" : carried.defeatLead(continuation);
			if (defeatLead !== "") carriedMarkup += '<div class="hcOverlayBody">' + honeycomb.escapeText(defeatLead) + "</div>";
			carriedMarkup += '<div class="hcOverlayButtonRow"><div class="hcButton hcPrimary" onclick="honeycomb.defeatOverlay.carryOn()">' +
				honeycomb.escapeText(carried.buttonLabel) + "</div></div></div>";
			layer.innerHTML = carriedMarkup;
			return;
		}

		var markup = '<div class="hcOverlayPanel">';
		markup += '<h2 class="hcOverlayTitle hcDefeatTitle">Defeat</h2>';
		markup += '<div class="hcOverlayBody">The catacombs keep what they are given.</div>';

		markup += '<div class="hcRewardRow">';
		markup += '<div class="hcRewardTile"><div class="hcRewardValue">' + (run == null ? 0 : run.day) + "</div>" +
			'<div class="hcTiny hcMuted">Days survived</div></div>';
		markup += '<div class="hcRewardTile"><div class="hcRewardValue">' +
			(combat == null ? 0 : combat.turnNumber) + "</div>" +
			'<div class="hcTiny hcMuted">Turns in the last fight</div></div>';
		markup += '<div class="hcRewardTile"><div class="hcRewardValue">' +
			(run == null ? 0 : run.deckArray.length) + "</div>" +
			'<div class="hcTiny hcMuted">Cards in the deck</div></div>';
		markup += "</div>";

		markup += '<div class="hcOverlayButtonRow">' +
			'<div class="hcButton hcPrimary" onclick="honeycomb.finishRun(false)">Back to the surface</div></div>';
		markup += "</div>";
		layer.innerHTML = markup;
	},
});

honeycomb.defeatOverlay = {};

//Leaves a lost fight the way its continuation says.
honeycomb.defeatOverlay.carryOn = function () {
	var run = honeycomb.state.run;
	var continuation = run == null || run.combat == null ? null : run.combat.continuation;
	var carried = continuation == null ? null : honeycomb.findDefinition(honeycomb.combatContinuationArray, continuation.index);
	honeycomb.overlay.close("defeat");
	if (carried == null || typeof carried.finishDefeat !== "function") { honeycomb.finishRun(false); return; }
	carried.finishDefeat(continuation);
};
