//===================================================================================================
//HONEYCOMB CATACOMBS -- state and save data
//===================================================================================================
//The shape of everything that persists, and the only code allowed to read or write localStorage.
//
//Two tiers of state:
//  PROFILE  survives runs. Unlocks, character levels, settings. Written whenever it changes.
//  RUN      the active expedition. Party, deck, resources, map position, live combat. Null between
//           runs, and thrown away when one ends.
//
//Both live on honeycomb.state, which is a plain serialisable object: no functions, no DOM references,
//no class instances. Anything that cannot survive JSON.stringify does not belong on it. That rule is
//what lets a save be an exact snapshot, which is in turn what makes deterministic replay possible --
//the RNG stream counters ride along with everything else.
window.honeycomb = window.honeycomb || {};

//The live state object. Null until boot builds or loads one.
honeycomb.state = null;

//---------------------------------------------------------------------------------------------------
//Resources
//---------------------------------------------------------------------------------------------------
//Resources are declared rather than hardcoded, so adding a currency is one table entry plus art.
//`scope` decides lifetime: "run" resources reset when a run begins, "profile" ones persist, and
//"combat" ones are rebuilt every fight (energy being the obvious case).
honeycomb.resourceArray = [
	{
		index: "gold",
		name: "Gold",
		iconPath: "icons/coins",
		scope: "run",
		startingValue: 0,
		minimumValue: 0,
		maximumValue: null,
		showInTopBar: true,
		sortOrder: 10,
	},
	{
		//Still a resource an event may grant or charge; no longer shown in the top bar, which gives the
		//space to relics. Set showInTopBar back once something spends keys.
		index: "keys",
		name: "Keys",
		iconPath: "icons/key",
		scope: "run",
		startingValue: 0,
		minimumValue: 0,
		maximumValue: null,
		showInTopBar: false,
		sortOrder: 20,
	},
	{
		//REWARD REROLLS (tree node). RUN scope: spent on the victory screen to re-roll the card offers.
		//Seeded at run start from the party's Reroll nodes (plus the benched "Always" tier).
		index: "reroll",
		name: "Reroll",
		iconPath: "icons/refresh",
		scope: "run",
		startingValue: 0,
		minimumValue: 0,
		maximumValue: null,
		showInTopBar: false,
		//`tracksMaximum`: the highest total ever granted (nodes, relics, events, anything) is remembered
		//so a relic can refill to it. Spending never lowers it.
		tracksMaximum: true,
		sortOrder: 30,
	},
	{
		//CARD BANISHES (tree node). RUN scope: spent to strike a card off this run's offer pools (rewards,
		//shop, journal). Seeded at run start from the party's Banish nodes (plus the benched "Always" tier).
		index: "banish",
		name: "Banish",
		iconPath: "icons/skull",
		scope: "run",
		startingValue: 0,
		minimumValue: 0,
		maximumValue: null,
		showInTopBar: false,
		tracksMaximum: true,
		sortOrder: 35,
	},
	{
		//The global progression pool. PROFILE scope: it survives runs, is shared across the entire
		//cast rather than owned by a character, and is readable with no run in progress.
		index: "experience",
		name: "Experience",
		iconPath: "icons/sun",
		scope: "profile",
		startingValue: 0,
		minimumValue: 0,
		maximumValue: null,
		//Not a run resource, so it does not belong in the run's top bar.
		showInTopBar: false,
		sortOrder: 5,
	},
	{
		index: "energy",
		name: "Energy",
		iconPath: "icons/flame-blue",
		scope: "combat",
		startingValue: 0,
		minimumValue: 0,
		maximumValue: null,
		showInTopBar: false,
		sortOrder: 40,
	},
];

//---------------------------------------------------------------------------------------------------
//Profile construction
//---------------------------------------------------------------------------------------------------
//A brand new player. Unlocks start at whatever the character table marks as unlocked from the outset,
//so the starting roster is content, not code.
honeycomb.newProfile = function () {
	return {
		formatVersion: honeycomb.tuning.save.formatVersion,

		//Run seed and RNG streams. Both are reset by beginRun; the values here only matter for any
		//randomness drawn outside a run.
		seed: honeycomb.rng.newSeed(),
		rng: {},
		identifierCounterArray: {},

		profile: {
			//Characters the player may field. Populated from the content table on first build so a
			//newly authored starting character appears without a save wipe.
			unlockedCharacterArray: honeycomb.defaultUnlockedCharacterArray(),
			//Which outfits have been earned, keyed by character: an outfit belongs to one person.
			unlockedOutfitArray: {},
			//Which equipment has been found. A flat list, because equipment is SHARED -- finding a
			//Whetstone finds it for the whole roster. See honeycomb.unlockKindArray.
			unlockedEquipmentArray: [],
			//Last party the player fielded, so the teambuilding screen reopens where they left it.
			lastPartyArray: [],
			//Profile-scope resource values. Experience lives here, which is what makes it survive a
			//run ending badly.
			resourceArray: {},
			//What this profile has ever seen, per discovery kind. The first-time bonus is paid against
			//it, so "more for defeating a NEW enemy" needs no per-run bookkeeping.
			discoveryArray: {},
			//Progression tree selections, per character. Profile scope, because the experience that
			//paid for a build survives runs and so must the build.
			progressionArray: {},
			//THE BETWEEN-RUN WEAKNESS LEDGER: how much lust each TAG has put on each
			//character, across every run this profile has played. Keyed characterIndex -> tag -> count.
			//The count itself changes nothing; the RANK it crosses into is where the whole of the extra
			//weakness lives. See honeycomb.lust and tuning.lust.exposureRankArray.
			lustExposureArray: {},
			//How many RANKS each tag has gained since the current run began: the most a weakness should
			//rise in one run is a single rank. Cleared at runStart, which is the boundary the ledger
			//already uses. Keyed characterIndex -> tag -> count.
			lustRankGainArray: {},
			//Blanket multipliers over how fast that ledger grows and decays, null for the tuning
			//default. Here rather than in tuning because a consumable, a cheat code or a difficulty
			//mode is a property of the PROFILE, not of the game's balance.
			lustExposureRate: null,
			lustExposureDecayRate: null,
			//Lifetime counters, for unlock conditions and for the player's own interest.
			runsStarted: 0,
			runsWon: 0,
			runsLost: 0,
			//Cards that may only ever happen once: a thrown item marked `onceEver` records its own index
			//here the moment it is thrown, and the pool that offers it drops it for good. Profile scope,
			//so the one-off reward really is one-off across every future run.
			onceEverArray: [],
			//Whether the mobile swipe hint has been shown: the hint that a phone's fullscreen notification
			//can be swiped aside should not display repeatedly, so once it has been read (or swiped away)
			//it is remembered here.
			swipeHintSeen: false,
		},

		//The active expedition, or null between runs.
		run: null,
	};
};

//Characters flagged `unlockedFromStart` in the content table. Reading it rather than listing names
//keeps the starting roster editable from one place.
honeycomb.defaultUnlockedCharacterArray = function () {
	var result = [];
	var sourceArray = honeycomb.characterArray || [];
	for (var characterIndex = 0; characterIndex < sourceArray.length; characterIndex++) {
		if (sourceArray[characterIndex].unlockedFromStart == true) {
			result.push(sourceArray[characterIndex].index);
		}
	}
	return result;
};

//---------------------------------------------------------------------------------------------------
//Run construction
//---------------------------------------------------------------------------------------------------
//Builds the run state for a chosen party. partySelectionArray members are
//{characterIndex, outfitIndex, equipmentArray} as assembled by the teambuilding screen.
//`options.lustBattle` builds the one-fight run a Lust Battle is played in: it is not a run the player
//chose, so it counts toward no lifetime total and leaves the per-run rank allowance alone.
honeycomb.newRun = function (partySelectionArray, seed, options) {
	var settings = options == null ? {} : options;
	var state = honeycomb.state;
	//A throwaway Lust Battle is not a run of the player's, so it is not counted as one in the telemetry
	//ledger either.
	if (settings.lustBattle == null) honeycomb.telemetry.note("runsStarted");

	//Reseed before anything draws. Every stream and every issued identifier restarts here, so two
	//runs begun from the same seed with the same party are identical down to the shuffle order.
	state.seed = (seed == null ? honeycomb.rng.newSeed() : seed) >>> 0;
	state.rng = {};
	state.identifierCounterArray = {};

	var run = {
		seed: state.seed,
		day: honeycomb.tuning.run.startingDay,
		//Party members are instances, not references: a run may alter a character's HP, deck and
		//equipment without touching the profile's copy.
		partyArray: [],
		//The shared draw deck. Every card is an instance with its own identifier, so two copies of
		//one card can be upgraded independently.
		deckArray: [],
		//Run-scope resources, seeded from tuning and then adjusted by relics and events.
		resourceArray: {},
		//The highest total each `tracksMaximum` resource has ever been granted this run. A refresh relic
		//reads it to refill; spending a resource never lowers it.
		resourceMaximumArray: {},
		//Relics and other passive items the party carries.
		relicArray: [],
		//Map state, built by the map generator once the run begins.
		map: null,
		//Live combat, non-null only while a fight is in progress. Saving mid-combat and reloading
		//resumes the same fight on the same turn.
		combat: null,
		//Set when the run finishes, so the summary screen knows how it ended.
		outcome: null,
	};

	for (var resourceIndex = 0; resourceIndex < honeycomb.resourceArray.length; resourceIndex++) {
		var resource = honeycomb.resourceArray[resourceIndex];
		if (resource.scope != "run") continue;
		var configured = honeycomb.tuning.run.startingResourceArray[resource.index];
		run.resourceArray[resource.index] = (configured == null ? resource.startingValue : configured);
	}

	for (var memberIndex = 0; memberIndex < partySelectionArray.length; memberIndex++) {
		var selection = partySelectionArray[memberIndex];
		//A selection that says nothing about equipment means "what this character starts with" -- their
		//heirloom. A list, even an empty one, is used as given. Either way only the pieces within the
		//party's capacity go on the run; the rest stay behind, greyed, on the teambuilding screen.
		var wornArray = selection.equipmentArray == null
			? honeycomb.equipment.startingArray(selection.characterIndex) : selection.equipmentArray;
		var member = honeycomb.newPartyMember({
			characterIndex: selection.characterIndex,
			outfitIndex: selection.outfitIndex,
			equipmentArray: honeycomb.equipment.activeArray(wornArray, partySelectionArray.length),
		});
		if (member == null) continue;
		run.partyArray.push(member);
	}

	state.run = run;
	honeycomb.equipment.recordRunUse(run.partyArray);

	//STARTING GOLD (tree node). Summed across the party's selected nodes and added on top of the
	//resource's configured starting value, so the node stacks with tuning rather than replacing it.
	var startingGold = honeycomb.partyFieldTotal("startingGold");
	if (startingGold != 0) honeycomb.addResource("gold", startingGold);

	//REWARD REROLLS (tree node). Party-wide plus the benched tier; spent on the victory screen.
	run.resourceArray.reroll = honeycomb.partyFieldTotal("rewardReroll") + honeycomb.profileFieldTotal("rewardRerollAlways");

	//CARD BANISHES (tree node). Party-wide plus the benched tier; spent to strike cards off the offer
	//pools. The banished list is per-run, so a new run starts with none.
	run.resourceArray.banish = honeycomb.partyFieldTotal("rewardBanish") + honeycomb.profileFieldTotal("rewardBanishAlways");
	run.banishedCardArray = [];

	//ANY resource that tracks its maximum starts with its seeded value as that maximum, so a refresh
	//relic can refill to the run's full allowance however it was granted.
	for (var maximumIndex = 0; maximumIndex < honeycomb.resourceArray.length; maximumIndex++) {
		var maximumResource = honeycomb.resourceArray[maximumIndex];
		if (maximumResource.tracksMaximum != true) continue;
		run.resourceMaximumArray[maximumResource.index] = run.resourceArray[maximumResource.index] == null
			? 0 : run.resourceArray[maximumResource.index];
	}

	//Roll every default outfit's run-start random cards now, before the deck is built, and keep the
	//result on the member so a save and reload keeps the exact same cards.
	for (var rollIndex = 0; rollIndex < run.partyArray.length; rollIndex++) {
		var rollMember = run.partyArray[rollIndex];
		var rollOutfit = honeycomb.findOutfit(honeycomb.findDefinition(honeycomb.characterArray, rollMember.characterIndex), rollMember.outfitIndex);
		var rollCount = honeycomb.outfitRandomCardCount(rollMember, rollOutfit);
		if (rollCount > 0) rollMember.randomCardIndexArray = honeycomb.rollStartingCardArray(rollMember, rollCount);
		var replaceArray = honeycomb.rollRandomReplaceArray(rollMember);
		if (replaceArray.length > 0) rollMember.randomReplaceArray = replaceArray;
	}

	//Each member contributes their card pool to the shared deck once the run starts, which is the
	//whole point of teambuilding: the deck is the party.
	honeycomb.rebuildRunDeck();

	//Every card in the opening deck is HELD, and holding one for the first time is a discovery -- which
	//is what makes trying the outfit that swaps a card worth something beyond the card.
	if (honeycomb.discovery != null) {
		for (var heldIndex = 0; heldIndex < run.deckArray.length; heldIndex++) {
			honeycomb.discovery.meet("card", run.deckArray[heldIndex].cardIndex, null);
		}
	}

	if (settings.lustBattle != null) {
		run.lustBattle = settings.lustBattle;
		return run;
	}
	state.profile.runsStarted += 1;
	//A run is the boundary the per-run rank allowance is measured in, so the count of ranks already
	//taken is cleared here -- the same boundary lust itself is cleared at.
	if (honeycomb.lust != null && honeycomb.lust.clearRankGains != null) honeycomb.lust.clearRankGains();
	return run;
};

//Turns a teambuilding selection into a live party member.
honeycomb.newPartyMember = function (selection) {
	var definition = honeycomb.requireDefinition(honeycomb.characterArray, selection.characterIndex, "honeycomb.characterArray");
	if (definition == null) return null;

	var outfitIndex = selection.outfitIndex == null ? definition.defaultOutfit : selection.outfitIndex;
	var member = {
		instanceId: honeycomb.nextIdentifier("ally"),
		characterIndex: definition.index,
		outfitIndex: outfitIndex,
		//Equipment is a list of item indices; the engine treats it exactly like relics but scoped to
		//one character, which is what lets equipment alter that character's cards.
		equipmentArray: selection.equipmentArray == null ? [] : selection.equipmentArray.slice(),
		//Charges held for each of this member's abilities, as {index, charges}. WHICH abilities they
		//have is derived from character plus outfit plus equipment; only how many uses remain is
		//state. honeycomb.abilities.reconcile keeps the two in step.
		abilityChargeArray: [],
		//Combat vitals. maxHealth is recomputed from definition plus modifiers whenever equipment or
		//outfit changes, so it is stored rather than derived at read time.
		health: 0,
		maxHealth: 0,
		//EXTRA HEALTH PAST THE END OF THE BAR, spent before ordinary health and halved at the start of
		//its owner's turn. Cleared between fights.
		temporaryHealth: 0,
		//LUST, and whether it has caught them. Both CARRY between fights the way health does, so a
		//party can walk the map with a broken member; every map movement bleeds a little lust back
		//(honeycomb.tuning.lust.decayPerMapMove). brokenTurnCount drives the spiral and resets per fight.
		lust: 0,
		broken: false,
		brokenTurnCount: 0,
		//Status effects: {index, stacks, duration}. Cleared between combats unless the status says
		//otherwise.
		statusArray: [],
		//Whether the member is out of the fight. A player character is never downed -- they break
		//instead -- but the flag stays for anything that still dies.
		downed: false,
		//Cosmetic and animation state that is safe to serialise.
		spriteFrame: "idle",
	};

	honeycomb.recalculateMemberStats(member);
	member.health = member.maxHealth;
	return member;
};

