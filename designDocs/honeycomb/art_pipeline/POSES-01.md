# Poses, round 01 (steps 4 and 5) — 2026-09-14

**Status: templates built, scored, all 97 missing prompts compiled, 3 slots test-generated. Step 6 turned them
into shortcuts — see "Step 6" below.** The data is `pose-templates.js`; the compiled prompts are
`MISSING-PROMPTS.md` (generated); the test images are in
`v13 spire images/_source/refsTests/2026-09-15/`.

## The brief for these steps

> In general, my advice when you start trying to make templates is: Start with the 1V-a version of the character,
> comparing to 1C-a for male/female differences in the base outfit, then go down trees comparing and isolate
> differences between similar versions. Extrapolate whatever intent you can to obtain templates, asking yourself "what
> was Noodle's goal here, and what tags seem to be meant to achieve that goal?"

> Future steps will be easier if you also try and ascertain character traits at this stage rather than waiting until
> step 7, and leave general (but not overwhelming) advice for future agents. Knowing Brienne is a knight and Clement is
> a priest will definitely color how those characters will be prompted differently for attacking and defending.

## How a pose prompt is built

`.hc<Char><V|C>, default` (identity + outfit), then five layers, all in `pose-templates.js`:

| Layer | Holds | Found by |
|---|---|---|
| `CORE[slot]` | what every character does in the pose | tags shared by every reference of that pose |
| `METHOD[char][slot]` | how this character does it | the tags only that character's reference has; for missing slots, the cast notes below |
| `DAMAGE[char]` | the outfit's tears, on every damaged slot | the `torn <garment>` tags of `-b` / `-exposed` |
| `SEX[char][V/C][level]` | body shown: `a` clothed · `lite` damaged · `full` exposed · `lust` breakdown | C-vs-V differences inside one pose |
| `DROP[char][slot]` | outfit props the pose cannot hold (`!black staff`) | what a pose's reference lacks from the outfit |

