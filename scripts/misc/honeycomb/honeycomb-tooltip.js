//===================================================================================================
//HONEYCOMB CATACOMBS -- hover tooltips
//===================================================================================================
//"I genuinely have no idea what the symbols above enemy heads is supposed to mean." That is the bug
//this file fixes, and the fix is not more icons -- it is words.
//
//Three things hover now: a CARD shows a full-size readable copy of itself, a STATUS shows its name and
//what it does, and an ENEMY'S INTENT shows what that enemy is about to do IN WORDS, with the real
//numbers after every modifier on the board.
//
//WHY A REGISTRY. `honeycomb.tooltipKindArray` says what a hoverable thing is and how to draw it, so a
//new one is a table entry plus an attribute on the element. Nothing here knows about combat.
//
//WHY THE INTENT TEXT IS GENERATED. An intent's tooltip is built from its own effect list through
//honeycomb.describeEffectArray -- the same function that prints card rules text. A new enemy intent
//therefore explains itself with no extra authoring, and its explanation can never drift from what it
//actually does. Enemy intents were the one place in the game with a printed symbol and no printed
//meaning; now they read like a card.
//
//NO DOCUMENT LISTENERS. Hover is wired with inline onmouseenter / onmouseleave attributes, as the rest
//of the UI wires its input. Syrup Town's Jiggy minigame keeps permanent document-level handlers, and
//honeycomb stays out of that space entirely.
window.honeycomb = window.honeycomb || {};

honeycomb.tooltip = {};

