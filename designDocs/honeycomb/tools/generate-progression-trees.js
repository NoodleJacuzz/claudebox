//===================================================================================================
//HONEYCOMB -- progression tree generator
//===================================================================================================
//Turns the agreed universal skeleton (`!designDocs/skeletons/wip.json`) into the six character trees
//in honeycomb-content-characters.js. The skeleton owns SHAPE (x/y, requires, exclusivity, ranks); this
//file owns per-character CONTENT (names, descriptions, the effects the engine already supports).
//
//  node "!designDocs/honeycomb/tools/generate-progression-trees.js"          write the six trees
//  node "!designDocs/honeycomb/tools/generate-progression-trees.js" --report print, do not write
//
//Effects whose engine verb does not exist yet are intentionally left off; the description carries the
//intent until the mechanic lands. See SKELETON-MAPPING.md and TREE-EXP-MATH.md.
//
//===================================================================================================
//DO NOT RUN THIS WITHOUT DIFFING WHAT IT WROTE. IT IS STALE. (session 55)
//===================================================================================================
//This file has not been kept level with the hand edits made to the trees since it last ran, and a run
//REPLACES each character's whole `nodeArray`, so every one of those edits is silently reverted. Session
//55 ran it to reprice one field and lost four pieces of content in the same second:
//
//  briCex3    "Counterguard" went back to "Taunt". The retort hook and `retortStacks` were deleted and
//             `firstHitTaunt: true` came back, so Brienne's session-31 core loop stopped existing. The
//             suite caught it -- ONE check, in block [98].
//  briAbility1  Aegis's description went back to the pre-session-47 wording.
//  casAbility1  Cassadora's mechanic went back to being called "Foresight" rather than "Orb".
//  clmAbility2  One with Nothing's life cost went back to the full amount from half.
//
//THREE OF THOSE FOUR HAD NO TEST AT ALL, so a green suite would not have said. Reprice or reword a node
//by editing honeycomb-content-characters.js directly, and use --report here to see what this file
//THINKS the trees are. Before making it authoritative again, someone has to walk the diff and fold
//every hand edit back into the tables above.

const fs = require("fs");
const path = require("path");

const SKELETON_FILE = path.resolve(__dirname, "..", "..", "skeletons", "wip.json");
const CONTENT_FILE = path.resolve(__dirname, "..", "..", "..", "scripts", "misc", "honeycomb", "honeycomb-content-characters.js");

//---------------------------------------------------------------------------------------------------
//Intended TOTAL node cost by skeleton label. A ranked node's per-rank `cost` is total / ranks, so a
//node's full price is the same however it is split (Noodle). Tiers: cheap 75 / standard 150 / costly 300.
//---------------------------------------------------------------------------------------------------
const COST = {
	"Start": 150, "A1": 150, "A2": 300,
	"ATT1": 150, "ATT2": 150, "ATT3": 150,
	"DEF1": 150, "DEF2": 150, "DEF3": 150,
	"W1": 150, "W2": 150, "W3": 150,
	"+A.": 150, "-A.": 150, "R.A.": 150,
	"+D.": 150, "-D.": 150, "R.D.": 150,
	"C.Ex.1": 75, "C.Ex.2": 75, "C.Ex.3": 75,
	"Rest1": 150, "Rest2": 300, "Rest-A": 150, "Rest-B": 150,
	"XP": 75, "Col": 75, "New": 75, "Cheap": 75,
	"Reroll1": 150, "Reroll2": 150, "Banish1": 300, "Banish2": 150,
	"Gold": 150, "OpenD": 150, "OpenE": 150,
	"Boun1": 150, "Boun2": 150, "Shop1": 150, "Shop2": 150,
	"U1": 150, "U2": 300, "Fort": 0,
};

//VIGOUR'S WHOLE NODE COSTS THIS, however many ranks it splits into. Session 55, Noodle: "One rank of
//Vigor on Brienne should not cost the same as a rank of it on Nettle, since brienne has 6 ranks, it
//should cost 4 exp." 25 / 6 ranks rounds to 4, which is his number.
//
//THIS REVERSES HALF OF FEEDBACK-08, WHICH IS WHY ITS REASONING IS KEPT HERE. That round made Vigour
//cost a flat 25 PER RANK so a one-rank Vigour would not cost six ranks' worth of experience for 5 Max
//HP. It fixed Nettle and left Brienne paying 150 for the same node. Pricing the NODE at 25 and dividing
//satisfies both: Nettle's one rank still costs 25, and Brienne's six cost 4 each.
const START_TOTAL_COST = 25;

//Exclusive group per label family (null = not exclusive). Groups must be per character.
const GROUP = {
	"ATT1": "AttPath", "ATT2": "AttPath", "ATT3": "AttPath",
	"DEF1": "DefPath", "DEF2": "DefPath", "DEF3": "DefPath",
	"W1": "WheelPath", "W2": "WheelPath", "W3": "WheelPath",
	"OpenD": "OpenPath", "OpenE": "OpenPath",
	"Boun1": "BounPath", "Boun2": "BounPath",
	"Shop1": "ShopPath", "Shop2": "ShopPath",
	"Rest-A": "RestPath", "Rest-B": "RestPath",
	"U1": "OutfitPath", "U2": "OutfitPath",
	"+A.": "ExtraAttack", "-A.": "ExtraAttack",
	"+D.": "ExtraDefence", "-D.": "ExtraDefence",
};

//Index suffix per label.
const SUFFIX = {
	"Start": "Start", "A1": "Ability1", "A2": "Ability2",
	"ATT1": "Att1", "ATT2": "Att2", "ATT3": "Att3",
	"DEF1": "Def1", "DEF2": "Def2", "DEF3": "Def3",
	"W1": "Wheel1", "W2": "Wheel2", "W3": "Wheel3",
	"+A.": "ExtraAttack", "-A.": "TrimAttack", "R.A.": "ReplaceAttack",
	"+D.": "ExtraDefence", "-D.": "TrimDefence", "R.D.": "ReplaceDefence",
	"C.Ex.1": "Cex1", "C.Ex.2": "Cex2", "C.Ex.3": "Cex3",
	"Rest1": "Rest1", "Rest2": "Rest2", "Rest-A": "RestA", "Rest-B": "RestB",
	"XP": "Xp", "Col": "Col", "New": "New", "Cheap": "Cheap",
	"Reroll1": "Reroll1", "Reroll2": "Reroll2", "Banish1": "Banish1", "Banish2": "Banish2",
	"Gold": "Gold", "OpenD": "OpenD", "OpenE": "OpenE",
	"Boun1": "Boun1", "Boun2": "Boun2", "Shop1": "Shop1", "Shop2": "Shop2",
	"U1": "U1", "U2": "U2", "Fort": "Fort",
};

//The printed name of every rest-site option a Rest1/Rest2 node may name, so the node text says which
//function it unlocks rather than "this character's function" (Noodle, round 07).
const REST_NAME = {
	preptime: "Preptime", laundry: "Laundry", treatment: "Treatment", exercise: "Exercise",
	fortuneTelling: "Fortune Telling", scavenge: "Scavenge", journal: "Journal",
	gamble: "Gamble", duplicate: "Duplicate", mailOrder: "Mail Order",
};

