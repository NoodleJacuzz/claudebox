# Honeycomb Catacombs — SCALING-01: mobile landscape as a faithful scale-down

Session 6. Phones are a very important part of the playerbase, and mobile landscape must be playable.

## The brief, as written

> What I would very much like is for mobile desktop to be a truly faithful scale-down from desktop in
> all contexts. *Then* we can work out mobile-desktop-specific areas of resizing.
> However it's also important we address some paint points that the current layout accidentally
> revealed. So here's the plan:
>
> 1. For now, disable the "better played in landscape" notification. We'll use that screen to recommend
>    users use the app or play in fullscreen later, probably including a message about the annoying
>    tooltip that pops up for them when they fullscreen on browser.
> 2. Correct pain points revealed by the current mobile desktop scaling, since they may have actually
>    revealed problems early we'll naturally fall into later:
>
>    The menu, deck, and victory windows are unscrollable. They already clip outside of the screen on
>    mobile, and might do the same on desktop if made to tall.
>    Debuffs are doubled when dragging a card, very noticeable on mobile due to the oversized nameplates
>    Progression in teambuilding cannot be scrolled to the sides, it appears to be built for only a
>    single width and doesn't refit itself based on screen size.
>    Event screen titles are cut-off at the top, but only on desktop for some reason, I have no idea
>    about this one
>
> 3. Do an audit and cleanup of honeycomb's CSS to ensure the mobile and desktop views look identical in
>    all regards, please do not change any of Syrup Town's CSS (IF POSSIBLE)

Reference screenshots: `!designDocs/honeycomb/!imageStorage/screenshots/desk vs mobile/` (before this work).

## Status

| # | Item | State |
|---|---|---|
| 1 | Rotate hint off | ✅ `tuning.dom.rotateHintEnabled: false`. Markup, CSS and dismissal kept for the later fullscreen/app note |
| 2a | Menu / deck / victory unscrollable | ✅ `.hcOverlayPanel` scrolls past its max-height. Checked with a 25-button menu |
| 2b | Statuses doubled while dragging | ✅ Real bug, not a scaling one. See below |
| 2c | Progression tree fixed width | ✅ Laid out for the column's real width; scrolls sideways below the minimum; refits on resize |
| 2d | Event titles cut off (desktop only) | ✅ Host page's 24px line-height under 45px letters. See below |
| 3 | Desktop = phone, everywhere | ✅ 0 mismatches in every scene at an exact 2× scale. `style.css` untouched |

## Why the phone did not match

A 2340×1080 phone is only ~411 CSS px tall; a 1080p desktop browser window is ~900. Three things did
not follow the screen down:

1. **~810 raw `px` lengths** in `honeycomb.css` — fixed, so twice the size in proportion on a phone.
2. **The type and spacing scale was `clamp(9px, 1.6vmin, 13px)`**. At desktop height the ceiling won;
   on a phone the FLOOR won. Same numbers, different rule in charge.
3. **A `@media (max-height: 480px)` block** changed paddings and hid a nameplate reading on short
   screens only.

Plus two inherited from the host page, invisible until measured: Syrup Town's `html`/`body` set
`line-height: 24px` and `font-size: 16px`, fixed, into everything that does not state its own; and
native scrollbars are a fixed number of real pixels wide, so every scrolling panel was narrower on a
phone.

## What was built — THE HONEYCOMB PIXEL

- `--hc-px` = the viewport's shorter side ÷ `tuning.layout.referenceHeightPixels` (900). **Every length
  in `honeycomb.css` is `calc(N * var(--hc-px))`**. 900 was chosen because Noodle's desktop window is
  1920×~902 at 100% Windows scaling, so the desktop is unchanged to within 0.2%.
- Dynamic viewport units (`dvmin`, `dvh`) behind `@supports`, so a phone's address bar is not counted
  as screen.
- Clamps were resolved to their value at the reference height (they were constants in disguise once
  everything scales together); `vmin` literals folded into `--hc-px` (1vmin = 9).
- The max-height media block is deleted (a note stands where it was).
- `font-size` and `line-height` restated on the hosts in honeycomb pixels at the host's values.
- Scrollbars: `::-webkit-scrollbar` sized in honeycomb pixels on every honeycomb scroller. `scrollbar-width`
  is set ONLY for browsers without the pseudo-elements, because setting it makes Chrome ignore them.
