# Recast 01 — the existing 24, retooled

**Session 44.** The design for E1, E2, E3, E4, E6 and E10, and the record of what was built from it.
Scope note: this covers the enemies that **already exist**. E7 (+12 new enemies for Act1-B and
Act1-C) is a separate job and is not in this document.

- Who an enemy is → this folder. What it costs → `../rework/enemies/`.
- The law this obeys: **retool, don't relocate.** Every enemy below keeps its `index`, its slot, its
  act and its encounters. What changes is its `name`, its species tags, its flavour, the art it
  points at, and — for E3 — which of its moves deals Lust. **One exception**, and Noodle made it:
  the Scrap Salvager's `role`, which E10 covers.

---

## ⚠ Read the design bibles before touching this folder

This document was written twice. The first pass was built from `FEEDBACK.md` and the folder's own
catch-up **without reading `../designBibles/`**, and Noodle caught it:

> It seems like almost all of it went into the story bible, which I also should have remembered to
> point you to.

Two things in those files contradicted what the first pass built, and both are recorded in place
below so the reasoning is not lost:

| Bible | Rule | What it broke |
|---|---|---|
| `story.md` §4 | Act1-A is *"much less focus on lust"*; Act1-B owns venom, Act1-C owns charm | The first pass gave Act1-A a **Restraint theme** — an identity it is not supposed to have |
| `mechanics.md` §5 | Act 1 wants *"lineups that don't all hone in on a particular area"*; lineups that DO belong to Act 2 | The first pass made Act 1-1 a **venom monoculture**, nine line-ups teaching venom alone |
| `story.md` §8 | *"Card names come from biological, structural or mechanical ideas, not from what the card does to a health bar"* | Five renames named a hit rather than a thing |

**`../designBibles/story.md` and `../designBibles/mechanics.md` are required reading for this folder.**
The `CATCH-UP.md` now says so in its first line.

---

## Why no `index` changes anywhere

A telegraphed move and a mid-combat save both store card and enemy `index` strings, and every
encounter names its members by `index`. Renaming `mireEel` to something myconid would strand every
save mid-fight and rewrite eight encounter entries for a string no player ever sees. **Indices are
plumbing; `name` is the enemy.** So `lanternJelly` stays `lanternJelly` in the table and reads
"Foxfire" on the nameplate.

This is also what keeps the recast cheap enough to redo if Noodle vetoes a name: one field.

---

## ⚠ NAMES ARE NOODLE'S — every name below is a proposal

E1 says it outright: *"names are Noodle's"*. The names here are in the table so the roster can be read
and measured as a whole, **not** because the naming is settled. The full veto list is `FEEDBACK.md`
E9.

---

## E6 — Cordyceps Husk → **Sporeguard**

> Let's retool Cordyceps Husk to just be a mushroom soldier who uses the shield sprite.

| | Before | After |
|---|---|---|
| Name | Cordyceps Husk | **Sporeguard** |
| Tags | `undead`, `poison` | `plant`, `poison` |
| Role / health / moves | soldier, 32 | **unchanged** |
| Art | `artOwed`, standing on nothing | img2img source `refsPNG/enemies/shield.png` |

Rank-and-file frontier infantry: a myconid in scavenged human kit, which is Act1-A's whole premise
(*"Shrooms are notably using more human weapons and armor"*) and reaches back into Act 1-1 where he
also stands. His moves survive the recast without a number changing — **Rusted Sword** reads better on
a mushroom carrying looted steel than it ever did on a husk, and **Spore Cough** is more natural from
something whose head is a mushroom. Lurch → **Shield Shove**, because only a shambling body lurches.

**The `undead` tag leaves.** Its other three holders (Gloom Wisp, Hollow Knight, Hollow Champion) are
wisp-or-empty-armour, which the tone rule's *"exception to cute zombie girls"* covers. The
`cordycepsHost` status keeps its save-referenced index and displays as **Seeded** — "Cordyceps" is the
single word the tone rule blocks by name.

