// ============================================================================
//  aliasDB — display name -> codename
// ============================================================================
//
//  Registered BOTH dotted and bare by buildCharacterIndex, so `angelica` and
//  `.angelica` both work.
//
//  ---------------------------------------------------------------------------
//  Syrup Town cast: point at the SYRUP STEM, not at a form
//  ---------------------------------------------------------------------------
//  Updated 2026-08-15 with the charactersDB reorganisation. Most of the cast
//  exists twice — `.furMayor` and `.fleshyMayor` — and `.syrupMayor` is the name
//  of the PAIR rather than an entry. The engine picks the form: `.fur` by
//  default, `.fleshy` when the prompt types `not furry`.
//
//  So a display name resolves to the STEM and stays mode-agnostic. Pointing
//  `Angelica` at `FurMayor`, as this file used to, meant typing her name always
//  got the furry form and `not furry` did nothing.
//
//  An explicit `Fur…` or `Fleshy…` alias still points at that FORM directly.
//  That is the escape hatch for forcing one, and it is why those lines were not
//  converted with the rest.
//
//  A universal character — same in both modes — has no pair and is written once
//  as `.syrupYu`. The stem resolves to itself, so nothing here needs to know
//  which characters are universal.
// ============================================================================

var aliasArray = `
-/ Syrup Town cast — display names resolve to the pair, not to a form
Angelica; SyrupMayor
Mayor; SyrupMayor
Cayenne; SyrupCarp
Carpenter; SyrupCarp
SyrupCarpenter; SyrupCarp
Bluebell; SyrupShop
Shopkeep; SyrupShop
SyrupShopkeep; SyrupShop
Garnet; SyrupFoxF
Foxf; SyrupFoxF
Jasper; SyrupFoxM
Foxm; SyrupFoxM
Sorbet; SyrupWolf
Sharly; SyrupSado
Sado; SyrupSado
Sadogato; SyrupSado
SyrupSadogato; SyrupSado
Mary-Lou; SyrupMilf
Mary-lou; SyrupMilf
MaryLou; SyrupMilf
Marylou; SyrupMilf
Khanna; SyrupNun
Marlow; SyrupMesu
Riley; SyrupFash
Fashionista; SyrupFash
SyrupFashionista; SyrupFash
Helena; SyrupHyena
SyrupHelena; SyrupHyena
Nutmeg; SyrupDoe
Cinnamon; SyrupMommy
Wilf; SyrupWilf
Silf; SyrupSilf
Succabus; SyrupSuccabus

-/ Forcing a form. These bypass the stem on purpose.
FurCarpenter; FurCarp
FurSadogato; FurSado
FurFashionista; FurFash
FurHelena; FurHyena
FleshyCarpenter; FleshyCarp
FleshySadogato; FleshySado
FleshyFashionista; FleshyFash
FleshyHelena; FleshyHyena
`
