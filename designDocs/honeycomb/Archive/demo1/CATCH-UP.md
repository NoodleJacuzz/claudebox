# Honeycomb Catacombs — CATCH-UP

**This is a DIRECTORY, not a history.** Read it to find out *where the work is and which folder to open*.
It is deliberately short, and it stays short: see `BASICS.md`, "Documentation rules", for the three
tiers every piece of information belongs to and the rule that keeps this file from growing back.

- **What the project is, and the rules** → `BASICS.md`. Starting something new needs only that file.
- **Per-session history** → `Archive/SESSION-LOG.md`. Nothing routinely reads it.

Honeycomb Catacombs is a teambuilding roguelike deckbuilder (Slay the Spire shaped) that runs inside
Syrup Town but is built to be lifted out of it whole. Placeholder name. **The first demo shipped as the
Public Test Release on 2026-09-23; the second demo is the target now.**

**Suite: 2805 passed, 0 failed** on Noodle's machine (session 61). Content warnings: 1 active (Anastasia,
deliberate). **In a cloud copy the suite crashes at block [81]**, because the sound library is not
uploaded, and only 1,256 of its checks run; `test_suite/` has the measurement and the fix proposed.

```
node "!designDocs/honeycomb/tools/test-honeycomb.js"
```

---

## The queue and the gate

| | |
|---|---|
| **The gate** | `BASICS.md`, "The demo scope — the second demo (Noodle, 2026-09-25)": his three lists verbatim, where each line is filed, the order the dependencies force, and the questions left for him. Work not on it does not block the demo, however loud it is. |
| **The queue** | **Each workstream's own `FEEDBACK.md`** — Noodle's quotes and the open items for that pathway. `FEEDBACK.md` at this level only indexes them and takes unsorted reports. **Update the workstream file as each task lands, not in a batch, and bump its row in the index.** |
| **The pipelines** | His seven, plus the blockers: the second column of the table below. A productive day is spent on one. |

---

## Workstreams — open one folder, not this file

A session is one topic. **Read the row you were sent to and no others** — that folder's `CATCH-UP.md`
holds its last session, its files and its rules, and its `FEEDBACK.md` holds its open items with
Noodle's quotes. Counts are open items, re-counted 2026-09-25; `FEEDBACK.md` is the live index.

