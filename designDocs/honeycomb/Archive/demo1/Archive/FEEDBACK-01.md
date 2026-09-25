# Honeycomb — Feedback round 01 (2026-09-09, post-MVP)

Noodle's review of the first playable MVP. **Their words are quoted verbatim.** The annotation under
each is the interpretation and the plan — if an annotation and a quote ever disagree, the quote wins.

Framing they gave for the whole round:

> Hopefully none of these feel nitpicky, overall you have some solid bones here, I'm trying to keep in
> mind the most important thing at this stage is not shut windows of opportunity with hardcoded things
> we'll need to work around in the future.

**That sentence sets the priority order below.** Anything that would be expensive to retrofit ranks
above anything that is merely unfinished. A rough-looking screen is fine; a hardcoded assumption is
not.

Status key: ☐ not started · ◐ in progress · ☑ done

---

## ALL 21 ITEMS ARE DONE. (2026-09-10)

P0, P1 and P2, complete and verified in a browser. A polish round followed; see `POLISH-01.md`.

The framing at the top of this round — "not shut windows of opportunity with hardcoded things we'll
need to work around" — is what shaped every answer, so the short version is what is now OPEN that was
not:

| Was closed | Is now |
|---|---|
| Cards could only target entities | Target modes carry a KIND. A card-targeting card cannot reach a character |
| Effects could not stop and ask | Any effect at any depth can ask the player a question and continue |
| Non-card actions were potions | Abilities belong to a character, with their own charges and sub-menu |
| Nothing could describe itself | Free-form tags on every content table, readable by conditions |
| One random target | X random targets, distinct or repeating, counts as expressions |
| No summoning | Enemies summon enemies; anything can summon a CONTROLLABLE ally |
| Fights were one size | Enemy health, damage, count and gold scale with party size |
| A dead character's cards were inert | A registry of policies, including a playable ghost |
| Progression was a flat list | A branching, respeccable tree that outfits reshape |
| A lost run left nothing | A shared experience pool that pays more for things never seen |
| The map was a grid | Layout is a strategy. A region can be hand-placed over a painting |
| Events were a small box | Full-screen scenes with a speaker, and rest is now just an event |

Four things were also DELETED rather than added, which is worth stating: the potion resource, the
bespoke rest overlay, the enemy mirroring hack, and the combat portrait rail. Each had been doing a
job something better now does.

**The open question is the demo scope.** See the end of this document.

---

## P0 — Blocking. Noodle cannot test until these are fixed.  **[ BOTH FIXED ]**

### 1. Stuck mid-battle, unrecoverable ☑ FIXED

> I'm unfamiliar with the dev environment so I don't know how to clear savedata among other things.
> Somehow, I got my desktop test environment stuck by refreshing mid-battle. No cards on screen, end
> turn does nothing, no useful error messages. Refreshing doesn't get me out of the pickle, and
> there's no way to leave the battle or return to the honeycomb title to test other parts.

Diagnosis to confirm: a refresh mid-combat resumes into `phase: "endingPlayerTurn"` or `"enemyTurn"` —
a phase the scene has no input path out of. `resumeScene()` sends any non-victory/defeat combat to the
combat scene, but only `playerTurn` accepts input, so the board is live and inert. The hand is empty
because `discardHandOnTurnEnd` already ran before the save.

Needs: phase repair on load, a hard "abandon run" escape, and a save wipe that does not require a
console.

**Fixed.** Root cause confirmed by reproduction: the autosave fired inside `endPlayerTurn()`, while
`phase` was the transitional `"endingPlayerTurn"` and the hand had already been discarded. Reloading
restored exactly that — a board that refuses every action, with no cards.

Three layers of fix:
1. **Combat phases are now classified.** `tuning.combat.stablePhaseArray` lists the phases that accept
   input or are endings. `honeycomb.save.write` REFUSES to write any other, so the bad state can no
   longer reach a save file.
2. **The autosave moved** off `endPlayerTurn` and onto the start of the player turn — the only moment
   in a fight where the hand is dealt, intents are telegraphed and input is accepted.
3. **`honeycomb.combat.repair()` runs on every load.** Any combat found in a transitional phase is
   rolled forward to a fresh player turn. **Noodle's existing broken save repairs itself on load — no
   action needed on their end.** It may skip the remainder of one interrupted enemy turn, which is a
   deliberate trade against bricking a run.

Save wiping is now a button (Debug Tools → Wipe all Honeycomb saves), plus `honeycomb.save.wipeAll()`
and `honeycomb.save.hardReset()` from the console. Neither touches Syrup Town's keys.

### 2. No way out of Honeycomb; menu button strands you ☑ FIXED

> I think the whole mvp environment needs re-thinking around the basis of better testing, especially
> since leaving honeycomb via the menu button does not resume the title sequence, leaving me stuck.
> Moving back between screens isn't just a debug factor either, but essential for regular play.

`platform.exit` calls `writeScene("system","start")`, which is not the title screen and does not
restore the title's animation chain. Two separate needs, and the quote names both:

- **Real play navigation** — a Honeycomb title/hub screen, and the ability to move between screens.
- **Dev navigation** — a debug panel: jump to any scene, wipe saves, force win/lose, edit resources,
  reroll the map, set a seed.

**Fixed.** Root cause of the broken title: `generateTitle()` checks `devPreviewActive()` and skips the
title's animation chain while a preview is running, so the letters stay parked off-screen and the
buttons never rise. `platform.exit` now clears `devPreviewTarget` before handing back — the player has
explicitly left the previewed screen, so the preview genuinely is over. Verified: the Syrup Town title
returns fully animated and interactive.

Three things added:
- **Title hub** (`honeycomb-scene-title.js`) — Continue / New Run / Roster / Debug / Back to Syrup
  Town, with lifetime stats. Boot lands here when no run is in progress.
- **System menu** — the top bar's Menu button on *every* screen. Resume, Honeycomb Title, Forfeit
  Battle, Abandon Run, Debug, Leave. Rendered by the top bar rather than by any scene, so it stays
  reachable even from a screen that has stopped accepting input.
- **Debug panel** — wipe saves, jump to any scene, start a chosen test battle, force win/lose, heal,
  grant gold, complete the current node, and repair a stuck battle. Gated behind `tuning.debug.enabled`
  so a release build hides it without deleting it.

The governing rule is now written into the code: **no screen is a dead end.**

---

## P1 — Windows of opportunity. Expensive to retrofit; do before any content work.

### 3. Character art: states, folders and naming ☑ DONE

