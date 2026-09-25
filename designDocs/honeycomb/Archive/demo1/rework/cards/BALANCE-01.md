# BALANCE-01 — the foundational numbers

**Read this before pricing any card or any enemy.** Session 32 (2026-09-19). The card pool brief
(`CARD-POOL-01.md`) and the enemy pass both derive from this file; when a number here changes, both are
re-derived, never patched in place.

Quotes are Noodle's, verbatim. Annotations are the interpretation and where it lives. If they disagree,
the quote wins.

Status key: ☑ settled · ◐ provisional (a number the audit will re-cut) · ⏸ waiting on Noodle

## The problem this solves

> No matter how good the card pool is, balance will still be busted while our enemies are too weak.
> There's so much to consider when it comes to effective balance. How many turns should each fight be?
> How much damage should we expect to take? How easy and available will healing be? We should have
> started around a foundational number and built our card pool around that, and I worry that building a
> second without figuring that out will leave us down the same hole again.

The session-20 balance model (`../../reference/MECHANICS-02.md` part 1) fixed the **card** side: what one
energy buys. It never fixed the **fight** side: how long a fight lasts and what it costs. So the pool was
priced against itself and never against an enemy, and the enemies were written by feel. This file fixes
the fight side. The card rates are kept.

## 1. What is already fixed and stays fixed ☑

| Quantity | Value | Where |
|---|---|---|
| Energy per turn | 3 | `tuning.combat.energyPerTurn` |
| Cards per turn | 5 | `tuning.combat.handSizePerTurn` |
| Party | 3 | `tuning.run.partySizeMaximum` |
| Party HP | 52–68 each, **~174 total** | `baseHealth` per character |
| Damage | 6 / 9 / 12+ per energy (starter / common / rare) | `CARD-POOL-01.md` §1.2 (session 33, Noodle) |
| Temporary HP | same curve as damage, halves each turn | `CARD-POOL-01.md` §1.2 |
| Rest heal | 30% of max HP, all allies | `tuning.rest.healFraction` |
| Treatment | 60% of max HP, one ally, costs the rest action | `tuning.rest.treatmentFraction` |
| Lust decay | 2 per map move | `tuning.lust.decayPerMapMove` |

## 2. The one number: turns per fight ☑

Everything else derives from it. Enemy HP is party output per turn × target turns. Enemy damage per
turn is the fight's damage budget ÷ target turns plus what the party is expected to block. Healing
availability is the rest fraction; in-deck sustain is what a Grind deck buys to beat the budget.

| Fight | Act 1 turns | Act 2 turns |
|---|---|---|
| Normal | 3–4 | 4–5 |
| Elite | 6–7 | 6–7 |
| Boss | 9–10 | 9–10 |

**Reading:** a normal fight over the top of its band is a failure of the pool or of the enemy, not a
"hard fight". Burst beats the band by finishing under it; Grind sits at the top of it and pays less per
turn. Both are in the band. Lives in `tuning.balance.turnTargetArray`.

## 3. The budget: net damage taken per fight ◐

"Net" is health actually lost after Temporary HP and healing. Expressed as a share of party HP (~174)
so it survives any HP retune.

| Fight | Act 1 | Act 2 |
|---|---|---|
| Normal | 8% (~14) | 14% (~24) |
| Elite | 20% (~35) | 30% (~52) |
| Boss | 35% (~61) | 45% (~78) |

**Checked against the demo run** as the map generator actually builds it (regions of 18 and 11 rows,
`tuning.map.nodeWeightArray`, one forced combat first, one forced rest before each boss):

| | Act 1 | Act 2 |
|---|---|---|
| Normal fights | ~7 | ~4 |
| Elites | 1–2 | ~1 |
| Bosses | 1 | 1 |
| Rests (30% each) | ~2.6 | ~2 |
| Spend, no sustain, no burst | 56 + 30 + 35 = **121%** | 56 + 30 + 45 = **131%** |
| Available | 100 + 78 = **178%** | 57 carried + 60 = **117%** |

A deck that neither shortens fights nor mitigates leaves Act 1 with ~57% of party HP and **dies at the
Act 2 boss**. That is the bible's premise in numbers: Act 1 tests strategy selection and lets a hybrid
through; Act 2 filters it out. Burst beats the budget by cutting turns, Grind by paying less per turn.

Lives in `tuning.balance.netDamageFractionArray`. Provisional until the budget audit has run against the
new pool; the run shape (fights per act) is measured, not assumed.

## 4. Deriving enemies from the budget ☑ (the rule) / ◐ (the numbers)

**Party output per turn** `P` at each stage. The baseline is a starter deck spending one energy a turn
on defence and two on attack: 2 × 6 = **12**. Drafting raises it.

| Stage | P (damage / turn) |
|---|---|
| Act 1 early (starter deck) | 12 |
| Act 1 late | 18 |
| Act 2 | 24 |

