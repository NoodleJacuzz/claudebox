# TOOLTIP-PLACEMENT-01 — the panel that covered the thing it described

**A post-mortem.** The progression tree's node tooltip could be painted over its own node. It was
reported more than once and "fixed" more than once without the placement rule ever changing. This
records the symptom, the diagnosis, the real fix and the regression test, so a future session can tell
that it was fixed rather than assume it.

**Status: fixed (session 29).** `honeycomb.tooltip.placementFor` is a pure placement function that will
not cover the anchor; `honeycomb.tooltip.position` and `progressionScreen.positionCardPreview` both use
it; block **[94]** proves it over a grid of positions, panel sizes and viewports.

---

## 1. The symptom

Hovering a node whose tooltip is taller than the node's distance from the top of the screen (Set Stance,
Brace, the Ability nodes) made the tooltip clamp to the top edge and **cover the node it was explaining**.
Noodle: *"Some of the defensive improvement nodes, specifically Set Stance, are not displaying when the
node is mid-screen because the tooltip is too large."* Brace behaves differently only because its node
group is wider (the name sits under the circle), so hovering the right-hand side can put the pointer
outside the panel's covering band — the same bug, a slightly different box.

Measured on a fresh profile, 1280x720, hovering every node of all six trees:

| node | node rect (y) | tooltip rect (y) | node covered |
|---|---|---|---|
| `netAbility1` | 328–384 | 8–426 | 100% |
| `clmAbility1` | 328–384 | 8–404 | 100% |
| `briAbility1` | 328–394 | 8–353 | 37% |

The failing set moves with the tab's scroll position; the node Noodle named is whichever one is
mid-screen at the time.

## 2. Why it happened

`honeycomb.tooltip.position` considered only two axes: below (or above, by `preferBelow` for the tree),
then the other, then it clamped `top` to the screen margin. It never tried a **side** placement and it
never checked its result against the anchor's rectangle. A panel taller than the anchor's top offset was
therefore parked at the top of the screen, directly over the node.

## 3. Why it was reported fixed before

- **Session 27 (FEEDBACK-07 §G3).** Noodle wrote: *"just in case the tooltip is covering the blocked node
  itself."* The response made the blocked branch draw as a red line instead of a dimmed one — a
  **cosmetic workaround** so the covered node's block preview could still be read. The placement was not
  changed. This is the earlier mention.
- **Session 25 (CATCH-UP).** The documented "flips above the tooltip when there is no room below" fix was
  to `positionCardPreview` — the separate large **card preview** panel, a different panel with a different
  symptom. The text tooltip's placement was still untouched.
- **Session 29.** A `fitToViewport` scale-to-fit was added for *"a panel taller than the whole screen."*
  The failing panels are 293–418px on a 720px screen, so the condition never triggered
  (`tipNatural === tipH` in the measurements). The verification only asserted the panel was *inside the
  viewport* — true — and never that it did not *intersect the node*. The bug was reported fixed while
  still present, and the docs recorded it as closed, which is why the next report read as a regression.

**The recurring mistake.** A proxy was tested instead of the symptom ("is it on screen" instead of "does
it cover the thing"), the proxy passed, and the result was reported as a fix. A screenshot of a
non-failing node was treated as proof.

## 4. The fix

`honeycomb.tooltip.placementFor(anchor, panel, viewport, preferBelow, gap, avoidArray)` — pure geometry,
no DOM:

- Generates candidates in preference order: below, above, right of the anchor, left of the anchor
  (each side both top-aligned and vertically centred).
- Clamps each candidate to the viewport margins.
- Returns the **first candidate that overlaps none of `avoidArray`** (the anchor by default); if every
  candidate overlaps, the least-overlapping one, so the panel is never parked off-screen.

`honeycomb.tooltip.position` measures and calls it. `progressionScreen.positionCardPreview` calls it
with `avoidArray = [tooltip, node]`, so the card preview can land on neither the tooltip nor the node.

## 5. The regression test

Block **[94]** (`test-honeycomb.js`), all pure-function:

- The exact measured regression cases (mid-screen tall panel; an Ability node; Brace's wide anchor box).
- Above-by-default tooltips.
- A **grid** over viewport heights `{720,500,375}` × widths `{1280,1024,812}` × anchor top positions ×
  panel heights `{120,260,418}` × both preferences, asserting zero overlap in every cell.
- A fitting placement stays inside the margins; an oversized panel still returns finite numbers.
- The card preview avoids both the tooltip and the node.

The assertion is `overlapArea(placement, anchor) === 0` — the condition that was missing every previous
time. It is geometry, so it runs headlessly and cannot be satisfied by "it looked fine."

## 6. Rule for next time

When the complaint is "it covers / it is hidden / it does not display," assert the **intersection between
the two rectangles in question**, not a proxy like "is it inside the viewport." If the rule is not
expressed as a pure function, it cannot be tested, and an untested rule is the one that regresses.
