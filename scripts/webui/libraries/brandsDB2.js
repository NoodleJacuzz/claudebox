// ============================================================================
//  brandsDB2 — FRANCHISES
// ============================================================================
//
//  namesArray MOVED to aliasDB.js on 2026-08-17. This file is the franchise
//  side only: which franchises exist, what they are called, which of them are
//  not really franchises, and what gets thrown away.
//
//  The split is by QUESTION, not by size. This file answers `what franchise
//  is this?`; aliasDB answers `who is this?`. They were in one file and the
//  character half was 97% of it.
// ============================================================================

// brandsDB2.js - character and franchise names.
//
// Block format: canonical tag, then aliases, blank line closes the block.
// Franchise is the first parenthetical in a block that is not in
// notFranchiseList. Sections are comments and mean nothing to the parser.

var brandArray = `
rainy
fur
syrup
yordle
league
mario
zelda
poke
pokegirl
pokemon
splatoon
gg
disgaea
xenoblade
wow
maidragon
dark
skull
rwby
resident
resi
ac
silent
mystic
cyberpunk
spyro
sonic
digimon
fate
genshin
onepiece
lostkingdoms
konosuba
psg
spy
mha
kanojo
ff
darkstalkers
tt
`;

// A parenthetical that is not a series name. The entry stays; only the
// parenthetical is ignored. Add freely.
var notFranchiseList = `
series
remake
confined
unbound
little garden
casual
dirndl
first ascension
second ascension
third ascension
magical girl
manga
cosplay
visible
1st costume
2nd costume
3rd costume
4th costume
5th costume
6th costume
7th costume
8th costume
9th costume
10th costume
11th costume
12th costume
13th costume
14th costume
15th costume
16th costume
17th costume
18th costume
19th costume
20th costume
`;

// A parenthetical that makes the whole tag junk. Those entries are not in the
// list below at all - they belong in the purge rules. Add freely.
var vantablackList = `
abubu
aka6
amaen bo
anime
archie
argento
athighhighguy
badapplebat
bikupan
boppyhugs
born-to-die
bosshi
bosshi's xxx mix
character
classic
company
dagashi
dark resurrection
dross
fellatrix
iyarin
konoshige
krekk0v
krr
lolibean
lonely cri
m.u.g.e.n
mdf an
movie
nekomamire
neo hajime
nes
obui
oc
orenji
ourobot
pc-98
pepper0
picturd
species
trickstaboy
vrchat
yuunama
zahylon
zana
zanamaoria
zankuro
`;

// Trashcan I haven't moved to a replacement array yet.
var trashcanList = `
luowei99
m.u.g.e.n
nitroplus
norcel
npc trainer
nvidia
oc
olympics
onlyfans
paypal
paypal-chan
rareware
real life
riot games
rouge the bat outfit
someone else's oc
subscribestar
subarashiki kono sekai
tecmo
twitter
`;

