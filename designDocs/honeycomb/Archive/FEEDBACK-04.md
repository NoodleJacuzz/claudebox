# Honeycomb — Feedback round 04 (2026-09-11, after session 4)

Noodle's notes after playing the round-03 build. **Quotes are verbatim. Do not summarise this file;
add to it.** Annotations under each quote are the interpretation and what was done — if an annotation
and a quote ever disagree, the quote wins.

Status key: ☐ not started · ◐ in progress / partly done · ☑ done

## Status board (update as items land)

| Done | Items |
|---|---|
| ☑ | 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 (false alarm; the export stays) |
| ☑ | 18, 19, 20, 21, 23, 24, 25, 26 |
| ◐ | 7 (built; needs a real phone) · 22 (the lingering telegraph is fixed; one detail would settle the rest) · 27 (both candidates made harmless; which message is it?) |

Tests: **650 headless** (sections [50]–[55] are this round). As of session 6 the suite is **809**;
sections [56] and [57] came after.

---

### 1. Enemies play the same cards; teams, not hardcoded sides ☑

> We likely need to rework how enemy cards work. It should be that fundamentally enemies are using the
> same kind of card that players are, just targeting the opposing team. To test this, an enemy should be
> summonable to the player's side of the field and appropriately attack enemies, and a player character
> like Severine should be summonable to the enemy side and attack the players. Allies and enemies should not
> be hardcoded, they should be dependent on the team the character is on. I bring this up because I see
> the enemies ingame refer to the targets of their cards as "allies" when they mean they're doing damage
> to the player's party.

Plan, in stages (each lands with the tests green):
- ☑ **Stage 1 — card types** (item 2 below).
- ☑ **Stage 2 — targets relative to the user's team.** `entity.side` is now documented as the TEAM
  ("ally" = the player's). Target modes carry a `relation` (opponent / teammate / self / both) and
  resolve from the acting entity's team (`honeycomb.userSide`, `sideForRelation`, `frontOf`/`backOf`
  in entities.js). "enemy" means the user's opponents, so an enemy's attack on the party's front is
  `frontEnemy`. Enemy content flipped (frontAlly→frontEnemy etc.). Target TEXT is worded from the
  player's view by the user's team (`honeycomb.teamWordArray`): the party's cards say "ALL enemies";
  an enemy's card aimed at the party says "a random party member" — the fix for "allies" on enemy
  cards. Badges, legal-target marks and drag focus use the acting entity's team.
- ☑ **Stage 3 — enemy moves are real cards; anyone can be AI-controlled.**
  - The 18 enemy moves are entries of `honeycomb.cardArray` (`honeycomb.enemyCardArray` in
    content-enemies.js): `enemyIndex`, `rarity: "enemy"` (no reward/shop/discovery offers them),
    `costArray: {}`. Named `<enemy><Move>` (`sporelingSpit`). Types derived like any card: Spores is
    Negative. `intentTypeArray` is gone; how a move looks is its card type's defaults.
  - Enemy definitions: `moveArray: [{card, weight, maximumInARow, condition}]`, `moveStrategy`,
    `phaseArray: [{atOrBelow, moveArray}]`. A CHARACTER under AI control uses its own card pool
    (`honeycomb.aiMoveArray`, weight = copies × `tuning.ai.weightPerCardCopy`).
  - `honeycomb.isAiControlled` (enemy team, or not a character on the party's team; `controller`
    overrides), `entityDefinition` / `entityName` / `entityKey`, `selectMove`, `moveCard` (the card as
    its user plays it: `userSide`, owner, `{}` cost, sprite art for enemy moves), `aiPickTarget`
    (`aiTargetRuleArray`: opponents → their front; teammates → most hurt).
  - Turn flow: `telegraphIntents` covers AI combatants on BOTH teams; party-side AI allies play at the
    end of the player's turn (`combat.playAiMoves`); the enemy turn uses the same `combat.playMove`.
    Log entry `enemyAction` → `moveUsed {sourceId, card}`; `intent` entries carry `card`.
  - Art, tags, loadout hooks, the move list screen, tooltips and battle-log names go by what a
    combatant IS; team only decides side and colour.
  - Save format 3: `migrationArray` maps old intents to cards (`spit` → `sporelingSpit`) and the
    seen-moves ledger with them.
- ☑ **Stage 4 — cross-team summons.** `honeycomb.summonCombatant(spec, context)` (entities.js) brings
  any enemy or character in on either team; new effect **`summon`** (`enemy` | `character`, `team:
  "own" | "opposing"`, `count`, `healthFraction`, `controller`). `summonEnemy` now joins the
  SUMMONER's team (a party-side Matriarch's Brood would call Sporelings to the party). Party-side
  summons are temporary. Test [51]: a Sporeling for the party spits at the enemies at turn end; Severine
  for the enemies plays her own Rake at the party's front; old saves migrate.
- Note: the party counts as standing while a summoned ally stands; the turn limit prevents a stall.
- **Try it:** Debug Tools now has **Summon an enemy to the party's side** and **Summon a party
  character to the enemy side**, each with a picker (defaults: Sporeling, Severine). Mid-fight only.
