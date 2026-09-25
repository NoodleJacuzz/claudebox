# Card redesign — STATUS

Read `BRIEF.md` first, then this. **Do not mark a step complete without browser screenshots.**

**Hard rules (do not skip):** no gameplay changes. No writes into `v13 spire images/_source/cards/`.
Copy lighting, not source mistakes.

Sessions 2–6 are `_archive/SESSION-LOG.md`. This file holds where the work IS.

---

## Current

- **Docs overhauled 2026-09-17.** `PIPELINE.md` is the new handoff doc. `BRIEF.md` Step 6 redefined
  (authored split rasters + supertype duotone), **Step 8 dropped**, type colour moved in scope.
  `INFERENCES.md` I-29…I-33 close the pivot.
- **Step:** 3 complete, 4 frozen, 5 complete, 6 **redefined and built** (authored back/front splits,
  supertype tints, settings persistence). 8 dropped. Next: **effects** (cherry blossom, step 9) while
  the **supertype text** is handled separately (Friday, Claude), then **wire in**.
- **New-chrome backup taken** (near the ideal wire-in state): `backups/card-effects-preview.newchrome.html`
  + `backups/layout.newchrome.json`, opens standalone, no failed requests.
- **Step 9 (cherry blossom) quick prototype done** — `.petalVfx`, `cherry blossom` toggle;
  evidence `overlays/step9/`. Plan written in `EFFECTS.md`; next is the real prototype from the mockup
  silhouette.
- **Multi-type colour gradient — WORKING.** Three supertype selects (primary/second/third); each
  recolourable piece renders a stack of baked variants (`data-piece`/`data-copy`), copy `i` masked 135°
  (`share = i/N`, 12% soft). Evidence: `overlays/step6/grad-damage-lewd.png`,
  `grad-damage-support-lewd.png` (red→pink and red→blue→pink), console clean.
- **Root cause of the "square edge" artifact (found & fixed):** not the mask. `.newPiece` carries
  `display:block !important`, which out-specified the plain inline `display:none` used to hide unused
  copies — so copy 2 (an `<img>` with no `src`) kept rendering and Chrome drew its box outline as a
  faint rectangle at each loose coin. Fix: hide unused copies with
  `wrap.style.setProperty("display","none","important")` (and `removeProperty` when used). Masking a
  **wrapper span** (not the `<img>`) is also now the structure; keep it.
- The cherry-blossom quick prototype was lost when the bench was reverted earlier; re-build from
  `EFFECTS.md` at step 9.
- **Bench layout restored (card floats left, controls beside it).** The controls panel sizes to its
  content by default, so the two supertype selects I added widened it (1327px → 1492px) and, past a
  window-width threshold, it wrapped **below** the card instead of sitting to its right (step-3 had
  them side by side). Fixed with `.panel.controls { flex: 1 1 0; min-width: 0; }` (+ `flex-wrap: wrap`
  on `.controls label`). Verified side-by-side at 800/1024/1280/1600/1920 with no horizontal overflow.
- **WIRED INTO THE GAME (2026-09-17, session 23).** Noodle: "wire the card frame into the game now,
  despite the type text issue." Done for **horizontal** cards: the split chrome + baked supertype
  tints + 135° multi-type blend now render through `honeycomb.ui.card`; pieces published to
  `v13 spire images/cards/chrome/` by `overlays/splits/publish-live-chrome.py`. Engine suite 1271/0;
  cards verified small/medium/large for damage/support/lewd/negative/passive/curse + a multi-type.
  Live files backed up (no git) in `backups/wire-live/`. Details in `PIPELINE.md` → "Live wiring".
- **Vertical wired + bench parity (same session).** Vertical now uses the same chrome (per-layout
  window/`frame_gold_vertical`, `bg` horizontal-only, dark wash, ribbon + text raised), so no layout is
  left on the old placeholder. Other live↔bench differences closed: multi-supertype now prints **icons
  alone** (bench multi mode; a single type keeps icon + word), the rules-text box + `textFit.fitCount`
  were recalibrated (69-char sample 18.68px vs bench 18.14px), and the card tags moved to the bench's
  band (bottom 12.6%). Engine suite still 1271/0.
- **Owner class glyph (session 23 follow-up).** The winged emblem now shows the owner's class glyph
  (`artFolder` → `newicon_knight`/`_priest`/`_lancer`); classes with no glyph drawn yet show none.
  Noodle: "knight should certainly have one." The **shift arrow** over the art (a bench gap) was
  restyled from a dark pill to a small gold chevron on a faint halo. Both in `PIPELINE.md`.
- **Bench parity pass (session 23).** Diffed every printed element live vs bench and matched: the
  bottom **tags** (now beveled banners: top 83.2%, height 4.2%, 8.6u, 0.1em, bevel clip, light word —
  fill takes the school colour), the **gem** `scale(0.56)`, the **ribbon** and **emblem** drop shadows,
  **supertype glyph** size (13.8u / 18u medium) + shadow, the **art** `object-position: center 18%`,
  the **rules text** side padding. The **name/cost** colours went the other way: Noodle preferred the
  live palette (`--hc-cream` / `--hc-gold-bright`), so live keeps it and the BENCH was changed to
  match. Deliberate keeps and the residue still owned by the supertype-text handoff are listed in
  `PIPELINE.md` → "Bench parity". 1272/0.
