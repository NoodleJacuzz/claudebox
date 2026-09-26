# Engine — `engine/`

The engine and its screens: the combat UI, the map and the rest node, the shop, audio, performance, and
the cross-cutting verbs the other pipelines need (the old `ui/`, `map/`, `audio/`, `performance/`).
Noodle's pipeline **Engine**; on the second demo's gate as:

> - New SFX collection
> - SFX assignment
> - Elite music
> - Boss music
> - Shop enhancement (dragging to assign neutral ownership)
> - Rest site audit (I know it needs more complex image picking to show multiple party members, but it's quite close to fine already due to work we did with rest site upgrades)

**How this file works.** One file per pipeline: where the work is, the rules, then the queue in Noodle's
words. When an item closes, cut its `###` section and paste it at the top of `ARCHIVE.md` beside this
file, the same minute. `../FEEDBACK.md` indexes the count. Quotes are his, verbatim, and win over any
annotation. Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted.

---

## Where it stands

- **The verbs the other pipelines are waiting for**, in the order the gate forces them: the `heat` lust
  tag and the Heat status, Poison `decayMode: "halve"`, the unlock routes (`../relics/RELICS.md` B1),
  reward weights 85 / 15 with a held-card weight, the default signature (`randomCardCount` removed), a
  per-tag flag the rank multiplier skips, the Bastion hooks (incoming damage landing as Lust; half the
  party's Lust landing on Brienne), a `discoverCard` verb and an exact-damage hook for the two neutrals,
  the unplayed-card hook for broken starters (`../card_pool/CARD-POOL.md` A1), and the Charm scrub with
  `reconcileWeaknessLedger` dropping dead tags. The list with its seams is `../card_pool/CARD-POOL-02.md` §5.
  Added session 65, the relic rarity verbs (`../relics/RELIC-REWORK-01.md` §5): a rarity table with weights
  and persistence, one weighted `rollRelic` for every source, the boss relic choice, relic owners, and the
  switch that keeps the run's final boss from paying a relic.
- **Loading.** Both pages carry one loader line; a new Honeycomb file is a line in
  `honeycomb-loader.js`, never a page edit (suite block [142]); every request carries an hourly `?v=`.
- **Performance.** Measured session 47: the rules engine is under 2 ms a turn; `repaint()` is 13 ms with
  layout and rebuilds 160 images per beat (lever 3); the boot is 15 MB in 93 scripts, 12 MB of it Syrup
  Town (lever 9); 29 infinite animations idle. Telemetry is possible from neocities and never by it
  (`TELEMETRY-01.md`); **the endpoint is unpicked**. Performance was the top demo goal on 2026-09-19 and is
  absent from the 2026-09-25 list; it is read as a standing concern.
- **Screens.** Both acts live, three routes reachable and named (session 55). Built and waiting on his eye:
  the Battle Lab fixes (A10), enemy title shadows (B32), the nameplate fade (A-S47e), the sprite height cap
  decision (A-S47h), the title-screen play button (S58-1). Open: the hand's feel (B6), the whole-party
  campfire picture (B30), region 1's water paint (B31), a debug boss-roll override (B41), two CSS defects
  found by the gallery (G10, G11), and his two gate lines (S64-1, S64-2).
- **Audio.** Cards and stingers are assigned and mixed; enemies and descent are not; four files are too
  quiet at source; there is no short movement stem. Three looping tracks are built (`MUSIC.md`) and
  **wait on his ear**; elite and boss songs are his to supply, one row and one cue each. The new SFX
  library is his to supply; the assignment pass runs through one table, which is `../tooling/TOOLING.md`
  Q5's question.

## Files

| File | Holds |
|---|---|
| `ENGINE.md` | this file |
| `MUSIC.md` | the music build: what was measured in his three songs, where each was cut and why, the gapless lap, how Syrup Town's music is set aside and handed back, what is not done |
| `TELEMETRY-01.md` | whether telemetry can be collected at all (yes, from both hosts, never by them), the two endpoint options, the volume model. Nothing is built until he picks an endpoint |
| `ARCHIVE.md` | closed items from this file |
| `../Archive/demo1/` | `ui/`, `map/`, `audio/`, `performance/` (their old catch-ups and every item closed before 2026-09-25), `gallery/` (the Event Gallery's design), `../Archive/demo1/Archive/TOOLTIP-PLACEMENT-01.md` (read before changing tooltip placement), `../Archive/demo1/Archive/FEEDBACK-07-DONE.md` (the session-12 cause list the lever numbers refer to) |

Reference before touching anything here: `../reference/ARCHITECTURE.md` (the file map, the five ideas,
the registries, driving the engine headlessly), `../reference/SCALING-01.md`, `../reference/BROKEN-01.md`,
`../reference/TRAPS.md` (grep it), `../REQUIREMENTS.md` (every host contact).

Live: `scripts/misc/honeycomb.js` and `scripts/misc/honeycomb/*.js`, `scripts/css/honeycomb.css`. Sound
in `honeycomb sound/sfx/`, music in `honeycomb sound/music/loop/`.

```
node "!designDocs/honeycomb/tools/audit-turn-time.js"       expected vs actual turn time, long tasks, drag cost (browser)
node "!designDocs/honeycomb/tools/audit-sprite-fit.js"      sprites off the screen at a window shape (browser)
node "!designDocs/honeycomb/tools/audit-scale-parity.js"    a phone-sized copy against desktop (browser)
node "!designDocs/honeycomb/tools/sfx-report.js"            sound assignments, gaps and volume findings
node "!designDocs/honeycomb/tools/encounter-coverage.js"    which encounters a run can reach
node "!designDocs/honeycomb/tools/ptr-check.js"             the Public Test Release against the local files; run after every upload
```

## Rules this pipeline must not break

- **No magic numbers.** Every number is in `honeycomb-tuning.js` or a named field on a content entry.
- **Adding content is a table entry only.** Needing engine code means a verb is missing; add the verb.
- **One host seam.** All Syrup Town contact goes through `honeycomb.platform`; `honeycomb.image(path)` is the only reference to `v13 spire images`.
- **No document or window input listener, never `.puzzle-piece`**, pointer capture on Honeycomb's own elements (`../REQUIREMENTS.md` §8).
- **Combat is headless and the screen replays a log.** State is final before the first frame draws; a repaint can be made cheaper with no risk to the rules.
- **Every length is a honeycomb pixel; every provisional element is tagged `HC-PLACEHOLDER`.** SVG for icons, HTML and CSS for widgets.
- **Every hover needs a touch path.** A tooltip never covers its anchor; tooltip sentences live in `honeycomb-text-tooltips.js`, never inline.
- **A helper the suite must see cannot live in `honeycomb-ui.js` or a scene file.**
- **Timing goes through `tuning.animation`**; reduced motion is a tuning switch, not a bare media query.
- **A sound assignment is a row in `tuning.audio.eventMap`**; a lap never uses `audio.loop`; Syrup Town's songs are muted, never paused.
- **Node weights are tuning**, and an event effect that changes the world logs it.
- **A new Honeycomb script goes in the loader.** `devPreviewTarget` is `""` in any release build.
- **Numbers beat descriptions.** A performance claim without a measurement is not a finding.

---

## The queue

### A10. The Battle Lab — ANSWERED (session 39): it is buggy, not just unreviewed ⏸ (all three fixed session 47 — waits on his pass)

> Last I checked battle lab was still wildly buggy with no tooltips over the card selection, multiple
> buttons couldn't actually be clicked, very weird behavior when summoning bosses to player side.

Three concrete defects, so this is no longer "it wants your pass":

1. No tooltips over the card selection.
2. Multiple buttons cannot be clicked.
3. Summoning bosses to the player side behaves very strangely.

**Session 47 — all three found by measurement, fixed, and ⏸ waiting on his pass** (suite block [118]):

1. **Tooltips.** The picker drew every face with `showTooltip: false`: 0 tooltip hooks on 251 cards. Now
   251; hovering a face opens the ordinary card panel, on screen and above the picker (measured).
2. **Buttons that cannot be clicked = the character filter row.** `All / Brienne / … / Neutral` was
   **4px tall**: the panel is a height-capped column, the card grid holds 4169px of cards, and the
   filter row is `.hcSegmented`, whose `overflow: hidden` lets flexbox crush it. Now 24px, **9 of 9
   pressable (was 0)**. Every other lab control hit-tested fine: 16/16 on the board, 40/40 in each
   Add picker, 3/3 energy. *If he meant different buttons, this is the list that was checked.*
3. **Bosses on the player side.** A back-anchored boss stood behind the PARTY as she would behind her
   brood, and her raised plate (224–529px) covered two party members' plates and medallions. An anchor
   now holds only on the line it was written for (`placementAnchor`): she takes a row place, all four
   ally plates hittable, and the enemy-side boss is unchanged. **Not changed, on purpose:** she still
   faces the same way on either side — that is session 43's A24 ruling (art faces the viewer; no
   mirroring), not a bug. If "weird" meant something else, it is still open.

Still **demoted** — the Battle Lab serves no demo goal, so this is a bug list to fix when it is cheap,
not demo work. `../Archive/demo1/Archive/FEEDBACK-07.md` §A2 has the shape, how it is driven, and the traps to read
before changing it.

---

### B6. The hand ◐

> The primary bug reports have been "the hand [of cards in battle] does not feel good". Investigating
> this is a high priority.

The 10-card cap is in (your call, session 13) and the bounce is fixed (session 36: `repaint()` was
replacing the hand bar's `outerHTML` under a stationary pointer; hover now carries across as
`hcHandRaised`). What is left is the feel and legibility pass, and lever 3 in B14 — the repaint cost
underneath it. **Now also a B16 item**: "does not feel good" and "runs poorly" may be the same report
in different words.

**Session 47.** One more cause closed: the hand dropping and re-opening after every card (B34 — two
repaints inside a frame lost the carried hover). Every player saw that one on every play, so it is a
fair candidate for much of "does not feel good". A pointer sweep across a full ten-card fan (dead zones,
hysteresis between neighbours) was set up and **NOT measured** — the browser pane stops drawing frames
while hidden. It is the next measurement and it needs a visible window. One number from the setup worth
keeping: at rest each slot's hover box starts ~59px ABOVE its sunk card (slot top 584, card top 643 at
1280x720), so the hand opens before the pointer reaches anything visible. At 16:9 that zone clears the
party plates; in a squarish window it covers them, and a raised card took the click meant for a medallion.

---

### B34. Hover lost across a repaint: the fighter shrink-and-grow, the hand close-and-open ◐ (session 47)

> Clicking on a character's ability button to bring up their list of abilities makes them shrink and
> grow, likely triggered by the hover effect being active, stopping for for a single frame, and then
> hover triggering again, causing a sort of zoom-in-zoom-out effect
> A similar bug I think may be related. When playing a card from hand, with my cursor still over the
> hand, once the card I've played resolves, my hand closes then opens again.
> Please, I need your help with this one, I just know if this makes it to the live release it'll be a
> huge drag on player experience.

Fourth appearance of one mechanism (FEEDBACK-08 hand bounce, `chessmaster/` A11 twice): `:hover`
belongs to an element, `repaint()` replaces the element, and the new one is not hovered until the
browser notices.

**Hand half — cause MEASURED and fixed.** Session 36's carry asked the old hand `:hover` only. Two
repaints before the browser re-hit-tests: the second finds a hand that is marked `hcHandRaised` but not
yet `:hover`, carries nothing, and the hand sinks. Measured live, pointer parked on the hand:
before `{hover}` → after one repaint `{carried}` → after two `{neither}`. After the fix, three
back-to-back repaints: card offset 0 on all 12 following frames.

**Fighter half — mechanism fixed, HIS EXACT PRESS NOT REPRODUCED.** Fighters had no carry at all, so
any repaint under the pointer dropped the 1.15 step-forward and regrew it over 160ms. Now carried:
two back-to-back repaints, scale 1.150 on every frame, no dip. **But** a medallion press in a plain
fight (Brienne/Severine/Nettle, `loneSporeling`, synthetic pointer) causes NO repaint and no class or
transform change on any fighter — `openAbilityMenu` really is in-place. Ruled out: native image drag
(`-webkit-user-drag: none` throughout), tooltip stealing the pointer (`pointer-events: none`),
`:active`/`:has` rules. So whatever repaints on his press is state this harness did not have.
**⏸ If it still happens: which character, was a card/ability mid-resolve or queued, which browser.**

The fix (`honeycomb.combatScene.carriedHover`, suite block [115]): both selectors accept `:hover` OR
the carried class; the class is dropped on the scene shell's next `pointermove`, when `:hover` is the
truth again. No position tracked, no layout forced.

Found on the way, NOT fixed: `.hcDepthFocus:not(.hcBusy)` in `honeycomb.css` can never be false —
`hcBusy` is put on `#honeycombRoot`, `hcDepthFocus` is on the screen inside it — so the comment's
"a replay keeps the board it owns" is not what happens. Harmless today; decide before relying on it.

---

### B35. Enemies vanish on their own beats; blue attack frames; cards without their placeholder ◐ (session 47)

> Hrm, is there a reason a number of cards don't have the usual placeholder art? Or why the knight's
> Caracole has a blue frame?
> Hold on, wait, enemies are vanishing when playing their cards, as if their placeholder offensive
> frames didn't exist, and all the game's attack cards have blue frames, what's going on? Oh no.
> Please be careful, another agent is in the background at work.

Three symptoms in one report. Only the first has a cause that could be measured from here.

**1. Enemies vanishing — CAUSE MEASURED, FIXED.** The battle screen rests every sprite on the `combat`
pose (`honeycomb.art.combatStanceEnabled`, session 35), which is only safe while every sprite set has a
`1-combat.webp`. **Eleven enemy sets have none** — alchemist, capBrute, gardener, gloomWisp,
hollowKnight, juggernaut, matriarch, sage, scavenger, shield, sporeling (the real-art originals; the
generated sets all have one) — plus one seer outfit. A repaint's sprite tag drops paths already known
missing, but the LIVE pose swap (`applyPose`, every beat) walked the raw chain: after each card an
enemy was set to a path that 404s, stood blank until the server answered, flashed the hatched
placeholder, then fell back to `basic`. Measured on the sporeling: `passive → combat (404, blank) →
placeholder → basic (blank) → basic`. After the fix (`honeycomb.art.liveChain`, shared by the tag and
the swap): `basic → passive → basic`, 0 placeholder frames, 0 blank frames in 160 samples. Suite block
[119]. **Not done:** the eleven still miss a `combat` drawing, so their first render each session still
asks for it once; `../tools/generate-placeholder-art.py` would write a stand-in copy of `basic` for them
(that is what "use existing basic poses in the meantime" asked for) — not run, because the art pipeline
reads what exists on disk and Noodle asked for care while another agent was working.

**2. Blue frames on attack cards — NOT REPRODUCED HERE.** A damage card's chrome is a tinted copy
(`cards/chrome/tint/damage/*`, six files, unchanged since 09-17) over the untinted blue piece; the
tinted copy failing is exactly what turns every attack card blue (`honeycomb.ui.cardChromeFallback`).
In the pane all six load (200, 1176×1500) and Drain draws red. So on his side those requests failed
— and a failure is remembered for the whole session (`missingPathArray`), so one bad moment (a file
being rewritten, a server hiccup) stays blue until reload. **⏸ Which URL was he playing on (localhost,
neocities, file://), and does a hard reload clear it?**

**3. Cards without the usual placeholder art — NOT REPRODUCED.** 149 player cards name an art file that
is not on disk and get the hatched placeholder by design (`imageFallback`); `artOwed` cards get it
without a request. Nothing renders blank on purpose. **⏸ Which cards, and what shows instead — blank,
or a wrong picture?** Caracole resolves to `cards/art/anastasia-piece`, type damage.

---

### B32. Enemy titles are hard to read ⏸ (built session 47 — waits on Noodle's eye)

> Enemy titles small and hard to see, need better shadow behind words

Legibility, and his fix is named: a better shadow behind the text rather than a larger font. Shares a
pass with **B27** and the card chrome work. Both the shadow and any size change are numbers.

**Session 47 — the shadow is built, the size deliberately is not.** The name (`.hcFighterFeetName`)
stands on the painting, not a panel, and wore the general `--hc-text-shadow`: a rim about a pixel wide.
New token `--hc-title-shadow` beside it: the hard drop, a hard rim on all four diagonals, and two
stacked dark halos (5 and 8 honeycomb px) that read as a plate behind the word. Computed on the live
element: 7 layers against 3.

**Why not bigger — measured.** At 13px the longest name (The Sleeping Sister, 121px) fills a LONE
enemy's 123px box; at 16px nine names overflow it. And the old one-line-plus-ellipsis rule was already
cutting names: in a squarish window **16 of the 55 encounters with 3+ enemies** showed "Windfall Alr…",
"Spore Alch…" (boxes 88px), and every name in the six-body gauntlet fights. So the name now WRAPS
upward instead of being cut. Audited across all 87 encounters at three shapes: 961×922 → 192 one-line,
69 two-line, 0 cut, 0 over two lines, 0 escaping the frame; 1280×720 and 812×375 → 261 one-line, 0 cut.

**⏸ His call:** whether the shadow is enough, or the size should go up too now that wrapping makes it
safe (it would cost two-line names at 16:9). The pane could not zoom, so no screenshot here shows the
shadow at a size worth judging — look at it in a real window. Suite block [117].

---

### A-S47a. The enemy-detail window's "Next" button is behind the card ☆

*Filed here session 47 from `../Archive/demo1/chessmaster/HANDOFF-S47.md`, which is the Anastasia lane's file. Noodle's
words, byte for byte; the lane that owns the screen owns the fix.*

> In the detail window for clicking on enemies and golems, the "Next" button is blocked by the card it's meant to be hovering above, it's too low and behind the card to be seen.

Where to look: `honeycomb-overlays-combat.js`, the `enemyMoves` overlay. Not touched by the Anastasia
lane — it is the shared enemy-detail overlay, and every enemy in the game has it.

---

### A-S47b. `[intent.whoseMove]` is printed raw in the detail menu ☆

> Below the cards in the detail menu is text such as [intent.whoseMove], confirm intentional

**Not intentional, and half-diagnosed already.** `[intent.whoseMove]` is the KEY of a tooltip text
(`honeycomb-text-tooltips.js`, around line 57) reaching the screen unresolved.
`honeycomb.tooltip.text("intent.whoseMove", { name })` at `honeycomb-tooltip.js` ~861 resolves it
correctly, so the caller in the enemy-moves overlay is passing the key down a path that never looks it
up. Same overlay as A-S47a.

---

### A-S47c. tHP forecasts push intent cards over other enemies' health bars — and should go ☆

> hcPlateTemporaryLabel on enemies pushes intent cardsover other enemy's health bars. See hcPlateTemporaryLabel.jpg. Genuinely, remove the forecasts for tHP, they've caused nothing but trouble.

**This is a REMOVAL, not a layout fix** — he named the outcome he wants. `honeycomb-forecast.js` and the
plate's `hcPlateTemporaryLabel`.

---

### A-S47d. The party icon's alert fires with no cause, and the party menu says too little ☆

> The party icon on the top menu has a "partyAlert.Heading" message, nothing disables it, no clear cause, opening the party menu does not list the level of detailed statistics I'd expect it to, like lust rates.

Two things in one report: the alert's CONDITION (`honeycomb-tooltip.js` ~333, `partyAlert.heading` =
"Someone is Broken" — note the capital H in his quote suggests the key is reaching the screen raw here
too, which would make this a cousin of A-S47b), and what the party menu chooses to SHOW. Lust rates are
the example he gives of what it is missing.

---

### A-S47e. Nameplates grow with the sprite on hover — FIXED session 47, ⏸ waits on his eye

> Okay, big change. Nameplates (including health bars, abilities, debuffs) should not grow with the player sprite on hover. Instead, their non-hover state is semi-transparent, and their hover state is at normal opacity. This should be for players only. I'm really tired with how all the buttons and bars shift around when hovering over a character.

**The cause.** The depth-focus step forward was worn by the whole COLUMN (`.hcFighter`), so the health
bar, the status circles and a piece's move button all grew by `--hc-depth-forward-scale` and slid down by
`--hc-depth-forward-drop` along with the drawing. That is a press target moving out from under a pointer
that is on its way to press it, which is what the last sentence of his report is about.

**The fix**, in `scripts/css/honeycomb.css`: the hover rule now puts the transform on `.hcFighterSprite`
— the plate's SIBLING inside the frame — and leaves the column carrying only `z-index`, which moves
nothing. What tells the player their pointer is on a fighter is the plate coming up to full opacity
instead: `--hc-plate-rest-opacity` (`tuning.layout.battleLayoutArray[].plateRestOpacity`, 0.68) at rest,
1 on hover, on the carried-hover class, and while focused or targeted. **Party side only**, as asked —
an enemy's plate is unchanged. A touchscreen has no pointer to rest anywhere, so `@media not all and
(hover: hover)` leaves every plate fully lit rather than permanently dimmed.

**⏸ His call:** whether 0.68 is the right amount of quiet. It is one tuning number, and 1 turns the fade
off entirely without putting the growth back.

---

### A-S47h. Sprites are sized by WIDTH, so a canvas of another shape draws another height — FIXED session 47, one decision left ⏸

Raised by Anastasia's crouch (`chessmaster/`), but it is an engine fault and it can bite any drawing.

> She's still growing taller when doing her support pose.

`.hcFighterArt` carries `max-height: var(--hc-ally-sprite-height)`. It is a **percentage**, and its
containing block has no definite height — so it resolves to `none` and **has never applied**. What
actually governs is `max-width: 150%`. Her crouch poses are 650×1300 against the combat pose's 832×1216
and drew **458px tall against 335** at 1024×768.

`honeycomb.art.normaliseCanvas` scales the width cap by how far the drawing's shape differs from
`tuning.art.spriteCanvas` (832×1216 — the shared canvas `../reference/ART-GUIDE.md` already declares). A
drawing of the same shape is scaled by exactly 1 and written no inline style, so nothing that was right
changes. Measured after: all four of her poses draw at 335px.

**⏸ HIS DECISION, deliberately not taken:** `allySpritePercentHeight` is dead tuning — 100 in the scene
profile, never applied. Honouring it would make **every ally 14% taller** at a stroke. That is a design
change, not a bug fix, so the cap was left alone and only the canvas SHAPE is corrected.

---

### S58-1. A proper Honeycomb play button on Syrup Town's title screen ⏸ (built session 58 — waits on Noodle's eye)

> Make proper honeycomb play button on menu (Wait maybe I'll let you handle this one, needs to work on
> mobile portrait and landscape, button spacing hard, on the menu? Idk, tired)

> Actuly please do take a crack at it, one-line disable in case I need to do it myself, worst case I
> lose a few seconds

**Built in `scripts/gameplay/title.js`** (host code, not Honeycomb's). Before this, the only way in was
an invisible 48px square in the title's top-left corner, which still works.

- **The one line:** `var titleHoneycombButton = true;` near the top of `title.js`. Set to `false`, the
  title lays out exactly as it did before: the same `titleButtons` arrays and no inline widths
  (checked live in both orientations).
- **The look:** Honeycomb's own dark plate and gold frame (`ui/buttonBack` under `ui/buttonFrontGold`,
  through `honeycomb.image`), with "HONEYCOMB CATACOMBS" in the display font, so it reads as a separate
  game. It uses `.titleButton`, so it rises with the others and dims on hover.
- **Landscape:** centred on the path under the row of four buttons, 6% of the screen's width tall, or
  less when the space under the row is shorter than that.
- **Portrait:** the four buttons had no room under them, so `layoutTitleHoneycomb()` re-spaces the
  column into five rows with the Honeycomb button last. On a tall phone (375×812) the buttons keep
  their width and only move up. On a short phone (375×667) they narrow from 50% to 44% of the screen.
- **Measured live** on 375×812, 375×667, 768×1024, 812×375, 1024×768, 1280×720, 1920×1080 and
  2560×1080: no overlaps, nothing off-screen, the column below the title letters, the label 74% of the
  button's width. On a phone held sideways (812×375) the button is only 40px tall, which is the tightest case.
  Clicking it opens Honeycomb; its centre is not covered by anything; leaving Honeycomb brings the
  title back with the button.
- **Suite block [138]** runs the same layout function on 16 screens and checks all of the above, and
  that the flag guards both the layout and the button. Six deliberately broken copies of the layout
  were each caught.

**What his eye is needed for:** whether it should be bigger or more like the Syrup Town buttons, and
whether "HONEYCOMB CATACOMBS" is the label he wants while the name is a placeholder.

---

### S64-1. Shop enhancement: dragging to assign neutral ownership ☆ — FILED 2026-09-25

Noodle, in the housekeeping message that set the second demo's gate (`../BASICS.md`, the second demo):

> - Shop enhancement (dragging to assign neutral ownership)

**Depends on the neutral tier landing.** `../card_pool/CARD-POOL-02.md` §3.7 puts one neutral in every
shop and none in an ordinary reward, so the shop is where a neutral is bought and where its owner has to be
chosen. Before designing the drag, measure how a neutral card is owned today, since the card's owner is
what decides whose hand it is played from and whose poses and sounds it uses. The drop targets already
exist: P18 (archived) put a row per party member between the shop's tabs and its stock. The drag itself
follows the hand's rule, pointer capture on the element and no document listener (`../REQUIREMENTS.md`
§8), and a touch phone needs a tap-to-assign fallback (`../mobile/` S64-1).

---

### B30. Camp image should reflect party composition ◐ — the leader half built session 58b

> Need to implement system to pick camp image based on party comp and other requirements

A selection system, not an art job: the camp image resolves from party composition plus other
conditions. The requirements beyond party comp are not specified — ask before building, or build the
resolver so conditions are table entries and the set can grow without engine work, per the standing
modularity rule.

**Session 58b, part of this:** the campfire picture now follows the character at the front of the
party, one picture per character (see B42 in `../Archive/demo1/map/_archive/FEEDBACK-DONE.md` for the files). That covers the leader only. A
picture that depends on the whole party, or on anything else, is still open, and the requirements
beyond party composition are still unasked.

---

### B31. Region 1 is still painted for water ◐ — FROM `enemy_overhaul/`; the routes and the name landed, the paint remains

**Where it stands 2026-09-25.** Items 2 and 3 below closed in sessions 45 and 55: three routes, each
with its own boss pool, chosen by the Act1-1 boss the run beat (P28, archived). Item 1's NAME closed in
session 55 (P9, archived: the Mushroom Frontier, his word on the day; Myconid Navel is kept for a later
area). **What remains is the paint:** `colorNear` / `colorFar` are still cold blues and the
`vaultCauseway` backdrop's anchors are still piers. Noodle should pick the colours himself; the backdrop
is an art job for `../art_pipeline/`. The text below is kept as the record of the item.

Session 42 settled Act 1's structure (`../designBibles/story.md` §4) and it lands on this folder:

| Term | Means |
|---|---|
| **Act1-1** | The base mushroom biome. Splits into the sub-acts. |
| **Act1-2** | Catch-all for whichever sub-act follows. A term, not a place. |
| **Act1-A** | The Mushroom Frontier. **Live** — this is region index 1 today. |
| **Act1-B** | Flora. Empty. |
| **Act1-C** | The Pollen Road. Empty. |

Noodle: *"the demo ships with act 1-1 and act1-2, so all three routes are in scope."*

Three things owed here:

1. **Region 1 is named and painted for water it no longer has.** `honeycomb.regionArray` calls it
   *"The Flooded Vault"*, described as *"Deeper, colder, and something down here is still counting"*,
   with `colorNear: "#1b2f3a"` / `colorFar: "#0e1720"` and a `vaultCauseway` backdrop whose anchors are
   `northPier` and `southSteps`. The Mushroom Frontier is timber and amber, not piers.
2. **One region slot has to become three selectable sub-acts.** This is `enemy_overhaul/` E5's
   structural half: *"The code separates them into 'regions' but this is a mistake."* The pieces are
   already there — `bossEncounterIndexArray` rolls per run from a pool, and `regionIndexArray` filters
   encounters — so this is closer to a renaming plus a selection step than a rebuild.
3. **Each sub-act needs its own boss pool.** Act1-A has one (Juggernaut, Tallyman). B and C have none.

Blocked on nothing here; `enemy_overhaul/` owns who lives in B and C, this folder owns how a run
reaches them.

**SESSION 44 raised item 1 from cosmetic to contradictory.** `enemy_overhaul/` recast Region 1's five
enemies as dry frontier myconids under arms (Silt Crawler → Shieldcap, Mire Eel → Cagecap, Bog Toad →
Bolete Hook, Lantern Jelly → Foxfire, Drowned Salvager → Scrap Salvager) and renamed twelve of its
encounters off the water theme. The enemies and the region they stand in now disagree outright, which
reads worse than the old state did. The enemy-side half is finished, so what is left is this folder's:
the region's `name`, `description`, the two colours and the backdrop. **Noodle has already chosen the
title — `../BASICS.md`: the live act 1-2 "is to be titled *Myconid Navel*"** — which is why session 44
left it rather than picking one. Tracked from the other side as `enemy_overhaul/` E8.

---

### B41. He cannot reach the three routes, and the game never tells him how ◐ — ANSWERED SESSION 51; the tooltip landed session 55, the debug override remains

**Where it stands 2026-09-25.** Point 3 closed in session 55: the boss node names its boss, its health
and its route once the boss has been met (P29, archived). What remains is point 4: a debug-only
override on the Act1-1 boss roll, a way to clear a region, and an encounter picker grouped by tier and
region. `tools/`-shaped work; no design decision.

> I don't know how to trigger the three 1-a, 1-b, and 1-c routes and testing with the debug tools is so
> slow it takes forever to get to the boss and there's still only one?

Three questions in one sentence. All three have answers, and the third one is a real bug.

**1. How a route is chosen.** The Act1-1 boss the run has just beaten decides it. The table is
`tuning.map.route.byBossArray`:

| Beat this boss | And the run descends into |
|---|---|
| The Shroud (`tallyLedger`) | The Flooded Vault — Act1-A |
| The Head Gardener (`gardenerGrove`) | The Thorn Arbor — Act1-B |
| The Matriarch (`matriarchLair`) | The Pollen Road — Act1-C |

So a route is not picked on the map. It is decided a whole region earlier, by which of the three bosses
the map happened to roll.

**2. There is more than one boss — six in Act 1.** Three at the end of Act1-1 and one at the end of each
route (The Juggernaut, the Arbor Sisters, The Pale Dray). The Act1-1 boss is rolled when the map is
generated, from `bossEncounterIndexArray` on `upperCatacombs`, and all three carry `weight: 100`. Over
90 generated maps it came out 33 Head Gardener / 29 Shroud / 28 Matriarch, so the roll is fair. He is
seeing one per run because there is one per run, and the only way to see another is to reroll and play
the region again.

**3. The bug: the boss node never says which boss it is or where it leads.** `tuning.map.route`'s own
comment says *"the boss node's own preview is therefore the whole tooltip for the choice"* — but that
tooltip was never written. The boss node's preview reads, in full:

> Boss — 1 foe. The thing this place belongs to.

It does not name the boss and it does not name the route. **That is why he does not know how to trigger
the routes: the mechanism that decides them is invisible.** A player beats a boss and arrives somewhere
with no way of knowing that beating a different one would have led elsewhere. Writing that tooltip is
player-facing text, so it is his to approve — the point of this item is that the slot is empty, not
what should go in it.

**4. Why testing is slow, and what already exists.** The debug menu has a *"Fight to start"* picker
listing all 83 encounters and a test-battle button, so any boss can be fought directly — `drayRoad`,
`gardenerGrove`, `tallyLedger` are all in it. There is also a quick *"Win the current battle"* shortcut.
What is missing is anything that reaches a boss **through the map**, which is what he needs to see the
route mechanism at all:

- No way to force which Act1-1 boss a map rolls, so the route he gets is a one-in-three dice roll.
- No way to clear a region, so reaching a boss in a real run means entering and winning every node.
- The encounter picker is 83 rows in content order, labelled by index rather than name, with no grouping
  by tier or region.

The first of those three is the one that unblocks him. It is a debug-only override on the boss roll,
which is `tools/`-shaped work and needs no design decision.

---

### S64-2. Rest site audit ☆ — FILED 2026-09-25

Noodle, in the housekeeping message that set the second demo's gate (`../BASICS.md`, the second demo):

> - Rest site audit (I know it needs more complex image picking to show multiple party members, but it's quite close to fine already due to work we did with rest site upgrades)

**What the rest node has today**, so the audit measures rather than rediscovers: the campfire picture
follows whoever is at the front, one picture per character, and a path may name `{leader}` through
`{fifth}` (B42, archived); Sleep and Treatment remove as much Lust as they heal (S57-1, archived);
arriving refreshes abilities; the rest upgrades from the progression pass; the desk shows the leader
blocks. **The multi-member picture he names is B30's open half**, and it is the one piece that needs a
decision from him: which party combinations get a picture of their own, since twenty three-character
parties is twenty pictures (`../events/MAP-EVENTS-01.md` §"The art" priced it at nine minutes of Forge
time per look). Everything else in the audit is a browser pass: every rest option at every party size,
the picture that resolves, the button sentences, and the portrait phone (`../mobile/` S64-2), with a
suite check for each thing found.

---

### S66-1. The encounter block rule, and two enemy roles ☆ — FILED 2026-09-25 FROM `enemies/`

Noodle, opening the common-enemy session (the whole message is `../enemies/COMMON-ENCOUNTERS-01.md` §1):

> - Repetition prevention. The same encounter should never happen twice in a row. This should actually extend to elites and bosses as well. So a new rule; when an encounter is won, it's blocked from appearing for the next 2 encounters. And this reflects our design as well. If we have two encounters, one with 5 sporecaps, one with 4 sporecaps and a gloom wisp, those are so similar we have effectively bypassed the rule.

**Today there is no rule**: every node's fight is rolled when the map is generated
(`honeycomb.map.fillNodeContents`), so a path can serve the same fight twice running. **The verb asked
for** (`../enemies/COMMON-ENCOUNTERS-01.md` §9): the run keeps `recentEncounterArray`, the last two fights
won; entering a combat or elite node whose generated fight is on it re-rolls from the same pool without
those two, from the encounter stream, and writes the result back to the node. The map shows a tier and
never a fight, so nothing promised changes; determinism holds because the stream saves as `(seed, calls)`.
A suite block walks 200 generated runs and asserts no fight index repeats inside any two-fight window. The
pool arithmetic the rule needs (four fights a band) is in the brief's §3 and is the content side's job.
Inside a run bosses satisfy it by structure; whether he means it across runs is his (§10 there).

**With it, two rows for `tuning.balance.enemyRoleArray`**: `swarm` (0.20 / 0.20, five make a fight) and
`lone` (1.00 / 0.67, one is a fight), inserted where `COMMON-DRAFT-01.js` puts them, since
`enemyDifficultyRank` reads position; the compendium's `enemyGroupHeadingArray` wants a heading for each or
they land in "Other". And a load-time guard: a save whose map names a fight index the table no longer has
must re-roll that node rather than throw in `combat.begin`, because the draft retires twenty-one indices.

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

**Noodle, 2026-09-25**, in the housekeeping message that set the second demo's gate (`../BASICS.md`, the
second demo):

> - New SFX collection
> - SFX assignment

Read as two jobs in that order: a new library from him, replacing the borrowed Syrup Town stems and the
too-quiet files above, then the assignment pass through one table. Which table is `../tooling/`
Q5's question (35 cards carry an `sfx` field that disagrees with `cardSfxMap`), and the Quality Lab's
grid is the tool he wants to assign with, which is why the lab is listed among his early-stage blockers.
Enemies and descent are the unassigned half today; `../tools/sfx-report.js` is the audit.

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

**Noodle, 2026-09-25**, in the second demo's needs list (`../BASICS.md`, the second demo):

> - Elite music
> - Boss music

Two songs from him, each cut to his listening notes as the first three were, each one row in
`trackArray` and one cue (an elite fight and a boss fight are already distinct encounter tiers). The
three existing tracks still wait on his ear, above.

---

### A8. Telemetry — PROMOTED, endpoint still unpicked ⏸

> I wanted to know if obtaining telemetry data when the game was hosted on itch.io and neocities was
> possible, manual copy-out does not do that and the scale would be frankly horrible.

> Might be a demo goal. It would turn thousands of lurker players into real datapoints.

> A8 I don't actually know what the solutions you picked were, but you mentioned them not working on
> neocities? If they don't work on neocities (and only neocities, I don't want to bump heads with
> mopoga devs thinking I'm stealing from their servers), it's not an option. I'm not getting data from
> a locally played copy meant to be played offline.

**Correction — it does work on neocities.** `TELEMETRY-01.md` part 1 says collection is possible *from*
both hosts but never *by* either host: neocities and itch are static file hosts, so neither can receive
and keep a POST. The game is ordinary JavaScript in an ordinary browser, and outbound requests are not
blocked on either host. So the beacon goes **player's browser → an endpoint you own**. Neocities is
untouched by it.

Which also answers the mopoga worry, and better than he expects: **nobody else's servers are involved
at any point.** The endpoint is a URL you control — a Google Apps Script under your own account, or a
Cloudflare Worker under your own account. Neocities does not store it, does not forward it, and does
not pay for it.

His two constraints, and where they already sit:

- **Only the neocities build should report.** Not covered by `TELEMETRY-01.md` — **add it**. The
  endpoint URL is already a blank-by-default tuning value, so the clean shape is an explicit host
  allowlist checked before the payload is built: report only when `location.hostname` matches the
  neocities domain, silently no-op everywhere else. That keeps mopoga and any other mirror out by
  construction rather than by hoping the build is right.
- **No data from offline local copies.** Already true by design, part 4: BASICS requires the game to run
  from a local `index.html`, a beacon from `file://` simply fails, and the send is fire-and-forget and
  swallows its own errors. The host allowlist above makes it explicit rather than incidental.

**The two options, plainly** (`TELEMETRY-01.md` part 3):

| | Free tier | Effort | Reads back as |
|---|---|---|---|
| **Google Apps Script → Sheet** | effectively unlimited at this volume | lowest | rows in a spreadsheet |
| **Cloudflare Worker** | 100k requests/day | low, needs an account | Workers KV or D1, a little SQL |

Both are yours, both are free at this scale (~600 requests/day at 200 players × 3 runs), and neither is
Google Analytics — GA4 was ruled out on its adult-content terms, and that reasoning does not transfer
to a plain Apps Script writing to your own Sheet, though it is worth knowing it is still a Google
account holding adult-game data. **Cloudflare is the safer pick on that one axis**; Apps Script is the
faster one to stand up.

**This is the highest-value unanswered question in the file now**, because of B16. He wants to know why
players report bad performance and whether they are seeing something he is not — and this is the
instrument that answers it. It stopped being a metrics nicety and became the diagnostic.

Answered in `TELEMETRY-01.md`: yes from both hosts, but never *by* either host — both are static file
hosts, so it needs a third-party endpoint. One beacon per run end is ~600 requests/day at 200 players ×
3 runs, inside every free tier considered. GA4 is out on its adult-content terms. Recommendation: a
Google Apps Script writing rows to a Sheet, or a Cloudflare Worker if you already have an account.
**Pick one** and the build is a short session (TELEMETRY-01 part 6).

If it is built for B16 rather than for design metrics, the payload changes: frame cadence, device class,
and the `missed`/`dropped` counters matter more than run outcomes. Worth deciding the purpose at the
same time as the endpoint.

---

### B16. Performance: why it runs poorly for players ☐ — TOP DEMO GOAL

> High priority, most important demo goal is better performance. Why are players saying the game runs
> poorly? Are they experiencing different things than on my machine?

The question has two halves and they need different tools.

**"Why does it run poorly"** is B14 — the session-12 cause list, levers 3, 4, 5, 8, 9, 11, 12
outstanding. The three that punish weak hardware hardest are already known: combat repaints rebuilding
the whole screen from `innerHTML` every `afterBeat` (3), forced synchronous reflows (4), and many small
DOM writes per beat (8). None of them need a player report to justify fixing.

**"Are they experiencing different things than on my machine"** cannot be answered from this machine at
all, and that is the real content of the question. His hardware runs Stable Diffusion locally; player
hardware is phones and old laptops. The known asymmetries:

- **Battery savers cap the page at ~30Hz** (A12's `cadence` note) and read as the game stuttering.
- **Weak GPUs** make lever 12 (VFX SVG filters, GPU work per effect) dominant where it is invisible here.
- **Mobile browsers** re-layout far more expensively, so levers 3, 4 and 8 scale differently there.

So this goal needs a measurement path, not just fixes: **A8 telemetry** for scale, **A12** for one real
device, and a decision on whether to ship a low-effects default rather than an opt-in.


**Session 47 measurements (annotation on B16 — not a new item)**

> I've heard from playtesters playing on neocities that the game "performs poorly", and that the
> "engine is slow and clunky". Again, this could be an early grave for the game I've worked so hard on.

Measured on Noodle's machine, 1280x720, three-member party against `loneSporeling`. **The pane caps at
30fps (frame cadence 33.4ms median AND max), so no GPU or frame-rate claim below is possible from here.**

| What | Number | Reads as |
|---|---|---|
| Rules engine, one whole end-turn (end + enemy + start) | **< 2ms** total; forecasts 1.5ms | The ENGINE is not slow. Nothing to win here. |
| `repaint()` script only / with its layout | **4.7ms / 13.3ms** | Lever 3, confirmed and sized: most of a 60Hz frame here, so 50-80ms on a phone, once per beat. |
| Combat DOM | 466 nodes, **160 `<img>`**, all rebuilt per repaint | Every repaint re-creates 160 images. Cached locally; over neocities each is a cache lookup and possibly a decode. |
| Standing GPU load at idle | **29 infinite animations**, 23 filtered elements, 19 masks, 12 blend modes, 23 `will-change` | Lever 12's neighbour: invisible here, constant compositing on a weak GPU. `hcPlateChipDrift` alone is 12 animations. |
| Boot payload | **93 scripts, 15.1 MB** (Honeycomb's share: 35 files, 2.9 MB) + 414 KB CSS; DOMContentLoaded 3.7s **on localhost** | Lever 9, and the one that is specific to NEOCITIES. 12 MB of it is Syrup Town, not Honeycomb. |
| First End Turn of a fight | one **137ms** long task; the second End Turn had none | First-use cost (decode/JIT), not the engine. x4-6 on a phone is a visible freeze on the first press. |

**What this says about "slow and clunky on neocities".** Not the rules engine. The candidates, in the
order the numbers point: (1) the boot payload — a player's first impression is a multi-second blank
load that Noodle's localhost never shows; (2) hover loss on every repaint (B34 above, fixed session 47)
— the hand dropping after every card IS "clunky", and every player saw it; (3) whole-screen repaints
per beat on slow layout engines; (4) idle GPU load. (1) needs a Syrup Town decision — **a consult item
under BASICS**, since lazy-loading the story game's scripts changes host code.

Cheapest next measurements: `../tools/audit-turn-time.js` under Chrome's 4x/6x CPU throttle, and a
Network-throttled ("Fast 3G") cold load of the live neocities URL, both of which need a real browser
window rather than the pane.

**Finding, session 53 (2026-09-21): the tree lookup was recomputed on every card resolved.**
`honeycomb.progression.selectedNodeArray` walked the whole progression tree and rescanned the selection
list for every node, each time a card was resolved (it is reached through `honeycomb.memberCardModifierArray`).
It now remembers its answer per character, keyed on the contents of the selection list and the outfit
(`../tooling/BALANCE-BRIEF.md` Step 1). On a headless budget-audit run, 27 fights went from 29.2 s to 7.2 s, with a
byte-identical report. That run had no tree nodes bought, so a player with a full tree was hit harder than
that measurement shows. This is a measured speed-up of the rules engine on a desktop CPU. It is **not**
known to be what players reported as slow, and the row above still stands: the rules engine was already
under 2 ms per end-turn in the live game, so this mostly helps simulations.
---

### B14. Performance ◐

Remaining levers from the session-12 cause list (numbers as in `../Archive/demo1/Archive/FEEDBACK-07-DONE.md`):

3. Combat repaints rebuild the whole screen from `innerHTML` every `afterBeat` (sides, hand, top bar).
4. Forced synchronous reflows (`void offsetWidth` restarts; `getBoundingClientRect` in drags/forecasts).
5. Forecasts snapshot and restore a large state on the hover path.
8. Many small DOM writes per beat (floating numbers, trails, plate rebuilds).
9. Large synchronous boot payload.
11. No "fast" fallback / skip-seen-beats pace.
12. VFX SVG filters are GPU work per effect.

Levers 6 and 7 are done. Legal-target glows are deliberately kept.

**This is now the execution arm of B16, the top demo goal.** Levers 3, 4 and 8 are the standing
suspects for the player reports; 12 is the standing suspect for weak GPUs.

---

### G10 — `.hcPickerGrid` is defined twice in `honeycomb.css`, live both times

Line ~2431 (the Compendium's wall of faces, session 21) and line ~4129 (the card picker). The second
wins for both, so the Compendium's wall is laid out by the card picker's grid — 90px columns and a
58vh ceiling it was never written for. Pre-existing and not touched in session 49; the gallery uses
its own `hcGallery*` classes rather than inheriting the ambiguity. Belongs to `ui/` if it is worth a
session. **Changing it will change how the Compendium looks**, which is Noodle's call, not an agent's.

---

### G11 — `--hc-lust` is used but never defined

`honeycomb.css` reads `var(--hc-lust)` in the weakness-row rules (~line 6984) and nothing anywhere
sets it, so those `border-color` declarations are dropped. Pre-existing. The gallery's tile hover uses
the literal `#ff5fd2` rather than propagating a phantom variable. Belongs to `ui/`.

---

## Unsorted — drop new reports for this pipeline here

*(a report that does not clearly belong to this pipeline goes in `../FEEDBACK.md` instead)*
