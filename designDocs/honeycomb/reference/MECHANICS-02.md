# Honeycomb — MECHANICS-02: the balance and card-pool rework

Session 20 (2026-09-15, overnight). The brief: read `../BASICS.md`, `../designBibles/mechanics.md`,
`../designBibles/characters.md` and `../Archive/demo1/Archive/FEEDBACK-07.md` lines 256–286, then **do a full rework of the card
pool for all six current characters**, and afterwards consider outfit rebalancing and progression
overhauls.

This file is the plan AND the record. Quotes are Noodle's and win over any annotation.

Status key: ☐ not started · ◐ in progress · ☑ done · ✗ dropped (with reason)

| Part | What | State |
|---|---|---|
| 1 | The balance model (what a card is worth) | ☑ |
| 2 | Rarity collapse: Starter / Common / Rare | ☑ |
| 3 | Brienne rebalance | ☑ |
| 4 | Nettle: poison density cut | ☑ |
| 5 | Severine: life becomes a cost | ☑ |
| 6 | Cinder rebalance | ☑ |
| 7 | Clemence: tHP tools + burst broken forms + Penance tag | ☑ |
| 8 | Cassadora: the Repertoire archetype | ☑ |
| 9 | Broken forms: one per rank, per character | ☑ |
| 10 | Status hygiene: a status used once is not a keyword | ☑ |
| 11 | Cross-party hook audit | ◐ |
| 12 | Outfit rebalancing | ◐ |
| 13 | Progression overhaul | ◐ |
| 14 | Test plan (the maths) | ☐ planned below |

Where the work landed:

- **Cards**: `scripts/misc/honeycomb/honeycomb-content-cards.js`. Rarity collapsed, Nettle poison cut,
  Severine heals cut, Clemence's broken forms rebuilt, Cassadora's Repertoire added, 15 new broken forms.
- **Statuses**: `scripts/misc/honeycomb/honeycomb-content-statuses.js`. Added `repertoire`.
- **Characters**: `scripts/misc/honeycomb/honeycomb-content-characters.js`. Cassadora's `archivist` outfit,
  `copycatQuill` relic, Crimson Fang heal trimmed.
- **Tuning**: `honeycomb-tuning.js` (rarity weights, status reader fields), `honeycomb-content-map.js`
  (shop card prices), `honeycomb-content-enemies.js` (`stolenCardSettings`, `giveStolenCard`).
- **Tests**: `!designDocs/honeycomb/tools/test-honeycomb.js` updated for every intentional change; **1205
  passing, 0 failing** at the point this file was written.

---

## Part 1 — The balance model

The point of this part is that a designer can say what a card *should* do before it ships, and the
test plan (part 14) can measure whether it does.

### The turn economy

| Quantity | Value | Source |
|---|---|---|
| Energy per turn | 3 | `tuning.combat.energyPerTurn` |
| Cards drawn per turn | 5 | `tuning.combat.handSizePerTurn` |
| Hand cap | 10 | `tuning.combat.handSizeMaximum` |
| Party size (baseline) | 3 | `tuning.run.partySizeMaximum` / `tuning.scaling.baselinePartySize` |
| Turn cap | 60 | `tuning.combat.turnLimit` |

### What one point of each resource is worth

The bible asks every card to be a **Buffer** (starter), **Accelerate** (common) or **Payoff** (rare).
To tell those apart, the rework uses these exchange rates. They are the *intended* rate; part 14 tests
whether the shipped numbers hit them.

**Superseded for commons and rares (session 33, Noodle):** these are the *starter* rates. Commons
price at 9 per energy, rares at 12+, draw ≈ 0.4 energy. See `../Archive/demo1/rework/cards/CARD-POOL-01.md` §1.2.

