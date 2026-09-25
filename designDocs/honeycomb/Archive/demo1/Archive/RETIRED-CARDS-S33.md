# Retired cards — session 33

Retired by the card pool overhaul (`rework/CARD-POOL-01.md` §5). `honeycomb.retiredCardArray` carries old saves over to
the replacement named there. Definitions exactly as they were:

## brienneSteady → brienneAlms

```js
	{
		//Somebody in the party has to be able to answer lust, and the defender is who it falls to.
		index: "brienneSteady",
		name: "Steady",
		characterIndex: "brienne",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/brienne-guard",
		effectArray: [{ index: "soothe", amount: 7 }],
		upgradeArray: [
			{ name: "Steady+", effectArray: [{ index: "soothe", amount: 11 }] },
		],
	},
```

## brienneShelter → brienneIntercept

```js
	{
		index: "brienneShelter",
		name: "Shelter",
		characterIndex: "brienne",
		rarity: "common",
		costArray: { energy: 2 },
		targetMode: "ally",
		layout: "vertical",
		artPath: "cards/art/brienne-bulwark",
		//Round 07, second pass: the third line was a single-use Composure ("a status done once is not a
		//named status"). It is now positional, which ties Shelter to whoever Cinder put at the front.
		effectArray: [
			{ index: "temporaryHealth", amount: 8 },
			{ index: "soothe", amount: 6 },
			{ index: "temporaryHealth", amount: 4, condition: { index: "atRank", of: "target", rank: 0 } },
		],
		text: "An ally gains 8 Temporary HP and loses 6 Lust. If they are at the front, 4 more Temporary HP.",
		upgradeArray: [
			{
				name: "Shelter+",
				effectArray: [
					{ index: "temporaryHealth", amount: 12 },
					{ index: "soothe", amount: 9 },
					{ index: "temporaryHealth", amount: 6, condition: { index: "atRank", of: "target", rank: 0 } },
				],
				text: "An ally gains 12 Temporary HP and loses 9 Lust. If they are at the front, 6 more Temporary HP.",
			},
		],
	},
```

## nettleSoulHarvest → nettleGraveChoice

```js
	{
		index: "nettleSoulHarvest",
		name: "Soul Harvest",
		characterIndex: "nettle",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/nettle-harvest",
		exhausts: true,
		//Round 07, second pass: draw 2 AND a free Energy was a generic instant-pick in any deck. The Energy
		//now needs the necromancer to have gathered Souls, so it belongs to her kit rather than to everyone.
		effectArray: [
			{ index: "drawCards", amount: 2 },
			{ index: "gainResource", resource: "energy", amount: 1, condition: { index: "mechanicAtLeast", mechanic: "harvest", amount: 2 } },
			{ index: "exhaustSelf" },
		],
		text: "Draw 2 cards. If you have 2 or more Souls, gain 1 Energy. Exhaust.",
	},
```

## severineStrike → severineBloodthirst

```js
	//-------------------------------------------------------------------------------------------
	//Severine -- Bloodletter. BLOOD: health taken, paid and given.
	//-------------------------------------------------------------------------------------------
	{
		//Kept as a plain core attack; the Corsair outfit still turns Claw Flurry into it.
		index: "severineStrike",
		name: "Rake",
		characterIndex: "severine",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-strike",
		effectArray: [{ index: "damage", amount: 7 }],
		upgradeArray: [
			{ name: "Rake+", effectArray: [{ index: "damage", amount: 10 }] },
		],
	},
```

## severineEnthrall → severineBloodthirst

```js
	{
		//THE PARTY'S FIRST LUST ATTACK (round 06, item 10). Charm, one of the five lust tags.
		index: "severineEnthrall",
		name: "Enthrall",
		characterIndex: "severine",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-strike",
		tagArray: ["charm"],
		effectArray: [{ index: "lust", amount: 7 }],
		upgradeArray: [
			{ name: "Enthrall+", effectArray: [{ index: "lust", amount: 10 }] },
		],
	},
```