//---------------------------------------------------------------------------------------------------
//Generic node content, shared by every character. `effect` builds the supported fields from the
//character's own indices.
//---------------------------------------------------------------------------------------------------
//Descriptions state the ACTUAL amount (Noodle, session 27), not "more often" / "higher". Keep these in
//step with the fields nodeContent sets.
const GENERIC = {
	"XP": { name: "Veteran", description: "While in the party, gain 1.5x personal experience." },
	"Col": { name: "Collector", description: "While in the party, unseen events and items appear 50% more often." },
	"New": { name: "New Blood", description: "While in the party, this character's unseen cards appear 50% more often." },
	"Cheap": { name: "Window Shopping", description: "While in the party, outfits and common relics cost 10% less in the shop." },
	"Reroll1": { name: "Second Chance", description: "One reward reroll per run while in the party." },
	"Reroll2": { name: "Second Chance, Always", description: "Adds 1 reroll to every run, whether or not this character is in the party." },
	"Banish1": { name: "Banish", description: "Banish one card from this run's reward, shop and journal pools while in the party." },
	"Banish2": { name: "Banish, Always", description: "Adds 1 banish to every run, whether or not this character is in the party." },
	"Gold": { name: "Deep Pockets", description: "While in the party, +5 gold at run start per rank." },
	"OpenD": { name: "Head Start", description: "While in the party, turn 1: +1 card drawn, -1 energy." },
	"OpenE": { name: "Fast Start", description: "While in the party, turn 1: +1 energy, -1 card drawn." },
	"Boun1": { name: "Plunder", description: "While in the party, bosses and elites pay 25% more gold." },
	"Boun2": { name: "Spoils", description: "While in the party, bosses and elites offer 1 extra card choice." },
	"Shop1": { name: "Haggler", description: "While in the party, cards cost 10% less in the shop." },
	"Shop2": { name: "Wider Shelves", description: "While in the party, the shop offers 1 more card and 1 more relic option." },
	"Rest1": { name: "Lay of the Land", description: "Unlocks this character's rest-site function while they are in the party." },
	"Rest2": { name: "Lay of the Land, Always", description: "The rest-site function stays unlocked even when this character is benched." },
	"Rest-A": { name: "Field Rations", description: "One more action when you reach a rest site." },
	"Rest-B": { name: "Sound Sleep", description: "Sleep heals an extra 15% of maximum health." },
	"U1": { name: "Sister Wardrobe", description: "While in the party, this character's worn outfit adds twice as many cards." },
	"U2": { name: "Tailored", description: "While in the party, this character's worn outfit cards start upgraded." },
	"Fort": { name: "Fortitude", description: "Lust weakness ranks do not build." },
};

