# Ownerless cards — BRIEF (the plan)

Written 2026-09-25 from Noodle's direction (quoted in `FEEDBACK.md`) and a read of the code, and
revised the same day on his answers to the seven questions it asked. **Nothing is built.** This is a
standing brief: the goal, the map of ownership as it is today, the target model, the steps in order
with the check each ends on, and the rules. Progress goes in `CATCH-UP.md`; his answers are in
`_archive/FEEDBACK-DONE.md`; the choices he left to the builder are `INFERENCES.md`.

| File in this folder | Holds |
|---|---|
| `BRIEF.md` | this file |
| `CATCH-UP.md` | where the build is. Update it as each step lands |
| `FEEDBACK.md` | Noodle's words; the open items (none while nothing is built) |
| `INFERENCES.md` | I1–I4, choices made without him and how to pivot each |
| `_archive/FEEDBACK-DONE.md` | D1–D7 with his answers of 2026-09-25 |

Read `../BASICS.md` first. The card pool's own workstream is `../rework/cards/`; this plan changes
where ownership lives, not what the pools contain, and it does not touch a card's numbers.

---

## 1. The goal, in one paragraph

A card's entry in the content tables says nothing about who owns it. Which characters can be offered
a card is declared on the character's side, in named pools that any character, outfit or enemy may
share. Every card instance in a run has an owner, assigned by the site that granted it at the moment
it was granted: the member whose deck it started in, the member it was rewarded to, the member who
bought it, the member an event handed it to, the fighter who created it mid-fight. At play time the
owner is the only answer to "who is casting this", and everything that used to be looked up through
the card's entry (the Broken form, the pose hold, the owner-down policy, the transform pool) is looked
up through the owner instead. Behaviour changes in exactly one place on purpose: a card that has no
owner today gets one, which is the bug Noodle reported.

## 2. Why now, in Noodle's words

> I do think cards should have owners, but that the owner of a card is not inherent to the card's entry
> in our game files. Brienne still needs to own sword strike in her game, my issue was inherently tying
> that owner and card together, since that will make enemy design much harder, and already has bugs
> in-game right now, since buying a neutral card can make a broken character attack.

The bug is real and its path is §3.3. Enemy design is harder because a card can serve only the entry
it names: six queen moves are already shared by two enemies each and get away with it only because
enemy move lists happen to sit on the enemy's side already (§3.4).

---

## 3. Ownership as it is today

Read from the code on 2026-09-25. File keys: `STATE` `honeycomb-state.js`, `ENT`
`honeycomb-entities.js`, `EFF` `honeycomb-effects.js`, `CMB` `honeycomb-combat.js`, `CARDS`
`honeycomb-content-cards.js`, `CHARS` `honeycomb-content-characters.js`, `ENEM`
`honeycomb-content-enemies.js`, `PROG` `honeycomb-progression.js`, `MAP` `honeycomb-overlays-map.js`,
`VIC` `honeycomb-overlays-combat.js`, `LAB` `honeycomb-overlays-lab.js`, `UI` `honeycomb-ui.js`,
`ART` `honeycomb-art.js`, `WARN` `honeycomb-warnings.js`, `TU` `honeycomb-tuning.js`.

### 3.1 The field on the entry

`honeycomb.cardArray` holds 517 definitions at runtime (354 in CARDS, 163 pushed from
`honeycomb.enemyCardArray` at ENEM:1555–1557). Of those:

| `characterIndex` | cards | of which starter / common / rare / broken |
|---|---|---|
| `brienne` | 41 | 5 / 20 / 12 / 4 |
| `nettle` | 42 | 6 / 21 / 11 / 4 |
| `severine` | 41 | 5 / 21 / 11 / 4 |
| `cassadora` | 41 | 5 / 21 / 11 / 4 |
| `cinder` | 41 | 5 / 21 / 11 / 4 |
| `clemence` | 72 | 5 / 21 / 11 / 35 |
| `anastasia` | 25 | 2 / 13 / 7 / 3 |
| the literal string `"neutral"` | 11 | 5 common, 1 rare, 4 special, 1 enemy |
| none | 203 | every enemy move, each carrying `enemyIndex` and `rarity: "enemy"` instead |

