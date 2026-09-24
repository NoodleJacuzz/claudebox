//===================================================================================================
//HONEYCOMB CATACOMBS -- character, outfit, equipment and relic content
//===================================================================================================
//The roster and the things that alter it.
//
//A CHARACTER is a stat line, a tag list, an art folder, a card pool and a list of outfits. The
//teambuilding screen reads nothing but this table, so a new party member is one entry plus art.
//
//TAGS (`tagArray`) are free-form labels -- species, gender, role, anything. The engine has no opinion
//about them; content asks about them through the hasTag and partyHasTag conditions. Outfits and
//equipment may add and remove them, so a member's real tag list is computed by honeycomb.memberTagArray
//rather than read off this table. See honeycomb-tags.js.
//
//`ownerDownPolicy` names what happens to this character's cards when they are out of the fight.
//Omitted means tuning.combat.defaultOwnerDownPolicy. See honeycomb.ownerDownPolicyArray.
//
//ART lives at characters/<artFolder>/<outfit artFolder>/, and neither folder is named here beyond
//`artFolder` -- an outfit's folder defaults to its own index. Poses, health tiers, states and the
//whole fallback chain are resolved by honeycomb-art.js; nothing in this table names an image file.
//
//OUTFITS live inside their character because an outfit is art plus a card-pool override -- it is not
//meaningful on anyone else. EQUIPMENT is global and shared, because it is.
//
//Both outfits and equipment may carry:
//  healthModifier        added to base health
//  cardAdditionArray     [{index, count}] cards granted
//  cardReplacementArray  [{from, to}] swaps; a null `to` removes the card, and an optional `count`
//                        replaces only that many copies
//  abilityAdditionArray  [{index}] abilities granted -- the same shape, the other pool
//  unlockedFromStart     available without being found. Absent means the profile's unlock ledger
//                        decides; see honeycomb.unlockKindArray.
//  abilityReplacementArray  [{from, to}] ability swaps; a null `to` removes it
//  tagAdditionArray      tags granted -- an outfit may change what a character IS
//  tagRemovalArray       tags taken away; removals resolve before additions
//  hooks                 the same hook table statuses use, so a costume can change the rules
//This is the seam the brief calls for: a costume change, an equipment change, or a manual deck edit
//all reach the deck through honeycomb.memberCardPool and nothing else.//
//PROGRESSION is a branching TREE, not a list. `progressionTree` is:
//  backgroundPath   mood art behind the graph, resolved through honeycomb.image
//  aspect           its shape, width over height, so nodes stay on their landmarks
//  nodeArray        the nodes
//
//A TREE NODE is written exactly like an outfit, because it IS one as far as the engine is concerned:
//  index, name, description   identity and print
//  x, y                       percentages over the background, as map anchors are
//  cost                       experience, from the shared pool. Omitted uses tuning's default.
//  requiresArray              which nodes lead into it. Empty means it is a root.
//  requiresAll                demand every prerequisite rather than any one, for a convergence
//  condition                  optional gate on anything a condition can ask
//  unlockOutfit, unlockEquipment
//                             taking this node makes that thing available on the roster, for good
//  healthModifier, cardAdditionArray, cardReplacementArray, abilityAdditionArray,
//  tagAdditionArray, tagRemovalArray, hooks
//                             the same modifier fields an outfit carries. A selected node is appended
//                             to honeycomb.memberCardModifierArray, so it reaches the deck, the
//                             ability list, the tag list and the hook pipeline with no adapter.
//
//An OUTFIT may reshape a tree with `treeLockArray` (node indices it forbids) and `treeNodeArray`
//(nodes it adds). A locked node the player had already taken is REFUNDED, never silently swallowed --
//see honeycomb.progression.onLoadoutChanged.
window.honeycomb = window.honeycomb || {};

