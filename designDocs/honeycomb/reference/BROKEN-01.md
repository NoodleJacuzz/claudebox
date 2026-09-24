# Honeycomb — The Broken overhaul (session 5, 2026-09-11 into 09-12)

Shields are gone. Two systems replace the space they held: **Temporary HP** (damage mitigation) and
**Lust / Broken** (the health-bar overlay, and what happens when a character loses).

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** Annotations under each quote
are the interpretation and what was built — if an annotation and a quote ever disagree, **the quote
wins**.

Status key: ☐ not started · ◐ in progress / partly done · ☑ done

## Status board (update as items land)

| Done | Items |
|---|---|
| ☑ | 1 (shields stripped), 2 (Temporary HP), 3 (Lust), 4 (Broken + overlay), 5 (recovery), 6 (broken cards), 7 (game over + enemy AI), 8 (between-run weakness), 9 (map layer) |

Tests: **765 headless**, 111 of them section [56], which is this round. Run `node "!designDocs/honeycomb/tools/test-honeycomb.js"` after any change to any of it.

> **Session 6 polished this round.** Recovery, both cut-ins, the on-board mark, the halving, the
> shattered bar end and the whole weakness ledger were reworked against Noodle's round-05 notes.
> **`../Archive/FEEDBACK-05.md` items 1–8 and 22–25 are where that lives, and where those notes disagree with
> anything below, they win.** The supersessions are marked in place.

---

## 0. The brief

> I really would like to make our game stand apart from Slay the Spire, and I think one way to do that
> is to move away mechanically from using shields as a concept, getting rid of them completely.
>
> Thus I would like you to strip out shields as a mechanical aspect of the game entirely. This will
> leave us with two sizeable gaps I'd like to fill today.

`block` is gone from the engine, not renamed. Every trace — the stat, the effect, the hooks, the
keyword, the badge, the forecast fields, the log entries, the CSS — was removed or replaced. Save
format 4 migrates old saves by dropping the field.

Verify with `grep -rn "block" scripts/misc/honeycomb*` — the only hits left are the English word
("blocking the deck", "a stat block", "an autoplay block") and `statusBlocked`, the log entry for a
status that refused to land. The card-playability flag that used to be called `blocked` was renamed
`unplayable` (and its class `hcBlocked` to `hcUnplayable`) so nothing reads as a shield any more.

Two content indices were renamed with the mechanic and are carried across by the migration: Brienne's
`brienneShieldWall` became `brienneAegis`, the Matriarch's `matriarchShield` became
`matriarchCarapace`.

---

## 1. Temporary Health

> The first is a mechanical need to mitigate incoming damage. I'd like to handle this with a mechanic
> called Temporary Health. Essentially, it's extra health that uses golden theming at the end of the
> health bar, as compared to shields being blue and being basically a second health bar. In addition
> instead of vanishing at the start of your turn like shield, Temporary Health cuts the bonus HP you
> currently have in half.

- `entity.temporaryHealth`, effect `temporaryHealth`, hooks `modifyTemporaryHealthGained` and
  `onTemporaryHealthGained`, keyword `temporaryHealth` printed as **Temporary HP**.
- Decay is `tuning.combat.temporaryHealthDecayFraction` (0.5) at the start of the owner's turn,
  rounded by `temporaryHealthDecayRounding` ("down", so the last point does go).
  `temporaryHealthDecayFraction: 1` reproduces the old wear-off-completely behaviour.

> Temporary HP is not healing. If a character with 40/100 base HP gains 20 tHP, then they still have
> 40 base HP, they just also have 20% of their health bar filled with golden glowing temporary health.
> tHP is consumed before base HP.

- `dealDamage` spends tHP first, then health. `healEntity` still caps at `maxHealth` and never touches
  tHP, so a full-health character can still be given tHP and it is not wasted.
- The bar draws tHP as a gold segment starting at the **end of the health fill** and running right,
  which is exactly "40 base HP plus 20% of the bar in gold".

