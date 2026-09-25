# Card redesign — BRIEF

**Standing brief for this workstream.** A new session starts here, then `STATUS.md`. Noodle's
instructions win if an annotation disagrees.

| File | Holds |
|---|---|
| `BRIEF.md` | this file — goals, steps, overlay tests, hard rules |
| `STATUS.md` | where the work is, what passed, what is waiting |
| `INFERENCES.md` | inferred choices and how to pivot each |
| `PIECES.md` | source inventory, visual notes, split list |
| `LAYERS.md` | z-order, layout percentages, size presets |
| `EFFECTS.md` | broken look, filter lab, cherry blossom, extra-effect drafts |
| `backups/` | frozen preview HTML (step 4 lives here) |

New agent-made rasters: `v13 spire images/_source/cardsGrok/` only; never write into
`v13 spire images/_source/cards/`. Noodle authors new pieces in `_source/cards/` and they are **copied**
to `cardsGrok/` (originals kept as backups) rather than referenced in place. Never add extra files
beside this folder at `!designDocs/honeycomb/` except the existing bench
`!designDocs/honeycomb/tools/card-effects-preview.html`.

Do not add progress or new assumptions to this file. Changes to this document should be done EXCLUSIVELY to correct a mistake or fill an undeveloped
section. Progress → `STATUS.md`. Assumptions → `INFERENCES.md`.

Direct note from noodle. Do not, DO NOT, DO NOT EVER mark a step without visual verification in the browser. It is extremely unprofessional to mark a step as complete only for the barest and briefest visual analysis to reveal issues as crippling as they are obvious. Testing is part of the workflow; the workflow is not complete without testing. Failure to follow this step suggests potential failure to follow other steps as well, resulting in the entire workflow becoming tainted and needing to be directly verified.

---

## What this is

Rebuild the card-face chrome as a **bench**: composer + broken-look room + filter lab + extra VFX.
**Horizontal priest** first, from the pre-spaced `_source/cards` pieces.
`assembledParts.png` is the backup-plan match for chrome slots. New chrome may use CSS, SVG, canvas,
or Python/PIL pixel PNGs. There is no image-generation model on this agent.

The live game still draws `cards/frames/placeholderVertical` / `placeholderHorizontal` (1992×2540,
tinted). Wiring a replacement into live cards is out of scope until asked.

---

## Hard rules

1. **No gameplay changes.** Honeycomb JS/CSS/content may be touched only when the running game's
   look, rules, and numbers stay the same. Existing classes may be reused. New placeholder classes
   must be marked. Overrides of existing classes stay scoped to this bench.
2. **Do not overwrite source images.** Crooked crops and paint mistakes stay in `_source/cards` as
   reference. Replacements go under `cardsGrok/`. **Same filename is allowed**
   (`cardsGrok/border_blue.png` may supersede the source of that name in the bench).
3. **Do not rename or delete `_source/cards` files.** The horizontal gold frame is
   `frame_gold_horizontal.png`.
4. **Card illustration sits behind chrome** (border, frame, ribbon). **`ring_owner` is top-right**
   (new owner mark; fill is the character portrait). **`icon_priest` is bottom** (class icon). Both
   are in the final design. Ring fill sits **between** `ring_owner_back` and `ring_owner_front` and
   is clipped to the front ring's inner hole — it must not spill outside that framing.
5. **Typography matches the live cards**, not the old bench's Trebuchet. Design-space changes need a
   written justification in `LAYERS.md`.
6. **Three sizes, always.** Composer presets are the game's `small` / `medium` / `large`
   (`tuning.art.cardSize`), at the **live on-screen sizes**, with the live `partArray` per size.
7. **No live magic-number dump.** Bench layout lives in one JS object on the preview page, shaped
   so it can later copy into `tuning.art.cardFrame`. Not copied until Noodle says wire it.
8. **Offline.** The bench is a static HTML file. No `fetch`, no modules, no build step. Fonts are
   `<style>@font-face` from `scripts/fonts/`. Python may generate PNGs into `cardsGrok/` as a
   developer tool, not as something the bench fetches.
