# Mobile support — `mobile/`

Mobile landscape and portrait, and being able to test on a phone at all. Noodle's pipeline **Mobile
support**; on the second demo's gate as:

> - Mobile landscape size buffs (Make the game more playable on mobile.)
> - Mobile portrait styling (Zoomed in battlefield view, drag to pan across screen, events with images over the text instead of to the side of it, actually much closer than expected)

*"Even stuff like mobile portrait support, since that's actually a hugely loyal part of my playerbase."*

**How this file works.** One file per pipeline: where the work is, the rules, then the queue in Noodle's
words. When an item closes, cut its `###` section and paste it at the top of `ARCHIVE.md` beside this
file, the same minute. `../FEEDBACK.md` indexes the count. Quotes are his, verbatim, and win over any
annotation. Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted.

---

## Where it stands

- **Landscape** is a measured, faithful scale-down of the desktop: every length is a honeycomb pixel
  (`--hc-px`), and `../reference/SCALING-01.md` holds the parity numbers. The buttons are small on purpose;
  the sizing pass was always meant to come after the UI settled, and S64-1 is that pass.
- **Portrait** is a different aspect ratio, not a smaller one, so the layouts are re-measured, not
  re-scaled. His design for the battlefield, 2026-09-25: *"while dragging a card the camera pans in the
  direction the user is dragging in allowing them to play cards on allies and enemies."*
- **The blocker under both is the phone test path** (A12): he will not run a phone test while the build is
  painful to drive there, so a large-hit-target way to reach a state comes first. The one number measured
  so far is a 57 x 16 tap target on a portrait phone.

## Files

| File | Holds |
|---|---|
| `MOBILE.md` | this file |
| `ARCHIVE.md` | closed items from this file |
| `../reference/SCALING-01.md` | the honeycomb pixel and the landscape parity measurements |

Parity check: `node "!designDocs/honeycomb/tools/audit-scale-parity.js"` (browser). Compare against
`!designDocs/honeycomb/!imageStorage/screenshots/desk vs mobile/`. Noodle plays in a wide window,
about 1878 x 804; check layout changes at that aspect as well as 1280 x 720.

## Rules this pipeline must not break

- **Every length is a honeycomb pixel**: `calc(N * var(--hc-px))` in CSS, `honeycomb.cssPixels` in JS. Never a bare `px` or `rem`, never `+ "px"`.
- **"It scales down faithfully" is not an acceptable assumption.** Measure.
- **The host page hands down fixed pixels** (`line-height: 24px`); the hosts restate them in honeycomb pixels.
- **Every hover needs a touch path**: tap to read, tap again to act. A `title=` attribute never appears on touch.
- **No document or window input listener; pointer capture on Honeycomb's own elements** (`../REQUIREMENTS.md` §8). The camera pan must not fight the card drag or the aim drag.
- **Reduced motion is a tuning switch**, and a phone with animations removed still resolves every cut-in.

---

## The queue

### A12. Phone re-test — BLOCKED ON ERGONOMICS (session 39) ⏸→☐

> Phone testing really needs to be Easier. Buttons are small (intentional, mobile size adjustments
> happen after all ui is done).

Not a refusal — a real blocker. He is not going to run the re-test the top demo goal needs while the
build is painful to drive on a phone, and the small buttons are a deliberate sequencing choice
(mobile sizing comes after the UI is finished), so they will not be fixed on the way.

The way through is **a test path that does not need the real UI to be finger-sized**: a debug overlay
with large hit targets, a URL parameter that boots straight into a fight, or the `cadence` monitor
readable without navigating menus. That is a small build and it unblocks both A12 and the top demo
goal, so it is worth doing before the re-test rather than asking him again.

Standing notes for whenever it happens: the idle cost found was the nameplate lightning timer (now a
compositor animation); reduced effects also lost the fighter art's blurs; the reticle wobble is fixed.
The monitor prints `cadence`: **~33ms (~30Hz) means a battery saver is capping the page**, not the game
— trust `missed` over `dropped`. The loading screen is deleted; do not look for it.

---

### A piece's Move button is a 57x16 tap target (session 43) ☐

Measured at **375x812 portrait** while testing the aim drag (`../Archive/demo1/chessmaster/FEEDBACK.md` A25 stage 2).
The gesture itself works on touch — reticle, arrow, legal marks and commit all fire from a
`pointerType: "touch"` pointer, and the honeycomb root is `touch-action: none` so the browser does not
steal the drag as a scroll. **What does not work is hitting the thing in the first place.**

`.hcGolemMove .hcAbilityOption` renders **57 x 16 CSS pixels** on a portrait phone. Common guidance is a
44 x 44 minimum. The ability rows behind a medallion are the same shape.

**Not fixed, on purpose.** `../BASICS.md` records that the small buttons are deliberate and that mobile
sizing comes after the UI is done, and the demo scope notes mobile portrait "needs a large-hit-target
test path first". This is a measured instance of exactly that, recorded so the sizing pass has a number
to work against rather than an impression.

Related and already known: the Move row explains why it is dim with a `title=` attribute, which never
appears on touch — so on a phone a dim Move gives no reason at all.

---

### S64-1. Mobile landscape size buffs ☆ — FILED 2026-09-25

Noodle, in the housekeeping message that set the second demo's gate (`../BASICS.md`, the second demo),
where he calls mobile *"a hugely loyal part of my playerbase"*:

> - Mobile landscape size buffs (Make the game more playable on mobile.)

**This is the sizing pass A12 said comes after the UI is done**, now scheduled. Every length is a
honeycomb pixel, so the pass is a per-viewport size table in tuning rather than a restyle; the 57 x 16
Move button above is the first number to work against, and 44 x 44 is the floor to aim at. It still
wants the large-hit-target test path first, or the measuring is done on a desktop pretending.

---

### S64-2. Mobile portrait styling ☆ — FILED 2026-09-25

> - Mobile portrait styling (Zoomed in battlefield view, drag to pan across screen, events with images over the text instead of to the side of it, actually much closer than expected)

Three pieces, in his order: **a zoomed battlefield** with **drag to pan** (a viewport over the board;
the pan is a drag on Honeycomb's own root, pointer capture and no document listener, and it must not
fight the card drag or the aim drag), and **the event window re-flowed** with the image above the text.
The event window is one overlay that every event kind renders through, so the third piece serves
`../events/`, `../events/` and the rest node at once, and the desk previews it. *"Actually much
closer than expected"* matches `../reference/SCALING-01.md`: the honeycomb-pixel foundation carries
over, the layouts are re-measured.

---

## Unsorted — drop new reports for this pipeline here

*(a report that does not clearly belong to this pipeline goes in `../FEEDBACK.md` instead)*
