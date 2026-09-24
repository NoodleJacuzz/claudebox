# The art restructure — 2026-09-21

Noodle asked for four things to be sorted out together, because they have all been worked around with
shortcuts and the shortcuts have started causing real faults. This holds what was decided, what has been
built, and what is still open. His own words are quoted where they settle something, so nothing here has
to be reconstructed from a summary.

The four are: the folder structure for originals, the height every pose is written at, how an enemy's
size in the game is controlled, and how finished art is told apart from work in progress.

---

## 1. `v13 spire png/` holds the originals and nothing deletes them

**Decided and done.**

Until this session `png-to-webp.py` treated that folder as a staging tray. It converted each `.png` to a
`.webp` and then deleted the `.png`. The desk writes its Forge output straight into that folder, so
generating a picture and then converting it destroyed the only copy.

> This must change, and how the desk stores outgoing png files changed, immediately, I am extremely
> thankful I accidentally copied Nettle's venom images. Had I decided to ask you to generate and export
> images today instead of doing this, I would have lost days of work.

What the tool does now:

| Behaviour | What it means when you run it |
|---|---|
| The `.png` is never deleted | There is no flag that brings the old behaviour back. The `.png` stays at its path forever. |
| A `.webp` newer than its `.png` is skipped | Running it again converts only what you have changed. `--force` re-encodes everything. |
| A path with a `_folder` in it is refused | `enemies/_workbench/headGardener.png` is a bench, not a game path. Converting it would have written 23 junk files into the live folder. |
| The dry run says what it would do | It is still the default. `--apply` writes. |

`../tools/desk/server.js` now copies an existing `.png` into its backups folder before a generation overwrites
it. `storeUpload` always did that; the generate path never did.

**What is left.** 308 pictures in the game have no original in the archive. They are counted by
`archive-census.py`, which is described in section 5.

---

## 2. Every pose a fighter swaps between is written 1216 pixels tall

**Decided and wired in. Nothing has been converted yet.**

> chess1V's images were designed such that combat, support, and offense were all designed with the same
> image height in mind. If all of them were 1216, or if all of them were 1408, they would all be
> perfectly sized. -basic is not a combat pose, it is character art for the teambuilding scene and
> portraits.

> All of my future combat, support, and offense poses will be posed proportional to eachother, widening
> the frame if needed, then matching to forge's aspect ratio.

The number is 1216, and the reason is his:

> because if it's 1408 then we'd have some images needing to be scaled up instead of almost always
> scaling down

That reasoning is right, and it is the only thing that separates the two numbers. Scaling a picture
keeps the figure's share of its frame, and the game sizes a sprite by its frame, so a set scaled to 1216
and the same set scaled to 1408 look identical. What differs is quality: every source on this disk is
1216 tall or taller, so 1216 only ever scales down. 1408 would have enlarged every 832x1216 drawing.

`png-to-webp.py` now scales any sprite pose to exactly 1216 tall, keeping its own width. Nothing is
cropped, padded or moved. Checked against Anastasia's real sources:

| Source | As drawn | Written | The figure inside it |
|---|---|---|---|
| `chess1V-combat-a.png` | 832x1216 | 832x1216 | 1201px, 98.8% of the frame |
| `chess1V-support-a.png` | 704x1408 | 608x1216 | 1090px, 89.6% of the frame |
| `chess1V-offense-a.png` | 832x1216 | 832x1216 | 1183px, 97.3% of the frame |
| `chess1V-basic-a.png` | 704x1408 | 608x1216 | 1208px, 99.3% of the frame |

Every frame comes out 1216 tall, and her support figure comes out 9.2% shorter than her combat figure,
which is the crouch she was drawn with.

**What the standard does not do, said plainly.** It does not change how anything in the game looks
today. Scaling a finished picture to a different height keeps the figure's share of its frame, and the
engine already sizes every sprite by frame height, so the four folders listed below render correctly at
this moment. The standard is worth having for two other reasons: it means a pose you compose against
another pose survives conversion with the proportions you drew, and it removes a whole class of silent
fault where an export accident cannot be told apart from a drawing decision.

**A picture shorter than 1216 is left alone and reported**, because enlarging a drawing to satisfy a
rule costs quality the rule was not worth. Two enemies are deliberately below it and are listed as
exceptions in the tool: the Juggernaut is the one square source at 1024x1024, and the Matriarch is drawn
landscape at 1152x896 and anchored, so height alone already sizes her. Both are documented in
`../reference/ART-GUIDE.md` §2.