9. **Reduced-effects awareness.** Any looping VFX must have a still fallback named on the effect.
   The bench exposes a reduced-effects toggle. Cost notes (transform vs filter vs box-shadow) stay
   on each candidate.
10. **Inferences are not sign-off.** Continuing past a step does not lock its inferences. Pivot
    notes live in `INFERENCES.md`.

### Live typography (copy these; do not invent)

From `honeycomb.css` / `honeycomb-tuning.js`. One card unit `--u` = card width / 127.

| Part | Font | Size | Notes |
|---|---|---|---|
| Name | `norwester` (`--hc-font-display`) | `13.95 * --u * lineScale` | cream, letter-spacing 0.02em, wrap allowed |
| Cost | `norwester` | `21.6 * --u` | gold-bright, in the cost ring |
| Supertype row | `norwester` | `9.45 * --u * lineScale` | uppercase, letter-spacing 0.1em |
| Rules text | `railway` (`--hc-font-body`) | `12 * --u * lineScale` | `#f3ecdd`, line-height 1.15, centered |
| Tags | `norwester` | `9.45 * --u` | uppercase, letter-spacing 0.12em |
| Small-card name | `norwester` | same formula with `nameFit.scale: 2` | name only; horizontal also shows type icons |

Font files: `scripts/fonts/norwester.otf`, `scripts/fonts/railway.otf`.

### Live sizes (composer presets)

The three sizes in `tuning.art.cardSize`. Widths are whatever the live UI actually draws:

| Size | What it is | Live size | Parts |
|---|---|---|---|
| `small` | deck, shop, intent, lists | the live small-card box | name; horizontal also supertype icons |
| `medium` | hand, unfocused | hand card: `--hc-card-hand-height` × aspect | cost, affinity/owner, badges, name, supertypes, text, tags |
| `large` | hover, drag, tooltips | `widthPixels: 300` honeycomb pixels | same parts as medium |

Measure the live boxes into `LAYERS.md`. Do not invent pixel widths.

Aspect: source pieces and `assembledParts.png` are **1176×1500** (0.784), same ratio as the live
1992×2540 frames.

**Quality target is horizontal priest.** `frame_gold_vertical.png` is in scope as the one extra
piece for a **basic placeholder** vertical card (same metal language, taller hole). Not a full
vertical design pass.

Card **type** colour (attack / support / …) is a separate, undecided roster. Do not add a step that
builds alternate type frames. Owner styling (priest / necro / vamp) is step 8.

---

## Overlay-test protocol

Every stage below names `OT-*` checks. A check is **fail** until it has a recorded pass in
`STATUS.md`.

**How to overlay**

1. Candidate and reference are the same pixel size (composer design canvas = 1176×1500).
2. The composer has four view modes: **A** (candidate), **B** (reference), **50%** (reference over
   candidate at 50% opacity), **difference** (`mix-blend-mode: difference` on the reference).
3. Magenta plate behind every PNG (`#ff00ff`) to catch false opacity and leftover matte.
4. Sheen/pattern checks are close-crops, not whole-card glances.
5. Pixel-perfect is **not** the pass bar. Do not copy smudges, leftover white matte, shadows baked
   onto the wrong layer, or dragged-edge layout shortcuts. Do capture: edge highlighting, shine,
   shadows that belong to the piece, radial glows, metallic gleams. Prefer a cleaner construction
   when it reads better. Pass bar for step 3 is *registration* of chrome slots against a chrome-only
   snapshot of this bench (no art; see step 3). The horizontal art window follows
   `frame_gold_horizontal.png`. Pass bar for step 6 is those lighting qualities, not a pixel match.

Screenshots of passes go in `card_redesign/overlays/` (evidence, not assets).

### Verification (no pass by assertion)

A step is not complete until every `OT-*` for it has **stored evidence**: a screenshot *and* the
measured numbers. Prose that a thing "looks right" is not evidence.

- **Fail closed.** `report()` measures every pair that can touch (ribbon↔text, text↔tags,
  name↔cost/gem/owner, text↔class icon, …) from real `getBoundingClientRect()`. A visible layer
  with no check is reported as UNCHECKED, and UNCHECKED is a failure, not a pass.
