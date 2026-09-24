var defaultArray = `
---------------------- /////////////// Shortcuts & Setup \\\\\\\\\\\\\\\\\\ ----------------------

---------------------- Body ----------------------

-/ Species

-/ Bodytype

-/ Male

-/ Female

---------------------- Partner ----------------------

-/ POV

-/ Disembodied

-/ Bestiality

-/ Monsters

--/ Insects

--/ Spiders

--/ Tentacles

--/ Worms

-/ Offscreen

-/ Hetero

-/ Futa

-/ Femdom

---------------------- Position ----------------------

`;

defaultArray = defaultArray.split("\n")
var cleanedDefaultArray = [];
for (let defaultIndex = 0; defaultIndex < defaultArray.length; defaultIndex++) {
    if (defaultArray[defaultIndex] != "" && defaultArray[defaultIndex].startsWith("-") == false) {
        var newRule = {requirements: [], additions: [], exceptions: []};
        var currentLine = defaultArray[defaultIndex]
        //console.info(currentLine);
        var newRequirements = currentLine.split("; ")[0];
        if (newRequirements.includes(", ")) {
            newRequirements = newRequirements.split(", ");
            for (let requirementIndex = 0; requirementIndex < newRequirements.length; requirementIndex++) {
                newRule.requirements.push(newRequirements[requirementIndex]);
            }
        }
        else {
            newRule.requirements.push(newRequirements);
        }
        currentLine = currentLine.split("; ")[1];
        if (currentLine.includes("[")) {
            var newExceptions = currentLine.split("[")[1].split("]")[0];
            if (newExceptions.includes(", ")) {
                newExceptions = newExceptions.split(", ");
                for (let exceptionIndex = 0; exceptionIndex < newExceptions.length; exceptionIndex++) {
                    newRule.exceptions.push(newExceptions[exceptionIndex]);
                }
            }
            else {
                newRule.exceptions.push(newExceptions);
            }
        }
        currentLine = currentLine.split("[")[0];
        if (currentLine.includes(",")) {
            var newAdditions = currentLine.split(", ");
            for (let additionIndex = 0; additionIndex < newAdditions.length; additionIndex++) {
                newRule.additions.push(newAdditions[additionIndex]);
            }
        }
        else {
            newRule.additions.push(currentLine);
        }
        cleanedDefaultArray.push(newRule);
    }
}
console.log(cleanedDefaultArray);