//---------------------------------------------------------------------------------------------------
//Characters
//---------------------------------------------------------------------------------------------------
honeycomb.characterArray = [

	{
		index: "brienne",
		name: "Brienne",
		className: "Warrior",
		classIconPath: "icons/knight",
		blurb: "Nothing gets in the way of a job.",
		description: "Brienne thinks strength is the most useful thing a person can offer anyone else, and that anyone who cannot do magic has no excuse not to be strong. She means it kindly. She stands at the front and takes what is coming, so the people behind her can do something clever.",
		colorHint: "#d9694f",
		unlockedFromStart: true,
		tagArray: ["human", "woman", "defender"],

		//THE ONE CARD THIS CHARACTER HOLDS WHILE BROKEN. Every card they own inherits this pointer;
		//a card naming its own `brokenCard` overrides it. See honeycomb.brokenCardIndexFor.
		brokenCard: "brienneBroken",
		//The !!BROKEN!! cut-in's art, and the recovery cut-in's. Both fall back through
		//honeycomb.brokenOverlay.artPathFor / recoverOverlay.artPathFor when a file is missing, so a
		//character with none drawn yet still gets the overlay -- their portrait stands in.
		//RECOVERY HAS ITS OWN PICTURE.
		//The placeholder is the standing sprite, untinted, from generate-placeholder-art.py.
		brokenArtPath: "characters/knight/broken",
		brokenBackgroundPath: "characters/knight/brokenBG",
		//One of the special few who play the !!BROKEN!! cut-in. See honeycomb.entityHasBrokenCutIn.
		brokenCutIn: true,
		recoverArtPath: "characters/knight/recover",
		//Measured off default/recover.webp, the upper-body picture: a third of its height, from
		//just above the eyes. See tuning.recoverOverlay.eyeWindow.
		recoverEyeWindow: { centreXPercent: 50, topPercent: 22, heightPercent: 32 },
		recoverBackgroundPath: "characters/knight/recoverBG",

		//Art folder under characters/. Outfits are subfolders of it.
		artFolder: "knight",

		defaultOutfit: "default",
		//Equipment this character starts wearing. Their HEIRLOOM -- what used to be a starting relic --
		//is character-exclusive, so nobody else can take it.
		startingEquipmentArray: ["ironSigil"],

		//Where playing one of this character's cards moves her in the party, by card type, overriding
		//the type's own default. Here: every Support card she plays brings her forward as well, so she
		//steps in front of whoever she is covering. See honeycomb.cardPartyShift.
		partyShiftByCardType: { support: "front" },

		//The pool contributed to the shared deck when this character joins a run.
		//One card from each sister mechanic, so the pool shows from the first fight.
		startingCardArray: [
			{ index: "brienneCleave", count: 2 },
			{ index: "brienneGrit", count: 2 },
		],

		//Non-card actions, opened from this character's own sub-menu in combat. Outfits and equipment
		//alter this list exactly as they alter the card pool. A1 is NOT here: the mandatory Ability 1
		//tree node grants it, so the list stays empty until that node is bought.
		startingAbilityArray: [],

		outfitArray: [
			{
				//DEFAULT (OUTFITS-LIST): no signature -- three random cards from her drop pool, rolled at run
				//start -- and +20% personal experience. Brienne's also favours cards she has never held.
				index: "default",
				name: "Default",
				unlockedFromStart: true,
				randomCardCount: 3,
				personalExperienceMultiplier: 1.2,
				unseenCardWeight: 0.5,
				description: "Adds 3 random Brienne cards at run start. +20% personal experience. Brienne's unseen cards appear 50% more often.",
			},

			//--- AUDIT-01: the three alts rebuilt to OUTFITS-LIST (tHP is a weapon / a wall / currency) ---
			{
				//TEMPORARY HP IS A WEAPON. The plate only takes the blow once the body under it is spent.
				index: "siegeplate",
				name: "Siegeplate",
				unlockedFromStart: true,
				archetype: "armament",
				healthModifier: 6,
				cardAdditionArray: [{ index: "briennePlateEdge", count: 1 }],
				tagAdditionArray: ["striker"],
				//Boost tHP-as-damage (Armament); reduce taunt / intercept (Sentinel).
				archetypeWeightArray: [{ archetype: "armament", multiplier: 3 }, { archetype: "sentinel", multiplier: 0.5 }],
				temporaryAbsorbsLast: true,
				treeAbilityReplacementArray: [{ from: "brienneAegis", to: "brienneBatteringRam" }],
				description: "+6 Max HP. Adds Plate Edge. Brienne's Temporary HP only soaks attacks once her health has hit 0. Aegis becomes Battering Ram: spend all Resolve, deal that much to the front enemy. Offers more cards that turn Temporary HP into damage, fewer that taunt or intercept.",
			},
			{
				//TEMPORARY HP IS A WALL. Resolve builds only as the wall comes down -- twice as fast.
				index: "bastion",
				name: "Bastion",
				unlockedFromStart: true,
				archetype: "sentinel",
				healthModifier: 12,
				cardAdditionArray: [{ index: "brienneHeadstrong", count: 1 }],
				tagAdditionArray: ["defender"],
				//Boost tHP / taunt / intercept (Sentinel); reduce spend-tHP (Tithe).
				archetypeWeightArray: [{ archetype: "sentinel", multiplier: 3 }, { archetype: "tithe", multiplier: 0.5 }],
				resolveFromTemporaryLost: true,
				//Twice the ordinary rate: Resolve is one per 4 tHP gained, so one per 2 tHP lost.
				//Twice the ordinary 1:1 rate: half a point of tHP lost per Resolve.
				resolveLostPerPoint: 0.5,
				//A2 is disabled; bought, it becomes the last stand below instead.
				treeAbilityReplacementArray: [{ from: "brienneAegis", to: null }],
				hooks: {
					onWouldBreak: function (params) {
						var entity = params.entity;
						var combat = params.context == null ? null : params.context.combat;
						if (combat == null || honeycomb.treeGrantsAbility(entity, "brienneAegis") == false) return;
						if (combat.lastStandUsedMap == null) combat.lastStandUsedMap = {};
						if (combat.lastStandUsedMap[entity.instanceId] == true) return;
						var resolve = honeycomb.mechanicValue(entity, "resolve");
						if (resolve <= 0) return;
						combat.lastStandUsedMap[entity.instanceId] = true;
						honeycomb.spendMechanic(entity, "resolve", resolve, params.context);
						honeycomb.grantTemporaryHealth(entity, Math.floor(resolve * params.definition.lastStandFraction), params.context);
					},
				},
				lastStandFraction: 0.5,
				description: "+12 Max HP. Adds Headstrong. Resolve builds twice as fast, but only when Brienne loses Temporary HP. Aegis is disabled: instead, once per fight, if Brienne would Break she spends all her Resolve and gains half that much Temporary HP. Offers more Temporary HP, taunt and intercept cards, fewer that spend Temporary HP.",
			},
			{
				//TEMPORARY HP IS CURRENCY. Nothing is kept past her turn, so everything gets spent.
				index: "almoner",
				name: "Almoner",
				unlockedFromStart: true,
				archetype: "tithe",
				cardAdditionArray: [{ index: "brienneIncredibleWealth", count: 1 }],
				//Boost spend-tHP (Tithe); reduce tHP-as-damage (Armament).
				archetypeWeightArray: [{ archetype: "tithe", multiplier: 3 }, { archetype: "armament", multiplier: 0.5 }],
				extraDrawPerTurn: 1,
				treeAbilityReplacementArray: [{ from: "brienneAegis", to: "brienneAlmsgiving" }],
				hooks: {
					modifyDrawPerTurn: function (amount, params) { return amount + params.definition.extraDrawPerTurn; },
					onTurnEnd: function (params) {
						var entity = params.entity;
						if (entity == null || entity.side != "ally" || !(entity.temporaryHealth > 0)) return;
						var lost = entity.temporaryHealth;
						entity.temporaryHealth = 0;
						honeycomb.logEvent(params.context, { type: "temporaryRemoved", targetId: entity.instanceId, amount: lost });
						honeycomb.fireEntityHooks("onTemporaryRemoved", { entity: entity, amount: lost, context: params.context });
					},
				},
				description: "Adds Incredible Wealth. Draw an additional card each turn, but Brienne loses all her Temporary HP at the end of her turn. Aegis becomes Almsgiving: spend all Resolve; every other ally removes 4 Lust and spends 4 Temporary HP. Offers more cards that spend Temporary HP, fewer that turn it into damage.",
			},
		],

		//A branching tree, laid out over its own mood art. Two routes -- hold the line, or hit harder --
		//and Brienne walks ONE of them: the first two nodes share an exclusive group, so taking either
		//locks the other (and everything behind it) until it is given back. Both routes rejoin at
		//Paragon, which either one reaches.
		progressionTree: {
			backgroundPath: "progression/knight-tree",
			aspect: 16 / 9,
			nodeArray: [
				{
					index: "briAbility1",
					name: "Dig In",
					description: "Unlocks Dig In and Brienne's Resolve. Gain 12 Temporary HP. Once per combat.",
					x: 15,
					y: 50,
					cost: 150,
					abilityAdditionArray: [{ "index": "brienneBrace" }],
					requiresArray: ["briStart"],
				},
				{
					index: "briStart",
					name: "Vigour",
					description: "+5 Max HP per rank.",
					x: 5,
					y: 50,
					cost: 4,
					rankMaximum: 6,
					healthModifier: 5,
				},
				{
					index: "briAtt1",
					name: "Gold",
					description: "Sword Strike gains 2 Temporary HP per rank.",
					x: 105,
					y: 20,
					cost: 50,
					rankMaximum: 3,
					exclusiveGroup: "briAttPath",
					starterUpgradeArray: [{ "card": "brienneCleave", "addEffectArray": [{ "index": "temporaryHealth", "amount": 2, "targetOverride": "owner" }] }],
					requiresArray: ["briGold"],
					previewCardArray: ["brienneCleave"],
				},
				{
					index: "briAtt3",
					name: "Bond",
					description: "Sword Strike soothes 2 more per rank.",
					x: 105,
					y: 80,
					cost: 50,
					rankMaximum: 3,
					exclusiveGroup: "briAttPath",
					starterUpgradeArray: [{ "card": "brienneCleave", "addEffectArray": [{ "index": "soothe", "amount": 2, "targetOverride": "owner" }] }],
					requiresArray: ["briGold"],
					previewCardArray: ["brienneCleave"],
				},
				{
					index: "briDef3",
					name: "Brace",
					description: "Brace becomes: choose one - gain 6 Temporary HP, or gain 2 Strength this turn.",
					x: 125,
					y: 80,
					cost: 150,
					exclusiveGroup: "briDefPath",
					starterUpgradeArray: [{ "card": "brienneGrit", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Hold or set?", "optionArray": [{ "index": "hold", "name": "Hold", "description": "Gain 6 Temporary HP.", "effectArray": [{ "index": "temporaryHealth", "amount": 6 }] }, { "index": "set", "name": "Set", "description": "Gain 2 Strength this turn.", "effectArray": [{ "index": "applyStatus", "status": "fleetingStrength", "stacks": 2 }] }] }] }],
					requiresArray: ["briBoun2", "briBoun1"],
					previewCardArray: ["brienneGrit"],
				},
				{
					index: "briDef1",
					name: "Set Stance",
					description: "Brace becomes: choose one - gain 6 Temporary HP and move to the front, or soothe 6.",
					x: 125,
					y: 20,
					cost: 150,
					exclusiveGroup: "briDefPath",
					starterUpgradeArray: [{ "card": "brienneGrit", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Set Stance how?", "optionArray": [{ "index": "hold", "name": "Hold", "description": "Gain 6 Temporary HP and move to the front.", "effectArray": [{ "index": "temporaryHealth", "amount": 6 }, { "index": "shiftParty", "shift": "front", "targetOverride": "owner" }] }, { "index": "soothe", "name": "Breathe", "description": "Remove 6 Lust.", "effectArray": [{ "index": "soothe", "amount": 6 }] }] }] }],
					requiresArray: ["briBoun1", "briBoun2"],
					previewCardArray: ["brienneGrit"],
				},
				{
					index: "briAtt2",
					name: "Steel",
					description: "Sword Strike deals 2 more damage per rank while Brienne has Temporary HP.",
					x: 105,
					y: 50,
					cost: 50,
					rankMaximum: 3,
					exclusiveGroup: "briAttPath",
					starterUpgradeArray: [{ "card": "brienneCleave", "addEffectArray": [{ "index": "damage", "amount": 2, "condition": { "index": "compare", "left": { "index": "stat", "of": "source", "stat": "temporaryHealth", "label": "Temporary HP" }, "operation": "greaterOrEqual", "right": 1 } }] }],
					requiresArray: ["briGold"],
					previewCardArray: ["brienneCleave"],
				},
				{
					index: "briU1",
					name: "Sister Wardrobe",
					description: "While in the party, Brienne's worn outfit adds twice as many cards.",
					x: 150,
					y: 35,
					cost: 150,
					exclusiveGroup: "briOutfitPath",
					requiresArray: ["briRest2"],
					outfitCardDoubling: true,
				},
				{
					index: "briWheel1",
					name: "Spend",
					description: "Dig In becomes: lose 6 Temporary HP, draw 2.",
					x: 175,
					y: 20,
					cost: 150,
					exclusiveGroup: "briWheelPath",
					requiresArray: ["briAbility2"],
					abilityUpgradeArray: [{ "ability": "brienneBrace", "disableMechanic": true, "effectArray": [{ "index": "removeTemporaryHealth", "amount": 6, "targetOverride": "owner" }, { "index": "drawCards", "amount": 2 }] }],
				},
				{
					index: "briWheel2",
					name: "Swing",
					description: "Dig In becomes: lose all Temporary HP, deal that much.",
					x: 175,
					y: 50,
					cost: 150,
					exclusiveGroup: "briWheelPath",
					requiresArray: ["briAbility2"],
					abilityUpgradeArray: [{ "ability": "brienneBrace", "disableMechanic": true, "targetMode": "enemy", "text": "Spend all your Temporary HP. Deal that much damage.", "requirementArray": [{ "condition": { "index": "compare", "left": { "index": "stat", "of": "source", "stat": "temporaryHealth" }, "operation": "greaterOrEqual", "right": 1 }, "text": "Needs Temporary HP." }], "effectArray": [{ "index": "spendTemporaryHealth", "all": true, "targetOverride": "owner" }, { "index": "damage", "amount": { "index": "tally", "key": "temporarySpent" } }] }],
				},
				{
					index: "briWheel3",
					name: "Vow",
					description: "Dig In becomes: soothe 10, remove all negative statuses, and gain no Temporary HP.",
					x: 175,
					y: 80,
					cost: 150,
					exclusiveGroup: "briWheelPath",
					requiresArray: ["briAbility2"],
					abilityUpgradeArray: [{ "ability": "brienneBrace", "disableMechanic": true, "effectArray": [{ "index": "soothe", "amount": 10, "targetOverride": "owner" }, { "index": "cleanse", "targetOverride": "owner" }] }],
				},
				{
					index: "briExtraAttack",
					name: "Extra Copy",
					description: "Add a second copy of Sword Strike to the starting deck.",
					x: 25,
					y: 15,
					cost: 150,
					exclusiveGroup: "briExtraAttack",
					cardAdditionArray: [{ "index": "brienneCleave", "count": 1 }],
					requiresArray: ["briAbility1"],
				},
				{
					index: "briReplaceAttack",
					name: "Retrain",
					description: "At run start, one Sword Strike becomes a random common of Brienne.",
					x: 40,
					y: 15,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "brienneCleave", "rarity": "common", "count": 1 }],
					requiresArray: ["briExtraAttack"],
				},
				{
					index: "briExtraDefence",
					name: "Extra Guard",
					description: "Add a second copy of Brace to the starting deck.",
					x: 25,
					y: 85,
					cost: 150,
					exclusiveGroup: "briExtraDefence",
					cardAdditionArray: [{ "index": "brienneGrit", "count": 1 }],
					requiresArray: ["briAbility1"],
				},
				{
					index: "briReplaceDefence",
					name: "Relearn",
					description: "At run start, one Brace becomes a random common of Brienne.",
					x: 40,
					y: 85,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "brienneGrit", "rarity": "common", "count": 1 }],
					requiresArray: ["briExtraDefence"],
				},
				{
					//UNSHAKEABLE CAPS THE LUST ITSELF, not what stands against it. A fighter Breaks when Lust reaches
					//health plus Temporary HP, so a ceiling at her maximum health means any Temporary HP that
					//carries her ABOVE full puts her out of reach of Breaking entirely, for as long as she holds it.
					index: "briCex1",
					name: "Unshakeable",
					description: "While in the party, Brienne's Lust can never rise above maximum health. Temporary HP above full makes Breaking impossible.",
					x: 35,
					y: 50,
					cost: 75,
					hooks: { "lustMaximum": function (params) {
						var entity = params.entity;
						return entity == null || entity.maxHealth == null ? null : entity.maxHealth;
					} },
					requiresArray: ["briAbility1"],
				},
				{
					index: "briU2",
					name: "Tailored",
					description: "While in the party, Brienne's worn outfit cards start upgraded.",
					x: 150,
					y: 65,
					cost: 300,
					exclusiveGroup: "briOutfitPath",
					requiresArray: ["briRest2"],
					outfitCardUpgrade: true,
				},
				{
					index: "briCex2",
					name: "Vanguard",
					description: "While in the party, combat start: gain 4 Temporary HP if Brienne is in front.",
					x: 45,
					y: 50,
					cost: 75,
					hooks: { "onCombatStart": function (params) { if (honeycomb.entityRank(params.entity, params.context.combat) === 0) honeycomb.grantTemporaryHealth(params.entity, 4, params.context); } },
					requiresArray: ["briCex1"],
				},
				{
					index: "briRest1",
					name: "Lay of the Land",
					description: "Unlocks Preptime at rest sites while Brienne is in the party.",
					x: 75,
					y: 50,
					cost: 150,
					requiresArray: ["briCex3"],
					restOption: "preptime",
				},
				{
					index: "briXp",
					name: "Veteran",
					description: "While in the party, gain 1.5x personal experience.",
					x: 50,
					y: 15,
					cost: 75,
					personalExperienceMultiplier: 1.5,
					requiresArray: ["briCex1"],
				},
				{
					index: "briCol",
					name: "Collector",
					description: "While in the party, unseen events and items appear 50% more often.",
					x: 50,
					y: 85,
					cost: 75,
					requiresArray: ["briCex1"],
					collectorWeight: 0.5,
				},
				{
					index: "briNew",
					name: "New Blood",
					description: "While in the party, Brienne's unseen cards appear 50% more often.",
					x: 60,
					y: 85,
					cost: 75,
					requiresArray: ["briCex2"],
					unseenCardWeight: 0.5,
				},
				{
					index: "briCheap",
					name: "Window Shopping",
					description: "While in the party, outfits and common relics cost 10% less in the shop.",
					x: 60,
					y: 15,
					cost: 75,
					requiresArray: ["briCex2"],
					unlockDiscount: 0.1,
				},
				{
					index: "briReroll1",
					name: "Second Chance",
					description: "One reward reroll per run while in the party.",
					x: 70,
					y: 15,
					cost: 150,
					requiresArray: ["briCex3"],
					rewardReroll: 1,
				},
				{
					index: "briBanish1",
					name: "Banish",
					description: "Banish one card from this run's reward, shop and journal pools while in the party.",
					x: 70,
					y: 85,
					cost: 300,
					requiresArray: ["briCex3"],
					rewardBanish: 1,
				},
				{
					index: "briGold",
					name: "Deep Pockets",
					description: "While in the party, +5 gold at run start per rank.",
					x: 90,
					y: 50,
					cost: 50,
					rankMaximum: 3,
					startingGold: 5,
					requiresArray: ["briShop1", "briShop2"],
				},
				{
					index: "briDef2",
					name: "Lend",
					description: "Brace becomes: choose one - gain 6 Temporary HP, or another ally gains 10 Temporary HP.",
					x: 125,
					y: 50,
					cost: 150,
					exclusiveGroup: "briDefPath",
					starterUpgradeArray: [{ "card": "brienneGrit", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Hold or lend?", "optionArray": [{ "index": "hold", "name": "Keep It", "description": "Gain 6 Temporary HP.", "effectArray": [{ "index": "temporaryHealth", "amount": 6 }] }, { "index": "lend", "name": "Lend It", "description": "Another ally gains 10 Temporary HP.", "effectArray": [{ "index": "chooseAlly", "prompt": "Lend to whom?", "effectArray": [{ "index": "temporaryHealth", "amount": 10 }] }] }] }] }],
					requiresArray: ["briBoun1", "briBoun2"],
					previewCardArray: ["brienneGrit"],
				},
				{
					index: "briOpenD",
					name: "Head Start",
					description: "While in the party, turn 1: +1 card drawn, -1 energy.",
					x: 95,
					y: 15,
					cost: 150,
					exclusiveGroup: "briOpenPath",
					requiresArray: ["briGold"],
					openingDrawBonus: 1,
					openingEnergyBonus: -1,
				},
				{
					index: "briOpenE",
					name: "Fast Start",
					description: "While in the party, turn 1: +1 energy, -1 card drawn.",
					x: 95,
					y: 85,
					cost: 150,
					exclusiveGroup: "briOpenPath",
					requiresArray: ["briGold"],
					openingDrawBonus: -1,
					openingEnergyBonus: 1,
				},
				{
					index: "briBoun1",
					name: "Plunder",
					description: "While in the party, bosses and elites pay 25% more gold.",
					x: 115,
					y: 35,
					cost: 150,
					exclusiveGroup: "briBounPath",
					requiresArray: ["briAtt1", "briAtt2", "briAtt3"],
					bountyGoldMultiplier: 0.25,
				},
				{
					index: "briBoun2",
					name: "Spoils",
					description: "While in the party, bosses and elites offer 1 extra card choice.",
					x: 115,
					y: 65,
					cost: 150,
					exclusiveGroup: "briBounPath",
					requiresArray: ["briAtt2", "briAtt3", "briAtt1"],
					bountyCardChoiceBonus: 1,
				},
				{
					index: "briShop1",
					name: "Haggler",
					description: "While in the party, cards cost 10% less in the shop.",
					x: 80,
					y: 15,
					cost: 150,
					exclusiveGroup: "briShopPath",
					requiresArray: ["briRest1"],
					shopCardDiscount: 0.1,
				},
				{
					index: "briShop2",
					name: "Wider Shelves",
					description: "While in the party, the shop offers 1 more card and 1 more relic option.",
					x: 80,
					y: 85,
					cost: 150,
					exclusiveGroup: "briShopPath",
					requiresArray: ["briRest1"],
					shopExtraSlots: 1,
				},
				{
					index: "briAbility2",
					name: "Aegis",
					description: "Unlocks Aegis. Spend all Resolve; each ally gains half that much Temporary HP; end the turn.",
					x: 165,
					y: 50,
					cost: 300,
					abilityAdditionArray: [{ "index": "brienneAegis" }],
					requiresArray: ["briU1", "briU2", "briRestA", "briRestB"],
				},
				{
					//Replaced Taunt. Retort
					//teaches the first character's core loop -- Temporary HP is not only a buffer, it hits back.
					//The `firstHitTaunt` field still works for any later node that wants it.
					index: "briCex3",
					name: "Counterguard",
					description: "While in the party, combat start: Brienne gains 1 Retort: each enemy hit Brienne's Temporary HP absorbs deals 3 damage back to the attacker.",
					x: 55,
					y: 50,
					cost: 75,
					requiresArray: ["briCex2"],
					retortStacks: 1,
					hooks: { "onCombatStart": function (params) { honeycomb.applyStatus(params.entity, "retort", params.definition.retortStacks, params.context); } },
				},
				{
					index: "briFort",
					name: "Fortitude",
					description: "Brienne's Lust weaknesses never build, and Brienne misses every Lust Event.",
					x: 10,
					y: 15,
					cost: 0,
					fortitude: true,
					//Free, with no prerequisite; `free` marks both as deliberate for audit-trees.js.
					free: true,
				},
				{
					index: "briRest2",
					name: "Lay of the Land, Always",
					description: "Preptime stays unlocked even when Brienne is benched.",
					x: 135,
					y: 50,
					cost: 300,
					requiresArray: ["briDef1", "briDef2", "briDef3"],
					restOption: "preptime",
				},
				{
					index: "briRestA",
					name: "Field Rations",
					description: "One more action when you reach a rest site.",
					x: 155,
					y: 15,
					cost: 150,
					exclusiveGroup: "briRestPath",
					requiresArray: ["briRest2"],
					restActionsBonus: 1,
				},
				{
					index: "briRestB",
					name: "Sound Sleep",
					description: "Sleep heals an extra 15% of maximum health.",
					x: 155,
					y: 85,
					cost: 150,
					exclusiveGroup: "briRestPath",
					requiresArray: ["briRest2"],
					restHealBonus: true,
				},
				{
					index: "briReroll2",
					name: "Second Chance, Always",
					description: "Adds 1 reroll to every run, whether or not Brienne is in the party.",
					x: 140,
					y: 15,
					cost: 150,
					requiresArray: ["briRest2"],
					rewardRerollAlways: 1,
				},
				{
					index: "briBanish2",
					name: "Banish, Always",
					description: "Adds 1 banish to every run, whether or not Brienne is in the party.",
					x: 140,
					y: 85,
					cost: 150,
					requiresArray: ["briRest2"],
					rewardBanishAlways: 1,
				},
				{
					index: "briTrimAttack",
					name: "Trim",
					description: "Remove a copy of Sword Strike from the starting deck.",
					x: 35,
					y: 35,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "briExtraAttack",
					cardRemovalArray: [{ "index": "brienneCleave", "count": 1 }],
					requiresArray: ["briAbility1"],
				},
				{
					index: "briTrimDefence",
					name: "Slim Down",
					description: "Remove a copy of Brace from the starting deck.",
					x: 35,
					y: 65,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "briExtraDefence",
					cardRemovalArray: [{ "index": "brienneGrit", "count": 1 }],
					requiresArray: ["briAbility1"],
				},
			],
		},
	},

	{
		index: "nettle",
		name: "Nettle",
		className: "Necromancer",
		classIconPath: "icons/necro",
		blurb: "I'll know how it works by morning.",
		description: "Nettle takes things apart to find out how they work. People are off limits, so she does it to plants and to the dead instead, and she is extremely good at both. She is short with anyone she does not know well. Her fights are slow ones: poison, rot, and waiting.",
		//A flaming skull floats near her and never says a word. It is in her art and in her scenes.
		colorHint: "#6bbf59",
		unlockedFromStart: true,
		tagArray: ["human", "woman", "attrition"],

		//THE ONE CARD THIS CHARACTER HOLDS WHILE BROKEN. Every card they own inherits this pointer;
		//a card naming its own `brokenCard` overrides it. See honeycomb.brokenCardIndexFor.
		brokenCard: "nettleBroken",
		//The !!BROKEN!! cut-in's art, and the recovery cut-in's. Both fall back through
		//honeycomb.brokenOverlay.artPathFor when a file is missing, so a character with none drawn
		//yet still gets the overlay -- their portrait stands in.
		brokenArtPath: "characters/necro/broken",
		brokenBackgroundPath: "characters/necro/brokenBG",
		//One of the special few who play the !!BROKEN!! cut-in. See honeycomb.entityHasBrokenCutIn.
		brokenCutIn: true,
		recoverArtPath: "characters/necro/recover",
		//Measured off default/recover.webp, the upper-body picture: a third of its height, from
		//just above the eyes. See tuning.recoverOverlay.eyeWindow.
		recoverEyeWindow: { centreXPercent: 50, topPercent: 22, heightPercent: 32 },
		recoverBackgroundPath: "characters/necro/recoverBG",

		artFolder: "necro",

		defaultOutfit: "default",
		startingEquipmentArray: ["shadowLocket"],

		//Nettle does not shift by default: Creeping Rot (tree node `netCex1`) is what moves her to the
		//back on an attack or a negative card, so party order is a progression choice she buys into.
		startingCardArray: [
			//One card from each sister mechanic (Contagion gets two), so the pool shows from the first fight.
			{ index: "nettleVenomTouch", count: 2 },
			{ index: "nettleLastRites", count: 2 },
		],

		startingAbilityArray: [],

		outfitArray: [
			{
				index: "default",
				name: "Default",
				unlockedFromStart: true,
				randomCardCount: 3,
				personalExperienceMultiplier: 1.2,
				description: "Adds 3 random Nettle cards at run start. +20% personal experience.",
			},

			//--- AUDIT-01: the three alts rebuilt to OUTFITS-LIST (consume / spread / poison carries Lust) ---
			{
				//CONSUME POISON. Souls come from what she cashes in, not what she burns.
				index: "rotsinger",
				name: "Rotsinger",
				unlockedFromStart: true,
				archetype: "rupture",
				healthModifier: -4,
				cardAdditionArray: [{ index: "nettlePop", count: 1 }],
				//Boost consume-poison (Rupture); reduce Lust-on-poison (Venom).
				archetypeWeightArray: [{ archetype: "rupture", multiplier: 3 }, { archetype: "venom", multiplier: 0.5 }],
				soulsFromConsumedPoison: true,
				treeAbilityReplacementArray: [{ from: "nettleGraveward", to: "nettleRotFeast" }],
				description: "-4 Max HP. Adds Pop. Nettle gains a Soul whenever she consumes Poison, instead of when a card is exhausted. Undead Army becomes Rot Feast: spend all Souls, the party heals 1 for each. Offers more cards that consume Poison, fewer that make Poison inflict Lust.",
			},
			{
				//SPREAD POISON. The rot feeds the party rather than hurting the enemy.
				index: "sporemother",
				name: "Sporemother",
				unlockedFromStart: true,
				archetype: "contagion",
				healthModifier: 6,
				cardAdditionArray: [{ index: "nettleSpore", count: 1 }],
				//Boost spread / party-hit poison (Contagion); reduce consume-poison (Rupture).
				archetypeWeightArray: [{ archetype: "contagion", multiplier: 3 }, { archetype: "rupture", multiplier: 0.5 }],
				poisonHealsAllies: true,
				treeAbilityReplacementArray: [{ from: "nettleGraveward", to: "nettleSporeBloom" }],
				description: "+6 Max HP. Adds Spore. Poison on enemies deals no damage: each tick heals your most wounded ally instead. Undead Army becomes Spore Bloom: spend all Souls, 1 Poison on a random enemy for each. Offers more cards that spread Poison, fewer that consume it.",
			},
			{
				//POISON CARRIES LUST. Nothing dies of it; everything breaks.
				index: "nightshade",
				name: "Nightshade",
				unlockedFromStart: true,
				archetype: "venom",
				cardAdditionArray: [{ index: "nettleKiss", count: 1 }],
				//Boost Lust-on-poison (Venom); reduce spread / party-hit poison (Contagion).
				archetypeWeightArray: [{ archetype: "venom", multiplier: 3 }, { archetype: "contagion", multiplier: 0.5 }],
				poisonInflictsLust: true,
				treeAbilityReplacementArray: [{ from: "nettleGraveward", to: "nettleNightBloom" }],
				description: "Adds Kiss. All Poison inflicts Lust instead of damage. Undead Army becomes Night Bloom: spend all Souls, every Poisoned enemy takes that much Lust. Offers more cards that make Poison inflict Lust, fewer that spread it.",
			},
		],

		progressionTree: {
			backgroundPath: "progression/necro-tree",
			aspect: 16 / 9,
			nodeArray: [
				{
					index: "netAbility1",
					name: "Blight",
					description: "Unlocks Blight and Nettle's Harvest. Inflict Poison for each Soul, without spending them. Once per rest.",
					x: 15,
					y: 50,
					cost: 150,
					abilityAdditionArray: [{ "index": "nettleBlight" }],
					requiresArray: ["netStart"],
				},
				{
					index: "netStart",
					name: "Vigour",
					description: "+5 Max HP per rank.",
					x: 5,
					y: 50,
					cost: 25,
					healthModifier: 5,
				},
				{
					index: "netAtt1",
					name: "Wither",
					description: "Wither: -2 damage and +1 Poison per rank; at the last rank it deals no damage and reads as pure negative.",
					x: 105,
					y: 20,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "netAttPath",
					starterUpgradeArray: [{ "card": "nettleVenomTouch", "effect": "damage", "amount": -2, "negativeIfZeroDamage": true }, { "card": "nettleVenomTouch", "effect": "applyStatus", "status": "poison", "stacks": 1 }],
					requiresArray: ["netGold"],
					previewCardArray: ["nettleVenomTouch"],
				},
				{
					index: "netAtt3",
					name: "Cloud",
					description: "Wither hits every enemy: deal 2 and apply 1 Poison; the second rank removes the damage and applies 2 Poison.",
					x: 105,
					y: 80,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "netAttPath",
					starterUpgradeArray: [{ "card": "nettleVenomTouch", "targetMode": "allEnemies", "negativeIfZeroDamage": true, "replaceEffectArray": [{ "index": "damage", "amount": 4 }], "effect": "damage", "amount": -2, "addEffectArray": [{ "index": "applyStatus", "status": "poison", "stacks": 1 }] }],
					requiresArray: ["netGold"],
					previewCardArray: ["nettleVenomTouch"],
				},
				{
					index: "netDef3",
					name: "Husk",
					description: "Last Rites becomes: choose one - cleanse an ally, or gain 3 Souls.",
					x: 125,
					y: 80,
					cost: 150,
					exclusiveGroup: "netDefPath",
					starterUpgradeArray: [{ "card": "nettleLastRites", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Rites for what?", "optionArray": [{ "index": "cleanse", "name": "Cleanse", "description": "Remove all negative statuses from the ally.", "effectArray": [{ "index": "cleanse" }] }, { "index": "souls", "name": "Husk", "description": "Gain 3 Souls.", "effectArray": [{ "index": "gainMechanic", "mechanic": "harvest", "amount": 3 }] }] }] }],
					requiresArray: ["netBoun2", "netBoun1"],
					previewCardArray: ["nettleLastRites"],
				},
				{
					index: "netDef1",
					name: "Last Rites",
					description: "Last Rites becomes: choose one - cleanse an ally, or draw a card.",
					x: 125,
					y: 20,
					cost: 150,
					exclusiveGroup: "netDefPath",
					starterUpgradeArray: [{ "card": "nettleLastRites", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Rites for what?", "optionArray": [{ "index": "cleanse", "name": "Cleanse", "description": "Remove all negative statuses from the ally.", "effectArray": [{ "index": "cleanse" }] }, { "index": "draw", "name": "Read", "description": "Draw a card.", "effectArray": [{ "index": "drawCards", "amount": 1 }] }] }] }],
					requiresArray: ["netBoun1", "netBoun2"],
					previewCardArray: ["nettleLastRites"],
				},
				{
					index: "netAtt2",
					name: "Acid",
					description: "Wither becomes its Weak form: deal 2 and apply 2 Weak; each rank adds 1 Weak and removes 2 damage.",
					x: 105,
					y: 50,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "netAttPath",
					starterUpgradeArray: [{ "card": "nettleVenomTouch", "negativeIfZeroDamage": true, "replaceEffectArray": [{ "index": "damage", "amount": 4 }, { "index": "applyStatus", "status": "weak", "stacks": 1 }], "effect": "damage", "amount": -2, "addEffectArray": [{ "index": "applyStatus", "status": "weak", "stacks": 1 }] }],
					requiresArray: ["netGold"],
					previewCardArray: ["nettleVenomTouch"],
				},
				{
					index: "netU1",
					name: "Sister Wardrobe",
					description: "While in the party, Nettle's worn outfit adds twice as many cards.",
					x: 150,
					y: 35,
					cost: 150,
					exclusiveGroup: "netOutfitPath",
					requiresArray: ["netRest2"],
					outfitCardDoubling: true,
				},
				{
					index: "netWheel1",
					name: "Harvest",
					description: "Blight becomes: remove Poison, deal that much damage.",
					x: 175,
					y: 20,
					cost: 150,
					exclusiveGroup: "netWheelPath",
					requiresArray: ["netAbility2"],
					abilityUpgradeArray: [{ "ability": "nettleBlight", "disableMechanic": true, "effectArray": [{ "index": "consumeStatus", "status": "poison" }, { "index": "damage", "amount": { "index": "tally", "key": "consumed" } }] }],
				},
				{
					index: "netWheel2",
					name: "Veil",
					description: "Blight becomes: remove all debuffs from the party.",
					x: 175,
					y: 50,
					cost: 150,
					exclusiveGroup: "netWheelPath",
					requiresArray: ["netAbility2"],
					abilityUpgradeArray: [{ "ability": "nettleBlight", "disableMechanic": true, "targetMode": "allAllies", "requirementArray": [], "effectArray": [{ "index": "cleanse" }] }],
				},
				{
					index: "netWheel3",
					name: "Tainted Kiss",
					description: "Blight becomes: remove Poison, inflict that much Lust.",
					x: 175,
					y: 80,
					cost: 150,
					exclusiveGroup: "netWheelPath",
					requiresArray: ["netAbility2"],
					abilityUpgradeArray: [{ "ability": "nettleBlight", "disableMechanic": true, "effectArray": [{ "index": "consumeStatus", "status": "poison" }, { "index": "lust", "amount": { "index": "tally", "key": "consumed" } }] }],
				},
				{
					index: "netExtraAttack",
					name: "Extra Copy",
					description: "Add a second copy of Wither to the starting deck.",
					x: 25,
					y: 15,
					cost: 150,
					exclusiveGroup: "netExtraAttack",
					cardAdditionArray: [{ "index": "nettleVenomTouch", "count": 1 }],
					requiresArray: ["netAbility1"],
				},
				{
					index: "netReplaceAttack",
					name: "Retrain",
					description: "At run start, one Wither becomes a random common of Nettle.",
					x: 40,
					y: 15,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "nettleVenomTouch", "rarity": "common", "count": 1 }],
					requiresArray: ["netExtraAttack"],
				},
				{
					index: "netExtraDefence",
					name: "Extra Guard",
					description: "Add a second copy of Last Rites to the starting deck.",
					x: 25,
					y: 85,
					cost: 150,
					exclusiveGroup: "netExtraDefence",
					cardAdditionArray: [{ "index": "nettleLastRites", "count": 1 }],
					requiresArray: ["netAbility1"],
				},
				{
					index: "netReplaceDefence",
					name: "Relearn",
					description: "At run start, one Last Rites becomes a random common of Nettle.",
					x: 40,
					y: 85,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "nettleLastRites", "rarity": "common", "count": 1 }],
					requiresArray: ["netExtraDefence"],
				},
				{
					index: "netCex1",
					name: "Creeping Rot",
					description: "While in the party, using an attack or a negative moves Nettle to the back of the party.",
					x: 35,
					y: 50,
					cost: 75,
					requiresArray: ["netAbility1"],
					partyShiftByCardType: { "damage": "back", "negative": "back" },
				},
				{
					index: "netU2",
					name: "Tailored",
					description: "While in the party, Nettle's worn outfit cards start upgraded.",
					x: 150,
					y: 65,
					cost: 300,
					exclusiveGroup: "netOutfitPath",
					requiresArray: ["netRest2"],
					outfitCardUpgrade: true,
				},
				{
					index: "netCex2",
					name: "Penny Pincher",
					description: "While in the party, gain 20% of held gold when leaving the shop.",
					x: 45,
					y: 50,
					cost: 75,
					requiresArray: ["netCex1"],
					shopExitGoldFraction: 0.2,
				},
				{
					index: "netRest1",
					name: "Lay of the Land",
					description: "Unlocks Journal at rest sites while Nettle is in the party.",
					x: 75,
					y: 50,
					cost: 150,
					requiresArray: ["netCex3"],
					restOption: "journal",
				},
				{
					index: "netXp",
					name: "Veteran",
					description: "While in the party, gain 1.5x personal experience.",
					x: 50,
					y: 15,
					cost: 75,
					personalExperienceMultiplier: 1.5,
					requiresArray: ["netCex1"],
				},
				{
					index: "netCol",
					name: "Collector",
					description: "While in the party, unseen events and items appear 50% more often.",
					x: 50,
					y: 85,
					cost: 75,
					requiresArray: ["netCex1"],
					collectorWeight: 0.5,
				},
				{
					index: "netNew",
					name: "New Blood",
					description: "While in the party, Nettle's unseen cards appear 50% more often.",
					x: 60,
					y: 85,
					cost: 75,
					requiresArray: ["netCex2"],
					unseenCardWeight: 0.5,
				},
				{
					index: "netCheap",
					name: "Window Shopping",
					description: "While in the party, outfits and common relics cost 10% less in the shop.",
					x: 60,
					y: 15,
					cost: 75,
					requiresArray: ["netCex2"],
					unlockDiscount: 0.1,
				},
				{
					index: "netReroll1",
					name: "Second Chance",
					description: "One reward reroll per run while in the party.",
					x: 70,
					y: 15,
					cost: 150,
					requiresArray: ["netCex3"],
					rewardReroll: 1,
				},
				{
					index: "netBanish1",
					name: "Banish",
					description: "Banish one card from this run's reward, shop and journal pools while in the party.",
					x: 70,
					y: 85,
					cost: 300,
					requiresArray: ["netCex3"],
					rewardBanish: 1,
				},
				{
					index: "netGold",
					name: "Deep Pockets",
					description: "While in the party, +5 gold at run start per rank.",
					x: 90,
					y: 50,
					cost: 50,
					rankMaximum: 3,
					startingGold: 5,
					requiresArray: ["netShop1", "netShop2"],
				},
				{
					index: "netDef2",
					name: "Reaper",
					description: "Last Rites becomes: choose one - cleanse an ally, or pay 3 Souls to draw a card and gain 1 Energy.",
					x: 125,
					y: 50,
					cost: 150,
					exclusiveGroup: "netDefPath",
					starterUpgradeArray: [{ "card": "nettleLastRites", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Rites for what?", "optionArray": [{ "index": "cleanse", "name": "Cleanse", "description": "Remove all negative statuses from the ally.", "effectArray": [{ "index": "cleanse" }] }, { "index": "draw", "name": "Reap", "description": "Pay 3 Souls: draw a card and gain 1 Energy.", "condition": { "index": "mechanicAtLeast", "mechanic": "harvest", "amount": 3 }, "effectArray": [{ "index": "spendMechanic", "mechanic": "harvest", "amount": 3 }, { "index": "drawCards", "amount": 1 }, { "index": "gainResource", "resource": "energy", "amount": 1 }] }] }] }],
					requiresArray: ["netBoun1", "netBoun2"],
					previewCardArray: ["nettleLastRites"],
				},
				{
					index: "netOpenD",
					name: "Head Start",
					description: "While in the party, turn 1: +1 card drawn, -1 energy.",
					x: 95,
					y: 15,
					cost: 150,
					exclusiveGroup: "netOpenPath",
					requiresArray: ["netGold"],
					openingDrawBonus: 1,
					openingEnergyBonus: -1,
				},
				{
					index: "netOpenE",
					name: "Fast Start",
					description: "While in the party, turn 1: +1 energy, -1 card drawn.",
					x: 95,
					y: 85,
					cost: 150,
					exclusiveGroup: "netOpenPath",
					requiresArray: ["netGold"],
					openingDrawBonus: -1,
					openingEnergyBonus: 1,
				},
				{
					index: "netBoun1",
					name: "Plunder",
					description: "While in the party, bosses and elites pay 25% more gold.",
					x: 115,
					y: 35,
					cost: 150,
					exclusiveGroup: "netBounPath",
					requiresArray: ["netAtt1", "netAtt2", "netAtt3"],
					bountyGoldMultiplier: 0.25,
				},
				{
					index: "netBoun2",
					name: "Spoils",
					description: "While in the party, bosses and elites offer 1 extra card choice.",
					x: 115,
					y: 65,
					cost: 150,
					exclusiveGroup: "netBounPath",
					requiresArray: ["netAtt2", "netAtt3", "netAtt1"],
					bountyCardChoiceBonus: 1,
				},
				{
					index: "netShop1",
					name: "Haggler",
					description: "While in the party, cards cost 10% less in the shop.",
					x: 80,
					y: 15,
					cost: 150,
					exclusiveGroup: "netShopPath",
					requiresArray: ["netRest1"],
					shopCardDiscount: 0.1,
				},
				{
					index: "netShop2",
					name: "Wider Shelves",
					description: "While in the party, the shop offers 1 more card and 1 more relic option.",
					x: 80,
					y: 85,
					cost: 150,
					exclusiveGroup: "netShopPath",
					requiresArray: ["netRest1"],
					shopExtraSlots: 1,
				},
				{
					index: "netAbility2",
					name: "Undead Army",
					description: "Unlocks Undead Army. Spend all Souls; deal 1 damage at random for each Soul spent.",
					x: 165,
					y: 50,
					cost: 300,
					abilityAdditionArray: [{ "index": "nettleGraveward" }],
					requiresArray: ["netU1", "netU2", "netRestA", "netRestB"],
				},
				{
					index: "netCex3",
					name: "First Rites",
					description: "While in the party, the first debuff on Nettle each combat is removed.",
					x: 55,
					y: 50,
					cost: 75,
					requiresArray: ["netCex2"],
					firstCleanse: true,
				},
				{
					index: "netFort",
					name: "Fortitude",
					description: "Nettle's Lust weaknesses never build, and Nettle misses every Lust Event.",
					x: 10,
					y: 15,
					cost: 0,
					fortitude: true,
					//Free, with no prerequisite; `free` marks both as deliberate for audit-trees.js.
					free: true,
				},
				{
					index: "netRest2",
					name: "Lay of the Land, Always",
					description: "Journal stays unlocked even when Nettle is benched.",
					x: 135,
					y: 50,
					cost: 300,
					requiresArray: ["netDef1", "netDef2", "netDef3"],
					restOption: "journal",
				},
				{
					index: "netRestA",
					name: "Field Rations",
					description: "One more action when you reach a rest site.",
					x: 155,
					y: 15,
					cost: 150,
					exclusiveGroup: "netRestPath",
					requiresArray: ["netRest2"],
					restActionsBonus: 1,
				},
				{
					index: "netRestB",
					name: "Sound Sleep",
					description: "Sleep heals an extra 15% of maximum health.",
					x: 155,
					y: 85,
					cost: 150,
					exclusiveGroup: "netRestPath",
					requiresArray: ["netRest2"],
					restHealBonus: true,
				},
				{
					index: "netReroll2",
					name: "Second Chance, Always",
					description: "Adds 1 reroll to every run, whether or not Nettle is in the party.",
					x: 140,
					y: 15,
					cost: 150,
					requiresArray: ["netRest2"],
					rewardRerollAlways: 1,
				},
				{
					index: "netBanish2",
					name: "Banish, Always",
					description: "Adds 1 banish to every run, whether or not Nettle is in the party.",
					x: 140,
					y: 85,
					cost: 150,
					requiresArray: ["netRest2"],
					rewardBanishAlways: 1,
				},
				{
					index: "netTrimAttack",
					name: "Trim",
					description: "Remove a copy of Wither from the starting deck.",
					x: 35,
					y: 35,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "netExtraAttack",
					cardRemovalArray: [{ "index": "nettleVenomTouch", "count": 1 }],
					requiresArray: ["netAbility1"],
				},
				{
					index: "netTrimDefence",
					name: "Slim Down",
					description: "Remove a copy of Last Rites from the starting deck.",
					x: 35,
					y: 65,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "netExtraDefence",
					cardRemovalArray: [{ "index": "nettleLastRites", "count": 1 }],
					requiresArray: ["netAbility1"],
				},
			],
		},
	},

	{
		index: "severine",
		name: "Severine",
		className: "Bloodletter",
		classIconPath: "icons/vamp",
		blurb: "I have excellent taste and no restraint.",
		description: "Severine is a vampire noble and makes no secret of it. She is rich, she is old, and she holds a title she remembers whenever it is useful to her. She spends her own blood like money in a fight, and she is usually right about what it buys.",
		colorHint: "#b04a8c",
		unlockedFromStart: true,
		//UNDEAD, NOT VAMPIRE. She was the only thing in the game carrying `vampire`, and one tag for one
		//character is a category, not a species. Deep Calculation's "each Undead ally" now has somebody to
		//count.
		tagArray: ["undead", "woman", "striker"],

		//THE ONE CARD THIS CHARACTER HOLDS WHILE BROKEN. Every card they own inherits this pointer;
		//a card naming its own `brokenCard` overrides it. See honeycomb.brokenCardIndexFor.
		brokenCard: "severineBroken",
		//The !!BROKEN!! cut-in's art, and the recovery cut-in's. Both fall back through
		//honeycomb.brokenOverlay.artPathFor when a file is missing, so a character with none drawn
		//yet still gets the overlay -- their portrait stands in.
		brokenArtPath: "characters/vamp/broken",
		brokenBackgroundPath: "characters/vamp/brokenBG",
		//One of the special few who play the !!BROKEN!! cut-in. See honeycomb.entityHasBrokenCutIn.
		brokenCutIn: true,
		recoverArtPath: "characters/vamp/recover",
		//Measured off default/recover.webp, the upper-body picture: a third of its height, from
		//just above the eyes. See tuning.recoverOverlay.eyeWindow.
		recoverEyeWindow: { centreXPercent: 46, topPercent: 24, heightPercent: 32 },
		recoverBackgroundPath: "characters/vamp/recoverBG",

		artFolder: "vamp",

		defaultOutfit: "default",
		startingEquipmentArray: ["crimsonFang"],

		startingCardArray: [
			//One card from each sister mechanic, so the pool shows from the first fight. Enthrall is still
			//the party's first lust attack.
			{ index: "severineRend", count: 2 },
			{ index: "severineQuaff", count: 2 },
		],

		startingAbilityArray: [],

		outfitArray: [
			{
				index: "default",
				name: "Default",
				unlockedFromStart: true,
				randomCardCount: 3,
				personalExperienceMultiplier: 1.2,
				description: "Adds 3 random Severine cards at run start. +20% personal experience.",
			},

			//--- AUDIT-01: the three alts rebuilt to OUTFITS-LIST (hunt the wounded / pay in blood / give blood) ---
			{
				//HUNT THE WOUNDED. Every kill is another card.
				index: "huntress",
				name: "Huntress",
				unlockedFromStart: true,
				archetype: "feast",
				cardAdditionArray: [{ index: "severineFinish", count: 1 }],
				//Boost execute / missing-HP (Feast); reduce self-damage (Bloodletting).
				archetypeWeightArray: [{ archetype: "feast", multiplier: 3 }, { archetype: "bloodletting", multiplier: 0.5 }],
				drawOnKill: 1,
				treeAbilityReplacementArray: [{ from: "severineQuicken", to: "severineHuntersRush" }],
				hooks: {
					onEnemyDowned: function (params) {
						if (params.context == null || params.context.combat == null) return;
						honeycomb.drawCards(params.definition.drawOnKill, params.context);
					},
				},
				description: "Adds Finish. Draw a card when an enemy dies. Quicken becomes Hunter's Rush: gain 2 Energy if all three Thirst orbs are lit. Offers more cards that finish the wounded, fewer that cost Severine her own health.",
			},
			{
				//PAY IN BLOOD. Every price is doubled, and so is every mouthful back.
				index: "crimsonCovenant",
				name: "Crimson Covenant",
				unlockedFromStart: true,
				archetype: "bloodletting",
				healthModifier: 4,
				cardAdditionArray: [{ index: "severineCut", count: 1 }],
				//Boost self-damage (Bloodletting); reduce heal / Drain (Transfusion).
				archetypeWeightArray: [{ archetype: "bloodletting", multiplier: 3 }, { archetype: "transfusion", multiplier: 0.5 }],
				selfDamageMultiplier: 2,
				healingReceivedMultiplier: 2,
				treeAbilityReplacementArray: [{ from: "severineQuicken", to: "severineCovenantRite" }],
				description: "+4 Max HP. Adds Cut. Severine takes double damage from herself, and receives double healing. Quicken becomes Covenant Rite: regain all health if all three Thirst orbs are lit. Offers more cards that cost her own health, fewer that heal or Drain.",
			},
			{
				//GIVE BLOOD. What she drinks, the whole party shares.
				index: "bloodSaint",
				name: "Blood Saint",
				unlockedFromStart: true,
				archetype: "transfusion",
				healthModifier: 6,
				cardAdditionArray: [{ index: "severineBloodMoonRite", count: 1 }],
				//Boost heal / Drain (Transfusion); reduce execute / missing-HP (Feast).
				archetypeWeightArray: [{ archetype: "transfusion", multiplier: 3 }, { archetype: "feast", multiplier: 0.5 }],
				selfHealingSplit: true,
				//A2 is disabled; bought, it becomes Sanctified-while-lit below.
				treeAbilityReplacementArray: [{ from: "severineQuicken", to: null }],
				hooks: {
					onTurnStart: function (params) { honeycomb.syncBloodSaintHalo(params.entity, params.context); },
					onTurnEnd: function (params) { honeycomb.syncBloodSaintHalo(params.entity, params.context); },
					onCardPlayed: function (params) { honeycomb.syncBloodSaintHalo(params.entity, params.context); },
					onDamaged: function (params) { honeycomb.syncBloodSaintHalo(params.entity, params.context); },
				},
				description: "+6 Max HP. Adds Blood Moon. Healing Severine gives herself is split evenly across the party. Quicken is disabled: instead, Severine is Sanctified while all three Thirst orbs are lit. Offers more cards that heal or Drain, fewer that finish the wounded.",
			},
		],

		progressionTree: {
			backgroundPath: "progression/vamp-tree",
			aspect: 16 / 9,
			nodeArray: [
				{
					index: "severineAbility1",
					name: "Blood Tap",
					description: "Unlocks Blood Tap and Severine's Thirst. Lose 5 life, gain 1 Strength. Three times per combat.",
					x: 15,
					y: 50,
					cost: 150,
					abilityAdditionArray: [{ "index": "severineBloodTap" }],
					requiresArray: ["severineStart"],
				},
				{
					index: "severineStart",
					name: "Vigour",
					description: "+5 Max HP per rank.",
					x: 5,
					y: 50,
					cost: 8,
					rankMaximum: 3,
					healthModifier: 5,
				},
				{
					index: "severineAtt1",
					name: "Flurry",
					description: "Claw Flurry becomes 3x3.",
					x: 105,
					y: 20,
					cost: 150,
					exclusiveGroup: "severineAttPath",
					starterUpgradeArray: [{ "card": "severineRend", "effect": "damage", "amount": 1 }],
					requiresArray: ["severineGold"],
					previewCardArray: ["severineRend"],
				},
				{
					index: "severineAtt3",
					name: "Price",
					description: "Claw Flurry becomes five hits of 3; the fifth lands on Severine.",
					x: 105,
					y: 80,
					cost: 150,
					exclusiveGroup: "severineAttPath",
					starterUpgradeArray: [{ "card": "severineRend", "replaceEffectArray": [{ "index": "repeat", "times": 4, "effectArray": [{ "index": "damage", "amount": 3, "vfx": "none" }] }, { "index": "damage", "amount": 3, "targetOverride": "owner", "vfx": "none" }] }],
					requiresArray: ["severineGold"],
					previewCardArray: ["severineRend"],
				},
				{
					index: "severineDef3",
					name: "Mend",
					description: "Drain becomes: choose one - drain 4, or regain 8 health.",
					x: 125,
					y: 80,
					cost: 150,
					exclusiveGroup: "severineDefPath",
					starterUpgradeArray: [{ "card": "severineQuaff", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Take or give?", "optionArray": [{ "index": "drain", "name": "Drain", "description": "Drain 4.", "effectArray": [{ "index": "damage", "amount": 4 }, { "index": "heal", "amount": { "index": "damageDealt" }, "targetOverride": "owner" }] }, { "index": "mend", "name": "Mend", "description": "Regain 8 health.", "effectArray": [{ "index": "heal", "amount": 8, "targetOverride": "owner" }] }] }] }],
					requiresArray: ["severineBoun2", "severineBoun1"],
					previewCardArray: ["severineQuaff"],
				},
				{
					index: "severineDef1",
					name: "Blood Tax",
					description: "Drain becomes: choose one - drain 4, or steal up to 2 Strength.",
					x: 125,
					y: 20,
					cost: 150,
					exclusiveGroup: "severineDefPath",
					starterUpgradeArray: [{ "card": "severineQuaff", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Take what?", "optionArray": [{ "index": "drain", "name": "Drain", "description": "Drain 4.", "effectArray": [{ "index": "damage", "amount": 4 }, { "index": "heal", "amount": { "index": "damageDealt" }, "targetOverride": "owner" }] }, { "index": "steal", "name": "Tax", "description": "Steal up to 2 Strength from the target.", "effectArray": [{ "index": "consumeStatus", "status": "strength", "stacks": 2 }, { "index": "applyStatus", "status": "strength", "stacks": { "index": "tally", "key": "consumed" }, "targetOverride": "owner" }] }] }] }],
					requiresArray: ["severineBoun1", "severineBoun2"],
					previewCardArray: ["severineQuaff"],
				},
				{
					index: "severineAtt2",
					name: "Drink",
					description: "Claw Flurry becomes: drain 2x3.",
					x: 105,
					y: 50,
					cost: 150,
					exclusiveGroup: "severineAttPath",
					starterUpgradeArray: [{ "card": "severineRend", "addEffectArray": [{ "index": "heal", "amount": { "index": "damageDealt" }, "targetOverride": "owner" }] }],
					requiresArray: ["severineGold"],
					previewCardArray: ["severineRend"],
				},
				{
					index: "severineU1",
					name: "Sister Wardrobe",
					description: "While in the party, Severine's worn outfit adds twice as many cards.",
					x: 150,
					y: 35,
					cost: 150,
					exclusiveGroup: "severineOutfitPath",
					requiresArray: ["severineRest2"],
					outfitCardDoubling: true,
				},
				{
					index: "severineWheel1",
					name: "Bloodlust",
					description: "Blood Tap becomes: gain 5 Lust instead of losing life.",
					x: 175,
					y: 20,
					cost: 150,
					exclusiveGroup: "severineWheelPath",
					requiresArray: ["severineAbility2"],
					abilityUpgradeArray: [{ "ability": "severineBloodTap", "disableMechanic": true, "text": "Severine gains 5 Lust and 1 Strength.", "effectArray": [{ "index": "lust", "amount": 5, "targetOverride": "owner" }, { "index": "applyStatus", "status": "strength", "stacks": 1, "targetOverride": "owner" }] }],
				},
				{
					index: "severineWheel2",
					name: "Soul Tap",
					description: "Blood Tap becomes: discard a card, draw 2, lose 3 life per card in hand.",
					x: 175,
					y: 50,
					cost: 150,
					exclusiveGroup: "severineWheelPath",
					requiresArray: ["severineAbility2"],
					abilityUpgradeArray: [{ "ability": "severineBloodTap", "disableMechanic": true, "text": "Discard a card. Draw 2 cards. Lose 3 HP for each card in your hand.", "effectArray": [{ "index": "chooseCards", "from": "handCard", "prompt": "Discard which card?", "effectArray": [{ "index": "discardCard" }] }, { "index": "drawCards", "amount": 2 }, { "index": "loseHealth", "amount": { "index": "math", "operation": "multiply", "left": 3, "right": { "index": "count", "collection": "hand" } }, "targetOverride": "owner" }] }],
				},
				{
					index: "severineWheel3",
					name: "Full Control",
					description: "Blood Tap becomes: upgrade a damage card and play a copy of it on Severine.",
					x: 175,
					y: 80,
					cost: 150,
					exclusiveGroup: "severineWheelPath",
					requiresArray: ["severineAbility2"],
					abilityUpgradeArray: [{ "ability": "severineBloodTap", "disableMechanic": true, "text": "Upgrade a damage card, then play a copy of it on Severine.", "effectArray": [{ "index": "chooseCards", "from": "handCard", "prompt": "Take control of which card?", "cardType": "damage", "nonStarterOnly": true, "effectArray": [{ "index": "upgradeTargetCard", "levels": 1 }, { "index": "playChosenCardOnOwner" }] }] }],
				},
				{
					index: "severineExtraAttack",
					name: "Extra Copy",
					description: "Add a second copy of Claw Flurry to the starting deck.",
					x: 25,
					y: 15,
					cost: 150,
					exclusiveGroup: "severineExtraAttack",
					cardAdditionArray: [{ "index": "severineRend", "count": 1 }],
					requiresArray: ["severineAbility1"],
				},
				{
					index: "severineReplaceAttack",
					name: "Retrain",
					description: "At run start, one Claw Flurry becomes a random common of Severine.",
					x: 40,
					y: 15,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "severineRend", "rarity": "common", "count": 1 }],
					requiresArray: ["severineExtraAttack"],
				},
				{
					index: "severineExtraDefence",
					name: "Extra Guard",
					description: "Add a second copy of Drain to the starting deck.",
					x: 25,
					y: 85,
					cost: 150,
					exclusiveGroup: "severineExtraDefence",
					cardAdditionArray: [{ "index": "severineQuaff", "count": 1 }],
					requiresArray: ["severineAbility1"],
				},
				{
					index: "severineReplaceDefence",
					name: "Relearn",
					description: "At run start, one Drain becomes a random common of Severine.",
					x: 40,
					y: 85,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "severineQuaff", "rarity": "common", "count": 1 }],
					requiresArray: ["severineExtraDefence"],
				},
				{
					index: "severineCex1",
					name: "Feast",
					description: "While in the party, when an enemy dies, regain 5 HP.",
					x: 35,
					y: 50,
					cost: 75,
					requiresArray: ["severineAbility1"],
					onKillHeal: 5,
				},
				{
					index: "severineU2",
					name: "Tailored",
					description: "While in the party, Severine's worn outfit cards start upgraded.",
					x: 150,
					y: 65,
					cost: 300,
					exclusiveGroup: "severineOutfitPath",
					requiresArray: ["severineRest2"],
					outfitCardUpgrade: true,
				},
				{
					index: "severineCex2",
					name: "Challenger",
					description: "While in the party, draw 1 extra at the start of boss and elite fights.",
					x: 45,
					y: 50,
					cost: 75,
					hooks: { "onCombatStart": function (params) {
					var combat = params.context.combat;
					var encounter = combat == null ? null : honeycomb.findDefinition(honeycomb.encounterArray, combat.encounterIndex);
					if (encounter == null) return;
					if (encounter.isElite != true && encounter.tier != "boss") return;
					honeycomb.drawCards(1, params.context);
				} },
					requiresArray: ["severineCex1"],
				},
				{
					index: "severineRest1",
					name: "Lay of the Land",
					description: "Unlocks Treatment at rest sites while Severine is in the party.",
					x: 75,
					y: 50,
					cost: 150,
					requiresArray: ["severineCex3"],
					restOption: "treatment",
				},
				{
					index: "severineXp",
					name: "Veteran",
					description: "While in the party, gain 1.5x personal experience.",
					x: 50,
					y: 15,
					cost: 75,
					personalExperienceMultiplier: 1.5,
					requiresArray: ["severineCex1"],
				},
				{
					index: "severineCol",
					name: "Collector",
					description: "While in the party, unseen events and items appear 50% more often.",
					x: 50,
					y: 85,
					cost: 75,
					requiresArray: ["severineCex1"],
					collectorWeight: 0.5,
				},
				{
					index: "severineNew",
					name: "New Blood",
					description: "While in the party, Severine's unseen cards appear 50% more often.",
					x: 60,
					y: 85,
					cost: 75,
					requiresArray: ["severineCex2"],
					unseenCardWeight: 0.5,
				},
				{
					index: "severineCheap",
					name: "Window Shopping",
					description: "While in the party, outfits and common relics cost 10% less in the shop.",
					x: 60,
					y: 15,
					cost: 75,
					requiresArray: ["severineCex2"],
					unlockDiscount: 0.1,
				},
				{
					index: "severineReroll1",
					name: "Second Chance",
					description: "One reward reroll per run while in the party.",
					x: 70,
					y: 15,
					cost: 150,
					requiresArray: ["severineCex3"],
					rewardReroll: 1,
				},
				{
					index: "severineBanish1",
					name: "Banish",
					description: "Banish one card from this run's reward, shop and journal pools while in the party.",
					x: 70,
					y: 85,
					cost: 300,
					requiresArray: ["severineCex3"],
					rewardBanish: 1,
				},
				{
					index: "severineGold",
					name: "Deep Pockets",
					description: "While in the party, +5 gold at run start per rank.",
					x: 90,
					y: 50,
					cost: 50,
					rankMaximum: 3,
					startingGold: 5,
					requiresArray: ["severineShop1", "severineShop2"],
				},
				{
					index: "severineDef2",
					name: "Leech",
					description: "Drain becomes: choose one - drain 4, or drain 8 from an ally.",
					x: 125,
					y: 50,
					cost: 150,
					exclusiveGroup: "severineDefPath",
					starterUpgradeArray: [{ "card": "severineQuaff", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Take from whom?", "optionArray": [{ "index": "drain", "name": "Drain", "description": "Drain 4.", "effectArray": [{ "index": "damage", "amount": 4 }, { "index": "heal", "amount": { "index": "damageDealt" }, "targetOverride": "owner" }] }, { "index": "leech", "name": "Leech", "description": "Drain 8 from an ally.", "effectArray": [{ "index": "chooseAlly", "prompt": "Drain whom?", "effectArray": [{ "index": "damage", "amount": 8 }, { "index": "heal", "amount": 8, "targetOverride": "owner" }] }] }] }] }],
					requiresArray: ["severineBoun1", "severineBoun2"],
					previewCardArray: ["severineQuaff"],
				},
				{
					index: "severineOpenD",
					name: "Head Start",
					description: "While in the party, turn 1: +1 card drawn, -1 energy.",
					x: 95,
					y: 15,
					cost: 150,
					exclusiveGroup: "severineOpenPath",
					requiresArray: ["severineGold"],
					openingDrawBonus: 1,
					openingEnergyBonus: -1,
				},
				{
					index: "severineOpenE",
					name: "Fast Start",
					description: "While in the party, turn 1: +1 energy, -1 card drawn.",
					x: 95,
					y: 85,
					cost: 150,
					exclusiveGroup: "severineOpenPath",
					requiresArray: ["severineGold"],
					openingDrawBonus: -1,
					openingEnergyBonus: 1,
				},
				{
					index: "severineBoun1",
					name: "Plunder",
					description: "While in the party, bosses and elites pay 25% more gold.",
					x: 115,
					y: 35,
					cost: 150,
					exclusiveGroup: "severineBounPath",
					requiresArray: ["severineAtt1", "severineAtt2", "severineAtt3"],
					bountyGoldMultiplier: 0.25,
				},
				{
					index: "severineBoun2",
					name: "Spoils",
					description: "While in the party, bosses and elites offer 1 extra card choice.",
					x: 115,
					y: 65,
					cost: 150,
					exclusiveGroup: "severineBounPath",
					requiresArray: ["severineAtt2", "severineAtt3", "severineAtt1"],
					bountyCardChoiceBonus: 1,
				},
				{
					index: "severineShop1",
					name: "Haggler",
					description: "While in the party, cards cost 10% less in the shop.",
					x: 80,
					y: 15,
					cost: 150,
					exclusiveGroup: "severineShopPath",
					requiresArray: ["severineRest1"],
					shopCardDiscount: 0.1,
				},
				{
					index: "severineShop2",
					name: "Wider Shelves",
					description: "While in the party, the shop offers 1 more card and 1 more relic option.",
					x: 80,
					y: 85,
					cost: 150,
					exclusiveGroup: "severineShopPath",
					requiresArray: ["severineRest1"],
					shopExtraSlots: 1,
				},
				{
					index: "severineAbility2",
					name: "Quicken",
					description: "Unlocks Quicken. Draw a card for each lit Thirst orb.",
					x: 165,
					y: 50,
					cost: 300,
					abilityAdditionArray: [{ "index": "severineQuicken" }],
					requiresArray: ["severineU1", "severineU2", "severineRestA", "severineRestB"],
				},
				{
					index: "severineCex3",
					name: "Thin Skin",
					description: "While in the party, self-damage -1.",
					x: 55,
					y: 50,
					cost: 75,
					requiresArray: ["severineCex2"],
					selfDamageReduction: 1,
				},
				{
					index: "severineFort",
					name: "Fortitude",
					description: "Severine's Lust weaknesses never build, and Severine misses every Lust Event.",
					x: 10,
					y: 15,
					cost: 0,
					fortitude: true,
					//Free, with no prerequisite; `free` marks both as deliberate for audit-trees.js.
					free: true,
				},
				{
					index: "severineRest2",
					name: "Lay of the Land, Always",
					description: "Treatment stays unlocked even when Severine is benched.",
					x: 135,
					y: 50,
					cost: 300,
					requiresArray: ["severineDef1", "severineDef2", "severineDef3"],
					restOption: "treatment",
				},
				{
					index: "severineRestA",
					name: "Field Rations",
					description: "One more action when you reach a rest site.",
					x: 155,
					y: 15,
					cost: 150,
					exclusiveGroup: "severineRestPath",
					requiresArray: ["severineRest2"],
					restActionsBonus: 1,
				},
				{
					index: "severineRestB",
					name: "Sound Sleep",
					description: "Sleep heals an extra 15% of maximum health.",
					x: 155,
					y: 85,
					cost: 150,
					exclusiveGroup: "severineRestPath",
					requiresArray: ["severineRest2"],
					restHealBonus: true,
				},
				{
					index: "severineReroll2",
					name: "Second Chance, Always",
					description: "Adds 1 reroll to every run, whether or not Severine is in the party.",
					x: 140,
					y: 15,
					cost: 150,
					requiresArray: ["severineRest2"],
					rewardRerollAlways: 1,
				},
				{
					index: "severineBanish2",
					name: "Banish, Always",
					description: "Adds 1 banish to every run, whether or not Severine is in the party.",
					x: 140,
					y: 85,
					cost: 150,
					requiresArray: ["severineRest2"],
					rewardBanishAlways: 1,
				},
				{
					index: "severineTrimAttack",
					name: "Trim",
					description: "Remove a copy of Claw Flurry from the starting deck.",
					x: 35,
					y: 35,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "severineExtraAttack",
					cardRemovalArray: [{ "index": "severineRend", "count": 1 }],
					requiresArray: ["severineAbility1"],
				},
				{
					index: "severineTrimDefence",
					name: "Slim Down",
					description: "Remove a copy of Drain from the starting deck.",
					x: 35,
					y: 65,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "severineExtraDefence",
					cardRemovalArray: [{ "index": "severineQuaff", "count": 1 }],
					requiresArray: ["severineAbility1"],
				},
			],
		},
	},

	{
		index: "cassadora",
		name: "Cassadora",
		className: "Hexer",
		classIconPath: "icons/flame-blue",
		blurb: "I already know what you're going to do. Do something else.",
		description: "Cassadora averts disasters for a living. She looked through the futures, found a great many bad ones gathered around this dungeon, and walked in anyway. On the job she is all ceremony and portent; off it she is blunt. She knows what every enemy is about to do and makes sure they do not get to do it.",
		colorHint: "#5a9ae8",
		unlockedFromStart: true,
		tagArray: ["human", "woman", "trickster"],

		brokenCard: "cassadoraBroken",
		brokenArtPath: "characters/seer/broken",
		brokenBackgroundPath: "characters/vamp/brokenBG",
		brokenCutIn: true,
		recoverArtPath: "characters/seer/recover",
		//Measured off default/recover.webp, the upper-body picture: a third of its height, from
		//just above the eyes. See tuning.recoverOverlay.eyeWindow.
		recoverEyeWindow: { centreXPercent: 47, topPercent: 8, heightPercent: 32 },
		recoverBackgroundPath: "characters/vamp/recoverBG",

		artFolder: "seer",
		defaultOutfit: "default",
		startingEquipmentArray: ["crystalBall"],

		startingCardArray: [
			{ index: "cassadoraWispBolt", count: 2 },
			{ index: "cassadoraUnravel", count: 2 },
		],
		startingAbilityArray: [],

		outfitArray: [
			{
				index: "default",
				name: "Default",
				unlockedFromStart: true,
				randomCardCount: 3,
				personalExperienceMultiplier: 1.2,
				description: "Adds 3 random Cassadora cards at run start. +20% personal experience.",
			},

			//--- AUDIT-01: the three alts rebuilt to OUTFITS-LIST (deck manipulation / steal intents / debuffs) ---
			//Each A2 line reads the Orb (the "foresight" mechanic): its symbols are card types.
			{
				//PLAYER DECK MANIPULATION. The rare card finds her.
				index: "soothsayer",
				name: "Soothsayer",
				unlockedFromStart: true,
				archetype: "hex",
				healthModifier: 4,
				cardAdditionArray: [{ index: "cassadoraRead", count: 1 }],
				archetypeWeightArray: [{ archetype: "repertoire", multiplier: 3 }, { archetype: "hex", multiplier: 0.5 }],
				rarityWeightMultiplierArray: { rare: 2 },
				//"For each symbol in your orb, draw a card with a type matching that symbol."
				treeAbilityReplacementArray: [{ from: "cassadoraMagicTrick", to: "cassadoraSecondSight" }],
				description: "+4 Max HP. Adds Read. Rare cards are twice as likely in her random starting cards and her rewards. Magic Trick becomes Second Sight: for each symbol in her Orb, draw a card of that type. Offers more cards that look through her deck, fewer that curse enemies.",
			},
			{
				//STEAL INTENTS. What she takes, she keeps.
				index: "grifter",
				name: "Grifter",
				unlockedFromStart: true,
				archetype: "turncoat",
				healthModifier: -2,
				cardAdditionArray: [{ index: "cassadoraMisdirect", count: 1 }],
				//Boost steal / Turncoat (Turncoat, Repertoire).
				archetypeWeightArray: [{ archetype: "turncoat", multiplier: 3 }, { archetype: "repertoire", multiplier: 0.5 }],
				stolenCardsKept: true,
				//"If your orb is full of symbols, choose a card from your hand and erase it from your deck. The
				//erased card must be of a type that matches one of your orb's symbols."
				treeAbilityReplacementArray: [{ from: "cassadoraMagicTrick", to: "cassadoraVanishingAct" }],
				description: "-2 Max HP. Adds Misdirect. Cards Cassadora steals do not exhaust, and stay in the deck between fights. Magic Trick becomes Vanishing Act: with a full Orb, erase a card of one of its types from your deck. Offers more steal and Turncoat cards, fewer that look through her deck.",
			},
			{
				//ENEMY DEBUFF FOCUS. Every change of mind costs the enemy.
				index: "hedgeWitch",
				name: "Hedge Witch",
				unlockedFromStart: true,
				archetype: "hex",
				healthModifier: 6,
				cardAdditionArray: [{ index: "cassadoraIllWish", count: 1 }],
				//Reduce steal / Turncoat (Turncoat, Repertoire).
				archetypeWeightArray: [{ archetype: "hex", multiplier: 3 }, { archetype: "turncoat", multiplier: 0.5 }],
				rerollWeakStacks: 1,
				stolenCardsToDiscard: true,
				treeAbilityReplacementArray: [{ from: "cassadoraMagicTrick", to: "cassadoraHexStorm" }],
				hooks: {
					onIntentChanged: function (params) {
						if (params.wearer == null || params.source !== params.wearer || params.entity == null) return;
						if (params.entity.side == params.wearer.side) return;
						honeycomb.applyStatus(params.entity, "weak", params.definition.rerollWeakStacks, params.context);
					},
				},
				description: "+6 Max HP. Adds Jinx. Whenever Cassadora rerolls an enemy's intent, it gains 1 Weak. Stolen cards go to your discard pile, never your hand. Magic Trick becomes Hex Storm: for each symbol in her Orb, every enemy gains a random debuff. Offers more cards that curse enemies, fewer steal and Turncoat cards.",
			},
		],

		progressionTree: {
			backgroundPath: "progression/seer-tree",
			aspect: 16 / 9,
			nodeArray: [
				{
					index: "casAbility1",
					name: "Glimpse",
					description: "Unlocks Glimpse and Cassadora's Orb. Reroll one enemy intent. Once per rest.",
					x: 15,
					y: 50,
					cost: 150,
					abilityAdditionArray: [{ "index": "cassadoraGlimpse" }],
					requiresArray: ["casStart"],
				},
				{
					index: "casStart",
					name: "Vigour",
					description: "+5 Max HP per rank.",
					x: 5,
					y: 50,
					cost: 13,
					rankMaximum: 2,
					healthModifier: 5,
				},
				{
					index: "casAtt1",
					name: "Hex",
					description: "Wisplight: -2 damage and +1 Sundered per rank; at the last rank it deals no damage and reads as pure negative.",
					x: 105,
					y: 20,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "casAttPath",
					starterUpgradeArray: [{ "card": "cassadoraWispBolt", "effect": "damage", "amount": -2, "negativeIfZeroDamage": true }, { "card": "cassadoraWispBolt", "effect": "applyStatus", "status": "sundered", "stacks": 1 }],
					requiresArray: ["casGold"],
					previewCardArray: ["cassadoraWispBolt"],
				},
				{
					index: "casAtt3",
					name: "Twist",
					description: "Wisplight hits every enemy: deal 2 and apply 1 Sundered; the second rank removes the damage and applies 2 Sundered.",
					x: 105,
					y: 80,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "casAttPath",
					starterUpgradeArray: [{ "card": "cassadoraWispBolt", "targetMode": "allEnemies", "negativeIfZeroDamage": true, "replaceEffectArray": [{ "index": "damage", "amount": 4 }], "effect": "damage", "amount": -2, "addEffectArray": [{ "index": "applyStatus", "status": "sundered", "stacks": 1 }] }],
					requiresArray: ["casGold"],
					previewCardArray: ["cassadoraWispBolt"],
				},
				{
					index: "casDef3",
					name: "Refract",
					description: "Second Thoughts becomes: choose one - change an intent, or reroll all intents.",
					x: 125,
					y: 80,
					cost: 150,
					exclusiveGroup: "casDefPath",
					starterUpgradeArray: [{ "card": "cassadoraUnravel", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Change what?", "optionArray": [{ "index": "intent", "name": "Change", "description": "The enemy picks a new intent.", "effectArray": [{ "index": "rerollIntent" }] }, { "index": "refract", "name": "Refract", "description": "Every enemy picks a new intent.", "effectArray": [{ "index": "rerollIntent", "targetOverride": "allEnemies" }] }] }] }],
					requiresArray: ["casBoun2", "casBoun1"],
					previewCardArray: ["cassadoraUnravel"],
				},
				{
					index: "casDef1",
					name: "Wane",
					description: "Second Thoughts becomes: choose one - change an intent, or inflict Weak.",
					x: 125,
					y: 20,
					cost: 150,
					exclusiveGroup: "casDefPath",
					starterUpgradeArray: [{ "card": "cassadoraUnravel", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Change what?", "optionArray": [{ "index": "intent", "name": "Change", "description": "The enemy picks a new intent.", "effectArray": [{ "index": "rerollIntent" }] }, { "index": "weak", "name": "Wane", "description": "Inflict 2 Weak.", "effectArray": [{ "index": "applyStatus", "status": "weak", "stacks": 2 }] }] }] }],
					requiresArray: ["casBoun1", "casBoun2"],
					previewCardArray: ["cassadoraUnravel"],
				},
				{
					index: "casAtt2",
					name: "Nail",
					description: "Wisplight: +1 damage per unique negative on the target, per rank.",
					x: 105,
					y: 50,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "casAttPath",
					starterUpgradeArray: [{ "card": "cassadoraWispBolt", "addEffectArray": [{ "index": "damage", "amount": { "index": "debuffCount", "of": "target" } }] }],
					requiresArray: ["casGold"],
					previewCardArray: ["cassadoraWispBolt"],
				},
				{
					index: "casU1",
					name: "Sister Wardrobe",
					description: "While in the party, Cassadora's worn outfit adds twice as many cards.",
					x: 150,
					y: 35,
					cost: 150,
					exclusiveGroup: "casOutfitPath",
					requiresArray: ["casRest2"],
					outfitCardDoubling: true,
				},
				{
					index: "casWheel1",
					name: "Turnabout",
					description: "Glimpse becomes: shuffle an enemy intent into your discard; it costs 2 this combat.",
					x: 175,
					y: 20,
					cost: 150,
					exclusiveGroup: "casWheelPath",
					requiresArray: ["casAbility2"],
					abilityUpgradeArray: [{ "ability": "cassadoraGlimpse", "disableMechanic": true, "effectArray": [{ "index": "stealIntent", "pile": "discardPile", "cost": { "energy": 2 } }] }],
				},
				{
					index: "casWheel2",
					name: "Predict Offense",
					description: "Glimpse becomes: discard a card, draw a card per attacking enemy.",
					x: 175,
					y: 50,
					cost: 150,
					exclusiveGroup: "casWheelPath",
					requiresArray: ["casAbility2"],
					abilityUpgradeArray: [{ "ability": "cassadoraGlimpse", "disableMechanic": true, "targetMode": "owner", "text": "Discard a card. Draw a card for each enemy intending to attack.", "effectArray": [{ "index": "chooseCards", "from": "handCard", "prompt": "Discard which card?", "effectArray": [{ "index": "discardCard" }] }, { "index": "drawCards", "amount": { "index": "attackingOpponents" } }] }],
				},
				{
					index: "casWheel3",
					name: "Mind Control",
					description: "Glimpse becomes: discard a card, an enemy gains 1 Turncoat.",
					x: 175,
					y: 80,
					cost: 150,
					exclusiveGroup: "casWheelPath",
					requiresArray: ["casAbility2"],
					abilityUpgradeArray: [{ "ability": "cassadoraGlimpse", "disableMechanic": true, "effectArray": [{ "index": "chooseCards", "from": "handCard", "prompt": "Discard which card?", "effectArray": [{ "index": "discardCard" }] }, { "index": "applyStatus", "status": "turncoat", "stacks": 1 }] }],
				},
				{
					index: "casExtraAttack",
					name: "Extra Copy",
					description: "Add a second copy of Wisplight to the starting deck.",
					x: 25,
					y: 15,
					cost: 150,
					exclusiveGroup: "casExtraAttack",
					cardAdditionArray: [{ "index": "cassadoraWispBolt", "count": 1 }],
					requiresArray: ["casAbility1"],
				},
				{
					index: "casReplaceAttack",
					name: "Retrain",
					description: "At run start, one Wisplight becomes a random common of Cassadora.",
					x: 40,
					y: 15,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "cassadoraWispBolt", "rarity": "common", "count": 1 }],
					requiresArray: ["casExtraAttack"],
				},
				{
					index: "casExtraDefence",
					name: "Extra Guard",
					description: "Add a second copy of Second Thoughts to the starting deck.",
					x: 25,
					y: 85,
					cost: 150,
					exclusiveGroup: "casExtraDefence",
					cardAdditionArray: [{ "index": "cassadoraUnravel", "count": 1 }],
					requiresArray: ["casAbility1"],
				},
				{
					index: "casReplaceDefence",
					name: "Relearn",
					description: "At run start, one Second Thoughts becomes a random common of Cassadora.",
					x: 40,
					y: 85,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "cassadoraUnravel", "rarity": "common", "count": 1 }],
					requiresArray: ["casExtraDefence"],
				},
				{
					index: "casCex1",
					name: "Studied Foe",
					description: "Unlock an enemy's movelist after first encountering it.",
					x: 35,
					y: 50,
					cost: 75,
					requiresArray: ["casAbility1"],
					enemyMovelistUnlock: true,
				},
				{
					index: "casU2",
					name: "Tailored",
					description: "While in the party, Cassadora's worn outfit cards start upgraded.",
					x: 150,
					y: 65,
					cost: 300,
					exclusiveGroup: "casOutfitPath",
					requiresArray: ["casRest2"],
					outfitCardUpgrade: true,
				},
				{
					index: "casCex2",
					name: "Tidy",
					description: "While in the party, the first junk card each combat exhausts.",
					x: 45,
					y: 50,
					cost: 75,
					requiresArray: ["casCex1"],
					firstJunkExhausts: true,
				},
				{
					index: "casRest1",
					name: "Lay of the Land",
					description: "Unlocks Fortune Telling at rest sites while Cassadora is in the party.",
					x: 75,
					y: 50,
					cost: 150,
					requiresArray: ["casCex3"],
					restOption: "fortuneTelling",
				},
				{
					index: "casXp",
					name: "Veteran",
					description: "While in the party, gain 1.5x personal experience.",
					x: 50,
					y: 15,
					cost: 75,
					personalExperienceMultiplier: 1.5,
					requiresArray: ["casCex1"],
				},
				{
					index: "casCol",
					name: "Collector",
					description: "While in the party, unseen events and items appear 50% more often.",
					x: 50,
					y: 85,
					cost: 75,
					requiresArray: ["casCex1"],
					collectorWeight: 0.5,
				},
				{
					index: "casNew",
					name: "New Blood",
					description: "While in the party, Cassadora's unseen cards appear 50% more often.",
					x: 60,
					y: 85,
					cost: 75,
					requiresArray: ["casCex2"],
					unseenCardWeight: 0.5,
				},
				{
					index: "casCheap",
					name: "Window Shopping",
					description: "While in the party, outfits and common relics cost 10% less in the shop.",
					x: 60,
					y: 15,
					cost: 75,
					requiresArray: ["casCex2"],
					unlockDiscount: 0.1,
				},
				{
					index: "casReroll1",
					name: "Second Chance",
					description: "One reward reroll per run while in the party.",
					x: 70,
					y: 15,
					cost: 150,
					requiresArray: ["casCex3"],
					rewardReroll: 1,
				},
				{
					index: "casBanish1",
					name: "Banish",
					description: "Banish one card from this run's reward, shop and journal pools while in the party.",
					x: 70,
					y: 85,
					cost: 300,
					requiresArray: ["casCex3"],
					rewardBanish: 1,
				},
				{
					index: "casGold",
					name: "Deep Pockets",
					description: "While in the party, +5 gold at run start per rank.",
					x: 90,
					y: 50,
					cost: 50,
					rankMaximum: 3,
					startingGold: 5,
					requiresArray: ["casShop1", "casShop2"],
				},
				{
					index: "casDef2",
					name: "Foresee",
					description: "Second Thoughts becomes: choose one - change an intent, or rearrange the top 3 of the deck.",
					x: 125,
					y: 50,
					cost: 150,
					exclusiveGroup: "casDefPath",
					starterUpgradeArray: [{ "card": "cassadoraUnravel", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Change what?", "optionArray": [{ "index": "intent", "name": "Change", "description": "The enemy picks a new intent.", "effectArray": [{ "index": "rerollIntent" }] }, { "index": "scry", "name": "Foresee", "description": "Scry 3.", "effectArray": [{ "index": "scry", "count": 3 }] }] }] }],
					requiresArray: ["casBoun1", "casBoun2"],
					previewCardArray: ["cassadoraUnravel"],
				},
				{
					index: "casOpenD",
					name: "Head Start",
					description: "While in the party, turn 1: +1 card drawn, -1 energy.",
					x: 95,
					y: 15,
					cost: 150,
					exclusiveGroup: "casOpenPath",
					requiresArray: ["casGold"],
					openingDrawBonus: 1,
					openingEnergyBonus: -1,
				},
				{
					index: "casOpenE",
					name: "Fast Start",
					description: "While in the party, turn 1: +1 energy, -1 card drawn.",
					x: 95,
					y: 85,
					cost: 150,
					exclusiveGroup: "casOpenPath",
					requiresArray: ["casGold"],
					openingDrawBonus: -1,
					openingEnergyBonus: 1,
				},
				{
					index: "casBoun1",
					name: "Plunder",
					description: "While in the party, bosses and elites pay 25% more gold.",
					x: 115,
					y: 35,
					cost: 150,
					exclusiveGroup: "casBounPath",
					requiresArray: ["casAtt1", "casAtt2", "casAtt3"],
					bountyGoldMultiplier: 0.25,
				},
				{
					index: "casBoun2",
					name: "Spoils",
					description: "While in the party, bosses and elites offer 1 extra card choice.",
					x: 115,
					y: 65,
					cost: 150,
					exclusiveGroup: "casBounPath",
					requiresArray: ["casAtt2", "casAtt3", "casAtt1"],
					bountyCardChoiceBonus: 1,
				},
				{
					index: "casShop1",
					name: "Haggler",
					description: "While in the party, cards cost 10% less in the shop.",
					x: 80,
					y: 15,
					cost: 150,
					exclusiveGroup: "casShopPath",
					requiresArray: ["casRest1"],
					shopCardDiscount: 0.1,
				},
				{
					index: "casShop2",
					name: "Wider Shelves",
					description: "While in the party, the shop offers 1 more card and 1 more relic option.",
					x: 80,
					y: 85,
					cost: 150,
					exclusiveGroup: "casShopPath",
					requiresArray: ["casRest1"],
					shopExtraSlots: 1,
				},
				{
					index: "casAbility2",
					name: "Magic Trick",
					description: "Unlocks Magic Trick. Add random enemy-deck cards to hand, one per orb symbol; they exhaust. Once per rest.",
					x: 165,
					y: 50,
					cost: 300,
					abilityAdditionArray: [{ "index": "cassadoraMagicTrick" }],
					requiresArray: ["casU1", "casU2", "casRestA", "casRestB"],
				},
				{
					index: "casCex3",
					name: "Investment",
					description: "While in the party, +2 gold per unspent energy at combat end.",
					x: 55,
					y: 50,
					cost: 75,
					requiresArray: ["casCex2"],
					unspentEnergyGold: 2,
				},
				{
					index: "casFort",
					name: "Fortitude",
					description: "Cassadora's Lust weaknesses never build, and Cassadora misses every Lust Event.",
					x: 10,
					y: 15,
					cost: 0,
					fortitude: true,
					//Free, with no prerequisite; `free` marks both as deliberate for audit-trees.js.
					free: true,
				},
				{
					index: "casRest2",
					name: "Lay of the Land, Always",
					description: "Fortune Telling stays unlocked even when Cassadora is benched.",
					x: 135,
					y: 50,
					cost: 300,
					requiresArray: ["casDef1", "casDef2", "casDef3"],
					restOption: "fortuneTelling",
				},
				{
					index: "casRestA",
					name: "Field Rations",
					description: "One more action when you reach a rest site.",
					x: 155,
					y: 15,
					cost: 150,
					exclusiveGroup: "casRestPath",
					requiresArray: ["casRest2"],
					restActionsBonus: 1,
				},
				{
					index: "casRestB",
					name: "Sound Sleep",
					description: "Sleep heals an extra 15% of maximum health.",
					x: 155,
					y: 85,
					cost: 150,
					exclusiveGroup: "casRestPath",
					requiresArray: ["casRest2"],
					restHealBonus: true,
				},
				{
					index: "casReroll2",
					name: "Second Chance, Always",
					description: "Adds 1 reroll to every run, whether or not Cassadora is in the party.",
					x: 140,
					y: 15,
					cost: 150,
					requiresArray: ["casRest2"],
					rewardRerollAlways: 1,
				},
				{
					index: "casBanish2",
					name: "Banish, Always",
					description: "Adds 1 banish to every run, whether or not Cassadora is in the party.",
					x: 140,
					y: 85,
					cost: 150,
					requiresArray: ["casRest2"],
					rewardBanishAlways: 1,
				},
				{
					index: "casTrimAttack",
					name: "Trim",
					description: "Remove a copy of Wisplight from the starting deck.",
					x: 35,
					y: 35,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "casExtraAttack",
					cardRemovalArray: [{ "index": "cassadoraWispBolt", "count": 1 }],
					requiresArray: ["casAbility1"],
				},
				{
					index: "casTrimDefence",
					name: "Slim Down",
					description: "Remove a copy of Second Thoughts from the starting deck.",
					x: 35,
					y: 65,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "casExtraDefence",
					cardRemovalArray: [{ "index": "cassadoraUnravel", "count": 1 }],
					requiresArray: ["casAbility1"],
				},
			],
		},
	},

	{
		index: "cinder",
		name: "Cinder",
		className: "Lancer",
		classIconPath: "icons/fire",
		blurb: "Reach is a matter of where you start.",
		description: "Cinder is as good as she says she is, which is most of the problem. Nothing has ever seriously beaten her, so when something does she drills against it until it cannot. She has never turned down a dare. She fights from anywhere in the line, and the further she has to come, the harder she lands.",
		colorHint: "#e0603a",
		unlockedFromStart: true,
		tagArray: ["human", "woman", "striker"],

		brokenCard: "cinderBroken",
		brokenArtPath: "characters/lancer/broken",
		brokenBackgroundPath: "characters/knight/brokenBG",
		brokenCutIn: true,
		recoverArtPath: "characters/lancer/recover",
		//Measured off default/recover.webp, the upper-body picture: a third of its height, from
		//just above the eyes. See tuning.recoverOverlay.eyeWindow.
		recoverEyeWindow: { centreXPercent: 50, topPercent: 18, heightPercent: 32 },
		recoverBackgroundPath: "characters/knight/recoverBG",

		artFolder: "lancer",
		defaultOutfit: "default",
		startingEquipmentArray: ["luckyHat"],

		//HER ATTACKS DO NOT MOVE HER. A spear reaches from the back, so every step she takes is one a card
		//chose -- which is what makes a step worth counting.
		partyShiftByCardType: { damage: "none" },

		startingCardArray: [
			{ index: "cinderImpale", count: 2 },
			{ index: "cinderSwitch", count: 2 },
		],
		startingAbilityArray: [],

		outfitArray: [
			{
				index: "default",
				name: "Default",
				unlockedFromStart: true,
				randomCardCount: 3,
				personalExperienceMultiplier: 1.2,
				description: "Adds 3 random Cinder cards at run start. +20% personal experience.",
			},

			//--- AUDIT-01: the three alts rebuilt to OUTFITS-LIST (pure damage / support allies / debuffs to boons) ---
			{
				//PURE DAMAGE, LESS MOVEMENT. Backflip stops moving her and starts cycling the hand.
				index: "vanguardPlume",
				name: "Vanguard Plume",
				unlockedFromStart: true,
				archetype: "charge",
				healthModifier: -4,
				cardAdditionArray: [{ index: "cinderRush", count: 1 }],
				//Boost high-damage frontline (Charge); reduce ally-move (Formation).
				archetypeWeightArray: [{ archetype: "charge", multiplier: 3 }, { archetype: "formation", multiplier: 0.5 }],
				abilityUpgradeArray: [{ ability: "cinderBackflip", chargeMaximum: 3, rechargeAmount: 3,
					text: "Exhaust a card from your hand. Draw a card. Three times per fight.",
					effectArray: [{ index: "chooseCards", from: "handCard", prompt: "Exhaust which card?", effectArray: [{ index: "exhaustCard" }] },
						{ index: "drawCards", amount: 1 }] }],
				treeAbilityReplacementArray: [{ from: "cinderPhoenixDive", to: "cinderPhoenixDiveStrength" }],
				description: "-4 Max HP. Adds Rush. Backflip no longer moves Cinder: it exhausts a card to draw a card, three times per fight. Phoenix Dive becomes Plumefall, which spends Strength instead of Stride. Offers more heavy frontline attacks, fewer cards that move allies.",
			},
			{
				//SUPPORT ALLIES. Everyone else hits harder; she hits softer.
				index: "marshal",
				name: "Marshal",
				unlockedFromStart: true,
				archetype: "formation",
				healthModifier: 8,
				tagAdditionArray: ["support"],
				cardAdditionArray: [{ index: "cinderGoldStandard", count: 1 }],
				//Boost ally-move (Formation). Self-debuff cards have no archetype yet.
				archetypeWeightArray: [{ archetype: "formation", multiplier: 3 }, { archetype: "ashfall", multiplier: 0.5 }],
				allyAttackBonus: 1,
				ownDamageMultiplier: 0.5,
				treeAbilityReplacementArray: [{ from: "cinderPhoenixDive", to: "cinderMarshalsCall" }],
				hooks: {
					modifyDamageDealt: function (amount, params) {
						if (params.entry != null && params.entry.ignoresStrength == true) return amount;
						return amount * params.definition.ownDamageMultiplier;
					},
				},
				description: "+8 Max HP. Adds Gold Standard. Other allies' attacks deal 1 more damage; Cinder's own damage is halved. Phoenix Dive becomes Marshal's Call: spend all Stride, move another ally to the front, they gain that much Strength this turn. Offers more cards that move allies, fewer that hurt Cinder for power.",
			},
			{
				//DEBUFFS TO BOONS. Every hit sends her to the back, where the debuffs pile up.
				index: "ashfall",
				name: "Ashfall",
				unlockedFromStart: true,
				archetype: "charge",
				healthModifier: -2,
				cardAdditionArray: [{ index: "cinderRecede", count: 1 }],
				partyShiftByCardType: { damage: "back" },
				//Reduce high-damage frontline (Charge). Self-debuff cards have no archetype yet.
				archetypeWeightArray: [{ archetype: "ashfall", multiplier: 3 }, { archetype: "charge", multiplier: 0.5 }],
				treeAbilityReplacementArray: [{ from: "cinderPhoenixDive", to: "cinderScorchedEarth" }],
				description: "-2 Max HP. Adds Recede. Cinder's attacks move her to the back of the party instead of the front. Phoenix Dive becomes Scorched Earth: spend all Stride, discard your hand, deal the Stride spent once for each card discarded. Offers more cards that hurt Cinder for power, fewer heavy frontline attacks.",
			},
		],

		progressionTree: {
			backgroundPath: "progression/lancer-tree",
			aspect: 16 / 9,
			nodeArray: [
				{
					index: "cinAbility1",
					name: "Backflip",
					description: "Unlocks Backflip and Cinder's Stride. Move to the back. Once per combat.",
					x: 15,
					y: 50,
					cost: 150,
					abilityAdditionArray: [{ "index": "cinderBackflip" }],
					requiresArray: ["cinStart"],
				},
				{
					index: "cinStart",
					name: "Vigour",
					description: "+5 Max HP per rank.",
					x: 5,
					y: 50,
					cost: 8,
					rankMaximum: 3,
					healthModifier: 5,
				},
				{
					index: "cinAtt1",
					name: "Plant",
					description: "Lance Thrust deals 9 and does not change position.",
					x: 105,
					y: 20,
					cost: 150,
					exclusiveGroup: "cinAttPath",
					starterUpgradeArray: [{ "card": "cinderImpale", "partyShift": "none" }],
					requiresArray: ["cinGold"],
					previewCardArray: ["cinderImpale"],
				},
				{
					index: "cinAtt3",
					name: "Step",
					description: "Lance Thrust deals 6, +3 if already in front.",
					x: 105,
					y: 80,
					cost: 150,
					exclusiveGroup: "cinAttPath",
					starterUpgradeArray: [{ "card": "cinderImpale", "effect": "damage", "amount": -3 }, { "card": "cinderImpale", "addEffectArray": [{ "index": "damage", "amount": 3, "condition": { "index": "atRank", "of": "source", "rank": 0 } }] }],
					requiresArray: ["cinGold"],
					previewCardArray: ["cinderImpale"],
				},
				{
					index: "cinAtt2",
					name: "Reckless",
					description: "Lance Thrust deals 12, and Cinder gains 3 Sundered.",
					x: 105,
					y: 50,
					cost: 150,
					exclusiveGroup: "cinAttPath",
					starterUpgradeArray: [{ "card": "cinderImpale", "effect": "damage", "amount": 3 }, { "card": "cinderImpale", "addEffectArray": [{ "index": "applyStatus", "status": "sundered", "stacks": 2, "targetOverride": "owner" }] }],
					requiresArray: ["cinGold"],
					previewCardArray: ["cinderImpale"],
				},
				{
					index: "cinU1",
					name: "Sister Wardrobe",
					description: "While in the party, Cinder's worn outfit adds twice as many cards.",
					x: 150,
					y: 35,
					cost: 150,
					exclusiveGroup: "cinOutfitPath",
					requiresArray: ["cinRest2"],
					outfitCardDoubling: true,
				},
				{
					index: "cinWheel1",
					name: "Momentum",
					description: "Backflip becomes: spend 3 Stride, draw 2.",
					x: 175,
					y: 20,
					cost: 150,
					exclusiveGroup: "cinWheelPath",
					requiresArray: ["cinAbility2"],
					abilityUpgradeArray: [{ "ability": "cinderBackflip", "disableMechanic": true, "requirementArray": [{ "condition": { "index": "mechanicAtLeast", "mechanic": "stride", "amount": 3 }, "text": "Needs 3 Stride." }], "effectArray": [{ "index": "spendMechanic", "mechanic": "stride", "amount": 3 }, { "index": "drawCards", "amount": 2 }] }],
				},
				{
					index: "cinWheel2",
					name: "Catch Breath",
					description: "Backflip becomes: spend 3 Stride, remove all Sundered.",
					x: 175,
					y: 50,
					cost: 150,
					exclusiveGroup: "cinWheelPath",
					requiresArray: ["cinAbility2"],
					abilityUpgradeArray: [{ "ability": "cinderBackflip", "disableMechanic": true, "requirementArray": [{ "condition": { "index": "mechanicAtLeast", "mechanic": "stride", "amount": 3 }, "text": "Needs 3 Stride." }], "effectArray": [{ "index": "spendMechanic", "mechanic": "stride", "amount": 3 }, { "index": "removeStatus", "status": "sundered", "targetOverride": "owner" }] }],
				},
				{
					index: "cinWheel3",
					name: "Lance",
					description: "Backflip becomes: spend 3 Stride, if in front deal 9.",
					x: 175,
					y: 80,
					cost: 150,
					exclusiveGroup: "cinWheelPath",
					requiresArray: ["cinAbility2"],
					abilityUpgradeArray: [{ "ability": "cinderBackflip", "disableMechanic": true, "targetMode": "enemy", "requirementArray": [{ "condition": { "index": "mechanicAtLeast", "mechanic": "stride", "amount": 3 }, "text": "Needs 3 Stride." }], "text": "Spend 3 Stride. If Cinder is at the front, deal 9 damage.", "effectArray": [{ "index": "spendMechanic", "mechanic": "stride", "amount": 3 }, { "index": "damage", "amount": 9, "condition": { "index": "atRank", "of": "source", "rank": 0 } }] }],
				},
				{
					index: "cinExtraAttack",
					name: "Extra Copy",
					description: "Add a second copy of Lance Thrust to the starting deck.",
					x: 25,
					y: 15,
					cost: 150,
					exclusiveGroup: "cinExtraAttack",
					cardAdditionArray: [{ "index": "cinderImpale", "count": 1 }],
					requiresArray: ["cinAbility1"],
				},
				{
					index: "cinReplaceAttack",
					name: "Retrain",
					description: "At run start, one Lance Thrust becomes a random common of Cinder.",
					x: 40,
					y: 15,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "cinderImpale", "rarity": "common", "count": 1 }],
					requiresArray: ["cinExtraAttack"],
				},
				{
					index: "cinExtraDefence",
					name: "Extra Guard",
					description: "Add a second copy of Change Places to the starting deck.",
					x: 25,
					y: 85,
					cost: 150,
					exclusiveGroup: "cinExtraDefence",
					cardAdditionArray: [{ "index": "cinderSwitch", "count": 1 }],
					requiresArray: ["cinAbility1"],
				},
				{
					index: "cinReplaceDefence",
					name: "Relearn",
					description: "At run start, one Change Places becomes a random common of Cinder.",
					x: 40,
					y: 85,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "cinderSwitch", "rarity": "common", "count": 1 }],
					requiresArray: ["cinExtraDefence"],
				},
				{
					index: "cinCex1",
					name: "Drilled",
					description: "While in the party, when Cinder moves to the front, gain 4 Temporary HP.",
					x: 35,
					y: 50,
					cost: 75,
					hooks: { "onPartyShifted": function (params) {
					if (params.wearer == null || params.entity !== params.wearer) return;
					if (params.toRank !== 0) return;
					honeycomb.grantTemporaryHealth(params.wearer, 4, params.context);
				} },
					requiresArray: ["cinAbility1"],
				},
				{
					index: "cinU2",
					name: "Tailored",
					description: "While in the party, Cinder's worn outfit cards start upgraded.",
					x: 150,
					y: 65,
					cost: 300,
					exclusiveGroup: "cinOutfitPath",
					requiresArray: ["cinRest2"],
					outfitCardUpgrade: true,
				},
				{
					index: "cinCex2",
					name: "Soothing",
					description: "While in the party, when resting, reduce Lust equal to HP gained.",
					x: 45,
					y: 50,
					cost: 75,
					requiresArray: ["cinCex1"],
					restSoothe: true,
				},
				{
					index: "cinRest1",
					name: "Lay of the Land",
					description: "Unlocks Scavenge at rest sites while Cinder is in the party.",
					x: 75,
					y: 50,
					cost: 150,
					requiresArray: ["cinCex3"],
					restOption: "scavenge",
				},
				{
					index: "cinXp",
					name: "Veteran",
					description: "While in the party, gain 1.5x personal experience.",
					x: 50,
					y: 15,
					cost: 75,
					personalExperienceMultiplier: 1.5,
					requiresArray: ["cinCex1"],
				},
				{
					index: "cinCol",
					name: "Collector",
					description: "While in the party, unseen events and items appear 50% more often.",
					x: 50,
					y: 85,
					cost: 75,
					requiresArray: ["cinCex1"],
					collectorWeight: 0.5,
				},
				{
					index: "cinNew",
					name: "New Blood",
					description: "While in the party, Cinder's unseen cards appear 50% more often.",
					x: 60,
					y: 85,
					cost: 75,
					requiresArray: ["cinCex2"],
					unseenCardWeight: 0.5,
				},
				{
					index: "cinCheap",
					name: "Window Shopping",
					description: "While in the party, outfits and common relics cost 10% less in the shop.",
					x: 60,
					y: 15,
					cost: 75,
					requiresArray: ["cinCex2"],
					unlockDiscount: 0.1,
				},
				{
					index: "cinReroll1",
					name: "Second Chance",
					description: "One reward reroll per run while in the party.",
					x: 70,
					y: 15,
					cost: 150,
					requiresArray: ["cinCex3"],
					rewardReroll: 1,
				},
				{
					index: "cinBanish1",
					name: "Banish",
					description: "Banish one card from this run's reward, shop and journal pools while in the party.",
					x: 70,
					y: 85,
					cost: 300,
					requiresArray: ["cinCex3"],
					rewardBanish: 1,
				},
				{
					index: "cinGold",
					name: "Deep Pockets",
					description: "While in the party, +5 gold at run start per rank.",
					x: 90,
					y: 50,
					cost: 50,
					rankMaximum: 3,
					startingGold: 5,
					requiresArray: ["cinShop1", "cinShop2"],
				},
				{
					index: "cinDef2",
					name: "Reversal",
					description: "Change Places becomes: whoever moves forward gains 4 Temporary HP; whoever moves back strips 1 Weak and 1 Sundered.",
					x: 125,
					y: 50,
					cost: 150,
					starterUpgradeArray: [{ "card": "cinderSwitch", "text": "Swap places with an ally. Whoever moves forward gains 4 Temporary HP; whoever moves back loses 1 Weak and 1 Sundered.", "replaceEffectArray": [{ "index": "swapParty", "backEffectArray": [{ "index": "removeStatus", "status": "weak", "stacks": 1 }, { "index": "removeStatus", "status": "sundered", "stacks": 1 }] }, { "index": "temporaryHealth", "amount": 4, "targetOverride": "frontAlly" }] }],
					requiresArray: ["cinBoun1", "cinBoun2"],
					previewCardArray: ["cinderSwitch"],
				},
				{
					index: "cinOpenD",
					name: "Head Start",
					description: "While in the party, turn 1: +1 card drawn, -1 energy.",
					x: 95,
					y: 15,
					cost: 150,
					exclusiveGroup: "cinOpenPath",
					requiresArray: ["cinGold"],
					openingDrawBonus: 1,
					openingEnergyBonus: -1,
				},
				{
					index: "cinOpenE",
					name: "Fast Start",
					description: "While in the party, turn 1: +1 energy, -1 card drawn.",
					x: 95,
					y: 85,
					cost: 150,
					exclusiveGroup: "cinOpenPath",
					requiresArray: ["cinGold"],
					openingDrawBonus: -1,
					openingEnergyBonus: 1,
				},
				{
					index: "cinBoun1",
					name: "Plunder",
					description: "While in the party, bosses and elites pay 25% more gold.",
					x: 115,
					y: 35,
					cost: 150,
					exclusiveGroup: "cinBounPath",
					requiresArray: ["cinAtt1", "cinAtt2", "cinAtt3"],
					bountyGoldMultiplier: 0.25,
				},
				{
					index: "cinBoun2",
					name: "Spoils",
					description: "While in the party, bosses and elites offer 1 extra card choice.",
					x: 115,
					y: 65,
					cost: 150,
					exclusiveGroup: "cinBounPath",
					requiresArray: ["cinAtt2", "cinAtt3", "cinAtt1"],
					bountyCardChoiceBonus: 1,
				},
				{
					index: "cinShop1",
					name: "Haggler",
					description: "While in the party, cards cost 10% less in the shop.",
					x: 80,
					y: 15,
					cost: 150,
					exclusiveGroup: "cinShopPath",
					requiresArray: ["cinRest1"],
					shopCardDiscount: 0.1,
				},
				{
					index: "cinShop2",
					name: "Wider Shelves",
					description: "While in the party, the shop offers 1 more card and 1 more relic option.",
					x: 80,
					y: 85,
					cost: 150,
					exclusiveGroup: "cinShopPath",
					requiresArray: ["cinRest1"],
					shopExtraSlots: 1,
				},
				{
					index: "cinAbility2",
					name: "Phoenix Dive",
					description: "Unlocks Phoenix Dive. Spend all Stride, move to the front, then deal 9 plus the Stride spent per rank crossed.",
					x: 165,
					y: 50,
					cost: 300,
					abilityAdditionArray: [{ "index": "cinderPhoenixDive" }],
					requiresArray: ["cinU1", "cinU2", "cinRestA", "cinRestB"],
				},
				{
					index: "cinCex3",
					name: "Recover",
					description: "While in the party, when Cinder recovers from Broken, heal 10.",
					x: 55,
					y: 50,
					cost: 75,
					requiresArray: ["cinCex2"],
					recoverHeal: 10,
				},
				{
					index: "cinFort",
					name: "Fortitude",
					description: "Cinder's Lust weaknesses never build, and Cinder misses every Lust Event.",
					x: 10,
					y: 15,
					cost: 0,
					fortitude: true,
					//Free, with no prerequisite; `free` marks both as deliberate for audit-trees.js.
					free: true,
				},
				{
					index: "cinRest2",
					name: "Lay of the Land, Always",
					description: "Scavenge stays unlocked even when Cinder is benched.",
					x: 135,
					y: 50,
					cost: 300,
					requiresArray: ["cinDef2"],
					restOption: "scavenge",
				},
				{
					index: "cinRestA",
					name: "Field Rations",
					description: "One more action when you reach a rest site.",
					x: 155,
					y: 15,
					cost: 150,
					exclusiveGroup: "cinRestPath",
					requiresArray: ["cinRest2"],
					restActionsBonus: 1,
				},
				{
					index: "cinRestB",
					name: "Sound Sleep",
					description: "Sleep heals an extra 15% of maximum health.",
					x: 155,
					y: 85,
					cost: 150,
					exclusiveGroup: "cinRestPath",
					requiresArray: ["cinRest2"],
					restHealBonus: true,
				},
				{
					index: "cinReroll2",
					name: "Second Chance, Always",
					description: "Adds 1 reroll to every run, whether or not Cinder is in the party.",
					x: 140,
					y: 15,
					cost: 150,
					requiresArray: ["cinRest2"],
					rewardRerollAlways: 1,
				},
				{
					index: "cinBanish2",
					name: "Banish, Always",
					description: "Adds 1 banish to every run, whether or not Cinder is in the party.",
					x: 140,
					y: 85,
					cost: 150,
					requiresArray: ["cinRest2"],
					rewardBanishAlways: 1,
				},
				{
					index: "cinTrimAttack",
					name: "Trim",
					description: "Remove a copy of Lance Thrust from the starting deck.",
					x: 35,
					y: 35,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "cinExtraAttack",
					cardRemovalArray: [{ "index": "cinderImpale", "count": 1 }],
					requiresArray: ["cinAbility1"],
				},
				{
					index: "cinTrimDefence",
					name: "Slim Down",
					description: "Remove a copy of Change Places from the starting deck.",
					x: 35,
					y: 65,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "cinExtraDefence",
					cardRemovalArray: [{ "index": "cinderSwitch", "count": 1 }],
					requiresArray: ["cinAbility1"],
				},
			],
		},
	},

	{
		index: "clemence",
		name: "Clemence",
		className: "Confessor",
		classIconPath: "icons/wings-halo",
		blurb: "Let it all out. I'll hold it until I can't.",
		description: "Clemence believes that sinning is part of being human, and that being human means being made in God's image, so there is very little she thinks is actually wrong. She is calm and warm and entirely sincere about it. She heals the party, feeds it energy and cards, and takes the price in Lust herself. She is not trying to avoid Breaking. She is aiming at it.",
		colorHint: "#e8c8a0",
		unlockedFromStart: true,
		tagArray: ["human", "woman", "support"],

		//Every card of hers names its OWN broken counterpart, so this is only the fallback.
		brokenCard: "clemenceBroken",
		brokenArtPath: "characters/priest/broken",
		brokenBackgroundPath: "characters/necro/brokenBG",
		brokenCutIn: true,
		//HER BREAKING IS NOT A DEFEAT. Her cut-in opens on a choir, and her picture is drawn a
		//fifth larger than anyone else's so the difference reads at a glance.
		brokenStartSound: "magicHolyChoir",
		brokenScaleMultiplier: 1.2,
		recoverArtPath: "characters/priest/recover",
		//Measured off default/recover.webp, the upper-body picture: a third of its height, from
		//just above the eyes. See tuning.recoverOverlay.eyeWindow.
		recoverEyeWindow: { centreXPercent: 50, topPercent: 6, heightPercent: 32 },
		recoverBackgroundPath: "characters/necro/recoverBG",

		artFolder: "priest",
		defaultOutfit: "default",
		startingEquipmentArray: ["votiveCandle"],

		//No attacks at all.
		startingCardArray: [
			{ index: "clemenceTempt", count: 2 },
			{ index: "clemenceGrant", count: 2 },
		],
		startingAbilityArray: [],

		outfitArray: [
			{
				index: "default",
				name: "Default",
				unlockedFromStart: true,
				randomCardCount: 3,
				personalExperienceMultiplier: 1.2,
				description: "Adds 3 random Clemence cards at run start. +20% personal experience.",
			},

			//--- AUDIT-01: the three alts rebuilt to OUTFITS-LIST (healing / rushing to break / breaking allies) ---
			{
				//HEALING, MAKE BREAKING DIFFICULT. Nothing she does to herself counts.
				index: "devotee",
				name: "Devotee",
				unlockedFromStart: true,
				archetype: "devotion",
				healthModifier: 6,
				cardAdditionArray: [{ index: "clemenceBlessedPain", count: 1 }],
				//Boost healing (Devotion); reduce self-Lust (Rapture). The pool rework will re-cut these.
				archetypeWeightArray: [{ archetype: "devotion", multiplier: 3 }, { archetype: "rapture", multiplier: 0.5 }],
				treeAbilityReplacementArray: [{ from: "clemenceOneWithNothing", to: "clemenceConsecration" }],
				hooks: {
					modifyLustGained: function (amount, params) {
						return params.source != null && params.source === params.entity ? 0 : amount;
					},
				},
				description: "+6 Max HP. Adds Blessed Pain. Clemence gains no Lust from her own cards and abilities. One with Nothing becomes Consecration: spend all Devotion, split that much Temporary HP across your other allies. Offers more cards that shield the party, fewer that give her Lust.",
			},
			{
				//RUSHING TOWARDS SELF-BREAK. Nobody can talk her down, and what spills over lands on anyone.
				index: "ecstatic",
				name: "Ecstatic",
				unlockedFromStart: true,
				archetype: "rapture",
				healthModifier: -4,
				cardAdditionArray: [{ index: "clemenceEdge", count: 1 }],
				//Boost self-Lust (Rapture); reduce Sanctified / ally-Lust (Sanctuary).
				archetypeWeightArray: [{ archetype: "rapture", multiplier: 3 }, { archetype: "sanctuary", multiplier: 0.5 }],
				cannotBeSoothed: true,
				brokenLustScatters: true,
				treeAbilityReplacementArray: [{ from: "clemenceOneWithNothing", to: "clemenceAbandon" }],
				description: "-4 Max HP. Adds Edge. Clemence cannot lose Lust during a fight. While she is Broken, Lust that would reach her lands on a random ally or enemy instead. One with Nothing becomes Abandon: spend all Devotion, gain that much Lust. Offers more cards that give her Lust, fewer that Sanctify or give allies Lust.",
			},
			{
				//BREAKING ALLIES. The enemy cannot touch her; she does it to her own.
				index: "abbess",
				name: "Abbess",
				unlockedFromStart: true,
				archetype: "sanctuary",
				healthModifier: 8,
				cardAdditionArray: [{ index: "clemenceGuidedHand", count: 1 }],
				//Boost Sanctified / ally-Lust (Sanctuary); reduce healing (Devotion).
				archetypeWeightArray: [{ archetype: "sanctuary", multiplier: 3 }, { archetype: "devotion", multiplier: 0.5 }],
				treeAbilityReplacementArray: [{ from: "clemenceOneWithNothing", to: "clemenceSharedVows" }],
				hooks: {
					modifyLustGained: function (amount, params) {
						return params.source != null && params.source.side == "enemy" ? 0 : amount;
					},
				},
				description: "+8 Max HP. Adds Guided Hand. Clemence is immune to Lust inflicted by enemies. One with Nothing becomes Shared Vows: spend all Devotion, every other ally gains half that much Lust. Offers more cards that Sanctify or give allies Lust, fewer that shield the party.",
			},
		],

		progressionTree: {
			backgroundPath: "progression/priest-tree",
			aspect: 16 / 9,
			nodeArray: [
				{
					index: "clmAbility1",
					name: "Absolution",
					description: "Unlocks Absolution and Clemence's Devotion. Allies soothe 5 and heal 5; Clemence takes the Lust they lost. Once per rest.",
					x: 15,
					y: 50,
					cost: 150,
					abilityAdditionArray: [{ "index": "clemenceAbsolve" }],
					requiresArray: ["clmStart"],
				},
				{
					index: "clmStart",
					name: "Vigour",
					description: "+5 Max HP per rank.",
					x: 5,
					y: 50,
					cost: 8,
					rankMaximum: 3,
					healthModifier: 5,
				},
				{
					index: "clmAtt1",
					name: "Share",
					description: "Tempt: 6 Lust, and 2 Lust on Clemence per rank.",
					x: 105,
					y: 20,
					cost: 50,
					rankMaximum: 3,
					exclusiveGroup: "clmAttPath",
					starterUpgradeArray: [{ "card": "clemenceTempt", "addEffectArray": [{ "index": "lust", "amount": 2, "targetOverride": "owner" }] }],
					requiresArray: ["clmGold"],
					previewCardArray: ["clemenceTempt"],
				},
				{
					index: "clmAtt3",
					name: "Brand",
					description: "Tempt: +1 Weak per rank.",
					x: 105,
					y: 80,
					cost: 50,
					rankMaximum: 3,
					exclusiveGroup: "clmAttPath",
					starterUpgradeArray: [{ "card": "clemenceTempt", "addEffectArray": [{ "index": "applyStatus", "status": "weak", "stacks": 1 }] }],
					requiresArray: ["clmGold"],
					previewCardArray: ["clemenceTempt"],
				},
				{
					index: "clmDef3",
					name: "Zeal",
					description: "Offering becomes: choose one - restore 6, or they gain 2 Strength this turn.",
					x: 125,
					y: 80,
					cost: 150,
					exclusiveGroup: "clmDefPath",
					starterUpgradeArray: [{ "card": "clemenceGrant", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Give or embolden?", "optionArray": [{ "index": "restore", "name": "Restore", "description": "Restore 6 health.", "effectArray": [{ "index": "heal", "amount": 6 }] }, { "index": "zeal", "name": "Zeal", "description": "They gain 2 Strength this turn.", "effectArray": [{ "index": "applyStatus", "status": "fleetingStrength", "stacks": 2 }] }] }] }],
					requiresArray: ["clmBoun2", "clmBoun1"],
					previewCardArray: ["clemenceGrant"],
				},
				{
					index: "clmDef1",
					name: "Take Their Burden",
					description: "Offering becomes: choose one - restore 6, or take 6 Lust from them.",
					x: 125,
					y: 20,
					cost: 150,
					exclusiveGroup: "clmDefPath",
					starterUpgradeArray: [{ "card": "clemenceGrant", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Give or take?", "optionArray": [{ "index": "restore", "name": "Restore", "description": "Restore 6 health.", "effectArray": [{ "index": "heal", "amount": 6 }] }, { "index": "burden", "name": "Take Their Burden", "description": "Take 6 Lust from them.", "effectArray": [{ "index": "soothe", "amount": 6 }, { "index": "lust", "amount": 6, "targetOverride": "owner" }] }] }] }],
					requiresArray: ["clmBoun1", "clmBoun2"],
					previewCardArray: ["clemenceGrant"],
				},
				{
					index: "clmAtt2",
					name: "Doubt",
					description: "Tempt: +2 Lust per rank.",
					x: 105,
					y: 50,
					cost: 50,
					rankMaximum: 3,
					exclusiveGroup: "clmAttPath",
					starterUpgradeArray: [{ "card": "clemenceTempt", "addEffectArray": [{ "index": "lust", "amount": 2 }] }],
					requiresArray: ["clmGold"],
					previewCardArray: ["clemenceTempt"],
				},
				{
					index: "clmU1",
					name: "Sister Wardrobe",
					description: "While in the party, Clemence's worn outfit adds twice as many cards.",
					x: 150,
					y: 35,
					cost: 150,
					exclusiveGroup: "clmOutfitPath",
					requiresArray: ["clmRest2"],
					outfitCardDoubling: true,
				},
				{
					index: "clmWheel1",
					name: "Discipline",
					description: "Absolution becomes: allies soothe 10 and heal 10; Clemence takes none.",
					x: 175,
					y: 20,
					cost: 150,
					exclusiveGroup: "clmWheelPath",
					requiresArray: ["clmAbility2"],
					abilityUpgradeArray: [{ "ability": "clemenceAbsolve", "disableMechanic": true, "effectArray": [{ "index": "soothe", "amount": 10, "targetOverride": "otherAllies" }, { "index": "heal", "amount": 10, "targetOverride": "allAllies" }] }],
				},
				{
					index: "clmWheel2",
					name: "Mortification",
					description: "Absolution becomes: all allies soothe 20 and lose 10 life.",
					x: 175,
					y: 50,
					cost: 150,
					exclusiveGroup: "clmWheelPath",
					requiresArray: ["clmAbility2"],
					abilityUpgradeArray: [{ "ability": "clemenceAbsolve", "disableMechanic": true, "effectArray": [{ "index": "soothe", "amount": 20, "targetOverride": "allAllies" }, { "index": "loseHealth", "amount": 10, "targetOverride": "allAllies" }] }],
				},
				{
					index: "clmWheel3",
					name: "Purify",
					description: "Absolution becomes: remove all statuses and Lust from the party.",
					x: 175,
					y: 80,
					cost: 150,
					exclusiveGroup: "clmWheelPath",
					requiresArray: ["clmAbility2"],
					abilityUpgradeArray: [{ "ability": "clemenceAbsolve", "disableMechanic": true, "effectArray": [{ "index": "cleanse", "all": true, "targetOverride": "allAllies" }, { "index": "soothe", "all": true, "targetOverride": "allAllies" }] }],
				},
				{
					index: "clmExtraAttack",
					name: "Extra Copy",
					description: "Add a second copy of Tempt to the starting deck.",
					x: 25,
					y: 15,
					cost: 150,
					exclusiveGroup: "clmExtraAttack",
					cardAdditionArray: [{ "index": "clemenceTempt", "count": 1 }],
					requiresArray: ["clmAbility1"],
				},
				{
					index: "clmReplaceAttack",
					name: "Retrain",
					description: "At run start, one Tempt becomes a random common of Clemence.",
					x: 40,
					y: 15,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "clemenceTempt", "rarity": "common", "count": 1 }],
					requiresArray: ["clmExtraAttack"],
				},
				{
					index: "clmExtraDefence",
					name: "Extra Guard",
					description: "Add a second copy of Offering to the starting deck.",
					x: 25,
					y: 85,
					cost: 150,
					exclusiveGroup: "clmExtraDefence",
					cardAdditionArray: [{ "index": "clemenceGrant", "count": 1 }],
					requiresArray: ["clmAbility1"],
				},
				{
					index: "clmReplaceDefence",
					name: "Relearn",
					description: "At run start, one Offering becomes a random common of Clemence.",
					x: 40,
					y: 85,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "clemenceGrant", "rarity": "common", "count": 1 }],
					requiresArray: ["clmExtraDefence"],
				},
				{
					index: "clmCex1",
					name: "Overflow",
					description: "While in the party, healing that overflows max HP becomes Temporary HP.",
					x: 35,
					y: 50,
					cost: 75,
					requiresArray: ["clmAbility1"],
					healOverflowToTemporary: true,
				},
				{
					index: "clmU2",
					name: "Tailored",
					description: "While in the party, Clemence's worn outfit cards start upgraded.",
					x: 150,
					y: 65,
					cost: 300,
					exclusiveGroup: "clmOutfitPath",
					requiresArray: ["clmRest2"],
					outfitCardUpgrade: true,
				},
				{
					index: "clmCex2",
					name: "Martyr",
					description: "While in the party, when Clemence is Broken, other allies gain 4 Temporary HP.",
					x: 45,
					y: 50,
					cost: 75,
					hooks: { "onAllyBroken": function (params) {
					if (params.wearer == null || params.entity !== params.wearer) return;
					var allies = honeycomb.entityArray("ally", params.context.combat);
					for (var allyIndex = 0; allyIndex < allies.length; allyIndex++) {
						if (allies[allyIndex] !== params.wearer) honeycomb.grantTemporaryHealth(allies[allyIndex], 4, params.context);
					}
				} },
					requiresArray: ["clmCex1"],
				},
				{
					index: "clmRest1",
					name: "Lay of the Land",
					description: "Unlocks Exercise at rest sites while Clemence is in the party.",
					x: 75,
					y: 50,
					cost: 150,
					requiresArray: ["clmCex3"],
					restOption: "exercise",
				},
				{
					index: "clmXp",
					name: "Veteran",
					description: "While in the party, gain 1.5x personal experience.",
					x: 50,
					y: 15,
					cost: 75,
					personalExperienceMultiplier: 1.5,
					requiresArray: ["clmCex1"],
				},
				{
					index: "clmCol",
					name: "Collector",
					description: "While in the party, unseen events and items appear 50% more often.",
					x: 50,
					y: 85,
					cost: 75,
					requiresArray: ["clmCex1"],
					collectorWeight: 0.5,
				},
				{
					index: "clmNew",
					name: "New Blood",
					description: "While in the party, Clemence's unseen cards appear 50% more often.",
					x: 60,
					y: 85,
					cost: 75,
					requiresArray: ["clmCex2"],
					unseenCardWeight: 0.5,
				},
				{
					index: "clmCheap",
					name: "Window Shopping",
					description: "While in the party, outfits and common relics cost 10% less in the shop.",
					x: 60,
					y: 15,
					cost: 75,
					requiresArray: ["clmCex2"],
					unlockDiscount: 0.1,
				},
				{
					index: "clmReroll1",
					name: "Second Chance",
					description: "One reward reroll per run while in the party.",
					x: 70,
					y: 15,
					cost: 150,
					requiresArray: ["clmCex3"],
					rewardReroll: 1,
				},
				{
					index: "clmBanish1",
					name: "Banish",
					description: "Banish one card from this run's reward, shop and journal pools while in the party.",
					x: 70,
					y: 85,
					cost: 300,
					requiresArray: ["clmCex3"],
					rewardBanish: 1,
				},
				{
					index: "clmGold",
					name: "Deep Pockets",
					description: "While in the party, +5 gold at run start per rank.",
					x: 90,
					y: 50,
					cost: 50,
					rankMaximum: 3,
					startingGold: 5,
					requiresArray: ["clmShop1", "clmShop2"],
				},
				{
					index: "clmDef2",
					name: "Pardon",
					description: "Offering becomes: choose one - restore 6, or remove a random negative status.",
					x: 125,
					y: 50,
					cost: 150,
					exclusiveGroup: "clmDefPath",
					starterUpgradeArray: [{ "card": "clemenceGrant", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Give or take?", "optionArray": [{ "index": "restore", "name": "Restore", "description": "Restore 6 health.", "effectArray": [{ "index": "heal", "amount": 6 }] }, { "index": "pardon", "name": "Pardon", "description": "Remove a random negative status from them.", "effectArray": [{ "index": "removeStatus", "random": true }] }] }] }],
					requiresArray: ["clmBoun1", "clmBoun2"],
					previewCardArray: ["clemenceGrant"],
				},
				{
					index: "clmOpenD",
					name: "Head Start",
					description: "While in the party, turn 1: +1 card drawn, -1 energy.",
					x: 95,
					y: 15,
					cost: 150,
					exclusiveGroup: "clmOpenPath",
					requiresArray: ["clmGold"],
					openingDrawBonus: 1,
					openingEnergyBonus: -1,
				},
				{
					index: "clmOpenE",
					name: "Fast Start",
					description: "While in the party, turn 1: +1 energy, -1 card drawn.",
					x: 95,
					y: 85,
					cost: 150,
					exclusiveGroup: "clmOpenPath",
					requiresArray: ["clmGold"],
					openingDrawBonus: -1,
					openingEnergyBonus: 1,
				},
				{
					index: "clmBoun1",
					name: "Plunder",
					description: "While in the party, bosses and elites pay 25% more gold.",
					x: 115,
					y: 35,
					cost: 150,
					exclusiveGroup: "clmBounPath",
					requiresArray: ["clmAtt1", "clmAtt2", "clmAtt3"],
					bountyGoldMultiplier: 0.25,
				},
				{
					index: "clmBoun2",
					name: "Spoils",
					description: "While in the party, bosses and elites offer 1 extra card choice.",
					x: 115,
					y: 65,
					cost: 150,
					exclusiveGroup: "clmBounPath",
					requiresArray: ["clmAtt2", "clmAtt3", "clmAtt1"],
					bountyCardChoiceBonus: 1,
				},
				{
					index: "clmShop1",
					name: "Haggler",
					description: "While in the party, cards cost 10% less in the shop.",
					x: 80,
					y: 15,
					cost: 150,
					exclusiveGroup: "clmShopPath",
					requiresArray: ["clmRest1"],
					shopCardDiscount: 0.1,
				},
				{
					index: "clmShop2",
					name: "Wider Shelves",
					description: "While in the party, the shop offers 1 more card and 1 more relic option.",
					x: 80,
					y: 85,
					cost: 150,
					exclusiveGroup: "clmShopPath",
					requiresArray: ["clmRest1"],
					shopExtraSlots: 1,
				},
				{
					index: "clmAbility2",
					name: "One with Nothing",
					description: "Unlocks One with Nothing. Lose all Devotion, then lose half that much life. Once per combat.",
					x: 165,
					y: 50,
					cost: 300,
					abilityAdditionArray: [{ "index": "clemenceOneWithNothing" }],
					requiresArray: ["clmU1", "clmU2", "clmRestA", "clmRestB"],
				},
				{
					index: "clmCex3",
					name: "Comfort",
					description: "While in the party, combat start: other allies soothe 2.",
					x: 55,
					y: 50,
					cost: 75,
					hooks: { "onCombatStart": function (params) {
					var allies = honeycomb.entityArray("ally", params.context.combat);
					for (var allyIndex = 0; allyIndex < allies.length; allyIndex++) {
						if (allies[allyIndex] !== params.entity) honeycomb.reduceLust(allies[allyIndex], 2, params.context);
					}
				} },
					requiresArray: ["clmCex2"],
				},
				{
					index: "clmFort",
					name: "Fortitude",
					description: "Clemence's Lust weaknesses never build, and Clemence misses every Lust Event.",
					x: 10,
					y: 15,
					cost: 0,
					fortitude: true,
					//Free, with no prerequisite; `free` marks both as deliberate for audit-trees.js.
					free: true,
				},
				{
					index: "clmRest2",
					name: "Lay of the Land, Always",
					description: "Exercise stays unlocked even when Clemence is benched.",
					x: 135,
					y: 50,
					cost: 300,
					requiresArray: ["clmDef1", "clmDef2", "clmDef3"],
					restOption: "exercise",
				},
				{
					index: "clmRestA",
					name: "Field Rations",
					description: "One more action when you reach a rest site.",
					x: 155,
					y: 15,
					cost: 150,
					exclusiveGroup: "clmRestPath",
					requiresArray: ["clmRest2"],
					restActionsBonus: 1,
				},
				{
					index: "clmRestB",
					name: "Sound Sleep",
					description: "Sleep heals an extra 15% of maximum health.",
					x: 155,
					y: 85,
					cost: 150,
					exclusiveGroup: "clmRestPath",
					requiresArray: ["clmRest2"],
					restHealBonus: true,
				},
				{
					index: "clmReroll2",
					name: "Second Chance, Always",
					description: "Adds 1 reroll to every run, whether or not Clemence is in the party.",
					x: 140,
					y: 15,
					cost: 150,
					requiresArray: ["clmRest2"],
					rewardRerollAlways: 1,
				},
				{
					index: "clmBanish2",
					name: "Banish, Always",
					description: "Adds 1 banish to every run, whether or not Clemence is in the party.",
					x: 140,
					y: 85,
					cost: 150,
					requiresArray: ["clmRest2"],
					rewardBanishAlways: 1,
				},
				{
					index: "clmTrimAttack",
					name: "Trim",
					description: "Remove a copy of Tempt from the starting deck.",
					x: 35,
					y: 35,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "clmExtraAttack",
					cardRemovalArray: [{ "index": "clemenceTempt", "count": 1 }],
					requiresArray: ["clmAbility1"],
				},
				{
					index: "clmTrimDefence",
					name: "Slim Down",
					description: "Remove a copy of Offering from the starting deck.",
					x: 35,
					y: 65,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "clmExtraDefence",
					cardRemovalArray: [{ "index": "clemenceGrant", "count": 1 }],
					requiresArray: ["clmAbility1"],
				},
			],
		},
	},
	{
		//THE CHESSMASTER. The secret 7th character: summons and manages autonomous
		//chess-themed golems. Design in !designDocs/honeycomb/chessmaster/.
		//
		//SHE IS HIDDEN UNTIL SHE IS FINISHED. `unlockedFromStart` is false and there is no relic yet, so
		//nothing offers her -- which is the release gate the brief asked for: if she is not ready for the
		//demo, players must have no clue she exists.
		//
		//LAST IN THE TABLE, not first: the roster reads this order, and a secret seventh
		//character heading the list announces itself.
		//
		//`inDevelopment` is the machine-readable half of that gate. The content tests hold a SHIPPED
		//character to the full standard -- a progression tree, a broken form per rank, an heirloom --
		//and hers do not exist yet. Rather than let five checks sit red and hide the next real
		//regression, the checks skip her and the boot warning report names every in-development
		//character instead (rule `characterInDevelopment`), so the gap stays loud. Clearing the flag is
		//the last step of the chessmaster workstream, and the checks come back with it.
		inDevelopment: true,
		index: "anastasia",
		name: "Anastasia",
		className: "Chessmaster",
		classIconPath: "icons/chess-king",
		blurb: "Every piece has a purpose. Most of them are to die.",
		description: "Anastasia plays a fight the way she would play a board. Her golems do the fighting and a snap of her fingers tells them what to do next. She will happily tell you she got hooked on something down here and decided to stay. She will not tell you where she came from.",
		colorHint: "#b9a2e8",
		unlockedFromStart: false,
		//`earthling`: see honeycomb.tagArray.
		tagArray: ["human", "woman", "earthling", "summoner"],

		//WHAT A CARD OF HERS BECOMES WHILE SHE IS BROKEN, BY RARITY: three rows rather than a field on every
		//card, so a card written later gets the right form without anybody remembering to say so.
		brokenCardByRarity: {
			starter: "anastasiaAdvanceBroken",
			common: "anastasiaInterposeBroken",
			rare: "anastasiaCheckBroken",
		},
		//And the catch-all, for a rarity the map does not name.
		brokenCard: "anastasiaAdvanceBroken",
		brokenArtPath: "characters/chess/broken",
		brokenBackgroundPath: "characters/chess/brokenBG",
		brokenCutIn: true,
		recoverArtPath: "characters/chess/recover",
		//Measured off default/recover.webp, the upper-body picture: a third of its height, from
		//just above the eyes. See tuning.recoverOverlay.eyeWindow.
		recoverEyeWindow: { centreXPercent: 45, topPercent: 14, heightPercent: 32 },
		recoverBackgroundPath: "characters/chess/recoverBG",

		artFolder: "chess",
		defaultOutfit: "default",
		startingEquipmentArray: ["grandmastersPocketwatch"],

		//HER POSES ARE HELD LONGER THAN THE DEFAULT ACTION FRAME (honeycomb.art.presentationFor): the snap
		//has to outlast the command lead (tuning.animation.commandLeadMs) so she is still
		//mid-snap when the piece she ordered appears.
		poseHoldMs: honeycomb.tuning.chessmaster.poseHoldMs,

		//2x ONE ATTACK, 2x ONE DEFENCE, as every character's starters are. Develop is the one
		//that puts a Pawn on the board: no ability summons any more, so a starter has to.
		startingCardArray: [
			//Advance, not Check. Check kept its index and became the rare the name
			//was always worth.
			{ index: "anastasiaAdvance", count: 2 },
			{ index: "anastasiaDevelop", count: 2 },
		],

		//HER ABILITIES COME FROM HER TREE, like everyone's. A1 is Transposition -- once a combat, flip one
		//piece's alignment -- and is the kit's floor,
		//never its engine: her Pawns come from cards, so a fresh Anastasia with no nodes bought still plays.
		//A2 is Call the King, gated on Gambit by its own requirement.
		//
		//THE TREE IS GENERATED, never hand-edited: the `anastasia` spec in
		//!designDocs/honeycomb/tools/generate-progression-trees.js, written with `--only anastasia`.
		progressionTree: {
			backgroundPath: "progression/chess-tree",
			aspect: 16 / 9,
			nodeArray: [
				{
					index: "anaAbility1",
					name: "Transposition",
					description: "Unlocks Transposition and Anastasia's Gambit. Invert a piece's alignment, permanently; a downed Pawn is raised as its twin. Once per combat.",
					x: 15,
					y: 50,
					cost: 150,
					abilityAdditionArray: [{ "index": "anastasiaTransposition" }],
					requiresArray: ["anaStart"],
				},
				{
					index: "anaStart",
					name: "Vigour",
					description: "+5 Max HP per rank.",
					x: 5,
					y: 50,
					cost: 13,
					rankMaximum: 2,
					healthModifier: 5,
				},
				{
					index: "anaAtt1",
					name: "Fork",
					description: "Advance: the Pawn gains 2 Strength per rank.",
					x: 105,
					y: 20,
					cost: 50,
					rankMaximum: 3,
					exclusiveGroup: "anaAttPath",
					starterUpgradeArray: [{ "card": "anastasiaAdvance", "addEffectArray": [{ "index": "applyStatus", "status": "strength", "stacks": 2, "targetOverride": "lastSummoned" }] }],
					requiresArray: ["anaGold"],
					previewCardArray: ["anastasiaAdvance"],
				},
				{
					index: "anaAtt3",
					name: "Discovered Attack",
					description: "Advance: Anastasia gains 2 Temporary HP per rank.",
					x: 105,
					y: 80,
					cost: 50,
					rankMaximum: 3,
					exclusiveGroup: "anaAttPath",
					starterUpgradeArray: [{ "card": "anastasiaAdvance", "addEffectArray": [{ "index": "temporaryHealth", "amount": 2, "targetOverride": "owner" }] }],
					requiresArray: ["anaGold"],
					previewCardArray: ["anastasiaAdvance"],
				},
				{
					index: "anaDef3",
					name: "Gain a Tempo",
					description: "Develop becomes: summon a Celestial Pawn and draw a card.",
					x: 125,
					y: 80,
					cost: 150,
					exclusiveGroup: "anaDefPath",
					starterUpgradeArray: [{ "card": "anastasiaDevelop", "replaceEffectArray": [{ "index": "summon", "enemy": "celestialPawn", "team": "own" }, { "index": "drawCards", "amount": 1 }] }],
					requiresArray: ["anaBoun2", "anaBoun1"],
					previewCardArray: ["anastasiaDevelop"],
				},
				{
					index: "anaDef1",
					name: "Either Colour",
					description: "Develop becomes: choose one - summon a Celestial Pawn, or an Infernal Pawn. Gain 3 Temporary HP.",
					x: 125,
					y: 20,
					cost: 150,
					exclusiveGroup: "anaDefPath",
					starterUpgradeArray: [{ "card": "anastasiaDevelop", "replaceEffectArray": [{ "index": "chooseOption", "prompt": "Which colour?", "optionArray": [{ "index": "celestial", "name": "Celestial", "description": "Summon a Celestial Pawn. It opens on its guard.", "effectArray": [{ "index": "summon", "enemy": "celestialPawn", "team": "own" }] }, { "index": "infernal", "name": "Infernal", "description": "Summon an Infernal Pawn. It opens on its blow.", "effectArray": [{ "index": "summon", "enemy": "infernalPawn", "team": "own" }] }] }, { "index": "temporaryHealth", "amount": 3 }] }],
					requiresArray: ["anaBoun1", "anaBoun2"],
					previewCardArray: ["anastasiaDevelop"],
				},
				{
					index: "anaAtt2",
					name: "Pin",
					description: "Advance: the Pawn gains 1 Taunt per rank.",
					x: 105,
					y: 50,
					cost: 50,
					rankMaximum: 3,
					exclusiveGroup: "anaAttPath",
					starterUpgradeArray: [{ "card": "anastasiaAdvance", "addEffectArray": [{ "index": "applyStatus", "status": "taunt", "stacks": 1, "targetOverride": "lastSummoned" }] }],
					requiresArray: ["anaGold"],
					previewCardArray: ["anastasiaAdvance"],
				},
				{
					index: "anaU1",
					name: "Sister Wardrobe",
					description: "While in the party, Anastasia's worn outfit adds twice as many cards.",
					x: 150,
					y: 35,
					cost: 150,
					exclusiveGroup: "anaOutfitPath",
					requiresArray: ["anaRest2"],
					outfitCardDoubling: true,
				},
				{
					index: "anaWheel1",
					name: "Double Transposition",
					description: "Transposition holds 2 charges.",
					x: 175,
					y: 20,
					cost: 150,
					exclusiveGroup: "anaWheelPath",
					requiresArray: ["anaAbility2"],
					abilityUpgradeArray: [{ "ability": "anastasiaTransposition", "chargeMaximum": 2, "rechargeAmount": 2 }],
				},
				{
					index: "anaWheel2",
					name: "Exchange Up",
					description: "Transposition becomes: invert a piece, and it gains 3 Strength.",
					x: 175,
					y: 50,
					cost: 150,
					exclusiveGroup: "anaWheelPath",
					requiresArray: ["anaAbility2"],
					abilityUpgradeArray: [{ "ability": "anastasiaTransposition", "effectArray": [{ "index": "invert" }, { "index": "applyStatus", "status": "strength", "stacks": 3 }], "text": "Invert a piece's alignment, permanently; it gains 3 Strength. A downed Pawn is raised as its twin." }],
				},
				{
					index: "anaWheel3",
					name: "Reserve Pawn",
					description: "Transposition becomes: summon a Celestial Pawn. Once per combat.",
					x: 175,
					y: 80,
					cost: 150,
					exclusiveGroup: "anaWheelPath",
					requiresArray: ["anaAbility2"],
					abilityUpgradeArray: [{ "ability": "anastasiaTransposition", "targetMode": "self", "effectArray": [{ "index": "summon", "enemy": "celestialPawn", "team": "own" }], "text": "Summon a Celestial Pawn." }],
				},
				{
					index: "anaExtraAttack",
					name: "Extra Copy",
					description: "Add a second copy of Advance to the starting deck.",
					x: 25,
					y: 15,
					cost: 150,
					exclusiveGroup: "anaExtraAttack",
					cardAdditionArray: [{ "index": "anastasiaAdvance", "count": 1 }],
					requiresArray: ["anaAbility1"],
				},
				{
					index: "anaReplaceAttack",
					name: "Retrain",
					description: "At run start, one Advance becomes a random common of Anastasia.",
					x: 40,
					y: 15,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "anastasiaAdvance", "rarity": "common", "count": 1 }],
					requiresArray: ["anaExtraAttack"],
				},
				{
					index: "anaExtraDefence",
					name: "Extra Guard",
					description: "Add a second copy of Develop to the starting deck.",
					x: 25,
					y: 85,
					cost: 150,
					exclusiveGroup: "anaExtraDefence",
					cardAdditionArray: [{ "index": "anastasiaDevelop", "count": 1 }],
					requiresArray: ["anaAbility1"],
				},
				{
					index: "anaReplaceDefence",
					name: "Relearn",
					description: "At run start, one Develop becomes a random common of Anastasia.",
					x: 40,
					y: 85,
					cost: 50,
					rankMaximum: 3,
					randomReplaceArray: [{ "from": "anastasiaDevelop", "rarity": "common", "count": 1 }],
					requiresArray: ["anaExtraDefence"],
				},
				{
					index: "anaCex1",
					name: "Composure",
					description: "While in the party, turn start: Anastasia soothes 5.",
					x: 35,
					y: 50,
					cost: 75,
					hooks: { "onTurnStart": function (params) {
					honeycomb.reduceLust(params.entity, 5, params.context);
				} },
					requiresArray: ["anaAbility1"],
				},
				{
					index: "anaU2",
					name: "Tailored",
					description: "While in the party, Anastasia's worn outfit cards start upgraded.",
					x: 150,
					y: 65,
					cost: 300,
					exclusiveGroup: "anaOutfitPath",
					requiresArray: ["anaRest2"],
					outfitCardUpgrade: true,
				},
				{
					index: "anaCex2",
					name: "Pawn Structure",
					description: "While in the party, when a Pawn falls, Anastasia gains 3 Temporary HP.",
					x: 45,
					y: 50,
					cost: 75,
					hooks: { "onAllyDowned": function (params) {
					if (params.wearer == null) return;
					var found = honeycomb.entityDefinition(params.entity);
					if (found == null || !honeycomb.definitionHasTag(found.definition, "pawn")) return;
					honeycomb.grantTemporaryHealth(params.wearer, 3, params.context);
				} },
					requiresArray: ["anaCex1"],
				},
				{
					index: "anaRest1",
					name: "Lay of the Land",
					description: "Unlocks Preptime at rest sites while Anastasia is in the party.",
					x: 75,
					y: 50,
					cost: 150,
					requiresArray: ["anaCex3"],
					restOption: "preptime",
				},
				{
					index: "anaXp",
					name: "Veteran",
					description: "While in the party, gain 1.5x personal experience.",
					x: 50,
					y: 15,
					cost: 75,
					personalExperienceMultiplier: 1.5,
					requiresArray: ["anaCex1"],
				},
				{
					index: "anaCol",
					name: "Collector",
					description: "While in the party, unseen events and items appear 50% more often.",
					x: 50,
					y: 85,
					cost: 75,
					requiresArray: ["anaCex1"],
					collectorWeight: 0.5,
				},
				{
					index: "anaNew",
					name: "New Blood",
					description: "While in the party, Anastasia's unseen cards appear 50% more often.",
					x: 60,
					y: 85,
					cost: 75,
					requiresArray: ["anaCex2"],
					unseenCardWeight: 0.5,
				},
				{
					index: "anaCheap",
					name: "Window Shopping",
					description: "While in the party, outfits and common relics cost 10% less in the shop.",
					x: 60,
					y: 15,
					cost: 75,
					requiresArray: ["anaCex2"],
					unlockDiscount: 0.1,
				},
				{
					index: "anaReroll1",
					name: "Second Chance",
					description: "One reward reroll per run while in the party.",
					x: 70,
					y: 15,
					cost: 150,
					requiresArray: ["anaCex3"],
					rewardReroll: 1,
				},
				{
					index: "anaBanish1",
					name: "Banish",
					description: "Banish one card from this run's reward, shop and journal pools while in the party.",
					x: 70,
					y: 85,
					cost: 300,
					requiresArray: ["anaCex3"],
					rewardBanish: 1,
				},
				{
					index: "anaGold",
					name: "Deep Pockets",
					description: "While in the party, +5 gold at run start per rank.",
					x: 90,
					y: 50,
					cost: 50,
					rankMaximum: 3,
					startingGold: 5,
					requiresArray: ["anaShop1", "anaShop2"],
				},
				{
					index: "anaDef2",
					name: "Solid Structure",
					description: "Develop becomes: summon a Celestial Pawn and gain 7 Temporary HP.",
					x: 125,
					y: 50,
					cost: 150,
					exclusiveGroup: "anaDefPath",
					starterUpgradeArray: [{ "card": "anastasiaDevelop", "replaceEffectArray": [{ "index": "summon", "enemy": "celestialPawn", "team": "own" }, { "index": "temporaryHealth", "amount": 7 }] }],
					requiresArray: ["anaBoun1", "anaBoun2"],
					previewCardArray: ["anastasiaDevelop"],
				},
				{
					index: "anaOpenD",
					name: "Head Start",
					description: "While in the party, turn 1: +1 card drawn, -1 energy.",
					x: 95,
					y: 15,
					cost: 150,
					exclusiveGroup: "anaOpenPath",
					requiresArray: ["anaGold"],
					openingDrawBonus: 1,
					openingEnergyBonus: -1,
				},
				{
					index: "anaOpenE",
					name: "Fast Start",
					description: "While in the party, turn 1: +1 energy, -1 card drawn.",
					x: 95,
					y: 85,
					cost: 150,
					exclusiveGroup: "anaOpenPath",
					requiresArray: ["anaGold"],
					openingDrawBonus: -1,
					openingEnergyBonus: 1,
				},
				{
					index: "anaBoun1",
					name: "Plunder",
					description: "While in the party, bosses and elites pay 25% more gold.",
					x: 115,
					y: 35,
					cost: 150,
					exclusiveGroup: "anaBounPath",
					requiresArray: ["anaAtt1", "anaAtt2", "anaAtt3"],
					bountyGoldMultiplier: 0.25,
				},
				{
					index: "anaBoun2",
					name: "Spoils",
					description: "While in the party, bosses and elites offer 1 extra card choice.",
					x: 115,
					y: 65,
					cost: 150,
					exclusiveGroup: "anaBounPath",
					requiresArray: ["anaAtt2", "anaAtt3", "anaAtt1"],
					bountyCardChoiceBonus: 1,
				},
				{
					index: "anaShop1",
					name: "Haggler",
					description: "While in the party, cards cost 10% less in the shop.",
					x: 80,
					y: 15,
					cost: 150,
					exclusiveGroup: "anaShopPath",
					requiresArray: ["anaRest1"],
					shopCardDiscount: 0.1,
				},
				{
					index: "anaShop2",
					name: "Wider Shelves",
					description: "While in the party, the shop offers 1 more card and 1 more relic option.",
					x: 80,
					y: 85,
					cost: 150,
					exclusiveGroup: "anaShopPath",
					requiresArray: ["anaRest1"],
					shopExtraSlots: 1,
				},
				{
					index: "anaAbility2",
					name: "Call the King",
					description: "Unlocks Call the King. At 4 Gambit, shuffle a King's Invocation into the deck. Once per rest.",
					x: 165,
					y: 50,
					cost: 300,
					abilityAdditionArray: [{ "index": "anastasiaKingsInvocation" }],
					requiresArray: ["anaU1", "anaU2", "anaRestA", "anaRestB"],
				},
				{
					index: "anaCex3",
					name: "Prepared Line",
					description: "While in the party, combat start: summon a Celestial Pawn.",
					x: 55,
					y: 50,
					cost: 75,
					hooks: { "onCombatStart": function (params) {
					var context = honeycomb.newEffectContext({ combat: params.context.combat, source: params.entity, log: params.context.log });
					honeycomb.summonCombatant({ side: "ally", enemyIndex: "celestialPawn" }, context);
				} },
					requiresArray: ["anaCex2"],
				},
				{
					index: "anaFort",
					name: "Fortitude",
					description: "Anastasia's Lust weaknesses never build, and Anastasia misses every Lust Event.",
					x: 10,
					y: 15,
					cost: 0,
					fortitude: true,
					//Free, with no prerequisite; `free` marks both as deliberate for audit-trees.js.
					free: true,
				},
				{
					index: "anaRest2",
					name: "Lay of the Land, Always",
					description: "Preptime stays unlocked even when Anastasia is benched.",
					x: 135,
					y: 50,
					cost: 300,
					requiresArray: ["anaDef1", "anaDef2", "anaDef3"],
					restOption: "preptime",
				},
				{
					index: "anaRestA",
					name: "Field Rations",
					description: "One more action when you reach a rest site.",
					x: 155,
					y: 15,
					cost: 150,
					exclusiveGroup: "anaRestPath",
					requiresArray: ["anaRest2"],
					restActionsBonus: 1,
				},
				{
					index: "anaRestB",
					name: "Sound Sleep",
					description: "Sleep heals an extra 15% of maximum health.",
					x: 155,
					y: 85,
					cost: 150,
					exclusiveGroup: "anaRestPath",
					requiresArray: ["anaRest2"],
					restHealBonus: true,
				},
				{
					index: "anaReroll2",
					name: "Second Chance, Always",
					description: "Adds 1 reroll to every run, whether or not Anastasia is in the party.",
					x: 140,
					y: 15,
					cost: 150,
					requiresArray: ["anaRest2"],
					rewardRerollAlways: 1,
				},
				{
					index: "anaBanish2",
					name: "Banish, Always",
					description: "Adds 1 banish to every run, whether or not Anastasia is in the party.",
					x: 140,
					y: 85,
					cost: 150,
					requiresArray: ["anaRest2"],
					rewardBanishAlways: 1,
				},
				{
					index: "anaTrimAttack",
					name: "Trim",
					description: "Remove a copy of Advance from the starting deck.",
					x: 35,
					y: 35,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "anaExtraAttack",
					cardRemovalArray: [{ "index": "anastasiaAdvance", "count": 1 }],
					requiresArray: ["anaAbility1"],
				},
				{
					index: "anaTrimDefence",
					name: "Slim Down",
					description: "Remove a copy of Develop from the starting deck.",
					x: 35,
					y: 65,
					cost: 75,
					rankMaximum: 2,
					exclusiveGroup: "anaExtraDefence",
					cardRemovalArray: [{ "index": "anastasiaDevelop", "count": 1 }],
					requiresArray: ["anaAbility1"],
				},
			],
		},

		outfitArray: [
			{
				index: "default",
				name: "Grandmaster",
				unlockedFromStart: true,
				randomCardCount: 3,
				personalExperienceMultiplier: 1.2,
				description: "Adds 3 random Anastasia cards at run start. +20% personal experience.",
				hooks: {
					//KING'S INVOCATION COSTS 1 LESS PER GAMBIT. A fight that fed the loop pays almost
					//nothing for its King; a fight that did not cannot afford one at all.
					modifyCardCost: function (amount, params) {
						if (params.card == null) return amount;
						if (params.card.index != "anastasiaKingsInvocation" && params.card.index != "anastasiaInfernalInvocation") return amount;
						var held = honeycomb.mechanicValue(params.entity, "gambit");
						return amount - (held * honeycomb.tuning.chessmaster.kingInvocation.costReductionPerPawn);
					},
					//SHE ANSWERS FOR HER PIECES. On the outfit rather than on the character,
					//so a later costume can be the one that does NOT take it.
					onCombatStart: function (params) {
						honeycomb.applyStatus(params.entity, "commandersBurden", 1, params.context);
					},
				},
			},
		],
	},
];

//THE SHIPPED ROSTER: every character except the ones still in development.
//
//`inDevelopment` gates a character out of the roster, and the
//demo goal is stronger than "do not offer her" -- she must not be ADVERTISED, not even as a locked or
//secret slot, because a promised unlock that never ships is a support burden. Two screens filtered the
//table inline and a third counted the unfiltered length, which is how the teambuilding roster ended up
//drawing one "???" tile for her. The gate is one function now, so a fourth screen cannot get it wrong.
//
//THE MEANING CHANGED, AND THE NAME DID NOT. This is still the single gate, and it now admits
//ONE more kind of character: one still `inDevelopment` that THIS PROFILE HAS EARNED -- her index is in the
//profile's `unlockedCharacterArray`. Nothing writes Anastasia there except beating the gauntlet's boss
//(honeycomb.unlocks, kind `character`), and the gauntlet cannot be reached while
//tuning.chessmaster.gauntlet.enabled is false. So on every profile that has not earned her she is exactly
//as invisible as before -- no tile, no "???" slot, no count -- and on one that has, every screen that
//asks this function lists her. `inDevelopment` keeps telling the truth about her content (no tree, no
//heirloom, no broken form per rank; rule `characterInDevelopment`), which is why it is not cleared.
//`profile` defaults to the live one; a caller with another profile in hand passes it.
honeycomb.shippedCharacterArray = function (profile) {
	var reading = profile != null ? profile : (honeycomb.state == null ? null : honeycomb.state.profile);
	var earnedArray = reading == null || reading.unlockedCharacterArray == null ? [] : reading.unlockedCharacterArray;
	return honeycomb.characterArray.filter(function (character) {
		return character.inDevelopment != true || earnedArray.indexOf(character.index) >= 0;
	});
};

//---------------------------------------------------------------------------------------------------
//Character mechanics
//---------------------------------------------------------------------------------------------------
//ONE SMALL MECHANIC EACH, and the three between them define the space a nameplate widget can occupy:
//
//So there are three WIDGET KINDS, and the nameplate can draw any of them for anybody:
//  "bar"   a secondary resource that fills                      -- Brienne's Resolve
//  "orbs"  a row of lights, each its own condition              -- Severine's Thirst
//  "orb"   one orb with art inside it and a number beside it    -- Nettle's Harvest
//
//A mechanic is either COUNTED or TESTED, and the kind decides which:
//  bar / orb   a number on the member (`meterArray[index]`), moved by the mechanic's own `hooks`,
//              which fire exactly where a status's or a relic's do (honeycomb.hookSourceArray)
//  orbs        nothing is stored: each orb's `test` is asked whenever the plate is drawn, so a light
//              can never disagree with the board
//
//Fields:
//  index, characterIndex, name, description
//  kind            "bar" | "orbs" | "orb"
//  colorHint       the widget's colour
//  iconPath, glyph the picture inside an "orb"
//  maximum         bar / orb ceiling
//  resetOn         "combatStart" (the default) | "never" -- when a counted mechanic goes back to zero
//  hooks           the shared hook table, for a counted mechanic
//  orbArray        for "orbs": [{index, name, description, test(member, combat)}]
//
//Each one GATES THAT CHARACTER'S SIGNATURE ABILITY, so the widget is something
//to read and act on rather than decoration. See `requirementArray` in honeycomb-content-abilities.js.
honeycomb.mechanicArray = [

	{
		//GAMBIT: Pawns dead this battle -- the micro resource that feeds the macro one. It
		//counts DEATHS, not sacrifices specifically, so a pawn the enemy kills still pays. The ceiling and
		//the King's price are tuning.chessmaster.gambit / kingInvocation, for a kit
		//whose Pawns come from cards alone.
		index: "gambit",
		characterIndex: "anastasia",
		abilityIndex: "anastasiaTransposition",
		name: "Gambit",
		description: "A Pawn dead is a Pawn spent. Spend enough of them and the board is ready for a King.",
		kind: "bar",
		colorHint: "#b9a2e8",
		iconPath: "icons/chess-pawn",
		glyph: "skull",
		maximum: honeycomb.tuning.chessmaster.gambit.maximum,
		perPawn: 1,
		resetOn: "combatStart",
		hooks: {
			onAllyDowned: function (params) {
				//Only Pawns count. Reading the tag rather than the index means an Infernal Pawn, or any
				//pawn added later, pays without this hook being touched.
				var found = honeycomb.entityDefinition(params.entity);
				if (found == null || !honeycomb.definitionHasTag(found.definition, "pawn")) return;
				honeycomb.addMechanic(params.wearer, params.definition.index, params.definition.perPawn, params.context);
			},
		},
	},
	{
		index: "resolve",
		characterIndex: "brienne",
		//Runs only once Brienne's Ability 1 node is bought: no ability, no meter.
		abilityIndex: "brienneBrace",
		name: "Resolve",
		description: "One for every point of damage Brienne takes, on her health or her Temporary HP. Aegis spends it.",
		kind: "bar",
		colorHint: "#e8c86a",
		//1-1 on damage taken this battle, not on tHP gained, and a ceiling of 100 so a fight's worth of
		//blows has somewhere to go.
		maximum: 100,
		pointsPerDamage: 1,
		resetOn: "combatStart",
		hooks: {
			//A blow that reaches her health.
			onDamaged: function (params) {
				if (params.amount <= 0) return;
				if (honeycomb.memberLoadoutFlag(params.entity, "resolveFromTemporaryLost") == true) return;
				honeycomb.addMechanic(params.entity, params.definition.index, params.amount * params.definition.pointsPerDamage, params.context);
			},
			//A blow her Temporary HP soaked counts the same: damage taken is damage taken.
			onTemporaryAbsorbed: function (params) {
				if (honeycomb.memberLoadoutFlag(params.entity, "resolveFromTemporaryLost") == true) {
					honeycomb.resolveFromTemporaryLost(params);
					return;
				}
				if (params.amount > 0) honeycomb.addMechanic(params.entity, params.definition.index, params.amount * params.definition.pointsPerDamage, params.context);
			},
			//BASTION: Temporary HP lost -- soaked, spent, stripped or decayed -- builds Resolve, at the outfit's
			//own rate (`resolveLostPerPoint`, twice the ordinary 1:1 rate).
			onTemporarySpent: function (params) { honeycomb.resolveFromTemporaryLost(params); },
			onTemporaryRemoved: function (params) { honeycomb.resolveFromTemporaryLost(params); },
			onTemporaryDecayed: function (params) { honeycomb.resolveFromTemporaryLost(params); },
		},
	},
	{
		index: "thirst",
		characterIndex: "severine",
		//Runs only once Severine's Ability 1 node is bought: no ability, no orbs.
		abilityIndex: "severineBloodTap",
		name: "Thirst",
		description: "Three things Severine needs true at once. Quicken draws one card for each lit orb.",
		kind: "orbs",
		colorHint: "#d94f6e",
		//Nothing stored: each orb is asked about the board as it stands.
		orbArray: [
			{
				index: "bloodDrawn",
				name: "Blood drawn",
				description: "Severine has dealt damage this turn.",
				test: function (member) { return member.damageDealtThisTurn > 0; },
			},
			{
				index: "wounded",
				name: "Wounded",
				description: "Severine is below half health.",
				test: function (member) { return member.maxHealth > 0 && member.health * 2 < member.maxHealth; },
			},
			{
				index: "preyMarked",
				name: "Prey marked",
				description: "An enemy is below half health.",
				test: function (member, combat) {
					var opponentArray = honeycomb.livingEntityArray(honeycomb.opposingSide(member.side), combat);
					for (var scanIndex = 0; scanIndex < opponentArray.length; scanIndex++) {
						var opponent = opponentArray[scanIndex];
						if (opponent.maxHealth > 0 && opponent.health * 2 < opponent.maxHealth) return true;
					}
					return false;
				},
			},
		],
	},
	{
		index: "harvest",
		characterIndex: "nettle",
		//Runs only once Nettle's Ability 1 node is bought: no ability, no souls.
		abilityIndex: "nettleBlight",
		name: "Harvest",
		description: "A soul for every enemy that falls and every card burned away. Blight inflicts Poison for each Soul; Undead Army spends them all.",
		kind: "orb",
		colorHint: "#6bbf59",
		iconPath: "icons/skull",
		glyph: "skull",
		maximum: 5,
		//Rotsinger: Souls per Poison consume (one per card that consumes, however many stacks it took).
		soulsPerConsume: 1,
		resetOn: "combatStart",
		hooks: {
			//An enemy falling is a world event, so it arrives through the run hooks with `wearer` set to
			//whoever the source belongs to -- here, Nettle herself.
			onEnemyDowned: function (params) {
				honeycomb.addMechanic(params.wearer, params.definition.index, 1, params.context);
			},
			onCardExhausted: function (params) {
				//ROTSINGER: Souls come from consuming Poison instead of from burned cards.
				if (honeycomb.memberLoadoutFlag(params.wearer, "soulsFromConsumedPoison") == true) return;
				honeycomb.addMechanic(params.wearer, params.definition.index, 1, params.context);
			},
			onStatusConsumed: function (params) {
				if (params.status != "poison" || params.source == null || params.source !== params.wearer) return;
				if (honeycomb.memberLoadoutFlag(params.wearer, "soulsFromConsumedPoison") != true) return;
				honeycomb.addMechanic(params.wearer, params.definition.index, params.definition.soulsPerConsume, params.context);
			},
		},
	},

	//--- The three new characters. One of each widget kind again. ---
	{
		index: "stride",
		characterIndex: "cinder",
		//Runs only once Cinder's Ability 1 node is bought: no ability, no Stride.
		abilityIndex: "cinderBackflip",
		name: "Stride",
		description: "One for every place Cinder moves through the line, and one whenever she gains a debuff. Phoenix Dive spends it all.",
		kind: "orb",
		colorHint: "#f08a3a",
		iconPath: "icons/fire",
		glyph: "flame",
		maximum: 6,
		pointsPerDebuff: 1,
		resetOn: "combatStart",
		hooks: {
			onShifted: function (params) {
				if (params.distance > 0) honeycomb.addMechanic(params.entity, params.definition.index, params.distance, params.context);
			},
			//RECKLESSNESS: one Stride per debuff that lands on her, however many stacks it brings.
			onStatusApplied: function (params) {
				if (params.wearer == null || params.entity !== params.wearer) return;
				var status = honeycomb.findDefinition(honeycomb.statusArray, params.statusIndex);
				if (status == null || status.isDebuff != true) return;
				honeycomb.addMechanic(params.wearer, params.definition.index, params.definition.pointsPerDebuff, params.context);
			},
		},
	},
	{
		//Devotion is fed by healing herself and allies, 1-1 with each health and tHP given to any party
		//member. No longer fed by Lust.
		index: "devotion",
		characterIndex: "clemence",
		//Runs only once Clemence's Ability 1 node is bought: no ability, no Devotion.
		abilityIndex: "clemenceAbsolve",
		name: "Devotion",
		description: "One for every point of health or Temporary HP Clemence gives to anyone in the party, herself included. One with Nothing spends it all.",
		kind: "bar",
		colorHint: "#f0e0a0",
		maximum: 100,
		pointsPerGiven: 1,
		resetOn: "combatStart",
		hooks: {
			onAllyHealed: function (params) {
				var giver = params.context == null ? null : params.context.source;
				if (params.wearer == null || giver !== params.wearer || params.amount <= 0) return;
				honeycomb.addMechanic(params.wearer, params.definition.index, params.amount * params.definition.pointsPerGiven, params.context);
			},
			onAllyTemporaryGained: function (params) {
				if (params.wearer == null || params.source !== params.wearer || params.amount <= 0) return;
				honeycomb.addMechanic(params.wearer, params.definition.index, params.amount * params.definition.pointsPerGiven, params.context);
			},
		},
	},
	{
		//THE ORB, which replaced Foresight's plain count: four free slots (repeats allowed); a slot fills
		//with the type of an intent Cassadora
		//changes or turns; an A2 that reads the Orb spends it. The index stays "foresight" so saves carry over.
		index: "foresight",
		characterIndex: "cassadora",
		//Runs only once Cassadora's Ability 1 node is bought: no ability, no Orb.
		abilityIndex: "cassadoraGlimpse",
		name: "Orb",
		description: "{maximum} slots. Each enemy intent Cassadora changes or turns fills one with that move's type. Her second ability reads the symbols and empties the Orb.",
		kind: "slots",
		colorHint: "#5fa8f0",
		iconPath: "icons/flame-blue",
		glyph: "eye",
		maximum: 4,
		resetOn: "combatStart",
		hooks: {
			//The move she changed AWAY from is the one she foresaw, so its type is the symbol.
			onIntentChanged: function (params) {
				if (params.wearer == null || params.source !== params.wearer) return;
				honeycomb.addMechanicSymbol(params.wearer, params.definition.index, honeycomb.cardSymbolIndex(params.before), params.context);
			},
			onStatusApplied: function (params) {
				if (params.wearer == null || params.source !== params.wearer || params.statusIndex != "turncoat") return;
				var turned = params.entity == null ? null : params.entity.intentCardIndex;
				honeycomb.addMechanicSymbol(params.wearer, params.definition.index, honeycomb.cardSymbolIndex(turned), params.context);
			},
		},
	},
];

//BLOOD SAINT's A2 line: Sanctified exactly while all three Thirst orbs are lit, once the A2 node is bought.
//Only the halo this outfit granted is taken away, so Sanctified from anywhere else is left alone.
honeycomb.syncBloodSaintHalo = function (entity, context) {
	if (entity == null || entity.side != "ally" || context == null || context.combat == null) return;
	if (honeycomb.treeGrantsAbility(entity, "severineQuicken") == false) return;
	var mechanic = honeycomb.mechanicFor(entity);
	var orbCount = mechanic == null || mechanic.orbArray == null ? 0 : mechanic.orbArray.length;
	var lit = orbCount > 0 && honeycomb.mechanicOrbsLit(entity, context.combat) >= orbCount;
	var held = honeycomb.statusStacks(entity, "sanctified") > 0;
	if (lit && held == false) {
		honeycomb.applyStatus(entity, "sanctified", 1, context);
		entity.bloodSaintHalo = true;
	} else if (lit == false && held && entity.bloodSaintHalo == true) {
		honeycomb.removeStatus(entity, "sanctified", null, context);
		entity.bloodSaintHalo = false;
	}
};

//BASTION's Resolve: points for Temporary HP LOST, at `resolveLostPerPoint` tHP a point (the outfit's field),
//carried in the same remainder the ordinary gain rate uses. Does nothing for anyone else.
honeycomb.resolveFromTemporaryLost = function (params) {
	var entity = params.entity;
	if (entity == null || params.amount == null || params.amount <= 0) return;
	if (honeycomb.memberLoadoutFlag(entity, "resolveFromTemporaryLost") != true) return;
	var perPoint = honeycomb.memberFieldTotal(entity, "resolveLostPerPoint");
	if (perPoint <= 0) return;
	var carried = honeycomb.mechanicCarryArray(entity, params.definition.index);
	carried.remainder += params.amount;
	var gained = Math.floor(carried.remainder / perPoint);
	carried.remainder -= gained * perPoint;
	honeycomb.addMechanic(entity, params.definition.index, gained, params.context);
};

//---------------------------------------------------------------------------------------------------
//Equipment
//---------------------------------------------------------------------------------------------------
//Per-character gear. Shares the outfit modifier shape exactly, so anything an outfit can do,
//equipment can do, and the deck assembly code treats them identically.
//
//Equipment is a thing ONE character holds at a time (wearing it takes it off whoever had
//it), has a rarity, and the old starting relics are HEIRLOOMS: equipment wearable only by
//the character named in `characterIndex`, worn from the first run (`startingEquipmentArray` on the
//character). See honeycomb.equipment in honeycomb-state.js.
//
//There are no weapon / armour / trinket slots: all a piece says about itself is whether
//it is GENERIC or one character's HEIRLOOM (honeycomb.equipmentKindArray, derived from characterIndex).
//Rarity is independent of that, so a character can have common heirlooms to start in and rare ones to
//find, without the starting pieces being the strongest in the game.
//  rarity          see honeycomb.equipmentRarityArray
//  characterIndex  only this character may wear it -- which is what makes it an heirloom
//An heirloom's effect reaches the whole party even though one character wears it: its hooks act on
//every ally, and world events (an enemy falling) reach worn equipment as they reach relics.

//`order` sorts rarest first under the Rarity sort.
//UNCOMMON IS RETIRED. Nothing carries it now -- fourteen relics and one heirloom were
//moved off it -- so the row is gone rather than left as a tier nothing can reach. `order` skips 2 on
//purpose, since every reader looks a rarity up by name rather than walking this list.
honeycomb.equipmentRarityArray = [
	{ index: "common", name: "Common", color: "#c9c2d6", order: 1 },
	{ index: "rare", name: "Rare", color: "#e8c86a", order: 3 },
];

honeycomb.equipmentArray = [
	//--- Heirlooms: the starting relics, now worn. ---
	{
		index: "ironSigil",
		name: "Iron Sigil",
		description: "The party starts each combat with 4 Temporary HP each.",
		iconPath: "icons/relic-sigil",
		rarity: "common",
		characterIndex: "brienne",
		unlockedFromStart: true,
		temporaryAmount: 4,
		hooks: {
			//Worn by one character, felt by all: the hook fires once, for the wearer, and covers
			//every ally. Granted through the shared path so it is logged, capped and heard by Resolve
			//exactly as a card's would be -- writing the field directly is what made the old Iron Sigil
			//invisible to the battle log.
			onCombatStart: function (params) {
				var allyArray = honeycomb.livingEntityArray("ally", params.context.combat);
				for (var allyIndex = 0; allyIndex < allyArray.length; allyIndex++) {
					honeycomb.grantTemporaryHealth(allyArray[allyIndex], params.definition.temporaryAmount, params.context);
				}
			},
		},
	},
	{
		index: "shadowLocket",
		name: "Shadow Locket",
		description: "Start each combat with 1 additional Energy.",
		iconPath: "icons/relic-locket",
		rarity: "common",
		characterIndex: "nettle",
		unlockedFromStart: true,
		energyBonus: 1,
		hooks: {
			//Energy is folded across every living ally once, so this adds exactly one.
			modifyEnergyPerTurn: function (amount, params) {
				//Only the opening turn, so it is a tempo item rather than a permanent economy shift.
				if (params.context == null || params.context.combat == null) return amount;
				if (params.context.combat.turnNumber != 1) return amount;
				return amount + params.definition.energyBonus;
			},
		},
	},
	{
		index: "crimsonFang",
		name: "Crimson Fang",
		description: "Whenever an enemy is downed, all allies heal 3 HP.",
		iconPath: "icons/relic-fang",
		rarity: "common",
		characterIndex: "severine",
		unlockedFromStart: true,
		healAmount: 3,
		hooks: {
			//A world event: honeycomb.fireRunHooks reaches worn equipment as well as relics.
			onEnemyDowned: function (params) {
				var allyArray = honeycomb.livingEntityArray("ally", params.context.combat);
				for (var allyIndex = 0; allyIndex < allyArray.length; allyIndex++) {
					honeycomb.healEntity(allyArray[allyIndex], params.definition.healAmount, params.context);
				}
			},
		},
	},

	//--- The new characters' heirlooms. ---
	{
		//THE LUCKY HAT, replacing Cinder's Ember Spur. The Ember Spur stood her at the back of every fight.
		//
		//`rewardReroll` is the field a progression node uses for the same thing (Second Chance), summed
		//across the party at run start by honeycomb.partyFieldTotal -- so an heirloom carrying it needed
		//no engine change at all.
		//
		//IT IS WHAT MAKES THE MULLIGAN STONE REACHABLE. The Stone refills the reroll pool, which is gated on
		//there being a pool; before this, nothing but a tree node ever made one.
		index: "luckyHat",
		name: "Lucky Hat",
		description: "Two extra reward rerolls each run.",
		iconPath: "icons/target-rings",
		rarity: "common",
		tagArray: ["trinket"],
		characterIndex: "cinder",
		unlockedFromStart: true,
		rewardReroll: 2,
		//THE BACK-START IS GONE ON PURPOSE: the player can reposition the party at teambuilding, and moving
		//to the back naturally happens in an active party anyway. The Ember Spur stood her at the back of
		//every fight; nothing does now.
	},
	{
		//ANASTASIA'S, and the last thing the warning report was still asking for.
		//
		//IT PAYS HER FOR SPENDING BODIES, which is the one thing her whole kit does and the one thing
		//nothing else rewards. Every sacrifice card, every Pawn that falls holding the line, every
		//Desperado -- each hands the party's front an inch of wall. Worn by her, felt by everyone, as
		//every heirloom is.
		//
		//DELIBERATELY NOT ENERGY: Deep Calculation is the answer to an energy shortage now and it is a RARE,
		//so an
		//heirloom that also printed Energy would make the rare redundant from turn one. AND DELIBERATELY
		//NOT A FREE PAWN: `Prepared Line` on her tree already puts one down at combat start, and an
		//heirloom duplicating a node makes the node worthless.
		//ASSUMED, and cheap to veto: one table entry and one field on her character entry.
		index: "grandmastersPocketwatch",
		name: "Pocketwatch",
		description: "When a piece falls, the ally in front gains 4 Temporary HP.",
		iconPath: "icons/relic-sigil",
		rarity: "common",
		characterIndex: "anastasia",
		unlockedFromStart: true,
		temporaryAmount: 4,
		hooks: {
			//Fires for the WEARER when any ally goes down -- the same hook her Pawn Structure node uses --
			//so it hears her pieces falling wherever in the line they stood.
			onAllyDowned: function (params) {
				if (params.wearer == null) return;
				var found = honeycomb.entityDefinition(params.entity);
				if (found == null || found.kind != "enemy") return;
				if (honeycomb.definitionHasTag(found.definition, "golem") != true) return;
				var front = honeycomb.frontOf(params.wearer.side, params.context == null ? null : params.context.combat);
				if (front == null) return;
				honeycomb.grantTemporaryHealth(front, params.definition.temporaryAmount, params.context);
			},
		},
	},
	{
		//Replaced the Rosary of Thorns: Composure worked against a character who wants her Lust.
		index: "votiveCandle",
		name: "Votive Candle",
		description: "When Clemence Breaks, ALL allies heal 5 HP and the party gains 1 Energised.",
		iconPath: "icons/fire",
		rarity: "common",
		characterIndex: "clemence",
		unlockedFromStart: true,
		healAmount: 5,
		energisedStacks: 1,
		hooks: {
			//Worn by Clemence, so this hears HER breaking.
			onBroken: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null) return;
				var allyArray = honeycomb.livingEntityArray(params.entity.side, combat);
				for (var allyIndex = 0; allyIndex < allyArray.length; allyIndex++) {
					honeycomb.healEntity(allyArray[allyIndex], params.definition.healAmount, params.context);
				}
				honeycomb.applyStatus(params.entity, "energised", params.definition.energisedStacks, params.context);
			},
		},
	},
	{
		index: "crystalBall",
		name: "Crystal Ball",
		description: "Draw 1 additional card on the first turn of each combat.",
		iconPath: "icons/gem-blue",
		rarity: "common",
		characterIndex: "cassadora",
		unlockedFromStart: true,
		drawBonus: 1,
		hooks: {
			modifyDrawPerTurn: function (amount, params) {
				if (params.context == null || params.context.combat == null || params.context.combat.turnNumber != 1) return amount;
				return amount + params.definition.drawBonus;
			},
		},
	},

	//--- Shared gear ---
	{
		index: "whetstone",
		name: "Whetstone",
		description: "+2 damage on the first attack each turn.",
		iconPath: "icons/equipment-whetstone",
		rarity: "common",
		tagArray: ["weapon"],
		unlockedFromStart: true,
		damageBonus: 2,
		hooks: {
			onTurnStart: function (params) {
				//A per-turn charge lives on the entity rather than the definition, since definitions
				//are shared between every character carrying the item.
				params.entity.whetstoneReady = true;
			},
			modifyDamageDealt: function (amount, params) {
				if (params.entity.whetstoneReady != true) return amount;
				//A PREVIEW ASKS; IT DOES NOT SPEND. honeycomb.modifiedDamage is shared by the real hit and
				//by every live number printed on a card in hand, and the hand is re-described every beat --
				//so spending the charge here left the play itself with nothing.
				if (params.context == null || params.context.preview != true) params.entity.whetstoneReady = false;
				return amount + params.definition.damageBonus;
			},
		},
	},
	{
		index: "heavyPauldrons",
		name: "Heavy Pauldrons",
		description: "+8 Max HP, but Temporary HP gained is reduced by 1.",
		iconPath: "icons/equipment-pauldrons",
		rarity: "common",
		tagArray: ["ward"],
		unlockedFromStart: true,
		healthModifier: 8,
		temporaryPenalty: 1,
		hooks: {
			modifyTemporaryHealthGained: function (amount, params) {
				return Math.max(0, amount - params.definition.temporaryPenalty);
			},
		},
	},
	{
		index: "thiefGloves",
		name: "Thief's Gloves",
		description: "Adds a Second Wind to the deck.",
		iconPath: "icons/equipment-gloves",
		rarity: "common",
		tagArray: ["support"],
		cardAdditionArray: [{ index: "neutralFocus", count: 1 }],
		//Equipment may grant an ABILITY as readily as a card; both pools take the same modifier shape.
		abilityAdditionArray: [{ index: "neutralSecondWind" }],
	},
	{
		//A RARE heirloom: Brienne's to find, where the Iron Sigil is hers to start in.
		//It only ever rewrote her cards, and Keen Edge on her tree is what unlocks it.
		index: "duelistBlade",
		name: "Duelist's Blade",
		description: "Sword Strike becomes Riposte: a stronger attack that costs more.",
		iconPath: "icons/equipment-blade",
		rarity: "rare",
		characterIndex: "brienne",
		tagArray: ["weapon"],
		tagAdditionArray: ["striker"],
		cardReplacementArray: [{ from: "brienneCleave", to: "brienneRiposte" }],
	},
];

//---------------------------------------------------------------------------------------------------
//Relics
//---------------------------------------------------------------------------------------------------
//Run-wide passives shared by the whole party. Same hook table again; the only difference from
//equipment is scope.
honeycomb.relicArray = [
	{
		index: "bonePendant",
		name: "Bone Pendant",
		description: "Draw 1 additional card each turn.",
		iconPath: "icons/relic-pendant",
		rarity: "rare",
		drawBonus: 1,
		hooks: {
			modifyDrawPerTurn: function (amount, params) {
				return amount + params.definition.drawBonus;
			},
		},
	},
	{
		index: "gildedLedger",
		name: "Gilded Ledger",
		description: "Gain 15 extra gold from every combat.",
		iconPath: "icons/relic-ledger",
		rarity: "common",
		goldBonus: 15,
	},
	{
		index: "cracksealWax",
		name: "Crackseal Wax",
		description: "The first debuff applied to each ally in a combat is negated.",
		iconPath: "icons/relic-wax",
		rarity: "rare",
		hooks: {
			onCombatStart: function (params) {
				honeycomb.applyStatus(params.entity, "artifact", 1, params.context);
			},
		},
	},

	//--- One relic per sister mechanic (MECHANICS-01.md, part 4). Each is offered by chance only
	//while its character is in the party (`offerCondition`, honeycomb.relicOfferable). ---
	{
		index: "gildedGauntlet",
		name: "Gilded Gauntlet",
		description: "Party attacks deal 1 additional damage for every 8 Temporary HP the attacker holds.",
		iconPath: "icons/shield-sword-red",
		rarity: "rare",
		archetype: "armament",
		offerCondition: { index: "partyContains", character: "brienne" },
		temporaryPerPoint: 8,
		hooks: {
			modifyDamageDealt: function (amount, params) {
				if (params.entity == null || params.entity.side != "ally") return amount;
				if (params.entry != null && params.entry.ignoresStrength == true) return amount;
				var held = params.entity.temporaryHealth == null ? 0 : params.entity.temporaryHealth;
				return amount + Math.floor(held / params.definition.temporaryPerPoint);
			},
		},
	},
	{
		index: "oathboundBanner",
		name: "Oathbound Banner",
		description: "Whenever an ally's Temporary HP absorbs an enemy's hit, deal 2 damage to the attacker.",
		iconPath: "icons/swords-crossed",
		rarity: "common",
		archetype: "sentinel",
		offerCondition: { index: "partyContains", character: "brienne" },
		damage: 2,
		hooks: {
			onTemporaryAbsorbed: function (params) {
				var attacker = params.source;
				if (attacker == null || attacker.downed == true || params.entity.side != "ally" || attacker.side == "ally") return;
				//No source of its own, so nothing answers the answer.
				honeycomb.dealDamage(null, attacker, params.definition.damage, { ignoresStrength: true, damageType: "banner" }, params.context);
			},
		},
	},
	{
		index: "collectionPlate",
		name: "Collection Plate",
		description: "The first time each turn anyone in the party spends Temporary HP, draw 1 card.",
		iconPath: "icons/coins",
		rarity: "common",
		archetype: "tithe",
		offerCondition: { index: "partyContains", character: "brienne" },
		drawAmount: 1,
		hooks: {
			onTemporarySpent: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null || combat.collectionPlateTurn == combat.turnNumber) return;
				combat.collectionPlateTurn = combat.turnNumber;
				honeycomb.drawCards(params.definition.drawAmount, params.context);
			},
		},
	},
	{
		index: "crackedAmpoule",
		name: "Cracked Ampoule",
		description: "Poison deals 50% more damage to Weak enemies.",
		iconPath: "icons/potion-blue",
		rarity: "common",
		archetype: "rupture",
		offerCondition: { index: "partyContains", character: "nettle" },
		poisonMultiplier: 1.5,
		hooks: {
			modifyOpponentDamageTaken: function (amount, params) {
				if (params.entry == null || params.entry.damageType != "poison") return amount;
				if (honeycomb.statusStacks(params.entity, "weak") <= 0) return amount;
				return amount * params.definition.poisonMultiplier;
			},
		},
	},
	{
		index: "ratKingsBell",
		name: "Rat King's Bell",
		description: "When a poisoned enemy falls, every other enemy gains half its Poison.",
		iconPath: "icons/skull-horned",
		rarity: "rare",
		archetype: "contagion",
		offerCondition: { index: "partyContains", character: "nettle" },
		spreadFraction: 0.5,
		hooks: {
			onEnemyDowned: function (params) {
				var fallen = params.entity;
				var combat = params.context == null ? null : params.context.combat;
				var poison = Math.ceil(honeycomb.statusStacks(fallen, "poison") * params.definition.spreadFraction);
				if (combat == null || poison <= 0) return;
				var enemyArray = honeycomb.livingEntityArray(fallen.side, combat);
				for (var enemyIndex = 0; enemyIndex < enemyArray.length; enemyIndex++) {
					if (enemyArray[enemyIndex] !== fallen) honeycomb.applyStatus(enemyArray[enemyIndex], "poison", poison, params.context);
				}
			},
		},
	},
	{
		index: "honeyedThorn",
		name: "Honeyed Thorn",
		description: "Poisoned enemies take 2 additional Lust from everything.",
		iconPath: "icons/heart-devil",
		rarity: "common",
		archetype: "venom",
		offerCondition: { index: "partyContains", character: "nettle" },
		lustBonus: 2,
		hooks: {
			modifyOpponentLustGained: function (amount, params) {
				if (amount <= 0 || honeycomb.statusStacks(params.entity, "poison") <= 0) return amount;
				return amount + params.definition.lustBonus;
			},
		},
	},
	{
		index: "trophyCord",
		name: "Trophy Cord",
		description: "When an enemy with a debuff falls, draw 1 card.",
		iconPath: "icons/dagger",
		rarity: "common",
		archetype: "feast",
		offerCondition: { index: "partyContains", character: "severine" },
		drawAmount: 1,
		hooks: {
			onEnemyDowned: function (params) {
				if (honeycomb.debuffCount(params.entity) <= 0) return;
				honeycomb.drawCards(params.definition.drawAmount, params.context);
			},
		},
	},
	{
		index: "leechJar",
		name: "Leech Jar",
		description: "The first time each turn the party damages one of its own, gain 1 Energy.",
		iconPath: "icons/potion-red",
		rarity: "rare",
		archetype: "bloodletting",
		offerCondition: { index: "partyContains", character: "severine" },
		energyAmount: 1,
		hooks: {
			onAllyHealthLost: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null || combat.phase != "playerTurn" || params.source == null || params.source.side != "ally") return;
				if (combat.leechJarTurn == combat.turnNumber) return;
				combat.leechJarTurn = combat.turnNumber;
				honeycomb.addResource("energy", params.definition.energyAmount);
				honeycomb.logEvent(params.context, { type: "resource", resource: "energy", amount: params.definition.energyAmount });
			},
		},
	},
	{
		index: "vitaeChalice",
		name: "Vitae Chalice",
		description: "Whenever an ally is healed, they also lose 2 Lust.",
		iconPath: "icons/heart-glow-pink",
		rarity: "common",
		archetype: "transfusion",
		offerCondition: { index: "partyContains", character: "severine" },
		lustRemoved: 2,
		hooks: {
			onAllyHealed: function (params) {
				honeycomb.reduceLust(params.entity, params.definition.lustRemoved, params.context);
			},
		},
	},

	//--- The new characters' sister mechanics. ---
	{
		index: "spurOfEmbers",
		name: "Spur of Embers",
		description: "The party member at the front deals 2 more damage with attacks.",
		iconPath: "icons/flame",
		rarity: "common",
		offerCondition: { index: "partyContains", character: "cinder" },
		frontDamageBonus: 2,
		hooks: {
			modifyDamageDealt: function (amount, params) {
				var entity = params.entity;
				if (entity == null || entity.side != "ally") return amount;
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null) return amount;
				if (honeycomb.entityRank(entity, combat) !== 0) return amount;
				if (params.entry != null && params.entry.ignoresStrength == true) return amount;
				return amount + params.definition.frontDamageBonus;
			},
		},
	},
	{
		index: "marchingDrum",
		name: "Marching Drum",
		description: "The first time each turn a party member moves 2 or more places at once, draw 1 card.",
		iconPath: "icons/figure-running",
		rarity: "common",
		archetype: "formation",
		offerCondition: { index: "partyContains", character: "cinder" },
		minimumDistance: 2,
		drawAmount: 1,
		hooks: {
			onPartyShifted: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null || combat.phase != "playerTurn" || params.distance < params.definition.minimumDistance) return;
				if (combat.marchingDrumTurn == combat.turnNumber) return;
				combat.marchingDrumTurn = combat.turnNumber;
				honeycomb.drawCards(params.definition.drawAmount, params.context);
			},
		},
	},
	{
		index: "prayerBeads",
		name: "Prayer Beads",
		description: "The first time each turn a party member gains Lust from their own card, gain 1 Energy.",
		iconPath: "icons/heart-crowned",
		rarity: "common",
		archetype: "devotion",
		offerCondition: { index: "partyContains", character: "clemence" },
		energyAmount: 1,
		hooks: {
			onLustGained: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null || combat.phase != "playerTurn" || params.entity.side != "ally" || params.context.source !== params.entity) return;
				if (combat.prayerBeadsTurn == combat.turnNumber) return;
				combat.prayerBeadsTurn = combat.turnNumber;
				honeycomb.addResource("energy", params.definition.energyAmount);
				honeycomb.logEvent(params.context, { type: "resource", resource: "energy", amount: params.definition.energyAmount });
			},
		},
	},
	{
		index: "reliquaryOfTears",
		name: "Reliquary of Tears",
		description: "Whenever a party member Breaks, ALL enemies take 6 Lust.",
		iconPath: "icons/potion-blue",
		rarity: "common",
		archetype: "rapture",
		offerCondition: { index: "partyContains", character: "clemence" },
		lustAmount: 6,
		lustTagArray: ["exposure"],
		hooks: {
			onAllyBroken: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null) return;
				var enemyArray = honeycomb.livingEntityArray("enemy", combat);
				for (var enemyIndex = 0; enemyIndex < enemyArray.length; enemyIndex++) {
					honeycomb.gainLust(enemyArray[enemyIndex], params.definition.lustAmount, { tagArray: params.definition.lustTagArray }, params.context);
				}
			},
		},
	},
	{
		index: "haloOfThorns",
		name: "Halo of Thorns",
		description: "Broken party members heal 4 HP at the start of each turn.",
		iconPath: "icons/wings-halo",
		rarity: "common",
		archetype: "sanctuary",
		offerCondition: { index: "partyContains", character: "clemence" },
		healAmount: 4,
		hooks: {
			//Heard per ally after the turn's recovery check, so it holds a broken member up without standing them up.
			onTurnStart: function (params) {
				if (params.entity == null || params.entity.side != "ally" || params.entity.broken != true) return;
				honeycomb.healEntity(params.entity, params.definition.healAmount, params.context);
			},
		},
	},
	{
		index: "crackedHourglass",
		name: "Cracked Hourglass",
		description: "Whenever an enemy's intent is changed, draw 1 card. At most twice a turn.",
		iconPath: "icons/question-mark",
		rarity: "rare",
		archetype: "hex",
		offerCondition: { index: "partyContains", character: "cassadora" },
		drawAmount: 1,
		triggersPerTurn: 2,
		hooks: {
			onIntentChanged: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null || params.entity.side == "ally") return;
				if (combat.hourglassTurn != combat.turnNumber) { combat.hourglassTurn = combat.turnNumber; combat.hourglassCount = 0; }
				if (combat.hourglassCount >= params.definition.triggersPerTurn) return;
				combat.hourglassCount += 1;
				honeycomb.drawCards(params.definition.drawAmount, params.context);
			},
		},
	},
	{
		//DOMINION ROD, replacing the Copycat Quill.
		//
		//UNGATED, DELIBERATELY. The Quill named Cassadora, and twelve of the pool's twenty-five relics name
		//a character, which is why a solo or duo run sees so little of it. Nothing in the game granted a
		//banish before this: every one came from a progression node (`rework/starters/RELIC-REWARDS.md` §3).
		index: "dominionRod",
		name: "Dominion Rod",
		description: "When found, gain 6 banishes for this run.",
		iconPath: "icons/shard",
		rarity: "rare",
		banishGrant: 6,
		onGain: function () { honeycomb.addResource("banish", honeycomb.findDefinition(honeycomb.relicArray, "dominionRod").banishGrant); },
	},
	{
		//Replaced the Two-Faced Mask ("too specific"): this one pays out every fight, with no setup.
		index: "sleightPurse",
		name: "Sleight Purse",
		description: "At the start of each combat, a copy of one of a random enemy's moves goes into your hand. It costs 0 and exhausts.",
		iconPath: "icons/bag",
		rarity: "common",
		archetype: "turncoat",
		offerCondition: { index: "partyContains", character: "cassadora" },
		hooks: {
			//Relics are heard once per ally at combat start, so only the first ally's pass acts.
			onCombatStart: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null || params.entity !== honeycomb.livingEntityArray("ally", combat)[0]) return;
				var purseContext = honeycomb.newEffectContext({ combat: combat, log: params.context.log });
				honeycomb.applyResolvedTargets(purseContext, "randomEnemy", honeycomb.resolveTargetMode("randomEnemy", purseContext));
				var mark = purseContext.target;
				var moveIndexArray = mark == null ? [] : honeycomb.moveIndexArray(mark);
				if (moveIndexArray.length === 0) return;
				var cardIndex = honeycomb.rng.pick(honeycomb.tuning.rng.streamArray.combat, moveIndexArray);
				var owner = null;
				var partyArray = honeycomb.livingEntityArray("ally", combat);
				for (var partyIndex = 0; partyIndex < partyArray.length; partyIndex++) {
					if (partyArray[partyIndex].characterIndex == "cassadora") owner = partyArray[partyIndex];
				}
				honeycomb.giveStolenCard(cardIndex, owner == null ? params.entity : owner, mark.enemyIndex, purseContext);
			},
		},
	},

	//--- Three GENERIC relics, for the elite/boss prize pool. Nothing outside themselves --
	//no character, no archetype, no offerCondition -- so any party can find them. Exactly the kind of
	//simple always-on effect the elite relic chance wants to hand out. ---
	{
		index: "wardstone",
		name: "Wardstone",
		description: "Whenever a party member gains Temporary HP, they gain 2 more.",
		iconPath: "icons/shield-plain",
		rarity: "common",
		temporaryBonus: 2,
		hooks: {
			modifyTemporaryHealthGained: function (amount, params) {
				return amount + params.definition.temporaryBonus;
			},
		},
	},
	{
		index: "travelersLantern",
		name: "Traveler's Lantern",
		description: "At the start of each combat, draw 1 additional card.",
		iconPath: "icons/fire",
		rarity: "common",
		drawAmount: 1,
		hooks: {
			//Relics are heard once per ally at combat start, so only the first ally's pass acts.
			onCombatStart: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null || params.entity !== honeycomb.livingEntityArray("ally", combat)[0]) return;
				honeycomb.drawCards(params.definition.drawAmount, params.context);
			},
		},
	},
	{
		index: "pilgrimsBell",
		name: "Pilgrim's Bell",
		description: "Whenever an enemy is beaten, the most hurt party member heals 4 HP.",
		iconPath: "icons/heart-glow-pink",
		rarity: "common",
		healAmount: 4,
		hooks: {
			onEnemyDowned: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				var receiver = combat == null ? null : honeycomb.mostHurtEntity("ally", combat);
				if (receiver != null) honeycomb.healEntity(receiver, params.definition.healAmount, params.context);
			},
		},
	},
	{
		//A RARE GENERIC: rerolls are a run-long pool, and this refills it to the full total
		//the run has ever been granted -- nodes, relics, and anything else that grants one -- after every
		//battle. It never raises the total, so it does not stack into more rerolls than were earned.
		index: "mulliganStone",
		name: "Mulligan Stone",
		description: "After every battle, your rerolls refill to their full total.",
		iconPath: "icons/target-rings",
		rarity: "rare",
		//IT REFILLS A POOL, SO THE POOL HAS TO EXIST. Refilling nothing to nothing is a dead rare, and a
		//rare is the
		//slot a run can least afford to waste.
		offerCondition: {
			index: "compare",
			left: { index: "resource", resource: "reroll", maximum: true },
			right: { index: "fixed", amount: 0 },
			operation: "greater",
		},
		resourceRefreshArray: ["reroll"],
		hooks: {
			onCombatEnd: function (params) {
				if (params.outcome != "victory") return;
				var list = params.definition.resourceRefreshArray == null ? [] : params.definition.resourceRefreshArray;
				for (var refreshIndex = 0; refreshIndex < list.length; refreshIndex++) {
					honeycomb.setResource(list[refreshIndex], honeycomb.resourceMaximum(list[refreshIndex]));
				}
			},
		},
	},

	//>>> LANE ANA | gauntlet | relic >>>
	{
		//THE INVITATION. Held when the run leaves the first region, it outranks the boss-decides-the-route
		//rule
		//(ANA's row in tuning.map.route.overrideArray) and sends the run into the gauntlet. THAT IS THE
		//WHOLE OF WHAT IT DOES -- no hooks, no numbers.
		//
		//HOW IT IS FOUND: THE SHOP SELLS IT, and nothing else hands it out.
		//`pool: "gauntlet"` keeps it out of treasure, fight rewards and the shop's ordinary roll;
		//`shopGuaranteed` gives it a shelf slot of its own in every shop (honeycomb.shop.guaranteedRelicArray)
		//while its `offerCondition` holds -- the release switch is on, she is not yet earned, the run is
		//still in its first region, and (tuning, on by default) the profile has cleared every route.
		//
		//THE NAME NAMES A GRANDMASTER and no one in particular; the description still says
		//nothing of who sent it, since a player reads this before the secret is out.
		index: "gauntletInvitation",
		name: "Grandmaster's Invitation",
		description: "Black wax, no name. While it is held, the next descent leads somewhere else.",
		iconPath: "icons/relic-ledger",
		//HC-PLACEHOLDER: borrows the ledger's icon until it has its own.
		artOwed: true,
		rarity: "rare",
		pool: "gauntlet",
		shopGuaranteed: true,
		offerCondition: { index: "gauntletOpen" },
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
	},
	//<<< LANE ANA | gauntlet | relic <<<
];
