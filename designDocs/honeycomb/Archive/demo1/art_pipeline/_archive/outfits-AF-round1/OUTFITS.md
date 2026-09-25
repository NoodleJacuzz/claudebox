# Honeycomb alternate outfits — A–F (2026-09-14)

**Brainstorm, not data.** All sixteen alternate outfits, six designs each (A–F, **96 total**). Replaces
`OUTFITS-01.md` and `OUTFITS-02.md`. Outfits are alphabetical inside each character. The machine-readable
source is `outfit-designs.js`; the test runner is `outfits-generate.js`. **Nothing here is in `charactersDB.js`.**

Source: `honeycomb-content-characters.js` `outfitArray` (the themes) and the `*default` lines in
`charactersDB.js` (the prompt shape). The placeholder hue shifts are ignored — palettes are chosen for the theme.

| Set | Idea |
|---|---|
| **A** | core look, recoloured/re-dressed; **haircut changed** (see the design) |
| **B** | **new colour palette and swapped weapon(s)** over the same idea |
| **C** | **original** concept; the default outfit is ignored |
| **D** | **lewd A** — the overt exposure identity (the only set allowed bikini / mostly-nude / see-through) |
| **E** | **lewd B** — peeks and teases; partial reveals, slits and gaps |
| **F** | **lewd C** — hypersexualised; harnesses, corsets, bondage and body-control |

Conventions: ornaments as `[colour] [object] [location] ornament`; carried things positioned; a `!tag`
removes a trait the entry injects (the A-set haircut, a swapped prop). `tagsV` / `tagsC` are added only for that
sex — the gendered lewd tags live there (`cleavage` / `breasts` for V, `bulge` / penis family for C). Every D/E/F
design carries at least one **real** lewd tag and at least one **invented** one (marked `†`, not in any dictionary
or booru). All 96 compile with nothing culled.


---

## Brienne — `knight` (Warrior)

Default core: white bodysuit, red capelet, knight visor / visor up, single pauldron and pantsleg, buckler.

### `almoner`

**A** — *Tithe — the almsgiving knight; hair changed to a braided bun*

```
almoner; white dress, gold-trim dress, gold-trim capelet, gold cuffs, gold shoes, knight visor, visor up, gold pauldron, single pantsleg, gold shield, holding bowl, gold pouch, holding coin, cross print, !ponytail, braided bun
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress, torn capelet`

**B** — *recoloured blue/silver; shield replaced with a mace*

```
almoner; blue dress, silver-trim dress, silver-trim capelet, silver cuffs, silver shoes, knight visor, visor up, silver pauldron, single pantsleg, large shield, holding bowl, silver pouch, holding coin, halo, crown, mace
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress, torn capelet`

**C** — *priest-queen (original)*

```
almoner; gold armor, gold dress, long dress, gold-trim capelet, gold cuffs, halo, holding cup, gold shield, gold shoes, crown, cross print
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — gilded exposure*

```
almoner; gold dress, micro bikini, see-through clothes, pasties, crotchless panties, navel, halo, crown, holding coin, `giltglass bodice`†, !ponytail, braided bun
```
- female only: cleavage, underboob
- male only: penis outline
- TornDamage: `torn dress`

**E** — *lewd B — the collection-day tease*

```
almoner; blue dress, silver-trim dress, downblouse, side slit, silver cuffs, halo, crown, holding coin, silver pouch, `almostslip hem`†
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**F** — *lewd C — the worship-engine*

```
almoner; gold armor, gold dress, harness, o-ring top, corset, collar, chain, cross print, holding cup, `vicecorset`†
```
- female only: cleavage, nipples
- male only: erection under clothes
- TornDamage: `torn dress`

### `bastion`

**A** — *Sentinel — the immovable wall; hair changed to a bob cut*

```
bastion; steel armor, steel bodysuit, strapless bodysuit, blue capelet, steel gauntlet, steel boots, asymmetrical legwear, knight visor, visor up, steel pauldron, single pantsleg, large shield, brown belt, !ponytail, !forelocks, bob cut
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn bodysuit, torn capelet, crotch tear`

**B** — *recoloured bronze/black; shield replaced with a greataxe*

```
bastion; bronze armor, black bodysuit, strapless bodysuit, black capelet, bronze gauntlet, bronze boots, asymmetrical legwear, knight visor, visor up, bronze pauldron, single pantsleg, greataxe, belt, power armor
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn bodysuit, torn capelet`

**C** — *gate guardian (original)*

```
bastion; stone armor, power armor, helmet, visor down, large shield, chains, mechanical legs, armored boots, belt, cape, mace
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn armor`

**D** — *lewd A — the plated bodysuit, opened*

