# Card redesign — SESSION LOG (archived)

**ARCHIVED.** Sessions 2 through 6 of the card-face redesign, moved out of `../STATUS.md` in
session 41 so the live status reads as a status and not a history.

Read it only to answer *why is it like this* or *when did that change*. Current state, the
restore procedure and the overlay log are all in `../STATUS.md`.

Session 5 is kept deliberately: it is recorded as a warning lesson, not as progress.

---

## Session 2 (2026-09-16) — step 3 standing issues

All three step-3 blockers are fixed and visually verified. Evidence is in `overlays/step3/`.

1. **Vertical placeholder — ribbon and text were too low. FIXED.** `BY_LAYOUT.vertical` is now
   ribbon `52.0`, text `63.0`, text height `19.5`. Measured text bottom **82.5%** against tag top
   **83.2%** — no clip. Shot: `overlays/step3/composer-vertical.png`.
2. **Small size — title and cost. FIXED (Noodle correction).** Small keeps the **cost visible** and
   puts the **title in the same slot as medium/large** (`left 26% / top 2.7% / width 52% / height
   7.6%`); the title stays in its band and never covers the illustration. Placement first, visibility
   tuning later. Shot: `overlays/step3/composer-small.png`.
3. **Overlay reference was `assembledParts.png`. FIXED.** The reference is now
   `card_redesign/backups/chrome-only.png`, a 1176×1500 chrome-only snapshot of this bench (art
   hidden, stage-matched background) written by `overlays/step3/make-chrome-only.js`. A / B / 50% /
   difference all run against it. Shots: `overlays/step3/overlay-{b,50,diff}.png`.

Measured (composer, `getBoundingClientRect`):

| Size | Stage | Name font | Cost font | Note |
|---|---|---|---|---|
| large | 300×382.64 | norwester 32.95px | norwester 51.02px | target 13.95u / 21.6u at 300 |
| small | 108×137.75 | norwester 11.86px | norwester 18.36px | same band as medium/large; cost visible |

Vertical: text top 63.0 / bottom 82.5 / tag top 83.2; `textOverflow` 0.

Parked, do not reopen unless asked:

- Typeline Y / DAMAGE curve (no good adjuster this session).
- Filter-lab **damage** look (rejected; `EFFECTS.md`).

---

## Session 3 (2026-09-16) — title crop + step 4 freeze

4. **Title was cropped top and bottom. FIXED.** `LAYOUT.name` moved from `top 3.7 / height 6.6` to
   **`top 2.7 / height 7.6`** (Noodle), for every size. Measured name box top **2.70%**, height
   **7.60%**. Shots re-cut: `overlays/step3/composer-{small,medium,large,vertical}.png`,
   `overlays/step3/overlay-{b,50,diff}.png`.
5. **Step 4 — backup frozen.** `backups/card-effects-preview.step3.html` (path-rebased so it opens
   standalone) and `backups/layout.step3.json`. Restore paragraph below. Evidence:
   `overlays/step4/backup-{A,B,50,diff}.png`.
6. **Foil hue-cycle (step-7 candidate, fixed early).** The animation ran only on the gold window
   frame, so the dominant blue `border_blue` never moved and the card read as a normal blue frame.
   `.foil .cardBorder img` now shares the `foilHue` loop with `.cardFrame img`; reduced-effects stops
   both. Border filter measured `88°→160°` over 1.2s. Evidence:
   `overlays/step3/foil-phase-{000,180}.png`. Post-dates the step-3 freeze, so the backup does not
   carry this tweak.

---

## Session 4 (2026-09-16) — step 5, correct the bench

- **5a layer order.** `.cardBg` z0 / `.cardArt` z1 per BRIEF 2a; art stays under border z2 / frame z3.
  Owner portrait is now clipped to `ring_owner`'s inner hole — **62.3% of the owner box, centre
  49.9% / 51.7%** (measured off the source) — so it no longer paints over the gold front.
- **5b fonts.** Dropped the `"Trebuchet MS"` fallback from name/cost. Computed families: name / cost /
  type word `norwester`; rules `railway`.