//---------------------------------------------------------------------------------------------------
//Per-character content. `att` is the character's Exclusive A paths, `def` Exclusive D, `wheels` the
//training wheels, `cex` the character-specific chain. Rank counts live here (ATT per character; DEF is
//never ranked). `noDef` drops the whole DEF branch and repoints Rest2 at the bounty nodes.
//---------------------------------------------------------------------------------------------------
const CHARACTER = {
	brienne: {
		marker: "knight", prefix: "bri", startRanks: 6, rest: "preptime", characterName: "Brienne", mechanic: "Resolve",
		ability1: { name: "Dig In", description: "Gain 12 Temporary HP. Once per combat.", ability: "brienneBrace" },
		ability2: { name: "Aegis", description: "Spend all Resolve; the party gains that much Temporary HP; end the turn.", ability: "brienneAegis" },
		attack: "brienneCleave", attackName: "Sword Strike", defence: "brienneGrit", defenceName: "Brace", attRanks: 3,
		att: [
			{ name: "Gold", description: "Sword Strike gains 2 Temporary HP per rank.", starterUpgradeArray: [{ card: "brienneCleave", addEffectArray: [{ index: "temporaryHealth", amount: 2, targetOverride: "owner" }] }] },
			{ name: "Steel", description: "Sword Strike deals 2 more damage per rank while Brienne has Temporary HP.",
				starterUpgradeArray: [{ card: "brienneCleave", addEffectArray: [{ index: "damage", amount: 2,
					condition: { index: "compare", left: { index: "stat", of: "source", stat: "temporaryHealth", label: "Temporary HP" }, operation: "greaterOrEqual", right: 1 } }] }] },
			{ name: "Bond", description: "Sword Strike soothes 2 more per rank.", starterUpgradeArray: [{ card: "brienneCleave", addEffectArray: [{ index: "soothe", amount: 2, targetOverride: "owner" }] }] },
		],
		def: [
			{ name: "Set Stance", description: "Brace becomes: choose one - gain 6 Temporary HP and move to the front, or soothe 6.",
				starterUpgradeArray: [{ card: "brienneGrit", replaceEffectArray: [{
					index: "chooseOption", prompt: "Set Stance how?", optionArray: [
						{ index: "hold", name: "Hold", description: "Gain 6 Temporary HP and move to the front.",
							effectArray: [{ index: "temporaryHealth", amount: 6 }, { index: "shiftParty", shift: "front", targetOverride: "owner" }] },
						{ index: "soothe", name: "Breathe", description: "Remove 6 Lust.",
							effectArray: [{ index: "soothe", amount: 6 }] },
					] }] }] },
			{ name: "Lend", description: "Brace becomes: choose one - gain 6 Temporary HP, or another ally gains 10 Temporary HP.",
				starterUpgradeArray: [{ card: "brienneGrit", replaceEffectArray: [{
					index: "chooseOption", prompt: "Hold or lend?", optionArray: [
						{ index: "hold", name: "Keep It", description: "Gain 6 Temporary HP.",
							effectArray: [{ index: "temporaryHealth", amount: 6 }] },
						{ index: "lend", name: "Lend It", description: "Another ally gains 10 Temporary HP.",
							effectArray: [{ index: "chooseAlly", prompt: "Lend to whom?",
								effectArray: [{ index: "temporaryHealth", amount: 10 }] }] },
					] }] }] },
			{ name: "Brace", description: "Brace becomes: choose one - gain 6 Temporary HP, or gain 2 Strength this turn.",
				starterUpgradeArray: [{ card: "brienneGrit", replaceEffectArray: [{
					index: "chooseOption", prompt: "Hold or set?", optionArray: [
						{ index: "hold", name: "Hold", description: "Gain 6 Temporary HP.",
							effectArray: [{ index: "temporaryHealth", amount: 6 }] },
						{ index: "set", name: "Set", description: "Gain 2 Strength this turn.",
								effectArray: [{ index: "applyStatus", status: "fleetingStrength", stacks: 2 }] },
					] }] }] },
		],
		wheels: [
			{ name: "Spend", description: "Dig In becomes: lose 6 Temporary HP, draw 2.",
				abilityUpgradeArray: [{ ability: "brienneBrace", disableMechanic: true,
					effectArray: [{ index: "removeTemporaryHealth", amount: 6, targetOverride: "owner" }, { index: "drawCards", amount: 2 }] }] },
			{ name: "Swing", description: "Dig In becomes: lose all Temporary HP, deal that much.",
				//Aimed at an enemy: Dig In itself targets Brienne, so the swing names its own target (AUDIT-01).
				abilityUpgradeArray: [{ ability: "brienneBrace", disableMechanic: true, targetMode: "enemy",
					text: "Spend all your Temporary HP. Deal that much damage.",
					requirementArray: [{ condition: { index: "compare", left: { index: "stat", of: "source", stat: "temporaryHealth" }, operation: "greaterOrEqual", right: 1 }, text: "Needs Temporary HP." }],
					effectArray: [{ index: "spendTemporaryHealth", all: true, targetOverride: "owner" },
						{ index: "damage", amount: { index: "tally", key: "temporarySpent" } }] }] },
			//FEEDBACK-08: soothe 8 alone was far too weak for a wheel node. 10 Lust plus a full cleanse
			//is a real answer to a debuff turn, and is still cheaper than the 20 Noodle judged safe.
			{ name: "Vow", description: "Dig In becomes: soothe 10, remove all negative statuses, and gain no Temporary HP.",
				abilityUpgradeArray: [{ ability: "brienneBrace", disableMechanic: true,
					effectArray: [{ index: "soothe", amount: 10, targetOverride: "owner" },
						{ index: "cleanse", targetOverride: "owner" }] }] },
		],
		cex: [
			{ name: "Hold Fast", description: "Turn 1: gain 5 Temporary HP.",
				hooks: { onCombatStart: function (params) { honeycomb.grantTemporaryHealth(params.entity, 5, params.context); } } },
			{ name: "Vanguard", description: "Combat start: gain 4 Temporary HP if Brienne is in front.",
				hooks: { onCombatStart: function (params) { if (honeycomb.entityRank(params.entity, params.context.combat) === 0) honeycomb.grantTemporaryHealth(params.entity, 4, params.context); } } },
			{ name: "Taunt", description: "The first attack each combat is drawn to Brienne.", firstHitTaunt: true },
		],
	},
	nettle: {
		marker: "necro", prefix: "net", startRanks: 1, rest: "journal", characterName: "Nettle", mechanic: "Harvest",
		ability1: { name: "Blight", description: "Inflict Poison for each Soul, without spending them. Once per rest.", ability: "nettleBlight" },
		ability2: { name: "Undead Army", description: "Spend all Souls; deal 1 damage at random for each Soul spent.", ability: "nettleGraveward" },
		attack: "nettleVenomTouch", attackName: "Wither", defence: "nettleLastRites", defenceName: "Last Rites", attRanks: 2,
		att: [
			{ name: "Wither", description: "Wither: -2 damage and +1 Poison per rank; at the last rank it deals no damage and reads as pure negative.", starterUpgradeArray: [{ card: "nettleVenomTouch", effect: "damage", amount: -2, negativeIfZeroDamage: true }, { card: "nettleVenomTouch", effect: "applyStatus", status: "poison", stacks: 1 }] },
			//ACID AND CLOUD REWRITE THE BASIC rather than layering onto it: Acid swaps Poison for Weak, Cloud
			//hits every enemy. `replaceEffectArray` resets the card, then the per-rank deltas scale it, so
			//the numbers land exactly on STARTER-LIST's "deal 2, 2 Weak → 3 Weak" and "2, 1 Poison → 2".
			{ name: "Acid", description: "Wither becomes its Weak form: deal 2 and apply 2 Weak; each rank adds 1 Weak and removes 2 damage.",
				starterUpgradeArray: [{ card: "nettleVenomTouch", negativeIfZeroDamage: true,
					replaceEffectArray: [{ index: "damage", amount: 4 }, { index: "applyStatus", status: "weak", stacks: 1 }],
					effect: "damage", amount: -2,
					addEffectArray: [{ index: "applyStatus", status: "weak", stacks: 1 }] }] },
			{ name: "Cloud", description: "Wither hits every enemy: deal 2 and apply 1 Poison; the second rank removes the damage and applies 2 Poison.",
				starterUpgradeArray: [{ card: "nettleVenomTouch", targetMode: "allEnemies", negativeIfZeroDamage: true,
					replaceEffectArray: [{ index: "damage", amount: 4 }],
					effect: "damage", amount: -2,
					addEffectArray: [{ index: "applyStatus", status: "poison", stacks: 1 }] }] },
		],
		def: [
			{ name: "Last Rites", description: "Last Rites becomes: choose one - cleanse an ally, or draw a card.",
				starterUpgradeArray: [{ card: "nettleLastRites", replaceEffectArray: [{
					index: "chooseOption", prompt: "Rites for what?", optionArray: [
						{ index: "cleanse", name: "Cleanse", description: "Remove all negative statuses from the ally.",
							effectArray: [{ index: "cleanse" }] },
						{ index: "draw", name: "Read", description: "Draw a card.",
							effectArray: [{ index: "drawCards", amount: 1 }] },
					] }] }] },
			{ name: "Reaper", description: "Last Rites becomes: choose one - cleanse an ally, or pay 3 Souls to draw a card and gain 1 Energy.",
				starterUpgradeArray: [{ card: "nettleLastRites", replaceEffectArray: [{
					index: "chooseOption", prompt: "Rites for what?", optionArray: [
						{ index: "cleanse", name: "Cleanse", description: "Remove all negative statuses from the ally.",
							effectArray: [{ index: "cleanse" }] },
						//The whole option is hidden when the Souls are not there, so "pay 3 Souls" is never a
						//silent no-op (option.condition is asked against the acting character).
						{ index: "draw", name: "Reap", description: "Pay 3 Souls: draw a card and gain 1 Energy.",
							condition: { index: "mechanicAtLeast", mechanic: "harvest", amount: 3 },
							effectArray: [{ index: "spendMechanic", mechanic: "harvest", amount: 3 },
								{ index: "drawCards", amount: 1 }, { index: "gainResource", resource: "energy", amount: 1 }] },
					] }] }] },
			{ name: "Husk", description: "Last Rites becomes: choose one - cleanse an ally, or gain 3 Souls.",
				starterUpgradeArray: [{ card: "nettleLastRites", replaceEffectArray: [{
					index: "chooseOption", prompt: "Rites for what?", optionArray: [
						{ index: "cleanse", name: "Cleanse", description: "Remove all negative statuses from the ally.",
							effectArray: [{ index: "cleanse" }] },
						{ index: "souls", name: "Husk", description: "Gain 3 Souls.",
							effectArray: [{ index: "gainMechanic", mechanic: "harvest", amount: 3 }] },
					] }] }] },
		],
		wheels: [
			{ name: "Harvest", description: "Blight becomes: remove Poison, deal that much damage.",
				abilityUpgradeArray: [{ ability: "nettleBlight", disableMechanic: true,
					effectArray: [{ index: "consumeStatus", status: "poison" }, { index: "damage", amount: { index: "tally", key: "consumed" } }] }] },
			{ name: "Veil", description: "Blight becomes: remove all debuffs from the party.",
				abilityUpgradeArray: [{ ability: "nettleBlight", disableMechanic: true, targetMode: "allAllies",
					requirementArray: [],
					effectArray: [{ index: "cleanse" }] }] },
			{ name: "Tainted Kiss", description: "Blight becomes: remove Poison, inflict that much Lust.",
				abilityUpgradeArray: [{ ability: "nettleBlight", disableMechanic: true,
					effectArray: [{ index: "consumeStatus", status: "poison" }, { index: "lust", amount: { index: "tally", key: "consumed" } }] }] },
		],
		cex: [
			{ name: "Creeping Rot", description: "Using an attack or a negative moves Nettle to the back of the party.", partyShiftByCardType: { damage: "back", negative: "back" } },
			{ name: "Penny Pincher", description: "Gain 20% of held gold when leaving the shop.", shopExitGoldFraction: 0.2 },
			{ name: "First Rites", description: "The first debuff on Nettle each combat is removed.", firstCleanse: true },
		],
	},
	severine: {
		marker: "vamp", prefix: "severine", startRanks: 3, rest: "treatment", characterName: "Severine", mechanic: "Thirst",
		ability1: { name: "Blood Tap", description: "Lose 5 life, gain 1 Strength. Three times per combat.", ability: "severineBloodTap" },
		ability2: { name: "Quicken", description: "Draw a card for each lit Thirst orb.", ability: "severineQuicken" },
		attack: "severineRend", attackName: "Claw Flurry", defence: "severineQuaff", defenceName: "Drain", attRanks: 1,
		att: [
			{ name: "Flurry", description: "Claw Flurry becomes 3x3.",
				starterUpgradeArray: [{ card: "severineRend", effect: "damage", amount: 1 }] },
			{ name: "Drink", description: "Claw Flurry becomes: drain 2x3.",
				starterUpgradeArray: [{ card: "severineRend", addEffectArray: [{ index: "heal", amount: { index: "damageDealt" }, targetOverride: "owner" }] }] },
			{ name: "Price", description: "Claw Flurry becomes five hits of 3; the fifth lands on Severine.",
				starterUpgradeArray: [{ card: "severineRend", replaceEffectArray: [
					{ index: "repeat", times: 4, effectArray: [{ index: "damage", amount: 3, vfx: "none" }] },
					{ index: "damage", amount: 3, targetOverride: "owner", vfx: "none" }] }] },
		],
		def: [
			{ name: "Blood Tax", description: "Drain becomes: choose one - drain 4, or steal up to 2 Strength.",
				starterUpgradeArray: [{ card: "severineQuaff", replaceEffectArray: [{
					index: "chooseOption", prompt: "Take what?", optionArray: [
						{ index: "drain", name: "Drain", description: "Drain 4.",
							effectArray: [{ index: "damage", amount: 4 }, { index: "heal", amount: { index: "damageDealt" }, targetOverride: "owner" }] },
						{ index: "steal", name: "Tax", description: "Steal up to 2 Strength from the target.",
							//Only what the target actually held moves: `consumed` is the tally of what came off.
							effectArray: [{ index: "consumeStatus", status: "strength", stacks: 2 },
								{ index: "applyStatus", status: "strength", stacks: { index: "tally", key: "consumed" }, targetOverride: "owner" }] },
					] }] }] },
			{ name: "Leech", description: "Drain becomes: choose one - drain 4, or drain 8 from an ally.",
				starterUpgradeArray: [{ card: "severineQuaff", replaceEffectArray: [{
					index: "chooseOption", prompt: "Take from whom?", optionArray: [
						{ index: "drain", name: "Drain", description: "Drain 4.",
							effectArray: [{ index: "damage", amount: 4 }, { index: "heal", amount: { index: "damageDealt" }, targetOverride: "owner" }] },
						{ index: "leech", name: "Leech", description: "Drain 8 from an ally.",
							effectArray: [{ index: "chooseAlly", prompt: "Drain whom?",
								effectArray: [{ index: "damage", amount: 8 }, { index: "heal", amount: 8, targetOverride: "owner" }] }] },
					] }] }] },
			{ name: "Mend", description: "Drain becomes: choose one - drain 4, or regain 8 health.",
				starterUpgradeArray: [{ card: "severineQuaff", replaceEffectArray: [{
					index: "chooseOption", prompt: "Take or give?", optionArray: [
						{ index: "drain", name: "Drain", description: "Drain 4.",
							effectArray: [{ index: "damage", amount: 4 }, { index: "heal", amount: { index: "damageDealt" }, targetOverride: "owner" }] },
						{ index: "mend", name: "Mend", description: "Regain 8 health.",
							effectArray: [{ index: "heal", amount: 8, targetOverride: "owner" }] },
					] }] }] },
		],
		wheels: [
			{ name: "Bloodlust", description: "Blood Tap becomes: gain 5 Lust instead of losing life.",
				abilityUpgradeArray: [{ ability: "severineBloodTap", disableMechanic: true,
					text: "Severine gains 5 Lust and 1 Strength.",
					effectArray: [{ index: "lust", amount: 5, targetOverride: "owner" },
						{ index: "applyStatus", status: "strength", stacks: 1, targetOverride: "owner" }] }] },
			{ name: "Soul Tap", description: "Blood Tap becomes: discard a card, draw 2, lose 3 life per card in hand.",
				abilityUpgradeArray: [{ ability: "severineBloodTap", disableMechanic: true,
					text: "Discard a card. Draw 2 cards. Lose 3 HP for each card in your hand.",
					effectArray: [{ index: "chooseCards", from: "handCard", prompt: "Discard which card?", effectArray: [{ index: "discardCard" }] }, { index: "drawCards", amount: 2 },
						{ index: "loseHealth", amount: { index: "math", operation: "multiply", left: 3, right: { index: "count", collection: "hand" } }, targetOverride: "owner" }] }] },
			{ name: "Full Control", description: "Blood Tap becomes: upgrade a damage card and play a copy of it on Severine.",
				abilityUpgradeArray: [{ ability: "severineBloodTap", disableMechanic: true,
					text: "Upgrade a damage card, then play a copy of it on Severine.",
					effectArray: [{ index: "chooseCards", from: "handCard", prompt: "Take control of which card?",
						cardType: "damage", nonStarterOnly: true,
						effectArray: [{ index: "upgradeTargetCard", levels: 1 }, { index: "playChosenCardOnOwner" }] }] }] },
		],
		cex: [
			{ name: "Feast", description: "When an enemy dies, regain 5 HP.", onKillHeal: 5 },
			{ name: "Challenger", description: "Draw 1 extra at the start of boss and elite fights.",
				hooks: { onCombatStart: function (params) {
					var combat = params.context.combat;
					var encounter = combat == null ? null : honeycomb.findDefinition(honeycomb.encounterArray, combat.encounterIndex);
					if (encounter == null) return;
					if (encounter.isElite != true && encounter.tier != "boss") return;
					honeycomb.drawCards(1, params.context);
				} } },
			{ name: "Thin Skin", description: "Self-damage -1.", selfDamageReduction: 1 },
		],
	},
	cassadora: {
		marker: "seer", prefix: "cas", startRanks: 2, rest: "fortuneTelling", characterName: "Cassadora", mechanic: "Foresight",
		ability1: { name: "Glimpse", description: "Reroll one enemy intent. Once per rest.", ability: "cassadoraGlimpse" },
		ability2: { name: "Magic Trick", description: "Add random enemy-deck cards to hand, one per orb symbol; they exhaust. Once per rest.", ability: "cassadoraMagicTrick" },
		attack: "cassadoraWispBolt", attackName: "Wisplight", defence: "cassadoraUnravel", defenceName: "Second Thoughts", attRanks: 2,
		att: [
			{ name: "Hex", description: "Wisplight: -2 damage and +1 Sundered per rank; at the last rank it deals no damage and reads as pure negative.", starterUpgradeArray: [{ card: "cassadoraWispBolt", effect: "damage", amount: -2, negativeIfZeroDamage: true }, { card: "cassadoraWispBolt", effect: "applyStatus", status: "sundered", stacks: 1 }] },
			{ name: "Nail", description: "Wisplight: +1 damage per unique negative on the target, per rank.",
				starterUpgradeArray: [{ card: "cassadoraWispBolt", addEffectArray: [{ index: "damage", amount: { index: "debuffCount", of: "target" } }] }] },
			{ name: "Twist", description: "Wisplight hits every enemy: deal 2 and apply 1 Sundered; the second rank removes the damage and applies 2 Sundered.",
				starterUpgradeArray: [{ card: "cassadoraWispBolt", targetMode: "allEnemies", negativeIfZeroDamage: true,
					replaceEffectArray: [{ index: "damage", amount: 4 }],
					effect: "damage", amount: -2,
					addEffectArray: [{ index: "applyStatus", status: "sundered", stacks: 1 }] }] },
		],
		def: [
			{ name: "Wane", description: "Second Thoughts becomes: choose one - change an intent, or inflict Weak.",
				starterUpgradeArray: [{ card: "cassadoraUnravel", replaceEffectArray: [{
					index: "chooseOption", prompt: "Change what?", optionArray: [
						{ index: "intent", name: "Change", description: "The enemy picks a new intent.",
							effectArray: [{ index: "rerollIntent" }] },
						{ index: "weak", name: "Wane", description: "Inflict 2 Weak.",
							effectArray: [{ index: "applyStatus", status: "weak", stacks: 2 }] },
					] }] }] },
			{ name: "Foresee", description: "Second Thoughts becomes: choose one - change an intent, or rearrange the top 3 of the deck.",
				starterUpgradeArray: [{ card: "cassadoraUnravel", replaceEffectArray: [{
					index: "chooseOption", prompt: "Change what?", optionArray: [
						{ index: "intent", name: "Change", description: "The enemy picks a new intent.",
							effectArray: [{ index: "rerollIntent" }] },
						{ index: "scry", name: "Foresee", description: "Scry 3.",
							effectArray: [{ index: "scry", count: 3 }] },
					] }] }] },
			{ name: "Refract", description: "Second Thoughts becomes: choose one - change an intent, or reroll all intents.",
				starterUpgradeArray: [{ card: "cassadoraUnravel", replaceEffectArray: [{
					index: "chooseOption", prompt: "Change what?", optionArray: [
						{ index: "intent", name: "Change", description: "The enemy picks a new intent.",
							effectArray: [{ index: "rerollIntent" }] },
						{ index: "refract", name: "Refract", description: "Every enemy picks a new intent.",
							effectArray: [{ index: "rerollIntent", targetOverride: "allEnemies" }] },
					] }] }] },
		],
		wheels: [
			{ name: "Turnabout", description: "Glimpse becomes: shuffle an enemy intent into your discard; it costs 2 this combat.",
				abilityUpgradeArray: [{ ability: "cassadoraGlimpse", disableMechanic: true,
					effectArray: [{ index: "stealIntent", pile: "discardPile", cost: { energy: 2 } }] }] },
			{ name: "Predict Offense", description: "Glimpse becomes: discard a card, draw a card per attacking enemy.",
				abilityUpgradeArray: [{ ability: "cassadoraGlimpse", disableMechanic: true, targetMode: "owner",
					text: "Discard a card. Draw a card for each enemy intending to attack.",
					effectArray: [{ index: "chooseCards", from: "handCard", prompt: "Discard which card?", effectArray: [{ index: "discardCard" }] }, { index: "drawCards", amount: { index: "attackingOpponents" } }] }] },
			{ name: "Mind Control", description: "Glimpse becomes: discard a card, an enemy gains 1 Turncoat.",
				abilityUpgradeArray: [{ ability: "cassadoraGlimpse", disableMechanic: true,
					effectArray: [{ index: "chooseCards", from: "handCard", prompt: "Discard which card?", effectArray: [{ index: "discardCard" }] }, { index: "applyStatus", status: "turncoat", stacks: 1 }] }] },
		],
		cex: [
			{ name: "Studied Foe", description: "Unlock an enemy's movelist after first encountering it.", enemyMovelistUnlock: true },
			{ name: "Tidy", description: "The first junk card each combat exhausts.", firstJunkExhausts: true },
			{ name: "Investment", description: "+2 gold per unspent energy at combat end.", unspentEnergyGold: 2 },
		],
	},
	cinder: {
		marker: "lancer", prefix: "cin", startRanks: 3, rest: "scavenge", characterName: "Cinder", mechanic: "Stride",
		ability1: { name: "Backflip", description: "Move to the back. Once per combat.", ability: "cinderBackflip" },
		ability2: { name: "Phoenix Dive", description: "Spend all Stride, move to the front, then deal 9 plus the Stride spent per rank crossed.", ability: "cinderPhoenixDive" },
		attack: "cinderImpale", attackName: "Lance Thrust", defence: "cinderSwitch", defenceName: "Change Places", attRanks: 1,
		att: [
			{ name: "Plant", description: "Lance Thrust deals 9 and does not change position.",
				starterUpgradeArray: [{ card: "cinderImpale", partyShift: "none" }] },
			{ name: "Reckless", description: "Lance Thrust deals 12, and Cinder gains 3 Sundered.",
				starterUpgradeArray: [{ card: "cinderImpale", effect: "damage", amount: 3 },
					{ card: "cinderImpale", addEffectArray: [{ index: "applyStatus", status: "sundered", stacks: 2, targetOverride: "owner" }] }] },
			{ name: "Step", description: "Lance Thrust deals 6, +3 if already in front.",
				starterUpgradeArray: [{ card: "cinderImpale", effect: "damage", amount: -3 },
					{ card: "cinderImpale", addEffectArray: [{ index: "damage", amount: 3, condition: { index: "atRank", of: "source", rank: 0 } }] }] },
		],
		//NO EXCLUSIVE D. Instead one non-exclusive defensive upgrade takes DEF2's place (NODES-LIST A3):
		//the front-mover's 4 tHP is already on Change Places, so the node adds the back-mover's strip.
		//`replaceEffectArray` re-specifies the whole swap so the strip runs on the entity the swap actually
		//sent backward (`backEffectArray`), not on whoever happens to stand at the back.
		defSingle: { name: "Reversal", description: "Change Places becomes: whoever moves forward gains 4 Temporary HP; whoever moves back strips 1 Weak and 1 Sundered.",
			starterUpgradeArray: [{ card: "cinderSwitch",
				text: "Swap places with an ally. Whoever moves forward gains 4 Temporary HP; whoever moves back loses 1 Weak and 1 Sundered.",
				replaceEffectArray: [
					{ index: "swapParty", backEffectArray: [
						{ index: "removeStatus", status: "weak", stacks: 1 },
						{ index: "removeStatus", status: "sundered", stacks: 1 },
					] },
					{ index: "temporaryHealth", amount: 4, targetOverride: "frontAlly" },
				] }] },
		def: [],
		wheels: [
			{ name: "Momentum", description: "Backflip becomes: spend 3 Stride, draw 2.",
				abilityUpgradeArray: [{ ability: "cinderBackflip", disableMechanic: true,
					requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "stride", amount: 3 }, text: "Needs 3 Stride." }],
					effectArray: [{ index: "spendMechanic", mechanic: "stride", amount: 3 }, { index: "drawCards", amount: 2 }] }] },
			{ name: "Catch Breath", description: "Backflip becomes: spend 3 Stride, remove all Sundered.",
				abilityUpgradeArray: [{ ability: "cinderBackflip", disableMechanic: true,
					requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "stride", amount: 3 }, text: "Needs 3 Stride." }],
					effectArray: [{ index: "spendMechanic", mechanic: "stride", amount: 3 }, { index: "removeStatus", status: "sundered", targetOverride: "owner" }] }] },
			{ name: "Lance", description: "Backflip becomes: spend 3 Stride, if in front deal 9.",
				//Aimed at an enemy: Backflip itself targets Cinder, so the lance names its own target (AUDIT-01).
				abilityUpgradeArray: [{ ability: "cinderBackflip", disableMechanic: true, targetMode: "enemy",
					requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "stride", amount: 3 }, text: "Needs 3 Stride." }],
					text: "Spend 3 Stride. If Cinder is at the front, deal 9 damage.",
					effectArray: [{ index: "spendMechanic", mechanic: "stride", amount: 3 }, { index: "damage", amount: 9, condition: { index: "atRank", of: "source", rank: 0 } }] }] },
		],
		cex: [
			{ name: "Drilled", description: "When Cinder moves to the front, gain 4 Temporary HP.",
				hooks: { onPartyShifted: function (params) {
					if (params.wearer == null || params.entity !== params.wearer) return;
					if (params.toRank !== 0) return;
					honeycomb.grantTemporaryHealth(params.wearer, 4, params.context);
				} } },
			{ name: "Soothing", description: "When resting, reduce Lust equal to HP gained.", restSoothe: true },
			{ name: "Recover", description: "When Cinder recovers from Broken, heal 10.", recoverHeal: 10 },
		],
	},
	clemence: {
		marker: "priest", prefix: "clm", startRanks: 3, rest: "exercise", characterName: "Clemence", mechanic: "Devotion",
		ability1: { name: "Absolution", description: "Allies soothe 5 and heal 5; Clemence takes the Lust they lost. Once per rest.", ability: "clemenceAbsolve" },
		ability2: { name: "One with Nothing", description: "Lose all Devotion, then lose that much life. Once per combat.", ability: "clemenceOneWithNothing" },
		attack: "clemenceTempt", attackName: "Tempt", defence: "clemenceGrant", defenceName: "Offering", attRanks: 3,
		att: [
			{ name: "Share", description: "Tempt: 6 Lust, and 2 Lust on Clemence per rank.",
				starterUpgradeArray: [{ card: "clemenceTempt", addEffectArray: [{ index: "lust", amount: 2, targetOverride: "owner" }] }] },
			{ name: "Doubt", description: "Tempt: +2 Lust per rank.", starterUpgradeArray: [{ card: "clemenceTempt", addEffectArray: [{ index: "lust", amount: 2 }] }] },
			{ name: "Brand", description: "Tempt: +1 Weak per rank.", starterUpgradeArray: [{ card: "clemenceTempt", addEffectArray: [{ index: "applyStatus", status: "weak", stacks: 1 }] }] },
		],
		def: [
			{ name: "Take Their Burden", description: "Offering becomes: choose one - restore 6, or take 6 Lust from them.",
				starterUpgradeArray: [{ card: "clemenceGrant", replaceEffectArray: [{
					index: "chooseOption", prompt: "Give or take?", optionArray: [
						{ index: "restore", name: "Restore", description: "Restore 6 health.",
							effectArray: [{ index: "heal", amount: 6 }] },
						{ index: "burden", name: "Take Their Burden", description: "Take 6 Lust from them.",
							effectArray: [{ index: "soothe", amount: 6 }, { index: "lust", amount: 6, targetOverride: "owner" }] },
					] }] }] },
			{ name: "Pardon", description: "Offering becomes: choose one - restore 6, or remove a random negative status.",
				starterUpgradeArray: [{ card: "clemenceGrant", replaceEffectArray: [{
					index: "chooseOption", prompt: "Give or take?", optionArray: [
						{ index: "restore", name: "Restore", description: "Restore 6 health.",
							effectArray: [{ index: "heal", amount: 6 }] },
						{ index: "pardon", name: "Pardon", description: "Remove a random negative status from them.",
							effectArray: [{ index: "removeStatus", random: true }] },
					] }] }] },
			{ name: "Zeal", description: "Offering becomes: choose one - restore 6, or they gain 2 Strength this turn.",
				starterUpgradeArray: [{ card: "clemenceGrant", replaceEffectArray: [{
					index: "chooseOption", prompt: "Give or embolden?", optionArray: [
						{ index: "restore", name: "Restore", description: "Restore 6 health.",
							effectArray: [{ index: "heal", amount: 6 }] },
						{ index: "zeal", name: "Zeal", description: "They gain 2 Strength this turn.",
								effectArray: [{ index: "applyStatus", status: "fleetingStrength", stacks: 2 }] },
					] }] }] },
		],
		wheels: [
			{ name: "Discipline", description: "Absolution becomes: allies soothe 10 and heal 10; Clemence takes none.",
				abilityUpgradeArray: [{ ability: "clemenceAbsolve", disableMechanic: true,
					effectArray: [{ index: "soothe", amount: 10, targetOverride: "otherAllies" }, { index: "heal", amount: 10, targetOverride: "allAllies" }] }] },
			{ name: "Mortification", description: "Absolution becomes: all allies soothe 20 and lose 10 life.",
				abilityUpgradeArray: [{ ability: "clemenceAbsolve", disableMechanic: true,
					effectArray: [{ index: "soothe", amount: 20, targetOverride: "allAllies" }, { index: "loseHealth", amount: 10, targetOverride: "allAllies" }] }] },
			{ name: "Purify", description: "Absolution becomes: remove all statuses and Lust from the party.",
				abilityUpgradeArray: [{ ability: "clemenceAbsolve", disableMechanic: true,
					effectArray: [{ index: "cleanse", all: true, targetOverride: "allAllies" }, { index: "soothe", all: true, targetOverride: "allAllies" }] }] },
		],
		cex: [
			{ name: "Overflow", description: "Healing that overflows max HP becomes Temporary HP.", healOverflowToTemporary: true },
			{ name: "Martyr", description: "When Clemence is Broken, other allies gain 4 Temporary HP.",
				hooks: { onAllyBroken: function (params) {
					if (params.wearer == null || params.entity !== params.wearer) return;
					var allies = honeycomb.entityArray("ally", params.context.combat);
					for (var allyIndex = 0; allyIndex < allies.length; allyIndex++) {
						if (allies[allyIndex] !== params.wearer) honeycomb.grantTemporaryHealth(allies[allyIndex], 4, params.context);
					}
				} } },
			{ name: "Comfort", description: "Combat start: other allies soothe 2.",
				hooks: { onCombatStart: function (params) {
					var allies = honeycomb.entityArray("ally", params.context.combat);
					for (var allyIndex = 0; allyIndex < allies.length; allyIndex++) {
						if (allies[allyIndex] !== params.entity) honeycomb.reduceLust(allies[allyIndex], 2, params.context);
					}
				} } },
		],
	},

	//ANASTASIA (session 46). The universal skeleton with the cheapest character-specific content that still
	//reads as hers: every effect below is a verb, a field or a hook point the engine already had. Her wheels
	//do NOT carry `disableMechanic` -- Gambit is what Call the King is paid in, so a wheel that switched it
	//off would strand her A2.
	anastasia: {
		marker: "chess", prefix: "ana", startRanks: 2, rest: "preptime", characterName: "Anastasia", mechanic: "Gambit",
		ability1: { name: "Transposition", description: "Invert a piece's alignment, permanently; a downed Pawn is raised as its twin. Once per combat.", ability: "anastasiaTransposition" },
		ability2: { name: "Call the King", description: "At 4 Gambit, shuffle a King's Invocation into the deck. Once per rest.", ability: "anastasiaKingsInvocation" },
		//SESSION 47: the attack starter is ADVANCE, a summon, not Check's 6 damage (Noodle: "Her basic
		//offensive really should be summoning an infernal pawn"). So the three `att` nodes can no longer
		//add damage to it -- a summon carries no hit -- and each instead improves the BODY it puts down.
		//`lastSummoned` is the target mode that names it.
		attack: "anastasiaAdvance", attackName: "Advance", defence: "anastasiaDevelop", defenceName: "Develop", attRanks: 3,
		att: [
			{ name: "Fork", description: "Advance: the Pawn gains 2 Strength per rank.",
				starterUpgradeArray: [{ card: "anastasiaAdvance", addEffectArray: [{ index: "applyStatus", status: "strength", stacks: 2, targetOverride: "lastSummoned" }] }] },
			{ name: "Pin", description: "Advance: the Pawn gains 1 Taunt per rank.",
				starterUpgradeArray: [{ card: "anastasiaAdvance", addEffectArray: [{ index: "applyStatus", status: "taunt", stacks: 1, targetOverride: "lastSummoned" }] }] },
			{ name: "Discovered Attack", description: "Advance: Anastasia gains 2 Temporary HP per rank.",
				starterUpgradeArray: [{ card: "anastasiaAdvance", addEffectArray: [{ index: "temporaryHealth", amount: 2, targetOverride: "owner" }] }] },
		],
		def: [
			{ name: "Either Colour", description: "Develop becomes: choose one - summon a Celestial Pawn, or an Infernal Pawn. Gain 3 Temporary HP.",
				starterUpgradeArray: [{ card: "anastasiaDevelop", replaceEffectArray: [{
					index: "chooseOption", prompt: "Which colour?", optionArray: [
						{ index: "celestial", name: "Celestial", description: "Summon a Celestial Pawn. It opens on its guard.",
							effectArray: [{ index: "summon", enemy: "celestialPawn", team: "own" }] },
						{ index: "infernal", name: "Infernal", description: "Summon an Infernal Pawn. It opens on its blow.",
							effectArray: [{ index: "summon", enemy: "infernalPawn", team: "own" }] },
					] }, { index: "temporaryHealth", amount: 3 }] }] },
			{ name: "Solid Structure", description: "Develop becomes: summon a Celestial Pawn and gain 7 Temporary HP.",
				starterUpgradeArray: [{ card: "anastasiaDevelop", replaceEffectArray: [
					{ index: "summon", enemy: "celestialPawn", team: "own" }, { index: "temporaryHealth", amount: 7 }] }] },
			{ name: "Gain a Tempo", description: "Develop becomes: summon a Celestial Pawn and draw a card.",
				starterUpgradeArray: [{ card: "anastasiaDevelop", replaceEffectArray: [
					{ index: "summon", enemy: "celestialPawn", team: "own" }, { index: "drawCards", amount: 1 }] }] },
		],
		wheels: [
			{ name: "Double Transposition", description: "Transposition holds 2 charges.",
				abilityUpgradeArray: [{ ability: "anastasiaTransposition", chargeMaximum: 2, rechargeAmount: 2 }] },
			{ name: "Exchange Up", description: "Transposition becomes: invert a piece, and it gains 3 Strength.",
				abilityUpgradeArray: [{ ability: "anastasiaTransposition",
					effectArray: [{ index: "invert" }, { index: "applyStatus", status: "strength", stacks: 3 }],
					text: "Invert a piece's alignment, permanently; it gains 3 Strength. A downed Pawn is raised as its twin." }] },
			{ name: "Reserve Pawn", description: "Transposition becomes: summon a Celestial Pawn. Once per combat.",
				abilityUpgradeArray: [{ ability: "anastasiaTransposition", targetMode: "self",
					effectArray: [{ index: "summon", enemy: "celestialPawn", team: "own" }],
					text: "Summon a Celestial Pawn." }] },
		],
		cex: [
			//SESSION 47, at Noodle's word: "Change one of anastasia's c.exp nodes to a start of turn soothe
			//for 5." This replaces Opening Book (5 Temporary HP at combat start), which was the least of
			//the three and overlapped Hold the File. Clemence's Comfort is the model for the hook shape.
			{ name: "Composure", description: "Turn start: Anastasia soothes 5.",
				hooks: { onTurnStart: function (params) {
					honeycomb.reduceLust(params.entity, 5, params.context);
				} } },
			{ name: "Pawn Structure", description: "When a Pawn falls, Anastasia gains 3 Temporary HP.",
				hooks: { onAllyDowned: function (params) {
					if (params.wearer == null) return;
					var found = honeycomb.entityDefinition(params.entity);
					if (found == null || !honeycomb.definitionHasTag(found.definition, "pawn")) return;
					honeycomb.grantTemporaryHealth(params.wearer, 3, params.context);
				} } },
			{ name: "Prepared Line", description: "Combat start: summon a Celestial Pawn.",
				hooks: { onCombatStart: function (params) {
					var context = honeycomb.newEffectContext({ combat: params.context.combat, source: params.entity, log: params.context.log });
					honeycomb.summonCombatant({ side: "ally", enemyIndex: "celestialPawn" }, context);
				} } },
		],
	},
};

