# Enemy rework — FEEDBACK

Enemy numbers, identities, roles and encounter composition. Enemy **art scope** is `../../art_pipeline/FEEDBACK.md` (B21); enemy **title legibility** is `../../ui/FEEDBACK.md` (B32).

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins. Items were split out of the round-09 file in session 41 and moved
byte for byte — nothing was rewritten on the way.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `../../CATCH-UP.md`. What the project is: `../../BASICS.md`.

---

### B31. Sporelings should be fought in bulk ☆

> Sporeling could be better designed to be fought in bulk, like 4x in an encounter, since matriarch
> summons them and the game could use more aoe checks

Two reasons given, both good: the Matriarch already summons them (so a bulk sporeling encounter is
consistent with existing content), and **the game needs more AoE checks** — encounters that test
whether a deck can handle several bodies at once. `../../chessmaster/STATUS.md` notes the Matriarch can summon
5 and never reads the ally-side cap, so the engine side is already there. This is an encounter-table
entry plus a look at whether the sporeling's own numbers suit being one of four.

---

### Moth Light sits just over the Lust-to-damage cap ☆ — FOUND SESSION 44, NOT CAUSED BY IT

`budget-audit.js` at 4 seeds reports **Moth Light at 6.8 Lust per turn against a 6.6 maximum** — 3%
over `tuning.balance.lustToDamageRatioMaximum`, and the only one of 44 encounter rows that is over at
all. A 1-seed run of the same encounter reads 5.6 and passes, so it is marginal and seed-dependent
rather than a clear break.

**It is not the enemy overhaul's doing.** The line-up is Sporeling + Glowcap Moth + Gloom Wisp, and
session 44's Lust lift changed no move any of those three plays — it is simply the one encounter built
from three of the four enemies that already dealt Lust before the pass. Whether a cap written as a
per-line-up maximum should tolerate an all-casters line-up at all is this folder's call.

---

### B36. The Argent Fencer was meant to be saved for a two-enemy elite fight ☆ — FILED FROM THE INBOX, SESSION 51

> for argent fencer's sprite we were supposed to save her for a two-enemy elite encounter with the
> other butterfly knight

**She was not saved. She is in six encounters, and none of them is a two-enemy elite fight.** Measured
against the encounter table:

| Encounter | Tier | Line-up |
|---|---|---|
| `pollenRoadside` | early | Argent Fencer, Soakcap, Gloom Wisp |
| `pollenFencers` | middle | Sable Fencer, Argent Fencer, Soakcap |
| `pollenBower` | middle | Longwing, Argent Fencer, Gloom Wisp |
| `pollenDeepRoad` | late | Sable Fencer, Argent Fencer, Gloom Wisp |
| `pollenBathhouse` | late | Soakcap, Longwing, Argent Fencer |
| `pollenHighDrift` | late | Mantlewing, Argent Fencer, Sporeling |
| `pollenStripped` | late | Kobold Scavenger, Argent Fencer |

The pair fight he is describing half-exists. `pollenFencers` and `pollenDeepRoad` both field the Sable
Fencer and the Argent Fencer together, which is the matched pair `v13 spire images/_source/enemy inspo variants/assigned/ASSIGNED.md` asked for — *"Fight them
together. A matched pair reads as deliberate where two separate enemies read as lazy."* But both are
ordinary fights with a third enemy padding them out, not elites, and she appears in five other fights
besides, so nothing about her reads as held back.

The elite nodes on this route field the **Kobold Scavenger** instead, which is `enemy_overhaul/` E11 —
Act1-B and Act1-C have no elite pool of their own. A two-Fencer elite would close E11 for Act1-C and
this item at the same time. What it costs is one encounter-table entry at `tier: "elite"` and removing
her from some of the six fights above; how many of the six she should keep is a design call, not a
measurement.

---

### B37. Enemy sprites are drawn off the screen, and it is worse than the two he caught ☆ — MEASURED SESSION 51

Two separate reports, one cause:

> Soakcap's sprite is gigantic

> The Pale Dray doesn't fit on the dang screen

**What decides a sprite's size.** `presentation.scale` on the enemy's own content-table entry. It is a
named field, so this is not a magic-number problem — the numbers are in the right place, they are just
wrong. Nothing clamps the result to the stage, so a scale that looks right in one window shape hangs
off the edge in another.

**Measured at his window shape, 1878x804, with a three-ally party.** Twelve sprites leave the screen.
`topCut` is pixels above the top of the window; `rightCut` is pixels past the right edge:

| Encounter | Enemy | scale | top | right |
|---|---|---|---|---|
| `gardenerGrove` | **The Head Gardener** | 1.9 | **453** | 159 |
| `drayRoad` | **The Pale Dray** | 1.3 | **108** | 0 |
| `nettleVenomBattle` | Bolete Hook | 1.45 | 0 | 137 |
| `pollenFencers` | **Soakcap** | 1.45 | 0 | 73 |
| `floraStripped` | Windfall Alraune | 1.2 | 0 | 35 |
| `arborTwins` | The Sleeping Sister | 1.15 | 0 | 28 |
| `championAlone`, `championGuard` | Hollow Champion | 1.25 | 0 | 20 |
| `pollenBathhouse`, `pollenStripped` | Argent Fencer | 1.05 | 0 | 12 |
| `floraBellChoir`, `floraCache` | Trumpet Bell | 1.15 | 0 | 6 |

**The Head Gardener is cut off at the neck and has not been reported.** She loses 453 pixels off the
top — she is the Act1-1 boss, so a run that meets her sees a headless figure. That is four times worse
than the Pale Dray, which is the one he noticed.

**A bigger window makes it worse, not better.** The same fights at 1920x1080: the Head Gardener is 606
over the top rather than 453, and the Pale Dray 145 rather than 108. Sprite size follows the viewport
and the stage it stands on does not, so this cannot be dismissed as his window being short.

**Soakcap is the widest ordinary enemy in the game.** Its scale is 1.45, tied with the Bolete Hook for
the highest of any non-boss, and its drawing sits on a 1011x1300 canvas rather than the shared
832x1216, which widens it again (`honeycomb.art.normaliseCanvas`). Next to the Longwing, which is on a
650x1300 canvas, it renders about half as wide again. In `pollenFencers` it is 443px wide and 73 of
them are off the screen.

**The tool.** `!designDocs/honeycomb/tools/audit-sprite-fit.js` (new, session 51) reports this for every encounter at whatever
window shape is being tested. Run it at the shape being asked about. It is a browser audit; loading and
usage are in its header.

**What is NOT decided here.** How big each of these should be is his taste, not a measurement. The
numbers above say which entries are wrong and by how much; they do not say what to put there. Two ways
to go, and they are not exclusive: retune the `presentation.scale` values that overflow, or give the
sprite a real height cap so no scale value can push a drawing off the stage. The second is the engine
bug — `honeycomb-art.js` already records that `.hcFighterArt`'s `max-height` is a percentage whose
containing block has no definite height, so the cap resolves to none and has never applied.

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

---

### P15. Single Hollow Champion is too far right, and the Head Gardener is too tall ⏸ — MEASURED, WAITING ON HIS NUMBERS

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

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../../FEEDBACK.md` instead)*
