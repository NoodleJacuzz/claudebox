# Ownerless cards — CATCH-UP

A card's owner is assigned in the run and is never a field on the card's entry; pools are declared
on the owner's side and can be shared. Project-wide context is `../BASICS.md`. The queue is
`FEEDBACK.md`.

---

## Where it stands

**Planned 2026-09-25 from Noodle's direction; nothing is built.** The planning session ran in a
cloud copy of the repo with no sound library and no image folder, so the suite did not run and every
line of `BRIEF.md` §3 was read from the code. The first build session should re-run the suite first.

Seven decisions wait on Noodle (`FEEDBACK.md` D1–D7). Steps 1 and 2 of the plan need none of them:
they generate the pools and point the readers at them without changing anything a player sees.

**Next session, in order:** read `BRIEF.md` §3 and §6; build Step 1 (the pools and the migration
tool with `--check`); build Step 2; record the fixtures rule 8 asks for; update this file.

---

## Files

| File | Holds |
|---|---|
| `BRIEF.md` | the plan: the map of ownership today, the target model, six steps with checks, rules |
| `FEEDBACK.md` | Noodle's two statements verbatim, and D1–D7 |
| `../quality_lab/BRIEF.md` P0 | the slice of Steps 3–4 the Quality Lab needs; written once, in Step 4's block |
| `../rework/cards/CATCH-UP.md` | the card pool's own workstream; this plan changes where ownership lives, not what the pools contain |

Tools go in an `ownerless` folder under `../tools/` when they exist. Nothing goes in the honeycomb
root.

---

## Rules this pathway must not break

- **A null owner is a bug, not a case** (after Step 3).
- **Never edit the content tables with a greedy regex.** Slice by index; re-run the suite.
- **Behaviour-preserving until Step 3**, proven by fixtures recorded before Step 2.
- **`cardActingEntity` draws no randomness.**
- **Every number is in `tuning.deck`**; every pool is a table row.
