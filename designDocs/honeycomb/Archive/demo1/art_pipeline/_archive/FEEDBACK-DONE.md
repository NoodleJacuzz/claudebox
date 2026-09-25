# Art pipeline — finished feedback

Closed items from `../FEEDBACK.md`, moved byte for byte with their annotations.

---

### B25. OUTFITS.md is GENERATED, and it was eating Noodle's notes ☑

`OUTFITS.md` is written wholesale by `build-outfits-doc.js`. Two of Noodle's hand-written notes were
living in the generated file:

> Note from noodle: What on earth were you cooking, deepseek? "animated weapons"? "heat"? "burial"?! Throw all these out!

> Note from noodle: Try moving closer to what's actually likely to be recognized by the AI.

The first rebuild of that document destroyed both, which is what happened in session 42 before it was
caught. **Both are now in `build-outfits-doc.js` itself**, inside the `out.push()` blocks, so a rebuild
carries them; and the generator's header says so, so the next person does not put a note back in the
generated file. Rebuilt and confirmed present.

The wider point for this folder: **a generated document cannot hold feedback.** If a note must survive,
it belongs in the generator or in this file.

---

### B40. `artOwed` is stale on 23 enemies ☑ — FOUND SESSION 51, CLOSED 2026-09-22

`artOwed: true` on an enemy means *"it stands on another enemy's drawing until its own is drawn"*, and
the suite uses it to **skip** the missing-art check for that enemy. Twenty-three enemies now have their
own drawing on disk and still carry the flag:

Puffcap, Witch's Butter, Sporeguard, Glowcap, Shieldcap, Cagecap, Bolete Hook, Foxfire, Wellspring,
Briar Brat, Trumpet Bell, Windfall Alraune, Thorn Fencer, The Waking Sister, The Sleeping Sister, Sable
Fencer, Argent Fencer, Mantlewing, Longwing, Soakcap, The Pale Dray, The Head Gardener, The Shroud.

Nothing is broken today, because the art exists. What it costs is the check: if one of those twenty-three
files went missing, the suite would not say so. Three enemies still carry the flag correctly — Mold
Leech, Scrap Salvager and Hollow Champion, which are exactly the three recolours in B38.

**☑ CLOSED 2026-09-22 (art restructure).** The flag and the "no drawing yet" comment above it were removed
from all twenty-three in `honeycomb-content-enemies.js`. Mold Leech, Scrap Salvager and Hollow Champion keep
it. Suite block [132] now fails if an enemy standing on a real drawing (one absent from its folder's
`.generated.txt`) says its art is owed; run against the pre-edit file it named exactly these twenty-three.

---

### B8. Broken character art per outfit ☑

> The "Broken" character assets should be made outfit-specific, otherwise when proper alternate outfit
> assets are added the art won't match.

`brokenArtPath` / `brokenBackgroundPath` are per-character fields the resolver already reads; an outfit
version resolves them through the worn outfit (`honeycomb.art.characterFolder`), exactly as the Exposed
cut-in does. Waits on outfit art existing.

**2026-09-22, Noodle again, and it now covers Recover too:**

> I believe we should make recover and broken poses outfit-specific.

`recoverArtPath` needs the same treatment as the two Broken fields. Still waits on outfit art existing.

**2026-09-22, recover art generated for the default outfits.** Noodle asked for each character's basic-a
put through the engine with *"upper body only, dark, determined"*, plus *"looking at viewer, upturned
eyes"* for anyone without "hair over eyes" or "obscured eyes". Four of each, seven characters, are in
`!designDocs/pose_workspace/recover/` as `<codename>1V-recover-a-00N` with sidecars, at `Honeycomb` style
and 832x1216. Cinder, Nettle and Clemence did not get the eye tags. The prompts type out each character's
`PoseA` tags rather than using `PoseA`, because the shortcut's `full body` and `white background` remove
`upper body only` and `dark`. **Before one goes in the game:** the cut-in crops `recover.webp` to a strip
at eye level through `tuning.recoverOverlay.eyeWindow`, and those numbers were set for full-body standing
art. An upper-body picture puts the eyes somewhere else, so the window has to be re-measured.

---

**☑ CLOSED 2026-09-22 (session 56).** Both cut-ins are per outfit now. Broken reads `<outfit>/1-broken` above half
health and `<outfit>/2-broken` at or below it, then `1-basic`, then the older per-character `brokenArtPath`
(`honeycomb.art.brokenCutInChain`). Recover reads `<outfit>/recover`, then the default outfit's, then
`recoverArtPath` (`recoverCutInChain`). Suite block [133]. Seen in the browser: Clemence's Broken cut-in drew
`priest/default/1-broken` and her recovery drew `priest/default/recover`. The recover eye window is still
the one set for full-body art and has not been re-measured for the upper-body pictures.

### S60-10. _source, mockups and screenshots moved to !imageStorage — DONE (session 60) ☑

> I need to remove the _source, mockups, and screenshots folders from v13 spire images. Is anything
> load-bearing? Their new destination will be !designDocs\honeycomb\!imageStorage, for reference.

Nothing in the game loaded them: every hit in `scripts/` was a comment. But `_source` is where the dev tools
keep their inputs, so 18 tool files were repointed before the move:
- `generate-placeholder-art.py` (`SOURCE_DIR` is now an absolute path)
- nine `art_pipeline/*.js` scripts
- four card-chrome Python scripts in `card_redesign/overlays/`
- `archive-census.py`
- `enemy-art-tidy.js`
- the two HTML benches in `tools/`

`doc-links.js` skips `!imageStorage`. The three folders were then renamed into place on the same drive:
nothing was copied or deleted. Checked afterwards: the generator loads Nettle's source and the shared
negative prompt, `refs-census.js` reads the refs, and `enemy-art-tidy.js` runs clean.

### S60-11. png-to-webp skips folders starting with _ — DONE (session 60) ☑

> There are a number of _standins you used in another session to create event images for the events
> missing ones. I think it would be good if our png->webp pipeline ignored folders that started with _

It already refused them, but it walked into them and listed every file. Now `os.walk` is pruned, so it never
looks inside a `_` folder, and the report names each skipped folder once: nine of them today.

### S60-12. imagepack-import.js exports Honeycomb's pictures — DONE (session 60) ☑

> (This is blocked by the above two steps) I need imagepack-import.js updated to handle our png->webp
> pipeline, and export Honeycomb images the v13 imagepack webp folder on the D: drive, just like it does
> for syrup town images.

Two new steps at the end of `!designDocs/imagepack-import.js`:
- **Step 10** runs `png-to-webp.py`, as a report in check and `--plan` mode and for real with `--apply`.
- **Step 11** mirrors `v13 spire images` into `D:\v13 imagepack webp\v13 spire images\`. It copies
  .webp, .png and .svg, skips `_` folders and the generator's manifests, copies only changed files, and
  deletes nothing. It names anything in the pack that the game no longer has.

Step 6 no longer copies that folder into `images-webp`. The Syrup Town checks and the Honeycomb steps are
independent, so a failed Syrup Town check still lets steps 10 and 11 run. Report mode today: 747 pictures
would be added. **Not run with `--apply`**: that is Noodle's, because it also runs the Syrup Town import.
