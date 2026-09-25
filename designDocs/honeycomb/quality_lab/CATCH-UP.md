# Quality Lab — CATCH-UP

A bench for tuning how an attack looks and sounds: a fixed cycle on its own screen, a tap recorder, a
replay, a one-press transform into a live battle, and the timing data it exports. Project-wide context
is `../BASICS.md`. The queue is `FEEDBACK.md`.

---

## Where it stands

**Designed 2026-09-24 from Noodle's pitch, revised 2026-09-25 on his answers; nothing is built.** Both
sessions ran in a cloud copy of the repo with no sound library and no image folder, so the suite could
not run there and every statement about the engine in `BRIEF.md` §2 was read from the code, not
measured live. The first build session should re-run the suite before anything else.

His answers settled all eight questions (`_archive/FEEDBACK-DONE.md`) and changed the design in
three ways: the lab is its own scene on the shared battlefield with a GO LIVE button, every actor
plays every card, and timeline entries anchor to the action's start or its impact. The fourth answer
grew into a pathway of its own, **ownerless cards** (`../ownerless_cards/`); the lab takes only three
small engine fixes from it (`BRIEF.md` P0) and the two plans do not wait on each other.

**Next session, in order:** read `BRIEF.md` §2, §3.10 and §5; build Phase 0 and its checks (the
timeline with two anchors, hit groups, P0's three fixes, the sound seam, the stamps); update this
file.

---

## Files

| File | Holds |
|---|---|
| `BRIEF.md` | the pitch verbatim with annotations, what the engine does today, the design, the build order |
| `FEEDBACK.md` | the open items (none until something is built) |
| `_archive/FEEDBACK-DONE.md` | Q1–Q8 with Noodle's answers of 2026-09-25 |
| `../ownerless_cards/BRIEF.md` | the plan for owners assigned in-game and never on a card's entry |
| `../Archive/FEEDBACK-07.md` §A2 | the Battle Lab whose seams this reuses: its rulings and its traps |
| `../Archive/POLISH-01.md` §3–4 | impact and the animation vocabulary as they were settled |

Tools go in a `quality-lab` folder under `../tools/` when they exist. Nothing goes in the honeycomb root.

---

## Rules this pathway must not break

- **Overrides never bypass the resolver.** A replay with overrides on is the game's own code path.
- **Any actor plays any card, and a card names its poses by role.** No-op and fallback, never an error.
- **The lab screen holds the battlefield and its strip, nothing else.** GO LIVE is how a real fight is
  reached.
- **No document or window listener**, keyboard included (`../REQUIREMENTS.md` §8).
- **Measure at 1× until play speed reaches CSS and audio** (`BRIEF.md` P3).
- **Every number is in `tuning.qualityLab`** or a named field on a template row.
- **The lab's storage is its own key**, never a save slot.