//---------------------------------------------------------------------------------------------------
//What can be hovered
//---------------------------------------------------------------------------------------------------
//  render(key, element)  markup for the panel, or "" to show nothing
//  className             optional extra class on the panel, for a kind that needs its own sizing
//  onShow(key, element)  optional: called once the panel is on screen, for a kind whose reading changes
//                        something else while it is read (the intent's lust inspection)
//  onHide(key)           optional: called when that panel goes away, whatever took it away
honeycomb.tooltipKindArray = [
	{
		index: "card",
		//`key` is a card INSTANCE id when the card exists in a pile, or a card INDEX for a card being
		//previewed before it is minted -- a reward, a shop shelf, a deck listing.
		className: "hcTooltipCard",
		render: function (key, anchor) {
			var resolved = honeycomb.combat == null ? null : honeycomb.combat.resolveById(key);
			if (resolved == null) {
				var definition = honeycomb.findDefinition(honeycomb.cardArray, key);
				if (definition == null) return "";
				resolved = honeycomb.resolveCard({
					instanceId: null, cardIndex: definition.index, ownerInstanceId: null, upgradeLevel: 0,
				});
			}
			//A preview from a character's deck names whose pool it came from on the anchor, so the
			//random starting card can wear that character's class glyph and face.
			var previewCharacterIndex = anchor == null || anchor.dataset == null ? null : anchor.dataset.hccharacter;
			//A real rendered card, so the zoom and the hand agree on what a card looks like -- with
			//its keywords explained in a SIDECAR beside it rather than squeezed onto the card.
			var markup = '<div class="hcTooltipCardRow"><div class="hcTooltipCardColumn">';
			markup += honeycomb.ui.card(resolved, { size: "large", showAffinity: false, showTooltip: false,
				previewCharacterIndex: previewCharacterIndex });
			markup += honeycomb.tooltip.cardFooter(resolved);
			markup += "</div>";
			markup += honeycomb.tooltip.keywordSidecar(resolved);
			markup += "</div>";
			return markup;
		},
	},
	{
		//A CARD IN THE OBTAINABLE LIST. The same card, plus WHY its rate reads the way it does for
		//the outfit worn NOW. An inline reason line under the row would read as though everything
		//below were banned, so the reasons live here instead. The list builder puts them on
		//`honeycomb.cardOfferTips`, keyed by card index.
		index: "cardOffer",
		className: "hcTooltipCard",
		render: function (key) {
			var cardKind = honeycomb.findDefinition(honeycomb.tooltipKindArray, "card");
			var markup = cardKind == null ? "" : cardKind.render(key);
			var info = honeycomb.cardOfferTips == null ? null : honeycomb.cardOfferTips[key];
			if (info == null || info.reasonArray == null || info.reasonArray.length === 0) return markup;
			var stateEntry = null;
			for (var scanIndex = 0; scanIndex < honeycomb.cardOfferStateArray.length; scanIndex++) {
				if (honeycomb.cardOfferStateArray[scanIndex].index == info.state) { stateEntry = honeycomb.cardOfferStateArray[scanIndex]; break; }
			}
			markup += '<div class="hcTooltipOffer">';
			markup += '<div class="hcTooltipOfferHead" style="--hcStateColor:' + (stateEntry == null ? "#efe4cf" : stateEntry.color) + '">' +
				honeycomb.escapeText(stateEntry == null ? honeycomb.tooltip.text("cardOffer.fallbackHeading") : stateEntry.label) + "</div>";
			for (var reasonIndex = 0; reasonIndex < info.reasonArray.length; reasonIndex++) {
				markup += '<div class="hcTooltipOfferReason">' + honeycomb.escapeText(info.reasonArray[reasonIndex]) + "</div>";
			}
			markup += "</div>";
			return markup;
		},
	},
	{
		//The same card, minus the copy of the card. For somewhere the card is ALREADY enlarged under
		//the pointer -- the hand -- where a second full-size copy lands on top of the first and says
		//nothing new. What is left is what the card face cannot say: its keywords, explained, and why
		//it cannot be played right now. Nothing to add means no panel at all.
		//
		//WHO OWNS IT IS NOT HERE. It used to be, as a name floating over the card's art; the owner now
		//steps into focus on the battlefield while their card is hovered, which says it better.
		//
		//In the hand this panel FOLLOWS THE POINTER (see `follow`) up and down, but always stands BESIDE the
		//card it describes (`besideAnchor`), never on it: the hovered card grows to the large size, and a
		//panel beside the pointer landed on its rules text.
		index: "cardNote",
		className: "hcTooltipNote-panel",
		follow: true,
		besideAnchor: true,
		render: function (key) {
			var resolved = honeycomb.combat == null ? null : honeycomb.combat.resolveById(key);
			if (resolved == null) return "";
			var markup = honeycomb.tooltip.keywordSidecar(resolved);
			var reason = honeycomb.tooltip.unplayableReason(resolved);
			if (reason !== "") markup += '<div class="hcTooltipNote hcTooltipWarning">' + honeycomb.escapeText(reason) + "</div>";
			return markup;
		},
	},
	{
		//One keyword on its own, for anywhere a keyword is printed outside a card.
		index: "keyword",
		render: function (key) {
			var keyword = honeycomb.keywordDefinition(key);
			if (keyword == null) return "";
			return honeycomb.tooltip.keywordPanel(keyword);
		},
	},
	{
		index: "status",
		render: function (key, element) {
			var definition = honeycomb.findDefinition(honeycomb.statusArray, key);
			if (definition == null) return "";
			//Stacks come off the element rather than being looked up, so one status on two entities
			//shows each one's own count.
			var stacks = element == null || element.dataset == null
				? null : (element.dataset.hcstacks || element.dataset.hcStacks);

			var markup = honeycomb.tooltip.heading(definition.name, definition.colorHint,
				stacks == null ? "" : honeycomb.tooltip.countText(definition.stackType == "duration" ? "status.turns" : "status.stacks",
					Number(stacks)));
			markup += '<div class="hcTooltipBody">' + honeycomb.escapeText(honeycomb.statusDescription(definition)) + "</div>";
			//THE POLE, in words. Neutral statuses deliberately say nothing.
			var polarity = honeycomb.statusPolarity == null ? 0 : honeycomb.statusPolarity(definition);
			if (polarity !== 0) {
				markup += '<div class="hcTooltipNote">' + honeycomb.escapeText(
					honeycomb.tooltip.text(polarity > 0 ? "status.positive" : "status.negative")) + "</div>";
			}
			markup += '<div class="hcTooltipNote">' + honeycomb.escapeText(
				honeycomb.tooltip.stackTypeText(definition)) + "</div>";
			return markup;
		},
	},
	{
		index: "intent",
		//`key` is the AI COMBATANT's instance id -- an enemy, or anything the AI plays for the party. Its
		//telegraphed move is a real card: this is its full-size copy, worded from its own
		//effects with the numbers that would land right now, the keyword sidecar beside it, and who it is
		//aimed at underneath.
		className: "hcTooltipCard",
		render: function (key) {
			var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
			var entity = honeycomb.findEntity(key, combat);
			if (entity == null) return "";
			if (entity.intentCardIndex == null) return honeycomb.tooltip.heading(honeycomb.tooltip.text("intent.waiting"), "#808080", "");
			return honeycomb.tooltip.moveCardPanel(entity, entity.intentCardIndex, combat);
		},
		//Reading a Lewd move pauses the resting forecast and shows what it would do to each party member.
		//The combat scene owns that; this panel only says when it starts and stops.
		onShow: function (key) {
			var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
			var entity = honeycomb.findEntity(key, combat);
			if (entity == null || entity.intentCardIndex == null || honeycomb.combatScene == null) return;
			honeycomb.combatScene.inspectLust({ sourceId: entity.instanceId, cardIndex: entity.intentCardIndex, origin: "intent" });
		},
		onHide: function () {
			if (honeycomb.combatScene != null) honeycomb.combatScene.clearLustInspection("intent");
		},
	},
	{
		index: "relic",
		render: function (key) {
			var definition = honeycomb.findDefinition(honeycomb.relicArray, key);
			if (definition == null) return "";
			return honeycomb.tooltip.heading(definition.name, "#c9a961", definition.rarity) +
				'<div class="hcTooltipBody">' + honeycomb.escapeText(definition.description) + "</div>";
		},
	},
	{
		//A piece of equipment: name, rarity and kind ("Rare Heirloom"), what it does, whose it is. A piece
		//the party is too big to use carries `data-hcInactive="1"` and says so, in the words asked for.
		index: "equipment",
		render: function (key, element) {
			var definition = honeycomb.findDefinition(honeycomb.equipmentArray, key);
			if (definition == null) return "";
			var rarity = honeycomb.findDefinition(honeycomb.equipmentRarityArray, definition.rarity);
			var markup = honeycomb.tooltip.heading(definition.name, rarity == null ? "#c9a961" : rarity.color,
				honeycomb.equipment.kindText(definition));
			markup += '<div class="hcTooltipBody">' + honeycomb.escapeText(definition.description) + "</div>";
			if (definition.characterIndex != null) {
				var owner = honeycomb.findDefinition(honeycomb.characterArray, definition.characterIndex);
				markup += '<div class="hcTooltipNote">' + honeycomb.tooltip.html("equipment.onlyWearer",
					{ name: owner == null ? definition.characterIndex : owner.name }) + "</div>";
			}
			var inactive = element != null && element.dataset != null && (element.dataset.hcinactive || element.dataset.hcInactive) == "1";
			if (inactive) {
				markup += '<div class="hcTooltipNote hcTooltipWarning">' + honeycomb.tooltip.html("equipment.overCapacity") + "</div>";
			}
			return markup;
		},
	},
	{
		//The equipment count badge: what the number means and how party size moves
		//it. `key` is the party size. Every number comes from tuning.equipment through
		//honeycomb.equipment.capacity, so the panel can never disagree with the rule.
		index: "equipmentCapacity",
		render: function (key) {
			var partySize = parseInt(key, 10);
			if (isNaN(partySize)) return "";
			var settings = honeycomb.tuning.equipment;
			var capacity = honeycomb.equipment.capacity(partySize);
			var pieces = function (count) { return honeycomb.tooltip.countText("equipmentCapacity.pieces", count); };
			var markup = honeycomb.tooltip.heading(honeycomb.tooltip.text("equipmentCapacity.heading"), "#c9a961",
				honeycomb.tooltip.text("equipmentCapacity.each", { pieces: pieces(capacity) }));
			markup += '<div class="hcTooltipBody">' + honeycomb.tooltip.html("equipmentCapacity.body", {
				partySize: partySize, pieces: pieces(capacity), fullParty: settings.capacityPartySize,
				extraPieces: pieces(settings.capacityPerMissingMember),
			}) + "</div>";
			//The whole rule as a short table, the current party size marked.
			markup += '<div class="hcCapacityTable">';
			for (var size = honeycomb.tuning.run.partySizeMinimum; size <= settings.capacityPartySize; size++) {
				var label = size == settings.capacityPartySize ? honeycomb.tooltip.text("equipmentCapacity.rowOrMore", { size: size }) : String(size);
				var current = size == partySize || (size == settings.capacityPartySize && partySize > size);
				markup += '<div class="hcCapacityRow' + (current ? " hcOn" : "") + '"><span>' +
					honeycomb.tooltip.html("equipmentCapacity.row", { size: label }) + "</span><span>" +
					honeycomb.tooltip.html("equipmentCapacity.each", { pieces: pieces(honeycomb.equipment.capacity(size)) }) + "</span></div>";
			}
			markup += "</div>";
			markup += '<div class="hcTooltipNote">' + honeycomb.tooltip.html("equipmentCapacity.pastLimit") + "</div>";
			return markup;
		},
	},
	{
		//A character tag: its name as the title, a divider (the heading's own rule), then what it
		//means. Tags without a description still name themselves, so no tag hovers to nothing.
		index: "tag",
		render: function (key) {
			var definition = honeycomb.findDefinition(honeycomb.tagArray, key);
			var markup = honeycomb.tooltip.heading(honeycomb.tagName(key), honeycomb.tagColor(key), "");
			if (definition == null || definition.description == null) return markup;
			return markup + '<div class="hcTooltipBody">' + honeycomb.escapeText(definition.description) + "</div>";
		},
	},
	{
		index: "ability",
		//The chip carries WHOSE ability it is as a data attribute (see tooltip.attributes), which is what
		//lets the panel answer "can I use it right now" rather than only "what is it".
		render: function (key, element) {
			var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
			var memberInstanceId = element == null || element.dataset == null
				? null : (element.dataset.hcmemberinstanceid || element.dataset.hcmemberInstanceId);
			var member = memberInstanceId == null ? null : honeycomb.findEntity(memberInstanceId, combat);
			//The holder's own version, after any training wheel (AUDIT-01).
			var definition = honeycomb.abilities.definitionFor(member, key);
			if (definition == null) return "";

			var chargeText = honeycomb.tooltip.countText("ability.charges", definition.chargeMaximum);
			if (member != null) {
				chargeText = honeycomb.tooltip.text("ability.chargesLeft", { current: honeycomb.abilities.charges(member, key), charges: chargeText });
			}
			var markup = honeycomb.tooltip.heading(definition.name, "#c9a961", chargeText);
			markup += '<div class="hcTooltipBody">' +
				honeycomb.escapeText(honeycomb.abilities.text(definition)) + "</div>";

			//EVERY REQUIREMENT, TICKED OR CROSSED. The whole point of reporting them one by one is that
			//the player can see which one to go and satisfy.
			var stateArray = member == null
				? honeycomb.tooltip.requirementListFor(definition)
				: honeycomb.abilities.requirementStateArray(member, key, combat);
			if (stateArray.length > 0) {
				markup += '<div class="hcTooltipRequirements">';
				for (var scanIndex = 0; scanIndex < stateArray.length; scanIndex++) {
					var state = stateArray[scanIndex];
					markup += '<div class="hcTooltipRequirement' + (state.met === false ? " hcUnmet" : state.met === true ? " hcMet" : "") + '">' +
						(state.met === false ? "✕ " : state.met === true ? "✓ " : "• ") +
						honeycomb.escapeText(state.text) + "</div>";
				}
				markup += "</div>";
			}
			var spendText = honeycomb.abilities.spendText(definition);
			if (spendText !== "") markup += '<div class="hcTooltipNote">' + honeycomb.escapeText(spendText) + "</div>";
			markup += '<div class="hcTooltipNote">' +
				honeycomb.escapeText(honeycomb.tooltip.rechargeText(definition)) + "</div>";
			return markup;
		},
	},
	{
		//THE CARD AS IT WOULD BE. In a window that is ASKING which card to upgrade,
		//showing the card as it stands is showing the player what they already have.
		//
		//`key` is the card's instance id. The footer and the keyword sidecar are built from the UPGRADED
		//card too, so a keyword the upgrade introduces is explained here as well.
		index: "cardUpgrade",
		className: "hcTooltipCard",
		render: function (key) {
			var instance = honeycomb.combat == null ? null : honeycomb.combat.cardInstance(key);
			var upgraded = instance == null ? null : honeycomb.choiceOverlay.upgradedCard(instance);
			if (upgraded == null) return "";
			var markup = '<div class="hcTooltipCardRow"><div class="hcTooltipCardColumn">';
			markup += '<div class="hcTooltipNote hcUpgradeNote">' + honeycomb.tooltip.html("cardUpgrade.note") + "</div>";
			markup += honeycomb.ui.card(upgraded, { size: "large", showAffinity: false, showTooltip: false });
			markup += honeycomb.tooltip.cardFooter(upgraded);
			markup += "</div>";
			markup += honeycomb.tooltip.keywordSidecar(upgraded);
			markup += "</div>";
			return markup;
		},
	},
	{
		//The "Next move" tag on an enemy's move list. It marks the one move the enemy is
		//set to play next, so the tag says what it means rather than reading as a leftover button.
		index: "enemyMoves",
		render: function () {
			return honeycomb.tooltip.heading(honeycomb.tooltip.text("enemyMoves.heading"), "#f0d89a", "") +
				'<div class="hcTooltipBody">' + honeycomb.tooltip.html("enemyMoves.body") + "</div>";
		},
	},
	{
		//The alert badge on the top bar's party button while somebody is Broken. Explains
		//where the way out is, since the map has no turn start to recover at.
		index: "partyAlert",
		render: function () {
			return honeycomb.tooltip.heading(honeycomb.tooltip.text("partyAlert.heading"), "#ff3b6b", "") +
				'<div class="hcTooltipBody">' + honeycomb.tooltip.html("partyAlert.body") + "</div>";
		},
	},
	{
		//A character's own mechanic: what it is and what moves it.
		index: "mechanic",
		//A SLOTS mechanic's key is "<mechanic>/<instanceId>", and the panel adds the symbols that holder has.
		render: function (key) {
			var pieceArray = String(key).split("/");
			var definition = honeycomb.findDefinition(honeycomb.mechanicArray, pieceArray[0]);
			if (definition == null) return "";
			var character = honeycomb.findDefinition(honeycomb.characterArray, definition.characterIndex);
			var holdingNote = "";
			if (pieceArray.length > 1) {
				var run = honeycomb.state == null ? null : honeycomb.state.run;
				var holder = run == null || run.combat == null ? null : honeycomb.findEntity(pieceArray[1], run.combat);
				var nameArray = [];
				var symbolArray = honeycomb.mechanicSymbolArray(holder, definition.index);
				for (var symbolIndex = 0; symbolIndex < symbolArray.length; symbolIndex++) {
					var type = honeycomb.cardType(symbolArray[symbolIndex]);
					nameArray.push(type == null ? symbolArray[symbolIndex] : type.name);
				}
				holdingNote = '<div class="hcTooltipNote">' + honeycomb.escapeText(nameArray.length === 0 ? "Empty." : "Holds: " + nameArray.join(", ") + ".") + "</div>";
			}
			return honeycomb.tooltip.heading(definition.name, definition.colorHint, character == null ? "" : character.name) +
				'<div class="hcTooltipBody">' + honeycomb.escapeText(honeycomb.mechanicDescription(definition)) + "</div>" + holdingNote;
		},
	},
	{
		//One orb of a tested mechanic, keyed "<mechanic>/<orb>": what would light it.
		index: "mechanicOrb",
		render: function (key) {
			var pieceArray = String(key).split("/");
			var definition = honeycomb.findDefinition(honeycomb.mechanicArray, pieceArray[0]);
			if (definition == null || definition.orbArray == null) return "";
			var orb = honeycomb.findDefinition(definition.orbArray, pieceArray[1]);
			if (orb == null) return "";
			return honeycomb.tooltip.heading(orb.name, definition.colorHint, definition.name) +
				'<div class="hcTooltipBody">' + honeycomb.escapeText(orb.description) + "</div>" +
				//The mechanic's own words, so a slot read alone still says what the whole thing is.
				(definition.description == null ? "" : '<div class="hcTooltipNote">' +
					honeycomb.escapeText(honeycomb.mechanicDescription(definition)) + "</div>");
		},
	},
	{
		//A WEAKNESS ROW ON THE CHARACTER SHEET. The panel answers it all in order: what the tag IS, what
		//has been feeding it, the rank reached with its title and description, what that rank costs, and
		//how far the next one is.
		//`key` is "characterIndex/tag", because the answer is about this character's ledger and not the
		//tag in the abstract.
		//The key may end "/sheet": the teambuilding sheet's own row, the one place
		//where SEEING a ranked-up weakness clears its notification (onShow). Anywhere else only reads it.
		index: "weakness",
		interactive: true,
		render: function (key) {
			var split = String(key).split("/");
			var characterIndex = split[0];
			var tagIndex = split[1];
			var tag = honeycomb.findDefinition(honeycomb.cardTagArray, tagIndex);
			var exposure = honeycomb.lust.exposureFor(characterIndex, tagIndex);
			var rank = honeycomb.lust.rankDefinitionFor(exposure);
			var name = tag == null ? honeycomb.tagName(tagIndex) : tag.name;
			var color = tag == null ? honeycomb.tagColor(tagIndex) : tag.color;

			var markup = honeycomb.tooltip.heading(name, color,
				rank == null ? honeycomb.tooltip.text("weakness.noRankAside") : rank.name);
			//RECENTLY RANKED UP. Drawn before the notification is cleared, so the first
			//look still says it. That is ALL a weakness says here: the scene is started from the
			//character, not from the rail.
			markup += honeycomb.tooltip.lustEventSection(characterIndex, tagIndex);
			if (tag != null) markup += '<div class="hcTooltipBody">' + honeycomb.escapeText(tag.description) + "</div>";
			if (rank != null) {
				markup += '<div class="hcTooltipRankLine">' + honeycomb.tooltip.html("weakness.rankLine", { rank: rank.rank, rankName: rank.name }) + "</div>";
				if (rank.description != null) {
					markup += '<div class="hcTooltipBody">' + honeycomb.escapeText(rank.description) + "</div>";
				}
				markup += '<div class="hcTooltipNote">' + honeycomb.tooltip.html("weakness.multiplier",
					{ tag: name, multiplier: honeycomb.ui.trimNumber(rank.lustMultiplier) }) + "</div>";
			} else {
				markup += '<div class="hcTooltipNote">' + honeycomb.tooltip.html("weakness.noRank", { tag: name }) + "</div>";
			}

			var next = honeycomb.lust.nextThresholdFor(exposure);
			if (next == null) {
				markup += '<div class="hcTooltipNote">' + honeycomb.tooltip.html("weakness.maximum") + "</div>";
			} else {
				//Deliberately not naming the rank here: it says how far to the next rank without naming
				//what that rank is.
				markup += '<div class="hcTooltipNote">' + honeycomb.tooltip.html("weakness.toNextRank", { amount: Math.ceil(next - exposure) }) + "</div>";
				//THE PER-RUN CEILING, said out loud where a player would otherwise watch a bar stop
				//moving and think it was broken. Only while a run is live: the count
				//it reads stays on the profile until the next run starts, and between runs nothing is held.
				var allowance = honeycomb.tuning.lust.maximumRankGainPerRun;
				var runLive = honeycomb.state != null && honeycomb.state.run != null;
				if (runLive && allowance != null && honeycomb.lust.rankGainThisRun(characterIndex, tagIndex) >= allowance) {
					markup += '<div class="hcTooltipNote hcTooltipHeld">' +
						honeycomb.escapeText(honeycomb.tooltip.countText("weakness.heldForRun", allowance)) + "</div>";
				}
			}
			//This tag's own share of the bench counter.
			var benchDays = honeycomb.lust.benchDaysToFloor(exposure);
			if (benchDays != null && benchDays > 0) {
				markup += '<div class="hcTooltipNote">' + honeycomb.escapeText(honeycomb.tooltip.countText("weakness.benchDays", benchDays)) + "</div>";
			}
			return markup;
		},
		//Seeing the weakness (clicking or hovering) clears its ranked-up notification.
		onShow: function (key) {
			var split = String(key).split("/");
			if (split[2] != "sheet" || honeycomb.teambuilding == null) return;
			honeycomb.teambuilding.noticeWeakness(split[0], split[1]);
		},
	},
	{
		//THE HEART ON A ROSTER ENTRY: an explanation, then the button that
		//plays the head of this character's queue. `key` is the character index.
		index: "lustEventGate",
		interactive: true,
		render: function (key) {
			var definition = honeycomb.findDefinition(honeycomb.characterArray, key);
			if (definition == null || honeycomb.lustEvents == null) return "";
			var markup = honeycomb.tooltip.heading(definition.name, "#ff5fd2", honeycomb.tooltip.text("lustEventGate.aside"));
			markup += '<div class="hcTooltipBody">' + honeycomb.tooltip.html("lustEventGate.body", { name: definition.name }) + "</div>";
			markup += honeycomb.tooltip.lustEventLaunchMarkup(key);
			return markup;
		},
	},
	{
		//THE BENCH COUNTER ON THE CHARACTER SHEET: how the weaknesses wear off.
		//`key` is the character index.
		index: "weaknessBench",
		render: function (key) {
			var markup = honeycomb.tooltip.heading(honeycomb.tooltip.text("weaknessBench.heading"), "#ff5fd2", null);
			markup += '<div class="hcTooltipBody">' + honeycomb.tooltip.html("weaknessBench.body",
				{ amount: honeycomb.ui.trimNumber(honeycomb.lust.benchDecayAmount()) }) + "</div>";
			markup += '<div class="hcTooltipNote">' + honeycomb.tooltip.html("weaknessBench.note") + "</div>";
			return markup;
		},
	},
	{
		//THE RESET BUTTON BESIDE IT: the price, and why it cannot be bought if it cannot.
		index: "weaknessReset",
		render: function (key) {
			var cost = honeycomb.lust.floorResetCost(key);
			var refusal = honeycomb.lust.floorResetRefusal(key);
			var markup = honeycomb.tooltip.heading(honeycomb.tooltip.text("weaknessReset.heading"), "#ff5fd2",
				honeycomb.tooltip.text("weaknessReset.cost", { cost: cost }));
			markup += '<div class="hcTooltipBody">' + honeycomb.tooltip.html("weaknessReset.body") + "</div>";
			markup += '<div class="hcTooltipNote">' + honeycomb.tooltip.html("weaknessReset.have",
				{ amount: honeycomb.progression.personalExperience(key) }) + "</div>";
			//Each refusal reason has its own entry, "weaknessReset.refusal.<reason>".
			if (refusal != null && honeycomb.tooltip.textEntry("weaknessReset.refusal." + refusal) != null) {
				markup += '<div class="hcTooltipNote hcTooltipHeld">' + honeycomb.tooltip.html("weaknessReset.refusal." + refusal) + "</div>";
			}
			return markup;
		},
	},
	{
		//ONE NOTCH ON THE RAIL: the rank it marks, on its own.
		index: "weaknessRank",
		render: function (key) {
			var rank = honeycomb.lust.rankDefinitionByRank(key);
			if (rank == null) return "";
			var markup = honeycomb.tooltip.heading(rank.name, "#ff5fd2", honeycomb.tooltip.text("weaknessRank.aside", { rank: rank.rank }));
			if (rank.description != null) {
				markup += '<div class="hcTooltipBody">' + honeycomb.escapeText(rank.description) + "</div>";
			}
			markup += '<div class="hcTooltipNote">' + honeycomb.tooltip.html("weaknessRank.reached",
				{ atOrAbove: rank.atOrAbove, multiplier: honeycomb.ui.trimNumber(rank.lustMultiplier) }) + "</div>";
			return markup;
		},
	},
	{
		//THE HEALTH NUMBER UNDER THE BAR: what it is, how much it is predicted to change, and what card or
		//status is predicted to change it, in that order. `key` is the entity's instance id.
		index: "health",
		render: function (key) {
			var entity = honeycomb.findEntity(key,
				honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat);
			if (entity == null) return "";
			var mark = honeycomb.forecast == null ? null : honeycomb.forecast.markFor(key);

			var markup = honeycomb.tooltip.heading(honeycomb.tooltip.text("health.heading"), "#d3455f",
				Math.max(0, entity.health) + " / " + entity.maxHealth);
			markup += '<div class="hcTooltipBody">' + honeycomb.tooltip.html("health.body") + "</div>";
			markup += honeycomb.tooltip.forecastSection(mark, "health", "health");
			return markup;
		},
	},
	{
		//THE LUST READING, left of the bar. The same three questions, about the other half of the
		//comparison -- and it ends on the one number that decides everything, the break margin.
		index: "lust",
		render: function (key) {
			var entity = honeycomb.findEntity(key,
				honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat);
			if (entity == null) return "";
			var keyword = honeycomb.keywordDefinition("lust");
			var mark = honeycomb.forecast == null ? null : honeycomb.forecast.markFor(key);
			var lust = Math.max(0, entity.lust == null ? 0 : entity.lust);

			var markup = honeycomb.tooltip.heading(keyword == null ? honeycomb.tooltip.text("lust.fallbackHeading") : keyword.name, "#ff5fd2", String(lust));
			if (keyword != null) markup += '<div class="hcTooltipBody">' + honeycomb.escapeText(keyword.description) + "</div>";
			markup += honeycomb.tooltip.forecastSection(mark, "lust", "lust");
			//THE MARGIN: what would still have to arrive to break them. The most useful number there is.
			//UNLESS THEY ARE ABOUT TO FALL. The margin is standing health minus lust, so a
			//lethal forecast drives it to zero on a fighter holding no Lust whatever -- which would print
			//"They break unless something changes." under a section correctly saying nothing was about to
			//change their Lust. Death answers the question first, so that is what the note says instead.
			if (mark != null && mark.breakMargin != null) {
				var falling = mark.lethal == true || mark.healthAfter === 0;
				markup += '<div class="hcTooltipNote' + (mark.breakMargin <= 0 && falling == false ? " hcTooltipWarn" : "") + '">' +
					(falling
						? honeycomb.tooltip.html("lust.breakMoot")
						: mark.breakMargin <= 0
							? honeycomb.tooltip.html("lust.willBreak")
							: honeycomb.tooltip.html("lust.breakMargin", { amount: mark.breakMargin })) + "</div>";
			}
			//An enemy does not get the Broken state: breaking is the end of them.
			if (honeycomb.entityBreakBehavior(entity) == "defeated") {
				markup += '<div class="hcTooltipNote">' + honeycomb.tooltip.html("lust.breakingDefeats") + "</div>";
			}
			return markup;
		},
	},
	{
		//THE GOLD +N ON A BAR. The keyword panel alone could not answer it, because the question is about THIS fighter's
		//number at THIS moment -- so the panel is the keyword's words plus the arithmetic, worked out
		//through honeycomb.decayedTemporaryHealth so the printed answer is the one the turn will give.
		//`key` is the entity's instance id.
		index: "temporaryHealth",
		render: function (key) {
			var entity = honeycomb.findEntity(key,
				honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat);
			var keyword = honeycomb.keywordDefinition("temporaryHealth");
			var standing = entity == null || entity.temporaryHealth == null ? 0 : entity.temporaryHealth;

			var markup = honeycomb.tooltip.heading(keyword == null ? honeycomb.tooltip.text("temporaryHealth.fallbackHeading") : keyword.name,
				"#ffcf5c", standing <= 0 ? "" : "+" + standing);
			if (keyword != null) markup += '<div class="hcTooltipBody">' + honeycomb.escapeText(keyword.description) + "</div>";
			//WHAT THE ENEMY TURN WILL EAT, before the halving is mentioned, because
			//that is the order the two happen in and the order the bar prints them.
			var mark = honeycomb.forecast == null ? null : honeycomb.forecast.markFor(key);
			var reading = honeycomb.ui.temporaryTotal(entity, mark);
			if (reading.after != null) {
				markup += '<div class="hcTooltipNote hcTooltipDecay">' + honeycomb.tooltip.html("temporaryHealth.enemyTurn",
					{ total: reading.total, after: reading.after, spent: reading.total - reading.after }) + "</div>";
				standing = reading.after;
			}
			//THE HALVING, named and counted.
			if (honeycomb.tuning.combat.temporaryHealthDecays == true) {
				var decayFraction = honeycomb.temporaryDecayFraction(entity);
				var kept = honeycomb.decayedTemporaryHealth(standing, decayFraction);
				var share = Math.round(decayFraction * 100);
				markup += '<div class="hcTooltipNote">' + honeycomb.tooltip.html("temporaryHealth.halving",
					{ share: share, rounding: honeycomb.tuning.combat.temporaryHealthDecayRounding }) + "</div>";
				if (standing > 0) {
					markup += '<div class="hcTooltipNote hcTooltipDecay">' + honeycomb.tooltip.html("temporaryHealth.nextTurn",
						{ standing: standing, kept: kept }) + "</div>";
				}
			}
			return markup;
		},
	},
	{
		//THE WHOLE NAMEPLATE READING, on the bar and its tab. The bar prints no
		//forecast numbers any more, so this panel carries all of them.
		//Health, then Lust, then Temporary HP -- each the same section its own tooltip always gave, so the
		//wording cannot drift between them. While BROKEN it instead explains the mechanic, how much HP and
		//lust they have, and how much more they will need to recover from the broken state at the start of
		//the player's next turn.
		//`key` is the entity's instance id.
		index: "nameplate",
		className: "hcTooltipNameplate",
		render: function (key, element) {
			var entity = honeycomb.findEntity(key,
				honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat);
			if (entity == null) return "";
			var section = function (kindIndex) {
				var kind = honeycomb.findDefinition(honeycomb.tooltipKindArray, kindIndex);
				var markup = kind == null ? "" : kind.render(key, element);
				return markup === "" ? "" : '<div class="hcTooltipSection">' + markup + "</div>";
			};

			if (entity.broken == true) {
				var keyword = honeycomb.keywordDefinition("broken");
				var temporary = Math.max(0, entity.temporaryHealth == null ? 0 : entity.temporaryHealth);
				var markup = honeycomb.tooltip.heading(keyword == null ? honeycomb.tooltip.text("nameplate.brokenFallbackHeading") : keyword.name, "#ff3b6b", "");
				if (keyword != null) markup += '<div class="hcTooltipBody">' + honeycomb.escapeText(keyword.description) + "</div>";
				markup += '<div class="hcTooltipRankLine">' + honeycomb.tooltip.html("nameplate.brokenReading", {
					health: Math.max(0, entity.health), maxHealth: entity.maxHealth,
					temporary: temporary > 0 ? honeycomb.tooltip.text("nameplate.brokenTemporary", { temporary: temporary }) : "",
					lust: Math.max(0, entity.lust == null ? 0 : entity.lust),
				}) + "</div>";
				var shortfall = honeycomb.recoveryShortfall(entity);
				markup += '<div class="hcTooltipNote' + (shortfall > 0 ? " hcTooltipWarn" : "") + '">' +
					(shortfall > 0
						? honeycomb.tooltip.html("nameplate.recoveryShortfall", { amount: shortfall })
						: honeycomb.tooltip.html("nameplate.recovers")) + "</div>";
				return markup;
			}

			var result = section("health");
			if (honeycomb.entityUsesLust(entity) == true) result += section("lust");
			var mark = honeycomb.forecast == null ? null : honeycomb.forecast.markFor(key);
			if (honeycomb.ui.temporaryTotal(entity, mark).total > 0) result += section("temporaryHealth");
			return result;
		},
	},
	{
		index: "resource",
		render: function (key) {
			var definition = honeycomb.findDefinition(honeycomb.resourceArray, key);
			if (definition == null) return "";
			return honeycomb.tooltip.heading(definition.name, "#c9a961", String(honeycomb.getResource(key))) +
				'<div class="hcTooltipNote">' +
				honeycomb.escapeText(honeycomb.tooltip.scopeText(definition)) + "</div>";
		},
	},
];