//Recomputes derived stats from the character definition plus outfit, equipment and relic modifiers.
//Called whenever any of those change. Kept separate so the teambuilding preview and the live run use
//the same arithmetic.
//A character's health before any modifier. Characters share one number (tuning.run.characterBaseHealth)
//so that tankiness comes from the Vigour ranks a tree offers rather than from an innate gap; a
//character naming its own `baseHealth` overrides it.
honeycomb.characterBaseHealth = function (definition) {
	if (definition == null) return 0;
	if (definition.baseHealth != null) return definition.baseHealth;
	return honeycomb.tuning.run.characterBaseHealth;
};

honeycomb.recalculateMemberStats = function (member) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, member.characterIndex);
	if (definition == null) return;

	var previousMaximum = member.maxHealth;
	//Outfit, equipment and progression, through the one modifier list -- so a tree node that grants
	//health is not a special case here.
	var maximum = honeycomb.characterBaseHealth(definition) + honeycomb.memberHealthModifier(member);

	member.maxHealth = Math.max(1, maximum);
	//A maximum that grows mid-run grants the difference rather than leaving the bar short; one that
	//shrinks clamps current health down to it.
	//
	//A DOWNED member is granted nothing. Health above zero while downed is a contradiction every screen
	//would read its own way -- the bar would say "6 HP" while the cards say "Brienne is down" and the
	//sprite is greyed. Reviving stays the one rule that brings a member back.
	if (previousMaximum > 0 && member.maxHealth > previousMaximum && member.downed != true) {
		member.health += (member.maxHealth - previousMaximum);
	}
	if (member.downed == true) member.health = 0;
	if (member.health > member.maxHealth) member.health = member.maxHealth;
};

//Finds an outfit on a character definition. Outfits are per character rather than global, since an
//outfit is art plus a card-pool override rather than a standalone item.
honeycomb.findOutfit = function (definition, outfitIndex) {
	if (definition == null || definition.outfitArray == null) return null;
	return honeycomb.findDefinition(definition.outfitArray, outfitIndex);
};

//An outfit's description as bullet lines: an array is used as written, a string is split into sentences.
honeycomb.outfitDescriptionLines = function (outfit) {
	if (outfit == null || outfit.description == null) return [];
	if (Array.isArray(outfit.description)) return outfit.description.slice();
	var lineArray = String(outfit.description).split(/\.\s+(?=[A-Z0-9+\-])/);
	var result = [];
	for (var lineIndex = 0; lineIndex < lineArray.length; lineIndex++) {
		var line = lineArray[lineIndex].trim();
		if (line === "") continue;
		result.push(/[.!?]$/.test(line) ? line : line + ".");
	}
	return result;
};

//The same lines as a bulleted list, for any screen that shows an outfit's effect.
honeycomb.outfitDescriptionMarkup = function (outfit, className) {
	var lineArray = honeycomb.outfitDescriptionLines(outfit);
	if (lineArray.length === 0) return "";
	var markup = '<ul class="hcOutfitBullets' + (className == null ? "" : " " + className) + '">';
	for (var lineIndex = 0; lineIndex < lineArray.length; lineIndex++) {
		markup += "<li>" + honeycomb.escapeText(lineArray[lineIndex]) + "</li>";
	}
	return markup + "</ul>";
};

//---------------------------------------------------------------------------------------------------
//Deck assembly
//---------------------------------------------------------------------------------------------------
//The run deck is the union of every party member's card pool, plus anything picked up along the way.
//Rebuilt from scratch whenever the party composition changes, which only happens before a run begins;
//during a run, cards are added and removed individually so acquired cards are never lost.
honeycomb.rebuildRunDeck = function () {
	var run = honeycomb.state.run;
	if (run == null) return;

	//Cards acquired during the run are marked `acquired` and survive a rebuild. Character-granted
	//cards are regenerated, so an outfit change swaps them cleanly.
	var keptArray = [];
	for (var keepIndex = 0; keepIndex < run.deckArray.length; keepIndex++) {
		if (run.deckArray[keepIndex].acquired == true) keptArray.push(run.deckArray[keepIndex]);
	}

	run.deckArray = [];
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var contributionArray = honeycomb.memberCardPool(run.partyArray[memberIndex]);
		for (var cardIndex = 0; cardIndex < contributionArray.length; cardIndex++) {
			run.deckArray.push(contributionArray[cardIndex]);
		}
	}
	for (var restoreIndex = 0; restoreIndex < keptArray.length; restoreIndex++) {
		run.deckArray.push(keptArray[restoreIndex]);
	}
};

//---------------------------------------------------------------------------------------------------
//Member pools
//---------------------------------------------------------------------------------------------------
//A POOL is a list of things a character brings to a run that outfits and equipment may alter: their
//cards, and their abilities. Both resolve identically, so one resolver serves both and a third pool
//is a table entry rather than a second copy of this code.
//
//Resolution order is deliberate and documented, because it is the seam future content hangs on:
//  1. the character's base pool
//  2. the outfit's replacements (swap one index for another) and additions
//  3. each equipment's additions and replacements, in the order equipped
//Anything that wants to remove an entry replaces it with null.
//
//THE POOL IS REBUILT, NEVER PATCHED. Every call starts from the character's base list and lays the
//modifiers over it in order. Editing entries in place produced a list that disagreed with itself:
//equipping the Duelist's Blade rewrote Sword Strike's row to Riposte and left the original Riposte
//row untouched, so the same card appeared twice at the position the replaced card used to hold.
//
//Which fields a pool reads. Adding a pool means adding a row here and naming the fields content will
//write; nothing else in the resolver changes.
honeycomb.poolKindArray = [
	{
		index: "card",
		//Where the character's own list lives.
		baseField: "startingCardArray",
		//What a modifier writes to alter it.
		additionField: "cardAdditionArray",
		replacementField: "cardReplacementArray",
		//Trims copies: [{index, count}]. A removal with no count drops the row outright.
		removalField: "cardRemovalArray",
		//Cards come in multiples; an ability is held once.
		allowsCounts: true,
	},
	{
		index: "ability",
		baseField: "startingAbilityArray",
		additionField: "abilityAdditionArray",
		replacementField: "abilityReplacementArray",
		allowsCounts: false,
	},
];

//The resolved pool of one kind for one member, as COUNTS, before any instance exists. Split out from
//the minting step so the teambuilding screen can preview a deck live -- as outfits and equipment are
//toggled -- without issuing identifiers it would then have to throw away.
//selection is {characterIndex, outfitIndex, equipmentArray}; a live party member satisfies it too.
honeycomb.memberPoolEntryArray = function (selection, poolKindIndex) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray,
		selection == null ? null : selection.characterIndex);
	var kind = honeycomb.requireDefinition(honeycomb.poolKindArray, poolKindIndex, "honeycomb.poolKindArray");
	if (definition == null || kind == null) return [];

	var baseArray = definition[kind.baseField];
	var entryArray = [];
	for (var baseIndex = 0; baseArray != null && baseIndex < baseArray.length; baseIndex++) {
		var base = baseArray[baseIndex];
		var count = kind.allowsCounts == false || base.count == null ? 1 : base.count;
		entryArray.push(honeycomb.newPoolEntry(base.index, count,
			{ kind: "character", index: definition.index, name: definition.name }));
	}

	var modifierArray = honeycomb.memberCardModifierArray(selection);
	for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
		entryArray = honeycomb.applyPoolModifier(entryArray, modifierArray[modifierIndex].modifier,
			modifierArray[modifierIndex].source, kind);
	}

	var result = honeycomb.coalescePoolEntryArray(entryArray, kind);
	//RUN-START RANDOM CARDS (STARTER-REWORK-01 §1.4/§3). The default outfit adds N random cards. A LIVE
	//member carries the fixed roll (`randomCardIndexArray`); a teambuilding preview carries none and
	//shows the stand-in, replaced the moment the run begins.
	if (kind.index == "card") {
		var randomOutfit = honeycomb.findOutfit(definition, selection.outfitIndex);
		var randomCount = honeycomb.outfitRandomCardCount(selection, randomOutfit);
		if (randomCount > 0) {
			var randomSource = { kind: "outfit", index: randomOutfit.index, name: randomOutfit.name };
			var rolledArray = selection.randomCardIndexArray;
			if (rolledArray != null && rolledArray.length > 0) {
				for (var rolledIndex = 0; rolledIndex < rolledArray.length; rolledIndex++) {
					result.push(honeycomb.newPoolEntry(rolledArray[rolledIndex], 1, randomSource));
				}
			} else {
				for (var placeholderIndex = 0; placeholderIndex < randomCount; placeholderIndex++) {
					result.push(honeycomb.newPoolEntry("randomStartingCard", 1, randomSource));
				}
			}
		}
	}
	//Coalesce again so the preview shows one "Random Card x3" row and a rolled card that matches a
	//base row merges rather than sitting twice.
	return honeycomb.coalescePoolEntryArray(result, kind);
};

//The card pool, by its own name. Every caller that means cards specifically says so.
honeycomb.memberCardEntryArray = function (selection) {
	return honeycomb.memberPoolEntryArray(selection, "card");
};

honeycomb.memberAbilityEntryArray = function (selection) {
	return honeycomb.memberPoolEntryArray(selection, "ability");
};

//Everything entitled to alter one member's pools, in resolution order, each paired with a description
//of where it came from so a deck view can say WHY an entry is in the list.
//
//Adding a new kind of pool modifier -- a progression node, a consumed item, a manual deck edit --
//means appending to this list and nothing else: applyPoolModifier already speaks the shape, and both
//cards and abilities pick the change up at once.
honeycomb.memberCardModifierArray = function (selection) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, selection.characterIndex);
	if (definition == null) return [];
	var result = [];

	var outfit = honeycomb.findOutfit(definition, selection.outfitIndex);
	if (outfit != null) {
		//U1 (tree node "Sister Wardrobe"): the worn outfit adds its cards twice. U2 ("Tailored"): the
		//cards it adds arrive upgraded. Both rebuild the addition list in a shallow copy, so the shared
		//outfit definition is never mutated.
		var doublesOutfitCards = honeycomb.characterFieldFlag(selection.characterIndex, "outfitCardDoubling") == true;
		var upgradesOutfitCards = honeycomb.characterFieldFlag(selection.characterIndex, "outfitCardUpgrade") == true;
		var outfitModifier = outfit;
		if ((doublesOutfitCards == true || upgradesOutfitCards == true) &&
			outfit.cardAdditionArray != null && outfit.cardAdditionArray.length > 0) {
			outfitModifier = {};
			for (var outfitField in outfit) {
				if (Object.prototype.hasOwnProperty.call(outfit, outfitField)) outfitModifier[outfitField] = outfit[outfitField];
			}
			outfitModifier.cardAdditionArray = [];
			for (var addIndex = 0; addIndex < outfit.cardAdditionArray.length; addIndex++) {
				var addEntry = outfit.cardAdditionArray[addIndex];
				var addition = {
					index: addEntry.index,
					count: (addEntry.count == null ? 1 : addEntry.count) * (doublesOutfitCards == true ? 2 : 1),
				};
				if (upgradesOutfitCards == true) addition.upgradeLevel = 1;
				outfitModifier.cardAdditionArray.push(addition);
			}
		}
		result.push({ modifier: outfitModifier, source: { kind: "outfit", index: outfit.index, name: outfit.name } });
	}

	var equipmentArray = selection.equipmentArray == null ? [] : selection.equipmentArray;
	for (var equipIndex = 0; equipIndex < equipmentArray.length; equipIndex++) {
		var equipment = honeycomb.findDefinition(honeycomb.equipmentArray, equipmentArray[equipIndex]);
		if (equipment == null) continue;
		result.push({ modifier: equipment, source: { kind: "equipment", index: equipment.index, name: equipment.name } });
	}

	//Progression comes LAST, so a tree node overrides an outfit rather than the other way round: the
	//tree is what the player deliberately built, and the costume is what they put on today.
	//
	//A tree node carries the same modifier fields an outfit does, so it needed no adapter -- appending
	//it here is the whole of the integration, and cards, abilities, tags and hooks all pick it up.
	var nodeArray = honeycomb.progression == null ? [] : honeycomb.progression.selectedNodeArray(selection);
	for (var nodeIndex = 0; nodeIndex < nodeArray.length; nodeIndex++) {
		result.push({
			modifier: nodeArray[nodeIndex],
			source: { kind: "progression", index: nodeArray[nodeIndex].index, name: nodeArray[nodeIndex].name },
		});
	}

	//AN OUTFIT'S A2 LINE (OUTFITS-LIST): the tree grants Ability 2, so an outfit that changes or disables
	//it has to be heard AFTER the tree. `treeAbilityReplacementArray` rides here, past the nodes; a `to` of
	//null disables the ability outright.
	if (outfit != null && outfit.treeAbilityReplacementArray != null) {
		result.push({
			modifier: { abilityReplacementArray: outfit.treeAbilityReplacementArray },
			source: { kind: "outfit", index: outfit.index, name: outfit.name },
		});
	}

	//RESOLVED RUN-START RANDOM REPLACEMENTS (STARTER-REWORK-01 §1.3). A node declares which basic to
	//replace and at what rarity (`randomReplaceArray`); newRun rolls it into `member.randomReplaceArray`,
	//and it applies here like any other replacement so the pool resolver needs no special case.
	if (selection.randomReplaceArray != null && selection.randomReplaceArray.length > 0) {
		result.push({
			modifier: { cardReplacementArray: selection.randomReplaceArray },
			source: { kind: "randomReplace", index: "randomReplace", name: "Run-start replacement" },
		});
	}

	return result;
};

//How many run-start random cards a worn outfit adds (the default outfit's 3). A selected Sister Wardrobe
//(`outfitCardDoubling`) doubles them exactly as it doubles a signature card (AUDIT-01).
honeycomb.outfitRandomCardCount = function (selection, outfit) {
	if (outfit == null || outfit.randomCardCount == null) return 0;
	var doubles = selection != null && honeycomb.characterFieldFlag(selection.characterIndex, "outfitCardDoubling") == true;
	return outfit.randomCardCount * (doubles ? 2 : 1);
};

//In-place starter upgrades: a progression node adjusts a starter card's OWN values -- Nettle's Wither
//node is "-2 damage, +1 poison" on the same `nettleVenomTouch` -- rather than swapping it for a variant
//card. A ranked node appears once per rank in the modifier list, so its adjustments SUM across ranks.
//Returns every adjustment naming `cardIndex`, in resolution order.
honeycomb.starterUpgradeArrayFor = function (owner, cardIndex) {
	var result = [];
	if (owner == null || cardIndex == null) return result;
	var modifierArray = honeycomb.memberCardModifierArray(owner);
	for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
		var list = modifierArray[modifierIndex].modifier.starterUpgradeArray;
		if (list == null) continue;
		for (var entryIndex = 0; entryIndex < list.length; entryIndex++) {
			if (list[entryIndex].card == cardIndex) result.push(list[entryIndex]);
		}
	}
	return result;
};

