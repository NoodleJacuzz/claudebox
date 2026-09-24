// ============================================================================
//  negativeDB — contextual negatives
// ============================================================================
//
//  What to put in the NEGATIVE prompt because of what is in the positive one.
//  `squirting` in the prompt means `blue fluid` in the negative: the model's
//  habits, written down.
//
//  This replaces `basicNegativeArray`, which was 24 two-column pairs living in
//  webui.js. Same job, room to grow — the format below is deliberately the SAME
//  GRAMMAR as defaultDB.js so a much larger dictionary can be pasted in without
//  anybody learning a second syntax or touching any code.
//
//  ---------------------------------------------------------------------------
//  Format
//  ---------------------------------------------------------------------------
//
//      requirement, requirement; negative, negative [exception, exception]
//
//    requirements   ALL must be present in the prompt for the line to fire.
//    negatives      what gets added to the negative prompt.
//    exceptions     ANY one of these present cancels the line. Optional, and
//                   the thing basicNegativeArray could not express at all.
//
//  A requirement or exception is read through `isPresent()`, so it may be:
//
//      plain text     matched equivalence-aware, the ordinary case
//      "quoted"       a SUBSTRING — "tentacle" matches "veiny tentacle"
//      categoryName   a v1 category, strict camelCase: bodyTail, sceneCamera
//
//  Lines starting with `-` are comments and section headers, exactly as in
//  defaultDB. Blank lines are ignored.
//
//  ---------------------------------------------------------------------------
//  Rules of behavior for negatives
//  ---------------------------------------------------------------------------
//
//  0. Formatting is `text to check prompt for; negative to add [exceptions]`
//
//  1. A negative that the PROMPT asks for is dropped at assembly. Writing
//     `clitoris; small clitoris` is safe even in a prompt that wants a small
//     clitoris — Phase 7 clears it. You do not have to hedge here.
//
//  2. Negatives are IMAGE-WIDE (Rule 11). There is no per-figure negative, so a
//     requirement that is true of one character in a duo still fires for the
//     whole image. That is correct and is why the character lines below are
//     phrased as "this character's colouring is often wrong", not as a
//     description of her.
//
//   3. Empty left side is ok, it means add without any requirements.
// ============================================================================

var negativeArrayOLD = `
-/ Characters — colours and features the model habitually gets wrong
sy-angelica; countershading, light countershading, white fur, black eyebrows
sy-carp; eye mask
sy-shop; countershading, light countershading, white fur, medium hair, long hair
sy-nun; black ears, black nose, blue nose, blue inner ears
sy-doe; light orbital pattern
animal crossing; 5 fingers, too many fingers

-/ Framing and lighting
simple background; shadow, messy hair, stray hairs
dimly lit; bright, daytime

-/ Points of view — keeping the implied partner off-model
cute pov; larger male, older male, taller male, masculine male, overweight male
crotch pov; older male, larger male, masculine male, muscular male, overweight male
pov hand; older male, larger male, masculine male, muscular male, overweight male

-/ Mutually exclusive acts
in ass out mouth; in mouth out ass
in mouth out ass; in ass out mouth
solo, erection; flaccid

-/ Size — asking for one end of a scale means refusing the other
large penetration; small penetration
huge penetration; small penetration
big anus; small anus
huge anus; small anus
clitoris; small clitoris
large clitoris; small clitoris

-/ Miscellaneous
squirting; blue fluid, colored fluid
animate inanimate; robot joints, eyelashes
`;