- **Numbers beat descriptions.** When a screenshot description and a measurement disagree, the
  measurement wins and the shot is retaken. Say plainly what the image does and does not show.
- **One change per shot** while tuning geometry, with the before/after value recorded.
- **Falsify before ticking.** Re-read the requirement and try to prove the check *failed* before
  recording a pass.
- **The tool is not the truth.** A green readout only certifies the pairs it measures. Look at the
  pixels too.

---

## Step 0 — This document

**Goal.** A brief a future session can execute without `../BASICS.md`, without dumping progress here.

**Done when.** `BRIEF.md`, `STATUS.md`, `INFERENCES.md` exist.

| ID | Overlay / check |
|---|---|
| OT-0a | Folder map in this file matches files on disk |
| OT-0b | Hard rules 1–3 are restated in `STATUS.md` header so they cannot be skipped |

Sub-tasks: 0a docs exist · 0b CATCH-UP has a pointer; sessions still start at this BRIEF · 0c
inferences listed for Noodle.

---

## Step 1 — Observe `_source/cards`

**Goal.** Written visual notes good enough to rebuild chrome without re-opening every PNG. Subtle
structure first: radial light, geometric fills, metal sheen, drop shadows, alpha holes.

**Do not** start drawing or rewriting the bench except for a read-only magenta-plate strip if it
helps measurement.

### 1a. Inventory

For every file: pixel size, mode (RGBA/RGB), whether it is **pre-spaced** (full 1176×1500 with the
piece already in position) or a **loose sprite**, and whether the inner window is actually
transparent.

Known survey (confirm in `PIECES.md`):

| File | Size | Role |
|---|---|---|
| `assembledParts.png` | 1176×1500 RGBA | backup-plan match for chrome slots |
| `assembledMockup.png` | 1060×1484 RGB | petals/sparkles **only** — AI, skewed top, wrong filigree |
| `!exploded_priest.png` | 1374×1145 RGBA | priest piece map |
| `!exploded_necro.jpg` / `!exploded_vamp.jpg` | RGB | owner-motif **inspiration** — AI: misplaced pieces, duplicates, wrong colours, fake transparency |
| `bg_{priest,necro,vamp}_blue.png` | 1176×1500 | owner plates, pre-spaced |
| `border_blue.png` | 1176×1500 | outer rim, pre-spaced |
| `frame_gold_horizontal.png` | 1176×1500 | gold landscape window, pre-spaced; **quality target** |
| `frame_gold_vertical.png` | 1176×1500 | gold portrait window; **basic placeholder** (same metal, taller hole) |
| `ribbon_blue.png` | 1176×1500 | type ribbon, pre-spaced |
| `rarity_gold.png` | 1176×1500 | gem, pre-spaced; near the **top** of the illustration |
| `icon_priest.png` | 1176×1500 | bottom medallion art, pre-spaced |
| `ring_cost.png` | 300×300 | loose cost coin (gold + blue fill) |
| `ring_owner.png` | 250×250 | loose owner coin (gold + blue fill) |
| `type_{attack,lewd,negative,passive,support}.png` | 256×256 | loose type icons |
| `type_unused.png` | 256×256 | scrap; do not put on a card |
| `assembledParts.pdn` | — | Paint.NET source; do not load in the bench |

Missing vs old bench: `frame_blue.png`, `detail_gem.png`.
Missing vs live needs: `type_random` (for random cards later — inventory only, not a build step).

### 1b. Per-piece visual notes (required topics)

For each chrome piece, `PIECES.md` records:

- 1b-1 silhouette and inner hole (if any)
- 1b-2 local palette (shadow / mid / highlight / emissive)
- 1b-3 shadow: contact vs drop vs inner
- 1b-4 **radial lighting** centre and falloff
- 1b-5 **background geometric pattern** (diamonds, lattice, rays) and where it clips
- 1b-6 **sheen**: direction, number of ridges, hot-spot colour (not just “gold”)
- 1b-7 alpha fringe / crop damage to *avoid copying* in step 6
- 1b-8 whether blue fill and gold metal are one raster (split candidate)

### 1c. Assembly reading of `assembledParts.png`

