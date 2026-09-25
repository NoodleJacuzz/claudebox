# Honeycomb — Feedback round 07, COMPLETED ITEMS (archive)

Everything from `FEEDBACK-07.md` that is finished, moved here so the live file only holds open work.
**Quotes are Noodle's, verbatim.** The ☐ markers under the round-06 quotes were written before the work
landed; each is ☑ now, and what was done is in the session logs at the top of this file.

---

## Session 14 log (B → D → C)

Worked the priority order B → D → C. Everything below was tested headlessly after each change, and the
browser was used to confirm the visual ones. The items whose annotations are not written into their own
section yet are listed here:

- **B1 — combat presentation, all five.** (1) A played enemy move now marks its telegraph SPENT
  (`entity.intentSpent`), so a mid-turn repaint -- the Matriarch's Brood/Swarm summoning her brood --
  no longer redraws the card she just cast. (2) The broken spiral is INSTANT: `tuning.lust
  .brokenEscalationInstant` makes its health loss, lust gain and beat cost no wait, so End Turn does not
  stall. (3) A broken fighter's shatter is LUST now (`vitalsShareArray.lustOverfull`), recoloured pink
  (`.hcVitalsLustOverfull .hcPlateBolt`), and the gold tHP overflow is suppressed while broken. (4)
  Hovering a party member at rest steps them forward (`.hcDepthFocus:not(.hcBusy) .hcSide-ally
  .hcFighter:hover`). (5) A once-per-fight half-health cut-in: `honeycomb.halfHealthOverlay`, fired by
  `honeycomb.checkHalfHealthCutIn` from the damage pipeline, showing the character's HURT tier art.
- **B2 — forecasts and cards.** The Carapace tHP double was `vitalsShareArray` adding the forecast's
  pending gold to the already-landed gold; it now shrinks as it lands and a forecast gain no longer
  shatters the bar. Cleave/Beguile: random lust is spread to every candidate as a might
  (`potentialLust`), so Beguile alone marks every member's tooltip, not only the one the dry run picked.
  Vertical cards print their rules over the art, so they now carry a dark wash behind the text. The
  tooltip debug key is on the debug panel's toggle; the single tooltip-text table is still to do.
- **B3 — teambuilding.** Details sections fold (click the title; `hcFolded`); the Weaknesses title
  pulses while folded and there is a Rank Up Notification or Event Ready. Severine's three Thirst orbs are
  now three separate buff slots, each with its own tooltip.
- **D0 — quick wins.** Campfire and victory card pickers use `size: "medium"`. Severine's Transfusion uses a
  new `allyOther` target mode that excludes its user. Adjacent enemy intent cards stagger. Ability rows
  in the detail sheet print their requirements and spend. A finished fight is no longer "in a fight",
  so reward offers show a broken member's real cards. The rank-growth cap is confirmed present and
  tested. Cinder's ally-move wording is the one open item -- see its note below.
- **D1 — reports.** A new `orphanStatus` warning rule reports any status no hook, condition or engine
  flag reads. `tuning.art.enemySpriteScale` is a dedicated enemy scale. The shipped party ceiling is 3,
  with 6 behind the debug panel's `allowLargeParty` toggle. The debug panel gained Open the shop and
  Toggle six-slot party; Debug Tools moved up the title menu. The hand cap of 10 is confirmed.
- **C — performance.** Both of Noodle's named fixes: `honeycomb.preload.warmCommon()` warms the common
  art in the background at boot (plus `decoding="async"` on every image), and
  `tuning.animation.overlapEnemyCardRead` plays the enemy's pose and hit underneath the card reveal
  instead of waiting for it, so reading the card costs the turn no wall-clock.

---

## B. Open issues carried over from round 06

### B1. Combat presentation

> There should be a once-per-battle effect the first time a character reaches half-health, having their damaged sprite in focus in front of the screen similar to the frontmost layer of the broken animation, but shorter and without all the background elements.
☑ (from 06) — done session 14, see the log above

> Mousing over a player character while the hand is down/not dragging a card/at rest should bring them forward into focus to make their detail more visible and nameplate more easily clickable.
☑ (from 06) — done session 14, see the log above

> When broken, the visual temporary health overflow effect should be blocked, but lust should have its own overflow effect which is nearly identical but based on lust overflowing the maximum hp, and the lightning should be recolored pink. 
☑ (from 06) — done session 14, see the log above

> The passive damage from being broken should not be triggering like poison, it should instantly trigger on hitting end turn so not to delay gameplay.
☑ (from 06) — done session 14, see the log above

> Cards the enemy are playing should probably be removed from their previews, otherwise it seems like they'll cast it again. Matriarch casting swarm while her minions act is the most notable example of this
☑ (from 06) — done session 14, see the log above. Related, still unconfirmed: the "Matriarch casted Embrace … the forecast shows another 40 lust
incoming until the end of her turn" half of the round-06 Embrace report is likely this same thing.

### B2. Forecasts and tooltips

> The tooltip health and lust forecast not recognizing the enemy about to cast cleave and beguile, possibly because they are all-hitting and random respectively?
☑ (from 06) — done session 14, see the log above

