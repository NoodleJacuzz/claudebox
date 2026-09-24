//===================================================================================================
//HONEYCOMB CATACOMBS -- status content
//===================================================================================================
//Every status effect in the game. Adding one is a single entry here plus an icon; nothing else needs
//to know it exists.
//
//Fields:
//  index                  unique id, referenced by cards and enemies
//  name, description      shown on the status tooltip
//  iconPath               art, resolved through honeycomb.image
//  colorHint              tint for the generated placeholder icon and the stack badge
//  stackType              "duration"  loses a stack at decayTiming, counts down
//                         "intensity" persists at its level until removed
//                         "counter"   an arbitrary tally the status manages itself
//  decayTiming            "ownerTurnStart" or "ownerTurnEnd"; only used by duration statuses
//  maximumStacks          optional ceiling
//  isDebuff               drives icon framing and anything that cares about good versus bad
//  cardType               optional: the card supertype a debuff makes when a card applies it to the
//                         other team. Omitted means Negative.
//
//LUST IS NOT A STATUS, and never becomes one: it is a number on the entity (`entity.lust`), moved only
//by the `lust` and `soothe` effects, so nothing that
//applies, removes, vetoes (Artifact) or counts statuses can reach it. Statuses that SERVE lust (Sensitive,
//Composure) are ordinary statuses and are removable like any other.
//  persistsBetweenCombats survives the end of a fight
//  canApply(params)       optional veto, for immunities
//  hooks                  see honeycomb-entities.js for the full list of hook points
//
//NUMBERS LIVE ON THE DEFINITION, never inside the hook body. A balance pass edits the field above the
//function, not the arithmetic inside it.
window.honeycomb = window.honeycomb || {};

