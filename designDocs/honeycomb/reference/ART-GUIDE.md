# Honeycomb — art guide

**What to draw, where it goes, and what happens if it is missing.**

Everything currently in `v13 spire images/` outside `_source/` and `mockups/` is a generated
placeholder. Dropping a real `.webp` at any path below makes the game prefer it immediately — no code
change, no registration step. The resolver walks a fallback chain and stops at the first file that
loads, so art can arrive one file at a time.

Regenerate placeholders after a content change with:

```bash
python "!designDocs/honeycomb/tools/generate-placeholder-art.py"
```

---

## 1. Characters — the image list (Noodle, 2026-09-22)

Every picture a character outfit uses, in Noodle's words, with the backup the game uses when it is
missing. **This list is the rule; the code follows it** (`honeycomb.art.spriteChain`,
`brokenCutInChain`, `recoverCutInChain`, `exposedChain`; suite block [133]).

> - 0-portrait (always generated)
> - 1-basic - Used for full body art in teambuilding when no lust event ready
> - 1-combat - combat sprite at rest while over half health (backup: 1-basic)
> - 1-damaged - when hit by an attack while above half health (backup: 1-basic tilted and filtered red)
> - 1-offense - when using a damage card while above half health (backup: 1-basic tilted, no filter)
> - 1-passive - when using a non-damage card while above half health (backup: 1-basic, I don't actually
>   remember the filter)
> - 1-broken - Cut-in used when reaching broken status while above half health (backup: 1-basic)
> - 2-basic - Used for full body art in teambuilding when lust event is ready (backup: 1-basic)
> - 2-combat - combat sprite at rest while below half health (backup: 1-combat)
> - 2-damaged - when hit by an attack while below half health (backup: 1-damaged)
> - 2-offense - when using a damage card while below half health (backup: 1-offense)
> - 2-passive - when using a non-damage card while broken (backup: 1-passive)
> - 2-broken - Cut-in used when reaching broken status while below half health (backup: 1-broken)
> - 3-combat - combat sprite at rest while broken (backup: 2-combat)
> - 3-damaged - when hit by an attack while broken (backup: 2-damaged)
> - 3-offense - when using a damage card while broken (backup: 2-offense)
> - 3-passive - when using a non-damage card while broken (backup: 2-passive)
> - exposed - Cut-in used when reaching below half health for the first time each battle (backup: 2-combat)

And, from the same message: *"recover images don't need to account for health"*. So each outfit also
has one `recover`, the recovery cut-in, which falls back to the default outfit's and then to the older
per-character `characters/<folder>/recover`.

How the list was read, where it needed reading:

- **The leading number is a tier: 1 above half health, 2 at half or below, 3 while Broken.** Broken
  outranks health for the board poses. The Broken cut-in is chosen by health (1-broken or 2-broken),
  because it plays as she crosses into Broken.
- **`2-passive` "while broken" was read as "while below half health"**, like every other `2-` line; the
  Broken version is `3-passive`. Flagged to Noodle on 2026-09-22.
- **The 1-passive stand-in has no filter.** It is 1-basic leaned 2 degrees with a small lift, the gentler
  cousin of 1-offense's 9-degree lean (`POSE_RECIPES` in `../tools/generate-placeholder-art.py`).
- **Only the `1-` tilts are files.** The placeholder generator writes `0-portrait`, `1-basic`,
  `1-damaged`, `1-offense` and `1-passive` for an outfit and nothing else. Every other backup is a step
  in the game's chain, so a missing `2-` or `3-` picture shows the tier below it rather than an old
  generated copy.
- **The Broken tint (grey, dark, red glow) is for stand-ins only.** Noodle, the same day: *"Anastasia
  absolutely needs the broken state filter removed. That should probably be on placeholders only, like
  how placeholder half-health sprites had the red blotches."* A Broken fighter showing a drawing, whether
  her `3-` set or the `2-`/`1-` drawing it falls back to, is not tinted; one showing a generator stand-in
  (a costume, say) is. The game learns which files are stand-ins from `honeycomb-sprite-metrics.js`, so
  rerun `../tools/generate-sprite-metrics.js` after art lands.