> While casting Carapace, Matriarch has 2 tHP and is set to gain 14 tHP. Her tHP briefly reads +16, then +30, then +16 again. The bug could be that she's getting double the printed value? Or is it a forecast bug?
☑ (from 06) — done session 14, see the log above. This is the same shape as the round-07 report below ("Forecasted temporary health when
matriarch casts Carapace…"), so the two should be solved together.

> Vertical cards are a bit hard to read.
☑ (from 06) — done session 14, see the log above

### B3. Teambuilding and roster

> Teambuilding's details tab should allow for folding of the categories. The weaknesses category name needs to glow while folded if Event Ready or Rank Up Notification though.
☑ (from 06) — done session 14, see the log above

> Split severine's orb mechanic into three separate buff slots, it's too hard to mouseover and check each individual one.
☑ (from 06) — done session 14, see the log above

---

## C. Performance: "choppy, and slow to load" (from 06, item 24)

> Last piece of feedback I got was "Game feels choppy, images took a long time to load", this test was done many sessions ago. 
> Checklist of things to do/check/try:
> First priority: *You* try and estimate what factors could be causing a "choppy" play experience and add them to the list. Do not act on these immediately, build the list first. These two first ideas are mine.

Image load times delay gameplay online. 
**Potential solution**: Loading screen to preload images.

Enemy attack behavior. Current behavior on enemy turn is 
1. Enemy plays their card
2. Delay for player to read the card
3. Enemy animation triggers
4. Attack effect occurs
Each happens in sequence, none sequentially. 
**Potential solution**: Have the delay to read the card occur synchronously while steps 2 and 4 play out behind it.

**◐ THE LIST (session 12).** Noodle's first priority: estimate the causes and write them down before acting.
Nothing below has been changed; it is a reading of the code as it stands, ordered by how likely each is to be
felt, with where it lives.

*Known already (Noodle's two):*
1. **Images are fetched lazily, at the moment they are shown.** Nothing is preloaded. A fighter's sprite, a
   card's art, a backdrop and a UI frame are all plain `<img src>` emitted fresh on every scene build
   (`honeycomb.imageTag`, `honeycomb.js`; fighter art in `honeycomb-art.js`). Online, the first draw of each
   is a network round-trip, so a new card or enemy visibly pops in mid-animation. The nine-slice UI frames are
   the only thing probed ahead of time (`ui.loadFrames`). → the loading screen Noodle named.
2. **The enemy turn is a strict sequence, and the read-pause is the longest part.** `moveUsed` shows the card
   and waits `enemyCardRevealMs + enemyCardHoldMs` (260 + 700) before `playPresentation` fires the lunge, and
   only then does the `damage` entry play. Three separate waits in a row per enemy
   (`honeycomb-scene-combat.js`, the `moveUsed` handler). With several enemies this is the bulk of a turn's
   wall-clock. → overlap the read with the pose and the effect, as Noodle proposed.

*Added by reading the code (not acted on):*
3. **Combat repaints rebuild the whole screen from `innerHTML`.** Every `afterBeat` calls `repaint()`, which
   re-serialises the battlefield sides, the entire hand bar (every card), and the top bar
   (`honeycomb-scene-combat.js`, `repaint`). Re-emitting the same `<img>` tags re-triggers image decode and
   relayout and throws away and rebuilds DOM nodes, a classic source of frame drops. `updateVitals` already
   redraws only a plate; the same idea is not applied to the hand or the sides.
4. **Forced synchronous reflows.** Several places read `void element.offsetWidth` to restart an animation
   (`holdClass`, `swapPose`, the hand hint, the fan). Each forces layout; several per beat on a full board is
   measurable. `getBoundingClientRect` is also called during drags and forecasts (`drawBeam`, `placeMember`,
   `measureSlots`), each a layout read.
5. **Forecasts run the real action and roll the world back.** Hovering a card, aiming, or reading a Lewd card
   dry-runs the effects for real and restores a snapshot (`honeycomb-forecast.js`). Correct and deterministic,
   but it is CPU work on the hover path, and the snapshot/restore copies a large object. On a phone this is
   hover lag.
6. **Expensive CSS effects, un-gated by device.** `backdrop-filter: blur()` on every overlay
   (`.honeycombOverlay`), a blurred cover copy behind every full-bleed backdrop (`.hcEventBackdropFill`),
   `drop-shadow` filters on sprites, and many simultaneous CSS animations. Blur is GPU-heavy on mobile; there
   is no reduced-effects path.
7. **No `will-change` / compositor hints beyond the hand cards.** `.hcCard` has `will-change: transform`, but
   fighters, plates, floating numbers and VFX elements animate transforms/filters without a hint.
8. **Many small DOM writes per beat.** Floating numbers, drain trails, nameplate rebuilds, mechanic widgets
   and the hand-motion FLIP all append/remove nodes mid-replay (`floatNumber`, `renderLustPeeks`,
   `handMotion`). Each is cheap alone; together they are the "busy" moments.
9. **The boot payload is large and synchronous.** ~1.5 MB of JS across ~30 files plus a large stylesheet, all
   parsed at load, and `honeycombBoot` runs the warning report and content reconciliation before the first
   frame. The first paint waits on all of it.
10. **The boot has no explicit image `decoding`/`loading` attributes.** `<img>` tags carry neither
    `loading="lazy"` nor `decoding="async"`, so off-screen art competes and a large image can block the main
    thread while it decodes. A cheap, low-risk win once the list is acted on.
11. **`honeycomb.duration` multiplies every wait by the play speed; at the default there is no "fast"
    fallback.** A "skip what the player has already seen" pass is a possible later lever.
12. **(New in session 13)** The VFX key is now an SVG filter (offline-capable), which is GPU work per effect;
    keep an eye on many simultaneous effects on a phone.

◐ The list is built; nothing acted on yet. The two solutions Noodle named are the first things to try.

**BOTH NAMED SOLUTIONS LANDED (session 14).**
- **1 (image load times) — a background preload, not yet a blocking screen.** `honeycomb.preload.warm
  Common()` runs once at boot and warms the UI/card frames, every card's art and every character's and
  enemy's basic sprite; `honeycomb.imageTag` and `honeycomb.art.chainTag` now emit
  `decoding="async"`. The count lives on `honeycomb.preload` for the debug panel to show. A true
  loading SCREEN that blocks the first scene is the remaining half, and this is the layer it would sit on.
- **2 (enemy turn sequence) — the read overlaps the animation.** `tuning.animation.overlapEnemyCardRead`
  (on) plays the enemy's pose and its hit underneath the card reveal instead of waiting
  `enemyCardRevealMs + enemyCardHoldMs` first, so reading the card costs the turn no wall-clock. Off
  restores the strict sequence.
- **Items 3, 4, 6, 8, 11** (repaint rebuilds, forced reflows, blur effects, per-beat DOM writes, no fast
  fallback) are untouched and remain the next levers.

**A PHONE STUTTER REPORT, AND THE INSTRUMENT FOR IT (session 14 follow-up).** Noodle reported stutter on
a phone, worst when grabbing and dragging a card. Rather than guess:
- **`honeycomb.perf`** (toggled from the debug panel: "Toggle performance monitor" / "Report performance")
  records frame intervals, `longtask` blocks, each replay's EXPECTED vs ACTUAL duration, and every drag
  move's cost, while the player plays. The summary prints on the debug panel and the full report to the
  console.
- **`audit-turn-time.js`** drives the same measurement from a script: a fresh fight, twenty repaints,
  twenty held-card forecasts, forty hit tests, a real sixty-move drag, then a whole turn -- so desktop and
  a phone-sized pane can be compared.
- **What it found (desktop, headless):** a repaint is ~2.8ms, a held-card forecast ~0.1ms, a hit test
  ~0.01ms, and a whole drag move ~0.23ms. The game's own per-event JS is LIGHT; the overruns (38-72ms per
  replay phase) are scheduling latency, not game work. So the phone stutter is most likely paint/composite
  or the boot preload, not the drag logic.
- **Fixes made anyway:** the preload is now BATCHED (6 at a time, 140ms apart) and skipped on a metered
  or 2G connection; the drag reticle moves on `transform` (composited) instead of `left`/`top`; and
  hover-forward is gated behind `@media (hover: hover) and (pointer: fine)`, so a touchscreen's stuck
  fake `:hover` cannot step a fighter forward under a dragging finger.
- **To confirm on the device:** run the debug monitor on the phone and read the summary. High `longtask`
  counts or a frame worst well over 33ms with low replay overruns point at the device's paint, not the
  game; high `replay overrun` with low drag cost points at the replay; high `drag avg` points at the
  pointer path.

**PHONE REPORT AND THE PAINT PATH (session 14, second pass).** Noodle ran the monitor on the phone:
`frames avg 21.3ms, worst 275ms, dropped 309 | long tasks 5 (worst 85ms) | replay overrun worst 82ms |
drag avg 1.30ms worst 18.00ms`. The reading:
- **Only 5 long tasks but 309 dropped frames** = the main thread is NOT the bottleneck. The jank is
  paint/raster/composite, which is exactly what a phone's GPU does worse than a desktop.
- **replay overrun 82ms** is barely above desktop's 72ms, and **drag avg 1.30ms** is only ~5x desktop's
  0.23ms, so neither the replay nor the drag JS is the cause.
- Two additions: the monitor now attributes dropped frames to **drag / replay / idle** in the summary
  (`dropped N (drag X, replay Y, idle Z)`), and the preload also warms each fighter's HURT tier and the
  default attack VFX, since a mid-fight sprite swap is a main-thread fetch+decode.
- **`hcReducedEffects`** (root + overlay host; `honeycomb.reducedEffects`, tuning
  `performance.reducedEffects` = `true`/`false`/`"auto"`) drops the mobile-heavy paint: the full-screen
  overlay `backdrop-filter`, the blurred backdrop cover copy, fighter `filter` TRANSITIONS (the transform
  transition stays), the held card's double drop-shadow, and the aiming arrow's dash animation. Auto-on
  for a coarse pointer or a low-memory device. The debug panel's **Toggle reduced effects** forces it for
  an A/B on the device.

**SECOND PHONE REPORT — IDLE IS THE CULPRIT (session 14).** Two more runs: `dropped 561 (drag 148,
replay 135, idle 278)` and `dropped 215 (drag 23, replay 16, idle 176)`. **Idle dominates both.** The
game stutters while the player is not touching anything, so the cost is ambient and continuous, not the
drag or the replay. Noodle also noted "animations playing at lightning speed, but some parts slower than
others" — the signature of a collapsing frame rate: time-based CSS animations jump between keyframes
(fast) while `setTimeout`-driven beats fall behind (slow). It is a symptom of the jank, not a speed bug.
- **The cause found: the nameplate's continuous pulses.** `.hcPlateTemporary`, `.hcPlateLust`,
  `.hcPlateRecovering`, `.hcPlateLoss`, `.hcPlatePotential`, `.hcPlateHeal`, `.hcPlateTemporaryPending`
  and `.hcPlateLustPending` all animate `filter: brightness()` / `opacity` on an INFINITE loop. A filter
  animation repaints its element every frame; a full board has a dozen of them, so the whole scene (and
  the blurred backdrop behind it) re-composites continuously with nothing happening. The reduced-effects
  path now sets all of these (plus the shatter chips and the medallion glow) to `animation: none`.
- **The monitor's summary now reports the frame COUNT and the drop RATE**, e.g.
  `dropped 561/1200 (47%: drag 148, replay 135, idle 278)`, since raw counts cannot be compared between
  runs of different lengths. The debug panel's state row also prints `reduced effects ON/off` and
  `perf monitor ON/off`, so the toggle is no longer a guess.

**THIRD PHONE REPORT — STILL IDLE, WITH REDUCED EFFECTS ON (session 15).**

> frames 1148, avg 34.2ms, worst 208ms, dropped 504/1148 (44%: drag 82, replay 70, idle 352) | long tasks 0
> (worst 0ms) | replay overrun worst 72ms | drag avg 1.98ms worst 22.50ms
>
> I can still feel the lag. There's also this crosshair thing when dragging the cards, but it wobbles a lot
> from side to side.

- **Measured, not guessed.** On a still board with reduced effects on, `document.getAnimations()` was empty
  and a wrap of `setTimeout` / `requestAnimationFrame` over 3s found ONE thing running: `honeycomb.ui
  .advanceBolts`, the nameplate lightning, every 90ms. Every plate past 100% (any tHP at full health, so
  most of a turn) had it. Each tick swapped a class, which repainted the plate AND the drop-shadowed
  fighter art under it: about 11 repaints a second, all turn, the likely source of the idle drops.
  **Fixed:** the flicker is now a baked CSS loop (`ensureBoltKeyframes`, `boltSequence`,
  `tuning.art.nameplate.boltSequenceLength`) animating `opacity` with `step-end`, which the compositor runs
  with no main thread and no paint. Same rule (never the same frame twice running), each plate at its own
  hashed phase. Test [58] checks the loop and its seam.
- **The fighter art's blurred drop-shadows** (the resting shadow, plus the targeted / hit / flash / rise
  glows, through a 180ms `filter` TRANSITION) re-blur a full-height sprite on every frame of the drag
  and the hit. Reduced effects now drops the blur, keeps the brightness, and snaps the filter. The art
  STATES' inline filters (Bolstered, Empowered, Broken) gained `reducedFilter`, since an inline filter
  outranks the stylesheet. Legal-target glows are kept for legibility.
