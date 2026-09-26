# Elite enemies and encounters — draft 01 (S64-2)

**A cloud draft for a desktop review.** Session 68, 2026-09-26. Nothing in the game changed. The pool is
written in the live tables' own shape in `ELITE-DRAFT-01.js`, graded by `../tools/elite-draft-audit.js`
(the template, the shape rules, the tags, coverage, and Basic Bite), and every verdict, name and picture
waits for the frame (`../BASICS.md`, "Design review happens on the desktop"). The two files are the
deliverable; this page is the reading of them. It sits on session 66's common draft
(`COMMON-ENCOUNTERS-01.md`): three elite fights field bodies that draft adds or resizes, and the audit
applies the common draft first.

```
node "!designDocs/honeycomb/tools/elite-draft-audit.js"                 template, shape, tags, coverage
node "!designDocs/honeycomb/tools/elite-draft-audit.js" --bite          every drafted elite fight, four parties
node "!designDocs/honeycomb/tools/elite-draft-audit.js" --bite --halve  the same under E14's Poison
```

---

## 1. The rules for the session, in his words

The ten rules of the common session apply here by his own sentence (*"This should actually extend to
elites and bosses as well"*); they are filed whole in `COMMON-ENCOUNTERS-01.md` §1. What he has said about
elites in particular:

> - Elite enemy encounter rework & additions

> I think we may not need as much elite variety as normal enemy variety. Players are avoiding elite encounters.

> for argent fencer's sprite we were supposed to save her for a two-enemy elite encounter with the other butterfly knight

> Demikobold as an act invader should probably be redesigned as someone who preys on the weak, would help to diversify her from the other scrap collector, the fire doesn't really sell me on "salvage". If you're using her, I'd recommend a rework to that whole elite encounter, and also including bellhead-a.

> It was bellhead-a, demikobold-c, feralbeast-b, spookytall-a, and tophatfairy-c. Those were the designs I showed off as upcoming previews because they were very cool, demo players will be expecting them.

> Scrap salvager's definitely an elite.

And the standard the session is graded on (S65-1): the first demo was too hard, and *"A run ending in the
first 1/3rd of act 1 should be astronomically unlucky"*. Elite nodes cannot appear before 35% of a
region's depth (`tuning.map.eliteEarliestDepthFraction`), so no elite sits on the floor; the number to
hold is the elite cost target, 22% of party health in act 1-1 and 30% on a route.

---

## 2. What shipped, measured

Fourteen elite encounters over three elite bodies (two of them benched), every route node borrowed.

| Rule | What the table does today |
|---|---|
| Route identity | **Every elite node on every route is borrowed** (E11): the Kobold Scavenger stands in all three routes' elite pools and the Hollow Champion in the Frontier's. The Scrap Salvager, the Frontier's own elite, is `benched` for being a hue-shift of the Scavenger, so the pool he was benched from still shows the Scavenger. |
| The previewed designs | Four of the five (E13) are assigned to elite jobs and none is built: `feralbeast-b` the Arbor's elite, `spookytall-a` the Road's, `demikobold-c` and `bellhead-a` the Frontier's intruder pair. |
| The Fencer pair (B36) | The Argent Fencer is in seven ordinary fights, none of them the two-enemy elite she was saved for. Session 66's draft took both Fencers out of the commons for this session. |
| One or two types a fight | Every shipped elite fight passes; all are one body or an elite plus one common. |
| Spread of sizes | Two solos (act 1-1); every other elite fight is exactly two bodies. No elite fight has three. |
| Repetition | Act 1-1's pool is two fights a tier; each route's is one fight a tier, so a path with two elite nodes in the same band of a route serves the same fight twice. |
| Difficulty (Basic Bite, 2 seeds, 4 parties) | Act 1-1 elites cost 30–40% of party health against a 22% target. Route elites cost 29–70% against 30%: The Cage Duel (Champion + Cagecap) 61.5% at a 50% win rate, The Root Cache 62.5%, The Stripped Bower 69.7% at 63%. **Every elite fight runs 10 to 15 turns against a 6 to 7 turn target.** |
| Tags | The Fencers' three Charm moves and the Salvager's Restraint snare still to retag (E14). |
| Art | The Scavenger, the Champion and the Salvager stand on generated stand-ins. Both Fencers have their own drawings. |
| How often an elite is met at all | A random path meets 0.95 elite nodes in act 1-1 and 0.45 on a route; **a quarter of route maps generate with no elite node at all**, and 60% of route runs never fight one. |

---

## 3. The math

**Nodes.** The map generator (`tuning.map.nodeWeightArray`, elite weight 10 of 110, held to the back
65% of a region, never two in a row on a path) puts 2.7 elite nodes on an act 1-1 map and 1.1 to 1.3 on
a route map; a random path meets 0.95 and 0.45 of them. Measured over 400 generated maps a region.

**The block rule** (*a won encounter is blocked for the next two*) for elites: a path meets a second elite
in the same region in 25% of act 1-1 runs and 4–7% of route runs. A pool of two would force the second
pick every time that happens; a pool of three always leaves a real roll. Session 66's answer stands:
**three fights a region**, four in act 1-1 where two elite bodies already exist.

**One pool a region.** Every drafted elite fight is written at tier `middle`. An elite node on an early
row asks for `early`, finds no elite there, and steps down to `middle` (`honeycomb.rollEncounter` steps
down before it widens); one on a late row asks for `late`, finds nothing, and falls through to the
region's whole elite pool. So a region's elites are one pool of three or four, the block rule always has
a real roll (0 forced picks over 300 runs), and the enemy template already grades every elite body at
the middle stage. What it costs: act 1-1's late-row elites are written to the middle budget (137 health)
instead of the late one (156), 12% lighter, in the direction S65-1 asks.

**Coverage.** Each act 1-1 elite fight is met in 21–24% of runs; each route elite fight in 10–16% of
runs that take its route, 3–5% of all runs. Elite variety is the cheapest variety in the game to leave
unbuilt, which is his own reading (*"we may not need as much elite variety"*), and the thirteen fights
here are the whole of it.

---

## 4. The rules as checks

The audit tool fails a draft on any of these; the tables in §6 and §7 pass all of them.

1. **One or two enemy types** in every elite fight.
2. **No two elite fights in a region share a type set**; near-duplicates are printed with a `~`.
3. **Three fights a region** (four in act 1-1), one pool, so the block rule always leaves a real roll.
4. **Every elite body stands in one region's elite pool and in no ordinary fight.**
5. **Formation is the order of `enemyIndexArray`**: index 0 stands in front. The body to be reached is
   written behind the body that guards it.
6. **Lust at or under 60% of a line-up's threat**, every Lust move tagged Venom, Exposure or Heat.
7. **Inside the elite template** (health and full-strength damage within 25% of the elite group's
   budget: 137 health in act 1-1, 195 on a route; a solo at the solo damage line, a group at the group
   line) and **at or under the shipped elite ceiling** by Basic Bite (§7).

---

## 5. The roster

**One role joins `tuning.balance.enemyRoleArray`: `eliteHalf`** (health 0.5 and damage 0.75 of the elite
group, before `elite`), the elite twin of `bossHalf`: a matched pair sums to one elite fight. The damage
share is 0.75 rather than 0.5 because the template grades a body of the elite group against the solo
line and a two-body fight against the group line, and a pair can lose a member where a solo cannot.

### Act 1-1, the Upper Catacombs — 2 elites, kept

| Enemy | Role | HP / dmg | Identity | Tag | Art |
|---|---|---|---|---|---|
| Kobold Scavenger | elite | 130 / 16.9 | The trespasser with the satchel of bombs; curls up when hurt; the Big Bomb is charged. Unchanged. Goes back to being an act 1-1 creature: out of every route. | Exposure (Chem Fumes) | stand-in |
| Hollow Champion | elite | 140 / 12.8 | Cleaves the line, lunges the front, thrusts past Temporary HP to the back. Unchanged. Out of the Frontier. | Exposure (Piercing Thrust) | stand-in |

Neither number moves: they are the shipped ceiling for act 1-1 (§7) and S64-3's boss session and the
Crunch own the rebalance. The story bible reads both as Act 2's Old Tenants material that *"stay where
they are"*.

### Act1-A, the Mushroom Frontier — the intruder pair (E7-DEFERRED)

| Enemy | Role | HP / dmg | Identity | Tag | Art |
|---|---|---|---|---|---|
| **Scrap Salvager** (off the bench) | **eliteHalf** (was elite 135) | 97 / 15.1 | Same kit: Spark Spear strips Sundered, the Wire Snare drags the front rank to the back, the Discharge is charged, Patch Up dawdles. Act 2 scrap on an Act 2 body among mushrooms. | Heat (Wire Snare, a grapple) | **`bellhead-a`**, read as his new drawing (§8, I20); stand-in until then |
| **Kobold Gleaner** (new, `demikobold-c`) | **eliteHalf** | 97 / 13.6 | **Preys on the weak.** Every attack lands on whoever has the least health left (`weakestEnemy`): Pick Off, Hamstring (Sundered on the straggler), a charged Finish the party sees coming, Skulk. A party that lets one member run low pays; a party that kills her first does not. No fire. | none | assigned, undrawn |

The Salvager is a half rather than a whole so the pair is one elite fight at the budget (194 of 195)
instead of 270; each is also fielded with natives, where the half-elite line plus a common lands inside
the same budget. Between them the pair tests both paths (`../designBibles/mechanics.md` §3): he strips
mitigation and disrupts the formation (Grind), she punishes a slow kill (Burst).

### Act1-B, the Thorn Arbor — the Lush (E11)

| Enemy | Role | HP / dmg | Identity | Tag | Art |
|---|---|---|---|---|---|
| **The Lush** (new, `feralbeast-b`) | elite | 160 / 17.6 | *"The route's elite"*, demoted from boss when the Sisters took the slot. A beast that got into the arbor and is drunk on the windfalls: Stagger (18 to the front), Wallow (Temporary HP and Strength; it dawdles with a payoff), Slaver (a little Venom and a Poison over everyone), a charged Rampage over the party every third turn or so. Wallow was a heal and Slaver dealt twice the Lust on the first pass; both came down after Bite (§7). | Venom (Slaver) | assigned, undrawn |

Written at 160 of the 195 elite line so the same body fights alone and with company inside one budget:
alone it is the route's single guy; fed by the Wellspring or fronted by two Brats it is a whole elite fight.

### Act1-C, the Pollen Road — the Fencer pair (B36) and the Longshade (E11)

| Enemy | Role | HP / dmg | Identity | Tag | Art |
|---|---|---|---|---|---|
| **Sable Fencer** | **eliteHalf** (was soldier 67) | 97 / 15.1 | The sealed half, in front: Straight Thrust 20, Bind (Weak and Lust), Hold the Line over everyone, Cup Guard (Temporary HP and Thorns). Amounts lifted in proportion. | Exposure (Bind) | own drawing |
| **Argent Fencer** | **eliteHalf** (was striker 45) | 97 / 15.6 | The open half, behind him: the Long Lunge reaches the back rank, Remise and Wing Flare carry the Road's Lust, Appel is Strength. She never steps back. | Exposure (Remise, Wing Flare) | own drawing |
| **Longshade** (new, `spookytall-a`) | elite | 160 / 18.5 | *"Can fit into a lot of places."* Kin of the Longwing (`spookytall-d`, the same source family). A tall thing in the bloom that looms: Stoop on the front (20), Loom (Temporary HP, Weak over the party), Whisper to the back rank (damage and Lust), a charged Unfurl over everyone (damage, Lust, Sensitive). Measured alone at 19% on the first pass, so a share of its Lust became damage. | Exposure (Whisper, Unfurl) | assigned, undrawn |

**Out of every elite pool:** nothing. The Dandy stays a common lone (I15); if he wants `tophatfairy-c` as
the Road's elite instead, the pivot is that entry's.

---

## 6. The encounters

Front first. **B** is what tests Burst, **G** what tests Grind. Static marks are the audit's arithmetic
against the elite budget (✓ within 25%); Bite is the share of party health lost, four parties × two
seeds, fresh-save decks drafted to the middle stage, and the win rate where it is under 100%. Every fight
is tier `middle` (§3).

### Act 1-1 (elite budget 137 health; solo 15.6, group 23.4 damage; target 22% of party health)

| Fight | Formation, front first | Size | The read | B / G | Static | Bite |
|---|---|---|---|---|---|---|
| The Kobold Scavenger | Kobold Scavenger | 1 | the bomber alone; the curl answers a burst turn | B curl / G bombs | ✓ ✓ | 32.1% |
| The Hollow Champion | Hollow Champion | 1 | the duelist alone; the thrust goes past walls | G anti-wall / B retort | ✓ ✓ | 30.0% |
| The Scavenger's Cache | Puffcap, Kobold Scavenger | 2 | **the fuse in front, the bomber behind**: reach him through a three-turn clock | B clock / G bombs | ✓ ✓ | 35.8% (was 40.4% with him in front) |
| The Champion's Guard | Sporeling, Hollow Champion | 2 | a spore in front that bursts when it dies | G poison / B | ✓ ✓ | 37.4% |

### Act1-A, the Mushroom Frontier (budget 195; solo 21.8, group 32.7; target 30%)

| Fight | Formation | Size | The read | B / G | Static | Bite |
|---|---|---|---|---|---|---|
| **The Intruders** | Scrap Salvager, Kobold Gleaner | 2 | he snares and patches in front; she picks off the lowest from behind him | G stripped guard / B kill order | ✓ ✓ | 41.3%, 2.0 Broken |
| **The Gleaning** | Shieldcap ×3, Kobold Gleaner | 4 | three hired pavises blunt sweeps while she picks | B blunted sweeps / G the straggler | ✓ ✓ | 40.4% |
| **The Salvage Gate** | Doorward, Scrap Salvager | 2 | a native wall in front of the scrap; the wall taunts one turn in three, the scrap strips | B rhythm / G Sundered | ✓ ✓ | 39.4% |

### Act1-B, the Thorn Arbor (budget 195; solo 21.8, group 32.7; target 30%)

| Fight | Formation | Size | The read | B / G | Static | Bite |
|---|---|---|---|---|---|---|
| **The Lush** | The Lush | 1 | the route's elite alone | B race the Rampage / G Strength and poison | ✓ ✓ | 36.6% (42.0% before Slaver's Lust came down) |
| **The Lush and the Fencer** | Thorn Fencer, The Lush | 2 | the duelist in front with reach to the back rank, the beast behind him | B thorns / G Venom | ✓ ✓ | 57.6%, 88%, 1.9 Broken; the dearest fight in the draft (§7) |
| The Lush at the Well (candidate) | The Lush, Wellspring | 2 | the beast in front, the bloom behind that Envenoms it and regenerates it: kill the bloom first or fight a poisoned beast | B kill order / G Envenomed | ✓ ▼ | 56–66%, 63%, 3.0 Broken, 16–17 turns; measured out |
| **Brats and the Lush** | Briar Brat, Briar Brat, The Lush | 3 | two brats tripping the front rank, the beast behind them | B AoE then the beast / G | ✓ ✓ | 40.9% |

