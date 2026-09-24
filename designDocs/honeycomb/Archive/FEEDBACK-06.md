# Honeycomb — Feedback round 06 (Unsorted currently)

The unsorted batch, including remaining issues from previous documents lifted here and to be numbered so it can be worked
through and tracked. **Quotes are Noodle's, verbatim. Do not summarise this file; add to it.**
Annotations under each quote are the interpretation and what was done — if an annotation and a quote
ever disagree, **the quote wins**.

> **Which mockup is which** (corrected mid-session 6): **`mockup-2-battleComplex`** is the reference for
> the health bars and nameplates. `mockup-2-battleImproved` was a scale-adjustment tool for an earlier
> session and is NOT a design reference — round 04 item 11 used it for figure and pile sizes, which is
> all it was for.

Superseded in session 7: item 1 REPLACED that nameplate, and **`mockup-7-health`** is the reference now
(with the two corrections recorded under item 1).

Status key: ☐ not started · ◐ in progress / partly done · ☑ done

## Status board (update as items land)

| Done | Items |
|---|---|
| ☑ | 0, 2, 3, 4, 5, 6, 7, 8, 8b, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 |
| ◐ | 24 (the cause list is built; the fixes are not started) |
| ☐ | — |
| ☑ unsorted | title scroll, Exsanguinate + Strength, Matriarch Brood turn 1, Matriarch in front, Matriarch shift on aim, nameplate stagger (session 10 small-wins pass, tests [70]), "1 foe / 2 foes" party-size preview, enemy-move card size (session 12) |

Tests: 1097 passed, 0 failed ([71] is session 12's items 16–24 and session 13's follow-ups) ([58] is the nameplate, item 3 is in [56], items 4–8 are [59], item 9 is [60], item 10 is [61], item 11 is [62], item 12 is [63], item 13 is [67], items 14–15 are [68], the authored lists are [69]; [64]–[66] are the mechanics pass)