honeycomb.statusArray = [

	{
		index: "strength",
		name: "Strength",
		description: "Attacks deal additional damage per stack.",
		iconPath: "icons/arm-flexing",
		colorHint: "#e06a4a",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		//Flat damage added per stack.
		damagePerStack: 1,
		hooks: {
			modifyDamageDealt: function (amount, params) {
				//Only attacks scale with Strength; damage-over-time is deliberately excluded, or
				//poison would double-dip on every stack.
				if (params.entry != null && params.entry.ignoresStrength == true) return amount;
				return amount + (params.stacks * params.definition.damagePerStack);
			},
		},
	},

	{
		//"GAIN 2 STRENGTH THIS TURN" (STARTER-LIST, Brienne's Brace and Clemence's Zeal paths): Strength that
		//empties at the end of its owner's turn instead of lasting the fight.
		index: "fleetingStrength",
		name: "Fleeting Strength",
		description: "Attacks deal additional damage per stack. Clears at the end of turn.",
		iconPath: "icons/arm-flexing",
		colorHint: "#f09a6a",
		stackType: "intensity",
		clearTiming: "ownerTurnEnd",
		isDebuff: false,
		persistsBetweenCombats: false,
		damagePerStack: 1,
		hooks: {
			modifyDamageDealt: function (amount, params) {
				if (params.entry != null && params.entry.ignoresStrength == true) return amount;
				return amount + (params.stacks * params.definition.damagePerStack);
			},
		},
	},

	{
		index: "weak",
		name: "Weak",
		description: "Deals {damageReductionPercent}% less attack damage. Wears off at end of turn.",
		iconPath: "icons/swirl-purple",
		colorHint: "#8a7fb5",
		stackType: "duration",
		decayTiming: "ownerTurnEnd",
		isDebuff: true,
		persistsBetweenCombats: false,
		//Outgoing damage is multiplied by this while any stack is held.
		damageMultiplier: 0.75,
		hooks: {
			modifyDamageDealt: function (amount, params) {
				if (params.entry != null && params.entry.ignoresWeak == true) return amount;
				return amount * params.definition.damageMultiplier;
			},
		},
	},

	{
		//SUNDERED: replaced Vulnerable. Each stack adds this share to damage taken, so 4 stacks
		//is double. Intensity, not duration: a second application raises the level rather than restarting
		//a timer.
		index: "sundered",
		name: "Sundered",
		description: "Takes {damageIncreasePercent}% more damage per stack. Loses 1 stack at the end of the holder's turn.",
		iconPath: "icons/shield-broken-red",
		colorHint: "#d94f6e",
		stackType: "intensity",
		//One stack comes off at the end of the holder's turn, so a stack built up has to be kept up.
		decayTiming: "ownerTurnEnd",
		decayAmount: 1,
		isDebuff: true,
		persistsBetweenCombats: false,
		//Additive per stack: 0.25 at 1, 0.5 at 2, 1.0 at 4.
		damageIncreasePerStack: 0.25,
		//Damage of these types is left alone. Poison is a flat clock -- it already ignored Strength,
		//and multiplying it too made the two debuffs stack.
		unaffectedDamageTypeArray: ["poison"],
		hooks: {
			modifyDamageTaken: function (amount, params) {
				var damageType = params.entry == null ? null : params.entry.damageType;
				if (damageType != null && params.definition.unaffectedDamageTypeArray.indexOf(damageType) >= 0) return amount;
				//ROUND UP: at one stack a small hit still lands, so Claw Flurry's 2x3 gains a
				//point instead of 2.5 flooring back to 2. The pipeline floors the final number, so a
				//ceil here is what makes a fraction count.
				return Math.ceil(amount * (1 + params.definition.damageIncreasePerStack * params.stacks));
			},
		},
	},

	{
		//FRAIL, REBUILT ON SUNDERED'S SHAPE. It cuts healing and Temporary HP gained, and it stacks in
		//intensity: each stack is another quarter off, four stacks stop both outright, and anything past
		//four is duration rather than depth because one stack comes off at the end of the holder's turn.
		index: "frail",
		name: "Frail",
		description: "Healing and Temporary HP gained are reduced by {reductionPercent}% per stack. Loses 1 stack at the end of the holder's turn.",
		iconPath: "icons/snowflake",
		colorHint: "#9c8f6a",
		stackType: "intensity",
		decayTiming: "ownerTurnEnd",
		decayAmount: 1,
		isDebuff: true,
		persistsBetweenCombats: false,
		//A quarter per stack, and the stacks that count are capped so the multiplier never goes negative.
		reductionPerStack: 0.25,
		fullReductionStacks: 4,
		hooks: {
			modifyTemporaryHealthGained: function (amount, params) {
				return Math.floor(amount * honeycomb.frailMultiplier(params.definition, params.stacks));
			},
			modifyHealingReceived: function (amount, params) {
				return Math.floor(amount * honeycomb.frailMultiplier(params.definition, params.stacks));
			},
		},
	},

	{
		index: "poison",
		name: "Poison",
		description: "Loses health at the end of the other side's turn, then weakens. Ignores Temporary HP, Strength and Sundered.",
		iconPath: "icons/drop-green",
		colorHint: "#6bbf59",
		stackType: "intensity",
		isDebuff: true,
		persistsBetweenCombats: false,
		//Health lost per stack held, each tick.
		damagePerStack: 1,
		//HOW A TICK WEAKENS THE POISON. "decrement" is the original: one stack off per
		//tick. "halve" is an alternative where the stacks halve (rounded down) each tick.
		decayMode: "decrement",
		decayAmount: 1,
		//Where its tick lives, so the triggerStatus effect can make it act now (Quicken Rot).
		tickHook: "onTeamTurnEnd",
		hooks: {
			//THE TICK IS A BARRAGE. Every poisoned combatant on the side whose turn just ended ticks together -- one
			//damage entry each, played rapid-fire by the replay -- rather than one at a time at their own
			//turn starts. Still a flat, predictable clock: it ignores Temporary HP, Strength and
			//Sundered.
			onTeamTurnEnd: function (params) {
				var damage = params.stacks * params.definition.damagePerStack;
				//THE PARTY'S OUTFITS MAY REWRITE THE TICK. Nightshade: every tick is Lust instead of damage.
				//Sporemother: a tick on the party's enemies heals the party's most wounded instead.
				if (honeycomb.partyLoadoutFlag("poisonInflictsLust") == true) {
					honeycomb.gainLust(params.entity, damage, { entry: { damageType: "poison", pace: "barrage" }, tagArray: ["venom"] }, params.context);
				} else if (params.entity.side == "enemy" && honeycomb.partyLoadoutFlag("poisonHealsAllies") == true) {
					var woundedArray = honeycomb.livingEntityArray("ally", params.context == null ? null : params.context.combat).slice().sort(function (left, right) {
						return (left.health / Math.max(1, left.maxHealth)) - (right.health / Math.max(1, right.maxHealth));
					});
					if (woundedArray.length > 0) honeycomb.healEntity(woundedArray[0], damage, params.context);
				} else {
					honeycomb.dealDamage(null, params.entity, damage,
						{ ignoreTemporary: true, ignoresStrength: true, damageType: "poison" }, params.context);
				}
				//THE DECAY RIDES THE TICK. Its own status pulse between every tick is what
				//made the "rapid-fire" barrage measure 410ms an enemy; see tuning.animation.beatPaceMsMap.
				if (params.definition.decayMode == "halve") {
					var remaining = Math.floor(params.stacks / 2);
					honeycomb.removeStatus(params.entity, "poison", params.stacks - remaining, params.context, { pace: "barrage" });
				} else {
					honeycomb.removeStatus(params.entity, "poison", params.definition.decayAmount, params.context, { pace: "barrage" });
				}
			},
		},
	},

	{
		index: "regeneration",
		name: "Regeneration",
		description: "Heals at the start of its turn, then loses one stack.",
		iconPath: "icons/heart-glow-pink",
		colorHint: "#63d2a3",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		healPerStack: 2,
		hooks: {
			onTurnStart: function (params) {
				honeycomb.healEntity(params.entity, params.stacks * params.definition.healPerStack, params.context);
				honeycomb.removeStatus(params.entity, "regeneration", 1, params.context);
			},
		},
	},

	{
		index: "thorns",
		name: "Thorns",
		description: "Damages attackers when struck.",
		iconPath: "icons/shield-lightning-purple",
		colorHint: "#b06ad9",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		damagePerStack: 1,
		hooks: {
			onDamaged: function (params) {
				if (params.source == null || params.source.downed == true) return;
				//Retaliation ignores Strength so a buffed defender does not spiral, and pierces temporary
				//health so an attacker standing behind gold cannot ignore it outright.
				honeycomb.dealDamage(null, params.source, params.stacks * params.definition.damagePerStack,
					{ ignoresStrength: true, damageType: "thorns" }, params.context);
			},
		},
	},

	{
		index: "artifact",
		name: "Artifact",
		description: "Negates the next debuff applied, consuming one stack.",
		iconPath: "icons/sparkles-pink",
		colorHint: "#e8c86a",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		//Handled as a veto rather than a hook, since it must run before the incoming status lands.
		//Statuses are checked for this at apply time in honeycomb.applyStatus.
		hooks: {},
		//Read by that veto, which calls statusStacks directly, so the orphan-status warning can see it.
		engineReads: true,
	},

	{
		index: "energised",
		name: "Energised",
		description: "Grants extra Energy at the start of the next turn.",
		iconPath: "icons/lightning",
		colorHint: "#5fc9f0",
		stackType: "counter",
		isDebuff: false,
		persistsBetweenCombats: false,
		energyPerStack: 1,
		hooks: {
			//Folded into the turn's energy, then spent once that energy is set. Adding it at turn start
			//does nothing: the turn's energy is SET afterwards.
			modifyEnergyPerTurn: function (amount, params) {
				return amount + params.stacks * params.definition.energyPerStack;
			},
			onEnergyGranted: function (params) {
				honeycomb.removeStatus(params.entity, "energised", null, params.context);
			},
		},
	},

	{
		index: "focus",
		name: "Focus",
		description: "Draws an additional card each turn.",
		iconPath: "icons/target-rings",
		colorHint: "#7ea6f0",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		drawPerStack: 1,
		hooks: {
			modifyDrawPerTurn: function (amount, params) {
				return amount + (params.stacks * params.definition.drawPerStack);
			},
		},
	},

	//-----------------------------------------------------------------------------------------------
	//The lust pair. One status on each side of the new bar, so lust has in-fight counterplay
	//and in-fight pressure that are not simply more or less lust.
	//-----------------------------------------------------------------------------------------------
	{
		index: "sensitive",
		name: "Sensitive",
		description: "Takes additional Lust per stack.",
		iconPath: "icons/heart-devil",
		colorHint: "#e07ac6",
		stackType: "intensity",
		isDebuff: true,
		//A card applying it to the other team is Lewd rather than Negative.
		cardType: "lewd",
		persistsBetweenCombats: false,
		//A fraction added per stack, so three stacks is +75% rather than a flat number that stops
		//mattering once the numbers grow.
		lustFractionPerStack: 0.25,
		hooks: {
			modifyLustGained: function (amount, params) {
				return amount * (1 + params.stacks * params.definition.lustFractionPerStack);
			},
		},
	},

	{
		index: "composure",
		name: "Composure",
		description: "Removes Lust at the start of its owner's turn, then loses one stack.",
		iconPath: "icons/wings-halo",
		colorHint: "#7ec8f0",
		stackType: "duration",
		decayTiming: "ownerTurnStart",
		isDebuff: false,
		persistsBetweenCombats: false,
		//Removed per stack held, each tick -- so it is worth stacking and worth spending early.
		lustPerStack: 3,
		hooks: {
			onTurnStart: function (params) {
				var removed = params.stacks * params.definition.lustPerStack;
				honeycomb.reduceLust(params.entity, removed, params.context);
			},
		},
	},

	//-----------------------------------------------------------------------------------------------
	//The sister mechanics. See MECHANICS-01.md. Grouped by character and sister mechanic;
	//`archetype` here is documentation only (cards carry the field the reward roll reads).
	//-----------------------------------------------------------------------------------------------

	//--- Brienne · Armament: Temporary HP as a weapon that is not spent ---
	{
		index: "armament",
		name: "Armament",
		description: "Attacks deal 1 additional damage for every 5 Temporary HP this fighter holds, per stack.",
		iconPath: "icons/shield-sword-red",
		colorHint: "#e8a24a",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "armament",
		temporaryPerPoint: 5,
		damagePerPoint: 1,
		hooks: {
			modifyDamageDealt: function (amount, params) {
				//Excluded exactly where Strength is: poison, thorns and the other reflexes.
				if (params.entry != null && params.entry.ignoresStrength == true) return amount;
				var held = params.entity.temporaryHealth == null ? 0 : params.entity.temporaryHealth;
				return amount + Math.floor(held / params.definition.temporaryPerPoint) * params.definition.damagePerPoint * params.stacks;
			},
		},
	},
	{
		index: "momentum",
		name: "Momentum",
		description: "Whenever this fighter gains Temporary HP, deal 3 damage per stack to the enemy in front.",
		iconPath: "icons/figure-running",
		colorHint: "#e0814a",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "armament",
		//4, matching the worn-only rare it belongs to (Unstoppable).
		damagePerStack: 4,
		hooks: {
			onTemporaryHealthGained: function (params) {
				var front = honeycomb.frontOf(honeycomb.opposingSide(params.entity.side), params.context == null ? null : params.context.combat);
				if (front == null) return;
				honeycomb.dealDamage(params.entity, front, params.stacks * params.definition.damagePerStack,
					{ ignoresStrength: true, damageType: "momentum" }, params.context);
			},
		},
	},

	//--- Brienne · Sentinel: drawing the attacks, and answering them ---
	{
		//THE TAUNT. The rule lives in honeycomb.tauntFilteredArray, keyed on `redirectsAttacks`, so
		//any status that should draw attacks says so here rather than being named in the targeting code.
		index: "taunt",
		name: "Taunt",
		description: "EVERY hit from the other side lands on this fighter instead, sweeps included. Wears off at the start of their next turn.",
		iconPath: "icons/shield-round-red",
		colorHint: "#d9694f",
		stackType: "duration",
		decayTiming: "ownerTurnStart",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "sentinel",
		redirectsAttacks: true,
		hooks: {},
	},
	{
		index: "retort",
		name: "Retort",
		description: "Whenever Temporary HP absorbs an enemy's hit on this fighter, deal 3 damage per stack back to the attacker.",
		iconPath: "icons/swords-crossed",
		colorHint: "#c9b06a",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "sentinel",
		damagePerStack: 3,
		hooks: {
			onTemporaryAbsorbed: function (params) {
				var attacker = params.source;
				//Only an enemy's hit. A teammate's Blood Price soaked by the gold is not an attack to answer, and
				//a hit with no source (thorns, poison) has nobody to answer.
				if (attacker == null || attacker.downed == true || attacker.side == params.entity.side) return;
				honeycomb.dealDamage(params.entity, attacker, params.stacks * params.definition.damagePerStack,
					{ ignoresStrength: true, damageType: "retort" }, params.context);
			},
		},
	},
	{
		index: "entrenched",
		name: "Entrenched",
		description: "This fighter's Temporary HP loses a quarter of itself at turn start instead of half.",
		iconPath: "icons/shield-plain",
		colorHint: "#9fb4c9",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "sentinel",
		decayFraction: 0.25,
		hooks: {
			modifyTemporaryDecayFraction: function (fraction, params) {
				return Math.min(fraction, params.definition.decayFraction);
			},
		},
	},

	//--- Brienne · Tithe: Temporary HP as currency ---
	{
		index: "gilded",
		name: "Gilded",
		description: "When this fighter's Temporary HP halves, gain 1 Energised for every 6 lost, up to 2.",
		iconPath: "icons/coins",
		colorHint: "#ffcf5c",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "tithe",
		temporaryPerEnergy: 6,
		energyMaximum: 2,
		hooks: {
			//The halving runs before the turn's energy is set, so the Energised lands in the same turn.
			onTemporaryDecayed: function (params) {
				var energy = Math.min(params.definition.energyMaximum, Math.floor(params.amount / params.definition.temporaryPerEnergy));
				if (energy > 0) honeycomb.applyStatus(params.entity, "energised", energy, params.context);
			},
		},
	},

	//--- Nettle · Rupture ---
	{
		index: "festering",
		name: "Festering",
		description: "Poison deals double damage to this fighter. Wears off at the end of its turn.",
		iconPath: "icons/skull",
		colorHint: "#9ab04a",
		stackType: "duration",
		decayTiming: "ownerTurnEnd",
		isDebuff: true,
		persistsBetweenCombats: false,
		archetype: "rupture",
		poisonMultiplier: 2,
		hooks: {
			modifyDamageTaken: function (amount, params) {
				if (params.entry == null || params.entry.damageType != "poison") return amount;
				return amount * params.definition.poisonMultiplier;
			},
		},
	},

	//--- Nettle · Contagion ---
	{
		index: "infected",
		name: "Infected",
		description: "Gains 1 Poison whenever an attack wounds it. Wears off at the end of its turn.",
		iconPath: "icons/leaf-green",
		colorHint: "#7fc45a",
		stackType: "duration",
		decayTiming: "ownerTurnEnd",
		isDebuff: true,
		persistsBetweenCombats: false,
		archetype: "contagion",
		poisonPerHit: 1,
		hooks: {
			//Any attack from the other team, however small -- which is what makes many small hits the carrier.
			onDamaged: function (params) {
				var attacker = params.source;
				if (attacker == null || attacker.side == params.entity.side) return;
				if (params.entry != null && params.entry.damageType == "poison") return;
				//Applied as the attacker, so the party's own Poison hooks (Heady Spores) hear who carried it.
				var carried = honeycomb.newEffectContext({ source: attacker, combat: params.context.combat, log: params.context.log, depth: params.context.depth });
				carried.tally = params.context.tally;
				honeycomb.applyStatus(params.entity, "poison", params.definition.poisonPerHit, carried);
			},
		},
	},
	{
		index: "pandemic",
		name: "Pandemic",
		description: "When a poisoned enemy falls, every other enemy gains its Poison.",
		iconPath: "icons/skull-horned",
		colorHint: "#6bbf59",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "contagion",
		hooks: {
			//A world event, heard by the status on the member who played the Passive (params.wearer).
			onEnemyDowned: function (params) {
				var fallen = params.entity;
				var poison = honeycomb.statusStacks(fallen, "poison");
				if (poison <= 0 || params.context == null || params.context.combat == null) return;
				var spreadContext = honeycomb.newEffectContext({ source: params.wearer, combat: params.context.combat, log: params.context.log });
				var enemyArray = honeycomb.livingEntityArray(fallen.side, params.context.combat);
				for (var enemyIndex = 0; enemyIndex < enemyArray.length; enemyIndex++) {
					if (enemyArray[enemyIndex] === fallen) continue;
					honeycomb.applyStatus(enemyArray[enemyIndex], "poison", poison, spreadContext);
				}
			},
		},
	},

	//--- Nettle · Venom: poison that builds lust ---
	{
		index: "intoxicated",
		name: "Intoxicated",
		description: "At the end of the other side's turn, once Poison has acted, takes Lust equal to its Poison. Wears off at the end of its turn.",
		iconPath: "icons/potion-red",
		colorHint: "#d96ac0",
		stackType: "duration",
		decayTiming: "ownerTurnEnd",
		isDebuff: true,
		//It only ever serves lust, so a card applying it is Lewd, as Sensitive is.
		cardType: "lewd",
		persistsBetweenCombats: false,
		archetype: "venom",
		//Heard after Poison, so it reads the Poison LEFT once the tick has taken its stack.
		hookOrder: 1,
		lustPerPoison: 1,
		lustTagArray: ["venom"],
		hooks: {
			onTeamTurnEnd: function (params) {
				var lust = honeycomb.statusStacks(params.entity, "poison") * params.definition.lustPerPoison;
				if (lust <= 0) return;
				//Intoxicated rides poison's barrage too: it fires from the same hook, once per poisoned body.
				honeycomb.gainLust(params.entity, lust, { tagArray: params.definition.lustTagArray, entry: { damageType: "intoxicated", pace: "barrage" } }, params.context);
			},
		},
	},
	{
		index: "headySpores",
		name: "Heady Spores",
		description: "Whenever the party applies Poison to an enemy, inflict 2 Lust on it as well.",
		iconPath: "icons/mushroom",
		colorHint: "#e07ac6",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "venom",
		lustPerApplication: 2,
		lustTagArray: ["venom"],
		hooks: {
			onStatusApplied: function (params) {
				if (params.statusIndex != "poison" || params.wearer == null) return;
				if (params.entity.side == params.wearer.side) return;
				if (params.source == null || params.source.side != params.wearer.side) return;
				honeycomb.gainLust(params.entity, params.stacks * params.definition.lustPerApplication,
					{ source: params.wearer, tagArray: params.definition.lustTagArray }, params.context);
			},
		},
	},

	//--- Severine · Feast ---
	{
		index: "marked",
		name: "Marked",
		description: "Takes 3 more damage from attacks. If it falls while Marked, the party gains 1 Energy. Wears off at the end of its turn.",
		iconPath: "icons/dagger",
		colorHint: "#d94f6e",
		stackType: "duration",
		decayTiming: "ownerTurnEnd",
		isDebuff: true,
		persistsBetweenCombats: false,
		archetype: "feast",
		damageBonus: 3,
		energyOnFall: 1,
		hooks: {
			modifyDamageTaken: function (amount, params) {
				if (params.source == null || params.source.side == params.entity.side) return amount;
				if (params.entry != null && params.entry.damageType != null) return amount;
				return amount + params.definition.damageBonus;
			},
			onDeath: function (params) {
				honeycomb.addResource("energy", params.definition.energyOnFall);
				honeycomb.logEvent(params.context, { type: "resource", resource: "energy", amount: params.definition.energyOnFall });
			},
		},
	},
	{
		index: "gorged",
		name: "Gorged",
		description: "Healing past this fighter's maximum health becomes Temporary HP instead.",
		iconPath: "icons/gem-red",
		colorHint: "#c0304a",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "feast",
		hooks: {
			onOverheal: function (params) {
				honeycomb.grantTemporaryHealth(params.entity, params.amount, params.context);
			},
		},
	},

	//--- Severine · Bloodletting ---
	{
		index: "hemomancy",
		name: "Hemomancy",
		description: "Whenever the party damages one of its own, draw 1 card. At most twice a turn.",
		iconPath: "icons/book-dark",
		colorHint: "#a0304f",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "bloodletting",
		drawPerTrigger: 1,
		triggersPerTurn: 2,
		hooks: {
			onAllyHealthLost: function (params) {
				var wearer = params.wearer;
				var combat = params.context == null ? null : params.context.combat;
				if (wearer == null || combat == null || params.source == null || params.source.side != wearer.side) return;
				//The per-turn count lives on the wearer, keyed by turn, so it needs no reset.
				if (wearer.hemomancyTurn != combat.turnNumber) { wearer.hemomancyTurn = combat.turnNumber; wearer.hemomancyCount = 0; }
				if (wearer.hemomancyCount >= params.definition.triggersPerTurn) return;
				wearer.hemomancyCount += 1;
				honeycomb.drawCards(params.definition.drawPerTrigger, params.context);
			},
		},
	},
	{
		index: "bloodMoon",
		name: "Blood for Blood",
		description: "Whenever a party member loses health, deal that much damage to a random enemy.",
		iconPath: "icons/sun",
		colorHint: "#b02040",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "bloodletting",
		hooks: {
			onAllyHealthLost: function (params) {
				var wearer = params.wearer;
				if (wearer == null || params.context == null || params.context.combat == null) return;
				//A retaliation that is hit back (thorns) must not answer itself forever.
				if (wearer.bloodMoonResolving == true) return;
				wearer.bloodMoonResolving = true;
				var moonContext = honeycomb.newEffectContext({ source: wearer, combat: params.context.combat, log: params.context.log });
				honeycomb.applyResolvedTargets(moonContext, "randomEnemy", honeycomb.resolveTargetMode("randomEnemy", moonContext));
				if (moonContext.target != null) {
					honeycomb.dealDamage(wearer, moonContext.target, params.amount, { ignoresStrength: true, damageType: "bloodMoon" }, moonContext);
				}
				wearer.bloodMoonResolving = false;
			},
		},
	},

	//--- Severine · Transfusion ---
	{
		index: "siphoned",
		name: "Siphoned",
		description: "Whenever it loses health, the most hurt party member heals half as much. Wears off at the end of its turn.",
		iconPath: "icons/heart-red",
		colorHint: "#e05a78",
		stackType: "duration",
		decayTiming: "ownerTurnEnd",
		isDebuff: true,
		persistsBetweenCombats: false,
		archetype: "transfusion",
		healFraction: 0.5,
		hooks: {
			onDamaged: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				var healed = Math.floor(params.amount * params.definition.healFraction);
				if (healed <= 0 || combat == null) return;
				var receiver = honeycomb.mostHurtEntity(honeycomb.opposingSide(params.entity.side), combat);
				if (receiver != null) honeycomb.healEntity(receiver, healed, params.context);
			},
		},
	},

	//--- Cinder · Charge and Formation ---
	{
		index: "emberwake",
		name: "Emberwake",
		description: "Whenever this fighter moves through the party's order, deal 2 damage per place moved to the enemy in front, per stack.",
		iconPath: "icons/fire",
		colorHint: "#f08a3a",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "charge",
		damagePerPlace: 2,
		hooks: {
			onShifted: function (params) {
				if (params.distance <= 0 || params.context == null || params.context.combat == null) return;
				var front = honeycomb.frontOf(honeycomb.opposingSide(params.entity.side), params.context.combat);
				if (front == null) return;
				honeycomb.dealDamage(params.entity, front, params.distance * params.definition.damagePerPlace * params.stacks,
					{ ignoresStrength: true, damageType: "emberwake" }, params.context);
			},
		},
	},
	{
		index: "vanguard",
		name: "Vanguard",
		description: "Attacks deal 3 more damage per stack while this fighter stands at the front.",
		iconPath: "icons/boot-winged",
		colorHint: "#e0a24a",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "formation",
		damagePerStack: 3,
		hooks: {
			modifyDamageDealt: function (amount, params) {
				if (params.entry != null && params.entry.ignoresStrength == true) return amount;
				var combat = params.context == null ? null : params.context.combat;
				if (honeycomb.entityRank(params.entity, combat) !== 0) return amount;
				return amount + params.stacks * params.definition.damagePerStack;
			},
		},
	},

	//--- Clemence: built around becoming Broken ---
	{
		//REPLACED HALLOWED with a status that lets her allies use the non-broken effects of cards while
		//broken, the same as she does. The rule is read in
		//honeycomb.brokenCardIndexFor, keyed on `keepsCardsWhileBroken`.
		index: "sanctified",
		name: "Sanctified",
		description: "While Broken, this fighter keeps playing their real cards instead of their broken card. Being Broken still costs health and Lust each turn, and a party that is all Broken still loses.",
		iconPath: "icons/wings-halo",
		colorHint: "#f0e0a0",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "sanctuary",
		keepsCardsWhileBroken: true,
		hooks: {},
	},
	{
		index: "martyrsVow",
		name: "Martyr's Vow",
		description: "Whenever this fighter's Lust rises or falls, the most hurt party member heals half as much.",
		iconPath: "icons/heart-crowned",
		colorHint: "#e8b0c0",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "devotion",
		healFraction: 0.5,
		hooks: {
			//Her own Lust arriving: an entity hook on the holder.
			onLustGained: function (params) {
				honeycomb.martyrsVowHeal(params.entity, params.amount, params.definition, params.context);
			},
			//Her own Lust leaving: a world hook, so only the holder's (`wearer`) counts.
			onLustReduced: function (params) {
				if (params.wearer == null || params.entity !== params.wearer) return;
				honeycomb.martyrsVowHeal(params.wearer, params.amount, params.definition, params.context);
			},
		},
	},
	{
		index: "ecstasy",
		name: "Ecstasy",
		description: "While this fighter is Broken, the party gains 1 more Energy each turn.",
		iconPath: "icons/starburst-yellow",
		colorHint: "#ffcf5c",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "rapture",
		energyWhileBroken: 1,
		hooks: {
			modifyEnergyPerTurn: function (amount, params) {
				return params.entity.broken == true ? amount + params.definition.energyWhileBroken : amount;
			},
		},
	},

	//--- Cassadora · Hex and Turncoat ---
	{
		//THE TURNCOAT. The rule lives in honeycomb.intentActingSide, keyed on `turnsIntent`.
		index: "turncoat",
		name: "Turncoat",
		description: "Its next move is taken against its own side: attacks land on its allies, never on itself, and help lands on yours. With no allies left it acts as usual. Wears off at the end of its turn.",
		iconPath: "icons/swirl-purple",
		colorHint: "#9a6ad9",
		stackType: "duration",
		decayTiming: "ownerTurnEnd",
		isDebuff: true,
		persistsBetweenCombats: false,
		archetype: "turncoat",
		turnsIntent: true,
		hooks: {},
	},
	{
		index: "jinx",
		//Printed as Evil Eye: the common card was renamed to end the three-way Jinx clash.
		name: "Evil Eye",
		description: "Whenever an enemy's intent is changed, it takes {damage} damage.",
		iconPath: "icons/flame-blue",
		colorHint: "#5fa8f0",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "hex",
		damage: 6,
		hooks: {
			onIntentChanged: function (params) {
				var wearer = params.wearer;
				if (wearer == null || params.entity.side == wearer.side || params.entity.downed == true) return;
				honeycomb.dealDamage(wearer, params.entity, params.definition.damage, { ignoresStrength: true, damageType: "jinx" }, params.context);
			},
		},
	},
	{
		index: "puppeteer",
		name: "Puppet Strings",
		description: "At the end of the party's turn, a random enemy becomes a Turncoat.",
		iconPath: "icons/wand-purple",
		colorHint: "#b08ad9",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "turncoat",
		hooks: {
			onTurnEnd: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null) return;
				var stringsContext = honeycomb.newEffectContext({ source: params.entity, combat: combat, log: params.context.log });
				honeycomb.applyResolvedTargets(stringsContext, "randomEnemy", honeycomb.resolveTargetMode("randomEnemy", stringsContext));
				if (stringsContext.target != null) honeycomb.applyStatus(stringsContext.target, "turncoat", 1, stringsContext);
			},
		},
	},
	{
		//A BLUE-MAGE posture. A holder keeps their stolen moves and keeps them for good. The two
		//field names are read by honeycomb.stolenCardSettings when a card is stolen.
		index: "repertoire",
		name: "Repertoire",
		description: "Stolen enemy moves do not exhaust, and a copy is added to your deck.",
		iconPath: "icons/book-skull-purple",
		colorHint: "#7fb0e8",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "repertoire",
		stolenCardsExhaust: false,
		stolenCardsPersist: true,
		hooks: {},
	},
	{
		//Replaces the old Hold the Line trap: tHP usually gets eaten long before it
		//decays, so "decay slower" was a card that read well and rarely did anything. Standing Fast instead
		//pours new gold in every turn -- a real engine for Armament, Tithe and the Bastion line.
		index: "standFast",
		name: "Stand Fast",
		description: "At the start of the holder's turn, they gain {temporaryAmount} Temporary HP.",
		iconPath: "icons/shield-plain",
		colorHint: "#e8c86a",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "armament",
		temporaryAmount: 5,
		hooks: {
			onTurnStart: function (params) {
				honeycomb.grantTemporaryHealth(params.entity, params.definition.temporaryAmount, params.context);
			},
		},
	},
	//-------------------------------------------------------------------------------------------------
	//POWERS. Each is a "whenever X, do Y" written as a reaction table
	//(honeycomb.reactionHooks), so the status IS its rules and needs no bespoke hook code.
	//-------------------------------------------------------------------------------------------------
	{
		//Brienne, Unbroken Oath: gold that survived the enemy turn pays out.
		index: "oathbound",
		name: "Unbroken Oath",
		description: "At the start of the holder's turn, if they carried Temporary HP into it, deal 6 damage to the front enemy and draw 1 card, per stack.",
		iconPath: "icons/shield-plain",
		colorHint: "#e8c86a",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "oath",
		hooks: honeycomb.reactionHooks([{
			hook: "onTurnStart", subject: "holder", perStack: true,
			condition: { index: "compare", operation: "greater", left: { index: "stat", stat: "carriedTemporaryHealth", of: "source" }, right: 0 },
			effectArray: [
				{ index: "damage", amount: 6, ignoresStrength: true, targetOverride: "frontEnemy" },
				{ index: "drawCards", amount: 1 },
			],
		}]),
	},
	{
		//Nettle, Plague Bearer: one ally's hits carry Poison for a turn.
		index: "envenomed",
		name: "Envenomed",
		description: "This fighter's attacks also inflict 2 Poison. Wears off at the end of its turn.",
		iconPath: "icons/skull",
		colorHint: "#6bbf59",
		stackType: "duration",
		decayTiming: "ownerTurnEnd",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "contagion",
		hooks: honeycomb.reactionHooks([{
			hook: "onEnemyHealthLost", subject: "enemy", eventSource: "holder", excludeDamageTypeArray: ["poison"],
			targetMode: "subject",
			effectArray: [{ index: "applyStatus", status: "poison", stacks: 2 }],
		}]),
	},
	{
		//Nettle, Rot Garden: every ally's hits carry Poison for the rest of the fight.
		index: "rotGarden",
		name: "Rot Garden",
		description: "Whenever any ally's attack wounds an enemy, it gains 1 Poison per stack.",
		iconPath: "icons/skull",
		colorHint: "#6bbf59",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "contagion",
		hooks: honeycomb.reactionHooks([{
			hook: "onEnemyHealthLost", subject: "enemy", eventSource: "ally", excludeDamageTypeArray: ["poison"],
			targetMode: "subject", perStack: true,
			effectArray: [{ index: "applyStatus", status: "poison", stacks: 1 }],
		}]),
	},
	{
		//Nettle, Aphrodisiac: the party's Lust carries Poison.
		index: "aphrodisiac",
		name: "Aphrodisiac",
		description: "Whenever an enemy takes Lust from any ally, it gains 1 Poison per stack.",
		iconPath: "icons/flower",
		colorHint: "#e07ab0",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "venom",
		hooks: honeycomb.reactionHooks([{
			hook: "onEnemyLustGained", subject: "enemy", eventSource: "ally", excludeDamageTypeArray: ["poison"],
			targetMode: "subject", perStack: true,
			effectArray: [{ index: "applyStatus", status: "poison", stacks: 1 }],
		}]),
	},
	{
		//Severine, Scar Tissue: every wound leaves gold behind.
		index: "scarTissue",
		name: "Scar Tissue",
		description: "Whenever the holder loses health, they gain 3 Temporary HP per stack.",
		iconPath: "icons/heart-red",
		colorHint: "#d94f6e",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "wounded",
		hooks: honeycomb.reactionHooks([{
			hook: "onAllyHealthLost", subject: "holder", perStack: true,
			effectArray: [{ index: "temporaryHealth", amount: 3 }],
		}]),
	},
	{
		//Severine, Blood Debt: someone else's healing is paid for in enemy blood.
		index: "bloodDebt",
		name: "Blood Debt",
		description: "Whenever another ally heals, deal that much damage to a random enemy.",
		iconPath: "icons/heart-red",
		colorHint: "#b02040",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "transfusion",
		hooks: honeycomb.reactionHooks([{
			hook: "onAllyHealed", subject: "otherAlly", targetMode: "randomEnemy",
			effectArray: [{ index: "damage", amount: { index: "tally", key: "eventAmount" }, ignoresStrength: true }],
		}]),
	},
	{
		//Cinder, Ember Watch: the front burns the enemy, the back shields the party.
		index: "emberWatch",
		name: "Ember Watch",
		description: "At the end of the holder's turn: at the front, deal 6 damage to ALL enemies; at the back, ALL allies gain 4 Temporary HP.",
		iconPath: "icons/fire",
		colorHint: "#f08a3a",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "lanes",
		hooks: honeycomb.reactionHooks([
			{
				hook: "onTurnEnd", subject: "holder", perStack: true, targetMode: "allEnemies",
				condition: { index: "atRank", of: "source", rank: 0 },
				effectArray: [{ index: "damage", amount: 6, ignoresStrength: true }],
			},
			{
				hook: "onTurnEnd", subject: "holder", perStack: true, targetMode: "allAllies",
				condition: { index: "atRank", of: "source", rank: 0, fromBack: true },
				effectArray: [{ index: "temporaryHealth", amount: 4 }],
			},
		]),
	},
	{
		//Cinder, Formation Drill: moving is guarding.
		index: "formationDrill",
		name: "Formation Drill",
		description: "Whenever an ally moves through the party's order, they gain 3 Temporary HP per stack.",
		iconPath: "icons/figure-running",
		colorHint: "#c9b06a",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "formation",
		hooks: honeycomb.reactionHooks([{
			hook: "onPartyShifted", subject: "ally", targetMode: "subject", perStack: true,
			effectArray: [{ index: "temporaryHealth", amount: 3 }],
		}]),
	},
	{
		//Cinder, Phoenix Heart: every burn she takes, she gives back.
		index: "phoenixHeart",
		name: "Phoenix Heart",
		description: "Whenever the holder gains a debuff, deal 4 damage per stack to the front enemy.",
		iconPath: "icons/fire",
		colorHint: "#f06a3a",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "ashfall",
		hooks: honeycomb.reactionHooks([{
			hook: "onStatusApplied", subject: "holder", debuffOnly: true, perStack: true, targetMode: "frontEnemy",
			effectArray: [{ index: "damage", amount: 4, ignoresStrength: true }],
		}]),
	},
	{
		//Clemence, Blessing: gold given is gold multiplied.
		index: "blessing",
		name: "Blessing",
		description: "Whenever an ally gains Temporary HP, they gain 2 more per stack.",
		iconPath: "icons/sun",
		colorHint: "#f0e0a0",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "devotion",
		hooks: honeycomb.reactionHooks([{
			hook: "onAllyTemporaryGained", subject: "ally", targetMode: "subject", perStack: true,
			effectArray: [{ index: "temporaryHealth", amount: 2 }],
		}]),
	},
	{
		//Clemence, Font of Grace: a heal every morning, paid for in her own Lust.
		index: "fontOfGrace",
		name: "Font of Grace",
		description: "At the start of the holder's turn, the most hurt ally heals 5 HP and the holder gains 3 Lust, per stack.",
		iconPath: "icons/sun",
		colorHint: "#f0e0a0",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "mercy",
		hooks: honeycomb.reactionHooks([{
			hook: "onTurnStart", subject: "holder", perStack: true, targetMode: "mostHurtAlly",
			effectArray: [
				{ index: "heal", amount: 5 },
				{ index: "lust", amount: 3, targetOverride: "owner", lustTagArray: ["penance"] },
			],
		}]),
	},
	{
		//Clemence, Rapture's Gift: her Break is the party's second wind.
		index: "rapturesGift",
		name: "Rapture's Gift",
		description: "When the holder Breaks, ALL other allies gain 2 Strength and 8 Temporary HP.",
		iconPath: "icons/sun",
		colorHint: "#e8a0c8",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "rapture",
		hooks: honeycomb.reactionHooks([{
			hook: "onBroken", subject: "holder", targetMode: "otherAllies",
			effectArray: [
				{ index: "applyStatus", status: "strength", stacks: 2 },
				{ index: "temporaryHealth", amount: 8 },
			],
		}]),
	},
	{
		//Cassadora, Coven's Curse: every debuff the party lands draws blood.
		index: "covensCurse",
		name: "Coven's Curse",
		description: "Whenever an ally gives an enemy a debuff, it takes 3 damage per stack.",
		iconPath: "icons/flame-blue",
		colorHint: "#8a6ad8",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		archetype: "hex",
		hooks: honeycomb.reactionHooks([{
			hook: "onStatusApplied", subject: "enemy", eventSource: "ally", debuffOnly: true, targetMode: "subject", perStack: true,
			effectArray: [{ index: "damage", amount: 3, ignoresStrength: true }],
		}]),
	},

	//-------------------------------------------------------------------------------------------------
	//ENEMY PASSIVES (rework/enemies/ENEMIES-01.md §3). An enemy carries these from the moment it
	//appears (`startingStatusArray` on its definition). Each is one enemy's identity, and none of them
	//shuts a strategy down: each is a cost the party can pay or route around.
	//-------------------------------------------------------------------------------------------------
	{
		//Sporeling. Killing one is never free, which is the Burst half; the Poison is the Grind half.
		index: "sporeburst",
		name: "Sporeburst",
		description: "When this dies, it bursts: 2 Poison on every member of the other side.",
		iconPath: "icons/mushroom",
		colorHint: "#6bbf59",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		hooks: honeycomb.reactionHooks([{
			hook: "onDeath", subject: "holder", whileDowned: true, targetMode: "allEnemies",
			effectArray: [{ index: "applyStatus", status: "poison", stacks: 2 }],
		}]),
	},
	{
		//Cordyceps Husk. The body was only ever a vessel.
		//The index is save-referenced and stays, but "Cordyceps" is the one word the
		//tone rule blocks by name -- the cordyceps zombie is its worked example of a blocked idea.
		index: "cordycepsHost",
		name: "Seeded",
		description: "When this falls, a Sporeling bursts out of it.",
		iconPath: "icons/necro-plaguebearer",
		colorHint: "#9a7bd0",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		hooks: honeycomb.reactionHooks([{
			hook: "onDeath", subject: "holder", whileDowned: true, targetMode: "holder",
			effectArray: [{ index: "summonEnemy", enemy: "sporeling", count: 1 }],
		}]),
	},
	{
		//Shieldcap. Blunts many small hits and barely notices one big one.
		index: "plated",
		name: "Plated",
		description: "Takes {reductionPerStack} less damage from each hit per stack. Poison ignores it.",
		iconPath: "icons/shield-round-red",
		colorHint: "#a08a6a",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		reductionPerStack: 1,
		unaffectedDamageTypeArray: ["poison", "lifeLoss"],
		hooks: {
			modifyDamageTaken: function (amount, params) {
				var damageType = params.entry == null ? null : params.entry.damageType;
				if (damageType != null && params.definition.unaffectedDamageTypeArray.indexOf(damageType) >= 0) return amount;
				return Math.max(0, amount - params.definition.reductionPerStack * params.stacks);
			},
		},
	},
	{
		//The Shroud feeds on disturbance: every card the other side plays stirs the air and is taken as a
		//Bloom. Index kept from the clerk it replaced -- a status index is
		//written into save data, and only the words changed.
		index: "ledger",
		name: "The Damp",
		description: "Whenever the other side plays a card, gains 1 Bloom.",
		iconPath: "icons/drop-green",
		colorHint: "#6b7355",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		hooks: honeycomb.reactionHooks([{
			hook: "onOpponentCardPlayed", subject: "holder", targetMode: "holder",
			effectArray: [{ index: "applyStatus", status: "tally", stacks: 1 }],
		}]),
	},
	{
		//How much The Damp has fed. Fruiting spends it. Distinct from the `tally` VALUE registry entry,
		//which is an unrelated reader of event amounts -- different array, no shadowing.
		index: "tally",
		name: "Bloom",
		description: "How much the colony has fed. Fruiting deals this much to each party member, then clears it.",
		iconPath: "icons/mushroom",
		colorHint: "#6b7355",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
	},

	{
		//REVENGE. The masochist's wall -- it does not answer a
		//blow, it invoices the whole room for it, and it stacks, so a Rook left alive under fire becomes
		//the largest number on the board. Its own move is how it gains stacks.
		//
		//`echoed` on the payout keeps it out of combat.enemyDamageTakenThisTurn: a thing that pays out of
		//a turn's damage may not also feed that count (see honeycomb.dealDamage).
		index: "revenge",
		name: "Revenge",
		description: "Whenever this takes damage, deal {damagePerStack} damage per stack to ALL enemies.",
		iconPath: "icons/swords-crossed",
		colorHint: "#c2544f",
		stackType: "intensity",
		isDebuff: false,
		persistsBetweenCombats: false,
		damagePerStack: 3,
		hooks: {
			//onStruck, so a hit Temporary HP soaks up still counts as damage taken.
			onStruck: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null || params.amount == null || params.amount <= 0) return;
				//Its own payout must not re-trigger it, or one hit on a Rook with a stack is a loop.
				if (params.entry != null && params.entry.damageType == "revenge") return;
				var amount = params.stacks * params.definition.damagePerStack;
				var opposing = params.entity.side == "enemy" ? "ally" : "enemy";
				var context = honeycomb.newEffectContext({ source: params.entity, combat: combat, log: params.context.log });
				var enemyArray = honeycomb.livingEntityArray(opposing, combat);
				for (var enemyIndex = 0; enemyIndex < enemyArray.length; enemyIndex++) {
					honeycomb.dealDamage(params.entity, enemyArray[enemyIndex], amount,
						{ ignoresStrength: true, damageType: "revenge", echoed: true }, context);
				}
			},
		},
	},
	{
		//A DRAW THAT ARRIVES LATER, for cards like the Infernal Knight's. Counter-stacked and spent in one go at the start of
		//the next party turn, exactly as Energised is spent when the turn's energy is set.
		index: "foresight",
		name: "Foresight",
		description: "Draw an additional card at the start of the next turn, per stack.",
		iconPath: "icons/gem-blue",
		colorHint: "#7fb0e8",
		stackType: "counter",
		isDebuff: false,
		persistsBetweenCombats: false,
		drawPerStack: 1,
		hooks: {
			onTurnStart: function (params) {
				//A piece acts as the party's turn CLOSES, so its own turn start is the next turn -- which
				//is what "on your next turn" means from where the card is written.
				honeycomb.drawCards(params.stacks * params.definition.drawPerStack, params.context);
				honeycomb.removeStatus(params.entity, "foresight", null, params.context);
			},
		},
	},
	{
		//THE COMMANDER ANSWERS FOR HER PIECES. Her outfit puts this on at combat start, so her board is Lust-proof
		//and she is not -- a party that leans on her pieces pays for them through her. The engine reads the
		//FIELD below, not the index (honeycomb.golemLustBearer), so a second character who wanted the same
		//posture would be a second status and no engine change.
		index: "commandersBurden",
		name: "Commander's Burden",
		description: "Lust that would reach one of her pieces reaches her instead.",
		iconPath: "icons/chess-queen",
		colorHint: "#c98ad9",
		stackType: "intensity",
		maximumStacks: 1,
		//NEUTRAL, NOT A BUFF: the board stops taking Lust and SHE takes it instead, which is a trade
		//rather than a gift. `polarity` is what says so -- a neutral status gets no positive descriptor,
		//is not counted as a debuff, and is not what a cleanse reaches for.
		isDebuff: false,
		polarity: "neutral",
		persistsBetweenCombats: false,
		absorbsGolemLust: true,
	},

	//---------------------------------------------------------------------------------------------------
	//THE KINGS' COURTS.
	//
	//A King is set dressing, not a combatant, so he cannot carry a turn-end effect himself. These two are
	//what he leaves on ANASTASIA, which is also how the player knows a King is in play -- his presence is
	//a status on her plate rather than a body in the line. Both fire on `onSideTurnResolved`, which is
	//after every party member AND every piece has acted; `onTurnEnd` fires per member DURING the line, so
	//either one would read a fraction of the turn.
	{
		index: "celestialCourt",
		name: "Celestial Court",
		description: "At the end of the party's turn, deal damage to ALL enemies equal to the party's total Temporary HP.",
		iconPath: "icons/chess-king",
		colorHint: "#ffe08a",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		//The share of the banked wall that is thrown. A balance pass moves this, never the hook body.
		damagePerTemporaryHealth: 1,
		hooks: {
			onSideTurnResolved: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null) return;
				var allyArray = honeycomb.livingEntityArray("ally", combat);
				var banked = 0;
				for (var allyIndex = 0; allyIndex < allyArray.length; allyIndex++) {
					banked += allyArray[allyIndex].temporaryHealth == null ? 0 : allyArray[allyIndex].temporaryHealth;
				}
				var amount = Math.floor(banked * params.definition.damagePerTemporaryHealth);
				if (amount <= 0) return;
				var courtContext = honeycomb.newEffectContext({ source: params.entity, combat: combat, log: params.context.log });
				var enemyArray = honeycomb.livingEntityArray("enemy", combat);
				for (var enemyIndex = 0; enemyIndex < enemyArray.length; enemyIndex++) {
					//`echoed` keeps this out of combat.enemyDamageTakenThisTurn: a payout of that number
					//may not also feed it, or two Courts in one fight compound into each other.
					honeycomb.dealDamage(params.entity, enemyArray[enemyIndex], amount,
						{ ignoresStrength: true, damageType: "court", echoed: true }, courtContext);
				}
			},
		},
	},
	{
		index: "infernalCourt",
		name: "Infernal Court",
		description: "At the end of the party's turn, deal damage to ALL enemies equal to the damage the party dealt this turn.",
		iconPath: "icons/chess-king",
		colorHint: "#d1603a",
		stackType: "intensity",
		maximumStacks: 1,
		isDebuff: false,
		persistsBetweenCombats: false,
		//The share of the turn's damage that is echoed.
		damagePerDamageDealt: 1,
		hooks: {
			onSideTurnResolved: function (params) {
				var combat = params.context == null ? null : params.context.combat;
				if (combat == null) return;
				//What the ENEMY side took this turn, zeroed as the party's turn opens. Deliberately not the
				//sum of each ally's `damageDealtThisTurn`: that also counts a price paid at home, so this
				//King halving its own board would echo its own cost back at the enemies.
				var dealt = combat.enemyDamageTakenThisTurn == null ? 0 : combat.enemyDamageTakenThisTurn;
				var amount = Math.floor(dealt * params.definition.damagePerDamageDealt);
				if (amount <= 0) return;
				var courtContext = honeycomb.newEffectContext({ source: params.entity, combat: combat, log: params.context.log });
				var enemyArray = honeycomb.livingEntityArray("enemy", combat);
				for (var enemyIndex = 0; enemyIndex < enemyArray.length; enemyIndex++) {
					//`echoed` keeps this out of combat.enemyDamageTakenThisTurn: a payout of that number
					//may not also feed it, or two Courts in one fight compound into each other.
					honeycomb.dealDamage(params.entity, enemyArray[enemyIndex], amount,
						{ ignoresStrength: true, damageType: "court", echoed: true }, courtContext);
				}
			},
		},
	},
];

