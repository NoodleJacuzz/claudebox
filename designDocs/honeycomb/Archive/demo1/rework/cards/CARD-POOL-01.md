# CARD-POOL-01 — the card pool redesign brief

Session 32 (2026-09-19, Fable) wrote the skeleton. Session 33 (2026-09-19, Opus) corrected the pool
size and the rates on Noodle's notes (§0) and filled all six grids (§4). Read first: `BALANCE-01.md`,
`../starters/OUTFITS-LIST.md` (outranks `../../reference/MECHANICS-01.md`), `../../designBibles/mechanics.md`,
`../../designBibles/characters.md`, `../STARTER-REWORK-01.md` §1.6. **The bibles win any conflict.**

Status key: ☐ not started · ◐ in progress · ☑ done · ⏸ waiting on Noodle

## Status board

| Step | State |
|---|---|
| 1. Rules and grid | ☑ s32, **corrected s33** (§0, §1) |
| 2. Mechanic corrections (§3) | ☑ s33 — Resolve 1:1 on damage taken, Devotion 1:1 on health/tHP given, Stride on debuffs; maxima 100; A2 payouts halved |
| 3. Per-character grids (§4) | ☑ s33, second pass on Noodle's notes (default themes, Clemence without soothe). Noodle will not read the grids line by line: tests and the audit judge them |
| 3b. Clemence's per-card broken forms | ☑ s33 — all 32, her starter forms and the fallback; 10 rare forms spend her Lust |
| 4. Keep / cut / rewrite verdicts (§5) | ☑ s33 — 17 cut to `retiredCardArray`, definitions in `../../Archive/RETIRED-CARDS-S33.md` |
| 5. Cards written into `honeycomb-content-cards.js` | ☑ s33 — 192 pool cards + 31 Clemence broken forms; grid rows marked "built:" / "audit:" changed to fit the engine or the rate audit |
| 6. Audit + suite + warning report green; tooltips updated | ☑ s33 — suite 1615/0 (block [102] tests the pool), warnings 0, `../../tools/budget-audit.js` runs; mechanic, A2 and node texts updated. Art: 131 cards carry `artOwed` (prompts owed in `../../tools/card-prompts.js`) |
| 7. Unlock routes, boost/reduce, gated distribution | ◐ gates and boost/reduce are live; **every alt outfit is still unlocked from the start**, so gated cards drop from run one until the unlock routes land |

## 0. Noodle's corrections (session 33, verbatim)

> The pool size they came up with is 12 commons + 5 rares per character. This is, frankly, far too
> small. Each new costume should unlock 3 synergistic commons and 2 rares, and there are 3 unlockable
> costumes per character. 12 commons and 5 rares would be the starting point sort of number for the
> default outfit, not the final pool.

→ §1.1. Final pool per character: **21 commons + 11 rares** (12 C + 5 R from the start, then 3 C + 2 R per
alt outfit unlocked).

> It's also worth noting some of their math is off. They balanced around 6 damage per energy, this is
> wrong and could go disastrously. Those are the numbers used to balance starter cards, if all cards are
> balanced against starter cards, then there's no reason to take on new cards, and the strategy never
> grows.
> Starters should balance around about 6 damage per energy.
> Common cards should balance around 9 damage per energy, on the low end. 8 damage and draw a card for
> one energy is good, not busted.
> Rares hitting 12+ damage per energy is not unreasonable.
> They also seem to have missed that draw is less valuable than energy, since most decks have 5 cards
> per turn and 3 energy per turn, though lategame decks will reliably have 4-5 energy and more cards.

→ §1.2. **The output targets were already right** (not the enemies — see the next note). BALANCE-01 §4's party output per turn (12 → 18 → 24) is
two energy of attacking at 6 → 9 → 12, which is these rates exactly: a starter deck, a deck of commons, a
deck with rares. Only the card-side handoff (BALANCE-01 §6, the old §1 here) priced everything at the
starter rate. Both are corrected in place.

> "The enemy side was already right" — Maybe in just health, but from my conversation with fable: "Check
> it against the run: ten normals at 10%, two elites at 25%, two bosses at 40% comes to 230% of party HP.
> The run supplies 250%. A deck with zero sustain and zero fight-shortening just barely survives"
> They definitely will need to change, they don't deal anywhere near a consistent 10%, and 2 20-hp
> enemies will pretty rarely actually make it to turn 3. But that's outside the scope of card pool
> specifically, and isn't accounting for what the new pools will be like, I just don't want it written off.

→ Only the **output targets** (P = 12 / 18 / 24) match the new card rates. The enemy roster itself is
still wrong (BALANCE-01 §7: damage far from a steady per-fight share, small line-ups dying before turn 3)
and **the enemy pass is still required**, re-measured against these pools.

> Draw is worth about 0.4 energy early — Pretty much, yes, about 2-4 damage. Except on 0-cost cards,
> that's when things get tricky.

