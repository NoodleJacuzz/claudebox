# Honeycomb Catacombs — TRAPS AND SETTLED DECISIONS

**Grep this file; do not read it whole.** Every entry is a mistake a session actually made, or a
decision that cost time to reach. Each is a bold headline followed by the reasoning, so
`grep -n "^\*\*" reference/TRAPS.md` gives the index and a search for a keyword gives the entry.

Do not re-litigate an entry without reading its reasoning first.

New traps are appended to the section they belong to, with the session or feedback item that caused them.

Sections, in file order:

| Section | Covers |
|---|---|
| Content and card text | card text tokens, card types, rarities, retired cards |
| Combat, forecasts and state | the log, choices, rewinds, determinism, who is downed |
| Lust and Broken | the Broken overhaul's rules and the Lust model |
| Layout, CSS and scaling | honeycomb pixels, stacking contexts, tooltips, the host page |
| Animation and art | the break cut-in, masks, poses, placeholder art |
| Tooling and editing | parsing, caching, scripted edits |

---

## Content and card text

**HAND-WRITTEN CARD TEXT IS STATIC UNLESS ITS NUMBERS ARE TOKENS (session 11).** Only generated text reads
Strength / Weak / Vulnerable. A new hand-written `text` writes `{damage:N}` (or `{temporaryHealth:N}`) for a
number that goes through that pipeline; a number that does not (an `ignoresStrength` hit, a multiplier) stays
plain. Test [70] fails on any token left unread.

**EVERY AI STRATEGY PICKS FROM `eligibleMoveArray`.** `threshold` did not, and the Matriarch ignored her
charging bar for two rounds. A new strategy that skips it ignores `chargeCost`, `maximumInARow` and move
conditions.

**AN EVENT MAY BE OPENED WITH NO RUN, AND A FIGHT MAY HAPPEN WITHOUT ONE (round 06, item 14).** Lust Events open
over teambuilding. Anything new in the event overlay must ask `honeycomb.eventHost()` rather than assume the map,
and must not assume `honeycomb.state.run` exists; `startCombat` leaves its request on `pendingCombatHolder()`.
A Lust Battle's run is THROWAWAY (`run.lustBattle`): `finishRun` sends it back to teambuilding without counting
it, and anything that pays into a run during one is lost when it ends.

**A NEW CHARACTER NEEDS NOTHING BUT TABLE ENTRIES AND ART, AND OLD SAVES STILL SEE THEM (session 8).**
`honeycomb.save.reconcileContent` adds every `unlockedFromStart` character a loaded roster is missing; the
roster reads the profile's list directly, so without it a character added after a profile was made never
appears. A new source image on white is cut out by the generator (`cut_out_white_background`).

**Card types are DERIVED** (`cardTypeRuleArray`). Don't write `type: "support"` on a card — only
Passive/Status/Curse are declared. Read types with `cardTypeIndexArray` / `cardHasType`, never `.type`.

**AN EVENT EFFECT THAT CHANGES THE WORLD MUST LOG IT.** Test [52] dry-runs every event choice and
fails on any change no log entry explains (`forecast.unexplainedArray`), because the choice's preview
is built from the log. A status given outside a fight is `carried` into the next one.

**Placeholder art for cards nobody owns must not show a character.** The Wisp curse card was cropped from
Nettle's portrait and read as her card. Neutral/status/curse art is abstract now (`ABSTRACT_CARD_RECIPES`).

**Party-size scaling changed its defaults** (round 02, item 10): enemy stats do not scale; enemy COUNT
does (+1 per member over 3). A boss fight only grows by its `reinforcementArray`.

**A loadout's hooks come from `memberCardModifierArray`, never hand-read.** `hookSourceArray` used to
read equipment and outfit itself and so missed progression nodes entirely — every tree-node hook was
dead text until round 02. Anything a member wears or buys goes in that one list and nowhere else.

**A progression RANK is a repeated index.** `profile.progressionArray[character]` holds a node's index
once per rank; `rankOf` counts. `selectedNodeArray` returns one copy per rank, so modifiers stack.
Refunds go through the ledger (`profile.progressionPaidArray`): each rank returns to the pool that paid
for it (personal vs global). Never splice the selection list without `refundRank`.

**Starting relics are HEIRLOOM equipment now** (round 02). `startingEquipmentArray` on a character; a
party selection with NO `equipmentArray` means "starting equipment" (the test harness relies on this),
while an empty array means none. An heirloom's effect still reaches the whole party: its hook acts on
every ally, and `fireRunHooks` reaches worn equipment as well as relics. Equipment has ONE wearer across
fielded members AND benched characters' remembered loadouts (`honeycomb.equipment`, honeycomb-state.js).