Name, type line, rules text, which pieces are present, z-order as seen, gem near the top of the
illustration, window rectangle as a first percentage guess. Sample copy on that PNG is the step-3
match card (Nightfall / DAMAGE · LEWD / the printed rules). Chrome-slot overlay uses this file; the
gold window uses `frame_gold_horizontal.png`.

### 1d. What `assembledMockup.png` is allowed to teach

Keep: rising petals, sparkle size/colour, motion impression.
Discard: frame filigree, top-edge skew, any type/cost treatment that disagrees with `assembledParts`.

| ID | Overlay / check |
|---|---|
| OT-1a | Magenta plate behind every RGBA source; holes vs matte written in `PIECES.md` |
| OT-1b | `bg_priest_blue` centre: if opaque, art cannot sit under it without a hole — recorded |
| OT-1c | Horizontal gold window vs `assembledParts` portrait edges, 50% overlay, notes only |
| OT-1d | Sheen crops: cost ring, owner ring, horizontal frame, ribbon highlight |
| OT-1e | Gem position vs `assembledParts`: near the top of the illustration |

---

## Step 2 — Piece split list

**Goal.** Name every raster or SVG that must exist before step 6, without drawing it yet. Priest
first. Necro/vamp owner pieces are named here, built in step 8.

### 2a. Z-order (proposed; confirm after OT-1b)

Back → front.

0. owner plate `bg_*`
1. card illustration (clipped to the active layout’s gold window)
2. blue border `border_blue`
3. gold frame (`frame_gold_horizontal` or `frame_gold_vertical`)
4. ribbon back (new split)
5. ribbon front (new split)
6. type icons
7. rarity gem (kept; near top of the illustration; disable-able later, e.g. starters)
8. cost ring back, cost ring front, cost numeral
9. owner ring back → character portrait → owner ring front (top-right)
10. tags (school strip, e.g. Vampiric / Necromancy — not a supertype). Behind the class icon.
11. class icon `icon_priest` (bottom; not inside the owner ring)
12. ink: name, supertype words, rules

Owner-ring fill is clipped to `ring_owner_front`'s inner hole.

`bg_*` is a lower plate (transparent above ~54%). Illustration is clipped to the gold window,
so the two do not fight.

### 2b. Splits to schedule (priest)

| Name (in `cardsGrok/` or live SVG; same name as source is allowed) | From | Why |
|---|---|---|
| `ring_owner_back` | `ring_owner` blue disc | fill behind inner art |
| `ring_owner_front` | `ring_owner` gold rim | clips inner art; metal stays shared |
| `ring_cost_back` | `ring_cost` blue disc | same split |
| `ring_cost_front` | `ring_cost` gold rim | same split |
| `ribbon_blue_back` | ribbon tails / under-fold | step-8 owner recolour |
| `ribbon_blue_front` | ribbon face / highlight | same |

Do **not** split: `frame_gold_horizontal`, `frame_gold_vertical` (already gold on transparent),
`border_blue`, `bg_*`, `rarity_gold`, `icon_priest`, `type_*`.

### 2c. Pieces that wait

- `icon_necro`, `icon_vamp` — step 8 (mandatory)
- owner recolour of border / ribbon / frame — step 8
- `type_random` — not this pass

### 2d. Quality bars for any new metal piece

Applied when the piece is actually built (step 6), named here so they are not forgotten:

- 2d-1 clean silhouette that *reads* as the source shape; do not copy crop wobble or dragged edges
- 2d-2 inner disc is a clean hole or a flat fill, not leftover pattern
- 2d-3 **metallic gleam**: a cool rim-light opposite a warm contact, plus at least one traveling
  highlight — not a flat yellow stroke
- 2d-4 inner bevel darker than the rim; do not flatten to one gold
- 2d-5 drop shadow belongs to the piece, not baked into a neighbour
- 2d-6 at `small` size the ring still reads as a coin, not a mud speck

| ID | Overlay / check |
|---|---|
| OT-2a | Split table in `PIECES.md` has every 2b row |
| OT-2b | Z-order in `LAYERS.md` matches 2a (or records the bg-hole exception) |
| OT-2c | Explicit skip list (type-colour sets, extra exploded ribbons, AI checkerboards, source mistakes) |

