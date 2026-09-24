# Honeycomb Catacombs — external requirements

Everything Honeycomb needs that is **not** inside its own files. This is the spin-off checklist: to
lift Honeycomb out into a standalone game, satisfy or replace each item below and nothing else.

Last verified: 2026-09-09, by grepping every honeycomb file for Syrup Town identifiers.

---

## 1. JavaScript functions and variables

**All of them live inside one object: `honeycomb.platform`, at the top of `scripts/misc/honeycomb.js`.**
No other honeycomb file touches a Syrup Town global. That is enforced by convention, and it is
checkable — see "Verifying" below.

| Used | From | Where in honeycomb | Why | If absent |
|---|---|---|---|---|
| `soundEffectStart(stem)` | `scripts/gameplay/sound.js` | `platform.sound` | Plays a sound effect | Guarded by `typeof`; game runs silent |
| `writeScene(character, scene)` | `scripts/gameplay/encounters.js` | `platform.exit` | Hands control back to the story game on quit | Guarded; falls back to re-entering Honeycomb |
| `data.player` | `scripts/index.js` (global) | `platform.exit` | Presence test only — confirms a Syrup Town save is loaded before handing control back | Guarded by `typeof` |
| `devPreviewActive()` | `scripts/index.js` | `platform.inDevPreview` | Detects a dev-preview boot | Guarded by `typeof`; returns false |
| `devPreviewTarget` (write) | `scripts/index.js` | `platform.exit` | **Cleared on exit.** `generateTitle()` skips the title's animation chain while a preview is active, so leaving it set returns the player to a title with its letters parked off-screen and its buttons never raised | Guarded by `typeof` |
| `clacksDevMode` (write) | `scripts/index.js` | `platform.exit` | Cleared alongside it, since it is the other input to `devPreviewActive()` | Guarded by `typeof` |
| `soundDisabled`, `musicDisabled` (read and write) | `scripts/gameplay/sound.js` | `platform.soundEnabled` / `musicEnabled` / `setSoundEnabled` / `setMusicEnabled` | The host's own on/off flags, shared rather than copied, so the two games' switches can never disagree (round 04, item 21) | Guarded by `typeof`; both read as "on" |
| `data.player.musicVolume` (read) | `scripts/index.js` (global) | `platform.musicVolume` | Honeycomb's music follows the host's volume slider (session 50) | Guarded; falls back to `tuning.audio.music.standaloneVolume` |
| `playlist` (read; `.muted` written on its entries) | `scripts/gameplay/sound.js` | `platform.suspendHostMusic` / `resumeHostMusic` / `hostSongCount` | The host's songs are **muted** while Honeycomb's music plays and unmuted on exit. `muted` is a property nothing in `sound.js` reads or writes, so its volume, paused state and fades are left exactly as found. Pausing instead would be read by `fadeIn()` as an autoplay block, which it answers with `omniToggle()` — switching sound effects off too | Guarded by `typeof`; no-op |
| `timeoutID` (read and write), `startMusic` | `scripts/gameplay/sound.js` | `platform.suspendHostMusic` / `resumeHostMusic` | The host's next-song timer is cleared on entry (a song it started mid-run would arrive unmuted) and re-armed on exit for what is left of the current song | Guarded by `typeof` |
| `currentAudio` (read), `pauseAll()`, `unpauseAll()` | `scripts/gameplay/sound.js` | `platform.resumeHostMusic`, `platform.setMusicEnabled` | On exit the host's song is put in whichever state the shared switch now says: the switch may have been pressed from inside Honeycomb. `unpauseAll()` is never called on an empty `playlist` — it reads `playlist[0]` unguarded and throws | Guarded by `typeof` |

Every one is `typeof`-guarded. **Honeycomb already runs standalone**: dropping its files into a bare
`index.html` with none of the above present produces a working game with no sound and no exit route.

