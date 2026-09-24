# Enemy overhaul — CATCH-UP

## ⚠ READ FIRST — session 50 (E12): the Act1-1 clerk is cut

**The Tallyman no longer exists. The Act1-1 boss that opens the route to Act1-A is THE SHROUD**, a colony
of black mold grown into the shape of a robed reaper, with a scythe that is a fruiting body rather than
a tool. Noodle cut the clerk on sight of the first art pass — *"it is absolute word salad to my mind, I
just felt like the shadowy reaper dude looked cool"* — and asked for *"a mostly similar reaper guy who's
like a sentient colony of black mold or something with a scythe."* Quotes and the full closure are
`_archive/FEEDBACK-DONE.md`, **E12**.

**The index is still `tallyman`, and so are all five card indices.** Indices are save data; only words
moved. A session reading the tables will see clerk indices under mold names, and that is deliberate —
the same way `bogToad` holds the Bolete Hook.

| What | Was | Now |
|---|---|---|
| the boss | The Tallyman | **The Shroud** |
| its passive | The Ledger | **The Damp** |
| its stacks | Tally | **Bloom** |
| its five moves | Ledger Slam, Collect Debt, Audit, Compound Interest, Reckoning | **Sickle, Seep, Settling, Proliferate, Fruiting** |
| its encounter | The Counting House | **The Damp Room** |

**Every number is untouched** — 205 health, the phases, the move list, the weights, the charge costs
and the whole effect table are the E7 values the budgets were measured against. The species tag moved
`construct` → `plant`; nothing in the card or relic tables keys off either word, which was measured
before the change. `lust-share.js` still reads **28.0%**.

**The names are open for veto** — they were added to **E9** in `FEEDBACK.md`, like every other name this
workstream has proposed.

**One thing the cut costs, and it is not a defect:** the clerk was the fiction's only answer to where a
society with no smiths got its plate and spears. Recorded as an open question in
`../designBibles/story.md` §Act1-A rather than quietly dropped.

**Art:** the first pass rendered a giant fly agaric because its brief carried `myconid, mushroom head,
red mushroom` in the positive and `myconid, mushroom, cap, spores, fungal` in the negative at the same
time. The rewritten brief is `D:\honeycomb spare art6-09-2413 spire png\enemies\_workbench/tallyman.txt`, and the design it is
written from is the ART note on the table entry.

Measured: suite **2420 passed, 0 failed**, new block `[124]`, 14 checks. Falsifying it caught one of
its own checks reading `reactionHooks` through `JSON.stringify`, which cannot work — those reactions
compile to closures — so it was red on clean content and looked correct under mutation. Rewritten and
re-falsified; the detail is in `_archive/FEEDBACK-DONE.md` under E12.

---

## ⚠ READ — session 45, the morning after (E7)

**Both new routes are ON.** Act1-2 is three routes now, and which one a run gets is decided by the
Act1-1 boss it just beat.

| Act1-1 boss | leads to | state |
|---|---|---|
| **The Tallyman** | Act1-A, The Flooded Vault *(the Mushroom Frontier)* | **ON** |
| **The Head Gardener** | Act1-B, **The Thorn Arbor** *(new)* | **ON** |
| **The Matriarch** | Act1-C, **The Pollen Road** *(new)* | **ON** |

### The fallback, if a route misbehaves

In `scripts/misc/honeycomb/honeycomb-tuning.js`, inside `map: { route: { byBossArray: [`, point the
offending row back at `"floodedVault"`:

```
{ bossEncounterIndex: "gardenerGrove", regionIndex: "floodedVault" },   // takes Act1-B out
{ bossEncounterIndex: "matriarchLair", regionIndex: "floodedVault" },   // takes Act1-C out
```

That is the whole change. One line per route, nothing else to touch, and **a run already in progress
survives it** — a run with no route recorded reads as `defaultSecondRegion`.

### The art you are owed — thirteen drawings

Every one of these is `artOwed: true` in `honeycomb-content-enemies.js` with an **ART** note in its
table entry saying what the silhouette has to do. Sources are in
`v13 spire images/_source/enemy inspo variants/assigned/`.

| Source file | Becomes | Route |
|---|---|---|
| `sunflower-b` | **Wellspring** — support | Act1-B |
| `rosebrat-a` | **Briar Brat** — minion | Act1-B |
| `bigbell-b` | **Trumpet Bell** — caster, the non-humanoid | Act1-B |
| `jellyfairy-a` | **Windfall Alraune** — tank | Act1-B |
| `beenoble-b` | **Thorn Fencer** — striker | Act1-B |
| `thickmantis-d` | **The Waking Sister** — boss, the open half | Act1-B |
| `thickmantis-e` | **The Sleeping Sister** — boss, the shut half | Act1-B |
| `butterflyfencer-a` | **Sable Fencer** — soldier | Act1-C |
| `butterflyfencer-c` | **Argent Fencer** — striker | Act1-C |
| `mushroommadame-b` | **Mantlewing** — tank | Act1-C |
| `spookytall-d` | **Longwing** — caster | Act1-C |
| `jellyfairy-b` | **Soakcap** — support | Act1-C |
| `feralbeast-c` | **The Pale Dray** — boss | Act1-C |

