# Ownerless cards — FEEDBACK

A card's owner is assigned in the run and is never a field on the card's entry. The plan is
`BRIEF.md`; this file holds Noodle's words and what the plan waits on.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `CATCH-UP.md`. What the project is: `../BASICS.md`.

---

## The direction (Noodle, 2026-09-25)

Answering a Quality Lab question about who its dummy allies should be:

> Absolutely not. We must move to an inherently ownerless card system. Assigning card ownership within the card's identity itself was a huge design mistake we made right from the start. If we just need the card "sword strike", we should not need to do anything with Brienne. That is not modular design.
> I think we should be able to change the actors serving as dummies, and the VFX picker should be able to display the poses of the selected actor, but ultimately, sword strike must just call for the wielder's -offense pose at so-and-so timing. Yes, this does mean there are situations where an unintended wielder uses an animation they don't have, and yes we will need fallbacks, but not doing so would rapidly bloat the cardbase when we really should be moving towards a model where enemies are happy to share card pools between each other.

And, told that a card's wielder is already a run-time fact in the engine, the same day:

> I know this may contradict what I just said, but I do think cards should have owners, but that the owner of a card is not inherent to the card's entry in our game files. Brienne still needs to own sword strike in her game, my issue was inherently tying that owner and card together, since that will make enemy design much harder, and already has bugs in-game right now, since buying a neutral card can make a broken character attack. Cards should be assigned owners in-game, but I specifically want an *inherently* ownerless system.  Please change docs to reflect that and draft up a plan that will take us there, since it seems like a smaller change than the entire Quality Lab and will likely help us down the road.

The bug he names is traced in `BRIEF.md` §3.3; the plan is `BRIEF.md` §4–§6.

---

### D1. Who owns a shared-pool card at a reward or in the shop ⏸

A neutral card is dealt to nobody today, which is the bug. After Step 3 it must be dealt to
someone. The plan puts a portrait row on the take screen and on the shelf, defaulting by
`tuning.deck.sharedCardOwnerRule`. **Needs:** the default rule (the front member, or the member
with the fewest cards, or always ask), and whether the row is wanted at all or a fixed rule is enough.

---

### D2. Curses take an owner like any card ⏸

`curseDread` and `curseWisp` are ownerless today; a Wisp is playable, and the front member casts it.
The plan gives a curse the owner its granting site names (the event's subject, the member an enemy
aimed at). The only effect of an owner on a curse is who is shown holding it and whose owner-down
policy applies, and characters never go down. **Needs:** yes, or a reason to keep curses ownerless.

---

### D3. The owner decides the Broken form ⏸

After Step 4 a card's own `brokenCard` still wins; otherwise the OWNER's `brokenCardByRarity` and
catch-all apply, not the entry's character. So a Broken Brienne's neutral card becomes Brienne's
catch-all, which is the fix, and a card of Anastasia's owned by Brienne also becomes Brienne's
catch-all rather than Anastasia's by-rarity form. **Needs:** confirmation of that second consequence.

---

### D4. Four orphans ⏸

`nettleStrike` is a starter-rarity Nettle card that no starting deck, outfit or node names, reachable
only from the compendium and the Battle Lab. `gloomWispFade`, `alchemistDraught` and
`sentinelRetort` are enemy moves in no move list. The pool rule will list them every boot until they
are placed or deleted. **Needs:** place or delete, each.

---

### D5. Pool shape ⏸

The plan generates one pool per character holding every card that names that character today
(starters, commons, rares and broken forms together) plus `neutral`, and leaves outfit, node and
equipment additions where they are, so nothing a player is offered changes. Finer pools (by rarity,
by theme, shared between two characters) are a table edit afterwards. **Needs:** confirmation that
the first cut is one pool per character, not a split.

---

### D6. Enemy pools now or later ⏸

Move lists are already on the enemy's side and six moves are already shared. Step 6 lets a move-list
entry name a pool, so enemies share pools by naming them and a character's card can sit in one.
**Needs:** whether that is wanted in the first build or after.

---

### D7. The save fill ⏸

Format 11 gives every ownerless instance in an existing save an owner on load: the member whose
character the card named before this change if present, else the front member. **Needs:**
confirmation, or a different rule for old saves.

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
