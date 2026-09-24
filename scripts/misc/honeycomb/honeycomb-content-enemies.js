//===================================================================================================
//HONEYCOMB CATACOMBS -- enemy content, and the AI that plays moves
//===================================================================================================
//An enemy is a combatant with a MOVE LIST: cards from the card table, each with a weight. Each turn an
//AI-controlled combatant picks one move, telegraphs it face up during the player's turn, and plays it
//on its own team's turn.
//
//Enemies use fundamentally the same kind of card that players do, just targeting the opposing team.
//The moves are REAL CARDS -- the same shape as the party's, in the same table, their targets relative
//to whoever plays them -- so an enemy fighting for the party attacks the enemies, and a party character
//fighting for the other side plays her own cards at the party.
//
//ANY combatant can be AI-controlled: every one on the enemy team, and anything on the party's team that
//is not a character the player commands (a summoned Sporeling). An enemy's move list is its
//`moveArray`; an AI character's is its own card pool. Selection goes through a named STRATEGY, so a new
//enemy usually needs no new logic at all.
window.honeycomb = window.honeycomb || {};

//---------------------------------------------------------------------------------------------------
//Enemy cards
//---------------------------------------------------------------------------------------------------
//Written exactly like the party's cards (see honeycomb-content-cards.js), plus:
//  enemyIndex   whose move it is: its art is that enemy striking the move's pose, and its text is worded
//               from the enemy team's side unless someone on the other team plays it
//  rarity       "enemy", which no reward or shop ever offers
//  costArray    {} -- AI combatants do not pay energy
//Their TYPES are derived from their effects like any card's, so Spores -- which weakens a party member --
//is a Negative card.
//How a move LOOKS comes from its type like any card's; `pose` / `animationArray` on a card override it.
honeycomb.enemyCardArray = [
	//-------------------------------------------------------------------------------------------
	//Every number here is written to the template in tuning.balance.enemyRoleArray (see
	//rework/enemies/ENEMIES-01.md) and measured by budget-audit.js. The comment above each enemy's
	//moves names its role and its IDENTITY: the one thing a player should remember it by.
	//-------------------------------------------------------------------------------------------

	//--- Sporeling (minion). SPOREBURST: dies into Poison on the whole party (the passive), so killing
	//--- one is never free. ---
	{
		index: "sporelingSpit", name: "Spit", enemyIndex: "sporeling", rarity: "enemy", costArray: {},
		//Most attacks land on whoever stands in front. Party order is a decision.
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 7 }],
	},
	{
		//THE FIRST LUST ATTACK the party meets. Tagged Venom, so a party that keeps eating Sporelings
		//slowly builds a Venom weakness -- the gentlest possible introduction to the ledger.
		index: "sporelingSpores", name: "Spores", enemyIndex: "sporeling", rarity: "enemy", costArray: {},
		targetMode: "randomEnemy",
		tagArray: ["venom"],
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 2 },
			{ index: "lust", amount: 4 },
		],
	},
	{
		//The Act 1 dawdle (mechanics bible §5): Temporary HP with no payoff.
		index: "sporelingHarden", name: "Harden", enemyIndex: "sporeling", rarity: "enemy", costArray: {},
		targetMode: "self",
		effectArray: [{ index: "temporaryHealth", amount: 5 }],
	},

	//--- Cap Brute (soldier). THE LOOP THAT GROWS: a fixed four-move lap, two Strength richer each time
	//--- round. Learnable, and a slow kill pays for it. ---
	{
		index: "capBruteWindUp", name: "Wind Up", enemyIndex: "capBrute", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "applyStatus", status: "strength", stacks: 2 }],
	},
	{
		index: "capBruteSlam", name: "Slam", enemyIndex: "capBrute", rarity: "enemy", costArray: {},
		//The heavy blow goes to the front, which is what makes standing there a choice.
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 11 }],
	},
	{
		index: "capBruteStomp", name: "Stomp", enemyIndex: "capBrute", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [{ index: "damage", amount: 5 }],
	},
	{
		//Damage AND lust in one card: the two roads to Broken travelling together, which is what makes
		//temporary health worth spending on the front-liner.
		index: "capBrutePin", name: "Pin", enemyIndex: "capBrute", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["restraint"],
		effectArray: [
			{ index: "damage", amount: 5 },
			{ index: "lust", amount: 7 },
		],
	},

	//--- Gloom Wisp (caster). HAUNTS THE DECK: dead cards in the draw pile, and a charm Temporary HP cannot
	//--- stop. ---
	{
		index: "gloomWispFlicker", name: "Flicker", enemyIndex: "gloomWisp", rarity: "enemy", costArray: {},
		targetMode: "randomEnemy",
		//Multi-hit through the same repeat verb cards use.
		effectArray: [{ index: "repeat", times: 4, effectArray: [{ index: "damage", amount: 3 }] }],
	},
	{
		index: "gloomWispClutter", name: "Clutter", enemyIndex: "gloomWisp", rarity: "enemy", costArray: {},
		targetMode: "none",
		//Puts dead cards in the party's draw pile: an enemy attacking the deck rather than the party.
		//Negative, because the piles are the other team's.
		effectArray: [{ index: "addCardToPile", card: "curseWisp", pile: "drawPile", count: 2 }],
	},
	{
		//Kept for old saves that telegraphed it; no Wisp picks it any more.
		index: "gloomWispFade", name: "Fade", enemyIndex: "gloomWisp", rarity: "enemy", costArray: {},
		targetMode: "self",
		effectArray: [{ index: "temporaryHealth", amount: 8 }],
	},
	{
		//Charm ignores the body entirely, so temporary health is no answer to it -- the party has to
		//pay in Soothe or in distance.
		index: "gloomWispBeguile", name: "Beguile", enemyIndex: "gloomWisp", rarity: "enemy", costArray: {},
		targetMode: "randomEnemy",
		tagArray: ["charm"],
		effectArray: [{ index: "lust", amount: 8 }],
	},

	//--- Hollow Knight (soldier). ARMOUR-BREAKER: strips Temporary HP and reaches past the front. ---
	{
		index: "hollowKnightCleave", name: "Cleave", enemyIndex: "hollowKnight", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [{ index: "damage", amount: 5 }],
	},
	{
		index: "hollowKnightPierce", name: "Pierce", enemyIndex: "hollowKnight", rarity: "enemy", costArray: {},
		//Reaches past the front line to whoever is hiding at the back.
		targetMode: "backEnemy",
		effectArray: [{ index: "damageIgnoringTemporary", amount: 9 }],
	},
	{
		index: "hollowKnightBrace", name: "Brace", enemyIndex: "hollowKnight", rarity: "enemy", costArray: {},
		targetMode: "self",
		effectArray: [
			{ index: "temporaryHealth", amount: 8 },
			{ index: "applyStatus", status: "strength", stacks: 1 },
		],
	},
	{
		//THE ANSWER TO A PARTY THAT ONLY BUYS GOLD. Strips the target's temporary health away and pushes
		//lust into the gap it leaves, so a Brienne standing behind a wall of tHP is exactly who it wants.
		index: "hollowKnightStrip", name: "Strip", enemyIndex: "hollowKnight", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["exposure"],
		effectArray: [
			{ index: "removeTemporaryHealth", amount: 10 },
			{ index: "lust", amount: 8 },
		],
	},

	//--- The Matriarch (boss, region 1). SUMMONS AND LUST: her brood bursts as it dies, and her charged
	//--- moves are the fight's clock. ---
	{
		index: "matriarchLash", name: "Lash", enemyIndex: "matriarch", rarity: "enemy", costArray: {},
		//Aimed at the front, like most attacks.
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 14 }],
	},
	{
		index: "matriarchCarapace", name: "Carapace", enemyIndex: "matriarch", rarity: "enemy", costArray: {},
		targetMode: "self",
		effectArray: [{ index: "temporaryHealth", amount: 16 }],
	},
	{
		index: "matriarchBloom", name: "Bloom", enemyIndex: "matriarch", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [
			{ index: "applyStatus", status: "sundered", stacks: 1 },
			{ index: "applyStatus", status: "poison", stacks: 3 },
		],
	},
	{
		index: "matriarchSwarm", name: "Swarm", enemyIndex: "matriarch", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [{ index: "repeat", times: 2, effectArray: [{ index: "damage", amount: 5 }] }],
	},
	{
		//An enemy calling for help. Summons join the SUMMONER's team, so this card played by a Matriarch
		//fighting for the party would call her brood to the party's side.
		index: "matriarchBrood", name: "Brood", enemyIndex: "matriarch", rarity: "enemy", costArray: {},
		targetMode: "none",
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "summonEnemy", enemy: "sporeling", count: 2 },
			{ index: "message", text: "The Matriarch's brood splits from her back." },
		],
	},
	{
		//The boss's lust card, and a charged one. Venom alone: with two tags the weakness multipliers
		//multiply together, and two maxed weaknesses would take the hit to 40.
		index: "matriarchEmbrace", name: "Embrace", enemyIndex: "matriarch", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		chargeCost: 3,
		tagArray: ["venom"],
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "lust", amount: 7 }],
	},
	{
		index: "matriarchWail", name: "Wail", enemyIndex: "matriarch", rarity: "enemy", costArray: {},
		targetMode: "none",
		effectArray: [
			{ index: "addCardToPile", card: "curseDread", pile: "discardPile", count: 1 },
			{ index: "message", text: "The Matriarch's wail settles into the deck." },
		],
	},

	//--- Earthstar (support). The robed supports differentiate by SPECIES rather than job title, and the
	//--- fungus dictates the body. An earthstar is
	//--- squat and round and splits along a seam to seed, which is the summon she already had -- low and
	//--- wide, and nothing like the other three. SEEDS: a charged call for a fresh Sporeling, so the party
	//--- kills her first or fights a patch. ---
	{
		//Was "Spade". An earthstar carries no tools; its stiff outer rays are the weapon it already has.
		//Named for the ray rather than for the hit, per the story bible's card-naming rule.
		index: "gardenerSpade", name: "Stiff Ray", enemyIndex: "gardener", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 7 }],
	},
	{
		index: "gardenerMulch", name: "Mulch", enemyIndex: "gardener", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		effectArray: [{ index: "temporaryHealth", amount: 5 }],
	},
	{
		//A slow clock laid on one fighter. Telegraphed clearly, so it reads as a deadline rather than
		//a surprise.
		//Sowing spores INTO somebody is Venom by definition. Added into the slack she already had --
		//she ran 3.5 expected damage against a 4.4 target.
		index: "gardenerSow", name: "Sow Spores", enemyIndex: "gardener", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["venom"],
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 3 },
			{ index: "lust", amount: 3 },
		],
	},
	{
		//Was "Replant", which needs a gardener. Seeding is what the species does by itself.
		index: "gardenerReplant", name: "Seed", enemyIndex: "gardener", rarity: "enemy", costArray: {},
		targetMode: "none",
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "summonEnemy", enemy: "sporeling", count: 1 },
			{ index: "message", text: "She splits along a seam, and a fresh Sporeling climbs out." },
		],
	},

	//--- Bracket Elder (caster). a shelf fungus, ancient by growth rings
	//--- rather than by beard -- lopsided and broad, with shelves growing off her own back. Her img2img
	//--- source is `mossyhat-b`, which the inspo index already flags as "the Fungal Sage answer": brim as
	//--- cap, drapes as hanging gills, train as mycelium. CURSE-WEAVER: Frail on the party's defence,
	//--- Artifact on its own. ---
	{
		index: "sageSporebolt", name: "Sporebolt", enemyIndex: "sage", rarity: "enemy", costArray: {},
		targetMode: "randomEnemy",
		effectArray: [{ index: "damage", amount: 11 }],
	},
	{
		//Was "Mire", a word from the water theme the story bible dropped. Shelves growing over somebody
		//is the same effect read off the species.
		index: "sageMire", name: "Overgrowth", enemyIndex: "sage", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [{ index: "applyStatus", status: "frail", stacks: 2 }],
	},
	{
		//One stack of Poison traded for three Lust, which is exactly threat-neutral -- Poison 3 counts
		//6 as it ticks down, Poison 2 counts 3, and the Lust makes up the other 3.
		index: "sageWithering", name: "Withering Bloom", enemyIndex: "sage", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["venom"],
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 2 },
			{ index: "lust", amount: 3 },
		],
	},
	{
		//Frail already answers gold; the Ward answers debuffs, and the Hex answers the deck. No single
		//answer shuts a build down, which is the design law.
		index: "sageWard", name: "Ward", enemyIndex: "sage", rarity: "enemy", costArray: {},
		targetMode: "self",
		effectArray: [
			{ index: "temporaryHealth", amount: 8 },
			{ index: "applyStatus", status: "artifact", stacks: 1 },
		],
	},
	{
		index: "sageHex", name: "Hex", enemyIndex: "sage", rarity: "enemy", costArray: {},
		targetMode: "none",
		effectArray: [{ index: "addCardToPile", card: "curseWisp", pile: "drawPile", count: 1 }],
	},

	//--- Spore Alchemist (support). the ONE of the four robes that does not
	//--- change. Fly agaric, and the tone rule's own worked example of the register the game wants --
	//--- "mushroom hat, torn skirt, glowing eyes, drunk and having a wonderful time". The other three are
	//--- what differ from her, so recasting her would cost the tone rule its reference. THE BREWER:
	//--- Strength for the whole line, so a slow fight gets worse every turn she stands. ---
	{
		index: "alchemistFlask", name: "Volatile Flask", enemyIndex: "alchemist", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 6 }],
	},
	{
		//The brew's two damage becomes two Lust. She is the tone reference -- drunk and having a
		//wonderful time -- so what comes off her flask should be fumes rather than shrapnel. CHARM
		//rather than venom: venom is something done to you, and she is not doing anything to anybody.
		//She is enjoying herself and it is catching.
		index: "alchemistBrew", name: "Sweet Vapour", enemyIndex: "alchemist", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["charm"],
		effectArray: [{ index: "lust", amount: 2 }],
	},
	{
		index: "alchemistFumes", name: "Choking Fumes", enemyIndex: "alchemist", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 2 },
			{ index: "applyStatus", status: "weak", stacks: 1 },
		],
	},
	{
		//Kept for old saves that telegraphed it; the Tonic replaced it.
		index: "alchemistDraught", name: "Draught", enemyIndex: "alchemist", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		effectArray: [{ index: "temporaryHealth", amount: 8 }],
	},
	{
		index: "alchemistTonic", name: "Fortifying Tonic", enemyIndex: "alchemist", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "applyStatus", status: "strength", stacks: 1 }],
	},

	//--- Bark Sentinel (tank). THORNWALL: starts with Thorns and grows more, so many small hits cost the
	//--- party; one big hit does not. Guards its line. ---
	{
		//Four of its ten damage is Lust. Being pinned against a walking palisade is Restraint, and it
		//gives the tank a tag to teach without making it hit harder.
		index: "sentinelBash", name: "Shield Bash", enemyIndex: "shield", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["restraint"],
		effectArray: [
			{ index: "damage", amount: 6 },
			{ index: "lust", amount: 4 },
		],
	},
	{
		index: "sentinelBrace", name: "Brace", enemyIndex: "shield", rarity: "enemy", costArray: {},
		targetMode: "self",
		effectArray: [{ index: "temporaryHealth", amount: 8 }],
	},
	{
		index: "sentinelGuard", name: "Guard", enemyIndex: "shield", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		effectArray: [{ index: "temporaryHealth", amount: 6 }],
	},
	{
		//Kept for old saves that telegraphed it; Bristle replaced it.
		index: "sentinelRetort", name: "Retort", enemyIndex: "shield", rarity: "enemy", costArray: {},
		targetMode: "self",
		effectArray: [{ index: "applyStatus", status: "retort", stacks: 2 }],
	},
	{
		index: "sentinelBristle", name: "Bristle", enemyIndex: "shield", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "applyStatus", status: "thorns", stacks: 2 }],
	},

	//--- Kobold Scavenger (elite). BOMBS: a charged satchel on everyone, and an armadillo's curl. ---
	{
		index: "scavengerClaw", name: "Claw", enemyIndex: "scavenger", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 10 }],
	},
	{
		index: "scavengerScatter", name: "Scatterbombs", enemyIndex: "scavenger", rarity: "enemy", costArray: {},
		targetMode: "randomEnemy",
		effectArray: [{ index: "repeat", times: 3, effectArray: [{ index: "damage", amount: 5 }] }],
	},
	{
		//The armadillo answer: curl and wait out the burst.
		index: "scavengerCurl", name: "Curl Up", enemyIndex: "scavenger", rarity: "enemy", costArray: {},
		targetMode: "self",
		effectArray: [{ index: "temporaryHealth", amount: 18 }],
	},
	{
		//EXPOSURE: the cargo cult's own kit list is "hoses and weed sprayers, bellows-fed, loaded with
		//acidic spore-sludge" (the story bible), and what acidic sludge takes off a party is its gear.
		index: "scavengerFumes", name: "Chem Fumes", enemyIndex: "scavenger", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["exposure"],
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 2 },
			{ index: "applyStatus", status: "weak", stacks: 1 },
			{ index: "lust", amount: 2 },
		],
	},
	{
		//THE BIG ONE. Charged, so the telegraph warns the party to heal or end it first.
		index: "scavengerBigBomb", name: "Big Bomb", enemyIndex: "scavenger", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		chargeCost: 3,
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "damage", amount: 12 },
			{ index: "message", text: "A whole satchel of bombs goes off at once." },
		],
	},

	//--- The Juggernaut: the second boss. He ignores the party's formation, and his companion keeps
	//--- him clean. ---
	//THE MATRIARCH OWNS SUMMONS AND LUST. Her counterpart owns POSITION and SUNDERED: every blow lays
	//Sundered on its target (so who stands where and who has been hit matters), his log reaches the
	//whole line, his thrown debris reaches the back, and Backhand shoves whoever is in front to the back.
	//Log Sweep is the exception -- it WEAKENS only the front, blunting the party's own swing. Where the
	//Matriarch calls a brood, his little companion blows a whistle that strips the debuffs off him.
	{
		index: "juggernautSweep", name: "Log Sweep", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [
			{ index: "damage", amount: 10 },
			//Weak on the FRONT only, not the whole line the damage sweeps.
			{ index: "applyStatus", status: "weak", stacks: 3, targetOverride: "frontEnemy" },
		],
	},
	{
		//Six of its eighteen damage is Lust. He gets exactly ONE lust move out of nine -- Act1-A is
		//the sub-act with much less focus on lust, and its boss is where that shows.
		index: "juggernautCrush", name: "Crush", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["restraint"],
		effectArray: [
			{ index: "damage", amount: 12 },
			{ index: "lust", amount: 6 },
			{ index: "applyStatus", status: "sundered", stacks: 3 },
		],
	},
	{
		//Over the front line: the boss's answer to "the squishy one is at the back".
		index: "juggernautHurl", name: "Hurl Debris", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		targetMode: "backEnemy",
		effectArray: [
			{ index: "damage", amount: 13 },
			{ index: "applyStatus", status: "sundered", stacks: 3 },
		],
	},
	{
		//POSITION AS A MECHANIC: whoever stands in front is thrown to the back. The target is bound once,
		//when the card resolves, so the Sundered lands on the SAME fighter after the shove -- the printed
		//text says so outright.
		index: "juggernautBackhand", name: "Backhand", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		text: "Deal {damage:9} damage. Shove the front member to the back, then apply 3 Sundered.",
		effectArray: [
			{ index: "damage", amount: 9 },
			{ index: "shiftParty", shift: "back" },
			{ index: "applyStatus", status: "sundered", stacks: 3 },
		],
	},
	{
		//The dug-in turn. Strength makes everything after it worse, so it is worth interrupting.
		index: "juggernautUproot", name: "Uproot", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		targetMode: "self",
		chargeCost: 3,
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "temporaryHealth", amount: 18 },
			{ index: "applyStatus", status: "strength", stacks: 2 },
		],
	},
	{
		index: "juggernautRoar", name: "Bellow", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		chargeCost: 2,
		effectArray: [{ index: "applyStatus", status: "sundered", stacks: 2 }],
	},
	{
		//THE COMPANION, clearing the mud off. See the cleanse verb.
		index: "juggernautWhistle", name: "Whistle", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "cleanse" },
			{ index: "temporaryHealth", amount: 12 },
		],
	},
	{
		//THE PAYOFF FOR THE SUNDERED HE LAYS DOWN: deals double to a target already Sundered, and
		//applies nothing itself, so the party has to decide whether to clear the Sundered or eat this.
		//See the ifStatus value; a telegraph binds no target, so it prints the base 12.
		index: "juggernautOverhead", name: "Overhead Smash", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{
			index: "damage",
			amount: { index: "math", operation: "multiply", left: 12,
				right: { index: "ifStatus", status: "sundered", of: "target", then: 2, else: 1 } },
		}],
	},
	{
		//THE SIGNATURE: an avalanche of everything he has picked up on his way through Act 1. Three
		//random things, each at a random party member. Most hurt; a couple help; the locket is a one-off
		//relic. See the throwRandomCards verb -- the seam for a move that expands into cards.
		//Its type is set BY HAND: the throw verb derives nothing, and the telegraph should still read as
		//the attack it is.
		index: "juggernautAvalanche", name: "Avalanche", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		targetMode: "none",
		typeArray: ["damage"],
		chargeCost: 4,
		text: "Hurl 3 random things he has found at random party members.",
		animationArray: [{ animation: "rise" }],
		effectArray: [{
			index: "throwRandomCards", count: 3,
			cardArray: [
				"thrownScrap", "thrownBattery", "thrownSludge", "thrownSignboard", "thrownWire",
				"thrownRottenCap", "thrownFlask", "thrownBalm", "thrownLocket",
			],
		}],
	},

	//THE NINE THROWABLES. Each is a real card, so Avalanche can reveal them and the log can explain
	//them. All target `randomEnemy` -- a random party member -- and most hurt. `onceEver` marks the
	//locket, which the engine drops from the pool for good once it has been thrown.
	{
		index: "thrownScrap", name: "Rusted Scrap", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		artPath: "cards/art/neutral-whetted",
		targetMode: "randomEnemy",
		effectArray: [{ index: "damage", amount: 10 }],
	},
	{
		index: "thrownBattery", name: "Cracked Battery", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		artPath: "cards/art/neutral-warcry",
		targetMode: "randomEnemy",
		effectArray: [
			{ index: "damage", amount: 6 },
			{ index: "applyStatus", status: "sundered", stacks: 1 },
		],
	},
	{
		index: "thrownSludge", name: "Bottle of Sludge", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		artPath: "cards/art/curse-wisp",
		targetMode: "randomEnemy",
		effectArray: [{ index: "applyStatus", status: "poison", stacks: 4 }],
	},
	{
		index: "thrownSignboard", name: "Heavy Signboard", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		artPath: "cards/art/neutral-hedge",
		targetMode: "randomEnemy",
		effectArray: [
			{ index: "damage", amount: 8 },
			{ index: "applyStatus", status: "weak", stacks: 1 },
		],
	},
	{
		index: "thrownWire", name: "Sparking Wire", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		artPath: "cards/art/neutral-focus",
		targetMode: "randomEnemy",
		effectArray: [
			{ index: "damage", amount: 5 },
			{ index: "applyStatus", status: "frail", stacks: 1 },
		],
	},
	{
		index: "thrownRottenCap", name: "Rotten Cap", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		artPath: "cards/art/neutral-tonic",
		targetMode: "randomEnemy",
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 2 },
			{ index: "applyStatus", status: "weak", stacks: 1 },
		],
	},
	{
		index: "thrownFlask", name: "Alchemist's Flask", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		artPath: "cards/art/neutral-tonic",
		targetMode: "randomEnemy",
		effectArray: [
			{ index: "damage", amount: 7 },
			{ index: "applyStatus", status: "frail", stacks: 2 },
		],
	},
	{
		//ONE OF THE GOOD ONES: a balm the party would rather keep than catch.
		index: "thrownBalm", name: "Wild Balm", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		artPath: "cards/art/neutral-improvise",
		targetMode: "randomEnemy",
		effectArray: [
			{ index: "heal", amount: 8 },
			{ index: "message", text: "Whatever it is, it helps." },
		],
	},
	{
		//THE ONE-OFF, EXCLUSIVE TO THE JUGGERNAUT: it is thrown only by Avalanche (no other card's pool
		//names it), it is `rarity: "enemy"` so no reward or shop can ever offer it, and nothing else in
		//the content tables grants it. Test [75] holds that line. The first time it is ever thrown it
		//hands over a common relic and is gone for good.
		index: "thrownLocket", name: "Tarnished Locket", enemyIndex: "juggernaut", rarity: "enemy", costArray: {},
		artPath: "cards/art/neutral-improvise",
		onceEver: true,
		targetMode: "randomEnemy",
		effectArray: [
			{ index: "gainRandomRelic", rarity: "common" },
			{ index: "message", text: "Something small and gold falls out of the junk." },
		],
	},

	//-------------------------------------------------------------------------------------------
	//NEW ENEMIES (rework/enemies/ENEMIES-01.md §3). Region 1 first, then the Flooded Vault, then the
	//new elite and the two new bosses.
	//-------------------------------------------------------------------------------------------

	//--- Puffcap (minion). THE COUNTDOWN: a fixed three-turn fuse. It swells, ripens, then bursts over
	//--- the whole party and is gone. Killing it inside three turns is the whole answer. ---
	{
		index: "puffcapSwell", name: "Swell", enemyIndex: "puffcap", rarity: "enemy", costArray: {},
		targetMode: "self",
		text: "It swells. Two turns until it bursts.",
		effectArray: [{ index: "temporaryHealth", amount: 3 }],
	},
	{
		index: "puffcapRipen", name: "Ripen", enemyIndex: "puffcap", rarity: "enemy", costArray: {},
		targetMode: "self",
		text: "It ripens. It bursts next turn.",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "temporaryHealth", amount: 3 }],
	},
	{
		//Three of its seven damage is Lust now. A burst of spores in the face teaches Venom, and the
		//threat enemy-template.js measures is unchanged because Lust counts as damage there.
		index: "puffcapBurst", name: "Burst", enemyIndex: "puffcap", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["venom"],
		text: "Deal {damage:4} damage, {lust:3} Lust and apply 2 Poison to every party member. The Puffcap is destroyed.",
		effectArray: [
			{ index: "damage", amount: 4 },
			{ index: "lust", amount: 3 },
			{ index: "applyStatus", status: "poison", stacks: 2 },
			{ index: "loseHealth", amount: { index: "stat", stat: "health", of: "source" }, targetOverride: "self" },
		],
	},

	//--- Mold Leech (striker). LIFESTEAL: every bite heals it, so chip damage never catches up. ---
	{
		index: "leechLatch", name: "Latch", enemyIndex: "moldLeech", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [
			{ index: "damage", amount: 11 },
			{ index: "heal", amount: 6, targetOverride: "self" },
		],
	},
	{
		index: "leechSiphon", name: "Siphon", enemyIndex: "moldLeech", rarity: "enemy", costArray: {},
		targetMode: "randomEnemy",
		tagArray: ["venom"],
		effectArray: [
			{ index: "lust", amount: 7 },
			{ index: "heal", amount: 4, targetOverride: "self" },
		],
	},
	{
		index: "leechEngorge", name: "Engorge", enemyIndex: "moldLeech", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "applyStatus", status: "strength", stacks: 2 }],
	},

	//--- Witch's Butter (support). a slime mould, and the only one of the
	//--- four with no fixed outline -- spreading, dripping and re-forming, which is what "Moldshaper"
	//--- described as a job and the species does as a body. REGROWTH: Regeneration on the whole line,
	//--- which out-heals a slow poison. ---
	{
		index: "moldshaperMend", name: "Mend", enemyIndex: "moldshaper", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "applyStatus", status: "regeneration", stacks: 3 }],
	},
	{
		//Was "Rot Touch". Nothing in the catacombs rots -- the tone rule is explicit -- and a slime mould
		//leaves something slick behind rather than something decaying.
		index: "moldshaperRotTouch", name: "Slick Touch", enemyIndex: "moldshaper", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [
			{ index: "damage", amount: 9 },
			{ index: "addCardToPile", card: "curseWisp", pile: "discardPile", count: 1 },
		],
	},
	{
		//The veil settles on the whole party, which is the move's shape already. Added into slack --
		//3.4 expected damage against a 4.4 target. RESTRAINT rather than venom: a slime mould is the
		//one of the four robes with no fixed outline, and what it does is spread
		//over a thing and hold it. Act 1-1 also has to MIX its threats rather than teach one tag.
		index: "moldshaperVeil", name: "Spore Veil", enemyIndex: "moldshaper", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["restraint"],
		effectArray: [
			{ index: "applyStatus", status: "weak", stacks: 1 },
			{ index: "lust", amount: 2 },
		],
	},
	{
		index: "moldshaperReshape", name: "Reshape", enemyIndex: "moldshaper", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		effectArray: [{ index: "cleanse" }],
	},

	//--- Sporeguard (soldier). Retooled from Cordyceps Husk into a mushroom soldier who uses the shield
	//--- sprite. Frontier infantry in scavenged human plate, which
	//--- is Act1-A's premise ("shrooms are notably using more human weapons and armor"). SEEDED: a
	//--- Sporeling bursts out when it falls (the passive), so it is two fights in one body -- which reads
	//--- as a mushroom shedding rather than as anything rotting. Indices keep the old `husk` spelling
	//--- because a telegraphed move and a mid-combat save both store them. ---
	{
		index: "huskSword", name: "Rusted Sword", enemyIndex: "cordycepsHusk", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 9 }],
	},
	{
		//Was "Lurch", which only a shambling body can do. A soldier behind a shield shoves.
		index: "huskLurch", name: "Shield Shove", enemyIndex: "cordycepsHusk", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [
			{ index: "damage", amount: 6 },
			{ index: "applyStatus", status: "weak", stacks: 1 },
		],
	},
	{
		index: "huskCough", name: "Spore Cough", enemyIndex: "cordycepsHusk", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["venom"],
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 1 },
			{ index: "lust", amount: 3 },
		],
	},

	//--- Glowcap (caster). CHARM: Lust first and last. The line-up's answer to a party that only
	//--- counts health. The card INDICES still read `moth*` and must keep doing so -- they are save
	//--- data, and only the creature changed, not its moves. ---
	{
		index: "mothKiss", name: "Pollen Kiss", enemyIndex: "glowMoth", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["charm"],
		effectArray: [{ index: "lust", amount: 9 }],
	},
	{
		index: "mothDust", name: "Mesmer Dust", enemyIndex: "glowMoth", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["charm"],
		effectArray: [{ index: "lust", amount: 4 }],
	},
	{
		index: "mothFlutter", name: "Flutter", enemyIndex: "glowMoth", rarity: "enemy", costArray: {},
		targetMode: "self",
		effectArray: [{ index: "temporaryHealth", amount: 6 }],
	},
	{
		index: "mothDazzle", name: "Dazzle", enemyIndex: "glowMoth", rarity: "enemy", costArray: {},
		targetMode: "randomEnemy",
		effectArray: [
			{ index: "applyStatus", status: "weak", stacks: 1 },
			{ index: "applyStatus", status: "frail", stacks: 1 },
		],
	},

	//--- Shieldcap (minion, region 2). Was the Silt Crawler. A dome-capped skirmisher
	//--- behind a looted pavise -- which is what PLATED was describing all along, and scavenged human
	//--- plate says it better than a crab shell did. Low and wide; its `presentation.scale` of 0.7 was
	//--- already the right body. PLATED: every hit on it is blunted, so many small hits are the wrong
	//--- answer and one big one is the right one. ---
	{
		index: "crawlerPinch", name: "Billhook", enemyIndex: "siltCrawler", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 11 }],
	},
	{
		//NO LUST, deliberately. Act1-A is the sub-act with much less focus on lust, and the Shieldcap
		//stands in six of its line-ups -- putting a tag on the
		//body the sub-act fields most is what gave it a Restraint theme it is not supposed to have.
		index: "crawlerScuttle", name: "Pavise", enemyIndex: "siltCrawler", rarity: "enemy", costArray: {},
		targetMode: "randomEnemy",
		effectArray: [
			{ index: "damage", amount: 6 },
			{ index: "applyStatus", status: "weak", stacks: 1 },
		],
	},
	{
		index: "crawlerBurrow", name: "Turtle", enemyIndex: "siltCrawler", rarity: "enemy", costArray: {},
		targetMode: "self",
		effectArray: [{ index: "temporaryHealth", amount: 8 }],
	},

	//--- Cagecap (striker, region 2). Was the Mire Eel. A cage fungus -- the cap opens
	//--- into a red lattice -- so its Restraint move is the species closing rather than a snake wrapped
	//--- round somebody. FOLD IN: it shuts the lattice behind Temporary HP and comes up stronger. The
	//--- telegraph is the warning. ---
	{
		index: "eelBite", name: "Spur", enemyIndex: "mireEel", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 13 }],
	},
	{
		index: "eelSubmerge", name: "Fold In", enemyIndex: "mireEel", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "temporaryHealth", amount: 12 },
			{ index: "applyStatus", status: "strength", stacks: 3 },
		],
	},
	{
		index: "eelConstrict", name: "Cage", enemyIndex: "mireEel", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["restraint"],
		effectArray: [
			{ index: "damage", amount: 7 },
			{ index: "lust", amount: 8 },
		],
	},

	//--- Bolete Hook (tank, region 2). Was the Bog Toad. A thick-stemmed bolete carrying
	//--- a looted hooked halberd, and the hook is what the tongue was doing -- the move did not need a
	//--- frog to work, only something long enough to reach the back rank. THE HOOK: it drags whoever
	//--- hides at the back to the front, so a formation is never safe for long. ---
	{
		//NO LUST, deliberately -- see the Shieldcap's Pavise. The hook reaching
		//the back rank is friction, which is what Act1-A is for; the Lust belongs to B and C.
		index: "toadTongue", name: "Hook Pull", enemyIndex: "bogToad", rarity: "enemy", costArray: {},
		targetMode: "backEnemy",
		text: "Deal {damage:9} damage to the party member at the back and drag them to the front.",
		effectArray: [
			{ index: "damage", amount: 9 },
			{ index: "shiftParty", shift: "front" },
		],
	},
	{
		index: "toadSlam", name: "Shoulder", enemyIndex: "bogToad", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 12 }],
	},
	{
		index: "toadCroak", name: "War Horn", enemyIndex: "bogToad", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [
			{ index: "applyStatus", status: "weak", stacks: 1 },
			{ index: "temporaryHealth", amount: 6, targetOverride: "self" },
		],
	},
	{
		index: "toadSpit", name: "Spore Sack", enemyIndex: "bogToad", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "applyStatus", status: "poison", stacks: 4 }],
	},

	//--- Scrap Salvager (soldier, region 2). Was the Drowned Salvager, and "Drowned" was the water theme
	//--- the story bible dropped. He keeps the battery, because it is the POINT: an intruder from Act 2,
	//--- an elite enemy down here in Act 1. A creature OF Act 1 never carries Earth junk, so his scrap
	//--- reads as a
	//--- trespasser's rather than as a lore slip. The Kobold Scavenger is the precedent already in the
	//--- game. THE THUNDER BOX: a kobold with a battery on a spear.
	//--- Sundered on every jab, and a charged Discharge across the whole party. ---
	{
		//ELITE: 10 to 14, which is what carries the promotion.
		index: "salvagerSpear", name: "Spark Spear", enemyIndex: "drownedSalvager", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [
			{ index: "damage", amount: 14 },
			{ index: "applyStatus", status: "sundered", stacks: 1 },
		],
	},
	{
		//Three of its five damage is Lust. It is a snare; the tag was always what the move was about.
		index: "salvagerSnare", name: "Wire Snare", enemyIndex: "drownedSalvager", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["restraint"],
		text: "Deal {damage:2} damage and {lust:3} Lust to the front party member and drag them to the back.",
		effectArray: [
			{ index: "damage", amount: 2 },
			{ index: "lust", amount: 3 },
			{ index: "shiftParty", shift: "back" },
		],
	},
	{
		//ELITE: 7 to 10 on the charged sweep. Still telegraphed three turns out, so it is
		//more to play around rather than less warning.
		index: "salvagerDischarge", name: "Discharge", enemyIndex: "drownedSalvager", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		chargeCost: 3,
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "damage", amount: 10 },
			{ index: "applyStatus", status: "sundered", stacks: 1 },
		],
	},
	{
		index: "salvagerPatch", name: "Patch Up", enemyIndex: "drownedSalvager", rarity: "enemy", costArray: {},
		targetMode: "self",
		effectArray: [{ index: "temporaryHealth", amount: 10 }],
	},

	//--- Foxfire (caster, region 2). Charm needs a face, so this replaced a faceless jelly. Foxfire
	//--- is the real name for fungus that glows, and Omphalotus is the species that does it: a myconid
	//--- lamplighter marking the frontier's claim after dark, with a face and a lamp and somebody
	//--- actually doing the charming. THE HOT LAMP: Thorns are the lamp being too hot to grab, so the
	//--- fast answer hurts and the slow one charms. ---
	{
		index: "jellyLure", name: "Lure", enemyIndex: "lanternJelly", rarity: "enemy", costArray: {},
		targetMode: "randomEnemy",
		tagArray: ["charm"],
		effectArray: [{ index: "lust", amount: 10 }],
	},
	{
		index: "jellySting", name: "Lamp Hook", enemyIndex: "lanternJelly", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [
			{ index: "damage", amount: 8 },
			{ index: "applyStatus", status: "frail", stacks: 1 },
		],
	},
	{
		index: "jellyPulse", name: "Gleam", enemyIndex: "lanternJelly", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["charm"],
		effectArray: [{ index: "lust", amount: 4 }],
	},

	//--- Hollow Champion (elite). EN GARDE: a stance of Temporary HP and Retort that punishes swinging
	//--- into it, then a Lunge that punishes waiting. ---
	{
		index: "championCleave", name: "Wide Cleave", enemyIndex: "hollowChampion", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [{ index: "damage", amount: 6 }],
	},
	{
		index: "championLunge", name: "Lunge", enemyIndex: "hollowChampion", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 18 }],
	},
	{
		index: "championGuard", name: "En Garde", enemyIndex: "hollowChampion", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "temporaryHealth", amount: 14 },
			{ index: "applyStatus", status: "retort", stacks: 2 },
		],
	},
	{
		//Half its damage becomes Lust. A duellist's thrust takes the guard apart rather than the
		//body, which is the same thing the move already did by ignoring Temporary HP -- and the Hollow
		//Knight's Strip already teaches Exposure, so the family reads as one school.
		index: "championThrust", name: "Piercing Thrust", enemyIndex: "hollowChampion", rarity: "enemy", costArray: {},
		targetMode: "backEnemy",
		tagArray: ["exposure"],
		effectArray: [
			{ index: "damageIgnoringTemporary", amount: 6 },
			{ index: "lust", amount: 6 },
		],
	},

	//--- The Head Gardener (boss, region 1). A GARDEN OF COUNTDOWNS: she plants Puffcaps and grafts
	//--- Strength onto whatever grows, so the party chooses between the fuses and the gardener. ---
	{
		index: "headGardenerShears", name: "Shears", enemyIndex: "headGardener", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 15 }],
	},
	{
		//A boss with six moves that taught the ledger nothing was the worst case on the board. Added
		//rather than converted, into a very large slack -- 7.7 expected damage against an 18.1 target.
		index: "headGardenerSnare", name: "Root Snare", enemyIndex: "headGardener", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["restraint"],
		effectArray: [
			{ index: "damage", amount: 6 },
			{ index: "lust", amount: 4 },
			{ index: "applyStatus", status: "weak", stacks: 1, targetOverride: "frontEnemy" },
		],
	},
	{
		index: "headGardenerGraft", name: "Graft", enemyIndex: "headGardener", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "temporaryHealth", amount: 8 },
			{ index: "applyStatus", status: "strength", stacks: 1 },
		],
	},
	{
		index: "headGardenerPlant", name: "Plant", enemyIndex: "headGardener", rarity: "enemy", costArray: {},
		targetMode: "none",
		//DECLARED to keep the word "Summon" off the card. A keyword attaches by the word PRINTED on the
		//card, and the only `summon` keyword in the table is Anastasia's, whose sidecar explains Pawns
		//filling a fallen piece's slot and her golem cap -- none of which is true here.
		//The general fix (a `summon` keyword that reads true for any summoner, with the chess rules moved
		//onto the pieces) belongs to `chessmaster/`, whose lane owns that entry.
		text: "Two Puffcaps rise from the soil beside her.",
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "summonEnemy", enemy: "puffcap", count: 2 },
			{ index: "message", text: "Two Puffcaps push up through the soil, already swelling." },
		],
	},
	{
		index: "headGardenerOvergrow", name: "Overgrow", enemyIndex: "headGardener", rarity: "enemy", costArray: {},
		targetMode: "none",
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "summonEnemy", enemy: "gardener", count: 1 },
			{ index: "summonEnemy", enemy: "sporeling", count: 1 },
			{ index: "message", text: "The garden grows a gardener of its own." },
		],
	},
	{
		//One of the three lashes becomes 4 Lust, which is threat-neutral. A whip that holds is the
		//second Restraint move her kit wanted.
		index: "headGardenerWhip", name: "Thorn Whip", enemyIndex: "headGardener", rarity: "enemy", costArray: {},
		targetMode: "randomEnemy",
		tagArray: ["restraint"],
		effectArray: [
			{ index: "repeat", times: 2, effectArray: [{ index: "damage", amount: 4 }] },
			{ index: "lust", amount: 4 },
		],
	},

	//--- The Shroud (boss, Act1-1). STILL FEEDING: The Damp takes a Bloom off every card the party plays,
	//--- and Fruiting hits everyone for the Bloom and clears it. A long combo feeds it; a slow turn
	//--- starves it. Neither is shut down. The card indices are the clerk's and stay that way, because
	//--- a telegraphed move stores the card's index. ---
	{
		index: "tallySlam", name: "Sickle", enemyIndex: "tallyman", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 16 }],
	},
	{
		index: "tallyCollect", name: "Seep", enemyIndex: "tallyman", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["exposure"],
		effectArray: [
			{ index: "removeTemporaryHealth", amount: 12 },
			{ index: "lust", amount: 8 },
		],
	},
	{
		//Spores settling on a party is exposure that needs no line of text to land.
		//`targetMode` is "none" because the move edits the piles, so the Lust names its own targets.
		//Added into slack: it ran 4.2 expected damage against a 22.1 target.
		index: "tallyAudit", name: "Settling", enemyIndex: "tallyman", rarity: "enemy", costArray: {},
		targetMode: "none",
		tagArray: ["exposure"],
		effectArray: [
			{ index: "addCardToPile", card: "curseWisp", pile: "drawPile", count: 2 },
			{ index: "lust", amount: 4, targetOverride: "allEnemies" },
		],
	},
	{
		index: "tallyReckoning", name: "Fruiting", enemyIndex: "tallyman", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		chargeCost: 3,
		text: "Deal 4 damage plus its Bloom to every party member, then clear the Bloom.",
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "damage", amount: { index: "math", operation: "add", left: 4, right: { index: "statusStacks", status: "tally", of: "source" } }, ignoresStrength: true },
			{ index: "removeStatus", status: "tally", targetOverride: "self" },
		],
	},
	{
		index: "tallyInterest", name: "Proliferate", enemyIndex: "tallyman", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "applyStatus", status: "tally", stacks: 5 },
			{ index: "temporaryHealth", amount: 10 },
		],
	},

	//>>> LANE E7 | flora | enemy cards >>>
	//===============================================================================================
	//ACT1-B, THE THORN ARBOR. The Venom sub-act (story bible s4: "the hotspot for venom and poison"),
	//so every Lust move here carries the `venom` tag and nothing here carries another.
	//Card names come from biological or structural ideas, never from what they do to a health bar
	//(story bible s8) -- "Nectar Glove", not "Poison Strike".
	//===============================================================================================

	//--- Wellspring, the bloom that feeds the arbor -------------------------------------------------
	{
		//Her whole silhouette is the bloom; this is it opening. The arbor's engine, and the reason a
		//Flora line-up has to be answered rather than out-paced.
		index: "wellspringRun", name: "Nectar Run", enemyIndex: "wellspring", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "applyStatus", status: "envenomed", stacks: 1 }],
	},
	{
		index: "wellspringMulch", name: "Leaf Mould", enemyIndex: "wellspring", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		effectArray: [{ index: "applyStatus", status: "regeneration", stacks: 3 }],
	},
	{
		//She is drawn asleep with her face inside the petals. This is the one time she leans out.
		index: "wellspringDrench", name: "Overflow", enemyIndex: "wellspring", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["venom"],
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 4 },
			{ index: "lust", amount: 5 },
		],
	},
	{
		index: "wellspringStem", name: "Stiff Stem", enemyIndex: "wellspring", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 8 }],
	},

	//--- Thorn Sprite, small body, enormous reach ---------------------------------------------------
	{
		//The two thorn loops in her drawing are longer than she is tall, and they go OVER the front
		//rank. Act 1's positioning disruption: annoying, not punishing (mechanics bible s5).
		index: "spriteLash", name: "Cane Loop", enemyIndex: "thornSprite", rarity: "enemy", costArray: {},
		targetMode: "backEnemy",
		effectArray: [{ index: "damage", amount: 10 }],
	},
	{
		index: "spriteSnare", name: "Briar Hitch", enemyIndex: "thornSprite", rarity: "enemy", costArray: {},
		targetMode: "randomEnemy",
		tagArray: ["venom"],
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 3 },
			{ index: "lust", amount: 3 },
		],
	},
	{
		//Mischief, not malice: she rearranges the line and finds it funny. No damage attached, which is
		//what keeps it friction rather than a punish.
		index: "spriteTangle", name: "Trip Line", enemyIndex: "thornSprite", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [
			{ index: "damage", amount: 4 },
			{ index: "shiftParty", shift: "back" },
			{ index: "message", text: "A vine loop whips around an ankle and somebody sits down hard." },
		],
	},

	//--- Trumpet Bell, the faceless datura ----------------------------------------------------------
	{
		//It has no face and no eyes, so it does not aim: everything it does goes over the whole party.
		index: "bellDrift", name: "Nightshade Drift", enemyIndex: "trumpetBell", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["venom"],
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 2 },
			{ index: "lust", amount: 2 },
		],
	},
	{
		//The two brass bells at its hem. A charged, telegraphed swell -- the Grind test, answered by
		//cleansing or by ending it before the bell finishes filling.
		index: "bellPeal", name: "Full Peal", enemyIndex: "trumpetBell", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [
			{ index: "damage", amount: 6 },
			{ index: "applyStatus", status: "festering", stacks: 1 },
		],
	},
	{
		index: "bellStoop", name: "Stoop", enemyIndex: "trumpetBell", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 8 }],
	},
	{
		//It closes around its own stem and drips. The dawdle Act 1 is supposed to have: it gains
		//nothing it can spend, and the party gets a turn back.
		index: "bellFurl", name: "Furl", enemyIndex: "trumpetBell", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "temporaryHealth", amount: 9 }],
	},

	//--- Fruit Alraune, who is delighted to share ---------------------------------------------------
	{
		//SHE IS BEING KIND. The drawing is a laughing girl holding a fruit up to be taken, and the
		//innocent reading stays available (story bible s3) -- the card heals, and the card is also why
		//the front fighter is now full of it. Nothing in the text says otherwise.
		index: "fruitWindfall", name: "Windfall", enemyIndex: "fruitAlraune", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["venom"],
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "heal", amount: 5 },
			{ index: "applyStatus", status: "poison", stacks: 4 },
			{ index: "lust", amount: 3 },
			//SHORT ON PURPOSE. Three effects already generate three sentences, and the card-fit rule
			//measured the longer version at 1.098 of its frame -- seven lines in a box that holds six.
			{ index: "message", text: "She beams when it is taken." },
		],
	},
	{
		//The fruit is most of her: she is half-sunk into it and it takes the hit for her.
		index: "fruitRind", name: "Thick Rind", enemyIndex: "fruitAlraune", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "temporaryHealth", amount: 10 },
			{ index: "applyStatus", status: "entrenched", stacks: 1 },
		],
	},
	{
		index: "fruitSpill", name: "Split Skin", enemyIndex: "fruitAlraune", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [
			{ index: "damage", amount: 5 },
			{ index: "applyStatus", status: "weak", stacks: 1 },
		],
	},
	{
		index: "fruitPip", name: "Pip Flick", enemyIndex: "fruitAlraune", rarity: "enemy", costArray: {},
		targetMode: "randomEnemy",
		effectArray: [{ index: "damage", amount: 7 }],
	},

	//--- Thorn Fencer, the sunflower in the red hat -------------------------------------------------
	{
		index: "fencerLunge", name: "Long Lunge", enemyIndex: "thornFencer", rarity: "enemy", costArray: {},
		targetMode: "backEnemy",
		effectArray: [{ index: "damage", amount: 13 }],
	},
	{
		//A rapier is a thorn: the point is what carries the venom, so the fast move is the tagged one.
		index: "fencerPrick", name: "Thorn Point", enemyIndex: "thornFencer", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["venom"],
		effectArray: [
			{ index: "damage", amount: 7 },
			{ index: "applyStatus", status: "poison", stacks: 2 },
			{ index: "lust", amount: 3 },
		],
	},
	{
		//The Burst test on this body: hitting her while she is set pays for it.
		index: "fencerGuard", name: "En Garde", enemyIndex: "thornFencer", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "applyStatus", status: "thorns", stacks: 3 }],
	},
	{
		index: "fencerFlourish", name: "Doffed Hat", enemyIndex: "thornFencer", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["venom"],
		effectArray: [
			{ index: "lust", amount: 4 },
			{ index: "applyStatus", status: "weak", stacks: 1 },
		],
	},

	//--- The sisters. One is open and one is shut, and that is the whole fight ----------------------
	{
		//Her drawing is an arm sheathed to the shoulder in running nectar. She is the open one.
		index: "sisterDayGlove", name: "Nectar Glove", enemyIndex: "arborSisterDay", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["venom"],
		effectArray: [
			{ index: "damage", amount: 10 },
			{ index: "applyStatus", status: "poison", stacks: 2 },
			{ index: "lust", amount: 4 },
		],
	},
	{
		index: "sisterDaySweep", name: "Petal Sweep", enemyIndex: "arborSisterDay", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [
			{ index: "damage", amount: 6 },
			{ index: "applyStatus", status: "festering", stacks: 1 },
		],
	},
	{
		//SHE FEEDS HER SISTER. The half of the duo that answers Burst: killing the open one first leaves
		//the shut one holding everything it was handed.
		//NO STRENGTH HERE. Strength on a boss that is TWO bodies compounds twice as fast as on one, and
		//budget-audit.js measured the pair at 28.3 gross per turn against a target of 18.2 with the
		//party losing 89% of its health. Envenomed alone still says what the move is for: she is
		//handing her sister the cup, and what is in it is the point.
		index: "sisterDayGift", name: "Share the Cup", enemyIndex: "arborSisterDay", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "applyStatus", status: "envenomed", stacks: 1 }],
	},
	{
		//The night sister's head is a bud that has not opened, and her ground is cracked and covered in
		//dropped petals. She does not strike; she stands there and the arbor works through her.
		//NO RETORT. Retort does not wear off, so a move that hands it to BOTH bodies every other turn
		//accumulates all fight: by turn eleven the pair was billing the party three damage per stack for
		//every hit their shields ate, and budget-audit.js measured 28 gross per turn against 18.2 with a
		//25% win rate. Trimming the numbers around it did nothing, because the number was not the
		//problem -- the stack was. She holds; she does not also punish.
		index: "sisterNightShut", name: "Closed Bud", enemyIndex: "arborSisterNight", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "temporaryHealth", amount: 8 }],
	},
	{
		index: "sisterNightFall", name: "Petal Fall", enemyIndex: "arborSisterNight", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["venom"],
		effectArray: [
			{ index: "applyStatus", status: "poison", stacks: 2 },
			{ index: "lust", amount: 4 },
		],
	},
	{
		//The Grind test: a charged move that arrives on a clock, telegraphed, and scales off what the
		//party has been allowed to stack up rather than off a flat number.
		index: "sisterNightRoot", name: "Deep Root", enemyIndex: "arborSisterNight", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		//DECLARED, like The Shroud's Fruiting: the generated line for a scaling amount reads "plus
		//stacks of poison", which says neither whose Poison nor how much.
		text: "Deal {damage:9} damage to the party member in front, plus 1 for each Poison they carry.",
		effectArray: [
			{
				index: "damage",
				amount: {
					index: "math", operation: "add",
					left: 9,
					right: { index: "statusStacks", status: "poison", of: "target" },
				},
			},
		],
	},
	//<<< LANE E7 | flora | enemy cards <<<

	//>>> LANE E7 | pollenRoad | enemy cards >>>
	//===============================================================================================
	//ACT1-C, THE POLLEN ROAD. The Charm sub-act (story bible s4: "the most focused on whatever the
	//alternate act 1 lust is. Probably charm"), so every Lust move here carries the `charm` tag.
	//
	//GUARDRAIL, and it applies to the WORDS as much as the pictures: this sub-act stands closest to
	//Act 3 and turns into a preview of it the moment it gets tidy. No gold, no halos, no hexagons,
	//nothing symmetrical, nothing ceremonial. The fencers are the exception that proves it -- their
	//discipline is real, and everyone around them has stopped bothering.
	//===============================================================================================

	//--- The Sable Fencer, black plate, visor down -------------------------------------------------
	{
		index: "sableThrust", name: "Straight Thrust", enemyIndex: "sableFencer", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 12 }],
	},
	{
		//Binding a blade is taking it out of line with the other. Here it takes the fighter out of line too.
		index: "sableBind", name: "Bind", enemyIndex: "sableFencer", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["charm"],
		effectArray: [
			{ index: "damage", amount: 5 },
			{ index: "applyStatus", status: "weak", stacks: 1 },
			{ index: "lust", amount: 3 },
		],
	},
	{
		index: "sableLine", name: "Hold the Line", enemyIndex: "sableFencer", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [{ index: "damage", amount: 4 }],
	},
	{
		//The cup guard is the widest part of the drawing. Answering a set guard costs something.
		index: "sableGuard", name: "Cup Guard", enemyIndex: "sableFencer", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "temporaryHealth", amount: 8 },
			{ index: "applyStatus", status: "thorns", stacks: 2 },
		],
	},

	//--- The Argent Fencer, the same discipline with the armour cut away ---------------------------
	{
		index: "argentLunge", name: "Long Lunge", enemyIndex: "argentFencer", rarity: "enemy", costArray: {},
		targetMode: "backEnemy",
		effectArray: [{ index: "damage", amount: 16 }],
	},
	{
		//A remise is a second thrust without withdrawing -- she does not step back, ever, which is the
		//whole difference between her plate and her partner's.
		index: "argentRemise", name: "Remise", enemyIndex: "argentFencer", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["charm"],
		effectArray: [
			{ index: "damage", amount: 8 },
			{ index: "lust", amount: 5 },
		],
	},
	{
		//NO SENSITIVE HERE. Sensitive multiplies every Lust move that follows it, and three bodies on
		//this road applying it put five line-ups over tuning.balance.lustToDamageRatioMaximum --
		//measured, not guessed (budget-audit.js, 12.4 lust per turn against a cap of 9.5). Longwing is
		//the one that keeps it, so the stack is a reason to kill her rather than an ambient tax.
		index: "argentFlare", name: "Wing Flare", enemyIndex: "argentFencer", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["charm"],
		effectArray: [
			{ index: "lust", amount: 2 },
			{ index: "applyStatus", status: "weak", stacks: 1 },
		],
	},
	{
		index: "argentSidestep", name: "Appel", enemyIndex: "argentFencer", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "applyStatus", status: "strength", stacks: 1 }],
	},

	//--- Mantlewing, the matron under the wings -----------------------------------------------------
	{
		//The violet cloud behind her in the drawing. It is not aimed at anybody; it is simply where she is.
		index: "mantleDust", name: "Standing Dust", enemyIndex: "mantlewing", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["charm"],
		effectArray: [{ index: "lust", amount: 3 }],
	},
	{
		index: "mantleSweep", name: "Wing Sweep", enemyIndex: "mantlewing", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 14 }],
	},
	{
		//Her wings reach the floor and everything behind her goes under them.
		index: "mantleFold", name: "Under the Mantle", enemyIndex: "mantlewing", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "temporaryHealth", amount: 10 }],
	},
	{
		//Blunts rather than amplifies -- see the note on Wing Flare for why Sensitive lives on one body.
		index: "mantleShade", name: "Long Shade", enemyIndex: "mantlewing", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [
			{ index: "applyStatus", status: "frail", stacks: 1 },
			{ index: "applyStatus", status: "weak", stacks: 1 },
		],
	},

	//--- Longwing, tall and swaying ----------------------------------------------------------------
	{
		//She is drawn mid-sway with no face and a single foot on the ground. Nothing she does is aimed.
		index: "longwingSway", name: "Slow Sway", enemyIndex: "longwing", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["charm"],
		effectArray: [{ index: "lust", amount: 3 }],
	},
	{
		index: "longwingScatter", name: "Wing Scatter", enemyIndex: "longwing", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [
			{ index: "damage", amount: 4 },
			{ index: "applyStatus", status: "sensitive", stacks: 1 },
		],
	},
	{
		index: "longwingStoop", name: "Stoop", enemyIndex: "longwing", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["charm"],
		effectArray: [
			{ index: "damage", amount: 9 },
			{ index: "lust", amount: 3 },
		],
	},
	{
		index: "longwingSettle", name: "Settle", enemyIndex: "longwing", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "temporaryHealth", amount: 8 }],
	},

	//--- Soakcap, who is not getting out ------------------------------------------------------------
	{
		//The bowl she is sitting in goes over the edge. She does not aim that either.
		index: "soakcapSpill", name: "Spill Over", enemyIndex: "soakcap", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["charm"],
		effectArray: [{ index: "lust", amount: 2 }],
	},
	{
		index: "soakcapSplash", name: "Idle Splash", enemyIndex: "soakcap", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		tagArray: ["charm"],
		effectArray: [
			{ index: "damage", amount: 8 },
			{ index: "lust", amount: 3 },
		],
	},
	{
		//The road's engine: she is not fighting, she is topping everybody else up.
		index: "soakcapShare", name: "Room for More", enemyIndex: "soakcap", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "applyStatus", status: "regeneration", stacks: 3 }],
	},
	{
		index: "soakcapSteep", name: "Steeped", enemyIndex: "soakcap", rarity: "enemy", costArray: {},
		targetMode: "allAllies",
		animationArray: [{ animation: "rise" }],
		effectArray: [{ index: "applyStatus", status: "strength", stacks: 1 }],
	},

	//--- The Pale Dray -------------------------------------------------------------------------------
	{
		index: "drayClaw", name: "Forefoot", enemyIndex: "paleDray", rarity: "enemy", costArray: {},
		targetMode: "frontEnemy",
		effectArray: [{ index: "damage", amount: 23 }],
	},
	{
		//THE CHAINS HANG LOOSE. Somebody buckled that harness on and is not in the drawing, and no line
		//of text anywhere says who or why -- the innocent reading is that she likes the straps.
		index: "drayChain", name: "Slack Chain", enemyIndex: "paleDray", rarity: "enemy", costArray: {},
		targetMode: "backEnemy",
		effectArray: [
			{ index: "damage", amount: 16 },
			{ index: "shiftParty", shift: "front" },
		],
	},
	{
		index: "drayGrin", name: "Wide Grin", enemyIndex: "paleDray", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		tagArray: ["charm"],
		effectArray: [
			{ index: "lust", amount: 6 },
			{ index: "applyStatus", status: "sensitive", stacks: 1 },
		],
	},
	{
		//Telegraphed two turns out: the whole body coming forward at once. The Grind test on this fight.
		index: "drayLurch", name: "Full Weight", enemyIndex: "paleDray", rarity: "enemy", costArray: {},
		targetMode: "allEnemies",
		effectArray: [
			{ index: "damage", amount: 13 },
			{ index: "applyStatus", status: "frail", stacks: 1 },
		],
	},
	{
		//She loses the thread. The Act 1 dawdle, on a boss: it gains her nothing she can spend, and a
		//party that has overcommitted gets the turn back.
		index: "drayDoze", name: "Lost the Thread", enemyIndex: "paleDray", rarity: "enemy", costArray: {},
		targetMode: "self",
		animationArray: [{ animation: "rise" }],
		effectArray: [
			{ index: "temporaryHealth", amount: 15 },
			{ index: "message", text: "She forgets what she was doing, and is delighted about it." },
		],
	},
	//<<< LANE E7 | pollenRoad | enemy cards <<<
];

