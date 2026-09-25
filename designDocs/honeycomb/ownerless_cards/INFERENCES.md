# Ownerless cards — INFERENCES

Choices `BRIEF.md` makes that Noodle did not make himself. Each is a tuning value or a small rule, so
changing his mind is a one-line edit. Add to this file when a new guess is made; never put guesses in
the brief.

| # | The guess | Where it lives | How to change it |
|---|---|---|---|
| I1 | Curses take an owner like any other card (he said "fine either way", D2). The owner is whoever the granting site names: the event's subject, or the member an enemy aimed at. | `ownerForCreatedCard` and the `addCardToDeck` entry's `owner` field, `BRIEF.md` §4.2 | let the two curse entries name `owner: "none"` and keep `cardActingEntity`'s null answer for them |
| I2 | A card from a character's pool may be dropped only on that character; a shared-pool card on anyone. He asked for bespoke pools (D5), so a cross-character drop is off by default. | `tuning.deck.crossOwnerAcquisition: false` | set it true and every member becomes a legal target for every card |
| I3 | Enemy pools (Step 6) come after Step 5, when the Quality Lab's picker is built or an enemy design first wants a shared pool (he said "your choice", D6). | `BRIEF.md` §6, Step 6 | build it earlier; nothing in Steps 1–5 depends on it either way |
| I4 | The drag-to-a-member gesture for taking and buying a card is built on the combat aim machinery (the same pointer capture, legal marks and tap-then-tap path a card is aimed with), not on a new drag. He asked for the gesture and for selections to be standardised; the reuse is the builder's reading of that. | `BRIEF.md` §4.2 and Step 3 | a purpose-built drag is the alternative, at the cost of a second selection system |
