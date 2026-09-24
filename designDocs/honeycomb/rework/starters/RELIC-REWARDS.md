# Relic rewards — what the pool holds, and what it does not

**Written session 55, from Noodle's note:** *"Need a document with potential relic rewards, including
bonus rerolls and bonus banish"*.

Section 1 is generated from the game's own tables and is accurate as of session 55. Section 2 is the
gap he named. Section 3 is a menu of ideas. **None of it is built and none of it is a decision.**

Where this sits: `rework/starters/` owns relics (its `FEEDBACK.md` B22 is the relic rework). The rules
for how a relic is offered are in `../../reference/MECHANICS-01.md`.

---

## 1. Every relic in the game

Twenty-five entries. **Rarity** is what a shop charges and what a roll weights. **Pool** says where
chance may put it: `common` means treasure, shops and fight rewards; `event` keeps it out of those so an
event can promise it; `gauntlet` is Anastasia's and is sold only at her shelf. **Gate** is the relic's
`offerCondition` — chance never offers a relic whose gate is shut, though an event that names one
outright still gives it.

| Relic | Rarity | Pool | Gate | What it does |
|---|---|---|---|---|
| Collection Plate | common | common | brienne in the party | The first time each turn anyone in the party spends Temporary HP, draw 1 card. |
| Gilded Ledger | common | common | anyone | Gain 15 extra gold from every combat. |
| Pilgrim's Bell | common | common | anyone | Whenever an enemy is beaten, the most hurt party member heals 4 HP. |
| Traveler's Lantern | common | common | anyone | At the start of each combat, draw 1 additional card. |
| Vitae Chalice | common | common | severine in the party | Whenever an ally is healed, they also lose 2 Lust. |
| Wardstone | common | common | anyone | Whenever a party member gains Temporary HP, they gain 2 more. |
| Crackseal Wax | rare | common | anyone | The first debuff applied to each ally in a combat is negated. |
| Grandmaster's Invitation | rare | gauntlet | {"index":"gauntletOpen"} | Black wax, no name. While it is held, the next descent leads somewhere else. |
| Mulligan Stone | rare | common | the run has a reroll pool | After every battle, your rerolls refill to their full total. |
| Bone Pendant | uncommon | common | anyone | Draw 1 additional card each turn. |
| Copycat Quill | uncommon | common | cassadora in the party | Cassadora keeps her stolen moves: they do not exhaust and a copy stays in her deck. |
| Cracked Ampoule | uncommon | common | nettle in the party | Poison deals 50% more damage to Weak enemies. |
| Cracked Hourglass | uncommon | common | cassadora in the party | Whenever an enemy's intent is changed, draw 1 card. At most twice a turn. |
| Gilded Gauntlet | uncommon | common | brienne in the party | Party attacks deal 1 additional damage for every 8 Temporary HP the attacker holds. |
| Halo of Thorns | uncommon | common | clemence in the party | Broken party members heal 4 HP at the start of each turn. |
| Honeyed Thorn | uncommon | common | nettle in the party | Poisoned enemies take 2 additional Lust from everything. |
| Leech Jar | uncommon | common | severine in the party | The first time each turn the party damages one of its own, gain 1 Energy. |
| Marching Drum | uncommon | common | cinder in the party | The first time each turn a party member moves 2 or more places at once, draw 1 card. |
| Oathbound Banner | uncommon | common | brienne in the party | Whenever an ally's Temporary HP absorbs an enemy's hit, deal 2 damage to the attacker. |
| Prayer Beads | uncommon | common | clemence in the party | The first time each turn a party member gains Lust from their own card, gain 1 Energy. |
| Rat King's Bell | uncommon | common | nettle in the party | When a poisoned enemy falls, every other enemy gains half its Poison. |
| Reliquary of Tears | uncommon | common | clemence in the party | Whenever a party member Breaks, ALL enemies take 6 Lust. |
| Sleight Purse | uncommon | common | cassadora in the party | At the start of each combat, a copy of one of a random enemy's moves goes into your hand. It costs 0 and exhausts. |
| Spur of Embers | uncommon | common | cinder in the party | The party member at the front deals 2 more damage with attacks. |
| Trophy Cord | uncommon | common | severine in the party | When an enemy with a debuff falls, draw 1 card. |

