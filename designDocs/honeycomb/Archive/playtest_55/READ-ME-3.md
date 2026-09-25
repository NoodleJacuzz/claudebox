# Round three: the corrections, and the route rebuild

**Suite 2582 passed, 0 failed**, up from 2575. No images touched.

---

## The unique-enemy counts are fixed

Every ordinary fight on all three Act1-2 routes is now built from that route's own enemies. The elite
nodes still borrow, which is what you said matters less: *"I think we may not need as much elite variety
as normal enemy variety. Players are avoiding elite encounters."*

| Route | Fights using only its own enemies | | Borrowed enemies | |
|---|---|---|---|---|
| | **before** | **after** | **before** | **after** |
| Act1-A, Mushroom Frontier | 2 of 16 | **12 of 16** | 12 | **2** (both elite-only) |
| Act1-B, Thorn Arbor | 6 of 14 | **12 of 14** | 2 | **1** (elite-only) |
| Act1-C, Pollen Road | 2 of 14 | **12 of 14** | 3 | **1** (elite-only) |

**The Kobold Scavenger and the Hollow Champion now appear on those routes only in elite fights.** Every
other borrowed body is gone.

**Nothing was guessed.** I wrote a composer that enumerates line-ups from each route's own roster and
scores them against the same budget `../tools/enemy-template.js` grades encounters with. Every rebuilt
fight is inside `varianceFraction` — I checked after each pass and fixed the ones that fell out.

**Two things the rebuild exposed, both worth knowing:**

1. **The Pollen Road has no small enemy.** Its lightest body is the Argent Fencer at 45 health, where
   Act1-A has the Silt Crawler at 36 and Act1-B the Thorn Sprite at 38. Its fights are therefore all
   two or three mid-weight bodies. **If any of your five drawings can become a Pollen Road minion, that
   is the slot the route is actually missing** — more than another elite.
2. **The Mantlewing nearly fell out of the game.** It is the Pollen Road's only tank at 85 health against
   a group budget of 135, and no native line-up carrying it lands inside the budget. `pollenHighDrift`
   keeps it anyway, at 175 health against 135, and the audit marks it high on purpose — an enemy nobody
   can meet is worse than a fight that runs long.

**The Bog Toad's fight moved a tier.** `toadPond` went from early to middle: 84 health of toad cannot
fit an early group however it is padded.

**Still owed:** the Scrap Salvager is the only non-gauntlet enemy in no rollable fight. It is Act1-A's
own elite, benched by you as a recolour, with two written encounters waiting on one drawing.

---

## What I got wrong, and fixed

**The Ember Spur.** There are two things with that name: `spurOfEmbers`, a relic, and `emberSpur`,
Cinder's common heirloom. I replaced the relic. Your note said heirloom. **The Spur of Embers relic is
back**, and the **Lucky Hat is now Cinder's common heirloom**. It grants two extra reward rerolls each
run.

**And replacing it would have quietly gutted Cinder.** The Ember Spur is what stood her at the back of
every fight, and her whole kit is built on having somewhere to charge from — Flame Charge crosses places
for damage, Lance Thrust deliberately does not move her, Pincer counts who moved. Her own description
says *"the further she has to come, the harder she lands."* The suite caught it. **The Lucky Hat carries
the back-start as well as the rerolls**, which makes it strictly better than what it replaced.
**That back-start arguably belongs on Cinder herself rather than on anything she wears. Say the word and
I will move it onto her.**

---

## Unshakeable, rebuilt the way you described

It now caps the **Lust itself** at her maximum health, rather than raising what stands against it:

| | Lust after 200 thrown at her | Breaks? |
|---|---|---|
| Full health 60, no Temporary HP | 60 | yes |
| Full health 60, **+20 Temporary HP** | 60 | **no** |
| Hurt to 30, **+40 Temporary HP** | 60 | **no** |
| Hurt to 30, no Temporary HP | 60 | yes |
| Without the node, full health +20 | **200** | yes |

So anything carrying her above 100% health puts her out of reach of Breaking, for as long as she holds
it. That needed one engine addition: a `lustMaximum` hook, where the LOWEST answer wins so two sources
cannot raise each other's ceiling.

---

## The two small ones

**Suffer the Blows gives the Taunt first, then the Temporary HP.** Text now reads "Gain 1 Taunt. Gain 10
Temporary HP for each enemy."

**Breaking drops the Taunt.** A fighter who Breaks loses it immediately, so a wall that has just gone
down stops pulling the whole fight onto itself. The list is `tuning.lust.statusesLostOnBreakArray`, so
another status can be made to fall off the same way without touching the break routine.

**Brienne's card-pool exception stays**, since you said it is worth trying: *"I feel like there might be
too many commons overall, so Brienne being a trial exception would be good."* She is 12/5/**8/4**/3
where everyone else is 12/5/9/3/3.

---

## Your question: did I make the first fights easier, or nerf all of act 1?

**Both, and they were separate changes.**

| Change | Reaches | What it does |
|---|---|---|
| The `opening` encounter tier | **rows 0-2 only** | One- and two-enemy fights at 49 health against the early band's 63. Region 1 only; other regions step down to their own early pool. |
| Net damage 0.10 → **0.08** | **all of act 1** | Every ordinary act-1 fight costs 8% of the party's health instead of 10%. Act 2 untouched. |
| Combat weight 45 → **52** | all of act 1 | More fights per map, taken off event nodes. |

**If you only wanted the first rows easier, the middle row is the one to undo** — it is a single number
in `tuning.balance.netDamageFractionArray[0].normal` and putting it back to 0.10 restores act 1 exactly.
I did it because of your floor: a run ending in the first third should be astronomically unlucky, and
three gentle rows followed by the old curve did not seem like enough on its own.

---

## Uncommon: you are right, and it is still in fourteen places

**Fourteen of the twenty-five relics are called uncommon**, plus one piece of equipment. I did not
convert them, because uncommon is a real tier in two tables and collapsing it changes the economy:
`relicPriceArray` prices uncommon at 170 against common 120 and rare 240, and `equipmentRarityArray`
gives it its own colour and sort order.

| Ungated | Brienne | Nettle | Severine | Cinder | Clemence | Cassadora |
|---|---|---|---|---|---|---|
| Bone Pendant | Gilded Gauntlet, Oathbound Banner | Cracked Ampoule, Rat King's Bell, Honeyed Thorn | Trophy Cord, Leech Jar | Marching Drum | Prayer Beads, Reliquary of Tears, Halo of Thorns | Cracked Hourglass, Sleight Purse |

Plus **Thief's Gloves**, the one uncommon piece of equipment.

**What I would do, for one word from you:** make all fourteen **common**, drop `uncommon` from the price
table and the rarity list, and let you promote any you think are rare afterwards — that is one field
each. The pool would then be 20 common and 4 rare, which is thin at the top; if you would rather, name
the three or four that should be rare and I will split them that way instead.

The two new ones already follow your rule: the **Dominion Rod** is rare and the **Lucky Hat** is common.