Slots, by FILE name (Noodle renamed the refs 2026-09-14): `basic-a basic-b exposed breakdown-a breakdown-b defense-a
defense-b offense-a offense-b support-a support-b`. `-a` is undamaged and `-b` damaged, so the two compare side by
side; `exposed` is the damage moment itself. 11 slots × 12 = 132; 35 exist, 97 missing. **Score: the templates rebuild the 35 existing sidecars at 99.8%** (32 exactly;
Brienne's offense deliberately adds `slashing, determined`).

## The cast

Class and blurb are the game's (`honeycomb-content-characters.js`); the rest is read from the sidecars' goals.
**Use this to write a slot no reference exists for.**

| | Brienne (knight) | Cinder (lancer) | Nettle (necro) | Clemence (priest) | Cassadora (seer) | Severine (vamp) |
|---|---|---|---|---|---|---|
| Class | Warrior, defender | Lancer, striker | Necromancer, attrition | Confessor, support | Hexer, trickster | Bloodletter, striker |
| Core read | Stoic duty. "Nothing gets in the way of a job." | Grinning menace hidden under a huge hat | Dour, faceless, grumpy; rot and patience | Serene martyr who takes the pain for others, and quietly likes it | Smug know-it-all who sees what you'll do | Greedy predator, playful and toothy |
| Face | eyes visible, visor up, neutral-to-stern | eyes never shown (`obscured eyes`), grin | eyes never shown (hair), mouth sets mood | eyes veiled, smile | one eye covered, smirk | glowing red slit eyes, fangs, licking lips |
| Signature stance (`-a`) | hand resting on planted sword, buckler arm | spear held upright, grin | foot on a flaming skull, knee up, staff | hands raised, palms up (blessing) | hand on hip, other hand up to her skull, wide stance | clawed arm outstretched, beckoning |
| Weapon / focus | sword + buckler | flaming spear | black staff + green fire | her hands; holy light | floating blue-flame skull | claws |
| Attacks by | sword slash | lunging spear thrust, fire | staff strike, angry | outstretched hand, light (she rarely attacks) | pointing a hex at you | claw slash, energy |
| Takes a hit (`defense`) | staggers, one eye shut, teeth clenched, sword kept | knocked back, hand to her hat, teeth showing | furious: anger vein, hair and dress whipped by the blow | trembles and smiles, hands to her chest | caught out: wide-eyed, sweatdrop, leaning back | teeth and fangs clenched, arms up, looking down |
| Supports by | hand to chest, resolve aura | hand on hat brim, flourish, fire | spellcasting, wide stance, mouth open | praying, hands clasped, light | hand up, magic circle, blue fire | arm raised high, fangs bared |
| Damaged (`-b`) | wince, one eye shut, looks away, covers herself: pride hurt, still standing | hides her face under her hand, wavy mouth | angry, anger vein, keeps her stance | still smiling, flushed, hand to cheek | smug cracking: nervous smile, sweatdrop | glaring, teeth bared |
| Exposed | stern embarrassment, covering, sword still planted | flustered, clutching her hat, covering chest | angry-embarrassed, covering crotch | exhibitionism: hands on her own chest, wavy smile | total fluster: spiral eyes, sweatdrops, one leg up | flustered predator: looking down, full-face blush |
| Breakdown | hypnotised: pink glowing eyes, hands to head, crazy | the grin goes crazy, drooling, hand on hat | overwhelmed: clutching hair, headache, bent over | rapture: happy tears, trembling, hands on face | the smug mask breaks: crazy smile, tongue out | mind break: laughing, tongue out, drool |
| C version | `cute boy` (short, not a femboy) | femboy | `cute boy` | femboy | femboy | femboy |

## Patterns (step 4)

- **`-a` → `-b`:** the stance stays, the weapon usually stays; the signature EXPRESSION goes (grin, smile). Added:
  `torn clothes` + the outfit's tears, `sweat`, a covering gesture, and a character reaction (embarrassed / angry).
  V covers with an arm or hand; C shows an erection or tenting.
- **`-b` vs `-exposed`:** exposed is a bigger moment. `exposed` (and usually `battle damage`) is written, the
  expression opens (`open mouth`, `wavy mouth`), the covering gesture becomes both arms, and the body is fully shown.
  The stance is dropped for a reaction pose.
- **`-breakdown`:** `cowboy shot` (so no shoes, no `full body`), `shaded face`, glowing eyes in a new colour (pink,
  or the character's own: Nettle's green), hands to head or face, a crazy/yandere/mind-break mouth, and lust. The weapon
  is gone (`DROP`).
- **Actions:** `dynamic` + (`action pose`) + the verb (`attacking` / `blocking` / casting). The `-a` stance is gone.
  **Defense is being HIT** (Noodle, 2026-09-14), not blocking or dodging: core is `pain, wince`, and METHOD is how each
  character reacts. The knight and vampire references show blocking; that is a step 7 note, not the goal.
- **Sex:** within one pose, C and V differ only in body tags. A C unexposed pose carries a bulge; V none.

## Test generation (step 5)

`refs-generate.js` sent three missing slots to Forge with ControlNet `reference_only` on the character's `-a` at
0–0.7 (Noodle's setting), style `None`, 704×1408:

| Slot | Result |
|---|---|
| `priest1V-support` | **On model and on pose**: praying, hands clasped, serene smile, veiled eyes, light particles |
| `lancer1V-offense` | Static standing figure, spear missing. Weighting the action tags brought the spear back but not the pose |
| `seer1V-defense` | Standing smirk with the skull in hand: not a dodge |

**SETTLED BY NOODLE AFTER THIS TEST: timesteps 0.7–1.0 always, style fidelity 0.5, style `Honeycomb`** (now the
runner's defaults). The exploration below is history, and its recommendation is overruled.

**The reference window decides the composition.** At 0–0.7 the reference locks in the `-a` image's standing pose. The
same seed with the window at **0.3–0.8** gave a real lunge with the flaming spear, and a leaping dodge with the skull,
at the cost of some drift (Cinder's hat grew a point; Cassadora's blindfold spread to both eyes). **Recommendation for step
10: calm slots (`a`, `b`, `exposed`, `support`) at 0–0.7; action slots around 0.3–0.8**, and step 7 checks what
drifts. Only 5 images were made, so treat the numbers as a starting point.

## Advice for the next agent

1. **Read the cast table before writing a pose.** Ask how *this* character would do it; the core tags alone
   make everyone look the same.
2. **Tag, compile, read `Engine added`.** A carry-on that does not fit is a tag to single-quote (Rule 2c) or a rule
   to fix. `refs-census.js --triggers` finds which tag caused it.
3. **Entries must spell out what a cleaning rule would add**: cleaning runs on typed tags only, never on tags an
   entry injects (Nettle needed `obscured eyes` written).
4. **A new character is data only:** a refs row in `refs-roundtrip.js`'s `ENTRY_OF`, an entry pair in charactersDB, and
   a column in `pose-templates.js`. Run the round trip until every `-a` matches.
5. **Never trust a pose from its prompt alone**; generate one before scaling a template up.
6. **No blood or gore, ever** (Noodle). Severine is a Bloodletter by class name only; nothing visual says blood.
7. **After adding or changing a keyword in charactersDB**, run `pose-templates.js --sync --write` to carry it into the refs.

## Step 6 — the shortcuts (added 2026-09-14)

`refs-shortcuts.js --write` puts generated rules in the dictionaries, so a slot is typed as
`.hc<Char><V|C>, default, <token>`:

| Token | Slot | Token | Slot |
|---|---|---|---|
| `PoseA` | `basic-a` | `PoseDefense` | `defense-a` |
| `PoseB` | `basic-b` | `PoseDefenseB` | `defense-b` |
| `PoseExposed` | `exposed` | `PoseOffense` | `offense-a` |
| `PoseBreakdown` | `breakdown-a` | `PoseOffenseB` | `offense-b` |
| `PoseBreakdownB` | `breakdown-b` | `PoseSupport` | `support-a` |
| | | `PoseSupportB` | `support-b` |

**Filenames use the FLAG form, not the letter:** a `<pose>-b` file is the damaged version of `<pose>-a`, and every
slot has both. That is why the tokens are `PoseDefense`/`PoseDefenseB`, not `-a`/`-b`.

The CORE rules are at the top of `cleaningArrayInitial` (so their tags are cleaned like typed ones); the
METHOD/SEX/DAMAGE rules are on each `.hc*` entry and `*default` outfit; a bare, unclaimed token is purged in
Final. `refs-shortcuts.js` (no flag) re-verifies all 132 slots and prints where the shortcut path resolves a tag
differently from the step 5 template input. **119/132 are identical**; the 13 are the insertion gate's
exclusivity or a Phase-2 tag injected in Phase 4, and are listed there. Step 7 reviews them.

## For steps 6–9 (noticed, not changed)

- Severine C: `large bulge` in `-a` but `small penis` when exposed. Pick one.
- Brienne C and Cinder C exposed: the engine's body defaults add `large penis, brown penis`. Plausible; confirm.
- ~~Severine has no hair colour~~: Noodle added `grey hair` to her entry; `--sync` wrote it into her sidecars.
- `hand on headwear` becomes `hand on hat`; `smirk` / `crazy smile` add `grin`. Harmless; noted. (The
  `hand on headwear` one is already corrected in the METHOD table, because an entry injection skips that rewrite.)
- ~~The damaged-action filename (`-defense-b`?)~~: **closed** by the `<pose>-a` / `<pose>-b` renaming.
- **The golden 13** (`SHORTCUTS-TESTS.md`) are the step 7/8 material: `open mouth` vs `grin`,
  `laughing` vs `crazy`, `covering face` vs `hair over eyes`, and Nettle's `stepping on head` shifting solo focus.