// alias; canonical franchise name
// Used for assigning franchises to characters.
var franchiseAliasList = `
100 girlfriends; kimi no koto ga dai dai dai dai daisuki na 100-nin no kanojo
100 kanojo; kimi no koto ga dai dai dai dai daisuki na 100-nin no kanojo
kaguya-sama wants to be confessed to; kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen
love is war; kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen
akame ga kill!; akame ga kill
blue archive the animation; blue archive
cyberpunk 2077; cyberpunk
delightfully fuckable and unrefined!!; delightfully fuckable and unrefined
dq3; dragon quest 3
dqiii; dragon quest 3
fate/apocrypha; fate (series)
fateapocrypha; fate (series)
fate/extra; fate (series)
fateextra; fate (series)
fate/zero; fate (series)
fatezero; fate (series)
fate/grand order; fate (series)
fategrand order; fate (series)
fgo; fate (series)
fate; fate (series)
holo; hololive
hololive english; hololive
hololive fantasy; hololive
hololive japan; hololive
hololive myth; hololive
holomyth; hololive
holox; hololive
hololive gamers; hololive
jahy-sama wa kujikenai!; jahy-sama wa kujikenai
kobayashi-san chi no maid dragon; maidragon
kobayashi-san chi no maidragon; maidragon
miss kobayashi's dragon maid; maidragon
kono subarashii sekai ni bakuen wo; konosuba
kono subarashii sekai ni shukufuku wo: kurenai densetsu; konosuba
kono subarashii sekai ni shukufuku wo; konosuba
lab zero games; skullgirls
lol; league of legends
mario bros; mario (series)
mario kart wii; mario (series)
mario kart; mario (series)
mario strikers (series); mario (series)
mario; mario (series)
mon-musu quest!; mon-musu quest
overwatch 1; overwatch
overwatch 2; overwatch
bw; pokemon
pocket monsters; pokemon
pokemon anime; pokemon
pokemon bw2; pokemon
pokemon bw; pokemon
pokemon dppt; pokemon
pokemon frlg; pokemon
pokemon go; pokemon
pokemon gsc; pokemon
pokemon hgss; pokemon
pokemon journeys; pokemon
pokemon legends arceus; pokemon
pokemon legends arceus; pokemon
pokemon legends za; pokemon
pokemon legends: arceus; pokemon
pokemon lgpe; pokemon
pokemon mystery dungeon; pokemon
pokemon oras; pokemon
pokemon rby; pokemon
pokemon rgby; pokemon
pokemon rse; pokemon
pokemon rse; pokemon
pokemon ss; pokemon
pokemon sun and moon; pokemon
pokemon sv; pokemon
pokemon tcg; pokemon
pokemon unite; pokemon
pokemon usum; pokemon
pokemon xy; pokemon
princess connect!; princess connect
psg; panty and stocking with garterbelt
resident evil 1; resident evil
resident evil 2 (remake); resident evil
resident evil 2; resident evil
resident evil 3 (remake); resident evil
resident evil 3: nemesis; resident evil
resident evil 3; resident evil
resident evil 4 (remake); resident evil
resident evil 4; resident evil
resident evil 5; resident evil
resident evil 6; resident evil
resident evil 7; resident evil
resident evil 8: village; resident evil
resident evil 8; resident evil
resident evil village; resident evil
show by rock!!; show by rock
silent hill (series); silent hill
silent hill 2; silent hill
silent hill 3; silent hill
silent hill 4; silent hill
silent hill: homecoming; silent hill
splatoon (series); splatoon
splatoon 1; splatoon
splatoon 2; splatoon
splatoon 3: side order; splatoon
splatoon 3; splatoon
super mario 3d world; mario (series)
super mario bros.; mario (series)
super mario bros. 1; mario (series)
super mario galaxy; mario (series)
super mario land; mario (series)
super mario odyssey; mario (series)
super mario strikers; mario (series)
taimanin asagi kessen arena; taimanin (series)
taimanin asagi; taimanin (series)
taimanin murasaki; taimanin (series)
taimanin rpgx; taimanin (series)
taimanin yukikaze; taimanin (series)
taimanin; taimanin (series)
tekken 2; tekken
tekken 3; tekken
tekken 4; tekken
tekken 5; tekken
tekken 6; tekken
tekken 7; tekken
tekken 8; tekken
tekken revolution; tekken
tekken tag tournament 2; tekken
tekken tag tournament; tekken
tenchi muyou!; tenchi muyou
legend of zelda; the legend of zelda
the legend of zelda: a link to the past; the legend of zelda
the legend of zelda: breath of the wild; the legend of zelda
the legend of zelda: four swords; the legend of zelda
the legend of zelda: ocarina of time; the legend of zelda
the legend of zelda: oracle of ages; the legend of zelda
the legend of zelda: skyward sword; the legend of zelda
the legend of zelda: tears of the kingdom; the legend of zelda
the legend of zelda: the minish cap; the legend of zelda
the legend of zelda: the wind waker; the legend of zelda
the legend of zelda: twilight princess; the legend of zelda
ttgl; tengen toppa gurren lagann
umamusume pretty derby; umamusume
undertale (series); undertale
working!!; working
world of warcraft; warcraft
wow; warcraft
yu-gi-oh!; yu-gi-oh
karakai jouzu no (moto) takagi-san; takagi-san
karakai jouzu no takagi-san; takagi-san
street fighter ii; street fighter
street fighter 2; street fighter
street fighter iii; street fighter
street fighter 3; street fighter
street fighter iv; street fighter
street fighter 4; street fighter
street fighter v; street fighter
street fighter 5; street fighter
street fighter vi; street fighter
street fighter 6; street fighter
my hero academia; boku no hero academia
mha; boku no hero academia
bna; boku no hero academia
megaman; mega man
rockman; mega man
rock man; mega man
kantai collection; kancolle
soul calibur; soulcalibur
soul edge; soulcalibur
`;

// Aliases from franchiseAliasList whose form is generated on EVERY character
// of that franchise. Abbreviations belong here; sub-series do not - listing
// "pokemon rby" would put that form on all 1025 pokemon.
var aliasFormList = `
lol
dq3
holo
my hero academia
`;
