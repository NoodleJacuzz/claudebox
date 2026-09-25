# UI and tooling — FEEDBACK, done

Closed items, quote and annotation together, moved byte for byte from `../FEEDBACK.md`.

---

### P18. The shop should show party HP and Lust ☑ — DONE SESSION 55

> Shop needs to show party member HP and lust

The shop sells healing and Lust treatment at its counter, and the numbers those prices are worth
judging against were two screens away: the party window, and then a character inside it.

A row per party member now sits between the shop's tabs and its stock, showing the face, the name,
health over maximum, any Temporary HP carried in, and Lust. A member who is Broken says so. The rows lie
side by side and wrap, so three of them cost one line of the panel rather than three.

It reads off the RUN, so the benched roster is not listed, and it uses the same row markup and the same
`--hc-px` lengths as the panels around it. `honeycomb.shop.partyConditionMarkup` is the whole of it, and
it returns an empty string outside a run, so the Mail Order shop opened from a rest is unaffected.

**Not done:** buying a treatment still does not say what it will leave a character at. The counter could
print "Nettle: 22 Lust becomes 12" beside the price. The player can now work that out from the rows
above it, so this is a convenience rather than a gap.

---

### P19. Trip Line's card text is too long ☑ — FIXED SESSION 55, AND IT WAS ELEVEN MOVES

> Trip Line card text too long

**Trip Line is an enemy move, and a flavour line was being printed onto its intent card.** The `message`
effect exists to put a line into the combat LOG — its own comment in `honeycomb-effects.js` says so —
but it also described itself as that sentence, so the sentence went onto the card beside the rules.

What the card said, at 151 characters against a median enemy move of 44:

> Deal 4 damage to the party member in front. The party member in front moves to the back. A vine loop
> whips around an ankle and somebody sits down hard.

What it says now, at 88:

> Deal 4 damage to the party member in front. The party member in front moves to the back.

**Eleven moves append a flavour line this way**, so eleven cards got shorter, not one: the Matriarch's
Brood, Wail and Seed, Big Bomb, Wild Balm, Tarnished Locket, Plant, Overgrow, Trip Line, Windfall and
Lost the Thread. The longest enemy move in the game went from 158 characters to 136.

**A twelfth card is a message and nothing else.** Befuddled, the card a cancelled intent telegraphs,
carries its own `text: "Does nothing."`, so it still reads. Checked: no card in the game now prints an
empty rules box.

**The remaining long ones are long for a real reason.** Crush at 136 is three separate effects on one
target, not flavour. Whether those want shortening is a different question and it is his.

---

### A-S47f. The forecast's footnotes contradicted each other — FIXED session 47

> Forecasting is broken in terms of footnote messages. "Nothing is about to change it. They break unless something changes." That's me hovering over a pawn forecasted to die to an upcoming attack.

**Two faults with one cause.** The break margin is `standingAfter − lustAfter` (`honeycomb-forecast.js`),
so LETHAL damage drives `standingAfter` to zero and the margin to zero or less — **on a body holding no
Lust at all**. `mightBreak` then fired, and the lust panel printed "They break unless something changes."
directly under a forecast section that was correctly reporting that nothing was about to change the Lust.

Breaking is what happens to somebody still standing; dying is what happens instead. So:

1. `summary.mightBreak` now additionally requires `downed != true`, `certainDowned != true` and
   `standingAfter > 0`.
2. The lust panel prints a new line, `lust.breakMoot` — **"They fall before Lust decides anything."** —
   whenever the mark is lethal or `healthAfter` is 0, instead of the break warning.

Suite block `[119]`.

---

### A-S47g. A piece's move button sat over its status icons, then over its art — SETTLED session 47

> All pieces, their ability bar covers their status effects.

and, after a first attempt moved it above the health bar:

> Lower the ability, not raise it. It needs to be below debuffs (if any). If it's at the top of the nameplate it blocks the art.

> Pawn intent cards are now flying way above the character sprite, a pawn's "Gnash" intent preview is roughly at Anastasia's eye level.

