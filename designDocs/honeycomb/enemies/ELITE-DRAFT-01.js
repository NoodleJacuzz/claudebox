//===================================================================================================
//HONEYCOMB CATACOMBS -- the elite enemy and encounter pool, DRAFT 01 (enemies/ S64-2, session 68)
//===================================================================================================
//A DRAFT, NOT GAME CODE. Nothing loads this file. It is applied over a headless engine by
//tools/elite-draft-audit.js, AFTER enemies/COMMON-DRAFT-01.js, so the drafted elite pool can be graded by
//the instruments the live tables are graded by (enemy-template, lust-share, Basic Bite, coverage). It is
//written in the live tables' own shape so the desktop session that lands it copies entries rather than
//translating prose.
//
//The design it encodes is enemies/ELITE-ENCOUNTERS-01.md. Every name is a proposal (E9). Every number is a
//first draft written to tuning.balance; the rebalance waits for the Crunch (S65-1). Every picture is an
//assignment from ASSIGNED.md, not a drawing on disk, so every kit is written as a silhouette role that
//bends to whatever art turns up (the flexibility rule, COMMON-ENCOUNTERS-01.md s1).
//
//It sits ON the common draft: three of its fights field bodies the common draft adds or retunes (the
//Doorward, the swarm-sized Shieldcap and Briar Brat), and `apply` refuses to run without it.
//
//What it does when applied:
//  1. one role joins tuning.balance.enemyRoleArray: `eliteHalf`, half an elite, so two of them sum to one
//     elite fight (the precedent is `bossHalf`, the Arbor Sisters);
//  2. the Scrap Salvager comes off the bench as half of the Frontier's intruder pair, and both Fencers
//     leave the commons for the Road's pair elite (B36), each retuned to the half-elite line;
//  3. three bodies are added: the Kobold Gleaner (`demikobold-c`, the intruder who preys on the weak),
//     the Lush (`feralbeast-b`, the Arbor's elite) and the Longshade (`spookytall-a`, the Road's);
//  4. the elite encounters of regions 0 to 3 are REPLACED by the drafted pools, every one at tier
//     `middle` so each region's elites are ONE pool; bosses, fixtures, commons and the gauntlet stay;
//  5. the elite bodies' Lust moves are tagged to the act-1 set as E14 asks (three Charm moves to
//     Exposure, one Restraint grapple to Heat).
(function () {
	var draft = {};

	//---------------------------------------------------------------------------------------------------
	//Roles
	//---------------------------------------------------------------------------------------------------
	//Half of the ELITE group, so a matched pair sums to one elite fight; positioned before `elite` because
	//honeycomb.enemyDifficultyRank ranks by position and the bestiary reads weakest first.
	//Half the health. The damage share is 0.75, not 0.5: enemy-template grades a body of the elite group
	//against the SOLO line (x1.2) and a two-body fight against the GROUP line (x1.8), because a pair can
	//lose a member mid-fight where a solo cannot, so half of the group line is 0.75 of the solo one.
	draft.roleArray = [
		{ index: "eliteHalf", healthShare: 0.5, damageShare: 0.75, group: "elite", before: "elite" },
	];

	//---------------------------------------------------------------------------------------------------
	//Retags (E14). Only the moves of elite bodies the drafted pools field.
	//---------------------------------------------------------------------------------------------------
	draft.retagArray = [
		{ card: "sableBind", tagArray: ["exposure"] },       //the Road is the Exposure route
		{ card: "argentRemise", tagArray: ["exposure"] },
		{ card: "argentFlare", tagArray: ["exposure"] },
		{ card: "salvagerSnare", tagArray: ["heat"] },       //a grapple; Restraint is cut (I16)
	];

	//---------------------------------------------------------------------------------------------------
	//Retunes: existing bodies moved to the half-elite line.
	//---------------------------------------------------------------------------------------------------
	draft.retuneArray = [
		{
			//Half of the Frontier's intruder pair, off the bench. Same kit, same electric scrap; nothing
			//burns. ART: the assignment is `bellhead-a`, read here as HIS new drawing (E7-DEFERRED, "with
			//bellhead-a as her partner image"); the hue-shifted Scavenger that benched him goes. `artOwed`
			//stays true until that drawing is in his folder.
			enemy: "drownedSalvager", role: "eliteHalf", baseHealth: 97, healthVariance: 5,
			goldReward: { minimum: 18, maximum: 26 },
		},
		{
			//The sealed half of the Road's pair: the wall in front, thorns up. Amounts lifted from a
			//67-health soldier to a 97-health half-elite in the same proportions.
			enemy: "sableFencer", role: "eliteHalf", baseHealth: 97, healthVariance: 5,
			goldReward: { minimum: 18, maximum: 26 },
			//MEASURED DOWN (Bite, session 68): at Thrust 20 / Line 8 / Lunge 24 / Remise 12+6 the pair cost 61% of
			//party health at a 63% win rate, over the Road's shipped elite ceiling (53%). These are the second pass.
			cardAmountArray: [
				{ card: "sableThrust", path: "effectArray.0.amount", amount: 17 },
				{ card: "sableBind", path: "effectArray.0.amount", amount: 8 },
				{ card: "sableBind", path: "effectArray.2.amount", amount: 5 },
				{ card: "sableLine", path: "effectArray.0.amount", amount: 6 },
				{ card: "sableGuard", path: "effectArray.0.amount", amount: 12 },
			],
		},
		{
			//The open half: she never steps back, and the Long Lunge reaches the back rank past him.
			enemy: "argentFencer", role: "eliteHalf", baseHealth: 97, healthVariance: 5,
			goldReward: { minimum: 18, maximum: 26 },
			cardAmountArray: [
				{ card: "argentLunge", path: "effectArray.0.amount", amount: 20 },
				{ card: "argentRemise", path: "effectArray.0.amount", amount: 10 },
				{ card: "argentRemise", path: "effectArray.1.amount", amount: 4 },
				{ card: "argentFlare", path: "effectArray.0.amount", amount: 3 },
			],
		},
	];

	//---------------------------------------------------------------------------------------------------
	//New cards
	//---------------------------------------------------------------------------------------------------
	draft.cardArray = [
		//--- Kobold Gleaner (eliteHalf, Frontier, from `demikobold-c`). PREYS ON THE WEAK: every attack
		//--- lands on whoever has the least health left. A party that lets one member run low pays for
		//--- it; a party that kills her first does not. The Finish is charged, so it is seen coming. ---
		{ index: "gleanerPick", name: "Pick Off", enemyIndex: "gleaner", rarity: "enemy", costArray: {}, targetMode: "weakestEnemy",
			effectArray: [{ index: "damage", amount: 15 }] },
		{ index: "gleanerHamstring", name: "Hamstring", enemyIndex: "gleaner", rarity: "enemy", costArray: {}, targetMode: "weakestEnemy",
			effectArray: [{ index: "damage", amount: 8 }, { index: "applyStatus", status: "sundered", stacks: 2 }] },
		{ index: "gleanerFinish", name: "Finish", enemyIndex: "gleaner", rarity: "enemy", costArray: {}, targetMode: "weakestEnemy", chargeCost: 2,
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "damage", amount: 24 }] },
		{ index: "gleanerSkulk", name: "Skulk", enemyIndex: "gleaner", rarity: "enemy", costArray: {}, targetMode: "self",
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "temporaryHealth", amount: 8 }] },

		//--- The Lush (elite, Arbor, from `feralbeast-b`). A beast that got into the arbor and is drunk on
		//--- the windfalls. It staggers, it wallows, it slavers, and every third turn or so it rampages. ---
		{ index: "lushStagger", name: "Stagger", enemyIndex: "lush", rarity: "enemy", costArray: {}, targetMode: "frontEnemy",
			effectArray: [{ index: "damage", amount: 16 }] },
		//Wallow was a heal of 10; beside the Wellspring's Regeneration the fight ran 17 turns and cost 56% of
		//party health (Bite, session 68), so it is Temporary HP now and the Well is the only healing in the fight.
		{ index: "lushWallow", name: "Wallow", enemyIndex: "lush", rarity: "enemy", costArray: {}, targetMode: "self",
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "temporaryHealth", amount: 10 }, { index: "applyStatus", status: "strength", stacks: 1 }] },
		{ index: "lushSlaver", name: "Slaver", enemyIndex: "lush", rarity: "enemy", costArray: {}, targetMode: "allEnemies", tagArray: ["venom"],
			effectArray: [{ index: "lust", amount: 2 }, { index: "applyStatus", status: "poison", stacks: 1 }] },
		{ index: "lushRampage", name: "Rampage", enemyIndex: "lush", rarity: "enemy", costArray: {}, targetMode: "allEnemies", chargeCost: 3,
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "damage", amount: 12 }] },

		//--- The Longshade (elite, Road, from `spookytall-a`). A tall thing in the bloom that looms. It
		//--- stoops on the front, whispers to the back, and unfurls over everyone at once. ---
		//Second pass (Bite, session 68): alone it cost 19% against a 30% target, and beside the Longwing the pair
		//lost a third of fights to Lust, so a share of its Lust became damage (Stoop 18 to 20, Whisper 4+6 to
		//6+4, Unfurl 5+5 to 7+4).
		{ index: "longshadeStoop", name: "Stoop", enemyIndex: "longshade", rarity: "enemy", costArray: {}, targetMode: "frontEnemy",
			effectArray: [{ index: "damage", amount: 20 }] },
		{ index: "longshadeLoom", name: "Loom", enemyIndex: "longshade", rarity: "enemy", costArray: {}, targetMode: "allEnemies",
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "temporaryHealth", amount: 14, targetOverride: "self" }, { index: "applyStatus", status: "weak", stacks: 1 }] },
		{ index: "longshadeWhisper", name: "Whisper", enemyIndex: "longshade", rarity: "enemy", costArray: {}, targetMode: "backEnemy", tagArray: ["exposure"],
			effectArray: [{ index: "damage", amount: 6 }, { index: "lust", amount: 4 }] },
		{ index: "longshadeUnfurl", name: "Unfurl", enemyIndex: "longshade", rarity: "enemy", costArray: {}, targetMode: "allEnemies", tagArray: ["exposure"], chargeCost: 3,
			animationArray: [{ animation: "rise" }],
			effectArray: [{ index: "damage", amount: 7 }, { index: "lust", amount: 4 }, { index: "applyStatus", status: "sensitive", stacks: 1 }] },
	];

	//---------------------------------------------------------------------------------------------------
	//New enemies
	//---------------------------------------------------------------------------------------------------
	draft.enemyArray = [
		{
			//ART: `demikobold-c` (assigned, undrawn into the game). An Act 2 native down here with the
			//Salvager; slighter and quicker than him, a hooked or barbed tool, NOTHING BURNING (E7-DEFERRED:
			//"the fire doesn't really sell me on salvage"). Any drawing of a small, quick figure with a
			//hook can take this kit; the kit is the targeting, not the species.
			index: "gleaner", name: "Kobold Gleaner", role: "eliteHalf", tagArray: ["kobold", "elite"],
			artOwed: true, presentation: { scale: 1.0 },
			baseHealth: 97, healthVariance: 5,
			moveStrategy: "weighted",
			goldReward: { minimum: 18, maximum: 26 },
			moveArray: [
				{ card: "gleanerPick", weight: 40, maximumInARow: 2 },
				{ card: "gleanerHamstring", weight: 30, maximumInARow: 1 },
				{ card: "gleanerFinish", weight: 30, maximumInARow: 1, chargeCost: 2 },
				{ card: "gleanerSkulk", weight: 15, maximumInARow: 1 },
			],
		},
		{
			//ART: `feralbeast-b` (assigned, undrawn into the game; "the route's elite", demoted from boss
			//when the Sisters took the slot). One big low four-legged body, heavier than anything else in
			//the arbor, mouth open; stands at 1.3. Any big beast drawing can take this kit.
			//Written under the elite line (160 of 195) so it can fight alone AND with company inside one
			//budget: alone it is the route's single guy, fed by the Wellspring or fronted by two Brats it is
			//a whole elite fight.
			index: "lush", name: "The Lush", role: "elite", tagArray: ["beast", "elite"],
			artOwed: true, presentation: { scale: 1.3 },
			baseHealth: 160, healthVariance: 8,
			moveStrategy: "weighted",
			goldReward: { minimum: 30, maximum: 45 },
			moveArray: [
				{ card: "lushStagger", weight: 35, maximumInARow: 2 },
				{ card: "lushWallow", weight: 15, maximumInARow: 1 },
				{ card: "lushSlaver", weight: 25, maximumInARow: 1 },
				{ card: "lushRampage", weight: 30, maximumInARow: 1, chargeCost: 3 },
			],
		},
		{
			//ART: `spookytall-a` (assigned, undrawn into the game; "can fit into a lot of places"). The
			//Longwing is `spookytall-d`, the same source family, so the two are kin and fight as kin. Tall
			//and thin; stands at 1.2 rather than taller because B37 already cuts tall drawings off the top
			//of his window. Any tall, thin, winged drawing can take this kit.
			index: "longshade", name: "Longshade", role: "elite", tagArray: ["fey", "insect", "elite"],
			artOwed: true, presentation: { scale: 1.2 },
			baseHealth: 160, healthVariance: 8,
			moveStrategy: "weighted",
			goldReward: { minimum: 30, maximum: 45 },
			moveArray: [
				{ card: "longshadeStoop", weight: 35, maximumInARow: 2 },
				{ card: "longshadeLoom", weight: 15, maximumInARow: 1 },
				{ card: "longshadeWhisper", weight: 25, maximumInARow: 1 },
				{ card: "longshadeUnfurl", weight: 30, maximumInARow: 1, chargeCost: 3 },
			],
		},
	];

	//---------------------------------------------------------------------------------------------------
	//Encounters. Order inside enemyIndexArray is the FORMATION: index 0 stands in front, nearest the party.
	//Every elite fight is written at tier `middle`, so a region's elites are ONE pool: an elite node on an
	//early row steps down to it and one on a late row falls through to it (honeycomb.rollEncounter), and
	//the block rule always has a real roll. `isElite: true` is what the elite node rolls on.
	//---------------------------------------------------------------------------------------------------
	draft.encounterArray = [
		//===== ACT 1-1 (region 0): the two elites that shipped, each met alone and each with company =====
		{ index: "scavengerAlone", name: "The Kobold Scavenger", tier: "middle", weight: 50, isElite: true, regionIndexArray: [0], enemyIndexArray: ["scavenger"] },
		{ index: "championAlone", name: "The Hollow Champion", tier: "middle", weight: 50, isElite: true, regionIndexArray: [0], enemyIndexArray: ["hollowChampion"] },
		//The fuse in front, the bomber behind it: reach him through a three-turn clock.
		{ index: "scavengerCache", name: "The Scavenger's Cache", tier: "middle", weight: 50, isElite: true, regionIndexArray: [0], enemyIndexArray: ["puffcap", "scavenger"] },
		{ index: "championGuard", name: "The Champion's Guard", tier: "middle", weight: 50, isElite: true, regionIndexArray: [0], enemyIndexArray: ["sporeling", "hollowChampion"] },

		//===== ACT1-A, THE MUSHROOM FRONTIER (region 1): the intruder pair =====
		//He snares and patches in front; she picks off whoever is lowest from behind him.
		{ index: "frontierIntruders", name: "The Intruders", tier: "middle", weight: 50, isElite: true, regionIndexArray: [1], enemyIndexArray: ["drownedSalvager", "gleaner"] },
		//Three pavises hired for the afternoon; the pickets blunt sweeps while she picks.
		{ index: "frontierGleaning", name: "The Gleaning", tier: "middle", weight: 50, isElite: true, regionIndexArray: [1], enemyIndexArray: ["siltCrawler", "siltCrawler", "siltCrawler", "gleaner"] },
		//A native wall in front of the scrap: the Doorward taunts one turn in three, the Salvager strips.
		{ index: "frontierSalvageGate", name: "The Salvage Gate", tier: "middle", weight: 50, isElite: true, regionIndexArray: [1], enemyIndexArray: ["doorward", "drownedSalvager"] },

		//===== ACT1-B, THE THORN ARBOR (region 2): the Lush =====
		{ index: "arborLush", name: "The Lush", tier: "middle", weight: 50, isElite: true, regionIndexArray: [2], enemyIndexArray: ["lush"] },
		//The beast in front, the bloom behind that Envenoms it: kill the bloom first or fight a poisoned beast.
		{ index: "arborLushWell", name: "The Lush at the Well", tier: "middle", weight: 50, isElite: true, regionIndexArray: [2], enemyIndexArray: ["lush", "wellspring"] },
		//Two brats tripping the front rank, and the beast behind them.
		{ index: "arborLushBrats", name: "Brats and the Lush", tier: "middle", weight: 50, isElite: true, regionIndexArray: [2], enemyIndexArray: ["thornSprite", "thornSprite", "lush"] },

		//===== ACT1-C, THE POLLEN ROAD (region 3): the Fencer pair and the Longshade =====
		//B36: the two-enemy elite she was meant to be saved for. The sealed one in front, the open one behind.
		{ index: "pollenDuel", name: "Sable and Argent", tier: "middle", weight: 50, isElite: true, regionIndexArray: [3], enemyIndexArray: ["sableFencer", "argentFencer"] },
		{ index: "pollenLongshade", name: "The Longshade", tier: "middle", weight: 50, isElite: true, regionIndexArray: [3], enemyIndexArray: ["longshade"] },
		//Kin from one source family: the tall one in front, the swaying one behind.
		{ index: "pollenKin", name: "Longshade and Longwing", tier: "middle", weight: 50, isElite: true, regionIndexArray: [3], enemyIndexArray: ["longshade", "longwing"] },
		//The other company for the tall one, kept as a candidate so the desktop can measure both: two motes in
		//front shedding dust, the Longshade behind them.
		{ index: "pollenLongshadeDrift", name: "The Longshade in the Drift", tier: "middle", weight: 0, candidate: true, isElite: true, regionIndexArray: [3], enemyIndexArray: ["dustmote", "dustmote", "longshade"] },
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
		if (honeycomb.commonDraftApplied != true) throw new Error("ELITE-DRAFT-01 sits on COMMON-DRAFT-01: apply the common draft first");
		var roleArray = honeycomb.tuning.balance.enemyRoleArray;
		for (var roleIndex = 0; roleIndex < draft.roleArray.length; roleIndex++) {
			var role = draft.roleArray[roleIndex];
			if (honeycomb.findDefinition(roleArray, role.index) != null) continue;
			var at = roleArray.length;
			for (var scan = 0; scan < roleArray.length; scan++) if (roleArray[scan].index == role.before) { at = scan; break; }
			roleArray.splice(at, 0, { index: role.index, healthShare: role.healthShare, damageShare: role.damageShare, group: role.group });
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
			var fieldArray = ["name", "role", "baseHealth", "healthVariance", "presentation", "moveArray", "artFolder", "artOwed", "goldReward"];
			for (var fieldIndex = 0; fieldIndex < fieldArray.length; fieldIndex++) {
				if (retune[fieldArray[fieldIndex]] != null) enemy[fieldArray[fieldIndex]] = retune[fieldArray[fieldIndex]];
			}
			for (var amountIndex = 0; retune.cardAmountArray != null && amountIndex < retune.cardAmountArray.length; amountIndex++) {
				var change = retune.cardAmountArray[amountIndex];
				setPath(honeycomb.requireDefinition(honeycomb.cardArray, change.card, "honeycomb.cardArray"), change.path, change.amount);
			}
		}
		for (var enemyIndex = 0; enemyIndex < draft.enemyArray.length; enemyIndex++) {
			if (honeycomb.findDefinition(honeycomb.enemyArray, draft.enemyArray[enemyIndex].index) != null) continue;
			honeycomb.enemyArray.push(draft.enemyArray[enemyIndex]);
		}
		//The elite pools of regions 0 to 3 are replaced whole, the benched Salvager rows included; the
		//gauntlet's elite (region 4), the bosses, the fixtures and the ordinary pools stay.
		var kept = [];
		for (var scanIndex = 0; scanIndex < honeycomb.encounterArray.length; scanIndex++) {
			var encounter = honeycomb.encounterArray[scanIndex];
			var routeElite = encounter.isElite == true && encounter.testFixture != true &&
				encounter.regionIndexArray != null && encounter.regionIndexArray.length === 1 && encounter.regionIndexArray[0] <= 3;
			if (routeElite == false) kept.push(encounter);
		}
		honeycomb.encounterArray.length = 0;
		for (var keptIndex = 0; keptIndex < kept.length; keptIndex++) honeycomb.encounterArray.push(kept[keptIndex]);
		for (var newIndex = 0; newIndex < draft.encounterArray.length; newIndex++) honeycomb.encounterArray.push(draft.encounterArray[newIndex]);
		honeycomb.eliteDraftApplied = true;
	};

	window.honeycomb = window.honeycomb || {};
	window.honeycomb.eliteDraft = draft;
	//Self-applies when loaded after the content tables and the common draft (tools/balance/lib/engine.js
	//`extraFileArray`, in that order).
	if (window.honeycomb.enemyArray != null && window.honeycomb.commonDraftApplied == true && window.honeycomb.eliteDraftApplied != true) draft.apply(window.honeycomb);
})();