- **Browser check (done):** in the scene layout a party-side Sporeling spat 7 at the Cap Brute at turn
  end; enemy-side Severine telegraphed and played her Drain on Brienne; move text reads "Deal 7 damage to
  the enemy in front." / "...to the party member in front."; Drain's two-type frame shows. It caught
  one bug: `cardOwnerMember` only searched the party, so enemy-side Severine's Drain healed **Brienne**
  (the ownerless-card fallback) and the forecast showed 81 → 61 instead of 57. Now searches both
  teams; test [51] covers it. Art is not mirrored for a team switch -- by design, every fighter faces
  the viewer.

### 2. Card types: damage, support, negative, passive — and more than one ☑

> The line between offense and support cards is too vague. One enemy used a skill that applied weak to
> one of the party members, and the card was an offense type. Maybe buffing abilities and negative
> effects need to be separated from sharing the same "support" card type? Maybe cards should be able to
> have multiple types? Between damage, support, negative, and passive, that would cover all of our
> bases, right? We could do gradient card frames to show a card is of multiple types.

- **Answer to "all our bases?":** yes for what a card DOES. Status and Curse stay alongside as what a
  card IS (junk put in the deck by someone else). Card manipulation (draw, energy, discount, return)
  counts as Support; an enemy slipping cards into your deck counts as Negative.
- **Types: Damage / Negative / Support / Passive** (+ Status, Curse). Offense→Damage, Power→Passive
  (old names still resolve via `cardTypeAliasArray`).
