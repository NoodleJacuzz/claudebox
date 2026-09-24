# E7 — what was measured, session 45

**Archived.** Nothing routinely reads this. It exists because the project's own standard is that a
green check proves only what it asserts, and because the next session to touch the routes should be
able to see what the numbers were when they were left, rather than re-deriving them.

Noodle's standard, which this file answers:

> Testing is part of the workflow; the workflow is not complete without testing.

---

## The suite

| | |
|---|---|
| Baseline at session start | **1923 passed, 0 failed** |
| At session end | **2081 passed, 0 failed** |
| E7's block | **`[113]`, 48 checks, all passing** |

An earlier run in the small hours read 2075/1, the single failure being `[114] she stands with four
golems` — lane ANA's own block while that lane was mid-edit. It cleared on its own, which is what
`../../reference/LANES.md` §5 says to expect: a red block belonging to the other lane is noted and
re-run, never edited to get to green.

`[113]` sits directly ABOVE `[112]` so the two lanes never insert at the same anchor
(`../../reference/LANES.md` §3). Block order does not change what the suite checks.

### The block was falsified, not just run

`../../tools/falsify-routes.js` — written this session and kept, because the technique is worth more
than the one use. It loads the real engine, breaks one route function at a time back to its pre-E7
behaviour, and confirms the matching assertion stops holding. **12 of 12 assertions caught their
break; 0 missed.** A MISSED line would be a check that passes against broken code, which is worse
than no check.

The eight breaks it reproduces: `regionIndexForDepth` reverted to reading `regionArray` by position;
the win condition reverted to counting `regionArray.length`; `descendRegion` not recording a route;
`descendRegion` re-deciding on every descent; `countedRegionArray` listing the whole table; the same
leaking a secret override region; the resolution order reversed so a boss outranks a held relic; and
the old-save default removed.

### One thing block [113] got wrong, and how

It was first written during Stage 1, while every route row was still pointed at the default, and it
**encoded that staging state as if it were the rule** — `countedRegionArray()` must equal exactly
`["upperCatacombs", "floodedVault"]`, the Head Gardener must resolve to `floodedVault`, and so on.
Stage 3 switched the routes on and five of those checks failed *for being right*.

They are rewritten to derive the expectation from the table and then falsify against it: point every
row at the default and the count must collapse to the original two, switch one back and it must grow
by exactly one. **A check that hardcodes a temporary state is a check that will have to be edited to
get to green, which is the thing the suite exists to prevent.**

---

## The content tools

| Tool | Result |
|---|---|
| `enemy-template.js` | Every new enemy ✓ on health and damage. Every new encounter ✓, with one noted exception below. |
| `lust-share.js` | **44 of 157 moves = 28.0%**, inside the 25–34% band, up from the 25.7% baseline. Per route: Thorn Arbor 30.3%, Pollen Road 33.3%. Venom **15**, charm **15** — neither holds half of 44. SILENT list is exactly `siltCrawler, bogToad`, as the suite pins it; no third enemy teaches nothing. No Lust move anywhere is untagged. |
| `encounter-coverage.js` | Every new enemy reachable. R3 and R4 now generate at the same rates as R2, elites included. |
| `warnings.report()` | **1 active** (Anastasia, deliberate) |
| `doc-links.js` | exit 0 |
| `feedback-audit.js` | exit 0 — the root index agrees with every workstream |

### The one ✓ that is not a ✓

`arborTwins` reads **▼ on the static encounter-damage line**. That line is not a bar this game meets:
**three of the four shipped boss encounters read ▼ on it too** — `gardenerGrove` 9.4, `juggernautHollow`
9.7, `tallyLedger` 5.4, all against 18.1–22.1. `arborTwins` at 20.4 is higher than any of them.

The tool sums a per-body target, so a two-body encounter is measured against twice a solo boss's
damage and will always read ▼ unless each half carries a whole boss's output — which would make the
fight twice a boss. `budget-audit.js`, which plays the fight, is the measure that matters here, and it
reads ✓.

It also cannot see damage that scales off an expression: Deep Root and the Tallyman's Reckoning both
count as 0 to the static tool.

---

## The audit — what playing the fights actually said

### The control run was the most useful thing measured

Flora's first audit read **turns ▲ and output ▼ on every single encounter**, which looked like the new
content being slow and grindy. Auditing **Act1-A, the shipped region, as a control** showed it reads
exactly the same way — turns ▲ on all 16 of its encounters, output ▼ or borderline throughout.

**That is how the whole game reads at this depth.** It is a property of the budget model, not of the
new routes, and chasing it in Act1-B would have made Act1-B an outlier against the act beside it.
Anything the next session reads off `budget-audit.js` should be compared against a control run before
it is treated as a defect.

### Three real defects the audit found that nothing else did

1. **The Pollen Road broke the Lust cap.** Five line-ups measured 10.9–12.4 Lust per turn against a
   cap of 9.5. The cause was not the numbers: **three separate bodies applied `sensitive`**, which
   multiplies every Lust move after it, so the route compounded against itself. Sensitive now lives on
   Longwing alone — a reason to kill her, rather than an ambient tax. Every line-up is inside the cap.
