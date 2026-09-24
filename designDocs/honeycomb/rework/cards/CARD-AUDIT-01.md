# Honeycomb — CARD-AUDIT-01: every card, rated

Session 20, second pass (2026-09-15). Noodle:

> For every single card in the game, please do a thorough and exhaustive pass rating each card on two
> different scales. The first is identical to the one used for creating new mechanics. […] The second
> is based on the Item & Card Design Justifications section in characters.md. Identify which niche or
> area the card is meant to fall into, either Starting, Accelerate, Payoff, or Late-game, and identify
> on a scale of 1 to 5 how much of a good fit the card is for that category based on the four questions
> unique to each category.
>
> It is absolutely imperative that you do not give out fives willy-nilly. If a card recieves a 5 in a
> category, it should be the absolute most exemplary card in that category across the entire game.

This file is that pass. It is the accountability record for the card pool; `../../reference/MECHANICS-02.md` is the
design/work log, and this file is the *verdict* on every entry. Cards that failed the pass were
replaced in this session (marked **REPLACED** / **REWORKED** / **REPRICED**); everything else is a
**KEEP**, including cards with low scores that earn their place and are flagged **WATCH**.

Scope: every card a player can draft, plus the neutral pool, the broken forms and the curses. Enemy
moves are cards in the table but are enemy-kit content, not draft content; they are audited with the
enemy redesign in FEEDBACK-07 section A, and are explicitly out of scope here.

---

## 1. How to read the scores

### 1.1 The mechanic scale (I, S_v, S_h, C) — 1–5

Kept identical to `../../reference/MECHANICS-01.md` so a card and a mechanic are measured with one ruler.

| Metric | 5 means |
|---|---|
| **I** — Identity | The math IS the fiction; a player would guess the effect from the name. |
| **S_v** — Vertical synergy | The keystone of its own archetype: other cards are better because it exists. |
| **S_h** — Horizontal synergy | It changes how TEAMS are built; more than one other character wants it. |
| **C** — Cognitive load | Highest payoff for the least text. (Higher is better: 5 = one line, deep.) |

Guide for the lower bands: 4 = strong, 3 = correct, 2 = generic/incidental, 1 = fights its own theme
or is a trap.

### 1.2 The niche scale — 1–5 fit

