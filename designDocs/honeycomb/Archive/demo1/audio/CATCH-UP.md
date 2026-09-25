# Audio — CATCH-UP

Sound effects and music. Project-wide context is `../BASICS.md`. The queue is `FEEDBACK.md`.

---

## Where it stands

**Cards and stingers are assigned and mixed. Music is built (session 50) and waits on Noodle's ear.
Enemies and descent are not assigned.**

**Music: read `MUSIC.md`.** Three looping tracks (title / combat / map) cut from Noodle's three songs
to his listening notes, played by `honeycomb-music.js` from `honeycomb sound/music/loop/`, every number
and cue in `tuning.audio.music`, held by suite block [123]. Syrup Town's songs are muted (never paused)
while Honeycomb runs and handed back on exit; `sound.js` was not edited. To change WHAT plays, edit
`../tools/music/music-loops.json` and rebuild; to hear it, open `../tools/music/music-audition.html`.

Honeycomb maps onto Syrup Town's existing sfx library through `tuning.audio.eventMap`, reached only
via `honeycomb.platform.sound` / `playFile` — the one host seam. `../tools/sfx-report.js` audits every
assignment against the measured durations in `../tools/sfx-metrics.json` and currently prints 22 findings.

Three gaps, all in `FEEDBACK.md`:

- **No short movement stem.** Five Cinder movement cards stand in with `miscCreak` (1.0s). A
  dash or footstep one-shot under a second is the one real hole in the library.
- **Four files are too quiet at source** to reach target even at maximum trim: `lewdSquish`,
  `lewdSlap`, `!outfitChange`, `lewdSwallowing`. They want re-rendering louder, not re-trimming.
- **Music wants a listen.** The agent that cut it cannot hear. The three things to check are listed
  under B12. Elite and boss tracks are not built; nobody has supplied songs for them.
- **`miscSnap.mp3` is new in the library, measured session 50, and assigned to nothing.** It is a
  0.09s click in an 8s file, 8.6 dB under target (its trim is pinned at the 1.6 ceiling), which makes it
  the fifth "too quiet at source" file. Whether it is the short movement stem is Noodle's call — see B9.
  The same session fixed `../tools/sfx-report.html`, whose library path had been one level short since
  the session-41 move and could measure nothing.

---

## Files

| File | Holds |
|---|---|
| `FEEDBACK.md` | B9–B11 (sound) and B12 (music). |
| `MUSIC.md` | The music: measurements, the cuts and why, the gapless changeover, the host hand-off, what is not done. |

```
node "!designDocs/honeycomb/tools/sfx-report.js"            assignments, gaps and volume findings
node "!designDocs/honeycomb/tools/sfx-report.js" --trims    prints a fileVolumeScaleMap block
node "!designDocs/honeycomb/tools/sfx-durations.js"         rebuilds tools/sfx-metrics.json
python "!designDocs/honeycomb/tools/music/build-music-loops.py"   rebuilds the loop files from music-loops.json
```

Sound effects live in `honeycomb sound/sfx/`; the music the game plays in `honeycomb sound/music/loop/`.

---

## Rules this pathway must not break

- **All host contact goes through `honeycomb.platform`.** Never call a Syrup Town sound function directly.
- **Every number is named.** Volume trims and durations belong in tuning or in `sfx-metrics.json`,
  never inline.
- **An assignment is a table entry**, in `tuning.audio.eventMap`.