> I see you began creating images for varying states. This is mostly fine since it's a good
> opportunity to use AI to generate the characters in these states for a ton of neat art, but
> compounding visual effects makes this much harder. The required image count balloons past reasonable
> numbers.

> On the subject of the images you've created, they're very disorganized. Compounding states with
> outfits especially makes it quite confusing. When I come through for an art pass it will be very
> difficult to ascertain what images will actually be needed. Ideally, the images would naturally
> name-sort in a way that makes sense to read through.

The prescribed scheme, verbatim:

> To keep scope-creep in check, I think a better system would be:
> Characters have standing art with full and hurt states. We'll refer to these as 1 and 2 in the files.
> They also have a damaged, offense, and passive animation (images it transitions to and holds on for
> just a moment) image for each of these states. Since we should probably make each character and
> outfit have their own folder, it might look like this:
> knight/default/1-basic
> knight/default/1-damaged
> knight/default/1-offense
> knight/default/1-passive
> knight/default/2-basic
> knight/default/2-damaged
> knight/default/2-offense
> knight/default/2-passive
>
> Then states can be one of three types:
> filter (default, only applies a visual filter over the character)
> full (overrides normal with their own full and hurt variants)
> half (overrides normal with a single set of variants regardless of full or hurt)
> Then finally, we assign a priority to states so that states like death are always prioritized over
> things like poisoned if somehow a character has both. We will however need a very robust fallback
> system for this.

So: **health tier** (1 = full, 2 = hurt) × **pose** (basic, damaged, offense, passive) = 8 images per
outfit as the baseline. States layer on top and are one of three types, resolved by priority, with
fallback. This replaces the current flat `-action` / `-hurt` / `-wounded` / `-critical` suffixes
entirely, and the existing generated art must be regenerated into the new layout.

Fallback chain must degrade: requested state pose → state basic → outfit pose → outfit basic →
default outfit basic → generated placeholder. Never a broken image.

**Done**, exactly as specified. New module `honeycomb-art.js`; see `ART-GUIDE.md` for the artist-facing
version.

- **Layout** is `characters/<character>/<outfit>/<tier>-<pose>` and `enemies/<enemy>/<variant>/…`,
  with `0-portrait` sorting first. Nine files per outfit, and the old flat `full/` and `enemy/` folders
  are gone.
- **Poses are wired to meaning**: `offense` for attack cards, `passive` for skills and powers, so a
  Raise Shield no longer swings a sword. Enemies pose from their intent type the same way.
- **The three state types work as described.** Every state today is `filter`, so **the entire status
  system costs zero images** — that is the answer to the ballooning count. `full` and `half` are there
  when a status earns drawn art, and `half` never asks for a tier-2 file.
- **Priority** is a number on the state; death is 1000 and outranks everything.
- **Fallback** is a real chain, not a single retry: the `<img>` walks candidates until one loads and
  only then draws a labelled placeholder. A character with just `1-basic` renders correctly in every
  pose, tier and state. Failed paths are remembered per session so repaints do not re-request them.
- **Size**: sprites are capped at 1300px tall. The 1408x2816 source cost 16MB across the generated set
  and delayed first paint for no visible gain; the folder is now 12MB total.

18 tests cover it, including "a filter state contributes no art paths" and "every character, outfit
and pose yields a non-empty chain".

**The generator will not eat an art pass.** Each generated folder carries a `.generated.txt` manifest;
a rerun overwrites only files it wrote, reports which real files it protected, and needs `--force` to
touch anything else.

### 4. Non-card abilities are character spells, not potions ☑ DONE

> Don't build around the idea the non-card abilities are potions, flavor them around being spells that
> belong to a character. Each character having their own sub-menu potential for the sort of abilities
> that Slay the Spire put as potions is a good way to differentiate ourselves.

Rename and re-home: the `potionSlots` resource and the potion concept go; abilities belong to a
character and open from that character's own sub-menu in combat. Keep the underlying "usable, limited,
resolves an effect list" machinery — only the ownership and framing change.

**Done.** `potionSlots` and `potionArray` are gone entirely; grep for "potion" finds one hit, in a
comment explaining why the system is deliberately not one.

- **`honeycomb-content-abilities.js`** is the table, **`honeycomb-abilities.js`** the engine. An
  ability is a target mode plus an effect list, resolved through `honeycomb.resolveEffectArray` —
  the same layer cards use, so a card and an ability can never disagree about what "deal 6 damage"
  means, and a new ability is a table entry.
- **Charges are per character**, not a shared pool. Severine running out of Siphon does not stop Nettle
  casting Blight. `rechargeOn` is `combatStart` / `turnStart` / `rest` / `never`.
- **Which abilities a member has is derived, not stored** — from character plus outfit plus
  equipment, through *the same modifier seam the card pool uses*. Warden grants Brienne Shield Wall,
  Grovekeeper replaces Nettle's Blight with Graveward, and Thief's Gloves hand any wearer Second Wind.
  Only the charge counts are state, reconciled on change: swapping an outfit does not refill a spent
  ability, and an ability arriving from new equipment starts full.
- **The sub-menu is under the character**, in combat and in teambuilding, because that is the point of
  the framing. An ability needing a target enters an aiming mode that dims the board to legal targets.

Making this work turned the card-pool resolver into a general one: `honeycomb.poolKindArray` names
which fields a pool reads, so a third per-character pool is a table row rather than a second copy of
the resolution code.

### 5. Cards must be able to target cards, and open selection windows ☑ DONE

> More on the battle scene, it's essential cards be able to target other cards (without accidentally
> targetting the player characters, that's important), or open windows for cards or options to be
> selected. That's a lot of design space on the table.

Targeting is currently entity-only. Needs a target *kind* dimension (entity / card / option) with
drop-zone filtering so a card-targeting card cannot land on a character. Plus a generic
"choose from a set" overlay that an effect can await mid-resolution — which means effect resolution
needs to be able to suspend and continue.

**Done, both halves.** New module `honeycomb-choices.js`.

#### Cards targeting cards

Target modes now carry a **kind**: `entity` (the default, and what every existing mode is) or `card`.
The kind decides three things at once, which is what makes the guarantee hold:

- **The drop zone.** A card-targeting card's drag looks at the HAND and never at the battlefield.
  Verified in a browser by asking the drop-zone resolver directly: over another card it returns that
  card, over an ally `null`, over an enemy `null`, over itself `null`. An enemy-targeting card is the
  mirror image — over an enemy it returns it, over an ally or a card `null`. **A card-targeting
  card has no way to reach a character**, which is the part called out as important.