---

## Step 3 — Rebuild the bench on current files

**Goal.** `../tools/card-effects-preview.html` assembles the **existing** `_source/cards` rasters into a
**horizontal** priest card whose chrome slots register on `assembledParts.png`. This is the backup
plan if later chrome is worse than the crops. Vertical is a layout toggle using
`frame_gold_vertical.png` (basic placeholder, not the quality target).

### 3a. Kill dead paths

Stop requesting `frame_blue.png` and `detail_gem.png`. Point at `frame_gold_horizontal.png`,
`frame_gold_vertical.png`, `border_blue.png`, `bg_priest_blue.png`, `ribbon_blue.png`,
`rarity_gold.png`, `icon_priest.png`, `ring_cost.png`, `ring_owner.png`, `type_*.png`.

### 3b. Pre-spaced vs loose

Pre-spaced layers: `position:absolute; inset:0; width:100%; height:100%`.
Loose layers (`ring_*`, `type_*`): percentages measured off `assembledParts.png`, not the old
slider defaults.

### 3c. Composer behaviour

- Layout toggle: horizontal / vertical (window rectangle follows the active gold frame)
- Layout object: window, ribbon, text, cost, owner, gem, name band — all `%` of the card box
- Sliders remain, but **defaults** are the measured match, not 8/9.4/84/51
- View modes A / B / 50% / difference against a **chrome-only snapshot of this bench** (no art),
  not `assembledParts.png` (step 3 layout drifted). Save that snapshot when the face is right.
- Size presets small / medium / large at **live** sizes (rule 6)
- Layer toggles: art, bg, border, frame, ribbon, types, gem, cost, owner, ink
- Owner ring (top-right, character portrait) and class icon (bottom) both drawn; each can be toggled
- Gem: on by default; can be hidden (starter experiment)
- Problems readout (overlap, overflow, off-card) stays

### 3d. Rooms 2 and 3

Keep shipped + four broken candidates + filter lab **running** on this backup assembly so step 7
has a host. They may still look wrong; step 7 rebuilds them. Do not drop the rooms.

### 3e. Match card

Same face as `assembledParts.png`: name NIGHTFALL, types DAMAGE · LEWD, cost 2, priest icon, the
printed rules line. Art may be any priest illustration already in `v13 spire images/cards/art/`.

| ID | Overlay / check |
|---|---|
| OT-3a | 50% overlay vs the chrome-only snapshot (no art): slots register |
| OT-3b | Difference mode: remaining mismatch is art/text/window, not chrome slots |
| OT-3c | Magenta plate: no unexpected holes in bg/border/frame |
| OT-3d | Small / medium / large presets match live sizes; large is 300 honeycomb pixels wide |
| OT-3e | Dead `frame_blue` / `detail_gem` URLs are gone (no 404 in console) |
| OT-3f | Frame file is `frame_gold_horizontal.png` |
| OT-3g | Gem sits near the top of the illustration |
| OT-3h | Owner-ring portrait clips to the front ring; class icon is a separate bottom piece |

---

## Step 4 — Freeze the backup plan

**Goal.** Step 3 can be restored without git archaeology.

- 4a Copy the working bench to `backups/card-effects-preview.step3.html`
- 4b Copy the layout object to `backups/layout.step3.json` (or a `<script>` block in
  that HTML — one source of truth, written in `STATUS.md`)
- 4c `STATUS.md` records the restore instruction in one paragraph
- 4d Do not keep editing the backup copy; further work happens on the live bench

| ID | Overlay / check |
|---|---|
| OT-4a | Opening the backup file still matches OT-3a without the live bench |
| OT-4b | Restore paragraph in `STATUS.md` is copy-pasteable |

---

## Step 5 — Correct the bench (still on source rasters)

**Goal.** The composer is a design space for the *intended* card, using live-game type rules. Wrong
layer order and wrong fonts are bugs, not experiments.

### 5a. Layer order

DOM / z-index follows 2a. Card illustration must not paint over the gold frame. Owner-ring inner
art must not paint over `ring_owner_front` or spill outside it.

### 5b. Fonts and sizes

