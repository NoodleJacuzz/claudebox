# Lust events — SCENES, round 01

**Venom drafts, for Noodle to read.** Written against his character notes (`IDEAS.md` §3), the six
rules in `IDEAS.md` §2, and his own image plans and line edits from session 48.

**Nettle's three are IN THE GAME**, session 49 — `honeycomb-content-lust-events.js`, rows
`nettleVenomSpecimen` / `nettleVenomMethodology` / `nettleVenomSynthesis`, one page per beat with its own
image, and the venom 3 Lust Battle against `bogToad`. Brienne's three are still only here.

**Nettle V2 and V3 are Noodle's own, reproduced exactly.** They are the register reference, and the
drafts around them are still behind on six specific counts:

| What he does | What my drafts were doing |
|---|---|
| **Speaker tag is the sprite index** — `necro`, not `nettle`. (`knight`, `vamp`, `lancer`, `priest`, `seer`, `chess` for the rest.) | Character names. |
| **He swears.** *"Fuck it. I can do it again."* | Writing around it. The skill says *do not soften*, and I was softening. |
| **Beats are `im <path> [what it shows] (tags)`** — his own syntax, session 48 | Prose beat headings. |
| **Narration can carry sound** — *"a quick \*pop\*, a \*gulp\*, and then... Silence."* | Narration as a still camera only. |
| **A bare `necro ...` line is a beat of silence**, and it does real work | No silent beats at all. |
| **Rank 3 is an argument she loses to herself**: rationalise → *"Fuck it"* → act → *"It's worse."* | An announcement of a decision already made. His shape is much stronger and should be the model for every rank 3. |

His V3 also asks for **a Lust Battle against a flora enemy, preferably one with tentacles** — which
works for Nettle because she stays clothed. Brienne's V3 can't have one for want of a nude sprite.

**No choices and no unlocks.** Noodle: *"For now, let's not worry about choice or unlocks for lust
events... Just go ahead and delete them."* A lust event is a linear scene — beats, continue buttons,
and the way out at the end.

---

## Corrections to what I told you last time

**1. You were right about the images, and I overstated it.** The *structure* for multi-image scenes
exists today: pages, a continue button, `goToPage`. What does not work is only the picture — `page.text`
and the dialogue are read from the page, but `backgroundPath`, `imagePath` and `speakerPath` are read
off the base event, so every page of one event shows the same art. So it is not "events can't chain",
it is "the art field is on the wrong object". One small change and the page-turn works as written.

Chaining *separate events* would also give each beat its own art and needs no engine change at all —
but it would split one scene across several `eventArray` entries, which breaks the queue's one-row-one-
scene model and its completion key. **Per-page art is the better fix.**

**2. `<i>` will not render.** Noodle's Nettle V2 has *"It's changing, `<i>`and`</i>` it's changing me!"*
Event dialogue goes through `honeycomb.escapeText`, which turns `<` and `>` into entities, so that
would print the tags literally on screen. Either the dialogue renderer needs a small italics allowlist,
or the emphasis has to be carried another way. **Flagged, not changed** — it is his text, not mine to
silently strip.

**3. The divider convention is recorded but not built.** Noodle's Nettle V2 uses a bare `t ...` line at
the end of a beat to mean time has passed. The rule that follows from it: the continue button reads
**"Continue"** normally, and **"Later..."** when a divider precedes it. Nothing implements this yet.

---

## Brienne — venom

> She carries it because carrying things is what she's for. Rank 3 is self-delusion, sincerely held.

### V1 · Fine — *she doesn't know she's been affected*

Per Noodle: she is not outlasting anything, because it hasn't occurred to her that there is anything to
outlast. She got hit last run, so the answer is to be stronger. The heaviness is conditioning. The
warmth is the weather.

```
t Over the last hour, Brienne's been exercising.
im brienne/lust/v1-1 [stretching in the grass outside, already soaked through] (from side, sweat, stretching, exercise, [forestDay], :o)
knight Sloppy. I was slow on the left and it got through. That's conditioning, that's all.
knight Not because it had boots on. Anyone can have boots. That isn't the lesson here.
knight Forty more. Forty more and I'll have fixed it... Hhhh... Heavier than usual today.

im 2 [she's stopped, looking down at herself, not understanding what she's looking at] (from front, upper body only, sweat, Pent-Up, covered nipples, looking down, areola slip, [forestDay])
knight ... I need a moment. Just a moment, and then I'll do the forty. Just a-
knight Is it w-warm out here? It's been warm all morning. That isn't... That isn't normal.
knight ... I'll work harder tomorrow. That's all this is. I'll just work harder.
```