> And to prevent bars from reaching unreasonable sizes, please implement some kind of visual effect
> that if tHP would cause the bar to fill beyond 100% it creates a shattered right-end of the bar
> effect leaking golden energy.

- The gold segment is clipped at 100%. Past that the bar gains `hcOverfull`, which swaps the right cap
  for a torn edge (a CSS `clip-path` zigzag) and turns on a leak drawn OUTSIDE the bar, so it is not
  clipped by it: a bloom on the break plus gold motes drifting off. Geometry in
  `tuning.art.vitalsBar`; the motes' spread comes off their index, never an RNG draw, because a draw
  while rendering would advance a stream a different number of times depending on how often the screen
  repainted.
- `tuning.combat.temporaryHealthMaximumFraction` is a ceiling that exists only to stop a runaway loop;
  the shatter is the real answer to "the bar got too big".

**Answered:** enemies get tHP too — one mechanic, no special cases in the damage pipeline. Their
defensive moves were converted one-for-one.

---

## 2. Lust and the !!BROKEN!! state

> The second is the design space of having a UI element serve as an overlap on the health bar itself.
> I would like to replace this with lust, a status effect that builds from various factors. It can
> surpass your HP, and if it ever reaches or passes the character's current HP, the character is put
> into a broken state where they are effectively KO'd and their cards have alternate, detrimental
> effects.

- `entity.lust` is a first-class stat, not a `statusArray` entry — it is compared against health every
  time either moves, and it needs its own place on the bar. Effects `lust` and `soothe`; hook
  `modifyLustGained`; keyword `lust`.
- **The break test is `lust >= health + temporaryHealth`**, which is what makes tHP "widen the gap"
  below. `tuning.lust.breakIncludesTemporaryHealth` names the choice.
- Only combatants whose definition says `usesLust` break; it defaults to true for characters and false
  for enemies (`honeycomb.entityUsesLust`). Team is not consulted — an enemy-side Severine still breaks,
  a party-side Sporeling still dies. See CATCH-UP, "TEAMS ARE NOT KINDS".
- Lust is drawn ON the health bar as a **hatched magenta band along its bottom half**, from the left,
  with a **full-height bright head** at its tip. The head is the reading that matters: when it reaches
  the end of the gold, its owner breaks.

  **This was a full-height translucent veil first, and it did not work.** The health fill is a pink-red
  and lust is a magenta-pink; a sheet of one over the other turned the whole bar a single colour and
  cost the player both of the readings the break test compares. A short band keeps health and gold
  legible above it, and the hatch means it can never be mistaken for a fill at any size. Past maximum
  health the band grows to the bar's full height and pulses, which is a STATE rather than a position —
  the head has nowhere further to go.

> The activation of this will be a number of overlays, this is the "!!BROKEN!!" mode, pausing the flow
> of combat for a moment (keeping in mind it can happen on either player's turn or the enemy's) and
> displaying a persona-inspired cut-in overlay onto the battlefield visually alerting the player to the
> change in status.

The break is a `broken` log entry, so it plays as a beat of the replay wherever it happens — a card's
own resolution, an enemy's attack, or the broken-state escalation between turns. See
`honeycomb.combatScene.logHandlerArray`.

### The layers, as specified