`@font-face` norwester + railway. Sizes from the live table above. Kill Trebuchet. Name is not
full-bleed across the cost coin; cost uses norwester at 21.6u.

### 5c. Live-card parts the old bench skipped

- Owner ring top-right (character portrait, clipped to the front ring). Class icon bottom.
- Supertype **words + icons** on the ribbon
- Tags (school, not a supertype) sit at the foot, **behind** the class icon. Chevron chip is the
  current treatment. Nightfall’s workbench tag is Vampiric. Every future card face must leave room
  for at least one tag.
- Target badges stay off (`showTargetBadge: false`)
- Rarity gem **kept**, near the top of the illustration; hideable for a later starter pass

### 5d. Size presets print the right parts

Small hides rules/cost per live `partArray`. Medium and large show the full face.

| ID | Overlay / check |
|---|---|
| OT-5a | With frame hidden, art is visible; with art hidden, frame window is empty — never art-over-frame |
| OT-5b | Computed font-family of name/cost/types contains `norwester`; rules contains `railway` |
| OT-5c | Name font-size at large (300 honeycomb px) is ~33px (`13.95 * 300/127`) within 1px |
| OT-5d | Cost font-size at large is ~51px (`21.6 * 300/127`) within 1px |
| OT-5e | Small preset does not print rules text |
| OT-5f | Owner-ring portrait clipped to the front ring; class icon still at the bottom |

---

## Step 6 — Build priest chrome from authored split rasters (+ supertype tints)

**Redefined 2026-09-17 (Noodle).** The "recreate the chrome in SVG/CSS" plan was attempted and
**archived as a dead end** (warning lesson in `STATUS.md`). Chrome is now authored by Noodle as
**back/front raster pieces**, copied into `cardsGrok/`, and coloured at runtime by **supertype** with
duotone tints. Gold sits on the `front` pieces and stays gold. The full pipeline — pieces, tint list,
colour table, bench behaviour and the open problem — is `PIPELINE.md`; that file supersedes 6a–6c
below (kept only as the record of the abandoned approach).

### 6a. Tool choice per piece

| Kind | Default tool | Why |
|---|---|---|
| Metal rings, gem, frame filigree | SVG + CSS (gradients, strokes, maybe a tiny SVG filter) | sheen stays sharp at three sizes |
| Owner plate pattern | SVG pattern or a PNG in `cardsGrok/` | geometry is regular |
| Outer border | SVG or CSS | simple rim |
| Class icon | SVG | must swap in step 8 |
| Ribbon | SVG split front/back, or CSS on a cleaned PNG | folds need shading, not a blurry crop |
| Traveling metal gleam | CSS gradient animation, transform-only if it loops | reduced-effects can freeze it |

Python/PIL pixel PNGs are allowed when SVG cannot hold the filigree density. Write them under
`cardsGrok/` (same names as source are allowed). Never overwrite `_source/cards`.

### 6b. Priest build order

1. Canvas 1176×1500, magenta plate
2. Owner bg pattern (radial light + lattice) — 6b-1
3. Horizontal window hole / clip — 6b-2
4. Blue border — 6b-3
5. Gold frame (horizontal quality target; vertical placeholder = same metal, taller hole) — 6b-4
6. Ribbon back + front — 6b-5
7. `ring_cost_back` + `ring_cost_front` + gleam (2d-3) — 6b-6
8. `ring_owner_back` + inner art + `ring_owner_front` + gleam (2d-3) — 6b-7
9. Owner-ring portrait (top-right) + priest class icon (bottom) — 6b-8
10. Gem near the top of the illustration — 6b-9
11. Ink using step-5 type — 6b-10
12. Composer switch: **source assembly** (step 3/4) vs **recreated** (this step) — 6b-11

### 6c. What “better than the crop” means

- Clean alpha, no white/black fringe
- Metal has a highlight axis
- Pattern repeats instead of stretching a JPEG patch
- Frame top edge is level (do not copy `assembledMockup` skew)

