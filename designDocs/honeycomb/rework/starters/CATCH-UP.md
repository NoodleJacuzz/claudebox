# Starters, outfits and relics — CATCH-UP

**Read this first for what a character starts with.** Scope: starting decks, the twelve basics,
alternate outfits and what each unlocks, and the relic / heirloom set.

Project-wide context is `../../BASICS.md`. The brief this pathway executes is `../STARTER-REWORK-01.md`,
which holds Noodle's quotes verbatim and wins over any annotation.

---

## Where it stands

**The twelve basics went live session 25** — the new starting decks replaced the old ones. Session 24
audited `../STARTER-REWORK-01.md` and changed no pool.

The working lists below are **design, not all implemented**. `../STARTER-REWORK-01.md` says plainly: do not
implement until the lists are agreed.

The one thing that shapes everything else here: **every alternate outfit is still unlocked from the
start**, so the card pool that outfits are supposed to gate drops from run one. That is `FEEDBACK.md`
B1, and it belongs to `../cards/` as much as here.

`OUTFITS-LIST.md` outranks `../../reference/MECHANICS-01.md` for what each character *is*.

---

## Files

| File | Holds |
|---|---|
| `../STARTER-REWORK-01.md` | **The brief.** Noodle's quotes and the lever map. Read it before the lists. |
| `STARTER-LIST.md` | The live working design. Kept lean and direct by instruction — not a discussion document. |
| `STARTER-DISPOSITION.md` | What the session-25 decks replaced, and why. |
| `OUTFITS-LIST.md` | All 18 outfit signatures, one line each. |
| `RELICS-LIST.md` | Common relics and heirlooms. |

Art for outfits is `../../art_pipeline/OUTFITS.md` (19 outfits, sets A–F, 114 designs) — a separate
workstream, and those designs are not written into `charactersDB.js` yet.

Live content: `honeycomb-content-characters.js` (characters, outfits, equipment, relics).

---

## Remaining goals

`FEEDBACK.md` holds the full quote and annotation for each. The table below is the index; that file is the queue.

| | Goal | State |
|---|---|---|
| **B1** | **Unlock routes.** Nothing gates the alternate outfits, so nothing gates the cards they carry. Shared with `../cards/`, and **the first engine job of `../cards/CARD-POOL-02.md`**: the 18 alts come off `unlockedFromStart`. | ☐ the load-bearing one |
| **B22** | **Relic rework** — and with it **A5**, free per-fight healing in the heirlooms undercutting the campfire. Noodle's 2026-09-25 list names this pipeline *Relic & equipment rework*. | ☐ answered session 39 |
| **B19** | **Character order.** | ☐ |
| — | B8 (Broken art per outfit) closed in session 56; P1 to P4, P25 and P26 are in `_archive/FEEDBACK-DONE.md`. | |

---

## Rules this pathway must not break

- **Outfits and equipment share one modifier shape** — `healthModifier`, `cardAdditionArray`,
  `cardReplacementArray`, `hooks` — and both reach the deck through the single seam
  `honeycomb.memberCardEntryArray`. Nothing else may add cards to a member.
- **Pools are rebuilt, never patched.** A member's cards, abilities and tags are all derived.
- **Starting relics are HEIRLOOM equipment**, via `startingEquipmentArray` on a character.
- **One health baseline.** `tuning.run.characterBaseHealth` (58). A character's own `baseHealth`
  survives only as an override; tankiness is the Vigour node's rank ceiling.
- **Old character names still mean someone.** Nettle was Moss, Severine was Vex, Cassadora was Wick
  (codename `skull`). The renames are done; Noodle still uses the old names in conversation. Glossary
  in `../../BASICS.md`. Never read an old name in feedback as a typo.
