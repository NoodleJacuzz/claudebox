# Ownerless cards — FEEDBACK

A card's owner is assigned in the run and is never a field on the card's entry. The plan is
`BRIEF.md`; this file holds Noodle's words and what the plan waits on.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins. The seven decisions the plan asked for were all answered on
2026-09-25 and are in `_archive/FEEDBACK-DONE.md` with his answers; the two he left to the builder
are `INFERENCES.md`.

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

**No open items.** Nothing is built yet; the build order is `BRIEF.md` §6, and the first build
session's findings land here.

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
