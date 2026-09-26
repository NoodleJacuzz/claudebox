# Honeycomb Catacombs — CATCH-UP

**This is a DIRECTORY, not a history.** Read it to find out *where the work is and which folder to open*.
`BASICS.md` holds the rules and the second demo's gate; `Archive/SESSION-LOG.md` holds the history;
nothing routinely reads the frozen first-demo tree in `Archive/demo1/`.

Honeycomb Catacombs is a teambuilding roguelike deckbuilder (Slay the Spire shaped) that runs inside
Syrup Town but is built to be lifted out of it whole. Placeholder name. **The first demo shipped as the
Public Test Release on 2026-09-23; the second demo is the target.**

**Suite: 2805 passed, 0 failed** on Noodle's machine (session 61). Content warnings: 1 active (Anastasia,
deliberate). In a cloud copy the suite crashes at block [81] on the missing sound library and runs 1,256
checks; `tooling/TOOLING.md` has the measurement and the fix proposed.

```
node "!designDocs/honeycomb/tools/test-honeycomb.js"
node "!designDocs/honeycomb/tools/feedback-audit.js"
```

---

## The pipelines — open one folder, not this file

A session is one pipeline. Its document holds where the work is, the rules, and the queue in Noodle's
words; read it and nothing else. Counts are open items, checked by `tools/feedback-audit.js`.

| Pipeline | Open | Where it is | Document |
|---|---|---|---|
| **Tooling** (blockers: the suite, the balance tests, the Quality Lab) | 15 | The suite is measured and its overhaul waits on his yes to a two-stage order. Basic Bite is finished; All the Crunch needs its full-size run and his calibration hour. The Quality Lab is designed; Phase 0 needs no decision. S65-1: the in-frame review grids he needs before any verdict. | `tooling/TOOLING.md` |
| **Phone desk** (blocker) | 41 | Phases 1 to 4 built 2026-09-23 and waiting on a restart and his eye; phases 5 to 11 are a session of their own. His notes arrive through `tools/desk/desk-cli.js inbox`. | `desk/FEEDBACK.md` |
| **Card pool rework** | 13 | `card_pool/CARD-POOL-02.md` is the brief: all six grids and the neutral tier drafted, his vetoes held. First engine job is `relics/RELICS.md` B1. S65-1: the starter broken-card rule, 0 of 10 comply. | `card_pool/CARD-POOL.md` |
| **Enemy rework** | 13 | E14, the act-1 retag, first. The common pool is drafted and measured (`enemies/COMMON-ENCOUNTERS-01.md`, session 66) and waits on the frame; then the elite and boss sessions, graded against S65-1 and the act-1 floor. Every name is his to veto. | `enemies/ENEMIES.md` |
| **Artwork** | 14 | Alt outfit picks (round-5 prompts written), then card art after the pool cut, VFX overlays by Stable Diffusion, the card chrome's three items. | `art_pipeline/ART-PIPELINE.md` |
| **Events & Writing** | 10 | The docket is Venom, Exposure and Heat for everyone, Torment for Brienne, Penance for Clemence; one bundle per session. The writing groundwork is `../voice_matching/`. Map events have their pictures and want their cast lines. S65-1: event relics priced in a weakness rank. | `events/EVENTS.md` |
| **Mobile support** | 4 | Landscape sizing, then portrait (the camera pans with the card drag). The phone test path comes first. | `mobile/MOBILE.md` |
| **Relic & equipment rework** | 7 | S65-1 the rarity model, answered session 65 (`relics/RELIC-REWORK-01.md`): safe pool first, his 29 ideas second, verdicts in the frame; B1 the unlock routes; B22 the relic rework, answered and not built; B23 and B4 on the trees. | `relics/RELICS.md` |
| **Engine** | 25 | The verbs the other pipelines wait for, the shop drag, the rest site audit, the SFX library and assignment, elite and boss songs, five items waiting on his eye, performance as a standing concern. | `engine/ENGINE.md` |
| **Character and story writing** | — | Bibles for characters, mechanics and story. `designBibles/story.md` §3 is the tone rule, §11 the lust tags. | `designBibles/` |

**Off the gate and frozen in `Archive/demo1/`:** Anastasia (`chessmaster/`, on Noodle's machine; not
in the cloud copy), the Event Gallery (`gallery/`), the card chrome bench's design (`card_redesign/`),
and every workstream folder as it stood on 2026-09-25.

---

## Standing reference — read only when the work touches it

| Document | Read it before |
|---|---|
| `reference/ARCHITECTURE.md` | writing engine code. File map, the five ideas, the registries, driving the engine headlessly. |
| `reference/LANES.md` | working while another agent is in the repo. |
| `reference/TRAPS.md` | re-litigating anything. 94 mistakes already made. **Grep it, do not read it whole.** |
| `reference/MECHANICS-01.md` | adding any card, outfit or relic. Primitives, archetypes, the roster. |
| `reference/MECHANICS-02.md` | changing a card's numbers. The balance model. |
| `reference/BROKEN-01.md` | touching combat, the health bar, or any card. |
| `reference/SCALING-01.md` | adding any CSS length or any `+ "px"` in JS. |
| `reference/ART-GUIDE.md` | drawing or placing any asset. |
| `REQUIREMENTS.md` | changing anything that touches Syrup Town. |

`reference/exampleMechanics.md` is source material, not a spec.

---

## Tools

All dev tools are in `tools/`; `tools/README.md` is the folder map. The ones every session may need:

