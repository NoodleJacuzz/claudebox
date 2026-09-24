//===================================================================================================
//Honeycomb Catacombs -- content warnings
//===================================================================================================
//Two tables, both open to new entries:
//  honeycomb.warningSubjectArray  WHAT is checked: a content table, by name.
//  honeycomb.warningRuleArray     WHAT IS WRONG: a rule over one subject's entries.
//A new rule is one table entry. honeycomb.warnings.report() builds the report as plain data (so a release
//workflow or a test can read it); honeycomb.warnings.print() writes it to the console. Nothing here
//touches the DOM or the save, and nothing changes content.

//---------------------------------------------------------------------------------------------------
//Subjects
//---------------------------------------------------------------------------------------------------
//`entryArray` is read at report time, not load time, so content appended after this file still counts.
honeycomb.warningSubjectArray = [
	{ index: "cards", name: "Cards", entryArray: function () { return honeycomb.cardArray; } },
	{ index: "characters", name: "Characters", entryArray: function () { return honeycomb.characterArray; } },
	{ index: "enemies", name: "Enemies", entryArray: function () { return honeycomb.enemyArray; } },
	{ index: "encounters", name: "Encounters", entryArray: function () { return honeycomb.encounterArray; } },
	{ index: "statuses", name: "Statuses", entryArray: function () { return honeycomb.statusArray; } },
	{ index: "abilities", name: "Abilities", entryArray: function () { return honeycomb.abilityArray; } },
	{ index: "equipment", name: "Equipment", entryArray: function () { return honeycomb.equipmentArray; } },
	{ index: "relics", name: "Relics", entryArray: function () { return honeycomb.relicArray; } },
	{ index: "events", name: "Events", entryArray: function () { return honeycomb.eventArray; } },
	//The queue's rows read into entries, with `index` set to the row's own name so a warning names it.
	{ index: "lustEventQueue", name: "Lust Event queue", entryArray: function () {
		return honeycomb.lustEvents == null ? [] : honeycomb.lustEvents.entryArray();
	} },
];