//Applies adjustments to a card's effect list, deep-copying the entries it touches so the shared
//definition is never mutated. An adjustment matches on `effect` (the verb) and, when given, `status`.
//`amount` and `stacks` add; two value expressions compose with `math` so a ranked path scales a
//computed number (Cassadora Nail adds a `debuffCount` damage line once per rank).
//
//`replaceEffectArray` rewrites the card's WHOLE list, which is how an exclusive path turns a basic into
//a choose-one form. Replacement is a TOP-LEVEL instruction only, so it is not re-applied to the nested
//lists a copy recurses into. `depth` is that guard.
honeycomb.applyStarterUpgradeArray = function (effectArray, adjustmentArray, depth) {
	if (effectArray == null || adjustmentArray == null || adjustmentArray.length === 0) return effectArray;
	var level = depth == null ? 0 : depth;
	//A form that rewrites the whole card (a defensive basic becoming choose-one) supplies its own list.
	if (level === 0) {
		for (var replaceIndex = 0; replaceIndex < adjustmentArray.length; replaceIndex++) {
			if (adjustmentArray[replaceIndex].replaceEffectArray == null) continue;
			effectArray = adjustmentArray[replaceIndex].replaceEffectArray;
			break;
		}
	}
	var result = [];
	for (var entryIndex = 0; entryIndex < effectArray.length; entryIndex++) {
		var entry = effectArray[entryIndex];
		var copy = {};
		for (var fieldIndex in entry) {
			if (Object.prototype.hasOwnProperty.call(entry, fieldIndex) == false) continue;
			copy[fieldIndex] = entry[fieldIndex];
		}
		if (copy.effectArray != null) copy.effectArray = honeycomb.applyStarterUpgradeArray(copy.effectArray, adjustmentArray, level + 1);
		var adjusted = false;
		for (var adjustIndex = 0; adjustIndex < adjustmentArray.length; adjustIndex++) {
			var adjustment = adjustmentArray[adjustIndex];
			if (adjustment.effect != copy.index) continue;
			if (adjustment.status != null && adjustment.status != copy.status) continue;
			if (adjustment.amount != null && typeof copy.amount === "number") { copy.amount += adjustment.amount; adjusted = true; }
			if (adjustment.stacks != null && typeof copy.stacks === "number") { copy.stacks += adjustment.stacks; adjusted = true; }
		}
		//A DAMAGE LINE UPGRADED DOWN TO NOTHING IS GONE, not "Deal 0 damage": a 0 hit still carries the
		//owner's Strength, so Wither's pure-negative rank would otherwise keep hitting (AUDIT-01).
		if (adjusted == true && copy.index === "damage" && typeof copy.amount === "number" && copy.amount <= 0) continue;
		result.push(copy);
	}
	//ADDED lines belong to the card's own list only. Recursing them into a nested list (a `repeat`) would
	//add them once per level -- Drink healed three times over before this guard (AUDIT-01).
	if (level > 0) return result;
	//ADDED effects (an upgrade may grant the card a NEW line, e.g. Brienne's "gain 2 tHP" on her attack)
	//are merged by verb+status and their amounts summed, so three ranks read as ONE "gain 6 tHP" line. Two
	//value expressions have no number to sum, so they compose with `math add` and scale instead.
	var addedMap = {};
	var addedArray = [];
	for (var addAdjustIndex = 0; addAdjustIndex < adjustmentArray.length; addAdjustIndex++) {
		var addList = adjustmentArray[addAdjustIndex].addEffectArray;
		if (addList == null) continue;
		for (var addIndex = 0; addIndex < addList.length; addIndex++) {
			var add = addList[addIndex];
			var key = honeycomb.starterEffectKey(add);
			var held = addedMap[key];
			if (held == null) {
				held = {};
				for (var addField in add) {
					if (Object.prototype.hasOwnProperty.call(add, addField) == false) continue;
					held[addField] = add[addField];
				}
				addedMap[key] = held;
				addedArray.push(held);
			} else {
				honeycomb.mergeStarterEffect(held, add);
			}
		}
	}
	//An added line FOLDS INTO a matching base line rather than sitting beside it, so "1 Weak" from the
	//base and "+1 Weak" from a rank read as one "2 Weak". Matching is by verb+status+target+condition, so
	//a base single-target hit and an added all-enemies hit stay apart.
	for (var appendIndex = 0; appendIndex < addedArray.length; appendIndex++) {
		var appended = addedArray[appendIndex];
		var appendedKey = honeycomb.starterEffectKey(appended);
		var matched = null;
		for (var scanIndex = 0; scanIndex < result.length; scanIndex++) {
			if (honeycomb.starterEffectKey(result[scanIndex]) === appendedKey) { matched = result[scanIndex]; break; }
		}
		if (matched == null) { result.push(appended); continue; }
		honeycomb.mergeStarterEffect(matched, appended);
	}
	return result;
};

//Identity two adjustments share when they mean the same line of a card.
honeycomb.starterEffectKey = function (entry) {
	if (entry == null) return "";
	return String(entry.index) + "|" + (entry.status == null ? "" : entry.status) + "|" +
		(entry.targetOverride == null ? "" : entry.targetOverride) + "|" +
		(entry.condition == null ? "" : JSON.stringify(entry.condition));
};

//Sums a second effect entry's amount and stacks into the first.
honeycomb.mergeStarterEffect = function (held, add) {
	if (held == null || add == null) return held;
	if (add.amount != null) {
		if (typeof held.amount === "number" && typeof add.amount === "number") held.amount += add.amount;
		else if (held.amount != null) held.amount = { index: "math", operation: "add", left: held.amount, right: add.amount };
	}
	if (add.stacks != null) held.stacks = (typeof held.stacks === "number" ? held.stacks : 0) + add.stacks;
	return held;
};

//ABILITY OVERRIDES (tree-node training wheels). A node may carry `abilityUpgradeArray`:
//[{ability, effectArray?, text?, requirementArray?, spendArray?, chargeMaximum?, rechargeOn?, disableMechanic?}].
//The ability keeps its own index, so the player still holds "Dig In"; the node changes what it does and
//whether it still fuels the character's mechanic. Returns every override naming `abilityIndex`, in
//resolution order, so a ranked node could layer them.
honeycomb.abilityUpgradeArrayFor = function (owner, abilityIndex) {
	var result = [];
	if (owner == null || abilityIndex == null) return result;
	var modifierArray = honeycomb.memberCardModifierArray(owner);
	for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
		var list = modifierArray[modifierIndex].modifier.abilityUpgradeArray;
		if (list == null) continue;
		for (var entryIndex = 0; entryIndex < list.length; entryIndex++) {
			if (list[entryIndex].ability == abilityIndex) result.push(list[entryIndex]);
		}
	}
	return result;
};

//A non-effect field an adjustment overrides on the card -- `typeArray` (a form whose damage falls to
//zero reads as pure `negative`) and `partyShift` ("does not change position"). Returns the last
//override, or null.
honeycomb.starterUpgradeFieldFor = function (adjustmentArray, fieldName) {
	if (adjustmentArray == null) return null;
	var found = null;
	for (var scanIndex = 0; scanIndex < adjustmentArray.length; scanIndex++) {
		if (adjustmentArray[scanIndex][fieldName] != null) found = adjustmentArray[scanIndex][fieldName];
	}
	return found;
};

//Lays every non-effect field an adjustment overrides onto an already-resolved card, so the card face,
//the text and combat all agree on its type and whether playing it moves its owner.
honeycomb.applyStarterUpgradeFields = function (resolved, adjustmentArray) {
	if (resolved == null) return resolved;
	var typeArray = honeycomb.starterUpgradeFieldFor(adjustmentArray, "typeArray");
	if (typeArray != null) resolved.typeArray = typeArray;
	var partyShift = honeycomb.starterUpgradeFieldFor(adjustmentArray, "partyShift");
	if (partyShift != null) resolved.partyShift = partyShift;
	//A form may change WHO the card targets -- Nettle's Cloud and Cassadora's Twist turn a single-target
	//basic into one that hits every enemy, and the printed text follows the resolved target mode.
	var targetMode = honeycomb.starterUpgradeFieldFor(adjustmentArray, "targetMode");
	if (targetMode != null) resolved.targetMode = targetMode;
	//A form whose damage is gone reads as PURE NEGATIVE: once every damage line is 0, the card is a
	//debuff rather than an attack, so its tint, frame and archetype follow. A rank that still deals
	//damage stays typed as damage.
	if (honeycomb.starterUpgradeFieldFor(adjustmentArray, "negativeIfZeroDamage") == true) {
		var positiveDamage = false;
		var effectList = resolved.effectArray == null ? [] : resolved.effectArray;
		for (var damageIndex = 0; damageIndex < effectList.length; damageIndex++) {
			var damageEntry = effectList[damageIndex];
			if (damageEntry.index !== "damage") continue;
			if (typeof damageEntry.amount === "number" && damageEntry.amount > 0) positiveDamage = true;
		}
		if (positiveDamage == false) resolved.typeArray = ["negative"];
	}
	//A hand-written `text` describes the card's OLD effects. An adjustment that changes effects would
	//leave it lying, so it is dropped and the text regenerates from the new list. An adjustment may
	//supply its own `text` to keep the wording hand-authored.
	var textOverride = honeycomb.starterUpgradeFieldFor(adjustmentArray, "text");
	if (textOverride != null) {
		resolved.text = textOverride;
	} else if (resolved.text != null) {
		var changesEffects = false;
		for (var scanIndex = 0; adjustmentArray != null && scanIndex < adjustmentArray.length; scanIndex++) {
			var adjustment = adjustmentArray[scanIndex];
			if (adjustment.effect != null || adjustment.addEffectArray != null || adjustment.replaceEffectArray != null) changesEffects = true;
		}
		if (changesEffects) resolved.text = null;
	}
	return resolved;
};

//Everything that adds to a member's maximum health, in the same order the pool modifiers resolve.
//Split out so the live recalculation and the teambuilding preview cannot disagree about it.
honeycomb.memberHealthModifier = function (selection) {
	var total = 0;
	var modifierArray = honeycomb.memberCardModifierArray(selection);
	for (var scanIndex = 0; scanIndex < modifierArray.length; scanIndex++) {
		var modifier = modifierArray[scanIndex].modifier;
		if (modifier.healthModifier != null) total += modifier.healthModifier;
	}
	return total;
};

//A named numeric field summed across every member's selected modifiers (outfit, equipment, tree nodes).
//For RUN-wide reads that are the party's rather than one member's -- starting gold, shop discounts.
//Returns 0 with no run, so a teambuilding preview reads none of it.
honeycomb.partyFieldTotal = function (fieldName) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var total = 0;
	if (run == null || run.partyArray == null) return total;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		var modifierArray = honeycomb.memberCardModifierArray(run.partyArray[memberIndex]);
		for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
			var value = modifierArray[modifierIndex].modifier[fieldName];
			if (typeof value === "number") total += value;
		}
	}
	return total;
};

//A named numeric field summed across EVERY character's selected tree nodes, party or benched. This is
//the "always" tier (Rest2/Reroll2/Purge2): the perk survives being left behind, so it is read from the
//profile rather than the party. Reads the tree directly, so a benched character needs no loadout.
honeycomb.profileFieldTotal = function (fieldName) {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile == null || profile.progressionArray == null) return 0;
	var total = 0;
	for (var characterIndex = 0; characterIndex < honeycomb.characterArray.length; characterIndex++) {
		var character = honeycomb.characterArray[characterIndex];
		if (character.progressionTree == null) continue;
		var selectedArray = profile.progressionArray[character.index];
		if (selectedArray == null) continue;
		for (var nodeIndex = 0; nodeIndex < selectedArray.length; nodeIndex++) {
			var node = honeycomb.findDefinition(character.progressionTree.nodeArray, selectedArray[nodeIndex]);
			if (node != null && typeof node[fieldName] === "number") total += node[fieldName];
		}
	}
	return total;
};

//COLLECTOR (tree node): unseen events and items appear more often. A multiplier over the base weight
//for anything not yet discovered -- party-wide, plus the benched "Always" tier.
honeycomb.collectorWeightMultiplier = function () {
	return 1 + honeycomb.partyFieldTotal("collectorWeight") + honeycomb.profileFieldTotal("collectorWeightAlways");
};

//JOURNAL (rest option "Journal"): a card written into the journal appears more often in reward offers
//for the rest of the run. 1 for every card not on the list.
honeycomb.journalWeightFor = function (card) {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile == null || profile.journalCardArray == null || card == null) return 1;
	return profile.journalCardArray.indexOf(card.index) >= 0 ? honeycomb.tuning.rest.journalWeightMultiplier : 1;
};

//Whether ONE character's selected tree nodes carry a truthy flag. For a per-character boolean lock
//(Fortitude) rather than a summed number. Reads the profile, so it works with no run.
honeycomb.characterFieldFlag = function (characterIndex, fieldName) {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile == null || profile.progressionArray == null) return false;
	var character = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	if (character == null || character.progressionTree == null) return false;
	var selectedArray = profile.progressionArray[characterIndex];
	if (selectedArray == null) return false;
	for (var nodeIndex = 0; nodeIndex < selectedArray.length; nodeIndex++) {
		var node = honeycomb.findDefinition(character.progressionTree.nodeArray, selectedArray[nodeIndex]);
		if (node != null && node[fieldName] == true) return true;
	}
	return false;
};

//Whether ANY member of the party carries a truthy flag on their selected tree nodes. The party-wide
//counterpart of `characterFieldFlag`, for a one-per-fight perk that any character in the party enables.
honeycomb.partyFieldFlag = function (fieldName) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.partyArray == null) return false;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		if (honeycomb.characterFieldFlag(run.partyArray[memberIndex].characterIndex, fieldName) == true) return true;
	}
	return false;
};

//Whether ANY of one member's modifiers -- outfit, equipment or tree node -- carries a truthy field. The
//outfit-aware counterpart of characterFieldFlag, which reads tree nodes only.
honeycomb.memberLoadoutFlag = function (selection, fieldName) {
	if (selection == null || selection.characterIndex == null) return false;
	var modifierArray = honeycomb.memberCardModifierArray(selection);
	for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
		if (modifierArray[modifierIndex].modifier[fieldName] == true) return true;
	}
	return false;
};

//Whether any living party member's loadout carries a truthy field (an outfit rule that reaches the whole
//fight, such as Nightshade's "all poison inflicts Lust").
honeycomb.partyLoadoutFlag = function (fieldName) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.partyArray == null) return false;
	for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
		if (run.partyArray[memberIndex].downed == true) continue;
		if (honeycomb.memberLoadoutFlag(run.partyArray[memberIndex], fieldName) == true) return true;
	}
	return false;
};

//A named numeric field MULTIPLIED across one member's modifiers; 1 with none.
honeycomb.memberFieldProduct = function (selection, fieldName) {
	var product = 1;
	if (selection == null || selection.characterIndex == null) return product;
	var modifierArray = honeycomb.memberCardModifierArray(selection);
	for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
		var value = modifierArray[modifierIndex].modifier[fieldName];
		if (typeof value === "number") product *= value;
	}
	return product;
};

