# Honeycomb — Feedback round 05 (2026-09-12, after session 5)

The unsorted batch at the foot of `FEEDBACK-04.md`, lifted here and numbered so it can be worked
through and tracked. **Quotes are Noodle's, verbatim. Do not summarise this file; add to it.**
Annotations under each quote are the interpretation and what was done — if an annotation and a quote
ever disagree, **the quote wins**.

Round 04's own items stay in `FEEDBACK-04.md`; its remaining open ones are **7** (mobile landscape,
needs a real phone), **22** (which card looked like it went in the pile), **23** (the upgrade window's
tooltip) and **27** (which fullscreen message).

> **Which mockup is which** (corrected mid-session 6): **`mockup-2-battleComplex`** is the reference for
> the health bars and nameplates. `mockup-2-battleImproved` was a scale-adjustment tool for an earlier
> session and is NOT a design reference — round 04 item 11 used it for figure and pile sizes, which is
> all it was for.

Status key: ☐ not started · ◐ in progress / partly done · ☑ done

## Status board (update as items land)

| Done | Items |
|---|---|
| ☑ | 0 (play-speed slider), 1–15, 20, 22, 23, 24, 25 |
| ◐ | — |
| ☐ | 16, 17, 18, 19, 21 |

Tests: **836 headless**, section [57] is this round (68 new).

**Noodle's stated priority for session 6:** the Broken state first — items **1–8**, plus **0**, the
speed control, because inspecting a cut-in needs a way to slow it down.

---

## 0. A slower play speed, as a slider ☑

> I'd like the new broken state improved first, that'd be a cool thing to show off, but it's quite
> janky at the moment. It may be worth implementing slower battle speeds temporarily or making it a
> sliding bar so we can go through it reeeeally slowly.

- **Both, and neither is temporary.** `tuning.animation.playSpeedArray` gained four slower steps below
  the old floor — **0.1× Frame by Frame**, **0.25× Crawl**, **0.4× Study**, **0.55× Slower** — and the
  combat speed button is now a **slider**: tapping it opens a panel over the shelf with a range bar
  across every named step, the current one written out, and a Reset to Normal. The button still shows
  the current label, so nothing moved.
- The slider indexes the ARRAY rather than writing a multiplier, so the steps stay named content and
  adding a fifth slow one is a table entry. Every duration already goes through `honeycomb.duration`,
  so the whole game — cut-ins included — slows with it, and the panel rewrites the CSS custom
  properties on change so anything mid-flight retimes immediately.
- Reachable from the title screen's system menu too (**Play Speed**), so a cut-in can be slowed before
  a fight is even entered.

---

## The Broken state

### 1. Recovery only at the start of a turn ☑

> The broken state should only be removed if at the -start- of your turn you have more health than lust

- It was checked at the start of a turn **and** every time health, temporary HP or lust moved — so a
  heal mid-turn un-broke somebody instantly, which is not what the brief says and made the state feel
  weightless.
- Now `honeycomb.checkRecovery` takes the moment it is being asked about. Inside a fight it answers
  only at a turn start (`tuning.lust.recoveryOnlyAtTurnStart`); everywhere else — mid-turn heals,
  Soothe, the escalation — it records that the condition is MET and leaves them broken until their
  turn comes round. The plate says so: a broken fighter standing above their lust shows **"Recovers at
  turn start"**.
- **Judgment call, flagged:** OUTSIDE a fight recovery is still immediate, because there are no turns
  on the map and BROKEN-01 §4 deliberately lets the per-move lust bleed un-break somebody. The flag
  that governs it is `recoveryOnlyAtTurnStart`, and it is only consulted when a combat exists.
- This also fixes item 5 — see there.
- Test [57].

### 2. The claw is fully drawn before the tear opens ☑

> Broken animation: brokenClaw is visible too early, it's meant to look like the tears are just forming
> at first.

- **Cause:** the rim (`brokenClaw`) was deliberately left UNMASKED — "masking it would cut its own
  outline off" — and so it faded in as the complete, final shape while the white behind it was still a
  few blobs. The finished tear was on screen before the tear had happened.
- **Fix:** the rim is masked by the same six growth gradients the white and the background use, so it
  is only drawn where the tear has already opened. It does not lose its outline, because the mask it
  now carries is the GROWTH mask, not the claw silhouette. It leads the white slightly
  (`clawRimLeadFraction`) so the edge forms a hair before the white fills behind it, which is what
  "the tears are just forming" looks like.