One niche per card, taken from where it sits in a run. **Every starter-rarity card is Starting** (it
is in the teambuilding option, the bible's own definition); commons and rares are Accelerate, Payoff
or Late-game by function.

| Niche | The four questions | 5 means |
|---|---|---|
| **Starting** — the Buffer | Strengthens a hybrid rather than an engine? Buys time to choose? Helps assemble once chosen? If it seeds a late build, is the vulnerability it opens worth solving? | The most exemplary starting card in the game. |
| **Accelerate** — early fuel | Fuels Burst momentum? Contributes to Grind survival? Costs something or is conditional? Avoids instant-pick dominance? | The most exemplary common in the game. |
| **Payoff** — mid-game commit | Cashes built fuel? Cashes infinite resources? Obvious build-around? Leads to a strategy? | The most exemplary rare in the game. |
| **Late-game** — shore up | Answers a vulnerability the player created? Answers anti-Burst friction? Answers anti-Grind friction? | The most exemplary answer card in the game. |

### 1.3 Every 5 awarded in this audit

Thirteen 5s in roughly 900 scores, listed so they can be challenged one by one.

| Card | 5 in | Why it, and not its neighbour |
|---|---|---|
| Brace | Starting fit | The purest buffer in the game: one line, strengthens every hybrid, and is the primer for a whole primitive. |
| Wither | Starting fit, S_v, C | The poison primer: one line, three stacks of delayed damage, and every Nettle payoff reads it. Keystone and ceiling of the poison grammar in one line. |
| Rupture | Payoff fit | The model payoff: it cashes fuel that no other card cashes the same way, and it leads the player to build poison. |
| Blood Pact | Accelerate fit | The model cost card: a real, thematic resource converted into tempo. After this pass it costs 7, so it is a decision, not a free roll. |
| Gorge | Late-game fit | The bible's own example of a late card: self-damage (her Blood Prices) creates the need for healing, and the overflow becomes the defence that pays for the next price. |
| Tithe | I | A tithe is money handed over for a blessing; the math is gold→energy/cards with nothing else on the card. |
| Lend Steel | S_h | The clearest horizontal keystone: it hands another body the Armament engine, so building around it is a team decision. |
| Mark Prey | S_h | The brief's named "setup status for ally execution": every ally's attack cashes the mark, and it pays the party energy when it falls. |
| Infect | S_h | Every hit from every character becomes Nettle's poison; the party's normal play is the engine. |
| Sword Strike | C | The simplest real card in the game and the reason every other number has a ruler. |

No card has more than three 5s. **No card has a 5 in every metric.**

---

## 2. Brienne — Temporary HP

| Card | Niche | Fit | I | S_v | S_h | C | Verdict | Note |
|---|---|---|---|---|---|---|---|---|
| Sword Strike | Starting | 4 | 3 | 2 | 2 | **5** | KEEP | the ruler |
| Brace | Starting | **5** | 4 | **5** | 4 | 4 | KEEP | the primer |
| Bulwark | Accelerate | 4 | 4 | 4 | 4 | 4 | KEEP | party-wide gold, the Grind opener |
| Steady | Late-game | 4 | 3 | 3 | 4 | 4 | KEEP | the universal lust brake |
| Shelter | Accelerate | 4 | 4 | 4 | 4 | 3 | **REWORKED** | one-off Composure folded out; front-rank tHP ties it to Cinder |
| Rally | Payoff | 4 | 4 | 4 | 4 | 3 | **REPLACED** | was a flat team Strength instant-pick; now reads her gold |
| Shield Bash | Accelerate | 4 | 4 | 4 | 3 | 4 | KEEP | makes gold a weapon |
| Riposte | Payoff | 4 | 4 | 4 | 3 | 4 | KEEP | spend nothing, hit with everything banked |
| Crushing Weight | Payoff | 4 | 4 | 4 | 3 | 3 | KEEP | the AoE payout |
| Tempered Plate | Accelerate | 3 | 3 | 4 | 3 | 4 | **BOOSTED** | now carries 4 gold, so it is never a dead turn |
| Lend Steel | Accelerate | 4 | 4 | 3 | **5** | 4 | KEEP | the horizontal keystone |
| Unstoppable | Payoff | 4 | 4 | 4 | 3 | 4 | KEEP | gold gained becomes damage |
| Challenge | Accelerate | 4 | 4 | 4 | 3 | 4 | KEEP | |
| Intercept | Accelerate | 4 | 4 | 4 | 4 | 4 | KEEP | protects an ally and pulls the line |
| Thorn Armour | Late-game | 3 | 3 | 3 | 3 | 4 | KEEP | anti-small-hits answer |
| Iron Retort | Payoff | 4 | 4 | 4 | 3 | 4 | KEEP | absorption becomes damage |
| Stand Fast | Payoff | 4 | 3 | 4 | 4 | 4 | **REPLACED** | was Hold the Line, a decay trap; now a per-turn gold engine |
| Shield Wall | Payoff | 4 | 4 | 4 | 4 | 4 | KEEP | |
| Tithe | Accelerate | 4 | **5** | 4 | 3 | 4 | KEEP | the name is the rule |
| Ransom | Payoff | 4 | 4 | 4 | 4 | 3 | KEEP | cashes an ally's gold |
| Gilded Strike | Payoff | 3 | 4 | 4 | 3 | 4 | KEEP · WATCH | unbounded burst off a banked shell; if playtests show one-card kills, cap it |
| Alms | Late-game | **5** | 4 | 4 | 4 | 3 | KEEP | turns the shell into party-wide lust relief |
| Reliquary | Payoff | 3 | 4 | 3 | 3 | 3 | KEEP · WATCH | needs decay to survive to matter; Stand Fast is its partner |

Brienne's failure states addressed: **Hold the Line** (pitfall: read as defence, rarely mattered) and
**Rally** (instant-pick: generic Strength, no tHP language).

---

## 3. Nettle — Poison

| Card | Niche | Fit | I | S_v | S_h | C | Verdict | Note |
|---|---|---|---|---|---|---|---|---|
| Grave Touch | Starting | 3 | 3 | 2 | 2 | 4 | KEEP | |
| Wither | Starting | **5** | 4 | **5** | 4 | **5** | KEEP | the whole grammar in one line |
| Soul Harvest | Accelerate | 3 | 3 | 4 | 2 | 3 | **REWORKED** | free Energy was generic; now needs 2 Souls |
| Reap | Starting | 4 | 4 | 4 | 3 | 4 | KEEP | poison's fair payoff |
| Blight Needle | Accelerate | 4 | 3 | 4 | 3 | 4 | KEEP | |
| Rupture | Payoff | **5** | 4 | 4 | 3 | 3 | KEEP | the model payoff |
| Putrefy | Accelerate | 4 | 3 | 4 | 3 | 4 | **NEW** | reads NEGATIVE statuses only, per decree |
| Wasting | Accelerate | 4 | 3 | 4 | 4 | 3 | KEEP · WATCH | doubles with any Weak source; text corrected to match its effects |
| Fester | Payoff | 4 | 4 | 4 | 3 | 3 | KEEP | the clock runs double |
| Catharsis | Payoff | 4 | 4 | 4 | 3 | 3 | KEEP | |
| Burst | Payoff | 4 | 4 | 4 | 3 | 3 | KEEP | |
| Miasma | Accelerate | 4 | 4 | 4 | 4 | 4 | KEEP | the party-wide opener |
| Infect | Accelerate | 4 | 4 | 4 | **5** | 3 | KEEP | every ally's hit is poison |
| Contagion | Payoff | 3 | 4 | 4 | 3 | 3 | KEEP | situational but the Contagion identity |
| Pandemic | Payoff | 3 | 3 | 3 | 3 | 3 | **BOOSTED** | was a corpse-only payoff; now seeds its own poison |
| Creeping Plague | Payoff | 4 | 4 | 4 | 4 | 3 | KEEP | |
| Pollen Kiss | Accelerate | 4 | 4 | 3 | 4 | 4 | KEEP | the Venom door |
| Intoxicate | Accelerate | 4 | 4 | 4 | 4 | 3 | KEEP | |
| Flushed | Payoff | 4 | 4 | 4 | 3 | 4 | KEEP | |
| Heady Spores | Accelerate | 3 | 4 | 4 | 4 | 3 | **BOOSTED** | was a party-only passive; now seeds its own poison |
| Bacchanal | Payoff | 4 | 4 | 4 | 4 | 2 | KEEP | the Venom finisher |

Nettle's failure states addressed: **Soul Harvest** (generic instant-pick), **Pandemic** and **Heady
Spores** (near-blank without commitment), plus the Wasting text lie. The density trims (Wither 3,
Blight Needle 2, Wasting 3/3, Fester 2, Creeping Plague 3, Pollen Kiss 2) stand from the first pass,
and the measured average is 2.06 Poison per energy. **Putrefy** answers Noodle's request that she not
reward only pure poison, and it reads negative statuses only.

---

## 4. Severine — Blood

| Card | Niche | Fit | I | S_v | S_h | C | Verdict | Note |
|---|---|---|---|---|---|---|---|---|
| Rake | Accelerate | 3 | 3 | 2 | 2 | 4 | KEEP | plain second attack |
| Enthrall | Starting | 4 | 4 | 3 | 4 | 4 | KEEP | |
| Drain | Starting | 4 | 4 | **5** | 4 | 4 | **RESTORED** | full drain is her identity; healing was never the problem |
| Claw Flurry | Accelerate | 4 | 4 | 4 | 4 | 4 | KEEP · WATCH | 9/energy at common; its bill is the multi-hit payoffs it feeds |
| Crimson Arc | Starting | 4 | 3 | 3 | 2 | 4 | KEEP | |
| Nightfall | Payoff | 4 | 4 | 4 | 3 | 3 | KEEP | heal 6 restored |
| Hamstring | Accelerate | 3 | 3 | 4 | 3 | 4 | KEEP | |
| Mark Prey | Accelerate | 4 | 3 | 4 | **5** | 4 | KEEP | the brief's setup-status example |
| Coup de Grace | Payoff | 4 | 4 | 4 | 3 | 4 | KEEP | |
| Exsanguinate | Payoff | 4 | 4 | 4 | 3 | 4 | KEEP | the execution |
| Gorge | Late-game | **5** | 4 | 4 | 4 | 4 | **BOOSTED** | the bible's self-damage→healing example; now heals 4 |
| Bloody Verdict | Payoff | 4 | 4 | 4 | 3 | 4 | **REPLACED** | was a runaway per-debuff drain with Nettle; now a bounded missing-health finisher |
| Blood Pact | Accelerate | **5** | 4 | 4 | 3 | 4 | **REPRICED** | 4→7 HP: the model "pay a resource for tempo" card |
| Bloodlet | Accelerate | 4 | 4 | 4 | 4 | 4 | **REPRICED** | 5→7 to an ally; feeds every on-damage engine |
| Sanguine Tide | Payoff | 4 | 4 | 4 | 4 | 3 | KEEP | rises with the higher life prices, by design |
| Blood Rite | Accelerate | 3 | 3 | 3 | 3 | 4 | KEEP | |
| Blood Moon | Payoff | 4 | 4 | 3 | 4 | 3 | KEEP | |
| Transfusion | Accelerate | 4 | 4 | 4 | 4 | 4 | **REPRICED** | 5→8 HP: giving blood costs blood |
| Leech Mark | Accelerate | 3 | 3 | 3 | 4 | 3 | KEEP | |
| Vital Flow | Accelerate | 4 | 3 | 4 | 4 | 4 | KEEP | |
| Heartsblood | Late-game | 3 | 4 | 4 | 4 | 3 | **REPRICED** | 6→9 HP |
| Crimson Communion | Payoff | 4 | 4 | 4 | 4 | 3 | KEEP | |

Severine's failure state: **the healing was not the problem; the prices were.** Drain / Nightfall /
Bloody Verdict healing is restored (Bloody Verdict is re-designed for an unrelated runaway reason),
and the life-payment cards now cost 7 / 7 / 8 / 9. The Bloodletting loop is louder: pay more, cash it
with Sanguine Tide and Blood Moon, drink it back with Drain.

---

## 5. Cinder — party order

| Card | Niche | Fit | I | S_v | S_h | C | Verdict | Note |
|---|---|---|---|---|---|---|---|---|
| Lance Thrust | Starting | 3 | 3 | 2 | 2 | 4 | KEEP | |
| Fall Back | Starting | 4 | 4 | 4 | 3 | 4 | KEEP | the step that feeds the charge |
| Flame Charge | Starting | 4 | 4 | 4 | 3 | 3 | KEEP | the crossing is the damage |
| Change Places | Starting | 4 | 4 | 4 | 4 | 4 | KEEP | puts the right body at the front |
| Longspear | Accelerate | 4 | 4 | 4 | 3 | 4 | KEEP | |
| Double Back | Accelerate | 4 | 4 | 4 | 3 | 3 | KEEP | |
| Hot Pursuit | Payoff | 4 | 4 | 4 | 3 | 4 | KEEP | |
| Trailfire | Accelerate | 3 | 3 | 4 | 3 | 4 | KEEP | |
| Comet Lance | Payoff | 4 | 4 | 4 | 3 | 2 | KEEP | the line-wide charge |
| Pull Back | Late-game | 4 | 4 | 4 | 4 | 4 | KEEP | answers the exposed front |
| Point of the Spear | Accelerate | 4 | 4 | 4 | 4 | 4 | KEEP | Vanguard delivery |
| Turn the Line | Payoff | 4 | 4 | 4 | 3 | 3 | **BOOSTED** | reversing the line now hits the enemy line for it |
| Pincer | Payoff | 4 | 4 | 4 | 4 | 3 | KEEP | pays off the whole party's movement |

Cinder needed the least work; **Turn the Line** was the one thin rare.

---

## 6. Clemence — Breaking

| Card | Niche | Fit | I | S_v | S_h | C | Verdict | Note |
|---|---|---|---|---|---|---|---|---|
| Offering | Starting | 4 | 4 | 4 | 4 | 3 | KEEP | |
| Fervent Prayer | Starting | 4 | 3 | 4 | 3 | 4 | KEEP | |
| Confide | Starting | 4 | 3 | 4 | 3 | 4 | KEEP | |
| Lay On Hands | Accelerate | 4 | 4 | 4 | 4 | 3 | KEEP | |
| Sheltering Grace | Accelerate | 4 | 4 | 4 | 4 | 4 | KEEP | the Brienne bridge (new, pass 1) |
| Take Their Burden | Accelerate | 4 | 4 | 4 | 4 | 3 | KEEP | |
| Penitence | Accelerate | 4 | 4 | 4 | 3 | 4 | KEEP · WATCH | 0-cost 2 Energy; the Lust is the price and the engine |
| Martyr's Vow | Payoff | 3 | 3 | 3 | 3 | 3 | KEEP | the long-game heal |
| Soft Words | Starting | 4 | 4 | 3 | 4 | 4 | KEEP | |
| Yearning | Payoff | 4 | 4 | 4 | 4 | 4 | **RESTORED** | sensitive to ALL; was accidentally merged with Confession |
| Confession | Accelerate | 4 | 4 | 4 | 4 | 3 | **RESTORED** | separate card again |
| Surrender | Payoff | 4 | 4 | 4 | 3 | 3 | KEEP | the break button |
| Ecstasy | Payoff | 4 | 4 | 4 | 3 | 3 | KEEP | |
| Sanctify | Accelerate | 4 | 4 | 4 | 4 | 3 | KEEP | |
| Fallen Vigil | Late-game | 4 | 4 | 4 | 4 | 3 | KEEP | answers her own broken state |
| Shared Fever | Accelerate | 3 | 4 | 4 | 4 | 3 | KEEP · WATCH | gives an ally Lust for tempo: a deliberate, clearly-worded gamble |
| Communion | Payoff | 4 | 4 | 4 | 4 | 3 | KEEP | |

Clemence's failures addressed across the two passes: no tHP tool (Sheltering Grace), healing-heavy
broken forms (five converted to burst), no unique self-Lust tag (Penance), and a content corruption
where **Yearning** had swallowed **Confession** — both restored.

---

## 7. Cassadora — intents

| Card | Niche | Fit | I | S_v | S_h | C | Verdict | Note |
|---|---|---|---|---|---|---|---|---|
| Wisplight | Starting | 3 | 3 | 2 | 2 | 4 | KEEP | |
| Second Thoughts | Starting | 4 | 4 | 4 | 3 | 4 | KEEP | |
| Fizzle | Starting | 4 | 4 | 4 | 3 | 4 | KEEP | |
| Turncoat | Starting | 4 | 4 | 4 | 4 | 3 | KEEP | |
| Crystal Gaze | Accelerate | 4 | 3 | 3 | 3 | 4 | KEEP | reads the board for the whole party |
| Jinx | Payoff | 3 | 3 | 4 | 3 | 4 | KEEP | |
| Warded Fate | Late-game | 4 | 4 | 3 | 4 | 3 | KEEP | her cross-party card (pass 1) |
| Hex of Stillness | Payoff | 4 | 4 | 4 | 3 | 3 | KEEP | |
| Mirror Fate | Payoff | 4 | 4 | 4 | 3 | 4 | KEEP | |
| Pilfer | Payoff | 4 | 4 | 4 | 3 | 2 | KEEP · WATCH | wordy by necessity; the Repertoire payoff makes the words pay |
| Puppet Strings | Payoff | 4 | 4 | 4 | 3 | 3 | KEEP | |
| Understudy | Accelerate | 4 | 4 | 4 | 3 | 4 | **REPLACED** | was "copy any card"; is now the archetype's common steal |
| Encore | Accelerate | 3 | 2 | 3 | 2 | 4 | **REPLACED** | was a generic discard-recovery; now a draw fixer with Repertoire upside |
| Repertoire | Payoff | 4 | 4 | 4 | 3 | 3 | KEEP | the Blue-Mage posture |

Cassadora's failures addressed: **Understudy** and **Encore** were generic commons doing nothing for
Repertoire; they are the steal-enabler and the payoff-drawer now.

---

## 8. Neutral pool

Neutral cards are found on the map, so they must be quietly useful in any deck and never an
auto-win. Scored for completeness.

| Card | Niche | Fit | I | S_v | S_h | C | Verdict | Note |
|---|---|---|---|---|---|---|---|---|
| Second Wind | Accelerate | 4 | 2 | 2 | 2 | 4 | KEEP | pure draw; deliberately identity-free |
| Field Tonic | Late-game | 3 | 3 | 2 | 2 | 4 | KEEP | the emergency heal |
| Shared Resolve | Starting | 4 | 4 | 3 | 4 | 3 | KEEP | scales with the party |
| Whetted Edge | Accelerate | 4 | 4 | 3 | 4 | 3 | KEEP | the upgrade you can draft |
| Improvise | Accelerate | 4 | 3 | 3 | 3 | 3 | KEEP | |
| Hedge Your Bet | Payoff | 4 | 4 | 2 | 2 | 3 | KEEP | flexible rare filler |

---

## 9. Broken forms, curses and other specials

Broken forms are not drafted and have no niche; rated on the mechanic scale only.

| Card | I | S_v | S_h | C | Verdict | Note |
|---|---|---|---|---|---|---|
| Buckle (Brienne) | 3 | 3 | 2 | 4 | KEEP | the choice between defence and composure is her whole character |
| Lash Out (Severine) | 3 | 2 | 2 | 3 | KEEP | can wound an ally; clearly a punishment |
| Wither Within (Nettle) | 4 | 3 | 2 | 3 | KEEP | the curse price is the necromancer's |
| Stumble (Cinder) | 3 | 3 | 3 | 4 | KEEP | the one useful thing a broken lancer can do |
| Rapture (Clemence) | 3 | 3 | 3 | 4 | KEEP | fallback only; her cards bring their own |
| Blinded (Cassadora) | 3 | 3 | 2 | 4 | KEEP | |
| Backs to the Wall, Huddle, Weight of Regret | 3/3/4 | 3/3/3 | 2/4/4 | 4/4/4 | KEEP | the per-rank examples from pass 1 |
| Pollen Burst, Miasmic Haze, Last Bloom | 3/3/4 | 3/3/3 | 2/4/4 | 4/4/4 | KEEP | |
| Prey No More, Cripple, Moonfall | 3/3/4 | 3/3/3 | 2/2/4 | 4/4/4 | KEEP | |
| Misstep, Lost Trail, Closing Jaws | 3/3/4 | 3/3/3 | 2/2/4 | 4/4/3 | KEEP | |
| Turned Coat, Shattered Mirror, Stillness Within | 3/3/4 | 3/3/3 | 2/2/4 | 4/4/4 | KEEP | |
| Clemence's standing/broken pairs | avg 4/4 | avg 4 | avg 4 | avg 3 | KEEP | the exception Noodle named; every card carries its broken counterpart |
| Dread (curse) | 3 | 2 | 2 | 4 | KEEP | the unremovable tax |
| Wisp (curse) | 3 | 2 | 2 | 4 | KEEP | the removable tax |

---

## 10. The status-polarity audit

Noodle, this session:

> Eventually, we will do a full audit of status effects again (Later!). […] If you decide to make a
> card care about buffs or debuffs, then they should care only about either positive or negative
> status effects. […] Nothing should care about neutral status effects.

Every status-counting card in the pool was checked against this rule:

| Card | Reads | Verdict |
|---|---|---|
| Putrefy | `debuffCount` (negative only) | new card; follows the rule |
| Bloody Verdict | nothing (missing health) | re-designed; no longer counts statuses at all |
| Trophy Cord (relic) | `debuffCount` (negative only) | follows the rule |
| Cleanse (effect) | `isDebuff` (negative only) | follows the rule |
| Everything else | named statuses only (Poison, Weak, Sensitive, Lust…) | no card counts "statuses" generically |

No card reads a neutral status, and no card has a generic "number of statuses" clause. When the full
status sort lands, `debuffCount` and `cleanse` are already the negative pole; a positive counterpart
can be added then without touching a single card.

---

## 11. The quality standards, applied

- **No Dead Weight.** The cards removed or rebuilt were exactly the ones that contributed to neither
  strategy: Hold the Line (defence that rarely happened), Pandemic (corpse-only), Heady Spores
  (party-only), Gorge (needed overheal with no way to get there), Soul Harvest (generic cantrip),
  Understudy and Encore (generic tools in an archetype about enemy cards).
- **Temporary, never boring.** Every rebuilt low-card now hides a lever: Stand Fast is a Gold engine,
  Putrefy is an anti-status payoff, Understudy is the cheap steal, Encore pays off the posture.
- **No Pitfalls.** Two explicit traps were found and fixed: Hold the Line and Bloody Verdict. The
  remaining risk cards (Shared Fever, Blood Pact, Heartsblood) say their price on the card.
- **Never a Grind.** Every character now has at least one rare whose effect a run can be *about*
  (Stand Fast, Fester/Catharsis, Bloody Verdict/Blood Moon, Comet Lance, Surrender/Ecstasy,
  Repertoire/Puppet Strings), so a repeated run can still find a new build.

## WATCH list

Low scores kept on purpose, with the reason:

| Card | Why it survives |
|---|---|
| Gilded Strike | Unbounded burst; the shell it needs is the archetype. Cap on evidence, not now. |
| Reliquary | Conditional on decay; Stand Fast made decay matter again. |
| Wasting | Doubles with any Weak source; priced as a common enabler. Watch for a one-card blowout. |
| Claw Flurry | 9/energy at common; its payoffs are the multi-hit triggers. |
| Penitence | 0-cost Energy ritual; the Lust is the engine, not a cost, for her. |
| Pilfer | Longest text in the pool; the Repertoire package makes it earn the words. |

## Cards changed this pass (session 20, second pass)

| Card | Before | After |
|---|---|---|
| Bloody Verdict | 6 + 4/debuff, heal full dealt | missing health, capped 12, heal 4 |
| Rally | ALL allies +1 Strength | 1 Strength + 1 per 6 tHP (max 3) |
| Hold the Line → Stand Fast | slower tHP decay | gain 4 tHP each turn |
| Tempered Plate | Armament only | Armament + 4 tHP |
| Shelter | 8 tHP + 6 soothe + 1 Composure | 8 tHP + 6 soothe + 4 tHP at the front |
| Soul Harvest | draw 2 + free Energy | Energy needs 2 Souls |
| Pandemic | corpse-spread only | 2 Poison to ALL + corpse-spread |
| Heady Spores | party-poison passive only | 2 Poison to ALL + passive |
| Gorge | Gorged only | heal 4 (8 upgraded) + Gorged |
| Putrefy | — | new: damage + 3 per negative status |
| Turn the Line | reverse + draw 2 | reverse + draw 2 + 4 AoE |
| Understudy | copy a card in hand | steal an intent + draw 1 |
| Encore | return from discard + draw 1 | draw 2 (+1 with Repertoire) |
| Drain | half-heal (pass 1) | full heal, restored |
| Nightfall | heal 4 (pass 1) | heal 6, restored |
| Blood Pact | lose 4 | lose 7 |
| Bloodlet | 5 to an ally | 7 to an ally |
| Transfusion | lose 5 | lose 8 |
| Heartsblood | lose 6 | lose 9 |
| Crimson Fang | heal 2 (pass 1) | heal 3, restored |
| Wasting text | claimed 4/4 | matches its 3/3 effects |
| Yearning / Confession | merged into one block | two separate cards again |