//Whether one of the member's SELECTED TREE NODES grants an ability, whatever the outfit then does with it.
//An outfit that disables an A2 "and does this instead" asks this, so the replacement only exists once the
//A2 node has been bought.
honeycomb.treeGrantsAbility = function (selection, abilityIndex) {
	if (selection == null || honeycomb.progression == null) return false;
	var nodeArray = honeycomb.progression.selectedNodeArray(selection);
	for (var nodeIndex = 0; nodeIndex < nodeArray.length; nodeIndex++) {
		var grantArray = nodeArray[nodeIndex].abilityAdditionArray == null ? [] : nodeArray[nodeIndex].abilityAdditionArray;
		for (var grantIndex = 0; grantIndex < grantArray.length; grantIndex++) {
			if (grantArray[grantIndex].index == abilityIndex) return true;
		}
	}
	return false;
};

//How a member's loadout bends the odds of a RARITY (Soothsayer: rares more likely). `rarityWeightMultiplierArray`
//is {rarity: multiplier} on any modifier; all of them multiply. 1 with none.
honeycomb.rarityWeightMultiplierFor = function (member, rarity) {
	var product = 1;
	if (member == null || member.characterIndex == null) return product;
	var modifierArray = honeycomb.memberCardModifierArray(member);
	for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
		var table = modifierArray[modifierIndex].modifier.rarityWeightMultiplierArray;
		if (table != null && typeof table[rarity] === "number") product *= table[rarity];
	}
	return product;
};

//A named numeric field summed across ONE member's selected modifiers. The per-member counterpart of
//`partyFieldTotal`, for gains that belong to the member (their own experience).
honeycomb.memberFieldTotal = function (selection, fieldName) {
	var total = 0;
	var modifierArray = honeycomb.memberCardModifierArray(selection);
	for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
		var value = modifierArray[modifierIndex].modifier[fieldName];
		if (typeof value === "number") total += value;
	}
	return total;
};

//THE PROJECTED VALUE OF A RUN RESOURCE before a run exists, from a teambuilding selection: the same
//party + benched "Always" sum `newRun` seeds with, read from loadouts rather than a live run. Reroll and
//banish both use it, so the starting screen and the run itself can never disagree.
honeycomb.teamResourcePreview = function (selectionArray, resourceIndex) {
	var mapping = {
		reroll: { partyField: "rewardReroll", alwaysField: "rewardRerollAlways" },
		banish: { partyField: "rewardBanish", alwaysField: "rewardBanishAlways" },
	}[resourceIndex];
	if (mapping == null) return honeycomb.getResource(resourceIndex);
	var total = honeycomb.profileFieldTotal(mapping.alwaysField);
	var array = selectionArray == null ? [] : selectionArray;
	for (var selectionIndex = 0; selectionIndex < array.length; selectionIndex++) {
		total += honeycomb.memberFieldTotal(array[selectionIndex], mapping.partyField);
	}
	return total;
};

//One row of a pool: which thing, how many, and every source that put it there. `sourceArray` is what
//lets a UI print "Riposte x4 -- Brienne, Duelist's Blade" rather than an unexplained count.
honeycomb.newPoolEntry = function (index, count, source, inheritedSourceArray, upgradeLevel) {
	var sourceArray = inheritedSourceArray == null ? [] : inheritedSourceArray.slice();
	if (source != null) sourceArray.push(source);
	//`cardIndex` is kept alongside `index` because the deck views read it by that name and a pool row
	//IS a card row in every case that existed before abilities did.
	//`upgradeLevel` is how a source says its copies START upgraded (U2 "Tailored"): it rides the row so
	//the minting step can stamp it on the instance.
	return { index: index, cardIndex: index, count: count, sourceArray: sourceArray, upgradeLevel: upgradeLevel == null ? 0 : upgradeLevel };
};

//Merges rows naming the same thing into one, keeping the position of the first appearance. Called at
//the end of every pool operation, so no caller has to remember to do it.
honeycomb.coalescePoolEntryArray = function (entryArray, kind) {
	var result = [];
	for (var scanIndex = 0; scanIndex < entryArray.length; scanIndex++) {
		var entry = entryArray[scanIndex];
		if (entry == null || entry.index == null || entry.count <= 0) continue;

		var existing = null;
		for (var matchIndex = 0; matchIndex < result.length; matchIndex++) {
			if (result[matchIndex].index == entry.index) { existing = result[matchIndex]; break; }
		}
		if (existing == null) {
			result.push(honeycomb.newPoolEntry(entry.index, entry.count, null, entry.sourceArray, entry.upgradeLevel));
			continue;
		}
		//A pool that does not take counts holds one of each however many times it was granted.
		if (kind == null || kind.allowsCounts != false) existing.count += entry.count;
		//A merged row keeps the HIGHEST starting upgrade, so an outfit copy still arrives upgraded when a
		//base row of the same card is folded into it.
		if (entry.upgradeLevel != null && entry.upgradeLevel > (existing.upgradeLevel == null ? 0 : existing.upgradeLevel)) {
			existing.upgradeLevel = entry.upgradeLevel;
		}
		for (var mergeIndex = 0; mergeIndex < entry.sourceArray.length; mergeIndex++) {
			if (honeycomb.poolEntryHasSource(existing, entry.sourceArray[mergeIndex]) == true) continue;
			existing.sourceArray.push(entry.sourceArray[mergeIndex]);
		}
	}
	return result;
};

honeycomb.poolEntryHasSource = function (entry, source) {
	for (var scanIndex = 0; scanIndex < entry.sourceArray.length; scanIndex++) {
		if (entry.sourceArray[scanIndex].kind == source.kind &&
			entry.sourceArray[scanIndex].index == source.index) return true;
	}
	return false;
};

//The same pool, minted into real card instances owned by a live party member.
honeycomb.memberCardPool = function (member) {
	var entryArray = honeycomb.memberCardEntryArray(member);
	var result = [];
	for (var mintIndex = 0; mintIndex < entryArray.length; mintIndex++) {
		var entry = entryArray[mintIndex];
		if (entry.cardIndex == null) continue;
		for (var copyIndex = 0; copyIndex < entry.count; copyIndex++) {
			var instance = honeycomb.newCardInstance(entry.cardIndex, member.instanceId);
			//U2 "Tailored": a row that starts upgraded mints its copies already upgraded.
			if (entry.upgradeLevel != null && entry.upgradeLevel > 0) instance.upgradeLevel = entry.upgradeLevel;
			result.push(instance);
		}
	}
	return result;
};

//The cards a run-start roll may pick from: the character's own OFFERABLE cards that the worn loadout
//does not block, so an outfit-gated card waits until its outfit is unlocked. Pure, so the preview and
//a live run agree.
honeycomb.startingCardPoolArray = function (member) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, member == null ? null : member.characterIndex);
	if (definition == null) return [];
	var offerable = honeycomb.tuning.reward.offerableRarityArray;
	var result = [];
	for (var cardIndex = 0; cardIndex < honeycomb.cardArray.length; cardIndex++) {
		var card = honeycomb.cardArray[cardIndex];
		if (card.characterIndex != definition.index) continue;
		if (offerable.indexOf(card.rarity) < 0) continue;
		if (honeycomb.cardOfferState(definition.index, card, member) == "blocked") continue;
		result.push(card);
	}
	return result;
};

//Distinct picks from the character's pool, drawn from the `startingCard` stream. The result is the
//list of card indices the member's default outfit contributes. Fixed for the run once rolled.
//
//WEIGHTED BY RARITY, using the same numbers as the reward spread, so a rare is as unlikely in the
//run-start roll as it is in a reward. A flat shuffle made rares far too common.
honeycomb.rollStartingCardArray = function (member, count) {
	//A fresh run has no banishes yet, but the filter keeps the rule true wherever this is called.
	//A TOKEN IS NEVER ROLLED INTO A STARTING DECK. This is the exact path that put King's
	//Invocation in an opening hand: the default outfit's `randomCardCount` rolls from the character's
	//whole pool, and a one-shot payoff card arriving free breaks the macro loop it is the payoff for.
	var poolArray = honeycomb.startingCardPoolArray(member).filter(function (card) {
		return honeycomb.cardIsBanished(card.index) == false && honeycomb.cardIsGrantable(card) == true;
	});
	var stream = honeycomb.tuning.rng.streamArray.startingCard;
	var weightArray = honeycomb.tuning.reward.rarityWeightArray;
	var remainingArray = poolArray.slice();
	var result = [];
	while (result.length < count && remainingArray.length > 0) {
		var weightedArray = [];
		for (var candidateIndex = 0; candidateIndex < remainingArray.length; candidateIndex++) {
			var rarityWeight = weightArray[remainingArray[candidateIndex].rarity];
			var bent = (rarityWeight == null ? 1 : rarityWeight) * honeycomb.rarityWeightMultiplierFor(member, remainingArray[candidateIndex].rarity);
			weightedArray.push({ card: remainingArray[candidateIndex], weight: bent });
		}
		var picked = honeycomb.rng.pickWeighted(stream, weightedArray);
		if (picked == null) break;
		result.push(picked.card.index);
		remainingArray.splice(remainingArray.indexOf(picked.card), 1);
	}
	return result;
};

//Resolves every `randomReplaceArray` on a member's selected modifiers (outfit, equipment, tree nodes)
//into concrete {from, to, count} replacements: a basic of the named index becomes a random card of the
//named rarity from the character's own pool. Fixed for the run once rolled.
honeycomb.rollRandomReplaceArray = function (member) {
	var modifierArray = honeycomb.memberCardModifierArray(member);
	var poolArray = honeycomb.startingCardPoolArray(member);
	var result = [];
	for (var modifierIndex = 0; modifierIndex < modifierArray.length; modifierIndex++) {
		var declarationArray = modifierArray[modifierIndex].modifier.randomReplaceArray;
		if (declarationArray == null) continue;
		for (var declarationIndex = 0; declarationIndex < declarationArray.length; declarationIndex++) {
			var declaration = declarationArray[declarationIndex];
			var candidateArray = poolArray.filter(function (card) {
				return (declaration.rarity == null || card.rarity == declaration.rarity) && card.index != declaration.from &&
					honeycomb.cardIsBanished(card.index) == false;
			});
			var picked = honeycomb.rng.pick(honeycomb.tuning.rng.streamArray.startingCard, candidateArray);
			if (picked == null) continue;
			result.push({
				from: declaration.from,
				to: picked.index,
				count: declaration.count == null ? 1 : declaration.count,
			});
		}
	}
	return result;
};

//---------------------------------------------------------------------------------------------------
//Equipment rules
//---------------------------------------------------------------------------------------------------
//
//  ONE WEARER. A piece is held by one character at a time across the whole roster -- fielded members
//    and the loadouts benched characters remember. Wearing it takes it off whoever had it.
//  HEIRLOOMS. A piece naming a `characterIndex` is that character's alone (the old starting relics).
//  REMEMBERED LOADOUTS. A character leaving the party keeps what they wore (profile.loadoutArray) and
//    has it back on rejoining.
//  RECENT FIRST. What each character wore in an actual run is remembered, most recent first
//    (profile.equipmentHistoryArray): the equipment tab's default order.
//  CAPACITY. One piece each at the default party size of three or more, and one more for every member
//    short of it -- a smaller party carries more. Pieces past the limit may still be worn but are
//    inactive: greyed on screen and left behind when the run starts.
//  KIND. A piece is an HEIRLOOM (it names a `characterIndex`) or GENERIC, with no weapon / armour /
//    trinket slots; rarity is independent of kind, so an heirloom may be common or rare.
honeycomb.equipment = {};

honeycomb.equipment.capacity = function (partySize) {
	var settings = honeycomb.tuning.equipment;
	var missing = Math.max(0, settings.capacityPartySize - partySize);
	return settings.baseCapacity + missing * settings.capacityPerMissingMember;
};

//The two kinds of equipment. Derived from the piece rather than stored on it, so a piece can never say
//"heirloom" without naming whose.
honeycomb.equipmentKindArray = [
	{ index: "heirloom", name: "Heirloom", order: 1, test: function (equipment) { return equipment.characterIndex != null; } },
	{ index: "generic", name: "Generic", order: 2, test: function () { return true; } },
];

honeycomb.equipment.kindOf = function (equipment) {
	var kindArray = honeycomb.equipmentKindArray;
	for (var scanIndex = 0; scanIndex < kindArray.length; scanIndex++) {
		if (equipment != null && kindArray[scanIndex].test(equipment) == true) return kindArray[scanIndex];
	}
	return kindArray[kindArray.length - 1];
};

//How many pieces are found, of how many exist, counting only what one character could wear: their own
//heirlooms alone for the bio's tile, or those plus all generic gear for the Equipment tab. Another
//character's heirloom is never counted, since "5/7" beside someone who could wear three of them would
//be confusing.
honeycomb.equipment.progressFor = function (characterIndex, heirloomsOnly) {
	var result = { found: 0, total: 0 };
	for (var scanIndex = 0; scanIndex < honeycomb.equipmentArray.length; scanIndex++) {
		var equipment = honeycomb.equipmentArray[scanIndex];
		if (equipment.characterIndex == null ? heirloomsOnly == true : equipment.characterIndex != characterIndex) continue;
		result.total += 1;
		if (honeycomb.unlocks.isUnlocked("equipment", equipment.index) == true) result.found += 1;
	}
	return result;
};

//"Rare Heirloom", or just "Common" for generic gear: rarity, and whether it is one character's own.
honeycomb.equipment.kindText = function (equipment) {
	var rarity = honeycomb.findDefinition(honeycomb.equipmentRarityArray, equipment.rarity);
	var kind = honeycomb.equipment.kindOf(equipment);
	var rarityName = rarity == null ? "" : rarity.name;
	if (kind.index != "heirloom") return rarityName;
	return (rarityName + " " + kind.name).trim();
};

//The pieces that count, in the order they were put on: the first `capacity` real ones.
honeycomb.equipment.activeArray = function (equipmentIndexArray, partySize) {
	var result = [];
	var capacity = honeycomb.equipment.capacity(partySize);
	var sourceArray = equipmentIndexArray == null ? [] : equipmentIndexArray;
	for (var scanIndex = 0; scanIndex < sourceArray.length && result.length < capacity; scanIndex++) {
		if (honeycomb.findDefinition(honeycomb.equipmentArray, sourceArray[scanIndex]) == null) continue;
		result.push(sourceArray[scanIndex]);
	}
	return result;
};

//Whether a character may wear a piece at all: an heirloom is its owner's alone.
honeycomb.equipment.canWear = function (characterIndex, equipmentIndex) {
	var definition = honeycomb.findDefinition(honeycomb.equipmentArray, equipmentIndex);
	if (definition == null) return false;
	return definition.characterIndex == null || definition.characterIndex == characterIndex;
};

//What a character wears the first time they are fielded: their `startingEquipmentArray`.
honeycomb.equipment.startingArray = function (characterIndex) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	var sourceArray = definition == null || definition.startingEquipmentArray == null ? [] : definition.startingEquipmentArray;
	var result = [];
	for (var scanIndex = 0; scanIndex < sourceArray.length; scanIndex++) {
		if (honeycomb.equipment.canWear(characterIndex, sourceArray[scanIndex]) == true) result.push(sourceArray[scanIndex]);
	}
	return result;
};

//The loadout a character remembers from their last time in the party, or null.
honeycomb.equipment.rememberedLoadout = function (characterIndex) {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	if (profile == null || profile.loadoutArray == null) return null;
	return profile.loadoutArray[characterIndex] == null ? null : profile.loadoutArray[characterIndex];
};

