# Honeycomb — DRAFT-SIM-01: the draft simulation and the cut report

Session 20, third pass (2026-09-15). Noodle's brief: give every card an individual strength 0–1 (impact
per energy against the same cost bucket) and every pair a synergy score; modulate both by average deck
cost and deck size; simulate a playerbase of at least 100 players across the three personalities; offer
100 cards each with removals every 5; answer fourteen questions; tweak the numbers, repeat, and compile
a report on what should be cut.

Everything here is reproducible:

```
node "!designDocs/honeycomb/tools/draft-sim/draft-simulation.js" --players 1000 --offers 100 --seed 7 --tag base
node "!designDocs/honeycomb/tools/draft-sim/draft-sim-compare.js" base flat steep elite30 picky
node "!designDocs/honeycomb/tools/card-inventory.js" starter,common,rare
```

4000 simulated players across five configurations (1000 each: base, flat, steep, elite30, picky). The
full card-by-card numbers live in `DRAFT-SIM-DATA-<tag>.json`; this file is the reading.

---

## 1. The model, in one page

- **Strength 0–1.** Each card's effect list is priced in energy units (damage 1/6, tHP 1/6, heal 1/8,
  Lust 1/7, poison 0.32/stack, draw 0.55, energy 1.0, movement, intent control, and so on; repeats
  multiply, branches and choose-ones take the best option, self/ally damage is a price), then divided by
  energy (0-cost divided by 0.55) and min-max normalised **within its cost bucket**. Draw and energy
  are flagged separately because the dynamic factors below read them.
- **Synergy, every pair.** A card's `provides` set is read from its effects; its `wants` set from every
  value, condition and consume/read it contains, plus a manual table for payoffs that live in status
  hooks. Each matching provide/want adds the tag's weight, both directions count, same-archetype +0.8,
  same-character +0.3, duplicates 0.7, consumes compete at −0.2, removes/cleanse anti at −0.6, plus
  manual pairs. Synergy may be negative; anti-synergy is real.
- **Total synergy** = sum over the deck of each card's modified strength × its synergy with every other
  card; **average synergy** = total / deck size.
- **Cost dynamic.** Above average cost 1.0, energy-granting cards rise and everything else falls; below
  1.0 it inverts, and at average cost 0.6 energy cards reach strength 0.
- **Size dynamic.** At 5 cards, draw cards are worth 0. As the deck grows, draw cards rise and non-draw
  cards fall. Both are capped/floored so one factor cannot dominate absolutely.
- **Players.** 3 random characters, starting deck from their `startingCardArray`; personality loose
  (takes any total-synergy gain, removes only on total gain), stingy (needs an average-synergy gain of
  a per-player threshold between 3% and 10%), or stubborn (a favourite card from the party's legal
  pool; always takes it, avoids cards anti-synergistic with it, takes cards synergistic with it).
  Offers are 3 distinct cards from the party's legal common/rare pool at 75/25, 100 offers, a removal
  attempt every 5.

### Stability across five configurations

Spearman correlation of the pick-rate ranking:

| | base | flat | steep | elite30 | picky |
|---|---|---|---|---|---|
| **base** | 1.00 | 0.88 | 0.95 | 0.99 | 1.00 |
| **flat** | 0.88 | 1.00 | 0.86 | 0.87 | 0.88 |
| **steep** | 0.95 | 0.86 | 1.00 | 0.93 | 0.95 |

Even flattening the synergy model (flat) keeps 0.86–0.88 agreement; the steep cost/size model keeps
0.93+. The bottom of the pool is the same cards in every configuration.

### Honest caveats

1. **Decks reach ~90–110 cards**, far larger than a real run (~20–35), because the brief asks for 100
   offers. The size factor therefore dominates the late game, and non-draw cards get cut aggressively.
   Late-run behaviour is a stress test, not a prediction.
2. **The synergy model is tag-based.** A vanilla card with no tags (Rake, Longspear, plain Strikes)
   scores badly by construction. Low pick rate on those is a statement about *synergy density*, not raw
   power.
