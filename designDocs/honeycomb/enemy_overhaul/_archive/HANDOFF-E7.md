# HANDOFF — E7: build Act1-B and Act1-C, and the routes that reach them

**Written session 44, revised the same night, for the session that runs overnight. Noodle is asleep; he
cannot be asked.** Everything you need to decide has been decided below. Where it has not, the doc says
so and tells you what to assume. The first version is kept whole at `_archive/HANDOFF-E7-s44.md`; what
changed is listed at the end.

**You are session 45, lane `E7`. The game releases tomorrow evening.** That changes what "done" means:
an enemy no player can reach is worth nothing tomorrow, and a run that breaks is worth less than
nothing. So the order below is *safe mechanism first, content second, switch it on last* — and the
switch is one table row Noodle can flip back.

---

## Read these, in this order, and nothing else

1. `../BASICS.md` — project rules. Non-negotiable: no magic numbers, comments never say "I/you/we",
   adding content is a table entry only.
2. **`../reference/LANES.md` — another agent (lane `ANA`, building Anastasia) is in this repo all
   night.** Banners, index prefixes, who owns which file, and the route contract it depends on you for.
   Not optional.
3. `../designBibles/story.md` — **§3 tone, §4 the acts and sub-acts, §8 writing rules.**
4. `../designBibles/mechanics.md` — **§3 encounter laws, §5 Act 1.**
5. `RECAST-01.md` — what session 44 did to the existing 24, and the **register** the new twelve must
   match. Read it for voice, not for decisions.
6. This file.

**Do not read** the other workstreams' feedback, `Archive/`, or `../reference/TRAPS.md` end to end (grep
it if something surprises you).

Then, before changing anything:

```
node "!designDocs/honeycomb/tools/test-honeycomb.js"
```

Baseline, measured at the time of writing, is **1923 passed, 0 failed**. The count will drift all night
as lane `ANA` adds checks; the contract is **0 failed** (`../reference/LANES.md` §5). A red suite means someone was
mid-edit — read which block the failures sit under before assuming they are yours.

⚠ **The session-44 version of this file said "stay in `honeycomb-content-enemies.js` and you will not
collide". That is no longer true.** Anastasia's twelve golems are `enemyArray` entries at the head of
that same file, and lane `ANA` is rewriting all of them tonight. `../reference/LANES.md` §3 says exactly which parts
of the file are yours.

---

## The job, in one line

**Act1-B (Flora) and Act1-C (the Pollen Road) have no enemies and no way in. Build the way in, then
5 normals and 1 boss each, then open the door.**

---

## What is already decided — do not re-litigate these

| | |
|---|---|
| **The art is picked.** | All of it sits FLAT in `v13 spire images/_source/enemy inspo variants/assigned/` — 27 matched png/txt pairs, no subfolders, because Noodle batch-processes the whole folder at once. **The folder no longer records which image is which: the `v13 spire images/_source/enemy inspo variants/assigned/ASSIGNED.md` index is the only lookup**, and it names the route and the enemy for every file. **Design the enemy to match the picture**, not the other way round — session 44's first pass did it backwards and had to be redone. |
| **Act1-B is the Venom hotspot.** | Story bible §4: *"Mechanically would be the hotspot for venom and poison."* |
| **Act1-C is the Charm hotspot.** | *"Mechanically, the most focused on whatever the alternate act 1 lust is. Probably charm."* |
| **No new lust tags.** | Venom and Charm both already exist, so the twelve cost **zero** authored lust scenes. Torment stays at zero. |
| **Act1-B's boss is a DUO** | `thickmantis-d` and `thickmantis-e` — day and night sisters, one encounter, two bodies. Noodle: *"they make a perfect pair… if they were a boss they'd probably be the most popular boss in the game."* The Juggernaut's *"little buddy pal friend"* is the precedent for a two-body boss. |
| **Act1-C's boss is `feralbeast-c`** | The chained moth-beast with the fey riding it. It is one enemy, not two — the fey is part of the drawing. |
| **The Pollen Road guardrail** | Story bible §4: no gold, no halos, no hexagons, nothing symmetrical. It must read as the *disorderly* rhyme of Act 3, never as a preview of it. |
| **The boss you fight decides the route.** | Noodle: *"What if we just connected the boss to the area you were about to fight? That'd keep the connection."* Stage 1. |

---

## Stage 1 — the route mechanism, switched OFF *(do this first)*

This was Stage 3 and optional. It is first now, for three reasons: without it the twelve enemies cannot
be met by anyone; it is the only part of the job that can break a run, so it gets the freshest hours and
the longest soak under the suite; and lane `ANA`'s gauntlet hangs off it. **It lands in a state where
nothing a player can see has changed.** Stage 3 is what turns it on.

