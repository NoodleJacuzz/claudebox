# Honeycomb art pipeline — CATCH-UP

**Read this first for the art-pass pipeline.** Refs in `v13 spire images/_source/refsPNG/` → the webui v2
engine → Forge with ControlNet reference → hand paint-over → injected into the game.

- **The 2026-09-21 restructure** → `ART-RESTRUCTURE.md`: the PNG archive rule, the 1216 standard sprite height,
  how an enemy's size is really controlled, the size pop and what actually caused it, and which pictures have
  lost their originals. It ends with **the numbered to-do list for the whole restructure**, saying who can
  do each item and what must never be done. **Read it before touching art folders or the conversion step.**
- **What Noodle asked for, verbatim** → `BRIEF.md` (11 steps, then the **round 2 rulings**, which override
  FEASIBILITY)
- **Whether it works and the order** → `FEASIBILITY.md` (overruled passages moved to its end)
- **The engine** → `!designDocs/webui_engine/CATCH-UP.md` (its rules, traps and test commands)
- **Step 1's corrections** → `REFS-CLEANING-01.md`; the tools → `refs-report.js` (tag matrix, tidy), `refs-census.js` (engine census)
- **Steps 3–5** → `POSES-01.md` (cast, patterns, templates); tools `refs-roundtrip.js` (step 3 test), `pose-templates.js` (templates, scoring, `MISSING-PROMPTS.md`), `refs-generate.js` (Forge + ControlNet)
- **Step 6** → `refs-shortcuts.js` (the shortcut rules, `--write`); the shortcuts live in cleaningDB + the
  charactersDB entries; the compiled shortcuts are `MISSING-PROMPTS.md`; the review sheet is `SHORTCUTS-TESTS.md`
  (`refs-shortcuts-test.js`)
- **Alternate outfits (brainstorm)** → `OUTFITS.md`: all **19 outfits, sets A–F (114 designs)**, outfits alphabetical
  per character. Source data `outfit-designs.js`, test runner `outfits-generate.js`, doc builder `build-outfits-doc.js`.
  Round-1 and round-2 lineups archived in `_archive/outfits-AF-round1/` and `_archive/outfits-AF-round2/`. Not
  written into `charactersDB.js` yet.
- **Where game art goes** → `!designDocs/honeycomb/reference/ART-GUIDE.md` §1 (paths), §5 (fallback)

## Status as of 2026-09-14 (session 5: step 6 done)

**The templates are now typeable.** `.hcKnightV, default, PoseDefense` compiles the whole defense template. The
layers split exactly as round 2 asked (global template in cleaningDB, exceptions on the entry):

| Where | What | Tool |
|---|---|---|
| `cleaningDB.js`, top of Initial | CORE per slot + `solo, simple background, white background`; each rule KEEPS the `Pose…` token so the entry can still see it | `refs-shortcuts.js --write` |
| `charactersDB.js`, each `.hc*` entry | METHOD + SEX + `'male only'` + DROP, one rule per slot | same |
| `charactersDB.js`, each `*default` outfit | `TornDamage; torn …` — damage on the outfit, per round 2 | same |
| `cleaningDB.js`, end of Final | purge of an unclaimed `Pose…` token | same |

- **119/132 slots compile identically** to the step 5 template input. The 13 differences are all one engine law,
  not a bug: the insertion gate's exclusivity resolves a mutually-exclusive pair differently from a typed tag
  (`open mouth` vs `grin`, `laughing` vs `crazy`, `covering face` vs `hair over eyes`), or a Phase-2 tag
  (`stepping on head` → solo determination) arrives in Phase 4. `refs-shortcuts.js` lists them; step 7 owns the
  verdicts.
- **Two engine gaps closed** (webui_engine CATCH-UP, top block): Rule 2c now protects a quoted value a *cleaning
  rule* writes (`'pain'` in the defense CORE), and a `!tag` an entry injection adds is read as a negation (Nettle's
  breakdown DROP). **Noodle confirmed the `!` reading is the intended one** ("don't include black staff"). 9 new
  tests in the engine suite.
