# UI and tooling — FEEDBACK

Screens, controls and legibility — the hand, the debug menu, the Battle Lab, text that cannot be read.

Two of these are **blockers on the top demo goal**: Noodle cannot measure what he cannot reach quickly.

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
not demo work. `../Archive/FEEDBACK-07.md` §A2 has the shape, how it is driven, and the traps to read
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

*Filed here session 47 from `../chessmaster/HANDOFF-S47.md`, which is the Anastasia lane's file. Noodle's
words, byte for byte; the lane that owns the screen owns the fix.*

> In the detail window for clicking on enemies and golems, the "Next" button is blocked by the card it's meant to be hovering above, it's too low and behind the card to be seen.

Where to look: `honeycomb-overlays-combat.js`, the `enemyMoves` overlay. Not touched by the Anastasia
lane — it is the shared enemy-detail overlay, and every enemy in the game has it.

### A-S47b. `[intent.whoseMove]` is printed raw in the detail menu ☆

> Below the cards in the detail menu is text such as [intent.whoseMove], confirm intentional

**Not intentional, and half-diagnosed already.** `[intent.whoseMove]` is the KEY of a tooltip text
(`honeycomb-text-tooltips.js`, around line 57) reaching the screen unresolved.
`honeycomb.tooltip.text("intent.whoseMove", { name })` at `honeycomb-tooltip.js` ~861 resolves it
correctly, so the caller in the enemy-moves overlay is passing the key down a path that never looks it
up. Same overlay as A-S47a.

### A-S47c. tHP forecasts push intent cards over other enemies' health bars — and should go ☆

> hcPlateTemporaryLabel on enemies pushes intent cardsover other enemy's health bars. See hcPlateTemporaryLabel.jpg. Genuinely, remove the forecasts for tHP, they've caused nothing but trouble.

**This is a REMOVAL, not a layout fix** — he named the outcome he wants. `honeycomb-forecast.js` and the
plate's `hcPlateTemporaryLabel`.

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

**Depends on the neutral tier landing.** `../rework/cards/CARD-POOL-02.md` §3.7 puts one neutral in every
shop and none in an ordinary reward, so the shop is where a neutral is bought and where its owner has to be
chosen. Before designing the drag, measure how a neutral card is owned today, since the card's owner is
what decides whose hand it is played from and whose poses and sounds it uses. The drop targets already
exist: P18 (archived) put a row per party member between the shop's tabs and its stock. The drag itself
follows the hand's rule, pointer capture on the element and no document listener (`../REQUIREMENTS.md`
§8), and a touch phone needs a tap-to-assign fallback (`../mobile/` S64-1).

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