**What is true today:** `honeycomb.regionArray` is a linear sequence. `honeycomb.map.generateRegion()`
with no argument picks `regionArray[min(run.regionsCleared, length - 1)]`
(`honeycomb-map.js`, "Generation"), and the `regionCleared` overlay in `honeycomb-overlays-map.js`
decides a run is won with `cleared + 1 < honeycomb.regionArray.length`. **Adding regions to that array
without changing anything else makes a run four regions long and moves the win condition.**

**The contract is `../reference/LANES.md` §6 — build exactly that shape**, because lane `ANA` is coding against it
without being able to ask you. In summary:

1. **`tuning.map.route`**, inside `map:` in `honeycomb-tuning.js`: `regionsPerRun`,
   `defaultSecondRegion`, `byBossArray`, `overrideArray`. **Tonight's Stage 1 value of `byBossArray`
   points all three bosses at `"floodedVault"`.** That is the OFF state, and it is also the release
   fallback.
2. **`run.routeRegionIndex`**, a region index STRING, written once in `honeycomb.descendRegion` when the
   run leaves region 0. Resolution: the first `overrideArray` row whose relic the run holds → the
   `byBossArray` row for the boss this run's first map rolled → `defaultSecondRegion`. The boss is
   already known: `rollBossEncounter` runs when the map is generated, *"so the boss node's preview
   names the fight and a reload keeps it"* — read it off the run's first map, do not re-roll it.
3. **`generateRegion()`** with no argument: depth 0 is position 0 as now; depth 1 and beyond prefers
   `run.routeRegionIndex`, and **a run with none recorded — every save written before tonight — gets
   `defaultSecondRegion`.** Nothing may read `regionArray[1]` by position to mean "the second act" any
   more.
4. **The win condition** reads `tuning.map.route.regionsPerRun`, not `regionArray.length`.
5. **`honeycomb.map.countedRegionArray()`** — position 0, `defaultSecondRegion`, and every region a
   `byBossArray` row points to, de-duplicated. **A region only an `overrideArray` row points to is
   secret and is never in it.** Every place that counts or lists regions for the player asks this
   instead of `honeycomb.regionArray` — start with the `region` discovery kind in
   `honeycomb-progression.js` (`allIndexArray`). With the table in its OFF state this returns exactly
   today's two regions, so a fallback release shows no "2 of 4".
6. **Add `flora` and `pollenRoad` to `regionArray` NOW, at positions 2 and 3**, not in Stage 3.
   `regionIndexArray` on an encounter holds POSITIONS, lane `ANA` needs position 4, and the order is
   fixed in `../reference/LANES.md` §4. No `layoutIndex` (they fall through to the procedural default — the anchored
   layout needs a painting that does not exist), `rowCount: 11` to match Act1-A, the existing
   placeholder background and two colours each. **Until Stage 2 writes their bosses, point each one's
   boss pool at `"juggernautHollow"`** so the suite's cross-reference check resolves, and mark the line
   `//HC-PLACEHOLDER: Stage 1 stub, replaced in Stage 3`. They are unreachable while the table is OFF.

### Three suite checks pin the old shape — they are yours to update

Near line 7352 of `../tools/test-honeycomb.js`: *"a run has two floors naming two different bosses"*
asserts `hc.regionArray.length === 2`. It becomes `tuning.map.route.regionsPerRun === 2` plus the
boss-difference check. The two lines under it (the first floor ends at the Matriarch, the second at the
Juggernaut) read `bossEncounterIndex`, which does not change. Around line 1494 a block pushes a test
region onto `regionArray`; read it and make sure it still means what it says.

### Falsify Stage 1 before moving on

In your block `[113]`: an old-shaped run (no `routeRegionIndex`, `regionsCleared: 1`) generates
`floodedVault`; a run whose first boss was `gardenerGrove` records whatever the table says for it; an
`overrideArray` row outranks the boss; a run is won after exactly `regionsPerRun` regions with four
regions in the array; `countedRegionArray()` in the OFF state is exactly
`["upperCatacombs", "floodedVault"]`. Then a full suite, 0 failed. **Only then Stage 2.**

---

## Stage 2 — the twelve enemies and their encounters

All of it lands in `scripts/misc/honeycomb/honeycomb-content-enemies.js`, **inside your banners**
(`../reference/LANES.md` §1, §3): cards in `honeycomb.enemyCardArray`, enemies in `honeycomb.enemyArray` after the
REGION 2 section, encounters in `honeycomb.encounterArray` after `REGION 2, late`. Follow the shape of
the existing entries exactly; the file's header comment documents every field.