- **The crosshair wobble was a real bug** from the last session's `transform` change: the pulse animates
  `scale`, which the browser applies INSIDE `translate` but OUTSIDE `transform`, so the pointer offset
  was scaled too. Measured at x=900: the old rule swung the reticle 122px left and back every pulse; now
  0. It moves on the `translate` property.
- **The monitor now reports the display's CADENCE** (fastest tenth of frames), the median, and
  `missed` (frames over 1.5 cadences). Avg 34.2ms with 0 long tasks also fits a page CAPPED AT 30Hz
  (battery saver / low power mode), where half of perfectly on-time frames count as ">33ms drops". The
  next report settles it: `cadence ~33ms (~30Hz)` means the cap, not the game.
- **Next lever if it is still felt:** the card frames are 1992×2540 and drawn at ~110 px wide (on a
  phone, under a `hue-rotate` filter per card). A downsampled copy (e.g. 498×635) would cut decode
  memory 16× and the raster cost of every hand re-raster (hover, drag scale). Not done: it is an asset
  change and needs Noodle's say.

---

## D. Bug / feedback reports (round 07) — completed

### D0. Quick wins

> Campfire card resizing now prevents you from reading the original card. They will need to be made medium.
☑ (session 14) `size: "medium"` in the campfire upgrade picker.