3. **Neutral cards are never offered** (in-game `neutralSlotChance` is 0), so they have no draft data.
4. **Enemy moves are out of scope**, as in CARD-AUDIT-01.
5. Stubborn-favourite samples remain small (n≈5–15 per favourite); question 14 is indicative only.
6. Built against the shipped content as it stood after session 21's first half (poison loses one stack
   per tick — `decayMode: "decrement"`; Wasting 3/3, 116 draftable cards). If Noodle flips poison to the
   halving decay, the Nettle Tier C verdict must be re-run: the simulation prices poison at the current
   decrement curve.

---

## 2. The answers

Numbers below are the base configuration (3000 players) unless a cross-config average is stated.

### 1/2. Removed the most / least, by rarity

**Starter.** Most removed: Wisplight (3018), Lance Thrust (2849), Sword Strike (2730), Grave Touch
(2094), Fall Back (2075), Wither (1481), Drain (1334), Second Thoughts (1223). Least removed: Confide
(0), Soft Words (0), Offering (27), Fervent Prayer (256), Change Places (296), Flame Charge (609),
Reap (686), Crimson Arc (705). *Note: every starter is removed at some rate as decks bloat; the
Clemence starters are kept because her engine wants its cheap rituals.*

**Common.** Most removed: Crystal Gaze (882), Infect (835), Miasma (826), Claw Flurry (725), Pollen
Kiss (691), Transfusion (573), Steady (465), Challenge (381). Least removed: Intoxicate, Vital Flow,
Take Their Burden, Confession, Fallen Vigil, Shared Fever, Second Wind, Field Tonic (all 0 removals at
those sample sizes; the neutrals because they were never offered).

**Rare.** Most removed: Puppet Strings (307), Hex of Stillness (283), Pincer (209), Crimson Communion
(122), Communion (118), Turn the Line (97), Comet Lance (75), Yearning (75). Least removed: Hedge Your
Bet (0), Surrender (1), Repertoire (11), Creeping Plague (12), Pilfer (13), Blood Moon (16), Fester
(18), Nightfall (20).

### 3/4. Common/rare picked the most / least (pick rate when offered)

**Common, most:** Shared Fever 82%, Confession 81%, Martyr's Vow 71%, Fallen Vigil 71%, Hot Pursuit
66%, Coup de Grace 67%, Take Their Burden 63%, Sheltering Grace 60%, Lay On Hands 56%, Tithe 61%.

**Common, least:** Steady 5%, Infect 6%, Rake 6%, Leech Mark 7%, Heartsblood 7%, Mirror Fate 7%, Claw
Flurry 7%, Thorn Armour 8%, Transfusion 9%, Bloodlet 9%, Crystal Gaze 9%, Longspear 10%.

**Rare, most:** Turn the Line 67%, Surrender 62%, Crimson Communion 54%, Stand Fast 44%, Comet Lance
41%, Shield Wall 38%, Ecstasy 32%, Communion 28%, Exsanguinate 30%, Sanguine Tide 29%.

**Rare, least:** Puppet Strings 6%, Stillness 6%, Rally 10%, Pilfer 13%, Creeping Plague 12%, Catharsis
13%, Blood Moon 14%, Nightfall 12%, Unstoppable 14%, Pincer 15%.

### 5. Common most often taken over a rare

Shared Fever (4447 offers where a rare was also shown), Confession (4390), Martyr's Vow (4029), Fallen
Vigil (3876), Hot Pursuit (3620), Take Their Burden (3597), Sheltering Grace (3404), Coup de Grace
(3317), Lay On Hands (3274), Tithe (2773).

### 6. Rare most often passed up for a common

Puppet Strings (5080), Stillness (5075), Pilfer (4663), Pincer (4608), Repertoire (4459), Yearning
(4403), Communion (4266), Rally (4088), Ecstasy (4067), Blood Moon (4063), Nightfall (4010),
Unstoppable (3922).

### 7/8. Characters' cards picked most / least (per offered slot, the fair denominator)

