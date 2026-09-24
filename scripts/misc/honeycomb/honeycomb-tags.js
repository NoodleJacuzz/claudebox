//===================================================================================================
//HONEYCOMB CATACOMBS -- tags
//===================================================================================================
//A tag is a free-form label attached to a piece of content: "undead", "woman", "fire", "weapon".
//Nothing in the engine has an opinion about what tags mean. That is the point -- a tag is how content
//says something about itself that no engine field anticipated, and how other content asks about it.
//
//WHAT MAY CARRY TAGS
//  characters, outfits, equipment      via tagArray, plus tagAdditionArray / tagRemovalArray
//  cards, relics, enemies, statuses    via tagArray
//  events, node types, encounters      via tagArray
//Every content table accepts the field; absent means an empty list.
//
//WHY TAGS ARE PLAIN STRINGS
//A registry of legal tags would be one more table to keep in step with the content, and the first
//thing an author wants from a tag system is to invent a tag. honeycomb.tagArray below is therefore
//OPTIONAL METADATA -- a display name, a category and a colour for tags that want to be shown nicely.
//An unregistered tag still works everywhere; it simply prints as itself.
//
//A CHARACTER'S TAGS ARE COMPUTED, NOT STORED
//Outfits, equipment and progression may add and remove tags, so a member's tag list is resolved the
//same way their card pool is: rebuilt from the character definition with each modifier laid over it,
//through honeycomb.memberCardModifierArray. Storing the result would let it drift the moment a
//costume changed.
window.honeycomb = window.honeycomb || {};

//---------------------------------------------------------------------------------------------------
//Tag metadata
//---------------------------------------------------------------------------------------------------
//Optional. `category` groups tags for display; `color` tints the chip. Unlisted tags print as their
//own index, title-cased, with the default colour.
//
//A tag with a `glyph` is shown as an ICON (honeycomb.ui.glyphArray), and hovering it opens a panel: the
//tag's name as the title, a divider, then `description`. A tag without one still prints as a chip.
honeycomb.tagArray = [
	//Species and kind.
	{ index: "human", name: "Human", category: "species", color: "#d8c39b", glyph: "person",
		description: "An ordinary mortal, as far as the catacombs are concerned." },
	{ index: "undead", name: "Undead", category: "species", color: "#8fbf7a", glyph: "skull",
		description: "Neither alive nor properly dead. Some cards and events treat the undead differently." },
	{ index: "beast", name: "Beast", category: "species", color: "#c98a4b", glyph: "paw",
		description: "More animal than person." },
	{ index: "construct", name: "Construct", category: "species", color: "#9aa7b8", glyph: "shard",
		description: "Built rather than born." },
	{ index: "plant", name: "Plant", category: "species", color: "#7fbf6a", glyph: "leaf",
		description: "Fungal or vegetable, grown rather than born." },
	{ index: "kobold", name: "Kobold", category: "species", color: "#c9a04b", glyph: "paw",
		description: "A small scavenger from the front. Clever hands, poor judgment." },
	//An ORIGIN rather than a species, so it sits beside `human` instead of replacing it. She is the only
	//carrier today. A tag is what a condition can ask about, so it costs nothing until something asks.
	{ index: "earthling", name: "Earthling", category: "origin", color: "#7fb8c9", glyph: "star",
		description: "From Earth." },

	//Gender, as a tag rather than a field, so content can be written for it and a costume can
	//change it without the engine having a schema for gender at all.
	{ index: "woman", name: "Woman", category: "gender", color: "#e0a3c0", glyph: "venus",
		description: "Counts as a woman for anything that asks." },
	{ index: "man", name: "Man", category: "gender", color: "#8fb6e0", glyph: "mars",
		description: "Counts as a man for anything that asks." },
	{ index: "nonbinary", name: "Nonbinary", category: "gender", color: "#c9a3e0", glyph: "star",
		description: "Counts as nonbinary for anything that asks." },

	//Role, for teambuilding conditions that care about what a member does rather than what they are.
	{ index: "defender", name: "Defender", category: "role", color: "#7fa9d6", glyph: "shield",
		description: "Stands in front and keeps the party standing." },
	{ index: "striker", name: "Striker", category: "role", color: "#e0705a", glyph: "sword",
		description: "Deals damage quickly and directly." },
	{ index: "attrition", name: "Attrition", category: "role", color: "#7fbf6a", glyph: "flask",
		description: "Wins slowly: poison, weakness and fights that drag on." },

	//Card and effect flavour.
	{ index: "weapon", name: "Weapon", category: "flavour", color: "#d0b083" },
	{ index: "spell", name: "Spell", category: "flavour", color: "#a98ad6" },
	{ index: "blood", name: "Blood", category: "flavour", color: "#c2544f" },
	{ index: "poison", name: "Poison", category: "flavour", color: "#7fbf6a" },
	{ index: "ward", name: "Ward", category: "flavour", color: "#ffcf5c" },
	{ index: "composure", name: "Composure", category: "flavour", color: "#7ec8f0" },
	{ index: "ritual", name: "Ritual", category: "flavour", color: "#b98ad6" },
	{ index: "support", name: "Support", category: "flavour", color: "#e0c98a" },
	{ index: "curse", name: "Curse", category: "flavour", color: "#8f7fa0" },

	//Enemy kinds, so an encounter or a card can speak about a whole family at once.
	{ index: "swarm", name: "Swarm", category: "kind", color: "#c98a4b" },
	{ index: "elite", name: "Elite", category: "kind", color: "#e0b45a" },
	{ index: "boss", name: "Boss", category: "kind", color: "#e0705a" },
	{ index: "summoner", name: "Summoner", category: "kind", color: "#a98ad6" },
];