`archetypeArray` rows (CARDS:496–542) also carry a `characterIndex`; they are character-side data
and stay. No card carries `owner`, `pool`, or `ownerDownPolicy`.

### 3.2 Every pool is a scan of the card table by that field

Nothing on the character side lists its draftable cards. A character has `startingCardArray`
(two cards, two copies each), outfits add one signature card each through `cardAdditionArray`, two
tree nodes per character add a card, one equipment replaces one (`duelistBlade`) and one adds one
(`thiefGloves`, a neutral card). Everything else is a scan of `cardArray` for
`card.characterIndex == …`:

| Read site | What it decides |
|---|---|
| `rewardPoolFor` CMB:1683; the neutral fallback `rewardPoolForParty` CMB:1770–1779; guarantees CMB:1585 | which cards a member is offered after a fight |
| `shop.rollStock` MAP:1212–1220 | what the shop stocks |
| `startingCardPoolArray` STATE:1104, `rollRandomReplaceArray` STATE:1149 | the three random starting cards |
| `characterCardPoolArray` ENT:3325, 3348 | the pool Fortune Telling and Gamble transform into |
| `obtainableCardArray` PROG:426 | the compendium, the party window, the character-cards window |
| `discovery.isSealed` PROG:403 | hiding an in-development character's cards |
| `archetypeBlockedForParty` CMB:1747, `cardOfferableForParty` CMB:1762 | whose loadout and `offerCondition` gate an offer |
| `defaultOwnerFor` ENT:3275–3286 | who owns a card the granting site did not assign |
| `cardShiftLabel` CARDS:10135 | a stand-in actor for a preview |
| `cardClassGlyphPath` UI:1446–1448, `cardOwnerFaceShare` UI:1460–1463 | the class glyph and the face on a card with no owner |
| LAB:315, 321–322, 335–339 | the Battle Lab's filter, sort and ⚠ |
| `characterInDevelopment` WARN:107, `duplicateCardRules` WARN:320 | two content rules |
| `brokenFormIndexFor` CARDS:9903–9913 | which Broken form a card becomes (§3.3) |
| `ownerDownPolicyFor` ENT:1024–1031 | the policy when an owner is down (set on nothing today) |
| `presentationFor` ART:192–194 | `poseHoldMs`, through the card's character (Anastasia only) |

### 3.3 The bug, traced

1. The shop stocks neutral cards (MAP:1212, 1220), Hedge Your Bet among them: a rare aimed at
   `owner` whose Commit deals 11 damage.
2. `shop.buyCard` calls `addCardToRunDeck(slot.index, null)` (MAP:1686); `defaultOwnerFor` finds no
   party member whose `characterIndex` is `"neutral"`, so the instance's owner is null.
3. In a fight, `resolveCard` asks `brokenCardIndexFor(definition, cardOwnerMember(instance))`
   (CARDS:9961), which returns null for a null owner (9916), so the card is never swapped for a
   Broken form. It would not be even with an owner: `brokenFormIndexFor` looks the form up through
   the DEFINITION's character (9906), and no character is called neutral.
4. `cardPlayability` accepts an ownerless card (ENT:1081); nothing checks Broken for cards.
5. `cardActingEntity` (ENT:1042–1061) has no owner and falls to `tuning.deck.ownerlessFallback`,
   which is `"frontAlly"` (TU:2850). `frontAlly` returns the first living member, and characters
   break rather than go down, so a Broken member qualifies.
6. That member is logged as the source, animated performing the card, moved by the party shift, and
   their hooks shape its damage.

The same leak reaches the deck through every other site that lets an owner be null: neutral reward
offers (VIC:229, shown as "Anyone", 215–221), neutral cards from map events (`addCardToDeck`,
EFF:2612; no event names an owner), curses and Wisps created mid-fight (`addCardToPile`, CMB:1030),
the banished-card fallback (ENT:3201–3205, owner forced null), and thrown cards (`throwRandomCards`
resolves the raw definition with no owner, EFF:2389). Two more never transform even with an owner,
because the form is keyed to the definition: stolen enemy moves (owned by the thief) and Thief's
Gloves' neutral card.

### 3.4 What already works the way the goal wants

- **An instance carries its owner.** `newCardInstance(cardIndex, ownerInstanceId)` (STATE:1524);
  the starting deck mints every card with the member whose pool listed it (`memberCardPool`,
  STATE:1078–1092) and never consults the card's entry.