//Stores a leaving member's outfit and equipment, so rejoining gives them back.
honeycomb.equipment.remember = function (selection) {
	var profile = honeycomb.state.profile;
	if (profile.loadoutArray == null) profile.loadoutArray = {};
	profile.loadoutArray[selection.characterIndex] = {
		outfitIndex: selection.outfitIndex,
		equipmentArray: selection.equipmentArray == null ? [] : selection.equipmentArray.slice(),
	};
};

//Whoever holds a piece: a member of `partySelectionArray` first, then any BENCHED character's
//remembered loadout (a fielded character's memory is stale -- their party slot is the truth). Returns
//a characterIndex or null. `exceptCharacterIndex` is never reported as the holder.
honeycomb.equipment.wearerOf = function (equipmentIndex, partySelectionArray, exceptCharacterIndex) {
	var fieldedArray = [];
	for (var memberIndex = 0; memberIndex < partySelectionArray.length; memberIndex++) {
		var selection = partySelectionArray[memberIndex];
		fieldedArray.push(selection.characterIndex);
		if (selection.characterIndex == exceptCharacterIndex || selection.equipmentArray == null) continue;
		if (selection.equipmentArray.indexOf(equipmentIndex) >= 0) return selection.characterIndex;
	}
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	var loadoutArray = profile == null || profile.loadoutArray == null ? {} : profile.loadoutArray;
	for (var characterIndex in loadoutArray) {
		if (Object.prototype.hasOwnProperty.call(loadoutArray, characterIndex) == false) continue;
		if (characterIndex == exceptCharacterIndex || fieldedArray.indexOf(characterIndex) >= 0) continue;
		var remembered = loadoutArray[characterIndex];
		if (remembered.equipmentArray != null && remembered.equipmentArray.indexOf(equipmentIndex) >= 0) return characterIndex;
	}
	return null;
};

//Takes a piece off whoever holds it -- a member's slot or a benched character's memory -- and says
//whom it came from, or null when nobody had it.
honeycomb.equipment.takeFrom = function (equipmentIndex, partySelectionArray, exceptCharacterIndex) {
	var wearer = honeycomb.equipment.wearerOf(equipmentIndex, partySelectionArray, exceptCharacterIndex);
	if (wearer == null) return null;
	var holderArray = null;
	for (var memberIndex = 0; memberIndex < partySelectionArray.length; memberIndex++) {
		if (partySelectionArray[memberIndex].characterIndex == wearer) holderArray = partySelectionArray[memberIndex].equipmentArray;
	}
	if (holderArray == null) holderArray = honeycomb.equipment.rememberedLoadout(wearer).equipmentArray;
	holderArray.splice(holderArray.indexOf(equipmentIndex), 1);
	return wearer;
};

//A selection for a character joining the party: what they remember wearing, or their default outfit
//and starting equipment the first time. Anything another member of `partySelectionArray` wears now
//stays where it is.
honeycomb.equipment.loadoutForJoining = function (characterIndex, partySelectionArray) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, characterIndex);
	var remembered = honeycomb.equipment.rememberedLoadout(characterIndex);
	var sourceArray = remembered == null ? honeycomb.equipment.startingArray(characterIndex) : remembered.equipmentArray;
	var equipmentArray = [];
	for (var scanIndex = 0; scanIndex < sourceArray.length; scanIndex++) {
		var equipmentIndex = sourceArray[scanIndex];
		if (honeycomb.equipment.canWear(characterIndex, equipmentIndex) == false) continue;
		if (honeycomb.equipment.wearerOf(equipmentIndex, partySelectionArray, characterIndex) != null) continue;
		equipmentArray.push(equipmentIndex);
	}
	return {
		characterIndex: characterIndex,
		outfitIndex: remembered != null && remembered.outfitIndex != null ? remembered.outfitIndex
			: (definition == null ? null : definition.defaultOutfit),
		equipmentArray: equipmentArray,
	};
};

//Remembers what each member of a real run wore, most recent first. Called when a run starts.
honeycomb.equipment.recordRunUse = function (partyArray) {
	var profile = honeycomb.state.profile;
	if (profile.equipmentHistoryArray == null) profile.equipmentHistoryArray = {};
	for (var memberIndex = 0; memberIndex < partyArray.length; memberIndex++) {
		var member = partyArray[memberIndex];
		var history = profile.equipmentHistoryArray[member.characterIndex];
		if (history == null) history = profile.equipmentHistoryArray[member.characterIndex] = [];
		for (var wornIndex = member.equipmentArray.length - 1; wornIndex >= 0; wornIndex--) {
			var existing = history.indexOf(member.equipmentArray[wornIndex]);
			if (existing >= 0) history.splice(existing, 1);
			history.unshift(member.equipmentArray[wornIndex]);
		}
	}
};

//How recently a character took a piece into a run: 0 is the latest, Infinity is never.
honeycomb.equipment.recentPosition = function (characterIndex, equipmentIndex) {
	var profile = honeycomb.state == null ? null : honeycomb.state.profile;
	var history = profile == null || profile.equipmentHistoryArray == null ? null : profile.equipmentHistoryArray[characterIndex];
	var position = history == null ? -1 : history.indexOf(equipmentIndex);
	return position < 0 ? Infinity : position;
};

//Maximum health a selection would have, computed without building a member. The teambuilding screen
//needs this before the run exists.
honeycomb.previewMaximumHealth = function (selection) {
	var definition = honeycomb.findDefinition(honeycomb.characterArray, selection.characterIndex);
	if (definition == null) return 0;
	return Math.max(1, honeycomb.characterBaseHealth(definition) + honeycomb.memberHealthModifier(selection));
};

//Applies one outfit's or equipment's changes to a working pool, producing a NEW list.
//
//Additions append first, then each row present (the input's and this modifier's own additions) is
//examined once and at most one replacement rule fires on it -- the first that names its entry. Rules do
//not chain within a single modifier, so a modifier holding {A to B} and {B to C} turns A into B and
//leaves it there; expressing a chain means using two modifiers, which is explicit rather than
//accidental. Between modifiers, chaining is exactly what happens.
//
//`source` describes the modifier for the entry's provenance list, and may be omitted.
//`kind` is the honeycomb.poolKindArray entry saying which fields to read.
honeycomb.applyPoolModifier = function (entryArray, modifier, source, kind) {
	var result = [];

	//Additions append copies. Done FIRST so a replacement rule can transform a row the SAME modifier
	//just added -- an outfit may grant an ability and then replace it in one entry. Coalescing folds an
	//addition into an existing row if one already names it.
	var additionArray = modifier == null ? null : modifier[kind.additionField];
	if (additionArray != null) {
		for (var addIndex = 0; addIndex < additionArray.length; addIndex++) {
			var addition = additionArray[addIndex];
			var addedCount = kind.allowsCounts == false || addition.count == null ? 1 : addition.count;
			result.push(honeycomb.newPoolEntry(addition.index, addedCount, source, null, addition.upgradeLevel));
		}
	}

	var inputArray = entryArray.concat(result);
	var replacedResult = [];
	for (var scanIndex = 0; scanIndex < inputArray.length; scanIndex++) {
		var entry = inputArray[scanIndex];
		var replacement = honeycomb.findPoolReplacement(entry.index, modifier, kind);
		if (replacement == null) {
			//Untouched rows are copied rather than shared, so a caller cannot mutate the input.
			replacedResult.push(honeycomb.newPoolEntry(entry.index, entry.count, null, entry.sourceArray, entry.upgradeLevel));
			continue;
		}
		//A null `to` removes the entry outright.
		if (replacement.to == null) continue;
		var count = replacement.count == null ? entry.count : Math.min(entry.count, replacement.count);
		//A partial replacement leaves the remainder of the original row in place.
		if (count < entry.count) {
			replacedResult.push(honeycomb.newPoolEntry(entry.index, entry.count - count, null, entry.sourceArray, entry.upgradeLevel));
		}
		replacedResult.push(honeycomb.newPoolEntry(replacement.to, count, source, entry.sourceArray, entry.upgradeLevel));
	}
	result = replacedResult;

	//Removals trim copies. A removal with no `count` drops the whole row; one with a count leaves the
	//remainder, so a ranked node can take one basic copy per rank without deleting the other.
	var removalArray = modifier == null ? null : modifier[kind.removalField];
	for (var removalIndex = 0; removalArray != null && removalIndex < removalArray.length; removalIndex++) {
		var removal = removalArray[removalIndex];
		var remaining = removal.count == null ? Infinity : removal.count;
		var keptArray = [];
		for (var trimIndex = 0; trimIndex < result.length; trimIndex++) {
			var row = result[trimIndex];
			if (row.index != removal.index || remaining <= 0) { keptArray.push(row); continue; }
			var removed = Math.min(row.count, remaining);
			remaining -= removed;
			if (row.count - removed > 0) {
				keptArray.push(honeycomb.newPoolEntry(row.index, row.count - removed, null, row.sourceArray, row.upgradeLevel));
			}
		}
		result = keptArray;
	}

	return honeycomb.coalescePoolEntryArray(result, kind);
};

//The first replacement rule on a modifier that names an entry, or null when none does.
honeycomb.findPoolReplacement = function (entryIndex, modifier, kind) {
	var replacementArray = modifier == null ? null : modifier[kind.replacementField];
	if (replacementArray == null) return null;
	for (var scanIndex = 0; scanIndex < replacementArray.length; scanIndex++) {
		if (replacementArray[scanIndex].from == entryIndex) return replacementArray[scanIndex];
	}
	return null;
};

//---------------------------------------------------------------------------------------------------
//Card entry ordering
//---------------------------------------------------------------------------------------------------
//How a pool is arranged for display. A registry rather than a sort call in the UI, so a new ordering
//is a table entry and every list in the game can offer it.
honeycomb.cardEntrySortArray = [
	{
		index: "poolOrder",
		name: "Pool order",
		//The order the pool resolved in: base cards in the order the character lists them, then
		//whatever outfits and equipment added. Null compare leaves the array untouched.
		compare: null,
	},
	{
		index: "type",
		name: "By type",
		compare: function (left, right) {
			var leftRank = honeycomb.cardTypeRank(left.cardIndex);
			var rightRank = honeycomb.cardTypeRank(right.cardIndex);
			if (leftRank != rightRank) return leftRank - rightRank;
			return honeycomb.compareCardName(left.cardIndex, right.cardIndex);
		},
	},
	{
		index: "cost",
		name: "By cost",
		compare: function (left, right) {
			var leftCost = honeycomb.cardBaseCost(left.cardIndex);
			var rightCost = honeycomb.cardBaseCost(right.cardIndex);
			if (leftCost != rightCost) return leftCost - rightCost;
			return honeycomb.compareCardName(left.cardIndex, right.cardIndex);
		},
	},
	{
		index: "name",
		name: "By name",
		compare: function (left, right) { return honeycomb.compareCardName(left.cardIndex, right.cardIndex); },
	},
];

//Position of a card's PRIMARY type in tuning.deck.typeSortArray. Unlisted types sort last.
honeycomb.cardTypeRank = function (cardIndex) {
	var definition = honeycomb.findDefinition(honeycomb.cardArray, cardIndex);
	var orderArray = honeycomb.tuning.deck.typeSortArray;
	if (definition == null) return orderArray.length;
	var position = orderArray.indexOf(honeycomb.cardType(definition).index);
	return position < 0 ? orderArray.length : position;
};

//An unplayable card has no cost at all; it sorts past every priced card rather than as free.
honeycomb.cardBaseCost = function (cardIndex) {
	var definition = honeycomb.findDefinition(honeycomb.cardArray, cardIndex);
	if (definition == null || definition.costArray == null) return honeycomb.tuning.deck.unplayableSortCost;
	var cost = definition.costArray[honeycomb.tuning.deck.sortByResource];
	return cost == null ? honeycomb.tuning.deck.unplayableSortCost : cost;
};

honeycomb.compareCardName = function (leftIndex, rightIndex) {
	var left = honeycomb.findDefinition(honeycomb.cardArray, leftIndex);
	var right = honeycomb.findDefinition(honeycomb.cardArray, rightIndex);
	var leftName = left == null ? leftIndex : left.name;
	var rightName = right == null ? rightIndex : right.name;
	return leftName < rightName ? -1 : (leftName > rightName ? 1 : 0);
};

//Returns a sorted COPY; the caller's array is never reordered underneath it.
honeycomb.sortCardEntryArray = function (entryArray, sortIndex) {
	var definition = honeycomb.findDefinition(honeycomb.cardEntrySortArray,
		sortIndex == null ? honeycomb.tuning.deck.defaultSort : sortIndex);
	if (definition == null || definition.compare == null) return entryArray.slice();
	return entryArray.slice().sort(definition.compare);
};

//A card instance: an id, which definition it is, who contributed it, and any per-copy modifications.
honeycomb.newCardInstance = function (cardIndex, ownerInstanceId) {
	return {
		instanceId: honeycomb.nextIdentifier("card"),
		cardIndex: cardIndex,
		//Which party member's pool this came from. Drives the affinity pip and any owner-conditional
		//effects; null for cards found on the map, which belong to nobody.
		ownerInstanceId: ownerInstanceId == null ? null : ownerInstanceId,
		//Upgrade level. Definitions describe what each level changes, so this stays a plain integer.
		upgradeLevel: 0,
		//True for cards picked up during a run, which survive a deck rebuild.
		acquired: false,
	};
};

//---------------------------------------------------------------------------------------------------
//Resource access
//---------------------------------------------------------------------------------------------------
//All resource reads and writes funnel through these so clamping, and any future hooks that want to
//watch a currency, have exactly one place to live.
//Where a resource of each scope is stored, and how to reach it. A registry rather than a chain of
//ifs, so a new lifetime -- "per region", say -- is a table entry with a `holder` function.
//
//A holder returns the object the value lives on, or null when that object does not exist right now:
//there is no combat pool between fights, and no run pool between runs. A null holder reads as zero
//and refuses a write rather than inventing somewhere to put it.
honeycomb.resourceScopeArray = [
	{
		index: "profile",
		//Survives runs. This is where lifetime progression lives, so it must be reachable with no run
		//in progress at all -- the title screen shows it.
		holder: function () {
			var state = honeycomb.state;
			if (state == null || state.profile == null) return null;
			if (state.profile.resourceArray == null) state.profile.resourceArray = {};
			return state.profile.resourceArray;
		},
	},
	{
		index: "run",
		holder: function () {
			var run = honeycomb.state == null ? null : honeycomb.state.run;
			return run == null ? null : run.resourceArray;
		},
	},
	{
		index: "combat",
		holder: function () {
			var run = honeycomb.state == null ? null : honeycomb.state.run;
			if (run == null || run.combat == null) return null;
			if (run.combat.resourceArray == null) run.combat.resourceArray = {};
			return run.combat.resourceArray;
		},
	},
];

//The object one resource's value lives on, or null when that scope has no home at the moment.
honeycomb.resourceHolder = function (resourceIndex) {
	var definition = honeycomb.findDefinition(honeycomb.resourceArray, resourceIndex);
	if (definition == null) return null;
	var scope = honeycomb.findDefinition(honeycomb.resourceScopeArray, definition.scope);
	if (scope == null) {
		console.error("Honeycomb: resource '" + resourceIndex + "' has unknown scope '" + definition.scope + "'");
		return null;
	}
	return scope.holder();
};

honeycomb.getResource = function (resourceIndex) {
	var holder = honeycomb.resourceHolder(resourceIndex);
	if (holder == null) return 0;
	var value = holder[resourceIndex];
	return value == null ? 0 : value;
};

