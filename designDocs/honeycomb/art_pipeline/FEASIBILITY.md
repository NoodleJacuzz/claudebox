# Honeycomb art pipeline — FEASIBILITY

Written 2026-09-14 before anything was built, revised the same day after Noodle's round 2 rulings
(`BRIEF.md`, bottom). Passages the rulings overruled are **moved verbatim to "Overruled" at the end**, not
edited in place. `../CATCH-UP.md` says what is true now.

## Verdict

**Every step is feasible.** Step 10's plumbing is confirmed: Forge exposes ControlNet `reference_only` over its
API (CATCH-UP "Measured"), and Noodle has confirmed that the character's `-a` is enough as the reference. The
risks that remain:

1. **The engine's existing rules change the sidecars.** Measured on one sidecar: `flaming skull` culled as a
   background element, `nipples` added by defaultDB. Per round 2, every such difference is **an engine bug to
   fix**, which makes the interference census a work list and not only a warning.
2. **Pose interpretation per character is the real work** (Noodle): a template says "defense"; how Nettle defends
   (magic shield) and how the vampire defends (arms) is a judgement per character, written on their entry.
3. **The action-pose data is all female.** Every breakdown / defense / offense / support ref is a `V`. The C
   prompts will be written with no C reference in those poses, which is the gender-swap test Noodle wants.

**One observation still drives the tooling:** steps 1, 3 and 4 are set arithmetic on the same parsed
sidecars, so one script serves all three. The script lists and **the agent judges first**; Noodle reviews
verdicts, not raw lists.

---

## The target, counted

Round 2: `-b` and `-exposed` are separate, and most poses need a damaged version.

| Slot | Healthy | Damaged | Refs today |
|---|---|---|---|
| standing | `-a` | `-b` | a: 12 · b: 6 (knight, lancer, necro × C/V) |
| defense | `-defense` | damaged defense | 3 (knight V, necro V, vamp V) |
| offense | `-offense` | damaged offense | 3 (knight V, necro V, vamp V) |
| support | `-support` | damaged support | 2 (necro V, vamp V), both fixed in round 2 |
| cut-ins | `-exposed`, `-breakdown` | — | exposed: 6 (priest, seer, vamp × C/V) · breakdown: 3 (V only) |

10 slots × 6 characters × 2 genders = **120 images; 35 exist, 85 missing.** No damaged action pose exists
yet, so "damaged" for those is derived from each outfit's `-b` / `-exposed` pair (`torn <garment>` tags and
exposure), then combined with the action template.

---

## Step by step

### 1 · Clean the refs — script the listing, agent judges

A node script (working name `refs-report.js`) parses every sidecar into
`{character, outfit, gender, pose, tags, weights, negative, loras}` and prints, per character:

- tags that are not in every image, split into identity/outfit tags (suspect) and pose tags (expected)
- C vs V differences (expected: gender, chest, genitals; anything else is suspect)
- weight disagreements, typos, pasted `Negative prompt:` lines, LoRA tags

The cleaned sidecars will also be the LoRA captions when Noodle trains later.

**Spotted in passing** (not the full pass):

| File(s) | What |
|---|---|
| `lancer1C-a` | `black hat`; the other three lancer images say `red hat` |
| `seer1C-exposed` | loses `glowing eyes`, `extra belts` |
| `vamp1C-a` | `fingerless gloves` without `long gloves`; every other vamp image has both |
| `vamp1C-*` vs `vamp1V-*` | `(vampire)` vs `((vampire))`; C lacks `male focus` |
| `vamp1V-offense` | `energy(fantasy)` is a missing comma |
| `knight1V-a` vs `knight1C-a` | `asymmetrical legwear` only on V; `-b` uses `planted sword` where `-a` has `weapon planted` |
| `necro1C-*` | `huge ass` only on C; `necro1V-breakdown` adds `green eyes` under `hair over eyes` |
| gender tags | inconsistent: knight C `cute boy`, lancer C `femboy, male only`, priest V has no `female focus` |
| `knight1V-defense`, `necro1V-defense`, `necro1V-offense` | a `Negative prompt:` line pasted into the sidecar |