- **Where the resolved list lands.** Card targets go to `context.targetCardArray`, entities to
  `context.targetArray`. They are separate lists, so `damage` can never be handed a card and
  `upgradeTargetCard` can never be handed a person, even if a caller passes the wrong id.
- **What the hint says.** "Drag onto another card." rather than "Drag onto a target."

Modes shipped: `handCard`, `randomHandCard`, `randomDiscardCard`, `allHandCards`, `thisCard`. Card
effects to go with them: `exhaustCard`, `discardCard`, `returnCardToHand`, `upgradeTargetCard`,
`modifyCardCost`, `duplicateCard`, `removeTargetCardFromDeck`.

Cost changes are written **onto the instance**, not the definition, so discounting one copy of Sword
Strike leaves the other two at full price. Tested.

#### Selection windows, and suspendable resolution

The hard half. Resolution is a synchronous recursive walk; a UI answer arrives seconds later. The
mechanism is **ask, rewind, replay**:

1. An effect calls `honeycomb.requestChoice`. Each question during one resolution has a position.
2. If an answer for that position is already on hand, it is returned and resolution simply continues.
3. If not, the question is recorded and resolution unwinds — every effect stands down once a
   question is pending.
4. The caller restores the snapshot it took before resolving, so the abandoned attempt leaves no
   trace, and shows the question.
5. The answer is appended and the **whole list runs again from the start**. Step 2 answers the first
   question, and the pass reaches the second, or the end.

**Why replay and not continuation-passing.** Rewriting the effect layer into CPS would make `repeat`,
`branch`, `forEachTarget` — and every nesting effect ever added — responsible for being resumable,
and every new effect would inherit that obligation. Replay costs one extra pass per question over a
list that is a handful of entries long, and in exchange **nothing in the effect layer knows choices
exist**. An effect at any nesting depth can ask a question without being written for it.

It is safe here because of two properties the engine already guaranteed for other reasons:
- State is fully serialisable — the same property that makes a mid-combat save work.
- RNG is `(seed, calls)` per named stream — so a replayed pass draws exactly the same numbers.

Both were already load-bearing. Neither was added for this. **Verified:** a rewound pass advances no
RNG stream, and the same seed with the same answer produces a byte-identical outcome.

The rewind is total and that is the point: a question the player closes leaves the card unplayed, the
energy unspent and the card still in hand. An ability that asks and is not answered spends no charge.

Two effects use it, and both are content-shaped: `chooseCards` (pick from a pile, then run a nested
list per chosen card) and `chooseOption` (pick one of several branches, each carrying its own effect
list). One overlay serves every question, because a question is data — `honeycomb.choiceKindArray`
says what a question is ABOUT and how to draw it.

Three cards were added purely to prove it, and each is an ordinary table entry the engine knows
nothing about by name:
- **Whetted Edge** drags onto another card in hand, upgrades it and discounts it.
- **Improvise** opens a window over the discard pile mid-resolution, then pays out.
- **Hedge Your Bet** offers three branches.

**One trap, now documented at the call site.** A rewind REPLACES `honeycomb.state`, so anything
holding `honeycomb.state.run` or `.combat` across a choice is looking at an abandoned copy. The engine
re-reads on every pass; callers must too. It cost a confusing test failure before being spotted.

**A latent bug fell out of this.** `applyTuningToCss` wrote its custom properties only to the scene
root, and the overlay host is a SIBLING of that root rather than a child — so any overlay sizing
itself from a tuning property collapsed to zero height with no error. Now written to both, which the
stylesheet already did for the palette.

### 6. Design space to keep open ☑ DONE

> As for other areas of design space I just want to make sure are open to explore later: cards with
> random targets, X random targets, cards that summon npcs (probably mostly used for enemies to summon
> more enemies), cards that summon controllable characters. As well as the number, stats, damage, etc
> of enemies rising the more characters are in your party. A simple multiplier at this stage would
> make proper support for it later a lot more manageable.

- random target ☑
- **X random targets** ☑
- **summon NPC** ☑
- **summon controllable character** ☑
- **party-size scaling multiplier** ☑

**All four done.**

**Target modes became a registry.** They were a `switch`; now each mode resolves itself, so a new way
of choosing targets is a table entry. A target mode is written either as a bare index — `"enemy"` — or
as a descriptor carrying parameters — `{index: "randomEnemy", count: 3}`. The two forms are
interchangeable everywhere, so no existing content changed.

- **X random targets**: `count` on the descriptor, and it may be a value expression, so "one random
  enemy per Focus stack" needs no new mode. `allowRepeats` decides whether one enemy may be hit twice;
  the default is three DIFFERENT enemies, because that is what the phrase usually means.
- Three modes came along for free while the registry was being written: `randomAny`, `frontAlly` (which
  reads the party order added in item 7), and `otherAllies`.

**`summonEnemy`** adds a body mid-fight and telegraphs its intent immediately, so it never stands for a
turn showing nothing. The Matriarch now has a `brood` intent that splits two Sporelings off her back —
written entirely as content, which is the point: summoning needed no engine special case, only a verb.
Summoned enemies are flagged, so content can tell them from the ones the encounter fielded.
`tuning.scaling.enemyLimit` caps the board; a summoner without a ceiling can fill the screen and
outlast the turn limit.

**`summonAlly`** adds a CONTROLLABLE party member. The engine has never imposed a party ceiling —
`partySizeMaximum` is what the teambuilding screen offers — so a summon is an ordinary member: it takes
damage, holds statuses, carries its abilities, appears in the party rail. `cardArray` mints cards
**owned by the newcomer** straight into a pile, which is what makes it controllable rather than a pet.
`temporary` (the default) means it leaves when the fight ends; a permanent summon has to be asked for,
because that is a run-changing event.

**Party-size scaling** is `honeycomb.scaling`, reading `tuning.scaling`. Everything derives from one
quantity — how far the party is from `baselinePartySize` — with a separate per-member rate for enemy
health, enemy damage, enemy count and gold, so they tune apart. Deliberately simple; the point at this
stage is that all four consumers already ask the scaling system instead of a raw number, so a real
difficulty curve later replaces the arithmetic in one place.

Two decisions worth recording:
- Party size is counted **including downed members**. A party of six that has lost two still built for
  six, and shrinking the fight as they lose would reward losing.
- Party size **excludes temporary summons**. The encounter was sized before they arrived, and counting
  them would mean summoning an ally instantly made every enemy hit harder.