- **Enemies are unchanged**: two files, `1-combat` and `1-offense`, section 2.

| Pose | When it shows | Duration |
|---|---|---|
| `basic` | teambuilding and menus | held |
| `combat` | at rest in a fight | held |
| `damaged` | struck by anything | ~180ms |
| `offense` | plays a **damage** card | ~220ms |
| `passive` | plays any **other** card | ~220ms |

`damaged`, `offense` and `passive` are held briefly then revert to `combat`. They are single frames, not
animations. Timings live in `honeycomb.tuning.animation`.

**Current characters and outfits** (folder names, from `honeycomb-content-characters.js`):

| Character | Folder | Outfits |
|---|---|---|
| Brienne, Warrior | `knight` | `default`, `siegeplate`, `bastion`, `almoner` |
| Nettle, Necromancer | `necro` | `default`, `rotsinger`, `sporemother`, `nightshade` |
| Severine, Bloodletter | `vamp` | `default`, `huntress`, `crimsonCovenant`, `bloodSaint` |
| Cinder, Lancer | `lancer` | `default`, `vanguardPlume`, `marshal` |
| Clemence, Confessor | `priest` | `default`, `devotee`, `ecstatic`, `abbess` |
| Cassadora, Hexer | `seer` | `default`, `hedgeWitch`, `grifter` |

Session 8 added these outfits and three characters as hue-shifted stand-ins (MECHANICS-01.md); session 9 retired the six outfits that came before them. The
three new sources arrived on white rather than transparent; the generator cuts them out in memory, so a
drawn replacement should simply be delivered with transparency. Their `broken.webp` and `recover.webp` are
stand-ins too, and their new card illustrations are `cards/art/cinder-*`, `clemence-*`, `cassadora-*`.

## 2. Enemies — TWO files, and `-combat` is the one the fight draws

**An ordinary enemy needs `1-combat` and `1-offense`. That is the whole set.** Noodle, session 50,
after this was got wrong for the fourth time:

> Basic combat sprites use -combat. Ordinary enemies should have -combat and -offense, that's it.
> Players, bosses, special specific peeps get other sprites. -basic is used for the standing sprites
> in the teambuilding scene.

```
enemies/<enemy>/default/1-combat      standing in the fight   <- the battle screen asks for THIS
enemies/<enemy>/default/1-offense     attacking
```

**Do not deliver enemy art as `1-basic`.** `-basic` is the teambuilding standing pose and nothing else.
The failure it causes is quiet and costs a session every time: the battle screen requests `combat`, so
a drawing installed as `1-basic` sits behind any `1-combat` already on disk, the fight keeps showing
the old sprite, and the new art looks like it simply did not load. **This section used to say "same 9
files" starting at `1-basic`** — that was from before the rule changed, and it was believed over the
running game more than once. When an art path is in doubt, read `.hcFighterArt`'s `src` in the Browser
pane; the scene is the authority, not this file.

A **boss**, a player character or any special case earns more poses than the two, as it needs them.
It says so on its enemy definition with `artPoseArray`, `artTierArray` and `artPortrait`
(`gauntletAnastasia` is the one example today). Only what is declared is ever asked for.

