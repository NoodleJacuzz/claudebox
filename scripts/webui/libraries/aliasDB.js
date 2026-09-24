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
- ==== honeycomb catacombs ====
hc-kn1ght
hc-knight
hcknightv
hcknightc
brienne
brienne (honeycomb catacombs)
brienne (honeycomb dungeon)
brienne (honeycomb)
brienne (honeypot dungeon)
brienne (honeypot)
knight (honeycomb)
knight (honeycomb catacombs)
knight (honeypot)
knight (honeypot dungeon)

hc-l4ncer
hc-lancer
hclancerv
hclancerc
cinder
cinder (honeycomb catacombs)
cinder (honeycomb dungeon)
cinder (honeycomb)
cinder (honeypot dungeon)
cinder (honeypot)
lancer (honeycomb)
lancer (honeycomb catacombs)
lancer (honeypot)
lancer (honeypot dungeon)

hc-n3cro
hc-necro
hcnecrov
hcnecroc
nettle
nettle (honeycomb catacombs)
nettle (honeycomb dungeon)
nettle (honeycomb)
nettle (honeypot dungeon)
nettle (honeypot)
necro (honeycomb)
necro (honeycomb catacombs)
necro (honeypot)
necro (honeypot dungeon)
moss
moss (honeycomb catacombs)
moss (honeycomb dungeon)
moss (honeycomb)
moss (honeypot dungeon)
moss (honeypot)

hc-pr1est
hc-priest
hcpriestv
hcpriestc
clemence
clemence (honeycomb catacombs)
clemence (honeycomb dungeon)
clemence (honeycomb)
clemence (honeypot dungeon)
clemence (honeypot)
priest (honeycomb)
priest (honeycomb catacombs)
priest (honeypot)
priest (honeypot dungeon)

hc-s3er
hc-seer
hcseerv
hcseerc
cassadora
cassadora (honeycomb catacombs)
cassadora (honeycomb dungeon)
cassadora (honeycomb)
cassadora (honeypot dungeon)
cassadora (honeypot)
seer (honeycomb)
seer (honeycomb catacombs)
seer (honeypot)
seer (honeypot dungeon)
wick
wick (honeycomb catacombs)
wick (honeycomb dungeon)
wick (honeycomb)
wick (honeypot dungeon)
wick (honeypot)

hc-v4mp
hc-vamp
hcvampv
hcvampc
severine
severine (honeycomb catacombs)
severine (honeycomb dungeon)
severine (honeycomb)
severine (honeypot dungeon)
severine (honeypot)
vamp (honeycomb)
vamp (honeycomb catacombs)
vamp (honeypot)
vamp (honeypot dungeon)

hc-ch3ss
hc-chess
hc-anastasia
hcchessv
hcchessc
anastasia
anastasia (honeycomb catacombs)
anastasia (honeycomb dungeon)
anastasia (honeycomb)
anastasia (honeypot dungeon)
anastasia (honeypot)
chess (honeycomb)
chess (honeycomb catacombs)
chess (honeypot)
chess (honeypot dungeon)
chessmaster (honeycomb)
chessmaster (honeycomb catacombs)

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
meme kakure (100 kanojo)
meme kakure
kakure meme (100 kanojo)
kakure meme
kakure (100 kanojo)
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
nadeshiko yamato (100 kanojo)
nadeshiko yamato
yamato nadeshiko (100 kanojo)
yamato nadeshiko
yamato (100 kanojo)
nadeshiko (100 kanojo)

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

gekka
gekka (syrup town)
gekka (hentai university)
sy-gekka
syrupgekka
furgekka
fleshygekka

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

gwen tennyson
gwen tennyson (ben 10)
tennyson gwen
tennyson gwen (ben 10)
tennyson (ben 10)
gwen (ben 10)

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

konoe a. mercury
konoe a. mercury (blazblue)

litchi faye ling
litchi faye ling (blazblue)

makoto nanaya
makoto nanaya (blazblue)
nanaya makoto
nanaya makoto (blazblue)
nanaya (blazblue)
makoto (blazblue)

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

ashido mina
ashido mina (boku no hero academia)
mina ashido
mina ashido (boku no hero academia)
mina (boku no hero academia)
ashido (boku no hero academia)

bakugou katsuki
bakugou katsuki (boku no hero academia)
katsuki bakugou
katsuki bakugou (boku no hero academia)
katsuki (boku no hero academia)
bakugou (boku no hero academia)

komori kinoko
komori kinoko (boku no hero academia)
kinoko komori
kinoko komori (boku no hero academia)
kinoko (boku no hero academia)
komori (boku no hero academia)

melissa shield
melissa shield (boku no hero academia)
shield melissa
shield melissa (boku no hero academia)
shield (boku no hero academia)
melissa (boku no hero academia)

midoriya inko
midoriya inko (boku no hero academia)
inko midoriya
inko midoriya (boku no hero academia)
inko (boku no hero academia)

midoriya izuku
midoriya izuku (boku no hero academia)
izuku midoriya
izuku midoriya (boku no hero academia)
izuku (boku no hero academia)
midoriya (boku no hero academia)
izuku midoriya

mineta minoru
mineta minoru (boku no hero academia)
minoru mineta
minoru mineta (boku no hero academia)
minoru (boku no hero academia)
mineta (boku no hero academia)

todoroki shouto
todoroki shouto (boku no hero academia)
shouto todoroki
shouto todoroki (boku no hero academia)
shouto (boku no hero academia)
todoroki (boku no hero academia)

toga himiko
toga himiko (boku no hero academia)
himiko toga
himiko toga (boku no hero academia)
himiko (boku no hero academia)
toga (boku no hero academia)

tokage setsuna
tokage setsuna (boku no hero academia)
setsuna tokage
setsuna tokage (boku no hero academia)
setsuna (boku no hero academia)
tokage (boku no hero academia)

tsunotori pony
tsunotori pony (boku no hero academia)
pony tsunotori
pony tsunotori (boku no hero academia)
pony (boku no hero academia)
tsunotori (boku no hero academia)
pony

uraraka ochako
uraraka ochako (boku no hero academia)
ochako uraraka
ochako uraraka (boku no hero academia)
ochako (boku no hero academia)
uraraka (boku no hero academia)

yaoyorozu momo
yaoyorozu momo (boku no hero academia)
momo yaoyorozu
momo yaoyorozu (boku no hero academia)
momo (boku no hero academia)
yaoyorozu (boku no hero academia)

eri (boku no hero academia)

midnight (boku no hero academia)

ragdoll (boku no hero academia)

- ==== bombergirl ====

lewisia aquablue
lewisia aquablue (bombergirl)
aquablue lewisia
aquablue lewisia (bombergirl)
aquablue (bombergirl)
lewisia (bombergirl)

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

daidouji tomoyo
daidouji tomoyo (cardcaptor sakura)
tomoyo daidouji
tomoyo daidouji (cardcaptor sakura)
tomoyo (cardcaptor sakura)
daidouji (cardcaptor sakura)

kinomoto sakura
kinomoto sakura (cardcaptor sakura)
sakura kinomoto
sakura kinomoto (cardcaptor sakura)
sakura (cardcaptor sakura)
kinomoto (cardcaptor sakura)

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

ralsei
ralsei (deltarune)

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

fujieda yoshino
fujieda yoshino (digimon)
yoshino fujieda
yoshino fujieda (digimon)
yoshino (digimon)
fujieda (digimon)

renamon (digimon)
.digimonrenamon
.renamon
digimonrenamon

- ==== disgaea ====

laharl
laharl (disgaea)

pleinair
pleinair (disgaea)

rozalin
rozalin (disgaea)

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

android 18
android 18 (dragon ball)
18 android
18 android (dragon ball)
18 (dragon ball)
android (dragon ball)

bulma
bulma (dragon ball)

muten roushi
muten roushi (dragon ball)
roushi muten
roushi muten (dragon ball)
roushi (dragon ball)
muten (dragon ball)

son goku
son goku (dragon ball)
goku son
goku son (dragon ball)
goku (dragon ball)

son goten
son goten (dragon ball)
goten son
goten son (dragon ball)
goten (dragon ball)

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

seria kirmin
seria kirmin (dungeon and fighter)
kirmin seria
kirmin seria (dungeon and fighter)
kirmin (dungeon and fighter)
seria (dungeon and fighter)

female fighter (dungeon and fighter)

female mage (dungeon and fighter)

female striker (dungeon and fighter)

knight (dungeon and fighter)

- ==== dungeon meshi ====

falin touden
falin touden (dungeon meshi)
touden falin
touden falin (dungeon meshi)
touden (dungeon meshi)
falin (dungeon meshi)

inutade
inutade (dungeon meshi)

izutsumi
izutsumi (dungeon meshi)

marcille donato
marcille donato (dungeon meshi)
donato marcille
donato marcille (dungeon meshi)
donato (dungeon meshi)
marcille (dungeon meshi)

walking mushroom (dungeon meshi)

- ==== echolocaution ====

hina (echolocaution)

mom (echolocaution)

- ==== eiyuu senki ====

dante alighieri (eiyuu senki)

- ==== elden ring ====

blaidd the half-wolf
blaidd the half-wolf (elden ring)

malenia blade of miquella
malenia blade of miquella (elden ring)

starscourge radahn
starscourge radahn (elden ring)
radahn starscourge
radahn starscourge (elden ring)
radahn (elden ring)
starscourge (elden ring)

melina (elden ring)

miquella
miquella (elden ring)

tarnished (elden ring)

ranni the witch
ranni the witch (elden ring)
ranni (elden ring)

- ==== en'en no shouboutai ====