```
bastion; steel bodysuit, see-through clothes, plunging neckline, side cutout, hip cutout, navel, knight visor, large shield, skindentation, `bulwark-sheer bodysuit`†, !ponytail, !forelocks, bob cut
```
- female only: sideboob
- male only: penis outline, erection under clothes
- TornDamage: `torn bodysuit`

**E** — *lewd B — armour with the plates gapped*

```
bastion; bronze armor, black bodysuit, wardrobe malfunction, downblouse, side slit, bronze gauntlet, belt, underboob, `hinge seam`†
```
- female only: cleavage
- male only: balls outline
- TornDamage: `torn armor`

**F** — *lewd C — the gate as restraint*

```
bastion; stone armor, power armor, harness, collar, leash, handcuffs, chains, mechanical legs, corset, impossible clothes, `clampstraps`†
```
- female only: cleavage, erect nipples
- male only: covered penis, tenting
- TornDamage: `torn armor`

### `siegeplate`

**A** — *Armament — siege armour; hair changed to a side shave*

```
siegeplate; copper armor, copper bodysuit, strapless bodysuit, orange capelet, copper gauntlet, copper boots, asymmetrical legwear, knight visor, visor up, copper pauldron, single pantsleg, large shield, leather bandolier, mace on back, dagger on hip, brown belt, !ponytail, side shave
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn bodysuit, torn capelet, crotch tear`

**B** — *recoloured crimson/white; weapons replaced with a greatsword and katana*

```
siegeplate; crimson armor, white bodysuit, strapless bodysuit, white capelet, crimson gauntlet, crimson boots, asymmetrical legwear, knight visor, visor up, crimson pauldron, single pantsleg, greatsword, katana, bandolier, mechanical arms
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn bodysuit, torn capelet`

**C** — *armoury valkyrie (original)*

```
siegeplate; power armor, stone armor, feathered wings, helmet, visor down, armor, large shield, bandolier, mechanical arms, armored boots, asymmetrical legwear, mace, dagger
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn armor, torn bodysuit`

**D** — *lewd A — the armoury, unplated*

```
siegeplate; micro bikini, mostly nude, see-through clothes, pasties, crotchless, bandolier, knight visor, large shield, wet clothes, `siegeweave harness`†, !ponytail, side shave
```
- female only: cleavage, navel
- male only: penis outline, erection under clothes
- TornDamage: `torn bikini`

**E** — *lewd B — the bandolier and the slit*

```
siegeplate; crimson armor, white bodysuit, bandolier, wardrobe malfunction, side slit, downblouse, hood, underboob, `ramclasp`†, greatsword
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn bodysuit`

**F** — *lewd C — the mechanical harness*

```
siegeplate; power armor, stone armor, mechanical arms, harness, o-ring top, collar, leash, cuffs, bound, body chain, `obedience clasps`†
```
- female only: cleavage, nipples
- male only: covered balls, erection under clothes
- TornDamage: `torn armor`


---

## Nettle — `necro` (Necromancer)

Default core: black hooded long dress, black staff and flaming skull, detached sleeves.

### `nightshade`

**A** — *Venom — the poisonous bloom; hair changed to a hime cut*

```
nightshade; purple dress, strapless dress, long dress, black hood, hood up, no panties, pelvic curtain, black shoes, toeless shoes, platform shoes, black staff, flaming skull, necromancer, purple-trim dress, detached sleeves, purple flower hair ornament, purple flower chest ornament, holding vial, !flaming ponytail, hime cut
```
- female only: navel
- male only: bulge
- TornDamage: `torn dress`

**B** — *recoloured black/red; staff replaced with a scythe*

```
nightshade; black dress, strapless dress, long dress, black hood, hood up, no panties, pelvic curtain, black shoes, toeless shoes, platform shoes, scythe, floating skull, necromancer, red-trim dress, detached sleeves, red flower hair ornament, red flower chest ornament, holding vial, parasol
```
- female only: navel
- male only: bulge
- TornDamage: `torn dress`

**C** — *belle of poison (original)*

```
nightshade; purple dress, long dress, off-shoulder dress, flower crown, holding vial, purple flower hair ornament, purple flower chest ornament, black gloves, choker, detached sleeves
```
- female only: navel
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — the bloom, exposed*

```
nightshade; purple dress, see-through clothes, micro bikini, pasties, crotchless, holding vial, purple flower chest ornament, navel, `nightglass shift`†, !flaming ponytail, hime cut
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**E** — *lewd B — petals and a slit*

```
nightshade; black dress, red flower chest ornament, downblouse, side slit, black hood, collar, holding vial, underboob, `bloom slip`†
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**F** — *lewd C — the poison-vice*