//WHICH POLE A STATUS IS ON: positive and negative are clearly denoted, and NEUTRAL statuses get no
//descriptor. Positive and negative are the
//only poles any mechanic may read (`debuffCount`, `cleanse`); neutral is the grab-bag an unclear-but-
//real effect lives in. A status is neutral by declaring `polarity: "neutral"`; otherwise `isDebuff`
//answers. Returns 1 positive, -1 negative, 0 neutral.
honeycomb.statusPolarity = function (definition) {
	if (definition == null) return 0;
	if (definition.polarity === "neutral") return 0;
	if (definition.isDebuff === true) return -1;
	if (definition.isDebuff === false) return 1;
	return 0;
};

//A STATUS DESCRIPTION MAY WRITE ITS OWN NUMBERS, so a status can explain how much it affects damage
//rather than vaguely gesturing at it. The number is read out of the
//definition's own hook fields, so the printed text can never drift from what the hook does:
//  {damageReductionPercent}  how much less damage the holder deals ("25")
//  {damageIncreasePercent}   how much more damage the holder takes, per stack ("25")
//  {field}                   any numeric field on the definition, printed as-is
//What Frail leaves of a heal or a gain of Temporary HP, for `stacks` of it. Capped at
//`fullReductionStacks`, so a fifth stack buys another turn rather than a negative number.
honeycomb.frailMultiplier = function (definition, stacks) {
	var held = Math.min(stacks == null ? 0 : stacks, definition.fullReductionStacks);
	return Math.max(0, 1 - definition.reductionPerStack * held);
};

