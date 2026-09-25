# POOL-REVIEW-02 — the manual pass on the card pool: what it is, and what to do about it

2026-09-25, cloud session, design only. Noodle's request is `FEEDBACK.md` **B34**, verbatim. Nothing in the
game changed. This is a review and a proposal; the brief for the second pool pass (`CARD-POOL-02.md`)
gets written once the questions in §7 are answered. Read first: `../../designBibles/mechanics.md`,
`../../designBibles/characters.md`, `../starters/OUTFITS-LIST.md`, `CARD-POOL-01.md`.

Every number below was measured on the live content with the headless engine, not read off a doc.

---

## 1. The number the size question turns on: offers per character per run

The reward screen deals **one slot per party member** (`tuning.reward.spreadAcrossParty`), so a
character's pool is drawn from once per fight, whoever the player is building around.

Fights on a path, mean over 80 generated maps:

| Region | Rows | Combat | Elite | Boss | Card rewards |
|---|---|---|---|---|---|
| Act1-1 (upperCatacombs) | 18 | 8.0 | 0.9 | 1 | ≈ 10 |
| Any Act1-2 route | 11–12 | 4.4 | 0.5 | 1 | ≈ 6 |
| **Demo run** | | | | | **≈ 16** |

So each character is offered **about 16 cards per demo run**, and roughly 32 once Acts 2 and 3 exist.

What that does to the live pool (21 C / 11 R per character, every alt outfit `unlockedFromStart`, reward
weights 75 / 25):

| | Pool | Offers of that rarity per run | Times a given card is offered per run |
|---|---|---|---|
| Honeycomb common, today | 21 | 12 | **0.57** |
| Honeycomb rare, today | 11 | 4 | **0.36** |
| Honeycomb common, base pool only (alts locked) | 12 | 12 | 1.0 |
| Honeycomb rare, base pool only | 5 | 4 | 0.8 |
| Slay the Spire common (20, ≈60% of ≈100 offers) | 20 | ≈60 | **≈3** |
| Slay the Spire uncommon (36, ≈37%) | 36 | ≈37 | ≈1 |
| Slay the Spire rare (16, ≈3% plus the pity timer) | 16 | ≈3 | ≈0.2 |

**The gradient is flat.** A Honeycomb common is met every other run; a Slay the Spire common is met
three times a run. A Honeycomb rare is offered almost as often as a common. Nothing becomes vocabulary
and a rare is not an event. That, not the raw count, is why nothing is memorable — and it is why the
slash is right: 16 offers per character per run is fixed by the map, so the only way a common comes
round often enough to be learned is a pool small enough for it to.

The "75 cards per character" yardstick is the wrong one to reason from. Slay the Spire's 75 works because
its map hands out ≈100 offers from that one pool. Honeycomb's map hands out 16 per pool. The right
yardstick is offers per card per run, and by that measure the pool needs to be **under 20 per character**,
whatever Slay the Spire has.

Two smaller things the same measurement shows:

- A reward can offer a card the deck already holds (`rollCardReward` has no owned-card check). With a
  smaller pool that happens every run. Weight held cards down or exclude a second copy.
- Elites lean 45 / 55 toward rares and there are ≈1.4 of them a run, so the rare rate is even higher in
  practice than 25%.

---

## 2. What the pool is, read card by card

**Shape.** 24 sisters (4 per character) × (3 commons + 2 or 3 rares). Base pool 12 C / 5 R; each alt
outfit unlocks 3 C + 1 cross-party R and carries 1 worn-only R. Every alt is unlocked from run one
(`rework/starters/` B1, open since session 25), so the whole 32 drops.

**Same shape, different number.** Grouping each character's cards by the effect verbs they use and the
target they aim at (ignoring which status and which number):

| Character | Cards sitting in a shape used 3+ times | The shape |
|---|---|---|
| Brienne | 14 of 32 | "gain tHP + a status" ×7, "a power on herself" ×4, "deal N scaled by tHP" ×3 |
| Nettle | 12 of 32 | "apply a status to an enemy" ×6, "…to all enemies" ×3, "a power on herself" ×3 |
| Severine | 11 of 32 | "deal N scaled by something" ×4, "a power on herself" ×4, "deal N + a debuff" ×3 |
| Cassadora | 9 of 32 | "deal N scaled" ×3, "scry + draw" ×3, "apply a status" ×3 |
| Cinder | 7 of 32 | "deal N" ×4, "a power" ×3 |
| Clemence | 3 of 32 | "a power" ×3 |