```
nightshade; purple dress, off-shoulder dress, harness, corset, collar, leash, bound, holding vial, impossible clothes, `devotion clasps`†
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

### `rotsinger`

**A** — *Rupture — a plague dirge; hair changed to a side braid*

```
rotsinger; green dress, strapless dress, long dress, front-laced dress, black hood, hood up, no panties, pelvic curtain, black shoes, toeless shoes, platform shoes, black staff, flaming skull, necromancer, green-trim dress, detached sleeves, holding bell, green mushroom on shoulder, !flaming ponytail, side braid
```
- female only: navel
- male only: bulge
- TornDamage: `torn dress`

**B** — *recoloured bone-white/nettle; staff replaced with a greataxe*

```
rotsinger; white dress, strapless dress, long dress, front-laced dress, white hood, hood up, no panties, pelvic curtain, white shoes, toeless shoes, platform shoes, greataxe, flaming skull, necromancer, green-trim dress, detached sleeves, holding bell, green mushroom on shoulder, mask
```
- female only: navel
- male only: bulge
- TornDamage: `torn dress`

**C** — *fungal dirge (original)*

```
rotsinger; green dress, huge mushroom, mushroom hat, hooded cloak, hood up, holding bell, necromancer, green mushroom on shoulder, detached sleeves, flower crown
```
- female only: navel
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — the dirge-dress, sheer*

```
rotsinger; green dress, see-through clothes, mostly nude, pasties, crotchless, holding bell, green mushroom on shoulder, navel, `rotgloss lace`†, !flaming ponytail, side braid
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**E** — *lewd B — the bell and the gape*

```
rotsinger; white dress, front-laced dress, wardrobe malfunction, downblouse, side slit, collar, holding bell, green mushroom on shoulder, `peek seam`†
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**F** — *lewd C — the choir-stall*

```
rotsinger; green dress, huge mushroom, mushroom hat, harness, o-ring top, corset, collar, bound, holding bell, `obedience clasps`†
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

### `sporemother`

**A** — *Contagion — mother of spores; hair changed to double buns*

```
sporemother; orange dress, strapless dress, long dress, black hood, hood up, no panties, pelvic curtain, black shoes, toeless shoes, platform shoes, black staff, flaming skull, necromancer, orange-trim dress, detached sleeves, orange mushroom, orange mushroom hat, !flaming ponytail, !sidelocks, double bun
```
- female only: navel
- male only: bulge
- TornDamage: `torn dress`

**B** — *recoloured teal/cream; staff replaced with a staff-scythe*

```
sporemother; teal dress, strapless dress, long dress, cream hood, hood up, no panties, pelvic curtain, cream shoes, toeless shoes, platform shoes, scythe, floating skull, necromancer, teal-trim dress, detached sleeves, cream mushroom, cream mushroom hat, vines on skirt
```
- female only: navel
- male only: bulge
- TornDamage: `torn dress`

**C** — *spore queen (original)*

```
sporemother; orange dress, huge mushroom, mushroom hat, hooded cloak, hood up, orange mushroom, necromancer, flower crown, detached sleeves, parasol
```
- female only: navel
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — the cowl, unspooled*

```
sporemother; orange dress, micro bikini, see-through clothes, pasties, crotchless, orange mushroom, navel, `sporeveil`†, !flaming ponytail, !sidelocks, double bun
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**E** — *lewd B — spore-gaps at the seams*

```
sporemother; teal dress, cream mushroom, downblouse, side slit, hood, collar, navel, `gap whisper`†
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**F** — *lewd C — the mother-lode*

```
sporemother; orange dress, huge mushroom, mushroom hat, harness, corset, collar, leash, bound, impossible clothes, `pressurelace`†
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`


---

## Severine — `vamp` (Bloodletter)

Default core: black tricorne, long black coat over no shirt, ascot, white pants, red boots, claws.

### `bloodSaint`

**A** — *Transfusion — the sainted vampire; hair changed to a hair bun*

```
bloodSaint; white hat, tricorne, white ascot, white gloves, long gloves, gold cuffs, fingerless gloves, white coat, long coat, no shirt, white pants, white boots, front-laced boots, halo, holding cup, !long hair, !wavy hair, hair bun
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat, torn pants, torn hat`

**B** — *recoloured black/rose; the chalice cup replaced with a rapier*

```
bloodSaint; black hat, tricorne, rose ascot, black gloves, long gloves, rose cuffs, fingerless gloves, black coat, long coat, no shirt, rose pants, black boots, front-laced boots, halo, blood chalice, rapier
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat, torn pants, torn hat`

**C** — *the saint (original)*