> **Session 13 (Noodle's test of session 12):** VFX additive ground keyed and the chroma first-play race
> fixed; the card no longer flies at the target; the shelf End Turn's primary frame killed; offer badges now
> name the outfit and multiplier behind them; the shop painting right-aligned. The remaining unsorted issues
> are grouped with statuses at the bottom.

---

### 0. Percieved input delay
Immediate and high-priority.

> While an attack is underway, you can expand the hand and it seems like you should be able to grab a card, but you can't, so it seems like the game bugs out and you try to do it again.
> Clicking end turn has the same issue. 
> To solve these, if you play a card or hit end turn during an animation it should queue up those options, otherwise it will end up feeling like that aspect of the game is broken.
> I'm not sure how feasible this is without introducing a huge host of bugs regarding casting spells you can't afford, but in the worst case scenario we can return a card to hand saying "you can't afford that".

☑ **Done (session 7, continued).** The cause: every card press and End Turn press was dropped while
`combatScene.busy` was true, meaning a replay was playing. The hand still lifted on hover, so it looked live.

- **Cards can be picked up during a replay.** Such a drag is *queued*: it aims, marks legal targets and
  releases as normal, but runs no previews. The shift preview, forecast bars and focus are skipped, because
  the replay still owns the fighters and the bars. Drag, click and touch tap all go through one door,
  `combatScene.requestPlay`.
- **Checked on release, not later — better than the worst case.** The engine's state is already final
  when a replay starts, so `queuedPlayRefusal` dry-runs every play already queued, then this one. A play
  that would fail is refused on the spot with its reason ("Not enough Energy.") and the card drops back
  into the hand. A play that passes is queued: the card gets a pulsing gold ring (`.hcQueuedSlot`) and the
  `inputQueued` sound plays. A card that would stop to ask a question counts as passing and asks when its
  turn comes. The dry run is deterministic, so the real play does what the check saw.
- **End Turn pressed during a replay, or behind queued plays, is queued** and lights the button
  (`.hcEndTurnQueued`). It is always last: cards released after it say "The turn is ending.".
- **Carried out in order** by `drainInputQueue`, from `afterBeat` once the replay's closing repaint has run.
  A victory clears the queue. A question a queued play asks pauses the drain until it is answered or
  cancelled.
- **The replay hurries while anything is queued**: waits between its remaining beats are multiplied by
  `tuning.animation.queuedInputPace` (0.5). The BROKEN / recovery / rank cut-ins are exempt
  (`queuedInputPaceExemptTypeArray`), since their pacing was set by hand. This also covers the unsorted note
  "it should speed up any ongoing animations".
- **Traps closed along the way:**
  - `afterBeat`'s repaint rebuilds the hand, which would destroy a card held mid-drag. While a card is
    held, the repaint is owed (`afterBeatDeferred`) and paid on release.
  - `reflowHand` no longer re-fans the held card's slot.
  - A held card the replay removes ends its drag on `lostpointercapture`.
- **Not queued:** abilities on the medallion still refuse during a replay, as before. Say if they should
  queue too.
- Seen in the pane: a real mouse drag of Rake onto a sporeling during Wither's replay at 0.25× queued and
  played. Strike → queued Crimson Arc → queued End Turn ran in order into turn 2. With 1 energy, two cards
  released mid-replay were refused with "Not enough Energy.". A replay ending while a card was held deferred
  its repaint, and releasing the card ran it. No page errors.

### 1. Nameplates replacement ☑
Moved to NAMEPLATES-01.md and archived.

### 2. Extras for nameplates ☑

> Mousing over lust and temporary HP don't currently display what these are, how they will change, etc. Don't forget these when replacing the nameplates.
> Broken state should block ability use

- **Tooltips ☑** — landed with item 1: the whole bar and tab open the `nameplate` tooltip, which explains
  lust and temporary HP, what will move them and by how much, the break margin, and the halving.
- **Broken blocks abilities** — the ENGINE already refused (`abilities.usability` returns `ownerBroken`
  unless an ability says `usableWhenBroken`), but the old chips stayed on the plate. Now a broken
  character's medallion is the heart, never glows, and pressing it says the abilities are sealed instead
  of opening the menu. 

### 3. Broken State changes ☑
> Enemies should avoid attacking broken characters. This mean when they target the "front enemy", it should bypass any broken characters, when they hit a random character, remove broken characters from the pool.
> Ensure forecasts are accurate after the above fix.
> When broken, characters have a border/window behind them, even in scene mode, I'm not a fan of how it looks, please remove. I believe it's hcFighterFrame.
> At default speed the broken animation is too fast, ideal speed is at 0.7x, except for the delay right before the screenwipe, that's perfect as-is at current speed. 
> The broken animation isn't playing the same on mobile as it is desktop, it's starting with all the elements visible and and not disappearing in sync with the screenwipe. Android, firefox, landscape.
> Remove the chains overlaid onto broken characters (hcBrokenBinding), replace them with hearts (shifted to pink) which appear by growing, floating up while wobbling slightly, then shrinking and vanishing. 

- **Front / random skip the broken ☑** — picked targets already did (round 05, `aiOrderedCandidateArray`).
  Now a target mode flagged `passesOverBroken` (`frontEnemy`, `backEnemy`, `randomEnemy`) draws from
  `honeycomb.targetCandidateArray`, which drops the broken via `passOverBrokenArray` — unless EVERY
  candidate is broken, when it keeps them so an attack never lands on nobody (that side has lost anyway).
  Applies whoever the user is, since a mode that does not pick gives the player no choice either. The
  party's own ally modes are untouched, so a random heal can still reach a broken member.
  `tuning.ai.brokenTargetPenalty <= 0` turns the whole rule off.
- **Forecasts ☑** — the dry run is the real turn, so it followed by itself; the one thing that did not was
  the "might" spread, whose candidate list was read separately in `markChance`. It reads
  `targetCandidateArray` too now. Test [56] checks a real enemy turn ends on the health the forecast named.
- **Frame behind a broken fighter ☑** — it was a pulsing pink `box-shadow` on `.hcFighterFrame`
  (`hcBrokenBoardPulse`), declared after scene mode's "no frame" rule at the same specificity, so it won.
  Removed, keyframes included.
- **Pace ☑** — `tuning.brokenOverlay.paceMultiplier: 0.7` plays the whole cut-in at 0.7× on top of the
  player's play speed. "The delay right before the screenwipe" is read as the STILL TAIL of the hold —
  everything in the hold has settled by 55% of it (the text slam, the chains' hold), so
  `holdRestFraction: 0.45` of it stays at its 1× length. At normal speed: start 886ms, hold 1112ms
  (707 paced + 405 still), wipe 743ms, 2741 total (was 2040). One function owns it,
  `honeycomb.brokenOverlay.timeline()`. **If the wait you meant is a different one, `holdRestFraction` is
  the knob** (0 paces all of it; raise it to keep more of the hold unpaced).
- **Mobile Firefox ☑ (diagnosed, not confirmed on a phone)** — the symptom matches the cut-in's
  `prefers-reduced-motion` block exactly: that version showed every layer finished from frame one, and it
  switched off the stage's animation wholesale, which removed the ERASE along with the shake while the
  black wipe still ran. Android's "Remove animations" accessibility setting (and some battery savers)
  turns that preference on in Firefox. Two changes: the still version now keeps the erase in step with
  the wipe, and it only applies when `tuning.brokenOverlay.honorReducedMotion` is true, which it is not,
  so the phone plays the full cut-in. **To confirm:** check Settings → Accessibility → "Remove
  animations" on the phone. If it is off and the bug persists, the cause is something else and this
  needs another look. The other `prefers-reduced-motion` blocks in honeycomb.css (the recovery cut-in and
  three more) are still bare media queries, so such a phone loses those effects too; left alone for now.
- **Hearts instead of chains ☑** — `renderBrokenBinding` became `renderBrokenHearts`. Five
  `icons/heart-red` hearts with the plate's pink shift, each on its own loop: an outer element grows,
  rises and shrinks away (`hcBrokenHeartLife`), and an inner one sways and tilts (`hcBrokenHeartSway`), so
  the two motions do not overwrite each other's transform. Positions, sizes, stagger, cycle, rise,
  sway and tilt are all in `tuning.brokenOverlay.fighterHeart*`. Most are born above the nameplate, which
  would hide them. Seen in the pane on a broken Nettle.

### 4. Scene mode ☑
> I'm set on scene mode being the best look for the game. Make it always the default and disable the ability to switch off of it.

- `honeycomb.battleLayout()` always returns `tuning.battleLayout.defaultLayout` ("scene"), debug build or
  not. The debug Layout button on the combat shelf, `combatScene.onLayoutButton` and
  `honeycomb.cycleBattleLayout` are deleted.
- A profile saved while the button existed may still hold `settingArray.battleLayout`; nothing reads it.
- The jumbo / stage / crowd entries stay in `layoutArray` as data (the layout property tests use them).
  They are reachable only by a developer editing `defaultLayout`.

### 5. Warning function ☑
> We need a sort of general warning function that runs on game startup to make sure the game follows standardized rules. This should compile a report of various arrays like characters, cards, and enemies that we can add to later.
> The first warning function to test with is "Does any card have more than 4 types?" as this would be too large for most card frames.
> Don't display the warning in-game, just the console, since we may choose to ignore some warnings for whatever reason.
> Much later down the line, we'll wrap this warning function into our final output workflow for releases.

- New file **`honeycomb-warnings.js`**, loaded last (index.html, mobile.html, REQUIREMENTS §2, test FILES).
  Two tables to add to: `honeycomb.warningSubjectArray` (cards, characters, enemies, encounters,
  statuses, abilities, equipment, relics, events) and `honeycomb.warningRuleArray` (a rule =
  `{index, name, subject, check(entry, settings) -> [messages]}`).
- `honeycomb.warnings.report()` returns the report as plain data. That is the hook for the later release
  workflow. `print()` writes it to the console: one `warn` per problem, grouped by rule, plus an info line
  with each table's count when clean. `runOnce()` is called at the top of `honeycombBoot`, once per page load.
- First rule, `cardTypeCount`: more than `tuning.warnings.maximumCardTypeCount` (4) types. It checks every
  card through `resolveCard` at every level of every upgrade path, since an upgrade can add types. The
  shipped content is clean: the most on any card is 3 (severineNightfall).
- **Ignoring** is `tuning.warnings.ignoredArray: [{rule, entry}]` (`entry: null` ignores the rule
  everywhere). Ignored warnings still count and print in a collapsed group, so they stay visible.
- The report runs with `honeycomb.state` set aside (restored afterwards), so a saved fight's broken-card
  swap cannot affect it. A rule that throws becomes a warning instead of stopping the report.
- Off switch: `tuning.warnings.runOnBoot`.

### 6. Card layout improvements ☑
> Move card names to the top of the card, above the art.
> Make a short list of card supertypes: Damage, support, negative, passive, and lewd (new card type for lust-building)
> Allow for manual supertype-override on cards so that I can, say, have a card that deals damage be categorized as lewd.
> Have supertype tags be placed in the old name position.
> Remaining tags should stay where they are, since the location is now much less cramped.

- **Name on top ☑** — `.hcCardName` sits in the band above the art window, between the cost bubble and
  the owner pip (full width on enemy cards, which have no cost). It is one line, and the font SHRINKS with
  the name's length instead of wrapping onto the art: `honeycomb.ui.cardLineFit` with
  `tuning.art.cardFrame.nameFit` (letters that fit at full size, the smallest allowed scale, and a
  two-line fallback for very long names). It counts characters rather than measuring pixels, so it gives the
  same result at every card size.
- **Supertypes ☑** — "supertype" is the existing card TYPE (`honeycomb.cardTypeArray`). Added
  **Lewd** (pink `#ff5fd2`, `icons/heart-glow-pink`, a pink frame tint, its own play-sound event
  `cardPlayLewd`, and a place in the by-type sort). The derivation rule for `lust` now makes a card Lewd
  instead of Negative when the lust lands on the other team. Lust on the user's own team is still a cost
  and adds no type. Lewd sits after Negative in the table, so a card that both debuffs and builds lust keeps
  Negative as its primary type (Spores, Strip: "Negative · Lewd"). The shipped Lewd cards are all enemy
  moves: Spores, Pin (Damage · Lewd), Beguile, Strip and Embrace.
  Lewd's defaults (pose, animation, party step) copy Negative's for now.
- **Manual override ☑ (already existed)** — `typeArray` on a card sets its supertypes outright, primary
  first: `typeArray: ["lewd"]` makes a damage card Lewd alone, and `["lewd", "damage"]` makes it both. The
  field list at the top of honeycomb-content-cards.js now says so.
- **Supertypes in the old name position ☑** — `honeycomb.ui.cardSupertypeRow` prints icon + word for each
  type on the bar under the art (`.hcCardSupertypeRow`, top 54%). It is one line that shrinks with how
  much it holds (`tuning.art.cardFrame.supertypeFit`), so four types fit, which is the most item 5's
  warning allows.
- **Remaining tags stay ☑** — `honeycomb.ui.cardTagStrip` keeps the card tags (schools) on the lower
  edge, alone now. The old `cardTypeStrip` is gone.
- Enemy intent cards (the small ones by the enemy) hide the supertype row and tag strip, so they show only
  their name. How each card size should look is item 7.
- **Status folded into Curse ☑ (Noodle's answer, session 7):**
  > statuses and curses should be grouped together, and curse is a better name for them. From thus onwards, "Junk Cards", bad cards shuffled into your deck, these shall hereby be formally known as "Curses" or "Curse Cards".

  The Status type is removed. `"status"` is now an alias of `curse` in `cardTypeAliasArray`, so any content
  or note that still names it resolves. The Wisp is a Curse: its index is `curseWisp` (was `statusWisp`)
  and its art is `cards/art/curse-wisp`. **Save format 5** renames the index wherever a saved fight holds it.
  "Junk" is gone from the code comments. **Terminology from now on: Curses / Curse Cards.** Lewd's
  defaults were confirmed as fine.
- Seen in the pane at hand size and at the 2× hover size: Wither, Nightfall (three types), Creeping
  Plague, Hedge Your Bet, and a test card with four types and a 21-letter name. Tests in [59].
- Rules text overflowing on wordy cards was left for item 7, and item 7 fixed it.

### 7. Define and standardize card sizes, no unreadable text ☑
> We need three clearly-defined card sizes, but two of them share most behaviors.
> Small card size is for enemy intent, discard pile icon, teambuilding's "Contribute Cards" list, the deck window, the shop window, absolutely everywhere that the card would be so small text would clip off the body or into other elements.
> Medium card size is for cards in hand that aren't being focused. Anywhere the card would look a little cramped but is mostly readable.
> Large card size is when mousing over a card in hand (this size is the best, use it as reference for other large), dragging a card, when the enemy plays their card, cards being show via tooltips when mousing over a smaller card, anywhere the player is likely to be directly intending "I definitely want to read this card". Large card size should also have a higher z-index than others.
> Large cards may need to be even larger, the text is too big on them for more complex cards. Some examples to look at: Miasma, Hedge your Bet
> Every single instance a card would be displayed, it -must- be categorized as one of these instances.
> At small card size, only the card name is displayed. Currently this appears to be only the case with enemy intent cards. Unstandardized cases like these will DESTROY THE GAME.

- **The sizes are a table** — `tuning.art.cardSize.sizeArray`: `small` / `medium` / `large`. Each size
  lists the printed parts it draws (`partArray`: cost, affinity, badges, name, supertypes, text, tags)
  and how its name is set (`nameFit`). **Small is `["name"]` alone**, drawn large across the top of the
  card on a shaded band. Medium and large print everything. Large also has `widthPixels: 300` (the hover
  used to be 254 — "may need to be even larger") and `zIndex: 150`.
- **`size` is REQUIRED on `honeycomb.ui.card`.** A missing or unknown size logs a console error (once per
  name) and draws at `fallbackSize` ("small", which prints the least and so cannot clip). Test [59] reads
  the game's scripts and fails if any of the 20 calls to `honeycomb.ui.card` lacks a size. How the calls are
  sorted:
  - **small**: enemy intent card, face-up discard pile top, Contributed Cards (teambuilding), deck
    window, pile window, shop, victory card reward, event gain cards, choice grid, chosen-card slots
  - **medium**: cards in hand, and the hand-motion ghosts flying between hand and piles
  - **large**: card tooltip, upgrade tooltip, enemy move tooltip / moves list, the enemy's played card,
    the upgrade "Now / Upgraded" comparison, the card flying from hand to target, the card dragged into a
    choice slot
  - The hovered hand card and the held (dragged) card are medium cards GROWN to exactly the large width.
    `honeycomb.handCardGrowthToLarge()` derives the growth from the two widths; `handHoverScale` and
    `heldCardScale` are deleted.
- **Text scales with the card, not the screen.** Everything printed on a card is in CARD UNITS
  (`--hc-card-u` = the card's own width ÷ `designWidthUnits` 127, via container query units; a browser
  without them falls back to honeycomb pixels). A card is the same picture at every width, so fixing the
  text once fixes it everywhere, the phone included. The stylesheet's numbers did not change: they were
  already written for the 127-wide medium hand card.
- **Long text shrinks to fit** — Miasma and Hedge Your Bet. `tuning.art.cardFrame.textFit` sets the rules
  text smaller the more characters it has, by area (the square root, since text fills a box). The text box
  also grew slightly: 60% to 91.5% of the card, where it was 62% to 90%. Supertype rows and names shrink
  the same way. Counting characters rather than measuring means no layout pass and the same answer at
  every size.
- **Proven by a new dev tool, `!designDocs/honeycomb/audit-card-fit.js`.** It draws all 72 card forms
  (every card at every upgrade level on every path, plus a worst case with four types and a 21-letter
  name) at all three sizes and reports any name, supertype row or rules text that does not fit. **0
  failures at 1280×720 and at 812×375.**
- Seen in the pane: hand, 2.36× hover, held card, intent card, draw pile window with a hovered small card
  opening the large tooltip, and Contributed Cards. The enemy's played card is now exactly large (it was
  sized off the battlefield, at least 46vmin tall); its three old height numbers in tuning are gone.

### 8. Standardize card sizes followup ☑
> List of issues currently caused by nonstandardized sizes to treat as a checklist to make sure are corrected:
> Dragged cards aren't being sized at large.
> Enemy intent card names are smaller than normal.
> Cards in hand block the bottom-right corner of the card I'm inspecting.
> 

- **Dragged cards ☑** — the held card grows to the large width (item 7). The card dragged into a choice
  slot is a large card too.
- **Intent card names ☑** — the intent card is a small card, and a small card's name is set at twice the
  ordinary size across the whole top of the card.
- **Hand cards over the inspected card ☑** — two causes. (1) The fan wrote each slot's stacking order as
  an inline `z-index`, which outranks the stylesheet, so `:hover { z-index: 60 }` never applied and every
  card to the right of the hovered one was drawn over it. The fan now writes `--hcFanZ` and the stylesheet
  reads it, so a hovered, touch-read or held slot rises to the large z-index. (2) The keyword note that
  follows the pointer sat on top of the (now bigger) card. The `cardNote` tooltip kind is now
  `besideAnchor`: it still follows the pointer up and down, but stands to the right of the card, or the
  left if there is no room, and is placed again once the card has finished growing
  (`tuning.ui.tooltipAnchorSettleMs`).
- The drag was checked by putting the drag classes on a card in the pane, not with a real pointer drag.

### 8b. Session 7 follow-ups to items 6–8 ☑
> Remove the dark band on small, please. Also hide the "All enemies", "ally", "all allies" tags, I don't think we actually need them, I'd like to see how the game looks with them disabled.
> For horizontal small cards, please show the supertype symbols just below the art
> Finally, please include a harder and more visible drop shadow on all the game's text.

- **Band ☑** — removed from `.hcCardSize-small .hcCardName`. The text shadow carries the name over the art.
- **Target badges ☑ (switched off, not deleted)** — `tuning.art.cardFrame.showTargetBadge: false`. Set it
  back to true to restore them. The party-step arrow in the same row still shows.
- **Supertype icons on small horizontal cards ☑** — a size may now list `partArrayByLayout`; small's is
  `{ horizontal: ["name", "supertypeIcons"] }`. `honeycomb.ui.cardSupertypeIcons` draws the type icons in
  a row whose `top` is the frame window's bottom edge, so a new frame moves it. Small vertical cards still
  show the name alone. `audit-card-fit.js` checks the row too: 0 failures.
- **Text shadow ☑** — one token, `--hc-text-shadow`, on the root and overlay host: a hard 0.08em offset
  shadow plus a tight dark rim, in `em` with a honeycomb-pixel floor. It is applied to every element with
  `:where(...) *`, which has no weight, so any rule with its own shadow still wins. The 23 existing shadows
  now use the token; the 7 with a coloured glow keep the glow after it. Two exceptions: the broken plate's
  "BROKEN!" keeps its four-way outline, and dark text on light chips (active segment, discovery tag, tag
  count, outfit tick, party rank, count badge, next-move tag) has no shadow.

### 9. Alt win conditions ☑
> Add special victory conditions for certain battles, have one of those be the matriarch encounter. Defeating her gives you the victory even if sporelings are alive.
> This cannot be -just- a HP 0 check though, since a different step will allow players to inflict lust on enemies. Broken is the win condition.

- **A table of conditions** — `honeycomb.fightEndConditionArray` (honeycomb-combat.js, "Ending a fight"). Each
  entry asks one team "have you lost?" with `check(side, combat, entry)`, and words itself with `describe`
  (an entry's own `text` wins). Two to start: `allBeaten` (the old rule) and `leadersBeaten` (every
  combatant matching `indexArray` or `tagArray` is beaten, whoever else stands). A new kind of win is one
  table entry.
- **Beaten, never health** — every condition reads `honeycomb.combat.entityIsBeaten`: downed OR broken. So
  when item 10 lets enemies break, breaking the Matriarch already wins. Tested now by setting her broken
  at full health.
- **Where a fight's list comes from** — `honeycomb.combat.endConditionArray(combat, outcome)`: the fight's
  own (`victoryConditionArray` / `defeatConditionArray` passed to `combat.begin`, and through `startCombat`
  so an event's fight can name one), then the encounter's, then `tuning.combat.defaultVictoryConditionArray`
  / `defaultDefeatConditionArray`. Any one listed condition met decides it. A list REPLACES the default, so
  an encounter that wants both "leaders" and "everyone" lists both.
- **The Matriarch's Lair** — `victoryConditionArray: [{ index: "leadersBeaten", indexArray: ["matriarch"] }]`,
  with the line "The Matriarch is beaten, and her brood scatters."
- **Saying so** — `checkEnd` records `combat.endCondition` and puts `condition` + `text` on the `combatEnd`
  log entry. The battle log reads "Victory. The Matriarch is beaten, and her brood scatters.", and so does a
  line under the title of the victory screen. An ordinary fight shows no line.
- **Turns stop when the fight is decided** — `honeycomb.combat.decidedOutcome(combat)` answers without
  recording, and the enemy turn and the AI move loops stop on it. The enemy turn asks at the TOP of each
  enemy, because a Matriarch killed by her own poison at turn start used to `continue` straight past the
  check and let the sporeling play its move anyway.
- **Warning rule** `encounterEndConditions`: a condition not in the table, an empty list, or a leader the
  encounter never fields (reinforcements count).
- Unchanged, flagged: **gold still pays for every enemy in the fight**, the sporelings left standing
  included. Experience only counts the downed ones, as before. Say if the gold should follow experience.
- Tests [60]. Seen in the pane: Matriarch downed with a summoned sporeling on 24 health, victory screen
  shows the line.

### 10. Lust mechanics revamp ☑
> I've said before only players should build lust, I've changed my mind. Lust should be inflictable on anyone who isn't outright immune to it, it's just that enemies won't get the whole broken state riggamarole player characters do, they are just treated as dead, and you can set their HP to zero on the spot. This means several substantial things:
> 1. The player should be able to inflict lust damage. Replace Severine's Rake card with one that inflicts 7 lust to test with.
> 2. Only special characters get the broken state character animation, currently it's just Severine, Nettle, and Brienne. I do want to compliment you right now though because I did not expect for broken states to trigger on enemy PCs, good job. 
> 3. Please have the matriarch boss be one of the entities who triggers a broken animation as well. I added a brokenBG for her but she'll need a broken webp as well, as well as for her to look in the enemies folder rather than the characters one.
> 4. Ensure all enemies broken triggers victory even if some have more than 0 hp.

- **Everyone takes lust** — `honeycomb.entityUsesLust` is true unless the definition says `lustImmune: true`
  (the old `usesLust` field still works). Enemy nameplates now draw the pink lust bar, and the lust tooltip
  adds "Breaking them beats them outright." for them. The between-run weakness ledger still only records
  characters.
- **What breaking does is a second question** — `honeycomb.entityBreakBehavior`: `"state"` (the whole Broken
  state) or `"defeated"`. The definition's `brokenBehavior`, else `tuning.lust.brokenBehaviorByKind`
  (character → state, enemy → defeated). It goes by what a combatant IS, not its team, so an enemy-side Severine
  keeps the full state.
- **Defeated means defeated on the spot** — `checkBreak` logs `broken` (with `behavior` and `cutIn`), sets
  health to 0 and calls the new `honeycomb.markDowned(target, context, "broken")`. That is the same function a
  death now goes through, so `onDeath` / `onEnemyDowned`, experience and the battle log all hear it. The
  `downed` entry carries `cause`, and the log reads "Sporeling BROKE." then "Sporeling is out of the fight.".
  `broken` stays set on the fallen enemy as the record of how it fell.
- **A lethal hit is still a kill** — for a "defeated" combatant `checkBreak` refuses when health is already 0.
  Otherwise `0 >= 0` would turn every ordinary enemy death into a break. `checkDeath`'s "never killed, only
  broken" branch now keys on the state behaviour instead of on taking lust.
- **1. Enthrall ☑** — new card `severineEnthrall`: 1 energy, 7 lust to one enemy (10 upgraded), tagged Charm, so
  it derives Lewd. It takes Rake's two slots in Severine's starting deck. **Rake is not deleted**, because the
  Corsair outfit still turns Claw Flurry into Rake. 
- **2. The cut-in is for the special few ☑** — `honeycomb.entityHasBrokenCutIn`: the definition's
  `brokenCutIn`, else `tuning.lust.brokenCutInByKind` (off for both kinds). Brienne, Nettle and Severine carry
  `brokenCutIn: true`. The engine stamps `cutIn` on the `broken` entry, and `brokenOverlay.play` returns 0 for
  `cutIn: false`. The plate's broken look and the sound still play for anyone.
- **3. The Matriarch ☑** — `brokenCutIn: true`, `brokenArtPath: "enemies/matriarch/broken"`,
  `brokenBackgroundPath: "enemies/matriarch/brokenBG"`. The cut-in's `characterFor` now resolves an enemy
  definition, and its portrait fallback uses the enemy portrait chain. **`enemies/matriarch/broken.webp` is a
  generated stand-in** (her standing sprite, desaturated and tinted pink, the same recipe the character
  stand-ins used). A drawn `broken.png` beside it replaces it on the next `--only broken` run. She is still
  defeated by breaking, so breaking her wins her lair (item 9).
- **4. All enemies broken wins ☑** — broken enemies are downed, and item 9's conditions read "beaten"
  anyway. Tested with both sporelings broken at full health.
- Hooks: `checkBreak` now fires `onEnemyBroken` for the enemy team and `onAllyBroken` for the party. Nothing
  in the content listens to either yet.
- Tests [61], plus [56]'s old "an enemy cannot be given lust" checks rewritten to the new rule. Seen in the
  pane: pink lust bars on the Matriarch and a sporeling, and her cut-in with her own art and brokenBG.

### 11. Lust card tag tweak ☑
> Even though lust is similar to a status in some ways, it really should not be treated exactly like one. 
> For one thing if we add cards that remove statuses, it'd be hard to balance around it also clearing lust since lust is usually at a different scale.
> For another thing, cards that exclusively build lust should be categorized as lewd cards instead of negative ones, since handling lust is very different from many other statuses.
> Finally, lewd cards should have their own cardframe and icon as one of the game's supertypes.

- **Lust is not a status ☑ (already true, now written down and tested)** — lust was never in `statusArray`: it
  is `entity.lust`, moved only by the `lust` and `soothe` effects. So `removeStatus`, Artifact's debuff veto and
  anything that counts statuses cannot reach it, and a future "remove all debuffs" card will not touch it. The
  rule is stated at the top of honeycomb-content-statuses.js. Sensitive and Composure, the statuses that
  *serve* lust, stay ordinary statuses and are removable like any other.
- **Lust-only cards are Lewd ☑** — item 6 already made lust aimed at the other team derive Lewd, so Enthrall,
  Beguile and Embrace were already Lewd alone. One gap closed: a card that only applied **Sensitive** would have
  been Negative. A status may now name the supertype it makes (`cardType`), and Sensitive says `"lewd"`. Cards
  that debuff *and* build lust keep Negative first (Spores: "Negative · Lewd"), as item 6 settled. **Say if
  those should lead with Lewd instead.**
- **Lewd's own frame and icon ☑ (stand-ins)** — a card type may now carry `framePathByLayout` (its own frame art
  per layout, through `honeycomb.cardTypeFramePath`); a type without one keeps the shared frame and its tint.
  Lewd points at `cards/frames/lewdVertical` / `lewdHorizontal`, and a multi-type card blends between the
  frames the same way it blended tints. Its icon is `icons/type-lewd`: its borrowed heart-glow-pink is also
  Regeneration's. **All three files are generated stand-ins** (`generate-placeholder-art.py --only lewd`: the
  placeholder frame pushed pink with a heart on each corner, heart-red recoloured with a keyhole). A drawn
  `.png` beside any of them replaces it on the next run, and a drawn `.webp` dropped in place just works.
- **A warning rule to keep lust cards honest** — the card tags the weakness ledger is written under now say
  `lustTag: true`, and the `lustCardTag` rule reports any card (at any upgrade level) that inflicts lust on the
  other team without one. The shipped content is clean.
- Tests [62]. Seen in the pane: Enthrall and a Sensitive-only test card print as Lewd in the new frame with the
  keyhole icon; Spores shades from the Negative frame into the Lewd one.

### 12. Lust tracking improvements in battle ☑
> When inspecting a lewd card, show each of the opposing party's weakness(es) to the tags on that card. Specifically the weakness(es) progress, the current rank & modifier, and how much damage the characters will take from it. 
> To accomplish this, pause the forecast happening passively at rest and do a forecast for just that card.
> This applies to both enemy and ally characters. Hovering over an enemy with Severine's lust card should show imminent lust damage.

- **Where it shows (Noodle's pick, session 7): a panel over each fighter the card could reach**, standing
  on top of their nameplate. It holds the lust they would take (big, pink), the ordinary damage beside it
  when the card also hits (Temporary HP included), and "might" for a random card or "Breaks" when the hit
  would break them. Under that, **for a character**, there is one row per card tag the hit carries: the
  weakness rail with its notches, the rank name and ×multiplier, and a pulsing stretch for what this hit
  would add. "Rank up!" appears if that stretch crosses a notch, and "Held until this run ends" if the
  per-run ceiling stops it. Enemies have no weakness ledger, so their panel is the number alone.
- **What opens it** — a card with the **Lewd** supertype anywhere in its list (so Spores, Negative · Lewd,
  counts). It opens on hover or touch-read of a card in hand, and on hovering an enemy's intent card
  (tooltip kinds can now carry `onShow` / `onHide`). Tuning: `tuning.forecast.lustInspectionEnabled`,
  `lustInspectionCardType`, `lustInspectionShowsDamage`.
- **"Pause the forecast at rest and do a forecast for just that card" ☑** — `honeycomb.forecast.forLustInspection`
  runs the card's own effects for real and rolls them back: statuses, hooks and the weakness multiplier,
  but no cost, no party step and no enemy turn. While it stands, `forecast.markFor` draws it and nothing
  else, so every bar the card cannot reach goes quiet instead of showing the enemy turn. How it reads
  depends on how the card picks its target:
  - **a picked or random target** is run once per candidate, with that candidate forced as the target, so
    every fighter shows what it would take if the card landed on them. Random ones are marked "might", and
    the broken are passed over exactly as the real pick does.
  - **anything else** is run once, as a play would resolve it. Pin shows on the party's front member
    alone; an all-party card shows on everyone.
- **While dragging**, the panels stay up. The aimed forecast still owns the target's bar and the party's
  bars, as before, so "hovering over an enemy with Severine's lust card" shows the imminent lust in the panel
  and on the bar together. Letting go, playing, or a replay starting takes the panels down.
- **Shared rail** — the teambuilding sheet's rail is now `honeycomb.ui.weaknessRail`, drawn by both places
  (item 13 will restyle the sheet's copy). `honeycomb.lust.previewExposure` and `exposureGrowth` are what a
  hit would do to a weakness. The real record uses the same growth function, so the two cannot disagree.
- Tests [63]. Seen in the pane: Enthrall hovered shows +7 over both sporelings with the party's resting marks
  paused. Its real play then landed exactly 7. The Spores intent hovered shows "+5 MIGHT" over all three
  party members, each with Venom Sensitised ×1.25, and "Rank up!" on Brienne (Venom set to 18).
- **Not covered:** the enemy's full move list (click an enemy) does not open panels, only the intent card
  does. The developer-only framed layouts clip the panel; scene mode does not.

### 13. Lust tracking improvements in teambuilding ☑
> Replace "Hover over a row to read it" in weaknesses with "Slowly reduces to the rank floor when not in party."
> Make weaknesses close to ranking up glow, intensity not too high, but do have it glow a little more matching the closeness to the next rank.
> Move the "X to next rank" (don't actually name the next rank, say "next rank") label into the tooltip.
> Add a counter for how long the character must be benched before it's reduced to the rank floor.

- **Bench decay did not exist, so it was built ☑.** The only decay was the bleed one tag's growth takes off
  the others. The first version decayed per benched RUN, applied at run end, with a minimum node count so an
  abandoned run could not count. Noodle's follow-up replaced it:
  > Good thinking on handling abandoned runs, but there's a better idea staring us in the face: Every node completed is listed in-game as a day passing, just have the lust reduce over a matter of days, which discourages players from abandoning after just one node and is instantly intuitive. Let's also make it so that players can spend personal EXP to reduce it back to the rank floor. I'll leave the exact numbers up to you, but one other thing is to reduce the speed lust builds at by at least half, playtesters are hitting max way too quickly.

  - **By days ☑.** Each day that passes takes `tuning.lust.benchDecayPerDay` (0.5, times the existing
    `decayRate()` knob) off every tag of every character NOT in the run's party. It is floored at the threshold
    of the rank the tag is in, so it softens but never demotes. Days pass in `map.enterNode` (`run.day +=
    daysPerNode`, the top bar's DAY counter), which now calls `lust.applyBenchDecay(run, daysPerNode)` right
    after. A forecast never writes it. It is linear, so the counter is exact. The widest stretch (Susceptible →
    Undone, 20) takes 40 days, about two runs of 9 + 11 nodes. The run-end hook, `run.nodesCompleted` and the
    node minimum are all removed.
  - **Pay it down with personal EXP ☑.** A **Reset · N EXP** button sits beside the counter.
    N = `ceil(exposure above every floor × floorResetExperiencePerExposure)` (3 per point, so a full Susceptible
    stretch is 60, a little over one tree node at 40). It asks to confirm, then spends the character's own
    PERSONAL experience, never the global pool, and sets every tag to its rank floor with no rank lost
    (`lust.resetToFloor`). It is refused between nothing to reset / during a run / not enough EXP
    (`floorResetRefusal`); the button greys and its tooltip (`weaknessReset`) says why. Sound event `weaknessReset`.
  - **Lust builds weakness at 0.4× ☑** (`exposurePerLustPoint` 1 → 0.4, "at least half"). Read as the
    between-run WEAKNESS build rate, since "hitting max" is the top rank. In-fight lust amounts are untouched.
    **Say if the in-fight lust was meant instead or as well.** Three older test blocks that feed raw lust
    amounts to test rank rules now pin the rate to 1 locally.
- **Note ☑.** The row hint was actually worded "Hover a row to read it."; it is replaced with the quote.
- **Counter ☑.** A line under the note: "21 days on the bench to reach the rank floor", or "At the rank floor."
  It is the character's slowest tag (`lust.characterBenchDaysToFloor`), counted by stepping the real decay
  (`benchDaysToFloor`), so it cannot be off by a rounding. Its tooltip (`weaknessBench`) says how much a day
  takes off. Each row's tooltip carries that tag's own day count too.
- **"X to next rank" ☑.** It is gone from under the rail (`buildWeaknessTrack` and `.hcWeaknessToGo` are
  deleted), and the row tooltip reads "2 to next rank." without naming the rank. The "Held until this run
  ends" note now shows only while a run is live, because the rank-gain count it reads stays on the profile
  until the next run starts. Between runs nothing is being held.
- **Glow ☑.** `lust.nextRankCloseness` is how far a tag has come through its current rank's stretch of the rail.
  `lust.nearRankGlow` is 0 below `nearRankGlowStartShare` (0.5), then rises in a straight line to
  `nearRankGlowMaximum` (0.6 opacity) at the notch. The sheet writes it as `--hcWeaknessNear`. The row's
  `::before` draws an inset and outer halo in the tag's colour at that opacity, behind the content and with no
  size of its own, so nothing moves (item 15 asks for that of the later glows too). It is static; items 14–15's
  rank-up and Event Ready glows are meant to be stronger or animated than this. Nothing glows at the top rank.
- Tests [67]. Seen in the pane on Brienne (Charm 18.5, Venom 13, Restraint 3, Torment 41, 80 personal EXP):
  Charm glowed, its tooltip read "2 to next rank.", the counter read 21 days, and the button read Reset · 59
  EXP. Confirming it left 21 EXP, every tag on its floor (8 / 8 / 0 / 40) and "At the rank floor."

### 14. Lust Events ☑
> Make it so a character ranks up a weakness, it -can- lead to a lust event, but not always. 
> When a weakness ranks up, save that information for the next time they are in the teambuilding scene.
> Rank-ups with no event waiting trigger a Rank Up Notification state, whereas if an even is waiting it triggers an Event Ready state. 
> Any Event Ready states should block the player from adding that character to the party until they are all resolved.

> In a Rank Up Notification state, the character's roster icon glows a subtle pink.
> This state does not block them from being added to the party.
> The weaknesses that recently ranked up glows pink, moreso than the "close to the next rank" glow mentioned earlier, but visibly less than the Event Ready glow.
> Weaknesses that recently ranked up will display "Recently ranked up!" in their tooltip.
> Weakness frame glows are cleared once the player clicks on or hovers over the weakness, seeing that it ranked up.
> Rank Up Notification for a character is cleared once all of THEIR weakness glows have been dismissed. (It is not affected by other characters! That would be an easy mistake to make.)

> In an Event Ready state, the character's roster icon glows a more noticably animated pink than in the Rank Up Notification state.
> They cannot be added to the party, the button to add the character is replaced with a heart that on-click displays a tooltip saying "A new Lust Event must be triggered before X can be added to the party!" Before listing labelled buttons to trigger the pending events.
> Clicking or hovering over a weakness causing the state does not clear the glow, instead it displays the tooltip saying "Recently ranked up!" And a bold pink button labelled "Event Ready!".
> Clicking the button triggers an event, most often with the choices ending the event ready state. 
> Sometimes one of the choices will leave the character in the event ready state.
> Some of these choices should also be able to increase lust weakness, grant experience, unlock equipment, unlock costumes, or unlock otherwise locked progression tabs.
> Lust events can trigger battles called "Lust Battles". For these, allow for a system where a pre-selected party is built for the player
> By default the lust event pre-selected party is just the character having the lust event alone.
> Lust battles trigger special event continuations if you win or lose. The default case for both should be an event just saying "Lust Event Cleared!" which returns you to the teambuilding menu with the rank-up cleared.

Engine `honeycomb-lust-events.js`, content `honeycomb-content-lust-events.js` (both new; index.html, mobile.html,
REQUIREMENTS §2 and the test FILES list updated).

- **Records, not stored states ☑.** Every rank a weakness crosses leaves one record on the profile,
  `profile.lustRankUpArray[character] = [{id, tag, rank, eventIndex, trigger}]`, from `lust.noteRankChange` (so a
  jump of two ranks leaves two, in order). A record with an event is Event Ready; one without is a Rank Up
  Notification. `lustEvents.characterState` / `tagState` read them, so the two states can never disagree with
  the records.
- **"Can, but not always" ☑.** `honeycomb.lustEventTriggerArray` entries match a rank-up by `rank`, optional
  `tagArray` / `characterArray` / `condition`. One matching trigger is picked by `weight`, then its `chance` is
  rolled, else `tuning.lustEvents.chanceByRank` (1: 0.5, 2: 0.7, 3: 0.9). Both rolls use a new `lustEvent` RNG
  stream, so they are deterministic. **The odds are my guess; say if they should differ.**
- **Rank Up Notification ☑.** The roster entry has a still, subtle pink glow and does not block the party. The
  weakness row glows pink, above the item 13 near-rank glow and below Event Ready. Its tooltip says "Recently
  ranked up!". Hovering, tapping or clicking the row clears THAT weakness for THAT character only, in place, with
  no rebuild (`teambuilding.noticeWeakness`, from the `weakness` tooltip's `onShow` with a `/sheet` key). The
  roster glow goes once that character has no notification left.
- **Event Ready ☑.** The roster glow pulses. The add button is replaced by a heart; clicking it pins a panel
  reading "A new Lust Event must be triggered before X can be added to the party!" with one bold pink button per
  weakness waiting, e.g. "Venom · Susceptible". The weakness row pulses too. Its tooltip says "Recently ranked
  up!" plus an **Event Ready!** button, and being seen does not clear it. `toggleMember`, `placeMember` (drag)
  and `startRun` all refuse the character (`teambuilding.joinRefused`).
  - **Buttons inside tooltips needed a new kind of tooltip.** Panels were `pointer-events: none`. A kind marked
    `interactive` now takes the pointer and waits `tuning.ui.interactiveTooltipGraceMs` (300) after the pointer
    leaves, so it can cross onto the panel. `tooltip.showInteractive` pins one open on a click until a press
    lands elsewhere; that press is caught by the existing capture listeners on honeycomb's own root and host.
    The grace is a raw hand-speed wait, deliberately not scaled by play speed.
  - The pink button keeps its own face instead of the shared button frame (`HC-PLACEHOLDER`).
- **The event ☑.** It opens over teambuilding through the ordinary event overlay, which now has HOSTS
  (`honeycomb.eventHostArray`: "map" and "lustEvent"). A host decides what leaving does, whether the event is
  marked seen, and how its fights start. A Lust Event shows its character as the speaker (`speakerIsSubject`)
  and fills `{name}`, `{tag}` and `{rank}` in any text. Leaving resolves the record ("Return to the roster"),
  unless a choice marked `keepsEventReady` was taken; that choice previews "The event stays ready afterwards."
  Only the lowest waiting rank of a weakness can be played (`lustEvents.begin` refuses a later one).
- **Rewards ☑.** Three new effects act on the event's character: `gainWeakness` (`tag: "eventTag"` = the
  weakness that ranked up; this can itself cause a rank-up and a record), `gainPersonalExperience` and `unlock`
  (any `unlockKindArray` kind). A new kind, **`tab`**, is per character: a teambuilding tab marked
  `requiresUnlock` stays hidden until unlocked. No shipped tab is locked yet, since there was nothing locked to
  unlock. There were no locked outfits either, so "unlock costumes" works through the same effect
  (`kind: "outfit"`) but is not in the content. **Say which tab or outfit should start locked.**
- **Lust Battles ☑.** A fight needs a run, and there is none between runs. A Lust Battle's `startCombat` leaves
  its request on the state, and the host builds a THROWAWAY RUN: `newRun(selections, null, {lustBattle})`, with
  no lifetime count and the per-run rank allowance left alone. The party is `partyArray` on the effect
  ("subject" = the character), default `tuning.lustEvents.defaultBattlePartyArray` = the character alone, in
  their current loadouts. It pays no gold and no card choice (`battleRewardArray`), since the run is discarded;
  experience is still earned.
  - A new `lustEvent` combat continuation brings the player back to the event. It opens on `victoryPage` /
    `defeatPage` when the event names one, else `victoryEvent` / `defeatEvent`, else **"Lust Event Cleared!"**
    (`lustEventCleared`), shown as a finished result so its only button returns to the roster and resolves
    the rank-up.
  - The defeat screen now honours a continuation with `finishDefeat` instead of always ending the run.
  - Abandoning or forfeiting a Lust Battle returns to teambuilding, counts nothing and leaves the event waiting.
    **Say if it should count as a loss instead.**
- **Content (placeholder writing) ☑.** One trigger per rank for anyone. Rank 1 "First Stirring": talk (EXP),
  lean in (weakness +4, EXP), give them time (stays ready). Rank 2 "Trial": a solo Lust Battle against a lone
  sporeling, with a page each for winning (EXP) and losing (weakness +3), or not tonight (stays ready). Rank 3
  "Undone": EXP, or unlock the Duelist Blade.
- **Warning rule** `lustEventTrigger`: a trigger naming a missing event, rank, non-lust tag or character.
- **Follow-up (Noodle, same session): authored lists ☑**
  > Actually, I was thinking of manuay preparing a list of specific events beforehand, with lust events being the primary way to build the actual narrative of the game. They're one of the only ways I can reliably ensure progress is being made, since due to the procedural generation of the game map I can't know much else for sure.
  > This list would be stuff like "nettle, exposure, 1, [event index]". Perhaps with some kind of general equivalent tracking the total number of lust events, and the total number of lust events in a specific category.

  What a rank-up raises is now decided in this order (`lustEvents.chooseEvent`), and the first answer wins:
  1. **THE LIST** `honeycomb.lustEventListArray`, rows written exactly as asked:
     `["nettle", "exposure", 1, "eventIndex"]`. It always fires, with no dice. A rank is never lost, so each row
     plays exactly once per profile, whenever the map happens to deliver that rank-up. Either of the first two
     may be `"any"`. The most specific row wins (character + tag, then character, then tag, then neither), and
     among equals the first written.
  2. **THE MILESTONES** `honeycomb.lustEventMilestoneArray`, "the Nth Lust Event of a category". A category can
     be overall, a weakness, a character, or a character's weakness:
     `["total", 5, "e"]` / `[5, "e"]`, `["charm", 3, "e"]`, `["nettle", 2, "e"]`, `["nettle", "charm", 2, "e"]`.
     - It fires at the first rank-up in its category once N-1 events of that category have been RAISED, then
       never again (`profile.lustMilestoneFiredArray`).
     - If a list row claims the rank-up that would have been the Nth, the milestone WAITS for the next rank-up
       in its category rather than being skipped, so a written beat is never lost. The cost: it can land one
       event later than N.
     - A character-scoped milestone waits for that character's next rank-up. Each character has 15 in a
       profile (5 weaknesses × 3 ranks); once all are spent it cannot fire.
  3. **THE FALLBACK** triggers (the random table built first), only when neither answers. Empty that table
     for a fully hand-written game; an unanswered rank-up is then a plain Rank Up Notification.
  - **Tallies** `profile.lustEventTally`: `raised` (handed out, from whichever of the three raised it) and
    `completed` (resolved, not kept ready). Each is counted overall, per character, per weakness, and per
    character + weakness (`lustEvents.countFor(kind, character, tag)`). Milestones count `raised`, so an event
    left waiting still moves the story on.
  - **Content can ask how far the story has come**: the condition/value `lustEventCount`
    `{character ("subject" = the event's own), tag, tally: "completed" (default) | "raised", atLeast}`. This
    works on a trigger, an event, a choice or a card condition.
  - **Warnings**: `lustEventListRow` (a character, tag, rank or event that does not exist, or a row an earlier
    row already claims) and `lustEventMilestoneRow` (an unreadable category, a count under 1, a missing event, a
    row written twice). The warning names the row as written.
  - **Example rows only** point at the placeholder events: Nettle's first Exposure rank goes straight to the Trial,
    Severine's rank 3 in anything is Undone, the first Lust Event anyone has is First Stirring, and the third Charm
    event is the Trial. The fallback triggers are still in place. **Say if they should go now.**
  - Tests [69]. [68] tests the fallback, so its engine clears both lists.
- Tests [68]. Seen in the pane: Nettle (Venom rank 1 notification + rank 2 event) was taken out of the party with
  a notice, had the pulsing entry and the heart, and her gate panel listed "Venom · Susceptible". Her Venom row's
  Event Ready! button opened the Trial with Nettle as the speaker. She fought the sporeling alone, the victory
  screen showed 0 gold and no card, "Continue" reopened the Trial's victory page with no run, and "Return to the
  roster" resolved the record. That left her rank 1 notification glowing; hovering the row cleared it and
  Nettle's roster glow, while Severine's and Brienne's stayed. With every member Event Ready the party emptied and Start
  Run greyed out.

### 15. Lust events checklist ☑
> Additional constraints, expected results, and ways to test when completing the above section:
> A character in Event Ready state must be removed from the party on entering the teambuilding scene.
> Block the "Start Run" button if no character is in the party.
> Event Ready state should not be clearable by just clicking or hovering over the weakness, it overtakes the Rank Up Notification state if already present.
> Test that multiple Rank Up Notifications are not being cleared at once by hovering over one element.
> The glow effects should not shift around the character list in the roster menu. Feel free to add gap size to allow breathing room though, so that when the states are triggered there's enough space to see the glow.
> Multiple glowing roster frames should not block each other from being clicked.
> Test that a character with multiple events pending does not clear their Event Ready state after just one lust event.
> Test that if somehow skipped a rank still plays the events in proper order. Like if somehow they have Charm rank 2 with an event at rank 1 and rank 2, but didn't trigger event 1, that clicking "Event Ready!" plays the charm 1 event and they keep their event ready status until Charm rank 2 is complete.

Each line is a test in [68], numbered 15.1–15.8:
- **Removed from the party on entering ☑** (15.1): `lustEvents.removeBlockedFromParty` on every teambuilding
  build, with a notice naming who left. The default party is now filled only the first time
  (`profile.partyFilledOnce`), so an emptied party stays empty.
- **Start Run blocked with nobody in the party ☑** (15.2): the button greys, and `startRun` refuses instead of
  filling a default team. Seen in the pane.
- **Event Ready not cleared by seeing it, and overtakes Rank Up ☑** (15.3).
- **Multiple Rank Up Notifications not cleared at once ☑** (15.4, and 15.4b for a weakness read off the sheet).
- **Glows don't shift the roster ☑** (15.5): outer shadows and an inert `::before` layer only; the roster's gap
  went from 7.2 to 11 honeycomb pixels.
- **Glowing frames don't block each other's clicks ☑** (15.5): no glow layer takes pointer events.
- **Multiple events don't all clear after one ☑** (15.7).
- **A skipped rank plays in order ☑** (15.8): the earlier rank's event plays first, the later one is refused
  until then, and Event Ready holds until the last one is resolved.

### 16. Party details window ☑
> Add a heart menu to the menu topbar ONLY while on the map and in battle.
> Clicking this brings up a list of the characters in your party for you to inspect like in teambuilding.
> In this window you can see their outfit's effect, equipment, lust weaknesses, and cards which belong to that character in your deck.
> Clicking on or hovering over a weakness in this window should not clear the rank up notification in the teambuilding scene, and should not allow players to trigger a lust event from here.

☑ **Done (session 12).** A heart button in the top bar, gated by `showParty` and passed only from the map
(`honeycomb-map.js`) and the combat scene (`honeycomb-scene-combat.js`, build and repaint). It opens a new
`party` overlay (`honeycomb.partyWindow`, honeycomb-ui.js): the party down one side, and for the selected
member their class, outfit (name + description = the outfit's effect), equipment (each named and explained),
lust weaknesses, their cards in the run deck (owner-filtered through `deckScreen.entryArray(characterIndex)`),
and their obtainable-card list. **Read-only**: the weakness rows carry the plain tooltip key (no `/sheet`), so
seeing one never clears a Rank Up Notification and never draws an Event Ready! button; the bench counter and
its Reset button are teambuilding-only (`buildWeaknessSection(characterIndex, {readOnly:true})`). The deck
screen's `entryArray` gained an optional filter argument so another screen can ask for one owner's cards
without disturbing its own controls. Tests [71].

### 17. VFX ☑
> I've added several test VFX effects to v13 spire images/vfx. Please have attacks display a vfx of some sort over the attack target (some can default to none). Each of them is a different test of automated background removal, while the first is just an additive layer the second two will need you to create a chroma-to-alpha system. Have whatever system you add auto-detect what sort of type is used based on the suffix of the file as the top priority, then using the colors of all four corner pixels as a backup in case we forget to add a suffix in the future.
> The first, test-additive, is just to be displayed as an additive blending layer over the target.
> The second, test-green, should chroma-key out #00FF00, be sure to adjust tolerance enough that no green outline remains on the image, it should be a purely red-black blood attack
> The third is more complex, test-magenta, should chroma-key out #FF00FF, but the image itself has transparent elements. It's meant to be a green magical circle.

☑ **Done (session 12).** `honeycomb.vfx` (honeycomb-scene-combat.js) prepares an effect into `{src, blend}`
and `combatScene.playVfx(targetId, path)` lays it over the target as its own timed beat, so it plays
alongside the hit reaction rather than after it. Blend is read from the filename SUFFIX first
(`tuning.vfx.suffixRuleArray`: `-additive` / `-green` / `-magenta`), and only an unsuffixed file has its four
corner pixels inspected (`vfx.cornerColorArray` / `cornersAgree`): one shared opaque colour becomes the chroma
key, a near-black one means additive. The chroma key draws the image to a canvas, clears pixels within
`tolerance` of the key and feathers the edge to `tolerance × featherMultiple`, then caches the PNG. A
`file://` canvas is tainted, so a keyed copy is used when it can be made and the raw image when it cannot;
`vfx.prewarm()` prepares the default at the top of a fight. The `damage` log entry carries the effect's `vfx`
(stamped in `honeycomb-entities.js`), so an attack may name its own or `"none"`; an ordinary attack from a
source takes `tuning.vfx.defaultAttackPath` (`vfx/test-green`), and a `damageType` (poison, thorns, the broken
spiral) gets nothing. In content: Crimson Arc is `test-additive`, Nightfall is `test-magenta`, Claw Flurry
opts out. Tests [71].

**Follow-up (session 13, after Noodle's test):**
- **The additive ground is keyed too.** `test-additive` still showed its black square because `screen`
  blending cannot remove black over a dark or isolated backdrop. `vfx.process` now keys the near-black
  ground to alpha for an additive effect as well (`tuning.vfx.additiveBlackTolerance` / `...Feather`), so
  the black cannot show; the bright pixels still screen.
- **The chroma key no longer races the first play.** Preparing is asynchronous, and the first play of a
  chroma effect used to show the RAW image because the element was built before the key existed -- the
  intermittent "the magenta is still there / it worked once". `playVfx` now waits for `prepare` to answer
  before building the element, and in-flight loads queue their callbacks instead of starting a second
  request. The cache makes every later play immediate.
- **The card no longer flies at the target.** That flight crossed the board and covered the attack's VFX.
  `cardPlayed` now plays only the actor's pose; the card leaves the fan when its destination entry plays
  (`cardToDiscard` / `cardExhausted` / ...), which animates hand-to-pile without crossing the enemy.
- **IT KEYS OFFLINE TOO (Noodle's requirement).** A canvas cannot read a `file://` image, so the shipped
  effects no longer use one: `honeycomb.vfx.ensureFilters` builds three SVG filters and each named suffix
  applies one (`filter: url(#...)`). The filter leaves RGB alone and writes ALPHA from a linear combination
  of R/G/B (`Green: R-G+B+1`, `Magenta: -R+G-B+2`, `Black: R+G+B`), with `feComposite in SourceGraphic` so
  the filter's padding and any `object-fit` letterbox stay transparent instead of turning black. Verified by
  screenshot on a `file://` page: green and magenta backgrounds removed, additive black removed, no frame.
  The canvas path remains only for an UNSUFFIXED file's corner-pixel backup, which is online-only.


### 18. Relic and HP change previews should be right-aligned in events ☐

> Relic and HP change previews should be right-aligned in events, having everything left-aligned wastes a lot of space.

☑ The drawn outcome (party row, cards, relics) moved out of the text column into `.hcEventChoiceOutcome`
at the right edge of the choice (`renderChoice`). It wraps right-aligned; the text column keeps a minimum
width. Empty gain groups no longer print an empty box. Seen in the pane on the Well of Wax Light.

### 19. Hand space improvements ☑

> The empty versions of the hand shelf front assets are to make the game feel more responsive. The left hand side should become empty when out of energy, and the right hand side should show empty when you cannot click "End Turn" anymore. Make the existing end turn button invisible (and make it make a sound when pressed) so the new asset can be used.

☑ **Done (session 12).** `tuning.art.handShelf` now names both states of each corner
(`leftPath`/`leftEmptyPath`, `rightPath`/`rightEmptyPath`). `renderHandBar` picks the right one and gives
each image an id; `combatScene.refreshShelfState()` swaps them in place, called from `refreshHandPlayability`
(energy moved) and `showQueuedInput` (a turn end queued). `endTurnReady(combat)` is the shared answer to "can
End Turn still be pressed" (player turn and nothing queued). The button keeps its hit area but its label is
transparent (`.hcEndTurnInvisible`) because the plaque painting already says it, and `onEndTurnPressed` plays
`uiClick` before the turn machinery (a queued end turn calls `onEndTurn` directly and does not double it).

**Follow-up (session 13):** the old button's FACE was still visible. The End Turn button is `hcPrimary`, and
the primary UI frame nine-slice (`[data-hc-frame-button-primary="ready"] .hcButton.hcPrimary`) outranked the
shelf reset, so the frame drew over the plaque. Four-class rules
(`.hcHandShelf .hcShelfEndRight .hcEndTurn.hcEndTurnInvisible`, plus `:hover` / `:active`) now kill the
background, border, border-image, box-shadow and filter, with a faint hover highlight restored.

**Follow-up 2 (session 13):** the right corner only refreshed when a turn end was QUEUED, not when it was
taken at once, so pressing End Turn left the full plaque up through the enemy turn. `onEndTurn` now calls
`refreshShelfState()` right after `endPlayerTurn()` (phase already moved) and again after `startPlayerTurn`.
Verified in the browser: `shelfFrontRight.webp` -> `shelfFrontRightEmpty.webp` on the press.

### 20. A list of each character's obtainable cards ☑

> There should be a list of obtainable cards for each character (hidden if you've never obtained them) so a player knows what potential options they can get.
> This list should be located both in the compendium, in the party details window, and have a button to bring it up below the outfits list (since outfits are the most likely thing to change what cards are legal.)
> Have at least one card only appear when a specific costume is worn.
> Have at least one card appear at a reduced rate when a specific costume is worn.
> Have at least one card appear at a boosted rate when a specific costume is worn.
> Denote what cards are blocked from appearing, are reduced, and are more likely to be obtained in the total cards list, but only in the teambuilding scene and character details window, NOT the compendium list.

☑ **Done (session 12).** `honeycomb.obtainableCardArray(character)` (honeycomb-progression.js) is every card
naming the character; `cardCollectionMarkup` (honeycomb-ui.js) draws it as rows, an unfound card showing as
"???" (found/not read from `discovery.isKnown("card", ...)`). `cardOfferState` annotates each card from the
character's outfits: `costume` (an `offerCondition` naming a `wearsOutfit`/`hasEquipment`), `blocked`
(archetype ×0), `boosted` (×>1), `reduced` (×<1), with costume winning. The three locations: the Compendium
(`honeycomb-scene-title.js`, per-character sections, annotations OFF), the party window (annotations ON), and
a "View Obtainable Cards" button below the outfits row (`buildOutfitTab`) opening the `characterCards` overlay.
Content (Severine): Blood Pact is `offerCondition` crimsonCovenant (costume-only), Drain ×2 with Huntress
(boosted), Claw Flurry ×0.5 with Blood Saint (reduced); the shop now also honours `offerCondition`
(`combat.cardOfferableForParty`). Tests [71].

**Follow-up (session 13):** the badges did not say WHY, so "so many cards boosted or blocked on a default
outfit" read as a bug. `cardOfferStateInfo` now returns the reasons alongside the state -- the outfit or
piece and the multiplier ("Huntress (feast) ×3", "Only offered with Crimson Covenant") -- and the list
prints them as a dim line under each card. Blood Pact's "costume only" is its `offerCondition` on the
Crimson Covenant. Note the annotations deliberately span EVERY outfit, not only the one being worn, because
the list is the character's whole collection; the reasons make that legible.

**Follow-up 2 (session 13, Noodle's rule):** the annotations must describe the outfit worn NOW, not the
whole wardrobe -- "players will get the impression that something like Claw Flurry is reduced even in the
default outfit." `cardOfferStateInfo(character, card, member)` now takes the live loadout and computes the
real offer weight: a failed `offerCondition` is "Blocked", otherwise `offerWeightArray` and
`archetypeWeightFor(member, card)` fold into one multiplier (>1 Boosted, <1 Reduced, else none). The reasons
name the worn outfit. The characterCards window and the party window pass the loadout (teambuilding's
`loadoutFor`, or the run member). Verified in the browser on Severine -- default: all normal except Blood Pact
(Blocked, "Not offered in Default"); Huntress: Drain Boosted, Transfusion Blocked; Crimson Covenant: Blood
Pact Boosted; Blood Saint: Claw Flurry Reduced, Transfusion Boosted. Test [71]. Each row is also the card's
own tooltip now (`tooltip.attributes("card", index)`), so hovering or tapping it shows the card.

### 21. More teambuilding scene tweaking ☐

> Costume selection buttons should be bigger and taller to actually show off the character's body.
> Since outfits are tall, the outfits submenu will need to scroll from side to side, the layout will also make it easier to compare visually.
> Descriptions for each outfit's effect should go below the outfit always, not just when equipped.
> No need to have a duplicate outfits found counter inside the outfits submenu.

☑ `buildOutfitTab`: one sideways-scrolling `.hcOutfitRow` (keeps its scroll through rebuilds) of 140-wide
cards showing the outfit's full-body `1-basic` sprite at the sprite aspect, name, then the outfit's
description under every unlocked outfit (the default outfit has none to show). The "Outfits found"
tracker and the active-only note are gone; the Details tab's Outfits tile still counts. Seen in the pane on Nettle.

### 22. Event images don't fit ☑

> Events must be able to use 1024x1024, 832x1216, or 896x1152 art, they must be right aligned, and the vignette behind the event text window must cover any areas where the background would be visible due to the image's size.
> Diagram example
> Empty scene, background visible: -
> Picture: P
> Event window: W
> Vignette: V

> Current layout using a square image:
> WWWPPP---

> If the image were shifted to the right:
> WWW---PPP

> Vignette stretched to cover empty space:
> WWWVVVPPP

> Result: Player is sold on the illusion the image extends all the way to the left side of the screen, I don't need to generate at unreasonable aspect ratios the AI struggles with.
> For testing, view a screenshot of the Shop, then test the shop with the shop's image resized to the other dimensions listed above.

☑ **Done (session 12).** `.hcEventArtSquare` is right-aligned (`justify-content: flex-end`) and its
`.hcEventSquareArt` image now stands at the full height the board leaves at its own aspect (no forced 1:1, no
`cover` crop), so 1024x1024, 832x1216 and 896x1152 all show whole. The empty space between the board and the
painting is covered by a left-to-right vignette gradient on the art container (dark at the board's edge,
fading out only where the painting begins), so the painting reads as running to the board. The
`honeycomb.ui.backdrop` vignette (blurred cover copy + `.hcEventVignette`) is unchanged. **Not yet seen in a
browser at the three sizes** -- the shop test above still wants doing.

**Follow-up (session 13):** the SHOP's art was not right-aligned. The shop has no separate illustration; its
backdrop painting IS the art, and it was centred with a blurred cover copy filling the bars. `.hcShopScene`
now right-aligns `.hcEventBackdropArt` and hides `.hcEventBackdropFill`, so the painting sits right and the
vignette swallows the space to its left (`WWWVVVPPP`).

### 23. Potential fullscreen notification workaround checklist ☑

> List of things to try to improve mobile experience despite the fullscreen notification:
> Add fullscreen button to title screen.
> Floating, slightly bobbing up-and-down semi-transparent arrow in the middle of the battlefield when everything is at rest, only on mobile landscape, tapping it lifts up the hand as if the hand was clicked.
> Click outside of a window (such as when inspecting an enemy) to close the window, since the actual close button may be blocked.
> Move party draggable-lineup below the "Roster" window, moving "Front" and "Back" labels to reduce horizontal footprint.

☑ **Done (session 12).**
- **Fullscreen on the title** already existed (`honeycomb-scene-title.js`, plus the top bar and system menu).
- **The bobbing arrow**: `.hcHandHint` in the combat scene, shown only under `(orientation: landscape) and
  (pointer: coarse)` and hidden while a replay runs (`#honeycombRoot.hcBusy`); a tap calls
  `combatScene.onHandHint`, which nudges the fan up (`hcHandNudged`). Geometry in `tuning.layout.handHint*`.
- **Press the ground to close**: `closeOnBackdrop` on an overlay registration; the layer closes when the press
  lands on the layer itself. Set on pile / enemyMoves / battleLog / deck / compendium / systemMenu / debug /
  relics. Decision windows (victory, defeat, choice, confirm) do not opt in.
- **The party lineup** moved out of the footer into a `.hcTeamLeft` column directly under the Roster window,
  with the Back / Front labels on a line above the strip so the portraits keep its width.

### 24. Choppy, and slow to load? ◐

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
Nothing below has been changed; it is a reading of the code as it stands. Ordered by how likely each is to be
felt, with where it lives.

*Known already (Noodle's two):*
1. **Images are fetched lazily, at the moment they are shown.** Nothing is preloaded. A fighter's sprite, a card's
   art, a backdrop and a UI frame are all plain `<img src>` emitted fresh on every scene build (`honeycomb.imageTag`,
   `honeycomb.js`; fighter art in `honeycomb-art.js`). Online, the first draw of each is a network round-trip, so a
   new card or enemy visibly pops in mid-animation. The nine-slice UI frames are the only thing probed ahead of time
   (`ui.loadFrames`). → the loading screen Noodle named.
2. **The enemy turn is a strict sequence, and the read-pause is the longest part.** `moveUsed` shows the card and
   waits `enemyCardRevealMs + enemyCardHoldMs` (260 + 700) before `playPresentation` fires the lunge, and only then
   does the `damage` entry play. Three separate waits in a row per enemy (`honeycomb-scene-combat.js`, the
   `moveUsed` handler). With several enemies this is the bulk of a turn's wall-clock. → overlap the read with the
   pose and the effect, as Noodle proposed.

*Added by reading the code (not acted on):*
3. **Combat repaints rebuild the whole screen from `innerHTML`.** Every `afterBeat` calls `repaint()`, which
   re-serialises the battlefield sides, the entire hand bar (every card), and the top bar
   (`honeycomb-scene-combat.js`, `repaint`). Re-emitting the same `<img>` tags re-triggers image decode/relayout and
   throws away and rebuilds DOM nodes, which is a classic source of frame drops. `updateVitals` already exists to
   redraw only a plate; the same idea is not applied to the hand or the sides.
4. **Forced synchronous reflows.** Several places read `void element.offsetWidth` to restart an animation
   (`holdClass`, `swapPose`, the hand hint, the fan). Each forces layout; several per beat on a full board is
   measurable. `getBoundingClientRect` is also called during drags and forecasts (`drawBeam`, `placeMember`,
   `measureSlots`), each a layout read.
5. **Forecasts run the real action and roll the world back.** Hovering a card, aiming, or reading a Lewd card
   dry-runs the effects for real and restores a snapshot (`honeycomb-forecast.js`). That is correct and
   deterministic, but it is CPU work on the hover path, and the snapshot/restore of `honeycomb.state` copies a
   large object. On a phone this is felt as hover lag.
6. **Expensive CSS effects, un-gated by device.** `backdrop-filter: blur()` on every overlay
   (`.honeycombOverlay`), a blurred cover copy behind every full-bleed backdrop (`.hcEventBackdropFill`,
   `filter: blur(...)`), `drop-shadow` filters on sprites, `mix-blend-mode` on the new VFX, and many simultaneous
   CSS animations. Blur and blend are GPU-heavy on mobile; there is no reduced-effects path.
7. **No `will-change` / compositor hints beyond the hand cards.** `.hcCard` has `will-change: transform`, but
   fighters, plates, floating numbers and VFX elements animate transforms/filters without a hint, so the browser
   promotes and demotes layers as they move.
8. **Many small DOM writes per beat.** Floating numbers, drain trails, nameplate rebuilds, mechanic widgets,
   card-flight ghosts and the hand-motion FLIP all append/remove nodes mid-replay
   (`floatNumber`, `renderLustPeeks`, `handMotion`). Each is cheap alone; together they are the "busy" moments.
9. **The boot payload is large and synchronous.** ~1.5 MB of JS across ~30 files plus a 228 KB stylesheet, all
   parsed at load, and `honeycombBoot` runs the warning report and content reconciliation before the first frame.
   The first paint waits on all of it.
10. **The chroma-keyed VFX does per-pixel work on the main thread.** The first time a chroma effect is prepared,
   1,024×1,024 pixels are looped and re-encoded to a PNG data URL (`honeycomb.vfx.process`). It is warmed at the
   top of a fight, but on a phone that warm can still land on a frame. (New in session 12.)
11. **`honeycomb.duration` multiplies every wait by the play speed; at the default there is no "fast" fallback.**
   The slow speeds are a debugging tool, but a player who never touches the slider still sees every hand-tuned
   beat in full. A "skip what the player has already seen" pass is a possible later lever.
12. **No explicit image `decoding`/`loading` attributes.** `<img>` tags carry neither `loading="lazy"` (so
   off-screen art still competes) nor `decoding="async"` (so a large image can block the main thread while it
   decodes). A cheap, low-risk win once the list is acted on.

### 24. Status

☐ The list above is built; none of it acted on, as instructed. The two potential solutions Noodle named are the
first things to try when work begins.

### Place remaining unsorted feedback issues and bug reports here

**GROUPED STATUS (session 13).** The items below, by area, so what is still live is legible at a glance.
The quotes and their annotations follow, unchanged.

| Group | Item | State |
|---|---|---|
| Combat presentation | Once-per-battle half-health cut-in (damaged sprite, short, no background) | ☐ open |
| Combat presentation | Hover a player character at rest -> bring them forward into focus | ☐ open |
| Combat presentation | Broken: block the tHP overflow effect; give lust its own lightning overflow in recolored pink | ☐ open |
| Combat presentation | Broken passive damage should fire on End Turn, not like poison | ☐ open |
| Combat presentation | Remove the card the enemy is playing from its preview (Matriarch swarm) | ☐ open |
| Forecasts / tooltips | Cleave and Beguile not recognised by the health/lust forecast | ☐ open |
| Forecasts / tooltips | Carapace tHP reads +16 / +30 / +16 | ☐ open |
| Forecasts / tooltips | Vertical cards are hard to read | ☐ open |
| Forecasts / tooltips | Move all tooltip text (lust weaknesses included) into one document | ☐ open |
| Teambuilding / roster | Details tab foldable; weaknesses title glows while folded when Event Ready / Rank Up | ☐ open |
| Teambuilding / roster | Split Severine's orb mechanic into three buff slots | ☐ open |
| Resolved | Nameplate stagger (odd plates a little higher) | ☑ session 10 |
| Resolved | "1 foe / 2 foes" preview ignored party-size scaling | ☑ session 12 |
| Resolved | Enemy-move cards collapsed smaller than the card backs | ☑ session 12 |
| Resolved | Exsanguinate (and every hand-written card text) ignored Strength | ☑ session 11, tokens |
| Resolved | Embrace x4 | ☑ Venom-only; "another 40 incoming" still unconfirmed |
| Resolved | Matriarch in front / shifts on aim / brood on turn 1 | ☑ |
| Resolved | Rest-site upgrade tooltip lock-up | ☑ session 11 |
| Resolved | Title screen does not scroll | ☑ session 11 |
| Placeholder | "Space for minor issues discovered during rate limitation breaks" | — not an issue |

> There should be a once-per-battle effect the first time a character reaches half-health, having their damaged sprite in focus in front of the screen similar to the frontmost layer of the broken animation, but shorter and without all the background elements.

> Mousing over a player character while the hand is down/not dragging a card/at rest should bring them forward into focus to make their detail more visible and nameplate more easily clickable.

> Please move all tooltip text, don't forget ones related to lust weaknesses, into a single document for easier editing.

> Space for minor issues discovered during rate limitation breaks and misc testing.

> Let's break up the visual static-ness by giving a bit of an offset to nameplates based on the character's position in the party, with odd-numbered party member nameplates being set a little higher than even ones.

☑ Scene layout `allyPlateStaggerPercent: 5` (added to `vitalsBottomPercent` for the 1st, 3rd, 5th member;
about 18px at 1280x720) and `enemyPlateStaggerPercent: 0` (off; say if enemies should stagger too). An
anchored boss is never staggered.

> When broken, the visual temporary health overflow effect should be blocked, but lust should have its own overflow effect which is nearly identical but based on lust overflowing the maximum hp, and the lightning should be recolored pink. 

> Vertical cards are a bit hard to read.

> Split severine's orb mechanic into three separate buff slots, it's too hard to mouseover and check each individual one.

> The passive damage from being broken should not be triggering like poison, it should instantly trigger on hitting end turn so not to delay gameplay.

> The tooltip health and lust forecast not recognizing the enemy about to cast cleave and beguile, possibly because they are all-hitting and random respectively?

> Tooltips list "1 foe" or "2 foes" but player with 6 in party reports every fight having a minimum of 4.

☑ (session 12) The map preview read `encounter.enemyIndexArray.length`, the BASE line-up, while the fight
scales enemy COUNT by party size. It now uses `combat.scaledEnemyCount(encounter)`, which mirrors
`scaledLineUpArray`'s growth without drawing reinforcements (the preview must not spend the encounter RNG).
Test [71].

> Matriarch casted Embrace causing every party member to gain 40 lust, far more than it should have even with weaknesses, and after being applied the forecast shows another 40 lust incoming until the end of her turn.

◐ Embrace was 10 lust tagged Restraint AND Venom, and `lust.vulnerabilityMultiplier` MULTIPLIES the rank
multipliers of every tag: two Undone weaknesses = 2 × 2 = ×4 = 40. **Noodle's answer (session 11):**
> Embrace definitely shouldn't be using two weaknesses, it should be changed to venom

☑ Embrace is tagged Venom alone. The multiplying rule itself is unchanged, so any future card with two lust
tags stacks the same way. ☐ The "another 40 incoming" half is likely the unsorted "cards the enemy are
playing should be removed from their previews" item below, not a second hit; unconfirmed.

> The matriarch is STILL being drawn in front of her minions, this should have already been fixed in a previous session.

☑ The round 05 fix (her `z-index: 0`) was outranked by depth focus's rank order,
`.hcSide-enemy .hcFighter:nth-child(1) { z-index: 3 }`, and she is the first child. Simply winning that
fight buried her nameplate, since her brood covers her whole width. So her column now makes no stacking
context at all (no z-index, transform or filter in any focus state), her sprite stays behind the row, and
her plate and intent card are lifted above it (z 5). Her focus dimming and target glow moved onto her sprite;
she no longer steps forward when focused. **Her intent card now covers the left sporeling's intent card**
at the current placement; say if the boss's card should sit elsewhere.

> The matriach shifts position when dragging a card to target her.

☑ She was centred with `transform: translateX(-50%)`, and the focus/target rules replace `transform`, so
the centring vanished while aimed at. Centred with `left: calc(50% - width / 2)` now; measured centre
unchanged under `hcAimTarget`.

> While casting Carapace, Matriarch has 2 tHP and is set to gain 14 tHP. Her tHP briefly reads +16, then +30, then +16 again. The bug could be that she's getting double the printed value? Or is it a forecast bug?

> Matriarch can still cast brood on the first turn

☑ Her `threshold` move strategy picked from its phase list without ever calling `eligibleMoveArray`, so
`chargeCost` AND `maximumInARow` never applied to her (every other strategy honoured them). It filters by
eligibility first now. Her frantic phase is all charged moves, so a phase with nothing legal falls back to
any legal move instead of idling. Test [70]: 40 seeds, no opening charged move.

> Teambuilding's details tab should allow for folding of the categories. The weaknesses category name needs to glow while folded if Event Ready or Rank Up Notification though.

> Cards the enemy are playing should probably be removed from their previews, otherwise it seems like they'll cast it again. Matriarch casting swarm while her minions act is the most notable example of this

> Exanguinate's preview isn't affected by Strength

☑ Not Exsanguinate alone: EVERY card with hand-written `text` printed fixed numbers, since only generated
text ran live. Hand-written text can now mark live numbers with tokens, `"Deal {damage:9} damage."`
(`honeycomb.cardTextTokens`; kinds `damage` and `temporaryHealth`, through the same `describeAmount`). 28
text lines were tokenised (plain enemy-directed damage only, checked against each card's effects; the
`ignoresStrength` poison card and Cinder's damage-per-place multiply were left alone). Hand-written Temporary HP and
Lust numbers are not tokenised yet. Test [70].

> When inspecting an enemy, cards with tooltips are dramatically smaller than other ones

☑ (session 12) The seen move's large card sits inside the tooltip's own flex wrappers
(`.hcTooltipCardRow` > `.hcTooltipCardColumn`); those sized to their content, so `width: 100%` on the card
resolved against an auto-width box and it collapsed. `.hcEnemyMoveCell .hcTooltipCardRow` /
`.hcTooltipCardColumn` now fill the cell, so the seen and unseen cards match.

> Also I got a pretty serious bug report that upgrades at the resting point are causing tooltips to linger, and when you go to upgrade again the game completely locks up

☑ (session 11) Two causes. Picking a card in the upgrade window redraws it, destroying the hovered card
without a mouseleave, so its "after upgrading" panel stayed up over the Now / Upgraded preview. And that panel
TOOK CLICKS: it is a direct child of the overlay host, whose `> *` rule turns pointer events on and outranked
`.hcTooltip`'s `none`. It sat on the Upgrade button and swallowed every press. Fixed on all three fronts:
the stylesheet keeps pointer events off every non-interactive panel, `choiceOverlay.repaint` hides the
tooltip, and any press clears a panel whose anchor is gone. Seen in the pane with real clicks: two upgrades
at two campfires in a row, no leftover panel.

> Title screen does not scroll

☑ `.hcTitleInner` is a scroll container with `justify-content: safe center` (an overflowing column no
longer centres its top out of reach). At 812x375 it scrolls 458 of content with the top visible.