//They live in the one card table, beside the party's: the same kind of card.
for (var enemyCardIndex = 0; enemyCardIndex < honeycomb.enemyCardArray.length; enemyCardIndex++) {
	honeycomb.cardArray.push(honeycomb.enemyCardArray[enemyCardIndex]);
}

//---------------------------------------------------------------------------------------------------
//Who the AI plays for
//---------------------------------------------------------------------------------------------------
//AI-CONTROLLED: everything on the enemy team, and anything on the party's that is not a character the
//player commands -- an enemy summoned to fight for the party. `controller` on an entity ("player" or
//"ai") overrides, for content that wants a character the AI plays on the party's side, or the reverse.
honeycomb.isAiControlled = function (entity) {
	if (entity == null) return false;
	if (entity.controller != null) return entity.controller == "ai";
	return entity.side != "ally" || entity.characterIndex == null;
};

//What a combatant IS, whichever team it stands on: {kind: "character" | "enemy", definition}, or null.
//Stats, art, tags and moves all come from here -- never from the team.
honeycomb.entityDefinition = function (entity) {
	if (entity == null) return null;
	if (entity.enemyIndex != null) {
		var enemy = honeycomb.findDefinition(honeycomb.enemyArray, entity.enemyIndex);
		return enemy == null ? null : { kind: "enemy", definition: enemy };
	}
	if (entity.characterIndex != null) {
		var character = honeycomb.findDefinition(honeycomb.characterArray, entity.characterIndex);
		return character == null ? null : { kind: "character", definition: character };
	}
	return null;
};