honeycomb.setResource = function (resourceIndex, value) {
	var definition = honeycomb.findDefinition(honeycomb.resourceArray, resourceIndex);
	if (definition == null) {
		console.error("Honeycomb: unknown resource '" + resourceIndex + "'");
		return 0;
	}
	var holder = honeycomb.resourceHolder(resourceIndex);
	if (holder == null) return 0;

	var clamped = value;
	if (definition.minimumValue != null && clamped < definition.minimumValue) clamped = definition.minimumValue;
	if (definition.maximumValue != null && clamped > definition.maximumValue) clamped = definition.maximumValue;

	holder[resourceIndex] = clamped;
	return clamped;
};

honeycomb.addResource = function (resourceIndex, amount) {
	//A GAIN to a `tracksMaximum` resource raises its remembered maximum too, so a later refill restores
	//everything this run was ever granted -- nodes, relics, a future card or event. A cost (negative
	//amount) leaves the maximum alone.
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	var definition = honeycomb.findDefinition(honeycomb.resourceArray, resourceIndex);
	if (run != null && definition != null && definition.tracksMaximum == true && amount > 0) {
		if (run.resourceMaximumArray == null) run.resourceMaximumArray = {};
		var held = run.resourceMaximumArray[resourceIndex] == null ? 0 : run.resourceMaximumArray[resourceIndex];
		run.resourceMaximumArray[resourceIndex] = held + amount;
	}
	return honeycomb.setResource(resourceIndex, honeycomb.getResource(resourceIndex) + amount);
};

//The highest total a `tracksMaximum` resource has reached this run, or its current value for one that
//does not track. What a refresh relic refills to.
honeycomb.resourceMaximum = function (resourceIndex) {
	var run = honeycomb.state == null ? null : honeycomb.state.run;
	if (run == null || run.resourceMaximumArray == null || run.resourceMaximumArray[resourceIndex] == null) {
		return honeycomb.getResource(resourceIndex);
	}
	return run.resourceMaximumArray[resourceIndex];
};

//True when the player can pay a cost. costArray is {resourceIndex: amount}.
honeycomb.canAfford = function (costArray) {
	if (costArray == null) return true;
	for (var resourceIndex in costArray) {
		if (Object.prototype.hasOwnProperty.call(costArray, resourceIndex) == false) continue;
		if (honeycomb.getResource(resourceIndex) < costArray[resourceIndex]) return false;
	}
	return true;
};

honeycomb.spend = function (costArray) {
	if (costArray == null) return true;
	if (honeycomb.canAfford(costArray) == false) return false;
	for (var resourceIndex in costArray) {
		if (Object.prototype.hasOwnProperty.call(costArray, resourceIndex) == false) continue;
		honeycomb.addResource(resourceIndex, -costArray[resourceIndex]);
	}
	return true;
};

//---------------------------------------------------------------------------------------------------
//Persistence
//---------------------------------------------------------------------------------------------------
//The only localStorage access in honeycomb. Slot 0 is the autosave; 1..manualSlotCount are the
//player's. The metadata entry is a small human-readable summary the load screen lists without having
//to parse the whole save.
//`suspended` holds every write to storage while the live run is stashed somewhere the save must not
//see -- an Event Gallery battle replay, so far. See honeycomb.save.autosave.
honeycomb.save = { suspended: false };

honeycomb.save.slotKey = function (slot) {
	return honeycomb.tuning.save.keyPrefix + slot;
};

honeycomb.save.metaKey = function (slot) {
	return honeycomb.tuning.save.metaPrefix + slot;
};

//Writes the live state into a slot. Storage can fail (quota, private browsing), so the caller is told.
//
//A combat in a transitional phase is REFUSED rather than written. Such a save reloads into a board
//that accepts no input and has no hand, stranding the player in a run they cannot leave or finish.
//An explicit manual save is allowed through regardless, since refusing a player's deliberate save
//silently would be worse -- honeycomb.combat.repair() catches it on the way back in.
honeycomb.save.write = function (slot, allowUnstable) {
	if (honeycomb.state == null) return false;

	//A forecast is the real action run against a copy of the world and then rolled back. Nothing that
	//happens inside one may escape it, and a save is the one thing that could -- it would write a
	//future that is about to be discarded over the present. Guarded here rather than at each autosave
	//point, because this is the only function that reaches storage.
	if (honeycomb.forecast != null && honeycomb.forecast.active == true) return false;

	var run = honeycomb.state.run;
	if (allowUnstable != true && run != null && run.combat != null &&
		honeycomb.combat.isStable(run.combat) == false) {
		console.warn("Honeycomb: refusing to save during transitional phase '" + run.combat.phase + "'");
		return false;
	}

	try {
		localStorage.setItem(honeycomb.save.slotKey(slot), JSON.stringify(honeycomb.state));
		localStorage.setItem(honeycomb.save.metaKey(slot), JSON.stringify(honeycomb.save.describe()));
		return true;
	} catch (storageError) {
		console.error("Honeycomb: save to slot " + slot + " failed", storageError);
		return false;
	}
};

//A short summary of the current state for the slot list.
honeycomb.save.describe = function () {
	var state = honeycomb.state;
	var run = state.run;
	var partyNameArray = [];
	if (run != null) {
		for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
			var definition = honeycomb.findDefinition(honeycomb.characterArray, run.partyArray[memberIndex].characterIndex);
			partyNameArray.push(definition == null ? run.partyArray[memberIndex].characterIndex : definition.name);
		}
	}
	return {
		formatVersion: state.formatVersion,
		savedAt: Date.now(),
		inRun: run != null,
		day: run == null ? 0 : run.day,
		seed: state.seed,
		partyNameArray: partyNameArray,
		runsWon: state.profile.runsWon,
	};
};

honeycomb.save.readMeta = function (slot) {
	try {
		var raw = localStorage.getItem(honeycomb.save.metaKey(slot));
		return raw == null ? null : JSON.parse(raw);
	} catch (parseError) {
		return null;
	}
};

honeycomb.save.read = function (slot) {
	try {
		var raw = localStorage.getItem(honeycomb.save.slotKey(slot));
		if (raw == null) return false;
		var parsed = JSON.parse(raw);
		//An alpha save is deleted here rather than migrated, so the next load does not meet it again.
		if (honeycomb.save.isStale(parsed) == true) {
			console.log("[Honeycomb] slot " + slot + " is from before format version " +
				honeycomb.tuning.save.staleBeforeVersion + " and has been cleared");
			honeycomb.save.deleteSlot(slot);
			return false;
		}
		if (honeycomb.save.migrate(parsed) == false) return false;
		honeycomb.state = parsed;
		//A save should never hold a transitional combat phase, but repair anything that slipped
		//through rather than handing the player an inert board.
		honeycomb.combat.repair();
		honeycomb.save.afterLoad();
		return true;
	} catch (parseError) {
		console.error("Honeycomb: load from slot " + slot + " failed", parseError);
		return false;
	}
};

//Brings an older save forward. Returns false when the save is too old to rescue, in which case the
//caller falls back to a new profile rather than running on a shape the code cannot read.
//WHAT RUNS ONCE THE PROFILE IS LIVE. reconcileContent works on the parsed object before it becomes
//honeycomb.state, so anything that has to READ the profile through the ordinary helpers belongs here
//instead: both load paths (a slot and a pasted save) call this after assigning the state.
honeycomb.save.afterLoad = function () {
	//Nothing for lust events here: a queue row is worked out fresh every time it is asked, off
	//requirements and the completed list, so a scene written today is simply owed today with no backfill
	//needed.
};

honeycomb.save.migrate = function (parsed) {
	if (parsed == null || parsed.profile == null) return false;
	if (parsed.formatVersion == null) parsed.formatVersion = 0;
	if (parsed.formatVersion > honeycomb.tuning.save.formatVersion) {
		console.error("Honeycomb: save is from a newer version and will not be loaded");
		return false;
	}
	//Each step brings a save up to its `toVersion`, in order, so a save several versions old walks
	//every step it missed.
	for (var stepIndex = 0; stepIndex < honeycomb.save.migrationArray.length; stepIndex++) {
		var step = honeycomb.save.migrationArray[stepIndex];
		if (parsed.formatVersion >= step.toVersion) continue;
		step.apply(parsed);
		parsed.formatVersion = step.toVersion;
	}
	parsed.formatVersion = honeycomb.tuning.save.formatVersion;
	honeycomb.save.reconcileContent(parsed);
	return true;
};

//New content reaches old saves. Not a shape change, so not a migration step: every load, a character
//the table says is available from the start joins a roster saved before that character existed.
//Without this, a character added after a profile's save would be invisible to that profile forever.
honeycomb.save.reconcileContent = function (parsed) {
	var profile = parsed == null ? null : parsed.profile;
	if (profile == null) return;
	honeycomb.save.replaceRetiredCards(parsed);
	if (Array.isArray(profile.unlockedCharacterArray) == false) profile.unlockedCharacterArray = [];

	//A character the content table no longer recognises -- a rename, or content removed -- must not linger
	//in the save. Left in, a stale PARTY entry keeps counting toward the ceiling while resolving to nobody,
	//so the party reads as full and refuses a real third member; and a stale roster entry inflates the
	//locked-slot count. Drop every unknown index from the roster, the party and the remembered loadouts,
	//then let the loop below re-add anything `unlockedFromStart` that is genuinely missing.
	var isKnown = function (characterIndex) {
		return characterIndex != null && honeycomb.findDefinition(honeycomb.characterArray, characterIndex) != null;
	};
	var keptRosterArray = [];
	for (var rosterIndex = 0; rosterIndex < profile.unlockedCharacterArray.length; rosterIndex++) {
		var rosterCharacter = profile.unlockedCharacterArray[rosterIndex];
		if (isKnown(rosterCharacter)) keptRosterArray.push(rosterCharacter);
	}
	profile.unlockedCharacterArray = keptRosterArray;
	if (Array.isArray(profile.lastPartyArray)) {
		var keptPartyArray = [];
		for (var partyIndex = 0; partyIndex < profile.lastPartyArray.length; partyIndex++) {
			var member = profile.lastPartyArray[partyIndex];
			if (member == null || isKnown(member.characterIndex) == false) continue;
			keptPartyArray.push(member);
		}
		profile.lastPartyArray = keptPartyArray;
	}
	if (profile.loadoutArray != null) {
		for (var loadoutCharacter in profile.loadoutArray) {
			if (Object.prototype.hasOwnProperty.call(profile.loadoutArray, loadoutCharacter) == false) continue;
			if (isKnown(loadoutCharacter) == false) delete profile.loadoutArray[loadoutCharacter];
		}
	}

	for (var characterIndex = 0; characterIndex < honeycomb.characterArray.length; characterIndex++) {
		var character = honeycomb.characterArray[characterIndex];
		if (character.unlockedFromStart != true || profile.unlockedCharacterArray.indexOf(character.index) >= 0) continue;
		profile.unlockedCharacterArray.push(character.index);
	}
	honeycomb.save.reconcileWeaknessLedger(profile);
};

//Drops ledger entries for tags that are not weaknesses (a character's own traits could be recorded when a
//hit fell back to its source's tags) and caps the rest at the top rank's threshold, since exposure past
//it does nothing. The per-run rank counts and unseen rank-up records lose the same entries.
honeycomb.save.reconcileWeaknessLedger = function (profile) {
	if (honeycomb.lust == null || honeycomb.lust.isWeaknessTag == null) return;
	var top = honeycomb.lust.topThreshold();
	var ledgerMap = profile.lustExposureArray == null ? {} : profile.lustExposureArray;
	var gainMap = profile.lustRankGainArray == null ? {} : profile.lustRankGainArray;
	for (var characterIndex in ledgerMap) {
		var ledger = ledgerMap[characterIndex];
		for (var tagIndex in ledger) {
			if (honeycomb.lust.isWeaknessTag(tagIndex) == false) delete ledger[tagIndex];
			else if (ledger[tagIndex] > top) ledger[tagIndex] = top;
		}
	}
	for (var gainCharacter in gainMap) {
		for (var gainTag in gainMap[gainCharacter]) {
			if (honeycomb.lust.isWeaknessTag(gainTag) == false) delete gainMap[gainCharacter][gainTag];
		}
	}
	var recordMap = profile.lustRankUpArray == null ? {} : profile.lustRankUpArray;
	for (var recordCharacter in recordMap) {
		if (Array.isArray(recordMap[recordCharacter]) == false) continue;
		recordMap[recordCharacter] = recordMap[recordCharacter].filter(function (record) {
			return record != null && honeycomb.lust.isWeaknessTag(record.tag);
		});
	}
};

//Retired cards: every string in the save naming a card in honeycomb.retiredCardArray -- a deck
//instance's cardIndex, a banished card, a seen-card list or a map keyed by card -- becomes its replacement.
//Card indexes are unique camelCase names, so an exact match can only mean that card.
honeycomb.save.replaceRetiredCards = function (parsed) {
	var retiredArray = honeycomb.retiredCardArray == null ? [] : honeycomb.retiredCardArray;
	if (retiredArray.length === 0) return;
	var replacementFor = {};
	for (var scanIndex = 0; scanIndex < retiredArray.length; scanIndex++) {
		replacementFor[retiredArray[scanIndex].index] = retiredArray[scanIndex].replacement;
	}
	var walk = function (node) {
		if (node == null || typeof node !== "object") return;
		var keyArray = Object.keys(node);
		for (var keyIndex = 0; keyIndex < keyArray.length; keyIndex++) {
			var key = keyArray[keyIndex];
			var value = node[key];
			if (typeof value === "string" && Object.prototype.hasOwnProperty.call(replacementFor, value)) {
				node[key] = replacementFor[value];
			} else {
				walk(value);
			}
			//A map keyed by a retired card moves to the replacement's key, unless that key is already taken.
			if (Array.isArray(node) == false && Object.prototype.hasOwnProperty.call(replacementFor, key) &&
				Object.prototype.hasOwnProperty.call(node, replacementFor[key]) == false) {
				node[replacementFor[key]] = node[key];
				delete node[key];
			}
		}
	};
	walk(parsed.profile);
	walk(parsed.run);
};