### 2 · Codenames — feasible in minutes

- The LoRAs are not trained yet (round 2), so a codename does nothing in an image today. It is made now so the
  captions and the charactersDB entries are ready when training happens.
- **More names collide than the two known ones.** `cinder` is RWBY's Cinder (`.cinder` exists in the engine)
  and also the word for embers. `cassadora` pulls candles and John Cassadora. `brienne` sits close to
  `brienne of tarth`. Clemence looks safe. `vex` is moot now that the vampire is being renamed. **A typed name
  is rewritten to its canonical form**, so the shortcut activators must avoid existing names as well.
- Proposed convention: an `hc-` prefix alongside `sy-` / `fl-`, with a made-up name part. Whether C and V
  share one codename is part of the gender-swap work.

### 3 · Character database entries — compare compiled text

- **Compare compiled prompt strings.** Noodle sorts and cleans captions before training, so the engine's order
  matches the images better than the raw order does. Test: *engine(raw sidecar)* and
  *engine(shortcut + `default` + leftover tags)* produce the same string. No GPU, all 35 at once, rerun after
  every dictionary edit.
- **Interference census first:** compile all 35 raw sidecars and list everything the engine added, removed or
  rewrote. **Each unwanted entry is an engine fix** (a miscategorised tag, a wrong default), and the fix is
  expected to help normal use too.
- **Two layers, character and outfit, as the brief says.** C vs V differences are handled by **improving the
  engine's gender swap**, with the C prompts as its real-world test.
- Uncategorised tags: `webui2-unknown.js` already reports them. Likely candidates: `necromancer`,
  `flaming ponytail`, `stepping on head`, `pelvic curtain`, `extra belts`.

### 4 · Pose patterns — same tool as step 1

For each character, compute `tags(pose) − tags(a)` and `tags(a) − tags(pose)`, then count how many characters
share each difference. A difference most characters share is a template candidate; one only a single
character has is an individual trait. Visible already:

- **`-b` / `-exposed`:** `torn clothes` plus `torn <garment>`, `sweat`, `blush`, `embarrassed`, a covering
  gesture (face, crotch or chest), and exposure tags that differ by gender
- **`-breakdown`:** `cowboy shot`, pink or glowing eyes, `shaded face`, `crazy` / `yandere`, hands to head or
  face, and the takorin LoRA at 0.5. **A template can carry a LoRA**
- **`-offense` / `-defense`:** `dynamic, action pose`, then `attacking` or `blocking`, `clenched teeth`,
  anger. `-support`: `dynamic`, then a casting gesture (`spellcasting`; `arm up, arm outstretched`)

**Damage** is isolated per outfit from its `-b` / `-exposed` pair and written into **that outfit's own
replacement rules** (outfits carry `target; replacement` lines: `collectEntryReplacements` in `webui2.js`).

### 5 · Pose templates

A template gives the shape of a pose; the character's entry says how they perform it. Test generations use
the character's `-a` as the ControlNet reference.

### 6 · Shortcut rules — mind where the rules live

- **cleaningDB rules are global** and mostly run early (Phase 1; `Final` runs late). **Character and outfit
  replacement rules are per entry** and run in Phase 4. So the global pose template goes in cleaningDB, and
  individual exceptions go on the character's own charactersDB entry (agreed, round 2). Check the order: an
  early cleaningDB expansion consumes the keyword before the entry's rule can see it. **Entry targets are
  lowercased** (`collectEntryReplacements`), so a Capitalized pose keyword must be checked against that.
- **Keyword names.** `exposed`, `offense`, `defense` and `support` are plain words, and `exposed` is already a
  tag in the sidecars, so the pose shortcuts need names no caption will contain. Keep them short to type on a
  phone.
