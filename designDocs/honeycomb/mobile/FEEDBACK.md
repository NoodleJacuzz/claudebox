# Mobile — FEEDBACK

Mobile portrait, and being able to test on a phone at all.

Portrait is a different aspect ratio from the landscape target `../reference/SCALING-01.md` was measured against. The honeycomb-pixel work carries over; the layouts want re-measuring, not re-scaling.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins. Items were split out of the round-09 file in session 41 and moved
byte for byte — nothing was rewritten on the way.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `../CATCH-UP.md`. What the project is: `../BASICS.md`.

---

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

Measured at **375x812 portrait** while testing the aim drag (`../chessmaster/FEEDBACK.md` A25 stage 2).
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
`../lust_events/`, `../map_events/` and the rest node at once, and the desk previews it. *"Actually much
closer than expected"* matches `../reference/SCALING-01.md`: the honeycomb-pixel foundation carries
over, the layouts are re-measured.

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
