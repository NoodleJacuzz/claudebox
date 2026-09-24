//===================================================================================================
//HONEYCOMB CATACOMBS -- ability content
//===================================================================================================
//ABILITIES ARE SPELLS THAT BELONG TO A CHARACTER. They are the non-card actions a party takes in a
//fight, and they are deliberately NOT potions: a potion is loose inventory that anyone could have
//picked up, and framing the system that way would have made every ability interchangeable and
//characterless. An ability is Severine's, or Brienne's, and opening the sub-menu under a character is how
//the player finds out what that character can do beyond their deck.
//
//Mechanically an ability is the same machinery a card is -- a target mode and an effect list resolved
//through honeycomb.resolveEffectArray -- with a different resource behind it: CHARGES, held per
//character rather than a shared pool.
//
//Fields:
//  index            unique id
//  name             printed name
//  characterIndex   whose ability it is; "neutral" for one any character may be granted
//  description      optional hand-written text. Omit it and the text is generated from the effects.
//  iconPath         sub-menu icon, resolved through honeycomb.image
//  tagArray         free-form labels, read by the same conditions cards use
//  targetMode       see honeycomb.targetModeArray
//  effectArray      what it does
//  chargeMaximum    how many uses are held at once
//  rechargeOn       when charges come back: "combatStart" | "turnStart" | "rest" | "never"
//  rechargeAmount   how many come back at that moment
//  costArray        optional resource cost ON TOP of the charge, {energy: n}
//  requirementArray [{condition, text}] -- each one thing that must be TRUE before it may be used.
//                   Reported one by one, so the plate can show which is missing.
//  spendArray       [{mechanic, amount}] taken out of the character's own meter when it is used
//  usableCondition  the one-line form of requirementArray, still honoured
//  unlockCondition  optional gate on whether the character has it at all
//
//A character lists the ones they start with in `startingAbilityArray`; outfits and equipment alter
//that list through abilityAdditionArray / abilityReplacementArray, exactly as they alter cards.
window.honeycomb = window.honeycomb || {};