- **`refs-shortcuts-test.js` writes `SHORTCUTS-TESTS.md`**, a review sheet: 934 checks, per-slot pass/fail plus the
  golden 13 and the mechanics (DROP, `male only`, purge, pose-adds-tags). Separate from the engine suite on purpose;
  the golden list is a step-7 input, not a permanent law.
- **`refs-generate.js` now sends the shortcut**, so the prompt it dispatches is the one the webui produces and
  the one in `MISSING-PROMPTS.md`. It also attaches the browser's `Prompt Notes` `alwayson_scripts` entry, so the
  Forge extension runs on scripted runs too: line 1 of the infotext is the clean prompt (no style), with `Raw input`
  beside it. The sidecar written next to each PNG is that PNG's own `parameters` text chunk, so a refsTests `.txt`
  is the same shape as a final `.txt`. `save_images` is `false` (the runner writes the PNG; Forge should not drop a
  second copy into the generation PC's working folder), and when Forge is busy with a Discord job the runner **waits
  and retries** (`--wait <seconds>`) instead of stopping, so a batch is not restarted from the top. Saved as
  `<slot>-NNN` (incrementing counter, never the seed in the name; the keeper drops the suffix to slot in). `--size`
  takes a `basicImageSizes` id — `Portrait` (832×1216), `Semi-Tall` (896×1152), `Semi-Wide`, `Landscape`, `Vertical`
  — **never raw W×H**, so height and width cannot be transposed. `--missing` ignores the output folder on purpose, so
  running it again accumulates `-002`, `-003`, … variants for every slot instead of resuming. `--sexes V,C` limits a
  run to a subset of the cast (same spelling as `outfits-generate.js`); `--sexes V` is the 43 injected-art slots,
  leaving the 54 C slots for the gender-swap test bed. `--reference on|off` (default **off**) now governs the
  ControlNet `reference_only` unit: the trained Honeycomb LoRA holds the look, so the old `-basic-a` crutch is
  opt-in. Same flag on `card-prompts-generate.js` and `regenerate-from-sidecar.js`. Seer's `-basic-a` art is still
  the retired purple-cape/flaming-skull design, so her reference must be regenerated before `--reference on` is
  used for her again.
- **Cassadora's alt-outfit brainstorm (round 03b) updated to her new design:** the retired
  `floating skull, flaming skull, necromancer` cluster became `floating orb, flaming orb` in grifter A/B,
  hedgeWitch A/B and soothsayer A/B, and the `build-outfits-doc.js` seer core now reads black cape + crystal ball.
  `OUTFITS.md` regenerated (114 designs).
- **Step 5 tables changed:** `hand on headwear` → `hand on hat` in Cinder's method (an entry injection skips
  Initial cleaning, so the canonical spelling has to be in the rule). This one is invisible to the template score.
- `MISSING-PROMPTS.md` regenerated from the shortcut path; it now also lists where the shortcut differs from the
  template. Score unchanged: 99.1% over 35 sidecars, 97 missing. Engine suite 698 passed / 4 pre-existing failed.
- **Closed by Noodle:** the damaged-action filename (the `<pose>-a` / `<pose>-b` renaming already covers it) and the
  style question (`Honeycomb`, already the runner default).
- **Alternate outfits, round 01 (brainstorm):** `OUTFITS-01.md` — 16 designs (one per alt outfit), each with a
  prompt and TornDamage, sourced from `honeycomb-content-characters.js` outfitArray. Ornaments follow Noodle's
  `[colour] [object] [location] ornament` framework and carried things are positioned (`holding bell`,
  `mace on back`). The placeholder hue table is **ignored** — those tints are stand-ins, not design. Nothing is
  culled; the only uncategorised tags are the deliberate position phrases (`mace on back`, `dagger on hip`,
  `knife on hip`, `green mushroom on shoulder`, `green leaf hair ornament`, `holding key`, `holding playing card`,
  `green witch hat`). `smoke` was dropped (culled by `simple background`). **Not written into `charactersDB.js`**
  — Noodle reviews, may ask for more designs per outfit, then a batch is generated.