**The original fault:** `.hcGolemMove` inherited `.hcAbilityMenu`'s `position: absolute; top: 122
plate-u` — a fixed drop that STARTS inside the first row of status circles (108 plate-u, each circle 104
tall) and sinks further under them with every status gained. A fixed drop cannot clear a row that wraps.

**Settled arrangement:** the circles and the button share one flow box (`.hcPlateStack`, emitted only for
a piece), placed where the circles used to sit, so the button always follows whatever they grew to. The
telegraph lift added by the first attempt is removed entirely and a note left in its place.

**The cost, measured and accepted by him:** a fighter's plate sits near its feet, so at 1280×720 with four
statuses the button's last few pixels can cross the foot of the battlefield. The three arrangements
measured were — button under the circles: button 5px past the battlefield; circles under the button:
icons 38px past it; button above the bar: covers the drawing. He picked the first.

---

### S58c-1. The save text was far too long, and there was no .noodle file — FIXED (session 58c) ☑

> "Quick honeycomb thing, the savedata's way too long. Gotta find a way to scale it down safely, and add
> option to save to .noodle file as syrup town does"

**Shorter.** Copy / Load Save now hands out the save compressed. The browser's own `CompressionStream`
deflates the text, the result is written as base64, and it starts with `HC1~` so a load can tell it apart
from plain JSON. On the save Noodle sent (`honey save.txt`) that is 7,812 characters instead of 29,746,
about a quarter. Nothing is dropped, rounded or rebuilt: unpacking gives back the exact same text, so the
save that loads is the same save that went out.

Things that were considered and not done, because they are not safe: dropping the `null` fields, rounding
the map node positions, and rebuilding the map from the seed instead of saving it. Each would shrink the
save a little more, but each changes what comes back.

**The .noodle file.** The panel has two new buttons: **Save to .noodle file** downloads a file named like
`Honeycomb 2026-09-23 15-04.noodle`, the same way Syrup Town's button does, and **Load from .noodle file**
opens a file picker. The file holds the same compressed text as the copy box. Old plain-text saves and bug
reports still load, from the box or from a file. A damaged paste or the wrong file shows a message and
leaves the current save alone.

**What did not change.** The autosave and the six slots in the browser's storage stay plain JSON. They are
written on every node and every turn, and compressing them would make every one of those writes wait.

**Reading one he sends.** A packed save cannot be read by eye. `tools/save-text.js unpack <file>` turns it
back into readable JSON through the game's own code.

Checked in the browser on port 8020: the panel packs a save, the file download holds the same text as the
box, his packed save loaded through the file picker onto the map with the same seed, day and 22-card deck,
a typed paste survives the panel redrawing, and junk text is refused with the save untouched. At 812x375
every button sits inside the panel. Suite block [140], 12 checks; the round-trip check fails if packing is
switched off, which was seen happen when Node refused the first format name tried.

---

### S57-1. The enemy's intent card covered its first debuff — FIXED (session 57) ☑

> "Also the ennemy card position masks their first debuff D:"

The intent card leans out beside the enemy at nameplate height, and every other enemy's card steps sideways
(`intentStaggerLeftPercent: 26`) so neighbours do not overlap. That step put the card over the first one or
two status circles. Measured at 1280x720 with three debuffs on three Sporelings: the middle one lost two
whole circles under its card.

The card was drawn on top of the nameplate (z-index 4 against 2). It now rests at 1, still in front of the
figure but behind its own nameplate and status circles, and comes to the front (6) while hovered so it can
be read. A charged move's bigger card lost its own lift to 5. A boss standing behind her row keeps her card
above her brood at 4, under her plate at 5.

Checked in the browser on four fights (Spore Trio, Hollow Patrol, the Matriarch, the Arbor Twins): every
status circle is the topmost thing at its own centre. With the old z-index put back on the same page, one
circle is hidden, so the measurement can fail. Card names and damage badges still show. Suite block [137].

---

### B29. Debug menu: win button is too many steps ☆

> Debug menu win button too many steps to reach

Pure ergonomics, and it is in the way of his own testing — which makes it a **B16 and A12 enabler**,
not a nicety. Same family as A12's "phone testing really needs to be Easier": both are about him being
able to reach a state quickly enough to measure it. Worth fixing in the same pass as the large-hit-target
test path.


**☑ DONE session 47.** It was Menu → Debug Tools → scroll a 46vh list under four pickers → press.
Now **one press**: a star button on the top bar of the fight itself. Table-driven — a debug action says
where else it is drawn by a field on its own entry (`quick`: pinned above the pickers in the panel;
`topBar`: an icon on the in-run top bar), so promoting another tool is one line
(`honeycomb.debug.shortcutMarkup`). Only what is `available` is drawn, so nothing shows on the map, and
nothing at all with `tuning.debug.enabled` off. Verified live: one click → phase `victory`, overlay open;
0 shortcuts on the map; "" with the switch off. Lose is pinned in the panel only — one stray press from
the top bar ending a run seemed the wrong trade. Suite block [117].

---

