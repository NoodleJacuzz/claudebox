# Event Gallery — CATCH-UP

**Opened session 49.** Project-wide context is `../BASICS.md`. The queue is `FEEDBACK.md`.

The Event Gallery is where a player rereads the scenes they have seen. One page per character, the
page lists her scenes as pictures, and a tile replays its scene. Lust Events are the only kind of
scene in it today; party events and progress events (`../lust_events/IDEAS.md` §§6–7) are the next
two sources and join as table rows rather than as engine work.

---

## Where it stands

**Built and live, against placeholder content.** Everything below is wired, tested and verified in the
browser. What it is short of is written scenes, which is `../lust_events/`'s job, not this folder's.

### Noodle's four decisions, session 49

> remove the top-right heart button on the map screen, we'll re-use it for what I have in mind.
> Instead, clicking the party icons on the left side on the map screen will be what opens the party
> menu. Place the heart button on the teambuilding menu screen, and add a title page button labeled
> "Gallery".

Done. The map's top bar has no party button; its party portraits open the party window on the face
that was pressed. The heart sits on teambuilding's top bar and opens the gallery; the title screen
has a Gallery button that opens the same overlay. **The Broken alert moved with the button** — it was
session 21's answer to "BROKEN state is unintuitive to manage on the map", so it is now drawn on the
broken member's own portrait in the rail, where it says *who* rather than only *that somebody*.

> Opt-in, because I believe the current plan is to have multi-part scenes as events, meaning opt-out
> would be a lot more work. We want to save the start points of events, and only the start points.

**Membership is opt-in.** A queue row is in the gallery because it carries a `gallery` block, and a
multi-part scene carries that block on its START ROW alone. The later parts are named by the start
row's `partArray` and play straight after it, so a chain is one tile that plays the whole thing.

> I'd love for them to show the requirements for them to know how to get the missing scenes, but we've
> been agreeing events should be able to have complex and multiple requirements, and translating that
> into human-readable text is out of scope.

**A locked tile says the mechanical half and nothing else**: the weakness the row is about and the
rank it wants ("Venom · Sensitised"), which is the part that is always true and needs no prose. A row
whose requirement is anything else says only its weakness. Never the scene's name, art or text.

> I really do need to be able to replay lust battles. I want to have win and loss events as separate
> things, which means if you win it you can't see the loss event.

**A replayed scene refights its battle, and a battle's endings are tiles of their own.** Finishing a
scene once opens both endings, so winning never costs the player the loss scene. Losing a replayed
battle opens that ending too, which is the only thing a replay is allowed to change.

### The follow-up round, same session

Noodle looked at the built window and asked for four things. All four are in.

> We can probably just skip the character selection screen, since the gallery has a side menu.

**The wall of faces is gone.** The window opens straight onto a character — the last one pressed, or
the first on the roster — and the rail changes who. `honeycomb.ui.picker` is no longer used here.

> Could the side menu inside the gallery be based on the look of the roster, with tabs, names, and
> colors, except instead of using the class names and HP, it shows the unlocked scene count vs total?

**The rail IS the roster's widget**: it reuses `.hcRosterEntry` wholesale, so the accent tab down the
left edge, the portrait and the name cannot drift from the teambuilding roster when either is restyled.
The two lines that say the outfit and the HP say `N of M found` instead.

> The gallery is a little small, I'd like it and the event window to be larger.

The gallery panel is a screen's worth now (96vw × 92vh, its two panes scrolling inside it) rather than a
dialog. The **panel** event presentation went from 900 to 1280 honeycomb pixels — `.hcOverlayPanel`'s own
max-width had to be raised on that selector or it clamped straight back. The **scene** presentation was
already full-bleed and is untouched.

> It'll need to be able to display the same kind of events as when you're wandering around on the map
> after all. It won't break doing that, right?

**It does not break, and three bugs were found proving it.** Every one of the eight map events was
replayed under the gallery host, every choice of each, from the title screen with no run: none threw,
none spent, none created a run. The three that did break are fixed and have checks:

1. **A priced choice was a dead button.** The gallery draws every choice as takeable because none of
   them costs anything, but the cost gate in `honeycomb.eventOverlay.choose` refused it anyway — so the
   Quiet Shrine's 30-gold offering looked clickable and silently did nothing. The gate now skips under a
   read-only host, and the price chip is dropped with the previews rather than advertising a charge that
   never happens.
2. **A fight in a map event had nobody to field.** A map event belongs to the party, not to one
   character, so it names no subject and `battleSelectionArray` came back empty: the choice resolved, no
   fight started, nothing was said. `honeycomb.gallery.battleSubject()` falls back to whoever's page is
   open. This is also what will let the party events and progress events of `../lust_events/IDEAS.md`
   §§6-7 carry fights.