> Victory card previews should be medium sized so you can more easily read them.
☑ (session 14) `size: "medium"` in the victory reward offer.

> Severine should not be able to use transfusion on herself.
☑ (session 14) Gate the target (a `notSelf` target-mode flag, or an effect condition).


> Some enemies block other enemy's intent cards (IE cap brute standing to the left of another enemy).
☑ (session 14) Layout: a per-enemy intent offset in `placementArray`, or stagger the intent slot.

> Oftentimes the ability descriptions in the detail section lack explanations of the requirements to use them
☑ (session 14) The requirements are already listed ticked/crossed on the ability menu hover; the detail section should
print them in words too (reuse `abilities.usability` / the ability text generator).

> When broken, all of that character's cards in the rewards show as broken: There needs to be some kind of way to view the non-broken and broken version of cards. This is likely something we will need to brainstorm rather than implement blindly.
☑ (session 14) **The leak is the quick part**: the broken swap is gated on being in a fight (`brokenSwapActive`), so a
reward outside combat should never show the broken form — find why it does. The "view both versions" idea is
the design question in D1.

> Cap the amount of growth a weakness can have at a single rank each run: I think this may already be implemented?
☑ (session 14) Confirm and close: `tuning.lust.maximumRankGainPerRun` (1) clamps, `profile.lustRankGainArray` counts.

### D1. Reports

The orphan-status warning rule, from "There are way too many statuses in the game" (the quote and its
open content half stay in the live file):
☑ **Done (session 14).** `honeycomb.warningRuleArray` gained `orphanStatus`; `honeycomb.warnings
.statusIsRead` counts a status as read when it has hooks, when a condition/value names it, when it
carries a flag in `tuning.warnings.statusReaderFieldArray` (taunt, sanctified, turncoat), or when it sets
`engineReads` (artifact). The shipped content reports zero orphans. The status-prose half of this item
(stop naming single-card passives) is content work for the card redesign, not done here.

> Forecasted temporary health when matriarch casts Carapace makes it look like she's gaining the tHP right away, and the forecast lingers after she gains the health making her look like she's doubling it.
☑ (session 14) Same bug as B2's Carapace report.

> forecasted tHP should not trigger the overflow effect
☑ **Done (session 14).** `vitalsShareArray`'s `overfull` now reads the temporary HP that has actually
landed, not the forecast's pending gain, so the shatter cannot appear before the gold does.

> Enemies need a dedicated scale variable
☑ **Done (session 14).** `tuning.art.enemySpriteScale` multiplies the battle layout's own enemy sprite
height through `--hc-enemy-scale`, so every enemy can be grown or shrunk from one number without touching
a layout or an individual enemy's `presentation`.

> The intended party size is three, but it was never formally set as such, and several bugtesters brought in teams of six and had a lesser experience for it. Having six slots should be relegated to a debug feature.
☑ **Done (session 14).** `tuning.run.partySizeMaximum` is 3; `partySizeMaximumDebug` is 6, reachable
through the debug panel's `allowLargeParty` toggle (`honeycomb.teambuilding.partySizeMaximum()`). Default and maximum should be 3; keep the six-slot ceiling as a debug-only feature.

---

## Session 15 review of session 14

Noodle asked for a quick check of the session-14 work, since a performance problem had slipped in.
Read: the telegraph spend (`intentSpent`, cleared by `selectMove` and `changeIntent`), the instant spiral,
`lustOverfull`, hover-forward (gated to a fine pointer), the half-health cut-in (per-fight flag reset in
combat setup and on summon; skips broken/downed; the forecast rolls the flag back with the state), the
Carapace pending-gold shrink (reads `mark.summary.temporaryHealth`, the value before the forecast), the
random-lust spread, the vertical-card wash (a plain gradient, no filter), folding, `allyOther` (resolve,
legal-target highlight and aim all honour `excludeSelf`), the reward swap gate (`brokenSwapActive` is
false in victory/defeat), the preload and the enemy-card read overlap.
- **No correctness bugs found.** The performance problem did not come from session 14: the idle cost
  was the nameplate lightning timer from round 06 (fixed in session 15, see C above).
- **Fixed:** `preload.warm` repeated tuning's batch numbers as inline fallbacks (magic numbers); it reads
  `tuning.preload` only now.
- **To watch, not bugs:** the preload asks for every `2-basic` hurt tier, including ones not drawn yet, so
  those are 404s in the network log (harmless; not memoised as missing, deliberately, so a network hiccup
  cannot drop real art for the session). The Weaknesses fold glow animates `text-shadow`, which repaints
  every frame, but only on teambuilding and only while folded with news. With the read overlap on, enemies
  acting back to back replace each other's revealed card after `enemyActionGapMs` plus their hit beats, so
  a crowded enemy turn gives each card less reading time than before.

---

## Session 20 completed items (moved from the live file, session 21)

### A. Goals before demo release

