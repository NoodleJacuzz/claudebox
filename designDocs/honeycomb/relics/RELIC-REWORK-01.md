# RELIC-REWORK-01 — the brief: rarity first

2026-09-25, session 65. The brief for `RELICS.md` **B22**, the relic rework, starting where it has to
start: what a rarity is *for*. Noodle's words are §0 and win over everything under them. §1 is measured
from the live tables (`../tools/relic-census.js`). §2 onward is a proposal for his veto; nothing is
built. `RELICS-LIST.md` keeps his KEEP / FAIL verdicts on the individual relics, and they stand.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done

| Part | State |
|---|---|
| §0 the brief | ☑ filed verbatim |
| §1 what rarity does today | ☑ measured 2026-09-25 |
| §2 what each tier is for | ☑ agreed 2026-09-25; ownership rewritten to his rule (§2.3) |
| §3 sizing | ☑ weights agreed; re-sized for the act 1-2 boss paying no relic |
| §4 the live 36, re-filed | ☑ the moves agreed; verdicts on each relic wait for the desktop grids (§6.7) |
| §5 engine asks | ☐ none built |
| §6 his decisions | ☑ answered 2026-09-25, verbatim |
| §7 his relic lists | ☑ filed verbatim 2026-09-25 |
| §8 the lists read against the model | ☑ read; his two principles and the build order filed |

---

## 0. The brief, verbatim (2026-09-25)

> This will essentially be somewhere between an audit and a complete overhaul.

> As always we look to slay the spire and plan first. We depreciated the uncommon rarity because it had
> no mechanical difference between it and rare to keep the game lean, but the numbers don't lie:
> Common: 44
> Uncommon: 58
> Rare: 37
> Boss: 34
> Shop: 20
> Event: 16
> Special: 7
>
> I think we lose a lot by not having it and other interesting rarities. But we'd need to concretely
> define what purpose each rarity should serve and not just include them blindly.

> Please don't forget we're moving towards a clean slate approach for demo 2, so plenty of relic
> documentation from the first demo's creation has been archived.

Still binding from before (`RELICS.md` A5, B22):

> Three starting relics for a party of three is way too many. Characters probably shouldn't start with
> ones either, they should be unlockable.

> Mark crimson fang, votive candle, and bone necklace as relics to replace in the relic rework.

His gate-level answer the same morning (§6.8):

> Demo 2 MUST have an expanded and robust set of relic rarities, and move past the previous system of just
> common and rare.

The bible's definition, which §2 keeps (`../designBibles/characters.md`): *"Common relics & heirlooms
are unlocked on obtainment and equippable from the start, whereas rare relics & heirlooms vanish when the
run ends."* Superseded by the answer above: the session-55d line the suite still quotes, *"I only
designed common and rare. Uncommon was used at one point but it should be a legacy term."*

---

## 1. What rarity does today — measured

`node "!designDocs/honeycomb/tools/relic-census.js"` prints everything below from the live tables and
600 generated runs.

**Two tables, and the table is the persistence.** `relicArray` (25) is run-scoped and found mid-run.
`equipmentArray` (11: seven heirlooms, three generic, one rare heirloom) is the permanent loadout picked
at teambuilding, one piece per character in a trio. The bible describes one class of item whose rarity
decides persistence; the code has two tables, and rarity decides nothing about it.

**Rarity's one mechanical effect on a relic is its shop price** (120 / 240; the `starter: 90` row is
dead, no starter relic exists). Every roll — elite, boss, chest, shop — is a **uniform pick** over the
uncarried, offerable, common-pool relics, in three near-identical copies of the same filter
(`rollRewardRelic`, `rollRelicOffer`, `rollRelicOfferForShop`). `tuning.reward.rarityWeightArray`
weights cards only. His reason for retiring uncommon therefore holds for rare too: today common and rare
differ only in what a shop charges.

**A rare is not an event.** A trio can be offered 15 or 16 relics (10 common, 5 or 6 rare); rares are
37% of that pool, so 37% of every drop is a rare. Slay the Spire's elite drop is about 50 / 33 / 17 and a
small chest 75 / 25 / 0.

**Income per demo run** (act 1-1 plus one route, random path, 600 maps):

| | fights | elites | bosses | shops | chests | events | rests | gold |
|---|---|---|---|---|---|---|---|---|
| Act 1-1 (18 rows) | 8.0 | 0.9 | 1 | 1.4 | 0.9 | 2.4 | 3.4 | ≈ 340 |
| A route (11–12 rows) | 4.3 | 0.5 | 1 | 0.9 | 0.7 | 1.2 | 2.8 | ≈ 320 |
| **Demo run** | 12.3 | 1.4 | 2 | 2.3 | 1.6 | 3.7 | 6.2 | **≈ 780**, 30 to start |

