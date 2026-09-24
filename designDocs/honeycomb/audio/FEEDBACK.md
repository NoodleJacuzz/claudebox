# Audio — FEEDBACK

Sound effects and music. `../tools/sfx-report.js` is the audit; `platform.sound` / `playFile` is the seam.

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

### B9–B11. Sound ☐

- **No short movement stem.** The five Cinder movement cards stand in with `miscCreak` (1.0s). A
  dash/footstep one-shot under a second is the one real gap in the library.
- **Four files are too quiet at source** to reach the target even at maximum trim, and want re-rendering
  louder: `lewdSquish`, `lewdSlap`, `!outfitChange`, `lewdSwallowing`. `../tools/sfx-report.js` flags them.
- **Enemy and descent sfx** are still unassigned; cards and stingers are done.
- **`miscSnap.mp3` appeared in the library (found session 50) and is assigned to nothing.** Measured:
  0.09s audible in an 8.04s file, 160ms lead-in, −27.6 dB — a click, 8.6 dB under target, trim pinned at
  the 1.6 ceiling. It is now in `sfx-metrics.json`, `leadInMsMap` and `fileVolumeScaleMap`, which cleared
  the suite's one standing failure. **It was NOT assigned to the Cinder movement cards**: session 21's
  lesson is that a filename is not a reason, and only Noodle knows what he made it for. ⏸

---

### B12. Music ⏸ built session 50 — waits on Noodle's ear

Map, battle, elite and boss OSTs, and how to loop one without replaying the whole song.
`platform.sound` / `playFile` is the seam; an `<audio>` loop with a crossfade point is the known shape.

**Session 50.** Noodle supplied three songs and his listening notes, and set the task:

> Honeycomb, I choose you, Fable! To help me with music and sound effects for the game.
> So, your task is to get the music nice, making it loop and and trying not to make it distracting, however there are some really huge restrictions which is why I'm setting the strongest AI model on this job. The music is AI generated, and there are parts of it I'm really not a fan of. Not only that, but we're working alongside Syrup Town, I apologize in advance for making you read my awful self-taught music code, but whatever solution you find has to not break syrup town's music while they're exploring the catacombs and all that. Syrup Town's music is contained in scripts/misc/sound, and the music I got for the game is in honeycomb sound/music.
>
> There are three tracks. Title, which plays on game start until combat is triggered. Combat, which plays until  victory or defeat. And Map, which plays when combat ends until another new combat begins. In that folder are txt files from me listening to it and trying to find parts I dislike or identify if it starts too slowly. I don't know if I can, but if needed I may be able to get other songs, but I can't promise they'll be of higher quality.

*(His path is slightly off: the host's music code is `scripts/gameplay/sound.js`.)*

Built, wired, and held by suite block [123]; **`MUSIC.md` is the whole account** — what was measured,
where each song was cut and why, how a lap loops with no gap, and how Syrup Town's music is set aside
and handed back. No line of `sound.js` was changed. No other songs are needed: every part he disliked
is outside the cuts.

**What waits on him**, because the agent that built it cannot hear:

1. Open `../tools/music/music-audition.html` and press each gold button. A join that cannot be picked
   out by ear is a pass.
2. **The combat reprise (1:36–2:08 of the source) was not covered by his notes.** If he dislikes it,
   `combatShort` is already built — two values in `tuning.audio.music.trackArray`, given in `MUSIC.md`.
3. `tuning.audio.music.volume` (0.7) was set without hearing it against the sound effects.

Elite and boss tracks were named in the original item and are not built: three songs were supplied and
three cues specified. A fourth track is one row in `trackArray` and one in a cue map.

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
