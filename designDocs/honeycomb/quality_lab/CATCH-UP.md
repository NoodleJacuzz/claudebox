# Quality Lab — CATCH-UP

A bench for tuning how an attack looks and sounds: a fixed cycle, a tap recorder, a replay, and the
timing data it exports. Project-wide context is `../BASICS.md`. The queue is `FEEDBACK.md`.

---

## Where it stands

**Designed 2026-09-24 from Noodle's pitch; nothing is built.** The design session ran in a cloud copy
of the repo with no sound library and no image folder, so the suite could not run there and every
statement about the engine in `BRIEF.md` §2 was read from the code, not measured live. The first build
session should re-run the suite before anything else.

Eight decisions wait on Noodle (`FEEDBACK.md` Q1–Q8). None of them blocks Phase 0 of the build
(`BRIEF.md` §5): the named impact, the hit groups, the resolver and the stamps change nothing visible
and can start on any answer.

**Next session, in order:** read `BRIEF.md` §2 and §3.10; do P1 if Q5 is answered; build Phase 0 and
its checks; update this file.

---

## Files

| File | Holds |
|---|---|
| `BRIEF.md` | the pitch verbatim with annotations, what the engine does today, the design, the build order |
| `FEEDBACK.md` | Q1–Q8, the decisions the design waits on |
| `../Archive/FEEDBACK-07.md` §A2 | the Battle Lab this stands on: its seams, its rulings, its traps |
| `../Archive/POLISH-01.md` §3–4 | impact and the animation vocabulary as they were settled |

Tools go in a `quality-lab` folder under `../tools/` when they exist. Nothing goes in the honeycomb root.

---

## Rules this pathway must not break

- **Overrides never bypass the resolver.** A replay with overrides on is the game's own code path.
- **No document or window listener**, keyboard included (`../REQUIREMENTS.md` §8).
- **Measure at 1× until play speed reaches CSS and audio** (`BRIEF.md` P3).
- **Every number is in `tuning.qualityLab`** or a named field on a template row.
- **The lab's storage is its own key**, never a save slot.