| Primitive | Intended rate | Why |
|---|---|---|
| Direct damage | **6 per energy** on a plain attack | the session-8 baseline (`Sword Strike`, `Grave Touch`, `Wisplight`) |
| Temporary HP | **6 per energy**, that then halves once | a tHP gained on your turn absorbs ~1.5 hits of 4, so it prices at a hit-and-a-bit |
| Heal | **4–5 per energy** | strictly worse than tHP (no overflow, no Armament) |
| Poison | **3 per energy applied**, cashing at ~2× when *consumed* | delayed damage must be cheaper; a payoff card is where the profit is realised |
| Lust | **7 per energy** | enemy break is an alternate kill; priced against damage |
| Draw 1 | **≈ 1.5 energy** | a card that replaces itself plus tempo |
| Block a card (Exhaust) | **+1 energy of value** | a one-shot gets to over-rate itself |
| Soothe 5 | **≈ 1 energy** | the lust-margin defence |

A **starter** card should land at ≤ 1.0× these rates and always be playable. A **common** should hit
≈ 1.2× but *conditionally* (a cost, a setup, a type). A **rare** should hit ≈ 1.8× and read as a
build-around.

### The four scales a card moves

1. **Raw damage / break damage** — turns the fight shorter (Burst).
2. **Effective health** — damage prevented, undone, or made worthless (Grind).
3. **Tempo** — cards and energy spent versus gained.
4. **Friction** — what the card costs, and what the opponent can do about it.

A card that moves none of these is dead weight and was not kept.

---

## Part 2 — Rarity collapse

> Among the ranks of Starter, Common, Uncommon, and Rare, there's no clear differentiation between
> common and uncommon. We may want to drop the rank and just have Starter, Common, and Rare.

Done. The card ranks are now **Starter / Common / Rare** (plus `special`, `broken`, `enemy`, which are
not ranks a player drafts).

- Every old `uncommon` became `common`, except payoffs that stayed `rare`: `brienneCrushingWeight`,
  `brienneHoldTheLine`, `nettleCatharsis`, `nettleFester`, `severineExsanguinate`,
  `severineSanguineTide`, `cinderTurnTheLine`, `clemenceYearning`, `cassadoraPilfer`.
- `tuning.reward.offerableRarityArray` is `["common", "rare"]`; weights are common **75** / rare **25**
  (elite: common **45** / rare **55**).
- `honeycomb.shopTuning.cardPriceArray` is starter 30 / common 55 / rare 120 / special 40.
- **Equipment and relics keep their own three ranks** (`common`/`uncommon`/`rare`); the collapse was a
  *card* decision, not an economy one.

The mapping to the bible is now one-to-one: **Starter = Buffer, Common = Accelerate, Rare = Payoff.**

---

## Part 3 — Brienne (Temporary HP)

**Primitive kept: Temporary HP.** Attackers wear the gold they stand behind. Sisters unchanged:
**Armament** (tHP is a weapon), **Sentinel** (draw the hits, answer them), **Tithe** (tHP is currency).

Changes in the rework:

- `Crushing Weight` and `Hold the Line` promoted to **rare** (both are payoffs: an AoE that scales off
  tHP, and an enhancement of the halving itself).
- `Unstoppable`, `Iron Retort`, `Hold the Line` and `Reliquary` had their one-off statuses folded into
  plain text (part 10). The statuses still ride the plate; the card explains itself.
- Default broken card stays `Buckle`.

