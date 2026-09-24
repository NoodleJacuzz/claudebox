# Round two: your answers, built

You went through every open item and decided them. This is what landed. **Suite 2575 passed, 0 failed**,
up from 2543, with 31 new checks in block [130]. Nothing in any images folder was touched.

Your standing instruction for this round, recorded in `../BASICS.md` beside the demo scope:

> A run ending in the first 1/3rd of act 1 should be astronomically unlucky, or the result of purposeful
> self-sabotage.

> I'd rather have the data point of "you went too far in the other direction" than "the spot you knew
> felt bad does, in fact, feel bad"

---

## 1. Taunt already did what you described. Nothing was changed.

You clarified: *"if, say, Brienne got a stack of taunt, and an enemy hits everyone for 3 damage, Brienne
would take 9 damage instead."*

That is what it already does. Measured, three allies at 100 health each, one enemy sweeping for 3:

| | Brienne | Nettle | Severine |
|---|---|---|---|
| Nobody taunting | 97 | 97 | 97 |
| Brienne taunting | **91** | 100 | 100 |

I had proposed rebuilding it as a pool of points, and I was wrong to propose that without testing it
first. The suite now holds this behaviour so it cannot quietly drift.

**Suffer the Blows is built, with one change you should know about.** Taunt's stacks are TURNS, not
points, so "gain taunt equal to your tHP" could not be written as you had it — 30 Temporary HP would buy
thirty turns of taunt. The card gives one turn of Taunt and the Temporary HP carries the number:

> **Suffer the Blows** — rare, 0 energy. Gain 10 Temporary HP for each enemy. Gain 1 Taunt.
> Upgraded: 14 per enemy.

Against three enemies that is 30 Temporary HP, one turn of every hit landing on her. If you want the
literal "taunt equal to your tHP", Taunt has to become a pool and that is a bigger job — say so and I
will do it.

**One consequence to flag.** Making it rare moved a common out of Brienne's Bastion pool, so her card
shape is 12/5/**8/4**/3 where every other character is 12/5/9/3/3. The suite records that as deliberate
rather than drift. The clean fix is to demote one of her other Bastion rares to common — **which one is
yours to pick.**

---

## 2. Brienne's first C.Ex node

**What it used to do:** "Hold Fast — While in the party, turn 1: gain 5 Temporary HP." The smallest
thing on her tree.

**What it does now:** *Unshakeable* — Brienne's Lust is measured against her MAXIMUM health rather than
the health she has left.

A fighter Breaks when Lust reaches what stands against them, which is health plus Temporary HP. So being
worn down normally makes you easier to Break by Lust, and this stops that:

| | Breaks at | With Unshakeable |
|---|---|---|
| At full health, 60 | 60 Lust | 60 Lust |
| Hurt down to 20 | 20 Lust | **60 Lust** |

Temporary HP above her maximum still stacks on top, as it always did. It is strong against Lust, which
you said was fine.

---

## 3. Clemence

**No card of hers is blank.** Seven have no hand-written text and the engine generates it from their
effects — "Heal ALL allies for 12 HP." and so on. The suite now holds that none prints an empty box. What
you may have seen was me reading the wrong field in a dump last night.

**What "nothing else" meant, and I had it backwards.** I said her Lust-spending cards let her keep the
broken form without paying for it. The opposite is true: recovery is health plus Temporary HP against
Lust, tested at her turn start, so **shedding Lust is what lifts her OUT of the form** and takes her
stronger cards with it. Measured: broken at 40 Lust against 35 standing, sheds 15 with Sanctum, no
longer broken at her next turn start. Those nine cards are a real choice already. I have corrected the
entry.

**So what was left was the healing, and it is cut** from about a 40% uplift to about 15%:

| Whole form | Broken form | Was | Now |
|---|---|---|---|
| Mending Word 7 | Fevered Word | 10 | **8** |
| Lay On Hands 4 / 6 | Benediction | 7 / 8 | **5 / 7** |
| Mercy 10 | Tender Mercy | 14 | **12** |
| Anoint 12 | Last Anointing | 16 | **14** |
| Fallen Vigil 5 (+5) | Keep Faith | 7 (+7) | **6 (+6)** |
| Answered Prayer 7 | Prayer Unbound | 10 | **8** |

---

## 4. Frail, your design

> **Frail.** Healing and Temporary HP gained are reduced by 25% per stack. Loses 1 stack at the end of
> the holder's turn.

Intensity stacking like Sundered, one stack off per turn, so a fifth stack buys another turn rather than
a negative number:

| Stacks | A heal or a gain of Temporary HP is worth |
|---|---|
| 1 | 75% |
| 2 | 50% |
| 3 | 25% |
| 4 | 0% |
| 5+ | 0%, and it lasts a turn longer |

This needed one engine addition: healing had no status hook at all, only a loadout multiplier. There is
a `modifyHealingReceived` hook now, folded into the single place every heal passes through.

---

## 5. The Head Gardener — measured, not guessed