honeycomb.entityName = function (entity) {
	var found = honeycomb.entityDefinition(entity);
	return found == null ? "" : found.definition.name;
};

//The key that names a combatant's kind in ledgers -- its enemy or character index.
honeycomb.entityKey = function (entity) {
	if (entity == null) return null;
	return entity.enemyIndex != null ? entity.enemyIndex : entity.characterIndex;
};

//---------------------------------------------------------------------------------------------------
//Move lists
//---------------------------------------------------------------------------------------------------
//The moves an AI combatant chooses between: [{card, weight, maximumInARow, condition}].
//  an enemy     its definition's `moveArray`
//  a character  its own card pool, each card weighted by how many copies it holds
//                (tuning.ai.weightPerCardCopy). Cards with nothing an AI can do with them -- unplayable
//                junk, and cards that act on cards in a hand the AI does not have -- are left out.
honeycomb.aiMoveArray = function (entity) {
	var found = honeycomb.entityDefinition(entity);
	if (found == null) return [];
	if (found.kind == "enemy") return found.definition.moveArray == null ? [] : found.definition.moveArray;

	var entryArray = honeycomb.memberCardEntryArray({
		characterIndex: entity.characterIndex, outfitIndex: entity.outfitIndex, equipmentArray: entity.equipmentArray,
	});
	var result = [];
	for (var entryIndex = 0; entryIndex < entryArray.length; entryIndex++) {
		var card = honeycomb.findDefinition(honeycomb.cardArray, entryArray[entryIndex].cardIndex);
		if (card == null || card.costArray == null) continue;
		if (honeycomb.targetModeKind(card.targetMode) == "card") continue;
		if (honeycomb.cardHasType(card, "curse")) continue;
		result.push({ card: card.index, weight: entryArray[entryIndex].count * honeycomb.tuning.ai.weightPerCardCopy });
	}
	return result;
};

//The strategy an AI combatant picks with: an enemy's `moveStrategy`, else "weighted".
honeycomb.aiStrategyFor = function (entity) {
	var found = honeycomb.entityDefinition(entity);
	var strategyIndex = found != null && found.kind == "enemy" && found.definition.moveStrategy != null
		? found.definition.moveStrategy : "weighted";
	return honeycomb.requireDefinition(honeycomb.moveStrategyArray, strategyIndex, "honeycomb.moveStrategyArray");
};

//---------------------------------------------------------------------------------------------------
//Selection strategies
//---------------------------------------------------------------------------------------------------
//Each returns the move an AI combatant will use this turn. All randomness draws from the combat
//stream, so a whole fight's plans replay identically from the run seed.
honeycomb.moveStrategyArray = [
	{
		index: "weighted",
		//A weighted roll over the move list, honouring per-move conditions and repeat limits.
		select: function (entity, moveArray) {
			var candidateArray = honeycomb.eligibleMoveArray(entity, moveArray);
			if (candidateArray.length === 0) return null;
			return honeycomb.rng.pickWeighted(honeycomb.tuning.rng.streamArray.combat, candidateArray);
		},
	},
	{
		index: "sequence",
		//Walks the move list in order and loops. Makes a boss readable and learnable.
		select: function (entity, moveArray) {
			if (moveArray.length === 0) return null;
			var position = entity.movePosition == null ? 0 : entity.movePosition;
			//A move marked oncePerCombat that has been played is stepped over.
			for (var step = 0; step < moveArray.length; step++) {
				var chosen = moveArray[(position + step) % moveArray.length];
				if (honeycomb.moveSpentThisCombat(entity, chosen)) continue;
				entity.movePosition = position + step + 1;
				return chosen;
			}
			return null;
		},
	},
	{
		index: "threshold",
		//Switches behaviour once wounded. `phaseArray` on the definition names which moves belong to
		//which phase, so a boss can have a genuine second form without new engine code.
		select: function (entity, moveArray) {
			var found = honeycomb.entityDefinition(entity);
			var phaseArray = found == null || found.definition.phaseArray == null ? [] : found.definition.phaseArray;
			//The charging bar and maximumInARow bind here too, so a phase-select strategy must go through
			//eligibleMoveArray like any other rather than picking straight from its phase list.
			var eligibleArray = honeycomb.eligibleMoveArray(entity, moveArray);
			if (eligibleArray.length === 0) return null;
			if (phaseArray.length === 0) return honeycomb.rng.pickWeighted(honeycomb.tuning.rng.streamArray.combat, eligibleArray);
			var fraction = entity.maxHealth <= 0 ? 1 : entity.health / entity.maxHealth;
			var phase = null;
			for (var phaseIndex = 0; phaseIndex < phaseArray.length; phaseIndex++) {
				if (fraction <= phaseArray[phaseIndex].atOrBelow) {
					phase = phaseArray[phaseIndex];
					break;
				}
			}
			if (phase == null) phase = phaseArray[phaseArray.length - 1];

			var candidateArray = [];
			for (var moveIndex = 0; moveIndex < eligibleArray.length; moveIndex++) {
				if (phase.moveArray.indexOf(eligibleArray[moveIndex].card) < 0) continue;
				candidateArray.push(eligibleArray[moveIndex]);
			}
			//A phase whose every move is still charging (her frantic phase is all big moves) falls back to
			//whatever else is legal, rather than standing idle for the turn.
			if (candidateArray.length === 0) candidateArray = eligibleArray;
			return honeycomb.rng.pickWeighted(honeycomb.tuning.rng.streamArray.combat, candidateArray);
		},
	},
];

//Filters a move list down to what a combatant may legally pick right now: conditions satisfied, and not
//exceeding a maximum consecutive use.
//A move with `oncePerCombat: true` is played at most once a fight by each combatant. The record lives on
//the combatant, which exists for one fight only.
honeycomb.moveSpentThisCombat = function (entity, move) {
	return move != null && move.oncePerCombat == true && entity.spentMoveArray != null && entity.spentMoveArray.indexOf(move.card) >= 0;
};

honeycomb.noteMovePlayed = function (entity, cardIndex) {
	var moveArray = honeycomb.aiMoveArray(entity);
	for (var moveIndex = 0; moveIndex < moveArray.length; moveIndex++) {
		if (moveArray[moveIndex].card != cardIndex || moveArray[moveIndex].oncePerCombat != true) continue;
		if (entity.spentMoveArray == null) entity.spentMoveArray = [];
		if (entity.spentMoveArray.indexOf(cardIndex) < 0) entity.spentMoveArray.push(cardIndex);
	}
};

honeycomb.eligibleMoveArray = function (entity, moveArray) {
	var result = [];
	var context = honeycomb.newEffectContext({ source: entity });
	var charge = honeycomb.moveCharge(entity);
	for (var moveIndex = 0; moveIndex < moveArray.length; moveIndex++) {
		var move = moveArray[moveIndex];
		if (move.condition != null && honeycomb.testCondition(move.condition, context) == false) continue;
		//maximumInARow stops a combatant rolling the same devastating move three turns running.
		if (move.maximumInARow != null && entity.lastMoveCardIndex == move.card) {
			if ((entity.sameMoveCount == null ? 0 : entity.sameMoveCount) >= move.maximumInARow) continue;
		}
		//And a big move has to be charged up to. See honeycomb.moveCharge.
		if (move.chargeCost != null && charge < move.chargeCost) continue;
		if (honeycomb.moveSpentThisCombat(entity, move)) continue;
		result.push(move);
	}
	//A RE-ROLLED INTENT AVOIDS THE ONE IT REPLACES, but only while there is something else to pick:
	//a combatant with a single legal move still telegraphs it rather than standing idle.
	var avoid = entity.repickAvoidCard;
	if (avoid != null && result.length > 1) {
		result = result.filter(function (move) { return move.card != avoid; });
	}
	return result;
};

//---------------------------------------------------------------------------------------------------
//The charging bar
//---------------------------------------------------------------------------------------------------
//An AI, especially a boss, needs certain cards to be less likely to be played early and never played
//twice in a row. An invisible charging bar does this: a card names a charge cost, and a combatant can
//only play it once that bar is full enough.
//
//Every AI combatant carries `charge`, which grows by `chargePerTurn` each of their turns and is SPENT
//by a move that names a `chargeCost`. So a move costing 3 cannot appear before the third turn, cannot
//appear twice running without waiting again, and gets rarer the more of them an enemy has -- all from
//one number per move. `maximumInARow` was already there and is what stops a cheap move repeating.
//
//Invisible, as asked: nothing draws the bar. What the player sees is the TELEGRAPH -- a charged move
//wears a rarer frame and stands larger (honeycomb.moveIsRare), so the tell is "something big is
//coming", not a meter to count.
honeycomb.moveCharge = function (entity) {
	return entity == null || entity.charge == null ? 0 : entity.charge;
};

//How much this combatant gains a turn: its own `chargePerTurn`, else tuning's default.
honeycomb.chargePerTurn = function (entity) {
	var found = honeycomb.entityDefinition(entity);
	var declared = found == null || found.definition.chargePerTurn == null ? null : found.definition.chargePerTurn;
	return declared == null ? honeycomb.tuning.ai.chargePerTurn : declared;
};

//Charges a combatant for the turn ahead, capped so a long fight cannot bank an unbounded reserve.
honeycomb.gainMoveCharge = function (entity) {
	if (entity == null) return;
	var ceiling = honeycomb.tuning.ai.chargeMaximum;
	entity.charge = Math.min(ceiling, honeycomb.moveCharge(entity) + honeycomb.chargePerTurn(entity));
};

//Whether a move is one of the big ones: it costs at least tuning's `rareChargeCost`. Read by the card
//frame and by the telegraph's size, so "expensive" and "looks important" cannot drift apart.
honeycomb.moveIsRare = function (entity, cardIndex) {
	var moveArray = honeycomb.aiMoveArray(entity);
	for (var scanIndex = 0; scanIndex < moveArray.length; scanIndex++) {
		if (moveArray[scanIndex].card != cardIndex) continue;
		return moveArray[scanIndex].chargeCost != null &&
			moveArray[scanIndex].chargeCost >= honeycomb.tuning.ai.rareChargeCost;
	}
	return false;
};