- **"Test generate all missing images to get their prompts" needs no GPU.** Emit a **review sheet**: every
  missing slot's prompt with its difference from that character's `-a` highlighted, plus the agent's verdict
  on each.

### 7–9 · Inconsistencies

- Systematic fixes go in the global dictionaries (cullDB contradictions, categories, defaults). Noodle expects
  most to be right for normal use too; each is still a behaviour change, so run `webui2-test.js`.
- Individual exceptions go on the character's or outfit's charactersDB entry.

### 10 · The production run — feasible, measured

- **Forge's API exposes ControlNet `reference_only`**, and the unit carries `guidance_start` /
  `guidance_end`. The request is one more `alwayson_scripts` entry, placed beside Regional Prompter and
  prompt notes exactly as `webui.js` already attaches those.
- **The reference is always that character and gender's `-a`** (round 2).
- **Use a headless batch runner, not the page.** A node tool runs the engine in a `vm`, as the Discord bridge
  already does. It reads a job list (character, gender, slot, seed, candidate count), compiles, attaches the
  ControlNet unit with the base64 `-a`, sends the request, and saves the PNG **plus a sidecar of the compiled
  prompt** in refsPNG's naming. An approved image can then join refsPNG as data for templates and future
  LoRA training.
- It must honour the bridge's claim hook so it does not race Noodle's own generations.
- Generate several candidates per slot, then pick. The human pick is the quality gate.
- **Still unknown:** whether Forge's built-in reference_only accepts `image` as plain base64 over the API. One
  test generation settles it. Re-read `/sdapi/v1/script-info` after any extension update.

### 11 · Injection

The generator (`../tools/generate-placeholder-art.py`) already cuts out white backgrounds, sizes sprites to 1300 tall,
writes webp and crops portraits, so the injection script can reuse all of that. Traps and gaps:

- **The generator overwrites real art that is still on its `.generated.txt` manifest.** Injection must take
  each file off its manifest.
- **Only V is injected.** C images stay in refsPNG-style folders with the `C` letter until Noodle decides.
- **No `exposed` slot exists.** The half-health cut-in shows the hurt tier's `2-basic`. An `exposed` pose that
  falls back to `2-basic` is a small resolver addition to Honeycomb's own code.
- `-breakdown` → `characters/<char>/broken.webp` is per character, not per outfit.
- Mapping: `a`→`1-basic`, `b`→`2-basic`, `defense`→`1-damaged`, `offense`→`1-offense`, `support`→`1-passive`,
  their damaged versions → `2-damaged` / `2-offense` / `2-passive`, portrait cropped from `a`.

---

## Suggested order

| # | Work | Brief steps |
|---|---|---|
| 1 | `refs-report.js` + agent verdicts; interference census → engine fixes | 1, 4 (data), 3 (census) |
| 2 | Codenames | 2 |
| 3 | charactersDB entries (character + default outfit, damage in outfit rules); compiled-text round trip | 3 |
| 4 | Pose templates, standing and cut-ins first, then actions; per-character interpretation | 4, 5, 6 |
| 5 | Review sheet, inconsistencies, gender-swap fixes, systematic vs individual rules | 6, 7, 8, 9 |
| 6 | Batch runner with ControlNet (`-a` reference); production run | 10 |
| 7 | Injection script (V only) | 11 |

The batch runner is needed by step 4's test generations too. It can be built whenever the first test image is
wanted; the order above does not require it earlier.

---

## Overruled (moved here verbatim, 2026-09-14)

Each passage is followed by the ruling that retired it (BRIEF.md, round 2).

> 2. **The pose data is thin and all female.** Every breakdown / defense / offense / support reference is a `V`.
>    `C` has only standing poses. Support has one real example: `vamp1V-support`'s caption is a word-for-word
>    copy of `vamp1V-offense` (`attacking, slash`).
> 3. **A tear has to be written for each garment.** `-b` / `-exposed` add `torn <garment>` for each garment
>    worn. A global rule cannot loop over an outfit's garments, and no engine feature is known to do it.