- JS: `honeycomb.cssPixels(n)` / `cssVmin(n)` / `cssLength(value, unit)` for lengths written into
  styles; `honeycomb.pixels(n)` for lengths used in arithmetic beside measured boxes (tooltip gaps).
  Every tuning `...Pixels` visual value goes through them. **Input distances (drag thresholds, drop
  margins) deliberately do not** — a finger does not shrink with the screen.

### Rules from here on

- **A raw `px` in `honeycomb.css` or a `+ "px"` on a tuning number is a bug.** It will render at twice
  the size on a phone. Lengths measured from the DOM (`getBoundingClientRect`, `clientX`) are already
  real pixels and stay as they are.
- **Phone-specific resizing** (the next step) should be deliberate and in one place — e.g. a class on the
  root, or a change to what `--hc-px` resolves to — never a height media query scattered through rules.
- Large text needs its own `line-height`; never rely on the inherited 24px.
- **The one exception: what is printed ON A CARD** (round 06, item 7). Card ink is measured in
  `--hc-card-u`, the card's own width ÷ `tuning.art.cardSize.designWidthUnits`, from container query
  units. The card's box is still sized in honeycomb pixels, so the chain holds: screen → card width → card
  text, and a phone still sees a faithful copy. See CATCH-UP, "EVERY CARD ON SCREEN HAS A SIZE".

## The pain points

**Statuses doubled.** `combatScene.updateVitals` rebuilt a plate's vitals without the options the fighter
builder used (`showIdentity: true, showStatuses: false`), so each redraw put a second status row inside
the vitals and dropped the class medallion. Aiming a card redraws every plate, so every drag doubled
them. Both now share `combatScene.plateVitalsOptions`, and `updateVitals` redraws the status row where
the plate keeps it (the under-row). On a phone it only looked worse because the plates were oversized.

**Event titles.** `.hcOverlayTitle` is 45px text that inherited a 24px line box. It hung out above its
box; in an event or shop the title is the first child of a scroller with no top padding, so the
overflow was clipped. Phones escaped only because their clamp floor made the title ~20px. Fixed with
`line-height: 1.15` on `.hcOverlayTitle` and `.hcTitleName` — the only 45/24 cases in any scene. The
27px/24px cases (primary buttons, panel titles) overflow by 12% and draw fine; left alone.

**Progression tree.** It was one 320×640 SVG stretched to the column, so a narrower column shrank every
node and name with no scroll. Now one SVG unit is one honeycomb pixel, `progressionScreen.fitToStage`
lays the nodes across the column's measured width (never below `treeView.width`), and below that the
stage scrolls sideways (`.hcTreeCanvas` inside `.hcTreeTabStage`; the tab column has `min-width: 0` so
the tree cannot widen it). The kernel's scroll memory now keeps `scrollLeft` as well. A `ResizeObserver`
on the root refits it when the screen changes — on the root, not the window, per REQUIREMENTS §8.
At the reference size the tree draws ~6% smaller than before (it was stretched 340/320).

## Verification

`!designDocs/honeycomb/tools/audit-scale-parity.js` (usage in its header). Desktop 1920×902 vs 858×403 (same
aspect), 13 scenes: combat, menu, deck, log, victory, debug, compendium, map, event, shop, team,
tree, title.

- Before: combat 364 of 365 elements mismatched.
- After, at 1× density: log / victory / map / event / shop **0**; combat and deck 2 (the hand shelf art
  mid-load); menu, title, debug, compendium, team, tree show hairline-border rounding and one 6px label
  wrapping.
- After, desktop vs **exactly 2×** (3840×1804), where nothing rounds: **0 in every scene checked**
  (menu, debug, compendium, team, tree, title). The remaining 1× differences are rasterisation, not
  layout; a real phone at ~2.6× density rounds far less than the emulator.
- Desktop before vs after: unchanged except the tree and the overlay titles above.
- 836 headless tests pass.

## Open

- **Mobile-specific resizing** — the step the brief puts after this one. Not started.
- **The rotate-hint screen as a fullscreen / app recommendation**, with a note about the browser's
  fullscreen tooltip. Not started; the screen is only switched off.
- At narrow aspect ratios (4:3) the teambuilding tab strip wraps "Progression" onto a second row. It
  reads fine; flagged in case it should not.
- Not yet seen on a real phone after the change.
