# STARTER-REWORK-01 — brief and lever map

Working lists: **`STARTER-LIST.md`**, **`OUTFITS-LIST.md`**, **`RELICS-LIST.md`**. Quotes below are Noodle's and win. Do not implement until those lists are agreed.

Live pool is unchanged. Strip-defaults (Nettle auto-back, starter upgrades, A1 from start): `../Archive/demo1/Archive/FEEDBACK-07.md` § G.

---

## 1. The brief, verbatim

### 1.1

> On more playtesting, I've been finding that the starter card pools are in general both not flavorful
> enough (such as with basic attacks like grave strike) and too strong (like already possessing card
> draw and energy generation).
>
> However the way to go about rebalancing the starter pool isn't to look at the starter pools in
> isolation, but rather to look at them in sync with all of the other forms of progression.

### 1.2 Starting cards

> - For every card currently in the starting cards pool, it should either be removed for redundancy,
>   placed behind a progression node/outfit, its effect made into a relic/heirloom, or it should be
>   graduated into a common/rare card.
> - Card draw and energy generation effects are proving to be too strong for starter pools, especially
>   when made free. Draw, energy, and 0-cost cards are deceptively strong.
> - The final starting pools should be flavorful but not independent, and have just 4 basic starter
>   cards in decks at the start of the game; two copies of the aggressive card, two copies of the
>   defensive card.
> - Every outfit should add one card to the character's starting deck, including the default one. This
>   card should be flavorful and emblematic of the outfit's primary mechanic, but not be something that
>   carries the player.
> - The "final" starting pool is what is considered when every character has their progression tree
>   maximally complete and is on one of three paths. Progression tree nodes both add and upgrade cards,
>   and unlock abilities.

> - New Basic Starting Cards
> - Aggressive:
> Brienne - Deal 6 damage
> Nettle - Deal 4 damage, inflict 1 poison.
> Severine - Deal 2x3 damage.
> Clement - Inflict 6 lust
> Cassadora - Deal 4 damage, inflict 1 vulnerable.
> Cinder - Deals 9 damage, inflicts vulnerable on herself.
> - Defensive
> Brienne - Gain 6 tHP.
> Nettle - Remove all negative status effects from an ally.
> Severine - Drain 4 hp from an enemy.
> Clement - Grant 6 health to an ally (diffrerent from restore, fills base hp first, overflows if
> already full).
> Cassadora - Change an enemy's intent.
> Cinder - Swap places with an ally. Whoever was moved closer to the front gains 4 tHP.

> - Examples of Final starting cards.
> - Aggressive
> Brienne - Deal 6 damage. Deals 6 more if you have tHP.
> Nettle - Inflicts 3 poison (now exlusively a negative).
> Severine - Deal 3x4 damage, deal 3 damage to yourself and gain 3 lust.
> Clement - Inflict 6 lust, inflict 6 lust on yourself.
> Cassadora - Inflict 3 vulnerable (now exclusively a negative)
> Cinder - Deal 9 damage (does not change position in the party).
> - Defensive
> Brienne - Choose one: Gain 6 tHP and move to the front, or reduce lust by 6.
> Nettle - Choose one: Remove all negative status effects from an ally, or draw a card.
> Severine - Choose one: Drain 4 hp from an enemy, or steal up to 2 strength from them.
> Clement - Choose one: Grant 6 hp to an ally, or take 6 lust from them.
> Cassadora - Choose one: Change an enemy's intent, or inflict weak on them.
> Cinder - Swap places with an ally. Whoever was moved closer to the front gains 4 tHP, whoever moved
> closer to the back removes a stack of weak & vulnerable.

§1.2 basics stand. The "example finals" are one path each, not the only path. **0-cost** draw/energy
is the busted starter; a 1-cost card that also draws is fine. Starter overflow on Clemence's Grant
moved to a node in `STARTER-LIST.md`. Cinder self-Vulnerable is printed +1 extra so one stack
survives her turn (duration decays at owner turn end).

### 1.3 Progression nodes