//Chooses and records an AI combatant's move for the coming turn. Returns the move's card index.
honeycomb.selectMove = function (entity) {
	if (entity == null) return null;
	var strategy = honeycomb.aiStrategyFor(entity);
	if (strategy == null) return null;

	var moveArray = honeycomb.aiMoveArray(entity);
	var chosen = null;

	//An opening move is taken first, whatever the charging bar says. The Juggernaut always
	//hurls Avalanche on the fight's first turn. `lastMoveCardIndex` is null until a move has actually been
	//played, so this fires for the opening telegraph exactly once -- a reroll before it lands counts as
	//the same opening and is allowed to pick it again.
	var found = honeycomb.entityDefinition(entity);
	var openingIndex = found != null && found.kind == "enemy" ? found.definition.openingMove : null;
	if (openingIndex != null && entity.lastMoveCardIndex == null) {
		for (var openingScan = 0; openingScan < moveArray.length; openingScan++) {
			if (moveArray[openingScan].card != openingIndex) continue;
			chosen = moveArray[openingScan];
			break;
		}
	}
	if (chosen == null) chosen = strategy.select(entity, moveArray);
	if (chosen == null) { entity.intentCardIndex = null; return null; }

	//Consecutive-use tracking, read by eligibleMoveArray next turn.
	entity.sameMoveCount = entity.lastMoveCardIndex == chosen.card ? (entity.sameMoveCount == null ? 0 : entity.sameMoveCount) + 1 : 1;
	entity.lastMoveCardIndex = chosen.card;
	entity.intentCardIndex = chosen.card;
	//A freshly chosen move is not yet played, so its telegraph shows again.
	entity.intentSpent = false;
	//A charged move spends what it cost as it is CHOSEN, not as it lands: the telegraph is the promise,
	//and an enemy killed before it swings has still spent the wind-up.
	if (chosen.chargeCost != null) entity.charge = Math.max(0, honeycomb.moveCharge(entity) - chosen.chargeCost);
	//Telegraphed is SEEN: the move's card is face up on the board from now on, and in this combatant's
	//list of moves from now on too.
	if (honeycomb.discovery != null) honeycomb.discovery.note("intent", honeycomb.discovery.intentKey(honeycomb.entityKey(entity), chosen.card));
	return chosen.card;
};

//A MOVE AS THE CARD ITS USER PLAYS: the card resolved, stamped with who is using it. Built fresh each
//time, never stored, so it can never disagree with what the combatant will do.
//  userSide   the user's team, which the card's targets and printed words are relative to
//  owner      the user, so "the card's owner" is them
//  costArray  {} -- an AI combatant pays nothing, and the card says so
//  partyShift "none" -- a move moves nobody through the order
//  artChain   for a card with no art of its own (every enemy move): the user striking the move's pose
honeycomb.moveCard = function (entity, cardIndex) {
	if (entity == null || cardIndex == null) return null;
	var resolved = honeycomb.resolveCard({ instanceId: null, cardIndex: cardIndex, ownerInstanceId: entity.instanceId, upgradeLevel: 0 });
	if (resolved == null) return null;
	var view = {};
	for (var field in resolved) {
		if (Object.prototype.hasOwnProperty.call(resolved, field)) view[field] = resolved[field];
	}
	view.userSide = honeycomb.intentActingSide(entity);
	//A turned move is printed from the side it now serves: "Deal 7 damage to an enemy".
	view.isTurned = view.userSide != (entity.side == null ? "ally" : entity.side);
	view.ownerInstanceId = entity.instanceId;
	view.costArray = {};
	view.partyShift = "none";
	view.isIntent = true;
	//A CHARGED move wears the rarer vertical frame, derived from its charge cost
	//rather than written on the card, so "expensive" and "looks important" can never drift apart.
	view.isRareMove = honeycomb.moveIsRare(entity, cardIndex);
	if (view.isRareMove == true) view.layout = "vertical";
	if (view.artPath == null && honeycomb.art != null) {
		var presentation = honeycomb.art.cardPresentation(view);
		view.artChain = honeycomb.art.spriteChain({
			side: entity.side, enemyIndex: entity.enemyIndex, characterIndex: entity.characterIndex,
			outfitIndex: entity.outfitIndex, health: 1, maxHealth: 1, statusArray: [],
		}, presentation == null ? "basic" : presentation.pose, { state: null });
	}
	return view;
};

//The team a combatant's move is taken for (Cassadora's Turncoat): its own, unless it holds a status
//that says `turnsIntent`, in which case the other one. Every target the move names is relative to this.
//A combatant with nobody left on its side has no one to turn on, so it acts as it always would --
//attacking itself instead would be better than skipping its turn.
honeycomb.intentActingSide = function (entity) {
	var ownSide = entity == null || entity.side == null ? "ally" : entity.side;
	if (entity == null || entity.statusArray == null) return ownSide;
	var combat = honeycomb.state == null || honeycomb.state.run == null ? null : honeycomb.state.run.combat;
	if (honeycomb.withoutEntity(honeycomb.livingEntityArray(ownSide, combat), entity).length === 0) return ownSide;
	for (var scanIndex = 0; scanIndex < entity.statusArray.length; scanIndex++) {
		var status = honeycomb.findDefinition(honeycomb.statusArray, entity.statusArray[scanIndex].index);
		if (status != null && status.turnsIntent == true) return honeycomb.opposingSide(ownSide);
	}
	return ownSide;
};

//Changing what a combatant will do (Cassadora). `cardIndex` is the new move, or null to have it pick
//again from its own list. Logged as a fresh intent, so the battle log and the closing repaint both show the
//new telegraph, and heard by the world as `onIntentChanged` (`source` is whoever changed it).
honeycomb.changeIntent = function (entity, cardIndex, context) {
	if (entity == null || entity.downed == true || honeycomb.isAiControlled(entity) == false) return false;
	var before = entity.intentCardIndex;
	if (cardIndex == null) {
		//A re-roll must actually change the plan when it can: mark the move being replaced so
		//the pick avoids it, unless it is the only legal move (see honeycomb.eligibleMoveArray).
		entity.repickAvoidCard = before;
		honeycomb.selectMove(entity);
		delete entity.repickAvoidCard;
	} else {
		entity.intentCardIndex = cardIndex;
	}
	//A changed intent is a fresh telegraph, so it shows again.
	entity.intentSpent = false;
	honeycomb.logEvent(context, { type: "intent", targetId: entity.instanceId, card: entity.intentCardIndex, changedFrom: before });
	if (context != null && context.combat != null) {
		honeycomb.fireRunHooks("onIntentChanged", { entity: entity, before: before, after: entity.intentCardIndex,
			source: context.source == null ? null : context.source, context: context });
	}
	return true;
};

//An enemy's move in the party's hand (Cassadora): a temporary copy of `cardIndex`, owned by `owner`,
//used for the owner's team, exhausting when played and wearing `enemyIndex`'s figure as its art. The
//Pilfer card and the Sleight Purse relic both hand one over. Returns the instance, or null.
//REPERTOIRE: what a stolen move does once it is in the party's hands is a question about the
//holder, answered by the statuses they wear. A holder of `repertoire` keeps their stolen moves
//(`stolenCardsExhaust: false`) and the copy is written into the run deck (`stolenCardsPersist: true`).
//Everything else exhausts it, exactly as before.
honeycomb.stolenCardSettings = function (owner) {
	var settings = { exhausts: true, persist: false, toDiscard: false };
	//The thief's LOADOUT answers too (Grifter keeps what she steals; Hedge Witch sends it to the discard).
	if (owner != null && owner.characterIndex != null) {
		if (honeycomb.memberLoadoutFlag(owner, "stolenCardsKept") == true) { settings.exhausts = false; settings.persist = true; }
		if (honeycomb.memberLoadoutFlag(owner, "stolenCardsToDiscard") == true) settings.toDiscard = true;
	}
	if (owner == null || owner.statusArray == null) return settings;
	for (var statusIndex = 0; statusIndex < owner.statusArray.length; statusIndex++) {
		var held = honeycomb.findDefinition(honeycomb.statusArray, owner.statusArray[statusIndex].index);
		if (held == null) continue;
		if (held.stolenCardsExhaust != null) settings.exhausts = held.stolenCardsExhaust;
		if (held.stolenCardsPersist != null) settings.persist = held.stolenCardsPersist;
	}
	return settings;
};

//`options` may redirect where the move lands and what it costs (Cassadora's Turnabout puts it in the
//discard at 2; Magic Trick adds it at 1):
//  pile        "hand" (default), "discardPile" or "drawPile"
//  costArray   a per-copy cost override, e.g. {energy: 2}
honeycomb.giveStolenCard = function (cardIndex, owner, enemyIndex, context, options) {
	var settings = options == null ? {} : options;
	var pile = settings.pile == null ? "hand" : settings.pile;
	if (pile == "hand" && honeycomb.stolenCardSettings(owner).toDiscard == true) pile = "discardPile";
	var instance = honeycomb.addCardToPile(cardIndex, pile, context);
	if (instance == null) return null;
	instance.ownerInstanceId = owner == null ? null : owner.instanceId;
	instance.userSide = owner == null || owner.side == null ? "ally" : owner.side;
	var heldSettings = honeycomb.stolenCardSettings(owner);
	instance.exhausts = heldSettings.exhausts;
	//A keeper writes the move into the run deck outright, so it is still there when the fight ends.
	if (heldSettings.persist == true && owner != null && honeycomb.state != null && honeycomb.state.run != null) {
		honeycomb.addCardToRunDeck(cardIndex, owner.instanceId);
	}
	if (settings.costArray != null) instance.costOverrideArray = settings.costArray;
	instance.artEnemyIndex = enemyIndex == null ? null : enemyIndex;
	return instance;
};

//The move an AI combatant has telegraphed, as its card, or null.
honeycomb.telegraphedCard = function (entity) {
	return entity == null ? null : honeycomb.moveCard(entity, entity.intentCardIndex);
};

//Every move a combatant may make, as card indices in list order. The enemy's move list screen reads it.
honeycomb.moveIndexArray = function (entity) {
	var moveArray = honeycomb.aiMoveArray(entity);
	var result = [];
	for (var scanIndex = 0; scanIndex < moveArray.length; scanIndex++) result.push(moveArray[scanIndex].card);
	return result;
};

//---------------------------------------------------------------------------------------------------
//Aiming
//---------------------------------------------------------------------------------------------------
//Where an AI combatant aims a card that needs a PICKED target, by who the card lands on relative to it.
//A table, so a sharper rule ("finish off the weakest") is an entry rather than a rewrite.
honeycomb.aiTargetRuleArray = [
	{
		//The front of the other team: where most attacks land, which is what makes party order a choice.
		index: "opponent",
		pick: function (candidateArray) { return candidateArray.length === 0 ? null : candidateArray[0]; },
	},
	{
		//The most hurt of its own team, by share of health left.
		index: "teammate",
		pick: function (candidateArray) {
			var best = null;
			for (var scanIndex = 0; scanIndex < candidateArray.length; scanIndex++) {
				var candidate = candidateArray[scanIndex];
				var fraction = candidate.maxHealth <= 0 ? 1 : candidate.health / candidate.maxHealth;
				if (best == null || fraction < best.fraction) best = { entity: candidate, fraction: fraction };
			}
			return best == null ? null : best.entity;
		},
	},
];

//`actingSide` is the team the move is taken for, when that is not the combatant's own (a Turncoat).
honeycomb.aiPickTarget = function (entity, card, combat, actingSide) {
	var relation = honeycomb.targetModeRelation(card == null ? null : card.targetMode);
	if (relation == "self") return entity;
	var rule = honeycomb.findDefinition(honeycomb.aiTargetRuleArray, relation == "both" ? "opponent" : relation);
	if (rule == null) return null;
	var candidateArray = honeycomb.livingEntityArray(honeycomb.sideForRelation(relation == "both" ? "opponent" : relation,
		actingSide == null ? entity.side : actingSide), combat);
	//A taunter on the other team draws the pick. See honeycomb.tauntFilteredArray.
	if (relation != "teammate") candidateArray = honeycomb.tauntFilteredArray(candidateArray);
	//A turned move never picks its own user. See honeycomb.relatedLivingArray.
	if (actingSide != null) candidateArray = honeycomb.withoutEntity(candidateArray, entity);
	return rule.pick(honeycomb.aiOrderedCandidateArray(candidateArray));
};

//Enemies avoid targeting broken characters where possible. A reordering, not a filter:
//broken candidates go to the back of the list, so every rule above picks somebody else while anybody
//else is standing, and an enemy whose only targets are broken still swings. A party that could park a
//broken member in front as a permanent shield would be exploiting the mercy.
//
//The order among the un-broken is UNTOUCHED -- this is a stable partition, not a sort -- because the
//"opponent" rule means "the front" and shuffling it would quietly break party order as a mechanic.
honeycomb.aiOrderedCandidateArray = function (candidateArray) {
	if (honeycomb.tuning.ai.brokenTargetPenalty <= 0) return candidateArray;
	var standing = [];
	var brokenArray = [];
	for (var scanIndex = 0; scanIndex < candidateArray.length; scanIndex++) {
		if (candidateArray[scanIndex].broken == true) brokenArray.push(candidateArray[scanIndex]);
		else standing.push(candidateArray[scanIndex]);
	}
	return standing.concat(brokenArray);
};

//The number shown on an attacking telegraph, after the user's own buffs. Computed from the card's
//actual damage effects rather than a stored figure, so a telegraph is always the truth.
honeycomb.moveDisplayAmount = function (entity, card, combat) {
	if (card == null || card.effectArray == null) return null;
	var context = honeycomb.newEffectContext({ source: entity, combat: combat });
	var total = 0;
	var found = false;
	var hitCount = 0;

	for (var entryIndex = 0; entryIndex < card.effectArray.length; entryIndex++) {
		var entry = card.effectArray[entryIndex];
		//A repeat wrapping damage is the multi-hit case; report per-hit damage and the hit count.
		if (entry.index == "repeat" && entry.effectArray != null) {
			var inner = honeycomb.moveDisplayAmount(entity, { effectArray: entry.effectArray }, combat);
			if (inner == null) continue;
			found = true;
			total = inner.amount;
			hitCount = honeycomb.resolveValue(entry.times, context);
			continue;
		}
		if (entry.index != "damage" && entry.index != "damageIgnoringTemporary") continue;
		found = true;
		hitCount += 1;
		var raw = honeycomb.resolveValue(entry.amount, context);
		total = Math.floor(honeycomb.applyStatusHooks("modifyDamageDealt", raw,
			{ entity: entity, target: null, context: context, entry: entry }));
	}

	if (found == false) return null;
	return { amount: Math.max(honeycomb.tuning.combat.damageMinimum, total), hits: hitCount };
};

//---------------------------------------------------------------------------------------------------
//Enemies
//---------------------------------------------------------------------------------------------------
//Fields:
//  index, name
//  role                         the template it is written to (tuning.balance.enemyRoleArray): minion,
//                               striker, soldier, tank, support, caster, elite, boss. See
//                               rework/enemies/ENEMIES-01.md §2 and !designDocs/honeycomb/tools/enemy-template.js
//  artFolder, artVariant       optional; both default to the index / "default".
//                              Art resolves at enemies/<artFolder>/<artVariant>/ -- see honeycomb-art.js
//  artCharacter                optional: a CHARACTER index. The enemy is drawn from that character's default
//                              outfit folder instead (Anastasia's gauntlet self), so her art exists once
//  artPoseArray, artTierArray, artPortrait
//                              optional, for a boss or special case with MORE art than an ordinary enemy.
//                              An ordinary enemy has `1-combat` and `1-offense` and writes none of these;
//                              only what is declared here is ever asked for (honeycomb.art.enemyArtSet)
//  artOwed                     true while it stands on another enemy's drawing (artFolder) until its own
//                              is drawn. ENEMIES-01 §5 holds the sidecar tags for the art pipeline
//  baseHealth, healthVariance   actual health rolls within +/- variance, from the encounter stream
//  startingStatusArray          [{status, stacks}]: passives it carries from the moment it appears (its
//                               identity, when that identity is a rule rather than a move)
//  moveStrategy                 which selection strategy to use (honeycomb.moveStrategyArray)
//  moveArray                    [{card, weight, maximumInARow, condition, chargeCost}] -- the move list.
//                               `card` names an entry of the card table; see honeycomb.enemyCardArray above
//  phaseArray                   only for the "threshold" strategy: [{atOrBelow, moveArray: [card]}]
//  isBoss                       drives presentation and reward tables
//  goldReward                   {minimum, maximum}
//  presentation                 optional {scale, offsetXPercent, offsetYPercent}: how the enemy stands on
//                               the battlefield. An encounter's placementArray overrides it per slot.
//How the bestiary is ordered. The enemy table's own order is authoring order, which opens on twelve
//chess golems -- this is what a compendium or bestiary screen reads instead.
//
//The roles in tuning.balance.enemyRoleArray are already written weakest to strongest and end with elite
//then boss, so their order IS the difficulty order and this reads it rather than repeating it. Within a
//role, health breaks the tie, then the name. Anastasia's golems go last of all: they are summons from a
//character who is not on the roster yet, not part of the run's bestiary.
honeycomb.enemyDifficultyRank = function (enemy) {
	var roleArray = honeycomb.tuning.balance.enemyRoleArray;
	if (enemy == null || enemy.role == null) return roleArray.length;
	for (var rankIndex = 0; rankIndex < roleArray.length; rankIndex++) {
		if (roleArray[rankIndex].index == enemy.role) return rankIndex;
	}
	return roleArray.length;
};

honeycomb.compareEnemiesForReading = function (left, right) {
	var leftGolem = honeycomb.definitionHasTag(left, "golem") ? 1 : 0;
	var rightGolem = honeycomb.definitionHasTag(right, "golem") ? 1 : 0;
	if (leftGolem !== rightGolem) return leftGolem - rightGolem;
	var role = honeycomb.enemyDifficultyRank(left) - honeycomb.enemyDifficultyRank(right);
	if (role !== 0) return role;
	var health = (left.baseHealth || 0) - (right.baseHealth || 0);
	if (health !== 0) return health;
	var leftName = String(left.name == null ? left.index : left.name);
	var rightName = String(right.name == null ? right.index : right.name);
	return leftName < rightName ? -1 : (leftName > rightName ? 1 : 0);
};


