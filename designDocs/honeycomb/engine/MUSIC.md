# Music — how the three tracks were cut, and how they loop

Status document for `ENGINE.md` B12. It records what was measured, what was decided from the
measurements, and how to change any of it. It was written by an agent that **cannot hear**: every
claim below about how the music sounds is a measurement, and the one judgement that matters — whether
the joins are inaudible and the chosen bars are the right ones — is Noodle's, made with
`../tools/music/music-audition.html`.

---

## Files

| File | Holds |
|---|---|
| `honeycomb sound/music/title.mp3`, `combat.mp3`, `map.mp3` | The source songs. **Build inputs only; the game never loads them.** A release can leave them out. |
| `honeycomb sound/music/*.txt` | Noodle's listening notes, quoted below. |
| `honeycomb sound/music/loop/*.mp3` | **What the game plays.** Built; never edit by hand. |
| `../tools/music/music-loops.json` | The cut list: which seconds of which song, in what order. **Editing this file is how the music is changed.** |
| `../tools/music/build-music-loops.py` | Builds the loop files from the cut list, and proves each one. |
| `../tools/music/music-metrics.json` (and its `.js` twin) | What the build measured. Suite block [123] holds tuning to it. |
| `../tools/music/music-audition.html` | The listening bench. Opens from disk. Uses the game's real player. |
| `scripts/misc/honeycomb/honeycomb-music.js` | The player. |
| `tuning.audio.music` in `honeycomb-tuning.js` | Every number and every cue the player uses. |

```
python "!designDocs/honeycomb/tools/music/build-music-loops.py"          rebuild every track
python "!designDocs/honeycomb/tools/music/build-music-loops.py" map      rebuild one
```

The build needs `numpy`, `scipy` and an ffmpeg. There is no ffmpeg on this machine's PATH; the build
finds the one bundled inside the `imageio-ffmpeg` pip package, which is already installed.

After a rebuild, copy each changed `loopSeconds` from the build's output into
`tuning.audio.music.trackArray`. The suite fails until the two agree.

---

## What Noodle asked for

> There are three tracks. Title, which plays on game start until combat is triggered. Combat, which
> plays until victory or defeat. And Map, which plays when combat ends until another new combat begins.

> your task is to get the music nice, making it loop and and trying not to make it distracting [...]
> The music is AI generated, and there are parts of it I'm really not a fan of. [...] whatever solution
> you find has to not break syrup town's music while they're exploring the catacombs and all that.

His listening notes, one per song:

> **title:** starts slow, fine up to 1:24 then it's way too intense, ends at 2:35

> **map:** starts without actual music, just annoying noises until 0:23, good allthe way through to
> about 2:37 where it begins trailing off

> **combat:** Start is fine right from 0. Honestly great until about 0:48 where a droning starts to
> rise and when the beat drop it's a bit intense and uses distracting instruments but overall it's
> workable, completely unusably distractingly loud at 2:08

---

## What the measurements said

Every note of his shows up as a number, which is the reason the cuts below can be trusted to be in the
right places. Loudness is RMS over four-second windows.

| Song | Tempo | What was measured |
|---|---|---|
| title | 81.05 BPM | 0–11.9s is a quiet pad at −27 dB. An impact at **11.98s** starts the song proper, which then sits at −18 dB. At **84.5s** the level jumps 6 dB to −12 and stays there: this is his "1:24, way too intense". The song ends at 156s, his "2:35". |
| combat | 120.00 BPM, exactly 2.0s a bar | 0–48s climbs gently from −18 to −14.5 dB. From 48s a second layer enters, and 64–96s is the loud drop at −13. **96–128s is a reprise of 16–48s** (rhythm correlation 0.64 at a lag of exactly 80.000s), back down at −17, ending in a bar and a half of near silence. At **128.0s** the level jumps to −10: his "unusably loud at 2:08". |
| map | 82.00 BPM | Nothing but −36 dB noise until the music enters at **23.49s**, his "0:23". It then crescendos steadily for two minutes, −17.5 to −12 dB. **The song repeats itself every 40 bars exactly** (117.07s; similarity 0.65 between 26s and 143s). It winds down from 152s, his "2:37". |

---

## The cuts

Each track is a list of segments of its source song, played in order, the last wrapping onto the
first. All cut points sit on the song's own beat grid, 15–30 ms ahead of the downbeat so no transient
is cut in half, and every lap is a whole number of beats, so the pulse never stumbles at a join.

### title — one segment, 11.96s → 84.50s (72.5s, 98 beats)

Everything he called fine, and nothing else. The lap ends exactly where the song gets "way too
intense" — and the intense section opens with the **same impact** the song proper opened with at 11.98s
(the two downbeats match at 0.74 similarity, the highest of any pair tested). So the join is: the
build into 1:24 plays, and where the loud section would land, the impact lands instead and the calm
music follows. The file starts one bar **before** that join (`rotateSeconds`), so the first thing a
player hears is a short swell into the impact rather than twelve seconds of pad — his "starts slow".

### combat — two segments, 0.07s → 48.07s, then 96.07s → 128.07s (80.0s, 160 beats)

The 48 seconds he called "honestly great", followed by the reprise — the same material, which the
song itself returns to after the drop. The droning build, the drop and everything past 2:08 are gone.
The lap ends on the song's own bar and a half of near silence, a breath before the bass line starts
the lap again.