**Work one route at a time: all of Flora — six enemies and their encounters, green — before any of the
Pollen Road.** A night that ends early then leaves one whole route Noodle can ship rather than two
halves he cannot.

### Numbers — copy these, do not invent them

B and C sit at the **same depth as Act1-A**, so they use Act1-A's targets. From
`tuning.balance.enemyRoleArray` against region index 1:

| Role | Health | Expected damage + Lust per turn |
|---|---|---|
| minion | 39 | 6.7 |
| striker | 46 | 11 |
| soldier | 67 | 9.4 |
| tank | 85 | 6.7 |
| support | 49 | 4.9 |
| caster | 55 | 8 |
| elite | 195 *(as a line-up, elite + one body)* | 32.7 |
| boss | 285 *(line-up)* | 22.1 |

Encounter group targets: **early 122 HP / 26.8 dmg, middle 135 / 28.6, late 135 / 28.6.**

`healthVariance` runs 2–3 on small bodies, 4–6 on large. `goldReward` matches the same role elsewhere
in the table.

### Composition — 5 normals per route

Do not field five humanoids. `../designBibles/mechanics.md` §5 wants Act 1 line-ups that **mix**
damage, Lust and poison, and E1's whole complaint was interchangeable silhouettes. Aim for a spread of
roles, and let at least one be non-humanoid — `bigbell-b` (Flora) and the moth-beast (Pollen Road) are
there for exactly that.

### The Lust rule you are graded on

```
node "!designDocs/honeycomb/tools/lust-share.js"
```

Run it first and write down what it says — the session-44 text quoted **26 of 101 moves, 25.7%**, and
lane `ANA` is rewriting twelve enemy entries tonight, so the denominator may move under you. The target
band is **25–34%**. The twelve must not drag it under. Two hard constraints, both enforced by the suite:

- **Every Lust move carries a lust tag** in its `tagArray`, or it teaches the between-run ledger
  nothing. B's are `venom`, C's are `charm`.
- **No single tag may hold more than half the roster's lust moves.** Venom is at 7 and charm at 6 of
  26, so B and C have room — but count as you go rather than at the end.

Two enemies deliberately teach nothing (`siltCrawler`, `bogToad`) and the suite pins that at exactly
two. **Do not add a third.**

### Threat neutrality does not apply here

That rule was for recasting existing enemies. These are new, so write them to the role template and
let `enemy-template.js` judge them.

### Encounters

Each route wants roughly **4 early, 4 middle, 4 late** normals plus its boss, same as Act1-A.

⚠ **`regionIndexArray` holds POSITIONS in `honeycomb.regionArray`, not region `index` strings.**
`honeycomb-map.js` builds it with `honeycomb.regionArray.indexOf(region)`. Act1-1 is `[0]`, Act1-A is
`[1]`, **Flora is `[2]` and the Pollen Road is `[3]`** — Stage 1 already put them there.

Two line-ups Noodle asked for by name:

- **The thorn fencers fight as a pair.** `butterflyfencer-b` and `-d` share a pose, and fielding them
  together turns that from a repeat into a matched duo. One encounter with both.
- **The Flora boss is the two thickmantis sisters together.** Give the encounter a
  `victoryConditionArray` only if beating one should end it; otherwise both must fall.

Then:

```
node "!designDocs/honeycomb/tools/enemy-template.js"
node "!designDocs/honeycomb/tools/budget-audit.js" --seeds 1 --region 2
node "!designDocs/honeycomb/tools/budget-audit.js" --seeds 1 --region 3
```

Every new encounter should read ✓ on health, and its **lust/turn must stay inside the cap** —
`tuning.balance.lustToDamageRatioMaximum` is 0.6, and a Charm-heavy route is the most likely thing in
the game to break it. Check that column specifically.

---

## Stage 3 — open the door *(only when Stages 1–2 are finished and green)*

1. **Replace the two stub boss pools** with the real bosses Stage 2 wrote, and delete the
   `HC-PLACEHOLDER` lines.