//---------------------------------------------------------------------------------------------------
//The words
//---------------------------------------------------------------------------------------------------
//Every sentence a panel writes comes from honeycomb.tooltipTextArray (honeycomb-text-tooltips.js), so all
//of it can be read and corrected in one file. Later entries win, so a mod or translation can append.
honeycomb.tooltip.textByIndex = null;
honeycomb.tooltip.missingTextArray = {};

honeycomb.tooltip.textEntry = function (index) {
	if (honeycomb.tooltip.textByIndex == null) {
		honeycomb.tooltip.textByIndex = {};
		var entryArray = honeycomb.tooltipTextArray == null ? [] : honeycomb.tooltipTextArray;
		for (var entryIndex = 0; entryIndex < entryArray.length; entryIndex++) {
			honeycomb.tooltip.textByIndex[entryArray[entryIndex].index] = entryArray[entryIndex].text;
		}
	}
	return honeycomb.tooltip.textByIndex[index];
};

//Plain text with its {tokens} filled. A missing index prints as [index] and warns once.
honeycomb.tooltip.text = function (index, values) {
	var template = honeycomb.tooltip.textEntry(index);
	if (template == null) {
		if (honeycomb.tooltip.missingTextArray[index] != true && typeof console !== "undefined") {
			console.warn("[Honeycomb] Missing tooltip text: " + index);
		}
		honeycomb.tooltip.missingTextArray[index] = true;
		return "[" + index + "]";
	}
	return String(template).replace(/\{(\w+)\}/g, function (whole, name) {
		return values != null && values[name] != null ? String(values[name]) : whole;
	});
};