**Most:** Clemence 16.7%, Brienne 12.2%, Severine 9.8%.
**Least:** Cassadora 4.2%, Nettle 6.3%, Cinder 7.6%.

### 9/10. Each character's favourite and least favourite character

Every character's favourite is **Clemence** except Clemence's, which is **Brienne**; every character's
least favourite is **Cassadora**, except Cassadora's, which is **Nettle**.

| Character | Favourite | Least favourite |
|---|---|---|
| Brienne | Clemence (28319) | Cassadora (7321) |
| Nettle | Clemence (26905) | Cassadora (8347) |
| Severine | Clemence (29949) | Cassadora (8044) |
| Cinder | Clemence (33684) | Cassadora (9503) |
| Clemence | Brienne (13564) | Cassadora (5499) |
| Cassadora | Clemence (34205) | Nettle (12921) |

### 11. Sharpest decline in pick rate as the deck grew

Mean deck size at pick vs the global mean of 62.6 (ratio < 1 = added earlier and earlier): Jinx 0.91
(57.2), Lay On Hands 0.94, Penitence 0.94, Soul Harvest 0.95, Sheltering Grace 0.95, Take Their Burden
0.95, Martyr's Vow 0.95, Confession 0.95, Crystal Gaze 0.95, Mirror Fate 0.96, Steady 0.97, Heady
Spores 0.97.

### 12. Picks that coincided with a decline in adding other new cards

**None.** Every card's post-pick appetite sits between 0.985 and 1.000 of the player's own baseline
(Puppet Strings 0.985, Pull Back 0.986, Pincer 0.987, Double Back 0.987). No card ends a player's
appetite for new cards in this model.

### 13. Average average-synergy of decks including each character

Clemence 32.12, Cinder 26.71, Cassadora 25.35, Severine 22.93, Brienne 22.23, Nettle 22.07.

### 14. Favourite cards that led to the lowest average synergy

Nettle dominates: Putrefy 11.86 (n=12), Infect 12.73, Burst 12.74, Miasma 12.92, Blight Needle 12.92,
Catharsis 13.15, Pandemic 13.23, Fester 13.34, Rupture 13.34, Intoxicate 13.35, Bacchanal 13.36, then
Brienne's Riposte 13.64 and Unstoppable 13.80 and Nettle's Wasting 13.81 and Creeping Plague 13.89.

---

## 3. The cut report

Confidence is graded: **A** = flagged by every signal in every configuration (pick rate, removal
ratio, strength, synergy); **B** = two or more signals, stable; **C** = one strong signal, possibly a
model artifact, validate in playtests before acting. Starter cards are "cut" from the starting deck,
not from the game.

### Tier A — cut or rebuild now

| Card | The evidence | What it is |
|---|---|---|
| **cassadoraCrystalGaze** | 10% pick; 69% of copies cut later; modelled strength 0.01 (lowest in the game) | 0-cost draw that needs attackers; Cassadora's starting deck pays for it |
| **brienneSteady** | 5.3% pick (lowest common); 89% of copies cut; synergy 6.6 | pure Soothe with no engine; every other lust answer also does something |
| **severineFlurry** | 6.6% pick; removal ratio 1.00 (every copy that exists gets cut); synergy 6.9 | multi-hit that only matters with payoffs the party rarely has |
| **nettleInfect** | 6.2% pick; most copies cut; strength 0.21 | the Infected clock is too slow to be worth a slot |
| **severineStrike** (Rake) | 5.7% pick; strength 0.35; synergy 6.9 | a vanilla 7-damage body in a tag-driven pool |
| **cassadoraStillness** | 6.0% pick; 54% of copies cut; strength 0.20 | the control rare nobody builds around |
| **cassadoraPuppetStrings** | 5.8% pick; 61% of copies cut | slow recurring Turncoat; the model and the drafters both walk past it |
| **severineTransfusion** | 9.3% pick; 57% of copies cut; strength 0.13 | a heal card in a pool that already heals through combat |

### Tier B — cut or substantially rework