Plus the **Glowcap**, whose prompt is already written at
`v13 spire images/_source/enemy inspo variants/assigned/_generate/glowcap-new.txt` — it is a mushroom now, not a moth (Stage 4).

**Two backgrounds are also owed.** Both new regions borrow `map/background-vault` and are tagged
`HC-PLACEHOLDER` in `honeycomb-content-map.js`.

### What landed

| Stage | |
|---|---|
| **1 — the route mechanism** | Done. `tuning.map.route`, `run.routeRegionIndex`, `regionIndexForDepth`, `resolveRouteRegionIndex`, `countedRegionArray`. 48 checks in suite block `[113]`, and `../tools/falsify-routes.js` proves 12 of them go red against the pre-E7 engine. |
| **2 — twelve enemies** | Done. Five normals and a two-body boss for Act1-B; five normals and a boss for Act1-C. 24 encounters, plus four elite encounters neither route had. |
| **3 — the door** | Done. Tallyman moved up to Act1-1 and re-budgeted 250 → 205; table flipped; both routes played in the browser. |
| **4 — Glowcap** | Done. Name and species tag only; index, moves and numbers untouched. |

### Three things worth your eye

1. **A new enemy ROLE exists: `bossHalf`.** A boss that is two bodies had no way to be budgeted. It is
   half of `boss`, so the pair sums to one boss. This is also **the one line E7 put in a file
   `../reference/LANES.md` gives to lane ANA** — the compendium heading table, which must cover every
   role or an enemy lands in "Other". See `INFERENCES.md` I10.
2. **Act1-B is named "The Thorn Arbor" — that name is a guess.** The story bible names the Pollen Road
   and does not name Flora. One field to change. `INFERENCES.md` I11.
3. **The Pale Dray wins 92% of simulated fights** — the softest of the three route bosses, tied with
   the Head Gardener. Every budget column reads ✓, so raising her further would take her out of budget;
   flagged because "overshoot, not undershoot" is your stated direction.

### Measured, not asserted

| | |
|---|---|
| `test-honeycomb.js` | **2081 passed, 0 failed.** E7's block is `[113]`, 48 checks, and `../tools/falsify-routes.js` proves 12 of them go red against the pre-E7 engine |
| `lust-share.js` | **44 of 157 moves = 28.0%**, inside the 25–34% band, up from 25.7%. Venom 15, charm 15 — neither holds half |
| `enemy-template.js` | every new enemy and every new encounter ✓ on health and damage |
| `budget-audit.js` | `--seeds 3`, both routes, **measured against Act1-A as a control**. Every line-up inside its group's health band and its Lust cap; win rates 67–100% on normals, which is the spread Act1-A already has. Both new bosses sit inside the range the shipped ones occupy. |
| `warnings.report()` | **1 active** (Anastasia, deliberate) |

---

**Opened session 42.** Project-wide context is `../BASICS.md`. The queue is `FEEDBACK.md`.

> ⚠ **READ `../designBibles/story.md` AND `../designBibles/mechanics.md` BEFORE DESIGNING ANYTHING
> HERE.** They are not optional context for this folder — they hold which act owns which lust tag,
> the rule that Act 1 line-ups must mix their threats, the tone rules, and how card names are formed.
> Session 44's first pass was built without them and had to be redone. Noodle: *"It seems like almost
> all of it went into the story bible, which I also should have remembered to point you to."*

---

## START HERE — the next session's job

**E7 is done (session 45). Both new routes are built, budgeted and ON.** Read the block at the top of
this file. The build brief moved to `_archive/HANDOFF-E7.md` when it was executed — nothing in it is
outstanding except the two jobs it explicitly deferred, which are now `FEEDBACK.md` **E7-DEFERRED**.

What is open in this folder now, in the order it is worth doing:

1. **`FEEDBACK.md` E9 — the name list.** Still waiting on Noodle's veto, and it now covers 13 more
   names than it did. Cheap, and everything downstream of it is cosmetic.
2. **`FEEDBACK.md` E7's two deferred jobs**, both held back from session 45 on purpose because they
   change the act players have already been playing and neither could be play-tested before release:
   the **Mold Leech** reconceptualised as another growth stage of an existing myconid, and the
   **intruder elite rework** — the Scrap Salvager's partner rebuilt from `demikobold-c` to prey on the
   weak, with `bellhead-a` beside her, moved to Act 2.
