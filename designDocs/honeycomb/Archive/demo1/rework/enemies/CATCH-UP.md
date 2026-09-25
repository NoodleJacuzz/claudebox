# Enemy rework — CATCH-UP

**Read this first for enemies.** Scope: enemy numbers, identities, roles, encounter composition and
coverage.

Project-wide context is `../../BASICS.md`.

---

## Where it stands

**The content landed session 34 and every step of the brief is ticked.** The complaint that started it
was that the game is too easy — enemies dealt and took far less than the expected amount of damage, so
act 1 had no sense of danger.

What is live: a template per role (regular / elite / boss) in `tuning.balance` + `enemyRoleArray`,
every existing enemy rebuilt to it, an identity for every enemy, **13 new enemies and two boss pools**,
and a recoloured placeholder folder per new enemy with sidecar tag packs for the art pipeline.

`../../tools/enemy-template.js` measures the roster statically and everything sits inside budget.

**What is owed is play, not suite.** Noodle's "needs testing" on the demo gate means testing by
playing. The numbers are checked; the feel is not.

**2026-09-21: enemy art is two files per enemy, and the engine now enforces it.** An ordinary enemy
has `1-combat` and `1-offense` and nothing else. 254 placeholder and duplicate files were moved out of
the enemy folder into `v13 spire images/_source/_archive-enemy-poses/`. Read
`../../reference/ART-GUIDE.md` §2 before touching enemy art, and never put an archived file back. No
ordinary enemy has a real `1-offense` drawing yet, so attacks show `1-combat`.

**2026-09-21: Noodle is unhappy with the enemy roster and has open reports.** Five designs he had
previewed publicly were cut without his knowing, some enemies were missed, and he rejects recoloured
stand-ins. His words are in the inbox at the bottom of `../../FEEDBACK.md` (IN-1 to IN-6). File them
here and start with IN-1.

---

## Files

| File | Holds |
|---|---|
| `ENEMIES-01.md` | The brief verbatim, the status board, the template (§2), the roster with identities (§3), coverage (§4), art owed (§5). |
| `ENEMIES-01-AUDIT-BEFORE.txt` | The measurement that justified the pass. A before-picture. |

Read before changing a number: `../cards/BALANCE-01.md` (the budget) and
`../../designBibles/mechanics.md` (the encounter laws). Act 1 fluff is `../../designBibles/story.md`.

Live content: `scripts/misc/honeycomb/honeycomb-content-enemies.js`.

---

## Tools

```
node "!designDocs/honeycomb/tools/enemy-template.js"        every enemy and encounter against its role template
node "!designDocs/honeycomb/tools/budget-audit.js"          every encounter against the damage budget
node "!designDocs/honeycomb/tools/encounter-coverage.js"    which encounters a run can actually reach
```

Re-measure coverage whenever the roster changes.

---

## Remaining goals

`FEEDBACK.md` holds the full quote and annotation for each. The table below is the index; that file is the queue.

| | Goal | State |
|---|---|---|
| — | **Play testing.** The demo gate's "needs testing" is Noodle's, and it is not a suite run. | ☐ |
| **B21** | **Enemy art scope**, cut hard. It leans on VFX: tilt and redden in-engine, and the VFX pass does the rest. | ☐ |
| **B2** | **13 of 36 enemies still `artOwed`.** Sidecars exist; the art does not. Work happens in `../../art_pipeline/`. | ◐ |
| **S64-1** | **The second demo's encounter rework: common, elite and boss additions** (Noodle, 2026-09-25). Carries P14's open half, whether act 1 fights should last longer. The E14 retag comes first. | ☆ |
| **B31** | **Sporelings should be fought in bulk.** | ☆ |
| **B36** | **A two-Fencer elite** would close `../../enemy_overhaul/` E11 for the Pollen Road at the same time. | ☆ |
| **B37** | **Twelve sprites leave the screen** at his window shape; the Head Gardener's scale is settled, the height cap is not. | ☆ |
| — | **Enemy titles** (`../../ui/` B32, built, waits on his eye) and **the rare drop rate** (`../cards/` B33) are tracked in their own folders. | |

---

## Rules this pathway must not break

- **Adding an enemy is a table entry only** — enemy, intent AI and encounter group are all data.
- **Every number is named.** An enemy's numbers are fields on its entry; shared numbers are
  `tuning.balance`.
- **An enemy is defeated by breaking, but a lethal hit is still a kill.** See
  `../../reference/TRAPS.md`, "Lust and Broken".
- **Enemies pass over the broken, and the forecast must read the same pool.** A target mode that
  disagrees with the forecast is a bug the player sees.
- Re-run `../../tools/enemy-template.js`, `../../tools/budget-audit.js` and the suite after any change.
