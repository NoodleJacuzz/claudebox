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

His answers settled seven of eight questions (`_archive/FEEDBACK-DONE.md`) and changed the design in
three ways: the lab is its own scene on the shared battlefield with a GO LIVE button, every actor
plays every card, and timeline entries anchor to the action's start or its impact. The eighth answer,
**ownerless cards** (`FEEDBACK.md` Q4), is a prerequisite larger than the lab; Phase 0 takes only its
first step and the rest wants a plan of its own.

**Next session, in order:** read `BRIEF.md` §2, §3.10 and §5; build Phase 0 and its checks (the
timeline with two anchors, hit groups, a card played from any source, the sound seam, the stamps);
update this file.

---

## Files

| File | Holds |
|---|---|
| `BRIEF.md` | the pitch verbatim with annotations, what the engine does today, the design, the build order |
| `FEEDBACK.md` | Q4, ownerless cards: the open item |
| `_archive/FEEDBACK-DONE.md` | Q1–Q3 and Q5–Q8 with Noodle's answers of 2026-09-25 |
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