//The ".one" or ".many" entry by a count, with {count} filled in beside any other values.
honeycomb.tooltip.countText = function (index, count, values) {
	var filled = { count: count };
	if (values != null) {
		for (var name in values) {
			if (Object.prototype.hasOwnProperty.call(values, name)) filled[name] = values[name];
		}
	}
	return honeycomb.tooltip.text(index + (count === 1 ? ".one" : ".many"), filled);
};

//The same, escaped for markup.
honeycomb.tooltip.html = function (index, values) {
	return honeycomb.escapeText(honeycomb.tooltip.text(index, values));
};

//---------------------------------------------------------------------------------------------------
//Panel pieces
//---------------------------------------------------------------------------------------------------
//WHAT IS ABOUT TO MOVE ONE READING, as a panel section. Shared by the health, lust
//and Temporary HP tooltips so the three cannot word the same forecast three different ways.
//`kind` is the cause kind ("health" / "lust" / "temporary"); `field` names which of the mark's totals
//is the headline number.
honeycomb.tooltip.forecastSection = function (mark, kind, field) {
	if (mark == null) return '<div class="hcTooltipNote">' + honeycomb.tooltip.html("forecast.nothing") + "</div>";
	var lineArray = honeycomb.forecast == null ? [] : honeycomb.forecast.causeLineArray(mark, kind);
	var markup = "";

	//The headline: where it ends up, in the same words the bar prints.
	if (field == "health" && mark.healthAfter != null && mark.healthAfter !== mark.health) {
		markup += '<div class="hcTooltipRankLine">' + honeycomb.tooltip.html("forecast.headline", {
			from: mark.health, to: mark.lethal == true ? honeycomb.tooltip.text("forecast.down") : mark.healthAfter,
		}) + "</div>";
	} else if (field == "lust" && mark.lustAfter != null && mark.lustGained !== 0) {
		markup += '<div class="hcTooltipRankLine">' + honeycomb.tooltip.html("forecast.headline",
			{ from: mark.lustAfter - mark.lustGained, to: mark.lustAfter }) + "</div>";
	}

	if (lineArray.length === 0) {
		//A MIGHT WITH NO NAMED CAUSE: a random pick on a candidate it did not
		//land on. The bar draws the stretch; the tooltip has to say it too, or the number reads as coming
		//from nowhere. Beguile's Lust and a random attack's damage both arrive here.
		if (kind == "health" && mark.potentialDamage > 0) {
			return markup + '<div class="hcTooltipNote">' + honeycomb.tooltip.html("forecast.mightDamage", { amount: mark.potentialDamage }) + "</div>";
		}
		if (kind == "lust" && mark.lustMight > 0) {
			return markup + '<div class="hcTooltipNote">' + honeycomb.tooltip.html("forecast.mightLust", { amount: mark.lustMight }) + "</div>";
		}
		return markup + '<div class="hcTooltipNote">' + honeycomb.tooltip.html("forecast.nothing") + "</div>";
	}
	//AND WHAT IS DOING IT: the other half of the reading.
	markup += '<div class="hcTooltipCauses">';
	for (var scanIndex = 0; scanIndex < lineArray.length; scanIndex++) {
		var line = lineArray[scanIndex];
		markup += '<div class="hcTooltipCause">' +
			'<span class="hcTooltipCauseName">' +
			(line.chance == true ? honeycomb.tooltip.html("forecast.chance", { cause: line.text }) : honeycomb.escapeText(line.text)) + "</span>" +
			'<span class="hcTooltipCauseAmount' + (line.amount < 0 ? " hcCauseDown" : " hcCauseUp") + '">' +
			(line.amount > 0 ? "+" : "\u2212") + Math.abs(line.amount) + "</span></div>";
	}
	markup += "</div>";
	return markup;
};