maki oze
maki oze (en'en no shouboutai)
oze maki
oze maki (en'en no shouboutai)
oze (en'en no shouboutai)
maki (en'en no shouboutai)

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

adelbert steiner
adelbert steiner (final fantasy)
steiner adelbert
steiner adelbert (final fantasy)
steiner (final fantasy)
adelbert (final fantasy)

angelise reiter
angelise reiter (final fantasy)
reiter angelise
reiter angelise (final fantasy)
reiter (final fantasy)
angelise (final fantasy)

ashelia b'nargin dalmasca
ashelia b'nargin dalmasca (final fantasy)

cloud strife
cloud strife (final fantasy)
strife cloud
strife cloud (final fantasy)
strife (final fantasy)
cloud (final fantasy)

eiko carol
eiko carol (final fantasy)
carol eiko
carol eiko (final fantasy)
carol (final fantasy)
eiko (final fantasy)

feo ul
feo ul (final fantasy)
ul feo
ul feo (final fantasy)
ul (final fantasy)
feo (final fantasy)

kuja
kuja (final fantasy)

lunafreya nox fleuret
lunafreya nox fleuret (final fantasy)

noctis lucis caelum
noctis lucis caelum (final fantasy)

penelo
penelo (final fantasy)

rinoa heartilly
rinoa heartilly (final fantasy)
heartilly rinoa
heartilly rinoa (final fantasy)
heartilly (final fantasy)
rinoa (final fantasy)

sabrith ebonclaw
sabrith ebonclaw (final fantasy)
ebonclaw sabrith
ebonclaw sabrith (final fantasy)
sabrith (final fantasy)

sephiroth
sephiroth (final fantasy)

serah farron
serah farron (final fantasy)
farron serah
farron serah (final fantasy)
farron (final fantasy)
serah (final fantasy)

tayelle ebonclaw
tayelle ebonclaw (final fantasy)
ebonclaw tayelle
ebonclaw tayelle (final fantasy)
tayelle (final fantasy)

tifa lockhart
tifa lockhart (final fantasy)
lockhart tifa
lockhart tifa (final fantasy)
lockhart (final fantasy)
tifa (final fantasy)

vivi ornitier
vivi ornitier (final fantasy)
ornitier vivi
ornitier vivi (final fantasy)
ornitier (final fantasy)
vivi (final fantasy)

yotsuyu goe brutus
yotsuyu goe brutus (final fantasy)

zax magma
zax magma (final fantasy)
magma zax
magma zax (final fantasy)
magma (final fantasy)
zax (final fantasy)

zidane tribal
zidane tribal (final fantasy)
tribal zidane
tribal zidane (final fantasy)
tribal (final fantasy)
zidane (final fantasy)

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

- ==== fire emblem ====

bernadetta von varley
bernadetta von varley (fire emblem)

dorothea arnault
dorothea arnault (fire emblem)
arnault dorothea
arnault dorothea (fire emblem)
arnault (fire emblem)
dorothea (fire emblem)

hilda valentine goneril
hilda valentine goneril (fire emblem)

lysithea von ordelia
lysithea von ordelia (fire emblem)

marianne von edmund
marianne von edmund (fire emblem)

sanaki kirsch altina
sanaki kirsch altina (fire emblem)

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

sangonomiya kokomi
sangonomiya kokomi (genshin impact)
kokomi sangonomiya
kokomi sangonomiya (genshin impact)
kokomi (genshin impact)
sangonomiya (genshin impact)

yae miko
yae miko (genshin impact)
miko yae
miko yae (genshin impact)
miko (genshin impact)
yae (genshin impact)

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

danua
danua (granblue fantasy)

godsworn alexiel
godsworn alexiel (granblue fantasy)
alexiel godsworn
alexiel godsworn (granblue fantasy)
alexiel (granblue fantasy)
godsworn (granblue fantasy)

korwa
korwa (granblue fantasy)

tikoh
tikoh (granblue fantasy)

vampy
vampy (granblue fantasy)

veight
veight (granblue fantasy)

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

elphelt valentine
elphelt valentine (guilty gear)
valentine elphelt
valentine elphelt (guilty gear)
elphelt (guilty gear)

jack-o' valentine
jack-o' valentine (guilty gear)
valentine jack-o'
valentine jack-o' (guilty gear)
jack-o' (guilty gear)

kuradoberi jam
kuradoberi jam (guilty gear)
jam kuradoberi
jam kuradoberi (guilty gear)
jam (guilty gear)
kuradoberi (guilty gear)

ramlethal valentine
ramlethal valentine (guilty gear)
valentine ramlethal
valentine ramlethal (guilty gear)
ramlethal (guilty gear)
ramlethal valentine (guilty gear)
.ggramlethal
.ramlethal
ggramlethal

baiken (guilty gear)
.ggbaiken
baiken
ggbaiken

bridget (guilty gear)
.ggbridget
bridget
ggbridget

dizzy (guilty gear)

giovanna (guilty gear)

may (guilty gear)

- ==== hanabi ====

shimizu yuki (hanabi)

- ==== happy tree friends ====

handy (happy tree friends)

- ==== hataraku saibou ====

ae-3803
ae-3803 (hataraku saibou)

u-1196
u-1196 (hataraku saibou)

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

kazama iroha
kazama iroha (hololive)
iroha kazama
iroha kazama (hololive)
iroha (hololive)
kazama (hololive)
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

la+ darknesss
la+ darknesss (hololive)
darknesss la+
darknesss la+ (hololive)
darknesss (hololive)
la+ (hololive)
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

mano aloe
mano aloe (hololive)
aloe mano
aloe mano (hololive)
aloe (hololive)
mano (hololive)

natsuiro matsuri
natsuiro matsuri (hololive)
matsuri natsuiro
matsuri natsuiro (hololive)
matsuri (hololive)
natsuiro (hololive)
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

uruha rushia
uruha rushia (hololive)
rushia uruha
rushia uruha (hololive)
rushia (hololive)
uruha (hololive)

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
hoshimachi suisei
hoshimachi suisei (hololive)
suisei hoshimachi
suisei hoshimachi (hololive)
suisei (hololive)
hoshimachi (hololive)

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

killua zoldyck
killua zoldyck (hunter x hunter)
zoldyck killua
zoldyck killua (hunter x hunter)
zoldyck (hunter x hunter)
killua (hunter x hunter)

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

akagi miria
akagi miria (idolmaster)
miria akagi
miria akagi (idolmaster)
miria (idolmaster)
akagi (idolmaster)

akizuki ritsuko
akizuki ritsuko (idolmaster)
ritsuko akizuki
ritsuko akizuki (idolmaster)
ritsuko (idolmaster)
akizuki (idolmaster)

amami haruka
amami haruka (idolmaster)
haruka amami
haruka amami (idolmaster)
haruka (idolmaster)
amami (idolmaster)

executive mishiro
executive mishiro (idolmaster)
mishiro executive
mishiro executive (idolmaster)
mishiro (idolmaster)
executive (idolmaster)

futaba anzu
futaba anzu (idolmaster)
anzu futaba
anzu futaba (idolmaster)
anzu (idolmaster)
futaba (idolmaster)

futami mami
futami mami (idolmaster)
mami futami
mami futami (idolmaster)
mami (idolmaster)
futami (idolmaster)

hakozaki serika
hakozaki serika (idolmaster)
serika hakozaki
serika hakozaki (idolmaster)
serika (idolmaster)
hakozaki (idolmaster)

hayami kanade
hayami kanade (idolmaster)
kanade hayami
kanade hayami (idolmaster)
kanade (idolmaster)
hayami (idolmaster)

ichihara nina
ichihara nina (idolmaster)
nina ichihara
nina ichihara (idolmaster)
nina (idolmaster)
ichihara (idolmaster)

ichinose shiki
ichinose shiki (idolmaster)
shiki ichinose
shiki ichinose (idolmaster)
shiki (idolmaster)
ichinose (idolmaster)

jougasaki mika
jougasaki mika (idolmaster)
mika jougasaki
mika jougasaki (idolmaster)
mika (idolmaster)
jougasaki (idolmaster)

jougasaki rika
jougasaki rika (idolmaster)
rika jougasaki
rika jougasaki (idolmaster)
rika (idolmaster)
jougasaki (idolmaster)
rika

katagiri sanae
katagiri sanae (idolmaster)
sanae katagiri
sanae katagiri (idolmaster)
sanae (idolmaster)
katagiri (idolmaster)

kazano hiori
kazano hiori (idolmaster)
hiori kazano
hiori kazano (idolmaster)
hiori (idolmaster)
kazano (idolmaster)

komiya kaho
komiya kaho (idolmaster)
kaho komiya
kaho komiya (idolmaster)
kaho (idolmaster)
komiya (idolmaster)

kuwayama chiyuki
kuwayama chiyuki (idolmaster)
chiyuki kuwayama
chiyuki kuwayama (idolmaster)
chiyuki (idolmaster)
kuwayama (idolmaster)

matoba risa
matoba risa (idolmaster)
risa matoba
risa matoba (idolmaster)
risa (idolmaster)
matoba (idolmaster)

matsumoto sarina
matsumoto sarina (idolmaster)
sarina matsumoto
sarina matsumoto (idolmaster)
sarina (idolmaster)
matsumoto (idolmaster)

matsuo chizuru
matsuo chizuru (idolmaster)
chizuru matsuo
chizuru matsuo (idolmaster)
chizuru (idolmaster)
matsuo (idolmaster)

mizuno midori
mizuno midori (idolmaster)
midori mizuno
midori mizuno (idolmaster)
midori (idolmaster)
mizuno (idolmaster)

mizushima saki
mizushima saki (idolmaster)
saki mizushima
saki mizushima (idolmaster)
saki (idolmaster)
mizushima (idolmaster)

morino rinze
morino rinze (idolmaster)
rinze morino
rinze morino (idolmaster)
rinze (idolmaster)
morino (idolmaster)

moroboshi kirari
moroboshi kirari (idolmaster)
kirari moroboshi
kirari moroboshi (idolmaster)
kirari (idolmaster)
moroboshi (idolmaster)

mukai takumi
mukai takumi (idolmaster)
takumi mukai
takumi mukai (idolmaster)
takumi (idolmaster)
mukai (idolmaster)

munakata atsumi
munakata atsumi (idolmaster)
atsumi munakata
atsumi munakata (idolmaster)
atsumi (idolmaster)
munakata (idolmaster)

nakatani iku
nakatani iku (idolmaster)
iku nakatani
iku nakatani (idolmaster)
iku (idolmaster)
nakatani (idolmaster)

ogami tamaki
ogami tamaki (idolmaster)
tamaki ogami
tamaki ogami (idolmaster)
tamaki (idolmaster)
ogami (idolmaster)

oikawa shizuku
oikawa shizuku (idolmaster)
shizuku oikawa
shizuku oikawa (idolmaster)
shizuku (idolmaster)
oikawa (idolmaster)

sajo yukimi
sajo yukimi (idolmaster)
yukimi sajo
yukimi sajo (idolmaster)
yukimi (idolmaster)
sajo (idolmaster)

sakuragi mano
sakuragi mano (idolmaster)
mano sakuragi
mano sakuragi (idolmaster)
mano (idolmaster)
sakuragi (idolmaster)

sakurai momoka
sakurai momoka (idolmaster)
momoka sakurai
momoka sakurai (idolmaster)
momoka (idolmaster)
sakurai (idolmaster)

sasaki chie
sasaki chie (idolmaster)
chie sasaki
chie sasaki (idolmaster)
chie (idolmaster)
sasaki (idolmaster)

sato shin
sato shin (idolmaster)
shin sato
shin sato (idolmaster)
shin (idolmaster)
sato (idolmaster)

shirasaka koume
shirasaka koume (idolmaster)
koume shirasaka
koume shirasaka (idolmaster)
koume (idolmaster)
shirasaka (idolmaster)

shirase sakuya
shirase sakuya (idolmaster)
sakuya shirase
sakuya shirase (idolmaster)
sakuya (idolmaster)
shirase (idolmaster)

sunazuka akira
sunazuka akira (idolmaster)
akira sunazuka
akira sunazuka (idolmaster)
akira (idolmaster)
sunazuka (idolmaster)

suou momoko
suou momoko (idolmaster)
momoko suou
momoko suou (idolmaster)
momoko (idolmaster)
suou (idolmaster)

takagaki kaede
takagaki kaede (idolmaster)
kaede takagaki
kaede takagaki (idolmaster)
kaede (idolmaster)
takagaki (idolmaster)

tanaka mamimi
tanaka mamimi (idolmaster)
mamimi tanaka
mamimi tanaka (idolmaster)
mamimi (idolmaster)
tanaka (idolmaster)

tsukioka kogane
tsukioka kogane (idolmaster)
kogane tsukioka
kogane tsukioka (idolmaster)
kogane (idolmaster)
tsukioka (idolmaster)

yukoku kiriko
yukoku kiriko (idolmaster)
kiriko yukoku
kiriko yukoku (idolmaster)
kiriko (idolmaster)
yukoku (idolmaster)

yumemi riamu
yumemi riamu (idolmaster)
riamu yumemi
riamu yumemi (idolmaster)
riamu (idolmaster)
yumemi (idolmaster)

leon (idolmaster)

producer (idolmaster)

- ==== ignitedyam ====

lin (ignitedyam)

- ==== illya ====

dangerous beast (illya)

- ==== inuyasha ====

kohaku (inuyasha)

- ==== ishuzoku reviewers ====

crimvael
crimvael (ishuzoku reviewers)

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

getou suguru
getou suguru (jujutsu kaisen)
suguru getou
suguru getou (jujutsu kaisen)
suguru (jujutsu kaisen)
getou (jujutsu kaisen)

itadori yuuji
itadori yuuji (jujutsu kaisen)
yuuji itadori
yuuji itadori (jujutsu kaisen)
yuuji (jujutsu kaisen)
itadori (jujutsu kaisen)

kugisaki nobara
kugisaki nobara (jujutsu kaisen)
nobara kugisaki
nobara kugisaki (jujutsu kaisen)
nobara (jujutsu kaisen)
kugisaki (jujutsu kaisen)

zen'in maki
zen'in maki (jujutsu kaisen)
maki zen'in
maki zen'in (jujutsu kaisen)
maki (jujutsu kaisen)
zen'in (jujutsu kaisen)

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

junketsu
junketsu (kill la kill)

kiryuuin satsuki
kiryuuin satsuki (kill la kill)
satsuki kiryuuin
satsuki kiryuuin (kill la kill)
satsuki (kill la kill)
kiryuuin (kill la kill)
kiryuin satsuki (kill la kill)
kiryuin satsuki
kiryuuin satsuki (kill la kill)
.klksatsuki
klksatsuki

mankanshoku mako
mankanshoku mako (kill la kill)
mako mankanshoku
mako mankanshoku (kill la kill)
mako (kill la kill)
mankanshoku (kill la kill)
.klkmako
klkmako

jakuzure nonon (kill la kill)
jakuzure nonon
.klknonon
klknonon

matoi ryuuko (kill la kill)
.klkryuko
matoi ryuuko
klkryuko

senketsu (kill la kill)
senketsu

- ==== kingbang ====

freyja (kingbang)

- ==== kingdom hearts ====

anti-aqua
anti-aqua (kingdom hearts)

aqua (kingdom hearts)

vanitas (kingdom hearts)

- ==== kof ====

shermie (kof)

- ==== komi-san wa komyushou desu ====

manbagi rumiko
manbagi rumiko (komi-san wa komyushou desu)
rumiko manbagi
rumiko manbagi (komi-san wa komyushou desu)
rumiko (komi-san wa komyushou desu)
manbagi (komi-san wa komyushou desu)

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

cerestia of life
cerestia of life (last origin)

dark elven forest ranger
dark elven forest ranger (last origin)

elven forest maker
elven forest maker (last origin)

indomitable marie
indomitable marie (last origin)
marie indomitable
marie indomitable (last origin)
marie (last origin)
indomitable (last origin)

lemonade alpha
lemonade alpha (last origin)
alpha lemonade
alpha lemonade (last origin)
alpha (last origin)
lemonade (last origin)

prototype labiata
prototype labiata (last origin)
labiata prototype
labiata prototype (last origin)

labiata (last origin)

sekhmet of death
sekhmet of death (last origin)

black wyrm (last origin)

brownie (last origin)

cerberus (last origin)

commander (last origin)

draculina (last origin)
draculina (micro bikini) (last origin)

invincible dragon (last origin)

mari (last origin)

orangeade (last origin)

perrault (last origin)

poi (last origin)

- ==== league of legends ====

akali
akali (league of legends)
akali (lol)

arcade miss fortune
arcade miss fortune (league of legends)

nasus
nasus (league of legends)

nidalee
nidalee (league of legends)

pizza delivery sivir
pizza delivery sivir (league of legends)

renekton
renekton (league of legends)

shyvana
shyvana (league of legends)

sivir
sivir (league of legends)

star guardian poppy
star guardian poppy (league of legends)

veigar
veigar (league of legends)

warwick
warwick (league of legends)

willump
willump (league of legends)

ahri (league of legends)
ahri (lol)
ahri

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

faputa
faputa (made in abyss)

maaa
maaa (made in abyss)

maruruk
maruruk (made in abyss)

ozen
ozen (made in abyss)

prushka
prushka (made in abyss)

mitty (made in abyss)

nanachi (made in abyss)
nanachi

reg (made in abyss)
reg

riko (made in abyss)
riko

- ==== mahou shoujo ni akogarete ====

araga kiwi
araga kiwi (mahou shoujo ni akogarete)
kiwi araga
kiwi araga (mahou shoujo ni akogarete)
kiwi (mahou shoujo ni akogarete)
araga (mahou shoujo ni akogarete)

hiiragi utena
hiiragi utena (mahou shoujo ni akogarete)
utena hiiragi
utena hiiragi (mahou shoujo ni akogarete)
utena (mahou shoujo ni akogarete)
hiiragi (mahou shoujo ni akogarete)

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

akamatsu yui
akamatsu yui (mitsuboshi colors)
yui akamatsu
yui akamatsu (mitsuboshi colors)
yui (mitsuboshi colors)
akamatsu (mitsuboshi colors)

kise saki
kise saki (mitsuboshi colors)
saki kise
saki kise (mitsuboshi colors)
saki (mitsuboshi colors)
kise (mitsuboshi colors)

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

aia amare
aia amare (nijisanji)
amare aia
amare aia (nijisanji)
amare (nijisanji)
aia (nijisanji)

akabane youko
akabane youko (nijisanji)
youko akabane
youko akabane (nijisanji)
youko (nijisanji)
akabane (nijisanji)

ange katrina
ange katrina (nijisanji)
katrina ange
katrina ange (nijisanji)
katrina (nijisanji)
ange (nijisanji)

elira pendora
elira pendora (nijisanji)
pendora elira
pendora elira (nijisanji)
pendora (nijisanji)
elira (nijisanji)

finana ryugu
finana ryugu (nijisanji)
ryugu finana
ryugu finana (nijisanji)
ryugu (nijisanji)
finana (nijisanji)

gundou mirei
gundou mirei (nijisanji)
mirei gundou
mirei gundou (nijisanji)
mirei (nijisanji)
gundou (nijisanji)

hakase fuyuki
hakase fuyuki (nijisanji)
fuyuki hakase
fuyuki hakase (nijisanji)
fuyuki (nijisanji)
hakase (nijisanji)

higuchi kaede
higuchi kaede (nijisanji)
kaede higuchi
kaede higuchi (nijisanji)
kaede (nijisanji)
higuchi (nijisanji)

honma himawari
honma himawari (nijisanji)
himawari honma
himawari honma (nijisanji)
himawari (nijisanji)
honma (nijisanji)

hoshikawa sara
hoshikawa sara (nijisanji)
sara hoshikawa
sara hoshikawa (nijisanji)
sara (nijisanji)
hoshikawa (nijisanji)

hyakumantenbara salome
hyakumantenbara salome (nijisanji)
salome hyakumantenbara
salome hyakumantenbara (nijisanji)
salome (nijisanji)
hyakumantenbara (nijisanji)

inui toko
inui toko (nijisanji)
toko inui
toko inui (nijisanji)
toko (nijisanji)
inui (nijisanji)

kitakoji hisui
kitakoji hisui (nijisanji)
hisui kitakoji
hisui kitakoji (nijisanji)
hisui (nijisanji)
kitakoji (nijisanji)

lize helesta
lize helesta (nijisanji)
helesta lize
helesta lize (nijisanji)
helesta (nijisanji)
lize (nijisanji)

makaino ririmu
makaino ririmu (nijisanji)
ririmu makaino
ririmu makaino (nijisanji)
ririmu (nijisanji)
makaino (nijisanji)

makaino ririmu (4th costume)
ririmu makaino
ririmu makaino (nijisanji)
ririmu (nijisanji)
makaino (nijisanji)

millie parfait
millie parfait (nijisanji)
parfait millie
parfait millie (nijisanji)
parfait (nijisanji)
millie (nijisanji)

nui sociere
nui sociere (nijisanji)
sociere nui
sociere nui (nijisanji)
sociere (nijisanji)
nui (nijisanji)

pomu rainpuff
pomu rainpuff (nijisanji)
rainpuff pomu
rainpuff pomu (nijisanji)
rainpuff (nijisanji)
pomu (nijisanji)

rindou mikoto
rindou mikoto (nijisanji)
mikoto rindou
mikoto rindou (nijisanji)
mikoto (nijisanji)
rindou (nijisanji)

sasaki saku
sasaki saku (nijisanji)
saku sasaki
saku sasaki (nijisanji)
saku (nijisanji)
sasaki (nijisanji)

selen tatsuki
selen tatsuki (nijisanji)
tatsuki selen
tatsuki selen (nijisanji)
tatsuki (nijisanji)
selen (nijisanji)

shiina yuika
shiina yuika (nijisanji)
yuika shiina
yuika shiina (nijisanji)
yuika (nijisanji)
shiina (nijisanji)

shizuka rin
shizuka rin (nijisanji)
rin shizuka
rin shizuka (nijisanji)
rin (nijisanji)
shizuka (nijisanji)

suzuka utako
suzuka utako (nijisanji)
utako suzuka
utako suzuka (nijisanji)
utako (nijisanji)
suzuka (nijisanji)

takamiya rion
takamiya rion (nijisanji)
rion takamiya
rion takamiya (nijisanji)
rion (nijisanji)
takamiya (nijisanji)

tsukino mito
tsukino mito (nijisanji)
mito tsukino
mito tsukino (nijisanji)
mito (nijisanji)
tsukino (nijisanji)

yorumi rena
yorumi rena (nijisanji)
rena yorumi
rena yorumi (nijisanji)
rena (nijisanji)
yorumi (nijisanji)

yuuhi riri
yuuhi riri (nijisanji)
riri yuuhi
riri yuuhi (nijisanji)
riri (nijisanji)
yuuhi (nijisanji)

yuuki chihiro
yuuki chihiro (nijisanji)
chihiro yuuki
chihiro yuuki (nijisanji)
chihiro (nijisanji)
yuuki (nijisanji)

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

kongiku
kongiku (oboro muramasa)

yuzuruha
yuzuruha (oboro muramasa)

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

monkey d. luffy
monkey d. luffy (one piece)

nefertari vivi
nefertari vivi (one piece)
vivi nefertari
vivi nefertari (one piece)
vivi (one piece)
nefertari (one piece)
.vivi
onepiecevivi

tony tony chopper
tony tony chopper (one piece)

usopp
usopp (one piece)

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

ash ketchum
ash ketchum (pokemon)
ketchum ash
ketchum ash (pokemon)
ash (pokemon)

delia ketchum
delia ketchum (pokemon)
ketchum delia
ketchum delia (pokemon)
delia (pokemon)

mr. mime
mr. mime (pokemon)
mime mr.
mime mr. (pokemon)
mime (pokemon)
mr. (pokemon)

nidoran
nidoran (pokemon)

paldea mother
paldea mother (pokemon)
mother paldea
mother paldea (pokemon)
paldea (pokemon)

rotom phone
rotom phone (pokemon)
phone rotom
phone rotom (pokemon)

team rainbow rocket grunt
team rainbow rocket grunt (pokemon)

team rocket grunt
team rocket grunt (pokemon)

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

cure black
cure black (precure)
black cure
black cure (precure)
black (precure)
cure (precure)

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

arle nadja
arle nadja (puyopuyo)
nadja arle
nadja arle (puyopuyo)
nadja (puyopuyo)
arle (puyopuyo)

draco centauros
draco centauros (puyopuyo)
centauros draco
centauros draco (puyopuyo)
centauros (puyopuyo)
draco (puyopuyo)

carbuncle (puyopuyo)

- ==== ragnarok online ====

zealotus
zealotus (ragnarok online)

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

bela dimitrescu
bela dimitrescu (resident evil)
dimitrescu bela
dimitrescu bela (resident evil)

cassandra dimitrescu
cassandra dimitrescu (resident evil)
dimitrescu cassandra
dimitrescu cassandra (resident evil)

chris redfield
chris redfield (resident evil)
redfield chris
redfield chris (resident evil)
redfield (resident evil)
chris (resident evil)

ethan winters
ethan winters (resident evil)
winters ethan
winters ethan (resident evil)
winters (resident evil)
ethan (resident evil)

leon s. kennedy
leon s. kennedy (resident evil)

rebecca chambers
rebecca chambers (resident evil)
chambers rebecca
chambers rebecca (resident evil)
chambers (resident evil)
rebecca (resident evil)

sherry birkin
sherry birkin (resident evil)
birkin sherry
birkin sherry (resident evil)
birkin (resident evil)
sherry (resident evil)

ada wong (resident evil)
ada wong
.resiada
.ada
resiada

alcina dimitrescu (resident evil)
alcina dimitrescu
dimitrescu alcina
dimitrescu alcina (resident evil)
alcina (resident evil)
dimitrescu (resident evil)
dimitrescu
lady dimitrescu
lady dimitrescu (resident evil)
lady d (resident evil)
lady d

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

yang xiao long
yang xiao long (rwby)

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

majikina mina
majikina mina (samurai spirits)
mina majikina
mina majikina (samurai spirits)
mina (samurai spirits)
majikina (samurai spirits)

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

black egrets
black egrets (skullgirls)
egrets black
egrets black (skullgirls)
egrets (skullgirls)
black (skullgirls)

skull heart
skull heart (skullgirls)
heart skull
heart skull (skullgirls)
heart (skullgirls)
skull (skullgirls)

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
.inkling
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
.octoling
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

sarah kerrigan
sarah kerrigan (starcraft)
kerrigan sarah
kerrigan sarah (starcraft)
kerrigan (starcraft)
sarah (starcraft)

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

chun-li
chun-li (street fighter)

crimson viper
crimson viper (street fighter)
viper crimson
viper crimson (street fighter)
viper (street fighter)
crimson (street fighter)

han juri
han juri (street fighter)
juri han
juri han (street fighter)
juri (street fighter)
han (street fighter)

kanzuki karin
kanzuki karin (street fighter)
karin kanzuki
karin kanzuki (street fighter)
karin (street fighter)
kanzuki (street fighter)

kasugano sakura
kasugano sakura (street fighter)
sakura kasugano
sakura kasugano (street fighter)
sakura (street fighter)
kasugano (street fighter)

ken masters
ken masters (street fighter)
masters ken
masters ken (street fighter)
masters (street fighter)
ken (street fighter)

kolin
kolin (street fighter)

laura matsuda
laura matsuda (street fighter)
matsuda laura
matsuda laura (street fighter)
matsuda (street fighter)
laura (street fighter)

rainbow mika
rainbow mika (street fighter)
mika rainbow
mika rainbow (street fighter)
mika (street fighter)
rainbow (street fighter)

cammy white (street fighter)
cammy white

elena (street fighter)

falke (street fighter)

female seth (street fighter)
female seth

ibuki (street fighter)

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

kuze shizuka
kuze shizuka (takopii no genzai)
shizuka kuze
shizuka kuze (takopii no genzai)
shizuka (takopii no genzai)
kuze (takopii no genzai)

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

anna williams
anna williams (tekken)
williams anna
williams anna (tekken)
anna (tekken)

christie monteiro
christie monteiro (tekken)
monteiro christie
monteiro christie (tekken)
monteiro (tekken)
christie (tekken)

julia chang
julia chang (tekken)
chang julia
chang julia (tekken)
chang (tekken)
julia (tekken)

katarina alves
katarina alves (tekken)
alves katarina
alves katarina (tekken)
alves (tekken)
katarina (tekken)

kazama asuka
kazama asuka (tekken)
asuka kazama
asuka kazama (tekken)
asuka (tekken)

kazama jun
kazama jun (tekken)
jun kazama
jun kazama (tekken)
jun (tekken)

lidia sobieska
lidia sobieska (tekken)
sobieska lidia
sobieska lidia (tekken)
sobieska (tekken)
lidia (tekken)

ling xiaoyu
ling xiaoyu (tekken)
xiaoyu ling
xiaoyu ling (tekken)
xiaoyu (tekken)
ling (tekken)

lucky chloe
lucky chloe (tekken)
chloe lucky
chloe lucky (tekken)
chloe (tekken)
lucky (tekken)

nina williams
nina williams (tekken)
williams nina
williams nina (tekken)
nina (tekken)

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

suga natsumi
suga natsumi (tenki no ko)
natsumi suga
natsumi suga (tenki no ko)
natsumi (tenki no ko)
suga (tenki no ko)

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

ashley graves
ashley graves (the coffin of andy and leyley)
graves ashley
graves ashley (the coffin of andy and leyley)
graves (the coffin of andy and leyley)
ashley (the coffin of andy and leyley)

andrew graves (the coffin of andy and leyley)

- ==== the last guardian ====

the boy (the last guardian)

- ==== the legend of zelda ====

aryll
aryll (the legend of zelda)

bokoblin
bokoblin (the legend of zelda)

epona
epona (the legend of zelda)

ezlo
ezlo (the legend of zelda)

ganondorf
ganondorf (the legend of zelda)

korok
korok (the legend of zelda)

linkle
linkle (the legend of zelda)

lynel
lynel (the legend of zelda)

malon
malon (the legend of zelda)

medli
medli (the legend of zelda)

moblin
moblin (the legend of zelda)

navi
navi (the legend of zelda)

princess ruto
princess ruto (the legend of zelda)
ruto princess
ruto princess (the legend of zelda)
ruto (the legend of zelda)
princess (the legend of zelda)

purah
purah (the legend of zelda)

tetra
tetra (the legend of zelda)

toon link
toon link (the legend of zelda)
link toon
link toon (the legend of zelda)
toon (the legend of zelda)

urbosa
urbosa (the legend of zelda)

wolf link
wolf link (the legend of zelda)
link wolf
link wolf (the legend of zelda)
wolf (the legend of zelda)

fi (the legend of zelda)
fi (zelda)

link
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

alice margatroid
alice margatroid (touhou)
margatroid alice
margatroid alice (touhou)
margatroid (touhou)
alice (touhou)

chen
chen (touhou)

cirno
cirno (touhou)

evil eye sigma
evil eye sigma (touhou)

flandre scarlet
flandre scarlet (touhou)
scarlet flandre
scarlet flandre (touhou)
flandre (touhou)

fujiwara no mokou
fujiwara no mokou (touhou)

hinanawi tenshi
hinanawi tenshi (touhou)
tenshi hinanawi
tenshi hinanawi (touhou)
tenshi (touhou)
hinanawi (touhou)

hong meiling
hong meiling (touhou)
meiling hong
meiling hong (touhou)
meiling (touhou)
hong (touhou)

hoshiguma yuugi
hoshiguma yuugi (touhou)
yuugi hoshiguma
yuugi hoshiguma (touhou)
yuugi (touhou)
hoshiguma (touhou)

ibuki suika
ibuki suika (touhou)
suika ibuki
suika ibuki (touhou)
suika (touhou)
ibuki (touhou)

inaba tewi
inaba tewi (touhou)
tewi inaba
tewi inaba (touhou)
tewi (touhou)
inaba (touhou)

izayoi sakuya
izayoi sakuya (touhou)
sakuya izayoi
sakuya izayoi (touhou)
sakuya (touhou)
izayoi (touhou)

kamishirasawa keine
kamishirasawa keine (touhou)
keine kamishirasawa
keine kamishirasawa (touhou)
keine (touhou)
kamishirasawa (touhou)

kawashiro nitori
kawashiro nitori (touhou)
nitori kawashiro
nitori kawashiro (touhou)
nitori (touhou)
kawashiro (touhou)

kazami yuuka
kazami yuuka (touhou)
yuuka kazami
yuuka kazami (touhou)
yuuka (touhou)
kazami (touhou)

kirisame marisa
kirisame marisa (touhou)
marisa kirisame
marisa kirisame (touhou)
marisa (touhou)
kirisame (touhou)

kochiya sanae
kochiya sanae (touhou)
sanae kochiya
sanae kochiya (touhou)
sanae (touhou)
kochiya (touhou)

luna child
luna child (touhou)
child luna
child luna (touhou)
child (touhou)
luna (touhou)

morichika rinnosuke
morichika rinnosuke (touhou)
rinnosuke morichika
rinnosuke morichika (touhou)
rinnosuke (touhou)
morichika (touhou)

moriya suwako
moriya suwako (touhou)
suwako moriya
suwako moriya (touhou)
suwako (touhou)
moriya (touhou)

okazaki yumemi
okazaki yumemi (touhou)
yumemi okazaki
yumemi okazaki (touhou)
yumemi (touhou)
okazaki (touhou)

patchouli knowledge
patchouli knowledge (touhou)
knowledge patchouli
knowledge patchouli (touhou)
knowledge (touhou)
patchouli (touhou)

reisen udongein inaba
reisen udongein inaba (touhou)

reiuji utsuho
reiuji utsuho (touhou)
utsuho reiuji
utsuho reiuji (touhou)
utsuho (touhou)
reiuji (touhou)

remilia scarlet
remilia scarlet (touhou)
scarlet remilia
scarlet remilia (touhou)
remilia (touhou)

rumia
rumia (touhou)

sendai hakurei no miko
sendai hakurei no miko (touhou)

shameimaru aya
shameimaru aya (touhou)
aya shameimaru
aya shameimaru (touhou)
aya (touhou)
shameimaru (touhou)

star sapphire
star sapphire (touhou)
sapphire star
sapphire star (touhou)
sapphire (touhou)
star (touhou)

sunny milk
sunny milk (touhou)
milk sunny
milk sunny (touhou)
milk (touhou)
sunny (touhou)

tanned cirno
tanned cirno (touhou)
cirno tanned
cirno tanned (touhou)

yakumo ran
yakumo ran (touhou)
ran yakumo
ran yakumo (touhou)
ran (touhou)

yakumo yukari
yakumo yukari (touhou)
yukari yakumo
yukari yakumo (touhou)
yukari (touhou)

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

archetype earth
archetype earth (tsukihime)
earth archetype
earth archetype (tsukihime)
earth (tsukihime)
archetype (tsukihime)

arima miyako
arima miyako (tsukihime)
miyako arima
miyako arima (tsukihime)
miyako (tsukihime)
arima (tsukihime)

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

asriel dreemurr
asriel dreemurr (undertale)
dreemurr asriel
dreemurr asriel (undertale)
dreemurr (undertale)
asriel (undertale)

muffet
muffet (undertale)

toriel
toriel (undertale)

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

brazilian miku
brazilian miku (vocaloid)
miku brazilian
miku brazilian (vocaloid)
miku (vocaloid)
brazilian (vocaloid)

kaai yuki
kaai yuki (vocaloid)
yuki kaai
yuki kaai (vocaloid)
yuki (vocaloid)
kaai (vocaloid)

kagamine len
kagamine len (vocaloid)
len kagamine
len kagamine (vocaloid)
len (vocaloid)

kagamine rin
kagamine rin (vocaloid)
rin kagamine
rin kagamine (vocaloid)
rin (vocaloid)

megurine luka
megurine luka (vocaloid)
luka megurine
luka megurine (vocaloid)
luka (vocaloid)
megurine (vocaloid)

brazillian miku
brazillian miku (vocaloid)

hatsune miku
hatsune miku (vocaloid)

kyoufuu all back (vocaloid)

zako (vocaloid)

- ==== voms ====

amano pikamee
amano pikamee (voms)
pikamee amano
pikamee amano (voms)
pikamee (voms)
amano (voms)
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

sally whitemane
sally whitemane (warcraft)
whitemane sally
whitemane sally (warcraft)
whitemane (warcraft)
sally (warcraft)
whitemane (warcraft)
.wowwhitemane
whitemane
wowwhitemane

sylvanas windrunner
sylvanas windrunner (warcraft)
windrunner sylvanas
windrunner sylvanas (warcraft)
windrunner (warcraft)
sylvanas (warcraft)

tyrande whisperwind
tyrande whisperwind (warcraft)
whisperwind tyrande
whisperwind tyrande (warcraft)
whisperwind (warcraft)
tyrande (warcraft)

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

doronjo
doronjo (yatterman)

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

nicole demara
nicole demara (zenless zone zero)
demara nicole
demara nicole (zenless zone zero)
demara (zenless zone zero)
nicole (zenless zone zero)

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


- ==== utau ====

kasane teto
kasane teto (utau)
teto kasane
teto kasane (utau)
teto (utau)
kasane (utau)
teto

- ==== my little pony ====

applejack
applejack (my little pony)

fluttershy
fluttershy (my little pony)

pinkie pie
pinkie pie (my little pony)
pie pinkie
pie pinkie (my little pony)
pie (my little pony)
pinkie (my little pony)
pinkie pie (my little pony)
pinky pie
pinky pie (my little pony)

princess luna
princess luna (my little pony)
luna princess
luna princess (my little pony)
luna (my little pony)

princess cadence
princess cadence (my little pony)

princess celestia
princess celestia (my little pony)
celestia (my little pony)

rarity (my little pony)
rarity

twilight sparkle (my little pony)

rainbow dash
rainbow dash (my little pony)
dash rainbow
dash rainbow (my little pony)
dash (my little pony)
rainbow (my little pony)

twilight sparkle
twilight sparkle (my little pony)
sparkle twilight
sparkle twilight (my little pony)
sparkle (my little pony)
twilight (my little pony)

- ==== bayonetta (series) ====

bayonetta
bayonetta (bayonetta (series))

- ==== tensei shitara dai nana oji datta no de: kimama ni majutsu o kiwamemasu ====

lloyd de saloum
lloyd de saloum (tensei shitara dai nana oji datta no de: kimama ni majutsu o kiwamemasu)
lloyd

- ==== os-tan ====

3.1-tan
3.1-tan (os-tan)

- ==== avatar legends ====

aang
aang (avatar legends)

asami sato
asami sato (avatar legends)
sato asami
sato asami (avatar legends)
sato (avatar legends)
asami (avatar legends)

azula
azula (avatar legends)

korra
korra (avatar legends)

toph bei fong
toph bei fong (avatar legends)

ty lee
ty lee (avatar legends)
lee ty
lee ty (avatar legends)
lee (avatar legends)
ty (avatar legends)

- ==== bleach ====

abarai renji
abarai renji (bleach)
renji abarai
renji abarai (bleach)
renji (bleach)
abarai (bleach)

inoue orihime
inoue orihime (bleach)
orihime inoue
orihime inoue (bleach)
orihime (bleach)
inoue (bleach)
orihime

kotetsu isane
kotetsu isane (bleach)
isane kotetsu
isane kotetsu (bleach)
isane (bleach)
kotetsu (bleach)

kuchiki rukia
kuchiki rukia (bleach)
rukia kuchiki
rukia kuchiki (bleach)
rukia (bleach)
kuchiki (bleach)
rukia

matsumoto rangiku
matsumoto rangiku (bleach)
rangiku matsumoto
rangiku matsumoto (bleach)
rangiku (bleach)
matsumoto (bleach)

shihouin yoruichi
shihouin yoruichi (bleach)
yoruichi shihouin
yoruichi shihouin (bleach)
yoruichi (bleach)
shihouin (bleach)
yoruichi

unohana retsu
unohana retsu (bleach)
retsu unohana
retsu unohana (bleach)
retsu (bleach)
unohana (bleach)

- ==== kirby (series) ====

adeleine
adeleine (kirby (series))

- ==== bravely default (series) ====

agnes oblige
agnes oblige (bravely default (series))
oblige agnes
oblige agnes (bravely default (series))
oblige (bravely default (series))
agnes (bravely default (series))

- ==== star wars ====

ahsoka tano
ahsoka tano (star wars)
tano ahsoka
tano ahsoka (star wars)
tano (star wars)
ahsoka (star wars)

padme amidala
padme amidala (star wars)
amidala padme
amidala padme (star wars)
amidala (star wars)
padme (star wars)

- ==== kobayashi-san chi no maidragon ====

aida taketo
aida taketo (kobayashi-san chi no maidragon)
taketo aida
taketo aida (kobayashi-san chi no maidragon)
taketo (kobayashi-san chi no maidragon)
aida (kobayashi-san chi no maidragon)

magatsuchi shouta
magatsuchi shouta (kobayashi-san chi no maidragon)
shouta magatsuchi
shouta magatsuchi (kobayashi-san chi no maidragon)
shouta (kobayashi-san chi no maidragon)
magatsuchi (kobayashi-san chi no maidragon)

saikawa riko
saikawa riko (kobayashi-san chi no maidragon)
riko saikawa
riko saikawa (kobayashi-san chi no maidragon)
riko (kobayashi-san chi no maidragon)
saikawa (kobayashi-san chi no maidragon)

- ==== futabu ====

aihara ai
aihara ai (futabu)
ai aihara
ai aihara (futabu)
ai (futabu)
aihara (futabu)

asakura mao
asakura mao (futabu)
mao asakura
mao asakura (futabu)
mao (futabu)
asakura (futabu)

itou aya
itou aya (futabu)
aya itou
aya itou (futabu)
aya (futabu)
itou (futabu)

niimura akane
niimura akane (futabu)
akane niimura
akane niimura (futabu)
akane (futabu)
niimura (futabu)

oohashi sumika
oohashi sumika (futabu)
sumika oohashi
sumika oohashi (futabu)
sumika (futabu)
oohashi (futabu)

- ==== toradora! ====

aisaka taiga
aisaka taiga (toradora!)
taiga aisaka
taiga aisaka (toradora!)
taiga (toradora!)
aisaka (toradora!)

- ==== rosario+vampire ====

akashiya moka
akashiya moka (rosario+vampire)
moka akashiya
moka akashiya (rosario+vampire)
moka (rosario+vampire)
akashiya (rosario+vampire)

aono tsukune
aono tsukune (rosario+vampire)
tsukune aono
tsukune aono (rosario+vampire)
tsukune (rosario+vampire)
aono (rosario+vampire)

inner moka
inner moka (rosario+vampire)

- ==== mahou shoujo madoka magica ====

akemi homura
akemi homura (mahou shoujo madoka magica)
homura akemi
homura akemi (mahou shoujo madoka magica)
homura (mahou shoujo madoka magica)
akemi (mahou shoujo madoka magica)
akemi homura (magical girl)

kaname madoka
kaname madoka (mahou shoujo madoka magica)
madoka kaname
madoka kaname (mahou shoujo madoka magica)
madoka (mahou shoujo madoka magica)
kaname (mahou shoujo madoka magica)

sakura kyoko
sakura kyoko (mahou shoujo madoka magica)
kyoko sakura
kyoko sakura (mahou shoujo madoka magica)
kyoko (mahou shoujo madoka magica)
sakura (mahou shoujo madoka magica)

tamaki iroha
tamaki iroha (mahou shoujo madoka magica)
iroha tamaki
iroha tamaki (mahou shoujo madoka magica)
iroha (mahou shoujo madoka magica)
tamaki (mahou shoujo madoka magica)

tomoe mami
tomoe mami (mahou shoujo madoka magica)
mami tomoe
mami tomoe (mahou shoujo madoka magica)
mami (mahou shoujo madoka magica)
tomoe (mahou shoujo madoka magica)

- ==== steins;gate ====

akiha rumiho
akiha rumiho (steins;gate)
rumiho akiha
rumiho akiha (steins;gate)
rumiho (steins;gate)
akiha (steins;gate)

makise kurisu
makise kurisu (steins;gate)
kurisu makise
kurisu makise (steins;gate)
kurisu (steins;gate)
makise (steins;gate)

urushibara ruka
urushibara ruka (steins;gate)
ruka urushibara
ruka urushibara (steins;gate)
ruka (steins;gate)
urushibara (steins;gate)

- ==== naruto (series) ====

akimichi chouchou
akimichi chouchou (naruto (series))
chouchou akimichi
chouchou akimichi (naruto (series))
chouchou (naruto (series))
akimichi (naruto (series))

haruno sakura
haruno sakura (naruto (series))
sakura haruno
sakura haruno (naruto (series))
sakura (naruto (series))
haruno (naruto (series))

hatake kakashi
hatake kakashi (naruto (series))
kakashi hatake
kakashi hatake (naruto (series))
kakashi (naruto (series))
hatake (naruto (series))

hyuuga hinata
hyuuga hinata (naruto (series))
hinata hyuuga
hinata hyuuga (naruto (series))
hinata (naruto (series))
hyuuga (naruto (series))

kakei sumire
kakei sumire (naruto (series))
sumire kakei
sumire kakei (naruto (series))
sumire (naruto (series))
kakei (naruto (series))

killer bee
killer bee (naruto (series))
bee killer
bee killer (naruto (series))
bee (naruto (series))
killer (naruto (series))

mitarashi anko
mitarashi anko (naruto (series))
anko mitarashi
anko mitarashi (naruto (series))
anko (naruto (series))
mitarashi (naruto (series))

terumi mei
terumi mei (naruto (series))
mei terumi
mei terumi (naruto (series))
mei (naruto (series))
terumi (naruto (series))

uchiha sarada
uchiha sarada (naruto (series))
sarada uchiha
sarada uchiha (naruto (series))
sarada (naruto (series))
uchiha (naruto (series))

uzumaki boruto
uzumaki boruto (naruto (series))
boruto uzumaki
boruto uzumaki (naruto (series))
boruto (naruto (series))

uzumaki himawari
uzumaki himawari (naruto (series))
himawari uzumaki
himawari uzumaki (naruto (series))
himawari (naruto (series))

uzumaki naruto
uzumaki naruto (naruto (series))
naruto uzumaki
naruto uzumaki (naruto (series))
naruto (naruto (series))

- ==== taimanin (series) ====

akiyama rinko
akiyama rinko (taimanin (series))
rinko akiyama
rinko akiyama (taimanin (series))
rinko (taimanin (series))
akiyama (taimanin (series))

koukawa asuka
koukawa asuka (taimanin (series))
asuka koukawa
asuka koukawa (taimanin (series))
asuka (taimanin (series))
koukawa (taimanin (series))

mizuki yukikaze
mizuki yukikaze (taimanin (series))
yukikaze mizuki
yukikaze mizuki (taimanin (series))
yukikaze (taimanin (series))
mizuki (taimanin (series))

- ==== girls und panzer ====

akiyama yukari
akiyama yukari (girls und panzer)
yukari akiyama
yukari akiyama (girls und panzer)
yukari (girls und panzer)
akiyama (girls und panzer)

oono aya
oono aya (girls und panzer)
aya oono
aya oono (girls und panzer)
aya (girls und panzer)
oono (girls und panzer)

shimada arisu
shimada arisu (girls und panzer)
arisu shimada
arisu shimada (girls und panzer)
arisu (girls und panzer)
shimada (girls und panzer)

- ==== last exile ====

alvis hamilton
alvis hamilton (last exile)
hamilton alvis
hamilton alvis (last exile)
hamilton (last exile)
alvis (last exile)

- ==== saki ====

amae koromo
amae koromo (saki)
koromo amae
koromo amae (saki)
koromo (saki)
amae (saki)

- ==== persona ====

amamiya ren
amamiya ren (persona)
ren amamiya
ren amamiya (persona)
ren (persona)
amamiya (persona)

kawakami sadayo
kawakami sadayo (persona)
sadayo kawakami
sadayo kawakami (persona)
sadayo (persona)
kawakami (persona)

kitagawa yuusuke
kitagawa yuusuke (persona)
yuusuke kitagawa
yuusuke kitagawa (persona)
yuusuke (persona)
kitagawa (persona)

niijima makoto
niijima makoto (persona)
makoto niijima
makoto niijima (persona)
makoto (persona)
niijima (persona)

okumura haru
okumura haru (persona)
haru okumura
haru okumura (persona)
haru (persona)
okumura (persona)

sakamoto ryuuji
sakamoto ryuuji (persona)
ryuuji sakamoto
ryuuji sakamoto (persona)
ryuuji (persona)
sakamoto (persona)

sakura futaba
sakura futaba (persona)
futaba sakura
futaba sakura (persona)
futaba (persona)
sakura (persona)

shirogane naoto
shirogane naoto (persona)
naoto shirogane
naoto shirogane (persona)
naoto (persona)
shirogane (persona)

takamaki anne
takamaki anne (persona)
anne takamaki
anne takamaki (persona)
anne (persona)
takamaki (persona)

takemi tae
takemi tae (persona)
tae takemi
tae takemi (persona)
tae (persona)
takemi (persona)

yamagishi fuuka
yamagishi fuuka (persona)
fuuka yamagishi
fuuka yamagishi (persona)
fuuka (persona)
yamagishi (persona)

- ==== the owl house ====

amity blight
amity blight (the owl house)
blight amity
blight amity (the owl house)
blight (the owl house)
amity (the owl house)

luz noceda
luz noceda (the owl house)
noceda luz
noceda luz (the owl house)
noceda (the owl house)
luz (the owl house)

- ==== love plus ====

anegasaki nene
anegasaki nene (love plus)
nene anegasaki
nene anegasaki (love plus)
nene (love plus)
anegasaki (love plus)

takane manaka
takane manaka (love plus)
manaka takane
manaka takane (love plus)
manaka (love plus)
takane (love plus)

- ==== hazbin hotel ====

angel dust
angel dust (hazbin hotel)
dust angel
dust angel (hazbin hotel)
dust (hazbin hotel)
angel (hazbin hotel)

- ==== ano hi mita hana no namae wo bokutachi wa mada shiranai. ====

anjou naruko
anjou naruko (ano hi mita hana no namae wo bokutachi wa mada shiranai.)
naruko anjou
naruko anjou (ano hi mita hana no namae wo bokutachi wa mada shiranai.)
naruko (ano hi mita hana no namae wo bokutachi wa mada shiranai.)
anjou (ano hi mita hana no namae wo bokutachi wa mada shiranai.)

- ==== shimoneta to iu gainen ga sonzai shinai taikutsu na sekai ====

anna nishikinomiya
anna nishikinomiya (shimoneta to iu gainen ga sonzai shinai taikutsu na sekai)
nishikinomiya anna
nishikinomiya anna (shimoneta to iu gainen ga sonzai shinai taikutsu na sekai)
nishikinomiya (shimoneta to iu gainen ga sonzai shinai taikutsu na sekai)
anna (shimoneta to iu gainen ga sonzai shinai taikutsu na sekai)

- ==== shingeki no kyojin ====

annie leonhart
annie leonhart (shingeki no kyojin)
leonhart annie
leonhart annie (shingeki no kyojin)
leonhart (shingeki no kyojin)
annie (shingeki no kyojin)

eren yeager
eren yeager (shingeki no kyojin)
yeager eren
yeager eren (shingeki no kyojin)
yeager (shingeki no kyojin)
eren (shingeki no kyojin)

mikasa ackerman
mikasa ackerman (shingeki no kyojin)
ackerman mikasa
ackerman mikasa (shingeki no kyojin)
ackerman (shingeki no kyojin)
mikasa (shingeki no kyojin)

- ==== teenage mutant ninja turtles ====

april o'neil
april o'neil (teenage mutant ninja turtles)
o'neil april
o'neil april (teenage mutant ninja turtles)
o'neil (teenage mutant ninja turtles)
april (teenage mutant ninja turtles)

- ==== elsword ====

ara haan
ara haan (elsword)
haan ara
haan ara (elsword)
haan (elsword)
ara (elsword)

- ==== monogatari (series) ====

araragi karen
araragi karen (monogatari (series))
karen araragi
karen araragi (monogatari (series))
karen (monogatari (series))
araragi (monogatari (series))

araragi koyomi
araragi koyomi (monogatari (series))
koyomi araragi
koyomi araragi (monogatari (series))
koyomi (monogatari (series))
araragi (monogatari (series))

araragi tsukihi
araragi tsukihi (monogatari (series))
tsukihi araragi
tsukihi araragi (monogatari (series))
tsukihi (monogatari (series))
araragi (monogatari (series))

gaen tooe
gaen tooe (monogatari (series))
tooe gaen
tooe gaen (monogatari (series))
tooe (monogatari (series))
gaen (monogatari (series))

hanekawa tsubasa
hanekawa tsubasa (monogatari (series))
tsubasa hanekawa
tsubasa hanekawa (monogatari (series))
tsubasa (monogatari (series))
hanekawa (monogatari (series))

kanbaru suruga
kanbaru suruga (monogatari (series))
suruga kanbaru
suruga kanbaru (monogatari (series))
suruga (monogatari (series))
kanbaru (monogatari (series))

kiss-shot acerola-orion heart-under-blade
kiss-shot acerola-orion heart-under-blade (monogatari (series))

ononoki yotsugi
ononoki yotsugi (monogatari (series))
yotsugi ononoki
yotsugi ononoki (monogatari (series))
yotsugi (monogatari (series))
ononoki (monogatari (series))

oshino ougi
oshino ougi (monogatari (series))
ougi oshino
ougi oshino (monogatari (series))
ougi (monogatari (series))
oshino (monogatari (series))

oshino shinobu
oshino shinobu (monogatari (series))
shinobu oshino
shinobu oshino (monogatari (series))
shinobu (monogatari (series))
oshino (monogatari (series))

senjougahara hitagi
senjougahara hitagi (monogatari (series))
hitagi senjougahara
hitagi senjougahara (monogatari (series))
hitagi (monogatari (series))
senjougahara (monogatari (series))

- ==== virtual ant channel ====

ariduka formica
ariduka formica (virtual ant channel)
formica ariduka
formica ariduka (virtual ant channel)
formica (virtual ant channel)
ariduka (virtual ant channel)

- ==== danganronpa (series) ====

asahina aoi
asahina aoi (danganronpa (series))
aoi asahina
aoi asahina (danganronpa (series))
aoi (danganronpa (series))
asahina (danganronpa (series))

enoshima junko
enoshima junko (danganronpa (series))
junko enoshima
junko enoshima (danganronpa (series))
junko (danganronpa (series))
enoshima (danganronpa (series))

- ==== the king of fighters ====

ash crimson
ash crimson (the king of fighters)
crimson ash
crimson ash (the king of fighters)
crimson (the king of fighters)
ash (the king of fighters)

elisabeth blanctorche
elisabeth blanctorche (the king of fighters)
blanctorche elisabeth
blanctorche elisabeth (the king of fighters)
blanctorche (the king of fighters)
elisabeth (the king of fighters)

luong
luong (the king of fighters)

- ==== how to train your dragon ====

astrid hofferson
astrid hofferson (how to train your dragon)
hofferson astrid
hofferson astrid (how to train your dragon)
hofferson (how to train your dragon)
astrid (how to train your dragon)

- ==== ar tonelico ====

aurica nestmile
aurica nestmile (ar tonelico)
nestmile aurica
nestmile aurica (ar tonelico)
nestmile (ar tonelico)
aurica (ar tonelico)

- ==== world witches series ====

aurora e. juutilainen
aurora e. juutilainen (world witches series)

eila ilmatar juutilainen
eila ilmatar juutilainen (world witches series)

hanna-justina marseille
hanna-justina marseille (world witches series)
marseille hanna-justina
marseille hanna-justina (world witches series)
marseille (world witches series)
hanna-justina (world witches series)

perrine h. clostermann
perrine h. clostermann (world witches series)

- ==== neon genesis evangelion ====

ayanami rei
ayanami rei (neon genesis evangelion)
rei ayanami
rei ayanami (neon genesis evangelion)
rei (neon genesis evangelion)
ayanami (neon genesis evangelion)

ikari shinji
ikari shinji (neon genesis evangelion)
shinji ikari
shinji ikari (neon genesis evangelion)
shinji (neon genesis evangelion)
ikari (neon genesis evangelion)

katsuragi misato
katsuragi misato (neon genesis evangelion)
misato katsuragi
misato katsuragi (neon genesis evangelion)
misato (neon genesis evangelion)
katsuragi (neon genesis evangelion)

souryuu asuka langley
souryuu asuka langley (neon genesis evangelion)

- ==== dungeon ni deai wo motomeru no wa machigatteiru darou ka ====

bell cranel
bell cranel (dungeon ni deai wo motomeru no wa machigatteiru darou ka)
cranel bell
cranel bell (dungeon ni deai wo motomeru no wa machigatteiru darou ka)
cranel (dungeon ni deai wo motomeru no wa machigatteiru darou ka)
bell (dungeon ni deai wo motomeru no wa machigatteiru darou ka)

liliruca arde
liliruca arde (dungeon ni deai wo motomeru no wa machigatteiru darou ka)
arde liliruca
arde liliruca (dungeon ni deai wo motomeru no wa machigatteiru darou ka)
arde (dungeon ni deai wo motomeru no wa machigatteiru darou ka)
liliruca (dungeon ni deai wo motomeru no wa machigatteiru darou ka)

sanjouno haruhime
sanjouno haruhime (dungeon ni deai wo motomeru no wa machigatteiru darou ka)
haruhime sanjouno
haruhime sanjouno (dungeon ni deai wo motomeru no wa machigatteiru darou ka)
haruhime (dungeon ni deai wo motomeru no wa machigatteiru darou ka)
sanjouno (dungeon ni deai wo motomeru no wa machigatteiru darou ka)

- ==== little red riding hood ====

big bad wolf
big bad wolf (little red riding hood)

- ==== gravity falls ====

bill cipher
bill cipher (gravity falls)
cipher bill
cipher bill (gravity falls)
cipher (gravity falls)
bill (gravity falls)

dipper pines
dipper pines (gravity falls)
pines dipper
pines dipper (gravity falls)
dipper (gravity falls)

mabel pines
mabel pines (gravity falls)
pines mabel
pines mabel (gravity falls)
mabel (gravity falls)

pacifica northwest
pacifica northwest (gravity falls)
northwest pacifica
northwest pacifica (gravity falls)
northwest (gravity falls)
pacifica (gravity falls)

wendy corduroy
wendy corduroy (gravity falls)
corduroy wendy
corduroy wendy (gravity falls)
corduroy (gravity falls)
wendy (gravity falls)

- ==== dc comics ====

blackfire
blackfire (dc comics)

harley quinn
harley quinn (dc comics)
quinn harley
quinn harley (dc comics)
quinn (dc comics)
harley (dc comics)

power girl
power girl (dc comics)
girl power
girl power (dc comics)
girl (dc comics)
power (dc comics)

- ==== streets of rage ====

blaze fielding
blaze fielding (streets of rage)
fielding blaze
fielding blaze (streets of rage)
fielding (streets of rage)
blaze (streets of rage)

- ==== mario (series) ====

bowser
bowser (mario (series))

goomba
goomba (mario (series))

koopa troopa
koopa troopa (mario (series))
troopa koopa
troopa koopa (mario (series))
troopa (mario (series))
koopa (mario (series))
koopa

luigi
luigi (mario (series))

shadow queen
shadow queen (mario (series))
queen shadow
queen shadow (mario (series))
queen (mario (series))
shadow (mario (series))

toadette
toadette (mario (series))

wario
wario (mario (series))

yoshi
yoshi (mario (series))

rosalina (halloween)

- ==== sonic (series) ====

bunnie rabbot
bunnie rabbot (sonic (series))
rabbot bunnie
rabbot bunnie (sonic (series))
rabbot (sonic (series))
bunnie (sonic (series))

knuckles the echidna
knuckles the echidna (sonic (series))
echidna

maria robotnik
maria robotnik (sonic (series))
robotnik maria
robotnik maria (sonic (series))
robotnik (sonic (series))
maria (sonic (series))

sally acorn
sally acorn (sonic (series))
acorn sally
acorn sally (sonic (series))
acorn (sonic (series))
sally (sonic (series))

shadow the hedgehog
shadow the hedgehog (sonic (series))

sticks the badger
sticks the badger (sonic (series))

tangle the lemur
tangle the lemur (sonic (series))

- ==== big hero 6 ====

cass hamada
cass hamada (big hero 6)
hamada cass
hamada cass (big hero 6)
cass (big hero 6)

gogo tomago
gogo tomago (big hero 6)
tomago gogo
tomago gogo (big hero 6)
tomago (big hero 6)
gogo (big hero 6)

hiro hamada
hiro hamada (big hero 6)
hamada hiro
hamada hiro (big hero 6)
hiro (big hero 6)

- ==== monster musume no iru nichijou ====

cathyl
cathyl (monster musume no iru nichijou)

centorea shianus
centorea shianus (monster musume no iru nichijou)
shianus centorea
shianus centorea (monster musume no iru nichijou)
shianus (monster musume no iru nichijou)
centorea (monster musume no iru nichijou)

kurusu kimihito
kurusu kimihito (monster musume no iru nichijou)
kimihito kurusu
kimihito kurusu (monster musume no iru nichijou)
kimihito (monster musume no iru nichijou)
kurusu (monster musume no iru nichijou)

polt
polt (monster musume no iru nichijou)

rachnera arachnera
rachnera arachnera (monster musume no iru nichijou)
arachnera rachnera
arachnera rachnera (monster musume no iru nichijou)
arachnera (monster musume no iru nichijou)
rachnera (monster musume no iru nichijou)

- ==== she-ra and the princesses of power ====

catra
catra (she-ra and the princesses of power)

- ==== kuroinu ~kedakaki seijo wa hakudaku ni somaru~ ====

celestine lucullus
celestine lucullus (kuroinu ~kedakaki seijo wa hakudaku ni somaru~)
lucullus celestine
lucullus celestine (kuroinu ~kedakaki seijo wa hakudaku ni somaru~)
lucullus (kuroinu ~kedakaki seijo wa hakudaku ni somaru~)
celestine (kuroinu ~kedakaki seijo wa hakudaku ni somaru~)

- ==== star ocean ====

celine jules
celine jules (star ocean)
jules celine
jules celine (star ocean)
jules (star ocean)
celine (star ocean)

leon geeste
leon geeste (star ocean)
geeste leon
geeste leon (star ocean)
geeste (star ocean)
leon (star ocean)

rena lanford
rena lanford (star ocean)
lanford rena
lanford rena (star ocean)
lanford (star ocean)
rena (star ocean)

- ==== durarara!! ====

celty sturluson
celty sturluson (durarara!!)
sturluson celty
sturluson celty (durarara!!)
sturluson (durarara!!)
celty (durarara!!)

- ==== castlevania (series) ====

charlotte aulin
charlotte aulin (castlevania (series))
aulin charlotte
aulin charlotte (castlevania (series))
aulin (castlevania (series))
charlotte (castlevania (series))

- ==== bishoujo senshi sailor moon ====

chibi usa
chibi usa (bishoujo senshi sailor moon)
usa chibi
usa chibi (bishoujo senshi sailor moon)
usa (bishoujo senshi sailor moon)
chibi (bishoujo senshi sailor moon)

sailor saturn
sailor saturn (bishoujo senshi sailor moon)
saturn sailor
saturn sailor (bishoujo senshi sailor moon)
saturn (bishoujo senshi sailor moon)
sailor (bishoujo senshi sailor moon)

tomoe hotaru
tomoe hotaru (bishoujo senshi sailor moon)
hotaru tomoe
hotaru tomoe (bishoujo senshi sailor moon)
hotaru (bishoujo senshi sailor moon)
tomoe (bishoujo senshi sailor moon)

- ==== blue lock ====

chigiri hyoma
chigiri hyoma (blue lock)
hyoma chigiri
hyoma chigiri (blue lock)
hyoma (blue lock)
chigiri (blue lock)

- ==== fate (series) ====

chloe von einzbern
chloe von einzbern (fate (series))

fujimura taiga
fujimura taiga (fate (series))
taiga fujimura
taiga fujimura (fate (series))
taiga (fate (series))
fujimura (fate (series))

illyasviel von einzbern
illyasviel von einzbern (fate (series))

kadoc zemlupus
kadoc zemlupus (fate (series))
zemlupus kadoc
zemlupus kadoc (fate (series))
zemlupus (fate (series))
kadoc (fate (series))

mash kyrielight
mash kyrielight (fate (series))
kyrielight mash
kyrielight mash (fate (series))
kyrielight (fate (series))
mash (fate (series))

miyu edelfelt
miyu edelfelt (fate (series))
edelfelt miyu
edelfelt miyu (fate (series))
edelfelt (fate (series))
miyu (fate (series))

prisma illya
prisma illya (fate (series))
illya prisma
illya prisma (fate (series))
illya (fate (series))
prisma (fate (series))

sessyoin kiara
sessyoin kiara (fate (series))
kiara sessyoin
kiara sessyoin (fate (series))
kiara (fate (series))
sessyoin (fate (series))

tohsaka rin
tohsaka rin (fate (series))
rin tohsaka
rin tohsaka (fate (series))
rin (fate (series))
tohsaka (fate (series))

- ==== kono subarashii sekai ni shukufuku wo! ====

chomusuke
chomusuke (kono subarashii sekai ni shukufuku wo!)

komekko
komekko (kono subarashii sekai ni shukufuku wo!)

satou kazuma
satou kazuma (kono subarashii sekai ni shukufuku wo!)
kazuma satou
kazuma satou (kono subarashii sekai ni shukufuku wo!)
kazuma (kono subarashii sekai ni shukufuku wo!)
satou (kono subarashii sekai ni shukufuku wo!)

- ==== the witcher (series) ====

ciri
ciri (the witcher (series))

- ==== crash bandicoot (series) ====

coco bandicoot
coco bandicoot (crash bandicoot (series))
bandicoot coco
bandicoot coco (crash bandicoot (series))
bandicoot (crash bandicoot (series))
coco (crash bandicoot (series))
bandicoot

- ==== la pucelle ====

dark eclair
dark eclair (la pucelle)
eclair dark
eclair dark (la pucelle)
eclair (la pucelle)
dark (la pucelle)

- ==== yu-gi-oh! ====

dark magician girl
dark magician girl (yu-gi-oh!)

harpie lady 1
harpie lady 1 (yu-gi-oh!)

kawai shizuka
kawai shizuka (yu-gi-oh!)
shizuka kawai
shizuka kawai (yu-gi-oh!)
shizuka (yu-gi-oh!)
kawai (yu-gi-oh!)

kujaku mai
kujaku mai (yu-gi-oh!)
mai kujaku
mai kujaku (yu-gi-oh!)
mai (yu-gi-oh!)
kujaku (yu-gi-oh!)

lovely labrynth of the silver castle
lovely labrynth of the silver castle (yu-gi-oh!)

mazaki anzu
mazaki anzu (yu-gi-oh!)
anzu mazaki
anzu mazaki (yu-gi-oh!)
anzu (yu-gi-oh!)
mazaki (yu-gi-oh!)

- ==== dark souls (series) ====

dark sun gwyndolin
dark sun gwyndolin (dark souls (series))

emerald herald
emerald herald (dark souls (series))
herald emerald
herald emerald (dark souls (series))
herald (dark souls (series))
emerald (dark souls (series))

priscilla the crossbreed
priscilla the crossbreed (dark souls (series))

- ==== cyberpunk (series) ====

david martinez
david martinez (cyberpunk (series))
martinez david
martinez david (cyberpunk (series))
martinez (cyberpunk (series))
david (cyberpunk (series))

- ==== cyberbots ====

devilot de deathsatan ix
devilot de deathsatan ix (cyberbots)

- ==== pretty series ====

dorothy west
dorothy west (pretty series)
west dorothy
west dorothy (pretty series)
dorothy (pretty series)

hibino matsuri
hibino matsuri (pretty series)
matsuri hibino
matsuri hibino (pretty series)
matsuri (pretty series)
hibino (pretty series)

hojo sophy
hojo sophy (pretty series)
sophy hojo
sophy hojo (pretty series)
sophy (pretty series)
hojo (pretty series)

kurosu aroma
kurosu aroma (pretty series)
aroma kurosu
aroma kurosu (pretty series)
aroma (pretty series)
kurosu (pretty series)

manaka laala
manaka laala (pretty series)
laala manaka
laala manaka (pretty series)
laala (pretty series)
manaka (pretty series)

reona west
reona west (pretty series)
west reona
west reona (pretty series)
reona (pretty series)

shiratama mikan
shiratama mikan (pretty series)
mikan shiratama
mikan shiratama (pretty series)
mikan (pretty series)
shiratama (pretty series)

- ==== mother (game) ====

doseisan
doseisan (mother (game))

- ==== ninja slayer ====

dragon yukano
dragon yukano (ninja slayer)
yukano dragon
yukano dragon (ninja slayer)
yukano (ninja slayer)
dragon (ninja slayer)

- ==== xenogears ====

elhaym van houten
elhaym van houten (xenogears)

- ==== new horizon ====

ellen baker
ellen baker (new horizon)
baker ellen
baker ellen (new horizon)
baker (new horizon)
ellen (new horizon)

- ==== dagashi kashi ====

endou saya
endou saya (dagashi kashi)
saya endou
saya endou (dagashi kashi)
saya (dagashi kashi)
endou (dagashi kashi)

shidare hotaru
shidare hotaru (dagashi kashi)
hotaru shidare
hotaru shidare (dagashi kashi)
hotaru (dagashi kashi)
shidare (dagashi kashi)

- ==== mushoku tensei ====

eris greyrat
eris greyrat (mushoku tensei)
greyrat eris
greyrat eris (mushoku tensei)
eris (mushoku tensei)

ghislaine dedoldia
ghislaine dedoldia (mushoku tensei)
dedoldia ghislaine
dedoldia ghislaine (mushoku tensei)
dedoldia (mushoku tensei)
ghislaine (mushoku tensei)

roxy migurdia
roxy migurdia (mushoku tensei)
migurdia roxy
migurdia roxy (mushoku tensei)
migurdia (mushoku tensei)
roxy (mushoku tensei)

rudeus greyrat
rudeus greyrat (mushoku tensei)
greyrat rudeus
greyrat rudeus (mushoku tensei)
rudeus (mushoku tensei)

- ==== fairy tail ====

erza scarlet
erza scarlet (fairy tail)
scarlet erza
scarlet erza (fairy tail)
scarlet (fairy tail)
erza (fairy tail)

irene belserion
irene belserion (fairy tail)
belserion irene
belserion irene (fairy tail)
belserion (fairy tail)
irene (fairy tail)

wendy marvell
wendy marvell (fairy tail)
marvell wendy
marvell wendy (fairy tail)
marvell (fairy tail)
wendy (fairy tail)

- ==== lyrical nanoha ====

fate testarossa
fate testarossa (lyrical nanoha)
testarossa fate
testarossa fate (lyrical nanoha)
testarossa (lyrical nanoha)
fate (lyrical nanoha)

- ==== cowboy bebop ====

faye valentine
faye valentine (cowboy bebop)
valentine faye
valentine faye (cowboy bebop)
valentine (cowboy bebop)
faye (cowboy bebop)

- ==== monster hunter (series) ====

felyne
felyne (monster hunter (series))

hinoa
hinoa (monster hunter (series))

minoto
minoto (monster hunter (series))

- ==== metal slug ====

fio germi
fio germi (metal slug)
germi fio
germi fio (metal slug)
germi (metal slug)
fio (metal slug)

kasamoto eri
kasamoto eri (metal slug)
eri kasamoto
eri kasamoto (metal slug)
eri (metal slug)
kasamoto (metal slug)

mars people
mars people (metal slug)
people mars
people mars (metal slug)
people (metal slug)
mars (metal slug)

- ==== kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~ ====

fujiwara chika
fujiwara chika (kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~)
chika fujiwara
chika fujiwara (kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~)
chika (kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~)
fujiwara (kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~)
fujiwara

hayasaka ai
hayasaka ai (kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~)
ai hayasaka
ai hayasaka (kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~)
ai (kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~)
hayasaka (kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~)

shinomiya kaguya
shinomiya kaguya (kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~)
kaguya shinomiya
kaguya shinomiya (kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~)
kaguya (kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~)
shinomiya (kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~)

- ==== coppelion ====

fukasaku aoi
fukasaku aoi (coppelion)
aoi fukasaku
aoi fukasaku (coppelion)
aoi (coppelion)
fukasaku (coppelion)

naruse ibara
naruse ibara (coppelion)
ibara naruse
ibara naruse (coppelion)
ibara (coppelion)
naruse (coppelion)

nomura taeko
nomura taeko (coppelion)
taeko nomura
taeko nomura (coppelion)
taeko (coppelion)
nomura (coppelion)

- ==== guardian tales ====

future knight
future knight (guardian tales)
knight future
knight future (guardian tales)
knight (guardian tales)

future princess
future princess (guardian tales)
princess future
princess future (guardian tales)
princess (guardian tales)

- ==== shijou saikyou no deshi ken'ichi ====

fuurinji miu
fuurinji miu (shijou saikyou no deshi ken'ichi)
miu fuurinji
miu fuurinji (shijou saikyou no deshi ken'ichi)
miu (shijou saikyou no deshi ken'ichi)
fuurinji (shijou saikyou no deshi ken'ichi)

kousaka shigure
kousaka shigure (shijou saikyou no deshi ken'ichi)
shigure kousaka
shigure kousaka (shijou saikyou no deshi ken'ichi)
shigure (shijou saikyou no deshi ken'ichi)
kousaka (shijou saikyou no deshi ken'ichi)

- ==== ijiranaide nagatoro-san ====

gamou maki
gamou maki (ijiranaide nagatoro-san)
maki gamou
maki gamou (ijiranaide nagatoro-san)
maki (ijiranaide nagatoro-san)
gamou (ijiranaide nagatoro-san)

hachiouji naoto
hachiouji naoto (ijiranaide nagatoro-san)
naoto hachiouji
naoto hachiouji (ijiranaide nagatoro-san)
naoto (ijiranaide nagatoro-san)
hachiouji (ijiranaide nagatoro-san)

nagatoro hayase
nagatoro hayase (ijiranaide nagatoro-san)
hayase nagatoro
hayase nagatoro (ijiranaide nagatoro-san)
hayase (ijiranaide nagatoro-san)
nagatoro (ijiranaide nagatoro-san)

sakura (nagatoro)
sakura (ijiranaide nagatoro-san)

yoshi (nagatoro)
yoshi (ijiranaide nagatoro-san)

- ==== shantae (series) ====

giga mermaid
giga mermaid (shantae (series))
mermaid giga
mermaid giga (shantae (series))
mermaid (shantae (series))
giga (shantae (series))

risky boots
risky boots (shantae (series))
boots risky
boots risky (shantae (series))
boots (shantae (series))
risky (shantae (series))

rottytops
rottytops (shantae (series))

- ==== gundam ====

gigi andalusia
gigi andalusia (gundam)
andalusia gigi
andalusia gigi (gundam)
andalusia (gundam)
gigi (gundam)

haro
haro (gundam)

hathaway noa
hathaway noa (gundam)
noa hathaway
noa hathaway (gundam)
noa (gundam)
hathaway (gundam)

hoshino fumina
hoshino fumina (gundam)
fumina hoshino
fumina hoshino (gundam)
fumina (gundam)
hoshino (gundam)

iori rinko
iori rinko (gundam)
rinko iori
rinko iori (gundam)
rinko (gundam)
iori (gundam)

miorine rembran
miorine rembran (gundam)
rembran miorine
rembran miorine (gundam)
rembran (gundam)
miorine (gundam)

sazaki kaoruko
sazaki kaoruko (gundam)
kaoruko sazaki
kaoruko sazaki (gundam)
kaoruko (gundam)
sazaki (gundam)

secelia dote
secelia dote (gundam)
dote secelia
dote secelia (gundam)
dote (gundam)
secelia (gundam)

- ==== tengen toppa gurren lagann ====

gimmy adai
gimmy adai (tengen toppa gurren lagann)
adai gimmy
adai gimmy (tengen toppa gurren lagann)
adai (tengen toppa gurren lagann)
gimmy (tengen toppa gurren lagann)

yoko littner
yoko littner (tengen toppa gurren lagann)
littner yoko
littner yoko (tengen toppa gurren lagann)
littner (tengen toppa gurren lagann)
yoko (tengen toppa gurren lagann)

- ==== ace attorney ====

gina lestrade
gina lestrade (ace attorney)
lestrade gina
lestrade gina (ace attorney)
lestrade (ace attorney)
gina (ace attorney)

rei membami
rei membami (ace attorney)
membami rei
membami rei (ace attorney)
membami (ace attorney)
rei (ace attorney)

ryutaro naruhodo
ryutaro naruhodo (ace attorney)
naruhodo ryutaro
naruhodo ryutaro (ace attorney)
naruhodo (ace attorney)
ryutaro (ace attorney)

susato mikotoba
susato mikotoba (ace attorney)
mikotoba susato
mikotoba susato (ace attorney)
mikotoba (ace attorney)
susato (ace attorney)

- ==== sono bisque doll wa koi wo suru ====

gojou wakana
gojou wakana (sono bisque doll wa koi wo suru)
wakana gojou
wakana gojou (sono bisque doll wa koi wo suru)
wakana (sono bisque doll wa koi wo suru)
gojou (sono bisque doll wa koi wo suru)

kitagawa marin
kitagawa marin (sono bisque doll wa koi wo suru)
marin kitagawa
marin kitagawa (sono bisque doll wa koi wo suru)
marin (sono bisque doll wa koi wo suru)
kitagawa (sono bisque doll wa koi wo suru)

- ==== ore no imouto ga konna ni kawaii wake ga nai ====

gokou ruri
gokou ruri (ore no imouto ga konna ni kawaii wake ga nai)
ruri gokou
ruri gokou (ore no imouto ga konna ni kawaii wake ga nai)
ruri (ore no imouto ga konna ni kawaii wake ga nai)
gokou (ore no imouto ga konna ni kawaii wake ga nai)

kousaka kirino
kousaka kirino (ore no imouto ga konna ni kawaii wake ga nai)
kirino kousaka
kirino kousaka (ore no imouto ga konna ni kawaii wake ga nai)
kirino (ore no imouto ga konna ni kawaii wake ga nai)
kousaka (ore no imouto ga konna ni kawaii wake ga nai)

kurusu kanako
kurusu kanako (ore no imouto ga konna ni kawaii wake ga nai)
kanako kurusu
kanako kurusu (ore no imouto ga konna ni kawaii wake ga nai)
kanako (ore no imouto ga konna ni kawaii wake ga nai)
kurusu (ore no imouto ga konna ni kawaii wake ga nai)

- ==== bocchi the rock! ====

gotoh hitori
gotoh hitori (bocchi the rock!)
hitori gotoh
hitori gotoh (bocchi the rock!)
hitori (bocchi the rock!)
gotoh (bocchi the rock!)

hiroi kikuri
hiroi kikuri (bocchi the rock!)
kikuri hiroi
kikuri hiroi (bocchi the rock!)
kikuri (bocchi the rock!)
hiroi (bocchi the rock!)

ijichi nijika
ijichi nijika (bocchi the rock!)
nijika ijichi
nijika ijichi (bocchi the rock!)
nijika (bocchi the rock!)
ijichi (bocchi the rock!)

kita ikuyo
kita ikuyo (bocchi the rock!)
ikuyo kita
ikuyo kita (bocchi the rock!)
ikuyo (bocchi the rock!)
kita (bocchi the rock!)

pa-san
pa-san (bocchi the rock!)

yamada ryo
yamada ryo (bocchi the rock!)
ryo yamada
ryo yamada (bocchi the rock!)
ryo (bocchi the rock!)
yamada (bocchi the rock!)

- ==== quiz magic academy the world evolve ====

grim aloe
grim aloe (quiz magic academy the world evolve)
aloe grim
aloe grim (quiz magic academy the world evolve)
aloe (quiz magic academy the world evolve)
grim (quiz magic academy the world evolve)

- ==== boukun habanero ====

habanero-tan
habanero-tan (boukun habanero)

- ==== hacka doll ====

hacka doll 3
hacka doll 3 (hacka doll)

- ==== harry potter (series) ====

harry potter
harry potter (harry potter (series))
potter harry
potter harry (harry potter (series))
potter (harry potter (series))
harry (harry potter (series))

- ==== boku wa tomodachi ga sukunai ====

hasegawa kobato
hasegawa kobato (boku wa tomodachi ga sukunai)
kobato hasegawa
kobato hasegawa (boku wa tomodachi ga sukunai)
kobato (boku wa tomodachi ga sukunai)
hasegawa (boku wa tomodachi ga sukunai)

takayama kate
takayama kate (boku wa tomodachi ga sukunai)
kate takayama
kate takayama (boku wa tomodachi ga sukunai)
kate (boku wa tomodachi ga sukunai)

takayama maria
takayama maria (boku wa tomodachi ga sukunai)
maria takayama
maria takayama (boku wa tomodachi ga sukunai)
maria (boku wa tomodachi ga sukunai)

- ==== original ====

hasshaku-sama
hasshaku-sama (original)

hinomoto oniko
hinomoto oniko (original)
oniko hinomoto
oniko hinomoto (original)
oniko (original)
hinomoto (original)
oniko

kamiya midori
kamiya midori (original)
midori kamiya
midori kamiya (original)
midori (original)
kamiya (original)

kirihara tatsugoro torayasu
kirihara tatsugoro torayasu (original)

kirihara torajyuro tatsumune
kirihara torajyuro tatsumune (original)

morimoto chio
morimoto chio (original)
chio morimoto
chio morimoto (original)
chio (original)
morimoto (original)

nanami mizuki
nanami mizuki (original)
mizuki nanami
mizuki nanami (original)
mizuki (original)
nanami (original)

opera brest
opera brest (original)
brest opera
brest opera (original)
brest (original)
opera (original)

sawada kanako
sawada kanako (original)
kanako sawada
kanako sawada (original)
kanako (original)
sawada (original)

usagi-san
usagi-san (original)

wojak
wojak (original)

- ==== sansha san'you ====

hayama teru
hayama teru (sansha san'you)
teru hayama
teru hayama (sansha san'you)
teru (sansha san'you)
hayama (sansha san'you)

- ==== star vs the forces of evil ====

hekapoo
hekapoo (star vs the forces of evil)

star butterfly
star butterfly (star vs the forces of evil)
butterfly star
butterfly star (star vs the forces of evil)
butterfly (star vs the forces of evil)
star (star vs the forces of evil)

- ==== the incredibles ====

helen parr
helen parr (the incredibles)
parr helen
parr helen (the incredibles)
parr (the incredibles)
helen (the incredibles)

- ==== professor layton ====

hershel layton
hershel layton (professor layton)
layton hershel
layton hershel (professor layton)
layton (professor layton)
hershel (professor layton)

luke triton
luke triton (professor layton)
triton luke
triton luke (professor layton)
triton (professor layton)
luke (professor layton)

- ==== lucky star ====

hiiragi kagami
hiiragi kagami (lucky star)
kagami hiiragi
kagami hiiragi (lucky star)
kagami (lucky star)
hiiragi (lucky star)

izumi konata
izumi konata (lucky star)
konata izumi
konata izumi (lucky star)
konata (lucky star)
izumi (lucky star)

- ==== aikatsu! (series) ====

hikami sumire
hikami sumire (aikatsu! (series))
sumire hikami
sumire hikami (aikatsu! (series))
sumire (aikatsu! (series))
hikami (aikatsu! (series))

ozora akari
ozora akari (aikatsu! (series))
akari ozora
akari ozora (aikatsu! (series))
akari (aikatsu! (series))
ozora (aikatsu! (series))

shiratori hime
shiratori hime (aikatsu! (series))
hime shiratori
hime shiratori (aikatsu! (series))
hime (aikatsu! (series))
shiratori (aikatsu! (series))

todo yurika
todo yurika (aikatsu! (series))
yurika todo
yurika todo (aikatsu! (series))
yurika (aikatsu! (series))
todo (aikatsu! (series))

- ==== youkai watch ====

himekawa fubuki
himekawa fubuki (youkai watch)
fubuki himekawa
fubuki himekawa (youkai watch)
fubuki (youkai watch)
himekawa (youkai watch)

- ==== love r ====

himenogi rinze
himenogi rinze (love r)
rinze himenogi
rinze himenogi (love r)
rinze (love r)
himenogi (love r)

- ==== watashi ni tenshi ga maiorita! ====

himesaka noa
himesaka noa (watashi ni tenshi ga maiorita!)
noa himesaka
noa himesaka (watashi ni tenshi ga maiorita!)
noa (watashi ni tenshi ga maiorita!)
himesaka (watashi ni tenshi ga maiorita!)

hoshino hinata
hoshino hinata (watashi ni tenshi ga maiorita!)
hinata hoshino
hinata hoshino (watashi ni tenshi ga maiorita!)
hinata (watashi ni tenshi ga maiorita!)
hoshino (watashi ni tenshi ga maiorita!)

shirosaki hana
shirosaki hana (watashi ni tenshi ga maiorita!)
hana shirosaki
hana shirosaki (watashi ni tenshi ga maiorita!)
hana (watashi ni tenshi ga maiorita!)
shirosaki (watashi ni tenshi ga maiorita!)

- ==== ryuuou no oshigoto! ====

hinatsuru ai
hinatsuru ai (ryuuou no oshigoto!)
ai hinatsuru
ai hinatsuru (ryuuou no oshigoto!)
ai (ryuuou no oshigoto!)
hinatsuru (ryuuou no oshigoto!)

- ==== boku dake ga inai machi ====

hinazuki kayo
hinazuki kayo (boku dake ga inai machi)
kayo hinazuki
kayo hinazuki (boku dake ga inai machi)
kayo (boku dake ga inai machi)
hinazuki (boku dake ga inai machi)

- ==== k-on! ====

hirasawa yui
hirasawa yui (k-on!)
yui hirasawa
yui hirasawa (k-on!)
yui (k-on!)
hirasawa (k-on!)

nakano azusa
nakano azusa (k-on!)
azusa nakano
azusa nakano (k-on!)
azusa (k-on!)
nakano (k-on!)

- ==== houkago teibou nisshi ====

hodaka natsumi
hodaka natsumi (houkago teibou nisshi)
natsumi hodaka
natsumi hodaka (houkago teibou nisshi)
natsumi (houkago teibou nisshi)
hodaka (houkago teibou nisshi)

- ==== zombie land saga ====

hoshikawa lily
hoshikawa lily (zombie land saga)
lily hoshikawa
lily hoshikawa (zombie land saga)
lily (zombie land saga)
hoshikawa (zombie land saga)

- ==== sekai seifuku: bouryaku no zvezda ====

hoshimiya kate
hoshimiya kate (sekai seifuku: bouryaku no zvezda)
kate hoshimiya
kate hoshimiya (sekai seifuku: bouryaku no zvezda)
kate (sekai seifuku: bouryaku no zvezda)
hoshimiya (sekai seifuku: bouryaku no zvezda)

venera-sama
venera-sama (sekai seifuku: bouryaku no zvezda)

- ==== kidou senkan nadesico ====

hoshino ruri
hoshino ruri (kidou senkan nadesico)
ruri hoshino
ruri hoshino (kidou senkan nadesico)
ruri (kidou senkan nadesico)
hoshino (kidou senkan nadesico)

- ==== onii-chan wa oshimai! ====

hozuki kaede
hozuki kaede (onii-chan wa oshimai!)
kaede hozuki
kaede hozuki (onii-chan wa oshimai!)
kaede (onii-chan wa oshimai!)
hozuki (onii-chan wa oshimai!)

hozuki momiji
hozuki momiji (onii-chan wa oshimai!)
momiji hozuki
momiji hozuki (onii-chan wa oshimai!)
momiji (onii-chan wa oshimai!)
hozuki (onii-chan wa oshimai!)

murosaki miyo
murosaki miyo (onii-chan wa oshimai!)
miyo murosaki
miyo murosaki (onii-chan wa oshimai!)
miyo (onii-chan wa oshimai!)
murosaki (onii-chan wa oshimai!)

oka asahi
oka asahi (onii-chan wa oshimai!)
asahi oka
asahi oka (onii-chan wa oshimai!)
asahi (onii-chan wa oshimai!)
oka (onii-chan wa oshimai!)

oyama mahiro
oyama mahiro (onii-chan wa oshimai!)
mahiro oyama
mahiro oyama (onii-chan wa oshimai!)
mahiro (onii-chan wa oshimai!)
oyama (onii-chan wa oshimai!)

oyama mihari
oyama mihari (onii-chan wa oshimai!)
mihari oyama
mihari oyama (onii-chan wa oshimai!)
mihari (onii-chan wa oshimai!)
oyama (onii-chan wa oshimai!)

- ==== infinite stratos ====

huang lingyin
huang lingyin (infinite stratos)
lingyin huang
lingyin huang (infinite stratos)
lingyin (infinite stratos)
huang (infinite stratos)

- ==== boku no kokoro no yabai yatsu ====

ichikawa kyoutarou
ichikawa kyoutarou (boku no kokoro no yabai yatsu)
kyoutarou ichikawa
kyoutarou ichikawa (boku no kokoro no yabai yatsu)
kyoutarou (boku no kokoro no yabai yatsu)
ichikawa (boku no kokoro no yabai yatsu)

- ==== gatchaman crowds ====

ichinose hajime
ichinose hajime (gatchaman crowds)
hajime ichinose
hajime ichinose (gatchaman crowds)
hajime (gatchaman crowds)
ichinose (gatchaman crowds)

miya utsutsu
miya utsutsu (gatchaman crowds)
utsutsu miya
utsutsu miya (gatchaman crowds)
utsutsu (gatchaman crowds)
miya (gatchaman crowds)

- ==== yurucamp ====

inuyama aoi
inuyama aoi (yurucamp)
aoi inuyama
aoi inuyama (yurucamp)
aoi (yurucamp)
inuyama (yurucamp)

- ==== eromanga sensei ====

izumi sagiri
izumi sagiri (eromanga sensei)
sagiri izumi
sagiri izumi (eromanga sensei)
sagiri (eromanga sensei)
izumi (eromanga sensei)

- ==== little witch academia ====

jasminka antonenko
jasminka antonenko (little witch academia)
antonenko jasminka
antonenko jasminka (little witch academia)
antonenko (little witch academia)
jasminka (little witch academia)

kagari atsuko
kagari atsuko (little witch academia)
atsuko kagari
atsuko kagari (little witch academia)
atsuko (little witch academia)
kagari (little witch academia)

- ==== who framed roger rabbit ====

jessica rabbit
jessica rabbit (who framed roger rabbit)
rabbit jessica
rabbit jessica (who framed roger rabbit)
rabbit (who framed roger rabbit)
jessica (who framed roger rabbit)

- ==== zootopia ====

judy hopps
judy hopps (zootopia)
hopps judy
hopps judy (zootopia)
hopps (zootopia)
judy (zootopia)

- ==== gochuumon wa usagi desu ka? ====

kafuu chino
kafuu chino (gochuumon wa usagi desu ka?)
chino kafuu
chino kafuu (gochuumon wa usagi desu ka?)
chino (gochuumon wa usagi desu ka?)
kafuu (gochuumon wa usagi desu ka?)

kirima syaro
kirima syaro (gochuumon wa usagi desu ka?)
syaro kirima
syaro kirima (gochuumon wa usagi desu ka?)
syaro (gochuumon wa usagi desu ka?)
kirima (gochuumon wa usagi desu ka?)

- ==== witch craft works ====

kagari ayaka
kagari ayaka (witch craft works)
ayaka kagari
ayaka kagari (witch craft works)
ayaka (witch craft works)
kagari (witch craft works)

- ==== brand new animal ====

kagemori michiru
kagemori michiru (brand new animal)
michiru kagemori
michiru kagemori (brand new animal)
michiru (brand new animal)
kagemori (brand new animal)

ogami shirou
ogami shirou (brand new animal)
shirou ogami
shirou ogami (brand new animal)
shirou (brand new animal)
ogami (brand new animal)

- ==== mob psycho 100 ====

kageyama ritsu
kageyama ritsu (mob psycho 100)
ritsu kageyama
ritsu kageyama (mob psycho 100)
ritsu (mob psycho 100)
kageyama (mob psycho 100)

- ==== ao no exorcist ====

kamiki izumo
kamiki izumo (ao no exorcist)
izumo kamiki
izumo kamiki (ao no exorcist)
izumo (ao no exorcist)
kamiki (ao no exorcist)

kirigakure shura
kirigakure shura (ao no exorcist)
shura kirigakure
shura kirigakure (ao no exorcist)
shura (ao no exorcist)
kirigakure (ao no exorcist)

- ==== eizouken ni wa te wo dasu na! ====

kanamori sayaka
kanamori sayaka (eizouken ni wa te wo dasu na!)
sayaka kanamori
sayaka kanamori (eizouken ni wa te wo dasu na!)
sayaka (eizouken ni wa te wo dasu na!)
kanamori (eizouken ni wa te wo dasu na!)
sayaka

- ==== kimetsu no yaiba ====

kanroji mitsuri
kanroji mitsuri (kimetsu no yaiba)
mitsuri kanroji
mitsuri kanroji (kimetsu no yaiba)
mitsuri (kimetsu no yaiba)
kanroji (kimetsu no yaiba)

- ==== delicious party precure ====

kasai amane
kasai amane (delicious party precure)
amane kasai
amane kasai (delicious party precure)
amane (delicious party precure)
kasai (delicious party precure)

- ==== fullmetal alchemist ====

king bradley
king bradley (fullmetal alchemist)
bradley king
bradley king (fullmetal alchemist)
bradley (fullmetal alchemist)
king (fullmetal alchemist)

ling yao
ling yao (fullmetal alchemist)
yao ling
yao ling (fullmetal alchemist)
yao (fullmetal alchemist)
ling (fullmetal alchemist)

nina tucker
nina tucker (fullmetal alchemist)
tucker nina
tucker nina (fullmetal alchemist)
tucker (fullmetal alchemist)
nina (fullmetal alchemist)

selim bradley
selim bradley (fullmetal alchemist)
bradley selim
bradley selim (fullmetal alchemist)
bradley (fullmetal alchemist)
selim (fullmetal alchemist)

winry rockbell
winry rockbell (fullmetal alchemist)
rockbell winry
rockbell winry (fullmetal alchemist)
rockbell (fullmetal alchemist)
winry (fullmetal alchemist)

- ==== sword art online ====

kirigaya suguha
kirigaya suguha (sword art online)
suguha kirigaya
suguha kirigaya (sword art online)
suguha (sword art online)
kirigaya (sword art online)

- ==== juusan kihei bouei ken ====

kisaragi tomi
kisaragi tomi (juusan kihei bouei ken)
tomi kisaragi
tomi kisaragi (juusan kihei bouei ken)
tomi (juusan kihei bouei ken)
kisaragi (juusan kihei bouei ken)

morimura chihiro
morimura chihiro (juusan kihei bouei ken)
chihiro morimura
chihiro morimura (juusan kihei bouei ken)
chihiro (juusan kihei bouei ken)
morimura (juusan kihei bouei ken)

- ==== voiceroid ====

kizuna akari
kizuna akari (voiceroid)
akari kizuna
akari kizuna (voiceroid)
akari (voiceroid)
kizuna (voiceroid)

kotonoha akane
kotonoha akane (voiceroid)
akane kotonoha
akane kotonoha (voiceroid)
akane (voiceroid)
kotonoha (voiceroid)

kotonoha aoi
kotonoha aoi (voiceroid)
aoi kotonoha
aoi kotonoha (voiceroid)
aoi (voiceroid)
kotonoha (voiceroid)

yuzuki yukari
yuzuki yukari (voiceroid)
yukari yuzuki
yukari yuzuki (voiceroid)
yukari (voiceroid)
yuzuki (voiceroid)

- ==== xenosaga ====

kos-mos
kos-mos (xenosaga)

kos-mos ver. 4
kos-mos ver. 4 (xenosaga)

- ==== code geass ====

kouzuki kallen
kouzuki kallen (code geass)
kallen kouzuki
kallen kouzuki (code geass)
kallen (code geass)
kouzuki (code geass)

- ==== kumatanchi ====

kuma-tan
kuma-tan (kumatanchi)

- ==== seikimatsu occult gakuin ====

kumashiro maya
kumashiro maya (seikimatsu occult gakuin)
maya kumashiro
maya kumashiro (seikimatsu occult gakuin)
maya (seikimatsu occult gakuin)
kumashiro (seikimatsu occult gakuin)

- ==== mother 3 ====

kumatora
kumatora (mother 3)

- ==== to love-ru ====

kurosaki mea
kurosaki mea (to love-ru)
mea kurosaki
mea kurosaki (to love-ru)
mea (to love-ru)
kurosaki (to love-ru)

nana asta deviluke
nana asta deviluke (to love-ru)

- ==== love live! ====

kurosawa dia
kurosawa dia (love live!)
dia kurosawa
dia kurosawa (love live!)
dia (love live!)
kurosawa (love live!)

tojo nozomi
tojo nozomi (love live!)
nozomi tojo
nozomi tojo (love live!)
nozomi (love live!)
tojo (love live!)

yazawa nico
yazawa nico (love live!)
nico yazawa
nico yazawa (love live!)
nico (love live!)
yazawa (love live!)

- ==== ghost in the shell ====

kusanagi motoko
kusanagi motoko (ghost in the shell)
motoko kusanagi
motoko kusanagi (ghost in the shell)
motoko (ghost in the shell)
kusanagi (ghost in the shell)

- ==== indie virtual youtuber ====

kusunoki shio
kusunoki shio (indie virtual youtuber)
shio kusunoki
shio kusunoki (indie virtual youtuber)
shio (indie virtual youtuber)
kusunoki (indie virtual youtuber)

whiskey project
whiskey project (indie virtual youtuber)
project whiskey
project whiskey (indie virtual youtuber)
project (indie virtual youtuber)
whiskey (indie virtual youtuber)

- ==== tomb raider ====

lara croft
lara croft (tomb raider)
croft lara
croft lara (tomb raider)
croft (tomb raider)
lara (tomb raider)

- ==== vampire (game) ====

lei lei
lei lei (vampire (game))
lei (vampire (game))

lilith aensland
lilith aensland (vampire (game))
aensland lilith
aensland lilith (vampire (game))
lilith (vampire (game))

morrigan aensland
morrigan aensland (vampire (game))
aensland morrigan
aensland morrigan (vampire (game))
morrigan (vampire (game))

- ==== atelier (series) ====

lila decyrus
lila decyrus (atelier (series))
decyrus lila
decyrus lila (atelier (series))
decyrus (atelier (series))
lila (atelier (series))

- ==== the loud house ====

lincoln loud
lincoln loud (the loud house)
loud lincoln
loud lincoln (the loud house)
lincoln (the loud house)

lola loud
lola loud (the loud house)
loud lola
loud lola (the loud house)
lola (the loud house)

luna loud
luna loud (the loud house)
loud luna
loud luna (the loud house)
luna (the loud house)

- ==== promare ====

lio fotia
lio fotia (promare)
fotia lio
fotia lio (promare)
fotia (promare)
lio (promare)

- ==== space jam ====

lola bunny
lola bunny (space jam)
bunny lola
bunny lola (space jam)
bunny (space jam)
lola (space jam)

- ==== saber marionette j ====

luchs
luchs (saber marionette j)

- ==== waku waku 7 ====

makihara arina
makihara arina (waku waku 7)
arina makihara
arina makihara (waku waku 7)
arina (waku waku 7)
makihara (waku waku 7)

- ==== yuusha to maou ====

maou beluzel
maou beluzel (yuusha to maou)
beluzel maou
beluzel maou (yuusha to maou)
beluzel (yuusha to maou)
maou (yuusha to maou)

- ==== adventure time ====

marceline abadeer
marceline abadeer (adventure time)
abadeer marceline
abadeer marceline (adventure time)
abadeer (adventure time)
marceline (adventure time)
marceline

- ==== mitsudomoe ====

marui mitsuba
marui mitsuba (mitsudomoe)
mitsuba marui
mitsuba marui (mitsudomoe)
mitsuba (mitsudomoe)
marui (mitsudomoe)

- ==== hotel transylvania ====

mavis dracula
mavis dracula (hotel transylvania)
dracula mavis
dracula mavis (hotel transylvania)
dracula (hotel transylvania)
mavis (hotel transylvania)

- ==== summertime render ====

minakata hizuru
minakata hizuru (summertime render)
hizuru minakata
hizuru minakata (summertime render)
hizuru (summertime render)
minakata (summertime render)

- ==== sora yori mo tooi basho ====

miyake hinata
miyake hinata (sora yori mo tooi basho)
hinata miyake
hinata miyake (sora yori mo tooi basho)
hinata (sora yori mo tooi basho)
miyake (sora yori mo tooi basho)

- ==== non non biyori ====

miyauchi renge
miyauchi renge (non non biyori)
renge miyauchi
renge miyauchi (non non biyori)
renge (non non biyori)
miyauchi (non non biyori)

- ==== hajimete no orusuban ====

mizuki shiori
mizuki shiori (hajimete no orusuban)
shiori mizuki
shiori mizuki (hajimete no orusuban)
shiori (hajimete no orusuban)
mizuki (hajimete no orusuban)

- ==== marvel ====

ms. marvel
ms. marvel (marvel)
marvel ms.
marvel ms. (marvel)
marvel (marvel)
ms. (marvel)

shuma gorath
shuma gorath (marvel)
gorath shuma
gorath shuma (marvel)
gorath (marvel)
shuma (marvel)

spider-man
spider-man (marvel)

- ==== go-toubun no hanayome ====

nakano ichika
nakano ichika (go-toubun no hanayome)
ichika nakano
ichika nakano (go-toubun no hanayome)
ichika (go-toubun no hanayome)

nakano itsuki
nakano itsuki (go-toubun no hanayome)
itsuki nakano
itsuki nakano (go-toubun no hanayome)
itsuki (go-toubun no hanayome)

nakano miku
nakano miku (go-toubun no hanayome)
miku nakano
miku nakano (go-toubun no hanayome)
miku (go-toubun no hanayome)

nakano nino
nakano nino (go-toubun no hanayome)
nino nakano
nino nakano (go-toubun no hanayome)
nino (go-toubun no hanayome)

nakano yotsuba
nakano yotsuba (go-toubun no hanayome)
yotsuba nakano
yotsuba nakano (go-toubun no hanayome)
yotsuba (go-toubun no hanayome)

- ==== shokugeki no souma ====

nakiri alice
nakiri alice (shokugeki no souma)
alice nakiri
alice nakiri (shokugeki no souma)
alice (shokugeki no souma)
nakiri (shokugeki no souma)

- ==== overlord (maruyama) ====

narberal gamma
narberal gamma (overlord (maruyama))
gamma narberal
gamma narberal (overlord (maruyama))
gamma (overlord (maruyama))
narberal (overlord (maruyama))

shalltear bloodfallen
shalltear bloodfallen (overlord (maruyama))
bloodfallen shalltear
bloodfallen shalltear (overlord (maruyama))
bloodfallen (overlord (maruyama))
shalltear (overlord (maruyama))

- ==== drifters ====

nasu no yoichi
nasu no yoichi (drifters)

- ==== kaze no tani no nausicaa ====

nausicaa
nausicaa (kaze no tani no nausicaa)

- ==== karakai jouzu no takagi-san ====

nishikata
nishikata (karakai jouzu no takagi-san)

nishikata chii
nishikata chii (karakai jouzu no takagi-san)
chii nishikata
chii nishikata (karakai jouzu no takagi-san)
chii (karakai jouzu no takagi-san)
nishikata (karakai jouzu no takagi-san)

takagawa sumire
takagawa sumire (karakai jouzu no takagi-san)
sumire takagawa
sumire takagawa (karakai jouzu no takagi-san)
sumire (karakai jouzu no takagi-san)
takagawa (karakai jouzu no takagi-san)

- ==== dead or alive ====

nyotengu
nyotengu (dead or alive)

- ==== splatoon (series) ====

octoling girl
octoling girl (splatoon (series))
girl octoling
girl octoling (splatoon (series))
girl (splatoon (series))
octoling (splatoon (series))

- ==== tsuujou kougeki ga zentai kougeki de ni-kai kougeki no okaasan wa suki desu ka? ====

oosuki mamako
oosuki mamako (tsuujou kougeki ga zentai kougeki de ni-kai kougeki no okaasan wa suki desu ka?)
mamako oosuki
mamako oosuki (tsuujou kougeki ga zentai kougeki de ni-kai kougeki no okaasan wa suki desu ka?)
mamako (tsuujou kougeki ga zentai kougeki de ni-kai kougeki no okaasan wa suki desu ka?)
oosuki (tsuujou kougeki ga zentai kougeki de ni-kai kougeki no okaasan wa suki desu ka?)

oosuki masato
oosuki masato (tsuujou kougeki ga zentai kougeki de ni-kai kougeki no okaasan wa suki desu ka?)
masato oosuki
masato oosuki (tsuujou kougeki ga zentai kougeki de ni-kai kougeki no okaasan wa suki desu ka?)
masato (tsuujou kougeki ga zentai kougeki de ni-kai kougeki no okaasan wa suki desu ka?)
oosuki (tsuujou kougeki ga zentai kougeki de ni-kai kougeki no okaasan wa suki desu ka?)

- ==== kill me baby ====

oribe yasuna
oribe yasuna (kill me baby)
yasuna oribe
yasuna oribe (kill me baby)
yasuna (kill me baby)
oribe (kill me baby)

- ==== maison ikkoku ====

otonashi kyouko
otonashi kyouko (maison ikkoku)
kyouko otonashi
kyouko otonashi (maison ikkoku)
kyouko (maison ikkoku)
otonashi (maison ikkoku)

- ==== tales of (series) ====

patty fleur
patty fleur (tales of (series))
fleur patty
fleur patty (tales of (series))
fleur (tales of (series))
patty (tales of (series))

- ==== les chevaucheurs ====

phenice walholl
phenice walholl (les chevaucheurs)
walholl phenice
walholl phenice (les chevaucheurs)
walholl (les chevaucheurs)
phenice (les chevaucheurs)

- ==== bloodborne ====

plain doll
plain doll (bloodborne)
doll plain
doll plain (bloodborne)
doll (bloodborne)
plain (bloodborne)

- ==== gake no ue no ponyo ====

ponyo
ponyo (gake no ue no ponyo)

- ==== silent hill (series) ====

pyramid head
pyramid head (silent hill (series))
head pyramid
head pyramid (silent hill (series))
head (silent hill (series))
pyramid (silent hill (series))

- ==== ranma 1/2 ====

ranma-chan
ranma-chan (ranma 1/2)

saotome ranma
saotome ranma (ranma 1/2)
ranma saotome
ranma saotome (ranma 1/2)
ranma (ranma 1/2)
saotome (ranma 1/2)

- ==== gabriel dropout ====

raphiel shiraha ainsworth
raphiel shiraha ainsworth (gabriel dropout)

satanichia kurumizawa mcdowell
satanichia kurumizawa mcdowell (gabriel dropout)

- ==== tate no yuusha no nariagari ====

raphtalia
raphtalia (tate no yuusha no nariagari)

- ==== recettear ====

recette lemongrass
recette lemongrass (recettear)
lemongrass recette
lemongrass recette (recettear)
lemongrass (recettear)
recette (recettear)

- ==== kantai collection ====

rensouhou-chan
rensouhou-chan (kantai collection)

shimakaze-kun
shimakaze-kun (kantai collection)

- ==== high school dxd ====

rias gremory
rias gremory (high school dxd)
gremory rias
gremory rias (high school dxd)
gremory (high school dxd)
rias (high school dxd)

- ==== tensei shitara slime datta ken ====

rimuru tempest
rimuru tempest (tensei shitara slime datta ken)
tempest rimuru
tempest rimuru (tensei shitara slime datta ken)
tempest (tensei shitara slime datta ken)
rimuru (tensei shitara slime datta ken)

- ==== uzaki-chan wa asobitai! ====

sakurai shin'ichi
sakurai shin'ichi (uzaki-chan wa asobitai!)
shin'ichi sakurai
shin'ichi sakurai (uzaki-chan wa asobitai!)
shin'ichi (uzaki-chan wa asobitai!)
sakurai (uzaki-chan wa asobitai!)

uzaki hana
uzaki hana (uzaki-chan wa asobitai!)
hana uzaki
hana uzaki (uzaki-chan wa asobitai!)
hana (uzaki-chan wa asobitai!)
uzaki (uzaki-chan wa asobitai!)

uzaki tsuki
uzaki tsuki (uzaki-chan wa asobitai!)
tsuki uzaki
tsuki uzaki (uzaki-chan wa asobitai!)
tsuki (uzaki-chan wa asobitai!)

- ==== senpai ga uzai kouhai no hanashi ====

sakurai touko
sakurai touko (senpai ga uzai kouhai no hanashi)
touko sakurai
touko sakurai (senpai ga uzai kouhai no hanashi)
touko (senpai ga uzai kouhai no hanashi)
sakurai (senpai ga uzai kouhai no hanashi)

- ==== saenai heroine no sodatekata ====

sawamura spencer eriri
sawamura spencer eriri (saenai heroine no sodatekata)

- ==== ojamajo doremi ====

segawa onpu
segawa onpu (ojamajo doremi)
onpu segawa
onpu segawa (ojamajo doremi)
onpu (ojamajo doremi)
segawa (ojamajo doremi)

senoo aiko
senoo aiko (ojamajo doremi)
aiko senoo
aiko senoo (ojamajo doremi)
aiko (ojamajo doremi)
senoo (ojamajo doremi)

- ==== hellsing ====

seras victoria
seras victoria (hellsing)
victoria seras
victoria seras (hellsing)
victoria (hellsing)
seras (hellsing)

- ==== valkyrie drive ====

shigure kasumi
shigure kasumi (valkyrie drive)
kasumi shigure
kasumi shigure (valkyrie drive)
kasumi (valkyrie drive)
shigure (valkyrie drive)

- ==== gridman universe ====

shinjou akane
shinjou akane (gridman universe)
akane shinjou
akane shinjou (gridman universe)
akane (gridman universe)
shinjou (gridman universe)

takarada rikka
takarada rikka (gridman universe)
rikka takarada
rikka takarada (gridman universe)
rikka (gridman universe)
takarada (gridman universe)

- ==== gakuen idolmaster ====

shinosawa hiro
shinosawa hiro (gakuen idolmaster)
hiro shinosawa
hiro shinosawa (gakuen idolmaster)
hiro (gakuen idolmaster)
shinosawa (gakuen idolmaster)

- ==== nitroplus ====

super pochaco
super pochaco (nitroplus)
pochaco super
pochaco super (nitroplus)
pochaco (nitroplus)

super sonico
super sonico (nitroplus)
sonico super
sonico super (nitroplus)
sonico (nitroplus)

- ==== mahou shoujo (raita) ====

suzuhara misae
suzuhara misae (mahou shoujo (raita))
misae suzuhara
misae suzuhara (mahou shoujo (raita))
misae (mahou shoujo (raita))
suzuhara (mahou shoujo (raita))

- ==== super robot wars ====

suzuka hime
suzuka hime (super robot wars)
hime suzuka
hime suzuka (super robot wars)
hime (super robot wars)
suzuka (super robot wars)

- ==== choujuushin gravion ====

tachibana mizuki
tachibana mizuki (choujuushin gravion)
mizuki tachibana
mizuki tachibana (choujuushin gravion)
mizuki (choujuushin gravion)
tachibana (choujuushin gravion)

- ==== eyeshield 21 ====

taki suzuna
taki suzuna (eyeshield 21)
suzuna taki
suzuna taki (eyeshield 21)
suzuna (eyeshield 21)
taki (eyeshield 21)

- ==== new game! ====

takimoto hifumi
takimoto hifumi (new game!)
hifumi takimoto
hifumi takimoto (new game!)
hifumi (new game!)
takimoto (new game!)

- ==== working!! ====

taneshima popura
taneshima popura (working!!)
popura taneshima
popura taneshima (working!!)
popura (working!!)
taneshima (working!!)

yamada aoi
yamada aoi (working!!)
aoi yamada
aoi yamada (working!!)
aoi (working!!)
yamada (working!!)

- ==== youjo senki ====

tanya degurechaff
tanya degurechaff (youjo senki)
degurechaff tanya
degurechaff tanya (youjo senki)
degurechaff (youjo senki)
tanya (youjo senki)

- ==== tild - mage a louer ====

tild framith
tild framith (tild - mage a louer)
framith tild
framith tild (tild - mage a louer)
framith (tild - mage a louer)
tild (tild - mage a louer)

- ==== wreck-it ralph ====

vanellope von schweetz
vanellope von schweetz (wreck-it ralph)

- ==== fallout (series) ====

vault girl
vault girl (fallout (series))
girl vault
girl vault (fallout (series))
girl (fallout (series))
vault (fallout (series))

- ==== scooby-doo ====

velma dinkley
velma dinkley (scooby-doo)
dinkley velma
dinkley velma (scooby-doo)
dinkley (scooby-doo)
velma (scooby-doo)

- ==== catherine (game) ====

vincent brooks
vincent brooks (catherine (game))
brooks vincent
brooks vincent (catherine (game))
brooks (catherine (game))
vincent (catherine (game))

- ==== addams family ====

wednesday addams
wednesday addams (addams family)
addams wednesday
addams wednesday (addams family)
addams (addams family)
wednesday (addams family)

- ==== wii fit ====

wii fit trainer
wii fit trainer (wii fit)

- ==== jigokuraku ====

yamada asaemon sagiri
yamada asaemon sagiri (jigokuraku)

- ==== the ring ====

yamamura sadako
yamamura sadako (the ring)
sadako yamamura
sadako yamamura (the ring)
sadako (the ring)
yamamura (the ring)

- ==== shirobako ====

yano erika
yano erika (shirobako)
erika yano
erika yano (shirobako)
erika (shirobako)
yano (shirobako)

- ==== yuru yuri ====

yoshikawa chinatsu
yoshikawa chinatsu (yuru yuri)
chinatsu yoshikawa
chinatsu yoshikawa (yuru yuri)
chinatsu (yuru yuri)
yoshikawa (yuru yuri)

- ==== yukijirushi ====

yukico-tan
yukico-tan (yukijirushi)

- ==== yahari ore no seishun lovecome wa machigatteiru. ====

yukinoshita yukino
yukinoshita yukino (yahari ore no seishun lovecome wa machigatteiru.)
yukino yukinoshita
yukino yukinoshita (yahari ore no seishun lovecome wa machigatteiru.)
yukino (yahari ore no seishun lovecome wa machigatteiru.)
yukinoshita (yahari ore no seishun lovecome wa machigatteiru.)

- ==== moyashimon ====

yuuki kei
yuuki kei (moyashimon)
kei yuuki
kei yuuki (moyashimon)
kei (moyashimon)
yuuki (moyashimon)

- ==== voicevox ====

zundamon
zundamon (voicevox)

- ==== pikmin (series) ====

red pikmin
red pikmin (pikmin (series))
pikmin red
pikmin red (pikmin (series))
red (pikmin (series))
pikmin

yellow pikmin
yellow pikmin (pikmin (series))
pikmin yellow
pikmin yellow (pikmin (series))
yellow (pikmin (series))

blue pikmin
blue pikmin (pikmin (series))
pikmin blue
pikmin blue (pikmin (series))
blue (pikmin (series))

- ==== unsorted ====

2channel
ace attorney
addams family
among us
ano hi mita hana no namae wo bokutachi wa mada shiranai.
ao no exorcist
ar tonelico
atelier (series)
avatar legends
avatar: the last airbender
axis powers hetalia
battle tendency
bayonetta (series)
big hero 6
bioshock (series)
bishoujo senshi sailor moon
bleach
bloodborne
bloodstained: ritual of the night
blue lock
boku dake ga inai machi
boku no kokoro no yabai yatsu
boku wa tomodachi ga sukunai
brand new animal
bravely default (series)
castlevania (series)
coca-cola
code geass
coppelion
cowboy bebop
crash bandicoot (series)
cyberbots
cyberpunk (series)
cygames
dagashi kashi
danganronpa (series)
dark souls (series)
dead or alive
dead rising
delicious party precure
devil may cry (series)
diablo (series)
dohna dohna issho ni warui koto o shiyou
dragon quest
dragon's dogma
drifters
dungeon ni deai wo motomeru no wa machigatteiru darou ka
dungeons & dragons
elden ring: shadow of the erdtree
elsword
eromanga sensei
escape from tarkov
eyeshield 21
fantasy bishoujo juniku ojisan to
fate (series)
fate/kaleid liner prisma illya
fullmetal alchemist
futabu
gabriel dropout
gake no ue no ponyo
gakuen idolmaster
gatchaman crowds
ghost in the shell
girls und panzer
go-toubun no hanayome
goddess of victory: nikke
gravity falls
gridman universe
guardian tales
gundam
hacka doll
hajimete no orusuban
harry potter (series)
hazbin hotel
hellsing
high school dxd
honkai (series)
hotel transylvania
houkago teibou nisshi
infinite stratos
inside out
iron saga
jigokuraku
jojo no kimyou na bouken
juusan kihei bouei ken
kaguya-sama wa kokurasetai ~tensai-tachi no renai zunousen~
kamen rider
karakai jouzu no takagi-san
kaze no tani no nausicaa
kidou senkan nadesico
kimetsu no yaiba
kirby (series)
kumatanchi
kuroinu ~kedakaki seijo wa hakudaku ni somaru~
last exile
les chevaucheurs
little nightmares
little witch academia
love plus
love r
lucky star
lyrical nanoha
magi the labyrinth of magic
magia record: mahou shoujo madoka magica gaiden
mahou shoujo madoka magica
maison ikkoku
maplestory
marvel
mega man (series)
melonbooks
metal gear (series)
metal slug
microsoft
microsoft windows
minecraft
mob psycho 100
monogatari (series)
monster hunter (series)
monster musume no iru nichijou
mother 3
moyashimon
mushoku tensei
my little pony
naruto (series)
neon genesis evangelion
neptune (series)
new horizon
nier (series)
ninja slayer
non non biyori
ojamajo doremi
ore no imouto ga konna ni kawaii wake ga nai
os-tan
panty & stocking with garterbelt
persona
phantasy star
power rangers
pretty series
professor layton
promare
pui pui molcar
ranma 1/2
rayman (series)
rayman origins
re:zero kara hajimeru isekai seikatsu
rosario+vampire
saber marionette j
saenai heroine no sodatekata
sakura taisen
sankarea
sanrio
sansha san'you
saru getchu
science adventure
scooby-doo
seiken densetsu
seikimatsu occult gakuin
sekai seifuku: bouryaku no zvezda
sekaiju no meikyuu
senpai ga uzai kouhai no hanashi
shantae (series)
she-ra and the princesses of power
shijou saikyou no deshi ken'ichi
shimoneta to iu gainen ga sonzai shinai taikutsu na sekai
shingeki no kyojin
shirobako
shokugeki no souma
sonic (series)
sono bisque doll wa koi wo suru
sora yori mo tooi basho
space jam
star ocean
star vs the forces of evil
star wars
steins;gate
streets of rage
strike witches
summertime render
super robot wars
super smash bros.
sword art online
tales of (series)
tangled
tate no yuusha no nariagari
teenage mutant ninja turtles
tensei shitara slime datta ken
tensui no sakuna-hime
tera online
the elder scrolls
the grim adventures of billy & mandy
the king of fighters
the loud house
the owl house
the ring
the seven deadly sins
the witcher (series)
tild - mage a louer
time bokan (series)
to love-ru
tomb raider
tongkkangi
type-moon
valkyrie drive
virtual ant channel
voiceroid
voicevox
vrchat
waku waku 7
warhammer 40k
who framed roger rabbit
wii fit
witch craft works
witches of africa
wizarding world
world witches series
wreck-it ralph
xenoblade chronicles (series)
xenogears
xenosaga
yahari ore no seishun lovecome wa machigatteiru.
yoru no yatterman
youjo senki
youkai watch
yukijirushi
yurucamp
yuusha no kuse ni namaiki da
yuusha to maou
zombie land saga
zootopia
kimi no koto ga dai dai dai dai daisuki na 100-nin no kanojo
lobotomy corporation

arato nagi (ruri no houseki)
arato nagi (ruri rocks)
arato nagi
nagi arato (ruri no houseki)
nagi arato (ruri rocks)
nagi arato

teto kasane

bayonetta (bayonetta)
bayonetta (bayonetta 2)
bayonetta (bayonetta 3)

keldeo (resolute form)
keldeo (resolute form) (pokemon)

robin (stardew valley)

natsuki (amazon)

amazon (goblin slayer)
amazon warrior (goblin slayer)

amazon (gotta protectors)

amazon (mamotte knight)

- ==== none ====

lilac (squirtle)

bessie (squirtle)

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
2d dream magazine
abe shinzou
absalom
activision
agro
aiassis
aiba manami
aikatsu
aikatsu (series)
aikatsu stars
airi shiyoji
airy
akaba hayato
akehoshi setsuka
alduin
aleste
alexandrian soldier
alice the rabbit
alolan form
alpha pokemon
amalia
amami miharu
amamiya mimori
amenouzume
amy wong
ancient elchulus
animal crossing boy
animal crossing new leaf
anna bonnie
anon
anonymous
anti-chan
aoi cameron
aono remi
apopis
ar tonelico i
arachnid
arc system works
archie comics
archigram
arella roth
arms note
astlibra revision
atelier ryza
atelier ryza 1
atlus
avatar the last airbender
b.b. hood
babyroom
background character
bad dragon
badnik
bakemonogatari
barbaroi
battletoads
beast boy
beedle
bel
belle delphine
betilla
bioshock
bito raimu
bitores mendez
blazblue: continuum shift
bloodstained (series)
bloody roar 4
bobby brady
bocchi the rock
bokura wa mahou shounen
boruto: naruto next generations
brainsucker
brandon
brave sword x blaze soul
bravely default: flying fairy
brother and sister
bulma briefs
bunzo bunny
c-01 permit
calamitas
calamity mod
canavalia
capella emerada lugnica
carnival phantasm
castlevania: portrait of ruin
catholic
charlotta fenia
chatalie
chinese mythology
chinese new year
christianity
chrono (series)
cidney aurum
ciel ushi
cindy brady
comic rin
converse
copyright request
creatures inc.
crest worm
cyberpunk edgerunners
dark elf beastmaster
dark queen
dark souls i
dark souls ii
darkstalkers 3
date makiko
dead or alive 5
dead or alive 6
dead rising 2
death abyss
debauchery shopping mall
dehaka
demia duodectet
demon hunter
devil may cry 3
diablo 3
digimon savers
digimon story: cyber sleuth
dingodile
disgaea 3
dissidia final fantasy
diva mizuki
dmc
domestic pig
dorothy sofiel
dr pepper
draenei
dragon ball gt
dragon ball super
dragon ball super super hero
dragon humanoid
dragon quest x
dragon quest xi
dragon's dogma (series)
dragonball z
draph
dreamworks
dreamworks dragons
drowtales
dunkmaster darius
dunkmaster series
durarara
earthbound
easter
ebichu
eeveelution
eiyuu senki ww
elchulus
elder women x little boy generation 2nd
elemental
elf village
eliminator
embodiment of scarlet devil
eonbound
espella cantabella
etrian odyssey
evolutionary line
f.o.e.
fakku
fallout 3
fallout 4
fan character
farah
fate ()
fate\kaleid liner prisma illya
fateapocrypha
fateextella
fateextra ccc
fatestay night
fear & hunger (series)
fear & hunger 2: termina
fel hunter
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
fire emblem awakening
fire emblem fates
fire emblem heroes
fire emblem: path of radiance
fire emblem: the binding blade
fire emblem: the blazing blade
fire emblem: the sacred stones
fire emblem: three houses
firecracker tristana
fossil pokemon
fran cervice
freia stormbringer
fresh precure
friendship is magic
fromsoftware
funou
furinji miu
furuya chihiro
futurama
galarian form
galliform
genkai tokki: seven pirates
gensou seibutsu zukan
gensou seibutsu zukan 6
gentle criminal
gerudo link
gg aleste
gg aleste 3
ghost in the shell: stand alone complex
giant panda
gigantamax pokemon
gm orangeade
gnar
gochuumon wa usagi desu ka
goth annie
gotta protectors : amazon's running diet
grand knights history
grandia i
green yoshi
greg brady
grovyle the thief
gruftine
grunkle stan
guilty gear strive
guilty gear xrd
gundam build fighters
gundam build fighters try
gundam gquuuuuux
gundam hathaway's flash
gundam suisei no majo
gwendolyn tennyson
gyanko
gym leader
gyroid
h siyo
hakase fuyuki (2nd costume)
half naked
haneyama kazuho
hanna-barbera
hans taubemann
harukaze poppu
hasbro
hataraku saibou black
haumea
hawkgirl
hayato akaba
hazama eri
hearthstone
heat soft
helen kent
helldivers 2
hello kitty
hibino eikichi
hikami satori
hilda the hyena
hisuian form
holidays
holly lingerbean
hong ryu kang
hooters
houtengeki's elf girl
how to train your dragon (series)
how to train your dragon 1
hub lass
hub provisions lass
hudson soft
humbert humbert
hylian
hyouryuu kangoku chronos
iana kalashnikov
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
imadake dabuchi tabemi
impaled
injuu kangoku
itsuno mani koukannikki
ittle dew (series)
ixtab felfall
j7w village
jadf-tan
jan brady
jane romero
jeanne gado
jenny burtory
jenny fox
jikkyou powerful pro yakyuu
jimmy
jk bitch ni shiboraretai
jon talbain
k-on
kadokawa shoten
kaeli cedarfallen
kagayama kaede
kaibara makoto
kalumiya
kamen rider 01 (series)
kaminaki sekai no kamisama katsudou
kaneshiro junya
karasuma sachiko
kardia of rhodes
karyn urtsakar
kawahoshi homura
kda akali
kemono friends 3
kenzen hentai seikatsu no susume
kevin-san no milk bokujou
kim greasegear
king round
kingdom hearts iii
kinoshita matsuri
kinoshita miki
kirara mami
kirby 64
kirby 64: the crysta shards
kirisame kagura
kirishima nagi
kitakoji hisui (1st costume)
kizumonogatari
kodomo doushi
kujou miina
kurobane alice
kurosuzu mio
kyochuu rettou
kyoryu sentai zyuranger
lab zero games
labelle able
lady liadrin
lalafell
lana loud
laz-kun
legacy series
legend of zelda
legendary pokemon
lepsus
level-5
li li stormstout
li xiaolang
li-ming
lilinea la-sahran
lilith-soft
linea alba
lisa
liz glover
loid forger
lord raptor
love live
love live school idol project
love live sunshine
lucille aura nova
lulu the fae sorceress
lunar new year
lunar revel series
madou monogatari
maezono chihaya
maezono chihiro
maezono chika
maezono chinami
maezono chizuru
magical momo
magipink
mahou sentai magiranger
makai kingdom
makai senki disgaea 2
makai senki disgaea 5
maplestory 2
marcia brady
marvel comics
mary lou callaway
master raven
mcdonald's dad
mecha dehaka
mega evolution
mega man battle network
mega man battle network (series)
mega man legends
mega man star force (series)
meikoku gakuen jutai hen: onegaishimasu...... sensei no seieki de
melty blood
mercedes marten
mesuinu hatsujou ki
metal gear solid v: the phantom pain
metal slug 2
metroid larva
metroid: zero mission
meyumi nuyasaka
mighty morphin power rangers
mighty morphin yellow ranger
mimic chest
minahara yuki
mirabell bell
miraitowa
miss fortune
mita kazhi
mitsudomoe (manga)
miyamoto musashi
miyauchi ai
miyauchi erina
miyauchi hina
miyauchi iori
miyauchi kaoru
miyauchi ushio
miyu edelfelt (magical girl)
mizusaki mamoru
mobian bat
mobian cat
mobian hedgehog
mobian rabbit
mobile suit gundam
mochizuki azami
momo de fleuve
momo mizrahi
momozono ayumi
mon-musu quest: paradox
mon-yu
monkey island
monotreme
monster hunter rise
monster hunter: world
monster tamer lulu
monster tamer series
morgan rizilia
morimoto chio's mother
morumi
mother (series)
mr x
muchimuchi-san
munakata hoshi
munakata momone
munakata suika
murid
murine
myrthe
mythical pokemon
na-na-mi wonderland
naruto shippuuden
naruto: road to ninja
nega-shantae
nekomonogatari
new game
new super mario bros. u deluxe
new year
nickelodeon
nicole the lynx
nidoran♂
nier: automata
nijigen dream magazine
nijisanji en
nilo
nimpi
nintendo 3ds
nintendo ds
nintendo switch
nippon ichi
nippon ichi software
nisemonogatari
no man's land
nonomura uriko
noxus poppy
npc trainer
octi
odagiri kaito
odahving
ogami yugo
one (manga)
one piece film: red
one piece film: z
one piece: strong world
onii-chan wa oshimai
oribe mutsumi
osiris
ouma ga toki: tasogare ni kemuru shoujo
oyama miyabi
paarthurnax
pal (species)
palagia
panda delgado
pandaren
pantherine
paranormasight: the seven mysteries of honjo
parasite in city
peewee
peko
persona 3
persona 4
persona 5 scramble: the phantom strikers
persona 5 the royal
peter brady
phalia
phantasy star online 2
phantasy star online 2 new genesis
phasmophobia
phessian
pixar
plant 42
pool party lulu
pool party poppy
pool party series
poppy playtime
portia
power pro kun pocket
pram
prank-kids
prank-kids rocksies
pretty cure
princess amalia sheran sharm
princess angelica
princess bubblegum
princess claire
princess sefia
pripara
procyonid
project x zone
psykos
puyo
queen opala
quetzalpetlatl
raccoon
rachel roth
rebecca chang
religion
rider
rijiato
riley andersen
rita repulsa
rito
robbie valentino
robot neoanthropinae polynian
rodent
rondine
rosen garten saga
rowdy blue
rumi usagiyama
ryoko
ryuuou no oshigoto
sable able
saikawa sanae
saki (manga)
sakurai shinichi
salvatore
sameko saba
sanka aria
sato rumi
school for vampires
sciurid
scraggle
seigi no henshin-heroine wo sasaeru ore to aku no onna-kanbu
seikon no arcana
sekaiju no meikyuu 3
sekaiju no meikyuu 5
sekaiju no meikyuu x
selfie pose
senran kagura estival versus
servbot
shadow pokemon
shadow siren
shantae: half-genie hero
shiiko sugai
shin sakura taisen
shingoku no valhalla gate
shiny pokemon
shirahama azusa
shooty
shou tucker
shounen jump
shueisha
sin nanatsu no taizai
sister of battle
skulltula
slap city
snakai
snapchat
snk
sole survivor
someity
sona buvelle
sonic adventure 2
sonic boom
sonic satam
sonic team
sonic the hedgehog (series)
sonic unleashed
soos
sophia peronica
sopra amane
soraka
space invaders
spider-man (series)
spy vs spy
spyro the dragon
ssss.gridman
stacey
stacey forsythe
star guardian series
star ocean the second story
star wars: the clone wars
starcraft 2
starry night
sticks the jungle badger
sticks the tejon
stoneborn
street fighter 6
street fighter ii (series)
street fighter iv (series)
street fighter v
studio ghibli
suiei no ato no shower
suina
summer in mara
sunny-sue ellen
sunsoft
super mutant
super robot wars og saga mugen no frontier
super sentai
sword art online alternative: gun gale online
taito
takamiya rion (4th costume)
takase miyuki
tales of vesperia
tanooki peach
tanuki peach
tari numenesse
team shanghai alice
tenga
the brady kids
the deadly six
the elder scrolls iv: oblivion
the elder scrolls v: skyrim
the great ace attorney
the great ace attorney 2: resolve
the grind series
the king of fighters xv
the legend of korra
the ninja warriors once again
the super mario bros. movie
the wind waker
the wonderful 101
tiaplate
time bokan
tiona hiryute
tione hiryute
to love-ru darkness
toad
toaru daikazoku no okazu jijou: mamagawari onee-chan funtouki
tobi-kadachi
tobias gregson
togruta
tokimeki pink
tokyo houkago summoners
toori no fukken
tooru hagakure
tooru hagakure (visible)
toph beifong
toradora
totsuzen kaijin ken jimuin no ore ga mahou shoujo-tachi o otosu hanashi
toy hole
tron bonne
tsubabi tempest
tsukagami alice
tsuujou kougeki ga zentai kougeki de ni-kai kougeki no okaasan wa suki desu ka
twilight princess
tyr beq
tzuyin hsieh
ubisoft
uehara shikanosuke
ultra beast
ultralisk
umanami
ursula callistis
urushibara luka
uzaki-chan wa asobitai
v yuusha no kuse ni namaiki da r
valkyrie drive -mermaid-
valla
vanillaware
vault dweller
vault meat
vechy
veigal
venus de milo
vermana
vigilante -boku no hero academia: illegals-
vijounne
viperious
visions of mana
waccha primagi
wai-cactusharlot
wakaba megumi
warlock
watashi ni tenshi ga maiorita
wcdonald's
white silk
whitefrost dragonewt filene
william birkin
wind waker
wolf and parchment
world of warcraft
xaessya
xanthous king jeremiah
xenoblade (series)
xenosaga episode iii
yamabuki naoko
yo-kai watch
yokoyama miho
youkai watch jam: youkai gakuen y
your witch alba
yu-gi-oh duel monsters
yuna
yuruyuri
zafina
zeena
zephyr winds
zerg
zoku owarimonogatari
zordon
cyberpunk 2077
dragon quest iii
trials of mana
haachaama
lady dimitrescu
lana's sister (pokemon)
pikminred
pikminyellow
pikminblue
scarlet crusade
astolfo (saber)
gerudo set (zelda)
stealth set (zelda)
gaia (mythology)
rosalina (touring)
`;

//(none is not a real franchise, some floating entries simply do not have a franchise, such as 'cerberus' which is a character name and a proper tag.)
