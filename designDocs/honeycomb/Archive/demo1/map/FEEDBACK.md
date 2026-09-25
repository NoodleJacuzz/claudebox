# Map and acts — FEEDBACK

Map generation, act structure and node content. Both acts are LIVE, the three boss nodes branch into the three routes, and region 1 is the Mushroom Frontier (all session 55, archived). What is left is paint, one debug tool, and the rest site. Map EVENTS have their own folder, `../map_events/`.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins. Items were split out of the round-09 file in session 41 and moved
byte for byte — nothing was rewritten on the way.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `../CATCH-UP.md`. What the project is: `../BASICS.md`.

---

### B30. Camp image should reflect party composition ◐ — the leader half built session 58b

> Need to implement system to pick camp image based on party comp and other requirements

A selection system, not an art job: the camp image resolves from party composition plus other
conditions. The requirements beyond party comp are not specified — ask before building, or build the
resolver so conditions are table entries and the set can grow without engine work, per the standing
modularity rule.

**Session 58b, part of this:** the campfire picture now follows the character at the front of the
party, one picture per character (see B42 in `_archive/FEEDBACK-DONE.md` for the files). That covers the leader only. A
picture that depends on the whole party, or on anything else, is still open, and the requirements
beyond party composition are still unasked.

---

### B31. Region 1 is still painted for water ◐ — FROM `enemy_overhaul/`; the routes and the name landed, the paint remains

**Where it stands 2026-09-25.** Items 2 and 3 below closed in sessions 45 and 55: three routes, each
with its own boss pool, chosen by the Act1-1 boss the run beat (P28, archived). Item 1's NAME closed in
session 55 (P9, archived: the Mushroom Frontier, his word on the day; Myconid Navel is kept for a later
area). **What remains is the paint:** `colorNear` / `colorFar` are still cold blues and the
`vaultCauseway` backdrop's anchors are still piers. Noodle should pick the colours himself; the backdrop
is an art job for `../art_pipeline/`. The text below is kept as the record of the item.

Session 42 settled Act 1's structure (`../designBibles/story.md` §4) and it lands on this folder:

| Term | Means |
|---|---|
| **Act1-1** | The base mushroom biome. Splits into the sub-acts. |
| **Act1-2** | Catch-all for whichever sub-act follows. A term, not a place. |
| **Act1-A** | The Mushroom Frontier. **Live** — this is region index 1 today. |
| **Act1-B** | Flora. Empty. |
| **Act1-C** | The Pollen Road. Empty. |

Noodle: *"the demo ships with act 1-1 and act1-2, so all three routes are in scope."*

Three things owed here:

1. **Region 1 is named and painted for water it no longer has.** `honeycomb.regionArray` calls it
   *"The Flooded Vault"*, described as *"Deeper, colder, and something down here is still counting"*,
   with `colorNear: "#1b2f3a"` / `colorFar: "#0e1720"` and a `vaultCauseway` backdrop whose anchors are
   `northPier` and `southSteps`. The Mushroom Frontier is timber and amber, not piers.
2. **One region slot has to become three selectable sub-acts.** This is `enemy_overhaul/` E5's
   structural half: *"The code separates them into 'regions' but this is a mistake."* The pieces are
   already there — `bossEncounterIndexArray` rolls per run from a pool, and `regionIndexArray` filters
   encounters — so this is closer to a renaming plus a selection step than a rebuild.
3. **Each sub-act needs its own boss pool.** Act1-A has one (Juggernaut, Tallyman). B and C have none.

Blocked on nothing here; `enemy_overhaul/` owns who lives in B and C, this folder owns how a run
reaches them.

**SESSION 44 raised item 1 from cosmetic to contradictory.** `enemy_overhaul/` recast Region 1's five
enemies as dry frontier myconids under arms (Silt Crawler → Shieldcap, Mire Eel → Cagecap, Bog Toad →
Bolete Hook, Lantern Jelly → Foxfire, Drowned Salvager → Scrap Salvager) and renamed twelve of its
encounters off the water theme. The enemies and the region they stand in now disagree outright, which
reads worse than the old state did. The enemy-side half is finished, so what is left is this folder's:
the region's `name`, `description`, the two colours and the backdrop. **Noodle has already chosen the
title — `../BASICS.md`: the live act 1-2 "is to be titled *Myconid Navel*"** — which is why session 44
left it rather than picking one. Tracked from the other side as `enemy_overhaul/` E8.