### The shared-sprite question E6 flagged — ANSWERED: source, not sprite

**The shield ref is the img2img SOURCE for a new drawing, not a sprite the two share.** Two enemies
with one silhouette is the exact failure E1 is about, and these two are both fielded in Region 1 where
they can appear in the same fight. The separation is written into the enemy's art note:

| | Bark Sentinel | Sporeguard |
|---|---|---|
| Body | **tree bark, wooden armour, rooted.** A palisade that walks. Wide, low, static. | **mushroom, scavenged human plate.** A soldier. Upright, narrow, mobile. |
| Silhouette cue | the shield IS the body | the shield is CARRIED, and the cap breaks the helmet line |

Recorded in `INFERENCES.md` I1.

---

## E1 — the four robes → four species

> Four myconid robe-wearers differing only by job title. […] Their names describe their mechanic, not
> an enemy. Densest patch of weak flavor.

Session 42's proposed axis is taken: **differentiate by species, not by job**, and let the fungus
dictate the body. Roles, stat lines and move lists are untouched.

| Was | Now | Fungus | The body |
|---|---|---|---|
| Spore Gardener | **Earthstar** | earthstar / puffball | Squat and round, splits along a seam to seed. Summoning IS the species. Low and wide. |
| Fungal Sage | **Bracket Elder** | bracket / shelf fungus | Shelves growing off her own back in rings. Ancient by growth, not by beard. Lopsided, broad. |
| Spore Alchemist | **Spore Alchemist** | fly agaric | **Unchanged, deliberately.** She is the tone reference the tone rule cites by name; the others are what differ *from her*. |
| Moldshaper | **Witch's Butter** | slime mould / *Tremella* | No fixed outline — spreading, dripping, re-forming. The only one whose silhouette is unstable. |

Four separable silhouettes, one palette family, and **not one of them needs a robe**.

`mossyhat-b` in the inspo variants folder is already flagged in that folder's index as *"the Fungal
Sage answer"* — brim as cap, drapes as hanging gills, train as mycelium. It is the Bracket Elder's
source.

---

## E2 / E4 — the taxonomy five → frontier myconids under arms

> Region 2 is a taxonomy list. Silt Crawler, Mire Eel, Bog Toad, Lantern Jelly — adjective plus
> animal […] The previous issue is the densest, this is definitely the worst flavor.

E4 settled the direction: these five are **Act1-A, the Mushroom Frontier**, and become *"frontier
myconids under arms"*. Each recast is **read out of the move list**, so the mechanics justify the
fiction rather than sitting awkwardly beside it:

| Was | Now | Read from its moves | The human kit |
|---|---|---|---|
| Silt Crawler *(minion)* | **Shieldcap** | Billhook (front), Pavise (weakens), Turtle | A dome-capped skirmisher behind a looted pavise. `plated` was describing scavenged plate all along. |
| Mire Eel *(striker)* | **Cagecap** | Spur, Fold In (buffs), Cage (**restraint**) | Cage fungus: the cap opens into a red lattice. Cage is the species closing. |
| Bog Toad *(tank)* | **Bolete Hook** | Hook Pull (**drags a back-liner forward**), Shoulder, War Horn, Spore Sack | Thick-stemmed bolete with a looted hooked halberd. The "tongue" is the hook. |
| Lantern Jelly *(caster)* | **Foxfire** | Lure (**charm**), Lamp Hook, Gleam (**charm**) | *Omphalotus* — the fungus that actually glows. A lamplighter marking the frontier's claim at night. |
| Drowned Salvager *(soldier → **elite**)* | **Scrap Salvager** | Spark Spear, Wire Snare, Discharge, Patch Up | **Not a myconid.** An Act 2 intruder — the scrap is the tell. See E10. |

### Two things this fixes that are not flavour

- **The "no face" problem.** E2 called out that the lantern-jelly prompt ends on `no face` on an enemy
  whose mechanical job is Charm. Foxfire is a lamplighter with a face and a lamp.
