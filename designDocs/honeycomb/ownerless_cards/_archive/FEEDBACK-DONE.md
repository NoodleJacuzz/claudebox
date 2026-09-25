# Ownerless cards — FEEDBACK, done

Closed items, quote and annotation together, moved here from `../FEEDBACK.md`. The plan
(`../BRIEF.md`, 2026-09-25) asked seven questions; Noodle answered all seven the same day. Every
quote is his, verbatim. Two answers left the choice to the builder; those choices are
`../INFERENCES.md`.

---

### D1. Who owns a shared-pool card at a reward or in the shop ☑ — answered 2026-09-25

The plan had put a portrait row on the take screen and on the shelf, defaulting by a tuning rule,
and asked for the default.

> Very difficult question. It'd require a UI change but I think the best way to handle it is that in order to buy a card you grab and drag over to a popup of each of your party members. Opening a window to ask would get old real quick, and we started standardizing selections between abilities and cards, selections in general could stand to be standardized more.

**Settled, and the design changed.** No question is ever asked. Taking a reward card and buying a
shop card are the same gesture: the card is dragged onto the party member who takes it, from a
popup of the members, on the drag machinery a card is aimed with in combat (pointer capture, legal
marks, tap then tap on touch). The tuning rule for a default owner is gone; the legal targets are
highlighted instead (`../BRIEF.md` §4.2, Step 3). His wider point, that selections should be
standardised further, is recorded in `../../ui/FEEDBACK.md`'s unsorted section for the screens work.

---

### D2. Curses take an owner like any card ☑ — answered 2026-09-25

> I'm fine either way. Curses being added to the deck and following current behavior isn't a huge priority, curses being reworked to have owners when added to the deck is fine too, so long as broken behaviors are updated for general cases on rarity and specific exceptions are allowed (to allow Clement to have a full alt deck while most characters just get one broken card design per rarity).

**Settled by the builder: curses take an owner** (`../INFERENCES.md` I1). The condition he attaches
is the shape of the Broken lookup, and it is already the plan's: the general case is one broken
design per rarity on the character (`brokenCardByRarity`), the exception is a per-card `brokenCard`
(Clemence's full alt deck), and a card's own form always wins. What the content lacks is the general
case itself: only Anastasia has per-rarity rows today, the other six have one catch-all each. That is
card-pool content, recorded in `../../rework/cards/FEEDBACK.md`'s unsorted section.

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
desktop, in Step 5 (`../BRIEF.md` §6). Nothing was deleted in the cloud copy, which is not the
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

**Settled by the builder: later** (`../INFERENCES.md` I3). Nothing today needs it, the six shared
queen moves already work through plain move lists, and the first thing that would benefit is the
Quality Lab's picker. Step 6 runs when that picker is built or when an enemy design first wants a
shared pool, whichever comes first.

---

### D7. The save fill ☑ — answered 2026-09-25

> That's fine.

**Settled.** Format 11 fills every ownerless instance on load: the member whose character the card
named before this change if present, else the front member.
