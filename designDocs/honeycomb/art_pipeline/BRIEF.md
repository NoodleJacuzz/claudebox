# Honeycomb art pipeline — BRIEF

**The standing brief for the art-pass pipeline.** Noodle's instructions, preserved as written (2026-09-14).
Annotations under each are interpretation and pointers; **if an annotation and the instruction disagree, the
instruction wins.** The feasibility analysis is `FEASIBILITY.md`; where the work stands is `../CATCH-UP.md`.

---

## The goal

> We've been working on the game's feedback documents for a while and I'd like a break to start laying down
> the foundations for the art pass, and I would appreciate your help.

> In the v13 spire images/_source/refsPNG you will find subfolders with a number of png files in each and txt
> sidecars as well. Our goal is to use these as a basis to create an automated pipeline that lays the
> groundwork for generating images for the art pass. Obviously the images will need to be manually improved
> at the end of the pipeline, but with your help I think we can make actually getting to that point a lot
> less painless, because right now we're stuck using placeholders.

> To help us, we'll be using the WEBUI v2 engine, who's character database and capacity for shortcuts will
> undoubtedly make this a lot quicker.

The engine is documented in `!designDocs/webui_engine/CATCH-UP.md`, which outranks anything said about it
here. Output is a starting point for manual paint-over, never final art.

## Filenames

> An explanation of the character filenames:
> `lancer1C-a`
> `lancer` - character codename
> `1` - Outfit index, in this case his default
> `C` - Either C or V, denoting male or female version of the character
> `-a` - Specific pose or image

> Other suffixes explained:
> `-a` - Standing pose when above half health
> `-b` - Standing pose when at or below half health
> `-breakdown` - Image show during the Broken effect cut-in
> `-exposed` - Image shown during the Exposed trigger when reaching half health
> `-defense` - Image used when character is being hit
> `-offense` - Image used when character is using a damage card
> `-support` - Image used when character

- `C` = male (`1boy`), `V` = female (`1girl`); the sidecars agree.
- `-a` / `-b`: Noodle corrected the list above in place (round 2).
- **`-support` is still cut off.** Read as "plays a support card" (the game's `passive` pose, which also
  covers skill / power / curse). The two fixed support refs agree: Nettle `spellcasting`, the vampire
  `arm up, arm outstretched`.
- `-hurt1` is gone: Noodle renamed `vamp1V-hurt1` to `vamp1V-defense` (round 2).
- `-b` and `-exposed` are **different images**, and most other poses need a damaged version too (round 2).
- Character codenames are the game's art folder names: `knight` Brienne, `necro` Nettle, `vamp` Vex (being
  renamed, round 2), `lancer` Cinder, `priest` Clemence, `seer` Cassadora.

## The steps

> I'll try my best to break down this project into steps, though you'll likely need a catch-up document for
> this aspect of the project itself.

That document is `../CATCH-UP.md` in this folder.

> 1. Clean the refsPNG data. The images inside were training data for LoRA models, which means they needed to
>    be tagged accurately over consistent to the character's intended look. We need to find inconsistencies
>    among character and clothing tags and check if they need addressing, just in case some elements are
>    wrong between various shots of the same character.

> 2. Create stable diffusion codenames for each character. They cannot use real tags, and these are different
>    from character shortcut activators. For instance, when making syrup town characters, I had to use
>    `sy-helena` as the stable diffusion codename for `hyena`. This is because using the tag `sy-hyena` would
>    result in hyena aspects translating to the image. There are two honeycomb cases I know of right away
>    where this applies: Brienne cannot use `knight` in her stable diffusion codename, since that would always
>    include knight details even in alt outfits. And Nettle cannot use `nettle` in her stable diffusion codename
>    for similar reasons.

Precedent in the engine: `.furhyena; sy-helena, …` in `charactersDB.js`, the name block in `aliasDB.js`, and
`sy-hyena; sy-helena` in `cleaningDB.js`. Fleshy forms use `fl-`.

> Sorry, I just realized something that makes this extremely simple. Injecting numbers inside a tag makes it
> virtually unrecognizable to the AI and is actually best practice in some lora-training contexts. So `hc-kn1ght`
> would be entirely fine. In general sticking with codenames would be better imo than using actual names, and
> there's always the alias system to allow users to type sensible ones as the engine can handle converting
> `hc-knight` into the `hc-kn1ght` tag

Done 2026-09-14: see CATCH-UP, "Codenames".

> 2a. Do a check of images against existing WEBUI rules against a simple white background.
> Correct or disable any rules which would remove character details.
> Add any missing character or clothing tags as needed to appropriate categories/libraries.

Done 2026-09-14 with `refs-census.js`: see CATCH-UP, "Step 2a".

> 3. Add each character and their default outfit to the character database in
>    scripts/webui/libraries/charactersDB.js. To do this, we'll need to separate out just the character and
>    clothing tags (which the webui engine can do, just be wary if some tags are uncategorized). This step
>    would be tested by generating the same image we pulled the character and outfit details from, removing
>    the character and clothing tags, inserting our shortcut and `default`, and testing if we get the same
>    image back.