- **Alternate outfits, round 02 (A–F, combined):** `OUTFITS.md` (built by `build-outfits-doc.js` from
  `outfit-designs.js`) replaces the old `OUTFITS-01/02.md`; outfits are alphabetical inside each character.
  **A** = core look with a changed haircut; **B** = new palette + swapped weapon(s); **C** = original concept.
  **D/E/F are round-2 lewd** (Noodle: uniqueness must be across the WHOLE lineup, not per character): each of the
  57 designs has its own medium / tease / fetish, every one names a real lewd tag AND an invented one (57 made-up
  tags, verified absent), and no fetish tool repeats — the assembler asserts `harness`, `collar`, `leash`, `chain`,
  `rope`, `shibari`, `suspension`, `pillory`, `stocks`, `mummy`, `doll`, `taxidermy`, `brand`, `chastity belt`,
  `tentacles`, `marionette`, `possession`, `gambling`, `bit gag`, `reins`, `dominatrix` and `crop` are used by
  exactly one design each. Gendered tags split into `tagsV`/`tagsC`. **19 outfits, 114 designs; nothing culled.**
  The round-1 lineups and their 228 images are archived in `_archive/outfits-AF-round1/` and
  `refsTests/2026-09-15/outfits-AF-round1-archived/`. Still not in `charactersDB.js`.
- **Three new alt outfits (2026-09-14):** Cinder **`ashfall`**, Cassadora **`soothsayer`**, Clemence **`penitent`**,
  each with the full A–F set (mechanics to come). Counts after this: knight/necro/vamp/lancer/seer have 3 alt
  outfits, priest has 4. **A full test run (114 designs × V/C = 228 images) is in progress** into
  `refsTests/<utc>/outfits/`, no ControlNet, `PoseA`. Still not in `charactersDB.js`.