2. **Move the Tallyman.** Noodle's pairing, one boss to one route:

   | Act1-1 boss | leads to |
   |---|---|
   | **The Tallyman** | **Act1-A**, the Mushroom Frontier — he is the clerk selling the frontier its armour |
   | **The Head Gardener** | **Act1-B**, Flora |
   | **The Matriarch** | **Act1-C**, the Pollen Road |

   ⚠ **`tallyLedger` moves from `floodedVault`'s boss pool to `upperCatacombs`'s.** That is a
   relocation, which this folder's own law forbids — **Noodle authorised it this session**, so do it and
   note it. Act1-A is then left with the Juggernaut alone, which is what the story bible always said it
   had.

   ⚠ **And he must be re-budgeted, which the first version of this file missed.** He was written as a
   SECOND-region boss: `baseHealth: 250`, against the Matriarch's `205`. Moved as he stands, one run in
   three opens on a first boss a fifth tougher than the other two, in the act where new players learn the
   game. Bring his health and his expected damage to the first region's boss row, using
   `enemy-template.js` as the judge, **by scaling numbers only** — his moves, their order and his
   identity do not change. Log it in `INFERENCES.md` with the cost of reversing it (one stat line).
3. **Flip the table.** `byBossArray` takes the values in `../reference/LANES.md` §6: `gardenerGrove` → `flora`,
   `matriarchLair` → `pollenRoad`, `tallyLedger` → `floodedVault`. **If only Flora is finished, flip only
   Flora's row** and leave the Matriarch pointing at `floodedVault`.
4. Re-run everything in the verification table, plus `encounter-coverage.js`.

This also does `map/` B31's job of making the route choice informed: the boss *is* the tooltip.

**The fallback Noodle has in the morning**, and the reason the mechanism is a table: any row pointed
back at `"floodedVault"` takes that route out of the release with one line and no other change. Write
that sentence, with the exact line, at the top of this folder's `CATCH-UP.md`.

If you cannot finish Stage 3, **leave the table OFF and say so.** The enemies still exist, are budgeted,
and can be fought with `honeycomb.combat.begin("<encounter>")`.

---

## Stage 4 — one small job

**Glowcap Moth becomes a mushroom.** Noodle: *"change glowcap moth to a mushroom."* It is a moth
stranded in the mushroom act, and the moth art all belongs to Act1-C now. Change its `name` and
`tagArray` (`beast` → `plant`); its moves, numbers and `index` do not change. A prompt for its new
drawing is already written at
`v13 spire images/_source/enemy inspo variants/assigned/_generate/glowcap-new.txt`.

### Deferred past the release — do NOT do these tonight

Both change the one act players have already been playing, the night before it ships, and neither can
be play-tested before it does. They stay open in `FEEDBACK.md` with Noodle's words intact.

- **Mold Leech reconceptualised.** Noodle: *"cut or reconceptualize mold leech."* The plan stands for a
  later session: reconceptualise rather than cut — cutting costs a body against the Variety law and it
  is a striker, a role Act1-1 is thin on — as **another growth stage of an existing myconid**, so
  sharing a silhouette is a species fact instead of a shortcut and no new art is needed.
- **The intruder elite rework.** Noodle, on the Scrap Salvager's partner:
  > Demikobold as an act invader should probably be redesigned as someone who preys on the weak,
  > would help to diversify her from the other scrap collector, the fire doesn't really sell me on
  > "salvage". If you're using her, I'd recommend a rework to that whole elite encounter, and also
  > including bellhead-a.

  The plan stands: the Scrap Salvager's elite encounters become a **pair of Act 2 intruders** — the
  Salvager plus a new elite built from `demikobold-c`, redesigned to **prey on the weak** (punishing
  low-health or isolated party members) rather than to collect scrap, with `bellhead-a` as her partner
  image. **Drop the fire** — it says arsonist, not salvager. A new elite with a new targeting mechanic
  is exactly the thing that needs play before it ships.

---

## Rules you must not break

- **RETOOL, DON'T RELOCATE.** No existing enemy changes act, role or `index`. The Tallyman is the one
  authorised exception, above.
- **Indices are save data.** A telegraphed move and a mid-combat save store card and enemy `index`
  strings. New content gets new indices; nothing existing gets renamed. **And a run in progress is save
  data too**: Stage 1's default for a missing `routeRegionIndex` is what keeps tonight's players' saves
  alive tomorrow.
- **Index prefixes are split between the lanes** (`../reference/LANES.md` §2). `anastasia`, `celestial`, `infernal`,
  `gauntlet` and `chess` are not yours.
- **Tone, in full.** No death, no gore, nothing rots, nothing is a corpse. Horror only as fridge
  horror. **Never state the mechanism** — no brainwashing, hypnosis, mind control, or anyone being
  made to do anything. The innocent reading stays available.
- **Card names come from biological, structural or mechanical ideas**, never from what the card does
  to a health bar (§8). "Spore Sack", not "Poison Strike". A name that fails the card-fit audit is
  **renamed, not refit.**
