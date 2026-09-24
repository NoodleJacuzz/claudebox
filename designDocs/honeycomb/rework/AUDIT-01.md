# AUDIT-01 — progression trees, starters, outfits (live: OPEN items only)

**The findings are fixed.** The original report (every 🔴 engine bug, 🟠 content gap and 🟡 text fault from
session 30, plus the phase 1-3 change log) is in **`../Archive/AUDIT-01-DONE.md`**. Session 31 re-checked it
by running `../tools/progression-sims.js`, `../tools/progression-dump.js` and the suite, not by reading the old notes. Every
item there holds. Test blocks **[96]-[101]** play each fix in a fight and pin the printed text.
Suite: **1577 passed, 0 failed**.

Legend: ☑ done · ◐ built, numbers provisional · ⏸ deferred by Noodle · ❓ waiting on Noodle

## Status board

| Item | State |
|---|---|
| Engine bugs, text pass, outfit rework (phases 1-3) | ☑ archived |
| Old rare Blood Moon renamed | ☑ session 31 |
| Signature upgrade ladders | ◐ session 31, numbers are mine |
| Share / Doubt / Price / Phoenix Dive | ☑ confirmed as built |
| **The Orb** (Cassadora's new mechanic, replaces Foresight) | ◐ built session 31; A2 names are placeholders |
| Unlock routes, boost/reduce | ⏸ until the card pool redesign |
| Bloodlust, C.Ex. swaps, outfit readings, A2 names | ☑ confirmed (Phoenix Dive variant renamed Plumefall) |
| Duplicate cards | ☑ 10 culled, old saves carried over |
| Brienne's Taunt | ◐ replaced by Counterguard (1 Retort at fight start) |
| Jinx name clash | ❓ waiting on Noodle |

---

## Answered in session 31

> (Please rename old rare Blood Moon)

☑ The rare `severineBloodMoon` and the status it applies (`bloodMoon`) are now **Blood for Blood**. The
indexes are unchanged, so saves are safe. Blood Saint's signature keeps "Blood Moon", as designed. The
warning report no longer flags Blood Moon. Test [99].

> Signature upgrade ladders … (Please make upgrades for them)

◐ Each of the 18 signatures carries `outfitSignature: true` and a one-level `upgradeArray` (the same length
as every pool card's). `honeycomb.cardIsUpgradable` lets a signature through while still refusing starter
basics, and `upgradeCardInstance` caps each signature at its one level, so a signature upgrades once and no
more. **Tailored now works**: it mints the signature as its "+" form, which then has nothing left to climb.
Test [99]; the old test that pinned "an outfit signature cannot be upgraded" was flipped.

The numbers are provisional, each one line in `honeycomb-content-cards.js` (OUTFIT SIGNATURES block):

| Signature | Base | + |
|---|---|---|
| Plate Edge | deal 4, 4 tHP | deal 6, 6 tHP |
| Headstrong | deal 18 | deal 24 |
| Incredible Wealth | −1 cost per 5 tHP | per 4 tHP |
| Pop | deal 12 | deal 16 |
| Spore | 2 Poison / spread 2 | 3 / spread 3 |
| Kiss | 1 cost | 0 cost |
| Finish | 10, doubled | 13, doubled |
| Cut | 3 self, 3 Strength | 3 self, 4 Strength |
| Blood Moon | 2 cost | 1 cost |
| Blessed Pain | heal 20 | heal 28 |
| Edge | gain 6 Lust | gain 6 Lust, draw 1 |
| Guided Hand | 2 Strength, 6 Lust | 3 Strength, 6 Lust |
| Read | Scry 3 | Scry 5 |
| Misdirect | 2 cost | 1 cost |
| Jinx | 1 Weak or Sundered | 2 |
| Rush | deal 8, 2 Sundered | deal 11, 2 Sundered |
| Gold Standard | 1 cost | 0 cost |
| Recede | 6 + 3 per debuff | 8 + 4 per debuff |

> (Share is meant to inflict 2 lust on Clemence for every rank, some players will want the self-sabotage)

☑ As built: Tempt keeps 6 Lust on the enemy and adds 2 Lust on Clemence per rank (2 / 4 / 6). If "for every
rank" means a flat 2 at each rank, that is one line in the node.

> (Doubt is meant to deal 2 more lust to the enemy every rank)

☑ As built: 8 / 10 / 12.

> (Last hit to her is intended, high reward at growingly high risk)

☑ Price stays five hits of 3, the fifth on Severine. It prints "Deal 3 damage 4 times. Deal 3 damage to yourself."

> Phoenix Dive moves her *first*, then spends Stride … ❓ Intended? (Yes)

☑ Unchanged.

> ❓ **Unlock routes** … (Deferred until the card pool redesign)
> **Boost/reduce** … (Correct, boost/reduced deferred until card pool redesign)

⏸ Every alt stays `unlockedFromStart`; boost/reduce keep the old archetypes (×3 / ×0.5).

---

## The Orb (built session 31)

> ❓ **Soothsayer and Grifter A2** say "for each symbol in your orb … a type matching that symbol".
> Foresight is a count and has no symbols or types. […] (Orb is a new mechanic I'd like, because foresight
> wasn't a very interesting one, just another growing bar. I want hers to be an orb with quadrants, it can
> look like a pie chart if it's too small to actually fit symbols in)

Noodle's answers (session 31, picked from three proposed options):

> What are the Orb's symbols? → "Four free slots" (any symbol in any slot, repeats allowed)
> How does a quadrant fill? → "From the intents she changes"
> When an A2 reads the Orb, does it empty the Orb? → "Yes, it spends the Orb"

◐ **Built, session 31.** The mechanic keeps its index `foresight` (old saves load), now named **Orb**, with a
new mechanic kind **`slots`**: the count is the number of filled slots, so every existing reader (conditions,
spends, the `mechanic` value) works unchanged, and `symbolArray` beside it holds one card type per slot,
oldest first. `maximum: 4`. Test block **[100]** plays every line below in a fight.

| Line | Built as |
|---|---|
| Fill | Glimpse / any intent change she causes fills a slot with the **primary card type of the move she changed away from**; applying Turncoat fills one with the turned move's type |
| Magic Trick (STARTER-LIST) | one enemy move per symbol (cost 1, exhaust), then empties the Orb |
| Soothsayer A2 | **Second Sight** (placeholder name): for each symbol, draws the first card of that type from the draw pile, then the discard pile; empties the Orb |
| Grifter A2 | **Vanishing Act** (placeholder name): needs a full Orb; choose a hand card whose type is in the Orb; it is exhausted and erased from the deck; empties the Orb |
| Hedge Witch A2 | Hex Storm: one random Weak/Sundered per symbol on every enemy; empties the Orb |
| Widget | a pie on the nameplate, one wedge per slot in its card type's colour, empty slots dark (`hcMechanicPie`, HC-PLACEHOLDER); the tooltip lists what it holds |

**My readings, each one line to change:** a full Orb ignores further intents (the oldest is not pushed out);
a partial spend empties the oldest slots first; Vanishing Act with no qualifying card in hand still spends
the Orb and the charge ("No card in hand qualifies").

New engine pieces: `honeycomb.addMechanicSymbol`, `mechanicSymbolArray`, `cardSymbolIndex`; effect verb
`drawMatchingCards`; `chooseCards` option `cardTypeFromMechanic` (request filter `cardTypeAnyArray`);
`mechanicAtLeast` option `full: true`. `removeTargetCardFromDeck` now keeps a mid-fight copy as a temporary
card so its pile never points at nothing.

**Found on the way:** Hedge Witch's Jinx signature printed as a **Support** card, because `randomStatus` had no
card-type rule. It now types like `applyStatus` (Negative). Pinned in [99].

---

## Answered in session 31, second round

> Bloodlust keeps the strength, C.Ex swaps are intentional, I kept waffling on which ones to take, but in
> the end I did stand by Nettle's Penny Pincher, Severine's Challenger, and Cassadora's Investment. Outfit
> changes are fine.

☑ Bloodlust, the C.Ex. assignments and all five outfit readings stay as built.

> The remaining names are fine, though Phoenix Dive (Strenght)? One uses a parenthesis? That probably needs
> a new name.

☑ The other 13 placeholder A2 names stand. Vanguard Plume's dive (`cinderPhoenixDiveStrength`) is now
**Plumefall**; the outfit description says "Phoenix Dive becomes Plumefall". (The game had printed plain
"Phoenix Dive" for both; the parenthesis was only in this doc.) Test [101].

> I can't remember what the Jinx status does again, and the common severineFlurry should absolutely be
> retired. In fact, your next task is to find any duplicate cards in the database right now and cull them
> please.

☑ **Culled 10 cards** (definitions kept in `../Archive/RETIRED-CARDS-S31.md`). Nine were retired starter basics
still sitting beside the live starter of the same name, and all but one also had identical rules. The
warning rule let them through on purpose ("two STARTER forms of one basic"). The tenth is the common Claw
Flurry.

| Retired | Live card it duplicated |
|---|---|
| `brienneStrike` Sword Strike | `brienneCleave` |
| `brienneGuard` Brace | `brienneGrit` |
| `nettleWither` Wither | `nettleVenomTouch` |
| `severineDrain` Drain | `severineQuaff` (identical rules) |
| `severineFlurry` Claw Flurry (common) | `severineRend` |
| `cinderThrust` Lance Thrust | `cinderImpale` |
| `cinderChangePlaces` Change Places | `cinderSwitch` |
| `clemenceOffering` Offering | `clemenceGrant` |
| `cassadoraBolt` Wisplight | `cassadoraWispBolt` |
| `cassadoraSecondThoughts` Second Thoughts | `cassadoraUnravel` |

What the cull turned up and what changed with it:

- **Old saves:** `honeycomb.retiredCardArray` maps each retired index to its replacement, and every load
  rewrites the save (`honeycomb.save.replaceRetiredCards`, called from `reconcileContent`).
- 🔴 **Duelist's Blade never worked.** It rewrote `brienneStrike`, the retired Sword Strike, which no deck
  held. It now rewrites the live `brienneCleave`.
- **Clemence had no starter broken form.** Only the retired Offering carried one (Outpouring). Outpouring
  was kept and now belongs to **Grant**, the starter that took Offering's place.
- **Warnings:** `duplicateCardName` no longer excuses starter pairs. The new rule **`duplicateCardRules`**
  reports two cards of one character with the same cost, targeting and effects. Both are clean now apart
  from Jinx.
- Tests that used the retired cards as fixtures now use live cards with the same property; the content
  checks for Offering itself are gone. Two art prompts in `../tools/card-prompts.js` were rekeyed to the live
  cards. Test [101] pins the cull, the save carry-over and the Blade.

**The Jinx status** (`jinx`, from the common card Jinx): "Whenever an enemy's intent is changed, it takes 5
damage." It lasts the fight, does not stack, and pays off Cassadora's rerolls. ❓ Three things are still
named Jinx: that status, the common that applies it (fine, a card may share its status's name) and Hedge
Witch's signature, a different card (random Weak or Sundered). One of the two cards needs a new name.

> Taunt is, frankly, not very interesting. The front position of the party is already "taunting", it seems
> redundant […] Can you pick something? If it helps you to come up with something, she's the first
> character most players will play.

◐ Brienne's C.Ex3 is now **Counterguard**: at the start of each fight she gains 1 **Retort**, an existing
status (each enemy hit her Temporary HP absorbs deals 3 damage back). Reasons: her C.Ex1 and C.Ex2 both
already give Temporary HP at fight start, so the third node should do something different. It shows a
first-time player that Temporary HP also hits back, and it pairs with those two nodes. It is a table
entry only. The engine's `firstHitTaunt` field still works, but no node uses it any more. Numbers are
provisional (`retortStacks` on the node).

---

## Open: still waiting on Noodle

- ❓ **Jinx**: rename either the common or Hedge Witch's signature (above).

## Open: small, mine to do

- 🟡 The node is "Absolution", the ability "Absolve".
- Known and deferred: mechanic cards are offered before A1 is bought (WIRING-STATUS "Also still deferred").