//---------------------------------------------------------------------------------------------------
//Build
//---------------------------------------------------------------------------------------------------
function labelKey(raw) {
	return String(raw).replace(/\s+/g, "");
}
function attPathIndex(character, pathIndex) {
	return character.prefix + SUFFIX["ATT" + (pathIndex + 1)];
}
function defPathIndex(character, pathIndex) {
	return character.prefix + SUFFIX["DEF" + (pathIndex + 1)];
}

function nodeContent(character, key) {
	if (key === "Start") return { name: "Vigour", description: "+5 Max HP per rank.", healthModifier: 5 };
	//Ability nodes SAY what they unlock, and that the character's mechanic begins here (Noodle, session 27):
	//without A1 a character has no ability and should not be building Resolve/Thirst/Stride at all.
	if (key === "A1") return {
		name: character.ability1.name,
		description: "Unlocks " + character.ability1.name + " and " + character.characterName + "'s " + character.mechanic + ". " + character.ability1.description,
		abilityAdditionArray: [{ index: character.ability1.ability }],
	};
	if (key === "A2") {
		const fields = { name: character.ability2.name, description: "Unlocks " + character.ability2.name + ". " + character.ability2.description };
		if (character.ability2.ability != null) fields.abilityAdditionArray = [{ index: character.ability2.ability }];
		return fields;
	}
	if (/^ATT[123]$/.test(key)) {
		const entry = character.att[Number(key.charAt(3)) - 1];
		//previewCardArray names the card this node improves, so hovering it shows that card (with the
		//node's own starter delta applied) in the tree's card panel (Noodle, round 07).
		const fields = { name: entry.name, description: entry.description, previewCardArray: [character.attack] };
		if (entry.starterUpgradeArray != null) fields.starterUpgradeArray = entry.starterUpgradeArray;
		return fields;
	}
	if (/^DEF[123]$/.test(key)) {
		//A single defensive upgrade (Cinder) replaces the choose-one family; it is the only DEF node kept.
		if (character.defSingle != null) return Object.assign({ previewCardArray: [character.defence] }, character.defSingle);
		const entry = character.def[Number(key.charAt(3)) - 1];
		//A choose-one rewrite travels as a `starterUpgradeArray` with a `replaceEffectArray`, applied in
		//place so the basic card becomes the form without a variant card existing.
		const fields = { name: entry.name, description: entry.description, previewCardArray: [character.defence] };
		if (entry.starterUpgradeArray != null) fields.starterUpgradeArray = entry.starterUpgradeArray;
		return fields;
	}
	if (/^W[123]$/.test(key)) {
		const entry = character.wheels[Number(key.charAt(1)) - 1];
		//A training wheel keeps the A1 ability but repurposes it, so it travels as an `abilityUpgradeArray`.
		const fields = { name: entry.name, description: entry.description };
		if (entry.abilityUpgradeArray != null) fields.abilityUpgradeArray = entry.abilityUpgradeArray;
		return fields;
	}
	if (/^C\.Ex\.[123]$/.test(key)) {
		//The whole entry, so a C.Ex. carries its hooks and flag fields, not just its words. A C.Ex. only
		//acts while its character is fielded, so it says so (Noodle, round 07); Studied Foe is a
		//permanent bestiary unlock and is left alone.
		const entry = Object.assign({}, character.cex[Number(key.charAt(5)) - 1]);
		if (entry.description != null && entry.enemyMovelistUnlock != true) {
			entry.description = "While in the party, " + entry.description.charAt(0).toLowerCase() + entry.description.slice(1);
		}
		return entry;
	}
	if (key === "XP") return Object.assign({}, GENERIC["XP"], { personalExperienceMultiplier: 1.5 });
	if (key === "Gold") return Object.assign({}, GENERIC["Gold"], { startingGold: 5 });
	if (key === "Banish1") return Object.assign({}, GENERIC["Banish1"], { rewardBanish: 1 });
	if (key === "Banish2") return Object.assign({}, GENERIC["Banish2"], {
		description: "Adds 1 banish to every run, whether or not " + character.characterName + " is in the party.",
		rewardBanishAlways: 1 });
	if (key === "Shop1") return Object.assign({}, GENERIC["Shop1"], { shopCardDiscount: 0.1 });
	if (key === "Shop2") return Object.assign({}, GENERIC["Shop2"], { shopExtraSlots: 1 });
	if (key === "Cheap") return Object.assign({}, GENERIC["Cheap"], { unlockDiscount: 0.1 });
	if (key === "Boun1") return Object.assign({}, GENERIC["Boun1"], { bountyGoldMultiplier: 0.25 });
	if (key === "Boun2") return Object.assign({}, GENERIC["Boun2"], { bountyCardChoiceBonus: 1 });
	if (key === "Col") return Object.assign({}, GENERIC["Col"], { collectorWeight: 0.5 });
	if (key === "New") return Object.assign({}, GENERIC["New"], {
		description: "While in the party, " + character.characterName + "'s unseen cards appear 50% more often.",
		unseenCardWeight: 0.5 });
	if (key === "Reroll1") return Object.assign({}, GENERIC["Reroll1"], { rewardReroll: 1 });
	if (key === "Reroll2") return Object.assign({}, GENERIC["Reroll2"], {
		description: "Adds 1 reroll to every run, whether or not " + character.characterName + " is in the party.",
		rewardRerollAlways: 1 });
	if (key === "U1") return Object.assign({}, GENERIC["U1"], {
		description: "While in the party, " + character.characterName + "'s worn outfit adds twice as many cards.",
		outfitCardDoubling: true });
	if (key === "U2") return Object.assign({}, GENERIC["U2"], {
		description: "While in the party, " + character.characterName + "'s worn outfit cards start upgraded.",
		outfitCardUpgrade: true });
	if (key === "OpenD") return Object.assign({}, GENERIC["OpenD"], { openingDrawBonus: 1, openingEnergyBonus: -1 });
	if (key === "OpenE") return Object.assign({}, GENERIC["OpenE"], { openingDrawBonus: -1, openingEnergyBonus: 1 });
	//Fortitude is free; `free` marks the zero as deliberate for audit-trees.js.
	if (key === "Fort") return Object.assign({}, GENERIC["Fort"], {
		description: character.characterName + "'s Lust weaknesses never build, and " + character.characterName + " misses every Lust Event.",
		fortitude: true, free: true });
	//These NAME the card they touch (Noodle, session 27), so the tree says "Sword Strike" rather than
	//"the aggressive basic" -- the tooltip shows the card, the text names it.
	if (key === "+A.") return Object.assign({}, GENERIC["+A."], { description: "Add a second copy of " + character.attackName + " to the starting deck.", cardAdditionArray: [{ index: character.attack, count: 1 }] });
	if (key === "+D.") return Object.assign({}, GENERIC["+D."], { description: "Add a second copy of " + character.defenceName + " to the starting deck.", cardAdditionArray: [{ index: character.defence, count: 1 }] });
	if (key === "-A.") return Object.assign({}, GENERIC["-A."], { description: "Remove a copy of " + character.attackName + " from the starting deck.", cardRemovalArray: [{ index: character.attack, count: 1 }] });
	if (key === "-D.") return Object.assign({}, GENERIC["-D."], { description: "Remove a copy of " + character.defenceName + " from the starting deck.", cardRemovalArray: [{ index: character.defence, count: 1 }] });
	if (key === "R.A.") return Object.assign({}, GENERIC["R.A."], { description: "At run start, one " + character.attackName + " becomes a random common of " + character.characterName + ".", randomReplaceArray: [{ from: character.attack, rarity: "common", count: 1 }] });
	if (key === "R.D.") return Object.assign({}, GENERIC["R.D."], { description: "At run start, one " + character.defenceName + " becomes a random common of " + character.characterName + ".", randomReplaceArray: [{ from: character.defence, rarity: "common", count: 1 }] });
	//Rest1 and Rest2 both name the character's own rest-site option, by title; Rest2 is the benched tier.
	if (key === "Rest1" || key === "Rest2") {
		const restName = REST_NAME[character.rest] == null ? character.rest : REST_NAME[character.rest];
		const description = key === "Rest1"
			? "Unlocks " + restName + " at rest sites while " + character.characterName + " is in the party."
			: restName + " stays unlocked even when " + character.characterName + " is benched.";
		return { name: GENERIC[key].name, description: description, restOption: character.rest };
	}
	//Rest-A buys an extra action; Rest-B raises what a rest heals. Both are read party-wide.
	if (key === "Rest-A") return Object.assign({}, GENERIC["Rest-A"], { restActionsBonus: 1 });
	if (key === "Rest-B") return Object.assign({}, GENERIC["Rest-B"], { restHealBonus: true });
	return GENERIC[key];
}