- **5c parts.** Tried supertype **words + icons** on the ribbon; **reverted** (Noodle: "looks awful,
  does not fit on the card"). The ribbon stays **icons only** (multi) with the SVG `DAMAGE` label for
  single mode, exactly as before step 5. Tags stay behind the class icon; target badges absent; gem
  kept and hideable. A words+icons treatment is a step-6/7 design question, not a step-5 fix.
- **5d sizes.** Small hides rules; cost stays visible (Noodle, I-27). Medium/large print the full face.
- **Overlay ref.** Live bench `REF` moved to `overlays/step5/chrome-only.png`. The frozen step-3 ref at
  `backups/chrome-only.png` is untouched, so OT-4a still holds.

Measured at large: name norwester **32.95px**, cost norwester **51.02px**, rules railway 18.14px.
Portrait **10.59%** of card = 62.3% of the 17% owner slot.

## Session 5 (2026-09-16) — step 6 attempt — ARCHIVED as a warning lesson

Two recreations of the priest chrome were attempted; neither reached the source's quality:

1. **Hand-drawn SVG** (`grokPiece`: ~320 lines of paths, gradients, filters and a global defs host).
   Correct silhouettes and passable metal, but flat, wrong/missing colour, no painterly depth.
2. **Shape-PNG + CSS hybrid** (masks derived from the source pixels, CSS gradients for light). Exact
   silhouette and a close colour match on the ribbon only (face `(3,54,129)` vs source `(3,52,126)`),
   still short overall. Not adopted. Evidence: `overlays/step6/`.

**Machine reverted.** The bench is restored to the end-of-step-5 source assembly: every step-6
addition (grok CSS, `#grokDefs`, the `recreated chrome` toggle, `grokPiece` / `grokRibbonHybrid`,
`srcPiece` classes) is removed. Kept only as the archive: `overlays/step6/`,
`cardsGrok/ribbon_blue_{back,front,trim}.png`, `overlays/step6/make-ribbon-masks.py`.

### Warning lesson (do not repeat)

- **Do not hand-recreate painterly chrome** in SVG or CSS. `assembledParts` / `_source/cards` are
  soft-shaded, textured and layered; vector and `mask-image` gradients read flat, and matching them
  costs enormous authoring effort for a still-worse result.
- **SVG is acceptable for clean geometric pieces only** (simple rims, flat icons, patterns) and even
  then will not match a painted crop.
- The wall is the **pixel budget**, not drawing skill. A faithful result has to be authored at the
  source's pixel level.

### What survives / brainstorm inputs

- `make-ribbon-masks.py` is genuinely useful: exact silhouettes plus a palette-classified
  back/face/trim split, with zero hand-drawing. Keep that technique.
- The bench's source-assembly composer (steps 3/5) is the reliable foundation; the recreations were
  the problem, not the composer.
- A faithful chrome almost certainly needs a **pixel-space pipeline** (Python/PIL or similar) writing
  finished rasters under `cardsGrok/`, not runtime SVG/CSS.

## Session 6 (2026-09-16) — split-piece colourways (Noodle's direction)

Chrome is now built from **authored back/front rasters**, not a recreation. Noodle authored the
ribbon/icon splits; this session copied them and added the ring splits.

- `cardsGrok/` now holds (copied from `_source/cards/`, originals left in place):
  `newribbon_back`, `newribbon_front`, `newicon_back`, `newicon_front`, `newicon_priest`,
  `newicon_knight`, `newicon_lancer`.
- Ring splits generated by `overlays/splits/make-ring-splits.py` (radial well/metal split, colours
  preserved): `newring_cost_back/front`, `newring_owner_back/front`.
- **Bench wiring:** composer checkbox `new split chrome` swaps the source ribbon/icon/cost/owner
  rasters for the split pieces (`.newPiece`), keeping the source assembly one click away. A
  `supertype` select applies the live type filter to the **back** pieces (cloth / well / icon wings)
  **plus the border and owner plate** (still source rasters), so the whole card reads the supertype
  colour while the gold frame and class glyph stay put. Colour is the **supertype** colour, not the
  owner. Evidence: `overlays/step6/newchrome-*.png` (damage, negative green, lewd unchanged, …).

Open question (for Noodle): should the tint cover only the cloth/well, or the gold too; and whether
the final colourways are baked per supertype (PIL) or left as a runtime filter.

### Session 6b — fixes + supertype colour spec

- **Icon-back desync fixed.** `hue-rotate` shifted each asset by its own base hue (the icon back is not
  the same blue as the border), so they diverged. Replaced with **duotone filters** (`#tintDefs`):
  luminance → dark..light ramp of the target, so every layer lands on the same colour. Noodle
  confirmed the back's gold may be tinted (it is covered by `newicon_front`), so whole-piece tinting is
  fine. Gold that shows (frame, ribbon trim, ring fronts, glyph) is in the un-tinted `front` pieces.
- **Bench settings persist across refresh** (`localStorage`, key `cardRedesignBench.v1`): size, view,
  layout, type mode, sliders, every layer toggle, magenta, reduced effects, new split chrome, and
  supertype. Saving is gated until after restore so init cannot overwrite stored values.
- **Icon scaled to the old footprint.** The new winged icon is 56.2% wide (old 47.4%) and its top
  (84.9%) reaches the tag band (83.2–87.4%). The tag cannot move up (rules text ends ~82.5%), so the
  icon is scaled `0.85` about bottom-centre (`.cardIcon .newPiece`), restoring the old footprint.

- **Source pieces leaked through in new-chrome mode** (old class icon visible). `.cardStage .layer >
  img.full { display:block }` out-specified the plain hide rule; the hide/show rules now use
  `!important`, which also stops the new pieces leaking into source mode.
- **Lewd** took several passes (mauve `#B35C8A` → neon `#FF75FF` → flat → purple) and landed on a
  4-stop duotone ramp: border samples `#D779B1`/`#E186BF` (the shade Noodle liked) while the plate
  keeps deeper rose shadows `#9D4076`, so detail survives instead of washing out. The knob is the
  `#tintLewd` table rows (brightness vs. contrast). Still the trickiest type. **Passive switched to
  green** (orange looked bad; green is known good).

**Supertype colour spec (Noodle):** Damage **red**, Support **blue = default asset** (no filter),
Negative **dark purple**, Lewd **pink**, Passive **green**, Random **white/grey**.
Implemented as duotone table values in `#tintDefs` + `SUPERTYPE` in the bench.

### Notes for next session

- Cards are close to a state Noodle is happy to **wire into the game**. That needs BRIEF rule 7/8 and
  the out-of-scope "wire when asked" lifted first.
- **Step 8 (necro/vamp owner equivalents) is a wash**: colour is driven by **supertype**, not owner,
  so per-owner frames are not needed. Re-scope step 8.
- Cherry-blossom VFX (step 9) still wanted.