//Save shape changes, oldest first. A step receives the parsed save and edits it in place.
honeycomb.save.migrationArray = [
	{
		//The starting relics became HEIRLOOM equipment. A profile's saved party predates
		//that, so nobody in it is wearing theirs -- put each heirloom on its owner. A run in progress
		//carries them as relics that no longer exist; move each onto its owner if they are in the run.
		toVersion: 2,
		apply: function (parsed) {
			var partyArray = parsed.profile.lastPartyArray == null ? [] : parsed.profile.lastPartyArray;
			for (var selectionIndex = 0; selectionIndex < partyArray.length; selectionIndex++) {
				var selection = partyArray[selectionIndex];
				if (selection.equipmentArray == null) selection.equipmentArray = [];
				var startingArray = honeycomb.equipment.startingArray(selection.characterIndex);
				for (var startIndex = 0; startIndex < startingArray.length; startIndex++) {
					if (selection.equipmentArray.indexOf(startingArray[startIndex]) < 0) selection.equipmentArray.unshift(startingArray[startIndex]);
				}
			}
			var run = parsed.run;
			if (run == null || run.relicArray == null) return;
			for (var relicIndex = run.relicArray.length - 1; relicIndex >= 0; relicIndex--) {
				var heirloom = honeycomb.findDefinition(honeycomb.equipmentArray, run.relicArray[relicIndex].index);
				if (heirloom == null || heirloom.characterIndex == null) continue;
				run.relicArray.splice(relicIndex, 1);
				for (var memberIndex = 0; memberIndex < run.partyArray.length; memberIndex++) {
					var member = run.partyArray[memberIndex];
					if (member.characterIndex != heirloom.characterIndex) continue;
					if (member.equipmentArray.indexOf(heirloom.index) < 0) member.equipmentArray.push(heirloom.index);
				}
			}
		},
	},
	{
		//An enemy's moves became CARDS. Every old intent became the card named for its enemy
		//and itself -- "sporeling"'s "spit" is "sporelingSpit" -- so a fight saved mid-turn keeps its
		//telegraphed moves, and the moves the player had seen stay seen.
		toVersion: 3,
		apply: function (parsed) {
			function cardFor(enemyIndex, intentIndex) {
				if (enemyIndex == null || intentIndex == null) return null;
				return enemyIndex + String(intentIndex).charAt(0).toUpperCase() + String(intentIndex).slice(1);
			}
			var combat = parsed.run == null ? null : parsed.run.combat;
			var enemyArray = combat == null || combat.enemyArray == null ? [] : combat.enemyArray;
			for (var enemyIndex = 0; enemyIndex < enemyArray.length; enemyIndex++) {
				var enemy = enemyArray[enemyIndex];
				enemy.intentCardIndex = cardFor(enemy.enemyIndex, enemy.currentIntentIndex);
				enemy.lastMoveCardIndex = cardFor(enemy.enemyIndex, enemy.lastIntentIndex);
				enemy.sameMoveCount = enemy.sameIntentCount == null ? 0 : enemy.sameIntentCount;
				enemy.movePosition = enemy.intentPosition == null ? 0 : enemy.intentPosition;
				delete enemy.currentIntentIndex;
				delete enemy.lastIntentIndex;
				delete enemy.sameIntentCount;
				delete enemy.intentPosition;
			}
			var ledger = parsed.profile.discoveryArray == null ? null : parsed.profile.discoveryArray.intent;
			if (ledger == null) return;
			for (var keyIndex = 0; keyIndex < ledger.length; keyIndex++) {
				var partArray = String(ledger[keyIndex]).split("/");
				if (partArray.length === 2) ledger[keyIndex] = partArray[0] + "/" + cardFor(partArray[0], partArray[1]);
			}
		},
	},
	{
		//SHIELDS WERE REMOVED. `block` on every combatant became `temporaryHealth`, which is
		//a different mechanic and not worth carrying a value across -- it is cleared at the start of
		//every fight anyway, so a save mid-fight simply loses whatever was standing. The new lust
		//fields are added at zero, and the profile's between-run weakness ledger starts empty.
		toVersion: 4,
		apply: function (parsed) {
			function convert(entity) {
				if (entity == null) return;
				entity.temporaryHealth = 0;
				delete entity.block;
				if (entity.lust == null) entity.lust = 0;
				if (entity.broken == null) entity.broken = false;
				if (entity.brokenTurnCount == null) entity.brokenTurnCount = 0;
			}
			var run = parsed.run;
			if (run != null) {
				var partyArray = run.partyArray == null ? [] : run.partyArray;
				for (var memberIndex = 0; memberIndex < partyArray.length; memberIndex++) convert(partyArray[memberIndex]);
				var enemyArray = run.combat == null || run.combat.enemyArray == null ? [] : run.combat.enemyArray;
				for (var enemyIndex = 0; enemyIndex < enemyArray.length; enemyIndex++) convert(enemyArray[enemyIndex]);
			}
			if (parsed.profile != null && parsed.profile.lustExposureArray == null) parsed.profile.lustExposureArray = {};
			if (parsed.profile != null && parsed.profile.onceEverArray == null) parsed.profile.onceEverArray = [];

			//Two content indices were renamed with the mechanic: Brienne's Shield Wall became Aegis and
			//the Matriarch's Shield became Carapace. Ability charges and the seen-moves ledger both key
			//on the index, so both are carried across rather than silently orphaned.
			var renameArray = [
				{ from: "brienneShieldWall", to: "brienneAegis" },
				{ from: "matriarchShield", to: "matriarchCarapace" },
			];
			function renamed(value) {
				for (var scanIndex = 0; scanIndex < renameArray.length; scanIndex++) {
					if (value === renameArray[scanIndex].from) return renameArray[scanIndex].to;
				}
				return value;
			}
			var renameRun = parsed.run;
			if (renameRun != null) {
				var renameParty = renameRun.partyArray == null ? [] : renameRun.partyArray;
				for (var partyIndex = 0; partyIndex < renameParty.length; partyIndex++) {
					var chargeArray = renameParty[partyIndex].abilityChargeArray;
					if (chargeArray == null) continue;
					for (var chargeIndex = 0; chargeIndex < chargeArray.length; chargeIndex++) {
						chargeArray[chargeIndex].index = renamed(chargeArray[chargeIndex].index);
					}
				}
				var renameEnemyArray = renameRun.combat == null || renameRun.combat.enemyArray == null
					? [] : renameRun.combat.enemyArray;
				for (var scanEnemy = 0; scanEnemy < renameEnemyArray.length; scanEnemy++) {
					renameEnemyArray[scanEnemy].intentCardIndex = renamed(renameEnemyArray[scanEnemy].intentCardIndex);
					renameEnemyArray[scanEnemy].lastMoveCardIndex = renamed(renameEnemyArray[scanEnemy].lastMoveCardIndex);
				}
			}
			var moveLedger = parsed.profile == null || parsed.profile.discoveryArray == null
				? null : parsed.profile.discoveryArray.intent;
			if (moveLedger != null) {
				for (var ledgerIndex = 0; ledgerIndex < moveLedger.length; ledgerIndex++) {
					var pieceArray = String(moveLedger[ledgerIndex]).split("/");
					if (pieceArray.length === 2) moveLedger[ledgerIndex] = pieceArray[0] + "/" + renamed(pieceArray[1]);
				}
			}
		},
	},
	{
		//Status cards became CURSES, and the Wisp's index went with it ("statusWisp" became
		//"curseWisp"). A Wisp only lives in a fight, but a fight can be saved, so every string in the
		//save that IS the old index is replaced wherever it sits -- piles hold instance ids, and the
		//index itself appears only as a card reference.
		toVersion: 5,
		apply: function (parsed) {
			var renameArray = [{ from: "statusWisp", to: "curseWisp" }];
			function walk(value) {
				if (value == null || typeof value !== "object") return;
				for (var key in value) {
					if (Object.prototype.hasOwnProperty.call(value, key) == false) continue;
					var child = value[key];
					if (typeof child === "string") {
						for (var scanIndex = 0; scanIndex < renameArray.length; scanIndex++) {
							if (child === renameArray[scanIndex].from) value[key] = renameArray[scanIndex].to;
						}
					} else {
						walk(child);
					}
				}
			}
			walk(parsed.run);
			walk(parsed.profile);
		},
	},
	{
		//Retires six older outfits. Anyone saved wearing one is dressed in the outfit that took over its
		//sister mechanic, and the retired ones leave the unlock ledgers. Only `outfitIndex` fields are
		//rewritten: the old indices are ordinary words that could appear elsewhere.
		toVersion: 6,
		apply: function (parsed) {
			var retiredArray = [
				{ from: "bloodied", to: "siegeplate" }, { from: "warden", to: "bastion" },
				{ from: "grovekeeper", to: "nightshade" }, { from: "plaguebearer", to: "sporemother" },
				{ from: "corsair", to: "huntress" }, { from: "nightcourt", to: "crimsonCovenant" },
				//Clemence's first two outfits went with her first kit.
				{ from: "inquisitor", to: "ecstatic" }, { from: "anchorite", to: "devotee" },
			];
			function replacement(index) {
				for (var scanIndex = 0; scanIndex < retiredArray.length; scanIndex++) {
					if (retiredArray[scanIndex].from === index) return retiredArray[scanIndex].to;
				}
				return null;
			}
			function walk(value) {
				if (value == null || typeof value !== "object") return;
				for (var key in value) {
					if (Object.prototype.hasOwnProperty.call(value, key) == false) continue;
					var child = value[key];
					if (key === "outfitIndex" && typeof child === "string" && replacement(child) != null) value[key] = replacement(child);
					else walk(child);
				}
			}
			walk(parsed.run);
			walk(parsed.profile);
			var ledger = parsed.profile == null ? null : parsed.profile.unlockedOutfitArray;
			if (ledger != null && typeof ledger === "object") {
				for (var characterIndex in ledger) {
					if (Object.prototype.hasOwnProperty.call(ledger, characterIndex) == false || Array.isArray(ledger[characterIndex]) == false) continue;
					ledger[characterIndex] = ledger[characterIndex].filter(function (index) { return replacement(index) == null; });
				}
			}
		},
	},
	{
		//Renames the vampire's placeholder index. Her index prefixes her cards, abilities and statuses and
		//keys her ledgers, so every string AND every object key in the save is rewritten wherever the old
		//name stands as a whole word or a camelCase prefix ("vex", "vexBroken", "vex/…"), never inside a
		//longer lowercase word. Display text in a saved battle log is renamed the same way.
		toVersion: 7,
		apply: function (parsed) {
			var renameArray = [
				{ pattern: /(^|[^A-Za-z])vex(?=$|[^a-z])/g, to: "$1severine" },
				{ pattern: /(^|[^A-Za-z])Vex(?=$|[^a-z])/g, to: "$1Severine" },
			];
			function renamed(text) {
				var result = text;
				for (var scanIndex = 0; scanIndex < renameArray.length; scanIndex++) {
					result = result.replace(renameArray[scanIndex].pattern, renameArray[scanIndex].to);
				}
				return result;
			}
			function walk(value) {
				if (value == null || typeof value !== "object") return;
				var keyArray = Object.keys(value);
				for (var keyIndex = 0; keyIndex < keyArray.length; keyIndex++) {
					var key = keyArray[keyIndex];
					var child = value[key];
					if (typeof child === "string") child = renamed(child);
					else walk(child);
					var newKey = Array.isArray(value) ? key : renamed(key);
					if (newKey !== key) delete value[key];
					value[newKey] = child;
				}
			}
			walk(parsed.run);
			walk(parsed.profile);
		},
	},
	{
		//Art pass: Cassadora's heirloom was renamed `oracleSkull` -> `crystalBall` to match her new
		//design. A saved party, a remembered loadout or a run in progress still names the old index,
		//which no longer resolves and would silently vanish from the loadout.
		toVersion: 8,
		apply: function (parsed) {
			function renamed(text) {
				return text === "oracleSkull" ? "crystalBall" : text;
			}
			function walk(value) {
				if (value == null || typeof value !== "object") return;
				var keyArray = Object.keys(value);
				for (var keyIndex = 0; keyIndex < keyArray.length; keyIndex++) {
					var key = keyArray[keyIndex];
					var child = value[key];
					if (typeof child === "string") child = renamed(child);
					else walk(child);
					var newKey = Array.isArray(value) ? key : renamed(key);
					if (newKey !== key) delete value[key];
					value[newKey] = child;
				}
			}
			walk(parsed.run);
			walk(parsed.profile);
		},
	},
	{
		//Lust Events became a QUEUE. What a rank-up raised used to be frozen onto the rank-up
		//record at the instant it happened, and how far the story had come was a COUNT; both are gone.
		//A row is now owed when its requirements pass and its name is not in the completed LIST.
		toVersion: 10,
		apply: function (parsed) {
			var profile = parsed.profile;
			//WHAT THE PLAYER ACTUALLY SAW survives, and it is the only part that can. lustEventSeenArray
			//holds "character/tag/rank" for every scene played through, so a queue row about that
			//character's weakness at that rank is one they have already had -- mark it completed rather
			//than handing it to them a second time. A row with no match is simply owed, which is correct.
			var seenArray = profile.lustEventSeenArray == null ? [] : profile.lustEventSeenArray;
			var rowArray = honeycomb.lustEventQueueArray == null ? [] : honeycomb.lustEventQueueArray;
			if (profile.lustEventDoneArray == null) profile.lustEventDoneArray = [];
			for (var seenIndex = 0; seenIndex < seenArray.length; seenIndex++) {
				var piece = String(seenArray[seenIndex]).split("/");
				if (piece.length !== 3) continue;
				for (var rowIndex = 0; rowIndex < rowArray.length; rowIndex++) {
					var row = rowArray[rowIndex];
					if (row == null || row.tag != piece[1] || String(row.rank) != piece[2]) continue;
					var fans = row.character == "any" || Array.isArray(row.character);
					if (fans == false && row.character != piece[0]) continue;
					var key = fans ? row.index + "/" + piece[0] : row.index;
					if (profile.lustEventDoneArray.indexOf(key) < 0) profile.lustEventDoneArray.push(key);
				}
			}
			delete profile.lustEventSeenArray;
			//The count, and the milestone table that read it. Neither has a reader any more.
			delete profile.lustEventTally;
			delete profile.lustMilestoneFiredArray;
			//A rank-up record is a NOTIFICATION now and nothing else. One that carried an event keeps its
			//place in the ledger -- the rank really was crossed -- but the event frozen onto it is not the
			//queue's to honour, and the queue offers that scene again if its requirements still pass.
			var ledger = profile.lustRankUpArray;
			for (var characterIndex in ledger) {
				if (Object.prototype.hasOwnProperty.call(ledger, characterIndex) == false) continue;
				var recordArray = ledger[characterIndex];
				if (Array.isArray(recordArray) == false) { delete ledger[characterIndex]; continue; }
				for (var recordIndex = 0; recordIndex < recordArray.length; recordIndex++) {
					delete recordArray[recordIndex].eventIndex;
					delete recordArray[recordIndex].source;
					delete recordArray[recordIndex].trigger;
					delete recordArray[recordIndex].backfilled;
				}
			}
			//A LUST BATTLE IN FLIGHT cannot be resumed: its continuation names a rank-up record id, and
			//there are no record ids any more. The run it was fought in was a throwaway one in any case,
			//so dropping it returns the player to teambuilding with the queue row still owed.
			if (parsed.run != null && parsed.run.lustBattle != null) parsed.run = null;
		},
	},
];

//--- Stale alpha saves ------------------------------------------------------------------------------
//A save can be perfectly readable and still be worthless: migration carries a save across a SHAPE
//change, and nothing carries it across the content under it being replaced. Anything written before
//tuning.save.staleBeforeVersion is therefore refused and DELETED rather than migrated, so it cannot
//come back on the next load or sit in the slot list pretending to be playable.
honeycomb.save.isStale = function (parsed) {
	var floor = honeycomb.tuning.save.staleBeforeVersion;
	if (floor == null || parsed == null) return false;
	var version = parsed.formatVersion == null ? 0 : parsed.formatVersion;
	return version < floor;
};

//Deletes every slot holding a save from before the cutoff. Returns the slots it cleared. Run once at
//boot, so a profile from the alpha is gone before anything tries to read it.
honeycomb.save.purgeStaleSlots = function () {
	var clearedArray = [];
	var lastSlot = honeycomb.tuning.save.manualSlotCount;
	for (var slot = 0; slot <= lastSlot; slot++) {
		var parsed = null;
		try {
			var raw = localStorage.getItem(honeycomb.save.slotKey(slot));
			parsed = raw == null ? null : JSON.parse(raw);
		} catch (parseError) {
			//Unreadable is at least as stale as out of date.
			parsed = { formatVersion: 0 };
		}
		if (parsed == null || honeycomb.save.isStale(parsed) == false) continue;
		honeycomb.save.deleteSlot(slot);
		clearedArray.push(slot);
	}
	if (clearedArray.length > 0) {
		console.log("[Honeycomb] cleared " + clearedArray.length +
			" save slot(s) from before format version " + honeycomb.tuning.save.staleBeforeVersion +
			": " + clearedArray.join(", "));
	}
	return clearedArray;
};