**Save format is 5** (round 04: moves became cards; session 5: shields out; round 06: `statusWisp` became `curseWisp`). `honeycomb.save.migrationArray` holds each shape change as a step with a
`toVersion`; bump `tuning.save.formatVersion` and append a step — never edit an old one.

**Piles hold instance ids, not card objects.** One card can never be in two piles, and a save cannot
duplicate it. `honeycomb.combat.cardInstance(id)` resolves back; cards created mid-fight live on
`combat.temporaryCardArray` and vanish with the fight.

## Combat, forecasts and state

**WORLD HOOKS REACH STATUSES A MEMBER HOLDS (session 8).** `fireRunHooks` now walks each standing member's
statuses (with `wearer`), so a Passive card's status can hear an enemy fall or lust leave an ally. A status
hook that should only fire for its holder's own team has to check `params.wearer` itself.

**A TURNED MOVE IS TAKEN FOR THE OTHER TEAM THROUGH `context.actingSide` (session 8).** `honeycomb.userSide`
reads it first, child and override contexts copy it, and `moveCard` prints the card from that side. Anything
new that builds a context for an AI move must carry it.

**INPUT DURING A REPLAY IS QUEUED, NEVER DROPPED (round 06, item 0).** A new way for the player to play a
card goes through `combatScene.requestPlay`, not `attemptPlay`: that is what checks it against the queue
and waits its turn. A new thing a held card does while dragging must ask `combatScene.dragQueued` first; a
queued drag shows no forecast, shift preview or focus, because the replay still owns the bars and fighters.
And `afterBeat` does not repaint while a card is held; it owes the repaint (`afterBeatDeferred`) and the
release pays it.

**A FIGHT IS DECIDED BY ITS CONDITION LIST, NOT BY `sideIsBeaten` (round 06, item 9).** Anything that
asks "is this fight over?" calls `honeycomb.combat.decidedOutcome`; `sideIsBeaten` is only what the
`allBeaten` entry reads. A turn loop asks at the TOP of each actor, since its `continue`s skip anything
asked at the bottom.

**PARTY ORDER: index 0 is the FRONT, and the front is drawn nearest the enemy.** The ally side is
`flex-direction: row-reverse`, so `partyArray[0]` stands rightmost. Enemies' front is their leftmost.
The DOM order always follows the state array; which way it reads is the stylesheet's business.

**TEAMS ARE NOT KINDS (round 04).** `side` is only the team. What a combatant IS (stats, art, tags,
moves, loadout hooks) comes from `honeycomb.entityDefinition` — `enemyIndex` or `characterIndex` —
never from `side`. Checking `side == "enemy"` to mean "is an enemy definition" is the bug to avoid.

**TARGET MODES ARE RELATIVE TO THE USER.** "enemy"/"allEnemies"/"frontEnemy" mean the user's
OPPONENTS; an enemy hitting the party's front uses `frontEnemy`. Resolution reads the source's team
(`honeycomb.userSide`); text is worded from the player's view (`teamWordArray`). A UI check for the
player's own card passes the acting entity's side to `targetModeSide(mode, side)`.

**THE BARS FOLLOW THE LOG, NOT THE STATE (round 04, item 16).** A replay handler that redraws a bar
must pass `updateVitals(entityId, delta)` what its entry did; reading the live entity shows the whole
turn's damage on the first hit. Anything that changes health, temporary health or lust silently (no log entry) leaves
the bar stale until the next repaint — log it (see `temporaryDecayed`).

**A FORECAST OR A PENDING QUESTION REPLACES honeycomb.state.** `resolveWithChoices` rolls the world
back when a question is pending, exactly as a forecast does. Re-read `honeycomb.state.run` after
either; a `run` held from before is an abandoned copy (test [52] tripped on this).

**The replay EDITS the shown hand; a repaint makes it final.** Hand motion (round 03) adds and removes
fan slots as log entries play, and ticks the pile numbers as cards land. A repaint redraws both from
state, so anything landing after one must do nothing: `handMotion.epoch` counts repaints and every
movement checks it. The replay waits for `motionRemaining()` before its closing repaint. Hand slots
glide on `translate` (FLIP) because the fan angle owns `transform` — same split as the fighters.

