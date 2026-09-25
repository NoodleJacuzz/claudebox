# Bench overhaul — plan outline

**Goal.** One card renderer. The bench renders through the live `honeycomb.ui.card` + `honeycomb.css`
+ `art.cardChrome` tuning + the same assets, so it shows exactly what the game shows. Editing the
bench is editing live values, not a parallel implementation. The bench becomes a **beta/staging** of
the live cards: a change made there promotes to live.

**Principle.** Live is the source of truth. The bench is a viewer/editor over it, not a second copy.
Today the two are silos kept in sync by hand (this session's parity pass, and the enemy-art miss that
came from the bench never exercising an enemy card) — the overhaul removes that whole class of drift.

---

## Phases

1. **Embed the live renderer.** Load the honeycomb script set + stylesheet in the same order as
   `index.html`, create `#honeycombRoot`, call `applyTuningToCss()`. Then delete the bench's
   duplicated card template and CSS (`stackHTML`, `.cardStage`, `.cardName`, `.cardCost`, `LAYOUT`,
   the `.card*` block). The verification harnesses already prove this works.

2. **Feed it real data.** Render via `honeycomb.resolveCard`; keep a synthetic canonical sample (the
   NIGHTFALL mockup) as a fake resolved card; a fake run owner so the portrait + class glyph resolve.
   Show a **card wall**: every supertype, multi-type, both layouts, all three sizes, enemy moves
   (sprite-chain art — the case that was missed), broken/unplayable, empty / short / long text.

3. **Retarget the controls.** Every slider/toggle writes to a live value — `art.cardChrome.*`
   (per-layout window, piece boxes), `art.cardFrame` (ribbon/text/softness), `art.cardSize`
   (`nameFit`/`textFit`) — or to a CSS var, then re-renders. Overrides live in a thin layer so the
   shipped defaults show when untouched.

4. **Keep the comparison tools.** Chrome-only reference and the A / B-ref / 50% / difference views,
   applied to the live-rendered card.

5. **Promote workflow.** Show "default vs edited" and export a patch (tuning values + any CSS
   overrides) to apply to live. Wire the engine tests + `honeycomb-warnings` card-fit check as the
   bench's guardrail, so a change that breaks fit or tests is caught before promotion.

6. **One asset path.** The bench loads only `v13 spire images/…` through `honeycomb.image`; retire the
   parallel `_source` plumbing and the frozen backups once the live renderer is trusted.

---

## Decisions to settle

- **How edits persist.** In-memory overlay object over the shipped tuning (recommended) vs editing
  tuning directly.
- **Form.** Keep `../tools/card-effects-preview.html` as a thin shell, or make the bench a mode of the game.
- **The synthetic sample card.** What fields it pins (name/cost/text/tag/art/owner).
- **Card-wall breadth.** How many cases at once before it stops being readable.

## Non-goals

- No build step, no git. Must still open from `file://` and stay usable as the design bench.

## Known residue to fold in during the overhaul

- **Supertype text** (Claude): single-type straight word + icon vs the bench's curved SVG label;
  multi-type glyph spacing/tilt.
- Type icons: confirm the live set now matches the bench set (`type_*.png`).