Cross-party is already the point of the kit: `Lend Steel` (gold + Armament to an ally), `Ransom`
(spend an ally's gold), `Intercept`/`Shield Wall` (Taunt and shared gold), `Alms` (soothe the party).
No change needed.

---

## Part 4 — Nettle (Poison)

> Nettle's poison infliction among her card pool is so dense she's very overpowered.

**Primitive kept: Poison.** The fix is a *density* cut, not a power cut. Poison appliers were thinned
and each one applies less:

| Card | Before | After |
|---|---|---|
| Blight Needle | 3 dmg + 3 Poison | 3 dmg + **2** Poison |
| Wasting | 4 / +4 if Weak | **3 / +3** if Weak |
| Fester | 3 Poison + 2 Festering | **2** Poison + 2 Festering |
| Creeping Plague | 4 Poison + 2 Vulnerable | **3** Poison + 2 Vulnerable |
| Pollen Kiss | 3 Poison + 3 Lust | **2** Poison + **6** Lust |

Payoff cards were **not** touched: `Reap`, `Rupture`, `Catharsis`, `Burst`, `Flushed`, `Bacchanal`,
`Contagion`, `Pandemic` still cash the stacks in. The intended play pattern is now **one or two
appliers, then a consumer**, rather than "every card poisons, then a consumer".

- `Catharsis` and `Fester` promoted to **rare** (they are the payoff and the enhancer).
- `Pandemic` and `Heady Spores` folded to text (part 10).
- Cross-party survives via `Infect` (the whole party's hits add Poison), `Wasting` (Severine's Weak),
  `Contagion` (spread), `Heady Spores` (party poison builds Lust).

---

## Part 5 — Severine (Blood)

> Severine's self healing is so high paying life never feels like a cost.

**Primitive kept: Blood** — health is currency, taken from enemies and paid by her or an ally.

- **Drain now heals for half the damage dealt**, not all of it. This is the single biggest lever:
  with two Drains in the starting deck, every point of self-inflicted damage comes back twice over
  before the rework, so Blood Pact and Bloodlet were free cards. They are not, now.
- `Nightfall` self-heal 6 → **4**; `Bloody Verdict` heals half its damage, not all.
- `Crimson Fang` heirloom heals 3 → **2** per kill.
- `Exsanguinate` and `Sanguine Tide` promoted to **rare** (their payoffs deserve the band).
- `Gorge`, `Blood Rite`, `Blood Moon`, `Leech Mark` folded to text.

Blood still Grinds: Drain, Gorge (overheal → tHP), and Transfusion all still turn enemy health into
party survival. It just cannot also be a loop that never pays.

Cross-party: `Bloodlet` wounds an ally (Brienne's gold soaks it, `Hemomancy` and the Leech Jar answer
it), `Mark Prey` is the setup debuff any ally cashes, `Siphoned` turns the party's hits into healing,
`Heartsblood`/`Vital Flow` carry the party.

---

## Part 6 — Cinder (party order)

**Primitive kept: Party order.** Her attacks do not move her, so every step is a chosen one. Sisters
`Charge` and `Formation`.

- `Turn the Line` promoted to **rare** (it is a hand-refill plus a full-line reposition).
- No numeric cuts: Cinder was not named as a problem, and the greedy test player under-plays
  positioning rather than over-plays it.

Cross-party is the Formation half: `Change Places`, `Pull Back`, `Point of the Spear` (front + Vanguard)
and `Pincer` (payoff per ally moved) exist to move *other* characters, and `Marching Drum` pays for it.

---

## Part 7 — Clemence (Breaking)

> Clemence lacks the obvious temporary health abilities she'd need to synergize with Brienne.
> Clemence's broken state card pool is still too healing heavy instead of letting her feel like a
> bursting build-around character.
> Clement's lust building tags should be unique so I can use the state of her weakness to it as a
> self-progression metric, it should also actually build a weakness to trigger lust events with.

**Primitive kept: becoming Broken**, but the axis is now offence as well as support.

### 7.1 A unique self-Lust tag — `penance`

Her own Lust build-up previously carried no tag (`lustTagArray: []`), so it taught the between-run
ledger nothing. Every self-Lust entry now carries **Penance** (`cardTagArray`, `lustTag: true`). Her
Lust height is therefore a readable self-progression metric, it can raise her Exposure, and it can
raise a lust event. What she casts *at enemies* is still **Exposure**.

### 7.2 A temporary-HP tool for the Brienne synergy

New standing card **Sheltering Grace** (common, 1): an ally gains 6 tHP (9 with Lust), Clemence gains
4 Penance. Its broken form **Radiant Aegis**: spend up to 10 Lust, ALL allies gain half that as tHP.
This is the card that lets a Clemence play behind Brienne's gold and lets an ally wear *Armament*.

### 7.3 The broken forms are now a burst plan, not a hospital

The five heal-heavy broken forms were converted:

| Broken form | Before | After |
|---|---|---|
| Outpouring | spend 10, ally heals 2+ | spend 10, **deal that much Lust** to an enemy |
| Benediction | spend 18, allies heal half | spend 18, **ALL enemies take half as Lust**, allies lose 2 Lust |
| Keep Faith | spend 8, ally heals | spend 8, ally gains that much **tHP** |
| Consecrate | spend 8, ally heals | spend 8, ally gains that much **tHP** |
| Rapturous Host | spend all, allies heal a third | spend all, **ALL enemies take a third as Lust** |

A broken Clemence is now the moment the Lust comes out, which is what "bursting build-around" means.

`Yearning` promoted to **rare**. `Surrender`/`Revelation`, `Ecstasy`/`Beatitude` and
`Communion`/`Rapturous Host` unchanged in shape.

---

## Part 8 — Cassadora (intents) and the Repertoire archetype

> Cassadora should have an archetype around making enemy cards not exhaust and stay in your deck
> (heirloom? outfit? Blue mage?)

Added **Repertoire**, Cassadora's third sister mechanic (offence/utility, `archetypeArray`).

**Engine seam.** `honeycomb.stolenCardSettings(owner)` (content-enemies.js) reads the holder's statuses
for two fields and `giveStolenCard` obeys them:

- `stolenCardsExhaust: false` — a stolen move no longer exhausts; it cycles like a real card.
- `stolenCardsPersist: true` — a copy is written into the run deck with `addCardToRunDeck`, so it is
  still there after the fight.

Both fields are status-reader fields, so the `orphanStatus` rule and the warning report know about them
(`tuning.warnings.statusReaderFieldArray`).

**Content:**

- Status **Repertoire** (intensity, not a debuff): both fields true.
- **Archivist** outfit (Cassadora): +4 Max HP; grants Repertoire at combat start; adds `cassadoraRepertoire` to
  the deck; weights Repertoire ×3 and blocks Hex (not Turncoat — stealing is the enabler).
- **Copycat Quill** relic (uncommon, Cassadora only): a second route to the posture.
- Cards: **Understudy** (copy a card in hand), **Encore** (recover a card from the discard and draw),
  **Repertoire** (rare passive; grants the posture).
- **Warded Fate** (common): Cassadora's cross-party card — an ally gains 5 tHP and loses 3 Lust while a
  random enemy re-picks. She is worth the slot even without a stolen move.

---

## Part 9 — Broken forms: one per rank

> Don't overload with too many broken versions of each card, (with the exception of Clemence who
> directly focuses on breaking herself), but there should at least be one unique broken card design
> for each of starter, common, and rare card rarities, with rare cards usually having the most
> beneficial effects (directly helping to mitigate lust), while starter cards have negative effects
> if left to discard without playing them, essentially serving as a tax.