| Card | Evidence |
|---|---|
| **severineLeechMark** | 7.3% pick, strength 0.14, synergy 16.4 |
| **severineHeartsblood** | 7.3% pick, strength 0.00 in its bucket |
| **severineBloodlet** | 9.9% pick, strength 0.00, but 18% of copies cut — its value is only through on-damage payoffs |
| **cassadoraMirrorFate** | 7.4% pick, synergy 13.6; the intent-damage payoff is too situational |
| **brienneThornArmour** | 7.6% pick; thorns are anti-small-hits only |
| **cinderPincer** | 15% pick, strength 0.08; the movement payoff needs a party built for it |
| **nettleMiasma** | 9.1% pick, mostly cut; a starter that no Nettle player keeps |
| **cinderLongspear** | 11% pick, synergy 14.2; raw damage without tags |
| **brienneRally** | 10% pick, strength 0.27; still needs the tHP bank to be worth a card |
| **nettleInfect family** | all four Nettle appliers (Infect/Miasma/Pollen Kiss/Wasting) sit at 6–19% pick — the poison on-ramp is the least drafted package in the game |

### Tier C — do not cut on this data alone

| Card | Why it was flagged | Why to wait |
|---|---|---|
| **severineNightfall** | 12% pick | strength 1.00 (the strongest cost-2 card); synergy-seekers pass raw power, real players may not |
| **nettle payoffs** (Catharsis, Creeping Plague, Burst, Fester) | 12–21% pick | the model prices delayed damage low; if poison is buffed at the base, the payoffs become correct |
| **brienneUnstoppable / Reliquary** | 14–29% pick | payoffs for a tHP bank the party may not have; fine once Stand Fast is common |
| **cinderPincer / Turn the Line** | Pincer low, Turn the Line 67% pick and 2% cut | the Formation package is healthy; Pincer alone lacks enablers |
| **all neutral cards** | no data | never offered in this model |
| **all starters** | high removal | removal of vanilla bodies in a 100-card deck is correct play, not a verdict on the card |

### The over-picked half of the report

The sim's other warning is the opposite: **Clemence's commons are structurally over-drafted.** Shared
Fever 82%, Confession 81%, Martyr's Vow 71%, Fallen Vigil 71%, Take Their Burden 63%, Sheltering Grace
60%, Lay On Hands 56%. Every character's favourite character is Clemence. Her pool is cheap, broadly
tagged, and self-synergistic, and the sim rewards that with a 16.7% slot win rate against Cassadora's 4.2%.
Recommendation before adding content: raise the price or narrow the tags of the top two (Shared Fever,
Confession), and give Cassadora's and Nettle's packages a floor — the bottom of the pool is not their cards
being weak in isolation, it is their engines never coming online in a draft.

---

## 4. What was tweaked, and what would change the answer

Model fixes during the pass (each one moved the ranking): choose-ones now take the best option instead
of summing all of them; `repeat` multiplies its payload; spread/upgrade/cost effects are priced; Lust
pushed onto an ally is half a cost; self-damage is a price not a payoff; value-scaling damage is priced
above vanilla; poison and Turncoat were raised. Five configurations were then run (flat synergy, steep
cost/size, 30% elite rarity rates, pickier thresholds) and the ranking held at Spearman 0.86–1.00.

What would change the cut list: a real run-length model (decks of 20–35 instead of 90–110) would soften
the deck-size factor and protect non-draw rares (Nightfall, Creeping Plague); pricing poison as
front-loaded damage rather than delayed would lift every Nettle payoff; and allowing neutral cards into
the offer pool would give the six neutral cards their first data.

## 5. Files

- `../../tools/draft-sim/draft-simulation.js` — the model and playerbase; `--players`, `--offers`, `--seed`, `--set`, `--tag`.
- `../../tools/draft-sim/draft-sim-compare.js` — cross-configuration stability and per-rarity tables.
- `DRAFT-SIM-DATA-*.json` — the machine numbers per configuration.
- `CARD-AUDIT-01.md` — the qualitative audit this simulation complements.
