# Audio — finished feedback

Closed items from `../FEEDBACK.md`, quote and annotation together, newest first. Nothing here is open work.

---

### S57-1. The footsteps played on every step between nodes — FIXED (session 57) ☑

> The moving sound (footsteps on wood) was never meant to be played moving between nodes, it's far too long, it was for descending floors

`miscWalkingWood` (4.3 seconds) was on `nodeEnter` in `tuning.audio.fileMap`. It now belongs to a new event,
**`regionDescend`**, which `honeycomb.descendRegion` plays when the Descend button is pressed. Walking to a node
has no library file any more, so it plays the host's short `move` stem from `eventMap`, which is what it
played before the library existed. `regionDescend` is a "screen" moment (up to 6 seconds), which the
footsteps fit. Suite block [137].

### S60-1. Swapping Honeycomb sounds for Syrup Town ones — DONE (session 60) ☑

> I re-targetted the sound files myself, noticed that many sounds were distracting, wanted to replace them
> with syrup town sounds. Did I do it wrong?

The idea was right and the table was wrong. `tuning.audio.fileMap` only ever plays files from
`honeycomb sound/sfx/`, and it is checked first, so `lustGained: "sell"` and `partyShift: "move"` there
asked for files that do not exist and played silence. Syrup Town's own sounds come from `eventMap`, which
already said `sell` and `move` for both. The two `fileMap` lines were removed, so both events now fall
through to Syrup Town's sounds. A comment in `fileMap` says why they are missing.

**The three volume trims** (lewdSplort 0.55, lewdSquish 0.6, weaponBrutal 0.4) were a real by-ear choice
the suite was built to reject. They now live in a new `fileVolumeByEarMap`, which wins over the measured
`fileVolumeScaleMap`. The measured table holds the measured values again, so the suite checks those and
only asks that a by-ear value sits inside the trim range. A comment that had drifted above `leadInMsMap`
went back beside the trims, and a footsteps comment that had lost the start of a sentence was mended.
Suite block [143].

### S60-4. The outfit-change sound's delay — DONE (session 60) ☑

> Changing clothes sound has startup delay, altering leadInMsMap for it has no discernable effect from 380
> to 1600, am I using the wrong tuning tool?

No tool did this. `leadInMsMap` is a measurement of how much silence each file opens with. Its only reader
is the Broken cut-in, which starts its stinger early to land on the chain snap. Nothing used it to change
how a file plays.

New `tuning.audio.startAtMsMap`: a file named there starts that many milliseconds in, through a `#t=` media
fragment. `"!outfitChange": 380` skips its measured silence. That is the knob to change by ear. Suite block [143].