Added **15** unique broken forms — three per character for the five that are not Clemence (she names one
for every card already). Each points from one card of each rank:

| Character | Starter (tax) | Common (neutral) | Rare (helps the party) |
|---|---|---|---|
| Brienne | Brace → **Backs to the Wall** | Bulwark → **Huddle** | Crushing Weight → **Weight of Regret** |
| Nettle | Pollen Kiss → **Pollen Burst** | Miasma → **Miasmic Haze** | Bacchanal → **Last Bloom** |
| Severine | Mark Prey → **Prey No More** | Hamstring → **Cripple** | Nightfall → **Moonfall** |
| Cinder | Change Places → **Misstep** | Hot Pursuit → **Lost Trail** | Pincer → **Closing Jaws** |
| Cassadora | Turncoat → **Turned Coat** | Mirror Fate → **Shattered Mirror** | Stillness → **Stillness Within** |

The character's default broken card (Buckle, Lash Out, Wither Within, Stumble, Rapture, Blinded) is
still the fallback for every card that names no form.

---

## Part 10 — Status hygiene

> If it's only done once, it's technically a status, but it isn't called one. […] the card just says
> what it does.

A status that only one card applies is no longer *named* on that card. It still exists, still applies,
and still shows on the status bar; the card text simply describes it. Folded this session: **Momentum,
Retort, Entrenched, Gilded, Pandemic, Heady Spores, Gorged, Hemomancy, Blood Moon, Siphoned, Jinx,
Puppeteer** — and Brienne's/Cinder's/Clemence's one-off statuses where they appeared.