var exclusivesArray = `
expression shortcut exclusivity
Happy
Amused
Joy
Sparkle
Laughing
Sleep
Teasing
Mocking
Confused, unaware
Befuddled
Worried
Tired
Panic
Surprised
Shock
Annoyed
Angry
Fury
Scared
Crying
Blushy
Flirting
Horny
Pent-Up
Awe
Excited
Love
Pleasured
Perverted
Forced
Orgasm
Ahegao
Torogao
Afterglow
Broken
Rape Face
Crazy
Mesugaki
Naughty Face
expressionless, emotionless, kuudere, faceless, obscured face, facing away, head out of frame, lower body only, head back

expression exclusivity 1
happy
crazy
sad
angry, disgust
confused
shocked
scared
emotionless
obscured face, covered face, covering face, faceless, no face
lower body only, head out of frame, facing away

expression exclusivity 2
happy
crazy
worried
angry
emotionless
obscured face, covered face, covering face, faceless, no face
lower body only, head out of frame, facing away

expression exclusivity 3
seductive
fucked silly
crazy
angry
confused
shocked
worried
obscured face, covered face, covering face, faceless, no face
lower body only, head out of frame, facing away

expression exclusivity 4
looking pleasured
crazy
angry
confused
shocked
worried
obscured face, covered face, covering face, faceless, no face
lower body only, head out of frame, facing away

eyebrow exclusivity
raised inner eyebrows, v-shaped eyebrows
raised eyebrows
raised eyebrow, one eyebrow raised
furrowed eyebrows, furrowed brow
cocked brow
obscured eyes, covered eyes, covering eyes, penis over eyes, hair over eyes
obscured face, covered face, covering face
lower body only, head out of frame, facing away

eye status exclusivity
glare
wide-eyed
half-closed eyes
eyes half closed
narrowed eyes, squint, squinting
eyes closed, closed eyes, eyes shut
obscured eyes, covered eyes, covering eyes, penis over eyes, hair over eyes, eyeless, no eyes
obscured face, covered face, covering face, faceless, no face
lower body only, head out of frame, facing away

one eye status exclusivity
one eye closed
one eye half-closed
half-closed eyes
eyes closed
closed eyes
eyes shut
obscured eyes, covered eyes, covering eyes, penis over eyes, hair over eyes, eyeless, no eyes
obscured face, covered face, covering face, faceless, no face
lower body only, head out of frame, facing away

looking exclusivity
eyes closed, closed eyes, eyes shut
rolling eyes, looking up, cross-eyed
eyes in different directions
looking at viewer
looking down, looking at penis, looking at own penis, looking at own breasts, looking at own pussy, looking at self
looking to the side, looking sideways, looking around, looking at another, looking away
obscured eyes, covered eyes, covering eyes, penis over eyes, hair over eyes, eyeless, no eyes
obscured face, covered face, covering face, faceless, no face
lower body only, head out of frame, facing away

smile exclusivity
smile
wide smile
crooked smile
frown
oral, fellatio, deepthroat, irrumatio, kiss, kissing, deep kiss, anilingus, rimming, fellatio gesture, licking, all the way through
obscured mouth, covered mouth, covering mouth
obscured face, covered face, covering face
lower body only, head out of frame, facing away

mouth status
open mouth
mouth open
closed mouth
mouth closed
parted lips
mouth wide open
oral, fellatio, deepthroat, irrumatio, kiss, kissing, deep kiss, anilingus, rimming, fellatio gesture, licking, all the way through
obscured mouth, covered mouth, covering mouth
obscured face, covered face, covering face
lower body only, head out of frame, facing away

mouth shape 1
smile
frown
expressionless, emotionless
oral, fellatio, deepthroat, irrumatio, kiss, kissing, deep kiss, anilingus, rimming, fellatio gesture, licking, all the way through
obscured mouth, covered mouth, covering mouth
obscured face, covered face, covering face
lower body only, head out of frame, facing away

mouth shape 2
:>
:<
:3
:o
triangle mouth
wavy mouth
snarl
oral, fellatio, deepthroat, irrumatio, kiss, kissing, deep kiss, anilingus, rimming, fellatio gesture, licking, all the way through
obscured mouth, covered mouth, covering mouth
obscured face, covered face, covering face
lower body only, head out of frame, facing away

teeth type 1
teeth
upper teeth only
fang
fangs
cute fang
oral, fellatio, deepthroat, irrumatio, kiss, kissing, deep kiss, anilingus, rimming, fellatio gesture, licking, all the way through
obscured mouth, covered mouth, covering mouth
obscured face, covered face, covering face
lower body only, head out of frame, facing away

teeth type 2
upper teeth only
fang
cute fang
closed mouth, mouth closed
oral, fellatio, deepthroat, irrumatio, kiss, kissing, deep kiss, anilingus, rimming, fellatio gesture, licking, all the way through
obscured mouth, covered mouth, covering mouth
obscured face, covered face, covering face
lower body only, head out of frame, facing away

teeth action
:o, open mouth
clenched teeth
grin, smirk
snarl
biting
closed mouth, mouth closed
oral, fellatio, deepthroat, irrumatio, kiss, kissing, deep kiss, anilingus, rimming, fellatio gesture, licking, all the way through
obscured mouth, covered mouth, covering mouth
obscured face, covered face, covering face
lower body only, head out of frame, facing away

tongue actions
blep, mlem
licking lips
biting lip
clenched teeth
grin, smirk
snarl
oral, fellatio, deepthroat, irrumatio, kiss, kissing, deep kiss, anilingus, rimming, fellatio gesture, licking, all the way through
obscured mouth, covered mouth, covering mouth
obscured face, covered face, covering face
lower body only, head out of frame, facing away

pupil shape
star-shaped pupils
spiral eyes
heart-shaped pupils
empty eyes, solid eyes, compound eyes, no pupils, solid oval eyes
eyeless, no eyes, obscured eyes, covered eyes, covering eyes, obscured face, covered face, covering face, lower body only, head out of frame, facing away

breast size
flat chest
small breasts
medium breasts
large breasts
huge breasts, gigantic breasts, hyper breasts

nipple size
nipples
big nipples
huge nipples, hyper nipples

penis size
small penis
large penis
huge penis
gigantic penis, hyper penis

penis state
erection, erect penis
flaccid, flaccid penis
semi-erect, soft penis, becoming erect, half-erect

penis type
humanoid penis, glans
canine penis, knot
equine penis, medial ring
dragon penis
feline penis
cetacean penis
porcine penis, spiral penis
bulge, penis outline, erection under clothes, covered penis

glans shape
glans
spiked glans, barbed glans
nubbed glans, bumpy glans
foreskin
long foreskin, unretracted foreskin, hyper foreskin, excessive foreskin

pussy type
pussy
big pussy, hyper pussy
canine pussy
equine pussy
dragon pussy
cameltoe, covered pussy

pussy labia
cleft of venus
plump labia
long labia
equine pussy
canine pussy
cameltoe, covered pussy

pussy state
cleft of venus
spread pussy, spreading own pussy
gaping pussy
penis over pussy, cameltoe, covered pussy

clitoris shape
peach pussy
clitoris, clitoral hood, large clitoris, erect clitoris, huge clitoris, hyper clitoris

insertion size
small insertion
large insertion, huge insertion, impossible fit, stomach bulge, pectoral bulge
cooldown, pullout, imminent, prodding

finger count
featureless hands, no fingers, fingerless
2 fingers
3 fingers
4 fingers
5 fingers

masturbation actions
hand on own penis
hands on own penis
hands on another's penis
hands-free, arms behind back, arms behind head, hands behind head, double v, hands on own chest, hands on hips

stance
standing
squatting
sitting, kneeling, wariza
lying, on back, on stomach, on side

partner type 1
human male, light-skinned male, tan-skinned male, dark-skinned male, mostly offscreen male, hetero, yaoi, human futa, light-skinned futa, tan-skinned futa, dark-skinned futa, mostly offscreen futa, futa on male, futa on female
bestiality, feral penetrating, feral on male, feral on female, mostly offscreen horse, mostly offscreen dog, mostly offscreen wolf, mostly offscreen pig, tentacle sex

partner type 2
human male, light-skinned male, tan-skinned male, dark-skinned male, mostly offscreen male
human futa, light-skinned futa, tan-skinned futa, dark-skinned futa, mostly offscreen futa
mostly offscreen horse
mostly offscreen dog, mostly offscreen wolf
mostly offscreen pig

stuck exclusivity
through floor, stuck in floor, stuck through floor
through ground, stuck in ground, stuck through ground
through wall, stuck in wall, stuck through wall

earpen count
penis in ear
penis in ears, penises in ears
tentacle in ear
tentacles in ears
dildo in ear
dildo in ears, dildos in ears
worm in ear
worms in ears

nipplepen count
penis in nipple
penis in nipples, penises in nipples
tentacle in nipple
tentacles in nipples
tentacle sucking nipple
tentacles sucking nipples
dildo in nipple
dildos in nipples
worm in nipple
worms in nipples
worm sucking nipple
worms sucking nipples

`;