| Source | Live rule | Relics a run |
|---|---|---|
| elite | always | 1.4 |
| boss | always | 2.0 |
| chest | 0.6, three chests a region at most | 0.9 |
| ordinary fight | never | 0 |
| **given by chance** | | **4.3** |
| shop | 2 slots a visit at 120 / 240 | 4.5 for sale, against ≈ 780 gold shared with removal (60, +25 each), cards (55 / 120) and outfits (160) |
| event | three choices name one, one rolls one | — |

So a given relic turns up in **27–29% of a trio's runs**, and a run sees a quarter of everything it could
be offered. Slay the Spire hands out about ten relics a run from a pool of about 180, so a given relic is
a 7% event there. Honeycomb's pool is thin for its drop rate, and that, not the tier count, is the first
thing rarity has to fix.

**The tiers on the table do not match the design.** `RELICS-LIST.md` files the sister-mechanic relics as
rare heirlooms; the code holds nine of them as common and five as rare, none as heirlooms (they are
relics gated by `offerCondition: partyContains`), and five *"graduated to rare on Claude's pick"* in
session 55d. Suite block [16269] §5 pins 16 / 9 and "no uncommon"; the rework rewrites those checks.

**Verbs with no content.** `pool: "event"` exists and nothing uses it: every chance relic is pool
`common`, so the three relics events promise also fall out of chests. `unlockEquipment` on a node and
`victoryUnlockArray` on an encounter exist; no node names equipment and Anastasia's fight is the only
unlock, so Thief's Gloves and the Duelist's Blade are locked with no route. `gainRandomRelic` takes a
`rarity` and no event asks for one. The bible's loop — find a common, own it — is not built: gaining a
relic never grants equipment.

---

## 2. What each tier is for ⏸

**His seven Spire numbers are two different things.** Common, uncommon and rare are **weights** inside
one random pool: 139 of the 216, and uncommon is 42% of it. Boss, shop, event and special are
**sources**: 77 relics that never enter the random pool, each with a rule about where it comes from.
Honeycomb already has both axes as fields — `rarity` (priced, never weighted) and `pool` (common / event
/ gauntlet) — and two more that Slay the Spire never needed: **scope** (a party relic, or one character's
heirloom) and **persistence** (this run, or the profile). Uncommon was retired because one field,
`rarity`, was carrying persistence, and persistence is binary, so there was no room for a third value.
Give each axis its own field and every tier has a job.

### 2.1 The chance pool: three weights, three jobs

| | Common | Uncommon | Rare |
|---|---|---|---|
| **Job** | **Vocabulary, and the collection.** The relics a player learns and is glad to see. Finding one unlocks it as equipment for every run after: the bible's rule, and B22's "unlockable". | **The engine part.** Pays off a build the party is already in. Where the sister-mechanic relics live. | **The swing.** Changes how the run is played from the moment it lands. Party-wide, memorable, about one a run. |
| **Design band** | One always-on rule, no condition, one number. "Start of combat", "when X, +N". Never draw or Energy every turn. | One condition, one payoff; worth more the deeper the commitment; dead in the wrong party, so it is **gated** (a character, an archetype, a resource) and never offered dead. | Rule-changing and unconditional: Artifact for everyone, rerolls refilled, a second card from elites. Heavy enough that two would be a problem. |
| **Persists** | **Yes**: gaining it also unlocks it (`unlocks.grant("equipment", …)`), worn from teambuilding. | No | No |
| **Scope** | Party-wide, or owned by one character, chosen in the equipment menu (§2.3) | Gated to a character's mechanic, which he calls faked ownership; never explicitly owned; a few party-wide conditionals | Party-wide |
| **Where** | Chests (heavy), shops, some elites. The bible's act-1 meta list: *"boosting odds of finding new common artifacts"*. | Elites (heavy), chests, shops. The bible's act-2 job: *"relic acquisition to fix holes"*. | Elites and chests (light), shops (dear). |
| **Price** | 120 | 200 | 300 |
| **Reads as** | "nice" | "mine" | "the run changed" |

### 2.2 Sources: relics that are never rolled