- **The owner lookup knows both teams.** `cardOwnerMember` (ENT:91–102) searches the party and then
  the enemy line, so a move an enemy plays is owned by that enemy and its self-effects land on it.
- **Enemy move lists are already owner-side.** An enemy's `moveArray` names cards (ENEM:2075); six
  queen moves are shared by two enemies each; an AI-controlled character builds its moves from its
  own deck (`aiMoveArray`, ENEM:1605–1622). `moveCard` (ENEM:1832–1859) resolves ANY card index for
  an entity and marks the view with that entity as owner.
- **Saves already hold owners.** `run.deckArray` instances persist `ownerInstanceId`, party
  `instanceId`s are saved, and no migration has ever touched either (STATE:1906–2209). There is no
  profile-level per-character card list; `discoveryArray.card` is flat.
- **The UI mostly reads the instance.** The affinity pip, the tooltip footer, the deck screen's
  filter, the reward and event labels all read `ownerInstanceId`; the teambuilding preview passes a
  `previewCharacterIndex` and never reads the card's field.

### 3.5 Loose ends the census found

- `nettleStrike` is a starter-rarity Nettle card that no starting deck, outfit or node names.
- `gloomWispFade`, `alchemistDraught` and `sentinelRetort` are enemy moves in no move list.
- `ownerDownPolicy` is documented on cards and characters and set on none; characters never go down
  (they break), so the policies almost never apply to a party card.
- `tuning.deck.ownerlessFallback` documents a `"randomAlly"` value the code has no case for.
- `giveStolenCard`'s persist path (ENEM:1942) re-mints the card without `userSide`, `exhausts` or
  `artEnemyIndex`.
- `hexBefuddled` is `rarity: "enemy"` with `characterIndex: "neutral"` and no `enemyIndex`.
- `honeycomb.cardOwnerEntity` (ENT:78–83) has no callers.

---

## 4. The target model

### 4.1 Pools are a content table

A new content file, honeycomb-content-pools.js, loaded after the card tables:

```
honeycomb.cardPoolArray = [
  { index: "brienne",  cardArray: [ "brienneCleave", "brienneGrit", … ] },   // every card that carries characterIndex brienne today, file order
  { index: "nettle",   cardArray: [ … ] },
  …
  { index: "neutral",  cardArray: [ "neutralFocus", … ] },
];
```

A character names its pools with `poolArray` (`["brienne"]`); a character that names none is read
as naming the pool that shares its index, so the seven entries need no edit to start. The pools every
party draws from sit in `tuning.deck.sharedPoolArray` (`["neutral"]`). Outfit additions, node
additions and equipment additions stay exactly where they are; they are already owner-side lists.
Rarity, cost, `offerCondition`, `archetype` and `brokenCard` stay on the card, because they describe
the card, not who holds it.