exclusivesArray = exclusivesArray.split("\n")


var setOfKeywordsToTriggerExclusiveCategory = new Set();
var exclusiveCategories = [];
var exclusiveCategoryName = "";
var exclusiveCategoryContents = [];
for (var exclusivesIndex = 0; exclusivesIndex < exclusivesArray.length; exclusivesIndex++) {
    if (exclusivesArray[exclusivesIndex] == "") {
        if (exclusiveCategoryContents.length > 0 && exclusiveCategoryName != "") {
            var newCategory = {index: exclusiveCategoryName, contents: exclusiveCategoryContents};
            exclusiveCategories.push(newCategory);
        }
        exclusiveCategoryName = "";
        exclusiveCategoryContents = [];
    }
    else {
        if (exclusiveCategoryName == "") {
            exclusiveCategoryName = exclusivesArray[exclusivesIndex];
        }
        else {
            if (exclusivesArray[exclusivesIndex].includes(", ")) {
                exclusiveCategoryContents.push(exclusivesArray[exclusivesIndex]);
                exclusivesArray[exclusivesIndex] = exclusivesArray[exclusivesIndex].split(", ");
                for (var exclusivesSubIndex = 0; exclusivesSubIndex < exclusivesArray[exclusivesIndex].length; exclusivesSubIndex++) {
                    setOfKeywordsToTriggerExclusiveCategory.add(exclusivesArray[exclusivesIndex][exclusivesSubIndex]);
                }
            }
            else {
                exclusiveCategoryContents.push(exclusivesArray[exclusivesIndex]);
                setOfKeywordsToTriggerExclusiveCategory.add(exclusivesArray[exclusivesIndex]);
            }
        }
    }
}
console.log(exclusiveCategories);

var simpleTypeArray = [
    "humanoid",
    "canine",
    "feline",
    "equine",
    "porcine",
    "tapered",
    "tapering",
    "cetacean",
    "unusual",
    "large",
    "small",
    "huge",
    "gigantic",
    "hyper",
    "spiked",
    "barbed",
    "veiny",
    "saggy",
    "sagging",
    "big",
    "puffy",
    "peach",
]

var simpleColorArray = [
    "white",
    "grey",
    "black",
    "maroon",
    "pink",
    "red",
    "orange",
    "brown",
    "tan",
    "beige",
    "yellow",
    "lime",
    "green",
    "teal",
    "aqua",
    "blue",
    "periwinkle",
    "purple",
    "violet",
    "rainbow",
    "gold",
    "silver",
    "bronze",
    "copper",
    "metal",
]

var weakKeywords = `
rocket ship
futa with feral
futa on feral
human with feral
human on feral
human penetrating
equine pussy
equine anus
all the way through
in ass out mouth
in mouth out ass
onecup
asshuku
change of status
personality excretion
excretetion
flesh_unit
missile pod
holding cannon
`;

var weakKeywordsArray = weakKeywords.split("\n")
for (weakKeywordsIndex = 0; weakKeywordsIndex < weakKeywordsArray.length; weakKeywordsIndex++) {
    if (weakKeywordsArray[weakKeywordsIndex] == "") {
        weakKeywordsArray.splice(weakKeywordsIndex, 1);
        weakKeywordsIndex--;
    }
}