- More enemies and a second boss (figure out which enemy sprites are already **fielded in-game**, not just
  what is in the source folder — `ENEMY_SOURCES` in the generator can help either way — and come up with ideas).

  ☑ **Done (session 16).** No drawing in `_source/enemies/` is unused now. The five unfielded drawings became
  **Spore Gardener**, **Fungal Sage**, **Spore Alchemist**, **Bark Sentinel** and the **Kobold Scavenger**
  (the game's first ELITE encounter), and **The Juggernaut** became the **second boss**. The two floors are
  the two regions, so `upperCatacombs` ends at the Matriarch and `floodedVault` at the Juggernaut: a run
  meets both and neither twice. The Juggernaut is the Matriarch's mechanical opposite — she owns summons and
  lust, he owns party ORDER (a log that reaches the whole line, debris that reaches the back, a Backhand that
  shoves the front to the back). Elite nodes gained their own encounter pool, and `elite` was finally added
  to `tuning.map.nodeWeightArray` (the node type had never been placed). Placeholders rebuilt with
  `generate-placeholder-art.py --only enemies`; the ART-GUIDE and CATCH-UP carry the details. Test [73].
  **Clarified (session 17):** only the SCAVENGER is an Act 2 import; the other four and the Juggernaut are
  ordinary Act 1 enemies, and the demo is Act 1 only. The new enemies are gated by depth TIER, not region.

### B2. Forecasts and tooltips

> Please move all tooltip text, don't forget ones related to lust weaknesses, into a single document for easier editing.

☑ (from 06). Round 07 asks for the same thing plus a debug key — see D1's tooltip report, the same item.
**Debug key done (session 14).** The debug panel's `toggleTooltipKeys` prints `tooltip:<kind>:<key>` on
every panel (`honeycomb.tooltip.debugKeyMarkup`).
**Text table done (session 15; Noodle: "Next, this session").** `scripts/misc/honeycomb/honeycomb-text-tooltips.js`
holds every sentence a panel writes itself (~95 entries), grouped under the same kind names the debug key
prints, with the lust weaknesses' panels (weakness, weaknessRank, weaknessBench, weaknessReset,
lustEventGate) included. `{tokens}` are filled by the game; `.one` / `.many` pairs handle counts. Read
through `honeycomb.tooltip.text` / `html` / `countText`; a missing index prints `[index]` and warns once.
**Later entries win**, so a mod or translation file can append replacements. The file's header lists the
text that stays on CONTENT (status, keyword, relic, equipment, tag and mechanic descriptions, card text,
and the weakness RANK TITLES and descriptions in `tuning.lust.exposureRankArray`), because moving those
would break "new content is one table entry"; if Noodle wants those in the same file too, that is the
next step. `honeycomb.teambuilding.overCapacityText` moved into the table. Test [72] holds the table to
the code both ways (no missing key, no unused entry). Verified in the browser: every tooltip kind renders
with no missing key.

### C. Performance

**Card frames downsampled.** The frames are 1992×2540, drawn ~110px wide with a `hue-rotate` filter per
card. Noodle (session 15), asked about a downsampled copy:
> Yes, please make a downsampled version. Not only that, but I think we should also add an even further downsampled version for the small size.

☑ **Done (session 15).** One copy per card size, named `<frame>-small` / `-medium` / `-large`
(`tuning.art.cardFrame.frameSuffixBySize`): 332×423, 664×847 and 996×1270 (a sixth, a third and half the
width). Medium is a third rather than the quarter first suggested because a hand card is a MEDIUM card
scaled up to large on hover, so it needs about large's detail. `honeycomb.ui.sizedCardFramePath` picks
the copy; `ui.cardFrameFallback` draws the full frame if a copy is missing (and remembers it). The preload
warms the copies, not the sources. `generate-placeholder-art.py --only frames` writes them from every
full frame in `cards/frames` (also run by `--only lewd` and the full run): **rerun it after adding or
redrawing a frame.** Decoded memory per frame drops from ~20MB to 0.45 / 1.8 / 4MB. Verified in the
browser: small, medium and the Lewd frame load their copies; a missing copy falls back.

### D0. Quick wins

> Please add a debug tool to unlock the game's contents. At the moment I have "Fall Back", which is fine to keep it's current effect, but I presume that's the wrong card.

☑ **Debug tool done (session 15): "Unlock all content"** (`honeycomb.debug.unlockAll`, debug panel). Walks
every `unlockKindArray` kind (characters, outfits per character, equipment, tabs) and every
`discoveryKindArray` kind, writing straight into the ledgers with no experience paid; autosaves. Verified on
a fresh profile: 133/133 cards in the Compendium, all outfits/equipment/tabs.

### D1. Reports

> Testing certain parts of the game is difficult: Add an option to trigger the shop to debug tools, raise debug tools higher on menu, add hidden button on title to trigger honey game instead of only using debug target.

☑ **All three done.** Session 14: Open the shop, and Debug Tools under Compendium. Session 15 (Noodle signed
off on the host change): an invisible 48×48px square in the top-left corner of the Syrup Town title
(`#titleHoneycomb`, `scripts/gameplay/title.js`) calls `honeycombBoot()`; drawn only when Honeycomb is
loaded. Listed in REQUIREMENTS §4b. Verified: quitting Honeycomb to the title and clicking it relaunches.

> Many tooltips display wrong information: All tooltips need to be added to a single file so I can review and correct them. There must be some kind of debug mode key visible on them as well to make searching easier when I want to change one.

☑ Same item as B2's tooltip text table: both halves done (session 14 key, session 15 table).

### E. Design notes for the card redesign (round 07)

> Clemence lacks the obvious temporary health abilities she'd need to synergize with Brienne.
☑ **Done (session 20).** New common **Sheltering Grace** (an ally gains 6 tHP, 9 with Lust; she gains 4 Penance) and its broken form **Radiant Aegis** (spend up to 10, ALL allies gain half as tHP). See MECHANICS-02 part 7.2.

> Clemence's broken state card pool is still too healing heavy instead of letting her feel like a bursting build-around character.
☑ **Done (session 20).** Five heal-heavy broken forms converted: Outpouring and Benediction deal Lust to the enemy, Consecrate and Keep Faith give tHP, Rapturous Host makes ALL enemies take Lust. See MECHANICS-02 part 7.3.

> Severine's self healing is so high paying life never feels like a cost.
☑ **Done (session 20, corrected in the second pass).** The healing was NOT the cause — the runaway was
**Bloody Verdict** (4 damage per debuff plus a full drain, fed by Nettle), and the fix we want is dearer
**life prices**, not weaker healing. Drain / Nightfall / Crimson Fang are restored; Bloody Verdict is now
a bounded missing-health finisher; Blood Pact 4→7, Bloodlet 5→7, Transfusion 5→8, Heartsblood 6→9.
See MECHANICS-02 part 15 and CARD-AUDIT-01 part 4.

> Nettle's poison infliction among her card pool is so dense she's very overpowered.
☑ **Done (session 20).** Density cut, not power: Blight Needle 3→2 Poison, Wasting 4/4→3/3, Fester 3→2, Creeping Plague 4→3, Pollen Kiss 3→2 (Lust 3→6). Payoff cards untouched. See MECHANICS-02 part 4.

> Clement's lust building tags should be unique so I can use the state of her weakness to it as a self-progression metric, it should also actually build a weakness to trigger lust events with.
☑ **Done (session 20).** Every Clemence self-Lust entry now carries the new lust tag **Penance** (`cardTagArray`, `lustTag: true`), so her own build-up raises Exposure and can fire a lust event. What she casts at enemies is still Exposure. See MECHANICS-02 part 7.1.

> Cassadora should have an archetype around making enemy cards not exhaust and stay in your deck (heirloom? outfit? Blue mage?)
☑ **Done (session 20).** New **Repertoire** archetype: status `repertoire` + `honeycomb.stolenCardSettings` seam; **Archivist** outfit, **Copycat Quill** relic, and cards **Understudy**, **Encore**, **Repertoire**. See MECHANICS-02 part 8.