- **The water theme is gone from the enemies.** "Drowned", "Mire", "Bog", "Silt" all described a
  Flooded Vault the story bible no longer describes. Sixteen encounter names went with them.

### ⚠ What this does NOT do: the region is still called The Flooded Vault

`honeycomb.regionArray[1]` still reads **"The Flooded Vault"** over a `backdrop-vault-causeway`
painting. Recasting the enemies and leaving that in place reads worse than either state alone — **but
`BASICS.md` records that Noodle already chose the title, *Myconid Navel*, and `map/` owns titling.**
Raised there as an update to **B31**, not taken here.

---

## E10 — the Scrap Salvager becomes an elite

> Scrap salvager's definitely an elite.

Session 44's first pass assumed *"an elite enemy down here in act 1"* described his fiction. It
described his role.

| | Before | After |
|---|---|---|
| Role | soldier | **elite** |
| Health | 64 ± 4 | **135 ± 6** — between the Kobold Scavenger's 130 and the Hollow Champion's 140 |
| Spark Spear | 10 | **14** |
| Discharge *(charged, 3 turns)* | 7 | **10** |
| Gold | 16–24 | **30–45**, the elite band |
| Met | 3 normal line-ups + 1 elite | **2 elite line-ups of his own** |

**The encounter table is most of the work.** An elite still fielded three times a run as a normal body
is a promotion in name only, and it breaks the elite tier's budgets. He left `salvageCrew`,
`drownedPatrol` and `vaultGuard`, each of which took another Act1-A body and kept its budget; he left
`championDeep` so two elites never share a fight. He gained **The Salvage Crew** (middle) and **The
Stripped Grove** (late), mirroring how the other two R2 elites are fielded, and a new normal middle
encounter, **The Frontier Post**, replaces the line-up he vacated.

⚠ **`encounter-coverage.js` now puts him at 14% of runs**, the rarest non-boss in the game. That suits
a trespasser and serves the Variety law, but it is a large swing that was not separately asked for.
R2's late elite tier fires in 0.07 fights per run, so his late encounter is nearly a formality.

---

## E3 — the Lust lift, 12.9% → 25.7%

> The roster barely expresses Lust. […] the resource that makes this game itself are significantly
> underexplored.

**Design target:** roughly a quarter to a third of enemy moves. **Before: 13 of 101 = 12.9%. After:
26 of 101 = 25.7%.** The instrument is new this session:

```
node "!designDocs/honeycomb/tools/lust-share.js"
```

### The three rules the lift obeys

1. **Nobody gets harder.** The budget tools count Lust **as damage**, so raising the share by adding
   Lust would be a stat change made sideways. Six changes **convert** damage into Lust 1:1, leaving
   `enemy-template.js` reading the identical threat; the rest go into slack a boss or a support
   already had. The count of out-of-band rows in `enemy-template.js` is unchanged at nine.
2. **Frequency is free, vocabulary is expensive.** No new lust tag. **Torment stays at zero** — a
   fifth tag costs 7 characters × 3 ranks = 21 authored scenes, and `exposureDecayPerGrowth: 0.5`
   means a wide vocabulary erodes itself. Which tags survive is `lust_events/` B20's call.
3. **Each act's lust is the act's own** (`story.md` §4, `mechanics.md` §5). Act 1-1 mixes; Act1-A
   stays low and characterless; Act1-B and Act1-C arrive later owning venom and charm.

### What each enemy teaches, and why

