var cleaningArrayTop = `
!testicles; balls
!testicle; ball
!blomde; blonde
!headress; headdress
!dickgirls; futanari
!dickgirl; futanari
!newhalf; futanari
!intersex; futanari
!areolae; areolas
!arm band; armband
!arm strap; armband
!asshole; anus
!butthole; anus
!butt plug; buttplug
!lab coat; labcoat
!hair clip; hairclip
!hair-clip; hairclip
!pokémon; pokemon
!poké ball; pokeball
!pokéball; pokeball
!poke ball; pokeball
!beltbra; belt bra
!beltskirt; belt skirt
!chest wrappings; chest wraps
!micro-bikini; micro bikini
!skintight; skin tight
!skin-tight; skin tight
!thighstrap; thigh strap
!detatched; detached
!eyewear; glasses
!anklewear; anklet
!headwear; hat
!sling bikini top; sling top
!sling bikini; sling top
!kneepads; knee pads
!lace-trimmed; lace trim
! (enlargement); removeme
! (larger); removeme
! (lore); removeme
! (oc); removeme
! (artist); removeme
! (style); removeme
! (animated); removeme
!sonic the hedgehog (comics); removeme
!sonic the hedgehog (idw); removeme
!thigh highs; thighhighs
!cheeck; cheek
!gynomorph; futanari
!in vagina; in pussy
!thigh high; thighhigh
!titfuck; paizuri
!titjob; paizuri
!volumptuous; voluptuous
! (toonguy; removeme
! (rampage; removeme
! (t-boy); removeme
!rating:explicit; removeme
!rating:questionable; removeme
!high leg; highleg
!high-leg; highleg
!low leg; lowleg
!low-leg; lowleg
!pal_(species); pal (species)
!detatched; detached
!animale; animal
`;

cleaningArrayTop = cleaningArrayTop.split("\n");
for (let replacementIndex = 1; replacementIndex < cleaningArrayTop.length-1; replacementIndex++) {
    //console.log(cleaningArrayTop[replacementIndex]);
    cleaningArrayTop[replacementIndex] = cleaningArrayTop[replacementIndex].split("; ");
    cleaningArrayTop[replacementIndex][0] = cleaningArrayTop[replacementIndex][0].replace("!", "");
    cleaningArrayTop[replacementIndex][1] = cleaningArrayTop[replacementIndex][1].trim();
}

//Used for grouping useful tags (best for training) with semi-useful tags (can improve generation)
//
//One group per line, CANONICAL FIRST - every later member collapses to it.
//There is no comment syntax here: the parser only drops blank lines, so a line
//beginning with "-" would be read as an alias group like any other.
//
//The last block was added 2026-08-08 from unsorted.md, which writes them the
//other way round as `alias; canonical`. Lines sharing a canonical were merged.
var cleaningAliasList = `
1girl, female, 1girls, woman

covered nipples, nipple outline, nipple bulge
areola slip, areola peek

detached sleeves, arm sleeves

ball weight, balls stretcher, balls weight, ball stretcher
covered balls, balls outline, balls under clothes

bike shorts, exercise shorts

ankle socks, anklehighs

cleavage cutout, cleavage window
ass cutout, ass window, ass out
balls exposed, balls out
balls peek, sideball, sideballs
pussy peek, partially visible vulva, barely visible pussy

mostly nude, barely covered, almost naked, almost nude, barely clothed, effectively nude, functionaly nude, pointless clothing

femboy, girly, otoko no ko, trap
plump, voluptuous, voluptuous figure, voluptuous female, voluptuous male
curvy, curvy figure, curvy female, curvy male

no arms, armless
no legs, legless
amputee, amputation

narrow waist, hourglass figure

areola slip, areola peek, nipple pink
futanari, full package futanari, 1futa, dickgirl, newhalf, shemale, intersex, futa sans pussy, full-package futanari, trans, trans woman
diphalism, multi-cock, diphalia
clitoris slip, clitoris peek
unretracted foreskin, long foreskin, excessive foreskin, hyper foreskin, hyperforeskin, loose foreskin
erection, erect penis, boner, erect
flaccid, flaccid penis, limp penis, floppy penis

sagging balls, saggy balls
very saggy balls, low-hanging balls, balls to knees
clenched balls, clenching balls, retracted balls, balls contraction
balls expansion, balls growth
fondling balls, ball fondling, balls fondling
balls grab, grabbing balls, ball grab, grabbing ball
tugging balls, balls pull, ball tugging, balls tugging, tugging ball, ball pull, balls pulling, ball pulling
handplaps, slapping balls, balls slap, balls slapping, balls spank, balls spanking, slapping ball, ball slap, ball slapping, ball spank, ball spanking
cbt, ballbusting, balls abuse, balls torture, cock and balls torture
balls squeeze, ball squeeze, squeezing balls, squeezing ball
balls squish, ball squish, squishing balls, squishing ball
ball sucking, balls sucking, balls in mouth, sucking balls, sucking ball
balls expansion, expanding balls, ball growth, balls growth, ball expansion, ball growth enlargement, balls growth enlargement, balls inflation
infested balls, pregnant balls, balls pregnancy, squirming balls, balls invasion
excessive scrotal skin, scrotal flap
anus expansion, anus growth, anus growth (enlargement)

female pubic hair, hairy pussy

butt crack, ass crack, buttcrack
ass expansion, ass growth, butt expansion, butt growth

smirk, smug
mesugaki, kusogaki, brat, bratty, needs correction, in need of correction
happy, happy expression, happy face
angry, angry expression, angry face, anger, angry sex
annoyed, annoyed expression
scared, scared expression, begging to stop
disgusted, disgust, disgusted face
unaware, oblivious
confused, curious, confusion, confused expression
apologizing, apology, sorry
awe, love, admiring, admiration
horny, aroused, arousal, aroused face
seductive, alluring
sad, disappointed, disappointing, disappointed expression, depressed, gloomy, dissapointed, dissapointing, dissapointed expression
looking pleasured, pleasure, pleasure face, pleasured
ohogao, intense orgasm, overwhelming orgasm, lost in pleasure, sugoihi
ahegao, ahe gao, aheagao, ahegao face
afterglow, exhausted, after orgasm
motion lines, motion
arched back, back-arching orgasm, back arched, arching back
toe curl, toe-curl orgasm, toe-curl, arched foot, curled toe, curled toes, curling toe, curling toes
eyes closed, closed eyes
closed mouth, mouth closed

full-face blush, heavy blush, full-faced blush, blushing profusely
air thrusting, air humping
imminent orgasm, about to cum, imminent ejaculation
pent-up, orgasm denial, edging, abstinence
ejaculation, cumshot
thick cum, solid cum, backed up cum, backed-up cum
accidental cumshot, accidental ejaculation
anal juice squirt, anal squirt, anal squirting, anal ejaculation
anal juice, anal fluid, anal fluids, anal juice bubble, anal juice drip, anal juice on object

squirting, pussy ejaculation, female ejaculation, pussy juice squirt

anilingus, rimjob, rimming, analingus, anilinus
licking anus, ass lick
beast rimming, animal ass
after rimming, after anilingus, after rimjob
deep rimming, face in anus, face in ass, ass in face
paizuri from above, reverse paizuri
ear penetration, ear sex, ear fuck, earrape, brainfuck, skull flossing
armpit sex, armpitjob
fucked silly, mindbreak, mind break, broken
buttjob, hotdogging, assjob
clitoral masturbation, clitoral stimulation

twerking, ass shake, ass clap, ass clapping, ass shaking, butt clap, butt clapping, butt jiggle, butt shake, butt shaking, clapping ass, clapping butt
ass ripple, ass jiggle, ass ripples, ass waves, clapping cheeks
wobbling butt, ass wobble
amazon position, amazonian mating press
slapping with penis, penis slap, cock slap

from front, front view, front
from behind, rear view, back, back view, behind view
from below, below view, underneath view
from side, side view
ass focus, butt focus, anus focus

ntr, netorare, cuckold, cucked, cuckolding
hypnosis, mind control, brainwashing, brainwashed, body control, altered common sense
rough, brutal, aggressive, violent, agressive
rough sex, brutal sex, brutal rape, aggressive sex, aggressive rape, agressive sex, agressive rape, violent sex, violent rape
deep penetration, balls deep
deepthroat, balls deep fellatio
internal anal, anal canal
anal expulsion, anal excretion
dildo expulsion, dildo excretion
cum expulsion, cum excretion
plug expulsion, plug excretion, buttplug expulsion, buttplug excretion
humiliation, degradation, degrading, dehumanization
corruption, moral degradation, corrupted
infection, infected
parasite, infested, infestation, creature inside, invasion, body invasion
infested penis, infested urethra, urethal infestation, penile infestation, urethal invasion
infested anus, anal infestation, anal invasion, creature in ass
infested pussy, vaginal infestation, vaginal invasion, creature in pussy
infested mouth, oral infestation, oral invasion, creature in mouth
infested nipple, nipple infestation, nipple invasion, creature in nipple
infested nipples, nipples infestation, nipples invasion, creature in nipples
squirming balls, infested balls, ball pregnancy, balls pregnancy, balls invasion, creature in balls

equine dildo, horsecock dildo, horse dildo
knotted dildo, canine dildo
anal beads, beads (sex toy), beads
anal bead pull, anal beads pull
buttplug, anal plug, plug, plug (sex toy)

on bed, in bed, bed
alleyway, alley, allyway
urban, city

demon, demonic
hair bun, single hair bun
double bun, double hair buns, hair buns
plump
always closed eyes, eyes always closed
flesh fang, cute fang, skin fang
arthropod, insectoid
pointy ears, pointed ears
ponytail over shoulder, ponytail off shoulder, ponytail on shoulder
hair slicked back, slicked-back hair, slicked back hair, slicked back
triangle mouth, triangle face
twintails, twintail
two side up, two up, two-side up
`;

//Convert alias list to usable array
cleaningAliasList = cleaningAliasList.split("\n");

//Remove empty lines
cleaningAliasList = cleaningAliasList.filter(Boolean);

//Remove duplicate lines
cleaningAliasList = cleaningAliasList.filter((item, index) => cleaningAliasList.indexOf(item) === index);

for (var i = 0; i < cleaningAliasList.length; i++) {
    cleaningAliasList[i] = cleaningAliasList[i].toLowerCase();
}