## severineBloodlet → severineBloodPrice

```js
	{
		//SADISM, and the cross-party hook the brief names first: Brienne's gold soaks it, and every hit she
		//takes this way is Resolve.
		index: "severineBloodlet",
		name: "Bloodlet",
		characterIndex: "severine",
		archetype: "bloodletting",
		rarity: "common",
		costArray: { energy: 0 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/severine-bloodlet",
		effectArray: [
			{ index: "damage", amount: 7 },
			{ index: "drawCards", amount: 2 },
		],
		text: "Deal {damage:7} damage to an ally. Draw 2 cards.",
		upgradeArray: [
			{
				name: "Bloodlet+",
				effectArray: [
					{ index: "damage", amount: 7 },
					{ index: "drawCards", amount: 3 },
				],
				text: "Deal {damage:7} damage to an ally. Draw 3 cards.",
			},
		],
	},
```

## severineVitalFlow → severineHeartsblood

```js
	{
		index: "severineVitalFlow",
		name: "Vital Flow",
		characterIndex: "severine",
		archetype: "transfusion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "allAllies",
		layout: "horizontal",
		artPath: "cards/art/severine-drain",
		effectArray: [{ index: "heal", amount: 4, overflowToTemporary: true }],
		upgradeArray: [
			{ name: "Vital Flow+", effectArray: [{ index: "heal", amount: 7, overflowToTemporary: true }] },
		],
	},
```

## cinderFallBack → cinderBurnBright

```js
	//-------------------------------------------------------------------------------------------
	//Cinder -- Lancer. PARTY ORDER: where she stands, and where she puts everyone else.
	//Her attacks do not move her (partyShiftByCardType), so every step she takes is one a card chose.
	//-------------------------------------------------------------------------------------------
	{
		index: "cinderFallBack",
		name: "Fall Back",
		characterIndex: "cinder",
		rarity: "common",
		costArray: { energy: 0 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cinder-retreat",
		partyShift: "back",
		effectArray: [{ index: "drawCards", amount: 1 }],
		upgradeArray: [
			{ name: "Fall Back+", effectArray: [{ index: "drawCards", amount: 2 }] },
		],
	},
```

## cinderEmberwake → cinderPhoenixHeart

```js
	{
		//ENHANCES THE PRIMITIVE: every step she takes, for any reason, burns the front of the enemy line.
		index: "cinderEmberwake",
		name: "Trailfire",
		characterIndex: "cinder",
		archetype: "charge",
		type: "passive",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/cinder-comet",
		effectArray: [{ index: "applyStatus", status: "emberwake", stacks: 1 }],
		upgradeArray: [
			{ name: "Trailfire+", costArray: { energy: 0 } },
		],
	},
```

## cinderCometLance → cinderSunspear

```js
	{
		index: "cinderCometLance",
		name: "Comet Lance",
		characterIndex: "cinder",
		archetype: "charge",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "vertical",
		artPath: "cards/art/cinder-comet",
		effectArray: [
			{ index: "shiftParty", shift: "back", targetOverride: "owner", pace: "charge" },
			{ index: "shiftParty", shift: "front", targetOverride: "owner", pace: "charge" },
			{ index: "damage", amount: { index: "math", operation: "multiply", left: { index: "tally", key: "ranksMoved" }, right: 4 } },
		],
		text: "Cinder falls back, then charges to the front. Deal 4 damage to ALL enemies for every place she crossed.",
		upgradeArray: [
			{
				name: "Comet Lance+",
				effectArray: [
					{ index: "shiftParty", shift: "back", targetOverride: "owner", pace: "charge" },
					{ index: "shiftParty", shift: "front", targetOverride: "owner", pace: "charge" },
					{ index: "damage", amount: { index: "math", operation: "multiply", left: { index: "tally", key: "ranksMoved" }, right: 5 } },
				],
				text: "Cinder falls back, then charges to the front. Deal 5 damage to ALL enemies for every place she crossed.",
			},
		],
	},
```