> 1. Background chains. At start, three copies of ui/broken/brokenChainBackground move across the
>    screen with motion blur enabled, brokenChainBackground is built to loop. These stop at midway,
>    then move again offscreen at ending. Their positions and angles are showing in mockup-6-breakdown
>    but art shown more clearly in mockup-6-backgroundChainsOnlyForReference.
> 2. Tear background. Character specific, for testing use Brienne, hers is characters/knight/brokenBG.
>    At start, this layer is invisible, at midpoint, it becomes visible through an upcoming layer. Use
>    ui/broken/brokenClawMask to cull anything that would be outside of the tear.
> 3. Screen tear. At start, use ui/broken/brokenClawStart as the starting points to fill the screen
>    with white, and use brokenClawMask to cull any white that would go beyond the borders of the
>    tearing effect. At midpoint, overlay ui/broken/brokenClaw and erase the white starting from the
>    points at brokenClawStart to simulate the white tearing giving way to holes making the tear
>    background visible.
> 4. Front chain. At start, move ui/broken/brokenChainFront1 to cover the screen in the same way as the
>    background chains. At midpoint, change to ui/broken/brokenChainFront2 to simulate the chain
>    breaking.
> 5. Character art. Character specific, for testing use Brienne, hers is characters/knight/broken.
>    Below the screen at start, slides up until bottom-aligned at midpoint. I will need to be able to
>    resize these, the mockup feels like it might look to cluttered in action, and this is the best one
>    to tweak.
> 6. "!!BROKEN!!" Text. Appears at midpoint in a flash of red.
>
> Then at the end, use a diagonally slanted black screenwipe move left to right and make it visually
> erase elements it passes over.

Built as `honeycomb.brokenOverlay` (honeycomb-overlays-broken.js), one element per layer, in that
z-order. **Every number is in `tuning.brokenOverlay`** — the three background chains' angles, offsets,
travel and blur are `chainArray`; the character art's size is `characterScale`, which is the knob
Noodle asked for. **It ships at 0.85 rather than the mockup's 0.94**, because the mockup does read
cluttered once it is moving; `brokenScale` / `brokenOffsetPercent` on a character override it.

Two mechanics worth knowing:

- **The claw mask is used inverted.** `brokenClawMask.webp` is opaque black *outside* the tear and
  transparent *inside* it — painting it would cover the battlefield. CSS masks read alpha, so the
  runtime needs the complement. `brokenClawMaskInner.webp` is that complement, generated from the
  original by `generate-placeholder-art.py --broken-masks`; it is a derived asset, so regenerate it
  rather than editing it. (`mask-composite: exclude` would avoid it, but it is Chrome 120+ and this
  game has to run in a Cordova WebView.)
- **The tear grows with `mask-size`, not with a stack of frames.** Both the white fill and the
  character background sit under a wrapper masked to the claw shape, and each carries six radial
  gradients positioned on the six strokes of `brokenClawStart`. Animating `mask-size` from 0 grows
  them without scaling any content. The white grows first (the tear opening); then the same growth
  runs on the background layer *above* the white, which reads exactly as the white being erased from
  the start points outward. Positions are `tuning.brokenOverlay.clawStartArray`, measured off the
  1920×1080 asset.

### Recovery

> In order to cure them of their broken status, a player's turn must start with the character's HP
> higher than their lust. However after a turn characters in broken states begin to build up lust and
> lost HP in incrementing amounts each turn. Please also design another animation to play showing the
> character recovering. *This* overlay can be more directly persona inspired with just a cut-in of
> their eyes, and be faster too. I'll leave the exact specifics up to you, but do note there is a
> recoverBar, recoverBarMask, and recoverBG for each of the three current characters.

- Recovery is checked at the start of the party's turn, strictly `health + temporaryHealth > lust`.
  **SUPERSEDED IN PART by FEEDBACK-05 item 1 (session 6):** it used to be checked at a turn start *and*
  every time either side of the comparison moved, so a mid-turn heal un-broke somebody on the spot.
  Noodle's round-05 note is explicit — "The broken state should only be removed if at the -start- of
  your turn you have more health than lust" — so inside a fight only a turn start answers now. A
  mid-turn heal BUYS the recovery and the plate says so. Outside a fight it is still immediate, because
  there are no turns on the map and §4 below wants the per-move bleed to be able to un-break somebody.
- Escalation runs at the **end** of each turn a character spends broken:
  `brokenEscalationBase` (1) + `brokenEscalationStep` (1) per turn already spent broken, as both lust
  gained and health lost, capped by `brokenEscalationMaximum`. `entity.brokenTurnCount` is the counter.