**The HELD forecast is `{play, combined}`, not a plain reading.** `forecast.aiming` holds it. A summary's
`healthAfter` is the EXACT dry-run outcome (what tests check); `certainAfter` / `potentialDamage` are the
honest split the bars draw, chosen by `tuning.forecast.randomTargets`. Chance is stamped in `logEvent`
from `context.chance`; random picks log a `randomPick` entry with every candidate.

**WHAT MOVED A READING IS ANSWERED FROM THE LOG, NOT FROM THE STATE.** `forecast.readLog` folds a
`causeArray` per fighter out of the dry run's entries, using `via` (the card or ability, stamped in
`logEvent`) and `damageType` (which is the only thing that names poison, thorns and the broken spiral,
since none of them come from a card). Anything new that should be nameable in a bar's tooltip needs one
of those two on its log entry.

**ENEMIES PASS OVER THE BROKEN, AND THE FORECAST MUST READ THE SAME POOL (round 06).** A target mode
flagged `passesOverBroken` resolves from `honeycomb.targetCandidateArray`; `markChance` builds its "might"
candidates from that same function. A new random or positional mode should do the same, or a random attack
will be forecast onto somebody it cannot hit.

**AN ENEMY IS DEFEATED BY BREAKING, BUT A LETHAL HIT IS STILL A KILL (round 06, item 10).** For a "defeated"
combatant `checkBreak` refuses at 0 health, because `0 >= 0` would otherwise turn every death into a break.
Both roads out of a fight go through `honeycomb.markDowned`, and its log entry's `cause` says which. Taking
lust and having the Broken STATE are separate questions now: never read `entityUsesLust` to mean "is a
player character".

**A PLAYER CHARACTER IS NEVER DOWNED.** `honeycomb.checkDeath` returns early for anyone who uses lust;
0 health means BROKEN, because `lust >= health + temporaryHealth` is already true at `0 >= 0`. Any
test or content that expects `downed` on a party member is wrong — use `broken`, or set the flag by
hand if what is really being tested is the ranking rule. `combat.sideIsBeaten` (not `sideIsDown`) is
what decides a fight, because a broken combatant is still standing and still takes turns.

**Allies are not copied into combat state.** `combat.enemyArray` holds real objects, but the ally side
resolves to `run.partyArray` directly (`honeycomb.entityArray`). Storing a second copy would survive
`JSON.stringify` as two independent objects, and after a reload damage would land on only one of them.
Health, block and statuses therefore persist between fights with no syncing step. The ally side must
resolve even with NO combat: until round 02 it returned nobody outside a fight, so every event effect
on "all allies" (campfire Sleep, Toll Bench, the Well) silently did nothing. Test [43].

**The battle log's history lives on the combat state and is written from `honeycomb.logEvent`.** That
is what keeps it honest: rewound choices and forecasts restore a snapshot, so their lines vanish with
them. Anything that changes state WITHOUT a log entry (a hook writing `block` directly, as the Iron
Sigil did) is invisible to the log — log it.

**Block is not cleared on turn 1.** It is already zero from setup, so a turn-1 wipe can only destroy
Block granted by an `onCombatStart` relic (Iron Sigil). Guarded by `combat.turnNumber > 1`.

**A CHOICE REWINDS THE WHOLE STATE, AND SO DOES A FORECAST.** `honeycomb.state` is REPLACED when an
effect stops to ask the player something (honeycomb-choices.js) and when anything is forecast
(honeycomb-forecast.js). Anything holding `honeycomb.state.run` or `.combat` across either boundary is
looking at an abandoned copy, and writes to it vanish. Hold IDs, not entities, and re-read afterwards.

This is the single easiest way to write a bug in this codebase. It has now cost two confusing test
failures — the second while writing the forecast tests themselves, where an enemy read before a
forecast was then set to 1 health and the write went into a copy that had already been thrown away.
`honeycomb.combatScene.repaint` refreshes the standing forecast BEFORE it reads `run`, for exactly
this reason.

**A forecast must never escape its sandbox.** It runs the real action — real hooks, real RNG draws,
real card movement — so anything that would let a consequence out has to be stopped. A save is the one
thing that could, and it is guarded at `honeycomb.save.write`. Anything else added later that writes
outside `honeycomb.state` needs the same check against `honeycomb.forecast.active`.

**Pools are rebuilt, never patched.** A member's cards, abilities and tags are all DERIVED from the
character plus outfit plus equipment plus progression, on every read. Editing a resolved list in place
is what produced the duplicated-Riposte bug. `honeycomb.memberCardModifierArray` is the one seam
everything hangs off: append to it and cards, abilities, tags and hooks all pick the change up.

