# AUDIT-01 — DONE (archived 2026-09-18, session 31)

The original session-30 findings and the phase 1-3 change log, moved here whole so the live
`rework/AUDIT-01.md` holds open work only. **Every 🔴 / 🟠 / 🟡 below is FIXED** unless the live file
still lists it. Re-verified in session 31 by running `progression-sims.js`, `progression-dump.js` and the
suite (test blocks [96] [97] [98] [99]), not by reading these notes. Noodle's inline answers (in parentheses)
are kept as written; the live file quotes them again with what was done.

---

# AUDIT-01 — progression trees, starters, outfits (session 30, 2026-09-18)

**Read this before trusting `WIRING-STATUS.md` or the session-29 entry in `CATCH-UP.md`.** Those say the
trees are 100% wired with no stand-ins. That is true only in the narrow sense that every node carries
*some* field an engine reads. Checked against `STARTER-LIST.md` / `OUTFITS-LIST.md` by running the
engine rather than reading the notes, a large share does the wrong thing, prints the wrong thing, or
does nothing.

The test suite passes (1487 / 0 / 0) and `audit-trees.js` passes, **with every bug below present**. The
tests hold what was built, not what was designed, so a green run proves nothing here.

How it was checked: `progression-dump.js` (every starter, signature and tree node, with the card text
the game actually prints at each rank) and `progression-sims.js` (headless fights that play the card or
ability and measure HP, statuses and meters). Both live at the honeycomb root.

Legend: 🔴 broken (wrong behaviour) · 🟠 wrong content vs the design doc · 🟡 text / cosmetic · ❓ needs Noodle

## Fix status (live, updated per task)

| Phase | State |
|---|---|
| 1. Engine bugs (§2, §3 🔴) | ☑ **Done.** Test block **[96]** plays each one in a fight. |
| 2. Text pass (§3 🟡, §4) | ☑ **Done.** Test block **[97]** pins the printed strings and bans fallback phrasing pool-wide. |
| 3. Outfit rework (§1) | ◐ **Mostly done.** All 18 signatures, 18 passives, default +20% XP and 14 of 18 A2 lines built to OUTFITS-LIST. Test block **[98]** plays each one. Open: 2 Cassadora A2s, unlock routes, signature upgrade ladders (see "Phase 3" below). |
| 4. Questions (❓) | open, waiting on Noodle (list below) |

**Phase 3, what changed** (suite 1523 → 1548, 0 failed):

- **Every alt outfit rebuilt** in `honeycomb-content-characters.js` to OUTFITS-LIST's signature, passive,
  A2 line and boost/reduce. Descriptions name effects, never the sister's system name. HP modifiers
  kept as they were (the list gives none).
- **New signature cards**: Headstrong, Incredible Wealth, Blood Moon (`severineBloodMoonRite`), Guided
  Hand. Redesigned in place (same index): Pop, Spore, Kiss, Cut, Jinx (`cassadoraIllWish`), Rush, Gold
  Standard. Retired: Hold, Share the Plate, Gift, Quiet Mercy.
- **A2 lines** ride `treeAbilityReplacementArray` on the outfit, applied *after* the tree, so they
  exist only once the A2 node is bought (`to: null` disables it). 14 new abilities in
  `honeycomb-content-abilities.js` under "OUTFIT A2 LINES", with placeholder names (the list gives
  effects, not names): Battering Ram, Almsgiving, Rot Feast, Spore Bloom, Night Bloom, Hunter's Rush,
  Covenant Rite, Consecration, Abandon, Shared Vows, Hex Storm, Phoenix Dive (Strength), Marshal's
  Call, Scorched Earth. Bastion's last stand and Blood Saint's halo are hooks gated on
  `honeycomb.treeGrantsAbility`.
- **New engine seams**, each a loadout field: `temporaryAbsorbsLast`, `resolveFromTemporaryLost` +
  `resolveLostPerPoint`, `extraDrawPerTurn`, `soulsFromConsumedPoison`, `poisonHealsAllies`,
  `poisonInflictsLust`, `selfDamageMultiplier`, `healingReceivedMultiplier`, `selfHealingSplit`,
  `cannotBeSoothed`, `brokenLustScatters`, `rarityWeightMultiplierArray`, `stolenCardsKept`,
  `stolenCardsToDiscard`, `allyAttackBonus`. Plus: `costPerOwnerHealthLoss` on a card, a combat
  `nextCardDiscount` (`discountNextCard` verb), `drawOwnedCard` verb, `otherEnemies` target mode, an
  `onWouldBreak` hook, an `onStatusConsumed` run hook, an `onTemporaryRemoved` hook, a `{selfDamage:N}`
  text token, and readers `memberLoadoutFlag` / `partyLoadoutFlag` / `memberFieldProduct`.