//---------------------------------------------------------------------------------------------------
//Rules
//---------------------------------------------------------------------------------------------------
//`check(entry, settings)` returns an array of messages, empty when the entry is fine. `settings` is
//tuning.warnings.
honeycomb.warningRuleArray = [
	{
		//A card naming a kind that is not registered would silently fall back to `normal`, which is
		//the permissive one -- so a typo would make a token offerable again.
		index: "cardKindRegistered",
		name: "Card names an unregistered kind",
		subject: "cards",
		check: function (card) {
			if (card.kind == null) return [];
			if (honeycomb.findDefinition(honeycomb.cardKindArray, card.kind) != null) return [];
			return ["kind \"" + card.kind + "\" is not in honeycomb.cardKindArray, so it falls back to normal and becomes offerable."];
		},
	},
	{
		//An encounter naming a token in its reward list. The reward roll refuses it, so the slot is
		//silently lost -- the content is wrong and says nothing.
		index: "phantomNotOffered",
		name: "Encounter offers a token card as a reward",
		subject: "encounters",
		check: function (encounter) {
			var messageArray = [];
			var rewardArray = encounter.rewardCardArray == null ? [] : encounter.rewardCardArray;
			for (var scanIndex = 0; scanIndex < rewardArray.length; scanIndex++) {
				var card = honeycomb.findDefinition(honeycomb.cardArray, rewardArray[scanIndex]);
				if (card == null || honeycomb.cardIsOfferable(card) == true) continue;
				messageArray.push("rewardCardArray names \"" + card.index + "\", which is a token and can never be offered.");
			}
			return messageArray;
		},
	},
	{
		//A piece's Move that PICKS enters the shared aim mode, and the mode is what decides who it
		//may land on. An activation that picks without naming one has nothing to judge legality with, so
		//the scene refuses to aim it and the Move silently does nothing. Caught at boot instead.
		index: "golemPickTargetMode",
		name: "A picking activation with no target mode",
		subject: "enemies",
		check: function (enemy) {
			var activation = enemy.allyActivation;
			if (activation == null || activation.pick == null) return [];
			if (activation.targetMode == null) {
				return ["allyActivation picks \"" + activation.pick + "\" but names no targetMode, so it can never be aimed."];
			}
			if (honeycomb.targetModeDefinition(activation.targetMode) == null) {
				return ["allyActivation names targetMode \"" + activation.targetMode + "\", which is not a registered mode."];
			}
			return [];
		},
	},
	{
		//A character marked `inDevelopment` is gated off the roster and is allowed to be
		//incomplete, so the content tests skip it -- which is only safe while something else keeps
		//saying it is there. This is that something. It names what is still missing, so the flag cannot
		//be forgotten and shipped.
		index: "characterInDevelopment",
		name: "Character still in development",
		subject: "characters",
		check: function (character) {
			if (character.inDevelopment != true) return [];
			var missingArray = [];
			if (character.progressionTree == null) missingArray.push("progression tree");
			if (honeycomb.findDefinition(honeycomb.cardArray, character.brokenCard) == null) missingArray.push("broken card");
			if (honeycomb.mechanicFor({ characterIndex: character.index }) == null) missingArray.push("mechanic");
			if (character.startingEquipmentArray == null || character.startingEquipmentArray.length === 0) missingArray.push("heirloom");
			var rankArray = ["starter", "common", "rare"];
			for (var rankIndex = 0; rankIndex < rankArray.length; rankIndex++) {
				var rank = rankArray[rankIndex];
				//ASKED THROUGH THE RESOLVER, not off a card's own `brokenCard`. A character may
				//name its forms BY RARITY (honeycomb.brokenFormIndexFor), and reading the field directly
				//reported three rarities missing on a character that had all three.
				var hasForm = honeycomb.cardArray.some(function (card) {
					if (card.characterIndex != character.index || card.rarity != rank) return false;
					var broken = honeycomb.findDefinition(honeycomb.cardArray, honeycomb.brokenFormIndexFor(card));
					return broken != null && broken.rarity == "broken";
				});
				if (hasForm == false) missingArray.push(rank + " broken form");
			}
			if (character.unlockedFromStart == true) missingArray.push("IS REACHABLE FROM THE START");
			return [character.index + " is flagged inDevelopment and the content tests skip it. Still missing: " +
				(missingArray.length === 0 ? "nothing -- clear the flag" : missingArray.join(", ")) + "."];
		},
	},
	{
		//A queue row that cannot be read is never ready, so the story beat it holds would simply
		//never happen. The reading itself says what is wrong (honeycomb.lustEvents.readEntry).
		index: "lustEventQueueRow",
		name: "Lust Event queue row that can never be played",
		subject: "lustEventQueue",
		check: function (entry) {
			var messageArray = entry.problem == null ? [] : ["[" + entry.index + "] " + entry.problem];
			var entryArray = honeycomb.lustEvents.entryArray();
			//TWO ROWS UNDER ONE NAME share one completion key, so playing either retires both.
			var repeated = entryArray.some(function (other, position) {
				return position < entry.position && other.index === entry.index;
			});
			if (repeated) messageArray.push("[" + entry.index + "] is written twice; both rows share one completion key.");
			if (entry.problem != null) return messageArray;

			//A REQUIREMENT THE ENGINE CANNOT ASK is silently false, which reads as a scene that never arrives.
			var requirementArray = honeycomb.lustEvents.requirementArray(entry);
			for (var scanIndex = 0; scanIndex < requirementArray.length; scanIndex++) {
				var requirement = requirementArray[scanIndex];
				if (typeof requirement === "function") continue;
				if (requirement == null || honeycomb.findDefinition(honeycomb.conditionArray, requirement.index) == null) {
					messageArray.push("[" + entry.index + "] has a requirement the engine cannot read: " +
						(requirement == null ? "null" : "\"" + requirement.index + "\"") + ".");
					continue;
				}
				//A lustEventDone pointing at nothing can never come true, so the row is unreachable.
				if (requirement.index != "lustEventDone") continue;
				var namedArray = requirement.entryArray == null ? [requirement.entry] : requirement.entryArray;
				for (var namedIndex = 0; namedIndex < namedArray.length; namedIndex++) {
					if (honeycomb.lustEvents.findEntry(namedArray[namedIndex]) != null) continue;
					messageArray.push("[" + entry.index + "] waits on queue row \"" + namedArray[namedIndex] + "\", which does not exist.");
				}
			}

			//{tag} AND {rank} COME FROM THE ROW, so an event using them under a row that names no tag prints
			//the braces at the player.
			if (entry.tag == null) {
				var event = honeycomb.findDefinition(honeycomb.eventArray, entry.eventIndex);
				var textArray = [];
				var collect = function (page) {
					if (page == null) return;
					textArray.push(page.name, page.text);
					(page.choiceArray == null ? [] : page.choiceArray).forEach(function (choice) {
						textArray.push(choice.text, choice.previewText, choice.resultText);
					});
				};
				collect(event);
				(event == null || event.pageArray == null ? [] : event.pageArray).forEach(collect);
				var said = textArray.filter(function (text) { return text != null; }).join(" ");
				if (/\{tag\}|\{rank\}/.test(said)) {
					messageArray.push("[" + entry.index + "] names no tag, but \"" + entry.eventIndex +
						"\" writes {tag} or {rank}, which would be printed as written.");
				}
			}
			return messageArray;
		},
	},
	{
		//Checked at every level of every upgrade ladder, since an upgrade can add effects and so types.
		index: "cardTypeCount",
		name: "Too many card types for a card frame",
		subject: "cards",
		check: function (card, settings) {
			var messageArray = [];
			var maximum = settings.maximumCardTypeCount;
			var formArray = honeycomb.warnings.cardFormArray(card);
			for (var formIndex = 0; formIndex < formArray.length; formIndex++) {
				var form = formArray[formIndex];
				var typeArray = honeycomb.cardTypeIndexArray(form.resolved);
				if (typeArray.length <= maximum) continue;
				messageArray.push(form.label + " has " + typeArray.length + " types (" + typeArray.join(", ") +
					"); the most a card frame holds is " + maximum + ".");
			}
			return messageArray;
		},
	},
	{
		//Lust aimed at the other team is written into the between-run weakness ledger
		//under the attack's LUST TAGS (`lustTag: true` in honeycomb.cardTagArray). A card with none teaches
		//the ledger nothing, or falls back to whatever tags its attacker happens to carry.
		index: "lustCardTag",
		name: "Card inflicts Lust without a lust tag",
		subject: "cards",
		check: function (card) {
			var messageArray = [];
			var formArray = honeycomb.warnings.cardFormArray(card);
			for (var formIndex = 0; formIndex < formArray.length; formIndex++) {
				var form = formArray[formIndex];
				if (!honeycomb.warnings.inflictsUntaggedLust(form.resolved)) continue;
				if (honeycomb.warnings.lustTagArray(form.resolved.tagArray).length > 0) continue;
				messageArray.push(form.label + " inflicts Lust on the other team but carries no lust tag (" +
					honeycomb.warnings.lustTagArray(null).join(", ") + ").");
			}
			return messageArray;
		},
	},
	{
		//A fight decided by a condition that does not exist, or by leaders the
		//encounter never fields, can never be won that way -- and says nothing about it while playing.
		index: "encounterEndConditions",
		name: "Encounter names a win or loss condition it cannot meet",
		subject: "encounters",
		check: function (encounter) {
			var messageArray = [];
			var fielded = (encounter.enemyIndexArray == null ? [] : encounter.enemyIndexArray)
				.concat(encounter.reinforcementArray == null ? [] : encounter.reinforcementArray);
			var fieldArray = ["victoryConditionArray", "defeatConditionArray"];
			for (var fieldIndex = 0; fieldIndex < fieldArray.length; fieldIndex++) {
				var conditionArray = encounter[fieldArray[fieldIndex]];
				if (conditionArray == null) continue;
				if (conditionArray.length === 0) messageArray.push(fieldArray[fieldIndex] + " is empty, so that outcome can never happen.");
				for (var conditionIndex = 0; conditionIndex < conditionArray.length; conditionIndex++) {
					var entry = conditionArray[conditionIndex];
					if (honeycomb.findDefinition(honeycomb.fightEndConditionArray, entry.index) == null) {
						messageArray.push(fieldArray[fieldIndex] + " names \"" + entry.index + "\", which is not in honeycomb.fightEndConditionArray.");
						continue;
					}
					//Leaders on the enemy team should be ones the encounter fields. A leader summoned mid-fight
					//is legitimate, so a tag match is not held to this.
					if (entry.index != "leadersBeaten" || fieldArray[fieldIndex] != "victoryConditionArray") continue;
					var indexArray = entry.indexArray == null ? [] : entry.indexArray;
					if (indexArray.length === 0 && (entry.tagArray == null || entry.tagArray.length === 0)) {
						messageArray.push("leadersBeaten names no indexArray or tagArray, so it can never be met.");
					}
					for (var leaderIndex = 0; leaderIndex < indexArray.length; leaderIndex++) {
						if (fielded.indexOf(indexArray[leaderIndex]) >= 0) continue;
						messageArray.push("leadersBeaten names \"" + indexArray[leaderIndex] + "\", which the encounter does not field.");
					}
				}
			}
			return messageArray;
		},
	},
	{
		//Every form of the
		//card at every size, every printed part, measured with the fonts' own widths (see
		//tuning.warnings.cardFit and honeycomb.warnings.cardFitReadingArray). Needs no browser.
		index: "cardFit",
		name: "Card line fuller than its known working reference",
		subject: "cards",
		check: function (card) {
			var messageArray = [];
			var formArray = honeycomb.warnings.cardFormArray(card);
			for (var formIndex = 0; formIndex < formArray.length; formIndex++) {
				var readingArray = honeycomb.warnings.cardFitReadingArray(formArray[formIndex].resolved);
				for (var readingIndex = 0; readingIndex < readingArray.length; readingIndex++) {
					var reading = readingArray[readingIndex];
					var budget = honeycomb.warnings.cardFitBudget(reading.part, reading.size);
					if (reading.fill <= budget.fill) continue;
					messageArray.push(formArray[formIndex].label + " " + reading.part + " at " + reading.size + " fills " +
						reading.fill.toFixed(3) + " of its box (" + reading.detail + "), past " + budget.fill.toFixed(3) +
						" from " + budget.source + ".");
				}
			}
			return messageArray;
		},
	},
	{
		//Two player cards, or a card and a status, printed under one name read as one thing in the
		//hand, the Compendium and a tooltip. Enemy moves are left out: they share the card table but are never
		//handed to the player. Reported on every card that shares the name, so neither can be missed.
		index: "duplicateCardName",
		name: "Card shares its name with another card or a status",
		subject: "cards",
		//One exception is deliberate: a card named for the status it applies (Pandemic grants Pandemic).
		//Starters are checked like everything else, with no exception for "the retired and the current"
		//form of one basic.
		check: function (card) {
			if (card.rarity == "enemy" || card.name == null) return [];
			var messageArray = [];
			for (var scanIndex = 0; scanIndex < honeycomb.cardArray.length; scanIndex++) {
				var other = honeycomb.cardArray[scanIndex];
				if (other === card || other.rarity == "enemy" || other.name != card.name) continue;
				messageArray.push("\"" + card.index + "\" and \"" + other.index + "\" are both named \"" + card.name + "\".");
			}
			var appliedArray = honeycomb.warnings.appliedStatusArray(card.effectArray);
			for (var statusIndex = 0; statusIndex < honeycomb.statusArray.length; statusIndex++) {
				var status = honeycomb.statusArray[statusIndex];
				if (status.name != card.name || appliedArray.indexOf(status.index) >= 0) continue;
				messageArray.push("\"" + card.index + "\" shares the name \"" + card.name + "\" with the status \"" + status.index + "\", which it does not apply.");
			}
			return messageArray;
		},
	},
	{
		//A card that plays
		//exactly like another card of the same character (cost, targeting and effects all equal) is a copy
		//under a second name, whatever it is called. Enemy moves, broken forms and special cards are skipped.
		index: "duplicateCardRules",
		name: "Card plays exactly like another card of the same character",
		subject: "cards",
		check: function (card) {
			var skippedArray = ["enemy", "broken", "special"];
			if (skippedArray.indexOf(card.rarity) >= 0) return [];
			var fingerprint = function (entry) {
				return JSON.stringify({ cost: entry.costArray, target: entry.targetMode, effect: entry.effectArray, type: entry.type, typeArray: entry.typeArray });
			};
			var own = fingerprint(card);
			var messageArray = [];
			for (var scanIndex = 0; scanIndex < honeycomb.cardArray.length; scanIndex++) {
				var other = honeycomb.cardArray[scanIndex];
				if (other === card || other.characterIndex != card.characterIndex || skippedArray.indexOf(other.rarity) >= 0) continue;
				if (fingerprint(other) != own) continue;
				messageArray.push("\"" + card.index + "\" plays exactly like \"" + other.index + "\".");
			}
			return messageArray;
		},
	},
	{
		//A status nothing READS is dead content: it is applied, printed on the
		//plate, and changes nothing. "Read" means the status has its own hooks, or a condition or value
		//names it -- an `applyStatus` alone is not a reader. See honeycomb.warnings.statusIsRead.
		index: "orphanStatus",
		name: "Status no hook or condition reads",
		subject: "statuses",
		check: function (status) {
			if (honeycomb.warnings.statusIsRead(status.index)) return [];
			return ["\"" + status.index + "\" is never read by a hook or condition, so applying it does nothing."];
		},
	},
];

