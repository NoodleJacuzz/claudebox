# Event Gallery — FEEDBACK, done

Closed items. The live queue is `../FEEDBACK.md`; the folder's map is `../CATCH-UP.md`.

---

## G1 — the heart moves off the map, and the party icons take its job (closed s49)

> remove the top-right heart button on the map screen, we'll re-use it for what I have in mind.
> Instead, clicking the party icons on the left side on the map screen will be what opens the party
> menu. Place the heart button on the teambuilding menu screen, and add a title page button labeled
> "Gallery".

The map's `topBar` call no longer asks for `showParty`. Its party rail passes `onClick` and opens the
party window already reading the face that was pressed (`honeycomb.partyWindow.open(characterIndex)`).
Teambuilding asks for `showGallery`, the new heart. The title screen has a Gallery button beside the
Compendium; both open the one `gallery` overlay.

**Battle keeps its party button** — there is no rail of faces there to press instead.

**The Broken alert came with the button rather than being dropped.** Session 21's report was "BROKEN
state is unintuitive to manage on the map", and the answer was a badge on that heart. The badge is now
on the broken member's own portrait in the rail, which says *who* rather than only *that somebody*.
`.hcPortrait` clips its overflow, so it is drawn inside the frame rather than hung off the corner the
way `.hcAlertBadge` is.

## G2 — the gallery itself (closed s49)

One page per character, the page listing scenes as tiles. `honeycomb.gallerySourceArray` is the source
table (one row today: Lust Events), `honeycomb.gallery.pageArray()` the pages,
`honeycomb.gallery.pageFor()` one page grouped by weakness in content-table order.

Reuses the Compendium's wall-of-faces picker, which moved to `honeycomb.ui.picker` so two screens can
draw it; `honeycomb.compendium.renderPicker` is kept as the name its own pages call it by.

## G3 — membership is opt-in, on the start point only (closed s49)

> Opt-in, because I believe the current plan is to have multi-part scenes as events, meaning opt-out
> would be a lot more work. We want to save the start points of events, and only the start points.

A `gallery` block on a queue row. `partArray` names the later rows the scene continues into, and a
replay plays them in order, so a multi-part scene is one tile.

## G4 — what a locked tile is allowed to say (closed s49)

> I'd love for them to show the requirements for them to know how to get the missing scenes, but we've
> been agreeing events should be able to have complex and multiple requirements, and translating that
> into human-readable text is out of scope.

The mechanical half only: the weakness and the rank the row names ("Venom · Sensitised"), or the
weakness alone when the row names no rank. Never the scene's name, art or text.

## G5 — replayable Lust Battles, and both endings (closed s49)

> I really do need to be able to replay lust battles. I want to have win and loss events as separate
> things, which means if you win it you can't see the loss event.

Three parts:

1. **A bug fix that had killed the feature.** `startCombat` documents `victoryEvent` / `defeatEvent`,
   and both `battleContinuation` and `returnParams` read them — but `resolve` never copied them onto
   the request. An authored `victoryEvent` fell through to the "Lust Event Cleared!" stub. Separate
   win and loss *events* could not work at all before this.
2. **A replay does the scene without paying for it.** The host carries `appliesEffects: false`, and an
   effect whose definition carries `sceneStructure` resolves anyway. `startCombat` is the whole list,
   so the fight happens and the experience and weakness beside it do not.
3. **Endings are tiles, derived from the `startCombat` request.** Finishing the scene once opens both.
   Losing a replayed battle opens that one on its own (`profile.galleryUnlockedArray`), which is the
   only thing a replay is allowed to change — Noodle's answer when asked.

**The run survives it.** A Lust Battle builds a run of its own, and the gallery opens from the title
screen where a run may be paused. The player's run is stashed and `honeycomb.save.suspended` holds
every write until it is back, so a browser closed mid-replay loses the replay rather than the run
(`honeycomb.save.write` has exactly one caller, so the one guard covers every path to storage).
Verified in the browser: the autosave on disk was byte-identical throughout a replayed fight.