Enemy count scaling is live but set to zero per member, since no encounter is authored with room for
extras yet. An encounter may name a `reinforcementArray` so a boss fight is padded with the right
thing rather than with whatever is first in its list.

### 7. Dead characters and their cards ☑ DONE

> Other battle scene notes, I couldn't thoroughly test what the actual behavior was, but consider
> allowing the cards belonging to a specific character to change their behavior if the owner is dead.
> The default case could even be they're unselectable, so long as we account for if we end up wanting
> to be more creative with it in the future, like if we let dead cards cycle, or a character
> transforms into a ghost on death and their gimmick is they can act while dead. As it stands, they
> don't seem different, and I noticed playing blood pact at 1hp didn't kill Severine when I used it.

Two things. A **policy hook** on the card/character for what happens to a card when its owner is
down (`unplayable` default, plus room for `cycle`, `playable`, custom). And a **bug**: Blood Pact's
self-damage at 1 HP did not kill Severine — `damageIgnoringBlock` with `targetOverride: "owner"` is
resolving to nobody or the death check is not firing on self-damage. Needs a test.

**Both done.**

**The bug was card OWNERSHIP, not the death check.** A Blood Pact contributed by Severine kills her
correctly — reproduced headlessly, it does. A Blood Pact *gained during the run* did not, because
every grant site called `addCardToRunDeck(cardIndex, null)`: reward, shop and event cards were minted
with **no owner at all**. `targetOverride: "owner"` then resolved to nobody, the self-damage silently
did nothing, and the card still paid out its energy and its draw. Any card taken as a reward was
quietly better than the same card from a character's pool.

Fixed in two places, both tuning-switchable:
- `honeycomb.defaultOwnerFor` hands a gained card to the party member whose character it names, so a
  bought Blood Pact is Severine's.
- `tuning.deck.ownerlessFallback` decides what "owner" means for a genuinely ownerless card — a
  neutral one. Default `frontAlly`. Deliberately has **no random option**: the card cost readout calls
  this while rendering a hand, and an RNG draw inside a render pass would advance a stream a different
  number of times depending on how often the screen repainted.

**The policy is a registry**, `honeycomb.ownerDownPolicyArray`, resolved card → character →
`tuning.combat.defaultOwnerDownPolicy`:
- `unplayable` (default) — greyed, hatched, and the card names whose owner is down.
- `playable` — works, but "owner" effects find the ownerless fallback.
- `cycle` — replaces itself with a draw, so a dead character thins the hand instead of clogging it.
- `haunt` — the ghost case Noodle named: the downed owner stays the acting entity, so the card
  behaves normally, self-damage included.

A policy may also rewrite the card's effect list outright (`effectArrayFor`), which is how `cycle`
works and how a stranger one would.

Party ORDER arrived here too, since "who acts" needed an answer: `honeycomb.frontAlly`,
`honeycomb.allyRank` and `honeycomb.moveAllyToFront` are real and saved. Item 17's rule — playing a
card moves its owner to the front — is implemented and **switched off in tuning**, only because the
reorder currently snaps with no transition and reads as a glitch. One flag turns it on once item 17
animates it.

### 8. Card model completeness ☑ DONE

> Before moving on to thinking about the content or demo, it'd be worth pondering several elements of
> the game's engine to know if we're as modular as can be here in the teambuilding scene. For
> instance, do cards have rarities? Tags? Types?

**Done.** Tags are a whole system now, in `honeycomb-tags.js`, and the audit is in it.

- **Tags are free-form strings.** `honeycomb.tagArray` is *optional metadata* — a display name, a
  category and a colour — not a whitelist. An unregistered tag works everywhere and prints as
  itself. A registry of legal tags would be one more table to keep in step with the content, and the
  first thing an author wants from a tag system is to invent a tag.
- **Every content table takes `tagArray`**: cards, characters, outfits, equipment, relics, enemies,
  abilities. All 23 cards and all 5 enemies are tagged.
- **Content asks through conditions and values**: `hasTag` (of source / target / card / owner),
  `partyHasTag` (with a minimum count), and the values `partyTagCount` and `tagCountOn`. Both
  registries are extended from the tags file rather than defined in the effects file, so deleting the
  whole system would leave no holes behind.

Card model audit, for the record: `index`, `name`, `characterIndex`, `type`, `rarity`, `tagArray`,
`costArray`, `targetMode`, `layout`, `artPath`, `effectArray`, `text`, `exhausts`, `ethereal`,
`innate`, `retain`, `playableCondition`, `ownerDownPolicy`, `upgradeArray`.

### 9. Character tags ☑ DONE

> Characters should certainly have some kind of tag system, like gender or species, to make actual
> teambuilding more enjoyable. Costumes, equipment, and progression should be able to alter tags.

**Done.** Characters carry `tagArray`; outfits and equipment carry `tagAdditionArray` and
`tagRemovalArray`, resolved through the same modifier list the card pool uses — so anything that may
change a character's cards may change what they ARE.

- Gender is a **tag, not a field**. The engine has no schema for gender at all, content can be written
  for it, and a costume can change it.
- Live in content already: Bloodied Plate turns Brienne from `defender` to `striker`; Plaguebearer
  makes Nettle `undead`; the Duelist's Blade adds `striker` to whoever wears it.
- A member's tags are **computed, never stored**, for the same reason their card pool is.
- Teambuilding shows a character's tags as chips that change the instant an outfit is toggled, and the
  Deck tab shows a **Team Traits** tally — "two Women, one Undead" — which is the teambuilding
  read the request was after.

### 10. Progression as a branching tree ☑ DONE

> Character progression would be better as a branching tree that visually fits with with the map
> design than a flat list. It's a roguelike, so we're obligated to make it a pick-one as all good
> roguelikes do, but allowing the player to change their choices to fit their build, and with a reset
> button too. The maps could be at least a little more complex as well, lightly inspired by FFX's
> sphere grid, with an image in the background to help with the mood. I also think that these sort of
> choice-progression options should be influence-able by different outfits, and programming in how
> we'll handle an outfit change changing a selected progression choice would be easier now than later.

A node graph, respecced freely, rendered like the map, over a mood image. Outfits can alter the tree —
**and the outfit-change-invalidates-a-selected-node case must be designed now**, not later. Likely
policy: on outfit change, re-validate every selected node; invalid selections refund rather than
silently vanish.

**Done, and that policy is what shipped.**

Levels are gone. `characterLevelArray` and the flat `progressionArray` lists are deleted; a character
now has a `progressionTree`, bought with the shared experience pool from item 12.

