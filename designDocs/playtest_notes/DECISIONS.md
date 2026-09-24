# Decisions for Noodle

Each of these needs Noodle to say what he wants before anyone changes code. None are urgent.

Found on 2026-09-23 (round 1).

## Look

- **The default-looking blue.** One bright blue shows up in places that don't come from the art:
  the "<" sidebar arrow, the "v12.9" label, button text, the "Noodle Jacuzzi" link and the jiggy's
  controls. Should these take a colour from the art instead, like the sign brown or the notebook
  cream? If yes, which one?
- **The three title buttons.** New Game, Continue and Mods are each a different pastel with a
  different text colour, right under a busy logo. Keep them as they are, or give them one shared
  text colour?
- **The "v12.9" label.** It sits half off the edge of the sign in blue italic, and its position is
  set in fixed pixels, so it could drift on other screen sizes. It's also a secret button that opens
  the changelog. Should players be told it's clickable, should it move, or is it fine?
- **The neon green "Important note"** in the grotto intro. It's much harsher than the rest of the
  text. Is the bright colour on purpose, to make sure people read it?

## Navigation

- **Encounters below the fold.** At 720p only one encounter card fits under the map. Pinecone
  Plaza had three (the nun, the fashionista wolf, the hyena), and nothing showed that two more were
  below. Options: smaller cards, cards side by side, or a small "2 more below" note.

## Grotto

- **Doors with no names.** You don't learn which room you're entering until you arrive. Is that on
  purpose, for the feeling of exploring? If not, a small label under each door picture would help.
- **The gather button can never appear.** In `grottoMove` (`scripts/misc/test.js`, line 2514),
  `isGatherNode = false;` runs right before the check that would draw the "?" gather button. Was it
  switched off on purpose? If not, that line is the cause.
