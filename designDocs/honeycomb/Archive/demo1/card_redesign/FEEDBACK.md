# Card redesign — FEEDBACK

The card face: frames, chrome, rarity marks, ribbons. **No gameplay changes** — what a card DOES is `../rework/cards/FEEDBACK.md`.

**Quotes are Noodle's, verbatim. Do not summarise this file; add to it.** If an annotation and a
quote disagree, the quote wins. Items were split out of the round-09 file in session 41 and moved
byte for byte — nothing was rewritten on the way.

**Annotate an item the moment it lands**, not in a batch at the end, so a session stopped midway
can be picked up from this file alone. Move finished items to `_archive/FEEDBACK-DONE.md`.

When an item is closed, update the count in `../FEEDBACK.md` — that table is how a session
tells whether the previous one ended before it could write its docs.

Status key: ☐ not started · ◐ in progress · ⏸ waiting on Noodle · ☑ done · ☆ new, unsorted

Where the work is: `../CATCH-UP.md` / `STATUS.md`. What the project is: `../BASICS.md`.

---

### A2. The gold trim on broken cards — ANSWERED (session 39) ☐

> Broken cards are too similar to regular cards. Maybe hue-shift the gold trim? Not the border, but the
> actual gold frame?

> Good point, I forgot the bench needed to be updated to use live cards as a base. But the frame recolor
> should be simple enough that we can apply it to both without a big hassle.

**Apply the hue-shift to both** the current frames and `../card_redesign/`, and **update the bench to use
live cards as its base** while in there — that is the thing that made this look like a conflict in the
first place. `../card_redesign/STATUS.md` being mid-rebuild is no longer a reason to wait.

He also drew a terminology line worth keeping in the vocabulary of this file:

> Random aside, but to avoid confusion, I'm specifically talking about changing the gold trim, not the
> border, because "card frame" can mean multiple things based on context, though darkening the card's
> border as well for broken cards would be an easy and distinct idea 🤔

**Gold trim ≠ border.** The hue-shift is the gold trim. Darkening the *border* for broken cards is a
separate, additional idea he floated as easy — treat it as a second lever to show him, not as part of
the same change.

---

### A3. Starter, common and rare — ANSWERED (session 39), and it REVERSES C1 ☐

> Common and starter cards look identical.

> Starter cards should be the only one without a gem. For now, the demarcation is Starter (horizontal,
> no gem), Common (horizontal, gem), Rare (vertical, I think I'd like the gem removed). And broken
> versions would have the rose effect (still not totally satisfied on that, but it's not a huge
> priority) and shifted frames.

**Read this before touching the gem: C1 acted on a misread instruction.** Confirmed by him, session 39:

> Yes A3 reverses C1, I never meant to remove the gem from common, only starter at the time.

So C1 was not a decision he changed his mind about — it removed the gem from the wrong rarity. The
correct reading of the round-07 note was **starter only**. Session 39 sets:

| Rarity | Orientation | Gem |
|---|---|---|
| Starter | horizontal | **no** |
| Common | horizontal | **yes** |
| Rare | vertical | **no** |
| Broken | shifted frames | rose effect |

The logic is consistent even though the instruction inverted: **rare no longer needs the gem because
orientation already marks it.** Starter and common are the two that share a shape, so the gem is spent
where it does work. C1's reasoning — "a rarity that says nothing draws nothing" — still holds; the
rarity it says something about changed.

Mechanically this is cheap: `honeycomb.cardRarityArray` already carries `showRarityGem` per rarity and
`honeycomb.cardShowsRarityGem(card)` is what the renderer asks, so this is flipping two flags. **The
suite will fight you** — C1's tests in block `[104]` assert `common:0 … rare:1`. Those assertions are
now wrong and must be rewritten to `starter:0 common:1 rare:0`, not deleted.

Also noted: he is **not fully satisfied with the rose effect** on broken cards, but explicitly ranks it
low priority. Do not open it unasked.

---

### B27. Hide the card ribbon at small size ☆

> Card design. The bench had it set so that at small size the ribbon was hidden, that should be
> implemented live.

The bench already does the right thing; the live renderer does not. Port it. Sits with **A2/A3** — all
three are card chrome, so do them in one pass, and the size threshold is a number and belongs in tuning.

---

## Unsorted — drop new reports for this workstream here

*(a report that does not clearly belong to this workstream goes in `../FEEDBACK.md` instead)*
