# Engine — ARCHIVE

Closed items from `ENGINE.md`, newest first, pasted here the minute they close: quote and annotation
together, unchanged. Nothing here is open work. Items closed before 2026-09-25 are in `../Archive/demo1/`, at the
old folder's path.

---

## Ownerless cards: the direction and the seven decisions, answered 2026-09-25

### Ownerless cards: the direction (Noodle, 2026-09-25)


Answering a Quality Lab question about who its dummy allies should be:

> Absolutely not. We must move to an inherently ownerless card system. Assigning card ownership within the card's identity itself was a huge design mistake we made right from the start. If we just need the card "sword strike", we should not need to do anything with Brienne. That is not modular design.
> I think we should be able to change the actors serving as dummies, and the VFX picker should be able to display the poses of the selected actor, but ultimately, sword strike must just call for the wielder's -offense pose at so-and-so timing. Yes, this does mean there are situations where an unintended wielder uses an animation they don't have, and yes we will need fallbacks, but not doing so would rapidly bloat the cardbase when we really should be moving towards a model where enemies are happy to share card pools between each other.

And, told that a card's wielder is already a run-time fact in the engine, the same day:

> I know this may contradict what I just said, but I do think cards should have owners, but that the owner of a card is not inherent to the card's entry in our game files. Brienne still needs to own sword strike in her game, my issue was inherently tying that owner and card together, since that will make enemy design much harder, and already has bugs in-game right now, since buying a neutral card can make a broken character attack. Cards should be assigned owners in-game, but I specifically want an *inherently* ownerless system.  Please change docs to reflect that and draft up a plan that will take us there, since it seems like a smaller change than the entire Quality Lab and will likely help us down the road.

The bug he names is traced in `OWNERLESS-CARDS-BRIEF.md` §3.3; the plan is `OWNERLESS-CARDS-BRIEF.md` §4–§6.


---


### D1. Who owns a shared-pool card at a reward or in the shop ☑ — answered 2026-09-25

The plan had put a portrait row on the take screen and on the shelf, defaulting by a tuning rule,
and asked for the default.

> Very difficult question. It'd require a UI change but I think the best way to handle it is that in order to buy a card you grab and drag over to a popup of each of your party members. Opening a window to ask would get old real quick, and we started standardizing selections between abilities and cards, selections in general could stand to be standardized more.

**Settled, and the design changed.** No question is ever asked. Taking a reward card and buying a
shop card are the same gesture: the card is dragged onto the party member who takes it, from a
popup of the members, on the drag machinery a card is aimed with in combat (pointer capture, legal
marks, tap then tap on touch). The tuning rule for a default owner is gone; the legal targets are
highlighted instead (`OWNERLESS-CARDS-BRIEF.md` §4.2, Step 3). His wider point, that selections should be
standardised further, is recorded in `ENGINE.md`'s unsorted section for the screens work.

---

### D2. Curses take an owner like any card ☑ — answered 2026-09-25

> I'm fine either way. Curses being added to the deck and following current behavior isn't a huge priority, curses being reworked to have owners when added to the deck is fine too, so long as broken behaviors are updated for general cases on rarity and specific exceptions are allowed (to allow Clement to have a full alt deck while most characters just get one broken card design per rarity).

**Settled by the builder: curses take an owner** (`OWNERLESS-CARDS-INFERENCES.md` I1). The condition he attaches
is the shape of the Broken lookup, and it is already the plan's: the general case is one broken
design per rarity on the character (`brokenCardByRarity`), the exception is a per-card `brokenCard`
(Clemence's full alt deck), and a card's own form always wins. What the content lacks is the general
case itself: only Anastasia has per-rarity rows today, the other six have one catch-all each. That is
card-pool content, recorded in `../card_pool/CARD-POOL.md`'s unsorted section.

---

### D3. The owner decides the Broken form ☑ — answered 2026-09-25

> Oof, but that breaks clement though, doesn't it? How do we give clement her own equivalent to each card while also allowing for neutral cards to take on the owner's broken state?

**It does not break Clemence, and here is why.** The resolution order is unchanged from today: a
card's own `brokenCard` is tier one, and every one of her 34 cards names its own form, so as long as
she owns her cards her alt deck is exactly what it is now. The owner's rows (tier two, per rarity;
tier three, the catch-all) are consulted only for a card that has no form of its own: a neutral
card, a stolen move, a card whose author left the field off. So a neutral common owned by a Broken
Clemence takes her common design once she has per-rarity rows, and her catch-all until then. The
only case where the owner overrides a card's own form is when the card has none. The consequence
the plan flagged, a card of one character owned by another, is ruled out for player pools by D5.