→ §1.2: a 0-cost card that draws or gives energy is never priced by the table; it is judged as a free
card (it raises the hand's card count *and* costs nothing), and is kept rare in every pool.

> [Resolve and Devotion both cap at 10] Dear lord, it's that low? We could easily make it 100, I don't
> really see a downside to it. I'll leave it to your judgement but you are correct 10 is waaaay too low.

→ §3: both maxima **100**.

> [Clemence healing near the tHP rate by paying Lust] That's certainly risky, since Clement gets stronger
> when she breaks, not weaker, but at the same time a party member counts as "dead" when she's broken, so
> I'll leave it to your judgement. Tests will guide us here.

→ Kept, marked provisional in §1.2; the budget audit's Lust and heal columns decide it.

## 1. Hard rules

### 1.1 Pool size and shape (per character)

| | Commons | Rares | When it drops |
|---|---|---|---|
| **Base pool** | 12 | 5 | from the start, any outfit worn |
| — default sister | 3 | 2 | |
| — each alt sister (×3) | 3 | 1 | |
| **Each alt outfit unlocked** (×3) | 3 | 2 | once that outfit is unlocked |
| — its any-pool rare | | 1 | drops for any outfit; **cross-party synergy** |
| — its worn-only rare | | 1 | drops only while that outfit is worn; **selfish to the sister** |
| **Final** | **21** | **11** | (8 rares when not wearing an alt) |

An alt sister ends at 6 C + 3 R; the default sister stays at 3 C + 2 R and sits between the three.
Starters, outfit signatures and broken forms are outside the count. Equal pool size for all six (Noodle).

### 1.2 Rates

One energy buys, by tier:

| Primitive | Starter | Common | Rare | Notes |
|---|---|---|---|---|
| Damage | **6** | **9** floor; 10–13 conditional | **12+**; 15–20 as a build-around | the anchor (Noodle) |
| Temporary HP | 6 | 9 | 12 | same curve as damage |
| Lust on an enemy | 7 | 10 | 14 | enemy break is a kill |
| Soothe | 6 | 9 | 12 | |
| Poison applied | 3 | 5 | 7 | 5 Poison ticks 5+4+3+2 over a 4-turn fight; the delay is the discount |
| Heal | 3 | 4–5 (or more with Exhaust) | 6+ with a condition | half of tHP: repair stays worse than prevention (BALANCE-01 §5). Clemence may pay her Lust to run near the tHP rate — provisional, the audit decides (Noodle) |
| **Energy** | — | 1 energy = a full energy (9 at common) | | the scarce resource |
| **Draw 1** | — | **≈ 0.4 energy** early (2–4 damage), ≈ 0.6 late | | 5 cards vs 3 energy: cards are rarely the bottleneck until 4–5 energy. **Not on 0-cost cards** — see below |
| Exhaust | | +1 energy of value on a one-shot | | also Nettle's Soul fuel |

The yardsticks: *8 damage + draw 1 for 1 energy* is a good common, not a broken one (8 + 4 ≈ 12). A common
still has to beat the **fully upgraded** starter it competes with (bible, Accelerate) — e.g. Brienne's
Steel path ends at "Deal 6, +6 if you have tHP", so her commons are built to out-value 12 conditional.

**0-cost cards are off the table.** A 0-cost draw or energy card adds a card to the turn without spending
any of it, so the per-energy rates undersell it (Noodle). Each needs a real price (HP, tHP, Lust, a
stolen card, a Soul) and there are at most one or two per character.

### 1.3 Composition checks (per character)

- Burst ≥ 5 and Grind ≥ 5 across the final pool; each sister has a clear lean.
- **Exactly one Choose One**, in the base pool, that cashes the mechanic when the build ignores it.
- Ally-touching ≥ 2 (every character now has 5+; Nettle had none).
- Clemence never reduces an ally's Lust (§2).
- Every card moves one of the four scales (MECHANICS-02 part 1). Tempo-only cards count.
- One broken form per rank (Clemence: one per card).
- Default is its own archetype with its own name (Noodle, STARTER-REWORK §1.6).

> Every character should have the same size of card drop pool. Broken cards are not counted.
> Each character likely needs a second general theme tied to their primary mechanic. Likely at least one
> Choose One each that offers a way to pay out otherwise useless resource building or some other effect.
> Don't forget to change mechanic and ability tooltips to reflect their new nature.

## 2. Healing (BALANCE-01 §5, loosened session 33)

> Note from noodle: This is maybe a little overly strict. Healing on a rare card with conditions, or on
> a common card with exhaust stops unreasonable health gains.

No engine limit. **Severine** heals by paying HP (Drain, transfers). **Clemence** heals by paying Lust,
and healing is her default sister. **Any other character** may heal on a **rare with a condition** or a
**common that Exhausts**; a repeatable plain heal on a common stays Severine's and Clemence's alone. The
new starters carry no healing except Severine's Drain and Clemence's Offering. Outfit passives and
abilities (Sporemother, Rotsinger's A2) are outside this rule.

> Clement should really, really not be reducing lust of allies. We want careful decision making.
> Careful decisions are made to balance resources. Resources don't need to be balanced if you have
> infinite. If we give Clement the ability to heal -and- reduce lust, what danger actually is there?

**Clemence never reduces an ally's Lust** — not on a card, not on a broken form, not on a power. She
heals; the party's Lust is the attrition she cannot touch, and the other five characters' soothes are
the only answer to it. Spending *her own* Lust on a broken form is not soothing an ally and stays.
⏸ Her A1 **Absolution** (allies soothe 5 and heal 5, she takes the Lust) breaks this rule; it is an
ability, outside this brief, and needs Noodle's call. Her fallback broken form **Rapture** ("ALL allies
lose 5 Lust and heal 3 HP") is rewritten in §4.5.

## 3. Mechanic corrections the pool assumes (STARTER-REWORK-01 §1.6)

| Character | Change | State |
|---|---|---|
| Brienne | Resolve: 1 per point of damage taken this battle (tHP or health); **not** on tHP gained (`wardPerPoint` hook goes) | ☐ |
| Nettle | More ways to exhaust (Souls) — 4 exhaust cards and a Soul spend in §4.2 | ☐ |
| Severine | Cards that read **how many orbs are lit** — the default sister (§4.3) | ☐ |
| Cinder | Stride on gaining a debuff; **no starting 2**; recklessness = self-debuff that does not lower damage (Sundered, Frail — never Weak) | ☐ |
| Cassadora | Orb of four quadrants | ☑ s31 |
| Clemence | Devotion: 1 per point of health **or tHP given to any party member**; not from Lust | ☐ |

**Maxima: 100** for both Resolve and Devotion (Noodle, session 33; was 10, which a single hit or heal
would fill at 1:1). Aegis spends all Resolve for party tHP: at 1:1 that is large, so its payout is priced
by the audit (starting point: half the Resolve spent, per ally). Weigh the Cost and Answered Prayer spend
fixed amounts and are unaffected.

## 4. The grids

Columns: **Gate** base / unlock / worn · **F** Burst / Grind / Tempo · **A** ✓ = touches an ally ·
**From** = live card kept (K), rewritten (RW), or NEW. Effects are base (un-upgraded); the rate note is
value per energy at the tier. Upgrades are written in step 5 (≈ +30% or −1 cost).

### 4.1 Brienne — Temporary HP / Resolve

Sisters: **Oath** (default, new) *tHP held into your turn pays* · **Siegeplate** tHP is a weapon · **Bastion**
tHP is a wall · **Almoner** tHP is currency. "Carried" = the tHP left after her own turn-start halving,
i.e. what survived the enemy turn.

| Card | R | E | Gate | F | A | Effect (rate) | From |
|---|---|---|---|---|---|---|---|
| **Oath** | | | | | | | |
| Kept Word | C | 1 | base | B | | Deal 6 plus the tHP you carried into this turn. (9 at 3 carried) | NEW |
| Oath of Iron | C | 1 | base | G | | Gain 6 tHP and Entrenched (tHP loses a quarter at turn start, not half). (6 + ~2/turn) | NEW |
| Weigh the Cost | C | 1 | base | G | | **Choose one:** gain 9 tHP; or spend 8 Resolve: gain 1 Energy and draw 2. | NEW |
| Unbroken Oath | R | 2 | base | G | | Power. At the start of your turn, if you carried tHP into it, deal 6 to the front enemy and draw 1. (~30 over a fight) | NEW |
| Promise Kept | R | 1 | base | B | | Deal twice the tHP you carried into this turn. (12–20) | NEW |
| **Siegeplate** | | | | | | | |
| Shield Bash | C | 1 | base | B | | Gain 5 tHP, then deal half your tHP (round up). (8–13) | RW |
| Tempered Plate | C | 1 | base | B | | Gain 6 tHP and 1 Armament. | RW |
| Lend Steel | C | 1 | base | B | ✓ | An ally gains 7 tHP and 1 Armament. | RW |
| Crushing Weight | R | 2 | base | B | | Deal 4 plus half your tHP to ALL enemies. (30 at 12 tHP, 3 enemies) | K |
| Riposte | C | 1 | unlock | B | | Deal damage equal to your tHP, then lose half your tHP. | RW |
| Plated Charge | C | 2 | unlock | B | | Move to the front. Gain 8 tHP. Deal damage equal to your tHP. (22+) | NEW |
| Heavy Swing | C | 1 | unlock | B | | Deal 8. If you have 10+ tHP, deal 8 again. | NEW |
| Forge the Line | R | 2 | unlock | B | ✓ | ALL allies gain 6 tHP and 1 Armament. *(cross-party)* | NEW |
| Unstoppable | R | 2 | worn | B | | Power. Whenever you gain tHP, deal 4 to the front enemy. | RW |
| **Bastion** | | | | | | | |
| Intercept | C | 1 | base | G | ✓ | An ally gains 8 tHP. Brienne gains 1 Taunt. | RW |
| Challenge | C | 1 | base | G | | Gain 10 tHP and 1 Taunt. | RW |
| Iron Retort | C | 1 | base | G | | Gain 5 tHP and 2 Retort. | RW |
| Stand Fast | R | 1 | base | G | | Power. At the start of your turn, gain 5 tHP. | RW |
| Thorn Armour | C | 1 | unlock | G | | Gain 6 tHP and 3 Thorns. | RW |
| Take the Hit | C | 1 | unlock | G | | Gain 1 Taunt and 4 tHP for each enemy intending to attack. (feeds Resolve; built: no verb sums intended damage) | NEW |
| Bulwark | C | 2 | unlock | G | ✓ | ALL allies gain 7 tHP. | RW |
| Rally | R | 1 | unlock | B | ✓ | ALL allies gain 1 Strength, +1 per 8 tHP Brienne holds (up to 3). *(cross-party)* | RW |
| Shield Wall | R | 2 | worn | G | ✓ | Gain 14 tHP and 2 Taunt. Other allies gain 5 tHP. | RW |
| **Almoner** | | | | | | | |
| Tithe | C | 0 | base | B | | Spend 6 tHP: gain 1 Energy. | RW |
| Gilded Strike | C | 1 | base | B | | Spend all your tHP. Deal twice that. | K |
| Ransom | C | 1 | base | T | ✓ | Spend up to 8 of an ally's tHP. Draw 1 per 4 spent; if 8, gain 1 Energy. | RW |
| Pay the Toll | R | 1 | base | B | ✓ | Spend all your tHP. ALL allies gain 1 Fleeting Strength per 4 spent. | NEW |
| Alms | C | 1 | unlock | G | ✓ | Spend all your tHP. ALL allies lose that much Lust. | K |
| Pay in Kind | C | 1 | unlock | B | | Spend 6 tHP. Deal 16. | NEW |
| Largesse | C | 1 | unlock | G | ✓ | Spend all your tHP. An ally gains that much plus 4. | NEW |
| Tribute | R | 1 | unlock | B | ✓ | Every ally spends all their tHP. Deal that much to the front enemy; draw 1 per 10 spent. *(cross-party)* | NEW |
| Reliquary | R | 1 | worn | T | | Power. When your tHP halves or is lost, gain 1 Energised per 6 lost (at most 2 a turn). | K |

Totals 21 C / 11 R · Burst 17, Grind 13, Tempo 2 · Ally 11 · Choose One: Weigh the Cost.
Broken forms: common Bulwark → Huddle; rare Crushing Weight → Weight of Regret (both live).

### 4.2 Nettle — Poison / Souls

Sisters: **Timing** (default, new) *Poison now vs Poison later* · **Rotsinger** consume · **Sporemother**
spread · **Nightshade** Poison carries Lust. Exhaust cards (Souls): Venom Sac, Rot From Within, Corpse
Pyre, Spore Cloud, and the Soul spend on Grave Choice.

| Card | R | E | Gate | F | A | Effect (rate) | From |
|---|---|---|---|---|---|---|---|
| **Timing** | | | | | | | |
| Quicken Rot | C | 1 | base | B | | The target's Poison acts now. Then inflict 2 Poison. | NEW |
| Venom Sac | C | 1 | base | G | | Inflict 7 Poison. Exhaust. | NEW |
| Grave Choice | C | 1 | base | G | | **Choose one:** inflict 5 Poison; or spend 3 Souls: gain 1 Energy and draw 2. | NEW |
| Rot From Within | R | 1 | base | G | | Double the target's Poison. Exhaust. | NEW |
| Death Knell | R | 2 | base | B | | Every enemy's Poison acts now, twice. | NEW |
| **Rotsinger** | | | | | | | |
| Blight Needle | C | 1 | base | B | | Deal 5. Inflict 3 Poison. | RW |
| Reap | C | 1 | base | B | | Deal 5 plus 2 per Poison on the target. | RW |
| Rupture | C | 1 | base | B | | Consume all Poison on an enemy. Deal twice that. | K |
| Fester | R | 1 | base | G | | Inflict 4 Poison and 2 Festering. | RW |
| Putrefy | C | 1 | unlock | B | | Deal 4 plus 3 per negative status on the target. | K |
| Wasting | C | 1 | unlock | G | | Inflict 4 Poison; 4 more if the enemy is Weak. | RW |
| Corpse Pyre | C | 1 | unlock | B | | Exhaust a card from your hand (your pick). Deal 8 plus 2 per Poison on the target. | NEW |
| Catharsis | R | 2 | unlock | B | | Each enemy takes damage equal to its Poison plus 4 per other debuff on it. *(cross-party: Weak, Sundered, Sensitive)* | RW |
| Burst | R | 1 | worn | B | | Consume all Poison on an enemy. Deal that much to ALL enemies. | K |
| **Sporemother** | | | | | | | |
| Miasma | C | 2 | base | G | | Inflict 3 Poison and 1 Weak on ALL enemies. | RW |
| Contagion | C | 1 | base | G | | Every other enemy gains Poison equal to this enemy's. | K |
| Infect | C | 1 | base | G | | Inflict 3 Poison and 2 Infected. | RW |
| Pandemic | R | 1 | base | G | | ALL enemies gain 3 Poison and Pandemic. | RW (was C) |
| Scatter Spores | C | 1 | unlock | G | | Inflict 2 Poison on a random enemy, 3 times. | NEW |
| Plague Bearer | C | 1 | unlock | G | ✓ | This turn, an ally's attacks also inflict 2 Poison. | NEW |
| Spore Cloud | C | 1 | unlock | G | | Inflict 3 Poison on ALL enemies. You may exhaust a card from your hand. | NEW |
| Rot Garden | R | 2 | unlock | G | ✓ | Power. Whenever any ally attacks, the target gains 1 Poison. *(cross-party)* | NEW |
| Creeping Plague | R | 2 | worn | G | | Inflict 4 Poison and 2 Sundered on ALL enemies. | RW |
| **Nightshade** | | | | | | | |
| Pollen Kiss | C | 1 | base | B | | Inflict 3 Poison and 5 Lust. | RW |
| Flushed | C | 1 | base | B | | Inflict Lust equal to 4 plus twice the target's Poison. | RW |
| Intoxicate | C | 1 | base | B | | Inflict 3 Poison and 2 Intoxicated. | RW |
| Heady Spores | R | 1 | base | B | ✓ | ALL enemies gain 2 Poison. Whenever the party applies Poison, that enemy takes 2 Lust. | RW (was C) |
| Love Bite | C | 1 | unlock | B | | Deal 4. Inflict 2 Poison and 2 Sensitive. | NEW |
| Draw Out | C | 1 | unlock | G | ✓ | An ally loses up to 8 Lust; the front enemy gains that much Poison. | NEW |
| Lotus Smoke | C | 2 | unlock | B | | Inflict 2 Poison and 5 Lust on ALL enemies. | NEW |
| Aphrodisiac | R | 1 | unlock | B | ✓ | Power. Whenever an enemy takes Lust from any ally, it gains 1 Poison. *(cross-party)* | NEW |
| Bacchanal | R | 2 | worn | B | | Inflict 2 Intoxicated on ALL enemies. Each takes Lust equal to its Poison. | K |

Totals 21 C / 11 R · Burst 17, Grind 15 · Ally 5 · Choose One: Grave Choice.
Broken forms: common Miasma → Miasmic Haze; rare Bacchanal → Last Bloom (live). Pollen Kiss's Pollen
Burst was a *starter* tax and Pollen Kiss is a common now: the new starters need their own tax forms.

### 4.3 Severine — Blood / Thirst

> Note from noodle: I'm not a huge fan of Severine or Cassadora's default themes here, I'd say severine is
> more about being damaged (plays into all three) and Cassadora's being intents in general. And I don't
> understand Clemence's. Honestly, I think it should just be healing in general, since there's no way to
> balance health lost per fight around having a character with healing at common, the new game becomes
> lust management as the slow attrition the player deals with.

Sisters: **Wounded** (default) *Severine being damaged — by enemies or by herself* · **Huntress** hunt the
wounded · **Crimson Covenant** pay in blood · **Blood Saint** give blood. Being damaged feeds all three:
it lights the Wounded orb, is what Covenant pays, and is what Blood Saint gives away. The lit-orb readers
(§3) live here because Wounded is an orb. "Lit" counts Blood drawn, Wounded, Prey marked; an attack
counts its own Blood drawn.

| Card | R | E | Gate | F | A | Effect (rate) | From |
|---|---|---|---|---|---|---|---|
| **Wounded** | | | | | | | |
| Bloodthirst | C | 1 | base | B | | Deal 6, plus 3 per lit Thirst orb. (6–15) | NEW |
| Answer in Kind | C | 1 | base | B | | Deal 4, plus the health Severine lost since your last turn. | NEW |
| Red Choice | C | 1 | base | B | | **Choose one:** deal 9; or gain 2 Fleeting Strength per lit Thirst orb. | NEW |
| Feeding Frenzy | R | 1 | base | B | | Deal 4 three times, +1 per lit orb on each hit. (15–21) | NEW |
| Scar Tissue | R | 1 | base | G | | Power. Whenever Severine loses health, she gains 3 tHP. | NEW |
| **Huntress** | | | | | | | |
| Hamstring | C | 1 | base | G | | Deal 7. Inflict 1 Weak. | RW |
| Mark Prey | C | 1 | base | B | | Deal 4. Inflict 2 Sundered. (Noodle: vulnerable, not mark) | RW |
| Coup de Grace | C | 1 | base | B | | Deal 8. If it falls, gain 1 Energy and draw 1. | RW |
| Exsanguinate | R | 2 | base | B | | Deal 10; if the target is below half health, 24 instead. | RW |
| Stalk | C | 1 | unlock | B | | Deal 6 to the lowest-health enemy; if it is below half, again. | NEW |
| Scent of Blood | C | 1 | unlock | T | | Deal 5. If any enemy is below half health, draw 2. | NEW |
| Pounce | C | 1 | unlock | B | | Deal 9. If any enemy is below half health, gain 1 Energy. (built: no cost-change verb) | NEW |
| Pack Hunt | R | 1 | unlock | B | ✓ | ALL enemies become Marked. Draw 1. *(cross-party: every ally's attacks)* | NEW |
| Bloody Verdict | R | 2 | worn | B | | Deal 6 plus half the target's missing health. If it falls, heal 6. | RW |
| **Crimson Covenant** | | | | | | | |
| Blood Pact | C | 0 | base | B | | Lose 7 HP. Gain 2 Energy. | RW (no draw) |
| Blood Price | C | 1 | base | B | | Lose 5 HP. Deal 14. | NEW |
| Blood Rite | C | 1 | base | T | | Power. When the party damages one of its own, draw 1 (twice a turn). | K |
| Sanguine Tide | R | 1 | base | B | | Deal damage to ALL enemies equal to the damage the party has taken this turn. | K |
| Open Vein | C | 1 | unlock | B | | Lose 4 HP. Deal 4 three times. | NEW |
| Red Harvest | C | 1 | unlock | B | | Deal 4, plus 1 per 3 HP Severine is missing. | NEW |
| Bleed Together | C | 1 | unlock | B | ✓ | You and an ally each lose 4 HP and gain 3 Fleeting Strength. | NEW |
| Blood for Blood | R | 2 | unlock | G | ✓ | Power. Whenever an ally loses health, deal that much to a random enemy. *(cross-party)* | K |
| Heart's Toll | R | 1 | worn | B | | Lose 10 HP. Deal 30. | NEW |
| **Blood Saint** | | | | | | | |
| Leech | C | 1 | base | G | | Drain 7. | NEW |
| Leech Mark | C | 1 | base | G | ✓ | Deal 5. Inflict Siphoned (party heals half of what it loses). | RW |
| Heartsblood | C | 1 | base | G | ✓ | Lose 6 HP. Other allies heal 5 and lose 3 Lust. | RW |
| Nightfall | R | 2 | base | G | | Deal 8 to ALL enemies and inflict 1 Weak. Heal 2 per enemy still standing. | RW |
| Gorge | C | 1 | unlock | G | | Gain Gorged. Drain 5. | RW |
| Transfusion | C | 1 | unlock | G | ✓ | Lose 5 HP. An ally heals 10. | RW |
| Crimson Arc | C | 1 | unlock | G | | Drain 3 from ALL enemies. | RW |
| Blood Debt | R | 1 | unlock | B | ✓ | Power. Whenever another ally heals, deal that much to a random enemy. *(cross-party: Clemence)* | NEW |
| Crimson Communion | R | 2 | worn | G | ✓ | Deal 7 to ALL enemies. ALL allies share the damage dealt as healing. | K |

Totals 21 C / 11 R · Burst 19, Grind 11, Tempo 2 · Ally 8 · Choose One: Red Choice.
Broken forms: common Hamstring → Cripple; rare Nightfall → Moonfall (live). Crimson Arc keeps Prey No More.
Heal audit: every heal here is Drain (paid by hitting) or paid in her HP, except Nightfall's 2/enemy.

### 4.4 Cinder — Order / Stride

Sisters: **Lanes** (default, new) *front and back both pay* · **Vanguard Plume** damage, forward only ·
**Marshal** moves and props up allies · **Ashfall** recklessness (self-debuff, never Weak). Stride now
also comes from gaining a debuff (§3).

| Card | R | E | Gate | F | A | Effect (rate) | From |
|---|---|---|---|---|---|---|---|
| **Lanes** | | | | | | | |
| Longspear | C | 1 | base | B | | Deal 6. If Cinder is at the back, deal 6 more. | RW |
| Guard the Rear | C | 1 | base | G | ✓ | Cinder gains 7 tHP. If she is at the back, the front ally gains 7 too. | NEW |
| Spend the Spark | C | 1 | base | B | | **Choose one:** gain 8 tHP; or spend all Stride: deal 4 per Stride spent. | NEW |
| Turn the Line | R | 1 | base | T | ✓ | Reverse your party's order. Draw 2. Deal 4 to ALL enemies. | K |
| Ember Watch | R | 2 | base | G | ✓ | Power. At the end of your turn: at the front, deal 6 to ALL enemies; at the back, ALL allies gain 4 tHP. | NEW |
| **Vanguard Plume** | | | | | | | |
| Flame Charge | C | 1 | base | B | | Cinder charges to the front. Deal 5, plus 3 per place crossed. | RW |
| Scorch | C | 1 | base | B | | Deal 5 twice. | NEW |
| Take Point | C | 1 | base | B | | Gain 1 Vanguard. Deal 5. | NEW |
| Flurry of Embers | R | 2 | base | B | | Deal 6 four times, +2 each while Cinder is at the front. (24–32) | NEW |
| Hot Pursuit | C | 1 | unlock | B | | Deal 6. If Cinder has moved this turn, 6 more and draw 1. | RW |
| Blaze | C | 2 | unlock | B | | Deal 16; 22 if Cinder is at the front. | NEW |
| Kindling | C | 1 | unlock | B | | Gain 3 Fleeting Strength. Draw 1. | NEW |
| Beacon Flame | R | 2 | unlock | B | | Deal 10 to ALL enemies and inflict 1 Sundered on ALL. *(cross-party: every attacker)* | NEW |
| Sunspear | R | 2 | worn | B | | Deal 30. Playable only while Cinder is at the front. | NEW |
| **Marshal** | | | | | | | |
| Point of the Spear | C | 1 | base | B | ✓ | An ally moves to the front and gains 1 Vanguard. | K |
| Pull Back | C | 1 | base | G | ✓ | An ally moves to the back, loses 8 Lust and gains 4 tHP. | RW (was 0) |
| Rotate the Line | C | 1 | base | G | ✓ | Swap places with an ally. You both gain 5 tHP. (built: no front↔back swap verb) | NEW |
| Formation Drill | R | 1 | base | G | ✓ | Power. Whenever an ally moves, they gain 3 tHP. | NEW |
| Relieve | C | 1 | unlock | G | ✓ | Cinder moves to the back. The new front ally gains 8 tHP and 1 Taunt. | NEW |
| Battle Orders | C | 1 | unlock | B | ✓ | An ally gains 2 Fleeting Strength; 4 if they moved this turn. | NEW |
| Double Back | C | 0 | unlock | T | | Cinder moves to the back. If that crossed 2+ places, gain 1 Energy. | K |
| Pincer | R | 2 | unlock | B | ✓ | Deal 6, plus 6 per ally who has moved this turn. *(cross-party)* | RW |
| Rally the Ranks | R | 2 | worn | B | ✓ | ALL other allies gain 2 Strength. Cinder moves to the back. | NEW |
| **Ashfall** | | | | | | | |
| Reckless Swing | C | 1 | base | B | | Deal 12. Cinder gains 2 Sundered. | NEW |
| Burn Bright | C | 1 | base | T | | Cinder gains 1 Sundered. Draw 2. | NEW |
| Ember Skin | C | 1 | base | G | | Gain 3 tHP, plus 3 per debuff on Cinder. | NEW |
| Phoenix Heart | R | 1 | base | B | | Power. Whenever Cinder gains a debuff, deal 4 to the front enemy. | NEW |
| Ashen Cloak | C | 1 | unlock | G | | Remove all debuffs from Cinder. Gain 5 tHP per debuff removed. | NEW |
| Firewalk | C | 1 | unlock | B | | Cinder moves to the back. Deal 5 per debuff on Cinder. | NEW |
| Pass the Flame | C | 1 | unlock | B | | Move all Cinder's debuffs onto an enemy. Deal 4. | NEW |
| Trial by Fire | R | 1 | unlock | B | ✓ | Every ally gains 1 Sundered and 2 Strength. *(cross-party)* | NEW |
| Cinders to Ash | R | 2 | worn | B | | Deal 8 plus 5 per debuff on Cinder to ALL enemies. | NEW |

Totals 21 C / 11 R · Burst 21, Grind 8, Tempo 3 · Ally 12 · Choose One: Spend the Spark.
Broken forms: common Hot Pursuit → Lost Trail; rare Pincer → Closing Jaws (live).

### 4.5 Clemence — Lust / Broken / Devotion

Sisters: **Mercy** (default, per Noodle's note in §4.3: *healing in general*) · **Devotee** make breaking
hard (tHP raises the break line; she never soothes) · **Ecstatic** rush her own break · **Abbess** break
allies (Sanctified). Heals pay in her Lust. Devotion comes from health and tHP given (§3). **No card or
broken form here reduces an ally's Lust (§2).**

Broken forms (Noodle, session 33 — replaces "a broken Clemence is the moment the Lust comes out"):

> That is a lot of broken cards that spend lust. Like almost all of them. The gameplay loop might not be
> very fun to keep having her bounce in and out of the form, and if the player gets tired of the
> animation I worked hard on, that'd be really sad. I'd say that it should be about as rare (rule of
> thumb) as Brienne spending tHP. In general though, […] the main things about her entering the broken
> state should be:
> * Starter and common cards are now balanced at numbers as if they were rares
> * Rare cards are probably the ones that spend lust for payoff
> * Especially in Ecstatic, she becomes a danger to the party with how much lust she's putting out

- **Starter and common forms:** the same card at the rare rate (≈ +40%), no Lust spent.
- **Rare forms:** spend her own Lust for the payoff — 10 of 32 forms, against Brienne's 9 tHP-spenders.
- **Ecstatic forms** throw Lust onto her own party as well as the enemy.
- Her starters follow the same rule: Outpouring (Offering/Grant) and the Tempt form become the starter's
  own effect at the rare rate; the fallback Rapture is "ALL allies heal 4".

| Card | R | E | Gate | F | A | Effect (rate) | From | Broken form |
|---|---|---|---|---|---|---|---|---|
| **Mercy** | | | | | | | | |
| Mending Word | C | 1 | base | G | ✓ | An ally heals 7. Clemence gains 4 Lust. | NEW | **Fevered Word:** an ally heals 10. Clemence gains 4 Lust. |
| Lay On Hands | C | 2 | base | G | ✓ | ALL allies heal 5 (6 if they have Lust). Clemence gains 8 Lust. | K | **Benediction** (live, rewritten): ALL allies heal 7 (8 if they have Lust). Clemence gains 8 Lust. |
| Heavenly Gaze | C | 1 | base | B | | Inflict 9 Lust. If Clemence has more Lust than the target, draw 1. | NEW | **Rapt Gaze:** inflict 13 Lust; draw 1 if Clemence has more Lust than the target. |
| Martyr's Vow | R | 1 | base | G | ✓ | Power. Whenever Clemence's Lust rises or falls, the most hurt ally heals half as much. Clemence gains 4 Lust. | RW (was C) | **Martyr's Joy** (live): gain Martyr's Vow; spend up to 6 of her Lust. |
| Font of Grace | R | 2 | base | G | ✓ | Power. At the start of your turn, the most hurt ally heals 5. Clemence gains 3 Lust. | NEW | **Overflowing Font:** gain Font of Grace; spend up to 10 of her Lust, the most hurt ally heals half that. |
| **Devotee** | | | | | | | | |
| Sheltering Grace | C | 1 | base | G | ✓ | An ally gains 9 tHP (12 if they have Lust). Clemence gains 4 Lust. | RW | **Radiant Aegis** (live, rewritten): an ally gains 12 tHP (16 if they have Lust). |
| Answered Prayer | C | 1 | base | G | ✓ | **Choose one:** an ally heals 7; or spend 8 Devotion: gain 1 Energy and draw 2. | NEW | **Prayer Unbound:** choose one: an ally heals 10; or spend 8 Devotion: gain 1 Energy and draw 3. |
| Stay With Me | C | 1 | base | G | ✓ | An ally gains tHP equal to their Lust (up to 12). | NEW | **Hold Me Close:** an ally gains tHP equal to their Lust (up to 16). |
| Sanctuary | R | 2 | base | G | ✓ | ALL allies gain 10 tHP. Clemence gains 6 Lust. | NEW | **Sanctum:** spend up to 15 of her Lust; ALL allies gain a third as tHP, ALL enemies take a third as Lust. |
| Mercy | C | 1 | unlock | G | ✓ | The most hurt ally heals 10. Clemence gains 6 Lust. | NEW | **Tender Mercy:** the most hurt ally heals 14. Clemence gains 6 Lust. |
| Bear the Weight | C | 1 | unlock | G | ✓ | An ally and Clemence each gain 7 tHP. Clemence gains 3 Lust. | NEW | **Borne Together:** an ally and Clemence each gain 10 tHP. |
| Hair Shirt | C | 1 | unlock | G | | Clemence gains 10 tHP and 4 Lust. | RW (no longer soothes) | **Scourged:** Clemence gains 14 tHP and 4 Lust. |
| Blessing | R | 1 | unlock | G | ✓ | Power. Whenever any ally gains tHP, they gain 2 more. *(cross-party: Brienne, Cinder)* | NEW (was Benediction: name clash, and it soothed) | **Blessed Host:** gain Blessing; spend up to 8 of her Lust, ALL allies gain half as tHP. |
| Miracle | R | 2 | worn | G | ✓ | ALL allies heal 12. Exhaust. | NEW | **Wonder:** spend ALL of her Lust; ALL allies gain half as tHP. Exhaust. |
| **Ecstatic** | | | | | | | | |
| Fervent Prayer | C | 0 | base | T | | Gain 1 Energy. Clemence gains 7 Lust. | RW (was R) | **Ecstatic Prayer** (live, rewritten): gain 2 Energy. A random ally gains 6 Lust. |
| Confide | C | 1 | base | T | | Draw 3. Clemence gains 5 Lust. | RW | **Unburden** (live, rewritten): draw 4. A random ally gains 5 Lust. |
| Wanton Gaze | C | 1 | base | B | | Inflict 10 Lust. Clemence gains 5 Lust. | NEW | **Wanton Release:** inflict 14 Lust. ALL other allies gain 3 Lust. |
| Ecstasy | R | 2 | base | B | | Gain Ecstasy. Clemence gains 8 Lust. | K | **Beatitude** (live): gain Ecstasy, draw 2. |
| Confession | C | 1 | unlock | B | | Inflict 6 Lust and 2 Sensitive. Clemence gains 4 Lust. | RW | **Penance** (live, rewritten): inflict 8 Lust and 3 Sensitive. A random ally gains 4 Lust. |
| Let Go | C | 1 | unlock | B | | Clemence gains 12 Lust. Inflict Lust equal to half of Clemence's on an enemy. | NEW | **Let It Out:** inflict Lust equal to Clemence's on an enemy, and half as much on a random ally. |
| Soft Words | C | 1 | unlock | B | | Inflict 1 Weak and 6 Lust; draw 1 if it already had Lust. Clemence gains 3 Lust. | RW | **Cast It Out** (live, rewritten): inflict 1 Weak and 9 Lust; draw 1 if it had Lust. A random ally gains 3 Lust. |
| Rapture's Gift | R | 1 | unlock | B | ✓ | Power. When Clemence Breaks, ALL other allies gain 2 Strength and 8 tHP. *(cross-party)* | NEW | **Gift Given:** spend up to 12 of her Lust; ALL enemies take that much, ALL other allies gain half. |
| Surrender | R | 1 | worn | B | ✓ | ALL allies heal 6. Clemence gains Lust until she Breaks. Exhaust. | K | **Revelation** (live): spend ALL of her Lust; ALL enemies take that much. Exhaust. |
| **Abbess** | | | | | | | | |
| Sanctify | C | 1 | base | B | ✓ | An ally gains Sanctified. Clemence gains 5 Lust. | K | **Consecrate** (live, rewritten): an ally gains Sanctified and 6 tHP. |
| Fallen Vigil | C | 1 | base | G | ✓ | An ally heals 5; if Broken, 5 more and draw 1. Clemence gains 4 Lust. | K | **Keep Faith** (live, rewritten): an ally heals 7; if Broken, 7 more and draw 1. |
| Kindled Want | C | 1 | base | B | ✓ | An ally gains 6 Lust and 3 Fleeting Strength. | NEW | **Stoked Want:** an ally gains 8 Lust and 4 Fleeting Strength. |
| Broken Saints | R | 1 | base | B | ✓ | ALL Broken allies gain 3 Strength and 8 tHP. Clemence gains 6 Lust. | NEW | **Fellowship of the Fallen:** spend up to 12 of her Lust; ALL Broken allies gain 1 Strength per 4 spent. |
| Ordeal | C | 1 | unlock | B | ✓ | An ally gains 10 Lust and 10 tHP. | NEW | **Trial:** an ally gains 13 Lust and 13 tHP. |
| Penitent's Draw | C | 1 | unlock | T | ✓ | An ally gains 6 Lust. Draw 2. | NEW | **Confessor:** an ally gains 8 Lust. Draw 3. |
| Anoint | C | 1 | unlock | G | ✓ | A Broken ally heals 12 (healing is how a Broken ally recovers without a soothe). Clemence gains 6 Lust. | NEW (replaces Absolving Touch, which soothed) | **Last Anointing:** a Broken ally heals 16. |
| Shared Fever | R | 1 | unlock | B | ✓ | Each other ally gains 6 Lust. Gain 2 Energy. *(cross-party)* | RW (was C) | **Shared Release** (live, rewritten): spend up to 10 of her Lust; gain 1 Energy per 5 spent; draw 1. |
| Communion | R | 2 | worn | B | ✓ | ALL allies gain Sanctified. Clemence gains 10 Lust. Exhaust. | K | **Rapturous Host** (live): ALL allies gain Sanctified; spend ALL of her Lust, ALL enemies take a third as Lust. Exhaust. |

Fallback broken form **Rapture** (live: "ALL allies lose 5 Lust and heal 3 HP") becomes **ALL allies heal
4 HP** — it covers only the starters that name no form.

Totals 21 C / 11 R · Burst 14, Grind 15, Tempo 3 · Ally 23 · Choose One: Answered Prayer · Broken forms: all 32 named, 10 spend her Lust.
The sim's warning (Shared Fever 82%, Confession 81% over-drafted) is answered by gating both behind an
outfit and pricing Shared Fever as a rare.

### 4.6 Cassadora — Intents / the Orb

Sisters: **Intents** (default, per Noodle's note in §4.3: *intents in general* — reading them, changing
them, and the Orb that records the changes) · **Soothsayer** her own deck · **Grifter** steal intents ·
**Hedge Witch** enemy debuffs.

| Card | R | E | Gate | F | A | Effect (rate) | From |
|---|---|---|---|---|---|---|---|
| **Intents** | | | | | | | |
| Twist Fate | C | 1 | base | G | | Deal 5. The target picks a new intent. | NEW |
| Omen | C | 1 | base | B | | Deal 4, plus 3 per enemy intending to attack and 2 per filled Orb quadrant. | NEW |
| Cross My Palm | C | 1 | base | T | | **Choose one:** change an enemy's intent; or empty the Orb: draw 1 per quadrant, +1 Energy if it was full. | NEW |
| Evil Eye | R | 1 | base | B | | Power. Whenever an enemy's intent changes, deal 6 to it. | RW (live Jinx, renamed: ends the Jinx clash) |
| Wheel of Fortune | R | 2 | base | G | ✓ | Reroll ALL enemy intents. For each that is no longer an attack, ALL allies gain 4 tHP. | NEW |
| **Soothsayer** | | | | | | | |
| Encore | C | 1 | base | T | | Draw 2. Scry 2. | RW |
| Divination | C | 1 | base | T | | Scry 4. Draw 2. (audit: draw 1 sat under the floor) | NEW |
| Palm Reading | C | 1 | base | T | ✓ | Draw 1 of an ally's cards. That ally gains 5 tHP. | NEW |
| Augury | R | 1 | base | T | | Power. Scry 2; draw 1 more card at the start of each turn (Focus). (renamed twice: Second Sight is Soothsayer's A2; Clairvoyance+ overflowed the small frame) | NEW |
| Reshuffle | C | 1 | unlock | T | | Draw 3. Discard a random card. | NEW |
| Card Up the Sleeve | C | 1 | unlock | B | | Return a card from your discard pile to your hand. It costs 1 less this combat. | NEW |
| Portent | C | 1 | unlock | G | | Scry 3. Gain 6 tHP. | NEW |
| Destiny's Hand | R | 1 | unlock | B | ✓ | Draw one card belonging to each other ally. Gain 1 Energy. *(cross-party)* | NEW |
| Tarot Spread | R | 1 | worn | T | | Scry 5. Draw 3. (audit: 1 cost) | NEW |
| **Grifter** | | | | | | | |
| Understudy | C | 1 | base | B | | Steal an enemy's intent. Draw 1. | K |
| Mirror Fate | C | 1 | base | B | | Deal 4 plus the damage the enemy intends to deal. | RW |
| Sleight of Hand | C | 1 | base | G | | The target picks a new intent. If it was going to attack, draw 2. | NEW |
| Pilfer | R | 1 | base | B | | Steal an enemy's intent: it costs 0 and exhausts. The enemy picks a new one. | K |
| Turncoat | C | 1 | unlock | G | | Apply 1 Turncoat. Exhaust. (the signature Misdirect does not exhaust) | RW |
| Double Cross | C | 1 | unlock | B | | Deal 6; 14 if the enemy is a Turncoat. | NEW |
| Fence | C | 1 | unlock | T | | Exhaust a card from your hand. Gain 2 Energy. (1 cost: a 0-cost energy card needs a real price) | NEW |
| Accomplice | R | 1 | unlock | B | ✓ | Steal an enemy's intent; it costs 0. The front ally gains 2 Fleeting Strength. *(cross-party)* | NEW |
| Grand Heist | R | 2 | worn | B | | Steal ALL enemies' intents. Exhaust. | NEW |
| **Hedge Witch** | | | | | | | |
| Curse | C | 1 | base | B | | Inflict 2 Sundered and 1 Weak. | NEW |
| Enfeeble | C | 1 | base | G | | Inflict 2 Weak; 1 Weak on another random enemy. | NEW |
| Warded Fate | C | 1 | base | G | ✓ | An ally gains 7 tHP and loses 3 Lust. A random enemy picks a new intent. | RW |
| Malediction | R | 1 | base | B | | Double every debuff on an enemy. Exhaust. | NEW |
| Frailty | C | 1 | unlock | B | | Deal 6. Inflict 2 Frail (strips enemy tHP gains). | NEW |
| Spread Misfortune | C | 1 | unlock | G | | Copy every debuff on the target onto every other enemy. | NEW |
| Bad Luck | C | 1 | unlock | G | | Inflict 1 Weak and 1 Sundered on ALL enemies. | NEW |
| Coven's Curse | R | 1 | unlock | B | ✓ | Power. Whenever an ally gives an enemy a debuff, it takes 3. *(cross-party: Nettle, Clemence)* | NEW |
| Witch's Brew | R | 2 | worn | G | | Inflict 3 Weak, 2 Sundered and 2 Frail on ALL enemies. | NEW |

Totals 21 C / 11 R · Burst 14, Grind 10, Tempo 8 · Ally 6 · Choose One: Cross My Palm.
Broken forms: common Mirror Fate → Shattered Mirror (live); rare → **Stillness Within repointed to Wheel
of Fortune** (its old card, Hex of Stillness, is cut).

## 5. Verdicts on the live pool

Every live card not named in §4 is **CUT**: retire through `honeycomb.retiredCardArray`, definitions to
`../../Archive/RETIRED-CARDS-S33.md`, replacement named in the entry.

| Cut | Why | Replacement |
|---|---|---|
| brienneSteady | Tier A; soothe with no engine | Alms |
| brienneShelter | overlaps Intercept and Sheltering Grace | Intercept |
| nettleSoulHarvest | 0-draw/energy engine; the Soul cash moved to a Choose One | Grave Choice |
| severineStrike (Rake) | Tier A; vanilla body | Bloodthirst |
| severineEnthrall | Lust on Severine has no sister | Bloodthirst |
| severineBloodlet | Tier B; value only through payoffs | Blood Price |
| severineVitalFlow | merged into Heartsblood | Heartsblood |
| cinderFallBack | 0-cost draw | Burn Bright |
| cinderEmberwake (Trailfire) | no sister reads it; Stride source is now debuffs | Phoenix Heart |
| cinderCometLance | moving back then forward is Marshal's job, not Vanguard's | Sunspear |
| clemencePenitence | 0-cost +2 Energy | Fervent Prayer |
| clemenceTakeBurden | moved Lust off an ally (§2: Clemence never soothes) | Mercy |
| clemenceYearning | folded into Confession | Confession |
| cassadoraFizzle, cassadoraStillness | cancel-intent control nobody builds around (Tier A) | Wheel of Fortune |
| cassadoraCrystalGaze | Tier A; lowest strength in the game | Sleight of Hand |
| cassadoraPuppetStrings | Tier A | Accomplice |

Neutral cards are outside this brief.

**Engine asks** (each one verb or one table entry; none exists yet): value `carriedTemporaryHealth`
(Oath); effect `tickStatus` (Quicken Rot, Death Knell); effect `moveStatuses` (Pass the Flame); a
stolen-card filter (Fence); statuses for the new powers (Unbroken Oath, Rot Garden / Plague Bearer as one
status with a duration, Aphrodisiac, Scar Tissue, Blood Debt, Ember Watch, Formation Drill, Phoenix
Heart, Blessing, Font of Grace, Rapture's Gift, Second Sight, Coven's Curse). Evil Eye reuses the `jinx` status.

## 5b. What was built (session 33)

- **Gates:** a gated card carries `offerCondition` — `outfitUnlocked` (new condition, reads `honeycomb.unlocks`) or
  `wearsOutfit`. Sisters are `archetype` indices (24 in `honeycomb.archetypeArray`, each naming its outfit); an
  outfit's `archetypeWeightArray` boosts ×3 / reduces ×0.5 per OUTFITS-LIST.
- **Powers as tables:** `honeycomb.reactionHooks([...])` (honeycomb-entities.js) builds a status's hooks from
  reaction entries (hook, subject, eventSource, condition, targetMode, effectArray). The 13 new power statuses use it.
- **New verbs:** effects `triggerStatus` (a status's `tickHook` acts now) and `transferStatuses` (move / copy /
  double debuffs); target modes `mostHurtAlly`, `weakestEnemy`; collection `woundedEnemies`; world events
  `onAllyTemporaryGained`, `onEnemyLustGained`; member fields `carriedTemporaryHealth` and
  `healthLostLastEnemyTurn`, written at the turn boundary.
- **Art owed:** `artOwed: true` draws the named placeholder without a request; the art tests count it as planned.
- **Test fixtures:** eight retired cards that engine tests read by name live on as `LEGACY_CARD_FIXTURES` in the
  test file only (never offered).
- **Not built, by design:** a verb summing every enemy's intended damage (Take the Hit counts attackers instead),
  a cost-changing condition (Pounce refunds Energy instead), a front/back swap (Rotate the Line swaps with a
  chosen ally).
- **Rate audit:** a static per-energy pass flagged Divination, Tarot Spread and Frailty under the floor (fixed);
  Blood Pact, Venom Sac and Trial by Fire sit high but pay for it (HP, a one-shot, party-wide Sundered).

## 6. Done means

- `node "!designDocs/honeycomb/tools/budget-audit.js"`: baseline output ≥ 12 a turn on early normals; `heal` column per §2.
- `node "!designDocs/honeycomb/tools/test-honeycomb.js"` green; content tests that pinned old cards repointed, not deleted.
- `honeycomb.warnings.report()` 0 active; `duplicateCardRules` clean; `cardFit` clean. Add a warning rule
  for §1.1 (pool shape per character) and §1.3 (one Choose One).
- Every card has an art prompt line in `../../tools/card-prompts.js` (the Brienne standard) — or is listed as owed.
- FEEDBACK-07 board and CATCH-UP updated as each character lands, not at the end.