```
bloodSaint; white dress, long dress, gold-trim dress, gold capelet, gold cuffs, halo, angel wings, holding cup, prayer beads, crown
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — the saint's coat, undone*

```
bloodSaint; white coat, see-through clothes, plunging neckline, pasties, no panties, halo, holding cup, navel, `halo sheer`†, !long hair, !wavy hair, hair bun
```
- female only: cleavage, underboob
- male only: penis outline
- TornDamage: `torn coat`

**E** — *lewd B — the rose slit*

```
bloodSaint; black coat, rose ascot, downblouse, side slit, no shirt, collar, halo, `psalm slip`†
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn coat`

**F** — *lewd C — the relic-bonds*

```
bloodSaint; white dress, gold capelet, harness, o-ring top, corset, collar, leash, bound, halo, `gripbonds`†
```
- female only: cleavage, nipples
- male only: covered penis, erection under clothes
- TornDamage: `torn dress`

### `crimsonCovenant`

**A** — *Bloodletting — the regal pact; hair changed to twin drills*

```
crimsonCovenant; red hat, tricorne, red ascot, black gloves, long gloves, red cuffs, fingerless gloves, red coat, long coat, no shirt, black pants, red boots, front-laced boots, holding cup, red gem chest ornament, !long hair, !wavy hair, twin drills
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat, torn pants, torn hat`

**B** — *recoloured white/gold; the cup replaced with a mace*

```
crimsonCovenant; white hat, tricorne, gold ascot, white gloves, long gloves, gold cuffs, fingerless gloves, white coat, long coat, no shirt, white pants, gold boots, front-laced boots, gold cup, red gem chest ornament, mace
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat, torn pants, torn hat`

**C** — *blood queen (original)*

```
crimsonCovenant; red dress, long dress, off-shoulder dress, red cape, fur cape, choker, red gem chest ornament, holding cup, crown, garter straps, thigh strap
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — the pact-coat, open*

```
crimsonCovenant; red coat, micro bikini, see-through clothes, pasties, crotchless, holding cup, red gem chest ornament, navel, `pactglass`†, !long hair, !wavy hair, twin drills
```
- female only: cleavage, underboob
- male only: balls outline
- TornDamage: `torn coat`

**E** — *lewd B — the gem and the plunge*

```
crimsonCovenant; white coat, gold ascot, plunging neckline, side slit, no shirt, choker, red gem chest ornament, `ruby slip`†
```
- female only: cleavage, sideboob
- male only: penis outline, erection under clothes
- TornDamage: `torn coat`

**F** — *lewd C — the queen's leash*

```
crimsonCovenant; red dress, off-shoulder dress, fur cape, harness, corset, collar, leash, handcuffs, bound, crown, `locklace`†
```
- female only: cleavage, erect nipples
- male only: covered balls, tenting
- TornDamage: `torn dress`

### `huntress`

**A** — *Feast — hunter of the wounded; hair changed to a low ponytail*

```
huntress; green hat, tricorne, green hat feather, white ascot, black gloves, long gloves, green cuffs, fingerless gloves, green coat, long coat, fur collar, no shirt, black pants, brown boots, front-laced boots, knife on hip, !long hair, !wavy hair, low ponytail
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat, torn pants, torn hat`

**B** — *recoloured grey/orange; knife replaced with a greataxe and rifle*

```
huntress; grey hat, tricorne, orange hat feather, grey ascot, black gloves, long gloves, orange cuffs, fingerless gloves, grey coat, long coat, fur collar, no shirt, orange pants, grey boots, front-laced boots, greataxe, rifle, fur cape
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat, torn pants, torn hat`

**C** — *the predator (original)*

```
huntress; green coat, fur cape, feather headdress, body markings, tattoo, knife on hip, fur boots, hat feather, belt
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat, torn pants`

**D** — *lewd A — the pelt and the skin*

```
huntress; green coat, pelt, see-through clothes, pasties, crotchless, knife on hip, navel, `pelt sheen`†, !long hair, !wavy hair, low ponytail
```
- female only: cleavage, sideboob
- male only: penis outline
- TornDamage: `torn coat`

**E** — *lewd B — the huntress's hem*

```
huntress; grey coat, fur collar, downblouse, side slit, orange hat feather, no shirt, underboob, `trackslit`†
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn coat`

**F** — *lewd C — the trophy-bonds*

```
huntress; green coat, fur cape, feather headdress, harness, o-ring top, collar, leash, cuffs, bound, `binding weave`†
```
- female only: cleavage, nipples
- male only: covered penis, erection under clothes
- TornDamage: `torn coat`


---

## Cinder — `lancer` (Lancer)

Default core: huge wide-brim hat, cloak over a bronze breastplate and blouse, shorts, tights, flaming spear.

### `ashfall`

**A** — *Ashfall — funeral-pyre lancer; hair changed to an undercut*

```
ashfall; grey hat, wide brim, ash-grey cloak, long cloak, baggy sleeves, ruffled sleeves, dark breastplate, grey shorts, puffy shorts, white tights, grey shoes, high heels, white blouse, long-sleeved blouse, flaming spear, !medium hair, undercut
```
- female only: cleavage
- male only: bulge
- TornDamage: `'torn hat', torn blouse, torn tights, torn shorts`

