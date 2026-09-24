# Performance — CATCH-UP

**The top demo goal** (Noodle, session 39). Scope: why the game runs poorly for players, the levers
that would fix it, and the telemetry that would tell us which lever matters.

Project-wide context is `../BASICS.md`. The queue is `FEEDBACK.md`.

---

## Where it stands

**The question is diagnostic and cannot be answered from Noodle's machine** — his hardware is not
player hardware. That is the whole point of B16, and why telemetry (A8) is promoted alongside it.

A cause list exists from session 12 and seven levers are still outstanding. The three that punish weak
hardware hardest are known, and they are all the same shape — the combat screen does far more DOM work
per beat than the beat needs:

1. **Lever 3** — combat repaints rebuild the whole screen from `innerHTML` every `afterBeat` (sides,
   hand, top bar).
2. **Lever 4** — forced synchronous reflows (`void offsetWidth` restarts, `getBoundingClientRect` on
   the drag and forecast paths).
3. **Lever 8** — many small DOM writes per beat (floating numbers, trails, plate rebuilds).

Session 36 closed one of these in passing: the hand bar's `outerHTML` was being replaced under a
stationary pointer, which both cost a repaint and made the hand bounce.

**This workstream is blocked in practice by two ergonomics items it does not own**: `../mobile/` A12
(phone testing is painful) and `../ui/` B29 (the debug win button takes too many steps). Noodle cannot
measure a state he cannot reach quickly. Fix those first or this goal stalls.

---

## Files

| File | Holds |
|---|---|
| `FEEDBACK.md` | B16 (the question), B14 (the lever list), A8 (telemetry). |
| `TELEMETRY-01.md` | Whether telemetry can be collected at all: yes from neocities and itch, never by them. Endpoint options, the volume model, and what it would cost the game. **Nothing is built until Noodle picks an endpoint.** |
| `../Archive/FEEDBACK-07-DONE.md` | The session-12 cause list the lever numbers refer to. |

Measurement tool: `node "!designDocs/honeycomb/tools/audit-turn-time.js"` — expected vs actual turn
time, frame drops, long tasks, drag cost. Browser.

---

## Rules this pathway must not break

- **Numbers beat descriptions.** A performance claim without a measurement is not a finding.
- **Combat is headless; the screen replays a log.** State is final before the first frame draws, so a
  repaint can be made cheaper without any risk to correctness — the board cannot disagree with the
  rules. That is the licence to optimise the renderer hard.
- **Timing never uses a raw millisecond value.** Go through `tuning.animation`.