**Portraits, cut-ins and scene pictures are not poses.** `0-portrait` is a face at its own size,
`broken` and `recover` are cut-ins framed by their own boxes, and everything under `lust/` or `events/`
is a scene. None of them ever stands beside another of them in one frame, so the standard does not touch
them.

**Which folders disagree with themselves today.** Run
`node "!designDocs/honeycomb/tools/generate-sprite-metrics.js"` and read the last section. On
2026-09-21 it was four:

```
characters/chess/default            832x1216 and 650x1300
characters/necro/default            650x1300, 832x1216, 704x1408, 889x1300
characters/vamp/default             650x1300, 1300x2600, 704x1408
enemies/gauntletAnastasia/default   832x1216 and 650x1300
```

Anastasia's split has a traceable cause. `generate-placeholder-art.py` caps sprite height at 1300, so
her 704x1408 source was shrunk to 650x1300 and her 832x1216 source was left untouched. Neither number
was chosen by anyone.

---

## 3. An enemy's size in the game

**Nothing decided yet. Here is what is actually true, which is different from what was assumed.**

Noodle asked whether enemy size could live in the webp itself, because resizing images to control size
seemed to be causing the size pop. Both halves of that turned out to need correcting.

**Resizing an enemy's file does not change its size in the game.** The engine reads the aspect ratio
only. Exporting a puffcap at 600x900 instead of 832x1216 changes the ratio from 0.684 to 0.667, which is
inside the tolerance, so the engine leaves it alone and the puffcap renders exactly as before. What does
control size is the share of the frame the figure fills, plus `presentation: { scale }` on the enemy's
definition, which is a CSS transform anchored at the feet.

**So "size in the webp" already exists**, and it is the rule ART-GUIDE §2 already states: draw the enemy
at its intended size on the shared frame, with empty space above a small one. The standard height in
section 2 makes that workable, because once every frame is 1216 tall the share of the frame is the only
thing left that can vary.

**The size pop had nothing to do with any of this.** It is traced and fixed; the measurements are in
section 4.

**Open question for Noodle.** Whether to keep `presentation.scale` as well, or fold every enemy's size
into how it is drawn. Keeping both means two places to look when an enemy is the wrong size. Folding it
into the art means a size change needs a redraw rather than a number. The recommendation is to keep
`presentation.scale` for bosses that need to loom and stop using it for ordinary enemies, but that is a
call for him.

---

## 4. The size pop, traced

**Fixed.** Recorded here because two plausible theories were wrong and the measurements are what settled
it.

| What was suspected | What the measurement showed |
|---|---|
| A pose swap draws one frame at the previous pose's size | No. Setting `src` does not clear the picture, so the stale correction belongs to the drawing still on screen and the two change together in one step. Writing the new correction early is what breaks it: it put a visible 27% dip in for the whole load. |
| A repaint draws a fighter before its correction is applied | No. The browser fires `load` before it paints the new picture, so no wrong frame reached the screen. |
| A summon re-lays the whole row | Yes. This is the real one. |

The summon, measured with a cold cache and two ordinary enemies standing:

```
before the summon          278x406
while the picture loads    265x387     held for the whole fetch
settled                    173x252
```

A newcomer whose picture has not arrived has no size, `.hcFighter` is `flex: 0 1 auto`, so the row is
laid out around it twice.

> I saw enemies pop in a similar manner to the players when the head Gardener used Plant for the first
> time in combat.

Plant summons two Puffcaps. It happens the first time only, because afterwards the picture is in the
browser's cache.

**The fix** is `honeycomb.art.summonWarmPaths`, which reads the moves of the enemies actually on the
board and asks for the pictures of everything they can summon when the fight opens. For the Gardener it
finds `puffcap`, `gardener` and `sporeling`. It reads the cards rather than a written list, so a new
summon is covered without anyone coming back to update it.

**Do not try to fix it with `width` and `height` attributes on the sprite.** That was tried and it fails
twice over. Those attributes are presentational hints that map to the CSS width and height properties,
so `height="1300"` set a literal 1300px box wherever the stylesheet had not declared a height, which
measured out at five times the intended size. Declaring `height: auto` stops that and removes the
reservation with it, because an aspect ratio alone gives no width to an element whose width is `auto`.
Both dead ends are written into `honeycomb.art.applyCanvas` and into `.hcFighterArt` in `honeycomb.css`.