//The generic entries for the additive/replace nodes live here so nodeContent stays small.
Object.assign(GENERIC, {
	"+A.": { name: "Extra Copy", description: "Add a second copy of the aggressive basic to the starting deck." },
	"-A.": { name: "Trim", description: "Remove a copy of the aggressive basic from the starting deck." },
	"R.A.": { name: "Retrain", description: "At run start, one aggressive basic becomes a random common of this character." },
	"+D.": { name: "Extra Guard", description: "Add a second copy of the defensive basic to the starting deck." },
	"-D.": { name: "Slim Down", description: "Remove a copy of the defensive basic from the starting deck." },
	"R.D.": { name: "Relearn", description: "At run start, one defensive basic becomes a random common of this character." },
});

function rankFor(character, key, skeletonRank) {
	if (key === "Start") return character.startRanks;
	if (/^ATT[123]$/.test(key)) return character.attRanks;
	if (/^DEF[123]$/.test(key)) return 1;
	//Tailored upgrades EVERY card the outfit gives, so a second rank has nothing left to do (Noodle,
	//round 07); it is a single purchase whatever the skeleton says.
	if (key === "U2") return 1;
	return skeletonRank == null ? 1 : skeletonRank;
}

function buildTree(character, skeleton) {
	const nodes = [];
	//A `defSingle` character keeps the middle DEF node as one non-exclusive upgrade; `noDef` drops all
	//three and repoints Rest2 at Bounty. A `defSingle` still reaches Rest2 through the kept DEF node.
	const removed = character.defSingle != null ? ["DEF1", "DEF3"] : (character.noDef ? ["DEF1", "DEF2", "DEF3"] : []);
	const restParentArray = character.noDef ? ["n52", "n53"] : null;
	const bySkeletonId = {};
	for (const skeletonNode of skeleton.nodes) {
		const key = labelKey(skeletonNode.label);
		if (removed.indexOf(key) >= 0) continue;
		const content = nodeContent(character, key);
		const suffix = SUFFIX[key];
		const node = {
			index: character.prefix + suffix,
			name: content.name,
			description: content.description,
			x: skeletonNode.x,
			y: skeletonNode.y,
		};
		const ranks = rankFor(character, key, skeletonNode.rank);
		if (ranks > 1) node.rankMaximum = ranks;
		//Vigour is priced like every other node now -- one total, divided by however many ranks it splits
		//into -- but off its own, much smaller total. See START_TOTAL_COST.
		const total = COST[key] == null ? 150 : COST[key];
		node.cost = key === "Start" ? Math.max(1, Math.round(START_TOTAL_COST / ranks)) : Math.round(total / ranks);
		if (GROUP[key] != null && !(character.defSingle != null && /^DEF[123]$/.test(key))) {
			node.exclusiveGroup = character.prefix + GROUP[key];
		}
		//Every content field except the printed ones becomes a node field, so a new mechanic is a data
		//change here rather than a change to this copier.
		for (const field of Object.keys(content)) {
			if (field === "name" || field === "description") continue;
			node[field] = content[field];
		}
		bySkeletonId[skeletonNode.id] = node;
		nodes.push({ node, skeletonNode, key });
	}
	//Wire prerequisites from the skeleton ids to the generated indices.
	for (const entry of nodes) {
		let requireIds = entry.skeletonNode.requires.slice();
		if (entry.key === "Rest2" && restParentArray != null) requireIds = restParentArray.slice();
		const requiresArray = [];
		for (const id of requireIds) {
			const parent = bySkeletonId[id];
			if (parent != null) requiresArray.push(parent.index);
		}
		//Fortitude has no prerequisite.
		if (entry.key === "Fort") continue;
		if (requiresArray.length > 0) entry.node.requiresArray = requiresArray;
	}
	return nodes.map((entry) => entry.node);
}