//---------------------------------------------------------------------------------------------------
//The report
//---------------------------------------------------------------------------------------------------
honeycomb.warnings = {
	hasRun: false,
};

//Every status an effect list applies, however deeply nested (repeat, choices, per-target lists).
honeycomb.warnings.appliedStatusArray = function (effectArray) {
	var result = [];
	var walk = function (list) {
		for (var entryIndex = 0; list != null && entryIndex < list.length; entryIndex++) {
			var entry = list[entryIndex];
			if (entry == null) continue;
			if (entry.status != null) result.push(entry.status);
			if (entry.statusArray != null) result = result.concat(entry.statusArray);
			walk(entry.effectArray);
			var optionArray = entry.optionArray == null ? [] : entry.optionArray;
			for (var optionIndex = 0; optionIndex < optionArray.length; optionIndex++) walk(optionArray[optionIndex].effectArray);
		}
	};
	walk(effectArray);
	return result;
};

//Every form a card can be seen in: the plain card, then each level of each upgrade ladder. Resolved
//through honeycomb.resolveCard, so a rule reads exactly what the screen would print.
honeycomb.warnings.cardFormArray = function (card) {
	var formArray = [{ label: "\"" + card.index + "\"", resolved: honeycomb.resolveCard({ cardIndex: card.index }) }];
	var pathArray = honeycomb.cardUpgradePathArray(card);
	var ladderArray = [];
	if (pathArray.length > 0) {
		for (var pathIndex = 0; pathIndex < pathArray.length; pathIndex++) ladderArray.push(pathArray[pathIndex].index);
	} else {
		ladderArray.push(null);
	}
	for (var ladderIndex = 0; ladderIndex < ladderArray.length; ladderIndex++) {
		var pathName = ladderArray[ladderIndex];
		var levelCount = honeycomb.cardUpgradeArray(card, pathName).length;
		for (var level = 1; level <= levelCount; level++) {
			formArray.push({
				label: "\"" + card.index + "\" +" + level + (pathName == null ? "" : " (path " + pathName + ")"),
				resolved: honeycomb.resolveCard({ cardIndex: card.index, upgradeLevel: level, upgradePath: pathName }),
			});
		}
	}
	return formArray;
};