## clemencePenitence → clemencePrayer

```js
	{
		index: "clemencePenitence",
		name: "Penitence",
		characterIndex: "clemence",
		archetype: "devotion",
		rarity: "common",
		costArray: { energy: 0 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-martyr",
		brokenCard: "clemencePenitenceBroken",
		effectArray: [
			{ index: "gainResource", resource: "energy", amount: 2 },
			{ index: "lust", amount: 10, lustTagArray: ["penance"] },
		],
		text: "Gain 2 Energy. Clemence gains 10 Lust.",
		upgradeArray: [
			{
				name: "Penitence+",
				effectArray: [
					{ index: "gainResource", resource: "energy", amount: 2 },
					{ index: "drawCards", amount: 1 },
					{ index: "lust", amount: 10, lustTagArray: ["penance"] },
				],
				text: "Gain 2 Energy and draw 1 card. Clemence gains 10 Lust.",
			},
		],
	},
```

## clemenceTakeBurden → clemenceMercy

```js
	{
		//The Confessor's own fantasy: the sin comes out of them and into her.
		index: "clemenceTakeBurden",
		name: "Take Their Burden",
		characterIndex: "clemence",
		archetype: "devotion",
		rarity: "common",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-martyr",
		brokenCard: "clemenceTakeBurdenBroken",
		effectArray: [
			{ index: "soothe", amount: 8 },
			{ index: "heal", amount: 4 },
			{ index: "lust", amount: { index: "math", operation: "add", left: 2, right: { index: "tally", key: "lustRemoved" } }, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "Move up to 8 Lust from an ally onto Clemence, plus 2. They heal 4 HP.",
		upgradeArray: [
			{
				name: "Take Their Burden+",
				effectArray: [
					{ index: "soothe", amount: 12 },
					{ index: "heal", amount: 6 },
					{ index: "lust", amount: { index: "math", operation: "add", left: 2, right: { index: "tally", key: "lustRemoved" } }, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "Move up to 12 Lust from an ally onto Clemence, plus 2. They heal 6 HP.",
			},
		],
	},
```

## clemenceYearning → clemenceConfession

```js
	{
		index: "clemenceYearning",
		name: "Yearning",
		characterIndex: "clemence",
		archetype: "rapture",
		rarity: "rare",
		costArray: { energy: 1 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/clemence-confess",
		brokenCard: "clemenceYearningBroken",
		effectArray: [
			{ index: "applyStatus", status: "sensitive", stacks: 1 },
			{ index: "lust", amount: 6, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "Apply 1 Sensitive to ALL enemies. Clemence gains 6 Lust.",
		upgradeArray: [
			{
				name: "Yearning+",
				effectArray: [
					{ index: "applyStatus", status: "sensitive", stacks: 2 },
					{ index: "lust", amount: 6, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "Apply 2 Sensitive to ALL enemies. Clemence gains 6 Lust.",
			},
		],
	},
```

## cassadoraFizzle → cassadoraWheelOfFortune

```js
	//-------------------------------------------------------------------------------------------
	//Cassadora -- Hexer. INTENTS: what the enemy is about to do, rewritten.
	//Nothing of hers touches poison, the dead or souls: the skull at her hand sees, it does not reap.
	//-------------------------------------------------------------------------------------------
	{
		index: "cassadoraFizzle",
		name: "Fizzle",
		characterIndex: "cassadora",
		archetype: "hex",
		rarity: "common",
		costArray: { energy: 2 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-hex",
		exhausts: true,
		effectArray: [{ index: "cancelIntent" }],
		text: "Cancel an enemy's intent. Exhaust.",
		upgradeArray: [
			{ name: "Fizzle+", costArray: { energy: 1 } },
		],
	},
```

## cassadoraStillness → cassadoraWheelOfFortune