3. **Route-native elites.** Act1-B and Act1-C field the Kobold Scavenger on their elite nodes because
   they had no elite pool of their own and an elite node with no pool silently serves an ordinary
   fight. `v13 spire images/_source/enemy inspo variants/assigned/ASSIGNED.md` holds the intended bodies — `feralbeast-b` for the Arbor, `spookytall-a` for
   the Road — and both need drawings.
4. **Two more Act1-C candidates are unbuilt**, and both are additive: `beenoble-a` and
   `tophatfairy-c`. `INFERENCES.md` I12 says why they were left.

Read in this order: the block at the top of this file, then **`FEEDBACK.md`**, then
**`../designBibles/story.md` §4** and **`mechanics.md` §3/§5** before designing anything, then
**`RECAST-01.md`** for the register.

---

## Folder map

Checked against the disk, session 45.

| File | Holds |
|---|---|
| `CATCH-UP.md` | this file — where the work is, and what the next session does first |
| `FEEDBACK.md` | the open queue in Noodle's words: **E5, E7-DEFERRED, E8, E9, E11** |
| `RECAST-01.md` | the session-44 design: E1/E2/E4/E6 recasts and the E3 Lust lift, per enemy |
| `INFERENCES.md` | twelve choices made without him, each with the cost of reversing it |
| `_archive/FEEDBACK-DONE.md` | E1, E2, E3, E4, E6, E10 (session 44) and E7 (session 45), quotes intact |
| `_archive/HANDOFF-E7.md` | the E7 build brief, archived when it was executed |
| `_archive/HANDOFF-E7-s44.md` | its first version, kept because the second lists what changed |
| `_archive/E7-VERIFICATION.md` | what session 45 actually measured, and the three defects only the audit found |

Outside the folder, and worth knowing about: `../tools/lust-share.js` is new this session and is the
instrument E3 is graded on.

## What this folder owns, and what it does not

| This folder | `../rework/enemies/` |
|---|---|
| **Who an enemy is.** Identity, name, fiction, what it does to you, how it reads on screen, how the roster is composed, and which act or route it belongs to. | **What an enemy costs.** Health, damage, role templates, encounter budgets, the numbers `../tools/enemy-template.js` measures. |

The session-34 pass (`../rework/enemies/ENEMIES-01.md`) built the numbers and they measure inside
budget. **This folder exists because the fiction laid over those numbers did not land.** Nothing here
disputes the stat lines; a recast enemy can keep its move list, its role and its budget.

---

## Where it stands

Session 42 recorded the brief, named the sub-acts and generated 108 art variants to design from —
*"Record all that but don't start on the rework"*.

**Session 44 did the recast half**, in two passes — the second after Noodle pointed at the design
bibles the first had not read. Every one of the 24 existing enemies keeps its `index`, slot, act and
encounters; what changed is who they are. The four interchangeable robes became four species with four
silhouettes, the taxonomy five became frontier myconids under arms, the Cordyceps Husk became the
Sporeguard, and the Lust share went **12.9% → 25.7%** with nobody getting harder. **One stat change,
and it is Noodle's**: the Scrap Salvager is an elite now, which rebuilt six encounters around him.
Verified: suite 1887/0, `enemy-template.js` out-of-band count unchanged, content warnings back to the
single deliberate one. Per-enemy detail is `RECAST-01.md`.

**What is left is E7**, which is bigger than everything above put together.

## Act bleed — found session 42, then turned into a rule

Act 1-2's Drowned Salvager is a kobold with a car battery strapped to a spear, which is the story
bible's **Act 2** cargo-cult framework word for word (*"Car Batteries & Wiring… sparking Thunder
Boxes"*), and the Kobold Scavenger elite stands beside it.

Noodle resolved it without moving either: they are **Act 2 intruders**, trespassers met in Act 1, and
their scrap is the tell rather than the mistake. The story bible now carries the exception — a
creature *of* Act 1 never carries Earth junk. See E4.

---

## The Lust shortfall — the headline finding, and what closed it

Lust is the resource the game is built on and the roster barely used it. Measured off the live tables,
session 42, and re-measured by `../tools/lust-share.js` in session 44:

| | Session 42 | After session 44 |
|---|---|---|
| Enemy moves that deal Lust | **14 of 113 — 12%** | **26 of 101 — 25.7%** |
| By tag | Charm 5, Venom 4, Restraint 2, Exposure 2, **Torment 0** | Restraint 8, Venom 7, Charm 6, Exposure 5, **Torment 0** |
| Enemies with no Lust move at all | **13 of 24** | **2, deliberately** — Act1-A's two most-fielded bodies, so the low-lust sub-act keeps no lust identity |
| Cost of one rank-up | **32.5 Lust points of one tag, on one character** (13 exposure ÷ 0.4 per point) | unchanged |
| Cost of a character's whole 3-rank arc | **100 points** of tagged Lust | unchanged |