//A weakness's one Lust Event line: "Recently ranked up!" while the rank-up waits to
//be seen. The Event Ready! button lives on the character instead, because a
//queue row's requirement need not be a weakness and so has no rail to sit on.
honeycomb.tooltip.lustEventSection = function (characterIndex, tagIndex) {
	if (honeycomb.lustEvents == null || honeycomb.lustEvents.tagRecentlyRanked(characterIndex, tagIndex) == false) return "";
	return '<div class="hcTooltipNote hcLustText">' + honeycomb.tooltip.html("weakness.recentlyRanked") + "</div>";
};

//THE BUTTON THAT PLAYS THE HEAD OF A CHARACTER'S QUEUE, and under it how many follow. Built here so the
//roster's heart panel and the character sheet's banner cannot drift apart. Returns "" for a character
//with nothing waiting.
honeycomb.tooltip.lustEventLaunchMarkup = function (characterIndex) {
	if (honeycomb.lustEvents == null) return "";
	var queueArray = honeycomb.lustEvents.queueFor(characterIndex);
	if (queueArray.length === 0) return "";
	var markup = '<div class="hcLustEventButtonList">' +
		'<div class="hcButton hcLustEventButton" onclick="event.stopPropagation();honeycomb.lustEvents.begin(\'' +
		honeycomb.escapeAttribute(characterIndex) + "','" + honeycomb.escapeAttribute(queueArray[0].index) +
		'\')">' + honeycomb.escapeText(honeycomb.tooltip.text("weakness.eventButton")) + "</div></div>";
	//HOW MANY FOLLOW, NEVER WHICH: the queue is the running order of the story, and naming what is next
	//would spoil it. See honeycomb.lustEvents.queueFor.
	if (queueArray.length > 1) {
		markup += '<div class="hcTooltipNote">' + honeycomb.tooltip.html("weakness.moreWaiting", { count: queueArray.length - 1 }) + "</div>";
	}
	return markup;
};

//THE TOOLTIP'S OWN KEY: printed on the panel while the debug toggle is on,
//so a string can be found and corrected without guessing which tooltip it came from. The format is
//stable and greppable: "tooltip:<kind>:<key>". See the debug panel's toggleTooltipKeys action.
honeycomb.tooltip.debugKeyMarkup = function (kindIndex, key) {
	if (honeycomb.debug == null || honeycomb.debug.tooltipKeys != true) return "";
	return '<div class="hcTooltipDebugKey">tooltip:' + honeycomb.escapeText(String(kindIndex)) + ":" +
		honeycomb.escapeText(String(key == null ? "" : key)) + "</div>";
};

honeycomb.tooltip.heading = function (name, color, aside) {
	return '<div class="hcTooltipHead" style="--hcTipColor:' + (color == null ? "#efe4cf" : color) + '">' +
		'<span class="hcTooltipName">' + honeycomb.escapeText(name) + "</span>" +
		(aside == null || aside === "" ? "" : '<span class="hcTooltipAside">' + honeycomb.escapeText(aside) + "</span>") +
		"</div>";
};

//The line under a zoomed card: whose it is, and why it cannot be played right now. Keywords are no
//longer listed here -- they have a sidecar of their own, which explains them rather than naming them.
honeycomb.tooltip.cardFooter = function (resolved) {
	var noteArray = [];
	//A SWAPPED BROKEN CARD SAYS WHAT IT REPLACED. A character has many broken forms now --
	//one per card -- so the zoomed copy names the card underneath rather than leaving it a stranger.
	if (resolved.brokenFrom != null) {
		var under = honeycomb.findDefinition(honeycomb.cardArray, resolved.brokenFrom);
		if (under != null) noteArray.push(honeycomb.tooltip.text("card.brokenFrom", { name: under.name }));
	}
	var member = honeycomb.cardOwnerMember(resolved);
	if (member != null) {
		var definition = honeycomb.findDefinition(honeycomb.characterArray, member.characterIndex);
		if (definition != null) noteArray.push(honeycomb.tooltip.text("card.owner", { name: definition.name }));
	}
	var reason = honeycomb.tooltip.unplayableReason(resolved);
	if (reason !== "") noteArray.push(reason);
	if (noteArray.length === 0) return "";
	return '<div class="hcTooltipNote">' + honeycomb.escapeText(noteArray.join(" · ")) + "</div>";
};