//The lust tags among a tag list, or every registered lust tag when the list is null.
honeycomb.warnings.lustTagArray = function (tagArray) {
	var result = [];
	for (var tagIndex = 0; tagIndex < honeycomb.cardTagArray.length; tagIndex++) {
		var tag = honeycomb.cardTagArray[tagIndex];
		if (tag.lustTag != true) continue;
		if (tagArray == null || tagArray.indexOf(tag.index) >= 0) result.push(tag.index);
	}
	return result;
};

//Whether a resolved card has a `lust` effect landing on the other team that names no `lustTagArray` of its
//own. Looks inside nested effects the same way honeycomb.deriveCardTypeArray does.
honeycomb.warnings.inflictsUntaggedLust = function (card) {
	var found = false;
	function walk(effectArray, targetMode) {
		if (effectArray == null || found) return;
		for (var entryIndex = 0; entryIndex < effectArray.length; entryIndex++) {
			var entry = effectArray[entryIndex];
			if (entry == null) continue;
			var mode = entry.targetOverride != null ? entry.targetOverride : targetMode;
			if (entry.index == "lust" && entry.lustTagArray == null && honeycomb.cardTypeRuleHarms(honeycomb.targetModeRelation(mode))) {
				found = true;
				return;
			}
			walk(entry.effectArray, mode);
			walk(entry.thenArray, mode);
			walk(entry.elseArray, mode);
			if (entry.optionArray != null) {
				for (var optionIndex = 0; optionIndex < entry.optionArray.length; optionIndex++) walk(entry.optionArray[optionIndex].effectArray, mode);
			}
		}
	}
	walk(card.effectArray, card.targetMode);
	return found;
};