honeycomb.abilityArray = [

	//---------------------------------------------------------------------------------------------------
	//The Chessmaster
	//---------------------------------------------------------------------------------------------------
	{
		index: "anastasiaTransposition",
		name: "Transposition",
		characterIndex: "anastasia",
		iconPath: "icons/chess-pawn",
		tagArray: ["summon"],
		//A piece with a twin -- standing, or a downed Pawn (the `piece` target mode).
		targetMode: "piece",
		//A command to the board, so it is the snap.
		pose: "offense",
		//A1 IS THE KIT'S FLOOR, NEVER ITS ENGINE. Pawns come from cards; this is the
		//back pocket that stops a summon being a commitment: once a combat, one piece changes alignment for
		//good -- and aimed at a downed Pawn it stands it back up as its twin, so a corpse is one guaranteed
		//body when the deck gives nothing.
		effectArray: [
			{ index: "invert" },
		],
		text: "Invert a piece's alignment, permanently. A downed Pawn is raised as its twin.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
		unlockCondition: null,
	},

	{
		index: "anastasiaKingsInvocation",
		//THE ABILITY AND THE CARD ARE DIFFERENT THINGS and may not share a name: a tooltip, a tree node
		//and a reward all look a name up in one place. The ability is the summoning of the king; the
		//card it writes into the deck is King's Invocation.
		name: "Call the King",
		characterIndex: "anastasia",
		iconPath: "icons/chess-king",
		tagArray: ["summon"],
		targetMode: "self",
		//A command to the board, so it is the snap.
		pose: "offense",
		//A2 pays off the tally. The Gambit it asks for (tuning.chessmaster.kingInvocation.pawnRequirement)
		//is reachable in any long fight, so an unlucky draft still has its build-around -- and one copy
		//per rest is what stops infinite grinding.
		//WHICH KING ANSWERS IS THE BOARD'S ANSWER: Call the King reads the field and sends whichever colour
		//has more pieces standing. A tie -- and an empty board -- goes Celestial, the safer of the two.
		effectArray: [{
			index: "branch",
			test: { index: "compare", operation: "greater",
				left: { index: "partyEntityTagCount", tag: "infernal" },
				right: { index: "partyEntityTagCount", tag: "celestial" } },
			thenArray: [{ index: "addCardToDeck", card: "anastasiaInfernalInvocation" }],
			elseArray: [{ index: "addCardToDeck", card: "anastasiaKingsInvocation" }],
		}],
		text: "Shuffle an Invocation into your deck -- Infernal if Infernal pieces outnumber Celestial, else Celestial.",
		chargeMaximum: 1,
		rechargeOn: "rest",
		rechargeAmount: 1,
		requirementArray: [
			{
				condition: { index: "mechanicAtLeast", mechanic: "gambit", amount: honeycomb.tuning.chessmaster.kingInvocation.pawnRequirement },
				text: "Needs " + honeycomb.tuning.chessmaster.kingInvocation.pawnRequirement + " Gambit.",
			},
		],
		unlockCondition: null,
	},

	//-------------------------------------------------------------------------------------------
	//Brienne -- holding the line is a decision, not a card draw.
	//-------------------------------------------------------------------------------------------
	{
		index: "brienneBrace",
		name: "Dig In",
		characterIndex: "brienne",
		iconPath: "abilities/brienne-brace",
		tagArray: ["ward"],
		targetMode: "owner",
		temporaryAmount: 12,
		effectArray: [{ index: "temporaryHealth", amount: 12 }],
		text: "Brienne plants herself. Gain 12 Temporary HP.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
	},
	{
		index: "brienneAegis",
		name: "Aegis",
		characterIndex: "brienne",
		iconPath: "abilities/brienne-wall",
		tagArray: ["ward", "support"],
		targetMode: "allAllies",
		//THE PAYOFF FOR HOLDING THE LINE: every point of Resolve becomes gold for the whole party, and
		//the turn is spent doing it. `spendMechanic` with `all` empties the meter and tallies what it
		//took, which the Temporary HP line then reads.
		effectArray: [
			{ index: "spendMechanic", mechanic: "resolve", all: true },
			//Resolve fills 1:1 on damage taken (up to 100), so each ally gains HALF of it.
			{ index: "temporaryHealth", amount: { index: "math", operation: "divide", left: { index: "tally", key: "mechanicSpent" }, right: 2 } },
			{ index: "endTurn" },
		],
		text: "Spend all Resolve. Each ally gains half that much Temporary HP. End the turn.",
		chargeMaximum: 1,
		rechargeOn: "rest",
		rechargeAmount: 1,
		//At least one point, so an empty meter is not a wasted cast.
		requirementArray: [
			{ condition: { index: "mechanicAtLeast", mechanic: "resolve", amount: 1 }, text: "Needs 1 Resolve." },
		],
		//Locked until the roster says otherwise; the unlock system reads this the way outfits do.
		unlockCondition: null,
	},

	//-------------------------------------------------------------------------------------------
	//Nettle -- attrition, on demand.
	//-------------------------------------------------------------------------------------------
	{
		index: "nettleBlight",
		name: "Blight",
		characterIndex: "nettle",
		iconPath: "abilities/nettle-blight",
		tagArray: ["spell", "poison"],
		targetMode: "enemy",
		//Every Soul Nettle holds becomes a stack of Poison, and the Souls are NOT spent: the meter is
		//read, not paid. Undead Army is the spender.
		effectArray: [{ index: "applyStatus", status: "poison", stacks: { index: "mechanic", mechanic: "harvest", of: "source" } }],
		text: "Apply Poison equal to Nettle's Souls.",
		chargeMaximum: 1,
		rechargeOn: "rest",
		rechargeAmount: 1,
		requirementArray: [
			{ condition: { index: "mechanicAtLeast", mechanic: "harvest", amount: 1 }, text: "Needs 1 Soul." },
		],
	},
	{
		index: "nettleGraveward",
		name: "Undead Army",
		characterIndex: "nettle",
		iconPath: "abilities/nettle-graveward",
		tagArray: ["spell", "ritual"],
		targetMode: "none",
		//Spend every Soul, then one hit at a random enemy per Soul. `repeat` reads the tally the spend
		//wrote, so the number of hits is exactly what was spent.
		effectArray: [
			{ index: "spendMechanic", mechanic: "harvest", all: true },
			{ index: "repeat", times: { index: "tally", key: "mechanicSpent" },
				effectArray: [{ index: "damage", amount: 1, targetOverride: "randomEnemy", vfx: "none" }] },
		],
		text: "Spend all Souls. Deal 1 damage to a random enemy for each Soul spent.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
		requirementArray: [
			{ condition: { index: "mechanicAtLeast", mechanic: "harvest", amount: 1 }, text: "Needs 1 Soul." },
		],
	},

	//-------------------------------------------------------------------------------------------
	//Severine -- spending health for tempo, without a card in hand.
	//-------------------------------------------------------------------------------------------
	{
		index: "severineBloodTap",
		name: "Blood Tap",
		characterIndex: "severine",
		iconPath: "abilities/severine-siphon",
		tagArray: ["blood", "spell"],
		targetMode: "owner",
		//Pays her own life for Strength, three times a fight. Thirst is built by fighting and read by
		//Quicken; Blood Tap is the bloodletting that starts the exchange.
		effectArray: [
			{ index: "loseHealth", amount: 5, targetOverride: "owner" },
			{ index: "applyStatus", status: "strength", stacks: 1, targetOverride: "owner" },
		],
		text: "Severine loses 5 HP and gains 1 Strength.",
		chargeMaximum: 3,
		rechargeOn: "combatStart",
		rechargeAmount: 3,
	},
	{
		index: "severineQuicken",
		name: "Quicken",
		characterIndex: "severine",
		iconPath: "abilities/severine-quicken",
		tagArray: ["blood", "ritual"],
		targetMode: "owner",
		//One card for each lit Thirst orb: the payoff for the fight going Severine's way.
		effectArray: [{ index: "drawCards", amount: { index: "mechanicOrbs", of: "source" } }],
		text: "Draw a card for each lit Thirst orb.",
		chargeMaximum: 2,
		rechargeOn: "rest",
		rechargeAmount: 2,
	},

	//-------------------------------------------------------------------------------------------
	//Three characters, each spending its own mechanic.
	//-------------------------------------------------------------------------------------------
	{
		index: "cinderBackflip",
		name: "Backflip",
		characterIndex: "cinder",
		iconPath: "abilities/cinder-vault",
		tagArray: ["spell"],
		targetMode: "owner",
		//Steps to the back of the line, once a fight. The movement itself builds Stride, which Phoenix
		//Dive then cashes in.
		effectArray: [{ index: "shiftParty", shift: "back", targetOverride: "owner", pace: "charge" }],
		text: "Cinder moves to the back.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
	},
	{
		//Absolve takes the whole party's Lust at once -- relief for them, and a large step toward her own
		//break -- for 3 Devotion, about two of her cards.
		index: "clemenceAbsolve",
		name: "Absolve",
		characterIndex: "clemence",
		iconPath: "abilities/clemence-absolve",
		tagArray: ["spell", "support"],
		targetMode: "owner",
		//Takes the Lust her allies shed, so she is the one who pays for it. `lustRemoved` is the tally the
		//soothe above writes, so the amount she takes is exactly what they lost.
		effectArray: [
			{ index: "soothe", amount: 5, targetOverride: "otherAllies" },
			{ index: "heal", amount: 5, targetOverride: "allAllies" },
			{ index: "lust", amount: { index: "tally", key: "lustRemoved" }, lustTagArray: [] },
		],
		text: "Your other allies lose up to 5 Lust each and all allies heal 5 HP. Clemence takes the Lust they lost.",
		chargeMaximum: 1,
		rechargeOn: "rest",
		rechargeAmount: 1,
	},
	{
		index: "cassadoraGlimpse",
		name: "Glimpse",
		characterIndex: "cassadora",
		iconPath: "abilities/cassadora-glimpse",
		tagArray: ["spell"],
		targetMode: "enemy",
		effectArray: [{ index: "rerollIntent" }],
		text: "An enemy picks a new intent.",
		chargeMaximum: 1,
		rechargeOn: "rest",
		rechargeAmount: 1,
	},

	//-------------------------------------------------------------------------------------------
	//Ability 2 -- the tree capstone for the three characters that had no second ability.
	//-------------------------------------------------------------------------------------------
	{
		index: "cassadoraMagicTrick",
		name: "Magic Trick",
		characterIndex: "cassadora",
		iconPath: "abilities/cassadora-glimpse",
		tagArray: ["spell", "turncoat"],
		targetMode: "owner",
		//One move off the enemies' own kits per symbol in the Orb, distinct. The move arrives as a stolen card
		//(exhausts, plays for the party), so the number is a mechanic read and not a new field. Reading the
		//Orb spends it.
		effectArray: [
			{ index: "conjureEnemyMove", count: { index: "mechanic", mechanic: "foresight", of: "source" } },
			{ index: "spendMechanic", mechanic: "foresight", all: true },
		],
		text: "Add a random enemy move to your hand for each symbol in your Orb. They exhaust. Empties the Orb. Once per rest.",
		chargeMaximum: 1,
		rechargeOn: "rest",
		rechargeAmount: 1,
	},
	{
		index: "cinderPhoenixDive",
		name: "Phoenix Dive",
		characterIndex: "cinder",
		iconPath: "abilities/cinder-vault",
		tagArray: ["spell"],
		targetMode: "enemy",
		effectArray: [
			{ index: "shiftParty", shift: "front", targetOverride: "owner", pace: "charge" },
			{ index: "spendMechanic", mechanic: "stride", all: true },
			//9, plus the Stride actually spent for every place she crossed.
			{ index: "damage", amount: { index: "math", operation: "add", left: 9,
				right: { index: "math", operation: "multiply",
					left: { index: "tally", key: "mechanicSpent" },
					right: { index: "tally", key: "ranksMoved" } } } },
		],
		text: "Spend all Stride. Move to the front. Deal 9 damage, plus the Stride spent for every place crossed.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
	},
	{
		index: "clemenceOneWithNothing",
		name: "One with Nothing",
		characterIndex: "clemence",
		iconPath: "abilities/clemence-absolve",
		tagArray: ["spell"],
		targetMode: "owner",
		effectArray: [
			{ index: "spendMechanic", mechanic: "devotion", all: true },
			//Devotion fills 1:1 on healing given (up to 100); half keeps the cost a push, not a death.
			{ index: "loseHealth", amount: { index: "math", operation: "divide", left: { index: "tally", key: "mechanicSpent" }, right: 2 }, targetOverride: "owner" },
		],
		text: "Lose all Devotion, then lose half that much life. Once per combat.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
	},

	//-------------------------------------------------------------------------------------------
	//OUTFIT A2 LINES. An outfit swaps the tree's Ability 2 for one of these through
	//`treeAbilityReplacementArray`, so each exists only once the A2 node is bought. Names are placeholders;
	//charges follow the A2 they replace.
	//-------------------------------------------------------------------------------------------
	{
		//Siegeplate.
		index: "brienneBatteringRam",
		name: "Battering Ram",
		characterIndex: "brienne",
		iconPath: "abilities/brienne-wall",
		tagArray: ["ward"],
		targetMode: "none",
		effectArray: [
			{ index: "spendMechanic", mechanic: "resolve", all: true },
			{ index: "damage", amount: { index: "tally", key: "mechanicSpent" }, targetOverride: "frontEnemy" },
		],
		text: "Spend all Resolve. Deal that much damage to the front enemy.",
		chargeMaximum: 1,
		rechargeOn: "rest",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "resolve", amount: 1 }, text: "Needs 1 Resolve." }],
	},
	{
		//Almoner.
		index: "brienneAlmsgiving",
		name: "Almsgiving",
		characterIndex: "brienne",
		iconPath: "abilities/brienne-wall",
		tagArray: ["ward", "support"],
		targetMode: "none",
		effectArray: [
			{ index: "spendMechanic", mechanic: "resolve", all: true },
			{ index: "soothe", amount: 4, targetOverride: "otherAllies" },
			{ index: "spendTemporaryHealth", amount: 4, targetOverride: "otherAllies" },
		],
		text: "Spend all Resolve. Every other ally removes 4 Lust and spends up to 4 Temporary HP.",
		chargeMaximum: 1,
		rechargeOn: "rest",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "resolve", amount: 1 }, text: "Needs 1 Resolve." }],
	},
	{
		//Rotsinger.
		index: "nettleRotFeast",
		name: "Rot Feast",
		characterIndex: "nettle",
		iconPath: "abilities/nettle-graveward",
		tagArray: ["spell", "ritual"],
		targetMode: "none",
		effectArray: [
			{ index: "spendMechanic", mechanic: "harvest", all: true },
			{ index: "heal", amount: { index: "tally", key: "mechanicSpent" }, targetOverride: "allAllies" },
		],
		text: "Spend all Souls. The party heals 1 for each Soul spent.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "harvest", amount: 1 }, text: "Needs 1 Soul." }],
	},
	{
		//Sporemother.
		index: "nettleSporeBloom",
		name: "Spore Bloom",
		characterIndex: "nettle",
		iconPath: "abilities/nettle-graveward",
		tagArray: ["spell", "ritual"],
		targetMode: "none",
		effectArray: [
			{ index: "spendMechanic", mechanic: "harvest", all: true },
			{ index: "repeat", times: { index: "tally", key: "mechanicSpent" },
				effectArray: [{ index: "applyStatus", status: "poison", stacks: 1, targetOverride: "randomEnemy" }] },
		],
		text: "Spend all Souls. Apply 1 Poison to a random enemy for each Soul spent.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "harvest", amount: 1 }, text: "Needs 1 Soul." }],
	},
	{
		//Nightshade.
		index: "nettleNightBloom",
		name: "Night Bloom",
		characterIndex: "nettle",
		iconPath: "abilities/nettle-graveward",
		tagArray: ["spell", "ritual"],
		targetMode: "none",
		effectArray: [
			{ index: "spendMechanic", mechanic: "harvest", all: true },
			{ index: "forEachTarget", over: "allEnemies", effectArray: [
				{ index: "lust", amount: { index: "tally", key: "mechanicSpent" }, condition: { index: "hasStatus", of: "target", status: "poison" } },
			] },
		],
		text: "Spend all Souls. Every Poisoned enemy takes that much Lust.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "harvest", amount: 1 }, text: "Needs 1 Soul." }],
	},
	{
		//Huntress.
		index: "severineHuntersRush",
		name: "Hunter's Rush",
		characterIndex: "severine",
		iconPath: "abilities/severine-quicken",
		tagArray: ["blood", "ritual"],
		targetMode: "owner",
		effectArray: [{ index: "gainResource", resource: "energy", amount: 2 }],
		text: "Gain 2 Energy.",
		chargeMaximum: 2,
		rechargeOn: "rest",
		rechargeAmount: 2,
		requirementArray: [{ condition: { index: "mechanicOrbsLit", of: "source", mechanic: "thirst" }, text: "Needs all three Thirst orbs lit." }],
	},
	{
		//Crimson Covenant.
		index: "severineCovenantRite",
		name: "Covenant Rite",
		characterIndex: "severine",
		iconPath: "abilities/severine-quicken",
		tagArray: ["blood", "ritual"],
		targetMode: "owner",
		effectArray: [{ index: "heal", amount: { index: "missingHealth", of: "source" }, targetOverride: "owner" }],
		text: "Regain all your health.",
		chargeMaximum: 1,
		rechargeOn: "rest",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicOrbsLit", of: "source", mechanic: "thirst" }, text: "Needs all three Thirst orbs lit." }],
	},
	{
		//Devotee.
		index: "clemenceConsecration",
		name: "Consecration",
		characterIndex: "clemence",
		iconPath: "abilities/clemence-absolve",
		tagArray: ["spell", "support"],
		targetMode: "none",
		effectArray: [
			{ index: "spendMechanic", mechanic: "devotion", all: true },
			{ index: "temporaryHealth", targetOverride: "otherAllies", amount: { index: "math", operation: "divide",
				left: { index: "tally", key: "mechanicSpent" },
				right: { index: "math", operation: "subtract", left: { index: "count", collection: "livingAllies" }, right: 1 } } },
		],
		text: "Spend all Devotion. Split that much Temporary HP across your other allies.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "devotion", amount: 1 }, text: "Needs 1 Devotion." }],
	},
	{
		//Ecstatic.
		index: "clemenceAbandon",
		name: "Abandon",
		characterIndex: "clemence",
		iconPath: "abilities/clemence-absolve",
		tagArray: ["spell"],
		targetMode: "owner",
		effectArray: [
			{ index: "spendMechanic", mechanic: "devotion", all: true },
			{ index: "lust", amount: { index: "tally", key: "mechanicSpent" }, targetOverride: "owner", lustTagArray: [] },
		],
		text: "Spend all Devotion. Gain that much Lust.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "devotion", amount: 1 }, text: "Needs 1 Devotion." }],
	},
	{
		//Abbess.
		index: "clemenceSharedVows",
		name: "Shared Vows",
		characterIndex: "clemence",
		iconPath: "abilities/clemence-absolve",
		tagArray: ["spell"],
		targetMode: "none",
		effectArray: [
			{ index: "spendMechanic", mechanic: "devotion", all: true },
			{ index: "lust", amount: { index: "math", operation: "divide", left: { index: "tally", key: "mechanicSpent" }, right: 2 }, targetOverride: "otherAllies" },
		],
		text: "Spend all Devotion. Every other ally gains half that much Lust.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "devotion", amount: 1 }, text: "Needs 1 Devotion." }],
	},
	{
		//Hedge Witch. Any symbol counts.
		index: "cassadoraHexStorm",
		name: "Hex Storm",
		characterIndex: "cassadora",
		iconPath: "abilities/cassadora-glimpse",
		tagArray: ["spell"],
		targetMode: "none",
		effectArray: [
			{ index: "repeat", times: { index: "mechanic", mechanic: "foresight", of: "source" },
				effectArray: [{ index: "randomStatus", statusArray: ["weak", "sundered"], stacks: 1, targetOverride: "allEnemies" }] },
			{ index: "spendMechanic", mechanic: "foresight", all: true },
		],
		text: "For each symbol in your Orb, every enemy gains 1 Weak or Sundered at random. Empties the Orb. Once per rest.",
		chargeMaximum: 1,
		rechargeOn: "rest",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "foresight", amount: 1 }, text: "Needs 1 symbol in the Orb." }],
	},
	{
		//Soothsayer. Name is a placeholder.
		index: "cassadoraSecondSight",
		name: "Second Sight",
		characterIndex: "cassadora",
		iconPath: "abilities/cassadora-glimpse",
		tagArray: ["spell"],
		targetMode: "none",
		effectArray: [
			{ index: "drawMatchingCards", symbolMechanic: "foresight" },
			{ index: "spendMechanic", mechanic: "foresight", all: true },
		],
		text: "For each symbol in your Orb, draw a card of that type. Empties the Orb. Once per rest.",
		chargeMaximum: 1,
		rechargeOn: "rest",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "foresight", amount: 1 }, text: "Needs 1 symbol in the Orb." }],
	},
	{
		//Grifter. Name is a placeholder.
		index: "cassadoraVanishingAct",
		name: "Vanishing Act",
		characterIndex: "cassadora",
		iconPath: "abilities/cassadora-glimpse",
		tagArray: ["spell"],
		targetMode: "none",
		effectArray: [
			{ index: "chooseCards", from: "handCard", prompt: "Erase which card?", cardTypeFromMechanic: "foresight",
				effectArray: [{ index: "exhaustCard" }, { index: "removeTargetCardFromDeck" }] },
			{ index: "spendMechanic", mechanic: "foresight", all: true },
		],
		text: "Choose a card in your hand whose type is in your Orb. Erase it from your deck. Empties the Orb. Once per rest.",
		chargeMaximum: 1,
		rechargeOn: "rest",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "foresight", full: true }, text: "Needs a full Orb." }],
	},
	{
		//Vanguard Plume.
		index: "cinderPhoenixDiveStrength",
		name: "Plumefall",
		characterIndex: "cinder",
		iconPath: "abilities/cinder-vault",
		tagArray: ["spell"],
		targetMode: "enemy",
		effectArray: [
			{ index: "shiftParty", shift: "front", targetOverride: "owner", pace: "charge" },
			{ index: "consumeStatus", status: "strength", targetOverride: "owner" },
			{ index: "damage", amount: { index: "math", operation: "add", left: 9,
				right: { index: "math", operation: "multiply",
					left: { index: "tally", key: "consumed" },
					right: { index: "tally", key: "ranksMoved" } } } },
		],
		text: "Spend all Strength. Move to the front. Deal 9 damage, plus the Strength spent for every place crossed.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
	},
	{
		//Marshal.
		index: "cinderMarshalsCall",
		name: "Marshal's Call",
		characterIndex: "cinder",
		iconPath: "abilities/cinder-vault",
		tagArray: ["spell", "support"],
		targetMode: "allyOther",
		effectArray: [
			{ index: "spendMechanic", mechanic: "stride", all: true },
			{ index: "shiftParty", shift: "front" },
			{ index: "applyStatus", status: "fleetingStrength", stacks: { index: "tally", key: "mechanicSpent" } },
		],
		text: "Spend all Stride. Another ally moves to the front and gains that much Strength this turn.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "stride", amount: 1 }, text: "Needs 1 Stride." }],
	},
	{
		//Ashfall. The hits are counted from the hand before it is discarded.
		index: "cinderScorchedEarth",
		name: "Scorched Earth",
		characterIndex: "cinder",
		iconPath: "abilities/cinder-vault",
		tagArray: ["spell"],
		targetMode: "enemy",
		effectArray: [
			{ index: "spendMechanic", mechanic: "stride", all: true },
			{ index: "repeat", times: { index: "count", collection: "hand" },
				effectArray: [{ index: "damage", amount: { index: "tally", key: "mechanicSpent" } }] },
			{ index: "discardCards", amount: { index: "count", collection: "hand" } },
		],
		text: "Spend all Stride. Discard your hand. Deal the Stride spent as damage once for each card discarded.",
		chargeMaximum: 1,
		rechargeOn: "combatStart",
		rechargeAmount: 1,
		requirementArray: [{ condition: { index: "mechanicAtLeast", mechanic: "stride", amount: 1 }, text: "Needs 1 Stride." }],
	},

	//-------------------------------------------------------------------------------------------
	//Neutral -- granted by equipment, so an ability can arrive from gear rather than a character.
	//-------------------------------------------------------------------------------------------
	{
		index: "neutralSecondWind",
		name: "Second Wind",
		characterIndex: "neutral",
		iconPath: "abilities/neutral-secondwind",
		tagArray: ["support"],
		targetMode: "owner",
		effectArray: [{ index: "heal", amount: 8 }],
		text: "Heal 8 HP.",
		chargeMaximum: 1,
		rechargeOn: "rest",
		rechargeAmount: 1,
	},
];
