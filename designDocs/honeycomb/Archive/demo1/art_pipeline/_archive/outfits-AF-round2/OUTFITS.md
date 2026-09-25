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

**D** — *gilded transparency — sheer gold silk*

```
almoner; gold dress, see-through clothes, pasties, gold cuffs, halo, crown, holding coin, `giltglass bodice`†
```
- female only: cleavage, underboob
- male only: penis outline
- TornDamage: `torn dress`

**E** — *the offer — downblouse over the collection plate*

```
almoner; gold-trim dress, downblouse, gold cuffs, holding coin, halo, `alms-lean`†
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**F** — *the living idol — gilded body, worshipped*

```
almoner; gold armor, body paint, pasties, halo, crown, cross print, `gild-lacquer`†
```
- female only: nipples, navel
- male only: tenting, navel
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

**D** — *oiled steel — bare skin under loose plate*

```
bastion; steel armor, shiny skin, large shield, mechanical legs, steel pauldron, `plate-oil sheen`†
```
- female only: sideboob
- male only: erection under clothes
- TornDamage: `torn armor`

**E** — *the gap — a plate slips out of line*

```
bastion; steel armor, wardrobe malfunction, large shield, steel pauldron, belt, `gap-rivet`†
```
- female only: underboob
- male only: bulge
- TornDamage: `torn armor`

**F** — *the pillory — locked into her own gate*

```
bastion; stone armor, pillory, stocks, large shield, chains, mechanical legs, `gate-stocks`†
```
- female only: cleavage, nipples
- male only: covered penis
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

**D** — *soaked — rain-welded white cloth*

```
siegeplate; white bodysuit, soaked, wet clothes, bandolier, large shield, `rainweld wrap`†
```
- female only: underboob
- male only: bulge
- TornDamage: `torn bodysuit`

**E** — *slipped strap — the bandolier comes loose*

```
siegeplate; bronze armor, armpit peek, bandolier, large shield, mace, `strap-slip`†
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn armor`

**F** — *the arms-rig — chained to her own armoury*

```
siegeplate; power armor, harness, bandolier, mechanical arms, large shield, `ram-clamp rig`†
```
- female only: cleavage, erect nipples
- male only: tenting
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

**D** — *black latex — poison-lacquered*

```
nightshade; purple dress, latex bodysuit, holding vial, purple flower chest ornament, `nightglass glaze`†
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**E** — *the vial drop — a hiked hem and a panty peek*

```
nightshade; purple dress, panty peek, holding vial, purple flower hair ornament, `vial-fumble`†
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**F** — *the bloom-trap — held open by her own flowers*

```
nightshade; purple dress, tentacles, flower crown, holding vial, `bloom-trap`†
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

**D** — *ooze — a translucent slime gown*

```
rotsinger; green dress, slime, translucent, holding bell, green mushroom on shoulder, `ooze gown`†
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**E** — *the dirge-step — a lifted skirt mid-bell*

```
rotsinger; green dress, skirt lift, holding bell, green mushroom on shoulder, `dirge-step`†
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**F** — *the mummy — wrapped for the long sleep*

```
rotsinger; green dress, mummy, bandages, holding bell, hooded cloak, `dirge-wraps`†
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

**D** — *pollen — dusted gold and bare*

```
sporemother; orange dress, pasties, orange mushroom, mushroom hat, `pollen dusting`†
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**E** — *the cap-tilt — a slit up the spore dress*

```
sporemother; orange dress, side slit, underboob, orange mushroom, mushroom hat, `cap-lift`†
```
- female only: underboob, nipples
- male only: penis outline, erection under clothes
- TornDamage: `torn dress`

**F** — *the brood — an egg sac she carries*

