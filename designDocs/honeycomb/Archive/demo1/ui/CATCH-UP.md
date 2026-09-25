# UI and tooling — CATCH-UP

Screens, controls and legibility. Project-wide context is `../BASICS.md`. The queue is `FEEDBACK.md`.

---

## Where it stands

Four open items, and **two of them block the top demo goal** — Noodle cannot measure a state he cannot
reach quickly.

- **The hand (B6).** *"The hand does not feel good"* is the single most repeated bug report. Two causes
  are closed: the 10-card cap (session 13) and the bounce (session 36 — `repaint()` was replacing the
  hand bar's `outerHTML` under a stationary pointer, so the hand sank under a still cursor and sprang
  back on the next twitch; hover now carries across as `hcHandRaised`). **What is left is the feel and
  legibility pass**, and lever 3 in `../performance/` — the repaint cost is part of how it feels.
- **The Battle Lab (A10) — all three defects fixed session 47, waits on his pass.** Tooltips on the card
  picker; the filter row was crushed to 4px (the unclickable buttons); an anchor now holds only on the
  line it was written for, so a boss summoned to the party stops covering party plates.
- **The debug win button (B29) — closed session 47.** One press from the fight's top bar; a debug
  action is promoted by a field on its table entry (`quick`, `topBar`).
- **Enemy titles (B32) — built session 47, waits on Noodle's eye.** New `--hc-title-shadow`; names wrap
  instead of being cut (16 of 55 crowded encounters were truncating in a squarish window). The size was
  left alone on a measurement; whether to raise it is his call.
- **Hover lost across a repaint (B34) — fixed session 47**, waits on him re-testing the medallion press.

A play queue rail landed in session 36 — a card queued during a replay leaves the hand for a numbered
row over the battlefield and flies from there (`tuning.layout.playQueue`).

---

## Files

| File | Holds |
|---|---|
| `FEEDBACK.md` | B6, A10 (fixed s47, waits on his pass), B32 (built s47, waits on Noodle's eye), B34 (hover carry, s47 — waits on Noodle re-testing the medallion press), S58-1 (the title-screen play button, built s58, waits on his eye). |
| `_archive/FEEDBACK-DONE.md` | B29 (closed s47). |
| `../reference/SCALING-01.md` | The honeycomb pixel. Read before adding any length. |
| `../reference/TRAPS.md` | "Layout, CSS and scaling" — 24 entries, all mistakes already made here. |

Live: `honeycomb-ui.js` (shared builders), `honeycomb-text-tooltips.js` (every sentence a tooltip
writes), `honeycomb-scene-*.js`, `honeycomb-overlays-*.js`, `scripts/css/honeycomb.css`.

---

## Rules this pathway must not break

- **Every length is a honeycomb pixel**; every provisional element is tagged `HC-PLACEHOLDER`.
- **SVG for icons, HTML+CSS for widgets.** Icons become drawn assets; widgets get restyled.
- **Every hover needs a touch path**: tap to read, tap again to act (`honeycomb.input.tapToAct`).
- **A tooltip never covers its anchor** (`honeycomb.tooltip.placementFor`) and outlives what it pointed
  at. Test [94] asserts zero overlap. Read `../Archive/TOOLTIP-PLACEMENT-01.md` before changing placement.
- **Tooltip sentences live in `honeycomb-text-tooltips.js`**, keyed by kind — never inline.
- **A helper the suite must see cannot live in `honeycomb-ui.js` or a scene file.** The suite does not
  load them. Put it in a content-side file.