- New tuning: `clawRimFraction` (how much of the start the rim takes to form), `clawRimLeadFraction`
  (how much of it happens before the white fill starts) and `clawGrowStartFraction`.
- **Two more things were wrong, both found by scrubbing the cut-in frame by frame with item 0's slider:**
  - **The easing.** `cubic-bezier(0.2, 0.8, 0.3, 1)` is so front-loaded that the tear was 85% grown
    200ms into a 620ms opening — "visible too early" however well the mask is built. It is an
    ease-in-out now, so the opening spends itself opening.
  - **The growth started at zero,** and a blob narrower than the claw's own strokes paints nothing at
    all — so the screen was empty and then a tear appeared halfway through. `clawGrowStartFraction`
    starts the blobs at 16% of their end size, which draws the first thin scratches at once and widens
    them. That is the "just forming" reading.
- Browser-checked by pausing every animation in the layer and stepping it: at 6% of the cut-in there
  are scratches, at 20% a partial tear, at 40% the whole claw with the background through it.

### 3. The screenwipe must erase what it passes over ☑

> Broken animation: Screenwipe does not visually look like it's removing elements beneath it, it just
> looks like a rombus is passing over the screen and the assets vanish independently. The screenwipe's
> purpose is to hide the vanishing elements underneath it.

- **Cause:** the wipe was an opaque black bar crossing a stage that was independently animating itself
  away underneath. Nothing tied the two together, so the bar passed and the picture happened to go.
- **Fix:** the wipe is now the EDGE OF THE CUT-IN. `.hcBrokenStage` carries an animated `clip-path`
  whose left edge is the same slanted line, so everything the wipe has passed is genuinely gone —
  clipped, not faded — and everything ahead of it is untouched and still holding. The black band rides
  that edge (`wipeBandPercent` wide) so the moment of removal is covered rather than seen.
- The battlefield is therefore revealed by the band's trailing edge, one slanted strip at a time,
  which is the read the brief asked for.
- Both shapes are cut from the same two numbers — `wipeSlantPercent` and `wipeBandPercent` — and share
  the exit's easing exactly. `wipeAngleDegrees` and `wipeOverhangPercent` are gone: an angle for the
  band and a polygon for the clip would have drifted apart the first time either moved.
- Browser-checked: at 97% of the cut-in the board is back on the left of the band, the band is black,
  and Brienne is still whole on the right of it.

### 4. Recovery must not use the broken sprite ☑

> Recovery should not use the broken sprite, make placeholders for a recover.webp for each character
> using their normal standing sprite.

- `recoverArtPath` on each character (`characters/<folder>/recover`), read by
  `honeycomb.recoverOverlay.artPathFor`, which falls back to the portrait and never to `broken`.
- The three placeholders are generated from each character's own standing art by
  `generate-placeholder-art.py` (`build_recover_portraits`, run by `--only broken` as well as a full
  build). Unlike the broken stand-ins they are NOT desaturated or tinted — "their normal standing
  sprite", as asked. A hand-drawn `recover.png` beside the target is converted instead, the same rule
  every other generated asset follows.
- `tuning.recoverOverlay.eyeWindow` was measured against the broken art; the standing art frames the
  face much higher and much smaller, so the window was re-measured off each character's own
  `recover.webp` — the default is Brienne's (eyes 14.6% down, 5% of the picture's height), and Nettle and
  Severine carry a `recoverEyeWindow` of their own.
- Browser-checked on all three: the band shows a visor-and-eye strip rather than a whole head.

### 5. A debug break left the hand unchanged ☑

> I used the debug tools to trigger the broken state on severine but the cards in hand didn't change to the
> broken variants. Maybe because she had already recovered in the same turn?

- **That is exactly it.** `tuning.lust.breakOncePerTurn` refuses a break for anybody who recovered in
  the same turn, and `recoveredThisTurn` was being set by any mid-turn recovery — including the debug
  panel's own **Clear the party's Lust**. So the break silently did nothing: no cut-in, no swap, no
  message.
- Item 1 removes the cause, since recovery now only happens at a turn start. Two further guards:
  - The debug panel's **Break the front of the party** clears `recoveredThisTurn` first and says so in
    its description. A debug forcing tool that quietly declines is worse than useless.
  - A refused break is no longer silent in a debug build: `checkBreak` logs a `breakRefused` entry
    naming the reason, and the combat scene prints it to the console.