**Fifteen of the twenty-five name a character** — Brienne 3, Nettle 3, Severine 3, Clemence 3,
Cassadora 2, Cinder 1. That is well over half the pool, and it is why a party of one or two sees so much
less of it than a party of three. Session 55 fixed the treasure chest, which was ignoring those gates
entirely (`FEEDBACK.md` P2): for a Brienne-and-Cinder party, twelve relics it should never have offered
were on its table.

*(Corrected: an earlier draft read this figure off that twelve, which is how many were shut for that one
party rather than how many are gated at all.)*

---

## 2. Where a relic can come from, after session 55

| Source | Chance of a relic | Which pool |
|---|---|---|
| A boss | always | uncarried, gate respected |
| An elite | always | uncarried, gate respected |
| The shop | it stocks them | uncarried, gate respected |
| A treasure chest | 0.6 | uncarried, gate respected |
| An event that names one | always | that one, gate ignored |
| An ordinary fight | **never** | — |

The last row changed this session, on his note: *"relics should only be from shops, bosses, and elites,
with a chance from chests and events"*. It used to be 0.15.

---

## 3. THE GAP HE NAMED: nothing grants a reroll or a banish

Rerolls and banishes are run resources like gold. **No relic grants either of them.** Every one in the
game comes from a progression node:

| Node | On | Gives |
|---|---|---|
| Second Chance | Brienne, Nettle, Severine, Cassadora, Cinder, Clemence | one reward reroll per run, while that character is in the party |
| Second Chance, Always | the same six | one reroll every run, whether or not they are in it |
| Banish | the same six | one banish per run, while they are in the party |
| Banish, Always | the same six | one banish every run |

The one relic that touches them is the **Mulligan Stone**, and it only refills what a node already
granted. That is why session 55 gated it: a run whose reroll maximum is zero has nothing for it to
refill, and it is a rare.

**So a player who has bought none of those nodes can never reroll a reward, and no relic will ever
change that.** Which is, as far as this document can tell, exactly what his note is about.

---

## 4. Ideas, for him to pick from or throw out

**None of these exist. None of them is a decision.** They are written so there is something concrete to
say yes or no to. Each one is a table entry plus, where noted, an engine verb that does not exist yet.

### Rerolls

| Name | Rarity | What it would do | Needs |
|---|---|---|---|
| — | common | +1 reroll for this run, once, when it is found | nothing new |
| — | uncommon | +1 reroll, and rerolling costs nothing the first time each act | a per-act counter |
| — | rare | rerolling a card reward also rerolls the gold with it | nothing new |

### Banishes

| Name | Rarity | What it would do | Needs |
|---|---|---|---|
| — | common | +1 banish for this run | nothing new |
| — | uncommon | banishing a card also pays a little gold | nothing new |
| — | rare | the first card banished each act comes back as a reward option later | a held-card slot on the run |

**The names are deliberately blank.** Naming a relic is writing for the game, and that is his.

### What to weigh before adding any of them

1. **A reroll relic makes the Mulligan Stone reachable.** Today the Stone is gated off a default run
   entirely, because nothing grants a pool for it to refill. One common reroll relic changes that.
2. **Six characters already sell rerolls through their trees**, twice each. A relic that hands one out
   for free competes with a node somebody paid experience for.
3. **The relic economy got tighter this session, twice.** Ordinary fights stopped paying relics and
   chests were capped at three a region (`../../map/FEEDBACK.md` P11 and P13). Adding six relics to the pool
   thins what a run sees of any one of them.