- `honeycomb.recoverOverlay` is the faster cut-in, about a third the length of the break: the
  character's `recoverBG` fills a band cut by `recoverBarMaskInner`, `recoverBar` draws the rails, and
  the character's face at eye level slides in from the side while a light sweeps across. Then the band
  closes.
  **CHANGED by FEEDBACK-05 item 4 (session 6):** the face is cropped out of the character's own
  `recover` art now — "Recovery should not use the broken sprite" — falling back to their portrait and
  never to `broken`. `tuning.recoverOverlay.eyeWindow` was re-measured against it.
- **The crop is scaled UNIFORMLY**, and that is the whole of what makes it work. The slot between the
  rails is very wide and very short; a face is not. Scaling the two axes independently to make a face
  fill that slot turns one eye into the entire screen, which is exactly what the first attempt did.
  `tuning.recoverOverlay.eyeWindow` therefore has only `centreXPercent` (what sits in the middle),
  `topPercent` (the row at the top of the slot) and `heightPercent` (the only zoom control) —
  whatever width that scale gives is what the slot shows, and a horizontal strip through a face at eye
  level is the Persona reading anyway. `slotTopPercent` / `slotHeightPercent` are the gap between the
  rails, measured off the art.
- The maths is written in the PICTURE's own terms — a height as a multiple of the slot's, and two
  translate percentages that resolve against the image's own box — so it is independent of the
  viewport's shape. A character whose art puts the eyes elsewhere gets a `recoverEyeWindow` of their
  own rather than a stretched window.

> Important to consider is that breaking from lust, overlays, and recovery is only for the player
> characters who are worth this extra effort. Thus for enemies, future minions, etc. Death is just
> death, as it is currently in the game.

`usesLust` on the definition, above. Everything else still goes through `checkDeath`.

**Answered (session 5):** a player character at 0 HP is **always Broken, never downed**. It falls out
of the rule for free — `lust >= health + temporaryHealth` is true at `0 >= 0` — so HP damage is simply
the second road to Broken and player characters cannot be killed. `honeycomb.checkDeath` returns early
for anyone who uses lust.

---

## 3. Cleanup and content

> Once you are finished making sure temporary HP, lust, broken, and recovery are done and looking
> pretty, please rebuild the current basic card pool, especially Brienne, who should have cards with
> give temporary HP replacing the shields she currently does, as well as cards that reduce lust. Make
> one of Severine's costumes replace all self-damage with self-lust build-up, then make broken variants of
> each card in the database. Basically, in the database each card should point to an invisible
> alternate card that it is silently replaced with when the owner is in a broken state.
>
> To reduce your workload, we'll say that each character only has one broken card each for now, so the
> whole of the database's broken variant pointers only point to one of three cards. Brienne's brings up
> an choice window letting the player choose between reducing lust and gaining temporary HP, Severine's
> reduces her lust and deals damage to any random target, and Nettle's reduces her lust + restores HP but
> shuffles wisps into the deck.

- Every card carries `brokenCard`. It defaults from the card's owning character
  (`character.brokenCard`), so a new card needs no field; naming one overrides it.
  `honeycomb.brokenCardFor(card, entity)` is the single seam.
- The swap happens when the hand is **resolved**, not when it is played, so the player reads the card
  they will actually play. `rarity: "broken"` keeps the three out of rewards, shops and the discovery
  ledger.
- **A NEUTRAL CARD IS NEVER SWAPPED.** It belongs to nobody, so nobody's broken state applies to it.
  Deliberate: it makes neutral cards a real hedge for a party that keeps folding, and the alternative
  (swapping on whichever member the ownerless fallback happens to pick) would key a card's behaviour to
  party order, which is worse. A neutral card that should have a broken form names its own `brokenCard`.
- **A broken character cannot use their ABILITIES either** (`abilities.usability`, reason
  `ownerBroken`). Their cards are already reduced to one; leaving the ability alone would hand a
  broken Brienne her party-wide Aegis. An ability meant to work anyway names `usableWhenBroken: true`.