var negativeArray = `
-/ Sorted roughly by categories and importance (lower weight towards the end)

-/ Human-anthro separation
not furry; anthro, furry female, furry male, body fur, animal nose, black nose, paws [human on anthro, anthro on human, anthro pov, furry pov]
not furry; fur [(color) fur, "furry "]
not furry; 4 fingers [fewer digits, chibi]
not furry; 4 toes [fewer digits, chibi]

-/ Darker skin protection
tan skin; light skin, light-skinned male, light-skinned female
tan-skinned male; light-skinned male
tan-skinned female; light-skinned female
brown skin; light skin, light-skinned male, light-skinned female
dark skin; light skin, light-skinned male, light-skinned female
dark-skinned male; light-skinned male
dark-skinned female; light-skinned female
pale skin; blue skin

-/ Generic furry
monotone body; countershading ["countershading"]
monotone body; white countershading ["countershading"]
monotone body; light countershading ["countershading"]
monotone body; tan countershading ["countershading"]
monotone body; fur pattern
monotone body; striped fur
monotone body; spotted fur
paws; dark paws, black paws, brown paws [dark paws, black paws, brown paws]
paws; light paws, white paws [light paws, white paws]
animal crossing; 5 fingers, too many fingers [human on anthro, human male, human female, human on feral]
anthro; whiskers ["whiskers"]
feral; whiskers ["whiskers"]

-/ Character specific features
sy-angelica; white muzzle, light muzzle, light orbital pattern
sy-angelica; white fur, red fur
sy-angelica; red nipples
sy-angelica; blue paws
sy-angelica; black eyebrows
sy-carp; eye mask
sy-shop; kitchen
sy-shop; print apron, heart print, heart-print apron [valentine, valentines, valentines day, heart print apron, heart print]
fox; facial pattern, tribal markings, facial markings, black markings [facial pattern, "tattoo", tribal, tribal markings, facial markings, "markings"]
sy-wolf; forehead marking
sy-wolf; light orbital pattern
sy-wolf; futanari
sy-sado; angry [fury]
sy-sado; heart choker
sy-sado; neck bell
sy-sado; yellow sclera
sy-sado; futanari
sy-milf; light orbital pattern
sy-milf; yellow eyeshadow
sy-milf; futanari
sy-nun; cross, cross necklace, necklace, cross symbol, cross (symbol)
sy-nun; futanari
sy-nun; church
sy-mesu; brown fur, brown markings, brown tail
sy-mesu; purple fur, purple markings, purple tail
sy-fash; green eyes
sy-fash; pink paws
sy-hyena; red nipples
sy-hyena; blue hair, blue inner hair, colored inner hair, hair streak, colored hair streak, blue hair streak
sy-foxf; futanari
sy-sphinx; black eyes, red eyes, eyes
sy-sphinx; red gem
sy-sphinx; usekh collar
sy-deity; pink markings, pink tattoo, red anus, pink anus
sy-deity, feral; nipples, red nipples, bipedal, cute boy, femboy, 1boy, 1girl
ghost horns; cow horns, curved horns
dazzi ignis; ponytail, red balls
dazzi aqua; ponytail, short hair, bangs
dazzi botan; ponytail, long hair
hc-kn1ght; light skin, pale skin, light-skinned female, thighhighs, bare legs, hip vent

-/ Particular bodytypes
quadrupedal; bipedal
ghost tail; bipedal
legless; bipedal, legs, standing
no legs; bipedal, legs, standing
no mouth; open mouth
no mouth; parted lips
no mouth; smile
no mouth; frown
gold body; gold-skinned male
flat chest; breasts
petite; plump
plump; petite
tall; shortstack
very tall; shortstack
shortstack; tall, very tall [tall, very tall]
animate inanimate; robot joints, black joints, eyelashes
plushie; robot joints, black joints, doll joints
solid oval eyes; white sclera, sclera
mob eyes; white sclera, sclera
eyeless; eyes, sclera, white sclera
no eyes; eyes, sclera, white sclera

-/ partners
futa on male; pussy, cleft of venus, peach pussy, clitoris, clitoral hood
futa on male; vaginal
futa on male; vaginal sex
femboy; manly, masculine, manly male, masculine male, older male, larger male, muscular male, ugly man, overweight male
cute boy; manly, masculine, manly male, masculine male, older male, larger male, muscular male, ugly man, overweight male
cute pov; manly, masculine, manly male, masculine male, older male, larger male, muscular male, ugly man, overweight male
pov penis; pov small penis
pov penis; small penis
mother and son; siblings, twins
mother and daughter; siblings, twins

-/ Urethral
urethral bulge; urethral penetration ["in penis", sounding, urethral beads, urethral insertion]
urethral penetration; urethral insertion
urethral bulge; urethral insertion ["in penis", sounding, urethral beads, urethral penetration]
urethral insertion; urethral penetration
urethral bulge; stomach bulge

-/ Gaze
looking down; looking at viewer [from below, looking down at viewer]
looking up; looking at viewer [from above, looking up at viewer]
looking at penis; looking at viewer [crotch pov, pov penis]
looking at another; looking at viewer
looking forward; looking at viewer
rolling eyes; looking at viewer
cross-eyed; looking at viewer
cross-eyed; rolling eyes
cross-eyed; cross, cross necklace, necklace, cross symbol, cross (symbol)
facing away; looking back
facing away; looking at viewer
facing down; looking back
facing down; looking at viewer
from behind; from front
from behind; angled view
from front; from behind
from front; angled view
from side; from front, straight-on [straight-on, straight on, from front]
from side; from behind, ass focus, rear view
from side; angled view
female focus; male focus
female focus; futanari
full body; cowboy shot

-/ Camera culling
head out of frame; hair
lower body only; hair
upper body only; pants, bottomwear

-/ Expressionless
kuudere; smile
kuudere; frown
kuudere; blush ["blush"]
kuudere; sweat ["sweat"]
emotionless; smile
emotionless; frown
emotionless; blush ["blush"]
emotionless; sweat ["sweat"]
expressionless; smile
expressionless; frown
emotionless; blush ["blush"]
emotionless; sweat ["sweat"]

-/ Posture
floating; standing
flying; standing
sitting; standing
legs spread; legs together
bowlegged; legs together
standing; lying
standing; on back
on back; on stomach
on back; on side
on side; on stomach
on side; on back
on stomach; on back
on stomach; on side
lying; pillow, ["pillow"]
lying; white pillow

-/ Anal
anal; vaginal ["vaginal"]
anal sex; vaginal sex
after anal; after vaginal
cum in ass; cum in pussy
cum from ass; cum from pussy
internal anal; internal vaginal
internal anal; womb
gaping anus; gaping pussy
spread anus; spread pussy
spreading anus; spreading pussy
anal prolapse; vaginal prolapse
anal tugging; puckered anus
big anus; small anus

-/ Vaginal
vaginal; anal ["anal"]
vaginal sex; anal sex
after vaginal; after anal
cum in pussy; cum in ass
cum from pussy; cum from ass
internal vaginal; internal anal
internal vaginal; womb
gaping pussy; gaping anus
spread pussy; spread anus
spreading pussy; spreading anus
vaginal prolapse; anal prolapse
vaginal; peach pussy
cleft of venus; plump labia
plump labia; cleft of venus
peach pussy; clitoris ["clito"]
clitoris; small clitoris
large clitoris; small clitoris
huge clitoris; small clitoris
erect clitoris; small clitoris

-/ Sex helpers
large insertion; small insertion
huge insertion; small insertion
stomach bulge; small insertion
precum; cum [excessive cum, cum inside, overflow, "cum on", facial]
pussy juice; cum [excessive cum, cum inside, overflow, "cum on", facial]

-/ Backgrounds
indoors; outdoors
outdoors; indoors
dark background; sky, blue sky, night sky, starry sky, moon, crescent moon, bright, full moon
animal focus; anthro, 1girl, 1boy

-/ Genitals
cetacean penis; canine penis, knot, equine penis, humanoid penis, glans, foreskin
tapering penis; canine penis, knot, equine penis, humanoid penis, glans, foreskin
porcine penis; canine penis, knot, equine penis, humanoid penis, glans, foreskin
unusual penis; canine penis, knot, equine penis, humanoid penis, glans, foreskin
backsack; pussy ["vaginal", peach pussy, cleft of venus, big pussy, plump labia, clitoris]
erection; flaccid, flaccid penis [flaccid, flaccid penis]
erection; half-erect
flaccid; erection, erect penis [erection, erect penis]
flaccid; half-erect
disembodied humanoid penis; small penis [sph, penis size difference, comparison]
disembodied balls; small balls [sph, penis size difference, comparison, balls size difference]
pov penis; small penis [sph, penis size difference, comparison, pov small penis]
pov balls; small balls [sph, penis size difference, comparison, balls size difference, pov small penis]
large penis; small penis [sph, penis size difference, comparison]
huge penis; small penis [sph, penis size difference, comparison]
large balls; small balls [sph, penis size difference, comparison]
huge balls; small balls [sph, penis size difference, comparison]
unretracted foreskin; glans
cetacean penis; humanoid penis
porcine penis; humanoid penis
tapering penis; glans
tapering penis; foreskin
covered penis; penis exposed
covered penis; penis out
covered penis; glans ["glans"]
covered penis; foreskin ["foreskin"]
penis outline; penis exposed
penis outline; penis out
penis outline; glans ["glans"]
penis outline; foreskin ["foreskin"]
big nipples; small nipples
huge nipples; small nipples
big anus; veiny anus
puffy anus; veiny anus
pussy; futanari ["futa"]
vaginal; futanari ["futa"]

-/ Dildos
"penis"; purple penis [purple dildo, purple tentacle, purple tentacles, purple glans]
purple tentacles; purple penis
long dildo; planted dildo, riding dildo, dildo with balls
dildo excretion; planted dildo, riding dildo, dildo with balls
dildo expulsion; planted dildo, riding dildo, dildo with balls

anthro; spotted fur [deer, doe, reindeer, spotted fur, dappled fur, leopard, jaguar]
anthro; dappled fur [deer, doe, reindeer, spotted fur, dappled fur, leopard, jaguar]
feral; spotted fur [deer, doe, reindeer, spotted fur, dappled fur, leopard, jaguar]
feral; dappled fur [deer, doe, reindeer, spotted fur, dappled fur, leopard, jaguar]

solo; duo, trio, multiple views, crowd, audience, solo focus, group, voyeurism [crowd, audience, solo focus, group, voyeurism, walk-in, caught, duo, trio, orgy, multiple views]

detailed background; simple background
complex background; simple background
abstract background; simple background
indoors; window light

-/ Artefacts and overlays
; text, japanese text, english text, comic
; white outline, glowing
; blush stickers, tearing up

-/ Male body — keeping the implied partner off-model
; bara, pectorals

-/ POV framing
; clothed pov, anthro pov, furry pov
; anthro on anthro, furry with furry

- Universals
; white background [simple background, white sky, white walls, white wall]
; white sky
; sweat ["steam", "sweat"]
; excessive sweat ["steam", "sweat"]
; heart ["heart"]
; daytime, bright, sunlight, [daytime, day, blue sky, sunlight, sunshine]
; white pupils [bright pupils]
; ringed pupils [spiral eyes, spiral pupils]
; empty eyes [solid eyes, despair]
heart-shaped pupils; red pupils, pink pupils [red pupils, pink pupils]
; messy hair, stray hairs [messy hair, stray hairs]
; nail polish [" nails"]
; tanlines [tan, one-piece tan, bikini tan]
; red eyelashes
; blue eyelashes
; eye bags [tired, older female, gilf]
; eye wrinkles [older female, gilf]
; blue fluid ["blue cum", "unusual cum", "blue precum", "unusual precum", "blue pussy juice", "unusual pussy juice"]
; orange fluid ["orange cum", "unusual cum", "orange precum", "unusual precum", "orange pussy juice", "unusual pussy juice"]
; red fluid ["red cum", "unusual cum", "red precum", "unusual precum", "red pussy juice", "unusual pussy juice"]
; pee, urine, yellow fluid ["yellow cum", "unusual cum", "yellow precum", "unusual precum", "yellow pussy juice", "unusual pussy juice"]

; (eyeshadow, blue eyeshadow) ["eyeshadow", makeup, "mascara"]
; (desaturated, unsaturated, solid blacks)
; (sketch, sketch lines, pencil sketch, blurry, sketchy, light outline, unpolished)
; (glistening eyes, sidelit eyes, sparkling eyes, unpolished eyes) [glistening eyes, sidelit eyes, sparkling eyes, unpolished eyes, shiny eyes]
; (glistening, greasy) [shiny skin, shiny, shiny clothes, latex, oil]
; lowres, realistic, worst quality, bad quality, bad anatomy, conjoined, jpeg artifacts, signature, watermark, old, oldest
; censored, mosaic censorship, bar_censor
; patreon username, patreon logo, veiny tentacle, penis tentacle, veiny dildo
; plain, boring
; sfw
`;

