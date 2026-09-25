# CARD-POOL-02 — the second pool pass

2026-09-25. The brief for rebuilding the six pools on the shape Noodle agreed in `POOL-REVIEW-02.md` §4.
His words are `FEEDBACK.md` **B34**; the reasoning is the review; this file holds the rules and the grids.
Read the review first, then `../starters/OUTFITS-LIST.md` (outranks `../../reference/MECHANICS-01.md`),
`../../designBibles/mechanics.md` and `characters.md`. **The bibles win any conflict.**

Status key: ☐ not started · ◐ in progress · ☑ done · ⏸ waiting on Noodle

## Status board

| Step | State |
|---|---|
| 1. Shape and rules (§1) | ☑ agreed 2026-09-25 |
| 2. Heat and Poison (§2) | ☑ Heat locked in his words; defaults below are his to veto |
| 3. Grids: Cinder (§3.1) | ⏸ drafted, waits on his veto |
| 3. Grids: Clemence, Brienne, Nettle, Severine, Cassadora (§3.2–3.6) | ☐ |
| 4. Default signatures, `randomCardCount` removed | ◐ Cinder's drafted (Sortie) |
| 5. Neutrals as the glue tier | ☐ |
| 6. Verdicts and retirements (§4) | ◐ Cinder's cut list |
| 7. Engine asks (§5) | ☐ none built |
| 8. `../starters/` B1 unlock routes, alts off `unlockedFromStart` | ☐ **first job** |
| 9. Cards written, suite, warnings, rates, Crunch | ☐ |

## 1. Hard rules (agreed)