Done 2026-09-14, tested on compiled text: every `-a` matches (`refs-roundtrip.js`). See CATCH-UP, session 4.

> 4. Identify patterns of differences between different poses. For instance, the difference between most `-a`
>    and `-b`images is they're usually covering their body and embarrassed.

Done 2026-09-14: `POSES-01.md`, "Patterns".

> 5. Create rule templates for each different pose, test by generating some of the poses characters are
>    missing, there's quite a lot of them.

> In general, my advice when you start trying to make templates is: Start with the 1V-a version of the character,
> comparing to 1C-a for male/female differences in the base outfit, then go down trees comparing and isolate
> differences between similar versions. Extrapolate whatever intent you can to obtain templates, asking yourself "what
> was Noodle's goal here, and what tags seem to be meant to achieve that goal?"

> Future steps will be easier if you also try and ascertain character traits at this stage rather than waiting until
> step 7, and leave general (but not overwhelming) advice for future agents. Knowing Brienne is a knight and Clement is
> a priest will definitely color how those characters will be prompted differently for attacking and defending.

Done 2026-09-14: `pose-templates.js` + `POSES-01.md` (the cast, templates, test generations, advice).

> 6. Create rules in cleaningDB that transform simple shortcut inputs which will apply our templates to the
>    images, and test generate all missing images to get their prompts.

Done 2026-09-14: `refs-shortcuts.js` + the generated rules in `cleaningDB.js` / `charactersDB.js`; every missing
slot is compiled through the shortcut in `MISSING-PROMPTS.md`. 119/132 slots are identical to the template input;
the 13 that differ are the insertion gate's exclusivity, listed by `refs-shortcuts.js` for step 7.