**The ownerless-card fallback draws no randomness.** The hand's cost readout resolves a card's acting
entity while RENDERING. An RNG draw there would advance a stream a different number of times depending
on how often the screen repainted, which would break determinism in the least findable way possible.

## Lust and Broken

**RANK-UP STATES ARE READ, NEVER STORED (round 06, item 14).** Rank Up Notification and Event Ready come from
`profile.lustRankUpArray`'s records. To clear a state, remove records (`noticeTag`, `resolveRecord`); do not add
a flag. Seeing a weakness only clears it from the sheet's own row (tooltip key ending `/sheet`), so a weakness
shown anywhere else, such as item 16's party window, must use the plain key.

**A CARD MAY NAME ITS OWN BROKEN FORM, AND A STATUS MAY CANCEL THE SWAP (session 9).** Clemence's cards each
carry a `brokenCard`, so a character can have many broken cards, not one. Anything that asks "is this card
swapped?" must go through `honeycomb.brokenCardIndexFor`, which also honours `keepsCardsWhileBroken`
(Sanctified). The retired outfits live on only in `../tools/test-honeycomb.js` as fixtures: a test that needs an
outfit feature no shipped outfit uses should add a fixture there, not bring content back.

**THE LUST INSPECTION IS A QUESTION THE SCENE KEEPS, NOT AN ANSWER (round 06, item 12).** `combatScene.lustInspectRequest`
survives a repaint; `forecast.inspecting` does not (refreshStanding drops it) and `repaint` asks again before
it reads `run`, because the inspection is a forecast and replaces `honeycomb.state`. Its panels live INSIDE
the nameplate and are positioned by CSS alone: measuring the plate from JS read 0 whenever layout was not
ready. A tooltip kind with a side effect uses `onShow` / `onHide` (`tooltip.noteShown`), which also fire
when one panel replaces another.

**LUST IS NEVER A STATUS (round 06, item 11).** It is `entity.lust`, moved only by `lust` / `soothe`, so nothing
that applies, removes, vetoes or counts statuses reaches it. Do not add a "lust" status or make a status-clearing
effect read lust. A status that serves lust (Sensitive) stays a status and says `cardType: "lewd"`.

**SHIELDS ARE GONE (session 5), AND `block` IS NOT A WORD THIS CODEBASE USES ANY MORE.** Not renamed —
removed. `grep -rn "block" scripts/misc/honeycomb*` should turn up only the English word and
`hcUnplayable`'s neighbours. Two mechanics took the space: `temporaryHealth` and `lust`. If you find
yourself reaching for a second bar in front of the health bar, read `BROKEN-01.md` first — that
reading is the thing being moved away from.

**THE PLATE'S BROKEN LOOK FOLLOWS THE `broken` BEAT, NOT THE STATE.** `shownVitalsArray` carries `broken`
and the `broken` / `recovered` handlers pass it as an `updateVitals` delta. Reading `entity.broken`
straight from the live entity flipped the whole plate to the heart and "BROKEN!" on the FIRST bar redraw
of a replay whose final state was broken -- before the hit that did it had even played.

**RECOVERY FROM BROKEN ONLY HAPPENS AT A TURN START (round 05).** `checkRecovery` is still *asked*
everywhere health, temporary HP or lust moves — that is what keeps `entity.recoveryPending` honest, and
the plate reads it — but inside a fight it only *answers* when the caller passes `{atTurnStart: true}`.
Outside a fight it answers immediately, because there are no turns on the map and the per-move lust
bleed is deliberately allowed to un-break somebody. Anything new that heals mid-turn and expects
somebody to stand up is wrong; it buys the recovery, it is not the recovery.

**A WIPE THAT ERASES MUST CLIP WHAT IT CROSSES.** The break's exit is `.hcBrokenStage`'s own animated
`clip-path`, and the black band is a SIBLING riding the same edge — inside the stage it would be clipped
away with everything else. Both shapes come from `wipeSlantPercent` and `wipeBandPercent` and share one
easing; an angle for the band and a polygon for the clip drift apart the first time either moves.

**ART THAT IS CHARCOAL ON TRANSPARENT IS INVISIBLE AT FIGHTER SIZE.** The round 05 chains on a broken
fighter drew perfectly on the first try and could not be seen at all against a dark sprite on a dark
cavern. If a new overlay "isn't rendering", put an outline on it before assuming it is not there.