| Pool | Job | The rule | Honeycomb's version |
|---|---|---|---|
| **Boss** | **Power with a price.** The one class allowed to break the baseline (+1 Energy, +1 draw every turn, a fourth reward slot), each with a drawback, and always a **choice**: three offered, one taken, after every boss. The only reliable Energy in the game. | Carries a `drawback`; `pool: "boss"`; never a chest, shop or elite. | Two bosses a demo run, so the tier wants eight to ten to feel varied. The act 1-1 boss row already forks the route; the boss relic is the second fork. The Bone Pendant belongs here: FAILed as a chance rare (*"removes the hard part of every turn"*), it is exactly right with a cost attached. |
| **Shop** | **Plan-dependent value.** Worth a lot to a player with a plan and nothing to one without, so it is chosen and paid for, never rolled: economy (the Gilded Ledger, buy early or worthless), agency (the Dominion Rod's six banishes, a reroll pack, a discount card), keys (the Invitation). | `pool: "shop"`; a shelf slot of its own; never a drop. | The bible's *"reduction to outfit & common relic/heirloom costs in the shop"* lands here too: buying a common IS unlocking it. `shopGuaranteed` is the seam. |
| **Event** | **A story that leaves a mark.** Given only by the event that tells it, and it carries the event's cost — max HP, a curse, a weakness rank — so the relic *is* the consequence. | `pool: "event"`; the event names it; never rolled. | The H-game axis Slay the Spire has no use for: per-character map events (`../events/EVENTS.md` S64-2) and Lust Events can hand out **heirlooms priced in a weakness rank**: accept the weakness, keep the relic. |
| **Gauntlet** | A plot key | exists (`gauntletInvitation`) | per feature; not a tier to fill |

**Not imported, and why.** *Special* (the Circlet, Slay the Spire's filler for an exhausted pool):
Honeycomb pays 40 experience for a duplicate or an empty pool (`grantRelicOrExperience`), so nothing
needs to fill in. *Starter*: cut by his B22 call; the equipment loadout is the starting tier and commons
feed it; `relicPriceArray.starter` goes. *Uncommon as a persistence class*: no. Persistence is a field on
the tier (`persists`), not a fourth rarity.

### 2.3 The four axes, as fields

| Field | Values | Decides |
|---|---|---|
| `rarity` | common · uncommon · rare | weight per source, price, `persists`: one row each in `honeycomb.relicRarityArray` (today `equipmentRarityArray`, serving both tables) |
| `pool` | chance (default) · boss · shop · event · gauntlet | which roll may reach it, or which screen |
| `offerCondition` | any condition | the gate: a sister relic is offered only while its character is in the party, which he calls **faked ownership** (it only talks to her mechanic); the Mulligan Stone only while a reroll pool exists |
| `owner` | a party member, chosen | **explicit ownership**, his rule (§6.2): only where there is a moment to choose, so a common is assigned in the equipment menu at teambuilding and an event relic by the event's own pick of a member; a relic found by chance mid-run never has one. A relic whose benefit reaches one character is a balancing tool, not the norm |

**One table, his call (§6.2).** *"Equipment"* is a flavour name for a common relic taken at the start, and
nothing else: no mechanical difference from a relic found on turn one. `relicArray` and `equipmentArray`
merge; the teambuilding screen's equipment tab lists the persisting rarity, keeps its starting allowance
(one piece each in a trio, more in a smaller party), and is where a common's owner is chosen. Every
duplicated pair drifts, and the Iron Sigil is already a relic in the design and equipment in the code.

---

## 3. Sizing the tiers ⏸ — from §1's income

The yardstick is `../card_pool/POOL-REVIEW-02.md`'s: offers per item per run, not the raw count.
Weights are tuning rows (`tuning.relic.weightArray`, one per source); the numbers below are the first
proposal, and `relic-census.js` measures what any set of them produces.

| Source | A run | common | uncommon | rare | Gives a run |
|---|---|---|---|---|---|
| chest | 0.9 | 70 | 30 | 0 | 0.65 C · 0.28 U |
| elite | 1.4 | 40 | 45 | 15 | 0.55 C · 0.62 U · 0.21 R |
| boss | 1.0 (the act 1-2 boss pays no relic until act 2 exists, his call, §6.3) | boss pool: three offered, one taken | | | 1 boss |
| shop | 2.3 visits × (2 chance slots + 1 shop-pool slot) | 45 | 40 | 15 | 4.6 chance + 2.3 shop-pool, for sale |
| event | as written | | | | ≈ 0.3 |

Given by chance ≈ 3.3 a run, re-shaped: **1.2 common, 0.9 uncommon, 0.2 rare, 1 boss**, plus what is
bought. A rare becomes a one-in-five event before the shop; a common is met every run; the boss choice
after act 1-1 is the run's big decision, and the act 1-2 boss pays no relic until there is an act 2 to
carry it into.

| Tier | Pool target | Have (§4) | Gap | Why that size |
|---|---|---|---|---|
| Common | ≈ 20 (8 party + 2 heirlooms × 6) | 11 live, 15 drafted in `RELICS-LIST.md` | none; trim to the best 20 | a trio sees 14; at 1.2 found a run the collection takes ≈ 17 runs, longer with duplicates, shorter with Collector |
| Uncommon | 24–30 (3–4 heirlooms × 6 + ≈ 6 party-wide) | 16 live, 7 drafted | ≈ 6 party-wide conditionals | a trio sees 15–18; a given one in ≈ 5% of runs, Slay the Spire's uncommon rate |
| Rare | 8–10 | 3 live, 7 drafted | none | ≈ 3% of runs each |
| Boss | 8–10 | 1 live; his lists bring it to 8 or 9 (§8) | closed by §8 | three offered a run from nine: each seen in a third of runs, taken in a ninth; act 2 doubles the offers |
| Shop | 5–6 | 2, plus the Invitation | 3–4 | `RELIC-REWARDS.md` §4 holds six unnamed reroll / banish ideas |
| Event | one per character for the demo | 0 | 6 | `../events/` owns them |

**≈ 75 relics, against 36 live and 29 drafted.** The design that does not exist yet is the boss tier
and the shop tier; the rest is his verdicts on drafts, and the re-filing below.

---

## 4. The live 36, re-filed against §2 ⏸

"Verdict" is his, from `RELICS-LIST.md` (`→ draft` means a replacement is drafted there). "Tier" is the
proposal. Names are unchanged; renaming is his.

| Relic | Today | Verdict | Tier | Note |
|---|---|---|---|---|
| Pilgrim's Bell | common, party | KEEP | Common | heals on a kill; watch beside A5 |
| Traveler's Lantern | common, party | KEEP | Common | |
| Wardstone | common, party | FAIL → draft | Common | |
| Gilded Ledger | common, party | WATCH | **Shop** | plan-dependent; *"either it earns the slot or it becomes a Bounty node. Not both."* |
| Collection Plate | common, Brienne | FAIL → draft | Uncommon heirloom | |
| Oathbound Banner | common, Brienne | KEEP | Uncommon heirloom | |
| Gilded Gauntlet | rare, Brienne | KEEP | Uncommon heirloom | uncommon before 55d |
| Cracked Ampoule | common, Nettle | REPLACE → draft | Uncommon heirloom | |
| Honeyed Thorn | common, Nettle | FAIL → draft | Uncommon heirloom | |
| Rat King's Bell | rare, Nettle | WATCH | Uncommon heirloom | |
| Trophy Cord | common, Severine | KEEP | Uncommon heirloom | |
| Leech Jar | rare, Severine | WATCH | Uncommon heirloom | |
| Vitae Chalice | common, Severine | WATCH | Uncommon heirloom slot | `../card_pool/CARD-POOL-02.md` §3.5 retires it with "lose 3 Lust"; the slot wants a Thirst relic |
| Spur of Embers | common, Cinder | FAIL → draft | Uncommon heirloom | |
| Marching Drum | common, Cinder | FAIL → draft | Uncommon heirloom | |
| Prayer Beads | common, Clemence | REPLACE → draft | Uncommon heirloom | |
| Reliquary of Tears | common, Clemence | KEEP | Uncommon heirloom | |
| Halo of Thorns | common, Clemence | KEEP | Uncommon heirloom | |
| Cracked Hourglass | rare, Cassadora | FAIL → draft | Uncommon heirloom | |
| Sleight Purse | common, Cassadora | FAIL → draft | Uncommon heirloom | |
| Bone Pendant | rare, party | FAIL | **Boss** | draw +1 every turn, confirmed boss-grade (§6.5); needs its drawback |
| Crackseal Wax | rare, party | KEEP | Rare | the event that hands it out wants an event relic of its own |
| Mulligan Stone | rare, party, gated | — | Rare | gate stays |
| Dominion Rod | rare, party | — | **Shop** | six banishes are a plan |
| Grandmaster's Invitation | rare, gauntlet | — | Gauntlet | unchanged |
| Iron Sigil | common heirloom, Brienne, worn from start | KEEP | Common heirloom | found, not started with (B22) |
| Shadow Locket | common heirloom, Nettle, from start | FAIL: *"rare artifact"* | Rare, party | his call |
| Crimson Fang | common heirloom, Severine, from start | B22 replace | Common heirloom slot | |
| Lucky Hat | common heirloom, Cinder, from start | — | Common heirloom | two rerolls; makes the Stone reachable |
| Votive Candle | common heirloom, Clemence, from start | B22 replace | Common heirloom slot | |
| Crystal Ball | common heirloom, Cassadora, from start | KEEP | Common heirloom | |
| Pocketwatch | common heirloom, Anastasia | — | off the gate | |
| Whetstone | common, generic, from start | FAIL → draft | Common | |
| Heavy Pauldrons | common, generic, from start | KEEP | Common | Weight Training |
| Thief's Gloves | common, generic, no route | FAIL → draft | Common | |
| Duelist's Blade | rare heirloom, Brienne, no route | FAIL | cut | *"dies with the new basics anyway"* |

Totals: Common 11 · Uncommon 16 · Rare 3 · Boss 1 · Shop 2 · plot 1 · off the gate 1 · cut 1.

---

## 5. Engine asks ☐ — table entries first, a verb where one is missing

| # | Ask | Kind | Size |
|---|---|---|---|
| 1 | `honeycomb.relicRarityArray`: three rows with `persists`, `price` and `order`; `relicPriceArray` reads it; the `starter` row goes | table | small |
| 2 | `tuning.relic.weightArray`, one row per source, and **one** `honeycomb.rollRelic(source)` replacing the three copies of the filter with a weighted pick | verb | small |
| 3 | `pool` honoured: the chance roll skips boss / shop / event; the boss reward rolls `bossRelicChoiceCount` from the boss pool into a choice. The card reward's choice screen is the model; a relic one does not exist | verb + screen | medium |
| 4 | Persistence: `grantRelic` grants the unlock when the tier persists; the tables merge and `equipmentArray` becomes the view of the persisting rarity (§2.3, decided §6.2) | verb | medium |
| 5 | `characterIndex` on a relic implies the party gate; the fifteen hand-written `partyContains` lines go | table cleanup, one line in `relicOfferable` | small |
| 6 | Shop: a third shelf slot rolled from the shop pool; `shopGuaranteed` generalises to it | verb | small |
| 7 | Suite: block [16269] §5 rewritten; new checks that the weights of each source sum, every boss relic carries a `drawback`, a persisting tier grants its unlock, and one **measured** check: rares under a quarter of drops over 600 runs, proven red first by setting a weight wrong | suite | medium |
| 8 | Warnings: one rule per band. An uncommon has a gate or a condition; a boss relic a `drawback`; a common reads no private meter | table | small |
| 9 | Saves: `run.relicArray` stores indices and counters only, and rarity strings live on definitions, so a re-tiering touches no save | check | none |
| 10 | The run's final boss pays no relic while it is the demo's last fight: a `reward.finalBossRelic` switch read by `rollRewardRelic` against `map.route.regionsPerRun` (§6.3); flipped back when act 2 exists | tuning | small |
| 11 | `owner` on a carried relic (`run.relicArray[i].owner`), set by the equipment menu for a common at run start and by an event's member pick for an event relic, handed to hooks as `params.owner` (§2.3) | verb | small to medium |

---

## 6. His decisions — ANSWERED 2026-09-25

The questions as asked, his answers verbatim under each.

1. **Commons persist** (the bible's rule: find it, own it, wear it from teambuilding)?

   > Yes.

2. **One table for relics and equipment, or two with a link?**

   > I would prefer that equipment was purely a flavor name for common relics taken at the start. I don't
   > like that equipment is treated as mechanically different in any way from just having a relic available
   > from the start. The one thing is I do like the idea that some relics have "owners". Both when ownership
   > is faked (ie the relic only interacts with one character's mechanic, like a resolve relic is seen by the
   > player as being owned by Brienne), and when it is explicit. I think relic ownership only works for ones
   > given by events, since we can directly pick a party member for the relic to "target". Common relics are
   > good design space for true ownership to live since the equipment menu works for assigning ownership as
   > well, it works intuitively, and a relic that gives a benefit to only one character is a good balancing
   > tool. Note: Please don't take this to mean every, or even most common relics should use ownership as
   > its mechanic, it's just one neat mechanic.

   §2.3 is rewritten to this.

3. **A boss tier, three offered with drawbacks after every boss, on the demo's gate?**

   > Yes. Though I'd like to request the act1-2 bosses no longer drop relics temporarily. It feels bad to
   > get a cool relic and have no chance to play with it, it takes the wind from the sails of a victory.

   §3 and §5 row 10 carry it. The act 1-2 boss's card reward is the same kind of dead reward and was not
   asked about; left as it is.

4. **The weights in §3, or his numbers?**

   > Weights seem solid.

5. **The re-filings out of the chance pool: Ledger and Rod to the shop, Bone Pendant to boss, Shadow
   Locket to rare?**

   > Bone pendant... Was that every turn? If not, it's not strong enough to fit in the boss energy relic
   > archetype. All other shifts are good.

   It is every turn ("Draw 1 additional card each turn"), so it stays a boss relic.

6. **Event heirlooms priced in a weakness rank, on the gate?**

   > Yes. I came up with that in my own list too.

   Filed as `../events/EVENTS.md` S65-1.

7. **Names are his?**

   > Sure. HOWEVER. This came up in the last two sessions. I cannot judge cards or relics as lists in txt
   > files. I want visual grids. They can be dummies using the game's card art, but I must be able to see a
   > card with its cost and effect in the card frame in order to feel I can judge it fairly. I would want a
   > similar grid of relics. That means all review and veto-ing is deferred for desktop sessions, please
   > record this in your claude file.

   Recorded in `../BASICS.md` ("Design review happens on the desktop, in the frame") and in the Claude
   instructions file at the repository root; the bench is `../tooling/TOOLING.md` S65-1. §4's verdicts and
   §8 wait for it.

8. **Does this morning's message supersede the 55d line the suite quotes?**

   > Yes. Demo 2 MUST have an expanded and robust set of relic rarities, and move past the previous system
   > of just common and rare.

9. **Added by him, outside the eight:**

   > I genuinely keep forgetting this, but please add to the list: Common broken cards with the exception
   > of Clemence's MUST all be made to comply with the design archetype of "This card has no effect. If
   > left unplayed at the end of your turn: [Bad effect happens TO THE ALLIED PARTY, NOT ENEMIES]". As far
   > as I'm aware, not a single one does, and it keeps getting forgotten.

   > Oh no, I made a huge mistake. It should be starter, not common in that must statement, I'm very
   > sorry!

   Measured and filed as `../card_pool/CARD-POOL.md` S65-1: the five characters' starters break into ten
   forms and none complies; Anastasia's starter form, Advance Broken, is the one card in the game with the
   shape.

---

## 7. His relic lists, verbatim (2026-09-25, later the same morning)

> Honeycomb Relics
> (drafted while you were brainstorming, many of these may be things you have considered already, ruminate
> on these while I ponder the questions)
>
> Boss Energy Relics
> Faustian bargain type offerings. Each offers more energy, the most powerful and valuable resources in
> the game. They absolutely must come at a cost big enough to alter the macro-strategy of the game.
> Notably, they should also instantly lock the player down the grind/burst path.
> - You can no longer heal hp at rest sites (resting only reduces lust).
> - All characters gain 1 lust at the end of every turn.
> - You cannot play more than 6 cards per turn.
> - Card reward choices offer 1 choice instead of 3
> - The shop is replaced with "Midnight Bliss", which sells more negative items and cards you purchase
>   come with curses.
>
> Build-Arounds
> These are run-defining rares. The moment the player obtains them, a specific strategy has begun to
> form, they may even instantly start to pivot their decks.
> - Unspent energy carries over between turns.
> - Unplayed cards are not discarded at the end of your turn.
> - When you exhaust a card, add a random card to your hand (from the drop pool's legal options).
> - Temporary HP does not reduce at the start of your turn.
> - All damage that would be dealt to party members is ALWAYS dealt to the front-most party member
>   instead.
> - Characters deal 1 more damage for each 20 points of lust they have.
> - Characters deal 50% more damage with single-target attacks. Single target attacks now always hit the
>   front-most enemy.
> - All characters permanently gain Sanctified.
>
> Mechanical Shake-ups
> Important relics that set a precedent and open up wide swaths of future design space.
> - When acquired, choose a card. That card always starts in your hand.
> - When acquired, each character gains a weakness rank of [lust type, doesn't matter which]. While you
>   carry [relic name], reduce lust inflicted by [lust type] cards by 90%.
> - When acquired, reduce the cost of every card in your deck by 1. Playing cards now deals 6 damage to
>   their owner.
> - Whenever a character would be dealt 5 or less damage, they take exactly 1 damage.
> - Anytime you would have 0 cards in hand, draw a card.
> - The card reward pool now includes neutral cards. (They can replace a character's card in a reward
>   slot, handily handling the problem of ownership assignment)
> - At the end of each battle, gain 15 gold. Remove this relic when you purchase something from the shop.
> - Permanently upgrade the first non-starter card you play each battle.
> - During your turn you may manually drag party members between positions. This does not count as
>   movement for the purposes of Heat or Stride.
> - At the end of each turn, if you played at least 1 card belonging to each party member, soothe 10
>   lust from each of them.
>
> EXTREME mechanical shakeups
> I really want to take advantage of the fact that we built this engine from scratch. These are PURELY
> theoretical at this stage, but making the player say "What?! How is that even possible?!" makes them
> extremely appealing and exciting.
> - The HP, lust, and status effects of every character is now merged into a single bar. They are now
>   effectively one character.
> - When acquired, choose a character not in the party. Add them to the party. Max party size is 5.
> - Once per battle, drag a card onto this relic's icon to seal it inside the relic. When the relic is
>   clicked, play every card sealed inside.
> - Instead of drawing cards, you choose which cards to add from your deck to hand. (Mechanically, you get
>   'draw points', click on the deck, then click on cards inside it to move cards from the deck to the
>   hand, similar to the battle lab)
> - Anytime you would gain lust, you lose gold instead. The run ends if you hit 0 gold.
> - When acquired, once per character, each party member gains an additional, permanent, free rank of the
>   Vigor progression node. (They gain +6 max hp, even if the node is already maxed, like if the node
>   itself gained another max rank and was leveled up for free.)

---

## 8. The lists read against the model ⏸

**His four buckets are the model's loud tiers under their own names.** *Boss Energy* is the boss pool
with a sharper rule than §2.2's: the price does not merely tax, it **picks a path**. *Build-Arounds* is
the rare tier's definition and reads better than "the swing": *"the moment the player obtains them, a
specific strategy has begun to form."* *Mechanical Shake-ups* sort across uncommon, shop, rare, boss and
event. *EXTREME* is a **source, not a weight**: met, never rolled, one a run at most, so that every
expensive one is seen by every player who wants it. No common appears in any list, which is right: the
collection is the quiet tier.

**His reading of this read (2026-09-25), verbatim:**

> Good catch on the lack of split between burst and grind. I was purely ideacrafting.

> Yes some of them are overcome by specific party compositions, this is good. When a player sees that relic,
> it makes them want to include Clemence. When they already have her, they feel rewarded for experimenting.
> The game is more than hard enough already, a few very rare combinations breaking through that difficulty
> and carrying a player really far aren't a dealbreaker, especially given we're in act 1.

> Still, just treat all the relic designs I suggested as theoretical. Your designs are likely far safer, much
> more inside-the-lines than mine are, which creates a very nice 1-2. We get the safe relics working, look at
> our environment, and judge *then* if the crazier ones are good fits.

Two rules and an order. A party that dodges a relic's price is a party rewarded for experimenting; where a
Watch below says a composition hollows a price out, his rule wins. **The build order is the safe pool
first**: §2's tiers and weights, §4's re-filing and the `RELICS-LIST.md` drafts, measured with the census,
and only then his lists, judged in the frame (§6.7).

**Three things fall out of the boss list.** The offer should be **stratified by lean**: a `lean` field
(`burst` / `grind` / `either`) and the three offered are one of each, or a boss could hand a Grind party
three Burst prices and nothing to take. Not every boss relic needs Energy: 12, 16 and 24 below make the
choice "Energy with a price, or a different price", which is what makes the Spire's boss screen a
decision. And the act-1 floor is structurally safe: a boss relic arrives after the act 1-1 boss, so no
drawback ever touches the first third of the run.

Engine sizes: small is a hook or a flag on a seam that exists; medium is a verb or a screen; large is
a structural change.

| # | His line | Tier | Lean | Engine | Watch |
|---|---|---|---|---|---|
| 1 | No healing at rest sites | Boss, +1 Energy | Burst | a rest-option gate; small | Clemence's kit and the per-fight heals (A5) hollow the price out; upgrades and removal stay at the fire |
| 2 | 1 Lust to everyone each turn end | Boss, +1 Energy | Burst | one hook; small | untagged Lust feeds no weakness; 13 blunts it |
| 3 | At most 6 cards a turn | Boss, +1 Energy | Grind | a play counter and a gate; small | the two 0-cost neutrals and stolen cards count; the hand must show the count |
| 4 | One card choice, not three | Boss, +1 Energy | commitment, no lean | `choiceCount` as a run field; small | freezes the path rather than choosing one; rerolls and banishes buy it back, which makes them worth more |
| 5 | Midnight Bliss | Boss, +1 Energy | unknown until its stock is written | a second shop table and curses on purchase; medium, after `../card_pool/CARD-POOL.md` B24 | the most flavourful; a home for "negative items" and B24's curses both |
| 6 | Energy carries over | Rare | Grind | a retain flag at turn end; small | Leech Jar and Prayer Beads stack into it |
| 7 | Unplayed cards stay | Rare | Grind | `retain` on every card is one flag; small | the hand cap of 10 bounds it, and Honeycomb's hand-biting curses make it self-limiting where the Spire's Pyramid is not |
| 8 | Exhaust: a random legal card | Rare | Burst | Possibility's `discoverCard` plumbing; medium until that lands | Nettle's Souls and Fence feed it; the card's owner is whoever's pool it came from |
| 9 | Temporary HP never decays | Rare | Grind, pivoting to Burst through the Gauntlet | one decay modifier; small | Bastion's passive is this rule at a quarter; the Almoner precedent allows the party-wide version if the numbers differ |
| 10 | All damage to the front | Rare | either | a permanent Taunt-style redirect on rank 0; small | a sweep lands three times on one body: the price is built in; Broken at the front passes it back |
| 11 | +1 damage per 20 Lust | Uncommon, party-wide | Burst | one modifier; small | modest at 60 Lust; multi-hit attackers get the most; exactly the uncommon gap's shape |
| 12 | +50% single-target, always the front | **Boss, no Energy** | Burst | a targeting override and a modifier; small | a bargain, not a swing: losing the back line is a real price, so it belongs on the boss screen |
| 13 | Sanctified for all | Rare | Grind | apply at combat start; small | Broken keeps only its bleed (Sanctified's text); pairs with 2; the Reliquary still fires |
| 14 | Choose a card, always in hand | Uncommon, party-wide | either | `innate` on a deck instance and the pick verb, both existing; small | the Spire's Bottled relics; fills the uncommon gap |
| 15 | A weakness rank for 90% less Lust | **Event**, one per act-1 tag | Grind | a resistance modifier keyed by tag; the rank is a profile write; small | Fortitude pays nothing, so it is gated to those who can pay; the reading taken is resistance to Lust the ENEMY inflicts with that tag (confirm) |
| 16 | Cost −1, 6 damage per card | **Boss, no Energy** | Burst | a cost modifier and a self-damage hook; small | the damage must ignore Temporary HP or Brienne makes it free; Bloodletting turns it into fuel |
| 17 | 5 or less becomes 1 | Rare | Grind | `modifyDamageTaken`; small | the Spire's Torii; Poison ticks are not attacks |
| 18 | Empty hand: draw | Rare | Burst | one hook; small | the Spire's Unceasing Top; the Bone Pendant draft was the once-a-combat version |
| 19 | Neutrals in rewards, in a member's slot | **Shop** | either | `neutralSlotChance` as a run field; small | the Spire's Prismatic Shard is shop-only too; **the slot's owner owns the neutral**, which answers S64-1's ownership question for rewards |
| 20 | 15 gold a fight, gone on purchase | **Common** | either | an `onShopPurchase` hook and `removeRelic`, which exists; small | the Spire's Maw Bank; this is the Ledger's fix and keeps it in the chance pool |
| 21 | Permanent upgrade, first non-starter played | Rare | either | an `onCardPlayed` hook and the upgrade verb; small | starters excluded as the rule says; twelve fights upgrade twelve cards, near boss power |
| 22 | Drag party members freely | Shop | either | a fighter drag is new UI and touches mobile; medium | cheaper as an ability the relic grants (`abilityAdditionArray`, `swapParty`): same design, no new UI; Cinder's movement cards lose value |
| 23 | All owners played: soothe 10 each | Uncommon, party-wide | Grind | a per-owner play tally; small | a solo party satisfies it for free, so it wants two owners at least or a party-size scale |
| 24 | One merged bar | Event or Boss | Grind | a rewrite of the ally side; **large** | compose it instead: damage to the front (10), Lust to one body (Bastion's strand hook), healing shared. Same fantasy on existing seams |
| 25 | Recruit a fourth, at most five | Event | either | `partySizeMaximum` is tuning (3, debug 6) and the scaling exists; the battlefield and mobile layouts are the cost; medium to large | the recruit's basics flood the deck mid-run: the price is built in |
| 26 | Seal cards in the relic, play them all | Rare | Burst | a drop target on the relic icon, a list on the relic's run state, a play loop; medium | sealing thins the deck, so it is Grind value too; the stolen-card plumbing plays a card as its owner |
| 27 | Choose your draws | Boss with a price, or Event | either | the Battle Lab's deck picker and a draw-points resource; medium | beyond boss power without a price (draw one fewer, or chosen cards cost 1 more); every turn becomes a menu, which phones will feel |
| 28 | Lust becomes gold loss, 0 gold ends the run | not for the demo | — | a new loss condition; small | it switches the game's second axis off (no Broken, no Lust Events), and 780 gold a run against Lust hits of 6 to 20 is a death sentence; a halved form ("half your Lust is taken as gold") keeps the axis |
| 29 | A free Vigour rank each, forever | Event | either | a profile bonus-rank field the rank reader adds; small | the first relic to write to the profile without being equipment: a precedent worth having |

**What the lists do to §3's gaps.** Boss: his five Energy prices plus 12, 16 and 24 or 27 make eight or
nine, and the gap closes. Uncommon party-wide: 11, 14 and 23 are three of the six. Shop: 19 and 22 join
the Ledger's slot, which 20 hands back to the commons. Event: 15 (three relics, one per act-1 tag), 25
and 29 give the tier its first content and its shape: a price paid outside the fight.