- Test [57].

### 6. Broken is hard to see on the board ☑

> It's hard to visually tell when a character's broken or not.

- It was a desaturation plus a thin outline on the plate — invisible next to a sprite that is already
  a different pose.
- Now, all keyed off `entity.broken` in the fighter builder so a repaint cannot lose them:
  - a **BROKEN banner** in the lust colour that TAKES THE NAME BAR'S PLACE rather than adding a row,
    with one short line under it saying when they get up ("Up at turn start" once they are above their
    lust, else how far short they are). The plate is bottom-anchored, so every row added grows upward
    over the character's face -- the trap round 04 hit with the ability chips, and a banner plus a
    note added two. Nothing is lost by taking the name: a fighter's place in the line and their
    portrait already say who they are, and item 11 is asking whether the name belongs there at all;
  - the plate itself washed to the broken palette with a slow pulse;
  - **chains laid across the figure** — two bands of the cut-in's own LOOPING chain
    (`ui/broken/brokenChainBackground`), one over the shoulders and one over the shins, positioned in
    `tuning.brokenOverlay.fighterBindingArray`. The looping one rather than either front frame, because
    those are full-screen compositions and a fighter-shaped crop of one shows a slice of empty sky;
  - the sprite tinted toward the lust palette rather than merely greyed, and the bar drawn in the
    broken palette, so the pair reads at a glance.
- **Two traps, both hit:** the bands deliberately STRADDLE the nameplate rather than crossing the
  chest, because the plate covers roughly the middle half of a fighter's box and a band laid there is
  drawn and then hidden behind it. And the chain art is charcoal on transparent, which at fighter size
  over a dark sprite on a dark cavern is invisible — the first pass drew perfectly and could not be
  seen. It is lifted and rimmed in the broken colour now.
- All of it is in one CSS block (`BROKEN ON THE BOARD`) and one builder branch, so an art pass has one
  place to go.

### 7. What halves the temporary HP, and when ☑

> There seems to be a phase in the turn where temporary HP is halved, it might be worth it to have a
> tooltip explain what's happening

- The gold **+N** on the bar now carries a tooltip that says what temporary HP is, that it is spent
  before health, that it **halves at the start of its owner's turn**, and what it will be after that
  halving ("12 → 6 at your next turn").
- The decay itself is called out as it happens: the `temporaryDecayed` beat floats a gold **−N** and a
  small "HALVED" tag over the bar, so the phase is visible rather than inferred.
- The Temporary HP keyword panel gained the same sentence, so a card that grants it explains it.

### 8. The shattered bar end ☑

> The effect of breaking the hp bar limits feels less like chunks of shattered glass floating off the
> edge than I'd like

- The old break was a `clip-path` zigzag plus a bloom and a few round motes drifting right: a torn
  paper edge, not glass.
- Now the right end is drawn as **shards** — `tuning.art.vitalsBar.shardArray`, one entry per chunk
  with its own size, angle, drift and spin — each a hard-edged glass quadrilateral in the gold
  palette with a bright facet edge and a highlight, tumbling out and away from the break. The bar's
  own edge behind them is a jagged `clip-path` that bites further in the further past 100% it goes.
- Every number is a named field and the shard list is a table, so the count and the spread are content
  rather than a keyframe rewrite. Deterministic: a shard's drift comes off its INDEX, never an RNG
  draw — a draw while rendering would advance a stream a different number of times depending on how
  often the screen repainted.

### 9. Forecasts and temporary HP disagree ☑

> I think damage predictions are being made at the same time as attacks, this results in cases where
> holding a bulwark and casting it shows more temporary HP incoming than you'll actually get.

- **The two halves of one line were answering two different questions.** The health beside the gold has
  been the POST-ENEMY-TURN number since the held forecast was built — "40 → 21" is where the play plus
  the turn leaves you. The gold was the GROSS grant: hold Bulwark and it printed the full +12 the card
  hands over, while the enemy turn was about to eat 8 of it. Nothing was being computed at the wrong
  time; the bar was printing two moments side by side without saying so.
- The forecast already knew the answer — `summary.temporaryAfterEnemyTurn`, snapshotted in the dry run
  — and `markFrom` was already passing it as `mark.temporaryAfter`. `honeycomb.ui.temporaryTotal`
  ignored it. It now returns `after`, and the bar prints **+12 → +4**: the same shape as the health
  reading beside it, and the same moment.