- `brienneBroken` "Buckle" — a choice window: reduce lust, or gain tHP.
- `severineBroken` "Lash Out" — reduces her lust, damages a random target on either team.
- `nettleBroken` "Wither Within" — reduces lust and heals, shuffles Wisps into the draw pile.
- Severine's **Night Court** outfit is the self-damage → self-lust one: hook `replaceSelfDamage`, consulted
  by `dealDamage` when source and target are the same entity.

> Don't forget to account for game over and enemy behavior while building these systems. Every
> character being broken means the player loses, and the enemies should avoid targeting broken
> characters where possible.

- `combat.checkEnd` counts a Broken member as out. All out → defeat.
- `aiTargetRuleArray` sorts Broken targets last, and the sort is `tuning.ai.brokenTargetPenalty`, so
  "where possible" is a weight rather than a ban — an enemy with only Broken targets still swings.

> Finally, please add some stats that can build over time between runs to track how often a character
> has been hit by lust-building attacks, specifically which tags those attacks had. I'd like to add the
> characters becoming more vulnerable to those attacks between runs to encourage team diversity and add
> a sort of scaling difficulty.

**Answered (session 5), verbatim:**

> Make it stepped and semi permanent, going between ranks of 1, 2, and 3 where all the increased
> weakness is tied to the rank. I don't have concrete numbers for this at the moment, but I do know the
> growth of one weakness should decay other types by a little bit.
> This small decay from another weakness growing can't make you go down a rank though. We can add in
> special options to allow for faster growth and decay between runs through special consumable items,
> rare cards, cheat codes, or even make that the official easy/hard modes somewhere down the line. I
> can say for sure though it'll make an interesting challenge run to try and max out every weakness as
> soon as possible for the crazier types out there.

- `profile.lustExposureArray[characterIndex][tag]` is an integer count. Ranks come from
  `tuning.lust.exposureRankArray` — `[{rank:1, atOrAbove:8}, {rank:2, atOrAbove:20}, {rank:3,
  atOrAbove:40}]` — and **the whole of the extra weakness is the rank's `lustMultiplier`**; the raw
  count does nothing on its own, so a character sits still until they step up.
- Growing tag A decays every other tag by `exposureDecayPerGrowth`, **floored at the threshold of that
  tag's current rank**, so a decay can never demote.
- `honeycomb.lust.exposureRate` and `.decayRate` are single multipliers over both, and every caller
  goes through them — that is the hook a consumable, a cheat code or a difficulty mode reaches for.
  `tuning.lust.exposureRateDefault` / `decayRateDefault` set the baseline; `profile.lustExposureRate`
  overrides per profile.
- Shown on the teambuilding character sheet as a per-tag list with its rank, so a player can read why
  Brienne keeps folding and bench her.

---

## 4. The map layer

**Answered (session 5), verbatim:**

> Both persist; rest sites can treat them, but allow for events to have variants if a broken character
> is present, and for events to appear if a character is broken, and for the shop to have a special
> sale if a character is broken to play an event healing them. This makes not being near a rest site
> less obscenely punishing. Also, lust should degrade by a little bit every map movement.

- Lust and Broken carry between fights exactly as health does (allies are not copied into combat).
- **Every map movement bleeds lust**: `tuning.lust.decayPerMapMove` (2), applied in
  `honeycomb.map.enterNode` before the node runs. It can un-break somebody on the map, which fires the
  recovery cut-in on the map scene too.
- **Event variants**: an event may carry `brokenVariantArray` — an alternate `title`/`bodyText`/
  `choiceArray` chosen when a party member is Broken. `honeycomb.eventVariantFor` picks it.
- **Events that appear because somebody is Broken**: the event pool's weighting reads
  `appearsWhenBroken` / `weightWhenBroken`, so "The Quiet Spring" and "Hands In The Dark" are only
  drawn while somebody needs them, and common events get a smaller share.
- **The shop's special sale**: `shopBrokenOfferArray`. While any member is Broken the shop shows one
  extra plate — a service, not an item — which runs an event that treats them.