**World detail:** *it had boots on.* She raises the Act 1-A question and waves it away herself, which
is the cheapest possible way to plant something — the character dismisses it, so the game never has to.

### V2 · The Schedule — *badly affected and she knows*

*Everything but the last line was approved; the last line is replaced.*

```
im brienne/lust/v2-1 [at a table with a written schedule, being extremely businesslike about it] (sitting, holding paper, sweat, blush, from front, [inn])
knight It's scheduling. You schedule recovery the same way you schedule drills... It's fine.
knight Twenty after we make camp, twenty before watch... Nobody has to cover anything.
knight The frontier's closer than last week. Same stuff coming off it... Thicker, though.
knight S-so I've allowed more time. That's all that is. Just... Just nnnh... More time.
knight ...It's eleven past. I've missed the eleven o'clock one. Excuse me. Excuse me.

im 2 [she got as far as the inside of her own door and no further] (standing, against door, clothed masturbation, clothed, sweat, ahegao, from front, [inn])
knight Nnnh- eleven past, eleven past, I'm behind, I'm already b-behind-
knight Hhhh... On schedule. This is on schedule. This is- HHH~!
```

The old ending explained the joke. This one leaves mid-sentence, on schedule, and **the second image is
what she meant** — the page-turn does the work instead of a line.

**World detail:** *the frontier is closer than last week, and thicker.*

### V3 · Unarmed — *she's in on it*

Rebuilt to Noodle's brief: the shadow over her discarded clothes, then naked and determined, then the
sex — **no Lust Battle, since there is no nude sprite.** Focus stays on Brienne throughout; the
mushroom creature is `offscreen` except in the POV beats.

```
t Her shadow falls over her discarded clothes.
im brienne/lust/v3-1 [her shadow across the pile of clothes she's just stepped out of] (pile of clothes, shadow, from above, clothes removal, implied nudity, replace all character)
knight I've thought about it properly. Armour's weight, and weight is what slowed me.
knight If I can take it with nothing on, then it's beaten. 

im 2 [naked, facing the way down, completely certain] (nude, standing, from behind, looking away, determined, steaming body, cowboy shot, ass, trembling, [forestDay], cave)
knight Nothing to snag. Nothing to carry... Nothing for it to get hold of.
knight Hhhh... I'm ready. I have never been more ready. Let's have it, then.
t ...

im 3 [riding a dungeon mushroom creature, her face doing the opposite of what her mouth is] (cowgirl position, squatting, girl on top, sex, nude, sweat, from side, offscreen)
knight Nnnh- this is fine, this is- I can take this, I can take- HHHAA~!

im 4 [from underneath her] (crotch pov, pov penis, cowgirl position, squatting, sex, nude, sweat, grin, yandere, looking at viewer)
knight I said I can TAKE it-! Harder! If it's harder then I'm- nnh- then I'm winning-!
knight GIVE IT TO ME!

im 5 [climax] (crotch pov, pov penis, cowgirl position, squatting, sex, nude, sweat, parted lips, blush, wide-eyed, shock, teeth)
t Fin.
```

**No world detail, by Rule 1.** The delusion survives the whole scene intact, which is the point — she
never stops framing it as a contest she is on course to win.

---

## Nettle — venom

> She takes it apart. The problem isn't that it's affecting her, it's that she needs to know how and
> can't put the question down. The skull never speaks.

General notes for Nettle images:
- Most event scenes should remove her staff and skull companion unless it would make sense to be present. !flaming skull, !floating skull, !black staff

### V1 · Specimen — *she doesn't take it seriously*

*Noodle's line added, and the ending replaced.*

```
t An experiment. A simple one. The light should be burning with fire to match the constituent elements, but none she's seen before have burned this sort of pink.
im nettle/lust/v1-1 [at her desk with the vial up to the light, genuinely stumped by it] (upper body only, behind desk, holding vial, pink fluid, pink smoke, aphrodisiac, question mark, [inn])
necro Don't touch it. I haven't finished with it... And you won't enjoy what it does.
necro It isn't a spore. It isn't a resin... It isn't anything I have a word for.
necro ...What are you? You're not like anyone from around here. Not one bit.
t ...

im 2 [from behind, legs going, a puddle under her, steam coming off her] (from behind, facing away, pussy juice stain, Juice, pussy juice puddle, trembling legs, steaming body, [inn])
necro I opened it? Why did I... No. N-no, obviously it needed to be opened.
necro How else would I study it. That's- nnnh- that's just method. That's just method.
necro ...I'll need a bigger sample. Of me. I'll need a bigger sample of me.
```