### Act1-C, the Pollen Road (budget 195; solo 21.8, group 32.7; target 30%)

| Fight | Formation | Size | The read | B / G | Static | Bite |
|---|---|---|---|---|---|---|
| **Sable and Argent** | Sable Fencer, Argent Fencer | 2 | B36's pair: the sealed one in front with thorns up, the open one lunging past him to the back | B thorns / G Lust and Weak | ✓ ✓ | 36.9%, 75%, 2.3 Broken (61.4%, 63% before the cut) |
| **The Longshade** | Longshade | 1 | the tall one alone | B race the Unfurl / G Lust | ✓ ✓ | 30.0% (18.7% before the Lust-to-damage shift) |
| **The Longshade in the Drift** | Dustmote, Dustmote, Longshade | 3 | two motes in front shedding dust, the tall one behind them | B AoE / Lust | ✓ ✓ | 37.1% |
| Longshade and Longwing (candidate) | Longshade, Longwing | 2 | kin from one source family: the tall one in front, the swaying one behind; the better read and the dearer fight | Lust / G Sensitive | ✓ ✓ | 44.5%, 75%, 10.6 Lust a turn (27.3%, 63% before the shift) |

---

## 7. Measured against the ceiling

The ceiling is the costliest elite fight that shipped in each region (Basic Bite, same bot, same decks);
the target is `tuning.balance.netDamageFractionArray`'s elite row.

