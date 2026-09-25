# Retired card definitions (session 31, 2026-09-18)

Culled from `honeycomb-content-cards.js` as duplicates: each shared its name with the live card on its
right, and (except Claw Flurry) its rules too. Offering's broken form, Outpouring, was kept and now
belongs to Grant, the starter that took Offering's place. Kept here verbatim in case one is
wanted back. `honeycomb.retiredCardArray` maps each old index to its replacement so old saves load.

| Retired | Replaced by |
|---|---|
| `brienneStrike` | `brienneCleave` |
| `brienneGuard` | `brienneGrit` |
| `nettleWither` | `nettleVenomTouch` |
| `severineDrain` | `severineQuaff` |
| `severineFlurry` | `severineRend` |
| `cinderThrust` | `cinderImpale` |
| `cinderChangePlaces` | `cinderSwitch` |
| `clemenceOffering` | `clemenceGrant` |
| `cassadoraBolt` | `cassadoraWispBolt` |
| `cassadoraSecondThoughts` | `cassadoraUnravel` |

```js
	{
		index: "brienneStrike",
		name: "Sword Strike",
		characterIndex: "brienne",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/brienne-strike",
		effectArray: [{ index: "damage", amount: 6 }],
		upgradeArray: [
			{ name: "Sword Strike+", effectArray: [{ index: "damage", amount: 9 }] },
		],
	},
	{
		//BRIENNE'S PRIMARY EXPRESSION: gold where it is needed. Dragged onto any ally, Brienne included.
		index: "brienneGuard",
		brokenCard: "brienneBacksToWall",
		name: "Brace",
		characterIndex: "brienne",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/brienne-guard",
		effectArray: [{ index: "temporaryHealth", amount: 6 }],
		upgradeArray: [
			{ name: "Brace+", effectArray: [{ index: "temporaryHealth", amount: 10 }] },
		],
	},
	{
		//NETTLE'S PRIMARY EXPRESSION: stack it and let the clock run.
		index: "nettleWither",
		name: "Wither",
		characterIndex: "nettle",
		rarity: "starter",
		tagArray: ["necromancy"],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/nettle-wither",
		effectArray: [{ index: "applyStatus", status: "poison", stacks: 3 }],
		upgradeArray: [
			{ name: "Wither+", effectArray: [{ index: "applyStatus", status: "poison", stacks: 5 }] },
		],
	},
	{
		//SEVERINE'S PRIMARY EXPRESSION, and THE DRAIN PRECEDENT: heals for what the hit ACTUALLY did.
		index: "severineDrain",
		name: "Drain",
		characterIndex: "severine",
		rarity: "starter",
		//FEEDBACK-06 item 20: a BOOSTED rate. The Huntress is the feast outfit, so its Drain is offered
		//twice as often while she wears it.
		offerWeightArray: [{ condition: { index: "wearsOutfit", outfit: "huntress", character: "severine" }, multiplier: 2 }],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-drain",
		//Round 07 (second pass): her healing is NOT the problem; her life PRICES were too cheap. Drain
		//takes the full damage back, and Blood Pact / Bloodlet / Heartsblood / Transfusion cost more.
		effectArray: [
			{ index: "damage", amount: 4 },
			{ index: "heal", amount: { index: "damageDealt" }, targetOverride: "owner" },
		],
		upgradeArray: [
			{
				name: "Drain+",
				effectArray: [
					{ index: "damage", amount: 6 },
					{ index: "heal", amount: { index: "damageDealt" }, targetOverride: "owner" },
				],
			},
		],
	},
	{
		//Multi-hit through the repeat verb, so each hit is heard separately: Infected, Thorns, Armament.
		index: "severineFlurry",
		name: "Claw Flurry",
		characterIndex: "severine",
		rarity: "common",
		//FEEDBACK-06 item 20: a REDUCED rate. Claws sit oddly on the Blood Saint, so they are offered
		//half as often while she wears it.
		offerWeightArray: [{ condition: { index: "wearsOutfit", outfit: "bloodSaint", character: "severine" }, multiplier: 0.5 }],
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/severine-flurry",
		effectArray: [{
			index: "repeat", times: 3,
			effectArray: [{ index: "damage", amount: 3, vfx: "none" }],
		}],
		text: "Deal {damage:3} damage 3 times.",
		upgradeArray: [
			{
				name: "Claw Flurry+",
				effectArray: [{ index: "repeat", times: 4, effectArray: [{ index: "damage", amount: 3 }] }],
				text: "Deal {damage:3} damage 4 times.",
			},
		],
	},
	{
		index: "cinderThrust",
		name: "Lance Thrust",
		characterIndex: "cinder",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cinder-thrust",
		effectArray: [{ index: "damage", amount: 6 }],
		upgradeArray: [
			{ name: "Lance Thrust+", effectArray: [{ index: "damage", amount: 9 }] },
		],
	},
	{
		index: "cinderChangePlaces",
		brokenCard: "cinderMisstep",
		name: "Change Places",
		characterIndex: "cinder",
		archetype: "formation",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "ally",
		//ONLY SOMEBODY WHO WOULD ACTUALLY MOVE (session 21 follow-up: "all should only be able to trigger
		//if the character is actually moved"). The condition reads the engine's own shift preview, so an
		//ally already at the front cannot be aimed at and the card cannot be played to no effect.
		targetCondition: { index: "wouldShift", shift: "front" },
		layout: "horizontal",
		artPath: "cards/art/cinder-formation",
		effectArray: [
			{ index: "shiftParty", shift: "front" },
			{ index: "drawCards", amount: 1 },
		],
		text: "An ally moves to the front. Draw 1 card.",
		upgradeArray: [
			{ name: "Change Places+", costArray: { energy: 0 } },
		],
	},
	{
		index: "clemenceOffering",
		name: "Offering",
		characterIndex: "clemence",
		archetype: "devotion",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "ally",
		layout: "horizontal",
		artPath: "cards/art/clemence-absolve",
		brokenCard: "clemenceOfferingBroken",
		effectArray: [
			{ index: "heal", amount: 6 },
			{ index: "heal", amount: 3, condition: { index: "compare", operation: "greater", left: { index: "stat", stat: "lust", of: "target" }, right: 0 } },
			{ index: "lust", amount: 5, targetOverride: "owner", lustTagArray: ["penance"] },
		],
		text: "An ally heals 6 HP, or 9 if they have Lust. Clemence gains 5 Lust.",
		upgradeArray: [
			{
				name: "Offering+",
				effectArray: [
					{ index: "heal", amount: 8 },
					{ index: "heal", amount: 4, condition: { index: "compare", operation: "greater", left: { index: "stat", stat: "lust", of: "target" }, right: 0 } },
					{ index: "lust", amount: 5, targetOverride: "owner", lustTagArray: ["penance"] },
				],
				text: "An ally heals 8 HP, or 12 if they have Lust. Clemence gains 5 Lust.",
			},
		],
	},
	{
		index: "cassadoraBolt",
		name: "Wisplight",
		characterIndex: "cassadora",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-bolt",
		effectArray: [{ index: "damage", amount: 6 }],
		upgradeArray: [
			{ name: "Wisplight+", effectArray: [{ index: "damage", amount: 9 }] },
		],
	},
	{
		//CASSADORA'S PRIMARY EXPRESSION: the enemy thinks again.
		index: "cassadoraSecondThoughts",
		name: "Second Thoughts",
		characterIndex: "cassadora",
		archetype: "hex",
		rarity: "starter",
		costArray: { energy: 1 },
		targetMode: "enemy",
		layout: "horizontal",
		artPath: "cards/art/cassadora-hex",
		effectArray: [
			{ index: "rerollIntent" },
			{ index: "drawCards", amount: 1 },
		],
		text: "An enemy picks a new intent. Draw 1 card.",
		upgradeArray: [
			{ name: "Second Thoughts+", costArray: { energy: 0 } },
		],
	},
```