> - Example nodes each character should certainly have
> Exclusive set 3 node choices which increase the power of aggressive starting cards. Three ranks
> *where possible* (Brienne can be split into 3 +2 tHP per slash, but Nettle can only have two ranks of
> -2 damage and +1 poison)
>
> Exclusive set of nodes which add a different "choose one" effect to defensive starting cards.
>
> Nonexclusive set of nodes which add or remove a copy of the character's aggressive starting card.
>
> Nonexclusive set of nodes which add or remove a copy of the character's defensive starting card.
>
> Node which replaces one of the character's aggressive starting cards with a random common one once
> the run starts.
>
> Node which replaces one of the character's defensive starting cards with a random common one once
> the run starts.
>
> Node which adds an extra copy of the outfit's card into the starting deck.
>
> See character bible for other notes on nodes. No node for unlocking a character outfit, see outfit
> section replacement.

> Progression node rework should include ability rework as well. Again, see character bible for
> guidelines there.

Live node list: `STARTER-LIST.md`. +Agg/−Agg and +Def/−Def are exclusive families there. Random-common
replace is that character's commons, once at run start. "Maximally complete" is exclusive-path
complete, not every nonexclusive bought.

A1 is an **enabler** (Dig In gives tHP). Training wheels **remove the enable** and turn A1 into a
situational payoff. A1 node is root/join, not a branch; training wheels are not next to it.

**Starter cards cannot be upgraded.** Tree nodes are the only way they change.

### 1.4 Outfits