| Command | Reports |
|---|---|
| `node "…/tools/test-honeycomb.js"` | the suite. Run it before changing anything. Needs `honeycomb sound/` on disk. |
| `node "…/tools/feedback-audit.js"` | the root index against every pipeline's queue. **Run it at the start of a session.** |
| `node "…/tools/doc-links.js"` | every backticked path in the docs resolves. Run it after moving a document. |
| `sh "…/tools/check-syntax.sh"` | every Honeycomb JS file parses. |
| `node "…/tools/ptr-check.js"` | the Public Test Release against the local files. **Run it after every upload.** |
| `honeycomb.warnings.report()` | content-rule violations, in the browser console. |

---

## How to look at it

Set `devPreviewTarget = "honeycomb"` in `scripts/index.js` (or `"honeycombFresh"` to ignore the
autosave), load the page, then drive it from the console. `honeycomb.combatScene.busy` is true while a
log is replaying; wait on it before the next action. **Set `devPreviewTarget` back to `""` when done.**

---

## Recent sessions

**One line each, and the line is the whole entry.** Detail lives in the pipeline's document; anything with
no other home goes in `Archive/SESSION-LOG.md`.

| # | Date | What landed |
|---|---|---|
| 66 (cloud) | 2026-09-25 | **The common enemy and encounter pool drafted and measured** (`enemies/COMMON-ENCOUNTERS-01.md`, `enemies/COMMON-DRAFT-01.js`, `tools/common-draft-audit.js`). His ten rules filed verbatim. What shipped, measured: 61 ordinary fights, 51 of them three bodies, fifteen groups sharing an enemy-type set, route commons costing up to 69% of party health against 15% (the Bell Choir dearer than the Juggernaut). The math: an act-1 run is 29 nodes and 15.7 fights; four fights a band satisfies his two-fight block rule with a real roll every time, so 40 common encounters (16 in act 1-1, 8 a route) over 27 commons (41 and 28 after the next day's art correction). The draft: one or two types a fight, sizes one to five in every route, formation as the order of the table, two new roles (`swarm`, `lone`), the Mold Leech reconceived as the Glutton, the Doorward and Dustmote new, the Courtier and The Dandy returned from the cutting-room images, both Fencers benched for the elite pair, the Witch's Butter drawing on the Glutton. Every common stands in one region; four sprite pairs ship the pool. Basic Bite on every drafted fight against the shipped ceiling per band; four came in over and were cut down; bulk Sporelings wait on E14's Poison halving. The block rule filed to `engine/` as S66-1. No game code changed; every verdict waits for the desktop. |
| 65 (cloud) | 2026-09-25 | **Relic rarity measured and re-modelled** (`relics/RELIC-REWORK-01.md`, `tools/relic-census.js`). Rarity is a price tag today: every relic roll is a uniform pick, 4.3 relics a run from a pool of 15 or 16 for a trio, so 37% of drops are rares. Proposed for his veto: common persists as the collection, uncommon is the gated engine part, rare the swing; boss, shop and event are sources, not weights. The live 36 re-filed; the gap is the boss tier, which his own 29 relic ideas (filed verbatim, §7 and §8) mostly close. Later the same day: his answers to all eight questions filed verbatim (§6), the desktop-grid review rule recorded in `BASICS.md`, three items filed (the starter broken-card rule to `card_pool/`, event relics priced in a weakness rank to `events/`, the review grids to `tooling/`), his difficulty note routed to `enemies/` as S65-1, the standard the three encounter sessions are graded on. No game code changed. |
| 64 (cloud) | 2026-09-25 | **The documentation tree rebuilt from Noodle's pipelines.** Twenty workstream folders became eight pipeline documents plus `desk/`; every open item moved in his words; everything else is frozen at its old path in `Archive/demo1/`. Earlier the same day: 39 closed items archived, the root documents cut, his second-demo message filed as the gate. No game code changed. |
| 63 (cloud) | 2026-09-25 | The card pool reviewed for the manual pass; `card_pool/CARD-POOL-02.md` drafted whole; the lust tags signed off (E14, B23). |
| 62 (cloud) | 2026-09-24 | The Quality Lab designed, not built (`tooling/QUALITY-LAB-BRIEF.md`). |
| desk 2 | 2026-09-23 | The desk's second round planned as 41 items; phases 1 to 4 built (`desk/`). |
| 61 | 2026-09-23 | Weakness ledger fixes; Revenge answers soaked hits; Petition reaches the draw pile. Suite 2805/0. |

---

## ⚠ Before any release build

- `scripts/index.js`: `devPreviewTarget` must be `""`.
- A new Honeycomb script goes in `honeycomb-loader.js`'s `scriptArray`, never as a tag in a page (suite block [142]).
- The console's `[Honeycomb] Content warnings` line reads 0 active, or every active warning is understood.
- `grep -rn "v13 spire images" scripts/` shows one assignment, `honeycomb.imageFolder`.
- `node "…/tools/ptr-check.js"` after the upload.

---

## What is deliberately not done yet

- **Mobile portrait and the landscape sizing pass** (`mobile/`).
- **Real art** for the alt outfits, most cards and about half the enemies; all of it waits on the card pool pass.
- **A new sound library**; elite and boss songs; the music waits on a listen.
- **Spending progression on outfit unlocks** (`relics/` B1).
- **A manual save/load screen.** Six slots and the `.noodle` export exist; no slot UI is wired.
- **Entering Honeycomb from the story game** beyond the title-screen button, which waits on his eye.
- **A confirmed `file://` run** (`REQUIREMENTS.md` §7).