//Whether a status is READ by anything. A status with its own hooks reads itself; otherwise a condition
//(`hasStatus`) or a value (`statusStacks`) somewhere must name it. An `applyStatus` is deliberately not a
//reader: applying a status nothing responds to is exactly the dead content the rule is looking for.
honeycomb.warnings.statusIsRead = function (statusIndex) {
	var definition = honeycomb.findDefinition(honeycomb.statusArray, statusIndex);
	if (definition != null && definition.hooks != null) {
		for (var hookName in definition.hooks) {
			if (Object.prototype.hasOwnProperty.call(definition.hooks, hookName)) return true;
		}
	}
	//Read by ENGINE CODE rather than a hook or a condition: a flag the status carries, or the explicit
	//`engineReads` mark. See tuning.warnings.statusReaderFieldArray.
	if (definition != null && definition.engineReads == true) return true;
	var readerFieldArray = honeycomb.tuning.warnings.statusReaderFieldArray == null
		? [] : honeycomb.tuning.warnings.statusReaderFieldArray;
	for (var readerIndex = 0; readerIndex < readerFieldArray.length; readerIndex++) {
		if (definition != null && definition[readerFieldArray[readerIndex]] != null) return true;
	}
	var found = false;
	function walk(node, depth) {
		if (found || node == null || depth > 14) return;
		if (Array.isArray(node)) {
			for (var arrayIndex = 0; arrayIndex < node.length; arrayIndex++) walk(node[arrayIndex], depth + 1);
			return;
		}
		if (typeof node !== "object") return;
		//A condition or a value that names the status outright. Anything else that carries a `status`
		//field is an application (applyStatus, consumeStatus, ...), which does not count.
		if (typeof node.index === "string" && node.status === statusIndex &&
			(honeycomb.findDefinition(honeycomb.conditionArray, node.index) != null ||
				honeycomb.findDefinition(honeycomb.valueArray, node.index) != null)) {
			found = true;
			return;
		}
		for (var key in node) {
			if (Object.prototype.hasOwnProperty.call(node, key)) walk(node[key], depth + 1);
		}
	}
	walk([honeycomb.cardArray, honeycomb.abilityArray, honeycomb.enemyArray, honeycomb.equipmentArray,
		honeycomb.relicArray, honeycomb.characterArray, honeycomb.eventArray], 0);
	return found;
};

//---------------------------------------------------------------------------------------------------
//Card fit, measured from font widths
//---------------------------------------------------------------------------------------------------
//A card is one picture at every width (everything on it is in card units), so a line's fill of its box is
//the same number whatever size the card is drawn at; only what a SIZE prints and how its name is set
//differ. Widths are in ems of the part's font; boxes are converted to ems of that font at its fitted size.

honeycomb.warnings.fontMetric = function (fontIndex) {
	var metricArray = honeycomb.fontMetricArray == null ? [] : honeycomb.fontMetricArray;
	return honeycomb.findDefinition(metricArray, fontIndex);
};

//One character's advance in ems, letter spacing and synthesised bold included.
honeycomb.warnings.characterWidthEm = function (metric, character, options) {
	var advance = metric.advance[character];
	if (advance == null) advance = metric.fallbackAdvance;
	var width = advance + (options.letterSpacingEm == null ? 0 : options.letterSpacingEm);
	return options.bold == true ? width + honeycomb.tuning.warnings.cardFit.syntheticBoldExtraEm : width;
};

//A plain string's width in ems. `options`: letterSpacingEm, uppercase, bold.
honeycomb.warnings.textWidthEm = function (text, fontIndex, options) {
	options = options == null ? {} : options;
	var metric = honeycomb.warnings.fontMetric(fontIndex);
	if (metric == null) throw new Error("no font metrics for \"" + fontIndex + "\"; run generate-font-metrics.js");
	var source = options.uppercase == true ? String(text).toUpperCase() : String(text);
	var width = 0;
	for (var characterIndex = 0; characterIndex < source.length; characterIndex++) {
		width += honeycomb.warnings.characterWidthEm(metric, source.charAt(characterIndex), options);
	}
	return width;
};

