# UI and tooling — FEEDBACK, done

Closed items, quote and annotation together, moved byte for byte from `../FEEDBACK.md`.

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