**THE BREAK CUT-IN HAS ITS OWN CLOCK (round 06).** `honeycomb.brokenOverlay.timeline()` plays it at
`paceMultiplier` (0.7) on top of the play speed, except the still tail of the hold (`holdRestFraction`),
which stays unpaced. The close timer, the replay's wait and every CSS variable read that one answer; a new
layer timed with a bare `honeycomb.duration` will drift out of step with the rest. Anything timed as a share
of the hold uses `--hcBrokenHoldPaced`, not `--hcBrokenHold`, which includes the unpaced tail.

**THE PER-RUN WEAKNESS CEILING IS A CLAMP, NOT A BLOCK.** `maximumRankGainPerRun` holds a tag's
exposure just below the next threshold once the run has taken its rank; the points are still recorded
and cross the moment the run ends. `profile.lustRankGainArray` is the counter and `runStart` clears it.
A bar that has stopped moving says so on the sheet and in its tooltip, because a silent stop reads as a
bug.

**THE BROKEN CARD SWAP HAPPENS AT `resolveCard`, NOT AT PLAY.** The instance keeps its own
`cardIndex`, so the card that lands in the discard pile is the real one and recovery restores the
whole hand at once; only the RESOLVED VIEW is the broken card, stamped with `brokenFrom`. It is gated
on being in a fight (`brokenSwapActive`), so the deck screen still shows a member's real deck.

**AN EXPLICIT `tagArray` MUST REACH THE MULTIPLIER, NOT ONLY THE LOG.** `gainLust` takes an origin
that may name the attack's tags outright (Severine's Night Court says her own cost counts as Charm).
Deriving them a second time inside the amount calculation, from a source and an entry that carry
none, silently dropped the between-run weakness for exactly those cases. `previewedLust` takes the
tag list as a parameter for this reason.

**THE IRON SIGIL GRANTS THROUGH `grantTemporaryHealth` NOW, SO RESOLVE HEARS IT.** Writing
`entity.temporaryHealth += n` directly skips the log, the cap, the hooks and the break check. There is
one door; use it. Brienne consequently opens every fight with a point or two of Resolve already in the
bar, which is correct and which two tests are written against.

**BROKEN IS STATE, NOT A BEAT.** The `broken` log handler adds `hcBrokenFighter` as the cut-in lands,
but a repaint rebuilds the fighter from scratch — so the class is ALSO derived from `entity.broken` in
the fighter builder. Anything else keyed to the state needs both halves too.

**LUST IS A FLAT PULSING PINK; THE BROKEN CATCH-UP GAP IS THE DITHER (round 06).** Noodle rejected any
candy-cane stripe. Lust reads against health because health is a plain red and lust PULSES; the gap
(health that lust has run past) is a pink/black checker, because a flat dark crimson read as ordinary
health once the broken tint darkened the frame too. The dither tile has a real-pixel floor, since a finer
one melts into a flat colour at fighter size.

## Layout, CSS and scaling

**THE TOOLTIP IS A CHILD OF THE OVERLAY HOST, WHOSE `> *` RULE TURNS POINTER EVENTS ON (session 11).** That
rule outranked `.hcTooltip { pointer-events: none }`, so every panel took clicks, and one left behind by a
redraw covered the rest's Upgrade button: a "complete lock-up". `#honeycombOverlayHost > .hcTooltip` holds it
off now. An overlay that redraws its own markup should `tooltip.hide()` first (the choice window does); a press
also clears any panel whose anchor is gone (`tooltip.anchor`).

**AN ANCHORED BOSS MAKES NO STACKING CONTEXT (session 11).** Her column has no z-index, transform or filter
in any state, so her sprite can sit behind the row while her plate and intent card sit above it. A new focus
or state rule that sets `transform`, `filter` or `z-index` on `.hcFighter` must not reach `.hcAnchor-back`
(the `#honeycombRoot` rules beside the depth focus block hold that line); give her sprite the look instead.

**EVERY LENGTH IS A HONEYCOMB PIXEL (session 6).** `calc(N * var(--hc-px))` in CSS,
`honeycomb.cssPixels(n)` when JS writes a style, `honeycomb.pixels(n)` when JS does arithmetic beside a
measured box. A raw `px` renders at twice its proportion on a phone — that is exactly how the phone
build came to look nothing like the desktop. Measured values (`getBoundingClientRect`, `clientX`) are
already real pixels; input thresholds stay real pixels on purpose. And never trust a claim that the
phone "just scales down": measure it with `../tools/audit-scale-parity.js`.