| Workstream | Pipeline | Open | Where it is | Folder |
|---|---|---|---|---|
| **Test suite** | blocker | 1 | **New 2026-09-25.** Measured, not started: 17,282 lines, about 148 blocks organised by session, about 265 checks pinned to named content, a crash instead of a skip when an asset folder is absent. A two-stage order is proposed for his yes. | `test_suite/` |
| **Phone desk** | blocker | 41 | Phases 1 to 4 built 2026-09-23, waiting on a desk restart and his eye; phases 5 to 11 are a session of their own. His notes arrive through `tools/desk/desk-cli.js inbox`. | `desk/` |
| **Quality Lab** | blocker | 7 | Designed 2026-09-24, not built. Phase 0 needs none of the seven open decisions; Q7 answered: it is demo work. Comes before SFX and VFX assignment. | `quality_lab/` |
| **Balance tests** | blocker | 6 | Basic Bite finished and timed; All the Crunch works end to end on small runs. Owed: the full-size overnight run, the calibration against his play, Steps 5 to 7's checks. | `balance_tests/` |
| **Card pool rework** | Card pool rework | 12 | **`rework/cards/CARD-POOL-02.md` is the brief**: 12 C + 8 R per character, Heat in his words, Poison halving, all six grids and the neutral tier drafted; his vetoes held. First engine job is `rework/starters/` B1. | `rework/cards/` |
| **Starters, outfits, relics** | Relic & equipment rework | 4 | B1 unlock routes (nothing gates the alts, so the whole pool drops from run one); B22 the relic rework, answered session 39, not built. | `rework/starters/` |
| **Progression rework** | Relic & equipment rework | 2 | 256/256 nodes wired, `tools/audit-trees.js` green. Open: deck-customization pricing (B23), distributing unlockables (B4). **Never run `tools/generate-progression-trees.js`.** | `rework/progression/` |
| **Enemy rework** | Enemy rework | 5 | **S64-1: the second demo's encounter rework, common, elite and boss.** The retag comes first. B37: twelve sprites leave the screen at his window shape. | `rework/enemies/` |
| **Enemy overhaul** | Enemy rework | 7 | **E14: the act-1 retag MUSTs, signed off 2026-09-25** (15 Charm moves to Exposure, 8 Restraint moves retagged, Charm scrubbed). E9 every name for veto; E11 and E13 the route-native elites; E7-DEFERRED. **Start at its `CATCH-UP.md`.** | `enemy_overhaul/` |
| **Sprite pass / art pipeline** | Artwork | 10 | Round-5 alt outfit prompts written for four characters; his picks first, then card art after the pool cut. B21 cut the enemy art scope hard. | `art_pipeline/` |
| **Lust events** | Events & Writing | 2 | **B23 is the docket**: Venom, Exposure and Heat for everyone, Torment for Brienne, Penance for Clemence. Nettle's venom 1 to 3 are in the game and nothing else. "Charm events" on his list needs his word. | `lust_events/` |
| **Map events** | Events & Writing | 2 | **New folder 2026-09-25** for the random map events. Pictures done (s58b); the cast lines, the run-dependent choices and the prose are open. The Weeping Bloom is the per-character model. | `map_events/` |
| **Mobile** | Mobile support | 4 | S64-1 landscape sizes, S64-2 portrait (zoomed battlefield, drag to pan, image over text). A12's phone test path comes first. | `mobile/` |
| **UI and tooling** | Engine | 13 | S64-1 the shop's neutral-ownership drag; B6 the hand's feel; A10, B32, A-S47e, A-S47h and S58-1 wait on his eye. | `ui/` |
| **Map and acts** | Engine | 4 | Both acts live, three routes reachable and named (s55). Open: B30 the whole-party campfire picture, B31 region 1's water paint, B41 a debug boss-roll override, S64-1 the rest site audit. | `map/` |
| **Audio** | Engine | 2 | Music built s50 and waits on his ear. Owed from him: a new SFX library, elite and boss songs; then the assignment pass. | `audio/` |
| **VFX** | Engine | 1 | Not started. Tilt-and-redden in-engine first (B21 spends it), then creation through the Quality Lab. | `vfx/` |
| **Performance** | standing concern | 4 | Was the top demo goal (s39); not on the 2026-09-25 list. Telemetry endpoint unpicked (A8). | `performance/` |
| **Card frame redesign** | off the gate | 3 | A2, A3, B27: card chrome only. | `card_redesign/` |
| **Event Gallery** | off the gate | 6 | Built s49. G6 waits on content that does not exist yet. | `gallery/` |
| **Anastasia / chessmaster** | off the gate | 11 | Live in the PTR (gauntlet on, s57). Outside the card pass in his words. **The folder is not uploaded to the cloud copy**, so a cloud session cannot read or audit it. | `chessmaster/` |
| **Character and story writing** | — | — | Bibles for characters, mechanics and story. `designBibles/story.md` §3 is the tone rule, §11 the lust tags. | `designBibles/` |

---

## Standing reference — read only when the work touches it

| Document | Read it before |
|---|---|
| `reference/ARCHITECTURE.md` | writing engine code. File map, the five ideas, the registries, how to drive the engine headlessly. |
| `reference/LANES.md` | working while another agent is in the repo. Banners, index prefixes, file ownership, the route contract. |
| `reference/TRAPS.md` | re-litigating anything. 94 mistakes already made, grouped by area. **Grep it, do not read it whole.** |
| `reference/MECHANICS-01.md` | adding any card, outfit or relic. Primitives, archetypes, the roster. |
| `reference/MECHANICS-02.md` | changing a card's numbers. The balance model and the per-character rework. |
| `reference/BROKEN-01.md` | touching combat, the health bar, or any card. Shields are gone; Temporary HP and Lust/Broken replaced them. |
| `reference/SCALING-01.md` | adding any CSS length or any `+ "px"` in JS. Every length is a honeycomb pixel. |
| `reference/ART-GUIDE.md` | drawing or placing any asset. |
| `REQUIREMENTS.md` | changing anything that touches Syrup Town. The spin-off checklist. |
| `rework/AUDIT-01.md` | — open audit findings from session 30 that no pathway has claimed. |

`reference/exampleMechanics.md` is source material, not a spec.

---

## Tools

All dev tools are in `tools/`. They run from anywhere; each resolves the repo from its own location.
`tools/README.md` is the folder map.

| Command | Reports |
|---|---|
| `node "!designDocs/honeycomb/tools/test-honeycomb.js"` | the suite. Run it before changing anything — a red suite names what the last session left undone. Needs `honeycomb sound/` on disk. |
| `node "…/tools/feedback-audit.js"` | the root index against every workstream's own feedback file. **Run it at the start of a session.** |
| `node "…/tools/doc-links.js"` | every backticked path in the docs resolves. Run it after moving a document. |
| `node "…/tools/audit-trees.js"` | progression trees against their hard rules |
| `node "…/tools/balance/basic-bite.js"` | card and encounter budgets (Basic Bite; `budget-audit.js` still works). `tools/balance/all-the-crunch.js` plays whole runs |
| `node "…/tools/enemy-template.js"` | enemy and encounter budgets |
| `node "…/tools/lust-share.js"` | what share of enemy moves deal Lust, which tags the roster teaches, and anything teaching the ledger nothing |
| `node "…/tools/encounter-coverage.js"` | which encounters are reachable |
| `node "…/tools/sfx-report.js"` | sound assignments |
| `sh "…/tools/check-syntax.sh"` | every Honeycomb JS file parses |
| `node "…/tools/ptr-check.js"` | the Public Test Release against the local files. **Run it after every upload.** |
| `honeycomb.warnings.report()` | content-rule violations, in the browser console |