> 7. Manually identify inconsistencies (blindfolded, but has 'wide-eyed', for instance). I'll leave this matter up to your judgement and come in afterwards to make changes, do your best to intuit what doesn't make sense (ie blindfolded does block eye tags, but `seer` has `blindfold over one eye`, suggesting the other eye is uncovered, and it's fine for her to have 'wide-eyed')

> 8. Split the inconsistencies into systematic (we want to change it because it doesn't make sense in general)
>    and individual (it makes sense for this character or outfit specifically to change this rule)

> 9. Create rules in cleaningDB that make apply our systematic exceptions, as well as our individual exceptions
>    on a per-character basis. The goal here is to capture the vibes and energy of each character.

> 10. Perform an actual run generating the images we desire. We may take longer on this phase than expected as
>     we'll need to figure out how to send a controlnet Reference command over the webui engine at timestep
>     ranges of 0-0.7, as that's the only way I've been able to get character details consistent so far.

Measured 2026-09-14: Forge exposes ControlNet over the API with `reference_only`. See CATCH-UP, "Measured".

> 11. Finally, I'll take the resulting images from my Beef PC that my WEBUI engine sends requests to, copy them
>     into a folder after removing backgrounds, where you'll then create a script to inject these new images
>     into the game.

Game paths and fallback are in `!designDocs/honeycomb/reference/ART-GUIDE.md` §1 and §5.

## Scope and working notes

> I don't think step 1 is something we'll get much value out of scripting, you checking the sidecars by hand
> should be feasible since there's only 35 right now. However I would like to leave the foundations for doing
> this exact project again in the future with future characters.

Everything built here must be rerunnable on a new character dropped into `refsPNG/` with no edits beyond
table entries.

> One issue I expect to bump into is the webui engine's large list of existing rules. Hopefully it doesn't
> cause you too much trouble when we need to remove rules or work around them when they start throwing
> trouble. Another potential issue is the lack of images so far, there's only 2 `support` poses right now.

A dictionary edit is a behaviour change for every engine user, Syrup Town included: run
`scripts/webui/tools/webui2-test.js` after any edit, and a moved `pipeline()` test is a question for Noodle.

> With all that said, let's *actually* begin by recording down all of my instructions, then I'd like you to do
> a feasibility analysis of this project's steps, like if there's a smarter way of doing one that I'm not
> seeing. For right now, we'll defer alternate costumes and enemies.

**Deferred: alternate outfits and enemies** (`refsPNG/enemies/` holds 10 sidecars that are out of scope).

---

## Round 2 rulings (2026-09-14, Noodle's answers to FEASIBILITY)

These override FEASIBILITY.md wherever the two disagree; the overruled passages were moved to the bottom of
that file.

> -b vs -exposed: Yes, different images. I generated damaged sprites for the whole cast and realized later that
> the exposed cut-ins should be different from standing damaged ones. We will need damaged versions of most
> poses as well, so we'll need to isolate what constitutes 'damaged' for each character's default outfit.

"Damaged" is a per-outfit definition, learned from each character's `-b` / `-exposed` pair. The filename for
a damaged action pose is still open (CATCH-UP, open questions).

> LoRAs: No the character loras are not yet trained, but I will train them later. Don't worry about it for
> now, controlnet's reference tool will help bridge that gap.

Codenames (step 2) are still made now, ready for training. The cleaned sidecars are the future captions.

> Male versions in the game: I'll consider that matter later. This art pass should aim to reveal many of the
> issues involved with including male variants in terms of rewriting prompts, many systemic errors will come
> down to accounting for male versions of the cast. But if it proves to be viable to account for male versions
> in the long run, I'll add them to the game proper. Male images will stay in the same folder using the C
> letter. We'll just have to wing it when it comes to accounting for gendered differences.

C output is generated and kept, but it is not injected into the game. The C prompts are the test bed for the
engine's gender handling.

> "One small script covers steps 1, 3 and 4." - Glad to hear it, though there's still the matter of manual
> review involved. Looking at the prompt and saying "yeah, that makes sense" or "no, I should change that" is
> going to come down to vibes, which is why I have you on Opus for it.

The script lists; **the agent does the first judgement pass** and brings Noodle its verdicts, not raw lists.

> "Test step 3 by comparing prompt text, not images. The engine reorders tags and SD cares about order, so the
> raw sidecar isn't a fair baseline." - Actually, I sort and do last-stage cleaning on my images before
> training models, so the re-ordered tags will actually match the images better. But yes you are right, we
> should be comparing prompt text to find differences. It's also a good opportunity to correct webui engine
> issues like "flaming skull" being categorized as a background element, thus culled by simple background.

Compare compiled prompt text. **A difference the engine causes is an engine bug to fix, not something to
route around.**

> "Split each character into four layers, not two" - I disagree. Genderswaping is an underdeveloped part of
> the engine and this is a good opportunity to improve it and give it practical real work tests. Most of our
> systemic error correction rules may be applicable to normal use cases anyways.

Two layers (character, outfit) as the brief says. C/V differences go to **improving the engine's gender
swap**, and systemic fixes are expected to belong in the global dictionaries.

> "It also kept spiral eyes and glowing eyes next to the blindfold" - Skull's blindfold is only over one eye.

> "Put per-character exceptions on the character's own entry in charactersDB, not in cleaningDB" - Yes, good
> idea.

> "Build the ControlNet batch runner before testing pose templates" - No, in my testing I have found that using
> the basic -a image as reference is enough to get details right. Thus we can generate `lancer1V-broken` via
> `lancer1V-a`.

**The ControlNet reference for any slot is that character and gender's `-a`.** No chained references.

> `Torn clothes is the hardest part` - It will be easier than you think, but it should be made a little easier
> by already having full sets of `-b`/`-exposed` images already, which should already have the
> `torn <garment>` tags we'll need. The actual hardest part I think will be you trying to intuit how to do each
> pose. For defense, for example, Nettle as a mage uses a magic shield, whereas Vex just blocks with her arms.
> That's the sort of intuiting I'll need you to do as we move forward.

**The real work is per-character pose interpretation**: the template gives the shape ("defense"), and each
character's entry says how *they* do it (Nettle: magic shield; the vampire: arms).

> `The simplest fix is a torn version of each outfit written into the character's entry` That would double the
> outfit size list and introduce redundant code when outfits can already have their own replacement rules

Damage goes in **the outfit's own replacement rules**, never a duplicate outfit.

> I fixed Vex's support and defense images. Also, since we're about to embark on such a big thing, we really
> should rename her, it was a placeholder name and the LoL vex is very popular in my community. Update the
> above rules and then give suggestions for a new name for our vampire.

Name suggestions and the rename's cost are in CATCH-UP. Nothing renamed until Noodle picks.

---

## Round 3 notes (2026-09-14)

> Great work. Your question on damaged poses made me realize I didn't leave space for those. I've renamed the images to
> better allow for the damaged variants to slot in, since it's best to be able to compare undamaged vs damaged variants
> side-by-side to make sure none of the detail got lost. I'm hoping I didn't misname anything. I have a few notes for you
> with what remains of our context window:

> * I've just added the Honeycomb style to the styles list, please use that when sending requests to stable diffusion.
>   Eventually I'll have the trained lora in it, but for now it's a mix of other styles that currently work for my needs.
> * Timestep range should be 0.7 to 1.0, always.
> * Style fidelity should be at 0.5, when left out I think controlnet defaults to 1.0, which doesn't look good.

> * If I should forget or change a character keyword, please have the pose-building script append that keyword to the
>   images. For instance, Severine is meant to have grey hair. I've added that to charactersDB.
> * Defense is not a character using a defensive skill or dodging the attack, it is when an attack hits them.
> * Avoid mentions of blood and gore in all cases please.

Applied: files are `<char>1<V|C>-<pose>-<a|b>` (`-a` undamaged, `-b` damaged; `exposed` unsuffixed); all 35 checked,
none misnamed. `refs-generate.js` defaults to style `Honeycomb`, reference 0.7–1.0, style fidelity (`threshold_a`) 0.5.
`pose-templates.js --sync` appends entry and outfit keywords a sidecar lacks. Defense templates are reactions to a hit.
Blood removed from every template and doc.