3. **A replay begun with NO run left a phantom one behind.** `releaseStash` only restored a stash that
   was non-null, and the gallery is usually opened between runs — so the battle's own throwaway run
   stayed live and the title screen offered to Continue a fight that was over. A `stashHeld` flag now
   says a stash was taken, and restoring a stash of `null` is what throws the battle run away.

**What a map event replay still cannot do**, and is correct: an outcome the fight names no page or event
for falls through to the "Lust Event Cleared!" stub. A map fight has no defeat branch by design — losing
one on the map ends the run — so a replayed loss lands on the stub. Worth an authored defeat page if a
map event ever becomes a gallery tile.

> Did you use placeholder images for the things currently in the gallery?

Yes. No scene has art, so every tile falls back to the character's default portrait
(`default/0-portrait.webp`). The ratio difference Noodle spotted was not the art: endings had been given
a 4:3 crop to make them subordinate while scenes were 3:4, which read as an accident. Every tile crops
3:4 now — measured at 0.747 across all four — and an ending is marked out by its inset and accent edge
instead.

---

## The three rules that hold it together

- **A replay PAYS nothing but still DOES the scene.** No cost, no experience, no weakness, no unlock,
  no discovery, no completion, and no preview or New badge promising any of them. What still resolves
  is any effect whose definition carries `sceneStructure` — `startCombat` is the whole list — because
  a replay that skipped the fight would not be the scene. See `honeycomb.structuralEffectArray`.
- **A replay never touches the player's run.** The gallery opens from the title screen, which has a
  Continue button, so a run may be paused behind it. Two guards: `savesPosition: false` keeps a
  replayed event off the run's one saved-event slot (`honeycomb.eventState.tracked`), and a replayed
  Lust Battle holds the player's run aside with **saving suspended** for the length of the fight
  (`honeycomb.save.suspended`). A browser closed mid-replay therefore loses the replay, not the run.
  The title scene calls `honeycomb.gallery.releaseStash()` on build as a safety net for any exit that
  is not the ordinary one.
- **Anastasia is not a page.** The gallery reads `honeycomb.shippedCharacterArray()`, the single gate,
  so she is not a tile and not one of the anonymous "???" slots either.

---

## Files

| File | Holds |
|---|---|
| `FEEDBACK.md` | This folder's open items. |
| `../lust_events/` | The scenes themselves. The gallery lists what that folder writes. |

Live code: `honeycomb-gallery.js` (the sources, the pages, the tiles, the replay, the battle return).
Touched by it: `honeycomb-ui.js` (`honeycomb.ui.picker`, the top bar's heart, portrait alerts),
`honeycomb-map.js` (the party rail), `honeycomb-scene-title.js` (the Gallery button, the stash safety
net), `honeycomb-scene-teambuilding.js` (the heart), `honeycomb-overlays-map.js` (host fields,
`honeycomb.eventWords`, `honeycomb.structuralEffectArray`), `honeycomb-effects.js`
(`startCombat`), `honeycomb-state.js` (`honeycomb.save.suspended`),
`honeycomb-content-lust-events.js` (the `gallery` block, documented there), `honeycomb.css`.

Suite: block **[122]**, 60 checks. Run it with the rest:

```
node "!designDocs/honeycomb/tools/test-honeycomb.js"
```

---

## How a scene gets into the gallery

A queue row in `honeycomb-content-lust-events.js`:

```js
{
    index: "nettleVenom1", character: "nettle", tag: "venom", rank: 1, event: "lustEventFirstStirring",
    gallery: { name: "A vial she can't identify", partArray: ["nettleVenom2"] },
},
```

`gallery: true` takes every default. A block overrides them: `name`, `characterArray` (EXTRA
characters whose pages show it — how a two-hander lands on both), `sortOrder`, `imagePath`,
`partArray`. The full field list is in the header comment of `honeycomb-content-lust-events.js`.

**Battle endings are derived, not declared.** The gallery reads the scene's own `startCombat` requests
— across the start row's event and every event its `partArray` names — and makes a tile per outcome
the request names (`victoryPage`/`victoryEvent`, `defeatPage`/`defeatEvent`). An outcome with neither
gets no tile, because the fallback is the "Lust Event Cleared!" stub. A page or event with a `name`
titles its own tile; without one it reads "Victory" or "Defeat".

**A new KIND of scene is a row in `honeycomb.gallerySourceArray`**, which knows how to collect its own
entries, whether one is unlocked, and how to play it. That is the seam party events and progress
events join at.