//Why a card cannot be played right now, or "" -- the question a zoom is usually asked.
honeycomb.tooltip.unplayableReason = function (resolved) {
	var combat = honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (combat == null) return "";
	var playability = honeycomb.cardPlayability(resolved, combat);
	return playability.playable == false && playability.explanation ? playability.explanation : "";
};

//THE KEYWORD SIDECAR: one small panel per keyword the card carries, each saying what the word means.
//The card text stays short because the explanation lives here, and a keyword gets the same panel on
//every card it appears on. Empty for a card with no keywords.
honeycomb.tooltip.keywordSidecar = function (resolved) {
	var keywordIndexArray = honeycomb.cardKeywordArray(resolved);
	if (keywordIndexArray.length === 0) return "";
	var markup = '<div class="hcKeywordSidecar">';
	for (var scanIndex = 0; scanIndex < keywordIndexArray.length; scanIndex++) {
		var keyword = honeycomb.keywordDefinition(keywordIndexArray[scanIndex]);
		if (keyword == null) continue;
		markup += honeycomb.tooltip.keywordPanel(keyword);
	}
	markup += "</div>";
	return markup;
};

honeycomb.tooltip.keywordPanel = function (keyword) {
	return '<div class="hcKeywordPanel" style="--hcKeywordColor:' + (keyword.color == null ? "#efe4cf" : keyword.color) + '">' +
		'<div class="hcKeywordPanelName">' + honeycomb.escapeText(keyword.name) + "</div>" +
		'<div class="hcKeywordPanelText">' + honeycomb.escapeText(keyword.description == null ? "" : keyword.description) + "</div></div>";
};

//An AI combatant's move as a readable card: the card, the keyword sidecar, and a line saying who it is
//aimed at and whose it is -- "aimed at the party member in front" when an enemy plays it. Shared by the
//hover zoom and the list of moves.
honeycomb.tooltip.moveCardPanel = function (entity, cardIndex, combat) {
	var card = honeycomb.moveCard(entity, cardIndex);
	if (card == null) return "";
	var markup = '<div class="hcTooltipCardRow"><div class="hcTooltipCardColumn">';
	markup += honeycomb.ui.card(card, { size: "large", showAffinity: false, showTooltip: false, className: "hcIntentCard",
		live: { source: entity, target: null, combat: combat } });
	var noteArray = [];
	var name = honeycomb.entityName(entity);
	if (name !== "") noteArray.push(honeycomb.tooltip.text("intent.whoseMove", { name: name }));
	var aimedAt = honeycomb.targetModeText(card.targetMode, "name", entity.side);
	if (aimedAt != null && honeycomb.targetModeRelation(card.targetMode) != null && honeycomb.targetModeRelation(card.targetMode) != "self") {
		noteArray.push(honeycomb.tooltip.text("intent.aimedAt", { target: aimedAt }));
	}
	if (noteArray.length > 0) markup += '<div class="hcTooltipNote">' + honeycomb.escapeText(noteArray.join(", ")) + ".</div>";
	markup += "</div>";
	markup += honeycomb.tooltip.keywordSidecar(card);
	markup += "</div>";
	return markup;
};

honeycomb.tooltip.stackTypeText = function (definition) {
	if (definition.stackType == "duration") {
		return honeycomb.tooltip.text(definition.decayTiming == "ownerTurnStart" ? "status.durationStart" : "status.durationEnd");
	}
	if (definition.stackType == "intensity") {
		if (definition.clearTiming == "ownerTurnEnd") return honeycomb.tooltip.text("status.clearsTurnEnd");
		return honeycomb.tooltip.text(definition.persistsBetweenCombats == true ? "status.intensityCarried" : "status.intensity");
	}
	return honeycomb.tooltip.text("status.tally");
};

honeycomb.tooltip.rechargeText = function (definition) {
	switch (definition.rechargeOn) {
		case "combatStart": return honeycomb.tooltip.text("ability.rechargeCombatStart");
		case "turnStart": return honeycomb.tooltip.text("ability.rechargeTurnStart");
		case "rest": return honeycomb.tooltip.text("ability.rechargeRest");
		default: return honeycomb.tooltip.text("ability.rechargeNever");
	}
};

honeycomb.tooltip.scopeText = function (definition) {
	switch (definition.scope) {
		case "profile": return honeycomb.tooltip.text("resource.scopeProfile");
		case "run": return honeycomb.tooltip.text("resource.scopeRun");
		case "combat": return honeycomb.tooltip.text("resource.scopeCombat");
		default: return "";
	}
};

//---------------------------------------------------------------------------------------------------
//Showing and hiding
//---------------------------------------------------------------------------------------------------
//The attributes an element needs to become hoverable. Returned as a string because the whole UI is
//built as markup and written in one innerHTML pass.
//An ability's requirements with no owner to ask about -- the deck screen, the roster. Each is listed
//without a tick, since "met" is a question about a fight.
honeycomb.tooltip.requirementListFor = function (definition) {
	var result = [];
	var requirementArray = definition.requirementArray == null ? [] : definition.requirementArray;
	for (var scanIndex = 0; scanIndex < requirementArray.length; scanIndex++) {
		result.push({ text: honeycomb.abilities.requirementText(requirementArray[scanIndex]), met: null });
	}
	return result;
};

honeycomb.tooltip.attributes = function (kindIndex, key, extraArray) {
	var kind = honeycomb.findDefinition(honeycomb.tooltipKindArray, kindIndex);
	var call = "'" + kindIndex + "','" + honeycomb.escapeAttribute(String(key)) + "'";
	//TOUCH: a tap shows the panel too, and `data-hcTip` marks this as something that
	//has one, so a tap anywhere else puts it away (honeycomb.tooltip.onTouchElsewhere). Browsers disagree
	//about whether a tap raises mouseenter at all, so neither behaviour is left to them.
	//An INTERACTIVE panel closes after a grace period instead, so the pointer can reach
	//its buttons.
	var leave = kind != null && kind.interactive == true ? "honeycomb.tooltip.hideSoon()" : "honeycomb.tooltip.hide()";
	var attributes = ' data-hcTip="1" onmouseenter="honeycomb.tooltip.show(this,' + call + ',event)"' +
		' onmouseleave="' + leave + '" onpointerup="honeycomb.tooltip.onTap(this,' + call + ',event)"';
	//A following panel tracks the pointer across its anchor, through an inline handler like every
	//other: no document listener is ever added.
	if (kind != null && kind.follow == true) attributes += ' onmousemove="honeycomb.tooltip.follow(event)"';
	if (extraArray != null) {
		for (var name in extraArray) {
			if (Object.prototype.hasOwnProperty.call(extraArray, name) == false) continue;
			attributes += ' data-hc' + name + '="' + honeycomb.escapeAttribute(String(extraArray[name])) + '"';
		}
	}
	return attributes;
};

honeycomb.tooltip.element = function () {
	var existing = document.getElementById(honeycomb.tuning.dom.tooltipId);
	if (existing != null) return existing;

	//Hung on the OVERLAY HOST rather than the scene root, so a tooltip is never clipped by a panel
	//and always draws above an open overlay.
	var host = honeycomb.overlayHostElement();
	if (host == null) return null;
	var element = document.createElement("div");
	element.id = honeycomb.tuning.dom.tooltipId;
	element.className = "hcTooltip";
	element.hidden = true;
	//Only an interactive panel takes the pointer at all (the stylesheet keeps the rest inert); these keep
	//it open while the pointer is on it. Listeners on honeycomb's own element, never the document.
	element.addEventListener("mouseenter", function () { honeycomb.tooltip.cancelHide(); });
	element.addEventListener("mouseleave", function () {
		if (honeycomb.tooltip.interactive == true) honeycomb.tooltip.hideSoon();
	});
	host.appendChild(element);
	return element;
};

//INTERACTIVE PANELS. A kind marked `interactive` draws buttons, so its panel takes the
//pointer, waits `tuning.ui.interactiveTooltipGraceMs` before closing once the pointer leaves, and can be
//PINNED open by a click (showInteractive), after which only a press somewhere else closes it.
honeycomb.tooltip.interactive = false;
honeycomb.tooltip.pinned = false;
honeycomb.tooltip.pinnedAnchor = null;
honeycomb.tooltip.hideTimer = null;

honeycomb.tooltip.cancelHide = function () {
	if (honeycomb.tooltip.hideTimer != null) clearTimeout(honeycomb.tooltip.hideTimer);
	honeycomb.tooltip.hideTimer = null;
};