| Region | Shipped ceiling (Basic Bite) | Target | Draft, highest live | Over the ceiling? |
|---|---|---|---|---|
| act 1-1 | 40.4% (The Scavenger's Cache, late) | 22% | 37.4% (The Champion's Guard) | no; the four sit 30–37%, unchanged bodies |
| Frontier | 61.5% at 50% wins (The Cage Duel); 49.5% (The Champion's Line) | 30% | 41.3% (The Intruders) | no; 39–41%, near the shipped Salvage Boss (38.4%) |
| Arbor | 69.7% at 63% wins (The Stripped Bower); 62.5% at 75% (The Root Cache) | 30% | 57.6% at 88% wins (The Lush and the Fencer) | no, but the dearest fight in the draft; the other two 37% and 41% |
| Road | 53.1% (Something Worth Taking); 33.2% (The Roadside Cache) | 30% | 37.1% (The Longshade in the Drift) | no; 30–37% |

**Six fights were measured over the ceiling or far over the target and changed the same session**; what was
cut stays in the file as `candidate` rows (`weight: 0`) so the desktop can re-measure it:

| Drafted | Measured | Became | Measured again |
|---|---|---|---|
| Sable and Argent at Thrust 20 / Line 8 / Lunge 24 / Remise 12+6 | 61.4%, 63% wins | Thrust 17 / Line 6 / Lunge 20 / Remise 10+4 | 36.9%, 75% wins |
| The Longshade alone, Lust-heavy | 18.7% | a share of its Lust became damage (Stoop 20, Whisper 6+4, Unfurl 7+4) | 30.0%, on the target |
| Longshade and Longwing | 27.3%, 63% wins, 11.1 Lust a turn | the Longwing's Lust is the loss; the Drift (two Dustmotes) stands live at 37.1%, 100% wins | Kin as a candidate: 44.5%, 75% |
| The Lush at the Well, Wallow a heal of 10 | 55.9%, 88% wins, 17 turns | Wallow to Temporary HP; then Slaver's Lust 2 to 1 and Stagger 16 to 18 | 59.3% then 66.3%, 63% wins: **measured out**, a candidate |
| The Lush and the Fencer (its replacement) | 59.2%, 88% | after the Lush's third pass | 57.6%, 88%; live, and flagged |
| The Scavenger's Cache with the Scavenger in front | 40.4% (shipped) | the Puffcap in front | 35.8% |

**Poison halving is not the lever here.** The common draft's bulk-poison fights fall by a third under E14's
halving; the Arbor's elite fights do not (`--halve`: The Lush alone 45.7% against 42.0%, The Lush and the
Fencer 63.6% against 59.2%, the same run). What makes the Lush dear in company is length: a 160-health body
beside an engine body runs 15 to 17 turns on this bot, and by then two members have Broken to a little Lust
a turn. The Brats fight, whose company dies in two turns, costs 41%. The number that moves it is the
bot's or the party's damage output, which is the Crunch's calibration (S65-1), not a kit change.