### Sound effect names
`platform.sound` takes Honeycomb's own event names and maps them to host filenames via
`honeycomb.tuning.audio.eventMap`. The right-hand side of that map is the only place Syrup Town's
`sound/sfx/` filenames appear. Currently used: `button`, `pop`, `hammer`, `move`, `purchase`, `sleep`,
`pickup`. A standalone build rewrites that one table.

**Honeycomb's own library is played directly** (session 21): an event named in
`honeycomb.tuning.audio.fileMap` is played by `platform.playStem` → `platform.playFile` as
`honeycomb sound/sfx/<file>.mp3` with a plain `Audio` element — no host, no fetch — and `eventMap`
keeps a host-stem fallback for a build that ships without that folder. The five stingers (`!broken`,
`!torn`, `!outfitChange`, `!victoryBattle`, `!victoryFull`) and the card sounds live there.

Only **five** host stems are still used, all for moments the library has no file for: `button`
(clicks and the queue beep), `pop` (back, card pick-up), and `move` — which is **the card draw, and
Noodle's own pick**. Do not move the draw to the library without a short draw file to move it to.

**The library is measured, not named** (session 22). `honeycomb.tuning.audio` carries
`momentArray` (how long a sound may run at the moment it plays), `leadInMsMap` (how much silence each
file opens with, so a sound timed to a picture lands on it) and `fileVolumeScaleMap` (per-file volume
trims to one target level). All three are generated from
`!designDocs/honeycomb/tools/sfx-metrics.json`, which `tools/sfx-report.html` re-measures whenever a sound file is
replaced. A standalone build carries the whole of `honeycomb sound/` and needs none of this changed.

### Music (session 50)
Honeycomb plays its own three looping tracks from `honeycomb sound/music/loop/` with plain `Audio`
elements (`honeycomb-music.js`) — no host, no fetch, no Web Audio, so it works from `file://`. The host
is touched in exactly two ways, both inside `honeycomb.platform`: its songs are muted for as long as
Honeycomb is mounted (rows above), and its volume slider and music switch govern Honeycomb's music too.
**No line of `sound.js` was changed.** A standalone build needs nothing rewritten: every host name is
`typeof`-guarded and the music plays at `tuning.audio.music.standaloneVolume`. The source songs in
`honeycomb sound/music/*.mp3` are build inputs for `tools/music/build-music-loops.py` and are **not**
loaded by the game; a release can leave them out and ship only `honeycomb sound/music/loop/`.

---

## 2. HTML

### `index.html` and `mobile.html`

**Each page carries one generic line and no Honeycomb file names.** Adding, removing or renaming a
Honeycomb file is a change to `scripts/misc/honeycomb/honeycomb-loader.js` alone. Nothing else in either page
was modified. Where the script tags used to be, after `dungeon.js`:

```html
<script>(function () { var loader = document.createElement("script"); loader.src = "scripts/misc/honeycomb/honeycomb-loader.js" + (location.protocol === "file:" ? "" : "?v=" + Math.floor(Date.now() / 600000)); loader.async = false; document.head.appendChild(loader); })();</script>
```

The loader holds the ordered list of scripts (`scriptArray`) and stylesheets (`styleArray`). It appends the
stylesheet at the end of the head, after `style.css`, and each script with `async = false`, so they run in
list order before the page's `onload`. Each request carries `?v=` and a number that changes every
`refreshMinutes` (60), so an upload reaches players without a hard refresh. Opened from a file, no `?v=` is
added. To lift Honeycomb out, delete the line.

`honeycomb-warnings.js` loads last because its rules read every content table. It is optional: the boot
calls it only if it loaded, and it writes to the console alone.

**Load order matters.** `honeycomb.js` creates the namespace every other file appends to, and
`honeycomb-tuning.js` must precede anything that reads tuning at load time
(`honeycomb-content-statuses.js` does). Content before systems, systems before scenes.

### DOM elements Honeycomb hides while running
`honeycomb.platform.chromeElementIndexArray` names them: `menu`, `wrapper`, `openButton`,
`closeButton`. Each is looked up by id and skipped if missing, and each one's original inline
`display` is restored on exit. Honeycomb never edits the host's DOM beyond toggling those.

