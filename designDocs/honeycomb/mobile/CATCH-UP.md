# Mobile — CATCH-UP

Mobile portrait, and being able to test on a phone at all. Project-wide context is `../BASICS.md`.
The queue is `FEEDBACK.md`.

---

## Where it stands

**Closer than expected, and blocked on ergonomics rather than on layout.**

Mobile **landscape** has been a real target since session 6 and is a measured, faithful scale-down of
the desktop — every length is a honeycomb pixel (`--hc-px`). `../reference/SCALING-01.md` holds that
work, and its parity numbers are landscape numbers.

**Portrait was added to the demo scope in session 38 and is a different target.** A portrait phone is a
different aspect ratio, not a smaller one, so the layouts want **re-measuring, not re-scaling**. The
honeycomb-pixel foundation carries over; the layouts do not.

The real blocker is that Noodle will not run the re-test while the build is painful to drive on a
phone. Buttons are small **on purpose** — mobile sizing comes after the UI is finished — so they will
not be fixed on the way. What is needed first is a **large-hit-target test path**: a way to reach a
state on a phone quickly enough to measure it. That makes this a blocker on the top demo goal too, and
it shares a pass with `../ui/` B29 (the debug win button).

---

## Files

| File | Holds |
|---|---|
| `FEEDBACK.md` | A12 (the phone test path), the Move button's tap target, and Noodle's 2026-09-25 items: S64-1 landscape size buffs, S64-2 portrait styling (zoomed battlefield, drag to pan, image over text). Both are on the second demo's gate. |
| `../reference/SCALING-01.md` | The honeycomb pixel, and the landscape parity measurements. |

Parity check: `node "!designDocs/honeycomb/tools/audit-scale-parity.js"` — proves a phone-sized copy
matches desktop. Browser.

Compare against `!designDocs/honeycomb/!imageStorage/screenshots/desk vs mobile/`.

---

## Rules this pathway must not break

- **Every length is a honeycomb pixel.** `calc(N * var(--hc-px))` in CSS, `honeycomb.cssPixels` in JS.
  Never a bare `px` or `rem`, and never `+ "px"`.
- **"It scales down faithfully" is not an acceptable assumption.** A session asserted it once without
  measuring and Noodle had to disprove it with screenshots. Measure.
- **The host page hands down fixed pixels** — Syrup Town's `html`/`body` set `line-height: 24px`.
- Noodle plays in a **wide window (~1878×804)**. Check layout changes at that aspect as well as 1280×720.