**The tree is a graph of nodes with prerequisites.** Roots are free to reach; everything else names
what leads into it with `requiresArray`. `requiresAll` turns a node into a genuine convergence
— Brienne's Paragon costs BOTH branches, not either. Nodes carry `x` and `y` as percentages over a
mood image, exactly as the map's anchors do, and are drawn by the same kind of SVG graph with the same
letterboxing rule. The two screens read as the same kind of thing, which is what was asked for.

**A node IS an outfit.** Literally: a tree node carries the same modifier fields an outfit and a piece
of equipment carry — `healthModifier`, `cardAdditionArray`, `cardReplacementArray`,
`abilityAdditionArray`, `tagAdditionArray`, `hooks`. Selected nodes are appended to
`honeycomb.memberCardModifierArray`, the seam item 13 built, so a node reaches the deck, the ability
list, the tag list and the hook pipeline through machinery that already existed. **Nothing had to
learn what a progression node is.** Maximum health was the one exception and is now read from the same
list, so the live recalculation and the teambuilding preview cannot disagree about it.

**Everything is reversible.** Clicking a taken node refunds it; anything downstream that is no longer
reachable comes off and refunds too, because a tree with a hole in it is not a build. Reset unmakes
the lot. Measured: assemble a build, reset, and the pool is back to exactly where it started.

**The outfit-change case, in full.** An outfit reshapes a tree two ways: `treeLockArray` forbids nodes,
`treeNodeArray` adds them. Both are resolved on read rather than stored, and
`honeycomb.progression.onLoadoutChanged` runs on every outfit and equipment change:

- Bloodied Plate locks Brienne's whole defensive branch. Buying it and then wearing that plate
  **refunds 160 Experience and says so on screen**. Nothing is silently swallowed and the outfit change
  is never blocked.
- Switching back does **not** hand the nodes back for free.
- Warden ADDS a branch nobody else can walk. Leaving Warden refunds that node at its real cost — the
  refund reads the price off the OUTFIT, since the node is not in the base tree at all. Refunding zero
  there would have quietly taxed the player for changing costume, which is the exact failure this
  policy exists to prevent.

The teambuilding Progression tab is now a summary and a way in — taken / open / banked, the list of
what has been chosen, and a button. The tree itself opens full-screen, because a branching graph over
art needs the width of the screen and that tab column is a narrow strip.

Mood art is HC-PLACEHOLDER: the three background paths do not exist yet and the graph draws over the
panel until they do. Node icons are the generated star; a node may name its own `iconPath` and the art
is picked up with no code change.

### 11. Map layout over art ☑ DONE

> For the map screen, it's probably important to program in complex path layouts like in mockup 4 at
> this stage rather than later, right? Sticking with these hardcoded layouts isn't ideal since
> eventually we may want to overlay the map onto art. That suggests the whole map creation algorhythm
> could use a second draft to handle filling in a map built over an image. We'll likely want a pool of
> images for each dungeon, have to manually assign them points.

Yes — right call, and cheaper now. Second draft: a region supplies a **background image plus a
hand-authored set of node anchor points** in normalised coordinates; generation fills those anchors
rather than computing a grid. The current row/column generator becomes one layout *strategy* among
several, so a region can be procedural or hand-placed.

**Done, as a second draft rather than a patch.**

**The renderer no longer decides where anything goes.** That was the real problem: the old generator
produced a grid of rows and columns and the RENDERER turned that into coordinates. A map drawn over a
painting has its positions dictated by the painting, and only the layout knows that. So layout is now
a registry, `honeycomb.mapLayoutArray`, and it OWNS position — every node carries an explicit
`position` in a normalised 0..100 space, and the renderer just draws what it is handed.

Two strategies ship, and a region picks with `layoutIndex`:
- **`rows`** — the original generator, now emitting its own positions. Unchanged in behaviour.
- **`anchored`** — a region supplies `backdropArray`, a **pool** of paintings, each carrying the
  points a node may sit on. One is picked per run from the map stream.

**An anchor set** is `{id, step, x, y, typeIndex}` per point, x and y as percentages over the image.
`step` groups anchors into progression tiers, which the rest of the map code reads as a row — so
nothing downstream needed changing at all. `typeIndex` is optional and forces that node's type, which
is how a hand-authored map puts the shop exactly where the art shows a shop. `edgeArray` is optional
hand-authored connections; omit it and edges are derived by the same proximity rule the grid uses.

Two backdrops are authored for the Flooded Vault, both HC-PLACEHOLDER shapes rather than measured
landmarks since the paintings do not exist yet. The first is the thing a grid cannot express: a
causeway that forks and rejoins with **routes of different lengths**, which is what mockup 4 shows.
The second is a tighter descent, there to prove the pool actually varies.

**Which backdrop was chosen is recorded on the map**, not re-rolled on load. Re-picking would move the
painting out from under a run in progress.

**One thing worth recording, because it was not obvious.** The first version stretched the SVG with
`preserveAspectRatio="none"` so the graph would track the image. It did — and it stretched every
node circle into an ellipse with it, because shapes inside an SVG are scaled by the same transform the
coordinates are. Caught by looking at it. The fix is to match the SHAPES instead: the graph's viewBox
takes the backdrop's aspect, the painting is `object-fit: contain` rather than `cover`, and both
letterbox into the same rectangle. Nodes stay round and anchors stay on their landmarks.

For the art pass: measure a point as a percentage across and down the image, and that is the whole of
it. The graph stretches with the image, so the numbers stay correct at any screen size. A typo in an
edge is reported rather than silently dropped.

### 12. Global EXP ☑ DONE

> Also at this stage I think we should consider EXP. I think EXP should be something that builds over
> the whole play experience, gained from defeating all enemies and winning events, but also more for
> defeating -new- enemies and finding new events. Tracking that will likely be difficult, the pool of
> experience gained from seeing new events could likely be shared across the entire cast, leading to a
> kind of global progression that'd help differentiate honeycomb from slay the spire.

Profile-scope, survives runs. Needs a **discovery ledger** on the profile — enemies defeated and
events seen, ever — so first-time bonuses can be paid. Shared pool across the cast.

**Done.** New module `honeycomb-progression.js`.

**Resource scope became a registry to make this work.** `honeycomb.resourceScopeArray` names where a
resource of each lifetime lives and how to reach it; `profile` was documented as possible but never
implemented. Experience is the first resource of that scope, so it is readable and writable **with no
run in progress at all** — which is what lets the title hub show it. A new lifetime, "per region"
say, is now a table entry with a `holder` function rather than another branch.

