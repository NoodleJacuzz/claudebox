# Voice matching — what this project is

**The goal: a sketch you write should come back as prose you do not have to rewrite.**

Your outlines and sketches are not the problem. The step from a sketch to finished text is, and it is
the same step every time — the beats survive, the voice does not. This folder is the work of closing
that gap.

Where the work is: `CATCH-UP.md`. The job queue: `TODO.md`. What needs Noodle: `FOR-NOODLE.md`.

---

## The three kinds of writing this covers

They have different rules and they fail in different ways. All three are in scope.

| Kind | Where it lives | How it goes wrong |
|---|---|---|
| **Scene text** | `scripts/characters/*.js`, `scripts/misc/honeycomb/honeycomb-content-lust-events.js` | Competent writing in the wrong voice. Softened, over-punctuated, narration that explains. |
| **Documents you read to decide things** | `!designDocs/**` | Compressed into epigrams you have to decode. You have raised this twice. |
| **Image prompts** | `!designDocs/honeycomb/lust_events/PROMPTS-*.txt`, sidecars in `v13 spire png/` | Not yet diagnosed. The comparison that would diagnose it is item V5. |

---

## The one idea underneath all of it

**Rules written from the outside have mostly stopped working. Your corrections still work.**

The `syrup-town-scenes` skill already holds the rules, and they are correct. They were still being
broken in the same session they were written — the skill says *do not soften* and the drafts kept
softening. What fixes that is a record of his corrections, and a check that runs before the work is handed over.

What did work, every time, was you rewriting something. The six rows in `reference/honeycomb.md` §3 —
you swear, a bare `necro ...` line is a beat, narration can carry sound, rank 3 is an argument she
loses to herself — are the most useful paragraph in the whole skill, and they came from one incident
where you rewrote two scenes and somebody wrote down what changed.

That happened once. It has happened many other times and nobody wrote it down.

**So the centre of this project is collecting your corrections, not restating the rules.** Everything
else on the list either feeds that collection or makes it checkable.

---

## Why the desk is the right home for it

You called the desk "a database shared between us", and it already records the thing we need without
being asked:

- `events.js` copies the whole game file into `desk/data/backups/` **before every write**. Three
  backups from 2026-09-21 are already there. Each one is a "before" with the live file as its "after".
- A note attached to a line carries a `snapshot` of that line as it was, plus whatever you said about
  it. A correction with its reason attached is the most useful thing there is, because the reason says
  which other lines it applies to.

So the log does not have to be a chore either of us performs. It can be read off what the desk already
keeps, with a command that turns backups into pairs. Items V1–V4.

---

## What already exists, and is not being repeated here

- `.claude/CLAUDE.md` — the three rules that load into every session.
- `.claude/skills/syrup-town-scenes/` — the skill, its three reference pages, and `scene-metrics.py`.
- `.claude/skills/syrup-town-images/` — the image prompt skill.
- `!designDocs/story_feedback/CHARACTER_REFRESHER.md` — the Syrup Town cast. **Contains none of the
  Honeycomb cast.** For Honeycomb, character notes are `lust_events/IDEAS.md` §3.
- `!designDocs/honeycomb/lust_events/SCENES-01.md` — the ideas and sketches, with your own Nettle V2
  and V3 reproduced in full.
- `scripts/misc/honeycomb/honeycomb-content-lust-events.js` — the live scenes. **Nettle's v1, v2 and
  v3 are 100% yours** as of 2026-09-21, which makes them the Honeycomb reference set.

This folder does not duplicate any of that. It is the work of improving it.