---

## 5. Telling finished art from work in progress

**There is no marker, and one must not be invented.** A previous suggestion was to treat "has a used
alpha channel" as meaning "has been through the cutout pass". Noodle:

> No, we do not have any marker for completed images, this is just a fact. Images can be complete that
> do not have any alpha. Images can have transparency even when I am actively needing to edit them. I
> always keep backups pre-background-removal and oftentimes I need to manually removed missed areas.

Two related corrections, both his:

- `_source/refsPNG/characters` is not a folder of unfinished work. Nearly every image in it is complete
  or near complete with the background not yet removed, and it holds C variants the game never uses.
- `characters/chess/default` is half generator output. His drawings are the tier-1 poses; the tier-2
  ones and `1-damaged` are generated. The generator's own note in `CHARACTER_OUTFITS` says the same
  thing.

**So sorting `_source/` into the archive cannot be automated on a file property.** What can be automated
is the opposite direction: saying which game pictures have no original, and what on disk looks like each
one. That is `archive-census.py`.

It compares pictures rather than filenames. Matching on names was tried first and was useless, because
"knight" matches `butterflyknight-a.png` and three hundred others. Instead every loose `.png` under
`_source/` and the archive is reduced to a 16x16 grey thumbnail, the game picture is reduced the same
way, and they are ranked by how well the two correlate. That survives the usual difference between an
original and the picture made from it, where the original still has its painted background and the game
copy has been cut out.

A score at or above 0.95 means the two are almost certainly the same picture. Between 0.80 and 0.95 they
are worth opening side by side. Below that, nothing on this disk looks like it and the original is gone.

The first run:

```
679 pictures in the game
  1 has its original in the archive
370 are generated placeholders, rebuildable, so no original is owed
308 have NO original in the archive
```

Those 308 break down as 129 cards, 65 icons, 38 enemies, 33 characters, 21 UI, 17 map, and 6 elsewhere.

### What it found for the enemies and characters

Much better news than the count suggests. Almost nothing is actually lost; most of it is sitting in the
wrong folder.

**Enemies: 34 of the 38 match at 1.000**, which means the file on disk is the same picture.

| Where the original turned out to be | How many |
|---|---|
| `D:\honeycomb spare art6-09-2413 spire png\enemies\_workbench/_cutout/` | 23 |
| `v13 spire images/_source/chess/` (the celestial and infernal pieces) | 9 |
| `v13 spire images/_source/refsPNG/enemies/` | 2 |

The four that did not match are all files that were *made* from something else rather than drawn:
Anastasia's cropped portrait, her two generated damage poses, and the Matriarch's generated backdrop.

**Characters: 13 of the 33 match**, in `_source/refsPNG/characters`, `_source/characters` and
`_source/chess`. Of the twenty that did not, six are `brokenBG` and `recoverBG` files, which are
generated 1920x1080 washes rather than drawings.

**That leaves fourteen genuine losses, and they are all in one folder:**
`characters/necro/lust/v1-1` through `v3win-4`. Nettle's venom scene pictures. Their best score against
anything on this disk is 0.35 to 0.65, which means nothing here resembles them. These are the exact
pictures Noodle said he had copied by accident, so the copies he has are the only originals that exist.
**Putting those back into `v13 spire png/characters/necro/lust/` is the single most valuable thing in
this whole restructure**, and nobody but him can do it.

### Moving an original into the archive

For everything that matched, the work is to copy the `.png` to its game path under `v13 spire png/`.
Nothing needs converting, because the `.webp` the game already loads was made from that same picture.
Doing it fills the archive without touching a single file the game reads.

**The tool never writes anything and must never gain an `--apply`.** Deciding that a particular loose
file is the original of a particular game picture is a judgement, and a wrong guess copies the wrong art
over a good path. A score of 1.000 makes the judgement easy; it does not make it automatic.

---

## The rules, so this section can be read on its own

1. **`v13 spire png/<path>.png` is the original of `v13 spire images/<path>.webp`.** Same relative path,
   different extension. The path in the archive IS the path in the game.