- **No magic numbers.** Every number is a named field on a table entry or lives in
  `honeycomb-tuning.js`.
- **Comments never say "I", "you" or "we".** State what needs understanding and name the item that
  caused the change.

---

## Verification — the workflow is not complete without it

Noodle's standard, and he means it:

> Testing is part of the workflow; the workflow is not complete without testing.

| Run | Expect |
|---|---|
| `../tools/test-honeycomb.js` | **0 failed**, and every check in your block `[113]` present |
| `../tools/lust-share.js` | share inside 25–34%, SILENT list still exactly `siltCrawler, bogToad`, no tag over half |
| `../tools/enemy-template.js` | every new enemy and encounter ✓, **and the re-budgeted Tallyman ✓ against the first region** |
| `../tools/budget-audit.js --seeds 1` | new encounters inside their group, **lust/turn inside the cap** |
| `../tools/encounter-coverage.js` | the new enemies are reachable *(after Stage 3)* |
| `../tools/feedback-audit.js` and `../tools/doc-links.js` | both exit 0 before you finish |
| `honeycomb.warnings.report()` | **1 active** (Anastasia, deliberate). Any more is yours — unless it names her. |

**Your block is `[113]`, inserted directly ABOVE the line `console.log("\n[112] …`** in
`../tools/test-honeycomb.js`, inside lane banners. `[112]` is already lane `ANA`'s and the end of the
file is where it appends, so the two lanes never insert at the same place (`../reference/LANES.md` §3). Session 44's
block `[111]` is the model — and prove your checks can fail before recording that they pass. A scratch
harness that mutates the loaded tables in memory and re-runs the block is the cheapest way; `[111]` was
verified against eleven kinds of damaged roster that way.

**One real playthrough of each opened route**, in the browser, from a fresh run to the second boss.
`devPreviewTarget = "honeycombFresh"` in `scripts/index.js`, **set back to `""` in the same sitting** —
lane `ANA` uses it too and may reset it under you.

---

## Documentation, as you go and not at the end

- **The first lines of this folder's `CATCH-UP.md` are what Noodle reads in the morning**, in this
  order: which routes are ON; the one-line fallback for each; what was not finished; the art he owes
  (the list below, by file).
- Annotate `FEEDBACK.md` **the moment each piece lands**, not in a batch. A session can be stopped at
  any point and the next one starts from that file.
- When E7 closes, move it to `_archive/FEEDBACK-DONE.md` quote-and-all, and **bump the row in
  `../FEEDBACK.md`** — your row only. That count is how the next session detects one that ended early.
- Add **one line** to the `../CATCH-UP.md` "Recent sessions" table, as **session 45**. Do not grow the
  root file.
- New guesses go in `INFERENCES.md` with the cost of reversing each one.

---

## What is NOT yours

| | Whose |
|---|---|
| The names of the recast 24 | Noodle's. `FEEDBACK.md` **E9** is the veto list. Leave it alone. |
| Region 1 still being called "The Flooded Vault" | `map/` B31. Noodle already chose **Myconid Navel**. Do not rename it tonight: `"floodedVault"` is an index in the route table and in saves. |
| Generating any art | Noodle is doing it in the morning: **the twelve new enemies and the new Glowcap, thirteen drawings.** Reference the intended source in a comment and leave `artOwed: true`. **Write nothing into `v13 spire images/`.** |
| The chess pieces, the gauntlet, anything with an `ANA` banner | Lane `ANA`. The pieces' art is already done. |
| `tuning.map.route.overrideArray` | The array is yours to create, **empty**. Its one row is lane `ANA`'s. |

---

## What changed from the first version

| | First version | Now |
|---|---|---|
| Making the routes reachable | Stage 3, optional, last | **Stage 1, first, landed OFF**; Stage 3 only flips a table |
| The release fallback | none | one `byBossArray` row per route |
| Saves from before tonight | not mentioned | default to `floodedVault` |
| The Tallyman | relocated as he stands | relocated **and re-budgeted** — 250 HP against the first region's 205 |
| The two new regions | added in Stage 3 | **added in Stage 1 as stubs**, to fix positions 2 and 3 for both lanes |
| Counting regions | not mentioned | `countedRegionArray()`, so neither an OFF route nor the secret gauntlet shows in a total |
| Stage 4 | three jobs | **Glowcap only**; the Mold Leech and the intruder elite deferred past the release |
| "Stay in the enemies file and you will not collide" | true | **false** — see `../reference/LANES.md` |
| The suite block | `[112]` | **`[113]`**, above `[112]`, which was already taken |
| Baseline | 1887 | **1923**, measured |