**The reprise was not covered by his notes**, which flag only 0:48, the drop and 2:08. If it turns out
to carry anything he dislikes, `combatShort` is already built: the first 48 seconds alone. Swap
`file: "combat"` for `file: "combatShort"` and `loopSeconds: 80` for `48` in
`tuning.audio.music.trackArray`. Nothing else changes. The cost is that a 48-second lap repeats six
times in a five-minute fight.

### map — one segment, 23.46s → 140.53s (117.1s, 40 bars)

From the moment the music enters, for exactly the 40 bars after which the song repeats itself. The
"annoying noises" and the trailing-off are both outside it. Two things are done to it that are done
to neither other track:

- **The old lap rings out under the new one for two beats** (`tailSeconds: 1.46`). The lap ends loud
  and begins quiet, and a hard cut from one to the other would be the single most noticeable thing in
  the track. Forty bars apart the harmony is the same, so the overlap is consonant.
- **A slow leveller halves the crescendo** (`leveler`). The song climbs 5.5 dB across the lap, which
  would make the join a 5.5 dB drop. The leveller reads loudness over eight seconds and moves gain by
  at most 3 dB, far too slowly to be heard working.

### Loudness

All three are mastered to the same **−19 LUFS** (EBU R128, measured by ffmpeg's own meter), peaks
under −1 dB. They were 3 to 7.5 dB apart before. `tuning.audio.music.volume` then places all three
at once against the sound effects; it is one number, currently `0.7`, **set without hearing it**.

---

## How a lap loops without a gap

`audio.loop` leaves a hole of a few tens of milliseconds every lap while the browser seeks back to
zero. Web Audio would loop sample-accurately but needs `fetch`, which a `file://` page is refused, and
holds fifty megabytes of decoded audio a track. So the game does neither.

Every loop file is **one full lap followed by a six-second post-roll that repeats the first six
seconds of the lap**. While the playing `<audio>` element is inside its post-roll, a second element is
started from the top and lined up against it. At that moment both are playing identical audio, so
swapping from one to the other over a third of a second cannot be heard — even if it lands late. It
does land late: a hidden browser tab is given one timer tick a second, and the post-roll is what
absorbs that. If a tab is frozen for longer than the whole post-roll, the file ends and the other
element picks the lap up where it stopped; that is one audible join, instead of silence.

All the musical work — which bars, where the splice falls, the ring-out — is done offline and is
sample-accurate. The browser is only trusted with the easy part. The build proves the promise the
player depends on: it decodes each finished mp3 back and correlates the post-roll against the head of
the file (0.999 or better on all four).

Where a browser ignores `audio.volume` (iOS Safari), fades become cuts made with `muted`.

### Measured in Chrome, not assumed

Both elements were routed into a Web Audio recorder on the audition page and the two recordings
cross-correlated across the changeover, for two consecutive laps of `combatShort`:

| Lap | Offset between the two in the AUDIO | What `currentTime` claimed | Longest silence |
|---|---|---|---|
| 1 | 1.3 ms | 13.2 ms | none (one sample) |
| 2 | 2.6 ms | 10.4 ms | none (one sample) |

Two things came out of that and both are in the code:

- **`currentTime` is noisier than the audio it describes**, by about 13 ms. So the tolerance
  (`handoff.toleranceSeconds`, 25 ms) sits above that noise: a corrective seek is for a start that was
  truly late, not for chasing a reading, and the latency the player learns from each lap is only half
  believed (`latencyLearningRate`).
- **Not every source can seek.** This project's dev server (python's `http.server`) does not answer
  Range requests, so Chrome reports `seekable` as 0 to 0 and sends every seek back to the top. The
  first version of the changeover seeked the incoming element into place and would have restarted it
  on every correction. The incoming element is now started **from zero, with no seek, on a timer of
  its own** aimed at the moment the lap ends, and seeks are used only where `seekable` says they work.
  The measurements above are of that no-seek path, which is the harder one. The seeking path (a
  throttled tab's late start) is covered by the suite only; neocities and `file://` both seek.

The suite's falsification pass (nine mutations, every one red) found the two defects that led here:
a check that could not fail, and a player that measured the incoming element's clock before it had
started running.

---

## Syrup Town's music

`sound.js` is untouched. While Honeycomb is mounted, the host's songs are **muted, not paused**, and
its next-song timer is stopped; on the way out they are unmuted and the timer restarted for what is
left of the song. Muting is deliberate: `sound.js` treats a paused song as proof that the browser
blocked autoplay, and its `fadeIn()` answers that by calling `omniToggle()`, which switches off music
**and sound effects**. `muted` is a property nothing in `sound.js` reads or writes.

The host's music switch and volume slider govern Honeycomb's music as well. The Music button in
Honeycomb's own menus moves Honeycomb's music while Honeycomb is running and leaves the host's song
asleep; on exit the host is put in whichever state the switch was left in. That path also fixed a
crash that was already there: pressing Music: On under a dev preview called the host's `unpauseAll()`,
which reads `playlist[0]` with no guard and throws when no song was ever started.

Autoplay: a browser that refuses to play before the first click is asked once, not every tick.
Every button in the game makes a sound through `platform.sound`, which is always inside a user
gesture, so that is where the music is retried. No listener was added anywhere.

---

## Not done, and why

- **Elite and boss tracks.** B12 named them; Noodle supplied three songs and specified three cues. A
  fourth track is one row in `trackArray` and one in a cue map.
- **Ducking under the long stingers** (`broken`, `exposedTorn`, up to nine seconds). Not asked for.
  It would be a `targetGain` below 1 for the length of the stinger.
- **A listen.** Nothing in this document has been heard by its author.