honeycomb.statusDescription = function (definition) {
	if (definition == null || definition.description == null) return "";
	return String(definition.description).replace(/\{(\w+)\}/g, function (whole, field) {
		if (field == "damageReductionPercent" && definition.damageMultiplier != null) {
			return String(Math.round((1 - definition.damageMultiplier) * 100));
		}
		//Frail states its per-stack share the way Sundered does.
		if (field == "reductionPercent" && definition.reductionPerStack != null) {
			return String(Math.round(definition.reductionPerStack * 100));
		}
		if (field == "damageIncreasePercent") {
			//An additive per-stack debuff (Sundered) states its per-stack share; a flat multiplier
			//(anything left) states the total increase.
			if (definition.damageIncreasePerStack != null) return String(Math.round(definition.damageIncreasePerStack * 100));
			if (definition.damageMultiplier != null) return String(Math.round((definition.damageMultiplier - 1) * 100));
		}
		if (typeof definition[field] === "number") return String(definition[field]);
		return whole;
	});
};

//Martyr's Vow: half of a change in the holder's Lust, as healing for the most hurt of their side.
honeycomb.martyrsVowHeal = function (holder, amount, definition, context) {
	var combat = context == null ? null : context.combat;
	var healed = Math.floor(amount * definition.healFraction);
	if (combat == null || healed <= 0) return;
	var receiver = honeycomb.mostHurtEntity(holder.side, combat);
	if (receiver != null) honeycomb.healEntity(receiver, healed, context);
};