**Since 2026-09-21 the engine enforces this, and an enemy does not use the §5 chain.** Before that date
the rule was written here but the code still asked every enemy for `-basic` in three places (the
sprite chain's last step, the portrait chain, and the boot preloader). That is why tidying the enemy
folder made enemies invisible and flooded the console, and why the files were put back four times.
What the code does now:

- An enemy's chain is `honeycomb.art.enemySpriteChain`. It ends at `1-combat`. It never contains `-basic`.
- A pose or hurt tier the enemy has not declared is swapped for `1-combat` before any path is built, so
  a hit on an enemy with no `damaged` drawing requests nothing. A lone `1-combat` renders everywhere.
- An enemy's face (title screen, Battle Lab, cut-ins) is its `1-combat` unless it declares `artPortrait`.
- A fighter with no file at all draws the generated placeholder once and is not requested again.
- `generate-placeholder-art.py` writes only `1-combat` and `1-offense` for an enemy, and writes nothing
  at all beside a real `1-combat`.
- Suite block [126] fails if any enemy request names `-basic`, or if an ordinary enemy's folder holds
  any file other than `1-combat`, `1-offense` and `.generated.txt`. `enemy-art-tidy.js` (in the tools folder, run with node)
  lists what is wrong and `--apply` moves it to `v13 spire images/_source/_archive-enemy-poses/`.
  It moves files and never deletes them.

Original placeholder roster (session 16): `sporeling`, `capBrute`, `gloomWisp`, `hollowKnight`, `matriarch`, `juggernaut`, `gardener`,
`sage`, `alchemist`, `shield`, `scavenger`.

**Session 11: every enemy has its own drawing** in `_source/enemies/`, mapped in the generator's
`ENEMY_SOURCES` (smol → sporeling, brute → capBrute, caster → gloomWisp, warrior → hollowKnight, matriarch →
matriarch). The single tinted placeholder they replaced was copyrighted and is gone, with everything derived
from it. `gardener` and `sage` were drawn but belonged to no enemy until session 16, which mapped them and the
three other unused drawings (`alchemist`, `shield`, `scavenger`) and the second boss (`juggernaut`). Rebuild
with `--only enemies`.

**The Juggernaut is the one square source** (1024×1024, against everyone else's 832×1216): the canvas-as-scale
rule still applies, but he is drawn with `presentation: { scale: 0.9, anchor: "back" }` so that at the stage's
height he does not spill off the top of a wide window. He is also the only enemy that has no drawn
`brokenBG`; the tear falls back to the flat wash, as any cut-in character without one does.

- **The canvas is the scale.** A sprite is drawn at the stage's height, so an enemy reads as big as the share
  of its canvas it fills. Draw every enemy on the shared 832×1216 canvas at its intended size; the generator
  never trims.
- **An anchored boss is sized by height alone** and spreads wider than her column, so a landscape drawing
  (the Matriarch's 1152×896) is the same share of the stage at every window shape. Her `presentation.scale`
  is 1; raising it spills her off the top of a wide screen. (A first attempt fitted her by the column's width
  at scale 2.1, which was a different size at every aspect ratio.)
- (Broken cut-in portraits only, since 2026-09-21: an ordinary enemy no longer gets a `0-portrait` file.)
  Portraits are cropped from the figure's outline (stray specks ignored); a source whose outline is no guide
  to the face gets `portrait: {x, y, box}` in `ENEMY_SOURCES`, as the Matriarch does.

`default` is the variant slot. It exists so a palette-swapped or elite version of an enemy can be
added later without changing the resolver.

## 3. Delivery size

**Sprites: 1300px tall, transparent background, feet at the bottom edge.**

A fighter fills at most ~60% of the stage height — roughly 650px on a 1080p screen, so 1300 covers a
2× display with room over. The original source art was 1408×2816 and cost 16MB across the generated
set for no visible gain; capping it brought that to 6.4MB. There is no reason to ship more.

Portraits are 256×256. Card art is 768×512 (horizontal frames) or 544×824 (vertical).

## 4. States — usually cost NO art

This is the part that keeps the image count sane.

A **state** is a visual overlay for a condition: poisoned, weakened, downed. Each is one of three
types, declared in `honeycomb.art.stateArray`:

| Type | Art needed | Use for |
|---|---|---|
| **`filter`** | **none** — a CSS filter tints the base sprite | almost everything |
| `half` | 4 files (one tier) | a condition worth a drawn pose, same at any health |
| `full` | 8 files (both tiers) | a condition that transforms the character |

Every state today is `filter`, so the whole status system costs zero images. Only promote one to
`half` or `full` when a status genuinely deserves drawn art — and remember `full` is eight files per
outfit per character.

State art lives in a subfolder named after the state:

```
characters/knight/default/burning/1-basic     (full)
characters/knight/default/burning/2-basic
characters/knight/default/petrified/1-basic   (half — only ever tier 1)
```

**Only one state draws at a time**, chosen by `priority`. Death is 1000 and must stay highest, so a
downed character never renders as merely poisoned.

## 5. Fallback — nothing is ever a broken image

For a request of *(outfit, state, tier, pose)* the resolver tries, in order:

1. the state's art at that tier and pose
2. the state's `basic` at that tier
3. *(full states)* the state's tier-1 equivalents
4. the outfit's art at that tier and pose
5. the outfit's `basic` at that tier
6. the outfit's tier-1 equivalents
7. the character's **default outfit**
8. a generated placeholder naming the path it wanted

So a character with only `1-basic` drawn renders correctly everywhere — every pose, both tiers, every
state. Art can land incrementally and the game never breaks in between.

Failed paths are remembered for the session, so a repaint does not re-request known-missing files.

## 6. Everything else

| Thing | Where | Notes |
|---|---|---|
| Card illustrations | `cards/art/<card>.webp` | 768×512 or 544×824; behind the frame |
| Card frames | `cards/frames/*.webp` | 1992×2540, transparent art window. `placeholderVertical` / `placeholderHorizontal` are shared and tinted per supertype; a supertype may have its OWN frames instead (`framePathByLayout` in `cardTypeArray`). **The game draws downsampled copies** (`-small` / `-medium` / `-large`, session 15): after adding or redrawing a frame, run `generate-placeholder-art.py --only frames` |
| Lewd frames and icon | `cards/frames/lewdVertical`, `lewdHorizontal`; `icons/type-lewd` | **Generated stand-ins** (round 06, item 11; `--only lewd`). Same window as the shared frames. A drawn `.png` beside each is converted on the next run |
| Region backdrops | `map/background-<region>.webp` | 1600×900; missing ones fail silently to a gradient |
| Node previews | `map/preview-<type>.webp` | 512×512 |
| Class icons | `icons/<class>.webp` | 150×150 |
| Status / resource / node / intent icons | *generated SVG* | drawn at runtime; drop a real file at the path in the content table to override |

### The !!BROKEN!! and recovery cut-ins (session 5)

Two full-screen overlays. Everything they draw is real art, not a generated stand-in, and every layer
is a separate file so any one of them can be redrawn without touching the rest. Code:
`honeycomb-overlays-broken.js`; every number: `tuning.brokenOverlay` and `tuning.recoverOverlay`; the
brief they were built from: `BROKEN-01.md`. Reference mockups are
`mockups/mockup-6-breakdown.webp` and `mockups/mockup-6-backgroundChainsOnlyForReference.webp`.

**Shared, in `ui/broken/`** — all 1920×1080 unless stated:

| File | Is | Notes |
|---|---|---|
| `brokenChainBackground.webp` | 3338×300 | The looping background chain. Tiled along its own axis, so its left and right edges must meet |
| `brokenChainFront1.webp` | The front chain, whole | Sweeps across during the fly-in |
| `brokenChainFront2.webp` | The same chain, snapped | Cross-fades in at the midpoint |
| `brokenClaw.webp` | The tear's drawn RIM | Unmasked, over everything: it is the outline, so masking it would cut its own edge off |
| `brokenClawMask.webp` | The tear's shape | Opaque OUTSIDE the tear |
| `brokenClawStart.webp` | Six short strokes | Reference only — where the tear opens FROM. The positions are copied into `tuning.brokenOverlay.clawStartArray`, so moving a stroke means updating that list |
| `brokenText.webp` | "!!BROKEN!!" | Arrives at the midpoint in a flash of red |
| `recoverBar.webp` | The recovery band's two rails | Rails at 25.5–34.7% and 56.8–65.8% of the height |
| `recoverBarMask.webp` | The band's window | Opaque OUTSIDE the band |

**Per character**, in `characters/<folder>/`:

| File | Is |
|---|---|
| `broken.webp` | The !!BROKEN!! cut-in portrait. Brienne's is drawn (`knight/broken.png`, converted); the other two are stand-ins |
| `brokenBG.webp` | The wash seen through the tear |
| `recover.webp` | **The RECOVERY cut-in's portrait** (round 05, item 4) — "Recovery should not use the broken sprite". All three are stand-ins: the character's standing art, untinted. The band shows a strip of it at eye level |
| `recoverBG.webp` | The wash behind the recovery band |

**Per enemy that plays the cut-in** (round 06, item 10: `brokenCutIn: true` on the enemy, the Matriarch so
far), in `enemies/<index>/`: `broken.webp` and `brokenBG.webp`, named by `brokenArtPath` /
`brokenBackgroundPath` on the enemy. The Matriarch's `brokenBG` is Noodle's; her `broken.webp` is a stand-in
cut from `default/1-combat.webp` (`generate-placeholder-art.py --only broken`, `BROKEN_ENEMY_PORTRAIT_ARRAY`).
Enemies never recover, so they need no `recover` art.

**Drawing a `recover.webp`?** It is cropped by `tuning.recoverOverlay.eyeWindow` —
`topPercent` is the row at the top of the slot and `heightPercent` is how much of the picture's height
fills it, scaled UNIFORMLY (see BROKEN-01 for why the two axes must never be scaled apart). The
defaults are measured for a full standing figure; a portrait-framed drawing wants a
`recoverEyeWindow` of its own on the character, as Nettle and Severine already carry.

**⚠ TWO FILES ARE DERIVED — regenerate them, never edit them.** A CSS mask reads ALPHA: opaque shows,
transparent hides. Both painted masks are built the other way round, opaque outside the shape, because
they are painted to be laid over a picture. The runtime needs the complement, and it is baked rather
than composited at load time (`mask-composite: exclude` is Chrome 120+, and this has to run in a
Cordova WebView). So:

```bash
python "!designDocs/honeycomb/tools/generate-placeholder-art.py" --only broken
```

builds `brokenClawMaskInner.webp` and `recoverBarMaskInner.webp` from the two painted masks, and
converts any `characters/<folder>/broken.png` or `recover.png` into the `.webp` the loader asks for. It touches nothing
else, so it is safe to run against a folder full of real art. **Redraw a mask and you must run it
again**, or the tear keeps the old shape.

**Two knobs worth knowing** — both were asked for by name:

- `tuning.brokenOverlay.characterScale` (0.85) is how large the character stands. The mockup's own
  0.94 read cluttered in motion, which is why the shipped value is lower. A character may override it
  with `brokenScale` / `brokenOffsetPercent` on their definition.
- `tuning.recoverOverlay.eyeWindow` is which part of the cut-in portrait the recovery band shows:
  `centreXPercent` is what sits in the middle, `topPercent` the row at the top of the slot, and
  `heightPercent` the only zoom control. The crop is scaled UNIFORMLY — a new portrait with the eyes
  somewhere else needs its own `recoverEyeWindow` on the character, not a stretched window.

### Map backdrops — a map drawn OVER a painting

A region may hand-place its nodes on a painting instead of generating a grid. The Flooded Vault
already declares two, and they do not exist yet:

| Thing | Where | Notes |
|---|---|---|
| Map backdrop | `map/backdrop-<region>-<name>.webp` | **2880×900 (3.2:1) since session 17.** The graph draws on the SAME rectangle, so the two can never drift apart |

**How the nodes get placed on it.** Open the image, read off the percentage across and down for each
point a node should sit, and write those into the backdrop's `anchorArray` in
`honeycomb-content-map.js`. The graph adopts the backdrop's aspect, so the numbers stay correct at any
screen size. An anchor may also name a node TYPE, which is how the shop ends up where the painting
shows a shop.

**The canvas is one rectangle (session 17).** The SVG's height is fixed and its width follows the
content: a longer floor is a WIDER map at the same node spacing, and the viewport scrolls sideways. An
anchored painting sits inside that same canvas and is stretched to it (`object-fit: fill`), so an
anchor percentage and a node percentage are the same point. Regenerate the stand-ins with
`generate-placeholder-art.py --only maps`; the landmarks it paints come from `MAP_BACKDROPS` and must
mirror the anchors, as before.

A region may carry several backdrops; one is picked per run and recorded, so a reload draws the same
painting under the same nodes.

### Events and the shop — now full-screen

Events default to a full-screen SCENE: backdrop art edge to edge, a figure standing on the right, and
the UI panel sliding in over the left ~46%. **Design the background assuming the panel comes in over
its left edge** — that was asked about, and the answer is yes.

| Thing | Where | Notes |
|---|---|---|
| Event backdrop | `events/backdrop-<event>.webp` | 1920×1080. The left ~46% is covered by the panel |
| Event speaker | `events/speaker-<event>.webp` | Full body, transparent, anchored to the bottom |
| Event panel art | `events/<event>.webp` | 512×512, only used by `presentation: "panel"` events |
| Event illustration | `events/<name>.webp`; a picture made once per girl is `events/<scene>/<art folder>.webp` (`events/pool/knight`) | Any of 1024×1024, 832×1216, 896×1152, drawn on the right. A path may hold `{leader}`, `{second}`, `{third}` (and so on), which become the art folder of whoever stands in that party place: the campfire is `events/campfire-{leader}`, so it needs one file per character. **Never draw a named cast member into an event picture without one of these tokens** -- the party is unknown (2026-09-23) |
| Shop backdrop | `shops/backdrop-default.webp` | 1920×1080, as mockup 5 |
| Shopkeeper | `shops/keeper-default.webp` | Full body, transparent, right-hand side |

Rest is an ordinary event now (`theCampfire`), so it takes backdrop and speaker art like any other.

### Abilities and progression

| Thing | Where | Notes |
|---|---|---|
| Ability icons | `abilities/<character>-<ability>.webp` | 150×150; falls back to a generated glyph |
| Progression tree art | `progression/<artFolder>-tree.webp` | 16:9 mood image. Nodes are placed on it as percentages, exactly as map anchors are |

The progression tree is drawn like the map: a graph over a painting, letterboxed the same way. Node
positions are percentages in `progressionTree.nodeArray`, so measuring them off the finished art is
the whole of the placement work. A node may name its own `iconPath`; without one it draws a star.

**Icons are deliberately not generated as files.** Statuses, resources, node types and intents are
inline SVG from `honeycomb.ui.glyph` — the right home for a symbol that will become a drawn icon.
Each content entry names an `iconPath`; put a file there and it wins automatically.

### UI chrome — frames, plates and screen backdrops (round 02, item 21)

The mockups frame everything in dark panels with **cut corners and a thin metal trim** (gold for
anything primary), with an ornament where each corner turns. Those are drawn as **nine-slice images**
the game stretches with CSS `border-image`, fill included — the image IS the element's face. The
placeholders in `ui/frames/` are drawn in roughly the final shape (the cut, the trim, a diamond where
the corner ornament goes) so each file shows what it is for.

| Frame | Where | Source size | Slice | Worn by |
|---|---|---|---|---|
| Panel | `ui/frames/panel.webp` | 128×128 | 28 | every `.hcPanel` (teambuilding columns, sub-panels) |
| Window | `ui/frames/window.webp` | 160×160 | 36 | every overlay window (`.hcOverlayPanel`) — gold |
| Button | `ui/frames/button.webp` | 64×64 | 16 | every `.hcButton` |
| Primary button | `ui/frames/button-primary.webp` | 64×64 | 16 | `.hcButton.hcPrimary` (Start Run, Close…) — gold |
| Tab | `ui/frames/tab.webp` | 64×64 | 14 | `.hcTab` — top corners cut, **bottom edge open** |
| Active tab | `ui/frames/tab-active.webp` | 64×64 | 14 | `.hcTab.hcActive` — gold, bottom open |
| Item plate | `ui/frames/plate.webp` | 96×96 | 20 | relics and equipment (`honeycomb.ui.itemPlate`) — replaces the old circle |

**Drawing one:** keep the corner pieces inside the SLICE (the pixels from each edge that do not
stretch); the edge strips between them stretch, so keep those plain along their length. Sources are
drawn at 2× and shown at half size (`widthPixels` in `tuning.art.uiFrameArray`). A new source with a
different corner size is a tuning edit (`slice`, `widthPixels`), not code. Transparent outside the cut
— that transparency is what cuts the element's corners.

**A frame only switches on once its file loads** (`honeycomb.ui.loadFrames`), so deleting one puts that
element back to its plain CSS look rather than breaking it. The folder is manifest-protected like the
character art: a drawn frame is never overwritten. Regenerate just these with
`python "!designDocs/honeycomb/tools/generate-placeholder-art.py" --only ui`.

**Painted screen backdrops** (the paintings the mockups stand every screen in front of). Slots with no
file show nothing and the CSS gradient carries on:

| Backdrop | Where | Notes |
|---|---|---|
| Title | `backgrounds/title.webp` | 1920×1080, shown dimmed behind the hub |
| Teambuilding | `backgrounds/teambuilding.webp` | 1920×1080, mockup 3's painted vault / forest |

Battle UI chrome is **not** dressed yet — the battle layout is its own step (FEEDBACK-02 item 26).

**The nameplate** (FEEDBACK-06 item 1) is hand-written SVG in `ui/nameplate/`, drawn at 1 unit = 1 pixel
of `mockups/mockup-7-health`, so each opens in any vector editor. To replace one with painted art, drop
the file in and change its path in `tuning.art.nameplate` (an extensionless path means `.webp`). Keep the
drawing's proportions, or update the matching numbers in honeycomb.css's "THE NAMEPLATE" block.

| File | Is | Drawn as |
|---|---|---|
| `medallion.svg` | Ring around the class icon (icon room: radius 60 of 70) | 140×140 |
| `barFrame.svg` | The bar's frame; fill window top 16 / bottom 62, chevron tip 35 in from the right | nine-slice `16 58 20 8` |
| `healthTab.svg` | The tab the HP text sits on | nine-slice `34 24 34 24` |
| `statusCircle.svg` | The circle a status or mechanic sits in | 100×100 |
| `shatterCrack.svg` | The crack on the broken tip (matches the CSS jag) | 60×82 |
| `shatterBoltA`–`D.svg` | Four lightning frames, left-middle on the break | 48×96 |
| `shatterChipA`–`C.svg` | Pieces of the frame breaking off | per `chipArray` |

⚠ An SVG comment must not contain a double hyphen: the file silently draws nothing.
`!designDocs/honeycomb/tools/nameplate-preview.html` shows every state without starting a fight.

## 7. Finding what to improve

Placeholder visuals in code are tagged `HC-PLACEHOLDER`:

```bash
grep -rn "HC-PLACEHOLDER" scripts/css/honeycomb.css scripts/misc/honeycomb/
```

`_source/` holds the only real art the generator derives from.

**Real art is safe from the generator.** Each generated folder carries a `.generated.txt` manifest
listing exactly what the script wrote. A rerun only overwrites files named in that manifest, so a
placeholder you have replaced is left alone — and the run reports which files it protected:

```
characters/knight/default  (8 generated)  [1 real: 1-basic.webp]
```

To be explicit about it, delete a file's line from the folder's manifest; it will never be touched
again. To go the other way and reclaim everything as placeholder, run with `--force`, which
overwrites real art and is the only thing that does.