//Deliberately a raw hand-speed wait rather than honeycomb.duration: it is how long a pointer takes to cross
//a gap, which the play-speed setting has nothing to do with.
honeycomb.tooltip.hideSoon = function () {
	if (honeycomb.tooltip.pinned == true) return;
	honeycomb.tooltip.cancelHide();
	honeycomb.tooltip.hideTimer = setTimeout(function () {
		honeycomb.tooltip.hideTimer = null;
		if (honeycomb.tooltip.pinned != true) honeycomb.tooltip.hide();
	}, honeycomb.tuning.ui.interactiveTooltipGraceMs);
};

//Opens a panel and holds it open until a press lands outside it and its anchor.
honeycomb.tooltip.showInteractive = function (anchor, kindIndex, key) {
	honeycomb.tooltip.pinned = false;
	honeycomb.tooltip.show(anchor, kindIndex, key, null);
	var element = document.getElementById(honeycomb.tuning.dom.tooltipId);
	if (element == null || element.hidden == true) return;
	honeycomb.tooltip.pinned = true;
	honeycomb.tooltip.pinnedAnchor = anchor;
};

//Any press on honeycomb's own elements (honeycomb.input.notePointer): a pinned panel closes when the press
//is outside both the panel and what opened it.
honeycomb.tooltip.onPointerDown = function (event) {
	//A PANEL WHOSE ANCHOR IS GONE goes on the next press, whatever it was. Every overlay that redraws itself
	//destroys the element a panel was describing without a mouseleave (the rest's upgrade window, for example).
	var shownAnchor = honeycomb.tooltip.anchor;
	if (shownAnchor != null && shownAnchor.isConnected == false) { honeycomb.tooltip.hide(); return; }
	if (honeycomb.tooltip.pinned != true) return;
	var element = document.getElementById(honeycomb.tuning.dom.tooltipId);
	var target = event == null ? null : event.target;
	if (target != null && element != null && element.contains(target)) return;
	var anchor = honeycomb.tooltip.pinnedAnchor;
	if (target != null && anchor != null && anchor.contains != null && anchor.contains(target)) return;
	honeycomb.tooltip.hide();
};

//Tooltips off, without switching the feature off. Held while something is being DRAGGED: an element
//that follows the pointer keeps entering and leaving itself, so it re-raises its own tooltip several
//times a second, and the panel then chases the drag around the screen. Kept as a plain flag rather
//than the tooltip knowing what a drag is -- this file knows nothing about combat and should not start.
honeycomb.tooltip.suppressed = false;

honeycomb.tooltip.suppress = function (suppressed) {
	honeycomb.tooltip.suppressed = suppressed == true;
	if (honeycomb.tooltip.suppressed == true) honeycomb.tooltip.hide();
};

honeycomb.tooltip.show = function (anchor, kindIndex, key, pointerEvent) {
	if (honeycomb.tuning.ui.tooltipsEnabled != true) return;
	if (honeycomb.tooltip.suppressed == true) return;
	var kind = honeycomb.findDefinition(honeycomb.tooltipKindArray, kindIndex);
	if (kind == null || anchor == null) return;
	//A pinned panel is not replaced by passing hover; the thing that opened it may reopen it.
	if (honeycomb.tooltip.pinned == true && anchor !== honeycomb.tooltip.pinnedAnchor) return;
	honeycomb.tooltip.cancelHide();

	var markup = kind.render(key, anchor);
	if (markup === "") { honeycomb.tooltip.hide(); return; }
	markup += honeycomb.tooltip.debugKeyMarkup(kindIndex, key);

	var element = honeycomb.tooltip.element();
	if (element == null) return;
	honeycomb.tooltip.interactive = kind.interactive == true;
	element.className = "hcTooltip" + (kind.className == null ? "" : " " + kind.className) +
		(kind.interactive == true ? " hcTooltipInteractive" : "");
	element.innerHTML = markup;
	element.hidden = false;
	//Drop any scale a previous, taller panel needed, so a short one is not left shrunk.
	element.style.transform = "";
	honeycomb.tooltip.anchor = anchor;
	honeycomb.tooltip.noteShown(kind, key, anchor);
	honeycomb.tooltip.following = kind.follow == true;
	honeycomb.tooltip.besideAnchor = kind.besideAnchor == true ? anchor : null;
	honeycomb.tooltip.preferBelow = kind.preferBelow == true;
	if (honeycomb.tooltip.following == true && pointerEvent != null && pointerEvent.clientX != null) {
		honeycomb.tooltip.positionAtPoint(element, pointerEvent.clientX, pointerEvent.clientY);
		//The anchor may still be growing (a hovered hand card), so the panel is placed again once it has.
		if (honeycomb.tooltip.besideAnchor != null) {
			var settleX = pointerEvent.clientX;
			var settleY = pointerEvent.clientY;
			var settleAnchor = anchor;
			setTimeout(function () {
				if (honeycomb.tooltip.besideAnchor !== settleAnchor || element.hidden == true) return;
				honeycomb.tooltip.positionAtPoint(element, settleX, settleY);
			}, honeycomb.duration(honeycomb.tuning.ui.tooltipAnchorSettleMs));
		}
		return;
	}
	honeycomb.tooltip.position(element, anchor);
};

//A panel placed deliberately rather than by hover: beside a HELD card, at its top-right corner, where
//the reticle being dragged across the board will not cover it. Shows even while hover tooltips are
//suppressed for the drag -- suppression exists to stop a moving element raising its own tooltip, and
//this one is asked for on purpose.
honeycomb.tooltip.showPinned = function (anchor, kindIndex, key, placement) {
	if (honeycomb.tuning.ui.tooltipsEnabled != true || anchor == null) return;
	var kind = honeycomb.findDefinition(honeycomb.tooltipKindArray, kindIndex);
	if (kind == null) return;
	var markup = kind.render(key, anchor);
	var element = honeycomb.tooltip.element();
	if (element == null) return;
	if (markup === "") { honeycomb.tooltip.hide(); return; }
	markup += honeycomb.tooltip.debugKeyMarkup(kindIndex, key);
	element.className = "hcTooltip" + (kind.className == null ? "" : " " + kind.className);
	element.innerHTML = markup;
	element.hidden = false;
	honeycomb.tooltip.anchor = anchor;
	honeycomb.tooltip.noteShown(kind, key, anchor);
	honeycomb.tooltip.following = false;

	var gap = honeycomb.pixels(honeycomb.tuning.ui.tooltipGapPixels);
	var box = anchor.getBoundingClientRect();
	var panel = element.getBoundingClientRect();
	var left = placement == "topRight" ? box.right + gap : box.left - panel.width - gap;
	if (left + panel.width > window.innerWidth - gap) left = box.left - panel.width - gap;
	if (left < gap) left = gap;
	var top = Math.max(gap, Math.min(box.top, window.innerHeight - panel.height - gap));
	element.style.left = Math.round(left) + "px";
	element.style.top = Math.round(top) + "px";
};

//A TAP on something with a panel shows it, placed beside the thing rather than at the finger. Panels
//that follow the pointer are skipped: those belong to the hand, which pins its own on a tap (see
//honeycomb.combatScene.touchInspect).
honeycomb.tooltip.onTap = function (anchor, kindIndex, key, pointerEvent) {
	if (pointerEvent == null || (pointerEvent.pointerType != "touch" && pointerEvent.pointerType != "pen")) return;
	var kind = honeycomb.findDefinition(honeycomb.tooltipKindArray, kindIndex);
	if (kind == null || kind.follow == true) return;
	honeycomb.tooltip.show(anchor, kindIndex, key, null);
};

//A touch that lands on nothing with a panel puts the open panel away -- a touchscreen has no pointer
//to leave the thing it was describing. Called from honeycomb.input.notePointer.
honeycomb.tooltip.onTouchElsewhere = function (event) {
	var element = document.getElementById(honeycomb.tuning.dom.tooltipId);
	if (element == null || element.hidden == true) return;
	var target = event == null ? null : event.target;
	if (target != null && target.closest != null && target.closest("[data-hcTip]") != null) return;
	//A tap on the panel itself is a tap on one of its buttons, not a tap elsewhere.
	if (target != null && element.contains(target)) return;
	honeycomb.tooltip.hide();
};

//True while the panel on show is one that tracks the pointer.
honeycomb.tooltip.following = false;

honeycomb.tooltip.follow = function (pointerEvent) {
	if (honeycomb.tooltip.following != true || pointerEvent == null) return;
	var element = document.getElementById(honeycomb.tuning.dom.tooltipId);
	if (element == null || element.hidden == true) return;
	honeycomb.tooltip.positionAtPoint(element, pointerEvent.clientX, pointerEvent.clientY);
};

honeycomb.tooltip.hide = function () {
	var element = document.getElementById(honeycomb.tuning.dom.tooltipId);
	//`hidden` rather than display, so the CSS reset's [hidden] rule does the work and nothing has to
	//remember what the display value was. Any fit-to-screen scale is dropped with it.
	if (element != null) { element.hidden = true; element.style.transform = ""; }
	honeycomb.tooltip.following = false;
	honeycomb.tooltip.besideAnchor = null;
	honeycomb.tooltip.anchor = null;
	honeycomb.tooltip.cancelHide();
	honeycomb.tooltip.interactive = false;
	honeycomb.tooltip.pinned = false;
	honeycomb.tooltip.pinnedAnchor = null;
	honeycomb.tooltip.noteShown(null, null, null);
};