**B** — *recoloured black/ember; spear replaced with a glaive*

```
ashfall; black hat, wide brim, ember-orange cloak, long cloak, baggy sleeves, ruffled sleeves, black breastplate, orange shorts, puffy shorts, black tights, orange shoes, high heels, black blouse, long-sleeved blouse, glaive, glowing
```
- female only: cleavage
- male only: bulge
- TornDamage: `'torn hat', torn blouse, torn tights, torn shorts`

**C** — *pyre-walker (original)*

```
ashfall; hooded cloak, hood up, grey dress, long dress, bandages, barefoot, glaive, ember, ash, rubble
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — the pyre, uncovered*

```
ashfall; grey hat, see-through clothes, micro bikini, pasties, crotchless, flaming spear, navel, `pyre-sheer drape`†, !medium hair
```
- female only: cleavage, underboob
- male only: penis outline, erection under clothes
- TornDamage: `'torn hat'`

**E** — *lewd B — the ember slit*

```
ashfall; black hat, ember-orange cloak, downblouse, side slit, black tights, glaive, underboob, `ashfall slip`†
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn blouse`

**F** — *lewd C — the pyre-rig*

```
ashfall; hooded cloak, hood up, harness, o-ring top, corset, collar, leash, bound, glaive, `pyre bindlocks`†
```
- female only: cleavage, erect nipples
- male only: covered penis, tenting
- TornDamage: `torn dress`

### `marshal`

**A** — *Formation — the drillmaster; hair changed to a braided bun*

```
marshal; blue hat, wide brim, blue cloak, long cloak, baggy sleeves, ruffled sleeves, bronze breastplate, blue shorts, puffy shorts, white tights, blue shoes, high heels, white blouse, long-sleeved blouse, flaming spear, gold epaulettes, holding banner, !medium hair, braided bun
```
- female only: cleavage
- male only: bulge
- TornDamage: `'torn hat', torn blouse, torn tights, torn shorts`

**B** — *recoloured green/gold; spear replaced with a halberd*

```
marshal; green hat, wide brim, green cloak, long cloak, baggy sleeves, ruffled sleeves, gold breastplate, green shorts, puffy shorts, white tights, green shoes, high heels, white blouse, long-sleeved blouse, halberd, gold epaulettes, holding banner, peaked cap, sash
```
- female only: cleavage
- male only: bulge
- TornDamage: `'torn hat', torn blouse, torn tights, torn shorts`

**C** — *the standard-bearer (original)*

```
marshal; military jacket, peaked cap, epaulettes, sash, holding banner, sword, white pants, boots, gloves
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn jacket, torn pants`

**D** — *lewd A — the standard, unfurled*

```
marshal; blue hat, see-through clothes, micro bikini, pasties, crotchless, holding banner, gold epaulettes, navel, `standard sheer`†, !medium hair, braided bun
```
- female only: cleavage, underboob
- male only: penis outline
- TornDamage: `torn blouse`

**E** — *lewd B — the drum-major's hem*

```
marshal; green hat, gold breastplate, downblouse, side slit, white tights, gold epaulettes, underboob, `drill slip`†
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn blouse`

**F** — *lewd C — the standard-bearer, bound*

```
marshal; military jacket, peaked cap, harness, o-ring top, corset, collar, leash, bound, holding banner, `compliance clamps`†
```
- female only: cleavage, nipples
- male only: covered balls, tenting
- TornDamage: `torn jacket`

### `vanguardPlume`

**A** — *Charge — the burning vanguard; hair changed to a high ponytail*

```
vanguardPlume; orange hat, wide brim, orange feather hat ornament, orange cloak, long cloak, baggy sleeves, ruffled sleeves, bronze breastplate, orange shorts, puffy shorts, white tights, orange shoes, high heels, white blouse, long-sleeved blouse, flaming spear, !medium hair, high ponytail
```
- female only: cleavage
- male only: bulge
- TornDamage: `'torn hat', torn blouse, torn tights, torn shorts`

**B** — *recoloured purple/silver; spear replaced with a naginata*

```
vanguardPlume; purple hat, wide brim, purple feather hat ornament, purple cloak, long cloak, baggy sleeves, ruffled sleeves, silver breastplate, purple shorts, puffy shorts, silver tights, purple shoes, high heels, silver blouse, long-sleeved blouse, naginata, flaming wings, jetpack
```
- female only: cleavage
- male only: bulge
- TornDamage: `'torn hat', torn blouse, torn tights, torn shorts`

**C** — *sky knight (original)*

```
vanguardPlume; feathered wings, white wings, winged helmet, bronze breastplate, white tights, armored boots, flaming spear, long cloak, hat feather, halo
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn blouse, torn tights`

**D** — *lewd A — the plume, stripped*

```
vanguardPlume; orange hat, wide brim, see-through clothes, mostly nude, pasties, crotchless, flaming spear, navel, `plume sheer`†, !medium hair, high ponytail
```
- female only: cleavage, sideboob
- male only: balls outline
- TornDamage: `'torn hat'`

**E** — *lewd B — the sky-knight's gape*

```
vanguardPlume; purple hat, silver breastplate, downblouse, side slit, silver tights, flaming wings, underboob, `ember slip`†
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn blouse`

**F** — *lewd C — the sky-knight, chained*

```
vanguardPlume; feathered wings, winged helmet, harness, o-ring top, collar, leash, handcuffs, bound, impossible clothes, `tailored-skin suit`†
```
- female only: cleavage, erect nipples
- male only: covered penis, erection under clothes
- TornDamage: `torn blouse`


---

## Clemence — `priest` (Confessor)

Default core: white veil over veiled eyes, very long white dress, white/gold capelet, gold cuffs, cross print.

### `abbess`

**A** — *Sanctuary — the mother superior; hair changed to a hair bun*

```
abbess; blue dress, very long dress, blue veil, eye veil, blue capelet, gold-trim capelet, gold cuffs, cleric, blue habit, cross print, gold staff, prayer beads, holding key, !long hair, !wavy hair, hair bun
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**B** — *recoloured white/black; staff replaced with a censer-flail*

