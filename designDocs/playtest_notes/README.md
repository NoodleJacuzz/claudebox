# Playtest notes

Notes from Claude playing Syrup Town in the browser, as a player would. Each round of notes is
split by size, so small fixes never get buried under big projects:

- `SMALL-FIXES.md` holds things that can each be done in one sitting, with no design choice needed.
- `DECISIONS.md` holds things where Noodle has to choose what he wants before anyone touches code.
- Big projects don't live here. They go in `!designDocs/project_ideas/IDEAS.md`, and this folder only
  points at them.

- `REPORTS-2026-09-26.md` holds Noodle's own bug reports and requests from the last cloud session,
  verbatim and tiered: Syrup Town, the memory leak, the WebUI.

## Round 1: 2026-09-23

Played at a 1280x720 desktop size only, with no phone sizes. The browser pane caps animation at
30 frames a second, so nothing here judges smoothness. The save used was `syrupSample.noodle`.

Stops, in order: the title screen, walking around Pinecone Plaza and Riverside Road (including
Sorbet's intro), the digging minigame at Lakeside Ruins, a 75-piece jiggy (`foxf/jiggyCore1`,
easy mode), and the grotto entered from Lakeside Ruins.

### What works, and should survive any change

- **The notebook side menu.** Noodle is proud of it, and it holds the whole screen together.
- **The pastel colours** across buttons, borders and the notebook. Noodle is proud of these too.
- The wooden signs painted onto each location picture. This is the best part of the interface.
- The blurred copy of the location picture that fills the background.
- Evening and night versions of locations, which change the lighting.
- Encounter cards with a black silhouette and "???", with a border colour that matches the character.
- Dialogue portraits with small sweat drops and "!?" marks.
- The logo letters shuffling into place on the title screen.
- The grotto's doors, which are small framed pictures of the next room.
- The red-to-green stamina bar in the grotto.

Anything that gets restyled should borrow from these, especially the notebook and the pastels.

### Big project that came out of this round

- **Minigame revamp** (digging, jiggy and grotto). It's in `!designDocs/project_ideas/IDEAS.md`.
  Several small fixes below would be absorbed by it, and they're marked "(revamp)".