//Card text markup as characters, each marked bold when a keyword or changed-number span holds it (both
//are font-weight 700 in the stylesheet). Other tags are dropped and entities decoded.
honeycomb.warnings.markupCharacterArray = function (markup) {
	var characterArray = [];
	var boldDepth = 0;
	var depthStack = [];
	var entityArray = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": "\"", "&#39;": "'", "&nbsp;": " " };
	var pattern = /<\/?span[^>]*>|<[^>]+>|&[a-z#0-9]+;|[\s\S]/g;
	var match;
	while ((match = pattern.exec(String(markup))) != null) {
		var token = match[0];
		if (token.indexOf("</span") === 0) {
			if (depthStack.pop() == true) boldDepth--;
		} else if (token.indexOf("<span") === 0) {
			var bold = /class="[^"]*\b(hcKeyword|hcAmount)\b/.test(token);
			depthStack.push(bold);
			if (bold) boldDepth++;
		} else if (token.charAt(0) === "<" && token.length > 1) {
			if (/^<br\s*\/?>$/i.test(token)) characterArray.push({ character: "\n", bold: false });
		} else {
			var character = entityArray[token] != null ? entityArray[token] : token;
			characterArray.push({ character: character, bold: boldDepth > 0 });
		}
	}
	return characterArray;
};

//Greedy word wrap at spaces, as a browser sets `white-space: normal` text: { lineCount, widestLineEm,
//widestWordEm }. A trailing space never counts toward a line.
honeycomb.warnings.wrapCharacterArray = function (characterArray, fontIndex, maximumWidthEm, options) {
	options = options == null ? {} : options;
	var metric = honeycomb.warnings.fontMetric(fontIndex);
	if (metric == null) throw new Error("no font metrics for \"" + fontIndex + "\"; run generate-font-metrics.js");
	var wordArray = [];
	var word = { widthEm: 0, empty: true, breakBefore: false };
	var spaceEm = honeycomb.warnings.characterWidthEm(metric, " ", options);
	for (var characterIndex = 0; characterIndex < characterArray.length; characterIndex++) {
		var entry = characterArray[characterIndex];
		if (entry.character === " " || entry.character === "\n") {
			if (!word.empty) wordArray.push(word);
			word = { widthEm: 0, empty: true, breakBefore: entry.character === "\n" };
			continue;
		}
		word.widthEm += honeycomb.warnings.characterWidthEm(metric, entry.character,
			{ letterSpacingEm: options.letterSpacingEm, bold: entry.bold });
		word.empty = false;
	}
	if (!word.empty) wordArray.push(word);
	var reading = { lineCount: wordArray.length === 0 ? 0 : 1, widestLineEm: 0, widestWordEm: 0 };
	var lineEm = 0;
	for (var wordIndex = 0; wordIndex < wordArray.length; wordIndex++) {
		var current = wordArray[wordIndex];
		reading.widestWordEm = Math.max(reading.widestWordEm, current.widthEm);
		if (wordIndex === 0) {
			lineEm = current.widthEm;
		} else if (current.breakBefore || lineEm + spaceEm + current.widthEm > maximumWidthEm) {
			reading.lineCount++;
			reading.widestLineEm = Math.max(reading.widestLineEm, lineEm);
			lineEm = current.widthEm;
		} else {
			lineEm += spaceEm + current.widthEm;
		}
	}
	reading.widestLineEm = Math.max(reading.widestLineEm, lineEm);
	return reading;
};

//A part's box for a size, with its `bySize` fields laid over it.
honeycomb.warnings.cardFitPart = function (partIndex, sizeIndex) {
	var part = honeycomb.findDefinition(honeycomb.tuning.warnings.cardFit.partArray, partIndex);
	if (part == null) return null;
	var result = {};
	for (var key in part) if (Object.prototype.hasOwnProperty.call(part, key) && key !== "bySize") result[key] = part[key];
	var override = part.bySize == null ? null : part.bySize[sizeIndex];
	if (override != null) for (var overrideKey in override) if (Object.prototype.hasOwnProperty.call(override, overrideKey)) result[overrideKey] = override[overrideKey];
	return result;
};