//---------------------------------------------------------------------------------------------------
//Serialise into the content file.
//---------------------------------------------------------------------------------------------------
//JSON cannot carry a hook function, so values are written as SOURCE: a function becomes its own
//toString, everything else is JSON. That is what lets a node carry a `hooks` table like an outfit does.
function toSource(value) {
	if (typeof value === "function") return value.toString();
	if (Array.isArray(value)) return "[" + value.map(toSource).join(", ") + "]";
	if (value != null && typeof value === "object") {
		const parts = [];
		for (const key of Object.keys(value)) parts.push(JSON.stringify(key) + ": " + toSource(value[key]));
		return "{ " + parts.join(", ") + " }";
	}
	return JSON.stringify(value);
}

function serialize(node) {
	//Preferred order first (readability), then any field a new mechanic added, so nothing is dropped.
	const order = ["index", "name", "description", "x", "y", "cost", "rankMaximum", "exclusiveGroup",
		"healthModifier", "startingGold", "personalExperienceMultiplier", "cardAdditionArray",
		"cardRemovalArray", "randomReplaceArray", "starterUpgradeArray", "abilityAdditionArray", "hooks", "requiresArray"];
	const keyArray = order.filter((key) => node[key] != null)
		.concat(Object.keys(node).filter((key) => order.indexOf(key) < 0 && node[key] != null));
	const lines = [];
	for (const key of keyArray) lines.push("\t\t\t\t\t" + key + ": " + toSource(node[key]) + ",");
	return "\t\t\t\t{\n" + lines.join("\n") + "\n\t\t\t\t},";
}

