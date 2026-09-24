//===================================================================================================
//HONEYCOMB CATACOMBS -- card content
//===================================================================================================
//Every card in the game. A card is a name, a cost, a target mode and a list of effects; the engine
//knows nothing else about it, so a new card is one entry here and needs no engine change.
//
//Fields:
//  index            unique id
//  name             printed name
//  characterIndex   whose pool it belongs to, or "neutral" for cards found on the map
//  type             ONLY for a type effects cannot reveal: "passive" | "curse". Damage,
//                   Negative, Lewd and Support are DERIVED from the effects -- see
//                   honeycomb.cardTypeRuleArray -- so a card never states them.
//  typeArray        optional: the card's SUPERTYPES outright, primary first, overriding the derivation.
//                   The manual override: `typeArray: ["lewd"]` makes a damage-dealing
//                   card Lewd alone; `["lewd", "damage"]` makes it both, Lewd first.
//  rarity           "starter" | "common" | "rare" | "special" (collapsed Uncommon into Common)
//  tagArray         the card's CARD TAGS -- its school, printed on the card (see honeycomb.cardTagArray
//                   below). Content asks through the hasTag condition with `of: "card"`. Not the same
//                   vocabulary as character tags.
//  ownerDownPolicy  what this card does when the character who contributed it is out of the fight.
//                   Omitted means the owning character's policy, then tuning's default.
//                   See honeycomb.ownerDownPolicyArray.
//  costArray        {energy: n}. Any resource may be charged; energy is simply the usual one.
//                   A cost of null means the card cannot be played by hand at all.
//  targetMode       see honeycomb.targetModeArray. Either a bare index -- "enemy" -- or a
//                   descriptor carrying parameters -- {index: "randomEnemy", count: 3}. A mode whose
//                   KIND is "card" targets another CARD and can never land on a character.
//  layout           "horizontal" or "vertical" -- which frame the card is printed in
//  artPath          art drawn behind the frame, resolved through honeycomb.image
//  artOwed          true while that art is not drawn yet: the card draws its named placeholder and is never
//                   requested, and the art tests count it as planned rather than missing
//  effectArray      what it does
//  text             optional hand-written rules text. Omit it and the text is generated from the
//                   effects, which is preferable: generated text can never disagree with the rules.
//  exhausts         removed from the fight after being played
//  ethereal         discarded at end of turn if still held
//  innate           always in the opening hand
//  retain           not discarded at end of turn
//  playableCondition  optional gate on whether it may be played at all right now
//  upgradeArray     one entry per upgrade level, each overriding any field above
//
//Optional overrides of the card TYPE's defaults (see honeycomb.cardTypeArray). Omit them and the type
//decides, which is what keeps a new card a short entry:
//  pose             the pose the owner strikes when it is played
//  animationArray   named animations played as it lands, [{animation, color, strength}]
//  partyShift       where the owner moves in the party order: a honeycomb.partyShiftArray entry
//  afterPlay        where it goes once played: "discard" or "inPlay"
//  keywordArray     extra keywords to explain beside the card, on top of those its effects imply
//
//Optional reward rules (see honeycomb.combat.rollCardReward):
//  offerCondition   a condition that must pass for the card to be offered at all. Evaluated with the
//                   party member the offer is FOR as `source`, so an outfit or tag can gate it.
//  offerWeightArray [{condition, multiplier}] -- each passing entry multiplies the rarity weight, which
//                   is how a costume makes a card more likely without owning it outright
//  offerGuarantee   a condition that, when it passes, puts the card on the reward screen in a slot of
//                   its own rather than leaving it to the roll
//
//Cards deliberately DO NOT carry their own art dimensions. The frame decides the art window; art is
//cropped to fit it. See honeycomb.tuning.art.cardFrame.
window.honeycomb = window.honeycomb || {};

//---------------------------------------------------------------------------------------------------
//Card types
//---------------------------------------------------------------------------------------------------
//What KIND of card a card is. The type is PRINTED on the card face, so content can be written for it
//("whenever a Support card is played") the way tribal effects are, and it supplies the DEFAULTS every
//card of that kind shares. A card overrides any default by naming the same field itself; nothing
//outside this table decides what a Damage card does differently from a Support card.
//
//Four types say what a card DOES, and a card may be several at once -- "Deal 4 damage. Apply 2
//Poison." is Damage and Negative -- printed with a gradient frame across its types. Curse stays beside
//them: it says what a card IS (a bad card someone else put in the deck), not what it does. Curse
//folds in the old Status type.
//
//These are called SUPERTYPES; the fifth is lewd, for lust-building. They print on the bar under the
//art, where the name used to be; the name moved above the art.
//
//A CARD'S TYPES ARE DERIVED FROM ITS EFFECTS (honeycomb.cardTypeRuleArray), the way its text is, so a
//card that weakens an enemy is Negative whatever anyone typed. An enemy's Weak printed as Offense is
//what prompted this. `typeArray` on a card overrides the derivation; `type` names one of the
//`declaredOnly` types (Passive, Curse), which effects cannot reveal.
//
//  name            printed on the card
//  pose            the honeycomb.art.poseArray pose the owner strikes when one is played
//  animationArray  named animations played as it lands; see honeycomb.combatScene.namedAnimationArray
//  partyShift      where the owner moves in the party order. See honeycomb.partyShiftArray.
//  afterPlay       "discard" cycles back through the deck; "inPlay" stays out for the rest of the fight,
//                  which is what makes a Passive card an effect that lasts rather than one that happens
//  glyph, color    the generated type icon until drawn icons exist, the label's ink, and the frame's hue
//  framePathByLayout  optional {vertical, horizontal}: the type's OWN frame art, in place of the shared
//                  frame in tuning.art.cardFrame. A layout it does not name falls back to the shared one.
//  frameFilter     HC-PLACEHOLDER tint on the shared frame art. "none" once a real frame set lands.
//  declaredOnly    a type only a card's own `type` can give it; derivation never produces it, and a card
//                  declaring it is that type alone
//Each type carries `iconPath` (its drawn icon) and `glyph` (the generated
//fallback). A card's PRIMARY type is its first: the one its defaults come from. Derived types come in table order,
//so a card that deals damage is Damage first whatever else it does.
honeycomb.cardTypeArray = [
	{
		index: "damage",
		name: "Damage",
		pose: "offense",
		animationArray: [{ animation: "lunge" }],
		//THE DEFAULT THAT MAKES PARTY ORDER MATTER. Whoever attacks steps up to the front, where most
		//enemy attacks land. A card or a character may say otherwise; see honeycomb.cardPartyShift.
		partyShift: "front",
		afterPlay: "discard",
		iconPath: "icons/type_attack",
		glyph: "sword",
		color: "#e0705a",
		frameFilter: "hue-rotate(-18deg) saturate(1.15)",
	},
	{
		//Harm that is not damage: debuffs on the other team, and anything that attacks their deck.
		index: "negative",
		name: "Negative",
		pose: "passive",
		animationArray: [],
		partyShift: "none",
		afterPlay: "discard",
		iconPath: "icons/type_negative",
		glyph: "skull",
		color: "#b06ad9",
		frameFilter: "hue-rotate(248deg) saturate(0.9)",
	},
	{
		//LUST aimed at the other team. Placed
		//after Negative so a card that both debuffs and builds lust keeps Negative as its primary type;
		//`typeArray` on the card puts Lewd first. Its defaults match Negative's until lust attacks want
		//their own pose, animation or step.
		index: "lewd",
		name: "Lewd",
		pose: "passive",
		animationArray: [],
		partyShift: "none",
		afterPlay: "discard",
		//The icon is a drawn type set (type_lewd, published from _source/cards).
		iconPath: "icons/type_lewd",
		glyph: "heart",
		color: "#ff5fd2",
		framePathByLayout: {
			vertical: "cards/frames/lewdVertical",
			horizontal: "cards/frames/lewdHorizontal",
		},
		frameFilter: "none",
	},
	{
		//Help for the user's own team: Temporary HP, Soothe, healing, buffs, cards and energy.
		index: "support",
		name: "Support",
		pose: "passive",
		animationArray: [],
		partyShift: "none",
		afterPlay: "discard",
		iconPath: "icons/type_support",
		glyph: "spiral",
		color: "#5aa0e0",
		frameFilter: "hue-rotate(178deg) saturate(0.85)",
	},
	{
		//An effect for the rest of the fight. Played once, then stays out of the cycle -- the effect it
		//applied is what keeps working. Aliased from Power; see honeycomb.cardTypeAliasArray.
		index: "passive",
		name: "Passive",
		pose: "passive",
		animationArray: [{ animation: "rise" }],
		partyShift: "none",
		afterPlay: "inPlay",
		iconPath: "icons/type_passive",
		glyph: "star",
		color: "#e0b84a",
		frameFilter: "hue-rotate(20deg) saturate(1.3) brightness(1.08)",
		declaredOnly: true,
	},
	{
		//CURSES: bad cards the PLAYER did not choose, shuffled into the deck by enemies and effects. Nobody
		//owns one, so it belongs to no character and moves nobody. The old Status type is an alias of this
		//one (honeycomb.cardTypeAliasArray).
		index: "curse",
		name: "Curse",
		pose: "passive",
		animationArray: [],
		partyShift: "none",
		afterPlay: "discard",
		iconPath: "icons/book-skull-purple",
		glyph: "skull",
		color: "#8a8a8a",
		frameFilter: "grayscale(0.85) brightness(0.6)",
		declaredOnly: true,
	},
	{
		//RANDOM: the grey frame with a question mark, for a card whose
		//identity is not decided until the run rolls it. Reuses the baked `grey` tint folder
		//(`cards/chrome/tint/random/`) that already backed the Curse frame. `declaredOnly` because no
		//effect derives it.
		index: "random",
		name: "Random",
		pose: "passive",
		animationArray: [],
		partyShift: "none",
		afterPlay: "discard",
		iconPath: "icons/question-mark",
		glyph: "question",
		color: "#b8b8c0",
		frameFilter: "grayscale(1) brightness(1.05)",
		declaredOnly: true,
	},
];

//Older type names, still understood wherever a type is named, so older content, saves and
//notes keep working.
honeycomb.cardTypeAliasArray = [
	{ index: "offense", type: "damage" },
	{ index: "power", type: "passive" },
	//Status cards became Curses.
	{ index: "status", type: "curse" },
];

//WHAT MAKES A CARD WHICH TYPE. Each row names an effect and returns the type it makes, or null, from
//what it lands on RELATIVE TO THE CARD'S USER -- "opponent", "teammate", "self" or "both" -- and which
//team that user is on. Effects not listed make no type; effects holding other effects (repeat, branch,
//choices) are looked inside. A cost is not a type: damage to yourself (Blood Pact) or a debuff on
//yourself makes nothing.
honeycomb.cardTypeRuleArray = [
	{ index: "damage", type: function (entry, relation) { return honeycomb.cardTypeRuleHarms(relation) ? "damage" : null; } },
	{ index: "damageIgnoringTemporary", type: function (entry, relation) { return honeycomb.cardTypeRuleHarms(relation) ? "damage" : null; } },
	{ index: "loseHealth", type: function (entry, relation) { return honeycomb.cardTypeRuleHarms(relation) ? "damage" : null; } },
	{
		index: "applyStatus",
		type: function (entry, relation) {
			var status = honeycomb.findDefinition(honeycomb.statusArray == null ? [] : honeycomb.statusArray, entry.status);
			if (status == null) return null;
			//A status may name the type it makes when aimed at the other team: Sensitive
			//only ever serves lust, so a card applying it is Lewd, not Negative.
			if (status.isDebuff == true) return honeycomb.cardTypeRuleHarms(relation) ? (status.cardType == null ? "negative" : status.cardType) : null;
			return relation == "opponent" ? null : "support";
		},
	},
	{
		//One of several statuses at random (Hedge Witch's Jinx): typed as applyStatus would type the first
		//debuff in the list, else as a plain buff.
		index: "randomStatus",
		type: function (entry, relation) {
			var statusArray = entry.statusArray == null ? [] : entry.statusArray;
			for (var scanIndex = 0; scanIndex < statusArray.length; scanIndex++) {
				var status = honeycomb.findDefinition(honeycomb.statusArray == null ? [] : honeycomb.statusArray, statusArray[scanIndex]);
				if (status == null || status.isDebuff != true) continue;
				return honeycomb.cardTypeRuleHarms(relation) ? (status.cardType == null ? "negative" : status.cardType) : null;
			}
			return relation == "opponent" ? null : "support";
		},
	},
	{ index: "removeStatus", type: function () { return "support"; } },
	{ index: "temporaryHealth", type: function () { return "support"; } },
	//Lust is an attack when it is aimed at the other team and a cost when it is aimed at your own --
	//Severine's Night Court outfit pays for her cards in lust, and that is a drawback, not a card type. As an
	//attack it is Lewd, not Negative.
	{ index: "lust", type: function (entry, relation) { return honeycomb.cardTypeRuleHarms(relation) ? "lewd" : null; } },
	{ index: "soothe", type: function (entry, relation) { return relation == "opponent" ? null : "support"; } },
	{ index: "removeTemporaryHealth", type: function (entry, relation) { return honeycomb.cardTypeRuleHarms(relation) ? "negative" : null; } },
	//Meddling with the other team's intents (Cassadora) is harm that is not damage.
	{ index: "cancelIntent", type: function (entry, relation) { return honeycomb.cardTypeRuleHarms(relation) ? "negative" : null; } },
	{ index: "rerollIntent", type: function (entry, relation) { return honeycomb.cardTypeRuleHarms(relation) ? "negative" : null; } },
	{ index: "stealIntent", type: function (entry, relation) { return honeycomb.cardTypeRuleHarms(relation) ? "negative" : null; } },
	//Directing a teammate's intent (Anastasia) is help; forcing an opponent's is the same harm as above.
	{ index: "setIntent", type: function (entry, relation) { return honeycomb.cardTypeRuleHarms(relation) ? "negative" : "support"; } },
	{ index: "promote", type: function () { return "support"; } },
	{ index: "spreadStatus", type: function (entry, relation) { return honeycomb.cardTypeRuleHarms(relation) ? "negative" : "support"; } },
	{ index: "reverseOrder", type: function () { return "support"; } },
	{ index: "heal", type: function (entry, relation) { return relation == "opponent" ? null : "support"; } },
	{ index: "drawCards", type: function () { return "support"; } },
	{ index: "gainResource", type: function () { return "support"; } },
	{ index: "returnCardToHand", type: function () { return "support"; } },
	{ index: "upgradeTargetCard", type: function () { return "support"; } },
	{ index: "modifyCardCost", type: function () { return "support"; } },
	{ index: "duplicateCard", type: function () { return "support"; } },
	{ index: "summonAlly", type: function () { return "support"; } },
	{ index: "summonEnemy", type: function () { return "support"; } },
	{ index: "summon", type: function () { return "support"; } },
	{
		//The piles are the party's. A card slipped into them by the OTHER team is an attack on the deck;
		//one the party puts there itself is help -- unless it is a curse, which is a drawback, not a type.
		index: "addCardToPile",
		type: function (entry, relation, userSide) {
			if (userSide != "ally") return "negative";
			var added = honeycomb.findDefinition(honeycomb.cardArray, entry.card);
			var addedType = added == null ? null : honeycomb.findDefinition(honeycomb.cardTypeArray, honeycomb.cardTypeAlias(added.type));
			return addedType != null && addedType.declaredOnly == true && addedType.index != "passive" ? null : "support";
		},
	},
];

//Harm counts toward a type only when it lands on the other team.
honeycomb.cardTypeRuleHarms = function (relation) {
	return relation == "opponent" || relation == "both";
};

//A type index with round-04 renames applied.
honeycomb.cardTypeAlias = function (typeIndex) {
	var alias = honeycomb.findDefinition(honeycomb.cardTypeAliasArray, typeIndex);
	return alias == null ? typeIndex : alias.type;
};

//Which team a card is naturally used by: an enemy's move is the enemy team's; anything else the party's.
//Only the rules that depend on the team (a card slipped into the party's piles) read it.
honeycomb.cardNaturalSide = function (card) {
	return card != null && card.enemyIndex != null ? "enemy" : "ally";
};

//THE CARD'S TYPES, primary first: its own `typeArray`, else a declared-only `type`, else what its effects
//do, else Support. Never empty for a real card.
honeycomb.cardTypeIndexArray = function (card) {
	if (card == null) return [];
	if (card.typeArray != null && card.typeArray.length > 0) {
		var explicitArray = [];
		for (var explicitIndex = 0; explicitIndex < card.typeArray.length; explicitIndex++) {
			explicitArray.push(honeycomb.cardTypeAlias(card.typeArray[explicitIndex]));
		}
		return explicitArray;
	}
	var declared = card.type == null ? null : honeycomb.cardTypeAlias(card.type);
	var declaredType = honeycomb.findDefinition(honeycomb.cardTypeArray, declared);
	if (declaredType != null && declaredType.declaredOnly == true) return [declared];
	var derivedArray = honeycomb.deriveCardTypeArray(card);
	if (derivedArray.length > 0) return derivedArray;
	if (declaredType != null) return [declared];
	return ["support"];
};

//The types a card's effects make, in table order. See honeycomb.cardTypeRuleArray.
honeycomb.deriveCardTypeArray = function (card) {
	var foundArray = {};
	var userSide = honeycomb.cardNaturalSide(card);
	function walk(effectArray, targetMode) {
		if (effectArray == null) return;
		for (var entryIndex = 0; entryIndex < effectArray.length; entryIndex++) {
			var entry = effectArray[entryIndex];
			if (entry == null) continue;
			var mode = entry.targetOverride != null ? entry.targetOverride : targetMode;
			var rule = honeycomb.findDefinition(honeycomb.cardTypeRuleArray, entry.index);
			if (rule != null) {
				var typeIndex = rule.type(entry, honeycomb.targetModeRelation == null ? null : honeycomb.targetModeRelation(mode), userSide);
				if (typeIndex != null) foundArray[typeIndex] = true;
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
	var result = [];
	for (var typeIndex = 0; typeIndex < honeycomb.cardTypeArray.length; typeIndex++) {
		var type = honeycomb.cardTypeArray[typeIndex];
		if (foundArray[type.index] == true && type.declaredOnly != true) result.push(type.index);
	}
	return result;
};

//Whether a card is of a type, primary or not.
honeycomb.cardHasType = function (card, typeIndex) {
	return honeycomb.cardTypeIndexArray(card).indexOf(honeycomb.cardTypeAlias(typeIndex)) >= 0;
};

//Every type entry a card is, primary first.
honeycomb.cardTypeDefinitionArray = function (card) {
	var indexArray = honeycomb.cardTypeIndexArray(card);
	var result = [];
	for (var scanIndex = 0; scanIndex < indexArray.length; scanIndex++) {
		result.push(honeycomb.cardType(indexArray[scanIndex]));
	}
	return result;
};

//The PRIMARY type entry for a card, or the entry for a type index. An unknown type falls back to
//Support's defaults rather than to nothing, so a typo moves nobody and swings no sword -- and is
//reported, since it is a typo.
honeycomb.cardType = function (typeOrCard) {
	var typeIndex = typeOrCard == null ? null
		: (typeof typeOrCard === "string" ? honeycomb.cardTypeAlias(typeOrCard) : honeycomb.cardTypeIndexArray(typeOrCard)[0]);
	var definition = honeycomb.findDefinition(honeycomb.cardTypeArray, typeIndex);
	if (definition != null) return definition;
	if (typeIndex != null) console.error("Honeycomb: unknown card type '" + typeIndex + "'");
	return honeycomb.findDefinition(honeycomb.cardTypeArray, "support");
};

//The frame art a card type is drawn in for a layout: its own `framePathByLayout`,
//else the shared frame the caller passes.
honeycomb.cardTypeFramePath = function (type, layoutIndex, sharedPath) {
	if (type == null || type.framePathByLayout == null || type.framePathByLayout[layoutIndex] == null) return sharedPath;
	return type.framePathByLayout[layoutIndex];
};

//A field the card may override and its type otherwise supplies. The one place the "card first, then
//type" rule is written, so every default resolves the same way.
honeycomb.cardDefault = function (resolved, fieldIndex) {
	if (resolved != null && resolved[fieldIndex] !== undefined) return resolved[fieldIndex];
	var type = honeycomb.cardType(resolved);
	return type == null ? undefined : type[fieldIndex];
};

//---------------------------------------------------------------------------------------------------
//Card tags
//---------------------------------------------------------------------------------------------------
//A card's `tagArray` is its SCHOOL, printed on the card the way Hearthstone prints a spell school, so
//content can be written for it ("whenever a Necromancy card is played": the hasTag condition with
//`of: "card"`). Deliberately a SEPARATE vocabulary from character tags (honeycomb.tagArray -- species,
//gender, role), which describe who someone is and never appear on a card.
//
//Sparing on purpose: a tag earns its place by something reading it. One ships, to test with.
//  name, color, description   what the card prints, and what its tooltip says
//  lustTag                    true for the tags the weakness ledger is written under (below). The
//                             `lustCardTag` warning reads it (honeycomb-warnings.js).
//
//THE LUST TAGS EARN THEIR PLACE TWICE. They print on a card like any school, and they are the key the
//between-run weakness ledger is written under: what a character has been hit by is a list of these,
//and enough hits of one kind makes them worse against it in later runs. See honeycomb.lust.
//Every card that inflicts Lust should carry at least one, or the hit teaches the ledger nothing.
honeycomb.cardTagArray = [
	{
		index: "necromancy",
		name: "Necromancy",
		color: "#9ad880",
		description: "Death magic: poisons, rot and the things that feed on them.",
	},
	{
		index: "restraint",
		name: "Restraint",
		color: "#c98a4b",
		description: "Holds, binds and pins. Lust dealt by Restraint builds a Restraint weakness.",
		//A LUST TAG: the between-run weakness ledger is written under it.
		lustTag: true,
	},
	{
		index: "exposure",
		name: "Exposure",
		color: "#e0b45a",
		description: "Strips away cover and composure. Lust dealt by Exposure builds an Exposure weakness.",
		//A LUST TAG: the between-run weakness ledger is written under it.
		lustTag: true,
	},
	{
		index: "charm",
		name: "Charm",
		color: "#e07ac6",
		description: "Gets into the head rather than at the body. Lust dealt by Charm builds a Charm weakness.",
		//A LUST TAG: the between-run weakness ledger is written under it.
		lustTag: true,
	},
	{
		index: "venom",
		name: "Venom",
		color: "#8fd66a",
		description: "Spores, draughts and things breathed in. Lust dealt by Venom builds a Venom weakness.",
		//A LUST TAG: the between-run weakness ledger is written under it.
		lustTag: true,
	},
	{
		index: "torment",
		name: "Torment",
		color: "#e0705a",
		description: "Relentless, past the point of bearing. Lust dealt by Torment builds a Torment weakness.",
		//A LUST TAG: the between-run weakness ledger is written under it.
		lustTag: true,
	},
	{
		//Clemence's own Lust build-up needed a tag of its own so its height can be READ as her
		//self-progression metric and can raise her Exposure between runs. Every self-lust entry she owns
		//carries it; nothing aimed at the enemy does.
		index: "penance",
		name: "Penance",
		color: "#e8c8a0",
		description: "Lust she takes on herself. Building it teaches a Penance weakness like any other.",
		lustTag: true,
	},
];

//---------------------------------------------------------------------------------------------------
//Archetypes -- SISTER MECHANICS
//---------------------------------------------------------------------------------------------------
//A character's PRIMITIVE is the engine verb their kit is built on; an ARCHETYPE is one of the divergent
//ways that character uses it (MECHANICS-01.md, part 3). A card names its archetype in `archetype`, and a
//card with none is the character's core. Not printed on the card: what reads it is the reward roll and
//the shop, through an outfit's `archetypeWeightArray` (honeycomb.archetypeWeightFor), and the outfit's
//own description, which names it for the player.
//  characterIndex   whose sister mechanic it is
//  primitive        the verb underneath, for the design record and the warning report
//  role             "offense" | "utility" -- the brief asks for at least one of each per character
honeycomb.archetypeArray = [
	//Four SISTERS per character -- the default outfit's own theme plus the three alt
	//outfits'. Indices older than the rework are kept (saves, tests and outfit weights read them); names and
	//descriptions follow the outfit each now belongs to.
	{ index: "oath", name: "Oath", characterIndex: "brienne", primitive: "temporaryHealth", role: "utility", outfit: "default",
		description: "Temporary HP as a promise: gold that survives the enemy turn pays out on hers." },
	{ index: "armament", name: "Siegeplate", characterIndex: "brienne", primitive: "temporaryHealth", role: "offense", outfit: "siegeplate",
		description: "Temporary HP as a weapon: attacks grow with the gold behind them." },
	{ index: "sentinel", name: "Bastion", characterIndex: "brienne", primitive: "temporaryHealth", role: "utility", outfit: "bastion",
		description: "Temporary HP as a wall: draw the attacks with Taunt and answer every hit the gold absorbs." },
	{ index: "tithe", name: "Almoner", characterIndex: "brienne", primitive: "temporaryHealth", role: "offense", outfit: "almoner",
		description: "Temporary HP as currency: spend yours or an ally's for energy, cards, damage and soothing." },
	{ index: "timing", name: "Timing", characterIndex: "nettle", primitive: "poison", role: "utility", outfit: "default",
		description: "Poison now or Poison later: make it act this instant, or lay it on thick and burn the card." },
	{ index: "rupture", name: "Rotsinger", characterIndex: "nettle", primitive: "poison", role: "offense", outfit: "rotsinger",
		description: "Cash the poison in now: consume it for burst damage, or make it tick double." },
	{ index: "contagion", name: "Sporemother", characterIndex: "nettle", primitive: "poison", role: "utility", outfit: "sporemother",
		description: "Poison that travels: carried in by the party's hits and spread across the line." },
	{ index: "venom", name: "Nightshade", characterIndex: "nettle", primitive: "poison", role: "offense", outfit: "nightshade",
		description: "Poison that builds Lust, so enemies break before they die." },
	{ index: "wounded", name: "Wounded", characterIndex: "severine", primitive: "blood", role: "offense", outfit: "default",
		description: "Being hurt is the hunger: every wound she takes and every Thirst orb lit makes her hit harder." },
	{ index: "feast", name: "Huntress", characterIndex: "severine", primitive: "blood", role: "offense", outfit: "huntress",
		description: "Prey on the wounded: finishers, and kills that pay out." },
	{ index: "bloodletting", name: "Crimson Covenant", characterIndex: "severine", primitive: "blood", role: "offense", outfit: "crimsonCovenant",
		description: "Blood Prices: pay health, hers or a teammate's, and turn the blood spilled into damage." },
	{ index: "transfusion", name: "Blood Saint", characterIndex: "severine", primitive: "blood", role: "utility", outfit: "bloodSaint",
		description: "Give blood: Drain, and heal allies at her own cost." },
	{ index: "lanes", name: "Lanes", characterIndex: "cinder", primitive: "partyOrder", role: "utility", outfit: "default",
		description: "Front and back both pay: cards that do one thing up front and another at the rear." },
	{ index: "charge", name: "Vanguard Plume", characterIndex: "cinder", primitive: "partyOrder", role: "offense", outfit: "vanguardPlume",
		description: "Pure damage from the front: forward is the only direction." },
	{ index: "formation", name: "Marshal", characterIndex: "cinder", primitive: "partyOrder", role: "utility", outfit: "marshal",
		description: "Put the right fighter in the right place: send allies forward to strike or back to recover." },
	{ index: "ashfall", name: "Ashfall", characterIndex: "cinder", primitive: "partyOrder", role: "offense", outfit: "ashfall",
		description: "Recklessness: debuffs on Cinder become Stride, damage and armour -- never weaker hits." },
	{ index: "mercy", name: "Mercy", characterIndex: "clemence", primitive: "breaking", role: "utility", outfit: "default",
		description: "Healing, paid for in her own Lust. She never takes Lust off an ally." },
	{ index: "devotion", name: "Devotee", characterIndex: "clemence", primitive: "breaking", role: "utility", outfit: "devotee",
		description: "Make breaking hard: Temporary HP raises everyone's break line." },
	{ index: "rapture", name: "Ecstatic", characterIndex: "clemence", primitive: "breaking", role: "offense", outfit: "ecstatic",
		description: "Rush her own Break, and become a danger to everyone while she is in it." },
	{ index: "sanctuary", name: "Abbess", characterIndex: "clemence", primitive: "breaking", role: "offense", outfit: "abbess",
		description: "Break the allies: Sanctified fighters keep their real cards while Broken." },
	{ index: "intents", name: "Intents", characterIndex: "cassadora", primitive: "intent", role: "utility", outfit: "default",
		description: "Read and rewrite what the enemy is about to do; the Orb records every change." },
	{ index: "repertoire", name: "Soothsayer", characterIndex: "cassadora", primitive: "intent", role: "utility", outfit: "soothsayer",
		description: "Her own deck: scry, draw, and the right card at the right time." },
	{ index: "turncoat", name: "Grifter", characterIndex: "cassadora", primitive: "intent", role: "offense", outfit: "grifter",
		description: "Turn the enemy's own moves against it, or take them outright." },
	{ index: "hex", name: "Hedge Witch", characterIndex: "cassadora", primitive: "intent", role: "utility", outfit: "hedgeWitch",
		description: "Curse the enemy: Weak, Sundered and Frail, stacked and multiplied." },
];

//The card tags a card carries that are registered as card tags, in table order. An unregistered string
//in a card's tagArray is data content may still ask about, but it is not printed.
honeycomb.cardSchoolArray = function (resolved) {
	var result = [];
	var tagArray = resolved == null || resolved.tagArray == null ? [] : resolved.tagArray;
	for (var scanIndex = 0; scanIndex < honeycomb.cardTagArray.length; scanIndex++) {
		if (tagArray.indexOf(honeycomb.cardTagArray[scanIndex].index) >= 0) result.push(honeycomb.cardTagArray[scanIndex]);
	}
	return result;
};

//---------------------------------------------------------------------------------------------------
//Keywords
//---------------------------------------------------------------------------------------------------
//A KEYWORD is a word printed on a card that means something the card has no room to explain. Each one
//is explained in a sidecar beside the card whenever the card is being read, so the rules text can stay
//short and the player is never left guessing.
//
//Where a card's keywords come from, so none has to be listed by hand:
//  * its PRINTED TEXT -- any keyword or status named in it. A sidecar explains words that are on the
//    card, never mechanics hidden behind hand-written prose that does not mention them.
//  * its effects -- each effect definition may name the keywords it implies (gaining Temporary HP
//    implies Temporary HP); counted when the implied word is in the printed text, which it is for
//    generated text
//  * its flags  -- exhausts, ethereal, innate, retain; always, since the flag is the rule
//  * `keywordArray` on the card, for anything else; always
//Every status is a keyword automatically, explained from the status table.
//
//  name          the word as printed; also what the card text highlights
//  description   the sidecar's explanation
//  color         the highlight and the sidecar heading
//  stat          for a keyword that names an engine stat under a different word
//
//THE TWO MECHANICS THAT REPLACED SHIELDS COME FIRST. Each names the engine stat it is the player-facing
//word for, so the tie between "Temporary HP" and `entity.temporaryHealth` is written down once.
honeycomb.keywordArray = [
	{
		index: "temporaryHealth",
		name: "Temporary HP",
		stat: "temporaryHealth",
		color: "#ffcf5c",
		description: "Extra health past the end of the bar. Spent before ordinary health, and never wasted " +
			"on a full-health target. HALVES at the start of its owner's turn rather than vanishing.",
	},
	{
		index: "lust",
		name: "Lust",
		stat: "lust",
		color: "#ff5fd2",
		description: "Builds on the health bar. The moment it reaches the health standing behind it -- ordinary " +
			"health plus Temporary HP -- its holder is Broken. It can climb past maximum health.",
	},
	{
		//A mechanic WORD, not a status: a node that says "soothe 6" means "remove 6 Lust", so the
		//explanation lives here rather than being repeated in every node's prose.
		index: "soothe",
		name: "Soothe",
		color: "#ff9ecb",
		description: "Removes that much Lust from the target.",
	},
	{
		index: "cleanse",
		name: "Cleanse",
		color: "#8fd9c0",
		description: "Removes every debuff from the target. Buffs are left alone.",
	},
	{
		index: "scry",
		name: "Scry",
		color: "#8fb7d9",
		description: "Look at that many cards on top of your draw pile. Send any of them to the discard pile; " +
			"the rest stay on top in their original order.",
	},
	{
		index: "energy",
		name: "Energy",
		color: "#4fc3e8",
		description: "The resource spent to play cards each turn. It refills at the start of your turn.",
	},
	{
		index: "soul",
		name: "Soul",
		color: "#6bbf59",
		description: "Nettle's Harvest currency. One is collected for every enemy that falls and every card " +
			"burned away, and Graveward spends them.",
	},
	{
		index: "intent",
		name: "Intent",
		color: "#5fa8f0",
		description: "What an enemy will do on its next turn, shown on its telegraph before it acts.",
	},
	{
		index: "junk",
		name: "Junk",
		color: "#c9b6dd",
		description: "A curse or other unplayable card that clogs the deck until it is removed.",
	},
	{
		index: "broken",
		name: "Broken",
		color: "#ff3b6b",
		description: "Every card this character holds is replaced by that card's own broken form, and they get " +
			"worse each turn they stay that way. They recover at the start of a turn their health stands above " +
			"their Lust. If the whole party is Broken, the run ends.",
	},
	{
		index: "exhaust",
		name: "Exhaust",
		color: "#c9b6dd",
		description: "Removed from the fight once played. It returns to the deck when the fight ends.",
	},
	{
		index: "ethereal",
		name: "Ethereal",
		color: "#c9b6dd",
		description: "Exhausted if it is still in the hand at the end of the turn.",
	},
	{
		index: "innate",
		name: "Innate",
		color: "#c9b6dd",
		description: "Always in the opening hand.",
	},
	{
		index: "retain",
		name: "Retain",
		color: "#c9b6dd",
		description: "Kept in the hand at the end of the turn instead of being discarded.",
	},

	//--- THE CHESSMASTER'S VOCABULARY ---
	//THE CAP IS READ FROM TUNING, never written as "5" -- moving the number moves the sentence with it.
	{
		index: "summon",
		name: "Summon",
		color: "#b98ad6",
		description: "Puts a piece on the board beside you. A summoned Pawn fills a FALLEN piece's place " +
			"before an empty one -- same slot, standing, at full health -- and the party may hold at most " +
			honeycomb.tuning.chessmaster.regularSlotCount + " bodies, corpses included. A summon with no room and " +
			"nothing to raise is refused.",
	},
	{
		index: "promote",
		name: "Promote",
		color: "#ffcf5c",
		description: "Turns one piece you point at into a bigger one. The SAME body wears the new shape: it " +
			"keeps its place in the line and its statuses, loses the old shape's passives, gains the new " +
			"shape's, and arrives at the new shape's full health. A promotion adds nobody, so a full board " +
			"may still promote -- which is how a board that cannot grow gets stronger.",
	},
	{
		index: "knight",
		name: "Knight",
		color: "#d9b06a",
		description: "The raider. Hits hardest of the small pieces and leaps to any ally's place for free; " +
			"the Infernal one will not stand where it struck.",
	},
	{
		index: "bishop",
		name: "Bishop",
		color: "#8fb7d9",
		description: "The reach. Deals in blessings and curses rather than blows, and both of them go WIDE " +
			"when it is standing at the back of the party.",
	},
	{
		index: "rook",
		name: "Rook",
		color: "#9aa7b8",
		description: "The wall. Most health of any piece, taunts what is in front of it, and is worth most " +
			"standing at the FRONT -- which its free march is for.",
	},
	{
		index: "queen",
		name: "Queen",
		color: "#e07ac6",
		description: "The payoff. Acts on the whole board at once: the Celestial one pays the party in " +
			"Temporary HP and Strength, the Infernal one corrupts what it looks at and pays in blood.",
	},
];

//Card flags that imply a keyword. Kept as data so a new flag is a row rather than a branch.
honeycomb.cardFlagKeywordArray = [
	{ index: "exhausts", keyword: "exhaust" },
	{ index: "ethereal", keyword: "ethereal" },
	{ index: "innate", keyword: "innate" },
	{ index: "retain", keyword: "retain" },
];

//A keyword by index, or a status presented as one. Statuses are keywords for free: their name and
//description already live in the status table, and writing them twice is how the two would drift.
honeycomb.keywordDefinition = function (keywordIndex) {
	var keyword = honeycomb.findDefinition(honeycomb.keywordArray, keywordIndex);
	if (keyword != null) return keyword;
	var status = honeycomb.findDefinition(honeycomb.statusArray == null ? [] : honeycomb.statusArray, keywordIndex);
	if (status == null) {
		//A character MECHANIC is a keyword too, so a node naming Resolve/Stride/Thirst explains itself.
		var mechanic = honeycomb.findDefinition(honeycomb.mechanicArray == null ? [] : honeycomb.mechanicArray, keywordIndex);
		if (mechanic == null) return null;
		return { index: mechanic.index, name: mechanic.name, color: mechanic.colorHint, description: honeycomb.mechanicDescription(mechanic), mechanic: true };
	}
	//statusDescription, not the raw field: a status writes its numbers as {tokens} so a tuning change
	//cannot leave the words behind, and this is what fills them in. Reading `description` directly meant
	//the keyword panel printed on a card showed "Deals {damageReductionPercent}% less attack damage"
	//while the status icon's own tooltip, which does call it, showed 25%. Six
	//statuses read that way: Weak, Sundered, Jinx, Stand Fast, Plated and Revenge.
	return { index: status.index, name: status.name, color: status.colorHint, description: honeycomb.statusDescription(status), status: true };
};

//The whole-word pattern a keyword matches its own name with, allowing the common verb endings so prose
//like "exhausts" or "soothes" still finds the keyword. Case-insensitive; the escape keeps a name with a
//regex character in it literal.
honeycomb.keywordWordPattern = function (name) {
	return "\\b" + String(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?:s|es|ed|ing)?\\b";
};

//Every keyword a NODE description names, in table order. A node has no effect list to walk, so the
//words are read straight off its printed text -- case-insensitively, because node prose writes "soothe"
//and "cleanse" in lower case. Used by the tree tooltip's sidecar.
honeycomb.nodeKeywordArray = function (node) {
	var result = [];
	if (node == null || node.description == null) return result;
	var text = String(node.description);
	function add(keywordIndex) {
		if (keywordIndex == null || result.indexOf(keywordIndex) >= 0) return;
		result.push(keywordIndex);
	}
	function names(name) {
		if (name == null) return false;
		return new RegExp(honeycomb.keywordWordPattern(name), "i").test(text);
	}
	function scan(definitionArray) {
		for (var scanIndex = 0; scanIndex < definitionArray.length; scanIndex++) {
			var definition = definitionArray[scanIndex];
			if (names(definition.name) == true) add(definition.index);
		}
	}
	scan(honeycomb.keywordArray);
	scan(honeycomb.statusArray == null ? [] : honeycomb.statusArray);
	scan(honeycomb.mechanicArray == null ? [] : honeycomb.mechanicArray);
	return result;
};

//Every keyword a card carries, in the order they first appear. Walks nested effect lists, because a
//A keyword inside a branch still needs explaining.
honeycomb.cardKeywordArray = function (resolved) {
	var result = [];
	if (resolved == null) return result;
	var printed = honeycomb.cardText(resolved);
	function add(keywordIndex, requirePrinted) {
		if (keywordIndex == null || result.indexOf(keywordIndex) >= 0) return;
		var keyword = honeycomb.keywordDefinition(keywordIndex);
		if (keyword == null) return;
		if (requirePrinted == true && honeycomb.textNamesKeyword(printed, keyword.name) == false) return;
		result.push(keywordIndex);
	}
	//Every keyword and status the printed text names, in the order the tables list them.
	for (var keywordScan = 0; keywordScan < honeycomb.keywordArray.length; keywordScan++) {
		add(honeycomb.keywordArray[keywordScan].index, true);
	}
	var statusArray = honeycomb.statusArray == null ? [] : honeycomb.statusArray;
	for (var statusScan = 0; statusScan < statusArray.length; statusScan++) add(statusArray[statusScan].index, true);
	function walk(effectArray) {
		if (effectArray == null) return;
		for (var entryIndex = 0; entryIndex < effectArray.length; entryIndex++) {
			var entry = effectArray[entryIndex];
			if (entry == null) continue;
			var definition = honeycomb.findDefinition(honeycomb.effectArray, entry.index);
			if (definition != null && definition.keywordArray != null) {
				var impliedArray = definition.keywordArray(entry);
				for (var impliedIndex = 0; impliedIndex < impliedArray.length; impliedIndex++) add(impliedArray[impliedIndex], true);
			}
			//Anything nested -- a repeat, a branch, a choice's options -- is walked the same way.
			walk(entry.effectArray);
			walk(entry.thenArray);
			walk(entry.elseArray);
			if (entry.optionArray != null) {
				for (var optionIndex = 0; optionIndex < entry.optionArray.length; optionIndex++) {
					walk(entry.optionArray[optionIndex].effectArray);
				}
			}
		}
	}
	walk(resolved.effectArray);
	for (var flagIndex = 0; flagIndex < honeycomb.cardFlagKeywordArray.length; flagIndex++) {
		var flag = honeycomb.cardFlagKeywordArray[flagIndex];
		if (resolved[flag.index] == true) add(flag.keyword, false);
	}
	var explicitArray = resolved.keywordArray == null ? [] : resolved.keywordArray;
	for (var explicitIndex = 0; explicitIndex < explicitArray.length; explicitIndex++) add(explicitArray[explicitIndex], false);
	return result;
};

//Whether printed text names a keyword, as a whole word: "Lust" is named by "Inflict 5 Lust." and not
//by "Lustre".
honeycomb.textNamesKeyword = function (text, name) {
	if (text == null || name == null) return false;
	var pattern = new RegExp("\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b");
	return pattern.test(text);
};

//Whether a card's effect list CONTAINS an effect of this index, nested lists included. Read by the card
//sound rules: "does this card heal" is a question about what it does.
honeycomb.cardHasEffect = function (definition, effectIndex) {
	function walk(effectArray) {
		if (effectArray == null) return false;
		for (var entryIndex = 0; entryIndex < effectArray.length; entryIndex++) {
			var entry = effectArray[entryIndex];
			if (entry == null) continue;
			if (entry.index == effectIndex) return true;
			if (walk(entry.effectArray) || walk(entry.thenArray) || walk(entry.elseArray)) return true;
			if (entry.optionArray != null) {
				for (var optionIndex = 0; optionIndex < entry.optionArray.length; optionIndex++) {
					if (walk(entry.optionArray[optionIndex].effectArray)) return true;
				}
			}
		}
		return false;
	}
	return walk(definition == null ? null : definition.effectArray);
};

//WHICH FINER SOUND A CARD GETS. The card's own `sfx` field wins; otherwise its
//explicit row in tuning.audio.cardSfxMap. NO RULES AND NO GUESSING: the first pass auto-assigned by
//name/tags and the results were ill-fitting, so every shipped card and enemy move is listed
//by hand, and the tests fail on an unassigned one. Returns a file STEM (see platform.playStem), or
//null when content has no assignment yet and the type fallback should speak.
honeycomb.cardSfxStem = function (card) {
	if (card == null) return null;
	if (card.sfx != null) return card.sfx;
	var map = honeycomb.tuning.audio.cardSfxMap;
	if (map == null) return null;
	return map[card.index] == null ? null : map[card.index];
};

//CARD RARITY. This is what
//a rarity IS -- its name and its colour -- so the card face, the tooltip and any future filter all read
//one table, and a new rarity is one entry. The draftable ranks are Starter / Common / Rare;
//special, enemy and broken exist too, so every card a player can see can say what it is.
//`showRarityGem`: whether the gold gem in the chrome (tuning.art.cardChrome, the piece
//marked `rarityGem`) is drawn on a card of this rarity. The gem was on EVERY card, so it said nothing
//at all; drawn on RARE alone it means "this is a
//payoff card", which is the one rarity distinction a player acts on mid-run. Starter sits below common,
//so a gem there would read backwards. Special is two curses and two stand-ins ("Random Card", "No
//Card") -- a gold mark on a curse would read as a reward. An enemy's move is never drafted. A broken
//form is marked by its rose edge, and waits on the broken-frame pass. A rarity that does not say draws
//none, so a rarity added later is quiet until it asks.
//WHERE A CARD IS ALLOWED TO COME FROM. Not what it does (cardTypeArray) and not how rare it is
//(cardRarityArray) -- whether it may be offered or granted at all.
//A card that names no `kind` is `normal`. A new kind is an entry here plus whatever reads its flags.
honeycomb.cardKindArray = [
	{
		index: "normal", name: "Normal",
		//Offered on reward screens and shelves; granted by random-card rolls and starting decks.
		offerable: true, grantable: true,
	},
	{
		//TOKEN / PHANTOM. A card that exists only because something made it.
		//Known users: King's Invocation, and Clemence's broken forms.
		index: "phantom", name: "Token",
		offerable: false, grantable: false,
	},
];

//The kind entry a card belongs to; `normal` for anything that does not say.
honeycomb.cardKindDefinition = function (card) {
	var index = card == null || card.kind == null ? "normal" : card.kind;
	return honeycomb.findDefinition(honeycomb.cardKindArray, index) ||
		honeycomb.findDefinition(honeycomb.cardKindArray, "normal");
};

//May this card be OFFERED -- a reward screen, a shop shelf, any pool the player picks from?
honeycomb.cardIsOfferable = function (card) {
	return honeycomb.cardKindDefinition(card).offerable != false;
};

//May this card be GRANTED without being picked -- a run-start random card, a random-card roll?
honeycomb.cardIsGrantable = function (card) {
	return honeycomb.cardKindDefinition(card).grantable != false;
};

honeycomb.cardRarityArray = [
	{ index: "starter", name: "Starter", color: "#b8b2c4", showRarityGem: false, description: "The cards a character begins with." },
	{ index: "common", name: "Common", color: "#8fb7d9", showRarityGem: false, description: "The ordinary finds of a run." },
	{ index: "rare", name: "Rare", color: "#e8c86a", showRarityGem: true, description: "The payoff cards, offered less often." },
	{ index: "special", name: "Special", color: "#c98fd9", showRarityGem: false, description: "Given by an event, a shop or a relic rather than drafted." },
	{ index: "enemy", name: "Enemy", color: "#d98f8f", showRarityGem: false, description: "An enemy's move; never drafted." },
	{ index: "broken", name: "Broken", color: "#ff3b6b", showRarityGem: false, description: "What a card becomes while its owner is Broken." },
];

//The rarity definition a card carries, or null.
honeycomb.cardRarity = function (definition) {
	if (definition == null || definition.rarity == null) return null;
	return honeycomb.findDefinition(honeycomb.cardRarityArray, definition.rarity);
};

//Whether this card draws the chrome's rarity gem. A card with no rarity, or a rarity that does not
//declare `showRarityGem`, draws none -- the mark is opt-in, so a new rarity is quiet until it asks.
honeycomb.cardShowsRarityGem = function (definition) {
	var rarity = honeycomb.cardRarity(definition);
	return rarity != null && rarity.showRarityGem == true;
};

//HOW A CARD LIST IS ORDERED. The table's own order is AUTHORING order -- whichever
//pass wrote a card, next to whichever outfit it was written for -- which is meaningless to a reader.
//
//Rarity first, in the order honeycomb.cardRarityArray already declares (starter, common, rare, special,
//enemy, broken), then by what the card costs, then by name. A new rarity therefore sorts itself by where
//it is placed in that table, with nothing here to edit.
honeycomb.cardRarityRank = function (card) {
	if (card == null || card.rarity == null) return honeycomb.cardRarityArray.length;
	for (var rankIndex = 0; rankIndex < honeycomb.cardRarityArray.length; rankIndex++) {
		if (honeycomb.cardRarityArray[rankIndex].index == card.rarity) return rankIndex;
	}
	return honeycomb.cardRarityArray.length;
};

honeycomb.compareCardsForReading = function (left, right) {
	var rarity = honeycomb.cardRarityRank(left) - honeycomb.cardRarityRank(right);
	if (rarity !== 0) return rarity;
	var leftCost = left.costArray == null || left.costArray.energy == null ? 0 : left.costArray.energy;
	var rightCost = right.costArray == null || right.costArray.energy == null ? 0 : right.costArray.energy;
	if (leftCost !== rightCost) return leftCost - rightCost;
	var leftName = String(left.name == null ? left.index : left.name);
	var rightName = String(right.name == null ? right.index : right.name);
	return leftName < rightName ? -1 : (leftName > rightName ? 1 : 0);
};


honeycomb.cardArray = [

	//The Infernal pieces' own moves.
	//TWO MOVES EACH, walked in order (`moveStrategy: "sequence"`), and the pair is always one blow and one
	//other thing -- so switching a piece's intent (the `setIntent` verb) is a real question every turn and
	//never a power gain. Infernal OPENS ON THE BLOW; its Celestial twin opens on the guard. They are also
	//the gauntlet's enemies, so each stands on its own as an enemy a party can read.
	//
	//WHAT INFERNAL IS FOR: every Infernal piece pays for its damage in its own body or in the party's,
	//and none of them banks as much Temporary HP as its Celestial twin.
	//
	//AND POSITION IS A DECISION: Rook and Pawn cards benefit from standing at the front, and the Bishops
	//want the opposite -- their wide mode is the one they get from the BACK. Both are `atRank` on the move's
	//own user, which is why a piece's free activation (allyActivation) is worth spending.
	{
		//Bites the front line and splashes its own on the way through. The cheapest body on the board,
		//and the one a sacrifice card spends.
		index: "infernalPawnGnash", name: "Gnash", enemyIndex: "infernalPawn", rarity: "enemy",
		costArray: {}, targetMode: "frontEnemy", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [
			{ index: "damage", amount: 9 },
			{ index: "damage", amount: 3, targetOverride: "alliesAhead" },
		],
		sfx: "weaponBrutal",
		text: "Deal 9. Deal 3 to every ally in front of this Pawn.",
	},
	{
		//What it takes, it hands back to her. `summoner` rather than a named character: the piece points
		//at whoever put it down.
		index: "infernalPawnBrace", name: "Brace", enemyIndex: "infernalPawn", rarity: "enemy",
		costArray: {}, targetMode: "summoner", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "temporaryHealth", amount: 4 }],
		sfx: "magicWeird",
		text: "Its summoner gains 4 Temporary HP.",
	},
	{
		//The biggest single hit any small piece has, and it will not stand where it struck.
		index: "infernalKnightSortie", name: "Sortie", enemyIndex: "infernalKnight", rarity: "enemy",
		costArray: {}, targetMode: "frontEnemy", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [
			{ index: "damage", amount: 12 },
			{ index: "applyStatus", status: "sundered", stacks: 2, condition: { index: "atRank", of: "source", rank: 0 } },
			{ index: "shiftParty", shift: "backward", targetOverride: "self" },
		],
		sfx: "weaponThrust",
		text: "Deal 12, and 2 Sundered if this Knight is at the front. It retreats one place.",
	},
	{
		//The board reads itself. Standing beside a Bishop is the difference between a card and two, which
		//is the only place in the kit where two pieces' PLACES matter to each other.
		index: "infernalKnightScout", name: "Scout", enemyIndex: "infernalKnight", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{
			index: "branch", test: { index: "hasTag", over: "adjacentAllies", tag: "bishop" },
			thenArray: [{ index: "applyStatus", status: "foresight", stacks: 2 }],
			elseArray: [{ index: "applyStatus", status: "foresight", stacks: 1 }],
		}],
		sfx: "weaponThrust",
		text: "Draw a card next turn, or 2 if a Bishop stands beside this Knight.",
	},
	{
		//Opens on rot rather than a blow, and from the back of the party it rots the whole room.
		index: "infernalBishopBlight", name: "Blight", enemyIndex: "infernalBishop", rarity: "enemy",
		costArray: {}, targetMode: "frontEnemy", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{
			index: "branch", test: { index: "atRank", of: "source", rank: 0, fromBack: true },
			thenArray: [{ index: "applyStatus", status: "poison", stacks: 4, targetOverride: "allEnemies" }],
			elseArray: [{ index: "applyStatus", status: "poison", stacks: 4, targetOverride: "frontEnemy" }],
		}],
		sfx: "debuffParty",
		text: "Inflict 4 Poison. From the back of the party, inflict it on ALL enemies instead.",
	},
	{
		index: "infernalBishopHex", name: "Hex", enemyIndex: "infernalBishop", rarity: "enemy",
		costArray: {}, targetMode: "frontEnemy", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{
			index: "branch", test: { index: "atRank", of: "source", rank: 0, fromBack: true },
			thenArray: [{ index: "applyStatus", status: "sundered", stacks: 2, targetOverride: "allEnemies" }],
			elseArray: [{ index: "applyStatus", status: "sundered", stacks: 2, targetOverride: "frontEnemy" }],
		}],
		sfx: "debuffParty",
		text: "Inflict 2 Sundered. From the back of the party, inflict it on ALL enemies instead.",
	},
	{
		//It does not answer a blow, it invoices the room for it. Its own move is how it stacks Revenge, so
		//a Rook left alive under fire becomes the largest number on the board.
		index: "infernalRookGrudge", name: "Grudge", enemyIndex: "infernalRook", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [
			{ index: "applyStatus", status: "revenge", stacks: 1 },
			{ index: "shiftParty", shift: "front", targetOverride: "self" },
		],
		sfx: "magicSlash",
		text: "Gains 1 Revenge and marches to the front.",
	},
	{
		index: "infernalRookLashOut", name: "Lash Out", enemyIndex: "infernalRook", rarity: "enemy",
		costArray: {}, targetMode: "allEnemies", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "damage", amount: { index: "math", operation: "add", left: 3,
			right: { index: "conditional", condition: { index: "compare", operation: "less",
				left: { index: "healthFraction", of: "source" }, right: 0.5 }, then: 3, else: 0 } } }],
		sfx: "weaponClang",
		text: "Deal 3 to ALL enemies, or 6 while this Rook is below half health.",
	},

	{
		//THE EVIL CORRUPTING FAMILIAR, and the only piece on either board with more
		//than two moves. Five moves walked in order, so a Queen kept alive for five turns pays out a
		//King -- and killing one is the enemy's way of never letting that happen.
		index: "infernalQueenDominion", name: "Dominion", enemyIndex: "infernalQueen", rarity: "enemy",
		costArray: {}, targetMode: "alliesBehind", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [
			{ index: "damage", amount: 3 },
			{ index: "applyStatus", status: "strength", stacks: 2 },
		],
		text: "Deal 3 to every ally behind this Queen. They gain 2 Strength.",
	},
	{
		index: "infernalQueenScheme", name: "Scheme", enemyIndex: "infernalQueen", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "applyStatus", status: "energised", stacks: 1 }],
		text: "Gain 1 Energy on your next turn.",
	},
	{
		index: "infernalQueenCorrupt", name: "Corrupt", enemyIndex: "infernalQueen", rarity: "enemy",
		costArray: {}, targetMode: "allEnemies", layout: "horizontal",
		tagArray: ["charm"],
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "lust", amount: { index: "math", operation: "multiply", left: 2,
			right: { index: "targetCount", mode: "alliesAhead" } } }],
		text: "Inflict 2 Lust on ALL enemies for each ally in front of this Queen.",
		sfx: "lewdSlap",
	},
	{
		index: "infernalQueenDefection", name: "Defection", enemyIndex: "infernalQueen", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "forEachTarget", over: "allPieces", effectArray: [
			{ index: "invert", condition: { index: "hasTag", of: "target", tag: "celestial" } },
		] }],
		sfx: "magicFireball",
		text: "Every allied Celestial piece is inverted.",
	},
	{
		index: "infernalQueenPetition", name: "Petition", enemyIndex: "infernalQueen", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "vertical",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "addCardToDeck", card: "anastasiaInfernalInvocation", intoDrawPile: true }],
		sfx: "magicFireball",
		text: "Shuffle an Infernal Invocation into your deck, permanently.",
	},
	{
		index: "infernalKingRuin", name: "Ruin", enemyIndex: "infernalKing", rarity: "enemy",
		costArray: {}, targetMode: "frontEnemy", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "damage", amount: 20 }],
		text: "Deal 20.",
	},
	{
		index: "infernalKingTyranny", name: "Tyranny", enemyIndex: "infernalKing", rarity: "enemy",
		costArray: {}, targetMode: "allAllies", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "applyStatus", status: "strength", stacks: 2 }],
		text: "All allies gain 2 Strength.",
	},

	//---------------------------------------------------------------------------------------------------
	//The Chessmaster -- Anastasia
	//---------------------------------------------------------------------------------------------------
	//SHE HAS MINIONS, AND THE MINIONS ACT. Her golems telegraph a move like any AI combatant and play it, in
	//line order, as her turn ends. Her cards are five verbs on that board:
	//  summon      put a piece down                                    `summon`
	//  promote     a card saying A->B; the Pawn's alignment is kept    `promote`
	//  resequence  switch what a piece is about to do                  `setIntent`
	//  buff        Strength and Temporary HP, on pieces or on real allies
	//  reposition  move a piece along the line                         `shiftParty`
	//
	//EVERY CARD NAMES ITS `pose`. A command to the board is the snap ("offense"); reading the board is the
	//crouch ("passive"). The snap is the one thing the build may not drop, so it is written on the entry
	//rather than left to the type default, and suite block [114] asserts the pool uses both.
	//
	//NO `archetype` FIELD YET: the pool is 15 cards, not the 21 C / 11 R a shipped character carries, and
	//one archetype with a third of its cards would mis-weight every offer. It arrives with the full pool.

	//--- STARTERS: 2x one attack, 2x one defence. BOTH put a Pawn down. The attack starter is a summon --
	//an INFERNAL Pawn, walked to the front, where Gnash hits for 9 instead of 6. The two starters are
	//therefore the two alignments: Advance puts a blow at the front, Develop puts a shield behind.
	{
		index: "anastasiaAdvance",
		name: "Advance",
		characterIndex: "anastasia",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "self",
		layout: "horizontal",
		pose: "offense",
		artPath: "cards/art/anastasia-advance",
		artOwed: true,
		sfx: "miscSnap",
		effectArray: [
			{ index: "summon", enemy: "infernalPawn", team: "own" },
			{ index: "shiftParty", shift: "front", targetOverride: "lastSummoned" },
		],
		text: "Summon an Infernal Pawn at the front of the party.",
		upgradeArray: [{ name: "Advance+", effectArray: [
			{ index: "summon", enemy: "infernalPawn", team: "own" },
			{ index: "shiftParty", shift: "front", targetOverride: "lastSummoned" },
			{ index: "applyStatus", status: "strength", stacks: 2, targetOverride: "lastSummoned" },
		], text: "Summon an Infernal Pawn at the front of the party. It gains 2 Strength." }],
	},
	{
		index: "anastasiaDevelop",
		name: "Develop",
		characterIndex: "anastasia",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "self",
		layout: "horizontal",
		//THE SNAP, NOT THE CROUCH: Advance, Develop and the king-summoning cards all use the snap pose, even
		//though the defence starter used to crouch despite summoning. The rule is about the GESTURE rather
		//than the card's job: putting a body on the board is a command,
		//whichever colour it wears.
		pose: "offense",
		sfx: "miscSnap",
		artPath: "cards/art/anastasia-develop",
		artOwed: true,
		effectArray: [
			{ index: "summon", enemy: "celestialPawn", team: "own" },
			{ index: "temporaryHealth", amount: 3 },
		],
		text: "Summon a Celestial Pawn. Gain 3 Temporary HP.",
		upgradeArray: [{ name: "Develop+", effectArray: [
			{ index: "summon", enemy: "celestialPawn", team: "own" },
			{ index: "temporaryHealth", amount: 6 },
		], text: "Summon a Celestial Pawn. Gain 6 Temporary HP." }],
	},

	//--- SUMMON ---
	//"Poisoned Pawn" WAS HERE AND IS CUT. It was a
	//1-energy common that summoned an Infernal Pawn -- which is what her ATTACK STARTER does now, at the
	//same price, only better, since Advance walks the Pawn to the front. A common that a starter strictly
	//outclasses is a dead draw.
	{
		//SPENDS A PAWN TO MAKE TWO. It was a 2-energy rare that summoned two out of nothing; as a sacrifice
		//it costs a body,
		//which is what makes it a common and what feeds Gambit.
		index: "anastasiaPawnStorm",
		name: "Pawn Storm",
		characterIndex: "anastasia",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		targetCondition: { index: "hasTag", of: "target", tag: "pawn" },
		layout: "vertical",
		pose: "offense",
		sfx: "miscSnap",
		artPath: "cards/art/anastasia-pawn-storm",
		artOwed: true,
		effectArray: [
			{ index: "loseHealth", amount: 999 },
			{ index: "summon", enemy: "infernalPawn", team: "own", count: 2 },
		],
		text: "Sacrifice a Pawn. Summon 2 Infernal Pawns.",
		upgradeArray: [{ name: "Pawn Storm+", effectArray: [
			{ index: "loseHealth", amount: 999 },
			{ index: "summon", enemy: "infernalPawn", team: "own", count: 3 },
		], text: "Sacrifice a Pawn. Summon 3 Infernal Pawns." }],
	},

	//--- PROMOTE: a card saying A->B. The branch keeps the Pawn's alignment, so one card serves both
	//colours and Transposition stays the only thing that changes a piece's side.
	{
		index: "anastasiaKnightsTour",
		name: "Knight's Tour",
		characterIndex: "anastasia",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		targetCondition: { index: "hasTag", of: "target", tag: "pawn" },
		layout: "horizontal",
		pose: "offense",
		sfx: "miscSnap",
		artPath: "cards/art/anastasia-knights-tour",
		artOwed: true,
		effectArray: [{
			index: "branch", test: { index: "hasTag", of: "target", tag: "infernal" },
			thenArray: [{ index: "promote", to: "infernalKnight" }],
			elseArray: [{ index: "promote", to: "celestialKnight" }],
		}],
		text: "Promote a Pawn into a Knight.",
		upgradeArray: [{ name: "Knight's Tour+", costArray: { energy: 0 } }],
	},
	{
		index: "anastasiaLongDiagonal",
		name: "Long Diagonal",
		characterIndex: "anastasia",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		targetCondition: { index: "hasTag", of: "target", tag: "pawn" },
		layout: "horizontal",
		pose: "offense",
		sfx: "miscSnap",
		artPath: "cards/art/anastasia-long-diagonal",
		artOwed: true,
		effectArray: [{
			index: "branch", test: { index: "hasTag", of: "target", tag: "infernal" },
			thenArray: [{ index: "promote", to: "infernalBishop" }],
			elseArray: [{ index: "promote", to: "celestialBishop" }],
		}],
		text: "Promote a Pawn into a Bishop.",
		upgradeArray: [{ name: "Long Diagonal+", costArray: { energy: 0 } }],
	},
	{
		index: "anastasiaRookLift",
		name: "Rook Lift",
		characterIndex: "anastasia",
		rarity: "common",
		//1 ENERGY, NOT 2: at 1 it is the same
		//price as the other promotions, and the Rook's size is what it buys.
		costArray: { energy: 1 },
		targetMode: "ally",
		targetCondition: { index: "hasTag", of: "target", tag: "pawn" },
		layout: "horizontal",
		pose: "offense",
		sfx: "miscSnap",
		artPath: "cards/art/anastasia-rook-lift",
		artOwed: true,
		effectArray: [{
			index: "branch", test: { index: "hasTag", of: "target", tag: "infernal" },
			thenArray: [{ index: "promote", to: "infernalRook" }],
			elseArray: [{ index: "promote", to: "celestialRook" }],
		}],
		text: "Promote a Pawn into a Rook.",
		upgradeArray: [{ name: "Rook Lift+", costArray: { energy: 0 } }],
	},
	{
		index: "anastasiaQueening",
		name: "Queening",
		characterIndex: "anastasia",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "ally",
		targetCondition: { index: "hasTag", of: "target", tag: "pawn" },
		layout: "vertical",
		pose: "offense",
		sfx: "miscSnap",
		artPath: "cards/art/anastasia-queening",
		artOwed: true,
		effectArray: [{
			index: "branch", test: { index: "hasTag", of: "target", tag: "infernal" },
			thenArray: [{ index: "promote", to: "infernalQueen" }],
			elseArray: [{ index: "promote", to: "celestialQueen" }],
		}],
		text: "Promote a Pawn into a Queen.",
		upgradeArray: [{ name: "Queening+", costArray: { energy: 1 } }],
	},

	//--- RESEQUENCE: the `setIntent` verb. A switch trades a piece's next two turns and gains nothing, so
	//she may hold a lot of it.
	{
		//THE CHOOSE-ONE: timing or power -- the
		//axis the whole kit prices on -- and the containment for the overlap with Cassadora, who denies the
		//ENEMY's plan where this directs her own board.
		index: "anastasiaTempo",
		name: "Tempo",
		characterIndex: "anastasia",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		pose: "offense",
		artPath: "cards/art/anastasia-tempo",
		artOwed: true,
		effectArray: [{
			index: "chooseOption",
			prompt: "Timing, or power?",
			optionArray: [
				{ index: "switch", name: "Switch", description: "Switch the ally's intent to its next move.",
					effectArray: [{ index: "setIntent" }] },
				{ index: "strength", name: "Strengthen", description: "The ally gains 2 Strength.",
					effectArray: [{ index: "applyStatus", status: "strength", stacks: 2 }] },
			],
		}],
		text: "Choose one: an ally gains 2 Strength; or change a friendly golem's intent.",
		upgradeArray: [{ name: "Tempo+", effectArray: [{
			index: "chooseOption",
			prompt: "Timing, or power?",
			optionArray: [
				{ index: "switch", name: "Switch", description: "Switch the ally's intent to its next move. Draw a card.",
					effectArray: [{ index: "setIntent" }, { index: "drawCards", amount: 1 }] },
				{ index: "strength", name: "Strengthen", description: "The ally gains 3 Strength.",
					effectArray: [{ index: "applyStatus", status: "strength", stacks: 3 }] },
			],
		}], text: "Choose one: an ally gains 3 Strength; or change a friendly golem's intent and draw a card." }],
	},
	//--- CHECK, AT THE RARITY THE NAME DESERVED. Same index, so her sound row and every
	//pointer at it still resolve; what changed is that it is no longer two of her opening hand. A check is
	//a threat the board makes, so the card only becomes one when the board can make it: a Knight or a
	//Queen standing with her turns a single blow into a sweep.
	{
		index: "anastasiaCheck",
		name: "Check",
		characterIndex: "anastasia",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "enemy",
		layout: "vertical",
		pose: "offense",
		artPath: "cards/art/anastasia-check",
		artOwed: true,
		effectArray: [{
			index: "branch",
			test: { index: "anyOf", conditionArray: [
				{ index: "hasTag", over: "allAllies", tag: "knight" },
				{ index: "hasTag", over: "allAllies", tag: "queen" },
			] },
			thenArray: [{ index: "damage", amount: 8, targetOverride: "allEnemies" }],
			elseArray: [{ index: "damage", amount: 8 }],
		}],
		sfx: "miscSnap",
		text: "Deal 8. If a Knight or a Queen is in the party, deal 8 to ALL enemies instead.",
		upgradeArray: [{ name: "Check+", effectArray: [{
			index: "branch",
			test: { index: "anyOf", conditionArray: [
				{ index: "hasTag", over: "allAllies", tag: "knight" },
				{ index: "hasTag", over: "allAllies", tag: "queen" },
			] },
			thenArray: [{ index: "damage", amount: 12, targetOverride: "allEnemies" }],
			elseArray: [{ index: "damage", amount: 12 }],
		}], text: "Deal 12. If a Knight or a Queen is in the party, deal 12 to ALL enemies instead." }],
	},
	{
		index: "anastasiaSimul",
		name: "Simul",
		characterIndex: "anastasia",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "self",
		layout: "vertical",
		pose: "offense",
		artPath: "cards/art/anastasia-simul",
		artOwed: true,
		effectArray: [{ index: "setIntent", targetOverride: "otherAllies" }, { index: "drawCards", amount: 1 }],
		text: "Switch the intent of EVERY piece. Draw a card.",
		upgradeArray: [{ name: "Simul+", costArray: { energy: 0 } }],
	},

	//--- THE SACRIFICE: a Pawn is a body to spend. Every one that falls is a Gambit, which is what King's
	//Invocation is paid in -- and a downed Pawn is inventory, not a leak (the next Pawn summon refills it).
	{
		index: "anastasiaSacrificePlay",
		name: "Sacrifice Play",
		characterIndex: "anastasia",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		targetCondition: { index: "hasTag", of: "target", tag: "pawn" },
		layout: "horizontal",
		pose: "offense",
		artPath: "cards/art/anastasia-sacrifice-play",
		artOwed: true,
		effectArray: [
			{ index: "loseHealth", amount: 999 },
			{ index: "damage", amount: 14, targetOverride: "frontEnemy" },
		],
		text: "Sacrifice a Pawn. Deal 14 to the front enemy.",
		upgradeArray: [{ name: "Sacrifice Play+", effectArray: [
			{ index: "loseHealth", amount: 999 },
			{ index: "damage", amount: 19, targetOverride: "frontEnemy" },
		], text: "Sacrifice a Pawn. Deal 19 to the front enemy." }],
	},
	{
		index: "anastasiaGambitAccepted",
		name: "Gambit Accepted",
		characterIndex: "anastasia",
		rarity: "rare",
		costArray: { energy: 0 },
		targetMode: "ally",
		targetCondition: { index: "hasTag", of: "target", tag: "pawn" },
		layout: "vertical",
		pose: "offense",
		artPath: "cards/art/anastasia-gambit-accepted",
		artOwed: true,
		effectArray: [
			{ index: "loseHealth", amount: 999 },
			{ index: "gainResource", resource: "energy", amount: 2 },
			{ index: "drawCards", amount: 1 },
		],
		text: "Sacrifice a Pawn. Gain 2 Energy and draw a card.",
		upgradeArray: [{ name: "Gambit Accepted+", effectArray: [
			{ index: "loseHealth", amount: 999 },
			{ index: "gainResource", resource: "energy", amount: 2 },
			{ index: "drawCards", amount: 2 },
		], text: "Sacrifice a Pawn. Gain 2 Energy and draw 2 cards." }],
	},

	//--- FOUR MORE COMMONS THAT SPEND A PAWN, plus the one that gets the fallen back up. Every one is
	//Every one is `targetMode: "ally"` with a `pawn` targetCondition and a 999 loseHealth, the shape
	//Sacrifice Play already used -- so the board being full is never a reason not to play a card, and a
	//Pawn spent is a Gambit toward the King.
	{
		//Her Lust answer, and it is not free: the body pays it.
		index: "anastasiaInterpose",
		name: "Interpose",
		characterIndex: "anastasia",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		targetCondition: { index: "hasTag", of: "target", tag: "pawn" },
		layout: "horizontal",
		pose: "offense",
		artPath: "cards/art/anastasia-interpose",
		artOwed: true,
		effectArray: [
			{ index: "loseHealth", amount: 999 },
			{ index: "soothe", amount: 20, targetOverride: "owner" },
			{ index: "drawCards", amount: 1 },
		],
		text: "Sacrifice a Pawn. Soothe 20. Draw a card.",
		upgradeArray: [{ name: "Interpose+", effectArray: [
			{ index: "loseHealth", amount: 999 },
			{ index: "soothe", amount: 30, targetOverride: "owner" },
			{ index: "drawCards", amount: 1 },
		], text: "Sacrifice a Pawn. Soothe 30. Draw a card." }],
	},
	{
		//The Strength lands on whoever is holding the line, which on a full board is usually a piece.
		index: "anastasiaBattery",
		name: "Battery",
		characterIndex: "anastasia",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		targetCondition: { index: "hasTag", of: "target", tag: "pawn" },
		layout: "horizontal",
		pose: "offense",
		artPath: "cards/art/anastasia-battery",
		artOwed: true,
		effectArray: [
			{ index: "loseHealth", amount: 999 },
			{ index: "applyStatus", status: "strength", stacks: 4, targetOverride: "frontAlly" },
		],
		text: "Sacrifice a Pawn. The ally in front gains 4 Strength.",
		upgradeArray: [{ name: "Battery+", effectArray: [
			{ index: "loseHealth", amount: 999 },
			{ index: "applyStatus", status: "strength", stacks: 6, targetOverride: "frontAlly" },
		], text: "Sacrifice a Pawn. The ally in front gains 6 Strength." }],
	},
	{
		//A DESPERADO IS A PIECE ALREADY LOST THAT GOES OUT TAKING SOMETHING WITH IT. Needs no Pawn on the
		//board -- it makes its own -- so it is the sacrifice card that works from an empty field, and the
		//only sweep she has. `lastSummoned` is what it spends: naming a rank would be wrong the moment the
		//summon refilled a corpse somewhere other than the back.
		index: "anastasiaDesperado",
		name: "Desperado",
		characterIndex: "anastasia",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "self",
		layout: "horizontal",
		pose: "offense",
		artPath: "cards/art/anastasia-desperado",
		artOwed: true,
		effectArray: [
			{ index: "summon", enemy: "celestialPawn", team: "own" },
			{ index: "loseHealth", amount: 999, targetOverride: "lastSummoned" },
			{ index: "damage", amount: 6, targetOverride: "allEnemies" },
		],
		text: "Summon a Celestial Pawn and sacrifice it. Deal 6 to ALL enemies.",
		upgradeArray: [{ name: "Desperado+", effectArray: [
			{ index: "summon", enemy: "celestialPawn", team: "own" },
			{ index: "loseHealth", amount: 999, targetOverride: "lastSummoned" },
			{ index: "damage", amount: 9, targetOverride: "allEnemies" },
		], text: "Summon a Celestial Pawn and sacrifice it. Deal 9 to ALL enemies." }],
	},
	{
		//THE FIELD CLEARER. A promotion that goes the other way: whatever fell stands up as a Pawn, in its
		//own place, at full health. The counterweight to a board of corpses a Pawn summon can only eat one
		//of at a time.
		index: "anastasiaUnderpromotion",
		//NAMED "MUSTER", NOT "UNDERPROMOTION": the card-fit rule measured the longer name at 1.066 of the
		//small frame's name box, and 1.172 with the upgrade's "+". A name that does not fit is not a name.
		name: "Muster",
		characterIndex: "anastasia",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "self",
		layout: "horizontal",
		//THE SNAP: it puts Pawns on the board, the gesture the snap pose is for, although its verb is
		//`raiseFallenPieces` rather than `summon`.
		pose: "offense",
		sfx: "miscSnap",
		artPath: "cards/art/anastasia-muster",
		artOwed: true,
		effectArray: [{ index: "raiseFallenPieces", to: "celestialPawn" }],
		text: "Every fallen piece stands up as a Celestial Pawn.",
		upgradeArray: [{ name: "Muster+", effectArray: [
			{ index: "raiseFallenPieces", to: "celestialPawn" },
			{ index: "temporaryHealth", amount: 4, targetOverride: "allPieces" },
		], text: "Every fallen piece stands up as a Celestial Pawn. ALL pieces gain 4 Temporary HP." }],
	},

	//--- BUFF AND REPOSITION: the crouch. A buff spent on a Pawn dies with the Pawn, so these are cheap
	//and wide rather than dear and tall.
	{
		index: "anastasiaStudyTheBoard",
		name: "Study the Board",
		characterIndex: "anastasia",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "horizontal",
		pose: "passive",
		artPath: "cards/art/anastasia-study-the-board",
		artOwed: true,
		effectArray: [{ index: "applyStatus", status: "strength", stacks: 1 }],
		text: "ALL allies gain 1 Strength.",
		upgradeArray: [{ name: "Study the Board+", effectArray: [
			{ index: "applyStatus", status: "strength", stacks: 1 }, { index: "drawCards", amount: 1 },
		], text: "ALL allies gain 1 Strength. Draw a card." }],
	},
	{
		index: "anastasiaHoldTheFile",
		name: "Hold the File",
		characterIndex: "anastasia",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "horizontal",
		pose: "passive",
		artPath: "cards/art/anastasia-hold-the-file",
		artOwed: true,
		effectArray: [{ index: "temporaryHealth", amount: 3 }],
		text: "ALL allies gain 3 Temporary HP.",
		upgradeArray: [{ name: "Hold the File+", effectArray: [{ index: "temporaryHealth", amount: 5 }],
			text: "ALL allies gain 5 Temporary HP." }],
	},
	{
		//REPLACES "CASTLE" WHOLE. Castling is a King and a Rook
		//trading places, so this one is ABOUT the Rook: aimed at one it marches it to the front and makes
		//it the wall it is, and Rampart then banks 14 Temporary HP there instead of 8. Aimed at anybody
		//else it is still a shield, so the card is never dead.
		index: "anastasiaCastling",
		name: "Castling",
		characterIndex: "anastasia",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		pose: "passive",
		artPath: "cards/art/anastasia-castling",
		artOwed: true,
		effectArray: [{
			index: "branch", test: { index: "hasTag", of: "target", tag: "rook" },
			thenArray: [
				{ index: "shiftParty", shift: "front" },
				{ index: "temporaryHealth", amount: 8 },
				{ index: "applyStatus", status: "taunt", stacks: 1 },
			],
			elseArray: [{ index: "temporaryHealth", amount: 8 }],
		}],
		text: "An ally gains 8 Temporary HP. A Rook also moves to the front and gains 1 Taunt.",
		upgradeArray: [{ name: "Castling+", effectArray: [{
			index: "branch", test: { index: "hasTag", of: "target", tag: "rook" },
			thenArray: [
				{ index: "shiftParty", shift: "front" },
				{ index: "temporaryHealth", amount: 12 },
				{ index: "applyStatus", status: "taunt", stacks: 2 },
			],
			elseArray: [{ index: "temporaryHealth", amount: 12 }],
		}], text: "An ally gains 12 Temporary HP. A Rook also moves to the front and gains 2 Taunt." }],
	},
	{
		//AND IT DREW NOTHING: the old amount was `partyTagCount`, which walks the party through memberHasTag -- a
		//CHARACTER lookup, so a golem resolved to no tags at all and counted zero. `partyEntityTagCount`
		//(honeycomb-tags.js) asks honeycomb.entityHasTag instead, which knows both kinds.
		//
		//NOTE FOR THE ROSTER: nobody on it carries `undead` today -- Severine is `vampire` -- so the Energy
		//half is fed by Infernal pieces alone until that is decided. It is one tag on her entry either way.
		index: "anastasiaDeepCalculation",
		name: "Deep Calculation",
		characterIndex: "anastasia",
		rarity: "rare",
		costArray: { energy: 3 },
		targetMode: "self",
		layout: "vertical",
		pose: "passive",
		artPath: "cards/art/anastasia-deep-calculation",
		artOwed: true,
		effectArray: [
			{ index: "drawCards", amount: { index: "math", operation: "add",
				left: { index: "partyEntityTagCount", tag: "human", excludeSelf: true },
				right: { index: "partyEntityTagCount", tag: "celestial" } } },
			{ index: "gainResource", resource: "energy", amount: { index: "math", operation: "add",
				left: { index: "partyEntityTagCount", tag: "undead" },
				right: { index: "partyEntityTagCount", tag: "infernal" } } },
		],
		text: "Draw a card for each other Human ally and Celestial piece. Gain 1 Energy for each Undead ally and Infernal piece.",
		upgradeArray: [{ name: "Deep Calculation+", costArray: { energy: 2 } }],
	},

	{
		index: "anastasiaKingsInvocation",
		//The first user of the `phantom` kind: only ever added by Call the King, never offered and never
		//rolled into a deck.
		kind: "phantom",
		name: "King's Invocation",
		characterIndex: "anastasia",
		rarity: "rare",
		//`baseCost`, less one per Gambit (the outfit's modifyCardCost hook): a fight that fed the loop pays
		//almost nothing for its King.
		costArray: { energy: honeycomb.tuning.chessmaster.kingInvocation.baseCost },
		targetMode: "self",
		layout: "vertical",
		pose: "offense",
		sfx: "miscSnap",
		artPath: "cards/art/anastasia-kings-invocation",
		artOwed: true,
		exhausts: true,
		//THE KING IS SET DRESSING, NOT A COMBATANT. He appears behind her line and his whole job is this
		//payout. The two King entries stay in the enemy table -- they are what the drawing and the name are
		//read from -- but nothing summons one, and both are marked `setDressing: true` so no bestiary lists
		//them.
		//
		//The doubling is `forEachTarget`, not one `temporaryHealth` over allAllies: an effect resolves its
		//amount ONCE, so "their own Temporary HP" has to be asked per ally. The turn-end half is the
		//`celestialCourt` status, because a backdrop prop has no turn.
		effectArray: [
			{ index: "showBackdropProp", enemy: "celestialKing" },
			{ index: "repeat", times: honeycomb.tuning.chessmaster.kingInvocation.celestial.temporaryHealthCopies, effectArray: [
				{ index: "forEachTarget", over: "allAllies", effectArray: [
					{ index: "temporaryHealth", amount: { index: "stat", of: "target", stat: "temporaryHealth", label: "their Temporary HP" } },
				] },
			] },
			{ index: "applyStatus", status: "celestialCourt", stacks: 1, targetOverride: "owner" },
			//SUPER EXHAUST is not a field -- it is Exhaust plus a permanent removal from the run deck,
			//which is what stops a King being called twice in a run.
			{ index: "removeCardFromDeck", card: "anastasiaKingsInvocation" },
		],
		//SAID SHORT, because the card-fit rule measured the long form at 1.255 of the text box at two sizes.
		text: "The King takes the field. DOUBLE the party's Temporary HP, then each turn end deal that " +
			"much to ALL enemies. Costs 1 less per Pawn dead. Super Exhaust.",
	},
	{
		//THE OTHER KING: the mirror of
		//the Celestial one in every way: that one spends nothing and pays off a wall, this one eats the
		//board and pays off a beating. Which of the two Call the King shuffles in is decided by whichever
		//alignment has more pieces standing when it is used -- so the choice is made on the board, not in
		//a menu, and a tie goes Celestial.
		index: "anastasiaInfernalInvocation",
		kind: "phantom",
		name: "Infernal Invocation",
		characterIndex: "anastasia",
		rarity: "rare",
		costArray: { energy: honeycomb.tuning.chessmaster.kingInvocation.baseCost },
		targetMode: "self",
		layout: "vertical",
		pose: "offense",
		artPath: "cards/art/anastasia-infernal-invocation",
		artOwed: true,
		exhausts: true,
		sfx: "miscSnap",
		effectArray: [
			{ index: "showBackdropProp", enemy: "infernalKing" },
			{ index: "forEachTarget", over: "allPieces", effectArray: [
				{ index: "loseHealth", amount: { index: "math", operation: "divide",
					left: { index: "stat", of: "target", stat: "health", label: "half its health" },
					right: honeycomb.tuning.chessmaster.kingInvocation.infernal.golemHealthLossDivisor } },
			] },
			{ index: "applyStatus", status: "infernalCourt", stacks: 1, targetOverride: "owner" },
			{ index: "removeCardFromDeck", card: "anastasiaInfernalInvocation" },
		],
		//SAID SHORT, because the card-fit rule measured the long form at 1.255 of the text box at two sizes.
		text: "The King takes the field. HALVE every piece's health, then each turn end deal this turn's " +
			"damage to ALL enemies. Costs 1 less per Pawn dead. Super Exhaust.",
	},

	//---------------------------------------------------------------------------------------------------
	//HER BROKEN FORMS.
	//
	//WHAT BROKEN MEANS FOR HER: she is still giving orders, and the board still obeys -- it is what she
	//orders that has gone wrong. The pieces take the damage a broken commander cannot aim, the sacrifices
	//keep happening for her own relief rather than the party's, and the rare is the only thing in her kit
	//that can walk her back from the edge. See reference/BROKEN-01.md; Clemence's set is the model.
	{
		//A BLUNDER IS A MOVE YOU WISH YOU HAD NOT MADE, so playing it does nothing at all. The card is a
		//blank that occupies a hand slot; holding it is what costs.
		//
		//READ AS "an enemy": `randomEnemy`, not an enemy-side golem. Enemy-side PIECES exist only inside
		//her own gauntlet, where she is the boss and holds no broken cards, so a `randomPiece` reading
		//would make the card do nothing in every fight she is actually played in.
		index: "anastasiaAdvanceBroken",
		name: "Blunder",
		characterIndex: "anastasia",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "randomEnemy",
		layout: "horizontal",
		pose: "offense",
		//ONE CROP PER FRAME: this is her catch-all form, dealt into both windows, so it needs a drawing
		//framed for each.
		artPathByLayout: { horizontal: "cards/art/anastasia-blunder", vertical: "cards/art/anastasia-blunder-tall" },
		artPath: "cards/art/anastasia-blunder",
		artOwed: true,
		effectArray: [],
		//Resolved by honeycomb.combat.resolveUnplayedCards as the party's turn closes, for every copy
		//still in hand.
		unplayedEffectArray: [{ index: "damage", amount: 6 }],
		text: "No effect. If this is still in your hand at the end of your turn, deal 6 to a random enemy.",
	},
	{
		//Her sacrifice common, broken: the Pawn still dies, and the relief is hers alone.
		index: "anastasiaInterposeBroken",
		name: "Comfort in Ruin",
		characterIndex: "anastasia",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "ally",
		targetCondition: { index: "hasTag", of: "target", tag: "pawn" },
		layout: "horizontal",
		pose: "offense",
		artPath: "cards/art/anastasia-comfort-in-ruin",
		artOwed: true,
		effectArray: [
			{ index: "loseHealth", amount: 999 },
			{ index: "soothe", amount: 12, targetOverride: "owner" },
		],
		text: "Sacrifice a Pawn. Soothe 12.",
	},
	{
		//THE WAY BACK, and the only one she has. Her Lust becomes five under her health -- which from a
		//broken position is a long fall downward, and from a hurt one is no help at all. `playableCondition`
		//is what makes "unusable if she's below 5 hp" a rule the hand can show rather than a footnote.
		//`setLust`, not soothe: a card that says "becomes" may not have the number modified out from under it.
		index: "anastasiaCheckBroken",
		name: "Cold Calculation",
		characterIndex: "anastasia",
		rarity: "broken",
		costArray: { energy: 2 },
		targetMode: "self",
		layout: "vertical",
		pose: "passive",
		artPath: "cards/art/anastasia-cold-calculation",
		artOwed: true,
		//Below the margin the card subtracts, it would set her Lust to zero and read as a free cure.
		playableCondition: { index: "compare", operation: "greaterOrEqual",
			left: { index: "stat", stat: "health", of: "source", label: "your health" }, right: 5 },
		effectArray: [{ index: "setLust", amount: { index: "math", operation: "subtract",
			left: { index: "stat", stat: "health", of: "source", label: "your health" }, right: 5 } }],
		text: "Your Lust becomes 5 below your health. Unusable below 5 HP.",
	},

	//---------------------------------------------------------------------------------------------------
	//THE GAUNTLET QUEENS' FIFTH MOVE.
	//
	//WHY A COPY AT ALL: a Queen's Petition shuffles an Invocation into the RUN DECK, which is the party's.
	//Played by an enemy that is either refused (a guard against it) or, before the guard, a gift to the
	//person she is fighting. An enemy has no deck to shuffle into, so the payoff has to BE the King rather
	//than a card that calls him -- and that is a different move, which means a different piece carrying it.
	//The rest of each Queen is her twin exactly; the SECOND and FIFTH moves differ.
	//
	//THE SECOND IS A TELEGRAPH AND NOTHING ELSE.
	//The real Queen's Respite and Scheme grant Energy on the next turn, which the enemy side cannot spend
	//-- a dead move that LOOKED like something. This is a dead move that says so, and what it says is the
	//warning: she is four turns from a King and the player can count them.
	{
		index: "gauntletCelestialQueenHerald", name: "Herald", enemyIndex: "gauntletCelestialQueen", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [],
		text: "Prepare, for the king is approaching!",
	},
	{
		index: "gauntletInfernalQueenHerald", name: "Herald", enemyIndex: "gauntletInfernalQueen", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [],
		text: "Prepare, for the king is approaching!",
	},
	{
		index: "gauntletCelestialQueenCoronation", name: "Coronation", enemyIndex: "gauntletCelestialQueen", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "vertical",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [
			{ index: "showBackdropProp", enemy: "celestialKing" },
			{ index: "repeat", times: honeycomb.tuning.chessmaster.kingInvocation.celestial.temporaryHealthCopies, effectArray: [
				{ index: "forEachTarget", over: "allAllies", effectArray: [
					{ index: "temporaryHealth", amount: { index: "stat", of: "target", stat: "temporaryHealth", label: "their Temporary HP" } },
				] },
			] },
			{ index: "applyStatus", status: "celestialCourt", stacks: 1, targetOverride: "self" },
		],
		text: "The Celestial King takes the field. DOUBLE her side's Temporary HP, then each turn end deal that much to ALL foes.",
	},
	{
		index: "gauntletInfernalQueenCoronation", name: "Coronation", enemyIndex: "gauntletInfernalQueen", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "vertical",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [
			{ index: "showBackdropProp", enemy: "infernalKing" },
			{ index: "forEachTarget", over: "allPieces", effectArray: [
				{ index: "loseHealth", amount: { index: "math", operation: "divide",
					left: { index: "stat", of: "target", stat: "health", label: "half its health" },
					right: honeycomb.tuning.chessmaster.kingInvocation.infernal.golemHealthLossDivisor } },
			] },
			{ index: "applyStatus", status: "infernalCourt", stacks: 1, targetOverride: "self" },
		],
		text: "The Infernal King takes the field. HALVE her own pieces, then each turn end deal this turn's damage to ALL foes.",
	},

	//THE CELESTIAL PIECES' OWN MOVES. Two each, walked in order; Celestial opens on the guard. See the note
	//above the Infernal set for what the two alignments are FOR, and for why position is a decision.
	//Celestial is the durable side: it banks more Temporary HP than Infernal and asks nothing of the body
	//in return.
	{
		index: "celestialPawnBulwark", name: "Bulwark", enemyIndex: "celestialPawn", rarity: "enemy",
		costArray: {}, targetMode: "frontAlly", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		sfx: "itemKey",
		effectArray: [{ index: "temporaryHealth", amount: 6 }],
		text: "The ally in front gains 6 Temporary HP.",
	},
	{
		index: "celestialPawnJab", name: "Jab", enemyIndex: "celestialPawn", rarity: "enemy",
		costArray: {}, targetMode: "frontEnemy", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "damage", amount: 4 }],
		text: "Deal 4.",
		sfx: "weaponThrust",
	},
	{
		//IT STRIKES WITH WHATEVER IS BEHIND IT. The only move on either board that reads another piece's
		//telegraph, so the line's ORDER is a number the player can raise: put the Rook behind the Knight
		//and the Knight hits for the Rook's turn as well as its own. Nothing behind it means nothing.
		index: "celestialKnightRelay", name: "Relay", enemyIndex: "celestialKnight", rarity: "enemy",
		costArray: {}, targetMode: "frontEnemy", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "damage", amount: { index: "intentDamage", of: "allyBehind" } }],
		text: "Deal damage equal to what the ally behind this Knight intends.",
		sfx: "weaponThrust",
	},
	{
		index: "celestialKnightSupport", name: "Support", enemyIndex: "celestialKnight", rarity: "enemy",
		costArray: {}, targetMode: "allyAhead", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "temporaryHealth", amount: { index: "stat", of: "target", stat: "temporaryHealth", label: "their Temporary HP" } }],
		text: "DOUBLE the Temporary HP of the ally ahead of this Knight.",
		sfx: "itemKey",
	},
	{
		index: "celestialBishopLitany", name: "Litany", enemyIndex: "celestialBishop", rarity: "enemy",
		costArray: {}, targetMode: "frontAlly", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{
			index: "branch", test: { index: "atRank", of: "source", rank: 0, fromBack: true },
			thenArray: [{ index: "temporaryHealth", amount: 8, targetOverride: "allAllies" }],
			elseArray: [{ index: "temporaryHealth", amount: 8, targetOverride: "frontAlly" }],
		}],
		text: "The ally in front gains 8 Temporary HP. From the back of the party, ALL allies gain it instead.",
	},
	{
		index: "celestialBishopBlessing", name: "Blessing", enemyIndex: "celestialBishop", rarity: "enemy",
		costArray: {}, targetMode: "frontEnemy", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{
			index: "branch", test: { index: "atRank", of: "source", rank: 0, fromBack: true },
			thenArray: [{ index: "applyStatus", status: "weak", stacks: 1, targetOverride: "allEnemies" }],
			elseArray: [{ index: "applyStatus", status: "weak", stacks: 1, targetOverride: "frontEnemy" }],
		}],
		text: "Inflict 1 Weak. From the back of the party, inflict it on ALL enemies instead.",
	},
	{
		//It walls itself, takes the room's attention, and walks to where the blows land. The wall it
		//builds is also the number its other move throws.
		index: "celestialRookImmure", name: "Rampart", enemyIndex: "celestialRook", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [
			{ index: "temporaryHealth", amount: 12 },
			{ index: "applyStatus", status: "taunt", stacks: 1 },
			{ index: "shiftParty", shift: "front", targetOverride: "self" },
		],
		sfx: "itemKey",
		text: "Gains 12 Temporary HP and 1 Taunt, then marches to the front.",
	},
	{
		//Damage equal to tHP to all foes, and it benefits from Strength: a `damage` entry of any amount
		//goes through honeycomb.modifiedDamage like every other, and
		//Strength is one of the hooks folded there. Suite block [114] asserts it rather than assuming it.
		index: "celestialRookBombard", name: "Bombard", enemyIndex: "celestialRook", rarity: "enemy",
		costArray: {}, targetMode: "allEnemies", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "damage", amount: { index: "stat", of: "source", stat: "temporaryHealth", label: "its Temporary HP" } }],
		text: "Deal damage to ALL enemies equal to this Rook's Temporary HP.",
		sfx: "weaponClang",
	},

	{
		//FIVE MOVES, WALKED IN ORDER. A Queen kept alive five turns pays out
		//a King's Invocation; killing her is how the other side stops that, which is the whole point.
		index: "celestialQueenBenediction", name: "Benediction", enemyIndex: "celestialQueen", rarity: "enemy",
		costArray: {}, targetMode: "alliesBehind", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "temporaryHealth", amount: 4 }],
		text: "Every ally behind this Queen gains 4 Temporary HP.",
	},
	{
		index: "celestialQueenRespite", name: "Respite", enemyIndex: "celestialQueen", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "applyStatus", status: "energised", stacks: 1 }],
		text: "Gain 1 Energy on your next turn.",
	},
	{
		index: "celestialQueenExalt", name: "Exalt", enemyIndex: "celestialQueen", rarity: "enemy",
		costArray: {}, targetMode: "alliesAhead", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "applyStatus", status: "strength", stacks: 1 }],
		sfx: "magicCharge",
		text: "Every ally in front of this Queen gains 1 Strength.",
	},
	{
		index: "celestialQueenConversion", name: "Conversion", enemyIndex: "celestialQueen", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "forEachTarget", over: "allPieces", effectArray: [
			{ index: "invert", condition: { index: "hasTag", of: "target", tag: "infernal" } },
		] }],
		sfx: "magicCharge",
		text: "Every allied Infernal piece is inverted.",
	},
	{
		index: "celestialQueenPetition", name: "Petition", enemyIndex: "celestialQueen", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "vertical",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "addCardToDeck", card: "anastasiaKingsInvocation", intoDrawPile: true }],
		sfx: "buffParty",
		text: "Shuffle a King's Invocation into your deck, permanently.",
	},
	{
		index: "celestialKingCastleDoctrine", name: "Castle Doctrine", enemyIndex: "celestialKing", rarity: "enemy",
		costArray: {}, targetMode: "allAllies", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "temporaryHealth", amount: 12 }],
		text: "All allies gain 12 Temporary HP.",
	},
	{
		index: "celestialKingCoronation", name: "Coronation", enemyIndex: "celestialKing", rarity: "enemy",
		costArray: {}, targetMode: "allAllies", layout: "horizontal",
		artPath: "cards/art/anastasia-piece", artOwed: true,
		effectArray: [{ index: "applyStatus", status: "strength", stacks: 2 }],
		text: "All allies gain 2 Strength.",
	},

	//THE GAUNTLET'S BOSS: ANASTASIA HERSELF. Her kit, mirrored as enemy
	//moves and picked at RANDOM -- an opponent whose plan cannot be read is the inverse of playing her.
	//Built from the verbs her own cards use. She snaps when she commands and crouches when she buffs, the
	//same rule as her pool, so every one names its `pose`.
	{
		index: "gauntletAnastasiaCheck", name: "Check", enemyIndex: "gauntletAnastasia", rarity: "enemy",
		costArray: {}, targetMode: "frontEnemy", layout: "horizontal", pose: "offense",
		artPath: "cards/art/anastasia-check", artOwed: true,
		//SHE TEACHES A LUST TAG LIKE EVERY OTHER ENEMY. The roster pins the enemies that teach none at
		//exactly two (tools/lust-share.js, suite block [111]); her pieces are left out of that count as
		//golems, but she is not one, and calling her one to dodge the rule would be a lie in the tag table.
		//Being put in check strips composure: Exposure.
		tagArray: ["exposure"],
		effectArray: [{ index: "damage", amount: 6 }, { index: "lust", amount: 5 }],
		text: "Deal 6. Inflict 5 Lust.",
		sfx: "miscSnap",
	},
	{
		index: "gauntletAnastasiaDevelop", name: "Develop", enemyIndex: "gauntletAnastasia", rarity: "enemy",
		costArray: {}, targetMode: "self", layout: "horizontal", pose: "offense",
		artPath: "cards/art/anastasia-develop", artOwed: true,
		effectArray: [{ index: "summon", enemy: "infernalPawn", team: "own" }],
		text: "Summon an Infernal Pawn.",
		sfx: "miscSnap",
	},
	{
		index: "gauntletAnastasiaPromotion", name: "Promotion", enemyIndex: "gauntletAnastasia", rarity: "enemy",
		costArray: {}, targetMode: "allAllies", layout: "horizontal", pose: "offense",
		artPath: "cards/art/anastasia-knights-tour", artOwed: true,
		effectArray: [{ index: "promote", to: "infernalKnight", fromTag: "pawn", limit: 1 }],
		text: "Promote a Pawn into a Knight.",
		sfx: "miscSnap",
	},
	{
		index: "gauntletAnastasiaQueening", name: "Queening", enemyIndex: "gauntletAnastasia", rarity: "enemy",
		costArray: {}, targetMode: "allAllies", layout: "horizontal", pose: "offense",
		artPath: "cards/art/anastasia-queening", artOwed: true,
		effectArray: [{ index: "promote", to: "infernalQueen", fromTag: "pawn", limit: 1 }],
		text: "Promote a Pawn into a Queen.",
		sfx: "miscSnap",
	},
	{
		index: "gauntletAnastasiaStudy", name: "Study the Board", enemyIndex: "gauntletAnastasia", rarity: "enemy",
		costArray: {}, targetMode: "allAllies", layout: "horizontal", pose: "passive",
		artPath: "cards/art/anastasia-study-the-board", artOwed: true,
		effectArray: [{ index: "applyStatus", status: "strength", stacks: 1 }],
		text: "All allies gain 1 Strength.",
	},
	{
		index: "gauntletAnastasiaHold", name: "Hold the File", enemyIndex: "gauntletAnastasia", rarity: "enemy",
		costArray: {}, targetMode: "allAllies", layout: "horizontal", pose: "passive",
		artPath: "cards/art/anastasia-hold-the-file", artOwed: true,
		effectArray: [{ index: "temporaryHealth", amount: 5 }],
		text: "All allies gain 5 Temporary HP.",
	},

	//-------------------------------------------------------------------------------------------
	//THE CARD POOL (MECHANICS-01.md). Each character's cards are grouped as core first, then one
	//block per SISTER MECHANIC; `archetype` names the block (honeycomb.archetypeArray), which is what an
	//outfit's archetypeWeightArray reads. Starter cards keep their old indices, so saves and the tests
	//written against them still recognise them.
	//-------------------------------------------------------------------------------------------

	//=================================================================================================
	//THE SESSION-33 POOL (CARD-POOL-01): per character, the default outfit's sister (3 C + 2 R) and each alt
	//outfit's (3 C + 1 R from the start, then 3 C + 2 R once the outfit is unlocked: one any-pool rare, one
	//worn-only). `offerCondition` carries the gate. Written from !designDocs/honeycomb/rework/cards/CARD-POOL-01.md 4.
	//=================================================================================================
	//--- brienne -------------------------------------------------------------------------------
	{
		index: "brienneKeptWord",
		name: "Kept Word",
		characterIndex: "brienne",
		archetype: "oath",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/brienne-kept-word",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "damage",
				amount: {
					index: "math",
					operation: "add",
					left: 6,
					right: {
						index: "stat",
						stat: "carriedTemporaryHealth",
						of: "source",
						label: "the Temporary HP you carried into this turn",
					},
				},
			},
		],
		upgradeArray: [
			{
				name: "Kept Word+",
				effectArray: [
					{
						index: "damage",
						amount: {
							index: "math",
							operation: "add",
							left: 8,
							right: {
								index: "stat",
								stat: "carriedTemporaryHealth",
								of: "source",
								label: "the Temporary HP you carried into this turn",
							},
						},
					},
				],
			},
		],
	},
	{
		index: "brienneOathOfIron",
		name: "Oath of Iron",
		characterIndex: "brienne",
		archetype: "oath",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/brienne-oath-of-iron",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "temporaryHealth", amount: 6 }, { index: "applyStatus", status: "entrenched", stacks: 1 }],
		upgradeArray: [
			{
				name: "Oath of Iron+",
				effectArray: [{ index: "temporaryHealth", amount: 8 }, { index: "applyStatus", status: "entrenched", stacks: 1 }],
			},
		],
	},
	{
		index: "brienneWeighTheCost",
		name: "Weigh the Cost",
		characterIndex: "brienne",
		archetype: "oath",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/brienne-weigh-the-cost",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "chooseOption",
				prompt: "Weigh the cost how?",
				optionArray: [
					{
						index: "guard",
						name: "Hold",
						effectArray: [{ index: "temporaryHealth", amount: 9 }],
						description: "Gain 9 Temporary HP.",
					},
					{
						index: "spend",
						name: "Spend",
						effectArray: [
							{
								index: "branch",
								test: { index: "mechanicAtLeast", mechanic: "resolve", amount: 8 },
								thenArray: [
									{ index: "spendMechanic", mechanic: "resolve", amount: 8 },
									{ index: "gainResource", resource: "energy", amount: 1 },
									{ index: "drawCards", amount: 2 },
								],
								elseArray: [],
							},
						],
						description: "Spend 8 Resolve: gain 1 Energy and draw 2 cards.",
					},
				],
			},
		],
		text: "Choose one: gain 9 Temporary HP; or spend 8 Resolve to gain 1 Energy and draw 2 cards.",
		upgradeArray: [
			{
				name: "Weigh the Cost+",
				effectArray: [
					{
						index: "chooseOption",
						prompt: "Weigh the cost how?",
						optionArray: [
							{
								index: "guard",
								name: "Hold",
								effectArray: [{ index: "temporaryHealth", amount: 12 }],
								description: "Gain 12 Temporary HP.",
							},
							{
								index: "spend",
								name: "Spend",
								effectArray: [
									{
										index: "branch",
										test: { index: "mechanicAtLeast", mechanic: "resolve", amount: 8 },
										thenArray: [
											{ index: "spendMechanic", mechanic: "resolve", amount: 8 },
											{ index: "gainResource", resource: "energy", amount: 1 },
											{ index: "drawCards", amount: 2 },
										],
										elseArray: [],
									},
								],
								description: "Spend 8 Resolve: gain 1 Energy and draw 2 cards.",
							},
						],
					},
				],
				text: "Choose one: gain 12 Temporary HP; or spend 8 Resolve to gain 1 Energy and draw 2 cards.",
			},
		],
	},
	{
		index: "brienneUnbrokenOath",
		name: "Unbroken Oath",
		characterIndex: "brienne",
		archetype: "oath",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/brienne-unbroken-oath",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "applyStatus", status: "oathbound", stacks: 1 }],
		text: "At the start of your turn, if you carried Temporary HP into it, deal 6 damage to the front enemy and draw 1 card.",
		upgradeArray: [{ name: "Unbroken Oath+", costArray: { energy: 1 } }],
	},
	{
		index: "briennePromiseKept",
		name: "Promise Kept",
		characterIndex: "brienne",
		archetype: "oath",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/brienne-promise-kept",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "damage",
				amount: {
					index: "math",
					operation: "multiply",
					left: {
						index: "stat",
						stat: "carriedTemporaryHealth",
						of: "source",
						label: "the Temporary HP you carried into this turn",
					},
					right: 2,
				},
			},
		],
		text: "Deal twice the Temporary HP you carried into this turn as damage.",
		upgradeArray: [{ name: "Promise Kept+", costArray: { energy: 0 } }],
	},
	{
		index: "brienneShieldBash",
		name: "Shield Bash",
		characterIndex: "brienne",
		archetype: "armament",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/brienne-bash",
		effectArray: [
			{ index: "temporaryHealth", amount: 5, targetOverride: "owner" },
			{
				index: "damage",
				amount: {
					index: "math",
					operation: "divide",
					left: { index: "stat", stat: "temporaryHealth", of: "source", label: "your Temporary HP" },
					right: 2,
				},
			},
		],
		text: "Gain 5 Temporary HP, then deal damage equal to half your Temporary HP.",
		upgradeArray: [
			{
				name: "Shield Bash+",
				effectArray: [
					{ index: "temporaryHealth", amount: 7, targetOverride: "owner" },
					{
						index: "damage",
						amount: {
							index: "math",
							operation: "divide",
							left: { index: "stat", stat: "temporaryHealth", of: "source", label: "your Temporary HP" },
							right: 2,
						},
					},
				],
				text: "Gain 8 Temporary HP, then deal damage equal to half your Temporary HP.",
			},
		],
	},
	{
		index: "brienneTemperedPlate",
		name: "Tempered Plate",
		characterIndex: "brienne",
		archetype: "armament",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/brienne-weight",
		effectArray: [{ index: "temporaryHealth", amount: 6 }, { index: "applyStatus", status: "armament", stacks: 1 }],
		upgradeArray: [
			{
				name: "Tempered Plate+",
				effectArray: [{ index: "temporaryHealth", amount: 8 }, { index: "applyStatus", status: "armament", stacks: 1 }],
			},
		],
	},
	{
		index: "brienneLendSteel",
		name: "Lend Steel",
		characterIndex: "brienne",
		archetype: "armament",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/brienne-bash",
		effectArray: [{ index: "temporaryHealth", amount: 7 }, { index: "applyStatus", status: "armament", stacks: 1 }],
		upgradeArray: [
			{
				name: "Lend Steel+",
				effectArray: [{ index: "temporaryHealth", amount: 9 }, { index: "applyStatus", status: "armament", stacks: 1 }],
			},
		],
	},
	{
		index: "brienneCrushingWeight",
		brokenCard: "brienneWeightOfRegret",
		name: "Crushing Weight",
		characterIndex: "brienne",
		archetype: "armament",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/brienne-weight",
		effectArray: [{
			index: "damage",
			amount: {
				index: "math", operation: "add", left: 4,
				right: { index: "math", operation: "divide", left: { index: "stat", stat: "temporaryHealth", of: "source" }, right: 2 },
			},
		}],
		text: "Deal {damage:4} damage plus half your Temporary HP to ALL enemies.",
		upgradeArray: [
			{
				name: "Crushing Weight+",
				effectArray: [{
					index: "damage",
					amount: { index: "math", operation: "add", left: 7, right: { index: "stat", stat: "temporaryHealth", of: "source" } },
				}],
				text: "Deal {damage:7} damage plus your Temporary HP to ALL enemies.",
			},
		],
	},
	{
		index: "brienneRiposte",
		name: "Riposte",
		characterIndex: "brienne",
		archetype: "armament",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/brienne-riposte",
		offerCondition: { index: "outfitUnlocked", outfit: "siegeplate" },
		effectArray: [
			{
				index: "damage",
				amount: { index: "stat", stat: "temporaryHealth", of: "source", label: "your Temporary HP" },
			},
			{
				index: "removeTemporaryHealth",
				amount: {
					index: "math",
					operation: "divide",
					left: { index: "stat", stat: "temporaryHealth", of: "source" },
					right: 2,
				},
				targetOverride: "owner",
			},
		],
		text: "Deal damage equal to your Temporary HP, then lose half of it.",
		//TWO WAYS TO GROW: hit harder, or keep the gold.
		upgradePathArray: [
			{
				index: "riposteEdge",
				name: "Riposte+ (Edge)",
				description: "Hits for your Temporary HP plus 5, and still spends half of it.",
				upgradeArray: [{
					name: "Riposte+",
					effectArray: [
						{ index: "damage", amount: { index: "math", operation: "add", left: 5,
							right: { index: "stat", stat: "temporaryHealth", of: "source", label: "your Temporary HP" } } },
						{ index: "removeTemporaryHealth", amount: { index: "math", operation: "divide",
							left: { index: "stat", stat: "temporaryHealth", of: "source" }, right: 2 }, targetOverride: "owner" },
					],
					text: "Deal {damage:5} damage plus your Temporary HP, then lose half of it.",
				}],
			},
			{
				index: "riposteGuard",
				name: "Riposte+ (Guard)",
				description: "Hits for your Temporary HP and keeps it: you stay behind the gold.",
				upgradeArray: [{
					name: "Riposte+",
					effectArray: [{ index: "damage", amount: { index: "stat", stat: "temporaryHealth", of: "source", label: "your Temporary HP" } }],
					text: "Deal damage equal to your Temporary HP.",
				}],
			},
		],
	},
	{
		index: "briennePlatedCharge",
		name: "Plated Charge",
		characterIndex: "brienne",
		archetype: "armament",
		rarity: "common",
		costArray: { energy: 2 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/brienne-plated-charge",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "siegeplate" },
		effectArray: [
			{ index: "shiftParty", shift: "front", targetOverride: "owner" },
			{ index: "temporaryHealth", amount: 8, targetOverride: "owner" },
			{
				index: "damage",
				amount: { index: "stat", stat: "temporaryHealth", of: "source", label: "your Temporary HP" },
			},
		],
		text: "Move to the front. Gain 8 Temporary HP. Deal damage equal to your Temporary HP.",
		upgradeArray: [
			{
				name: "Plated Charge+",
				effectArray: [
					{ index: "shiftParty", shift: "front", targetOverride: "owner" },
					{ index: "temporaryHealth", amount: 11, targetOverride: "owner" },
					{
						index: "damage",
						amount: { index: "stat", stat: "temporaryHealth", of: "source", label: "your Temporary HP" },
					},
				],
				text: "Move to the front. Gain 11 Temporary HP. Deal damage equal to your Temporary HP.",
			},
		],
	},
	{
		index: "brienneHeavySwing",
		name: "Heavy Swing",
		characterIndex: "brienne",
		archetype: "armament",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/brienne-heavy-swing",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "siegeplate" },
		effectArray: [
			{ index: "damage", amount: 8 },
			{
				index: "damage",
				amount: 8,
				condition: {
					index: "compare",
					operation: "greaterOrEqual",
					left: { index: "stat", stat: "temporaryHealth", of: "source" },
					right: 10,
					//Asked as the card is played, before the first hit: Thorns on the target must not take it away
					//mid-swing.
					checkedAtStart: true,
				},
			},
		],
		text: "Deal {damage:8} damage. If you have 10 or more Temporary HP, deal {damage:8} again.",
		upgradeArray: [
			{
				name: "Heavy Swing+",
				effectArray: [
					{ index: "damage", amount: 11 },
					{
						index: "damage",
						amount: 11,
						condition: {
							index: "compare",
							operation: "greaterOrEqual",
							left: { index: "stat", stat: "temporaryHealth", of: "source" },
							right: 10,
							checkedAtStart: true,
						},
					},
				],
				text: "Deal {damage:11} damage. If you have 10 or more Temporary HP, deal {damage:11} again.",
			},
		],
	},
	{
		index: "brienneForgeTheLine",
		name: "Forge the Line",
		characterIndex: "brienne",
		archetype: "armament",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/brienne-forge-the-line",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "siegeplate" },
		effectArray: [{ index: "temporaryHealth", amount: 6 }, { index: "applyStatus", status: "armament", stacks: 1 }],
		upgradeArray: [
			{
				name: "Forge the Line+",
				effectArray: [{ index: "temporaryHealth", amount: 8 }, { index: "applyStatus", status: "armament", stacks: 1 }],
			},
		],
	},
	{
		index: "brienneUnstoppable",
		name: "Unstoppable",
		characterIndex: "brienne",
		archetype: "armament",
		type: "passive",
		rarity: "rare",
		offerCondition: { index: "wearsOutfit", outfit: "siegeplate" },
		costArray: { energy: 2 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/brienne-rally",
		effectArray: [{ index: "applyStatus", status: "momentum", stacks: 1 }],
		text: "Whenever you gain Temporary HP, deal 4 damage to the front enemy.",
		upgradeArray: [
			{ name: "Unstoppable+", costArray: { energy: 1 } },
		],
	},
	{
		index: "brienneIntercept",
		name: "Intercept",
		characterIndex: "brienne",
		archetype: "sentinel",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/brienne-challenge",
		effectArray: [
			{ index: "temporaryHealth", amount: 8 },
			{ index: "applyStatus", status: "taunt", stacks: 1, targetOverride: "owner" },
		],
		text: "An ally gains 8 Temporary HP. Brienne gains 1 Taunt.",
		upgradeArray: [
			{
				name: "Intercept+",
				effectArray: [
					{ index: "temporaryHealth", amount: 11 },
					{ index: "applyStatus", status: "taunt", stacks: 1, targetOverride: "owner" },
				],
				text: "An ally gains 11 Temporary HP. Brienne gains 1 Taunt.",
			},
		],
	},
	{
		index: "brienneChallenge",
		name: "Challenge",
		characterIndex: "brienne",
		archetype: "sentinel",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		//A taunter steps up to take the hits.
		partyShift: "front",
		layout: "horizontal",
		artPath: "cards/art/brienne-challenge",
		effectArray: [{ index: "temporaryHealth", amount: 10 }, { index: "applyStatus", status: "taunt", stacks: 1 }],
		upgradeArray: [
			{
				name: "Challenge+",
				effectArray: [{ index: "temporaryHealth", amount: 13 }, { index: "applyStatus", status: "taunt", stacks: 1 }],
			},
		],
	},
	{
		index: "brienneIronRetort",
		name: "Iron Retort",
		characterIndex: "brienne",
		archetype: "sentinel",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/brienne-thorns",
		effectArray: [{ index: "temporaryHealth", amount: 5 }, { index: "applyStatus", status: "retort", stacks: 2 }],
		upgradeArray: [
			{
				name: "Iron Retort+",
				effectArray: [{ index: "temporaryHealth", amount: 7 }, { index: "applyStatus", status: "retort", stacks: 3 }],
			},
		],
	},
	{
		index: "brienneHoldTheLine",
		name: "Stand Fast",
		characterIndex: "brienne",
		archetype: "sentinel",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/brienne-wall",
		effectArray: [{ index: "applyStatus", status: "standFast", stacks: 1 }],
		text: "At the start of your turn, gain 5 Temporary HP.",
		upgradeArray: [{ name: "Stand Fast+", costArray: { energy: 0 } }],
	},
	{
		index: "brienneThornArmour",
		name: "Thorn Armour",
		characterIndex: "brienne",
		archetype: "sentinel",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/brienne-thorns",
		offerCondition: { index: "outfitUnlocked", outfit: "bastion" },
		effectArray: [{ index: "temporaryHealth", amount: 6 }, { index: "applyStatus", status: "thorns", stacks: 3 }],
		upgradeArray: [
			{
				name: "Thorn Armour+",
				effectArray: [{ index: "temporaryHealth", amount: 8 }, { index: "applyStatus", status: "thorns", stacks: 4 }],
			},
		],
	},
	{
		//SUFFER THE BLOWS, replacing Take the Hit.
		//
		//TAUNT IS A DURATION, NOT A QUANTITY, so "taunt equal to your tHP" cannot be written as it stands:
		//a stack of Taunt is a TURN of it, and 30 Temporary HP would buy thirty turns. Taunt already does
		//what it needs to: an enemy hit for 3 lands for 9 instead against a taunting Brienne, measured. So
		//the card is built with one turn of Taunt, and the Temporary HP is what carries the number. If
		//Taunt is ever rebuilt as a pool of points, this is the card whose text changes back.
		//
		//THE TAUNT COMES FIRST, then the Temporary HP. The Temporary HP is counted off every enemy standing rather than
		//only the ones intending to attack, since a 0-cost rare should be worth playing on an empty bar.
		index: "brienneTakeTheHit",
		name: "Suffer the Blows",
		characterIndex: "brienne",
		archetype: "sentinel",
		rarity: "rare",
		costArray: {},
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/brienne-take-the-hit",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "bastion" },
		effectArray: [
			{ index: "applyStatus", status: "taunt", stacks: 1 },
			{
				index: "temporaryHealth",
				amount: { index: "math", operation: "multiply", left: { index: "count", collection: "livingEnemies" }, right: 10 },
			},
		],
		text: "Gain 1 Taunt. Gain 10 Temporary HP for each enemy.",
		upgradeArray: [
			{
				name: "Suffer the Blows+",
				effectArray: [
					{ index: "applyStatus", status: "taunt", stacks: 1 },
					{
						index: "temporaryHealth",
						amount: { index: "math", operation: "multiply", left: { index: "count", collection: "livingEnemies" }, right: 14 },
					},
				],
				text: "Gain 1 Taunt. Gain 14 Temporary HP for each enemy.",
			},
		],
	},
	{
		index: "brienneBulwark",
		name: "Bulwark",
		characterIndex: "brienne",
		archetype: "sentinel",
		rarity: "common",
		costArray: { energy: 2 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/brienne-bulwark",
		brokenCard: "brienneHuddle",
		offerCondition: { index: "outfitUnlocked", outfit: "bastion" },
		effectArray: [{ index: "temporaryHealth", amount: 7 }],
		upgradeArray: [{ name: "Bulwark+", effectArray: [{ index: "temporaryHealth", amount: 9 }] }],
	},
	{
		index: "brienneRally",
		name: "Rally",
		characterIndex: "brienne",
		archetype: "sentinel",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "vertical",
		artPath: "cards/art/brienne-rally",
		offerCondition: { index: "outfitUnlocked", outfit: "bastion" },
		effectArray: [
			{
				index: "applyStatus",
				status: "strength",
				stacks: {
					index: "math",
					operation: "add",
					left: 1,
					right: {
						index: "math",
						operation: "min",
						left: {
							index: "math",
							operation: "divide",
							left: { index: "stat", stat: "temporaryHealth", of: "source" },
							right: 8,
						},
						right: 2,
					},
				},
			},
		],
		text: "ALL allies gain 1 Strength, plus 1 per 8 Temporary HP you hold (at most 3).",
		upgradeArray: [{ name: "Rally+", costArray: { energy: 0 } }],
	},
	{
		index: "brienneShieldWall",
		name: "Shield Wall",
		characterIndex: "brienne",
		archetype: "sentinel",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "owner",
		partyShift: "front",
		layout: "vertical",
		artPath: "cards/art/brienne-wall",
		offerCondition: { index: "wearsOutfit", outfit: "bastion" },
		effectArray: [
			{ index: "temporaryHealth", amount: 14 },
			{ index: "applyStatus", status: "taunt", stacks: 2 },
			{ index: "temporaryHealth", amount: 5, targetOverride: "otherAllies" },
		],
		upgradeArray: [
			{
				name: "Shield Wall+",
				effectArray: [
					{ index: "temporaryHealth", amount: 19 },
					{ index: "applyStatus", status: "taunt", stacks: 3 },
					{ index: "temporaryHealth", amount: 7, targetOverride: "otherAllies" },
				],
			},
		],
	},
	{
		index: "brienneTithe",
		name: "Tithe",
		characterIndex: "brienne",
		archetype: "tithe",
		rarity: "common",
		costArray: { energy: 0 },
		targetMode: "owner",
		playableCondition: { index: "compare", operation: "greaterOrEqual", left: { index: "stat", stat: "temporaryHealth", of: "source" }, right: 6 },
		layout: "horizontal",
		artPath: "cards/art/brienne-tithe",
		effectArray: [
			{ index: "spendTemporaryHealth", amount: 6 },
			{
				index: "gainResource",
				resource: "energy",
				amount: 1,
				condition: {
					index: "compare",
					operation: "greaterOrEqual",
					left: { index: "tally", key: "temporarySpent" },
					right: 6,
				},
			},
		],
		text: "Spend 6 of your Temporary HP: gain 1 Energy.",
		upgradeArray: [
			{
				name: "Tithe+",
				effectArray: [
					{ index: "spendTemporaryHealth", amount: 6 },
					{
						index: "gainResource",
						resource: "energy",
						amount: 1,
						condition: {
							index: "compare",
							operation: "greaterOrEqual",
							left: { index: "tally", key: "temporarySpent" },
							right: 6,
						},
					},
					{
						index: "drawCards",
						amount: 1,
						condition: {
							index: "compare",
							operation: "greaterOrEqual",
							left: { index: "tally", key: "temporarySpent" },
							right: 6,
						},
					},
				],
				text: "Spend 6 of your Temporary HP: gain 1 Energy and draw 1 card.",
			},
		],
	},
	{
		index: "brienneGildedStrike",
		name: "Gilded Strike",
		characterIndex: "brienne",
		archetype: "tithe",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/brienne-strike",
		effectArray: [
			{ index: "spendTemporaryHealth", targetOverride: "owner" },
			{ index: "damage", amount: { index: "math", operation: "multiply", left: { index: "tally", key: "temporarySpent" }, right: 2 } },
		],
		text: "Spend all your Temporary HP. Deal twice that much damage.",
		upgradeArray: [
			{
				name: "Gilded Strike+",
				effectArray: [
					{ index: "spendTemporaryHealth", targetOverride: "owner" },
					{ index: "damage", amount: { index: "math", operation: "add", left: 4, right: { index: "math", operation: "multiply", left: { index: "tally", key: "temporarySpent" }, right: 2 } } },
				],
				text: "Spend all your Temporary HP. Deal {damage:4} damage plus twice that much.",
			},
		],
	},
	{
		index: "brienneRansom",
		name: "Ransom",
		characterIndex: "brienne",
		archetype: "tithe",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/brienne-tithe",
		effectArray: [
			{ index: "spendTemporaryHealth", amount: 8, step: 4 },
			{
				index: "drawCards",
				amount: { index: "math", operation: "divide", left: { index: "tally", key: "temporarySpent" }, right: 4 },
			},
			{
				index: "gainResource",
				resource: "energy",
				amount: 1,
				condition: {
					index: "compare",
					operation: "greaterOrEqual",
					left: { index: "tally", key: "temporarySpent" },
					right: 8,
				},
			},
		],
		text: "Spend up to 8 of an ally's Temporary HP, 4 at a time. Draw 1 card for every 4 spent; if all 8, gain 1 Energy.",
		upgradeArray: [
			{
				name: "Ransom+",
				effectArray: [
					{ index: "spendTemporaryHealth", amount: 12, step: 4 },
					{
						index: "drawCards",
						amount: { index: "math", operation: "divide", left: { index: "tally", key: "temporarySpent" }, right: 4 },
					},
					{
						index: "gainResource",
						resource: "energy",
						amount: 1,
						condition: {
							index: "compare",
							operation: "greaterOrEqual",
							left: { index: "tally", key: "temporarySpent" },
							right: 8,
						},
					},
				],
				text: "Spend up to 12 of an ally's Temporary HP, 4 at a time. Draw 1 card for every 4 spent; if 8 or more, gain 1 Energy.",
			},
		],
	},
	{
		index: "briennePayTheToll",
		name: "Pay the Toll",
		characterIndex: "brienne",
		archetype: "tithe",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/brienne-pay-the-toll",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "spendTemporaryHealth", targetOverride: "owner" },
			{
				index: "applyStatus",
				status: "fleetingStrength",
				stacks: { index: "math", operation: "divide", left: { index: "tally", key: "temporarySpent" }, right: 4 },
			},
		],
		text: "Spend all your Temporary HP. ALL allies gain 1 Fleeting Strength for every 4 spent.",
		upgradeArray: [
			{
				name: "Pay the Toll+",
				effectArray: [
					{ index: "spendTemporaryHealth", targetOverride: "owner" },
					{
						index: "applyStatus",
						status: "fleetingStrength",
						stacks: { index: "math", operation: "divide", left: { index: "tally", key: "temporarySpent" }, right: 3 },
					},
				],
				text: "Spend all your Temporary HP. ALL allies gain 1 Fleeting Strength for every 3 spent.",
			},
		],
	},
	{
		index: "brienneAlms",
		name: "Alms",
		characterIndex: "brienne",
		archetype: "tithe",
		rarity: "common",
		offerCondition: { index: "outfitUnlocked", outfit: "almoner" },
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/brienne-alms",
		effectArray: [
			{ index: "spendTemporaryHealth", targetOverride: "owner" },
			{ index: "soothe", amount: { index: "tally", key: "temporarySpent" } },
		],
		text: "Spend all your Temporary HP. ALL allies lose that much Lust.",
		upgradeArray: [
			{
				name: "Alms+",
				effectArray: [
					{ index: "spendTemporaryHealth", targetOverride: "owner" },
					{ index: "soothe", amount: { index: "math", operation: "add", left: 3, right: { index: "tally", key: "temporarySpent" } } },
				],
				text: "Spend all your Temporary HP. ALL allies lose 3 plus that much Lust.",
			},
		],
	},
	{
		index: "briennePayInKind",
		name: "Pay in Kind",
		characterIndex: "brienne",
		archetype: "tithe",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/brienne-pay-in-kind",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "almoner" },
		effectArray: [
			{ index: "spendTemporaryHealth", amount: 6, targetOverride: "owner" },
			{
				index: "damage",
				amount: 16,
				condition: {
					index: "compare",
					operation: "greaterOrEqual",
					left: { index: "tally", key: "temporarySpent" },
					right: 6,
				},
			},
		],
		text: "Spend 6 of your Temporary HP: deal {damage:16} damage.",
		upgradeArray: [
			{
				name: "Pay in Kind+",
				effectArray: [
					{ index: "spendTemporaryHealth", amount: 6, targetOverride: "owner" },
					{
						index: "damage",
						amount: 21,
						condition: {
							index: "compare",
							operation: "greaterOrEqual",
							left: { index: "tally", key: "temporarySpent" },
							right: 6,
						},
					},
				],
				text: "Spend 6 of your Temporary HP: deal {damage:21} damage.",
			},
		],
	},
	{
		index: "brienneLargesse",
		name: "Largesse",
		characterIndex: "brienne",
		archetype: "tithe",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/brienne-largesse",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "almoner" },
		effectArray: [
			{ index: "spendTemporaryHealth", targetOverride: "owner" },
			{
				index: "temporaryHealth",
				amount: { index: "math", operation: "add", left: { index: "tally", key: "temporarySpent" }, right: 4 },
			},
		],
		text: "Spend all your Temporary HP. An ally gains that much plus 4.",
		upgradeArray: [
			{
				name: "Largesse+",
				effectArray: [
					{ index: "spendTemporaryHealth", targetOverride: "owner" },
					{
						index: "temporaryHealth",
						amount: { index: "math", operation: "add", left: { index: "tally", key: "temporarySpent" }, right: 8 },
					},
				],
				text: "Spend all your Temporary HP. An ally gains that much plus 8.",
			},
		],
	},
	{
		index: "brienneTribute",
		name: "Tribute",
		characterIndex: "brienne",
		archetype: "tithe",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "frontEnemy",
		layout: "horizontal",
		artPath: "cards/art/brienne-tribute",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "almoner" },
		effectArray: [
			{ index: "spendTemporaryHealth", targetOverride: "allAllies" },
			{ index: "damage", amount: { index: "tally", key: "temporarySpent" }, ignoresStrength: true },
			{
				index: "drawCards",
				amount: { index: "math", operation: "divide", left: { index: "tally", key: "temporarySpent" }, right: 10 },
			},
		],
		text: "Every ally spends all their Temporary HP. Deal that much damage to the front enemy, and draw 1 card for every 10 spent.",
		upgradeArray: [{ name: "Tribute+", costArray: { energy: 0 } }],
	},
	{
		//ENHANCES THE PRIMITIVE: the halving itself becomes a payment.
		index: "brienneReliquary",
		name: "Reliquary",
		characterIndex: "brienne",
		archetype: "tithe",
		type: "passive",
		rarity: "rare",
		offerCondition: { index: "wearsOutfit", outfit: "almoner" },
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/brienne-alms",
		effectArray: [{ index: "applyStatus", status: "gilded", stacks: 1 }],
		text: "When your Temporary HP decays, gain 1 Energised per 6 lost (at most 2 a turn).",
		upgradeArray: [
			{ name: "Reliquary+", costArray: { energy: 0 } },
		],
	},
	//--- nettle -------------------------------------------------------------------------------
	{
		index: "nettleQuickenRot",
		name: "Quicken Rot",
		characterIndex: "nettle",
		archetype: "timing",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-quicken-rot",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "triggerStatus", status: "poison" }, { index: "applyStatus", status: "poison", stacks: 2 }],
		upgradeArray: [
			{
				name: "Quicken Rot+",
				effectArray: [{ index: "triggerStatus", status: "poison" }, { index: "applyStatus", status: "poison", stacks: 3 }],
			},
		],
	},
	{
		index: "nettleVenomSac",
		name: "Venom Sac",
		characterIndex: "nettle",
		archetype: "timing",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-venom-sac",
		//Art owed: this card has no art yet.
		artOwed: true,
		exhausts: true,
		effectArray: [{ index: "applyStatus", status: "poison", stacks: 7 }],
		upgradeArray: [{ name: "Venom Sac+", effectArray: [{ index: "applyStatus", status: "poison", stacks: 9 }] }],
	},
	{
		index: "nettleGraveChoice",
		name: "Grave Choice",
		characterIndex: "nettle",
		archetype: "timing",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-grave-choice",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "chooseOption",
				prompt: "Which harvest?",
				optionArray: [
					{
						index: "poison",
						name: "Rot",
						effectArray: [{ index: "applyStatus", status: "poison", stacks: 5 }],
						description: "Inflict 5 Poison.",
					},
					{
						index: "souls",
						name: "Reap",
						effectArray: [
							{
								index: "branch",
								test: { index: "mechanicAtLeast", mechanic: "harvest", amount: 3 },
								thenArray: [
									{ index: "spendMechanic", mechanic: "harvest", amount: 3 },
									{ index: "gainResource", resource: "energy", amount: 1 },
									{ index: "drawCards", amount: 2 },
								],
								elseArray: [],
							},
						],
						description: "Spend 3 Souls: gain 1 Energy and draw 2 cards.",
					},
				],
			},
		],
		text: "Choose one: inflict 5 Poison; or spend 3 Souls to gain 1 Energy and draw 2 cards.",
		upgradeArray: [
			{
				name: "Grave Choice+",
				effectArray: [
					{
						index: "chooseOption",
						prompt: "Which harvest?",
						optionArray: [
							{
								index: "poison",
								name: "Rot",
								effectArray: [{ index: "applyStatus", status: "poison", stacks: 7 }],
								description: "Inflict 7 Poison.",
							},
							{
								index: "souls",
								name: "Reap",
								effectArray: [
									{
										index: "branch",
										test: { index: "mechanicAtLeast", mechanic: "harvest", amount: 3 },
										thenArray: [
											{ index: "spendMechanic", mechanic: "harvest", amount: 3 },
											{ index: "gainResource", resource: "energy", amount: 1 },
											{ index: "drawCards", amount: 2 },
										],
										elseArray: [],
									},
								],
								description: "Spend 3 Souls: gain 1 Energy and draw 2 cards.",
							},
						],
					},
				],
				text: "Choose one: inflict 7 Poison; or spend 3 Souls to gain 1 Energy and draw 2 cards.",
			},
		],
	},
	{
		index: "nettleRotFromWithin",
		name: "Rot From Within",
		characterIndex: "nettle",
		archetype: "timing",
		rarity: "rare",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-rot-from-within",
		//Art owed: this card has no art yet.
		artOwed: true,
		exhausts: true,
		effectArray: [
			{
				index: "applyStatus",
				status: "poison",
				stacks: { index: "statusStacks", status: "poison", of: "target" },
			},
		],
		text: "Double the target's Poison. Exhaust.",
		upgradeArray: [{ name: "Rot From Within+", exhausts: false, text: "Double the target's Poison." }],
	},
	{
		index: "nettleDeathKnell",
		name: "Death Knell",
		characterIndex: "nettle",
		archetype: "timing",
		rarity: "rare",
		tagArray: ["necromancy"],
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/nettle-death-knell",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "triggerStatus", status: "poison", times: 2 }],
		upgradeArray: [{ name: "Death Knell+", costArray: { energy: 1 } }],
	},
	{
		index: "nettleBlightNeedle",
		name: "Blight Needle",
		characterIndex: "nettle",
		archetype: "rupture",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-strike",
		effectArray: [{ index: "damage", amount: 5 }, { index: "applyStatus", status: "poison", stacks: 3 }],
		upgradeArray: [
			{
				name: "Blight Needle+",
				effectArray: [{ index: "damage", amount: 7 }, { index: "applyStatus", status: "poison", stacks: 4 }],
			},
		],
	},
	{
		index: "nettleReap",
		name: "Reap",
		characterIndex: "nettle",
		archetype: "rupture",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-reap",
		effectArray: [
			{
				index: "damage",
				amount: {
					index: "math",
					operation: "add",
					left: 5,
					right: {
						index: "math",
						operation: "multiply",
						left: { index: "statusStacks", status: "poison", of: "target" },
						right: 2,
					},
				},
			},
		],
		text: "Deal {damage:5} damage plus 2 per Poison on the target.",
		upgradeArray: [
			{
				name: "Reap+",
				effectArray: [
					{
						index: "damage",
						amount: {
							index: "math",
							operation: "add",
							left: 7,
							right: {
								index: "math",
								operation: "multiply",
								left: { index: "statusStacks", status: "poison", of: "target" },
								right: 3,
							},
						},
					},
				],
				text: "Deal {damage:7} damage plus 3 per Poison on the target.",
			},
		],
	},
	{
		index: "nettleRupture",
		name: "Rupture",
		characterIndex: "nettle",
		archetype: "rupture",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-rupture",
		effectArray: [
			{ index: "consumeStatus", status: "poison" },
			{ index: "damage", amount: { index: "math", operation: "multiply", left: { index: "tally", key: "consumed" }, right: 2 }, ignoresStrength: true },
		],
		text: "Consume all Poison on an enemy. Deal twice that much damage.",
		upgradeArray: [
			{
				name: "Rupture+",
				effectArray: [
					{ index: "consumeStatus", status: "poison" },
					{ index: "damage", amount: { index: "math", operation: "multiply", left: { index: "tally", key: "consumed" }, right: 3 }, ignoresStrength: true },
				],
				text: "Consume all Poison on an enemy. Deal three times that much damage.",
			},
		],
	},
	{
		index: "nettleFester",
		name: "Fester",
		characterIndex: "nettle",
		archetype: "rupture",
		rarity: "rare",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-rupture",
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 4 },
			{ index: "applyStatus", status: "festering", stacks: 2 },
		],
		upgradeArray: [
			{
				name: "Fester+",
				effectArray: [
					{ index: "applyStatus", status: "poison", stacks: 5 },
					{ index: "applyStatus", status: "festering", stacks: 3 },
				],
			},
		],
	},
	{
		//A spell that scales with the number of unique negative status effects on a target, to move away
		//from only rewarding pure poison. It reads NEGATIVE statuses only -- neutral statuses are the
		//future catch-all and must never mechanically matter.
		index: "nettlePutrefy",
		name: "Putrefy",
		characterIndex: "nettle",
		archetype: "rupture",
		rarity: "common",
		offerCondition: { index: "outfitUnlocked", outfit: "rotsinger" },
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-rupture",
		effectArray: [{
			index: "damage",
			amount: { index: "math", operation: "add", left: 3, right: { index: "math", operation: "multiply", left: { index: "debuffCount", of: "target" }, right: 3 } },
		}],
		text: "Deal {damage:3} damage plus 3 per negative status on the target.",
		upgradeArray: [
			{
				name: "Putrefy+",
				effectArray: [{
					index: "damage",
					amount: { index: "math", operation: "add", left: 4, right: { index: "math", operation: "multiply", left: { index: "debuffCount", of: "target" }, right: 4 } },
				}],
				text: "Deal {damage:4} damage plus 4 per negative status on the target.",
			},
		],
	},
	{
		index: "nettleWasting",
		name: "Wasting",
		characterIndex: "nettle",
		archetype: "rupture",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-wither",
		offerCondition: { index: "outfitUnlocked", outfit: "rotsinger" },
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 4 },
			{
				index: "applyStatus",
				status: "poison",
				stacks: 4,
				condition: { index: "hasStatus", status: "weak", of: "target" },
			},
		],
		upgradeArray: [
			{
				name: "Wasting+",
				effectArray: [
					{ index: "applyStatus", status: "poison", stacks: 5 },
					{
						index: "applyStatus",
						status: "poison",
						stacks: 5,
						condition: { index: "hasStatus", status: "weak", of: "target" },
					},
				],
			},
		],
	},
	{
		index: "nettleCorpsePyre",
		name: "Corpse Pyre",
		characterIndex: "nettle",
		archetype: "rupture",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-corpse-pyre",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "rotsinger" },
		effectArray: [
			{
				index: "chooseCards",
				effectArray: [{ index: "exhaustCard" }],
				from: "handCard",
				prompt: "Burn which card?",
				minimum: 1,
				maximum: 1,
			},
			{
				index: "damage",
				amount: {
					index: "math",
					operation: "add",
					left: 8,
					right: {
						index: "math",
						operation: "multiply",
						left: { index: "statusStacks", status: "poison", of: "target" },
						right: 2,
					},
				},
			},
		],
		text: "Exhaust a card in your hand. Deal {damage:8} damage plus 2 per Poison on the target.",
		upgradeArray: [
			{
				name: "Corpse Pyre+",
				effectArray: [
					{
						index: "chooseCards",
						effectArray: [{ index: "exhaustCard" }],
						from: "handCard",
						prompt: "Burn which card?",
						minimum: 1,
						maximum: 1,
					},
					{
						index: "damage",
						amount: {
							index: "math",
							operation: "add",
							left: 11,
							right: {
								index: "math",
								operation: "multiply",
								left: { index: "statusStacks", status: "poison", of: "target" },
								right: 2,
							},
						},
					},
				],
				text: "Exhaust a card in your hand. Deal {damage:11} damage plus 2 per Poison on the target.",
			},
		],
	},
	{
		index: "nettleCatharsis",
		name: "Catharsis",
		characterIndex: "nettle",
		archetype: "rupture",
		rarity: "rare",
		tagArray: ["necromancy"],
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/nettle-miasma",
		offerCondition: { index: "outfitUnlocked", outfit: "rotsinger" },
		effectArray: [
			{
				index: "forEachTarget",
				effectArray: [
					{
						index: "damage",
						amount: {
							index: "math",
							operation: "add",
							left: { index: "statusStacks", status: "poison", of: "target" },
							right: { index: "math", operation: "multiply", left: { index: "debuffCount", of: "target" }, right: 3 },
						},
						ignoresStrength: true,
					},
				],
				over: "allEnemies",
			},
		],
		text: "Each enemy takes damage equal to its Poison, plus 3 for each debuff it has.",
		upgradeArray: [{ name: "Catharsis+", costArray: { energy: 1 } }],
	},
	{
		index: "nettleBurst",
		name: "Burst",
		characterIndex: "nettle",
		archetype: "rupture",
		rarity: "rare",
		offerCondition: { index: "wearsOutfit", outfit: "rotsinger" },
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "vertical",
		artPath: "cards/art/nettle-plague",
		effectArray: [
			{ index: "consumeStatus", status: "poison" },
			{ index: "damage", amount: { index: "tally", key: "consumed" }, ignoresStrength: true, targetOverride: "allEnemies" },
		],
		text: "Consume all Poison on an enemy. Deal that much damage to ALL enemies.",
		upgradeArray: [
			{
				name: "Burst+",
				effectArray: [
					{ index: "consumeStatus", status: "poison" },
					{ index: "damage", amount: { index: "math", operation: "add", left: 5, right: { index: "tally", key: "consumed" } }, ignoresStrength: true, targetOverride: "allEnemies" },
				],
				text: "Consume all Poison on an enemy. Deal 5 plus that much damage to ALL enemies.",
			},
		],
	},
	{
		index: "nettleMiasma",
		name: "Miasma",
		characterIndex: "nettle",
		archetype: "contagion",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/nettle-miasma",
		brokenCard: "nettleMiasmicHaze",
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 3 },
			{ index: "applyStatus", status: "weak", stacks: 1 },
		],
		upgradeArray: [
			{
				name: "Miasma+",
				effectArray: [
					{ index: "applyStatus", status: "poison", stacks: 4 },
					{ index: "applyStatus", status: "weak", stacks: 1 },
				],
			},
		],
	},
	{
		index: "nettleContagion",
		name: "Contagion",
		characterIndex: "nettle",
		archetype: "contagion",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-infect",
		effectArray: [{ index: "spreadStatus", status: "poison" }],
		text: "Every other enemy gains Poison equal to this enemy's.",
		upgradeArray: [
			{
				name: "Contagion+",
				costArray: { energy: 0 },
			},
		],
	},
	{
		index: "nettleInfect",
		name: "Infect",
		characterIndex: "nettle",
		archetype: "contagion",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-infect",
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 3 },
			{ index: "applyStatus", status: "infected", stacks: 2 },
		],
		upgradeArray: [
			{
				name: "Infect+",
				effectArray: [
					{ index: "applyStatus", status: "poison", stacks: 4 },
					{ index: "applyStatus", status: "infected", stacks: 3 },
				],
			},
		],
	},
	{
		index: "nettlePandemic",
		name: "Pandemic",
		characterIndex: "nettle",
		archetype: "contagion",
		rarity: "rare",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "allEnemies",
		layout: "vertical",
		artPath: "cards/art/nettle-plague",
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 3 },
			{ index: "applyStatus", status: "pandemic", stacks: 1, targetOverride: "owner" },
		],
		text: "ALL enemies gain 3 Poison. When a poisoned enemy falls, ALL others gain its Poison.",
		upgradeArray: [
			{
				name: "Pandemic+",
				effectArray: [
					{ index: "applyStatus", status: "poison", stacks: 4 },
					{ index: "applyStatus", status: "pandemic", stacks: 1, targetOverride: "owner" },
				],
				text: "ALL enemies gain 5 Poison. When a poisoned enemy falls, ALL others gain its Poison.",
			},
		],
	},
	{
		index: "nettleScatterSpores",
		name: "Scatter Spores",
		characterIndex: "nettle",
		archetype: "contagion",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "none",
		layout: "horizontal",
		artPath: "cards/art/nettle-scatter-spores",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "sporemother" },
		effectArray: [
			{
				index: "repeat",
				effectArray: [{ index: "applyStatus", status: "poison", stacks: 2, targetOverride: "randomEnemy" }],
				times: 3,
			},
		],
		text: "Inflict 2 Poison on a random enemy, 3 times.",
		upgradeArray: [
			{
				name: "Scatter Spores+",
				effectArray: [
					{
						index: "repeat",
						effectArray: [{ index: "applyStatus", status: "poison", stacks: 2, targetOverride: "randomEnemy" }],
						times: 4,
					},
				],
				text: "Inflict 2 Poison on a random enemy, 4 times.",
			},
		],
	},
	{
		index: "nettlePlagueBearer",
		name: "Plague Bearer",
		characterIndex: "nettle",
		archetype: "contagion",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/nettle-plague-bearer",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "sporemother" },
		effectArray: [{ index: "applyStatus", status: "envenomed", stacks: 1 }],
		text: "This turn, an ally's attacks also inflict 2 Poison.",
		upgradeArray: [{ name: "Plague Bearer+", costArray: { energy: 0 } }],
	},
	{
		index: "nettleSporeCloud",
		name: "Spore Cloud",
		characterIndex: "nettle",
		archetype: "contagion",
		rarity: "common",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/nettle-spore-cloud",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "sporemother" },
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 3 },
			{
				index: "chooseCards",
				effectArray: [{ index: "exhaustCard" }],
				from: "handCard",
				prompt: "Burn which card?",
				minimum: 0,
				maximum: 1,
			},
		],
		text: "Inflict 3 Poison on ALL enemies. You may exhaust a card in your hand.",
		upgradeArray: [
			{
				name: "Spore Cloud+",
				effectArray: [
					{ index: "applyStatus", status: "poison", stacks: 4 },
					{
						index: "chooseCards",
						effectArray: [{ index: "exhaustCard" }],
						from: "handCard",
						prompt: "Burn which card?",
						minimum: 0,
						maximum: 1,
					},
				],
				text: "Inflict 4 Poison on ALL enemies. You may exhaust a card in your hand.",
			},
		],
	},
	{
		index: "nettleRotGarden",
		name: "Rot Garden",
		characterIndex: "nettle",
		archetype: "contagion",
		type: "passive",
		rarity: "rare",
		tagArray: ["necromancy"],
		costArray: { energy: 2 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/nettle-rot-garden",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "sporemother" },
		effectArray: [{ index: "applyStatus", status: "rotGarden", stacks: 1 }],
		text: "Whenever any ally's attack wounds an enemy, it gains 1 Poison.",
		upgradeArray: [{ name: "Rot Garden+", costArray: { energy: 1 } }],
	},
	{
		index: "nettlePlague",
		name: "Creeping Plague",
		characterIndex: "nettle",
		archetype: "contagion",
		rarity: "rare",
		tagArray: ["necromancy"],
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "vertical",
		artPath: "cards/art/nettle-plague",
		offerCondition: { index: "wearsOutfit", outfit: "sporemother" },
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 4 },
			{ index: "applyStatus", status: "sundered", stacks: 2 },
		],
		upgradeArray: [
			{
				name: "Creeping Plague+",
				effectArray: [
					{ index: "applyStatus", status: "poison", stacks: 5 },
					{ index: "applyStatus", status: "sundered", stacks: 3 },
				],
			},
		],
	},
	{
		index: "nettlePollenKiss",
		name: "Pollen Kiss",
		characterIndex: "nettle",
		archetype: "venom",
		rarity: "common",
		tagArray: ["venom"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-pollen",
		effectArray: [{ index: "applyStatus", status: "poison", stacks: 3 }, { index: "lust", amount: 5 }],
		upgradeArray: [
			{
				name: "Pollen Kiss+",
				effectArray: [{ index: "applyStatus", status: "poison", stacks: 4 }, { index: "lust", amount: 7 }],
			},
		],
	},
	{
		index: "nettleFlushed",
		name: "Flushed",
		characterIndex: "nettle",
		archetype: "venom",
		rarity: "common",
		tagArray: ["venom"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-flush",
		effectArray: [
			{
				index: "lust",
				amount: {
					index: "math",
					operation: "add",
					left: 4,
					right: {
						index: "math",
						operation: "multiply",
						left: { index: "statusStacks", status: "poison", of: "target" },
						right: 2,
					},
				},
			},
		],
		text: "Inflict 4 Lust plus twice the target's Poison.",
		upgradeArray: [
			{
				name: "Flushed+",
				effectArray: [
					{
						index: "lust",
						amount: {
							index: "math",
							operation: "add",
							left: 7,
							right: {
								index: "math",
								operation: "multiply",
								left: { index: "statusStacks", status: "poison", of: "target" },
								right: 2,
							},
						},
					},
				],
				text: "Inflict 7 Lust plus twice the target's Poison.",
			},
		],
	},
	{
		index: "nettleIntoxicate",
		name: "Intoxicate",
		characterIndex: "nettle",
		archetype: "venom",
		rarity: "common",
		tagArray: ["venom"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-pollen",
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 3 },
			{ index: "applyStatus", status: "intoxicated", stacks: 2 },
		],
		upgradeArray: [
			{
				name: "Intoxicate+",
				effectArray: [
					{ index: "applyStatus", status: "poison", stacks: 4 },
					{ index: "applyStatus", status: "intoxicated", stacks: 3 },
				],
			},
		],
	},
	{
		index: "nettleHeadySpores",
		name: "Heady Spores",
		characterIndex: "nettle",
		archetype: "venom",
		type: "passive",
		rarity: "rare",
		tagArray: ["venom"],
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/nettle-flush",
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 2, targetOverride: "allEnemies" },
			{ index: "applyStatus", status: "headySpores", stacks: 1 },
		],
		text: "ALL enemies gain 2 Poison. Whenever the party applies Poison, that enemy also takes 2 Lust.",
		upgradeArray: [{ name: "Heady Spores+", costArray: { energy: 0 } }],
	},
	{
		index: "nettleLoveBite",
		name: "Love Bite",
		characterIndex: "nettle",
		archetype: "venom",
		rarity: "common",
		tagArray: ["venom"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-love-bite",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "nightshade" },
		effectArray: [
			{ index: "damage", amount: 4 },
			{ index: "applyStatus", status: "poison", stacks: 2 },
			{ index: "applyStatus", status: "sensitive", stacks: 2 },
		],
		upgradeArray: [
			{
				name: "Love Bite+",
				effectArray: [
					{ index: "damage", amount: 5 },
					{ index: "applyStatus", status: "poison", stacks: 3 },
					{ index: "applyStatus", status: "sensitive", stacks: 3 },
				],
			},
		],
	},
	{
		index: "nettleDrawOut",
		name: "Draw Out",
		characterIndex: "nettle",
		archetype: "venom",
		rarity: "common",
		tagArray: ["venom"],
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/nettle-draw-out",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "nightshade" },
		effectArray: [
			{ index: "soothe", amount: 8 },
			{
				index: "applyStatus",
				status: "poison",
				stacks: { index: "tally", key: "lustRemoved" },
				targetOverride: "frontEnemy",
			},
		],
		text: "An ally loses up to 8 Lust. The front enemy gains that much Poison.",
		upgradeArray: [
			{
				name: "Draw Out+",
				effectArray: [
					{ index: "soothe", amount: 11 },
					{
						index: "applyStatus",
						status: "poison",
						stacks: { index: "tally", key: "lustRemoved" },
						targetOverride: "frontEnemy",
					},
				],
				text: "An ally loses up to 12 Lust. The front enemy gains that much Poison.",
			},
		],
	},
	{
		index: "nettleLotusSmoke",
		name: "Lotus Smoke",
		characterIndex: "nettle",
		archetype: "venom",
		rarity: "common",
		tagArray: ["venom"],
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/nettle-lotus-smoke",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "nightshade" },
		effectArray: [{ index: "applyStatus", status: "poison", stacks: 2 }, { index: "lust", amount: 5 }],
		upgradeArray: [
			{
				name: "Lotus Smoke+",
				effectArray: [{ index: "applyStatus", status: "poison", stacks: 3 }, { index: "lust", amount: 7 }],
			},
		],
	},
	{
		index: "nettleAphrodisiac",
		name: "Aphrodisiac",
		characterIndex: "nettle",
		archetype: "venom",
		type: "passive",
		rarity: "rare",
		tagArray: ["venom"],
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/nettle-aphrodisiac",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "nightshade" },
		effectArray: [{ index: "applyStatus", status: "aphrodisiac", stacks: 1 }],
		text: "Whenever an enemy takes Lust from any ally, it gains 1 Poison.",
		upgradeArray: [{ name: "Aphrodisiac+", costArray: { energy: 0 } }],
	},
	{
		index: "nettleBacchanal",
		brokenCard: "nettleLastBloom",
		name: "Bacchanal",
		characterIndex: "nettle",
		archetype: "venom",
		rarity: "rare",
		offerCondition: { index: "wearsOutfit", outfit: "nightshade" },
		tagArray: ["venom"],
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "vertical",
		artPath: "cards/art/nettle-pollen",
		effectArray: [
			{ index: "applyStatus", status: "intoxicated", stacks: 2 },
			{
				index: "forEachTarget", over: "allEnemies",
				effectArray: [{ index: "lust", amount: { index: "statusStacks", status: "poison", of: "target" } }],
			},
		],
		text: "Apply 2 Intoxicated to ALL enemies. Each takes Lust equal to its Poison.",
		upgradeArray: [
			{
				name: "Bacchanal+",
				effectArray: [
					{ index: "applyStatus", status: "intoxicated", stacks: 3 },
					{
						index: "forEachTarget", over: "allEnemies",
						effectArray: [{ index: "lust", amount: { index: "math", operation: "multiply", left: { index: "statusStacks", status: "poison", of: "target" }, right: 2 } }],
					},
				],
				text: "Apply 3 Intoxicated to ALL enemies. Each takes Lust equal to twice its Poison.",
			},
		],
	},
	//--- severine -------------------------------------------------------------------------------
	{
		index: "severineBloodthirst",
		name: "Bloodthirst",
		characterIndex: "severine",
		archetype: "wounded",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-bloodthirst",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "damage",
				amount: {
					index: "math",
					operation: "add",
					left: 6,
					right: { index: "math", operation: "multiply", left: { index: "mechanicOrbs", of: "source" }, right: 3 },
				},
			},
		],
		text: "Deal {damage:6} damage, plus 3 for each lit Thirst orb.",
		upgradeArray: [
			{
				name: "Bloodthirst+",
				effectArray: [
					{
						index: "damage",
						amount: {
							index: "math",
							operation: "add",
							left: 8,
							right: { index: "math", operation: "multiply", left: { index: "mechanicOrbs", of: "source" }, right: 4 },
						},
					},
				],
				text: "Deal {damage:8} damage, plus 4 for each lit Thirst orb.",
			},
		],
	},
	{
		index: "severineAnswerInKind",
		name: "Answer in Kind",
		characterIndex: "severine",
		archetype: "wounded",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-answer-in-kind",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "damage",
				amount: {
					index: "math",
					operation: "add",
					left: 4,
					right: {
						index: "stat",
						stat: "healthLostLastEnemyTurn",
						of: "source",
						label: "the health Severine lost since your last turn",
					},
				},
			},
		],
		text: "Deal {damage:4} damage, plus the health Severine lost since your last turn.",
		upgradeArray: [
			{
				name: "Answer in Kind+",
				effectArray: [
					{
						index: "damage",
						amount: {
							index: "math",
							operation: "add",
							left: 7,
							right: {
								index: "stat",
								stat: "healthLostLastEnemyTurn",
								of: "source",
								label: "the health Severine lost since your last turn",
							},
						},
					},
				],
				text: "Deal {damage:7} damage, plus the health Severine lost since your last turn.",
			},
		],
	},
	{
		index: "severineRedChoice",
		name: "Red Choice",
		characterIndex: "severine",
		archetype: "wounded",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-red-choice",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "chooseOption",
				prompt: "Spill it how?",
				optionArray: [
					{
						index: "strike",
						name: "Strike",
						effectArray: [{ index: "damage", amount: 9 }],
						description: "Deal 9 damage.",
					},
					{
						index: "thirst",
						name: "Thirst",
						effectArray: [
							{
								index: "applyStatus",
								status: "fleetingStrength",
								stacks: { index: "math", operation: "multiply", left: { index: "mechanicOrbs", of: "source" }, right: 2 },
								targetOverride: "owner",
							},
						],
						description: "Gain 2 Fleeting Strength for each lit Thirst orb.",
					},
				],
			},
		],
		text: "Choose one: deal {damage:9} damage; or gain 2 Fleeting Strength for each lit Thirst orb.",
		upgradeArray: [
			{
				name: "Red Choice+",
				effectArray: [
					{
						index: "chooseOption",
						prompt: "Spill it how?",
						optionArray: [
							{
								index: "strike",
								name: "Strike",
								effectArray: [{ index: "damage", amount: 12 }],
								description: "Deal 12 damage.",
							},
							{
								index: "thirst",
								name: "Thirst",
								effectArray: [
									{
										index: "applyStatus",
										status: "fleetingStrength",
										stacks: { index: "math", operation: "multiply", left: { index: "mechanicOrbs", of: "source" }, right: 3 },
										targetOverride: "owner",
									},
								],
								description: "Gain 3 Fleeting Strength for each lit Thirst orb.",
							},
						],
					},
				],
				text: "Choose one: deal {damage:12} damage; or gain 3 Fleeting Strength for each lit Thirst orb.",
			},
		],
	},
	{
		index: "severineFeedingFrenzy",
		name: "Feeding Frenzy",
		characterIndex: "severine",
		archetype: "wounded",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-feeding-frenzy",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "repeat",
				effectArray: [
					{
						index: "damage",
						amount: { index: "math", operation: "add", left: 4, right: { index: "mechanicOrbs", of: "source" } },
						vfx: "none",
					},
				],
				times: 3,
			},
		],
		text: "Deal {damage:4} damage 3 times, plus 1 on each hit for each lit Thirst orb.",
		upgradeArray: [
			{
				name: "Feeding Frenzy+",
				effectArray: [
					{
						index: "repeat",
						effectArray: [
							{
								index: "damage",
								amount: { index: "math", operation: "add", left: 5, right: { index: "mechanicOrbs", of: "source" } },
								vfx: "none",
							},
						],
						times: 3,
					},
				],
				text: "Deal {damage:5} damage 3 times, plus 1 on each hit for each lit Thirst orb.",
			},
		],
	},
	{
		index: "severineScarTissue",
		name: "Scar Tissue",
		characterIndex: "severine",
		archetype: "wounded",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/severine-scar-tissue",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "applyStatus", status: "scarTissue", stacks: 1 }],
		text: "Whenever Severine loses health, she gains 3 Temporary HP.",
		upgradeArray: [{ name: "Scar Tissue+", costArray: { energy: 0 } }],
	},
	{
		index: "severineHamstring",
		name: "Hamstring",
		characterIndex: "severine",
		archetype: "feast",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-hunt",
		brokenCard: "severineCripple",
		effectArray: [{ index: "damage", amount: 7 }, { index: "applyStatus", status: "weak", stacks: 1 }],
		upgradeArray: [
			{
				name: "Hamstring+",
				effectArray: [{ index: "damage", amount: 9 }, { index: "applyStatus", status: "weak", stacks: 1 }],
			},
		],
	},
	{
		index: "severineMarkPrey",
		name: "Mark Prey",
		characterIndex: "severine",
		archetype: "feast",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-hunt",
		effectArray: [{ index: "damage", amount: 4 }, { index: "applyStatus", status: "sundered", stacks: 2 }],
		upgradeArray: [
			{
				name: "Mark Prey+",
				effectArray: [{ index: "damage", amount: 5 }, { index: "applyStatus", status: "sundered", stacks: 3 }],
			},
		],
	},
	{
		index: "severineCoupDeGrace",
		name: "Coup de Grace",
		characterIndex: "severine",
		archetype: "feast",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-exsanguinate",
		effectArray: [
			{ index: "damage", amount: 8 },
			{ index: "gainResource", resource: "energy", amount: 1, condition: { index: "isDowned", of: "target" } },
			{ index: "drawCards", amount: 1, condition: { index: "isDowned", of: "target" } },
		],
		text: "Deal {damage:8} damage. If it falls, gain 1 Energy and draw 1 card.",
		upgradeArray: [
			{
				name: "Coup de Grace+",
				effectArray: [
					{ index: "damage", amount: 11 },
					{ index: "gainResource", resource: "energy", amount: 1, condition: { index: "isDowned", of: "target" } },
					{ index: "drawCards", amount: 1, condition: { index: "isDowned", of: "target" } },
				],
				text: "Deal {damage:11} damage. If it falls, gain 1 Energy and draw 1 card.",
			},
		],
	},
	{
		index: "severineExsanguinate",
		name: "Exsanguinate",
		characterIndex: "severine",
		archetype: "feast",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-exsanguinate",
		effectArray: [
			{
				index: "damage",
				amount: {
					index: "conditional",
					condition: { index: "compare", operation: "less", left: { index: "healthFraction", of: "target" }, right: 0.5 },
					then: 24,
					else: 10,
				},
			},
		],
		text: "Deal {damage:10} damage. If the target is below half health, deal {damage:24} instead.",
		upgradeArray: [
			{
				//"Exsanguinate+" overflows the small frame (cardFit), so the upgrade keeps the name.
				name: "Exsanguinate",
				effectArray: [
					{
						index: "damage",
						amount: {
							index: "conditional",
							condition: { index: "compare", operation: "less", left: { index: "healthFraction", of: "target" }, right: 0.5 },
							then: 32,
							else: 13,
						},
					},
				],
				text: "Deal {damage:13} damage. If the target is below half health, deal {damage:32} instead.",
			},
		],
	},
	{
		index: "severineStalk",
		name: "Stalk",
		characterIndex: "severine",
		archetype: "feast",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "weakestEnemy",
		layout: "horizontal",
		artPath: "cards/art/severine-stalk",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "huntress" },
		effectArray: [
			{ index: "damage", amount: 6 },
			{
				index: "damage",
				amount: 6,
				condition: { index: "compare", operation: "less", left: { index: "healthFraction", of: "target" }, right: 0.5 },
			},
		],
		text: "Deal {damage:6} damage to the enemy with the least health. If it is below half health, again.",
		upgradeArray: [
			{
				name: "Stalk+",
				effectArray: [
					{ index: "damage", amount: 8 },
					{
						index: "damage",
						amount: 8,
						condition: { index: "compare", operation: "less", left: { index: "healthFraction", of: "target" }, right: 0.5 },
					},
				],
				text: "Deal {damage:8} damage to the enemy with the least health. If it is below half health, again.",
			},
		],
	},
	{
		index: "severineScentOfBlood",
		name: "Scent of Blood",
		characterIndex: "severine",
		archetype: "feast",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-scent-of-blood",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "huntress" },
		effectArray: [
			{ index: "damage", amount: 5 },
			{
				index: "drawCards",
				amount: 2,
				condition: {
					index: "compare",
					operation: "greater",
					left: { index: "count", collection: "woundedEnemies" },
					right: 0,
				},
			},
		],
		text: "Deal {damage:5} damage. If any enemy is below half health, draw 2 cards.",
		upgradeArray: [
			{
				name: "Scent of Blood+",
				effectArray: [
					{ index: "damage", amount: 7 },
					{
						index: "drawCards",
						amount: 2,
						condition: {
							index: "compare",
							operation: "greater",
							left: { index: "count", collection: "woundedEnemies" },
							right: 0,
						},
					},
				],
				text: "Deal {damage:7} damage. If any enemy is below half health, draw 2 cards.",
			},
		],
	},
	{
		index: "severinePounce",
		name: "Pounce",
		characterIndex: "severine",
		archetype: "feast",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-pounce",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "huntress" },
		effectArray: [
			{ index: "damage", amount: 9 },
			{
				index: "gainResource",
				resource: "energy",
				amount: 1,
				condition: {
					index: "compare",
					operation: "greater",
					left: { index: "count", collection: "woundedEnemies" },
					right: 0,
				},
			},
		],
		text: "Deal {damage:9} damage. If any enemy is below half health, gain 1 Energy.",
		upgradeArray: [
			{
				name: "Pounce+",
				effectArray: [
					{ index: "damage", amount: 12 },
					{
						index: "gainResource",
						resource: "energy",
						amount: 1,
						condition: {
							index: "compare",
							operation: "greater",
							left: { index: "count", collection: "woundedEnemies" },
							right: 0,
						},
					},
				],
				text: "Deal {damage:12} damage. If any enemy is below half health, gain 1 Energy.",
			},
		],
	},
	{
		index: "severinePackHunt",
		name: "Pack Hunt",
		characterIndex: "severine",
		archetype: "feast",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/severine-pack-hunt",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "huntress" },
		effectArray: [{ index: "applyStatus", status: "marked", stacks: 1 }, { index: "drawCards", amount: 1 }],
		upgradeArray: [{ name: "Pack Hunt+", costArray: { energy: 0 } }],
	},
	{
		index: "severineBloodyVerdict",
		name: "Bloody Verdict",
		characterIndex: "severine",
		archetype: "feast",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "enemy",
		layout: "vertical",
		artPath: "cards/art/severine-verdict",
		offerCondition: { index: "wearsOutfit", outfit: "huntress" },
		effectArray: [
			{
				index: "damage",
				amount: {
					index: "math",
					operation: "add",
					left: 6,
					right: { index: "math", operation: "divide", left: { index: "missingHealth", of: "target" }, right: 2 },
				},
			},
			{ index: "heal", amount: 6, targetOverride: "owner", condition: { index: "isDowned", of: "target" } },
		],
		text: "Deal {damage:6} damage plus half the target's missing health. If it falls, heal 6 HP.",
		upgradeArray: [
			{
				name: "Bloody Verdict+",
				effectArray: [
					{
						index: "damage",
						amount: {
							index: "math",
							operation: "add",
							left: 9,
							right: { index: "math", operation: "divide", left: { index: "missingHealth", of: "target" }, right: 2 },
						},
					},
					{ index: "heal", amount: 6, targetOverride: "owner", condition: { index: "isDowned", of: "target" } },
				],
				text: "Deal {damage:9} damage plus half the target's missing health. If it falls, heal 6 HP.",
			},
		],
	},
	{
		index: "severineBloodPact",
		name: "Blood Pact",
		characterIndex: "severine",
		archetype: "bloodletting",
		rarity: "common",
		costArray: { energy: 0 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/severine-pact",
		effectArray: [
			{ index: "loseHealth", amount: 7, targetOverride: "owner" },
			{ index: "gainResource", resource: "energy", amount: 2 },
		],
		text: "Lose 7 HP. Gain 2 Energy.",
		upgradeArray: [
			{
				name: "Blood Pact+",
				effectArray: [
					{ index: "loseHealth", amount: 5, targetOverride: "owner" },
					{ index: "gainResource", resource: "energy", amount: 2 },
				],
				text: "Lose 5 HP. Gain 2 Energy.",
			},
		],
	},
	{
		index: "severineBloodPrice",
		name: "Blood Price",
		characterIndex: "severine",
		archetype: "bloodletting",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-blood-price",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "loseHealth", amount: 5, targetOverride: "owner" }, { index: "damage", amount: 14 }],
		upgradeArray: [
			{
				name: "Blood Price+",
				effectArray: [{ index: "loseHealth", amount: 5, targetOverride: "owner" }, { index: "damage", amount: 19 }],
			},
		],
	},
	{
		index: "severineHemomancy",
		name: "Blood Rite",
		characterIndex: "severine",
		archetype: "bloodletting",
		type: "passive",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/severine-pact",
		effectArray: [{ index: "applyStatus", status: "hemomancy", stacks: 1 }],
		text: "When the party damages one of its own, draw 1 card (twice a turn).",
		upgradeArray: [
			{ name: "Blood Rite+", costArray: { energy: 0 } },
		],
	},
	{
		index: "severineSanguineTide",
		name: "Sanguine Tide",
		characterIndex: "severine",
		archetype: "bloodletting",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/severine-tide",
		effectArray: [{ index: "damage", amount: { index: "combatStat", stat: "partyDamageTakenThisTurn" } }],
		text: "Deal damage to ALL enemies equal to the damage the party has taken this turn.",
		upgradeArray: [
			{
				name: "Sanguine Tide+",
				effectArray: [{ index: "damage", amount: { index: "math", operation: "add", left: 4, right: { index: "combatStat", stat: "partyDamageTakenThisTurn" } } }],
				text: "Deal {damage:4} damage plus the damage the party has taken this turn to ALL enemies.",
			},
		],
	},
	{
		index: "severineOpenVein",
		name: "Open Vein",
		characterIndex: "severine",
		archetype: "bloodletting",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-open-vein",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "crimsonCovenant" },
		effectArray: [
			{ index: "loseHealth", amount: 4, targetOverride: "owner" },
			{ index: "repeat", effectArray: [{ index: "damage", amount: 4, vfx: "none" }], times: 3 },
		],
		text: "Lose 4 HP. Deal {damage:4} damage 3 times.",
		upgradeArray: [
			{
				name: "Open Vein+",
				effectArray: [
					{ index: "loseHealth", amount: 4, targetOverride: "owner" },
					{ index: "repeat", effectArray: [{ index: "damage", amount: 5, vfx: "none" }], times: 3 },
				],
				text: "Lose 4 HP. Deal {damage:5} damage 3 times.",
			},
		],
	},
	{
		index: "severineRedHarvest",
		name: "Red Harvest",
		characterIndex: "severine",
		archetype: "bloodletting",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-red-harvest",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "crimsonCovenant" },
		effectArray: [
			{
				index: "damage",
				amount: {
					index: "math",
					operation: "add",
					left: 4,
					right: { index: "math", operation: "divide", left: { index: "missingHealth", of: "source" }, right: 3 },
				},
			},
		],
		text: "Deal {damage:4} damage, plus 1 for every 3 health Severine is missing.",
		upgradeArray: [
			{
				name: "Red Harvest+",
				effectArray: [
					{
						index: "damage",
						amount: {
							index: "math",
							operation: "add",
							left: 4,
							right: { index: "math", operation: "divide", left: { index: "missingHealth", of: "source" }, right: 2 },
						},
					},
				],
				text: "Deal {damage:4} damage, plus 1 for every 2 health Severine is missing.",
			},
		],
	},
	{
		index: "severineBleedTogether",
		name: "Bleed Together",
		characterIndex: "severine",
		archetype: "bloodletting",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/severine-bleed-together",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "crimsonCovenant" },
		effectArray: [
			{ index: "loseHealth", amount: 4, targetOverride: "owner" },
			{ index: "loseHealth", amount: 4 },
			{ index: "applyStatus", status: "fleetingStrength", stacks: 3 },
			{ index: "applyStatus", status: "fleetingStrength", stacks: 3, targetOverride: "owner" },
		],
		text: "You and an ally each lose 4 HP and gain 3 Fleeting Strength.",
		upgradeArray: [
			{
				name: "Bleed Together+",
				effectArray: [
					{ index: "loseHealth", amount: 4, targetOverride: "owner" },
					{ index: "loseHealth", amount: 4 },
					{ index: "applyStatus", status: "fleetingStrength", stacks: 4 },
					{ index: "applyStatus", status: "fleetingStrength", stacks: 4, targetOverride: "owner" },
				],
				text: "You and an ally each lose 4 HP and gain 4 Fleeting Strength.",
			},
		],
	},
	{
		index: "severineBloodMoon",
		name: "Blood for Blood",
		characterIndex: "severine",
		archetype: "bloodletting",
		type: "passive",
		rarity: "rare",
		offerCondition: { index: "outfitUnlocked", outfit: "crimsonCovenant" },
		costArray: { energy: 2 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/severine-tide",
		effectArray: [{ index: "applyStatus", status: "bloodMoon", stacks: 1 }],
		text: "Whenever an ally loses health, deal that much damage to a random enemy.",
		upgradeArray: [
			{ name: "Blood for Blood+", costArray: { energy: 1 } },
		],
	},
	{
		index: "severineHeartsToll",
		name: "Heart's Toll",
		characterIndex: "severine",
		archetype: "bloodletting",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-heart-s-toll",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "wearsOutfit", outfit: "crimsonCovenant" },
		effectArray: [{ index: "loseHealth", amount: 10, targetOverride: "owner" }, { index: "damage", amount: 30 }],
		text: "Lose 10 HP. Deal {damage:30} damage.",
		upgradeArray: [
			{
				name: "Heart's Toll+",
				effectArray: [{ index: "loseHealth", amount: 10, targetOverride: "owner" }, { index: "damage", amount: 40 }],
				text: "Lose 10 HP. Deal {damage:40} damage.",
			},
		],
	},
	{
		index: "severineLeech",
		name: "Drink Deep",
		characterIndex: "severine",
		archetype: "transfusion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-drink-deep",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "damage", amount: 7 },
			{ index: "heal", amount: { index: "damageDealt" }, targetOverride: "owner" },
		],
		text: "Deal {damage:7} damage. Heal as much as it dealt.",
		upgradeArray: [
			{
				name: "Drink Deep+",
				effectArray: [
					{ index: "damage", amount: 9 },
					{ index: "heal", amount: { index: "damageDealt" }, targetOverride: "owner" },
				],
				text: "Deal {damage:9} damage. Heal as much as it dealt.",
			},
		],
	},
	{
		index: "severineLeechMark",
		name: "Leech Mark",
		characterIndex: "severine",
		archetype: "transfusion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-transfuse",
		effectArray: [{ index: "damage", amount: 5 }, { index: "applyStatus", status: "siphoned", stacks: 2 }],
		upgradeArray: [
			{
				name: "Leech Mark+",
				effectArray: [{ index: "damage", amount: 7 }, { index: "applyStatus", status: "siphoned", stacks: 3 }],
			},
		],
	},
	{
		index: "severineHeartsblood",
		name: "Heartsblood",
		characterIndex: "severine",
		archetype: "transfusion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/severine-transfuse",
		effectArray: [
			{ index: "loseHealth", amount: 6, targetOverride: "owner" },
			{ index: "heal", amount: 5, targetOverride: "otherAllies" },
			{ index: "soothe", amount: 3, targetOverride: "otherAllies" },
		],
		text: "Lose 6 HP. Your other allies heal 5 HP and lose 3 Lust.",
		upgradeArray: [
			{
				name: "Heartsblood+",
				effectArray: [
					{ index: "loseHealth", amount: 6, targetOverride: "owner" },
					{ index: "heal", amount: 7, targetOverride: "otherAllies" },
					{ index: "soothe", amount: 4, targetOverride: "otherAllies" },
				],
				text: "Lose 6 HP. Your other allies heal 7 HP and lose 4 Lust.",
			},
		],
	},
	{
		index: "severineNightfall",
		name: "Nightfall",
		characterIndex: "severine",
		archetype: "transfusion",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "vertical",
		artPath: "cards/art/severine-nightfall",
		brokenCard: "severineMoonfall",
		effectArray: [
			{ index: "damage", amount: 8, vfx: "vfx/test-magenta" },
			{ index: "applyStatus", status: "weak", stacks: 1 },
			{
				index: "heal",
				amount: { index: "math", operation: "multiply", left: { index: "count", collection: "livingEnemies" }, right: 2 },
				targetOverride: "owner",
			},
		],
		text: "Deal {damage:8} damage to ALL enemies and inflict 1 Weak. Heal 2 HP for each enemy still standing.",
		upgradeArray: [
			{
				name: "Nightfall+",
				effectArray: [
					{ index: "damage", amount: 11 },
					{ index: "applyStatus", status: "weak", stacks: 1 },
					{
						index: "heal",
						amount: {
							index: "math",
							operation: "multiply",
							left: { index: "count", collection: "livingEnemies" },
							right: 2,
						},
						targetOverride: "owner",
					},
				],
				text: "Deal {damage:11} damage to ALL enemies and inflict 1 Weak. Heal 2 HP for each enemy still standing.",
			},
		],
	},
	{
		index: "severineGorge",
		name: "Gorge",
		characterIndex: "severine",
		archetype: "transfusion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "vertical",
		artPath: "cards/art/severine-drain",
		offerCondition: { index: "outfitUnlocked", outfit: "bloodSaint" },
		effectArray: [
			{ index: "applyStatus", status: "gorged", stacks: 1, targetOverride: "owner" },
			{ index: "damage", amount: 5 },
			{ index: "heal", amount: { index: "damageDealt" }, targetOverride: "owner" },
		],
		text: "Gain Gorged. Deal {damage:5} damage and heal as much as it dealt.",
		upgradeArray: [
			{
				name: "Gorge+",
				effectArray: [
					{ index: "applyStatus", status: "gorged", stacks: 1, targetOverride: "owner" },
					{ index: "damage", amount: 7 },
					{ index: "heal", amount: { index: "damageDealt" }, targetOverride: "owner" },
				],
				text: "Gain Gorged. Deal {damage:7} damage and heal as much as it dealt.",
			},
		],
	},
	{
		index: "severineTransfusion",
		name: "Transfusion",
		characterIndex: "severine",
		archetype: "transfusion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/severine-transfuse",
		offerCondition: { index: "outfitUnlocked", outfit: "bloodSaint" },
		effectArray: [{ index: "loseHealth", amount: 5, targetOverride: "owner" }, { index: "heal", amount: 10 }],
		text: "Severine loses 5 HP. An ally heals 10 HP.",
		upgradeArray: [
			{
				name: "Transfusion+",
				effectArray: [{ index: "loseHealth", amount: 5, targetOverride: "owner" }, { index: "heal", amount: 13 }],
				text: "Severine loses 5 HP. An ally heals 14 HP.",
			},
		],
	},
	{
		index: "severineArc",
		name: "Crimson Arc",
		characterIndex: "severine",
		archetype: "transfusion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/severine-arc",
		brokenCard: "severinePreyNoMore",
		offerCondition: { index: "outfitUnlocked", outfit: "bloodSaint" },
		effectArray: [
			{ index: "damage", amount: 3, vfx: "vfx/test-additive" },
			{ index: "heal", amount: { index: "damageDealt" }, targetOverride: "owner" },
		],
		text: "Deal {damage:3} damage to ALL enemies. Heal as much as it dealt.",
		upgradeArray: [
			{
				name: "Crimson Arc+",
				effectArray: [
					{ index: "damage", amount: 4 },
					{ index: "heal", amount: { index: "damageDealt" }, targetOverride: "owner" },
				],
				text: "Deal {damage:4} damage to ALL enemies. Heal as much as it dealt.",
			},
		],
	},
	{
		index: "severineBloodDebt",
		name: "Blood Debt",
		characterIndex: "severine",
		archetype: "transfusion",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/severine-blood-debt",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "bloodSaint" },
		effectArray: [{ index: "applyStatus", status: "bloodDebt", stacks: 1 }],
		text: "Whenever another ally heals, deal that much damage to a random enemy.",
		upgradeArray: [{ name: "Blood Debt+", costArray: { energy: 0 } }],
	},
	{
		index: "severineCrimsonCommunion",
		name: "Crimson Communion",
		characterIndex: "severine",
		archetype: "transfusion",
		rarity: "rare",
		offerCondition: { index: "wearsOutfit", outfit: "bloodSaint" },
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "vertical",
		artPath: "cards/art/severine-nightfall",
		effectArray: [
			{ index: "damage", amount: 7 },
			{ index: "heal", amount: { index: "math", operation: "divide", left: { index: "damageDealt" }, right: { index: "count", collection: "livingAllies" } }, targetOverride: "allAllies" },
		],
		text: "Deal {damage:7} damage to ALL enemies. ALL allies share the damage dealt as healing.",
		upgradeArray: [
			{
				name: "Crimson Communion+",
				effectArray: [
					{ index: "damage", amount: 10 },
					{ index: "heal", amount: { index: "math", operation: "divide", left: { index: "damageDealt" }, right: { index: "count", collection: "livingAllies" } }, targetOverride: "allAllies" },
				],
				text: "Deal {damage:10} damage to ALL enemies. ALL allies share the damage dealt as healing.",
			},
		],
	},
	//--- cinder -------------------------------------------------------------------------------
	{
		index: "cinderLongspear",
		name: "Longspear",
		characterIndex: "cinder",
		archetype: "lanes",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-thrust",
		partyShift: "none",
		effectArray: [
			{ index: "damage", amount: 6 },
			{ index: "damage", amount: 6, condition: { index: "atRank", of: "source", rank: 0, fromBack: true } },
		],
		text: "Deal {damage:6} damage. If Cinder is at the back, deal {damage:6} more.",
		upgradeArray: [
			{
				name: "Longspear+",
				effectArray: [
					{ index: "damage", amount: 8 },
					{ index: "damage", amount: 8, condition: { index: "atRank", of: "source", rank: 0, fromBack: true } },
				],
				text: "Deal {damage:8} damage. If Cinder is at the back, deal {damage:8} more.",
			},
		],
	},
	{
		index: "cinderGuardTheRear",
		name: "Guard the Rear",
		characterIndex: "cinder",
		archetype: "lanes",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cinder-guard-the-rear",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "temporaryHealth", amount: 7 },
			{
				index: "temporaryHealth",
				amount: 7,
				targetOverride: "frontAlly",
				condition: { index: "atRank", of: "source", rank: 0, fromBack: true },
			},
		],
		text: "Cinder gains 7 Temporary HP. If she is at the back, the front ally gains 7 too.",
		upgradeArray: [
			{
				name: "Guard the Rear+",
				effectArray: [
					{ index: "temporaryHealth", amount: 9 },
					{
						index: "temporaryHealth",
						amount: 9,
						targetOverride: "frontAlly",
						condition: { index: "atRank", of: "source", rank: 0, fromBack: true },
					},
				],
				text: "Cinder gains 9 Temporary HP. If she is at the back, the front ally gains 9 too.",
			},
		],
	},
	{
		index: "cinderSpendTheSpark",
		name: "Spend the Spark",
		characterIndex: "cinder",
		archetype: "lanes",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-spend-the-spark",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "chooseOption",
				prompt: "Spend the spark?",
				optionArray: [
					{
						index: "guard",
						name: "Smoulder",
						effectArray: [{ index: "temporaryHealth", amount: 8, targetOverride: "owner" }],
						description: "Gain 8 Temporary HP.",
					},
					{
						index: "spend",
						name: "Flare",
						effectArray: [
							{ index: "spendMechanic", mechanic: "stride", all: true },
							{
								index: "damage",
								amount: { index: "math", operation: "multiply", left: { index: "tally", key: "mechanicSpent" }, right: 4 },
							},
						],
						description: "Spend all Stride: deal 4 damage for each point spent.",
					},
				],
			},
		],
		text: "Choose one: gain 8 Temporary HP; or spend all Stride to deal 4 damage for each point spent.",
		upgradeArray: [
			{
				name: "Spend the Spark+",
				effectArray: [
					{
						index: "chooseOption",
						prompt: "Spend the spark?",
						optionArray: [
							{
								index: "guard",
								name: "Smoulder",
								effectArray: [{ index: "temporaryHealth", amount: 11, targetOverride: "owner" }],
								description: "Gain 11 Temporary HP.",
							},
							{
								index: "spend",
								name: "Flare",
								effectArray: [
									{ index: "spendMechanic", mechanic: "stride", all: true },
									{
										index: "damage",
										amount: { index: "math", operation: "multiply", left: { index: "tally", key: "mechanicSpent" }, right: 5 },
									},
								],
								description: "Spend all Stride: deal 5 damage for each point spent.",
							},
						],
					},
				],
				text: "Choose one: gain 11 Temporary HP; or spend all Stride to deal 5 damage for each point spent.",
			},
		],
	},
	{
		index: "cinderTurnTheLine",
		name: "Turn the Line",
		characterIndex: "cinder",
		archetype: "lanes",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cinder-formation",
		//Drawing 2 for reversing the line was a thin rare. Reversing IS a line-wide
		//move, so it now hits the enemy line for it -- every ally the turn about-faces for.
		effectArray: [
			{ index: "reverseOrder" },
			{ index: "drawCards", amount: 2 },
			{ index: "damage", amount: 4, targetOverride: "allEnemies" },
		],
		text: "Reverse your party's order. Draw 2 cards. Deal {damage:4} damage to ALL enemies.",
		upgradeArray: [
			{
				name: "Turn the Line+",
				effectArray: [
					{ index: "reverseOrder" },
					{ index: "drawCards", amount: 3 },
					{ index: "damage", amount: 6, targetOverride: "allEnemies" },
				],
				text: "Reverse your party's order. Draw 3 cards. Deal {damage:6} damage to ALL enemies.",
			},
		],
	},
	{
		index: "cinderEmberWatch",
		name: "Ember Watch",
		characterIndex: "cinder",
		archetype: "lanes",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cinder-ember-watch",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "applyStatus", status: "emberWatch", stacks: 1 }],
		text: "At the end of your turn: if Cinder is at the front, deal 6 damage to ALL enemies; at the back, ALL allies gain 4 Temporary HP.",
		upgradeArray: [{ name: "Ember Watch+", costArray: { energy: 1 } }],
	},
	{
		index: "cinderCharge",
		name: "Flame Charge",
		characterIndex: "cinder",
		archetype: "charge",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-charge",
		effectArray: [
			{ index: "shiftParty", shift: "front", targetOverride: "owner", pace: "charge" },
			{
				index: "damage",
				amount: {
					index: "math",
					operation: "add",
					left: 5,
					right: { index: "math", operation: "multiply", left: { index: "tally", key: "ranksMoved" }, right: 3 },
				},
			},
		],
		text: "Cinder charges to the front. Deal {damage:5} damage, plus 3 for every place she crossed.",
		upgradeArray: [
			{
				name: "Flame Charge+",
				effectArray: [
					{ index: "shiftParty", shift: "front", targetOverride: "owner", pace: "charge" },
					{
						index: "damage",
						amount: {
							index: "math",
							operation: "add",
							left: 7,
							right: { index: "math", operation: "multiply", left: { index: "tally", key: "ranksMoved" }, right: 4 },
						},
					},
				],
				text: "Cinder charges to the front. Deal {damage:7} damage, plus 4 for every place she crossed.",
			},
		],
	},
	{
		index: "cinderScorch",
		name: "Scorch",
		characterIndex: "cinder",
		archetype: "charge",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-scorch",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "repeat", effectArray: [{ index: "damage", amount: 5, vfx: "none" }], times: 2 }],
		text: "Deal {damage:5} damage twice.",
		upgradeArray: [
			{
				name: "Scorch+",
				effectArray: [{ index: "repeat", effectArray: [{ index: "damage", amount: 7, vfx: "none" }], times: 2 }],
				text: "Deal {damage:7} damage twice.",
			},
		],
	},
	{
		index: "cinderTakePoint",
		name: "Take Point",
		characterIndex: "cinder",
		archetype: "charge",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-take-point",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "applyStatus", status: "vanguard", stacks: 1, targetOverride: "owner" },
			{ index: "damage", amount: 5 },
		],
		text: "Gain 1 Vanguard. Deal {damage:5} damage.",
		upgradeArray: [
			{
				name: "Take Point+",
				effectArray: [
					{ index: "applyStatus", status: "vanguard", stacks: 1, targetOverride: "owner" },
					{ index: "damage", amount: 7 },
				],
				text: "Gain 1 Vanguard. Deal {damage:8} damage.",
			},
		],
	},
	{
		index: "cinderFlurryOfEmbers",
		name: "Flurry of Embers",
		characterIndex: "cinder",
		archetype: "charge",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-flurry-of-embers",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "repeat",
				effectArray: [
					{
						index: "damage",
						amount: { index: "conditional", condition: { index: "atRank", of: "source", rank: 0 }, then: 8, else: 6 },
						vfx: "none",
					},
				],
				times: 4,
			},
		],
		text: "Deal {damage:6} damage 4 times; {damage:8} each while Cinder is at the front.",
		upgradeArray: [
			{
				name: "Flurry of Embers+",
				effectArray: [
					{
						index: "repeat",
						effectArray: [
							{
								index: "damage",
								amount: { index: "conditional", condition: { index: "atRank", of: "source", rank: 0 }, then: 10, else: 8 },
								vfx: "none",
							},
						],
						times: 4,
					},
				],
				text: "Deal {damage:8} damage 4 times; {damage:10} each while Cinder is at the front.",
			},
		],
	},
	{
		index: "cinderHotPursuit",
		name: "Hot Pursuit",
		characterIndex: "cinder",
		archetype: "charge",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-charge",
		brokenCard: "cinderLostTrail",
		offerCondition: { index: "outfitUnlocked", outfit: "vanguardPlume" },
		effectArray: [
			{ index: "damage", amount: 6 },
			{
				index: "damage",
				amount: 6,
				condition: { index: "compare", operation: "greater", left: { index: "ranksMovedThisTurn", of: "source" }, right: 0 },
			},
			{
				index: "drawCards",
				amount: 1,
				condition: { index: "compare", operation: "greater", left: { index: "ranksMovedThisTurn", of: "source" }, right: 0 },
			},
		],
		text: "Deal {damage:6} damage. If Cinder has moved this turn, deal {damage:6} more and draw 1 card.",
		upgradeArray: [
			{
				name: "Hot Pursuit+",
				effectArray: [
					{ index: "damage", amount: 8 },
					{
						index: "damage",
						amount: 8,
						condition: {
							index: "compare",
							operation: "greater",
							left: { index: "ranksMovedThisTurn", of: "source" },
							right: 0,
						},
					},
					{
						index: "drawCards",
						amount: 1,
						condition: {
							index: "compare",
							operation: "greater",
							left: { index: "ranksMovedThisTurn", of: "source" },
							right: 0,
						},
					},
				],
				text: "Deal {damage:8} damage. If Cinder has moved this turn, deal {damage:8} more and draw 1 card.",
			},
		],
	},
	{
		index: "cinderBlaze",
		name: "Blaze",
		characterIndex: "cinder",
		archetype: "charge",
		rarity: "common",
		costArray: { energy: 2 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-blaze",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "vanguardPlume" },
		effectArray: [
			{
				index: "damage",
				amount: { index: "conditional", condition: { index: "atRank", of: "source", rank: 0 }, then: 22, else: 16 },
			},
		],
		text: "Deal {damage:16} damage; {damage:22} if Cinder is at the front.",
		upgradeArray: [
			{
				name: "Blaze+",
				effectArray: [
					{
						index: "damage",
						amount: { index: "conditional", condition: { index: "atRank", of: "source", rank: 0 }, then: 29, else: 21 },
					},
				],
				text: "Deal {damage:21} damage; {damage:29} if Cinder is at the front.",
			},
		],
	},
	{
		index: "cinderKindling",
		name: "Kindling",
		characterIndex: "cinder",
		archetype: "charge",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cinder-kindling",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "vanguardPlume" },
		effectArray: [{ index: "applyStatus", status: "fleetingStrength", stacks: 3 }, { index: "drawCards", amount: 1 }],
		upgradeArray: [
			{
				name: "Kindling+",
				effectArray: [{ index: "applyStatus", status: "fleetingStrength", stacks: 4 }, { index: "drawCards", amount: 1 }],
			},
		],
	},
	{
		index: "cinderBeaconFlame",
		name: "Beacon Flame",
		characterIndex: "cinder",
		archetype: "charge",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/cinder-beacon-flame",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "vanguardPlume" },
		effectArray: [{ index: "damage", amount: 10 }, { index: "applyStatus", status: "sundered", stacks: 1 }],
		upgradeArray: [
			{
				name: "Beacon Flame+",
				effectArray: [{ index: "damage", amount: 13 }, { index: "applyStatus", status: "sundered", stacks: 1 }],
			},
		],
	},
	{
		index: "cinderSunspear",
		name: "Sunspear",
		characterIndex: "cinder",
		archetype: "charge",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "enemy",
		playableCondition: { index: "atRank", of: "source", rank: 0 },
		layout: "horizontal",
		artPath: "cards/art/cinder-sunspear",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "wearsOutfit", outfit: "vanguardPlume" },
		effectArray: [{ index: "damage", amount: 30 }],
		text: "Deal {damage:30} damage. Playable only while Cinder is at the front.",
		upgradeArray: [
			{
				name: "Sunspear+",
				effectArray: [{ index: "damage", amount: 40 }],
				text: "Deal {damage:40} damage. Playable only while Cinder is at the front.",
			},
		],
	},
	{
		//THE CROSS-PARTY FORM: the front of the line becomes the place to be for whoever she sends there.
		index: "cinderPointOfSpear",
		name: "Point of the Spear",
		characterIndex: "cinder",
		archetype: "formation",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		//Only somebody who would actually move (see cinderChangePlaces).
		targetCondition: { index: "wouldShift", shift: "front" },
		layout: "horizontal",
		artPath: "cards/art/cinder-formation",
		effectArray: [
			{ index: "shiftParty", shift: "front" },
			{ index: "applyStatus", status: "vanguard", stacks: 1 },
		],
		text: "An ally moves to the front and gains 1 Vanguard.",
		upgradeArray: [
			{
				name: "Point of the Spear+",
				effectArray: [
					{ index: "shiftParty", shift: "front" },
					{ index: "applyStatus", status: "vanguard", stacks: 2 },
				],
				text: "An ally moves to the front and gains 2 Vanguard.",
			},
		],
	},
	{
		index: "cinderPullBack",
		name: "Pull Back",
		characterIndex: "cinder",
		archetype: "formation",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		targetCondition: { index: "wouldShift", shift: "back" },
		layout: "horizontal",
		artPath: "cards/art/cinder-formation",
		effectArray: [
			{ index: "shiftParty", shift: "back" },
			{ index: "soothe", amount: 8 },
			{ index: "temporaryHealth", amount: 4 },
		],
		text: "An ally moves to the back, loses 8 Lust and gains 4 Temporary HP.",
		upgradeArray: [
			{
				name: "Pull Back+",
				effectArray: [
					{ index: "shiftParty", shift: "back" },
					{ index: "soothe", amount: 11 },
					{ index: "temporaryHealth", amount: 5 },
				],
				text: "An ally moves to the back, loses 11 Lust and gains 5 Temporary HP.",
			},
		],
	},
	{
		index: "cinderRotateTheLine",
		name: "Rotate the Line",
		characterIndex: "cinder",
		archetype: "formation",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/cinder-rotate-the-line",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "swapParty" },
			{ index: "temporaryHealth", amount: 5 },
			{ index: "temporaryHealth", amount: 5, targetOverride: "owner" },
		],
		text: "Swap places with an ally. You both gain 5 Temporary HP.",
		upgradeArray: [
			{
				name: "Rotate the Line+",
				effectArray: [
					{ index: "swapParty" },
					{ index: "temporaryHealth", amount: 7 },
					{ index: "temporaryHealth", amount: 7, targetOverride: "owner" },
				],
				text: "Swap places with an ally. You both gain 7 Temporary HP.",
			},
		],
	},
	{
		index: "cinderFormationDrill",
		name: "Formation Drill",
		characterIndex: "cinder",
		archetype: "formation",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cinder-formation-drill",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "applyStatus", status: "formationDrill", stacks: 1 }],
		text: "Whenever an ally moves through the party's order, they gain 3 Temporary HP.",
		upgradeArray: [{ name: "Formation Drill+", costArray: { energy: 0 } }],
	},
	{
		index: "cinderRelieve",
		name: "Relieve",
		characterIndex: "cinder",
		archetype: "formation",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cinder-relieve",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "marshal" },
		effectArray: [
			{ index: "shiftParty", shift: "back" },
			{ index: "temporaryHealth", amount: 8, targetOverride: "frontAlly" },
			{ index: "applyStatus", status: "taunt", stacks: 1, targetOverride: "frontAlly" },
		],
		text: "Cinder moves to the back. The new front ally gains 8 Temporary HP and 1 Taunt.",
		upgradeArray: [
			{
				name: "Relieve+",
				effectArray: [
					{ index: "shiftParty", shift: "back" },
					{ index: "temporaryHealth", amount: 11, targetOverride: "frontAlly" },
					{ index: "applyStatus", status: "taunt", stacks: 1, targetOverride: "frontAlly" },
				],
				text: "Cinder moves to the back. The new front ally gains 11 Temporary HP and 1 Taunt.",
			},
		],
	},
	{
		index: "cinderBattleOrders",
		name: "Battle Orders",
		characterIndex: "cinder",
		archetype: "formation",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/cinder-battle-orders",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "marshal" },
		effectArray: [
			{ index: "applyStatus", status: "fleetingStrength", stacks: 2 },
			{
				index: "applyStatus",
				status: "fleetingStrength",
				stacks: 2,
				condition: { index: "compare", operation: "greater", left: { index: "ranksMovedThisTurn", of: "target" }, right: 0 },
			},
		],
		text: "An ally gains 2 Fleeting Strength; 4 if they have moved this turn.",
		upgradeArray: [
			{
				name: "Battle Orders+",
				effectArray: [
					{ index: "applyStatus", status: "fleetingStrength", stacks: 3 },
					{
						index: "applyStatus",
						status: "fleetingStrength",
						stacks: 3,
						condition: {
							index: "compare",
							operation: "greater",
							left: { index: "ranksMovedThisTurn", of: "target" },
							right: 0,
						},
					},
				],
				text: "An ally gains 3 Fleeting Strength; 6 if they have moved this turn.",
			},
		],
	},
	{
		index: "cinderDoubleBack",
		name: "Double Back",
		characterIndex: "cinder",
		archetype: "formation",
		rarity: "common",
		offerCondition: { index: "outfitUnlocked", outfit: "marshal" },
		costArray: { energy: 0 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cinder-retreat",
		effectArray: [
			{ index: "shiftParty", shift: "back" },
			{ index: "gainResource", resource: "energy", amount: 1, condition: { index: "compare", operation: "greaterOrEqual", left: { index: "tally", key: "ranksMoved" }, right: 2 } },
		],
		text: "Cinder moves to the back. If that crossed 2 or more places, gain 1 Energy.",
		upgradeArray: [
			{
				name: "Double Back+",
				effectArray: [
					{ index: "shiftParty", shift: "back" },
					{ index: "gainResource", resource: "energy", amount: 1, condition: { index: "compare", operation: "greaterOrEqual", left: { index: "tally", key: "ranksMoved" }, right: 2 } },
					{ index: "drawCards", amount: 1 },
				],
				text: "Cinder moves to the back. If that crossed 2 or more places, gain 1 Energy. Draw 1 card.",
			},
		],
	},
	{
		index: "cinderPincer",
		name: "Pincer",
		characterIndex: "cinder",
		archetype: "formation",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "enemy",
		layout: "vertical",
		artPath: "cards/art/cinder-comet",
		brokenCard: "cinderClosingJaws",
		offerCondition: { index: "outfitUnlocked", outfit: "marshal" },
		effectArray: [
			{
				index: "damage",
				amount: {
					index: "math",
					operation: "add",
					left: 6,
					right: {
						index: "math",
						operation: "multiply",
						left: { index: "count", collection: "alliesMovedThisTurn" },
						right: 6,
					},
				},
			},
		],
		text: "Deal {damage:6} damage, plus 6 for every ally who has moved this turn.",
		upgradeArray: [
			{
				name: "Pincer+",
				effectArray: [
					{
						index: "damage",
						amount: {
							index: "math",
							operation: "add",
							left: 8,
							right: {
								index: "math",
								operation: "multiply",
								left: { index: "count", collection: "alliesMovedThisTurn" },
								right: 8,
							},
						},
					},
				],
				text: "Deal {damage:8} damage, plus 8 for every ally who has moved this turn.",
			},
		],
	},
	{
		index: "cinderRallyTheRanks",
		name: "Rally the Ranks",
		characterIndex: "cinder",
		archetype: "formation",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cinder-rally-the-ranks",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "wearsOutfit", outfit: "marshal" },
		effectArray: [
			{ index: "applyStatus", status: "strength", stacks: 2, targetOverride: "otherAllies" },
			{ index: "shiftParty", shift: "back" },
		],
		text: "ALL other allies gain 2 Strength. Cinder moves to the back.",
		upgradeArray: [{ name: "Rally the Ranks+", costArray: { energy: 1 } }],
	},
	{
		index: "cinderRecklessSwing",
		name: "Reckless Swing",
		characterIndex: "cinder",
		archetype: "ashfall",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-reckless-swing",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "damage", amount: 12 },
			{ index: "applyStatus", status: "sundered", stacks: 2, targetOverride: "owner" },
		],
		text: "Deal {damage:12} damage. Cinder gains 2 Sundered.",
		upgradeArray: [
			{
				name: "Reckless Swing+",
				effectArray: [
					{ index: "damage", amount: 16 },
					{ index: "applyStatus", status: "sundered", stacks: 2, targetOverride: "owner" },
				],
				text: "Deal {damage:16} damage. Cinder gains 2 Sundered.",
			},
		],
	},
	{
		index: "cinderBurnBright",
		name: "Burn Bright",
		characterIndex: "cinder",
		archetype: "ashfall",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cinder-burn-bright",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "applyStatus", status: "sundered", stacks: 1 }, { index: "drawCards", amount: 2 }],
		text: "Cinder gains 1 Sundered. Draw 2 cards.",
		upgradeArray: [
			{
				name: "Burn Bright+",
				effectArray: [{ index: "applyStatus", status: "sundered", stacks: 1 }, { index: "drawCards", amount: 3 }],
				text: "Cinder gains 1 Sundered. Draw 3 cards.",
			},
		],
	},
	{
		index: "cinderEmberSkin",
		name: "Ember Skin",
		characterIndex: "cinder",
		archetype: "ashfall",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cinder-ember-skin",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "temporaryHealth",
				amount: {
					index: "math",
					operation: "add",
					left: 3,
					right: { index: "math", operation: "multiply", left: { index: "debuffCount", of: "source" }, right: 3 },
				},
			},
		],
		text: "Gain 3 Temporary HP, plus 3 for each debuff on Cinder.",
		upgradeArray: [
			{
				name: "Ember Skin+",
				effectArray: [
					{
						index: "temporaryHealth",
						amount: {
							index: "math",
							operation: "add",
							left: 5,
							right: { index: "math", operation: "multiply", left: { index: "debuffCount", of: "source" }, right: 4 },
						},
					},
				],
				text: "Gain 5 Temporary HP, plus 4 for each debuff on Cinder.",
			},
		],
	},
	{
		index: "cinderPhoenixHeart",
		name: "Phoenix Heart",
		characterIndex: "cinder",
		archetype: "ashfall",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cinder-phoenix-heart",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "applyStatus", status: "phoenixHeart", stacks: 1 }],
		text: "Whenever Cinder gains a debuff, deal 4 damage to the front enemy.",
		upgradeArray: [{ name: "Phoenix Heart+", costArray: { energy: 0 } }],
	},
	{
		index: "cinderAshenCloak",
		name: "Ashen Cloak",
		characterIndex: "cinder",
		archetype: "ashfall",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cinder-ashen-cloak",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "ashfall" },
		effectArray: [
			{
				index: "temporaryHealth",
				amount: { index: "math", operation: "multiply", left: { index: "debuffCount", of: "source" }, right: 5 },
			},
			{ index: "cleanse", all: true },
		],
		text: "Gain 5 Temporary HP for each debuff on Cinder, then remove them all.",
		upgradeArray: [
			{
				name: "Ashen Cloak+",
				effectArray: [
					{
						index: "temporaryHealth",
						amount: { index: "math", operation: "multiply", left: { index: "debuffCount", of: "source" }, right: 7 },
					},
					{ index: "cleanse", all: true },
				],
				text: "Gain 7 Temporary HP for each debuff on Cinder, then remove them all.",
			},
		],
	},
	{
		index: "cinderFirewalk",
		name: "Firewalk",
		characterIndex: "cinder",
		archetype: "ashfall",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-firewalk",
		//Art owed: this card has no art yet.
		artOwed: true,
		partyShift: "none",
		offerCondition: { index: "outfitUnlocked", outfit: "ashfall" },
		effectArray: [
			{
				index: "damage",
				amount: { index: "math", operation: "multiply", left: { index: "debuffCount", of: "source" }, right: 5 },
			},
			{ index: "shiftParty", shift: "back", targetOverride: "owner" },
		],
		text: "Deal 5 damage for each debuff on Cinder. She moves to the back.",
		upgradeArray: [
			{
				name: "Firewalk+",
				effectArray: [
					{
						index: "damage",
						amount: { index: "math", operation: "multiply", left: { index: "debuffCount", of: "source" }, right: 7 },
					},
					{ index: "shiftParty", shift: "back", targetOverride: "owner" },
				],
				text: "Deal 7 damage for each debuff on Cinder. She moves to the back.",
			},
		],
	},
	{
		index: "cinderPassTheFlame",
		name: "Pass the Flame",
		characterIndex: "cinder",
		archetype: "ashfall",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-pass-the-flame",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "ashfall" },
		effectArray: [{ index: "damage", amount: 4 }, { index: "transferStatuses", from: "source", move: true }],
		text: "Deal {damage:4} damage. Move all of Cinder's debuffs onto the target.",
		upgradeArray: [
			{
				name: "Pass the Flame+",
				effectArray: [{ index: "damage", amount: 5 }, { index: "transferStatuses", from: "source", move: true }],
				text: "Deal {damage:7} damage. Move all of Cinder's debuffs onto the target.",
			},
		],
	},
	{
		index: "cinderTrialByFire",
		name: "Trial by Fire",
		characterIndex: "cinder",
		archetype: "ashfall",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/cinder-trial-by-fire",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "ashfall" },
		effectArray: [
			{ index: "applyStatus", status: "sundered", stacks: 1 },
			{ index: "applyStatus", status: "strength", stacks: 2 },
		],
		text: "ALL allies gain 1 Sundered and 2 Strength.",
		upgradeArray: [
			{
				name: "Trial by Fire+",
				effectArray: [
					{ index: "applyStatus", status: "sundered", stacks: 1 },
					{ index: "applyStatus", status: "strength", stacks: 3 },
				],
				text: "ALL allies gain 1 Sundered and 3 Strength.",
			},
		],
	},
	{
		index: "cinderCindersToAsh",
		name: "Cinders to Ash",
		characterIndex: "cinder",
		archetype: "ashfall",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/cinder-cinders-to-ash",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "wearsOutfit", outfit: "ashfall" },
		effectArray: [
			{
				index: "damage",
				amount: {
					index: "math",
					operation: "add",
					left: 8,
					right: { index: "math", operation: "multiply", left: { index: "debuffCount", of: "source" }, right: 5 },
				},
			},
		],
		text: "Deal {damage:8} damage, plus 5 for each debuff on Cinder, to ALL enemies.",
		upgradeArray: [
			{
				name: "Cinders to Ash+",
				effectArray: [
					{
						index: "damage",
						amount: {
							index: "math",
							operation: "add",
							left: 11,
							right: { index: "math", operation: "multiply", left: { index: "debuffCount", of: "source" }, right: 6 },
						},
					},
				],
				text: "Deal {damage:11} damage, plus 6 for each debuff on Cinder, to ALL enemies.",
			},
		],
	},
	//--- clemence -------------------------------------------------------------------------------
	{
		index: "clemenceMendingWord",
		name: "Mending Word",
		characterIndex: "clemence",
		archetype: "mercy",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-mending-word",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceMendingWordBroken",
		effectArray: [
			{ index: "heal", amount: 7 },
			{ index: "lust", amount: 4, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "An ally heals 7 HP. Clemence gains 4 Lust.",
		upgradeArray: [
			{
				name: "Mending Word+",
				effectArray: [
					{ index: "heal", amount: 9 },
					{ index: "lust", amount: 4, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "An ally heals 9 HP. Clemence gains 4 Lust.",
			},
		],
	},
	{
		index: "clemenceLayOnHands",
		name: "Lay On Hands",
		characterIndex: "clemence",
		archetype: "mercy",
		rarity: "common",
		costArray: { energy: 2 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/clemence-absolve",
		brokenCard: "clemenceLayOnHandsBroken",
		effectArray: [
			{
				index: "forEachTarget", over: "allAllies",
				effectArray: [
					{ index: "heal", amount: 4 },
					{ index: "heal", amount: 2, condition: { index: "compare", operation: "greater", left: { index: "stat", stat: "lust", of: "target" }, right: 0 } },
				],
			},
			{ index: "lust", amount: 8, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "ALL allies heal 4 HP, or 6 if they have Lust. Clemence gains 8 Lust.",
		upgradeArray: [
			{
				name: "Lay On Hands+",
				effectArray: [
					{
						index: "forEachTarget", over: "allAllies",
						effectArray: [
							{ index: "heal", amount: 6 },
							{ index: "heal", amount: 3, condition: { index: "compare", operation: "greater", left: { index: "stat", stat: "lust", of: "target" }, right: 0 } },
						],
					},
					{ index: "lust", amount: 8, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "ALL allies heal 6 HP, or 9 if they have Lust. Clemence gains 8 Lust.",
			},
		],
	},
	{
		index: "clemenceHeavenlyGaze",
		name: "Heavenly Gaze",
		characterIndex: "clemence",
		archetype: "mercy",
		rarity: "common",
		tagArray: ["exposure"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/clemence-heavenly-gaze",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceHeavenlyGazeBroken",
		effectArray: [
			{
				index: "drawCards",
				amount: 1,
				condition: {
					index: "compare",
					operation: "greater",
					left: { index: "stat", stat: "lust", of: "source" },
					right: { index: "stat", stat: "lust", of: "target" },
				},
			},
			{ index: "lust", amount: 9 },
		],
		text: "Inflict 9 Lust. If Clemence has more Lust than the target, draw 1 card.",
		upgradeArray: [
			{
				name: "Heavenly Gaze+",
				effectArray: [
					{
						index: "drawCards",
						amount: 1,
						condition: {
							index: "compare",
							operation: "greater",
							left: { index: "stat", stat: "lust", of: "source" },
							right: { index: "stat", stat: "lust", of: "target" },
						},
					},
					{ index: "lust", amount: 12 },
				],
				text: "Inflict 12 Lust. If Clemence has more Lust than the target, draw 1 card.",
			},
		],
	},
	{
		index: "clemenceMartyrsVow",
		name: "Martyr's Vow",
		characterIndex: "clemence",
		archetype: "mercy",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/clemence-martyr",
		brokenCard: "clemenceMartyrsVowBroken",
		effectArray: [
			{ index: "applyStatus", status: "martyrsVow", stacks: 1 },
			{ index: "lust", amount: 4, lustTagArray: ["penance"] },
		],
		text: "Gain Martyr's Vow. Clemence gains 4 Lust.",
		upgradeArray: [
			{ name: "Martyr's Vow+", costArray: { energy: 0 } },
		],
	},
	{
		index: "clemenceFontOfGrace",
		name: "Font of Grace",
		characterIndex: "clemence",
		archetype: "mercy",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-font-of-grace",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceFontOfGraceBroken",
		effectArray: [{ index: "applyStatus", status: "fontOfGrace", stacks: 1 }],
		text: "At the start of your turn, the most hurt ally heals 5 HP and Clemence gains 3 Lust.",
		upgradeArray: [{ name: "Font of Grace+", costArray: { energy: 1 } }],
	},
	{
		index: "clemenceShelteringGrace",
		name: "Sheltering Grace",
		characterIndex: "clemence",
		archetype: "devotion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-absolve",
		brokenCard: "clemenceShelteringGraceBroken",
		effectArray: [
			{ index: "temporaryHealth", amount: 9 },
			{
				index: "temporaryHealth",
				amount: 3,
				condition: { index: "compare", operation: "greater", left: { index: "stat", stat: "lust", of: "target" }, right: 0 },
			},
			{ index: "lust", amount: 4, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "An ally gains 9 Temporary HP, or 12 if they have Lust. Clemence gains 4 Lust.",
		upgradeArray: [
			{
				name: "Sheltering Grace+",
				effectArray: [
					{ index: "temporaryHealth", amount: 12 },
					{
						index: "temporaryHealth",
						amount: 4,
						condition: {
							index: "compare",
							operation: "greater",
							left: { index: "stat", stat: "lust", of: "target" },
							right: 0,
						},
					},
					{ index: "lust", amount: 4, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "An ally gains 12 Temporary HP, or 16 if they have Lust. Clemence gains 4 Lust.",
			},
		],
	},
	{
		index: "clemenceAnsweredPrayer",
		name: "Answered Prayer",
		characterIndex: "clemence",
		archetype: "devotion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-answered-prayer",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceAnsweredPrayerBroken",
		effectArray: [
			{
				index: "chooseOption",
				prompt: "How is the prayer answered?",
				optionArray: [
					{
						index: "heal",
						name: "Mend",
						effectArray: [{ index: "heal", amount: 7 }],
						description: "The ally heals 7 HP.",
					},
					{
						index: "devotion",
						name: "Devote",
						effectArray: [
							{
								index: "branch",
								test: { index: "mechanicAtLeast", mechanic: "devotion", amount: 8 },
								thenArray: [
									{ index: "spendMechanic", mechanic: "devotion", amount: 8 },
									{ index: "gainResource", resource: "energy", amount: 1 },
									{ index: "drawCards", amount: 2 },
								],
								elseArray: [],
							},
						],
						description: "Spend 8 Devotion: gain 1 Energy and draw 2 cards.",
					},
				],
			},
		],
		text: "Choose one: an ally heals 7 HP; or spend 8 Devotion to gain 1 Energy and draw 2 cards.",
		upgradeArray: [
			{
				name: "Answered Prayer+",
				effectArray: [
					{
						index: "chooseOption",
						prompt: "How is the prayer answered?",
						optionArray: [
							{
								index: "heal",
								name: "Mend",
								effectArray: [{ index: "heal", amount: 10 }],
								description: "The ally heals 10 HP.",
							},
							{
								index: "devotion",
								name: "Devote",
								effectArray: [
									{
										index: "branch",
										test: { index: "mechanicAtLeast", mechanic: "devotion", amount: 8 },
										thenArray: [
											{ index: "spendMechanic", mechanic: "devotion", amount: 8 },
											{ index: "gainResource", resource: "energy", amount: 1 },
											{ index: "drawCards", amount: 2 },
										],
										elseArray: [],
									},
								],
								description: "Spend 8 Devotion: gain 1 Energy and draw 2 cards.",
							},
						],
					},
				],
				text: "Choose one: an ally heals 10 HP; or spend 8 Devotion to gain 1 Energy and draw 2 cards.",
			},
		],
	},
	{
		index: "clemenceStayWithMe",
		name: "Stay With Me",
		characterIndex: "clemence",
		archetype: "devotion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-stay-with-me",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceStayWithMeBroken",
		effectArray: [
			{
				index: "temporaryHealth",
				amount: { index: "math", operation: "min", left: { index: "stat", stat: "lust", of: "target" }, right: 12 },
			},
		],
		text: "An ally gains Temporary HP equal to their Lust, up to 12.",
		upgradeArray: [
			{
				name: "Stay With Me+",
				effectArray: [
					{
						index: "temporaryHealth",
						amount: { index: "math", operation: "min", left: { index: "stat", stat: "lust", of: "target" }, right: 16 },
					},
				],
				text: "An ally gains Temporary HP equal to their Lust, up to 16.",
			},
		],
	},
	{
		index: "clemenceSanctuary",
		name: "Sanctuary",
		characterIndex: "clemence",
		archetype: "devotion",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/clemence-sanctuary",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceSanctuaryBroken",
		effectArray: [
			{ index: "temporaryHealth", amount: 10 },
			{ index: "lust", amount: 6, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "ALL allies gain 10 Temporary HP. Clemence gains 6 Lust.",
		upgradeArray: [
			{
				name: "Sanctuary+",
				effectArray: [
					{ index: "temporaryHealth", amount: 13 },
					{ index: "lust", amount: 6, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "ALL allies gain 13 Temporary HP. Clemence gains 6 Lust.",
			},
		],
	},
	{
		index: "clemenceMercy",
		name: "Mercy",
		characterIndex: "clemence",
		archetype: "devotion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "mostHurtAlly",
		layout: "horizontal",
		artPath: "cards/art/clemence-mercy",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceMercyBroken",
		offerCondition: { index: "outfitUnlocked", outfit: "devotee" },
		effectArray: [
			{ index: "heal", amount: 10 },
			{ index: "lust", amount: 6, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "The most hurt ally heals 10 HP. Clemence gains 6 Lust.",
		upgradeArray: [
			{
				name: "Mercy+",
				effectArray: [
					{ index: "heal", amount: 13 },
					{ index: "lust", amount: 6, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "The most hurt ally heals 13 HP. Clemence gains 6 Lust.",
			},
		],
	},
	{
		index: "clemenceBearTheWeight",
		name: "Bear the Weight",
		characterIndex: "clemence",
		archetype: "devotion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/clemence-bear-the-weight",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceBearTheWeightBroken",
		offerCondition: { index: "outfitUnlocked", outfit: "devotee" },
		effectArray: [
			{ index: "temporaryHealth", amount: 7 },
			{ index: "temporaryHealth", amount: 7, targetOverride: "owner" },
			{ index: "lust", amount: 3, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "An ally and Clemence each gain 7 Temporary HP. Clemence gains 3 Lust.",
		upgradeArray: [
			{
				name: "Bear the Weight+",
				effectArray: [
					{ index: "temporaryHealth", amount: 9 },
					{ index: "temporaryHealth", amount: 9, targetOverride: "owner" },
					{ index: "lust", amount: 3, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "An ally and Clemence each gain 9 Temporary HP. Clemence gains 3 Lust.",
			},
		],
	},
	{
		//RENAMED "Blessed Endurance". The INDEX is left alone: it is written into
		//every saved deck that holds a copy, and a player never sees it.
		index: "clemenceHairShirt",
		name: "Blessed Endurance",
		characterIndex: "clemence",
		archetype: "devotion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-hair-shirt",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceHairShirtBroken",
		offerCondition: { index: "outfitUnlocked", outfit: "devotee" },
		effectArray: [
			{ index: "temporaryHealth", amount: 10 },
			{ index: "lust", amount: 4, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "Clemence gains 10 Temporary HP and 4 Lust.",
		upgradeArray: [
			{
				name: "Blessed Endurance+",
				effectArray: [
					{ index: "temporaryHealth", amount: 13 },
					{ index: "lust", amount: 4, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "Clemence gains 13 Temporary HP and 4 Lust.",
			},
		],
	},
	{
		index: "clemenceBlessing",
		name: "Blessing",
		characterIndex: "clemence",
		archetype: "devotion",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-blessing",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceBlessingBroken",
		offerCondition: { index: "outfitUnlocked", outfit: "devotee" },
		effectArray: [{ index: "applyStatus", status: "blessing", stacks: 1 }],
		text: "Whenever an ally gains Temporary HP, they gain 2 more.",
		upgradeArray: [{ name: "Blessing+", costArray: { energy: 0 } }],
	},
	{
		index: "clemenceMiracle",
		name: "Miracle",
		characterIndex: "clemence",
		archetype: "devotion",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/clemence-miracle",
		//Art owed: this card has no art yet.
		artOwed: true,
		exhausts: true,
		brokenCard: "clemenceMiracleBroken",
		offerCondition: { index: "wearsOutfit", outfit: "devotee" },
		effectArray: [{ index: "heal", amount: 12 }],
		upgradeArray: [{ name: "Miracle+", effectArray: [{ index: "heal", amount: 16 }] }],
	},
	{
		index: "clemencePrayer",
		name: "Fervent Prayer",
		characterIndex: "clemence",
		archetype: "rapture",
		rarity: "common",
		costArray: { energy: 0 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-rebuke",
		brokenCard: "clemencePrayerBroken",
		effectArray: [
			{ index: "gainResource", resource: "energy", amount: 1 },
			{ index: "lust", amount: 7, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "Gain 1 Energy. Clemence gains 7 Lust.",
		upgradeArray: [
			{
				name: "Fervent Prayer+",
				effectArray: [
					{ index: "gainResource", resource: "energy", amount: 1 },
					{ index: "lust", amount: 5, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "Gain 1 Energy. Clemence gains 5 Lust.",
			},
		],
	},
	{
		index: "clemenceConfide",
		name: "Confide",
		characterIndex: "clemence",
		archetype: "rapture",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-confess",
		brokenCard: "clemenceConfideBroken",
		effectArray: [
			{ index: "drawCards", amount: 3 },
			{ index: "lust", amount: 5, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "Draw 3 cards. Clemence gains 5 Lust.",
		upgradeArray: [
			{
				name: "Confide+",
				effectArray: [
					{ index: "drawCards", amount: 4 },
					{ index: "lust", amount: 5, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "Draw 4 cards. Clemence gains 5 Lust.",
			},
		],
	},
	{
		index: "clemenceWantonGaze",
		name: "Wanton Gaze",
		characterIndex: "clemence",
		archetype: "rapture",
		rarity: "common",
		tagArray: ["exposure"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/clemence-wanton-gaze",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceWantonGazeBroken",
		effectArray: [
			{ index: "lust", amount: 10 },
			{ index: "lust", amount: 5, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "Inflict 10 Lust. Clemence gains 5 Lust.",
		upgradeArray: [
			{
				name: "Wanton Gaze+",
				effectArray: [
					{ index: "lust", amount: 13 },
					{ index: "lust", amount: 5, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "Inflict 13 Lust. Clemence gains 5 Lust.",
			},
		],
	},
	{
		index: "clemenceEcstasy",
		name: "Ecstasy",
		characterIndex: "clemence",
		archetype: "rapture",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/clemence-martyr",
		brokenCard: "clemenceEcstasyBroken",
		effectArray: [
			{ index: "applyStatus", status: "ecstasy", stacks: 1 },
			{ index: "lust", amount: 8, lustTagArray: ["penance"] },
		],
		text: "Gain Ecstasy. Clemence gains 8 Lust.",
		upgradeArray: [
			{ name: "Ecstasy+", costArray: { energy: 1 } },
		],
	},
	{
		index: "clemenceConfession",
		name: "Confession",
		characterIndex: "clemence",
		archetype: "rapture",
		rarity: "common",
		tagArray: ["exposure"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/clemence-confess",
		brokenCard: "clemenceConfessionBroken",
		offerCondition: { index: "outfitUnlocked", outfit: "ecstatic" },
		effectArray: [
			{ index: "lust", amount: 6 },
			{ index: "applyStatus", status: "sensitive", stacks: 2 },
			{ index: "lust", amount: 4, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "Inflict 6 Lust and 2 Sensitive. Clemence gains 4 Lust.",
		upgradeArray: [
			{
				name: "Confession+",
				effectArray: [
					{ index: "lust", amount: 8 },
					{ index: "applyStatus", status: "sensitive", stacks: 3 },
					{ index: "lust", amount: 4, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "Inflict 8 Lust and 3 Sensitive. Clemence gains 4 Lust.",
			},
		],
	},
	{
		index: "clemenceLetGo",
		name: "Let Go",
		characterIndex: "clemence",
		archetype: "rapture",
		rarity: "common",
		tagArray: ["exposure"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/clemence-let-go",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceLetGoBroken",
		offerCondition: { index: "outfitUnlocked", outfit: "ecstatic" },
		effectArray: [
			{ index: "lust", amount: 12, targetOverride: "owner", lustTagArray: ["penance"] },
			{
				index: "lust",
				amount: { index: "math", operation: "divide", left: { index: "stat", stat: "lust", of: "source" }, right: 2 },
			},
		],
		text: "Clemence gains 12 Lust. Inflict Lust equal to half of Clemence's.",
		upgradeArray: [{ name: "Let Go+", costArray: { energy: 0 } }],
	},
	{
		index: "clemenceSoftWords",
		name: "Soft Words",
		characterIndex: "clemence",
		archetype: "rapture",
		rarity: "common",
		tagArray: ["exposure"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/clemence-confess",
		brokenCard: "clemenceSoftWordsBroken",
		offerCondition: { index: "outfitUnlocked", outfit: "ecstatic" },
		effectArray: [
			{
				index: "drawCards",
				amount: 1,
				condition: { index: "compare", operation: "greater", left: { index: "stat", stat: "lust", of: "target" }, right: 0 },
			},
			{ index: "applyStatus", status: "weak", stacks: 1 },
			{ index: "lust", amount: 6 },
			{ index: "lust", amount: 3, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "Inflict 1 Weak and 6 Lust. If it already had Lust, draw 1 card. Clemence gains 3 Lust.",
		upgradeArray: [
			{
				name: "Soft Words+",
				effectArray: [
					{
						index: "drawCards",
						amount: 1,
						condition: {
							index: "compare",
							operation: "greater",
							left: { index: "stat", stat: "lust", of: "target" },
							right: 0,
						},
					},
					{ index: "applyStatus", status: "weak", stacks: 1 },
					{ index: "lust", amount: 9 },
					{ index: "lust", amount: 3, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "Inflict 1 Weak and 9 Lust. If it already had Lust, draw 1 card. Clemence gains 3 Lust.",
			},
		],
	},
	{
		index: "clemenceRapturesGift",
		name: "Rapture's Gift",
		characterIndex: "clemence",
		archetype: "rapture",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-rapture-s-gift",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceRapturesGiftBroken",
		offerCondition: { index: "outfitUnlocked", outfit: "ecstatic" },
		effectArray: [{ index: "applyStatus", status: "rapturesGift", stacks: 1 }],
		text: "When Clemence Breaks, ALL other allies gain 2 Strength and 8 Temporary HP.",
		upgradeArray: [{ name: "Rapture's Gift+", costArray: { energy: 0 } }],
	},
	{
		//The button for the moment: break now, and the party is looked after as she goes.
		index: "clemenceSurrender",
		name: "Surrender",
		characterIndex: "clemence",
		archetype: "rapture",
		rarity: "rare",
		offerCondition: { index: "wearsOutfit", outfit: "ecstatic" },
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/clemence-martyr",
		exhausts: true,
		brokenCard: "clemenceSurrenderBroken",
		effectArray: [
			{ index: "heal", amount: 6, targetOverride: "allAllies" },
			{ index: "lust", amount: { index: "lustToBreak", of: "source" }, lustTagArray: ["penance"] },
		],
		text: "ALL allies heal 6 HP. Then Clemence gains Lust until she Breaks. Exhaust.",
		upgradeArray: [
			{
				name: "Surrender+",
				effectArray: [
					{ index: "heal", amount: 10, targetOverride: "allAllies" },
					{ index: "lust", amount: { index: "lustToBreak", of: "source" }, lustTagArray: ["penance"] },
				],
				text: "ALL allies heal 10 HP. Then Clemence gains Lust until she Breaks. Exhaust.",
			},
		],
	},
	//--- Sanctuary: the whole party on the razor's edge ---
	{
		index: "clemenceSanctify",
		name: "Sanctify",
		characterIndex: "clemence",
		archetype: "sanctuary",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-absolve",
		brokenCard: "clemenceSanctifyBroken",
		effectArray: [
			{ index: "applyStatus", status: "sanctified", stacks: 1 },
			{ index: "lust", amount: 5, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "An ally gains Sanctified. Clemence gains 5 Lust.",
		upgradeArray: [
			{
				name: "Sanctify+",
				effectArray: [
					{ index: "applyStatus", status: "sanctified", stacks: 1 },
					{ index: "drawCards", amount: 1 },
					{ index: "lust", amount: 5, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "An ally gains Sanctified. Draw 1 card. Clemence gains 5 Lust.",
			},
		],
	},
	{
		index: "clemenceFallenVigil",
		name: "Fallen Vigil",
		characterIndex: "clemence",
		archetype: "sanctuary",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-absolve",
		brokenCard: "clemenceFallenVigilBroken",
		effectArray: [
			{ index: "heal", amount: 5 },
			{ index: "heal", amount: 5, condition: { index: "isBroken", of: "target" } },
			{ index: "drawCards", amount: 1, condition: { index: "isBroken", of: "target" } },
			{ index: "lust", amount: 4, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "An ally heals 5 HP. If they are Broken, heal 5 more and draw 1 card. Clemence gains 4 Lust.",
		upgradeArray: [
			{
				name: "Fallen Vigil+",
				effectArray: [
					{ index: "heal", amount: 7 },
					{ index: "heal", amount: 7, condition: { index: "isBroken", of: "target" } },
					{ index: "drawCards", amount: 1, condition: { index: "isBroken", of: "target" } },
					{ index: "lust", amount: 4, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "An ally heals 7 HP. If they are Broken, heal 7 more and draw 1 card. Clemence gains 4 Lust.",
			},
		],
	},
	{
		index: "clemenceKindledWant",
		name: "Kindled Want",
		characterIndex: "clemence",
		archetype: "sanctuary",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/clemence-kindled-want",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceKindledWantBroken",
		effectArray: [{ index: "lust", amount: 6 }, { index: "applyStatus", status: "fleetingStrength", stacks: 3 }],
		text: "An ally gains 6 Lust and 3 Fleeting Strength.",
		upgradeArray: [
			{
				name: "Kindled Want+",
				effectArray: [{ index: "lust", amount: 6 }, { index: "applyStatus", status: "fleetingStrength", stacks: 4 }],
				text: "An ally gains 6 Lust and 4 Fleeting Strength.",
			},
		],
	},
	{
		index: "clemenceBrokenSaints",
		name: "Broken Saints",
		characterIndex: "clemence",
		archetype: "sanctuary",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/clemence-broken-saints",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceBrokenSaintsBroken",
		effectArray: [
			{ index: "applyStatus", status: "strength", stacks: 3, condition: { index: "isBroken", of: "target" } },
			{ index: "temporaryHealth", amount: 8, condition: { index: "isBroken", of: "target" } },
			{ index: "lust", amount: 6, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "ALL Broken allies gain 3 Strength and 8 Temporary HP. Clemence gains 6 Lust.",
		upgradeArray: [
			{
				name: "Broken Saints+",
				effectArray: [
					{ index: "applyStatus", status: "strength", stacks: 4, condition: { index: "isBroken", of: "target" } },
					{ index: "temporaryHealth", amount: 11, condition: { index: "isBroken", of: "target" } },
					{ index: "lust", amount: 6, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "ALL Broken allies gain 4 Strength and 11 Temporary HP. Clemence gains 6 Lust.",
			},
		],
	},
	{
		index: "clemenceOrdeal",
		name: "Ordeal",
		characterIndex: "clemence",
		archetype: "sanctuary",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/clemence-ordeal",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceOrdealBroken",
		offerCondition: { index: "outfitUnlocked", outfit: "abbess" },
		effectArray: [{ index: "lust", amount: 10 }, { index: "temporaryHealth", amount: 10 }],
		text: "An ally gains 10 Lust and 10 Temporary HP.",
		upgradeArray: [
			{
				name: "Ordeal+",
				effectArray: [{ index: "lust", amount: 10 }, { index: "temporaryHealth", amount: 10 }],
				text: "An ally gains 10 Lust and 14 Temporary HP.",
			},
		],
	},
	{
		index: "clemencePenitentsDraw",
		name: "Penitent's Draw",
		characterIndex: "clemence",
		archetype: "sanctuary",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/clemence-penitent-s-draw",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemencePenitentsDrawBroken",
		offerCondition: { index: "outfitUnlocked", outfit: "abbess" },
		effectArray: [{ index: "lust", amount: 6 }, { index: "drawCards", amount: 2 }],
		text: "An ally gains 6 Lust. Draw 2 cards.",
		upgradeArray: [
			{
				name: "Penitent's Draw+",
				effectArray: [{ index: "lust", amount: 6 }, { index: "drawCards", amount: 3 }],
				text: "An ally gains 6 Lust. Draw 3 cards.",
			},
		],
	},
	{
		index: "clemenceAnoint",
		name: "Anoint",
		characterIndex: "clemence",
		archetype: "sanctuary",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		targetCondition: { index: "isBroken", of: "target" },
		layout: "horizontal",
		artPath: "cards/art/clemence-anoint",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "clemenceAnointBroken",
		offerCondition: { index: "outfitUnlocked", outfit: "abbess" },
		effectArray: [
			{ index: "heal", amount: 12 },
			{ index: "lust", amount: 6, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "A Broken ally heals 12 HP. Clemence gains 6 Lust.",
		upgradeArray: [
			{
				name: "Anoint+",
				effectArray: [
					{ index: "heal", amount: 16 },
					{ index: "lust", amount: 6, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "A Broken ally heals 16 HP. Clemence gains 6 Lust.",
			},
		],
	},
	{
		index: "clemenceSharedFever",
		name: "Shared Fever",
		characterIndex: "clemence",
		archetype: "sanctuary",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-confess",
		brokenCard: "clemenceSharedFeverBroken",
		offerCondition: { index: "outfitUnlocked", outfit: "abbess" },
		effectArray: [
			{ index: "lust", amount: 6, targetOverride: "otherAllies" },
			{ index: "gainResource", resource: "energy", amount: 2 },
		],
		text: "Each other ally gains 6 Lust. Gain 2 Energy.",
		upgradeArray: [{ name: "Shared Fever+", costArray: { energy: 0 } }],
	},
	{
		index: "clemenceCommunion",
		name: "Communion",
		characterIndex: "clemence",
		archetype: "sanctuary",
		rarity: "rare",
		offerCondition: { index: "wearsOutfit", outfit: "abbess" },
		costArray: { energy: 2 },
		targetMode: "allAllies",
		layout: "vertical",
		artPath: "cards/art/clemence-rebuke",
		exhausts: true,
		brokenCard: "clemenceCommunionBroken",
		effectArray: [
			{ index: "applyStatus", status: "sanctified", stacks: 1 },
			{ index: "lust", amount: 10, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "ALL allies gain Sanctified. Clemence gains 10 Lust. Exhaust.",
		upgradeArray: [
			{ name: "Communion+", costArray: { energy: 1 } },
		],
	},
	//--- cassadora -------------------------------------------------------------------------------
	{
		index: "cassadoraTwistFate",
		name: "Twist Fate",
		characterIndex: "cassadora",
		archetype: "intents",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-twist-fate",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "damage", amount: 5 }, { index: "rerollIntent" }],
		text: "Deal {damage:5} damage. The target picks a new intent.",
		upgradeArray: [
			{
				name: "Twist Fate+",
				effectArray: [{ index: "damage", amount: 7 }, { index: "rerollIntent" }],
				text: "Deal {damage:8} damage. The target picks a new intent.",
			},
		],
	},
	{
		index: "cassadoraOmen",
		name: "Omen",
		characterIndex: "cassadora",
		archetype: "intents",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-omen",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "damage",
				amount: {
					index: "math",
					operation: "add",
					left: 4,
					right: {
						index: "math",
						operation: "add",
						left: { index: "math", operation: "multiply", left: { index: "attackingOpponents" }, right: 3 },
						right: {
							index: "math",
							operation: "multiply",
							left: { index: "mechanic", mechanic: "foresight", of: "source" },
							right: 2,
						},
					},
				},
			},
		],
		text: "Deal {damage:4} damage, plus 3 for each enemy intending to attack and 2 for each filled Orb quadrant.",
		upgradeArray: [
			{
				name: "Omen+",
				effectArray: [
					{
						index: "damage",
						amount: {
							index: "math",
							operation: "add",
							left: 7,
							right: {
								index: "math",
								operation: "add",
								left: { index: "math", operation: "multiply", left: { index: "attackingOpponents" }, right: 3 },
								right: {
									index: "math",
									operation: "multiply",
									left: { index: "mechanic", mechanic: "foresight", of: "source" },
									right: 2,
								},
							},
						},
					},
				],
				text: "Deal {damage:7} damage, plus 3 for each enemy intending to attack and 2 for each filled Orb quadrant.",
			},
		],
	},
	{
		index: "cassadoraCrossMyPalm",
		name: "Cross My Palm",
		characterIndex: "cassadora",
		archetype: "intents",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-cross-my-palm",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "chooseOption",
				prompt: "Read which way?",
				optionArray: [
					{
						index: "change",
						name: "Twist",
						effectArray: [{ index: "rerollIntent" }],
						description: "The target picks a new intent.",
					},
					{
						index: "read",
						name: "Read",
						effectArray: [
							{ index: "spendMechanic", mechanic: "foresight", all: true },
							{ index: "drawCards", amount: { index: "tally", key: "mechanicSpent" } },
							{
								index: "gainResource",
								resource: "energy",
								amount: 1,
								condition: {
									index: "compare",
									operation: "greaterOrEqual",
									left: { index: "tally", key: "mechanicSpent" },
									right: 4,
								},
							},
						],
						description: "Empty the Orb: draw 1 card per quadrant, and gain 1 Energy if it was full.",
					},
				],
			},
		],
		text: "Choose one: the target picks a new intent; or empty the Orb to draw 1 card per quadrant, gaining 1 Energy if it was full.",
		upgradeArray: [{ name: "Cross My Palm+", costArray: { energy: 0 } }],
	},
	{
		index: "cassadoraJinx",
		name: "Evil Eye",
		characterIndex: "cassadora",
		archetype: "intents",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/cassadora-fate",
		effectArray: [{ index: "applyStatus", status: "jinx", stacks: 1 }],
		text: "Whenever an enemy's intent is changed, it takes 6 damage.",
		upgradeArray: [{ name: "Evil Eye+", costArray: { energy: 0 } }],
	},
	{
		index: "cassadoraWheelOfFortune",
		name: "Wheel of Fortune",
		characterIndex: "cassadora",
		archetype: "intents",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/cassadora-wheel-of-fortune",
		//Art owed: this card has no art yet.
		artOwed: true,
		brokenCard: "cassadoraStillnessWithin",
		effectArray: [
			{ index: "rerollIntent" },
			{
				index: "temporaryHealth",
				amount: {
					index: "math",
					operation: "multiply",
					left: {
						index: "math",
						operation: "subtract",
						left: { index: "count", collection: "livingEnemies" },
						right: { index: "attackingOpponents" },
					},
					right: 4,
				},
				targetOverride: "allAllies",
			},
		],
		text: "ALL enemies pick new intents. ALL allies gain 4 Temporary HP for each enemy that is no longer attacking.",
		upgradeArray: [{ name: "Wheel of Fortune+", costArray: { energy: 1 } }],
	},
	{
		index: "cassadoraEncore",
		name: "Encore",
		characterIndex: "cassadora",
		archetype: "repertoire",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "self",
		layout: "horizontal",
		artPath: "cards/art/cassadora-fate",
		effectArray: [{ index: "drawCards", amount: 2 }, { index: "scry", count: 2 }],
		upgradeArray: [
			{
				name: "Encore+",
				effectArray: [{ index: "drawCards", amount: 2 }, { index: "scry", count: 4 }],
				text: "Draw 2 cards. Scry 4.",
			},
		],
	},
	{
		index: "cassadoraDivination",
		name: "Divination",
		characterIndex: "cassadora",
		archetype: "repertoire",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "self",
		layout: "horizontal",
		artPath: "cards/art/cassadora-divination",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "scry", count: 4 }, { index: "drawCards", amount: 2 }],
		upgradeArray: [{ name: "Divination+", effectArray: [{ index: "scry", count: 4 }, { index: "drawCards", amount: 3 }] }],
	},
	{
		index: "cassadoraPalmReading",
		name: "Palm Reading",
		characterIndex: "cassadora",
		archetype: "repertoire",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/cassadora-palm-reading",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "drawOwnedCard" }, { index: "temporaryHealth", amount: 5 }],
		text: "Draw one of an ally's cards. That ally gains 5 Temporary HP.",
		upgradeArray: [
			{
				name: "Palm Reading+",
				effectArray: [{ index: "drawOwnedCard" }, { index: "temporaryHealth", amount: 7 }],
				text: "Draw one of an ally's cards. That ally gains 8 Temporary HP.",
			},
		],
	},
	{
		index: "cassadoraAugury",
		name: "Augury",
		characterIndex: "cassadora",
		archetype: "repertoire",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cassadora-augury",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "scry", count: 2 }, { index: "applyStatus", status: "focus", stacks: 1 }],
		text: "Scry 2. Draw 1 more card at the start of each turn.",
		upgradeArray: [{ name: "Augury+", costArray: { energy: 0 } }],
	},
	{
		index: "cassadoraReshuffle",
		name: "Reshuffle",
		characterIndex: "cassadora",
		archetype: "repertoire",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "self",
		layout: "horizontal",
		artPath: "cards/art/cassadora-reshuffle",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "soothsayer" },
		effectArray: [{ index: "drawCards", amount: 3 }, { index: "discardCards", amount: 1 }],
		upgradeArray: [
			{
				name: "Reshuffle+",
				effectArray: [{ index: "drawCards", amount: 4 }, { index: "discardCards", amount: 1 }],
			},
		],
	},
	{
		index: "cassadoraCardUpSleeve",
		name: "Card Up the Sleeve",
		characterIndex: "cassadora",
		archetype: "repertoire",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "self",
		layout: "horizontal",
		artPath: "cards/art/cassadora-card-up-the-sleeve",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "soothsayer" },
		effectArray: [
			{
				index: "chooseCards",
				effectArray: [{ index: "returnCardToHand" }, { index: "modifyCardCost", amount: -1 }],
				from: "discardPileCard",
				prompt: "Return which card to your hand?",
				minimum: 0,
				maximum: 1,
			},
		],
		text: "Return a card from your discard pile to your hand. It costs 1 less this combat.",
		upgradeArray: [{ name: "Card Up the Sleeve+", costArray: { energy: 0 } }],
	},
	{
		index: "cassadoraPortent",
		name: "Portent",
		characterIndex: "cassadora",
		archetype: "repertoire",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cassadora-portent",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "soothsayer" },
		effectArray: [{ index: "scry", count: 3 }, { index: "temporaryHealth", amount: 6 }],
		upgradeArray: [{ name: "Portent+", effectArray: [{ index: "scry", count: 3 }, { index: "temporaryHealth", amount: 8 }] }],
	},
	{
		index: "cassadoraDestinysHand",
		name: "Destiny's Hand",
		characterIndex: "cassadora",
		archetype: "repertoire",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "otherAllies",
		layout: "horizontal",
		artPath: "cards/art/cassadora-destiny-s-hand",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "soothsayer" },
		effectArray: [
			{ index: "forEachTarget", effectArray: [{ index: "drawOwnedCard" }], over: "otherAllies" },
			{ index: "gainResource", resource: "energy", amount: 1 },
		],
		text: "Draw one card belonging to each other ally. Gain 1 Energy.",
		upgradeArray: [{ name: "Destiny's Hand+", costArray: { energy: 0 } }],
	},
	{
		index: "cassadoraTarotSpread",
		name: "Tarot Spread",
		characterIndex: "cassadora",
		archetype: "repertoire",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "self",
		layout: "horizontal",
		artPath: "cards/art/cassadora-tarot-spread",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "wearsOutfit", outfit: "soothsayer" },
		effectArray: [{ index: "scry", count: 5 }, { index: "drawCards", amount: 3 }],
		upgradeArray: [{ name: "Tarot Spread+", effectArray: [{ index: "scry", count: 5 }, { index: "drawCards", amount: 4 }] }],
	},
	//--- Repertoire: keep what she steals ---
	{
		//"Copy a card in hand" was generic and did nothing for Repertoire. An
		//understudy takes the role, so this is the archetype's common steal; Pilfer stays the rare, kept one.
		index: "cassadoraUnderstudy",
		name: "Understudy",
		characterIndex: "cassadora",
		archetype: "turncoat",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-turncoat",
		effectArray: [
			{ index: "stealIntent" },
			{ index: "drawCards", amount: 1 },
		],
		text: "Steal an enemy's intent. Draw 1 card.",
	},
	{
		index: "cassadoraMirrorFate",
		name: "Mirror Fate",
		characterIndex: "cassadora",
		archetype: "turncoat",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-turncoat",
		brokenCard: "cassadoraShatteredMirror",
		effectArray: [
			{
				index: "damage",
				amount: { index: "math", operation: "add", left: 4, right: { index: "intentDamage", of: "target" } },
			},
		],
		text: "Deal {damage:4} damage plus all the damage the enemy intends to deal.",
		upgradeArray: [
			{
				name: "Mirror Fate+",
				effectArray: [
					{
						index: "damage",
						amount: { index: "math", operation: "add", left: 7, right: { index: "intentDamage", of: "target" } },
					},
				],
				text: "Deal {damage:7} damage plus all the damage the enemy intends to deal.",
			},
		],
	},
	{
		index: "cassadoraSleightOfHand",
		name: "Sleight of Hand",
		characterIndex: "cassadora",
		archetype: "turncoat",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-sleight-of-hand",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "drawCards",
				amount: 2,
				condition: { index: "compare", operation: "greater", left: { index: "intentDamage", of: "target" }, right: 0 },
			},
			{ index: "rerollIntent" },
		],
		text: "The target picks a new intent. If it was going to attack, draw 2 cards.",
		upgradeArray: [{ name: "Sleight of Hand+", costArray: { energy: 0 } }],
	},
	{
		//THEFT: the move is taken whole, into the hand, to be played for the party.
		index: "cassadoraPilfer",
		name: "Pilfer",
		characterIndex: "cassadora",
		archetype: "turncoat",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-turncoat",
		effectArray: [{ index: "stealIntent" }],
		text: "Steal an enemy's intent: its move goes into your hand, costs 0 and exhausts. The enemy picks a new one.",
		upgradeArray: [
			{ name: "Pilfer+", costArray: { energy: 0 } },
		],
	},
	{
		index: "cassadoraTurncoat",
		name: "Turncoat",
		characterIndex: "cassadora",
		archetype: "turncoat",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-turncoat",
		exhausts: true,
		brokenCard: "cassadoraTurnedCoat",
		offerCondition: { index: "outfitUnlocked", outfit: "grifter" },
		effectArray: [{ index: "applyStatus", status: "turncoat", stacks: 1 }],
		text: "Apply 1 Turncoat. Exhaust.",
		upgradeArray: [{ name: "Turncoat+", exhausts: false, text: "Apply 1 Turncoat." }],
	},
	{
		index: "cassadoraDoubleCross",
		name: "Double Cross",
		characterIndex: "cassadora",
		archetype: "turncoat",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-double-cross",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "grifter" },
		effectArray: [
			{
				index: "damage",
				amount: {
					index: "conditional",
					condition: { index: "hasStatus", status: "turncoat", of: "target" },
					then: 14,
					else: 6,
				},
			},
		],
		text: "Deal {damage:6} damage; {damage:14} if the target is a Turncoat.",
		upgradeArray: [
			{
				name: "Double Cross+",
				effectArray: [
					{
						index: "damage",
						amount: {
							index: "conditional",
							condition: { index: "hasStatus", status: "turncoat", of: "target" },
							then: 19,
							else: 8,
						},
					},
				],
				text: "Deal {damage:8} damage; {damage:19} if the target is a Turncoat.",
			},
		],
	},
	{
		index: "cassadoraFence",
		name: "Fence",
		characterIndex: "cassadora",
		archetype: "turncoat",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "self",
		layout: "horizontal",
		artPath: "cards/art/cassadora-fence",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "grifter" },
		effectArray: [
			{
				index: "chooseCards",
				effectArray: [{ index: "exhaustCard" }],
				from: "handCard",
				prompt: "Fence which card?",
				minimum: 1,
				maximum: 1,
			},
			{ index: "gainResource", resource: "energy", amount: 2 },
		],
		text: "Exhaust a card in your hand. Gain 2 Energy.",
		upgradeArray: [
			{
				name: "Fence+",
				effectArray: [
					{
						index: "chooseCards",
						effectArray: [{ index: "exhaustCard" }],
						from: "handCard",
						prompt: "Fence which card?",
						minimum: 1,
						maximum: 1,
					},
					{ index: "gainResource", resource: "energy", amount: 2 },
					{ index: "drawCards", amount: 1 },
				],
				text: "Exhaust a card in your hand. Gain 2 Energy and draw 1 card.",
			},
		],
	},
	{
		index: "cassadoraAccomplice",
		name: "Accomplice",
		characterIndex: "cassadora",
		archetype: "turncoat",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-accomplice",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "grifter" },
		effectArray: [
			{ index: "stealIntent", cost: 0 },
			{ index: "applyStatus", status: "fleetingStrength", stacks: 2, targetOverride: "frontAlly" },
		],
		text: "Steal an enemy's intent; it costs 0. The front ally gains 2 Fleeting Strength.",
		upgradeArray: [
			{
				name: "Accomplice+",
				effectArray: [
					{ index: "stealIntent", cost: 0 },
					{ index: "applyStatus", status: "fleetingStrength", stacks: 3, targetOverride: "frontAlly" },
				],
				text: "Steal an enemy's intent; it costs 0. The front ally gains 3 Fleeting Strength.",
			},
		],
	},
	{
		index: "cassadoraGrandHeist",
		name: "Grand Heist",
		characterIndex: "cassadora",
		archetype: "turncoat",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/cassadora-grand-heist",
		//Art owed: this card has no art yet.
		artOwed: true,
		exhausts: true,
		offerCondition: { index: "wearsOutfit", outfit: "grifter" },
		effectArray: [{ index: "stealIntent" }],
		text: "Steal the intent of ALL enemies. Exhaust.",
		upgradeArray: [{ name: "Grand Heist+", costArray: { energy: 1 } }],
	},
	{
		index: "cassadoraCurse",
		name: "Curse",
		characterIndex: "cassadora",
		archetype: "hex",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-curse",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "applyStatus", status: "sundered", stacks: 2 },
			{ index: "applyStatus", status: "weak", stacks: 1 },
		],
		upgradeArray: [
			{
				name: "Curse+",
				effectArray: [
					{ index: "applyStatus", status: "sundered", stacks: 3 },
					{ index: "applyStatus", status: "weak", stacks: 1 },
				],
			},
		],
	},
	{
		index: "cassadoraEnfeeble",
		name: "Enfeeble",
		characterIndex: "cassadora",
		archetype: "hex",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-enfeeble",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "applyStatus", status: "weak", stacks: 2 },
			{ index: "applyStatus", status: "weak", stacks: 1, targetOverride: "randomEnemy" },
		],
		text: "Inflict 2 Weak, and 1 Weak on a random enemy.",
		upgradeArray: [
			{
				name: "Enfeeble+",
				effectArray: [
					{ index: "applyStatus", status: "weak", stacks: 3 },
					{ index: "applyStatus", status: "weak", stacks: 1, targetOverride: "randomEnemy" },
				],
				text: "Inflict 3 Weak, and 1 Weak on a random enemy.",
			},
		],
	},
	{
		index: "cassadoraWardedFate",
		name: "Warded Fate",
		characterIndex: "cassadora",
		archetype: "hex",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/cassadora-fate",
		effectArray: [
			{ index: "temporaryHealth", amount: 7 },
			{ index: "soothe", amount: 3 },
			{ index: "rerollIntent", targetOverride: "randomEnemy" },
		],
		text: "An ally gains 7 Temporary HP and loses 3 Lust. A random enemy picks a new intent.",
		upgradeArray: [
			{
				name: "Warded Fate+",
				effectArray: [
					{ index: "temporaryHealth", amount: 9 },
					{ index: "soothe", amount: 4 },
					{ index: "rerollIntent", targetOverride: "randomEnemy" },
				],
				text: "An ally gains 10 Temporary HP and loses 4 Lust. A random enemy picks a new intent.",
			},
		],
	},
	{
		index: "cassadoraMalediction",
		name: "Malediction",
		characterIndex: "cassadora",
		archetype: "hex",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-malediction",
		//Art owed: this card has no art yet.
		artOwed: true,
		exhausts: true,
		effectArray: [{ index: "transferStatuses", from: "target" }],
		text: "Double every debuff on an enemy. Exhaust.",
		upgradeArray: [{ name: "Malediction+", exhausts: false, text: "Double every debuff on an enemy." }],
	},
	{
		index: "cassadoraFrailty",
		name: "Frailty",
		characterIndex: "cassadora",
		archetype: "hex",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-frailty",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "hedgeWitch" },
		effectArray: [{ index: "damage", amount: 6 }, { index: "applyStatus", status: "frail", stacks: 2 }],
		upgradeArray: [
			{
				name: "Frailty+",
				effectArray: [{ index: "damage", amount: 8 }, { index: "applyStatus", status: "frail", stacks: 3 }],
			},
		],
	},
	{
		index: "cassadoraSpreadMisfortune",
		name: "Spread Misfortune",
		characterIndex: "cassadora",
		archetype: "hex",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-spread-misfortune",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "hedgeWitch" },
		effectArray: [{ index: "transferStatuses", from: "target", to: "otherEnemies" }],
		text: "Copy every debuff on the target onto every other enemy.",
		upgradeArray: [{ name: "Spread Misfortune+", costArray: { energy: 0 } }],
	},
	{
		index: "cassadoraBadLuck",
		name: "Bad Luck",
		characterIndex: "cassadora",
		archetype: "hex",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/cassadora-bad-luck",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "hedgeWitch" },
		effectArray: [
			{ index: "applyStatus", status: "weak", stacks: 1 },
			{ index: "applyStatus", status: "sundered", stacks: 1 },
		],
		upgradeArray: [
			{
				name: "Bad Luck+",
				effectArray: [
					{ index: "applyStatus", status: "weak", stacks: 2 },
					{ index: "applyStatus", status: "sundered", stacks: 1 },
				],
				text: "Inflict 2 Weak and 1 Sundered on ALL enemies.",
			},
		],
	},
	{
		index: "cassadoraCovensCurse",
		name: "Coven's Curse",
		characterIndex: "cassadora",
		archetype: "hex",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cassadora-coven-s-curse",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "outfitUnlocked", outfit: "hedgeWitch" },
		effectArray: [{ index: "applyStatus", status: "covensCurse", stacks: 1 }],
		text: "Whenever an ally gives an enemy a debuff, it takes 3 damage.",
		upgradeArray: [{ name: "Coven's Curse+", costArray: { energy: 0 } }],
	},
	{
		index: "cassadoraWitchsBrew",
		name: "Witch's Brew",
		characterIndex: "cassadora",
		archetype: "hex",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/cassadora-witch-s-brew",
		//Art owed: this card has no art yet.
		artOwed: true,
		offerCondition: { index: "wearsOutfit", outfit: "hedgeWitch" },
		effectArray: [
			{ index: "applyStatus", status: "weak", stacks: 3 },
			{ index: "applyStatus", status: "sundered", stacks: 2 },
			{ index: "applyStatus", status: "frail", stacks: 2 },
		],
		upgradeArray: [
			{
				name: "Witch's Brew+",
				effectArray: [
					{ index: "applyStatus", status: "weak", stacks: 4 },
					{ index: "applyStatus", status: "sundered", stacks: 3 },
					{ index: "applyStatus", status: "frail", stacks: 3 },
				],
			},
		],
	},
	//--- clemence: broken forms (commons at rare numbers, rares spend her Lust, Ecstatic spills it) ---
	{
		index: "clemenceMendingWordBroken",
		name: "Fevered Word",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-fevered-word",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "heal", amount: 8 },
			{ index: "lust", amount: 4, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "An ally heals 8 HP. Clemence gains 4 Lust.",
	},
	{
		index: "clemenceLayOnHandsBroken",
		name: "Benediction",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 2 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/clemence-absolve",
		effectArray: [
			{ index: "heal", amount: 5 },
			{
				index: "heal",
				amount: 2,
				condition: { index: "compare", operation: "greater", left: { index: "stat", stat: "lust", of: "target" }, right: 0 },
			},
			{ index: "lust", amount: 8, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "ALL allies heal 5 HP, or 7 if they have Lust. Clemence gains 8 Lust.",
	},
	{
		index: "clemenceHeavenlyGazeBroken",
		name: "Rapt Gaze",
		characterIndex: "clemence",
		rarity: "broken",
		tagArray: ["exposure"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/clemence-rapt-gaze",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "drawCards",
				amount: 1,
				condition: {
					index: "compare",
					operation: "greater",
					left: { index: "stat", stat: "lust", of: "source" },
					right: { index: "stat", stat: "lust", of: "target" },
				},
			},
			{ index: "lust", amount: 13 },
		],
		text: "Inflict 13 Lust. If Clemence has more Lust than the target, draw 1 card.",
	},
	{
		index: "clemenceFontOfGraceBroken",
		name: "Overflowing Font",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 2 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-overflowing-font",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "applyStatus", status: "fontOfGrace", stacks: 1 },
			{ index: "soothe", amount: 10, targetOverride: "owner" },
			{
				index: "heal",
				amount: { index: "math", operation: "divide", left: { index: "tally", key: "lustRemoved" }, right: 2 },
				targetOverride: "mostHurtAlly",
			},
		],
		text: "Gain Font of Grace. Spend up to 10 of Clemence's Lust; the most hurt ally heals half that much.",
	},
	{
		index: "clemenceShelteringGraceBroken",
		name: "Radiant Aegis",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-absolve",
		effectArray: [
			{ index: "temporaryHealth", amount: 12 },
			{
				index: "temporaryHealth",
				amount: 4,
				condition: { index: "compare", operation: "greater", left: { index: "stat", stat: "lust", of: "target" }, right: 0 },
			},
			{ index: "lust", amount: 4, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "An ally gains 12 Temporary HP, or 16 if they have Lust. Clemence gains 4 Lust.",
	},
	{
		index: "clemenceAnsweredPrayerBroken",
		name: "Prayer Unbound",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-prayer-unbound",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "chooseOption",
				prompt: "How is the prayer answered?",
				optionArray: [
					{
						index: "heal",
						name: "Mend",
						effectArray: [{ index: "heal", amount: 8 }],
						description: "The ally heals 8 HP.",
					},
					{
						index: "devotion",
						name: "Devote",
						effectArray: [
							{
								index: "branch",
								test: { index: "mechanicAtLeast", mechanic: "devotion", amount: 8 },
								thenArray: [
									{ index: "spendMechanic", mechanic: "devotion", amount: 8 },
									{ index: "gainResource", resource: "energy", amount: 1 },
									{ index: "drawCards", amount: 3 },
								],
								elseArray: [],
							},
						],
						description: "Spend 8 Devotion: gain 1 Energy and draw 3 cards.",
					},
				],
			},
		],
		text: "Choose one: an ally heals 8 HP; or spend 8 Devotion to gain 1 Energy and draw 3 cards.",
	},
	{
		index: "clemenceStayWithMeBroken",
		name: "Hold Me Close",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-hold-me-close",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "temporaryHealth",
				amount: { index: "math", operation: "min", left: { index: "stat", stat: "lust", of: "target" }, right: 16 },
			},
		],
		text: "An ally gains Temporary HP equal to their Lust, up to 16.",
	},
	{
		index: "clemenceSanctuaryBroken",
		name: "Sanctum",
		characterIndex: "clemence",
		rarity: "broken",
		tagArray: ["exposure"],
		costArray: { energy: 2 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/clemence-sanctum",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "soothe", amount: 15, targetOverride: "owner" },
			{
				index: "temporaryHealth",
				amount: { index: "math", operation: "divide", left: { index: "tally", key: "lustRemoved" }, right: 3 },
			},
			{
				index: "lust",
				amount: { index: "math", operation: "divide", left: { index: "tally", key: "lustRemoved" }, right: 3 },
				targetOverride: "allEnemies",
			},
		],
		text: "Spend up to 15 of Clemence's Lust. ALL allies gain a third of it as Temporary HP, and ALL enemies take a third as Lust.",
	},
	{
		index: "clemenceMercyBroken",
		name: "Tender Mercy",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "mostHurtAlly",
		layout: "horizontal",
		artPath: "cards/art/clemence-tender-mercy",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "heal", amount: 12 },
			{ index: "lust", amount: 6, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "The most hurt ally heals 12 HP. Clemence gains 6 Lust.",
	},
	{
		index: "clemenceBearTheWeightBroken",
		name: "Borne Together",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/clemence-borne-together",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "temporaryHealth", amount: 10 },
			{ index: "temporaryHealth", amount: 10, targetOverride: "owner" },
		],
		text: "An ally and Clemence each gain 10 Temporary HP.",
	},
	{
		index: "clemenceHairShirtBroken",
		name: "Scourged",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-scourged",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "temporaryHealth", amount: 14 },
			{ index: "lust", amount: 4, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "Clemence gains 14 Temporary HP and 4 Lust.",
	},
	{
		index: "clemenceBlessingBroken",
		name: "Blessed Host",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-blessed-host",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "applyStatus", status: "blessing", stacks: 1 },
			{ index: "soothe", amount: 8, targetOverride: "owner" },
			{
				index: "temporaryHealth",
				amount: { index: "math", operation: "divide", left: { index: "tally", key: "lustRemoved" }, right: 2 },
				targetOverride: "allAllies",
			},
		],
		text: "Gain Blessing. Spend up to 8 of Clemence's Lust; ALL allies gain half that much Temporary HP.",
	},
	{
		index: "clemenceMiracleBroken",
		name: "Wonder",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 2 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/clemence-wonder",
		//Art owed: this card has no art yet.
		artOwed: true,
		exhausts: true,
		effectArray: [
			{ index: "soothe", all: true, targetOverride: "owner" },
			{
				index: "temporaryHealth",
				amount: { index: "math", operation: "divide", left: { index: "tally", key: "lustRemoved" }, right: 2 },
			},
		],
		text: "Spend ALL of Clemence's Lust. ALL allies gain half that much Temporary HP. Exhaust.",
	},
	{
		index: "clemencePrayerBroken",
		name: "Ecstatic Prayer",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 0 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-rebuke",
		effectArray: [
			{ index: "gainResource", resource: "energy", amount: 2 },
			{ index: "lust", amount: 6, targetOverride: "randomAlly" },
		],
		text: "Gain 2 Energy. A random ally gains 6 Lust.",
	},
	{
		index: "clemenceConfideBroken",
		name: "Unburden",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-confess",
		effectArray: [{ index: "drawCards", amount: 4 }, { index: "lust", amount: 5, targetOverride: "randomAlly" }],
		text: "Draw 4 cards. A random ally gains 5 Lust.",
	},
	{
		index: "clemenceWantonGazeBroken",
		name: "Wanton Release",
		characterIndex: "clemence",
		rarity: "broken",
		tagArray: ["exposure"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/clemence-wanton-release",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "lust", amount: 14 }, { index: "lust", amount: 3, targetOverride: "otherAllies" }],
		text: "Inflict 14 Lust. Every other ally gains 3 Lust.",
	},
	{
		index: "clemenceConfessionBroken",
		name: "Penance",
		characterIndex: "clemence",
		rarity: "broken",
		tagArray: ["exposure"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/clemence-confess",
		effectArray: [
			{ index: "lust", amount: 8 },
			{ index: "applyStatus", status: "sensitive", stacks: 3 },
			{ index: "lust", amount: 4, targetOverride: "randomAlly" },
		],
		text: "Inflict 8 Lust and 3 Sensitive. A random ally gains 4 Lust.",
	},
	{
		index: "clemenceLetGoBroken",
		name: "Let It Out",
		characterIndex: "clemence",
		rarity: "broken",
		tagArray: ["exposure"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/clemence-let-it-out",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{
				index: "lust",
				amount: { index: "math", operation: "divide", left: { index: "stat", stat: "lust", of: "source" }, right: 2 },
			},
			{
				index: "lust",
				amount: { index: "math", operation: "divide", left: { index: "stat", stat: "lust", of: "source" }, right: 4 },
				targetOverride: "randomAlly",
			},
		],
		text: "Inflict Lust equal to half of Clemence's. A random ally gains a quarter of it.",
	},
	{
		index: "clemenceSoftWordsBroken",
		name: "Cast It Out",
		characterIndex: "clemence",
		rarity: "broken",
		tagArray: ["exposure"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/clemence-confess",
		effectArray: [
			{
				index: "drawCards",
				amount: 1,
				condition: { index: "compare", operation: "greater", left: { index: "stat", stat: "lust", of: "target" }, right: 0 },
			},
			{ index: "applyStatus", status: "weak", stacks: 1 },
			{ index: "lust", amount: 9 },
			{ index: "lust", amount: 3, targetOverride: "randomAlly" },
		],
		text: "Inflict 1 Weak and 9 Lust. If it already had Lust, draw 1 card. A random ally gains 3 Lust.",
	},
	{
		index: "clemenceRapturesGiftBroken",
		name: "Gift Given",
		characterIndex: "clemence",
		rarity: "broken",
		tagArray: ["exposure"],
		costArray: { energy: 1 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/clemence-gift-given",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "soothe", amount: 12, targetOverride: "owner" },
			{ index: "lust", amount: { index: "tally", key: "lustRemoved" } },
			{
				index: "lust",
				amount: { index: "math", operation: "divide", left: { index: "tally", key: "lustRemoved" }, right: 2 },
				targetOverride: "otherAllies",
			},
		],
		text: "Spend up to 12 of Clemence's Lust. ALL enemies take that much Lust; every other ally takes half.",
	},
	{
		index: "clemenceSanctifyBroken",
		name: "Consecrate",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-absolve",
		effectArray: [{ index: "applyStatus", status: "sanctified", stacks: 1 }, { index: "temporaryHealth", amount: 6 }],
		text: "An ally gains Sanctified and 6 Temporary HP.",
	},
	{
		index: "clemenceFallenVigilBroken",
		name: "Keep Faith",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-absolve",
		effectArray: [
			{ index: "heal", amount: 6 },
			{ index: "heal", amount: 6, condition: { index: "isBroken", of: "target" } },
			{ index: "drawCards", amount: 1, condition: { index: "isBroken", of: "target" } },
		],
		text: "An ally heals 6 HP. If they are Broken, 6 more and draw 1 card.",
	},
	{
		index: "clemenceKindledWantBroken",
		name: "Stoked Want",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/clemence-stoked-want",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "lust", amount: 8 }, { index: "applyStatus", status: "fleetingStrength", stacks: 4 }],
		text: "An ally gains 8 Lust and 4 Fleeting Strength.",
	},
	{
		index: "clemenceBrokenSaintsBroken",
		name: "Fellowship of the Fallen",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/clemence-fellowship-of-the-fallen",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [
			{ index: "soothe", amount: 12, targetOverride: "owner" },
			{
				index: "applyStatus",
				status: "strength",
				stacks: { index: "math", operation: "divide", left: { index: "tally", key: "lustRemoved" }, right: 4 },
				condition: { index: "isBroken", of: "target" },
			},
		],
		text: "Spend up to 12 of Clemence's Lust. ALL Broken allies gain 1 Strength for every 4 spent.",
	},
	{
		index: "clemenceOrdealBroken",
		name: "Trial",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/clemence-trial",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "lust", amount: 13 }, { index: "temporaryHealth", amount: 13 }],
		text: "An ally gains 13 Lust and 13 Temporary HP.",
	},
	{
		index: "clemencePenitentsDrawBroken",
		name: "Confessor",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/clemence-confessor",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "lust", amount: 8 }, { index: "drawCards", amount: 3 }],
		text: "An ally gains 8 Lust. Draw 3 cards.",
	},
	{
		index: "clemenceAnointBroken",
		name: "Last Anointing",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "ally",
		targetCondition: { index: "isBroken", of: "target" },
		layout: "horizontal",
		artPath: "cards/art/clemence-last-anointing",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "heal", amount: 14 }],
		text: "A Broken ally heals 14 HP.",
	},
	{
		index: "clemenceSharedFeverBroken",
		name: "Shared Release",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-confess",
		effectArray: [
			{ index: "soothe", amount: 10, targetOverride: "owner" },
			{
				index: "gainResource",
				resource: "energy",
				amount: { index: "math", operation: "divide", left: { index: "tally", key: "lustRemoved" }, right: 5 },
			},
			{ index: "drawCards", amount: 1 },
		],
		text: "Spend up to 10 of Clemence's Lust. Gain 1 Energy for every 5 spent. Draw 1 card.",
	},
	{
		index: "clemenceOfferingBroken",
		name: "Outpouring",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-absolve",
		effectArray: [{ index: "heal", amount: 9 }],
	},
	{
		index: "clemenceTemptBroken",
		name: "Seduce",
		characterIndex: "clemence",
		rarity: "broken",
		tagArray: ["exposure"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/clemence-seduce",
		//Art owed: this card has no art yet.
		artOwed: true,
		effectArray: [{ index: "lust", amount: 12 }],
	},
	{
		index: "clemenceBroken",
		name: "Rapture",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "vertical",
		//ONE CROP PER FRAME: a broken form wears the shape of the card it replaced, so this
		//one definition is dealt into both windows. See honeycomb.cardArtPath.
		artPathByLayout: { horizontal: "cards/art/clemence-broken", vertical: "cards/art/clemence-broken-tall" },
		artPath: "cards/art/clemence-broken",
		effectArray: [{ index: "heal", amount: 4 }],
		text: "ALL allies heal 4 HP.",
	},




	//-------------------------------------------------------------------------------------------
	//Nettle -- Necromancer. POISON.
	//-------------------------------------------------------------------------------------------
	{
		index: "nettleStrike",
		brokenCard: "nettlePollenBurst",
		name: "Grave Touch",
		characterIndex: "nettle",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-strike",
		effectArray: [{ index: "damage", amount: 5 }],
		upgradeArray: [
			{ name: "Grave Touch+", effectArray: [{ index: "damage", amount: 8 }] },
		],
	},










	//-------------------------------------------------------------------------------------------
	//Clemence -- Confessor. BUILT AROUND BECOMING BROKEN.
	//
	//So every card below comes in TWO: the standing form builds her Lust for healing, energy and cards, and
	//its `brokenCard` is a real counterpart that SPENDS that Lust (a soothe on her, read back through the
	//tally). Only the broken forms put Lust on enemies. No card of hers deals damage.
	//
//The Lust she gives HERSELF is tagged "penance", so its height is a readable self-progression
//metric and it can raise her Exposure between runs; what she casts at enemies is Exposure.
	//-------------------------------------------------------------------------------------------




	{
		index: "clemenceMartyrsVowBroken",
		name: "Martyr's Joy",
		characterIndex: "clemence",
		type: "passive",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/clemence-martyr",
		effectArray: [
			{ index: "applyStatus", status: "martyrsVow", stacks: 1 },
			{ index: "soothe", amount: 6 },
		],
		text: "Gain Martyr's Vow. Spend up to 6 of Clemence's Lust.",
	},
	{
		index: "clemenceSurrenderBroken",
		name: "Revelation",
		characterIndex: "clemence",
		rarity: "broken",
		tagArray: ["exposure"],
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "vertical",
		artPath: "cards/art/clemence-martyr",
		exhausts: true,
		effectArray: [
			{ index: "soothe", amount: 999, targetOverride: "owner" },
			{ index: "lust", amount: { index: "tally", key: "lustRemoved" } },
		],
		text: "Spend ALL of Clemence's Lust. ALL enemies take that much Lust. Exhaust.",
	},
	{
		index: "clemenceEcstasyBroken",
		name: "Beatitude",
		characterIndex: "clemence",
		type: "passive",
		rarity: "broken",
		costArray: { energy: 2 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/clemence-martyr",
		effectArray: [
			{ index: "applyStatus", status: "ecstasy", stacks: 1 },
			{ index: "drawCards", amount: 2 },
		],
		text: "Gain Ecstasy. Draw 2 cards.",
	},
	{
		index: "clemenceCommunionBroken",
		name: "Rapturous Host",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 2 },
		targetMode: "allAllies",
		layout: "vertical",
		artPath: "cards/art/clemence-rebuke",
		exhausts: true,
		effectArray: [
			{ index: "applyStatus", status: "sanctified", stacks: 1 },
			{ index: "soothe", amount: 999, targetOverride: "owner" },
			{ index: "lust", amount: { index: "math", operation: "divide", left: { index: "tally", key: "lustRemoved" }, right: 3 }, targetOverride: "allEnemies" },
		],
		text: "ALL allies gain Sanctified. Spend ALL of Clemence's Lust; ALL enemies take a third of it as Lust. Exhaust.",
	},



	//RETIRED: the Repertoire CARD is cut, and the posture is the
	//Grifter's passive. The `repertoire` status and archetype stay defined for that character.

	//--- What a cancelled intent telegraphs instead (tuning.intent.cancelledCard). Never offered. ---
	{
		index: "hexBefuddled",
		name: "Befuddled",
		characterIndex: "neutral",
		rarity: "enemy",
		costArray: {},
		targetMode: "none",
		layout: "horizontal",
		artPath: "cards/art/cassadora-hex",
		effectArray: [{ index: "message", text: "It has forgotten what it was about to do." }],
		text: "Does nothing.",
	},
	//-------------------------------------------------------------------------------------------
	//Neutral -- found on the map, belonging to no character.
	//-------------------------------------------------------------------------------------------
	{
		index: "neutralFocus",
		name: "Focused Mind",
		characterIndex: "neutral",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "self",
		layout: "horizontal",
		artPath: "cards/art/neutral-focus",
		effectArray: [{ index: "drawCards", amount: 2 }],
	},
	{
		index: "neutralTonic",
		name: "Field Tonic",
		characterIndex: "neutral",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/neutral-tonic",
		exhausts: true,
		effectArray: [
			{ index: "heal", amount: 10 },
			{ index: "exhaustSelf" },
		],
	},
	{
		index: "neutralWarcry",
		name: "Shared Resolve",
		characterIndex: "neutral",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/neutral-warcry",
		//Scales with party size, which makes it a teambuilding card rather than a generic one.
		effectArray: [{
			index: "temporaryHealth",
			amount: {
				index: "math", operation: "add",
				left: 2,
				right: { index: "count", collection: "livingAllies" },
			},
		}],
		text: "ALL allies gain Temporary HP equal to 2 plus the number of living allies.",
	},

	//-------------------------------------------------------------------------------------------
	//Cards that act on cards, and cards that ask questions.
	//
	//These exist to prove the two halves of the card-targeting work, and they are ordinary table
	//entries: nothing in the engine knows any of them by name.
	//  Whetted Edge   targets another CARD. Its target mode has kind "card", so it can never land on a
	//                 party member; once played it ASKS which card, in a window with slots, and
	//                 answers itself when only one other card is in hand.
	//  Improvise      opens a selection WINDOW mid-resolution. The effect stops, the player answers,
	//                 and resolution replays with the answer. See honeycomb-choices.js.
	//  Hedge Your Bet offers a branching choice, each branch carrying its own effect list.
	//-------------------------------------------------------------------------------------------
	{
		index: "neutralWhettedEdge",
		name: "Whetted Edge",
		characterIndex: "neutral",
		rarity: "common",
		costArray: { energy: 0 },
		//Kind "card": asks for a card in hand once played, never lands on a character.
		targetMode: "handCard",
		layout: "horizontal",
		artPath: "cards/art/neutral-whetted",
		exhausts: true,
		//BOTH halves last this combat only, as the text says.
		effectArray: [
			{ index: "upgradeTargetCard", levels: 1, forThisCombat: true },
			{ index: "modifyCardCost", amount: -1 },
		],
		text: "Choose a card in your hand: upgrade it and reduce its cost by 1 this combat. Exhaust.",
	},
	{
		index: "neutralImprovise",
		name: "Improvise",
		characterIndex: "neutral",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "self",
		layout: "horizontal",
		artPath: "cards/art/neutral-improvise",
		effectArray: [
			{
				index: "chooseCards",
				from: "discardPileCard",
				prompt: "Return which card to your hand?",
				minimum: 0,
				maximum: 1,
				effectArray: [{ index: "returnCardToHand" }],
			},
			{ index: "gainResource", resource: "energy", amount: 1 },
		],
		text: "Return a card from your discard pile to your hand. Gain 1 Energy.",
	},
	{
		index: "neutralHedge",
		name: "Hedge Your Bet",
		characterIndex: "neutral",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/neutral-hedge",
		effectArray: [{
			index: "chooseOption",
			prompt: "Hedge your bet how?",
			optionArray: [
				{
					index: "guard",
					name: "Dig In",
					description: "Gain 9 Temporary HP.",
					effectArray: [{ index: "temporaryHealth", amount: 9 }],
				},
				{
					index: "draw",
					name: "Read The Room",
					description: "Draw 2 cards.",
					effectArray: [{ index: "drawCards", amount: 2 }],
				},
				{
					index: "strike",
					name: "Commit",
					description: "Deal 11 damage to a random enemy.",
					effectArray: [{ index: "damage", amount: 11, targetOverride: "randomEnemy" }],
				},
			],
		}],
		text: "Choose one: gain 9 Temporary HP, draw 2 cards, or deal {damage:11} damage to a random enemy.",
	},

	//-------------------------------------------------------------------------------------------
	//BROKEN CARDS -- one per character, and the only cards a broken character holds.
	//-------------------------------------------------------------------------------------------
	//The pointer is `brokenCard` on the CHARACTER (content-characters.js), inherited by every card they
	//own; a card may name its own to override. rarity "broken" keeps all three out of rewards, shops and
	//the discovery ledger -- they are never offered, only arrived at.
	//
	//Each is a way OUT as well as a punishment, because a broken character who could do nothing at all
	//would just be a dead slot for the rest of the fight. All three reduce lust; what they cost differs.
	{
		//BRIENNE: the choice window. Still the defender even flat on her back -- she picks which edge of
		//the gap to widen, which is the same decision Brace and Steady ask her when she is standing.
		index: "brienneBroken",
		name: "Buckle",
		characterIndex: "brienne",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		//ONE CROP PER FRAME: a broken form wears the shape of the card it replaced, so this
		//one definition is dealt into both windows. See honeycomb.cardArtPath.
		artPathByLayout: { horizontal: "cards/art/brienne-broken", vertical: "cards/art/brienne-broken-tall" },
		artPath: "cards/art/brienne-broken",
		effectArray: [{
			index: "chooseOption",
			prompt: "Brienne buckles. What holds?",
			optionArray: [
				{
					index: "grit",
					name: "Grit Her Teeth",
					description: "Remove 8 Lust.",
					effectArray: [{ index: "soothe", amount: 8 }],
				},
				{
					index: "brace",
					name: "Curl Up",
					description: "Gain 8 Temporary HP.",
					effectArray: [{ index: "temporaryHealth", amount: 8 }],
				},
			],
		}],
		text: "Choose one: remove 8 Lust, or gain 8 Temporary HP.",
	},
	{
		//SEVERINE: lashes out. Reduces her own lust and hits SOMEBODY -- the target mode is deliberately
		//"randomAny", either team, because a broken Severine is not choosing.
		index: "severineBroken",
		name: "Lash Out",
		characterIndex: "severine",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "randomAny",
		layout: "vertical",
		//Was cards/art/severine-rake, which has never existed: Rake's art was never drawn and the file
		//never renamed with the character. The flurry is the same lashing motion.
		//ONE CROP PER FRAME: a broken form wears the shape of the card it replaced, so this
		//one definition is dealt into both windows. See honeycomb.cardArtPath.
		artPathByLayout: { horizontal: "cards/art/severine-broken", vertical: "cards/art/severine-broken-tall" },
		artPath: "cards/art/severine-broken",
		effectArray: [
			{ index: "soothe", amount: 6, targetOverride: "owner" },
			{ index: "damage", amount: 9 },
		],
		text: "Remove 6 of your Lust. Deal 9 damage to a random fighter on either side.",
	},
	{
		//NETTLE: pulls herself together and pays for it in curses. The wisps are the drawback, and they are
		//exactly the drawback that gets worse the longer she stays broken.
		index: "nettleBroken",
		name: "Wither Within",
		characterIndex: "nettle",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "owner",
		tagArray: ["necromancy"],
		layout: "vertical",
		//ONE CROP PER FRAME: a broken form wears the shape of the card it replaced, so this
		//one definition is dealt into both windows. See honeycomb.cardArtPath.
		artPathByLayout: { horizontal: "cards/art/nettle-broken", vertical: "cards/art/nettle-broken-tall" },
		artPath: "cards/art/nettle-broken",
		effectArray: [
			{ index: "soothe", amount: 6 },
			{ index: "heal", amount: 5 },
			{ index: "addCardToPile", card: "curseWisp", pile: "drawPile", count: 2 },
		],
		text: "Remove 6 of your Lust. Heal 5 HP. Shuffle 2 Wisps into your draw pile.",
	},

	{
		//CINDER: stumbles out of the line. Out of the way, which is the one thing a broken lancer can still do.
		index: "cinderBroken",
		name: "Stumble",
		characterIndex: "cinder",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		//ONE CROP PER FRAME: a broken form wears the shape of the card it replaced, so this
		//one definition is dealt into both windows. See honeycomb.cardArtPath.
		artPathByLayout: { horizontal: "cards/art/cinder-broken", vertical: "cards/art/cinder-broken-tall" },
		artPath: "cards/art/cinder-broken",
		partyShift: "back",
		effectArray: [{ index: "soothe", amount: 6 }],
		text: "Cinder falls to the back. Remove 6 of her Lust.",
	},
	{
		//CASSADORA: sees nothing straight, and neither does the enemy she stares at.
		index: "cassadoraBroken",
		name: "Blinded",
		characterIndex: "cassadora",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		//ONE CROP PER FRAME: a broken form wears the shape of the card it replaced, so this
		//one definition is dealt into both windows. See honeycomb.cardArtPath.
		artPathByLayout: { horizontal: "cards/art/cassadora-broken", vertical: "cards/art/cassadora-broken-tall" },
		artPath: "cards/art/cassadora-broken",
		effectArray: [
			{ index: "rerollIntent", targetOverride: "randomEnemy" },
			{ index: "soothe", amount: 6 },
		],
		text: "A random enemy picks a new intent. Remove 6 of Cassadora's Lust.",
	},

	//-------------------------------------------------------------------------------------------
	//ONE UNIQUE BROKEN FORM PER RANK, PER CHARACTER: starter, common and rare each get their own design,
	//with rare usually the most beneficial (helping mitigate lust directly) and starter the most costly,
	//serving as a tax.
	//
	//Clemence is exempt: every one of her cards already names its own broken counterpart.
	//-------------------------------------------------------------------------------------------
	{
		index: "brienneBacksToWall",
		name: "Backs to the Wall",
		characterIndex: "brienne",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/brienne-challenge",
		effectArray: [
			{ index: "temporaryHealth", amount: 4 },
			{ index: "lust", amount: 4, targetOverride: "owner" },
		],
		text: "Gain 4 Temporary HP. Gain 4 Lust.",
	},
	{
		index: "brienneHuddle",
		name: "Huddle",
		characterIndex: "brienne",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "vertical",
		artPath: "cards/art/brienne-bulwark",
		effectArray: [
			{ index: "temporaryHealth", amount: 3 },
			{ index: "lust", amount: 2 },
		],
		text: "ALL allies gain 3 Temporary HP and 2 Lust.",
	},
	{
		index: "brienneWeightOfRegret",
		name: "Weight of Regret",
		characterIndex: "brienne",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "vertical",
		artPath: "cards/art/brienne-weight",
		effectArray: [{ index: "soothe", amount: 8 }],
		text: "ALL allies lose 8 Lust.",
	},
	{
		index: "nettlePollenBurst",
		name: "Pollen Burst",
		characterIndex: "nettle",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "randomAlly",
		layout: "vertical",
		artPath: "cards/art/nettle-pollen",
		effectArray: [{ index: "applyStatus", status: "poison", stacks: 2 }],
		text: "Apply 2 Poison to a random ally.",
	},
	{
		index: "nettleMiasmicHaze",
		name: "Miasmic Haze",
		characterIndex: "nettle",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "allEnemies",
		layout: "vertical",
		artPath: "cards/art/nettle-miasma",
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 1 },
			{ index: "lust", amount: 3, targetOverride: "owner" },
		],
		text: "ALL enemies gain 1 Poison. Nettle gains 3 Lust.",
	},
	{
		index: "nettleLastBloom",
		name: "Last Bloom",
		characterIndex: "nettle",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "vertical",
		artPath: "cards/art/nettle-pollen",
		effectArray: [
			{ index: "soothe", amount: 6 },
			{ index: "drawCards", amount: 1 },
		],
		text: "ALL allies lose 6 Lust. Draw 1 card.",
	},
	{
		index: "severinePreyNoMore",
		name: "Prey No More",
		characterIndex: "severine",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/severine-hunt",
		effectArray: [
			{ index: "loseHealth", amount: 4, targetOverride: "owner" },
			{ index: "drawCards", amount: 2 },
		],
		text: "Lose 4 HP. Draw 2 cards.",
	},
	{
		index: "severineCripple",
		name: "Cripple",
		characterIndex: "severine",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "randomAny",
		layout: "vertical",
		artPath: "cards/art/severine-hunt",
		effectArray: [{ index: "damage", amount: 4 }],
		text: "Deal 4 damage to a random fighter on either side.",
	},
	{
		index: "severineMoonfall",
		name: "Moonfall",
		characterIndex: "severine",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "vertical",
		artPath: "cards/art/severine-nightfall",
		effectArray: [
			{ index: "soothe", amount: 5 },
			{ index: "heal", amount: 4 },
		],
		text: "ALL allies lose 5 Lust and heal 4 HP.",
	},
	{
		index: "cinderMisstep",
		name: "Misstep",
		characterIndex: "cinder",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/cinder-retreat",
		partyShift: "back",
		effectArray: [{ index: "lust", amount: 2, targetOverride: "owner" }],
		text: "Cinder falls to the back. Gain 2 Lust.",
	},
	{
		index: "cinderLostTrail",
		name: "Lost Trail",
		characterIndex: "cinder",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/cinder-retreat",
		partyShift: "back",
		effectArray: [{ index: "drawCards", amount: 1 }],
		text: "Cinder falls to the back. Draw 1 card.",
	},
	{
		index: "cinderClosingJaws",
		name: "Closing Jaws",
		characterIndex: "cinder",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "allEnemies",
		layout: "vertical",
		artPath: "cards/art/cinder-comet",
		effectArray: [
			{ index: "damage", amount: 6 },
			{ index: "soothe", amount: 5, targetOverride: "allAllies" },
		],
		text: "Deal {damage:6} damage to ALL enemies. ALL allies lose 5 Lust.",
	},
	{
		index: "cassadoraTurnedCoat",
		name: "Turned Coat",
		characterIndex: "cassadora",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "randomEnemy",
		layout: "vertical",
		artPath: "cards/art/cassadora-turncoat",
		effectArray: [
			{ index: "rerollIntent" },
			{ index: "lust", amount: 2, targetOverride: "owner" },
		],
		text: "A random enemy picks a new intent. Cassadora gains 2 Lust.",
	},
	{
		index: "cassadoraShatteredMirror",
		name: "Shattered Mirror",
		characterIndex: "cassadora",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "randomAny",
		layout: "vertical",
		artPath: "cards/art/cassadora-turncoat",
		effectArray: [{ index: "damage", amount: 3 }],
		text: "Deal 3 damage to a random fighter on either side.",
	},
	{
		index: "cassadoraStillnessWithin",
		name: "Stillness Within",
		characterIndex: "cassadora",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "vertical",
		artPath: "cards/art/cassadora-fate",
		effectArray: [
			{ index: "soothe", amount: 5 },
			{ index: "drawCards", amount: 1 },
		],
		text: "ALL allies lose 5 Lust. Draw 1 card.",
	},

	//-------------------------------------------------------------------------------------------
	//CURSES -- bad cards the player does not want, shuffled into the deck by events and enemies.
	//-------------------------------------------------------------------------------------------
	{
		index: "curseDread",
		name: "Dread",
		characterIndex: "neutral",
		type: "curse",
		rarity: "special",
		//A null cost means unplayable: it can only be drawn and clog the hand.
		costArray: null,
		targetMode: "none",
		layout: "horizontal",
		artPath: "cards/art/curse-dread",
		effectArray: [],
		//What "ordinary means" are: the campfire's and the shop's removal, and a random removal (the
		//Cardsharp's trade). Only an effect naming this card outright takes it away. See
		//honeycomb.cardIsRemovable.
		unremovable: true,
		text: "Unplayable. Cannot be removed by ordinary means.",
	},
	{
		//Was "statusWisp" before this type's rename; save format 5 renames it in saves.
		index: "curseWisp",
		name: "Wisp",
		characterIndex: "neutral",
		type: "curse",
		rarity: "special",
		costArray: { energy: 0 },
		targetMode: "self",
		layout: "horizontal",
		artPath: "cards/art/curse-wisp",
		exhausts: true,
		ethereal: true,
		effectArray: [{ index: "exhaustSelf" }],
		text: "Exhaust. Ethereal.",
	},

	//-------------------------------------------------------------------------------------------
	//STARTER BASICS (STARTER-REWORK-01 §1.2). The twelve cards every run opens on: two copies of the
	//aggressive basic and two of the defensive basic, per character. Starters cannot be upgraded --
	//progression nodes are the only thing that changes them -- so none carries an `upgradeArray`.
	//-------------------------------------------------------------------------------------------
	{
		index: "brienneCleave",
		name: "Sword Strike",
		characterIndex: "brienne",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/brienne-strike",
		effectArray: [{ index: "damage", amount: 6 }],
	},
	{
		index: "brienneGrit",
		brokenCard: "brienneBacksToWall",
		name: "Brace",
		characterIndex: "brienne",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/brienne-guard",
		effectArray: [{ index: "temporaryHealth", amount: 6 }],
	},
	{
		index: "nettleVenomTouch",
		brokenCard: "nettlePollenBurst",
		name: "Wither",
		characterIndex: "nettle",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-strike",
		effectArray: [
			{ index: "damage", amount: 4 },
			{ index: "applyStatus", status: "poison", stacks: 1 },
		],
	},
	{
		index: "nettleLastRites",
		name: "Last Rites",
		characterIndex: "nettle",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/nettle-wither",
		effectArray: [{ index: "cleanse" }],
	},
	{
		index: "severineRend",
		brokenCard: "severinePreyNoMore",
		name: "Claw Flurry",
		characterIndex: "severine",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-flurry",
		effectArray: [{ index: "repeat", times: 3, effectArray: [{ index: "damage", amount: 2, vfx: "none" }] }],
		text: "Deal {damage:2} damage 3 times.",
	},
	{
		index: "severineQuaff",
		name: "Drain",
		characterIndex: "severine",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-drain",
		effectArray: [
			{ index: "damage", amount: 4 },
			{ index: "heal", amount: { index: "damageDealt" }, targetOverride: "owner" },
		],
	},
	{
		index: "clemenceTempt",
		name: "Tempt",
		brokenCard: "clemenceTemptBroken",
		characterIndex: "clemence",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/clemence-rebuke",
		effectArray: [{ index: "lust", amount: 6 }],
	},
	{
		index: "clemenceGrant",
		//Broken, Grant is Outpouring: the starter form Offering carried before it was culled.
		brokenCard: "clemenceOfferingBroken",
		name: "Offering",
		characterIndex: "clemence",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-absolve",
		effectArray: [{ index: "heal", amount: 6 }],
	},
	{
		index: "cassadoraWispBolt",
		brokenCard: "cassadoraTurnedCoat",
		name: "Wisplight",
		characterIndex: "cassadora",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-bolt",
		effectArray: [
			{ index: "damage", amount: 4 },
			{ index: "applyStatus", status: "sundered", stacks: 1 },
		],
	},
	{
		index: "cassadoraUnravel",
		name: "Second Thoughts",
		characterIndex: "cassadora",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-hex",
		effectArray: [{ index: "rerollIntent" }],
	},
	{
		index: "cinderImpale",
		name: "Lance Thrust",
		characterIndex: "cinder",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-thrust",
		//Sundered does not fade, so the printed stack is the stack she keeps.
		effectArray: [
			{ index: "damage", amount: 9 },
			{ index: "applyStatus", status: "sundered", stacks: 1, targetOverride: "owner" },
		],
	},
	{
		index: "cinderSwitch",
		brokenCard: "cinderMisstep",
		name: "Change Places",
		characterIndex: "cinder",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/cinder-retreat",
		effectArray: [
			{ index: "swapParty" },
			{ index: "temporaryHealth", amount: 4, targetOverride: "frontAlly" },
		],
		text: "Swap places with an ally. Whoever is left in front gains 4 Temporary HP.",
	},

	//-------------------------------------------------------------------------------------------
	//OUTFIT SIGNATURES (STARTER-REWORK-01 §1.4). One per alt outfit, added to the starting deck by
	//`cardAdditionArray`. `rarity: "starter"` keeps them out of every reward pool. `outfitSignature` lets
	//the upgrade services take them anyway, one level only (NODES-LIST §D: "Outfit-signature cards should
	//be allowed, they just don't upgrade infinitely"). The default outfit has no signature -- it rolls 3
	//random cards from the drop pool.
	//-------------------------------------------------------------------------------------------
	{
		index: "briennePlateEdge",
		name: "Plate Edge",
		characterIndex: "brienne",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/brienne-bash",
		effectArray: [
			{ index: "damage", amount: 4 },
			{ index: "temporaryHealth", amount: 4, targetOverride: "owner" },
		],
		outfitSignature: true,
		upgradeArray: [
			{ name: "Plate Edge+", effectArray: [
				{ index: "damage", amount: 6 },
				{ index: "temporaryHealth", amount: 6, targetOverride: "owner" },
			] },
		],
	},
	{
		//BASTION (OUTFITS-LIST): "3 Cost, Deal 18 damage, costs 1 more each time you lose HP this battle."
		index: "brienneHeadstrong",
		name: "Headstrong",
		characterIndex: "brienne",
		rarity: "starter",
		costArray: { energy: 3 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/brienne-bash",
		costPerOwnerHealthLoss: 1,
		effectArray: [{ index: "damage", amount: 18 }],
		text: "Deal {damage:18} damage. Costs 1 more for each time Brienne has lost health this fight.",
		outfitSignature: true,
		upgradeArray: [
			{ name: "Headstrong+", effectArray: [{ index: "damage", amount: 24 }],
				text: "Deal {damage:24} damage. Costs 1 more for each time Brienne has lost health this fight." },
		],
	},
	{
		//ALMONER (OUTFITS-LIST): "0 cost, spend all your tHP, your next card's cost is reduced by 1 for each
		//5 tHP spent."
		index: "brienneIncredibleWealth",
		name: "Incredible Wealth",
		characterIndex: "brienne",
		rarity: "starter",
		costArray: { energy: 0 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/brienne-guard",
		effectArray: [
			{ index: "spendTemporaryHealth", targetOverride: "owner" },
			{ index: "discountNextCard", amount: { index: "math", operation: "divide", left: { index: "tally", key: "temporarySpent" }, right: 5 } },
		],
		text: "Spend all your Temporary HP. Your next card costs 1 less for every 5 spent.",
		outfitSignature: true,
		upgradeArray: [
			{ name: "Incredible Wealth+", effectArray: [
				{ index: "spendTemporaryHealth", targetOverride: "owner" },
				{ index: "discountNextCard", amount: { index: "math", operation: "divide", left: { index: "tally", key: "temporarySpent" }, right: 4 } },
			], text: "Spend all your Temporary HP. Your next card costs 1 less for every 4 spent." },
		],
	},
	{
		index: "nettlePop",
		name: "Pop",
		characterIndex: "nettle",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-wither",
		effectArray: [
			{ index: "consumeStatus", status: "poison", stacks: 1 },
			{ index: "damage", amount: 12 },
		],
		outfitSignature: true,
		upgradeArray: [
			{ name: "Pop+", effectArray: [
				{ index: "consumeStatus", status: "poison", stacks: 1 },
				{ index: "damage", amount: 16 },
			] },
		],
	},
	{
		index: "nettleSpore",
		name: "Spore",
		characterIndex: "nettle",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-strike",
		//"Inflict 2 poison. If the enemy was already poisoned, inflict 2 poison on all other enemies." The
		//spread is asked FIRST, so "already" means before this card's own 2 land.
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 2, targetOverride: "otherEnemies",
				condition: { index: "hasStatus", of: "target", status: "poison" } },
			{ index: "applyStatus", status: "poison", stacks: 2 },
		],
		text: "Apply 2 Poison. If the target was already Poisoned, apply 2 Poison to every other enemy too.",
		outfitSignature: true,
		upgradeArray: [
			{ name: "Spore+", effectArray: [
				{ index: "applyStatus", status: "poison", stacks: 3, targetOverride: "otherEnemies",
					condition: { index: "hasStatus", of: "target", status: "poison" } },
				{ index: "applyStatus", status: "poison", stacks: 3 },
			], text: "Apply 3 Poison. If the target was already Poisoned, apply 3 Poison to every other enemy too." },
		],
	},
	{
		index: "nettleKiss",
		name: "Kiss",
		characterIndex: "nettle",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-wither",
		//"Target loses all lust and gains that much poison." `lustRemoved` is the soothe's own tally.
		effectArray: [
			{ index: "soothe", all: true },
			{ index: "applyStatus", status: "poison", stacks: { index: "tally", key: "lustRemoved" } },
		],
		text: "The target loses all its Lust and gains that much Poison.",
		outfitSignature: true,
		upgradeArray: [
			{ name: "Kiss+", costArray: { energy: 0 } },
		],
	},
	{
		index: "severineFinish",
		name: "Finish",
		characterIndex: "severine",
		rarity: "starter",
		costArray: { energy: 2 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-flurry",
		//Deal 10, doubled when the target OR Severine is below half health (OUTFITS-LIST).
		effectArray: [{
			index: "damage",
			amount: {
				index: "conditional",
				condition: {
					index: "anyOf",
					conditionArray: [
						{ index: "compare", operation: "less", left: { index: "healthFraction", of: "target" }, right: 0.5 },
						{ index: "compare", operation: "less", left: { index: "healthFraction", of: "source" }, right: 0.5 },
					],
				},
				then: 20,
				else: 10,
			},
		}],
		outfitSignature: true,
		upgradeArray: [
			{ name: "Finish+", effectArray: [{
				index: "damage",
				amount: {
					index: "conditional",
					condition: {
						index: "anyOf",
						conditionArray: [
							{ index: "compare", operation: "less", left: { index: "healthFraction", of: "target" }, right: 0.5 },
							{ index: "compare", operation: "less", left: { index: "healthFraction", of: "source" }, right: 0.5 },
						],
					},
					then: 26,
					else: 13,
				},
			}] },
		],
	},
	{
		index: "severineCut",
		name: "Cut",
		characterIndex: "severine",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/severine-drain",
		//"Deal 3 damage to yourself, gain 3 strength" -- the self-cost prints what Crimson Covenant makes of it.
		effectArray: [
			{ index: "loseHealth", amount: 3, targetOverride: "owner" },
			{ index: "applyStatus", status: "strength", stacks: 3, targetOverride: "owner" },
		],
		text: "Deal {selfDamage:3} damage to yourself. Gain 3 Strength.",
		outfitSignature: true,
		upgradeArray: [
			{ name: "Cut+", effectArray: [
				{ index: "loseHealth", amount: 3, targetOverride: "owner" },
				{ index: "applyStatus", status: "strength", stacks: 4, targetOverride: "owner" },
			], text: "Deal {selfDamage:3} damage to yourself. Gain 4 Strength." },
		],
	},
	{
		//BLOOD SAINT (OUTFITS-LIST): "Blood Moon -- 2 Cost, deal 20 damage to EVERYONE!" Named as designed. The
		//older rare that used the name (index severineBloodMoon) and its status are now "Blood for Blood".
		index: "severineBloodMoonRite",
		name: "Blood Moon",
		characterIndex: "severine",
		rarity: "starter",
		costArray: { energy: 2 },
		targetMode: "everyone",
		layout: "horizontal",
		artPath: "cards/art/severine-drain",
		effectArray: [{ index: "damage", amount: 20 }],
		outfitSignature: true,
		upgradeArray: [
			{ name: "Blood Moon+", costArray: { energy: 1 } },
		],
	},
	{
		index: "clemenceBlessedPain",
		name: "Blessed Pain",
		characterIndex: "clemence",
		rarity: "starter",
		costArray: { energy: 2 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-absolve",
		effectArray: [{ index: "heal", amount: 20 }],
		outfitSignature: true,
		upgradeArray: [
			{ name: "Blessed Pain+", effectArray: [{ index: "heal", amount: 28 }] },
		],
	},
	{
		index: "clemenceEdge",
		name: "Edge",
		characterIndex: "clemence",
		rarity: "starter",
		costArray: { energy: 0 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-rebuke",
		effectArray: [{ index: "lust", amount: 6 }],
		outfitSignature: true,
		upgradeArray: [
			{ name: "Edge+", effectArray: [
				{ index: "lust", amount: 6 },
				{ index: "drawCards", amount: 1 },
			] },
		],
	},
	{
		//ABBESS (OUTFITS-LIST): "An ally gains 2 strength and 6 lust."
		index: "clemenceGuidedHand",
		name: "Guided Hand",
		characterIndex: "clemence",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-absolve",
		effectArray: [
			{ index: "applyStatus", status: "strength", stacks: 2 },
			{ index: "lust", amount: 6 },
		],
		text: "An ally gains 2 Strength and 6 Lust.",
		outfitSignature: true,
		upgradeArray: [
			{ name: "Guided Hand+", effectArray: [
				{ index: "applyStatus", status: "strength", stacks: 3 },
				{ index: "lust", amount: 6 },
			], text: "An ally gains 3 Strength and 6 Lust." },
		],
	},
	{
		index: "cassadoraRead",
		name: "Read",
		characterIndex: "cassadora",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cassadora-fate",
		//Scry 3 (OUTFITS-LIST): look at the top three, discard any, the rest stay on top.
		effectArray: [{ index: "scry", count: 3 }],
		outfitSignature: true,
		upgradeArray: [
			{ name: "Read+", effectArray: [{ index: "scry", count: 5 }] },
		],
	},
	{
		index: "cassadoraMisdirect",
		name: "Misdirect",
		characterIndex: "cassadora",
		rarity: "starter",
		costArray: { energy: 2 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-hex",
		effectArray: [{ index: "applyStatus", status: "turncoat", stacks: 1 }],
		outfitSignature: true,
		upgradeArray: [
			{ name: "Misdirect+", costArray: { energy: 1 } },
		],
	},
	{
		//HEDGE WITCH (OUTFITS-LIST): "Jinx -- 0 cost, inflict weak or vulnerable at random" (Sundered replaced
		//Vulnerable). Named as designed; it shares its name with a common card and a status (warning report).
		index: "cassadoraIllWish",
		name: "Jinx",
		characterIndex: "cassadora",
		rarity: "starter",
		costArray: { energy: 0 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-hex",
		//One random Weak or Sundered.
		effectArray: [{ index: "randomStatus", statusArray: ["weak", "sundered"], stacks: 1 }],
		outfitSignature: true,
		upgradeArray: [
			{ name: "Jinx+", effectArray: [{ index: "randomStatus", statusArray: ["weak", "sundered"], stacks: 2 }] },
		],
	},
	{
		index: "cinderRush",
		name: "Rush",
		characterIndex: "cinder",
		rarity: "starter",
		costArray: { energy: 2 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-thrust",
		//"Rush -- 2 cost, deal 8, inflict 2 vulnerable" (Sundered replaced Vulnerable).
		effectArray: [
			{ index: "damage", amount: 8 },
			{ index: "applyStatus", status: "sundered", stacks: 2 },
		],
		outfitSignature: true,
		upgradeArray: [
			{ name: "Rush+", effectArray: [
				{ index: "damage", amount: 11 },
				{ index: "applyStatus", status: "sundered", stacks: 2 },
			] },
		],
	},
	{
		index: "cinderGoldStandard",
		name: "Gold Standard",
		characterIndex: "cinder",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "allyOther",
		layout: "horizontal",
		artPath: "cards/art/cinder-retreat",
		//"Move another ally to the front. Draw one of that character's cards."
		effectArray: [
			{ index: "shiftParty", shift: "front" },
			{ index: "drawOwnedCard" },
		],
		outfitSignature: true,
		upgradeArray: [
			{ name: "Gold Standard+", costArray: { energy: 0 } },
		],
	},
	{
		index: "cinderRecede",
		name: "Recede",
		characterIndex: "cinder",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-thrust",
		//Deal 6, +3 for every distinct debuff on Cinder (OUTFITS-LIST).
		effectArray: [{
			index: "damage",
			amount: {
				index: "math",
				operation: "add",
				left: 6,
				right: { index: "math", operation: "multiply", left: { index: "debuffCount", of: "source" }, right: 3 },
			},
		}],
		outfitSignature: true,
		upgradeArray: [
			{ name: "Recede+", effectArray: [{
				index: "damage",
				amount: {
					index: "math",
					operation: "add",
					left: 8,
					right: { index: "math", operation: "multiply", left: { index: "debuffCount", of: "source" }, right: 4 },
				},
			}] },
		],
	},
	{
		//NOT A REAL CARD. The default outfit's run-start roll shows this in the teambuilding preview
		//before a run exists; honeycomb.rollStartingCardArray replaces each copy with a real card when
		//the run begins, so it never reaches the deck, a reward, or a fight.
		index: "randomStartingCard",
		name: "Random Card",
		characterIndex: "neutral",
		type: "random",
		rarity: "special",
		costArray: null,
		targetMode: "none",
		layout: "horizontal",
		artPath: "cards/art/neutral-focus",
		effectArray: [],
		text: "A random card from this character's starting pool.",
	},
	{
		//THE FALLBACK CARD. Shown when nothing legal can be offered: a pool emptied by banishes, or a
		//named card that is banished. It removes itself the moment it lands (see honeycomb.addCardToRunDeck),
		//so taking it never grows the deck. Usable in the Battle Lab to empty every pool.
		index: "fallbackCard",
		name: "No Card",
		characterIndex: "neutral",
		type: "random",
		rarity: "special",
		costArray: null,
		targetMode: "none",
		layout: "horizontal",
		artPath: "cards/art/neutral-focus",
		effectArray: [],
		fallback: true,
		text: "No legal cards are available. Taking this leaves the deck unchanged.",
	},
];

//---------------------------------------------------------------------------------------------------
//Resolved card views
//---------------------------------------------------------------------------------------------------
//A card instance carries an upgrade level; the definition carries what each level changes. This
//folds the two into the card as it actually exists right now. Everything that renders or resolves a
//card goes through here, so upgrades never need special-casing anywhere else.
//---------------------------------------------------------------------------------------------------
//Upgrade paths
//---------------------------------------------------------------------------------------------------
//A card upgrades along a LADDER: `upgradeArray`, a list of override objects laid over the card one per
//level. A card may instead offer SEVERAL ladders -- `upgradePathArray: [{index, name, description,
//upgradeArray}]` -- and the copy being upgraded picks one the first time it is upgraded. The choice is
//remembered on the INSTANCE (`upgradePath`), so two copies of the same card can go different ways.
//
//Everything downstream is unchanged: a path is just which list of overrides gets laid on, so card text,
//the upgrade preview, the deck screen and the save need nothing new. A card with no paths behaves
//exactly as before, which is why every existing card keeps working.
//---------------------------------------------------------------------------------------------------
//Retired cards
//---------------------------------------------------------------------------------------------------
//Duplicates culled from the table: each shared a name (and mostly the rules) with a live card. A save
//written before the cull may still hold one, so every load rewrites it to its replacement
//(honeycomb.save.reconcileContent). The old definitions are kept in Archive/RETIRED-CARDS-S31.md.
honeycomb.retiredCardArray = [
	{ index: "brienneStrike", replacement: "brienneCleave" },
	{ index: "brienneGuard", replacement: "brienneGrit" },
	{ index: "nettleWither", replacement: "nettleVenomTouch" },
	{ index: "severineDrain", replacement: "severineQuaff" },
	{ index: "severineFlurry", replacement: "severineRend" },
	{ index: "cinderThrust", replacement: "cinderImpale" },
	{ index: "cinderChangePlaces", replacement: "cinderSwitch" },
	{ index: "clemenceOffering", replacement: "clemenceGrant" },
	{ index: "cassadoraBolt", replacement: "cassadoraWispBolt" },
	{ index: "cassadoraSecondThoughts", replacement: "cassadoraUnravel" },
	//More definitions in !designDocs/honeycomb/Archive/RETIRED-CARDS-S33.md.
	{ index: "brienneSteady", replacement: "brienneAlms" },
	{ index: "brienneShelter", replacement: "brienneIntercept" },
	{ index: "nettleSoulHarvest", replacement: "nettleGraveChoice" },
	{ index: "severineStrike", replacement: "severineBloodthirst" },
	{ index: "severineEnthrall", replacement: "severineBloodthirst" },
	{ index: "severineBloodlet", replacement: "severineBloodPrice" },
	{ index: "severineVitalFlow", replacement: "severineHeartsblood" },
	{ index: "cinderFallBack", replacement: "cinderBurnBright" },
	{ index: "cinderEmberwake", replacement: "cinderPhoenixHeart" },
	{ index: "cinderCometLance", replacement: "cinderSunspear" },
	{ index: "clemencePenitence", replacement: "clemencePrayer" },
	{ index: "clemenceTakeBurden", replacement: "clemenceMercy" },
	{ index: "clemenceYearning", replacement: "clemenceConfession" },
	{ index: "cassadoraFizzle", replacement: "cassadoraWheelOfFortune" },
	{ index: "cassadoraStillness", replacement: "cassadoraWheelOfFortune" },
	{ index: "cassadoraCrystalGaze", replacement: "cassadoraSleightOfHand" },
	{ index: "cassadoraPuppetStrings", replacement: "cassadoraAccomplice" },
];

honeycomb.cardUpgradePathArray = function (definition) {
	if (definition == null || definition.upgradePathArray == null) return [];
	return definition.upgradePathArray;
};

//The ladder a copy climbs: its chosen path's, else the card's own. Never null, so callers can measure it.
honeycomb.cardUpgradeArray = function (definition, pathIndex) {
	if (definition == null) return [];
	var pathArray = honeycomb.cardUpgradePathArray(definition);
	if (pathArray.length > 0) {
		var path = honeycomb.findDefinition(pathArray, pathIndex);
		//No path chosen yet: the first is what a plain "+1" would take, and what a preview shows.
		if (path == null) path = pathArray[0];
		return path.upgradeArray == null ? [] : path.upgradeArray;
	}
	return definition.upgradeArray == null ? [] : definition.upgradeArray;
};

//WHICH CARDS AN UPGRADE SERVICE MAY TOUCH. A starter basic carries `rarity: "starter"` and changes only
//through the progression tree, never at a rest site or shop.
//An outfit signature is the exception: it may climb its own ladder, which stops at its last level
//(NODES-LIST §D). A card may also refuse on its own with `unupgradable`.
honeycomb.cardIsUpgradable = function (definition) {
	if (definition == null) return false;
	if (definition.rarity == "starter" && definition.outfitSignature != true) return false;
	if (definition.unupgradable == true) return false;
	return true;
};

//How many levels this copy could still climb. Zero means it is finished, which is what the upgrade
//question filters on.
honeycomb.cardUpgradesRemaining = function (instance) {
	if (instance == null) return 0;
	var definition = honeycomb.findDefinition(honeycomb.cardArray, instance.cardIndex);
	if (definition == null) return 0;
	if (honeycomb.cardIsUpgradable(definition) == false) return 0;
	var ladderArray = honeycomb.cardUpgradeArray(definition, honeycomb.cardUpgradePathNow(instance));
	return Math.max(0, ladderArray.length - honeycomb.cardUpgradeLevelNow(instance));
};

//THE LEVEL AND PATH A COPY PLAYS AT RIGHT NOW: its own, plus anything a card gave it for
//this fight only (honeycomb.upgradeCardForCombat). Outside a fight the extras are gone, so these are
//the copy's own.
honeycomb.cardUpgradeLevelNow = function (instance) {
	if (instance == null) return 0;
	return (instance.upgradeLevel == null ? 0 : instance.upgradeLevel) +
		(instance.combatUpgradeLevel == null ? 0 : instance.combatUpgradeLevel);
};

honeycomb.cardUpgradePathNow = function (instance) {
	if (instance == null) return null;
	return instance.upgradePath != null ? instance.upgradePath
		: (instance.combatUpgradePath == null ? null : instance.combatUpgradePath);
};

//Whether this copy still has a path to CHOOSE: it offers several and has not started up one.
honeycomb.cardAwaitsUpgradePath = function (instance) {
	if (instance == null || honeycomb.cardUpgradePathNow(instance) != null) return false;
	var definition = honeycomb.findDefinition(honeycomb.cardArray, instance.cardIndex);
	return honeycomb.cardUpgradePathArray(definition).length > 1;
};

//---------------------------------------------------------------------------------------------------
//Broken cards
//---------------------------------------------------------------------------------------------------
//The pointer is `brokenCard` on the card, and it DEFAULTS from the owning character's own
//`brokenCard` -- so a new card needs no field at all, and naming one is how a card gets a special
//broken form later. Reading it goes through here and nowhere else.
//
//The swap happens at RESOLUTION, not at play: the player reads the card they are actually going to
//play, which is the only version of "silently" that is fair. The instance keeps its own cardIndex, so
//the card that lands in the discard pile is the real one and recovery restores the whole hand at once.
//THE STATIC PAIRING: what a card breaks into, ignoring who is broken and whether they are.
//A list that wants to SHOW both versions (the Compendium's broken-forms toggle) reads this; live play
//goes through brokenCardIndexFor below, which layers the owner's state on top.
//A FORM MAY BE CHOSEN BY RARITY: three cards may name their own forms per rarity, with the
//character's catch-all underneath for every other card.
//
//`brokenCardByRarity` on the character sits between the two: a card's own `brokenCard` still wins, then
//the rarity map, then the character's catch-all. Three rows instead of a field on every card, and a card
//added later gets the right form without anybody remembering to say so.
honeycomb.brokenFormIndexFor = function (definition) {
	if (definition == null || definition.rarity == "broken") return null;
	if (definition.brokenCard != null) return definition.brokenCard;
	var character = honeycomb.findDefinition(honeycomb.characterArray, definition.characterIndex);
	if (character == null) return null;
	var byRarity = character.brokenCardByRarity;
	if (byRarity != null && definition.rarity != null && byRarity[definition.rarity] != null) {
		return byRarity[definition.rarity];
	}
	return character.brokenCard == null ? null : character.brokenCard;
};

honeycomb.brokenCardIndexFor = function (definition, owner) {
	if (definition == null || owner == null || owner.broken != true) return null;
	//A card that IS a broken card never replaces itself.
	if (definition.rarity == "broken") return null;
	//SANCTIFIED: an owner holding a status that says `keepsCardsWhileBroken` plays their real
	//cards while broken.
	if (owner.statusArray != null) {
		for (var statusScan = 0; statusScan < owner.statusArray.length; statusScan++) {
			var held = honeycomb.findDefinition(honeycomb.statusArray == null ? [] : honeycomb.statusArray, owner.statusArray[statusScan].index);
			if (held != null && held.keepsCardsWhileBroken == true) return null;
		}
	}
	return honeycomb.brokenFormIndexFor(definition);
};

//Whether the swap applies at all right now. Only inside a LIVE fight: the deck screen, the teambuilding
//preview AND the victory reward screen show a party member's REAL cards. The reward screen was the leak
//The reward screen was the leak: it resolves its offers while run.combat still exists, so a broken member's
//whole reward pool showed as their one broken card. A fight whose outcome is decided is over.
honeycomb.brokenSwapActive = function () {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.combat == null) return false;
	return run.combat.phase != "victory" && run.combat.phase != "defeat";
};

//THE ART A CARD SHOWS, for the frame it is wearing. A card with one picture names `artPath` and that is
//that. A card that can appear in EITHER frame -- the shared broken forms, since a broken card now takes
//the shape of whatever it replaced -- names `artPathByLayout`, because the two windows are different
//shapes (3:2 against 2:3) and one picture cannot fill both without being cropped to nonsense.
honeycomb.cardArtPath = function (resolved) {
	if (resolved == null) return null;
	var layoutIndex = resolved.layout == null ? honeycomb.tuning.art.cardFrame.defaultLayout : resolved.layout;
	if (resolved.artPathByLayout != null && resolved.artPathByLayout[layoutIndex] != null) {
		return resolved.artPathByLayout[layoutIndex];
	}
	return resolved.artPath;
};

honeycomb.resolveCard = function (instance) {
	var definition = honeycomb.findDefinition(honeycomb.cardArray, instance == null ? null : instance.cardIndex);
	if (definition == null) return null;

	//THE BROKEN SWAP. Resolved from the replacement's definition, but stamped with what it replaced so
	//the hand can mark it and a tooltip can say which card is underneath.
	var replacedIndex = null;
	if (honeycomb.brokenSwapActive() == true) {
		var brokenIndex = honeycomb.brokenCardIndexFor(definition, honeycomb.cardOwnerMember(instance));
		var brokenDefinition = brokenIndex == null ? null : honeycomb.findDefinition(honeycomb.cardArray, brokenIndex);
		if (brokenDefinition != null) {
			replacedIndex = definition.index;
			definition = brokenDefinition;
		}
	}

	//Start from a shallow copy of the definition, then lay each earned upgrade level over it.
	var resolved = {};
	for (var fieldIndex in definition) {
		if (Object.prototype.hasOwnProperty.call(definition, fieldIndex) == false) continue;
		resolved[fieldIndex] = definition[fieldIndex];
	}

	//A broken card is what it is: the upgrades belong to the card underneath, not to the replacement,
	//so an upgraded Sword Strike and a plain one break into exactly the same thing.
	var level = replacedIndex != null ? 0 : honeycomb.cardUpgradeLevelNow(instance);
	//WHICH LADDER this copy is climbing: its own path when it has taken one, else
	//the card's plain `upgradeArray`. See honeycomb.cardUpgradeArray.
	var ladderArray = honeycomb.cardUpgradeArray(definition, honeycomb.cardUpgradePathNow(instance));
	for (var upgradeIndex = 0; upgradeIndex < level && upgradeIndex < ladderArray.length; upgradeIndex++) {
		var upgrade = ladderArray[upgradeIndex];
		for (var overrideIndex in upgrade) {
			if (Object.prototype.hasOwnProperty.call(upgrade, overrideIndex) == false) continue;
			resolved[overrideIndex] = upgrade[overrideIndex];
		}
	}

	//IN-PLACE STARTER UPGRADES: the owner's tree adjusts this card's OWN values. Applied
	//here so combat, the card text and the face all read the upgraded numbers, and the card is never
	//swapped for a variant. A broken card is what it is, so it is skipped, as upgrades are.
	var upgradeOwner = honeycomb.cardOwnerMember(instance) || (instance == null ? null : instance.upgradeOwner);
	if (replacedIndex == null && upgradeOwner != null) {
		var adjustmentArray = honeycomb.starterUpgradeArrayFor(upgradeOwner, instance.cardIndex);
		if (adjustmentArray.length > 0) {
			resolved.effectArray = honeycomb.applyStarterUpgradeArray(resolved.effectArray, adjustmentArray);
			honeycomb.applyStarterUpgradeFields(resolved, adjustmentArray);
			resolved.starterUpgraded = true;
		}
	}

	//Carry the instance's identity onto the view so effects can reach back to the real card.
	resolved.instanceId = instance.instanceId;
	resolved.ownerInstanceId = instance.ownerInstanceId;
	resolved.upgradeLevel = level;
	resolved.upgradePath = honeycomb.cardUpgradePathNow(instance);
	//What this replaced, when the owner is broken. Null the rest of the time, so every reader can test
	//for it without knowing anything about the broken system.
	resolved.brokenFrom = replacedIndex;
	//A BROKEN CARD KEEPS THE SHAPE OF THE CARD IT REPLACED. Every card has a broken form,
	//and all but the few authored per-card ones fall back to the character's single shared broken card
	//-- which is one definition with one `layout`. Not every broken card should print vertical just
	//because the shared form does.
	//
	//The frame is the physical card in hand; breaking changes what it does, not what shape it is. So the
	//layout comes from the card that broke. A broken form that must keep its own shape says
	//`layoutFixed: true` -- nothing does today, because the 55 authored forms already match their parents.
	if (replacedIndex != null) {
		var replacedDefinition = honeycomb.findDefinition(honeycomb.cardArray, replacedIndex);
		if (replacedDefinition != null && definition.layoutFixed != true && replacedDefinition.layout != null) {
			resolved.layout = replacedDefinition.layout;
		}
	}
	//Per-copy cost changes written by an effect. On the INSTANCE rather than the definition, so
	//discounting one copy does not discount every copy of that card.
	resolved.costModifierArray = instance.costModifierArray;
	resolved.costOverrideArray = instance.costOverrideArray;
	//A STOLEN MOVE (Cassadora's Pilfer): an enemy's card held by the party is used FOR the party, burns
	//itself when played, and wears its old owner's figure since enemy moves have no art of their own.
	if (instance.userSide != null) resolved.userSide = instance.userSide;
	//An enemy move costs nothing and prints no cost at all; held by the party it says 0.
	if (instance.userSide != null && resolved.costArray != null && resolved.costArray.energy == null) resolved.costArray = { energy: 0 };
	if (instance.exhausts == true) resolved.exhausts = true;
	if (resolved.artPath == null && instance.artEnemyIndex != null && honeycomb.art != null && honeycomb.art.spriteChain != null) {
		resolved.artChain = honeycomb.art.spriteChain({ side: "enemy", enemyIndex: instance.artEnemyIndex, health: 1, maxHealth: 1, statusArray: [] },
			"offense", { state: null });
	}
	return resolved;
};

//Printed rules text: whatever the definition wrote by hand, else generated from the effects. Generated
//text is written against the card's TARGET MODE, so a card that hits every enemy says so.
//
//`live` ({source, target, combat}) prints numbers as they would land RIGHT NOW -- the owner's Strength
//or Weak, the target's Sundered once one is known. Omitted, the printed numbers.
honeycomb.cardText = function (resolved, live, markup) {
	if (resolved == null) return "";
	if (resolved.text != null) return honeycomb.cardTextTokens(resolved.text, live, markup);
	//Targets are named from the player's point of view, by the team of whoever uses the card: the
	//combatant stamped on it (`userSide`, set on a move an AI combatant plays), else its natural team.
	return honeycomb.describeEffectArray(resolved.effectArray, {
		targetMode: resolved.targetMode, live: live == null ? null : live, markup: markup == true,
		userSide: honeycomb.cardUserSide(resolved),
	});
};

//How small a printed label must be set to fit, from how many characters it holds. See
//tuning.art.cardFrame (supertypeFit, textFit) and each card size's nameFit. Returns {scale, wrap}: `wrap` only
//when the settings allow a second line and even the smallest single-line size would not fit. Pure, so the
//card face (honeycomb.ui.cardLineFit) and the headless card fit rule share it.
honeycomb.cardLineFit = function (characterCount, settings) {
	if (characterCount <= settings.fitCount) return { scale: 1, wrap: false };
	var scale = settings.byArea == true ? Math.sqrt(settings.fitCount / characterCount) : settings.fitCount / characterCount;
	if (scale >= settings.minimumScale) return { scale: Number(scale.toFixed(3)), wrap: false };
	if (settings.wrapScale != null) return { scale: settings.wrapScale, wrap: true };
	return { scale: settings.minimumScale, wrap: false };
};

//LIVE NUMBERS IN HAND-WRITTEN TEXT. Generated text
//prints numbers as they would land; hand-written text is prose, so it marks the numbers that should do the
//same: "Deal {damage:9} damage." A token's kind picks the pipeline honeycomb.describeAmount runs it
//through ("damage" = the ordinary hit, "temporaryHealth"). With no live context, or an unknown kind, the
//token prints its own number. Only mark a number that really passes through that pipeline: a second
//"deal 5 more" hit, or damage a card deals to its own user, may not.
honeycomb.cardTextTokenPattern = /\{(\w+):(-?\d+)\}/g;
//"lust" is a valid token kind. honeycomb.describeAmount has understood the kind since Lust existed --
//it runs it through honeycomb.previewedLust, so a target's between-run weakness raises the printed
//number the same way Strength raises a printed hit. It was simply missing from the allowlist
//hand-written text is checked against, so an enemy whose prose named its Lust printed a flat number
//while the generated text beside it previewed.
honeycomb.cardTextTokenKindArray = ["damage", "temporaryHealth", "selfDamage", "lust"];

honeycomb.cardTextTokens = function (text, live, markup) {
	return String(text).replace(honeycomb.cardTextTokenPattern, function (whole, kind, number) {
		var amount = Number(number);
		if (honeycomb.cardTextTokenKindArray.indexOf(kind) < 0) return String(amount);
		//A SELF-COST previews what the owner's loadout makes of it (Crimson Covenant doubles it, Thin Skin
		//takes 1 off), marked like any changed number.
		if (kind == "selfDamage") {
			if (live == null || live.source == null) return String(amount);
			var effective = honeycomb.selfDamageAmount(live.source, amount);
			if (effective === amount) return String(amount);
			return markup == true ? "⟨" + (effective > amount ? "up" : "down") + ":" + effective + "⟩" : String(effective);
		}
		return honeycomb.describeAmount(amount, null, { live: live == null ? null : live, markup: markup == true },
			kind == "damage" ? null : kind);
	});
};

//Which team a card is being used by, for the words it is printed with. See honeycomb.teamWordArray.
honeycomb.cardUserSide = function (resolved) {
	if (resolved != null && resolved.userSide != null) return resolved.userSide;
	return honeycomb.cardNaturalSide(resolved);
};

//The same text as markup, with every keyword it mentions picked out, so the words the sidecar explains
//are visibly the words on the card, and every number a status has changed coloured up or down. Escaped
//first and highlighted second, so nothing in the text can smuggle markup in. Whole words only:
//"Lust" must not light up inside "Lustrous".
honeycomb.cardTextMarkup = function (resolved, live) {
	var markup = honeycomb.escapeText(honeycomb.cardText(resolved, live, true));
	markup = markup.replace(/⟨(up|down):(-?\d+)⟩/g, '<span class="hcAmount hcAmount-$1">$2</span>');
	var keywordIndexArray = honeycomb.cardKeywordArray(resolved);
	for (var scanIndex = 0; scanIndex < keywordIndexArray.length; scanIndex++) {
		var keyword = honeycomb.keywordDefinition(keywordIndexArray[scanIndex]);
		if (keyword == null || keyword.name == null) continue;
		var pattern = new RegExp("\\b(" + keyword.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")\\b", "g");
		markup = markup.replace(pattern, '<span class="hcKeyword" style="--hcKeywordColor:' +
			(keyword.color == null ? "inherit" : keyword.color) + '">$1</span>');
	}
	return markup;
};

//What a play does to its owner's place in the party, as a short printed line -- "Moves to the front".
//Empty when it moves nobody. The card face prints it, because a card that repositions somebody is a
//card whose whole meaning depends on it.
honeycomb.cardShiftLabel = function (resolved) {
	if (resolved == null || honeycomb.tuning.combat.partyShiftEnabled != true) return "";
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	var actor = combat == null ? honeycomb.cardOwnerMember(resolved) : honeycomb.cardActingEntity(resolved, combat);
	//A card shown before anyone owns it -- a reward, a shop shelf, the teambuilding list -- is read as
	//its character in their default loadout, which is the honest answer before a run exists.
	if (actor == null) {
		var character = honeycomb.findDefinition(honeycomb.characterArray, resolved.characterIndex);
		if (character != null) {
			actor = { side: "ally", characterIndex: character.index, outfitIndex: character.defaultOutfit, equipmentArray: [] };
		}
	}
	var shift = honeycomb.findDefinition(honeycomb.partyShiftArray, honeycomb.cardPartyShift(resolved, actor));
	return shift == null || shift.toRank == null ? "" : shift.name;
};

//The energy cost after every modifier has had a say. Relics and statuses may make a card cheaper.
honeycomb.cardCost = function (resolved, resourceIndex, context) {
	if (resolved == null || resolved.costArray == null) return null;
	var base = resolved.costArray[resourceIndex];
	if (base == null) return null;

	//A cost written onto this copy by an effect replaces the printed one outright; a modifier adjusts
	//it. Both are applied before the hook pipeline, so a relic still discounts an already-discounted
	//card rather than being overruled by it.
	if (resolved.costOverrideArray != null && resolved.costOverrideArray[resourceIndex] != null) {
		base = resolved.costOverrideArray[resourceIndex];
	}
	if (resolved.costModifierArray != null && resolved.costModifierArray[resourceIndex] != null) {
		base += resolved.costModifierArray[resourceIndex];
	}

	var combatNow = context != null && context.combat != null ? context.combat
		: (honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat);
	var owner = honeycomb.cardActingEntity(resolved, combatNow);
	//HEADSTRONG (Bastion): the card costs more for every time its owner has lost health this fight.
	if (resourceIndex == "energy" && resolved.costPerOwnerHealthLoss != null && owner != null && combatNow != null) {
		base += resolved.costPerOwnerHealthLoss * honeycomb.healthLossCount(owner, combatNow);
	}
	//THE NEXT CARD PLAYED COSTS LESS (Incredible Wealth). Party-wide: whoever plays next spends it.
	if (resourceIndex == "energy" && combatNow != null && combatNow.nextCardDiscount != null && resolved.userSide == null) {
		base -= combatNow.nextCardDiscount;
	}
	if (owner == null) return Math.max(0, Math.floor(base));
	var modified = honeycomb.applyStatusHooks("modifyCardCost", base,
		{ entity: owner, card: resolved, definition: resolved, context: context });
	return Math.max(0, Math.floor(modified));
};