**The discovery ledger.** `state.profile.discoveryArray` holds, per KIND, every index this profile has
ever seen. Asking "is this new" is a lookup: there is no per-run bookkeeping and nothing to reconcile,
which was the part flagged as likely to be difficult. Six kinds ship — enemy, encounter, event,
relic, card, region — each carrying its own `baseExperience` and `firstExperience` beside the thing
it describes, and its own `nameFor` so a reward screen never prints a raw index. (The encounter table
gained real names for exactly that reason.)

**The first-time bonus does the work.** A first Sporeling pays 15 and a repeat pays 2; a first
encounter pays 20 and a repeat 5. Measured end to end: a first win pays 35, the same fight again pays
7, and a fight containing one new enemy pays 37. A player pushing somewhere new out-earns one
grinding, which is the differentiator that was asked for, and it means **a run that ends badly still
leaves something behind**.

**One rule, stated at the call sites:** a discovery is recorded when it is EARNED, not when it is
drawn. An enemy is discovered by being defeated, an event by being resolved, a region by being left.
Otherwise a player could farm first-time bonuses by opening things and walking away from them.

Where it shows: the victory screen prints the experience beside the gold and **names what was new**
(— a number alone does not tell the player why this fight paid better); the region-cleared screen
does the same; the title hub shows the pool and the ledger as "Enemies defeated 2 / 5".

`tuning.progression.experienceEnabled` turns the whole system into a no-op without deleting it, and
`experienceMultiplier` tunes the curve in one place. Both tested.

Not done, deliberately: **nothing spends it yet.** That is item 10's job — the progression tree is
what the pool buys — and building a sink before the tree exists would mean building it twice.

### 13. Contributed-cards list is not rebuilt ☑ DONE

> I'm not sure how the contributed cards list is handled, but it needs to be built more dynamically to
> account for players changing the cards in their deck. Example: Equipping Brienne with the Duelist's
> Blade replaces her sword strike, resulting in the list reading "riposte, raise shield, bulwark,
> riposte", which tells me the list isn't being recreated, just adjusted. We'll really want a more
> robust system here in case we add things like "drag this equipment onto a card to..." or something
> along those lines.

Confirmed bug in `applyCardPoolModifier`: replacements mutate entries **in place**, so a replacement
producing a card that already exists leaves two separate entries instead of merging, and order is
whatever the original slot was. Rebuild properly: resolve to a fresh list and coalesce by card index.

**Done.** The pool is REBUILT on every read and never patched: each modifier produces a fresh list,
and rows naming the same card are coalesced at the end of every operation. Brienne with the Duelist's
Blade reads "Riposte x4, Raise Shield x3, Bulwark x1" — one row per card, in first-appearance
order. With Bloodied Plate on top she collapses to "Riposte x7, Bulwark x1", which is correct, and
also a warning about that content combination.

Three things came out of doing it properly, all aimed at the "drag this equipment onto a card to..."
future named above:
- **Every row carries its provenance.** `sourceArray` records which character, outfit and equipment
  put the card there, and the teambuilding list prints it: "Riposte — Bloodied Plate, Duelist's
  Blade".
- **Replacements may be partial.** A replacement rule takes an optional `count`, so "replace two of
  your three Strikes" is expressible; the remainder stays in place as its own row.
- **Ordering is a registry**, `honeycomb.cardEntrySortArray` — pool order, by type, by cost, by
  name. Item 16's list/detailed toggle has its sorting already.

One deliberate rule, documented at the call site: within a single modifier each card is replaced at
most once and the first matching rule wins. Chaining A→B→C means using two modifiers, which is
explicit rather than accidental. Between modifiers, chaining is exactly what happens.

---

## P2 — UI and presentation. Real work, but retrofittable.

### 14. Tooltips ☑ DONE

> We don't need to get lost in the weeds too much just yet on UI polishing, but I do think we need
> hovering tooltips to show larger versions of the cards when the smaller ones are hovered over, and
> descriptions of status effects otherwise I can't actually know what's meant to be happening. I
> genuinely have no idea what the symbols above enemy heads is supposed to mean.

Card zoom on hover, status tooltips, **intent explanation in words** ("Attacking for 9", "Defending").
The intent icons are currently unreadable without the title attribute.

**Done.** New module `honeycomb-tooltip.js`. All three, verified on screen.

- **A hovered card shows a full-size readable copy of itself**, rendered by the same `honeycomb.ui.card`
  the hand uses, so the zoom and the card cannot disagree. A footer adds what the printed text does not
  say — whose card it is, whether it exhausts, and why it cannot be played right now.
- **A hovered status names itself and says what it does**, with THIS entity's stack count and a line on
  whether it decays, holds, or survives the fight.
- **A hovered intent says what the enemy is about to do, in words, with the real numbers**:
  "Attacking for 9 damage." or "Attacking for 3 damage, 4 times — 12 in total.", plus who it is aimed
  at.

The intent sentence is **generated from the intent's own effect list**, through the same
`describeEffectArray` that prints card rules text. A new enemy intent therefore explains itself with no
tooltip written for it, and its explanation can never drift from what it actually does. That was the
one place in the game with a printed symbol and no printed meaning.

`honeycomb.tooltipKindArray` is a registry — card, status, intent, relic, ability, resource ship, and a
new hoverable thing is a table entry plus one attribute on the element. Hover is wired with inline
`onmouseenter` / `onmouseleave` like the rest of the UI, so nothing is added to the document and Jiggy
is untouched. `tuning.ui.tooltipsEnabled` switches the whole system off without deleting it.

### 15. Equipment unlock tracker ☑ DONE

> Given outfits and equippables could be unlockable, it'd make sense to have a tracker for equipment
> as well.

`unlockedEquipmentArray` exists on the profile but nothing reads or writes it. Wire it up, and show
locked equipment the way locked outfits are shown.

**Done, and the three unlockable things now share one system.** They were being answered three
different ways: outfits had a bespoke check on the teambuilding screen, equipment had a profile array
nothing read or wrote, and characters had a flag on the definition. `honeycomb.unlockKindArray` names
where each kind's ledger lives and how to find the thing being asked about; a fourth unlockable thing
is a table entry.

- **`unlockedFromStart` on the definition still wins outright**, so content meant to be available from
  the first run says so where it is defined rather than depending on a save file being right.
- **Equipment is SHARED** — finding a Whetstone finds it for the whole roster — so its ledger is a flat
  list. Outfits are per character. That distinction is the reason the profile field was an object and
  had to become an array; the ledger checks the shape rather than assuming it, so an older save
  cannot arrive as the wrong type.