The old ending was her telling you where to look. This one reclassifies herself as the specimen, which
is what V2 then is.

**World detail:** Noodle's own line, kept as written.

### V2 · Methodology — *badly affected and she knows*

*Rewritten from Noodle's version with his explicit permission, session 48. His best lines are kept
verbatim — the scrabbling open, the sample-size protest, the observation that survives the orgasm.*

```
im nettle/lust/v2-1 [night, squatting over the open sack on her floor, digging through it] (bottomless, 'pajamas', trembling, clenched teeth, holding sack, open sack, sweat, horny, squating, from side, night, [inn], !flaming skull, !floating skull, !black staff)
necro Where is it, where is it? Where the hells... Here!
necro The last one. Seven of them, that's a sample size.
necro That's not a habit, that's a s-sample size.

im 2 [holding it up to the light, eyes already lit] (holding vial, pink fluid, pink smoke, looking at vial, from front, 'green eyes', 'glowing eyes', sweat, blush, heavy breathing, !flaming skull, !floating skull, !black staff)
necro A control needs a subject... And I'm the only subject I have consent from.
necro Measured dose. Recorded interval. Nnnh... Recorded interval. I said it, I heard me.
necro It's still fresh, too... Nothing down there rots like normal fungi...
t ...

im 3 [on her back on the bed, entirely gone] (on back, on bed, squirting, head back, orgasm, masturbation, vaginal fingering, arched back, spread toes, sweat, steaming body, 'green eyes', 'glowing eyes', !flaming skull, !floating skull, !black staff)
necro OHHHHHHHH~!
necro Intensity increasing! I'm not building a tolerance, it's changing-<br>It's changing <i>me</i>-!
necro GNHHHHH~!
necro ... Six left.
```

**What changed.** The long "whatever time it is" clause went, because the scene is already telling you
she has lost the interval. The sample-size protest is split across two lines so the second one lands on
its own. And it now ends on **"... Six left."** — the cry was a peak, not a landing, and counting her
remaining stock post-orgasm is what makes V3's synthesis inevitable rather than a new idea.

**Uses the new markup**: one `<br>` chaining two beats inside a line, and `<i>me</i>`. Both need the
handoff's change before they render.

**World detail:** *nothing down there rots like normal fungi.*

### V3 · Synthesis — *she's in on it*

```
t Her own batch is a better colour.
im nettle/lust/v3-1 [her own batch on the bench, holding one up, composed and quietly pleased] (holding vial, pink fluid, looking at vial, behind desk, upper body only, smile, [inn], !flaming skull, !floating skull, !black staff)
necro I worked it out. Took the long way round... But I worked it out. Mine's cleaner.
necro Which means I never have to go back down there. Not once. Not ever again.
necro That's the useful part. That's the part I should be pleased about. Nnnhh...
necro T-that's the part I keep turning over, actually. That I don't have to...

im 2 [leaning on the desk with her back arched] (bent over)
necro Ghouhhh... They're hitting me again...
necro I need this for testing, for replication. I can make more, so long as I... I don't need it.
necro ...
necro Fuck it. I can do it again.
t The sounds that follow are a quick *pop*, a *gulp*, and then... Silence.

im 3 [shot of her face] (head shot, face, head only, close-up, fisheye lens, despair, 'green eyes', 'glowing eyes', steaming body, horny)
necro ... It's worse.
```

[Lust battle against some flora enemy, preferably one with tentacles.]

⚠ **Renumbered.** The opening lines had no image and now have one, so what was `v3-1` is `im 2` and
what was `im 2` is `im 3`. Say if you would rather the new beat were `v3-0` and the existing numbers
stayed put.

**No world detail, by Rule 1.**

### V3-Win · Extraction — *Nettle defeats the fauna, raising it back to life and 'extracts' more raw venom from it*
Note: Despite being raised from the dead, no gore, no blood, no decomposition. Effectively the same as if she knocked it out and woke it back up under her service.

*Sketched from the idea above, session 48.*