honeycomb.enemyArray = [

	//---------------------------------------------------------------------------------------------------
	//The Infernal pieces
	//---------------------------------------------------------------------------------------------------
	//Same silhouettes, opposite temper: a Celestial piece opens on its guard, an Infernal one on its blow.
	//The chain they once fed is cut; each stands on its own two-move list, which is also what lets the six
	//be fought as the gauntlet's enemies. Their art is the Celestial set run through a recipe
	//(ENEMY_SOURCES in generate-placeholder-art.py) until the drawings arrive -- the tinted-placeholder
	//path the project uses for a piece awaiting its own art.

	{
		//Gnash, then Brace. The cheapest body on the board, and the one a sacrifice card spends.
		index: "infernalPawn",
		name: "Infernal Pawn",
		//The same shape in the other alignment (the `invert` verb, Anastasia's Transposition).
		alignmentTwin: "celestialPawn",
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
		role: "minion",
		tagArray: ["golem", "pawn", "infernal", "construct"],
		//Drawn for her side: the set faces right, into the fight from the party line, so it is mirrored
		//when fought on the enemy line.
		drawnForSide: "ally",
		//How tall this piece stands. Every piece is drawn on the same 889x1300 canvas and fills it,
		//so without this they all render at one height. Smallest: at four party members, an unscaled pawn
		//would cover their health bars. A third off, since it is the body the board fills up with.
		presentation: { scale: 0.68 },
		baseHealth: 10,
		healthVariance: 0,
		//Two moves, walked in order (BUILD-ANASTASIA s3/s4): a switched intent trades the next two turns.
		moveStrategy: "sequence",
		moveArray: [{ card: "infernalPawnGnash" }, { card: "infernalPawnBrace" }],
		allyActivation: { shift: "forward", text: "Steps forward one place." },
		goldReward: { minimum: 0, maximum: 0 },
	},
	{
		//Sortie, then Harry. Vanguard makes it hit harder from the front, which is what its free leap is for.
		index: "infernalKnight",
		name: "Infernal Knight",
		//The same shape in the other alignment (the `invert` verb, Anastasia's Transposition).
		alignmentTwin: "celestialKnight",
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
		role: "minion",
		tagArray: ["golem", "knight", "infernal", "construct"],
		//Drawn for her side: the set faces right, into the fight from the party line, so it is mirrored
		//when fought on the enemy line.
		drawnForSide: "ally",
		//HOW TALL THIS PIECE STANDS. Every piece is drawn on the same 889x1300 canvas and fills it,
		//so without this they all render at one height. Tallest of the pieces. Tall but THIN, which one
		//uniform scale cannot say -- the drawing would have to be narrower in its own canvas.
		presentation: { scale: 0.95 },
		baseHealth: 16,
		healthVariance: 0,
		startingStatusArray: [{ status: "vanguard", stacks: 1 }],
		//Two moves, walked in order (BUILD-ANASTASIA s3/s4): a switched intent trades the next two turns.
		moveStrategy: "sequence",
		moveArray: [{ card: "infernalKnightSortie" }, { card: "infernalKnightScout" }],
		//A button that AIMS. `targetMode` is what decides who it may land on -- `allyOther` keeps it
		//from picking its own place, which the old numbered list hand-handled with "It is already here."
		allyActivation: { pick: "rank", targetMode: "allyOther", text: "Leap to an ally's place." },
		goldReward: { minimum: 0, maximum: 0 },
	},
	{
		//Hex first, and from the BACK of the party it Sunders every enemy at once; then Tithe reaches the
		//enemy back line. The piece a party wants dead first, and the one worth walking backwards.
		index: "infernalBishop",
		name: "Infernal Bishop",
		//The same shape in the other alignment (the `invert` verb, Anastasia's Transposition).
		alignmentTwin: "celestialBishop",
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
		role: "minion",
		tagArray: ["golem", "bishop", "infernal", "construct"],
		//Drawn for her side: the set faces right, into the fight from the party line, so it is mirrored
		//when fought on the enemy line.
		drawnForSide: "ally",
		//HOW TALL THIS PIECE STANDS. Every piece is drawn on the same 889x1300 canvas and fills it,
		//so without this they all render at one height. Third. Reads tall because it floats, so it needs
		//less scale than the Rook to stand as high.
		presentation: { scale: 0.82 },
		baseHealth: 14,
		healthVariance: 0,
		//Two moves, walked in order (BUILD-ANASTASIA s3/s4): a switched intent trades the next two turns.
		moveStrategy: "sequence",
		moveArray: [{ card: "infernalBishopBlight" }, { card: "infernalBishopHex" }],
		allyActivation: { swap: "ahead", text: "Drags the ally ahead behind it." },
		goldReward: { minimum: 0, maximum: 0 },
	},
	{
		//The anvil. Grudge, then a taunting wall; Thorns bill whatever answers the taunt.
		index: "infernalRook",
		name: "Infernal Rook",
		//The same shape in the other alignment (the `invert` verb, Anastasia's Transposition).
		alignmentTwin: "celestialRook",
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
		role: "minion",
		tagArray: ["golem", "rook", "infernal", "construct"],
		//Drawn for her side: the set faces right, into the fight from the party line, so it is mirrored
		//when fought on the enemy line.
		drawnForSide: "ally",
		//HOW TALL THIS PIECE STANDS. Every piece is drawn on the same 889x1300 canvas and fills it,
		//so without this they all render at one height. Second: a broad tower, so it keeps most of its
		//height.
		presentation: { scale: 0.88 },
		baseHealth: 30,
		healthVariance: 0,
		//Thorns is gone, Revenge is the identity: a more masochistic feeling for the Rook. Thorns was the
		//old approximation of the same idea -- answer the attacker -- and Revenge is the real one: it bills
		//the whole room, it STACKS,
		//and the Rook's own first move is how it stacks. Carrying both would have been two answers to one
		//hit, and the falsification in block [120] could not have told them apart.
		//Two moves, walked in order (BUILD-ANASTASIA s3/s4): a switched intent trades the next two turns.
		moveStrategy: "sequence",
		moveArray: [{ card: "infernalRookGrudge" }, { card: "infernalRookLashOut" }],
		allyActivation: { shift: "front", text: "Marches to the front." },
		goldReward: { minimum: 0, maximum: 0 },
	},
	{
		//The evil corrupting familiar. She strikes nobody: Corrupt opens the front
		//enemy up and works on their head, then Dominion pays the whole side in Strength out of its own
		//blood. The only piece whose upside is entirely other people's.
		index: "infernalQueen",
		name: "Infernal Queen",
		//The same shape in the other alignment (the `invert` verb, Anastasia's Transposition).
		alignmentTwin: "celestialQueen",
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
		role: "minion",
		tagArray: ["golem", "queen", "infernal", "construct"],
		//Drawn for her side: the set faces right, into the fight from the party line, so it is mirrored
		//when fought on the enemy line.
		drawnForSide: "ally",
		//HOW TALL THIS PIECE STANDS. Every piece is drawn on the same 889x1300 canvas and fills it,
		//so without this they all render at one height. Fourth. Her BODY is pawn-sized; she ranks above a
		//Pawn because she floats and her ribbons spread. The ribbons are inside this scale, so her body
		//lands close to a Pawn's.
		presentation: { scale: 0.75 },
		baseHealth: 20,
		healthVariance: 0,
		//Two moves, walked in order (BUILD-ANASTASIA s3/s4): a switched intent trades the next two turns.
		moveStrategy: "sequence",
		//Five moves, not two. She is the one piece the two-move rule does not bind: the only piece with
		//more than 2 moves, a secondary enabler beyond a2 that gives a long-term game plan. Walked in
		//order, so the King at the end of the list is five turns of keeping her alive.
		moveArray: [{ card: "infernalQueenDominion" }, { card: "infernalQueenScheme" },
			{ card: "infernalQueenCorrupt" }, { card: "infernalQueenDefection" }, { card: "infernalQueenPetition", oncePerCombat: true }],
		allyActivation: { shift: "back", text: "Withdraws to the back." },
		goldReward: { minimum: 0, maximum: 0 },
	},
	{
		//Ruin, then Tyranny. The payoff piece: a big blow, then a big buff.
		index: "infernalKing",
		name: "Infernal King",
		//The same shape in the other alignment (the `invert` verb, Anastasia's Transposition).
		alignmentTwin: "celestialKing",
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
		role: "minion",
		tagArray: ["golem", "king", "infernal", "construct", "large"],
		//Set dressing, not a unit. Nothing summons a King any more -- the Invocation
		//cards draw him behind her line with `showBackdropProp` -- so this entry exists ONLY to carry the
		//drawing and the name. `setDressing` keeps it off the bestiary wall and out of every count that
		//asks how many enemies the game has.
		setDressing: true,
		baseHealth: 60,
		healthVariance: 0,
		//Two moves, walked in order (BUILD-ANASTASIA s3/s4): a switched intent trades the next two turns.
		moveStrategy: "sequence",
		moveArray: [{ card: "infernalKingRuin" }, { card: "infernalKingTyranny" }],
		allyActivation: { shift: "none", text: "Does not move." },
		goldReward: { minimum: 0, maximum: 0 },
		isBoss: true,
		presentation: { scale: 1, anchor: "back" },
	},
	//---------------------------------------------------------------------------------------------------
	//The gauntlet's own queens: a fake copy that never appears in the compendium, with the real one's
	//"add the king to your deck" move replaced by one that just casts the king.
	//
	//Each is her twin in every respect but the fifth move: the real one shuffles an Invocation into the
	//RUN DECK, which belongs to the party and which an enemy may not write to. Hers CASTS the King
	//outright instead. `unlisted` keeps both off the bestiary and out of every total -- they are the same
	//creature the player already has a page for, wearing one different card.
	{
		index: "gauntletCelestialQueen",
		name: "Celestial Queen",
		//WHOSE MOVES SHE WEARS. Four of her five cards are the real Queen's, and a move card names its
		//owner (`enemyIndex`) because its art and its wording are read off that enemy. A copy declares
		//the original here instead of duplicating four cards that would then have to be kept in step.
		movesFrom: "celestialQueen",
		alignmentTwin: "gauntletInfernalQueen",
		sealedBy: "anastasia",
		unlisted: true,
		role: "minion",
		tagArray: ["golem", "queen", "celestial", "construct"],
		//Drawn for her side: the set faces right, into the fight from the party line, so it is mirrored
		//when fought on the enemy line.
		drawnForSide: "ally",
		artFolder: "celestialQueen",
		presentation: { scale: 0.75 },
		baseHealth: 20,
		healthVariance: 0,
		moveStrategy: "sequence",
		moveArray: [{ card: "celestialQueenBenediction" }, { card: "gauntletCelestialQueenHerald" },
			{ card: "celestialQueenExalt" }, { card: "celestialQueenConversion" },
			{ card: "gauntletCelestialQueenCoronation" }],
		allyActivation: { shift: "back", text: "Withdraws to the back." },
		goldReward: { minimum: 0, maximum: 0 },
	},
	{
		index: "gauntletInfernalQueen",
		name: "Infernal Queen",
		//See the Celestial copy above.
		movesFrom: "infernalQueen",
		alignmentTwin: "gauntletCelestialQueen",
		sealedBy: "anastasia",
		unlisted: true,
		role: "minion",
		tagArray: ["golem", "queen", "infernal", "construct"],
		//Drawn for her side: the set faces right, into the fight from the party line, so it is mirrored
		//when fought on the enemy line.
		drawnForSide: "ally",
		artFolder: "infernalQueen",
		presentation: { scale: 0.75 },
		baseHealth: 20,
		healthVariance: 0,
		moveStrategy: "sequence",
		moveArray: [{ card: "infernalQueenDominion" }, { card: "gauntletInfernalQueenHerald" },
			{ card: "infernalQueenCorrupt" }, { card: "infernalQueenDefection" },
			{ card: "gauntletInfernalQueenCoronation" }],
		allyActivation: { shift: "back", text: "Withdraws to the back." },
		goldReward: { minimum: 0, maximum: 0 },
	},
	//---------------------------------------------------------------------------------------------------
	//The Chessmaster's golems
	//---------------------------------------------------------------------------------------------------
	//These are enemy-table entries that usually stand with the PARTY. An enemy-table entity on the ally
	//side is AI-controlled by default (honeycomb.isAiControlled), plays its moveArray as the party's turn
	//closes (honeycomb.combat.playAiMoves), and takes a rank like anyone else -- so a golem needs no new
	//entity kind. They are also fought as enemies in Anastasia's unlock gauntlet, which is why sprite
	//facing is a transform rather than a second drawing (honeycomb.art.spriteTransform).
	//
	//Each piece walks a two-move list in order. Its telegraph is therefore a promise the player
	//can read two turns deep, and Anastasia's `setIntent` cards trade those two turns' places. Never
	//`weighted` for a piece: a golem whose intent is a dice roll is a unit its owner does not control.
	//
	//LIMIT ON MOVES: honeycomb.partyShiftArray offers five directions, so the Knight's "leap to any
	//slot" and the Bishop's swap are approximated by the nearest one. A free-pick Move needs a target
	//picker; until there is one, each button says what it actually does rather than what the design
	//eventually wants (see chessmaster/PIECES.md).

	{
		//Bulwark, then Jab: the teaching case for the resequence, basically like making shields.
		index: "celestialPawn",
		name: "Celestial Pawn",
		//The same shape in the other alignment (the `invert` verb, Anastasia's Transposition).
		alignmentTwin: "infernalPawn",
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
		role: "minion",
		tagArray: ["golem", "pawn", "celestial", "construct"],
		//Drawn for her side: the set faces right, into the fight from the party line, so it is mirrored
		//when fought on the enemy line.
		drawnForSide: "ally",
		//How tall this piece stands. Every piece is drawn on the same 889x1300 canvas and fills it,
		//so without this they all render at one height. Smallest: at four party members, an unscaled pawn
		//would cover their health bars. A third off, since it is the body the board fills up with.
		presentation: { scale: 0.68 },
		baseHealth: 10,
		//A summon the player paid for is not a dice roll.
		healthVariance: 0,
		//Two moves, walked in order (BUILD-ANASTASIA s3/s4): a switched intent trades the next two turns.
		moveStrategy: "sequence",
		moveArray: [{ card: "celestialPawnBulwark" }, { card: "celestialPawnJab" }],
		//ITS MOVE: a 0-cost reposition the player triggers, once per piece per turn. This is what
		//"zero deck-clog positioning" means -- the kit needs no movement cards because every piece
		//carries its own.
		allyActivation: { shift: "forward", text: "Steps forward one place." },
		goldReward: { minimum: 0, maximum: 0 },
	},
	{
		//The only unrestricted reposition in the kit. Parry, then Caracole; Vanguard pays it for leaping to the front.
		index: "celestialKnight",
		name: "Celestial Knight",
		//The same shape in the other alignment (the `invert` verb, Anastasia's Transposition).
		alignmentTwin: "infernalKnight",
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
		role: "minion",
		tagArray: ["golem", "knight", "celestial", "construct"],
		//Drawn for her side: the set faces right, into the fight from the party line, so it is mirrored
		//when fought on the enemy line.
		drawnForSide: "ally",
		//HOW TALL THIS PIECE STANDS. Every piece is drawn on the same 889x1300 canvas and fills it,
		//so without this they all render at one height. Tallest of the pieces. Tall but THIN, which one
		//uniform scale cannot say -- the drawing would have to be narrower in its own canvas.
		presentation: { scale: 0.95 },
		baseHealth: 16,
		//A summon the player paid for is not a dice roll.
		healthVariance: 0,
		startingStatusArray: [{ status: "vanguard", stacks: 1 }],
		//Two moves, walked in order (BUILD-ANASTASIA s3/s4): a switched intent trades the next two turns.
		moveStrategy: "sequence",
		moveArray: [{ card: "celestialKnightRelay" }, { card: "celestialKnightSupport" }],
		//ITS MOVE: a 0-cost reposition the player triggers, once per piece per turn. This is what
		//"zero deck-clog positioning" means -- the kit needs no movement cards because every piece
		//carries its own.
		//A button that AIMS. `targetMode` is what decides who it may land on -- `allyOther` keeps it
		//from picking its own place, which the old numbered list hand-handled with "It is already here."
		allyActivation: { pick: "rank", targetMode: "allyOther", text: "Leap to an ally's place." },
		goldReward: { minimum: 0, maximum: 0 },
	},
	{
		//Litany shields whoever is most hurt; Smite reaches the back line. Restoration, as the identity asks.
		index: "celestialBishop",
		name: "Celestial Bishop",
		//The same shape in the other alignment (the `invert` verb, Anastasia's Transposition).
		alignmentTwin: "infernalBishop",
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
		role: "minion",
		tagArray: ["golem", "bishop", "celestial", "construct"],
		//Drawn for her side: the set faces right, into the fight from the party line, so it is mirrored
		//when fought on the enemy line.
		drawnForSide: "ally",
		//HOW TALL THIS PIECE STANDS. Every piece is drawn on the same 889x1300 canvas and fills it,
		//so without this they all render at one height. Third. Reads tall because it floats, so it needs
		//less scale than the Rook to stand as high.
		presentation: { scale: 0.82 },
		baseHealth: 14,
		//A summon the player paid for is not a dice roll.
		healthVariance: 0,
		//Two moves, walked in order (BUILD-ANASTASIA s3/s4): a switched intent trades the next two turns.
		moveStrategy: "sequence",
		moveArray: [{ card: "celestialBishopLitany" }, { card: "celestialBishopBlessing" }],
		//ITS MOVE: a 0-cost reposition the player triggers, once per piece per turn. This is what
		//"zero deck-clog positioning" means -- the kit needs no movement cards because every piece
		//carries its own.
		allyActivation: { swap: "behind", text: "Swaps with the ally behind it." },
		goldReward: { minimum: 0, maximum: 0 },
	},
	{
		//The wall. Immure taunts behind Temporary HP, Batter answers; Plated shaves every hit it draws.
		index: "celestialRook",
		name: "Celestial Rook",
		//The same shape in the other alignment (the `invert` verb, Anastasia's Transposition).
		alignmentTwin: "infernalRook",
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
		role: "minion",
		tagArray: ["golem", "rook", "celestial", "construct"],
		//Drawn for her side: the set faces right, into the fight from the party line, so it is mirrored
		//when fought on the enemy line.
		drawnForSide: "ally",
		//HOW TALL THIS PIECE STANDS. Every piece is drawn on the same 889x1300 canvas and fills it,
		//so without this they all render at one height. Second: a broad tower, so it keeps most of its
		//height.
		presentation: { scale: 0.88 },
		baseHealth: 30,
		//A summon the player paid for is not a dice roll.
		healthVariance: 0,
		startingStatusArray: [{ status: "plated", stacks: 1 }],
		//Two moves, walked in order (BUILD-ANASTASIA s3/s4): a switched intent trades the next two turns.
		moveStrategy: "sequence",
		moveArray: [{ card: "celestialRookImmure" }, { card: "celestialRookBombard" }],
		//ITS MOVE: a 0-cost reposition the player triggers, once per piece per turn. This is what
		//"zero deck-clog positioning" means -- the kit needs no movement cards because every piece
		//carries its own.
		allyActivation: { shift: "front", text: "Marches to the front." },
		goldReward: { minimum: 0, maximum: 0 },
	},
	{
		//Friendly helper supports mostly: Benediction, then Exalt. The reason she is a rare promotion.
		index: "celestialQueen",
		name: "Celestial Queen",
		//The same shape in the other alignment (the `invert` verb, Anastasia's Transposition).
		alignmentTwin: "infernalQueen",
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
		role: "minion",
		tagArray: ["golem", "queen", "celestial", "construct"],
		//Drawn for her side: the set faces right, into the fight from the party line, so it is mirrored
		//when fought on the enemy line.
		drawnForSide: "ally",
		//HOW TALL THIS PIECE STANDS. Every piece is drawn on the same 889x1300 canvas and fills it,
		//so without this they all render at one height. Fourth. Her BODY is pawn-sized; she ranks above a
		//Pawn because she floats and her ribbons spread. The ribbons are inside this scale, so her body
		//lands close to a Pawn's.
		presentation: { scale: 0.75 },
		baseHealth: 20,
		//A summon the player paid for is not a dice roll.
		healthVariance: 0,
		//Two moves, walked in order (BUILD-ANASTASIA s3/s4): a switched intent trades the next two turns.
		moveStrategy: "sequence",
		//FIVE MOVES, NOT TWO -- see the Infernal Queen above.
		moveArray: [{ card: "celestialQueenBenediction" }, { card: "celestialQueenRespite" },
			{ card: "celestialQueenExalt" }, { card: "celestialQueenConversion" }, { card: "celestialQueenPetition", oncePerCombat: true }],
		//ITS MOVE: a 0-cost reposition the player triggers, once per piece per turn. This is what
		//"zero deck-clog positioning" means -- the kit needs no movement cards because every piece
		//carries its own.
		allyActivation: { shift: "back", text: "Withdraws to the back." },
		goldReward: { minimum: 0, maximum: 0 },
	},
	{
		//The payoff: Castle Doctrine, then Coronation -- a big buff in exchange for jumping through the
		//hoops. `large` bypasses the golem cap.
		index: "celestialKing",
		name: "Celestial King",
		//The same shape in the other alignment (the `invert` verb, Anastasia's Transposition).
		alignmentTwin: "infernalKing",
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
		role: "minion",
		tagArray: ["golem", "king", "celestial", "construct", "large"],
		//SET DRESSING, NOT A UNIT -- see the Infernal King above for the whole of it.
		setDressing: true,
		baseHealth: 60,
		//A summon the player paid for is not a dice roll.
		healthVariance: 0,
		//Two moves, walked in order (BUILD-ANASTASIA s3/s4): a switched intent trades the next two turns.
		moveStrategy: "sequence",
		moveArray: [{ card: "celestialKingCastleDoctrine" }, { card: "celestialKingCoronation" }],
		//ITS MOVE: a 0-cost reposition the player triggers, once per piece per turn. This is what
		//"zero deck-clog positioning" means -- the kit needs no movement cards because every piece
		//carries its own.
		allyActivation: { shift: "none", text: "Does not move." },
		goldReward: { minimum: 0, maximum: 0 },
		isBoss: true,
		//Sized by the drawing rather than by scale: a landscape behemoth anchored at the back is the
		//same share of the stage at every window shape (reference/ART-GUIDE.md).
		presentation: { scale: 1, anchor: "back" },
	},

	//>>> LANE ANA | gauntlet | enemies >>>
	//The gauntlet's boss: Anastasia herself, a boss fight built around her picking random cards with
	//four golem allies. The ONE AI combatant whose `moveStrategy` should be "weighted":
	//an opponent whose plan cannot be read is the inverse of playing her, where every piece's next two
	//turns are a promise. Her moves mirror the kit out of verbs that already exist.
	//
	//HER ART IS HER OWN, read straight out of her character folder through `artCharacter`.
	//It used to be a byte-for-byte COPY in enemies/gauntletAnastasia/default/, which went stale the day
	//her new drawings landed. Her drawings are made for the PARTY line, facing right, so on the enemy line she
	//faced away and wears `drawnForSide: "ally"`.
	//
	//Health is the boss row of the Act1-A budget (285 HP across the line-up) less the four pieces that
	//open beside her (Rook 30, Knight 16, Bishop 14, Pawn 10).
	{
		index: "gauntletAnastasia",
		name: "Anastasia",
		role: "boss",
		//She has a full drawn set, so she declares it; an enemy that does not is only asked for `1-combat`
		//and `1-offense` (honeycomb.art.enemyArtSet).
		artPoseArray: ["combat", "offense", "damaged", "passive"],
		artTierArray: [1, 2],
		artPortrait: true,
		artCharacter: "anastasia",
		drawnForSide: "ally",
		tagArray: ["human", "woman", "summoner"],
		//Left out of every list and total until she is earned (honeycomb.discovery.isSealed).
		sealedBy: "anastasia",
		baseHealth: 215,
		healthVariance: 0,
		isBoss: true,
		moveStrategy: "weighted",
		//Promotions ask for a Pawn to promote, so she never spends a turn on an empty order.
		moveArray: [
			{ card: "gauntletAnastasiaCheck", weight: 25, maximumInARow: 2 },
			{ card: "gauntletAnastasiaDevelop", weight: 30, maximumInARow: 2 },
			{ card: "gauntletAnastasiaPromotion", weight: 25, maximumInARow: 1,
				condition: { index: "hasTag", over: "allAllies", tag: "pawn" } },
			{ card: "gauntletAnastasiaQueening", weight: 30, maximumInARow: 1, chargeCost: 3,
				condition: { index: "hasTag", over: "allAllies", tag: "pawn" } },
			{ card: "gauntletAnastasiaStudy", weight: 20, maximumInARow: 1 },
			{ card: "gauntletAnastasiaHold", weight: 20, maximumInARow: 1 },
		],
		goldReward: { minimum: 75, maximum: 105 },
	},
	//<<< LANE ANA | gauntlet | enemies <<<

	//===============================================================================================
	//REGION 1: the Upper Catacombs (the Fungal Depths). Role numbers are shares of the region's early
	//normal group: minion 20 HP / 5 dmg, striker 24 / 8.3, soldier 35 / 7, tank 44 / 5, support 25 / 3.7,
	//caster 28 / 6. "dmg" is expected damage (and Lust) per turn at full strength.
	//===============================================================================================

	{
		index: "sporeling",
		name: "Sporeling",
		role: "minion",
		tagArray: ["beast", "poison", "swarm"],
		baseHealth: 22,
		healthVariance: 2,
		startingStatusArray: [{ status: "sporeburst", stacks: 1 }],
		moveStrategy: "weighted",
		goldReward: { minimum: 6, maximum: 10 },
		moveArray: [
			{ card: "sporelingSpit", weight: 50, maximumInARow: 2 },
			{ card: "sporelingSpores", weight: 30 },
			{ card: "sporelingHarden", weight: 20, maximumInARow: 1 },
		],
	},

	{
		index: "capBrute",
		name: "Cap Brute",
		role: "soldier",
		tagArray: ["beast"],
		baseHealth: 40,
		healthVariance: 3,
		moveStrategy: "sequence",
		goldReward: { minimum: 12, maximum: 20 },
		//A readable loop: wind up, hit hard, pin, sweep. Rewards a player who learns the pattern, and every
		//lap starts two Strength richer than the last.
		moveArray: [
			{ card: "capBruteWindUp" },
			{ card: "capBruteSlam" },
			{ card: "capBrutePin" },
			{ card: "capBruteStomp" },
		],
	},

	{
		index: "gloomWisp",
		name: "Gloom Wisp",
		role: "caster",
		tagArray: ["undead", "spell"],
		baseHealth: 24,
		healthVariance: 2,
		moveStrategy: "weighted",
		goldReward: { minimum: 8, maximum: 12 },
		moveArray: [
			{ card: "gloomWispFlicker", weight: 40 },
			{ card: "gloomWispBeguile", weight: 35 },
			{ card: "gloomWispClutter", weight: 25, maximumInARow: 1 },
		],
	},

	{
		index: "hollowKnight",
		name: "Hollow Knight",
		role: "soldier",
		tagArray: ["undead", "construct"],
		baseHealth: 36,
		healthVariance: 3,
		moveStrategy: "weighted",
		goldReward: { minimum: 12, maximum: 20 },
		moveArray: [
			{ card: "hollowKnightCleave", weight: 35, maximumInARow: 2 },
			{ card: "hollowKnightPierce", weight: 30 },
			{ card: "hollowKnightStrip", weight: 25, maximumInARow: 1 },
			{
				card: "hollowKnightBrace", weight: 20, maximumInARow: 1,
				//Only braces when actually hurt, which the condition system expresses directly.
				condition: {
					index: "compare", operation: "less",
					left: { index: "stat", stat: "health", of: "source" },
					right: 20,
				},
			},
		],
	},

	{
		index: "gardener",
		name: "Earthstar",
		role: "support",
		//`beast` leaves. She was half-animal only because the robe had to be worn by something; an
		//earthstar is a fungus and nothing else. ART: squat, round, low and wide, splitting along a seam.
		tagArray: ["plant"],
		baseHealth: 26,
		healthVariance: 2,
		moveStrategy: "weighted",
		goldReward: { minimum: 8, maximum: 12 },
		moveArray: [
			{ card: "gardenerSpade", weight: 40, maximumInARow: 2 },
			{ card: "gardenerMulch", weight: 25, maximumInARow: 1 },
			{ card: "gardenerSow", weight: 35 },
			{
				//Her identity, charged so it cannot open the fight, and only while the garden has room.
				card: "gardenerReplant", weight: 40, chargeCost: 3,
				condition: { index: "compare", operation: "less", left: { index: "count", collection: "livingEnemies" }, right: 4 },
			},
		],
	},

	{
		index: "sage",
		name: "Bracket Elder",
		role: "caster",
		tagArray: ["plant", "spell"],
		baseHealth: 30,
		healthVariance: 3,
		moveStrategy: "weighted",
		goldReward: { minimum: 12, maximum: 18 },
		moveArray: [
			{ card: "sageSporebolt", weight: 35 },
			{ card: "sageMire", weight: 20, maximumInARow: 1 },
			{ card: "sageWithering", weight: 25 },
			{
				card: "sageWard", weight: 20, maximumInARow: 1,
				//Wards only once actually hurt, so it is not free value on turn one.
				condition: {
					index: "compare", operation: "less",
					left: { index: "stat", stat: "health", of: "source" },
					right: 18,
				},
			},
			{ card: "sageHex", weight: 15, maximumInARow: 1 },
		],
	},

	{
		index: "alchemist",
		name: "Spore Alchemist",
		role: "support",
		tagArray: ["plant", "spell"],
		baseHealth: 28,
		healthVariance: 3,
		moveStrategy: "weighted",
		goldReward: { minimum: 12, maximum: 18 },
		moveArray: [
			{ card: "alchemistFlask", weight: 35, maximumInARow: 2 },
			{ card: "alchemistBrew", weight: 25 },
			{ card: "alchemistTonic", weight: 25, maximumInARow: 1 },
			{ card: "alchemistFumes", weight: 15 },
		],
	},

	{
		index: "shield",
		name: "Bark Sentinel",
		role: "tank",
		tagArray: ["plant", "construct"],
		baseHealth: 44,
		healthVariance: 3,
		startingStatusArray: [{ status: "thorns", stacks: 2 }],
		moveStrategy: "weighted",
		goldReward: { minimum: 12, maximum: 20 },
		moveArray: [
			{ card: "sentinelBash", weight: 45, maximumInARow: 2 },
			{ card: "sentinelBristle", weight: 20, maximumInARow: 1 },
			{ card: "sentinelGuard", weight: 25, maximumInARow: 1 },
			{ card: "sentinelBrace", weight: 10, maximumInARow: 1 },
		],
	},

	{
		index: "puffcap",
		name: "Puffcap",
		role: "minion",
		tagArray: ["plant", "poison"],
		presentation: { scale: 0.75 },
		baseHealth: 14,
		healthVariance: 1,
		moveStrategy: "sequence",
		goldReward: { minimum: 4, maximum: 8 },
		moveArray: [
			{ card: "puffcapSwell" },
			{ card: "puffcapRipen" },
			{ card: "puffcapBurst" },
		],
	},

	{
		index: "moldLeech",
		name: "Mold Leech",
		role: "striker",
		tagArray: ["beast"],
		//HC-PLACEHOLDER: its own folder holds a recoloured stand-in (generate-placeholder-art.py,
		//ENEMY_SOURCES) until the drawing in ENEMIES-01 s5 arrives.
		artOwed: true,
		presentation: { scale: 0.9 },
		baseHealth: 24,
		healthVariance: 2,
		moveStrategy: "weighted",
		goldReward: { minimum: 8, maximum: 14 },
		moveArray: [
			{ card: "leechLatch", weight: 50, maximumInARow: 2 },
			{ card: "leechSiphon", weight: 30 },
			{ card: "leechEngorge", weight: 20, maximumInARow: 1 },
		],
	},

	{
		index: "moldshaper",
		name: "Witch's Butter",
		role: "support",
		tagArray: ["plant", "spell"],
		presentation: { scale: 0.9 },
		baseHealth: 28,
		healthVariance: 2,
		moveStrategy: "weighted",
		goldReward: { minimum: 10, maximum: 16 },
		moveArray: [
			{ card: "moldshaperMend", weight: 30, maximumInARow: 1 },
			{ card: "moldshaperRotTouch", weight: 40, maximumInARow: 2 },
			{ card: "moldshaperVeil", weight: 20 },
			{ card: "moldshaperReshape", weight: 15, maximumInARow: 1, condition: { index: "hasDebuff", of: "source" } },
		],
	},

	{
		index: "cordycepsHusk",
		name: "Sporeguard",
		role: "soldier",
		//`undead` leaves with the husk. The tone rule bans the cordyceps zombie by name, and its
		//other three holders (Gloom Wisp, Hollow Knight, Hollow Champion) are wisp-or-empty-armour.
		tagArray: ["plant", "poison"],
		//HC-PLACEHOLDER: its own folder holds a recoloured stand-in (generate-placeholder-art.py,
		//ENEMY_SOURCES) until the drawing in ENEMIES-01 s5 arrives.
		//ART: the img2img SOURCE is refsPNG/enemies/shield.png, which the Bark Sentinel also draws from --
		//SOURCE, not a shared sprite. Both are fielded in Region 1 and can stand in one fight, so they
		//must not share a silhouette: the Sentinel is bark and rooted, a palisade that walks, wide and
		//low, its shield IS its body. The Sporeguard is upright and narrow, the shield is CARRIED, and
		//the cap breaks the helmet line. See enemy_overhaul/RECAST-01.md.
		presentation: { scale: 0.95 },
		baseHealth: 32,
		healthVariance: 3,
		startingStatusArray: [{ status: "cordycepsHost", stacks: 1 }],
		moveStrategy: "weighted",
		goldReward: { minimum: 10, maximum: 16 },
		moveArray: [
			{ card: "huskSword", weight: 45, maximumInARow: 2 },
			{ card: "huskLurch", weight: 30 },
			{ card: "huskCough", weight: 25 },
		],
	},

	{
		//>>> LANE E7 | glowcap | mushroom >>>
		//Now a mushroom. It was the one moth left in the mushroom act, and every moth source in the art
		//folder belongs to Act1-C now, so a
		//moth here would read as a body that wandered in off the other route.
		//Only the NAME and the SPECIES TAG move. Its index, its moves and every number are untouched --
		//indices are save data, and a telegraphed move stores the card's.
		index: "glowMoth",
		name: "Glowcap",
		role: "caster",
		tagArray: ["plant", "spell"],
		//HC-PLACEHOLDER: no drawing yet. ART: a translucent domed bell cap lit from inside over a
		//slender cream body, backlit gills, trailing hyphae for legs, drifting rather than walking,
		//luminous spore motes around it. It IS a lamp where Foxfire CARRIES one, which is why `lantern`
		//and `lamp` are negatives alongside `moth`, `wings` and `antennae`.
		//Prompt already written: _source/enemy inspo variants/assigned/_generate/glowcap-new.txt.
		//<<< LANE E7 | glowcap | mushroom <<<
		presentation: { scale: 0.62 },
		baseHealth: 22,
		healthVariance: 2,
		moveStrategy: "weighted",
		goldReward: { minimum: 8, maximum: 14 },
		moveArray: [
			{ card: "mothKiss", weight: 35, maximumInARow: 2 },
			{ card: "mothDust", weight: 30 },
			{ card: "mothDazzle", weight: 20, maximumInARow: 1 },
			{ card: "mothFlutter", weight: 15, maximumInARow: 1 },
		],
	},

	//===============================================================================================
	//REGION 2: ACT1-A, THE MUSHROOM FRONTIER. Recast out of what was an adjective-plus-animal taxonomy
	//list. They are frontier myconids under arms now, which is the sub-act's own brief: larger,
	//semi-intelligent myconids building a society, using more human weapons and armor than before. Each
	//recast is read off the move list the enemy already had, so nothing moved and no number changed. The
	//one that is NOT a myconid is the Scrap Salvager, an Act 2 intruder whose scrap is the tell that it
	//does not belong.
	//The REGION's own name is still "The Flooded Vault" -- titling belongs to map/; this sub-act is
	//"Myconid Navel".
	//Role numbers against its own early group: minion 39 HP / 6.7 dmg,
	//striker 46 / 11, soldier 67 / 9.4, tank 85 / 6.7, support 49 / 4.9, caster 55 / 8. Region 1's
	//enemies fill out its line-ups as extra bodies.
	//===============================================================================================

	{
		index: "siltCrawler",
		name: "Shieldcap",
		role: "minion",
		tagArray: ["plant"],
		//HC-PLACEHOLDER: its own folder holds a recoloured stand-in (generate-placeholder-art.py,
		//ENEMY_SOURCES) until the drawing in ENEMIES-01 s5 arrives.
		//ART: a dome-capped myconid crouched behind a looted pavise, cream and low. Its silhouette
		//is the shield, so it must not be drawn to read like the Bark Sentinel, whose shield IS its body.
		//Source: `bellhead-b` in _source/enemy inspo variants/ (the image folder honeycomb.image resolves).
		presentation: { scale: 0.7 },
		baseHealth: 36,
		healthVariance: 3,
		startingStatusArray: [{ status: "plated", stacks: 2 }],
		moveStrategy: "weighted",
		goldReward: { minimum: 10, maximum: 16 },
		moveArray: [
			{ card: "crawlerPinch", weight: 50, maximumInARow: 2 },
			{ card: "crawlerScuttle", weight: 30 },
			{ card: "crawlerBurrow", weight: 20, maximumInARow: 1 },
		],
	},

	{
		index: "mireEel",
		name: "Cagecap",
		role: "striker",
		tagArray: ["plant"],
		//HC-PLACEHOLDER: its own folder holds a recoloured stand-in (generate-placeholder-art.py,
		//ENEMY_SOURCES) until the drawing in ENEMIES-01 s5 arrives.
		//ART: a tall myconid whose cap splits into a red lattice cage, carrying looted steel. The
		//lattice is the silhouette -- open when it strikes, shut when it folds in.
		presentation: { scale: 1.1 },
		baseHealth: 44,
		healthVariance: 3,
		moveStrategy: "weighted",
		goldReward: { minimum: 14, maximum: 22 },
		moveArray: [
			{ card: "eelBite", weight: 40, maximumInARow: 2 },
			{ card: "eelSubmerge", weight: 25, maximumInARow: 1 },
			{ card: "eelConstrict", weight: 35 },
		],
	},

	{
		index: "bogToad",
		name: "Bolete Hook",
		role: "tank",
		tagArray: ["plant"],
		//HC-PLACEHOLDER: its own folder holds a recoloured stand-in (generate-placeholder-art.py,
		//ENEMY_SOURCES) until the drawing in ENEMIES-01 s5 arrives.
		//ART: a thick-stemmed bolete, broad, low and very heavy under a wide green cap, with long curling
		//tentacles trailing out of it. The REACH is the silhouette -- the tentacles are what put it past
		//its own outline, where the note used to ask for a looted hooked halberd.
		//The grown reach beats the looted one for this body: Hook Pull was the old toad's tongue, and a
		//tentacle is the same gesture without borrowing a weapon a mushroom has no hands for.
		//NOT A TOAD. The index is save data from before the recast; nothing amphibian belongs here.
		presentation: { scale: 1.45 },
		baseHealth: 84,
		healthVariance: 5,
		moveStrategy: "weighted",
		goldReward: { minimum: 16, maximum: 24 },
		moveArray: [
			{ card: "toadTongue", weight: 35, maximumInARow: 1 },
			{ card: "toadSlam", weight: 30, maximumInARow: 2 },
			{ card: "toadCroak", weight: 20, maximumInARow: 1 },
			{ card: "toadSpit", weight: 15 },
		],
	},

	{
		index: "drownedSalvager",
		name: "Scrap Salvager",
		//ELITE: an intruder from Act 2, an elite enemy down here in Act 1 -- that line describes the role,
		//not just his fiction. He is met once a run now instead of three times, which suits a trespasser
		//better than a patrol did.
		role: "elite",
		tagArray: ["kobold", "elite"],
		//HC-PLACEHOLDER: its own folder holds a recoloured stand-in (generate-placeholder-art.py,
		//ENEMY_SOURCES) until the drawing in ENEMIES-01 s5 arrives.
		//ART: the only non-myconid in the sub-act, and that is the read -- Act 2 scrap on an Act 2
		//body, standing among mushrooms in looted plate. Nothing about him should be damp.
		artOwed: true,
		//ELITE NUMBERS. Written between the Kobold Scavenger (130) and the Hollow Champion (140), the two
		//elites he now stands beside, rather than at the solo-elite line-up target of 195 -- every R2
		//elite encounter pairs its elite with a normal body, so the body is where the rest comes from.
		presentation: { scale: 1 },
		baseHealth: 135,
		healthVariance: 6,
		moveStrategy: "weighted",
		goldReward: { minimum: 30, maximum: 45 },
		moveArray: [
			{ card: "salvagerSpear", weight: 40, maximumInARow: 2 },
			{ card: "salvagerSnare", weight: 25, maximumInARow: 1 },
			{ card: "salvagerDischarge", weight: 35, maximumInARow: 1, chargeCost: 3 },
			{ card: "salvagerPatch", weight: 15, maximumInARow: 1 },
		],
	},

	{
		index: "lanternJelly",
		name: "Foxfire",
		role: "caster",
		tagArray: ["plant", "spell"],
		//HC-PLACEHOLDER: its own folder holds a recoloured stand-in (generate-placeholder-art.py,
		//ENEMY_SOURCES) until the drawing in ENEMIES-01 s5 arrives.
		//ART: a myconid lamplighter with glowing gills and a hooked lamp-pole. SHE HAS A FACE --
		//the old prompt ended on "no face", on the enemy whose whole job is Charm.
		baseHealth: 52,
		healthVariance: 3,
		startingStatusArray: [{ status: "thorns", stacks: 2 }],
		moveStrategy: "weighted",
		goldReward: { minimum: 14, maximum: 22 },
		moveArray: [
			{ card: "jellyLure", weight: 40, maximumInARow: 2 },
			{ card: "jellySting", weight: 35 },
			{ card: "jellyPulse", weight: 25 },
		],
	},

	//>>> LANE E7 | flora | enemies >>>
	//===============================================================================================
	//REGION 3: ACT1-B, THE THORN ARBOR. The hotspot for venom and poison. The PvZ sunflower is the
	//reference for the REGISTER -- bright and silly, never sinister.
	//
	//It sits at the same DEPTH as Act1-A, so it uses Act1-A's role numbers against region index 1:
	//minion 39 HP / 6.7, striker 46 / 11, soldier 67 / 9.4, tank 85 / 6.7, support 49 / 4.9,
	//caster 55 / 8. A run reaches B instead of A, never as well, so nothing here is deeper content.
	//
	//THE LINE-UP MIXES ITS THREATS (mechanics bible s5): five bodies, five roles, and one of them --
	//the Trumpet Bell -- is not humanoid, so the silhouettes differ. Every one of them is designed off its own drawing; see the ART note on each.
	//Sources live in the !designDocs/honeycomb/!imageStorage/_source/enemy inspo variants/assigned/, and that folder's
	//ASSIGNED.md is the ONLY record of which image belongs to which enemy -- filenames do not say.
	//===============================================================================================

	{
		//ART: a chrysanthemum head -- a wide cream-and-ochre petal spiral wound around a small sleeping
		//face -- over a green leaf skirt on root feet, with a cluster of unopened green buds at the
		//shoulder. Placid and enormous. Source: `sunflower-b`, ASSIGNED.md.
		index: "wellspring",
		name: "Wellspring",
		role: "support",
		tagArray: ["plant"],
		presentation: { scale: 0.75 },
		baseHealth: 50,
		healthVariance: 3,
		moveStrategy: "weighted",
		goldReward: { minimum: 12, maximum: 18 },
		//Envenomed on the whole arbor is what makes a Flora line-up an ENGINE rather than a queue of
		//attacks, and it is the thing worth killing first.
		moveArray: [
			{ card: "wellspringRun", weight: 30, maximumInARow: 1 },
			{ card: "wellspringMulch", weight: 25, maximumInARow: 1 },
			{ card: "wellspringDrench", weight: 25 },
			{ card: "wellspringStem", weight: 20 },
		],
	},

	{
		//ART: a palm-sized rose sprite hovering with eyes shut and a pleased little smile, leaf wings, a
		//gold bead necklace -- and two thorned vine loops trailing from her that are longer than she is.
		//The loops are the threat; she is not. Source: `rosebrat-a`, ASSIGNED.md.
		index: "thornSprite",
		name: "Briar Brat",
		role: "minion",
		tagArray: ["plant", "fey"],
		presentation: { scale: 0.62 },
		baseHealth: 38,
		healthVariance: 2,
		moveStrategy: "weighted",
		goldReward: { minimum: 10, maximum: 16 },
		moveArray: [
			{ card: "spriteLash", weight: 35, maximumInARow: 2 },
			{ card: "spriteSnare", weight: 35 },
			{ card: "spriteTangle", weight: 30, maximumInARow: 1 },
		],
	},

	{
		//ART: an angel's trumpet. A pale green bell where a head would be, hollow and dark inside, with
		//NO FACE; a wide leaf skirt scattered with violet flowers, two brass bells at the hem, one
		//looping stem for a leg, and pollen coming off it. Source: `bigbell-b`, ASSIGNED.md.
		//It is here to break up an otherwise very humanoid roster, so it must stay a flower.
		index: "trumpetBell",
		name: "Trumpet Bell",
		role: "caster",
		tagArray: ["plant", "poison"],
		presentation: { scale: 1.15 },
		baseHealth: 54,
		healthVariance: 3,
		moveStrategy: "weighted",
		goldReward: { minimum: 14, maximum: 22 },
		//Nothing it does picks a target, because nothing about it can see. The charged peal is the
		//telegraphed swell a Grind build is asked to answer.
		moveArray: [
			{ card: "bellDrift", weight: 35, maximumInARow: 2 },
			{ card: "bellStoop", weight: 25 },
			{ card: "bellFurl", weight: 20, maximumInARow: 1 },
			{ card: "bellPeal", weight: 20, maximumInARow: 1, chargeCost: 2 },
		],
	},

	{
		//ART: a white-haired fey-eared girl sitting half-sunk in a giant glossy orange heart-shaped
		//fruit, laughing with her eyes shut, holding a second small fruit up to be taken. Puffy green
		//sleeves, leaf collar, one coiling stem beneath. Source: `jellyfairy-a`, ASSIGNED.md.
		//The fruit is most of her body, which is where the health sits.
		index: "fruitAlraune",
		name: "Windfall Alraune",
		role: "tank",
		tagArray: ["plant"],
		presentation: { scale: 1.2 },
		baseHealth: 84,
		healthVariance: 5,
		moveStrategy: "weighted",
		goldReward: { minimum: 16, maximum: 24 },
		moveArray: [
			{ card: "fruitWindfall", weight: 30, maximumInARow: 1 },
			{ card: "fruitPip", weight: 25 },
			{ card: "fruitSpill", weight: 25, maximumInARow: 1 },
			{ card: "fruitRind", weight: 20, maximumInARow: 1 },
		],
	},

	{
		//ART: a swashbuckler. Green-skinned, a sunflower ruff at the throat and a second sunflower on the
		//brim of a wide red hat, a red-and-gold petal coat, a long slender rapier held en garde, petals
		//coming off her as she moves. Source: `beenoble-b`, ASSIGNED.md.
		//The MATCHED PAIR of duelists belongs to Act1-C, not here: ASSIGNED.md puts `butterflyfencer-a`
		//and `-c` on the Pollen Road and says to fight those two together. This one is a single body,
		//and fielding her twice in a line-up would be the repeat that pairing is meant to avoid.
		index: "thornFencer",
		name: "Thorn Fencer",
		role: "striker",
		tagArray: ["plant"],
		presentation: { scale: 1.05 },
		baseHealth: 45,
		healthVariance: 3,
		moveStrategy: "weighted",
		goldReward: { minimum: 12, maximum: 20 },
		moveArray: [
			{ card: "fencerPrick", weight: 35, maximumInARow: 2 },
			{ card: "fencerLunge", weight: 30, maximumInARow: 1 },
			{ card: "fencerFlourish", weight: 20 },
			{ card: "fencerGuard", weight: 15, maximumInARow: 1 },
		],
	},

	//---------------------------------------------------------------------------------------------
	//THE SISTERS. Act1-B's boss is TWO BODIES, one encounter. The Juggernaut's little companion is the
	//precedent for a boss that is not one figure.
	//
	//The pictures decide the fight. The day sister is OPEN -- bloom spread, an arm sheathed to the
	//shoulder in running nectar, mid-stride. The night sister is SHUT -- her head is a bud that has
	//not opened, she is wrapped in her own leaves, and the ground around her is cracked and covered in
	//fallen petals. So one of them attacks and feeds, and the other holds and seeps, and a party that
	//answers only one half of that is answering half the fight.
	//
	//Their health is the region's boss line-up (245) split between them rather than added to it.
	//---------------------------------------------------------------------------------------------

	{
		index: "arborSisterDay",
		name: "The Waking Sister",
		//HALF OF ONE BOSS, not one of two (tuning.balance.enemyRoleArray "bossHalf"). The pair carries a
		//single boss's budget between them, which is what makes the duo an encounter rather than a wall.
		role: "bossHalf",
		tagArray: ["plant", "poison", "boss"],
		presentation: { scale: 1.15 },
		baseHealth: 128,
		healthVariance: 0,
		isBoss: true,
		moveStrategy: "weighted",
		goldReward: { minimum: 70, maximum: 100 },
		moveArray: [
			{ card: "sisterDayGlove", weight: 35, maximumInARow: 2 },
			{ card: "sisterDaySweep", weight: 25, maximumInARow: 1 },
			{ card: "sisterDayGift", weight: 40, maximumInARow: 1 },
		],
	},

	{
		index: "arborSisterNight",
		name: "The Sleeping Sister",
		role: "bossHalf",
		tagArray: ["plant", "poison", "boss"],
		presentation: { scale: 1.15 },
		baseHealth: 117,
		healthVariance: 0,
		isBoss: true,
		moveStrategy: "weighted",
		goldReward: { minimum: 0, maximum: 0 },
		//Deep Root scales off the Poison the party is already carrying, so a fight that has let the
		//arbor work is the fight where it lands hardest -- soft-scaling friction, not a hard counter.
		//SHE MOSTLY STAYS SHUT. Two bodies both swinging every turn is twice a boss's action economy,
		//which the static template cannot see because it measures one body at a time. budget-audit.js
		//first read the pair at 30.5 gross per turn against a target of 18.2, winning one fight in four;
		//weighting her toward Closed Bud is both half the fix and the truer read of a sister drawn as a
		//bud that has not opened. The other half was cutting what COMPOUNDED -- see Closed Bud and
		//Share the Cup. Measured after: 16.6 gross, 75% at three seeds, level with the Juggernaut.
		moveArray: [
			{ card: "sisterNightFall", weight: 35, maximumInARow: 2 },
			{ card: "sisterNightShut", weight: 40, maximumInARow: 1 },
			{ card: "sisterNightRoot", weight: 25, maximumInARow: 1, chargeCost: 2 },
		],
	},
	//<<< LANE E7 | flora | enemies <<<

	//>>> LANE E7 | pollenRoad | enemies >>>
	//===============================================================================================
	//REGION 4: ACT1-C, THE POLLEN ROAD. Story bible s4: "Fey have taken up homes in the dungeons and
	//found the mutated moths here are even more stupid than the humans they used to mess with, now
	//they spend all day lounging about, the pollen's started affecting their judgement."
	//
	//ONE VISUAL LANGUAGE ACROSS TWO SCALES -- wings, dust, antennae, glow, fur -- which is worth more
	//to the art pipeline than two unrelated rosters. Nobody here is running anything.
	//
	//GUARDRAIL: this sub-act stands closest to Act 3 and becomes a preview of it the moment it gets
	//tidy. No gold, no halos, no hexagons, nothing symmetrical. The fencers hold a line because they
	//always have; everything around them has stopped.
	//
	//Same depth as Act1-A, so the same role numbers against region index 1: minion 39 HP / 6.7,
	//striker 46 / 11, soldier 67 / 9.4, tank 85 / 6.7, support 49 / 4.9, caster 55 / 8.
	//Sources live in the !designDocs/honeycomb/!imageStorage/_source/enemy inspo variants/assigned/, and that folder's
	//ASSIGNED.md is the ONLY record of which image belongs to which enemy -- filenames do not say.
	//===============================================================================================

	{
		//ART: black segmented plate with cyan-glowing trim, a butterfly-crested helm with the VISOR
		//DOWN and no face behind it, large cyan wings, digitigrade armoured legs, lunging with a thin
		//rapier behind a wide cup guard. Formal and completely covered.
		//Source: `butterflyfencer-a`, ASSIGNED.md. FIGHTS WITH `argentFencer` (`pollenFencers`).
		index: "sableFencer",
		name: "Sable Fencer",
		role: "soldier",
		tagArray: ["fey", "insect"],
		presentation: { scale: 1.05 },
		baseHealth: 67,
		healthVariance: 3,
		moveStrategy: "weighted",
		goldReward: { minimum: 14, maximum: 22 },
		moveArray: [
			{ card: "sableThrust", weight: 35, maximumInARow: 2 },
			{ card: "sableBind", weight: 25 },
			{ card: "sableLine", weight: 20, maximumInARow: 1 },
			{ card: "sableGuard", weight: 20, maximumInARow: 1 },
		],
	},

	{
		//ART: the same helm, the same cup guard, the same stance -- in bright steel instead of black,
		//and with the plate cut away at the chest, hips and thighs. Her partner is sealed; she is not.
		//Source: `butterflyfencer-c`, ASSIGNED.md. The matched pose across two bodies is the point:
		//fielded together they read as a duo, met separately they would read as the same enemy twice.
		index: "argentFencer",
		name: "Argent Fencer",
		role: "striker",
		tagArray: ["fey", "insect"],
		presentation: { scale: 1.05 },
		baseHealth: 45,
		healthVariance: 3,
		moveStrategy: "weighted",
		goldReward: { minimum: 12, maximum: 20 },
		moveArray: [
			{ card: "argentRemise", weight: 30, maximumInARow: 2 },
			{ card: "argentLunge", weight: 35, maximumInARow: 1 },
			{ card: "argentFlare", weight: 20 },
			{ card: "argentSidestep", weight: 15, maximumInARow: 1 },
		],
	},

	{
		//ART: a towering moth matron. A tiny featureless grey head with long black feathered antennae, a
		//white fur ruff, and enormous grey wings draped to the floor like a coat, with a violet cloud of
		//dust standing in the air around her. Asymmetric and unornamented -- the prompt carries the
		//guardrail in its own negatives. Source: `mushroommadame-b`, ASSIGNED.md.
		index: "mantlewing",
		name: "Mantlewing",
		role: "tank",
		tagArray: ["fey", "insect"],
		presentation: { scale: 1.3 },
		baseHealth: 85,
		healthVariance: 5,
		moveStrategy: "weighted",
		goldReward: { minimum: 16, maximum: 24 },
		moveArray: [
			{ card: "mantleDust", weight: 30, maximumInARow: 2 },
			{ card: "mantleSweep", weight: 25 },
			{ card: "mantleFold", weight: 25, maximumInARow: 1 },
			{ card: "mantleShade", weight: 20, maximumInARow: 1 },
		],
	},

	{
		//ART: very tall and spindly, pale pink. A tiny fuzzy head with one large violet patch and NO
		//FACE, feathered antennae, a fur ruff, enormous drooping wings hanging to the floor, and long
		//thin legs on a single clawed foot standing in scattered pollen. Swaying, dusted, dazed.
		//Source: `spookytall-d`, ASSIGNED.md.
		index: "longwing",
		name: "Longwing",
		role: "caster",
		tagArray: ["fey", "insect"],
		presentation: { scale: 1.35 },
		baseHealth: 54,
		healthVariance: 3,
		moveStrategy: "weighted",
		goldReward: { minimum: 14, maximum: 22 },
		moveArray: [
			{ card: "longwingSway", weight: 30, maximumInARow: 2 },
			{ card: "longwingScatter", weight: 25 },
			{ card: "longwingStoop", weight: 25 },
			{ card: "longwingSettle", weight: 20, maximumInARow: 1 },
		],
	},

	{
		//ART: a giant orange mushroom whose cap is a bowl of glowing nectar, with a small moth-fluff
		//figure sunk in it to the shoulders under a head of white foam, half asleep. Green leaves under
		//the cap, a pale stipe below. The figure is easy to miss against the foam, which is the joke.
		//Source: `jellyfairy-b`, ASSIGNED.md -- and it was ORIGINALLY MISFILED AS A PUFFCAP for exactly
		//that reason, so the drawing has to keep her findable.
		index: "soakcap",
		name: "Soakcap",
		role: "support",
		tagArray: ["fey", "insect"],
		presentation: { scale: 1.45 },
		baseHealth: 50,
		healthVariance: 3,
		moveStrategy: "weighted",
		goldReward: { minimum: 12, maximum: 18 },
		//She never leaves the bowl. Everything she does is something overflowing.
		moveArray: [
			{ card: "soakcapSpill", weight: 30, maximumInARow: 2 },
			{ card: "soakcapSplash", weight: 25 },
			{ card: "soakcapShare", weight: 25, maximumInARow: 1 },
			{ card: "soakcapSteep", weight: 20, maximumInARow: 1 },
		],
	},

	{
		//ACT1-C'S BOSS, and ONE ENEMY rather than two: the torso is part of the drawing.
		//ART: an enormous bone-white moth-taur. A quadruped carapace body on clawed limbs, great
		//patterned wings, leather harness straps buckled over the whole of it, and a grinning moth-girl
		//torso rising from the front with her wrists in manacles and the chains hanging slack. She is
		//dazed, drooling and having a marvellous time. Source: `feralbeast-c`, ASSIGNED.md -- "the
		//strongest image in the folder".
		//Her health is the region's whole boss line-up, as the Juggernaut's is in Act1-A.
		index: "paleDray",
		name: "The Pale Dray",
		role: "boss",
		tagArray: ["fey", "insect", "boss"],
		presentation: { scale: 1.3, anchor: "back" },
		baseHealth: 245,
		healthVariance: 0,
		isBoss: true,
		moveStrategy: "weighted",
		goldReward: { minimum: 70, maximum: 100 },
		moveArray: [
			{ card: "drayClaw", weight: 30, maximumInARow: 2 },
			{ card: "drayChain", weight: 20, maximumInARow: 1 },
			{ card: "drayGrin", weight: 20, maximumInARow: 1 },
			{ card: "drayDoze", weight: 5, maximumInARow: 1 },
			{ card: "drayLurch", weight: 25, maximumInARow: 1, chargeCost: 2 },
		],
	},
	//<<< LANE E7 | pollenRoad | enemies <<<

	//===============================================================================================
	//ELITES. Written to the whole elite group: region 1 137-156 HP / 15.6-16.8 dmg. A late elite fight
	//adds a body rather than stats; a region 2 elite fight pairs the elite with a region 2 enemy.
	//===============================================================================================

	{
		index: "scavenger",
		name: "Kobold Scavenger",
		role: "elite",
		//A KOBOLD, not a fungal creature: he came down from the Scavenger Front with a satchel of bombs.
		tagArray: ["beast", "kobold", "elite"],
		baseHealth: 130,
		healthVariance: 6,
		moveStrategy: "weighted",
		goldReward: { minimum: 30, maximum: 45 },
		//The curl is the armadillo answer to a burst turn, so the move is gated on being hurt; the big bomb
		//is charged and telegraphed, so a party that has spent everything has one turn to answer it.
		moveArray: [
			{ card: "scavengerClaw", weight: 35, maximumInARow: 2 },
			{ card: "scavengerScatter", weight: 30 },
			{ card: "scavengerFumes", weight: 20, maximumInARow: 1 },
			{
				card: "scavengerCurl", weight: 20, maximumInARow: 1,
				condition: {
					index: "compare", operation: "less",
					left: { index: "stat", stat: "health", of: "source" },
					right: 65,
				},
			},
			{ card: "scavengerBigBomb", weight: 35, maximumInARow: 1, chargeCost: 3 },
		],
	},

	{
		index: "hollowChampion",
		name: "Hollow Champion",
		role: "elite",
		tagArray: ["undead", "construct", "elite"],
		//HC-PLACEHOLDER: its own folder holds a recoloured stand-in (generate-placeholder-art.py,
		//ENEMY_SOURCES) until the drawing in ENEMIES-01 s5 arrives.
		artOwed: true,
		presentation: { scale: 1.25 },
		baseHealth: 140,
		healthVariance: 6,
		moveStrategy: "weighted",
		goldReward: { minimum: 30, maximum: 45 },
		moveArray: [
			{ card: "championCleave", weight: 35, maximumInARow: 2 },
			{ card: "championLunge", weight: 30, maximumInARow: 1 },
			{ card: "championGuard", weight: 25, maximumInARow: 1 },
			{ card: "championThrust", weight: 20 },
		],
	},

	//===============================================================================================
	//BOSSES. 0.9 of the boss group's health (region 1 205, region 2 256); the rest arrives as summons.
	//===============================================================================================

	{
		index: "matriarch",
		name: "The Matriarch",
		role: "boss",
		tagArray: ["beast", "poison", "boss", "summoner"],
		baseHealth: 205,
		healthVariance: 0,
		isBoss: true,
		//How she STANDS: a boss looms, and she holds a place of her own
		//BEHIND her minions rather than taking a share of the row and shrinking as they arrive. An
		//encounter may lay its own `placementArray` over this per slot. Fields: scale, offsetXPercent,
		//offsetYPercent (of the sprite's own box), anchor ("back").
		//Her drawing is LANDSCAPE (a throne and tentacles, 1152x896). An anchored sprite is sized
		//by the stage's height alone (honeycomb.css), so 1 is the whole height and her canvas's own tentacles
		//give the looming; more than that spills off the top of a wide screen.
		presentation: { scale: 1, anchor: "back" },
		//SHE BREAKS ON SCREEN: the !!BROKEN!! cut-in plays for her as it does for the
		//party, from her own folder. Breaking still beats her outright, as it does every enemy
		//(tuning.lust.brokenBehaviorByKind), and beating her wins the fight (matriarchLair).
		brokenCutIn: true,
		brokenArtPath: "enemies/matriarch/broken",
		brokenBackgroundPath: "enemies/matriarch/brokenBG",
		moveStrategy: "threshold",
		goldReward: { minimum: 70, maximum: 100 },
		//Two phases: measured while healthy, frantic once past half.
		phaseArray: [
			{ atOrBelow: 0.50, moveArray: ["matriarchBrood", "matriarchSwarm", "matriarchWail", "matriarchEmbrace", "matriarchLash"] },
			{ atOrBelow: 1.00, moveArray: ["matriarchBloom", "matriarchLash", "matriarchCarapace", "matriarchBrood", "matriarchEmbrace"] },
		],
		//`chargeCost` is the charging bar: her big moves cannot open the fight and
		//cannot follow one another, because each empties what took turns to build. At chargePerTurn 1 that
		//is roughly one big move every three turns, and never two running.
		moveArray: [
			{ card: "matriarchLash", weight: 50, maximumInARow: 2 },
			{ card: "matriarchCarapace", weight: 20, maximumInARow: 1 },
			{ card: "matriarchBloom", weight: 25, maximumInARow: 1 },
			{ card: "matriarchSwarm", weight: 45, chargeCost: 3 },
			{ card: "matriarchBrood", weight: 30, maximumInARow: 1, chargeCost: 3 },
			{ card: "matriarchEmbrace", weight: 35, maximumInARow: 1, chargeCost: 3 },
			{ card: "matriarchWail", weight: 30, chargeCost: 4 },
		],
	},

	{
		index: "headGardener",
		name: "The Head Gardener",
		role: "boss",
		tagArray: ["plant", "boss", "summoner"],
		//SCALE 1.1, measured rather than guessed. She is meant to be partially off-screen because she is
		//so tall, but the little puffcaps on her head and rear still need to stay visible.
		//
		//She is ANCHORED BACK, and a back-anchored fighter is sized off the battlefield's HEIGHT: the
		//stylesheet gives its wrap a definite height, so `max-height: 84% * scale` resolves and the
		//drawing is 84% of the stage per unit of scale, growing upward from the feet. Solving that
		//against the two overflows the sprite-fit audit measured, at both of the window shapes it was
		//run at:
		//
		//    1878x804    575px of drawing per unit of scale, feet at 639px   -> fits exactly at 1.112
		//    1920x1080   768px per unit of scale, feet at 854px              -> fits exactly at 1.111
		//
		//The two agree because the stage and the feet scale together, so the answer does not depend on
		//the window. 1.1 puts the top of her head about 7px inside the top edge at his shape, which is
		//what makes the puffcap on her head visible. She is still the tallest thing in Act 1 and still
		//runs off the SIDE of the screen, which is intentional.
presentation: { scale: 1.1, anchor: "back" },
		baseHealth: 195,
		healthVariance: 0,
		isBoss: true,
		moveStrategy: "threshold",
		goldReward: { minimum: 70, maximum: 100 },
		//She opens by planting, so the first thing the party sees is a pair of fuses.
		openingMove: "headGardenerPlant",
		phaseArray: [
			{ atOrBelow: 0.50, moveArray: ["headGardenerShears", "headGardenerWhip", "headGardenerPlant", "headGardenerOvergrow", "headGardenerGraft"] },
			{ atOrBelow: 1.00, moveArray: ["headGardenerShears", "headGardenerSnare", "headGardenerGraft", "headGardenerPlant"] },
		],
		moveArray: [
			{ card: "headGardenerShears", weight: 45, maximumInARow: 2 },
			{ card: "headGardenerSnare", weight: 30 },
			{ card: "headGardenerWhip", weight: 30 },
			{ card: "headGardenerGraft", weight: 25, maximumInARow: 1 },
			{
				card: "headGardenerPlant", weight: 45, maximumInARow: 1, chargeCost: 3,
				condition: { index: "compare", operation: "less", left: { index: "count", collection: "livingEnemies" }, right: 5 },
			},
			{ card: "headGardenerOvergrow", weight: 30, maximumInARow: 1, chargeCost: 4 },
		],
	},

	{
		index: "juggernaut",
		name: "The Juggernaut",
		role: "boss",
		tagArray: ["plant", "boss"],
		baseHealth: 245,
		healthVariance: 0,
		isBoss: true,
		//A square drawing (1024x1024), anchored behind his line like the Matriarch so he looms over
		//whatever guards him. See ART-GUIDE §2 on why an anchored boss is sized by height alone.
		presentation: { scale: 0.9, anchor: "back" },
		//He breaks on screen like the Matriarch. No broken background is drawn yet, so the tear falls
		//back to the flat wash in his own colour (see honeycomb-overlay-broken.backgroundStyleFor).
		brokenCutIn: true,
		brokenArtPath: "enemies/juggernaut/broken",
		moveStrategy: "threshold",
		goldReward: { minimum: 75, maximum: 105 },
		//ALWAYS OPENS WITH AVALANCHE, whatever the charging bar says. See honeycomb.selectMove:
		//an `openingMove` is taken for the fight's first turn exactly once.
		openingMove: "juggernautAvalanche",
		//Two phases: measured while healthy, relentless once past half. His counterpart the Matriarch
		//owns summons and lust; he owns POSITION, VULNERABLE on every blow, and a companion who keeps him
		//clean. The whistle only appears while he has something to clean off.
		phaseArray: [
			{ atOrBelow: 0.50, moveArray: ["juggernautOverhead", "juggernautCrush", "juggernautSweep", "juggernautBackhand", "juggernautAvalanche", "juggernautHurl", "juggernautRoar"] },
			{ atOrBelow: 1.00, moveArray: ["juggernautSweep", "juggernautHurl", "juggernautOverhead", "juggernautUproot", "juggernautRoar", "juggernautBackhand", "juggernautWhistle"] },
		],
		moveArray: [
			{ card: "juggernautSweep", weight: 50, maximumInARow: 1 },
			{ card: "juggernautOverhead", weight: 35 },
			{ card: "juggernautCrush", weight: 30, maximumInARow: 1 },
			{ card: "juggernautHurl", weight: 35 },
			{ card: "juggernautBackhand", weight: 30, maximumInARow: 1 },
			{ card: "juggernautUproot", weight: 25, maximumInARow: 1, chargeCost: 3 },
			{ card: "juggernautRoar", weight: 25, maximumInARow: 1, chargeCost: 2 },
			//The companion only pipes up while there is something to clean off him.
			{ card: "juggernautWhistle", weight: 25, maximumInARow: 1, condition: { index: "hasDebuff", of: "source" } },
			{ card: "juggernautAvalanche", weight: 30, maximumInARow: 1, chargeCost: 4 },
		],
	},

	{
		//>>> LANE E7 | tallyman | re-budget >>>
		//HE IS A FIRST-REGION BOSS NOW. Moved up to Act1-1 so each Act1-1 boss opens onto one route,
		//the single exception to RETOOL, DON'T RELOCATE.
		//He was WRITTEN as a second-region boss at 250 health, against the Matriarch's 205 and the Head
		//Gardener's 195. Left as he stood, one run in three would have opened on a first boss a fifth
		//tougher than the other two, in the act where a new player is still learning the game.
		//SCALED, NOT REWRITTEN: health only. His moves, their order, his phases and his identity are
		//untouched -- and his expected damage already measured inside the boss row, because the ledger
		//scales off stacks rather than off a flat number.
		//<<< LANE E7 | tallyman | re-budget <<<
		//>>> LANE E12 | shroud | black mold recast >>>
		//The clerk is cut, replaced by a reaper-like figure who is a mostly similar sentient colony of
		//black mold with a scythe.
		//THE SHROUD is one organism wearing the shape of a person. The robe is a hanging curtain of
		//mycelium, the scythe is a fruiting body it grew rather than a tool it picked up, and the two
		//lights where a face would be are the only part of it that looks back.
		//RETOOLED, NOT RELOCATED: index, role, health, phases, move list, weights and every number are
		//untouched, because indices are save data and the budget was measured on them. What moved is the
		//name, the species tag and the words -- his ledger mechanic re-reads as feeding with no edit to
		//a single effect: every card the party plays stirs the air, and when it has fed enough it fruits.
		//He also stops being an Act 2 intruder, which vacates the story bible's "somebody up there is
		//selling" answer to the armour question. The Scrap Salvager still carries that read alone.
		//<<< LANE E12 | shroud | black mold recast <<<
		index: "tallyman",
		name: "The Shroud",
		role: "boss",
		tagArray: ["plant", "boss", "spell"],
		//ART: a reaper's silhouette that is not a person. A tall hanging column of black mold, robe-shaped,
		//its hem breaking into loose threads that never resolve into feet; a hood over a void with two
		//pale spore-lights in it; and a long curved scythe of hardened black rot, GROWN from the body
		//rather than held, so the arm and the shaft are one piece. Sooty black and grey-green, and DRY
		//rather than wet -- the old water theme is gone with the clerk. Nothing on it is red or spotted:
		//fly agaric belongs to the Juggernaut's replacement drawing.
		//HC-PLACEHOLDER: the old drawing is the recoloured Bracket Elder and the first replacement pass
		//rendered a giant fly agaric, because the brief carried `myconid, mushroom head, red mushroom` in
		//its positive and `myconid, mushroom, cap, spores, fungal` in its negative at the same time.
		presentation: { scale: 0.95, anchor: "back" },
		baseHealth: 205,
		healthVariance: 0,
		isBoss: true,
		startingStatusArray: [{ status: "ledger", stacks: 1 }],
		moveStrategy: "threshold",
		goldReward: { minimum: 75, maximum: 105 },
		phaseArray: [
			{ atOrBelow: 0.50, moveArray: ["tallySlam", "tallyCollect", "tallyReckoning", "tallyInterest"] },
			{ atOrBelow: 1.00, moveArray: ["tallySlam", "tallyCollect", "tallyAudit", "tallyReckoning"] },
		],
		moveArray: [
			{ card: "tallySlam", weight: 40, maximumInARow: 2 },
			{ card: "tallyCollect", weight: 25, maximumInARow: 1 },
			{ card: "tallyAudit", weight: 20, maximumInARow: 1 },
			{ card: "tallyInterest", weight: 25, maximumInARow: 1 },
			//Heavily weighted: once charged, it almost always fruits.
			{ card: "tallyReckoning", weight: 90, maximumInARow: 1, chargeCost: 3 },
		],
	},
];