Honeycomb creates exactly two elements on `document.body`: `#honeycombRoot` and
`#honeycombOverlayHost`. Both are removed on exit.

---

## 3. CSS

`scripts/css/honeycomb.css` is self-contained. **Every rule is scoped under `#honeycombRoot` or
`#honeycombOverlayHost`** — no bare element selectors, no Syrup Town class names. It cannot leak into
the host page, and the host's stylesheet cannot reach into it (Honeycomb declares its own font stacks,
type scale and spacing scale rather than borrowing `--fs-*` from `style.css`).

**Fonts** are referenced by the names Syrup Town's `@font-face` blocks define (`norwester`, `railway`,
`playtime`), each with a full generic fallback stack. A standalone build without those faces falls
through to the generics and looks correct, just less characterful.

**Inherited properties.** Selectors cannot leak, but inheritance does: Syrup Town's `html`/`body` set
`line-height: 24px` and `font-size: 16px`, and those reach every honeycomb element that does not state
its own. Since session 6 the hosts restate both (in honeycomb pixels, at the same values), so a
standalone build without Syrup Town's stylesheet draws identically. Syrup Town's global
`::-webkit-scrollbar` rules are likewise overridden by honeycomb's own, scoped to its hosts. See
`reference/SCALING-01.md`.

Nothing was added to or changed in `scripts/css/style.css`.

---

## 4. `scripts/index.js`

Two changes, both to the dev-preview system, both additive:

1. `devPreviewTarget` is currently set to `"honeycomb"` — **this must be `""` for a release build.**
   The existing comment above it already says so.
2. Two cases added to `devPreviewBoot()`: `"honeycomb"` (resumes the autosave) and `"honeycombFresh"`
   (ignores it and starts a new profile).

No existing Syrup Town logic was modified.

### 4b. `scripts/gameplay/title.js` (session 15, signed off by Noodle)

`generateTitle()` appends one invisible 48×48px square, `#titleHoneycomb`, in the title's top-left corner,
whose `onclick` calls `honeycombBoot()`. It is only emitted when `typeof honeycombBoot === "function"`, so
removing Honeycomb leaves the title unchanged. Inline styles only; nothing in `style.css`. Leaving Honeycomb
returns through `honeycomb.platform.exit()` as before.

---

## 5. Images

All Honeycomb art lives in `v13 spire images/`. The folder name appears in exactly **one** place in
the whole codebase: `honeycomb.imageFolder` in `scripts/misc/honeycomb.js`. Moving the art into
`images-webp/` is a one-line change there.

`honeycomb.image(path)` is Honeycomb's cut-down `cleanupImage`. It shares none of the original's
code and none of its Syrup Town behaviour (no skin-tone or gender substitution, no mod-blob handling,
no `SCENE` token) — it is a separate function that happens to serve the same purpose.

Placeholder art is generated by `!designDocs/honeycomb/tools/generate-placeholder-art.py`, which is a
developer tool. Nothing in `scripts/` runs it or knows it exists.

---

## 6. Save data

Honeycomb does **not** write to Syrup Town's `data` variable or to any `dataSyrup*` key. It uses its
own localStorage namespace:

- `honeycombSave<slot>` — the full state snapshot
- `honeycombMeta<slot>` — a small summary for a load screen

Slot 0 is the autosave; 1–6 are manual. Uninstalling Honeycomb cannot corrupt a story save, and
uninstalling Syrup Town cannot corrupt a Honeycomb run.

All localStorage access is confined to `honeycomb.save.*` in `honeycomb-state.js`.

---

## 7. Environment

