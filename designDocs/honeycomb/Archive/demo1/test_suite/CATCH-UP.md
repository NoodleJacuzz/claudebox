# Test suite — CATCH-UP

The overhaul of `../tools/test-honeycomb.js`. Project-wide context is `../BASICS.md`. The queue is
`FEEDBACK.md`. Noodle named this an early-stage blocker for the second demo on 2026-09-25 (`../BASICS.md`,
the second demo); this folder was opened the same day so the measurements below are not redone.

---

## Where it stands

**Not started.** What is known about the suite, measured 2026-09-25 on the cloud copy:

| Measured | Value | What it says |
|---|---|---|
| Size | 17,282 lines, about 2,555 `check(` calls in the source, **2,805 passes** reported on Noodle's machine at session 61 | one file, grown by accretion |
| Blocks | about 148, numbered `[1]` to `[148]`, most titled by the SESSION that wrote them (`[79] Session 21: the sound library…`) | **the suite is organised by time, not by subject** |
| Disk reads | 106 `readdirSync` / `existsSync` / `readFileSync` / `statSync` calls; the sound library is read in three places | it tests the working tree, not only the engine |
| In a copy without `honeycomb sound/` | an uncaught `ENOENT` at block [81]; **1,256 of the 2,805 checks run, the rest never start** | a missing asset folder is a crash, not a skip |
| Pinned to named content | about 265 lookups of the form `…Array, "someIndex")` | the rough size of what the card pool cut will turn red |
| Retired content kept alive | `RETIRED_LUST_EVENT_FIXTURES`, `RETIRED_LUST_QUEUE_FIXTURES`: cut placeholder events re-registered as fixtures so their checks still pass | content the game no longer ships, carried to keep the suite green |

**Why Noodle wants it agnostic, in his words:** `FEEDBACK.md` S64-1. The short form: a check pinned to
a card's name breaks when the card is cut, so a session spends its budget protecting old content instead
of changing systems, and the unrelated breakage has to be carried into the next session by memory.

**The chicken and the egg.** He wants the rebuild *"after we can be sure all legacy content weighing us
down is cut"*, and the cut (`../rework/cards/CARD-POOL-02.md`, about 70 cards) will turn the content-bound
checks red on the day it lands. The recommendation, for his yes:

1. **Stage one, before the cut, small.** Guard the disk reads so a missing folder reports its checks as
   SKIPPED rather than crashing (three sound-folder reads today), and tag every block `engine`, `content`
   or `presentation` in its title, so the content blocks can be muted as a set when the pool lands and the
   engine blocks keep certifying. This is what lets a cloud session run the suite at all.
2. **The cut lands** with the content blocks muted, and the warning report (`honeycomb.warnings.report()`)
   as the content gate meanwhile.
3. **Stage two, the rebuild, by subject.** Engine verbs, content rules, presentation, one file each or one
   section each, with **property checks** where the old suite had named cards: every card has a broken form
   of the right rarity, every enemy fits its budget, every path a table names exists on disk, no card prints
   a raw token, warnings zero. A named card stays only where a bug was fixed, as a regression check pinned
   to the RULE it protects and labelled with it, never to the card's name alone.

**What must survive the rebuild** (`../BASICS.md`, verification): a red suite is the project's best
forensic tool for an interrupted session; new checks go in for what was changed; falsify before ticking.
`../tools/falsify-routes.js` is the pattern for proving a check can go red.

## Files

| File | Holds |
|---|---|
| `FEEDBACK.md` | S64-1, Noodle's words, and what the rebuild is measured against. |
| `../tools/test-honeycomb.js` | The suite. `../tools/README.md` lists the other audits that stay separate. |
| `../tools/falsify-routes.js` | The falsification harness pattern. |

## Rules this pathway must not break

- **A function the suite must see has to live in a file the suite loads.** Helpers in `honeycomb-ui.js` or a
  scene file are invisible to it (`../reference/TRAPS.md`).
- **Green certifies only what is asserted.** Unchecked is a failure, not a pass.
- **Never delete a check to get green.** Muting a content block during the cut is a labelled, temporary state
  the catch-up records, not a deletion.