2. **Nothing ever deletes a `.png`.** There is no flag for it and there must not be one.
3. **The archive holds real source files only** — character art, enemy art, card art, icons, UI, map.
   Not the test batches in `_source/refsTests/`, not `enemy inspo` or its variants, and not a placeholder
   made by copying and filtering another picture.
4. **A picture the generator builds from another picture gets no original.** Giving one to
   `characters/knight/recover.webp` would put the untinted standing art under that name and destroy the
   cut-in the next time anything converted it.
5. **A sprite pose is written 1216 pixels tall.** `png-to-webp.py` does this; nothing else needs to.
6. **After any art lands, rerun the metrics table**, or the game keeps the old canvas sizes:
   `node "!designDocs/honeycomb/tools/generate-sprite-metrics.js"`

---

## The to-do list

Ordered. Each item says who can do it and what must not happen.

**Where it stands (2026-09-22).** Steps 1 and 2 are done. Step 3 is ready and waits on Noodle's yes to the
copy list. The 2026-09-22 section below the to-do list holds his answers to the four open questions and
what else was done that day.

### 1. Put Nettle's fourteen venom originals back — Noodle only — ☑ DONE 2026-09-22

> Moved nettle's images back. I was quite panicked, but it turns out I'd accidentally dropped them in
> another folder.

All fourteen are at `v13 spire png/characters/necro/lust/`. The dry run reported every `.webp` as newer
than its `.png`, so nothing needed converting, and the census now counts them as kept.

`characters/necro/lust/v1-1` through `v3win-4`. Nothing on this disk resembles them; his accidental copy
is the only original that exists. They go to `v13 spire png/characters/necro/lust/` as `.png`.

Afterwards, run the converter as a **dry run first** and read the `OVERWRITING` list before deciding:

```bash
python "!designDocs/honeycomb/tools/png-to-webp.py" --only characters/necro/lust
```

The pictures in the game came from those same originals, so re-converting should change nothing worth
seeing. If the report shows a large size change, stop and compare before applying.

### 2. Work out which of the remaining orphans are drawings and which are generator output — any agent — ☑ DONE 2026-09-22

**What was done.** `archive-census.py` now reads the generator's recipe tables straight out of
`generate-placeholder-art.py` with Python's `ast` module, so the generator's code is never run and a recipe
added there is counted here without a second list. The tables it reads are named in
`GENERATOR_STEM_TABLES`. Every downsized card frame (`-small`, `-medium`, `-large`) counts as built too.

| | Before | After |
|---|---|---|
| Built by the generator, no original owed | 391 | 492 |
| No original in the archive | 273 | 171 |
| FOUND (one original on disk nothing else claims) | 113 | 114 |
| SHARED | 10 | 8 |
| GONE | 150 | 49 |

**The 49 GONE are not generator output.** They are pictures Noodle made or supplied, which the old
feedback rounds quote him making, and whose originals were never put in the repo. None of them is lost
from the game. The question for him is whether he keeps the originals somewhere else:

- `ui/broken/` (9): the Broken and Recover cut-in pieces (BROKEN-01 quotes his instructions for them). The
  two `...MaskInner` files are built from his masks and are no longer on the list.
- `ui/hand/` (5): the hand shelf. `ui/` (4): `buttonBack`, `buttonFrontBlue`, `buttonFrontGold`, `shop`.
- `vfx/` (3): the `test-additive`, `test-green` and `test-magenta` layers.
- `shops/backdrop-default` (*"I made the shops/backdrop-default.webp image for the shop"*, FEEDBACK-04).
- `backgrounds/placeholder`, and `cards/frames/placeholderVertical` and `placeholderHorizontal`, the two
  frames he supplied at the start of the project.
- `icons/` (21). Eleven of them have a file with the SAME NAME in `_source/icons/` that scores below
  0.95 against the game copy (flame-blue 0.79, gem-red 0.87): bow, drop-green, flame-blue, gem-blue,
  gem-red, key, lightning, potion-blue, potion-red, snowflake, sparkles-pink. They were probably edited
  after being taken from there, so the `_source` file is a pre-edit version and not the original. Ten
  have nothing on disk: attack, and the nine class icons knight, knight-bloodied, knight-warden, necro,
  necro-grovekeeper, necro-plaguebearer, vamp, vamp-corsair and vamp-nightcourt.
- `enemies/gauntletAnastasia/` (3): her portrait crop and two damaged poses, all generated. See the
  folder note in the 2026-09-22 section: this whole folder is a copy of `characters/chess/default`.