//Every printed part of one resolved card at every size that prints it: [{ size, part, fill, detail }].
//The fitted scale is honeycomb.cardLineFit's, from the same settings the card face uses.
honeycomb.warnings.cardFitReadingArray = function (resolved) {
	var fitTuning = honeycomb.tuning.warnings.cardFit;
	var cardSize = honeycomb.tuning.art.cardSize;
	var cardFrame = honeycomb.tuning.art.cardFrame;
	var widthUnits = cardSize.designWidthUnits;
	var heightUnits = widthUnits / cardFrame.aspect;
	var layoutIndex = resolved.layout == null ? cardFrame.defaultLayout : resolved.layout;
	var readingArray = [];
	for (var sizeIndex = 0; sizeIndex < cardSize.sizeArray.length; sizeIndex++) {
		var size = cardSize.sizeArray[sizeIndex];
		var partArray = size.partArrayByLayout != null && size.partArrayByLayout[layoutIndex] != null
			? size.partArrayByLayout[layoutIndex] : size.partArray;

		if (partArray.indexOf("name") >= 0) {
			var name = honeycomb.warnings.cardFitPart("name", size.index);
			var nameText = String(resolved.name == null ? "" : resolved.name);
			var nameFit = honeycomb.cardLineFit(nameText.length, size.nameFit);
			var nameEmUnits = name.fontSizeUnits * nameFit.scale * size.nameFit.scale;
			var bandWidthEm = widthUnits * (100 - name.leftPercent - name.rightPercent) / 100 / nameEmUnits;
			var bandHeightEm = heightUnits * name.heightPercent / 100 / nameEmUnits;
			var nameReading = nameFit.wrap
				? honeycomb.warnings.wrapCharacterArray(nameText.split("").map(function (character) { return { character: character, bold: false }; }),
					name.font, bandWidthEm, { letterSpacingEm: name.letterSpacingEm })
				: { lineCount: 1, widestLineEm: honeycomb.warnings.textWidthEm(nameText, name.font, { letterSpacingEm: name.letterSpacingEm }) };
			var nameHeightEm = nameReading.lineCount * (nameFit.wrap ? name.wrapLineHeight : name.lineHeight);
			readingArray.push({ size: size.index, part: "name",
				fill: Math.max(nameReading.widestLineEm / bandWidthEm, nameHeightEm / bandHeightEm),
				detail: nameReading.lineCount + " line" + (nameReading.lineCount === 1 ? "" : "s") + ", width " +
					(nameReading.widestLineEm / bandWidthEm).toFixed(3) + ", height " + (nameHeightEm / bandHeightEm).toFixed(3) });
		}

		var typeArray = honeycomb.cardTypeDefinitionArray(resolved);
		if (partArray.indexOf("supertypes") >= 0 && typeArray.length > 0) {
			var row = honeycomb.warnings.cardFitPart("supertypes", size.index);
			var characterCount = 0;
			for (var countIndex = 0; countIndex < typeArray.length; countIndex++) {
				characterCount += String(typeArray[countIndex].name).length + cardFrame.supertypeFit.iconCharacterCount;
			}
			var rowEmUnits = row.fontSizeUnits * honeycomb.cardLineFit(characterCount, cardFrame.supertypeFit).scale;
			var rowWidthEm = widthUnits * (100 - row.leftPercent - row.rightPercent) / 100 / rowEmUnits;
			var usedEm = row.columnGapEm * (typeArray.length - 1);
			for (var typeIndex = 0; typeIndex < typeArray.length; typeIndex++) {
				usedEm += row.iconWidthEm + row.iconGapEm +
					honeycomb.warnings.textWidthEm(typeArray[typeIndex].name, row.font, { letterSpacingEm: row.letterSpacingEm, uppercase: row.uppercase });
			}
			readingArray.push({ size: size.index, part: "supertypes", fill: usedEm / rowWidthEm,
				detail: typeArray.length + " type" + (typeArray.length === 1 ? "" : "s") });
		}

		if (partArray.indexOf("supertypeIcons") >= 0 && typeArray.length > 0) {
			var icons = honeycomb.warnings.cardFitPart("supertypeIcons", size.index);
			var iconsWidthUnits = typeArray.length * icons.iconWidthUnits + (typeArray.length - 1) * icons.iconGapUnits;
			readingArray.push({ size: size.index, part: "supertypeIcons",
				fill: iconsWidthUnits / (widthUnits * (100 - icons.leftPercent - icons.rightPercent) / 100),
				detail: typeArray.length + " icon" + (typeArray.length === 1 ? "" : "s") });
		}

		if (partArray.indexOf("text") >= 0) {
			var box = honeycomb.warnings.cardFitPart("text", size.index);
			var plainText = String(honeycomb.cardText(resolved));
			var textEmUnits = box.fontSizeUnits * honeycomb.cardLineFit(plainText.length, cardFrame.textFit).scale;
			var boxWidthEm = widthUnits * (100 - box.leftPercent - box.rightPercent) / 100 / textEmUnits;
			var boxHeightEm = heightUnits * (100 - box.topPercent - box.bottomPercent) / 100 / textEmUnits;
			var textReading = honeycomb.warnings.wrapCharacterArray(
				honeycomb.warnings.markupCharacterArray(honeycomb.cardTextMarkup(resolved)), box.font, boxWidthEm, {});
			var heightFill = textReading.lineCount * box.lineHeight / boxHeightEm;
			var wordFill = textReading.widestWordEm / boxWidthEm;
			readingArray.push({ size: size.index, part: "text", fill: Math.max(heightFill, wordFill),
				detail: textReading.lineCount + " line" + (textReading.lineCount === 1 ? "" : "s") + ", height " +
					heightFill.toFixed(3) + ", longest word " + wordFill.toFixed(3) });
		}
	}
	return readingArray;
};

//The fill a part may reach at a size: its known working reference card's, or the box itself.
honeycomb.warnings.cardFitBudget = function (partIndex, sizeIndex) {
	var referenceArray = honeycomb.tuning.warnings.cardFit.referenceArray;
	for (var referenceIndex = 0; referenceIndex < referenceArray.length; referenceIndex++) {
		var reference = referenceArray[referenceIndex];
		if (reference.part != partIndex || reference.size != sizeIndex) continue;
		var resolved = honeycomb.resolveCard({ cardIndex: reference.card, upgradeLevel: reference.upgradeLevel, upgradePath: reference.upgradePath });
		var reading = honeycomb.warnings.cardFitReadingArray(resolved).filter(function (entry) {
			return entry.part == partIndex && entry.size == sizeIndex;
		})[0];
		if (reading == null) throw new Error("reference \"" + reference.card + "\" prints no " + partIndex + " at " + sizeIndex);
		return { fill: Math.max(1, reading.fill), source: "reference \"" + reference.card + "\"" };
	}
	return { fill: 1, source: "the box itself" };
};