const args = process.argv.slice(2);
const report = args.indexOf("--report") >= 0;
const skeleton = JSON.parse(fs.readFileSync(SKELETON_FILE, "utf8"));

let text = fs.readFileSync(CONTENT_FILE, "utf8");
let totalNodes = 0;
//`--only <characterIndex>` rewrites ONE tree and leaves the rest of the file byte for byte (session 46):
//adding a character must not regenerate six trees somebody may have tuned by hand since.
const onlyAt = args.indexOf("--only");
const onlyIndex = onlyAt >= 0 ? args[onlyAt + 1] : null;
if (onlyIndex != null && CHARACTER[onlyIndex] == null) { console.error("no spec for " + onlyIndex); process.exit(1); }
for (const characterIndex of Object.keys(CHARACTER)) {
	if (onlyIndex != null && characterIndex !== onlyIndex) continue;
	const character = CHARACTER[characterIndex];
	const nodeArray = buildTree(character, skeleton);
	totalNodes += nodeArray.length;
	if (report) {
		console.log(characterIndex + ": " + nodeArray.length + " nodes");
		for (const node of nodeArray) console.log("   " + node.index + "  x" + node.x + " y" + node.y + (node.rankMaximum ? " rank" + node.rankMaximum : ""));
		continue;
	}
	const anchor = 'backgroundPath: "progression/' + character.marker + '-tree",';
	const at = text.indexOf(anchor);
	if (at < 0) { console.error("MISSING anchor for " + characterIndex); continue; }
	const open = text.indexOf("nodeArray: [", at);
	const start = open + "nodeArray: [".length;
	let depth = 1;
	let scan = start;
	while (scan < text.length && depth > 0) {
		const ch = text[scan];
		if (ch === '"') { scan++; while (scan < text.length && text[scan] !== '"') { if (text[scan] === "\\") scan++; scan++; } }
		else if (ch === "[") depth++;
		else if (ch === "]") depth--;
		scan++;
	}
	const end = scan - 1;
	text = text.slice(0, start) + "\n" + nodeArray.map(serialize).join("\n") + "\n\t\t\t" + text.slice(end);
	console.log("replaced " + characterIndex + " (" + nodeArray.length + " nodes)");
}
if (report) console.log("total " + totalNodes + " nodes");
else { fs.writeFileSync(CONTENT_FILE, text); console.log("written"); }
