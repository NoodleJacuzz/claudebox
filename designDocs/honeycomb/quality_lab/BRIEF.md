# Quality Lab — BRIEF

Written 2026-09-24 from Noodle's pitch (sent from his phone) and a read of the code. **Nothing is built.**
This is a standing brief: goals, the measured facts it rests on, the shape of the build and the rules.
Progress goes in `CATCH-UP.md`; the questions it leaves for Noodle are `FEEDBACK.md` Q1–Q8; guesses a
build session makes go in an inferences file (INFERENCES.md) that this folder does not have yet.

| File in this folder | Holds |
|---|---|
| `BRIEF.md` | this file: the pitch verbatim, what the engine does today, the design, the build order |
| `CATCH-UP.md` | where the work is. Update it as each phase lands |
| `FEEDBACK.md` | Noodle's words, and the eight decisions the design waits on |

Read `../BASICS.md` first. The Battle Lab this builds on is `../Archive/FEEDBACK-07.md` §A2 and
`../ui/FEEDBACK.md` A10; the animation vocabulary is `../Archive/POLISH-01.md` §3–4.

---

## 1. The pitch, verbatim

Noodle's text is quoted whole, in his order and spelling. Under each part is how it was read and what
in the engine already serves it. If an annotation and the quote disagree, the quote wins.

> Quality tuner pitch
>
> Basic idea: Create a scene to minimize friction allowing a human to:
> - Express subjective judgments through extremely simple inputs
> - Turn those judgments into precise timing data
> - Immediately replay the proposed changes
> - Preserve successful results as reusable game-feel data
> Use that data to:
> - Identify gaps in code vs actual player experience
> - Create known-good templates
> - Create robust default rules for handling animation assignment to cards

Four verbs for the human (judge, measure, replay, keep) and three uses of the data. The engine's own
shape makes the middle two cheap: combat is headless, the screen replays a log, and the RNG is
deterministic, so the same fight can be run twice and give the same log. What does not exist is any
named timing inside an action to measure against (§2.1), any record of when a beat was actually drawn
(§2.6), and any replay (§2.5).

> Problem context: As changes are made to Honeycomb's engine and features are added, there's a drift as
> the core game feel becomes less enjoyable in ways that are hard to describe.

The drift is real and some of it can already be pointed at. A party card's sound fires at the same
instant as its visual hit with the file's leading silence uncompensated, while an enemy move's sound
fires 420 ms before its hit. Neither side has a named "impact" moment, so every change to a beat length
moves the relationship between sound and picture without anyone deciding it should. §2.1 has the trace.

> Current solutions insufficient: The existing battle lab requires dozens of inputs to test a specific
> card, any test results must be translated, inserted into the game's code, then retested. Changing
> assigned animations and sfx per card requires active searching through the database. Bulk testing is
> unfeasible, and many edge cases involving lag or the move repeating are untestable.

Measured: six to eight inputs per single test from the title, four to test the same card again, no
replay, no persistence across a refresh, and no way to change a sound, pose or effect from inside it
(§2.4). A test result today is a number somebody types into `honeycomb-tuning.js` by hand.

> Final goal: A game-feel standardization system, allowing us to quantify previously untranslatable
> gaps, and creating templates an agent creating cards can pick from that carry proven relationships.

The template is a content table (§3.7): a card names one, or is given one by its shape, and the
resolver reads the offsets from it. That is what lets a card-writing agent pick a proven feel without
touching a number.

> Solution brief pitch: Quality Lab, a test scene that assembles a battle scene of 1-5x dummy allies and
> enemies, each assigned a single card to test an action and stress-test it in a group environment.
> A human user should be able to change the attack being tested and utilize all of the available test
> functions with minimal delay to allow for bulk testing.
> Pressing a begin button will (after a short delay), simulate an entire turn of the attack being used by
> allies, ally end of turn effects, the attack being used by enemies, then enemy end of turn effects.
> The user can make inputs during this process to align or calibrate various game factors, the process
> creates an exportable list of changes that will then be inserted into the codebase or tested live by
> replaying the sequence with the desired change.

Read as a MODE on the real combat screen with its own boot path, not a screen of its own (Q2). Noodle
ruled on this shape once already, for the Battle Lab: *"The window approach is unviable"*, use the
game's engine, nothing blocks the board, everything is picked by its picture. The lab stands on the
Battle Lab's seams (§2.4) and adds three things the Battle Lab lacks: a cycle driver, a tap recorder,
and a replay. The exportable list is §3.8.

> Important terms used hereon, defined to keep this document lean
> " The current action" - Whatever the player is currently testing. Primarily one of the game's cards,
> but can also refer to status effects and other end of turn triggers such as the passive damage of the
> Broken state.
> "The literal card" - The exact, actual card used to test the current action, in the majority of cases
> the current action and the literal card are the same. Progress in bulk testing must be preserved, so
> the literal card selected should persist if the game is refreshed.

