# Honeycomb — Feedback round 03 (2026-09-11, first outside tester)

Noodle invited a tester in; this round is their findings plus Noodle's notes on them. **Quotes are
verbatim. Do not summarise this file; add to it.** Annotations under each quote are the interpretation
and what was done — if an annotation and a quote ever disagree, the quote wins.

Priority given for the round:

> Currently the goal is to finish wrapping up everything mention in feedback-02.md but I invited a
> tester in to try the game out and got some valuable feedback, so these are the highest priority
> right now

Status key: ☐ not started · ◐ in progress / partly done · ☑ done

## Status board (update as items land)

| Done | Items |
|---|---|
| ☑ | 1, 2, 3, 5, 6, 7, 8, 9 |
| ☑ | 4 — "scene" layout approved by Noodle (FEEDBACK-04 item 8) |

Tests: **527 headless** (section [49], and [45] rewritten for items 5, 6, 9).

---

### 1. Draw and discard need to be seen ☑

> We really need an animation for the cards being sent into the discard and a new hand being drawn in
> their place, and for cards being forced into your discard pile. This is the biggest factor they said
> was lacking, it felt like cards were morphing between rounds because there wasn't an animation for
> it, drawing cards with blood pact and soul drain felt less like drawing and more like the hand was
> being replaced.

- **Cause:** the engine already logged every card move, but the replay ignored them and the closing
  repaint swapped the whole hand in one frame.
- **Now** the replay edits the hand it shows, entry by entry ("Hand motion" section at the end of
  `honeycomb-scene-combat.js`): leaving cards fly to their pile and the fan closes up (FLIP on the
  slot's `translate`); drawn cards fly in from the draw pile, growing, and the fan opens. Pile numbers
  tick as each card lands. The replay waits for everything to land before repainting.
- Also shown: the played card vanishes from the fan (it used to hang there lifted), then goes on from
  where its flight ended to the discard; exhaust burns in place; **created cards** (an enemy's Wisp)
  pop up over whoever made it, captioned "Into your discard pile", held ~0.7s, then fly there;
  reshuffle flies card backs discard → draw; a new fight's opening hand is dealt.
- Engine (additive): `cardCreated` logs `sourceId`; `moveCardToPile` entries log `fromPileArray`.
- Tuning: `animation.handFlowMs`, `cardDealMs`, `pileFlightMs`, `createdCard*`, `reshuffle*`, `exhaustMs`
  and friends. `cardDealGapMs` 70 → 110 so a draw reads card by card.
- HC-PLACEHOLDER: the player card back (`cards/frames/playerBack` replaces it) and the burn keyframes.
- Verified in the browser at 0.25× speed (sweep, Blood Pact draw, Wisps into discard, reshuffle);
  DOM hand order and pile numbers match state after every replay.

Follow-up from Noodle after seeing it:

> Good work on the drawing animation by the way, though it'd look nicer if it appeared to actually be
> coming from a deck icon. The actual deck icon is quite small

- ☑ The draw and discard piles are card-shaped STACKS now (`renderPileDeck`; like mockup 2's deck,
  bottom left): thickness grows with the count (`layout.pileDeck*`), count as a corner badge, an
  empty pile is a dashed outline. The discard shows the last card that landed on it, face up and
  dimmed. Cards leave the top of the stack and land on it at its own size.

### 2. Shield width reflects the amount ☑

> Shields don't seem to increase in width based on the amount of shield health, making it seem like
> they always have 1 shield even when they have more.

- `honeycomb.ui.shieldSegment`: a blue segment ON the health bar, drawn to health's scale (width =
  Shield ÷ max health, capped at the whole bar). It stands on the end of current health, and is laid
  back over health from the right when Shield exceeds missing health. Shield a held card would add is
  a pale breathing stretch at its end. The disc badge stays as the number (and "4→0" forecast).
- Verified at 5 / 20 / 45 Shield and on an enemy. Part of the nameplate redesign later (02 item 27).

### 3. Brienne "dead" at 6 HP (bug) ☑ (one path found and fixed; not reproduced in combat)

> They triggered a bug somehow were Brienne was dead with 6 HP remaining, I dunno how they triggered
> it, but Brienne's cards said they were dead and their portrait was greyed out, and they were suddenly
> alive again on the next round.

- **Found:** `recalculateMemberStats` added any max-HP growth to current health WITHOUT checking
  `downed`. A member downed at 0 whose maximum then grows (a tree node like Trained, an outfit such as
  Warden, equipment like Heavy Pauldrons) became "downed with N HP": bar alive, cards "Brienne is
  down.", sprite/portrait greyed -- until the next fight's revive (`combat.begin`) stood her up.
  Matches every symptom if "next round" meant next fight. Fixed: a downed member gains nothing and is
  held at 0. Test [49].
- **Not found in combat:** a scratch fuzz (150 seeds × 3 fights, random plays and targets, forecasts
  every turn, invariant "downed ⇒ 0 HP and 0 HP ⇒ downed" checked after every action) turned up
  nothing, and every forecast left state byte-identical. If it recurs mid-fight, a text export of the
  save from that moment would pin it.

### 4. A layout between Jumbo and Stage, toward mockup 2 ◐ (built; yours to judge and tune)

> I think the layout that works best would be somewhere between Jumbo and Stage. I added an example
> placeholder background in v13 spire images/backgrounds so we can work on getting stage layout to look
> closer to mockup-2. While I'm not a fan of the hand placement of the mockup I do like how the
> characters feel more present in the scene, it almost feels like characters in focus are physically
> moved forward compared to the rest, which is a neat touch.

- Unblocks FEEDBACK-02 item 26 (the layout choice), which in turn blocks 27 and 28 there.
- **New layout "scene", now the default** (`tuning.battleLayout`): no windows; figures a third taller
  than Stage's (frame 82%, sprite 100%), slightly overlapped (negative gap) so the party reads as a
  group; nameplates just under the feet; backdrop at 95% with a vignette at top and foot. The mockup's
  hand placement was NOT copied.
- **Focus is distance** (flag `depthFocus` → `.hcDepthFocus`): the focused fighter — a hovered card's
  owner, the target under a held card, an ability's legal target — steps FORWARD (scale 1.07, 3% lower,
  in front); half-focused step back 2.2% up the floor at 0.95, non-focused twice that at 0.9, darker as
  before. Scaled from the feet. Front rank overlaps on top at rest. `focusClassArray` "full" now has a
  class (`hcFocusFull`), set only while something is being focused. Step time `animation.depthStepMs`.