The notes below are kept as they were written.

**This has to happen before anything is copied, and the orphan count is an upper bound rather than a
count of losses.** `.generated.txt` marks the folders the generator owns, but it does not mark
everything the generator writes. One case has already been corrected in `archive-census.py`:
`broken`, `recover`, `brokenBG` and `recoverBG` are built by `build_broken_portraits` and
`build_recover_portraits` from a character's standing art, so they are now classified as built. That one
correction moved 104 files out of the orphan list.

Where it stands after that correction. FOUND means one original on disk that no other picture claims;
SHARED means another picture picked the same source, so this one is probably made from it; GONE means
nothing on disk resembles it.

| Area | Orphans | FOUND | SHARED | GONE |
|---|---|---|---|---|
| cards | 129 | 46 | 0 | 83 |
| icons | 65 | 42 | 2 | 21 |
| enemies | 35 | 24 | 8 | 3 |
| ui | 21 | 0 | 0 | 21 |
| map | 17 | 0 | 0 | 17 |
| characters | 15 | 1 | 0 | 14 |
| vfx, backgrounds, shops | 5 | 0 | 0 | 5 |
| **total** | **287** | **113** | **10** | **164** |

**Read the GONE column as "not classified yet", not as "lost".** `ui`, `map` and `vfx` are almost
certainly all generator output — the generator has `--only ui`, `--only maps` and `--only frames`
sections that write them — and 83 GONE cards is far too many to be real. The one row that is genuinely
lost is the 14 in characters, which is step 1.

So: read what `generate-placeholder-art.py` writes for cards, icons, ui, map and vfx, and add whatever
it builds to `DERIVED_LEAF` or to the `.generated.txt` folders. Expect the total to fall a long way.

The 8 SHARED enemies are the infernal chess pieces, which are recolours of the celestial ones and share
their source. They need no original of their own.

Note while doing this: Noodle regenerated 32 files under `cards/chrome/` on 2026-09-21 as smaller assets
for performance. Those downscales must survive. The converter already skips a `.webp` newer than its
`.png`, so they are safe unless somebody runs `--force`.

### 3. Copy the found originals into the archive — any agent, after step 2

```bash
python "!designDocs/honeycomb/tools/archive-census.py" --plan
python "!designDocs/honeycomb/tools/archive-census.py" --area enemies --plan
```

Every line is one copy, from where the picture actually is to its game path under `v13 spire png/`.
**Copy, do not move** — the file stays where it is as well, because `_source` is also somebody's working
folder. Nothing is converted and nothing the game reads is touched, so this step cannot break the game.

The enemies are the easy 24 and they are all one folder. The plan reads:

```
copy "D:\honeycomb spare art6-09-2413 spire png\enemies\_workbench/_cutout/wellspring.png"
  to "v13 spire png/enemies/wellspring/default/1-combat.png"
```

They are already inside the archive; they are just not at their game paths yet.

### 4. Judge the SHARED rows by hand — any agent

A row marked SHARED means another game picture picked the same source as its best match, so at most one
of them is that picture and the rest are made from it. They are left out of `--plan` on purpose. Usually
the answer is that none of them needs an original, which means the real fix is step 2 rather than a copy.

### 5. Decide what happens to the two benches — Noodle

- `D:\honeycomb spare art6-09-2413 spire png\enemies\_workbench/` holds 23 pictures with their backgrounds still on, beside
  `_cutout/` holding the same 23 cut out. Noodle keeps pre-removal backups on purpose, so the question is
  only where a backup lives once the cut-out version has moved to its game path.
- `v13 spire images/_source/` holds 19MB of `enemy inspo`, 17MB of `enemy inspo discarded`, 93MB of
  `enemy inspo variants` and 27MB of `_archive-enemy-poses`. None of it belongs in the archive by rule 3.
  It only needs a decision about whether it stays where it is.

The conversion step refuses any path with a `_folder` in it, so both benches are harmless where they
sit. This is tidiness, not risk.

### 6. Record what is genuinely gone — any agent

After step 2, run the census again and keep the GONE list somewhere it will be read. Those are pictures
the game draws that nothing on this disk can rebuild. Today the only confirmed ones are the fourteen in
step 1; the rest of the GONE rows are still mixed in with generator output.

### 7. Finish the pose sprites — Noodle draws, an agent converts

