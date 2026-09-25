# Refs cleaning, round 01 (step 1) — 2026-09-14

**Status: applied, waiting on Noodle's review.** Originals are in
`v13 spire images/_source/refsBackup/2026-09-14-before-cleaning/characters/`; restore any file by copying it back.
Rerun `node "!designDocs/honeycomb/art_pipeline/refs-report.js"` to see the matrix these decisions were read from.

## The brief for this step

> Remove any instances of negative prompts and takorin lora calls left over from earlier training steps. Then
> examine each .txt file to identify missing tags and extraneous outliners. This isn't as simple as "this tag is
> unique among this character's images" because while "green-trim dress" and "long sleeves" are correct on Nettle
> and missing from most images, "black hat" should not be part of cinder's outfit.

> Every difference between the sidecars should be:
> 1. A tag that should be present is missing from some images.
> 2. An outlier tag is present on some images.
> 3. Part of the difference between male and female.
> 4. Part of the aspects connected to that pose.
> 5. A combo of 3 and 4 at the same time.

> Sorry, but I can see you're on the wrong track by just a bit. Yes Cinder's image is off model, I meant for my
> instructions to specify you're looking at the sidecars, not the images. Yes lots of details got whiffed up in
> actual generation, and I retagged the images to better serve as training data, but the idea here is to figure
> out what the *goal* was.

**Judged on the sidecars only, toward the intended design.** The PNGs are not evidence of the goal.

## Rules applied

- **Within one pose, C vs V may differ only by sex.** Where one sex's version of a pose carried an expression or
  gesture the other lacked, and the tag has nothing to do with sex, it was added to the other (category 1 at pose
  level).