- **Alternate outfits, round 03 (2026-09-15, Noodle's second brainstorm):** judged against the `favorites/`
  shelf. Completely unrepresented (neither C nor V favourited): `priest/abbess`, `priest/penitent`,
  `seer/hedgeWitch`. Reworked: **rotsinger** rebuilt off the mushroom theme (now *Blightwail*, the ruined
  harvest, so it no longer collides with sporemother); **ashfall** rebuilt as *Wayfarer*, the ash-road nomad;
  **Clemence** — every C and F design is dressless and her A/B/D/E dresses are now distinct cuts with distinct
  overlays; **Cassadora rebuilt from scratch** (grifter = casino card-sharp, hedgeWitch = bog witch, soothsayer =
  star-reader). **Every cup and coin removed**; **candles and all loose props positioned** (`candle on floor`,
  `floating candle`, `lantern on floor`, `holding crystal ball`, `raven on shoulder`, …).
  **Revision (same day, on Noodle's review):** the unviable lewd words (pillory, egg sac, doll joints,
  petrification, gambling, taxidermy, marionette) and the whole overlapping restraint/corset cluster (shackles,
  harness, leash, chastity belt, bit gag/reins, shibari, crop/dominatrix, corset) are gone, replaced by 19
  distinct viable tools (slime, animated weapons, pheromones, piercing, love potion, heat, brand, living clothes,
  inflation, hypnosis, orgasm denial, body writing, glowing runes, burial, objectification, …). Clemence now
  carries nothing in-hand (`holding X` is exclusive against `palms up`); `veil` was dropped from Nettle and Cassadora
  (but stays as Clemence's signature eye veil); `wheat` (a background element) and `locust` (unrecognised) were
  removed; and no modern technology remains (no goggles, jetpack, firearm or canteen). Round-2 source archived
  in `_archive/outfits-AF-round2/`; `OUTFITS.md` regenerated (114 designs, 57 invented). Still not in `charactersDB.js`.
- **Round 03b (2026-09-15, after Noodle reviewed the generated images):** the whole 114 was rebuilt so the
  lewd sets are **counterparts**: **D = lewd A** (A's palette, haircut and gear, exposed), **E = lewd B**
  (B's palette and swapped weapon, teased), **F = lewd C** (C's concept, hypersexualised) — the earlier pass
  had made D/E/F three unrelated concepts, which is why they read as a different outfit from A/B/C and as
  samey among themselves. Every character's outfits were also pushed onto **different silhouettes**
  (Cassadora: pinstripe trouser-suit vs patchwork poncho vs star gown; Nettle: strapless gown vs tunic-and-leggings
  reaper vs mushroom-hat gown; Cinder: shorts-and-cloak vs military uniform vs crop-top-and-harem-pants
  ember-dancer, so **ashfall** finally leaves the wide-brim shape). Targeted visual test (almoner A–F to prove
  the mirroring, plus rotsinger, ashfall and all three Cassadora sets, 72 images) is in
  `refsTests/2026-09-15/outfits-round3b/`. All 114 still compile with 0 engine errors.

Earlier sessions (3 and 4) are `_archive/SESSION-LOG.md`.

---

## Protected tags in the sidecars (Rule 2c)

Noodle asked for the engine to protect a tag in single quotes and strip the quotes at render, so only the tag
reaches Stable Diffusion; then to quote the sidecar tags the engine was altering or adding to. **Rule 2c is
built** (webui_engine CATCH-UP, rule 2c). Backup before quoting:
`v13 spire images/_source/refsBackup/2026-09-14-before-quoting/characters/`.

`refs-census.js --triggers` finds what to quote: it protects each tag alone, recompiles, and reports which
engine additions vanish. A trigger needing TWO tags shows up only once the first is quoted, so rerun until it
stops finding any.

| Quoted | In | What it stopped |
|---|---|---|
| `male only` | every femboy C (8) | rewritten into `1boy, solo, femboy, male focus` |
| `cute boy` + `male focus` | Brienne and Nettle C (4) | `femboy` (needs both quoted) |
| `wide hips` | Clemence (4) | `thick thighs` |
| `pain` | Nettle breakdown, Severine defense | `ryona, masochism, broken rape victim, addicted to rape` |
| `mind break` | Severine breakdown | `fucked silly, twitching, trembling` |
| `drool` + `drooling` | Severine breakdown | `saliva` |
| `aroused`, `horny`, `pent-up`, `heavy blush`, `profusely blushing`, `ear blush` | Nettle breakdown | rewrites and `blush, full-face blush, blushing profusely` |
| `brainwashing` | Brienne breakdown | rewritten to `brainwashed, mind control` |
| `full-face blush` | Severine exposed (2) | `heavy blush, blushing profusely` |
| `areola slip` | both breakdowns | `areolas` |
| `nipple slip`, `breasts out`, `pussy`, `balls exposed` | Brienne C-b, Cassadora V-ex, Clemence V-ex, Severine V-ex | `nipples`, `cleft of venus, clitoris`, `balls` |
| `erect nipples` | Brienne V-b | culled by `covered nipples` |
| `balls`, `penis outline` | Nettle C-a | culled by `bulge` |
| `tenting`, `erection under clothes`, `balls outline`, `penis outline`, `penis lifting loincloth` | Cinder C-b, Nettle C-b, Cassadora C-a | `covered penis, penis outline, erection under clothes, covered balls, balls under clothes, lifting own clothes` |
| `wide stance` | Cassadora a (2) | `legs spread` |

**Added instead of quoted:** `flat chest` on Cinder's two C images, which the engine was supplying. Every other
male version carries it; step 1 missed it (REFS-CLEANING-01, addendum).

**Deliberately NOT quoted** (census after quoting: nothing rewritten, nothing else added):

- `full body` / `cowboy shot` add a default `looking at viewer` to 5 images with no gaze of their own. Quoting a
  framing tag would switch off its real work (framing culls, framing negatives). Step 5's pose templates should
  state the gaze instead.
- `cowboy shot` culls `red boots`, `front-laced boots` on Severine's breakdown. Correct: the feet are out of frame.
- `balls peek` (Nettle C-a) is still uncategorised.

**What quoting costs:** a quoted tag is invisible to the engine, so it cannot trigger a GOOD rule either (a
framing cull, a gender swap). `male focus` quoted on four C images means the engine's focus logic does not see
it; the engine still emits it. Revisit when step 3's gender work needs it live.
## Codenames (step 2)

Noodle: a digit inside the tag makes it unrecognisable to the model, and aliases carry the readable spelling.
**One codename per character, shared by C and V**: the sex comes from `1boy` / `1girl`, which is the engine's
gender-swap work.

| Folder | Character | Codename | Typed aliases (cleaningDB, "Common Mistaggings") |
|---|---|---|---|
| `knight` | Brienne | `hc-kn1ght` | `hc-knight`, `hc-brienne` |
| `lancer` | Cinder | `hc-l4ncer` | `hc-lancer`, `hc-cinder` |
| `necro` | Nettle | `hc-n3cro` | `hc-necro`, `hc-nettle` |
| `priest` | Clemence | `hc-pr1est` | `hc-priest`, `hc-clemence` |
| `seer` | Cassadora | `hc-s3er` | `hc-seer`, `hc-cassadora` |
| `vamp` | Severine | `hc-v4mp` | `hc-vamp`, `hc-severine` |

The rule for a new character: the art folder name with ONE letter swapped for a digit (a→4, e→3, i→1, o→0; a
name with none of those swaps an `l` for `1`). Registered as `bodyBrand` singletons in `singletonKeywordDB.js`,
beside `sy-helena`. The aliasDB name block waits for the charactersDB entry (step 3).

## Step 2a (the engine against a white background)

`refs-census.js` compiles every sidecar and lists what the engine culled, rewrote, added, or cannot categorise.

**Fixed: rules that removed character details.**

| What | Cause | Fix |
|---|---|---|
| `flaming skull` ×12, `black staff` ×7, `planted sword` ×4 | `simple background` culled `backgroundObjects`, which is `simpleObjectArray` (sceneDB): every HELD prop | `objects` taken out of that cull (cullDB.js, reason written beside it) |
| `wind blow` ×1 | filed as background weather | `wind`, `wind blow`, `breeze` moved to sceneDB `fx` |
| `fantasy` | background theme; our sidecars only survived because their weight made them immune, and a charactersDB entry's weight does not (Rule 16b) | moved to sceneDB `unsorted` |

**Categorised** (30 → 2 left): clothes through `webui2-sort.js` (`knight visor`, `visor up` → headwear/helmet;
`buckler` → weapons/shield; `necromancer`, `cleric`, `battle damage`, `crotch tear` → fullwear; `single pantsleg` →
lowerwear inner/pants; `floating skull` → clothesUnsorted). Scene tags by hand into their sceneDB sections: Face
(`full-face blush`, `profusely blushing`, `anger vein`, `flying sweatdrops`, `wince`, `yandere`, `headache`,
`wide open mouth`), Hair (`clutching hair`, `hair pulling`), Arms (`outstretched arm`), Hands (`palms up`), fx
(`magic shield`, `slash`, `energy`), ambiguous (`holding spear`), unsorted (`attacking`, `blocking`,
`knees together`). **Left uncategorised on purpose:** `balls peek`, `penis lifting loincloth` (pose/sex only,
one image each).

`!designDocs/webui_engine/unsorted.md` was NOT used as the queue for this: the sorter ran on a temporary copy holding only these blocks,
and Noodle's pending entries were put back untouched.

**Flagged, not changed** (Syrup Town's own deliberate rules; they touch pose or body, not identity):

- `pain` → `ryona`, which boosts to `masochism, addicted to rape, broken rape victim`; `mind break` → `fucked silly`.
  Hits `vamp1V-defense` and both breakdowns. A defense pose should not carry these: **a step 7–9 decision.**
- `cute boy; femboy, girly` and `male focus; femboy […]` make Brienne and Nettle C femboys; `wide hips; thick thighs`
  gives Clemence thick thighs. If those are wrong for them, it is a per-character exception on the entry (step 3).
- `male only; 1boy, solo, femboy, male focus` consumes `male only`. Harmless here: every character carrying it is
  already a femboy.
- Framing and sex culls that are correct: `cowboy shot` removes boots; `bulge` removes `balls` and `penis outline`;
  `covered nipples` removes `erect nipples` (a real combination, but a pose-level detail).

Engine suite after the edits: 665 passed, 4 failed. **The same 4 fail with the edits removed**, so none are new.
## Decisions (round 2, full text in BRIEF)

| Question | Ruling |
|---|---|
| `-b` vs `-exposed` | Different images. **Most poses need a damaged version**; "damaged" is isolated per outfit |
| Layers | **Two** (character, outfit). C/V differences are fixed by improving the engine's gender swap |
| Engine differences | Compare compiled text; an unwanted difference is **an engine bug to fix** (e.g. `flaming skull` culled as a background) |
| Damage | In **the outfit's own replacement rules**, never a duplicate outfit |
| Individual exceptions | On the character's (or outfit's) charactersDB entry |
| ControlNet reference | **Always that character + gender's `-a`** |
| C (male) versions | Generated and kept with the `C` letter, **not injected** into the game for now |
| LoRAs | Not trained yet; later. Codenames are still made now |
| Review | The script lists, **the agent gives the first verdict** (vibes), Noodle reviews the verdicts |
| The hard part | Per-character pose interpretation: Nettle defends with a magic shield, the vampire with her arms |

**Open, not blocking:** `-support` wording (the fixed refs say casting), props (outfit or character layer),
the damaged action-pose filename. Proposal: `-offense-b`, `-defense-b`, `-support-b`, mirroring `-b` as the
damaged standing pose.

## Renaming Vex (done)

Noodle picked **Severine** over Tithe, Vesper, Odile, Marrow, Mircalla, Lenore and Corvina. Chosen for severity
against Clemence's clemency. Every candidate was checked against `aliasDB.js`.
## The refs

`refsPNG/characters/`: 35 PNG + txt pairs, `<char><outfit><C|V>-<pose>`. `refsPNG/enemies/`: 10, deferred.

| Char | Name | C poses | V poses |
|---|---|---|---|
| `knight` | Brienne | a, b | a, b, breakdown, defense, offense |
| `lancer` | Cinder | a, b | a, b |
| `necro` | Nettle | a, b | a, b, breakdown, defense, offense, support |
| `priest` | Clemence | a, exposed | a, exposed |
| `seer` | Cassadora | a, exposed | a, exposed |
| `vamp` | Severine | a, exposed | a, breakdown, defense, exposed, offense, support |

**Sidecar quirks a parser must still handle:** weights `(x)` / `((x))`, and emoticon tags (`:o`). The negative prompt
lines, LoRA calls, duplicates and the `energy(fantasy)` typo were removed in step 1; `refs-report.js --tidy` does it
again for a new character.

## Measured

- **Forge** is `http://192.168.0.2:7000` (`targetIP` / `targetPort` in `scripts/webui/webui.js`), checkpoint
  `ILL\ntrMIXIllustriousXL_xiii`.
- **ControlNet works over the API:** `/sdapi/v1/script-info` lists `controlnet` as always-on for txt2img and
  img2img with 3 units. `/controlnet/module_list` includes `reference_only`, `reference_adain` and
  `reference_adain+attn`. The unit's fields include `enabled, module, model, weight, image, resize_mode,
  guidance_start, guidance_end, pixel_perfect, control_mode`. **Not yet proven:** a real request with a base64
  `image`.
- **Engine probe** (`webui2-test.js` on `seer1V-exposed`): `flaming skull` culled by `simple background`
  (to fix: it is not a background element) and `nipples` added by defaultDB. (Skull's blindfold covers one eye,
  so her eye tags are correct.)
- **Name collisions in the engine:** `.cinder` (RWBY) already exists in `aliasDB.js`. (`.vex` was the reason for the rename.)

## Traps known before starting

- **A dictionary edit changes Syrup Town prompts too.** Run `node scripts/webui/tools/webui2-test.js` after
  any edit to `libraries/`.
- **Entry replacement targets are lowercased** (`collectEntryReplacements`, `webui2.js`), while rule
  requirements elsewhere are case-sensitive. Check this before choosing a Capitalized pose keyword.
- **The placeholder generator overwrites art that is still on its `.generated.txt` manifest.** Injection must
  remove each file from the manifest.
- **The game's art paths have no gender** and no `exposed` pose, and `broken.webp` is per character, not per
  outfit.