36 of 132 slots exist. Every new one goes in at its game path as a `.png` and is converted with
`png-to-webp.py`, which writes it 1216 tall. No pass has to be redone later, because the conversion is
already correct.

Rerun `generate-sprite-metrics.js` afterwards and read its last section: it names any folder whose poses
disagree, which is the fault this whole standard exists to prevent.

### 8. Give the 23 drawn enemies their attack pose — Noodle draws

arborSisterDay, arborSisterNight, argentFencer, bogToad, cordycepsHusk, fruitAlraune, glowMoth,
headGardener, lanternJelly, longwing, mantlewing, mireEel, moldshaper, paleDray, puffcap, sableFencer,
siltCrawler, soakcap, tallyman, thornFencer, thornSprite, trumpetBell, wellspring.

Each has `1-combat` and no `1-offense`, so its attack falls back to its standing pose.

### 9. Optional, and last. Re-derive the four disagreeing folders

`characters/chess/default`, `characters/necro/default`, `characters/vamp/default` and
`enemies/gauntletAnastasia/default`. This is hygiene, not a repair — see the note in section 2, they
render correctly today.

**Do not do it by re-encoding the existing `.webp` files.** That costs quality for a change nobody can
see. Do it from the originals once those are in the archive, or leave it.

---

## 2026-09-22 — Noodle's answers, and what was done

### His answers to the open questions, verbatim

On the two benches (to-do step 5):

> Good question. I'll move them manually to a backup on another computer.

On `presentation.scale`:

> Another good question. If it's not breaking anything I don't see why we can't keep it.

On `celestialQueen/default/2-offense.webp`:

> 2-offense is not real art, it was generator output. Actually, won't your job be extremely difficult
> because of how you applied filters like red splotches over a bunch of generated images?

On the stale `artOwed` flags, and the rule for the whole restructure:

> Sure. Don't forget a big step of this is de-complicating the folder structures, that's something I won't
> budge on. It makes no sense how arborSisterDay's 1-offense picture seems to be stored somewhere else.

On the four folders whose poses disagree (to-do step 9):

> This is part of finishing the poses, since I'll have a full set of every character in all the poses we
> need, we'll just reconvert them at the end appropriately sized.

### What was done

- **The Queen's `2-offense`** was moved (not deleted) to `_source/_archive-enemy-poses/celestialQueen/default/`,
  and suite block [126]'s `undecidedArray` is empty. **The answer to the filter question:** the census does
  not have to recognise a filtered picture by eye, because the generator's code says what it builds and
  from what. The red-splotch damaged poses sit in folders the generator owns. A filtered copy that slips
  through anyway picks the same source as the picture it was made from, and shows up as SHARED.
- **`artOwed` cleared from 23 enemies**, not 22, along with the "no drawing yet" comment above each. The
  three recolours keep it. New suite block [132] fails if an enemy standing on a real drawing says its art
  is owed. Run against the file from before the edit, it named exactly those 23. `FEEDBACK.md` B40 is
  closed.
- **Step 2 of the to-do list**, above.
- **`png-to-webp.py` now keeps the size the game already uses.** Without this, step 3 would have set a
  trap. 93 of the 114 originals are bigger than the game's copy: the icons are 1024 square against 256,
  the card chrome 1176x1500 against the 768x980 Noodle cut it to, and the enemies 1792x2304 against
  1011x1300. The converter only resized sprite poses, so the first conversion after an original landed
  would have put the big picture back in the game. Now a picture that is not a sprite pose and already
  has a smaller game copy of the same shape is written at the game copy's size. Sprite poses still follow
  the 1216 rule.
- **Two conversions were already waiting before today** and were left alone: `map/event-well` (a 1MB
  picture replacing a 2KB placeholder) and a new `characters/knight/events/pool`. They look like desk
  generations nobody has converted yet.

### Step 3 — ☑ DONE 2026-09-22

Noodle approved A and C (*"A and C are fine."*). The 99 copies below were made by a one-off script: each
is byte-identical to its source, and each is dated one second older than its game `.webp`. Afterwards the
converter's dry run listed only the two desk files that were waiting before today, so none of the 99
would be re-encoded. The census moved from 15 originals in the archive to 114, and from 171 pictures
without one to 72.

Noodle on B, the move out of `_source/`:

> Only the ones that are the actual sources of images, not any others. There's a ton of test files in the
> _sources folder and this is a good opportunity to separate the in-use from the unused.