- **The gross number is kept, and printed first.** What the card hands over is true the instant it is
  played; a readout showing only the survivor would be lying about the present instead of the future.
  `after` is null whenever nothing eats into it, so an ordinary bar is unchanged.
- The gold's tooltip does the arithmetic in words too, in the order the two things happen: what the
  enemy turn will spend, then the halving at the next turn start.

---

## The nameplate and the numbers

### 10. The bar's numbers are hard to parse ☑

> All the numbers and stat bars on the health are getting hard to parse. I think HP should be a bit
> below the health bar ala mockup-2, temporary health should be a the right end as a golden "+N", and
> lust on the left hand side with the same heart and pink text. Mousing over any of these should give a
> tooltip explaining what they are, how much they're predicted to change, and most importantly what card
> or status is predicted to change them.

**Reference: `mockup-2-battleComplex`** — a round class medallion at the left, a chevron-ended navy
plate, the coloured fill along its top, and the number reading on the dark band beneath it.

- **The bar carries nothing but the bar now.** It used to print health, the gold, the lust and a
  forecast arrow all inside a 12px-tall fill — four readings stacked in one strip, which is the whole
  of "hard to parse".
- **The plate is the frame and the bar is the fill inside its upper half**, as the mockup draws it; the
  readings sit on the dark band under it, in the three places named: **lust left with its heart in
  pink**, **health in the middle**, **the gold at the right end as +N**.
- **Judgment call, flagged:** they share ONE line rather than each sitting beside the bar. A fighter's
  plate is about 136px wide at 1440×810 — giving each reading a share of the bar's own row collapsed
  the bar to a 21px sliver. On one line the three fit exactly; the maximum ("/ 68") is dropped while a
  forecast arrow is showing, since the bar already draws that proportion. On a short screen the gold's
  arrow is the first thing to go, and never the health reading.
- **THE TOOLTIPS ANSWER ALL THREE QUESTIONS**, including the one called out as most important. Every
  log entry already knew what wrote it (item 13's `via` stamp), and `dealDamage` now records
  `damageType` — which is what names poison, thorns and the broken spiral, none of which come from a
  card. `forecast.readLog` folds those into a `causeArray` per fighter and
  `honeycomb.forecast.causeLineArray` words them, so hovering health reads:
  *"Health 68 / 68 · What is left of them… · 68 → 64 if the turn ends now. · Poison −4"*.
  Lust ends on the number that decides everything (*"59 more Lust would break them"*); the gold does
  the halving arithmetic. One shared `tooltip.forecastSection` builds all three, so they cannot word
  the same forecast three different ways.
- Test [57]; browser-checked at 1440×810 with poison, Strength and Lust on Brienne at once.

### 11. The nameplates still do not look good ☑

> I still don't think the unit nameplates look very good, in fact I still think they look bad. For one
> thing, I don't know if we need the character's name on there. Color and class icons to the left of the
> health bar might be better. And if we group buffs/debuffs below the bars it'll lower the vertical
> footprint. As it stands right now they don't feel very fantasy, aren't very evocative of the game's
> style, and just don't look very cool.

Every part of this, taken in order:

- **The name is gone.** In its place, at the left of the bar, a round dark **class medallion** carrying
  the character's `classIconPath` in their own `colorHint` — which every character already had. It is
  absolutely positioned over the plate's left end (as the mockup draws it), so it costs the row no
  width at all, and it names itself on hover, so nothing is lost.
- **Buffs and debuffs moved below the bar and share their row with the character's mechanic widget.**
  That is two rows recovered, not one: the statuses were a row above the bar and the mechanic a row
  below it. The chips still wrap UPWARD inside their own reserved slot, so gaining a fourth status
  cannot move the bar — the reason they sat above it in the first place still holds, and the slot is
  what actually holds it.
- **The footprint**, counted: name · statuses · bar · mechanic · abilities was five rows. It is now
  plate (bar + readings) · statuses-and-mechanic · abilities. The plate is bottom-anchored, so every
  row recovered is a row that is not growing up over the character's face.
- **More fantasy:** the chevron-ended plate, the round medallion, and the character's colour as the
  plate's rim rather than as a tinted name strip.
- **Judgment call, flagged:** the mockup tints each character's health FILL with their colour (green,
  red, purple). The fill is left red for everybody and the colour moved to the medallion and the rim,
  because lust is drawn over the fill as a magenta band — a purple health bar under a magenta lust band
  takes the two readings the break test compares and merges them, which is the mistake BROKEN-01
  records making once already. Say the word and it is one line.