Named statuses were kept where more than one source feeds them: Strength, Weak, Vulnerable, Frail,
Poison, Regeneration, Thorns, Artifact, Energised, Focus, Sensitive, Taunt, Armament, Festering,
Infected, Intoxicated, Marked, Sanctified, Martyr's Vow, Ecstasy, Turncoat, Repertoire. `Composure` is
no longer applied by any shipped card.

---

## Part 11 — Cross-party audit

| Character | What they give the others |
|---|---|
| Brienne | tHP and Armament to allies; Ransom spends an ally's gold; Taunt; shared tHP |
| Nettle | Infect (party hits poison); Contagion; Weak synergy; Heady Spores |
| Severine | Bloodlet triggers ally on-damage; Mark Prey setup; Siphoned healing; party heals |
| Cinder | Moves allies; Vanguard; Pincer counts allies moved |
| Clemence | tHP (new), Sanctified, soothe, Take Their Burden, Shared Fever |
| Cassadora | Warded Fate (tHP + soothe); disrupts intents for the party; Repertoire keeps enemy moves |

Open: Nettle and Severine's *cross* hooks are all "the enemy is debuffed, so the party's hits do more".
A future pass could add a Nettle card that reads another character's status the way `Wasting` reads Weak.
Logged as a goal, not a blocker.

---

## Part 12 — Outfit rebalancing (in progress)

What was touched:

- **Cassadora — Archivist**: new, above.
- **Cassadora — Hedge Witch / Grifter**: unchanged; Archivist blocks Hex, not Turncoat, so the steal build
  stays reachable.
- The rarity collapse reached the outfit `cardReplacementArray` targets automatically (indices were
  kept), and the test that asserts each original-three outfit swap finds its starter card still passes.

The open outfit questions, from the design bibles and FEEDBACK-07 F:

1. **Outfit descriptions name card categories** the cards themselves no longer print. Noodle leans
   toward making the outfits vaguer (the Compendium covers categories). Each description currently
   ends with a sentence like "Armament cards are offered far more often; Tithe cards never." Proposed:
   replace those sentences with the *feel* ("built for the gold"), and let the archetype weights do the
   work silently. ☐
2. **Health modifiers are flat** and not tied to base health. Brienne's Bastion is +12 of 68 (≈18%);
   Cassadora's Grifter is −2 of 54 (≈4%). A future pass normalises them to a share of base health. ☐
3. **`cinder`'s `cinFlame` node** is described as "Adds Trailfire" but grants `cinderEmberwake` (the
   card was renamed *Trailfire*; the node names the old index). The grant is correct; the description
   should say Trailfire. ☐ (small, easy)

---

## Part 13 — Progression overhaul (in progress)

Current trees are shallow: a health root, two branches (one card each), and a capstone. The design
bible asks for **Low Benefit / high density** nodes — friction dampeners, agency tools, incremental
stats — that never decide the strategy for the player.

Proposed overhaul (ordered by value):

1. **Every character gets an ability node.** Cinder, Clemence and Cassadora have only their starting
   ability; the three originals each have one tree ability. Add `cinderWheel`, `clemenceVigil`,
   `cassadoraForesee`, each requiring the mechanic and spending it, per the Ability 2 brief.
