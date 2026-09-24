# VFX — CATCH-UP

Card and combat visual effects. Project-wide context is `../BASICS.md`. The queue is `FEEDBACK.md`.

---

## Where it stands

**Not started**, and it is a demo goal.

**B21 raised the stakes on this workstream from outside it.** Noodle's enemy art plan cuts common
enemies to two poses — a standing pose and an attacking pose — on the explicit reasoning that
*"tilting their sprite and making it redder (in-engine!) will be enough since vfx will do the rest of
the work."* So hit feedback now depends on VFX rather than on sprites, and the sprite pass has already
been re-scoped on that promise.

The two in-engine pieces that plan names — tilt and redden — are the first thing to build, because the
enemy art scope is already spending them.

---

## Files

| File | Holds |
|---|---|
| `FEEDBACK.md` | B13. |
| `../art_pipeline/FEEDBACK.md` | B21, the enemy art cut that depends on this workstream. |
| `../reference/BROKEN-01.md` | The Broken cut-in and the existing animation vocabulary. |
| `../Archive/POLISH-01.md` | Forecasts, impact, and the animation vocabulary as it was settled. |

---

## Rules this pathway must not break

- **An animated consequence is one entry in `honeycomb.combatScene.logHandlerArray`.** The screen
  replays a log; it never decides anything.
- **State is final before the first frame draws**, so an interrupted or skipped effect can never leave
  the board disagreeing with the rules. Effects may be cut freely.
- **Timing never uses a raw millisecond value** — go through `tuning.animation`. The slow play speeds
  in `tuning.animation.playSpeedArray` are the debugging tool.
- **Reduced motion is a tuning switch, not a bare media query.** An Android phone with "Remove
  animations" on turns it on, and a cut-in that respects it must still resolve.
- Read `../reference/TRAPS.md`, "Animation and art" first. Several of its entries are effects that
  looked right and were not: a mask that grows from zero, an easing that lies about its duration,
  charcoal art invisible at fighter size, anything drawn across the middle of a fighter.