// ---------------------------------------------------------------------------
//  Parsing
// ---------------------------------------------------------------------------
//  Produces the same record shape as cleanedDefaultArray — {requirements,
//  additions, exceptions} — so anything that can already read one can read the
//  other.
//
//  Guarded rather than trusting, unlike defaultDB's parser: a line with no `;`
//  throws there, and this file is meant to receive a few thousand lines written
//  somewhere else. A malformed line is reported and skipped, never fatal.

var cleanedNegativeArray = [];
var negativeArrayErrors = [];

(function parseNegativeArray() {
    var lines = String(negativeArray).split("\n");
    var split = function (text) {
        return String(text == null ? "" : text).split(",")
            .map(function (t) { return t.trim(); })
            .filter(Boolean);
    };

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line === "" || line.charAt(0) === "-") { continue; }

        var semicolon = line.indexOf(";");
        if (semicolon === -1) {
            negativeArrayErrors.push("line " + (i + 1) + ": no `;` — " + line);
            continue;
        }

        var left = line.slice(0, semicolon);
        var right = line.slice(semicolon + 1);

        var exceptions = [];
        var open = right.indexOf("[");
        if (open !== -1) {
            var close = right.indexOf("]", open);
            exceptions = split(right.slice(open + 1, close === -1 ? right.length : close));
            if (close === -1) { negativeArrayErrors.push("line " + (i + 1) + ": unclosed `[` — " + line); }
            right = right.slice(0, open);
        }

        var additions = split(right);
        if (!additions.length) {
            negativeArrayErrors.push("line " + (i + 1) + ": nothing to add — " + line);
            continue;
        }

        cleanedNegativeArray.push({
            requirements: split(left),
            additions: additions,
            exceptions: exceptions
        });
    }

    if (negativeArrayErrors.length) {
        console.warn("negativeDB: " + negativeArrayErrors.length + " malformed line(s)");
        for (var e = 0; e < negativeArrayErrors.length; e++) { console.warn("  " + negativeArrayErrors[e]); }
    }
})();

// v1 reads a [requirements, additions] pair list and has no concept of an
// exception, so it gets one built from the same source rather than a second
// copy to drift from. A line with exceptions is still offered to v1 — it had no
// way to express them before either, so this is no worse than what it had.
var basicNegativeArray = cleanedNegativeArray.map(function (entry) {
    return [entry.requirements.join(", "), entry.additions.join(", ")];
});