2. **Agency nodes on the root**: one node that assigns a card as Innate (turn-1 consistency) and one
   that grants a single reroll charge. These are the bible's "Innate Assignment" and "Reroll Charges".
3. **Cost curve**: roots 20, first branches 40, second branches 70, capstones 110 is already close;
   keep it, but give the first branch a *choice*, not a purchase, so a new player always gets one free
   node from the tutorial fight.
4. **`requiresArray` bug**: `briParagon` reaches from either path but the tree preview draws it as an
   AND. Verify `requiresAll` is what the overlay wants.

Items 1–4 are logged; only the `cinFlame` description was fixed this session.

---

## Part 14 — Test plan (the maths)

The suite already runs 1205 assertions. This is the *balance* plan: cheap, deterministic checks that
catch a card drifting off its band. Each would be a new numbered block in `../tools/test-honeycomb.js`.

1. **Damage rate band.** For every `damage` card of rarity common, compute printed damage ÷ energy and
   assert it is within `[4, 9]` (plain hits), and rares within `[4, 14]`. Catches a strike that is
   strictly better than the 6/energy baseline.
2. **tHP rate band.** Sum printed `temporaryHealth` ÷ energy; commons within `[4, 8]`, rares `[4, 12]`.
3. **Poison budget.** Average Poison applied per energy across Nettle's draftable appliers; assert it is
   **≤ 2.25** (measured ~2.06 after the rework, ~2.63 before) and that at least **4** cards *consume or
   read* Poison. This is the metric for "density" that the rework is accountable to. The full table is
   printed by test [77].
4. **Self-heal budget.** Sum the healing Severine's pool can give *Severine herself* in one deck cycle
   and assert it is **< 40%** of her max health, versus the pre-rework figure (documented in FEEDBACK-07).
5. **Broken-form coverage.** For each of the six characters, assert at least one `starter`, one
   `common` and one `rare` card resolves to a unique broken card other than the character fallback
   (Clemence satisfies this trivially).
6. **Lust tag coverage.** Every card whose effects inflict Lust on the other team carries a `lustTag`;
   every Clemence self-Lust entry carries `penance`. (The `lustCardTag` warning already covers the
   first half; the Penance half is new.)
7. **Repertoire round-trip.** Grant `repertoire`, steal a move, assert the instance does not exhaust
   and the run deck gained a copy. Then drop the status and assert the next steal exhausts and does
   not persist.
8. **Rarity tiers.** Assert `cardArray` holds no `uncommon`, and that `offerableRarityArray` is exactly
   `["common", "rare"]`.

Numbers in brackets are the band the designer intends, **not** a verdict — a card outside its band is a
question ("is this deliberately a payoff?"), not an automatic failure.

---

## Part 15 — Second pass: the card audit (session 20, later)