- **Enemy card art fix (session 23).** The bench's `object-position: center 18%` was copied onto ALL
  card art, but an enemy move draws a full-body sprite chain with the figure at its FOOT — 18% down
  landed on the empty top and every enemy card went blank. Chain sprites now anchor `center bottom`;
  party busts keep the 18%. Verified with a real sporeling intent card (small + large).
- **Supertype icon set swapped (session 23).** The live cards wore the old `icons/*` set; they now use
  Noodle's drawn set (`type_attack` / `_negative` / `_lewd` / `_passive` / `_support`), published to
  `v13 spire images/icons/` by `publish-live-chrome.py` and pointed at by each type's `iconPath`.
  `type_unused` is scrap (PIECES.md) so **Curse keeps its old icon** (no drawn curse icon yet).
- **Bench overhaul plan saved:** `BENCH-OVERHAUL.md` — the bench renders through the live
  `honeycomb.ui.card` + CSS + tuning so it becomes a beta/staging of the live cards (one renderer, no
  silos). Next session can take phase 1.
- Session 23 done: cards wired (horizontal + vertical), bench parity pass, enemy-art fix, icon swap.
- **Open blocker to wiring:** supertype text — bench single-mode ribbon label ~2/10, live
  `hcCardSupertypeRow` ~4/10. Problem statement in `PIPELINE.md`.
- **Composer art:** `_source/refsPNG/characters/vamp1V-basic-a.png` (Vex face). Lab/broken:
  `clemence-martyr.webp`.
- **Overlay ref:** live = `card_redesign/overlays/step5/chrome-only.png`; frozen step-3 =
  `card_redesign/backups/chrome-only.png`. Regenerate with
  `overlays/step3/make-chrome-only.js --out <file>` after any face change.
- **Backup of step 3:** `backups/card-effects-preview.step3.html` + `backups/layout.step3.json`
  (frozen; do not edit the copy — keep working on the live bench).

## Restore the step-3 backup

Copy `backups/card-effects-preview.step3.html` back over
`!designDocs/honeycomb/tools/card-effects-preview.html`, or just open the backup directly: its asset paths
are rebased for the `backups/` folder and it loads `backups/chrome-only.png` beside it.
`backups/layout.step3.json` is the frozen `window.LAYOUT` and is the single source of
truth for the layout numbers.

---

## Overlay log

| ID | Result | Note |
|---|---|---|
| OT-0a–OT-2c | pass | prior |
| OT-3a | pass | 50% vs chrome-only: border/frame/ribbon/cost/owner/icon/tags register (`overlay-50.png`) |
| OT-3b | pass | difference: chrome slots near-black; residue is art/text/window only (`overlay-diff.png`) |
| OT-3c | pass | magenta: no holes in bg/border/frame; magenta only outside the card's rounded corners (`magenta.png`) |
| OT-3e | pass | console clean; no `frame_blue` / `detail_gem` request in the bench |
| OT-3f | pass | frame file is `frame_gold_horizontal.png` (large/medium), `frame_gold_vertical.png` (vertical) |
| OT-3g | pass | gem sits on the top arch below the name, near the top of the illustration (`gem-crop.png`) |
| OT-3h | pass | owner portrait clipped inside `ring_owner`, gold rim intact (`owner-ring-crop.png`); `icon_priest` separate bottom layer |
| OT-3d | pass | stage widths measured: small 108×137.75, medium 127×161.98, large 300×382.64 (live `partArray` per size) |
| OT-4a | pass | backup opens standalone: clean console, no failed requests, `chrome-only.png` ref, name box 2.70%/7.60% matches live (`overlays/step4/backup-{A,50,diff}.png`) |
| OT-4b | pass | restore paragraph above is copy-pasteable |
| OT-5a | pass | frame hidden → art visible; art hidden → window empty; art z1 under frame z3 (`overlays/step5/frame-hidden-art-visible.png`, `overlays/step5/art-hidden-empty-window.png`) |
| OT-5b | pass | computed: name/cost `norwester` (types are icon rasters; single-mode label `norwester`), rules `railway` |
| OT-5c | pass | name 32.95px at large (`13.95 × 300/127`), within 1px |
| OT-5d | pass | cost 51.02px at large (`21.6 × 300/127`), within 1px |
| OT-5e | pass | small rules `display:none`; cost visible (I-27) (`overlays/step5/composer-small.png`) |
| OT-5f | pass | portrait clipped to the ring hole, gold rim intact, class icon at bottom (`overlays/step5/owner-ring-crop.png`) |
| OT-6a | pass | recreated vs `assembledParts` at 50%: border/frame/ribbon/cost/owner/icon/gem slots register (`overlays/step6/ot6a-50-vs-assembledParts.png`) |
| OT-6b | pass | magenta plate: clean ring/frame edges, no fringe (`overlays/step6/magenta-cost-crop.png`, `magenta-owner-crop.png`, `magenta-full.png`) |
| OT-6c | pass | owner-ring gleam visible at large **and** medium (`overlays/step6/owner-gleam-{large,medium}.png`) |
| OT-6d | pass | bg lattice reads as a repeating vector grid, not a smear (`overlays/step6/bg-lattice-large.png`) |
| OT-6e | pass | step-4 source-assembly backup still opens standalone (`overlays/step6/step4-backup-still-opens.png`) |
| OT-6f | pass | horizontal is the target; vertical uses the taller hole and reads as metal (`overlays/step6/recreated-vertical.png`) |