`tools/draft-sim/` holds the Monte Carlo draft and its data. **Its cut list is stale** and Noodle paused it
(`rework/cards/` A9). Browser tooling (which agent uses which browser, and `tools/agent-browser.js`) is in
`BASICS.md`.

---

## How to look at it

Set `devPreviewTarget = "honeycomb"` in `scripts/index.js` (or `"honeycombFresh"` to ignore the
autosave), load the page, then drive it from the console. `honeycomb.combatScene.busy` is true while a
log is replaying — wait on it before the next action.

**Set `devPreviewTarget` back to `""` when done.** It must be `""` in any release build, and it has
been found left set at the start of a session before.

---

## Recent sessions

**One line each, and the line is the whole entry.** Detail lives in the workstream's own catch-up;
anything with no other home is in `Archive/SESSION-LOG.md`, which also holds the rows for sessions 36 to
63 that used to sit here.

| # | Date | What landed |
|---|---|---|
| 64 (cloud) | 2026-09-25 | **Housekeeping.** 39 closed items swept into the `_archive/` files (the index was 166 open and is 136); `playtest_55/`, the routed inbox tables, the first demo's scope and this table's history moved to `Archive/`; `map_events/` and `test_suite/` opened; Noodle's second-demo message filed line by line and quoted in `BASICS.md` as the gate, with the dependency order and six questions for him. No game code changed. |
| 63 (cloud) | 2026-09-25 | The card pool reviewed for the manual pass, design only; `rework/cards/CARD-POOL-02.md` drafted whole (six grids, the neutral tier, Heat in his words); the lust tags signed off (`enemy_overhaul/` E14, `lust_events/` B23). |
| 62 (cloud) | 2026-09-24 | The Quality Lab designed, not built (`quality_lab/`). |
| desk 2 | 2026-09-23 | The desk's second round planned as 41 items; phases 1 to 4 built (`desk/`). |
| 61 | 2026-09-23 | Weakness ledger fixes; Revenge answers soaked hits; Petition reaches the draw pile. Suite 2805/0. |
| 60, 60b | 2026-09-23 | Honeycomb loads through `honeycomb-loader.js`; Fortitude free and total; the comment sweep of the shipped code. |

---

## ⚠ Before any release build

- `scripts/index.js` — `devPreviewTarget` must be `""`.
- **A new Honeycomb script goes in `honeycomb-loader.js`'s `scriptArray`, never as a tag in a page.** Suite
  block [142] fails if the list and the folder disagree.
- The console's `[Honeycomb] Content warnings` line should read 0 active, or every active warning
  should be understood. `honeycomb.warnings.report()` is the data a release workflow will check.
- `honeycomb.image(path)` must still be the only reference to `v13 spire images` in CODE:
  `grep -rn "v13 spire images" scripts/` — expect exactly one **assignment**, `honeycomb.imageFolder` in
  `honeycomb.js`; the other hits are comments in `honeycomb-tuning.js`.
- `node "…/tools/ptr-check.js"` after the upload.

---

## What is deliberately not done yet

- **Mobile portrait and the landscape sizing pass.** Both are the second demo's `mobile/` items.
- **Real art** for the alt outfits (recoloured copies of the default today), for most cards (about 148 owe
  art, and the pool is about to be cut), and for about half the enemies. Every alt outfit picture and card
  picture waits on the card pool pass.
- **A new sound library.** Sounds are a map onto Syrup Town's sfx plus the small Honeycomb library; music
  is built and waits on a listen; elite and boss tracks have no songs yet.
- **Spending progression on outfit unlocks.** A tree node may name `unlockOutfit`; nothing reads it yet.
  This is `rework/starters/` B1.
- **A manual save/load screen.** Six slots and the `.noodle` file export exist; no slot UI is wired.
- **Entering Honeycomb from the story game.** The title-screen button is built (`ui/` S58-1) and waits on
  Noodle's eye; `devPreviewTarget` remains the developer's door.
- **A confirmed `file://` run.** The code avoids everything that normally breaks offline, and blocked
  localStorage degrades to "playable but cannot save" — but one manual open of `index.html` would
  settle it. See `REQUIREMENTS.md` §7.