- **Vanguard Plume's A1** is an `abilityUpgradeArray` on the outfit: exhaust a chosen card, draw one,
  3 charges. Checked on the live combat screen as well (the choice prompt appears).
- **New warning rule `duplicateCardName`** (console only). It reports three real clashes: Blood Moon
  (rare vs signature, and the status), Jinx (common vs signature, and the status), and an older one,
  **Claw Flurry** (common `severineFlurry` vs starter `severineRend`).

**Phase 3, still open**

- ❓ **Soothsayer and Grifter A2** say "for each symbol in your orb … a type matching that symbol".
  Foresight is a count and has no symbols or types. Needs a Foresight redesign; both keep Magic Trick
  for now. (Hedge Witch's "a debuff for each symbol" is built as one per Foresight.) (Orb is a new mechanic I'd like, because foresight wasn't a very interesting one, just another growing bar. I want hers to be an orb with quadrants, it can look like a pie chart if it's too small to actually fit symbols in)
- ❓ **Unlock routes**: OUTFITS-LIST says run-win / shop / tree-end, but every alt's `Unlock:` is `—`.
  All stay `unlockedFromStart` until you assign them. No unlock window exists yet. (Deferred until the card pool redesign)
- **Signature upgrade ladders** (NODES-LIST §D: allowed, not infinite): signatures are still
  `rarity: "starter"`, so Tailored (U2) still does nothing. (Please make upgrades for them)
- **Boost/reduce** use the old archetypes as the nearest match (×3 / ×0.5). Soothsayer (scry) and the
  self-debuff sister have no archetype yet, so they boost nothing. Waiting on the pool rework. (Correct, boost/reduced deferred until card pool redesign)

**My readings, each one line to change:** Sporemother's tick heals the *most wounded* ally (not
everyone); Rotsinger gains 1 Soul per consuming card (not per stack); Ecstatic's "cannot be soothed"
applies in fights only; Hunter's Rush keeps Quicken's 2 charges per rest; Covenant Rite is once per rest.

**Phase 1+2, what changed** (suite 1487 → 1523, 0 failed):

- **Training wheels**: the meter now runs whenever the A1 is *carried*; while a wheeled ability resolves,
  `honeycomb.mechanicSuppressedId` stops only that ability feeding the meter. Cards still feed it, and
  A2s work. Cinder's wheels now *require* 3 Stride (`requirementArray` on the override).
