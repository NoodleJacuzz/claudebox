# Card redesign — layers and layout

## Z-order (confirmed)

Back → front. Art window clip follows the **active** gold frame.

| Z | Piece | Notes |
|---|---|---|
| 0 | `bg_*` | lower plate only; transparent above ~54% |
| 1 | card illustration | clipped to gold inner hole; never over the frame |
| 2 | `border_blue` | |
| 3 | gold frame | `frame_gold_horizontal` or `frame_gold_vertical` |
| 4 | ribbon | back (cloth) then front (gold trim) |
| 6 | type icons | on the ribbon face |
| 7 | `rarity_gold` | top of illustration; hideable |
| 8 | `ring_cost` | back (well) then front (gold rim) + numeral |
| 9 | tags | school strip (Vampiric, Necromancy, …); behind the class icon |
| 10 | `icon_*` | class emblem: back, front, then the class glyph |
| 11 | ink | name, supertype words, rules |

Tags are required in the layout. They are not a supertype. Leave room for at least one.

Owner ring (top-right, `cardOwner`): coin back → portrait → front. The portrait fill is clipped to the
coin's inner hole — **62.3% of the owner box diameter, centre 49.9% / 51.7%** (measured off
`ring_owner.png`), so it never paints over the gold front.

## Split chrome (2026-09-17)

Chrome is authored back/front rasters (`cardsGrok/new*`), coloured by **supertype**. Back pieces
(ribbon cloth, icon wings, ring wells) plus `border_blue` and `bg_priest_blue` take the supertype
duotone; front pieces (gold trim / rims) and the class glyph keep their colours. Full workflow,
colour table and open problems: `PIPELINE.md`.

The new winged icon (56.2% wide, top 84.9%) is scaled **0.85** bottom-centre to the old medallion
footprint (47.4% wide, top 86.7%); the Vampiric tag cannot move up (rules text ends ~82.5%).

## Windows

| Layout | Left | Top | W | H |
|---|---|---|---|---|
| horizontal | 7.5% | 12.9% | 84.9% | 40.2% |
| vertical (placeholder) | 7.5% | 12.9% | 84.9% | 81.5% |

Vertical placeholder: no `bg_*`. Dark gradient up from the bottom for text. Ribbon top 52.0%, text top
63.0% with height 19.5% (bottom 82.5%), so three rules lines clear the Vampiric tag at 83.2%.

## Layout object (bench)

Lives on the preview page as `window.LAYOUT`.

```
{
  layout: "horizontal",
  aspect: [1176, 1500],
  window: { left: 7.5, top: 12.9, width: 84.9, height: 40.2 },
  ribbon: { left: 19.5, top: 50.0, width: 61.1, height: 10.9 },
  text: { left: 6.5, top: 61.2, width: 87, height: 21.2 },
  name: { left: 26, top: 2.7, width: 52, height: 7.6 },
  cost: { left: 1.4, top: 0.9, width: 26.4 },
  owner: { right: 3, top: 2, width: 17 },
  gem: { left: 45.0, top: 7.6, width: 9.9, height: 8.7 },
  icon: { left: 27.1, top: 86.7, width: 47.4, height: 13.3 }
}
```

Cost from `assembledParts` gold bbox. Owner from live pip slot (not in assembledParts).
Gem/icon/ribbon from pre-spaced bboxes. Window from `frame_gold_horizontal` inner hole.

Per-layout overrides (`BY_LAYOUT`): vertical `ribbon.top 52.0`, `text.top 63.0`, `text.height 19.5`;
horizontal `ribbon.top 50.0`, `text.top 61.2`, `text.height 21.2`.

All three sizes share the same name slot: `left 26% / top 2.7% / width 52% / height 7.6%`, with the
cost in its usual top-left coin. Raised from `top 3.7 / height 6.6` (Noodle) so the title is not
cropped top and bottom; the small title is the medium/large treatment, not a reflowed band, and stays
in the band so it never covers the illustration.

## Size presets

Honeycomb pixels at 1:1 CSS px (tuning `designWidthUnits` 127):

| Size | Width | Source |
|---|---|---|
| small | 108 | `.hcDeckCell .hcCard` |
| medium | 127 | hand at reference: `18vmin` of 900 × aspect 0.784 |
| large | 300 | `tuning.art.cardSize` `widthPixels` |

## Typography

BRIEF "Live typography". Name/cost/types: norwester. Rules: railway. Card unit = width / 127.
Fallbacks no longer name Trebuchet (`norwester, sans-serif`).

Types on the bench are the **icons alone** on the ribbon face (multi mode). Single mode keeps the SVG
ribbon label (norwester). A words+icons row was tried in step 5 and reverted (does not fit the band).
**The supertype text is the known weak point** — bench single-mode label ~2/10, live
`hcCardSupertypeRow` ~4/10; see the handoff problem in `PIPELINE.md`.
