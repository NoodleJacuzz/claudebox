# Test suite — FEEDBACK

The overhaul of the suite. What it tests today is `../tools/test-honeycomb.js`; the measurements are in `CATCH-UP.md`.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `CATCH-UP.md`. What the project is: `../BASICS.md`.

---

### S64-1. Test Suite Overhaul ☆ — FILED 2026-09-25

Noodle, in the housekeeping message that set the second demo's gate (`../BASICS.md`, the second demo),
the first of the early-stage blockers, *"the ones where leaving them for later would create a ton of
headaches"*:

> - Test Suite Overhaul
> Desperately needs to become more agnostic to prevent us from changing systems, to be rebuilt after we can be sure all legacy content weighing us down is cut. A lot of the decisions you make are influenced by wanting to confirm behavior that could break a test, but the session fills up, and I have to remember to carry that mostly unrelated issue with me into the next session. This is likely how many matters get left behind.

**Read as:** the suite today prevents systems from changing, because so many of its checks are pinned to
particular content; rebuild it agnostic once the card pool cut has removed the content it is pinned to.
`CATCH-UP.md` measures the size of that (about 265 content-pinned lookups, blocks organised by session,
a crash instead of a skip when an asset folder is absent) and proposes a two-stage order, since the cut
turns those checks red on the day it lands and the rebuild cannot wait for a green suite that the cut
itself makes red. **⏸ His yes on the two stages**, or a different order.

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
