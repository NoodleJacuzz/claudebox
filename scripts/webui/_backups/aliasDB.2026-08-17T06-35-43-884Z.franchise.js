// ============================================================================
//  aliasDB — WHO IS THIS?
// ============================================================================
//
//  namesArray: every name a character answers to, grouped by franchise.
//  Moved here from brandsDB2.js on 2026-08-17, which now holds the franchise
//  list and nothing else.
//
//  `aliasArray` USED to live here — a second, older display-name table. It
//  was retired the same day because every line in it had become redundant:
//  the Syrup Town names are maintained in `basicShortcutArray` (webui.js) and
//  v2 now reads that directly, and the rest already had namesArray entries.
//  Two lists answering one question is the failure this project keeps meeting;
//  the shortcut list won because it is where the names are actually curated.
//
//  Nothing here decides furry vs fleshy. A `.syrup` name is a STEM and
//  `resolveSyrupVariant` (webui2.js) picks the form at compile time, because
//  only then is it known whether `not furry` was typed.
// ============================================================================

//To-do List:
// Add means to auto sort unsorted entries.
// Clean out floating entries of ones where there is a clear one.
// Remove prefix periods from aliases where the franchises in aliasDB are protecting the names. Periods are auto-added to all entries, but some shortcuts should only function with the period prefix present to prevent conflicts.