- **Backdrop** comes from encounter `battleBackdropPath` → region `battleBackdropPath` → tuning
  `art.battleBackdropPath` (= `backgrounds/placeholder`, your example).
- Found while doing it: allies stood 22px higher than enemies because the ability button sat in their
  column. Flag `launcherOnFloor` parks it under the nameplate (`abilityLauncherBottomPercent`) instead.
- New layout fields are all table-driven: three flags (`depthFocus`, `vignette`, `launcherOnFloor`) and
  six numbers (`depth*`, `abilityLauncherBottomPercent`). Jumbo/Stage/Crowd are untouched; the debug
  Layout button still cycles them. A profile that saved "jumbo" keeps it until cycled.
- Verified at 1280×720: feet on one line both sides, hover step-forward, party shift FLIP, no errors.

### 5. Equipment is generic or heirloom, nothing else ☑

> Drop the weapon, armor, trinket, etc. descriptors from equipment. The only info we need is if they're
> generic equipment or heirlooms specific to a character. That way we get the advantages of not letting
> the player start with overpowered things, and heirlooms can be common or rare so we still get
> character-specific relics at both rarities.

- `equipmentSlotArray` and every `slot` field are gone. KIND is derived, not stored:
  `honeycomb.equipmentKindArray` (heirloom = names a `characterIndex`, else generic) and
  `honeycomb.equipment.kindOf` / `kindText` in honeycomb-state.js. Shown as "Common Heirloom", "Rare
  Heirloom", or just "Common" for generic gear (row meta and tooltip heading).