**Encounter HP** = `P × target turns`. Act 1 early normal at 3.5 turns = **~42 total HP across the
line-up**; Act 1 late normal at 3.5 = ~63; Act 1 elite at 6.5 = ~117 (P 18); Act 1 boss at 9.5 =
~171 (P 18, plus reinforcements count). Act 2 normal at 4.5 = ~108; Act 2 elite ~156; Act 2 boss ~228.

**Encounter gross damage per turn** = `net ÷ turns + expected mitigation`, where expected mitigation is
the one energy a turn of Temporary HP the baseline deck spends: **6**. So Act 1 normal = 14 ÷ 3.5 + 6 =
**10 / turn**; Act 1 elite = 35 ÷ 6.5 + 6 = ~11; Act 1 boss = 61 ÷ 9.5 + 6 = ~12; Act 2 normal ~11.5;
Act 2 elite ~14; Act 2 boss ~14. Per line-up, not per enemy: three bodies split it.

**The variance rule.** Every encounter in a tier lands within **±25%** of the tier's HP and gross-damage
targets. The measured current roster (§7) shows the actual problem was never "every enemy is weak": a Lone
Sporeling and Deep Swarm sit in the same tier at a tenfold difference in cost. Averages feel weak and
outliers feel unfair. Lives in `tuning.balance.varianceFraction`.

**Lust** is a second bar against the same budget. An enemy line-up's gross Lust per turn is budgeted at
**≤ 60%** of its gross damage per turn, and lust-carrying enemies appear in about a third of encounters,
so a no-soothe deck breaks somebody roughly once per act. Provisional; the audit measures it.

## 5. Healing: a patch, not a wall ☑ (rule) / ◐ (rates)

> Finally, and I'm sorry to leave this as a single vague note at the bottom of a misc list, I replayed
> slay the spire and realized we may have drawn ourselves into a corner by having such reliable healing.
> Yes, healing does not advance the gamestate, and in a traditional card game healing is useless, but
> roguelikes start to fall apart if they can't grind you down. Not every fight is a 1-1 on equal
> footing, successful resource management is often the key to minimizing health loss, so without a need
> to minimize health loss, the need to successfully manage resources is gone too.
> The reason this is such a huge speedbump, is that while Severine's lifedrain can be balanced by her
> self-damage to mostly even out, Clement's entire kit is designed around healing. The only way she's
> balanced is if she makes the game more about balancing lust, but her mechanic of breaking makes that
> really hard to balance. I suppose the only thing to do is dive in.

This is the second foundational number: the budget only grinds anyone down if healing cannot erase it.

> Super arbitrary limitations like that will frustrate players, I'm sure of it, and any design mistakes
> we make will be a lot more obvious to a frustrated player. Instead, the way to do it is to keep healing
> limited and balanced (outside of Clement, she really flips things on their head, and at that point it's
> even more about managing party lust instead).

**No engine rule.** A fight-start healing ceiling was built in session 32 and reverted the same session
on that note; the engine heals to maximum health as it always did. Healing is limited by **pricing and
scarcity in the pool**, which is content work, checked by the audit:

1. **Rests are the chronic heal.** 30% Sleep, 60% Treatment. They are the budget's income.
2. **Healing is priced below Temporary HP.** Prevention is 6 per energy; repair is **3 per energy** on a
   common, **4** on a conditional rare. A heal card is a worse card than the tHP card that would have
   prevented the damage, so a Grind deck buys tHP for the wall and heals to patch.
3. **Healing is scarce outside Clemence.** *(Loosened session 33: any character may heal on a rare with a
   condition or a common that Exhausts — `CARD-POOL-01.md` §2. Clemence never soothes an ally.)* Severine's heals are paid for by her self-damage (net zero is
   the design); no other character gets a plain heal card. The audit's `heal` column is what "limited"
   means in numbers: a baseline deck healed 13–50 per fight in the session-32 report, all of it from
   starters, and that figure is the one the new starters must bring down.
4. **Clemence is the exception on purpose.** She heals freely and pays in Lust (Penance). A character
   Breaks when Lust reaches health plus Temporary HP, so her healing raises the party's break threshold
   while she walks toward her own. With Clemence in the party the run's pressure moves from health to
   **party Lust management**, and her pool is balanced against the Lust budget (§4), not the damage one.
   The enemy pass gives Lust-carrying enemies enough presence that this pressure is real.

**Severine's self-damage** counts against the budget like enemy damage (it is net health lost). The audit
reports it separately.

**Severine's self-damage** counts against the budget like enemy damage (it is net health lost) and is
what pays for her rate. The audit reports self-inflicted damage separately.

## 6. What the pool is priced against (the handoff to CARD-POOL-01) ☑ corrected session 33

