//===================================================================================================
//HONEYCOMB CATACOMBS -- the common enemy and encounter pool, DRAFT 01 (enemies/ S64-1, session 66)
//===================================================================================================
//A DRAFT, NOT GAME CODE. Nothing loads this file. It is applied over a headless engine by
//tools/common-draft-audit.js so the drafted pool can be graded by the same instruments the live tables
//are graded by (enemy-template, lust-share, Basic Bite, coverage), and it is written in the live tables'
//own shape so that the desktop session that lands it copies entries rather than translating prose.
//
//The design it encodes is enemies/COMMON-ENCOUNTERS-01.md. Every name is a proposal (E9). Every number
//is a first draft written to tuning.balance; the rebalance waits for the Crunch (S65-1).
//
//What it does when applied:
//  1. two roles join tuning.balance.enemyRoleArray: `swarm` (a body that comes in fives) and `lone` (a
//     body that fights alone);
//  2. five bodies are retuned to those roles (Shieldcap, Briar Brat -> swarm; Bolete Hook, Windfall
//     Alraune, Glutton -> lone) and four are added (Doorward, Dustmote, Courtier, The Dandy);
//  3. the ordinary encounters of act 1-1 and the three routes are REPLACED by the drafted pools; elites,
//     bosses, fixtures and the gauntlet are untouched;
//  4. the pooled enemies' Lust moves are tagged to the act-1 set (venom, exposure, heat) as E14 asks; a
//     `heat` card tag is registered if the engine has none yet, and Heat moves keep their direct Lust
//     until the Heat status exists.
(function () {
	var draft = {};

	//---------------------------------------------------------------------------------------------------
	//Roles
	//---------------------------------------------------------------------------------------------------
	//Shares of the region's EARLY normal group, like every other role. A swarm body is a fifth of a
	//fight, so five of them are one fight; a lone body is the whole of one, and its damage share is the
	//solo factor over the group factor (1.2 / 1.8), because a solo never loses members mid-fight.
	draft.roleArray = [
		{ index: "swarm", healthShare: 0.20, damageShare: 0.20, before: "minion" },
		{ index: "lone", healthShare: 1.00, damageShare: 0.67, before: "elite" },
	];

	//---------------------------------------------------------------------------------------------------
	//Retags (E14). Only the moves of enemies the drafted pools field. Bosses and elites are S64-2 / S64-3.
	//---------------------------------------------------------------------------------------------------
	draft.retagArray = [
		{ card: "gloomWispBeguile", tagArray: ["exposure"] },   //a light in the dark that finds you
		{ card: "alchemistBrew", tagArray: ["heat"] },          //her fumes are catching
		{ card: "capBrutePin", tagArray: ["heat"] },            //a grapple, blood up
		{ card: "sentinelBash", tagArray: ["heat"] },
		{ card: "eelConstrict", tagArray: ["heat"] },           //the lattice closing
		{ card: "jellyLure", tagArray: ["exposure"] },          //lamplit
		{ card: "jellyPulse", tagArray: ["exposure"] },
		{ card: "mantleDust", tagArray: ["exposure"] },
		{ card: "longwingSway", tagArray: ["exposure"] },
		{ card: "longwingStoop", tagArray: ["exposure"] },
		{ card: "soakcapSpill", tagArray: ["exposure"] },
		{ card: "soakcapSplash", tagArray: ["exposure"] },
	];

	//---------------------------------------------------------------------------------------------------
	//Retunes: existing bodies moved to the new roles. Weaker per body than what shipped, never stronger.
	//---------------------------------------------------------------------------------------------------
	draft.retuneArray = [
		{
			//The Frontier's swarm. Five pavises in a row; Plated stays, so a sweep is the wrong answer.
			enemy: "siltCrawler", role: "swarm", baseHealth: 25, healthVariance: 2,
			cardAmountArray: [
				{ card: "crawlerPinch", path: "effectArray.0.amount", amount: 8 },
				{ card: "crawlerScuttle", path: "effectArray.0.amount", amount: 5 },
				{ card: "crawlerBurrow", path: "effectArray.0.amount", amount: 5 },
			],
		},
		{
			//The Arbor's swarm. Five thorn loops trip the front rank all fight; each one is a nuisance.
			enemy: "thornSprite", role: "swarm", baseHealth: 25, healthVariance: 2,
			cardAmountArray: [
				{ card: "spriteLash", path: "effectArray.0.amount", amount: 7 },
				{ card: "spriteSnare", path: "effectArray.0.stacks", amount: 2 },
				{ card: "spriteSnare", path: "effectArray.1.amount", amount: 2 },
				{ card: "spriteTangle", path: "effectArray.0.amount", amount: 3 },
			],
		},
		{
			//The Frontier's lone. The same slow tentacled bolete, met alone; Heave is the tell.
			enemy: "bogToad", role: "lone", baseHealth: 120, healthVariance: 6,
			addMoveArray: [{ card: "toadHeave", weight: 30, maximumInARow: 1, chargeCost: 3 }],
		},
		{
			//The Arbor's lone. She is delighted to share, and there is nobody else to share with.
			enemy: "fruitAlraune", role: "lone", baseHealth: 120, healthVariance: 6,
			addMoveArray: [{ card: "fruitOverripe", weight: 30, maximumInARow: 1, chargeCost: 3 }],
		},
		{
			//Act 1-1's lone, and the Mold Leech reconceived (E7-DEFERRED: reconceptualise, not cut). One big
			//round body that eats: every bite feeds it, and a party that dawdles watches it grow.
			enemy: "moldLeech", name: "Glutton", role: "lone", baseHealth: 70, healthVariance: 4,
			presentation: { scale: 1.3 },
			cardAmountArray: [{ card: "leechLatch", path: "effectArray.0.amount", amount: 12 }],
			cardNameArray: [{ card: "leechLatch", name: "Bite" }],
			moveArray: [
				{ card: "leechLatch", weight: 45, maximumInARow: 2 },
				{ card: "leechSiphon", weight: 25 },
				{ card: "leechEngorge", weight: 15, maximumInARow: 1 },
				{ card: "leechGulp", weight: 30, maximumInARow: 1, chargeCost: 3 },
			],
		},
	];

	//---------------------------------------------------------------------------------------------------
	//New cards
	//---------------------------------------------------------------------------------------------------
	draft.cardArray = [
		//Glutton
		{ index: "leechGulp", name: "Gulp", enemyIndex: "moldLeech", rarity: "enemy", costArray: {}, targetMode: "allEnemies", chargeCost: 3,
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "damage", amount: 8 }, { index: "heal", amount: 8, targetOverride: "self" }] },
		//Bolete Hook
		{ index: "toadHeave", name: "Heave", enemyIndex: "bogToad", rarity: "enemy", costArray: {}, targetMode: "allEnemies", chargeCost: 3,
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "damage", amount: 10 }] },
		//Windfall Alraune
		{ index: "fruitOverripe", name: "Overripe", enemyIndex: "fruitAlraune", rarity: "enemy", costArray: {}, targetMode: "allEnemies", chargeCost: 3,
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "damage", amount: 8 }, { index: "applyStatus", status: "festering", stacks: 1 }] },

		//--- Doorward (soldier, Frontier). SHIELD WALL: every third turn it plants itself -- Taunt and
		//--- Temporary HP -- and whoever stands behind it is out of a single target's reach until it swings
		//--- again. A sweep still goes past it, so it is a rhythm, not a wall. ---
		{ index: "doorwardWall", name: "Shield Wall", enemyIndex: "doorward", rarity: "enemy", costArray: {}, targetMode: "self",
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "applyStatus", status: "taunt", stacks: 1 }, { index: "temporaryHealth", amount: 10 }] },
		{ index: "doorwardMace", name: "Mace", enemyIndex: "doorward", rarity: "enemy", costArray: {}, targetMode: "frontEnemy",
			effectArray: [{ index: "damage", amount: 13 }] },
		{ index: "doorwardSweep", name: "Rim Sweep", enemyIndex: "doorward", rarity: "enemy", costArray: {}, targetMode: "allEnemies",
			effectArray: [{ index: "damage", amount: 6 }] },

		//--- Dustmote (swarm, Road). DUST: a cloud of little moths. Nothing they do is aimed, and every one
		//--- of them sheds a pinch of pollen. ---
		{ index: "dustmoteFlit", name: "Flit", enemyIndex: "dustmote", rarity: "enemy", costArray: {}, targetMode: "frontEnemy",
			effectArray: [{ index: "damage", amount: 5 }] },
		{ index: "dustmoteShed", name: "Shed Dust", enemyIndex: "dustmote", rarity: "enemy", costArray: {}, targetMode: "allEnemies", tagArray: ["exposure"],
			effectArray: [{ index: "lust", amount: 1 }] },
		{ index: "dustmoteCling", name: "Cling", enemyIndex: "dustmote", rarity: "enemy", costArray: {}, targetMode: "randomEnemy", tagArray: ["exposure"],
			effectArray: [{ index: "damage", amount: 3 }, { index: "lust", amount: 2 }] },

		//--- Courtier (striker, Road, from `beenoble-a`). THE FLOURISH: a duelist who fights for an
		//--- audience. Every touch is a display, and the Salute is the show. ---
		{ index: "courtierRiposte", name: "Riposte", enemyIndex: "courtier", rarity: "enemy", costArray: {}, targetMode: "frontEnemy",
			effectArray: [{ index: "damage", amount: 15 }] },
		{ index: "courtierFlourish", name: "Flourish", enemyIndex: "courtier", rarity: "enemy", costArray: {}, targetMode: "frontEnemy", tagArray: ["exposure"],
			effectArray: [{ index: "damage", amount: 6 }, { index: "lust", amount: 4 }] },
		{ index: "courtierSalute", name: "Salute", enemyIndex: "courtier", rarity: "enemy", costArray: {}, targetMode: "allEnemies", tagArray: ["exposure"], chargeCost: 2,
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "lust", amount: 3 }, { index: "applyStatus", status: "weak", stacks: 1 }] },
		{ index: "courtierBow", name: "Bow", enemyIndex: "courtier", rarity: "enemy", costArray: {}, targetMode: "self",
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "applyStatus", status: "strength", stacks: 1 }] },

		//--- The Dandy (lone, Road, from `tophatfairy-c`). THE GRAND REVEAL: a lounging fey noble who has
		//--- never once been hurried. The reveal is charged, so the party sees it coming. ---
		{ index: "dandyTap", name: "Cane Tap", enemyIndex: "dandy", rarity: "enemy", costArray: {}, targetMode: "frontEnemy",
			effectArray: [{ index: "damage", amount: 15 }] },
		{ index: "dandyDoff", name: "Doff", enemyIndex: "dandy", rarity: "enemy", costArray: {}, targetMode: "allEnemies", tagArray: ["exposure"],
			effectArray: [{ index: "lust", amount: 3 }, { index: "applyStatus", status: "weak", stacks: 1 }] },
		{ index: "dandyLean", name: "Lean Back", enemyIndex: "dandy", rarity: "enemy", costArray: {}, targetMode: "self",
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "temporaryHealth", amount: 12 }] },
		{ index: "dandyReveal", name: "Grand Reveal", enemyIndex: "dandy", rarity: "enemy", costArray: {}, targetMode: "allEnemies", tagArray: ["exposure"], chargeCost: 3,
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "damage", amount: 4 }, { index: "lust", amount: 6 }] },
	];

	//---------------------------------------------------------------------------------------------------
	//New enemies
	//---------------------------------------------------------------------------------------------------
	draft.enemyArray = [
		{
			//ART OWED. A broad myconid in a looted great helm and hauberk behind a tower shield as tall as
			//it is; upright and wide, drawn with the shield planted. Not the Shieldcap (low, crouched, a
			//pavise) and not the Bark Sentinel (act 1-1, bark, rooted). Any drawing of a big armoured
			//figure behind a big shield can take this kit.
			index: "doorward", name: "Doorward", role: "soldier", tagArray: ["plant"],
			artOwed: true, presentation: { scale: 1.1 },
			baseHealth: 67, healthVariance: 3,
			//A three-step loop, walked in order, so the wall turn is a promise the player can read.
			moveStrategy: "sequence",
			goldReward: { minimum: 14, maximum: 22 },
			moveArray: [{ card: "doorwardWall" }, { card: "doorwardMace" }, { card: "doorwardSweep" }],
		},
		{
			//ART OWED. A small round fuzzy moth, wings bigger than its body, no face detail worth drawing,
			//standing at 0.55 so five fit the stage. Any small moth drawing can take this kit.
			index: "dustmote", name: "Dustmote", role: "swarm", tagArray: ["fey", "insect"],
			artOwed: true, presentation: { scale: 0.55 },
			baseHealth: 25, healthVariance: 2,
			moveStrategy: "weighted",
			goldReward: { minimum: 5, maximum: 9 },
			moveArray: [
				{ card: "dustmoteFlit", weight: 45, maximumInARow: 2 },
				{ card: "dustmoteShed", weight: 30 },
				{ card: "dustmoteCling", weight: 25 },
			],
		},
		{
			//ART: `beenoble-a` (assigned, undrawn into the game). A fey courtier-duelist with a light rapier,
			//moth-winged, nothing gold or symmetrical (the Road's guardrail). The Fencers' full plate is
			//the elite pair's; this is the lighter cousin.
			index: "courtier", name: "Courtier", role: "striker", tagArray: ["fey", "insect"],
			artOwed: true, presentation: { scale: 1.0 },
			baseHealth: 46, healthVariance: 3,
			moveStrategy: "weighted",
			goldReward: { minimum: 12, maximum: 20 },
			moveArray: [
				{ card: "courtierRiposte", weight: 35, maximumInARow: 2 },
				{ card: "courtierFlourish", weight: 30 },
				{ card: "courtierSalute", weight: 25, maximumInARow: 1, chargeCost: 2 },
				{ card: "courtierBow", weight: 10, maximumInARow: 1 },
			],
		},
		{
			//ART: `tophatfairy-c` (assigned, undrawn into the game): the fey noble in the top hat. Drawn
			//lounging; the one body on the Road that is allowed to look like it owns the place, and it
			//still must not look tidy.
			index: "dandy", name: "The Dandy", role: "lone", tagArray: ["fey"],
			artOwed: true, presentation: { scale: 1.2 },
			baseHealth: 128, healthVariance: 6,
			moveStrategy: "weighted",
			goldReward: { minimum: 20, maximum: 30 },
			moveArray: [
				{ card: "dandyTap", weight: 40, maximumInARow: 2 },
				{ card: "dandyDoff", weight: 25 },
				{ card: "dandyLean", weight: 15, maximumInARow: 1 },
				{ card: "dandyReveal", weight: 35, maximumInARow: 1, chargeCost: 3 },
			],
		},
	];

	//---------------------------------------------------------------------------------------------------
	//Encounters. Order inside enemyIndexArray is the FORMATION: index 0 stands in front, nearest the party.
	//A route writes `early` (rows 1 to 5) and `late` (rows 6 to 8) only; the map's middle rows step down
	//to `late`, which is what honeycomb.rollEncounter already does for a tier with no entries.
	//---------------------------------------------------------------------------------------------------
	draft.encounterArray = [
		//===== ACT 1-1 (region 0) =====
		//opening (group 49 HP)
		{ index: "looseSpores", name: "Loose Spores", tier: "opening", weight: 30, regionIndexArray: [0], enemyIndexArray: ["sporeling", "sporeling"] },
		{ index: "theBrute", name: "The Brute", tier: "opening", weight: 30, regionIndexArray: [0], enemyIndexArray: ["capBrute"] },
		{ index: "wispAndSpore", name: "Wisp and Spore", tier: "opening", weight: 30, regionIndexArray: [0], enemyIndexArray: ["sporeling", "gloomWisp"] },
		{ index: "theNursery", name: "The Nursery", tier: "opening", weight: 30, regionIndexArray: [0], enemyIndexArray: ["gardener", "gloomWisp"] },
		//early (63)
		{ index: "barkWall", name: "The Bark Wall", tier: "early", weight: 30, regionIndexArray: [0], enemyIndexArray: ["shield", "gloomWisp"] },
		{ index: "hollowPatrol", name: "Hollow Patrol", tier: "early", weight: 30, regionIndexArray: [0], enemyIndexArray: ["hollowKnight", "sage"] },
		{ index: "puffPatch", name: "Puffcap Patch", tier: "early", weight: 30, regionIndexArray: [0], enemyIndexArray: ["puffcap", "puffcap", "gardener"] },
		{ index: "guardPost", name: "Guard Post", tier: "early", weight: 30, regionIndexArray: [0], enemyIndexArray: ["cordycepsHusk", "sporeling"] },
		//middle (74)
		{ index: "huskShamble", name: "Guard Detail", tier: "middle", weight: 30, regionIndexArray: [0], enemyIndexArray: ["cordycepsHusk", "cordycepsHusk"] },
		{ index: "bruteAndSpore", name: "Brute and Spores", tier: "middle", weight: 30, regionIndexArray: [0], enemyIndexArray: ["capBrute", "sporeling", "sporeling"] },
		{ index: "sageAndWisps", name: "Elder and Wisps", tier: "middle", weight: 30, regionIndexArray: [0], enemyIndexArray: ["gloomWisp", "sage", "gloomWisp"] },
		{ index: "theGlutton", name: "The Glutton", tier: "middle", weight: 30, regionIndexArray: [0], enemyIndexArray: ["moldLeech"] },
		//late (84)
				//B31, sporelings in bulk, WAITS ON E14: under today's Poison four bursts stack to 8 and the Seed Bed
		//costs 44% of party health, the plain four 33%; under the signed-off halving they cost 25% and 22%.
		//Both are held as candidates until the halving lands and he answers the Loose Spores question.
		{ index: "seedBed", name: "The Seed Bed", tier: "late", weight: 0, candidate: true, regionIndexArray: [0], enemyIndexArray: ["sporeling", "sporeling", "sporeling", "gardener"] },
		{ index: "sporeSwarm", name: "Spore Swarm", tier: "late", weight: 0, candidate: true, regionIndexArray: [0], enemyIndexArray: ["sporeling", "sporeling", "sporeling", "sporeling"] },
		{ index: "hollowGuard", name: "The Hollow Guard", tier: "late", weight: 30, regionIndexArray: [0], enemyIndexArray: ["hollowKnight", "sporeling", "hollowKnight"] },
		{ index: "alchemistBench", name: "The Alchemist's Bench", tier: "late", weight: 30, regionIndexArray: [0], enemyIndexArray: ["cordycepsHusk", "cordycepsHusk", "alchemist"] },
		{ index: "bulwarkLine", name: "Bulwark Line", tier: "late", weight: 30, regionIndexArray: [0], enemyIndexArray: ["shield", "puffcap", "puffcap"] },
		//Act 1-1's five-body fight: five fuses, three turns, 19% of party health (Bite), under the band's ceiling.
		{ index: "puffcapField", name: "Puffcap Field", tier: "late", weight: 30, regionIndexArray: [0], enemyIndexArray: ["puffcap", "puffcap", "puffcap", "puffcap", "puffcap"] },

		//===== ACT1-A, THE MUSHROOM FRONTIER (region 1) =====
		{ index: "crawlerBed", name: "The Picket", tier: "early", weight: 30, regionIndexArray: [1], enemyIndexArray: ["siltCrawler", "siltCrawler", "siltCrawler", "siltCrawler", "siltCrawler"] },
		{ index: "lampAndCage", name: "Lamp and Cage", tier: "early", weight: 30, regionIndexArray: [1], enemyIndexArray: ["lanternJelly", "mireEel"] },
		{ index: "jellyDrift", name: "Lamps in the Dark", tier: "early", weight: 30, regionIndexArray: [1], enemyIndexArray: ["siltCrawler", "siltCrawler", "lanternJelly"] },
		{ index: "drownedPatrol", name: "The Long Patrol", tier: "early", weight: 30, regionIndexArray: [1], enemyIndexArray: ["doorward", "lanternJelly"] },
		{ index: "theHook", name: "The Hook", tier: "late", weight: 30, regionIndexArray: [1], enemyIndexArray: ["bogToad"] },
		{ index: "theGate", name: "The Gate", tier: "late", weight: 30, regionIndexArray: [1], enemyIndexArray: ["doorward", "doorward"] },
		{ index: "eelNest", name: "The Cage Line", tier: "late", weight: 30, regionIndexArray: [1], enemyIndexArray: ["mireEel", "mireEel"] },
		//The wall and the hitter measured 42% of party health (Bite), heavy for the early band and easy for
		//the late one, so the pair stands late. Two lamps and a cage measured 140% Lust to damage and went.
		{ index: "theDoorward", name: "The Doorward", tier: "late", weight: 30, regionIndexArray: [1], enemyIndexArray: ["doorward", "mireEel"] },
		//MEASURED OUT (Basic Bite, session 66): three Cagecaps cost 56% of party health and four bodies with
		//two Cagecaps 58%, both at the shipped ceiling. Kept as candidates so the desktop can re-measure.
		{ index: "cageLineThree", name: "The Cage Line (three)", tier: "late", weight: 0, candidate: true, regionIndexArray: [1], enemyIndexArray: ["mireEel", "mireEel", "mireEel"] },
		{ index: "eelShallows", name: "The Outpost", tier: "late", weight: 0, candidate: true, regionIndexArray: [1], enemyIndexArray: ["siltCrawler", "siltCrawler", "mireEel", "mireEel"] },

		//===== ACT1-B, THE THORN ARBOR (region 2) =====
		{ index: "floraBriarPatch", name: "The Briar Patch", tier: "early", weight: 30, regionIndexArray: [2], enemyIndexArray: ["thornSprite", "thornSprite", "thornSprite", "thornSprite", "thornSprite"] },
		{ index: "floraHedgerow", name: "The Hedgerow", tier: "early", weight: 30, regionIndexArray: [2], enemyIndexArray: ["thornFencer", "wellspring"] },
		{ index: "floraBellwalk", name: "The Bell Walk", tier: "early", weight: 30, regionIndexArray: [2], enemyIndexArray: ["thornSprite", "thornSprite", "trumpetBell"] },
		{ index: "floraDuellingGround", name: "The Duelling Ground", tier: "early", weight: 30, regionIndexArray: [2], enemyIndexArray: ["thornFencer", "trumpetBell"] },
		{ index: "floraWindfall", name: "The Windfall", tier: "late", weight: 30, regionIndexArray: [2], enemyIndexArray: ["fruitAlraune"] },
		{ index: "floraFencingLine", name: "The Fencing Line", tier: "late", weight: 30, regionIndexArray: [2], enemyIndexArray: ["thornFencer", "thornFencer", "thornFencer"] },
		{ index: "floraBellChoir", name: "The Bell Choir", tier: "late", weight: 30, regionIndexArray: [2], enemyIndexArray: ["trumpetBell", "trumpetBell"] },
		//MEASURED OUT: three bells cost 81% of party health (Bite), above anything that shipped.
		{ index: "floraBellChoirThree", name: "The Bell Choir (three)", tier: "late", weight: 0, candidate: true, regionIndexArray: [2], enemyIndexArray: ["trumpetBell", "trumpetBell", "trumpetBell"] },
		{ index: "floraNightshade", name: "The Nightshade Patch", tier: "late", weight: 30, regionIndexArray: [2], enemyIndexArray: ["trumpetBell", "wellspring"] },

		//===== ACT1-C, THE POLLEN ROAD (region 3) =====
		{ index: "pollenDrifts", name: "The Drifts", tier: "early", weight: 30, regionIndexArray: [3], enemyIndexArray: ["dustmote", "dustmote", "dustmote", "dustmote", "dustmote"] },
		{ index: "pollenCanopy", name: "Under the Wings", tier: "early", weight: 30, regionIndexArray: [3], enemyIndexArray: ["mantlewing", "longwing"] },
		{ index: "pollenBathhouse", name: "The Steeping Pool", tier: "early", weight: 30, regionIndexArray: [3], enemyIndexArray: ["courtier", "soakcap"] },
		{ index: "pollenBower", name: "The Bower", tier: "early", weight: 30, regionIndexArray: [3], enemyIndexArray: ["courtier", "longwing"] },
		{ index: "pollenDandy", name: "The Dandy", tier: "late", weight: 30, regionIndexArray: [3], enemyIndexArray: ["dandy"] },
		{ index: "pollenSalon", name: "The Salon", tier: "late", weight: 30, regionIndexArray: [3], enemyIndexArray: ["courtier", "courtier", "dustmote"] },
		//MEASURED OUT: three Courtiers cost 45% of party health (Bite), above the Road's shipped ceiling.
		{ index: "pollenSalonThree", name: "The Salon (three)", tier: "late", weight: 0, candidate: true, regionIndexArray: [3], enemyIndexArray: ["courtier", "courtier", "courtier"] },
		{ index: "pollenHighDrift", name: "The High Drift", tier: "late", weight: 30, regionIndexArray: [3], enemyIndexArray: ["mantlewing", "dustmote", "dustmote", "dustmote"] },
		{ index: "pollenIdlers", name: "Nobody Getting Up", tier: "late", weight: 30, regionIndexArray: [3], enemyIndexArray: ["longwing", "longwing", "soakcap"] },
	];

	//---------------------------------------------------------------------------------------------------
	//Applying the draft over a loaded engine
	//---------------------------------------------------------------------------------------------------
	function setPath(target, path, value) {
		var stepArray = path.split(".");
		for (var stepIndex = 0; stepIndex < stepArray.length - 1; stepIndex++) target = target[stepArray[stepIndex]];
		target[stepArray[stepArray.length - 1]] = value;
	}

	draft.apply = function (honeycomb) {
		var roleArray = honeycomb.tuning.balance.enemyRoleArray;
		for (var roleIndex = 0; roleIndex < draft.roleArray.length; roleIndex++) {
			var role = draft.roleArray[roleIndex];
			if (honeycomb.findDefinition(roleArray, role.index) != null) continue;
			var at = roleArray.length;
			for (var scan = 0; scan < roleArray.length; scan++) if (roleArray[scan].index == role.before) { at = scan; break; }
			roleArray.splice(at, 0, { index: role.index, healthShare: role.healthShare, damageShare: role.damageShare });
		}
		if (honeycomb.findDefinition(honeycomb.cardTagArray, "heat") == null) {
			honeycomb.cardTagArray.push({ index: "heat", name: "Heat", lustTag: true, description: "Heat, the general drive." });
		}
		for (var retagIndex = 0; retagIndex < draft.retagArray.length; retagIndex++) {
			var retag = draft.retagArray[retagIndex];
			honeycomb.requireDefinition(honeycomb.cardArray, retag.card, "honeycomb.cardArray").tagArray = retag.tagArray.slice();
		}
		for (var cardIndex = 0; cardIndex < draft.cardArray.length; cardIndex++) {
			if (honeycomb.findDefinition(honeycomb.cardArray, draft.cardArray[cardIndex].index) != null) continue;
			honeycomb.enemyCardArray.push(draft.cardArray[cardIndex]);
			honeycomb.cardArray.push(draft.cardArray[cardIndex]);
		}
		for (var retuneIndex = 0; retuneIndex < draft.retuneArray.length; retuneIndex++) {
			var retune = draft.retuneArray[retuneIndex];
			var enemy = honeycomb.requireDefinition(honeycomb.enemyArray, retune.enemy, "honeycomb.enemyArray");
			var fieldArray = ["name", "role", "baseHealth", "healthVariance", "presentation", "moveArray"];
			for (var fieldIndex = 0; fieldIndex < fieldArray.length; fieldIndex++) {
				if (retune[fieldArray[fieldIndex]] != null) enemy[fieldArray[fieldIndex]] = retune[fieldArray[fieldIndex]];
			}
			for (var addIndex = 0; retune.addMoveArray != null && addIndex < retune.addMoveArray.length; addIndex++) enemy.moveArray.push(retune.addMoveArray[addIndex]);
			for (var amountIndex = 0; retune.cardAmountArray != null && amountIndex < retune.cardAmountArray.length; amountIndex++) {
				var change = retune.cardAmountArray[amountIndex];
				setPath(honeycomb.requireDefinition(honeycomb.cardArray, change.card, "honeycomb.cardArray"), change.path, change.amount);
			}
			for (var nameIndex = 0; retune.cardNameArray != null && nameIndex < retune.cardNameArray.length; nameIndex++) {
				honeycomb.requireDefinition(honeycomb.cardArray, retune.cardNameArray[nameIndex].card, "honeycomb.cardArray").name = retune.cardNameArray[nameIndex].name;
			}
		}
		for (var enemyIndex = 0; enemyIndex < draft.enemyArray.length; enemyIndex++) {
			if (honeycomb.findDefinition(honeycomb.enemyArray, draft.enemyArray[enemyIndex].index) != null) continue;
			honeycomb.enemyArray.push(draft.enemyArray[enemyIndex]);
		}
		//The ordinary pools of regions 0 to 3 are replaced whole; everything else in the table stays.
		var kept = [];
		for (var scanIndex = 0; scanIndex < honeycomb.encounterArray.length; scanIndex++) {
			var encounter = honeycomb.encounterArray[scanIndex];
			var ordinary = encounter.isElite != true && encounter.tier != "boss" && encounter.testFixture != true &&
				encounter.regionIndexArray != null && encounter.regionIndexArray.length === 1 && encounter.regionIndexArray[0] <= 3;
			if (ordinary == false) kept.push(encounter);
		}
		honeycomb.encounterArray.length = 0;
		for (var keptIndex = 0; keptIndex < kept.length; keptIndex++) honeycomb.encounterArray.push(kept[keptIndex]);
		for (var newIndex = 0; newIndex < draft.encounterArray.length; newIndex++) honeycomb.encounterArray.push(draft.encounterArray[newIndex]);
		honeycomb.commonDraftApplied = true;
	};

	window.honeycomb = window.honeycomb || {};
	window.honeycomb.commonDraft = draft;
	//Self-applies when loaded after the content tables (tools/balance/lib/engine.js `extraFileArray`).
	if (window.honeycomb.enemyArray != null && window.honeycomb.commonDraftApplied != true) draft.apply(window.honeycomb);
})();