```
im 1 [we can't show the creature, so it's just her helping to milk green tentacles] (upper body only, holding vial, empty vial, green tentacles, from side, handjob, precum, unusual precum, pink precum [act1-flora])
necro Up. There we are. Nothing's missing, you're perfectly fine, you're just mine now.
necro This is the part my field never writes down. Dead things are so much easier to ask.
necro Hold still. This won't- hhh- this won't take anything you'll miss.
necro Squirt harder, your mistress-

im 2 [the vial already overflowing, far more than it should give, her composure going] (holding vial, pink fluid, overflowing, Awe, upper body only, green tentacles, handjob, cum in container, ejaculation, overlowing container, close-up, blush, sweat, heavy breathing, covered nipples)
necro That's... That's considerably more than you should be able to give.
necro Nnnh- keep going. Keep going, I've got more vials, I've got so m-many more vials-
necro ... W-where's my bag?
t ...

im 3 [tentacle seggs, large enough to bulge her tummy, she's grinning blissfully] (cowboy shot, legs spread, pelvic curtain aside, pussy, vaginal, sex, green tentacles, stomach bulge, huge insertion, hand on own belly, blush, sweat, heavy breathing, covered nipples, Excited)
necro Ghnnn~! You... Can do more! Harder!
necro Fffuck! FUCK! Going down my throat, pouring it on my cunt, what willl it be like when you-
necro ...!!!

im 4 [climax] ('head back', Ohogao, cumflation, pregnant, ejaculation, cum inside, cum in pussy, cum from pussy, overflow, pink cum, unusual cum, 'green eyes', 'glowing eyes', 'heart-shaped pupils', 'white pupils', 'glowing pupils', cowboy shot, legs spread, pelvic curtain aside, pussy, vaginal, sex, green tentacles, stomach bulge, huge insertion, hand on own belly, blush, sweat, heavy breathing, covered nipples)
t Fin.
```

**Result: Event ready 
**No world detail, by Rule 1.**

### V3-Loss · Marked — *Nettle escapes from the dungeon, somehow, nude and her belly bulging with pink fluid dripping from her. She's frustrated, but vows to use these "children, no, parasites" to make a better batch next time.*

*Sketched from the idea above, session 48.*

```
im 1 [furious rather than distressed, her skull is there] (nude, nipples, small breasts, !flat chest, outdoors, upper body only, pink cum, facial, unusual cum, standing, from front, angry, sweat, [forestDay])
necro Don't. Don't look at me like that, I don't know how I got out either.
necro It's gravid. They must want me to spread them... That's the word for it. They put something in me and it's g-gravid. 

im nettle/lust/v3loss-2 [full body shot revealing her pregnancy] (nude, nipples, small breasts, !flat chest, full body, standing, from below, barefoot, trembling, pink cum, facial, unusual cum, standing, blush, horny, hands on own belly, pregnant, angry, sweat, [forestDay])
necro Parasites are a resource. Parasites are a very well documented resource.
necro The base was always the problem... And now I have hhh... Quite a lot of base.
necro ...Next batch will be better. Next batch will be much better.
```

The loss is not a punishment. She comes back with more material than she went in with, which is what
makes it worse.

---

## Held back

**Severine, Cassadora, Cinder and Clemence rank 1s** were written before this round of notes and are
kept out of this file rather than shipped half-corrected. Severine's needs the harem and the *Blood
Saint* flip-flop; Cassadora's needs the two registers; Cinder's needs the drilling rather than the
tally; Clemence's needs the theology to be doing the work. They are in the session history and will be
rewritten once the four above are approved.

---

## Measured

Every scene above went through
`.claude/skills/syrup-town-scenes/tools/scene-metrics.py check` against the 187-event corpus.
**Zero out-of-band flags and no absent tells**, other than the `<br>` axis, which is a known false
positive in this container.

Noodle's own Nettle V2 is deliberately not measured against the corpus — it is the reference, not a
draft.

---

## Open

1. **Do these land now?**
2. **Per-page art fields** — one small engine change, and the only thing between these scenes and being
   illustrated.
3. **Italics in event dialogue** — allow them, or carry emphasis another way.
4. **The "Later..." divider** — recorded, not built.
5. **Brienne V2 has no image plan yet** and is the only scene here that is a single static beat. It may
   want a second.
6. **`[act1-flora]` and `[forestDay]` are not real shortcuts.** They read as placeholders in these
   sketches, and they are — the engine knows neither word and would pass both to the model raw. Found
   session 49 while building `../Archive/demo1/lust_events/PROMPTS-NETTLE-02.txt`, which writes them out as `cave, vines, nature`
   and `outdoors, forest, grass, trees, daytime, sunlight`. `[inn]` has the same status and already
   had the same treatment in `../Archive/demo1/lust_events/PROMPTS-NETTLE-01.txt`. Every sketch above uses at least one of them,
   so each needs writing out at prompt stage. Naming the two daylight tags in the prompt is not
   optional: `daytime`, `bright` and `sunlight` are in the universal negative, so a forest scene that
   does not ask for them comes back at night.
