# Enemy numbers — FEEDBACK, done

Closed items, moved out of `../FEEDBACK.md` with their quotes and annotations intact.
**Quotes are Noodle's, verbatim.**

---

### P14. The very early game is too hard ☑ — AN OPENING TIER BUILT SESSION 55, AND THE REST IS OPEN

Three reports, one subject. His words, all three:

> We critically need easier encounters on the first half of the map.

> regular battles being so fast, passives/poison suck. Damage is too high among enemies, and we
> desperately need easier, denser encounters otherwise the grind strategy is impossible to pilot and
> burst is the only option

> "Got Moth Light as my first encounter, with several dead cards in deck" Feedback, it's extremely clear
> the very early game is too difficult, there need to be multiple encounter pools, probably 3 but at
> least 2, for act1-1 with easier mobs at the start for players screwed by their random commons.

**What was actually there.** Region 1 already had three pools — `early`, `middle` and `late`, picked by
how deep the row is. The problem is what was IN the early one. Every single early encounter is three
enemies, and they all sum to the same budget:

| Encounter | Line-up | Total HP | Damage per turn |
|---|---|---|---|
| Spore Clutch | sporeling + sporeling + sporeling | 66 | 16.8 |
| Wisp Cluster | gloomWisp + sporeling + gloomWisp | 70 | 20.8 |
| The Seed Bed | sporeling + gardener + sporeling | 70 | 15.4 |
| Puffcap Patch | puffcap + gardener + puffcap | 54 | 24.3 |
| Leech Nest | moldLeech + sporeling + sporeling | 68 | 18.8 |
| Moth Light | sporeling + glowMoth + gloomWisp | 68 | 19.9 |

**Moth Light, the one he was handed first, is the exact budget target.** It is not an outlier. The first
fight of a run was the same size as the seventh, and it was fought on a deck that had drafted nothing.

**What was built: a fourth tier, below `early`, called `opening`.** It covers the first sixth of a
region, which is rows 0 to 2 of an 18-row act1-1, and it holds one- and two-enemy line-ups:

| Encounter | Line-up | Total HP | Damage per turn |
|---|---|---|---|
| Loose Spores | sporeling + sporeling | 44 | 11.2 |
| Wisp and Spore | gloomWisp + sporeling | 46 | 13.2 |
| Leech and Spore | moldLeech + sporeling | 46 | 13.2 |
| Moth and Spore | glowMoth + sporeling | 44 | 12.3 |
| The Nursery | gardener + gloomWisp | 50 | 11.9 |

The budget it is graded against is 49 HP and 13.9 damage, where `early` is 63 and 19.9. All five are
inside `tuning.balance.varianceFraction`, so `../../tools/enemy-template.js` passes them.

**The tier is priced, not eyeballed.** `tuning.balance` gained an `opening` entry in three of its
tables: an opening fight costs the party 6% of its health rather than 10%, is fought at an assumed
output of 14 rather than 18, and assumes 0 drafted cards rather than 2. That last figure is the honest
reason the fights are smaller. The party fighting row zero has drafted nothing.

**A region with no opening content is not broken by this.** `honeycomb.rollEncounter` steps DOWN the
tier list when the one it asked for is empty, so regions 2, 3 and 4 field their own `early` encounters
at row zero exactly as before. Checked: region 0 rolls the five new fights, and regions 1 to 3 roll
their own early pools and nothing from another region.

**WHAT IS NOT DONE, AND IT IS THE BIGGER HALF.** Two of his three sentences are about the fights in the
middle of the map rather than the first three rows:

1. **"regular battles being so fast, passives/poison suck."** `tuning.balance.turnTargetArray` sets act
   1 normal fights at 3 to 4 turns. A poison or passive build cannot pay off in three turns, which is
   why he says burst is the only option. Raising that target is a real change: encounter health is
   output × turns, so every region-1 encounter and every enemy in it would need restatting against the
   new budget. That is a full balance pass with `../../tools/balance/all-the-crunch.js` behind it, not an
   overnight edit.
2. **"we desperately need easier, DENSER encounters."** Denser means more fights per map, which is
   `tuning.map.nodeWeightArray` — combat is 45 of 110 today. Session 55 did not touch it, because it
   pulls against `map/` P11 (fewer chests) and `map/` B28 in ways that want measuring together.

