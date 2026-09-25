# ENEMIES-01 — the enemy pass

Session 34 (2026-09-19, Opus). Read first: `../cards/BALANCE-01.md` (the budget), `../../designBibles/mechanics.md` (the
encounter laws), `../../designBibles/story.md` (Act 1 fluff). Quotes are Noodle's, verbatim; if an annotation
disagrees with a quote, the quote wins.

Status key: ☐ not started · ◐ in progress · ☑ done · ⏸ waiting on Noodle

## The brief

> Specifically, we'll be working on enemies. They need a full rebalancing, both in terms of actual numbers
> but also identities. BALANCE-01 goes into the math of it and designBibles/mechanics.md defines the rules
> enemy encounters should follow but the long and short of it is the game in its current state is far too
> easy. Even for a demo that's only act 1, there's no real sense of danger and enemies fall very short of
> dealing or taking the expected amount of damage. So, our goals which must be finished in time for the
> demo release:
>
> 1. Create a defined template for enemies at the regular, elite, and boss levels.
> 2. Adjust existing enemies to reach that level and test according to BALANCE-01's guidelines.
> 3. Once we have that template, we begin working within it to create more interesting enemy designs. I
>    would like the entire list of current enemies improved to a level where they each have some kind of
>    memorable gimmick or identity, like focusing on a particular damage type, or involve some interesting
>    gameplay twist.
> 4. Create more enemies. I would like for it to be reasonable that the player does not see every enemy
>    type within 3 runs, assuming 20 combat encounters per run. You'll have to crunch the numbers on that
>    based on encounter rates, but I'm sure our current enemy lineup is not enough. The mechanical side of
>    enemy creation should be well-laid for you by this point, but the fluff end of it can be found in the
>    story design bible, and potentially by reading the tags inside image sidecars in the original enemy
>    sprites located in v13 spire images\_source\refsPNG\enemies. (Note: the bee enemies are not to
>    actually be used in act 1, but you can riff off of their designs).

> Not to mention, it's better if we overshoot the difficulty goal than undershoot. Difficult enemies gives
> us the opportunity to "hear the playerbase" by improving pieces of the kit, not to mention the player
> will outstrip the difficulty of runs eventually as they progress. […] Maybe a major design consideration
> missing was the fact that the player isn't meant to win every run? […] ideally, a new player should be
> like, random number off the top of my head here, 10 runs deep at least before they see act 3.