Session 32 priced every card at the starter rate (6 per energy). Noodle corrected it: starters 6,
commons 9 at the low end, rares 12+, and draw is worth less than energy. The full table is
`CARD-POOL-01.md` §1.2. The §4 party outputs (12 / 18 / 24) already assumed exactly these tiers, so
the *targets* stand. **The enemies themselves do not** (Noodle, session 33): they deal nowhere near a
steady per-fight share, and a pair of 20-HP enemies rarely reaches turn 3. The enemy pass (§8.6) is still
required, re-measured against the new pools; see `CARD-POOL-01.md` §0.

- A **starter attack** is 6 damage per energy, so a starter line-up of ~42 HP dies in 3–4 turns of
  two-energy attacking. **Commons at 9** carry Act 1 late (P 18); **rares at 12+** carry Act 2 (P 24)
  and take a Deep Swarm-sized line-up under the band.
- A **starter defence** is 6 tHP per energy. One per turn is the baseline mitigation the enemy numbers
  assume; a Grind deck runs two, at the common rate of 9.
- A **heal** is half the tHP rate of its tier (3 / 4–5 / 6) and only ever undoes this fight's damage.
- **Lust inflicted** on enemies is 7 / 10 / 14 per energy (enemy break is a kill).
- **Every character** must field a Burst face and a Grind face across its four outfits, because §3 is
  only fair if either strategy can beat it. The pool brief's grid enforces this per sister.

## 7. The measurement: `../../tools/budget-audit.js` ☑

`node "!designDocs/honeycomb/tools/budget-audit.js" [--seeds N] [--party a,b,c] [--json]` plays every
encounter headlessly with a scripted baseline player (starter decks, no tree, one energy a turn on the
most-hurt ally's defence, the rest on the lowest-health enemy), N seeds each, three fixed parties, and
reports per encounter and per tier: win rate, turns, line-up HP, gross damage and Lust per turn, net HP
lost as a share of party HP, self-inflicted damage, and party output per turn — each beside its
`tuning.balance` target with a ✓ / ▲ (over) / ▼ (under) mark.

It is deliberately dumb. Its job is to say what a fight costs a player who has no plan, because that is
the player the budget is written for. Run it after any change to an enemy, an encounter, a starter card,
or `tuning.balance`; the draft simulation's missing run-length model is the same tool with a drafted deck.

**Current roster, measured (session 32, before any enemy change).** Full table:
`BALANCE-01-AUDIT-S32.txt` (20 encounters × 3 parties × 8 seeds). What it says:

| Finding | Numbers |
|---|---|
| **The baseline deck outputs 8–10 a turn, not 12.** | Starter attacks under-deliver against 6 per energy, hands often hold one attack, and enemy Temporary HP (Harden 6, Fade 8, Curl Up 16, Uproot 18) soaks the rest. The new starters must reach 12; enemy tHP counts as line-up HP in the enemy pass. |
| **Every fight is 2–4× too long.** | Early normals 3.5–7.8 turns against 3–4; middle 7–14; late 8–19; bosses 12. Length, not damage, is the shared fault. |
| **Early fights are harmless.** | Gross 3–6 a turn against a target of 10; net 2–12% of party HP. Long and cheap: boring. |
| **Middle and late normals are brutal.** | Net 15–88% of party HP against 8%; Two Cap Brutes 57%, Bulwark Line 88% at a 4% win rate. Deep Swarm and a Lone Sporeling share a tier at a tenfold cost difference. |
| **Bosses are unwinnable for a no-plan deck.** | 4% win, 80–93% net, gross 18–31 a turn against 12–14. Matriarch 130 HP is under the 171 target; her cost is the Lash/Swarm rate over 12 turns. |
| **Lust is under budget everywhere.** | 1–5.5 a turn, all under the 6–8.6 maximum. Room to raise it, which Clemence's design needs (§5.4). |
| **Baseline healing is 13–50 per fight.** | All from starters (Drain, Last Rites, Offering). This is Noodle's "too reliable" in numbers. |

**Derivation for the enemy pass:** fix line-up HP to `P × turns` **including expected tHP gains**, set
gross damage per turn to the §4 figure, pull every encounter in a tier within ±25% of both, and give
bosses their cost through length (9–10 turns at 12–14 gross) rather than 30-a-turn swings.

## 8. Order of work

1. This file and `tuning.balance` ☑
2. `../../tools/budget-audit.js` and the first report ☑ (§7)
3. ~~The healing cap~~ ✗ reverted on Noodle's note (§5)
4. `CARD-POOL-01.md` — the pool brief against §6, OUTFITS-LIST, the bibles and STARTER-REWORK §1.6 (skeleton written session 32; the per-card grid is the follow-through)
5. The pool itself
6. The enemy pass — re-derived from §4 and §7 against the new pool, re-measured by the audit