> All characters should have 3 outfits. One which unlocks through winning a run with that character in
> the party, one which is purchased in the shop while that character is in your party, and one for
> having ever reached the end of the character's progression tree.
>
> While the default outfit does not block any cards from the card pool itself (except outfits
> exclusive ones), some cards should not start appearing until the outfit they are associated with is
> unlocked.
>
> At least 3 common and 2 rare cards should be unlocked this way. One of those rares should
> exclusively appear when the outfit is worn.
>
> Every outfit should increase the chances of some cards appearing, and reduce/block the appearance of
> others. Do not name the system-facing theme name when explaining this to the player, state which
> cards are affect plainly. (Ie. "Penance cards are blocked" - Bad. "Self-damaging cards are less
> likely to appear" - Good.)
>
> Unlocking an outfit should display a window showing off the new outfit, previewing its unique
> starting card, and showing the cards which will now start appearing in pools that the outfit is
> unlocked.
>
> See character bible for other notes on outfits.

Live: **default + 3**. Cinder's third is `ashfall`; Cassadora's third is `soothsayer`. No `unlockOutfit`
tree nodes. Alt signature: emblematic, not a carry, no 0-cost draw/energy, **not in rewards**.
Default adds **3 random legal cards** from that character's drop pool (run start) until default
has its own sister. The extra-outfit node **doubles** whatever the worn outfit adds.

Of the two rares an alt unlocks: the one that appears in any pool once unlocked should have
**cross-party synergy**. The worn-only rare should be **selfish** to that sister.

### 1.5 Next simulation

> - 2 Simulations, testing players who haven't completed progression trees, and players who have. This
>   means treating each possible upgrade path for starting cards as different when giving synergy
>   scores. Reduce the complexity of upgrade paths for this step (always assume maxed ranks, pick a
>   few upgrade paths to distribute among players instead of all of them having unique choices) to
>   reduce your workload to allow for 4000 simulated players again.
>
> - When testing players who have completed progression, characters abilities should be treated as if
>   they were cards in that player's decks.
>
> - When testing players who have completed progression, give each character in the party a random
>   outfit. Ensure boost and reducing effects are working.
>
> - Only give players up to 30 cards, with each 10 always offering a selection of 1-3 rare cards.

Post-progression loadouts: A1+A2, a few exclusive paths (maxed ranks on those paths), a **subset** of
nonexclusives, random outfit. Use `memberCardEntryArray` / `progression.applyToParty`, not
`startingCardArray`.

### 1.6 Misc Notes for card pool redesign

Each character likely needs a second general theme tied to their primary mechanic. Likely at least one Choose One each that offers a way to pay out otherwise useless resource building or some other effect.
It also feels lazy that the last 3 characters all use a building number as their mechanic instead of bars and orbs like Nettle and Vex do.

Brienne's secondary theme should probably be taking damage, and not gain resolve on gaining tHP. Instead it'd be 1-1 on damage taken this battle.
Nettle should have more ways of exhausting cards.
Vex needs cards that care about how many orbs are active, but self-damage and low-health enemies are already distinct enough as a primary/secondary theme.
Cinder should gain stride when she gains a debuff and not start with 2 (not even sure why she does), and should have self-debuffing (but not reducing her damage) as a secondary theme, recklessness.
Cassadora should have a single orb divided into quarters. When you change an enemy's intent away from attack, support, negative, or lust, fill an orb quadrant with that color. Between insight changing and card theft, she already has two distinct themes.
Clement's devotion should be solely based around healing herself and allies, 1-1 with each health and tHP given to any party member.

Cinder, Cassadora, and Clement were designed with too few identities and archetypes. see OUTFITS-LIST for their reworks. 

Default outfits should be designed as their own archetype which lies somewhere in the middle of the three alt outfits. Mind you, they -are- in the middle of the three alt outfits, but having no identity to call their own means the outfits have less of one as well, as shown in the pre-rework cinder, cassadora, and clement

Every character should have the same size of card drop pool. Broken cards are not counted.

Don't forget to change mechanic and ability tooltips to reflect their new nature.

Finally, and I'm sorry to leave this as a single vague note at the bottom of a misc list, I replayed slay the spire and realized we may have drawn ourselves into a corner by having such reliable healing. Yes, healing does not advance the gamestate, and in a traditional card game healing is useless, but roguelikes start to fall apart if they can't grind you down. Not every fight is a 1-1 on equal footing, successful resource management is often the key to minimizing health loss, so without a need to minimize health loss, the need to successfully manage resources is gone too.
The reason this is such a huge speedbump, is that while Severine's lifedrain can be balanced by her self-damage to mostly even out, Clement's entire kit is designed around healing. The only way she's balanced is if she makes the game more about balancing lust, but her mechanic of breaking makes that really hard to balance. I suppose the only thing to do is dive in.

---

## 2. Lever → unlock category

Abilities are combat buttons. **Unlocked through** = Node / Relic / Outfit.

| Unlocked through | Benefit | Allowance |
|---|---|---|
| **Node** | Low | Forever once bought. Exclusive if exciting. |
| **Relic / heirloom** | Medium | One loadout pick. |
| **Outfit** | High | One worn. Sister-mechanic / Act 1 posture. |

| Lever | Unlocked through |
|---|---|
| Basic Ability | Node — root or join. Grants A1. |
| Removing Training Wheels | Exclusive nodes. Removes the enable. |
| Core Identity (A2) | Node — join / capstone. |
| Pathway to the Ultimate | Outfit. |
| Category banish / sister weighting | Outfit |
| Reroll, unseen weight, card banishes | Node |
| Turn 1 Healthgain, first cleanse, HP padding | Node |
| Opening card/energy | Exclusive family (`STARTER-LIST.md`) |
| Survive-lethal, Super Exhaust | Relic |
| Innate | Dropped (5-card start) |
| Starting gold | Node |
| Bounty, shop, rest efficiency | Exclusive families (`STARTER-LIST.md`) |
| Character friction dampeners | Node |
| Party-wide interchangeable friction | Relic |
| Punishment-as-reward / tax transform | Outfit or exclusive Node |
| Resource refunds | Relic or Outfit. **Not Node.** |
| Engine scaling | Outfit or mid-run. **Not Node.** |
| Content unlocks (3c+2r) | Outfit |
| Collector, XP, cheaper sub-goals | Node |
| Weight Training | Relic |

**Not nodes:** category banishes; super-exhaust; survive-lethal; Weight Training; refunds; engine
scaling; A2-as-build-around; `unlockOutfit`; energy that isn't opening.

---

## 3. When implementing

Engine: two-person `swapParty`; Grant overflow is a **node**, not the Restore card; steal Strength =
consume + apply; `cleanse` already exists; `startingCardRemoval` / `startingCardRandomReplace` at
`memberCardEntryArray`; outfit unlock on run-win / shop / tree-end; unlock window HTML/CSS,
`HC-PLACEHOLDER`.

Run-start random cards (default's 3, random-common replace nodes) are real cards once rolled.
Each needs its own thumbnail, tooltip art, and tooltip text — no generic "random card" face.
Rolled at run start, then fixed for the run.

Tests that will break: [6] [10] [11] [13] [33]/[40] [56] [64]–[66] Clemence no-standing-lust [77]
[80]. Fixtures name `brienneGuard`, `brienneStrike`, `nettleReap`, `nettleWither`, `severineFlurry`,
`severineBloodPact` — keep as commons or update.

```
node "!designDocs/honeycomb/tools/test-honeycomb.js"
node "!designDocs/honeycomb/tools/card-inventory.js" starter,common,rare
```
