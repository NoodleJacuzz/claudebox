# Small fixes

Each of these can be done in one sitting and needs no design choice. Items marked "(revamp)"
would be absorbed by the minigame revamp in `!designDocs/project_ideas/IDEAS.md`, so they're only
worth doing alone if the revamp isn't happening soon.

Found on 2026-09-23 (round 1). Tick items off by deleting them or adding "DONE" and the date.

## Navigation

- **Fetch neighbouring location pictures ahead of time.** Walking from Pinecone Plaza to Riverside
  Road showed the signs on an empty black frame for about a third of a second before the picture
  arrived, and that was on a local machine. Neocities will be slower. Each location already knows
  its neighbours, so the game can quietly load their pictures while the player reads.
- **Style the name box in Sorbet's intro** (`scripts/characters/wolf.js` line 63, the
  `nameSubmission-wolf` input). It's a plain white browser box with tiny default text inside the
  dark dialogue box. Give it the dialogue font, a dark fill and an underline. Check the other
  characters' naming boxes too, since they probably share the same look.

## Title screen

- **The in-game menu flashes before the title appears.** On the very first load, the Save,
  Settings, Inventory, Log and Trophies bars showed for a moment before the title screen covered
  them. Hiding the menu until the title has drawn would stop it.

## Digging (all "revamp")

- **A chest can look dug out without counting.** A 3x3 chest showed its whole picture, but its
  bottom row of tiles still had 1 hit left each. Pressing Finish Early then said "You found nothing
  of value." Either draw a treasure only once every tile over it is clear, or mark it clearly (a
  sparkle, a sound or a tick) the moment it fully counts. (revamp)
- **Ordinary treasures give no signal when they come free.** Only mystery chests react. Players
  find out what they got on the results screen. (revamp)
- **The heart counter and the pickaxe button look like placeholders.** "30/30♡" is small grey
  default text, and the pickaxe is a flat bright-green square with black line art. (revamp)
- **Finish Early is cut off** at the bottom of a 720p screen. (revamp)
- **The found-treasure sort in `digFinish` does nothing** (`scripts/misc/test.js`, around line
  1765). The list holds treasure names, and the sort compares `.size`, which a name doesn't have.
  The comment says smallest to largest, but the comparison would put the largest first. Harmless
  as things stand. (revamp)

## Jiggy

- **The pieces crowd the left third of a wide screen.** With a portrait picture, the scatter area
  takes the picture's tall shape and pins to the top-left corner. On 1280x720 the pieces ran about
  70px off the bottom while the right two-thirds of the screen stayed empty. The scatter area
  should take the screen's shape. (revamp)
- **The easy-mode zoom overrules the minimum piece size** (`fitJiggyToViewport` in
  `scripts/items/jiggy.js`). The function keeps pieces from shrinking below a grabbable size, and
  then the 0.6 easy-mode default shrinks them anyway. Single cells showed at 30px against a 50px
  floor. It didn't hurt here, because clusters are several cells wide. (revamp)
- **The ">", "+", "-" and "X" controls are bare blue characters** with no button shape. (revamp)
- **An out-of-date comment on `jiggyTest`** says it's wired to the title's Mods button and should
  be removed before release. The Mods button now opens the mod hub, so only the comment is stale.

## Grotto

- **The "Leave the grotto" button sits below the fold** under the stamina bar at 720p. (revamp)

## Unexplained

- One uncaught error showed in the console: something tried to read `innerHTML` of nothing after
  a click. It couldn't be traced to a particular click, and it may have come from Claude jumping
  between screens with console commands. Worth watching for.