---

### B41. He cannot reach the three routes, and the game never tells him how ◐ — ANSWERED SESSION 51; the tooltip landed session 55, the debug override remains

**Where it stands 2026-09-25.** Point 3 closed in session 55: the boss node names its boss, its health
and its route once the boss has been met (P29, archived). What remains is point 4: a debug-only
override on the Act1-1 boss roll, a way to clear a region, and an encounter picker grouped by tier and
region. `tools/`-shaped work; no design decision.

> I don't know how to trigger the three 1-a, 1-b, and 1-c routes and testing with the debug tools is so
> slow it takes forever to get to the boss and there's still only one?

Three questions in one sentence. All three have answers, and the third one is a real bug.

**1. How a route is chosen.** The Act1-1 boss the run has just beaten decides it. The table is
`tuning.map.route.byBossArray`:

| Beat this boss | And the run descends into |
|---|---|
| The Shroud (`tallyLedger`) | The Flooded Vault — Act1-A |
| The Head Gardener (`gardenerGrove`) | The Thorn Arbor — Act1-B |
| The Matriarch (`matriarchLair`) | The Pollen Road — Act1-C |

So a route is not picked on the map. It is decided a whole region earlier, by which of the three bosses
the map happened to roll.

**2. There is more than one boss — six in Act 1.** Three at the end of Act1-1 and one at the end of each
route (The Juggernaut, the Arbor Sisters, The Pale Dray). The Act1-1 boss is rolled when the map is
generated, from `bossEncounterIndexArray` on `upperCatacombs`, and all three carry `weight: 100`. Over
90 generated maps it came out 33 Head Gardener / 29 Shroud / 28 Matriarch, so the roll is fair. He is
seeing one per run because there is one per run, and the only way to see another is to reroll and play
the region again.

**3. The bug: the boss node never says which boss it is or where it leads.** `tuning.map.route`'s own
comment says *"the boss node's own preview is therefore the whole tooltip for the choice"* — but that
tooltip was never written. The boss node's preview reads, in full:

> Boss — 1 foe. The thing this place belongs to.

It does not name the boss and it does not name the route. **That is why he does not know how to trigger
the routes: the mechanism that decides them is invisible.** A player beats a boss and arrives somewhere
with no way of knowing that beating a different one would have led elsewhere. Writing that tooltip is
player-facing text, so it is his to approve — the point of this item is that the slot is empty, not
what should go in it.

**4. Why testing is slow, and what already exists.** The debug menu has a *"Fight to start"* picker
listing all 83 encounters and a test-battle button, so any boss can be fought directly — `drayRoad`,
`gardenerGrove`, `tallyLedger` are all in it. There is also a quick *"Win the current battle"* shortcut.
What is missing is anything that reaches a boss **through the map**, which is what he needs to see the
route mechanism at all:

- No way to force which Act1-1 boss a map rolls, so the route he gets is a one-in-three dice roll.
- No way to clear a region, so reaching a boss in a real run means entering and winning every node.
- The encounter picker is 83 rows in content order, labelled by index rather than name, with no grouping
  by tier or region.

The first of those three is the one that unblocks him. It is a debug-only override on the boss roll,
which is `tools/`-shaped work and needs no design decision.

---

### S64-1. Rest site audit ☆ — FILED 2026-09-25

Noodle, in the housekeeping message that set the second demo's gate (`../BASICS.md`, the second demo):

> - Rest site audit (I know it needs more complex image picking to show multiple party members, but it's quite close to fine already due to work we did with rest site upgrades)

**What the rest node has today**, so the audit measures rather than rediscovers: the campfire picture
follows whoever is at the front, one picture per character, and a path may name `{leader}` through
`{fifth}` (B42, archived); Sleep and Treatment remove as much Lust as they heal (S57-1, archived);
arriving refreshes abilities; the rest upgrades from the progression pass; the desk shows the leader
blocks. **The multi-member picture he names is B30's open half**, and it is the one piece that needs a
decision from him: which party combinations get a picture of their own, since twenty three-character
parties is twenty pictures (`../map_events/EVENTS-01.md` §"The art" priced it at nine minutes of Forge
time per look). Everything else in the audit is a browser pass: every rest option at every party size,
the picture that resolves, the button sentences, and the portrait phone (`../mobile/` S64-2), with a
suite check for each thing found.

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