The 9-per-energy rate discipline of session 33 produced these bodies: a common is "Deal 8, plus a
rider" or "Gain 6 tHP, plus a status", and the sisters differ by the rider. The differences are numbers,
and numbers are not what a player remembers. The cards that *are* memorable — Kiss, Pass the Flame, Turn
the Line, Tribute, Draw Out, Gold Standard, Malediction, Spread Misfortune, Wheel of Fortune, Surrender,
Blood Moon, Headstrong, Incredible Wealth, Quicken Rot, Death Knell, Suffer the Blows, Grand Heist, Let Go,
Rally the Ranks — each do one strange thing. Most are outfit signatures (which never drop) or rares. The
commons are almost all "Deal / Gain N, plus".

**Giving is not the same as glue.** Cards whose target is an ally, or a power that reads the whole party:

| Clemence | Cinder | Brienne | Nettle | Severine | Cassadora |
|---|---|---|---|---|---|
| 19 | 11 | 10 | 5 | 5 | 4 |

That is the *giving* half. Glue also needs a *receiving* half: a payoff that reads a currency regardless
of who produced it. Almost every payoff in the pool reads a private meter (Resolve, Souls, Thirst orbs,
Stride, Devotion, the Orb) or the owner's own status economy. The shared currencies the game already has,
and who reads them:

| Currency | Who produces it | Who pays it off (on another character's card) |
|---|---|---|
| Temporary HP on an ally | Brienne, Clemence, Cinder, Cassadora, Severine (Scar Tissue) | **Brienne only** (Ransom, Tribute, Largesse, Rally, Armament) |
| A debuff on an enemy | Nettle, Severine, Cassadora, Clemence, Cinder | Nettle (Putrefy, Catharsis), Cassadora (Coven's Curse, Malediction, Spread Misfortune) |
| Lust on an enemy | Nettle (Venom), Clemence | Nettle (Flushed, Bacchanal, Kiss, Aphrodisiac), Clemence (Heavenly Gaze) |
| Health lost by an ally | Severine, enemies | Severine (Blood for Blood, Blood Rite, Scar Tissue), Brienne's Resolve meter |
| Healing on an ally | Clemence, Severine | **Severine only** (Blood Debt) |
| Party position | Cinder | **Cinder only** (Vanguard, front / back riders) |
| A Broken ally | anyone, by losing | **Clemence only** (Sanctuary line) |
| A card exhausted | Nettle, Cassadora (Fence) | Nettle's Souls |

Three currencies have one reader. That table is the glue audit in one place: a glue card is one that
adds a reader to a row, or a producer to a row that has readers on other characters.

**Why glue is structural here and optional in Slay the Spire.** Every Slay the Spire offer comes from the
one pool you are building. Here two of the three slots on every reward screen belong to characters you
may not be building around. If Brienne is the engine, the Nettle and Severine slots are dead unless
their cards make tHP, read tHP, or are good in any deck. Sixteen rewards a run, two-thirds of every screen
off-plan by construction: the "nonsynergistic cards diluting the cool" report is the reward structure
showing through the pool.

---

## 3. Where the requests are right, and where I would push back

**Identity.** Right, for the reasons in §1 and §2. The fix is fewer commons seen more often, each doing one
verb, with the sisters expressed in rares and outfits rather than in commons that differ by rider.

**Glue.** Right, and structural. The rule I would build the pass on: *every common is either a verb
(produces a shared currency) or a bridge (pays off a shared currency whoever made it)*. A payoff that
reads only a private meter or an own-only status is a rare or an outfit card, or it is cut.

**Lock the costumes with the selfish cards.** Right, and it inverts today's gate. Today the base pool is
three commons per sister — the most silo-ish cards a character has — and an unlock adds three more of the
same sister. Proposed: base = the character's verbs and bridges; unlock = that sister's enablers and its
cross-party rare; worn-only = the sister's selfish build-around. `rework/starters/` B1 (run-win / shop /
tree-end) is the engine job this depends on and it has been open since session 25. Nothing in this review
counts until the 18 alts stop being `unlockedFromStart: true`.

**Cinder off Sundered.** Right, and for three reasons beyond the art. Sundered decays a stack a turn since
P7, so her per-debuff payoffs bleed value every turn. Self-Sundered is a multiplier on incoming damage, so
its cost is illegible and swingy (a 2-stack Cinder at the front eats +50% of whatever the enemy rolled).
And Sundered is Cassadora's and Severine's enemy debuff, so her identity is borrowed. §5 has the proposal.

**Cinder and Clemence weakest in team synergy.** Right, and the table in §2 says why. Cinder's currency is
party position and no other character has a card that cares where anyone stands; her Formation cards
move allies for no payoff. Clemence's currencies are healing, enemy Lust and Sanctified, and nobody else
reads them — in act-1 fights of three to four turns (P14) where healing barely matters anyway. The fix is
readers on the other characters, not more givers on these two.

**The starting deck.** Right. Measured: three defaults start at **21** cards, three alts at **15**. At five
draws a turn a 21-card deck does not complete one cycle inside an act-1 fight; the opening hand is the
fight. The excess is entirely the default outfit's "3 random cards from the drop pool", which also breaks
the starter rule ("draw, energy and 0-cost cards are deceptively strong") by lottery: a default Cinder on
seed 3 rolled Double Back, and a default Clemence can roll Fervent Prayer. Firewalk turned up in that same
starter deck with nothing to feed it. Give the default a signature like the alts and the deck is 15 always.

**"Slay the Spire's 75."** Push back on the yardstick (§1), agree with the slash. The size that matters
is offers per card per run, and it says under 20 per character.

**What I would not do.**

- Cut by the draft simulation's pick rates. It modelled the pool session 33 replaced, and its model is
  tag-driven, so a plain body scores badly by construction. Cut by the currency table instead.
- Cut the sister count. The outfits are drawn and the art exists (`../../art_pipeline/OUTFITS.md`). Move
  the sisters out of the commons and into signature + passive + A2 + two rares; do not remove them.
- Touch any number before the shape is settled. The rates document is fine; the bodies it produced are
  the problem.

---

## 4. The proposed shape

**Per character: 12 commons + 8 rares = 20** (from 32). Base 6 C + 2 R. Each alt outfit unlocked: +2 C (its
enablers), +1 R that drops in any pool once unlocked (cross-party by rule), +1 R worn-only (selfish by
rule). The six base commons carry no sister tag; they are the character's verbs and bridges. Sisters live
in the outfit's signature, passive and A2, their two rares and their two unlocked commons.

**Rarity weights 85 / 15** (elite 60 / 40; the boss's fourth slot always rare, which is B33). What that does
to offers per card per run:

| | Pool | Demo (16 offers) | Full game (≈32) |
|---|---|---|---|
| Common | 12 | 1.1 | 2.3 |
| Rare | 8 | 0.3 | 0.6 |
| Base common, three defaults (a new player) | 6 | 2.3 | — |

A new player's base pool behaves like Slay the Spire's commons; the unlocks are what make "every run one
new thing" true (`characters.md`, Never a Grind).

**The floor if a deeper cut is wanted: 8 C + 6 R = 14.** Demo 1.7 / 0.4, full game 3.4 / 0.8. The cost is
that sisters have no commons at all and the outfit carries the whole archetype. Workable, but it leans
everything on B1 and on the signatures being good.

**Neutrals.** Six cards, never offered (`neutralSlotChance: 0`), below rate (B26). Rebuild as the pure-glue
tier: about eight cards on rate that read a shared currency and want any party, offered in shops and in
the boss's fourth slot. Cheap, and it is also what keeps a duo or a solo run fed.

**Starting deck: 2 + 2 + 1 signature per character = 15, always.** `randomCardCount` goes. Each default
sister already has a name to sign with (Oath, Timing, Wounded, Lanes, Mercy, Intents).

**Art.** 196 pool cards carry `artOwed` today. This shape owes about 120 plus six default signatures; every
cut card is a prompt never written. Whether Clemence's per-card broken forms share their standing card's
art decides whether her 35 forms count double, and is worth settling before her list is cut.

**Consistency versus variety.** With a 20-card pool a committed player drafts about half of one character's
pool every run. That is the point — it is what makes a card learnable — and it moves run-to-run variety
onto party composition (twenty trios, four outfits each) and the unlock schedule, where the teambuilding
game wanted it anyway.

---

## 5. Burning: Cinder's status, and the fire thread to Clemence

**Definition.** *Burning* — a debuff, intensity. At the start of the holder's turn, lose health equal to
the stacks (Temporary HP absorbs it), then the stacks halve, rounded down.

Every rule is the opposite of Poison's, which is what keeps a second DoT off Nettle's toes
(`../../reference/MECHANICS-01.md` #92 scored Burning "too close to Poison" — as a copy it would be):

| | Poison | Burning |
|---|---|---|
| Curve | linear: 8 → 8, 7, 6, 5… (36 over 8 turns) | front-loaded: 8 → 8, 4, 2, 1 (15 over 4 turns) |
| Temporary HP | ignores it | burns through it first |
| Strategy | Grind: the clock | Burst: the damage is mostly now |
| Owner | Nettle | Cinder |

**On Cinder it is the price of recklessness and, unlike Sundered, a shared currency.** A fixed number she
can read off the bar instead of a multiplier on the enemy's roll. Health she loses feeds Severine's Blood
for Blood, Blood Rite and Leech Jar, and Brienne's Resolve. Temporary HP from Brienne, Clemence or
Cassadora is literally a fire blanket, which is the first reason any of them has had to hand Cinder gold.
Nettle's Last Rites puts her out. Ashen Cloak is the extinguish-for-tHP it already is.

**On an enemy it is a DoT the whole party can handle.** Cassadora doubles it (Malediction) and spreads it
(Spread Misfortune). Nettle's Quicken Rot and Death Knell, generalised from "Poison acts now" to "DoTs act
now", set it off. Putrefy and Catharsis count it. Contagion, generalised the same way, carries it. Fire
spreads, and the pool already has the verbs (`transferStatuses`, `spreadStatus`, `triggerStatus`).

**Pass the Flame is her verb:** her fire becomes theirs. The card is already in the pool.

What moves: Lance Thrust and Reckless Swing and Burn Bright give Burning instead of Sundered; Rush and
Beacon Flame put Burning on the enemy; Trial by Fire becomes *ALL allies gain 3 Burning and 2 Strength*,
which is a real cross-party card for the first time. Her payoffs (Recede, Ember Skin, Firewalk, Cinders to
Ash) should read Burning **stacks** so the size of the fire matters, rather than counting debuffs, which
reads 1 for any size. That gives up the "enemy Weak on Cinder also pays" angle; I would give it up for
legibility. Stride on gaining a debuff (CARD-POOL-01 §3) is unchanged: every Burning applied is a debuff
gained.

**Engine cost:** one status entry with a `tickHook` (Poison already has the shape), a `halve` decay mode
(Poison's table already names one), and a `dot` flag on the two statuses so the generalised readers can
name "any DoT" without naming both.

**The Clemence half.** Noodle did not ask for it; it is the suggestion this review makes. Two ways, and I
would build the second first:

- **A.** Her Rapture line is the second source: when she Breaks, or from the Ecstatic outfit, enemies
  catch fire. It gives the two weakest characters a shared kill track. It breaks one of her rules — no
  card of hers carries a damage effect (`MECHANICS-01` 7.2, and a test holds it) — so it is his call.
- **B.** Her healing extinguishes: *whenever Clemence heals an ally, their Burning moves to the front
  enemy* (a Devotee passive, or the Blessing rare rebuilt). No rule broken. Cinder sets herself alight,
  Clemence puts her out and the fire lands on the enemy. That is a two-character loop, which is what
  "team synergy" was missing, and it gives Clemence's healing a job in a four-turn fight.

---

## 6. The plan, in order

1. **B1: unlock routes** (run-win / shop / tree-end) and the 18 alts off `unlockedFromStart`. Small engine
   job. Then play the 12 C / 5 R base pool as it stands for one session — the cheapest test there is of
   "too big" against "too fragmented", before a card is cut.
2. **Agree the shape** (§4) and the currency table (§2) — the answers to §7.
3. **The card list, character by character**, Cinder first (Burning), then Clemence, then the four that
   work. Each surviving card gets a one-line justification against the currency table; anything that
   reads only a private meter is a rare, an outfit card, or gone. Written as `CARD-POOL-02.md` in the
   grid form of `CARD-POOL-01.md` §4, with a `From` column so nothing is rebuilt that already works.
4. **Starting decks:** six default signatures, `randomCardCount` removed.
5. **Neutrals** rebuilt as the glue tier and given a slot.
6. **Rates and numbers last**, then an All the Crunch run before and after (`../../balance_tests/`).
7. **Cut cards retire** through `honeycomb.retiredCardArray` with definitions in
   `../../Archive/RETIRED-CARDS-S6x.md`, so saves survive.

---

## 7. Questions for Noodle

1. **20 per character, or the 14 floor?** (§4)
2. **Burning as defined** — start of the holder's turn, halving, burns through Temporary HP — yes or no?
   And which Clemence half, A, B, both or neither?
3. **Default signatures:** his words, or a draft to veto?
4. **Rarity 85 / 15**, boss fourth slot always rare?
5. **Keep one reward slot per character** (recommended), or let the player pick which character's pool a
   reward draws from? The second fixes "two-thirds off-plan" at a stroke and also lets a player starve two
   characters into dead starters. Not recommended yet; named so it is a choice and not an accident.
6. **Neutrals in rewards at all**, or shops and the boss slot only?