### 12. The hand's left end covers the back line's abilities ☑

> hcHandLeft blocks me from mousing over or clicking the abilities of the backline two members of the
> party

- **Cause:** the shelf's end pieces are 40vmin squares of mostly-transparent painting, so the column
  holding one is 40vmin tall — it reaches a long way up into the battlefield, across the back line's
  plates and their ability chips. `.hcShelfEnd` was already click-through for exactly this reason; its
  PARENT was not, and the parent is the box that was catching everything.
- `.hcHandLeft` / `.hcHandRight` are `pointer-events: none` on the shelf layouts, with every control
  inside taking its events back, so nothing pressable stopped being pressable. Kept to the shelf
  layouts: without it those columns are only as tall as the energy orb and there is nothing to fix.
- Browser-checked at 1440×810: the left column's box is 526×324 and genuinely overlaps the rear
  fighter, and all three ability chips — front, middle and rear — now hit-test to themselves.

---

## Combat and the board

### 13. The log must name what did the damage ☑

> The log should show what did the damage, not just what characters took damage.

- Every log entry now carries `via`, the card or ability that was resolving when it was written.
  Stamped in **`honeycomb.logEvent`** — the one door every entry passes through, the same place `chance`
  is stamped — so no effect has to remember and nothing can be missed. An ability is shaped as a card
  by `honeycomb.abilities.asCard`, so it arrives through the same field.
- The battle log words it with `say.via`: **"The Matriarch took 4 damage from Severine's Crimson Arc."** The
  card name is hoverable, so the line explains itself. Entries that ARE the card (`cardPlayed`,
  `moveUsed`, `intent`) are not stamped — "played Crimson Arc from Crimson Arc" says nothing.
- **Six kinds of line that were recorded but never worded now read.** `lust`, `lustReduced`, `broken`,
  `recovered` and `brokenEscalation` were all in the history and printed nothing at all — the whole
  Broken system was invisible in the log. `temporaryRemoved` and `temporaryDecayed` were not even
  recorded; both are now.
- Test [57]; browser-checked against a four-target Crimson Arc.

### 14. The boss layout blocks targeting ☑

> The new boss layout makes it impossible to target things behind the matriarch. Bosses should always be
> taller than minions, the sporelings should be in front of her and shorter so that everyone can be the
> target of attacks.

- **Cause, and it was not the CSS.** `hcAnchor-back` already sets `pointer-events: none` on the boss's
  column and puts the row above her in the stack — but `honeycomb.combatScene.fighterAtPoint`, which is
  what actually decides what a click or a drop lands on, consulted neither. It walked the fighters in
  DOM order and returned the FIRST whose bounding box held the point. An anchored boss's box is 46% of
  the side by its full height and she comes first in the line-up, so she swallowed every point over
  every minion standing in front of her.
- **Fix:** candidates are gathered and SCORED the way they are painted — a point on something drawn
  (a fighter's own art or their plate) beats a point in somebody's empty column, and a row fighter
  beats one anchored behind it; later in the DOM breaks a tie, which is what paints on top. So the
  guard is reachable by their bodies, and the boss stays reachable by hers and by her plate, which
  always stands clear above the row.
- **And the row draws shorter while somebody is anchored behind it** —
  `tuning.battleLayout.layoutArray[].minionHeightPercent` (74), applied through `hcHasAnchor`. The boss
  is sized off the battlefield rather than off the row, so she does not follow it down: she is the
  taller by construction rather than by each encounter being posed by hand.
- Browser-checked with the Matriarch plus three summoned Sporelings: every minion resolves to itself by
  body and by plate, the Matriarch resolves to herself by both, and her frame measures 550px against
  their 407px. Test [57].

### 15. Choose-one effects cannot be cancelled ☑

> There's no way to cancel choose one effects short of refreshing the page.

- **The grid rendered no Cancel at all.** The slot window (picking cards out of the hand) had one; the
  grid offered Skip only when the question allowed answering with nothing, so a one-of-two question —
  Brienne's Buckle, an event's choose — was a dead end with no way out but a reload.
- It was left out on the reasoning that "the effect list is mid-flight", and **that reasoning was
  wrong**: `resolveWithChoices` rolls the world back the moment a question is pending, so nothing has
  happened yet and taking the question back costs exactly nothing.
- **Who may cancel is the caller's to say, and it says so by handing over a way to undo.** An
  `onCancel` handler means "I know how to put this back"; `cancellable: true` on the request says the
  same thing in data. A question opened with neither still has no Cancel, which is what one that
  genuinely cannot be unwound should look like.
- Handlers added where they were missing: an event choice redraws the event with every option still
  open, and the shop's removal picker returns to the shelves (nothing is charged until a card has
  actually gone, round 04 item 3). `eventOverlay.repaint()` now finds the open event itself, so a
  caller that only knows something changed does not have to carry it.