**1.9 → 1.1.** I found I could derive it rather than guess, because a back-anchored boss is sized off the
battlefield's HEIGHT: the stylesheet gives its wrap a definite height, so the drawing is 84% of the stage
per unit of scale, growing up from the feet. Solving that against the two overflows the sprite audit
measured, at both window shapes it was run at:

| Window | Drawing per unit of scale | Feet at | She fits exactly at |
|---|---|---|---|
| 1878x804 | 575px | 639px | **1.112** |
| 1920x1080 | 768px | 854px | **1.111** |

The two agree because the stage and the feet scale together, so the answer does not depend on the
window. **1.1 puts the top of her head about 7px inside the top edge** — the puffcap on her head is
visible — and she still runs off the SIDE of the screen, which is the part you wanted kept. She is still
the tallest thing in Act 1 by a distance; the next boss is the Pale Dray at 1.3 on a much narrower
canvas.

---

## 6. Act 1, and the one thing I did not do

**Done:** act 1's ordinary fight now costs 8% of the party's health instead of 10%, combat node weight
went 45 → 52 with the seven points taken off events, and last night's opening tier already made the
first three rows one- and two-enemy fights. Act 2 is untouched.

**Not done, deliberately: I did not lengthen fights.** I tried it — turn target 3-4 → 4-5 — and then took
it back out, because a fight only gets longer if the enemies carry more health, and **more enemy turns at
today's damage is a harder act, not a gentler one.** Doing it properly means raising R1 health and
cutting R1 damage together, fifteen enemies moving at once, and that is the change that genuinely needs
All the Crunch either side of it rather than my judgement at 3am.

That is the opposite of the direction you asked me to err in, so I left it. Everything else in this
section pushes toward easier. Say the word and I will do the restat with the Crunch run behind it.

---

## 7. The two relics

| Gone | New | Rarity | Effect |
|---|---|---|---|
| Copycat Quill | **Dominion Rod** | rare | When found, gain 6 banishes for this run |
| Spur of Embers | **Lucky Hat** | uncommon | When found, gain 2 rerolls for this run |

Both are **ungated** — neither names a character. That matters more than it sounds: fifteen of the
twenty-five relics name one, so a solo or duo run sees very little of the pool. *(I told you twelve last
night. Twelve was how many were shut for one particular party; fifteen is how many are gated at all. Both
documents are corrected.)*

**The Lucky Hat also unlocks the Mulligan Stone.** The Stone refills the reroll pool and I gated it on
the pool existing, which in a default run it does not. This is the first thing in the game that grants a
reroll without a progression node behind it.

---

## 8. Mushroom Frontier wins

Recorded in `../BASICS.md`, in your words: *"Both have their charm, but Mushroom Frontier is better
suited for the direction we actually went for. We'll save 'X's Navel' for a future area."* Anything still
calling this region Myconid Navel is now marked stale.

---

## A bug your three-boss-nodes change exposed

Worth knowing, because it would have shipped. `mapBossEncounterIndex` returned the FIRST boss node on the
map, which was correct while there was only one. With three on the row it meant **the route was decided
by whichever boss node happened to sit leftmost, not the one you beat** — a run that beat The Shroud
could descend into the Pollen Road. The suite caught it. It reads the node you actually visited now, and
block [130] holds all three bosses against their routes.

---

## Your enemy question

`../enemy_overhaul/ROUTE-IDENTITY.md` has the full measurement. The short version:

| Route | Encounters made only of its own enemies | Its own enemies | Borrowed |
|---|---|---|---|
| Act1-A, Mushroom Frontier | **2 of 16** | 4 | **12** |
| Act1-B, Thorn Arbor | 6 of 14 | 5 | 2 |
| Act1-C, Pollen Road | 2 of 14 | 5 | 3 |

**Act1-A is the one players are seeing.** Twelve of Act1-1's fifteen enemies also stand on it, and
fourteen of its sixteen fights contain at least one of them. Same creatures, water background, and until
this session the wrong name.

**Every elite node on all three routes is borrowed** — all eight field the Kobold Scavenger or the Hollow
Champion. Your five designs fix exactly that: `feralbeast-b` and `spookytall-a` are B's and C's elites,
`demikobold-c` and `bellhead-a` are A's pair, `tophatfairy-c` is a Pollen Road normal. **Build the five
and no route borrows an elite any more**, which is the biggest single legibility win available, because
the elite is the fight people remember.

**They would not fix Act1-A's normals** — ten borrowed ones would remain. But most of that needs no art:
Act1-B is cleaner than Act1-A with only one more enemy, because its encounters were written out of its
own roster and Act1-A's were not. Rewriting Act1-A's sixteen encounters around its own four or five is
table edits only.

**And Act1-A owns an elite that is switched off.** The Scrap Salvager is `benched: true` with two written
encounters waiting, benched by you for being a recolour of the Kobold Scavenger. One drawing brings it
back and removes the Scavenger from two of Act1-A's four elite nodes.