```
abbess; white dress, very long dress, white veil, eye veil, black capelet, silver-trim capelet, silver cuffs, cleric, white habit, cross print, flail, prayer beads, holding key, armor, candelabra
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**C** — *the abbess (original)*

```
abbess; blue dress, very long dress, white veil, gold staff, prayer beads, holding key, candelabra, armor, crown
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — the habit, opened*

```
abbess; blue dress, see-through clothes, plunging neckline, pasties, no panties, gold staff, holding key, navel, `cloister sheer`†, !long hair, !wavy hair, hair bun
```
- female only: cleavage, underboob
- male only: penis outline
- TornDamage: `torn dress`

**E** — *lewd B — the key and the hem*

```
abbess; white dress, black capelet, downblouse, side slit, silver cuffs, holding key, underboob, `keyhole slip`†
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**F** — *lewd C — the cloister-bonds*

```
abbess; blue dress, white veil, harness, o-ring top, corset, collar, leash, bound, holding key, `submission stays`†
```
- female only: cleavage, nipples
- male only: covered penis, tenting
- TornDamage: `torn dress`

### `devotee`

**A** — *Devotion — healing hands; hair changed to twin braids*

```
devotee; green dress, very long dress, green veil, eye veil, green capelet, gold-trim capelet, gold cuffs, cleric, green habit, cross print, prayer beads, green leaf hair ornament, !long hair, !wavy hair, twin braids
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**B** — *recoloured cream/lavender; staff replaced with a tome*

```
devotee; cream dress, very long dress, lavender veil, eye veil, lavender capelet, gold-trim capelet, gold cuffs, cleric, cream habit, cross print, grimoire, prayer beads, lavender leaf hair ornament, bandages
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**C** — *the healer (original)*

```
devotee; green dress, very long dress, apron, bandages, leaf, prayer beads, lantern, white veil, white habit, cross print, flower
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress, torn apron`

**D** — *lewd A — the healer's habit, sheer*

```
devotee; green dress, see-through clothes, micro bikini, pasties, crotchless, prayer beads, green leaf hair ornament, navel, `devot sheer`†, !long hair, !wavy hair, twin braids
```
- female only: cleavage, sideboob
- male only: balls outline
- TornDamage: `torn dress`

**E** — *lewd B — the herb-slip*

```
devotee; cream dress, lavender veil, downblouse, side slit, bandages, prayer beads, underboob, `herb slip`†
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**F** — *lewd C — the nurse-bonds*

```
devotee; green dress, apron, harness, o-ring top, corset, bandages, collar, bound, impossible clothes, `triage clasps`†
```
- female only: cleavage, erect nipples
- male only: covered balls, erection under clothes
- TornDamage: `torn dress`

### `ecstatic`

**A** — *Rapture — bliss at the edge; hair changed to a side braid*

```
ecstatic; orange dress, very long dress, orange veil, eye veil, orange capelet, gold-trim capelet, gold cuffs, cleric, orange habit, cross print, holding lantern, holding candle, !long hair, !wavy hair, side braid
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**B** — *recoloured rose/gold; the lantern replaced with a censer on a chain*

```
ecstatic; rose dress, very long dress, rose veil, eye veil, gold capelet, gold-trim capelet, gold cuffs, cleric, rose habit, cross print, chain, candle, floating, glowing, candelabra
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**C** — *the blissful (original)*