> Among the ranks of Starter, Common, Uncommon, and Rare, there's no clear differentiation between common and uncommon. We may want to drop the rank and just have Starter, Common, and Rare.
☑ **Done (session 20).** Ranks are Starter / Common / Rare. Payoffs kept Rare; reward weights common 75 / rare 25 (elite 45/55); shop prices starter 30 / common 55 / rare 120 / special 40. Equipment and relics keep their own three ranks. See MECHANICS-02 part 2.

> Don't overload with too many broken versions of each card, (with the exception of Clemence who directly focuses on breaking herself), but there should at least be one unique broken card design for each of starter, common, and rare card rarities, with rare cards usually having the most beneficial effects (directly helping to mitigate lust), while starter cards are have negative effects if left to discard without playing them, essentially serving as a tax.
☑ **Done (session 20).** 15 new broken forms, three per non-Clemence character: a starter tax, a neutral common, and a rare that soothes the party. See MECHANICS-02 part 9.

> A number of characters seem to still have no cross-party hooks at all, every single party member should ideally have *some* kind of value they add to each other.
◐ **Partly done (session 20).** Every character now has at least one cross-party card; Cassadora gained **Warded Fate** (ally tHP + soothe, random enemy re-picks). Audit table in MECHANICS-02 part 11. Open: Nettle and Severine's cross hooks are all "the enemy is debuffed, so the party's hits do more". *(This stays open: the annotation is copied here only so the quote and its history live together; the OPEN half is listed under E in the live file.)*

> Statuses that give other statuses, like Gilded, quickly become extremely overcomplicated and basically require the player learning a whole new language. In general, the philosophy is similar to Slay the Spire 1's: If it's only done once, it's technically a status, but it isn't called one. It lives on the status bar, but the card just says what it does, making it more of a passive than a buff.
☑ **Done (session 20).** Momentum, Retort, Entrenched, Gilded, Pandemic, Heady Spores, Gorged, Hemomancy, Blood Moon, Siphoned, Jinx and Puppeteer are no longer named on their cards; the text describes the effect. The statuses still apply and still show on the bar. See MECHANICS-02 part 10.

### E2. Session 20 second pass — the full card audit

> Drain, Nightfall, and Bloody Verdict healing were not the issue, as far as I can tell by playtesting
> myself, most playtesters who mentioned Vex's health not mattering were also playing with Nettle and
> were profitting off of Vex's card that drain-scales off of inflicted statuses. Besides that, even if
> they were the issue, the more fun direction would have been to make her life-payment abilities cost
> more, not make her healing cost less.
☑ **Done.** Drain / Nightfall / Crimson Fang restored; Bloody Verdict re-designed as a bounded
missing-health finisher (no status scaling, no runaway with Nettle); Blood Pact / Bloodlet / Transfusion /
Heartsblood repriced upward. See CARD-AUDIT-01 part 4 and MECHANICS-02 part 15.

> Surface-level changes like these are extremely harmful to the health of the game […] the bumps *are*
> the game. […] the goal of climbing the tree is to climb the tree.
☑ **Taken to heart.** The second pass replaces cards rather than smoothing numbers where a card was
generic or a trap: Hold the Line → Stand Fast, Rally → tHP-scaled, Understudy → the archetype's steal,
Encore → Repertoire payoff, Turn the Line → line-wide damage, Pandemic / Heady Spores / Gorge given
immediate effect. The bumps are preserved.

> For every single card in the game, please do a thorough and exhaustive pass rating each card on two
> different scales. […] It is absolutely imperative that you do not give out fives willy-nilly.
☑ **Done.** `CARD-AUDIT-01.md` rates every draftable card, the neutral pool, the broken forms and the
curses on I / S_v / S_h / C and on niche fit (Starting / Accelerate / Payoff / Late-game). Thirteen 5s
across roughly 900 scores, each listed and justified; no card has a 5 in more than three metrics and
none has all of them.

> If you decide to make a card care about buffs or debuffs, then they should care only about either
> positive or negative status effects. […] Nothing should care about neutral status effects.
☑ **Applied.** Every status-counting card checked: Putrefy is new and counts negative statuses only;
Bloody Verdict no longer counts statuses at all; `debuffCount` and `cleanse` are the negative pole; no
card counts neutral statuses. The polarity table is CARD-AUDIT-01 part 10.

> Cards that are too powerful instant-picks, cards that are useless never-picks. […] A fresh card pool
> also saves us time in the long run, needing to do art for cards that shouldn't have made the cut.
☑ **Found and replaced.** Instant-picks: Rally, Soul Harvest, Bloody Verdict, Blood Pact's price.
Never-picks: Hold the Line, Pandemic, Heady Spores, Gorge, Understudy, Encore. All catalogued with
before→after in CARD-AUDIT-01 part 11.

> One other place to check is specifically lines 256 to 286 of FEEDBACK-07.
☑ Re-read; items 1–10 of section E are all closed or explicitly parked (cross-party audit marked ◐).

---

## Session 21 completed items (moved from the live file)

### C. Performance — image loading

◐ **Image loading.** Background preload (`honeycomb.preload.warmCommon`) and `decoding="async"` are done.
> Image load times delay gameplay online. **Potential solution**: Loading screen to preload images.

☑ **Both halves done (session 21).** `honeycomb.preload.screen()` is the blocking layer: it covers the
first scene while the batch warm runs, shows the progress bar and `N / M images`, and always gets out of
the way — a minimum display time (no flash), a maximum wait, and a press anywhere skips it. Tuning
`preload.screenEnabled / screenMinimumMs / screenMaximumMs / screenPollMs`. Verified in the browser
("0 / 54 images" while warming).

### D0. Quick wins — broken/non-broken view, and three reports

> When broken, all of that character's cards in the rewards show as broken: There needs to be some kind of way to view the non-broken and broken version of cards. This is likely something we will need to brainstorm rather than implement blindly.

☑ **The leak is fixed (session 14):** a finished fight no longer counts as "in a fight", so rewards show
the real cards. ☑ **"View both versions" done (session 21):** the Compendium's Cards tab has a **Show
broken forms** toggle, which lists each card's broken form under it (23 rows for a full character). Uses
the new static `honeycomb.brokenFormIndexFor`, so the pairing shows without anyone being broken.

> There appears to be some kind of leftover button on the enemy details windows. On Gloom Wisp it is above the fade card (4th in list), and on Hollow Knight it is above the strip card (3rd in list). Inspecting the element it says "Next", unknown purpose, not actually readable.