//---------------------------------------------------------------------------------------------------
//Encounter groups
//---------------------------------------------------------------------------------------------------
//Which enemies appear together, and at what point in a run. `tier` gates an encounter to a stretch of
//the map, so early rows stay survivable without hardcoding row numbers into enemy definitions.
//
//`isElite: true` puts an encounter in the ELITE pool rather than the ordinary one. An
//ELITE node rolls only from the elite pool and a combat node only from the ordinary pool, so the
//scavenger is a fight the player opts into by taking an elite path. See honeycomb.rollEncounter.
//
//`regionIndexArray` limits an encounter to those regions (0-based). Every line-up sums to
//within tuning.balance.varianceFraction of its group budget (rework/enemies/ENEMIES-01.md §2); the comment on
//each is its HP / full-strength damage per turn from enemy-template.js.
//
//`testFixture: true` keeps an encounter out of every roll. The engine tests fight these by name.
//`benched: true` keeps it out of every roll too, for the opposite reason: finished content held back
//from a build on purpose. Deleting the field ships it again and nothing else has to move.
honeycomb.encounterArray = [
	//--- Test fixtures: never rolled ---
	{
		index: "loneSporeling",
		name: "A Lone Sporeling",
		tier: "early",
		weight: 0,
		testFixture: true,
		enemyIndexArray: ["sporeling"],
	},
	{
		index: "sporePair",
		name: "Spore Pair",
		tier: "early",
		weight: 0,
		testFixture: true,
		enemyIndexArray: ["sporeling", "sporeling"],
	},

	//===== REGION 1, opening (group 49 HP / 13.9 dmg) =====
	//The first three rows of a run: one or two enemies, never three, so a starter deck that
	//drafted nothing yet has a fight it can win while it learns what it drew. See honeycomb.encounterTierArray
	//and `tuning.balance` for why these are smaller rather than just weaker.
	{ index: "looseSpores", name: "Loose Spores", tier: "opening", weight: 30, regionIndexArray: [0], enemyIndexArray: ["sporeling", "sporeling"] },
	{ index: "wispAndSpore", name: "Wisp and Spore", tier: "opening", weight: 30, regionIndexArray: [0], enemyIndexArray: ["gloomWisp", "sporeling"] },
	{ index: "leechAndSpore", name: "Leech and Spore", tier: "opening", weight: 30, regionIndexArray: [0], enemyIndexArray: ["moldLeech", "sporeling"] },
	{ index: "mothAndSpore", name: "Moth and Spore", tier: "opening", weight: 30, regionIndexArray: [0], enemyIndexArray: ["glowMoth", "sporeling"] },
	{ index: "theNursery", name: "The Nursery", tier: "opening", weight: 30, regionIndexArray: [0], enemyIndexArray: ["gardener", "gloomWisp"] },

	//===== REGION 1, early (group 63 HP / 16.6 dmg) =====
	{ index: "sporeTrio", name: "Spore Clutch", tier: "early", weight: 30, regionIndexArray: [0], enemyIndexArray: ["sporeling", "sporeling", "sporeling"] },
	{ index: "wispCluster", name: "Wisp Cluster", tier: "early", weight: 30, regionIndexArray: [0], enemyIndexArray: ["gloomWisp", "sporeling", "gloomWisp"] },
	{ index: "gardenersTend", name: "The Seed Bed", tier: "early", weight: 30, regionIndexArray: [0], enemyIndexArray: ["sporeling", "gardener", "sporeling"] },
	{ index: "puffPatch", name: "Puffcap Patch", tier: "early", weight: 30, regionIndexArray: [0], enemyIndexArray: ["puffcap", "gardener", "puffcap"] },
	{ index: "leechNest", name: "Leech Nest", tier: "early", weight: 30, regionIndexArray: [0], enemyIndexArray: ["moldLeech", "sporeling", "sporeling"] },
	{ index: "mothLight", name: "Moth Light", tier: "early", weight: 30, regionIndexArray: [0], enemyIndexArray: ["sporeling", "glowMoth", "gloomWisp"] },

	//===== REGION 1, middle (group 74 HP / 18.1 dmg) =====
	{ index: "bruteAndSpore", name: "Brute and Spores", tier: "middle", weight: 30, regionIndexArray: [0], enemyIndexArray: ["capBrute", "sporeling", "sporeling"] },
	{ index: "hollowPatrol", name: "Hollow Patrol", tier: "middle", weight: 30, regionIndexArray: [0], enemyIndexArray: ["hollowKnight", "gloomWisp", "sporeling"] },
	{ index: "sageAndWisps", name: "Elder and Wisps", tier: "middle", weight: 30, regionIndexArray: [0], enemyIndexArray: ["gloomWisp", "sage", "gloomWisp"] },
	{ index: "alchemistBench", name: "The Alchemist's Bench", tier: "middle", weight: 30, regionIndexArray: [0], enemyIndexArray: ["cordycepsHusk", "alchemist", "gardener"] },
	{ index: "barkWall", name: "The Bark Wall", tier: "middle", weight: 30, regionIndexArray: [0], enemyIndexArray: ["shield", "moldLeech", "sporeling"] },
	{ index: "huskShamble", name: "Guard Detail", tier: "middle", weight: 30, regionIndexArray: [0], enemyIndexArray: ["cordycepsHusk", "cordycepsHusk"] },
	{ index: "moldGarden", name: "The Damp Patch", tier: "middle", weight: 30, regionIndexArray: [0], enemyIndexArray: ["puffcap", "moldshaper", "gardener", "sporeling"] },

	//===== REGION 1, late (group 84 HP / 19.6 dmg) =====
	{ index: "hollowGuard", name: "The Hollow Guard", tier: "late", weight: 30, regionIndexArray: [0], enemyIndexArray: ["hollowKnight", "sporeling", "hollowKnight"] },
	{ index: "deepSwarm", name: "Deep Swarm", tier: "late", weight: 30, regionIndexArray: [0], enemyIndexArray: ["capBrute", "gloomWisp", "gloomWisp"] },
	{ index: "sageCouncil", name: "The Elder Ring", tier: "late", weight: 30, regionIndexArray: [0], enemyIndexArray: ["sage", "glowMoth", "sage"] },
	{ index: "labGuard", name: "Lab Guard", tier: "late", weight: 30, regionIndexArray: [0], enemyIndexArray: ["shield", "alchemist", "moldLeech"] },
	{ index: "bulwarkLine", name: "Bulwark Line", tier: "late", weight: 30, regionIndexArray: [0], enemyIndexArray: ["shield", "capBrute", "puffcap"] },
	{ index: "rotHost", name: "The Seeping Post", tier: "late", weight: 30, regionIndexArray: [0], enemyIndexArray: ["cordycepsHusk", "moldshaper", "cordycepsHusk"] },
	{ index: "leechPit", name: "Leech Pit", tier: "late", weight: 30, regionIndexArray: [0], enemyIndexArray: ["moldLeech", "glowMoth", "moldLeech"] },

	//===== REGION 2, early (group 122 HP / 22.3 dmg) =====
	{ index: "crawlerBed", name: "The Picket", tier: "early", weight: 30, regionIndexArray: [1], enemyIndexArray: ["siltCrawler", "siltCrawler", "siltCrawler"] },
	{ index: "eelShallows", name: "The Outpost", tier: "early", weight: 30, regionIndexArray: [1], enemyIndexArray: ["siltCrawler", "mireEel", "mireEel"] },
	{ index: "toadPond", name: "The Hook Line", tier: "middle", weight: 30, regionIndexArray: [1], enemyIndexArray: ["siltCrawler", "siltCrawler", "bogToad"] },
	{ index: "jellyDrift", name: "Lamps in the Dark", tier: "early", weight: 30, regionIndexArray: [1], enemyIndexArray: ["siltCrawler", "lanternJelly", "lanternJelly"] },

	//===== REGION 2, middle (group 135 HP / 23.8 dmg) =====
	{ index: "frontierPost", name: "The Frontier Post", tier: "middle", weight: 30, regionIndexArray: [1], enemyIndexArray: ["siltCrawler", "siltCrawler", "siltCrawler", "siltCrawler"] },
	{ index: "drownedPatrol", name: "The Long Patrol", tier: "middle", weight: 30, regionIndexArray: [1], enemyIndexArray: ["siltCrawler", "mireEel", "bogToad"] },
	{ index: "eelAndToad", name: "Cage and Hook", tier: "middle", weight: 30, regionIndexArray: [1], enemyIndexArray: ["mireEel", "mireEel", "lanternJelly"] },
	{ index: "jellyBloom", name: "Lamp and Guard", tier: "middle", weight: 30, regionIndexArray: [1], enemyIndexArray: ["siltCrawler", "mireEel", "lanternJelly"] },

	//===== REGION 2, late (group 135 HP / 23.8 dmg) =====
	{ index: "vaultGuard", name: "The Toll Post", tier: "late", weight: 30, regionIndexArray: [1], enemyIndexArray: ["siltCrawler", "siltCrawler", "bogToad"] },
	{ index: "eelNest", name: "The Cage Line", tier: "late", weight: 30, regionIndexArray: [1], enemyIndexArray: ["mireEel", "siltCrawler", "mireEel"] },
	{ index: "bruteRiot", name: "Brute Riot", tier: "late", weight: 30, regionIndexArray: [1], enemyIndexArray: ["mireEel", "lanternJelly", "lanternJelly"] },
	{ index: "drainingDark", name: "Leeches and Light", tier: "late", weight: 30, regionIndexArray: [1], enemyIndexArray: ["siltCrawler", "siltCrawler", "siltCrawler", "mireEel"] },

	//>>> LANE E7 | flora | encounters >>>
	//===== REGION 3: ACT1-B, THE THORN ARBOR =====
	//`regionIndexArray` holds POSITIONS in honeycomb.regionArray, not index strings -- honeycomb-map.js
	//builds it with indexOf. Act1-1 is [0], Act1-A is [1], the Thorn Arbor is [2].
	//Same depth as Act1-A, so the same group targets: early 122 HP / 26.8 dmg, middle and late 135 / 28.6.
	//Region 1's smaller bodies fill out a line-up here as they do in Act1-A.

	{ index: "floraSeedBed", name: "The Seed Bed", tier: "early", weight: 30, regionIndexArray: [2], enemyIndexArray: ["thornSprite", "wellspring", "thornSprite"] },
	{ index: "floraBellwalk", name: "The Bell Walk", tier: "early", weight: 30, regionIndexArray: [2], enemyIndexArray: ["trumpetBell", "thornSprite", "thornSprite"] },
	{ index: "floraWindfall", name: "The Windfall", tier: "early", weight: 30, regionIndexArray: [2], enemyIndexArray: ["thornSprite", "thornSprite", "thornFencer"] },
	{ index: "floraHedgerow", name: "The Hedgerow", tier: "early", weight: 30, regionIndexArray: [2], enemyIndexArray: ["thornFencer", "wellspring", "thornSprite"] },
	{ index: "floraDuellingGround", name: "The Duelling Ground", tier: "middle", weight: 30, regionIndexArray: [2], enemyIndexArray: ["thornFencer", "trumpetBell", "thornSprite"] },
	{ index: "floraOrchard", name: "The Orchard Rank", tier: "middle", weight: 30, regionIndexArray: [2], enemyIndexArray: ["thornSprite", "fruitAlraune", "thornFencer"] },
	{ index: "floraNightshade", name: "The Nightshade Patch", tier: "middle", weight: 30, regionIndexArray: [2], enemyIndexArray: ["trumpetBell", "wellspring", "thornSprite"] },
	{ index: "floraBriarLine", name: "The Briar Line", tier: "middle", weight: 30, regionIndexArray: [2], enemyIndexArray: ["thornSprite", "thornFencer", "thornSprite", "thornSprite"] },
	{ index: "floraDeepArbor", name: "The Deep Arbor", tier: "late", weight: 30, regionIndexArray: [2], enemyIndexArray: ["fruitAlraune", "thornFencer", "thornSprite"] },
	{ index: "floraBellChoir", name: "The Bell Choir", tier: "late", weight: 30, regionIndexArray: [2], enemyIndexArray: ["trumpetBell", "thornSprite", "trumpetBell"] },
	{ index: "floraCanopy", name: "Under the Canopy", tier: "late", weight: 30, regionIndexArray: [2], enemyIndexArray: ["thornFencer", "trumpetBell", "wellspring"] },
	{ index: "floraRootRoom", name: "The Root Room", tier: "late", weight: 30, regionIndexArray: [2], enemyIndexArray: ["wellspring", "trumpetBell", "thornFencer"] },
	//<<< LANE E7 | flora | encounters <<<

	//>>> LANE E7 | pollenRoad | encounters >>>
	//===== REGION 4: ACT1-C, THE POLLEN ROAD =====
	//Act1-1 is [0], Act1-A is [1], the Thorn Arbor is [2], the Pollen Road is [3].
	{ index: "pollenPicket", name: "The Standing Picket", tier: "early", weight: 30, regionIndexArray: [3], enemyIndexArray: ["soakcap", "argentFencer", "argentFencer"] },
	{ index: "pollenDrifts", name: "The Drifts", tier: "early", weight: 30, regionIndexArray: [3], enemyIndexArray: ["longwing", "argentFencer", "argentFencer"] },
	{ index: "pollenIdlers", name: "Nobody Getting Up", tier: "early", weight: 30, regionIndexArray: [3], enemyIndexArray: ["soakcap", "longwing", "argentFencer"] },
	{ index: "pollenRoadside", name: "The Roadside", tier: "early", weight: 30, regionIndexArray: [3], enemyIndexArray: ["argentFencer", "soakcap", "longwing"] },
	{ index: "pollenFencers", name: "Sable and Argent", tier: "middle", weight: 30, regionIndexArray: [3], enemyIndexArray: ["sableFencer", "argentFencer", "soakcap"] },
	{ index: "pollenCanopy", name: "Under the Wings", tier: "middle", weight: 30, regionIndexArray: [3], enemyIndexArray: ["longwing", "longwing", "argentFencer"] },
	{ index: "pollenBower", name: "The Bower", tier: "middle", weight: 30, regionIndexArray: [3], enemyIndexArray: ["longwing", "argentFencer", "soakcap"] },
	{ index: "pollenSprawl", name: "The Sprawl", tier: "middle", weight: 30, regionIndexArray: [3], enemyIndexArray: ["sableFencer", "argentFencer", "argentFencer"] },
	{ index: "pollenDeepRoad", name: "The Deep Road", tier: "late", weight: 30, regionIndexArray: [3], enemyIndexArray: ["sableFencer", "argentFencer", "soakcap"] },
	{ index: "pollenBathhouse", name: "The Steeping Pools", tier: "late", weight: 30, regionIndexArray: [3], enemyIndexArray: ["soakcap", "longwing", "argentFencer"] },
	{
		//THE ROUTE'S ONLY TANK, AND THE ONE LINE-UP THAT HOLDS IT. Rebuilding the Pollen
		//Road out of its own roster dropped the Mantlewing from every fight, which would have taken an
		//enemy out of the game. It is 85 health against a group budget of 135, and the route's lightest
		//body is the Argent Fencer at 45, so no native group carrying it lands inside varianceFraction:
		//this one is 175 health against 135, which the audit marks high. Kept over-budget on purpose,
		//because an enemy nobody can meet is worse than a fight that runs long. The Pollen Road wanting a
		//minion is the real finding -- see `!designDocs/honeycomb/enemy_overhaul/ROUTE-IDENTITY.md`.
 index: "pollenHighDrift", name: "The High Drift", tier: "late", weight: 30, regionIndexArray: [3], enemyIndexArray: ["mantlewing", "argentFencer", "argentFencer"] },
	{ index: "pollenLastMile", name: "The Last Mile", tier: "late", weight: 30, regionIndexArray: [3], enemyIndexArray: ["sableFencer", "longwing", "argentFencer"] },

	//----- elites. A route with no elite pool falls back to its NORMAL pool, so a skull node there
	//----- quietly serves an ordinary fight; every route needs its own. -----
	{ index: "floraCache", name: "The Root Cache", tier: "middle", weight: 50, isElite: true, regionIndexArray: [2], enemyIndexArray: ["scavenger", "trumpetBell"] },
	{ index: "floraStripped", name: "The Stripped Bower", tier: "late", weight: 50, isElite: true, regionIndexArray: [2], enemyIndexArray: ["scavenger", "fruitAlraune"] },
	{ index: "pollenCache", name: "The Roadside Cache", tier: "middle", weight: 50, isElite: true, regionIndexArray: [3], enemyIndexArray: ["scavenger", "longwing"] },
	{ index: "pollenStripped", name: "Something Worth Taking", tier: "late", weight: 50, isElite: true, regionIndexArray: [3], enemyIndexArray: ["scavenger", "argentFencer"] },
	//<<< LANE E7 | pollenRoad | encounters <<<

	//----- elites: regions 0 and 1 -----
	{ index: "scavengerAlone", name: "The Kobold Scavenger", tier: "middle", weight: 50, isElite: true, regionIndexArray: [0], enemyIndexArray: ["scavenger"] },
	{ index: "championAlone", name: "The Hollow Champion", tier: "middle", weight: 50, isElite: true, regionIndexArray: [0], enemyIndexArray: ["hollowChampion"] },
	{ index: "scavengerCache", name: "The Scavenger's Cache", tier: "late", weight: 50, isElite: true, regionIndexArray: [0], enemyIndexArray: ["scavenger", "puffcap"] },
	{ index: "championGuard", name: "The Champion's Guard", tier: "late", weight: 50, isElite: true, regionIndexArray: [0], enemyIndexArray: ["sporeling", "hollowChampion"] },
	{ index: "scavengerSalvage", name: "The Salvage Boss", tier: "middle", weight: 50, isElite: true, regionIndexArray: [1], enemyIndexArray: ["scavenger", "siltCrawler"] },
	{ index: "championDuel", name: "The Cage Duel", tier: "middle", weight: 50, isElite: true, regionIndexArray: [1], enemyIndexArray: ["hollowChampion", "mireEel"] },
	{ index: "scavengerDeep", name: "The Deep Cache", tier: "late", weight: 50, isElite: true, regionIndexArray: [1], enemyIndexArray: ["scavenger", "lanternJelly"] },
	//BENCHED FOR THE PTR. These are the Scrap Salvager's only two encounters, so benching them takes
	//him off the maps without cutting him -- which this workstream's law forbids.
	//WHY: his sprite is the Kobold Scavenger's drawing hue-shifted, and the Scavenger stands in the SAME
	//region-1 elite pool (The Salvage Boss, The Deep Cache), so two elite nodes in one run could show the
	//same drawing in two colours, which reads as a lazy recolor.
	//TO SHIP HIM AGAIN: delete the `benched: true` from these two rows. Nothing else. The fix that makes
	//that worth doing is one drawing -- the brief is already written at
	//`D:\honeycomb spare art6-09-2413 spire png\enemies\_workbench/drownedSalvager.txt`.
	//The pool is left at four entries, so no elite node in region 1 goes unfilled.
	{ index: "salvagerCrew", name: "The Salvage Crew", tier: "middle", weight: 50, isElite: true, benched: true, regionIndexArray: [1], enemyIndexArray: ["drownedSalvager", "siltCrawler"] },
	{ index: "salvagerDeep", name: "The Stripped Grove", tier: "late", weight: 50, isElite: true, benched: true, regionIndexArray: [1], enemyIndexArray: ["drownedSalvager", "mireEel"] },
	{ index: "championDeep", name: "The Champion's Line", tier: "late", weight: 50, isElite: true, regionIndexArray: [1], enemyIndexArray: ["hollowChampion", "siltCrawler"] },

	//----- bosses. Each region names its own in honeycomb.regionArray. -----
	{ index: "matriarchLair", name: "The Matriarch's Lair", tier: "boss", weight: 100, enemyIndexArray: ["matriarch"], reinforcementArray: ["sporeling"], victoryConditionArray: [{ index: "leadersBeaten", indexArray: ["matriarch"], text: "The Matriarch is beaten, and her brood scatters." }] },
	{ index: "gardenerGrove", name: "The Overgrown Grove", tier: "boss", weight: 100, enemyIndexArray: ["headGardener"], reinforcementArray: ["gardener"], victoryConditionArray: [{ index: "leadersBeaten", indexArray: ["headGardener"], text: "The Head Gardener falls, and the garden goes still." }] },
	{ index: "juggernautHollow", name: "The Juggernaut's Hollow", tier: "boss", weight: 100, enemyIndexArray: ["juggernaut"], reinforcementArray: ["gardener"], victoryConditionArray: [{ index: "leadersBeaten", indexArray: ["juggernaut"], text: "The Juggernaut drops his log, and the way down is open." }] },
	{ index: "tallyLedger", name: "The Damp Room", tier: "boss", weight: 100, enemyIndexArray: ["tallyman"], reinforcementArray: ["sporeling"], victoryConditionArray: [{ index: "leadersBeaten", indexArray: ["tallyman"], text: "The Shroud comes off the walls in sheets, and the air is only air again." }] },
	{ index: "arborTwins", name: "The Sisters in the Arbor", tier: "boss", weight: 100, enemyIndexArray: ["arborSisterDay", "arborSisterNight"], reinforcementArray: ["thornSprite"] },
	{ index: "drayRoad", name: "The End of the Road", tier: "boss", weight: 100, enemyIndexArray: ["paleDray"], reinforcementArray: ["soakcap"], victoryConditionArray: [{ index: "leadersBeaten", indexArray: ["paleDray"], text: "The Pale Dray sits down in the pollen, still pleased, and the road is clear." }] },

	//>>> LANE ANA | gauntlet | encounters >>>
	//Four fights in a straight line: Celestial normal, Infernal normal, rest, Infernal elite, rest,
	//Celestial elite (which includes Anastasia). Six enemies is too much for the screen, so four per
	//battle (five for the finale), with starting strength and tHP to buff them to balance.
	//
	//The order is the region's `rowPlanArray` (honeycomb-content-map.js), not a roll -- there is nothing
	//to choose on a corridor. Nine rows of rolled line-ups became six rows of written ones.
	//
	//AND BOTH COLOURS ARE HERE NOW. Every line-up used to be Infernal, which was never said out loud and
	//meant half her board was something the player never fought. The Celestial fights open and close it.
	//
	//FOUR BODIES, NOT SIX. The pieces are small (10-30 HP) because their numbers are also her own board's,
	//so a shorter line has to be bought back with the fight's own buffs rather than with bigger pieces:
	//`enemyStartingStatusArray` for Strength and `enemyStartingTemporaryHealth` for the wall. Both are on
	//the ENEMY side only and never on her own board, which is the whole point of the seam.
	{ index: "gauntletWhiteOpening", name: "The White Opening", tier: "early", weight: 30, regionIndexArray: [4], sealedBy: "anastasia",
		enemyStartingStatusArray: honeycomb.tuning.chessmaster.gauntlet.lineUpStatusArray,
		enemyStartingTemporaryHealth: honeycomb.tuning.chessmaster.gauntlet.lineUpTemporaryHealth,
		//ORDER IS PART OF THE COMPOSITION. The Knight's Relay reads the intent of the piece BEHIND it, so
		//it is put in front of the Rook: behind a Bishop, whose every move is a shield, Relay reads zero
		//and the piece is a blank. Measured before the swap: 4 damage on a shield turn, 16 on a blow turn.
		enemyIndexArray: ["celestialPawn", "celestialPawn", "celestialKnight", "celestialRook"] }, //66 HP
	{ index: "gauntletBlackReply", name: "The Black Reply", tier: "middle", weight: 30, regionIndexArray: [4], sealedBy: "anastasia",
		enemyStartingStatusArray: honeycomb.tuning.chessmaster.gauntlet.lineUpStatusArray,
		enemyStartingTemporaryHealth: honeycomb.tuning.chessmaster.gauntlet.lineUpTemporaryHealth,
		enemyIndexArray: ["infernalPawn", "infernalKnight", "infernalBishop", "infernalRook"] }, //70 HP
	//----- THE ELITE: A WHITE LINE WITH ONE BLACK QUEEN IN IT -- "Drawn to Evil."
	//----- The name is what the fight DOES. Her fourth move is Defection -- every allied Celestial piece
	//----- is inverted -- so on turn four the whole line turns black at once, and the three Celestial
	//----- pieces the party has spent the fight reading stop being the pieces it was reading.
	//----- Her fifth is the King himself rather than a card that calls him.
	{ index: "gauntletDrawnToEvil", name: "Drawn to Evil", tier: "late", weight: 50, isElite: true, regionIndexArray: [4], sealedBy: "anastasia",
		enemyStartingStatusArray: honeycomb.tuning.chessmaster.gauntlet.eliteStatusArray,
		enemyStartingTemporaryHealth: honeycomb.tuning.chessmaster.gauntlet.eliteTemporaryHealth,
		//The Bishop is a second Rook, at his word -- two walls and a Knight, all white, and her.
		enemyIndexArray: ["celestialKnight", "celestialRook", "celestialRook", "gauntletInfernalQueen"] }, //96 HP

	{
		//THE FINALE: THE CELESTIAL ELITE, AND SHE IS IN IT. Five bodies, the only fight in the gauntlet
		//that is not four. She stands at
		//the BACK of her line, behind the pieces, as a grandmaster does. BEATING HER WINS, whatever of her
		//board still stands -- and beating her is the only thing in the game that writes her into a
		//profile's character ledger (`victoryUnlockArray`, granted by honeycomb.combat.finishVictory).
		index: "gauntletGrandmaster",
		name: "The Last Board",
		tier: "boss",
		weight: 100,
		sealedBy: "anastasia",
		//HER OPENING BUFFS: a flat boost to damage and defense through first-turn buffs, now Strength and
		//a wall rather than Strength and Plated. The arithmetic is on
		//tuning.chessmaster.gauntlet.
		enemyStartingStatusArray: honeycomb.tuning.chessmaster.gauntlet.bossStatusArray,
		enemyStartingTemporaryHealth: honeycomb.tuning.chessmaster.gauntlet.bossTemporaryHealth,
		enemyIndexArray: ["celestialKnight", "celestialBishop", "celestialRook", "gauntletCelestialQueen", "gauntletAnastasia"],
		victoryConditionArray: [
			{ index: "leadersBeaten", indexArray: ["gauntletAnastasia"], text: "Anastasia tips her king, and the board goes still." },
		],
		victoryUnlockArray: [{ kind: "character", index: "anastasia" }],
	},
	//<<< LANE ANA | gauntlet | encounters <<<
];