**Every elite fight, shipped and drafted, runs 10 to 16 turns against a 6 to 7 turn target.** That is the
elite half of P14 and the same finding the commons carry; no fight here was written to fix it.

---

## 8. Enemy flexibility: the crunch bends to the art

None of the four assigned pictures is in the cloud copy, so every new kit is a silhouette role and a
targeting idea, never a species. If the drawing that turns up is something else, the kit stays and the
words move.

| Kit | Needs from the drawing | Anything else is free |
|---|---|---|
| **Kobold Gleaner** (Frontier half) | one slight, quick figure with a hook or a barb, lower than the Salvager, nothing burning; stands at 1.0 | `demikobold-c` as assigned, or any small quick figure; the kit is the targeting |
| **Scrap Salvager** as half | one heavy figure in scrap, visibly the other one's partner; nothing damp | **`bellhead-a`**, read as his redrawing (I20); if `bellhead-a` is a third body instead, it takes this kit's slot in The Salvage Gate and the Salvager keeps his brief |
| **The Lush** (Arbor elite) | one big low four-legged body, heavier than anything else in the arbor, mouth open; stands at 1.3 | `feralbeast-b` as assigned, or any big beast; "drunk on the windfalls" is the reading of a moth-beast in a fruit arbor and moves with the picture |
| **Longshade** (Road elite) | tall and thin, winged, taller than the Longwing; stands at 1.2 (B37 cuts tall drawings off the top of his window) | `spookytall-a` as assigned, or any tall winged drawing |
| **Both Fencers** as halves | unchanged; they already read as a duo | their own drawings |