| | |
|---|---|
| Pool per character | **12 C + 8 R** (from 21 / 11). Equal for all six. Broken forms, basics and signatures outside the count |
| Base pool (any outfit) | 6 C + 2 R. The commons carry **no sister tag**: they are the character's verbs and bridges |
| Each alt outfit unlocked (×3) | +2 C (that sister's enablers) · +1 R any pool once unlocked, **cross-party by rule** · +1 R **worn-only, selfish by rule** |
| Where a sister lives | signature + passive + A2 + its two rares + its two unlocked commons |
| Glue rule | every common is a **verb** (produces a shared currency) or a **bridge** (pays off one whoever made it). A payoff reading only a private meter or an own-only status is a rare, an outfit card, or cut. The currency table is `POOL-REVIEW-02.md` §2 |
| Rates | unchanged from `CARD-POOL-01.md` §1.2: starter 6 / common 9 / rare 12+ per energy |
| Reward weights | **85 / 15** (elite 60 / 40; the boss's fourth slot always rare). One slot per party member, kept. A card the deck already holds is weighted down |
| Starting deck | 2 aggressive + 2 defensive basics + 1 signature per character = **15**. `randomCardCount` removed; the default outfit gets a signature |
| Neutrals | about 8, on rate, pure glue; shops and the boss slot only |
| Gates | alts stop being `unlockedFromStart` (run-win / shop / tree-end, `../starters/` B1). Gated cards keep `offerCondition` `outfitUnlocked` / `wearsOutfit` |
| Choose One | exactly one per character, in the base pool, cashing the mechanic |
| Retirement | cut cards go to `honeycomb.retiredCardArray`, definitions to `../../Archive/RETIRED-CARDS-S6x.md` |

## 2. Statuses

### 2.1 Heat — Noodle's rule, verbatim (B34, 2026-09-25)

> Heat: Inflicts 1 lust per stack of heat whenever the character plays a card. Players lose 1 heat whenever they are shifted towards the back of the party, or end their turn behind all other party members.

His reasons, which are requirements: the incentive for Cinder to move back; the mechanical way a player
holds Clemence back from Breaking; positioning matters the whole turn, not just at its end; Anastasia's
golems get a home in a party of three; players interact with it on their own terms, unlike Poison; an
ability that moves Cinder to the back becomes as useful as any other; it can be built on a character with
no guaranteed payoff, so it never reads as delayed damage.

**Defaults for the card pass** — each one line, each his to veto:

1. The Lust is paid **when the card is played, before it resolves**, so the forecast prints it as a cost and
   a vent card does not discount itself.
2. **Per card, not per hit.** An ability is not a card: Backflip costs nothing and cools her.
3. **A broken form is a card.** A Broken fighter keeps paying, which deepens the spiral; Cinder's fallback
   Stumble moves her back and sheds 6, so it cools.
4. **"Shifted towards the back" is per shift, whatever the distance.** One step back and a run to the back
   each lose 1. In a swap, the one who moved back loses 1. An enemy shoving a fighter back counts — forced
   movement gains an upside.
5. **"Behind all other party members" counts golems as party members.** A golem at the front lets the human
   behind it cool. A solo party's one member is always last and cools 1 a turn.
6. **Enemies read the same sentence on their side.** An enemy shifted back, or ending its turn last in its
   line, loses 1. Enemies rarely move, so enemy Heat mostly holds. A golem's move is a card: a hot golem's
   Lust reaches Anastasia through Commander's Burden — `chessmaster/` should check it wants that.
7. **Heat is a debuff.** Gaining it gives Cinder Stride (live rule), Last Rites cleanses it, Artifact blocks
   the first application, it ends with the fight. No maximum.
8. **Tag: Heat is its own lust tag** (Noodle, B34 fifth message: *"Heat (it's own tag)"*). A new `heat`
   entry in `cardTagArray` with `lustTag: true`; the status's Lust carries it, so a hot Cinder builds a
   Heat weakness between runs and Heat gets its own scene bundle. (The Torment default was overruled:
   Torment is being cut.)
9. **Heat applied to an enemy by a card carries `heat`** like any of her Lust.
10. **Only the party applies Heat.** Enemies never inflict it — the Pollen Road idea was withdrawn by Noodle
    the same day (*"Charm is not Heat"*; it does not fit the fey's cool tones and nobility, and powder that
    inflicts heat could read as drug use). Heat on an enemy comes from Cinder's cards alone.

Engine: one status entry — an `onCardPlayed` reaction on the holder (entity hook exists), the enemy side
through `onMovePlayed`, and a small `onShifted` / turn-end listener for the cooling. No new verb.

### 2.2 Poison halves

`decayMode: "halve"` on the Poison entry (the table already names it; today `decrement`). 5 Poison is then
8 damage where it was 14, so Nettle's appliers rise or her consumers (Reap, Rupture, Burst, Quicken Rot)
become the point. Priced in her grid, not here.

## 3. The grids

Columns: **R** rarity · **E** energy · **Gate** base / unlock / worn · **F** Burst / Grind / Tempo · **A** ✓
touches an ally · **From** kept (K), rewritten (RW), new · **Why** the currency-table justification, one
line. Effects are base; upgrades follow the CARD-POOL-01 rule (≈ +30% or −1 cost).

### 3.1 Cinder — party order, Stride, Heat ⏸ draft for veto

Sisters: **Lanes** (default) *front and back both pay* · **Vanguard Plume** damage, forward · **Marshal**
moves and props up allies · **Ashfall** Heat to boons. Her attacks do not move her (live rule); every step
is chosen, and now every step back cools her. The rhythm the kit is built on: **charge (heat, Stride) →
hit while hot → fall back (cool, Stride) → Phoenix Dive forward again.**

**Basics and abilities**

| Card | E | Effect | Note |
|---|---|---|---|
| Lance Thrust (aggressive ×2) | 1 | Deal 9. Gain 1 Heat. | was 1 Sundered |
| Change Places (defensive ×2) | 1 | Swap places with an ally. Whoever is left in front gains 4 tHP. | unchanged; the one who went back cools |
| A1 Backflip | — | Cinder moves to the back. Once a fight. | now cools 1, free |
| A2 Phoenix Dive | — | Spend all Stride. Move to the front. Deal 9 plus the Stride spent per place crossed. | unchanged |

**Signatures** (never drop)

| Outfit | Card | E | Effect | Why |
|---|---|---|---|---|
| default | **Sortie** | 1 | Cinder charges to the front. Deal 8. Then she steps back one place. | hit and withdraw: the whole rhythm on one card; the step back cools 1. Not a carry |
| vanguardPlume | **Rush** | 2 | Deal 12. Apply 2 Heat to the target. | was Deal 8 + 2 Sundered, under rate at 2; her enemy-side Heat source |
| marshal | **Gold Standard** | 1 | Another ally moves to the front. Draw one of their cards. | unchanged |
| ashfall | **Recede** | 1 | Deal 6, plus 3 per Heat on Cinder. | unchanged, reads Heat |

**Outfit passives under Heat**

| Outfit | Passive | Change |
|---|---|---|
| vanguardPlume | Backflip no longer moves her: 3 times a fight, discard a card to draw a card. | as listed; **the drawback is now real** — no free cooling |
| marshal | Ally attacks +1 damage; her damage halved. | unchanged |
| ashfall | **Cinder gains 1 Heat at the start of her turn.** | replaces "attacks move her to the back", which would cool her on every swing |

**The pool**

| Card | R | E | Gate | F | A | Effect | From | Why |
|---|---|---|---|---|---|---|---|---|
| **Base (Lanes)** | | | | | | | | |
| Longspear | C | 1 | base | B | | Deal 6. If Cinder is at the back, deal 6 more. | K | verb; the back lane pays |
| Flame Charge | C | 1 | base | B | | Cinder charges to the front. Deal 5, plus 3 per place crossed. Gain 1 Heat. | RW | verb; produces Heat and Stride |
| Hot Pursuit | C | 1 | base | B | | Deal 6. If Cinder has moved this turn, deal 6 more and draw 1. | K | verb; either direction pays |
| Guard the Rear | C | 1 | base | G | ✓ | Cinder gains 7 tHP. If she is at the back, the front ally gains 7 too. | K | bridge: tHP row |
| Pull Back | C | 1 | base | G | ✓ | An ally moves to the back, loses 8 Lust and gains 4 tHP. | K | bridge: ally-Lust row, cools 1; the hold-Clemence-back card |
| Spend the Spark | C | 1 | base | — | | **Choose one:** gain 8 tHP; or spend all Stride: deal 4 per Stride spent. | K | the Choose One |
| Turn the Line | R | 1 | base | T | ✓ | Reverse the party's order. Draw 2. Deal 4 to ALL enemies. | K | everyone who went back cools |
| Ember Watch | R | 2 | base | G | ✓ | Power. End of turn: at the front, deal 6 to ALL enemies; at the back, ALL allies gain 4 tHP. | K | both lanes pay, for the party |
| **Vanguard Plume** | | | | | | | | |
| Blaze | C | 2 | unlock | B | | Deal 16; 22 if Cinder is at the front. | K | the front lane's big hit |
| Scorch | C | 1 | unlock | B | | Deal 6 twice. Gain 1 Heat. | RW | reckless double hit; heats |
| Beacon Flame | R | 2 | unlock (any pool) | B | ✓ | Deal 10 to ALL enemies. Apply 2 Heat to ALL enemies. | RW | **cross-party:** enemy-Lust row — Flushed, Kiss, Bacchanal, Aphrodisiac, Sensitive |
| Sunspear | R | 2 | worn | B | | Deal 30. Playable only while Cinder is at the front. | K | selfish; the restriction is the identity |
| **Marshal** | | | | | | | | |
| Point of the Spear | C | 1 | unlock | B | ✓ | An ally moves to the front and gains 1 Vanguard. | K | moves an ally, with the payoff on them |
| Relieve | C | 1 | unlock | G | ✓ | Cinder moves to the back. The new front ally gains 8 tHP and 1 Taunt. | K | cools her, walls them |
| Formation Drill | R | 1 | unlock (any pool) | G | ✓ | Power. Whenever an ally moves through the party's order, they gain 3 tHP. | K | **cross-party:** a reader for the position row — Plated Charge, Castling, Sortie all pay |
| Pincer | R | 2 | worn | B | ✓ | Deal 6, plus 6 for every ally who has moved this turn. | K | selfish to Formation |
| **Ashfall** | | | | | | | | |
| Firewalk | C | 1 | unlock | B | | Deal 5 per Heat on Cinder. She moves to the back. | K | cash the fire and cool |
| Pass the Flame | C | 1 | unlock | B | | Move all of Cinder's Heat onto the target. Deal 4. | RW | her verb: her fire becomes theirs |
| Trial by Fire | R | 1 | unlock (any pool) | B | ✓ | ALL allies gain 2 Heat and 2 Strength. | RW | **cross-party:** the party runs hot; every soother and Marshal's cooling read it |
| Cinders to Ash | R | 2 | worn | B | | Deal 8, plus 5 per Heat on Cinder, to ALL enemies. | K | selfish; the payoff for staying hot |

Totals **12 C / 8 R** · Burst 12, Grind 5, Tempo 1, Choose 1 · ally-touching 9 of 20 (was 11 of 32).
Broken forms survive as they are: Change Places → Misstep, Hot Pursuit → Lost Trail, Pincer → Closing Jaws,
fallback Stumble.

**Cut (12)** — each with why, so nothing is re-argued:

| Cut | Why |
|---|---|
| Take Point | a Point of the Spear for herself; Vanguard on Cinder is Blaze's job |
| Kindling | Fleeting Strength and a draw; reads no currency |
| Flurry of Embers | Sunspear says "front" better; the multi-hit is Severine's shape |
| Rotate the Line | the basic Change Places already swaps |
| Battle Orders | Formation Drill reads the same event, for the whole party |
| Double Back | 0-cost energy, the banned shape; Backflip is the free move-back now |
| Rally the Ranks | Strength-to-all overlaps Trial by Fire and Brienne's Rally |
| Reckless Swing | Flame Charge, Scorch and the Ashfall passive heat her; a third heater is a number |
| Burn Bright | draw for Heat; Hot Pursuit and Turn the Line draw already |
| Ember Skin | tHP per Heat; first back in if Ashfall reads as all burst |
| Ashen Cloak | → **neutral candidate "Cool Head"** (lose all Heat, gain 3 tHP per stack): if enemies apply Heat, a vent belongs to everyone |
| Phoenix Heart | a selfish power; Recede and Cinders to Ash already pay Heat |

### 3.2 Clemence ☐ · 3.3 Brienne ☐ · 3.4 Nettle ☐ · 3.5 Severine ☐ · 3.6 Cassadora ☐

Next in that order. Clemence's list is where the Abbess line meets a hot Cinder (Kindled Want, Ordeal,
Sanctify, Stay With Me) and where Poison halving does not reach; Nettle's is where it does.

## 4. Verdicts

Cinder's are in §3.1. The other five follow their grids. Retired definitions go to
`../../Archive/RETIRED-CARDS-S6x.md` with the replacement named, as `RETIRED-CARDS-S33.md` did.

## 5. Engine asks, and the Friday housekeeping list

Engine, from the grids:

- **Heat**: one status entry (§2.1), plus the cooling listener. `shiftEntity` already fires `onShifted`
  with distance and direction is derivable from ranks. Plus the `heat` lust tag.
- **Poison `halve`**: one field.
- **Sortie**: `shiftParty` `front` then `backward` (both exist).
- **Reward dedupe**: a held-card weight in `rollCardReward` (`POOL-REVIEW-02.md` §1).
- **Default signature**: `cardAdditionArray` on the default outfit, as the alts have; `randomCardCount` removed.

**Housekeeping Noodle named for the desktop session (2026-09-25, B34 fifth message).** In the order that
unblocks the most. Each is a table edit and a suite check; none needs a design decision except the first.

| # | Job | Where | Size |
|---|---|---|---|
| 1 | **The lust tags: four survive.** His list is Venom, Charm, Heat, Penance. Cut: Torment (0 enemy moves, nothing to retag), Restraint (**8 enemy moves**), Exposure (**6 enemy moves + Clemence's 5 outgoing cards**: Heavenly Gaze, Wanton Gaze, Confession, Let Go, Soft Words, which need a tag or none). His afterthought — the fey from Charm to Exposure — would instead cut Charm (**15 moves**, and the charm writing rules that run through `lust_events/IDEAS.md`) and keep Exposure. **⏸ one word from him: Charm or Exposure for the fey.** Measured with `tools/lust-share.js`. | `honeycomb-content-cards.js` (`cardTagArray`), `honeycomb-content-enemies.js`, `lust_events/` B17 and B20 | small once decided |
| 2 | `heat` added to `cardTagArray` with `lustTag: true` | content-cards | one entry |
| 3 | `../starters/` B1: the three unlock routes, and the 18 alts off `unlockedFromStart` | content-characters, progression | the one engine job |
| 4 | `tuning.reward`: 85 / 15, elite 60 / 40, boss fourth slot rare, held-card weight | tuning, combat | small |
| 5 | Poison `decayMode: "halve"` — **after Nettle's grid**, since her appliers are priced on it | content-statuses | one field |
| 6 | The Heat status entry and Cinder's cards — **after his veto of §3.1** | content-statuses, content-cards | the first character |
| 7 | Stale lines elsewhere: `../starters/STARTER-LIST.md` (Cinder "attacks apply +1 Vulnerable to herself"), `../starters/OUTFITS-LIST.md` Cinder (Ashfall passive, "Sundered"), `../../reference/MECHANICS-01.md` (reference only, leave) | docs | minutes |

## 6. Done means

- `../../tools/test-honeycomb.js` green; `honeycomb.warnings.report()` 0 active; `duplicateCardRules` clean;
  `cardFit` clean; a warning rule for the §1 shape (12 / 8 per character, one Choose One).
- `../../tools/budget-audit.js` baseline output ≥ 12 a turn on early normals, then an All the Crunch run
  before and after (`../../balance_tests/`).
- Every surviving card has a prompt line or is listed as owed; every cut card is retired, not deleted.
- `FEEDBACK.md` B34 and `CATCH-UP.md` updated as each character lands, not at the end.