//Character's franchises are saved as the first franchise name that appears in their section (after aliasing), so sy-angelica's franchise is syrup town and soldier (dq3)'s franchise is dragon quest 3.
var namesArray = `
- ==== .hack ====

kite (.hack)

- ==== 100 kanojo ====

eiai nano (100 kanojo)
eiai nano
nano eiai (100 kanojo)
nano eiai
nano (100 kanojo)
nano
kanojonano

hanazono hahari (100 kanojo)
hanazono hahari
hahari hanazono (100 kanojo)
hahari hanazono
hahari (100 kanojo)
hahari
kanojohahari

hanazono hakari (100 kanojo)
hanazono hakari
hakari hanazono (100 kanojo)
hakari hanazono
hakari (100 kanojo)
hakari
kanojohakari

haraga kurumi (100 kanojo)
haraga kurumi
kurumi haraga (100 kanojo)
kurumi haraga
kurumi (100 kanojo)
kurumi
kanojokurumi

inda karane (100 kanojo)
inda karane
karane inda (100 kanojo)
karane inda
karane (100 kanojo)
karane
kanojokarane

kakure meme (100 kanojo)
kakure meme
kanojomeme
.meme
kanojomomiji
.momiji
meme kakure (100 kanojo)
meme kakure
meme (100 kanojo)

meido mei (100 kanojo)
meido mei
mei meido (100 kanojo)
mei meido
mei (100 kanojo)
kanojomei
.mei

sutou iku (100 kanojo)
sutou iku
iku sutou (100 kanojo)
iku sutou
iku (100 kanojo)
iku
kanojoiku

utsukushisugi mimimi (100 kanojo)
utsukushisugi mimimi
mimimi utsukushisugi (100 kanojo)
mimimi utsukushisugi
mimimi (100 kanojo)
mimimi
kanojomimimi

yakuzen kusuri (100 kanojo)
yakuzen kusuri
kusuri yakuzen (100 kanojo)
kusuri yakuzen
kusuri (100 kanojo)
kusuri
kanojokusuri

yamato nadeshiko (100 kanojo)
yamato nadeshiko
kanojonaddy
kanojoyamame
.yamame
nadeshiko yamato (100 kanojo)
nadeshiko yamato
naddy
naddy-sensei

yoshimoto shizuka (100 kanojo)
yoshimoto shizuka
shizuka yoshimoto (100 kanojo)
shizuka yoshimoto
shizuka (100 kanojo)
shizuka
kanojoshizuka

chiyo iin (100 kanojo)
chiyo iin
iin chiyo (100 kanojo)
iin chiyo
iin (100 kanojo)
chiyo (100 kanojo)
kanojochiyo
.chiyo

nadeshiko yamato (100 kanojo)
nadeshiko yamato
yamato nadeshiko (100 kanojo)
yamato nadeshiko
yamato (100 kanojo)
nadeshiko (100 kanojo)

meme kakure (100 kanojo)
meme kakure
kakure meme (100 kanojo)
kakure meme
kakure (100 kanojo)
meme (100 kanojo)

yaku yakuzen (100 kanojo)
yaku yakuzen
yakuzen yaku (100 kanojo)
yakuzen yaku
yakuzen (100 kanojo)
yaku (100 kanojo)
kanojoyaku
.yaku

kishika torotoro (100 kanojo)
kishika torotoro
torotoro kishika (100 kanojo)
torotoro kishika
torotoro (100 kanojo)
kishika (100 kanojo)
kanojokishika
.kishika

aashii kedarui (100 kanojo)
aashii kedarui
kedarui aashii (100 kanojo)
kedarui aashii
kedarui (100 kanojo)
aashii (100 kanojo)
kanojoahko
.ahko

uto nakaji (100 kanojo)
uto nakaji
nakaji uto (100 kanojo)
nakaji uto
nakaji (100 kanojo)
uto (100 kanojo)
kanojouto
.uto

mai meido (100 kanojo)
mai meido
meido mai (100 kanojo)
meido mai
meido (100 kanojo)
mai (100 kanojo)
kanojomai
.mai

momoha bonnouji (100 kanojo)
momoha bonnouji
bonnouji momoha (100 kanojo)
bonnouji momoha
bonnouji (100 kanojo)
momoha (100 kanojo)
kanojomomoha
.momoha

rin baio (100 kanojo)
rin baio
baio rin (100 kanojo)
baio rin
baio (100 kanojo)
rin (100 kanojo)
kanojorin
.rin

suu hifumi (100 kanojo)
suu hifumi
hifumi suu (100 kanojo)
hifumi suu
hifumi (100 kanojo)
suu (100 kanojo)
kanojosuu
.suu

eira kaho (100 kanojo)
eira kaho
kaho eira (100 kanojo)
kaho eira
kaho (100 kanojo)
eira (100 kanojo)
kanojoeina
.eina

nekonari tama (100 kanojo)
nekonari tama
tama nekonari (100 kanojo)
tama nekonari
tama (100 kanojo)
nekonari (100 kanojo)
kanojotama
.tama

- ==== Syrup town ====

sy-angelica
furangelica
sy-mayor
angelica
angelica (syrup town)
furmayor

fl-angelica
fl-angelica (syrup town)
fleshyangelica
fl-mayor
fleshymayor

sy-carpenter
sy-carp
furcarpenter
furcarp
cayenne
cayenne (syrup town)

fl-carpenter
fl-carpenter (syrup town)
fl-carp
fleshycarpenter
fleshycarp

sy-shop
sy-shopkeep
furshop
furshopkeep
bluebell
bluebell (syrup town)

fl-shop
fl-shop (syrup town)
fl-shopkeep
fleshyshop
fleshyshopkeep

sy-foxf
furfoxf
garnet
garnet (syrup town)

fl-foxf
fl-foxf (syrup town)
fleshyfoxf

sy-foxm
furfoxm
jasper
jasper (syrup town)

fl-foxm
fl-foxm (syrup town)
fleshyfoxm

sy-wolf
furwolf
sorbet
sorbet (syrup town)

fl-wolf
fl-wolf (syrup town)
fleshywolf

sy-sado
sy-sadogato
fursado
fursadogato
sharly
sharly (syrup town)

fl-sado
fl-sado (syrup town)
fl-sadogato
fleshysado
fleshysadogato

sy-milf
sy-neo
furmilf
furneo
mary-lou
mary-lou (syrup town)

fl-milf
fl-milf (syrup town)
fl-neo
fleshymilf
fleshyneo

sy-nun
furnun
khanna
khanna (syrup town)

fl-nun
fl-nun (syrup town)
fleshynun

sy-mesu
furmesu
marlow
marlow (syrup town)

fl-mesu
fl-mesu (syrup town)
fleshymesu

sy-fash
sy-fashionista
furfash
furfashionista
riley
riley (syrup town)

fl-fash
fl-fash (syrup town)
fl-fashionista
fleshyfash
fleshyfashionista

sy-helena
furhelena
sy-hyena
furhyena
helena
helena (syrup town)

fl-helena
fl-helena (syrup town)
fl-hyena
fleshyhelena
fleshyhyena

sy-doe
furdoe
nutmeg
nutmeg (syrup town)

fl-doe
fl-doe (syrup town)
fleshydoe

sy-mommy
furmommy
cinnamon
cinnamon (syrup town)

fl-mommy
fl-mommy (syrup town)
fleshymommy

sy-wilf
sy-sorbetmama
fursorbetmama
sy-sorbetmama (syrup town)
furwilf

fl-wilf
fl-wilf (syrup town)
fl-sorbetmama
fleshyorbetmama
fleshywilf

sy-silf
sy-sadomama
fursadomama
sy-sadomama (syrup town)
fursilf

fl-silf
fl-silf (syrup town)
fl-sadomama
fleshysadomama
fleshysilf

sy-vamp
furvamp
sy-vamp (syrup town)
sy-bat
furbat
sy-bat (syrup town)

fl-vamp
fl-vamp (syrup town)
fl-bat
fleshyvamp
fleshybat

sy-mama
furmama
sy-mama (syrup town)
sy-bear
furbear
sy-bear (syrup town)

fl-mama
fl-mama (syrup town)
fl-bear
fl-bear (syrup town)
fleshybear
fleshymama

sy-bee
furbee
sy-bee (syrup town)

fl-bee
fl-bee (syrup town)
fleshybee

sy-santa
fursanta
sy-santa (syrup town)

fl-santa
fl-santa (syrup town)
fleshysanta

sy-helper
furhelper
sy-helper (syrup town)

fl-helper
fl-helper (syrup town)
fleshyhelper

sy-monkey
furmonkey
sy-monkey (syrup town)

fl-monkey
fl-monkey (syrup town)
fleshymonkey

sy-same
furshark
sy-same (syrup town)

fl-same
fl-same (syrup town)
fleshysame
fleshyshark

sy-caprine
furcaprine
sy-caprine (syrup town)

fl-caprine
fl-caprine (syrup town)
fleshycaprine

sy-shee
furshee
sy-shee (syrup town)
sy-sheep
fursheep
sy-sheep (syrup town)

fl-shee
fl-shee (syrup town)
fl-sheep
fl-sheep (syrup town)
fleshyshee
fleshysheep

sy-sphinx
sy-sphinx (syrup town)
fursphinx
sy-heiro
sy-heiro (syrup town)
furheiro
sy-hiero
sy-hiero (syrup town)
furhiero
lamy (syrup town)
.lamy

fl-sphinx
fl-sphinx (syrup town)
fleshysphinx
fl-heiro
fl-heiro (syrup town)
fleshyheiro
fl-hiero
fl-hiero (syrup town)
fleshyhiero

sy-easter
fureaster
sy-easter (syrup town)

fl-easter
fl-easter (syrup town)
fleshyeaster

sy-succabus
fursuccabus
sy-succabus (syrup town)

fl-succabus
fl-succabus (syrup town)
fleshysuccabus

sy-panther
sy-panther (syrup town)
furpanther

fl-panther
fl-panther (syrup town)
fleshypanther

sy-anubian
sy-anubian (syrup town)
furanubian

fl-anubian
fl-anubian (syrup town)
fleshyanubian

sy-butler
sy-butler (syrup town)
furbutler

fl-butler
fl-butler (syrup town)
fleshybutler

sy-mouse
sy-mouse (syrup town)
furmouse

fl-mouse
fl-mouse (syrup town)
fleshymouse

sy-turkey
sy-turkey (syrup town)
furturkey

fl-turkey
fl-turkey (syrup town)
fleshyturkey

sy-tink
furtink
tink
tink (syrup town)

fl-tink
fl-tink (syrup town)
fleshytink

sy-deity
furdeity
deity (syrup town)

fl-deity
fleshydeity
fl-deity (syrup town)

sy-wendigo
furwendigo
wendigo (syrup town)

fl-wendigo
fleshywendigo
fl-wendigo (syrup town)

sy-yu
furyu
fleshyyu
syrupyu
yu (syrup town)
.yu

sy-hostess
furhostess
fleshyhostess
syruphostess
hostess (syrup town)
.hostess

elizabeth (bitch medicenter)
sy-elizabeth
syrupelizabeth
furelizabeth
fleshyelizabeth
elizabeth (syrup town)
syrupmedicenter

jen (bitch medicenter)
sy-jen
syrupjen
furjen
fleshyjen
.junkie
syrupjunkie

sy-ai
furai
fleshyai
syrupai
ai (syrup town)
.ai

gekka (hentai university)
sy-gekka
syrupgekka
furgekka
fleshygekka
gekka (syrup town)
gekka

perrywinkle
sy-doll
syrupdoll
furdoll
fleshydoll
doll (syrup town)

sy-pony
syruppony
furpony
fleshypony
pony (syrup town)
gams
gams (syrup town)

sy-orb
syruporb
furorb
fleshyorb
orb (syrup town)

sy-trap
syruptrap
furtrap
fleshytrap
trap (syrup town)
thorne
thorne (syrup town)

volane (volaco)
volane (syrup town)
volane

- ==== aether gazer ====

shu (aether gazer)

- ==== ahemaru ====

fumine daidoji (ahemaru)

- ==== aishiteruze baby ====

marika (aishiteruze baby)

- ==== akame ga kill ====

kurome (akame ga kill)

- ==== animal crossing ====

ankha (animal crossing)
.acankha
.ankha
acankha

audie (animal crossing)
.acaudie
.audie
acaudie

beau (animal crossing)

bob (animal crossing)

bruce (animal crossing)

butch (animal crossing)

c.j. (animal crossing)

cherry (animal crossing)

digby (animal crossing)

fang (animal crossing)

flick (animal crossing)

francine (animal crossing)

hazel (animal crossing)

isabelle (animal crossing)
.acisabelle
.isabelle
acisabelle

mabel able (animal crossing)

marshal (animal crossing)

orville (animal crossing)

punchy (animal crossing)

raymond (animal crossing)

rosie (animal crossing)
.acrosie
.rosie
acrosie

rover (animal crossing)

sasha (animal crossing)
.acsasha
sasha (haguhagu)
.sasha
acsasha

sherb (animal crossing)

shino (animal crossing)
.acshino
.shino
acshino

skye (animal crossing)

stitches (animal crossing)

tom nook (animal crossing)

villager (animal crossing)

whitney (animal crossing)

- ==== animeflux ====

nalica (animeflux)

- ==== arknights ====

andreana (arknights)

ansel (arknights)

aurora (arknights)

bison (arknights)

exusiai (arknights)

feater (arknights)

gladiia (arknights)

jessica (arknights)

mostima (arknights)

mudrock (arknights)

saria (arknights)

siege (arknights)

skadi (arknights)

specter (arknights)

suzuran (arknights)

- ==== arms ====

min min (arms)

- ==== astlibra ====

shiro (astlibra)

- ==== asura ====

kali (asura)

- ==== ayakashidani ninpochou ====

yato (ayakashidani ninpochou)

- ==== azur lane ====

aegir (azur lane)

ajax (azur lane)

august von parseval (azur lane)

bache (azur lane)

belfast (azur lane)

bremerton (azur lane)
bremerton (scorching-hot training) (azur lane)

cheshire (azur lane)

commander (azur lane)

dido (azur lane)

formidable (azur lane)

friedrich der grosse (azur lane)

honolulu (azur lane)

illustrious (azur lane)

indomitable (azur lane)

le malin (azur lane)
le malin (listless lapin) (azur lane)

manjuu (azur lane)

mutsuki (azur lane)

nelson (azur lane)

new jersey (azur lane)

owari (azur lane)

pola (azur lane)

saratoga (azur lane)

sirius (azur lane)
sirius (azure horizons) (azur lane)

st. louis (luxurious wheels) (azur lane)

taihou (azur lane)

ting an (azur lane)

valiant (azur lane)

ying swei (azur lane)

- ==== bakeneko ====

mell (bakeneko)

- ==== beastars ====

jack (beastars)

legoshi (beastars)

- ==== bebebe ====

kousaka airi (bebebe)

- ==== ben 10 ====

ben 10
ben 10 (ben 10)
ben tennyson

four arms (ben 10)

- ==== bioshock infinite ====

elizabeth (bioshock infinite)

- ==== black lagoon ====

revy (black lagoon)

- ==== blade & soul ====

jin (blade & soul)

lyn (blade & soul)

soha (blade & soul)

yun (blade & soul)

- ==== blaster master ====

kanna (blaster master)

- ==== blazblue ====

bullet (blazblue)

- ==== blend s ====

kanzaki hideri (blend s)
kanzaki hideri
blends

- ==== bloody roar ====

fox (bloody roar)

marvel (bloody roar)

- ==== blue archive ====

akane (blue archive)
akane (bunny) (blue archive)

ako (blue archive)

arona (blue archive)

aru (blue archive)

asuna (blue archive)
asuna (bunny) (blue archive)

azusa (blue archive)

doodle sensei (blue archive)

hanako (blue archive)
hanako (swimsuit) (blue archive)

hasumi (blue archive)

hifumi (blue archive)

hikari (blue archive)

hina (blue archive)
hina (swimsuit) (blue archive)

ibuki (blue archive)

ichika (blue archive)

izumi (blue archive)
izumi (swimsuit) (blue archive)

karin (blue archive)
karin (bunny) (blue archive)

kaya (blue archive)

kirara (blue archive)

kisaki (blue archive)

koharu (blue archive)

kokona (blue archive)

mika (blue archive)

neru (blue archive)
neru (bunny) (blue archive)

niya (blue archive)

noa (blue archive)

nonomi (blue archive)

nozomi (blue archive)

rin (blue archive)

saori (blue archive)

satsuki (blue archive)

seia (blue archive)
seia (swimsuit) (blue archive)

sensei (blue archive)
sensei (blue archive the animation)

serika (blue archive)

shiroko (blue archive)

shizuko (blue archive)
shizuko (swimsuit) (blue archive)

shun (blue archive)
shun (small) (blue archive)

sukeban (mg) (blue archive)
sukeban (smg) (blue archive)

toki (blue archive)
toki (bunny) (blue archive)

tsubaki (blue archive)

yuzu (blue archive)
yuzu (maid) (blue archive)

- ==== boku no hero academia ====

eri (boku no hero academia)

midnight (boku no hero academia)

ragdoll (boku no hero academia)

- ==== bombergirl ====

asagi (bombergirl)

- ==== bravely default ====

airy (bravely default)

- ==== breath of the wild ====

zelda (breath of the wild)

- ==== bubukka ====

tachibana momoka (bubukka)

- ==== bw ====

unova mother (bw)

- ==== capcom ====

ingrid (capcom)

- ==== cardcaptor sakura ====

kero (cardcaptor sakura)

- ==== catherine ====

catherine (catherine)
catherine (game)
catherine (atlus character)

rin (catherine)

- ==== chainsaw man ====

denji (chainsaw man)

himeno (chainsaw man)
himeno

kobeni (chainsaw man)
kobeni

makima (chainsaw man)
makima

nayuta (chainsaw man)
nayuta

power (chainsaw man)
power

reze (chainsaw man)
reze

- ==== chikaretsu ====

lune (chikaretsu)

- ==== chrono trigger ====

ayla (chrono trigger)

- ==== chronos ====

claire (chronos)

emina (chronos)

manuela (chronos)

silvia (chronos)

soiree (chronos)

- ==== critical role ====

keyleth (critical role)

- ==== cursed ====

gabriela (cursed)

- ==== cyberpunk ====

lucy (cyberpunk)

rebecca (cyberpunk)
rebecca (cyberpunk 2077)
.cyberpunkrebecca
cyberpunkrebecca
.rebecca

v (cyberpunk)

valerie (cyberpunk)

- ==== danmachi ====

hestia (danmachi)

- ==== dark souls ====

mimic (dark souls)

- ==== darkstalkers ====

felicia (darkstalkers)
.darkfelicia
.felicia
darkfelicia

hsien-ko (darkstalkers)
hsien-ko
hsien ko (darkstalkers)
hsien ko
lei-lei (darkstalkers)
lei-lei
.darkhsien
.hsien
darkhsien

lilith (darkstalkers)
.darklilith
.lilith
darklilith

mei-ling (darkstalkers)

morrigan (darkstalkers)
.darkmorrigan
.morrigan
darkmorrigan

q-bee (darkstalkers)
q-bee
darkbee
darkqbee
darkq-bee
.bee

- ==== darling in the franxx ====

ichigo (darling in the franxx)

zero two (darling in the franxx)

- ==== dc ====

jinx (dc)

raven (dc)

- ==== dead by daylight ====

the nurse (dead by daylight)

- ==== delightfully fuckable and unrefined ====

mari (delightfully fuckable and unrefined)

- ==== deltarune ====

susie (deltarune)

- ==== demon slayer ====

kamado nezuko (demon slayer)
kamado nezuko
nezuko kamado (demon slayer)
nezuko kamado
nezuko (demon slayer)
nezuko

kamado tanjirou (demon slayer)
kamado tanjirou
tanjirou kamado (demon slayer)
tanjirou kamado
tanjirou (demon slayer)
tanjirou

- ==== depravedaboy ====

addie (depravedaboy)

samara (depravedaboy)

- ==== destiny child ====

maat (destiny child)

- ==== devil may cry ====

dante (devil may cry)

lady (devil may cry)

- ==== digimon ====

renamon (digimon)
.digimonrenamon
.renamon
digimonrenamon

- ==== disgaea ====

archer (disgaea)
.disgaeaarcher
.archer
disgaeaarcher

etna (disgaea)
.disgaeaetna
.etna
disgaeaetna

flonne (disgaea)
.disgaeaflonne
.flonne
disgaeaflonne

healer (disgaea)
.disgaeahealer
.healer
disgaeahealer

mage (disgaea)

maid (disgaea)
.disgaeamaid
.maid
disgaeamaid

majorita (disgaea)

male healer (disgaea)
.disgaeamalehealer
.malehealer
disgaeamalehealer

martial artist (disgaea)
.disgaeamartialartist
.martialartist
disgaeamartialartist

samura (disgaea)
.disgaeasamurai
.samurai
disgaeasamurai

thief (disgaea)
.disgaeathief
.thief
disgaeathief

warrior (disgaea)
.disgaeawarrior
.warrior
disgaeawarrior

- ==== disney ====

frozen (disney)

rapunzel (disney)

- ==== doa ====

honoka (doa)

kasumi (doa)

kokoro (doa)

- ==== doki doki literature club ====

monika (doki doki literature club)

natsuki (doki doki literature club)

sayori (doki doki literature club)

yuri (doki doki literature club)

- ==== doraemon ====

chiko (doraemon)

hachi (doraemon)

- ==== dota ====

queen of pain (dota)

- ==== doubutsu no mori ====

nairu (doubutsu no mori)

- ==== dq11 ====

veronica (dq11)

- ==== dq3 ====

hero (dq3)
.dq3hero
dq3hero

mage (dq3)
.dq3mage
dq3mage

martial artist (dq3)
.dq3martialartist
fighter (dq3)
dq3martialartist

priest (dq3)
.dq3priest
cleric (dq3)
dq3priest

rogue (dq3)
.dq3rogue
rogue (x-men)
dq3rogue

roto (dq3)

sage (dq3)
.dq3sage
dq3sage

soldier (dq3)
.dq3soldier
dq3soldier

- ==== dragalia lost ====

renee (dragalia lost)

- ==== dragon ball ====

chi-chi (dragon ball)

erasa (dragon ball)

pan (dragon ball)

sorrel (dragon ball)

trunks (dragon ball)

oolong (dragon ball)
oolong

- ==== dragon's crown ====

amazon (dragon's crown)
.amazon
amazon

banshee (dragon's crown)

elf (dragon's crown)
.elf
elf (dq10)
elf

harpy (dragon's crown)

rannie (dragon's crown)

sorceress (dragon's crown)
.sorceress
sorceress

tiki (dragon's crown)

vampire (dragon's crown)

- ==== dragonaut ====

machina (dragonaut)

- ==== dungeon and fighter ====

female fighter (dungeon and fighter)

female mage (dungeon and fighter)

female striker (dungeon and fighter)

knight (dungeon and fighter)

- ==== dungeon meshi ====

walking mushroom (dungeon meshi)

- ==== echolocaution ====

hina (echolocaution)

mom (echolocaution)

- ==== eiyuu senki ====

dante alighieri (eiyuu senki)

- ==== elden ring ====

melina (elden ring)

miquella
miquella (elden ring)

tarnished (elden ring)

ranni the witch
ranni the witch (elden ring)
ranni (elden ring)

- ==== en'en no shouboutai ====

arrow (en'en no shouboutai)

- ==== enarane ====

goat-chan (enarane)

- ==== eotds ====

shiny celebi (eotds)

- ==== epic seven ====

lorina (epic seven)

penelope (epic seven)

ravi (epic seven)

roana (epic seven)

- ==== f.w.zholic ====

book girl (f.w.zholic)

- ==== fairy tale ====

little red riding hood (fairy tale)

- ==== fairy tale character ====

little red riding hood (fairy tale character)

- ==== fallout ====

raider (fallout)

- ==== fantasy bishoujo ====

tachibana hinata (fantasy bishoujo)

- ==== fate ====

abigail williams (fate)
abigail williams (swimsuit foreigner) (third ascension) (fate)

anastasia (fate)
anastasia (swimsuit archer) (third ascension) (fate)

artemis (fate)
artemis (smite)

artoria caster (fate)

artoria pendragon (fate)
saber (fate)
artoria (fate)
artoria pendragon (swimsuit ruler) (fate)
artoria pendragon (swimsuit ruler) (first ascension) (fate)

artoria pendragon (lancer)
artoria lancer (fate)
artoria pendragon (lancer) (fate)

artoria pendragon (lancer alter)
artoria pendragon (lancer alter) (fate)

astolfo (fate)
astolfo (saber) (fate)
astolfo (sailor paladin) (fate)
astolfo (sparkling frills) (fate)
.fateastolfo
astolfo
fateastolfo

baobhan sith (fate)

bb (fate)
bb (fateextra)
bb (swimsuit mooncancer) (fate)
bb (swimsuit mooncancer) (second ascension) (fate)

boudica (fate)

bradamante (fate)
bradamante (first ascension) (fate)

caenis (fate)
caenis (second ascension) (fate)

carmilla (fate)

chevalier d'eon (fate)
.fatechevalier
.chevalier
fatechevalier

chloe von einzbern (fate)
.fatekuro
chloe von einzbern (swimsuit avenger) (second ascension)
chloe von einzbern (archer install)
chloe von einzbern (beast style)
.kuro
fatekuro

circe (fate)

elizabeth bathory (fate)

florence nightingale (fate)
florence nightingale (trick or treatment) (fate)

gareth (fate)
gareth (swimsuit saber) (fate)

gorgon (fate)

habetrot (fate)

himiko (fate)
himiko (first ascension) (fate)

ibaraki douji (fate)
ibaraki douji (swimsuit lancer) (first ascension) (fate)

ibuki douji (fate)

illyasviel von einzbern (fate)
illyasviel von einzbern (beast style)
.fateillya
.illya
fateillya

ishtar (fate)

jack the ripper (fate)
jack the ripper (fateapocrypha)

jeanne alter
jeanne d'arc alter
jeanne d'arc alter (fate)
jeanne alter (swimsuit berserker)

jeanne d'arc (fate)
jeanne d'arc (ruler) (fate)
jeanne d'arc (girl from orleans) (fate)
jeanne d'arc (swimsuit archer)

johanna (fate)

kama (fate)
kama (swimsuit avenger) (fate)

katou danzou (fate)

kiichi hogen (fate)

koyanskaya (fate)

kukulkan (fate)

lavinia whateley (fate)

leonardo da vinci (fate)
leonardo da vinci (rider) (fate)

llamrei (fate)

medusa (fate)
medusa (rider) (fate)

meltryllis (fate)

minamoto no raikou (fate)
minamoto no raikou (swimsuit lancer) (fate)
.fateraikou
.raikou
fateraikou

miyamoto musashi (fate)
miyamoto musashi (swimsuit berserker)
miyamoto musashi (swimsuit berserker) (fate)
miyamoto musashi (swimsuit berserker) (second ascension) (fate)

miyu edelfelt (fate)
.fatemiyu
miyu edelfelt (beast style)
.miyu
fatemiyu

mordred (fate)
mordred (fateapocrypha)

morgan le fay (fate)

mysterious heroine xx (fate)

nemo (fate)
.fatenemo
.nemo
fatenemo

nero claudius (fate)
nero claudius (fateextra)
nero claudius (fate) (all)
nero claudius (swimsuit caster) (fate)
nero claudius (olympian bloomers) (fate)

nitocris (fate)

okita souji (fate)

okita souji alter (fate)

omi-san (fate)

orion (bear) (fate)

osakabehime (fate)
osakabehime (swimsuit archer) (fate)

passionlip (fate)

qin liangyu (fate)

queen draco (fate)

quetzalcoatl (fate)

saber (fate)

scathach (fate)

scheherazade (fate)

sei shounagon (fate)

sessyoin kiara (fate)
sessyoin kiara (swimsuit mooncancer) (second ascension)
sessyoin kiara (lily)

shuten douji (fate)

taira no kagekiyo (fate)

tamamo (fate)

tamamo no mae (fate)
tamamo no mae (fateextra)

thrud (fate)

tiamat (fate)

tomoe gozen (fate)
tomoe gozen (swimsuit saber) (first ascension) (fate)

ushiwakamaru (fate)
ushiwakamaru (swimsuit assassin) (first ascension) (fate)

valkyrie (fate)

wu zetian (fate)
wu zetian (fategrand order)

xuangzang sanzang (fate)

- ==== fear & hunger ====

abella (fear & hunger)

marina (fear & hunger)

- ==== female ====

fujimaru ritsuka (female)
fujimaru ritsuka (male)

sole survivor (female)

v (female)

wii fit trainer (female)

- ==== ff10 ====

rikku (ff10)

yuna (ff10)

- ==== ff14 ====

warrior of light (ff14)

- ==== ff9 ====

beatrix (ff9)
beatrix

blank (ff9)

lani (ff9)

ruby (ff9)

- ==== fighting vipers ====

honey (fighting vipers)

- ==== final fantasy ====

aerith gainsborough (final fantasy)
aerith gainsborough
ffaerith
.aerith

black mage (final fantasy)

freya crescent (final fantasy)
freya crescent
fffreya
.freya

garnet til alexandros xvii (final fantasy)
garnet til alexandros xvii
ffgarnet
.garnet

quistis trepe (final fantasy)
quistis trepe
ffquistis
.quistis

rinoa heartily (final fantasy)
rinoa heartily
ffrinoa
.rinoa

selphie tilmitt (final fantasy)
selphie tilmitt
ffselphie
.selphie

tifa lockheart (final fantasy)
tifa lockheart
fftifa
.tifa

white mage (final fantasy)
white mage (fft)

yuffie kisaragi (final fantasy)
yuffie kisaragi
ffyuffie
.yuffie

- ==== final fantasy xiv ====

yotsuyu (final fantasy xiv)

- ==== final fight ====

poison (final fight)
.poison
poison

- ==== fire emblem ====

camilla (fire emblem)

cordelia (fire emblem)

fae (fire emblem)

female byleth (fire emblem)

female corrin (fire emblem)

female kana (fire emblem)

kagero (fire emblem)

lissa (fire emblem)

male corrin (fire emblem)

male robin (fire emblem)

mitama (fire emblem)
mitama (kamikatsu)

myrrh (fire emblem)

ninian (fire emblem)
ninian (bright-eyed bride) (fire emblem)

nyx (fire emblem)

ophelia (fire emblem)

rhajat (fire emblem)

sakura (fire emblem)

selkie (fire emblem)

soleil (fire emblem)

sophie (fire emblem)

tharja (fire emblem)
tharja (obsessive bride) (fire emblem)

- ==== flim13 ====

mitsuki (flim13)

- ==== flower knight girl ====

oenothera (flower knight girl)

- ==== flytrapxx ====

liz (flytrapxx)

- ==== fma ====

alexander (fma)

envy (fma)

father (fma)

gluttony (fma)

greed (fma)

lust (fma)

pride (fma)

sloth (fma)

wrath (fma)

- ==== forastero ====

jazel (forastero)

ponpon (forastero)

- ==== frozen ====

elsa (frozen)

- ==== fukai ryousuke ====

swimming club kouhai (fukai ryousuke)

- ==== fullbokko heroes ====

bastet (fullbokko heroes)

- ==== futanari no elf ====

mara (futanari no elf)

tansho (futanari no elf)

- ==== gaia ====

viviana (gaia)

- ==== gawr gura ====

bloop (gawr gura)

- ==== genshin impact ====

aether (genshin impact)
.genshinaether
.aether
genshinaether

amber (genshin impact)

arlecchino (genshin impact)

barbara (genshin impact)
barbara (summertime sparkle) (genshin impact)

baron bunny (genshin impact)

bathysmal vishap (genshin impact)

blathine (genshin impact)

candace (genshin impact)

chongyun (genshin impact)
.genshinchongyun
.chongyun
genshinchongyun

collei (genshin impact)

dahlia (genshin impact)
.genshindahlia
.dahlia
genshindahlia

dehya (genshin impact)

diona (genshin impact)

dori (genshin impact)

elphane (genshin impact)

eula (genshin impact)
.genshineula
.eula
genshineula

fischl (genshin impact)

freminet (genshin impact)
.genshinfreminet
.freminet
genshinfreminet

ganyu (genshin impact)
.genshinganyu
.ganyu
genshinganyu

gorou (genshin impact)
.genshingorou
.gorou
genshingorou

hilichurl (genshin impact)

hu tao (genshin impact)

jean (genshin impact)
jean (sea breeze dandelion) (genshin impact)

jinni (genshin impact)

kachina (genshin impact)

klee (genshin impact)

lisa (genshin impact)
lisa (xes fantasia)

lumine (genshin impact)

lyney (genshin impact)
.genshinlyney
.lyney
genshinlyney

melusine (genshin impact)

mirror maiden (genshin impact)

mitachurl (genshin impact)

mona (genshin impact)

nahida (genshin impact)

nilou (genshin impact)

noelle (genshin impact)

paimon (genshin impact)
paimon (magi)

qiqi (genshin impact)

raiden shogun (genshin impact)
raiden shogun
.genshinraiden
.raiden
genshinraiden

rosaria (genshin impact)

sayu (genshin impact)

scaramouche (genshin impact)

shenhe (genshin impact)

signora (genshin impact)

tighnari (genshin impact)
.genshintighnari
.tighnari
genshintighnari

venti (genshin impact)
venti
.genshinventi
genshinventi

vishap (genshin impact)

wanderer (genshin impact)

xianyun (genshin impact)

xingqiu (genshin impact)

xinqui (genshin impact)
xinqui
.genshinxingqui
.xingqui
genshinxingqui

yaoyao (genshin impact)

yelan (genshin impact)

- ==== gentlemannco ====

evelyn (gentlemannco)

- ==== genus ====

gallus (genus)

- ==== gintama ====

kagura (gintama)

- ==== girls' frontline ====

ak-15 (girls' frontline)

g36 (girls' frontline)

k11 (girls' frontline)
k11 (lil' scientist) (girls' frontline)

pkp (girls' frontline)
pkp (after-rain assault squad) (girls' frontline)

type 97 (girls' frontline)

- ==== gjall ====

kara (gjall)

sammy (gjall)

- ==== granblue fantasy ====

aliza (granblue fantasy)

anila (granblue fantasy)
anila (granblue)

bai (granblue fantasy)

cagliostro (granblue fantasy)

carmelina (granblue fantasy)

catura (granblue fantasy)

charlotta (granblue fantasy)

cindala (granblue fantasy)

clarisse (granblue fantasy)

djeeta (granblue fantasy)

draph race (granblue fantasy)

elisheba (granblue fantasy)

fediel (granblue fantasy)

ferry (granblue fantasy)
ferry (santa minidress) (granblue fantasy)

fighter (granblue fantasy)

galleon (granblue fantasy)

gran (granblue fantasy)

huang (granblue fantasy)

kumbhira (granblue fantasy)

lich (granblue fantasy)

lunalu (granblue fantasy)

lyria (granblue fantasy)

monika (granblue fantasy)

narmaya (granblue fantasy)

nier (granblue fantasy)

niyon (granblue fantasy)

silva (granblue fantasy)

yaia (granblue fantasy)

- ==== grandia ====

feena (grandia)

justin (grandia)

sue (grandia)

- ==== grim adventures ====

mandy (grim adventures)

- ==== guilty gear ====

baiken (guilty gear)
.ggbaiken
.baiken
ggbaiken

bridget (guilty gear)
.ggbridget
.bridget
ggbridget

dizzy (guilty gear)

giovanna (guilty gear)

may (guilty gear)

ramlethal valentine (guilty gear)
.ggramlethal
.ramlethal
ggramlethal

- ==== hanabi ====

shimizu yuki (hanabi)

- ==== happy tree friends ====

handy (happy tree friends)

- ==== hataraku saibou ====

macrophage (hataraku saibou)

platelet (hataraku saibou)

red blood cell (hataraku saibou)

white blood cell (hataraku saibou)

- ==== hazakura hinata ====

kaya (hazakura hinata)

kurumi (hazakura hinata)

- ==== helldivers ====

helldiver (helldivers)

- ==== helltaker ====

cerberus (helltaker)

lucifer (helltaker)

malina (helltaker)

- ==== heroes of incredible tales ====

kiki (heroes of incredible tales)

- ==== heroes of the storm ====

johanna (heroes of the storm)

orphea (heroes of the storm)

- ==== hetalia ====

america (hetalia)

- ==== hevymin ====

koko (hevymin)

- ==== hilda ====

hilda (hilda)
hilda (series)
hilda (hilda) (series)

david (hilda)
david (hilda) (series)

johanna (hilda)
johanna (hilda) (series)

- ==== hiraeth ====

inke (hiraeth)

marylene (hiraeth)

- ==== hollow knight ====

hornet (hollow knight)
.hollowhornet
hollowhornet

- ==== hololive ====

a-chan (hololive)
a-chan (holo)
a-chan
a chan (hololive)
a chan (holo)
a chan
.holoachan
holoachan

airani iofifteen (hololive)
airani iofifteen (holo)
airani iofifteen
iofifteen airani (hololive)
iofifteen airani (holo)
iofifteen airani
airani (hololive)
airani (holo)
airani
iofifteen (hololive)
iofifteen (holo)
iofifteen
.holoiofi
holoiofi

akai haato (hololive)
akai haato (holo)
akai haato
haato akai (hololive)
haato akai (holo)
haato akai
akai (hololive)
akai (holo)
haato (hololive)
haato (holo)
haachama (hololive)
haachama (holo)
haachama
.holohaachama
holohaachama

aki rosenthal (hololive)
aki rosenthal (holo)
aki rosenthal
rosenthal aki (hololive)
rosenthal aki (holo)
rosenthal aki
aki (hololive)
aki (holo)
rosenthal (hololive)
rosenthal (holo)
.holoaki
holoaki

amane kanata (hololive)
amane kanata (holo)
amane kanata
kanata amane (hololive)
kanata amane (holo)
kanata amane
amane (hololive)
amane (holo)
kanata (hololive)
kanata (holo)
.holokanata
holokanata

anya melfissa (hololive)
anya melfissa (holo)
anya melfissa
melfissa anya (hololive)
melfissa anya (holo)
melfissa anya
anya (hololive)
anya (holo)
melfissa (hololive)
melfissa (holo)
.holoanya
holoanya

ayunda risu (hololive)
ayunda risu (holo)
ayunda risu
risu ayunda (hololive)
risu ayunda (holo)
risu ayunda
ayunda (hololive)
ayunda (holo)
risu (hololive)
risu (holo)
.holorisu
holorisu

azki (hololive)
azki (holo)
azki
.holoazki
holoazki

cecilia immergreen (hololive)
cecilia immergreen (holo)
cecilia immergreen
immergreen cecilia (hololive)
immergreen cecilia (holo)
immergreen cecilia
cecilia (hololive)
cecilia (holo)
immergreen (hololive)
immergreen (holo)
.holocecilia
holocecilia

ceres fauna (hololive)
ceres fauna (holo)
ceres fauna
fauna ceres (hololive)
fauna ceres (holo)
fauna ceres
ceres (hololive)
ceres (holo)
fauna (hololive)
fauna (holo)
fauna
.holofauna
holofauna

elizabeth rose bloodflame (hololive)
elizabeth rose bloodflame (holo)
elizabeth rose bloodflame
bloodflame elizabeth rose (hololive)
bloodflame elizabeth rose (holo)
bloodflame elizabeth rose
elizabeth rose (hololive)
elizabeth rose (holo)
elizabeth (hololive)
elizabeth (holo)
bloodflame (hololive)
bloodflame (holo)
erb (hololive)
erb (holo)
.holoerb
holoerb

fuwawa abyssgard (hololive)
fuwawa abyssgard (holo)
fuwawa abyssgard
abyssgard fuwawa (hololive)
abyssgard fuwawa (holo)
abyssgard fuwawa
fuwawa (hololive)
fuwawa (holo)
fuwawa
.holofuwawa
holofuwawa

gawr gura (hololive)
gawr gura (holo)
gawr gura
gura gawr (hololive)
gura gawr (holo)
gura gawr
gawr (hololive)
gawr (holo)
gura (hololive)
gura (holo)
gura
.hologura
hologura

gigi murin (hololive)
gigi murin (holo)
gigi murin
murin gigi (hololive)
murin gigi (holo)
murin gigi
gigi (hololive)
gigi (holo)
murin (hololive)
murin (holo)
gigi
.hologigi
hologigi

hakos baelz (hololive)
hakos baelz (holo)
hakos baelz
baelz hakos (hololive)
baelz hakos (holo)
baelz hakos
hakos (hololive)
hakos (holo)
baelz (hololive)
baelz (holo)
.holobae
holobae

hakui koyori (hololive)
hakui koyori (holo)
hakui koyori
koyori hakui (hololive)
koyori hakui (holo)
koyori hakui
hakui (hololive)
hakui (holo)
koyori (hololive)
koyori (holo)
.holokoyori
holokoyori

himemori luna (hololive)
himemori luna (holo)
himemori luna
luna himemori (hololive)
luna himemori (holo)
luna himemori
himemori (hololive)
himemori (holo)
luna (hololive)
luna (holo)
.hololuna
hololuna

hiodoshi ao (hololive)
hiodoshi ao (holo)
hiodoshi ao
ao hiodoshi (hololive)
ao hiodoshi (holo)
ao hiodoshi
hiodoshi (hololive)
hiodoshi (holo)
ao (hololive)
ao (holo)
.holoao
holoao

hochimachi suisei (hololive)
hochimachi suisei (holo)
hochimachi suisei
suisei hochimachi (hololive)
suisei hochimachi (holo)
suisei hochimachi
hochimachi (hololive)
hochimachi (holo)
suisei (hololive)
suisei (holo)
suisei
.holosuisei
holosuisei

houshou marine (hololive)
houshou marine (holo)
honshou marine
holomarine
houshou marine (hololive)
houshou marine (holo)
houshou marine
houshou (hololive)
honshou (holo)
marine (hololive)
marine (holo)
marine honshou (hololive)
marine honshou (holo)
marine honshou
honshou marine (hololive)
honshou marine (holo)
honshou marine
honshou (hololive)
honshou (holo)
honshou (hololive)
honshou (holo)
.holohoushou

ichijou ririka (hololive)
ichijou ririka (holo)
ichijou ririka
ririka ichijou (hololive)
ririka ichijou (holo)
ririka ichijou
ichijou (hololive)
ichijou (holo)
ririka (hololive)
ririka (holo)
.holo ririka

inugami korone (hololive)
inugami korone (holo)
inugami korone
korone inugami (hololive)
korone inugami (holo)
korone inugami
inugami (hololive)
inugami (holo)
korone (hololive)
korone (holo)
korone
.holokorone
holokorone

irys (hololive)
irys (holo)
irys
.holoirys
holoirys

juufuutei raden (hololive)
juufuutei raden (holo)
juufuutei raden
raden juufuutei (hololive)
raden juufuutei (holo)
raden juufuutei
juufuutei (hololive)
juufuutei (holo)
raden (hololive)
raden (holo)
.holoraden
holoraden

kaela kovalskia (hololive)
kaela kovalskia (holo)
kaela kovalskia
kovalskia kaela (hololive)
kovalskia kaela (holo)
kovalskia kaela
kaela (hololive)
kaela (holo)
kovalskia (hololive)
kovalskia (holo)
kaela
.holokaela
holokaela

kazama iroha (hololive)
kazama iroha (holo)
iroha kazama (hololive)
iroha kazama (holo)
iroha kazama
kazama (hololive)
kazama (holo)
iroha (hololive)
iroha (holo)
.holoiroha
holoiroha

kiryu coco (hololive)
kiryu coco (holo)
kiryu coco
coco kiryu (hololive)
coco kiryu (holo)
coco kiryu
kiryu (hololive)
kiryu (holo)
coco (hololive)
coco (holo)
coco
.holococo
holococo

kobo kanaeru (hololive)
kobo kanaeru (holo)
kobo kanaeru
kanaeru kobo (hololive)
kanaeru kobo (holo)
kanaeru kobo
kobo (hololive)
kobo (holo)
kanaeru (hololive)
kanaeru (holo)
kobo
.holokobo
holokobo

koseki bijou (hololive)
koseki bijou (holo)
koseki bijou
bijou koseki (hololive)
bijou koseki (holo)
bijou koseki
koseki (hololive)
koseki (holo)
bijou (hololive)
bijou (holo)
bijou
.holobijou
holobijou

kureiji ollie (hololive)
kureiji ollie (holo)
kureiji ollie
ollie kureiji (hololive)
ollie kureiji (holo)
ollie kureiji
kureiji (hololive)
kureiji (holo)
ollie (hololive)
ollie (holo)
.holoollie
holoollie

la+ darkness (hololive)
la+ darkness (holo)
la+ darkness
la+ (hololive)
la+
darkness la+ (hololive)
laplus darkness (hololive)
laplus darkness (holo)
laplus darkness
laplus (hololive)
laplus
.hololaplus
hololaplus

minato aqua (hololive)
minato aqua (holo)
minato aqua
aqua minato (hololive)
aqua minato (holo)
aqua minato
minato (hololive)
minato (holo)
aqua (hololive)
aqua (holo)
.holoaqua
holoaqua

mococo abyssgard (hololive)
mococo abyssgard (holo)
mococo abyssgard
abyssgard mococo (hololive)
abyssgard mococo (holo)
abyssgard mococo
mococo (hololive)
mococo (holo)
mococo
.holomococo
holomococo

momosuzu nene (hololive)
momosuzu nene (holo)
momosuzu nene
nene momosuzu (hololive)
nene momosuzu (holo)
nene momosuzu
momosuzu (hololive)
momosuzu (holo)
nene (hololive)
nene (holo)
nene
.holonene
holonene

moona hoshinova (hololive)
moona hoshinova (holo)
moona hoshinova
hoshinova moona (hololive)
hoshinova moona (holo)
hoshinova moona
moona (hololive)
moona (holo)
hoshinova (hololive)
hoshinova (holo)
moona
.holomoona
holomoona

mori calliope (hololive)
mori calliope (holo)
mori calliope
calliope mori (hololive)
calliope mori (holo)
calliope mori
mori (hololive)
mori (holo)
calliope (hololive)
calliope (holo)
calli (hololive)
calli (holo)
calli
.holocalli
holocalli

murasaki shion (hololive)
murasaki shion (holo)
murasaki shion
shion murasaki (hololive)
shion murasaki (holo)
shion murasaki
murasaki (hololive)
murasaki (holo)
shion (hololive)
shion (holo)
shion
.holoshion
holoshion

nakiri ayame (hololive)
nakiri ayame (holo)
nakiri ayame
ayame nakiri (hololive)
ayame nakiri (holo)
ayame nakiri
nakiri (hololive)
nakiri (holo)
ayame (hololive)
ayame (holo)
nakiri ayane (hololive)
nakiri ayane (holo)
nakiri ayane
ayane nakiri (hololive)
ayane nakiri (holo)
ayane nakiri
ayane (hololive)
ayane (holo)
nakiri
.holoayame
holoayame

nanashi mumei (hololive)
nanashi mumei (holo)
nanashi mumei
mumei nanashi (hololive)
mumei nanashi (holo)
mumei nanashi
nanashi (hololive)
nanashi (holo)
mumei (hololive)
mumei (holo)
mumei
.holomumei
holomumei

natsuhiro matsuri (hololive)
natsuhiro matsuri (holo)
natsuhiro matsuri
matsuri natsuhiro (hololive)
matsuri natsuhiro (holo)
matsuri natsuhiro
natsuhiro (hololive)
natsuhiro (holo)
matsuri (hololive)
matsuri (holo)
matsuri
.holomatsuri
holomatsuri

nekomata okayu (hololive)
nekomata okayu (holo)
nekomata okayu
okayu nekomata (hololive)
okayu nekomata (holo)
okayu nekomata
nekomata (hololive)
nekomata (holo)
okayu (hololive)
okayu (holo)
okayu
.holookayu
holookayu

nerissa ravencroft (hololive)
nerissa ravencroft (holo)
nerissa ravencroft
ravencroft nerissa (hololive)
ravencroft nerissa (holo)
ravencroft nerissa
nerissa (hololive)
nerissa (holo)
ravencroft (hololive)
ravencroft (holo)
.holonerisaa
holonerisaa

ninomae ina'nis (hololive)
ninomae ina'nis (holo)
ninomae ina'nis
ina'nis ninomae (hololive)
ina'nis ninomae (holo)
ina'nis ninomae
ninomae (hololive)
ninomae (holo)
ina'nis (hololive)
ina'nis (holo)
ninomae ina (hololive)
ninomae ina (holo)
ninomae ina
ina ninomae (hololive)
ina ninomae (holo)
ina ninomae
ina (hololive)
ina (holo)
.holoina
holoina

omaru polka (hololive)
omaru polka (holo)
omaru polka
polka omaru (hololive)
polka omaru (holo)
polka omaru
omaru (hololive)
omaru (holo)
polka (hololive)
polka (holo)
.holopolka
holopolka

ookami mio (hololive)
ookami mio (holo)
ookami mio
mio ookami (hololive)
mio ookami (holo)
mio ookami
ookami (hololive)
ookami (holo)
mio (hololive)
mio (holo)
.holomio
holomio

oozora subaru (hololive)
oozora subaru (holo)
oozora subaru
subaru oozora (hololive)
subaru oozora (holo)
subaru oozora
oozora (hololive)
oozora (holo)
subaru (hololive)
subaru (holo)
.holosubaru
holosubaru

otonose kanade (hololive)
otonose kanade (holo)
otonose kanade
kanade otonose (hololive)
kanade otonose (holo)
kanade otonose
otonose (hololive)
otonose (holo)
kanade (hololive)
kanade (holo)
.holokanade
holokanade

ouro kronii (hololive)
ouro kronii (holo)
ouro kronii
kronii ouro (hololive)
kronii ouro (holo)
kronii ouro
ouro (hololive)
ouro (holo)
kronii (hololive)
kronii (holo)
.holokronii
holokronii

pavolia reine (hololive)
pavolia reine (holo)
pavolia reine
reine pavolia (hololive)
reine pavolia (holo)
reine pavolia
pavolia (hololive)
pavolia (holo)
reine (hololive)
reine (holo)
.holoreine
holoreine

pekomama (hololive)
pekomama (holo)
pekomama
.holopeko
holopekomama

raora panthera (hololive)
raora panthera (holo)
raora panthera
panthera raora (hololive)
panthera raora (holo)
panthera raora
raora (hololive)
raora (holo)
panthera (hololive)
panthera (holo)
.holoraora
holoraora

roboco-san (hololive)
roboco-san (holo)
roboco-san
roboco (hololive)
roboco (holo)
roboco
.holoroboco
holoroboco

sakamata chloe (hololive)
sakamata chloe (holo)
sakamata chloe
chloe sakamata (hololive)
chloe sakamata (holo)
chloe sakamata
sakamata (hololive)
sakamata (holo)
chloe (hololive)
chloe (holo)
.holochloe
holochloe

sakura miko (hololive)
sakura miko (holo)
sakura miko
miko sakura (hololive)
miko sakura (holo)
miko sakura
sakura (hololive)
sakura (holo)
miko (hololive)
miko (holo)
.holomiko
holomiko

shiori novella (hololive)
shiori novella (holo)
shiori novella
novella shiori (hololive)
novella shiori (holo)
novella shiori
shiori (hololive)
shiori (holo)
novella (hololive)
novella (holo)
.holoshiori
holoshiori

shiranui flare (hololive)
shiranui flare (holo)
shiranui flare
flare shiranui (hololive)
flare shiranui (holo)
flare shiranui
shiranui (hololive)
shiranui (holo)
flare (hololive)
flare (holo)
.holoflare
holoflare

shirogane noel (hololive)
shirogane noel (holo)
shirogane noel
noel shirogane (hololive)
noel shirogane (holo)
noel shirogane
shirogane (hololive)
shirogane (holo)
noel (hololive)
noel (holo)
.holonoel
holonoel

shirakami fubuki (hololive)
shirakami fubuki (holo)
shirakami fubuki
fubuki shirakami (hololive)
fubuki shirakami (holo)
fubuki shirakami
shirakami (hololive)
shirakami (holo)
shirokami fubuki (hololive)
shirokami fubuki (holo)
shirokami fubuki
fubuki shirokami (hololive)
fubuki shirokami (holo)
fubuki shirokami
shirokami (hololive)
shirokami (holo)
shirogane fubuki (hololive)
shirogane fubuki (holo)
shirogane fubuki
fubuki shirogane (hololive)
fubuki shirogane (holo)
fubuki shirogane
shirogane (hololive)
shirogane (holo)
fubuki (hololive)
fubuki (holo)
.holofubuki
holofubuki

shishiro botan (hololive)
shishiro botan (holo)
holobotan
shishiro botan
botan shishiro (hololive)
botan shishiro (holo)
botan shishiro
shishiro (hololive)
shishiro (holo)
botan (hololive)
botan (holo)
botan
.holobotan

takanashi kiara (hololive)
takanashi kiara (holo)
holokiara
takanashi kiara
kiara takanashi (hololive)
kiara takanashi (holo)
kiara takanashi
takanashi (hololive)
takanashi (holo)
kiara (hololive)
kiara (holo)
takansi kiara (hololive)
takansi kiara (holo)
takansi kiara
kiara takansi (hololive)
kiara takansi (holo)
kiara takansi
takansi (hololive)
takansi (holo)
kiara
.holokiara

takane lui (hololive)
takane lui (holo)
takane lui
lui takane (hololive)
lui takane (holo)
lui takane
takane (hololive)
takane (holo)
lui (hololive)
lui (holo)
.hololui
hololui

todoroki hajime (hololive)
todoroki hajime (holo)
todoroki hajime
hajime todoroki (hololive)
hajime todoroki (holo)
hajime todoroki
todoroki (hololive)
todoroki (holo)
hajime (hololive)
hajime (holo)
.holohajime
holohajime

tokino sora (hololive)
tokino sora (holo)
tokino sora
sora tokino (hololive)
sora tokino (holo)
sora tokino
tokino (hololive)
tokino (holo)
sora (hololive)
sora (holo)
.holosora
holosora

tokoyami towa (hololive)
tokoyami towa (holo)
tokoyami towa
towa tokoyami (hololive)
towa tokoyami (holo)
towa tokoyami
tokoyami (hololive)
tokoyami (holo)
towa (hololive)
towa (holo)
.holotowa
holotowa

tsukumo sana (hololive)
tsukumo sana (holo)
tsukumo sana
sana tsukumo (hololive)
sana tsukumo (holo)
sana tsukumo
tsukumo (hololive)
tsukumo (holo)
tsukomo sana (hololive)
tsukomo sana (holo)
tsukomo sana
sana tsukomo (hololive)
sana tsukomo (holo)
sana tsukomo
tsukomo (hololive)
tsukomo (holo)
sana (hololive)
sana (holo)
.holosana
holosana

tsunomaki watame (hololive)
tsunomaki watame (holo)
tsunomaki watame
watame tsunomaki (hololive)
watame tsunomaki (holo)
watame tsunomaki
tsunomaki (hololive)
tsunomaki (holo)
watame (hololive)
watame (holo)
watame
.holowatame
holowatame

usada pekora (hololive)
usada pekora (holo)
usada pekora
pekora usada (hololive)
pekora usada (holo)
pekora usada
usada (hololive)
usada (holo)
pekora (hololive)
pekora (holo)
pekora
.holopekora
holopekora

vestia zeta (hololive)
vestia zeta (holo)
vestia zeta
zeta vestia (hololive)
zeta vestia (holo)
zeta vestia
vestia (hololive)
vestia (holo)
zeta (hololive)
zeta (holo)
.holozeta
holozeta

watson amelia (hololive)
watson amelia (holo)
watson amelia
amelia watson (hololive)
amelia watson (holo)
amelia watson
watson (hololive)
watson (holo)
amelia (hololive)
amelia (holo)
ame (hololive)
ame (holo)
.holoame
holoame

yozora mel (hololive)
yozora mel (holo)
yozora mel
mel yozora (hololive)
mel yozora (holo)
mel yozora
yozora (hololive)
yozora (holo)
mel (hololive)
mel (holo)
.holomel
holomel

yukihana lamy (hololive)
yukihana lamy (holo)
yukihana lamy
lamy yukihana (hololive)
lamy yukihana (holo)
lamy yukihana
yukihana (hololive)
yukihana (holo)
lamy (hololive)
lamy (holo)
.hololamy
hololamy

yuzuki choco (hololive)
yuzuki choco (holo)
yuzuki choco
choco yuzuki (hololive)
choco yuzuki (holo)
choco yuzuki
yuzuki (hololive)
yuzuki (holo)
choco (hololive)
choco (holo)
.holochoco
holochoco

- ==== honkai: star rail ====

himeko (honkai: star rail)

kafka (honkai: star rail)

march 7th (honkai: star rail)

sparkle (honkai: star rail)

- ==== housamo ====

protagonist 1 (housamo)

protagonist 4 (housamo)

sandayu (housamo)

- ==== httyd ====

heather (httyd)

- ==== huffslove ====

abigail (huffslove)

regina (huffslove)
regina (dino crisis)

syllia (huffslove)

trixie (huffslove)

vee (huffslove)

- ==== hunter x hunter ====

biscuit krueger (hunter x hunter)
.bisky
biscuit krueger
bisky

hunterxhunter (hunter x hunter)
hunterxhunter

- ==== hyrule warriors ====

cia (hyrule warriors)

link (hyrule warriors)

- ==== idolmaster ====

leon (idolmaster)

producer (idolmaster)

- ==== ignitedyam ====

lin (ignitedyam)

- ==== illya ====

dangerous beast (illya)

- ==== inuyasha ====

kohaku (inuyasha)

- ==== ishuzoku reviewers ====

aloe (ishuzoku reviewers)

elza (ishuzoku reviewers)

- ==== j7w ====

meikko-chan (j7w)

miyuki-chan (j7w)

- ==== jack cayless ====

alarion (jack cayless)

sainn (jack cayless)

- ==== jahy-sama wa kujikenai ====

jahy (jahy-sama wa kujikenai)
jahy
jahy-sama
.charjahy
ahy

- ==== jk bitch ====

kuroko (jk bitch)

- ==== jojo ====

mariah (jojo)

- ==== jorenran ====

lily (jorenran)

- ==== jujutsu kaisen ====

ryoumen sukuna (jujutsu kaisen)

uraume (jujutsu kaisen)

- ==== jungle de ikou ====

mii (jungle de ikou)

- ==== kaiten muten-maru ====

komai (kaiten muten-maru)

- ==== kamen rider 01 ====

is (kamen rider 01)

- ==== kaname mitsumata ====

marimu (kaname mitsumata)

- ==== kancolle ====

admiral (kancolle)

akatsuki (kancolle)

amatsukaze (kancolle)

atago (kancolle)

chikuma (kancolle)
chikuma (kantai collection)

hayasui (kancolle)

hibiki (kancolle)

hiryuu (kancolle)

i-19 (kancolle)

ikazuchi (kancolle)

inazuma (kancolle)

jervis (kancolle)

kashima (kancolle)

kazagumo (kancolle)

ro-500 (kancolle)

ryuujou (kancolle)

shimakaze (kancolle)

souryuu (kancolle)

tenryuu (kancolle)

tone (kancolle)
tone (kantai collection)

yayoi (kancolle)

zuikaku (kancolle)

- ==== kazoku kan ecchi ====

saya (kazoku kan ecchi)

sayuri (kazoku kan ecchi)

shou (kazoku kan ecchi)

yuka (kazoku kan ecchi)

- ==== kemomimi oukoku kokuei housou ====

mikoko (kemomimi oukoku kokuei housou)

- ==== kemono friends ====

african wild dog (kemono friends)

brown bear (kemono friends)

captain (kemono friends)

emperor penguin (kemono friends)

giant penguin (kemono friends)

golden snub-nosed monkey (kemono friends)

- ==== kenjaku ====

getou suguru (kenjaku)

- ==== kenny3901 ====

cody (kenny3901)

- ==== kibix1 ====

leora (kibix1)

- ==== kid icarus ====

palutena
palutena (kid icarus)

pit (kid icarus)

- ==== kidcairo ====

seraph (kidcairo)

- ==== kill la kill ====

jakuzure nonon (kill la kill)
jakuzure nonon
.klknonon
klknonon

kiryuin satsuki (kill la kill)
kiryuin satsuki
kiryuuin satsuki (kill la kill)
.klksatsuki
klksatsuki

mankanshoku mako (kill la kill)
.klkmako
klkmako

matoi ryuuko (kill la kill)
.klkryuko
matoi ryuuko
klkryuko

senketsu (kill la kill)
senketsu

- ==== kingbang ====

freyja (kingbang)

- ==== kingdom hearts ====

aqua (kingdom hearts)

vanitas (kingdom hearts)

- ==== kof ====

shermie (kof)

- ==== komi-san wa komyushou desu ====

komi shouko (komi-san wa komyushou desu)
komi shouko
komi-san (komi-san wa komyushou desu)
komi-san
komi (komi-san wa komyushou desu)
komi
komisan (komi-san wa komyushou desu)
komisan
shouko komi (komi-san wa komyushou desu)
shouko komi
komikomi
komishouko

komi shuuko (komi-san wa komyushou desu)
komi shuuko
shuuko komi (komi-san wa komyushou desu)
shuuko komi
komishuuko

osana najimi (komi-san wa komyushou desu)
osana najimi
najimi osana (komi-san wa komyushou desu)
najimi osana
najimi (komi-san wa komyushou desu)
najimi
komiosana
kominajimi

- ==== konosuba ====

aqua (konosuba)
.aqua
.konosubaaqua
konosubaaqua

chris (konosuba)

darkness (konosuba)
.darkness
.konosubadarkness
.ness
konosubadarkness

megumin (konosuba)
.konosubamegumin
.megumin
konosubamegumin

sylvia (konosuba)

wiz (konosuba)
wiz

yunyun (konosuba)
yunyun

- ==== kunoichi tsubaki no mune no uchi ====

mokuren (kunoichi tsubaki no mune no uchi)

tsubaki (kunoichi tsubaki no mune no uchi)

- ==== kusuriya no hitorigoto ====

maomao (kusuriya no hitorigoto)
.maomao
maomao

- ==== la pucelle tactics ====

eclair (la pucelle tactics)

- ==== last origin ====

black wyrm (last origin)

brownie (last origin)

cerberus (last origin)

commander (last origin)

draculina (last origin)
draculina (micro bikini) (last origin)

invincible dragon (last origin)

labiata (last origin)

mari (last origin)

orangeade (last origin)

perrault (last origin)

poi (last origin)

- ==== league of legends ====

ahri (league of legends)
ahri (lol)
ahri

akali (league of legends)
akali (lol)

alistar (league of legends)
alistar (lol)

annie (league of legends)
annie (lol)

ashe (league of legends)
ashe (lol)

blacksmith poppy (lol)

caitlyn (league of legends)
caitlyn (lol)

cassiopeia (league of legends)
cassiopeia (lol)

darius (league of legends)
darius (lol)

elise (league of legends)
elise (lol)

evelynn (league of legends)
evelynn (lol)

fiora (league of legends)
fiora (lol)

gangplank (league of legends)
gangplank (lol)

janna (league of legends)
janna (lol)

jinx (league of legends)
jinx (lol)

katarina (league of legends)
katarina (lol)

kayle (league of legends)
kayle (lol)

leblanc (league of legends)
leblanc (lol)

leona (league of legends)
leona (lol)

lillia (league of legends)
lillia (lol)

lulu (league of legends)
yordlelulu
lulu (lol)
.lulu

lux (league of legends)
lux (lol)

miss fortune (league of legends)
miss fortune (lol)

morgana (league of legends)
morgana (lol)

noxus poppy (lol)

poppy (league of legends)
poppy (lol)
yordlepoppy
.poppy

riven (league of legends)
riven (lol)

seraphine (league of legends)
seraphine (lol)

shadow (lol)

sona (league of legends)
sona (lol)

soraka (league of legends)
soraka (lol)

summoner (league of legends)
summoner (lol)

tristana (league of legends)
tristana (lol)
yordletristana
.tristana

vayne (league of legends)
vayne (lol)

vex (league of legends)
vex (lol)
yordlevex
.vex

vi (league of legends)
vi (lol)

zoe (league of legends)
zoe (lol)

- ==== legend of queen opala ====

illumi (legend of queen opala)

- ==== lero ray ====

sachi (lero ray)

- ==== limbus company ====

don quixote (limbus company)

- ==== live a live ====

kunoichi (live a live)

- ==== lost kingdoms ====

helena (lost kingdoms)
.lostkingdomshelena
.helena
lostkingdomshelena

katia (lost kingdoms)
.lostkingdomskatia
.katia
lostkingdomskatia

- ==== mabinogi ====

succubus (mabinogi)

- ==== mabinogi heroes ====

succubus queen (mabinogi heroes)

- ==== made in abyss ====

mitty (made in abyss)

nanachi (made in abyss)
nanachi

reg (made in abyss)
reg

riko (made in abyss)
riko

- ==== mahou shoujo ni akogarete ====

leoparde (mahou shoujo ni akogarete)

- ==== mahoujin guruguru ====

kukuri (mahoujin guruguru)

- ==== maidragon ====

elma (maidragon)

ilulu (maidragon)
.maidragonilulu
.ilulu
ilulu
ilulu (dragon maid)
maidragonilulu

kanna kamui (maidragon)
kanna kamui
kanna (maidragon)
.maidragonkanna
kanna
maidragonkanna

kobayashi (maidragon)
kobayashi
kobayashi-san (maidragon)
kobayashi-san

lucoa (maidragon)
lucoa
.maidragonlucoa
quetzalcoatl (dragon maid)
quetzalcoatl (maidragon)
maidragonlucoa

tohru (maidragon)
tohru
.maidragontohru
maidragontohru

- ==== malberrybush ====

malyna (malberrybush)

- ==== maou-jou de oyasumi ====

syalis (maou-jou de oyasumi)
aurora sya lis kaymin
syalis
princess syalis

- ==== maplestory2 ====

mint (maplestory2)

vanilla (maplestory2)

- ==== mario ====

boo
boo (mario)

bowsette
bowsette (mario)

luma (mario)
hungry luma
luma

piranha plant
piranha plant (mario)

princess daisy
princess daisy (mario)
mariodaisy
.daisy

princess peach
princess peach (mario)
mariopeach
.peach

princess rosalina
rosalina
princess rosalina (mario)
marioRosalina

shy gal
shy gal (mario)
marioshygal
shygal

shy guy
shy guy (mario)

super star (mario)

toad (mario)

vivian (mario)
vivian (paper mario)

- ==== maruyama ====

overlord (maruyama)

- ==== marvel rivals ====

emma frost
emma frost (marvel rivals)
emma frost (marvel)

psylocke
psylocke (marvel rivals)
psylocke (marvel)

- ==== mega man ====

luna platz (mega man)

mega man
megaman
mega man (mega man)
megaman (mega man)

roll (mega man)
roll
megaroll
roll (megaman)

splash woman
splash woman (mega man)
megasplash

yai ayanokoji (mega man)

- ==== meme ====

coomer (meme)

- ==== merunyaa ====

meruccubus (merunyaa)

- ==== metal gear ====

quiet (metal gear)

- ==== metroid ====

samus aran (metroid)
samus aran

zero suit (metroid)
zero suit

- ==== michihasu ====

lina (michihasu)

- ==== mikeyuk ====

mikey (mikeyuk)

- ==== ming ====

momotani kaoru (ming)

- ==== mitsuboshi colors ====

aoyama kotoha (mitsuboshi colors)

- ==== mlp ====

princess celestia (mlp)

shining armor (mlp)

- ==== mon-musu quest ====

eva (mon-musu quest)

kate (mon-musu quest)

luka (mon-musu quest)

sonya (mon-musu quest)
sonya (kill me baby)

- ==== monster hunter ====

fiorayne (monster hunter)

yomogi (monster hunter)

- ==== monster musume ====

lilith (monster musume)

miia (monster musume)

papi (monster musume)

suu (monster musume)

zombina (monster musume)

- ==== my hero academia ====

asui tsuyu (my hero academia)
asui tsuyu
tsuyu asui
froppy
.mhafroppy
.froppy
mhafroppy

la brava (my hero academia)
la brava

midnight (my hero academia)
.mhamidnight
.midnight
mhamidnight

mirko (my hero academia)
.mhamirko
miruko
.mirko
mhamirko

uraraka ochaco (my hero academia)
.mhaochaco
.ochaco
mhaochaco

yaoyorozu momo (my hero academia)
.mhamomo
.momo
mhamomo

- ==== nagano rira ====

ronako (nagano rira)

serako (nagano rira)

- ==== nagatoro ====

sakura (nagatoro)

yoshi (nagatoro)

- ==== narane ====

goat alter (narane)

- ==== naruto ====

choujuurou (naruto)

naruko (naruto)

tsunade (naruto)

- ==== nekopara ====

vanilla (nekopara)

- ==== neptunia ====

blanc (neptunia)

noire (neptunia)

rom (neptunia)

uni (neptunia)

white heart (neptunia)

- ==== nier ====

kaine (nier)

- ==== nier:automata ====

2b (nier:automata)
2b (nier automata)
2b (nier)
.2b
yorha 2b
2b

2p (nier:automata)
2p (nier automata)
2p (nier)
.2p
yorha 2p

9s (nier:automata)
9s (nier automata)
9s (nier)
.9s
yorha 9s

- ==== nijisanji ====

elu (nijisanji)
elu (7th costume) (nijisanji)

izumo kasumi (nijisanji)

moira (nijisanji)

- ==== nikke ====

alice (nikke)

anis (nikke)

blanc (nikke)

dolla (nikke)

elegg (nikke)

neon (nikke)

noir (nikke)

rapi (nikke)

rapunzel (nikke)

rupee (nikke)
rupee (rabbit deluxe) (nikke)

viper (nikke)
viper (toxic rabbit) (nikke)

volume (nikke)

yan (nikke)

- ==== ninja gaiden ====

rachel (ninja gaiden)

- ==== ninomae ina'nis ====

tako (ninomae ina'nis)

- ==== nintendo ====

mii (nintendo)

- ==== nisetanaqa ====

squire boy (nisetanaqa)

- ==== nun ====

houshou marine (nun)

- ==== oboro muramasa ====

okoi (oboro muramasa)

- ==== obstrepera ====

cecily (obstrepera)

- ==== odin sphere ====

elfaria (odin sphere)

mercedes (odin sphere)

velvet (odin sphere)

- ==== omori ====

basil (omori)
basil (faraway) (omori)

mari (omori)

sunny (omori)

- ==== one piece ====

boa hancock (one piece)
boa hancock
.onepieceboa
.boa
onepieceboa

carrot (one piece)
.onepiececarrot
.carrot
onepiececarrot

charlotte pudding (one piece)
charlotte pudding
onepiecepudding
.pudding

franky (one piece)

koala (one piece)
.onepiecekoala
.koala
onepiecekoala

monet (one piece)
.onepiecemonet
.monet
onepiecemonet

nami (one piece)
nami (little garden)
nami (one piece) (zou)
nami (one piece) (jaya)
.onepiecenami
nami (arlong park)
nami (dressrosa)
nami (enies lobby)
nami (orange town)
nami (pre-timeskip)
nami (thriller bark)
nami (strong world)
.nami
onepiecenami

nico robin (one piece)
nico robin
.onepiecerobin
nico robin (alabasta)
nico robin (strong world)
nico robin (onigashima)
.robin
robin (one piece)
robin
onepiecerobin

pedro (one piece)

perona (one piece)
.onepieceperona
.perona
onepieceperona

rebecca (one piece)
.onepiecerebecca
onepiecerebecca
.rebecca

shirahoshi (one piece)
shirahoshi
onepieceshirahoshi

tashigi (one piece)
tashigi
onepiecetashigi

ulti (one piece)
.onepieceulti
.ulti
onepieceulti

uta (one piece)
.onepieceuta
.uta
onepieceuta

vegapunk lilith (one piece)
vegapunk lilith
onepiecevegapunk
.vegapunk

vivi (one piece)
.onepiecevivi
.vivi
onepiecevivi

yamato (one piece)
.onepieceyamato
.yamato
onepieceyamato

- ==== one punch man ====

fubuki (one punch man)
fubuki

tatsumaki (one punch man)
.tatsumaki
tatsumaki

- ==== one-punch man ====

fubuki (one-punch man)

- ==== oppai magpie ====

smarls (oppai magpie)

- ==== overlord ====

albedo (overlord)

mare bello fiore (overlord)

- ==== overwatch ====

d.va (overwatch)
.dva
d.va
dva

mei (overwatch)
mei

mercy (overwatch)
mercy

sombra (overwatch)
sombra

tracer (overwatch)
.tracer
tracer

widowmaker (overwatch)
widowmaker

- ==== palworld ====

aegidron
aegidron (pal)
aegidron (palworld)

amione
amione (pal)
amione (palworld)

anubis
anubis (pal)
anubis (palworld)

arsox
arsox (pal)
arsox (palworld)

astegon
astegon (pal)
astegon (palworld)

astralym
astralym (pal)
astralym (palworld)

azurmane
azurmane (pal)
azurmane (palworld)

azurobe
azurobe (pal)
azurobe (palworld)

azurobe cryst
azurobe cryst (pal)
azurobe cryst (palworld)

bakemi
bakemi (pal)
bakemi (palworld)

bastigor
bastigor (pal)
bastigor (palworld)

beakon
beakon (pal)
beakon (palworld)

beakon cryst
beakon cryst (pal)
beakon cryst (palworld)

beegarde
beegarde (pal)
beegarde (palworld)

bellanoir
bellanoir (pal)
bellanoir (palworld)

bellanoir libero
bellanoir libero (pal)
bellanoir libero (palworld)

blazamut
blazamut (pal)
blazamut (palworld)

blazamut ryu
blazamut ryu (pal)
blazamut ryu (palworld)

blazehowl
blazehowl (pal)
blazehowl (palworld)

blazehowl noct
blazehowl noct (pal)
blazehowl noct (palworld)

boltmane
boltmane (pal)
boltmane (palworld)

braloha
braloha (pal)
braloha (palworld)

bristla
bristla (pal)
bristla (palworld)

broncherry
broncherry (pal)
broncherry (palworld)

broncherry aqua
broncherry aqua (pal)
broncherry aqua (palworld)

bulldosu
bulldosu (pal)
bulldosu (palworld)

bushi
bushi (pal)
bushi (palworld)

bushi noct
bushi noct (pal)
bushi noct (palworld)

caprity
caprity (pal)
caprity (palworld)

caprity noct
caprity noct (pal)
caprity noct (palworld)

carnibora
carnibora (pal)
carnibora (palworld)

cattiva
cattiva (pal)
cattiva (palworld)

cawgnito
cawgnito (pal)
cawgnito (palworld)

celaray
celaray (pal)
celaray (palworld)

celaray lux
celaray lux (pal)
celaray lux (palworld)

celesdir
celesdir (pal)
celesdir (palworld)

celesdir noct
celesdir noct (pal)
celesdir noct (palworld)

chikipi
chikipi (pal)
chikipi (palworld)

chillet
chillet (pal)
chillet (palworld)

chillet ignis
chillet ignis (pal)
chillet ignis (palworld)

cinnamoth
cinnamoth (pal)
cinnamoth (palworld)

clovee
clovee (pal)
clovee (palworld)

cremis
cremis (pal)
cremis (palworld)

croajiro
croajiro (pal)
croajiro (palworld)

croajiro noct
croajiro noct (pal)
croajiro noct (palworld)

cryolinx
cryolinx (pal)
cryolinx (palworld)

cryolinx terra
cryolinx terra (pal)
cryolinx terra (palworld)

cyan wolf cub
cyan wolf cub (pal)
cyan wolf cub (palworld)

daedream
daedream (pal)
daedream (palworld)

dandilord
dandilord (pal)
dandilord (palworld)

dark mutant
dark mutant (pal)
dark mutant (palworld)

dazemu
dazemu (pal)
dazemu (palworld)

dazzi
dazzi (pal)
dazzi (palworld)

dazzi noct
dazzi noct (pal)
dazzi noct (palworld)

depresso
depresso (pal)
depresso (palworld)

digtoise
digtoise (pal)
digtoise (palworld)

dinossom
dinossom (pal)
dinossom (palworld)

dinossom lux
dinossom lux (pal)
dinossom lux (palworld)

direhowl
direhowl (pal)
direhowl (palworld)

dogen
dogen (pal)
dogen (palworld)

dragostrophe
dragostrophe (pal)
dragostrophe (palworld)

dualith
dualith (pal)
dualith (palworld)

dualith noct
dualith noct (pal)
dualith noct (palworld)

dumud
dumud (pal)
dumud (palworld)

dumud gild
dumud gild (pal)
dumud gild (palworld)

dupin
dupin (pal)
dupin (palworld)

dynamoff
dynamoff (pal)
dynamoff (palworld)

eidrolon
eidrolon (pal)
eidrolon (palworld)

eidrolon ignis
eidrolon ignis (pal)
eidrolon ignis (palworld)

eikthyrdeer
eikthyrdeer (pal)
eikthyrdeer (palworld)

eikthyrdeer terra
eikthyrdeer terra (pal)
eikthyrdeer terra (palworld)

elgrove
elgrove (pal)
elgrove (palworld)

elgrove cryst
elgrove cryst (pal)
elgrove cryst (palworld)

elizabee
elizabee (pal)
elizabee (palworld)

elphidran
elphidran (pal)
elphidran (palworld)

elphidran aqua
elphidran aqua (pal)
elphidran aqua (palworld)

faleris
faleris (pal)
faleris (palworld)

faleris aqua
faleris aqua (pal)
faleris aqua (palworld)

feathered dragon
feathered dragon (pal)
feathered dragon (palworld)

felbat
felbat (pal)
felbat (palworld)

fenglope
fenglope (pal)
fenglope (palworld)

fenglope lux
fenglope lux (pal)
fenglope lux (palworld)

finsider
finsider (pal)
finsider (palworld)

finsider ignis
finsider ignis (pal)
finsider ignis (palworld)

flambelle
flambelle (pal)
flambelle (palworld)

flaracle
flaracle (pal)
flaracle (palworld)

flopie
flopie (pal)
flopie (palworld)

foxcicle
foxcicle (pal)
foxcicle (palworld)

foxparks
foxparks (pal)
foxparks (palworld)

foxparks cryst
foxparks cryst (pal)
foxparks cryst (palworld)

frostallion
frostallion (pal)
frostallion (palworld)

frostallion noct
frostallion noct (pal)
frostallion noct (palworld)

frostplume
frostplume (pal)
frostplume (palworld)

fuack
fuack (pal)
fuack (palworld)

fuack ignis
fuack ignis (pal)
fuack ignis (palworld)

fuddler
fuddler (pal)
fuddler (palworld)

galeclaw
galeclaw (pal)
galeclaw (palworld)

ghangler
ghangler (pal)
ghangler (palworld)

ghangler ignis
ghangler ignis (pal)
ghangler ignis (palworld)

gildane
gildane (pal)
gildane (palworld)

gildra
gildra (pal)
gildra (palworld)

gloopie
gloopie (pal)
gloopie (palworld)

gloopie primo
gloopie primo (pal)
gloopie primo (palworld)

gobfin
gobfin (pal)
gobfin (palworld)

gobfin ignis
gobfin ignis (pal)
gobfin ignis (palworld)

gorirat
gorirat (pal)
gorirat (palworld)

gorirat terra
gorirat terra (pal)
gorirat terra (palworld)

green slime
green slime (pal)
green slime (palworld)

grintale
grintale (pal)
grintale (palworld)

grizzbolt
grizzbolt (pal)
grizzbolt (palworld)

gumoss
gumoss (pal)
gumoss (palworld)

hangyu
hangyu (pal)
hangyu (palworld)

hangyu cryst
hangyu cryst (pal)
hangyu cryst (palworld)

hartalis
hartalis (pal)
hartalis (palworld)

helzephyr
helzephyr (pal)
helzephyr (palworld)

helzephyr lux
helzephyr lux (pal)
helzephyr lux (palworld)

herbil
herbil (pal)
herbil (palworld)

hoocrates
hoocrates (pal)
hoocrates (palworld)

hoodle
hoodle (pal)
hoodle (palworld)

icelyn
icelyn (pal)
icelyn (palworld)

incineram
incineram (pal)
incineram (palworld)

incineram noct
incineram noct (pal)
incineram noct (palworld)

jelliette
jelliette (pal)
jelliette (palworld)

jellroy
jellroy (pal)
jellroy (palworld)

jetragon
jetragon (pal)
jetragon (palworld)

jolthog
jolthog (pal)
jolthog (palworld)

jolthog cryst
jolthog cryst (pal)
jolthog cryst (palworld)

jormuntide
jormuntide (pal)
jormuntide (palworld)

jormuntide ignis
jormuntide ignis (pal)
jormuntide ignis (palworld)

katress
katress (pal)
katress (palworld)

katress ignis
katress ignis (pal)
katress ignis (palworld)

kelpsea
kelpsea (pal)
kelpsea (palworld)

kelpsea ignis
kelpsea ignis (pal)
kelpsea ignis (palworld)

kikit
kikit (pal)
kikit (palworld)

killamari
killamari (pal)
killamari (palworld)

killamari primo
killamari primo (pal)
killamari primo (palworld)

kingpaca
kingpaca (pal)
kingpaca (palworld)

kingpaca cryst
kingpaca cryst (pal)
kingpaca cryst (palworld)

kitsun
kitsun (pal)
kitsun (palworld)

kitsun noct
kitsun noct (pal)
kitsun noct (palworld)

knocklem
knocklem (pal)
knocklem (palworld)

knocklem ignis
knocklem ignis (pal)
knocklem ignis (palworld)

lamball
lamball (pal)
lamball (palworld)

lapiron
lapiron (pal)
lapiron (palworld)

lapure
lapure (pal)
lapure (palworld)

leafan
leafan (pal)
leafan (palworld)

leezpunk
leezpunk (pal)
leezpunk (palworld)

leezpunk ignis
leezpunk ignis (pal)
leezpunk ignis (palworld)

lifmunk
lifmunk (pal)
lifmunk (palworld)

loomen
loomen (pal)
loomen (palworld)

loupmoon
loupmoon (pal)
loupmoon (palworld)

loupmoon cryst
loupmoon cryst (pal)
loupmoon cryst (palworld)

lovander
lovander (pal)
lovander (palworld)

lullu
lullu (pal)
lullu (palworld)

lunaris
lunaris (pal)
lunaris (palworld)

lyleen
lyleen (pal)
lyleen (palworld)

lyleen noct
lyleen noct (pal)
lyleen noct (palworld)

majex
majex (pal)
majex (palworld)

mammorest
mammorest (pal)
mammorest (palworld)

mammorest cryst
mammorest cryst (pal)
mammorest cryst (palworld)

maraith
maraith (pal)
maraith (palworld)

mau
mau (pal)
mau (palworld)

mau cryst
mau cryst (pal)
mau cryst (palworld)

melpaca
melpaca (pal)
melpaca (palworld)

menasting
menasting (pal)
menasting (palworld)

menasting terra
menasting terra (pal)
menasting terra (palworld)

mimog
mimog (pal)
mimog (palworld)

moldron
moldron (pal)
moldron (palworld)

moldron cryst
moldron cryst (pal)
moldron cryst (palworld)

mossanda
mossanda (pal)
mossanda (palworld)

mossanda lux
mossanda lux (pal)
mossanda lux (palworld)

mozzarina
mozzarina (pal)
mozzarina (palworld)

muffly
muffly (pal)
muffly (palworld)

munchill
munchill (pal)
munchill (palworld)

mycora
mycora (pal)
mycora (palworld)

necromus
necromus (pal)
necromus (palworld)

needoll
needoll (pal)
needoll (palworld)

needoll noct
needoll noct (pal)
needoll noct (palworld)

neptilius
neptilius (pal)
neptilius (palworld)

nitemary
nitemary (pal)
nitemary (palworld)

nitemary botan
nitemary botan (pal)
nitemary botan (palworld)

nitewing
nitewing (pal)
nitewing (palworld)

nox
nox (pal)
nox (palworld)

nyafia
nyafia (pal)
nyafia (palworld)

omascul
omascul (pal)
omascul (palworld)

ophydia
ophydia (pal)
ophydia (palworld)

orserk
orserk (pal)
orserk (palworld)

paladius
paladius (pal)
paladius (palworld)

palumba
palumba (pal)
palumba (palworld)

panthalus
panthalus (pal)
panthalus (palworld)

pengullet
pengullet (pal)
pengullet (palworld)

pengullet lux
pengullet lux (pal)
pengullet lux (palworld)

penking
penking (pal)
penking (palworld)

penking lux
penking lux (pal)
penking lux (palworld)

petallia
petallia (pal)
petallia (palworld)

petallia ignis
petallia ignis (pal)
petallia ignis (palworld)

pierdon
pierdon (pal)
pierdon (palworld)

pierdon cryst
pierdon cryst (pal)
pierdon cryst (palworld)

polapup
polapup (pal)
polapup (palworld)

polapup terra
polapup terra (pal)
polapup terra (palworld)

prixter
prixter (pal)
prixter (palworld)

prixter lux
prixter lux (pal)
prixter lux (palworld)

prunelia
prunelia (pal)
prunelia (palworld)

puffolt
puffolt (pal)
puffolt (palworld)

pupperai
pupperai (pal)
pupperai (palworld)

pyrin
pyrin (pal)
pyrin (palworld)

pyrin noct
pyrin noct (pal)
pyrin noct (palworld)

quivern
quivern (pal)
quivern (palworld)

quivern botan
quivern botan (pal)
quivern botan (palworld)

ragnahawk
ragnahawk (pal)
ragnahawk (palworld)

rayhound
rayhound (pal)
rayhound (palworld)

rayhound cryst
rayhound cryst (pal)
rayhound cryst (palworld)

reindrix
reindrix (pal)
reindrix (palworld)

relaxaurus
relaxaurus (pal)
relaxaurus (palworld)

relaxaurus lux
relaxaurus lux (pal)
relaxaurus lux (palworld)

renjishi
renjishi (pal)
renjishi (palworld)

reptyro
reptyro (pal)
reptyro (palworld)

reptyro cryst
reptyro cryst (pal)
reptyro cryst (palworld)

ribbuny
ribbuny (pal)
ribbuny (palworld)

ribbuny botan
ribbuny botan (pal)
ribbuny botan (palworld)

robinquill
robinquill (pal)
robinquill (palworld)

robinquill terra
robinquill terra (pal)
robinquill terra (palworld)

rooby
rooby (pal)
rooby (palworld)

roujay
roujay (pal)
roujay (palworld)

rushoar
rushoar (pal)
rushoar (palworld)

sekhmet
sekhmet (pal)
sekhmet (palworld)

selyne
selyne (pal)
selyne (palworld)

shadowbeak
shadowbeak (pal)
shadowbeak (palworld)

shaolong
shaolong (pal)
shaolong (palworld)

shroomer
shroomer (pal)
shroomer (palworld)

shroomer noct
shroomer noct (pal)
shroomer noct (palworld)

sibelyx
sibelyx (pal)
sibelyx (palworld)

sibelyx primo
sibelyx primo (pal)
sibelyx primo (palworld)

silvance
silvance (pal)
silvance (palworld)

silvegis
silvegis (pal)
silvegis (palworld)

skutlass
skutlass (pal)
skutlass (palworld)

skutlass ignis
skutlass ignis (pal)
skutlass ignis (palworld)

slowatt
slowatt (pal)
slowatt (palworld)

smokie
smokie (pal)
smokie (palworld)

smokie cryst
smokie cryst (pal)
smokie cryst (palworld)

snock
snock (pal)
snock (palworld)

snock lux
snock lux (pal)
snock lux (palworld)

snugloo
snugloo (pal)
snugloo (palworld)

solenne
solenne (pal)
solenne (palworld)

solmora
solmora (pal)
solmora (palworld)

solmora lux
solmora lux (pal)
solmora lux (palworld)

sootseer
sootseer (pal)
sootseer (palworld)

souffline
souffline (pal)
souffline (palworld)

sparkit
sparkit (pal)
sparkit (palworld)

splatterina
splatterina (pal)
splatterina (palworld)

starryon
starryon (pal)
starryon (palworld)

starryon primo
starryon primo (pal)
starryon primo (palworld)

surfent
surfent (pal)
surfent (palworld)

surfent terra
surfent terra (pal)
surfent terra (palworld)

suzaku
suzaku (pal)
suzaku (palworld)

suzaku aqua
suzaku aqua (pal)
suzaku aqua (palworld)

swee
swee (pal)
swee (palworld)

sweepa
sweepa (pal)
sweepa (palworld)

tanzee
tanzee (pal)
tanzee (palworld)

tanzee ignis
tanzee ignis (pal)
tanzee ignis (palworld)

tarantriss
tarantriss (pal)
tarantriss (palworld)

teafant
teafant (pal)
teafant (palworld)

tetroise
tetroise (pal)
tetroise (palworld)

tetroise primo
tetroise primo (pal)
tetroise primo (palworld)

tocotoco
tocotoco (pal)
tocotoco (palworld)

tombat
tombat (pal)
tombat (palworld)

tropicaw
tropicaw (pal)
tropicaw (palworld)

turtacle
turtacle (pal)
turtacle (palworld)

turtacle terra
turtacle terra (pal)
turtacle terra (palworld)

univolt
univolt (pal)
univolt (palworld)

univolt cryst
univolt cryst (pal)
univolt cryst (palworld)

vaelet
vaelet (pal)
vaelet (palworld)

valentail
valentail (pal)
valentail (palworld)

vanwyrm
vanwyrm (pal)
vanwyrm (palworld)

vanwyrm cryst
vanwyrm cryst (pal)
vanwyrm cryst (palworld)

venusa
venusa (pal)
venusa (palworld)

verdash
verdash (pal)
verdash (palworld)

vixy
vixy (pal)
vixy (palworld)

warsect
warsect (pal)
warsect (palworld)

warsect terra
warsect terra (pal)
warsect terra (palworld)

whalaska
whalaska (pal)
whalaska (palworld)

whalaska ignis
whalaska ignis (pal)
whalaska ignis (palworld)

wispaw
wispaw (pal)
wispaw (palworld)

wistella
wistella (pal)
wistella (palworld)

wixen
wixen (pal)
wixen (palworld)

wixen noct
wixen noct (pal)
wixen noct (palworld)

woolipop
woolipop (pal)
woolipop (palworld)

woolipop terra
woolipop terra (pal)
woolipop terra (palworld)

wumpo
wumpo (pal)
wumpo (palworld)

wumpo botan
wumpo botan (pal)
wumpo botan (palworld)

xenogard
xenogard (pal)
xenogard (palworld)

xenolord
xenolord (pal)
xenolord (palworld)

xenovader
xenovader (pal)
xenovader (palworld)

yakumo
yakumo (pal)
yakumo (palworld)

- ==== persona 5 ====

lavenza (persona 5)

- ==== pig ====

sus (pig)

- ==== pokemon ====

abomasnow
abomasnow (pokemon)

abra
abra (pokemon)

absol
absol (pokemon)

accelgor
accelgor (pokemon)

acerola (pokemon)

aegislash
aegislash (pokemon)

aerodactyl
aerodactyl (pokemon)

aether foundation employee
aether foundation employee (pokemon)
aether foundation employee (female)
aether foundation employee (male)
pokeaether
.aether

aggron
aggron (pokemon)

aipom
aipom (pokemon)

akari (pokemon)

alakazam
alakazam (pokemon)

alcremie
alcremie (pokemon)

allister (pokemon)

alomomola
alomomola (pokemon)

altaria
altaria (pokemon)

amaura
amaura (pokemon)

ambipom
ambipom (pokemon)

amoonguss
amoonguss (pokemon)

ampharos
ampharos (pokemon)
dashing wanderer ampharos

annihilape
annihilape (pokemon)

anorith
anorith (pokemon)

appletun
appletun (pokemon)

applin
applin (pokemon)

araquanid
araquanid (pokemon)

arbok
arbok (pokemon)

arboliva
arboliva (pokemon)

arcanine
arcanine (pokemon)

arceus
arceus (pokemon)

archaludon
archaludon (pokemon)

archen
archen (pokemon)

archeops
archeops (pokemon)

arctibax
arctibax (pokemon)

arctovish
arctovish (pokemon)

arctozolt
arctozolt (pokemon)

arezu (pokemon)

ariados
ariados (pokemon)

armaldo
armaldo (pokemon)

armarouge
armarouge (pokemon)

aromatisse
aromatisse (pokemon)

aron
aron (pokemon)

arrokuda
arrokuda (pokemon)

articuno
articuno (pokemon)

arven (pokemon)

audino
audino (pokemon)
mega audino

aurorus
aurorus (pokemon)

avalugg
avalugg (pokemon)

axew
axew (pokemon)

azelf
azelf (pokemon)

azumarill
azumarill (pokemon)

azurill
azurill (pokemon)

bagon
bagon (pokemon)

baltoy
baltoy (pokemon)

banette
banette (pokemon)
mega banette

barbaracle
barbaracle (pokemon)

barboach
barboach (pokemon)

barraskewda
barraskewda (pokemon)

basculegion
basculegion (pokemon)

basculin
basculin (pokemon)

bastiodon
bastiodon (pokemon)

baxcalibur
baxcalibur (pokemon)

bayleef
bayleef (pokemon)

bea (pokemon)

beartic
beartic (pokemon)

beautifly
beautifly (pokemon)

beedrill
beedrill (pokemon)

beheeyem
beheeyem (pokemon)

beldum
beldum (pokemon)

bellibolt
bellibolt (pokemon)

bellossom
bellossom (pokemon)

bellsprout
bellsprout (pokemon)

bergmite
bergmite (pokemon)

bewear
bewear (pokemon)

bibarel
bibarel (pokemon)

bidoof
bidoof (pokemon)

binacle
binacle (pokemon)

bisharp
bisharp (pokemon)

blacephalon
blacephalon (pokemon)

blastoise
blastoise (pokemon)

blaziken
blaziken (pokemon)

blipbug
blipbug (pokemon)

blissey
blissey (pokemon)

blitzle
blitzle (pokemon)

boldore
boldore (pokemon)

boltund
boltund (pokemon)

bombirdier
bombirdier (pokemon)

bonsly
bonsly (pokemon)

botan (pokemon)

bouffalant
bouffalant (pokemon)

bounsweet
bounsweet (pokemon)

braixen
braixen (pokemon)

brambleghast
brambleghast (pokemon)

bramblin
bramblin (pokemon)

braviary
braviary (pokemon)

breloom
breloom (pokemon)

brionne
brionne (pokemon)

bronzong
bronzong (pokemon)

bronzor
bronzor (pokemon)

brute bonnet
brute bonnet (pokemon)

bruxish
bruxish (pokemon)

budew
budew (pokemon)

bugsy (pokemon)

buizel
buizel (pokemon)
marine explorer buizel

bulbasaur
bulbasaur (pokemon)

buneary
buneary (pokemon)

bunnelby
bunnelby (pokemon)

burmy
burmy (pokemon)

butterfree
butterfree (pokemon)

buzzwole
buzzwole (pokemon)

cacnea
cacnea (pokemon)

cacturne
cacturne (pokemon)

calem (pokemon)

calyrex
calyrex (pokemon)

camerupt
camerupt (pokemon)

capsakid
capsakid (pokemon)

carbink
carbink (pokemon)

carkol
carkol (pokemon)

carmine (pokemon)

carnivine
carnivine (pokemon)

carracosta
carracosta (pokemon)

carvanha
carvanha (pokemon)

cascoon
cascoon (pokemon)

castform
castform (pokemon)

caterpie
caterpie (pokemon)

celebi
celebi (pokemon)

celesteela
celesteela (pokemon)

centiskorch
centiskorch (pokemon)

ceruledge
ceruledge (pokemon)

cetitan
cetitan (pokemon)

cetoddle
cetoddle (pokemon)

chandelure
chandelure (pokemon)

chansey
chansey (pokemon)

charcadet
charcadet (pokemon)

charizard
charizard (pokemon)

charjabug
charjabug (pokemon)

charmander
charmander (pokemon)

charmeleon
charmeleon (pokemon)

chatot
chatot (pokemon)

cherrim
cherrim (pokemon)

cherubi
cherubi (pokemon)

chesnaught
chesnaught (pokemon)

chespin
chespin (pokemon)

chewtle
chewtle (pokemon)

chi yu
chi yu (pokemon)

chien pao
chien pao (pokemon)

chikorita
chikorita (pokemon)

chimchar
chimchar (pokemon)

chimecho
chimecho (pokemon)

chinchou
chinchou (pokemon)

chingling
chingling (pokemon)

cinccino
cinccino (pokemon)

cinderace
cinderace (pokemon)
gigantamax cinderace

clamperl
clamperl (pokemon)

clauncher
clauncher (pokemon)

clavell (pokemon)

clawitzer
clawitzer (pokemon)

claydol
claydol (pokemon)

clefable
clefable (pokemon)

clefairy
clefairy (pokemon)

cleffa
cleffa (pokemon)

clobbopus
clobbopus (pokemon)

clodsire
clodsire (pokemon)

cloyster
cloyster (pokemon)

coalossal
coalossal (pokemon)

cobalion
cobalion (pokemon)

cofagrigus
cofagrigus (pokemon)

combee
combee (pokemon)

combusken
combusken (pokemon)

comfey
comfey (pokemon)

conkeldurr
conkeldurr (pokemon)

copperajah
copperajah (pokemon)

corphish
corphish (pokemon)

corsola
corsola (pokemon)

corviknight
corviknight (pokemon)

corvisquire
corvisquire (pokemon)

cosmoem
cosmoem (pokemon)

cosmog
cosmog (pokemon)

cottonee
cottonee (pokemon)

crabominable
crabominable (pokemon)

crabrawler
crabrawler (pokemon)

cradily
cradily (pokemon)

cramorant
cramorant (pokemon)

cranidos
cranidos (pokemon)

crawdaunt
crawdaunt (pokemon)

cresselia
cresselia (pokemon)

croagunk
croagunk (pokemon)

crobat
crobat (pokemon)

crocalor
crocalor (pokemon)

croconaw
croconaw (pokemon)

crustle
crustle (pokemon)

cryogonal
cryogonal (pokemon)

cubchoo
cubchoo (pokemon)

cubone
cubone (pokemon)

cufant
cufant (pokemon)

cursola
cursola (pokemon)

cutiefly
cutiefly (pokemon)

cyclizar
cyclizar (pokemon)

cyndaquil
cyndaquil (pokemon)

cynthia (pokemon)
.pokecynthia
.cynthia
pokecynthia

dachsbun
dachsbun (pokemon)

darkrai
darkrai (pokemon)

darmanitan
darmanitan (pokemon)

dartrix
dartrix (pokemon)

darumaka
darumaka (pokemon)

dawn (pokemon)

decidueye
decidueye (pokemon)

dedenne
dedenne (pokemon)

deerling
deerling (pokemon)

deino
deino (pokemon)

delcatty
delcatty (pokemon)

delibird
delibird (pokemon)

delphox
delphox (pokemon)

deoxys
deoxys (pokemon)

dewgong
dewgong (pokemon)

dewott
dewott (pokemon)

dewpider
dewpider (pokemon)

dhelmise
dhelmise (pokemon)

dialga
dialga (pokemon)

diancie
diancie (pokemon)

diggersby
diggersby (pokemon)

diglett
diglett (pokemon)

dipplin
dipplin (pokemon)

ditto
ditto (pokemon)

dodrio
dodrio (pokemon)

doduo
doduo (pokemon)

dolliv
dolliv (pokemon)

dondozo
dondozo (pokemon)

donphan
donphan (pokemon)

dottler
dottler (pokemon)

doublade
doublade (pokemon)

dracovish
dracovish (pokemon)

dracozolt
dracozolt (pokemon)

dragalge
dragalge (pokemon)

dragapult
dragapult (pokemon)

dragonair
dragonair (pokemon)

dragonite
dragonite (pokemon)

drakloak
drakloak (pokemon)

drampa
drampa (pokemon)

drapion
drapion (pokemon)

dratini
dratini (pokemon)

drednaw
drednaw (pokemon)

dreepy
dreepy (pokemon)

drifblim
drifblim (pokemon)

drifloon
drifloon (pokemon)

drilbur
drilbur (pokemon)

drizzile
drizzile (pokemon)

drowzee
drowzee (pokemon)

druddigon
druddigon (pokemon)

dubwool
dubwool (pokemon)

ducklett
ducklett (pokemon)

dudunsparce
dudunsparce (pokemon)

dugtrio
dugtrio (pokemon)

dunsparce
dunsparce (pokemon)

duosion
duosion (pokemon)

duraludon
duraludon (pokemon)

durant
durant (pokemon)

dusclops
dusclops (pokemon)

dusknoir
dusknoir (pokemon)

duskull
duskull (pokemon)

dustox
dustox (pokemon)

dwebble
dwebble (pokemon)

eelektrik
eelektrik (pokemon)

eelektross
eelektross (pokemon)

eevee
eevee (pokemon)

eiscue
eiscue (pokemon)

ekans
ekans (pokemon)

elaine (pokemon)

eldegoss
eldegoss (pokemon)

electabuzz
electabuzz (pokemon)

electivire
electivire (pokemon)

electrike
electrike (pokemon)

electrode
electrode (pokemon)

elekid
elekid (pokemon)

elgyem
elgyem (pokemon)

elio (pokemon)
.pokeelio
.elio
pokeelio

emboar
emboar (pokemon)

emolga
emolga (pokemon)

empoleon
empoleon (pokemon)

enamorus
enamorus (pokemon)

entei
entei (pokemon)

escavalier
escavalier (pokemon)

espathra
espathra (pokemon)

espeon
espeon (pokemon)

espurr
espurr (pokemon)

eternatus
eternatus (pokemon)

excadrill
excadrill (pokemon)

exeggcute
exeggcute (pokemon)

exeggutor
exeggutor (pokemon)

exploud
exploud (pokemon)

fairy tale girl (pokemon)

falinks
falinks (pokemon)

farfetchd
farfetchd (pokemon)

farigiraf
farigiraf (pokemon)

fearow
fearow (pokemon)

feebas
feebas (pokemon)

fennekin
fennekin (pokemon)

feraligatr
feraligatr (pokemon)

ferroseed
ferroseed (pokemon)

ferrothorn
ferrothorn (pokemon)

fezandipiti
fezandipiti (pokemon)

fidough
fidough (pokemon)

finizen
finizen (pokemon)

finneon
finneon (pokemon)

flaaffy
flaaffy (pokemon)

flabebe
flabebe (pokemon)

flamigo
flamigo (pokemon)

flapple
flapple (pokemon)

flareon
flareon (pokemon)

fletchinder
fletchinder (pokemon)

fletchling
fletchling (pokemon)

flittle
flittle (pokemon)

floatzel
floatzel (pokemon)

floette
floette (pokemon)

floragato
floragato (pokemon)

florges
florges (pokemon)

florian (pokemon)

flutter mane
flutter mane (pokemon)

flygon
flygon (pokemon)

fomantis
fomantis (pokemon)

foongus
foongus (pokemon)

forretress
forretress (pokemon)

fraxure
fraxure (pokemon)

frigibax
frigibax (pokemon)

frillish
frillish (pokemon)

froakie
froakie (pokemon)

frogadier
frogadier (pokemon)

froslass
froslass (pokemon)

frosmoth
frosmoth (pokemon)

fuecoco
fuecoco (pokemon)

furfrou
furfrou (pokemon)

furret
furret (pokemon)

gabite
gabite (pokemon)

gallade
gallade (pokemon)

galvantula
galvantula (pokemon)

garbodor
garbodor (pokemon)

garchomp
garchomp (pokemon)

gardevoir
gardevoir (pokemon)
pokemongardevoir

shiny gardevoir
pokemongardevoirshiny
.gardevoirshiny

garganacl
garganacl (pokemon)

gastly
gastly (pokemon)

gastrodon
gastrodon (pokemon)
gastrodon (west)

genesect
genesect (pokemon)

gengar
gengar (pokemon)

geodude
geodude (pokemon)

gholdengo
gholdengo (pokemon)

gible
gible (pokemon)

gigalith
gigalith (pokemon)

gimmighoul
gimmighoul (pokemon)

girafarig
girafarig (pokemon)

giratina
giratina (pokemon)

glaceon
glaceon (pokemon)

gladion (pokemon)
.pokegladion
.gladion
pokegladion

glalie
glalie (pokemon)

glameow
glameow (pokemon)

glastrier
glastrier (pokemon)

gligar
gligar (pokemon)

glimmet
glimmet (pokemon)

glimmora
glimmora (pokemon)

gliscor
gliscor (pokemon)

gloom
gloom (pokemon)

gloria (pokemon)

gogoat
gogoat (pokemon)

goh (pokemon)

golbat
golbat (pokemon)

goldeen
goldeen (pokemon)

golduck
golduck (pokemon)

golem
golem (pokemon)
mysticgolem

golett
golett (pokemon)

golisopod
golisopod (pokemon)

golurk
golurk (pokemon)

goodra
goodra (pokemon)

goomy
goomy (pokemon)

gorebyss
gorebyss (pokemon)

gossifleur
gossifleur (pokemon)

gothita
gothita (pokemon)

gothitelle
gothitelle (pokemon)

gothorita
gothorita (pokemon)

gouging fire
gouging fire (pokemon)

gourgeist
gourgeist (pokemon)

grafaiai
grafaiai (pokemon)

granbull
granbull (pokemon)

grapploct
grapploct (pokemon)

graveler
graveler (pokemon)

great tusk
great tusk (pokemon)

greavard
greavard (pokemon)

greedent
greedent (pokemon)

greninja
greninja (pokemon)

grimer
grimer (pokemon)

grimmsnarl
grimmsnarl (pokemon)

grookey
grookey (pokemon)

grotle
grotle (pokemon)

groudon
groudon (pokemon)

grovyle
grovyle (pokemon)

growlithe
growlithe (pokemon)

grubbin
grubbin (pokemon)

grumpig
grumpig (pokemon)

grusha (pokemon)

gulpin
gulpin (pokemon)

gumshoos
gumshoos (pokemon)

gurdurr
gurdurr (pokemon)

guzzlord
guzzlord (pokemon)

gyarados
gyarados (pokemon)

hakamo o
hakamo o (pokemon)

happiny
happiny (pokemon)

hariyama
hariyama (pokemon)

harper (pokemon)
.pokeharper
.harper
pokeharper

haruka (pokemon)

hatenna
hatenna (pokemon)

hatterene
hatterene (pokemon)

hattrem
hattrem (pokemon)

haunter
haunter (pokemon)

hawlucha
hawlucha (pokemon)

haxorus
haxorus (pokemon)

heatmor
heatmor (pokemon)

heatran
heatran (pokemon)

heliolisk
heliolisk (pokemon)

helioptile
helioptile (pokemon)

heracross
heracross (pokemon)

herdier
herdier (pokemon)

hex maniac (pokemon)
hex maniac

hikari (pokemon)

hilbert (pokemon)
.pokehilbert
.hilbert
pokehilbert

hilda (pokemon)
.pokehilda
.hilda
pokehilda

hippopotas
hippopotas (pokemon)

hippowdon
hippowdon (pokemon)

hitmonchan
hitmonchan (pokemon)

hitmonlee
hitmonlee (pokemon)

hitmontop
hitmontop (pokemon)

ho oh
ho oh (pokemon)

honchkrow
honchkrow (pokemon)

honedge
honedge (pokemon)

hoopa
hoopa (pokemon)
hoopa (confined)

hoopa unbound
hoopa unbound (pokemon)
hoopa (unbound)
hoopa (unbound) (pokemon)

hoothoot
hoothoot (pokemon)

hoppip
hoppip (pokemon)

horsea
horsea (pokemon)

hoshi (pokemon)

hou (pokemon)

houndoom
houndoom (pokemon)
pokehoundoom

houndour
houndour (pokemon)

houndstone
houndstone (pokemon)

huntail
huntail (pokemon)

hydrapple
hydrapple (pokemon)

hydreigon
hydreigon (pokemon)

hypno
hypno (pokemon)

igglybuff
igglybuff (pokemon)

illumise
illumise (pokemon)

impidimp
impidimp (pokemon)

incineroar
incineroar (pokemon)

indeedee
indeedee (pokemon)

infernape
infernape (pokemon)

inkay
inkay (pokemon)

inteleon
inteleon (pokemon)

iono (pokemon)

irida (pokemon)

iris (pokemon)

iron boulder
iron boulder (pokemon)

iron bundle
iron bundle (pokemon)

iron crown
iron crown (pokemon)

iron hands
iron hands (pokemon)

iron jugulis
iron jugulis (pokemon)

iron leaves
iron leaves (pokemon)

iron moth
iron moth (pokemon)

iron thorns
iron thorns (pokemon)

iron treads
iron treads (pokemon)

iron valiant
iron valiant (pokemon)

ivysaur
ivysaur (pokemon)

jacinthe (pokemon)
.pokejacinthe
jacinthe
pokejacinthe

jangmo o
jangmo o (pokemon)

jasmine (pokemon)

jellicent
jellicent (pokemon)

jessie (pokemon)

jigglypuff
jigglypuff (pokemon)

jirachi
jirachi (pokemon)

jolteon
jolteon (pokemon)

joltik
joltik (pokemon)

nurse joy
nurse joy (pokemon)
joy (pokemon)

juliana (pokemon)

jumpluff
jumpluff (pokemon)

jynx
jynx (pokemon)

kabuto
kabuto (pokemon)

kabutops
kabutops (pokemon)

kadabra
kadabra (pokemon)

kakuna
kakuna (pokemon)

kangaskhan
kangaskhan (pokemon)
baby kangaskhan

karrablast
karrablast (pokemon)

kartana
kartana (pokemon)

kasumi (pokemon)

katy (pokemon)

kecleon
kecleon (pokemon)

keldeo
keldeo (pokemon)

kieran (pokemon)

kilowattrel
kilowattrel (pokemon)

kingambit
kingambit (pokemon)

kingdra
kingdra (pokemon)

kingler
kingler (pokemon)

kirlia
kirlia (pokemon)
male kirlia
pokemonkirlia

klang
klang (pokemon)

klawf
klawf (pokemon)

kleavor
kleavor (pokemon)

klefki
klefki (pokemon)

klink
klink (pokemon)

klinklang
klinklang (pokemon)

koffing
koffing (pokemon)

komala
komala (pokemon)

kommo o
kommo o (pokemon)

koraidon
koraidon (pokemon)

krabby
krabby (pokemon)

kricketot
kricketot (pokemon)

kricketune
kricketune (pokemon)

krokorok
krokorok (pokemon)

krookodile
krookodile (pokemon)

kubfu
kubfu (pokemon)

kyogre
kyogre (pokemon)

kyurem
kyurem (pokemon)

lairon
lairon (pokemon)

lampent
lampent (pokemon)

lana (pokemon)
.pokelana
.lana
pokelana

lana's father (pokemon)

lana's mom (pokemon)
.pokelanamom
.lanamom
pokelanamom

lana's mother (pokemon)
lana's mother
lana's mom (pokemon)
lana's mom

landorus
landorus (pokemon)

lanturn
lanturn (pokemon)

lapras
lapras (pokemon)

larvesta
larvesta (pokemon)

larvitar
larvitar (pokemon)

latias
latias (pokemon)

latios
latios (pokemon)

leafeon
leafeon (pokemon)

leavanny
leavanny (pokemon)

lechonk
lechonk (pokemon)

ledian
ledian (pokemon)

ledyba
ledyba (pokemon)

lickilicky
lickilicky (pokemon)

lickitung
lickitung (pokemon)

liepard
liepard (pokemon)

lileep
lileep (pokemon)

lillie (pokemon)
.pokelillie
.lillie
pokelillie

lilligant
lilligant (pokemon)

lillipup
lillipup (pokemon)

linoone
linoone (pokemon)

litleo
litleo (pokemon)

litten
litten (pokemon)

litwick
litwick (pokemon)

lokix
lokix (pokemon)

lombre
lombre (pokemon)

lopunny
lopunny (pokemon)
pokemonlopunny

lotad
lotad (pokemon)

loudred
loudred (pokemon)

lucario
lucario (pokemon)

lucas (pokemon)

ludicolo
ludicolo (pokemon)

lugia
lugia (pokemon)
shadow lugia

lumineon
lumineon (pokemon)

lunala
lunala (pokemon)

lunatone
lunatone (pokemon)

lurantis
lurantis (pokemon)

lusamine (pokemon)
.pokelusamine
.lusamine
pokelusamine

luvdisc
luvdisc (pokemon)

luxio
luxio (pokemon)

luxray
luxray (pokemon)

lycanroc
lycanroc (pokemon)

mabosstiff
mabosstiff (pokemon)

machamp
machamp (pokemon)
pokemachamp

machoke
machoke (pokemon)

machop
machop (pokemon)

magby
magby (pokemon)

magcargo
magcargo (pokemon)

magearna
magearna (pokemon)

magikarp
magikarp (pokemon)

magmar
magmar (pokemon)

magmortar
magmortar (pokemon)

magnemite
magnemite (pokemon)

magneton
magneton (pokemon)

magnezone
magnezone (pokemon)

makuhita
makuhita (pokemon)

malamar
malamar (pokemon)

mallow (pokemon)
.pokemallow
.mallow
pokemallow

mamoswine
mamoswine (pokemon)

manaphy
manaphy (pokemon)

mandibuzz
mandibuzz (pokemon)

manectric
manectric (pokemon)

mankey
mankey (pokemon)

mantine
mantine (pokemon)

mantyke
mantyke (pokemon)

maractus
maractus (pokemon)

mareanie
mareanie (pokemon)

mareep
mareep (pokemon)

marill
marill (pokemon)

marnie (pokemon)

marowak
marowak (pokemon)

marshadow
marshadow (pokemon)

marshtomp
marshtomp (pokemon)

maschiff
maschiff (pokemon)

masquerain
masquerain (pokemon)

maushold
maushold (pokemon)

mawile
mawile (pokemon)
archaeologist mawile

may (pokemon)
may (pokemon rs)

medicham
medicham (pokemon)

meditite
meditite (pokemon)

meganium
meganium (pokemon)

melmetal
melmetal (pokemon)

meloetta
meloetta (pokemon)

melony (pokemon)

meltan
meltan (pokemon)

meowscarada
meowscarada (pokemon)
pokemonmeowscarada

meowstic
meowstic (pokemon)

meowth
meowth (pokemon)

mesprit
mesprit (pokemon)

metagross
metagross (pokemon)

metang
metang (pokemon)

metapod
metapod (pokemon)

mew
mew (pokemon)

mewtwo
mewtwo (pokemon)

mienfoo
mienfoo (pokemon)

mienshao
mienshao (pokemon)

mightyena
mightyena (pokemon)

milcery
milcery (pokemon)

milotic
milotic (pokemon)

miltank
miltank (pokemon)

mime jr
mime jr (pokemon)

mimikyu
mimikyu (pokemon)

minccino
minccino (pokemon)

minior
minior (pokemon)

minun
minun (pokemon)

miraidon
miraidon (pokemon)

miriam (pokemon)
miriam (bloodstained)

misdreavus
misdreavus (pokemon)

mismagius
mismagius (pokemon)

misty (pokemon)
.pokemisty
.misty
pokemisty

moltres
moltres (pokemon)

monferno
monferno (pokemon)

morelull
morelull (pokemon)

morgrem
morgrem (pokemon)

morpeko
morpeko (pokemon)

mother (pokemon)

mothim
mothim (pokemon)

mr mime
mr mime (pokemon)

mr rime
mr rime (pokemon)

mudbray
mudbray (pokemon)

mudkip
mudkip (pokemon)

mudsdale
mudsdale (pokemon)

muk
muk (pokemon)

munchlax
munchlax (pokemon)

munkidori
munkidori (pokemon)

munna
munna (pokemon)

murkrow
murkrow (pokemon)

musharna
musharna (pokemon)

nacli
nacli (pokemon)

naclstack
naclstack (pokemon)

naganadel
naganadel (pokemon)

natu
natu (pokemon)

necrozma
necrozma (pokemon)

nemona (pokemon)

nessa (pokemon)

nickit
nickit (pokemon)

nidoking
nidoking (pokemon)

nidoqueen
nidoqueen (pokemon)

nidoran f
nidoran f (pokemon)

nidoran m
nidoran m (pokemon)

nidorina
nidorina (pokemon)

nidorino
nidorino (pokemon)

nihilego
nihilego (pokemon)

nincada
nincada (pokemon)

ninetales
ninetales (pokemon)

ninjask
ninjask (pokemon)

noctowl
noctowl (pokemon)

noibat
noibat (pokemon)

noivern
noivern (pokemon)

nosepass
nosepass (pokemon)

numel
numel (pokemon)

nuzleaf
nuzleaf (pokemon)

nymble
nymble (pokemon)

obstagoon
obstagoon (pokemon)

octillery
octillery (pokemon)

oddish
oddish (pokemon)

officer jenny
officer jenny (pokemon)
jenny (pokemon)

ogerpon
ogerpon (pokemon)

oinkologne
oinkologne (pokemon)

okidogi
okidogi (pokemon)

oleana (pokemon)

olivia (pokemon)

omanyte
omanyte (pokemon)

omastar
omastar (pokemon)

onix
onix (pokemon)

oranguru
oranguru (pokemon)

orbeetle
orbeetle (pokemon)

oricorio
oricorio (pokemon)

orthworm
orthworm (pokemon)

oshawott
oshawott (pokemon)

overqwil
overqwil (pokemon)

pachirisu
pachirisu (pokemon)

palafin
palafin (pokemon)

palina (pokemon)

palkia
palkia (pokemon)

palossand
palossand (pokemon)

palpitoad
palpitoad (pokemon)

pancham
pancham (pokemon)

pangoro
pangoro (pokemon)

panpour
panpour (pokemon)

pansage
pansage (pokemon)

pansear
pansear (pokemon)

paras
paras (pokemon)

parasect
parasect (pokemon)

passimian
passimian (pokemon)

patrat
patrat (pokemon)

pawmi
pawmi (pokemon)

pawmo
pawmo (pokemon)

pawmot
pawmot (pokemon)

pawniard
pawniard (pokemon)

pecharunt
pecharunt (pokemon)

pelipper
pelipper (pokemon)

penny (pokemon)

perrserker
perrserker (pokemon)

persian
persian (pokemon)

petilil
petilil (pokemon)

phanpy
phanpy (pokemon)

phantump
phantump (pokemon)

pheromosa
pheromosa (pokemon)

phione
phione (pokemon)

phoebe (pokemon)
.pokephoebe
.phoebe
pokephoebe

pichu
pichu (pokemon)

pidgeot
pidgeot (pokemon)

pidgeotto
pidgeotto (pokemon)

pidgey
pidgey (pokemon)

pidove
pidove (pokemon)

pignite
pignite (pokemon)

pikachu
pikachu (pokemon)

pikipek
pikipek (pokemon)

piloswine
piloswine (pokemon)

pincurchin
pincurchin (pokemon)

pineco
pineco (pokemon)

pinsir
pinsir (pokemon)

piplup
piplup (pokemon)

plusle
plusle (pokemon)

poipole
poipole (pokemon)

poke kid (pokemon)

politoed
politoed (pokemon)

poliwag
poliwag (pokemon)

poliwhirl
poliwhirl (pokemon)

poliwrath
poliwrath (pokemon)

poltchageist
poltchageist (pokemon)

polteageist
polteageist (pokemon)

ponyta
ponyta (pokemon)
galarian ponyta

poochyena
poochyena (pokemon)

popplio
popplio (pokemon)

poppy (pokemon)

porygon
porygon (pokemon)

porygon z
porygon z (pokemon)

porygon2
porygon2 (pokemon)

primarina
primarina (pokemon)

primeape
primeape (pokemon)

prinplup
prinplup (pokemon)

probopass
probopass (pokemon)

professor juniper
professor juniper (pokemon)

protagonist (pokemon)

psyduck
psyduck (pokemon)

pumpkaboo
pumpkaboo (pokemon)

pupitar
pupitar (pokemon)

purrloin
purrloin (pokemon)

purugly
purugly (pokemon)

pyroar
pyroar (pokemon)

pyukumuku
pyukumuku (pokemon)

quagsire
quagsire (pokemon)

quaquaval
quaquaval (pokemon)

quaxly
quaxly (pokemon)

quaxwell
quaxwell (pokemon)

quilava
quilava (pokemon)

quilladin
quilladin (pokemon)

qwilfish
qwilfish (pokemon)

raboot
raboot (pokemon)

rabsca
rabsca (pokemon)

raging bolt
raging bolt (pokemon)

raichu (pokemon)
raichu

raikou
raikou (pokemon)

ralts
ralts (pokemon)

rampardos
rampardos (pokemon)

rapidash
rapidash (pokemon)
galarian rapidash

raticate
raticate (pokemon)

rattata
rattata (pokemon)

rayquaza
rayquaza (pokemon)

red (pokemon)

regice
regice (pokemon)

regidrago
regidrago (pokemon)

regieleki
regieleki (pokemon)

regigigas
regigigas (pokemon)

regional form (pokemon)

regirock
regirock (pokemon)

registeel
registeel (pokemon)

rei (pokemon)

relicanth
relicanth (pokemon)

rellor
rellor (pokemon)

remoraid
remoraid (pokemon)

reshiram
reshiram (pokemon)

reuniclus
reuniclus (pokemon)

revavroom
revavroom (pokemon)

rhydon
rhydon (pokemon)

rhyhorn
rhyhorn (pokemon)

rhyperior
rhyperior (pokemon)

ribombee
ribombee (pokemon)

rika (pokemon)

rillaboom
rillaboom (pokemon)

riolu
riolu (pokemon)

roaring moon
roaring moon (pokemon)

rockruff
rockruff (pokemon)

roggenrola
roggenrola (pokemon)

rolycoly
rolycoly (pokemon)

rookidee
rookidee (pokemon)

rosa (pokemon)
.pokerosa
.rosa
pokerosa

roselia
roselia (pokemon)

roserade
roserade (pokemon)

rotom
rotom (pokemon)

rowlet
rowlet (pokemon)

roxie (pokemon)

rufflet
rufflet (pokemon)

runerigus
runerigus (pokemon)

sableye
sableye (pokemon)

sabrina (pokemon)

salamence
salamence (pokemon)

salandit
salandit (pokemon)

salazzle
salazzle (pokemon)

samurott
samurott (pokemon)

sandaconda
sandaconda (pokemon)

sandile
sandile (pokemon)

sandshrew
sandshrew (pokemon)

sandslash
sandslash (pokemon)

sandy shocks
sandy shocks (pokemon)

sandygast
sandygast (pokemon)

sarah (pokemon)
.pokesarah
.sarah
pokesarah

sawk
sawk (pokemon)

sawsbuck
sawsbuck (pokemon)

scatterbug
scatterbug (pokemon)

sceptile
sceptile (pokemon)

scizor
scizor (pokemon)

scolipede
scolipede (pokemon)

scorbunny
scorbunny (pokemon)

scovillain
scovillain (pokemon)

scrafty
scrafty (pokemon)

scraggy
scraggy (pokemon)

scream tail
scream tail (pokemon)

scyther
scyther (pokemon)

seadra
seadra (pokemon)

seaking
seaking (pokemon)

sealeo
sealeo (pokemon)

seedot
seedot (pokemon)

seel
seel (pokemon)

seismitoad
seismitoad (pokemon)

selene (pokemon)
.pokeselene
.selene
pokeselene

sentret
sentret (pokemon)

serena (pokemon)

serperior
serperior (pokemon)

servine
servine (pokemon)

seviper
seviper (pokemon)

sewaddle
sewaddle (pokemon)

sharpedo
sharpedo (pokemon)

shauna (pokemon)

shaymin
shaymin (pokemon)
sky forme shaymin

shedinja
shedinja (pokemon)

shelgon
shelgon (pokemon)

shellder
shellder (pokemon)

shellos
shellos (pokemon)

shelmet
shelmet (pokemon)

shieldon
shieldon (pokemon)

shiftry
shiftry (pokemon)

shiinotic
shiinotic (pokemon)

shinx
shinx (pokemon)

shroodle
shroodle (pokemon)

shroomish
shroomish (pokemon)

shuckle
shuckle (pokemon)

shuppet
shuppet (pokemon)

sigilyph
sigilyph (pokemon)

silcoon
silcoon (pokemon)

silicobra
silicobra (pokemon)

silvally
silvally (pokemon)

simipour
simipour (pokemon)

simisage
simisage (pokemon)

simisear
simisear (pokemon)

sinistcha
sinistcha (pokemon)

sinistea
sinistea (pokemon)

sirfetchd
sirfetchd (pokemon)

sizzlipede
sizzlipede (pokemon)

skarmory
skarmory (pokemon)

skeledirge
skeledirge (pokemon)

skiddo
skiddo (pokemon)

skiploom
skiploom (pokemon)

skitty
skitty (pokemon)

skorupi
skorupi (pokemon)

skrelp
skrelp (pokemon)

skuntank
skuntank (pokemon)

skwovet
skwovet (pokemon)

skyla (pokemon)

slaking
slaking (pokemon)

slakoth
slakoth (pokemon)

sliggoo
sliggoo (pokemon)

slither wing
slither wing (pokemon)

slowbro
slowbro (pokemon)

slowking
slowking (pokemon)

slowpoke
slowpoke (pokemon)

slugma
slugma (pokemon)

slurpuff
slurpuff (pokemon)

smeargle
smeargle (pokemon)

smoliv
smoliv (pokemon)

smoochum
smoochum (pokemon)

sneasel
sneasel (pokemon)

sneasler
sneasler (pokemon)

snivy
snivy (pokemon)

snom
snom (pokemon)

snorlax
snorlax (pokemon)

snorunt
snorunt (pokemon)

snover
snover (pokemon)

snubbull
snubbull (pokemon)

sobble
sobble (pokemon)

solgaleo
solgaleo (pokemon)

solosis
solosis (pokemon)

solrock
solrock (pokemon)

sonia (pokemon)

spearow
spearow (pokemon)

spectrier
spectrier (pokemon)

spewpa
spewpa (pokemon)

spheal
spheal (pokemon)

spidops
spidops (pokemon)

spinarak
spinarak (pokemon)

spinda
spinda (pokemon)

spiritomb
spiritomb (pokemon)

spoink
spoink (pokemon)

sprigatito
sprigatito (pokemon)

spritzee
spritzee (pokemon)

squawkabilly
squawkabilly (pokemon)

squirtle
squirtle (pokemon)

stakataka
stakataka (pokemon)

stantler
stantler (pokemon)

staraptor
staraptor (pokemon)

staravia
staravia (pokemon)

starly
starly (pokemon)

starmie
starmie (pokemon)

staryu
staryu (pokemon)

steelix
steelix (pokemon)

steenee
steenee (pokemon)

stonjourner
stonjourner (pokemon)

stoutland
stoutland (pokemon)

stufful
stufful (pokemon)

stunfisk
stunfisk (pokemon)

stunky
stunky (pokemon)

sudowoodo
sudowoodo (pokemon)

sui (pokemon)

suicune
suicune (pokemon)

suiren (pokemon)

suiren's mother (pokemon)

sunflora
sunflora (pokemon)

sunkern
sunkern (pokemon)

surskit
surskit (pokemon)

swablu
swablu (pokemon)

swadloon
swadloon (pokemon)

swalot
swalot (pokemon)

swampert
swampert (pokemon)

swanna
swanna (pokemon)

swellow
swellow (pokemon)

swimmer (pokemon)

swinub
swinub (pokemon)

swirlix
swirlix (pokemon)

swoobat
swoobat (pokemon)

sylveon
sylveon (pokemon)

tadbulb
tadbulb (pokemon)

taillow
taillow (pokemon)

talonflame
talonflame (pokemon)

tandemaus
tandemaus (pokemon)

tangela
tangela (pokemon)

tangrowth
tangrowth (pokemon)

tapu bulu
tapu bulu (pokemon)

tapu fini
tapu fini (pokemon)

tapu koko
tapu koko (pokemon)

tapu lele
tapu lele (pokemon)
poketapulele
.tapulele

tarountula
tarountula (pokemon)

tatsugiri
tatsugiri (pokemon)

tauros
tauros (pokemon)

teddiursa
teddiursa (pokemon)

tentacool
tentacool (pokemon)

tentacruel
tentacruel (pokemon)

tepig
tepig (pokemon)

terapagos
terapagos (pokemon)

terrakion
terrakion (pokemon)

thievul
thievul (pokemon)

throh
throh (pokemon)

thundurus
thundurus (pokemon)

thwackey
thwackey (pokemon)

timburr
timburr (pokemon)

ting lu
ting lu (pokemon)

tinkatink
tinkatink (pokemon)

tinkaton
tinkaton (pokemon)

tinkatuff
tinkatuff (pokemon)

tirtouga
tirtouga (pokemon)

toedscool
toedscool (pokemon)

toedscruel
toedscruel (pokemon)

togedemaru
togedemaru (pokemon)

togekiss
togekiss (pokemon)

togepi
togepi (pokemon)

togetic
togetic (pokemon)

torchic
torchic (pokemon)

torkoal
torkoal (pokemon)

tornadus
tornadus (pokemon)

torracat
torracat (pokemon)

torterra
torterra (pokemon)

totodile
totodile (pokemon)

toucannon
toucannon (pokemon)

touko (pokemon)

toxapex
toxapex (pokemon)

toxel
toxel (pokemon)

toxicroak
toxicroak (pokemon)

toxtricity
toxtricity (pokemon)

tranquill
tranquill (pokemon)

trapinch
trapinch (pokemon)

treecko
treecko (pokemon)

trevenant
trevenant (pokemon)

tropius
tropius (pokemon)

trubbish
trubbish (pokemon)

trumbeak
trumbeak (pokemon)

tsareena
tsareena (pokemon)

turtonator
turtonator (pokemon)

turtwig
turtwig (pokemon)

tympole
tympole (pokemon)

tynamo
tynamo (pokemon)

type null
type null (pokemon)

typhlosion
typhlosion (pokemon)
hisuian typhlosion

tyranitar
tyranitar (pokemon)

tyrantrum
tyrantrum (pokemon)

tyrogue
tyrogue (pokemon)

tyrunt
tyrunt (pokemon)

umbreon
umbreon (pokemon)

unfezant
unfezant (pokemon)

unown
unown (pokemon)

ursaluna
ursaluna (pokemon)

ursaring
ursaring (pokemon)

urshifu
urshifu (pokemon)

uxie
uxie (pokemon)

vanillish
vanillish (pokemon)

vanillite
vanillite (pokemon)

vanilluxe
vanilluxe (pokemon)

vaporeon
vaporeon (pokemon)

varoom
varoom (pokemon)

veluza
veluza (pokemon)

venipede
venipede (pokemon)

venomoth
venomoth (pokemon)

venonat
venonat (pokemon)

venusaur
venusaur (pokemon)

vespiquen
vespiquen (pokemon)

vibrava
vibrava (pokemon)

victini
victini (pokemon)

victor (pokemon)

victreebel
victreebel (pokemon)

vigoroth
vigoroth (pokemon)

vikavolt
vikavolt (pokemon)

vileplume
vileplume (pokemon)

virizion
virizion (pokemon)

vivillon
vivillon (pokemon)

volbeat
volbeat (pokemon)

volcanion
volcanion (pokemon)

volcarona
volcarona (pokemon)

voltorb
voltorb (pokemon)

vullaby
vullaby (pokemon)

vulpix
vulpix (pokemon)
alolan vulpix

wailmer
wailmer (pokemon)

wailord
wailord (pokemon)

walking wake
walking wake (pokemon)

wally (pokemon)

walrein
walrein (pokemon)

wartortle
wartortle (pokemon)

watchog
watchog (pokemon)

wattrel
wattrel (pokemon)

weavile
weavile (pokemon)

weedle
weedle (pokemon)

weepinbell
weepinbell (pokemon)

weezing
weezing (pokemon)

whimsicott
whimsicott (pokemon)

whirlipede
whirlipede (pokemon)

whiscash
whiscash (pokemon)

whismur
whismur (pokemon)

whitney (pokemon)

wicke (pokemon)
.pokewicke
.wicke
pokewicke

wigglytuff
wigglytuff (pokemon)

wiglett
wiglett (pokemon)

wimpod
wimpod (pokemon)

wingull
wingull (pokemon)

wishiwashi
wishiwashi (pokemon)

wo chien
wo chien (pokemon)

wobbuffet
wobbuffet (pokemon)

woobat
woobat (pokemon)

wooloo
wooloo (pokemon)

wooper
wooper (pokemon)

wormadam
wormadam (pokemon)

wugtrio
wugtrio (pokemon)

wurmple
wurmple (pokemon)

wynaut
wynaut (pokemon)

wyrdeer
wyrdeer (pokemon)

xatu
xatu (pokemon)

xerneas
xerneas (pokemon)

xurkitree
xurkitree (pokemon)

yamask
yamask (pokemon)

yamper
yamper (pokemon)

yanma
yanma (pokemon)

yanmega
yanmega (pokemon)

youngster (pokemon)

yungoos
yungoos (pokemon)

yuuri (pokemon)

yveltal
yveltal (pokemon)

zacian
zacian (pokemon)

zamazenta
zamazenta (pokemon)

zangoose
zangoose (pokemon)

zapdos
zapdos (pokemon)

zarude
zarude (pokemon)

zebstrika
zebstrika (pokemon)
pokezebstrika

zekrom
zekrom (pokemon)

zeraora
zeraora (pokemon)

zigzagoon
zigzagoon (pokemon)

zoroark
zoroark (pokemon)

zorua
zorua (pokemon)
hisuian zorua

zubat
zubat (pokemon)

zweilous
zweilous (pokemon)

zygarde
zygarde (pokemon)

- ==== pokemon go ====

female protagonist (pokemon go)

- ==== post-timeskip ====

tooru hagakure (post-timeskip)

- ==== ppg ====

blossom (ppg)

bubbles (ppg)

buttercup (ppg)

- ==== precure ====

gentlu (precure)

- ==== princess connect ====

karyl (princess connect)

kokkoro (princess connect)

kyoka (princess connect)

misogi (princess connect)
misogi (sacrifice heroes)

pecorine (princess connect)

yuuki (princess connect)

- ==== project moon ====

binah (project moon)
.binah
binah

gebura (project moon)
.gebura
gebura

- ==== psg ====

kneesocks (psg)
.psgkneesocks
.kneesocks
psgkneesocks

panty (psg)
panty anarchy
.psgpanty
.panty
psgpanty

scanty (psg)
.psgscanty
.scanty
psgscanty

stocking (psg)
stocking anarchy
.psgstocking
.stocking
psgstocking

- ==== puniru wa kawaii slime ====

puniru (puniru wa kawaii slime)

runruun (puniru wa kawaii slime)

- ==== puyopuyo ====

carbuncle (puyopuyo)

- ==== ragnarok online ====

acolyte (ragnarok online)

archer (ragnarok online)

assassin (ragnarok online)

cardinal (ragnarok online)

dragon knight (ragnarok online)

knight (ragnarok online)

lunatic (ragnarok online)

ranger (ragnarok online)

summoner (ragnarok online)

thief (ragnarok online)

wind hawk (ragnarok online)

wizard (ragnarok online)

wraith (ragnarok online)

- ==== raita ====

mahou shoujo (raita)

- ==== rariatto ====

noss (rariatto)

- ==== rayman ====

betilla (rayman)

nymph (rayman)

- ==== re:zero ====

emilia (re:zero)

felix argyle (re:zero)
felix (re:zero)
.charfelix
felix argyle
felix

ram (re:zero)

rem (re:zero)
rem

- ==== red ninja: end of honor ====

kurenai (red ninja: end of honor)

- ==== resident evil ====

ada wong (resident evil)
ada wong
.resiada
.ada
resiada

alcina dimitrescu (resident evil)
alcina dimitrescu

ashley graham (resident evil)
ashley graham
rainyashley
.ashley

bela (resident evil)

cassandra (resident evil)

claire redfield
claire redfield (resident evil)
claire (resident evil)
.resiclaire
.claire
.rainyclaire
resiclaire

jill valentine
jill valentine (resident evil)
jill (resident evil)
.resijill
.jill
.rainyjill
rainyjill

crow country
rainycrow
.crow

mr. x (resident evil)

tyrant (resident evil)

- ==== rose to tasogare no kojou ====

rose (rose to tasogare no kojou)

titan (rose to tasogare no kojou)

- ==== rwby ====

akai (rwby)
akai
rwbyakai

ao (rwby)
ao
rwbyao

blake belladonna (rwby)
.rwbyblake
blake belladonna
.blake
rwbyblake

cinder (rwby)
.rwbycinder
.cinder
rwbycinder

grimm (rwby)

maven (rwby)
maven

neo (rwby)

neopolitan (rwby)
neopolitan

nora valkyrie (rwby)
.rwbynora
nora valkyrie
.nora
rwbynora

penny polendina (rwby)
.rwbypenny
penny polendina
.penny
rwbypenny

pyrrha nikos (rwby)
.rwbypyrrha
pyrrha nikos
.pyrrha
rwbypyrrha

ruby rose (rwby)
rwbyruby
ruby rose
.ruby

salem (rwby)
salem
rwbysalem

summer rose (rwby)
.rwbysummer
summer rose
.summer
rwbysummer

weiss schnee (rwby)
.rwbyweiss
weiss schnee
.weiss
rwbyweiss

winter schnee (rwby)
winter schnee

yang xiao-long (rwby)
.rwbyyang
yang xiao-long
.yang
rwbyyang

- ==== saber j ====

panther (saber j)

tiger (saber j)

- ==== sait0moriyama ====

vena (sait0moriyama)

- ==== samurai spirits ====

iroha (samurai spirits)

- ==== sao ====

asuna (sao)
asuna (sao-alo)

leafa (sao)

lisbeth (sao)

llenn (sao)

titania (sao)

- ==== sekaiju ====

enrica (sekaiju)

shaman (sekaiju)

shaman 2 (sekaiju)

shinobi (sekaiju)

shinobi 4 (sekaiju)

- ==== sennen sensou aigis ====

daniella (sennen sensou aigis)

- ==== senran kagura ====

haruka (senran kagura)

renka (senran kagura)

- ==== sewayaki kitsune no senko-san ====

senko (sewayaki kitsune no senko-san)

shiro (sewayaki kitsune no senko-san)

- ==== shadow of the colossus ====

argus (shadow of the colossus)

avion (shadow of the colossus)

barba (shadow of the colossus)

basaran (shadow of the colossus)

celosia (shadow of the colossus)

cenobia (shadow of the colossus)

dirge (shadow of the colossus)

gaius (shadow of the colossus)

hydrus (shadow of the colossus)

kuromori (shadow of the colossus)

malus (shadow of the colossus)

pelagia (shadow of the colossus)

phaedra (shadow of the colossus)

phalanx (shadow of the colossus)

quadratus (shadow of the colossus)

valus (shadow of the colossus)

wander (shadow of the colossus)

- ==== shadowverse ====

arisa (shadowverse)

erika (shadowverse)

isabelle (shadowverse)

leah (shadowverse)

liza (shadowverse)

luna (shadowverse)

sekka (shadowverse)

- ==== shadowverse flame ====

hahajima fuwari (shadowverse flame)

takanashi tsubasa (shadowverse flame)

- ==== shantae ====

sky (shantae)

- ==== shingeki no bahamut ====

medusa (shingeki no bahamut)

spinaria (shingeki no bahamut)

- ==== shinrabanshou ====

ruruie (shinrabanshou)

- ==== shiren the wanderer ====

nfuu (shiren the wanderer)

- ==== shiromanta ====

igarashi futaba (shiromanta)

takeda harumi (shiromanta)

- ==== show by rock ====

retoree (show by rock)

- ==== silent hill ====

heather mason
heather mason (silent hill)
rainyheather
.heather

nurse (silent hill)
.nurse

- ==== skullgirls ====

annie (skullgirls)

beowulf (skullgirls)

bloody marie (skullgirls)

cerebella (skullgirls)
cerebella

d. violet (skullgirls)

double (skullgirls)

eliza (skullgirls)

feng (skullgirls)

filia (skullgirls)
filia

fukua (skullgirls)
fukua

hungern (skullgirls)

krieg (skullgirls)

leviathan (skullgirls)

minette (skullgirls)

ms. fortune (skullgirls)
ms. fortune

parasoul (skullgirls)

peacock (skullgirls)

samson (skullgirls)

shamone (skullgirls)

squigly (skullgirls)
.skullsquigly
squigly
skullsquigly

umbrella (skullgirls)

valentine (skullgirls)
skullvalentine

vice-versa (skullgirls)

vitale (skullgirls)

- ==== sonic ====

amy rose
amy rose (sonic)
sonicamy
.amy

blaze the cat
blaze the cat (sonic)

chao (sonic)
chao

cream the rabbit
cream (sonic)
cream the rabbit (sonic)

lanolin the sheep (sonic)

rouge the bat
rouge (sonic)
rouge the bat (sonic)
sonicrouge
.rouge

sonic the hedgehog
sonic the hedgehog (sonic)
sonic the hedgehog (idw)

tails the fox
miles prower
tails (sonic)
sonictails
.tails

vanilla the rabbit
vanilla the rabbit (sonic)

- ==== sousou no frieren ====

fern (sousou no frieren)
fern (frieren beyond journey's end)
fern

frieren (sousou no frieren)
frieren (frieren beyond journey's end)
frieren

serie (sousou no frieren)
serie (frieren beyond journey's end)
serie

ubel (sousou no frieren)
ubel (frieren beyond journey's end)
ubel

- ==== spice and wolf ====

myuri (spice and wolf)

- ==== splatoon ====

callie (splatoon)
callie
.splatoonCallie
splatooncallie

deep cut (splatoon)

frye (splatoon)
frye
.splatoonfrye

inkling (splatoon)
inkling
inkling girl
inkling boy
.splatooninkling
splatooninkling

marie (splatoon)
marie
.splatoonmarie
splatoonmarie

marina (splatoon)
marina
.splatoonMarina
splatoonmarina

octoling (splatoon)
octoling
.splatoonoctoling
splatoonoctoling

off the hook (splatoon)

pearl (splatoon)
pearl
splatoonpearl

shiver (splatoon)
shiver
.splatoonshiver

- ==== spy x family ====

anya (spy x family)
anya forger
anya forger (spy x family)
.spyanya
.anya
spyanya

becky blackbell (spy x family)
becky blackbell
becky (spy x family)
.spybecky
.becky
spybecky

bond (spy x family)

twilight (spy x family)
lloyd forger (spy x family)
lloyd (spy x family)
loid forger (spy x family)
loid (spy x family)

yor briar (spy x family)
yor briar
yor forger (spy x family)
yor forger
yor (spy x family)
.spyyor
.yor
spyyor

fiona frost
fiona frost (spy x family)
fiona (spy x family)
agent nightfall
agent nightfall (spy x family)
nightfall (spy x family)
.spyfiona
.fiona
spyfiona

- ==== spyro ====

elora (spyro)
.spyrofaun
.faun
faun (spyro)
spyrofaun

krista (spyro)

lila (spyro)

sheila the faun (spyro)

spinner (spyro)

- ==== squirrelplower ====

lexie (squirrelplower)

- ==== starcraft ====

nova (starcraft)

- ==== stellar blade ====

eve (stellar blade)

- ==== stickybunsart ====

maeve (stickybunsart)

- ==== streachybear ====

lily (streachybear)

- ==== streamer ====

tongkkangi (streamer)

- ==== street fighter ====

cammy white (street fighter)
cammy white

elena (street fighter)

falke (street fighter)

female seth (street fighter)
female seth

ibuki (street fighter)

kolin (street fighter)

menat (street fighter)
menat
sfmenat

rose (street fighter)

ryu (street fighter)

- ==== strongmoist ====

eve (strongmoist)

- ==== suisei no gargantia ====

bellows (suisei no gargantia)

- ==== sulcate ====

dahlia (sulcate)

mesara (sulcate)

- ==== summer of mara ====

koa (summer of mara)

- ==== swapnote ====

nikki (swapnote)

- ==== taimanin asagi ====

ingrid (taimanin asagi)

oboro (taimanin asagi)

- ==== takagi-san ====

houjou (takagi-san)

- ==== takopii no genzai ====

chappy (takopii no genzai)

- ==== tansuke ====

takagi (tansuke)

- ==== tears of the kingdom ====

link (tears of the kingdom)

purah (tears of the kingdom)
purah (young)

zelda (tears of the kingdom)

- ==== teen titans ====

raven (teen titans)
.raven
ttraven

starfire (teen titans)
starfire
ttstarfire

- ==== teh cait ====

sponty (teh cait)

- ==== tekken ====

eliza (tekken)

kunimitsu (tekken)

lili (tekken)
emilie de rochefort
.tekkenlili
tekkenlili

mishima kazumi (tekken)
mishima kazumi

reina (tekken)
.tekkenreina
tekkenreina

unknown (tekken)

- ==== tenchi muyou ====

ryouko (tenchi muyou)

- ==== tenki no ko ====

morishima hodaka (tenki no ko)

- ==== tensura ====

shion (tensura)

shuna (tensura)

- ==== tera ====

elin (tera)
elin

- ==== terraria ====

zoologist (terraria)

- ==== the coffin of andy and leyley ====

andrew graves (the coffin of andy and leyley)

- ==== the last guardian ====

the boy (the last guardian)

- ==== the legend of zelda ====

fi (the legend of zelda)
fi (zelda)

link (the legend of zelda)
link (legend of zelda)
.zeldalink
.link
zeldalink

midna (the legend of zelda)
imp midna
.zeldamidna
.midna
zeldamidna

princess zelda (the legend of zelda)
princess zelda

riju (the legend of zelda)
.zeldariju
.riju
zeldariju

saria (the legend of zelda)
saria (zelda)

young link (the legend of zelda)
young link

zelda (the legend of zelda)
zelda

- ==== the ninja warriors ====

yaksha (the ninja warriors)

- ==== the witcher 3 ====

bea (the witcher 3)

sylvan (the witcher 3)

- ==== tiny evil ====

yurika (tiny evil)

- ==== tloz ====

blin (tloz)

- ==== total drama ====

gwen (total drama)

heather (total drama)

- ==== touhou ====

gengetsu (touhou)

hakurei reimu
hakurei reimu (touhou)
reimu hakurei
touhoureimu

konngara (touhou)

mima (touhou)

mugetsu (touhou)

rika (touhou)

sariel (touhou)

shinki (touhou)

tokiko (touhou)

- ==== tower of fantasy ====

nemesis (tower of fantasy)

- ==== towergirls ====

goblin princess (towergirls)
goblin princess

- ==== tsukihime ====

arcueid brunestud
arcueid
arcuied (tsukihime)
arcueid brunestud (tsukihime)

ciel (tsukihime)
ciel

neco-arc
neco-arc (tsukihime)
neko-arc
neko-arc (tsukihime)

- ==== ttgl ====

simon (ttgl)

- ==== umamusume ====

agnes tachyon (umamusume)
.tachyon
agnes tachyon
tachyon

biwa hayahide (umamusume)
biwa hayahide

daiwa scarlet (umamusume)
daiwa scarlet

gold ship (umamusume)
gold ship

manhattan cafe (umamusume)
.manhattan
manhattan cafe
manhattan

mr. c.b. (umamusume)
mr. c.b.

silence suzuka (umamusume)
silence suzuka

special week (umamusume)
special week

- ==== undertale ====

frisk (undertale)
frisk

chara (undertale)
chara

- ==== unicorn overlord ====

alain (unicorn overlord)

alcina (unicorn overlord)

amalia (unicorn overlord)

auch (unicorn overlord)

berengaria (unicorn overlord)

celeste (unicorn overlord)

chloe (unicorn overlord)

dinah (unicorn overlord)

eltolinde (unicorn overlord)

galadmir (unicorn overlord)

gilbert (unicorn overlord)

hodrick (unicorn overlord)

ilenia (unicorn overlord)

josef (unicorn overlord)

lex (unicorn overlord)

melisandre (unicorn overlord)

nigel (unicorn overlord)

nina (unicorn overlord)

ochlys (unicorn overlord)

railanor (unicorn overlord)

ramona (unicorn overlord)

rosalinde (unicorn overlord)

scarlett (unicorn overlord)

selvie (unicorn overlord)

virginia (unicorn overlord)

yahna (unicorn overlord)

yufini (unicorn overlord)

yunifi (unicorn overlord)

- ==== vocaloid ====

brazillian miku
brazillian miku (vocaloid)

hatsune miku
hatsune miku (vocaloid)

kyoufuu all back (vocaloid)

zako (vocaloid)

- ==== voms ====

pikamee (voms)
pikamee

- ==== vtuber ====

bao (vtuber)

howcow (vtuber)

sameko saba (vtuber)

shigure ui (vtuber)
shigure ui

shigure ui (young)
shigure ui (vtuber) (young)

- ==== wakfu ====

evangelyne (wakfu)

- ==== warcraft ====

alexstrasza (warcraft)
.wowalexstrasza
alexstrasza
wowalexstrasza

blood elf (warcraft)
blood elf

chromie (warcraft)
.wowchromie
chromie
wowchromie

lunara (warcraft)
.wowlunara
lunara
wowlunara

night elf (warcraft)

player character (world of warcraft)

stitches (world of warcraft)

whitemane (warcraft)
.wowwhitemane
whitemane
wowwhitemane

yrel (warcraft)
.wowyrel
yrel
wowyrel

- ==== warioware ====

ashley (warioware)

red (warioware)

- ==== wataten ====

hoshino miyako (wataten)

- ==== wokada ====

meguno (wokada)

nina (wokada)

sunao (wokada)

- ==== wolflance ====

liz (wolflance)

- ==== world flipper ====

mia (world flipper)

- ==== xenoblade ====

brighid (xenoblade chronicles)
brighid (xenoblade)

morag ladair (xenoblade chronicles)
morag (xenoblade chronicles)
morag ladair (xenoblade)
morag (xenoblade)

mythra (xenoblade chronicles)
mythra (xenoblade)
mythra (xenoblade chronicles 2)
.xenoblademythra
mythra
xenoblademythra

nia (xenoblade chronicles)
nia (blade) (xenoblade chronicles)
nia (xenoblade)
nia (xenoblade chronicles 2)
.xenobladenia
nia
xenobladenia

pyra (xenoblade chronicles)
pyra (xenoblade)
pyra (xenoblade chronicles 2)
.xenobladepyra
pyra
xenobladepyra


rex (xenoblade chronicles)
rex (xenoblade)

- ==== yatsmochi ====

yatsmugi (yatsmochi)

- ==== yatterman ====

leopard (yatterman)

- ==== yoru mac ====

boyfriend (yoru mac)

daughter (yoru mac)

father (yoru mac)

girlfriend (yoru mac)
girlfriend (friday night funkin')

mother (yoru mac)

- ==== yu-gi-oh ====

ki-sikil (yu-gi-oh)
ki-sikil

lil-la (yu-gi-oh)
lil-la

sera (yu-gi-oh)
sera

harpie lady (yu-gi-oh)
harpie lady
harpie lady (normal monster)
harpy lady (yu-gi-oh)
harpy lady
harpy lady (normal monster)

- ==== zenless zone zero ====

burnice white (zenless zone zero)
burnice white (zzz)
burnice white
burnice (zenless zone zero)
burnize
bunice white (zenless zone zero)
bunice white (zzz)
bunice white
zzzburnice

qingyi (zenless zone zero)

- ==== unsorted ====

arato nagi (ruri no houseki)
arato nagi (ruri rocks)
arato nagi
nagi arato (ruri no houseki)
nagi arato (ruri rocks)
nagi arato

kasane teto
teto kasane
teto

applejack
applejack (my little pony)

bayonetta
bayonetta (bayonetta)
bayonetta (bayonetta 2)
bayonetta (bayonetta 3)

fluttershy
fluttershy (my little pony)

keldeo (resolute form)
keldeo (resolute form) (pokemon)

lloyd de saloum
lloyd de saloum (tensei shitara dai nana oji datta no de: kimama ni majutsu o kiwamemasu)
lloyd

pinkie pie
pinkie pie (my little pony)
pinky pie
pinky pie (my little pony)

princess cadence
princess cadence (my little pony)

princess celestia
princess celestia (my little pony)

princess luna
princess luna (my little pony)

rainbow dash
rainbow dash (my little pony)

rarity
rarity (my little pony)

twilight sparkle
twilight sparkle (my little pony)

robin (stardew valley)

natsuki (amazon)

amazon (goblin slayer)
amazon warrior (goblin slayer)

amazon (gotta protectors)

amazon (mamotte knight)

- ==== none ====

ruinsslimefemale

ruinsslimemale

ruinsslimewhite

forestfairy

forestgoblin

rainy6

rainygoth

rainyneptune

rainyrecordf

rainygirl

rainywoman

rainyboy

orgamc

orgashop

orgacom

whitepawn

whiterook

whiteknight

whitebishop

whitequeen

whiteking

blackpawn

blackrook

blackknight

blackbishop

blackqueen

blackking

mysticmc

mysticgeneric

mysticwizard

mysticalchemist

mysticelf

mysticshaman

mysticdemon

mysticincubus

mysticghost

mysticspirit

mysticgremlin

mysticslime

mysticminotaur

mysticdjinn

mysticdragon

mystickobold

mysticblot

mysticautomaton

mysticgnome

mysticfairy

mysticunicorn

mysticdryad

mysticdruid

mystictitania

mysticshroom

mysticbicorn

mysticcait

mysticwisp

mysticjiangshi

mysticdullahan

mysticvampire

mysticbanshee

mysticreaper

mysticzombie

mysticdhampir

mysticnightmare

mysticimp

mysticdaemon

mysticwicken

mysticdevil

mysticvermin

mysticbrat

mystichellhound

demonblackknight

demonhellhound

demonhideous

demonhatred

demonfury

demonpain

demonpride

demoninsidious

demongreed

demonmalicious

demonresentment

demonsloth

demonalraune

feyhobb

feyrook

feyknight

feybishop

femboyschool

femboyobscura

succhelper

succpurple

succpink

gobbobarbarian

gobboarcher

gobboredcap

impmage

impknight

impsuccubus

catrogue

gnomecrimbus

gnomeleprechaun

fairy

gothgreen

gothlolita

koboldred

- ==== generic terms ====
-
- Brand keywords that are NOT characters: studios, series, events, species
- markers. They categorise as bodyBrand and sort with the character tags, but
- nothing here is ever counted as a figure in the image.
-
- ONE TERM PER LINE. A generic term has no aliases, so no blank line is needed
- between entries and none of these opens a multi-line block.
-
- Migrated from namesArray.floating.txt on 2026-08-05. Promoting an entry to a
- real character is just moving the line into its franchise's section.

.hackdnf duel
2020 tokyo olympics
2channel
2d dream magazine
3.1-tan
aang
abarai renji
abe shinzou
absalom
ace attorney
activision
addams family
adelbert steiner
adeleine
ae-3803
agnes oblige
agro
ahsoka tano
aia amare
aia amare (1st costume)
aiassis
aiba manami
aida taketo
aihara ai
aikatsu
aikatsu (series)
aikatsu stars
airi shiyoji
airy
aisaka taiga
akaba hayato
akabane youko
akagi miria
akali
akamatsu yui
akashiya moka
akehoshi setsuka
akemi homura
akemi homura (magical girl)
akiha rumiho
akimichi chouchou
akiyama rinko
akiyama yukari
akizuki ritsuko
alduin
aleste
alexandrian soldier
alice margatroid
alice the rabbit
alolan form
alpha pokemon
alvis hamilton
amae koromo
amalia
amami haruka
amami miharu
amamiya mimori
amamiya ren
amano pikamee
amenouzume
amity blight
among us
amy wong
ancient elchulus
android 18
anegasaki nene
ange katrina
angel dust
angelise reiter
animal crossing boy
animal crossing new leaf
anjou naruko
anna bonnie
anna nishikinomiya
anna williams
annie leonhart
ano hi mita hana no namae wo bokutachi wa mada shiranai.
anon
anonymous
anti-aqua
anti-chan
ao no exorcist
aoi cameron
aono remi
aono tsukune
apopis
april o'neil
ar tonelico
ar tonelico i
ara haan
arachnid
araga kiwi
araragi karen
araragi koyomi
araragi tsukihi
arc system works
arcade miss fortune
archetype earth
archie comics
archigram
arella roth
ariduka formica
arima miyako
arle nadja
arms note
aryll
asahina aoi
asakura mao
asami sato
ash crimson
ash ketchum
ashelia b'nargin dalmasca
ashido mina
ashley graves
asriel dreemurr
astlibra revision
astrid hofferson
atelier (series)
atelier ryza
atelier ryza 1
atlus
aurica nestmile
aurora e. juutilainen
avatar legends
avatar the last airbender
avatar: the last airbender
axis powers hetalia
ayanami rei
azula
b.b. hood
babyroom
background character
bad dragon
badnik
bakemonogatari
bakugou katsuki
bandicoot
barbaroi
battle tendency
battletoads
bayonetta (series)
beast boy
beedle
bel
bela dimitrescu
bell cranel
belle delphine
bernadetta von varley
betilla
big bad wolf
big hero 6
bill cipher
bioshock
bioshock (series)
bishoujo senshi sailor moon
bito raimu
bitores mendez
black egrets
blackfire
blaidd the half-wolf
blazblue: continuum shift
blaze fielding
bleach
bloodborne
bloodstained (series)
bloodstained: ritual of the night
bloody roar 4
blue lock
bobby brady
bocchi the rock
bokoblin
boku dake ga inai machi
boku no kokoro no yabai yatsu
boku wa tomodachi ga sukunai
bokura wa mahou shounen
boruto: naruto next generations
bowser
brainsucker
brand new animal
brandon
brave sword x blaze soul
bravely default (series)
bravely default: flying fairy
brazilian miku
brother and sister
bulma
bulma briefs
bunnie rabbot
bunzo bunny
c-01 permit
calamitas
calamity mod
canavalia
capella emerada lugnica
carnival phantasm
cass hamada
cassandra dimitrescu
castlevania (series)
castlevania: portrait of ruin
catholic
cathyl
catra
celestine lucullus
celine jules
celty sturluson
centorea shianus
cerestia of life
charlotta fenia
charlotte aulin
chatalie
chen
chibi usa
chigiri hyoma
chinese mythology
chinese new year
chloe von einzbern
chomusuke
chris redfield
christianity
christie monteiro
chrono (series)
chun-li
cidney aurum
ciel ushi
cindy brady
ciri
cirno
cloud strife
coca-cola
coco bandicoot
code geass
comic rin
converse
coppelion
copyright request
cowboy bebop
crash bandicoot (series)
creatures inc.
crest worm
crimson viper
crimvael
cure black
cyberbots
cyberpunk (series)
cyberpunk edgerunners
cygames
dagashi kashi
daidouji tomoyo
danganronpa (series)
danua
dark eclair
dark elf beastmaster
dark elven forest ranger
dark magician girl
dark queen
dark souls (series)
dark souls i
dark souls ii
dark sun gwyndolin
darkstalkers 3
date makiko
david martinez
dead or alive
dead or alive 5
dead or alive 6
dead rising
dead rising 2
death abyss
debauchery shopping mall
dehaka
delia ketchum
delicious party precure
demia duodectet
demon hunter
devil may cry (series)
devil may cry 3
devilot de deathsatan ix
diablo (series)
diablo 3
digimon savers
digimon story: cyber sleuth
dingodile
dipper pines
disgaea 3
dissidia final fantasy
diva mizuki
dmc
dohna dohna issho ni warui koto o shiyou
domestic pig
doronjo
dorothea arnault
dorothy sofiel
dorothy west
doseisan
dr pepper
draco centauros
draenei
dragon ball gt
dragon ball super
dragon ball super super hero
dragon humanoid
dragon quest
dragon quest x
dragon quest xi
dragon yukano
dragon's dogma
dragon's dogma (series)
dragonball z
draph
dreamworks
dreamworks dragons
drifters
drowtales
dungeon ni deai wo motomeru no wa machigatteiru darou ka
dungeons & dragons
dunkmaster darius
dunkmaster series
durarara
earthbound
easter
ebichu
echidna
eeveelution
eiko carol
eila ilmatar juutilainen
eiyuu senki ww
elchulus
elden ring: shadow of the erdtree
elder women x little boy generation 2nd
elemental
elf village
elhaym van houten
eliminator
elira pendora
elisabeth blanctorche
ellen baker
elphelt valentine
elsword
elven forest maker
embodiment of scarlet devil
emerald herald
endou saya
enoshima junko
eonbound
epona
eren yeager
eris greyrat
eromanga sensei
erza scarlet
escape from tarkov
espella cantabella
ethan winters
etrian odyssey
evil eye sigma
evolutionary line
executive mishiro
eyeshield 21
ezlo
f.o.e.
fakku
falin touden
fallout 3
fallout 4
fan character
fantasy bishoujo juniku ojisan to
faputa
farah
fate ()
fate (series)
fate testarossa
fate/kaleid liner prisma illya
fate\kaleid liner prisma illya
fateapocrypha
fateextella
fateextra ccc
fatestay night
faye valentine
fear & hunger (series)
fear & hunger 2: termina
fel hunter
felyne
feo ul
fighting vipers 2
final fantasy ix
final fantasy tactics
final fantasy vii
final fantasy vii remake
final fantasy viii
final fantasy x
final fantasy xii
final fantasy xiii
final fantasy xv
finana ryugu
finana ryugu (2nd costume)
fio germi
fire emblem awakening
fire emblem fates
fire emblem heroes
fire emblem: path of radiance
fire emblem: the binding blade
fire emblem: the blazing blade
fire emblem: the sacred stones
fire emblem: three houses
firecracker tristana
flandre scarlet
fossil pokemon
fran cervice
freia stormbringer
fresh precure
friendship is magic
fromsoftware
fujieda yoshino
fujimura taiga
fujiwara chika
fujiwara
fujiwara no mokou
fukasaku aoi
fullmetal alchemist
funou
furinji miu
furuya chihiro
futaba anzu
futabu
futami mami
futurama
future knight
future princess
fuurinji miu
gabriel dropout
gaen tooe
gake no ue no ponyo
gakuen idolmaster
galarian form
galliform
gamou maki
ganondorf
gatchaman crowds
genkai tokki: seven pirates
gensou seibutsu zukan
gensou seibutsu zukan 6
gentle criminal
gerudo link
getou suguru
gg aleste
gg aleste 3
ghislaine dedoldia
ghost in the shell
ghost in the shell: stand alone complex
giant panda
giga mermaid
gigantamax pokemon
gigi andalusia
gimmy adai
gina lestrade
girls und panzer
gm orangeade
gnar
go-toubun no hanayome
gochuumon wa usagi desu ka
goddess of victory: nikke
godsworn alexiel
gogo tomago
gojou wakana
gokou ruri
goomba
goth annie
gotoh hitori
gotta protectors : amazon's running diet
grand knights history
grandia i
gravity falls
green yoshi
greg brady
gridman universe
grim aloe
grovyle the thief
gruftine
grunkle stan
guardian tales
guilty gear strive
guilty gear xrd
gundam
gundam build fighters
gundam build fighters try
gundam gquuuuuux
gundam hathaway's flash
gundam suisei no majo
gundou mirei
gwen tennyson
gwendolyn tennyson
gyanko
gym leader
gyroid
h siyo
habanero-tan
hachiouji naoto
hacka doll
hacka doll 3
hajimete no orusuban
hakase fuyuki
hakase fuyuki (2nd costume)
hakozaki serika
half naked
han juri
hanekawa tsubasa
haneyama kazuho
hanna-barbera
hanna-justina marseille
hans taubemann
harley quinn
haro
harpie lady 1
harry potter
harry potter (series)
harukaze poppu
haruno sakura
hasbro
hasegawa kobato
hasshaku-sama
hatake kakashi
hataraku saibou black
hathaway noa
haumea
hawkgirl
hayama teru
hayami kanade
hayasaka ai
hayato akaba
hazama eri
hazbin hotel
hearthstone
heat soft
hekapoo
helen kent
helen parr
helldivers 2
hello kitty
hellsing
hershel layton
hibino eikichi
hibino matsuri
high school dxd
higuchi kaede
higuchi kaede (1st costume)
hiiragi kagami
hiiragi utena
hikami satori
hikami sumire
hilda the hyena
hilda valentine goneril
himekawa fubuki
himenogi rinze
himesaka noa
hinanawi tenshi
hinatsuru ai
hinazuki kayo
hinoa
hinomoto oniko
hirasawa yui
hiro hamada
hiroi kikuri
hisuian form
hodaka natsumi
hojo sophy
holidays
holly lingerbean
hong meiling
hong ryu kang
honkai (series)
honma himawari
honma himawari (1st costume)
hooters
hoshiguma yuugi
hoshikawa lily
hoshikawa sara
hoshimachi suisei
hoshimiya kate
hoshino fumina
hoshino hinata
hoshino ruri
hotel transylvania
houkago teibou nisshi
houtengeki's elf girl
how to train your dragon (series)
how to train your dragon 1
hozuki kaede
hozuki momiji
huang lingyin
hub lass
hub provisions lass
hudson soft
humbert humbert
hyakumantenbara salome
hyakumantenbara salome (1st costume)
hylian
hyouryuu kangoku chronos
hyuuga hinata
iana kalashnikov
ibuki suika
ichihara nina
ichikawa kyoutarou
ichinose hajime
ichinose shiki
idolmaster 1
idolmaster cinderella girls
idolmaster cinderella girls starlight stage
idolmaster cinderella girls u149
idolmaster million live
idolmaster one for all
idolmaster shiny colors
idolmaster side-m
idw comics
idw publishing
igarashi futaba
ijichi nijika
ikari shinji
illyasviel von einzbern
imadake dabuchi tabemi
impaled
inaba tewi
indomitable marie
infinite stratos
injuu kangoku
inner moka
inoue orihime
inside out
inui toko
inutade
inuyama aoi
iori rinko
irene belserion
iron saga
itadori yuuji
itou aya
itsuno mani koukannikki
ittle dew (series)
ixtab felfall
izayoi sakuya
izuku midoriya
izumi konata
izumi sagiri
izutsumi
j7w village
jack-o' valentine
jadf-tan
jan brady
jane romero
jasminka antonenko
jeanne gado
jenny burtory
jenny fox
jessica rabbit
jigokuraku
jikkyou powerful pro yakyuu
jimmy
jk bitch ni shiboraretai
jojo no kimyou na bouken
jon talbain
jougasaki mika
jougasaki rika
judy hopps
julia chang
junketsu
juri han
juusan kihei bouei ken
k-on
kaai yuki
kadoc zemlupus
kadokawa shoten
kaeli cedarfallen
kafuu chino
kagamine len
kagamine rin
kagari atsuko
kagari ayaka
kagayama kaede
kagemori michiru
kageyama ritsu
kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~
kaibara makoto
kakei sumire
kalumiya
kamen rider
kamen rider 01 (series)
kamiki izumo
kaminaki sekai no kamisama katsudou
kamishirasawa keine
kamiya midori
kaname madoka
kanamori sayaka
kanbaru suruga
kaneshiro junya
kanroji mitsuri
kanzuki karin
karakai jouzu no takagi-san
karasuma sachiko
kardia of rhodes
karin kanzuki
karyn urtsakar
kasai amane
kasamoto eri
kasugano sakura
katagiri sanae
katarina alves
katsuragi misato
kawahoshi homura
kawai shizuka
kawakami sadayo
kawashiro nitori
kazama asuka
kazama iroha
kazama jun
kazami yuuka
kazano hiori
kaze no tani no nausicaa
kda akali
kemono friends 3
ken masters
kenzen hentai seikatsu no susume
kevin-san no milk bokujou
kidou senkan nadesico
killer bee
killua zoldyck
kim greasegear
kimetsu no yaiba
king bradley
king round
kingdom hearts iii
kinomoto sakura
kinoshita matsuri
kinoshita miki
kirara mami
kirby (series)
kirby 64
kirby 64: the crysta shards
kirigakure shura
kirigaya suguha
kirihara tatsugoro torayasu
kirihara torajyuro tatsumune
kirima syaro
kirisame kagura
kirisame marisa
kirishima nagi
kiryuuin satsuki
kisaragi tomi
kise saki
kiss-shot acerola-orion heart-under-blade
kita ikuyo
kitagawa marin
kitagawa yuusuke
kitakoji hisui
kitakoji hisui (1st costume)
kizumonogatari
kizuna akari
knuckles the echidna
kochiya sanae
kodomo doushi
kolin
komekko
komiya kaho
komori kinoko
kongiku
konoe a. mercury
koopa
koopa troopa
korok
korra
korwa
kos-mos
kos-mos ver. 4
kotetsu isane
kotonoha akane
kotonoha aoi
koukawa asuka
kousaka kirino
kousaka shigure
kouzuki kallen
kuchiki rukia
kugisaki nobara
kuja
kujaku mai
kujou miina
kuma-tan
kumashiro maya
kumatanchi
kumatora
kuradoberi jam
kurobane alice
kuroinu ~kedakaki seijo wa hakudaku ni somaru~
kurosaki mea
kurosawa dia
kurosu aroma
kurosuzu mio
kurusu kanako
kurusu kimihito
kusanagi motoko
kusunoki shio
kuwayama chiyuki
kuze shizuka
kyochuu rettou
kyoryu sentai zyuranger
la+ darknesss
lab zero games
labelle able
lady liadrin
laharl
lalafell
lana loud
lara croft
last exile
laura matsuda
laz-kun
legacy series
legend of zelda
legendary pokemon
lei lei
lemonade alpha
leon geeste
leon s. kennedy
lepsus
les chevaucheurs
level-5
lewisia aquablue
li li stormstout
li xiaolang
li-ming
lidia sobieska
lila decyrus
lilinea la-sahran
liliruca arde
lilith aensland
lilith-soft
lincoln loud
linea alba
ling xiaoyu
ling yao
linkle
lio fotia
lisa
litchi faye ling
little nightmares
little witch academia
liz glover
lize helesta
loid forger
lola bunny
lola loud
lord raptor
love live
love live school idol project
love live sunshine
love plus
love r
lovely labrynth of the silver castle
luchs
lucille aura nova
lucky chloe
lucky star
luigi
luke triton
lulu the fae sorceress
luna child
luna loud
lunafreya nox fleuret
lunar new year
lunar revel series
luong
luz noceda
lynel
lyrical nanoha
lysithea von ordelia
maaa
mabel pines
madou monogatari
maezono chihaya
maezono chihiro
maezono chika
maezono chinami
maezono chizuru
magatsuchi shouta
magi the labyrinth of magic
magia record: mahou shoujo madoka magica gaiden
magical momo
magipink
mahou sentai magiranger
mahou shoujo madoka magica
maison ikkoku
majikina mina
makai kingdom
makai senki disgaea 2
makai senki disgaea 5
makaino ririmu
makaino ririmu (4th costume)
maki oze
makihara arina
makise kurisu
makoto nanaya
malenia blade of miquella
malon
manaka laala
manbagi rumiko
mankanshoku mako
mano aloe
maou beluzel
maplestory
maplestory 2
marceline
marceline abadeer
marcia brady
marcille donato
maria robotnik
marianne von edmund
mars people
marui mitsuba
maruruk
marvel
marvel comics
mary lou callaway
mash kyrielight
master raven
matoba risa
matsumoto rangiku
matsumoto sarina
matsuo chizuru
mavis dracula
mazaki anzu
mcdonald's dad
mecha dehaka
medli
mega evolution
mega man (series)
mega man battle network
mega man battle network (series)
mega man legends
mega man star force (series)
megurine luka
meikoku gakuen jutai hen: onegaishimasu...... sensei no seieki de
melissa shield
melonbooks
melty blood
mercedes marten
mesuinu hatsujou ki
metal gear (series)
metal gear solid v: the phantom pain
metal slug
metal slug 2
metroid larva
metroid: zero mission
meyumi nuyasaka
microsoft
microsoft windows
midoriya inko
midoriya izuku
mighty morphin power rangers
mighty morphin yellow ranger
mikasa ackerman
millie parfait
mimic chest
minahara yuki
minakata hizuru
minecraft
mineta minoru
minoto
miorine rembran
mirabell bell
miraitowa
miss fortune
mita kazhi
mitarashi anko
mitsudomoe (manga)
miya utsutsu
miyake hinata
miyamoto musashi
miyauchi ai
miyauchi erina
miyauchi hina
miyauchi iori
miyauchi kaoru
miyauchi renge
miyauchi ushio
miyu edelfelt
miyu edelfelt (magical girl)
mizuki shiori
mizuki yukikaze
mizuno midori
mizusaki mamoru
mizushima saki
mob psycho 100
mobian bat
mobian cat
mobian hedgehog
mobian rabbit
mobile suit gundam
moblin
mochizuki azami
momo de fleuve
momo mizrahi
momozono ayumi
mon-musu quest: paradox
mon-yu
monkey d. luffy
monkey island
monogatari (series)
monotreme
monster hunter (series)
monster hunter rise
monster hunter: world
monster musume no iru nichijou
monster tamer lulu
monster tamer series
morgan rizilia
mori calliope (1st costume)
morichika rinnosuke
morimoto chio
morimoto chio's mother
morimura chihiro
morino rinze
moriya suwako
moroboshi kirari
morrigan aensland
morumi
mother (series)
mother 3
moyashimon
mr x
mr. mime
ms. marvel
muchimuchi-san
muffet
mukai takumi
munakata atsumi
munakata hoshi
munakata momone
munakata suika
murid
murine
murosaki miyo
mushoku tensei
muten roushi
my little pony
myrthe
mythical pokemon
na-na-mi wonderland
nagatoro hayase
nakano azusa
nakano ichika
nakano itsuki
nakano miku
nakano nino
nakano yotsuba
nakatani iku
nakiri alice
nana asta deviluke
nanami mizuki
narberal gamma
naruse ibara
naruto (series)
naruto shippuuden
naruto: road to ninja
nasu no yoichi
nasus
natsuiro matsuri
natsuiro matsuri (1st costume)
nausicaa
navi
nefertari vivi
nega-shantae
nekomonogatari
neon genesis evangelion
neptune (series)
new game
new horizon
new super mario bros. u deluxe
new year
nickelodeon
nicole demara
nicole the lynx
nidalee
nidoran
nidoran♂
nier (series)
nier: automata
niijima makoto
niimura akane
nijigen dream magazine
nijisanji en
nilo
nimpi
nina tucker
nina williams
ninja slayer
ninomae ina'nis (casual)
nintendo 3ds
nintendo ds
nintendo switch
nippon ichi
nippon ichi software
nisemonogatari
nishikata
nishikata chii
no man's land
noctis lucis caelum
nomura taeko
non non biyori
nonomura uriko
noxus poppy
npc trainer
nui sociere
nyotengu
octi
octoling girl
odagiri kaito
odahving
ogami shirou
ogami tamaki
ogami yugo
oikawa shizuku
ojamajo doremi
oka asahi
okazaki yumemi
okumura haru
one (manga)
one piece film: red
one piece film: z
one piece: strong world
onii-chan wa oshimai
oniko
ononoki yotsugi
oohashi sumika
oono aya
oosuki mamako
oosuki masato
oozora subaru (casual)
opera brest
ore no imouto ga konna ni kawaii wake ga nai
oribe mutsumi
oribe yasuna
os-tan
oshino ougi
oshino shinobu
osiris
otonashi kyouko
ouma ga toki: tasogare ni kemuru shoujo
oyama mahiro
oyama mihari
oyama miyabi
ozen
ozora akari
pa-san
paarthurnax
pacifica northwest
padme amidala
pal (species)
palagia
paldea mother
panda delgado
pandaren
pantherine
panty & stocking with garterbelt
paranormasight: the seven mysteries of honjo
parasite in city
patchouli knowledge
patty fleur
peewee
peko
penelo
perrine h. clostermann
persona
persona 3
persona 4
persona 5 scramble: the phantom strikers
persona 5 the royal
peter brady
phalia
phantasy star
phantasy star online 2
phantasy star online 2 new genesis
phasmophobia
phenice walholl
phessian
pixar
pizza delivery sivir
plain doll
plant 42
pleinair
polt
pomu rainpuff
pony
ponyo
pool party lulu
pool party poppy
pool party series
poppy playtime
portia
power girl
power pro kun pocket
power rangers
pram
prank-kids
prank-kids rocksies
pretty cure
pretty series
princess amalia sheran sharm
princess angelica
princess bubblegum
princess claire
princess ruto
princess sefia
pripara
priscilla the crossbreed
prisma illya
procyonid
professor layton
project x zone
promare
prototype labiata
prushka
psykos
pui pui molcar
purah
puyo
pyramid head
queen opala
quetzalpetlatl
raccoon
rachel roth
rachnera arachnera
rainbow mika
ralsei
ramlethal valentine
ranma 1/2
ranma-chan
raphiel shiraha ainsworth
raphtalia
rayman (series)
rayman origins
re:zero kara hajimeru isekai seikatsu
rebecca chambers
rebecca chang
recette lemongrass
rei membami
reisen udongein inaba
reiuji utsuho
religion
remilia scarlet
rena lanford
renekton
rensouhou-chan
reona west
rias gremory
rider
rijiato
rika
riley andersen
rimuru tempest
rindou mikoto
rinoa heartilly
risky boots
rita repulsa
rito
robbie valentino
robot neoanthropinae polynian
rodent
rondine
rosario+vampire
rosen garten saga
rotom phone
rottytops
rowdy blue
roxy migurdia
rozalin
rudeus greyrat
rumi usagiyama
rumia
ryoko
ryutaro naruhodo
ryuuou no oshigoto
saber marionette j
sable able
sabrith ebonclaw
saenai heroine no sodatekata
saikawa riko
saikawa sanae
sailor saturn
sajo yukimi
sakamoto ryuuji
saki (manga)
sakura futaba
sakura kasugano
sakura kyoko
sakura miko (casual)
sakura taisen
sakuragi mano
sakurai momoka
sakurai shin'ichi
sakurai shinichi
sakurai touko
sally acorn
sally whitemane
salvatore
sameko saba
sanaki kirsch altina
sangonomiya kokomi
sanjouno haruhime
sanka aria
sankarea
sanrio
sansha san'you
saotome ranma
sarah kerrigan
saru getchu
sasaki chie
sasaki saku
sasaki saku (1st costume)
satanichia kurumizawa mcdowell
sato rumi
sato shin
satou kazuma
sawada kanako
sawamura spencer eriri
sayaka
sazaki kaoruko
school for vampires
science adventure
sciurid
scooby-doo
scraggle
secelia dote
segawa onpu
seigi no henshin-heroine wo sasaeru ore to aku no onna-kanbu
seiken densetsu
seikimatsu occult gakuin
seikon no arcana
sekai seifuku: bouryaku no zvezda
sekaiju no meikyuu
sekaiju no meikyuu 3
sekaiju no meikyuu 5
sekaiju no meikyuu x
sekhmet of death
selen tatsuki
selfie pose
selim bradley
sendai hakurei no miko
senjougahara hitagi
senoo aiko
senpai ga uzai kouhai no hanashi
senran kagura estival versus
sephiroth
serah farron
seras victoria
seria kirmin
servbot
sessyoin kiara
shadow pokemon
shadow queen
shadow siren
shadow the hedgehog
shalltear bloodfallen
shameimaru aya
shantae (series)
shantae: half-genie hero
she-ra and the princesses of power
sherry birkin
shidare hotaru
shigure kasumi
shihouin yoruichi
shiiko sugai
shiina yuika
shiina yuika (1st costume)
shijou saikyou no deshi ken'ichi
shimada arisu
shimakaze-kun
shimoneta to iu gainen ga sonzai shinai taikutsu na sekai
shin sakura taisen
shingeki no kyojin
shingoku no valhalla gate
shinjou akane
shinomiya kaguya
shinosawa hiro
shiny pokemon
shirahama azusa
shirasaka koume
shirase sakuya
shiratama mikan
shiratori hime
shirobako
shirogane naoto
shirogane noel (casual)
shirogane noel (dirndl)
shirosaki hana
shishiro botan
shizuka rin
shizuka rin (1st costume)
shokugeki no souma
shooty
shou tucker
shounen jump
shueisha
shuma gorath
shyvana
sin nanatsu no taizai
sister of battle
sivir
skull heart
skulltula
slap city
snakai
snapchat
snk
sole survivor
someity
son goku
son goten
sona buvelle
sonic (series)
sonic adventure 2
sonic boom
sonic satam
sonic team
sonic the hedgehog (series)
sonic unleashed
sono bisque doll wa koi wo suru
soos
sophia peronica
sopra amane
sora yori mo tooi basho
soraka
souryuu asuka langley
space invaders
space jam
spider-man
spider-man (series)
spy vs spy
spyro the dragon
ssss.gridman
stacey
stacey forsythe
star butterfly
star guardian poppy
star guardian series
star ocean
star ocean the second story
star sapphire
star vs the forces of evil
star wars
star wars: the clone wars
starcraft 2
starry night
starscourge radahn
steins;gate
sticks the badger
sticks the jungle badger
sticks the tejon
stoneborn
street fighter 6
street fighter ii (series)
street fighter iv (series)
street fighter v
streets of rage
strike witches
studio ghibli
suga natsumi
suiei no ato no shower
suina
summer in mara
summertime render
sunazuka akira
sunny milk
sunny-sue ellen
sunsoft
suou momoko
super mutant
super pochaco
super robot wars
super robot wars og saga mugen no frontier
super sentai
super smash bros.
super sonico
susato mikotoba
suzuhara misae
suzuka hime
suzuka utako
sword art online
sword art online alternative: gun gale online
sylvanas windrunner
tachibana mizuki
taito
takagaki kaede
takagawa sumire
takamaki anne
takamiya rion
takamiya rion (1st costume)
takamiya rion (4th costume)
takanashi kiara
takanashi kiara (1st costume)
takane manaka
takarada rikka
takase miyuki
takayama kate
takayama maria
takemi tae
taki suzuna
takimoto hifumi
tales of (series)
tales of vesperia
tamaki iroha
tanaka mamimi
taneshima popura
tangle the lemur
tangled
tanned cirno
tanooki peach
tanuki peach
tanya degurechaff
tari numenesse
tate no yuusha no nariagari
tayelle ebonclaw
team rainbow rocket grunt
team rocket grunt
team shanghai alice
teenage mutant ninja turtles
tenga
tensei shitara slime datta ken
tensui no sakuna-hime
tera online
terumi mei
tetra
the brady kids
the deadly six
the elder scrolls
the elder scrolls iv: oblivion
the elder scrolls v: skyrim
the great ace attorney
the great ace attorney 2: resolve
the grim adventures of billy & mandy
the grind series
the king of fighters
the king of fighters xv
the legend of korra
the loud house
the ninja warriors once again
the owl house
the ring
the seven deadly sins
the super mario bros. movie
the wind waker
the witcher (series)
the wonderful 101
tiaplate
tifa lockhart
tikoh
tild - mage a louer
tild framith
time bokan
time bokan (series)
tiona hiryute
tione hiryute
to love-ru
to love-ru darkness
toad
toadette
toaru daikazoku no okazu jijou: mamagawari onee-chan funtouki
tobi-kadachi
tobias gregson
todo yurika
todoroki shouto
toga himiko
togruta
tohsaka rin
tojo nozomi
tokage setsuna
tokimeki pink
tokyo houkago summoners
tomb raider
tomoe hotaru
tomoe mami
tongkkangi
tony tony chopper
toon link
toori no fukken
tooru hagakure
tooru hagakure (visible)
toph bei fong
toph beifong
toradora
toriel
totsuzen kaijin ken jimuin no ore ga mahou shoujo-tachi o otosu hanashi
toy hole
tron bonne
tsubabi tempest
tsukagami alice
tsukino mito
tsukino mito (1st costume)
tsukioka kogane
tsunotori pony
tsuujou kougeki ga zentai kougeki de ni-kai kougeki no okaasan wa suki desu ka
twilight princess
ty lee
type-moon
tyr beq
tyrande whisperwind
tzuyin hsieh
u-1196
ubisoft
uchiha sarada
uehara shikanosuke
ultra beast
ultralisk
umanami
unohana retsu
uraraka ochako
urbosa
ursula callistis
uruha rushia
urushibara luka
urushibara ruka
usada pekora (casual)
usagi-san
usopp
uzaki hana
uzaki tsuki
uzaki-chan wa asobitai
uzumaki boruto
uzumaki himawari
uzumaki naruto
v yuusha no kuse ni namaiki da r
valkyrie drive
valkyrie drive -mermaid-
valla
vampy
vanellope von schweetz
vanillaware
vault dweller
vault girl
vault meat
vechy
veigal
veigar
veight
velma dinkley
venera-sama
venus de milo
vermana
vigilante -boku no hero academia: illegals-
vijounne
vincent brooks
viperious
virtual ant channel
visions of mana
vivi ornitier
voiceroid
voicevox
vrchat
waccha primagi
wai-cactusharlot
wakaba megumi
waku waku 7
warhammer 40k
wario
warlock
warwick
watashi ni tenshi ga maiorita
wcdonald's
wednesday addams
wendy corduroy
wendy marvell
whiskey project
white silk
whitefrost dragonewt filene
who framed roger rabbit
wii fit
wii fit trainer
william birkin
willump
wind waker
winry rockbell
witch craft works
witches of africa
wizarding world
wojak
wolf and parchment
wolf link
world of warcraft
world witches series
wreck-it ralph
xaessya
xanthous king jeremiah
xenoblade (series)
xenoblade chronicles (series)
xenogears
xenosaga
xenosaga episode iii
yae miko
yahari ore no seishun lovecome wa machigatteiru.
yakumo ran
yakumo yukari
yamabuki naoko
yamada aoi
yamada asaemon sagiri
yamada ryo
yamagishi fuuka
yamamura sadako
yang xiao long
yano erika
yaoyorozu momo
yazawa nico
yo-kai watch
yoko littner
yokoyama miho
yoru no yatterman
yorumi rena
yoshi
yoshikawa chinatsu
yotsuyu goe brutus
youjo senki
youkai watch
youkai watch jam: youkai gakuen y
your witch alba
yu-gi-oh duel monsters
yukico-tan
yukijirushi
yukinoshita yukino
yukoku kiriko
yumemi riamu
yuna
yurucamp
yuruyuri
yuuhi riri
yuuhi riri (1st costume)
yuuki chihiro
yuuki chihiro (1st costume)
yuuki kei
yuusha no kuse ni namaiki da
yuusha to maou
yuzuki yukari
yuzuruha
zafina
zax magma
zealotus
zeena
zen'in maki
zephyr winds
zerg
zidane tribal
zoku owarimonogatari
zombie land saga
zootopia
zordon
zundamon
cyberpunk 2077
dragon quest iii
kimi no koto ga dai dai dai dai daisuki na 100-nin no kanojo
lobotomy corporation
pikmin
trials of mana
haachaama
lady dimitrescu
lana's sister (pokemon)
red pikmin
pikminred
yellow pikmin
pikminyellow
blue pikmin
pikminblue
scarlet crusade
astolfo (saber)
gerudo set (zelda)
stealth set (zelda)
gaia (mythology)
rosalina (halloween)
rosalina (touring)
`;

//(none is not a real franchise, some floating entries simply do not have a franchise, such as 'cerberus' which is a character name and a proper tag.)