- **Judgment call, flagged: types are DERIVED from effects** (`honeycomb.cardTypeRuleArray`), the way
  card text is, relative to the card's user: damage/debuff on the other team → Damage/Negative; Shield,
  healing, buffs, draw, energy → Support. A cost is no type (Blood Pact's self-damage). `typeArray`
  overrides; `type` now only declares Passive/Status/Curse. Effect: Wither, Miasma and Plague became
  **Negative** (were Support); Drain is Damage+Support; Nightfall is all three.
- Multi-type: primary = first (defaults: pose, party shift, after-play). Frame = one tinted copy per
  type, each masked to its share of a diagonal gradient; the strip prints every type.
  `partyShiftByCardType` keys read through the renames (Nettle: `damage: "back"`).
- Deck-screen type chips, choice `cardType` filters and the `cardType` condition accept any of a card's
  types. Tests [33], [47] updated.
- ☑ Enemy moves are real cards now (item 1), so Spores prints as Negative.

### 3. What limits shop removal? ☑

> What limits what sort of cards can be removed in the shop? It doesn't appear to use the same code as
> removing a card in a rest area.

- **Answer:** it didn't use the same code. The shop used an older `cardPicker` overlay whose
  `"removable"` filter hid every **starter** card (Strikes, Raise Shield, Wither, Drain, Rake, Crimson
  Arc) — the cards most worth removing. The campfire used the choice system and allowed anything.
- **Now one definition:** `honeycomb.deckServiceArray` (content-map.js) holds `removeCard` and
  `upgradeCard`; the new `deckService` effect runs one, optionally rewording its question. The campfire
  and the shop both use it, so they can no longer disagree. The shop charges only once a card has
  actually gone. The old picker is deleted (the shop was its only user). Test [50].

### 4. Cards look playable after the last energy is spent ☑

> After spending the last energy point, there's a moment where it still seems like I can play cards even
> though I can't.

- Energy is spent before a play's replay starts, but the hand kept its old look until the replay's
  closing repaint. `combatScene.refreshHandPlayability` now updates the energy orb and every shown
  card's affordable/blocked look the moment a card or ability resolves.

### 5. Vulnerable and poison ☑

> It seems like vulnerability stacks with poison. Was this intentional?

- **Not intentional.** Poison was deliberately kept out of Strength's reach, but Vulnerable's hook
  never looked at the damage type, so poison ticks took ×1.5. Vulnerable now has
  `unaffectedDamageTypeArray: ["poison"]`; both descriptions say so. Test [50].

### 6. Campfire upgrades preview the upgraded card ☑

> Campfire upgrades should show a preview of the upgraded version.

- An upgrade question (`previewUpgrade`, on by default wherever `upgradeableOnly` is) no longer
  commits on the first click: it shows the card **Now → Upgraded** side by side, with Back and
  Upgrade. Applies to the shop's and any event's upgrades too, since they share the service.
  Verified in the browser (Sword Strike 6 → Sword Strike+ 9).

### 7. Mobile landscape is too cramped ☐

> The game's unplayably cramped on mobile landscape, I added a screenshot to the mockups folder. I think
> we may need to enter some kind of fullscreen mode or something because there's just not enough room to
> work with.

- Screenshot: `v13 spire images/mockups/mobileScreenshot.png` (Android Chrome, landscape; the browser's
  status and address bars take ~120 of ~540 px; jumbo layout; heads cropped out of the windows).
- **Fullscreen:** `honeycomb.platform.fullscreenAvailable / isFullscreen / toggleFullscreen` (the
  platform adapter, since it is browser-specific); a four-corner button in the top bar beside Menu
  and a "Fullscreen" / "Leave Fullscreen" entry in the menu, both only where the browser offers it
  (the Cordova build is already full-screen and shows neither). On Android Chrome this removes the
  address and status bars, which is the fifth of the height the screenshot lost.
- **Short screens:** one `@media (max-height: 480px)` block trims the fixed minimums (top bar,
  nameplate padding, overlay padding) — everything else is in vmin and shrinks on its own. The
  screenshot was of the JUMBO layout (windows cropping heads); the scene layout, now default, has no
  windows and its figures stand whole.
- Not tested on a phone here — the browser pane can only emulate the size, not the bars. Please try
  the scene layout with the fullscreen button; the numbers to tune if it is still tight are the
  scene layout's (`fighterFrameHeightPercent`, `handCardHeightVmin`, `shelfEndSizeVmin`).

### 8. Small tweaks remaining for layout ☑

> I like the layout. This is a good opportunity to begin the nameplate and ability overhauls that were
> blocked by the combat UI redesign.

UPDATED: I'd like the sizes to be closer to those in mockup-2-battleImproved, as well as the hand area to use the new hand UI elements I created. After that, FEEDBACK-02 items **27** (nameplates) and **28** are unblocked.

- ☑ The sizes and the hand UI: items **11** and **10** below.
- ☑ **Stage 8a — a mechanic each, and abilities that ask for something** (engine + tests; FEEDBACK-02
  items 27 and 28, headless half). Detail below; the nameplate and ability SCREENS are stage 8b.
- ☑ **Stage 8b — the nameplate and ability UI.** Detail below the mechanics table.

#### Stage 8a: the three mechanics, and ability requirements

**One mechanic each, and the three are the three widget kinds 27 asks for** (`honeycomb.mechanicArray`,
in content-characters.js). A mechanic is either COUNTED (a number in `member.meterArray`, moved by its
own `hooks`, which fire exactly where a status's do) or TESTED (nothing stored; each orb's `test` is
asked when it is drawn, so a light can never disagree with the board).

| Character | Mechanic | Widget | What moves it | What it gates |
|---|---|---|---|---|
| Brienne | **Resolve** 0–10 | bar | +1 per 4 Shield gained, +2 per blow that lands | **Shield Wall** needs 6 and spends 6 |
| Severine | **Thirst** | three orbs | lit live: dealt damage this turn / below half health / an enemy below half | **Siphon** needs all three lit |
| Nettle | **Harvest** 0–5 | orb + count | +1 per enemy downed, +1 per card burned away | **Graveward** needs 2 Souls and spends 2 |

- **Judgment call, flagged:** each mechanic GATES that character's signature ability rather than being
  a readout, so the widget is something to act on. The numbers are first guesses and every one of them
  is a named field (`shieldPerPoint`, `pointsPerHit`, `maximum`, the requirement amounts) — say the
  word and they move.
- Counted meters are per fight (`resetOn: "combatStart"`); absent reads as zero, so no save migration.
- New plumbing, each general rather than for one mechanic: `onBlockGained` fires where Shield lands;
  `onCardExhausted` fires from `combat.noteExhaust`, which every route into the exhaust pile now goes
  through (three sites used to log it separately, so anything counting burned cards would have caught
  one of three); `entity.damageDealtThisTurn` is kept by `dealDamage` and cleared at each side's turn
  start.

**Abilities ask for things** (item 28's "robust system of placing conditions required to use them").
`requirementArray: [{condition, text}]` on an ability — each entry one thing that must be true, in the
same condition language cards and events already use, so a requirement can ask about a mechanic, a
status, a relic, a rank or the party with no ability code. Reported ONE BY ONE
(`abilities.requirementStateArray` → `{text, met}`) rather than as a single yes/no, so the plate can
show which one is missing instead of "Not right now". `spendArray: [{mechanic, amount}]` is what using
it takes out of the meter. New conditions: `mechanicAtLeast`, `mechanicOrbsLit`. Requirements are
checked before the spend, so an ability that both needs and spends Resolve says "Needs 6 Resolve."
- Statuses persisting between battles and events (28's other half) landed with item 13: a status given
  outside a fight is `carried` into the next one.
- Test [53]. Tests: **616**.

#### Stage 8b: the nameplate, and abilities on it

**One plate per fighter** (`combatScene.renderNameplate`), holding everything about them in this order:
name bar · statuses · Shield badge + health bar · that character's mechanic widget · their abilities.
What the glow-up is made of:
- A **name bar** across the top, tinted with the character's own `colorHint` (as a layer, not
  `color-mix` — a Cordova webview may not have it), so the name sits IN the plate rather than floating
  over it. That is "make the names fit-in more"; long names still ellipsis rather than pushing the bar.
- A raised plate: bevel, inner shadow, drop shadow, instead of a flat translucent box.
- The **health bar** is round-ended and sunken (inset shadow) with a slow travelling **sheen** — item
  27's "having some kind of life or animation to the UI", on the thing that is always on screen.
- The **Shield badge LEADS the row** instead of floating over the bar's left end, as
  mockup-2-battleImproved has it: what stands in the way is read before the health behind it.
- The forecast keeps the numbers it already had ("40 → 21", "4→0" on the badge) and the breathing
  pending segments. The candy-stripe was already gone in round 03.

**The mechanic widgets** (`ui.mechanicWidgetArray`) are one builder per kind — bar, orbs, orb — so a
fourth shape later is one entry plus a `kind`, and nothing about the plate changes. Each takes its
colour from the mechanic. A widget that moves pulses (`mechanic` log entry → `refreshMechanic`); the
TESTED kind has no log entry of its own, so any hit refreshes every one of them (`refreshMechanics`).

**Abilities are chips on the plate.** The launcher under the feet, the sub-menu and the open-a-list
flow are gone (`renderAbilityLauncher` / `renderAbilityMenu` / `abilityMenuMemberId`, and with them the
`launcherOnFloor` flag and `abilityLauncherBottomPercent`). Every ability is a button on its owner's
nameplate, always visible: one press fires it or starts aiming it.
- **A usable chip GLOWS** (a slow breathing gold, per ability rather than one button for all of them),
  a spent one fades, an unusable one dims — 28's "the button which opens them would glow when an
  ability is ready".
- Hovering one names it, prints its text, and lists **every requirement ticked or crossed** (✓ green /
  ✕ red), its spend, and its recharge. Pressing a blocked one flashes the missing requirement itself
  ("Needs 6 Resolve.") rather than "Not right now".
- The chips hang just UNDER the plate rather than inside it: the plate is bottom-anchored by the
  layout's `vitalsBottomPercent`, so a fifth row grew upward over the character's face.

**Browser check (1280×720, scene layout):** Severine's plate shows two of three Thirst orbs lit with her
`4→0` Shield badge and `20 → 17` forecast; Siphon's chip is dim and its panel reads "✕ Needs all three
Thirst orbs lit."; Brienne's and Nettle's chips glow. Pressing Brace took her Shield 4 → 14 and her
Resolve 7 → 9 (10 Shield ÷ 4 a point), the bar moving and pulsing. Clicking Nettle's Blight chip entered
aiming: both enemies lit, the party dimmed, the chip held lit.
- **Judgment call, flagged:** ability icons are still the generated fallback glyph — dropping real art
  at each ability's `iconPath` (`abilities/brienne-brace` …) is picked up with no code change, and
  that is the one thing that would most improve how the chips read.

---

## Second batch (noted while the usage limit reset)

> Once the limit resets, some small things to note I did/noticed while waiting:

### 9. Split iconsUnsorted.png into 1024×1024 icons, then webp ☑

> I put a png file into the v13 spire images folder named iconsUnsorted.png, please separate all of
> those icons into 1024x1024 images (that's the best size for me to polish and generate at, and I can
> downsize afterwards) and then make webp versions for you to use across the game.

- 49 icons found by alpha (a script: dilate, label, split side-by-side pairs at the thinnest column),
  each centred on a square with an 8% margin and upscaled to **1024** →
  `v13 spire images/_source/icons/<name>.png`. The **256px webp** of each → `v13 spire images/icons/`.
  Names describe the picture (`arm-flexing`, `shield-broken-red`, `flame-blue`…);
  `_source/icons/README.md` lists them and where each is used.
- Wired in (one `iconPath` field each, easy to swap): statuses (Strength → arm-flexing, Poison →
  drop-green, Regeneration → heart-glow-pink, Vulnerable → shield-broken-red, Thorns →
  shield-lightning-purple, Energised → lightning, Focus → target-rings; **guesses, flagged:** Weak →
  swirl-purple, Frail → snowflake, Artifact → sparkles-pink), resources (coins / key / sun /
  flame-blue), map nodes (swords-crossed / skull / skull-horned / question-mark / chest / campfire /
  bag), card types (sword-red / swirl-purple / heart-crowned / starburst-yellow / question-mark /
  book-skull-purple). 24 icons are not used yet (potions, gems, books, mushroom, tree, wings…).

### 10. New hand-area art (ui/hand) ☑

> I made the ui/hand folder with some elements to replace the hand area with to make it look fancier,
> including front elements on the right and left hand side, and a shelf that'd go behind them for the
> cards to float over.

- Built as a battle-layout flag, `handShelf` (on for **scene**), so the other layouts keep the plain
  bar. `shelfBack` lies along the foot of the screen behind the fan; `shelfFrontLeft` (the flame
  diamond) stands in the left corner with the energy count written over the flame, as the mockup
  shows; `shelfFrontRightEmpty` in the right corner with "End Turn" written on its plaque. The end
  pieces are drawn in a square `shelfEndSizeVmin` tall; where the diamond and the plaque sit inside
  that square was measured off the paintings into `tuning.art.handShelf`, so the number and the label
  land on them at any size.
- **Judgment call:** the EMPTY plaque plus live text rather than the painted "End Turn", so the button
  keeps its hover/disabled states and any later wording; swap `rightPath` to `shelfFrontRight` and
  blank the label to use the painted one. The left piece uses the flame version because the mockup
  puts the number over the flame.
- On the shelf the order is diamond → Log / speed / layout buttons → draw pile, then the fan, then the
  discard → plaque, as the mockup has it.

### 11. mockup-2-battleImproved: final sizes and pile placement ☑

> I made a rough new mockup titled mockup-2-battleImproved with what I think are the best overall
> player/enemy sizes as well as deck and discard pile locations and sizes for our final layout

- Scene layout numbers moved towards it: figures shorter (`fighterFrameHeightPercent` 82 → 70) on a
  lower floor (`floorVmin` 9 → 5) so the nameplates sit just above the shelf; hand cards smaller
  (`handCardHeightVmin` 24 → 21); the enemy's next card beside the enemy at thigh height
  (`intentCardTopPercent` 38, `intentCardLeftPercent` −34) instead of over its head. The piles keep
  their deck drawings, at the corners of the shelf beside the end pieces. All in
  `tuning.battleLayout.layoutArray[scene]` — every number is one field.
- Not taken from the mockup: the nameplate's own design (name plate over a bar with the Shield badge
  at its left) — that is item 27, next.

### 12. Shop backdrop; backdrops of any size without visible edges ☑

> I made the shops/backdrop-default.webp image for the shop, if you could work it out so that it fits
> nicely without stretching, using a dark vignette to hide the areas where there would be no background
> image, I would appreciate it. I would like for events to be able to use my usual sizes of 832x1216,
> 896x1152, and 1024x1024 (and double those exact resolutions) without the player being able to notice
> that the background isn't filled out.

- One component, `honeycomb.ui.backdrop(path)` (ui.js), used by the shop and every full-bleed event:
  the painting **contained** (whole, unstretched, centred) over a **blurred, darkened copy of itself
  scaled to cover**, under the existing vignette. Whatever the painting does not cover is filled by
  its own colours falling off into the dark, so a portrait painting on a wide screen has no bars and
  no seam — any of the sizes above (or their doubles) works with no per-image work. The shop previously
  stretched its art to the screen (`width:100%;height:100%` with no object-fit).
- Browser check: the shop at 800×764 and at 1280×720 shows the painting whole with its blurred self
  filling above/below or beside it; no stretching. (No event has a painted backdrop yet to try a
  portrait one on; the same component will draw it.)

### 13. Event options must preview what they do ☑

> Event "The Spore Garden" lists harvest carefully as adding 2 Field tonic to the deck, with no preview
> of the card to be added before clicking it. Event "The Toll Bench" changes ally HP without showing
> preview of HP changes and no preview of Dread. There should probably be some automatic factor in
> making sure these events display the correct UI, otherwise stragglers could get forgotten again.

- **Why it happened:** the cards-and-relics display built in round 03 only ran AFTER a choice (the
  aftermath). Before clicking, a choice showed its sentence and the party's health row only. The Toll
  Bench's health preview did work when the party was hurt; at full health a heal moves nobody and the
  row is empty — and its Regeneration was never shown at all.
- **Now, before clicking:** every choice is dry-run (`honeycomb.forecast.forEventChoice`) and shows,
  drawn: the party row with health **and the statuses it would give** (chips), and the cards / relics it
  would add, remove or upgrade, as themselves (`hcEventGainsPreview`). A chance pick keeps its secret —
  the Cardsharp's random removal is a face-down "A random card"; a random relic is faceless (`random:
  true` on the log entry).
- **The automatic factor:** `forEventChoice` snapshots the world before and after the dry run and
  returns `unexplainedArray` — every change (health, statuses, deck, relics, resources) that no log
  entry accounts for, i.e. that a preview built from the log could not show. Test [52] runs **every
  choice of every event** and fails on any entry; a debug build also warns in the console when such a
  choice is rendered. Writing an effect that changes the world without logging it now fails the suite.
- **Found by it:** the Toll Bench's Regeneration was applied outside a fight and then WIPED as the next
  fight began (`persistsBetweenCombats: false`), so the paid choice never delivered it. A status given
  outside combat is now `carried`: it survives the start of the next fight and ends with it. (This is
  the seed of item 28's "statuses persisting between battles and events".)
- Browser check: the Toll Bench shows 40→65 / 30→55 / 26→51 with a Regeneration 3 chip under each,
  and Dread as a card under "Sit without paying"; the Spore Garden shows both Field Tonics and, under
  "Burn", the Gilded Ledger beside the 5-damage row.

### 14. Dread can be removed despite its text ☑

> The card Dread can be removed by normal means despite directly saying otherwise

- `unremovable: true` on the card; `honeycomb.cardIsRemovable`. "Ordinary means" = the campfire's and
  the shop's removal service (`removableOnly` on its card question, so Dread is not even offered) and
  a random removal (the Cardsharp's trade skips it). An effect naming the card outright
  (`removeCardFromDeck card: "curseDread"`) still takes it, which is what a future cleansing event would
  use. **Judgment call:** random removal counts as ordinary. Test [52].

### 15. Enemy scale and manual XY placement ☑

> It's important we add the ability to scale enemies and set manual XY positions for them for eventual
> intense boss encounters.

- Two places to say it, one result: an enemy definition's `presentation: { scale, offsetXPercent,
  offsetYPercent }` (how it always stands), and an encounter's `placementArray` (one entry per slot,
  laid over the definition's, so one fight can pose a boss differently). Merged by
  `honeycomb.combat.placementFor` onto `enemy.placement`, saved with the fight. Fields listed in
  `tuning.layout.placementFieldArray`.
- Drawn as CSS custom properties on the sprite's wrap: scaled from the feet, offsets as percentages of
  the sprite's own box (positive right / down). Layout is untouched, so a looming boss overlaps its
  neighbours rather than pushing them.
- The Matriarch now stands at `scale: 1.18` as the first use. Test [52]. Browser check: she draws a
  fifth taller than the sporeling art she still borrows, feet on the same floor.

### 16. Multi-hit damage shown all at once ☑

> I got hit by the matriarch by her double-hitting ability, and on the first hit Brienne's health went
> down to 56, but on the second it didn't lower, and on the next attack that hit brienne it didn't lower
> either. Or so it seemed, but on further testing I realized the damage was all dealt instantly at once
> instead of as the damage was visibly being dealt. This was very confusing.

- **Cause:** combat state is final before the first frame of a replay (by design), and the bar was
  redrawn from the LIVE entity on each hit — so the first hit showed the whole loss and the rest
  showed nothing.
- **Fix:** the bars follow the log. `combatScene.shownVitalsArray` keeps each fighter's SHOWN health
  and Shield; each damage / heal / block entry moves them by exactly its own amount as it plays;
  every repaint sets them back to the truth. Shield wearing off at a turn's start is now a log entry
  too (`blockExpired`), so the badge goes when it should rather than at the next repaint.
- Browser check: Claw Flurry (3×3) on the Matriarch read 130 → 127 → 124 → 121 on her bar, one step
  per hit, sampled every 80 ms during the replay.

### 17. No way to export a bugged state (early death bug again, Firefox) ☑

> I am playing in firefox right now on a server run by VSC where the early death bug has triggered
> again. I have no way to export or save any relevant data so I just have to stop testing here or else
> lose the bug.

**Noodle, after testing:** "False alarm, user error mistaking the Dread card for being dead."

- So there is no early-death bug to chase. The export was built anyway and stays, since the next
  genuine one will need it: **Copy / Load Save**, on the title screen and in the system menu (every
  build, not only debug). A box holding the whole save as text, wrapped as a bug report with the time,
  the browser, the screen and the last errors the page threw (`honeycomb.recentErrorArray`, captured
  from `window.onerror`); a Copy button (clipboard, with a select-and-copy fallback); and a second box
  that loads a pasted save or report back (`honeycomb.save.toReportText` / `fromText`). Test [52]
  round-trips a report through a fresh engine. Verified in the browser from a cold boot.

---

## Third batch (found while testing the round-04 build)

> Unsorted feedback added while testing, add to the above list after list is complete

Sorted into the numbering here; the quotes are untouched.

### 18. Intent card text is tiny once played ☑

> I made a number of changes to the CSS and the tuning document and finally got the fighters and hand
> shelf slots sized just the way I want them, but now card text on enemy intent cards is really small
> when they're played.

- **Cause:** the enlarged card was sized purely as a fraction of the BATTLEFIELD's height
  (`enemyCardHeightFraction`), so giving height to the hand shelf and shrinking the figures shrank the
  one thing whose whole job is to be read.
- Now it is sized against the SCREEN as well: never smaller than `enemyCardMinimumHeightVmin` (46) nor
  taller than `enemyCardMaximumHeightVmin` (76) of the shorter side, with the old fraction still
  applying in between. At 1280×720 that is a 331px card instead of 323 — and on your shorter
  battlefield it no longer follows it down. Browser-checked: "SLAM — Deal 11 damage to the party
  member in front." reads at a glance.

### 19. Enemy scale at five enemies; the boss must not shrink ☑

> The scale of enemies at 5x enemies looks really silly at that height, but what's more concerning is
> that the boss becomes so small it's comical. The boss should occupy a non-shrinking position behind
> her minions.

- **Cause:** a side is a flex row and every fighter takes a share of its width, so a fifth enemy made
  all five thinner — and the art is bounded by its column, so thinner means smaller. The boss was just
  another column.
- **A crowded side now OVERLAPS instead of thinning.** Past `tuning.layout.crowdedSideCount` (4) the
  row pulls together (`crowdedGapVmin`, negative) and every fighter keeps a floor on its width
  (`crowdedFighterMinimumPercent`), which is how a crowd is drawn rather than a row of stamps.
- **A boss holds her own place behind the row.** `anchor: "back"` on a placement (the same placement
  system item 15 added, so an encounter can say it too) takes a combatant out of the flow entirely:
  centred on their side, on the same floor, sized off the battlefield's HEIGHT
  (`anchoredWidthPercent`, `anchoredSpriteHeightPercent`) rather than a share of its width. Minions
  arriving cannot shrink her, and they stack in front of her so they read as her guard. The Matriarch
  is `{ scale: 1.18, anchor: "back" }`.
- Browser-checked with the Matriarch plus four summoned Sporelings: she stands full height behind them
  with her plate above theirs; the four overlap instead of becoming slivers.

### 20. Make "Scene" the default style ☑

> Please make "Scene" the default style now.

- `tuning.battleLayout.defaultLayout` was already `"scene"`, so a fresh profile got it — but the debug
  **Layout** button saves its choice on the profile, and that saved choice outranked the default
  forever after. Now the remembered choice is honoured **only in a debug build**: Scene is what the
  game is, the button still works for exploring, and a tester who taps it cannot permanently change
  their game (a release build has no button to put it back with).

### 21. No way to restore sound inside Honeycomb ☑

> Sound is disabled for most playtesters due to autoplay rules, and while there is a sound button on
> the title screen of Syrup Town to restore it, there isn't a way to do that in honeycomb.

- **Music: On/Off** and **Sound: On/Off** on the Honeycomb title screen AND in the system menu, so they
  are reachable mid-fight as well as at a boot.
- They go through the platform adapter (`platform.soundEnabled / musicEnabled / setSoundEnabled /
  setMusicEnabled`), which reads and writes **the host's own** `soundDisabled` / `musicDisabled` and
  calls its `pauseAll` / `unpauseAll` — rather than keeping a second copy that could disagree with
  Syrup Town's own buttons. Syrup Town's toggles live on title and menu images that Honeycomb hides
  while it runs, which is why there was no way in. All four degrade to no-ops standalone.
- Pressing one is itself the user gesture an autoplay policy waits for, so turning music on from here
  actually starts it. Browser-checked: the title reads "Music: Off / Sound: On" and the host's
  `musicDisabled` follows.

### 22. A dead enemy's card lands in the player's discard pile ◐

> It feels weird that enemies deposit their card into my discard pile when they die

- **Checked first: nothing is actually added.** Downing an enemy headlessly leaves the discard pile,
  the exhaust pile and the run deck all exactly as they were — an enemy's move is a virtual card
  (`moveCard`) that is never filed into a pile. So this is presentation, and agreed: it should not
  look like the party gained anything.
- **Fixed the one thing that plainly caused it:** a downed combatant's telegraphed card used to hang in
  the air until the next repaint swept it away, and for the rightmost enemy that is directly above the
  discard pile — a card sitting over the pile and then vanishing reads exactly as "deposited". It now
  falls apart with its owner at the moment they drop (`hcIntentGone`).
- **If it is still there, it is the other card:** the big copy an enemy's move enlarges to
  (`revealEnemyCard`) fades at the centre of the battlefield, which sits above the hand. If that is
  what looked like it was going into the pile, say so and it can fade upward, or back to the enemy
  instead. One detail — which card, and does it happen when they die or when they act — settles it.

### 23. The upgrade window's tooltip should show the upgraded card ☐

> The tooltip for hovering over a card in the upgrade window would be a lot more useful if it showed
> you the upgrade state directly instead of just showing you the card you're hovering over.

### 24. Framework for several upgrade paths per card ☑

> Please add the framework for handling cards that upgrade into multiple possible upgrade paths, it's a
> neat spot of design space.

- A card upgrades along a LADDER (`upgradeArray`: one override object per level). A card may now offer
  several: **`upgradePathArray: [{index, name, description, upgradeArray}]`**. The copy being upgraded
  picks one the first time, and the choice is remembered on the INSTANCE (`upgradePath`) — so two
  copies of the same card in one deck can go different ways.
- **Nothing downstream changed.** A path is only "which list of overrides gets laid on", so card text,
  the upgrade preview (item 6), the deck screen, the reward screen and the save all work untouched, and
  a card with no paths behaves exactly as before. One helper owns the question of which ladder a copy
  is on: `honeycomb.cardUpgradeArray(definition, path)`; `cardUpgradesRemaining` is what "upgradeable"
  now means, and every ceiling in the codebase reads it.
- **Choosing** is an ordinary question through the choice system (`honeycomb.chooseUpgradePath`), so it
  rewinds and replays like every other, and each option previews the card that path would give rather
  than just naming it. A card with one path never asks.
- **First card using it:** Brienne's **Riposte** — *Edge* (twice your Shield) or *Guard* (same damage,
  free). A deliberately small pair: the framework is the deliverable, the design space is yours.
- Test [55]. Tests: **650**.

### 25. Boss AI: a charging bar, rarer frames, larger rare intents ☑

> We need some kind of AI especially for bosses that makes certain cards less likely to be played early
> and never played twice in a row. A simple way to do this would be if enemies had their own invisible
> charging bar, and matriarch's brood card could only be used once that bar is full enough. These
> expensive cards should be given the rarer vertical frames to display there's something important
> coming, and rare intent cards should be a little larger.

- **The charging bar, as described.** Every AI combatant carries `charge`, gains `chargePerTurn` (1) at
  the start of each of its own turns up to `chargeMaximum` (6), and a move naming a **`chargeCost`**
  cannot be chosen until the charge is there. Choosing one SPENDS it — at the moment it is telegraphed,
  not when it lands, so an enemy killed before it swings has still paid for the wind-up. One number per
  move buys all three behaviours: not early, not often, and never twice running.
- Invisible, as asked: nothing draws the bar. The tell is the telegraph.
- **The Matriarch:** Swarm 3, Brood 3, Wail 4 — roughly one big move every three turns and never two
  in a row. `maximumInARow` (which already existed) now guards her cheap moves: Lash 2, Shield 1.
- **Rarer frame and larger telegraph, DERIVED** so they cannot drift from the cost: a move costing at
  least `rareChargeCost` (3) is rare, `moveCard` gives it the vertical frame, and its telegraph stands
  `rareIntentScale` (1.3×) larger with a gold glow. Browser-checked on Brood.
- Test [54], including a full fight that never opens on a charged move and never repeats one.

### 26. Forecasts should include poison ☑

> Character HP forecasts should include poison

- **It was being computed and then thrown away.** The standing forecast already runs the party's next
  turn start, where poison ticks, so an ALLY's poison was in the reading. But `forecast.incoming()`
  ended with `restrictToSide(reading, "ally")` — a round-02 decision ("what the enemies do to each
  other is not the player's business") that also deleted every enemy's poison. Playing Nettle, you could
  apply 12 Poison and the enemy's bar would say nothing about it until the turn passed.
- Now both sides are reported (`tuning.forecast.incomingIncludesEnemies`, on). The clutter the old rule
  guarded against does not appear: an enemy's own attacks target the party, so the only entries that
  land on an enemy are the ones the PLAYER arranged — their poison, their thorns, an ally they
  summoned. Enemy bars get the same "27 → 20" reading allies have.
- Test [28] gained a case with its own engine (a forecast replaces `honeycomb.state`, so poisoning
  somebody inside the existing case would have leaked). Tests: **619**.

### 27. The fullscreen notification blocks the game on mobile ◐

> The fullscreen notification makes the game entirely unplayable for several seconds after entering
> fullscreen on mobile with no way to dismiss the message.

- **Which message, though?** Nothing in the whole project draws a fullscreen notice — Honeycomb is the
  only thing that touches the API at all, and it shows nothing of its own. So this is either (a) the
  BROWSER's own "swipe down to exit full screen" notice, which is not ours to remove, or (b)
  Honeycomb's **Turn your device sideways** hint, which is ours. A screenshot would settle it; until
  then both are made as harmless as they can be.
- If it is (b): the hint now dismisses on a tap ANYWHERE on it rather than only on its "Play anyway"
  button, and says so. On a squat landscape viewport that button can sit off the bottom of the screen,
  which would read exactly as "no way to dismiss the message".
- If it is (a): the request is skipped when the page is already fullscreen, so a second press cannot
  re-raise the notice. The only way to be rid of it for good is not to use the API on a phone at all —
  say the word and the button becomes desktop-only, since item 7's compaction buys most of the room by
  itself.

> Message: [local address] - To exit full screen, drag from the top and touch the back button, directly blocks things like the close button on inspect windows and the hand.

### Unsorted feedback which hasn't been added to the above list

**MOVED TO `FEEDBACK-05.md` (session 6), numbered 1–25 and tracked there.** The quotes are kept below
untouched so this file stays a complete record of the round; the work and its annotations live in
round 05. Items 1–8 and 22–25 are done, 9–21 are open.

- The broken state should only be removed if at the -start- of your turn you have more health than lust
- Broken animation: brokenClaw is visible too early, it's meant to look like the tears are just forming at first.
- Broken animation: Screenwipe does not visually look like it's removing elements beneath it, it just looks like a rombus is passing over the screen and the assets vanish independently. The screenwipe's purpose is to hide the vanishing elements underneath it.
- Recovery should not use the broken sprite, make placeholders for a recover.webp for each character using their normal standing sprite.
- I used the debug tools to trigger the broken state on severine but the cards in hand didn't change to the broken variants. Maybe because she had already recovered in the same turn?
- It's hard to visually tell when a character's broken or not.
- All the numbers and stat bars on the health are getting hard to parse. I think HP should be a bit below the health bar ala mockup-2, temporary health should be a the right end as a golden "+N", and lust on the left hand side with the same heart and pink text. Mousing over any of these should give a tooltip explaining what they are, how much they're predicted to change, and most importantly what card or status is predicted to change them.
- The log should show what did the damage, not just what characters took damage.
- I still don't think the unit nameplates look very good, in fact I still think they look bad. For one thing, I don't know if we need the character's name on there. Color and class icons to the left of the health bar might be better. And if we group buffs/debuffs below the bars it'll lower the vertical footprint. As it stands right now they don't feel very fantasy, aren't very evocative of the game's style, and just don't look very cool.
- The new boss layout makes it impossible to target things behind the matriarch. Bosses should always be taller than minions, the sporelings should be in front of her and shorter so that everyone can be the target of attacks.
- There's no way to cancel choose one effects short of refreshing the page.
- On mobile landscape grabbing and dragging a card it stays super small, but tapping the card again expands it. I'd prefer for mobile it be that consistently larger size when dragging too.
- I think we need to nail down two consistent card sizes, because the text size on small cards is nearly unreadable. It should probably shouldn't even try to display the card's effect at that size.
- Enemy intent cards seem to be styled differently than normal cards, their names are smaller and before being played the cards have no text. 
- hcHandLeft blocks me from mousing over or clicking the abilities of the backline two members of the party
- There should be a list of obtainable cards for each character (hidden if you've never obtained them before) so a player knows what potential options they can get.
- Beneficial effects are currently using the same sound effect as damage.
- Last piece of feedback I got was "Game feels choppy, images took a long time to load".
- There seems to be a phase in the turn where temporary HP is halved, it might be worth it to have a tooltip explain what's happening
- The effect of breaking the hp bar limits feels less like chunks of shattered glass floating off the edge than I'd like
- I think damage predictions are being made at the same time as attacks, this results in cases where holding a bulwark and casting it shows more temporary HP incoming than you'll actually get.
- Please visually show the steps that form the ranks in weakness advancement.
- Weaknesses really need tooltips, not just explaining the sources but giving each rank titles and descriptions (which can be placeholders for now). 
- The most any weakness should rise in one session is a single rank.
- There should be some kind of popup when a weakness rank goes up.
- The shop's picture is still too far to the left. Images should be right-aligned, and should be tested with 1024x1024, 896x1152, and 832x1216 images to make sure the vignette and window cover any empty space where the image ends the player will notice.