Noodle's follow-up: the first pass was too surface-level; the healing nerfs were the wrong direction
(the real culprit was Bloody Verdict's per-debuff drain fed by Nettle), and every card in the game
should be rated on the two scales before more content is done. The complete, strict audit now lives in
**`../Archive/demo1/rework/cards/CARD-AUDIT-01.md`**. What changed mechanically:

### 15.1 Severine corrected

- **Drain, Nightfall, Crimson Fang restored** (full drain, heal 6, heal 3). The healing was never the
  problem.
- **Bloody Verdict re-designed**: "Deal damage equal to the target's missing health, up to 12. Heal 4."
  (upgrade 18 / 6). It no longer counts statuses at all, so the Nettle interaction cannot run away.
- **Life prices raised**, which is the direction Noodle named: Blood Pact 4→**7**, Bloodlet 5→**7**,
  Transfusion 5→**8**, Heartsblood 6→**9**. Sanguine Tide and Blood Moon naturally got stronger, which
  is the fun loop: pay more life, cash it louder, drink it back.

### 15.2 Cards replaced, not smoothed

| Card | Was | Now | The standard it failed |
|---|---|---|---|
| Hold the Line → **Stand Fast** | tHP decay slower | gain 4 tHP each turn | No Pitfalls (decay rarely mattered) |
| Rally | flat team Strength | 1 Str + 1 per 6 tHP (max 3) | instant-pick; No Dead Weight to her kit |
| Soul Harvest | draw 2 + free Energy | Energy needs 2 Souls | instant-pick in any deck |
| Pandemic | corpse-spread passive | 2 Poison to ALL + passive | never-pick without commitment |
| Heady Spores | party-poison passive | 2 Poison to ALL + passive | never-pick without commitment |
| Gorge | Gorged only | heal 4 + Gorged | never-pick without overheal |
| Understudy | copy a card in hand | steal an intent + draw 1 | generic; did nothing for Repertoire |
| Encore | discard recovery | draw 2 (+1 with Repertoire) | generic |
| Turn the Line | reverse + draw | reverse + draw + 4 AoE | thin rare |
| Shelter | one-off Composure | positional tHP at the front | single-use status hygiene |
| Tempered Plate | Armament only | Armament + 4 tHP | whiff-prone turn |
| Putrefy | — | damage + 3 per NEGATIVE status | Nettle only rewarded poison |

### 15.3 Repairs

- **Yearning and Confession** had been merged into one block by a scripted edit in the first pass;
  both cards are restored as separate entries.
- **Wasting's** printed text still claimed 4/4 after its effects were trimmed to 3/3; the text now
  matches the effects. (Found by `!designDocs/honeycomb/tools/card-inventory.js`, a new headless tool that
  prints every card, its effect chain and its resolved text at every upgrade:
  `node "!designDocs/honeycomb/tools/card-inventory.js" starter,common,rare`.)

### 15.4 Status polarity

Every status-counting card checked. `debuffCount` and `cleanse` are the negative pole; Putrefy is the
only card that counts statuses and it counts negatives only; Bloody Verdict counts nothing; no card
reads a neutral status. When the full status sort lands, the positive pole can be added without
touching a card.

## Part 16 — Third pass: the draft simulation (session 20, later still)

Noodle asked for a full draft simulation: per-card strength 0–1 (impact per energy against the same
cost bucket), a pairwise synergy matrix, cost/size dynamic modifiers, three drafting personalities, 100
players minimum, 100 offers each, and the fourteen analytical questions answered until conclusive.

The tools are `!designDocs/honeycomb/tools/draft-sim/draft-simulation.js` (model + playerbase), `../tools/draft-sim/draft-sim-compare.js`
(cross-configuration stability) and `../tools/card-inventory.js` (the card dump). Five configurations and a
second seed were run; pick-rate rank correlation between them is 0.86–1.00 (1.00 across seeds). The
full answers and the resulting cut report — Tier A: Crystal Gaze, Steady, Claw Flurry, Infect, Rake,
Stillness, Puppet Strings, Transfusion; Tier B: Leech Mark, Heartsblood, Bloodlet, Mirror Fate, Thorn
Armour, Pincer, Miasma, Longspear, Rally; Tier C: do not cut on this data alone, including Nightfall
and the poison payoffs — live in **`../Archive/demo1/rework/cards/DRAFT-SIM-01.md`**. No cards were cut on the simulation alone; the
report is the deliverable and the Tier A/B decision is open.

## Open items

- Parts 12 and 13 are planned, not finished (see the ☐ items).
- FEEDBACK-07 F, still open and **not** part of the card pool: card rarity shown on the card face;
  Compendium toggle for broken forms; "additional copies won't appear with the [outfit] outfit"
  tooltip; `half-health` renamed `exposed`; the enemy-count scaling removal; lust weakness ranks at
  33/66/100; the mobile swipe tooltip.
- Demo scope remains the live question per `../CATCH-UP.md`.