```
sporemother; orange dress, egg, huge mushroom, mushroom hat, `brood sac`†
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

**D** — *vitrail — panes of clear glass*

```
bloodSaint; white dress, halo, holding cup, `vitrail panel`†
```
- female only: cleavage, underboob
- male only: penis outline
- TornDamage: `torn dress`

**E** — *the communion slip — a shoulder slips free*

```
bloodSaint; white coat, strap slip, halo, holding cup, `communion slip`†
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat`

**F** — *the saint-doll — jointed and posed*

```
bloodSaint; white dress, doll, ball joints, halo, holding cup, `jointline dollhide`†
```
- female only: nipples, navel
- male only: tenting
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

**D** — *spilled wine — soaked velvet*

```
crimsonCovenant; red dress, wet dress, holding cup, red gem chest ornament, `vintage soak`†
```
- female only: cleavage, sideboob
- male only: erection under clothes
- TornDamage: `torn dress`

**E** — *the toast — a plunging neckline over the cup*

```
crimsonCovenant; red dress, plunging neckline, holding cup, red gem chest ornament, `toast-line`†
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn dress`

**F** — *the covenant-pet — led on a jewelled lead*

```
crimsonCovenant; red dress, leash, choker, holding cup, crown, `queen's lead`†
```
- female only: cleavage, nipples
- male only: covered balls
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

**D** — *war-paint — tribal markings and a pelt*

```
huntress; green coat, tribal, body markings, fur cape, knife on hip, `pelt-print paint`†
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn coat`

**E** — *the hip vent — a cut where the pelt parts*

```
huntress; green coat, hip cutout, fur collar, knife on hip, `hip-vent stitch`†
```
- female only: navel
- male only: bulge
- TornDamage: `torn coat`

**F** — *the mount — posed and mounted like a trophy*

```
huntress; green coat, taxidermy, fur cape, feather headdress, `trophy mount`†
```
- female only: cleavage, nipples
- male only: covered penis
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

**D** — *ember-dust — glowing skin through ash*

```
ashfall; grey dress, glowing, pasties, glaive, grey hat, `ember-dust sheen`†
```
- female only: underboob
- male only: penis outline
- TornDamage: `torn dress`

**E** — *burn-holes — a cloak eaten through*

```
ashfall; grey cloak, torn clothes, underboob, glaive, grey hat, `cinder burn-holes`†
```
- female only: underboob
- male only: bulge
- TornDamage: `torn cloak`

**F** — *the brand — marked as the pyre's own*

```
ashfall; grey dress, brand, scar, glaive, ember, `ember brand`†
```
- female only: nipples, navel
- male only: tenting
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

**D** — *parade mesh — uniform over fishnet*

```
marshal; blue coat, fishnet top, holding banner, gold epaulettes, `parade mesh`†
```
- female only: cleavage, navel
- male only: penis outline
- TornDamage: `torn coat`

**E** — *open order — buttons undone down the line*

```
marshal; blue coat, partially unbuttoned, gold epaulettes, holding banner, `order-undone`†
```
- female only: cleavage
- male only: bulge
- TornDamage: `torn coat`

**F** — *the drillmaster — crop in hand, rank inverted*

```
marshal; military jacket, dominatrix, crop, peaked cap, gold epaulettes, `drill-baton rig`†
```
- female only: cleavage, erect nipples
- male only: covered balls
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

**D** — *heat-sheer — cloth burning away to ember*

```
vanguardPlume; orange hat, micro bikini, flames, flaming spear, `heat-sheer`†
```
- female only: underboob
- male only: balls outline
- TornDamage: `'torn hat'`

**E** — *plume-lift — a gust takes the skirt*

```
vanguardPlume; orange cloak, upskirt, flaming spear, orange hat, `gust-lift`†
```
- female only: navel
- male only: bulge
- TornDamage: `torn blouse`

**F** — *the bridle — bitted and reined like a mount*

```
vanguardPlume; winged helmet, bit gag, reins, feathered wings, flaming spear, `pegasus bridle`†
```
- female only: cleavage, nipples
- male only: tenting
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

**D** — *cloister lace — vestments reduced to lace*

```
abbess; blue veil, lingerie, lace trim, holding key, prayer beads, `cloister lace`†
```
- female only: cleavage, underboob
- male only: penis outline
- TornDamage: `torn dress`

**E** — *the open rule — a backless habit*

```
abbess; blue dress, backless dress, holding key, prayer beads, `rule-open`†
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn dress`

**F** — *the suspension — hung from her own rosary*

```
abbess; blue dress, prayer beads, holding key, `rosary suspension`†, bound
```
- female only: cleavage, nipples
- male only: covered penis
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

**D** — *apron-only — nothing but the healing apron*

```
devotee; green dress, naked apron, bandages, prayer beads, lantern, `apron-only drape`†
```
- female only: cleavage, navel
- male only: penis outline
- TornDamage: `torn apron`

**E** — *the dressing — a lifted shirt over bandages*

```
devotee; green dress, shirt lift, bandages, prayer beads, `herb dressing`†
```
- female only: underboob
- male only: bulge
- TornDamage: `torn dress`

**F** — *the vow-lock — a chastity vow made a belt*

```
devotee; green dress, chastity belt, prayer beads, collar, `vow-lock`†
```
- female only: cleavage, nipples
- male only: covered balls
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

**D** — *frozen bliss — rapt and iced over*

```
ecstatic; orange dress, ice, frozen, halo, candle, `wax-frost glaze`†
```
- female only: cleavage, underboob
- male only: penis outline
- TornDamage: `torn dress`

**E** — *the ascent — a lifted hem as she rises*

```
ecstatic; orange dress, dress lift, halo, floating, candle, `rise-hem`†
```
- female only: navel
- male only: bulge
- TornDamage: `torn dress`

**F** — *the bind — trussed at the height of rapture*

```
ecstatic; orange dress, shibari, halo, floating, `bliss-bind`†
```
- female only: cleavage, erect nipples
- male only: tenting
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

**D** — *sheer sackcloth — ashes over bare skin*

```
penitent; grey dress, sheer dress, ash, candle, `ash-sheer sackcloth`†
```
- female only: cleavage, underboob
- male only: penis outline
- TornDamage: `torn dress`

**E** — *the rent — sackcloth torn at the side*

```
penitent; grey dress, candle, `sackcloth rent`†
```
- female only: sideboob
- male only: bulge
- TornDamage: `torn dress`

**F** — *the penance — bound in her own chains*

```
penitent; grey dress, chain, shackle, candle, hood up, `penance chains`†
```
- female only: cleavage, nipples
- male only: covered penis
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

**D** — *the sleight — everything wagered but a pair of cards*

```
grifter; purple leotard, crotchless panties, playing card, top hat, coin, `card-sharp net`†
```
- female only: sideboob, navel
- male only: penis outline
- TornDamage: `torn leotard`

**E** — *the reveal — a card draws the eye, the skirt rises*

```
grifter; purple leotard, panty shot, playing card, coin, `confidence trick`†
```
- female only: navel
- male only: bulge
- TornDamage: `torn leotard`

**F** — *the wager — staked on a hand of her own cards*

```
grifter; black suit, gambling, playing card, coin, top hat, `ante-up rig`†
```
- female only: cleavage, erect nipples
- male only: tenting
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

**D** — *the wrap — thin herb bandages only*

```
hedgeWitch; green leotard, bandages, green witch hat, pouch, talisman, `herb-wrap binds`†
```
- female only: cleavage, navel
- male only: penis outline
- TornDamage: `torn leotard`

**E** — *the tug — a charm-string pull at the neckline*

```
hedgeWitch; green leotard, clothes pull, talisman, green witch hat, `charm-string`†
```
- female only: underboob
- male only: bulge
- TornDamage: `torn leotard`

**F** — *the possession — ridden by her familiar*

```
hedgeWitch; green leotard, possession, green witch hat, talisman, `familiar-ridden`†
```
- female only: cleavage, nipples
- male only: covered balls
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

**D** — *scrying — mirror-bright skin*

```
soothsayer; black leotard, mirror, shiny skin, crystal ball, veil, `scrying static`†
```
- female only: sideboob, navel
- male only: penis outline
- TornDamage: `torn leotard`

**E** — *the reading — a veil gone translucent, a bra peek*

```
soothsayer; black leotard, bra peek, veil, crystal ball, `veil-reading`†
```
- female only: underboob
- male only: bulge
- TornDamage: `torn leotard`

**F** — *the puppet — strung on fate's own wires*

```
soothsayer; black suit, marionette, strings, crystal ball, veil, `fate-puppet`†
```
- female only: cleavage, nipples
- male only: covered penis
- TornDamage: `torn suit`


---

## The 57 lewd identities — unique across the whole lineup

Every D/E/F design has its own medium / tease / fetish. No fetish tool appears twice: the assembler asserts
that `harness`, `collar`, `leash`, `chain`, `rope`, `shibari`, `suspension`, `corset`, `pillory`, `stocks`,
`mummy`, `doll`, `taxidermy`, `brand`, `chastity belt`, `tentacles`, `marionette`, `possession`, `gambling`,
`bit gag`, `reins`, `dominatrix` and `crop` are each used by exactly one design.

| Outfit | D — exposure | E — tease | F — fetish |
|---|---|---|---|
| `knight/almoner` | gilded transparency — sheer gold silk | the offer — downblouse over the collection plate | the living idol — gilded body, worshipped |
| `knight/bastion` | oiled steel — bare skin under loose plate | the gap — a plate slips out of line | the pillory — locked into her own gate |
| `knight/siegeplate` | soaked — rain-welded white cloth | slipped strap — the bandolier comes loose | the arms-rig — chained to her own armoury |
| `necro/nightshade` | black latex — poison-lacquered | the vial drop — a hiked hem and a panty peek | the bloom-trap — held open by her own flowers |
| `necro/rotsinger` | ooze — a translucent slime gown | the dirge-step — a lifted skirt mid-bell | the mummy — wrapped for the long sleep |
| `necro/sporemother` | pollen — dusted gold and bare | the cap-tilt — a slit up the spore dress | the brood — an egg sac she carries |
| `vamp/bloodSaint` | vitrail — panes of clear glass | the communion slip — a shoulder slips free | the saint-doll — jointed and posed |
| `vamp/crimsonCovenant` | spilled wine — soaked velvet | the toast — a plunging neckline over the cup | the covenant-pet — led on a jewelled lead |
| `vamp/huntress` | war-paint — tribal markings and a pelt | the hip vent — a cut where the pelt parts | the mount — posed and mounted like a trophy |
| `lancer/ashfall` | ember-dust — glowing skin through ash | burn-holes — a cloak eaten through | the brand — marked as the pyre's own |
| `lancer/marshal` | parade mesh — uniform over fishnet | open order — buttons undone down the line | the drillmaster — crop in hand, rank inverted |
| `lancer/vanguardPlume` | heat-sheer — cloth burning away to ember | plume-lift — a gust takes the skirt | the bridle — bitted and reined like a mount |
| `priest/abbess` | cloister lace — vestments reduced to lace | the open rule — a backless habit | the suspension — hung from her own rosary |
| `priest/devotee` | apron-only — nothing but the healing apron | the dressing — a lifted shirt over bandages | the vow-lock — a chastity vow made a belt |
| `priest/ecstatic` | frozen bliss — rapt and iced over | the ascent — a lifted hem as she rises | the bind — trussed at the height of rapture |
| `priest/penitent` | sheer sackcloth — ashes over bare skin | the rent — sackcloth torn at the side | the penance — bound in her own chains |
| `seer/grifter` | the sleight — everything wagered but a pair of cards | the reveal — a card draws the eye, the skirt rises | the wager — staked on a hand of her own cards |
| `seer/hedgeWitch` | the wrap — thin herb bandages only | the tug — a charm-string pull at the neckline | the possession — ridden by her familiar |
| `seer/soothsayer` | scrying — mirror-bright skin | the reading — a veil gone translucent, a bra peek | the puppet — strung on fate's own wires |


---

## The 57 invented lewd tags (†)

Made up for this pass; none is in the dictionaries or booru. Every D/E/F design names at least one.

`giltglass bodice`, `alms-lean`, `gild-lacquer`, `plate-oil sheen`, `gap-rivet`, `gate-stocks`, `rainweld wrap`, `strap-slip`, `ram-clamp rig`, `nightglass glaze`, `vial-fumble`, `bloom-trap`, `ooze gown`, `dirge-step`, `dirge-wraps`, `pollen dusting`, `cap-lift`, `brood sac`, `vitrail panel`, `communion slip`, `jointline dollhide`, `vintage soak`, `toast-line`, `queen's lead`, `pelt-print paint`, `hip-vent stitch`, `trophy mount`, `ember-dust sheen`, `cinder burn-holes`, `ember brand`, `parade mesh`, `order-undone`, `drill-baton rig`, `heat-sheer`, `gust-lift`, `pegasus bridle`, `cloister lace`, `rule-open`, `rosary suspension`, `apron-only drape`, `herb dressing`, `vow-lock`, `wax-frost glaze`, `rise-hem`, `bliss-bind`, `ash-sheer sackcloth`, `sackcloth rent`, `penance chains`, `card-sharp net`, `confidence trick`, `ante-up rig`, `herb-wrap binds`, `charm-string`, `familiar-ridden`, `scrying static`, `veil-reading`, `fate-puppet`

## Real lewd tags used

From the dictionaries or common booru vocabulary (e.g. `covered nipples`, `plunging neckline`,
`downblouse`, `armpit peek`, `micro bikini`, `crotchless panties`, `see-through clothes`, `harness`, `o-ring top`,
`corset`, `collar`, `leash`, `bound`, `impossible clothes`). Gendered by sex where it matters.

**Open for Noodle:** which of these become the real outfit lines, and whether the invented tags earn a place in
the dictionaries.