Persistence is a new localStorage key of the lab's own (§3.3), never a save slot. The Battle Lab's
state lives in memory today and its fight is autosaved, which is a trap (§2.4).

> "User's input" - The user, likely a human tester, must use one of three viable input methods to
> deliver a recorded signal with exact measurements of the gaps between inputs. These input methods are
> pressing the spacebar, clicking, or tapping the screen for mobile devices, and should include the
> length the action was held (laying groundwork for future goals out of scope).

Called **a tap** below, whichever of the three made it. Each tap records `downAt`, `upAt`, `source`
(key, mouse, touch) and the beat that was playing (§3.6). The whole board is the tap surface during a
cycle. There is no keyboard handling anywhere in Honeycomb today, and `../REQUIREMENTS.md` §8 forbids a
document-level listener, so the spacebar is heard on `#honeycombRoot` itself (it needs a `tabindex`
and focus while the lab runs).

> "A cycle" - The sequence used for testing. 1-5 allies play the literal card in sequence, end of ally
> turn, the same amount of enemies play the current action in sequence, end of enemy turn. Entity count
> is essential for stress-testing in larger environments and to identify an acceptable margin of error
> in user expectations.

The cycle driver is §3.4. Two things it needs decided: who the dummy allies are (Q4: the recommended
answer is N copies of the card's owner, so owner-relative effects and poses are the real ones) and how
an enemy "plays the current action" when the action is a player card (Q3). Entity count also serves
the statistics: five allies is five samples of the same impact per cycle.

> "Attack animation" - The sequence of targets, meaning user pose changes, target pose changes, vfx
> overlaid onto the target, the vfx's position, sound effects, damage number appearance time and
> positions, and screen shake start time, assigned to the current action. Roughly equivalent to an
> event timeline.

Called **the action timeline** below, and it is the one engine change everything else stands on
(§3.2). Today all seven of those targets fire in the same JavaScript task at the start of a beat.

> "Targets" - Shorthand for the list of targets being assigned or calibrated for the current action.
> The scope of the first build of the quality lab is limited to sfx and, but the full list that will
> eventually need to be handled is defined above. Ideally with a thoughtful set of defaults to reduce
> need for user input as much as possible.

The sentence ends mid-list in the pitch (Q1). Read as sfx first; the recommendation is sfx and screen
shake for the first build, because both are pure timing and need no art. The defaults are §3.7.

> "testOverrides" - A possible name for the array used to store changes to targets in-game for live
> testing. Replay and Calibration tests should be able to test the current action with testOverrides
> changes active, and final output should be kept in a state where it can be injected into the game's
> code.

Kept as the working name; in code it is `honeycomb.presentationOverrideArray` (§3.8), following the
registry naming rule. The design's one hard requirement here: overrides are read by the SAME resolver
the live game uses, so a replay with overrides on is the game's real behaviour and not an imitation of
it. An exported override is a table row; injecting it is a paste.

> "Impact" - The golden variable(s) of each attack animation. Independent targets are primarily
> measured to help us find the impact timing of actions, as well as how far off

Also ends mid-sentence (Q1); read as "how far off each target is from it". The engine half-has the
idea: `honeycomb.combatScene.shakeForDamage` scales the shake by the bite taken and returns a hit
stop, so the moment of the damage beat IS the impact today. What is missing is the name, and offsets
measured from it.

> Test Functions:
> - Initial calibration
> Simplest test, no actions in background, measures delay between user's perceived input input and
> actual input as received. Suppose the tester is supposed to press every 500 ms. They produce 500,
> 538, 469...
> Searching for: Input offset variable, and confidence/variance measure.

This measures ANTICIPATION: tapping along to a predictable rhythm, where a person lands within a few
tens of milliseconds of the beat, early as often as late. It is the right baseline for Alignment
(tapping where an impact is expected). It is the wrong baseline for Calibration, where the tester
reacts to something already heard or seen: a reaction is 150–250 ms late by nature, and no rhythm test
predicts it. So there are two baselines (§3.5), both stored per device.

> - Performance Delay Test
> A mode to identify if there are gaps between the user's inputs during active play, especially
> important before inputs are actually used to align or calibrate other elements.
> During this mode, a metronome will be visible onscreen. The user must input at a steady rhythm and
> continue that rhythm as a turn plays out.
> Searching for: Irregularities in the user's input rhythm, suspected causes of poor performance.
> When finished, this should be saved to call upon outside of the quality lab as well, in case there are
> instances of player-perceived lag that cannot be measured by your systems.

Half of this exists as `honeycomb.perf` (§2.6): frame cadence, long tasks, and each replay's expected
against actual time, printed to the console by two debug actions. The lab adds the human on top of it,
correlates a broken rhythm with the beat that was playing and the long task that ran, and exports the
result. "Outside the quality lab" is a debug action usable in any fight, and, if Noodle agrees, a field
in the telemetry beacon (Q8). This half is also the top demo goal's missing instrument (§6).

> - Assignment
> The user selects the asset used for the literal card's target of their choice from a grid with a
> confirm button and search options. For poses and vfx, this should visually display the pose or vfx
> overlay. For sfx, this should be a grid of buttons that play the sound when selected.

Three pickers on the Battle Lab's picker pattern (§3.5). One prerequisite: sound assignment has two
sources of truth today and they disagree on 34 cards (§2.7, Q5). A grid that writes to one of them
while the other wins is worse than no grid.

> - Alignment
> A mode to determine the ideal timings and position for assigning aspects of an attack animation.
> The sequence begins and the user inputs at the time they expect the current target(s) to activate,
> then they may save to testOverrides.
> This can then be replayed immediately, using , replaying the sequence based on the data from the
> user's input.
> Searching for: The moment the current action should trigger an impact, how many impacts will trigger,
> and their distance from each other.

The core loop. Tap count per action gives the impact count, the median gap between taps gives the
multi-hit spacing, and the median tap position minus the anticipation baseline gives the impact time
(§3.5). Replay is a restore of the engine snapshot plus a second run (§3.4), not a re-walk of the log.

> - Calibration
> A mode to identify when the attack aspects are actually triggering from the player's perspective. The
> user inputs as soon as they hear the sound, notice the pose change, etc.
> Searching for: duplicated sounds, individual target assets needing more offset to match the impact

Needs the reaction baseline and a record of when each target was actually fired and drawn (§3.2). Two
of the pitch's findings can then be told apart from the human's noise: a sound whose measured onset is
late (a per-asset offset, saved once for every card that uses the file) and a sound that fired twice or
collapsed into another (the host's sound path drops any call within 50 ms of the last; §2.7).

> - Default Codification
> The list of cards and list of targets multiplied is unfeasible for completely comprehensive testing,
> some details must be assumed even for just templates, yet for example the moment a sound should play
> is not always the exact perfect moment for damage numbers to appear.
> Ie, sfx magicSlash has a brief moment of windup before individual moment that should line up with an
> impact. This is not the same as the audio file having leading silence.
> There are a number of other similar cases:
> - screen shake should generally trail impact by a few frames
> - multi-hit attacks should allow each impact to register visually and auditorily without creating a
> wall of vfx/sfx, usually with smaller vfx and lowered volume
> - attacks that hit every ally/enemy are usually better off impacting every ally/enemy at once
> - attacks that hit every ally/enemy yet are expected to travel in a 'wave' (like any Chess Piece
> attack, since they trigger each other as they go in sequence) are better off impacting each
> ally/enemy one-by-one
> A truly robust system must allow for individual targets to be micro-managed for extremely specific
> edge cases, but for the majority of cases an assumed relationship between each target and the impact
> should be found and directly codified as a default.

This is the most important section of the pitch, and the design takes it further than the pitch does:
codify FIRST, then use the lab to find the cards that break the default, rather than aligning cards
one by one and hoping a default falls out. The magicSlash distinction is exactly right and is a new
per-file number: `leadInMsMap` holds silence measured at 2% of peak; the windup after it is
`impactMsMap`, learned once per sound by Calibration and reused by every card that plays it. The four
bullets become the first four rows of the template table (§3.7). One of them cannot be expressed by
the engine today at all: every hit is its own 180 ms beat, so an all-enemies attack always plays as a
wave (§2.2).

> - Reference comparison
> Describes comparing the current action against a known-good template, using lab results to check
> whether an action is within expected deviations between target timings. Consistent deviations against
> a known-good template is an important tool for continual default codification and reducing automatic
> drift.

Two tools (§3.9): a report over exported sessions, and a suite block that resolves every card's
timeline and fails when one sits outside its template's tolerance. The second is what stops the drift
from coming back silently.

> Additional goals:
> All changes, assignment or alignment, must be testable within the scene, so that a bulk list of
> satisfactory changes can be exported, tested, or even inserted into the code.
> In all areas possible, the delay for the user to assign, align, and calibrate must be kept minimal
> due to the scope of the card pool needing to be tested, even with a robust set of defaults.
> The data from these sessions should be used to create templates for attacks to reduce game feel
> trouble in the future by assembling a large list of known-working features.

The pool is 313 player cards and 204 enemy moves. At one minute a card that is a working week, which
is why §3.7 puts defaults before bulk testing and §3.9 finds the outliers automatically.

---

## 2. What the engine does today

Read from the code on 2026-09-24, not run. File keys: `SC` `honeycomb-scene-combat.js`, `TU`
`honeycomb-tuning.js`, `KER` `honeycomb.js`, `ENT` `honeycomb-entities.js`, `ART` `honeycomb-art.js`,
`CARDS` `honeycomb-content-cards.js`, `BRK` `honeycomb-overlays-broken.js`, `LAB`
`honeycomb-overlays-lab.js`.

### 2.1 Where each target fires

`honeycomb.combatScene.playLog` (SC:3161) walks the log; each handler in `logHandlerArray` returns its
wait in unscaled milliseconds, and `honeycomb.duration` folds in the play speed.

| Target | Fired by | Party card | Enemy move |
|---|---|---|---|
| sound | `attemptPlay` calls `playSound` at SC:2601, BEFORE `playLog` at 2603; `honeycomb.cardSfxStem` → `platform.playStem` → `playFile` | t = 0 | t = 0 of `moveUsed` (SC:3614) |
| source pose, lunge | `cardPlayed` handler (SC:3462) → `playPresentation` → `swapPose(source, "offense", "hcActing", 800)` + `lunge` 260 ms | t = 0, handler returns 0 | t = 0 |
| target pose | `damage` handler (SC:3232) → `playHitReaction`: `hcHit` class + `swapPose(target, "damaged")` for `hitFlashMs` 180 | t = 0, same task | t = 420 (`enemyActionGapMs`) |
| number | `floatNumber` in `damage`; 900 ms, ±20 px scatter, rises 70 px | t = 0 | t = 420 |
| shake | `shakeForDamage` in `damage`; from 3 to 14 px by bite, 260 ms; `hitStopMs` 90 when the bite is ≥ 18% | t = 0 | t = 420 |
| vfx | `playVfx(targetId, path)` in `damage`; `tuning.vfx.defaultAttackPath` (`vfx/test-green`), 520 ms | t = 0 | t = 420 |

So the impact is implicit and different per side: the start of the beat for a party card, 420 ms in for
an enemy move. The only sound in the game timed to a picture is the Broken stinger, which subtracts
`soundLeadInMs("broken")` so the file lands on the chain snap (BRK:234–246). That is the precedent for
the whole design; nothing else compensates for leading silence, and `soundLeadInMs` takes an event
name, so it returns 0 for every card stem.

### 2.2 Multi-hit and whole-side attacks

Every hit is its own beat. The `damage` effect loops its targets and `dealDamage` logs one entry per
target (ENT:1559–1573); `repeat` re-runs its list; entries carry no action or group id. Each waits 180 ms
plus any hit stop, so a five-target sweep is a 900 ms wave, and "impact everyone at once" cannot be
asked for. Shipped multi-hit cards opt out of VFX with `vfx: "none"` (`severineRend`, CARDS:9233)
because the alternative is a wall of them. The attacker's pose plays once, on the action entry.

### 2.3 Presentation fields

`honeycomb.art.presentationFor` (ART:182–197): the card's `pose` and `animationArray`, else the type's
(`cardTypeArray`, CARDS:99–209: damage is offense + lunge, passive is passive + rise, the rest passive
with nothing), else `passive`. Hold: `poseHoldMs` on the card, then the character, then the pose's own
(`actionFrameHoldMs` 800 for offense, `hitFlashMs` 180 for damaged). Sound: the card's `sfx` field, then
`tuning.audio.cardSfxMap[index]`, then a type fallback. VFX: a `vfx` path on a damage effect entry,
copied onto the log entry, else the default. No card sets an `animationArray`; one enemy move does
(`capBruteWindUp`). Ordinary enemies have no `damaged` drawing (`enemySpriteSet` is combat and offense,
TU:312), so their hit is CSS only, which is `../vfx/CATCH-UP.md`'s unbuilt tilt-and-redden.

`playVfx` has no anchor, offset or delay; it centres on the whole fighter box, not the sprite, and its
first use of a file can lag because `vfx.prepare` is asynchronous. The card flying at its target
(`flyCard`, SC:4527) is dead code. `hitShakePixels` (TU:1887) is never read.

### 2.4 The Battle Lab

A mode on the combat screen (`honeycomb.lab.active`, class `hcLabMode`), opened by the `battleLab`
debug action. Its seams are the ones the Quality Lab reuses: `honeycomb.summonCombatant` (either side,
up to `tuning.scaling.enemyLimit`), `honeycomb.addCardToPile(index, "hand")` from a picker of every card
face, `honeycomb.changeIntent`, `honeycomb.applyStatus`, `honeycomb.setResource`, and
`combat.labNoEnd`, read only in `honeycomb.combat.checkEnd`. Its picker overlay is `labPicker`.

What it costs: six inputs to test a no-target card once from the title, eight for a targeted one, four
to test the same card again. It has no replay, no export, and no way to change a sound, pose or effect.
Its state is memory only, and the fight it edits is autosaved: after an End Turn, `honeycombSave0`
carries `labNoEnd: true`, and a reload brings the board back with no badge to clear it. Also found:
`honeycomb.lab.holdEnergy` is called from the scene's teardown and never defined;
`tuning.lab.reopenPollMs` and `reopenTimeoutMs` have no reader.

### 2.5 Replay and play speed

Nothing keeps a log after it plays, and the handlers move SHOWN state (`shownVitalsArray`, piles, the
hand), so walking a log twice applies it twice. Play speed (`tuning.animation.playSpeedArray`, 0.1× to
2.5×) reaches JavaScript timers through `honeycomb.duration` but not the CSS variables written at
TU:3371 and 3410–3417 (`--hc-hit-flash-ms`, `--hc-travel-ms`, `--hc-shake-ms`, `--hc-vfx-ms` and more),
not the literal 160 ms sprite transition, and never the audio; the four cut-ins return already-scaled
waits that `step()` scales again. **The slow-motion tool cannot be used to judge a relationship between
targets.** Until that is fixed (P3) the lab measures at 1× only.

### 2.6 The perf monitor

`honeycomb.perf` (KER:434–624): a `requestAnimationFrame` loop and a `longtask` observer, frame
cadence as the p10 interval, `missedFrames` and `droppedFrames`, and `recordReplay(label, expectedMs,
actualMs)` called from `playLog`. Console output only, through the `togglePerf` and `reportPerf` debug
actions. It knows when a replay was scheduled and when it ended; it does not know when any single beat
was drawn.

### 2.7 The sound seam and the assignment tables

`platform.playFile` (KER:50–62) makes a `new Audio` per call, never preloads, discards the play promise
and returns nothing. The host path for events with no library file (`soundEffectStart`,
`scripts/gameplay/sound.js:557`) holds one pending sound behind a fixed 50 ms timer, so two calls
within 50 ms play the last one only. `tuning.audio.cardSfxMap` (TU:911–1483) has 527 rows for 517
cards (10 orphans); 35 cards also carry an `sfx` field that wins over the row, and 34 of those disagree
with it. `../tools/sfx-report.js` audits the map, not the field. `leadInMsMap` is the first sample above
2% of the file's peak (`../tools/sfx-report.html`), and the time of the peak is never recorded. The
library is 45 stems in `honeycomb sound/sfx/`.

### 2.8 Input, scenes, persistence, export

No `keydown` anywhere; pointer type is read by capture listeners on the root and overlay host
(`honeycomb.input`); `../REQUIREMENTS.md` §8 allows listeners on Honeycomb's own elements only. A new
file is a line in `honeycomb-loader.js`'s `scriptArray` (suite block [142]). Modes are root classes
re-applied by `applyTuningToCss`. localStorage holds `honeycombSave<slot>`, `honeycombMeta<slot>` and
`honeycombTelemetryV1`; no dev key exists. Clipboard export exists in `saveTransfer.copy` (title
scene) with a selection fallback, and file download through a Blob (`.noodle`).

---

## 3. The design

### 3.1 In one paragraph

Give every action a named impact and schedule each target from it; stamp when each target was fired
and drawn; record the tester's taps against those stamps; run a fixed cycle from a saved setup and run
it again with overrides on, through the same resolver the live game uses; write what survives to the
asset, the template, or the card, in that order of preference; export it as the table rows it already
is; and keep a suite block that resolves every card and shouts when one drifts.

### 3.2 The action timeline

**Engine side (headless, suite-checked).** Every log entry an action writes carries `actionId`. Every
`damage` entry carries `hitGroup` (one id per resolution of a `damage` effect, shared by all its
targets) and `hitOrdinal` (which hit of the action). Written where the entries are logged; `repeat`
raises the ordinal. Nothing else in the engine changes.

**Screen side.** A resolver, `honeycomb.presentation.scheduleFor(action, hitArray)`, returns:

```
{ impactAtMs,                       // from the action entry's start
  hitGapMs, sweep: "atOnce"|"wave", // between hits, and how one hit's targets land
  sourcePose: { atMs, pose, holdMs },
  sfx:        { atMs, stem, volumeScale },       // atMs = impactAtMs − impactMs of the file
  targetPose: { atMs, pose, holdMs },
  vfx:        { atMs, path, anchor, scale },
  number:     { atMs },
  shake:      { atMs, strength },
  provenance: { tier, index } }                   // which tier answered each value
```

Each value resolves in order: **override** (`honeycomb.presentationOverrideArray`, §3.8) → **card or
move field** (`presentation: { … }`, only the keys it sets) → **asset** (`tuning.audio.impactMsMap[stem]`,
`tuning.vfx.impactMsMap[path]`, `tuning.vfx.anchorMap[path]`) → **template**
(`honeycomb.presentationTemplateArray`, §3.7, chosen by the card's `presentationTemplate` field or by
`honeycomb.presentation.templateFor(action)` from its shape) → **`tuning.animation`** defaults.

The three action handlers (`cardPlayed`, `moveUsed`, `abilityUsed`) ask for the schedule, fire the
source pose at 0, fire the sound with a timer at `sfx.atMs` the way the Broken stinger already does,
and return `impactAtMs` as their wait, so the damage beat lands ON the impact. The `damage` handler
plays a `hitGroup` as one beat when `sweep` is `atOnce` and staggers it by `hitGapMs` when `wave`;
shake, number and vfx fire on their own timers at their offsets. Multi-hit templates carry a `vfxScale`
and `volumeScale` per hit after the first. **Phase 0 ships with defaults that reproduce today's timing
exactly** (party impact 0, enemy impact 420, every offset 0), proven by a suite check, so the change
moves nothing until a template or a measurement says so.

**Stamps.** Each fired target calls `honeycomb.perf.recordTarget({ actionId, hitGroup, target,
scheduledAt, firedAt, paintedAt })`: `scheduledAt` when the timer was set, `firedAt` when it ran,
`paintedAt` from a `requestAnimationFrame` after the DOM write. For sound, `firedAt` is the Audio
element's `playing` event, which needs `playFile` to return the element (P2). The gap
`scheduledAt → paintedAt` is the performance signal, and it is measurable with no human present.

Put the resolver and the template table beside `honeycomb.art.presentationFor` if the suite loads
`honeycomb-art.js` (check the load list at the top of `../tools/test-honeycomb.js`); otherwise in a new
content-side file, honeycomb-presentation.js, loaded before the scene files. A helper in a scene file
is invisible to the suite.

### 3.3 The lab mode

Entered by a `qualityLab` debug action marked `quick` and `topBar`, and by a boot target
`"honeycombQualityLab"` in `scripts/index.js` beside the two existing ones (an additive host touch of
the kind already made; still note it in `../REQUIREMENTS.md`). Puts `hcQualityLabMode` on the root the
way `hcLabMode` is, on top of the Battle Lab's own mode, so its handles stay available.

**Persisted setup**, in one localStorage key of its own (`tuning.storage.qualityLabKey`, never a save
slot): the literal card, ally and enemy counts, the mirror action for the enemy side, the mode, the
device profile (§3.5) and the override array. A refresh comes back to the same card.

**On the board:** N copies of the literal card's owner on the party line (Q4), N enemies on the other,
`labNoEnd` on, victory and defeat suspended. A strip along the top edge that never covers a fighter:
the literal card as a face (press to open the Battle Lab's card picker), two count steppers, mode tabs,
BEGIN, and a results drawer that slides in after a cycle with REPLAY and EXPORT. Every control is at
least `tuning.qualityLab.tapTargetMinimumPx` on a side, in honeycomb pixels, because this is also the
phone test path (§6).

**The tap surface:** during a cycle a transparent layer inside `#honeycombRoot` takes every pointer
down and up; the root is focused and hears Space. Recording writes to an array and touches no DOM until
the cycle ends, so the recorder cannot cost the frames it measures.

### 3.4 The cycle driver and replay

`honeycomb.qualityLab.runCycle()`:

1. Snapshot the engine state (the save system already serialises mid-combat state and a reload of it
   continues to an identical result; use the same function in memory).
2. After `tuning.qualityLab.beginDelayMs`, for each ally in line order: put the literal card in that
   owner's hand, play it through `honeycomb.combat.playCard` on the target the template names (the
   front enemy unless the card targets otherwise), wait for `busy` to clear.
3. End the party turn: the ally end-of-turn beats play (statuses, Broken escalation), which is how a
   status or a tick is "the current action".
4. Each enemy telegraphs the mirror action (Q3) and the enemy turn plays; then the enemy end of turn.
5. Close the tap recorder, compute the mode's result (§3.5), open the drawer.

**Replay** restores the snapshot, rebuilds the screen with `scene.go("combat")`, and runs the cycle
again with the override array as it now stands. Determinism gives the same log; the screen shows the
changed timing. This avoids a second walk of a played log entirely (§2.5).

### 3.5 The modes

Each mode says what the tester does, what is recorded, what is computed, and what it may write.

**Baselines** (the pitch's Initial calibration, split in two; both stored in the device profile with
the user agent, the frame cadence and the date):
- *Anticipation.* A metronome at `tuning.qualityLab.metronomeMs`; tap along for
  `metronomeTapCount` taps. Computed: median offset from the beat and the spread (interquartile range).
- *Reaction.* A flash and a click at random intervals; tap when it happens. Computed: median latency
  and spread. Uses the click path the game's own sounds use, so the device's audio latency is inside
  the number.
Alignment refuses to write without an anticipation baseline; Calibration without a reaction baseline;
either refuses when the spread is over `baselineSpreadMaximumMs`.

**Performance Delay Test.** The metronome runs through a whole cycle; the tester keeps time. Recorded:
every tap, every beat's stamps, the perf monitor's frames and long tasks. Computed: each interval's
error against the metronome; an interval past `hitchThresholdMs` is a hitch, and the report names the
beat kind that was playing and any long task inside it. Writes a session record (§3.6), never an
override. Also exposed as a `quick` debug action in any ordinary fight, so a hitch Noodle feels on his
own play can be caught where it happens.

**Assignment.** Three pickers on the `labPicker` pattern, closing on the choice: sfx (the 45 stems
grouped by family, a press plays the stem), pose (the owner's sprite set, drawn), vfx (each file over a
sample sprite), with a search box. Writes an override for the literal card; a toggle writes it for the
template or the asset instead (Q6). Needs P1 first.

**Alignment.** The tester taps where each impact is expected. Computed per action: impact = tap − the
anticipation offset − the action's start stamp; taps per action = impact count; median gap between
taps = `hitGapMs`; the median over the cycle's N actions is the value, the spread the confidence.
Below `minimumSamples` taps the drawer shows the number and refuses the save. Writes `impactAtMs`,
`hitGapMs`, `sweep`. Replay is one press.

**Calibration.** The tester picks the target being judged (sound, target pose, number, shake, vfx)
and taps when it is perceived. Computed: perceived = tap − the reaction latency; error = perceived −
that target's `firedAt` (or `paintedAt`); a tap with no fired target near it, or two audible onsets
against one schedule, is reported as a duplicate or a drop. Writes the target's offset to the asset
tier by default (`impactMsMap[stem]` for a sound), because a sound's windup belongs to the file and
not to the card that happened to play it.

### 3.6 Records

```
deviceProfile { userAgent, cadenceMs, anticipationMs, anticipationSpreadMs,
                reactionMs, reactionSpreadMs, measuredAt }
tap           { downAt, upAt, source: "key"|"mouse"|"touch", beatType, actionId }
session       { mode, literalCard, allyCount, enemyCount, overridesActive: [...],
                stamps: [...perf.recordTarget], taps: [...], result: {...}, deviceProfile }
override      { subject: { tier: "card"|"move"|"asset"|"template", index },
                target: "sfx"|"sourcePose"|"targetPose"|"vfx"|"number"|"shake"|"timeline",
                field, value,
                provenance: { mode, samples, median, spreadMs, measuredAt, device } }
```

Times are `performance.now()` values on one clock; `Date.now()` never appears in a stamp.

### 3.7 Templates and defaults

`honeycomb.presentationTemplateArray`, a content table. First rows, from the pitch:

| index | Chosen for | Offsets it fixes |
|---|---|---|
| `strike` | one hit, one target | impact at the lunge's middle; shake trails by `shakeTrailMs`; number at impact |
| `flurry` | more than one hit | `hitGapMs`; `vfxScale` and `volumeScale` under 1 after the first hit |
| `sweep` | one hit, a whole side | `sweep: "atOnce"` |
| `wave` | a whole side, in sequence (Chess Piece attacks, anything that triggers along a line) | `sweep: "wave"`, `hitGapMs` |
| `rise` | no damage: a power or a buff | no impact; the pose and its sound only |
| `tick` | a status tick, the Broken spiral | `poisonTickMs`-shaped; no source pose |

`templateFor` derives one from the action's shape (hit count, target reach, whether it deals damage)
when the card names none; a `presentationTemplate` field on the card wins. Every number in a row is a
tuning-style named field. The pitch's `shakeTrailMs`, `multiHitVfxScale` and `multiHitVolumeScale` go
in `tuning.animation` and the rows read them.

The order of preference for writing a result is asset, then template, then card. A per-card override is
for the edge case the pitch names, and the report (§3.9) lists every card that carries one, so their
number stays visible.

### 3.8 Overrides and export

`honeycomb.presentationOverrideArray` is in memory and serialised into the lab's storage key. EXPORT
copies two things to the clipboard (and offers a file, on the `.noodle` pattern): the session record
as JSON, and the override array rendered as the table rows it maps to, ready to paste:
`impactMsMap` entries, `presentationTemplateArray` rows, `presentation` fields for cards. The game never
writes a file (it must run from `file://`); a session pastes the rows, runs the suite, and clears the
override. An override that has been pasted and an override that is still live are the same shape, which
is the point.

### 3.9 Reference comparison

Two instruments. A node tool, compare.js in a new quality-lab folder under `../tools/`, reads
exported sessions and the live tables and
prints, per card, each target's offset against its template's, flagging anything past
`tuning.qualityLab.toleranceMs`, plus every card carrying a per-card override. And a suite block
resolves the schedule of every card and enemy move headlessly and fails when a value falls outside its
template's tolerance or a template names a stem or path that does not exist. The second is the
drift guard; the first is the reading list for the next alignment session.

### 3.10 Prerequisites the sweep found

Each is small, independently worth doing, and something the lab would otherwise measure as its own
fault. Each ends in a check.

- **P1. One source of truth for a card's sound** (Q5). 34 of the 35 `sfx` fields disagree with their
  `cardSfxMap` rows and the report audits the wrong one.
- **P2. `playFile` returns its Audio element and takes a delay**; sounds are decoded once and kept, so
  a stem's first play is not a hitch; the host path's 50 ms single slot is documented on the seam.
- **P3. Play speed reaches everything or nothing**: the CSS duration variables scaled in
  `applyTuningToCss`, the literal 160 ms transition tuned, audio either scaled or the speed panel
  saying it is not, the cut-ins scaled once. Until then, measure at 1×.
- **P4. A named impact with behaviour-preserving defaults** (§3.2, Phase 0).
- **P5. `hitGroup` on damage entries**, so at-once is possible.
- **P6. `playVfx` takes an anchor and an offset**, and anchors on the sprite, not the fighter box.
- **P7. The Battle Lab's autosave leak** (`labNoEnd` written to `honeycombSave0` with no way back
  after a reload), the undefined `lab.holdEnergy`, the unread `reopenPollMs`/`reopenTimeoutMs`, the
  dead `flyCard`, the unread `hitShakePixels`.
- **P8. `honeycomb.perf` gains per-target stamps and a copy-to-clipboard**, and its report gains
  the device profile.

---

## 4. Rules for the builder

1. **Every number is in `tuning.qualityLab`** or a named field on a template row. Beat lengths stay in
   `tuning.animation`.
2. **No document or window listener**, keyboard included. Space is heard on the root while it has focus.
3. **The resolver, the template table and the override array live where the suite can load them.** The
   scene owns DOM and timers only.
4. **Noodle's three Battle Lab rulings hold here**: nothing blocks the board, everything is picked by
   its picture, the handle is on the thing.
5. **Overrides never bypass the resolver.** If the lab can show a timing the game cannot ship, the lab
   is lying.
6. **Measure at 1× until P3 lands**, and say so in the drawer.
7. **A write needs a baseline and enough samples**; the drawer prints the median, the spread and the
   count beside every value it offers to save.
8. **Every length is a honeycomb pixel**; every control clears the phone minimum.
9. **The lab's storage is its own key.** It never writes a save slot, and it never leaves the fight it
   built in the autosave (which is P7's bug, and must not be repeated).
10. **Phase 0 changes nothing visible.** Its suite check proves today's timings resolve unchanged.
11. **Comments are lean and quote nobody.** His words are in this folder's `FEEDBACK.md`.
12. Each phase ends in checks in a new numbered block at the end of `../tools/test-honeycomb.js`, and
    each check is made to fail before it is recorded as passing.

---

## 5. Build order

**Phase 0 — the timeline, no UI.** P4, P5, P2, P8, and the resolver with its override array and
template table. Checks: every card and move resolves; the resolved defaults equal today's timings for
a party card and for an enemy move; an override wins over a card field, a card field over an asset,
an asset over a template; an override round-trips through JSON; `hitGroup` is shared by every target of
one `damage` effect and differs between two; `playFile` returns an element; the document-listener
count is still the `error`/`unhandledrejection` pair.

**Phase 1 — the mode and the cycle.** The debug action and boot target, the storage key, the board
setup, BEGIN, the cycle driver, snapshot and replay, the tap recorder, the drawer, EXPORT. Checks: a
cycle from a persisted card runs with no taps and ends; two runs of the same setup give byte-identical
logs; a replay with an override changes the resolved schedule and nothing in the log; an export pastes
back into an identical override array; the recorder adds no DOM node during a cycle.

**Phase 2 — the modes**, in the order the pitch's dependencies impose: Baselines, the Performance
Delay Test, Alignment, Calibration, Assignment (sfx first). Checks per mode on synthetic tap arrays:
the arithmetic of §3.5 (a known offset in, the same offset out), the refusal below `minimumSamples`,
the refusal without a baseline, a duplicate detected from two onsets against one schedule.

**Phase 3 — codification.** The template rows filled from the first sessions, the compare tool, the
drift guard block, and the template table handed to `../rework/cards/` as the field a new card sets.

Phases 0 and 1 are one session each. Phase 2 is one mode per session, and each mode is usable on its
own. The prerequisites P1, P3, P6 and P7 can be done by any session at any point.

---

## 6. What this gives the other workstreams

- **`../performance/` B16, the top demo goal.** Per-beat `scheduledAt → paintedAt` stamps and a human's
  hitch log, exportable, on a phone, from a boot target: the measurement path that file says is missing.
  The device profile is a candidate telemetry field (A8, Q8).
- **`../mobile/` A12.** A URL-style boot straight into a fight with whole-screen tap targets is the
  "large-hit-target test path" that item asks for before the phone re-test.
- **`../vfx/` B13 and `../art_pipeline/` B21.** A vfx picker with anchor and offset, the at-once
  sweep, and the flurry scaling are the assignment half of the VFX workstream, on real timing.
- **`../audio/` B9–B11.** The sfx grid replaces searching the table, `impactMsMap` is the number the
  library has been missing, and P1 ends the two-sources problem.
- **`../ui/` B6, the hand.** The same recorder and stamps apply to the hand's feel once the cycle can
  include a draw and a drag; not in scope here, but the instrument will exist.