2. **The sisters' `retort` compounded without limit.** Retort does not wear off, so a move handing it
   to *both* bodies every other turn accumulated all fight: by turn eleven the pair billed the party
   three damage per stack for every hit their shields ate. 28–30 gross per turn against a target of
   18.2. **Trimming the numbers around it moved almost nothing, because the number was not the
   problem — the stack was.** Retort is gone from Closed Bud, and `strength` from Share the Cup for
   the same reason on the other body.
3. **Neither new route had an elite pool.** `honeycomb.rollEncounter` falls back to the region's
   *normal* pool when no elite encounter names the region, so a skull node in either route quietly
   served an ordinary fight — no crash, no warning, and nothing in the coverage report but a missing
   row. Four elite encounters added; see `../FEEDBACK.md` E11 for the route-native bodies they should
   eventually become.

### The Lust cap, which is the column this route was most likely to break

The handoff said to check that column specifically, and it was right to. After the `sensitive` fix, one
line-up — **The Steeping Pools**, the three charm bodies together — still measured **9.5 against a cap
of 9.5** and tipped over. Trimming Wing Flare from 3 Lust to 2 brought it to **9.0 ✓** and left every
other encounter in band. Final spread, at `--seeds 3`:

| Group | lust/turn | cap |
|---|---|---|
| R3 (Thorn Arbor) normals | 3.4 – 7.0 | 8.9 / 9.5 |
| R3 elites | 3.4 – 4.3 | 10.8 |
| R3 boss | 9.0 | 10.9 |
| R4 (Pollen Road) normals | 4.9 – 9.0 | 8.9 / 9.5 |
| R4 elites | 4.6 – 5.6 | 10.8 |
| R4 boss | 4.4 | 10.9 |

**The Pollen Road runs close to its cap by design** — it is the Charm route — so anything added to it
later should re-run this column before it is called done.

### Saves, which are the thing that could not be undone

Four checks in `[113]`, and all four also confirmed live in the browser against the running game:

- A descended run is standing in its route's region.
- The route survives a save and reload, and regenerating the map afterwards rebuilds the same region.
- **A run saved before routes existed is not stranded** — the field is absent, not null, and such a run
  descends into `defaultSecondRegion`.
- Generating that run's map does not invent a route for it.

### Sample size, learned the hard way

The Sisters measured a **25% win rate at `--seeds 1`** and a **75% win rate at `--seeds 3`** on
content that had barely changed between the two runs. One seed is a coin toss, not a measurement.
Anything in this folder that quotes a win rate should say how many seeds it ran.

### Where the three route bosses landed

Measured at `--seeds 3`, beside the two Act1-1 bosses as a reference:

| Encounter | win | turns (tgt 9–10) | gross/turn | lust/turn | net% |
|---|---|---|---|---|---|
| The Matriarch's Lair *(shipped)* | 75% | 10.9 ✓ | 13.9 (15) ✓ | 4.9 ✓ | 48.8 |
| The Overgrown Grove *(shipped)* | 92% | 11.3 ✓ | 15.1 (15) ✓ | 5.2 ✓ | 44.1 |
| The Counting House *(moved + re-budgeted)* | 83% | 11.0 ✓ | 14.1 (15) ✓ | 5.3 ✓ | 54.1 |
| The Juggernaut's Hollow *(shipped)* | 75% | 13.3 ▲ | 22.1 (18.2) ✓ | 1.7 ✓ | 79.4 |
| **The Sisters in the Arbor** *(new)* | 75% | 11.8 ✓ | 16.6 (18.2) ✓ | 9.0 ✓ | 59.0 |
| **The End of the Road** *(new)* | 92% | 12.0 ✓ | 14.7 (18.2) ✓ | 4.4 ✓ | 53.4 |

Both new bosses sit inside the spread the shipped ones already occupy. **The Pale Dray at 92% is the
softest of the three route bosses**, tied with the Head Gardener; every one of her budget columns reads
✓, so raising her further would take her out of budget rather than into it. Flagged in the workstream
catch-up because "overshoot, not undershoot" is Noodle's stated direction and this is the one number
pointing the other way.

---

## The browser

Driven against `http://localhost:8000` with `devPreviewTarget` set **at runtime** rather than in
`scripts/index.js` — it is a `window` variable, so the contested file was never edited and never needed
resetting (`../../reference/LANES.md` §5).

Confirmed live, not asserted:

- All three Act1-1 bosses resolve to their route, in the running game, with both lanes' tables loaded.
- `countedRegionArray()` returns four regions while `regionArray` holds five — lane ANA's gauntlet
  stays out of the count.
- **The Thorn Arbor** renders: its own name in the header, its own colours, an 11-row map.
- **The Sisters in the Arbor** opens with both bodies at 128/128 and 117/117, each telegraphing its own
  intent.
- **The Pollen Road** renders, and **The Pale Dray** opens at 245/245 telegraphing Forefoot for 20.

Enemy sprites are blank in those shots because all thirteen drawings are owed. That is the gap
`artOwed: true` declares, and `[82]` counts it — it is not a layout fault. Saying so explicitly because
this folder has been burned before by a screenshot taken against missing rasters.