| ID | Overlay / check |
|---|---|
| OT-6a | Recreated vs `assembledParts` at 50%: chrome slots still register |
| OT-6b | Magenta plate: no fringe on rings/frame |
| OT-6c | Close-crop: owner-ring gleam (2d-3) visible at large **and** medium |
| OT-6d | Close-crop: bg lattice reads at large; not a blurry smear |
| OT-6e | Source-assembly backup (step 4) still opens beside the new one |
| OT-6f | Horizontal is the quality target; vertical placeholder uses `frame_gold_vertical` and still reads as metal |

---

## Step 7 — Broken look and filter lab on the new card

**Goal.** Rebuild the **intent** of each candidate on the recreated priest card. Do not clone the
old CSS onto a missing `frame_blue.png`.

### 7a. Broken look (section 2) — four candidates + shipped

| Candidate | Intent | Do not |
|---|---|---|
| Shipped | rose rim + one slow sheen; transform-only; reduced-effects drops sheen, keeps rim | change live `.hcCardBroken` |
| Cracked | “this card is broken glass” | three faint gradient lines that vanish at small size |
| Foil / hue-cycle | “unnatural, shifting metal” | full-card 360° hue that reads as a party rainbow |
| Ember | “hot rim, dangerous” | box-shadow so large it shoves neighbouring cards |
| Wrong + scan | “off, corrupted, cold” | unreadable scan that hides rules text |

### 7b. Filter lab (section 3) — three existing

| Filter | Intent |
|---|---|
| Gild | specular metal catch on the gold frame |
| Roughen | surface noise / displacement, still a card |
| Damage crack | eaten speckle + glow, not an empty box. **Current bench version is rejected:** ugly
  right/bottom border, speckle reads as dead pixels. Rebuild in step 7; do not ship this look. |

(The old damage filter once erased the whole card; keep the session-22 luminance fix.)

### 7c. Host

Each demo is the **recreated** priest card, not a 170px toy with art-on-top-of-frame. Size preset
defaults to medium so footprint bugs show. A second row at large is allowed.

| ID | Overlay / check |
|---|---|
| OT-7a | Five broken demos (shipped + 4) use the new priest stack |
| OT-7b | Three filter demos use the new priest stack |
| OT-7c | Ember bounding box at medium does not exceed the card box by more than 4% (footprint) |
| OT-7d | Hue-cycle does not rotate the illustration through neon (frame/metal only, or heavily gated) |
| OT-7e | Cracked still reads at small size |
| OT-7f | Reduced-effects toggle: looping filters stop; intent still readable |

---

## Step 8 — DROPPED (owner equivalents)

**Dropped 2026-09-17 (Noodle).** Colour is driven by **supertype**, not owner (see Step 6 /
`PIPELINE.md`), so per-owner frames (necro / vamp recolours, alternate class icons, owner motifs) are
**not needed**. `!exploded_necro.jpg` / `!exploded_vamp.jpg` remain inspiration only; do not build
this step. The old body is kept below as the record.

**Goal (stale).** Same slot grammar as priest. Owner identity lives in a short personalization list, not in
copying every AI exploded fragment. Card **type** colours are not this step.

### 8a. Personalization list (mandatory vs skip)

**Build**

- Bottom class icon (mandatory): priest cross already exists; necro and vamp marks
- Recolour border, ribbon (front and back), and frame as needed so the three owners read as
  different without changing layout
- Owner plate `bg_*` (files already exist — restyle if they are weak)
- Owner-ring inner fill follows the owner treatment
- Optional: one small owner motif in the gold frame **only if** it does not fight the shared
  filigree

`!exploded_necro.jpg` / `!exploded_vamp.jpg` are **inspiration**. They misplaced pieces, duplicated
elements, and changed colours. Do not copy those errors. Do not treat their colours as type colours.

**Skip**