honeycomb.tagName = function (tagIndex) {
	var definition = honeycomb.findDefinition(honeycomb.tagArray, tagIndex);
	if (definition != null) return definition.name;
	//An unregistered tag is still shown, capitalised, rather than hidden or reported as an error.
	if (tagIndex == null || tagIndex.length === 0) return "";
	return tagIndex.charAt(0).toUpperCase() + tagIndex.slice(1);
};

honeycomb.tagColor = function (tagIndex) {
	var definition = honeycomb.findDefinition(honeycomb.tagArray, tagIndex);
	return definition == null ? honeycomb.tuning.tags.defaultColor : definition.color;
};

honeycomb.tagCategory = function (tagIndex) {
	var definition = honeycomb.findDefinition(honeycomb.tagArray, tagIndex);
	return definition == null ? honeycomb.tuning.tags.defaultCategory : definition.category;
};

//---------------------------------------------------------------------------------------------------
//Reading tags off content
//---------------------------------------------------------------------------------------------------
//Any definition object. Handles the absent field so callers never have to.
honeycomb.definitionTagArray = function (definition) {
	if (definition == null || definition.tagArray == null) return [];
	return definition.tagArray;
};

honeycomb.definitionHasTag = function (definition, tagIndex) {
	return honeycomb.definitionTagArray(definition).indexOf(tagIndex) >= 0;
};

//A card's tags: whatever the resolved view carries, which means an upgrade may add or replace them.
//CARD TAGS ARE THEIR OWN VOCABULARY -- a card's school, printed on the card -- registered in
//honeycomb.cardTagArray (content-cards.js), not in the character-tag table above.
honeycomb.cardTags = function (resolved) {
	return honeycomb.definitionTagArray(resolved);
};