**The rule that made it affordable — frequency is free, vocabulary is expensive.** Twenty more Venom
moves across the roster cost **zero** authored scenes; one more lust *tag* costs 7 characters × 3 ranks
= **21 scenes**. So the overhaul's lever was how *often* enemies deal Lust, not how many kinds — and
Torment is still deliberately at zero, because whether it survives at all is `../lust_events/` B20's
call.

Two findings that shaped it, both still standing:

- **A lust move with no tag in its `tagArray` teaches the ledger nothing.** Untagged Lust records no
  exposure at all. `lust-share.js` reports these as SILENT; the list is currently empty.
- **`exposureDecayPerGrowth: 0.5`** — growing one tag strips 0.5 off every other. With many tags live,
  Lust spread thin erodes itself; a tight vocabulary per act advances faster than a wide one.

Full arithmetic, including what one run can raise and the sim that would confirm it:
`../lust_events/RATE.md`. Which tags go where: `../lust_events/FEEDBACK.md` B20.

**The next enemies written must not undo this.** Re-run the tool after any enemy content edit:

```
node "!designDocs/honeycomb/tools/lust-share.js"
```

## Elsewhere — read when the work touches it

This folder's own map is at the top of this file. These are the documents outside it that a session
here keeps reaching for:

| File | Holds |
|---|---|
| `../rework/enemies/ENEMIES-01.md` | The session-34 pass being overhauled. **Its numbers stand**, and they own every stat question this folder refuses. |
| `../lust_events/RATE.md` | Why the Lust share is the number that matters, and what it costs to move it. |
| `../designBibles/story.md` | §4 is what each act and sub-act IS. Rebuilt session 42. |
| `../art_pipeline/CATCH-UP.md` | How a recast enemy becomes a drawing. B21 cut the art scope. |
| `../tools/lust-share.js` | The E3 instrument. Run it after any enemy content edit. |

**The inspo experiment (session 42).** `v13 spire images/_source/enemy inspo variants/` holds four
prompt variants of each of 27 source images, each with its own PNG copy so an img2img batch pairs by
filename. The untouched sources stay in `v13 spire images/_source/enemy inspo/`. The four sets:
**A** faithful, **B** silhouette-only plus a hue shift toward a palette the game needs, **C** A lewd,
**D** B lewd. that folder's own variants index says what each one is aimed at and how the 108 land
across the acts — weighted toward **Act1-B (9) and Act1-C (11)**, the two sub-acts with no enemies.
Nothing there is a design decision; it is stock to pour over.

Hand-made enemy references, and the bar the overhaul is measured against:
`v13 spire images/_source/refsPNG/enemies/`. The placeholders owed art are in `enemiesOwed/`.

---

## Rules this pathway must not break

- **RETOOL, DO NOT RELOCATE.** Noodle, session 42:

  > moving out any enemy at this step throws out our enemy count math. To reiterate, idk where I said
  > it, but I want it unlikely that after 3 playthroughs the player has seen every enemy. We hit a
  > decent spot there mechanically, so let's not focus on moving, let's focus on retooling and
  > redesigning.

  **Now a law in the Mechanical Bible**, §3, in his own words: *"A player, after 3 playthroughs
  through the game, should not have discovered anywhere near 90% of the game's enemies."* It was in
  no document at all before session 42. An enemy keeps its slot, its act and its route. The overhaul changes who it *is*, not
  where it lives. Cutting one, moving one between acts, or merging two all fail this rule, and every
  one of them was on the table before he restated it.

  The roster it protects: **24 enemies with move lists** — 13 in Act 1-1, 5 in Act 1-2, 2 elites,
  4 bosses. `../tools/encounter-coverage.js` is the instrument if the "unseen after 3 runs" property
  ever needs measuring rather than assuming.

- **Numbers are not in scope.** Recasting an enemy keeps its role, its budget and its move list unless
  `../rework/enemies/` agrees otherwise. A fiction change that needs a stat change is a request to
  that folder, not a decision here.
- **Silhouette is the art currency.** Img2img reads colour and silhouette first, so two enemies that
  differ only by a held prop are one enemy as far as the pipeline is concerned.
- **Every enemy answers where it came from.** An enemy that cannot is a bestiary entry.
- **Frequency is free, vocabulary is expensive.** More Lust *moves* cost no scenes. More Lust *tags*
  cost 21 scenes each. See `../lust_events/RATE.md`.