//The living member of `side` with the smallest share of health left, or null. Ties go to the one nearer
//the front. Siphoned heals this one.
honeycomb.mostHurtEntity = function (side, combat) {
	var candidateArray = honeycomb.livingEntityArray(side, combat);
	var best = null;
	for (var scanIndex = 0; scanIndex < candidateArray.length; scanIndex++) {
		var candidate = candidateArray[scanIndex];
		var fraction = candidate.maxHealth <= 0 ? 1 : candidate.health / candidate.maxHealth;
		if (best == null || fraction < best.fraction) best = { entity: candidate, fraction: fraction };
	}
	return best == null ? null : best.entity;
};

//Artifact's veto. Kept beside the status it implements rather than buried in the apply routine, so
//the interaction is discoverable from the status table. Any status wanting the same behaviour points
//its canApply at this function.
honeycomb.artifactVeto = function (params) {
	var definition = honeycomb.findDefinition(honeycomb.statusArray, params.statusIndex);
	if (definition == null || definition.isDebuff != true) return true;
	if (honeycomb.statusStacks(params.entity, "artifact") <= 0) return true;
	honeycomb.removeStatus(params.entity, "artifact", 1, params.context);
	return false;
};

//Wires the veto onto every debuff without repeating canApply on each entry. Runs once at load.
honeycomb.installArtifactVeto = function () {
	for (var statusIndex = 0; statusIndex < honeycomb.statusArray.length; statusIndex++) {
		var definition = honeycomb.statusArray[statusIndex];
		if (definition.isDebuff != true || definition.canApply != null) continue;
		//Bind the status index in a closure so the veto knows which status it is guarding against.
		definition.canApply = (function (guardedIndex) {
			return function (params) {
				return honeycomb.artifactVeto({
					entity: params.entity,
					context: params.context,
					statusIndex: guardedIndex,
				});
			};
		})(definition.index);
	}
};

honeycomb.installArtifactVeto();