- Extra type-icon inventions (use existing `type_*`; do not invent a type-colour set)
- Alternate ribbon *shapes* (recolour the blue ribbon's front and back)
- Fake checkerboard “transparency”
- Random corner trinkets that are not the bottom icon
- Vertical frame variants

### 8b. Build

Composer owner switch: priest / necro / vamp. Same layout object. New icons as SVG in the bench
or `cardsGrok/icon_necro.png` / `icon_vamp.png`.

| ID | Overlay / check |
|---|---|
| OT-8a | Three owners, identical slot positions (difference is colour/icon/motif, not layout) |
| OT-8b | Bottom icon is distinct at small size for all three |
| OT-8c | Ribbon/border/frame recolour does not destroy metal highlight |
| OT-8d | Exploded JPGs are not loaded as layers in the composer |

---

## Step 9 — Cherry-blossom VFX

**Goal.** Rising petals + sparkles as in `assembledMockup.png`, without adopting that file's frame.
SVG shapes. Prototype, then final. What the effect *means* (broken, rarity, Clemence, generic) is
undecided and depends on quality; build it as a stackable overlay.

### 9a. Prototype

- 6–10 petal SVG instances, looped CSS animation
- Rise, slight sway, spin, fade
- 8–12 sparkles, slower, smaller
- Clip to the art window so petals do not cover rules text
- Reduced-effects: static 2 petals, no motion
- Prototype may be ugly; it must prove the motion read

### 9b. Final draft

- Petal silhouette from the mockup (notched oval, not a circle)
- Two-tone pink with a hard highlight edge
- Sparkles as 4-point stars, not CSS `box-shadow` blobs
- Density that works at medium (hand) without turning the art into confetti
- Does not overlap the five broken-look items or the three filter-lab items as a *definition*

| ID | Overlay / check |
|---|---|
| OT-9a | Prototype: motion reads as “rising petals” in 3 seconds of watching |
| OT-9b | Final: side-by-side with `assembledMockup` 50% — petal *language* matches, frame ignored |
| OT-9c | Rules text unobstructed (petals clipped) |
| OT-9d | Medium and large; reduced-effects still |
| OT-9e | Prototype path kept (toggle), not overwritten by the final |

---

## Step 10 — Outline further card effects

**Goal.** Written drafts only (`EFFECTS.md`). No implementation in this step.

### 10a. Two new effects (not the broken five, not the filter three, not cherry blossom)

Each draft: name, intent in one sentence, motion/material, reduced-effects still, cost class
(transform / filter / shadow / SVG), why it can reach cherry-blossom quality, size-footprint note.

### 10b. Broken-look improvement list

Must include, at least:

- **Cracked:** does not read; replace or thicken; must work at small
- **Hue-cycle:** too intense; gate to metal, shorten range, or slow + desaturate
- **Ember:** footprint pushes neighbours; keep glow *inside* the card or cap spread
- Shipped sheen: keep as the cheap baseline unless a candidate beats it on reduced-effects
- Wrong/scan: rules-text legibility

### 10c. Filter-lab improvement list + two new entries

Mark gild / roughen / damage. Then draft **two additional** filter-lab entries (name, intent, SVG
approach, cost, reduced-effects).

| ID | Overlay / check |
|---|---|
| OT-10a | `EFFECTS.md` has 10a (2), 10b (all five broken items), 10c (3 existing + 2 new) |
| OT-10b | None of 10a/10c names duplicate cherry blossom, cracked, foil, ember, wrong, gild, roughen, damage |

---

## Out of scope

- Wiring the new frame into live `honeycomb.ui.card` until asked
- Replacing live `.hcCardBroken`
- Generating card *illustrations*
- Renaming or deleting `_source/cards` files
- A full **vertical design pass** (no vertical mockup). `frame_gold_vertical.png` itself is in
  scope as a basic placeholder.
- Other characters (Brienne, Cinder, Cassadora)
- ^ **Type-colour frames were previously out of scope; as of 2026-09-17 they are IN scope** — the
  supertype colour drives the chrome (see `PIPELINE.md`).
- **Owner-variant frames are dropped** (Step 8); colour follows supertype, not owner.
- Drawing `type_random` this pass (its colour is specified in `PIPELINE.md` in case it is wanted)

---

## How a future session continues

1. Read **this file**.
2. Read `STATUS.md` (current step, last OT pass/fail).
3. Read `INFERENCES.md` before contradicting a listed choice.
4. Execute the next sub-task. Update `STATUS.md` when an OT passes, not in a batch at the end.
5. New rasters → `v13 spire images/_source/cardsGrok/`. New writing → this folder.
