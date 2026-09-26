# Common enemies and encounters — draft 01 (S64-1)

**A cloud draft for a desktop review.** Session 66, 2026-09-25. Nothing in the game changed. The pool is
written in the live tables' own shape in `COMMON-DRAFT-01.js`, graded by `../tools/common-draft-audit.js`
(the template, the shape rules, the tags, coverage, and Basic Bite), and every verdict, name and picture
waits for the frame (`../BASICS.md`, "Design review happens on the desktop"). The two files are the
deliverable; this page is the reading of them.

```
node "!designDocs/honeycomb/tools/common-draft-audit.js"                 template, shape, tags, coverage
node "!designDocs/honeycomb/tools/common-draft-audit.js" --bite          every drafted fight, four parties
node "!designDocs/honeycomb/tools/common-draft-audit.js" --bite --halve  the same under E14's Poison
```

---

## 1. The rules for the session, in his words

> - Enemy memorability. Mixed rosters leave less chance for an enemy to stick in the player's mind. This does create high-priority target situations, but that's only something an experienced player will realize in our current ecosystem. In general, each enemy encounter would be best if it introduced just 1 or 2 enemy types per combat.
> - Instant conveyance. If we as designers want an encounter dealt with a certain way, how are we communicating that? If a fragile, high-damage enemy should be targetted first, are we showing that visually by having them placed directly behind a visibly bulky defensive enemy?
> - Less homogeny. Encounters feel very much like there's far too many 3-4 enemy lineups. They should be spread out more. An encounter vs 5 minion-level enemies (the kind summoned by bosses), an encounter vs a single guy. Those are our two ends of the spectrum, and we want to rebalance encounters such that we get more encounters closer to those ends.
> - Repetition prevention. The same encounter should never happen twice in a row. This should actually extend to elites and bosses as well. So a new rule; when an encounter is won, it's blocked from appearing for the next 2 encounters. And this reflects our design as well. If we have two encounters, one with 5 sporecaps, one with 4 sporecaps and a gloom wisp, those are so similar we have effectively bypassed the rule.
> - Difficulty. Currently, common enemies are more threatening than bosses due to group sizes and the action economy. The logical choice is to view current encounter difficulty as our ceiling. No new encounter or enemy you design today should be strictly more difficult than one that already exists, only equivalent or weaker.
> - Route identity. We must move closer to each act1-2 route having its own enemy lineup. A number of enemies were designed and left on the cutting room floor at the last minute to meet the deadline, I'd like them formally returned.
> - Encounter memorability. Having more encounters is not inherently better, it means planning is less effective, and that similar-looking enemy lineups blend together in the player's mind.
> - The math. The final game should aim for 51 total encounters. Assume that 36 of those are combat. That's about 70%. We'll keep act1-1 and act1-2's current length, how many encounters and enemies do we need to satisfy the encounter repetition rule? Act1-2 splits satisfy the "the player should not encounter the majority of enemies in just 3 runs" mostly by itself.
> - And finally, enemy flexibility, a new must rule. Enemy mechanics MUST bend to the art. If an enemy is designed and stable diffusion struggles to generate them, or Noodle decides a piece of enemy art is to be used, it is the crunch, not the fluff, that must be flexible. Enemies will be reflavored and retooled as needed to match their art, not the other way around.

> You don't have access to enemy art in this session, I'm sorry for that, especially given the final design guideline above. However you should have what you need to design the new common enemy and common encounter pools. We'll have a full session on redesigning to match art once we are back on desktop, and rebalancing after the balance tests are completed, but for now we need as much design work done at this stage as possible.

---

## 2. What shipped, measured

Sixty-one ordinary encounters (25 in act 1-1, 12 a route) over 27 fielded commons, plus the benched
Scrap Salvager.