```js
	{
		index: "cassadoraStillness",
		brokenCard: "cassadoraStillnessWithin",
		name: "Hex of Stillness",
		characterIndex: "cassadora",
		archetype: "hex",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "allEnemies",
		layout: "vertical",
		artPath: "cards/art/cassadora-fate",
		exhausts: true,
		effectArray: [{ index: "cancelIntent" }],
		text: "Cancel the intent of ALL enemies. Exhaust.",
		upgradeArray: [
			{ name: "Hex of Stillness+", costArray: { energy: 1 } },
		],
	},
```

## cassadoraCrystalGaze → cassadoraSleightOfHand

```js
	//--- Hex: blunt, re-roll and cancel ---
	{
		index: "cassadoraCrystalGaze",
		name: "Crystal Gaze",
		characterIndex: "cassadora",
		archetype: "hex",
		rarity: "common",
		costArray: { energy: 0 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/cassadora-fate",
		effectArray: [{ index: "drawCards", amount: { index: "attackingOpponents" } }],
		text: "Draw 1 card for every enemy intending to attack.",
		upgradeArray: [
			{
				name: "Crystal Gaze+",
				effectArray: [{ index: "drawCards", amount: { index: "math", operation: "add", left: 1, right: { index: "attackingOpponents" } } }],
				text: "Draw 1 card, plus 1 for every enemy intending to attack.",
			},
		],
	},
```

## cassadoraPuppetStrings → cassadoraAccomplice

```js
	{
		index: "cassadoraPuppetStrings",
		name: "Puppet Strings",
		characterIndex: "cassadora",
		archetype: "turncoat",
		type: "passive",
		rarity: "rare",
		costArray: { energy: 2 },
		targetMode: "owner",
		layout: "vertical",
		artPath: "cards/art/cassadora-fate",
		effectArray: [{ index: "applyStatus", status: "puppeteer", stacks: 1 }],
		text: "At the end of your turn, a random enemy becomes a Turncoat.",
		upgradeArray: [
			{ name: "Puppet Strings+", costArray: { energy: 1 } },
		],
	},
```

## clemenceTakeBurdenBroken → (broken form, deleted)

```js
	{
		index: "clemenceTakeBurdenBroken",
		name: "Shared Rapture",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-martyr",
		effectArray: [
			{ index: "soothe", amount: 8, targetOverride: "owner" },
			{ index: "temporaryHealth", amount: { index: "math", operation: "add", left: 2, right: { index: "tally", key: "lustRemoved" } } },
		],
		text: "Spend up to 8 of Clemence's Lust. An ally gains 2 Temporary HP plus that much.",
	},
```

## clemencePenitenceBroken → (broken form, deleted)

```js
	{
		index: "clemencePenitenceBroken",
		name: "Indulgence",
		characterIndex: "clemence",
		rarity: "broken",
		costArray: { energy: 0 },
		targetMode: "owner",
		layout: "horizontal",
		artPath: "cards/art/clemence-martyr",
		effectArray: [
			{ index: "soothe", amount: 12 },
			{ index: "gainResource", resource: "energy", amount: { index: "math", operation: "divide", left: { index: "tally", key: "lustRemoved" }, right: 6 } },
			{ index: "drawCards", amount: 1 },
		],
		text: "Spend up to 12 of Clemence's Lust. Gain 1 Energy for every 6 spent. Draw 1 card.",
	},
```

## clemenceYearningBroken → (broken form, deleted)

```js
	{
		index: "clemenceYearningBroken",
		name: "Swoon",
		characterIndex: "clemence",
		rarity: "broken",
		tagArray: ["exposure"],
		costArray: { energy: 1 },
		targetMode: "allEnemies",
		layout: "horizontal",
		artPath: "cards/art/clemence-confess",
		effectArray: [
			{ index: "soothe", amount: 12, targetOverride: "owner" },
			{ index: "lust", amount: { index: "math", operation: "divide", left: { index: "tally", key: "lustRemoved" }, right: 2 } },
		],
		text: "Spend up to 12 of Clemence's Lust. ALL enemies take half that much Lust.",
	},
```