- "Heirloom" is no longer a rarity. The three starting heirlooms are **common**.
- **Judgment call, flagged:** the Duelist's Blade became Brienne's **rare heirloom** (it only ever
  rewrote her Sword Strike, and her Keen Edge node unlocks it), so the rare-heirloom case exists in
  content. No new pieces were authored (demo scope).
- The one-per-slot wear rule went with the slots. Putting a piece on at capacity now takes off the one
  worn longest, so a click never produces a greyed piece.
- Equipment tab: sort "Slot" → "Heirlooms first"; filter chips Heirloom / Generic / Found.

### 6. The bio's equipment counter counts heirlooms ☑

> The equipment counter in the character bio should probably just count heirlooms, otherwise it's
> confusing to players when "5/7" are unlocked yet there's only 3 that can be worn.

- The bio tile is now **Heirlooms found/total for that character** (`equipment.progressFor(c, true)`).
- The Equipment tab's "Found X / Y" had the same flaw; it now counts only what the character could
  wear (generic + their own heirlooms). Test [45].

### 7. Event relics never duplicate ☑

> Events that give relics can give duplicates, they should probably give XP instead, though in general
> we should avoid giving dupes. Either by having event rewards give specific relics that don't appear in
> common tables, or by having events pull random relics avoiding what's already in the inventory.

- **Cause:** `grantRelic` silently refused a carried relic, so the choice paid nothing. Crackseal Wax
  was named by two events, and all three relics also roll in treasure.
- **All three answers now exist** (entities.js, beside `grantRelic`):
  - XP instead: `grantRelicOrExperience` — a carried relic pays `tuning.progression.
    duplicateRelicExperience` (40; a relic's own `duplicateExperience` overrides) into the GLOBAL pool
    and logs `relicDuplicate`. The choice PREVIEW says so before it is taken.
  - Random, never a dupe: new verb `gainRandomRelic` (optional `rarity`, `pool`); nothing left → XP.
    The Quiet Shrine's offering uses it now (it named Crackseal Wax, same as the Sealed Door).
  - Event-only relics: a relic with `pool: "event"` never rolls in treasure or shops. **No relic is
    flagged yet** — there are only three, and flagging any would starve treasure. One field when needed.
- Test [49].

### 8. Events show the cards and relics they give or take ☑

> Events which add/remove cards should actually show the cards. Same with events that give relics.

- The event aftermath draws what the choice's LOG says happened (`eventOverlay.gainKindArray`, one row
  per log type): cards added / removed (struck through, with owner) / upgraded, relics gained, and a
  carried relic dimmed with "+40 Experience instead". Random outcomes show the real result.
- Deck edits now log the actual card: `deckCardAdded` / `deckCardRemoved` (with the instance, owner,
  upgrade level) replace the unread `deckChanged`; deck `upgradeCard` logs `cardUpgraded`.
- **Bug found and fixed:** `removeCardFromDeck` with no card named matched nothing, so the Cardsharp's
  "Trade a card" added a card and removed none. No card named now means a RANDOM card (event stream).
- Verified in the browser: Cardsharp trade, Quiet Shrine, Sealed Door with the relic already held.

### 9. The count badge explains itself; three is the default party ☑

> Hovering over the hcCountBadge should show a tooltip explaining that you can equip more things with
> a smaller party. And three party members should be the point where characters can only take 1 piece
> of equipment. We may do more with minions and summons, but for now 3 seems like a good number as the
> default party size.

- Revisits FEEDBACK-02 item 41 (capacity = 1 + 1 per empty party slot, a judgment call flagged there).
- Capacity = `baseCapacity` (1) + `capacityPerMissingMember` (1) × members short of
  `capacityPartySize` (3): three or more → 1 each, two → 2, one → 3. `tuning.equipment`.
- Tooltip kind `equipmentCapacity` (key = party size) on the bio badge and on the Equipment tab's
  "may use N": the rule in words plus a small party-size table with the current size lit. Every
  number comes from `equipment.capacity`, so it cannot disagree with the rule. Verified by hover.
