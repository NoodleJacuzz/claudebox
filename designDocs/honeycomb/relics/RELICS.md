# Relic & equipment rework — `relics/`

What a character starts with and what she earns: starting decks, outfits and the routes that unlock
them, relics and heirlooms, and the progression trees that hand them out (the old `rework/starters/`
and `rework/progression/`). Noodle's pipeline **Relic & equipment rework**.

**How this file works.** One file per pipeline: where the work is, the rules, then the queue in Noodle's
words. When an item closes, cut its `###` section and paste it at the top of `ARCHIVE.md` beside this
file, the same minute. `../FEEDBACK.md` indexes the count. Quotes are his, verbatim, and win over any
annotation. Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted.

---

## Where it stands

- **Starters and outfits.** The twelve basics went live in session 25; 18 alt outfits exist, every one
  `unlockedFromStart`, so nothing gates the cards they carry. **B1, the unlock routes, is the load-bearing
  item of two pipelines**: the card pool's whole shape assumes the alts are gated, and it is the pool's
  first engine job (`../card_pool/CARD-POOL-02.md` §5). Alt outfits are recoloured copies of the default's
  pictures until the art pipeline draws them.
- **Relics.** Uncommon was retired in session 55d (16 common, 9 rare) and **reopened by Noodle in
  session 65**: `RELIC-REWORK-01.md` is the brief. Measured, rarity is a price tag (every roll is a
  uniform pick, so 37% of drops are rares and a given relic turns up in a quarter of a trio's runs); a job
  per tier, agreed by him the same day, the live 36 re-filed and his 29 ideas read (S65-1); verdicts on
  individual relics wait for the desktop grids. B22, answered session 39
  and not built: replace Crimson Fang, Votive Candle and Bone Necklace (free per-fight healing undercuts
  the campfire), and cut starting relics so relics become unlockable. `RELIC-REWARDS.md` lists every
  relic, where it can come from, and the gap: no relic grants a reroll or a banish except through a tree
  node. The Dominion Rod and the Lucky Hat (session 55) are the first two that do.
- **Progression.** 256 of 256 nodes wired, `../tools/audit-trees.js` green, Fortitude free on every tree
  and total (no weakness, no Lust Events). Open: deck-customization pricing (B23) and distributing
  unlockables through the game (B4), which is where B22's relics go. **`../tools/generate-progression-trees.js`
  is stale and reverts hand edits; never run it.**

## Files

| File | Holds |
|---|---|
| `RELICS.md` | this file |
| `STARTER-REWORK-01.md` | **the brief**: Noodle's quotes verbatim on starters, outfits, relics and the progression levers. It wins over any list below it |
| `RELIC-REWORK-01.md` | **the brief for B22**, session 65: Noodle's rarity message verbatim, what rarity does today (measured), a job per tier, sizing, the live 36 re-filed, engine asks, his eight decisions. Nothing built |
| `STARTER-LIST.md` | the live working design of the starting decks, kept lean by instruction |
| `OUTFITS-LIST.md` | all 18 outfit signatures, one line each; outranks `../reference/MECHANICS-01.md` on identity |
| `RELICS-LIST.md` | common relics and heirlooms |
| `RELIC-REWARDS.md` | every relic, its sources, the reroll/banish gap, and a menu of unnamed ideas |
| `TREE-DESIGN.md` | the standing spec for a progression tree's shape, the rules `../tools/audit-trees.js` checks |
| `ARCHIVE.md` | closed items from this file |
| `../Archive/demo1/rework/starters/`, `../Archive/demo1/rework/progression/` | what the session-25 decks replaced, the tree design's working documents (wiring status, topology, EXP maths, skeleton mapping), the old catch-ups, closed items |
| `../Archive/demo1/rework/AUDIT-01.md` | the session-30 audit's board. Its one unanswered line, the Jinx name clash, is a naming question for him |

Live content: `scripts/misc/honeycomb/honeycomb-content-characters.js` (outfits, equipment,
`progressionTree.nodeArray`), the relic tables in the content files, `honeycomb-progression.js`.

```
node "!designDocs/honeycomb/tools/audit-trees.js"           the trees against TREE-DESIGN.md's hard rules
node "!designDocs/honeycomb/tools/progression-dump.js"      every node, expanded
node "!designDocs/honeycomb/tools/progression-sims.js"      character mechanics driven through real fights
node "!designDocs/honeycomb/tools/exp-model.js"             the EXP curve
node "!designDocs/honeycomb/tools/relic-census.js"          every relic by rarity, pool and gate; relic and gold income a run
```

## Rules this pipeline must not break

- **Outfits and equipment share one modifier shape** (`healthModifier`, `cardAdditionArray`, `cardReplacementArray`, `hooks`) and reach the deck through one seam, `honeycomb.memberCardEntryArray`.
- **The roster order is fixed** (B19): Brienne, Nettle, Severine, Cassadora, Cinder, Clemence. Brienne is the game's face; Cassadora is always fourth.
- **Anastasia stays invisible** until she ships: every screen that lists or counts characters asks `honeycomb.shippedCharacterArray()`.
- **Fortitude means no weakness and no Lust Events at all**, and it is free from the start.
- **Prices are tuning or named node fields.** Thinning a deck is priced like a payoff; padding it like a convenience (B23).
- **Never run `generate-progression-trees.js`.** Edit the trees by hand; `--report` only prints.
- **A rest refreshes abilities on arrival**, for everyone; Clemence's A1 is once per rest.

---

## The queue

### A5. Free per-fight healing against the campfire — ANSWERED (session 39) ☐ → B22

> The most overpowered Spire relics are included in base kits (healing after battle…) which makes
> resting at campfire useless.

> Mark crimson fang, votive candle, and bone necklace as relics to replace in the relic rework.

Confirmed, and widened: **`boneNecklace` joins the list**, which session 38 had not flagged. These three
are marked for replacement rather than tuning — see **B22**, which also carries his much larger call
that starting relics should not exist at all.

---

### B19. Character order ☐

> Character order. The order should -always- be two groups of three. The "simple" starter trio as the
> first three characters in the roster, Brienne (first char, basically the mc and game's face), Nettle,
> and Severine. Then the "complex" trio, Cassadora (always 4th, because her mechanics show players
> instantly this isn't just a slay the spire clone), Cinder, and Clemence. I do find it a little
> troublesome that the simple characters are so simple, but only more testing can answer what we need.

Fixed order, everywhere a roster is rendered:

| 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|
| Brienne | Nettle | Severine | Cassadora | Cinder | Clemence |

The two constraints that carry reasons and must not be quietly reordered: **Brienne is first** as the
game's face, and **Cassadora is always fourth** because she is the first character who demonstrates the
game is not a Slay the Spire clone. Position 4 is doing pedagogical work — it is the first pick after
the simple trio.

This should be a single ordered source the roster, teambuilding and compendium all read, not three
hand-ordered lists. **VERIFY** whether one already exists.

His open worry — the simple characters being too simple — is deliberately left unanswered: *"only more
testing can answer what we need."* Do not act on it.

---

### S65-1. Relic rarity: what each tier is for ◐ — FILED 2026-09-25; brief drafted and his answers filed the same day

> We depreciated the uncommon rarity because it had no mechanical difference between it and rare to keep
> the game lean, but the numbers don't lie:
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

`RELIC-REWORK-01.md` is the answer, for his veto. Measured first (§1): rarity's only effect on a relic
today is its shop price, every roll is a uniform pick, 4.3 relics are given a run, and a trio's pool is
15 or 16, so rares are 37% of drops and a given relic turns up in a quarter of runs. Then a job per tier
(§2): common persists as the collection, uncommon is the gated engine part, rare the swing; boss, shop
and event are sources, never rolled; special and starter are not imported. Sized at ≈ 75 (§3), the live
36 re-filed (§4), nine engine asks (§5), eight questions (§6). **The design gap is the boss tier.** Comes
before B22, which it shapes. Later the same morning he drafted 29 relic ideas in four lists (boss Energy
bargains, build-arounds, mechanical shake-ups, EXTREME shake-ups): filed verbatim in §7 and read against
the model in §8, where they close most of the boss gap. His answers to the brief's eight questions are in
its §6, verbatim: commons persist; one table, *equipment* is a flavour name for a relic taken at the start,
and explicit ownership lives only where a member can be chosen (the equipment menu, an event's pick); the
boss tier is on the gate and the act 1-2 boss pays no relic until act 2 exists; the weights stand; safe pool
first, his lists second; verdicts on individual relics wait for the desktop grids (`../BASICS.md`, design
review). His MUST: demo 2 moves past common and rare.

---

### B22. Relic rework ☐

From A5, plus a much larger call:

> Mark crimson fang, votive candle, and bone necklace as relics to replace in the relic rework.

> Three starting relics for a party of three is way too many. Characters probably shouldn't start with
> ones either, they should be unlockable.

Two changes:

1. **Mark for replacement:** `crimsonFang`, `votiveCandle`, `boneNecklace`. Replace, do not tune — the
   measured problem (A5) is that free per-fight healing makes the campfire pointless, and the campfire
   is also where removal and upgrades live, so it is the most contested node in the run.
2. **Cut starting relics.** Three for a party of three is too many, and his lean is that characters
   should start with **none** — relics become unlockable instead.

Point 2 routes straight into **B4** (distribute unlockables through the game): relics joining the
unlockable pool is more content for a seam that already exists and has no authored nodes. Do them
together.

---

### B1. Unlock routes ☐

Verified session 38 on a fresh profile: **all 25 outfits report unlocked**, including every alt. Since
each alt outfit carries 3 commons and 2 rares, the whole 21 C / 11 R pool per character drops from the
first reward screen, which is exactly what the pool was sized *not* to do. The seam is there —
`honeycomb.unlocks.isUnlocked("outfit", …)`, `offerCondition: { index: "outfitUnlocked" }` on the gated
cards, and `unlockOutfit` on a tree node — so this is authoring which routes open which outfit, not
engine work.

---

### B23. Early deck-customization pricing ☐

> Early deck customization is more dangerous than I realized. Remove attack and remove defense need to
> be expensive nodes, extra attack and extra defense though can be very cheap.

| Node | Price |
|---|---|
| Remove attack | expensive |
| Remove defense | expensive |
| Extra attack | very cheap |
| Extra defense | very cheap |

The asymmetry is the point: **thinning a deck is far stronger than padding it**, so subtraction gets
priced like a payoff and addition gets priced like a convenience. This is progression-tree pricing and
lands in the same pass as B4. Prices are numbers — `honeycomb-tuning.js` or a named field on the node's
content-table entry, per the standing rule.

**VERIFY** that these four node types exist as distinct authored nodes rather than as one generic
deck-edit node.

---

### B4. Distribute unlockables through the game ☐

`progressionArray` with global/personal pools, ranked/exclusive nodes and `unlockOutfit` is the seam.
What is missing is authored nodes naming cards, outfits, equipment and relics. Overlaps B1, and now
carries **B22's relics** and **B23's repricing**.

---

## Unsorted — drop new reports for this pipeline here

*(a report that does not clearly belong to this pipeline goes in `../FEEDBACK.md` instead)*
