# Card redesign — INFERENCES

Inferred choices. **Not sign-off.** If Noodle disagrees, change the row and pivot as written.
Closed rulings stay here so BRIEF does not become a changelog.

## Closed (Noodle 2026-09-16)

| ID | Ruling |
|---|---|
| I-02 | `ring_owner` is **top-right**: the new owner mark (live “character icon” / portrait circle). `icon_priest` is **bottom**: the class icon, a separate piece. Both are in the final design. Ring fill is the character portrait, between back and front, clipped to `ring_owner_front`. Do not put the class icon inside the owner ring. |
| I-03 | **Keep** the rarity gem. Hue-shift made the old mark inscrutable; that is not a reason to drop the gem. Near the **top** of the illustration (`assembledParts`). Hideable later (likely starters). |
| I-04 | Cherry-blossom *meaning* undecided; depends on final quality. Build as a stackable overlay. |
| I-07 | Quality target: **horizontal priest**. `frame_gold_vertical.png` is in scope as a **basic placeholder** only (same metal, taller hole). Not a full vertical design pass. |
| I-08 | Card **type** colour is not owner colour. Type roster is undecided — do not add a type-frame step. Owner diversity is step 8 (recolour border / ribbon / frame). |
| I-09 | Step 8 recolours border, ribbon, **and** frame as needed. |
| I-11 | `type_unused.png` is scrap. `type_random` is still missing (later). |
| I-12 | Bench sizes = live small / medium / large, not invented px. |
| I-19 | This workstream starts at `BRIEF.md`, not CATCH-UP. |
| I-21 | Gameplay-neutral honeycomb CSS/JS is allowed. Existing classes reusable. Placeholders marked. Overrides of existing classes stay on the bench. |
| I-22 | `cardsGrok/` may reuse source filenames (`border_blue.png`). |
| I-23 | `frame_gold_horizontal.png` is the correct name (typo already fixed in source). |
| I-26 | Recreated chrome copies **lighting** (edge highlight, shine, shadow, radial glow, metallic gleam), not paint-overs, leftover white, baked-wrong-layer shadows, or dragged-edge shortcuts. |

## Open

| ID | Inference | Why | Pivot |
|---|---|---|---|
| I-01 | The named bench stays at `!designDocs/honeycomb/tools/card-effects-preview.html`. Docs/backups live in `card_redesign/`. | Existing URL. “Do not pollute honeycomb” means no extra siblings. | Move the bench into `card_redesign/` and leave a stub. |
| I-05 | Sample face for steps 3–7 is the `assembledParts` copy: NIGHTFALL / DAMAGE · LEWD / cost 2 / the printed rules. | Step 3’s chrome-slot pass bar is that PNG. | Swap in a real Clemence card’s name/text once chrome matches. |
| I-06 | Priest illustration: any existing Clemence art already in `cards/art/`. | No image model. | Noodle names a specific file. |
| I-10 | `ring_cost` splits the same way as `ring_owner`. | Same gold-on-blue construction. | Leave cost as one raster if the split looks worse. |
| I-13 | Do not restyle live `.hcCardBroken` or placeholder frames in a way the running game sees. Bench may copy the look. | No gameplay change. | Wire later, after Noodle asks. |
| I-14 | `bg_*` is a lower plate; art-window centre is already alpha 0. Illustration clips to the gold window. | OT-1b. | — |
| I-15 | Do not load exploded JPGs as composer layers. Trace motifs by hand. They are inspiration despite misplaced pieces, duplicates, and wrong colours. | AI JPEG, fake transparency. | — |
| I-16 | `assembledMockup.png` is illegal as a frame reference. Legal as petal/sparkle reference only. | User said so. | — |
| I-17 | Filter lab has **three** existing filters. Broken look has **four** candidates plus shipped. | Counted in the current HTML. | — |
| I-18 | Owner-ring gleam (BRIEF 2d-3) is a step-6 bar, not a step-2 deliverable. | Quality bar on the piece, enforced when built. | — |
| I-20 | Type-icon mapping for the match card: `type_attack` + `type_lewd` = DAMAGE · LEWD. | `assembledParts` shows those two. | — |
| I-24 | `assembledParts.png` was stacked with a **tall** art window (art continues under ribbon and text). Chrome slots still overlay it; the gold **window** follows `frame_gold_horizontal.png` (inner hole 7.5% / 12.9% / 84.9% × 40.2%). | Measured in step 1 (OT-1c). | If Noodle wants the window to match assembledParts exactly, that is a vertical card. |
| I-25 | `assembledParts.png` has **no** `ring_owner`. Class icon at the bottom is `icon_priest` (its own medallion). Owner ring is still top-right, filled with the character portrait. | Noodle placement + live pip slot. | — |
| I-27 | **Closed (Noodle 2026-09-16):** the bench's small card keeps the **cost visible** and the **name in the same slot as medium/large** (`left 26% / top 3.7% / width 52% / height 6.6%`). Do not reflow the title to a full-width band. Get the placement correct first; visibility tuning comes later. | Direct instruction: cost and title in their usual spots. | — |
| I-28 | **Closed (Noodle 2026-09-16):** hand-recreating the painterly chrome in **SVG or CSS is abandoned.** Do not re-attempt it; see the warning lesson in `STATUS.md`. `make-ribbon-masks.py` (exact shape masks + palette split) is the one keeper. A faithful chrome needs a pixel-space pipeline (e.g. Python/PIL rasters in `cardsGrok/`). | Session-5 attempt failed; Noodle archived it. | Revisit only with a pixel-space approach, and only if Noodle asks. |

## Closed (Noodle 2026-09-17) — the pivot

| ID | Ruling |
|---|---|
| I-29 | **Chrome is authored back/front raster pieces**, coloured by **supertype**. `BRIEF.md` Step 6 is redefined accordingly (was "recreate chrome"). Supersedes I-08: type colour **is** now in scope and drives the frame. See `PIPELINE.md`. |
| I-30 | **Owner colour is out; supertype colour is in.** `BRIEF.md` **Step 8 (necro/vamp owner equivalents) is dropped** — owner frames are not needed. Gold stays gold on every supertype; the duotone tints only the back pieces + border + plate. |
| I-31 | New pieces are authored in `_source/cards/` and **copied** to `cardsGrok/` (originals left as backups). Ring splits are generated by `overlays/splits/make-ring-splits.py`. |
| I-32 | The new winged icon is scaled **0.85** (bottom-centre) in the bench; it is wider/taller than the old medallion and would otherwise reach the tag band. The tag cannot move up (rules text ends ~82.5%). |
| I-33 | **Supertype text is the open blocker** for wiring in. Bench single-mode ribbon label ~2/10, live `hcCardSupertypeRow` ~4/10; both need type-setting work. Handoff problem written in `PIPELINE.md`. |