//Whether tuning says to let this warning stand.
honeycomb.warnings.isIgnored = function (ruleIndex, entryIndex, settings) {	var ignoredArray = settings.ignoredArray == null ? [] : settings.ignoredArray;
	for (var scanIndex = 0; scanIndex < ignoredArray.length; scanIndex++) {
		var ignored = ignoredArray[scanIndex];
		if (ignored.rule != ruleIndex) continue;
		if (ignored.entry == null || ignored.entry == entryIndex) return true;
	}
	return false;
};

//THE REPORT, as data: { subjectArray: [{index, name, count}], warningArray: [{rule, ruleName, subject,
//entry, message, ignored}], activeCount, ignoredCount }. The content is read with no profile or run in
//place, so nothing a save holds (a fight in progress swapping cards for broken ones) colours it; the
//state is put back afterwards whatever happens.
honeycomb.warnings.report = function () {
	var settings = honeycomb.tuning.warnings;
	var report = { subjectArray: [], warningArray: [], activeCount: 0, ignoredCount: 0 };
	var stateWas = honeycomb.state;
	honeycomb.state = null;
	try {
		for (var subjectIndex = 0; subjectIndex < honeycomb.warningSubjectArray.length; subjectIndex++) {
			var subject = honeycomb.warningSubjectArray[subjectIndex];
			var entryArray = subject.entryArray();
			report.subjectArray.push({ index: subject.index, name: subject.name, count: entryArray == null ? 0 : entryArray.length });
			if (entryArray == null) continue;
			for (var ruleIndex = 0; ruleIndex < honeycomb.warningRuleArray.length; ruleIndex++) {
				var rule = honeycomb.warningRuleArray[ruleIndex];
				if (rule.subject != subject.index) continue;
				for (var entryIndex = 0; entryIndex < entryArray.length; entryIndex++) {
					var entry = entryArray[entryIndex];
					var messageArray;
					//A rule that throws is itself reported, rather than stopping every rule after it.
					try {
						messageArray = rule.check(entry, settings);
					} catch (error) {
						messageArray = ["the rule failed to run: " + (error && error.message ? error.message : error)];
					}
					for (var messageIndex = 0; messageIndex < messageArray.length; messageIndex++) {
						var ignored = honeycomb.warnings.isIgnored(rule.index, entry.index, settings);
						report.warningArray.push({
							rule: rule.index,
							ruleName: rule.name,
							subject: subject.index,
							entry: entry.index,
							message: messageArray[messageIndex],
							ignored: ignored,
						});
						if (ignored) report.ignoredCount++;
						else report.activeCount++;
					}
				}
			}
		}
	} finally {
		honeycomb.state = stateWas;
	}
	return report;
};

//Writes a report to the console: one warn line per active warning, grouped by rule; ignored ones in a
//collapsed group of their own. Returns the report.
honeycomb.warnings.print = function (report) {
	if (report == null) report = honeycomb.warnings.report();
	if (typeof console === "undefined") return report;
	var settings = honeycomb.tuning.warnings;
	var countText = report.subjectArray.map(function (subject) { return subject.name + " " + subject.count; }).join(", ");
	var heading = "[Honeycomb] Content warnings: " + report.activeCount + " active, " + report.ignoredCount +
		" ignored (" + countText + ")";
	if (report.activeCount === 0 && report.ignoredCount === 0) {
		if (settings.printCleanReport == true) console.info(heading);
		return report;
	}
	var group = typeof console.group === "function" ? console.group : console.log;
	var collapsed = typeof console.groupCollapsed === "function" ? console.groupCollapsed : group;
	var groupEnd = typeof console.groupEnd === "function" ? console.groupEnd : function () {};
	(report.activeCount > 0 ? group : collapsed).call(console, heading);
	for (var ruleIndex = 0; ruleIndex < honeycomb.warningRuleArray.length; ruleIndex++) {
		var rule = honeycomb.warningRuleArray[ruleIndex];
		var activeArray = report.warningArray.filter(function (warning) { return warning.rule == rule.index && !warning.ignored; });
		if (activeArray.length === 0) continue;
		group.call(console, rule.name + " [" + rule.index + "]: " + activeArray.length);
		for (var activeIndex = 0; activeIndex < activeArray.length; activeIndex++) console.warn(activeArray[activeIndex].message);
		groupEnd.call(console);
	}
	var ignoredArray = report.warningArray.filter(function (warning) { return warning.ignored; });
	if (ignoredArray.length > 0) {
		collapsed.call(console, "Ignored by tuning.warnings.ignoredArray: " + ignoredArray.length);
		for (var ignoredIndex = 0; ignoredIndex < ignoredArray.length; ignoredIndex++) {
			console.log("[" + ignoredArray[ignoredIndex].rule + "] " + ignoredArray[ignoredIndex].message);
		}
		groupEnd.call(console);
	}
	groupEnd.call(console);
	return report;
};

//The boot's call: prints once per page load, however many times the game is entered.
honeycomb.warnings.runOnce = function () {
	if (honeycomb.warnings.hasRun == true || honeycomb.tuning.warnings.runOnBoot != true) return null;
	honeycomb.warnings.hasRun = true;
	try {
		return honeycomb.warnings.print();
	} catch (error) {
		if (typeof console !== "undefined") console.error("[Honeycomb] The content warning report failed:", error);
		return null;
	}
};