var cleaningArrayInitial = `
---------------------- Honeycomb pose templates (GENERATED by refs-shortcuts.js) ----------------------
-/ Honeycomb pose templates
PoseA; PoseA, standing, full body, solo, simple background, white background
PoseB; PoseB, standing, full body, torn clothes, sweat, solo, simple background, white background
PoseExposed; PoseExposed, standing, full body, torn clothes, exposed, blush, solo, simple background, white background
PoseBreakdown; PoseBreakdown, cowboy shot, shaded face, glowing eyes, solo, simple background, white background
PoseBreakdownB; PoseBreakdownB, cowboy shot, shaded face, glowing eyes, torn clothes, sweat, solo, simple background, white background
PoseDefense; PoseDefense, dynamic, action pose, 'pain', wince, full body, solo, simple background, white background
PoseDefenseB; PoseDefenseB, dynamic, action pose, 'pain', wince, full body, torn clothes, sweat, solo, simple background, white background
PoseOffense; PoseOffense, dynamic, action pose, attacking, full body, solo, simple background, white background
PoseOffenseB; PoseOffenseB, dynamic, action pose, attacking, full body, torn clothes, sweat, solo, simple background, white background
PoseSupport; PoseSupport, dynamic, full body, solo, simple background, white background
PoseSupportB; PoseSupportB, dynamic, full body, torn clothes, sweat, solo, simple background, white background
---------------------- end Honeycomb pose templates ----------------------
---------------------- Errors ----------------------
-/ Typos
1girls; 1girl
otokonoko; otoko-no-ko
dar skin; dark skin
penistail; cocktail, penis tucked
penisgirl; futanari
pussy juicech bubble; Juice
(color) cieling; (color) ceiling
embarrased; embarrassed
embarased; embarrassed
embarassed; embarrassed
unconcious; unconscious
unconsious; unconscious
close up; close-up
ass to ass; ass-to-ass
top down bottom up; top-down bottom-up
hips penised; hips cocked
ms fortune; ms. fortune
bed; on bed

-/ Common Mistaggings
sy-neo; sy-milf
sy-hyena; sy-helena
fl-hyena; fl-helena
sy-wolf; sy-sorbet
fl-wolf; fl-sorbet
hc-knight; hc-kn1ght
hc-brienne; hc-kn1ght
hc-lancer; hc-l4ncer
hc-cinder; hc-l4ncer
hc-necro; hc-n3cro
hc-moss; hc-n3cro
hc-nettle; hc-n3cro
hc-priest; hc-pr1est
hc-clemence; hc-pr1est
hc-seer; hc-s3er
hc-wick; hc-s3er
hc-cassadora; hc-s3er
hc-vamp; hc-v4mp
hc-severine; hc-v4mp
hc-chess; hc-ch3ss
hc-anastasia; hc-ch3ss
hc-chessmaster; hc-ch3ss
crisscross halter; criss-cross halterneck
criss-cross halter; criss-cross halterneck
crisscross halterneck; criss-cross halterneck
sling bikini top; sling top
(color) sling bikini; (color) sling top
slingshot bikini; slingshot swimsuit
(color) slingshot bikini; slingshot swimsuit, (color) swimsuit
(color) micro bikini; (color) bikini, micro bikini
(color) streaks; (color) hair streaks
(color) pom poms; (color) pom-poms
open smile; open mouth, smile
open frown; open mouth, frown
upper; upper body only
lower; lower body only

short (color) hair; short hair, (color) hair
long (color) hair; long hair, (color) hair
glowing (color) eyes; glowing eyes, (color) eyes
(color) penis ring; (color) cock ring
(color) nail polish; (color) nails
(color) toenail polish; (color) nails
(color) jumpsuit; (color) bodysuit
(color) skinsuit; (color) bodysuit
girthy penis; thick penis, large penis
gag; gagged
mouth gagged; gagged
gagged speech; gagged
gagging noise; gagged
deep penetration; deep insertion
balls squish; ball squish
balls clench; clenched balls
balls clenching; clenched balls
balls on ground; resting balls
balls sag; sagging balls
balls sagging; sagging balls
saggy balls; sagging balls
doggy style; doggystyle
mouth closed; closed mouth
hair slicked back; slicked back hair
slicked-back hair; slicked back hair
clenching teeth; clenched teeth
clitoris peek; clitoris slip
clitoris slip; clitoris slip, clitoris, clitoral hood
closed eyes; eyes closed
anthro: human on feral; human on anthro
cameltoe: pussy floss;
pussy outline: pussy floss;
front; from front
upper; upper body only
lower; lower body only
side view; from side
side; from side
rear view; from behind
behind; from behind
science-fiction; science fiction
scifi; science fiction
sci-fi; science fiction
butt focus; ass focus
butt worship; ass worship
mini top hat; mini hat, top hat
sling bikini top; sling top
slingshot bikini; slingshot swimsuit
(color) streaks; (color) hair streaks
humping: masturbation;
grinding: masturbation;
anal masturbation: masturbation;
riding dildo: masturbation; [hand on own penis, hands on own penis, vaginal fingering, clitoral stimulation]
holding dildo: masturbation; [hand on own penis, hands on own penis, vaginal fingering, clitoral stimulation]
irrumatio; deepthroat
deepthroat; oral, fellatio, deepthroat, deep insertion
deep penetration; deep insertion
deep; deep insertion
deep insertion: just the tip, prodding, vaginal prodding, anal prodding;
squat; squatting
reverse cowgirl; reverse cowgirl position
female: cute; cute girl [cute boy]
male: cute; cute boy [cute girl]
cute;
female: furry; furry male [furry female]
male: furry; furry female [furry male]
furry;
female; 1girl [2girls, 3girls, 4girls, 5girls, 6girls, 6+girls, furry female, anthro]
male; 1boy [2boys, 3boys, 4boys, 5boys, 6boys, 6+boys, furry male, anthro]
offscreen male; offscreen
offscreen animal; offscreen

-/ Organizing buttplugs
-/ Organizing buttplugs
- system shortcuts
Plugged; Plug
Plug Toy; Plug
Buttplug; Plug
Buttplugged; Plug
Buttplug toy; Plug

- vague plug aliases
plugged; plug
plug toy; plug
plug insertion; plug
plug inside; plug
buttplug; plug
buttplugged; plug
buttplug toy; plug
buttplug insertion; plug
buttplug inside; plug

- color plug aliases
(color) buttplug; (color) plug

- unique type aliases
Heart Plug; Plug, heart plug, huge plug
heart buttplug; heart plug
heart-shaped plug; heart plug
heart-shaped buttplug; heart plug

Star Plug; Plug, star plug, huge plug
star buttplug; star plug
star-shaped plug; star plug
star-shaped buttplug; star plug

Jewel Plug; Plug, jewel plug, huge plug
jewel buttplug; jewel plug
jeweled plug; jewel plug
jeweled plug; jewel plug
gem plug; jewel plug
gem buttplug; jewel plug
gemstone plug; jewel plug
gemstone buttplug; jewel plug

Round Plug; Plug, round plug, huge plug
round buttplug; round plug
circle plug; round plug
circle buttplug; round plug
plain plug; round plug
plain buttplug; round plug

plug tail; anal tail
buttplug tail; anal tail
anal tail; anal tail, fake tail

- buttplug in ass
anal plug; buttplug in ass
anal buttplug; buttplug in ass
plug in anus; buttplug in ass
plug in ass; buttplug in ass
buttplug in anus; buttplug in ass
plugged ass; buttplug in ass
buttplug in ass; buttplug in ass, anal object insertion, anal
buttplug in ass: Plug; huge plug, huge insertion
buttplug in ass: huge plug; huge plug, huge insertion
buttplug in ass, huge insertion, anal: anus; anus, stretched anus
buttplug in ass, huge insertion, anal: puffy anus; anus, stretched anus
buttplug in ass, huge insertion, anal: big anus; big anus, stretched anus
buttplug in ass, huge insertion, anal: huge anus; huge anus, stretched anus
buttplug in ass, huge insertion, anal: hyper anus; hyper anus, stretched anus
buttplug in ass: plug; buttplug
buttplug in ass: (color) plug; (color) buttplug

- buttplug in mouth
oral plug; buttplug in mouth
oral buttplug; buttplug in mouth
plug in mouth; buttplug in mouth
plugged mouth; buttplug in mouth
plug gag; plug gag, buttplug in mouth
buttplug in mouth: Plug; huge plug, huge insertion, cheek bulge
buttplug in mouth: huge plug; huge plug, huge insertion, cheek bulge
buttplug in mouth; buttplug in mouth, oral object insertion

- vaginal plug
vaginal buttplug; vaginal plug
plug in pussy; vaginal plug
buttplug in pussy; vaginal plug
plugged pussy; vaginal plug
vaginal plug: Plug; huge plug, huge insertion
vaginal plug: huge plug; huge plug, huge insertion
vaginal plug; vaginal plug, vaginal, vaginal object insertion

- urethral plug
urethral buttplug; urethral plug
plug in urethra; urethral plug
plug in penis; urethral plug
buttplug in urethra; urethral plug
buttplug in penis; urethral plug
plugged urethra; urethral plug
plugged penis; urethral plug
urethral plug: Plug; huge plug, huge insertion, urethral bulge
urethral plug: huge plug; huge plug, huge insertion, urethral bulge
urethral plug; urethral plug, urethral insertion

- nipple plugs
nipple buttplug; nipple plug
plug in nipple; nipple plug
buttplug in nipple; nipple plug
plugged nipple; nipple plug
Plug: nipple plug; nipple plugs, huge plug, huge insertion

nipples plugs; nipple plugs
nipple buttplugs; nipple plugs
nipples buttplugs; nipple plugs
plug in nipples; nipple plugs
plugs in nipples; nipple plugs
buttplug in nipples; nipple plugs
buttplugs in nipples; nipple plugs
plugged nipples; nipple plugs
nipple plugs: Plug; huge plug, huge insertion
nipple plugs; nipple plugs, nipple insertion

- plug holding
holding buttplug; holding plug

- plug pull
plug pull out; plug pull
plug tug; plug pull
plug grab; plug pull
tugging plug; plug pull
grabbing plug; plug pull
buttplug pull; plug pull
buttplug pull out; plug pull
buttplug tug; plug pull
buttplug grab; plug pull
tugging buttplug; plug pull
grabbing buttplug; plug pull
buttplug in ass: plug pull; plug pull, anal tugging
vaginal plug: plug pull; plug pull, vaginal tugging
buttplug push; plug push

- plug expulsion
buttplug expulsion; plug expulsion
plug excretion; plug expulsion
buttplug excretion; plug expulsion
plug expulsion; plug expulsion, expulsion, plug excretion, excretion, anal expulsion, anal excretion, anal tugging

- multiple buttplugs
multiple plugs; multiple buttplugs
extra plugs; multiple buttplugs
extra buttplugs; multiple buttplugs

- plug removal
discarded plug; discarded buttplug
discarded buttplug; unused buttplug
unused plug; unused buttplug
unused buttplug; removed buttplug
removed plug; removed buttplug
plug on floor; buttplug on floor
plug on ground; buttplug on ground
removed buttplug; removed buttplug, discarded buttplug, unused buttplug

-/ Misc
<3; heart
<3 eyes; heart-shaped pupils
bandaid on vagina; bandaid on pussy
tally; tally marks
forced; rape
eye contact; looking at viewer [looking at another]
arched soles; tiptoes
asphyxia; asphyxiation
breathplay; asphyxiation
asphyxiation; asphyxiation, shaded face, choking
out of breath; panting, heavy breathing, breath cloud
partially visible anus; anus peek
partially visible vulva; pussy peek

-/ Unsorted
heavy butt; extra thicc
huge hips; extra thicc
huge thighs; extra thicc
abandoned;
absolute territory;
absurdly large tentacle;
accessory;
accident;
genital expansion;
genital growth;
genital growth;
addiction;
aerolae;
african;
african american;
african female;
agressive sex;
alienhuman;
alone;
alternate body type;
alternate breast size;
alternate breast size larger;
alternate thigh size;
ambiguous gender;
ambiguous penetration;
ambiguous species;
anal hair;
anal only;
anal only chastity;
anal only lifestyle;
anal only maebari;
anal only panties;
anal only pants;
anal pounding;
anal suggest;
anal x-ray;
animal crossing girl;
animal penis on humanoid; animal penis
animal sex toy; animal dildo
animal tail; tail
animal vulva; animal pussy
anime girl;
announcing orgasm;
anon; faceless male
anonymous male; faceless male
anrrowed eyes; narrowed eyes
anthro focus;
anthro futa; anthro, futanari
sole female; solo, 1girl
alien futa; futanari, alien
alien girl; female, alien
anthro on alien;
anthro on male;
anthro penetrating anthro; anthro on anthro
anthrofied; anthro
anus bigger than pussy; huge anus
bumhole destruction; anus destruction
anal destruction; anus destruction
anus destruction; huge insertion, anal
asian female; asian, female
asking for help;
asking why;
ass bigger than breasts; huge ass
ass bigger than body; gigantic ass, hyper ass
ass bigger than torso; gigantic ass, hyper ass
ass body; gigantic ass, hyper ass
ass length hair; very long hair
ass play; anal
ass size talk;
assimilation; corruption
basic background; simple background
assume the position; dogeza
assuming position; dogeza
auburn hair; red hair
audible churning; balls sound effects, churning balls, churning
audible throbbing; balls sound effects, churning balls, throbbing
audible creampie; audible ejaculation
audible internal cumshot; audible ejaculation
aunt; older female
aunt and nice; mother and daughter
autopaizufella; autopaizuri, autofellatio
average penis; penis
back boob; backboob
ballbusting orgasm; ballbusting, cbt, orgasm
balls bigger than breasts; huge balls
balls bigger than head; huge balls
balls bigger than torso; gigantic balls
balls focus; crotch focus
ball growth enlargement; balls expansion
balls growth enlargement; balls expansion
balls on floor; resting balls
balls on penis; balljob
bar censor; censored
bara;
bare midriff; midriff
bare thighs; thighs
barely visible genitalia;
beach background; beach
bear humanoid; bear girl
beast; bestiality
beastiality; bestiality
beautiful girl; female
bed hair; messy hair
bedhead; messy hair
bedding; bed sheet
bedroom background; bedroom
bedroom setting; bedroom
bedroom sex; bedroom, sex
before sex;
begging;
begging for cum;
begging for more;
begging to stop;
begging for sex; horny, pent-up, lewd
being raped; raped
being watched; voyeur
bestiality impregnation; bestiality, impregnation
bestiality kiss; bestiality, kissing
bet;
betrayal; ntr
beverage; soda can
beverage can; soda can
big;
big ass (futa); big butt
big ass (male); big butt
big bellt; big belly
big butt (male); big butt
big chest;
big clitoris; large clitoris
big dick; large penis
big dildo; large dildo
big lips; thick lips
big muscles; muscular
big perineum; protruding perineum
big thighs; thick thighs
big veins;
vein; veiny
veins; veiny
bigger on smaller; large dom small sub
bigger penetrated; small dom large sub
bigger dom; large dom small sub
bigger dom small sub; large dom small sub
bigger dom smaller sub; large dom small sub
bigger female; larger female
bigger futa; larger futa
bigger male; larger male
bigger penetrating smaller; large dom small sub
bikini top;
biohazard; resident evil
birthing; birth
black;
black female; dark-skinned female
black text;
blacked male; interracial
dark-skinned malelight-skinned male; dark-skinned male, light-skinned male
blizzard entertainment;
bloated;
blonde; blonde hair
blonde-haired female; blonde hair
blood from nose; nosebleed
blowjob; oral, fellatio
blue;
blushed face; blush
blushing at partner; blush
blushing at viewer; blush
blushing lines; blush lines
bodily;
bodily fluids;
body part in ass;
bored expression; bored
bald female; bald
boobjob; paizuri
titfuck; paizuri
boobs; breasts
boobs out; breasts out
bottom heavy female; wide hips, big butt
bottomless anthro; bottomless, anthro
bottomless futa; bottomless, futanari
bottomless futanari; bottomless, futanari
bottomless humanoid; bottomless
bottomless skirt; 
bounce;
boy;
boys; multiple boys
bcalls; balls
braided hair; braid
braless; no bra
commando; no panties
going commando; no panties
pantiless; no panties
breast feeding; breastfeeding
breast focus; chest focus
breast outline;
breast suck; breastfeeding
breast sucking; breastfeeding
breastfeeding during sex; breastfeeding, sex
breasts frottage; breast docking
breath; breath cloud
breathing; breath cloud
breed; impregnation
breeding request;
breeding slave;
brother;
brothers;
bruised; bruises
bully;
bussy; big anus, puffy anus
butt cleavage; ass cleavage
butt to butt; ass-to-ass
butt-to-butt; ass-to-ass
caged; chastity cage
caked up; huge ass
camel toe; cameltoe
calves;
camera pov; recording
camera view; recording
canine on human; bestiality, dog
canis; dog
canon couple;
canon futa;
captured; bad end
captured heroine; bad end
captured vilainess; bad end
caucasian; light skin
caucasian female; light-skinned female
caught in the act; caught
caught masturbating; caught
caught naked; caught
caught off guard; surprised
censored genitalia; censored
chest bulge; pectoral bulge;
child bearing hips; wide hips
choke hold; choking
chubby anthro; chubby, plump, anthro
chubby femboy; chubby, plump, femboy
chubby thighs; thick thighs
circumcised; glans
cleavage overflow; bursting breasts
cling;
clit peek; clitoris slip
clit slip; clitoris slip
clitoral winking; throbbing pussy
close up view; close-up
closed eyes smile; closed eyes, smile
closeup; close-up
closeup view; close-up
clothednude; nude
clothes removed; undressed
removing clothes; undressing
clothing condom; condomsuit
clothes lift; lifting clothes
clothing lift; lifting clothes
clueless; unwaware
cock; penis
cock and balls; penis, balls
cock awe; penis awe
cock bigger than feet; large penis
cock bigger than head; huge penis
cock bulge; penis outline
cock hungry; horny
cock inside; sex
cock inside pussy; vaginal, sex
cock milking; penis milking
cock on face; penis on face
cock over face; penis over face
cock sleeve; living onahole
cocked hips; hips cocked
can't stop cumming; continuous ejaculation
copyright request;
corrupted; corruption
cross section; cutaway, internal
crossgender; futanari
crouched; crouching
crouching female; crouching
cruel; brutal
cruelty; masochism
cuck; ntr
cuckhold; ntr
cuckholding; ntr
cuckolding; ntr
cuckquean; ntr
cum addict; lewd
cum clog; imminent orgasm, urethral bulge
cum denial; orgasm denial
cum rope; cum string, cum trail
cum strand; cum string, cum trail
cum squirt; squirting
cum stream; cumshot, cum string, cum trail
cum swallow; throat bulge
cum volcano; excessive cum, cumshot
cumdump;
cumflated belly; cumflation
cumming; orgasm
cumming during tribadism; orgasm
cumming during ballbusting; orgasm
cumming during balls play; orgasm
cumming during kissing; orgasm
cumming during masturbation; orgasm
cumming during paizuri; orgasm
cumming in cleavage; orgasm, ejaculation
cumming in pussy; orgasm, cum inside, ejaculation
cumming on breasts; orgasm, cum on breasts, ejaculation
cumming together; orgasm
cumming while tribbing; orgasm
cumshot in anus; cum, ejaculation, cum in ass, cum inside
cumshot in ass; cum, ejaculation, cum in ass, cum inside
cumshot in chest; cum
cumshot in cleavage; cum, ejaculation
cumshot in pussy; cum, ejaculation, cum in pussy, cum inside
curse; cursed
curvaceous ass; huge ass
curvaceous body; plump
curvaceous female; plump
curvaceous figure; plump
curvaceous futa; plump
curvaceous hips; wide hips
curvaceous thighs; thick thighs
curves; plump
cuvaceous; plump
curvy; plump
curvy body; plump
curvy futa; plump
curvy male; plump
curvy solo; plump
curvy thighs; thick thighs
cute face;
dare;
dat ass; huge ass
daughters boyfriend; mother and son
day; daytime
d;
d (artwork);
d background;
d model;
d render;
dcg;
de-aged; aged down
death by snoo snoo; death by penis
deep blowjob; deepthroat, irrumation
deep throat; deepthroat
deep thrust; deep penetration
deep tongue fucking;
deep voice;
deepthroat no hands; deepthroat
defeat; bad end
defeat rape; bad end, rape
defeated female; bad end
defeated superheroine; bad end
defeated villainess; bad end
defeated with sex; bad end
defenseless;
deformed stomach; stomach deformation
demon humanoid; demon
demoness; demon girl
denied cumming; orgasm denial
denied orgasm; orgasm denial
denim bottomwear; denim
denim clothing; denim
depravity; lewd
destroyed anus; anal destruction
destroyed pussy; vaginal destruction
detachable penis; detached penis, portal penis
detailed anus; plump anus
detailed bulge; bulge
chainsaw man: devil;
chainsaw man: devil female;
chainsaw man: devil futa;
devil; demon
devil female; demon girl
devil futa; demon girl, futanari
dialogue speech bubble;
dick bigger than head; huge penis
dick inside; sex
dick inside pussy; vaginal, sex
dick on face; penis on face
dieselmine;
digestion;
digging into butt; anal fisting, fisting self
dildo belly bulge; huge insertion, stomach bulge
discipline; determined
disembodied penises; multiple penises, dhp
disgusting;
disheveled; messy clothes
disinterested; bored
dismemberment; amputee
distended anus; anal tugging
dizzy eyes; dizzy, spiral eyes
urethral penetration: docking;
doggy; doggystyle, sex from behind
doggy style position; doggystyle, sex from behind
doggy style sex; doggystyle, sex from behind
doggystyle position; doggystyle, sex from behind
insectoid; arthropod
dogs; multiple dogs
dom moaning;
dominant anthro; anthro
dominant femboy; maledom
dominant futa; futadom
dominant futanari; futadom
dominant gynomorph; futadom
dominant human;
dominant male; maledom
domination caption; humiliation
domination loss; bad end
domationsubmission; 
flies for smell: flies;
flies for smell;
dommy mommy; mommydom
ponut: donut;
donut anus: donut;
ponut; equine anus
double peace sign; double v
double ponytail; twintails
scrotal raphe;
double team; threesome
doughy ass; huge ass, plump
dragon ball daima; dragon ball
dragon ball super; dragon ball
dragon humanoid; dragon girl
dramatic music;
drinking cum: drinking;
dripping sweat; sweat
dripping semen; after ejaculation
dripping pussy; pussy juice
dripping penis; precum
dripping cum; after sex
drooling tongue; drooling
drunk female; drunk
drunk sex; drunk
e;
r;
hoyoverse;
mihoyo;
ears;
earth pony; pony
eaten then fucked;
ecstasy; orgasm
edge; orgasm denial
edging; orgasm denial
eeveelution;
effeminate; femboy
ejaculate; ejaculation
ejaculating; ejaculation
ejaculation in cleavage; ejaculation, cum between breasts
elbow;
elbow deep; deep fisting
elbow deep anal fisting; deep fisting
elbow deep fisting; deep fisting
elf girl; elf
embarrassed female; embarrassed
embarrassed nude female; embarrassed
embrace; hugging
encouragement;
enf; embarrassed
english text;
enhanced orgasm; orgasm
enjoying; looking pleasured
enjoying rape; looking pleasured, masochism
enourmous balls; gigantic balls
enourmous breasts; gigantic breasts
enourmous cock; gigantic penis
enourmous penis; gigantic penis
encasement; stuck
entrapment; bad end
equine humanoid; horse girl
equid humanoid; horse girl
equine vulva; equine pussy
erect cock; erection
erect dick; erection
erect while penetrated; erection
erection under clothing; erection under clothes
horse girl: horse; [bestiality]
erotic; nsfw
eshory;
euf;
eventual consent;
exaggerated anatomy;
excessive ass flesh; huge ass, plump, chubby
excessive foreskin; hyper foreskin
excessive genital fluids;
exotic penis; unusual penis
exposed thighs;
exposed torso; head out of frame
exposing; flashing
exposing breasts; presenting breasts, breasts out
exposing chest; presenting breasts, breasts out
exposing self; presenting
exposure; presenting
expressionless; emotionless
expressionless sex; emotionless
emotionless sex; emotionless
extremely horny; horny, lewd
eyes covered; obscured eyes
eyes half open; half-closed eyes
eyes hidden; obscured eyes
eyes obscured; obscured eyes
face burried in ass; deep rimming, face in anus
face between cheeks; deep rimming, face in anus
face focus; close-up, face
face fuck; deepthroat, irrumatio, motion
face in ass; face in anus
face rape; deepthroat, irrumatio, motion
facefuck; deepthroat, irrumatio, motion
faceless anthro; faceless
faceless futanari; faceless futa
faceless gynomorph; faceless futa
faceless man; faceless male
faceslap; slapping face
false clothes; fake clothes
fan character;
fanny packing; fanny packing
fapping; hand on own penis, masturbation
fast recovery;
fast sex; sex, motion
fast thrust; sex, motion, thrusting
fat butt; huge ass
fat cock; large penis
fat pussy; big pussy, fat mons
fat thighs; thick thighs
fatal vore; vore
fateapocrypha; fate
fatekeleidliner prisma illya; fate
fatestay night; fate
feet fetish; foot fetish
felid humanoid;
felin humanoid;
felis; feline
fellatio face; elongated lips, blowjob face
fellatio from feral; fellatio
female abs; toned, abs
female anthro; furry female, anthro
female death; death
demale dominating male; femdom, malesub
female domination; femdom
female fingering male; femdom, anal fingering, fingered by another
femalehumanoidmaleferal; feral on female
female humanoid;
female humiliation; humiliation, femsub
female moaning;
female on bottom; girl on bottom
female on female; yuri
female on human;
female on top; girl on top
female penetrating;
female penetrating male;
female prey;
female rimming femboy; female rimming male
female virgin;
femaleambiguous;
femalefemale; yuri
femalefuta; female on futa
femalemale; hetero
femalesub; femsub
femboy focus; femboy, male focus
femboy on femboy; cute boy, femboy, yaoi, multiple boys
femboy only; femboy
femboy penetrating;
femboy with female; hetero
femboydom; maledom
femboybfemboy; cute boy, femboy, yaoi, multiple boys
femboys; femboy, multiple boys
femboysub; femboy, malesub
feminine; femboy
feminine body; femboy
feminine male; femboy
feral on humanoid; bestiality
feral on human; bestiality
feral pred;
feral smegma;
fern sousou no frieren; fern (sousou no frieren)
fertile; plump
fetish;
fgo servant vs goblin; male goblin
fighting back; struggling
filled belly; big belly
filming; recording
filth; messy
finger claws; clawed hands
finger heart; heart hands
fingering partner; fingered by another
fingerless elbow gloves; fingerless gloves
fingers;
first person view; pov
fisting anus; anal fisting
fisting ass; anal fisting
fit; toned
fit female; toned
fit femboy; toned
fit futa; toned
flasher; pervert, flashing
flat chastity device; flat chastity cage
flexible female; flexible
flexible toes; flexible
flipping off; middle finger raised
flirting; seductive
floating breasts; disembodied breasts
floor sex; on floor
fluffy balls;
fluids;
focus;
focus on ass; ass focus
focus on penis; crotch focus
fondle;
forced anal;
forced ejaculation;
forced exposure;
forced impregnation;
forced masturbation;
forced oral;
forced orgasm;
forced partners;
forced penetration;
forced presentation;
forced sex; rape
forced sbmission;
foreplay;
forest background; forest
forest sex; forest
fox futa; fox girl, futanari
fox humanoid;
freckles on ass; freckled ass
freckles on breasts; freckled breasts
freckles on face; freckles
freckles on shoulders; freckles
freckles on thighs; freckled thighs
friendship is magic;
frieren beyond journey's end; sousou no frieren
from behind position; from behind
from below view; from below
from front position; from front
fromsoftware;
front view; from front
ftg transformation;
fti transformation;
fucked unconscious; Broken
fucking;
fucking pussy; vaginal, sex
full balls; throbbing balls, veiny balls
full nelson anal; full nelson, anal
full-faced blush; full-face blush
full-length portrait; full body
fully clothed; clothed
fully naked; nude
fully naked anthro; nude, anthro
fully naked female; nude
fully nude; nude
fully nude anthro; nude
fully nude female; nude
fun fact;
functionally nude female; functionally nude
furious masturbation; angry, masturbation
anthro: furry;
furry female: furry;
furry male: furry;
furry futa; furry female, futanari
furry pov; anthro pov
futa armpit hair;
futa cock;
futa is always bigger; futa is bigger
futa is larger; futa is bigger
futa masturbation; masturbation
futa mayor;
futa milf;
futa milking;
futa mommy;
futa mommy fg;
futa on femboy; futa on male
futa only;
futa orgasm;
futa penetrating futa; futa on futa
futa with femboy; futa with male
futafemale; futa on female
futanari anthro; futanari, anthro
futanari on futanari; futa on futa
futanari only;
futanari penetrating; futa penetrating
futanarifemale; futa on female
futanarifutanari; futa on futa
futanarimale; futa on male
futapank;
futashep;
futataur; taur
futa taur; taur
gagged female; gagged
galvanic mechamorph;
gamefreak;
gaming chair; gamer chair
gasping for air; asphyxiation
gay anal; anal
gay footjob; footjob
gay male;
gay masturbation;
geek;
genital expansion;
genital growth;
genital growth enlargement;
genital raphe;
genital torture;
genital worship;
genitalia;
german male;
german female;
getting erect; half-erect, becoming erect
ghislaine dedoldia;
giantess: giant;
giant anal beads; anal beads, huge beads
giant areola; huge areolas
giant areolas; huge areolas
giant ass; huge ass
giant balls; gigantic balls
giant breasts; gigantic breasts
giant buttplug; huge plug
giant nipples; huge nipples
giant penis; huge penis
gigantic anal beads; anal beads, huge beads
gigantic areola; huge areolas
gigantic areolas; huge areolas
gigantic ass; huge ass
gigantic buttplug; huge plug
gigantic nipples; huge nipples
gigantic penis; huge penis
gigantic cock; huge penis
gigantic dick; huge penis
gigantic thighs; huge thighs
ginger female; ginger
ginger; red hair, freckles
ginger pubic hair;
ginger hair; red hair
girls;
giver pov; male pov
giving birth; birth
gluck; oral, fellatio
god i wish that were me;
gooner; gooning
gorn;
goth futa; goth
grimace; frown
grinning; grin
grinning at viewer; grin, looking at viewer
goin;
grool; pussy juice
grotesque;
grotesque genitals;
grower not a shower;
growth;
gts;
gulonine;
gulp;
hairless pussy;
hairy anus;
hairy balls;
hairy nipples;
hairy pussy;
handjob wsex toy; onaholejob
hands-free ejaculation; hands-free, ejaculation
hands-free orgasm; hands-free, orgasm
handwear and shoes only; nude
handwritten text;
haning breasts; hanging breasts
happy sub;
hard cock; erection
hard nipples; erect nipples
hard on; erection
hard penis; erection
hard sex; brutal
hardcore; nsfw
hardcore sex; brutal
hasbro;
heart shaped buttplug; heart plug
heart buttplug; heart plug
heartbeat;
hearts; heart
heavy bottom; huge ass
heavy penis; huge penis
heel boots; high-heeled boots
held up; lifted by another
hellaverse;
hello kitty character;
hello kitty series;
helluva boss;
helpless;
helpless female;
herm; futanari
hermaphrodite; futanari
hidden; stealth
hiding; stealth
hiding lover; stealth sex
hip onahiole; hip onahole
hips wider than shoulders; wide hips
hitting balls; cbt, ballbusting
hitting balls with dildo; dildoplaps, cbt, ballbusting, hitting balls with dildo
holding bucked; holding bucket
homosexual;
homosexual female;
homosexual male;
homosexual masturbation;
homosexual sex;
horizontal splits; horizontal splits
horny thoughts; horny
horny face; horny, lewd
horny male; horny
horse anus; equine anus
horse balls; balls
horse on female; bestiality, horse
horseballs; balls
horsed; bestiality, horse, ntr
hourglass figured female; hourglass figure
huge asscheeks; huge ass
huge boobs; huge breasts
huge butt; huge ass
huge cock; huge penis
huge load; excessive cum, solid cum, thick cum
huge smellcock; huge penis
huge tits; huge breasts
hugging while having sex; hugging during sex, hugging, sex
hugging while sex; hugging during sex, hugging, sex
human on human;
human penetrating humanoid;
humanoid female;
humanoid on anthro; human on anthro
humanoid on feral; human on feral
humanoid penetrated; human penetrated
humiliated; humiliation
humiliating; humiliation
humiliation fetish; humiliation
hung femboy; large penis, femboy
hung futa; large penis, futanari
hybrid;
hybrid penis: hybrid genitalia;
hyper cock; hyper penis
hyper cock femboy; hyper penis, femboy
hyper feces;
hyper futa; hyper penis, futanari
hyper long penis; hyper penis
hypergamy; hyper
hypnotized female; hypnosis
hypnotized ;personality change; hypnosis
identity death; hypnosis, empty eyes
idw publishing;
imminent zoophilia; imminent bestiality
impending orgasm; imminent orgasm
implied sex from between legs; implied sex
implied zoophilia; implied bestiality
in heart; horny, aroused, pent-up
oral threading: in ass out mouth;
incest (lore);
rimjob imminent; imminent rimming
hyper feces;
rimjobpaizuri; reverse paizuri, anilingus
rimzuri; reverse paizuri, anilingus
ringwaldt;
riot games;
ripped clothing; torn clothing
ripped pants; torn pants
ripped pantyhose; torn pantyhose
rippling ass; ass ripple
risky sex; stealth sex
roleplay character;
rough anal; rough sex, anal
rough oral; rough sex, oral
round;
round ass; big butt
round balls; large balls
round breasts; large breasts
round butt; big butt
rubbing pussies together; tribadism
ruined anus; anal destruction
ruined pussy; vaginal destruction
running makeup; runny makeup
running mascara; runny mascara
s;
saliva drip; drooling
scared expression; scared
scared face; scared
scaroused; scared, aroused, horny
scented balls; musky balls
scented penis; musky penis
scott pilgrim takes off;
scottgames;
scrotal raphe;
scrotum flap; excessive scrotal skin
scrotum ladder;
seconds;
secret sex; stealth sex
seductive body; seductive
seductive expression; seductive
seductive female; seductive
self insert;
semen; cum
semen in mouth; cum in mouth
semen on body; cum on body
semen on chest; cum on chest
semen on face; facial
semen on hair; cum on hair
semi nude; mostly nude
sexual frustration; pent-up
shaking ass; ass shake
shaking butt; ass shake
short-haired female; short hair
shorter female; smaller female
shorter maletaller female; smaller male, larger female
shortstack femboy; shortstack, femboy
shortstack futa; shortstack, futa
shounen jump+;
shounen jump;
showing off ass; presenting ass
shrimp dick; small penis, micropenis
signature;
simple background (color) background; simple background, (color) background
simple (color) background; simple background, (color) background
size talk;
skinny female; petite
skinny; petite
slide it;
slightly chubby; chubby
slightly chubby anthro; chubby
slightly chubby female; chubby
slightly chubby futa; chubby
slightly chubby futanari; chubby
slightly chubby gynomorph; chubby
slightly chubby male; chubby
slim; petite
slim female; petite
slim waist; narrow waist
sloppy; messy
sloppy blowjob; fellatio, messy penis
slosh; sloshing
slowly growing genitals; becoming erect
slutboy; femboy, lewd
small waist; narrow waist
snaggle tooth; fang
sneakers without bottomwear; sneakers, bottomless
soles female; soles
soles fetish; soles, foot fetish
someone else's oc;
special week umamusume; special week (umamusume)
sponty;
stern; glare
step-incest;
steamy balls; steaming body, sweaty balls
steamy body; steaming body
straight; hetero
straight sex; hetero
straight to gay; yaoi
submissive female; femsub
submissive futa; futasub
submissive male; malesub
submissive pov; taker pov
subtitled;
sucking own penis; autofellatio
suffocation; asphyxiation
suggestive dialogue;
suggestive; sexually suggestive
suggestive look; seductive
suggestive pose; seductive pose
suggestive posing; seductive pose
surprise cumshot; surprised, ejaculation, cumshot
surprise; surprised
surprised expression; surprised
surprised face; surprised
suspension; suspended
swallowing penis while deepthroat; irrumatio, deepthroat, fellatio, oral
sweat drop; sweatdrop
sweat droplet; sweatdrop
sweat drops; sweatdrops
sweat droplets; sweatdrops
sweater only;
sweating; sweat
sweaty; sweat
sweaty genitalia;
swimzuri;
swollen anus; plump anus
t;
t (;
t (artist);
talking to self;
taller male; larger male
taller female; larger female
taller futa; larger futa
taller futanari; larger futa
tane tenshi;
tanline; tanlines
tanned; tan
tanned female; tan-skinned female
tanned skin; tan
tanuki ears; round ears
tears of the kingdom;
teary eyes; tearing up
tease; teasing
tencent;
tentacle penetration; tentacle sex
tentacle rape; tentacle sex, rape
testicular bulge; squirming balls
text;
thick; plump
thick ass; huge ass
thick butt; big butt
thick cock; thick penis
thick dick; thick penis
thick female; plump
thick hips; wide hips
thick thighs: thighs;
thighs bigger than head; huge thighs
thighhighs only;
thighs large; thick thighs
thin; petite
thin waist; narrow waist
this is your life now; bad end
thong panties; thong
threaded by penis; all the way through
three-quarter view; cowboy shot
throat;
throat fuck; irrumatio, deepthroat
throat penetration; deepthroat
throat noise; (sfx), "glrk"
throat rape; deepthroat, rape
thunder thighs; huge thighs
thunderthighs; huge thighs
tight balls; clenched balls
tilde after text;
(color) pantyhose: tights;
pantyhose: tights;
leggings: tights;
stockings: tights;
tile wall: tiles;
tile floor: tiles;
tits bigger than head; huge breasts
tits out; breasts out
titty creampie; ejaculation, paizuri, cum between breasts
toes curled; toe curl
tomboyish; tomboy
toony;
top heavy breasts; top heavy
trans;
trans woman;
transfem;
transgender;
trap; femboy
tremble lines; trembling
tremble spikes; twitching
trembling for pleasure; trembling
trembling penis; twitching penis
trick or treating; trick or treat
trick-or-treating; trick or treat
tricked;
tt;
turtleneck sweater: turtleneck;
twerk; twerking
twink; femboy
twink penetrated; femboy
twitch lines; twitching
twitch.tv;
twitch streamer;
twitching anus; twitching
twitching anus; throbbing anus
twitching balls; throbbing balls
twitching penis; throbbing penis
twitter;
two panel image; 2koma
two-finger masturbation; masturbation, 2 fingers inserted
two-piece swimsuit; bikini
ugly;
ui; game mechanics, game ui
unable to cum; orgasm denial
unable to ejaculate; orgasm denial
unable to orgasm; orgasm denial
unaware hypnosis; unaware
unawareacles; unaware
uncircumcised; foreskin
uncircumcised penis; foreskin
uncontrolled orgasm; forced orgasm
underrated;
underrated futa mommy;
underrated futa waifu;
underwear only;
unknown species;
unseen male face; offscreen, mostly offscreen male
unsettling; scary
until they like it; mind break
unwilling pred; rape
unwilling prey; rape
upgrade ben 10;
upset; annoyed, sad
uraraka ochako; uraraka ochaco
uraume;
v sign; v
vagina outline; cameltoe
vaginal juices; pussy juices
vaginal orgasm; squirting, pussy juices
vaginal penetration; vaginal
vampire milf; vampire, milf
veins on cock; veiny penis
veins on dick; veiny penis
veins on penis; veiny penis
venus body; plump, chubby, belly
venus futa; plump, chubby, belly, futanari
verbina samurai jack;
vertical splits; vertical splits
very dark-skinned female; dark-skinned female
very fat cock; large penis, thick penis
very fat pemis; large penis, thick penis
very fat penis; large penis, thick penis
very horny; horny, pent-up
very thick cum; solid cum
victim anthro;
victim blaming;
victim female; femsub
victim yordle;
video game character;
video recording; recording
view;
viewed from behind; from behind
viewed from below; from below
viewed from above; from above
viewed from side; from side
viewed from front; from front
viewer perspective; pov
viewer pov; pov
violet hair; purple hair
vkid;
vomiting cum; cum vomiting
w; double v
walked in on; walk-in, caught
warty penis: warts;
nubbed penis: warts;
nubbed glans: warts;
watermark;
watery eyes; tearing up
weak male; malesub
wedged;
werecanid; werewolf
werecanine; werewolf
wet sounds; (sfx)
wide ass; huge ass
wide butt; huge ass
wide eyed; wide-eyed
wide hip; wide hips
wide hipped female; wide hips
wide thighs; thick thighs
wobbling ass; wobbling butt
woman; female
workout inspo; toned
worship play;
whorshiping; worshipping
wrecked ass; anal destruction
writing;
x;
x-ray view; x-ray
y anus; triangle anus
yor briar; yor forger
young woman; younger female
young female; younger female
youtuber;
yubi;
yugo's gardevoir;
yuugo's sirnight;
zer;
zoophilia; bestiality
zoophilia pregnancy; interspecies pregnancy
inconvenient butt; inconvenient ass
indian female; tan skin
indoor nudity; indoors, nude
indoors sex; indoors, sex
infesticles; infested balls
interracial sex; interracial, sex
interspecies creampie; 
interspecies fuck;
interspecies mating;
interspecies rape;
interspeices sex;
inventory; inventory, game ui, game mechanics, inventory screen
involuntary orgasm; forced orgasm
jacket open; open jacket
japanese text;
jerking; masturbation, hand on own penis
jerking off; masturbation, hand on own penis
jerkingoff; masturbation, hand on own penis
jiggle; ripple
jiggle physics;
jiggling; ripple
jiggling ass; bouncing butt
jiggling balls; sloshing balls
jiggling breasts; bouncing breasts
jiggling butt; bouncing butt
jiggling penis; bouncing penis
jpeg artifacts;
k;
kaelpus;
kankaku shadan; 
kazzy;
kazzypoof;
kazzypoof (character);
kingdom hearts chain of memories; kingdom hearts
kinky; lewd
kneeling down; kneeling
kneeling oral position; kneeling
kneeling sex; kneeling, sex
knotted; knotting
knotting position;
koma; 2koma
language barrier;
large ass; huge ass
large female; larger female
large pussy; big pussy
laying; lying
laying down; lying
laying on back; lying, on back
laying on bed; lying, on bed
laying on stomach; lying, on stomach
laying on side; lying, on side
leaking cum from pussy; cum from pussy
leaking pussy; pussy juice, pussy juice drip
leaking pussy juice; pussy juice, pussy juice drip
legacy series;
leggings only;
legs;
legwear;
legwear only;
lesbian;
lesbian female;
lesbian sex; yuri
lewd clothes; revealing clothes, skimpy
lewd clothing; revealing clothes, skimpy
lewd outfit; revealing clothes, skimpy
limp penis; flaccid
living;
long;
long ass; huge ass
long balls; saggy balls
long cock; long penis
long dick; long penis
long nipples; erect nipples
long term chastity;
long-haired female; long hair
looking at camera; looking at viewer
lost bet;
loving it; looking pleasured
loving sex; looking pleasured, heart
low-angle view; from below
lowres;
lubed; lube
lubricant; lube
macro female; giantess
male anthro; furry male
male feral; 
male humanfemale elf; hetero
male humanfemale humanoid; hetero
male moaning;
male on female; maledom, femsub, hetero
male on femboy; femboy, yaoi
male on human;
male on top; boy on top
male orgasm; orgasm
male pokemonfemale pokemon; bestiality
maleambiguous;
malefemale; hetero
malemale; yaoi
mammal taur; taur
mario series;
mario bros;
mario vs. donkey kong;
markings;
marvel comics;
marvel rivals;
massive anal beads; huge beads, anal beads
massive anus; huge anus
massive balls; huge balls, hyper balls
massive boobs; gigantic breasts
massive breasts; gigantic breasts
massive butt; huge ass
massive butt; huge ass
massive cock; huge penis
massive penis; huge penis
massive tits; gigantic breasts
massive thighs; huge thighs
master roshi;
masturbating; masturbation
masturbating futa; futa masturbation
masturbating other; masturbation
masturbating while penetrated; masturbation
mating;
mating season; horny
mattress; bed
mature body; plump
mature figure; plump
mature futa; plump
mature woman; mature female
mcyt;
medium sized male;
mega sirnight; mega gardevoir
mesmerized; hypnosis
message box; dialogue box
michael afton;
micro skirt; microskirt
minecraft youtubers;
mmorpg;
moans; moaning
mojang;
mole;
mom-cuck; motherly netorare
mommy dom; mommydom
mtf;
muscular futanari; muscular futa
na;
nails painted;
naked anthro; nude, anthro
naked boots;
naked bracelet;
naked futa; nude futa
naked male; nude male
naked sailor collar;
naked shoes;
naked stockings;
nasty;
nippon ichi software;
no text version;
non binary;
non-binary;
non-con;
non-mammal nipples; unusual nipples
nonbinary;
nude anthro;
not furry focus;
nyl mercy;
oc;
oddly wholesome;
offs;
older;
oldest;
on all fours; all fours
on tiptoe; tiptoe
on toes; tiptoes
on top;
open kimono breasts out; open kimono, breasts out
oppai;
oral anal: oral, oral sex;
oral anal;
oral anal sex;
oral creampie; oral, ejaculation, cum inside
oral fellatio; oral, fellatio
oral insertion; oral
oral penetration; oral
oral rape; oral
oral sex; oral
oral sex close up; oral, close-up, head focus
oral sex close-up; oral, close-up, head focus
oral sex closeup; oral, close-up, head focus
oral sex close up; oral, close-up, head focus
organs;
orgasm face; o face
orgasm from anal; orgasm, anal
original characters;
otoko no ko; femboy
out of frame; offscreen
out of frame male; moslty offscreen male
outdoor nudity; outdoors, nude
outdoor sex; outdoors, sex
outdoors sex; outdoors, sex
outfucked male; femdom
outside; outdoors
outside masturbation; outdoors, masturbation
overflowing breasts; bursting breasts
oversized balls; huge balls
oversized fellatio; oral, fellatio, huge insertion
oversized oral; oral, huge insertion
overwatch 2; overwatch
overweight; far
overweight futa; futa, plump, curvy, chubby
overwhelmed; mindbreak, fucked silly
overwhelming orgasm; mindbreak, fucked silly, orgasm
overwhelmed pleasure; mindbreak, fucked silly, orgasm
p;
paag;
painted clothes: paint;
painted clothes: paint on body;
pantsless; no pantsless
pathfinder;
peehole; urethra
peehole penetration; urethral penetration
peehole rape; urethral penetration, rape
penile;
penile masturbation; masturbation, hand on own penis
penile urethral insertion; urethral penetration, penis in penis
penile penetration;
penis covering eyes; penis over eyes
penis focus; crotch focus
pent up; pent-up
perfect pussy; pussy
permalocked;
permalocked chastity;
persona 3 reload; persona 3
pervert female; perverted female
perverted female; pervert, perverted female, female pervert
female pervert; pervert, perverted female, female pervert
petite body; petite
petite breasts; small breasts, perky breasts
petite female; petite
petite futa; petite
phantom penis; dhp
phat ass; huge ass
pink;
pixiv;
please don't bully me;
pleased; happy
pleased expression; happy
pleasure; looking pleasured
pleasure rape; rape, looking pleasured
pleasured; looking pleasured
pleasured face; looking pleasured
pleasured female; looking pleasured
pleasured male; looking pleasured
plugged ass; buttplug in ass
plump boobs; large boobs
plump breasts; large breasts
plump thighs; thick thighs
plump tits; large breasts
poketoon;
poney;
ponytail female; ponytail
pose;
position;
pov ass;
prayer hands; praying, hands together
predatorprey;
pregnancy; pregnant
pregnant futa; pregnant
prey bulge;
prey outline;
prone bone position; prone bone
pussy cumming on pussy;
pussy hair;
pussy squirt; pussy juice, squirting
quality;
r;
r-mk;
raphe anatomy;
rare;
rd;
rd;
feixuijan; feixianji
fei; feixianji
very lewd; lewd, seductive, naughty, sexually suggestive, nsfw, explicit, heart
dutch; dutch angle
belly button; navel
big hips; wide hips
big horns; large horns
big man; larger male
bimbo; bimbofication
bird wings; feathered wings
blank background; simple background
blindfolded; obscured eyes
blank eyes; empty eyes
blank stare; breathing is fun
blonde hair female; 1girl, blonde hair
(color) hair female; 1girl, (color) hair
blunt ends; blunt bangs
blushing female; blush
boob pressing; breast press
bottomless female; bottomless
bottomless male; bottomless
bouncing ass; bouncing butt
brainwashing; brainwashed
breast coil; breast squish
breast milk; lactation
breastmilk; lactation
breasts bigger than head; large breasts
breasts bigger than torso; gigantic breasts
breeding; fertilization, impregnation
fertilization; impregnation
broken rape victim; Broken, after rape
broom stick; broom
broomstick; broom
brow piercing; eyebrow piercing
bubble ass; big butt
bubble butt; big butt
bulb glans; glans
bulge through clothing; covered penis, erection under clothes
business casual; formal
business woman; formal
busty; large breasts
busty female; large breasts
cat boy; cat ears, catboy
cat girl; cat ears, catgirl
felid; feline
pointed ears; pointy ears
cat humanoid;
cavity storage;
cfnm; clothed female nude male
chibi inset;chocolate and vanilla;
chocolate starfish; anus
chubby belly; chubby, belly
clawed fingers; clawed hands
clawed toes; clawed feet
clothing skin;
cock-tail; tucked penis
cocktail; tucked penis
cocklock; leg lock
coffee cup; coffee mug
cosplayer; cosplay
couple; duo
covered clitoris; clitoris outline, clitoral bulge
covered collarbone;
covered erect nipples; erect nipples under clothes
crossdressing male; crossdressing
cuckold; netorare
cum bridge; cum string
cum down throat; cum inside, throat bulge
cum dripping; cum drip
cum dripping from penis; after ejaculation
cum explosion; cum explosion, overflow
cum inflation; cumflation
cum inside request;
cum log; thick cum, solid cum
cum logs; thick cum, solid cum
chunky cum; thick cum, solid cum
cum on chin; cum, facial
cum on face; cum, facial
cum overflow; cum, overflow
cum overflowing; cum, overflow
curved back; arched back
curved to the right penis; curved penis
dangling balls; sagging balls
defeat sex; bad end
defeated; bad end
defeated heroine; bad end
destroyed pussy; gaping pussy, after vaginal
canid; canine
dominant female; femdom
dominant feral; bestiality
eating pussy; cunnilingus
eating cum; cum drinking
ebony; black skin
elemental creature; elemental
elemental humanoid; elemental
elf female; 1girl, elf ears
elf futa; futanari, elf ears
elf ears; elf, pointy ears
embarrassed nude futa; embarrassed, nude, futanari
equestrian bondage;
excited for sex; excited, blush, sweat, heart
exercising; exercise
explosive orgasm; head back, orgasm, motion lines, twitching, trembling
extremely thick cum; thick cum, solid cum
eye roll; rolling eyes
rolled eyes; rolling eyes
eye through hair; eyes visible through hair
eye visible through hair; eyes visible through hair
eyes through hair; eyes visible through hair
eyeroll; rolling eyes
eyes rolled back; rolling eyes
eyes rolling back; rolling eyes
food in mouth; eating, chewing
face fucking; oral, Sex
face mounting; oral, Sex
faceless character; faceless background character
faceless human; faceless background character
fat ass; huge ass
fat ass teen; huge ass
female ejaculation through clothes; squirting, squirting through clothes, pussy juice stain
female human; 1girl
female human/male feral; 1girl, bestiality
female masochism; masochism
female on feral; female on feral, bestiality
female on futa; femdom, female on futa, futasub
female only; 1girl, solo
female orgasm; orgasm
female with female; yuri
female/female; yuri
feral anilingus; beast rimming
feral penetrating female; bestiality
feral penetrating human; bestiality
fingering from behind; fingering, from behind
flat chested; flat chest
flat chested futanari; flat chest, futanari
flat n thick; flat chest, wide hips, thick thighs
formal clothes; formal
french kissing; french kiss
fucked from behind; sex from behind
full-package futa; futanari
full-packaged futanari; futanari
fully clothed female; fully clothed
fully clothed futa; futanari, fully clothed
fully clothed futanari; futanari, fully clothed
fully clothed male; fully clothed
fully retracted foreskin; glans, humanoid penis
furry intersex; furry female, futanari
futa; futanari
futa focus; female focus, futanari
futa urethral insertion; urethral insertion
futa with female; futa on female
futa with male; futa on male
game over; bad end
gaping pussy: gaping;
gaping anus: gaping;
gaping nipples: gaping;
gay; yaoi
gay sex; yaoi
girly boy; Cute Boy
glistening body: glistening;
glistening skin: glistening;
goth fashion; goth
goth femboy; goth
goth girl; goth
gothic; goth
gritted teeth; clenching teeth
groin tendon;
grope from behind; groping, from behind
grope; groping
hair covering one eye; hair over one eye
hair over one eyes; hair over one eye
hand on own hip; hand on hip
hands on own hips; hands on hips
hair covering eyes; hair over eyes
hands-free lactation;
handsfree ejaculation; hands-free
handsfree orgasm; hands-free
hanging balls; sagging balls
happy female; happy
head thrown back; head back
heavy balls; huge balls, sagging balls
heels; high heels
high heel shoes; high heels
high heel boots; high-heeled boots
high heel thighboots; high-heeled thighboots
high-heeled boots: high heels;
high-heeled thighboots: high heels;
hiccuping; hiccup
hickey; hickeys
hips; wide hips
horny futa; horny, futanari, erection
horny sub; horny
horse anus on humanoid; huge anus, puffy anus
horsecock futanari; futanari, equine penis, medial ring
horsecock on humanoid; equine penis, medial ring
huge areola; huge areolas
human male on anthro; human on anthro
human on humanoid; human on anthro
human with horsecock; equine penis, medial ring
humanoid genitalia; humanoid penis
humanoid robot; android
hung bottom; small but hung
infidelity; netorare
inkling player character; inkling
it'll never fit; impossible fit
brainwashing; mind control
large boobs; large breasts
large butt; big butt
large cock; large penis
large hips; wide hips
large nipples; big nipples
large penis veins; veiny penis
large thighs; thick thighs
large tits; large breasts
latina; tan skin
latina futa; futanari, tan skin
leaking milk; lactation
leaking penis; after ejaculation
low hanging balls; sagging balls
lying on back; lying, on back
lying on breasts; lying, on stomach, breast press
lying on stomach; lying, on stomach
male human/female anthro; human on anthro
male human/female humanoid; human on anthro
male human/female pokemon; human on feral
missionary position; missionary
missionary sex; missionary
mlp; my little pony
monster cock; huge penis
monster futa; futanari, huge penis
musk; steaming body
musk clouds; steaming body
musk sniffing;
musky balls; steam, sweat, sweaty balls, steaming body
musky butt; steam, sweat, sweaty ass, steaming body
musky cock; steam, sweat, sweaty penis, steaming body
naked female; nude
naked footwear; nude
nudity; nude
pierced clitoris; clitoris piercing
pierced ears; ear piercing
pierced lip; lip piercing
pierced nipples; nipple piercings
pierced tongue; tongue piercing
plump ass; big butt
plump lips; thick lips
plump vulva; fat mons
puffy areola; puffy areolas
rear view; from behind
side view; from side
scrotum; balls
shading eyes; shaded face
sounding; urethral insertion
sparkling eyes; star pupils
steamy; steam
steamy ass; steam
steamy breath; breath cloud
steamy penis; steaming body
stick nipples; erect nipples
topless female; topless
(color) panties: underwear;
(color) thong: underwear;
rapist femboy; rape, femboy, girly, maledom, small but hung
ready to pop; cumflation, big belly
pussy grip; vaginal tugging
pregnant belly; pregnant
pregnant female; pregnant
pregnant sex; pregnant, Sex
xp drain; level drain
exp drain; level drain
projectile cum; Ejaculation
fang out; fang
petgirl; pet play
public nudity; nude, exhibitionism
pear shaped figure; plump, curvy, extra thicc, wide hips, thick thighs
sex toy in ass; anal object insertion
ballsack; balls
scrotum; balls
manly; masculine male
manly male; masculine male
masculine male; [mostly offscreen male]
muscular male; [mostly offscreen male]
lactating nipples; lactation
lactating; lactation
lactating through clothes; lactation through clothes
lactation without expressing;
lactation without stimulation;
leaking precum; Precum
legs wrapped around partner; leg log
male human; human male
male on anthro; human on anthro
male on male; yaoi
male penetrating female; hetero
male penetrating male; yaoi
male with female; hetero
male with male; yaoi
male/female; hetero
male/male; yaoi
mind break; mindbreak
nervous expression; Nervous
nervous face; Nervous
nervous female; Nervous
nervous grin; Nervous, smile
nervous smile; Nervous, smile
nervous sweat; Nervous, sweat
nervous sweating; Nervous, sweat
nipple bulge; covered nipples
nipple outline; covered nipples
pleasure face; looking pleasured, wavy mouth, aroused
puckered anus; big anus, puffy anus
puckering anus; puckered anus
puffy pussy; Big Peach
rimjob; anilingus, rimming
seductive eyes; seductive, narrowed eyes
seductive gaze; seductive, narrowed eyes
seductive look; seductive, narrowed eyes
seductive mouth; seductive, narrowed eyes, smile
seductive smile; seductive, narrowed eyes, smile
shaking; twitching, trembling
shaking orgasm; twitching, trembling, orgasm
emanata; motion lines, twitching, trembling
sissification; feminization, femboy
sissy; femboy
sissygasm; femboy, girly, hands-free, orgasm
club-shaped penis; humanoid penis, glans
food themed earrings; food-themed earrings
uncircumsized; foreskin
retracted foreskin; foreskin
uncut; foreskin
intersex/female; futa on female
big ass (male); femboy, girly, extra thicc
bottom heavy; wide hips, thick thighs
bottom heavy femboy; femboy, girly, wide hips, thick thighs, huge ass
bubble butt; big butt
cum fart; cum expulsion, big anus, puffy anus, anal tugging
futa penetrating male; futa on male, futanari, 1girl, 1boy, femboy, girly, futadom, malesub
blushing; blush
futanari pov; futa pov
ahe gao; ahegao
humanoid pointy ears; pointy ears
blonde female; 1girl, blonde hair
large ass; huge ass
large butt; big butt
hot dogging; hotdogging
penis between ass; hotdogging
sitting on dildo; planted dildo, riding dildo, large insertion
breasts out of clothes; breasts out

-/ Shortcut Mistagging
offscreen; Offscreen
futa on male, solo focus: male focus; male focus, futa partner
futa on female, solo focus: female focus; female focus, futa partner
dhp; DHP

cum in condomsuit; ejaculation under clothes
oral knotting; oral knotting, knotting, oral, fellatio, deepthroat, irrumatio, deep penetration [knotted dildo, canine dildo]
anal knotting; anal knotting, knotting, anal, anal sex, deep penetration [knotted dildo, canine dildo]
vaginal knotting; vaginal knotting, knotting, vaginal, vaginal sex, deep penetration [knotted dildo, canine dildo]
tribadism; tribadism, scissoring, yuri, pussy

disembodied penis, female focus: 1boy, penis; DHP
disembodied penis; DHP

Stomach; On Stomach
On Front; On Stomach
Wide Hips; wide hips, thick thighs
Thick Thighs; wide hips, thick thighs
Girly; Femboy
Full; Full Body
Upper; Upper Body
Lower; Lower Body
Cowboy; Cowboy Shot
motion; Motion
Motion Lines; Motion
twitch; Twitching
Twitch; Twitching
Fluids; Fluid
juice; Pussy Juice
Juice; Pussy Juice
Profile; Basic
simple; simple background
basic; Basic
Basic; Simple
tagme: crotch; Crotch
pov crotch; Crotch
Cute POV; Cute pov
Cute Pov; Cute pov
Cute pov; Crotch
Futa POV; Futa pov
Futa Pov; Futa pov
Futa pov; futa pov, pov breasts, Crotch
Female POV; Female pov
Female Pov; Female pov
Female pov; female pov, pov breasts, pov pussy, Crotch
Male POV; Male pov
Male Pov; Male pov
Male pov; Crotch, male pov
disembodied penis; DHP
pained expression; clenched teeth, raised inner eyebrows, constricted pupils

penis, hetero: pov; pov crotch, pov penis
pov crotch; Crotch
Crotch: futa partner; futa pov
Crotch: male partner; male pov
Crotch: female partner; female pov
Crotch: Futa; futa pov
Crotch: Cute; cute pov
Crotch: Small; pov small penis
Crotch: Horse; equine pov, pov equine penis
Crotch: Wolf; canine pov, pov canine penis
Crotch: Dog; canine pov, pov canine penis
Crotch: Pig; pov pig penis
Crotch: Taker; taker pov

offscreen; Offscreen
Offscreen: futa partner; mostly offscreen futa
Offscreen: male partner; mostly offscreen male
Offscreen: female partner; mostly offscreen female
Offscreen: Futa; mostly offscreen futa
Offscreen: Cute; mostly offscreen boy
Offscreen: Small; mostly offscreen boy
Offscreen: Horse; mostly offscreen horse
Offscreen: Wolf; mostly offscreen wolf
Offscreen: Dog; mostly offscreen dog
Offscreen: Pig; mostly offscreen pig
Offscreen: femdom; femdom, mostly offscreen female

Heart; heart, heart-shaped pupils

Imminent; imminent
Prodding; prodding
Insertion; insertion
Sex; sex
Climax; climax
Internal; internal
Cooldown; cooldown
masturbation: cooldown; pullout [anal, vaginal, oral]
motion; Motion
Motion; Motion, motion

tagme: happy; Happy
tagme: amused; Amused
tagme: joy; Joy
tagme: laughing; Laughing
tagme: teasing; Teasing
tagme: mocking; Mocking
tagme: confused; Confused
tagme: befuffled; Befuddled
tagme: worried; Worried
tagme: tired; Tired
tagme: Panic; Panic
tagme: surprised; Surprised
tagme: shocked; Shock
tagme: annoyed; Annoyed
tagme: angry; Angry
tagme: fury; Fury
tagme: scared; Scared
tagme: crying; Crying
tagme: blushy; Blushy
tagme: flirting; Flirting
tagme: pent-up; Pent-Up
tagme: penis awe; Awe, penis awe, looking at penis
tagme: awe; Awe
tagme: excited; Excited
tagme: love; Love
tagme: pleasured; Pleasured
tagme: perverted; Perverted
tagme: forced; Forced
tagme: afterglow; Afterglow
tagme: broken; Broken
Player House; player house
Player house; player house
Player's House; player house
Player's house; player house
player's house; player house
Players House; player house
Players house; player house
players house; player house
Unaware; unaware
ear sex; ear penetration
urethral; urethral penetration [sex toy, dildo in penis, urethral beads, urethral plug, sounding rod]
urethral; urethral insertion
penis in urethra; penis in penis, urethral penetration
penises in urethra; penises in penis, urethral penetration
tentacle in urethra; tentacle in penis, urethral penetration
tentacles in urethra; tentacles in penis, urethral penetration
dildo in urethra; dildo in penis, urethral insertion
dildos in urethra; dildos in penis, urethral insertion

-/ LoRa Shortcuts
Arched; Arched Back
Arched Back; Arched back
Arched back: on back;
Head Back; head back, fucked silly, Twitch, orgasm, ahegao
Thick cum; Solid Cum
Thick Cum; Solid Cum
Solid cum; Solid Cum

-/ LORA boosters
tagme; tagme, laura
laura: lineup; Lineup
Lineup; <lora:angled lineup - huafgjaio:1>, lineup, standing, from side, side-by-side
laura: flesh unit; Flesh unit
Flesh unit; <lora:assimilated flesh unit - kone1985295:0.8>, flesh unit, flesh_unit, 1girl, solo, vaginal object insertion, breasts out
laura: canine pussy; Canine pussy
Canine pussy; <lora:canine pussy - vennin:1>, canine pussy
laura: ball bra; Ball bra
Ball bra; <lora:ball bra - unknown:1>, ball bra
laura: clenching balls; Clenching balls
Clenching balls; <lora:clenched balls - dpsjksjx614:1>, clenched balls, clenched testicles
laura: figma; Figma
Figma; <lora:figurine - BigGuss21:1>, fig, nendo, figma
laura: huge buttplug; Huge buttplug
Huge buttplug; <lora:huge buttplug - nightfall1:1>, huge buttplug, buttplug in ass, anal object insertion, huge insertion
laura: kerfus; Kerfus
Kerfus; <lora:kerfus - unknown:1>, kerfus, robot joints, anthro
laura: long foreskin; Long foreskin
Long foreskin; <lora:long foreskin - farum:0.4>, long foreskin, unretracted foreskin
laura: hyper foreskin; Hyper foreskin
Hyper foreskin; <lora:long foreskin - toshiyaki:1>, long foreskin, unretracted foreskin
laura: long labia; Long labia
Long labia; <lora:long labia - scottstupp:0.8>, ll_ppy2, labial hypertrophy, dangling labia, hanging labia, meaty pussy, puffy pussy with long labia
laura: monster vore; Monster vore
Monster vore; <lora:monster vore - animacode:1>, monster, monster vore
laura: pussy inspection; Pussy inspection
Pussy inspection; <lora:pussy inspection - sutea:1>, multiple layers, multiple views, character name, English TEXT, character profile, radar chart, close-up layer, close-up pussy, full body layer, pussy, fat mons, clitoris, gaping, erect clitoris, large CLITORIS, Clitoral hood, spread_pussy, urethra, detailed pussy, detailed anus, presenting pussy, 1girl
laura: silicone chainsaw; Silicone chainsaw
Silicone chainsaw; <lora:SiliconeChainsaw:1>, siliconchainsawtorture, silicon chainsaw, sex machine
laura: slapping with penis; Slapping with penis
Slapping with penis; <lora:slapping with penis - nochekaiser:1>, slapping with penis, pov crotch, male pov, pov penis, motion lines, afterimage, cheek squish
laura: throat swabbing; Throat swabbing
Throat swabbing; <lora:throat swabbing - oktaze:1>, throat swabbing, reverse fellatio, oral, fellatio, deepthroat, irrumatio, upside-down, upside-down fellatio, throat bulge
laura: urethral bulge; Urethral bulge
Urethral bulge; <lora:urethral_bulge:1>, urethral bulge
laura: onacup; Onacup
Onacup; <lora:onacup - trevizeCZ:1>, onecup, asshuku, change of status, transformation
laura: personality excretion; Personality Excretion
Personality Excretion; <lora:personality excretion - trevizecz:1>, personality excretion, excretetion
laura: arched back; Arched back
Arched back; <lora:arched back orgasm - jimijam87:1>, arched back, back-arching orgasm
Ohogao; <lora:ohogao - magochi:1>, puckered lips, ohogao, sweat, blush, ahegao, parted lips, v-shaped eyebrows, open mouth, tongue, saliva, fucked silly, sugoihi, squirting, orgasm, rolling eyes, :o, o-face
laura: nipple beam; Nipple beam
Nipple beam; <lora:orgasm beam - bimbofutaTF_NSFW:1>, orgasm beam, pink electricity, beam hitting nipple
laura: pussy beam; Pussy beam
Pussy beam; <lora:orgasm beam - bimbofutaTF_NSFW:1>, orgasm beam, pink electricity, beam hitting vagina
laura: beam; Beam
Beam; <lora:orgasm beam - bimbofutaTF_NSFW:1>, orgasm beam, pink electricity, beam hitting vagina, beams hitting nipples
laura: solid cum; Solid Cum
Solid Cum; <lora:concept - clenched balls:0.8>, solid cum
laura: atwt; all the way through
laura: all the way through; All the way through
All the way through; <lora:all the way through - omaha261:1>, all the way through
laura, breast grab, nipple penetration: breast grab; Breast grab nipple fuck
laura: breast grab nipple fuck; Breast grab nipple fuck 
Breast grab nipple fuck; <lora:breast grab nipple fuck - brandonanana:1>, onahole nipple fuck, nipple penetration, breast grab, grabbing another's breast, upper body only, mostly offscreen male, huge penis
laura: breeding mount; Breeding Mount
Breeding Mount; <lora:breeding mount - cceedd:0.2>, breeding mount, artificial_vagina, standing
breeding mount: sex; motion lines, motion blur, afterimage, thrusting, leaning forward, tiptoes
laura: bulge down leg; Bulge down leg
Bulge down leg; <lora:bulge down leg - nicows:1>, bulge down leg, covered testicles, penis to the knee, flaccid
bulge down leg: 1girl; 1girl, futanari
laura: clitoral bulge; Clitoral bulge
laura: clitoris outline; Clitoral bulge
Clitoral bulge; <lora:clitoral bulge - honohana:1>, erect clitoris, erect clitoris under clothes
laura: cock sock; Cock sock
Cock sock; <lora:cock sock - omaha261:1>, huge testicles, cock sock, veiny testicles, throbbing testicles
cock sock: 1girl; 1girl, futanari
laura: filled condom; Filled condom
laura: filling condom; Filled condom
Filled Condom; huge_condom, condom on penis, filled condom
huge_condom: 1girl; 1girl, futanari
laura: condom gagging; Condom gagging
Condom gagging; <lora:condom gagging - omaha:1>, after oral, condom gagging, used condom on penis, throat bulge, open mouth
laura: cum explosion; Cum explosion
Cum explosion; <lora:cum explosion - retoto:1>, expl0s1on, cum, cum explosion, excessive cum, cum from nose
laura: ear sex; Ear sex
Ear sex; <lora:ear sex - suteakasu:1>, ear sex, ear fuck, inserting into ear, penis insertion into ear
brutal, laura: oral; oral, Extreme oral
laura: extreme oral; Extreme oral
Extreme oral; <lora:extreme oral - suteakasu:1>, extremedeepthroat, extreme, brutal, huge insertion, oral, fellatio, deepthroat, irrumatio, deep insertion
brutal, laura: tentacle sex; Extreme tentacles
laura: extreme tentacles; Extreme tentacles
Extreme tentacles; <lora:extreme tentacles - suteakasu:1>, <lora:extreme tentacle sex - suteakasu:1>, extremetentaclesex, extreme, brutal, huge insertion, tentacles, tentacle sex
laura: hyper saggy; Hyper saggy
Hyper saggy; <lora:hyper saggy balls - wtvrfits489:1>, hypersagging_testicles, sagging balls
laura: absolute cinema; Absolute cinema
Absolute cinema; <lora:meme pose absolute cinema - xrikishi:1>, absolute cinema (meme), meme, english text, monochrome, greyscale, parody, hands up
laura: ass worship; Ass worship
Ass worship; <lora:meme pose ass worship - infamous_fish:1>, ass worship, g1f0b, reach-around, ass lift, grabbing another's ass, ass grab, groping, ass, ass focus, smile, duo
laura: butt pillow; Butt pillow
Butt pillow; <lora:meme pose butt pillow - infamous_fish:1>, hoabb, head on ass, butt pillow, head on butt, between buttocks, lying, duo
laura: crackstyle; Crackstyle
Crackstyle; <lora:meme pose crackstyle - infamous_fish:1>, g1p0, (head out of frame), ass focus, own hands together, palms together, ass, standing, squatting, duo, anus peek, ass cleavage, buttcrack
laura: liscense; Liscense
Liscense; <lora:meme pose liscense - navedaxu:1>, l1c3ns3, english text, smile, holding license, parody, meme
laura: padoru; Padoru
Padoru; <lora:meme pose padoru - citronlegacy:1>, zzpadoru, padoru, meme, santa hat, blush stickers, padoru, chibi, deformed
laura: pepe silvia; Pepe silvia
Pepe silvia; <lora:meme pose pepe silvia - navedaxu:1>, p3p3, indoors, messy hair, corkboard, papers, hand up, yelling, crazy, pepe silvia
laura: newspaper; Newspaper
Newspaper; <lora:meme pose tommy lee jones newspaper - 0b0rmot:1>, holding newspaper, tljwan, reaction, meme, parody
laura: mouth beam; Mouth beam
Mouth beam; <lora:meme pose mouth beam - bimbofutaTF_NSFW:1>, hyp3rb34m, open mouth, glowing, beam attack, beam from mouth
laura: nipple condoms; Nipple condoms
Nipple condoms; <lora:nipple condoms - foobarnanashi:1>, tied condoms, nipple condoms
laura: nosejob; Nosejob
Nosejob; <lora:nosejob - cannabis:1>, nosejob, penis on nose, pushing nose up, cum in nose, solo focus, upper body
laura: onahole handjob; Onahole handjob
Onahole handjob; <lora:onahole handjob - 81189:1>, onahole_plav1, onahole handjob, masturbator handjob, artificial vagina
laura: onahole package; Onahole package
Onahole package; <lora:onahole package - di gi ossan:1>, onahole package, sex toy, onahole, artificial vagina, item focus
laura: punch rush; Punch rush
Punch rush; <lora:ora ora punch rush - kone1985295:1>, punch rush, oraora_rush, motion lines, motion blur, many fists, punching, attack
laura: penis chart; Penis chart
Penis chart; <lora:penis chart - piales:1>, penis chart, portrait, penis side view, comparison
laura: puffy anus slider; Puffy anus slider
Puffy anus slider; <lora:puffy anus slider - u_harucom:1>, puffy anus slider
laura: balls punch; Crotch punch
laura: punching balls; Crotch punch
Crotch punch; <lora:punching balls - azure sun:1>, crotch punch, ballbusting, cbt, punching
laura: breast punch; Breast punch
laura: punching breasts; Breast punch
Breast punch; <lora:punching breasts - pinkshirt:1>, breast_punch, breast punch, punching, masochism
laura: face punch; Face punch
laura: punching face; Face punch
Face punch; <lora:punching face - nochekaiser881:1>, face punch, punching, punched in the face
laura: cum log; Cum log
Cum log; <lora:thick cum - containment breach:1>, cum log, cum, ejaculation, urethral bulge, excessive cum, orgasm
laura: tugging anal; Tugging anal
Tugging anal; <lora:tugging & knotting - charbel:0.6>, anal tugging, anal, anal sex
laura: stuck anal; Stuck anal
Stuck anal; <lora:tugging anal - tobyshiwei215:1>, anal tugging, very tight anus, incredibly tight anus, penis stuck in anus, anal, anal sex, bent over, huge insertion
laura: urethral dildo; Urethral dildo
laura: dildo in penis; Urethral dildo
Urethral dildo; <lora:urethral dildo - darkmodeop:1>, sounding_bulge, dildo in penis, urethral bulge
laura: urethral infestation; Urethral infestation
Urethral infestation; <lora:urethral infestation - manray:1>, infested urethra, parasite, urethral insertion, urethral penetration, infest_, urethral bulge, creature inside, cock vore, infestation
laura: urethral helper; Urethral helper
Urethral helper; <lora:urethral insertion - insertusername:1>, urethral penetration


---------------------- Useless tags ----------------------
-/ Redundant High Quality
score 6 up;
score_6_up;
score 7 up;
score_7_up;
score 8 up;
score_8_up;
score 9;
score_9;
uncensored;
masterpiece;
best quality;
amazing quality;
high quality;
very high quality;
very asthetic;
absurdres;
newest;
absurdres;
hi res;
hires;
highres;
huge filesize;

-/ Censorship
censor; censored
pointless censor; censored
mosaic censor; censored
bar censor; censored
heart censor; censored
blur censor; censored
blank censor; censored
censoring; censored
pointless censoring; censored
mosaic censoring; censored
bar censoring; censored
heart censoring; censored
blur censoring; censored
blank censoring; censored
censorship; censored
pointless censorship; censored
mosaic censorship; censored
bar censorship; censored
heart censorship; censored
blur censorship; censored
blank censorship; censored
mosaic; censored
censored nipples; censored
censored pussy; censored
censored breasts; censored
censored ass; censored
censored penis; censored
censored text; censored

-/ Low Quality
blurry;
sketch;
sketchy;
redrawn;
duplicate;
artistic error;
lowres;
worst quality;
bad quality;
bad anatomy;
jpeg artifacts;
signature;
watermark;
old;
oldest;
conjoined;
parenthesis;
bad anatomy;
anatomical nonsense;
ambiguous red liquid;
pixel-perfect duplicate;
revision;
rotated;
third-party edit;
third-party source;
unfinished;
variant set;
webp-to-png conversion;
ai-gen;
ai-generated art;
jpeg artifacts;
lossy-lossless;
md5-mismatch;
character;
series;

-/ Watermarks
artist;
artist username;
artist name;
artist logo;
bad id;
patreon username;
patreon logo;
patreon url;
patreon id;
bad patreon id;
twitter username;
twitter logo;
twitter url;
twitter id;
bad twitter id;
pixiv username;
pixiv logo;
pixiv url;
pixiv id;
bad pixiv id;
subscribestar username;
subscribestar logo;
subscribestar url;
subscribestar id;
bad subscribestar id;
pawoo username;
pawoo logo;
pawoo url;
pawoo id;
bad pawoo id;
tinami username;
tinami logo;
tinami url;
tinami id;
bad tinami id;
artist request;
artist commentary request;
source request;
commentary request;
character request;
parody request;
weapon request;
check artist;
check source;
check character;
artist commentary;
commentary;
copyright name;
sig;
signature;
dated;
english commentary;
web address;

-/ Meta Image Context
inactive account;
making-of-available;
paid reward;
paid reward available;
translated;
translation request;
commission;
artist collaboration;
multiple artists;
derivative work;
hard translated;
has uncensored version;
poll winner;

-/ Meta Character Context
borrowed character;
borrowed design;
cannon crossdressing; crossdressing
canon crossdressing; crossdressing
original character;
original;
alternate breast size;
alternate body size;
alternate color;
alternate costume;
alternate eye color;
alternate hair length;
alternate hair color;
alternate hairstyle;
alternate skin color;
alternate body build;
alternate ass size;
alternate body size;
alternate legear;
alternate muscle size;
alternate skin color;
alternative body build;
adapted costume;
official alternate costume;
official alternate hair length;
official alternate hairstyle;

---------------------- Bad Tags ----------------------
-/ Low Power
stomach;
back;
bangs;
knees;
shoulders;
argyle;
striped;
body fur;
body type;
bon bonne;
bottomwear;
bright man;
cosmetics; 
makeup; 
crease;
daddy kink;
deepthroat holder;
degeneracy;
degrading accessory;
demanding;
dominant;
dominated;
domination;
extreme gaping;
eyeball;
female gardevoir;
female mewtwo;
female penetrated;
female protagonist; 
female skinsuit; 
motor vehicle;
feral with female;
foreskin folds;
fucked;
fuckgirl;
fupa;
fur;
furry only;
futa without pussy;
futabang;
futile resistence;
gape;
gardevoir dad;
genitals;
girl;
girl assisting trap;
girlfriend;
girly girl;
gland;
glands of montgomery;
goblin male;
highlights hairstyle;
hilling;
hip bones;
human focus;
human form;
human only;
human with animal genitalia;
human'd;
humaned;
humanized;
humanoid;
humanoid feet;
humanoid hands;
hung;
hung futanari;
hung trap;
hyper;
hyper bimbo;
hyper blossom;
hyper genitalia;
ignoring consent;
impregnation request;
inbreeding;
inset;
insulting viewer;
invitation;
inviting;
inviting to sex;
larger feral;
leaking;
lies;
mammal;
mammal humanoid;
marine humanoid;
mature;
mature male;
milkrape;
mint starfish;
mostly clothed;
naked gloves;
naked heels;
naked futanari;
naked jewelry;
naked shirt;
naked thighhighs;
needy;
needy futa;
negative space;
no;
page number;
persona dancing;
phrase;
piercing;
piercings;
plaid clothes;
plaid;
smelling feet;
snake futa;
squirting liquid;
stepbrother and stepsister;
stepsibling;
stepsister;
braid;
cum announcement;
object insertion;
shaved crotch;
smooth penis;
smooth skin;
smooth skinned male;
male gardevoir;
nape;
slq;
striped;
1other;
2others;
3others;
4others;
5others;
6+others;

-/ Low Impact / Quality Reducing
mole;

-/ Excessive Violence
blood from mouth;
blood on clothes;
bleeding; [nosebleed]
abuse; ryona
pain; ryona
brutal; ryona
painal; ryona, anal, sex
ryona: sex; brutal, brutal sex, rape, sex
ryona: anal sex; brutal, brutal sex, rape, anal sex
ryona: vaginal sex; brutal, brutal sex, rape, vaginal sex
ryona: oral; brutal, brutal sex, rape, oral

-/ Weight
fat female; overweight female
obese female; overweight female
bbw; overweight female
cellulite; overweight female
obese; fat
fat man; fat
fat male: fat; [overweight female]
fat; overweight female
overweight female; plump, chubby, wide hips, thick thighs, belly

-/ Gross
brap;
burp;
fart;
farting;
eating farts;
smelly;
stinky;
swamp ass;
smell lines;
fart bukkake;
fart cloud;
fart fetish;
fart in face;
fart sniffing;
fart torture;
farting; sweat, steam, steaming body
farting in face;
farts; sweat, steam, steaming body
fart; sweat, steam, steaming body
scat;
implied scat;
shit;
feces;
poop;
belch;
belching;
burp;
burping;
ass hair;
arm hair;
gross;
hairy;
hairy male;
imminent fart;
diaper;

pubic hair tuft; pubic tuft
body hair; hairy
hairy male: hairy; [hairy female]
hairy;
hairy female; pubic hair, armpit hair

male pubic hair: pubic hair; [female pubic hair]
male pubic hair;

belly hair; pubic hair
pubic tuft; pubic hair
moderate pubic hair; pubic hair
excessive pubic hair; pubic hair
mismatched pubic hair; pubic hair
blonde pubic hair; pubic hair
(color) pubic hair; pubic hair
pubes; pubic hair

armpit tuft; armpit hair
moderate armpit hair; armpit hair
excessive armpit hair; armpit hair
mismatched armpit hair; armpit hair
blonde armpit hair; armpit hair
(color) armpit hair; armpit hair
hairy pits; armpit hair
hairy armpits; armpit hair
female armpit hair; armpit hair
armpit hair;

-/ Meta Image Tags
meta;
substance;
long image;
tall image;
photoshop (medium);
2d;
2d (artwork);
3d;
3d (artwork);
advertisement;
collage;
hud;
source filmmaker;
realistic;
real;
logo;
aliasing;
parental advisory;
explicit;
general;
questionable;
sensitive;
00s;
10s;
1990s;
1990s (style);
1998;
2010s;
2015;
2016;
2017;
2018;
2019;
2020;
2021;
2022;
2023;
2024;
2025;
retro artstyle;
album cover;
anime;
anime coloring;
animification;
anniversary;
basic;
circle;
classic;
classic anime;
comedy;
company;
company connection;
company name;
concept art;
contemporary;
drawing;
higher resolution available;
image comparison;
image in thought bubble;
left-to-right manga;
lineart;
everyone;
style;
texture;
watermark;
signature;
manga;
novel;
novelty censor;
perspective;
hyperlinked;

-/ Cropping
cropped;
cropped legs; cowboy shot
cropped arms;
cropped torso; disembodied torso
disembodied torso; cropped torso

-/ Greyscaling
greyscale; greyscale
black and white;
flat color;
sepia;
colorized;

-/ Text/Dialogue
english text; text
english language; text
english dialogue; text
japanese text; text
korean text; text
chinese text; text
acronym; text
homophobic slur; text
slur; text
narration; text
profanity; text

sound effects; sfx
dialogue; text
dialogue bubble; text
speech; text
speech bubble; text
thought; text
thought bubble; text

talking; text
euphamism; text
dirty talk; text
profanity; text
talking to viewer; text
explicitly stated age; text
explicitly stated nonconsent;
explicitly stated consent;
explicitly stated pedophilia;

barcode;
barcode tattoo;

social media;
instagram;
chat box;
chat;
chat log;
text;
censored;

-/ Questionable, may change later
1st costume;
2nd costume;
3rd costume;
4th costume;
5th costume;
6th costume;
7th costume;
8th costume;
alternate outfit;
pixel art;
humanized;
anthroified;
monster boy; cute boy, femboy, girly
ass sniff;
ass sniffing;
butt sniffing;
churn; churning
churning balls; churning, churning balls
churning balls; churning balls, throbbing balls, veiny balls, sloshing balls
furrification;
male penetrating;
collarbone;
holding;
futanari penetrated; futasub
futanari transformation; penis growth, penis expansion
anal addict;
anal addiction;
canada; canadian
canadian flag: canadian;
blush stickers; blush
heterochromia;
censored identity;
aversarial noise;
questionable consent;
dubious consent;
interspecies;
happy sex; Happy, Sex
anal destruction; anal, huge insertion, impossible fit, anal tugging
animal humanoid;
kemonomimi;
animal ear headwear; fake animal ears
(color) inner ear fluff; (color) ear fluff
(color) inner-ear fluff; (color) ear fluff
animal genitalia on humanoid;
angry dragon;
ass bigger than head; huge ass
bald male;
bald man;
bespectacled;
bikini bottom;
bikini top removed; topless
binary;
bisexual;
bisexual female;
bisexual male;
bottom heavy; wide hips, thick thighs, big butt
buttslut;
claw; claws
fully clothed;
clone;
crotch;
face;
profile;
erect penis; erection
full body: upper body only, lower body only, head out of frame, head only, chest shot, butt shot, crotch shot, feet out of frame, cowboy shot;
cowboy shot: upper body only, lower body only, head out of frame, head only, chest shot, butt shot, crotch shot;

-/ Temporary Artist Tag Removal
woomochi;
yuta agc;
fellatrix;
ignotoz;
zankuro;
popporunga;
nisetanaka;
om (nk2007);
metata;
dop;
doplino;
om;
nk2007;
original character;
waamudraws;
sparrow (artist);
basukechi;
cpt.lovers;
original;
fugtrup;
pixiewillow;
shadman;
nyl2;
scrag boy;
nynx;
rn;
leedash2;

-/ Redundant Publishers/Studios
namco;
bandai;
bandai namco;
dc;
dc comics;
squaresoft;
square enix;
nintendo;
capcom;
christian louboutin (brand);
angelica von eustest;
elisabeth von elstein;
anti-spiral;
antispiral;
antispiral nia;
costco;
disney; 
disney channel;
disney xd;
doa; dead or alive
gainax;
gainaxing;
gainaxtop;
game freak;
cho chang;
franchise;
pin-point;
pixiv;
pixels;
pixelated;
place name;
sega;
shadman universe homer;
nijisanji;
nikke;
steven universe;
konami;
emma watson;
hermione granger;
hogwarts;
hogwarts school uniform;
hololive english; hololive
dragon quest 3; dq3;
dragon quest iii; dq3;
rosalina; princess rosalina

- Franchise Redundancy
pokemon (anime);
pokemon bw;
pokemon dppt (anime);
pokemon sm;
pokemon swsh;
gen 1 pokemon;
gen 2 pokemon;
gen 3 pokemon;
gen 4 pokemon;
gen 5 pokemon;
gen 6 pokemon;
gen 7 pokemon;
gen 8 pokemon;
generation 1 pokemon;
generation 2 pokemon;
generation 3 pokemon;
generation 4 pokemon;
generation 5 pokemon;
generation 6 pokemon;
generation 7 pokemon;
generation 8 pokemon;
generation 9 pokemon;

---------------------- Aliases ----------------------
-/ Age
adult and teenager; age difference
parent and child; age difference
parent; age difference
age regression; aged down
aged down; Lolification
aged up; Milfification [.kusuri, yakuzen kusuri]

aged up; Milfification [.kusuri, yakuzen kusuri]
milfification; Milfification
aged down; Lolification
lolification; Lolification
lollification; Lolification
lolification; Lolification
shotafication; Shotafication

male focus: Lolification; Shotafication
femboy, solo: Lolification; Shotafication
femboy, solo focus: Lolification; Shotafication
1boy, solo: Lolification; Shotafication
1boy, solo focus: Lolification; Shotafication

young; Cute
young anthro; cub
cub; Cute
child; Cute
preschooler; Cute
preteen; Cute
teen; Cute

female cub; Cute Girl
oppai loli; Cute Girl, huge breasts
loli; Cute Girl
Loli; Cute Girl

male cub; Cute Boy
shota; Cute Boy
Shota; Cute Boy

femboy: Cute; Cute Boy
male focus: Cute; Cute Boy
cute boy: Cute; Cute Boy
Cute; Cute Girl

infant sex; Very Cute
infant; Very Cute
neoteny; Very Cute
baby; Very Cute
toddler; Very Cute
newborn baby; Very Cute
toddlercon; Very Cute
old man; older male
older man; older male
older male; [age difference]

-/ Anthro
anthro female; anthro, furry female
anthro male; anthro, furry male
anthro only; anthro
anthro solo; anthro, solo

-/ Background
monochrome background; simple background
transparent background; simple background

-/ Bestiality
Horse; horse, bestiality
Wolf; wolf, bestiality
Dog; dog, bestiality
Pig; pig, bestiality
1monster; monster
Monster; monster

horse cock; horse penis
horsecock; horse penis
DHP: horse penis; disembodied equine penis
disembodied penis: horse penis; disembodied equine penis
horse penis; equine penis [disembodied equine penis]

wolf cock; dog penis
wolfcock; dog penis
wolf penis; dog penis
knotted penis; dog penis
dog cock; dog penis
dogcock; dog penis
DHP: dog penis; disembodied canine penis
disembodied penis: dog penis; disembodied canine penis
dog penis; canine penis [disembodied canine penis]

pig cock; pig penis
pigcock; pig penis
DHP: pig penis; disembodied porcine penis
disembodied penis: pig penis; disembodied porcine penis
pig penis; porcine penis [disembodied porcine penis]

horse penis; 
dog penis; 
pig penis; 

equine penis: animal penis;
disembodied equine penis: animal penis;
canine penis: animal penis;
disembodied canine penis: animal penis;
porcine penis: animal penis;
disembodied porcine penis: animal penis;

1animal; bestiality
2animals; bestiality
3animals; bestiality
1dog; bestiality, dog
2dogs; bestiality, dog, multiple dogs
3dogs; bestiality, dog, multiple dogs
1wolf; bestiality, wolf
2wolves; bestiality, wolf, multiple wolves
3wolves; bestiality, wolf, multiple wolves
1horse; bestiality, horse
2horses; bestiality, horse, multiple horses
3horses; bestiality, horse, multiple horses

horse: 1boy; [femboy, male focus, yaoi, equine]
horse: 2boys; multiple horses [femboy, male focus, yaoi, equine]
horse: multiple boys; multiple horses [femboy, male focus, yaoi, equine]
dog: 1boy; [femboy, male focus, yaoi, canine]
dog: 2boys; multiple dogs [femboy, male focus, yaoi, canine]
dog: multiple boys; multiple dogs [femboy, male focus, yaoi, canine]
wolf: 1boy; [femboy, male focus, yaoi, canine]
wolf: 2boys; multiple wolves [femboy, male focus, yaoi, canine]
wolf: multiple boys; multiple wolves [femboy, male focus, yaoi, canine]

feral on female; feral on female, bestiality
feral on male; feral on male, bestiality
feral on futa; feral on futa, bestiality
futa on feral; futa on feral, bestiality, human penetrating, feral penetrated
animal penetrating; bestiality
animal with female; bestiality, feral on female

bestiality: hetero;

-/ Body (Butts)
butt; ass
big ass; big butt
buttcrack; butt crack
apple butt; big butt
ass dough; skindentation
ass eating; anilingus
ass inflation; ass growth, ass expansion, huge ass
ass juice; anal fluid
anus focus; anus, ass focus, close-up
anus only; anus, ass shot, close-up
anus visible through clothes; covered anus
donut anus; plump anus
eating ass; anilingus
enormous butt; huge ass
enormous ass; huge ass

-/ Body (Genitals)
big breasts; large breasts
big cleavage; large breasts, cleavage
veiny breasts;

areola peeking; areola slip
areola peek; areola slip
areolas peek; areola slip
big areola; large areolas
big areolas; large areolas

genital beading;
genital fluids; Fluid

absurdly large cock; hyper penis
absurdly large penis; hyper penis
bent penis; half-erect
big cock; large penis
big penis; large penis
erect; erection
flaccid penis; flaccid
dick on chest; penis on chest
dick; penis
vein;

ball smother; balls smothering
balls smother; balls smothering
ball smothering; balls smothering
balls between thighs; balls between thighs, ball squish, thigh squish
big balls; large balls
big balls small penis; huge balls, small penis, micropenis
big balls; large balls

vagina; pussy
innie pussy; pussy, Peach
backpussy; pussy
between labia; pussy floss

-/ Body (Other)
otoko-no-ko; cute boy, femboy, girly

-/ Camera
backlighting; lit from behind, shade
backlight; lit from behind, shade
backlit; lit from behind, shade
backside; from behind, ass focus
backshots; from behind, ass focus
behind view; from behind
straight-on; from front, facing forward
away; facing away
front; from front
behind; from behind
side; from side
above; from above
below; from below
front side; from front, from side
side front; from front, from side
behind side; from behind, from side
side behind; from behind, from side
front above; from front, from above
above front; from front, from above
side above; from side, from above
above side; from side, from above
behind above; from behind, from above
above behind; from behind, from above

front side above; from front, from side, from above
front above side; from front, from side, from above
above front side; from front, from side, from above
side front above; from front, from side, from above
side above front; from front, from side, from above
above side front; from front, from side, from above
behind side above; from behind, from side, from above
behind above side; from behind, from side, from above
above behind side; from behind, from side, from above
side behind above; from behind, from side, from above
side above behind; from behind, from side, from above
above side behind; from behind, from side, from above


-/ Clothing Items
clothing; fully clothed
clothed female; fully clothed
clothed male; fully clothed
clothed; fully clothed
clothes; fully clothed
completely naked; completely nude
completely nude female; completely nude
completely nude futanari; completely nude
mini top hat; mini hat, top hat
military cap; military hat, peaked cap
santa costume; santa outfit

-/ Clothing Actions

-/ Demons
demon eyes;
demon boy; demon
demon girl; demon
demon tail; spade tail
demon wings; bat wings, back wings
demon horns; curved horns [oni horns, curled horns, small horns, forehead horns]
curved horns: demon horns;
cow horns: demon horns;
curled horns: demon horns;
goat horns: demon horns;
oni horns: demon horns;
forehead horns: demon horns;

-/ Exhibitionism
exhibitionist; exhibitionism
public exposure; public indecency, exhibitionism
public masturbation; public indecency, exhibitionism, masturbation
public nudity; public indecency, exhibitionism, nude
public topless; public indecency, exhibitionism, topless
public bottomless; public indecency, exhibitionism, bottomless

-/ Exposure
exposed breasts; breasts out
pussy out; exposed pussy
anus out; exposed anus

-/ Expressions
@ @; spiral eyes
@_@; spiral eyes
^ ^; eyes closed, Happy
^_^; eyes closed, Happy
^^^; notice lines
+_+; Sparkle
= =; eyes closed, Tired
> <; eyes closed, v-shaped eyebrows
>_<; eyes closed, v-shaped eyebrows, frown, wavy mouth
moaning; twitching, trembling, open mouth, :o, looking pleasured
horny female; aroused
in heat; aroused
evil face; rape face
evil smile; rape face, smile
bedroom eyes; Seductive
emotionless female; emotionless
kuudere; emotionless
emotionless; emotionless, expressionless, kuudere
endured face; Torogao
enduring face; Torogao
angry face; Angry
angry sub; Angry

-/ Expression Aliases
Smile; Happy
Smiling; Happy
Chuckle; Amused
Heh; Amused
Star; Sparkle
Starry; Sparkle
Spark; Sparkle
Wowzers; Sparkle
Laugh; Laughing
Laughter; Laughing
Haha; Laughing
Sleepy; Sleep
Sleeping; Sleep
Relax; Sleep
Relaxed; Sleep
Relaxing; Sleep
Tease; Teasing
Smug; Teasing
Mock; Mocking
Grin; Mocking
Evil; Mocking
Sinister; Mocking
Confusion; Confused
Curious; Confused
Baffled; Befuddled
Huh; Befuddled
Sad; Worried
Worry; Worried
Worrying; Worried
Exhausted; Tired
Panicing; Panic
Panicking; Panic
Panick; Panic
Surprise; Surprised
Suprised; Surprised
Suprise; Surprised
Shocked; Shock
Frown; Annoyed
Frowning; Annoyed
Annoy; Annoyed
Grumpy; Annoyed
Pout; Annoyed
Pouting; Annoyed
Anger; Angry
Glare; Angry
Glaring; Angry
Furious; Fury
Rage; Fury
Shade; Scared
Shaded; Scared
Terror; Scared
Terrified; Scared
Afraid; Scared
Cry; Crying
Tears; Crying
Sob; Crying
Sobbing; Crying
Blushy; Blush
Blushing; Blush
Flirt; Flirting
Flirty; Flirting
Seductive; Flirting
Aroused; Horny
Pent; Pent-Up
Pent up; Pent-Up
Pentup; Pent-Up
Pent Up; Pent-Up
Pent-up; Pent-Up
Awesome; Awe
Amazed; Awe
Excite; Excited
Erect; Excited
Drool; Excited
Drooling; Excited
Dripping; Excited
Worship; Love
Pleasure; Pleasured
Pervert; Perverted
Lewd; Perverted
Naughty; Naughty Face
Kusogaki; Mesugaki

-/ Expression Arousal Assignment
- L0
Happy, Arousal: Arousal; L0
Amused, Arousal: Arousal; L0
Joy, Arousal: Arousal; L0
Sparkle, Arousal: Arousal; L0
Laughing, Arousal: Arousal; L0
Sleep, Arousal: Arousal; L0
Teasing, Arousal: Arousal; L0
Mocking, Arousal: Arousal; L0
Confused, Arousal: Arousal; L0
Befuddled, Arousal: Arousal; L0
Worried, Arousal: Arousal; L0
Tired, Arousal: Arousal; L0
Panic, Arousal: Arousal; L0
Surprised, Arousal: Arousal; L0
Shock, Arousal: Arousal; L0
Annoyed, Arousal: Arousal; L0
Angry, Arousal: Arousal; L0
Fury, Arousal: Arousal; L0
Scared, Arousal: Arousal; L0
Crying, Arousal: Arousal; L0
- L1
Blushy, Arousal: Arousal; L1
Flirting, Arousal: Arousal; L1
Horny, Arousal: Arousal; L1
Pent-Up, Arousal: Arousal; L1
Awe, Arousal: Arousal; L1
- L2
Excited, Arousal: Arousal; L2
Love, Arousal: Arousal; L2
Pleasured, Arousal: Arousal; L2
Perverted, Arousal: Arousal; L2
Forced, Arousal: Arousal; L2
- L3
Orgasm, Arousal: Arousal; L3
Ahegao, Arousal: Arousal; L3
Torogao, Arousal: Arousal; L3
- L4
Afterglow, Arousal: Arousal; L4
Broken, Arousal: Arousal; L4

pussy, L0: L0;
pussy, L1: L1; blush, pussy juice
pussy, L2: L2; blush, sweat, pussy juice, excessive pussy juice, pussy juice string
pussy, L3: L3; blush, sweat, pussy juice, excessive pussy juice, pussy juice string, squirting
pussy, L4: L4; blush, sweat, excessive sweat, steaming body, pussy juice

penis, L0: L0; flaccid
penis, L1: L1; blush, erection, precum
penis, L2: L2; blush, sweat, erection, precum, excessive precum, precum squirt
balls, L3: L3; L3, clenched balls, veiny balls, throbbing balls
penis, L3: L3; blush, sweat, erection, ejaculation, cumshot, clenched balls, veiny balls, throbbing balls
penis, L4: L4; blush, sweat, excessive sweat, steaming body, flaccid, after ejaculation, cum

L0;
L1; Blush
L2; Blush, Sweat
L3; Blush, Sweat, hands-free
L4; Blush, Sweat, afterglow

-/ Eyes
dashed eyes;
heart shaped pupils; heart-shaped pupils
hearts in eyes; heart-shaped pupils
heart eyes; heart-shaped pupils
heart pupils; heart-shaped pupils

star shaped pupils; star pupils
star-shaped pupils; star pupils
starry pupils; star pupils
star eyes; star pupils
starry eyes; star pupils

swirly eyes; spiral eyes
swirly pupils; spiral eyes
swirl pupils; spiral eyes
swirling pupils; spiral eyes
spiral pupils; spiral eyes
spiral-shaped pupils; spiral eyes
hypnotic eyes; spiral eyes, hypnosis, glowing eyes

heart-shaped pupills: symbol-shaped pupils;
diamond shaped pupils: symbol-shaped pupils;
star pupils: symbol-shaped pupils;
diamond pupils: symbol-shaped pupils;
ringed pupils: symbol-shaped pupils;
symbol-shaped pupills;

-/ Hair
absurdly long hair; long hair
bangs over eyes; hair over eyes, obscured eyes
bangs over one eye; hair over one eye

-/ Nudity
naked; nude
completely naked; completely nude
naked with shoes on; nude
bare arms;
bare ass;
bare back;
bare breasts;
bare hips;
bare legs;
bare shoulders;

-/ Partner
assertive female; femdom
offscreen male; DHP [Offscreen, mostly offscreen male]

-/ Position
sixty-nine; 69
sixty-nine position; 69
sixty nine; 69
sixty nine position; 69
69; 69 position
accidentally stuck; stuck
autofacial; cum on own face, facial
autorimming; autoanilingus
autorimjob; autoanilingus
back arching orgasm; arched back, orgasm, motion lines, twitching, trembling
back-arching orgasm; arched back, orgasm, motion lines, twitching, trembling
bent over table; bending forward, on table
bent over desk; bending forward, on desk
bending forward; bent over, leaning forward

-/ Print
bovine asthetic; cow print
cow-print; cow print
cow print: (color) thighhighs; cow-print thighhighs
cow print: (color) elbow gloves; cow-print elbow gloves
cow print: (color) bikini; cow-print bikini
cow print: (color) micro bikini; cow-print bikini, micro bikini
cow print;

-/ Race

-/ Robots/Mechanization
mechanized: (color) skin; (color) body, android
mechanized: (color) fur; (color) body, android
mechanized: (color) countershading; (color) countershading, (color) trim
cybernetics; cyborg
cybernetic; cyborg
female robot; android
male robot; android
humanoid robot; android
prosthesis; prosthetic
prosthetic arm: prosthetic;
prosthetic arms: prosthetic;
prosthetic leg: prosthetic;
prosthetic legs: prosthetic;

-/ Sex (Shortcuts)
insertion; Insertion
after sex; Aftermath
after spitroast; Aftermath
fucked into submission; Afterglow, Aftermath
fucked senseless; Broken
after fellatio; after oral, Aftermath
balls deep cum; deep insertion, ejaculation, cum inside, Sex
cum while penetrated; hands-free, Ejaculation, orgasm
cumming from anal sex; hands-free, Ejaculation, orgasm
cumming from giving oral; hands-free, Ejaculation, orgasm
cumming from smell; hands-free, Ejaculation, orgasm
cumming inside; cum inside, Ejaculation
cumming while penetrated; hands-free, Ejaculation, orgasm
cumming while penetrating; cum inside, Ejaculation, orgasm
cumshot; Ejaculation
ejaculating cum; Ejaculation
ejaculating while penetrated; hands-free, Ejaculation, orgasm
ejaculation while penetrated; hands-free, Ejaculation, orgasm

-/ Sex (Toys)

-/ Sex (Misc)
abdominal bulge; stomach bulge
belly bulge; stomach bulge
all the way to the base; deep insertion, balls deep
anal cum expulsion; anal, cum expulsion, anal tugging
anal fluid; anal juice
anal insertion; anal, Insertion
anal grip; anal tugging
anal balls; anal object insertion, anal
anal lips; anus
anal orgasm; anal, anal sex, twitching, trembling, orgasm, motion lines
anal penetration; anal
anal rape; anal, anal sex, rape
anal storage; anal object insertion
anal threading; anal, all the way through
anal training; anal object insertion
female ejaculation; Squirting

-/ Weirdly Tagged Genders
solo futa; 1futa, solo
solo futanari; 1futa, solo
1futanari; 1futa
1futas; 1futa
1futa; 1girl, futanari
2futanari; 2futa
2futas; 2futa
2futa; 2girls, futanari
3futanari; 3futa
3futas; 3futa
3futa; 3girls, futanari
4futanari; 4futa
4futas; 4futa
4futa; 4girls, futanari
5futanari; 5futa
5futas; 5futa
5futa; 5girls, futanari
6futanari; 6futa
6futas; 6futa
6futa; 6girls, futanari
6+futanari; 6+futa
6+futas; 6+futa
6+futa; 6+girls, futanari
1femboy; 1boy, femboy
2femboys; 2boys, multiple boys, femboy
2femboys1girl; 2boys, multiple boys, femboy, 1girl
1male; 1boy
1boy1girl; 1boy, 1girl, hetero
1woman; 1girl
1female; 1girl
2women; 2girls
2females; 2girls
3women; 3girls
3females; 3girls
1girl1futa; 2girls, futanari, futa on female
1girl2futa; 3girls, futanari, futa on female
2girls1futa; 3girls, futanari, futa on female
1boy2girls; 1boy, 2girls, ffm threesome, multiple girls
1girl2boys; 1girl, 2boys, mmf threesome, multiple boys
voluptuous; plump, curvy, extra thicc, wide hips, thick thighs
voluptuous futa; futanari, plump, curvy, extra thicc, wide hips, thick thighs
voluptuous futanari; futanari, plump, curvy, extra thicc, wide hips, thick thighs
voluptuous female; plump, curvy, extra thicc, wide hips, thick thighs
voluptuous male; plump, curvy, extra thicc, wide hips, thick thighs
curvaceous; plump, wide hips, thick thighs
curvy female; curvy
curvy figure; curvy
curvy hips; wide hips
chubby futa; futanari, plump, chubby
chubby futanari; futanari, plump, chubby
chubby female; plump, chubby
chubby male; plump, chubby
futa sans pussy: pussy, cleft of venus, fat mons, clitoris, clitoral hood;
futa sans pussy;
futanari masturbation; futanari, masturbation, hand on own penis
futanari pov; futa pov, pov breasts, Crotch
male only; 1boy, solo, femboy, male focus
male; 1boy
cute male; Cute Boy
female; 1girl
female only; 1girl, solo, female focus
femboy on female; femboy on female, hetero, 1boy, Cute Boy, 1girl
androgynous; femboy



`;