//Which tier a map row belongs to. Expressed as fractions of the region's depth so a longer or shorter
//region needs no rebalancing here.
//The opening tier. The very early game is too difficult with a fresh, undrafted deck, so early-region
//fights get their own easier band rather than sharing one pool with everything else.
//
//Every region-1 fight at the `early` tier was three enemies summing to the same budget, so the first
//fight of a run was the same size as the seventh. The opening band holds one- and two-enemy line-ups
//instead.
//
//It covers rows 0 to 5 of an 18-row region. `tuning.map.firstRowNodeType` makes row 0 a rest, so row 0
//holds no fight and the band is six rows that contain
//five fighting ones. The other three bands were widened to match rather than being squeezed out: early
//takes rows 6 to 9, middle 10 to 13, late 14 to the boss.
//
//A REGION WITH NO OPENING CONTENT IS NOT BROKEN BY THIS: honeycomb.rollEncounter steps DOWN this list
//when a tier is empty, so a region that has only early/middle/late fights gets its early ones at row
//zero, exactly as before. Order in this array is the order it steps through.
honeycomb.encounterTierArray = [
	{ index: "opening", untilDepthFraction: 0.30 },
	{ index: "early", untilDepthFraction: 0.53 },
	{ index: "middle", untilDepthFraction: 0.77 },
	{ index: "late", untilDepthFraction: 1.00 },
];

