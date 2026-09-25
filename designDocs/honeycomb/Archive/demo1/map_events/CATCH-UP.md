# Map events — CATCH-UP

The random map events (eight today, plus the campfire): what they say, who speaks in them, what they
offer, and the per-character ones that raise a Lust weakness. Project-wide context is `../BASICS.md`.
The queue is `FEEDBACK.md`. Map GENERATION, regions, node types and the rest node stay in `../map/`.

**Opened as a folder 2026-09-25.** `EVENTS-01.md` had sat here since session 50 without a catch-up or
a queue, against the rule that a pathway gets both on the day it starts. Noodle's 2026-09-25 gate names
two items for it (`../BASICS.md`, the second demo), under the *Events & Writing* pipeline.

---

## Where it stands

- **Eight map events and the campfire are live, every one with a real picture** (session 58b: a
  stranger in each, never the cast, because the party is unknown; the campfire follows the leader, one
  picture per character). The wording was bent to fit the pictures; the wording from before that is in
  `_archive/`.
- **The engine supports cast lines** (session 50): a scene line may carry a `condition`, and
  `partyContains` takes a `position` (0 is the leader, 1 the one behind). One line per character for the
  front and one for the second covers every party in twelve lines. No event uses it yet.
- **The Weeping Bloom** (session 59, `../map/_archive/FEEDBACK-DONE.md` S59-1) is the model for a
  per-character event: Nettle only, raises her venom a rank through `raiseWeaknessRank`, only offered
  when the rank is really available (`weaknessCanRank`), an event-level `subject`, and it may pass the
  run's one-rank ceiling (S60-5). Fortitude parties never see it (`honeycomb.lust.hasFortitude`).
- **A quiet pool** (session 58c) is Noodle's own `smallDynamicPool` draft made live: leader lines, a
  per-leader picture, heal a tenth and halve Lust per member.
- **The choices do not change across a run** (`EVENTS-01.md`, point 3). `choice.condition` exists; it is
  content work.
- Nothing here is on the suite beyond block [52], which dry-runs every event choice.

## Files

| File | Holds |
|---|---|
| `FEEDBACK.md` | S64-1 the overhaul of the common events, S64-2 the per-character events. Noodle's words. |
| `EVENTS-01.md` | The session-50 proposal: what is wrong, the party's-point-of-view writing rule with the Quiet Spring written out in twelve lines, six new event ideas (one per character), and an art plan that predates 58b's pictures. |
| `_archive/_backup-2026-09-23/`, `_archive/_backup-2026-09-24/` | Copies of `honeycomb-content-map.js` taken before the 58b and 58c text edits, so the old wording of every event survives. |

Live content: `scripts/misc/honeycomb/honeycomb-content-map.js` (`eventArray`). Noodle edits these events
from his phone through `../desk/`; his notes on them arrive through `../tools/desk/desk-cli.js inbox`.

## Rules this pathway must not break

- **A map event addresses the party as "you"; a Lust Event has no player in it at all.** Opposite rules,
  neither a mistake (`EVENTS-01.md`).
- **Never invent text for a slot he left empty.** Placeholder prose is his, or the events agent's, to
  replace (root `FEEDBACK.md` IN-8).
- **Every event picture lives in `events/`**: `events/<name>` for a map event, `events/<scene>/<art folder>`
  for a picture made once per girl.
- **An event effect that changes the world must log it.**
- **Back up the event table before a scripted edit, and never edit it with a greedy regex.** That is
  what the two backups in `_archive/` were for.