//---------------------------------------------------------------------------------------------------
//Character tags
//---------------------------------------------------------------------------------------------------
//The tags a member actually has, after outfits and equipment. selection is
//{characterIndex, outfitIndex, equipmentArray}; a live party member satisfies it.
//
//Resolution mirrors the card pool exactly, and deliberately shares its modifier list: anything that
//may alter which cards a character contributes may also alter what they ARE.
honeycomb.memberTagArray = function (selection) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray,
		selection == null ? null : selection.characterIndex);
	if (definition == null) return [];

	var result = honeycomb.definitionTagArray(definition).slice();
	var modifierArray = honeycomb.memberCardModifierArray(selection);
	for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
		result = honeycomb.applyTagModifier(result, modifierArray[modifierIndex].modifier);
	}
	return result;
};

//Removals resolve before additions, so a modifier that swaps one tag for another can name both
//without the order of the two arrays mattering.
honeycomb.applyTagModifier = function (tagArray, modifier) {
	if (modifier == null) return tagArray.slice();
	var result = [];

	for (var scanIndex = 0; scanIndex < tagArray.length; scanIndex++) {
		if (modifier.tagRemovalArray != null && modifier.tagRemovalArray.indexOf(tagArray[scanIndex]) >= 0) continue;
		result.push(tagArray[scanIndex]);
	}

	if (modifier.tagAdditionArray != null) {
		for (var addIndex = 0; addIndex < modifier.tagAdditionArray.length; addIndex++) {
			//A tag is a set membership, not a count: adding one twice changes nothing.
			if (result.indexOf(modifier.tagAdditionArray[addIndex]) >= 0) continue;
			result.push(modifier.tagAdditionArray[addIndex]);
		}
	}

	return result;
};

honeycomb.memberHasTag = function (selection, tagIndex) {
	return honeycomb.memberTagArray(selection).indexOf(tagIndex) >= 0;
};

//---------------------------------------------------------------------------------------------------
//Entity tags
//---------------------------------------------------------------------------------------------------
//An entity in a fight is either a character or an enemy, and the two find their tags in different
//places -- whichever TEAM it stands on. This is the one function combat-side content should call.
honeycomb.entityTagArray = function (entity) {
	if (entity == null) return [];
	if (entity.enemyIndex != null) {
		var enemyDefinition = honeycomb.findDefinition(honeycomb.enemyArray, entity.enemyIndex);
		var enemyArray = honeycomb.definitionTagArray(enemyDefinition).slice();
		//Enemies summoned or transformed mid-fight may carry extra tags on the instance.
		if (entity.tagArray != null) {
			for (var extraIndex = 0; extraIndex < entity.tagArray.length; extraIndex++) {
				if (enemyArray.indexOf(entity.tagArray[extraIndex]) >= 0) continue;
				enemyArray.push(entity.tagArray[extraIndex]);
			}
		}
		return enemyArray;
	}
	return honeycomb.memberTagArray(entity);
};

honeycomb.entityHasTag = function (entity, tagIndex) {
	return honeycomb.entityTagArray(entity).indexOf(tagIndex) >= 0;
};

//---------------------------------------------------------------------------------------------------
//Party queries
//---------------------------------------------------------------------------------------------------
//How many members of the current party carry a tag. The teambuilding read: "two undead" is a build.
honeycomb.partyTagCount = function (tagIndex, options) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null) return 0;
	var settings = options == null ? {} : options;
	var count = 0;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var member = run.partyArray[memberIndex];
		if (settings.livingOnly == true && member.downed == true) continue;
		if (honeycomb.memberHasTag(member, tagIndex) == true) count += 1;
	}
	return count;
};

