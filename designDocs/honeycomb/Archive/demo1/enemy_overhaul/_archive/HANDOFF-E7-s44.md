# HANDOFF — E7: build Act1-B and Act1-C

**Written session 44, for the session that runs overnight. Noodle is asleep; he cannot be asked.**
Everything you need to decide has been decided below. Where it has not, the doc says so and tells you
what to assume.

---

## Read these, in this order, and nothing else

1. `../BASICS.md` — project rules. Non-negotiable: no magic numbers, comments never say "I/you/we",
   adding content is a table entry only.
2. `../designBibles/story.md` — **§3 tone, §4 the acts and sub-acts, §8 writing rules.**
3. `../designBibles/mechanics.md` — **§3 encounter laws, §5 Act 1.**
4. `RECAST-01.md` — what session 44 did to the existing 24, and the **register** the new twelve must
   match. Read it for voice, not for decisions.
5. This file.

**Do not read** the other workstreams' feedback, `Archive/`, or `../reference/TRAPS.md` end to end (grep
it if something surprises you).

Then, before changing anything:

```
node "!designDocs/honeycomb/tools/test-honeycomb.js"
```

Baseline is **1887 passed, 0 failed**. A red suite means someone else was mid-edit — read the failures
before starting.

⚠ **Another agent works in this repo at the same time.** Session 44 watched it edit
`honeycomb-scene-combat.js`, `honeycomb-entities.js` and the suite live, and reset `devPreviewTarget`.
Stay in `honeycomb-content-enemies.js` and you will not collide with it.

---

## The job, in one line

**Act1-B (Flora) and Act1-C (the Pollen Road) have no enemies. Build them: 5 normals and 1 boss each.**

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

---

## Stage 1 — the twelve enemies *(do this first; it is the whole deliverable if you run out of time)*

All of it lands in `scripts/misc/honeycomb/honeycomb-content-enemies.js`: cards in
`honeycomb.enemyCardArray`, enemies in `honeycomb.enemyArray`. Follow the shape of the existing
entries exactly; the file's header comment documents every field.

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

Baseline is **26 of 101 moves, 25.7%**, and the target band is **25–34%**. The twelve must not drag it
under. Two hard constraints, both enforced by the suite:

- **Every Lust move carries a lust tag** in its `tagArray`, or it teaches the between-run ledger
  nothing. B's are `venom`, C's are `charm`.
- **No single tag may hold more than half the roster's lust moves.** Venom is at 7 and charm at 6 of
  26, so B and C have room — but count as you go rather than at the end.

Two enemies deliberately teach nothing (`siltCrawler`, `bogToad`) and the suite pins that at exactly
two. **Do not add a third.**

### Threat neutrality does not apply here

That rule was for recasting existing enemies. These are new, so write them to the role template and
let `enemy-template.js` judge them.

---

## Stage 2 — encounters

Add to `honeycomb.encounterArray`, following the existing rows. Each route wants roughly **4 early,
4 middle, 4 late** normals plus its boss, same as Act1-A.

⚠ **`regionIndexArray` holds POSITIONS in `honeycomb.regionArray`, not region `index` strings.**
`honeycomb-map.js` builds it with `honeycomb.regionArray.indexOf(region)`. Act1-1 is `[0]` and Act1-A
is `[1]`; the new regions will be `[2]` and `[3]` once Stage 3 adds them.

Two line-ups Noodle asked for by name:

- **The thorn fencers fight as a pair.** `butterflyfencer-b` and `-d` share a pose, and fielding them
  together turns that from a repeat into a matched duo. One encounter with both.
- **The Flora boss is the two thickmantis sisters together.** Give the encounter a
  `victoryConditionArray` only if beating one should end it; otherwise both must fall.

Then:

```
node "!designDocs/honeycomb/tools/enemy-template.js"
node "!designDocs/honeycomb/tools/budget-audit.js" --seeds 1 --region 2
```

Every new encounter should read ✓ on health, and its **lust/turn must stay inside the cap** —
`tuning.balance.lustToDamageRatioMaximum` is 0.6, and a Charm-heavy route is the most likely thing in
the game to break it. Check that column specifically.

---

## Stage 3 — making them reachable *(engine; only if Stages 1–2 are finished and green)*

This is the part that needs care, and it is why Stage 1 comes first.

**What is true today:** `honeycomb.regionArray` is a linear sequence. `honeycomb.map.generateRegion()`
with no argument picks `regionArray[min(run.regionsCleared, length - 1)]`, and a run wins on the last
region. **Adding two regions to that array without changing anything else would make a run four
regions long and move the win condition.** Do not just append and hope.

It already takes an explicit index — `generateRegion(regionIndex)` — so the change is contained:

1. Add `flora` and `pollenRoad` to `regionArray` at positions 2 and 3, with their own boss pools.
2. When a run clears Act1-1, **record which second region it is entering** on `run`, and have
   `generateRegion()` prefer that recorded choice over the depth lookup.
3. Make the win condition "two regions cleared", from `tuning`, not `regionArray.length`.

**Noodle's chosen rule for step 2 — the boss you fight decides the route:**

> What if we just connected the boss to the area you were about to fight? That'd keep the connection.

Act1-1 has three bosses and there are three routes, so they pair one to one:

| Act1-1 boss | leads to |
|---|---|
| **The Tallyman** | **Act1-A**, the Mushroom Frontier — he is the clerk selling the frontier its armour |
| **The Head Gardener** | **Act1-B**, Flora |
| **The Matriarch** | **Act1-C**, the Pollen Road |

This also does `map/` B31's job of making the route choice informed: the boss *is* the tooltip.

⚠ **The Tallyman must move from Act1-A's boss pool to Act1-1's.** That is a relocation, which this
folder's own law forbids — **Noodle authorised it this session**, so do it and note it. Act1-A is then
left with the Juggernaut alone, which is what the story bible always said it had.

If you cannot finish Stage 3, **leave the map untouched and say so**. Stage 1 and 2 still stand: the
enemies exist, are budgeted, and can be fought with `honeycomb.combat.begin("<encounter>")`.

---

## Stage 4 — three small jobs, in this order

1. **Glowcap Moth becomes a mushroom.** Noodle: *"change glowcap moth to a mushroom."* It is a moth
   stranded in the mushroom act, and the moth art all belongs to Act1-C now. Change its `name` and
   `tagArray` (`beast` → `plant`); its moves and numbers do not change. A prompt for its new drawing
   is already written at `v13 spire images/_source/enemy inspo variants/assigned/_generate/glowcap-new.txt`.
2. **Mold Leech gets reconceptualised, not cut.** Noodle: *"cut or reconceptualize mold leech."*
   Reconceptualise — cutting costs a body against the Variety law and it is a striker, a role Act1-1
   is thin on. Cheapest honest version: make it **another growth stage of an existing myconid** rather
   than its own creature, so sharing a silhouette is a species fact instead of a shortcut. It then
   needs no new art at all.
3. **The intruder elite rework.** Noodle, on the Scrap Salvager's partner:
   > Demikobold as an act invader should probably be redesigned as someone who preys on the weak,
   > would help to diversify her from the other scrap collector, the fire doesn't really sell me on
   > "salvage". If you're using her, I'd recommend a rework to that whole elite encounter, and also
   > including bellhead-a.

   So: the Scrap Salvager's elite encounters become a **pair of Act 2 intruders** — the Salvager plus
   a new elite built from `demikobold-c`, redesigned to **prey on the weak**
   (punishing low-health or isolated party members) rather than to collect scrap. `bellhead-a` is her
   partner image; both are in the flat `assigned/` folder, listed under Act1-A in that folder's index. That gives the pair a mechanical identity the Kobold Scavenger has not got, instead
   of a second bruiser. **Drop the fire** — it says arsonist, not salvager.

---

## Rules you must not break

- **RETOOL, DON'T RELOCATE.** No existing enemy changes act, role or `index`. The Tallyman is the one
  authorised exception, above.
- **Indices are save data.** A telegraphed move and a mid-combat save store card and enemy `index`
  strings. New content gets new indices; nothing existing gets renamed.
- **Tone, in full.** No death, no gore, nothing rots, nothing is a corpse. Horror only as fridge
  horror. **Never state the mechanism** — no brainwashing, hypnosis, mind control, or anyone being
  made to do anything. The innocent reading stays available.
- **Card names come from biological, structural or mechanical ideas**, never from what the card does
  to a health bar (§8). "Spore Sack", not "Poison Strike".
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
| `../tools/test-honeycomb.js` | 1887 + your new checks, **0 failed** |
| `../tools/lust-share.js` | share inside 25–34%, SILENT list still exactly `siltCrawler, bogToad`, no tag over half |
| `../tools/enemy-template.js` | every new enemy and encounter ✓ |
| `../tools/budget-audit.js --seeds 1` | new encounters inside their group, **lust/turn inside the cap** |
| `../tools/encounter-coverage.js` | the new enemies are reachable *(Stage 3 only)* |
| `../tools/feedback-audit.js` and `../tools/doc-links.js` | both exit 0 before you finish |
| `honeycomb.warnings.report()` | **1 active** (Anastasia, deliberate). Any more is yours. |

**Add a numbered block `[112]` at the end of `../tools/test-honeycomb.js`** asserting what you built.
Session 44's block `[111]` is the model — and prove your checks can fail before recording that they
pass. A scratch harness that mutates the loaded tables in memory and re-runs the block is the cheapest
way; `[111]` was verified against eleven kinds of damaged roster that way.

---

## Documentation, as you go and not at the end

- Annotate `FEEDBACK.md` **the moment each piece lands**, not in a batch. A session can be stopped at
  any point and the next one starts from that file.
- When E7 closes, move it to `_archive/FEEDBACK-DONE.md` quote-and-all, and **bump the row in
  `../FEEDBACK.md`** — that count is how the next session detects a session that ended early.
- Write the detail into this folder's `CATCH-UP.md`; add **one line** to the root `CATCH-UP.md`
  "Recent sessions" table. Do not grow the root file.
- New guesses go in `INFERENCES.md` with the cost of reversing each one.

---

## What is NOT yours

| | Whose |
|---|---|
| The names of the recast 24 | Noodle's. `FEEDBACK.md` **E9** is the veto list. Leave it alone. |
| Region 1 still being called "The Flooded Vault" | `map/` B31. Noodle already chose **Myconid Navel**. |
| Generating any art | Noodle is doing it in the morning. Reference the intended source in a comment and leave `artOwed: true`. **Write nothing into `v13 spire images/`.** |
| The Infernal chess pieces | Already in his pipeline. Not copypaste, not your problem. |