Helpers, all in a content-side file the suite loads: `honeycomb.poolCardArray(poolIndex)`,
`honeycomb.characterPoolCardArray(characterIndex)` (the union of the character's pools),
`honeycomb.cardPoolIndexArray(cardIndex)` (which pools list a card, built once at boot), and
`honeycomb.cardIsShared(cardIndex)` (listed by a shared pool).

**The generated pools reproduce today's scans exactly**, card for card, and a check proves it
before any reader changes (Step 1). Splitting a character's pool into finer pools is then a table
edit. **A card in two character pools is a warning**, not an error (Noodle, D5: *"not a single card
in the entire pool should be shared between two player characters"*, and *"not an absolute hard
rule"*): the rule `cardInTwoCharacterPools` reports it, and a deliberate exception is listed in
`tuning.warnings.ignoredArray`, where it stays visible. The neutral pool is shared by design and is
outside the rule.

### 4.2 Every granting site names the owner

`addCardToRunDeck(cardIndex, ownerInstanceId)` and `addCardToPile(cardIndex, pileIndex, context,
ownerInstanceId)` refuse a null owner: they throw in the suite and log a warning in the game, and
`defaultOwnerFor` is deleted along with `tuning.deck.assignOwnerFromCharacter`. Each site decides:

| Site | Owner |
|---|---|
| Run start (`memberCardPool`) | the member whose entry list produced the card (unchanged) |
| Card reward (`rollCardReward`) and shop (`buyCard`) | **the card is dragged onto the member who takes it.** Taking a reward and buying from the shelf are one gesture: the card face is picked up and dropped on a member's portrait in a popup of the party, on the machinery a card is aimed with in combat (pointer capture, legal marks, tap then tap on touch); no window ever asks. The legal targets are the member whose pool the card came from, or every member for a shared-pool card (`tuning.deck.crossOwnerAcquisition`, `INFERENCES.md` I2, widens it); the drop is the purchase or the take. Offer rows and stock rows carry the pool they came from so the targets can be marked |
| Map event (`addCardToDeck`) | the entry's `owner` field: `"subject"` (the event's subject or leader, the default when the event has one), `"front"`, `"choose"`, or a member; curses included (`INFERENCES.md` I1) |
| Mid-fight (`addCardToPile` effect, `nettleBroken`, enemy curse adds) | `honeycomb.ownerForCreatedCard(context, entry)`: the entry's `owner`, else the effect's target if a party member, else its source if a party member, else the front member. A Wisp an enemy slips into the party's discard is owned by the member it was aimed at |
| Stolen move (`giveStolenCard`) | the thief (unchanged); the persist path keeps `userSide`, `exhausts` and `artEnemyIndex` |
| Duplication, transform, removal logs | the original's owner (unchanged, and never null once the above holds) |
| Banished-card fallback | the banished card's owner, not null |
| Thrown cards (`throwRandomCards`) | an owner view built the way `moveCard` builds one, so the thrower is the owner |
| Abilities wrapped as cards | the member (unchanged) |

**Save migration.** Format 11: on load, every instance in `run.deckArray` and
`combat.temporaryCardArray` with a null owner gets one, through `honeycomb.legacyCardOwnerMap`
(card index → the character it named before this change, generated by the migration tool and kept
only for this step): that member if present, else the front member (confirmed, D7). `save.afterLoad`
already exists as the seam.

### 4.3 At play time, the owner is the only answer

`cardActingEntity(card, combat)` returns the owner entity when it can act, null when its owner-down
policy says so, and never anything else. `tuning.deck.ownerlessFallback` and its switch are deleted.
The `owner` target mode keeps its fall-through to `context.source` (EFF:1239), which is what a thrown
card or a raw definition in a preview resolves to. The forecast dry-runs the same function and needs
no change of its own. The trap on `../reference/TRAPS.md` holds: this function is called while the
hand renders and draws no randomness.

### 4.4 Everything the entry used to answer, the owner answers

| Question | Today | After |
|---|---|---|
| Which Broken form? | `brokenFormIndexFor(definition)`: the card's `brokenCard`, then the DEFINITION's character | `brokenFormIndexFor(definition, ownerCharacter)`: the card's `brokenCard`, then the OWNER's `brokenCardByRarity[rarity]`, then the OWNER's `brokenCard`. **The order is what keeps Clemence whole (D3):** a card's own form is tier one and every one of her cards names its own, so her alt deck is untouched; the owner's rows are read only for a card with no form of its own, a neutral card or a stolen move. The general case Noodle wants, *"one broken card design per rarity"* per character with per-card forms as the exception, is exactly this order; what the content lacks is the per-rarity rows themselves (only Anastasia has them, the other six have one catch-all), which is card-pool work outside this plan. An enemy owner has no character and its cards never break, as today |
| Which owner-down policy? | the definition's character | the owner's character, then tuning |
| How long is the pose held? | `card.characterIndex` → `poseHoldMs` | the wielder's definition (character or enemy), which is what a pose hold is |
| What does Fortune Telling transform into? | the definition's character's pool | the owner's pools |
| Whose loadout gates an offer? | the card's character | the member the offer row names |
| What glyph and face does a card show outside a run? | the card's character | the `previewCharacterIndex` the screen passes; the compendium and the Battle Lab iterate per pool and pass it; a card shown with no context shows no face |
| Is this an enemy move? | `card.enemyIndex` (`cardNaturalSide`, CARDS:307; discovery, PROG:152) | `rarity: "enemy"`, which all 203 moves and `hexBefuddled` already carry |

`art.summonableEnemyArray` (ART:491–509) also reads `card.enemyIndex`; the builder reads what it
lists before Step 5 and derives it from the enemy tables instead.

### 4.5 Enemies

Nothing changes in Step 1–5 except that move cards lose `enemyIndex`. A move list stays the
enemy-side declaration it already is. **Later** (Step 6, the builder's choice on D6,
`INFERENCES.md` I3): a move-list entry may name a pool instead of a card
(`{ pool: "sporeBasics", weight: 30 }`), expanded at pick time, so two enemies share a pool of moves
by naming it, and a character's card can sit in an enemy's pool.

### 4.6 What this plan does not do

It does not change which cards a character is offered, a card's rarity or numbers, the Anastasia
gate, the neutral pool's contents (`../rework/cards/` B26), the unlock routes (B1), or the Quality
Lab. The Quality Lab's `BRIEF.md` P0 is a strict subset of Step 3 and Step 4; whichever lands first
carries it.

---

## 5. Rules for the builder

1. **Every number is in tuning.** `tuning.deck.sharedPoolArray`, `crossOwnerAcquisition` and the
   save format version are the new ones.
2. **Content is data.** A pool is a table row; a character's pools are a field; the granting site's
   choice of owner is a field on the effect entry or a tuning rule. No engine code decides who a
   card belongs to.
3. **Never edit the content tables with a greedy regex.** Step 5 strips fields with a tool that
   locates each card by its `index:` line and slices that entry alone, then re-runs the suite.
4. **`honeycomb.findDefinition` returns the first match.** The pool file must not re-register a card.
5. **Pools are rebuilt, never patched** (`../reference/TRAPS.md`). Readers call the helpers on every
   read; nothing caches a resolved pool on a member.
6. **`cardActingEntity` draws no randomness.** A `"randomAlly"` rule belongs at the granting site, not
   at play time.
7. **A null owner is a bug, not a case.** After Step 3 it throws in the suite and warns in the game.
8. **Behaviour-preserving until Step 3.** Steps 1 and 2 must give byte-identical results for a run
   start, a reward roll, a shop roll, a transform and a compendium listing, against fixtures recorded
   before Step 2.
9. **Each step ends in checks in a new numbered block at the end of `../tools/test-honeycomb.js`**,
   and each check is made to fail before it is recorded as passing.
10. **Comments are lean and quote nobody.** His words are in `FEEDBACK.md`.
11. **Stop and ask Noodle** before: changing which cards any character is offered; changing a
    rarity; touching the Anastasia gate; anything that changes what a player sees in the compendium.
    The four orphans are his to delete and he said delete (D4); that is not a question.
12. **The drag is the only selection.** Taking a reward and buying a card never open a window that
    asks who; the card is dropped on the member. Build it on the combat aim machinery rather than a
    second drag (`INFERENCES.md` I4), because he asked for selections to be standardised, not
    multiplied.

---

## 6. Steps, in order, with the check each ends on

**Step 1 — Generate the pools, change no reader.** A tool, migrate-card-owners.js in a new
`ownerless` folder under `../tools/`: loads the engine headlessly, writes honeycomb-content-pools.js
(one pool per character in file order, plus `neutral`) and a loader line, writes
`legacyCardOwnerMap`, and with `--check` proves every `characterPoolCardArray(c)` equals the scan of
`cardArray` by `characterIndex` for every character and for neutral. Checks: that equality; every
card is in exactly one pool or is an enemy move or the fallback card; the four orphans are listed by
name (§3.5) and nothing else is.

**Step 2 — Point every reader at the pools.** The fourteen sites in §3.2 that decide a pool or a
face, plus the two warning rules and the Battle Lab picker. Checks: the existing blocks [36], [56],
[71], [77], [102], [114] and [121] pass unchanged; the fixtures of rule 8 are byte-identical.

**Step 3 — Every granting site names an owner.** §4.2 in full: offer rows, the shelf, the event
field, `ownerForCreatedCard`, the banish fallback, the throw view, the stolen-card persist fields;
`defaultOwnerFor`, `assignOwnerFromCharacter` and `ownerlessFallback` deleted; `cardActingEntity`
owner-only; save format 11 with the fill on load; the drag onto a member's portrait as the take and
the purchase, with the legal members marked and the shelf's old buy press gone. Checks: the drop on a
legal member takes or buys and the drop elsewhere does nothing, on mouse and by tap-then-tap; a
character's card cannot be dropped on another member while `crossOwnerAcquisition` is off and can
when it is on; after each of a run start, a reward take (a shared-pool card included), a shop purchase of a
neutral card, an event's curse, a mid-fight Wisp, a steal and its persist, a duplicate, a banish and a
format-10 save load, every instance has an owner; the forecast and the play path agree on the actor
for every card in a party's deck; `cardActingEntity` never returns anyone but the owner.

**Step 4 — The owner answers what the entry answered.** §4.4: Broken form, owner-down policy, pose
hold, transform pool, offer gating. Checks: **the reported bug's regression**, a Broken Brienne who
bought Hedge Your Bet plays Brienne's catch-all form, and a Broken Cassadora's stolen move transforms
too; every one of Clemence's cards still breaks into its own named form; Anastasia's by-rarity forms
still apply to her own cards; a neutral card owned by a Broken member with per-rarity rows takes the
row for its rarity and one owned by a member without them takes the catch-all; any card in
`cardArray` played by any party member and by any enemy
resolves without error, without touching the party's hand or energy from an enemy source, and with
every self-effect landing on the wielder (this is the Quality Lab's P0 block, written once).

**Step 5 — Take the fields off the entries.** The tool's `--strip` removes `characterIndex` and
`enemyIndex` from every card entry by index-anchored slicing; `cardNaturalSide` and the discovery
exclusion read rarity; `summonableEnemyArray` reads the enemy tables; `cardShiftLabel` reads the
preview character; the four orphans deleted (`nettleStrike`, `gloomWispFade`, `alchemistDraught`,
`sentinelRetort`; D4); four warning rules added as table rows: `cardOwnerField` (an entry carrying
either field), `cardInNoPool` (a non-enemy, non-fallback card in no pool), `enemyMoveUnlisted` (an
enemy move in no move list, phase list or throw list), `cardInTwoCharacterPools` (§4.1, a
preference rather than a law, so its exceptions go in `ignoredArray`); tools repointed: `card-inventory.js:104`,
`card-prompts.js:273, 313`, `_dup.js:6, 14`, `draft-sim/draft-simulation.js:287, 468, 577`; docs:
the file map in `../reference/ARCHITECTURE.md`, and a note in `../rework/cards/CATCH-UP.md` that
pools are a table now. Checks: a grep of the cards file for `characterIndex` finds only the 24
archetype rows; the enemies file has no `enemyIndex` on a card; the warning report is unchanged;
suite green; `honeycomb.warnings.report()` lists the four new rules and none of them fires.

**Step 6 — Later** (`INFERENCES.md` I3), when the Quality Lab's picker is built or an enemy design
first wants a shared pool. Pools in enemy move lists; a shared enemy pool; a character's card in an
enemy pool; the Quality Lab's picker listing by pool.

Steps 1 and 2 are one session. Step 3 is one session and is the one that changes what a player sees:
it removes "Anyone" from the reward screen and puts a portrait row on the shelf. Step 4 is half a
session. Step 5 is one session, most of it the suite. Nothing in Steps 1–4 requires Step 5, so the
fields can stay on the entries, unread, until the sweep is convenient; the warning rule is what stops
a new card from carrying one.

---

## 7. Risks

- **The neutral pool's identity.** Today neutral cards are the only ones dealt to nobody. After
  Step 3 they are dealt to someone, and a Broken owner's neutral card transforms. That is the fix and
  also a play change: a neutral card is no longer a way for a Broken party to keep attacking. Noodle
  named this as the bug, so it is intended.
- **Owner-down policies stay near-dead.** Characters break instead of going down, so the policy
  path is exercised only by summoned allies and party-side pieces. It is kept, moved to the owner's
  character, and left otherwise alone.
- **A card in two character pools.** Nothing prevents it after Step 1 and Noodle does not want it
  for player characters; `cardInTwoCharacterPools` reports it and the compendium lists such a card
  under each pool until it is resolved.
- **Tools that read the field will break loudly, not quietly**, because the tool strips the field and
  the suite loads the content; the four tools named in Step 5 are the census's complete list.
