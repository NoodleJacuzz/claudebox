# Lust events — RATE

**What the engine can already produce, and what the roster has to feed it.** Where the work is:
`CATCH-UP.md`. The queue is `FEEDBACK.md`.

This exists because the tag cut (B17) and the every-run goal (B18) are the same arithmetic asked from
two ends. Deciding either one without the numbers below is guessing.

Every number here is read off `honeycomb-tuning.js`. **Nothing here is measured** — it is a model built
from the tuning table, and the sim at the bottom is what would settle it.

---

## Noodle's requirement

> This is an adult game, it should be conceivable that every run triggers an H-event.

"Conceivable", not "guaranteed". The target is a run that could plausibly raise a scene, not one that
always does.

---

## The ceiling: how many events one run can raise

| Number | Value | Where |
|---|---|---|
| Party size | 3 | `tuning.teambuilding.partySizeMaximum` |
| Ranks per weakness | 3 | `tuning.lust.rankArray` |
| Ranks one run may add | 1 | `tuning.lust.maximumRankGainPerRun` |
| Chance a rank-up raises an event | 0.5 / 0.7 / 0.9 by rank | `tuning.lustEvents.chanceByRank` |

`maximumRankGainPerRun` is **per character per tag**, not per run. So one run's ceiling is
`party × tags` rank-ups — with a single tag and a full party, **three**, each rolling its own chance.

At rank 1 that is `1 - 0.5³ = 87%` chance of at least one event, if all three characters rank. The
every-run goal is therefore **already reachable on one tag**. Tag count is not what stands in the way.

---

## The floor: what a rank-up costs

| Number | Value | Where |
|---|---|---|
| Rank thresholds | 13 / 27 / 40 exposure | `tuning.lust.rankArray` |
| Exposure per point of tagged Lust | 0.4 | `tuning.lust.exposurePerLustPoint` |

So, per character, in Lust points of one tag:

| To reach | Exposure | Lust points, cumulative |
|---|---|---|
| Rank 1 — Sensitised | 13 | 32.5 |
| Rank 2 — Susceptible | 27 | 67.5 |
| Rank 3 — Undone | 40 | 100 |

**A character's whole three-rank arc costs 100 points of tagged Lust.** Enemy lust moves currently
deal 4–7, so rank 1 is 5–8 landed hits *on one character*, and most enemy lust moves target randomly.

---

## The gap

**Corrected session 47: this section was measured before the enemy overhaul and the gap has largely
closed.** The figures below are kept because the reasoning under them still holds; the numbers do not.
Today, from `../tools/lust-share.js`: **44 of 157 enemy moves deal Lust — 28.0%**. By tag: Charm 15,
Venom 15, Restraint 8, Exposure 6, **Torment 0** (no source anywhere in the game), and **Penance 43,
every one of them a Clemence card effect aimed at herself** — which the enemy-side tool does not count.
See `IDEAS.md` §1.

*The session-42 reading, superseded:*

Of the **113** enemy moves in `honeycomb-content-enemies.js`, **14 deal Lust — 12%**. By tag: Charm 5,
Venom 4, Restraint 2, Exposure 2, **Torment 0**.

An AI combatant plays one move per turn. Taking a fight at 2–3 enemies over 4–6 turns — 10–18 enemy
moves — 12% is roughly **1–2 tagged lust hits per fight**, spread randomly over three characters,
against a rank-1 cost of 5–8 hits on *one* of them.

That is the constraint, and it is the roster's, not the ledger's:

> **Frequency is free. Vocabulary is expensive.**

A sixth tag costs `7 × 3 = 21` scenes. Twenty more Venom moves across the roster cost **zero** scenes —
same ledger, filling faster. Raising the lust-move share is the lever that serves the every-run goal
without touching the authoring budget, which is why B17 and B18 do not pull against each other.

---

## A second reason to cut, that is not workload

`tuning.lust.exposureDecayPerGrowth: 0.5` — **growing one tag takes 0.5 off every other tag**, floored
at the current rank's threshold.

With five tags live, Lust spread across them erodes the others as it goes, so a mixed roster advances
slower than the sum of its hits. Collapsing to one tag removes that friction entirely. The cut is
worth making on throughput alone, before workload is counted.

---

## Scene budget by tag count

7 characters × 3 ranks × tags. (Character count read off `honeycomb.characterArray`: Brienne, Nettle,
Severine, Cassadora, Cinder, Clemence, Anastasia.)

| Tags kept | Scenes for full coverage |
|---|---|
| 1 | 21 |
| 2 | 42 |
| 3 | 63 |
| As shipped today (5 shared + Penance, Clemence only) | 108 |

---

## What would settle this

A headless sim, not a playthrough. Play N runs at the current roster and count, per run: tagged lust
points landed per character, rank-ups reached, events raised. The two outputs that matter are **events
per run** against the every-run goal, and **runs to rank 3**, which is the pacing meter a single Act 1
tag is meant to double as.

Until that exists, every number on this page is arithmetic and should be argued with as arithmetic.

---

## Rules this page must not break

- The ceiling is `party × tags`, because `maximumRankGainPerRun` is per character per tag. A change to
  party size moves the every-run goal.
- Lust from an **untagged** source records nothing. A lust move with no tag in its `tagArray` teaches
  the ledger nothing and does not count toward any number above.
- Thresholds sit at thirds of the rail by Noodle's own rule; 13 / 27 / 40 are derived, not free.
