# CARD-POOL-02 — the second pool pass

2026-09-25. The brief for rebuilding the six pools on the shape Noodle agreed in `POOL-REVIEW-02.md` §4.
His words are `CARD-POOL.md` **B34**; the reasoning is the review; this file holds the rules and the grids.
Read the review first, then `../relics/OUTFITS-LIST.md` (outranks `../reference/MECHANICS-01.md`),
`../designBibles/mechanics.md` and `../designBibles/characters.md`. **The bibles win any conflict.**

Status key: ☐ not started · ◐ in progress · ☑ done · ⏸ waiting on Noodle

## Status board

| Step | State |
|---|---|
| 1. Shape and rules (§1) | ☑ agreed 2026-09-25 |
| 2. Heat, Poison, the lust tags (§2) | ☑ Heat locked in his words; Poison halving and the tag set signed off; the §2.1 defaults are his to veto |
| 3. Grids: all six (§3.1–3.6) | ⏸ **all drafted**; he is holding his vetoes for now; Severine revised on his read (no Marked, no Sundered) |
| 3. Neutrals (§3.7) | ⏸ drafted on the colourless precedent, 7 C / 5 R, with his Possibility and Devil's Number in place of Shared Resolve and Cool Head |
| 4. Default signatures, `randomCardCount` removed | ◐ Cinder's drafted (Sortie) |
| 5. Neutrals as the glue tier | ☐ |
| 6. Verdicts and retirements (§4) | ◐ Cinder's cut list |
| 7. Engine asks (§5) | ☐ none built |
| 8. `../relics/` B1 unlock routes, alts off `unlockedFromStart` | ☐ **first job** |
| 9. Cards written, suite, warnings, rates, Crunch | ☐ |

## 1. Hard rules (agreed)