And a rule for the `-b` poses:

> Currently, basic-b is unused, but I would still like to keep them around in the game's files just in
> case, I have a few planned uses for them in the future.

So no tidy step may remove a `basic-b` (the `2-basic` tier in the game folders) for being unused.

### Step 3's copy list, as it was proposed

100 rows score exactly 1.000: 46 card chrome, 29 icons, 24 enemies and Anastasia's `broken`. One of the
24 enemies is `gauntletAnastasia/default/exposed`, which is left out because that whole folder is a copy
(see the next section), so **99 copies**. None of the target paths exists yet. The list is produced by
`archive-census.py --plan`.

Fourteen icons score 0.960 to 0.999 against a `_source/icons/` file with the same name. Those come to
Noodle instead of being copied: arm-flexing, book-dark, book-skull-purple, boot-winged, dagger, fire,
leaf-green, scroll, shield-broken-red, shield-leaf-green, shield-lightning-purple, shield-plain,
shield-round-red, shield-sword-red.

Every copy keeps a date just older than its game `.webp`. The game picture was made from this file, so
the converter should treat it as up to date and not re-encode it. Seventeen icon sources were saved into
`_source/` about 25 minutes after their game copy on 2026-09-11. Copying their dates as they are would
have made the converter redo them.

### Where the folder structure stores one thing in two places

Found while doing the above. Each one is the same kind of problem as arborSisterDay, and each has a
proposal.

**A. Enemy originals sit in a flat bench.** `arborSisterDay` is in four places: her game picture, her
original in `D:\honeycomb spare art6-09-2413 spire png\enemies\_workbench/_cutout/arborSisterDay.png`, her backup with the background
still on in `_workbench/arborSisterDay.png`, and her old `1-basic` in
`v13 spire images/_source/_archive-enemy-poses/`. She has no `1-offense` anywhere; when she attacks, the
game shows her `1-combat` again. Step 3 puts the original at her game path, and Noodle is moving the
bench to another computer.

**B. 1.4GB of working material lives inside the game's image folder.** `v13 spire images/_source/` holds
character references, the chess drawings, card sources, icons, the enemy inspiration folders, the test
batches and the archived enemy poses. The game never reads it; only comments mention it. About twenty
tools do read it: the generator, the census, the converter, `enemy-art-tidy.js`, the refs tools in
`art_pipeline/`, and the card chrome scripts in `card_redesign/`. Proposal: move it out of the game's
folder to a folder of its own beside the other two, and change each tool's path constant.

**B, what `_source/` still feeds (measured 2026-09-22, for the move).** The GAME reads nothing in it. These
tools do, so each folder listed here moves with its tools' path updated, or stays:

| Folder | Read by | Why it matters |
|---|---|---|
| `enemies/` (11 cut-out `.webp`) | `generate-placeholder-art.py` | the only cut-outs of the eleven older enemies, and the source of every recoloured stand-in |
| `characters/` (6) | `generate-placeholder-art.py` | the old card art in `cards/art/` and the per-character legacy cut-in stand-ins |
| `chess/` | `generate-placeholder-art.py` | the Celestial and Infernal fallback if a drawing were removed; its drawings are already archived |
| `refsPNG/` | the refs tools, `pose-templates.js`, `card-prompts-generate.js`, the generator's art-owed sidecars | the reference pictures and the shared negative prompt |
| `cards/`, `cardsGrok/` | `card_redesign/overlays/` chrome scripts | the card chrome sources; the finished chrome is archived |
| `refsTests/` (1.1 GB, 3447 files) | written by `refs-generate.js`, `outfits-generate.js`, `card-prompts-generate.js`, `chess-generate.js` | test output only; nothing reads it except `regenerate-from-sidecar.js` when pointed at it |
| `_archive-enemy-poses/`, `_archive-character-poses/` | written by `enemy-art-tidy.js` and this restructure | archives, read by nothing |
| `icons/`, `enemy inspo`, `enemy inspo discarded`, `enemy inspo variants`, `bees example`, `cardsNood`, `refsBackup` | nothing (the inspo folders are named only in comments) | not load-bearing |