- **Locked equipment is shown, not hidden**, exactly as a locked outfit is: knowing a thing exists is
  most of what makes finding it worth doing. Both tabs carry a "found N of M" line.
- **`unlockOutfit` on a progression node finally means something.** It was written but unread. Taking
  Brienne's Keen Edge now unlocks the Duelist's Blade, Nettle's Soul Harvest unlocks the Thief's Gloves,
  and the outfit-unlocking nodes at the end of each tree unlock their outfit. An unlock is PERMANENT:
  refunding the node that found the item does not un-find it.

Two of the four items ship unlocked so a fresh profile is playable; the tracker reads 2 / 4 and moves
as the trees are walked. Verified end to end.

### 16. Deck UI split ☑ DONE

> In the progression menu is the deck submenu. It would make sense if there were a different global
> deck UI element somewhere and the character's specific deck were listed visually under "Contributed
> Cards". While I do like the simpler layour that contributed cards currently has, a toggle to change
> that between a list and detailed view would be better.

**Done.**

**The deck stopped being a tab.** It belongs to the party, not to whoever happens to be selected, so
asking about it from inside one character's panel was the wrong shape — the answer had nothing to do
with the character whose page it was on. `honeycomb-overlays-deck.js` is its own screen, reached from
two global places: a **Deck** button in the teambuilding footer, and the **deck count in the top bar**
during a run, which is now clickable.

It answers two different questions and says which it is answering. Before a run it previews what the
current team WOULD be dealt, resolved live from the selection; during a run it shows the real deck with
everything picked up along the way. Upgraded copies are listed apart from unupgraded ones, because
they are different cards to play.

It also carries the controls the earlier work had already built and had nowhere to put:
- **Sorting** through `honeycomb.cardEntrySortArray` from item 13 — pool order, by type, by cost, by
  name.
- **Filtering by whose card it is**, drawn from whoever is actually in the party.
- The party's **Team Traits** tally from item 9, which is a party-wide read and belongs on the
  party-wide screen.

**Contributed Cards kept its place and got the toggle**: LIST for the compact read that was liked, or
CARDS for rendered cards with counts when the question is "what does that actually do". Hovering a row
in the list view zooms the card, through the item-14 tooltip.

### 17. Battle layout ☑ DONE

> Battle ui's layout could use work to make it closer to mockup 1, with the card menu dropping down
> when you aren't picking a card, holding a card causing all except that card to drop back down, and
> characters who don't own the card and aren't being targeted to darken into the background. As it
> stands, the whole scene shifts when the hand is empty, and characters shift up when they get status
> effects. We may also want to consider adding in features that change or care about character order.

Five behaviours plus two layout bugs:
- hand retracts when idle, rises on hover
- holding a card drops every *other* card away
- non-owner, non-target characters darken back
- playing a character's card moves them to the front
- groundwork laying for effects and behaviors that care about the front/behind
- **bug**: the scene reflows when the hand empties — the hand bar must reserve its height ☑ **fixed**
- **bug**: characters shift up when they gain status effects — the vitals block must reserve space
  ☑ **fixed**

Both were layout sizing to content. The hand bar now has a fixed height rather than growing with its
cards, and the status row reserves exactly one chip's height — tied to the same variable the chip is
sized from, since estimating it from font size and padding was wrong by 10px. Chips beyond the first
row now stack UPWARD over the sprite instead of pushing the health bar or overlapping it.

Verified by measurement, not by eye: battlefield, every character name and every health bar hold
identical positions through zero, one and six simultaneous statuses, and through an emptied hand.

**The remaining behaviours are now done too.**

- **The hand sinks at rest and rises when reached for.** The board is what the player reads between
  plays, so the cards get out of the way until the pointer comes near them.
- **Holding a card drops every other one away** and fades them, so the card in hand is unobstructed and
  the board behind it stays readable. They keep their fan angle, because that lives on the slot.
- **Everyone the play does not concern steps back.** While a card is held, its OWNER stays lit and
  whatever it is currently aimed at stays lit; everyone else darkens and settles back into the scene. A
  card that hits a whole side dims nobody on that side.
- **Playing a card moves its owner to the front** — implemented in item 7, still switched off in tuning
  until the reorder is animated, because an un-animated reorder reads as a glitch.
- **Groundwork for content that cares about the front** — `honeycomb.frontAlly`, `honeycomb.allyRank`,
  `honeycomb.moveAllyToFront`, and a `frontAlly` target mode.

All of it fell out of the slot/card split described under item 19: once position and state stopped
sharing an element, each of these became one CSS rule rather than a pile of JS.

### 18. Character framing and scale ☑ DONE

> On that same note, it'd be nice if the characters were larger and their resource pools being at
> roughly thigh-height. In addition instead of all the characters visually occupying the same scene
> like in mockup 2, it would work better for the front-facing artstyle if the players and enemies were
> contained within their own little window, that way they can all belivably face the camera.

**Done, and framed per CHARACTER rather than per party.** The reasoning is in the quote: "that way
they can all believably face the camera". One window per side would still be a row of people looking
past each other; a window each turns the line-up into a set of portraits, which is what a front-facing
art style actually wants.

- **Characters are much larger.** A sprite is now bounded by its own frame rather than by the whole
  screen, so the figure fills the space instead of sharing it.
- **The bars overlap the character at thigh height** (`tuning.layout.vitalsBottomPercent`) instead of
  sitting under them in their own strip. The name got a dark pill behind it, since it now reads against
  a character rather than against the floor.
- **The mirroring hack is gone.** `scaleX(-1)` appears nowhere in the stylesheet any more, and the
  mirrored duplicate of every animation that existed only to preserve the flip went with it.
- **The sprite and the bars are decoupled.** Lunge, recoil and the acting pose are applied to the
  SPRITE inside the frame; the frame and everything floating on it hold still. An enemy's intent
  telegraph anchors to the frame too, so a lunging enemy no longer drags its own telegraph about.

One thing removed rather than added: **the combat portrait rail.** It existed because the battlefield
sprites were small and their health was hard to read. Now that every character stands in a full framed
window with their own bar, the rail said the same thing twice — and covered the leftmost character
doing it. The map keeps its rail, where there are no sprites to read.

### 19. Drag jitter ☑ FIXED

> Dragging a card onto a target also sometimes has the card dart back and forth.

Likely a feedback loop: the drag transform is written from a pointer position that the transform
itself then changes, or the repaint mid-drag re-renders the card under the cursor.