honeycomb.save.deleteSlot = function (slot) {
	try {
		localStorage.removeItem(honeycomb.save.slotKey(slot));
		localStorage.removeItem(honeycomb.save.metaKey(slot));
	} catch (storageError) {
		console.error("Honeycomb: delete of slot " + slot + " failed", storageError);
	}
};

//Clears every Honeycomb save slot. Touches nothing outside Honeycomb's own key namespace, so a
//Syrup Town story save is never at risk.
honeycomb.save.wipeAll = function () {
	var wiped = 0;
	for (var slot = 0; slot <= honeycomb.tuning.save.manualSlotCount; slot++) {
		if (localStorage.getItem(honeycomb.save.slotKey(slot)) != null) wiped += 1;
		honeycomb.save.deleteSlot(slot);
	}
	return wiped;
};

//Wipes storage AND the live state, then hands back a brand new profile. The full reset.
honeycomb.save.hardReset = function () {
	var wiped = honeycomb.save.wipeAll();
	honeycomb.state = honeycomb.newProfile();
	return wiped;
};

//Autosave. Called at the points tuning lists; passing a point name that is not enabled does nothing,
//so a noisy autosave site can be switched off from tuning rather than deleted.
honeycomb.save.autosave = function (pointIndex) {
	//A gallery battle is not the player's run: replaying a Lust Battle builds a run of its own over
	//whatever is paused, so writing one out would overwrite the run the player is standing in the middle
	//of. Saving is held from the moment that run is stashed until it is back, which makes a browser
	//closed mid-replay lose the replay rather than the run. `write` has no other caller, so this one
	//guard covers every path to storage.
	if (honeycomb.save.suspended == true) return false;
	if (pointIndex != null) {
		var allowedArray = honeycomb.tuning.save.autosaveOnArray;
		if (allowedArray.indexOf(pointIndex) < 0) return false;
	}
	return honeycomb.save.write(honeycomb.tuning.save.autosaveSlot);
};

honeycomb.save.hasAutosave = function () {
	try {
		return localStorage.getItem(honeycomb.save.slotKey(honeycomb.tuning.save.autosaveSlot)) != null;
	} catch (storageError) {
		return false;
	}
};

honeycomb.save.loadAutosave = function () {
	return honeycomb.save.read(honeycomb.tuning.save.autosaveSlot);
};

//---------------------------------------------------------------------------------------------------
//Card telemetry
//---------------------------------------------------------------------------------------------------
//A counting ledger, not an uploader. Neocities is static hosting -- there is no server to receive a
//POST -- and honeycomb never uses fetch, so nothing can be uploaded from the page. What works there is
//a ledger in localStorage that survives profiles, and an export the tester copies out (Debug Tools ->
//Card report). The counters are global rather than per-profile, so wiping a save does not wipe the
//evidence:
//  offerArray    every reward offer put on screen
//  takeArray     the offers taken
//  skipArray     the offers passed over ("ignored")
//  deckAddArray  every card that joined a run deck, from any source
//  runsStarted / runsWon / runsLost
honeycomb.telemetry = {};
honeycomb.telemetry.cache = null;

honeycomb.telemetry.emptyData = function () {
	return {
		offerArray: {}, takeArray: {}, skipArray: {}, deckAddArray: {},
		runsStarted: 0, runsWon: 0, runsLost: 0,
	};
};

honeycomb.telemetry.load = function () {
	if (honeycomb.telemetry.cache != null) return honeycomb.telemetry.cache;
	var data = null;
	try {
		var raw = localStorage.getItem(honeycomb.tuning.telemetry.storageKey);
		data = raw == null ? null : JSON.parse(raw);
	} catch (storageError) {
		data = null;
	}
	if (data == null || typeof data != "object") data = honeycomb.telemetry.emptyData();
	//An older ledger may miss a field; fill rather than migrate.
	var empty = honeycomb.telemetry.emptyData();
	for (var field in empty) {
		if (Object.prototype.hasOwnProperty.call(empty, field) == false) continue;
		if (data[field] == null) data[field] = empty[field];
	}
	honeycomb.telemetry.cache = data;
	return data;
};

honeycomb.telemetry.persist = function () {
	try {
		localStorage.setItem(honeycomb.tuning.telemetry.storageKey, JSON.stringify(honeycomb.telemetry.load()));
	} catch (storageError) {
		//Storage can fail (quota, private browsing). Counting is best-effort and must never break a run.
	}
};

//One of the plain counters (runsStarted, runsWon, runsLost).
honeycomb.telemetry.note = function (field, amount) {
	if (honeycomb.tuning.telemetry.enabled != true) return;
	var data = honeycomb.telemetry.load();
	data[field] = (data[field] == null ? 0 : data[field]) + (amount == null ? 1 : amount);
	honeycomb.telemetry.persist();
};

//One card's counter in one ledger. Called at the few places a card is OFFERED or TAKEN; a forecast
//never reaches them, so a dry run cannot inflate the counts.
honeycomb.telemetry.noteCard = function (field, cardIndex) {
	if (cardIndex == null || honeycomb.tuning.telemetry.enabled != true) return;
	var data = honeycomb.telemetry.load();
	var map = data[field];
	if (map == null) return;
	map[cardIndex] = (map[cardIndex] == null ? 0 : map[cardIndex]) + 1;
	honeycomb.telemetry.persist();
};

//The ledger as rows, one per card, most decided first (taken + skipped).
honeycomb.telemetry.reportArray = function () {
	var data = honeycomb.telemetry.load();
	var keyArray = [];
	var seen = {};
	var collect = function (map) {
		for (var key in map) {
			if (Object.prototype.hasOwnProperty.call(map, key) == false) continue;
			if (seen[key] != true) { seen[key] = true; keyArray.push(key); }
		}
	};
	collect(data.offerArray);
	collect(data.takeArray);
	collect(data.skipArray);
	collect(data.deckAddArray);
	var rows = [];
	for (var keyIndex = 0; keyIndex < keyArray.length; keyIndex++) {
		var cardIndex = keyArray[keyIndex];
		rows.push({
			cardIndex: cardIndex,
			offered: data.offerArray[cardIndex] == null ? 0 : data.offerArray[cardIndex],
			taken: data.takeArray[cardIndex] == null ? 0 : data.takeArray[cardIndex],
			skipped: data.skipArray[cardIndex] == null ? 0 : data.skipArray[cardIndex],
			added: data.deckAddArray[cardIndex] == null ? 0 : data.deckAddArray[cardIndex],
		});
	}
	rows.sort(function (left, right) {
		var leftTotal = left.taken + left.skipped;
		var rightTotal = right.taken + right.skipped;
		if (rightTotal != leftTotal) return rightTotal - leftTotal;
		return left.cardIndex < right.cardIndex ? -1 : 1;
	});
	return rows;
};

//The report as text, TSV so it pastes straight into a spreadsheet: one row per card, name and index
//included so a rename cannot lose a card.
honeycomb.telemetry.reportText = function () {
	var data = honeycomb.telemetry.load();
	var lines = [];
	lines.push("HONEYCOMB CARD REPORT");
	lines.push("runs\t" + data.runsStarted + " started\t" + data.runsWon + " won\t" + data.runsLost + " lost");
	lines.push("");
	lines.push(["card", "index", "offered", "taken", "skipped", "added"].join("\t"));
	var rows = honeycomb.telemetry.reportArray();
	var limit = honeycomb.tuning.telemetry.reportRowLimit;
	for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
		if (limit > 0 && rowIndex >= limit) break;
		var row = rows[rowIndex];
		var definition = honeycomb.findDefinition(honeycomb.cardArray, row.cardIndex);
		lines.push([definition == null ? "?" : definition.name, row.cardIndex, row.offered, row.taken, row.skipped, row.added].join("\t"));
	}
	return lines.join("\n");
};

//Clears the ledger. A debug tool, so a tester's accumulated counts are not shipped with the next
//round of data by accident.
honeycomb.telemetry.clear = function () {
	honeycomb.telemetry.cache = honeycomb.telemetry.emptyData();
	honeycomb.telemetry.persist();
};

//Exports the state as a string the player can keep, mirroring how Syrup Town lets a save be copied
//out. Kept here rather than in UI code so the format has one owner.
honeycomb.save.toText = function () {
	return JSON.stringify(honeycomb.state);
};

//The bug report: the save wrapped with what a bug needs alongside it -- when, which browser, which
//screen, the last errors the page threw -- so a tester who has hit something can copy one block of text
//out and stop playing without losing the state that shows it. fromText accepts it back, so a report
//loads exactly like a save.
honeycomb.save.toReportText = function () {
	return JSON.stringify({
		kind: honeycomb.tuning.save.reportKind,
		when: new Date().toISOString(),
		userAgent: typeof navigator == "undefined" || navigator == null ? "" : navigator.userAgent,
		scene: honeycomb.scene == null ? null : honeycomb.scene.current,
		errorArray: honeycomb.recentErrorArray == null ? [] : honeycomb.recentErrorArray.slice(),
		state: honeycomb.state,
	});
};

honeycomb.save.fromText = function (text) {
	try {
		var parsed = JSON.parse(text);
		//A report carries the save inside it.
		if (parsed != null && parsed.kind == honeycomb.tuning.save.reportKind && parsed.state != null) parsed = parsed.state;
		//NOT gated on staleBeforeVersion. That cutoff clears the PLAYER'S stored slots; pasting a save
		//or a bug report in is a deliberate act by whoever is debugging, and refusing an older one
		//would make every report from an earlier build unreadable. Migration still runs.
		if (honeycomb.save.migrate(parsed) == false) return false;
		honeycomb.state = parsed;
		honeycomb.combat.repair();
		honeycomb.save.afterLoad();
		return true;
	} catch (parseError) {
		console.error("Honeycomb: pasted save could not be read", parseError);
		return false;
	}
};

//---------------------------------------------------------------------------------------------------
//The packed save
//---------------------------------------------------------------------------------------------------
//The report text is deflated by the browser's own CompressionStream and written as base64 behind
//tuning.save.packedPrefix. Deflate is lossless, so the state that comes back out is byte for byte the
//one that went in: no field is dropped, rounded or rebuilt, which is what "safely" rules out. Where the
//browser has no CompressionStream the plain report is handed out instead, and every load path still
//reads plain JSON, so an older save or report keeps working.
//
//CompressionStream only runs asynchronously, so these return Promises. Stored slots do not use this:
//autosave writes synchronously on every node and every turn, and localStorage has room to spare.

//True when this browser can pack. Old Safari (before 16.4) and old Android webviews cannot.
honeycomb.save.canPack = function () {
	return typeof CompressionStream === "function" && typeof DecompressionStream === "function" &&
		typeof Response === "function" && typeof TextEncoder === "function" && typeof btoa === "function";
};

honeycomb.save.isPacked = function (text) {
	return typeof text === "string" && text.indexOf(honeycomb.tuning.save.packedPrefix) === 0;
};

//Resolves with the packed form of `text`, or with `text` unchanged when this browser cannot pack.
honeycomb.save.pack = function (text) {
	if (honeycomb.save.canPack() == false) return Promise.resolve(text);
	try {
		var stream = new CompressionStream(honeycomb.tuning.save.packedFormat);
		var writer = stream.writable.getWriter();
		writer.write(new TextEncoder().encode(text));
		writer.close();
		return new Response(stream.readable).arrayBuffer().then(function (buffer) {
			return honeycomb.tuning.save.packedPrefix + honeycomb.save.bytesToBase64(new Uint8Array(buffer));
		}, function () {
			return text;
		});
	} catch (packError) {
		console.error("Honeycomb: could not pack the save, handing it out as plain text", packError);
		return Promise.resolve(text);
	}
};

//Resolves with the plain text inside a packed save, or with `text` unchanged when it is not packed.
//Rejects when the text carries the marker but is damaged (cut short in a copy, say).
honeycomb.save.unpack = function (text) {
	if (honeycomb.save.isPacked(text) == false) return Promise.resolve(text);
	if (honeycomb.save.canPack() == false) {
		return Promise.reject(new Error("this browser cannot read a packed save"));
	}
	try {
		var bytes = honeycomb.save.base64ToBytes(text.slice(honeycomb.tuning.save.packedPrefix.length));
		var stream = new DecompressionStream(honeycomb.tuning.save.packedFormat);
		var writer = stream.writable.getWriter();
		//A damaged save makes the writer reject as well as the reader. The reader's rejection is the one
		//reported; the writer's is caught so it does not surface as an unhandled rejection.
		writer.write(bytes).catch(function () {});
		writer.close().catch(function () {});
		return new Response(stream.readable).arrayBuffer().then(function (buffer) {
			return new TextDecoder().decode(buffer);
		});
	} catch (unpackError) {
		return Promise.reject(unpackError);
	}
};

//Loads a save from text in any form Copy / Load Save or a .noodle file may hold: packed, a plain
//report, or a plain save. Resolves true when the state was replaced and false when the text was not a
//Honeycomb save; never rejects.
honeycomb.save.fromAnyText = function (text) {
	var trimmed = typeof text === "string" ? text.trim() : "";
	if (trimmed === "") return Promise.resolve(false);
	return honeycomb.save.unpack(trimmed).then(function (plain) {
		return honeycomb.save.fromText(plain);
	}, function (unpackError) {
		console.error("Honeycomb: packed save could not be read", unpackError);
		return false;
	});
};

//Base64 by way of the browser's btoa/atob, which only take one character per byte. The string is
//built in chunks because String.fromCharCode.apply takes its arguments on the stack.
honeycomb.save.bytesToBase64 = function (bytes) {
	var chunkLength = honeycomb.tuning.save.packedChunkLength;
	var partArray = [];
	for (var start = 0; start < bytes.length; start += chunkLength) {
		partArray.push(String.fromCharCode.apply(null, bytes.subarray(start, start + chunkLength)));
	}
	return btoa(partArray.join(""));
};

honeycomb.save.base64ToBytes = function (base64) {
	//Whitespace is removed first: a save pasted from a chat window or an email can arrive wrapped.
	var binary = atob(base64.replace(/\s+/g, ""));
	var bytes = new Uint8Array(binary.length);
	for (var byteIndex = 0; byteIndex < binary.length; byteIndex++) bytes[byteIndex] = binary.charCodeAt(byteIndex);
	return bytes;
};

//The file name Save to .noodle file offers: "Honeycomb 2026-09-23 15-04.noodle", local time. Minutes
//are included so two saves taken the same hour do not replace each other in a downloads folder.
honeycomb.save.fileName = function (date) {
	var when = date == null ? new Date() : date;
	var twoDigits = function (value) { return value < 10 ? "0" + value : String(value); };
	//getMonth counts January as 0.
	var month = when.getMonth() + 1;
	return honeycomb.tuning.save.fileNamePrefix + when.getFullYear() + "-" + twoDigits(month) + "-" +
		twoDigits(when.getDate()) + " " + twoDigits(when.getHours()) + "-" + twoDigits(when.getMinutes()) +
		honeycomb.tuning.save.fileExtension;
};