var cleaningArrayFinal = `
---------------------- Transformation ----------------------
-/ Futafication

-/ Goblinification

-/ Mechanization

-/ Milfification
Shotafication: plump; petite
Shotafication: curvy; petite
Shotafication: toned; petite
Shotafication: wide hips; petite
Shotafication: thick thighs; petite
Shotafication: gigantic breasts; flat chest
Shotafication: huge breasts; flat chest
Shotafication: large breasts; flat chest
Shotafication: medium breasts; flat chest
Shotafication: pubic stubble;
Shotafication: Shortstackify;
Shotafication: Shortstackification;
Shotafication: Milfification;
Shotafication: long legs;
Shotafication: 1girl; 1boy [hetero, mother and son, siblings]
Shotafication: female focus; male focus [hetero, mother and son, siblings]
Shotafication: pussy; [hetero, mother and son, siblings]
Shotafication: big pussy; [hetero, mother and son, siblings]
Shotafication: hyper pussy; [hetero, mother and son, siblings]
Shotafication: cleft of venus; [hetero, mother and son, siblings]
Shotafication: fat mons; [hetero, mother and son, siblings]
Shotafication: plump labia; [hetero, mother and son, siblings]
Shotafication: peach pussy; [hetero, mother and son, siblings]
Shotafication: pussy juice; [hetero, mother and son, siblings]
Shotafication: excessive pussy juice; [hetero, mother and son, siblings]
Shotafication: pussy juice string; [hetero, mother and son, siblings]
Shotafication: pussy juice trail; [hetero, mother and son, siblings]
Shotafication: pussy juice puddle; [hetero, mother and son, siblings]
Shotafication: cute girl; cute boy [hetero, mother and son, siblings]
Shotafication: loli; shota [hetero, mother and son, siblings]
Shotafication; cute boy, shota, child, young
Shotafication; 

Lolification: plump; petite
Lolification: curvy; petite
Lolification: toned; petite
Lolification: wide hips; petite
Lolification: thick thighs; petite
Lolification: gigantic breasts; small breasts [flat chest]
Lolification: gigantic breasts; flat chest
Lolification: huge breasts; flat chest [small breasts]
Lolification: huge breasts; small breasts
Lolification: large breasts; flat chest [small breasts]
Lolification: large breasts; small breasts
Lolification: medium breasts; flat chest [small breasts]
Lolification: medium breasts; small breasts
Lolification: pubic stubble;
Lolification: long legs;
Lolification: tall;
Lolification: taller female; [mother and daughter]
Lolification: 1girl; 1girl, Cute Girl
Lolification: Shortstackify;
Lolification: Shortstackification;
Lolification: Milfification;
Lolification; Cute Girl
Lolification; 

Milfification: muscular;
Milfification: muscular female;
Milfification: toned;
Milfification: toned female;
Milfification: athletic;
Milfification: athletic female;
Milfification: biceps;
Milfification: abs;
Milfification: narrow waist;
Milfification: skinny;
Milfification: thin;
Milfification: petite; plump
Milfification: Cute Girl; plump, curvy, wide hips, thick thighs
Milfification: Cute Boy; plump, curvy, wide hips, thick thighs, femboy, girly
Milfification: cute girl; plump, curvy, wide hips, thick thighs
Milfification: cute boy; plump, curvy, wide hips, thick thighs, femboy, girly
Milfification: flat chest; huge breasts [femboy]
Milfification: flat chest; huge breasts [male focus]
Milfification: small breasts; huge breasts
Milfification: child; 
Milfification: young; 
Milfification: female pubic hair; pubic stubble
Milfification: (color) pubic hair; 
Milfification: armpit hair; armpit stubble
Milfification, femboy: huge breasts; flat chest
Milfification; plump, curvy, wide hips, thick thighs

-/ Shortstackification
shortstackify; Shortstackification
shortstackification; Shortstackification
Shortstackify; Shortstackification
Shortstackification: skinny;
Shortstackification: thin;
Shortstackification: tall, taller female, long legs, petite; 
Shortstackification: muscular female; 
Shortstackification; shortstack, wide hips, thick thighs

---------------------- Culling ----------------------
-/ Camera Culling

-/ Complex Culling Rules

---------------------- Final Cleanup ----------------------
-/ bodyparts removal (TEMPORARY)
- lower body only
lower body only; lower body only, head out of frame, no hands, no wings, no breasts, no nipples
head out of frame; head out of frame, bald, remove ears, remove horns, no forehead, no expression, remove eyes, remove mouth

lower body only: nipple tug;
lower body only: nipple tweak;
lower body only: nipple penetration;
lower body only: nipple insertion;
lower body only: nipple sex;
lower body only: nipple bar;
lower body only: nipple chain;
lower body only: nipple tassel;
lower body only: head tilt;
lower body only: single head tentacle;
lower body only: 2 head tentacles;
lower body only: 3 head tentacles;
lower body only: short head tentacles;
lower body only: long head tentacles;
lower body only: head tentacles;
- bald;
bald: no hair;
head back: hair tuft; [from behind, from side]
bald: hair tuft;

bald: comb over;

bald: tentacle hair;
head out of frame: bald;
head out of frame: head tuft;
- remove ears;

- no horns
head back; head back, remove horns [from behind, from side]

remove horns: broken horns;
remove horns: one horn broken;
- no forehead
head back; head back, no forehead [from behind, from side]
no forehead: (color) forehead mark;
no forehead: (color) forehead symbol;
no forehead: (color) forehead horns;
no forehead: (color) facial tattoo;

no forehead: braided bangs;
- no expression;
obscured face; obscured face, no expression, remove eyes, remove mouth
from behind, facing away: facing away; facing away, no expression, remove eyes, no forehead, remove mouth
head back; head back, no expression [from behind, from side]
no expression: (color) blush;
no expression: shaded face;
no expression: nervous;
no expression: panic;
no expression: seductive;
no expression: naughty face;
no expression: female pervert;
no expression: crazy;
no expression: ahegao;
no expression: excited;
no expression: shock;
no expression: surprise;
no expression: fucked silly;
no expression: looking pleasured;
no expression: curious;
no expression: confused;
no expression: kuudere;
no expression: expressionless;
no expression: sigh;
no expression: snoring;
no expression: annoyed;
no expression: angry;
no expression: scared;
no expression: animal nose;
- remove eyes;
no eyes; no eyes, remove eyes
obscured eyes; obscured eyes, remove eyes
head back; head back, remove eyes [from behind, from side]

remove eyes: crazy eyes;
remove eyes: wink;
remove eyes: wince;
remove eyes: v over eye;

remove eyes: eyeless;
remove eyes: crying;
remove eyes: crying with eyes open;
remove eyes: tears;
remove eyes: tears of joy;
remove eyes: rolling eyes;
remove eyes: cross-eyed;
remove eyes: penis awe;
remove eyes: compound eyes;
remove eyes: half-closed eyes;
remove eyes: one eye half closed;
remove eyes: narrowed eyes;
remove eyes: looking at viewer;
remove eyes: looking down;
remove eyes: looking down at viewer;
remove eyes: looking up;
remove eyes: looking to the side;
remove eyes: looking afar;
remove eyes: looking back;
remove eyes: looking at penis;
remove eyes: bloodshot eyes;
remove eyes: blank eyes;
remove eyes: empty eyes;

remove eyes: @.@;

remove eyes: raised inner eyebrows;
remove eyes: v-shaped eyebrows;
remove eyes: furrowed brows;
remove eyes: glare;

remove eyes: looking at viewer;
remove eyes: looking down at viewer;
remove eyes: looking down;
remove eyes: looking to the side;
remove eyes: looking up;
- remove mouth
obscured mouth; obscured mouth, remove mouth

remove mouth: (color) tongue;
remove mouth: smile;
remove mouth: closed mouth;
remove mouth: open mouth;
remove mouth: licking lips;
remove mouth: tongue out;
remove mouth: grin;
remove mouth: smug;
remove mouth: frown;
remove mouth: o-face;
remove mouth: wavy mouth;
remove mouth: closed mouth;
remove mouth: open mouth;
remove mouth: lips parted;
remove mouth: closed mouth;
remove mouth: clenched teeth;
remove mouth: biting lip;
remove mouth: licking lips;
remove mouth: pout;
remove mouth: upper teeth only;
remove mouth: drool;
remove mouth: saliva;
remove mouth: heavy breathing;
remove mouth: cheek bulge;
remove mouth: pout;
- open mouth
open mouth: closed mouth;
open mouth: lips parted;
open mouth: clenched teeth;
open mouth: upper teeth only;
- closed mouth
closed mouth: open mouth;
closed mouth: open smile;
closed mouth: open frown;
closed mouth: teeth;
closed mouth: open frown;
closed mouth: upper teeth only;
closed mouth: sharp teeth;
- no hands;
no hands: arms crossed;
no hands: (color) winged arms;
no hands: (color) wrist fluff;
arm wings; arm wings, no hands, no handwear
no hands: hooved hands;
- no breasts
no breasts: flat chest;
flat chest; flat chest, no breasts
no breasts: small breasts;
no breasts: medium breasts;
no breasts: large breasts;
no breasts: huge breasts;
no breasts: gigantic breasts;
no breasts: hyper breasts;
no breasts: veiny breasts;
no breasts: perky breasts;
no breasts: sagging breasts;
no breasts: breasts apart;
no breasts: cleavage;
no breasts: backboob;
no breasts: sideboob;
- no nipples
no nipples: lactation through clothes;
no nipples: lactation;

- upper body only

upper body only: (color) anal tail;
upper body only: (color) fake tail;
upper body only: (color) buttplug;
upper body only: (color) heart buttplug;
upper body only: sweaty butt;
upper body only: sweaty anus;
upper body only: tramp stamp;

upper body only: anus outline;
upper body only: anal hook;
upper body only: spread anus;
upper body only: spreading anus;
upper body only: spread butt;
upper body only: spreading own butt;

upper body only: after anal;

upper body only: standing;
upper body only: kneeling;
upper body only: sitting;
upper body only: squatting;
upper body only: legs apart;
upper body only: one leg up;
upper body only: legs up;
upper body only: folded;

- no tail
cull tail; remove tail
tail out of frame; remove tail
remove tail: (color) tail;
remove tail: (color)-striped tail;
remove tail: light (color) tail;
remove tail: dark (color) tail;
remove tail: light tail;
remove tail: dark tail;
remove tail: dipstick tail;
remove tail: (color) tail tip;
remove tail: light (color) tail tip;
remove tail: dark (color) tail tip;
remove tail: light tail tip;
remove tail: dark tail tip;
remove tail: tail;
remove tail: long tail;
remove tail: short tail;
remove tail: stub tail;
remove tail: stubby tail;
remove tail: fluffy tail;
remove tail: thin tail;
remove tail: small tail;
remove tail: large tail;
remove tail: huge tail;
remove tail: curled tail;
remove tail: spiked tail;
remove tail: animal tail;
remove tail: cat tail;
remove tail: tiger tail;
remove tail: squirrel tail;
remove tail: dog tail;
remove tail: fox tail;

- no penis
no penis: (color) small bulge;
no penis: (color) bulge;
no penis: (color) large bulge;
no penis: (color) covered penis;
no penis: (color) erection under clothes;
small bulge; small bulge, no penis
bulge; bulge, no penis
large bulge; large bulge, no penis
covered penis; covered penis, no penis
no penis: (color) chastity cage;
no penis: (color) flat cage;
flat cage; flat cage, <lora:concept - flat cage - grolken:1>

no penis: (color) penis in panties;
no penis: erection;
no penis: flaccid;
from behind, backsack, solo, small penis, penis: (color) penis, foreskin, glans; [hands free, from side]
from behind, backsack, solo: small penis, penis; [hands free, from side]
small bulge: no penis;
bulge: no penis;
large bulge: no penis;
covered penis: no penis;
from behind, backsack, solo: no penis;
- no balls
no penis: (color) balls outline;
small bulge; small bulge, no balls
bulge; bulge, no balls
large bulge; large bulge, no balls
balls outline; balls outline, no balls
no balls: (color) small balls;
no balls: (color) balls;
no balls, solo: (color) large balls;
no balls, solo: (color) huge balls;
no balls: (color) hyper balls;
no balls, solo: (color) saggy balls;
no balls, solo: (color) sagging balls;
no balls: (color) resting balls;
no balls, solo: (color) veiny balls;
no balls, solo: (color) throbbing balls;
no balls: (color) backsack;
no balls: (color) perineum;
small bulge; small bulge, no balls
bulge; bulge, no balls
large bulge; large bulge, no balls
balls outline; balls outline, no balls
- The exception list was added 2026-08-08. These four were the only rows in the
- family without it, and every futanari and girly row below carries it — so a
- solo futanari asking for a pussy lost it, because these fired first and the
- futanari row's own exception never got a say. The bodypart defaults made it
- visible: a character with no penis rule now gets a COLOURED one, which is what
- these rows match on.
- (color) pussy is in the list as well as bare pussy because establishRules
- expands (color) across the WHOLE line: the blue-penis copy of this rule gets
- "blue pussy" as its exception, which is exactly the character it has to spare.
solo, (color) penis: solo; solo, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
solo, (size) penis: solo; solo, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
solo, (color) balls: solo; solo, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
solo, (size) balls: solo; solo, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
futanari, (size) bulge: futanari; futanari, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
futanari, balls outline: futanari; futanari, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
futanari, (color) penis: futanari; futanari, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
futanari, (size) penis: futanari; futanari, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
futanari, (color) balls: futanari; futanari, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
futanari, (size) balls: futanari; futanari, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
futanari: pussy juice; [duo, trio, group, group sex, pussy]
futanari: pussy ejaculation; [duo, trio, group, group sex, pussy]
futanari: female orgasm; [duo, trio, group, group sex, pussy]
futanari: vaginal masturbation; masturbation, hand on own penis
futanari: vaginal fingering; masturbation, hand on own penis
futanari: vaginal; anal [duo, trio, group, group sex, pussy]
futanari: imminent vaginal; imminent anal [duo, trio, group, group sex, pussy]
futanari: vaginal prodding; anal prodding [duo, trio, group, group sex, pussy]
futanari: vaginal sex; anal sex [duo, trio, group, group sex, pussy]
futanari: vaginal object insertion; anal object insertion [duo, trio, group, group sex, pussy]
futanari: after vaginal; after anal [duo, trio, group, group sex, pussy]
futanari: vaginal prolapse; anal prolapse [duo, trio, group, group sex, pussy]
futanari: gaping pussy; gaping anus [duo, trio, group, group sex, pussy]
futanari: cum in pussy; cum in ass [duo, trio, group, group sex, pussy]
futanari: cum from pussy; cum from ass [duo, trio, group, group sex, pussy]
girly, (size) bulge: girly; girly, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
girly, balls outline: girly; girly, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
girly, (color) penis: girly; girly, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
girly, (size) penis: girly; girly, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
girly, (color) balls: girly; girly, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
girly, (size) balls: girly; girly, no pussy [duo, trio, group, group sex, pussy, (color) pussy]
girly: pussy juice; [duo, trio, group, group sex, pussy]
girly: pussy ejaculation; [duo, trio, group, group sex, pussy]
girly: female orgasm; [duo, trio, group, group sex, pussy]
girly: vaginal; anal [duo, trio, group, group sex, pussy]
girly: imminent vaginal; imminent anal [duo, trio, group, group sex, pussy]
girly: vaginal prodding; anal prodding [duo, trio, group, group sex, pussy]
girly: vaginal sex; anal sex [duo, trio, group, group sex, pussy]
girly: vaginal object insertion; anal object insertion [duo, trio, group, group sex, pussy]
girly: after vaginal; after anal [duo, trio, group, group sex, pussy]
girly: gaping pussy; gaping anus [duo, trio, group, group sex, pussy]
girly: vaginal prolapse; anal prolapse [duo, trio, group, group sex, pussy]
girly: cum in pussy; cum in ass [duo, trio, group, group sex, pussy]
girly: cum from pussy; cum from ass [duo, trio, group, group sex, pussy]
girly: vaginal masturbation; masturbation, hand on own penis
girly: vaginal fingering; masturbation, hand on own penis
cum on self; [futanari, girly]
cum on own face; [futanari, girly]
cum on own face; cum on own face, facial, cum
- no pussy
no pussy: (color) pussy;
no pussy: (color) clitoris;
no pussy: large clitoris;
no pussy: erect clitoris;
no pussy: fat mons;
no pussy: peach pussy;
no pussy: clitoral hood;
no pussy: pussy outline;
no pussy: covered pussy;
no pussy: pussy floss;
no pussy: spread pussy under clothes;
no pussy: pussy peek;
no pussy: cleft of venus;
no pussy: gaping pussy;
no pussy: cervix;
no pussy: after vaginal;
no pussy: spread pussy;
no pussy: hyper pussy;
- no feet
feet out of frame; feet out of frame, no feet
no feet: barefoot;
no feet: tiptoes;
no feet: toes;
no feet: soles;
no feet: hooved feet;
no feet: (color) hooves;
no feet: cloven hooves;
no feet: clawed feet;
no feet: 4 toes;
no feet: 3 toes;
no feet: long legs;
no feet: digitigrade;

- from front only
from behind: (color) navel ring;
from behind: (color) necklace;
from behind: (color) pendant;
from behind: (color) amulet;
from behind: (color) locket;
from behind: (color) magatama;
from behind: (color) neck ribbon;
from behind: (color) pentacle;
from behind: (color) neck bell;
from behind: (color) necktie;
from behind: (color) bowtie;
from behind: (color) neck tassel;
from behind: (color) shoulder sash;
from behind: (color) sash;
from behind: (color) areolas;
from behind: (color) nipples;
from behind: (color) nipple ring;
from behind: (color) nipple rings;
from behind: bouncing breasts;
from behind: navel;
from behind: midriff;
from behind: navel piercing;
from behind: covered navel;
from behind: pearl necklace;
from behind: prayer beads;
from behind: flower necklace;
from behind: lei;
from behind: unzipped;
from behind: partially unzipped;
from behind: fully unzipped;
from behind: plunging neckline;
from behind: flat chest;
from behind: pectorals;
from behind: small breasts;
from behind: medium breasts;
from behind: huge breasts; huge breasts, backboob
from behind: gigantic breasts; gigantic breasts, backboob
from behind: abs;
from behind: belly;
from behind: large areolas;
from behind: puffy areolas;
from behind: featureless chest;
from behind: no nipples;
from behind: covered nipples;
from behind: pasties;
from behind: small nipples;
from behind: big nipples;
from behind: huge nipples;
from behind: erect nipples;
from behind: nipple tug;
from behind: nipple tweak;
from behind: inverted nipples;
from behind: gaping nipples;
from behind: nipple penetration;
from behind: nipple insertion;
from behind: nipple sex;
from behind: nipple bar;
from behind: nipple chain;
from behind: nipple tassel;
from behind: cat cutout;
from behind: cleavage window;
from behind: cleavage cutout;
from behind: nipple cutout;
from behind: navel cutout;
from behind: belt buckle;

-/ Fluid cleanup
male focus: pussy juice, pussy juice string, pussy juice trail, excessive pussy juice, pussy juice stain; [hetero, mother and son, 1girl]
solo, femboy: pussy juice, pussy juice string, pussy juice trail, excessive pussy juice, pussy juice stain; 
solo, pussy: precum, excessive precum, precum string, precum squirt, precum trail;
solo, pussy juice: precum, excessive precum, precum string, precum squirt, precum trail;

-/ Sizes and types cleanup
breasts; medium breasts
big anus: anus;
huge anus: anus, big anus;
hyper anus: anus, big anus;
solo focus; solo, solo focus;
clenching balls; clenched balls

solo, foreskin: penis; humanoid penis;
solo, humanoid penis: penis;
solo, equine penis: penis;
solo, canine penis: penis;
solo, porcine penis: penis;
solo, cetacean penis: penis;
solo, ovipositor penis: penis;
solo, tapering penis: penis;
solo, small penis: penis;
solo, large penis: penis;
solo, huge penis: penis;
solo, hyper penis: penis;
solo, gigantic penis: penis;
girthy penis; thick penis;

solo: penis; large penis, humanoid penis, foreskin
solo, small penis: large penis;
solo, hyper penis: large penis;
solo, gigantic penis: large penis;
solo, huge penis: large penis;

solo, chastity cage: large penis, huge penis, hyper penis, gigantic penis, foreskin, glans;

solo, small balls: balls;
solo, large balls: balls;
solo, huge balls: balls;
solo, gigantic balls: balls;
solo, hyper balls: balls;

solo, flat chest: small breasts, medium breasts, large breasts, huge breasts, gigantic breasts, hyper breasts;
solo, hyper breasts: large breasts, medium breasts, small breasts;
solo, gigantic breasts: large breasts, medium breasts, small breasts;
solo, huge breasts: large breasts, medium breasts, small breasts;
solo, large breasts: medium breasts, small breasts;
solo, small breasts: medium breasts;

-/ Unnecesary grouping/coloring
hand over one eye; hand over one eye, covering eye
hand over eye; hand over eye, covering eye
hand over own eye; hand over own eye, covering eye
covering eye; covering eye, obscured eye

hand over eyes; hands over eyes, covering eyes
hand over own eyes; hands over own eyes, covering eyes
hands over eyes; hands over eyes, covering eyes
hands over own eyes; hands over own eyes, covering eyes
covering eyes; covering eyes, obscured eyes

hand over mouth; hands over mouth, covering mouth
hands over mouth; hands over mouth, covering mouth
hand over own mouth; hands over own mouth, covering mouth
hands over own mouth; hands over own mouth, covering mouth
covering mouth; covering mouth, obscured mouth

-/ Keyword Incompatibilities
trio: duo, solo;
trio focus: duo focus, solo focus;
duo: solo;
duo focus: solo focus;
solo focus: solo;

6+girls: 1girl, 2girls, 3girls, 4girls, 5girls, 6girls;
6girls: 1girl, 2girls, 3girls, 4girls, 5girls;
5girls: 1girl, 2girls, 3girls, 4girls;
4girls: 1girl, 2girls, 3girls;
3girls: 1girl, 2girls;
2girls: 1girl;

6+boys: 1boy, 2boys, 3boys, 4boys, 5boys, 6boys;
6boys: 1boy, 2boys, 3boys, 4boys, 5boys;
5boys: 1boy, 2boys, 3boys, 4boys;
4boys: 1boy, 2boys, 3boys;
3boys: 1boy, 2boys;
2boys: 1boy;

head only: upper body only, chest up;
chest up: upper body only;

yuri: hetero;
yaoi: hetero;
futa on female: hetero, yaoi;
futa on male: hetero, yuri;
bestiality: hetero;

1girl: solo focus; solo focus, female focus [male focus, femboy]
femboy: solo focus; solo focus, male focus [female focus]

looking to the side: looking at viewer;
looking down: looking at viewer; [from below]
looking up: looking at viewer; [from above]
looking at penis: looking at viewer;
looking at own penis: looking at viewer;
looking at another: looking at viewer;

clenched teeth: teeth;
grin: teeth;
solo, anthro: feral;
quadrupedal: standing; standing, all fours
no legs: standing;
legless: standing;
biting lip;
vaginal: cleft of venus, fat mons, peach pussy;
from behind, vaginal: clitoris, clitoral hood, erect clitoris, large clitoris;
foreskin: penis; humanoid penis
glans: penis; humanoid penis
equine penis: penis;
canine penis: penis;
equine penis: disembodied penis; disembodied equine penis
canine penis: disembodied penis; disembodied canine penis
vaginal fingering: fingering;
anal fingering: fingering;

imminent vaginal: vaginal, vaginal sex;
imminent anal: anal, anal sex;
imminent oral: oral, fellatio, deepthroat, irrumatio;

pov crotch, pussyjob, pov penis: cleft of venus;
pov crotch, buttjob, pov penis: pussy;
pov crotch, buttjob, pov penis: cleft of venus;
pov crotch, buttjob, pov penis: clitoris;
pov crotch, buttjob, pov penis: clitoral hood;
pov crotch, buttjob, pov penis: small penis;
anal object insertion: anal sex;
vaginal object insertion: vaginal sex;
deep insertion: pov penis;
deep insertion: pov small penis;
legs apart; legs spread
wide stance; wide stance, legs spread
legs together: wide stance, legs spread;
knees together: wide stance, legs spread;
knees together feet apart: wide stance, legs spread;
crouching: deep squat;
rape: heart; [masochism, addicted to rape, enjoying rape]

cumshot: precum, excessive precum, precum squirt, precum string, precum puddle, precum trail;
hand on own penis: hands-free;
hands on own penis: hands-free;
breasts together; breasts squeezed together
squeezing breasts; breasts squeezed together
squeezing own breasts; breasts squeezed together
breast squeeze; breasts squeezed together
breasts squeeze; breasts squeezed together
breast squeezing; breasts squeezed together
breasts squeezing; breasts squeezed together
naizuri: paizuri, breasts squeezed together;
anal sex: sex;
vaginal sex: sex;
deepthroat: sex;
fellatio: sex;

-/ Expression Cleanup
Happy; 
Amused; 
Joy; 
Sparkle; 
Laughing; 
Sleep; 
Teasing; 
Mocking; 
Confused; 
Befuddled; 

Worried; 
Tired; 
Panic; 
Surprised; 
Shock; 
Annoyed; 
Angry; 
Fury; 
Scared; 
Crying; 

Blushy; 
Flirting; 
Horny; 
Pent-Up; 
Awe; 

Excited; 
Love; 
Pleasured; 
Perverted; 
Forced; 

Orgasm; 
Ahegao; 
Torogao; 

Afterglow; 
Broken; 

Rape Face; 
Crazy; 
Mesugaki; 
Naughty Face; 

-/ Shortcut Cleanup
Cute Boy; 
Male; 
Cute Girl; 
Female; 
Fleshy; 
Femboy; 
Milf; 
Shortstack; 
Plump; 
Chubby; 

Spellcasting;
Attacking;
Fire Breathing;
Biting;

Standing; 
Profile; 
Simple; 
Basic; 
On Stomach; 
On Front; 
On Back; 
On Side; 
Arms Up; 
Arms Behind Head; 
Arm Up; 
Arm Behind Head;
V; 
W; 

Forward; 
Front; 
Side; 
Away; 
Behind; 
Looking Back; 
Above; 
Below; 

Full Body;
Upper Body; 
Lower Body; 
Cowboy Shot; 
Head; 
Chest; 
Butt; 

Imminent; 
Prodding; 
Insertion; 
Sex; 
Internal; 
Ejaculation; 
Aftermath; 

Motion;
motion; 
Twitching; 
Heart; 
Blush; 
Steam; 
Sweat; 
Fluid; 
Squirting; 
Precum; 
Pussy Juice;

DHP; 
Crotch; 
Offscreen;

Male;
Female;

imminent masturbation: masturbation, hand on own penis, male masturbation, futa masturbation, penile masturbation, female masturbation, vaginal fingering, fingering self;

imminent: handjob, two-handed handjob, hand on penis, hands on penis, hand on another's penis, hands on another's penis; [oral, imminent oral]

imminent: paizuri; penis on chest, imminent paizuri [naizuri]
imminent: naizuri; penis on chest

imminent: thigh sex, pussyjob; [vaginal, imminent vaginal]

imminent: buttjob, hotdogging; [anal, imminent anal]

imminent: footjob, foot on penis, stepping on penis, foot on balls, stepping on balls;

imminent anal: anal, anal sex;
imminent vaginal: vaginal, vaginal sex;
prodding; [anal prodding, vaginal prodding, oral prodding]

anal prodding; anal prodding, imminent anal
vaginal prodding; vaginal prodding, imminent vaginal
solo prodding;

insertion;
solo insertion;

masturbation: sex; [vaginal sex, anal sex, fellatio, implied sex]
autopaizuri: sex; [vaginal sex, anal sex, fellatio, implied sex]
autofootjob: sex; [vaginal sex, anal sex, fellatio, implied sex]
autofellatio: sex; [vaginal sex, anal sex, fellatio, implied sex]
handjob: sex; [vaginal sex, anal sex, fellatio, implied sex]
thigh sex: sex; [vaginal sex, anal sex, fellatio, implied sex]
grinding: sex; [vaginal sex, anal sex, fellatio, implied sex]
humping: sex; [vaginal sex, anal sex, fellatio, implied sex]
pussyjob: sex; [vaginal sex, anal sex, fellatio, implied sex]
balljob: sex; [vaginal sex, anal sex, fellatio, implied sex]
buttjob: sex; [vaginal sex, anal sex, fellatio, implied sex]
hottdogging: sex; [vaginal sex, anal sex, fellatio, implied sex]
paizuri: sex; [vaginal sex, anal sex, fellatio, implied sex]
naizuri: sex; [vaginal sex, anal sex, fellatio, implied sex]
footjob: sex; [vaginal sex, anal sex, fellatio, implied sex]
solo sex;

climax;

internal; [internal anal, internal vaginal, internal oral, internal nipples]

cooldown;

pullout: huge insertion; 
pullout;

vaginal sex: glans; [internal vaginal]
vaginal sex: foreskin; [internal vaginal]
vaginal: glans; [internal vaginal]
vaginal: foreskin; [internal vaginal]

peach pussy: clitoral masturbation; clitoral stimulation
peach pussy: clitoral stimulation; female masturbation, vaginal masturbation
masturbation, ejaculation: cum inside; [after anal, after vaginal, after oral]
ejaculation: precum trail;

sounding rod: urethral penetration; urethral insertion
object in penis: urethral penetration; urethral insertion
urethral bead: urethral penetration; urethral insertion
urethral plug: urethral penetration; urethral insertion
dildos in penis: urethral penetration; urethral insertion
dildo in penis: urethreal penetration; urethral insertion
urethreal penetration; urethral insertion [penis in penis, penises in penis, tentacle in penis, tentacles in penis, finger in penis, tongue in penis, fingers in penis, urethral fingering, infested penis, infested urethra, worm in penis, worms in penis, worm in urethra, worms in urethra]

penis sex; penis in penis
penis docking; penis in penis
penis in penis: urethral insertion; urethral penetration
penis vore; cock vore
cock vore: urethral insertion; urethral penetration
finger in urethra: urethral insertion; urethral penetration
finger in penis: urethral insertion; urethral penetration
fingers in urethra: urethral insertion; urethral penetration
fingers in penis: urethral insertion; urethral penetration
urethral fingering: urethral insertion; urethral penetration
tongue in urethra: urethral insertion; urethral penetration
tongue in penis: urethral insertion; urethral penetration
tentacle in penis: urethral insertion; urethral penetration
tentacles in penis: urethral insertion; urethral penetration
worm in penis: urethral insertion; urethral penetration
worms in penis: urethral insertion; urethral penetration
infested urethra: urethral insertion; urethral penetration
penis infestation: urethral insertion; urethral penetration
penile infestation: urethral insertion; urethral penetration
urethral infestation: urethral insertion; urethral penetration
infested penis: urethral insertion; urethral penetration

imminent vaginal: human penetrating; [anal sex, fellatio]
imminent anal: human penetrating; [vaginal sex, fellatio]
imminent oral: human penetrating; [anal sex, vaginal sex]
vaginal prodding: human penetrating; [anal sex, fellatio]
anal prodding: human penetrating; [vaginal sex, fellatio]
oral prodding: human penetrating; [vaginal prodding, anal prodding]
after vaginal: human penetrating; [anal sex, fellatio]
after anal: human penetrating; [vaginal sex, fellatio]
after oral: human penetrating; [vaginal sex, fellatio]

player house;

long foreskin: foreskin;
hyper foreskin: foreskin;
unretracted foreskin: foreskin;
big areola;
big areolas;
erect areola;
erect areolas;
(color) nipples: (color) nipple;
(color) nipples: (color) areolas;
(color) nipples: (color) areola;

-/ System Keyword Cleanup
tagme;
cleanme;
lora;
laura;
debrand: rwby, ruby rose, weiss schnee, blake belladonna, yang xiao-long, pyrrha nikos, nora valkyrie, winter schnee, penny polendina, cinder, summer rose, salem, ao, akai;

-/ Body parts
eyes closed: (color) eyes;
eyes closed: light (color) eyes;
eyes closed: dark (color) eyes;
eyes closed: looking at viewer;
eyes closed: rolling eyes;
eyes closed: looking up;
eyes closed: looking down;

remove full body;
remove upper body;
remove head;
remove ears;
remove horns;
remove hair;
remove bangs;
remove eyebrows;
remove forehead;
remove expression;
remove eyelashes;
remove eyes;
remove sclera;
remove pupils;
remove mouth;
remove teeth;
remove tongue;
remove breasts;
remove nipples;
remove nipple covering;
remove shoulders;
remove chest;
remove back;
remove wings;
remove arms;
remove wrists;
remove hands;
remove fingers;
remove lower body;
remove legs;
remove tail;
remove ankles;
remove feet;
remove toes;
remove penis;
remove glans;
remove clit;
remove pussy;
remove bulge;
remove ass;
remove anus;

-/ Clothing
remove all clothes;
remove most clothes;
remove headwear;
remove hat;
remove helmet;
remove clothesForeheadwear;
remove facewear;
remove eyewear;
remove neckwear;
remove shoulderwear;
remove armwear;
remove sleeves;
remove wristwear;
remove handwear;
remove upperwear;
remove outer upperwear;
remove inner upperwear;
remove under upperwear;
remove pasties;
remove waistwear;
remove lowerwear;
remove outer lowerwear;
remove inner lowerwear;
remove under lowerwear;
remove maebari;
remove stockings;
remove pants;
remove shorts;
remove footwear;
remove socks;
remove shoes;

-/ Accessories
remove all accessories;
remove piercings;
remove tattoos;
remove necklaces;
remove rings;

-/ Temporary misc
female: cute; cute girl [cute boy]
female focus: cute; cute girl [cute boy]
1girl: cute; cute girl [cute boy]
male: cute; cute boy [cute girl]
male focus: cute; cute boy [cute girl]
1boy: cute; cute boy [cute girl]
cute;
female: furry; furry male [furry female]
male: furry; furry female [furry male]
furry;
(color) fur: fur;
(color) fur: body fur;
(color) eyebrows: eyebrows;
thin eyebrows: eyebrows;
thick eyebrows: eyebrows;
short eyebrows: eyebrows;
(color) eyelashes: eyelashes;
long eyelashes: eyelashes;
(color) eyeshadow: eyeshadow;
(color) eyeshadow: makeup;
(color) eyeliner: eyeliner;
(color) eyeliner: makeup;
(color) mascara: mascara;
(color) mascara: makeup;
(color) lips: makeup;
(color) hair streak; (color) streak
(color) hair streaks; (color) streaks
(color)-haired female; (color) hair
(color)-haired futa; (color) hair
(color)-eyed female; (color) eyes
(color)-eyed futa; (color) eyes
(color) hat: hat;
(color) hat: (color) headwear;
(color) hat: headwear;
(color) helmet: hat;
(color) helmet: (color) headwear;
(color) helmet: headwear;
(color) collar: collar;
(color) collar: neckwear;
bell collar: collar;
animal collar: collar;
(color) shirt: shirt;
long-sleeved shirt: long sleeves;
short-sleeved shirt: short sleeves;
medium-sleeved shirt: medium sleeves;
sleeveless shirt: sleeveless;
strapless shirt: strapless;
(color) shirt: topwear;
(color) shirt: upperwear;
shirt: topwear;
shirt: upperwear;
(color) dress: dress;
long-sleeved dress: long sleeves;
short-sleeved dress: short sleeves;
medium-sleeved dress: medium sleeves;
sleeveless dress: sleeveless;
strapless dress: strapless;
(color) dress: topwear;
dress: topwear;
(color) dress: upperwear;
dress: upperwear;
(color) kimono: kimono;
long-sleeved kimono: long sleeves;
short-sleeved kimono: short sleeves;
medium-sleeved kimono: medium sleeves;
sleeveless kimono: sleeveless;
strapless kimono: strapless;
(color) kimono: topwear;
kimono: topwear;
(color) kimono: upperwear;
kimono: upperwear;
(color) leotard: leotard;
long-sleeved leotard: long sleeves;
short-sleeved leotard: short sleeves;
medium-sleeved leotard: medium sleeves;
sleeveless leotard: sleeveless;
strapless leotard: strapless;
(color) leotard: topwear;
leotard: topwear;
(color) leotard: upperwear;
leotard: upperwear;
(color) sweater: sweater;
long-sleeved sweater: long sleeves;
short-sleeved sweater: short sleeves;
medium-sleeved sweater: medium sleeves;
sleeveless sweater: sleeveless;
(color) sweater: topwear;
sweater: topwear;
(color) sweater: upperwear;
sweater: upperwear;
(color) vest: vest;
long-sleeved vest: long sleeves;
short-sleeved vest: short sleeves;
medium-sleeved vest: medium sleeves;
sleeveless vest: sleeveless;
(color) vest: topwear;
vest: topwear;
(color) vest: upperwear;
vest: upperwear;
(color) hoodie: hoodie;
long-sleeved hoodie: long sleeves;
short-sleeved hoodie: short sleeves;
medium-sleeved hoodie: medium sleeves;
sleeveless hoodie: sleeveless;
(color) hoodie: topwear;
hoodie: topwear;
(color) hoodie: hood;
hoodie: hood;
(color) hoodie: upperwear;
hoodie: upperwear;
(color) coat: coat;
long-sleeved coat: long sleeves;
short-sleeved coat: short sleeves;
medium-sleeved coat: medium sleeves;
sleeveless coat: sleeveless;
(color) coat: topwear;
coat: topwear;
(color) coat: outerwear;
coat: outerwear;
(color) jacket: jacket;
long-sleeved jacket: long sleeves;
short-sleeved jacket: short sleeves;
medium-sleeved jacket: medium sleeves;
sleeveless jacket: sleeveless;
(color) jacket: topwear;
jacket: topwear;
(color) jacket: outerwear;
jacket: outerwear;
(color) bodysuit: bodysuit;
long-sleeved bodysuit: long sleeves;
short-sleeved bodysuit: short sleeves;
medium-sleeved bodysuit: medium sleeves;
sleeveless bodysuit: sleeveless;
(color) armlet: armlet;
(color) armlets: armlets;
(color) armlets: armlet;
(color) armlets: (color) armlet;
(color) armband: armband;
(color) armbands: armbands;
(color) armbands: armband;
(color) armbands: (color) armband;
(color) bracelet: bracelet;
(color) bracelets: bracelets;
(color) bracelets: bracelet;
(color) bracelets: (color) bracelet;
(color) wristband: wristband;
(color) wristbands: wristbands;
(color) wristbands: wristband;
(color) wristbands: (color) wristband;
(color) elbow gloves: elbow gloves;
(color) elbow gloves: (color) gloves;
(color) elbow gloves: gloves;
elbow gloves: gloves;
(color) elbow gloves: (color) handwear;
(color) elbow gloves: handwear;
elbow gloves: handwear;
(color) elbow gloves: (color) armwear;
(color) elbow gloves: armwear;
elbow gloves: armwear;
(color) forearm gloves: forearm gloves;
(color) forearm gloves: (color) gloves;
(color) forearm gloves: gloves;
(color) forearm gloves: (color) handwear;
(color) forearm gloves: handwear;
forearm gloves: gloves;
forearm gloves: handwear;
(color) gloves: gloves;
(color) gloves: (color) handwear;
(color) gloves: handwear;
gloves: handwear;
(color) ring: ring;
(color) earrings: earrings;
(color) earring: earring;
(color) necklace: necklace;
(color) belt: belt;
(color) bikini: bikini;
(color) bikini: swimsuit;
(color) bikini: swimwear;
bikini: swimsuit;
bikini: swimwear;
(color) swimsuit: swimsuit;
(color) swimsuit: swimwear;
swimsuit: swimwear;
(color) pants: pants;
(color) shorts: shorts;
(color) thighhighs: thighhighs;
(color) thighboots: thighboots;
(color) stockings: stockings;
(color) pantyhose: pantyhose;
(color) pantyhose: stockings;
pantyhose: stockings;
(color) pantyhose: leggings;
pantyhose: leggings;
(color) anklet: anklet;
(color) anklets: anklets;
(color) anklets: anklet;
(color) shoes: shoes;
(color) shoes: (color) footwear;
(color) shoes: footwear;
(color) boots: boots;
(color) boots: (color) footwear;
(color) boots: footwear;
(color) skirt: skirt;
(color) bra: bra;
(color) g-string: g-string;
(color) g-string: gstring;
(color) g-string: (color) thong;
(color) g-string: thong;
(color) g-string: (color) panties;
(color) g-string: panties;
(color) g-string: (color) underwear;
(color) g-string: underwear;
g-string: thong;
g-string: panties;
g-string: underwear;
(color) thong: thong;
(color) thong: (color) panties;
(color) thong: panties;
(color) thong: (color) underwear;
(color) thong: underwear;
thong: panties;
thong: underwear;
highleg thong: highleg;
lowleg thong: lowleg;
(color) panties: panties;
(color) panties: underwear;
(color) panties: (color) underwear;
panties: underwear;
highleg panties: highleg;
lowleg panties: lowleg;
(color) choker: choker;
(color) nipples: nipples;
(color) pussy: pussy;
(color) eyes: eyes;
(color) nails: nails;
(color) nails: fingernails;
(color) nails: nail polish;
(color) nails: (color) nail polish;
(color) nails: (color) toenails;
(color) nails: (color) toenail polish;
(color) claws: claws;
(color) skin: colored skin;
(color) sclera: colored sclera;
(color) anus: colored anus;
(color) anus: anus;
(color) nipples: colored nipples;
(color) nipples: nipples;
(color) bed sheet: bed sheet;
(color) bed sheet: bed sheets;
(color) bed sheet: bedsheet;
(color) bed sheet: bedsheets;
(color) pillow: pillow;
(color) pillow: pillows;
(color) pillows: pillow;
(color) pillows: pillows;
(color) curtain: curtain;
(color) curtains: curtains;
(color) curtains: curtain;
(color) dildo: dildo;
faceless male: faceless;
(color) penis: penis;
(color) glans: glans;
(color) balls: balls;
peach pussy: clitoris;
peach pussy: clitoral hood;
cleft of venus: plump labia;
(color) pussy: pussy;
big pussy: pussy;
huge pussy: pussy;
hyper pussy: pussy;
areolas: areola;
(color) areolas: areolas;
(color) nipples: nipples;
large areolas: areola;
large areolas: areolas;
huge areolas: areola;
huge areolas: areolas;
thick thighs: thighs;
big butt: ass;
huge ass: ass;
quadruple amputee: amputee;
tongue out: tongue;
long tongue: tongue;
netorare; ntr
cuckholding; ntr
cheating; ntr
horse: animal;
multiple horses: animals;
multiple horses: multiple animals;
dog: animal;
multiple dogs: animals;
multiple dogs: multiple animals;
wolf: animal;
multiple wolves: animals;
multiple wolves: multiple animals;
pig: animal;
multiple pigs: animals;
multiple pigs: multiple animals;
equine dildo: animal dildo;
equine dildo: dildo;
canine dildo; knotted dildo
knotted dildo: animal dildo;
knotted dildo: dildo;
equine penis: animal penis;
equine penis: animal genitalia;
equine penis: equine genitalia;
canine penis: animal penis;
canine penis: animal genitalia;
canine penis: canine genitalia;
porcine penis: animal penis;
porcine penis: animal genitalia;
equine pussy: animal pussy;
equine pussy: animal genitalia;
equine pussy: equine genitalia;
canine pussy: animal pussy;
canine pussy: animal genitalia;
canine pussy: canine genitalia;
1girl, 1boy: solo; solo focus
2girls: solo; solo focus
2boys: solo; solo focus
cat ears: animal ears;
dog ears: animal ears;
giant fly: animal;
ntr; ntr, netorare, cheating, cuckholding
older man and younger girl: ntr; larger male, older male, masculine male, loli, child, young, ntr
older female: ntr; mother ntr, mom-cuck, ntr
ssquirting; squirting
revealing clothes; revealing clothes, revealing clothing, revealing outfit, slutty clothes, slutty clothing, slutty outfit, lewd, lewd clothes, lewd clothing, lewd outfit, pointless clothes, pointless clothing, pointless outfit, barely covered, skimpy, mostly nude
lewd: 1girl; 1girl, female pervert, perverted female, pervert
lewd: female focus; 1girl, female pervert, perverted female, pervert
anal birth: birth;
vaginal birth: birth;
bouncing balls: bouncing;
bouncing breasts: bouncing;
bouncing butts: bouncing;
bouncing penis: bouncing;
bound arms: bound;
bound legs: bound;
bound ankles: bound;
bound wrists: bound;
fully bound: bound;
stationary restraints: bound;
braided ponytail: braid;
crown braid: braid;
braided bun: braid;
braided buns: braid;
braided twintails: braid;
chastity cage: chastity;
chastity device: chastity;
checkered background: checkered;
blurry background: blurry;
cute boy: cute;
cute girl: cute;
denim pants: denim;
denim shorts: denim;
denim skirt: denim;
anal destruction: destroyed;
vaginal destruction: destroyed;
female focus, bestiality: 1boy;
multiple horses: multiple boys;
multiple dogs: multiple boys;
exposed anus: exposed;
exposed ass: exposed;
exposed balls: exposed;
exposed nipples: exposed;
exposed penis: exposed;
exposed pussy: exposed;
white habit: black habit;
red habit: black habit;
pink habit: black habit;
green habit: black habit;
blue habit: black habit;
(color) habit: habit;
hood up: hood down;
1boy: male;
2boys: male;
3boys: male;
furry male: male;
1girl: female;
2girls: female;
3girls: female;
furry female: female;
shiny gardevoir: gardevoir;
shiny gardevoir, blue hair: green hair; [side-by-side, twins, symmetrical]
shiny gardevoir, blue body: green body; [side-by-side, twins, symmetrical]
shiny gardevoir, blue body: green skin; [side-by-side, twins, symmetrical]
shiny gardevoir, blue skin: green body; [side-by-side, twins, symmetrical]
shiny gardevoir, blue skin: green skin; [side-by-side, twins, symmetrical]
shiny gardevoir, orange eyes: red eyes; [side-by-side, twins, symmetrical]
veiny; 
throbbing; 


remove ears;
remove horns;
no forehead;
no expression;
remove eyes;
remove mouth;
no handwear;
no hands;
no wings;
no breasts;
no nipples;
no tail;
no penis;
no balls;
no pussy;
no feet;
no headwear;
no hair ornaments;
no facewear;
no earwear;
no eyewear;
no neckwear;
no handwear;
no outerwear;
no shoulderwear;
no skirt;
no legwear;
yesNips;
noNips;
noShoes;
assVisible;

-/ v9 Aliases
impossible fit; ridiculous fit
smirk; grin
clenching teeth; clenched teeth
mlem; blep, tongue out, mouth closed
squint; squint, narrowed eyes

-/ Temporary
mostly offscreen male, futanari: hetero; male on futa
male focus, mostly offscreen futa: hetero; futa on male
female focus, mostly offscreen futa: hetero; futa on female
cfnm; clothed female nude male
nude male; nude male, 1boy, cute boy, femboy, light-skinned male, nude male, human male
cute girl: nude male; nude male, child on child, child with child, siblings
plump: nude male; nude male, onee-shota, mother and son, older female, larger female, younger male
big pussy: pussy;
removeme;
lifting person; lifted by another
from behind, sex: (color) clitoris;
from behind, sex: clitoris;
from behind, sex: large clitoris;
from behind, sex: huge clitoris;
from behind, sex: big clit;
from behind, sex: clitoral hood;
from behind, crotch pov: (color) clitoris;
from behind, crotch pov: clitoris;
from behind, crotch pov: large clitoris;
from behind, crotch pov: huge clitoris;
from behind, crotch pov: big clit;
from behind, crotch pov: clitoral hood;
moan; announcing orgasm

-/ Boost keywords
- THESE WERE MEANT TO BE TEMPORARY
- This was a placeholder solution until a proper dictionary of booster keywords could be fully assembled, I did NOT point to this location so that boost keywords could be determined automatically
- But now the code defining booster keywords off of guesses needs to be removed before this section can be extricated
living plushie; living plushie, plushie
1girl: asian; asian, asian female
athletic; athletic, toned
1girl: athletic; athletic, athletic female
shortstack: loli; loli, kyojiri loli
kyojiri loli; kyojiri loli, loli, cute girl, child, young, shortstack, wide hips, thick thighs, bottom heavy, bottom heavy female
shortstack: shota; shota, kyojiri shota
kyojiri shota; kyojiri shota, shota, cute boy, child, young, shortstack, wide hips, thick thighs, bottom heavy, bottom heavy male
dry humping; dry humping, humping
humping; humping, rubbing, grinding
bowlegged; bowlegged, bowlegged pose, wide stance, legs spread
frottage: sph; sph, small penis humiliation, penis size difference, penis size comparison
frottage: penis size difference; sph, small penis humiliation, penis size difference, penis size comparison
penis out; penis out, penis exposed
balls out; balls out, balls exposed
pussy juice: squirting; squirting, female orgasm, female ejaculation, pussy ejaculation
squirting; squirting, hyper squirt, spraying
cum expulsion; cum expulsion, cum excretion, expulsion, excretion, excessive cum, way too much cum, overflow
fully bound; fully bound, bound, constricted, restrained
stationary restraints; stationary restraints, fully bound, bound, stuck
ryona; ryona, masochism, broken rape victim, addicted to rape
sagging balls; sagging balls, saggy balls, low-hanging balls, very saggy balls, heavy balls
clenched: saggy balls; clenched balls
clenched: sagging balls; clenched balls
balls: clenched; clenched balls
large balls: clenched; clenched balls
huge balls: clenched; clenched balls
clenched balls; clenched balls, clenching balls, retracted balls, excessive scrotal skin
rimming; rimming, anilingus, deep rimming, face in anus, face in ass, rimjob
kusogaki; kusogaki, mesugaki, brat, bratty, needs correction, in need of correction
covered balls; covered balls, balls outline, balls under clothes
balls outline; covered balls, balls outline, balls under clothes
tenting; erection under clothes, tenting, penis outline, covered penis
penis outline; penis outline, covered penis
long foreskin; unretracted foreskin, long foreskin, excessive foreskin, hyper foreskin
unretracted foreskin; unretracted foreskin, long foreskin, excessive foreskin, hyper foreskin
long foreskin: foreskin;
long foreskin: glans;
floppy penis; flaccid, flaccid penis, limp penis, floppy penis
flaccid; limp penis, floppy penis
cbt; cbt, ballbusting, balls abuse, balls torture, cock and balls torture
handplaps; handplaps, slapping balls, balls slap, balls slapping [pussy, big pussy]
anal destruction; anal destruction, ruined anus, destroyed anus
anal sex: anal destruction; anal destruction; huge insertion, ridiculous fit, impossible fit, way too big
vaginal destruction; vaginal destruction, ruined pussy, destroyed pussy
vaginal sex: vaginal destruction; vaginal destruction; huge insertion, ridiculous fit, impossible fit, way too big
balls expansion; tf, transformation, balls expansion, expanding balls, balls growth, balls inflation
balls expansion: balls; huge balls, gigantic balls
balls expansion: small balls; huge balls, gigantic balls
penis expansion; tf, transformation, penis expansion, expanding penis, penis growth
penis expansion: penis; huge penis, gigantic penis
penis expansion: small penis; huge penis, gigantic penis
infested balls; infested balls, pregnant balls, balls pregnancy, squirming balls, balls invasion, ball deformation
full-face blush; full-face blush, heavy blush, blushing profusely
orgasm denial; pent-up, orgasm denial, edging, abstinence, imminent orgasm
twerking; twerking, ass shake, ass clap, ass clapping, ass shaking, butt clap, butt clapping, butt jiggle, butt shake, butt shaking, clapping ass, clapping butt
corruption; corruption, moral degradation, corrupted
creepy; creepy, scary, spooky, horror, dark
backlit; lit from behind, backlighting, backlit, dark
lit from behind; lit from behind, backlighting, backlit, dark
sidelit; lit from the side, sidelit, dark
lit from the side; lit from the side, sidelit, dark
dark; dark, dimly lit, dramatic lighting
dark: indoors; indoors, dark room
heart buttplug; heart plug, buttplug
buttplug; buttplug, anal plug, buttplug in ass, huge plug, huge insertion [after anal, discarded buttplug, gaping anus]
big anus: buttplug; buttplug, stretched anus, anal tugging [after anal, discarded buttplug, gaping anus]
huge anus: buttplug; buttplug, stretched anus, anal tugging [after anal, discarded buttplug, gaping anus]
electro; electrostimulation
electrostimulation; electrostimulation, electricity, electrocution
mob eyes; mob eyes, mob face, no sclera
pedo: pov crotch; pov crotch, shota pov, child pov
shota: pedo; pedomom, pedomommy, toddlercon, very cute, straight shota
loli: pedo; pedomom, pedomommy, toddlercon, very cute, straight shota
pedo; pedomom, pedomommy, toddlercon, very cute
Very Cute; very cute, infant, baby
vaginal sex: pedomom; pedomom, pedomommy, toddlercon, very cute, infant sex, babyfuck
anal sex: pedomom; pedomom, pedomommy, toddlercon, very cute, infant sex, babyfuck
fellatio: pedomom; pedomom, pedomommy, toddlercon, very cute, infant sex, babysuck
baby: vaginal sex; vaginal sex, sex, babyfuck
baby: anal sex; anal sex, sex, babyfuck
aged up, yakuzen kusuri: medium hair; long hair
aged up, yakuzen kusuri: flipped hair; ponytail, wavy hair
aged up, yakuzen kusuri: flat chest; large breasts, mole on breasts
aged up, yakuzen kusuri: petite; tall
aged up, yakuzen kusuri: cute girl; wide hips, thick thighs
aged up, yakuzen kusuri: green eyes; green eyes, red glasses
aged up, yakuzen kusuri: suspenders; suspenders, partially unbuttoned, cleavage, navel, undersized clothes
yakuzen kusuri: aged up;
clitoral bulge; <lora:clitoral bulge - honohana:0.7> clitoris outline, clitoral bulge, erect clitoris under clothes
elf face; elf face, meme face
strangling; strangling, choking, asphyxiation
choking; choking, asphyxiation
buttjob; buttjob, hotdogging
snuff; snuff, death, shaded face
gigantic ass; gigantic ass, huge ass
disembodied humanoid penis; huge penis, veiny penis, throbbing penis, humanoid penis, glans
one cheek touching; ass-to-ass, butt squish, ass squish
ass-to-ass; butt squish, ass squish
very tall; tall, very tall
extra thicc; extra thicc, huge hips, wide hips, huge thighs, thick thighs, huge ass, chubby, belly, plump, curvy, voluptuous
sy-deity, sfw: red anus, pink anus, anthro, 1girl, 1boy, flat chest, wide hips, thick thighs, femboy, girly, cute boy;
(color) aura; (color) aura, (color) glow, glowing
announcing orgasm; announcing orgasm, moaning, spoken heart, spoken exclamation mark, screaming
heart-shaped pupils; heart-shaped pupils, white pupils, glowing pupils
---------------------- Honeycomb pose purge (GENERATED) ----------------------
-/ Honeycomb pose purge
PoseA;
PoseB;
PoseExposed;
PoseBreakdown;
PoseBreakdownB;
PoseDefense;
PoseDefenseB;
PoseOffense;
PoseOffenseB;
PoseSupport;
PoseSupportB;
---------------------- end Honeycomb pose purge ----------------------
`;