- **Hosted (Neocities)** — verified working. Static files only.
- **Offline (`file://`)** — *not directly verified; see the caveat below.* Honeycomb uses no `fetch`,
  no XHR, no ES modules and no dynamic `import`. Every asset is a plain `<img src>` or a `<link>`,
  both of which load from `file://`. The one genuine risk is **localStorage, which some browsers
  refuse on `file://` origins**. That is handled: every localStorage call in Honeycomb is wrapped in
  try/catch, so a browser that blocks it yields a fully playable game that simply cannot save —
  `hasAutosave()` returns false and the game starts a fresh profile. Syrup Town's own saves have the
  same constraint, so Honeycomb is no worse off than its host.
- **Browser features used**: Pointer Events with `setPointerCapture`, CSS custom properties,
  `aspect-ratio`, `clamp()`, flexbox, grid, inline SVG. All baseline in browsers from 2021 onward.
- **No build step. No dependencies. No frameworks.**

> **Caveat on the `file://` claim.** The in-editor preview browser rewrites a `file://` URL into a
> `data:` snapshot and does not execute its scripts, so it cannot test this case. The reasoning above
> is sound and the failure mode is handled, but a human opening `index.html` directly is still worth
> doing once to confirm. **Anyone who does so, please record the result here.**

---

## 8. Deliberate non-dependencies

Things Honeycomb pointedly does **not** use, and why:

| Not used | Why |
|---|---|
| `cleanupImage` | Carries Syrup Town character/mod logic irrelevant here; Honeycomb has its own resolver |
| `printCard` (either one) | Both are built around Syrup Town's collectables data shape |
| `generateWindow` / `deleteWindow` | Honeycomb owns its own overlay stack inside its own root |
| `data` / `saveSlot` / `loadSlot` | Separate save namespace, for the removability requirement |
| The `.puzzle-piece` class | See below |
| `document`/`window`-level event listeners | See below |

### Jiggy input isolation — verified, not assumed

`scripts/items/jiggy.js` attaches **permanent** `mousemove`, `mouseup`, `touchmove`, `touchend` and
`wheel` listeners to `document`. Each one iterates `getElementsByClassName('puzzle-piece')` and acts
only on elements where `piece.isDragging` is true.

Honeycomb is isolated from these by two independent facts:

1. **Honeycomb never creates an element with the class `puzzle-piece`**, and never sets `isDragging`
   on anything. Jiggy's handlers therefore iterate an empty collection while a card is dragged.
2. **Honeycomb adds no `document`-level listeners, and no input listeners on `window`.** Card dragging
   uses Pointer Events with `setPointerCapture` on the card element itself, so moves and releases are
   routed to the card even when the pointer leaves it. Input listeners sit on card elements and on
   honeycomb's own root and overlay host (the capture-phase pointer-kind note). The only `window`
   listeners are `error` and `unhandledrejection` in `honeycomb.js`, which record failures for the save
   report and touch no input. Screen-size changes are watched with a `ResizeObserver` on the root, not a
   `resize` listener (session 6), and it is disconnected on unmount.

Both are checkable from the shell:

```bash
grep -rn "document\.addEventListener\|window\.addEventListener" scripts/misc/honeycomb.js scripts/misc/honeycomb/*.js
grep -rn "puzzle-piece" scripts/misc/honeycomb/*.js scripts/css/honeycomb.css
```

The first must return only the `error` / `unhandledrejection` pair. The second must return only
comments explaining this rule.

---

## Verifying this document

To confirm nothing has crept in since it was written:

```bash
grep -rn "addEventListener" scripts/misc/honeycomb.js scripts/misc/honeycomb/*.js
```
Expect four hits, all on card elements in `honeycomb-scene-combat.js`.

```bash
grep -rn "v13 spire images" scripts/
```
Expect one hit: `honeycomb.imageFolder`.

```bash
grep -rnE "\b(soundEffectStart|writeScene|devPreviewActive|data\.player|playlist|timeoutID|currentAudio|startMusic|pauseAll|unpauseAll|musicDisabled|soundDisabled)\b" scripts/misc/honeycomb.js scripts/misc/honeycomb/*.js
```
Expect hits only inside `honeycomb.platform` in `honeycomb.js`. Anything outside it is a leak and
should be moved into the adapter.