→ Noodle fixed both support refs. The full `-b` / `-exposed` sets already hold the `torn <garment>` tags, and
the hard part is per-character pose interpretation.

> | `-exposed` | 6 (priest, seer, vamp × C/V) | No character has both `-b` and `-exposed`. Question 3 |
> If the game also wants hurt-tier action poses (`2-damaged`, `2-offense`, `2-passive`), that adds 36, for
> **120 images with 85 missing**. Today those fall back to the tier-1 pose. Question 8.

→ Separate images; damaged versions of most poses are wanted. The 120 count is now the target.

> | `seer1C-exposed` | `wide-eyed` and `spiral eyes` with a blindfold (Noodle's own example); loses `glowing eyes`, `extra belts` |
> | `vamp1V-offense`, `-support` | identical captions; `energy(fantasy)` is a missing comma |

→ Skull's blindfold covers one eye only, so eye tags are valid. Vex's support was fixed.

> **If the LoRAs will be retrained, the cleaned sidecars ARE the new captions**, which makes this step worth
> more than it looks (question 6).
> - **A codename only does something if a LoRA has learned it.** `sy-helena` works because training captions
>   carried it. A new `hc-brienne` that is in no LoRA is close to noise. The LoRA list on Forge came back empty
>   from the API, so this could not be checked. Question 6.

→ The LoRAs are not trained yet and will be later; ControlNet reference bridges the gap for now.

> - **Compare compiled prompt strings, not images.** SD is sensitive to tag order and the engine sorts. So the
>   raw sidecar is not a valid baseline, but *engine(raw sidecar)* is.

→ Noodle sorts captions before training, so the engine's order matches the images better. Comparing compiled
text stays, for finding differences.

> - **Four layers, not two.** Split each sidecar into:
>   1. gender/meta: `1girl` / `1boy`, `female focus`, `femboy`, `cute boy`, `male only`, generated from C/V
>   2. identity: body tags
>   3. outfit: clothing tags (and weapons/props, question 9)
>   4. pose: stance, expression, framing
>   The sidecars disagree mostly in layer 1, so that layer should be generated, not copied per character.

→ Disagreed. Gender swap is an underdeveloped part of the engine and this is its real-world test; systemic
fixes should serve normal use too.

> The one probe run (`seer1V-exposed`) found `flaming skull` removed by `simple background`'s cull and
> `nipples` added by defaultDB. It also showed `spiral eyes`, `glowing eyes` and `blue eyes` all surviving
> next to a blindfold.

→ The blindfold is over one eye; the eye tags are correct. The `flaming skull` finding stands, as an engine fix.

> **The torn-garment problem.** Nothing known in the engine turns an outfit's garments into their torn forms,
> and a cleaningDB rule cannot loop over an outfit. The cheapest fix is authored data: a second outfit line per
> outfit (`*default` and a torn version).

→ It would double the outfit list and duplicate what outfit replacement rules already do.

> A template adds tags and removes some. With the four-layer split, removal is rarely needed. **Build the
> step-10 dispatch before testing templates.** Without the reference, test images come out off-model, and a good
> template gets judged bad for the wrong reason.

→ The `-a` image as reference is enough; `lancer1V-breakdown` can be generated from `lancer1V-a`.

> - Reference choice: the same character and gender's `-a` by default. For hurt and exposed poses, possibly the
>   `-b` or an approved generation.
> - **The game has no gender axis in its art paths** (`characters/<char>/<outfit>/<tier>-<pose>`). Where `C` goes
>   is a design decision (question 7).

→ Always `-a`. C stays out of the game for now; C files keep the `C` letter.

> The questions list (1–10) of the first version.

→ Answered: 1 (Noodle edited the list), 3, 4 (renamed to defense), 5 (fixed), 6, 7, 8. Still open: 2
(`-support` wording, strongly implied by the fixed refs), 9 (props: outfit or character), 10 (answered in
spirit: global, because it helps normal use).