**The opening tier makes the first three rows kinder. It does not make the act longer or denser.**
Those two need his call on how far to go, and a Crunch run to say what the numbers cost.

**Archived 2026-09-25.** The opening tier, the 8% net damage and the denser maps are in (sessions 55 to 55d; the opening band is rows 0 to 5). The half still open, whether act 1 fights should last longer, is carried by the 2026-09-25 encounter item in `../FEEDBACK.md`; it needs his word and an All the Crunch run either side (`../../../Archive/playtest_55/READ-ME-2.md` §6).

---

### P15. Single Hollow Champion is too far right, and the Head Gardener is too tall ☑ — CLOSED 2026-09-25 (scale derived session 55b)

> Single hollow champion enemy is too far back on the right side of the screen

> Head gardener is too tall

**Both are already measured in B37 above, and both confirm it.** At his window shape, 1878x804, with a
three-ally party: the Head Gardener loses **453 pixels off the top**, and the Hollow Champion in
`championAlone` hangs 20 pixels past the right edge.

**The Head Gardener is the outlier of the whole cast.** Every enemy graded boss or elite, with its
`presentation.scale`:

| Enemy | Scale | Stands |
|---|---|---|
| **The Head Gardener** | **1.9** | behind the row |
| The Pale Dray | 1.3 | behind the row |
| Hollow Champion | 1.25 | in the row |
| The Arbor Sisters | 1.15 | in the row |
| The Matriarch | 1.0 | behind the row |
| Drowned Salvager | 1.0 | in the row |
| The Tallyman | 0.95 | behind the row |
| The Juggernaut | 0.9 | behind the row |

She is nearly double the next largest, and the other Act1-1 boss, the Matriarch, is 1.0. Her drawing is
also the only one on a **1300x1300 square canvas**; every other boss is on something taller than it is
wide, and the shared canvas is 832x1216. A square canvas draws taller at the same width, which is what
`honeycomb.art.normaliseCanvas` exists to correct.

**NO NUMBER WAS CHANGED, DELIBERATELY.** B37 says how big each of these should be is his taste rather
than a measurement, and that is still true. What is new is that he has now named the Head Gardener
himself, so the sizing decision on her is his to make and the evidence for it is above.

**The engine bug underneath is still the better fix**, and it is quoted in `honeycomb-art.js`:
`.hcFighterArt` carries `max-height` as a PERCENTAGE, and its containing block has no definite height,
so the cap resolves to none and has never applied. Fixing that caps every sprite at once instead of
retuning eight numbers. It moves how every fighter is drawn, so it wants his eye on a preview first.

**Closed 2026-09-25.** Session 55b derived the Head Gardener's scale at 1.1 from the sprite-fit measurements, so her head is inside the top edge and she still runs off the side as he wanted (`../../../Archive/playtest_55/READ-ME-2.md` §5). The Hollow Champion's 20 pixels past the right edge stay measured in B37, which is open.

---

### The Scrap Salvager was promoted to elite ☑ — LANDED SESSION 44, LOGGED HERE BECAUSE THE NUMBERS ARE THIS FOLDER'S

Noodle, session 44:

> Scrap salvager's definitely an elite.

`enemy_overhaul/` owns who an enemy is and this folder owns what it costs, so the stat side is
recorded here. Health 64 ± 4 → **135 ± 6**, written between the Kobold Scavenger's 130 and the Hollow
Champion's 140 rather than at the solo-elite line-up target of 195, because every R2 elite encounter
pairs its elite with a normal body. Spark Spear 10 → 14 and the charged Discharge 7 → 10 carry the
promotion; the snare and the patch are untouched. Gold 16–24 → 30–45.

Six encounters were rebuilt around him — he left three normal line-ups and one elite pairing, and
gained **The Salvage Crew** (middle) and **The Stripped Grove** (late). A new normal middle encounter,
**The Frontier Post**, replaces the line-up he vacated. `enemy-template.js` after: every encounter ✓
on health, out-of-band row count unchanged at nine. Full record: `../../enemy_overhaul/_archive/FEEDBACK-DONE.md` E10.

⚠ **He is now seen in 14% of runs**, the rarest non-boss in the game (`encounter-coverage.js`). That
was a consequence of the role change rather than a decision, and R2's late elite tier fires in only
0.07 fights per run — if he should be met more often, add a second middle-tier elite encounter rather
than touching his stats.