- **Identity and outfit tags go in every image**, unless the pose hides them (a `cowboy shot` has no shoes and no
  `full body`; a breakdown's hands are on the head, so no weapon).
- **Across the cast:** `(fantasy)` is the world tag, at weight 1, on everyone. A femboy's C images carry
  `1boy, femboy, male only, male focus`; a cute boy's carry `1boy, cute boy, male focus`. Every V image carries
  `female focus`. A male bulge in unexposed poses is a cast-wide sex difference, with no female counterpart.

## Mechanical tidy (`refs-report.js --tidy --write`)

| File | Change |
|---|---|
| `knight1V-defense`, `necro1V-defense`, `necro1V-offense` | `Negative prompt:` line removed |
| `necro1V-breakdown`, `vamp1V-breakdown` | `<lora:takorin - nanman:0.5>` removed |
| `necro1V-breakdown` | duplicate `glowing eyes`, `pussy juice` removed; the group `(glowing eyes, shaded face)` written as two weighted tags |
| `necro1V-defense` | duplicate `no panties` removed |
| `vamp1V-offense`, `vamp1V-support` | duplicate `glowing eyes` removed |
| `vamp1V-offense` | `energy(fantasy)` → `energy, (fantasy)` (missing comma) |

## Corrections (categories 1 and 2)

| Character | File(s) | Change | Cat | Why |
|---|---|---|---|---|
| all | knight ×7, priest ×4 | + `(fantasy)` | 1 | The world tag every other character carries |
| Brienne | `1C-a`, `1C-b`, `1V-b`, `1V-breakdown` | + `asymmetrical legwear` | 1 | `single pantsleg` is in every image; legwear was only on 3 of 7 (breakdown's cowboy shot still shows the legs) |
| Brienne | `1C-a`, `1V-a` | `weapon planted` → `planted sword` | 2 | Two spellings of one thing; `-b` already said `planted sword` |
| Brienne | `1C-b` | + `crotch tear` | 1 | Her damage exposes the crotch in both sexes; only V said so |
| Brienne | `1C-b` | + `wince`; `looking at viewer` → `looking to the side` | 1 (pose) | Matches V's `-b`. **Vibe call**: looking away reads as embarrassed |
| Brienne | `1V-b` | + `covering crotch` | 1 (pose) | C's `-b` has the gesture tag beside `hand over …` |
| Brienne | `1V-defense` | − `cameltoe` | 2 | On 1 of 5 V images; no V image elsewhere in the cast carries a crotch detail |
| Brienne | `1V-offense` | `action shot` → `action pose` | 2 | Every other action image says `action pose` |
| Cinder | `1C-a` | `black hat` → `red hat` | 2 | Noodle's example |
| Cinder | `1C-a` | + `flaming spear` | 1 | In the other three |
| Cinder | `1C-b` | `fantasy` → `(fantasy)` | 2 | Weight matches the rest |
| Cinder | `1C-b` | `torn hat` → `(torn hat)` | 2 | Weight matches V's `-b`; the emphasis looked deliberate |
| Cinder | `1V-b` | + `obscured eyes` | 1 | Identity; in the other three |
| Cinder | `1V-b` | − `exposed` | 2 | **Judgement call.** No other `-b` in the cast has it; it is the `-exposed` pose's own tag, so leaving it blurs the two slots Noodle wants kept apart |
| Nettle | `1C-a`, `1C-b`, `1V-b` | + `green-trim dress` | 1 | Noodle's example |
| Nettle | all but `1V-breakdown` | + `long sleeves` | 1 | Noodle's example |
| Nettle | `1C-a`, `1C-b` | − `huge ass` | 2 | **Judgement call.** C only, and no other male version adds body size over the female's (`wide hips, thick thighs` are shared) |
| Nettle | all 8 | `(fantasy)` weight on every file | 2 | Was weighted on C, plain on V |
| Nettle | `1V-b` | + `sweat` | 1 (pose) | C's `-b` has it |
| Nettle | `1V-breakdown` | − `stepping on head` | 2 | Contradicts `knees together, legs together, bent over`; the signature stance belongs to the standing poses |
| Clemence | `1V-a`, `1V-exposed` | + `female focus` | 1 | Every other V in the cast |
| Clemence | `1V-exposed` | + `exposed` | 1 (pose) | C's `-exposed` has it |
| Clemence | `1C-exposed` | `wide hips` → `(wide hips)` | 3 | **Judgement call.** Weighted on `1C-a` only. Read as the emphasis a male body needs to get the design's hips, so both C images carry it and V stays plain |
| Cassadora | `1C-exposed` | + `glowing eyes`, `extra belts` | 1 | In the other three |
| Cassadora | `1V-exposed` | + `wide-eyed` | 1 (pose) | C's `-exposed` has it. The blindfold covers one eye, so no contradiction |
| Severine | `1C-a` | + `long gloves` | 1 | In the other seven |
| Severine | `1C-a`, `1C-exposed`, `1V-exposed` | `(vampire)` → `((vampire))` | 2 | Weight matches the other five |
| Severine | `1C-a`, `1C-exposed` | + `male focus`, `male only` | 1 | Femboy rule above; she was the only femboy without them |
| Severine | `1C-exposed` | − `glistening`, `shiny skin` | 2 | `(glistening, greasy)` sat in the negative prompt these images were made with, so shine was never the goal |
| Severine | `1V-exposed` | + `torn hat`, `full-face blush` | 1 (pose) | C's `-exposed` has both |

## What remains different, and why it stays (categories 3–5)

| Character | Sex (3) | Pose (4) | Sex and pose (5) |
|---|---|---|---|
| Brienne | C `cute boy, flat chest`; V `toned, tall, medium breasts` | `-b`: torn bodysuit, nipple slip, one eye closed, sweat, blush, embarrassed · breakdown: cowboy shot (no shoes, no full body), pink glowing eyes, crazy, hypnosis, hands to head, no sword · defense: blocking, clenched teeth, angry brows · offense: attacking · gaze varies by pose | C `small bulge` (a); C `-b` penis exposed, erection, hand over penis; V `-b` no panties, covered/erect nipples, arm under breasts |
| Cinder | C `femboy, male only` | `-a`: shadowed face, grin · `-b`: hair over eyes, hand over face, wavy mouth, torn hat/blouse/tights/shorts, sweat, blush | C `small bulge` (a), `erection under clothes` (b); V `underboob` (b) |
| Nettle | C `cute boy`; V `cute girl` | knee up + stepping on head in the standing poses · `-b` anger · breakdown: cowboy shot, glowing green eyes, blushing, clutching hair · defense: magic shield, wind blow · offense: standing on one leg · support: spellcasting, wide stance | C penis outline, bulge, balls peek (a), penis lifting loincloth, tenting (b); V covering crotch, pussy juice (b), squirting through clothes, areola slip (breakdown), upskirt, pussy peek (defense) |
| Clemence | C `femboy, male only, flat chest, (wide hips)` | `-a`: hands up, palms up · `-exposed`: battle damage, torn dress, gold pasties, hands on own chest, exhibitionism | C `small bulge`; V `breasts out` (exposed) |
| Cassadora | C `femboy, male only, flat chest` | `-a`: hand up, hand on hip, wide stance · `-exposed`: spiral eyes, wide-eyed, covering chest and crotch, knee up, standing on one leg | C penis outline, tenting (a), penis/balls exposed (exposed); V `nipple slip` (exposed) |
| Severine | C `femboy, male only, flat chest` | `-a`: smile, licking lips, outstretched arm · breakdown: cowboy shot, pink eyes, laughing, mind break · defense: blocking, arms crossed, pain · offense: slash, energy · support: arm up, arm outstretched · actions: no `standing` | C `large bulge` (a), penis exposed, precum (exposed), `pink nipples`; V `breasts out, nipples, pussy exposed` (exposed), areola slip, pussy juice stain (breakdown) |

## Addendum (step 2a, same day)

| Character | File(s) | Change | Cat | Why |
|---|---|---|---|---|
| Cinder | `1C-a`, `1C-b` | + `flat chest` | 1 (sex) | Every other male version carries it, and the engine was supplying it. Missed in the pass above |

Since then, tags the webui engine altered or added to are written in single quotes (Rule 2c); see CATCH-UP,
"Protected tags". The quotes are engine syntax, not a caption change: training sorting should strip them.

## Worth Noodle's eye

- **The four judgement calls** marked above: Cinder `-b` losing `exposed`, Nettle C losing `huge ass`, Clemence C's
  weighted hips, and Brienne C `-b` looking away.
- **The PNGs no longer match every sidecar** (e.g. `lancer1C-a` still shows a black hat). Retrain on a
  regenerated or repainted image, not the old one with the corrected caption.
- `necromancer` is on both Nettle and Cassadora. It describes both looks, but it may pull them toward each other;
  worth watching in step 3.