| Rule | What the table does today |
|---|---|
| One or two types a fight | 23 of 61 fights field three or four types. |
| Spread of sizes | 51 of 61 fights are three bodies; six are two, four are four; no solo, nothing above four. |
| No near-duplicates | Fifteen groups of fights share an exact enemy-type set. The Pollen Road fields Argent Fencer + Soakcap + Longwing **four times** under four names; the Frontier fields Shieldcap + Cagecap three times. |
| Repetition rule | No rule exists. Every node's fight is rolled when the map is generated (`honeycomb.map.fillNodeContents`), so the same fight can and does land on consecutive nodes of a path. |
| Difficulty (Basic Bite, 2 seeds, 4 parties, fresh-save decks) | Act 1-1 commons cost 2–25% of party health against an 8% target and never lose. Route commons cost 15–69% against 15% and win 50–100%: the Bell Choir (69%) and the Briar Line (62%) cost more than the Juggernaut (62%) or the Sisters (67%). His sentence, measured. |
| Route identity | Every ordinary fight is native (session 55c); every elite node still borrows. The Road has no small body. Both Fencers stand in twelve ordinary fights that B36 says should have been one elite. |
| Tags | 15 Charm and 8 Restraint moves still to retag (E14). |
| Art (read from `honeycomb-sprite-metrics.js`, which is generated from the image folder) | Twenty commons have their own drawing. Eight act 1-1 bodies stand on generated stand-ins of their older art (Sporeling, Cap Brute, Gloom Wisp, Hollow Knight, Earthstar, Bracket Elder, Spore Alchemist, Bark Sentinel; `../art_pipeline/ART-PIPELINE.md` B38's redo list). The Mold Leech is a recoloured Wisp. |

The full baseline table is in `../tools/balance/basic-bite.js`'s output; the per-band ceilings it sets are in §7.

---

## 3. The math

**His 51.** Act 1-1 is 18 rows, each act 1-2 route 11: 18 + 11 + 11 + 11 = 51 rows for a full run of the
finished game, and 36 of 51 is his 70%. Today an act-1 run (act 1-1 plus one route) visits **29 nodes and
fights 15.7 times** (12.3 common, 1.4 elite, 2 boss; measured over 400 generated runs, random path). That
is 54% combat; his 70% would be about 20 fights of 29, which is a map-density number (`tuning.map.nodeWeightArray`),
not an encounter-count number. Both densities give the same answer below, because the answer is set by the
longest run of fights inside one band, and the widest band is already five rows.

**The rule.** *A won encounter is blocked for the next two.* At any roll at most two fights are blocked,
and only ones from the same band count (a fight blocked from the previous band is not in this band's pool).

| Pool per band | Rolls with no unblocked fight | Rolls with exactly one | Reading |
|---|---|---|---|
| 2 | 11.5% | 29.7% | breaks the rule |
| 3 | 0% | 13.3% | never stuck; one fight in eight is forced |
| **4** | 0% | 0.3% | always a real roll |
| 5+ | 0% | 0.3% | no gain over four |

(400 runs, walked with the game's own maps; the widest band, act 1-1's opening, can hold five fights in a
row and four per band still leaves two choices on the fifth.)

**The answer.** Act 1-1 keeps its four bands (opening, early, middle, late; rows 1–5, 6–9, 10–13, 14–15)
at **four fights each: 16**. A route keeps **two bands** (early rows 1–5, late rows 6–8; the map's
middle rows step down to late, which `rollEncounter` already does) at four each: **8 a route, 24 for
three**. **Forty common encounters** against sixty-one today, and every one distinct. Enemies: eleven in
act 1-1, five or six a route, **27 commons** against 27 fielded today, with four returned or new and four
retired to the bench. Elites, when S64-2 gets to them: a pool of **three a region** for a real roll (two never
strands a node). Bosses satisfy the rule by structure inside a run; whether he means it *across* runs is a
question below.

**Coverage.** With the draft applied, three random-route runs meet 81% of the 27 commons on average and
reach 90% only 6% of the time. Act 1-1's eleven are all seen (44–97% a run each); the routes carry the
variety law, as he said.

---

## 4. The rules as checks

The audit tool fails a draft on any of these; the tables in §6 and §7 pass all of them.

1. **One or two enemy types** in every ordinary fight.
2. **No two fights in a region share a type set.** Anything that differs from another fight by one body of
   a type it already fields is printed with a `~` so it can be looked at side by side in the frame.
3. **Four fights a band**, so the block rule always leaves a real roll.
4. **Sizes 1 to 5 across every band**, and a solo and a five-body fight in every route.
5. **Formation is the order of `enemyIndexArray`**: index 0 stands in front. The bulky body is written
   first, the body to be reached second. This is real in the engine (`frontEnemy` cards, and an enemy's
   Taunt redirects the party's picked targets) and it is the whole of "instant conveyance" the tables can do;
   the sprites do the rest.
6. **Lust at or under 60% of a line-up's threat**, and every Lust move tagged Venom, Exposure or Heat.
7. **Nothing above the shipped ceiling**: each new fight is measured by Basic Bite against the costliest
   fight that shipped in its band (§7).

---

## 5. The roster

**Roles.** Two rows join `tuning.balance.enemyRoleArray`, both shares of the region's early normal group:
`swarm` at 0.20 / 0.20 (five make a fight) and `lone` at 1.00 / 0.67 (one is a fight; the solo damage
factor over the group one). Nothing else in the template moves.

### Act 1-1, the Upper Catacombs — 11 enemies, mixed threats

| Enemy | Role | HP / dmg | Identity, and what the player is meant to do | Tag | Art |
|---|---|---|---|---|---|
| Sporeling | minion | 22 / 5.6 | Bursts into Poison when it dies, so killing one is never free. The mascot; in five fights. | Venom | own drawing |
| Cap Brute | soldier | 40 / 9.5 | A four-move loop, two Strength richer each lap. Met **alone** first, so the loop is learned on its own. | Heat (Pin) | own drawing |
| Gloom Wisp | caster | 24 / 7.6 | Dead cards into the draw pile, and a Lust the body cannot block. | Exposure (Beguile) | own drawing |
| Hollow Knight | soldier | 36 / 9.0 | Strips Temporary HP and pierces the back rank. The anti-wall. | Exposure | own drawing |
| Earthstar | support | 26 / 4.3 | Seeds fresh Sporelings; stands behind. Kill her first or fight a patch. | Venom | own drawing |
| Bracket Elder | caster | 30 / 7.3 | Frail on the party, Artifact on herself, a curse in the deck. The Grind test. | Venom | own drawing |
| Spore Alchemist | support | 28 / 4.9 | Strength to the whole line; the tone reference, unchanged. | Heat (Sweet Vapour) | own drawing |
| Bark Sentinel | tank | 44 / 4.5 | Thorns; guards the line. Stands in front of things that should be killed through it. | Heat (Shield Bash) | own drawing |
| Puffcap | minion | 14 / 10.0 | A three-turn fuse. Two behind a wall, or five at once. | Venom | own drawing |
| Sporeguard | soldier | 32 / 8.8 | Seeded: a Sporeling bursts out when it falls. Two of them are a one-type fight. | Venom | own drawing |
| Glowcap | caster | 22 / 6.8 | Lust and nothing else; stands behind the Brute, the one act 1-1 pair that keeps her under the Lust cap. | Exposure | own drawing |
| **Glutton** (was Mold Leech) | **lone** | 70 / 12.5 | **The act's single guy.** Every bite feeds it; a charged Gulp feeds it more; Strength climbs. Race it or out-block it. | Venom (Siphon) | **the Witch's Butter drawing** (`artFolder: "moldshaper"`): a slime mould with no fixed outline is the maw the kit asks for |

**Corrected 2026-09-26.** The first draft benched the Glowcap and Witch's Butter as undrawn; the sprite
metrics say both have their own drawings from the 2026-09-21 pass. So the Glowcap keeps one fight (The
Lamp and the Brute) and the Witch's Butter drawing becomes the Glutton's, which takes one new drawing off
act 1-1's bill. The Witch's Butter *entry* stays in the table with no fight, its kit a spare (§8). Twelve
commons in act 1-1, then, and seventeen fights.

### Act1-A, the Mushroom Frontier — 5 enemies, health damage

| Enemy | Role | HP / dmg | Identity | Tag | Art |
|---|---|---|---|---|---|
| Shieldcap | **swarm** (was minion 36) | 25 / 5.5 | Plated, and it comes in fives: a sweep is the wrong answer, one big hit the right one. Always in front. | none | own drawing |
| **Doorward** (new) | soldier | 67 / 10.3 | **Shield Wall**: a three-step loop, walked in order — Taunt + Temporary HP, Mace, Rim Sweep. One turn in three the party's single-target hits go into it; a sweep still reaches past. Stands in front of whatever the fight wants protected. | none | owed; see §8 |
| Cagecap | striker | 44 / 10.4 | Folds in behind Temporary HP and comes up with Strength; the Frontier's hard hitter. Stands behind. | Heat (Cage) | own drawing (`butterflyknight-d`) |
| Foxfire | caster | 52 / 9.8 | The hot lamp: Thorns, and the Lure. Stands behind. | Exposure | own drawing |
| Bolete Hook | **lone** (was tank 84) | 120 / 13.3 | **The Frontier's single guy.** Drags the back rank to the front, and a charged Heave. Slow and wide. | none | own drawing (the tentacled mushroom he kept) |

The Scrap Salvager stays benched and stays an elite (I2); S64-2 owns him.

### Act1-B, the Thorn Arbor — 5 enemies, Venom

| Enemy | Role | HP / dmg | Identity | Tag | Art |
|---|---|---|---|---|---|
| Briar Brat | **swarm** (was minion 38) | 25 / 5.1 | Five thorn loops tripping the front rank; each one is a nuisance, five are a briar. | Venom | own drawing (`rosebrat-a`) |
| Thorn Fencer | striker | 45 / 10.8 | Reach to the back rank, Thorns when set. Stands in front of the bloom. | Venom | own drawing (`beenoble-b`) |
| Wellspring | support | 50 / 5.3 | Envenomed on the whole arbor; the engine. Stands behind. | Venom | own drawing (`sunflower-b`) |
| Trumpet Bell | caster | 54 / 10.8 | Faceless; everything it does goes over everyone; a charged Peal. | Venom | own drawing (`bigbell-b`) |
| Windfall Alraune | **lone** (was tank 84) | 120 / 12.8 | **The Arbor's single guy.** Heals the front and poisons it, Thick Rind, a charged Overripe. | Venom | own drawing (`jellyfairy-a`) |

### Act1-C, the Pollen Road — 6 enemies, Exposure

| Enemy | Role | HP / dmg | Identity | Tag | Art |
|---|---|---|---|---|---|
| **Dustmote** (new) | swarm | 25 / 4.4 | **The small body the Road never had.** A cloud of little moths; nothing they do is aimed; every one sheds a pinch of dust. | Exposure | owed; see §8 |
| **Courtier** (returned, `beenoble-a`) | striker | 46 / 10.5 | **The Flourish**: a duelist who fights for an audience; a charged Salute for the whole party. The lighter cousin of the Fencers. | Exposure | assigned, undrawn |
| Longwing | caster | 54 / 8.7 | Sways, scatters Sensitive, stoops. Stands behind the matron. | Exposure | own drawing |
| Soakcap | support | 50 / 4.5 | Regeneration and Strength for everyone in the bath. Stands behind. | Exposure | own drawing |
| Mantlewing | tank | 85 / 6.2 | The matron; Temporary HP under the wings, Frail and Weak in the shade. Stands in front. | Exposure | own drawing |
| **The Dandy** (returned, `tophatfairy-c`) | **lone** | 128 / 16.3 | **The Road's single guy.** Cane Tap, Doff, Lean Back, and a charged Grand Reveal the party sees coming. | Exposure | assigned, undrawn |

Out of the common pool: **the Sable and Argent Fencers**, which B36 says were meant to be one two-enemy
elite fight and were in twelve ordinary ones. Their entries and cards stay; S64-2 builds the pair.

---

## 6. The encounters

Front first. **B** is what tests Burst, **G** what tests Grind (`../designBibles/mechanics.md` §3). Static
marks are `enemy-template.js`'s arithmetic against the band's budget (✓ within 25%); Bite is the share of
party health lost, four parties × two seeds, fresh-save decks, and the win rate where it is under 100%.

### Act 1-1

| Band | Fight | Formation, front first | Size | The read | B / G | Static | Bite |
|---|---|---|---|---|---|---|---|
| opening | Loose Spores | Sporeling, Sporeling | 2 | the first fight; the first Lust | B kill cost / G poison | ✓ ✓ | 4.7% |
| opening | **The Brute** | Cap Brute | 1 | learn the loop alone | G scaling | ✓ ✓ | 2.4% |
| opening | Wisp and Spore | Sporeling, Gloom Wisp | 2 | the caster hides behind the spore | both: dead draws | ✓ ✓ | 6.3% |
| opening | The Nursery | Earthstar, Gloom Wisp | 2 | kill the seeder first | B kill order | ✓ ✓ | 2.2% |
| early | The Bark Wall | Bark Sentinel, Gloom Wisp | 2 | a wall with a curser behind it | B thorns / G curses | ✓ ▼ | 3.8% |
| early | Hollow Patrol | Hollow Knight, Bracket Elder | 2 | two anti-defence bodies | G walls and Frail | ✓ ✓ | 11.6% |
| early | Puffcap Patch | Puffcap, Puffcap, Earthstar | 3 | two fuses and the one mulching them | B a clock / G bodies | ✓ ▲ | 5.3% |
| early | **Guard Post** | Sporeguard, Sporeling | 2 | the soldier falls and a third body climbs out | B two fights in one | ✓ ✓ | 3.5% |
| early | **The Lamp and the Brute** | Cap Brute, Glowcap | 2 | the Lust caster behind the bruiser: the act's Lust lesson | Lust / G the loop | ✓ ✓ | 0.7% health, 5.4 Lust a turn |
| middle | Guard Detail | Sporeguard, Sporeguard | 2 | one type; four bodies by the end | B | ✓ ✓ | 6.1% |
| middle | Brute and Spores | Cap Brute, Sporeling, Sporeling | 3 | the loop with company | G / B | ✓ ✓ | 13.8% |
| middle | Elder and Wisps | Gloom Wisp, Bracket Elder, Gloom Wisp | 3 | the deck under attack from three | G | ✓ ✓ | 12.4% |
| middle | **The Glutton** | Glutton | 1 | the act's single guy | B race / G Strength | ✓ ✓ | 10.2% |
| late | **Puffcap Field** | Puffcap ×5 | 5 | the act's five-body fight: five fuses, three turns | B five clocks | ✓ ▲ | 18.9% |
| late | The Hollow Guard | Hollow Knight, Sporeling, Hollow Knight | 3 | the shipped ceiling of the band, kept as it was | G | ✓ ✓ | 25.1% |
| late | The Alchemist's Bench | Sporeguard, Sporeguard, Spore Alchemist | 3 | she strengthens two Seeded soldiers: five bodies by the end | G scaling / B | ✓ ✓ | 16.0% |
| late | Bulwark Line | Bark Sentinel, Puffcap, Puffcap | 3 | two fuses behind a thorn wall | B through the wall / G clock | ✓ ✓ | 7.0% |
| late, candidates | Spore Swarm; The Seed Bed | Sporeling ×4; Sporeling ×3, Earthstar | 4 | B31, bulk sporelings, held until E14's Poison halving; and the ×2 / ×4 question (§10) | B AoE / G poison | ✓ ✓ | 32.8% / 43.7% today; 21.6% / 25.4% halved |

### Act1-A, the Mushroom Frontier

Five bodies make eight distinct fights only as one swarm, one solo and six pairs and trios of three
mid-weights, so the late band is a solo and three pairs. A sixth Frontier body would let it hold a trio;
the Salvager is an elite and his intruder pair is Act 2 (E7-DEFERRED), so the slot is genuinely empty.

| Band | Fight | Formation | Size | The read | B / G | Static | Bite |
|---|---|---|---|---|---|---|---|
| early | **The Picket** | Shieldcap ×5 | 5 | five plated pavises: single big hits | B blunted sweeps | ✓ ✓ | 35.4% |
| early | Lamps in the Dark | Shieldcap, Shieldcap, Foxfire | 3 | a lamp behind two pavises | B thorns / Lust | ✓ ✓ | 7.3% |
| early | **The Long Patrol** | Doorward, Foxfire | 2 | the wall and the lamp | B / Lust | ✓ ✓ | 13.1% |
| early | **Lamp and Cage** | Foxfire, Cagecap | 2 | a cage behind a lamp | B thorns / Lust | ✓ ▼ | 21.3% |
| late | **The Hook** | Bolete Hook | 1 | the Frontier's single guy; it keeps pulling the back rank forward | formation / G poison | ✓ ▼ | 17.4% |
| late | **The Gate** | Doorward, Doorward | 2 | two walls, taunting out of step | B | ✓ ▼ | 37.7% |
| late | The Cage Line | Cagecap, Cagecap | 2 | two hitters, no wall | B race | ✓ ▼ | 33.4%, 88% |
| late | **The Doorward** | Doorward, Cagecap | 2 | the wall in front, the hitter behind; the wall taunts one turn in three | B rhythm / G Strength | ✓ ✓ | 42.4%, 75% |

### Act1-B, the Thorn Arbor

| Band | Fight | Formation | Size | The read | B / G | Static | Bite |
|---|---|---|---|---|---|---|---|
| early | **The Briar Patch** | Briar Brat ×5 | 5 | five trip lines | B AoE / formation | ✓ ✓ | 32.9%, 88% |
| early | The Hedgerow | Thorn Fencer, Wellspring | 2 | the sword in front of the bloom that feeds it | B kill order / G Envenomed | ✓ ▼ | 8.5% |
| early | The Bell Walk | Briar Brat, Briar Brat, Trumpet Bell | 3 | a faceless bell behind two brats | G / B | ✓ ✓ | 17.1% |
| early | The Duelling Ground | Thorn Fencer, Trumpet Bell | 2 | a duelist and a bell | B thorns / G peal | ✓ ✓ | 20.5% |
| late | **The Windfall** | Windfall Alraune | 1 | the Arbor's single guy | G poison and heal | ✓ ▼ | 23.3% |
| late | The Fencing Line | Thorn Fencer ×3 | 3 | three swords, three Thorns | B | ✓ ✓ | 48.6%, 88% |
| late | The Bell Choir | Trumpet Bell, Trumpet Bell | 2 | two bells, every move on everyone | G | ✓ ▼ | 47.9%, 88%; 32.5% halved |
| late | The Nightshade Patch | Trumpet Bell, Wellspring | 2 | one bell, fed | G Envenomed | ✓ ▼ | 29.0% |

### Act1-C, the Pollen Road

| Band | Fight | Formation | Size | The read | B / G | Static | Bite |
|---|---|---|---|---|---|---|---|
| early | **The Drifts** | Dustmote ×5 | 5 | a cloud | B AoE / Lust | ✓ ✓ | 5.0% |
| early | Under the Wings | Mantlewing, Longwing | 2 | the matron in front, the swaying one behind | G Sensitive / Lust | ✓ ▼ | 7.7%, 88% |
| early | The Steeping Pool | Courtier, Soakcap | 2 | a duelist guarding the bath | G Regeneration | ✓ ▼ | 3.2% |
| early | The Bower | Courtier, Longwing | 2 | a duelist and a sway | Lust | ✓ ▼ | 5.3% |
| late | **The Dandy** | The Dandy | 1 | the Road's single guy | G the Reveal | ✓ ✓ | 13.8% |
| late | The Salon | Courtier, Courtier, Dustmote | 3 | two duelists and a mote | B | ✓ ✓ | 21.8% |
| late | The High Drift | Mantlewing, Dustmote ×3 | 4 | the matron and her brood | G / B | ✓ ▼ | 9.2%, 88% |
| late | Nobody Getting Up | Longwing, Longwing, Soakcap | 3 | three loungers, all Lust | Lust grind | ✓ ✓ | 10.3%, 88% |

The Road reads light on health lost by design: it is the Lust route, and the bot's net-health number does
not count Lust taken. Its Lust per turn (4–12) matches the shipped Road (7–11); the column to watch on the
desktop is Broken members, which the audit prints.

---

## 7. Measured against the ceiling

The ceiling is the costliest fight that shipped in each band (Basic Bite, same bot, same decks).

| Band | Shipped ceiling | Draft, highest | Over? |
|---|---|---|---|
| act 1-1 opening | 4.7% (Loose Spores) | 6.3% (Wisp and Spore, the spore now in front) | at the 6% target; his call |
| act 1-1 early | 13.4% (The Seed Bed, old) | 11.6% (Hollow Patrol) | no |
| act 1-1 middle | 24.1% (The Damp Patch) | 13.8% (Brute and Spores) | no |
| act 1-1 late | 25.1% (The Hollow Guard) | 25.1% (The Hollow Guard, unchanged); Puffcap Field 18.9% | no; the Sporeling swarms, below |
| Frontier early | 47.6% (The Outpost) | 35.4% (The Picket) | no |
| Frontier late | 56.6% (The Cage Line, old) | 42.4% (The Doorward) | no |
| Arbor early | 39.2% (The Bell Walk, old) | 32.9% (The Briar Patch) | no |
| Arbor late | 68.7% (The Bell Choir, old) | 48.6% (The Fencing Line) | no |
| Road early | 36.0% (The Standing Picket) | 7.7% (Under the Wings) | no |
| Road late | 39.0% (The Sprawl) | 21.8% (The Salon) | no |

**Five drafts were measured over the ceiling or the Lust cap and changed the same session**; the cut ones
stay in the file as `candidate` rows (`weight: 0`) so the desktop can re-measure them:

| Drafted | Measured | Ceiling | Became |
|---|---|---|---|
| The Cage Line, Cagecap ×3 | 56.5%, 63% win | 56.6% | Cagecap ×2: 33.4% |
| The Outpost, Shieldcap ×2 + Cagecap ×2 | 58.5%, 63% win | 56.6% | cut; The Doorward moved to late in its place |
| Lamp and Cage, Foxfire ×2 + Cagecap | 19.9%, but 15 Lust a turn on 11 damage | Lust cap 0.6 | one lamp, one cage: 21.3% |
| The Bell Choir, Trumpet Bell ×3 | 80.7%, 50% win | 68.7% | two bells: 47.9% (32.5% halved) |
| The Salon, Courtier ×3 | 44.8%, 75% win | 39.0% | two and a Dustmote: 21.8% |
| The Doorward, at early | 42.4%, 75% win | 47.6% early | under, but the band's heaviest by far; moved to late |

**Poison halving.** Bulk-poison bodies (Sporeling, Puffcap, Briar Brat, Trumpet Bell) hinge on E14's
signed-off Poison (*"Poison MUST change to halve when it triggers"*). Today four Sporeling bursts stack to
8 Poison on everyone and tick 36 damage each; halved they tick 15. The audit's `--halve` flips the field
`decayMode` on the Poison status for the measurement only:

| Fight | Today's Poison | Halved |
|---|---|---|
| Spore Swarm, Sporeling ×4 (candidate) | 32.8% | 21.6% |
| The Seed Bed, Sporeling ×3 + Earthstar (candidate) | 43.7%, 88% win | 25.4% |
| Puffcap Field | 18.9% | 18.9% |
| The Briar Patch | 32.9%, 88% win | 20.7% |
| The Bell Choir (two) | 47.9%, 88% win | 32.5% |
| The Fencing Line | 48.6%, 88% win | 41.7% |
| The Picket | 35.4% | 36.1% |

So the two bulk-Sporeling fights are the band's ceiling under today's Poison and inside it once E14 lands;
they are held as candidates until then. Everything else in the pool stands under either Poison.

---

## 8. Enemy flexibility: the crunch bends to the art

Every new or retooled body is written as a **silhouette role** and a kit, never as a species. If the
drawing that turns up is something else, the kit stays and the words move.

| Kit | Needs from the drawing | Anything else is free |
|---|---|---|
| **Glutton** (act 1-1 lone) | one big round body, wide and low, something that reads as a mouth or a maw; stands at 1.3 | **taken by the Witch's Butter drawing** unless he would rather it stayed a support; then any blob |
| **Doorward** (Frontier soldier) | one broad upright figure behind a shield as tall as itself; visibly heavier than the Shieldcap and unlike the Bark Sentinel's rooted bark | the helm, the weapon, whether it is a myconid at all |
| **Dustmote** (Road swarm) | small, round, fuzzy, wings; five on stage at 0.55 without covering a health bar | colour, whether it is a moth, a pollen-puff or a fairy |
| **Courtier** (Road striker) | a slight figure with a thin blade, lighter than the Fencers' plate | `beenoble-a` as assigned, or any duelist drawing |
| **The Dandy** (Road lone) | one lounging figure with presence, taller than the Courtier, not tidy, nothing gold | `tophatfairy-c` as assigned, or any noble drawing |
| **Shieldcap** as swarm | low and small; five in a row | unchanged |
| **Briar Brat** as swarm | small; five hovering | unchanged (0.62) |
| **Bolete Hook** as lone | wide; it already is (B37 owns its scale) | unchanged |
| **Windfall Alraune** as lone | big; she already is | unchanged |

One spare kit sits on the bench for a drawing that fits nothing above: **Witch's Butter** (a
Regeneration-and-cleanse support), whose own drawing the Glutton now wears. The Mold Leech's kit is gone
into the Glutton; the Glowcap kept its fight.

---

## 9. What the engine needs from this

Each is a table entry or one verb (`../BASICS.md`, "adding content is a table entry only").

1. **Two roles**: `swarm` and `lone` in `tuning.balance.enemyRoleArray`, in the positions the draft
   inserts them (`enemyDifficultyRank` reads position). The compendium's `enemyGroupHeadingArray` needs
   a heading for each or they land in "Other" (I10).
2. **The block rule.** A run keeps `recentEncounterArray` (the last two won). When a combat or elite node
   is entered and its generated fight is on that list, it re-rolls from the same pool without those two,
   from the encounter stream, and writes the result back to the node. The map already shows a tier, never a
   fight, so nothing promised changes; determinism holds because the stream saves as `(seed, calls)`.
   Generation-time exclusion along every ancestor path is the alternative; it needs larger pools for no
   gain the player can see. A suite block: walk 200 generated runs and assert no fight index repeats
   inside any two-fight window, and that the pool floor per band is four.
3. **Retired fight indices.** Twenty-one live indices leave the table. A save whose map names one must
   re-roll that node on load rather than throw in `combat.begin`.
4. **Heat**: the tag (four moves carry it in the draft; the tag entry is `cardTagArray`) and the status
   (E14; `../card_pool/CARD-POOL-02.md` §2.1). Until the status exists the Heat moves deal their direct Lust.
5. **Poison halving** (E14) before the Seed Bed and the Puffcap Field are judged.
6. **Taunt on a sequence loop.** Nothing new: `applyStatus taunt` on self, `moveStrategy: "sequence"`,
   and the party's picked targets already honour a taunter (`honeycomb.tauntFilteredArray`). The desktop
   should watch one Doorward turn in the frame to see the redirect land.
7. **Five bodies on the stage.** The gauntlet's finale already fields five; `audit-sprite-fit.js` at his
   window with the Picket, the Briar Patch and the Drifts is the check.

---

## 10. Left for him

- **Names.** Every one: Glutton, Doorward, Dustmote, Courtier, The Dandy, and the seventeen fight names.
- **The bench.** Both Fencers out of the commons for the elite pair; the Witch's Butter drawing on the Glutton, its support kit spare.
- **`tophatfairy-c` as a common lone** rather than an elite (I12 called it the route's first elite). As a
  128-health single fight it is elite-sized and common-priced; if he wants it as the elite, the Road's late
  band wants another single body.
- **`beenoble-a` as the Courtier.** It was "a third duelist"; the draft makes it the Road's only common one.
- **Heat on grapples** (Pin, Shield Bash, Cage) against dropping their Lust for damage on the health-damage route.
- **Wisp and Spore at 6.3%** with the Sporeling in front, against 1.7% the other way round.
- **Bulk Sporelings.** The Puffcap Field is the act's five-body fight today; Spore Swarm (×4) and the Seed Bed are held until the halving, and the ×4 shares its type set with Loose Spores at the opening, which his own rule reads as one fight twice. Whether the mascot earns that exception is his.
- **A sixth Frontier body**, so the route's late band can hold a trio instead of three pairs.
- **Bosses and the block rule across runs.** Inside a run the rule holds by structure; across runs it needs
  profile state, and the act 1-1 boss row is his choice anyway.
- **The Road's health numbers.** Light by design (Lust route); if he wants it to hurt, the Courtier is the
  body to raise.

---

## 11. Uniqueness, and what the art pipeline needs

**Every common stands in exactly one region's ordinary pool.** The audit prints the map; no body is
shared. The only cross-region enemies left are the elites S64-2 owns: the Kobold Scavenger on every
route's skull nodes and the Hollow Champion on two.

| Region | Commons in the pool | Own drawing | Older stand-in (B38 redo, his call) | New sprite pairs to make |
|---|---|---|---|---|
| Act 1-1 | 12 | Puffcap, Sporeguard, Glowcap, Glutton (the Witch's Butter drawing) | Sporeling, Cap Brute, Gloom Wisp, Hollow Knight, Earthstar, Bracket Elder, Spore Alchemist, Bark Sentinel | **0** |
| Act1-A Frontier | 5 | Shieldcap, Cagecap, Foxfire, Bolete Hook | — | **1**: Doorward (new design) |
| Act1-B Arbor | 5 | all five | — | **0** |
| Act1-C Road | 6 | Mantlewing, Longwing, Soakcap | — | **3**: Dustmote (new design); Courtier from `beenoble-a` and The Dandy from `tophatfairy-c` (assigned sources, run through the pipeline) |

Four sprite pairs (`1-combat` and `1-offense` each) ship the whole common pool; two of them are new
designs. The Glutton and the Doorward are the only kits with no picture behind them at all, and the
Glutton has a candidate.

**Nothing he named is cut.** Of the five previewed designs (E13): `tophatfairy-c` is The Dandy and
`beenoble-a` the Courtier, both in this pool; `feralbeast-b`, `spookytall-a`, `demikobold-c` and
`bellhead-a` are the elite jobs E11 and E7-DEFERRED already hold for S64-2, untouched. Of the drawn
bodies, the draft leaves only the two Fencers without an ordinary fight, and they are waiting for the
pair elite he asked for (B36). The Scrap Salvager was benched before this session and stays an elite.