**Fixed, and it was a feedback loop — between CSS and JS rather than within either.**

`.hcHandCard:hover` set `transform` with `!important`. It had to: the fan angle was an inline style on
the same element, and CSS cannot beat inline without it. But that `!important` then also beat the
DRAG's inline transform. So: the card is dragged, the hover rule snaps it back to its hover position,
that moves it out from under the pointer, hover drops, the drag transform applies again, the card
returns — and it oscillates. Exactly "darts back and forth".

The fix is structural rather than a patch: **the slot owns position, the card owns state.** Each hand
card now sits in a `.hcHandSlot` that carries the fan angle and the drag position, both written by JS;
the card inside carries hover, retract and drop-away, all written by CSS. Two elements, so the two
never compete, and **no rule in the hand needs `!important` any more**.

A second, smaller jump went with it. Leaving the fan drops the card's rotation, and because the fan
rotates about the bottom edge that MOVES the card — so it leapt away from the pointer at the moment
the drag committed. The jump is now measured once, the first time it happens, and folded into every
later position. Measured rather than computed, so it stays right if the fan geometry ever changes.

Verified by driving a real pointer drag and sampling the card's position: it tracks the pointer with a
**constant** offset across the commit threshold, monotonically, with no oscillation. `dragScale` also
stopped being a bare `0.85` in the middle of a function and moved to tuning.

### 20. Events and rest ☑ DONE

> The event window is far too small, using up way too little of our screen real-estate. It's good that
> some details are still visible but images will be miniscule and dialogue hard to read, and we'll
> want the opportunity to do a lot more with it like character dialogue. Resting should absolutely be
> closer to events, since there's a lot of design space there. Resting can just be a type of event and
> follow a similar layout, and should have images. I do like how resting shows the result of each
> choice in detail, which is something regular events could do as well.

**Done, all four.**

**Events go large.** Presentation is a MODE rather than a fixed layout — `honeycomb.eventPresentationArray`
holds `panel` (the old centred box, still there for a small aside) and `scene` (full screen). Scene is
the DEFAULT, because an event is a place the player has walked into and the box used a fraction of the
screen to say so. The top bar persists over it, as the shop mockup shows.

**Rest is an event now.** Not "rest looks like an event" — the rest overlay is deleted, and
`theCampfire` is an ordinary entry in `honeycomb.eventArray` that the rest node runs. This was only
possible because of item 5: its three options were the reason a bespoke screen existed, and all three
are plain effect lists now that a choice can stop resolution and ask the player something. Sleep is a
`heal`; sharpen and remove are `chooseCards` over the deck. Which event a rest node runs is a field, so
a region could have its own. Ability recharging fires when a rest event is LEFT, since it is a
consequence of resting rather than of any one choice.

**Every choice previews its outcome**, the thing that was liked about rest. Generated from the choice's
own effect list through the same `describeEffectArray` that prints card rules text, so a new event
choice explains itself and cannot drift from what it does. `previewText` overrides it where prose reads
better — and the test that every choice previews itself caught three "walk away" options that were
saying nothing at all, which now say that nothing happens.

**Room for character dialogue** is `lineArray`, attributed `[{speaker, text}]`, plus a `speakerPath`
figure standing on the side of the screen the panel does not take.

One consequence worth noting: an event with a weight of zero is never rolled onto a map node, which is
what keeps the campfire out of the ordinary event pool — including when the pool reopens after
everything has been seen.

### 21. Full-screen events and the shop ☑ DONE

> We may want some events to dominate the game's screen. I made an extremely simple mockup image of
> the shop's layout in the mockup's folder. Character art on the right, shop details on the left. We
> may want the UI to slide in, I'll keep that in mind if it's feasible so I know to make the
> background art behind the UI.

`mockup-5-shop.webp`: full-bleed scene, UI panel down the left ~45%, shopkeeper art right, tabs
**CARDS / OUTFITS / RELICS** (shop sells outfits — not currently modelled), BUY / LEAVE SHOP footer,
top bar persists.

An event needs a **presentation mode**: `panel` (current small box) or `scene` (full screen with a
character). Slide-in is feasible — answer: **yes, design the background art assuming the UI slides in
over it.**

**Done, on the mockup's layout.**

**The shop and a full-screen event are the same screen.** The shop uses the event scene's own
structural classes rather than a parallel set of its own, so they are one layout with different
contents rather than two things that happen to look alike. Backdrop art full-bleed, panel down the
left at `tuning.ui.eventPanelWidthPercent` (46%, per the mockup), shopkeeper on the right, top bar
persisting over the top.

**Tabs are CARDS / OUTFITS / RELICS**, and **the shop sells outfits** now — which it could not, because
outfits were not modelled as purchasable. Stock is drawn from the party's own characters and only ones
they do not already own, so a slot is never wasted on something owned. Buying one UNLOCKS it on the
profile permanently rather than equipping it for this run: which run a costume is worn on is a separate
decision. That rides on the unlock system from item 15.

**The slide-in is real, and the answer is yes** — design the background art assuming the panel comes in
over its left edge. The panel animates in from `translateX(-12%)`. Transform only, never opacity: a CSS
animation holds at its 0% keyframe while a tab is hidden, so an opacity-0 first frame would render the
whole panel invisible while still swallowing clicks. That trap is already recorded in CATCH-UP and it
applies here too.

One thing worth knowing for the art pass: **a scene paints its own ground** under the backdrop art. A
scene must never let the screen behind show through — while the art is missing it reads as a broken
overlay rather than as a place.

---

## Settled

> Nettle as a necromancer is fine, the mockup maker made a bunch of weird choices. I'm glad you didn't
> take it too strictly.

Nettle stays a Necromancer. Mockups remain loose guidance.

---

## Notes once all feedback is completed

- **Content is cheap now and art is not.** A new card, enemy, status, relic, event, ability, tag,
  progression node or map layout is a table entry. Every one of them wants a picture.
- **The systems with no content yet** are the honest gaps: summoning has one enemy intent using it,
  card-targeting has one card, tags are read by no content, and the trees have seven nodes each.
- **The art guide is current.** `ART-GUIDE.md` lists every path the new systems ask for — ability
  icons, progression tree backdrops, event and shop scenes, map backdrops — with the sizes and the
  measuring rules for placing nodes over a painting.

The one thing still missing that is not content: **Honeycomb has no front door in Syrup Town.** It is
reachable only through `devPreviewTarget`. That is a Syrup Town change and still needs sign-off.