//Every tag present in the party, each with how many members carry it. Sorted by count so the
//dominant theme of a team reads first.
honeycomb.partyTagSummaryArray = function (selectionArray) {
	var sourceArray = selectionArray;
	if (sourceArray == null) {
		var run = honeycomb.state == null ? null : honeycomb.state.run;
		sourceArray = run == null ? [] : run.partyArray;
	}

	var result = [];
	for (var memberIndex = 0; memberIndex < sourceArray.length; memberIndex++) {
		var tagArray = honeycomb.memberTagArray(sourceArray[memberIndex]);
		for (var tagIndex = 0; tagIndex < tagArray.length; tagIndex++) {
			var existing = null;
			for (var scanIndex = 0; scanIndex < result.length; scanIndex++) {
				if (result[scanIndex].index == tagArray[tagIndex]) { existing = result[scanIndex]; break; }
			}
			if (existing == null) result.push({ index: tagArray[tagIndex], count: 1 });
			else existing.count += 1;
		}
	}

	result.sort(function (left, right) {
		if (left.count != right.count) return right.count - left.count;
		return left.index < right.index ? -1 : (left.index > right.index ? 1 : 0);
	});
	return result;
};

//---------------------------------------------------------------------------------------------------
//Registering the conditions and values that read tags
//---------------------------------------------------------------------------------------------------
//Appended to the shared registries rather than defined there, so the whole tag system is one file
//that could be deleted without leaving holes in honeycomb-effects.js.
honeycomb.conditionArray.push(
	{
		index: "hasTag",
		//`of` picks a single subject: "source", "target", "card", or "owner".
		//`over` picks a target mode instead ("frontAlly", "allAllies", ...) and passes when ANY entity
		//it resolves carries the tag. This covers "is a Pawn at the front", which no other
		//condition could ask: partyContains matches a characterIndex, and the value subjects only
		//understand source/target/card.
		test: function (condition, context) {
			if (condition.over != null) {
				var scopeArray = honeycomb.resolveTargetMode(condition.over, context);
				if (scopeArray == null) return false;
				for (var scanIndex = 0; scanIndex < scopeArray.length; scanIndex++) {
					if (scopeArray[scanIndex] == null) continue;
					if (honeycomb.entityHasTag(scopeArray[scanIndex], condition.tag) == true) return true;
				}
				return false;
			}
			var subject = honeycomb.resolveTagSubject(condition.of, context);
			if (subject == null) return false;
			//A card is not an entity, so it reads its own tag list rather than an entity's.
			if (condition.of == "card") return honeycomb.definitionHasTag(subject, condition.tag);
			return honeycomb.entityHasTag(subject, condition.tag);
		},
		describe: function (condition) {
			if (condition.over != null) return "a " + honeycomb.tagName(condition.tag) + " is there";
			return "the " + (condition.of || "source") + " is " + honeycomb.tagName(condition.tag);
		},
	},
	{
		index: "partyHasTag",
		//How many members must carry it; defaults to one.
		test: function (condition) {
			var minimum = condition.minimumCount == null ? 1 : condition.minimumCount;
			return honeycomb.partyTagCount(condition.tag, { livingOnly: condition.livingOnly == true }) >= minimum;
		},
		describe: function (condition) {
			var minimum = condition.minimumCount == null ? 1 : condition.minimumCount;
			return "the party contains " + minimum + " " + honeycomb.tagName(condition.tag);
		},
	}
);

