# Engine — ARCHIVE

Closed items from `ENGINE.md`, newest first, pasted here the minute they close: quote and annotation
together, unchanged. Nothing here is open work. Items closed before 2026-09-25 are in `../Archive/demo1/`, at the
old folder's path.

---

### B43. Slowdown in the first moments after a refresh, after the art pass ☑ — CLOSED 2026-09-25 — 2026-09-22

> Likely the final issue on the matter, I noticed a lot of slowdown the first few moments after
> refreshing, likely loading the new images in. Are we in for more reports of performance issues?

**Measured the same day, in the browser pane, not on player hardware.**

- **The new art is not heavier.** The default outfits hold 100 pictures, 10.4 MB and 139 megapixels,
  against 105, 10.8 MB and 143 megapixels before the art pass. Poses are 1216 tall now, smaller than the
  650x1300 stand-ins they replaced.
- **The boot** loads 121 images, 2.1 MB, most of it card frames and card art, and has one long task of
  212 ms (the scripts starting). Teambuilding and the first fight added no long tasks at all.
- **What costs time is fetching, not drawing.** On a local server a 15 KB portrait took 600 to 1250 ms to
  arrive, because it queued behind the boot's other requests. A player's first visit pays that over the
  network.
- **The likeliest cause of what Noodle saw is a cold cache.** Every character picture changed at once,
  so the first load after the pass downloaded and decoded all of them fresh. Later loads read them from
  the browser's cache. A player's first visit is always cold, and was before the art pass too.
- **The largest pictures are the cut-ins.** Every `1-broken`, `2-broken` and `recover` is 1664 or more
  wide by 2432 tall, 4 to 4.7 megapixels, about four times a pose. They are not loaded at the start; they
  are decoded the first time a cut-in plays, which is a possible stutter at the moment a character breaks.
  Writing them at 1216 tall (they are never drawn taller than the screen) would make each a quarter of
  the size. Offered to Noodle, not done.

**Cut-ins done, same day.** Noodle: *"Yes, please do size the cut-ins to a reasonable amount, 1216 would be
fine."* `png-to-webp.py` now writes `1-broken`, `2-broken` and `recover` 1216 tall (`CUT_IN_NAME`), and all 17
were re-converted: 1.56 MB together, each a quarter of its former pixels. Both cut-ins size themselves as a share
of the screen and the recover windows are percentages of the picture, so nothing moved on screen.

**Closed 2026-09-25.** Measured the same day it was raised (a cold cache, not heavier art) and the one action it produced, the cut-ins written at 1216 tall, was done. Nothing else was asked.

---