| Enemy | Move | Change | Tag | Why that tag |
|---|---|---|---|---|
| Puffcap | Burst | dmg 7 → dmg 4 + Lust 3 | venom | A faceful of spores at the moment it splits. |
| Earthstar | Sow Spores | + Lust 3 | venom | It is sowing them into somebody. |
| Bracket Elder | Withering Bloom | poison 3 → poison 2 + Lust 3 (all) | venom | Exactly threat-neutral: poison 3 costs 6 as it ticks, poison 2 costs 3, Lust 3 makes up the rest. |
| Witch's Butter | Spore Veil | + Lust 2 (all) | **restraint** | A slime mould spreads over a thing and holds it. |
| Spore Alchemist | Sweet Vapour | dmg 2 → Lust 2 (all) | **charm** | Venom is something done to you. She is not doing anything to anybody — she is enjoying herself and it is catching. |
| Bark Sentinel | Shield Bash | dmg 10 → dmg 6 + Lust 4 | restraint | Pinned against the shield, not hit by it. |
| Kobold Scavenger | Chem Fumes | + Lust 2 (all) | **exposure** | The cargo cult's kit list is *"hoses and weed sprayers… loaded with acidic spore-sludge"* (§6). What acid takes off a party is its gear. |
| Hollow Champion | Piercing Thrust | dmg 12 → dmg 6 + Lust 6 | exposure | A duellist's thrust takes the guard apart — which the move already did by ignoring Temporary HP. Its sibling the Hollow Knight already teaches Exposure. |
| The Head Gardener | Root Snare | + Lust 4 (all) | restraint | It is a snare, and she ran 7.7 damage against an 18.1 target. |
| The Head Gardener | Thorn Whip | 3 lashes of 4 → 2 lashes + Lust 4 | restraint | A boss with six moves teaching nothing was the worst case on the board. |
| The Juggernaut | Crush | dmg 18 → dmg 12 + Lust 6 | restraint | Pinned under the log. **One move of nine** — Act1-A is the low-lust sub-act. |
| The Tallyman | Audit | + Lust 4 (all) | exposure | An audit is an exposure joke that needs no line of text. |
| Scrap Salvager | Wire Snare | dmg 5 → dmg 2 + Lust 3 | restraint | It is a snare. Met once a run now, so it makes no theme. |

### The two deliberate silences

**The Shieldcap and the Bolete Hook teach no tag at all**, and they are the only two in the bestiary
that do not. They are the two bodies Act1-A fields most — six line-ups and three — so a tag on either
is what made Restraint read as the sub-act's theme. The suite pins the silent set at **exactly these
two**, so a later session cannot quietly add a third.

This is a deliberate departure from session 42's *"every enemy should answer which Lust tag it
teaches"*. That line is a session-42 gloss, not a Noodle quote; his brief for Act1-A is *"much less
focus on lust"*, and the two outrank each other in that order.

### The spread, and why it is the point

| Tag | Before | First pass | **Shipped** |
|---|---|---|---|
| venom | 4 | 10 | **7** |
| restraint | 2 | 9 | **8** |
| charm | 5 | 5 | **6** |
| exposure | 2 | 4 | **5** |
| torment | 0 | 0 | **0** *(deliberate)* |

No tag holds more than half the roster's lust moves, **which the suite now enforces** — a roster where
one tag dominates cannot produce the mixed line-ups Act 1 wants, and it pre-spends the identity
Act1-B and Act1-C are supposed to arrive with. Line-ups teaching one tag alone fell from 11 to 7, and
every one of the remaining 7 is built from two copies of the same minion.

---

## What is left standing on purpose

| | Why |
|---|---|
| Region 1's name, description, backdrop | `map/` owns titling, and Noodle chose **Myconid Navel**. `map/` B31. |
| Torment at zero moves | A fifth tag costs 21 scenes. `lust_events/` B20 owns the tag cut. |
| The Foxfire's Charm in a low-lust sub-act | Retool, don't relocate. Its moves are its slot, and they predate this pass. |
| The Head Gardener's name | E1 named four supports; she is a boss, and her whole kit is gardening. She reads correctly once the four supports are species rather than gardeners. |
| `artOwed` on 13 enemies | The art pipeline's job; B21 cut that scope. What the drawings should BE is recorded here and in each table entry's ART note. |
| E7, the +12 for Act1-B and Act1-C | The largest piece of the overhaul, and additive rather than a recast. Next session. |
