# Progression rework — FEEDBACK

The six per-character trees: what a node does, what it costs, and what it hands out.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins. Items were split out of the round-09 file in session 41 and moved
byte for byte — nothing was rewritten on the way.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `../../CATCH-UP.md`. What the project is: `../../BASICS.md`.

---

### B23. Early deck-customization pricing ☐

> Early deck customization is more dangerous than I realized. Remove attack and remove defense need to
> be expensive nodes, extra attack and extra defense though can be very cheap.

| Node | Price |
|---|---|
| Remove attack | expensive |
| Remove defense | expensive |
| Extra attack | very cheap |
| Extra defense | very cheap |

The asymmetry is the point: **thinning a deck is far stronger than padding it**, so subtraction gets
priced like a payoff and addition gets priced like a convenience. This is progression-tree pricing and
lands in the same pass as B4. Prices are numbers — `honeycomb-tuning.js` or a named field on the node's
content-table entry, per the standing rule.

**VERIFY** that these four node types exist as distinct authored nodes rather than as one generic
deck-edit node.

---

### B4. Distribute unlockables through the game ☐

`progressionArray` with global/personal pools, ranked/exclusive nodes and `unlockOutfit` is the seam.
What is missing is authored nodes naming cards, outfits, equipment and relics. Overlaps B1, and now
carries **B22's relics** and **B23's repricing**.

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../../FEEDBACK.md` instead)*
