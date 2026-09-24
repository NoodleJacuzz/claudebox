# Art pipeline — SESSION LOG (archived)

**ARCHIVED.** Sessions 3 and 4 of the art pipeline, moved out of `../CATCH-UP.md` in session 41
so the catch-up carries only the latest state plus the standing reference.

Read it only to answer *why is it like this* or *when did that change*.

---

## Status as of 2026-09-14 (session 4, end: Noodle's round 3 notes applied)

- **Refs renamed by Noodle:** `<char>1<V|C>-<pose>-<a|b>` (`basic-a` is the old `-a`, `basic-b` the old `-b`; every pose
  has an undamaged `-a` and a damaged `-b`; `exposed` unsuffixed). All tools use the new names. 11 slots, 97 missing.
- **Generation settings are SETTLED:** style `Honeycomb`, ControlNet reference 0.7–1.0, style fidelity 0.5 — the defaults
  of `refs-generate.js`. **Not yet confirmed in a live request**: Forge was busy at the end of the session and the runner
  refused to queue.
- **Defense = being hit**, never blocking or dodging. **No blood or gore** anywhere.
- **`pose-templates.js --sync --write`** appends any charactersDB entry/outfit keyword a sidecar lacks, beside its entry
  neighbour, skipping DROP props, framing culls and recoloured parts. Run it after editing an entry. First run: `grey hair`
  on Severine's 8, `obscured eyes` on Nettle's 8. Backup: `refsBackup/2026-09-14-before-sync/`.
- Round trip still 12/12 `basic-a`; template score 99.1% (defense now deliberately differs from the refs that block).
- `POSES-01.md`'s 0.3–0.8 reference recommendation is OVERRULED by the settled window above.

## Status as of 2026-09-14 (session 4: steps 3, 4 and 5 done)

**Read `POSES-01.md` next.** It holds the cast (who each character is and how she attacks, defends, breaks), the pose
patterns, the templates' layers, the test generations and advice for the next agent.

- **Step 3, charactersDB entries: DONE.** Twelve entries in a new `Honeycomb Catacombs` region of `charactersDB.js`:
  `.hcKnightV`/`.hcKnightC`, `.hcLancerV/C`, `.hcNecroV/C`, `.hcPriestV/C`, `.hcSeerV/C`, `.hcVampV/C`, each with
  `*default`. Type **`.hcPriestV, default`** for the character in her outfit. (`.hcPriestV*default` is the outfit ALONE:
  existing engine syntax.) **All 12 `-a` sidecars compile identically** from the entry plus their pose tags, tag for
  tag and in order: `refs-roundtrip.js`.
- **Step 4, patterns: DONE** (POSES-01, "Patterns").
- **Step 5, templates: DONE.** `pose-templates.js` rebuilds the 35 existing sidecars at 99.8% and compiles all 85
  missing slots into `MISSING-PROMPTS.md`. `refs-generate.js` sends a slot to Forge with ControlNet `reference_only`
  on the `-a` image. **Finding: action poses need the reference window at about 0.3–0.8**; 0–0.7 freezes the `-a`
  standing pose.

**Engine changes made for step 3** (webui_engine CATCH-UP has the entry):

| Change | Why |
|---|---|
| Rule 2c reaches DICTIONARY VALUES: a `'quoted'` tag in an entry, outfit or replacement line is protected too | Clemence's entry needs `'wide hips'` without `thick thighs` |
| **Sex twins**: entries sharing an identity tag, one `female` and one `male`, are one character; typing the identity tag summons the twin the prompt's `1girl`/`1boy`/`female`/`male` asks for | `hc-kn1ght` in a male sidecar summoned the female entry. First piece of gender swap |
| An image-level default is vetoed when any figure's own view meets its exception | typed `male focus` gave a tall femboy `cute boy`, because her `tall` was hers and the image view could not see it |

Engine suite 689 passed, the same 4 pre-existing failures; dispatch 51/51.

**Next:** step 6 (cleaningDB shortcut rules that apply the templates), then 7–9. **Waiting on Noodle:** the
damaged-action filename (`-defense-b`?), which style the Honeycomb refs were made with (tests used `None`), and the
"For steps 6–9" list in POSES-01. Deferred: alternate outfits, enemies, C art in the game, LoRA training.
## Status as of 2026-09-14 (session 3: steps 2 and 2a done)

- **Step 1 is reviewed and accepted** (Noodle: "Good choices all around"). `REFS-CLEANING-01.md` stands.
- **Step 2, codenames: DONE.** See "Codenames" below. Each is the first tag of every sidecar now.
- **Step 2a, the engine against a white background: DONE.** See "Step 2a" below. `refs-census.js` is the tool.
- Earlier in session 2: Vex was renamed Severine, index included (honeycomb CATCH-UP, session 19).

**Then, same session: Rule 2c (single-quoted tags are protected) was built into the engine, and the sidecar tags the engine altered or added to are quoted.** See "Protected tags" below.

**Next:** step 3, the charactersDB entries. **Waiting on Noodle:** the damaged action-pose filename, and the
flags in "Step 2a" (none of them block step 3). Deferred by Noodle: alternate outfits, enemies, C art in the
game, LoRA training.