> 18 damage a turn is the number starter cards are built around (1 energy = 6 damage, 3 energy/5 cards per
> turn. True we don't always deal max damage but Brienne's shields, Severine's drain, Clement's healing,
> everyone's got some tHP gain, all those make dealing damage safer), and we know that at least. We also
> know that common cards do more than that, being valued at about 9-12 damage per energy.

## Status board

| Step | State |
|---|---|
| 0. The audit measures a real player | ☑ `../../tools/budget-audit.js` rewritten (§1) |
| 1. The template | ☑ `tuning.balance` + `enemyRoleArray` (§2); `../../tools/enemy-template.js` checks it statically |
| 2. Existing enemies to the template | ☑ every enemy in §3 is in the table and measured by `../../tools/enemy-template.js` |
| 3. An identity for every enemy | ☑ §3's identity column is built |
| 4. More enemies + coverage | ☑ 13 new enemies and two boss pools; re-measure coverage when the roster next changes |
| 5. Art owed | ☑ each new enemy owns a recoloured placeholder folder, and §5's tags ship as png + txt pairs in `v13 spire images/_source/refsPNG/enemiesOwed/` (session 36) |

**Session 36 note.** This pass landed; what the interruption cost it was its own bookkeeping and the
art. Every new enemy had been left pointing at another enemy's folder with `artFolder`, so the roster
rendered as a handful of repeated pictures — Noodle's FEEDBACK-08 item 2. Each now has its own folder
and a hue/brightness/saturation recipe in `ENEMY_SOURCES`, picked from its own tags in §5 below. SIZE is
not in the recipe: the enemy table's `presentation.scale` already sets how tall each one stands.

## 1. Why the old audit agreed with the old enemies

The session-32 player played one defence card and then attacks, and understood no other card. It spent
under three energy a turn, so Clemence and Cassadora parties output ~8. Its fight lengths ("every fight
2–4× too long") and its "middle and late are brutal" rows were its own weakness. Its early rows were right:
early fights cost 1–3% of party HP, which is Noodle's live experience.

The session-34 player is a greedy one-ply search through the engine's dry run (every card and ability on
every legal target, then the enemy turn, scored), on a fresh-save deck (default outfits, heirlooms, the
three run-start commons each) plus the reward picks a run has made by that stage
(`tuning.balance.draftedCardsByStageArray`). Measured on the old roster: output 14–18 a turn, 100% wins on
every fight including both bosses, early fights 0.5–3% of party HP, region 2 fielding region 1's fights
against a 31-card deck. Report: `ENEMIES-01-AUDIT-BEFORE.txt`.

It is a floor: it drafts without synergy and never upgrades. Noodle's live play is the ceiling, and the
targets are priced against the ceiling (overshoot, per the brief).

## 2. The template

### 2.1 Group budgets (`tuning.balance`)

A **group** is region × tier × fight kind. Its budget:

- **Line-up HP** = party output × target turns (mid-band). Output: 18 / 21 / 24 (R1 early/middle/late),
  27 / 30 / 30 (R2). Enemy Temporary HP counts against it.
- **Gross damage per turn** (fight average) = net budget ÷ turns + output × ⅓ (the share a party spends on
  Temporary HP). Net budget: 10% / 22% / 38% of party HP (R1 normal/elite/boss), 15% / 30% / 45% (R2).
- **Full-strength damage** (what the whole line-up threatens on turn one) = gross × 1.5 for a group of
  several (members die mid-fight), × 1.2 for a solo elite or boss.
- **Lust** counts toward the damage figure; a line-up's Lust stays ≤ 60% of it.

| Group | HP | full-strength dmg / turn |
|---|---|---|
| R1 early normal | 63 | 16.6 |
| R1 middle normal | 74 | 18.1 |
| R1 late normal | 84 | 19.6 |
| R1 elite | 137–156 | 15.6–16.8 |
| R1 boss | 228 | 18 |
| R2 normal | 122–135 | 22–24 |
| R2 elite | 195 | 22 |
| R2 boss | 285 | 22 |

### 2.2 Roles (`tuning.balance.enemyRoleArray`)

An ordinary enemy is written to a **role**: a share of its region's EARLY normal group. An encounter is its
members summed, and must land within ±25% of its own group. Deeper groups add bodies, not stats.

| Role | HP share | dmg share | R1 (HP / dmg) | R2 (HP / dmg) | Shape |
|---|---|---|---|---|---|
| minion | 0.32 | 0.30 | 20 / 5 | 39 / 6.7 | comes in threes |
| striker | 0.38 | 0.50 | 24 / 8.3 | 46 / 11 | glass cannon |
| soldier | 0.55 | 0.42 | 35 / 7 | 67 / 9.4 | the line |
| tank | 0.70 | 0.30 | 44 / 5 | 85 / 6.7 | protects, stalls |
| support | 0.40 | 0.22 | 25 / 3.7 | 49 / 4.9 | + a utility the party must answer |
| caster | 0.45 | 0.36 | 28 / 6 | 55 / 8 | debuffs, Lust |
| elite | 1.0 of the elite group | | 137 / 15.6 | 195 / 22 | one charged big move, one passive |
| boss | 0.9 of the boss group (reinforcements the rest) | | 205 / 18 | 256 / 22 | two phases, two charged moves, one signature |

### 2.3 Move-list rules

- **Expected damage** = Σ weight × damage ÷ Σ weight. Area hits count × 3, poison p counts p(p+1)/2 per
  target, Lust counts as damage. A charged move counts at most once per `chargeCost` turns.
- At least half the move weight threatens something (damage, Lust, a DOT, a curse, a debuff).
- At most one **dawdle** (self Temporary HP with no payoff) at ≤ 25% weight: the bible's Act 1 dawdling.
- Every enemy has **one identity**: a passive, a charged signature, or a loop the player can learn.
- Every encounter **pairs** a burst test with a grind test (mechanics bible §3).

`node "!designDocs/honeycomb/tools/enemy-template.js"` prints each enemy's HP and expected damage beside its role,
and each encounter's sums beside its group. The audit then says what they actually cost.

## 3. The roster

Identity column: **B** = what tests Burst, **G** = what tests Grind.

### Region 1 — the Upper Catacombs (Fungal Depths)

| Enemy | Role | Identity | B / G |
|---|---|---|---|
| Sporeling | minion | **Sporeburst**: dies into 2 Poison on the whole party | B: killing costs / G: poison |
| Gloom Wisp | caster | **Haunts the deck** (Wisp curses) and charms (Lust) | both: dead draws |
| Spore Gardener | support | **Replants**: summons a Sporeling (charged) | B: kill her first / G: bodies + poison |
| Cap Brute | soldier | **The loop that grows**: Wind Up → Slam → Pin → Stomp, +2 Strength a lap | G: scaling / B: HP |
| Hollow Knight | soldier | **Armour-breaker**: strips Temporary HP, pierces the back | G: walls |
| Fungal Sage | caster | **Curse-weaver**: Frail on the party, Artifact on itself | G: defence debuffed |
| Spore Alchemist | support | **The brewer**: Strength to the whole line | G: scaling |
| Bark Sentinel | tank | **Thornwall**: starts with Thorns, guards the line | B: multi-hit punished |
| *Puffcap* (new) | minion | **Countdown**: swells twice, then bursts on everyone and dies | G: a clock |
| *Mold Leech* (new) | striker | **Lifesteal**: every bite heals it | G: out-heals chip |
| *Moldshaper* (new) | support | **Regrowth**: Regeneration to the line | G: out-heals DOT |
| *Cordyceps Husk* (new) | soldier | **Host**: a Sporeling bursts out when it dies | B: two bodies |
| *Glowcap Moth* (new) | caster | **Charm**: Lust-first, the party's Lust budget | Lust |

### Region 2 — the Flooded Vault

| Enemy | Role | Identity | B / G |
|---|---|---|---|
| *Silt Crawler* (new) | minion | **Plated**: every hit on it is reduced | B: multi-hit blunted |
| *Mire Eel* (new) | striker | **Submerge**: armours up, then strikes with Strength | both: telegraphed spike |
| *Bog Toad* (new) | tank | **Tongue**: drags the back member to the front | formation |
| *Drowned Salvager* (new) | soldier | **Thunder box**: Sundered on hits, a charged Discharge on everyone | G: Sundered |
| *Lantern Jelly* (new) | caster | **Stinging bell**: Thorns and a Lust lure | B: Thorns / Lust |

R1 enemies also fill R2 line-ups as extra bodies (a R2 group is ~2× a R1 group).

### Elites and bosses

| Enemy | Where | Identity |
|---|---|---|
| Kobold Scavenger | R1 + R2 elite | **Bombs**: a charged Big Bomb, curls up when hurt |
| *Hollow Champion* (new) | R1 + R2 elite | **En garde**: a stance of Temporary HP and Retort, then a Lunge |
| The Matriarch | R1 boss | Summons (every Sporeling bursts) and Lust |
| *The Head Gardener* (new) | R1 boss | **Garden of countdowns**: plants Puffcaps, grafts Strength onto the line |
| The Juggernaut | R2 boss | Position and Sundered |
| *The Tallyman* (new) | R2 boss | **Still counting** (the region's own description): every card the party plays adds a Tally; Reckoning hits everyone for the Tally and clears it |

Bosses are now a **pool per region** (`bossEncounterIndexArray`), so a run meets one of two.

### Art

New enemies stand on the nearest drawn sprite (`artFolder`) with `artOwed: true` until drawn. Sidecar-style
tag lines for the art pipeline are in §5.

## 4. Coverage: "not every enemy type within 3 runs"

`node "!designDocs/honeycomb/tools/encounter-coverage.js"` generates real runs with the game's map generator and
walks them. **A full run meets 16–18 fights** (random path 16.0, fight-seeking 17.6; Noodle's 20 is a fair
upper bound). Per run: R1 ~3.4 early, ~3.1 middle, ~1.3 late, ~0.8 elite; R2 ~2.4 / ~2.1 / ~0.4, ~0.4 elite.

**Before (11 types): P(every type seen within 3 full runs) = 93%.** Every enemy had ≥ 65% per-run odds.

Target: under 50% for the non-boss roster, and the bosses split into pools so no boss is guaranteed.

## 5. Art owed (sidecar tags for the pipeline)

Every new enemy carries `artOwed: true` and stands on the drawing named in its `artFolder` until its own is
drawn. Draft sidecar tag lines in the style of `v13 spire images/_source/refsPNG/enemies/*.txt` (the shared
negative prompt is the one on `alchemist.txt`). Region 1 stays myconid / fungal fauna; region 2 is the
flooded, fauna-first "alternate pathway" from the story bible, with scavenged Earth junk treated as fantasy
(story bible §4). Nothing here is a bee.

| Enemy | Stands on | Sidecar tags |
|---|---|---|
| Puffcap | sporeling ×0.75 | fantasy, enemy, myconid, fungal fauna, full body, white background, solo, puffball mushroom, round body, swollen, bloated, spore sacs, tiny legs, no arms, cracked cap, glowing spores, dotted eyes, chibi, about to burst |
| Mold Leech | gloomWisp ×0.9 | fantasy, enemy, leech, giant leech, fungal fauna, full body, white background, solo, segmented body, slimy, mold patches, round sucker mouth, teeth ring, no eyes, green mold, glistening, coiled |
| Moldshaper | sage ×0.9 | fantasy, enemy, myconid, fungal fauna, full body, white background, solo, mushroom hat, hooded robe, mold-covered robe, holding lump of mycelium, shaping mold, white threads, hyphae, grey body, solid eyes, no mouth, purple mushrooms |
| Cordyceps Husk | hollowKnight ×0.95 | fantasy, enemy, zombie adventurer, cordyceps, fungal growth from back, mushroom stalks from shoulders, full body, white background, solo, ragged leather armor, rusted sword, hunched, blank eyes, spores, infected, grey skin |
| Glowcap Moth | gloomWisp ×0.8 | fantasy, enemy, moth, giant moth, fungal fauna, full body, white background, solo, fluffy thorax, mushroom cap on head, glowing wing spots, bioluminescent, pink pollen, feathered antennae, big eyes, hovering |
| Silt Crawler | scavenger ×0.7 | fantasy, enemy, crab, river crab, full body, white background, solo, mud-caked shell, barnacles, algae, big claw, small claw, eyestalks, armored, low stance |
| Mire Eel | gloomWisp ×1.1 | fantasy, enemy, eel, giant eel, full body, white background, solo, rising from water, coiled body, slick skin, dark green, fins, gaping jaw, needle teeth, glowing eyes, water drips |
| Bog Toad | capBrute ×1.15 | fantasy, enemy, toad, giant toad, full body, white background, solo, fat, warty skin, moss, mushrooms growing on back, long tongue, wide mouth, heavy lidded eyes, sitting, mud |
| Drowned Salvager | scavenger ×0.9 | fantasy, enemy, kobold, full body, white background, solo, soaked, scrap armor, road sign shield, spear with car battery strapped on, wires, sparks, goggles, diving mask, reptile, scales, tail |
| Lantern Jelly | gloomWisp ×1.0 | fantasy, enemy, jellyfish, floating, full body, white background, solo, translucent bell, glowing core, lantern light, trailing tentacles, stinging tendrils, pink glow, bioluminescent, no face |
| Hollow Champion | hollowKnight ×1.25 | fantasy, enemy, myconid, fungal fauna, full body, white background, solo, mushroom hat, tall, heavy plate armor, tattered cape, greatsword, dueling stance, en garde, solid eyes, no mouth, battle-worn, large |
| The Head Gardener | gardener, anchored | fantasy, enemy, myconid, fungal fauna, boss, full body, white background, solo, large, mushroom head, flower crown, moss robe, gardening shears, watering can, basket of puffballs, roots for feet, vines, green eyes, solid eyes, garden around feet |
| The Tallyman | sage, anchored | fantasy, enemy, boss, full body, white background, solo, tall, thin, robed figure, abacus, giant ledger book, quill, spectacles, drowned, dripping, barnacles, chains of coins, hollow eyes, counting, candle on hat |

(The Tallyman is the one that riffs on the bee refs: `elder-a` gave the robe, the staff-held-behind pose and
the long-bearded "keeper" read. None of it is a bee.)