**THE HOST PAGE HANDS DOWN FIXED PIXELS.** Syrup Town's `html`/`body` set `line-height: 24px` and
`font-size: 16px`. The hosts restate both in honeycomb pixels, but any large text still needs its own
`line-height` — a 45px title in the inherited 24px box hangs out above it and is clipped by the first
scroller it sits at the top of (the event-title bug).

**`scrollbar-width` TURNS OFF THE SIZED SCROLLBARS.** Chrome ignores `::-webkit-scrollbar` on any
element that has `scrollbar-width` set, and draws its own fixed-pixel bar. It is set only inside
`@supports not selector(::-webkit-scrollbar)`.

**A FIGHTER PLATE IS REDRAWN BY `updateVitals`, AND IT MUST DRAW THE SAME PLATE.** Both it and the
fighter builder take `combatScene.plateVitalsOptions`. Passing different options once doubled every
status on every aim.

**Fighters move on `translate`, focus and targeting use `transform`.** Two CSS properties so the two
systems cannot overwrite each other — the same lesson as the hand's slot/card split. The preview and the
real move (FLIP in `playPartyShift`) both write `translate`.

**A flex container turns every inline span into a flex item.** Highlighting keywords inside the
flex-laid `.hcCardText` scrambled the text into columns ("lyPoison to ALL Weak…"). Anything with markup
inside a flex box needs one wrapping element. `.hcCardTextBody` is that wrapper.

**A FIGHTER IS ABOUT 151px (168 HONEYCOMB PIXELS) WIDE AT 1440x810, AND THAT IS THE PLATE'S CONSTRAINT.**
The round 06 plate is laid out in mockup units, so its fixed parts (medallion 140, tab 317) only fit a
fighter at `tuning.art.nameplate.unitPixels` ≈ 0.26. To INSPECT a plate, do not inflate the unit on the
live board (plates pile onto each other): render `honeycomb.ui.vitals(entity, combatScene.plateVitalsOptions(entity))`
into a fixed test div with its own `--hc-plate-u`. And at 800x450 emulation a unit of 0.468 reproduces
the real 1440x810 plate pixel for pixel in the pane's screenshot.

**EVERY CARD ON SCREEN HAS A SIZE, AND ITS INK IS IN CARD UNITS (round 06, item 7).** A new place that draws a
card passes `size: "small" | "medium" | "large"` or test [59] fails. Anything printed on a card is measured
in `--hc-card-u`, never `--hc-px`: a card's text follows the card's width, not the screen's. After changing
any card text, name, font or box, run `../tools/audit-card-fit.js` (desktop and 812x375) — it is the only thing that
sees every card at every size.

**AN INLINE Z-INDEX BEATS EVERY STYLESHEET RULE (round 06, item 8).** The hand fan wrote each slot's stacking
order inline, so `.hcHandSlot:hover { z-index }` silently never applied and the cards to the right covered
the one being read, for rounds. The fan writes `--hcFanZ` now. Anything JS positions that CSS must be able
to raise gets its value through a custom property.

**A `container-type` ELEMENT CANNOT READ ITS OWN CONTAINER UNITS.** `cqw` resolves against the nearest
ANCESTOR container, so `--hc-card-u` is declared on `.hcCardInk`, inside `.hcCard`, not on `.hcCard`
itself.

**TEXT SHADOW IS ONE TOKEN (session 7).** `--hc-text-shadow` is applied to every element through a
zero-weight `:where(#honeycombRoot, #honeycombOverlayHost) *` rule. A new rule wanting a glow writes
`text-shadow: var(--hc-text-shadow), <glow>`; dark text on a light chip joins the `text-shadow: none` list
beside the token. Do not set text-shadow on a host expecting it to inherit: it inherits as a finished
length, so an `em` there would be the host's size on every piece of text.

**TO INSPECT A CARD FACE, RENDER IT INTO `#honeycombOverlayHost` (round 06).** Every rule in honeycomb.css
is scoped under the root or the overlay host, so a test div on `document.body` draws an unstyled card.
The combat screen clips anything appended to the root. To see hover size, render a card at hand width
and `transform: scale(2)` it: the fonts are honeycomb pixels, not a share of the card, so a card that is
simply WIDER shows smaller text than the real hover does. (Superseded by item 7: card text is in card units now, so a wider card IS a bigger picture; `../tools/audit-card-fit.js` does this properly.)