☑ **Done (session 21).** It was the "this move is next" badge on the enemy's move list, not a button. It now
reads **"Next move"** and hovers a panel saying what it marks (tooltip kind `enemyMoves`,
`honeycomb-overlays-combat.js` + `honeycomb-tooltip.js`, text in the tooltips table).

> Emberwake not clearing when battle ends

☑ **Done (session 21).** The engine always cleared it (`finishVictory` → `clearCombatStatuses`; verified
headlessly both at one victory and with the next fight opening at one stack). The bug was VISUAL: the board
behind the victory overlay kept the last frame's status chips. The victory overlay now redraws every standing
ally's plate after `finishVictory` clears them (`honeycomb-overlays-combat.js`).

> Broken tooltip is wrong, there are multiple potential broken cards per character

☑ **Done (session 21).** The `broken` keyword still said "their single broken card". It now reads "that
card's own broken form". A swapped card's zoom also names the card underneath it now (`card.brokenFrom` in
`honeycomb-tooltip.js` / the tooltips table, using the `brokenFrom` stamp `resolveCard` already wrote).

### D2. Presentation and UI

> Mobile hand-lifter arrow is unnecessary. It turns out you can swipe the notification away to the side. We should replace it. On mobile only, there should be a subtle tooltip in the center of the screen saying you can swipe away the notification if it's blocking a gameplay element. This tooltip should vanish when the party is not at rest and not display repeatedly.

☑ **Done (session 21).** The bobbing chevron arrow is gone (`hcHandHint`, its tap handler, tuning and
CSS all removed). A subtle **Swipe a notification aside if it blocks the game** line now sits in the
middle of the board: mobile landscape only, hidden while a replay runs (`.hcBusy`), shown once per
profile (`profile.swipeHintSeen`). Tapping or swiping it (48px, `tuning.layout.swipeHintDismissPixels`)
reads it and remembers. Verified in the browser at 812×375.

> Card rarity should be conveyed somewhere on each card.

☑ **Done (session 21).** New `honeycomb.cardRarityArray` (starter / common / rare / special / enemy /
broken, name + colour + description) and `honeycomb.ui.cardRarity`: a gem on every card, every size, left
edge under the cost bubble so a hand card's clipped foot cannot hide it. It hovers a `rarity` tooltip
whose words come from the rarity table itself. Verified in the browser (grey starter, blue common, gold
rare).

> Compendium should have a toggle to show the broken versions of each card as well.

☑ **Done (session 21).** The Compendium's Cards tab carries the **Show broken forms** toggle; each found
card lists its broken form under it. `honeycomb.brokenFormIndexFor` is the new static pairing.

> Display enemy names at their feet, be careful not to cover the end turn button.

☑ **Done (session 21).** Enemies wear a small name label inside their own frame
(`.hcFighterFeetName`, `combatScene.renderFighter`), so it cannot reach the End Turn button; "The
Juggernaut" verified in the browser. Allies keep the medallion.

> The cut-in sequence that triggers when reaching half-health for the first time each battle should be named Exposed. The image of the exposed trigger should use a character & outfit-specific image uniquely used for exposed triggers. Create placeholders for these.

☑ **Done (session 21).** The cut-in is named **Exposed**: `ui/exposed/exposedText` (generated placeholder
in the display font) slams in at the figure's feet. The art is now **per outfit**:
`characters/<folder>/<outfit>/exposed` through the new `honeycomb.art.exposedChain`, falling back to the
hurt-tier chain so nothing is ever missing. `generate-placeholder-art.py` writes one exposed.webp per outfit
(part of `--only characters`; the title is `--only exposed`) and now reads the .png sources the art pass
added. Verified in the browser.

> Exposed half-health trigger sequence's image is too high on the screen

☑ **Done (session 21).** `tuning.halfHealthOverlay.characterScale` was 1.18 of the screen high and hung the
head above the top edge; it is the broken layer's 0.85 now. Verified in the browser: the figure fits with
headroom and the title sits under it.

> Obtainable cards tooltips should say "additional copies won't appear with the [outfit] outfit equipped."

☑ **Done (session 21).** Cards the worn outfit blocks now say exactly that
(`honeycomb.cardOfferStateInfo`: "Additional copies won't appear with the Warden outfit equipped.").
Boost/block reasons from other conditions keep their old wording.

> The compendium is too cramped, various sections need to be in their own subpages, like card lists.

☑ **Done (session 21).** The Compendium is now three subpages on a tab row: **Overview** (the discovery
ledger), **Cards** (one character at a time, chips pick who, with the broken-forms toggle), and
**Bestiary**. The old single wall is gone.

> Add a bestiary similar to the character details window and in the compendium that lists the game's enemies, with the same information you'd get from clicking on that enemy in combat.

☑ **Done (session 21).** The Bestiary tab lists every enemy in `honeycomb.enemyArray`: portrait, name,
tag chips (hoverable), health range, gold and its AI habit, then its whole move set as cards (seen face
up, unseen face down, exactly as the in-combat window shows). An unmet enemy is "???" and dimmed. The
move grid is shared with the combat window via `honeycomb.enemyMoves.moveGridMarkup`. Verified in the
browser: 11 entries, 52 move cards.

> Broken cards likely need some kind of unique visual effect. Please design some kind of test space where you can demo SVG and fancy CSS card effects, as well as where we can work on the new card frame currently sitting in v13 spire images\_source\cards

☑ **Done (session 21).** Broken-form cards now wear `hcCardBroken` (set in `honeycomb.ui.card` from
`rarity: "broken"`): a rose rim and one slow sheen sweep, animated on `transform` only and dropped by
reduced effects. Verified in the browser (5/5 broken hand cards).

**The test space is `!designDocs/honeycomb/card-effects-preview.html`**: (1) a live composer that
assembles `frame_blue` / `ribbon_blue` / `type_*` / `detail_gem` into a card with every rectangle as a
slider and prints `tuning.art.cardFrame` percentages to copy; (2) the shipped broken look beside four
cheaper/pricier candidates with their costs named; (3) an SVG filter lab (gild, roughen, damage) over
the real frame. Open it through the dev server like `nameplate-preview.html`.

> Statuses should be clearly denoted if they are positive or negative. Neutral statuses are not given a descriptor, but it is important not too many statuses are categorized as negative. Neutral statuses are our grab-bag space for anything that isn't clear is a status when the player plays the card, and no mechanic in the game should care about neutral statuses because of that lack of clarity.