```
ecstatic; orange dress, see-through dress, halo, floating, glowing, candle, orange veil, off-shoulder dress
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — the rapture, unveiled*

```
ecstatic; orange dress, see-through clothes, mostly nude, pasties, crotchless, holding candle, navel, `rapture sheer`†, !long hair, !wavy hair, side braid
```
- female only: cleavage, underboob
- male only: balls outline
- TornDamage: `torn dress`

**E** — *lewd B — the censer-chain tease*

```
ecstatic; rose dress, gold capelet, downblouse, side slit, chain, candle, floating, underboob, `bliss slip`†
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**F** — *lewd C — the levitation-rig*

```
ecstatic; orange dress, halo, floating, harness, o-ring top, collar, leash, bound, impossible clothes, `levitation locklace`†
```
- female only: cleavage, nipples
- male only: covered penis, tenting
- TornDamage: `torn dress`

### `penitent`

**A** — *Penitent — sackcloth and ashes; hair changed to a hair bun*

```
penitent; grey dress, very long dress, grey veil, eye veil, grey capelet, gold-trim capelet, gold cuffs, cleric, grey habit, cross print, prayer beads, candle, !long hair, !wavy hair, hair bun
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**B** — *recoloured brown/gold; the staff replaced with a chain-censer*

```
penitent; brown dress, very long dress, brown veil, eye veil, brown capelet, gold-trim capelet, gold cuffs, cleric, brown habit, cross print, chain, prayer beads, candle, candelabra
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**C** — *the veiled mourner (original)*

```
penitent; grey dress, hooded cloak, hood up, veil, chain, candle, bandages, cross print, barefoot, ash
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**D** — *lewd A — the sackcloth, parted*

```
penitent; grey dress, see-through clothes, plunging neckline, pasties, no panties, candle, prayer beads, navel, `ash-sheer sackcloth`†, !long hair, !wavy hair, hair bun
```
- female only: cleavage, underboob
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**E** — *lewd B — the mourner's slit*

```
penitent; brown dress, brown capelet, downblouse, side slit, chain, candle, underboob, `penance slip`†
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**F** — *lewd C — the mortification rig*

```
penitent; grey dress, hooded cloak, chain, harness, o-ring top, collar, leash, bound, candle, `mortify clasps`†
```
- female only: cleavage, erect nipples
- male only: covered penis, tenting
- TornDamage: `torn dress`


---

## Cassadora — `seer` (Hexer)

Default core: black leotard, blindfold over one eye, purple cape, belts, thighboots, floating flaming skull.

### `grifter`

**A** — *Turncoat — stolen moves; hair changed to twin drills*

```
grifter; purple leotard, black blindfold, pink cape, black elbow gloves, black belt, extra belts, black thighboots, blindfold over one eye, floating skull, flaming skull, necromancer, pink hat feather, holding playing card, holding coin, !side ponytail, twin drills
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn leotard`

**B** — *recoloured green/gold; cards replaced with a crystal ball*

```
grifter; green leotard, black blindfold, gold cape, black elbow gloves, black belt, extra belts, black thighboots, blindfold over one eye, floating skull, flaming skull, necromancer, green hat feather, crystal ball, top hat, domino mask
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn leotard`

**C** — *the con artist (original)*

```
grifter; black suit, vest, white shirt, tie, gloves, monocle, top hat, playing card, coin, cape, boots
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn suit`

**D** — *lewd A — the grift, unbuttoned*

```
grifter; purple leotard, see-through clothes, plunging neckline, pasties, crotchless, holding playing card, holding coin, navel, `grift sheer`†, !side ponytail, twin drills
```
- female only: cleavage, underboob
- male only: penis outline
- TornDamage: `torn leotard`

**E** — *lewd B — the card trick*

```
grifter; green leotard, gold cape, downblouse, side slit, crystal ball, domino mask, underboob, `deal slip`†
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn leotard`

**F** — *lewd C — the confidence rig*

```
grifter; black suit, vest, tie, harness, o-ring top, collar, leash, handcuffs, bound, `grip-lining`†
```
- female only: cleavage, nipples
- male only: covered balls, tenting
- TornDamage: `torn suit`

### `hedgeWitch`

**A** — *Hex — folk cunning; hair changed to low twintails*

```
hedgeWitch; green leotard, black blindfold, green cape, black elbow gloves, black belt, extra belts, black thighboots, blindfold over one eye, floating skull, flaming skull, necromancer, green witch hat, green pouch, gold talisman, !side ponytail, low twintails
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn leotard`

**B** — *recoloured red/black; the broom replaced with a scythe*