| | |
|---|---|
| Pool per character | **12 C + 8 R** (from 21 / 11). Equal for all six. Broken forms, basics and signatures outside the count |
| Base pool (any outfit) | 6 C + 2 R. The commons carry **no sister tag**: they are the character's verbs and bridges |
| Each alt outfit unlocked (×3) | +2 C (that sister's enablers) · +1 R any pool once unlocked, **cross-party by rule** · +1 R **worn-only, selfish by rule** |
| Where a sister lives | signature + passive + A2 + its two rares + its two unlocked commons |
| Glue rule | every common is a **verb** (produces a shared currency) or a **bridge** (pays off one whoever made it). A payoff reading only a private meter or an own-only status is a rare, an outfit card, or cut. The currency table is `POOL-REVIEW-02.md` §2 |
| Rates | unchanged from `../Archive/demo1/rework/cards/CARD-POOL-01.md` §1.2: starter 6 / common 9 / rare 12+ per energy |
| Reward weights | **85 / 15** (elite 60 / 40; the boss's fourth slot always rare). One slot per party member, kept. A card the deck already holds is weighted down |
| Starting deck | 2 aggressive + 2 defensive basics + 1 signature per character = **15**. `randomCardCount` removed; the default outfit gets a signature |
| Neutrals | **the colourless tier** (§3.7): 7 C / 5 R, agnostic by construction, priced above rate, never in an ordinary reward; every shop stocks one, the boss's fourth slot rolls a neutral rare half the time; the tier may pilot a mechanic a future character will own |
| Gates | alts stop being `unlockedFromStart` (run-win / shop / tree-end, `../relics/` B1). Gated cards keep `offerCondition` `outfitUnlocked` / `wearsOutfit` |
| Choose One | exactly one per character, in the base pool, cashing the mechanic |
| Retirement | cut cards go to `honeycomb.retiredCardArray`, definitions to a new retired-cards file in `../Archive/demo1/Archive/` (`../Archive/demo1/Archive/RETIRED-CARDS-S33.md` is the model) |

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
   Lust reaches Anastasia through Commander's Burden — `../Archive/demo1/chessmaster/` should check it wants that.
7. **Heat is a debuff.** Gaining it gives Cinder Stride (live rule), Last Rites cleanses it, Artifact blocks
   the first application, it ends with the fight. No maximum.
8. **Tag: Heat is its own lust tag, and its weakness is for show.** A new `heat` entry in `cardTagArray`
   with `lustTag: true`; the status's Lust carries it, so a hot Cinder builds a Heat weakness between runs
   and Heat gets its own scene bundle. **The weakness rank never multiplies Heat's Lust** (Noodle, B34
   sixth message: *"Heat weakness is entirely for show and unlocking lust events. Heat is entirely balanced
   around dealing 1 lust per turn, if we made it increase with the weakness it'd hit 2/turn instantly"*).
   Engine: a per-tag flag the rank multiplier skips; rank-ups still fire events.
9. **Heat applied to an enemy by a card carries `heat`** like any of her Lust.
10. **Enemies may inflict Heat; no region is built on it.** Noodle's sixth message makes Venom, Exposure and
    Heat the legal act-1 options, *"legal but not a focus"*. So an act-1 enemy may carry a Heat move, but the
    fey's identity is Exposure (his fifth message withdrew Heat as their theme: *"Charm is not Heat"*, the
    cool tones and nobility, and powder that inflicts heat could read as drug use). Heat on an enemy comes
    mostly from Cinder's cards; the Lust it causes carries `heat` whoever applied the status.
11. **Heat-tagged Lust comes only from the status.** The one exception he allows (seventh message): if the
    Abbess line cannot do its job by applying the status, Clemence may deal Heat-tagged Lust directly
    *"until I'm ready to do Penance events"*. Try the status first (§3.2).

Engine: one status entry — an `onCardPlayed` reaction on the holder (entity hook exists), the enemy side
through `onMovePlayed`, and a small `onShifted` / turn-end listener for the cooling. No new verb.

### 2.2 Poison halves

`decayMode: "halve"` on the Poison entry (the table already names it; today `decrement`). 5 Poison is then
8 damage where it was 14, so Nettle's appliers rise or her consumers (Reap, Rupture, Burst, Quicken Rot)
become the point. Priced in her grid, not here. **Signed off as a MUST** (B34, sixth message).

### 2.3 The lust tags for the second demo — SIGNED OFF (B34, sixth message)

What each represents is in his words in `../designBibles/story.md` §11. What a card in this brief may carry:

| Tag | In the demo | Who inflicts it | On cards here |
|---|---|---|---|
| **Venom** | yes — the Thorn Arbor's focus (act1-flora) | Nettle; Act1-B enemies | Nettle's nine venom cards keep it |
| **Exposure** | yes — the Pollen Road's focus (act1-fey), **replacing Charm there** | Act1-C enemies; Clemence's outgoing Lust | Clemence's five enemy-facing cards keep it |
| **Heat** | yes — the status, legal for any act-1 enemy, never a focus | the Heat status, wherever it sits | Cinder; the weakness is for show (§2.1 default 8) |
| **Penance** | yes — Clemence only, **on herself** | Clemence, on herself | her self-Lust already. **Her Abbess cards apply the Heat status to allies instead of Lust** (seventh message), so nothing else is owed under Penance |
| Charm | **no** — act 2, masculine enemies | — | scrubbed everywhere in act 1 (MUST) |
| Torment | **no** — act 2, electric and spanking; **Brienne's early access is the one exception** (§3.3) | Brienne, on herself | the Lust she takes onto herself |
| Restraint | **cut outright** (seventh message: *"zero issues dumpstering it completely"*) | — | nothing; 8 enemy moves retagged (E14) |

The Mushroom Frontier (act1-A) focuses on health damage, not Lust.

**The writing scope of the second demo, in his words** (seventh message): *"Lust events for each character
for Venom, Exposure, Heat. Torment events for Brienne, Penance events for Clemence."* That is what the cards
here may build a weakness toward, and nothing else.

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

### 3.2 Clemence — Lust / Broken / Devotion ⏸ draft for veto

Sisters: **Mercy** (default) *healing in general* · **Devotee** make Breaking hard · **Ecstatic** rush her
own Break · **Abbess** heat the others. Devotion fills 1:1 on health and tHP given. **Rules settled before
the grid:** the Abbess line applies **Heat** to allies, not Lust (seventh message) — the ally runs hot, pays
per card and cools by moving back, which is what Cinder's Ashfall reads and Brienne's Bastion sponges;
**Absolution loses its soothe** (*"the not-clement exception must go"*); she never soothes an ally; her own
Lust is spent only by rare broken forms (B18); her healing is off-rate and *incredible*, her Lust riders
are the sacrifice; Penance on herself, Exposure on enemies; Poison halving does not reach her. Broken
forms keep the session-55 rule (starter and common forms at the rare rate, rare forms spend her Lust), and
every card she keeps already has one, so the pass cuts her form count from 35 to 23.

**Where her glue is now.** Her givers were always the most numerous in the pool; what was missing were
readers. Now: Heat on an ally is read by Cinder's payoffs and Brienne's sponge; her healing is read by
Severine's Blood Debt; her Exposure Lust is read by Nettle's Kiss, Flushed and Aphrodisiac; Sensitive
amplifies everyone's Lust including Heat's. And she reads back: Stay With Me and Sheltering Grace pay on an
ally's Lust, so a hot Cinder is her best customer.

**Basics and abilities**

| Card | E | Effect | Note |
|---|---|---|---|
| Tempt (aggressive ×2) | 1 | Inflict 6 Lust. | unchanged, Exposure |
| Offering (defensive ×2) | 1 | Heal an ally for 6. | unchanged |
| A1 Absolution | — | **Clemence takes 10 Lust. ALL allies heal 5. Once a rest.** | rebuilt: she pays, they heal, nobody is soothed |
| A2 One with Nothing | — | Lose all Devotion, then lose half that much life. Once a fight. | unchanged |

**Signatures** (never drop)

| Outfit | Card | E | Effect | Why |
|---|---|---|---|---|
| default | **Mercy** | 1 | The most hurt ally heals 12. Clemence gains 6 Lust. | graduated from the pool: the sister's name, healing in general, not a carry |
| devotee | **Blessed Pain** | 2 | An ally heals 20. | as listed; the register B18 asked for |
| ecstatic | **Edge** | 0 | Clemence gains 6 Lust. | as listed; the 0 is priced by the Lust |
| abbess | **Guided Hand** | 1 | An ally gains 2 Strength and 2 Heat. | was 6 Lust; now the status |

**Outfit passives and A2**

| Outfit | Passive | A2 | Note |
|---|---|---|---|
| devotee | Prevent all self-inflicted Lust. | Spend all Devotion; give tHP equal to the amount lost, split across allies. | ⏸ **as listed, but it makes every Lust rider free**, which is the sacrifice B18 asked for. Proposed: *halve* her self-inflicted Lust instead, so Devotee is slow to Break rather than unable |
| ecstatic | She cannot be soothed. Lust she gains while Broken is dealt at random among allies and enemies. | Spend all Devotion; gain that much Lust. | as listed |
| abbess | Immune to Lust inflicted by enemies. | Spend all Devotion; each other ally gains Heat equal to a fifth of it. | A2 was "gains that much Lust"; the status now, scaled |

**The pool**

| Card | R | E | Gate | F | A | Effect | From | Why |
|---|---|---|---|---|---|---|---|---|
| **Base (Mercy)** | | | | | | | | |
| Mending Word | C | 1 | base | G | ✓ | An ally heals 10. Clemence gains 4 Lust. | RW 7→10 | the heal, off-rate as asked |
| Sheltering Grace | C | 1 | base | G | ✓ | An ally gains 9 tHP, or 12 if they have Lust. Clemence gains 4 Lust. | K | tHP row, and it reads their Lust |
| Answered Prayer | C | 1 | base | — | ✓ | **Choose one:** an ally heals 10; or spend 8 Devotion: gain 1 Energy and draw 2. | RW 7→10 | the Choose One |
| Heavenly Gaze | C | 1 | base | B | | Inflict 9 Lust. If Clemence has more Lust than the target, draw 1. | K | verb: Exposure for Nettle's readers |
| Stay With Me | C | 1 | base | G | ✓ | An ally gains tHP equal to their Lust, up to 12. | K | bridge: a hot Cinder, a heated ally, a sponge Brienne |
| Confide | C | 1 | base | T | | Draw 3. Clemence gains 5 Lust. | K | the exchange her whole kit is made of |
| Miracle | R | 2 | base | G | ✓ | An ally is restored to full health. Clemence gains 10 Lust. Exhaust. | RW | *"restore target to full hp for 2 mana"* — his register; broken form Wonder spends her Lust |
| Font of Grace | R | 2 | base | G | ✓ | Power. At the start of your turn, the most hurt ally heals 5 and Clemence gains 3 Lust. | K | the healing engine |
| **Devotee** | | | | | | | | |
| Bear the Weight | C | 1 | unlock | G | ✓ | An ally and Clemence each gain 7 tHP. Clemence gains 3 Lust. | K | tHP on two bodies |
| Blessed Endurance | C | 1 | unlock | G | | Clemence gains 10 tHP and 4 Lust. | K | her own break line, raised |
| Blessing | R | 1 | unlock (any pool) | G | ✓ | Power. Whenever an ally gains tHP, they gain 2 more. | K | **cross-party:** every tHP giver in the party |
| Sanctuary | R | 2 | worn | G | ✓ | ALL allies gain 10 tHP. Clemence gains 6 Lust. | K | the wall build's sweep; broken form Sanctum spends her Lust |
| **Ecstatic** | | | | | | | | |
| Let Go | C | 1 | unlock | B | | Clemence gains 12 Lust. Inflict Lust equal to half of Clemence's on an enemy. | K | the rush, and the payoff for it |
| Confession | C | 1 | unlock | B | | Inflict 6 Lust and 2 Sensitive. Clemence gains 4 Lust. | K | Sensitive amplifies every Lust source in the party, Heat included |
| Rapture's Gift | R | 1 | unlock (any pool) | B | ✓ | Power. When Clemence Breaks, ALL other allies gain 2 Strength and 8 tHP. | K | **cross-party:** her Break is their turn |
| Surrender | R | 1 | worn | B | ✓ | ALL allies heal 6. Then Clemence gains Lust until she Breaks. Exhaust. | K | selfish; broken form Revelation |
| **Abbess** | | | | | | | | |
| Sanctify | C | 1 | unlock | B | ✓ | An ally gains Sanctified. Clemence gains 5 Lust. | K | the razor's edge: they keep their cards past the Break |
| Ordeal | C | 1 | unlock | B | ✓ | An ally gains 3 Heat and 10 tHP. | RW | was 10 Lust; the gift a hot Cinder wants |
| Shared Fever | R | 1 | unlock (any pool) | B | ✓ | Each other ally gains 2 Heat. Gain 2 Energy. | RW | **cross-party:** the party runs hot for tempo; Brienne sponges it, Nettle draws it out |
| Communion | R | 2 | worn | B | ✓ | ALL allies gain Sanctified. Clemence gains 10 Lust. Exhaust. | K | selfish to Sanctuary; broken form Rapturous Host |

Totals **12 C / 8 R** · Burst 8, Grind 9, Tempo 2, Choose 1 · ally-touching 15 of 20 (was 19 of 32; the
share went up). Broken forms: every kept card keeps its own; the fallback stays Rapture.

**Cut (11)**

| Cut | Why |
|---|---|
| Mercy | not cut — graduated to the default signature |
| Lay On Hands | a party heal at 2; Font of Grace and Miracle are the sweeps |
| Martyr's Vow | a power that reads her Lust rising *and* falling; Font of Grace heals more simply |
| Anoint, Fallen Vigil | heals gated on a Broken ally; Sanctify is what an Abbess does about a Break |
| Kindled Want | Guided Hand, the signature, is Strength and Heat already |
| Penitent's Draw | Heat for cards; Shared Fever does it for the party |
| Broken Saints | Rapture's Gift pays the Break for everyone |
| Fervent Prayer | 0-cost energy, the banned shape, even priced in Lust; Edge is her one 0 |
| Wanton Gaze, Soft Words | Lust bodies; Heavenly Gaze and Tempt are the Exposure verbs |
| Ecstasy | an engine that needs her Broken; Surrender is the rush and the worn rare |

**Engine.** Heat on allies from a card: `applyStatus` with the entry (§2.1). The Abbess A2's "a fifth" is a
number for tuning. Nothing else new.

### 3.3 Brienne — Temporary HP / Resolve / the sponge ⏸ draft for veto

Sisters: **Oath** (default) *tHP carried into your turn pays* · **Siegeplate** tHP is a weapon · **Bastion**
the wall, and the one who takes it home · **Almoner** tHP is currency. Resolve fills from damage taken
(live) and, in Bastion, from Lust she takes onto herself.

**Why the sponge lives here** (his idea, B34 sixth message; each line is a test a card can fail): the party
needs one Lust sink and it must be the wall, not a healer, because *moving* Lust is zero-sum and cannot be
stalled on where healing could; Unshakeable caps what she holds at her maximum health and Lust carries to
the next fight, so a full sponge pays at the next door; Resolve already reads damage taken, so Lust she
takes feeds Aegis and party tHP, which is what holds her own margin; and it is the reader Heat needed — a
hot Cinder, a heated Abbess party and a Bastion Brienne are one loop with no soothe in it. **Every point of
Lust she takes onto herself lands as `torment`**, whatever it wore on the ally: the masochism reading, and
how she teaches Torment alone. **Not this:** her Lust as a damage payoff — most dangerous before she Breaks
is Cinder's; Brienne's payoff is the wall.

**Basics and abilities**

| Card | E | Effect | Note |
|---|---|---|---|
| Sword Strike (aggressive ×2) | 1 | Deal 6. | unchanged |
| Brace (defensive ×2) | 1 | Gain 6 tHP. | unchanged |
| A1 Dig In | — | Gain 12 tHP. Once a fight. | unchanged |
| A2 Aegis | — | Spend all Resolve. The party gains that much tHP. End the turn. | unchanged; the outfits swap it as listed below |

**Signatures** (never drop)

| Outfit | Card | E | Effect | Why |
|---|---|---|---|---|
| default | **Kept Word** | 1 | Deal 6, plus the tHP you carried into this turn. | graduated from the pool: the whole Oath idea on one card, not a carry |
| siegeplate | **Plate Edge** | 1 | Deal 4. Gain 4 tHP. | as listed |
| bastion | **Headstrong** | 3 | Deal 18. Costs 1 more each time Brienne has lost health this fight. | as listed; a blow taken as Lust keeps it cheap |
| almoner | **Incredible Wealth** | 0 | Spend all your tHP. Your next card costs 1 less for every 5 spent. | as listed; the 0 is priced by her whole shield |

**Outfit passives and A2**

| Outfit | Passive | A2 |
|---|---|---|
| siegeplate | Her tHP is reduced by attacks only after her base HP reaches 0. | Spend all Resolve. Deal that much to the front enemy. |
| bastion | **Big Sister Aura:** whenever another ally would gain Lust, half of it lands on Brienne instead, as Torment. Lust she takes onto herself builds Resolve 1:1. *(replaces "Resolve twice as fast, only from tHP lost")* | Disabled. Once a fight, if she would Break, lose all Resolve and gain half as tHP. |
| almoner | She loses all tHP at the end of her turn; draws one more card a turn. | Spend all Resolve. Each other ally soothes 4 and spends 4 tHP if they have it. |

**The pool**

| Card | R | E | Gate | F | A | Effect | From | Why |
|---|---|---|---|---|---|---|---|---|
| **Base (Oath)** | | | | | | | | |
| Bulwark | C | 2 | base | G | ✓ | ALL allies gain 7 tHP. | K | the party wall; tHP row for everyone |
| Intercept | C | 1 | base | G | ✓ | An ally gains 8 tHP. Brienne gains 1 Taunt. | K | bridge: gold on them, the hits on her |
| Shield Bash | C | 1 | base | B | | Gain 5 tHP, then deal damage equal to half your tHP. | K | her attack reads her tHP, which anyone can feed |
| Weigh the Cost | C | 1 | base | — | | **Choose one:** gain 9 tHP; or spend 8 Resolve: gain 1 Energy and draw 2. | K | the Choose One; Resolve cashed |
| Willing Target | C | 1 | base | G | ✓ | An ally loses up to 8 Lust. Brienne gains that much Lust and that much Resolve. | new | the sink; ally-Lust row; 8 Resolve is one Weigh the Cost |
| Ransom | C | 1 | base | T | ✓ | Spend up to 8 of an ally's tHP, 4 at a time. Draw 1 per 4 spent; if 8, gain 1 Energy. | K | the one payoff in the game for tHP on an ally: her cleanest bridge |
| Stand Fast | R | 1 | base | G | | Power. At the start of your turn, gain 5 tHP. | K | the engine; "carried" needs tHP every turn |
| Promise Kept | R | 1 | base | B | | Deal twice the tHP you carried into this turn. | K | the Oath payoff |
| **Siegeplate** | | | | | | | | |
| Lend Steel | C | 1 | unlock | B | ✓ | An ally gains 7 tHP and 1 Armament. | K | their attacks read their tHP |
| Heavy Swing | C | 1 | unlock | B | | Deal 8. If you have 10 or more tHP, deal 8 again. | K | damage keyed to tHP held |
| Forge the Line | R | 2 | unlock (any pool) | B | ✓ | ALL allies gain 6 tHP and 1 Armament. | K | **cross-party:** everyone's attacks read their tHP |
| Crushing Weight | R | 2 | worn | B | | Deal 4 plus half your tHP to ALL enemies. | K | selfish; her tHP as a sweep; broken form exists |
| **Bastion** | | | | | | | | |
| Living Stress-Relief | C | 1 | unlock | G | | Gain 6 tHP and 1 Taunt. Until your next turn, damage Brienne takes lands on her as Lust instead. | new | the conversion, one enemy turn: no health lost, margin spent |
| Punching Bag Session | C | 1 | unlock | G | | Gain tHP equal to Brienne's Lust, up to 12. Gain 1 Taunt. | new | the sponge becomes the wall, at common rate |
| Wake-Up Kiss | R | 1 | unlock (any pool) | G | ✓ | A Broken ally recovers and loses all their Lust. Brienne gains that much. Exhaust. | new | **cross-party:** reads the Broken-ally row, the party's only un-break; under the cap it can Break her instead |
| Suffer the Blows | R | 0 | worn | G | | Gain 1 Taunt. Gain 10 tHP for each enemy. | K | his card (P23); the 0-cost wall; worn-only |
| **Almoner** | | | | | | | | |
| Alms | C | 1 | unlock | G | ✓ | Spend all your tHP. ALL allies lose that much Lust. | K | her shield buys the party's Lust off, at the price of the whole shield |
| Gilded Strike | C | 1 | unlock | B | | Spend all your tHP. Deal twice that much. | K | the currency's payoff |
| Tribute | R | 1 | unlock (any pool) | B | ✓ | Every ally spends all their tHP. Deal that much to the front enemy; draw 1 per 10 spent. | K | **cross-party:** everyone's tHP becomes damage and cards |
| Reliquary | R | 1 | worn | T | | Power. When your tHP decays or is lost, gain 1 Energised per 6 lost (at most 2 a turn). | K | selfish: the engine under the Almoner passive |

Totals **12 C / 8 R** · Burst 8, Grind 9, Tempo 2, Choose 1 · ally-touching 9 of 20 (was 10 of 32).
Broken forms survive: Brace → Backs to the Wall, Bulwark → Huddle, Crushing Weight → Weight of Regret,
fallback Buckle.

**Two numbers for the veto.** Wake-Up Kiss hands her the whole load; "half that much" is the gentler
version. Suffer the Blows is 30 tHP for 0 against three enemies and was built in session 55 on his spec;
it is kept as written and the Crunch prices it.

**Cut (15)**

| Cut | Why |
|---|---|
| Kept Word | not cut — graduated to the default signature |
| Oath of Iron | Entrenched on a common; Stand Fast is the carried-tHP engine |
| Unbroken Oath | engine and payoff on one power; Stand Fast and Promise Kept split the job |
| Tempered Plate | Armament for herself; Lend Steel and Forge the Line give it where it reads |
| Riposte | Gilded Strike is the same idea, bigger |
| Plated Charge | move and hit is Cinder's shape |
| Unstoppable | a selfish power; Crushing Weight pays her tHP already |
| Challenge | 10 tHP and Taunt: Dig In, Intercept and Suffer the Blows cover it |
| Iron Retort, Thorn Armour | retaliation is a number on a wall, not an identity |
| Shield Wall | Suffer the Blows is the wall rare now |
| Rally | party Strength is Trial by Fire's; Pay the Toll went too |
| Tithe | 0-cost energy, the banned shape |
| Pay in Kind | Gilded Strike with a fixed number |
| Pay the Toll | Fleeting Strength for tHP; Tribute pays the same spend louder |
| Largesse | Intercept and Bulwark already move gold to allies |

**Engine.** `lust` reading a tally exists (Absolve). Damage landing as Lust is a sibling of the
`replaceSelfDamage` hook Night Court used, on incoming damage. Recover from Broken is a primitive. The
Bastion passive is an outfit-level `modifyLustGained`-style hook on the other allies.

### 3.4 Nettle — Poison / Souls, on halving ⏸ draft for veto

Sisters: **Timing** (default) *Poison now or Poison later* · **Rotsinger** consume · **Sporemother** spread ·
**Nightshade** Poison carries Lust. Souls come from exhausting (Rotsinger: from consuming instead).

**What halving does to her.** 7 Poison used to be 28 damage over seven turns; it is 11 over three (7, 3, 1).
A 3 barely changes (6 → 4). So Poison stops being a clock and becomes **a charge you set and detonate**:
appliers go up about a third, and the consumers (Rupture, Burst, Pop) and the detonators (Quicken Rot,
Death Knell) are where the value is realised. That is a sharper Nettle than the one the sim called the
least-drafted package in the game — *apply big, cash before it fades* — and Timing, the default, is exactly
"when". Every venom card keeps its tag. Numbers below are the first guess; `../tools/budget-audit.js`
and the Crunch decide.

**Basics and abilities**

| Card | E | Effect | Note |
|---|---|---|---|
| Wither (aggressive ×2) | 1 | Deal 4. Apply 1 Poison. | unchanged |
| Last Rites (defensive ×2) | 1 | Remove all negative statuses from an ally. | unchanged — and it now puts a hot Cinder out in one card, which is a reason to bring her |
| A1 Blight | — | Inflict Poison equal to your Souls (not spent). Once a rest. | unchanged |
| A2 Undead Army | — | Spend all Souls. Deal 1 damage to a random enemy per Soul spent. | unchanged |

**Signatures** (never drop)

| Outfit | Card | E | Effect | Why |
|---|---|---|---|---|
| default | **Quicken Rot** | 1 | The target's Poison acts now. Apply 3 Poison. | graduated from the pool: "now or later" on one card; under halving it cashes half the charge |
| rotsinger | **Pop** | 1 | Consume 1 Poison. Deal 12. | as listed |
| sporemother | **Spore** | 1 | Apply 3 Poison. If the target was already Poisoned, apply 3 to every other enemy too. | as listed, +1 |
| nightshade | **Kiss** | 1 | The target loses all its Lust and gains that much Poison. | as listed; reads Lust any ally put there |

**Outfit passives and A2**

| Outfit | Passive | A2 | Change |
|---|---|---|---|
| rotsinger | Souls come from consuming Poison instead of exhausting. | Spend all Souls; the party heals 1 per Soul. | as listed |
| sporemother | **When a poisoned enemy falls, its Poison spreads to ALL other enemies.** | Spend all Souls; 1 Poison to a random enemy per Soul. | **replaces "Poison heals allies instead of damaging enemies"** (the audit's WATCH); Pandemic the card goes with it |
| nightshade | All Poison inflicts Lust instead of damage. | Spend all Souls; enemies with Poison take that much Lust. | as listed |

**The pool**

| Card | R | E | Gate | F | A | Effect | From | Why |
|---|---|---|---|---|---|---|---|---|
| **Base (Timing)** | | | | | | | | |
| Blight Needle | C | 1 | base | B | | Deal 5. Apply 4 Poison. | RW +1 | verb: hit and charge |
| Venom Sac | C | 1 | base | G | | Apply 9 Poison. Exhaust. | RW +2 | the big charge; the exhaust is a Soul |
| Grave Choice | C | 1 | base | — | | **Choose one:** apply 7 Poison; or spend 3 Souls: gain 1 Energy and draw 2. | RW +2 | the Choose One |
| Reap | C | 1 | base | B | | Deal 5, plus 2 per Poison on the target. | K | reads the charge without spending it |
| Draw Out | C | 1 | base | G | ✓ | An ally loses up to 8 Lust. The front enemy gains that much Poison. | K | bridge: a hot Cinder's or a heated ally's Lust becomes her charge (the one soothe left outside Brienne's kit; it ends fights, it cannot stall them) |
| Plague Bearer | C | 1 | base | G | ✓ | This turn, an ally's attacks also inflict 2 Poison. | K | bridge: any ally's hits charge the target |
| Death Knell | R | 2 | base | B | | Every enemy's Poison acts now, twice. | K | the detonator: 8 becomes 12 now and leaves 2 |
| Rot From Within | R | 1 | base | G | | Double the target's Poison. Exhaust. | K | the enhancer, and a Soul |
| **Rotsinger** | | | | | | | | |
| Rupture | C | 1 | unlock | B | | Consume all Poison on an enemy. Deal twice that much. | K | the consume |
| Putrefy | C | 1 | unlock | B | | Deal 3, plus 3 per negative status on the target. | K | reads every debuff anyone applied |
| Catharsis | R | 2 | unlock (any pool) | B | | Each enemy takes damage equal to its Poison, plus 3 per debuff it has. | K | **cross-party:** Weak, Sundered, Frail, Marked, Sensitive, Heat all count |
| Burst | R | 1 | worn | B | | Consume all Poison on an enemy. Deal that much to ALL enemies. | K | selfish consume |
| **Sporemother** | | | | | | | | |
| Infect | C | 1 | unlock | G | | Apply 4 Poison and 2 Infected. | RW +1 | every ally's hits keep charging it |
| Miasma | C | 2 | unlock | G | | Apply 4 Poison and 1 Weak to ALL enemies. | RW +1 | the sweep, and the Weak that Wasting used to read; broken form Miasmic Haze |
| Rot Garden | R | 2 | unlock (any pool) | G | ✓ | Power. Whenever any ally's attack wounds an enemy, it gains 1 Poison. | K | **cross-party:** the whole party charges |
| Creeping Plague | R | 2 | worn | G | | Apply 5 Poison and 2 Sundered to ALL enemies. | RW +1 | selfish sweep |
| **Nightshade** | | | | | | | | |
| Intoxicate | C | 1 | unlock | B | | Apply 4 Poison and 2 Intoxicated. | RW +1 | Poison ticks as Lust |
| Flushed | C | 1 | unlock | B | | Inflict 4 Lust, plus twice the target's Poison. | K | the Venom payoff |
| Aphrodisiac | R | 1 | unlock (any pool) | B | ✓ | Power. Whenever an enemy takes Lust from any ally, it gains 1 Poison. | K | **cross-party:** Clemence's Rapture and Cinder's enemy Heat charge it |
| Bacchanal | R | 2 | worn | B | | Apply 2 Intoxicated to ALL enemies. Each takes Lust equal to its Poison. | K | selfish; broken form Last Bloom |

Totals **12 C / 8 R** · Burst 10, Grind 9, Choose 1 · ally-touching 5 of 20 (was 5 of 32). Broken forms
survive: Wither → Pollen Burst, Miasma → Miasmic Haze, Bacchanal → Last Bloom, fallback Wither Within.
**Souls** now come from Venom Sac, Rot From Within and Cassadora's Fence if it lands as a neutral (§3.7);
if the audit finds Timing starved, Death Knell gains Exhaust.

**Cut (11)**

| Cut | Why |
|---|---|
| Quicken Rot | not cut — graduated to the default signature |
| Corpse Pyre | exhaust-for-damage; Rot From Within and Venom Sac are the Soul sources now |
| Wasting | its Weak rider is read by Putrefy and Catharsis already |
| Fester | Festering doubles what Rot From Within already doubles |
| Contagion | Spore, the signature, is the spread |
| Scatter Spores, Spore Cloud | sweeps; Miasma and Creeping Plague are the sweeps |
| Pandemic | its rule is the Sporemother passive now |
| Pollen Kiss | Wither already hits and poisons; its tax form stays pointed from Wither |
| Love Bite, Lotus Smoke | Sensitive is Clemence's setup; Lotus Smoke is a Lust sweep the Nightshade A2 does better |
| Heady Spores | Aphrodisiac is the same bridge the other way round and reads more sources |

### 3.5 Severine — Blood / Thirst ⏸ draft for veto

Sisters: **Wounded** (default) *being damaged feeds all three* · **Huntress** hunt the wounded · **Crimson
Covenant** pay in blood · **Blood Saint** give blood. **No soothe anywhere** (signed off: Heartsblood's
"lose 3 Lust" goes, and the Vitae Chalice relic with it). Her glue is that she *produces* three shared
things: Weak on enemies for the debuff readers, health lost on allies for Brienne's Resolve and her own
powers, and healing for Blood Debt and Gorged.

**She applies two enemy statuses, Weak and Siphoned, and no amplifier.** Marked and Sundered came off her
on his read (B34, ninth message): with Claw Flurry and Feeding Frenzy in her own kit, a self-applied +3 per
hit and +50% damage taken made her multi-hits great in any party, so building around her was nothing to
build. Her per-hit riders now come from teammates — Brienne's Armament, Cinder's Vanguard, Nettle's
Infected and Envenomed, Cassadora's Sundered, Clemence's Strength — which is the teambuilding read of a
multi-hit character. Weak stays: with Drain it gives her legs as a health tank, his words. `marked` is
orphaned by this and is deleted (status hygiene, MECHANICS-02 part 10).

**Basics and abilities**

| Card | E | Effect | Note |
|---|---|---|---|
| Claw Flurry (aggressive ×2) | 1 | Deal 2, three times. | unchanged; three hits charge an Infected or Envenomed target |
| Drain (defensive ×2) | 1 | Deal 4. Heal for the damage dealt. | unchanged |
| A1 Blood Tap | — | Lose 5 HP. Gain 1 Strength. Three times a fight. | unchanged |
| A2 Quicken | — | Draw a card for each lit Thirst orb. | unchanged |

**Signatures** (never drop)

| Outfit | Card | E | Effect | Why |
|---|---|---|---|---|
| default | **Answer in Kind** | 1 | Deal 4, plus the health Severine lost since your last turn. | graduated from the pool: Wounded on one card, not a carry |
| huntress | **Finish** | 2 | Deal 10. Double if the target or Severine is below half health. | as listed |
| crimsonCovenant | **Cut** | 1 | Deal 3 damage to yourself. Gain 3 Strength. | as listed (reads "Deal 6" under the passive) |
| bloodSaint | **Blood Moon** | 2 | Deal 20 damage to EVERYONE. | as listed; Brienne's gold soaks it and her Resolve counts it, Blood for Blood sends it back |

**Outfit passives and A2** — all as listed in OUTFITS-LIST, unchanged: Huntress draws a card when an enemy
dies (A2: +2 Energy if all orbs are lit); Crimson Covenant doubles damage she deals herself and doubles
healing she receives (A2: regain all HP if all orbs are lit); Blood Saint splits her self-healing among the
party (A2: Sanctified while all three orbs are lit).

**The pool**

| Card | R | E | Gate | F | A | Effect | From | Why |
|---|---|---|---|---|---|---|---|---|
| **Base (Wounded)** | | | | | | | | |
| Bloodthirst | C | 1 | base | B | | Deal 6, plus 3 for each lit Thirst orb. | K | her plain attack, reading the orb |
| Hamstring | C | 1 | base | B | | Deal 7. Apply 1 Weak. | K | verb: Weak for the debuff readers; broken form Cripple |
| Red Choice | C | 1 | base | — | | **Choose one:** deal 9; or gain 2 Fleeting Strength per lit Thirst orb. | K | the Choose One |
| Coup de Grace | C | 1 | base | B | | Deal 8. If it falls, gain 1 Energy and draw 1. | K | the kill anyone set up pays |
| Bleed Together | C | 1 | base | B | ✓ | You and an ally each lose 4 HP and gain 3 Fleeting Strength. | K | bridge: health loss on an ally — Resolve, Blood Rite, Blood for Blood all read it |
| Drink Deep | C | 1 | base | G | | Deal 7. Heal as much as it dealt. | K | the drain, bigger |
| Feeding Frenzy | R | 1 | base | B | | Deal 4 three times, plus 1 on each hit per lit Thirst orb. | K | the orb payoff |
| Scar Tissue | R | 1 | base | G | | Power. Whenever Severine loses health, she gains 3 tHP. | K | her hurt becomes gold, which Brienne's readers then read |
| **Huntress** | | | | | | | | |
| Scent of Blood | C | 1 | unlock | T | | Deal 5. If any enemy is below half health, draw 2. | K, restored | reads the wounded state anyone made |
| Stalk | C | 1 | unlock | B | | Deal 6 to the enemy with the least health. If it is below half, again. | K | the huntress verb |
| Pack Hunt | R | 1 | unlock (any pool) | B | ✓ | Power. ALL allies' attacks deal 3 more damage to enemies below half health. | RW | **cross-party:** the whole pack cashes a state anyone created; no status on the enemy (the draw-once-a-turn version is the gentler one) |
| Bloody Verdict | R | 2 | worn | B | | Deal 6 plus half the target's missing health. If it falls, heal 6. | K | selfish execute; the missing health is anyone's work |
| **Crimson Covenant** | | | | | | | | |
| Blood Price | C | 1 | unlock | B | | Lose 5 HP. Deal 14. | K | the plain trade |
| Blood Rite | C | 1 | unlock | T | | Power. When the party damages one of its own, draw 1 (twice a turn). | K | reads every self-cost in the party |
| Blood for Blood | R | 2 | unlock (any pool) | G | ✓ | Power. Whenever an ally loses health, deal that much to a random enemy. | K | **cross-party:** every hit the party takes comes back |
| Sanguine Tide | R | 1 | worn | B | | Deal damage to ALL enemies equal to the damage the party has taken this turn. | K | selfish; the Covenant passive doubles what feeds it |
| **Blood Saint** | | | | | | | | |
| Transfusion | C | 1 | unlock | G | ✓ | Severine loses 5 HP. An ally heals 10. | K | give blood |
| Leech Mark | C | 1 | unlock | G | | Deal 5. Apply 2 Siphoned. | K | every ally's hits heal the most hurt |
| Blood Debt | R | 1 | unlock (any pool) | B | ✓ | Power. Whenever another ally heals, deal that much to a random enemy. | K | **cross-party:** Clemence's healing becomes damage |
| Nightfall | R | 2 | worn | G | | Deal 8 to ALL enemies and inflict 1 Weak. Heal 2 for each enemy still standing. | K | selfish sweep; under the passive its heal is the party's; broken form Moonfall |

Totals **12 C / 8 R** · Burst 10, Grind 6, Tempo 2, Choose 1 · ally-touching 7 of 20 (was 5 of 32). Broken
forms survive: Claw Flurry → Prey No More, Hamstring → Cripple, Nightfall → Moonfall, fallback Lash Out.

**Cut (11)**

| Cut | Why |
|---|---|
| Answer in Kind | not cut — graduated to the default signature |
| Mark Prey | Sundered on her made her own multi-hits self-sufficient (ninth message); it stays Cassadora's and Nettle's |
| Pounce | +1 Energy on a "below half" rider; Scent of Blood's draw is the safer read |
| Exsanguinate | one execute rare is enough and Bloody Verdict reads more |
| Open Vein | a multi-hit for blood; Claw Flurry is the multi-hit |
| Blood Pact | 0-cost energy, the banned shape, even priced in blood |
| Red Harvest | missing-health scaling; Answer in Kind is the Wounded read |
| Heart's Toll | under the Covenant passive it is lose 20 for 30 |
| Heartsblood | its soothe is gone and Transfusion gives the blood |
| Gorge | Gorged is one card's rule; Scar Tissue turns her hurt into gold already |
| Crimson Arc | a small sweep; Nightfall is the sweep, and its broken form is still pointed from Claw Flurry |
| Crimson Communion | Nightfall under the Blood Saint passive is the communion |

### 3.6 Cassadora — intents / the Orb ⏸ draft for veto

Sisters: **Intents** (default) *reading and changing them* · **Soothsayer** her own deck · **Grifter** steal
· **Hedge Witch** debuffs. No lust tags. **Her Hex line is the best glue in the game now:** Spread
Misfortune copies and Malediction doubles *every* debuff — Nettle's Poison, Cinder's enemy Heat,
Severine's Marked — so both sit where anyone can draft them. **Warded Fate loses its soothe** (3 Lust), for
the same reason Severine did.

**Basics and abilities**

| Card | E | Effect | Note |
|---|---|---|---|
| Wisplight (aggressive ×2) | 1 | Deal 4. Apply 1 Sundered. | unchanged |
| Second Thoughts (defensive ×2) | 1 | The target picks a new intent. | unchanged |
| A1 Glimpse | — | Re-roll one enemy's intent. Once a rest. | unchanged |
| A2 Magic Trick | — | as listed | unchanged |

**Signatures** (never drop)

| Outfit | Card | E | Effect | Why |
|---|---|---|---|---|
| default | **Omen** | 1 | Deal 4, plus 3 per enemy intending to attack and 2 per filled Orb quadrant. | graduated from the pool: reading on one card, not a carry |
| soothsayer | **Read** | 1 | Scry 3. | as listed |
| grifter | **Misdirect** | 2 | Apply 1 Turncoat. | as listed |
| hedgeWitch | **Jinx** | 0 | Apply 1 Weak or Sundered, at random. | as listed |

**Outfit passives and A2** — all as listed in OUTFITS-LIST, unchanged: Soothsayer's random and reward
cards lean rare (A2: draw a card per Orb symbol); Grifter's stolen cards do not exhaust and stay in the deck
between fights (A2: erase a card of a matching type from the deck if the Orb is full); Hedge Witch's
re-rolls inflict 1 Weak and stolen cards go to the discard (A2: a debuff on each enemy per Orb symbol).

**The pool**

| Card | R | E | Gate | F | A | Effect | From | Why |
|---|---|---|---|---|---|---|---|---|
| **Base (Intents)** | | | | | | | | |
| Twist Fate | C | 1 | base | G | | Deal 5. The target picks a new intent. | K | verb: hit and change |
| Cross My Palm | C | 1 | base | — | | **Choose one:** the target picks a new intent; or empty the Orb: draw 1 per quadrant, +1 Energy if it was full. | K | the Choose One |
| Curse | C | 1 | base | B | | Apply 2 Sundered and 1 Weak. | K | verb: two debuffs for every reader |
| Spread Misfortune | C | 1 | base | B | | Copy every debuff on the target onto every other enemy. | K | **bridge:** Poison, Heat, Marked, whoever put them there |
| Palm Reading | C | 1 | base | T | ✓ | Draw one of an ally's cards. That ally gains 5 tHP. | K | bridge: a tutor and gold |
| Warded Fate | C | 1 | base | G | ✓ | An ally gains 7 tHP. A random enemy picks a new intent. | RW no soothe | bridge: tHP row |
| Evil Eye | R | 1 | base | B | | Power. Whenever an enemy's intent is changed, it takes 6. | K | the Intents payoff |
| Wheel of Fortune | R | 2 | base | G | ✓ | ALL enemies pick new intents. ALL allies gain 4 tHP for each enemy no longer attacking. | K | the party's Intents card; broken form Stillness Within |
| **Soothsayer** | | | | | | | | |
| Divination | C | 1 | unlock | T | | Scry 4. Draw 2. | K | the dig |
| Card Up the Sleeve | C | 1 | unlock | T | | Return a card from your discard pile to your hand. It costs 1 less this fight. | K | the recursion, her distinct verb |
| Destiny's Hand | R | 1 | unlock (any pool) | T | ✓ | Draw one card belonging to each other ally. Gain 1 Energy. | K | **cross-party:** the tutor |
| Augury | R | 1 | worn | T | | Power. Scry 2. Draw 1 more card each turn. | K | selfish engine |
| **Grifter** | | | | | | | | |
| Understudy | C | 1 | unlock | B | | Steal an enemy's intent. Draw 1. | K | the steal |
| Mirror Fate | C | 1 | unlock | B | | Deal 4, plus all the damage the enemy intends to deal. | K | reads the intent; broken form Shattered Mirror |
| Accomplice | R | 1 | unlock (any pool) | B | ✓ | Steal an enemy's intent; it costs 0. The front ally gains 2 Fleeting Strength. | K | **cross-party:** the front ally, whoever it is |
| Grand Heist | R | 2 | worn | B | | Steal the intent of ALL enemies. Exhaust. | K | selfish |
| **Hedge Witch** | | | | | | | | |
| Frailty | C | 1 | unlock | B | | Deal 6. Apply 2 Frail. | K | the answer to enemies that shell themselves |
| Bad Luck | C | 1 | unlock | G | | Apply 1 Weak and 1 Sundered to ALL enemies. | K | the sweep that Catharsis and Putrefy read |
| Coven's Curse | R | 1 | unlock (any pool) | B | ✓ | Power. Whenever an ally gives an enemy a debuff, it takes 3. | K | **cross-party:** every Poison, Weak, Heat and Marked applied by anyone |
| Malediction | R | 1 | worn | B | | Double every debuff on an enemy. Exhaust. | K | worn-only, but it doubles what the whole party applied |

Totals **12 C / 8 R** · Burst 9, Grind 5, Tempo 5, Choose 1 · ally-touching 6 of 20 (was 4 of 32). Broken
forms survive: Wisplight → Turned Coat, Mirror Fate → Shattered Mirror, Wheel of Fortune → Stillness
Within, fallback Blinded.

**Cut (11)**

| Cut | Why |
|---|---|
| Omen | not cut — graduated to the default signature |
| Encore, Reshuffle, Portent | draw-and-scry bodies; Divination is the dig, Read the signature |
| Tarot Spread | a bigger Divination; Augury is the worn rare |
| Sleight of Hand | Twist Fate and Second Thoughts change intents already |
| Turncoat | duplicates Misdirect, the signature |
| Double Cross | needs Turncoat to pay |
| Fence | → **neutral candidate** (§3.7): exhaust a card, gain 2 Energy is glue for any party carrying curses, and Nettle's Souls read it |
| Pilfer | Understudy is the steal; Grand Heist the big one |
| Enfeeble | Weak is on Curse, Bad Luck, Hamstring and Miasma already |
| Witch's Brew | Bad Luck plus Malediction is the same board |

### 3.7 Neutrals — the colourless tier ⏸ draft for veto

**The precedent is Slay the Spire's colourless cards** (Noodle, B34 tenth message): rarely seen, agnostic
enough to sit in any deck, and above rate, so that a random neutral is worth more than plenty of a
character's rares. Three rules follow:

1. **Agnostic by construction.** No private meter (Souls, Resolve, Stride, Devotion, Thirst, the Orb), no
   private status. Every neutral reads a currency the whole party shares: tHP, Heat, debuffs, health, the
   party's order, the hand, curses.
2. **Above rate.** A neutral common is priced at the rare rate (12+ per energy); a neutral rare is an engine
   or a one-shot any deck is glad to draw. Two ranks, as Slay the Spire has uncommon and rare colourless.
3. **Rare to see.** Never in an ordinary reward (`neutralSlotChance` stays 0). **Every shop stocks one**, the
   **boss's fourth slot rolls a neutral rare half the time**, and events may hand one out (`map/`'s call).
   A 0-cost neutral still needs a real price; the tier has two, Possibility and Tempering, and both exhaust.
4. **A neutral may pilot a mechanic** a future character will own (Noodle, eleventh message): a specific
   neutral is unlikely to be seen in any one run, so the tier is where a discover verb or an exact-number
   read can exist before a character is built on it.

Twelve cards, 7 C / 5 R. Names are placeholders except where kept or his.

| Card | R | E | F | Effect | From | Why |
|---|---|---|---|---|---|---|
| Possibility | C | 0 | T | Choose one of three rare cards from the party's pools to add to your hand for this fight. It costs 1 less. Exhaust. | new, **his** | the discover precedent: a temporary card, a cost cut, and a pick that depends on who is in the party |
| Fence | C | 1 | T | Exhaust a card in your hand. Gain 2 Energy. | new (was Cassadora's) | curse and junk removal that pays; Nettle's Souls read the exhaust |
| Field Tonic | C | 1 | G | An ally heals 12. Exhaust. | RW 10→12 | the agnostic heal, exhausting as the bible asks; Blood Debt reads it |
| Low Blow | C | 1 | B | Apply 2 Weak and 2 Sundered to an enemy. | new | the setup every debuff reader in the game pays: Putrefy, Catharsis, Coven's Curse, Spread Misfortune, Malediction |
| Improvise | C | 1 | T | Return a card from your discard pile to your hand. Gain 1 Energy. | K | recursion that pays for itself |
| Regroup | C | 1 | G | Move an ally to the front or the back. They gain 5 tHP. | new | reads the position row: cools Heat going back, triggers Formation Drill, sets Vanguard, Longspear and Ember Watch |
| Hedge Your Bet | C | 1 | — | **Choose one:** gain 9 tHP; draw 2; or deal 11 to a random enemy. | K (was R) | the flexible one; a common at the neutral rate |
| Tempering *(name: his)* | R | 0 | T | Upgrade a card in your hand. It costs 1 less this fight. Exhaust. | K (Whetted Edge, per A6: rare, renamed, reflavoured) | the tier's one 0-cost; its price is the exhaust and the slot |
| Flourish | R | 1 | B | Power. Every fourth card you play in a turn deals 8 to ALL enemies. | new | an engine any deck feeds; a hot Cinder feeds it fastest |
| Clean Slate | R | 1 | G | Remove every debuff from ALL allies. Each gains 3 tHP per debuff removed. | new | the party cleanse; Heat, Weak, Frail, Sundered, enemy poison all count |
| Opening Salvo | R | 1 | B | Innate. Deal 10 to ALL enemies. Exhaust. | new | turn-one tempo for any deck; the Innate primitive exists |
| Devil's Number | R | 2 | T | Power. Whenever an ally deals exactly 6 damage, draw a card. | new, **his** | the exact-number precedent: every character but Clemence can land a 6 (Sword Strike, Longspear, Scorch twice, Bloodthirst, Frailty, Feeding Frenzy at two orbs), and Strength, Weak and Sundered become choices rather than free value |

Totals **7 C / 5 R** · Burst 3, Grind 3, Tempo 5, Choose 1 · every card reads a shared row.

**Cut:** Focused Mind (draw 2 for 1: under rate and says nothing). **Shared Resolve** (his read: 6 tHP is
peanuts to the one in front and gone unused on the one at the back; B26's card retires). **Cool Head** (it
reads Heat alone, which is one character's status and not agnostic; Clean Slate is the cleanse and covers
Heat with everything else).

**Two defaults for his veto on his cards.** Possibility's three are drawn from the rares the party could be
offered today — its characters', unlocked, worn-only only if worn — so the pick belongs to someone in the
party and its text resolves; a discovered card is a this-fight copy owned by its character, exactly as a
stolen enemy move is. Devil's Number counts the amount a hit lands for after Strength, Weak and Sundered
and before tHP soaks it, which is the number the forecast prints on the card; a tick with no attacker
(Poison, Thorns, Heat) never counts; each hit of a multi-hit counts on its own.

**Where they come from, as tuning:** `shop` stocks one neutral per visit (rank rolled 75 / 25); the boss
reward's fourth slot is a character rare or a neutral rare on a coin flip; `neutralSlotChance` 0. Shop price
sits a tier above the character card of the same rank (`honeycomb.shopTuning.cardPriceArray` gains a
neutral column). Numbers are the audit's.

**Anastasia is outside this pass** (his eighth message): a secret, effectively a playable boss, balanced on
different axes, and unplayed by anyone who has given feedback. Her 13 C / 7 R stay as they are.

## 4. Verdicts

Cinder's are in §3.1. The other five follow their grids. Retired definitions go to
a new retired-cards file in `../Archive/demo1/Archive/` with the replacement named, as `../Archive/demo1/Archive/RETIRED-CARDS-S33.md` did.

## 5. Engine asks, and the Friday housekeeping list

Engine, from the grids:

- **Heat**: one status entry (§2.1), plus the cooling listener. `shiftEntity` already fires `onShifted`
  with distance and direction is derivable from ranks. Plus the `heat` lust tag.
- **Poison `halve`**: one field.
- **Sortie**: `shiftParty` `front` then `backward` (both exist).
- **Reward dedupe**: a held-card weight in `rollCardReward` (`POOL-REVIEW-02.md` §1).
- **Default signature**: `cardAdditionArray` on the default outfit, as the alts have; `randomCardCount` removed.
- **Heat's weakness is for show**: a per-tag flag the rank multiplier (`lustMultiplier`, entities.js) skips.
- **Brienne's strand (§3.3, after his yes)**: incoming damage landing as Lust (a sibling of `replaceSelfDamage`),
  and the outfit-level "half the party's Lust lands on her" hook.
- **Possibility (§3.7)**: a `discoverCard` verb — N candidates from a filtered pool (the party's legal rares),
  the choice window that exists, a this-fight instance on the stolen-card plumbing (`giveStolenCard` already
  makes an exhausting, owned, temporary copy), plus `modifyCardCost`. MECHANICS-01 scored this "New verb"
  as *Generate (a pool)*.
- **Devil's Number (§3.7)**: a world hook on damage landed carrying the amount, with an exact-amount
  condition; attacker-less ticks excluded.

**Housekeeping Noodle named for the desktop session (2026-09-25, B34 fifth message).** In the order that
unblocks the most. Each is a table edit and a suite check; none needs a design decision except the first.

| # | Job | Where | Size |
|---|---|---|---|
| 1 | **The lust tags — SIGNED OFF (§2.3).** Demo: Venom, Exposure, Heat, Penance. **The fey move to Exposure** (15 Charm moves retagged); every old Charm reference and weakness scrubbed; act-1 enemies use only Venom, Exposure and Heat (8 Restraint and 0 Torment moves retagged); Charm and Torment stay defined for act 2. The charm writing rules in `../events/IDEAS.md` become act-2 material. Measured with `../tools/lust-share.js`. Verbatim in `../enemies/ENEMIES.md` E14 and `../events/EVENTS.md` B23. | `honeycomb-content-cards.js` (`cardTagArray`), `honeycomb-content-enemies.js`, saves (`reconcileWeaknessLedger` drops the dead tags), `lust_events/` B17 and B20 | the retag is 23 moves |
| 2 | `heat` added to `cardTagArray` with `lustTag: true` | content-cards | one entry |
| 3 | `../relics/` B1: the three unlock routes, and the 18 alts off `unlockedFromStart` | content-characters, progression | the one engine job |
| 4 | `tuning.reward`: 85 / 15, elite 60 / 40, boss fourth slot rare, held-card weight | tuning, combat | small |
| 5 | Poison `decayMode: "halve"` — **after Nettle's grid**, since her appliers are priced on it | content-statuses | one field |
| 6 | The Heat status entry and Cinder's cards — **after his veto of §3.1** | content-statuses, content-cards | the first character |
| 7 | Stale lines elsewhere: `../relics/STARTER-LIST.md` (Cinder "attacks apply +1 Vulnerable to herself"), `../relics/OUTFITS-LIST.md` Cinder (Ashfall passive, "Sundered"), `../reference/MECHANICS-01.md` (reference only, leave) | docs | minutes |

## 6. Done means

- `../tools/test-honeycomb.js` green; `honeycomb.warnings.report()` 0 active; `duplicateCardRules` clean;
  `cardFit` clean; a warning rule for the §1 shape (12 / 8 per character, one Choose One).
- `../tools/budget-audit.js` baseline output ≥ 12 a turn on early normals, then an All the Crunch run
  before and after (`../tooling/`).
- Every surviving card has a prompt line or is listed as owed; every cut card is retired, not deleted.
- `CARD-POOL.md` B34 and `CARD-POOL.md` updated as each character lands, not at the end.