**THE NAMEPLATE REFERENCE IS `mockup-7-health` (round 06).** `mockup-2-battleComplex` was the reference
for the round 05 plate, which it replaced; `mockup-2-battleImproved` was never a design reference (a
scale tool for round 04's figure and pile sizes). Two corrections Noodle made to mockup 7 itself, both
recorded in FEEDBACK-06 item 1: the broken bar's dark red and pink are SWAPPED in the drawing, and it
should also show missing health. `!designDocs/honeycomb/tools/nameplate-preview.html` draws every state.

**ANYTHING DRAWN ACROSS A FIGHTER IS HIDDEN BY THE NAMEPLATE.** The plate covers roughly the middle half
of a fighter's box, so the broken hearts (`fighterHeartArray`, which replaced the chains in round 06) are
mostly born above it. Anything else drawn on a fighter's chest has the same problem.

**Scene rebuilds keep scroll only for `data-hcScrollKey` panels.** Everything else starts at the top.
Key a panel by what it shows (tab + character), so a different view does not inherit a stale offset.

**Card frames are transparent-windowed overlays.** Art is drawn *behind* the frame and cropped by the
hole in it. Window rectangles are measured percentages in `tuning.art.cardFrame` — a new frame with a
different window is a tuning edit, not a CSS edit. Both shipped frames are 1992×2540; the horizontal
window is 3:2 in the upper half, the vertical is a tall window over most of the card.

**Layout owns position, not the renderer.** Map nodes and progression-tree nodes carry explicit
normalised 0..100 coordinates, and the renderer only draws them. A graph over a painting has its
positions dictated by the painting.

**An `<svg>` is a REPLACED element, so `inset: 0` does not stretch it.** A div with `inset: 0` fills
its parent; an SVG with a viewBox and no stated width and height takes the viewBox's own aspect ratio
instead. The aiming arrow was 1280x1280 inside a 1280x670 box, which compressed every y-coordinate it
drew at by half and bent its arc out of shape — with no error and nothing obviously wrong on screen.
State both dimensions.

**A tooltip outlives whatever it was pointing at.** A detached anchor measures as a zero rectangle at
the ORIGIN, so a panel placed beside it lands in the top-left corner of the screen, floating over the
game with nothing explaining it. Any repaint can do this. `honeycomb.tooltip.position` now refuses a
degenerate anchor, and the combat repaint takes any open tooltip down before destroying elements.

**An element that follows the pointer keeps entering and leaving itself.** A dragged card re-raises
its own tooltip several times a second and the panel then chases the drag around the screen. Hiding it
once only wins the first round; `honeycomb.tooltip.suppress(true)` holds it off for the whole drag.

**Never stretch an SVG to make a graph fit a picture.** `preserveAspectRatio="none"` does keep nodes
on their anchors, and it also turns every circle into an ellipse, because shapes inside an SVG are
scaled by the same transform the coordinates are. Match the viewBox aspect to the image and letterbox
both instead.

**Tuning properties must reach the overlay host too.** It is a SIBLING of the scene root, not a child,
so a CSS custom property written only to the root does not inherit into an overlay -- and the symptom
is an element collapsing to zero size with no error at all.

## Animation and art

**AN SVG COMMENT MAY NOT CONTAIN A DOUBLE HYPHEN.** It is invalid XML, and the file then draws NOTHING
with no error in the console -- the bar frame's first load. `honeycomb.image` keeps an explicit `.svg`
(every other path is forced to `.webp`).

**THE SLOW PLAY SPEEDS ARE THE DEBUGGING TOOL FOR ANIMATION.** `tuning.animation.playSpeedArray` runs
down to 0.1×, and everything is read through `honeycomb.duration`, so the whole game slows including
cut-ins. Three real bugs in the break cut-in survived a whole session at 1× and were obvious at 0.1×.
For frame-exact work, pause the overlay's animations and set `currentTime` on each
(`el.getAnimations()`), then clear the overlay's own close timer so it holds.

**AN EASING CAN MAKE AN ANIMATION LIE ABOUT ITS OWN DURATION.** `cubic-bezier(0.2, 0.8, 0.3, 1)` is
85% done a third of the way through. The tear read as "already open" not because its duration was wrong
but because its curve spent itself in the first 200ms. When something looks instant and the number says
otherwise, check the curve before the number.

**A MASK THAT GROWS FROM ZERO SHOWS NOTHING UNTIL IT IS WIDER THAN WHAT IT REVEALS.** The claw's growth
blobs start at `clawGrowStartFraction` of their end size rather than at 0, because a blob narrower than
the claw's own strokes paints no pixels at all — so "growing from nothing" was an empty screen followed
by a sudden tear.

**REDUCED MOTION IS A TUNING SWITCH, NOT A BARE MEDIA QUERY, FOR THE BREAK (round 06).** An Android phone
with "Remove animations" matched `prefers-reduced-motion`, and the old still version switched off the
stage's erase along with its shake, so the black wipe crossed a cut-in that never cleared. The rules now key
on `.hcBrokenReducedMotion`, which JS adds only when `tuning.brokenOverlay.honorReducedMotion` is true (it
is false). The other `prefers-reduced-motion` blocks in honeycomb.css are still bare media queries, so a phone
like that also loses those effects.

**CUT-INS OUTSIDE A FIGHT GO THROUGH `honeycomb.playCutInsFromLog`.** Inside combat every cut-in is a
beat of the log replay. Outside one there is no replay, and the overlays were simply never played — a
member who un-broke on the map did it in silence. That one walker covers the map's lust bleed and every
event choice, and plays queued rather than stacked.

**THE TWO PAINTED MASKS ARE USED INVERTED, AND THE COMPLEMENTS ARE DERIVED ASSETS.** A CSS mask reads
alpha; `brokenClawMask.webp` and `recoverBarMask.webp` are opaque OUTSIDE their shapes. Run
`generate-placeholder-art.py --only broken` after redrawing either, or the tear keeps its old shape.

**Every hover needs a touch path: TAP TO READ, TAP AGAIN TO ACT.** `honeycomb.input.tapToAct(key)` (kernel)
returns "act now?" — always yes for a mouse, no on a first touch tap. The pointer type comes from
capture listeners on honeycomb's own root and overlay host (never the document). A new clickable thing
that hover explains should gate its action through it; `ui.card`'s `onClick` already does. Tooltips
show on a tap and hide on a tap elsewhere by themselves (`data-hcTip`). Portrait gets a rotate note,
not a layout.

**Timing: never pass a raw millisecond value to `setTimeout` or a CSS duration.** Go through
`honeycomb.duration` (and `applyTuningToCss` for CSS vars), which folds in the player's play speed.

**A UI frame is the element's whole face, and switches on only once its file has loaded.** The
stylesheet's frame rules key on `data-hc-frame-<name>="ready"` attributes on the root and overlay host
(attributes, because scene changes rewrite the root's classes). A new element that needs a frame gets a
rule in the "UI FRAMES" block — and must not rely on its own background once framed.

**An entrance animation must never be the only thing making an element visible.** CSS animations do
not advance while `document.hidden`, and they hold at the 0% keyframe. An overlay whose first keyframe
was `opacity: 0` rendered completely invisible while still covering the screen and swallowing clicks —
a tab backgrounded when a fight ended came back to a dead screen. All entrance animations now animate

**transform only**. Frozen means "slightly offset", not "gone".

**Icons are runtime SVG, pictures are files.** Small symbolic things (statuses, resources, node types,
intents) are generated by `honeycomb.ui.glyph` as inline SVG — that is the right home for a shape that
will become a drawn icon later. Anything picture-shaped is a real `.webp`. Dropping a real file into
the matching path makes the runtime prefer it automatically, with no code change.
`honeycomb.ui.missingPathArray` memoises misses so a repaint does not re-request every undrawn icon.

**Glyphs with open paths must be stroked.** `spiral` and `campfire` carry `stroke: true`; filling them
produces an unreadable blob.

**Full-bleed art fails silently, icons fail loudly.** `imageTag(path, {silentFallback: true})` hides a
missing backdrop and lets the CSS gradient show; without it a missing full-screen image draws a
labelled placeholder the size of the screen.

## Tooling and editing

**A file that fails to parse loads as nothing.** The symptom appears far from the cause — an
"undefined is not an object" inside some unrelated screen. A scripted find-and-replace touching quoted
strings caused this once. Run `sh !designDocs/honeycomb/tools/check-syntax.sh` after any edit batch.

**Prefer the Edit tool over scripted replacement for anything containing quotes.** Two bugs so far
came from escaping getting mangled on the way through a shell heredoc into Python into JavaScript.

**Browser caching will waste your time.** `.claude/devserver.py` serves with no-cache headers;
`.claude/launch.json` points at it. Plain `python -m http.server` lets Chrome heuristically cache
edited `.js` files, and the symptom is a code change appearing to have no effect. If port 8000 is
already held by an outside python server, open `http://localhost:8000/index.html` with `preview_start
{url}` and `fetch(file, {cache: "reload"})` every edited script and image before reloading.

---