```
hedgeWitch; red leotard, black blindfold, black cape, black elbow gloves, black belt, extra belts, black thighboots, blindfold over one eye, floating skull, flaming skull, necromancer, red witch hat, black pouch, gold talisman, scythe
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn leotard`

**C** — *the hedge witch (original)*

```
hedgeWitch; green leotard, black blindfold, hooded cloak, hood up, green hood, pouch, talisman, candle, broom, bell, hat feather, feather
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn leotard, torn cloak`

**D** — *lewd A — the hex, uncovered*

```
hedgeWitch; green leotard, see-through clothes, micro bikini, pasties, crotchless, gold talisman, green witch hat, navel, `hedge sheer`†, !side ponytail
```
- female only: cleavage, sideboob
- male only: balls outline
- TornDamage: `torn leotard`

**E** — *lewd B — the charm-gaps*

```
hedgeWitch; red leotard, black cape, downblouse, side slit, gold talisman, red witch hat, underboob, `charm slip`†
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn leotard`

**F** — *lewd C — the familiar-bind*

```
hedgeWitch; green leotard, hooded cloak, talisman, harness, o-ring top, collar, leash, cuffs, bound, `charm clamps`†
```
- female only: cleavage, erect nipples
- male only: covered penis, erection under clothes
- TornDamage: `torn leotard`

### `soothsayer`

**A** — *Soothsayer — the augur; hair changed to a hair bun*

```
soothsayer; black leotard, black blindfold, gold cape, black elbow gloves, black belt, extra belts, black thighboots, blindfold over one eye, floating skull, flaming skull, necromancer, crystal ball, !side ponytail, hair bun
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn leotard`

**B** — *recoloured purple/silver; the skull replaced with a grimoire*

```
soothsayer; purple leotard, black blindfold, silver cape, black elbow gloves, black belt, extra belts, black thighboots, blindfold over one eye, flaming skull, necromancer, grimoire, silver hat feather, tome
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn leotard`

**C** — *the oracle (original)*

```
soothsayer; hooded cloak, hood up, black hood, veil, crystal ball, tome, candle, playing card, belt, boots
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn cloak`

**D** — *lewd A — fate, unveiled*

```
soothsayer; black leotard, see-through clothes, micro bikini, pasties, crotchless, crystal ball, dry, navel, `fate-sheer veil`†, !side ponytail, hair bun
```
- female only: cleavage, underboob
- male only: penis outline, erection under clothes
- TornDamage: `torn leotard`

**E** — *lewd B — the omen slit*

```
soothsayer; purple leotard, silver cape, downblouse, side slit, grimoire, silver hat feather, underboob, `omen slip`†
```
- female only: cleavage
- male only: penis outline, erection under clothes
- TornDamage: `torn leotard`

**F** — *lewd C — the augury-rig*

```
soothsayer; hooded cloak, hood up, harness, o-ring top, collar, leash, handcuffs, bound, crystal ball, `augury clamps`†
```
- female only: cleavage, erect nipples
- male only: covered balls, tenting
- TornDamage: `torn cloak`


---

## The 56 invented lewd tags (†)

Made up for this pass; none is in the dictionaries or booru. Every D/E/F design names at least one.

`giltglass bodice`, `almostslip hem`, `vicecorset`, `bulwark-sheer bodysuit`, `hinge seam`, `clampstraps`, `siegeweave harness`, `ramclasp`, `obedience clasps`, `nightglass shift`, `bloom slip`, `devotion clasps`, `rotgloss lace`, `peek seam`, `sporeveil`, `gap whisper`, `pressurelace`, `halo sheer`, `psalm slip`, `gripbonds`, `pactglass`, `ruby slip`, `locklace`, `pelt sheen`, `trackslit`, `binding weave`, `pyre-sheer drape`, `ashfall slip`, `pyre bindlocks`, `standard sheer`, `drill slip`, `compliance clamps`, `plume sheer`, `ember slip`, `tailored-skin suit`, `cloister sheer`, `keyhole slip`, `submission stays`, `devot sheer`, `herb slip`, `triage clasps`, `rapture sheer`, `bliss slip`, `levitation locklace`, `ash-sheer sackcloth`, `penance slip`, `mortify clasps`, `grift sheer`, `deal slip`, `grip-lining`, `hedge sheer`, `charm slip`, `charm clamps`, `fate-sheer veil`, `omen slip`, `augury clamps`

## Real lewd tags used

From the dictionaries or common booru vocabulary (e.g. `covered nipples`, `plunging neckline`,
`downblouse`, `armpit peek`, `micro bikini`, `crotchless panties`, `see-through clothes`, `harness`, `o-ring top`,
`corset`, `collar`, `leash`, `bound`, `impossible clothes`). Gendered by sex where it matters.

**Open for Noodle:** which of these become the real outfit lines, and whether the invented tags earn a place in
the dictionaries.