honeycomb.encounterTierForDepth = function (rowIndex, rowCount) {
	var fraction = rowCount <= 1 ? 1 : rowIndex / (rowCount - 1);
	for (var tierIndex = 0; tierIndex < honeycomb.encounterTierArray.length; tierIndex++) {
		if (fraction <= honeycomb.encounterTierArray[tierIndex].untilDepthFraction) {
			return honeycomb.encounterTierArray[tierIndex].index;
		}
	}
	return honeycomb.encounterTierArray[honeycomb.encounterTierArray.length - 1].index;
};

//Picks an encounter for a tier from the encounter stream.
//  options.elite   true rolls only the elite pool, false (the default) only the ordinary one. This is
//                  how an ELITE map node differs from a combat node: the two do not share a pool.
//If a pool is empty at that tier the pick widens -- first to the same pool at any tier, then to any
//encounter of that tier -- so a region with no elite content is never left without a fight.
honeycomb.rollEncounter = function (tierIndex, options) {
	var wantElite = options != null && options.elite == true;
	var regionIndex = options == null || options.regionIndex == null || options.regionIndex < 0 ? null : options.regionIndex;
	//Region pools: `regionIndexArray` on an encounter limits it to those regions (0-based, in
	//honeycomb.regionArray order). Omitted means every region.
	function inRegion(encounter) {
		return regionIndex == null || encounter.regionIndexArray == null || encounter.regionIndexArray.indexOf(regionIndex) >= 0;
	}
	//A test fixture is never rolled: the engine tests fight it by name.
	//`benched: true` also keeps an encounter out of every roll, but says something else:
	//the content is finished and deliberately held back from a build. Deleting the field ships it again.
	function rollable(encounter) {
		return encounter.testFixture != true && encounter.benched != true;
	}
	function matchesPool(encounter, elite) {
		return (encounter.isElite == true) == elite && inRegion(encounter) && rollable(encounter);
	}
	//The tier steps down before it widens. A region with no `opening` content asks for the
	//`early` one next, rather than falling straight through to "any fight in this region at any tier" --
	//which would put a late fight on row zero. The order is honeycomb.encounterTierArray's own.
	function encountersAt(tierName) {
		var atTier = [];
		for (var tierScan = 0; tierScan < honeycomb.encounterArray.length; tierScan++) {
			var candidate = honeycomb.encounterArray[tierScan];
			if (candidate.tier == tierName && matchesPool(candidate, wantElite)) atTier.push(candidate);
		}
		return atTier;
	}
	var stepArray = [];
	var askedAt = -1;
	for (var orderIndex = 0; orderIndex < honeycomb.encounterTierArray.length; orderIndex++) {
		if (honeycomb.encounterTierArray[orderIndex].index == tierIndex) askedAt = orderIndex;
	}
	if (askedAt >= 0) {
		for (var stepIndex = askedAt; stepIndex < honeycomb.encounterTierArray.length; stepIndex++) {
			stepArray.push(honeycomb.encounterTierArray[stepIndex].index);
		}
	}

	var candidateArray = [];
	var tierArray = [];
	for (var scanIndex = 0; scanIndex < honeycomb.encounterArray.length; scanIndex++) {
		var encounter = honeycomb.encounterArray[scanIndex];
		if (encounter.tier != tierIndex) continue;
		if (inRegion(encounter) && rollable(encounter)) tierArray.push(encounter);
		if (matchesPool(encounter, wantElite)) candidateArray.push(encounter);
	}
	for (var walkIndex = 1; walkIndex < stepArray.length && candidateArray.length === 0; walkIndex++) {
		candidateArray = encountersAt(stepArray[walkIndex]);
	}
	if (candidateArray.length === 0) {
		for (var poolIndex = 0; poolIndex < honeycomb.encounterArray.length; poolIndex++) {
			if (matchesPool(honeycomb.encounterArray[poolIndex], wantElite)) candidateArray.push(honeycomb.encounterArray[poolIndex]);
		}
	}
	if (candidateArray.length === 0) candidateArray = tierArray;
	return honeycomb.rng.pickWeighted(honeycomb.tuning.rng.streamArray.encounter, candidateArray);
};
