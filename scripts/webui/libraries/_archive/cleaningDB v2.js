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
!lace-trimmed; lace trim`;

cleaningArrayTop = cleaningArrayTop.split("\n");
for (let replacementIndex = 1; replacementIndex < cleaningArrayTop.length; replacementIndex++) {
    cleaningArrayTop[replacementIndex] = cleaningArrayTop[replacementIndex].split("; ");
    cleaningArrayTop[replacementIndex][0] = cleaningArrayTop[replacementIndex][0].trim().replace("!", "");
    cleaningArrayTop[replacementIndex][1] = cleaningArrayTop[replacementIndex][1].trim();
}

var cleaningArrayInitial = `
--- /////////////// Tagging Errors \\\\\\\\\\\\\\\\\\ ---

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

-/ Outdated Tags
sy-neo; sy-milf
sy-hyena; sy-helena
fl-hyena; fl-helena
sy-wolf; sy-sorbet
fl-wolf; fl-sorbet
crisscross halter; criss-cross halterneck
criss-cross halter; criss-cross halterneck
crisscross halterneck; criss-cross halterneck
sling bikini top; sling top
slingshot bikini; slingshot swimsuit
(color) streaks; (color) hair streaks

-/ Mispelt Shortcuts

-/ Correct Shortcut Capitalization

---------------------- Early Improvement ----------------------
-/ LoRa Activation

-/ Character tag typos

-/ Franchise Condensation

-/ Improperly grouped tags
short (color) hair; short hair, (color) hair
long (color) hair; long hair, (color) hair
glowing (color) eyes; glowing eyes, (color) eyes
(color) penis ring; (color) cock ring
(color) nail polish; (color) nails
(color) toenail polish; (color) nails
(color) jumpsuit; (color) bodysuit, jumpsuit
(color) skinsuit; (color) bodysuit, skin tight
girthy penis; thick penis, large penis
mini top hat; mini hat, top hat

-/ Basic shortcut replacement

--- /////////////// Bad Tags \\\\\\\\\\\\\\\\\\ ---

---------------------- Useless/Harmful ----------------------

-/ Redundant High Quality Tags

-/ Harmful Low Quality Tags

-/ Censorship

-/ Watermarks/Artist Context

-/ Useless Meta Image Tags

-/ Publisher/Studio

-/ Too Vague, Useless

-/ Too Vague, Harmful

---------------------- Generally Disliked, Very Situational ----------------------

-/ Meta Character Context

-/ Text/Dialogue

-/ Cropping

-/ Greyscale

-/ Redundant

-/ Excessive Violence

-/ Excessive Weight

-/ Body Hair

-/ Gross Stuff

-/ Misc Disliked

--- /////////////// Optimizing for Anime Tags \\\\\\\\\\\\\\\\\\ ---

---------------------- Meta Character ----------------------

-/ Gender

-/ Demons

-/ Robots

-/ Furries (Anthro & Ferals)
anthro: human on feral; human on anthro

---------------------- Pose ----------------------

-/ Expression

-/ Position

-/ Sex Positions
doggy style; doggystyle

---------------------- Scene ----------------------

-/ Background

-/ Camera
side view; from side
rear view; from behind
butt focus; ass focus

-/ Context
science-fiction; science fiction
scifi; science fiction
sci-fi; science fiction

-/ Exhibitionism

-/ Modifiers (Non-sexual)

-/ Modifiers (Sexual)
butt worship; ass worship

---------------------- Clothing ----------------------

-/ Fullwear

-/ Headwear

-/ Facewear

-/ Eyewear

-/ Upperwear

-/ Armwear

-/ Handwear

-/ Lowerwear

-/ Underwear

-/ Legwear

-/ Feetwear

-/ Tailwear

-/ Accessories/Piercings

-/ Print/Stripes

-/ Nudity/Exposure
clitoris peek; clitoris slip
clitoris slip; clitoris slip, clitoris, clitoral hood

-/ Bulges
cameltoe: pussy floss;
pussy outline: pussy floss;

---------------------- Body ----------------------

-/ Breasts

-/ Butts

-/ Claws/Nails/Fingers

-/ Ears

-/ Eyes
closed eyes; eyes closed

-/ Genitals

balls squish; ball squish
balls clench; clenched balls
balls clenching; clenched balls
clenching balls; clenched balls
retracted balls; clenched balls
balls on ground; resting balls
balls sag; sagging balls
balls sagging; sagging balls
saggy balls; sagging balls

-/ Hair
hair slicked back; slicked back hair
slicked-back hair; slicked back hair

-/ Hands

-/ Lips/Mouth
mouth closed; closed mouth
clenching teeth; clenched teeth

-/ Tails

-/ Teeth

-/ Wings

-/ Waist

---------------------- Partner ----------------------

-/ Acts/Mood
butt worship; ass worship

-/ Age

-/ Bestiality

-/ Count

-/ Orientation

---------------------- Misc ----------------------
-/ Misc
gag; gagged
mouth gagged; gagged
gagged speech; gagged
gagging noise; gagged

-/ Unsorted Tags

-/ Needs Correction
deep penetration; deep insertion

--- /////////////// Anime Tags -> Syurofluff \\\\\\\\\\\\\\\\\\ ---

---------------------- Meta Character ----------------------

