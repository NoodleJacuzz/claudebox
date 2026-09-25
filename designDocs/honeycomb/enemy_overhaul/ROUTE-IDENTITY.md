# How far the three Act1-2 routes are from having their own enemies

Written session 55, from Noodle: *"Apparently most players didn't realize there were alternate act1-2
routes. Mostly due to the backgrounds not changing and the limited enemy variety. It seems like all
three act1-2 routes would really want to have completely bespoke enemies. I know there's a huge amount
of cut enemies, how far are we from that goal A. right now, and B. if we were to implement all the ones
I was really attached to?"*

Measured off the content tables, not estimated.

**REBUILT SESSION 55b, AND THE NUMBERS BELOW ARE THE BEFORE.** Noodle: *"Those unique enemy counts is a
huge oof, let's fix it tonight [...] I think we may not need as much elite variety as normal enemy
variety. Players are avoiding elite encounters."* Every ORDINARY fight on all three routes was rebuilt
out of that route's own roster; the elite fights still borrow, on his instruction. Where they stand now:

| Route | Fights using only its own enemies, before | after | Borrowed enemies, before | after |
|---|---|---|---|---|
| Act1-A, Mushroom Frontier | 2 of 16 | **12 of 16** | 12 | **2**, both elite-only |
| Act1-B, Thorn Arbor | 6 of 14 | **12 of 14** | 2 | **1**, elite-only |
| Act1-C, Pollen Road | 2 of 14 | **12 of 14** | 3 | **1**, elite-only |

**Two findings from doing it**, both in `../Archive/playtest_55/READ-ME-3.md`: the Pollen Road has no small
enemy at all, which is the slot it actually wants filling; and the Mantlewing is its only tank and does
not fit any native group inside the budget, so `pollenHighDrift` carries it over-budget on purpose.

The rest of this page is the measurement that prompted the rebuild, kept as the before.

---


---

## A. Where the three routes stand today

"Its own" means an enemy no other region fields. "Borrowed" means it also stands in Act1-1.

| Route | Encounters | Of those, made only of its own enemies | Its own enemies | Borrowed |
|---|---|---|---|---|
| **Act1-A, Mushroom Frontier** | 16 | **2** | 4 | **12** |
| **Act1-B, Thorn Arbor** | 14 | 6 | 5 | 2 |
| **Act1-C, Pollen Road** | 14 | 2 | 5 | 3 |

**Act1-A is the problem, and it is much worse than the other two.** Twelve of Act1-1's fifteen enemies
also appear on it — the Sporeling, Gloom Wisp, Cap Brute, Hollow Knight, Puffcap, Mold Leech, Glow Moth,
Cordyceps Husk, Alchemist, Moldshaper, Kobold Scavenger and Hollow Champion. Fourteen of its sixteen
fights contain at least one of them. A player walking into it sees the same creatures they just spent
eighteen rows fighting, on a background painted for water, under a name that until this session still
said Flooded Vault. **That is the route most likely to read as "the map just got longer".**

**Act1-B is the closest to finished.** Only the Sporeling and the Kobold Scavenger leak in, and six of
its fourteen fights are already pure.

**Every elite node on every route is borrowed.** All eight of them field the Kobold Scavenger or the
Hollow Champion, both Act1-1 enemies:

| Route | Its elite fights |
|---|---|
| Act1-A | Scavenger + Silt Crawler, Champion + Mire Eel, Scavenger + Lantern Jelly, Champion + Silt Crawler |
| Act1-B | Scavenger + Trumpet Bell, Scavenger + Fruit Alraune |
| Act1-C | Scavenger + Longwing, Scavenger + Argent Fencer |

**Act1-A does own an elite, and it is switched off.** The Drowned Salvager (now the Scrap Salvager) is
`benched: true`, which is the flag for finished content deliberately held out of a build. It is benched
because it is a recolour of the Kobold Scavenger, which is Noodle's own call from the desk: *"I don't
want lazy-looking recolors, so I had him bench the scrap salvager."* Its two encounters, `salvagerCrew`
and `salvagerDeep`, are written and waiting.

---

## B. What the five designs he was attached to would fix

The five are `bellhead-a`, `demikobold-c`, `feralbeast-b`, `spookytall-a` and `tophatfairy-c`. Where
each one is assigned is `FEEDBACK.md` E13; none was cut, all five are on disk.

| Design | Assigned to be | What it closes |
|---|---|---|
| `feralbeast-b` | the Thorn Arbor's elite | Act1-B's two borrowed elites |
| `spookytall-a` | the Pollen Road's elite | Act1-C's two borrowed elites |
| `demikobold-c` | a new Act1-A elite | two of Act1-A's four borrowed elites |
| `bellhead-a` | that elite's partner | the other two |
| `tophatfairy-c` | a normal on the Pollen Road | one of Act1-C's three borrowed normals |

**Building all five ends the borrowed elite entirely.** All eight elite nodes across the three routes
would field route-native enemies, and the Kobold Scavenger would go back to being an Act1-1 creature.
That alone is the single biggest legibility win available, because an elite is the fight a player
remembers from a route.

**It does not fix Act1-A's normals.** After the five, the three routes would stand at:

| Route | Its own enemies | Borrowed normals left | Borrowed elites left |
|---|---|---|---|
| Act1-A | 4 + 2 new elites | **10** | 0 |
| Act1-B | 5 + 1 new elite | 1 (the Sporeling) | 0 |
| Act1-C | 5 + 1 new elite + 1 new normal | 2 | 0 |

So B and C would be essentially bespoke, give or take the Sporeling wandering in. **Act1-A would still
be ten Act1-1 enemies deep.**

---

## What closes Act1-A, and most of it needs no art at all

This is the useful finding. Act1-A's sameness is only partly a roster problem — **it is mostly a
composition problem.** Compare it with Act1-B, which has one more enemy and half as many encounters
carrying a foreign one:

| | Its own enemies | Encounters | Pure encounters |
|---|---|---|---|
| Act1-A | 4 | 16 | 2 |
| Act1-B | 5 | 14 | 6 |

Act1-B is cleaner because its encounters were WRITTEN out of its own roster. Act1-A's were not. Three
steps, in the order they pay off:

1. **Unbench the Scrap Salvager, or redraw it.** It is Act1-A's own elite, it is finished, and its two
   encounters exist. Noodle benched it for being a recolour, so this needs a drawing rather than a
   decision — but it is one drawing, and it removes the Kobold Scavenger from two of Act1-A's four
   elite nodes on its own.
2. **Rewrite Act1-A's ordinary encounters out of its own four or five enemies.** No art, no new content,
   table edits only. With five enemies and sixteen encounter slots there is room for a proper spread;
   Act1-B does it with five.
3. **Then judge whether it needs a sixth enemy.** It may not. The number to watch is the "pure
   encounters" column above: get that to six out of sixteen and the route reads as its own place.

**Backgrounds are the other half and this document does not cover them.** Noodle named them first:
*"holy cow man do I need to do additional backgrounds"*. Act1-A is still drawn on the water painting,
its two colours are cold blues, and its backdrop anchors are called `northPier` and `southSteps`. A
route with its own creatures on somebody else's painting will still read as the same place.