- **Ability overrides everywhere**: requirement checks, aiming, forecasts, tooltips, the teambuilding
  sheet and the ability animation all read `honeycomb.abilities.definitionFor` (the member's own version).
  Before this, Veil still demanded a Soul, and a wheel's new target mode was ignored when aiming.
- **Swing / Lance** now aim at an enemy (`targetMode: "enemy"` on the override). Swing requires tHP.
- **`applyStarterUpgradeArray`**: added lines go on the top level only (fixes Drink's 3× heal), and a
  damage line reduced to ≤0 is *removed* (fixes the 0-damage forms hitting for Strength). Cloud now
  flips to pure negative too.
- **New `loseHealth` verb** (`lifeLoss` skips tHP and every modifier): Blood Tap, Soul Tap, One with
  Nothing, Mortification, and Severine's pool self-costs (Blood Pact, Transfusion, Heartsblood, Prey No
  More), whose Strength had been raising their own price.
- **New `fleetingStrength` status** (+ a `clearTiming` status field) for "2 Strength this turn".
- **Blood Tax** consumes what is there and grants the tally. **Bloodlust** keeps its +1 Strength (my
  reading of "instead of losing life"; one line to revert). **Catch Breath** strips Sundered only.
  **Veil / Predict Offense** no longer ask for an enemy. The three "discard a card" wheels now let the
  player choose (they were random); an empty hand auto-answers.
- **Sister Wardrobe** doubles the default outfit's random cards (`honeycomb.outfitRandomCardCount`).
- **Head Start / Fast Start** are turn 1 only (`openingDrawBonus` / `openingEnergyBonus`), per STARTER-LIST.
- **Text**: the generator says "you" / "the target" instead of "the source", phrases sums, doubling,
  status multipliers, repeats, draws and discards in English, and names self-effects ("to yourself",
  "Gain 6 Lust", "Lose 6 Temporary HP"). Every card was diffed old vs new: 17 changed, all improvements
  (including three enemy moves and the Juggernaut's Overhead).

---

## 1. Outfits — the whole layer is still the old session-8 design

Every alt outfit in `honeycomb-content-characters.js` is the session-8 "one outfit per sister mechanic"
version (archetypes feast / bloodletting / transfusion / armament / …). **None of the 18 passives, none
of the outfit A2 changes, and 10 of the 18 signatures match `OUTFITS-LIST.md`.** The outfit rework has
not been started, only the signature cards were partly touched.

### 1a. Signature cards

| Outfit | Designed (OUTFITS-LIST) | In game | |
|---|---|---|---|
| siegeplate | Plate Edge — Deal 4. Gain 4 tHP | same | ✅ |
| bastion | Headstrong — 3 cost, deal 18, costs 1 more each time you lose HP this battle | **Hold** — gain 5 tHP, 1 Taunt | 🟠 |
| almoner | Incredible Wealth — 0 cost, spend all tHP, next card −1 cost per 5 tHP | **Share the Plate** — spend 4 tHP, ally gains 5 | 🟠 |
| rotsinger | Pop — consume 1 Poison, deal **12** | consume 1 Poison, deal **5** | 🟠 |
| sporemother | Spore — 2 Poison; if already poisoned, 2 Poison to all other enemies | 1 Poison to all | 🟠 |
| nightshade | Kiss — target loses all Lust and gains that much Poison | 1 Poison + 3 Lust | 🟠 |
| huntress | Finish — 2 cost, deal 10, double if target or Severine < half | mechanics ✅ (measured 10 / 20 / 22 with passive) | 🟡 text |
| crimsonCovenant | Cut — deal 3 to yourself, gain 3 Strength (reads "Deal 6" under the passive) | deal 3 to self **+ deal 6 to enemy**, no Strength | 🟠 |
| bloodSaint | **Blood Moon** — 2 cost, deal 20 to EVERYONE | **Gift** — 3 self-damage, heal ally 5 | 🟠 |
| devotee | Blessed Pain — 2 cost, ally heals 20 | same | ✅ |
| ecstatic | Edge — 0 cost, gain 6 Lust | same (prints "Inflict 6 Lust") | ✅ 🟡 |
| abbess | Guided Hand — ally gains 2 Strength and 6 Lust | **Quiet Mercy** — heal 4, soothe 3, 3 Lust on self | 🟠 |
| soothsayer | Read — Scry 3 | same | ✅ |
| grifter | Misdirect — 2 cost, Turncoat | same | ✅ |
| hedgeWitch | **Jinx** — 0 cost, Weak or Vulnerable at random | **Ill Wish** — same effect (Sundered = Vulnerable) | 🟡 name |
| vanguardPlume | Rush — 2 cost, deal 8, **inflict 2 Vulnerable** | deal 8, **gain 2 Strength** | 🟠 |
| marshal | Gold Standard — move another ally to front, draw **one of that character's cards** | draws any card | 🟠 |
| ashfall | Recede — deal 6, +3 per debuff on Cinder | same | ✅ 🟡 text |

❓ **Name collision:** "Blood Moon" is already a live rare (`honeycomb-content-cards.js` ~2295), and
OUTFITS-LIST also lists Blood Moon as Crimson Covenant's worn-only rare. One of the three needs a new name. (Please rename old rare Blood Moon)

### 1b. Passives, A2, boost/block, unlocks

- 🟠 **All 18 passives are the old ones.** E.g. Huntress is "+2 damage to enemies below half" (designed:
  draw a card when an enemy dies); Blood Saint is "overheal becomes tHP" (designed: self-healing split
  among the party); Siegeplate is "+1 Armament" (designed: tHP only drains after base HP hits 0).
- 🟠 **No outfit changes or disables A2.** OUTFITS-LIST gives every alt an A2 line; none is implemented.
- 🟠 **Default outfit has no +20% personal XP**, and Brienne's default has no "Boost: Unobtained cards".
- 🟠 **Boost/block uses old archetypes**, sometimes the opposite sister: Huntress *blocks* heal/Drain
  (`transfusion ×0`) where the design *reduces self-damage*. Expected until the pool rework, but it
  should not block a whole sister in the meantime.
- 🟠 **Every alt is `unlockedFromStart: true`.** Designed: run-win / shop / tree-end. No unlock window.
- 🟡 Stale descriptions: Hedge Witch says "One Wisplight becomes Second Thoughts" (it adds Ill Wish).
  Soothsayer shares Hedge Witch's `hex` archetype; Ashfall shares Vanguard Plume's `charge`.
- 🟠 Signatures are `rarity: "starter"`, so **never upgradable**. NODES-LIST §D: "Outfit-signature cards
  should be allowed, they just don't upgrade infinitely". That is also why **U2 Tailored is a no-op**.
- 🔴 **U1 Sister Wardrobe does nothing on the default outfit.** It doubles `cardAdditionArray`; the
  default's 3 random cards come from `randomCardCount`, which is never doubled.

---

## 2. Training wheels — the enable removal kills the whole meter

> Training wheels | 3 paths. Not mandatory. Each **removes the enable**: A1 no longer fuels the
> mechanic; it becomes a situational payoff. She now has to get that fuel from cards.

🔴 **Built as "the meter stops entirely."** `disableMechanic` makes `honeycomb.mechanicActive` false,
which unhooks *every* way the meter fills (`hookSourceArray`), not just the A1's contribution.
Measured: Brienne + A1 + two Braces = 4 Resolve; the same with any wheel = **0**. Cinder swap + thrust =
2 Stride; with a wheel = **0**. Consequences, for all six characters:

- **A2 is dead with any wheel**: Aegis, Undead Army, One with Nothing and Magic Trick need a meter that
  can no longer fill. Severine's Quicken is the exception: Thirst orbs are read off the board, and it
  measured the same with or without a wheel.
- **Cinder's three wheels are pointless**: Momentum / Catch Breath / Lance "spend 3 Stride", but the
  spend is not a requirement, so with 0 Stride **Momentum is a free Draw 2 every fight**.

### Wheel-by-wheel

| Node | Problem |
|---|---|
| 🔴 Brienne **Swing** | Ability targets `owner` and the damage line has no target, so **Brienne hits herself**. Measured: 10 tHP spent, Brienne 68→58 HP, enemies untouched. Text: "Deal the Temporary HP spent damage." |
| 🔴 Cinder **Lance** | Same bug: **Cinder takes the 9 damage** (58→49), enemies untouched. Text: "If the source is at the front". |
| 🟠 Severine **Bloodlust** | "Gain 5 lust instead of losing life": the Strength is gone too (measured 5 Lust / 0 Strength). ❓ confirm that the +1 Strength should stay. |
| 🟠 Cinder **Catch Breath** | "Remove all Vulnerable": it runs `cleanse`, which removes **every** debuff. |
| 🟠 Clemence **Mortification** | "lose 10 life" is ordinary damage, so **tHP soaks it and Clemence's Strength raises it** (measured: 3 Str, 8 tHP → Brienne lost 5; Clemence lost 9). Should ignore tHP and modifiers. Renamed from Penance. |
| 🟡 Nettle **Veil**, Cassadora **Predict Offense** | Ability still `targetMode: enemy`, so a party cleanse / a draw makes the player pick an enemy. |
| 🟡 text | Purify "Remove 0 Lust from ALL allies"; Soul Tap "Deal 3 x the number of hand damage"; Predict Offense "Draw the enemies intending to attack card(s)"; Bloodlust "Inflict 5 Lust" (on herself). |

---

## 3. Starter upgrades (Exclusive A / D)

| Node | Problem |
|---|---|
| 🔴 Severine **Drink** | **Heals 3× the damage.** The added heal is appended inside the `repeat` *and* at the top level (`applyStarterUpgradeArray` recurses `addEffectArray` into nested lists). Measured: 6 dealt, **18 healed**. Text: "Deal 2 damage. Heal for the damage dealt. Repeat 3 times. Heal for the damage dealt." |
| 🔴 Severine **Blood Tax** | "Steal **up to** 2 Strength": she always gains 2. Measured vs enemies with 0 / 1 / 3 Strength → Severine +2 every time. |
| 🔴 Brienne Brace D3, Clemence **Zeal** | "2 Strength **this turn**": it is permanent Strength, still there next turn (measured). |
| 🔴 **0-damage "pure negative" forms** (Wither, Acid, Cloud, Hex, Twist rank 2) | The damage line is left in at 0, so it **still hits for the owner's Strength**. Measured: Nettle with 3 Strength, Cloud r2 → 3 damage to every enemy. Card also prints "Deal 0 damage." Remove the line instead of zeroing it. |
| 🟠 Clemence **Share** | Designed 6 / +3 self / +6 self; built +2 / +4 / +6 self. Text never says the Lust is on Clemence ("Inflict 6 Lust. Inflict 2 Lust."). | (Share is meant to inflict 2 lust on Clemence for every rank, some players will want the self-sabotage)
| 🟠 Clemence **Doubt** | Designed 6 / 8 / 10; built 8 / 10 / 12. ❓ Share and Doubt's designed rank 1 changes nothing, possibly a doc typo. Brand's rank 1 does change the card. | (Doubt is meant to deal 2 more lust to the enemy every rank)
| ❓ Severine **Price** | Doc: "5×3, fifth hit to herself". In the doc's own notation (2×3 = 2 damage, 3 hits) that is 5 damage × 3 hits, which has no fifth hit. Built as five hits of 3 with the fifth on Severine. The self-hit also takes her Strength (2 Str → she loses 5). Text doesn't say the last hit is hers. | (Last hit to her is intended, high reward at growingly high risk)
| 🟡 Cinder **Reckless** | Node text "inflicts 2 Sundered on Cinder"; card gives 3, which matches the design. Fix the node text. |
| 🟡 Severine **Flurry** | Prints "Deal 3 damage. Repeat 3 times." (reads as 4 hits); the base prints "Deal 2 damage 3 times." |
| 🟡 Cassadora **Nail** | "Deal 4 + the debuffs on the target + the debuffs on the target damage." Math is right. |
| 🟡 Cinder **Step** | "If the source is at the front: Deal 3 damage." Math is right (measured 6 from the back). |
| 🟡 Cinder **Plant** | The card text doesn't change. "Does not change position" only shows via the shift label. |

Checked and correct: Brienne Gold / Steel / Bond / Set Stance / Lend; Nettle Wither / Acid / Cloud
(apart from the 0-damage line), Husk, Last Rites, Reaper; Severine Mend, Leech; Cassadora Hex, Twist,
Wane, Foresee, Refract; Cinder Reversal; Clemence Brand, Burden, Pardon.

---

## 4. Card text generator

Hand-written text was skipped on the new cards, and the generator can't phrase them:

- 🟡 **Self-targeted lines print as if aimed at the enemy**: Cut "Deal 3 damage. Deal 6 damage.", Gift
  "Deal 3 damage. Heal an ally…", Quiet Mercy "…Inflict 3 Lust.", Share, Price, Bloodlust, Edge.
- 🟡 **Finish** (the reported one): "Deal 20 if the target's health fraction less 0.5 or the source's
  health fraction less 0.5, otherwise 10 damage."
- 🟡 **Recede** "Deal 6 + the debuffs on the source x 3 damage."; **Gold Standard** "Another an ally
  moves to the front."; "card(s)" throughout (also on live commons: Mark Prey, Fall Back, Focused Mind).

The fix is two things: hand-written `text` (with `{damage:N}` tokens) on the signatures, and teaching
`describeEffectArray` to name the owner ("to Severine" / "on herself") for `targetOverride: "owner"`.

---

## 5. Tree content vs the docs (non-behavioural)

- 🟠 **C.Ex. swaps without a recorded approval.** SKELETON-MAPPING §5 assigns Nettle *first junk
  exhausts*, Severine *below 25% HP: +1 damage*, Cassadora *Challenger*, and reserves **Penny Pincher**
  and **Unspent** "for future characters". Built: Nettle **Penny Pincher**, Severine **Challenger**,
  Cassadora **Investment** (= Unspent). Severine's "+1 damage below 25%" is gone. The swap appears
  first in `TREE-MECHANICS-INVENTORY.md`; no Noodle quote backs it.
- 🟡 Brienne **Taunt** C.Ex3: designed "first hit she takes each combat: Taunt"; built "the first attack
  each combat is drawn to Brienne". Close, but not the same.
- 🟡 **Tailored (U2)**: SKELETON-MAPPING gives it 2 ranks; built with 1 rank at 300.
- 🟡 Ability naming: the node is "Absolution" but the ability is named "Absolve".
- 🟡 Phoenix Dive moves her *first*, then spends Stride, so the move's own Stride is counted in the spend.
  ❓ Intended? (Yes)
- Known and still open: mechanic cards offered before A1 (WIRING-STATUS "Also still deferred").

---

## 6. Suggested order

1. 🔴 engine bugs, each small: Swing / Lance targeting, Drink recursion, Blood Tax "up to", temporary
   Strength, 0-damage line removal, Mortification life loss, Sister Wardrobe on default, the wheel meter
   (keep the meter running and remove only the A1's contribution), Cinder's spend-as-requirement.
2. 🟡 text pass: owner-aware descriptions plus hand text on every signature. Each needs a regression
   test *on the printed string*, since that is what slipped through.
3. 🟠 the outfit rework proper: signatures → passives → A2 lines → default XP → unlock routes. This is
   the big one and it has not started.
4. ❓ the questions above (Price, Share/Doubt rank 1, Bloodlust Strength, Blood Moon name, C.Ex. swaps,
   Phoenix Dive ordering).
