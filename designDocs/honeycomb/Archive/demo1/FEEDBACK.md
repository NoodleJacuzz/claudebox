# Honeycomb Catacombs — FEEDBACK

**This file sorts; it does not hold.** Feedback lives with the workstream it belongs to, because a
session is a one-topic affair — enemies one day, the card pool the next, relics after that. Carrying
forty items you are not working on costs context every session for nothing.

Two jobs only:

1. **The inbox at the bottom.** New reports land there, unsorted. The next session files each one into
   a workstream's `FEEDBACK.md`.
2. **The index below.** What each workstream holds, how many items are open in it, and when it last
   had work land — so a session can tell at a glance whether the previous one ended before it could
   write its docs.

**If a row's count disagrees with that folder's own `FEEDBACK.md`, the folder wins and the previous
session was cut short.** Re-count, fix the row, and check that file for a half-finished item before
starting anything new. `tools/feedback-audit.js` does the comparison.

**The gate is `BASICS.md`, "The demo scope — the second demo (Noodle, 2026-09-25)".** It quotes his three
lists, says which folder and item each line is filed under, and gives the order the dependencies force.
An item that serves none of it does not block the demo, however loud it is. The first demo's gate table,
the session-39 priority note and every routing table for the batches filed up to 2026-09-23 are
`Archive/INBOX-ROUTED-2026-09.md`.

---

## The index

Counts are OPEN items, one per `###` heading in the folder's `FEEDBACK.md`. All rows re-counted
**2026-09-25**, after the housekeeping session moved 39 closed items into their `_archive/` files.

| Workstream | Holds | Open | Last work landed |
|---|---|---|---|
| **`rework/cards/`** | What a card costs, does and is worth; the removal economy; curses. **B34, the manual pass: `rework/cards/CARD-POOL-02.md` is the brief, all six grids and the neutral tier drafted, his vetoes held.** | **12** | 2026-09-25 (design only) |
| **`rework/starters/`** | Starting decks, outfit unlock routes, relics and heirlooms, roster order. **B1 is the card pool's first engine job.** | **4** | s55d |
| **`rework/progression/`** | The seven trees: node effects, EXP pricing, what a node hands out. | **2** | s60 |
| **`rework/enemies/`** | Enemy numbers, roles, encounter composition. **S64-1: the second demo's encounter rework.** | **5** | 2026-09-25 (filed) |
| **`enemy_overhaul/`** | The roster's fiction: identity, naming, act placement, Lust expression. **E14: the act-1 retag MUSTs, the first job of the enemy pipeline.** | **7** | 2026-09-25 (filed) |
| **`art_pipeline/`** | The sprite pass: art owed, prompts, alt outfits, card art. | **10** | 2026-09-25 (filed) |
| **`card_redesign/`** | The card face: frames, chrome, rarity marks, ribbons. No gameplay. Off the second demo's gate. | **3** | s39 (rules only) |
| **`chessmaster/`** | Anastasia, her kit, her gauntlet, her art. Outside the card pass in Noodle's words. **The folder is not in the cloud copy; this count is from 2026-09-22 and the audit cannot check it there.** | **11** | s57 |
| **`performance/`** | Why it runs poorly for players, and the telemetry to find out. Was the top demo goal on 2026-09-19; absent from the 2026-09-25 list, read as a standing concern. | **4** | s56 |
| **`ui/`** | The hand, the debug menu, the Battle Lab, text that cannot be read. **S64-1: the shop's neutral-ownership drag.** | **13** | 2026-09-25 (filed) |
| **`map/`** | Map generation, regions, node types, the rest node. **S64-1: the rest site audit.** | **4** | 2026-09-25 (filed) |
| **`map_events/`** | **New folder 2026-09-25.** The random map events and the per-character ones. | **2** | 2026-09-25 (filed) |
| **`audio/`** | Sound effects and music. A new SFX library and its assignment; elite and boss songs. | **2** | 2026-09-25 (filed) |
| **`lust_events/`** | The authored narrative. **B23: the signed-off tag set and the demo's writing scope; "Charm events" needs his word.** | **2** | 2026-09-25 (filed) |
| **`mobile/`** | Mobile portrait and landscape, and being able to test on a phone at all. **S64-1, S64-2: the two mobile lines of the gate.** | **4** | 2026-09-25 (filed) |
| **`gallery/`** | The Event Gallery. Off the second demo's gate. | **6** | s49 |
| **`balance_tests/`** | Basic Bite and All the Crunch. **A blocker on his list.** | **6** | s54 |
| **`vfx/`** | Card and combat visual effects. **B21 made hit feedback depend on this.** | **1** | 2026-09-25 (filed) |
| **`desk/`** | The phone desk. Phases 5 to 11 of its second round. **A blocker on his list, a session of its own.** | **41** | 2026-09-23 (phases 1 to 4 built) |
| **`quality_lab/`** | The Quality Lab. **A blocker on his list**; Phase 0 needs none of the open decisions. | **7** | 2026-09-25 (Q7 answered) |
| **`test_suite/`** | **New folder 2026-09-25.** The suite's overhaul; **a blocker on his list.** | **1** | 2026-09-25 (measured) |

**136 items open across 20 workstreams in the cloud copy**, plus `chessmaster/`'s 11 on Noodle's machine.
Forty-one of the 136 are the desk's plan. Counts are `tools/feedback-audit.js`'s.

Three of these are wired together and should not be tuned one at a time: `rework/starters/` B22 (no
starting relics), `rework/cards/` B24 (more curses) and the chest cap already in (`map/` P11, archived)
all pull on how much a player has by the boss.

---

## Inbox — unsorted, file these into a workstream

*(add new reports below this line. The next session reads them, decides which workstream owns each,
moves the report there verbatim, and bumps that row's count in the index above.)*

**2026-09-25, the housekeeping session: nothing waits in this inbox.** Noodle's second-demo message was
filed line by line into the folders above and quoted whole in `BASICS.md`; the batches routed before it
are in `Archive/INBOX-ROUTED-2026-09.md`.

### The two that are still waiting on him

**IN-7. Event window styling took shortcuts.** Likely owner: `ui/` or `lust_events/`.

> a number of shortcuts were taken with the event window styling

He did not say which shortcuts. Ask before changing anything, and show him a previewer first. **This now
has a neighbour:** `mobile/` S64-2 restyles the same window for portrait (image above the text), so
whoever takes that should ask him which shortcuts he meant first.

**IN-8. Nonsense text is still in the game.** Likely owner: whichever workstream owns each piece of text.

> a mountain of absolutely nonsensical text is still left in the game.

He plans to have the events agent replace placeholder events and write character descriptions. Any
text written for this must follow `.claude/CLAUDE.md` rules 1 and 2. Never invent text for a slot he
left empty. `map_events/` S64-1 is where the map events' share of this lands.

**Done the same night, for reference:** the enemy sprite rule is now enforced by the engine. See
`reference/ART-GUIDE.md` §2 and suite block [126].