**C. Real drawings sit in folders marked as generator output.** 26 enemy folders list `1-combat.webp` in
their `.generated.txt`, including all twelve chess pieces, the Juggernaut and the Matriarch. For most of
them the generator only converted a drawing from `_source/`. So "generated" does not mean "placeholder"
there, and a `--force` run rebuilds them. This is `FEEDBACK.md` B39. Proposal: once each original is in
the archive at its game path, take that file off the manifest, so the generator stops owning it.

**C, done for Anastasia's six Celestial pieces (2026-09-22).** Their drawings (`_source/chess/<piece>Celes-basic.png`,
cut out) are now in the archive at `enemies/celestial<Piece>/default/1-combat.png`, and the Queen's drawn
offense (`queenCeles-offense.png`) at her `1-offense.png`. Each folder's `.generated.txt` was removed (backed
up in the session scratchpad), because BOTH lines had to go. On a normal rerun the generator deletes every
file on a folder's list, but it writes nothing beside a `1-combat` that is not on the list. So taking only
`1-combat` off would have cost the other five pieces their generated attack tilt on the next run. Those five
tilts are still generator output; `archive-census.py` names them in `FROZEN_DERIVED` so they are not
reported as lost. The converter lists all seven as up to date. The census now reads 121 originals in the
archive and 72 pictures without one.

**C was NOT done for the eleven older enemies** (sporeling, capBrute, gloomWisp, hollowKnight, matriarch,
juggernaut, gardener, sage, alchemist, shield, scavenger). Their PNGs in `_source/refsPNG/enemies/` still
have their backgrounds (0% transparent). The cut-out versions the game uses exist only as `.webp` in
`_source/enemies/`. Putting a PNG with a background into the archive would bring the background back into
the game the first time it was converted. They stay on the generator's list, which rebuilds them from those
same cut-outs, so nothing is at risk. Waiting on Noodle: does a lossless cut-out of any of them exist?

**The Infernal pieces were left alone.** Noodle is working on them.

**D, done 2026-09-22.** Noodle: *"Resolve the Anastasia issue please so it'll use her new art."* The enemy table
gained `artCharacter`: an enemy naming a character is drawn from that character's default outfit folder, so
`gauntletAnastasia` now reads `characters/chess/default/` directly (sprite, hurt poses and portrait). The old copy
was moved to `_source/_archive-enemy-poses/gauntletAnastasia-copy-before-2026-09-22/`. Suite block [134].

**D. `enemies/gauntletAnastasia/default/` is a byte-for-byte copy of `characters/chess/default/`.** All
twelve files are identical. When Anastasia's poses are finished, both folders would need them. Proposal:
one small engine verb that lets an enemy use a character's art folder, then archive the copy. This is
Anastasia's workstream, and she stays unreleased.

**E. Character folders use old codenames.** Brienne's art is in `characters/knight`, Nettle's in
`necro`, Severine's in `vamp`, Cassadora's in `seer`, Cinder's in `lancer`, Clemence's in `priest` and
Anastasia's in `chess`. Nothing is stored twice because of it, but the folder name does not tell you whose
picture it is. Renaming them means changing `artFolder` on seven characters and every tool that names a
folder. Offered, not recommended for now.

---

## What must never be done

- **Never give `png-to-webp.py` a flag that deletes the source.** That is what lost Nettle's venom
  originals.
- **Never give `archive-census.py` an `--apply`.** Deciding that a particular loose file is the original
  of a particular game picture is a judgement, and a wrong guess copies the wrong art over a good path.
  A score of 1.000 makes the judgement easy; it does not make it automatic.
- **Never invent a marker for "finished".** There is none. Section 5 has Noodle's own words on it.
- **Never put `width` or `height` attributes on a sprite.** Section 4 says what happens.
- **Never run `generate-placeholder-art.py --force` without checking what it would overwrite**, because
  it rebuilds real art that happens to sit in a folder it owns, and it would undo the smaller card
  assets Noodle made for performance.

---

## Still open, and they are decisions rather than work

- ~~Whether ordinary enemies should stop using `presentation.scale`.~~ Answered 2026-09-22: keep it.
- ~~`celestialQueen/default/2-offense.webp`.~~ Answered 2026-09-22: generator output, archived.
- ~~Stale `artOwed` on enemies.~~ Cleared 2026-09-22 (23 of them), and suite block [132] holds it.
- The copy list in step 3, and the five folder proposals A to E in the 2026-09-22 section.
- Whether Noodle keeps originals outside the repo for the 49 GONE pictures listed under step 2.