//Which panel is on show, so a kind's onHide hears about it going whether it was hidden or replaced by
//another panel, and its onShow hears it arrive. {kind, key} or null.
honeycomb.tooltip.shown = null;

honeycomb.tooltip.noteShown = function (kind, key, anchor) {
	var previous = honeycomb.tooltip.shown;
	if (previous != null && kind === previous.kind && key === previous.key) return;
	honeycomb.tooltip.shown = kind == null ? null : { kind: kind, key: key };
	if (previous != null && typeof previous.kind.onHide === "function") previous.kind.onHide(previous.key);
	if (kind != null && typeof kind.onShow === "function") kind.onShow(key, anchor);
};

//The element the panel on show describes, or null. Read by onPointerDown to clear a panel it outlived.
honeycomb.tooltip.anchor = null;

//The element a following panel must stand beside rather than cover, or null. See `besideAnchor` on a kind.
honeycomb.tooltip.besideAnchor = null;

//Whether the open panel prefers to hang BELOW its anchor. Set from a kind's `preferBelow`; used by the
//progression tree, whose lit route comes from above the node the pointer is on.
honeycomb.tooltip.preferBelow = false;

//A panel taller than the screen is SHRUNK to fit: without it, a panel too tall to place can sit off the
//edge and read as not displaying at all. Scaling keeps every line on screen instead.
//Returns the element's rectangle after any scaling, so placement works from the real size.
honeycomb.tooltip.fitToViewport = function (element, gap) {
	var panel = element.getBoundingClientRect();
	var available = window.innerHeight - gap * 2;
	if (panel.height <= 0 || panel.height <= available) return panel;
	var minimum = honeycomb.tuning.ui.tooltipMinimumScale;
	var scale = Math.max(minimum == null ? 1 : minimum, available / panel.height);
	//Origin top-left, so the style `left`/`top` remain the panel's visual top-left after scaling and the
	//placement below can work from the returned rectangle unchanged.
	element.style.transformOrigin = "0 0";
	element.style.transform = "scale(" + scale + ")";
	return element.getBoundingClientRect();
};

//Whether a placed panel intersects a rectangle, as the overlapping area. Pure, so the placement rule
//and its test share one definition of "covers".
honeycomb.tooltip.overlapArea = function (left, top, width, height, rect) {
	if (rect == null) return 0;
	var x = Math.min(left + width, rect.left + rect.width) - Math.max(left, rect.left);
	var y = Math.min(top + height, rect.top + rect.height) - Math.max(top, rect.top);
	return x <= 0 || y <= 0 ? 0 : x * y;
};

//WHERE A PANEL GOES SO IT DOES NOT COVER WHAT IT DESCRIBES. Pure geometry: rectangles in, a position
//out, no DOM. A panel is tried below, above, right and left of the anchor in preference order, and each
//try is clamped to the viewport. The first try that overlaps NONE of `avoidArray` (the anchor by
//default) wins; if every try overlaps, the least-overlapping one is used so the panel is never parked
//off-screen. This is what keeps a tall tree tooltip -- Set Stance, Brace, an Ability node -- from being
//clamped to the top of the screen and painted over the very node it is explaining.
//
//  anchor      {left, top, width, height}
//  panel       {width, height}
//  viewport    {width, height}
//  preferBelow true for the tree, false (above) for most tooltips
//  avoidArray  rectangles to keep off; defaults to [anchor]
honeycomb.tooltip.placementFor = function (anchor, panel, viewport, preferBelow, gap, avoidArray) {
	var avoid = avoidArray == null ? [anchor] : avoidArray;
	var centeredLeft = anchor.left + (anchor.width / 2) - (panel.width / 2);
	var belowTop = anchor.top + anchor.height + gap;
	var aboveTop = anchor.top - panel.height - gap;
	var sideTop = anchor.top;
	var sideMiddleTop = anchor.top + (anchor.height / 2) - (panel.height / 2);

	var candidateArray = [];
	if (preferBelow == true) {
		candidateArray.push({ left: centeredLeft, top: belowTop });
		candidateArray.push({ left: centeredLeft, top: aboveTop });
	} else {
		candidateArray.push({ left: centeredLeft, top: aboveTop });
		candidateArray.push({ left: centeredLeft, top: belowTop });
	}
	candidateArray.push({ left: anchor.left + anchor.width + gap, top: sideTop });
	candidateArray.push({ left: anchor.left - panel.width - gap, top: sideTop });
	candidateArray.push({ left: anchor.left + anchor.width + gap, top: sideMiddleTop });
	candidateArray.push({ left: anchor.left - panel.width - gap, top: sideMiddleTop });

	function clamp(candidate) {
		var maxLeft = viewport.width - panel.width - gap;
		var maxTop = viewport.height - panel.height - gap;
		return {
			//A panel wider (or taller) than the screen cannot be clamped to a negative span; park it at
			//the margin so it is at least fully reachable on the leading edge.
			left: Math.max(gap, Math.min(candidate.left, maxLeft < gap ? gap : maxLeft)),
			top: Math.max(gap, Math.min(candidate.top, maxTop < gap ? gap : maxTop)),
		};
	}
	function overlapOf(position) {
		var total = 0;
		for (var scanIndex = 0; scanIndex < avoid.length; scanIndex++) {
			total += honeycomb.tooltip.overlapArea(position.left, position.top, panel.width, panel.height, avoid[scanIndex]);
		}
		return total;
	}

	var best = null;
	for (var candidateIndex = 0; candidateIndex < candidateArray.length; candidateIndex++) {
		var placed = clamp(candidateArray[candidateIndex]);
		var overlap = overlapOf(placed);
		if (overlap === 0) return placed;
		//Remember the least-bad placement in case none is clear.
		if (best == null || overlap < best.overlap) best = { left: placed.left, top: placed.top, overlap: overlap };
	}
	return { left: best.left, top: best.top };
};

//Beside the pointer rather than beside an anchor: to the right and a little up by preference, flipping
//to the other side of the pointer rather than spilling off the screen. The offset keeps the panel from
//sitting under the pointer, where it would cover the very thing being pointed at.
honeycomb.tooltip.positionAtPoint = function (element, clientX, clientY) {
	var offset = honeycomb.pixels(honeycomb.tuning.ui.tooltipFollowOffsetPixels);
	var gap = honeycomb.pixels(honeycomb.tuning.ui.tooltipGapPixels);
	var panel = honeycomb.tooltip.fitToViewport(element, gap);

	//BESIDE THE ANCHOR: to its right, else its left, level with the pointer. Only when neither side has
	//room does the panel fall back to the pointer.
	var beside = honeycomb.tooltip.besideAnchor;
	var box = beside == null || beside.isConnected == false ? null : beside.getBoundingClientRect();
	if (box != null && box.width > 0) {
		var besideLeft = box.right + gap;
		if (besideLeft + panel.width > window.innerWidth - gap) besideLeft = box.left - gap - panel.width;
		if (besideLeft >= gap) {
			var besideTop = Math.max(gap, Math.min(clientY - panel.height / 2, window.innerHeight - panel.height - gap));
			element.style.left = Math.round(besideLeft) + "px";
			element.style.top = Math.round(besideTop) + "px";
			return;
		}
	}

	var left = clientX + offset;
	if (left + panel.width > window.innerWidth - gap) left = clientX - offset - panel.width;
	if (left < gap) left = gap;

	var top = clientY - panel.height - offset;
	if (top < gap) top = clientY + offset;
	if (top + panel.height > window.innerHeight - gap) top = Math.max(gap, window.innerHeight - panel.height - gap);

	element.style.left = Math.round(left) + "px";
	element.style.top = Math.round(top) + "px";
};

//Places the panel beside its anchor, flipping rather than spilling off the screen. Measured from the
//real rectangles, so it stays correct through any layout change.
honeycomb.tooltip.position = function (element, anchor) {
	var gap = honeycomb.pixels(honeycomb.tuning.ui.tooltipGapPixels);
	var box = anchor.getBoundingClientRect();

	//A DETACHED anchor measures as a zero rectangle at the origin, and placing a panel beside that
	//parks it in the top-left corner of the screen, floating over the game with nothing explaining it.
	//It happens whenever an element is replaced between the hover and this call -- which a repaint
	//does constantly. Nothing to point at means nothing to show.
	if (box.width === 0 && box.height === 0) { honeycomb.tooltip.hide(); return; }

	var panel = honeycomb.tooltip.fitToViewport(element, gap);

	//Above the anchor by preference: a tooltip below the cursor covers what the player is reading
	//next, and the hand is at the bottom of the screen. A kind may ask for BELOW instead (the
	//progression tree, whose lit route runs down from above the hovered node). The placement never
	//overlaps the anchor, moving to a side when neither above nor below has room, so a tall panel can
	//never be clamped over the thing it describes. See honeycomb.tooltip.placementFor.
	var placement = honeycomb.tooltip.placementFor(
		{ left: box.left, top: box.top, width: box.width, height: box.height },
		{ width: panel.width, height: panel.height },
		{ width: window.innerWidth, height: window.innerHeight },
		honeycomb.tooltip.preferBelow == true, gap);

	element.style.left = Math.round(placement.left) + "px";
	element.style.top = Math.round(placement.top) + "px";
};
