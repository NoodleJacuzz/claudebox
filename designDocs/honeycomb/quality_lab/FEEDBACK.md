# Quality Lab — FEEDBACK

The Quality Lab: a bench for tuning how an attack looks and sounds, and the timing data it exports.
The design is `BRIEF.md`; this file holds what it waits on.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins. The whole pitch is quoted in `BRIEF.md` §1; each item repeats only the
sentence it turns on. Seven of the eight questions the first draft asked were answered on 2026-09-25
and are in `_archive/FEEDBACK-DONE.md` with his answers; the one below opened work instead of closing it.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `CATCH-UP.md`. What the project is: `../BASICS.md`.

---

### Q4. Ownerless cards: the dummy allies, and the answer that is bigger than the lab ☐

> 1-5x dummy allies and enemies, each assigned a single card

The first draft stood N copies of the literal card's owner on the party line so that owner-relative
effects and the owner's own poses would be the real ones, and asked whether he wanted copies or the
roster. Noodle, 2026-09-25:

> Absolutely not. We must move to an inherently ownerless card system. Assigning card ownership within the card's identity itself was a huge design mistake we made right from the start. If we just need the card "sword strike", we should not need to do anything with Brienne. That is not modular design.
> I think we should be able to change the actors serving as dummies, and the VFX picker should be able to display the poses of the selected actor, but ultimately, sword strike must just call for the wielder's -offense pose at so-and-so timing. Yes, this does mean there are situations where an unintended wielder uses an animation they don't have, and yes we will need fallbacks, but not doing so would rapidly bloat the cardbase when we really should be moving towards a model where enemies are happy to share card pools between each other.

**What it changes in the lab** (all in `BRIEF.md` now): any actor stands in any dummy slot on either
side; every actor plays the literal card as its own source, enemies included (his Q3 answer says the
same from the other direction); a card asks for a pose by ROLE and the wielder's sprite chain resolves
it, falling back rather than erroring; the pose picker shows the selected wielder's poses.

**What it changes outside the lab, and this is why the item stays open.** Ownership reaches the
engine in three places (`BRIEF.md` §2.3): the character pools that decide who is offered a card,
`honeycomb.defaultOwnerFor` and the Battle Lab's ⚠ on an ownerless card, and the owner-relative
effects and modifiers that read the owner rather than the player of the card. Undoing that is a plan of
its own, on the scale of a card-pool rework, and it is not written. The lab needs only its first step,
a card playable from any source with the effects the source cannot use resolving to nothing, which is
`BRIEF.md` P0 and part of Phase 0.

**Not started.** The rest of ownerless cards wants its own folder and a direct plan, per his Q7 answer
(archive). A pointer sits in the root `../FEEDBACK.md` inbox so the next card session finds it.

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