- Browser-checked on Buckle: Cancel closes the window, the hand is unchanged at 4 cards and the energy
  at 3. Test [57].

---

## Cards

### Moved to Feedback-06

---

## Sound and performance

### 20. Beneficial effects use the damage sound ☑

> Beneficial effects are currently using the same sound effect as damage.

- **They did, and here is the route:** `cardPlay` and `damageDealt` were both mapped to the host's
  `hammer` stem, so playing a heal made exactly the sound of being hit.
- **A play now sounds like what the card DOES.** `tuning.audio.cardPlaySoundArray` maps card type →
  sound event, and a card's types are DERIVED from its effects — so a card that heals is Support
  without being told and nothing is authored per card. A card with no listed type falls through to
  `cardPlay`. Support gets `pickup`, Negative `sell`, Passive `purchase`; Damage keeps the hammer.
- **Three beats were silent because they named an event nobody had mapped.** `statusApplied` was called
  by the lust, status and recovery handlers and was not in `eventMap` at all, so it played nothing.
  It is mapped now, along with new events for healing, gaining Temporary HP, gaining Lust, breaking
  and recovering — each with its own stem.
- **Judgment call, flagged:** the host has exactly nine usable sfx (`sound/sfx/`), so these are
  reassignments of existing sounds rather than new ones. Every mapping is one line in
  `tuning.audio.eventMap`; say the word and any of them moves. Test [57].

### 21. Choppy, and slow to load ☐

### Moved to Feedback-06

---

## The between-run weakness ledger

### 22. Show the steps that form the ranks ☑

> Please visually show the steps that form the ranks in weakness advancement.

- The weakness track on the character sheet is now a **stepped rail** rather than one continuous fill:
  the three rank thresholds are drawn as notches at their real positions along it
  (`tuning.lust.exposureRankArray`, so they move with the numbers), the reached ones lit, and the fill
  stops at the notch it has reached. What is left to the next rank is written beside it ("6 to
  Susceptible").

### 23. Weaknesses need tooltips, with titles and descriptions ☑

> Weaknesses really need tooltips, not just explaining the sources but giving each rank titles and
> descriptions (which can be placeholders for now).

- Each rank in `tuning.lust.exposureRankArray` gained a `description` beside its existing `name`
  (placeholders, flagged as such), and each lust tag in `honeycomb.lustTagArray` gained a `name`, a
  `description` and a line naming what inflicts it.
- Hovering a weakness row gives: the tag and what it is, the rank reached with its title and
  description, what multiplier that rank costs, how far to the next one, and what has been feeding it.
  Hovering a rank notch names that rank on its own.

### 24. A weakness may rise only one rank per session ☑

> The most any weakness should rise in one session is a single rank.

- `profile.lustRankGainArray[character][tag]` counts the ranks gained since the run began, and
  `honeycomb.lust.recordExposure` stops the count at the threshold of the next rank once
  `tuning.lust.maximumRankGainPerRun` (1) has been taken — the exposure is still recorded, it simply
  cannot push past the ceiling until the run ends. Cleared at `runStart`, which is the session
  boundary the ledger already uses.
- It is a tuning number rather than a constant, so a challenge run or a difficulty mode can lift it.

### 25. Something must happen when a rank goes up ☑

> There should be some kind of popup when a weakness rank goes up.

- `honeycomb.weaknessOverlay` — a short cut-in over whatever screen is up when a rank is crossed: the
  character, the tag, the rank's new title and its description, and the multiplier it now carries.
  Driven from a `lustRank` log entry, so it plays as a beat of a combat replay exactly where the rank
  was crossed, and plays directly when one is crossed outside a fight.
- Queued rather than stacked: two tags crossing in one action play one after the other.