☑ **Done (session 21).** New `honeycomb.statusPolarity` (1 / -1 / 0; a status declares
`polarity: "neutral"` to opt out, else `isDebuff` answers). Chips and plate circles carry it: positive
gets a green **+** and ring, negative a red **-** and ring, neutral gets neither (grey ring). The status
tooltip adds "Beneficial." / "Harmful." from the tooltips table, and says nothing for neutral.

> BROKEN state is unintuitive to manage on the map

☑ **Done (session 21).** The top bar's party button wears a red **!** badge with a `partyAlert` tooltip
while anyone is Broken, the party list tags them **BROKEN** beside their health, and the detail sheet
gained a **Condition** section (HP / tHP / Lust) that states the way out on the map in words: raised
above their Lust by a rest site or an event. Verified in the browser.

### D3. Rules and balance

> No more enemy count modifier based on party size, strictly balance encounters around 3 party members, solo play has other balancing tools like consistency.

☑ **Done (session 21).** `honeycomb.scaling.extraEnemyCount` is gone, `scaledLineUpArray` returns the
encounter's own list, and `tuning.scaling.enemyCountPerExtraMember` is deleted; a debug six-slot party
meets the same line-up. Stat and gold seams stay (zero-rate stats). Tests [15] and [71] rewritten to the
new rule. `reinforcementArray` stays as content data but no longer grows a fight.

> lust weakness ranks should be at roughly 33%, 66%, and 100%, not 25, 50, 100 which is what it looks like.

☑ **Done (session 21).** The thresholds are thirds of the rail now: `tuning.lust.exposureRankArray` is
13 / 27 / 40 against a 40 ceiling, so the notches land at 32.5% / 67.5% / 100%. Test [37]'s fixture reads
the threshold instead of its old hard number.

> Weak and vulnerable should explain how *much* they affect damage, not just vaguely gesture at it

☑ **Done (session 21).** Weak: "Deals {damageReductionPercent}% less attack damage" → 25%. Vulnerable:
"Takes {damageIncreasePercent}% more damage from attacks" → 50%. The percentages are expanded by the new
`honeycomb.statusDescription` out of the status's own `damageMultiplier`, so the printed number cannot
drift from the hook that applies it.

> Rework poison to trigger for all enemies at once at the end of your turn, have each tick of poison be its own cool damage impact moment and rapid-fire them, and test mathematically how big of a nerf it is to Nettle for poison to be cut in half at the end of each round instead of decreasing by 1.

☑ **Done (session 21).** Poison now ticks through the new `onTeamTurnEnd` hook: the end of the player's
turn ticks every poisoned ENEMY at once (the end of the enemy turn ticks the party), one damage log
entry each, and the replay plays each as its own rapid beat (`tuning.animation.poisonTickMs`, 90ms
instead of the hit flash). Intoxicated moved with it.

**The maths (test [80]):** totals over a poison's whole life, decrement → halve —
1: 1→1 · 2: 3→3 · 3: 6→4 · 4: 10→7 · 6: 21→10 · 10: 55→18. So the halving rule is a **−33% nerf at 3
stacks, −52% at 6, −67% at 10**. Implemented as one field, `poison.decayMode: "decrement" | "halve"`;
**the shipped value is still `"decrement"`, so live balance is unchanged** pending Noodle's call on the
nerf. Say the word and it is a one-word edit.

### D4. Audio

> Look in honeycomb sound/sfx and assign every card an appropriate SFX based on what you can presume from the filename.

☑ **Done (session 21).** `tuning.audio.fileMap` + `platform.playFile` play Honeycomb's own library
directly (works hosted, standalone and `file://`; `eventMap` host stems stay as the no-library
fallback). New `cardSoundRuleArray` matches a card's name / tags / archetype / effects and assigns one
of 19 finer sounds (fire, ice, venom, lewd, heal, thrust, brutal, kaboom…), with `sfx` on a card as the
explicit override and the type table still the fallback -- so no card is silent. Test [79].

> Add sounds build for the game to relevant points: "!broken" to the broken animation, "!outfitChange" when the player changes a character outfit. "!torn" when the half-health exposed trigger runs. "!victoryBattle" and "!victoryFull" for winning a battle and a run respectively.

☑ **Done (session 21).** All five wired through the library: `brokenOverlay.play` → `!broken`,
`halfHealthOverlay.play` → `!torn`, `teambuilding.setOutfit` → `!outfitChange`, the victory overlay
open → `!victoryBattle`, `finishRun(true)` → `!victoryFull`. Each has a host-stem fallback for a host
with no `honeycomb sound/` folder.

### D5. Telemetry

> Add a way for me to collect info on which cards are taken most and which cards are ignored the most, not just from my own testing, but if it's possible one that would work when the game is hosted on neocities.

☑ **Done (session 21).** `honeycomb.telemetry` (honeycomb-state.js, its own localStorage namespace,
never wiped with a profile): `offerArray` / `takeArray` / `skipArray` / `deckAddArray` per card plus
runs started / won / lost. Instrumented at the offer roll, the victory take/skip (the unchosen offers
count as skipped) and `addCardToRunDeck` -- the one deck door, whatever granted the card. Debug Tools →
**Card report** opens a copy-to-clipboard TSV with card names and indices, plus a "clear the counters"
button. No uploader on purpose: neocities is static hosting and honeycomb never uses fetch, so the
copy-out IS the collection path. Test [78].

### A. Goals — card art prompts

- Write a first pass of art prompts for each card to be sent through the WEBUI engine using the
  character's characterDB entry, the default costume, scene, and background tags.

  ☑ **Done (session 21).** `CARD-PROMPTS-01.md`, generated by the new `card-prompts.js` from the game's
  own content: one webui v2 shortcut per draftable card
  (`.hcNecroV, default, <action>, <scene>, <background>`), with the action derived from the card's
  types, the setting from its sister mechanic, the background from the region, and per-card overrides
  for the marquee cards. First pass for review; each line is one row in the tool's tables.

### E. Design notes — outfit vagueness

> Currently, outfits mention card categories, but the cards themselves lack this information. Either outfits should change to be more vague about what cards are reduce (since the compendium covers that), or cards need to mention their category. Given how cramped card info is, I lean towards the former.

☑ **Done (session 21, Noodle's own lean: vaguer outfits).** All 17 outfit descriptions that ended in
"X cards are offered far more often; Y cards never" now end in a line of feel instead ("A comet's way:
arrive first, arrive burning", "Hunts the wounded; the chase is the point"), and the archetype weights do
the work silently. Mechanical sentences are untouched. Tests green.