Nothing new is drawn for act 1-1's elites; B38's stand-in list already carries the Scavenger and the
Champion.

---

## 9. What the engine needs from this

Each is a table entry or one verb.

1. **One role**: `eliteHalf` in `tuning.balance.enemyRoleArray` before `elite`; a compendium heading for it
   in `enemyGroupHeadingArray` or it lands in "Other" (I10).
2. **The block rule** (`../engine/ENGINE.md` S66-1), unchanged: elite nodes are combat nodes to it.
3. **Retired fight indices.** Ten elite indices leave the table (the Frontier's four and the benched
   pair, the Arbor's two, the Road's two); act 1-1's four keep theirs. A save whose map names one re-rolls that node on load, the
   same handling S64-1 §9 asks for.
4. **Unbenching** is the deletion of two `benched: true` rows, which the draft replaces outright.
5. **`weakestEnemy`** already exists as a target mode; nothing new. The desktop should watch one Gleaner
   turn in the frame to see the pick land on the lowest member.
6. **Heat** and the **Poison** halving, as S64-1 §9 already lists.
7. **Four bodies on the stage** for The Gleaning; `audit-sprite-fit.js` at his window is the check.

---

## 10. Left for him

- **Names.** Kobold Gleaner, The Lush, Longshade, and the nine new fight names.
- **`bellhead-a`.** Whether it is the Salvager's new drawing (this draft) or a third intruder body (§8).
- **Longshade beside Longwing.** The shared stem is the kinship; if the two names collide in the mouth
  the way The Pall and The Pale Dray did, the elite is the one to rename.