honeycomb.valueArray.push(
	{
		index: "partyTagCount",
		resolve: function (value) {
			return honeycomb.partyTagCount(value.tag, { livingOnly: value.livingOnly == true });
		},
		describe: function (value) { return "the number of " + honeycomb.tagName(value.tag) + " in the party"; },
	},
	{
		//TAGS ON THE BODIES IN THE FIGHT, not on the party roster. partyTagCount above walks
		//run.partyArray through memberHasTag, which resolves tags through a CHARACTER's definition -- so a
		//golem, which is an enemy-table entity standing with the party, counted as nothing. This one asks
		//honeycomb.entityHasTag, which knows both kinds.
		//  tag           the tag to count
		//  excludeSelf   leaves the card's user out, for "each OTHER ally"
		index: "partyEntityTagCount",
		resolve: function (value, context) {
			var combat = context == null ? null : context.combat;
			var livingArray = honeycomb.livingEntityArray("ally", combat);
			var source = context == null ? null : context.source;
			var count = 0;
			for (var scanIndex = 0; scanIndex < livingArray.length; scanIndex++) {
				var entity = livingArray[scanIndex];
				if (value.excludeSelf == true && source != null && entity.instanceId == source.instanceId) continue;
				if (honeycomb.entityHasTag(entity, value.tag) == true) count += 1;
			}
			return count;
		},
		describe: function (value) { return "the number of " + honeycomb.tagName(value.tag) + " standing with you"; },
		describePer: function (value) { return honeycomb.tagName(value.tag) + " standing with you"; },
	},
	{
		index: "tagCountOn",
		//How many of a named tag list the subject carries. Lets a card scale off breadth rather than
		//off one specific tag.
		resolve: function (value, context) {
			var subject = honeycomb.resolveTagSubject(value.of, context);
			if (subject == null) return 0;
			var ownedArray = value.of == "card"
				? honeycomb.definitionTagArray(subject)
				: honeycomb.entityTagArray(subject);
			var count = 0;
			for (var scanIndex = 0; scanIndex < value.tagArray.length; scanIndex++) {
				if (ownedArray.indexOf(value.tagArray[scanIndex]) >= 0) count += 1;
			}
			return count;
		},
		describe: function (value) { return "matching tags on the " + (value.of || "source"); },
	}
);

//Same subject vocabulary the other value descriptors use, plus "owner" -- which a tag question wants
//far more often than a raw stat does.
honeycomb.resolveTagSubject = function (subjectIndex, context) {
	if (subjectIndex == "owner") {
		return honeycomb.cardActingEntity(context.card, context.combat);
	}
	return honeycomb.resolveValueSubject(subjectIndex, context);
};

//---------------------------------------------------------------------------------------------------
//Presentation
//---------------------------------------------------------------------------------------------------
//A row of tags. A tag registered with a `glyph` is an ICON whose hover panel names and explains it
//(tooltip kind "tag"); anything else is a plain chip carrying its own name. HC-PLACEHOLDER: the icons
//are generated glyphs until drawn ones exist; `iconPath` on a tag is preferred when it resolves.
honeycomb.ui = honeycomb.ui || {};
honeycomb.ui.tagRow = function (tagIndexArray, options) {
	if (tagIndexArray == null || tagIndexArray.length === 0) return "";
	var settings = options == null ? {} : options;
	var limit = settings.limit == null ? honeycomb.tuning.tags.chipsShownMaximum : settings.limit;

	var markup = '<div class="hcTagRow' + (settings.className ? " " + settings.className : "") + '">';
	for (var scanIndex = 0; scanIndex < tagIndexArray.length && scanIndex < limit; scanIndex++) {
		var tagIndex = tagIndexArray[scanIndex];
		var definition = honeycomb.findDefinition(honeycomb.tagArray, tagIndex);
		if (definition != null && definition.glyph != null) {
			markup += '<span class="hcTagIcon" style="--hcTagColor:' + honeycomb.tagColor(tagIndex) + '"' +
				honeycomb.tooltip.attributes("tag", tagIndex) + ">" +
				honeycomb.ui.iconTag(definition.iconPath == null ? null : definition.iconPath,
					definition.glyph, honeycomb.tagColor(tagIndex), {}) +
				"</span>";
			continue;
		}
		markup += '<span class="hcTagChip" style="border-color:' + honeycomb.tagColor(tagIndex) +
			";color:" + honeycomb.tagColor(tagIndex) + '"' + honeycomb.tooltip.attributes("tag", tagIndex) + ">" +
			honeycomb.escapeText(honeycomb.tagName(tagIndex)) + "</span>";
	}
	if (tagIndexArray.length > limit) {
		markup += '<span class="hcTagChip hcTagMore">+' + (tagIndexArray.length - limit) + "</span>";
	}
	markup += "</div>";
	return markup;
};
