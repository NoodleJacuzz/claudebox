# Round four: your corrections

**Suite 2604 passed, 0 failed**, up from 2582. No images touched.

---

## Cinder's back-start is gone, and you were right

I kept it in round three on the reasoning that her kit was built on it. You corrected that:

> Cinder's Embur Spur equipment change would not have gutted her, the player can reposition the party at
> teambuilding, she has plenty of skills that move her around, and moving to the back naturally happens
> in an active party, it's almost completely dead, which is why I asked for it to be removed.

The Lucky Hat is now the rerolls and nothing else. Two suite checks were written against the old
behaviour and both have been rewritten — one of them, Pincer, was passing only because Cinder arrived at
the back for free, so it now makes that move itself.

---

## The opening band is rows 0 to 5

> Rows 0-2 is too few, it should probably be 1-5 (isn't the first space, node 0, a rest space?)

It is — session 55 made `tuning.map.firstRowNodeType` a rest, so row 0 holds no fight. The band is six
rows carrying five fights, which is your 1-5.

The other three bands were widened rather than squeezed, or `early` would have had no rows left:

| Band | Rows of an 18-row act1-1 |
|---|---|
| opening | 0 to 5 (row 0 is the rest) |
| early | 6 to 9 |
| middle | 10 to 13 |
| late | 14 to the boss |

---

## Blessed Endurance

Clemence's Hair Shirt is renamed, and so is its upgrade. **The index `clemenceHairShirt` is deliberately
unchanged** — it is written into every saved deck holding a copy, and a player never sees it. Same
reasoning as `floodedVault` keeping its index under the Mushroom Frontier.

---

## Unshakeable follows Vigour

You were right to flag it, and it does — but it was worth proving rather than assuming, because it only
works because the combat entity is built after the tree is bought. Measured on Brienne:

| | Maximum health | Lust after 500 thrown at her |
|---|---|---|
| Unshakeable, no Vigour | 63 | 63 |
| Unshakeable, every Vigour rank | **88** | **88** |

The ceiling reads `entity.maxHealth`, which is the value with her whole loadout laid over it, so
anything that raises her maximum raises the cap with it. Held in suite block [131].

---

## Uncommon is retired, and here is who graduated

Fourteen relics and one heirloom moved off it. The test I applied was whether a relic **changes what a
run is trying to do**, rather than making what it already does a bit better.

**The five that graduated to rare:**

| Relic | Why |
|---|---|
| Bone Pendant | A permanent extra card every turn, for anyone. The biggest effect in the pool, and it is ungated. |
| Gilded Gauntlet | Turns Temporary HP into damage for the whole party. That is a build, not a bonus. |
| Rat King's Bell | Poison spreads off every kill. It is the engine a poison run is hoping to find. |
| Leech Jar | An extra Energy every turn, for a deck already damaging its own. |
| Cracked Hourglass | Two cards a turn for a deck built on changing intents, which is Cassadora's whole job. |

**The nine that became common:** Oathbound Banner, Cracked Ampoule, Honeyed Thorn, Trophy Cord, Marching
Drum, Prayer Beads, Reliquary of Tears, Halo of Thorns, Sleight Purse. Thief's Gloves, the one uncommon
heirloom, is common too.

**The pool is now 16 common and 9 rare.** The tier is gone from `equipmentRarityArray` and from
`relicPriceArray`, so nothing can reach it any more — an uncommon relic would now have no price. Every
reader looks a rarity up by name rather than walking the list, so removing the row breaks nothing.

**Two of the nine are worth a second look if you disagree with me.** The Reliquary of Tears fires when a
party member Breaks, and the Halo of Thorns heals Broken members every turn — both are strong
specifically for a Clemence run built on Breaking her, which is arguably build-defining rather than
incidental. I put them at common because they do nothing at all in a run not doing that.