---

### D4. Four orphans ☑ — answered 2026-09-25

> Delete. But to be clear, deleting it here would do nothing for the project.

**Settled: delete `nettleStrike`, `gloomWispFade`, `alchemistDraught` and `sentinelRetort`**, on the
desktop, in Step 5 (`OWNERLESS-CARDS-BRIEF.md` §6). Nothing was deleted in the cloud copy, which is not the
source of truth.

---

### D5. Pool shape ☑ — answered 2026-09-25

> I think that pool shape is fine, though not a single card in the entire pool should be shared between two player characters. That's not an absolute hard rule, I'd just prefer to design entirely bespoke card pools for each character.

**Settled: one pool per character, and a card in two character pools is a warning**, not an error:
a new rule `cardInTwoCharacterPools` reports it, and a deliberate exception goes in
`tuning.warnings.ignoredArray` where it stays visible, which is how BASICS handles a rule that is a
preference rather than a law. The neutral pool is shared by design and outside the rule.

---

### D6. Enemy pools now or later ☑ — answered 2026-09-25

> Your choice.

**Settled by the builder: later** (`OWNERLESS-CARDS-INFERENCES.md` I3). Nothing today needs it, the six shared
queen moves already work through plain move lists, and the first thing that would benefit is the
Quality Lab's picker. Step 6 runs when that picker is built or when an enemy design first wants a
shared pool, whichever comes first.

---

### D7. The save fill ☑ — answered 2026-09-25

> That's fine.

**Settled.** Format 11 fills every ownerless instance on load: the member whose character the card
named before this change if present, else the front member.

---

### B43. Slowdown in the first moments after a refresh, after the art pass ☑ — CLOSED 2026-09-25 — 2026-09-22

> Likely the final issue on the matter, I noticed a lot of slowdown the first few moments after
> refreshing, likely loading the new images in. Are we in for more reports of performance issues?

**Measured the same day, in the browser pane, not on player hardware.**

- **The new art is not heavier.** The default outfits hold 100 pictures, 10.4 MB and 139 megapixels,
  against 105, 10.8 MB and 143 megapixels before the art pass. Poses are 1216 tall now, smaller than the
  650x1300 stand-ins they replaced.
- **The boot** loads 121 images, 2.1 MB, most of it card frames and card art, and has one long task of
  212 ms (the scripts starting). Teambuilding and the first fight added no long tasks at all.
- **What costs time is fetching, not drawing.** On a local server a 15 KB portrait took 600 to 1250 ms to
  arrive, because it queued behind the boot's other requests. A player's first visit pays that over the
  network.
- **The likeliest cause of what Noodle saw is a cold cache.** Every character picture changed at once,
  so the first load after the pass downloaded and decoded all of them fresh. Later loads read them from
  the browser's cache. A player's first visit is always cold, and was before the art pass too.
- **The largest pictures are the cut-ins.** Every `1-broken`, `2-broken` and `recover` is 1664 or more
  wide by 2432 tall, 4 to 4.7 megapixels, about four times a pose. They are not loaded at the start; they
  are decoded the first time a cut-in plays, which is a possible stutter at the moment a character breaks.
  Writing them at 1216 tall (they are never drawn taller than the screen) would make each a quarter of
  the size. Offered to Noodle, not done.

**Cut-ins done, same day.** Noodle: *"Yes, please do size the cut-ins to a reasonable amount, 1216 would be
fine."* `png-to-webp.py` now writes `1-broken`, `2-broken` and `recover` 1216 tall (`CUT_IN_NAME`), and all 17
were re-converted: 1.56 MB together, each a quarter of its former pixels. Both cut-ins size themselves as a share
of the screen and the recover windows are percentages of the picture, so nothing moved on screen.

**Closed 2026-09-25.** Measured the same day it was raised (a cold cache, not heavier art) and the one action it produced, the cut-ins written at 1216 tall, was done. Nothing else was asked.

---