- **The Longshade's company.** Two Dustmotes stand live (37%, every fight won); the Longwing, the better
  read, waits as a candidate (44% at 75% wins, most of it Lust). His call which one the frame keeps.
- **The Lush's company.** An engine body beside it (the Fencer, the Wellspring) runs the fight to 15
  turns and 58–66% on this bot; the Brats do not (§7). The Fencer fight stands live under the shipped
  ceiling; whether it should stand at all is his, and the Crunch's calibration is where the number moves.
- **The Dandy** as a common lone against `tophatfairy-c` as the Road's elite (I15).
- **One pool a region** at tier `middle` (I19), against the shipped two-tier split.
- **Act 1-1's elites unchanged** at 30–40% of party health against a 22% target; the Crunch's calibration
  hour (`../tooling/TOOLING.md`) is where that number moves.
- **Elite fights that run twice their turn target** (10–15 turns against 6–7): the same P14 question the
  commons carry, and the only fix is the Crunch's.
- **A quarter of route maps have no elite node.** `tuning.map` is the engine's, not this pipeline's, but
  it decides whether the fights above are met.
- **The Scavenger out of the routes.** Every route elite is native now; he was the stopgap (E11).

---

## 11. Uniqueness, and what the art pipeline needs

**Every elite body stands in exactly one region's elite pool and in no ordinary fight.** The audit prints
the map. With the common draft in place there is no cross-region enemy left anywhere in act 1.

| Region | Elite bodies | Own drawing | Stand-in (B38) | New sprite pairs to make |
|---|---|---|---|---|
| Act 1-1 | Kobold Scavenger, Hollow Champion | — | both | **0** |
| Act1-A Frontier | Scrap Salvager, Kobold Gleaner | — | the Salvager | **2**: the Salvager from `bellhead-a`, the Gleaner from `demikobold-c` |
| Act1-B Arbor | The Lush | — | — | **1**: from `feralbeast-b` |
| Act1-C Road | Sable Fencer, Argent Fencer, Longshade | both Fencers | — | **1**: from `spookytall-a` |

Four sprite pairs (`1-combat` and `1-offense` each) ship the whole elite pool, and all four are assigned
sources run through the pipeline, none a new design. **All five previewed designs are then in the game:**
`tophatfairy-c` and `beenoble-a` in the common draft, the other four here.