-/ Gender

-/ Demons

-/ Robots

-/ Furries (Anthro & Ferals)

---------------------- Pose ----------------------

-/ Expression

-/ Position

-/ Sex Positions

---------------------- Scene ----------------------

-/ Background

-/ Camera

-/ Context

-/ Exhibitionism

-/ Modifiers (Non-sexual)

-/ Modifiers (Sexual)

---------------------- Clothing ----------------------

-/ Fullwear

-/ Headwear

-/ Facewear

-/ Eyewear

-/ Upperwear

-/ Armwear

-/ Handwear

-/ Lowerwear

-/ Underwear

-/ Legwear

-/ Feetwear

-/ Tailwear

-/ Accessories/Piercings

-/ Print/Stripes

-/ Nudity/Exposure

-/ Bulges

---------------------- Body ----------------------

-/ Breasts

-/ Butts

-/ Claws/Nails/Fingers

-/ Ears

-/ Eyes
closed eyes; eyes closed

-/ Genitals

-/ Hair

-/ Hands

-/ Lips/Mouth

-/ Tails

-/ Teeth

-/ Wings

-/ Waist

---------------------- Partner ----------------------

-/ Age

-/ Bestiality

-/ Count

-/ Orientation

---------------------- Misc ----------------------
-/ Misc

-/ Unsorted Tags

-/ Needs Correction

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
solo, (color) penis: solo; solo, no pussy
solo, (size) penis: solo; solo, no pussy
solo, (color) balls: solo; solo, no pussy
solo, (size) balls: solo; solo, no pussy
futanari, (size) bulge: futanari; futanari, no pussy [duo, trio, group, group sex, pussy]
futanari, balls outline: futanari; futanari, no pussy [duo, trio, group, group sex, pussy]
futanari, (color) penis: futanari; futanari, no pussy [duo, trio, group, group sex, pussy]
futanari, (size) penis: futanari; futanari, no pussy [duo, trio, group, group sex, pussy]
futanari, (color) balls: futanari; futanari, no pussy [duo, trio, group, group sex, pussy]
futanari, (size) balls: futanari; futanari, no pussy [duo, trio, group, group sex, pussy]
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
girly, (size) bulge: girly; girly, no pussy [duo, trio, group, group sex, pussy]
girly, balls outline: girly; girly, no pussy [duo, trio, group, group sex, pussy]
girly, (color) penis: girly; girly, no pussy [duo, trio, group, group sex, pussy]
girly, (size) penis: girly; girly, no pussy [duo, trio, group, group sex, pussy]
girly, (color) balls: girly; girly, no pussy [duo, trio, group, group sex, pussy]
girly, (size) balls: girly; girly, no pussy [duo, trio, group, group sex, pussy]
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

- from behind only
back tattoo; [from behind, ass focus, assVisible]
cum on back; [from behind, ass focus, assVisible]
big butt; [from behind, ass focus, assVisible]
huge ass; [from behind, ass focus, assVisible]
ass shake; [from behind, ass focus, assVisible]
bouncing ass; [from behind, ass focus, assVisible]
twerking; [from behind, ass focus, assVisible]
tramp stamp; [from behind, ass focus, assVisible]
backsack; [from behind, folded, from below]
perineum; [from behind, folded, from below]
kneepits; [from behind, folded, from below]
sweaty butt; [from behind, folded, from below]
sweaty anus; [from behind, folded, from below]
big anus; [from behind, folded, from below, on back]
huge anus; [from behind, folded, from below on back]
covered anus; [from behind, folded, from below]
anus outline; [from behind, folded, from below]
anal tail; [from behind, folded, from below]
anal hook; [from behind, folded, from below]
fake tail; [from behind, folded, from below]
spread anus; [from behind, folded, from below]
spreading anus; [from behind, folded, from below]
spread butt; [from behind, folded, from below]
spreading own butt; [from behind, folded, from below]
gaping anus; [from behind, folded, from below]
after anal; [from behind, folded, from below]
anus peek; [from behind, folded, from below]
anus behind thong; [from behind, folded, from below]
(color) butt tattoo; [from behind, folded, from below]
(color) ass tattoo; [from behind, folded, from below]
(color) anus; [from behind, folded, from below]
(color) buttplug; [from behind, folded, from below]
(color) heart buttplug; [from behind, folded, from below]
(color) anus piercing; [from behind, folded, from below]

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
extra thicc; huge ass
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

crotch pov, pussyjob, pov penis: cleft of venus;
crotch pov, buttjob, pov penis: pussy;
crotch pov, buttjob, pov penis: cleft of venus;
crotch pov, buttjob, pov penis: clitoris;
crotch pov, buttjob, pov penis: clitoral hood;
crotch pov, buttjob, pov penis: small penis;
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

humping: masturbation;
grinding: masturbation;

-/ System Keyword Cleanup
tagme;
cleanme;
lora;
laura;
debrand: rwby, ruby rose, weiss schnee, blake belladonna, yang xiao-long, pyrrha nikos, nora valkyrie, winter schnee, penny polendina, cinder, summer rose, salem, ao, akai;

-/ v9 Aliases
impossible fit; ridiculous fit
smirk; grin
clenching teeth; clenched teeth
mlem; blep, tongue out, mouth closed
squint; squint, narrowed eyes

`;